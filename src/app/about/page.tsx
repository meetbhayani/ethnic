'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, CheckCircle2, Building2, MessageCircle } from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';

export default function AboutPage() {
  const { generateWhatsAppUrl } = useEnquiry();

  return (
    <div className="bg-[#FAF8F3] text-[#30241F] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-[#AD8A53]/25 pb-8 mb-12">
        <span className="text-[10px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-2">
          The House of Khodal Fashion
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#30241F] mb-6 leading-tight">
          Surat&apos;s Dedicated Atelier for <br />
          <span className="italic font-serif text-[#713B43]">Royal Men&apos;s Ethnic Textiles</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[#30241F]/80 font-sans max-w-3xl leading-relaxed">
          Rooted in Surat, Gujarat—the undisputed textile capital of India—Khodal Fashion was established with a focused purpose: to provide unstitched embroidered fabrics of sovereign royal stature to menswear couturiers, Sherwani manufacturers, and luxury ethnic retailers.
        </p>
      </div>

      {/* Story & Philosophy Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
        <div className="lg:col-span-6 space-y-6">
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#30241F]">
            Our Textile Focus
          </h2>
          <div className="w-12 h-[2px] bg-[#AD8A53]" />

          <p className="text-xs sm:text-sm text-[#30241F]/85 font-sans leading-relaxed">
            While much of the commercial market produces generic, lightweight fabrics, our focus remains squarely on the regal aesthetics of Indian courtly traditions. We specialize in the complex geometries of zardozi bullion, intricate Japanese glass cutdana, multi-shade silk resham, and architectural micro-sequins.
          </p>

          <p className="text-xs sm:text-sm text-[#30241F]/85 font-sans leading-relaxed">
            Our fabrics are designed with tailoring realities in mind. We balance embroidery stitch density against base fabric tensile strength, ensuring that tailored collars stand crisp, shoulders fall clean, and seams resist pull stress.
          </p>

          <div className="border-l-2 border-[#713B43] pl-4 italic font-serif text-sm text-[#30241F]">
            &ldquo;We do not claim centuries of forgotten lineage. We offer genuine, verified craftsmanship engineered today in our Surat facility with transparent business practices.&rdquo;
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative aspect-[4/3] bg-[#F4EFE6] border border-[#AD8A53]/30 overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85"
              alt="Artisan checking embroidery at Khodal Fashion Surat"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 right-3 bg-[#252321]/80 backdrop-blur-sm text-[#FAF8F3] p-2.5 text-[10px] uppercase tracking-wider">
              Surat Ring Road Atelier Workshop
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Transparency Commitments */}
      <div className="bg-[#F4EFE6] border border-[#AD8A53]/30 p-8 sm:p-12 mb-16">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <span className="text-[10px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-1">
            B2B Integrity Standard
          </span>
          <h2 className="font-editorial text-3xl text-[#30241F]">
            Our Business Principles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
          <div className="bg-[#FAF8F3] p-5 border border-[#AD8A53]/20 space-y-2">
            <ShieldCheck className="w-5 h-5 text-[#AD8A53]" />
            <h3 className="font-semibold text-sm text-[#30241F]">Authentic Descriptions</h3>
            <p className="text-[#30241F]/80 leading-relaxed">
              We never fabricate unverified awards, arbitrary certification badges, or exaggerated production numbers. What you see is what our Surat machines weave.
            </p>
          </div>

          <div className="bg-[#FAF8F3] p-5 border border-[#AD8A53]/20 space-y-2">
            <Building2 className="w-5 h-5 text-[#AD8A53]" />
            <h3 className="font-semibold text-sm text-[#30241F]">Unstitched Fabric Supplier</h3>
            <p className="text-[#30241F]/80 leading-relaxed">
              We sell fabric by the metre and execute custom job-work. We do not compete with our menswear boutique clients by selling stitched garments.
            </p>
          </div>

          <div className="bg-[#FAF8F3] p-5 border border-[#AD8A53]/20 space-y-2">
            <MapPin className="w-5 h-5 text-[#AD8A53]" />
            <h3 className="font-semibold text-sm text-[#30241F]">Open Commercial Visits</h3>
            <p className="text-[#30241F]/80 leading-relaxed">
              We welcome verified retailers, designers, and manufacturers to inspect our rolls and embroidery frames in Surat by prior appointment.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Row */}
      <div className="text-center">
        <a
          href={generateWhatsAppUrl({ sourcePage: 'About Page Connect' })}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#AD8A53] hover:bg-[#91703E] text-[#FAF8F3] text-xs uppercase tracking-widest font-sans font-semibold transition-colors shadow"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Connect with Our Surat Sales Desk</span>
        </a>
      </div>
    </div>
  );
}
