export interface FabricItem {
  id: string;
  name: string;
  code: string;
  category: 'sherwani' | 'kurta' | 'jodhpuri' | 'indo-western' | 'brocade' | 'designer';
  categoryLabel: string;
  embroideryType: 'bead' | 'zari' | 'thread' | 'sequin' | 'cutdana' | 'multi';
  embroideryTypeLabel: string;
  baseFabric: string;
  color: string;
  colorFamily: 'ivory' | 'gold' | 'burgundy' | 'emerald' | 'navy' | 'black' | 'sandstone';
  width: string;
  suitableFor: string[];
  moq: string;
  readyStock: boolean;
  featured: boolean;
  description: string;
  artisanStory: string;
  mainImage: string;
  closeUpImage: string;
  macroImage: string;
  backsideImage: string;
  styledModelImage: string;
  images?: string[];
  availableColors: { name: string; hex: string }[];
}

export interface CustomerEnquiry {
  id: string;
  timestamp: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  productCode?: string;
  productName?: string;
  quantity?: string;
  enquiryType: 'fabric-price' | 'custom-jobwork' | 'wholesale-b2b' | 'swatch-kit';
  notes?: string;
  status: 'new' | 'contacted' | 'sample-sent' | 'quoted' | 'closed';
}

export interface GalleryItem {
  id: string;
  title: string;
  tag: string;
  category: 'embroidery' | 'craft' | 'styled' | 'swatch' | 'workshop';
  image: string;
  caption: string;
  aspect: 'tall' | 'wide' | 'square';
}
