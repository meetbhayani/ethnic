'use client';

import React, { useState } from 'react';
import { MessageCircle, X, ArrowUpRight } from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';

export default function WhatsAppSticky() {
  const [minimized, setMinimized] = useState(true);
  const { generateWhatsAppUrl } = useEnquiry();

  const directUrl = generateWhatsAppUrl({
    sourcePage: 'Floating Concierge',
    customNote: 'Hello Khodal Fashion team, I am looking to enquire about your men’s ethnic fabric collections and wholesale prices.',
  });

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end pointer-events-none">
      {/* Expanded Popover (Only when user explicitly clicks to expand) */}
      {!minimized && (
        <div className="mb-2 bg-[#FAF8F3] border border-[#AD8A53] text-[#30241F] p-3.5 shadow-2xl max-w-xs transition-all pointer-events-auto animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#AD8A53]/20 pb-1.5 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[12px] uppercase tracking-widest font-semibold text-[#713B43]">
                Surat Sales Desk
              </span>
            </div>
            <button
              onClick={() => setMinimized(true)}
              className="text-[#7A6A58] hover:text-[#30241F] p-1"
              aria-label="Minimize desk notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-[#30241F] leading-tight mb-2.5">
            Instant B2B fabric pricing, swatch kit dispatch, or custom embroidery job-work?
          </p>
          <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#AD8A53] hover:bg-[#91703E] text-[#FAF8F3] py-1.5 px-3 text-[13px] uppercase tracking-wider font-medium shadow-sm transition-colors"
          >
            <span>Open WhatsApp Chat</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {minimized && (
          <button
            onClick={() => setMinimized(false)}
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#FAF8F3]/95 border border-[#AD8A53]/40 shadow-lg px-2.5 py-1 text-[12px] uppercase tracking-wider font-semibold text-[#30241F] hover:bg-[#FAF8F3] transition-colors rounded-full"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Surat Desk</span>
          </button>
        )}

        <a
          href={directUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Connect with Khodal Fashion on WhatsApp"
          className="group relative flex items-center justify-center w-12 h-12 bg-[#25D366] hover:bg-[#20b858] text-white rounded-full shadow-2xl transition-transform hover:scale-105"
        >
          <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
          <span className="sr-only">WhatsApp Enquiry</span>
        </a>
      </div>
    </div>
  );
}
