'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, X, Sparkles, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';
import FabricCard from '@/components/FabricCard';

function CollectionsContent() {
  const { fabrics, openEnquiryModal } = useEnquiry();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedWorkType, setSelectedWorkType] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [onlyReadyStock, setOnlyReadyStock] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'sherwani', label: 'Sherwani Fabrics' },
    { id: 'kurta', label: 'Kurta Fabrics' },
    { id: 'jodhpuri', label: 'Jodhpuri Fabrics' },
    { id: 'indo-western', label: 'Indo-Western Fabrics' },
    { id: 'brocade', label: 'Premium Brocade' },
    { id: 'designer', label: 'Designer Ethnic' },
  ];

  const workTypes = [
    { id: 'all', label: 'All Embroidery' },
    { id: 'zari', label: 'Antique Zari & Dabka' },
    { id: 'bead', label: 'Cutdana & Beadwork' },
    { id: 'thread', label: 'Resham Silk Thread' },
    { id: 'sequin', label: 'Micro-Sequin Geometry' },
    { id: 'multi', label: 'Multi-Craft Fusion' },
  ];

  const colorFamilies = [
    { id: 'all', label: 'All Shades' },
    { id: 'ivory', label: 'Ivory & Off-White' },
    { id: 'sandstone', label: 'Sandstone & Champagne' },
    { id: 'gold', label: 'Antique Dull Gold' },
    { id: 'burgundy', label: 'Muted Burgundy' },
    { id: 'emerald', label: 'Imperial Emerald' },
    { id: 'navy', label: 'Midnight Navy' },
    { id: 'black', label: 'Jet Black' },
  ];

  const filteredFabrics = useMemo(() => {
    return fabrics.filter((fabric) => {
      if (selectedCategory !== 'all' && fabric.category !== selectedCategory) {
        return false;
      }
      if (selectedWorkType !== 'all' && fabric.embroideryType !== selectedWorkType) {
        return false;
      }
      if (selectedColor !== 'all' && fabric.colorFamily !== selectedColor) {
        return false;
      }
      if (onlyReadyStock && !fabric.readyStock) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = fabric.code.toLowerCase().includes(q);
        const matchesName = fabric.name.toLowerCase().includes(q);
        const matchesBase = fabric.baseFabric.toLowerCase().includes(q);
        const matchesType = fabric.embroideryTypeLabel.toLowerCase().includes(q);
        return matchesCode || matchesName || matchesBase || matchesType;
      }
      return true;
    });
  }, [fabrics, selectedCategory, selectedWorkType, selectedColor, onlyReadyStock, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedWorkType('all');
    setSelectedColor('all');
    setOnlyReadyStock(false);
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedWorkType !== 'all' ||
    selectedColor !== 'all' ||
    onlyReadyStock ||
    searchQuery.trim() !== '';

  return (
    <div className="bg-[#FAF8F3] min-h-screen text-[#30241F] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-[#AD8A53]/25 pb-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[12px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-1">
              Surat Textile Catalogue
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#30241F]">
              Men&apos;s Ethnic Embroidered Fabrics
            </h1>
            <p className="text-xs sm:text-sm text-[#30241F]/80 font-sans mt-2 max-w-2xl leading-relaxed">
              Explore royal zardozi, Japanese cutdana jaal, resham silk threadwork, and bespoke occasionwear fabrics. All designs are supplied by the metre for premier menswear labels and garment manufacturers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openEnquiryModal()}
              className="px-5 py-2.5 bg-[#30241F] text-[#FAF8F3] text-xs uppercase tracking-widest font-sans font-semibold hover:bg-[#252321] transition-colors"
            >
              Wholesale Swatch Kit
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Control Center */}
      <div className="bg-[#F4EFE6] border border-[#AD8A53]/30 p-6 mb-10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-grow w-full">
            <Search className="w-4 h-4 text-[#AD8A53] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Design Code (e.g. KF-ZAR-901), Fabric Type, or Motif..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F3] border border-[#AD8A53]/40 pl-10 pr-4 py-2 text-xs font-sans text-[#30241F] placeholder-[#C9BBA7] focus:outline-none focus:border-[#AD8A53]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#7A6A58] hover:text-[#30241F]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-sans select-none">
              <input
                type="checkbox"
                checked={onlyReadyStock}
                onChange={(e) => setOnlyReadyStock(e.target.checked)}
                className="accent-[#AD8A53] w-4 h-4"
              />
              <span className="font-medium text-[#30241F]">Ready-Stock Only</span>
            </label>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[13px] text-[#713B43] uppercase tracking-wider font-semibold flex items-center gap-1 hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Filters
              </button>
            )}
          </div>
        </div>

        <div>
          <span className="block text-[12px] uppercase tracking-widest text-[#AD8A53] font-semibold mb-2">
            Garment Classification:
          </span>
          <div className="flex flex-wrap gap-2">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#AD8A53]/20">
          <div>
            <label className="block text-[12px] uppercase tracking-widest text-[#AD8A53] font-semibold mb-1.5">
              Embroidery Craft:
            </label>
            <select
              value={selectedWorkType}
              onChange={(e) => setSelectedWorkType(e.target.value)}
              className="w-full bg-[#FAF8F3] border border-[#AD8A53]/40 px-3 py-2 text-xs font-sans text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
            >
              {workTypes.map((wt) => (
                <option key={wt.id} value={wt.id}>
                  {wt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12px] uppercase tracking-widest text-[#AD8A53] font-semibold mb-1.5">
              Colour Palette:
            </label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full bg-[#FAF8F3] border border-[#AD8A53]/40 px-3 py-2 text-xs font-sans text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
            >
              {colorFamilies.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 text-xs text-[#7A6A58] font-sans">
        <div>
          Showing <span className="font-semibold text-[#30241F]">{filteredFabrics.length}</span> verified fabric designs
        </div>
        <div className="text-[13px] text-[#713B43] uppercase tracking-wider font-semibold">
          Prices Quoted on Wholesale Enquiry
        </div>
      </div>

      {filteredFabrics.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFabrics.map((fabric) => (
            <FabricCard key={fabric.id} fabric={fabric} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#F4EFE6] border border-[#AD8A53]/30 p-8">
          <p className="font-editorial text-2xl text-[#30241F] mb-2">No matching fabrics found</p>
          <p className="text-xs text-[#30241F]/80 max-w-md mx-auto mb-6">
            We hold hundreds of archive designs not yet published online. Contact our Surat design desk directly with your motif or swatch requirements.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 bg-[#AD8A53] text-[#FAF8F3] text-xs uppercase tracking-widest font-semibold"
          >
            Clear All Filters
          </button>
        </div>
      )}

      <div className="mt-16 bg-[#252321] text-[#FAF8F3] p-6 border border-[#AD8A53]/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-base font-serif text-[#F4EFE6] italic">
            &ldquo;Every roll is inspected over calibrated light-tables in Surat to guarantee structural uniformity and stitch tension before dispatch.&rdquo;
          </p>
          <p className="text-[12px] uppercase tracking-widest text-[#AD8A53] mt-1">
            Standard Width: 44&quot; to 48&quot; Full Cuttable • Fabric Unstitched
          </p>
        </div>
        <button
          onClick={() => openEnquiryModal()}
          className="whitespace-nowrap px-6 py-2.5 border border-[#AD8A53] text-[#AD8A53] hover:bg-[#AD8A53] hover:text-[#FAF8F3] text-xs uppercase tracking-widest font-semibold transition-colors"
        >
          Request Swatch Catalogue
        </button>
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center font-serif text-lg text-[#AD8A53]">
          Loading Khodal Fashion Archival Collections...
        </div>
      }
    >
      <CollectionsContent />
    </Suspense>
  );
}
