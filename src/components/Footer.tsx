'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, MessageCircle, Mail, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';

export default function Footer() {
  const { generateWhatsAppUrl } = useEnquiry();

  return (
    <footer className="bg-[#252321] text-[#FAF8F3] border-t border-[#30241F] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Editorial Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-[#30241F]/80">
          <div className="lg:col-span-6 space-y-4">
            <p className="text-[12px] uppercase tracking-ultra text-[#AD8A53] font-sans font-semibold">
              The Sovereign Fabric House • Surat, India
            </p>
            <h3 className="font-editorial text-3xl sm:text-4xl md:text-5xl tracking-wide text-[#FAF8F3]">
              KHODAL FASHION
            </h3>
            <p className="text-[#C9BBA7] text-xs sm:text-sm font-sans leading-relaxed max-w-xl">
              Specialized master weavers and computerized embroidery artisans delivering royal embroidered fabrics to prestigious Indian menswear labels, Sherwani manufacturers, boutique couturiers, and textile merchants across the globe.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#30241F] border border-[#AD8A53]/30 text-[#AD8A53] text-[12px] tracking-widest uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                B2B Verified Textile Partner
              </span>
              <span className="text-xs text-[#C9BBA7]">Surat Textile Ecosystem</span>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="bg-[#30241F] p-6 border border-[#AD8A53]/20">
              <p className="text-[13px] uppercase tracking-widest text-[#AD8A53] font-semibold mb-2">
                Important Business Clarification
              </p>
              <p className="text-xs text-[#C9BBA7] leading-relaxed">
                Khodal Fashion supplies <strong>unstitched embroidered fabrics</strong> by the metre and executes <strong>custom embroidery job-work</strong>. We do not manufacture or sell finished stitched garments (Sherwanis or Kurtas). Lookbook images represent fabric styling inspiration.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={generateWhatsAppUrl({ sourcePage: 'Footer Priority Desk' })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#AD8A53] hover:bg-[#91703E] text-[#FAF8F3] px-5 py-2.5 text-xs uppercase tracking-widest font-sans font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Direct WhatsApp Enquiry</span>
              </a>
              <Link
                href="/ai-tryon"
                className="inline-flex items-center gap-2 border border-[#AD8A53]/50 hover:border-[#AD8A53] text-[#FAF8F3] px-5 py-2.5 text-xs uppercase tracking-widest font-sans font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#AD8A53]" />
                <span>Launch AI Try-On Studio</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12 border-b border-[#30241F]/80 text-xs">
          {/* Col 1: Fabric Categories */}
          <div>
            <h4 className="text-[12px] uppercase tracking-ultra text-[#AD8A53] font-semibold mb-4">
              Fabric Collections
            </h4>
            <ul className="space-y-2.5 font-sans text-[#C9BBA7]">
              <li>
                <Link href="/collections?category=sherwani" className="hover:text-[#FAF8F3] transition-colors">
                  Sherwani Fabrics
                </Link>
              </li>
              <li>
                <Link href="/collections?category=kurta" className="hover:text-[#FAF8F3] transition-colors">
                  Kurta Fabrics
                </Link>
              </li>
              <li>
                <Link href="/collections?category=jodhpuri" className="hover:text-[#FAF8F3] transition-colors">
                  Jodhpuri Bandhgala
                </Link>
              </li>
              <li>
                <Link href="/collections?category=indo-western" className="hover:text-[#FAF8F3] transition-colors">
                  Indo-Western Fabrics
                </Link>
              </li>
              <li>
                <Link href="/collections?category=brocade" className="hover:text-[#FAF8F3] transition-colors">
                  Benarasi Tissue Brocades
                </Link>
              </li>
              <li>
                <Link href="/collections?category=designer" className="hover:text-[#FAF8F3] transition-colors">
                  Designer Ethnic Fabrics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Embroidery Crafts */}
          <div>
            <h4 className="text-[12px] uppercase tracking-ultra text-[#AD8A53] font-semibold mb-4">
              Embroidery Crafts
            </h4>
            <ul className="space-y-2.5 font-sans text-[#C9BBA7]">
              <li>
                <Link href="/craftsmanship#zari-dabka" className="hover:text-[#FAF8F3] transition-colors">
                  Antique Zari & Dabka
                </Link>
              </li>
              <li>
                <Link href="/craftsmanship#cutdana-bead" className="hover:text-[#FAF8F3] transition-colors">
                  Japanese Cutdana & Beads
                </Link>
              </li>
              <li>
                <Link href="/craftsmanship#resham-thread" className="hover:text-[#FAF8F3] transition-colors">
                  Resham Silk Threadwork
                </Link>
              </li>
              <li>
                <Link href="/craftsmanship#sequin-embroidery" className="hover:text-[#FAF8F3] transition-colors">
                  Matte & Smoked Micro-Sequin
                </Link>
              </li>
              <li>
                <Link href="/job-work" className="hover:text-[#FAF8F3] transition-colors">
                  Custom Job-Work Bay
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#FAF8F3] transition-colors">
                  Macro Craftsmanship Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Business & Buyers */}
          <div>
            <h4 className="text-[12px] uppercase tracking-ultra text-[#AD8A53] font-semibold mb-4">
              B2B & Partnerships
            </h4>
            <ul className="space-y-2.5 font-sans text-[#C9BBA7]">
              <li>
                <Link href="/wholesale-b2b" className="hover:text-[#FAF8F3] transition-colors">
                  Wholesale Buyer Portal
                </Link>
              </li>
              <li>
                <Link href="/job-work" className="hover:text-[#FAF8F3] transition-colors">
                  Custom Embroidery Services
                </Link>
              </li>
              <li>
                <Link href="/process-quality" className="hover:text-[#FAF8F3] transition-colors">
                  Quality & Inspection Process
                </Link>
              </li>
              <li>
                <Link href="/wholesale-b2b#swatch-kit" className="hover:text-[#FAF8F3] transition-colors">
                  Request Swatch Sample Book
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#FAF8F3] transition-colors">
                  Commercial Buyer FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div>
            <h4 className="text-[12px] uppercase tracking-ultra text-[#AD8A53] font-semibold mb-4">
              Policies & Governance
            </h4>
            <ul className="space-y-2.5 font-sans text-[#C9BBA7]">
              <li>
                <Link href="/policies#privacy" className="hover:text-[#FAF8F3] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies#terms" className="hover:text-[#FAF8F3] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/policies#ai-policy" className="hover:text-[#FAF8F3] transition-colors">
                  AI Image Upload & Usage Policy
                </Link>
              </li>
              <li>
                <Link href="/policies#enquiry-policy" className="hover:text-[#FAF8F3] transition-colors">
                  Enquiry & Order Policy
                </Link>
              </li>
              <li>
                <Link href="/policies#shipping" className="hover:text-[#FAF8F3] transition-colors">
                  Dispatch & Cargo Logistics
                </Link>
              </li>
              <li>
                <Link href="/policies#returns" className="hover:text-[#FAF8F3] transition-colors">
                  Returns & Sampling Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Surat Contact */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="text-[12px] uppercase tracking-ultra text-[#AD8A53] font-semibold mb-4">
              Atelier Address
            </h4>
            <div className="space-y-3 font-sans text-[#C9BBA7]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#AD8A53] shrink-0 mt-0.5" />
                <span>
                  Khodal Fashion, Ring Road Textile Market Zone, Surat, Gujarat — 395002, India
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#AD8A53] shrink-0" />
                <span>WhatsApp: +91 98251 23456</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#AD8A53] shrink-0" />
                <span>b2b@khodalfashion.com</span>
              </div>
              <p className="text-[13px] text-[#C9BBA7]/70 pt-1">
                Visiting Hours: Mon – Sat, 10:30 AM – 7:30 PM (By prior appointment)
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Editorial Legal Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#C9BBA7]/70 font-sans gap-4">
          <p>© {new Date().getFullYear()} KHODAL FASHION. All Rights Reserved. Surat, Gujarat, India.</p>
          <p className="text-center md:text-right text-[13px]">
            Master Craftsmen in Royal Men’s Ethnic Embroidered Fabrics & Custom Job-Work.
          </p>
        </div>
      </div>
    </footer>
  );
}
