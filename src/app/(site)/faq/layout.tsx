import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Buyer FAQ",
  description: "Answers for wholesale buyers: minimum order quantity, pricing, samples, lead times, dispatch and payment terms.",
  alternates: { canonical: '/faq' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
