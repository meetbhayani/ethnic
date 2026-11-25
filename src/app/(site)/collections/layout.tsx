import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Fabric Collections",
  description: "Browse men’s ethnic embroidered fabrics by category, embroidery type and colour — Sherwani, Kurta, Jodhpuri and Indo-Western. Wholesale from Surat.",
  alternates: { canonical: '/collections' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
