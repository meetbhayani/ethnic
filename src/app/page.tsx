'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Shield,
  Layers,
  Scissors,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  HelpCircle,
  Clock,
  MapPin,
  Building2,
  Eye,
} from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';
import { CRAFTS_DATA } from '@/data/crafts';
import { FAQS_DATA } from '@/data/faqs';
import FabricCard from '@/components/FabricCard';

export default function HomePage() {
  const { fabrics, openEnquiryModal, generateWhatsAppUrl } = useEnquiry();
  const [activeFaq, setActiveFaq] = useState<string | null>(FAQS_DATA[0].id);

  const featuredFabrics = fabrics.filter((f) => f.featured).slice(0, 4);

  return (
    <div className="bg-[#FAF8F3] text-[#30241F] overflow-hidden">
      {/* 1. EDITORIAL HERO SECTION — Inspired by Luxury Fashion Editorial Magazine Cover */}
      <section className="relative min-h-[92vh] border-b border-[#AD8A53]/25 flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-hidden bg-[#F4EFE6]">
        {/* Architectural Background Grid Texture & Watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#AD8A53_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Oversized Editorial Watermark Typography */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 select-none pointer-events-none w-full text-center overflow-hidden opacity-[0.06] font-serif text-[18vw] leading-none text-[#30241F] tracking-tighter uppercase">
          TEXTILE
        </div>

        {/* Top Editorial Row */}
        <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-[#AD8A53]/30 pb-4 text-[10px] md:text-[11px] uppercase tracking-widest font-sans text-[#713B43]">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#30241F]">VOL. XXVI — ATELIER EDITION</span>
            <span className="text-[#C9BBA7]">•</span>
            <span className="text-[#AD8A53]">SURAT EMBROIDERY ARCHIVE</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[#30241F]/80">
            <span>B2B SPECIALIZED HOUSE</span>
            <span>•</span>
            <span>EST. SURAT, GUJARAT</span>
          </div>
        </div>

        {/* Central Asymmetric Magazine Spread */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center my-4 sm:my-6 lg:my-8 max-w-full">
          {/* Left Vertical Typography & Headline Column */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2.5">
              <span className="w-6 sm:w-8 h-[1px] bg-[#AD8A53]" />
              <span className="text-[9.5px] sm:text-xs tracking-ultra uppercase text-[#AD8A53] font-semibold">
                The Sovereign Textile House
              </span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[52px] leading-[1.08] text-[#30241F] tracking-tight font-normal">
              Where Royal <br />
              <span className="italic font-serif text-[#713B43]">Craftsmanship</span> <br />
              Meets the Art of Fabric.
            </h1>

            <p className="text-xs sm:text-sm text-[#30241F]/85 font-sans leading-relaxed max-w-md">
              Discover exceptional men&apos;s ethnic fabrics, intricate embroidery, and timeless textile craftsmanship engineered in Surat for couture Sherwanis, Kurtas, and regal Bandhgalas.
            </p>

            {/* CTAs */}
            <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-3">
              <Link
                href="/collections"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 bg-[#30241F] hover:bg-[#252321] text-[#FAF8F3] text-xs uppercase tracking-widest font-sans font-semibold transition-all duration-300 shadow-md group"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4 text-[#AD8A53] group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/craftsmanship"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 border border-[#AD8A53] text-[#30241F] hover:bg-[#FAF8F3] text-xs uppercase tracking-widest font-sans font-semibold transition-all duration-300"
              >
                <span>Discover Our Craft</span>
              </Link>
            </div>

            {/* Editorial Caption Notice */}
            <div className="pt-3 border-t border-[#AD8A53]/20 flex items-center gap-2.5 text-[11px] text-[#C9BBA7]">
              <Shield className="w-4 h-4 text-[#AD8A53] shrink-0" />
              <span>We supply unstitched fabrics & job-work to couture labels & retailers worldwide.</span>
            </div>
          </div>

          {/* Right Immersive Editorial Imagery Spread */}
          <div className="lg:col-span-7 xl:col-span-7 relative min-w-0">
            <div className="relative grid grid-cols-12 gap-3 sm:gap-4 items-center">
              {/* Vertical Editorial Lettering "ROYAL" */}
              <div className="hidden sm:flex col-span-1 items-center justify-center">
                <span className="vertical-text text-[10px] xl:text-xs uppercase tracking-ultra font-serif text-[#AD8A53] font-semibold select-none border-l border-[#AD8A53]/30 pl-2">
                  ROYAL ATELIER ARCHIVE • SURAT
                </span>
              </div>

              {/* Primary Large Editorial Photograph: Styled Royal Sherwani Inspiration */}
              <div className="col-span-12 sm:col-span-7 relative group">
                <div className="relative aspect-[3/4] max-h-[460px] sm:max-h-[500px] overflow-hidden border border-[#AD8A53]/40 shadow-2xl bg-[#30241F]">
                  <img
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85"
                    alt="Royal Sherwani fabric styling inspiration in sunlit Indian heritage palace"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#252321]/85 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-[#FAF8F3]">
                    <span className="text-[8.5px] uppercase tracking-widest font-mono text-[#AD8A53] bg-[#252321]/80 px-2 py-0.5 border border-[#AD8A53]/30">
                      KF-ZAR-901 STYLING
                    </span>
                    <p className="text-xs font-serif mt-1 italic text-[#F4EFE6]">
                      Zardozi Brocade draped on Royal Achkan silhouette.
                    </p>
                    <p className="text-[8.5px] uppercase tracking-wider text-[#C9BBA7] mt-0.5">
                      (Styling inspiration only • Fabric supplied unstitched)
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary Layered Fabric Swatch / Macro Detail */}
              <div className="hidden sm:flex sm:col-span-4 flex-col gap-3">
                <div className="relative aspect-[4/5] overflow-hidden border border-[#AD8A53]/30 shadow-lg bg-[#FAF8F3] group">
                  <img
                    src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=85"
                    alt="Macro photography of Japanese cutdana and zari embroidery stitches"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 bg-[#252321]/90 text-[#FAF8F3] text-[8px] uppercase tracking-widest px-2 py-0.5 font-mono border border-[#AD8A53]/30">
                    MACRO 10X
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-[#FAF8F3]/95 p-2 text-[10px] font-sans border border-[#AD8A53]/20">
                    <p className="font-semibold text-[#30241F]">Cutdana & Zari Density</p>
                    <p className="text-[#713B43]">1800 stitches / sq dm</p>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F3] border border-[#AD8A53]/25 shadow-sm">
                  <p className="text-[9.5px] uppercase tracking-wider text-[#AD8A53] font-semibold mb-1">
                    AI Virtual Try-On
                  </p>
                  <p className="text-[11px] text-[#30241F]/80 leading-snug">
                    Preview fabrics on 3D Sherwani & Kurta silhouettes before sampling.
                  </p>
                  <Link
                    href="/ai-tryon"
                    className="mt-1.5 text-[10.5px] font-semibold text-[#713B43] flex items-center gap-1 hover:underline"
                  >
                    <span>Launch Studio</span>
                    <Sparkles className="w-3 h-3 text-[#AD8A53]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Editorial Bar with Metrics */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#AD8A53]/30 pt-4 text-xs font-sans">
          <div className="border-r border-[#AD8A53]/20 pr-4">
            <span className="text-[9px] uppercase tracking-widest text-[#AD8A53] block">Fabric Catalogue</span>
            <span className="font-serif text-lg text-[#30241F] font-medium">85+ Curated Weaves</span>
          </div>
          <div className="border-r border-[#AD8A53]/20 pr-4">
            <span className="text-[9px] uppercase tracking-widest text-[#AD8A53] block">Embroidery Styles</span>
            <span className="font-serif text-lg text-[#30241F] font-medium">Zari, Bead, Resham</span>
          </div>
          <div className="border-r border-[#AD8A53]/20 pr-4">
            <span className="text-[9px] uppercase tracking-widest text-[#AD8A53] block">Minimum Order</span>
            <span className="font-serif text-lg text-[#30241F] font-medium">20M Ready • 100M Custom</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#AD8A53] block">Surat Facility</span>
            <span className="font-serif text-lg text-[#30241F] font-medium">Ring Road Atelier</span>
          </div>
        </div>
      </section>

      {/* 2. BRAND INTRODUCTION & ROYAL ETHOS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#AD8A53]/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="text-[10px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-2">
              Identity & Origin
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#30241F] leading-tight mb-6">
              The Royal Textile House of Surat
            </h2>
            <div className="w-12 h-[2px] bg-[#713B43] mb-6" />
            <p className="text-xs sm:text-sm text-[#30241F]/80 font-sans leading-relaxed mb-4">
              Nestled at the epicentre of India’s textile heartland in Surat, Gujarat, <strong>Khodal Fashion</strong> was founded with a singular artistic devotion: to engineer the most refined, stately, and structurally dependable embroidered fabrics for royal men’s ethnic wear.
            </p>
            <p className="text-xs sm:text-sm text-[#30241F]/80 font-sans leading-relaxed mb-6">
              We partner directly with bespoke tailors, wedding occasionwear labels, Sherwani manufacturers, and multi-designer boutiques. We do not sell finished garments; our canvas is the unstitched textile, embellished with gold dabka, hand-checked resham, and radiant cutdana.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#AD8A53]/20">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#AD8A53] shrink-0 mt-0.5" />
                <span className="text-xs text-[#30241F] font-medium">Verified Surat Manufacturing</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#AD8A53] shrink-0 mt-0.5" />
                <span className="text-xs text-[#30241F] font-medium">Authentic Unstitched Fabrics</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#AD8A53] shrink-0 mt-0.5" />
                <span className="text-xs text-[#30241F] font-medium">Tailoring-Engineered Drapes</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#AD8A53] shrink-0 mt-0.5" />
                <span className="text-xs text-[#30241F] font-medium">Zero Synthetic Fraying</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[4/5] bg-[#F4EFE6] border border-[#AD8A53]/30 overflow-hidden shadow">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85"
                  alt="Zari brocade fabric roll at Khodal Fashion workshop"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-[#252321]/80 backdrop-blur-sm text-[#FAF8F3] p-2 text-[9px] uppercase tracking-wider">
                  Textile Roll Selvage Inspection
                </div>
              </div>
              <div className="relative aspect-[4/5] bg-[#F4EFE6] border border-[#AD8A53]/30 overflow-hidden shadow mt-8">
                <img
                  src="https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=800&q=85"
                  alt="Surat computerized embroidery multi-needle bay"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-[#252321]/80 backdrop-blur-sm text-[#FAF8F3] p-2 text-[9px] uppercase tracking-wider">
                  Computerized Multi-Head Bay
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE FABRIC COLLECTIONS (Categorical Editorial Cards) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#AD8A53]/20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#AD8A53]/20 pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-1">
              Curated Archival Classifications
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#30241F]">
              Explore Fabric Collections
            </h2>
          </div>
          <Link
            href="/collections"
            className="mt-4 md:mt-0 text-xs uppercase tracking-widest font-semibold text-[#713B43] hover:text-[#30241F] flex items-center gap-1.5 transition-colors"
          >
            <span>View Full Catalogue (8 Categories)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Sherwani Fabrics',
              category: 'sherwani',
              image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85',
              desc: 'Heavy structured brocades, zardozi panels, and pearl cutdana weaves for regal grooms.',
              badge: 'Flagship Collection',
            },
            {
              title: 'Kurta Fabrics',
              category: 'kurta',
              image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=85',
              desc: 'Breathable Chanderi, pure cotton-silk, and subtle Lucknowi-inspired resham threadwork.',
              badge: 'Festive Essentials',
            },
            {
              title: 'Jodhpuri & Bandhgala',
              category: 'jodhpuri',
              image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=85',
              desc: 'Micro-pile velvet, suiting weights, and rich Awadhi bullion cord embroidery.',
              badge: 'Bespoke Tailoring',
            },
            {
              title: 'Indo-Western & Designer',
              category: 'indo-western',
              image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=85',
              desc: 'Architectural lattices, smoked micro-sequins, and dual-tone metallic jacquards.',
              badge: 'Modern Runway',
            },
          ].map((cat) => (
            <Link
              key={cat.category}
              href={`/collections?category=${cat.category}`}
              className="group relative flex flex-col bg-[#FAF8F3] border border-[#AD8A53]/25 overflow-hidden hover:border-[#AD8A53] transition-all duration-300"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#F4EFE6]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-[#252321]/90 text-[#FAF8F3] text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#AD8A53]/30">
                  {cat.badge}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#252321]/90 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 text-[#FAF8F3]">
                  <h3 className="font-editorial text-2xl font-medium tracking-wide">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-[#C9BBA7] line-clamp-2 mt-1">
                    {cat.desc}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#AD8A53] font-semibold group-hover:underline">
                    Explore Fabrics <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED DESIGNS (Editorial Product Grid) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#AD8A53]/20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[10px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-1">
              Atelier Curations
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#30241F]">
              Featured Fabric Weaves
            </h2>
            <p className="text-xs text-[#30241F]/70 font-sans mt-1">
              Each design possesses a registered design code for seamless commercial referencing.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <button
              onClick={() => openEnquiryModal()}
              className="text-xs uppercase tracking-widest font-semibold px-4 py-2 border border-[#AD8A53] text-[#30241F] hover:bg-[#F4EFE6] transition-colors"
            >
              Bulk Inquiry
            </button>
            <Link
              href="/collections"
              className="text-xs uppercase tracking-widest font-semibold px-4 py-2 bg-[#30241F] text-[#FAF8F3] hover:bg-[#252321] transition-colors"
            >
              All 85+ Designs
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredFabrics.map((fabric) => (
            <FabricCard key={fabric.id} fabric={fabric} />
          ))}
        </div>
      </section>

      {/* 5. CRAFTSMANSHIP & EMBROIDERY MASTERY */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#AD8A53]/20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-2">
            Artisanal Integrity
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl text-[#30241F]">
            The Architecture of Royal Embroidery
          </h2>
          <div className="w-16 h-[2px] bg-[#AD8A53] mx-auto my-4" />
          <p className="text-xs sm:text-sm text-[#30241F]/80 font-sans leading-relaxed">
            By harmonizing multi-head computerized precision with hand-guided thread trimming and knot securing, Khodal Fashion crafts fabrics that endure heavy tailoring, ironing, and formal movement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CRAFTS_DATA.map((craft) => (
            <div
              key={craft.id}
              className="bg-[#FAF8F3] border border-[#AD8A53]/25 p-6 flex flex-col justify-between hover:border-[#AD8A53] transition-all"
            >
              <div>
                <div className="aspect-[4/3] overflow-hidden mb-4 border border-[#AD8A53]/20 bg-[#F4EFE6]">
                  <img
                    src={craft.image}
                    alt={craft.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-editorial text-xl text-[#30241F] mb-1">
                  {craft.title}
                </h3>
                <p className="text-[11px] text-[#713B43] font-medium tracking-wide mb-3">
                  {craft.subtitle}
                </p>
                <p className="text-xs text-[#30241F]/80 leading-relaxed font-sans mb-4">
                  {craft.description}
                </p>
              </div>

              <div className="border-t border-[#AD8A53]/15 pt-3">
                <ul className="space-y-1.5 text-[10px] text-[#30241F]/70 font-sans">
                  {craft.features.slice(0, 2).map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#AD8A53]" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/craftsmanship#${craft.id}`}
                  className="mt-4 inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#713B43] font-semibold hover:underline"
                >
                  <span>Explore Technique</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FABRIC APPLICATIONS & STYLING INSPIRATION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#AD8A53]/20 bg-[#F4EFE6]/50">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-[10px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-2">
            Tailoring Inspiration
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#30241F]">
            From Raw Warp to Sovereign Silhouette
          </h2>
          <p className="text-xs sm:text-sm text-[#30241F]/70 font-sans mt-2">
            How leading menswear fashion houses translate Khodal Fashion fabrics into acclaimed wedding collections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FAF8F3] border border-[#AD8A53]/25 p-4 flex flex-col">
            <div className="relative aspect-[3/4] overflow-hidden mb-4">
              <img
                src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=85"
                alt="Imperial Sherwani styling"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 right-2 bg-[#252321]/80 backdrop-blur-sm text-[#FAF8F3] text-[9px] uppercase tracking-wider p-1.5 text-center">
                Garment Styling Reference Only
              </span>
            </div>
            <h3 className="font-editorial text-xl text-[#30241F]">The Ceremonial Sherwani</h3>
            <p className="text-xs text-[#30241F]/80 mt-1 font-sans leading-relaxed">
              Cut from our 44&quot; heavy zardozi and antique dabka brocades, providing high rigidity for stiff stand collars and majestic chest drapes.
            </p>
            <Link
              href="/collections?category=sherwani"
              className="mt-3 text-[11px] uppercase tracking-wider text-[#713B43] font-semibold hover:underline inline-flex items-center gap-1"
            >
              Explore Sherwani Fabrics <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-[#FAF8F3] border border-[#AD8A53]/25 p-4 flex flex-col">
            <div className="relative aspect-[3/4] overflow-hidden mb-4">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=85"
                alt="Heritage Bandhgala styling"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 right-2 bg-[#252321]/80 backdrop-blur-sm text-[#FAF8F3] text-[9px] uppercase tracking-wider p-1.5 text-center">
                Garment Styling Reference Only
              </span>
            </div>
            <h3 className="font-editorial text-xl text-[#30241F]">Royal Jodhpuri Bandhgala</h3>
            <p className="text-xs text-[#30241F]/80 mt-1 font-sans leading-relaxed">
              Embroidered on velvet foundations and suiting blends that support razor-sharp shoulder construction and custom crest placements.
            </p>
            <Link
              href="/collections?category=jodhpuri"
              className="mt-3 text-[11px] uppercase tracking-wider text-[#713B43] font-semibold hover:underline inline-flex items-center gap-1"
            >
              Explore Jodhpuri Fabrics <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-[#FAF8F3] border border-[#AD8A53]/25 p-4 flex flex-col">
            <div className="relative aspect-[3/4] overflow-hidden mb-4">
              <img
                src="https://images.unsplash.com/photo-1621786030684-4c64829cff04?auto=format&fit=crop&w=800&q=85"
                alt="Festive Kurta styling"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 right-2 bg-[#252321]/80 backdrop-blur-sm text-[#FAF8F3] text-[9px] uppercase tracking-wider p-1.5 text-center">
                Garment Styling Reference Only
              </span>
            </div>
            <h3 className="font-editorial text-xl text-[#30241F]">Festive & Sangeet Kurta</h3>
            <p className="text-xs text-[#30241F]/80 mt-1 font-sans leading-relaxed">
              Breathable Chanderi and pure raw silks enriched with fine needle resham and micro-sequins for effortless fluidity during celebratory occasions.
            </p>
            <Link
              href="/collections?category=kurta"
              className="mt-3 text-[11px] uppercase tracking-wider text-[#713B43] font-semibold hover:underline inline-flex items-center gap-1"
            >
              Explore Kurta Fabrics <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. AI VIRTUAL TRY-ON INTRODUCTION (Feature Showcase) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#AD8A53]/20">
        <div className="bg-[#252321] text-[#FAF8F3] border border-[#AD8A53]/40 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          {/* Subtle gold glow behind */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#AD8A53]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#30241F] text-[#AD8A53] text-[10px] uppercase tracking-widest border border-[#AD8A53]/30 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Next-Gen B2B Textile Visualization
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#FAF8F3]">
                AI Virtual Try-On Studio
              </h2>
              <p className="text-xs sm:text-sm text-[#C9BBA7] font-sans leading-relaxed max-w-xl">
                Bridge the gap between raw fabric rolls and the final tailored look. Upload your model photo or select our royal silhouette presets, pick any Khodal Fashion fabric design, and generate high-fidelity previews for client lookbooks.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2 text-xs font-sans text-[#FAF8F3]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#AD8A53]" />
                  <span>Sherwani, Kurta & Jodhpuri Modes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#AD8A53]" />
                  <span>Real Catalogue Fabric Mapping</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#AD8A53]" />
                  <span>One-Click WhatsApp Enquiry</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#AD8A53]" />
                  <span>Private & Secure Uploads</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/ai-tryon"
                  className="px-8 py-3.5 bg-[#AD8A53] hover:bg-[#91703E] text-[#FAF8F3] text-xs uppercase tracking-widest font-sans font-semibold transition-colors shadow-lg flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch AI Preview Studio</span>
                </Link>
                <Link
                  href="/policies#ai-policy"
                  className="text-xs uppercase tracking-wider text-[#C9BBA7] hover:text-[#FAF8F3] underline"
                >
                  View AI Usage Policy
                </Link>
              </div>

              <p className="text-[10px] text-[#C9BBA7]/70 font-sans italic pt-2">
                * Note: AI previews are illustrative simulations to assist conceptual visualization and do not guarantee exact drape or color calibration.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="relative border border-[#AD8A53]/30 bg-[#30241F] p-4 shadow-2xl">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="block text-[9px] uppercase tracking-widest text-[#AD8A53] mb-1 font-mono">
                      Step 1: Fabric Selection
                    </span>
                    <div className="aspect-square bg-[#252321] border border-[#AD8A53]/20 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=85"
                        alt="Selected Fabric Swatch"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-widest text-emerald-400 mb-1 font-mono">
                      Step 2: AI Silhouette
                    </span>
                    <div className="aspect-square bg-[#252321] border border-emerald-400/40 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=400&q=85"
                        alt="AI Virtual Preview Output"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-center py-2 bg-[#252321] border border-[#AD8A53]/20">
                  <span className="text-[10px] text-[#C9BBA7] uppercase tracking-wider font-mono">
                    Instant Simulation • KF-ZAR-901 Applied
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CUSTOM EMBROIDERY & JOB-WORK CAPABILITIES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#AD8A53]/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <span className="text-[10px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-2">
              B2B Job-Work Services
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#30241F] mb-6">
              Custom Embroidery & Textile Job-Work
            </h2>
            <p className="text-xs sm:text-sm text-[#30241F]/80 font-sans leading-relaxed mb-4">
              Have proprietary design sketches, historical Mughal motifs, or distinct seasonal theme requirements? Our Surat facility provides comprehensive computerized embroidery job-work.
            </p>
            <div className="space-y-3 font-sans text-xs text-[#30241F] mb-6">
              <div className="flex items-start gap-2.5">
                <Scissors className="w-4 h-4 text-[#AD8A53] shrink-0 mt-0.5" />
                <span>
                  <strong>Client Fabric or In-House Supply:</strong> Execute embroidery on fabrics supplied by your label, or choose from our tested base textiles.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Layers className="w-4 h-4 text-[#AD8A53] shrink-0 mt-0.5" />
                <span>
                  <strong>Digital Punching & Sampling:</strong> Swift CAD conversion and sample strike-off approval before large-scale production.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#AD8A53] shrink-0 mt-0.5" />
                <span>
                  <strong>Structured Production Tracking:</strong> Transparent meterage schedules coordinated directly with our Surat dispatch coordinators.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/job-work"
                className="px-6 py-3 bg-[#30241F] hover:bg-[#252321] text-[#FAF8F3] text-xs uppercase tracking-widest font-sans font-semibold transition-colors"
              >
                Discuss Job Work Project
              </Link>
              <a
                href={generateWhatsAppUrl({
                  sourcePage: 'Homepage Custom Job-Work Desk',
                  customNote: 'Hello Khodal Fashion, I have a custom embroidery requirement and would like to discuss design sampling and job-work rates.',
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-[#AD8A53] text-[#30241F] hover:bg-[#F4EFE6] text-xs uppercase tracking-widest font-sans font-semibold transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 text-[#AD8A53]" />
                <span>WhatsApp Job-Work Team</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] bg-[#F4EFE6] border border-[#AD8A53]/30 overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=1200&q=85"
                alt="Embroidery machine at work in Surat facility"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#252321]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-[#FAF8F3]">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#AD8A53]">
                  SURAT FACILITY BAY 02
                </p>
                <p className="font-serif text-lg">Multi-Needle Computerized Frames</p>
                <p className="text-[11px] text-[#C9BBA7]">
                  Precision-calibrated for zero-distortion bullion tensioning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. REAL BUSINESS GALLERY (Asymmetrical Lookbook) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#AD8A53]/20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[10px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-1">
              Photographic Archive
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#30241F]">
              Real Business & Atelier Gallery
            </h2>
          </div>
          <Link
            href="/gallery"
            className="mt-4 md:mt-0 text-xs uppercase tracking-widest font-semibold text-[#713B43] hover:text-[#30241F] flex items-center gap-1"
          >
            <span>View Complete Editorial Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="relative aspect-[3/4] overflow-hidden border border-[#AD8A53]/30 bg-[#F4EFE6] group">
              <img
                src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=85"
                alt="Imperial Sherwani Styled Lookbook"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-[#252321]/80 text-[#FAF8F3] p-2 text-[10px] uppercase tracking-wider">
                Styled Lookbook • KF-ZAR-901
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden border border-[#AD8A53]/30 bg-[#F4EFE6] group">
              <img
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=85"
                alt="Macro Beadwork Detail"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-[#252321]/80 text-[#FAF8F3] p-2 text-[10px] uppercase tracking-wider">
                Macro Bead & Dabka Detail
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:mt-8">
            <div className="relative aspect-square overflow-hidden border border-[#AD8A53]/30 bg-[#F4EFE6] group">
              <img
                src="https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=800&q=85"
                alt="Surat Workshop Production"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-[#252321]/80 text-[#FAF8F3] p-2 text-[10px] uppercase tracking-wider">
                Surat Machine Workshop Bay
              </div>
            </div>
            <div className="relative aspect-[3/4] overflow-hidden border border-[#AD8A53]/30 bg-[#F4EFE6] group">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=85"
                alt="Jodhpuri Bandhgala Inspiration"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-[#252321]/80 text-[#FAF8F3] p-2 text-[10px] uppercase tracking-wider">
                Bandhgala Inspiration • KF-RES-903
              </div>
            </div>
          </div>

          <div className="space-y-6 sm:col-span-2 lg:col-span-1">
            <div className="relative aspect-[3/4] overflow-hidden border border-[#AD8A53]/30 bg-[#F4EFE6] group">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85"
                alt="Fabric Swatch Roll"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-[#252321]/80 text-[#FAF8F3] p-2 text-[10px] uppercase tracking-wider">
                Uncut Roll Selvage • Sandstone Ivory
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden border border-[#AD8A53]/30 bg-[#F4EFE6] group">
              <img
                src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=85"
                alt="Contemporary Indo-Western Styling"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-[#252321]/80 text-[#FAF8F3] p-2 text-[10px] uppercase tracking-wider">
                Indo-Western Coat Inspiration
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FREQUENTLY ASKED QUESTIONS (Accordion) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-b border-[#AD8A53]/20">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-1">
            Commercial Clarity
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#30241F]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-[#30241F]/70 font-sans mt-2">
            Essential information for retailers, boutique owners, and Sherwani manufacturers.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS_DATA.slice(0, 6).map((faq) => {
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
                  <span className="font-serif text-base sm:text-lg text-[#30241F] font-medium">
                    {faq.question}
                  </span>
                  <span
                    className={`text-[#AD8A53] font-mono text-lg transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-[#30241F]/80 leading-relaxed font-sans border-t border-[#AD8A53]/10 bg-[#F4EFE6]/30">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/faq"
            className="text-xs uppercase tracking-widest font-semibold text-[#713B43] hover:underline"
          >
            View All FAQ Answers & Policies →
          </Link>
        </div>
      </section>

      {/* 11. B2B WHOLESALE & PRIORITY WHATSAPP ENQUIRY BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#FAF8F3] border-2 border-[#AD8A53] p-8 sm:p-12 lg:p-16 text-center relative">
          <span className="text-[10px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-2">
            Direct Surat Atelier Connect
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#30241F] mb-4">
            Partner with Khodal Fashion for Your Next Collection
          </h2>
          <p className="text-xs sm:text-sm text-[#30241F]/80 max-w-2xl mx-auto font-sans leading-relaxed mb-8">
            Whether you need 25 metres of ready-stock Sherwani brocade or 500 metres of exclusive custom-designed resham job-work, our commercial sales desk is ready to assist.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openEnquiryModal()}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#30241F] hover:bg-[#252321] text-[#FAF8F3] text-xs uppercase tracking-widest font-sans font-semibold transition-colors shadow"
            >
              Submit Commercial Enquiry
            </button>
            <a
              href={generateWhatsAppUrl({
                sourcePage: 'Homepage Bottom Banner',
                customNote: 'Hello Khodal Fashion, I am interested in exploring a B2B wholesale relationship for men’s ethnic fabrics.',
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#AD8A53] hover:bg-[#91703E] text-[#FAF8F3] text-xs uppercase tracking-widest font-sans font-semibold transition-colors flex items-center justify-center gap-2 shadow"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Connect on WhatsApp Desk</span>
            </a>
            <Link
              href="/wholesale-b2b"
              className="w-full sm:w-auto px-8 py-3.5 border border-[#AD8A53] text-[#30241F] hover:bg-[#F4EFE6] text-xs uppercase tracking-widest font-sans font-semibold transition-colors"
            >
              Wholesale Portal Info
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-[#AD8A53]/20 flex flex-wrap items-center justify-center gap-6 text-xs text-[#C9BBA7]">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#AD8A53]" />
              Ring Road Textile Market, Surat, Gujarat
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#AD8A53]" />
              Direct Mill/Atelier Rates
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Worldwide Insured Cargo Dispatch</span>
          </div>
        </div>
      </section>
    </div>
  );
}
