'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  CheckCircle2,
  Package,
  Layers,
  ArrowRight,
  Send,
} from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';
import WhatsAppIcon from '@/components/WhatsAppIcon';

export default function WholesaleB2BPage() {
  const { submitEnquiry, generateWhatsAppUrl, openEnquiryModal } = useEnquiry();

  const [businessName, setBusinessName] = useState('');
  const [buyerType, setBuyerType] = useState('Sherwani Manufacturer');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [quantity, setQuantity] = useState('50 Metres');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setFormError(null);
    const result = await submitEnquiry({
      website: honeypot,
      businessName,
      contactPerson,
      phone,
      email: '',
      productCode: `B2B Wholesale Application (${buyerType})`,
      productName: 'Wholesale Swatch Kit & Volume Pricing',
      quantity,
      enquiryType: 'wholesale-b2b',
      notes: [city && `City: ${city}`, `Buyer type: ${buyerType}`, notes].filter(Boolean).join('\n'),
    });
    setSubmitting(false);
    if (result.ok) {
      setSubmitted(true);
    } else {
      setFormError(result.error);
    }
  };

  const directWhatsAppLink = generateWhatsAppUrl({
    productCode: 'B2B-WHOLESALE',
    productName: buyerType,
    quantity,
    customNote: `Wholesale B2B enquiry from ${businessName} in ${city}. Looking for sample swatches and volume pricing.`,
    sourcePage: 'Wholesale B2B Landing Page',
  });

  return (
    <div className="bg-[#FAF8F3] text-[#30241F] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-[#AD8A53]/25 pb-8 mb-12">
        <span className="text-[12px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-2">
          Commercial Procurement Portal
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#30241F] mb-4">
          Wholesale & B2B Partnerships
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[#30241F]/80 font-sans max-w-3xl leading-relaxed">
          Dedicated procurement desk for men&apos;s ethnic wear retailers, Sherwani manufacturers, boutique couturiers, and garment exporters seeking direct mill-gate pricing and dependable production runs.
        </p>
      </div>

      {/* Target Buyer Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-[#F4EFE6] border border-[#AD8A53]/30 p-6 space-y-3">
          <Building2 className="w-6 h-6 text-[#AD8A53]" />
          <h3 className="font-editorial text-2xl text-[#30241F]">Sherwani Manufacturers</h3>
          <p className="text-xs text-[#30241F]/80 font-sans leading-relaxed">
            Access 44&quot; heavy zardozi brocades, continuous panel rolls, and coordinated border trims engineered for high-volume automated cutting bays.
          </p>
          <span className="text-[12px] text-[#713B43] uppercase tracking-wider font-semibold block pt-2">
            MOQ: 25M ready / 100M custom
          </span>
        </div>

        <div className="bg-[#F4EFE6] border border-[#AD8A53]/30 p-6 space-y-3">
          <Users className="w-6 h-6 text-[#AD8A53]" />
          <h3 className="font-editorial text-2xl text-[#30241F]">Boutiques & Designers</h3>
          <p className="text-xs text-[#30241F]/80 font-sans leading-relaxed">
            Order flexible trial lengths (from 20 metres) for bespoke bridal groom capsules, festive Sangeet lookbooks, and luxury pop-up exhibits.
          </p>
          <span className="text-[12px] text-[#713B43] uppercase tracking-wider font-semibold block pt-2">
            Swatch Kits Available
          </span>
        </div>

        <div className="bg-[#F4EFE6] border border-[#AD8A53]/30 p-6 space-y-3">
          <Layers className="w-6 h-6 text-[#AD8A53]" />
          <h3 className="font-editorial text-2xl text-[#30241F]">Wholesalers & Distributors</h3>
          <p className="text-xs text-[#30241F]/80 font-sans leading-relaxed">
            Partner on exclusive regional design codes with staggered roll dispatch schedules and priority access to seasonal festive launches.
          </p>
          <span className="text-[12px] text-[#713B43] uppercase tracking-wider font-semibold block pt-2">
            Volume Discount Tiers
          </span>
        </div>
      </div>

      {/* Swatch Kit Showcase & B2B Inquiry Form */}
      <div id="swatch-kit" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
        <div className="lg:col-span-6 space-y-6">
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#30241F]">
            Request the Khodal Fashion <br />
            <span className="italic text-[#713B43]">Atelier Swatch Book</span>
          </h2>
          <div className="w-12 h-[2px] bg-[#AD8A53]" />

          <p className="text-xs sm:text-sm text-[#30241F]/80 font-sans leading-relaxed">
            We provide physical swatch folders featuring actual 6&quot;x6&quot; cuttings of our running Sherwani brocades, cutdana beads, and resham threadwork directly to verified commercial buyers across India.
          </p>

          <div className="space-y-3 font-sans text-xs text-[#30241F]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#AD8A53]" />
              <span>Includes 15+ running high-demand men&apos;s ethnic fabric swatches</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#AD8A53]" />
              <span>Complete technical spec sheet (GSM, width, base fabric composition)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#AD8A53]" />
              <span>Official commercial price list and tier volume structures</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#AD8A53]" />
              <span>Dispatched via express courier from Surat</span>
            </div>
          </div>

          <div className="pt-4">
            <a
              href={directWhatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#AD8A53] hover:bg-[#91703E] text-[#FAF8F3] text-xs uppercase tracking-widest font-semibold transition-colors shadow"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Direct WhatsApp Desk</span>
            </a>
          </div>
        </div>

        {/* B2B Onboarding Form */}
        <div className="lg:col-span-6 bg-[#FAF8F3] border-2 border-[#AD8A53]/35 p-6 sm:p-8 shadow-xl">
          <span className="text-[12px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-1">
            Buyer Registration
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#30241F] mb-6">
            Wholesale Procurement Form
          </h2>

          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
              <h3 className="font-editorial text-2xl text-[#30241F]">Application Received</h3>
              <p className="text-xs text-[#30241F]/80 max-w-md mx-auto leading-relaxed font-sans">
                Thank you, {contactPerson}. Your wholesale inquiry for {businessName} has been received. Our Surat commercial desk will verify the details and dispatch our wholesale catalogue and swatch kit.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-[#30241F] text-[#FAF8F3] text-xs uppercase tracking-widest font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                    Business / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Grooms Label"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                    Business Classification *
                  </label>
                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                  >
                    <option value="Sherwani Manufacturer">Sherwani Manufacturer</option>
                    <option value="Menswear Boutique Owner">Menswear Boutique Owner</option>
                    <option value="Fashion Designer / Couture Label">Fashion Designer / Couture Label</option>
                    <option value="Garment Manufacturer & Exporter">Garment Manufacturer & Exporter</option>
                    <option value="Textile Wholesaler & Merchant">Textile Wholesaler & Merchant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yashvardhan"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98000 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                    Operating City / State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Maharashtra"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                    Estimated Monthly Meterage:
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                  >
                    <option value="25 to 50 Metres (Trial Roll)">25 to 50 Metres (Trial Roll)</option>
                    <option value="50 to 150 Metres">50 to 150 Metres</option>
                    <option value="150 to 500 Metres (Regular Buyer)">150 to 500 Metres (Regular Buyer)</option>
                    <option value="500+ Metres (Bulk Commercial)">500+ Metres (Bulk Commercial)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                  Specific Designs / Swatch Requests:
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention if you need sample cuts of particular design codes or custom embroidery execution."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                />
              </div>

              {/* Honeypot: hidden from people, catches spam bots */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              {formError && (
                <p role="alert" className="text-xs text-[#713B43] bg-rose-50 border border-[#713B43]/30 px-3 py-2">
                  {formError}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="disabled:opacity-60 disabled:cursor-wait w-full py-3.5 bg-[#30241F] hover:bg-[#252321] text-[#FAF8F3] text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Register Wholesale Account</span>
                </button>
              </div>

              <p className="text-[12px] text-[#7A6A58] text-center pt-2">
                Verification ensures wholesale rates remain strictly confidential between trade partners.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
