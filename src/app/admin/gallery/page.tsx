'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, ImageUp, Trash2 } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { Button, Card, CardHeader, Field, PageHeader, Switch, inputCls } from '@/components/admin/ui';
import MigrationNotice from '@/components/admin/MigrationNotice';
import { GalleryItem } from '@/types';
import { errorMessage, isMissingTable, removeSiteImage, uploadSiteImage } from '@/lib/admin-images';

const MIGRATION = 'supabase/migrations/20261125_site_images_gallery.sql';

type Row = GalleryItem & { sort_order: number; is_published: boolean };

const CATEGORIES: { value: GalleryItem['category']; label: string }[] = [
  { value: 'embroidery', label: 'Embroidery close-up' },
  { value: 'craft', label: 'Craft & technique' },
  { value: 'styled', label: 'Styled look' },
  { value: 'swatch', label: 'Fabric swatch' },
  { value: 'workshop', label: 'Workshop' },
];
const ASPECTS: { value: GalleryItem['aspect']; label: string }[] = [
  { value: 'tall', label: 'Tall (portrait)' },
  { value: 'square', label: 'Square' },
  { value: 'wide', label: 'Wide (landscape)' },
];

export default function GalleryAdminPage() {
  const { supabase, toast, confirm, revalidateSite } = useAdmin();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [busy, setBusy] = useState(false);
  const addRef = useRef<HTMLInputElement | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) {
      if (isMissingTable(error)) setMissing(true);
      else toast('error', error.message);
    } else {
      setMissing(false);
      setRows((data || []) as Row[]);
    }
    setLoading(false);
  }, [supabase, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const addPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      let order = rows.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 0;
      for (const file of Array.from(files)) {
        const image = await uploadSiteImage(supabase, file, 'gallery');
        const title = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
        const { error } = await supabase
          .from('gallery_items')
          .insert({ title, image, category: 'embroidery', aspect: 'square', sort_order: order++, is_published: true });
        if (error) {
          await removeSiteImage(supabase, image);
          throw error;
        }
      }
      await load();
      await revalidateSite();
      toast('success', 'Photos added to the gallery. Add a title and caption for each.');
    } catch (err) {
      toast('error', errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const update = async (id: string, patch: Partial<Row>, quiet = false) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    const { error } = await supabase.from('gallery_items').update(patch).eq('id', id);
    if (error) {
      toast('error', error.message);
      await load();
      return;
    }
    await revalidateSite();
    if (!quiet) toast('success', 'Gallery updated.');
  };

  const replaceImage = async (row: Row, file: File) => {
    setBusy(true);
    try {
      const image = await uploadSiteImage(supabase, file, 'gallery');
      const { error } = await supabase.from('gallery_items').update({ image }).eq('id', row.id);
      if (error) {
        await removeSiteImage(supabase, image);
        throw error;
      }
      await removeSiteImage(supabase, row.image);
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, image } : r)));
      await revalidateSite();
      toast('success', 'Photo replaced.');
    } catch (err) {
      toast('error', errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (row: Row) => {
    if (!(await confirm({ title: `Delete “${row.title || 'this photo'}” from the gallery?`, confirmLabel: 'Delete', danger: true }))) return;
    const { error } = await supabase.from('gallery_items').delete().eq('id', row.id);
    if (error) return toast('error', error.message);
    await removeSiteImage(supabase, row.image);
    setRows((rs) => rs.filter((r) => r.id !== row.id));
    await revalidateSite();
    toast('success', 'Photo deleted.');
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[idx], next[j]] = [next[j], next[idx]];
    const renumbered = next.map((r, i) => ({ ...r, sort_order: i }));
    setRows(renumbered);
    const results = await Promise.all(
      renumbered.map((r) => supabase.from('gallery_items').update({ sort_order: r.sort_order }).eq('id', r.id))
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) {
      toast('error', failed.error.message);
      await load();
      return;
    }
    await revalidateSite();
  };

  const published = rows.filter((r) => r.is_published).length;

  return (
    <>
      <PageHeader
        title="Gallery"
        description={
          published
            ? `${published} photo${published === 1 ? '' : 's'} showing on the website’s Gallery page.`
            : 'The Gallery page shows its built-in sample photos until you publish your first photo here.'
        }
        actions={
          <Button type="button" variant="primary" disabled={busy || loading || missing} onClick={() => addRef.current?.click()}>
            <ImagePlus className="h-4 w-4" /> {busy ? 'Uploading…' : 'Add photos'}
          </Button>
        }
      />
      <input
        ref={addRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          addPhotos(e.target.files);
          e.target.value = '';
        }}
      />
      {missing && <MigrationNotice file={MIGRATION} />}

      {!loading && !missing && rows.length === 0 && (
        <Card>
          <div className="p-10 text-center text-sm text-stone-500">
            No gallery photos yet. Click <strong>Add photos</strong> to upload workshop, embroidery and styled shots.
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {rows.map((row, idx) => (
          <GalleryRow
            key={row.id}
            row={row}
            first={idx === 0}
            last={idx === rows.length - 1}
            disabled={busy}
            onSave={(patch) => update(row.id, patch)}
            onToggle={(v) => update(row.id, { is_published: v }, true)}
            onReplace={(f) => replaceImage(row, f)}
            onDelete={() => remove(row)}
            onMove={(d) => move(idx, d)}
          />
        ))}
      </div>
    </>
  );
}

function GalleryRow({
  row,
  first,
  last,
  disabled,
  onSave,
  onToggle,
  onReplace,
  onDelete,
  onMove,
}: {
  row: Row;
  first: boolean;
  last: boolean;
  disabled: boolean;
  onSave: (patch: Partial<Row>) => void;
  onToggle: (v: boolean) => void;
  onReplace: (f: File) => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const [draft, setDraft] = useState({
    title: row.title,
    tag: row.tag,
    caption: row.caption,
    category: row.category,
    aspect: row.aspect,
  });
  const fileRef = useRef<HTMLInputElement | null>(null);
  const dirty =
    draft.title !== row.title ||
    draft.tag !== row.tag ||
    draft.caption !== row.caption ||
    draft.category !== row.category ||
    draft.aspect !== row.aspect;

  return (
    <Card className={row.is_published ? '' : 'opacity-70'}>
      <CardHeader
        title={row.title || 'Untitled photo'}
        description={row.is_published ? 'Showing on the website' : 'Hidden from the website'}
        action={
          <div className="flex items-center gap-1">
            <Button type="button" variant="ghost" disabled={first || disabled} onClick={() => onMove(-1)} aria-label="Move up">
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" disabled={last || disabled} onClick={() => onMove(1)} aria-label="Move down">
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Switch checked={row.is_published} onChange={onToggle} label="Show on website" disabled={disabled} />
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-4">
        <div>
          <div className="aspect-square overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
            <img src={row.image} alt={row.title} className="h-full w-full object-cover" />
          </div>
          <div className="mt-2 flex gap-2">
            <Button type="button" disabled={disabled} onClick={() => fileRef.current?.click()} className="flex-1">
              <ImageUp className="h-4 w-4" /> Replace
            </Button>
            <Button type="button" variant="danger" disabled={disabled} onClick={onDelete} aria-label="Delete photo">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = '';
              if (f) onReplace(f);
            }}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-3">
          <Field label="Title">
            <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Tag" hint="Small label, e.g. “Macro Embroidery”">
            <input value={draft.tag} onChange={(e) => setDraft({ ...draft, tag: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Category" hint="Used by the Gallery page filters">
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value as GalleryItem['category'] })}
              className={inputCls}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Shape on the page">
            <select
              value={draft.aspect}
              onChange={(e) => setDraft({ ...draft, aspect: e.target.value as GalleryItem['aspect'] })}
              className={inputCls}
            >
              {ASPECTS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Caption" className="sm:col-span-2">
            <textarea rows={2} value={draft.caption} onChange={(e) => setDraft({ ...draft, caption: e.target.value })} className={inputCls} />
          </Field>
          <div className="sm:col-span-2 flex justify-end">
            <Button type="button" variant="primary" disabled={!dirty || disabled} onClick={() => onSave(draft)}>
              Save details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
