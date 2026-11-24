'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, MessageCircle, ArrowUpRight, CheckCircle2, Sparkles, Send } from 'lucide-react';
import { useEnquiry } from '@/context/EnquiryContext';

export default function EnquiryModal() {
  const { modalData, closeEnquiryModal, submitEnquiry, generateWhatsAppUrl } = useEnquiry();
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(modalData.defaultQty || '25 Metres');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');

  // Each time the modal opens, start from a fresh form (not the last success screen).
  useEffect(() => {
    if (modalData.isOpen) {
      setSubmitted(false);
      setSubmitting(false);
      setFormError(null);
      setNotes('');
      setQuantity(modalData.defaultQty || '25 Metres');
    }
  }, [modalData.isOpen, modalData.fabric, modalData.defaultQty]);

  // Close on Escape.
  useEffect(() => {
    if (!modalData.isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeEnquiryModal();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalData.isOpen, closeEnquiryModal]);

  if (!modalData.isOpen) return null;

  const fabric = modalData.fabric;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setFormError(null);
    const result = await submitEnquiry({
      website: honeypot,
      sourcePage: fabric ? `Enquiry modal (${fabric.code})` : 'Enquiry modal',
      businessName,
      contactPerson,
      phone,
      email,
      productCode: fabric?.code || 'Catalog General',
      productName: fabric?.name || 'Multiple Fabric Inquiry',
      quantity,
      enquiryType: 'fabric-price',
      notes,
    });
    setSubmitting(false);
    if (result.ok) {
      setSubmitted(true);
    } else {
      setFormError(result.error);
    }
  };

  const directWhatsAppLink = generateWhatsAppUrl({
    productCode: fabric?.code,
    productName: fabric?.name,
    quantity,
    customNote: notes || `Inquiry from ${businessName || 'B2B Client'} (${contactPerson || 'Contact'})`,
    sourcePage: 'Website Enquiry Modal',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252321]/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#FAF8F3] border border-[#AD8A53] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeEnquiryModal}
          className="absolute top-4 right-4 text-[#30241F] hover:text-[#713B43] p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
            <h3 className="font-editorial text-2xl text-[#30241F]">
              Enquiry Dispatched to Surat Desk
            </h3>
            <p className="text-xs text-[#30241F]/80 max-w-md mx-auto leading-relaxed font-sans">
              Thank you, {contactPerson || 'Valued Buyer'}. Your inquiry for{' '}
              <strong>{fabric?.code || 'our textile collections'}</strong> has been recorded in our Surat B2B system. Our commercial coordinator will review meterage availability and share the quotation.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={directWhatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#AD8A53] text-[#FAF8F3] py-2.5 px-6 text-xs uppercase tracking-widest font-sans font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open in WhatsApp Now</span>
              </a>
              <button
                onClick={() => {
                  setSubmitted(false);
                  closeEnquiryModal();
                }}
                className="border border-[#30241F] text-[#30241F] py-2.5 px-6 text-xs uppercase tracking-widest font-sans font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="border-b border-[#AD8A53]/20 pb-4 mb-6">
              <span className="text-[12px] uppercase tracking-ultra text-[#AD8A53] font-semibold">
                Official B2B Inquiry Desk
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-[#30241F] mt-1">
                {fabric ? `Request Price for ${fabric.name}` : 'Commercial Fabric & Job-Work Inquiry'}
              </h2>
              {fabric && (
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="font-mono bg-[#F4EFE6] px-2 py-0.5 border border-[#AD8A53]/30 text-[#AD8A53] font-semibold">
                    {fabric.code}
                  </span>
                  <span className="text-[#7A6A58]">•</span>
                  <span className="text-[#713B43] font-medium">{fabric.embroideryTypeLabel}</span>
                  <span className="text-[#7A6A58]">•</span>
                  <span className="text-[#30241F]/70">MOQ: {fabric.moq}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                    Business / Label Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Grooms Atelier"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3.5 py-2 text-xs font-sans text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Sharma"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3.5 py-2 text-xs font-sans text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
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
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3.5 py-2 text-xs font-sans text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                    Work Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="buyer@brand.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3.5 py-2 text-xs font-sans text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                  Estimated Requirement Quantity (Metres)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 25 Metres (or 2-metre sample cut)"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3.5 py-2 text-xs font-sans text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
                />
              </div>

              <div>
                <label className="block text-[13px] uppercase tracking-wider text-[#30241F] font-semibold mb-1">
                  Specific Specifications / Colorway Requests
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention target delivery timeline, custom base fabric preferences, or if you need physical swatch cuttings sent to your city."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#F4EFE6] border border-[#AD8A53]/40 px-3.5 py-2 text-xs font-sans text-[#30241F] focus:outline-none focus:border-[#AD8A53]"
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

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="disabled:opacity-60 disabled:cursor-wait flex-1py-3 bg-[#30241F] hover:bg-[#252321] text-[#FAF8F3] text-xs uppercase tracking-widest font-sans font-semibold transition-colors flex items-center justify-center gap-2 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry to Desk</span>
                </button>

                <a
                  href={directWhatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-[#AD8A53] hover:bg-[#91703E] text-[#FAF8F3] text-xs uppercase tracking-widest font-sans font-semibold transition-colors flex items-center justify-center gap-2 shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Direct WhatsApp</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>

              <p className="text-[12px] text-[#7A6A58] text-center pt-2">
                We respect confidentiality. Swatch details are shared exclusively with verified B2B buyers.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
