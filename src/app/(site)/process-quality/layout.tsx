import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Process & Quality",
  description: "How we handle enquiries, sampling, production and quality inspection for wholesale fabric orders.",
  alternates: { canonical: '/process-quality' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
