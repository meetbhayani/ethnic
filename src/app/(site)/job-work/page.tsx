'use client';

import React, { useState } from 'react';
import {
  Scissors,
  Layers,
  Sparkles,
  Upload,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Send,
  MessageCircle,
} from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';

export default function JobWorkPage() {
  const { submitEnquiry, generateWhatsAppUrl } = useEnquiry();

  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [embroideryType, setEmbroideryType] = useState('Zari & Dabka Metallic Bullion');
  const [fabricSource, setFabricSource] = useState('Client Supplies Base Fabric');
  const [estimatedQuantity, setEstimatedQuantity] = useState('100 Metres');
  const [projectDescription, setProjectDescription] = useState('');
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
      email,
      productCode: 'Custom Job-Work Order',
      productName: `${embroideryType} (${fabricSource})`,
      quantity: estimatedQuantity,
      enquiryType: 'custom-jobwork',
      notes: projectDescription,
    });
    setSubmitting(false);
    if (result.ok) {
      setSubmitted(true);
    } else {
      setFormError(result.error);
    }
  };

  const directWhatsAppLink = generateWhatsAppUrl({
    productCode: 'CUSTOM-JOB-WORK',
    productName: embroideryType,
    quantity: estimatedQuantity,
    customNote: `Custom Job-Work Request from ${businessName || 'B2B Client'} (${contactPerson}). Notes: ${projectDescription}`,
    sourcePage: 'Custom Job-Work Page',
  });

  return (
    <div className="bg-[#FAF8F3] text-[#30241F] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-[#AD8A53]/25 pb-8 mb-12">
        <span className="text-[12px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-2">
          Surat Facility B2B Services
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#30241F] mb-4">
          Custom Embroidery & Job-Work
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[#30241F]/80 font-sans max-w-3xl leading-relaxed">
          Engineered solutions for fashion labels, Sherwani manufacturers, and garment exporters. We transform client design sketches, museum references, or proprietary artwork into pristine embroidered yardage executed on our Surat computerized multi-head bays.
        </p>
      </div>

      {/* Process Architecture Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        <div className="lg:col-span-6 space-y-6">
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#30241F]">
            Our Job-Work Capabilities
          </h2>
          <div className="w-12 h-[2px] bg-[#713B43]" />

          <div className="space-y-4 font-sans text-xs">
            <div className="p-4 bg-[#F4EFE6] border border-[#AD8A53]/25">
              <h3 className="font-semibold text-sm text-[#30241F] mb-1 flex items-center gap-2">
                <Scissors className="w-4 h-4 text-[#AD8A53]" />
                1. Flexible Fabric Sourcing
              </h3>
              <p className="text-[#30241F]/80 leading-relaxed">
                You may supply your own specialty base fabrics (pure raw silk, velvet, chanderi, or imported suiting) to our Surat facility, or select from our curated stock of pre-tested foundations.
              </p>
            </div>

            <div className="p-4 bg-[#F4EFE6] border border-[#AD8A53]/25">
              <h3 className="font-semibold text-sm text-[#30241F] mb-1 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#AD8A53]" />
                2. CAD Digitizing & Motif Punching
              </h3>
              <p className="text-[#30241F]/80 leading-relaxed">
                Our master digitizers program optimal needle paths to prevent fabric strain, ensuring balanced stitch tension and clean selvage margins for garment cutting.
              </p>
            </div>

            <div className="p-4 bg-[#F4EFE6] border border-[#AD8A53]/25">
              <h3 className="font-semibold text-sm text-[#30241F] mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#AD8A53]" />
                3. Physical Strike-Off Approval
              </h3>
              <p className="text-[#30241F]/80 leading-relaxed">
                Before commencing full bulk yardage, we provide physical 1-to-2-metre strike-offs for your design team to inspect color, thread luster, and hand-feel.
              </p>
            </div>

            <div className="p-4 bg-[#F4EFE6] border border-[#AD8A53]/25">
              <h3 className="font-semibold text-sm text-[#30241F] mb-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#AD8A53]" />
                4. Quality Control & Light-Table Inspection
              </h3>
              <p className="text-[#30241F]/80 leading-relaxed">
                Full-run thread trimming, reverse-knot audits, and moisture-protected rolling ensure that each roll arrives ready for high-efficiency cutting tables.
              </p>
            </div>
          </div>
        </div>

        {/* Custom Job-Work Inquiry Form */}
        <div className="lg:col-span-6 bg-[#FAF8F3] border-2 border-[#AD8A53]/40 p-6 sm:p-8 shadow-xl">
          <span className="text-[12px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-1">
            Commercial Project Intake
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#30241F] mb-6">
            Submit Job-Work Specification
          </h2>

          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
              <h3 className="font-editorial text-2xl text-[#30241F]">
                Job-Work Inquiry Registered
              </h3>
              <p className="text-xs text-[#30241F]/80 max-w-md mx-auto leading-relaxed font-sans">
                Thank you, {contactPerson}. Your custom embroidery specification has been delivered to our Surat technical team. We will review the requirements and contact you within 24 business hours.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={directWhatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-[#AD8A53] text-[#FAF8F3] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open WhatsApp Thread</span>
                </a>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 border border-[#30241F] text-[#30241F] text-xs uppercase tracking-widest font-semibold"
                >
                  Submit Another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                    Brand / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Grooms Atelier"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Devendra Singh"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98250 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="production@label.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                    Embroidery Craft Needed:
                  </label>
                  <select
                    value={embroideryType}
                    onChange={(e) => setEmbroideryType(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                  >
                    <option value="Zari & Dabka Metallic Bullion">Zari & Dabka Metallic Bullion</option>
                    <option value="Cutdana & Micro-Bead Jaal">Cutdana & Micro-Bead Jaal</option>
                    <option value="Resham Multi-Shade Silk Thread">Resham Multi-Shade Silk Thread</option>
                    <option value="Matte & Smoked Micro-Sequins">Matte & Smoked Micro-Sequins</option>
                    <option value="Hybrid Multi-Craft Embroidery">Hybrid Multi-Craft Embroidery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                    Fabric Sourcing Preference:
                  </label>
                  <select
                    value={fabricSource}
                    onChange={(e) => setFabricSource(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                  >
                    <option value="Client Supplies Base Fabric">Client Supplies Base Fabric</option>
                    <option value="Khodal Fashion Supplies Base Fabric">Khodal Fashion Supplies Base Fabric</option>
                    <option value="Open to Recommendation">Open to Recommendation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                  Approximate Production Quantity (Metres)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100 Metres (or 5-metre sampling strike-off)"
                  value={estimatedQuantity}
                  onChange={(e) => setEstimatedQuantity(e.target.value)}
                  className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                />
              </div>

              <div>
                <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                  Project Details & Motif References:
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe motif repeat dimensions, color references, target delivery schedules, or garment silhouettes."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
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
                  <span>Submit Job-Work Inquiry</span>
                </button>
              </div>

              <p className="text-[12px] text-[#7A6A58] text-center pt-2">
                All client proprietary artwork and motifs remain strictly confidential under business ethics.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
