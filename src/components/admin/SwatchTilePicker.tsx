'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus, RotateCcw, Sparkles } from 'lucide-react';
import GarmentSilhouette from '@/components/home/GarmentSilhouette';
import {
  DEFAULT_SWATCH_CROP,
  SwatchCrop,
  compressImage,
  cropRect,
  errorMessage,
  makeSwatchTile,
} from '@/lib/admin-images';
import { Button, Card, CardHeader, cx } from './ui';

export type PendingTile = { blob: Blob; url: string };

/**
 * Lets the admin choose a flat, even area of a product photo (or a separately uploaded
 * flat swatch photo). That area becomes a seamless tile used to cover garment previews
 * on the website. Nothing changes unless the admin moves the square or picks a source.
 */
export default function SwatchTilePicker({
  photos,
  currentTile,
  pending,
  onChange,
}: {
  /** Product photos in order (may be local blob: previews). */
  photos: { key: string; url: string }[];
  /** Tile already saved for this product (URL), if any. */
  currentTile?: string;
  pending: PendingTile | null;
  /** New tile to save, or null to keep the current one. */
  onChange: (tile: PendingTile | null) => void;
}) {
  const [extraSource, setExtraSource] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [crop, setCrop] = useState<SwatchCrop>(DEFAULT_SWATCH_CROP);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Default source: the cover photo.
  const activeSource = source ?? extraSource ?? photos[0]?.url ?? null;

  // Regenerate the tile (debounced) whenever the admin changes the area or source.
  useEffect(() => {
    if (!touched || !activeSource) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      setBusy(true);
      setError(null);
      try {
        const blob = await makeSwatchTile(activeSource, crop);
        if (cancelled) return;
        if (pending) URL.revokeObjectURL(pending.url);
        onChange({ blob, url: URL.createObjectURL(blob) });
      } catch (err) {
        if (!cancelled) setError(errorMessage(err));
      } finally {
        if (!cancelled) setBusy(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touched, activeSource, crop]);

  const moveTo = (clientX: number, clientY: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    setTouched(true);
    setCrop((c) => ({
      ...c,
      cx: Math.min(1, Math.max(0, (clientX - r.left) / r.width)),
      cy: Math.min(1, Math.max(0, (clientY - r.top) / r.height)),
    }));
  };

  const square = natural ? cropRect(natural.w, natural.h, crop) : null;
  const previewTile = pending?.url || currentTile || '';

  const uploadFlat = async (file: File | undefined) => {
    if (!file) return;
    try {
      const blob = await compressImage(file);
      const url = URL.createObjectURL(blob);
      setExtraSource(url);
      setSource(url);
      setNatural(null);
      setCrop({ cx: 0.5, cy: 0.5, size: 0.8 });
      setTouched(true);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const reset = () => {
    if (pending) URL.revokeObjectURL(pending.url);
    onChange(null);
    setTouched(false);
    setCrop(DEFAULT_SWATCH_CROP);
    setError(null);
  };

  return (
    <Card>
      <CardHeader
        title="Garment preview fabric"
        description="Drag the square onto a flat, evenly lit part of the fabric (avoid folds and swirls). It becomes a seamless repeat used to dress the Sherwani, Kurta and Jodhpuri previews on the website."
      />
      <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-5">
        {/* Source + crop square */}
        <div className="md:col-span-3">
          {/* Source choice */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {photos.map((p, i) => (
              <button
                key={p.key}
                type="button"
                onClick={() => {
                  setSource(p.url);
                  setNatural(null);
                  setTouched(true);
                }}
                className={cx(
                  'h-11 w-11 overflow-hidden rounded border',
                  activeSource === p.url ? 'border-[#AD8A53] ring-2 ring-[#AD8A53]/50' : 'border-stone-200 opacity-70 hover:opacity-100'
                )}
                title={`Use photo ${i + 1}`}
              >
                <img src={p.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
            {extraSource && (
              <button
                type="button"
                onClick={() => {
                  setSource(extraSource);
                  setNatural(null);
                  setTouched(true);
                }}
                className={cx(
                  'h-11 w-11 overflow-hidden rounded border',
                  activeSource === extraSource ? 'border-[#AD8A53] ring-2 ring-[#AD8A53]/50' : 'border-stone-200 opacity-70'
                )}
                title="Flat swatch photo"
              >
                <img src={extraSource} alt="" className="h-full w-full object-cover" />
              </button>
            )}
            <Button type="button" onClick={() => fileRef.current?.click()} className="!h-11">
              <ImagePlus className="h-4 w-4" /> Upload flat swatch
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                uploadFlat(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </div>

          {activeSource ? (
            <div
              ref={boxRef}
              className="relative mx-auto w-full max-w-sm select-none overflow-hidden rounded-lg border border-stone-200 bg-stone-100 touch-none cursor-move"
              onPointerDown={(e) => {
                dragging.current = true;
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                moveTo(e.clientX, e.clientY);
              }}
              onPointerMove={(e) => dragging.current && moveTo(e.clientX, e.clientY)}
              onPointerUp={() => (dragging.current = false)}
              onPointerCancel={() => (dragging.current = false)}
            >
              <img
                src={activeSource}
                alt="Swatch source"
                draggable={false}
                onLoad={(e) => setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
                className="block h-auto w-full"
              />
              {square && natural && (
                <div
                  className="pointer-events-none absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
                  style={{
                    left: `${(square.x / natural.w) * 100}%`,
                    top: `${(square.y / natural.h) * 100}%`,
                    width: `${(square.side / natural.w) * 100}%`,
                    height: `${(square.side / natural.h) * 100}%`,
                  }}
                >
                  <span className="absolute -top-6 left-0 whitespace-nowrap rounded bg-[#30241F] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    Drag me onto flat fabric
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">
              Add a product photo first, or upload a flat swatch photo.
            </p>
          )}

          <label className="mt-3 flex items-center gap-3 text-xs text-stone-600">
            Area size
            <input
              type="range"
              min={15}
              max={90}
              value={Math.round(crop.size * 100)}
              onChange={(e) => {
                setTouched(true);
                setCrop((c) => ({ ...c, size: Number(e.target.value) / 100 }));
              }}
              className="flex-1 accent-[#AD8A53]"
            />
          </label>
          <p className="mt-1 text-[11px] text-stone-500">Smaller area = bigger motifs on the garment.</p>
        </div>

        {/* Preview */}
        <div className="md:col-span-2">
          <p className="mb-2 text-xs font-semibold text-stone-700">Website preview</p>
          <div className="flex gap-3">
            <div
              className="aspect-square w-1/2 rounded-lg border border-stone-200 bg-stone-100"
              style={previewTile ? { backgroundImage: `url(${previewTile})`, backgroundSize: '50%' } : undefined}
              title="Seamless repeat"
            />
            <div className="w-1/2 rounded-lg border border-stone-200 bg-[#F4EFE6]">
              {previewTile ? (
                <GarmentSilhouette kind="sherwani" fabricSrc={previewTile} className="h-full w-full" />
              ) : (
                <div className="flex h-full items-center justify-center p-3 text-center text-[11px] text-stone-500">
                  Created from photo 1 on save
                </div>
              )}
            </div>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-600">
            {busy ? (
              'Creating tile…'
            ) : pending ? (
              <>
                <Sparkles className="h-3.5 w-3.5 text-[#AD8A53]" /> New tile — saved when you save the product.
              </>
            ) : currentTile ? (
              'Current tile.'
            ) : (
              'No tile yet — one is created automatically from the centre of photo 1 when you save.'
            )}
          </p>
          {pending && (
            <button type="button" onClick={reset} className="mt-2 inline-flex items-center gap-1 text-xs text-stone-500 underline hover:text-stone-800">
              <RotateCcw className="h-3 w-3" /> Discard new tile
            </button>
          )}
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </Card>
  );
}
