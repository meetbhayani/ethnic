'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { FabricItem, CustomerEnquiry } from '../types';
import { FABRICS_DATA } from '../data/fabrics';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { FabricRow, rowToFabric } from '@/lib/fabrics';

interface EnquiryModalData {
  isOpen: boolean;
  fabric?: FabricItem;
  defaultQty?: string;
}

export type EnquirySubmission = Omit<CustomerEnquiry, 'id' | 'timestamp' | 'status'> & {
  sourcePage?: string;
  /** Honeypot field — must stay empty for real users. */
  website?: string;
};

export type SubmitResult = { ok: true } | { ok: false; error: string };

interface EnquiryContextType {
  fabrics: FabricItem[];
  fabricsLoaded: boolean;
  refreshFabrics: () => Promise<void>;
  modalData: EnquiryModalData;
  openEnquiryModal: (fabric?: FabricItem, defaultQty?: string) => void;
  closeEnquiryModal: () => void;
  submitEnquiry: (enquiry: EnquirySubmission) => Promise<SubmitResult>;
  generateWhatsAppUrl: (data: {
    productCode?: string;
    productName?: string;
    quantity?: string;
    customNote?: string;
    sourcePage?: string;
  }) => string;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

/** WhatsApp number from env, normalised to international format (10-digit Indian numbers get 91). */
function getWhatsAppNumber(): string {
  const digits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919825123456').replace(/\D/g, '');
  return digits.length === 10 ? `91${digits}` : digits;
}

export function EnquiryProvider({
  children,
  initialFabrics,
}: {
  children: React.ReactNode;
  /** Live catalogue rendered on the server. When given, no client fetch is needed. */
  initialFabrics?: FabricItem[];
}) {
  // Real catalogue from the server when available; the built-in sample data is only a
  // last-resort fallback for when Supabase cannot be reached.
  const [fabrics, setFabrics] = useState<FabricItem[]>(initialFabrics ?? FABRICS_DATA);
  const [fabricsLoaded, setFabricsLoaded] = useState(Boolean(initialFabrics));

  const [modalData, setModalData] = useState<EnquiryModalData>({
    isOpen: false,
    fabric: undefined,
    defaultQty: '10–15 Metres',
  });

  const refreshFabrics = useCallback(async () => {
    try {
      const { data, error } = await getSupabaseBrowser()
        .from('fabrics')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        setFabrics((data as FabricRow[]).map(rowToFabric));
      }
    } catch (err) {
      console.error('Could not load catalogue from Supabase, using built-in data.', err);
    } finally {
      setFabricsLoaded(true);
    }
  }, []);

  useEffect(() => {
    // Only fetch in the browser if the server could not provide the catalogue.
    if (!initialFabrics) refreshFabrics();
    // Clean up data left by the old browser-only version of the site.
    try {
      localStorage.removeItem('kf_fabrics');
      localStorage.removeItem('kf_enquiries');
    } catch {
      // ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFabrics]);

  const openEnquiryModal = (fabric?: FabricItem, defaultQty = '10–15 Metres') => {
    setModalData({ isOpen: true, fabric, defaultQty });
  };

  const closeEnquiryModal = useCallback(() => {
    setModalData({ isOpen: false, fabric: undefined });
  }, []);

  // Sends the enquiry to our server, which stores it in Supabase and emails an alert.
  const submitEnquiry = async (enquiryData: EnquirySubmission): Promise<SubmitResult> => {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...enquiryData,
          sourcePage:
            enquiryData.sourcePage || (typeof window !== 'undefined' ? window.location.pathname : undefined),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { ok: false, error: data.error || 'Something went wrong. Please try again or use WhatsApp.' };
      }
      return { ok: true };
    } catch {
      return {
        ok: false,
        error: 'Network error — please check your connection and try again, or contact us on WhatsApp.',
      };
    }
  };

  const generateWhatsAppUrl = ({
    productCode,
    productName,
    quantity,
    customNote,
    sourcePage,
  }: {
    productCode?: string;
    productName?: string;
    quantity?: string;
    customNote?: string;
    sourcePage?: string;
  }) => {
    const lines = [
      '👑 *KHODAL FASHION — B2B FABRIC ENQUIRY*',
      '--------------------------------------',
      `*Source:* ${sourcePage || 'Official Website'}`,
    ];

    if (productCode) lines.push(`*Design Code:* ${productCode}`);
    if (productName) lines.push(`*Fabric Name:* ${productName}`);
    if (quantity) lines.push(`*Estimated Quantity:* ${quantity}`);
    if (customNote) lines.push(`*Requirement Details:* ${customNote}`);

    lines.push('--------------------------------------');
    lines.push('Please share current wholesale availability, per-meter pricing, and sample swatch dispatch details.');

    const text = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${getWhatsAppNumber()}?text=${text}`;
  };

  return (
    <EnquiryContext.Provider
      value={{
        fabrics,
        fabricsLoaded,
        refreshFabrics,
        modalData,
        openEnquiryModal,
        closeEnquiryModal,
        submitEnquiry,
        generateWhatsAppUrl,
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error('useEnquiry must be used within an EnquiryProvider');
  }
  return context;
}
