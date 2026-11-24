'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ImageUp, RotateCcw } from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminProvider';
import { Button, Card, CardHeader, PageHeader } from '@/components/admin/ui';
import MigrationNotice from '@/components/admin/MigrationNotice';
import { SITE_IMAGE_SLOTS, SiteImageSlot } from '@/lib/site-images';
import { errorMessage, isMissingTable, removeSiteImage, uploadSiteImage } from '@/lib/admin-images';

const MIGRATION = 'supabase/migrations/20261125_site_images_gallery.sql';

export default function SiteImagesPage() {
  const { supabase, toast, confirm, revalidateSite } = useAdmin();
  const [custom, setCustom] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('site_images').select('key,url');
    if (error) {
      if (isMissingTable(error)) setMissing(true);
      else toast('error', error.message);
    } else {
      setMissing(false);
      setCustom(Object.fromEntries((data || []).map((r) => [r.key, r.url])));
    }
    setLoading(false);
  }, [supabase, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const replace = async (slot: SiteImageSlot, file: File) => {
    setBusyKey(slot.key);
    try {
      const url = await uploadSiteImage(supabase, file, `site/${slot.key}`);
      const { error } = await supabase.from('site_images').upsert({ key: slot.key, url, updated_at: new Date().toISOString() });
      if (error) {
        await removeSiteImage(supabase, url);
        throw error;
      }
      await removeSiteImage(supabase, custom[slot.key]);
      setCustom((c) => ({ ...c, [slot.key]: url }));
      await revalidateSite();
      toast('success', `${slot.label} updated on the website.`);
    } catch (err) {
      toast('error', errorMessage(err));
    } finally {
      setBusyKey(null);
    }
  };

  const reset = async (slot: SiteImageSlot) => {
    if (!(await confirm({ title: `Restore the default image for “${slot.label}”?`, confirmLabel: 'Restore default', danger: true }))) return;
    setBusyKey(slot.key);
    try {
      const { error } = await supabase.from('site_images').delete().eq('key', slot.key);
      if (error) throw error;
      await removeSiteImage(supabase, custom[slot.key]);
      setCustom(({ [slot.key]: _gone, ...rest }) => rest);
      await revalidateSite();
      toast('success', `${slot.label} restored to the default image.`);
    } catch (err) {
      toast('error', errorMessage(err));
    } finally {
      setBusyKey(null);
    }
  };

  const groups = Array.from(new Set(SITE_IMAGE_SLOTS.map((s) => s.group)));

  return (
    <>
      <PageHeader
        title="Site images"
        description="Replace the fixed photos on the website. Fabric photos are managed in Products; gallery photos in Gallery."
      />
      {missing && <MigrationNotice file={MIGRATION} />}

      <div className="space-y-6">
        {groups.map((group) => (
          <Card key={group}>
            <CardHeader title={group} />
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
              {SITE_IMAGE_SLOTS.filter((s) => s.group === group).map((slot) => (
                <SlotCard
                  key={slot.key}
                  slot={slot}
                  url={custom[slot.key]}
                  busy={busyKey === slot.key}
                  disabled={loading || missing || (busyKey !== null && busyKey !== slot.key)}
                  onReplace={(file) => replace(slot, file)}
                  onReset={() => reset(slot)}
                />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function SlotCard({
  slot,
  url,
  busy,
  disabled,
  onReplace,
  onReset,
}: {
  slot: SiteImageSlot;
  url?: string;
  busy: boolean;
  disabled: boolean;
  onReplace: (file: File) => void;
  onReset: () => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const isCustom = !!url;
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-stone-200">
      <div className="relative aspect-[4/3] bg-stone-100">
        <img src={url || slot.defaultSrc} alt={slot.label} className="h-full w-full object-cover" />
        <span
          className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
            isCustom ? 'bg-emerald-600 text-white' : 'bg-stone-800/80 text-white'
          }`}
        >
          {isCustom ? 'Your image' : 'Default'}
        </span>
        {busy && <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-xs font-medium">Uploading…</div>}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="text-sm font-semibold text-stone-900">{slot.label}</p>
        <p className="mt-0.5 text-xs text-stone-500">{slot.where}</p>
        <p className="mt-0.5 text-[11px] text-stone-400">Best shape: {slot.shape}</p>
        <div className="mt-3 flex gap-2">
          <Button type="button" variant="primary" disabled={disabled || busy} onClick={() => fileRef.current?.click()} className="flex-1">
            <ImageUp className="h-4 w-4" /> Replace
          </Button>
          {isCustom && (
            <Button type="button" disabled={disabled || busy} onClick={onReset} title="Restore default">
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
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
    </div>
  );
}
