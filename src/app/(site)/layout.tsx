import { EnquiryProvider } from '@/context/EnquiryContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppSticky from '@/components/WhatsAppSticky';
import EnquiryModal from '@/components/EnquiryModal';
import { getGalleryItems, getPublishedFabrics, getSiteImages } from '@/lib/catalog';
import { SiteContentProvider } from '@/context/SiteContentContext';

/**
 * Layout for the public website only (header, footer, WhatsApp, enquiry modal).
 * The live catalogue is loaded here on the server (cached, purged when admins save),
 * so every page renders real products immediately — no sample-data flash.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [fabrics, siteImages, gallery] = await Promise.all([getPublishedFabrics(), getSiteImages(), getGalleryItems()]);
  return (
    <SiteContentProvider value={{ siteImages, gallery }}>
    <EnquiryProvider initialFabrics={fabrics}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
      <WhatsAppSticky />
      <EnquiryModal />
    </EnquiryProvider>
    </SiteContentProvider>
  );
}
