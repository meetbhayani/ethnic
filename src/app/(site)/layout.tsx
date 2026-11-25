import { EnquiryProvider } from '@/context/EnquiryContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppSticky from '@/components/WhatsAppSticky';
import EnquiryModal from '@/components/EnquiryModal';
import { getCraftTechniques, getGalleryItems, getHiddenCategories, getPublishedFabrics, getSiteImages } from '@/lib/catalog';
import { builtInTechniques, craftAnchor } from '@/lib/craftsmanship';
import { SiteContentProvider } from '@/context/SiteContentContext';

/**
 * Layout for the public website only (header, footer, WhatsApp, enquiry modal).
 * The live catalogue is loaded here on the server (cached, purged when admins save),
 * so every page renders real products immediately — no sample-data flash.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [fabrics, siteImages, gallery, hiddenCategories, techniques] = await Promise.all([
    getPublishedFabrics(),
    getSiteImages(),
    getGalleryItems(),
    getHiddenCategories(),
    getCraftTechniques(),
  ]);
  // Footer links to the Craftsmanship sections (Admin → Craftsmanship).
  const craftLinks = (techniques ?? builtInTechniques(siteImages)).map((t) => ({ title: t.title, anchor: craftAnchor(t.title) }));
  return (
    <SiteContentProvider value={{ siteImages, gallery, hiddenCategories, craftLinks }}>
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
