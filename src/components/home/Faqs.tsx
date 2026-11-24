'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';
import { FAQS_DATA } from '@/data/faqs';
import { useHomeFabrics } from './useHomeFabrics';
import { Eyebrow, Reveal, SplitWords } from './motion';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const FAQS = FAQS_DATA.slice(0, 6);

export default function Faqs() {
  const [open, setOpen] = useState<string | null>(FAQS[0]?.id ?? null);
  const { generateWhatsAppUrl } = useEnquiry();
  const SIDE_FABRIC = useHomeFabrics().pick('gold-pearl-net', undefined, 1);

  return (
    <section className="relative bg-[#F4EFE6] py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
          <Eyebrow>FAQs</Eyebrow>
          <SplitWords
            text="Questions, answered."
            accent={['answered.']}
            accentClassName="italic font-serif text-[#713B43]"
            className="font-editorial text-4xl sm:text-5xl leading-[1.1] text-[#30241F]"
          />
          <Reveal delay={200}>
            <p className="mt-5 text-sm text-[#30241F]/70 leading-relaxed">
              Orders, pricing, samples and dispatch — the essentials for trade buyers.
            </p>
          </Reveal>
          <Reveal delay={300} variant="unfurl" className="hidden lg:block mt-8">
            <div className="aspect-[4/3] overflow-hidden fabric-sheen" data-sheen="auto">
              <img src={SIDE_FABRIC.src} alt={SIDE_FABRIC.name} className="w-full h-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={350} className="mt-8 flex flex-col gap-3">
            <a
              href={generateWhatsAppUrl({
                sourcePage: 'Home FAQ',
                customNote: 'Hello Khodal Fashion, I have a question about your fabrics.',
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#30241F] hover:text-[#713B43]"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" /> Ask us on WhatsApp
            </a>
            <Link
              href="/faq"
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#713B43] hover:text-[#30241F]"
            >
              All FAQs <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <ul className="border-t border-[#AD8A53]/30">
            {FAQS.map((faq, i) => {
              const isOpen = open === faq.id;
              return (
                <Reveal as="li" key={faq.id} delay={i * 70} className="border-b border-[#AD8A53]/30">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`${faq.id}-panel`}
                    className="group w-full flex items-start gap-4 sm:gap-6 py-5 sm:py-6 text-left"
                  >
                    <span className="font-editorial text-sm text-[#AD8A53] pt-1 w-6 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`flex-1 font-serif text-lg sm:text-xl leading-snug transition-colors ${
                        isOpen ? 'text-[#713B43]' : 'text-[#30241F] group-hover:text-[#713B43]'
                      }`}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`shrink-0 w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-500 ${
                        isOpen
                          ? 'bg-[#30241F] border-[#30241F] text-[#C8A974] rotate-45'
                          : 'border-[#AD8A53]/50 text-[#AD8A53] group-hover:border-[#AD8A53]'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </span>
                  </button>
                  <div
                    id={`${faq.id}-panel`}
                    role="region"
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pl-10 sm:pl-12 pr-12 pb-6 text-sm text-[#30241F]/75 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
