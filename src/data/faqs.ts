export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const FAQS_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Products & Fabric Offerings',
    question: 'What types of men’s ethnic fabrics do you specialize in?',
    answer: 'Khodal Fashion specializes exclusively in unstitched and semi-embellished premium fabrics for men’s ethnic wear. Our catalogue includes heavy embroidered Sherwani fabrics, Kurta lengths, Jodhpuri and Bandhgala materials, modern Indo-Western fabrics, and custom designer textiles featuring zari, cutdana, beadwork, and resham.',
  },
  {
    id: 'faq-2',
    category: 'Products & Fabric Offerings',
    question: 'Do you sell stitched Sherwanis, Kurtas, or finished garments?',
    answer: 'No. We are strictly a textile and embroidery house based in Surat, Gujarat. We supply fabrics by the metre. Finished garments shown in our lookbooks and editorial imagery are purely styling representations to demonstrate how our fabrics drape when crafted into tailored menswear.',
  },
  {
    id: 'faq-3',
    category: 'Orders & Pricing',
    question: 'Why are prices not listed directly on the website?',
    answer: 'As a B2B textile house serving retailers, garment manufacturers, and designers across India and abroad, our pricing is determined by order volume (sampling rolls vs. bulk production), customized base fabrics, and market raw material rates (silk and metal yarn). Clicking "Enquire for Price" connects you instantly to our sales desk with the specific design code.',
  },
  {
    id: 'faq-4',
    category: 'Orders & Pricing',
    question: 'What is your Minimum Order Quantity (MOQ)?',
    answer: 'Our MOQ is just 10 to 15 metres per design/colourway — for running ready-stock catalogue designs as well as made-to-order colourways and exclusive runs.',
  },
  {
    id: 'faq-5',
    category: 'Samples & Swatches',
    question: 'Can I order fabric swatches or sample cuts before placing a bulk order?',
    answer: 'Yes. We provide sample swatch books and 1-to-2-metre strike-off cuts to verified boutique owners, retailers, and fashion labels. You can request a swatch kit through our Wholesale & B2B page or directly via WhatsApp by specifying the design codes of interest.',
  },
  {
    id: 'faq-7',
    category: 'AI Virtual Try-On',
    question: 'How does the AI Virtual Try-On preview work?',
    answer: 'Our AI Try-On tool allows designers and buyers to visualize how any Khodal Fashion fabric design would appear draped onto different menswear silhouettes (Sherwani, Kurta, Jodhpuri, or Indo-Western). Please note that AI previews are illustrative simulations to assist conceptual visualization and do not guarantee exact color calibration, seam fit, or physical weight.',
  },
  {
    id: 'faq-8',
    category: 'Dispatch & Logistics',
    question: 'How are orders dispatched and what are the lead times?',
    answer: 'Ready-stock fabrics are typically inspected, double-packaged in moisture-barrier rolls, and dispatched from Surat within 24 to 48 business hours via insured cargo or express courier. Custom production orders have lead times varying between 10 to 25 business days depending on meterage and embroidery stitch count.',
  },
  {
    id: 'faq-9',
    category: 'Trust & Visiting',
    question: 'Can we visit your showroom and facility in Surat?',
    answer: 'Yes, we warmly welcome commercial buyers, boutique owners, and designers to our Surat facility by prior appointment. You can inspect hundreds of running swatches, observe our machine embroidery bays, and discuss made-to-order requirements directly with our technical team.',
  },
];
