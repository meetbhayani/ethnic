'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FabricItem, CustomerEnquiry } from '../types';
import { FABRICS_DATA } from '../data/fabrics';

interface EnquiryModalData {
  isOpen: boolean;
  fabric?: FabricItem;
  defaultQty?: string;
}

interface EnquiryContextType {
  fabrics: FabricItem[];
  enquiries: CustomerEnquiry[];
  modalData: EnquiryModalData;
  openEnquiryModal: (fabric?: FabricItem, defaultQty?: string) => void;
  closeEnquiryModal: () => void;
  submitEnquiry: (enquiry: EnquirySubmission) => Promise<SubmitResult>;
  updateEnquiryStatus: (id: string, status: CustomerEnquiry['status']) => void;
  addProduct: (product: FabricItem) => void;
  updateProduct: (product: FabricItem) => void;
  deleteProduct: (id: string) => void;
  generateWhatsAppUrl: (data: {
    productCode?: string;
    productName?: string;
    quantity?: string;
    customNote?: string;
    sourcePage?: string;
  }) => string;
}

export type EnquirySubmission = Omit<CustomerEnquiry, 'id' | 'timestamp' | 'status'> & {
  sourcePage?: string;
  /** Honeypot field — must stay empty for real users. */
  website?: string;
};

export type SubmitResult = { ok: true } | { ok: false; error: string };

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

const OFFICIAL_WHATSAPP_NUMBER = '919825123456'; // Official Khodal Fashion Surat business line

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [fabrics, setFabrics] = useState<FabricItem[]>(FABRICS_DATA);
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([
    {
      id: 'enq-101',
      timestamp: '2026-11-22 14:30',
      businessName: 'Royal Heritage Menswear Studio',
      contactPerson: 'Vikramaditya Rathore',
      phone: '+91 98290 11223',
      email: 'vikram@royalheritagemenswear.com',
      productCode: 'KF-ZAR-901',
      productName: 'Royal Zardozi Floral Brocade',
      quantity: '45 Metres',
      enquiryType: 'fabric-price',
      notes: 'Requiring for forthcoming Royal Jodhpur Winter Wedding Collection. Need swatch approval first.',
      status: 'new',
    },
    {
      id: 'enq-102',
      timestamp: '2026-11-21 18:15',
      businessName: 'The Sherwani Co. Mumbai',
      contactPerson: 'Sameer Merchant',
      phone: '+91 98200 44556',
      email: 'sameer@thesherwanico.in',
      productCode: 'KF-CUT-902',
      productName: 'Imperial Pearl & Cutdana Jaal',
      quantity: '120 Metres',
      enquiryType: 'wholesale-b2b',
      notes: 'Bulk booking enquiry for Spring grooms collection. Kindly confirm lead time.',
      status: 'quoted',
    },
    {
      id: 'enq-103',
      timestamp: '2026-11-20 11:05',
      businessName: 'Ananya Couture Atelier',
      contactPerson: 'Ananya Singhania',
      phone: '+91 99300 77889',
      email: 'design@ananyacouture.com',
      productCode: 'Custom Embroidery',
      productName: 'Custom Zari Bullion on Organza',
      quantity: '80 Metres',
      enquiryType: 'custom-jobwork',
      notes: 'We have our proprietary Mughal architectural motifs. Need sampling in Surat.',
      status: 'sample-sent',
    },
  ]);

  const [modalData, setModalData] = useState<EnquiryModalData>({
    isOpen: false,
    fabric: undefined,
    defaultQty: '25 Metres',
  });

  // Load local storage if available on client
  useEffect(() => {
    try {
      const storedFabrics = localStorage.getItem('kf_fabrics');
      if (storedFabrics) {
        setFabrics(JSON.parse(storedFabrics));
      }
      const storedEnquiries = localStorage.getItem('kf_enquiries');
      if (storedEnquiries) {
        setEnquiries(JSON.parse(storedEnquiries));
      }
    } catch {
      // ignore
    }
  }, []);

  const openEnquiryModal = (fabric?: FabricItem, defaultQty = '25 Metres') => {
    setModalData({ isOpen: true, fabric, defaultQty });
  };

  const closeEnquiryModal = () => {
    setModalData({ isOpen: false, fabric: undefined });
  };

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

  const updateEnquiryStatus = (id: string, status: CustomerEnquiry['status']) => {
    const updated = enquiries.map((item) => (item.id === id ? { ...item, status } : item));
    setEnquiries(updated);
    try {
      localStorage.setItem('kf_enquiries', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const addProduct = (product: FabricItem) => {
    const updated = [product, ...fabrics];
    setFabrics(updated);
    try {
      localStorage.setItem('kf_fabrics', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const updateProduct = (product: FabricItem) => {
    const updated = fabrics.map((p) => (p.id === product.id ? product : p));
    setFabrics(updated);
    try {
      localStorage.setItem('kf_fabrics', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const deleteProduct = (id: string) => {
    const updated = fabrics.filter((p) => p.id !== id);
    setFabrics(updated);
    try {
      localStorage.setItem('kf_fabrics', JSON.stringify(updated));
    } catch {
      // ignore
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
    return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${text}`;
  };

  return (
    <EnquiryContext.Provider
      value={{
        fabrics,
        enquiries,
        modalData,
        openEnquiryModal,
        closeEnquiryModal,
        submitEnquiry,
        updateEnquiryStatus,
        addProduct,
        updateProduct,
        deleteProduct,
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
