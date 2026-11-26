'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, Eye, CheckCircle2, ChevronLeft, ChevronRight, Layers, Gem } from 'lucide-react';
import { FabricItem } from '@/types';
import { productPhotos } from '@/lib/fabrics';
import { useEnquiry } from '@/context/EnquiryContext';
import WhatsAppIcon from '@/components/WhatsAppIcon';

interface FabricCardProps {
  fabric: FabricItem;
}

export default function FabricCard({ fabric }: FabricCardProps) {
  const { openEnquiryModal, generateWhatsAppUrl } = useEnquiry();

  // The product's real photos (Admin → Products), without repeats.
  const allImages = React.useMemo(() => productPhotos(fabric).map((p) => p.src), [fabric]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const currentImage = allImages[activeImageIndex] || fabric.mainImage;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="group relative flex flex-col bg-[#FAF8F3] border border-[#AD8A53]/25 hover:border-[#AD8A53] transition-all duration-300 shadow-sm hover:shadow-md">
      
      {/* 1. TOP BAR: Design Code & Stock Status */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#AD8A53]/20 bg-[#F4EFE6]/60 text-[12px] tracking-wide uppercase font-sans gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[#7A6A58] hidden sm:inline">CODE:</span>
          <span className="font-mono font-bold text-[#AD8A53] tracking-normal whitespace-nowrap bg-[#FAF8F3] px-1.5 py-0.5 border border-[#AD8A53]/30">
            {fabric.code}
          </span>
        </div>

        {fabric.readyStock ? (
          <span className="inline-flex shrink-0 whitespace-nowrap items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
            Ready Stock
          </span>
        ) : (
          <span className="inline-flex shrink-0 whitespace-nowrap items-center text-[11px] font-semibold text-[#713B43] bg-rose-50 px-2 py-0.5 rounded border border-[#713B43]/30">
            Made to Order
          </span>
        )}
      </div>

      {/* 2. PRODUCT IMAGES (Interactive Carousel & Thumbnail switcher) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4EFE6]">
        <img
          src={currentImage}
          alt={`${fabric.name} - image ${activeImageIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Multi-Image Navigation Arrows (if 2+ images exist) */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous fabric photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#252321]/80 hover:bg-[#252321] text-[#FAF8F3] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow z-10"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next fabric photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#252321]/80 hover:bg-[#252321] text-[#FAF8F3] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow z-10"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Image Dots / Count indicator */}
            <div className="absolute top-2.5 right-2.5 bg-[#252321]/80 backdrop-blur-sm text-[#FAF8F3] px-2 py-0.5 text-[11px] font-mono rounded tracking-wider border border-[#AD8A53]/30 z-10">
              {activeImageIndex + 1}/{allImages.length}
            </div>
          </>
        )}

        {/* Category Pill + Exclusive badge (set in Admin → Products) */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col items-start gap-1.5">
          <div className="bg-[#252321]/80 backdrop-blur-sm text-[#FAF8F3] px-2 py-0.5 text-[11px] uppercase tracking-widest font-sans border border-[#AD8A53]/30">
            {fabric.categoryLabel}
          </div>
          {fabric.exclusive && (
            <div className="inline-flex items-center gap-1 bg-gradient-to-r from-[#AD8A53] to-[#C9A86A] text-[#252321] px-2 py-0.5 text-[11px] uppercase tracking-widest font-sans font-bold shadow-sm">
              <Gem className="w-3 h-3" />
              Exclusive
            </div>
          )}
        </div>

        {/* Hover Quick Overlay Actions */}
        <div className="absolute inset-0 bg-[#30241F]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <div className="flex flex-col gap-2 w-full max-w-[190px]">
            <Link
              href={`/collections/${fabric.id}`}
              className="w-full py-2 bg-[#FAF8F3] hover:bg-white text-[#30241F] text-[12px] tracking-widest uppercase font-sans font-semibold text-center shadow flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-[#AD8A53]" />
              View Full Details
            </Link>

            <Link
              href={`/ai-tryon?fabric=${fabric.id}`}
              className="w-full py-2 bg-[#AD8A53] hover:bg-[#91703E] text-[#FAF8F3] text-[12px] tracking-widest uppercase font-sans font-semibold text-center shadow flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FAF8F3]" />
              Try With AI
            </Link>
          </div>
        </div>
      </div>

      {/* 3. MULTI-IMAGE THUMBNAIL STRIP (When multiple images uploaded) */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-1 px-3 py-1.5 bg-[#F4EFE6]/40 border-b border-[#AD8A53]/15 overflow-x-auto">
          {allImages.slice(0, 5).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`w-8 h-8 shrink-0 overflow-hidden border transition-all ${
                activeImageIndex === idx
                  ? 'border-[#713B43] ring-1 ring-[#713B43]'
                  : 'border-[#AD8A53]/30 hover:border-[#AD8A53] opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
          {allImages.length > 5 && (
            <span className="text-[11px] text-[#AD8A53] font-mono pl-1">
              +{allImages.length - 5}
            </span>
          )}
        </div>
      )}

      {/* 4. PRODUCT DETAILS & SPECIFICATIONS (All 8 Required Fields) */}
      <div className="p-4 flex flex-col flex-grow justify-between font-sans">
        <div>
          {/* Title */}
          <h3 className="font-editorial text-base sm:text-lg text-[#30241F] font-medium group-hover:text-[#713B43] transition-colors leading-tight mb-2">
            <Link href={`/collections/${fabric.id}`}>
              {fabric.name}
            </Link>
          </h3>

          {/* Specifications Matrix */}
          <div className="space-y-1.5 text-xs text-[#30241F] border-t border-[#AD8A53]/20 pt-2.5 mb-3">
            
            {/* Fabric Type */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#7A6A58] font-medium">Fabric Type:</span>
              <span className="font-semibold text-[#30241F] text-right truncate max-w-[170px]">
                {fabric.baseFabric}
              </span>
            </div>

            {/* Embroidery Type */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#7A6A58] font-medium">Embroidery:</span>
              <span className="font-semibold text-[#713B43] text-right truncate max-w-[170px]">
                {fabric.embroideryTypeLabel}
              </span>
            </div>

            {/* Fabric Width */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#7A6A58] font-medium">Fabric Width:</span>
              <span className="font-semibold text-[#30241F]">
                {fabric.width || '44 Inches'}
              </span>
            </div>

            {/* Minimum Order Quantity (MOQ) */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#7A6A58] font-medium">Wholesale MOQ:</span>
              <span className="font-bold text-[#AD8A53]">
                {fabric.moq || '10–15 Metres'}
              </span>
            </div>
          </div>

          {/* Available Colors Swatches */}
          <div className="pt-2 border-t border-[#AD8A53]/15 mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] uppercase tracking-wider text-[#7A6A58] font-semibold">
                Available Colors:
              </span>
              <span className="text-[12px] font-medium text-[#30241F]">
                {fabric.availableColors?.[selectedColorIndex]?.name || fabric.color}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 flex-wrap">
              {fabric.availableColors && fabric.availableColors.length > 0 ? (
                fabric.availableColors.map((col, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColorIndex(idx)}
                    title={col.name}
                    className={`w-4 h-4 rounded-full border shadow-sm transition-transform ${
                      selectedColorIndex === idx
                        ? 'scale-125 ring-2 ring-[#AD8A53] border-white'
                        : 'border-[#30241F]/20 hover:scale-110'
                    }`}
                    style={{ backgroundColor: col.hex }}
                  />
                ))
              ) : (
                <span className="text-[12px] text-[#30241F]/80">
                  {fabric.color}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 5. ACTION BUTTONS: "Enquire for Price" & WhatsApp */}
        <div className="pt-2 border-t border-[#AD8A53]/20 space-y-2">
          {/* Prominent Enquire for Price Button */}
          <button
            onClick={() => openEnquiryModal(fabric)}
            className="w-full py-2.5 bg-[#30241F] hover:bg-[#252321] text-[#FAF8F3] text-[12px] tracking-[0.16em] uppercase font-sans font-semibold transition-colors text-center shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>Enquire for Price</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#AD8A53]" />
          </button>

          {/* Secondary Quick Action Row */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/ai-tryon?fabric=${fabric.id}`}
              className="py-1.5 border border-[#AD8A53] text-[#30241F] hover:bg-[#F4EFE6] text-[11px] tracking-wider uppercase font-semibold text-center flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#AD8A53]" />
              <span>AI Try-On</span>
            </Link>

            <a
              href={generateWhatsAppUrl({
                productCode: fabric.code,
                productName: fabric.name,
                sourcePage: 'Fabric Card Quick WhatsApp',
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 bg-[#25D366] hover:bg-[#20b858] text-white text-[11px] tracking-wider uppercase font-medium text-center flex items-center justify-center gap-1 shadow-sm"
            >
              <WhatsAppIcon className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
