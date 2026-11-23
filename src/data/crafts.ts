export interface CraftDetail {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  machineTech: string;
  handTouch: string;
  image: string;
  features: string[];
}

export const CRAFTS_DATA: CraftDetail[] = [
  {
    id: 'zari-dabka',
    title: 'Antique Zari & Dabka Embroidery',
    subtitle: 'The Sovereign Lustre of Metallic Bullion',
    description: 'Rooted in the royal courts of Gujarat and Rajasthan, our metallic zari embroidery uses oxidization-resistant metallic filament yarn intertwined with soft silk cores. Each motif is precision-spaced to maintain flexible fabric drape while creating unmatched tactile dimensionality.',
    machineTech: 'High-speed multi-head computerized Schiffli & computerized multi-needle machines tuned to low-tension feed to preserve wire curvature.',
    handTouch: 'Hand-inspected trimming, border clearing, and bullion knot anchoring done by skilled master artisans in our Surat workshop.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
    features: [
      'Resistant to tarnishing and humidity',
      'Flexible drape suitable for structured tailoring',
      'Dual matte and antique gloss finishes',
      'Engineered repeat widths: 44" to 54"',
    ],
  },
  {
    id: 'cutdana-bead',
    title: 'Cutdana & Micro-Bead Embellishment',
    subtitle: 'Prismatic Geometry in Japanese Glass',
    description: 'Our beadwork incorporates precision-beveled glass beads and cutdana (hexagonal cylindrical bugle beads). Each row catches ambient light from multiple facets, delivering the coveted royal jewel-encrusted radiance demanded by elite menswear designers.',
    machineTech: 'Specialized 4-in-1 bead and spangle dispensing heads with automated feed tracks ensuring uniform density without missed stitches.',
    handTouch: 'Individual end-line securing and reverse-needle lockstitch audits to prevent unravelling during cutting and tailoring.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
    features: [
      'Uniform size grading with 0.1mm tolerance',
      'Reinforced core thread for heavy garment seams',
      'Colorfast bead coatings resistant to dry cleaning',
      'Custom placement layouts available for Sherwani panels',
    ],
  },
  {
    id: 'resham-thread',
    title: 'Resham & Filigree Silk Threadwork',
    subtitle: 'Subtle Painterly Shading in Natural Filament',
    description: 'From intricate Kashmiri aari patterns to contemporary architectural lines, our resham embroidery blends up to 8 thread gradations in a single floral spray. The resulting surface mimics hand-painted royal miniatures with luxurious tactile richness.',
    machineTech: 'Fine-gage needle assemblies capable of 1,200 stitches per minute with automatic thread-tension compensation across varied fabric densities.',
    handTouch: 'Thread tension manual calibration before every production roll and reverse lint removal.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85',
    features: [
      'Zero bleeding with 100% reactive vat dyed yarns',
      'Supple hand-feel that breathes easily in Kurta wear',
      'Subtle tone-on-tone and multi-shade gradient capabilities',
      'Applicable on Silk, Chanderi, Georgette, and Velvet',
    ],
  },
  {
    id: 'sequin-embroidery',
    title: 'Matte & Smoked Sequin Geometry',
    subtitle: 'Understated Modernity for the Contemporary Groom',
    description: 'Moving far beyond theatrical glitz, Khodal Fashion pioneers the use of matte-finished, sand-blasted, and micro-sequins in 2mm and 3mm sizes. These deliver a dignified, masculine luminescence favored by India’s top wedding couturiers.',
    machineTech: 'Ultra-fast dual-size reversible sequin attachment units synchronized with high-precision pantograph tables.',
    handTouch: 'Surface run-through with soft felt rolls to check for sharp burrs and ensure complete smoothness against lining fabrics.',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=85',
    features: [
      'Discreet matte, smoked gunmetal, and dull champagne hues',
      'Flat-lay density that tailors smoothly over lapels',
      'Dry-cleanable temperature resistant spangle material',
      'Seamless multi-layer integration with zari and resham',
    ],
  },
];
