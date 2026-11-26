'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Boxes, Clock, Palette, Ruler, Truck, Wand2 } from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';
import { useHomeFabrics } from './useHomeFabrics';
import { Eyebrow, Reveal, SplitWords } from './motion';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const MODES = {
  ready: {
    label: 'Ready Stock',
    headline: 'In the warehouse. On its way.',
    text: 'Running catalogue designs, already embroidered and inspected. Choose a design code, confirm the metres, and we dispatch.',
    facts: [
      { icon: Ruler, k: 'Minimum order', v: '10–15 m per design' },
      { icon: Truck, k: 'Dispatch', v: '24–48 business hours' },
      { icon: Boxes, k: 'Best for', v: 'Retail restocks & fast seasons' },
    ],
    steps: ['Pick a design code', 'Confirm metres & colour', 'Packed & dispatched from Surat'],
    fallbackIds: ['red-sequin-lattice', 'purple-zari-vine', 'gold-pearl-net'],
    note: 'Hello Khodal Fashion, I would like to check ready-stock availability for your fabrics.',
  },
  custom: {
    label: 'Made to Order',
    headline: 'Your design. Our machines.',
    text: 'A catalogue design re-worked for your label — your colours, your choice of base, your placement. Sample first, then production.',
    facts: [
      { icon: Ruler, k: 'Minimum order', v: '10–15 m per design' },
      { icon: Clock, k: 'Lead time', v: '10–25 business days' },
      { icon: Palette, k: 'Customise', v: 'Colour, base, motif, placement' },
    ],
    steps: ['Share sketch or reference', 'Digitising & sample strike-off', 'Approval, then bulk production'],
    fallbackIds: ['teal-floral-applique', 'gold-pearl-geometric', 'beige-leaf-pearl'],
    note: 'Hello Khodal Fashion, I would like to discuss a made-to-order / custom embroidery fabric.',
  },
} as const;

type Mode = keyof typeof MODES;

export default function StockOrMade() {
  const [mode, setMode] = useState<Mode>('ready');
  const { generateWhatsAppUrl } = useEnquiry();
  const { live, list, take, pick } = useHomeFabrics();
  const m = MODES[mode];
  // Ready Stock shows products marked ready stock; Made to Order shows the others (Admin → Products).
  const matching = list.filter((f) => (mode === 'ready' ? f.readyStock !== false : f.readyStock === false));
  const images = live
    ? take(3, matching.length ? matching : list)
    : m.fallbackIds.map((id) => pick(id));

  return (
    <section className="relative bg-[#FAF8F3] py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="flex justify-center">
            <Eyebrow>Two Ways to Order</Eyebrow>
          </div>
          <SplitWords
            text="Ready Stock & Made to Order."
            accent={['&']}
            accentClassName="italic font-serif text-[#713B43]"
            className="font-editorial text-4xl sm:text-5xl leading-[1.1] text-[#30241F]"
          />
        </div>

        {/* Toggle */}
        <Reveal delay={200} className="mt-10 flex justify-center">
          <div role="tablist" className="relative grid grid-cols-2 p-1.5 bg-[#F4EFE6] border border-[#AD8A53]/30 rounded-full w-full max-w-md">
            <span
              aria-hidden
              className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] rounded-full bg-[#30241F] shadow-lg transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.18,1)]"
              style={{ transform: mode === 'custom' ? 'translateX(100%)' : 'translateX(0)' }}
            />
            {(Object.keys(MODES) as Mode[]).map((key) => (
              <button
                key={key}
                role="tab"
                aria-selected={mode === key}
                onClick={() => setMode(key)}
                className={`relative z-10 py-3 text-[13px] sm:text-xs uppercase tracking-widest font-semibold transition-colors duration-500 ${
                  mode === key ? 'text-[#FAF8F3]' : 'text-[#30241F]/70 hover:text-[#30241F]'
                }`}
              >
                {MODES[key].label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Fanned fabric stack */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative h-[360px] sm:h-[440px] flex items-center justify-center">
              {images.map((f, i) => {
                const rot = [-10, 4, 14][i];
                const x = [-30, 0, 30][i];
                return (
                  <div
                    key={`${mode}-${f.id}`}
                    className="absolute w-[52%] sm:w-[46%] aspect-[3/4] hover:!z-10"
                    style={{ transform: `translateX(${x}%) rotate(${rot}deg)`, zIndex: i }}
                  >
                    <div
                      className="w-full h-full border-[6px] border-[#FAF8F3] shadow-2xl overflow-hidden animate-fade-up-in"
                      style={{ animationDelay: `${i * 120}ms` }}
                    >
                      <img
                        src={f.src}
                        alt={f.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                    </div>
                  </div>
                );
              })}
              <span
                key={mode}
                className={`absolute top-2 right-2 sm:right-8 z-20 px-4 py-2 text-[12px] uppercase tracking-widest font-semibold shadow-lg animate-fade-up-in ${
                  mode === 'ready' ? 'bg-emerald-700 text-white' : 'bg-[#713B43] text-[#FAF8F3]'
                }`}
              >
                {mode === 'ready' ? '● In stock' : '✦ Custom'}
              </span>
            </div>
          </div>

          {/* Details */}
          <div key={mode} className="lg:col-span-6 order-1 lg:order-2 animate-fade-up-in">
            <h3 className="font-editorial text-3xl sm:text-4xl text-[#30241F]">{m.headline}</h3>
            <p className="mt-4 text-sm sm:text-base text-[#30241F]/75 leading-relaxed">{m.text}</p>

            <dl className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {m.facts.map((f, i) => (
                <div
                  key={f.k}
                  className="bg-[#F4EFE6] border border-[#AD8A53]/20 p-4 animate-fade-up-in"
                  style={{ animationDelay: `${100 + i * 90}ms` }}
                >
                  <f.icon className="w-5 h-5 text-[#AD8A53]" />
                  <dt className="mt-3 text-[11px] uppercase tracking-widest text-[#30241F]/70">{f.k}</dt>
                  <dd className="mt-1 text-sm font-semibold text-[#30241F]">{f.v}</dd>
                </div>
              ))}
            </dl>

            <ol className="mt-8 space-y-3">
              {m.steps.map((s, i) => (
                <li
                  key={s}
                  className="flex items-center gap-4 animate-fade-up-in"
                  style={{ animationDelay: `${250 + i * 90}ms` }}
                >
                  <span className="w-8 h-8 shrink-0 rounded-full border border-[#AD8A53] text-[#AD8A53] font-editorial text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm text-[#30241F]">{s}</span>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={generateWhatsAppUrl({ sourcePage: `Home ${m.label}`, customNote: m.note })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#1fb757] text-white text-[13px] uppercase tracking-widest font-semibold transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
                {mode === 'ready' ? 'Check availability' : 'Discuss a custom design'}
              </a>
              <a
                href={mode === 'ready' ? '/collections' : '/wholesale-b2b'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[#AD8A53] text-[#30241F] hover:bg-[#F4EFE6] text-[13px] uppercase tracking-widest font-semibold"
              >
                {mode === 'ready' ? 'Browse catalogue' : (
                  <>
                    <Wand2 className="w-4 h-4 text-[#AD8A53]" /> Wholesale details
                  </>
                )}
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
