'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';
import FabricLoupe from './FabricLoupe';
import { LARGE_FABRICS } from './fabric-library';
import { SplitWords, Reveal } from './motion';

const HERO_FABRICS = LARGE_FABRICS.slice(0, 6);
const AUTO_ADVANCE_MS = 6000;

export default function Hero() {
  const { generateWhatsAppUrl } = useEnquiry();
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [paused, setPaused] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const active = HERO_FABRICS[index];
  const previous = prevIndex !== null ? HERO_FABRICS[prevIndex] : null;

  const select = (next: number, from?: { x: number; y: number }) => {
    if (next === index) return;
    setPrevIndex(index);
    setOrigin(from ?? { x: 50, y: 100 });
    setIndex(next);
  };

  // Gently cycle through fabrics until the visitor takes control.
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => select((index + 1) % HERO_FABRICS.length), AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused]);

  return (
    <section
      className="relative isolate overflow-hidden bg-[#1C1714] text-[#FAF8F3] min-h-[calc(100svh-72px)] flex items-center"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setPaused(false)}
    >
      {/* Ambient backdrop: the active fabric, blurred, tinting the whole hero */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {HERO_FABRICS.map((f, i) => (
          <img
            key={f.id}
            src={f.src}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover scale-125 blur-2xl transition-opacity duration-[1600ms] ${
              i === index ? 'opacity-40' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1714] via-[#1C1714]/85 to-[#1C1714]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1714] via-transparent to-[#1C1714]/60" />
        <div className="absolute inset-0 weave-texture opacity-60" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Copy */}
        <div className="lg:col-span-6 order-2 lg:order-1">
          <Reveal variant="fade" className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-[#C8A974]" />
            <span className="text-[12px] sm:text-[13px] uppercase tracking-ultra text-[#C8A974] font-semibold">
              Men’s Ethnic Fabrics · Surat
            </span>
          </Reveal>

          <SplitWords
            as="h1"
            text="Where Royal Elegance Begins With Fabric."
            accent={['Elegance']}
            className="font-editorial text-[2.4rem] leading-[1.08] sm:text-5xl lg:text-[3.6rem] xl:text-[4.1rem] tracking-tight"
            stagger={90}
          />

          <Reveal delay={500}>
            <p className="mt-6 text-sm sm:text-base text-[#E9DFCF]/80 leading-relaxed max-w-lg">
              Embroidered fabrics for Sherwanis, Jodhpuris, Kurtas and Indo-Western wear — engineered in Surat for
              retailers, wholesalers, boutiques and designers who refuse the ordinary.
            </p>
          </Reveal>

          <Reveal delay={650} className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/collections"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#C8A974] hover:bg-[#E3C98F] text-[#1C1714] text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Explore the Fabrics
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={generateWhatsAppUrl({
                sourcePage: 'Home Hero',
                productName: active.name,
                customNote: `Hello Khodal Fashion, I saw the “${active.name}” fabric on your website and would like details and wholesale prices.`,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-[#C8A974]/60 hover:border-[#C8A974] hover:bg-[#C8A974]/10 text-[#FAF8F3] text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              Enquire on WhatsApp
            </a>
          </Reveal>

          {/* Swatch selector */}
          <Reveal delay={800} className="mt-10">
            <p className="text-[12px] uppercase tracking-widest text-[#C8A974]/80 mb-3">
              Touch a swatch to unfold it
            </p>
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              {HERO_FABRICS.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  aria-label={`Show ${f.name}`}
                  aria-pressed={i === index}
                  onClick={(e) => {
                    setPaused(true);
                    const stage = stageRef.current?.getBoundingClientRect();
                    const x = stage ? ((e.clientX - stage.left) / stage.width) * 100 : 50;
                    select(i, { x: Math.min(100, Math.max(0, x)), y: 100 });
                  }}
                  className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden transition-all duration-500 ${
                    i === index
                      ? 'ring-2 ring-[#C8A974] ring-offset-2 ring-offset-[#1C1714] scale-110'
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <img src={f.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div key={active.id} className="mt-4 animate-fade-up-in">
              <p className="font-serif italic text-xl text-[#FAF8F3]">{active.name}</p>
              <p className="text-[13px] uppercase tracking-widest text-[#C8A974]/80 mt-0.5">
                {active.technique} · {active.tone}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Fabric stage */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <Reveal variant="unfurl" className="relative mx-auto w-full max-w-[460px] lg:max-w-none">
            <div
              ref={stageRef}
              className="relative aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5] rounded-t-[999px] overflow-hidden border border-[#C8A974]/50 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.7)]"
            >
              {/* Previous fabric stays beneath while the new one unfolds over it */}
              {previous && (
                <img src={previous.src} alt="" className="absolute inset-0 w-full h-full object-cover" />
              )}
              <div
                key={active.id}
                className={`absolute inset-0 ${previous ? 'animate-fabric-unfold' : ''}`}
                style={{ '--ox': `${origin.x}%`, '--oy': `${origin.y}%` } as React.CSSProperties}
              >
                <FabricLoupe
                  src={active.src}
                  alt={`${active.name} — ${active.technique}`}
                  className="w-full h-full fabric-sheen"
                  imgClassName="animate-fabric-breathe"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1C1714]/70 via-transparent to-transparent" />
                </FabricLoupe>
              </div>

              {/* Inner arch hairline */}
              <div className="pointer-events-none absolute inset-3 rounded-t-[999px] border border-[#FAF8F3]/25 z-20" />

              {/* Progress thread for auto-advance */}
              <div className="absolute bottom-0 inset-x-0 h-[3px] bg-[#FAF8F3]/10 z-20">
                <div
                  key={`${active.id}-${paused}`}
                  className="h-full bg-[#C8A974] origin-left"
                  style={{
                    animation: paused ? 'none' : `hero-progress ${AUTO_ADVANCE_MS}ms linear both`,
                    transform: paused ? 'scaleX(0)' : undefined,
                  }}
                />
              </div>
            </div>

            {/* Floating detail tag */}
            <div className="hidden sm:block absolute -left-6 lg:-left-10 bottom-16 z-30 bg-[#FAF8F3] text-[#30241F] px-4 py-3 shadow-2xl border border-[#C8A974]/40 animate-float [--rot:-3deg]">
              <p className="text-[11px] uppercase tracking-widest text-[#AD8A53]">Unstitched · By the metre</p>
              <p className="font-serif text-lg leading-tight">Swatches & sample cuts available</p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-[11px] uppercase tracking-ultra text-[#C8A974]/70">
        <span>Scroll to explore</span>
        <span className="block w-px h-10 bg-[#C8A974] animate-thread-drop" />
      </div>

      <style>{`@keyframes hero-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
    </section>
  );
}
