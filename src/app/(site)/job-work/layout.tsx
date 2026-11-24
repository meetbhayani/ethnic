import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Custom Embroidery Job-Work",
  description: "Custom computerised embroidery job-work in Surat on your fabric or ours — digitising, sampling and bulk production for menswear labels.",
  alternates: { canonical: '/job-work' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
