'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ImagePlus, Star, Trash2, ChevronLeft, ChevronRight, ExternalLink, Check } from 'lucide-react';
import { useAdmin } from './AdminProvider';
import { Button, Card, CardHeader, Field, Switch, inputCls, cx } from './ui';
import {
  AdminFabric,
  CATEGORY_LABELS,
  COLOR_FAMILY_LABELS,
  EMBROIDERY_LABELS,
  fabricToRow,
  idFromCode,
  PHOTO_SLOTS,
  photoSlotLabel,
} from '@/lib/fabrics';
import { FABRIC_IMAGES_BUCKET } from '@/lib/supabase/client';
import { compressImage, errorMessage, makeSwatchTile, storagePathFromUrl } from '@/lib/admin-images';
import SwatchTilePicker, { PendingTile } from './SwatchTilePicker';
import { FabricItem } from '@/types';

const PRESET_COLORS = [
  { name: 'Sandstone Ivory', hex: '#F4EFE6' },
  { name: 'Antique Gold', hex: '#AD8A53' },
  { name: 'Imperial Burgundy', hex: '#713B43' },
  { name: 'Midnight Navy', hex: '#1C2541' },
  { name: 'Royal Emerald', hex: '#1C3B2B' },
  { name: 'Charcoal Noir', hex: '#252321' },
  { name: 'Dusty Rose', hex: '#C49A9A' },
  { name: 'Pearl Off-White', hex: '#FAF8F3' },
];

type Photo = { key: string; url: string; blob?: Blob };

interface FormState {
  code: string;
  name: string;
  category: FabricItem['category'];
  embroideryType: FabricItem['embroideryType'];
  colorFamily: FabricItem['colorFamily'];
  baseFabric: string;
  width: string;
  moq: string;
  suitableFor: string;
  description: string;
  artisanStory: string;
  readyStock: boolean;
  featured: boolean;
  exclusive: boolean;
  isPublished: boolean;
  sortOrder: number;
  colors: { name: string; hex: string }[];
}

function initialState(f: AdminFabric | null): FormState {
  return {
    code: f?.code || '',
    name: f?.name || '',
    category: f?.category || 'sherwani',
    embroideryType: f?.embroideryType || 'zari',
    colorFamily: f?.colorFamily || 'ivory',
    baseFabric: f?.baseFabric || '',
    width: f?.width || '44 Inches',
    moq: f?.moq || '25 Metres',
    suitableFor: (f?.suitableFor || []).join(', '),
    description: f?.description || '',
    artisanStory: f?.artisanStory || '',
    readyStock: f?.readyStock ?? true,
    featured: f?.featured ?? false,
    exclusive: f?.exclusive ?? false,
    isPublished: f?.isPublished ?? true,
    sortOrder: f?.sortOrder ?? 0,
    colors: f?.availableColors?.length ? f.availableColors : [PRESET_COLORS[0]],
  };
}

