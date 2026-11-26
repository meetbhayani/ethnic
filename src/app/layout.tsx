import type { Metadata } from 'next';
import { Cinzel, Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';

// Self-hosted by Next.js at build time: no render-blocking request to Google Fonts.
const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-cinzel', display: 'swap' });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-dm-sans', display: 'swap' });

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://khodalfashion.com').replace(/\/+$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Khodal Fashion | Men’s Ethnic Embroidered Fabrics, Surat',
    template: '%s | Khodal Fashion',
  },
  description:
    'Surat textile house supplying men’s ethnic embroidered fabrics for Sherwanis, Kurtas, Jodhpuri suits and Indo-Western wear. Wholesale supply, swatch kits and volume pricing.',
  keywords: [
    'mens ethnic fabric',
    'mens embroidered fabric',
    'sherwani fabric supplier surat',
    'jodhpuri fabric surat',
    'zari embroidery fabric',
    'mens kurta fabric wholesale',
    'embroidered fabric wholesaler surat',
    'khodal fashion surat',
  ],
  authors: [{ name: 'Khodal Fashion' }],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Khodal Fashion | Men’s Ethnic Embroidered Fabrics, Surat',
    description: 'Wholesale men’s ethnic embroidered fabrics from Surat, Gujarat.',
    url: SITE_URL,
    siteName: 'Khodal Fashion',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${dmSans.variable}`}>
      {/* Public site chrome lives in (site)/layout.tsx; the admin app has its own layout. */}
      <body className="min-h-screen font-sans bg-[#FAF8F3] text-[#30241F]">{children}</body>
    </html>
  );
}
