import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Wholesale & B2B",
  description: "Wholesale men’s ethnic embroidered fabrics for Sherwani manufacturers, boutiques and retailers. Volume pricing and swatch kits.",
  alternates: { canonical: '/wholesale-b2b' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
