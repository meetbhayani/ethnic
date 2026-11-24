'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ImagePlus, MoveHorizontal, Shirt, Sparkles, Wand2 } from 'lucide-react';
import GarmentSilhouette, { GARMENT_LABELS, GarmentKind } from './GarmentSilhouette';
import { LARGE_FABRICS } from './fabric-library';
import { Eyebrow, Reveal, SplitWords } from './motion';

const KINDS: GarmentKind[] = ['sherwani', 'jodhpuri', 'kurta', 'indo-western'];
const SWATCHES = LARGE_FABRICS.slice(0, 6);

export default function TryOnTeaser() {
  const [split, setSplit] = useState(55);
  const [kind, setKind] = useState<GarmentKind>('sherwani');
  const [fabricId, setFabricId] = useState(SWATCHES[2].id);
  const fabric = SWATCHES.find((f) => f.id === fabricId) ?? SWATCHES[0];
  const box = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);

  const moveTo = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setSplit(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <section className="relative bg-[#1C1714] text-[#FAF8F3] py-20 sm:py-28 overflow-hidden">
      <div aria-hidden className="absolute top-1/3 -left-40 w-[600px] h-[600px] rounded-full bg-[#AD8A53]/10 blur-3xl" />
      <div aria-hidden className="absolute bottom-0 -right-40 w-[500px] h-[500px] rounded-full bg-[#713B43]/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-5">
          <Eyebrow light>AI Virtual Try-On</Eyebrow>
          <SplitWords
            text="See the garment before it is stitched."
            accent={['garment']}
            className="font-editorial text-4xl sm:text-5xl leading-[1.1]"
          />
          <Reveal delay={200}>
            <p className="mt-5 text-sm sm:text-base text-[#E9DFCF]/75 leading-relaxed">
              Pick any fabric from our catalogue and preview it on a Sherwani, Kurta, Jodhpuri or Indo-Western
              silhouette — or on your own model photo. Show clients the look before a single metre is cut.
            </p>
          </Reveal>

          <ol className="mt-8 space-y-4">
            {[
              { icon: ImagePlus, t: 'Choose a model', d: 'Upload a photo or use a preset silhouette.' },
              { icon: Shirt, t: 'Select a fabric', d: 'Any design from the Khodal catalogue.' },
              { icon: Wand2, t: 'Generate the preview', d: 'Share it with clients or send an enquiry.' },
            ].map((s, i) => (
              <Reveal as="li" key={s.t} delay={300 + i * 100} variant="left" className="flex items-start gap-4">
                <span className="w-10 h-10 shrink-0 rounded-full border border-[#C8A974]/50 flex items-center justify-center text-[#C8A974]">
                  <s.icon className="w-4 h-4" />
                </span>
                <span>
                  <span className="block font-semibold text-sm">{s.t}</span>
                  <span className="block text-[13px] text-[#E9DFCF]/65">{s.d}</span>
                </span>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={600} className="mt-10">
            <Link
              href={`/ai-tryon`}
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-[#C8A974] hover:bg-[#E3C98F] text-[#1C1714] text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Open the Try-On Studio
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="mt-4 text-[13px] text-[#E9DFCF]/70 italic">
              AI previews are illustrative and may not match exact drape or colour.
            </p>
          </Reveal>
        </div>

        {/* Interactive before / after */}
        <Reveal variant="scale" className="lg:col-span-7">
          <div className="bg-[#252321] border border-[#C8A974]/25 p-4 sm:p-6 shadow-2xl">
            {/* Garment chooser */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {KINDS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  aria-pressed={kind === k}
                  className={`shrink-0 px-3.5 py-2 text-[12px] uppercase tracking-widest font-semibold border transition-colors ${
                    kind === k
                      ? 'bg-[#FAF8F3] text-[#1C1714] border-[#FAF8F3]'
                      : 'border-[#C8A974]/25 text-[#E9DFCF]/70 hover:text-[#FAF8F3] hover:border-[#C8A974]'
                  }`}
                >
                  {GARMENT_LABELS[k]}
                </button>
              ))}
            </div>

            {/* Comparison stage */}
            <div
              ref={box}
              className="relative mt-4 aspect-[4/5] sm:aspect-[5/4] bg-[radial-gradient(circle_at_50%_40%,#3a302b,#1C1714)] overflow-hidden select-none touch-pan-y cursor-ew-resize"
              onPointerDown={(e) => {
                dragging.current = true;
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                moveTo(e.clientX);
              }}
              onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
              onPointerUp={() => (dragging.current = false)}
              onPointerCancel={() => (dragging.current = false)}
            >
              <div aria-hidden className="absolute inset-0 weave-texture opacity-30" />
              {/* After: fabric-filled */}
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <GarmentSilhouette kind={kind} fabricSrc={fabric.src} className="h-full w-auto" />
              </div>
              {/* Before: pattern sketch, clipped to the left of the handle */}
              <div
                className="absolute inset-0 flex items-center justify-center p-6 bg-[#EFE7D9]"
                style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
              >
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(#d9ccb6_1px,transparent_1px),linear-gradient(90deg,#d9ccb6_1px,transparent_1px)] bg-[size:20px_20px] opacity-60" />
                <GarmentSilhouette kind={kind} variant="sketch" className="relative h-full w-auto" />
              </div>

              <span className="absolute top-3 left-3 px-2 py-1 bg-[#1C1714]/80 text-[11px] uppercase tracking-widest text-[#E9DFCF]">
                Sketch
              </span>
              <span className="absolute top-3 right-3 px-2 py-1 bg-[#C8A974] text-[11px] uppercase tracking-widest text-[#1C1714] font-semibold">
                AI Preview
              </span>

              {/* Handle */}
              <div className="absolute top-0 bottom-0 w-px bg-[#C8A974]" style={{ left: `${split}%` }}>
                <button
                  type="button"
                  aria-label="Drag to compare sketch and fabric preview"
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft') setSplit((s) => Math.max(0, s - 5));
                    if (e.key === 'ArrowRight') setSplit((s) => Math.min(100, s + 5));
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#C8A974] text-[#1C1714] shadow-[0_0_0_6px_rgba(200,169,116,0.25)] flex items-center justify-center"
                >
                  <MoveHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Fabric chooser */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-[12px] uppercase tracking-widest text-[#E9DFCF]/70 shrink-0">Fabric</span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {SWATCHES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFabricId(f.id)}
                    aria-label={f.name}
                    aria-pressed={f.id === fabricId}
                    className={`shrink-0 w-10 h-10 rounded-full overflow-hidden transition-all ${
                      f.id === fabricId ? 'ring-2 ring-[#C8A974] ring-offset-2 ring-offset-[#252321]' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={f.src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
