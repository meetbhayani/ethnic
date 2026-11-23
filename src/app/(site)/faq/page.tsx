'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';
import { FAQS_DATA } from '@/data/faqs';
import { useEnquiry } from '@/context/EnquiryContext';

export default function FAQPage() {
  const { generateWhatsAppUrl } = useEnquiry();
  const [activeFaq, setActiveFaq] = useState<string | null>(FAQS_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'Products & Fabric Offerings', label: 'Products & Fabrics' },
    { id: 'Orders & Pricing', label: 'Orders, MOQs & Prices' },
    { id: 'Samples & Swatches', label: 'Samples & Swatches' },
    { id: 'Custom Job Work & Design', label: 'Custom Job-Work' },
    { id: 'AI Virtual Try-On', label: 'AI Try-On' },
    { id: 'Dispatch & Logistics', label: 'Dispatch & Shipping' },
  ];

  const filteredFaqs = FAQS_DATA.filter((faq) => {
    if (selectedCategory !== 'all' && faq.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="bg-[#FAF8F3] text-[#30241F] py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-[#AD8A53]/25 pb-8 mb-10 text-center">
        <span className="text-[10px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-2">
          Buyer Knowledge Base
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#30241F] mb-4">
          Commercial Buyer FAQ
        </h1>
        <p className="text-xs sm:text-sm text-[#30241F]/80 font-sans max-w-2xl mx-auto leading-relaxed">
          Comprehensive answers to common procurement, sampling, MOQ, custom embroidery, and AI try-on inquiries.
        </p>

        {/* Search Input */}
        <div className="max-w-xl mx-auto mt-6 relative">
          <Search className="w-4 h-4 text-[#AD8A53] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search FAQ questions (e.g. MOQ, Job Work, Pricing, AI)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 pl-10 pr-4 py-2.5 text-xs font-sans text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-sans transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-[#30241F] text-[#FAF8F3] border-[#30241F] font-semibold'
                  : 'bg-[#FAF8F3] text-[#30241F] border-[#AD8A53]/30 hover:border-[#AD8A53]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3 mb-16">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = activeFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-[#AD8A53]/25 bg-[#FAF8F3] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#F4EFE6]/50 transition-colors"
                >
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#AD8A53] font-mono block mb-0.5">
                      {faq.category}
                    </span>
                    <span className="font-serif text-base sm:text-lg text-[#30241F] font-medium">
                      {faq.question}
                    </span>
                  </div>
                  <span
                    className={`text-[#AD8A53] font-mono text-xl transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-[#30241F]/85 leading-relaxed font-sans border-t border-[#AD8A53]/10 bg-[#F4EFE6]/30">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-[#F4EFE6] border border-[#AD8A53]/30 p-6">
            <p className="text-sm font-serif text-[#30241F]">No questions match your query.</p>
            <p className="text-xs text-[#30241F]/70 mt-1">
              Ask our Surat commercial desk directly on WhatsApp.
            </p>
          </div>
        )}
      </div>

      {/* Unresolved Questions Banner */}
      <div className="bg-[#252321] text-[#FAF8F3] p-8 border border-[#AD8A53]/30 text-center">
        <h3 className="font-editorial text-2xl text-[#FAF8F3] mb-2">Have a Specific Commercial Query?</h3>
        <p className="text-xs text-[#C9BBA7] font-sans max-w-md mx-auto mb-6">
          Our Surat sales managers are available on WhatsApp to answer meterage, strike-off, and custom embroidery queries.
        </p>
        <a
          href={generateWhatsAppUrl({ sourcePage: 'FAQ Unresolved Questions' })}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#AD8A53] hover:bg-[#91703E] text-[#FAF8F3] text-xs uppercase tracking-widest font-semibold transition-colors shadow"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat on WhatsApp Desk</span>
        </a>
      </div>
    </div>
  );
}
