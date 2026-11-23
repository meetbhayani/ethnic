'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, ArrowRight, MessageCircle } from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';

export default function ProcessQualityPage() {
  const { openEnquiryModal, generateWhatsAppUrl } = useEnquiry();

  const steps = [
    {
      num: '01',
      title: 'Explore the Fabric Catalogue',
      desc: 'Browse our curated designs by category (Sherwani, Kurta, Jodhpuri, Indo-Western) or search by specific design codes like KF-ZAR-901.',
    },
    {
      num: '02',
      title: 'Share Selected Design & Required Metres',
      desc: 'Click "Enquire for Price" or send the code directly over WhatsApp along with your estimated meterage (sample strike-off or bulk yardage).',
    },
    {
      num: '03',
      title: 'Discuss Availability & Commercial Pricing',
      desc: 'Our commercial team confirms real-time ready-stock rolls in Surat, calculates volume tier rates, and clarifies current dispatch timelines.',
    },
    {
      num: '04',
      title: 'Confirm Specifications & Order Details',
      desc: 'Review shade cards, width confirmations (44" to 48"), GST invoicing parameters, and approved delivery logistics channels.',
    },
    {
      num: '05',
      title: 'Coordinate Production or Dispatch',
      desc: 'Ready-stock cuts are dispatched within 24-48 hours. Custom embroidery orders enter scheduled production bays with progress updates.',
    },
    {
      num: '06',
      title: 'Receive Order Updates & Cargo Tracking',
      desc: 'Direct tracking airway bill (AWB) or transport receipts are sent via WhatsApp. Rolls arrive double-wrapped in moisture barrier layers.',
    },
  ];

  return (
    <div className="bg-[#FAF8F3] text-[#30241F] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-[#AD8A53]/25 pb-8 mb-12">
        <span className="text-[10px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-2">
          Transparent B2B Journey
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#30241F] mb-4">
          Our Process & Quality Standards
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[#30241F]/80 font-sans max-w-3xl leading-relaxed">
          How commercial enquiries are handled with speed, precision, and complete clarity from our Surat headquarters to your workshop cutting table.
        </p>
      </div>

      {/* 6-Step Buyer Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {steps.map((step) => (
          <div
            key={step.num}
            className="bg-[#FAF8F3] border border-[#AD8A53]/25 p-6 hover:border-[#AD8A53] transition-all flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-3xl font-bold text-[#AD8A53] block mb-2">
                {step.num}
              </span>
              <h3 className="font-editorial text-xl text-[#30241F] mb-2">{step.title}</h3>
              <p className="text-xs text-[#30241F]/80 font-sans leading-relaxed">{step.desc}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#AD8A53]/15 flex items-center gap-1.5 text-[10px] text-[#713B43] uppercase tracking-wider font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Protocol
            </div>
          </div>
        ))}
      </div>

      {/* Quality Control Parameters */}
      <div className="bg-[#252321] text-[#FAF8F3] p-8 sm:p-12 border border-[#AD8A53]/30 mb-16">
        <div className="max-w-2xl mb-8">
          <span className="text-[10px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-1">
            Inspection Protocol
          </span>
          <h2 className="font-editorial text-3xl text-[#FAF8F3]">
            Surat Quality Gate Checkpoints
          </h2>
          <p className="text-xs text-[#C9BBA7] font-sans mt-2">
            Every metre undergoes strict multi-point physical scrutiny before roll packaging.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
          <div className="p-4 bg-[#30241F] border border-[#AD8A53]/20 space-y-2">
            <h4 className="font-semibold text-sm text-[#FAF8F3]">1. Light-Table Transparency</h4>
            <p className="text-[#C9BBA7] leading-relaxed">
              Detection of pinholes, weft slubs, or irregular yarn counts before mounting onto embroidery machine bays.
            </p>
          </div>

          <div className="p-4 bg-[#30241F] border border-[#AD8A53]/20 space-y-2">
            <h4 className="font-semibold text-sm text-[#FAF8F3]">2. Bullion & Bead Anchor Audit</h4>
            <p className="text-[#C9BBA7] leading-relaxed">
              Ensuring lockstitches are secure so cutdana and sequins do not detach during garment cutting or edge serging.
            </p>
          </div>

          <div className="p-4 bg-[#30241F] border border-[#AD8A53]/20 space-y-2">
            <h4 className="font-semibold text-sm text-[#FAF8F3]">3. Moisture-Proof Roll Packing</h4>
            <p className="text-[#C9BBA7] leading-relaxed">
              Textiles are rolled on heavy cardboard tubes and enveloped in triple-layer poly film to prevent humidity ingress in transit.
            </p>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => openEnquiryModal()}
          className="px-8 py-3.5 bg-[#30241F] text-[#FAF8F3] text-xs uppercase tracking-widest font-semibold hover:bg-[#252321] transition-colors"
        >
          Submit Commercial Enquiry
        </button>
        <Link
          href="/collections"
          className="px-8 py-3.5 border border-[#AD8A53] text-[#30241F] text-xs uppercase tracking-widest font-semibold hover:bg-[#F4EFE6] transition-colors"
        >
          Explore Catalogue Weaves
        </Link>
      </div>
    </div>
  );
}
