'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, X, ArrowUpRight, Sparkles, Filter } from 'lucide-react';
import { GALLERY_DATA } from '@/data/gallery';
import { GalleryItem } from '@/types';
import { useEnquiry } from '@/context/EnquiryContext';

export default function GalleryPage() {
  const { openEnquiryModal, generateWhatsAppUrl } = useEnquiry();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Photographic Archives' },
    { id: 'styled', label: 'Styled Inspiration' },
    { id: 'embroidery', label: 'Macro Embroidery' },
    { id: 'workshop', label: 'Surat Workshop' },
    { id: 'swatch', label: 'Fabric Swatches' },
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? GALLERY_DATA
      : GALLERY_DATA.filter((item) => item.category === selectedCategory);

  return (
    <div className="bg-[#FAF8F3] text-[#30241F] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-[#AD8A53]/25 pb-8 mb-10">
        <span className="text-[10px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-2">
          Visual Heritage & Machine Bays
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#30241F] mb-4">
          Atelier Photographic Gallery
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[#30241F]/80 font-sans max-w-3xl leading-relaxed">
          An editorial visual exploration of unstitched fabric swatches, high-magnification embroidery macro details, workshop machine bays, and tailored menswear styling inspiration.
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mt-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-sans transition-all border ${
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

      {/* Asymmetric / Masonry Style Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveLightboxItem(item)}
            className="group relative cursor-pointer overflow-hidden border border-[#AD8A53]/25 bg-[#F4EFE6] hover:border-[#AD8A53] transition-all shadow-sm"
          >
            <div
              className={`w-full overflow-hidden ${
                item.aspect === 'tall'
                  ? 'aspect-[3/4]'
                  : item.aspect === 'square'
                  ? 'aspect-square'
                  : 'aspect-[16/10]'
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#252321]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-[#FAF8F3]">
              <span className="text-[9px] uppercase tracking-widest text-[#AD8A53] font-mono">
                {item.tag}
              </span>
              <h3 className="font-editorial text-xl font-medium mt-0.5">{item.title}</h3>
              <p className="text-[11px] text-[#C9BBA7] line-clamp-2 mt-1">{item.caption}</p>
              <div className="mt-2 flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#FAF8F3] font-semibold">
                <Eye className="w-3.5 h-3.5 text-[#AD8A53]" />
                Inspect Photograph
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252321]/90 backdrop-blur-md">
          <div className="relative max-w-4xl w-full bg-[#FAF8F3] border border-[#AD8A53] shadow-2xl overflow-hidden p-6 max-h-[95vh] flex flex-col">
            <button
              onClick={() => setActiveLightboxItem(null)}
              className="absolute top-4 right-4 text-[#30241F] hover:text-[#713B43] p-2 z-10"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black mb-4 border border-[#AD8A53]/30">
              <img
                src={activeLightboxItem.image}
                alt={activeLightboxItem.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#AD8A53]/20 pt-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#AD8A53] font-mono font-semibold">
                  {activeLightboxItem.tag}
                </span>
                <h2 className="font-editorial text-2xl text-[#30241F]">
                  {activeLightboxItem.title}
                </h2>
                <p className="text-xs text-[#30241F]/80 font-sans mt-1">
                  {activeLightboxItem.caption}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveLightboxItem(null);
                    openEnquiryModal();
                  }}
                  className="px-5 py-2.5 bg-[#30241F] text-[#FAF8F3] text-xs uppercase tracking-widest font-semibold hover:bg-[#252321]"
                >
                  Enquire on This Style
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
