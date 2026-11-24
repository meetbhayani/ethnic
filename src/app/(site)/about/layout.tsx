import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us",
  description: "Khodal Fashion is a Surat textile house supplying unstitched embroidered fabrics for men’s ethnic wear to tailors, labels and retailers.",
  alternates: { canonical: '/about' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
