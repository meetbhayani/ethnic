import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Embroidery Craftsmanship",
  description: "Zari & dabka, cutdana & beadwork, resham threadwork and sequin embroidery on men’s ethnic fabrics — how we make them in Surat.",
  alternates: { canonical: '/craftsmanship' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
