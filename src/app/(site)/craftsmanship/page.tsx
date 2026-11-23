'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Scissors,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';
import { CRAFTS_DATA } from '@/data/crafts';

export default function CraftsmanshipPage() {
  const { openEnquiryModal, generateWhatsAppUrl } = useEnquiry();

  return (
    <div className="bg-[#FAF8F3] text-[#30241F]">
      {/* Editorial Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#AD8A53]/25">
        <div className="max-w-3xl">
          <span className="text-[10px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-2">
            The Surat Atelier Standards
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#30241F] mb-6 leading-tight">
            Craftsmanship & <br />
            <span className="italic font-serif text-[#713B43]">Royal Embroidery</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#30241F]/80 font-sans leading-relaxed">
            At Khodal Fashion, embroidery is not a superficial surface embellishment—it is an architectural discipline. We engineer unstitched men’s ethnic textiles that retain tension, luster, and razor-sharp drape through heavy bespoke tailoring.
          </p>
        </div>
      </section>

      {/* Craft Deep Dives */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
        {CRAFTS_DATA.map((craft, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={craft.id}
              id={craft.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
                isEven ? '' : 'lg:flex-row-reverse'
              }`}
            >
              {/* Image Frame */}
              <div className={`lg:col-span-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="relative aspect-[4/3] bg-[#F4EFE6] border border-[#AD8A53]/30 overflow-hidden shadow-xl group">
                  <img
                    src={craft.image}
                    alt={craft.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-[#252321]/80 backdrop-blur-sm text-[#FAF8F3] p-2.5 text-[10px] uppercase tracking-wider flex justify-between items-center">
                    <span>Surat Atelier Specimen</span>
                    <span className="text-[#AD8A53] font-mono">CRAFT #{idx + 1}</span>
                  </div>
                </div>
              </div>

              {/* Text Description */}
              <div className={`lg:col-span-6 ${isEven ? 'lg:order-2' : 'lg:order-1'} space-y-4`}>
                <span className="text-[10px] uppercase tracking-widest text-[#713B43] font-semibold">
                  {craft.subtitle}
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl text-[#30241F]">
                  {craft.title}
                </h2>
                <div className="w-12 h-[2px] bg-[#AD8A53]" />

                <p className="text-xs sm:text-sm text-[#30241F]/80 font-sans leading-relaxed">
                  {craft.description}
                </p>

                <div className="bg-[#F4EFE6] border border-[#AD8A53]/25 p-4 space-y-2 text-xs font-sans">
                  <div>
                    <strong className="text-[#30241F] block text-[11px] uppercase tracking-wider text-[#AD8A53]">
                      Computerized Machinery Execution:
                    </strong>
                    <span className="text-[#30241F]/80">{craft.machineTech}</span>
                  </div>
                  <div className="pt-2 border-t border-[#AD8A53]/15">
                    <strong className="text-[#30241F] block text-[11px] uppercase tracking-wider text-[#713B43]">
                      Artisanal Hand Touch:
                    </strong>
                    <span className="text-[#30241F]/80">{craft.handTouch}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="block text-[10px] uppercase tracking-widest text-[#AD8A53] font-semibold mb-2">
                    Key Fabric Attributes:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-sans text-[#30241F]">
                    {craft.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#AD8A53] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Production & Workshop Integrity */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#AD8A53]/20 bg-[#F4EFE6]/50">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-[10px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-2">
            Factory Floor Standards
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#30241F]">
            How We Guarantee Zero-Defect Production
          </h2>
          <p className="text-xs sm:text-sm text-[#30241F]/80 font-sans mt-2">
            Every metre of unstitched fabric passes through three mandatory quality gates before roll packaging.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FAF8F3] border border-[#AD8A53]/25 p-6">
            <span className="font-mono text-2xl text-[#AD8A53] font-semibold mb-2 block">01</span>
            <h3 className="font-editorial text-xl text-[#30241F] mb-2">Yarn & Spangle Sourcing</h3>
            <p className="text-xs text-[#30241F]/80 font-sans leading-relaxed">
              We exclusively use tested non-tarnish metallic bullion wires, colorfast vat-dyed resham filament, and lead-free bevelled glass beads.
            </p>
          </div>

          <div className="bg-[#FAF8F3] border border-[#AD8A53]/25 p-6">
            <span className="font-mono text-2xl text-[#AD8A53] font-semibold mb-2 block">02</span>
            <h3 className="font-editorial text-xl text-[#30241F] mb-2">Tension-Calibrated Bays</h3>
            <p className="text-xs text-[#30241F]/80 font-sans leading-relaxed">
              Our multi-head frames operate with computerized thread-break detectors, ensuring no skipped stitches or puckered bases on delicate organza.
            </p>
          </div>

          <div className="bg-[#FAF8F3] border border-[#AD8A53]/25 p-6">
            <span className="font-mono text-2xl text-[#AD8A53] font-semibold mb-2 block">03</span>
            <h3 className="font-editorial text-xl text-[#30241F] mb-2">Reverse Side Trimming</h3>
            <p className="text-xs text-[#30241F]/80 font-sans leading-relaxed">
              Every reverse thread extremity is hand-trimmed and inspected over illuminated inspection tables, preventing snagging during customer garment tailoring.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button
            onClick={() => openEnquiryModal()}
            className="px-8 py-3.5 bg-[#30241F] hover:bg-[#252321] text-[#FAF8F3] text-xs uppercase tracking-widest font-sans font-semibold transition-colors shadow mr-4"
          >
            Discuss Custom Embroidery Requirements
          </button>
          <Link
            href="/collections"
            className="px-8 py-3.5 border border-[#AD8A53] text-[#30241F] hover:bg-[#FAF8F3] text-xs uppercase tracking-widest font-sans font-semibold transition-colors"
          >
            Browse Catalogue Fabrics
          </Link>
        </div>
      </section>
    </div>
  );
}
