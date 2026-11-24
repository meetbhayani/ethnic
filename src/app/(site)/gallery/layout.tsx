import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Gallery",
  description: "Close-up embroidery, workshop and styled looks from Khodal Fashion’s men’s ethnic fabric range.",
  alternates: { canonical: '/gallery' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
