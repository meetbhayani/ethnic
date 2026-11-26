'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function PoliciesPage() {
  return (
    <div className="bg-[#FAF8F3] text-[#30241F] py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#AD8A53]/25 pb-8 mb-12">
        <span className="text-[12px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-2">
          Legal & Operational Policies
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#30241F] mb-4">
          Policies & Commercial Governance
        </h1>
        <p className="text-xs sm:text-sm text-[#30241F]/80 font-sans max-w-2xl leading-relaxed">
          Official policies governing fabric orders, AI image handling, sample swatch approvals, dispatch logistics, and trade confidentiality.
        </p>
      </div>

      <div className="space-y-16 text-xs font-sans text-[#30241F]/85 leading-relaxed">
        {/* Policy 1: Privacy Policy */}
        <section id="privacy" className="border-b border-[#AD8A53]/20 pb-12">
          <h2 className="font-editorial text-2xl text-[#30241F] mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#AD8A53]" />
            1. Privacy Policy
          </h2>
          <p className="mb-3">
            Khodal Fashion is committed to safeguarding the privacy and business confidentiality of our commercial buyers, boutique owners, and tailoring partners. We collect contact details (business name, contact person, WhatsApp phone number, and delivery city) exclusively for processing fabric enquiries, coordinating swatch book dispatches, and providing commercial quotations.
          </p>
          <p className="mb-3">
            We never sell, rent, or lease commercial buyer contact lists or proprietary client design sketches to any third parties. All client communications are treated under standard commercial confidentiality.
          </p>
        </section>

        {/* Policy 2: Terms and Conditions */}
        <section id="terms" className="border-b border-[#AD8A53]/20 pb-12">
          <h2 className="font-editorial text-2xl text-[#30241F] mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#AD8A53]" />
            2. Terms & Conditions
          </h2>
          <p className="mb-3">
            <strong>Unstitched Fabric Sale:</strong> Khodal Fashion operates exclusively as a textile manufacturer, embroidery facility, and fabric wholesaler. All goods supplied are unstitched fabric yardage measured by the metre. Garments displayed on models in our lookbooks, editorial imagery, and AI previews are solely for styling inspiration.
          </p>
          <p className="mb-3">
            <strong>Commercial Quotations:</strong> Quoted prices are valid for 7 calendar days from issuance due to market fluctuations in silk warp and metallic bullion wire raw materials. GST and cargo transport charges are billed transparently as per prevailing Indian tax statutes.
          </p>
        </section>

        {/* Policy 3: AI Image Upload and Usage Policy */}
        <section id="ai-policy" className="border-b border-[#AD8A53]/20 pb-12">
          <h2 className="font-editorial text-2xl text-[#30241F] mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#AD8A53]" />
            3. AI Image Upload and Usage Policy
          </h2>
          <p className="mb-3">
            Our AI Virtual Try-On tool provides illustrative design simulations to help designers and buyers visualize unstitched fabric patterns draped onto menswear silhouettes. By utilizing this feature, you acknowledge and agree:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-3">
            <li>
              <strong>Illustrative Nature:</strong> AI previews are conceptual visual aids. They do not guarantee exact physical drape, weight (GSM), stiffening interlining compatibility, or 100% color-match to physical yarn.
            </li>
            <li>
              <strong>Consent & Image Security:</strong> Upload only photos you have the right to use. An uploaded photo is sent, together with the selected fabric photo, to an open-source AI model (FLUX.2 [klein]) run by Cloudflare Workers AI, which does not retain the data, solely to create the requested preview.
            </li>
            <li>
              <strong>No Storage:</strong> Khodal Fashion does not save uploaded photos or generated previews on its servers. The preview exists only in your browser until you close the page or save it.
            </li>
          </ul>
        </section>

        {/* Policy 4: Enquiry & Order Policy */}
        <section id="enquiry-policy" className="border-b border-[#AD8A53]/20 pb-12">
          <h2 className="font-editorial text-2xl text-[#30241F] mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#AD8A53]" />
            4. Enquiry & Order Policy
          </h2>
          <p className="mb-3">
            <strong>Minimum Order Quantities (MOQ):</strong> The minimum order is 10 to 15 metres per design/colourway, for both running ready-stock catalogue weaves and made-to-order colourways.
          </p>
          <p className="mb-3">
            <strong>Strike-Off Approvals:</strong> For custom runs, production begins only upon written or WhatsApp sign-off of physical strike-off swatches.
          </p>
        </section>

        {/* Policy 5: Shipping, Dispatch & Returns */}
        <section id="shipping" className="pb-4">
          <h2 className="font-editorial text-2xl text-[#30241F] mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#AD8A53]" />
            5. Dispatch Logistics, Sampling & Returns
          </h2>
          <p className="mb-3">
            <strong>Dispatch Timelines:</strong> In-stock fabrics are dispatched from our Surat warehouse within 24 to 48 business hours via insured courier or dedicated transport cargo. Tracking airway bills (AWB) are shared directly with the buyer.
          </p>
          <p id="returns" className="mb-3 scroll-mt-32">
            <strong>Inspection & Claims:</strong> Fabric rolls must be inspected over a cutting table prior to scissors cutting or garment processing. Any verified manufacturing defects must be reported to our Surat desk within 7 days of delivery prior to fabric cutting.
          </p>
        </section>
      </div>
    </div>
  );
}
