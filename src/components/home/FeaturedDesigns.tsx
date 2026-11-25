'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Eye, Sparkles } from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';
import FabricLoupe from './FabricLoupe';
import { productPhotos } from '@/lib/fabrics';
import { Eyebrow, Reveal, SplitWords } from './motion';
import WhatsAppIcon from '@/components/WhatsAppIcon';

export default function FeaturedDesigns() {
  const { fabrics, openEnquiryModal, generateWhatsAppUrl } = useEnquiry();
  // Exactly the products switched to "Featured" in Admin → Products, in their sort order.
  // The section is hidden when none are featured.
  const featured = useMemo(() => fabrics.filter((f) => f.featured), [fabrics]);
  const [activeId, setActiveId] = useState<string | null>(null);

  if (featured.length === 0) return null;
  const active = featured.find((f) => f.id === activeId) ?? featured[0];
  const gallery = productPhotos(active).slice(0, 3).map((p) => p.src);

  return (
    <section className="relative bg-[#FAF8F3] py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="flex justify-center">
            <Eyebrow>Featured Designs</Eyebrow>
          </div>
          <SplitWords
            text="Selected With Distinction."
            accent={['Distinction.']}
            accentClassName="italic font-serif text-[#713B43]"
            className="font-editorial text-4xl sm:text-5xl leading-[1.1] text-[#30241F]"
          />
          <Reveal delay={200}>
            <p className="mt-5 text-sm sm:text-base text-[#30241F]/75">
              Each design carries its own code for easy reference. Pick one, then move across the fabric to study
              every stitch.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Stage */}
          <Reveal variant="scale" className="lg:col-span-7 lg:sticky lg:top-28">
            <div className="relative">
              <div key={active.id} className="animate-fade-up-in">
                <FabricLoupe
                  src={active.mainImage}
                  alt={active.name}
                  className="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/3] border border-[#AD8A53]/30 shadow-2xl bg-[#F4EFE6]"
                  imgClassName="transition-transform duration-[2000ms]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1C1714]/85 via-transparent to-transparent" />
                  <div className="pointer-events-none absolute left-5 right-5 bottom-5 text-[#FAF8F3]">
                    <span className="font-mono text-[12px] tracking-widest text-[#C8A974] bg-[#1C1714]/70 px-2 py-1 border border-[#C8A974]/40">
                      {active.code}
                    </span>
                    <h3 className="mt-3 font-editorial text-2xl sm:text-3xl">{active.name}</h3>
                    <p className="text-xs text-[#E9DFCF]/80 mt-1">
                      {active.baseFabric} · {active.embroideryTypeLabel}
                    </p>
                  </div>
                </FabricLoupe>
              </div>
              {gallery.length > 1 && (
                <div className="hidden sm:flex absolute -right-3 top-6 flex-col gap-2 z-30">
                  {gallery.slice(1).map((src, i) => (
                    <div
                      key={src + i}
                      className="w-20 h-20 border-2 border-[#FAF8F3] shadow-xl overflow-hidden animate-fade-up-in"
                      style={{ animationDelay: `${200 + i * 120}ms` }}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/* Selector list */}
          <div className="lg:col-span-5">
            <ul className="divide-y divide-[#AD8A53]/20 border-y border-[#AD8A53]/20">
              {featured.map((f, i) => {
                const isActive = f.id === active.id;
                return (
                  <Reveal as="li" key={f.id} delay={i * 80} variant="left">
                    <button
                      type="button"
                      onClick={() => setActiveId(f.id)}
                      onPointerEnter={(e) => e.pointerType === 'mouse' && setActiveId(f.id)}
                      aria-pressed={isActive}
                      className={`group w-full flex items-center gap-4 py-4 text-left transition-colors ${
                        isActive ? '' : 'hover:bg-[#F4EFE6]/60'
                      }`}
                    >
                      <span
                        className={`relative w-16 h-16 sm:w-[72px] sm:h-[72px] shrink-0 overflow-hidden transition-all duration-500 ${
                          isActive ? 'rounded-full ring-2 ring-[#AD8A53] ring-offset-2 ring-offset-[#FAF8F3]' : 'rounded-none'
                        }`}
                      >
                        <img src={f.mainImage} alt="" className="w-full h-full object-cover" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-[12px] tracking-widest text-[#AD8A53]">{f.code}</span>
                          <span
                            className={`text-[11px] uppercase tracking-wider px-1.5 py-0.5 border ${
                              f.readyStock
                                ? 'text-emerald-800 border-emerald-300 bg-emerald-50'
                                : 'text-[#713B43] border-[#713B43]/30 bg-rose-50'
                            }`}
                          >
                            {f.readyStock ? 'Ready Stock' : 'Made to Order'}
                          </span>
                        </span>
                        <span
                          className={`block font-editorial text-lg sm:text-xl leading-tight mt-1 truncate transition-colors ${
                            isActive ? 'text-[#713B43]' : 'text-[#30241F]'
                          }`}
                        >
                          {f.name}
                        </span>
                        <span className="block text-xs text-[#30241F]/75 truncate">{f.embroideryTypeLabel}</span>
                      </span>
                      <ArrowUpRight
                        className={`w-5 h-5 shrink-0 transition-all duration-500 ${
                          isActive ? 'text-[#713B43] rotate-45' : 'text-[#AD8A53]/50 group-hover:text-[#AD8A53]'
                        }`}
                      />
                    </button>
                  </Reveal>
                );
              })}
            </ul>

            {/* Actions for the active design */}
            <div key={active.id} className="mt-6 animate-fade-up-in">
              <p className="text-sm text-[#30241F]/75 leading-relaxed line-clamp-3">{active.description}</p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#F4EFE6] px-3 py-2.5">
                  <dt className="text-[11px] uppercase tracking-widest text-[#AD8A53]">Width</dt>
                  <dd className="font-semibold text-[#30241F] mt-0.5">{active.width || '44 Inches'}</dd>
                </div>
                <div className="bg-[#F4EFE6] px-3 py-2.5">
                  <dt className="text-[11px] uppercase tracking-widest text-[#AD8A53]">MOQ</dt>
                  <dd className="font-semibold text-[#30241F] mt-0.5">{active.moq || '25 Metres'}</dd>
                </div>
              </dl>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => openEnquiryModal(active)}
                  className="col-span-2 py-3 bg-[#30241F] hover:bg-[#1C1714] text-[#FAF8F3] text-[13px] uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  Enquire for Price <ArrowUpRight className="w-4 h-4 text-[#C8A974]" />
                </button>
                <Link
                  href={`/collections/${active.id}`}
                  className="py-2.5 border border-[#AD8A53] text-[#30241F] hover:bg-[#F4EFE6] text-[12px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-[#AD8A53]" /> Details
                </Link>
                <a
                  href={generateWhatsAppUrl({
                    productCode: active.code,
                    productName: active.name,
                    sourcePage: 'Home Featured Designs',
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 bg-[#25D366] hover:bg-[#1fb757] text-white text-[12px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" /> WhatsApp
                </a>
                <Link
                  href={`/ai-tryon?fabric=${active.id}`}
                  className="col-span-2 py-2.5 text-[#713B43] hover:text-[#30241F] text-[12px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#AD8A53]" /> Preview with AI Try-On
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
