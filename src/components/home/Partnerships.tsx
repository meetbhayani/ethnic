'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Building2, Gem, PencilRuler, Store } from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';
import { useHomeFabrics } from './useHomeFabrics';
import { Eyebrow, Reveal, SplitWords } from './motion';

const PARTNERS = [
  {
    icon: Store,
    who: 'Retailers',
    line: 'Keep your racks fresh with ready-stock designs and quick restocks.',
    perks: ['Ready-stock catalogue', 'Low MOQ per design', 'Fast Surat dispatch'],
    fallbackId: 'red-sequin-lattice',
  },
  {
    icon: Building2,
    who: 'Wholesalers',
    line: 'Volume pricing and consistent quality across every roll you move.',
    perks: ['Bulk meterage rates', 'Consistent shade lots', 'Regular new designs'],
    fallbackId: 'purple-zari-vine',
  },
  {
    icon: Gem,
    who: 'Boutiques',
    line: 'Distinctive fabrics in small runs, so your clients wear something rare.',
    perks: ['Swatch kits & sample cuts', 'Curated small runs', 'AI previews for clients'],
    fallbackId: 'ivory-pearl-floral',
  },
  {
    icon: PencilRuler,
    who: 'Designers',
    line: 'Catalogue designs re-coloured and produced in runs for your label.',
    perks: ['Made-to-order colourways', 'Colour & base of your choice', 'Strike-off before bulk'],
    fallbackId: 'teal-floral-applique',
  },
];

export default function Partnerships() {
  const { pick } = useHomeFabrics();
  const partners = PARTNERS.map((p, i) => ({ ...p, fabric: pick(p.fallbackId, undefined, i) }));
  const { generateWhatsAppUrl } = useEnquiry();

  const track = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--sx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--sy', `${e.clientY - r.top}px`);
  };

  return (
    <section className="relative bg-[#F4EFE6] py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-12 sm:mb-16">
          <div className="lg:col-span-7">
            <Eyebrow>Business Partnerships</Eyebrow>
            <SplitWords
              text="Built for the businesses that dress India’s grooms."
              accent={['grooms.']}
              accentClassName="italic font-serif text-[#713B43]"
              className="font-editorial text-4xl sm:text-5xl leading-[1.1] text-[#30241F]"
            />
          </div>
          <Reveal delay={200} className="lg:col-span-5">
            <p className="text-sm sm:text-base text-[#30241F]/75 leading-relaxed">
              Retailers, wholesalers, boutiques and designers — we work B2B only, with pricing and service shaped
              around how you sell.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {partners.map((p, i) => (
            <Reveal key={p.who} delay={i * 100}>
              <article
                onPointerMove={track}
                className="group relative h-full overflow-hidden bg-[#FAF8F3] border border-[#AD8A53]/25 hover:border-[#AD8A53] transition-colors duration-500 flex flex-col"
              >
                {/* Cursor spotlight */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      'radial-gradient(320px circle at var(--sx,50%) var(--sy,50%), rgba(173,138,83,0.16), transparent 60%)',
                  }}
                />
                {/* Fabric strip that expands on hover */}
                <div className="relative h-28 group-hover:h-40 transition-[height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
                  <img
                    src={p.fabric.src}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FAF8F3]" />
                  <span className="absolute left-5 bottom-0 translate-y-1/2 w-12 h-12 rounded-full bg-[#30241F] text-[#C8A974] flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:rotate-[360deg]">
                    <p.icon className="w-5 h-5" />
                  </span>
                </div>

                <div className="relative p-5 pt-9 flex flex-col flex-1">
                  <h3 className="font-editorial text-2xl text-[#30241F]">{p.who}</h3>
                  <p className="mt-2 text-[13px] text-[#30241F]/70 leading-relaxed">{p.line}</p>
                  <ul className="mt-4 space-y-2 flex-1">
                    {p.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-2 text-xs text-[#30241F]">
                        <span className="w-1.5 h-1.5 rotate-45 bg-[#AD8A53]" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={generateWhatsAppUrl({
                      sourcePage: `Home Partnerships — ${p.who}`,
                      customNote: `Hello Khodal Fashion, we are a ${p.who.toLowerCase().replace(/s$/, '')} and would like to discuss a business partnership for men’s ethnic fabrics.`,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center justify-between gap-2 py-3 border-t border-[#AD8A53]/25 text-[13px] uppercase tracking-widest font-semibold text-[#713B43] group-hover:text-[#30241F]"
                  >
                    Partner with us
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:rotate-45" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <Link
            href="/wholesale-b2b"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#30241F] border-b border-[#AD8A53] pb-1 hover:text-[#713B43]"
          >
            Wholesale & B2B terms <ArrowUpRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
