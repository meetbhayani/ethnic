import { EnquiryProvider } from '@/context/EnquiryContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppSticky from '@/components/WhatsAppSticky';
import EnquiryModal from '@/components/EnquiryModal';

/** Layout for the public website only (header, footer, WhatsApp, enquiry modal). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <EnquiryProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
      <WhatsAppSticky />
      <EnquiryModal />
    </EnquiryProvider>
  );
}
