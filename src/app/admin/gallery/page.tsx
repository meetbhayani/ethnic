'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Download,
  EyeOff,
  ImagePlus,
  ImageUp,
  Lightbulb,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { Button, Card, Field, LoadingBlock, PageHeader, Switch, cx, inputCls } from '@/components/admin/ui';
import MigrationNotice from '@/components/admin/MigrationNotice';
import { GalleryItem } from '@/types';
import { GALLERY_DATA } from '@/data/gallery';
import { GALLERY_DONTS, GALLERY_SECTIONS, GallerySection, GallerySectionId, sectionOf } from '@/lib/gallery-sections';
import { errorMessage, isMissingTable, removeSiteImage, uploadSiteImage } from '@/lib/admin-images';

const MIGRATION = 'supabase/migrations/20261125_site_images_gallery.sql';

type Row = GalleryItem & { sort_order: number; is_published: boolean };

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
  const [tab, setTab] = useState<GallerySectionId>(GALLERY_SECTIONS[0].id);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const nextOrder = () => (rows.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 0);

  const addPhotos = async (section: GallerySection, files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      let order = nextOrder();
      for (const file of Array.from(files)) {
        const image = await uploadSiteImage(supabase, file, 'gallery');
        const title = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
        const { error } = await supabase.from('gallery_items').insert({
          title,
          image,
          tag: section.tag,
          category: section.id,
          aspect: section.defaultAspect,
          sort_order: order++,
          is_published: true,
        });
        if (error) {
          await removeSiteImage(supabase, image);
          throw error;
        }
      }
      await load();
      await revalidateSite();
      toast('success', `Photos added to ${section.label}. Click a photo to add its title and caption.`);
    } catch (err) {
      toast('error', errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  /** Copy the website's built-in sample photos into the table so they can be edited, reordered or removed. */
  const importBuiltIn = async () => {
    if (
      rows.length &&
      !(await confirm({ title: 'Add the built-in sample photos to the end of each section?', confirmLabel: 'Add photos' }))
    )
      return;
    setBusy(true);
    try {
      const start = nextOrder();
      const { error } = await supabase.from('gallery_items').insert(
        GALLERY_DATA.map(({ title, tag, category, image, caption, aspect }, i) => ({
          title,
          tag,
          category: sectionOf(category),
          image,
          caption,
          aspect,
          sort_order: start + i,
          is_published: true,
        }))
      );
      if (error) throw error;
      await load();
      await revalidateSite();
      toast('success', 'Built-in photos imported. Replace them with your own photos when you can.');
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
      return false;
    }
    await revalidateSite();
    if (!quiet) toast('success', 'Photo saved.');
    return true;
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
    setEditingId(null);
    await revalidateSite();
    toast('success', 'Photo deleted.');
  };

  /** Move a photo earlier or later within its own section. */
  const move = async (row: Row, dir: -1 | 1) => {
    const inSection = rows.filter((r) => sectionOf(r.category) === sectionOf(row.category));
    const other = inSection[inSection.indexOf(row) + dir];
    if (!other) return;
    const next = [...rows];
    const a = next.indexOf(row);
    const b = next.indexOf(other);
    [next[a], next[b]] = [next[b], next[a]];
    const before = new Map(rows.map((r) => [r.id, r.sort_order]));
    const renumbered = next.map((r, i) => ({ ...r, sort_order: i }));
    const changed = renumbered.filter((r) => before.get(r.id) !== r.sort_order);
    setRows(renumbered);
    const results = await Promise.all(
      changed.map((r) => supabase.from('gallery_items').update({ sort_order: r.sort_order }).eq('id', r.id))
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) {
      toast('error', failed.error.message);
      await load();
      return;
    }
    await revalidateSite();
  };

  const section = GALLERY_SECTIONS.find((s) => s.id === tab) ?? GALLERY_SECTIONS[0];
  const sectionRows = rows.filter((r) => sectionOf(r.category) === section.id);
  const editing = rows.find((r) => r.id === editingId) || null;
  const published = rows.filter((r) => r.is_published).length;

  return (
    <>
      <PageHeader
        title="Gallery"
        description={
          published
            ? `${published} photo${published === 1 ? '' : 's'} showing on the website’s Gallery page.`
            : `The website shows ${GALLERY_DATA.length} built-in sample photos until you publish your first photo here.`
        }
        actions={
          <Button type="button" disabled={busy || loading || missing} onClick={importBuiltIn}>
            <Download className="h-4 w-4" /> Import built-in photos
          </Button>
        }
      />
      {missing && <MigrationNotice file={MIGRATION} />}
      {loading && <LoadingBlock />}

      {!loading && !missing && (
        <Card>
          {/* Section tabs */}
          <div className="flex overflow-x-auto border-b border-stone-200 px-2" role="tablist">
            {GALLERY_SECTIONS.map((s) => {
              const showing = rows.filter((r) => sectionOf(r.category) === s.id && r.is_published).length;
              const active = s.id === tab;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(s.id)}
                  className={cx(
                    '-mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 py-3.5 text-sm font-medium transition-colors',
                    active ? 'border-[#30241F] text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-800'
                  )}
                >
                  {s.label}
                  <span
                    className={cx(
                      'rounded-full px-2 py-0.5 text-xs font-semibold',
                      showing >= s.target[0] ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    )}
                  >
                    {showing}
                  </span>
                </button>
              );
            })}
          </div>

          <SectionPanel
            key={section.id}
            section={section}
            rows={sectionRows}
            busy={busy}
            onAdd={(files) => addPhotos(section, files)}
            onEdit={(row) => setEditingId(row.id)}
            onToggle={(row, v) => update(row.id, { is_published: v }, true)}
            onMove={move}
          />
        </Card>
      )}

      {editing && (
        <EditDrawer
          key={editing.id}
          row={editing}
          busy={busy}
          onClose={() => setEditingId(null)}
          onSave={async (patch) => {
            if (await update(editing.id, patch)) {
              setEditingId(null);
              const moved = patch.category && patch.category !== sectionOf(editing.category);
              if (moved) setTab(patch.category as GallerySectionId);
            }
          }}
          onReplace={(f) => replaceImage(editing, f)}
          onDelete={() => remove(editing)}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// One tab: summary, collapsible photo guide, photo grid
// ---------------------------------------------------------------------------

function SectionPanel({
  section,
  rows,
  busy,
  onAdd,
  onEdit,
  onToggle,
  onMove,
}: {
  section: GallerySection;
  rows: Row[];
  busy: boolean;
  onAdd: (files: FileList | null) => void;
  onEdit: (row: Row) => void;
  onToggle: (row: Row, v: boolean) => void;
  onMove: (row: Row, dir: -1 | 1) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [guideOpen, setGuideOpen] = useState(rows.length === 0);
  const showing = rows.filter((r) => r.is_published).length;
  const [min, ideal] = section.target;
  const pct = Math.min(100, Math.round((showing / ideal) * 100));

  return (
    <div>
      {/* Summary */}
      <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-stone-600">{section.purpose}</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-stone-200">
              <div
                className={cx('h-full rounded-full', showing >= min ? 'bg-emerald-500' : 'bg-amber-500')}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-stone-500">
              {showing} showing · aim for {min}–{ideal}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button type="button" variant="ghost" onClick={() => setGuideOpen((o) => !o)} aria-expanded={guideOpen}>
            <Lightbulb className="h-4 w-4 text-amber-600" /> Photo guide
            <ChevronDown className={cx('h-4 w-4 transition-transform', guideOpen && 'rotate-180')} />
          </Button>
          <Button type="button" variant="primary" disabled={busy} onClick={() => fileRef.current?.click()}>
            <ImagePlus className="h-4 w-4" /> {busy ? 'Working…' : 'Add photos'}
          </Button>
        </div>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            onAdd(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {/* Photo guide */}
      {guideOpen && (
        <div className="mx-5 mb-5 grid gap-5 rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm md:grid-cols-3">
          <GuideList title="What to photograph" items={section.shots} />
          <GuideList title="Tips" items={section.tips} />
          <GuideList title="Don’t upload" items={GALLERY_DONTS} />
        </div>
      )}

      {/* Photo grid */}
      <div className="grid grid-cols-2 gap-4 border-t border-stone-200 p-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {rows.map((row, idx) => (
          <PhotoCard
            key={row.id}
            row={row}
            position={idx + 1}
            first={idx === 0}
            last={idx === rows.length - 1}
            busy={busy}
            onEdit={() => onEdit(row)}
            onToggle={(v) => onToggle(row, v)}
            onMove={(d) => onMove(row, d)}
          />
        ))}
        <button
          type="button"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          className={cx(
            'flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-stone-300 text-sm text-stone-500',
            'transition-colors hover:border-[#AD8A53] hover:text-stone-800 disabled:opacity-50',
            rows.length === 0 && 'col-span-2 sm:col-span-3 lg:col-span-4 xl:col-span-5 aspect-auto py-14'
          )}
        >
          <ImagePlus className="h-6 w-6" />
          {rows.length === 0 ? `No photos in ${section.label} yet. Click to upload.` : 'Add photos'}
        </button>
      </div>
    </div>
  );
}

function GuideList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-4 text-stone-700">
        {items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}

function PhotoCard({
  row,
  position,
  first,
  last,
  busy,
  onEdit,
  onToggle,
  onMove,
}: {
  row: Row;
  position: number;
  first: boolean;
  last: boolean;
  busy: boolean;
  onEdit: () => void;
  onToggle: (v: boolean) => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const needsDetails = !row.title.trim() || !row.caption.trim();

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white transition-shadow hover:shadow-md">
      <button type="button" onClick={onEdit} className="relative block aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={row.image}
          alt={row.title}
          className={cx('h-full w-full object-cover transition-transform duration-300 group-hover:scale-105', !row.is_published && 'opacity-40 grayscale')}
        />
        <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[11px] font-semibold text-white">#{position}</span>
        {!row.is_published && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded bg-stone-900/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
            <EyeOff className="h-3 w-3" /> Hidden
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
          <span className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-stone-900 shadow">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </span>
        </span>
      </button>

      <div className="flex flex-1 flex-col p-3">
        <p className="truncate text-sm font-medium text-stone-900">{row.title || 'Untitled photo'}</p>
        {needsDetails ? (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-amber-700">
            <AlertCircle className="h-3 w-3" /> Add {row.title.trim() ? 'a caption' : 'a title'}
          </p>
        ) : (
          <p className="mt-0.5 truncate text-xs text-stone-500">{row.caption}</p>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-2.5">
          <div className="flex">
            <button
              type="button"
              disabled={first || busy}
              onClick={() => onMove(-1)}
              className="rounded p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-900 disabled:opacity-30"
              aria-label="Move earlier"
              title="Move earlier"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={last || busy}
              onClick={() => onMove(1)}
              className="rounded p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-900 disabled:opacity-30"
              aria-label="Move later"
              title="Move later"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <Switch checked={row.is_published} onChange={onToggle} label="Show on website" disabled={busy} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Side drawer for editing one photo
// ---------------------------------------------------------------------------

function EditDrawer({
  row,
  busy,
  onClose,
  onSave,
  onReplace,
  onDelete,
}: {
  row: Row;
  busy: boolean;
  onClose: () => void;
  onSave: (patch: Partial<Row>) => void;
  onReplace: (f: File) => void;
  onDelete: () => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [draft, setDraft] = useState<{
    title: string;
    tag: string;
    caption: string;
    category: GallerySectionId;
    aspect: GalleryItem['aspect'];
  }>({
    title: row.title,
    tag: row.tag,
    caption: row.caption,
    category: sectionOf(row.category),
    aspect: row.aspect,
  });
  const dirty =
    draft.title !== row.title ||
    draft.tag !== row.tag ||
    draft.caption !== row.caption ||
    draft.category !== row.category ||
    draft.aspect !== row.aspect;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Edit gallery photo">
      <div className="absolute inset-0 bg-stone-900/40" onClick={onClose} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between gap-4 border-b border-stone-200 px-6 py-4">
          <p className="text-lg font-semibold text-stone-900">Edit photo</p>
          <button onClick={onClose} className="rounded-md p-1.5 text-stone-500 hover:bg-stone-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div>
            <div className="overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
              <img src={row.image} alt={row.title} className="max-h-72 w-full object-contain" />
            </div>
            <div className="mt-2 flex gap-2">
              <Button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="flex-1">
                <ImageUp className="h-4 w-4" /> {busy ? 'Uploading…' : 'Replace photo'}
              </Button>
              <Button type="button" variant="ghost" disabled={busy} onClick={onDelete} className="text-red-600 hover:bg-red-50 hover:text-red-700">
                <Trash2 className="h-4 w-4" /> Delete
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

          <Field label="Title">
            <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Caption" hint="Mention the fabric code where you can, e.g. KF-ZAR-901">
            <textarea rows={3} value={draft.caption} onChange={(e) => setDraft({ ...draft, caption: e.target.value })} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Section">
              <select
                value={draft.category}
                onChange={(e) => {
                  const next = GALLERY_SECTIONS.find((s) => s.id === e.target.value) ?? GALLERY_SECTIONS[0];
                  const oldTag = GALLERY_SECTIONS.find((s) => s.id === draft.category)?.tag;
                  // Keep the tag in step with the section unless the admin wrote a custom one.
                  setDraft({ ...draft, category: next.id, tag: !draft.tag || draft.tag === oldTag ? next.tag : draft.tag });
                }}
                className={inputCls}
              >
                {GALLERY_SECTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Shape">
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
          </div>
          <Field label="Tag" hint="Small label shown on the photo">
            <input value={draft.tag} onChange={(e) => setDraft({ ...draft, tag: e.target.value })} className={inputCls} />
          </Field>
        </div>

        <div className="flex justify-end gap-2 border-t border-stone-200 px-6 py-4">
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="primary" disabled={!dirty || busy} onClick={() => onSave(draft)}>
            Save changes
          </Button>
        </div>
      </aside>
    </div>
  );
}
