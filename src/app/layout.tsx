import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Khodal Fashion | The Art of Royal Textiles | Men’s Ethnic Embroidered Fabrics Surat',
  description: 'Premier Indian textile house in Surat, Gujarat specializing in royal men’s ethnic embroidered fabrics for Sherwanis, Kurtas, Jodhpuri suits, and Indo-Western wear. Custom embroidery and wholesale job-work solutions.',
  keywords: [
    'mens ethnic fabric',
    'mens embroidered fabric',
    'sherwani fabric supplier surat',
    'jodhpuri fabric surat',
    'bead embroidery fabric',
    'zari embroidery fabrics',
    'mens kurta fabric wholesale',
    'embroidery job work surat',
    'designer ethnic fabric wholesale',
    'khodal fashion surat',
  ],
  authors: [{ name: 'Khodal Fashion Surat' }],
  openGraph: {
    title: 'Khodal Fashion | The Art of Royal Textiles',
    description: 'B2B luxury men’s ethnic embroidered fabrics & custom embroidery solutions from Surat, Gujarat.',
    url: 'https://khodalfashion.com',
    siteName: 'Khodal Fashion',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      {/* Public site chrome lives in (site)/layout.tsx; the admin app has its own layout. */}
      <body className="min-h-screen font-sans bg-[#FAF8F3] text-[#30241F]">{children}</body>
    </html>
  );
}
