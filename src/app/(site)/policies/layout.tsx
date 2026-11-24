import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Policies",
  description: "Privacy, terms, AI upload policy, enquiry & order, shipping and returns policies for Khodal Fashion buyers.",
  alternates: { canonical: '/policies' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
