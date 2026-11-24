'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  Layers,
  Scissors,
  Share2,
} from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';
import FabricCard from '@/components/FabricCard';
import { FabricItem } from '@/types';
import WhatsAppIcon from '@/components/WhatsAppIcon';

/** Interactive product view. Data is loaded on the server by app/(site)/collections/[id]/page.tsx. */
export default function ProductDetail({ fabric, relatedFabrics }: { fabric: FabricItem; relatedFabrics: FabricItem[] }) {
  const { openEnquiryModal, generateWhatsAppUrl } = useEnquiry();
  const [activeImageTab, setActiveImageTab] = useState<'main' | 'close' | 'macro' | 'back' | 'styled'>('main');
  const [orderQuantity, setOrderQuantity] = useState('25 Metres');

  const imageMap = {
    main: fabric.mainImage,
    close: fabric.closeUpImage,
    macro: fabric.macroImage,
    back: fabric.backsideImage,
    styled: fabric.styledModelImage,
  };

  const directWhatsAppLink = generateWhatsAppUrl({
    productCode: fabric.code,
    productName: fabric.name,
    quantity: orderQuantity,
    sourcePage: `Product Details Page (${fabric.code})`,
  });

  return (
    <div className="bg-[#FAF8F3] text-[#30241F] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb Line */}
      <div className="flex items-center gap-2 text-[13px] font-sans text-[#7A6A58] uppercase tracking-widest mb-8 border-b border-[#AD8A53]/20 pb-3">
        <Link href="/" className="hover:text-[#30241F]">Home</Link>
        <span>/</span>
        <Link href="/collections" className="hover:text-[#30241F]">Collections</Link>
        <span>/</span>
        <Link href={`/collections?category=${fabric.category}`} className="hover:text-[#30241F]">
          {fabric.categoryLabel}
        </Link>
        <span>/</span>
        <span className="text-[#AD8A53] font-mono font-semibold">{fabric.code}</span>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        {/* Left Column: Multi-Angle Imagery */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Main Visual Frame */}
          <div className="relative aspect-[4/5] bg-[#F4EFE6] border border-[#AD8A53]/30 overflow-hidden shadow-xl">
            <img
              src={imageMap[activeImageTab]}
              alt={`${fabric.name} - ${activeImageTab} view`}
              className="w-full h-full object-cover transition-all duration-700"
            />

            {/* Active Perspective Badge */}
            <div className="absolute top-4 left-4 bg-[#252321]/90 backdrop-blur-sm text-[#FAF8F3] text-[11px] uppercase tracking-widest px-3 py-1 font-mono border border-[#AD8A53]/30">
              {activeImageTab === 'main' && 'Primary Fabric Texture'}
              {activeImageTab === 'close' && 'Detailed Embroidery Stitches'}
              {activeImageTab === 'macro' && '10x Macro Stitch & Bead Density'}
              {activeImageTab === 'back' && 'Reverse Backside Seam & Thread-Trimming'}
              {activeImageTab === 'styled' && 'Styling Inspiration (Unstitched Fabric)'}
            </div>

            {fabric.readyStock && (
              <div className="absolute top-4 right-4 bg-emerald-900/90 text-white text-[11px] uppercase tracking-wider px-2.5 py-1 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Ready Stock
              </div>
            )}
          </div>

          {/* Perspective Selector Thumbnails */}
          <div className="grid grid-cols-5 gap-2">
            {[
              { id: 'main', label: 'Fabric Face', img: fabric.mainImage },
              { id: 'close', label: 'Close-up', img: fabric.closeUpImage },
              { id: 'macro', label: '10x Macro', img: fabric.macroImage },
              { id: 'back', label: 'Backside', img: fabric.backsideImage },
              { id: 'styled', label: 'Styled Look', img: fabric.styledModelImage },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveImageTab(tab.id as any)}
                className={`flex flex-col items-center p-1 border transition-all ${
                  activeImageTab === tab.id
                    ? 'border-[#713B43] bg-[#F4EFE6] ring-1 ring-[#713B43]'
                    : 'border-[#AD8A53]/25 bg-[#FAF8F3] hover:border-[#AD8A53]'
                }`}
              >
                <div className="aspect-square w-full overflow-hidden bg-gray-100 mb-1">
                  <img src={tab.img} alt={tab.label} className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-sans text-[#30241F]">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          <p className="text-[12px] text-[#7A6A58] italic text-center pt-1 font-sans">
            * All images show unstitched fabric rolls from our Surat workshop. Garment shots indicate tailored draping suitability.
          </p>
        </div>

        {/* Right Column: Editorial Details & Commercial Specs */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-[#AD8A53]/20 pb-3 mb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-[#AD8A53] font-semibold bg-[#F4EFE6] px-2.5 py-1 border border-[#AD8A53]/30">
                CODE: {fabric.code}
              </span>
              <span className="text-[12px] uppercase tracking-ultra text-[#713B43] font-semibold">
                {fabric.categoryLabel}
              </span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl text-[#30241F] mb-2 leading-tight">
              {fabric.name}
            </h1>

            <p className="text-xs text-[#713B43] font-sans font-medium uppercase tracking-wider mb-4">
              {fabric.embroideryTypeLabel}
            </p>

            <p className="text-xs sm:text-sm text-[#30241F]/85 font-sans leading-relaxed mb-6">
              {fabric.description}
            </p>

            {/* AI Try-On Prominent Action Banner */}
            <div className="bg-[#252321] text-[#FAF8F3] p-4 border border-[#AD8A53]/40 mb-6 flex items-center justify-between shadow-lg">
              <div>
                <span className="flex items-center gap-1.5 text-[12px] uppercase tracking-widest text-[#AD8A53] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Virtual Visualization
                </span>
                <p className="text-base text-[#FAF8F3] font-serif mt-0.5">
                  Preview this fabric on a 3D Sherwani or Kurta avatar
                </p>
              </div>
              <Link
                href={`/ai-tryon?fabric=${fabric.id}`}
                className="whitespace-nowrap px-4 py-2 bg-[#AD8A53] hover:bg-[#91703E] text-[#FAF8F3] text-[12px] uppercase tracking-widest font-semibold transition-colors shadow"
              >
                TRY WITH AI
              </Link>
            </div>

            {/* Specifications Table */}
            <div className="border border-[#AD8A53]/25 bg-[#F4EFE6]/50 p-4 mb-6">
              <h3 className="text-[12px] uppercase tracking-ultra text-[#AD8A53] font-semibold mb-3 border-b border-[#AD8A53]/20 pb-1">
                Technical Specifications
              </h3>
              <div className="divide-y divide-[#AD8A53]/15 text-xs font-sans">
                <div className="py-2 flex justify-between">
                  <span className="text-[#7A6A58]">Base Fabric:</span>
                  <span className="text-[#30241F] font-medium">{fabric.baseFabric}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#7A6A58]">Embroidery Technique:</span>
                  <span className="text-[#30241F] font-medium">{fabric.embroideryTypeLabel}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#7A6A58]">Full Cuttable Width:</span>
                  <span className="text-[#30241F] font-medium">{fabric.width}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#7A6A58]">Minimum Order Qty (MOQ):</span>
                  <span className="text-[#AD8A53] font-semibold">{fabric.moq}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#7A6A58]">Availability:</span>
                  <span className="text-[#30241F] font-medium">
                    {fabric.readyStock ? 'In-Stock at Surat Mill' : 'Custom Production Run'}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#7A6A58]">Price Structure:</span>
                  <span className="text-[#713B43] font-semibold">Available on Commercial Enquiry</span>
                </div>
              </div>
            </div>

            {/* Garment Applications Pills */}
            <div className="mb-6">
              <span className="block text-[12px] uppercase tracking-widest text-[#AD8A53] font-semibold mb-2">
                Ideal Tailoring Applications:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {fabric.suitableFor.map((app, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-[#FAF8F3] border border-[#AD8A53]/30 text-[12px] font-sans text-[#30241F]"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity Input and Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <label className="text-xs uppercase tracking-wider text-[#30241F] font-semibold whitespace-nowrap">
                  Required Meterage:
                </label>
                <select
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                  className="bg-[#FAF8F3] border border-[#AD8A53]/40 px-3 py-2 text-xs font-sans text-[#30241F] focus:outline-none focus:border-[#AD8A53] w-full"
                >
                  <option value="2-Metre Sample Strike-off">2-Metre Sample Strike-off</option>
                  <option value="25 Metres (Trial Roll)">25 Metres (Trial Roll)</option>
                  <option value="50 Metres">50 Metres</option>
                  <option value="100 Metres (Bulk Run)">100 Metres (Bulk Run)</option>
                  <option value="250+ Metres (Wholesale Batch)">250+ Metres (Wholesale Batch)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => openEnquiryModal(fabric, orderQuantity)}
                  className="w-full py-3.5 bg-[#30241F] hover:bg-[#252321] text-[#FAF8F3] text-xs uppercase tracking-widest font-sans font-semibold transition-colors shadow"
                >
                  Request Official Quotation
                </button>
                <a
                  href={directWhatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-[#AD8A53] hover:bg-[#91703E] text-[#FAF8F3] text-xs uppercase tracking-widest font-sans font-semibold transition-colors flex items-center justify-center gap-2 shadow"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Artisan & Weave Heritage */}
          <div className="border-t border-[#AD8A53]/20 pt-4 text-xs font-sans text-[#30241F]/80">
            <span className="block text-[12px] uppercase tracking-widest text-[#AD8A53] font-semibold mb-1">
              Surat Atelier Notes:
            </span>
            <p className="leading-relaxed italic">{fabric.artisanStory}</p>
          </div>
        </div>
      </div>

      {/* Related / Similar Designs */}
      {relatedFabrics.length > 0 && (
        <div className="border-t border-[#AD8A53]/25 pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-editorial text-2xl sm:text-3xl text-[#30241F]">
              Similar Fabric Developments
            </h2>
            <Link
              href="/collections"
              className="text-xs uppercase tracking-widest font-semibold text-[#713B43] hover:underline"
            >
              Browse Full Catalogue →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedFabrics.map((rel) => (
              <FabricCard key={rel.id} fabric={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
