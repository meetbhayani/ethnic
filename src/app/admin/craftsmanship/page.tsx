'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Download,
  ExternalLink,
  EyeOff,
  ImageUp,
  Lightbulb,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { Button, Card, CardHeader, Field, LoadingBlock, PageHeader, Switch, cx, inputCls } from '@/components/admin/ui';
import MigrationNotice from '@/components/admin/MigrationNotice';
import { errorMessage, isMissingTable, removeSiteImage, uploadSiteImage } from '@/lib/admin-images';
import {
  CRAFT_CONTENT_KEY,
  CRAFT_WRITING_TIPS,
  CraftPageContent,
  CraftTechnique,
  DEFAULT_CRAFT_PAGE,
  MAX_CRAFT_STEPS,
  builtInTechniques,
  mergeCraftPage,
} from '@/lib/craftsmanship';

const MIGRATION = 'supabase/migrations/20261127_craftsmanship.sql';

type Row = CraftTechnique & { sort_order: number; is_published: boolean };
type Draft = Omit<CraftTechnique, 'id'> & { is_published: boolean };

const EMPTY_DRAFT: Draft = {
  title: '',
  subtitle: '',
  description: '',
  best_for: '',
  machine_work: '',
  hand_work: '',
  features: [],
  image: '',
  is_published: true,
};

