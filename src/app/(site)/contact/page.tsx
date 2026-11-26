'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Mail,
  Clock,
  Phone,
  Send,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';
import WhatsAppIcon from '@/components/WhatsAppIcon';

export default function ContactPage() {
  const { submitEnquiry, generateWhatsAppUrl } = useEnquiry();

  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [enquirySubject, setEnquirySubject] = useState('Bulk Fabric Pricing');
  const [message, setMessage] = useState('');
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
      productCode: enquirySubject,
      productName: 'General Commercial Desk Inquiry',
      quantity: 'As Discussed',
      enquiryType: 'wholesale-b2b',
      notes: message,
    });
    setSubmitting(false);
    if (result.ok) {
      setSubmitted(true);
    } else {
      setFormError(result.error);
    }
  };

  const directWhatsAppLink = generateWhatsAppUrl({
    productCode: 'CONTACT-PAGE',
    customNote: `Inquiry from ${businessName || 'Client'} (${contactPerson}). Topic: ${enquirySubject}. Note: ${message}`,
    sourcePage: 'Contact Page Direct Hotline',
  });

  return (
    <div className="bg-[#FAF8F3] text-[#30241F] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-[#AD8A53]/25 pb-8 mb-12">
        <span className="text-[12px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-2">
          Surat Commercial Headquarters
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#30241F] mb-4">
          Connect with Khodal Fashion
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[#30241F]/80 font-sans max-w-3xl leading-relaxed">
          We welcome commercial buyers, Sherwani manufacturers, boutique owners, and fashion labels. Reach out directly to discuss fabric availability, wholesale pricing, or schedule a physical showroom visit in Surat.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        {/* Contact Details & Official Coordinates */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-[#F4EFE6] border border-[#AD8A53]/30 p-6 space-y-6">
            <h2 className="font-editorial text-2xl text-[#30241F] border-b border-[#AD8A53]/20 pb-3">
              Official Head Office Coordinates
            </h2>

            <div className="space-y-4 font-sans text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#AD8A53] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#30241F] font-semibold">Registered Facility:</strong>
                  <span className="text-[#30241F]/80">
                    Khodal Fashion, Ring Road Textile Market Zone, Surat, Gujarat — 395002, India
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <WhatsAppIcon className="w-4 h-4 text-[#AD8A53] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#30241F] font-semibold">Priority WhatsApp Desk:</strong>
                  <a
                    href={directWhatsAppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#713B43] hover:underline font-medium"
                  >
                    +91 98251 23456
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#AD8A53] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#30241F] font-semibold">Commercial Email:</strong>
                  <a href="mailto:b2b@khodalfashion.com" className="text-[#30241F]/80 hover:underline">
                    b2b@khodalfashion.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#AD8A53] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#30241F] font-semibold">Visiting & Inspection Hours:</strong>
                  <span className="text-[#30241F]/80">
                    Monday to Saturday: 10:30 AM – 7:30 PM IST (Prior appointment recommended)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#AD8A53]/15">
              <a
                href={directWhatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#AD8A53] hover:bg-[#91703E] text-[#FAF8F3] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Launch WhatsApp Live Chat</span>
              </a>
            </div>
          </div>

          {/* Interactive Stylized Map View */}
          <div className="border border-[#AD8A53]/30 bg-[#252321] text-[#FAF8F3] p-6">
            <span className="text-[12px] uppercase tracking-widest text-[#AD8A53] font-semibold block mb-1">
              Surat Logistics Gateway
            </span>
            <h3 className="font-editorial text-xl text-[#FAF8F3] mb-2">
              Textile Hub Logistics Access
            </h3>
            <p className="text-xs text-[#7A6A58] font-sans leading-relaxed mb-4">
              Conveniently located 15 minutes from Surat Railway Station and 30 minutes from Surat Airport (STV), enabling same-day cargo dispatch to major transport hubs across India.
            </p>
            <div className="aspect-[16/9] w-full bg-[#30241F] border border-[#AD8A53]/20 flex items-center justify-center text-center p-4">
              <div className="space-y-1">
                <Building2 className="w-6 h-6 text-[#AD8A53] mx-auto mb-1" />
                <p className="text-xs font-semibold text-[#FAF8F3]">Khodal Fashion Atelier Bay</p>
                <p className="text-[12px] text-[#7A6A58]">Ring Road Commercial Textile Zone, Surat</p>
              </div>
            </div>
          </div>
        </div>

        {/* Commercial Inquiry Form */}
        <div className="lg:col-span-7 bg-[#FAF8F3] border-2 border-[#AD8A53]/35 p-6 sm:p-8 shadow-xl">
          <span className="text-[12px] uppercase tracking-ultra text-[#AD8A53] font-semibold block mb-1">
            Official Commercial Form
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#30241F] mb-6">
            Send Business Inquiry
          </h2>

          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
              <h3 className="font-editorial text-2xl text-[#30241F]">Inquiry Successfully Dispatched</h3>
              <p className="text-xs text-[#30241F]/80 max-w-md mx-auto leading-relaxed font-sans">
                Thank you, {contactPerson}. Your inquiry has been routed to our commercial management team in Surat. We will reply via WhatsApp or phone promptly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-[#30241F] text-[#FAF8F3] text-xs uppercase tracking-widest font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                    Business / Label Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Heritage Couture"
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
                    placeholder="e.g. Kunal Mehta"
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
                    placeholder="+91 98000 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                    Work Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="commercial@brand.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                  Enquiry Subject:
                </label>
                <select
                  value={enquirySubject}
                  onChange={(e) => setEnquirySubject(e.target.value)}
                  className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3 py-2 text-xs text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                >
                  <option value="Bulk Fabric Pricing">Bulk Fabric Pricing & Ready-Stock Availability</option>
                  <option value="Physical Swatch Book Request">Physical Swatch Book Request</option>
                  <option value="Schedule Surat Facility Visit">Schedule Surat Facility Visit</option>
                  <option value="Export & International Logistics">Export & International Logistics</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                  Message / Requirement Details:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the specific fabric codes, approximate meterage, desired base fabrics, or project timelines."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
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
                  <span>Send Inquiry to Surat Desk</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