export default function FabricForm({ initial }: { initial: AdminFabric | null }) {
  const { supabase, toast, confirm, revalidateSite } = useAdmin();
  const router = useRouter();
  const isEdit = !!initial;

  const startState = useMemo(() => initialState(initial), [initial]);
  const startPhotos = useMemo<Photo[]>(
    () =>
      (initial?.images?.length ? initial.images : initial?.mainImage ? [initial.mainImage] : []).map((url, i) => ({
        key: `existing-${i}`,
        url,
      })),
    [initial]
  );

  const [form, setForm] = useState<FormState>(startState);
  const [photos, setPhotos] = useState<Photo[]>(startPhotos);
  const [removedUrls, setRemovedUrls] = useState<string[]>([]);
  const [pendingTile, setPendingTile] = useState<PendingTile | null>(null);
  const [customName, setCustomName] = useState('');
  const [customHex, setCustomHex] = useState('#713B43');
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const dirty =
    JSON.stringify(form) !== JSON.stringify(startState) ||
    photos.map((p) => p.url).join('|') !== startPhotos.map((p) => p.url).join('|') ||
    !!pendingTile;

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    if (!dirty || saving) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty, saving]);

  // Free preview object URLs on unmount.
  const photosRef = useRef(photos);
  photosRef.current = photos;
  useEffect(() => () => photosRef.current.forEach((p) => p.blob && URL.revokeObjectURL(p.url)), []);

  const leave = async () => {
    if (dirty && !(await confirm({ title: 'Discard unsaved changes?', confirmLabel: 'Discard', danger: true }))) return;
    router.push('/admin/products');
  };

  // ---- photos -----------------------------------------------------------
  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setProcessing(true);
    setError(null);
    try {
      const imgs = Array.from(files).filter((f) => /^image\/(jpeg|png|webp)$/.test(f.type));
      if (!imgs.length) throw new Error('Please choose JPG, PNG or WEBP images.');
      const items = await Promise.all(
        imgs.map(async (file, i) => {
          const blob = await compressImage(file);
          return { key: `new-${Date.now()}-${i}`, url: URL.createObjectURL(blob), blob };
        })
      );
      setPhotos((p) => [...p, ...items]);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setProcessing(false);
    }
  };

  const removePhoto = (idx: number) => {
    const p = photos[idx];
    if (p.blob) URL.revokeObjectURL(p.url);
    else setRemovedUrls((r) => [...r, p.url]);
    setPhotos((all) => all.filter((_, i) => i !== idx));
  };

  const movePhoto = (idx: number, dir: -1 | 1) =>
    setPhotos((all) => {
      const j = idx + dir;
      if (j < 0 || j >= all.length) return all;
      const next = [...all];
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });

  const toggleColor = (c: { name: string; hex: string }) =>
    set('colors', form.colors.some((x) => x.name === c.name) ? form.colors.filter((x) => x.name !== c.name) : [...form.colors, c]);

  // ---- save -------------------------------------------------------------
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const code = form.code.trim().toUpperCase();
    const id = isEdit ? initial!.id : idFromCode(code);
    if (!id) return setError('Enter a design code.');
    if (!photos.length) return setError('Add at least one photo.');
    if (!form.colors.length) return setError('Choose at least one colour.');

    setSaving(true);
    const uploaded: string[] = [];
    try {
      const urls: string[] = [];
      for (const p of photos) {
        if (!p.blob) {
          urls.push(p.url);
          continue;
        }
        const path = `${id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
        const { error: upErr } = await supabase.storage
          .from(FABRIC_IMAGES_BUCKET)
          .upload(path, p.blob, { contentType: 'image/jpeg', cacheControl: '31536000' });
        if (upErr) throw upErr;
        uploaded.push(path);
        urls.push(supabase.storage.from(FABRIC_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl);
      }

      // Garment-preview tile: the admin's pick, or an automatic one from the cover photo.
      let swatchTile = initial?.swatchTile || '';
      let tileBlob: Blob | null = pendingTile?.blob ?? null;
      if (!tileBlob && !swatchTile) {
        try {
          tileBlob = await makeSwatchTile(photos[0].url);
        } catch {
          tileBlob = null; // not fatal: the site falls back to the cover photo
        }
      }
      if (tileBlob) {
        const tilePath = `${id}/tile-${Date.now()}.jpg`;
        const { error: tileErr } = await supabase.storage
          .from(FABRIC_IMAGES_BUCKET)
          .upload(tilePath, tileBlob, { contentType: 'image/jpeg', cacheControl: '31536000' });
        if (tileErr) throw tileErr;
        uploaded.push(tilePath);
        swatchTile = supabase.storage.from(FABRIC_IMAGES_BUCKET).getPublicUrl(tilePath).data.publicUrl;
      }
      const replacedTile = tileBlob && initial?.swatchTile ? [initial.swatchTile] : [];

      const row = fabricToRow({
        id,
        code,
        name: form.name.trim(),
        category: form.category,
        categoryLabel: CATEGORY_LABELS[form.category],
        embroideryType: form.embroideryType,
        embroideryTypeLabel: EMBROIDERY_LABELS[form.embroideryType],
        baseFabric: form.baseFabric.trim(),
        color: form.colors.map((c) => c.name).join(' / '),
        colorFamily: form.colorFamily,
        width: form.width.trim(),
        suitableFor: form.suitableFor.split(',').map((s) => s.trim()).filter(Boolean),
        moq: form.moq.trim(),
        readyStock: form.readyStock,
        featured: form.featured,
        exclusive: form.exclusive,
        description: form.description.trim(),
        artisanStory: form.artisanStory.trim(),
        mainImage: urls[0],
        closeUpImage: '',
        macroImage: '',
        backsideImage: '',
        styledModelImage: '',
        images: urls,
        swatchTile,
        availableColors: form.colors,
        isPublished: form.isPublished,
        sortOrder: Number(form.sortOrder) || 0,
      });

      // .select() returns the saved row, so a write silently blocked by permissions (0 rows) is caught too.
      const write = (r: Partial<typeof row>) =>
        isEdit
          ? supabase.from('fabrics').update(r).eq('id', id).select('id,is_exclusive')
          : supabase.from('fabrics').insert(r).select('id,is_exclusive');
      let { data: saved, error: dbErr } = await write(row);
      let tileColumnMissing = false;
      // Database without the swatch_tile column yet (migration not run): save everything else.
      if (dbErr && /swatch_tile/.test(dbErr.message || '')) {
        tileColumnMissing = true;
        const { swatch_tile: _omit, ...rest } = row;
        ({ data: saved, error: dbErr } = await write(rest));
      }
      if (dbErr) {
        if (dbErr.code === '23505') throw new Error(`Design code ${code} already exists. Use a different code.`);
        if (/is_exclusive/.test(dbErr.message || '')) {
          throw new Error(
            `Exclusive could not be saved (${dbErr.message}). In Supabase → SQL Editor run supabase/migrations/20261126_exclusive.sql, then save again.`
          );
        }
        throw dbErr;
      }
      if (!saved?.length) {
        throw new Error('The product was not saved. Your admin session may have expired: sign out, sign in again and retry.');
      }
      // Confirm the database really stored the Exclusive choice.
      if (!!saved[0].is_exclusive !== form.exclusive) {
        throw new Error('The product saved, but the Exclusive switch did not. Please try again; if it repeats, tell your developer.');
      }

      // If the tile could not be stored, remove its upload instead of the old tile.
      const orphanTile = tileColumnMissing && tileBlob ? [swatchTile] : [];
      const stale = [...removedUrls, ...(tileColumnMissing ? [] : replacedTile), ...orphanTile].map(storagePathFromUrl).filter((p): p is string => !!p);
      if (stale.length) await supabase.storage.from(FABRIC_IMAGES_BUCKET).remove(stale);

      await revalidateSite();
      toast('success', isEdit ? `${code} saved.` : `${code} added to the catalogue.`);
      if (tileColumnMissing) {
        toast(
          'error',
          'Garment preview tile not saved: run supabase/migrations/20261125_swatch_tile.sql in the Supabase SQL Editor once.'
        );
      }
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      if (uploaded.length) await supabase.storage.from(FABRIC_IMAGES_BUCKET).remove(uploaded);
      setError(errorMessage(err));
      setSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <form onSubmit={save}>
      {/* Sticky action bar */}
      <div className="sticky top-16 z-10 -mx-4 mb-6 flex items-center gap-3 border-b border-stone-200 bg-stone-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <button type="button" onClick={leave} className="rounded-md p-1.5 text-stone-500 hover:bg-stone-200" aria-label="Back to products">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold text-stone-900">{isEdit ? initial!.name : 'Add product'}</h1>
          {isEdit && <p className="font-mono text-xs text-stone-500">{initial!.code}</p>}
        </div>
        {dirty && !saving && <span className="hidden text-xs text-amber-700 sm:inline">Unsaved changes</span>}
        {isEdit && (
          <a
            href={`/collections/${initial!.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-md px-3 py-2 text-sm text-stone-600 hover:bg-stone-200 sm:inline-flex"
          >
            <ExternalLink className="h-4 w-4" /> View
          </a>
        )}
        <Button type="button" variant="secondary" onClick={leave} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={saving || processing || (isEdit && !dirty)}>
          {saving ? 'Saving…' : isEdit ? 'Save' : 'Add product'}
        </Button>
      </div>

      {error && (
        <p role="alert" className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Product details" />
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              <Field label="Design code" required hint={isEdit ? 'Codes can’t be changed after creation.' : 'Used in the product URL, e.g. KF-ZAR-909'}>
                <input
                  required
                  disabled={isEdit}
                  value={form.code}
                  onChange={(e) => set('code', e.target.value)}
                  placeholder="KF-ZAR-909"
                  className={cx(inputCls, 'font-mono uppercase')}
                />
              </Field>
              <Field label="Product name" required>
                <input required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Imperial Floral Bullion" className={inputCls} />
              </Field>
              <Field label="Description" className="sm:col-span-2">
                <textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Craft story" hint="Optional — shown on the product page." className="sm:col-span-2">
                <textarea rows={2} value={form.artisanStory} onChange={(e) => set('artisanStory', e.target.value)} className={inputCls} />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Photos"
              description="Each position has a label on the website. Use the arrows to put each photo in the right position. Empty positions are simply not shown."
            />
            <div className="p-5">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  addFiles(e.dataTransfer.files);
                }}
                className="grid grid-cols-2 gap-3 sm:grid-cols-4"
              >
                {photos.map((p, idx) => (
                  <div
                    key={p.key}
                    className={cx(
                      'group relative aspect-square overflow-hidden rounded-lg border bg-stone-100',
                      idx === 0 ? 'border-[#AD8A53] ring-2 ring-[#AD8A53]/40' : 'border-stone-200'
                    )}
                  >
                    <img src={p.url} alt={photoSlotLabel(idx)} className="h-full w-full object-cover" />
                    {/* Slot label: the name this photo gets on the website's product page */}
                    <span
                      className={cx(
                        'absolute left-2 top-2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-white shadow',
                        idx === 0 ? 'bg-[#30241F]' : idx < PHOTO_SLOTS.length ? 'bg-stone-800/80' : 'bg-stone-500/80'
                      )}
                    >
                      {idx === 0 ? <Star className="h-3 w-3 fill-white" /> : <span className="opacity-70">{idx + 1}</span>}
                      {photoSlotLabel(idx)}
                      {idx === 0 && <span className="font-normal opacity-70">· Cover</span>}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                      <div className="flex gap-1">
                        <IconBtn label="Move left" onClick={() => movePhoto(idx, -1)} disabled={idx === 0}>
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </IconBtn>
                        <IconBtn label="Move right" onClick={() => movePhoto(idx, 1)} disabled={idx === photos.length - 1}>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </IconBtn>
                      </div>
                      <IconBtn label="Remove photo" onClick={() => removePhoto(idx)} danger>
                        <Trash2 className="h-3.5 w-3.5" />
                      </IconBtn>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-stone-300 text-stone-500 hover:border-[#AD8A53] hover:text-[#7a5d30]"
                >
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-xs font-medium">{processing ? 'Optimising…' : 'Add photos'}</span>
                  <span className="text-[10px]">
                    {photos.length < PHOTO_SLOTS.length ? `Next: ${photoSlotLabel(photos.length)}` : 'or drag & drop'}
                  </span>
                </button>
              </div>

              {/* Which slots are filled; empty ones are not shown on the website */}
              <div className="mt-4 flex flex-wrap gap-2">
                {PHOTO_SLOTS.map((slot, i) => {
                  const filled = i < photos.length;
                  return (
                    <span
                      key={slot.label}
                      title={slot.hint}
                      className={cx(
                        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs',
                        filled ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-stone-200 bg-stone-50 text-stone-500'
                      )}
                    >
                      {filled ? <Check className="h-3 w-3" /> : <span className="h-3 w-3 rounded-full border border-dashed border-stone-400" />}
                      {i + 1}. {slot.label}
                    </span>
                  );
                })}
              </div>
              {photos.length < PHOTO_SLOTS.length && (
                <p className="mt-2 text-xs text-stone-500">
                  Not shown on the website yet: {PHOTO_SLOTS.slice(photos.length).map((s) => s.label).join(', ')}.
                </p>
              )}
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = '';
                }}
              />
              <p className="mt-3 text-xs text-stone-500">JPG, PNG or WEBP. Photos are resized to 1600px automatically before upload.</p>
            </div>
          </Card>

          <SwatchTilePicker
            photos={photos}
            currentTile={initial?.swatchTile}
            pending={pendingTile}
            onChange={setPendingTile}
          />

          <Card>
            <CardHeader title="Colours" description="Shades this design is available in." />
            <div className="space-y-4 p-5">
              <div className="flex flex-wrap gap-2">
                {[...PRESET_COLORS, ...form.colors.filter((c) => !PRESET_COLORS.some((p) => p.name === c.name))].map((c) => {
                  const on = form.colors.some((x) => x.name === c.name);
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => toggleColor(c)}
                      aria-pressed={on}
                      className={cx(
                        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm',
                        on ? 'border-[#AD8A53] bg-[#AD8A53]/10 font-medium text-stone-900' : 'border-stone-300 text-stone-500 hover:border-stone-400'
                      )}
                    >
                      <span className="h-3.5 w-3.5 rounded-full border border-black/15" style={{ backgroundColor: c.hex }} />
                      {c.name}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customHex}
                  onChange={(e) => setCustomHex(e.target.value)}
                  className="h-9 w-10 cursor-pointer rounded border border-stone-300 bg-white p-1"
                  aria-label="Custom colour"
                />
                <input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Custom shade name, e.g. Rani Pink" className={inputCls} />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    if (!customName.trim()) return;
                    set('colors', [...form.colors, { name: customName.trim(), hex: customHex }]);
                    setCustomName('');
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Visibility" />
            <div className="space-y-4 p-5">
              <ToggleRow label="Visible on website" hint="Hidden products stay in admin only." checked={form.isPublished} onChange={(v) => set('isPublished', v)} />
              <ToggleRow label="Featured on home page" hint="Listed in the Featured Designs section on the home page." checked={form.featured} onChange={(v) => set('featured', v)} />
              <ToggleRow
                label="Exclusive"
                hint="Shows a gold “Exclusive” badge on the website. Use for premium or limited designs."
                checked={form.exclusive}
                onChange={(v) => set('exclusive', v)}
              />
              <ToggleRow label="Ready stock" hint="Off = made to order." checked={form.readyStock} onChange={(v) => set('readyStock', v)} />
              <Field label="Sort order" hint="Lower numbers appear first.">
                <input type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', Number(e.target.value))} className={inputCls} />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Organisation" />
            <div className="space-y-4 p-5">
              <Field label="Category">
                <select value={form.category} onChange={(e) => set('category', e.target.value as FormState['category'])} className={inputCls}>
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Embroidery type">
                <select value={form.embroideryType} onChange={(e) => set('embroideryType', e.target.value as FormState['embroideryType'])} className={inputCls}>
                  {Object.entries(EMBROIDERY_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Colour family" hint="Used by the colour filter on the website.">
                <select value={form.colorFamily} onChange={(e) => set('colorFamily', e.target.value as FormState['colorFamily'])} className={inputCls}>
                  {Object.entries(COLOR_FAMILY_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Specifications" />
            <div className="space-y-4 p-5">
              <Field label="Base fabric" required>
                <input required value={form.baseFabric} onChange={(e) => set('baseFabric', e.target.value)} placeholder="Pure Silk Organza" className={inputCls} />
              </Field>
              <Field label="Width">
                <input value={form.width} onChange={(e) => set('width', e.target.value)} placeholder="44 Inches" className={inputCls} />
              </Field>
              <Field label="Minimum order (MOQ)" required>
                <input required value={form.moq} onChange={(e) => set('moq', e.target.value)} placeholder="25 Metres" className={inputCls} />
              </Field>
              <Field label="Suitable for" hint="Comma separated, e.g. Sherwani, Achkan">
                <input value={form.suitableFor} onChange={(e) => set('suitableFor', e.target.value)} className={inputCls} />
              </Field>
            </div>
          </Card>

          {isEdit && (
            <p className="px-1 text-xs text-stone-500">
              Need to remove this product? Delete it from the{' '}
              <Link href="/admin/products" className="underline">
                products list
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </form>
  );
}

function ToggleRow({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-stone-800">{label}</p>
        {hint && <p className="text-xs text-stone-500">{hint}</p>}
      </div>
      <Switch label={label} checked={checked} onChange={onChange} />
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cx(
        'rounded p-1 text-white disabled:opacity-30',
        danger ? 'bg-red-600 hover:bg-red-700' : 'bg-black/50 hover:bg-black/70'
      )}
    >
      {children}
    </button>
  );
}