export default function CraftsmanshipAdminPage() {
  const { supabase, toast, confirm, revalidateSite } = useAdmin();
  const [tab, setTab] = useState<'techniques' | 'text'>('techniques');
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [busy, setBusy] = useState(false);
  // null = drawer closed, 'new' = adding, otherwise the id being edited
  const [editing, setEditing] = useState<string | 'new' | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('craft_techniques')
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

  /** Copy the current built-in sections (with any photos replaced earlier in Site Images) into the table. */
  const importBuiltIn = async () => {
    if (rows.length && !(await confirm({ title: 'Add the built-in technique sections to the end of the list?', confirmLabel: 'Add' }))) return;
    setBusy(true);
    try {
      const { data: imgs } = await supabase.from('site_images').select('key,url');
      const siteImages = Object.fromEntries((imgs || []).map((r) => [r.key as string, r.url as string]));
      const start = nextOrder();
      const { error } = await supabase.from('craft_techniques').insert(
        builtInTechniques(siteImages).map(({ id: _id, ...t }, i) => ({ ...t, sort_order: start + i, is_published: true }))
      );
      if (error) throw error;
      await load();
      await revalidateSite();
      toast('success', 'Built-in sections imported. Edit each one to match your real work.');
    } catch (err) {
      toast('error', errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  /** Delete every technique and load the built-in default sections in their place. */
  const resetToDefaults = async () => {
    const ok = await confirm({
      title: 'Replace all techniques with the default sections?',
      message: `Your ${rows.length} current technique${rows.length === 1 ? '' : 's'} and their uploaded photos will be deleted, and the default Zari, Sequin, Bead & Cutdana and Resham sections added instead.`,
      confirmLabel: 'Replace',
      danger: true,
    });
    if (!ok) return;
    setBusy(true);
    try {
      const old = rows;
      if (old.length) {
        const { error } = await supabase.from('craft_techniques').delete().in('id', old.map((r) => r.id));
        if (error) throw error;
      }
      const { error } = await supabase
        .from('craft_techniques')
        .insert(builtInTechniques().map(({ id: _id, ...t }, i) => ({ ...t, sort_order: i, is_published: true })));
      if (error) throw error;
      await Promise.all(old.map((r) => removeSiteImage(supabase, r.image)));
      await load();
      await revalidateSite();
      toast('success', 'Default sections loaded. Replace each photo with your own when you can.');
    } catch (err) {
      toast('error', errorMessage(err));
      await load();
    } finally {
      setBusy(false);
    }
  };

  const saveTechnique = async (draft: Draft, imageFile: File | null, existing: Row | null) => {
    if (!draft.title.trim()) {
      toast('error', 'Give the technique a title.');
      return false;
    }
    setBusy(true);
    let uploaded = '';
    try {
      let image = draft.image;
      if (imageFile) {
        uploaded = await uploadSiteImage(supabase, imageFile, 'craft');
        image = uploaded;
      }
      const record = {
        ...draft,
        title: draft.title.trim(),
        features: draft.features.map((f) => f.trim()).filter(Boolean),
        image,
        updated_at: new Date().toISOString(),
      };
      const { data, error } = existing
        ? await supabase.from('craft_techniques').update(record).eq('id', existing.id).select('id')
        : await supabase.from('craft_techniques').insert({ ...record, sort_order: nextOrder() }).select('id');
      if (error) throw error;
      if (!data?.length) throw new Error('Not saved. Your admin session may have expired: sign out, sign in again and retry.');
      // The old photo is no longer used once replaced.
      if (existing && imageFile && existing.image !== image) await removeSiteImage(supabase, existing.image);
      await load();
      await revalidateSite();
      toast('success', existing ? 'Technique saved.' : 'Technique added.');
      return true;
    } catch (err) {
      if (uploaded) await removeSiteImage(supabase, uploaded);
      toast('error', errorMessage(err));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const togglePublished = async (row: Row, v: boolean) => {
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, is_published: v } : r)));
    const { data, error } = await supabase.from('craft_techniques').update({ is_published: v }).eq('id', row.id).select('id');
    if (error || !data?.length) {
      toast('error', error?.message || 'Not saved. Please sign in again and retry.');
      return load();
    }
    await revalidateSite();
  };

  const remove = async (row: Row) => {
    if (!(await confirm({ title: `Delete “${row.title}”?`, message: 'This section will be removed from the Craftsmanship page.', confirmLabel: 'Delete', danger: true }))) return;
    const { error } = await supabase.from('craft_techniques').delete().eq('id', row.id);
    if (error) return toast('error', error.message);
    await removeSiteImage(supabase, row.image);
    setRows((rs) => rs.filter((r) => r.id !== row.id));
    setEditing(null);
    await revalidateSite();
    toast('success', 'Technique deleted.');
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[idx], next[j]] = [next[j], next[idx]];
    const renumbered = next.map((r, i) => ({ ...r, sort_order: i }));
    setRows(renumbered);
    const results = await Promise.all(
      renumbered.map((r) => supabase.from('craft_techniques').update({ sort_order: r.sort_order }).eq('id', r.id))
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) {
      toast('error', failed.error.message);
      return load();
    }
    await revalidateSite();
  };

  const published = rows.filter((r) => r.is_published).length;
  const editingRow = editing && editing !== 'new' ? rows.find((r) => r.id === editing) || null : null;

  return (
    <>
      <PageHeader
        title="Craftsmanship"
        description={
          published
            ? `${published} technique section${published === 1 ? '' : 's'} showing on the Craftsmanship page.`
            : 'The Craftsmanship page shows its built-in sample sections until you publish your first technique here.'
        }
        actions={
          <a
            href="/craftsmanship"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3.5 py-2 text-sm font-medium text-stone-800 shadow-sm hover:bg-stone-50"
          >
            <ExternalLink className="h-4 w-4" /> View page
          </a>
        }
      />
      {missing && <MigrationNotice file={MIGRATION} until="Until then the Craftsmanship page keeps showing its built-in content." />}
      {loading && <LoadingBlock />}

      {!loading && !missing && (
        <Card>
          <div className="flex overflow-x-auto border-b border-stone-200 px-2" role="tablist">
            {(
              [
                ['techniques', `Techniques (${rows.length})`],
                ['text', 'Page text'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={cx(
                  '-mb-px shrink-0 border-b-2 px-4 py-3.5 text-sm font-medium transition-colors',
                  tab === id ? 'border-[#30241F] text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-800'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'techniques' ? (
            <div className="p-5">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <ul className="space-y-1 text-sm text-stone-600">
                  {CRAFT_WRITING_TIPS.map((t) => (
                    <li key={t} className="flex gap-2">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="flex shrink-0 gap-2">
                  {rows.length === 0 ? (
                    <Button type="button" disabled={busy} onClick={importBuiltIn}>
                      <Download className="h-4 w-4" /> Import default sections
                    </Button>
                  ) : (
                    <Button type="button" variant="ghost" disabled={busy} onClick={resetToDefaults}>
                      <RotateCcw className="h-4 w-4" /> Reset to defaults
                    </Button>
                  )}
                  <Button type="button" variant="primary" disabled={busy} onClick={() => setEditing('new')}>
                    <Plus className="h-4 w-4" /> Add technique
                  </Button>
                </div>
              </div>

              {rows.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-stone-300 p-10 text-center text-sm text-stone-500">
                  No techniques yet. <strong>Import default sections</strong> to start from the Zari, Sequin, Bead &amp; Cutdana and Resham sections, or{' '}
                  <strong>Add technique</strong> to write your own.
                </div>
              ) : (
                <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200">
                  {rows.map((row, idx) => (
                    <li key={row.id} className={cx('flex items-center gap-4 p-3', !row.is_published && 'bg-stone-50')}>
                      <span className="w-6 text-center font-mono text-xs text-stone-400">{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => setEditing(row.id)}
                        className="h-14 w-20 shrink-0 overflow-hidden rounded-md border border-stone-200 bg-stone-100"
                      >
                        {row.image && (
                          <img src={row.image} alt="" className={cx('h-full w-full object-cover', !row.is_published && 'opacity-40 grayscale')} />
                        )}
                      </button>
                      <button type="button" onClick={() => setEditing(row.id)} className="min-w-0 flex-1 text-left">
                        <p className={cx('truncate text-sm font-medium', row.is_published ? 'text-stone-900' : 'text-stone-500')}>
                          {row.title || 'Untitled technique'}
                        </p>
                        <p className="truncate text-xs text-stone-500">
                          {!row.is_published && (
                            <span className="mr-2 inline-flex items-center gap-1 text-amber-700">
                              <EyeOff className="h-3 w-3" /> Hidden
                            </span>
                          )}
                          {row.subtitle || row.description || 'No description yet'}
                        </p>
                      </button>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button type="button" variant="ghost" className="px-2" disabled={idx === 0 || busy} onClick={() => move(idx, -1)} aria-label="Move up">
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-2"
                          disabled={idx === rows.length - 1 || busy}
                          onClick={() => move(idx, 1)}
                          aria-label="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Switch checked={row.is_published} onChange={(v) => togglePublished(row, v)} label="Show on website" disabled={busy} />
                        <Button type="button" variant="ghost" className="px-2" onClick={() => setEditing(row.id)} aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <PageTextForm />
          )}
        </Card>
      )}

      {editing && (
        <TechniqueDrawer
          key={editing}
          row={editingRow}
          busy={busy}
          onClose={() => setEditing(null)}
          onSave={async (draft, file) => {
            if (await saveTechnique(draft, file, editingRow)) setEditing(null);
          }}
          onDelete={editingRow ? () => remove(editingRow) : undefined}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Technique editor (side drawer)
// ---------------------------------------------------------------------------

function TechniqueDrawer({
  row,
  busy,
  onClose,
  onSave,
  onDelete,
}: {
  row: Row | null;
  busy: boolean;
  onClose: () => void;
  onSave: (draft: Draft, file: File | null) => void;
  onDelete?: () => void;
}) {
  const [draft, setDraft] = useState<Draft>(
    row
      ? {
          title: row.title,
          subtitle: row.subtitle,
          description: row.description,
          best_for: row.best_for,
          machine_work: row.machine_work,
          hand_work: row.hand_work,
          features: row.features || [],
          image: row.image,
          is_published: row.is_published,
        }
      : EMPTY_DRAFT
  );
  const [featuresText, setFeaturesText] = useState((row?.features || []).join('\n'));
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(row?.image || '');
  const fileRef = useRef<HTMLInputElement | null>(null);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label={row ? 'Edit technique' : 'Add technique'}>
      <div className="absolute inset-0 bg-stone-900/40" onClick={onClose} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between gap-4 border-b border-stone-200 px-6 py-4">
          <p className="text-lg font-semibold text-stone-900">{row ? 'Edit technique' : 'Add technique'}</p>
          <button onClick={onClose} className="rounded-md p-1.5 text-stone-500 hover:bg-stone-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div>
            <p className="mb-1.5 text-sm font-medium text-stone-700">Photo</p>
            <div className="aspect-[4/3] overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
              {preview ? (
                <img src={preview} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-stone-400">No photo yet</div>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="text-xs text-stone-500">Your own close-up of this work. Landscape (4:3) works best.</span>
              <Button type="button" disabled={busy} onClick={() => fileRef.current?.click()}>
                <ImageUp className="h-4 w-4" /> {preview ? 'Replace' : 'Upload'}
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
                if (f) setFile(f);
              }}
            />
          </div>

          <Field label="Title" required hint="The technique, e.g. “Zari & Dabka Embroidery”">
            <input value={draft.title} onChange={(e) => set('title', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Subtitle" hint="One short line shown above the title (optional)">
            <input value={draft.subtitle} onChange={(e) => set('subtitle', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Description" hint="2–3 sentences: what it is and how you make it">
            <textarea rows={4} value={draft.description} onChange={(e) => set('description', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Best for" hint="Garments or uses, e.g. “Sherwani, Jodhpuri, wedding wear” (optional)">
            <input value={draft.best_for} onChange={(e) => set('best_for', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Machine work" hint="What your machines do for this technique (optional)">
            <textarea rows={2} value={draft.machine_work} onChange={(e) => set('machine_work', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Hand work" hint="What your team finishes by hand (optional)">
            <textarea rows={2} value={draft.hand_work} onChange={(e) => set('hand_work', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Key points" hint="One per line, shown as a checklist. 3–5 works best.">
            <textarea
              rows={4}
              value={featuresText}
              onChange={(e) => {
                setFeaturesText(e.target.value);
                set('features', e.target.value.split('\n'));
              }}
              className={inputCls}
            />
          </Field>
          <div className="flex items-center justify-between rounded-lg border border-stone-200 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-stone-800">Show on website</p>
              <p className="text-xs text-stone-500">Hidden sections stay here in admin.</p>
            </div>
            <Switch checked={draft.is_published} onChange={(v) => set('is_published', v)} label="Show on website" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-stone-200 px-6 py-4">
          {onDelete ? (
            <Button type="button" variant="ghost" disabled={busy} onClick={onDelete} className="text-red-600 hover:bg-red-50 hover:text-red-700">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="primary" disabled={busy} onClick={() => onSave(draft, file)}>
              {busy ? 'Saving…' : row ? 'Save changes' : 'Add technique'}
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page text (header, quality steps, buttons)
// ---------------------------------------------------------------------------

/** Copy of `list` with items `a` and `b` swapped. */
function swap<T>(list: T[], a: number, b: number): T[] {
  const next = [...list];
  [next[a], next[b]] = [next[b], next[a]];
  return next;
}

function PageTextForm() {
  const { supabase, toast, confirm, revalidateSite } = useAdmin();
  const [saved, setSaved] = useState<CraftPageContent | null>(null);
  const [form, setForm] = useState<CraftPageContent>(DEFAULT_CRAFT_PAGE);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from('site_content')
      .select('value')
      .eq('key', CRAFT_CONTENT_KEY)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) toast('error', error.message);
        const merged = mergeCraftPage((data?.value as Partial<CraftPageContent>) || null);
        setSaved(merged);
        setForm(merged);
      });
  }, [supabase, toast]);

  if (!saved) return <LoadingBlock />;
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  const set = <K extends keyof CraftPageContent>(k: K, v: CraftPageContent[K]) => setForm((f) => ({ ...f, [k]: v }));
  const setStep = (i: number, patch: Partial<CraftPageContent['steps'][number]>) =>
    set('steps', form.steps.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  const save = async (value: CraftPageContent) => {
    setSaving(true);
    const clean = { ...value, steps: value.steps.filter((s) => s.title.trim() || s.text.trim()) };
    const { data, error } = await supabase
      .from('site_content')
      .upsert({ key: CRAFT_CONTENT_KEY, value: clean, updated_at: new Date().toISOString() })
      .select('key');
    setSaving(false);
    if (error || !data?.length) return toast('error', error?.message || 'Not saved. Please sign in again and retry.');
    setSaved(clean);
    setForm(clean);
    await revalidateSite();
    toast('success', 'Page text saved.');
  };

  const reset = async () => {
    if (!(await confirm({ title: 'Reset all page text to the original wording?', confirmLabel: 'Reset', danger: true }))) return;
    await save(DEFAULT_CRAFT_PAGE);
  };

  return (
    <div className="space-y-6 p-5">
      <Card>
        <CardHeader title="Page header" description="The top of the Craftsmanship page." />
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="Small heading" hint="Short line above the title">
            <input value={form.eyebrow} onChange={(e) => set('eyebrow', e.target.value)} className={inputCls} />
          </Field>
          <div />
          <Field label="Title">
            <input value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Title, second line" hint="Shown in italic, on a new line">
            <input value={form.titleAccent} onChange={(e) => set('titleAccent', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Introduction" hint="Who you are and how you work, in 2–3 sentences" className="sm:col-span-2">
            <textarea rows={4} value={form.intro} onChange={(e) => set('intro', e.target.value)} className={inputCls} />
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader title="Process steps" description="The numbered steps near the bottom of the page: how your fabric is made, from selection to dispatch." />
        <div className="space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Small heading">
              <input value={form.qualityEyebrow} onChange={(e) => set('qualityEyebrow', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Title">
              <input value={form.qualityTitle} onChange={(e) => set('qualityTitle', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Introduction" className="sm:col-span-2">
              <input value={form.qualityIntro} onChange={(e) => set('qualityIntro', e.target.value)} className={inputCls} />
            </Field>
          </div>

          {form.steps.map((step, i) => (
            <div key={i} className="flex gap-3 rounded-lg border border-stone-200 p-4">
              <span className="font-mono text-lg font-semibold text-[#AD8A53]">{String(i + 1).padStart(2, '0')}</span>
              <div className="grid flex-1 gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={step.title}
                    onChange={(e) => setStep(i, { title: e.target.value })}
                    placeholder="Step title, e.g. Design & Sketch Development"
                    aria-label={`Step ${i + 1} title`}
                    className={inputCls}
                  />
                  <input
                    value={step.subtitle || ''}
                    onChange={(e) => setStep(i, { subtitle: e.target.value })}
                    placeholder="Tagline (optional), e.g. Where ideas take form"
                    aria-label={`Step ${i + 1} tagline`}
                    className={inputCls}
                  />
                </div>
                <textarea
                  rows={4}
                  value={step.text}
                  onChange={(e) => setStep(i, { text: e.target.value })}
                  placeholder="What happens in this step. Leave a blank line to start a new paragraph."
                  aria-label={`Step ${i + 1} description`}
                  className={inputCls}
                />
              </div>
              <div className="flex flex-col gap-1 self-start">
                <Button type="button" variant="ghost" className="px-2" disabled={i === 0} onClick={() => set('steps', swap(form.steps, i, i - 1))} aria-label="Move step up">
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="px-2"
                  disabled={i === form.steps.length - 1}
                  onClick={() => set('steps', swap(form.steps, i, i + 1))}
                  aria-label="Move step down"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="px-2 text-red-600 hover:bg-red-50"
                  onClick={() => set('steps', form.steps.filter((_, j) => j !== i))}
                  aria-label="Remove step"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {form.steps.length < MAX_CRAFT_STEPS && (
            <Button type="button" onClick={() => set('steps', [...form.steps, { title: '', subtitle: '', text: '' }])}>
              <Plus className="h-4 w-4" /> Add step
            </Button>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader title="Buttons" description="At the bottom of the page." />
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="Enquiry button" hint="Opens the enquiry form">
            <input value={form.ctaPrimary} onChange={(e) => set('ctaPrimary', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Catalogue button" hint="Links to Collections. Leave empty to hide it.">
            <input value={form.ctaSecondary} onChange={(e) => set('ctaSecondary', e.target.value)} className={inputCls} />
          </Field>
        </div>
      </Card>

      <div className="sticky bottom-0 -mx-5 flex items-center justify-between gap-3 border-t border-stone-200 bg-white/95 px-5 py-3 backdrop-blur">
        <Button type="button" variant="ghost" disabled={saving} onClick={reset}>
          <RotateCcw className="h-4 w-4" /> Reset to original
        </Button>
        <div className="flex items-center gap-3">
          {dirty && <span className="text-xs text-amber-700">Unsaved changes</span>}
          <Button type="button" variant="primary" disabled={!dirty || saving} onClick={() => save(form)}>
            {saving ? 'Saving…' : 'Save page text'}
          </Button>
        </div>
      </div>
    </div>
  );
}
