import Hero from '@/components/home/Hero';
import BrandIntro from '@/components/home/BrandIntro';
import Collections from '@/components/home/Collections';
import FeaturedDesigns from '@/components/home/FeaturedDesigns';
import Embellishment from '@/components/home/Embellishment';
import Applications from '@/components/home/Applications';
import StockOrMade from '@/components/home/StockOrMade';
import TryOnTeaser from '@/components/home/TryOnTeaser';
import Partnerships from '@/components/home/Partnerships';
import AboutBrand from '@/components/home/AboutBrand';
import Faqs from '@/components/home/Faqs';
import FinalWhatsApp from '@/components/home/FinalWhatsApp';
import { ScrollThread } from '@/components/home/motion';

export default function HomePage() {
  return (
    <div className="bg-[#FAF8F3] text-[#30241F] overflow-x-clip">
      <ScrollThread />
      <Hero />
      <BrandIntro />
      <Collections />
      <FeaturedDesigns />
      <Embellishment />
      <Applications />
      <StockOrMade />
      <TryOnTeaser />
      <Partnerships />
      <AboutBrand />
      <Faqs />
      <FinalWhatsApp />
    </div>
  );
}
