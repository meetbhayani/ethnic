'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import GarmentSilhouette, { GarmentKind } from './GarmentSilhouette';
import { HOME_FABRICS } from './fabric-library';
import { Eyebrow, Reveal, SplitWords } from './motion';

const GARMENTS: { kind: GarmentKind; title: string; text: string; best: string }[] = [
  {
    kind: 'sherwani',
    title: 'Sherwani',
    text: 'Heavier embroidery and firm bases that hold a stand collar and a long, structured line.',
    best: 'Zari · Pearl · Heavy sequin',
  },
  {
    kind: 'jodhpuri',
    title: 'Jodhpuri',
    text: 'Rich yet tailored surfaces for sharp shoulders, a band collar and a fitted silhouette.',
    best: 'Zari vines · Lattice · Velvet-look',
  },
  {
    kind: 'kurta',
    title: 'Kurta',
    text: 'Lighter, breathable embroidery that moves easily through long festive days.',
    best: 'Resham · Buti · Fine thread',
  },
  {
    kind: 'indo-western',
    title: 'Indo-Western',
    text: 'Bold appliqué and modern placements for asymmetric jackets and reception looks.',
    best: 'Appliqué · Sequin · Contemporary',
  },
];

const PICKER = HOME_FABRICS.filter((f) => f.id !== 'pastel-motif-thread');

export default function Applications() {
  const [fabricId, setFabricId] = useState(PICKER[1].id);
  const fabric = PICKER.find((f) => f.id === fabricId) ?? PICKER[0];

  return (
    <section className="relative bg-[#F4EFE6] py-20 sm:py-28 overflow-hidden">
      {/* Ambient tint from the chosen fabric */}
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-3xl opacity-[0.12] sm:opacity-25 transition-colors duration-1000"
        style={{ backgroundColor: fabric.hex }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-10 sm:mb-14">
          <div className="lg:col-span-7">
            <Eyebrow>Fabric Applications</Eyebrow>
            <SplitWords
              text="One fabric. Four royal silhouettes."
              accent={['Four']}
              accentClassName="italic font-serif text-[#713B43]"
              className="font-editorial text-4xl sm:text-5xl leading-[1.1] text-[#30241F]"
            />
          </div>
          <Reveal delay={200} className="lg:col-span-5">
            <p className="text-sm sm:text-base text-[#30241F]/75 leading-relaxed">
              Choose a fabric below and see how it could tailor into a Sherwani, Jodhpuri, Kurta or Indo-Western
              look.
            </p>
          </Reveal>
        </div>

        {/* Fabric picker */}
        <Reveal delay={250} className="mb-10 sm:mb-12">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 py-2">
            {PICKER.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFabricId(f.id)}
                aria-pressed={f.id === fabricId}
                aria-label={`Drape ${f.name}`}
                className={`group shrink-0 flex items-center gap-2.5 pr-4 pl-1 py-1 rounded-full border transition-all duration-300 ${
                  f.id === fabricId
                    ? 'bg-[#30241F] border-[#30241F] text-[#FAF8F3] shadow-lg'
                    : 'bg-[#FAF8F3] border-[#AD8A53]/30 text-[#30241F] hover:border-[#AD8A53]'
                }`}
              >
                <span className="w-9 h-9 rounded-full overflow-hidden">
                  <img src={f.src} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125" />
                </span>
                <span className="text-[13px] font-semibold whitespace-nowrap">{f.name}</span>
              </button>
            ))}
          </div>
          <p key={fabric.id} className="mt-3 text-xs text-[#30241F]/75 animate-fade-up-in">
            Now draping: <span className="font-semibold text-[#713B43]">{fabric.name}</span> — {fabric.technique}
          </p>
        </Reveal>

        {/* Garments */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {GARMENTS.map((g, i) => (
            <Reveal key={g.kind} delay={i * 110} variant="up">
              <Link
                href={`/collections?category=${g.kind}`}
                className="group relative block h-full bg-[#FAF8F3]/80 backdrop-blur border border-[#AD8A53]/25 hover:border-[#AD8A53] p-3 sm:p-5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative aspect-[5/8] flex items-end justify-center">
                  {/* Arch backdrop */}
                  <div className="absolute inset-x-[8%] top-[4%] bottom-0 rounded-t-full bg-gradient-to-b from-[#E9DFCF] to-transparent opacity-70" />
                  <GarmentSilhouette
                    kind={g.kind}
                    fabricSrc={fabric.src}
                    className="relative w-full h-full drop-shadow-[0_20px_25px_rgba(48,36,31,0.25)] transition-transform duration-700 group-hover:scale-[1.04]"
                    title={`${g.title} in ${fabric.name}`}
                  />
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-editorial text-lg sm:text-2xl text-[#30241F]">{g.title}</h3>
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#AD8A53] transition-transform duration-500 group-hover:rotate-45" />
                  </div>
                  <p className="hidden sm:block mt-2 text-[13px] text-[#30241F]/70 leading-relaxed">{g.text}</p>
                  <p className="mt-2 text-[11px] sm:text-[12px] uppercase tracking-widest text-[#AD8A53]">{g.best}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-6 text-[13px] text-[#30241F]/70 text-center">
            Silhouettes are illustrative. All fabrics are supplied unstitched, by the metre.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
