'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';
import { CraftPageContent, CraftTechnique, craftAnchor } from '@/lib/craftsmanship';

/** The Craftsmanship page. All text and techniques come from Admin → Craftsmanship. */
export default function CraftsmanshipView({ content, techniques }: { content: CraftPageContent; techniques: CraftTechnique[] }) {
  const { openEnquiryModal } = useEnquiry();

  return (
    <div className="bg-[#FAF8F3] text-[#30241F]">
      {/* Editorial Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#AD8A53]/25">
        <div className="max-w-3xl">
          {content.eyebrow && (
            <span className="text-[12px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-2">{content.eyebrow}</span>
          )}
          <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#30241F] mb-6 leading-tight">
            {content.title}
            {content.titleAccent && (
              <>
                <br />
                <span className="italic font-serif text-[#713B43]">{content.titleAccent}</span>
              </>
            )}
          </h1>
          {content.intro && (
            <p className="text-xs sm:text-sm md:text-base text-[#30241F]/80 font-sans leading-relaxed whitespace-pre-line">
              {content.intro}
            </p>
          )}
        </div>
      </section>

      {/* Technique sections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
        {techniques.map((craft, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div key={craft.id} id={craftAnchor(craft.title)} className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Image Frame */}
              <div className={`lg:col-span-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="relative aspect-[4/3] bg-[#F4EFE6] border border-[#AD8A53]/30 overflow-hidden shadow-xl group">
                  {craft.image && (
                    <img
                      src={craft.image}
                      alt={craft.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute bottom-3 left-3 right-3 bg-[#252321]/80 backdrop-blur-sm text-[#FAF8F3] p-2.5 text-[12px] uppercase tracking-wider flex justify-between items-center">
                    <span>Surat Atelier Specimen</span>
                    <span className="text-[#AD8A53] font-mono">CRAFT #{idx + 1}</span>
                  </div>
                </div>
              </div>

              {/* Text Description */}
              <div className={`lg:col-span-6 ${isEven ? 'lg:order-2' : 'lg:order-1'} space-y-4`}>
                {craft.subtitle && (
                  <span className="text-[12px] uppercase tracking-widest text-[#713B43] font-semibold">{craft.subtitle}</span>
                )}
                <h2 className="font-editorial text-3xl sm:text-4xl text-[#30241F]">{craft.title}</h2>
                <div className="w-12 h-[2px] bg-[#AD8A53]" />

                {craft.description && (
                  <p className="text-xs sm:text-sm text-[#30241F]/80 font-sans leading-relaxed whitespace-pre-line">{craft.description}</p>
                )}

                {craft.best_for && (
                  <p className="text-xs sm:text-sm font-sans">
                    <span className="uppercase tracking-wider text-[12px] font-semibold text-[#AD8A53]">Best for: </span>
                    <span className="text-[#30241F]">{craft.best_for}</span>
                  </p>
                )}

                {(craft.machine_work || craft.hand_work) && (
                  <div className="bg-[#F4EFE6] border border-[#AD8A53]/25 p-4 space-y-2 text-xs font-sans">
                    {craft.machine_work && (
                      <div>
                        <strong className="block text-[13px] uppercase tracking-wider text-[#AD8A53]">Machine Work:</strong>
                        <span className="text-[#30241F]/80">{craft.machine_work}</span>
                      </div>
                    )}
                    {craft.hand_work && (
                      <div className={craft.machine_work ? 'pt-2 border-t border-[#AD8A53]/15' : ''}>
                        <strong className="block text-[13px] uppercase tracking-wider text-[#713B43]">Hand Work:</strong>
                        <span className="text-[#30241F]/80">{craft.hand_work}</span>
                      </div>
                    )}
                  </div>
                )}

                {craft.features.length > 0 && (
                  <div className="pt-2">
                    <span className="block text-[12px] uppercase tracking-widest text-[#AD8A53] font-semibold mb-2">Key Fabric Attributes:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-[#30241F]">
                      {craft.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#AD8A53] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Quality steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#AD8A53]/20 bg-[#F4EFE6]/50">
        {(content.qualityTitle || content.steps.length > 0) && (
          <>
            <div className="max-w-3xl mx-auto text-center mb-12">
              {content.qualityEyebrow && (
                <span className="text-[12px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-2">{content.qualityEyebrow}</span>
              )}
              {content.qualityTitle && <h2 className="font-editorial text-3xl sm:text-4xl text-[#30241F]">{content.qualityTitle}</h2>}
              {content.qualityIntro && <p className="text-xs sm:text-sm text-[#30241F]/80 font-sans mt-2">{content.qualityIntro}</p>}
            </div>

            {content.steps.length > 0 && (
              <ol
                className={`grid grid-cols-1 gap-6 ${
                  content.steps.length >= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : content.steps.length === 2 ? 'md:grid-cols-2' : 'max-w-xl mx-auto'
                }`}
              >
                {content.steps.map((step, i) => (
                  <li key={i} className="relative flex flex-col bg-[#FAF8F3] border border-[#AD8A53]/25 p-6 sm:p-7">
                    <div className="flex items-baseline gap-3 border-b border-[#AD8A53]/20 pb-3 mb-4">
                      <span className="font-mono text-3xl text-[#AD8A53] font-semibold leading-none">{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="font-editorial text-xl sm:text-2xl text-[#30241F] leading-tight">{step.title}</h3>
                    </div>
                    {step.subtitle && (
                      <p className="italic font-serif text-[#713B43] text-base mb-3">{step.subtitle}</p>
                    )}
                    <p className="text-xs sm:text-sm text-[#30241F]/80 font-sans leading-relaxed whitespace-pre-line">{step.text}</p>
                  </li>
                ))}
              </ol>
            )}
          </>
        )}

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <button
            onClick={() => openEnquiryModal()}
            className="px-8 py-3.5 bg-[#30241F] hover:bg-[#252321] text-[#FAF8F3] text-xs uppercase tracking-widest font-sans font-semibold transition-colors shadow"
          >
            {content.ctaPrimary || 'Enquire Now'}
          </button>
          {content.ctaSecondary && (
            <Link
              href="/collections"
              className="px-8 py-3.5 border border-[#AD8A53] text-[#30241F] hover:bg-[#FAF8F3] text-xs uppercase tracking-widest font-sans font-semibold transition-colors"
            >
              {content.ctaSecondary}
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
