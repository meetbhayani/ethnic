import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Khodal Fashion, Surat, for wholesale fabric pricing, swatches and ready-stock availability. Enquire online or on WhatsApp.",
  alternates: { canonical: '/contact' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
