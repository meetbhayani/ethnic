import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Fabric Preview",
  description: "Preview Khodal Fashion fabrics on Sherwani, Kurta and Jodhpuri silhouettes with an AI-generated concept image before sampling.",
  alternates: { canonical: '/ai-tryon' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
