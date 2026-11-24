'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { HOME_FABRICS } from './fabric-library';
import { Eyebrow, Reveal, SplitWords } from './motion';

const ROW_A = HOME_FABRICS.slice(0, 6);
const ROW_B = HOME_FABRICS.slice(5).concat(HOME_FABRICS.slice(0, 1));

function MarqueeRow({ items, reverse = false }: { items: typeof HOME_FABRICS; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div className={`flex gap-4 w-max ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
        {doubled.map((f, i) => (
          <figure
            key={`${f.id}-${i}`}
            aria-hidden={i >= items.length}
            className="group relative shrink-0 w-44 sm:w-56 lg:w-64 aspect-[4/5] overflow-hidden bg-[#30241F]"
          >
            <img
              src={f.src}
              alt={i < items.length ? f.name : ''}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-125"
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#1C1714]/90 to-transparent text-[#FAF8F3] translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <span className="block font-serif italic text-base leading-tight">{f.name}</span>
              <span className="block text-[11px] uppercase tracking-widest text-[#C8A974] mt-0.5">{f.technique}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export default function AboutBrand() {
  return (
    <section className="relative bg-[#FAF8F3] py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-14 sm:mb-20">
        <div className="lg:col-span-6">
          <Eyebrow>About Khodal Fashion</Eyebrow>
          <SplitWords
            text="A Surat textile house, devoted to menswear."
            accent={['devoted']}
            accentClassName="italic font-serif text-[#713B43]"
            className="font-editorial text-4xl sm:text-5xl leading-[1.1] text-[#30241F]"
          />
          <Reveal delay={200} className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#AD8A53]">
            <MapPin className="w-4 h-4" /> Ring Road Textile Market, Surat, Gujarat
          </Reveal>
        </div>
        <div className="lg:col-span-6 space-y-4 text-sm sm:text-base text-[#30241F]/75 leading-relaxed">
          <Reveal delay={150}>
            <p>
              Surat is the beating heart of India’s textile trade, and it is where every Khodal Fashion fabric is
              designed, embroidered, finished and inspected. We focus on one thing only — embroidered fabrics for
              men’s ethnic wear.
            </p>
          </Reveal>
          <Reveal delay={250}>
            <p>
              We supply unstitched fabric by the metre and take on custom embroidery job-work for labels across
              India and abroad. Modern multi-head machines give us scale and consistency; experienced hands give
              every roll its finish.
            </p>
          </Reveal>
          <Reveal delay={350}>
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 pt-2 text-xs uppercase tracking-widest font-semibold text-[#713B43] hover:text-[#30241F]"
            >
              Read our story <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>

      <div className="marquee-pause space-y-4 -rotate-2 scale-105">
        <MarqueeRow items={ROW_A} />
        <MarqueeRow items={ROW_B} reverse />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#AD8A53]/25 border border-[#AD8A53]/25">
        {[
          ['Unstitched', 'Fabric by the metre'],
          ['B2B only', 'Trade partners, not retail'],
          ['Job-work', 'Your design, our machines'],
          ['Worldwide', 'Insured cargo dispatch'],
        ].map(([k, v], i) => (
          <Reveal key={k} delay={i * 90} className="bg-[#FAF8F3] p-5 sm:p-7">
            <p className="font-editorial text-xl sm:text-2xl text-[#30241F]">{k}</p>
            <p className="mt-1 text-[13px] sm:text-xs uppercase tracking-widest text-[#30241F]/70">{v}</p>
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  );
}
