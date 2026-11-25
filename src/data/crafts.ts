/**
 * Built-in Craftsmanship technique sections. Shown until techniques are published in
 * Admin → Craftsmanship, and copied there by "Import current sections".
 * Photos are local fabric close-ups (public/fabrics); replace them with your own in admin.
 */
export interface CraftDetail {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bestFor: string;
  machineTech: string;
  handTouch: string;
  image: string;
  features: string[];
}

export const CRAFTS_DATA: CraftDetail[] = [
  {
    id: 'zari-work',
    title: 'Zari Work',
    subtitle: 'The classic gold and silver of wedding wear',
    description:
      'Metallic zari thread embroidered on our multi-head computerized machines to create rich motifs, borders and all-over jaals. Zari gives sherwanis and jodhpuris their traditional festive shine.',
    bestFor: 'Sherwani, Jodhpuri, wedding wear',
    machineTech: 'Designs are punched and embroidered on multi-head computerized machines for an even, repeatable finish.',
    handTouch: 'Excess threads trimmed and every motif checked by hand.',
    image: '/fabrics/purple-zari-vine.jpg',
    features: ['Gold, silver, antique and copper tones', 'Borders, buttis and full jaals', 'Combined with sequins or beads on request'],
  },
  {
    id: 'sequin-work',
    title: 'Sequin Work',
    subtitle: 'Subtle shine for modern menswear',
    description:
      'Sequins embroidered in tone-on-tone or contrast colours for a refined sparkle, suited to receptions and Indo-Western looks.',
    bestFor: 'Indo-Western, Jodhpuri, reception wear',
    machineTech: 'Sequins are placed by our multi-head computerized machines following the punched design.',
    handTouch: 'Finished fabric checked for loose or missing sequins before dispatch.',
    image: '/fabrics/navy-star-sequin.jpg',
    features: ['Tone-on-tone and contrast options', 'Works alone or with zari and thread'],
  },
  {
    id: 'bead-cutdana-work',
    title: 'Bead & Cutdana Work',
    subtitle: 'Texture and depth in every motif',
    description: 'Beads and cutdana add raised texture and a jewel-like finish to motifs and borders.',
    bestFor: 'Sherwani, Kurta, festive wear',
    machineTech: 'Embroidered on our multi-head computerized machines as part of the approved design.',
    handTouch: 'Finished pieces checked for loose beads before dispatch.',
    image: '/fabrics/gold-pearl-geometric.jpg',
    features: ['Raised, textured finish', 'Pairs well with zari and resham thread'],
  },
  {
    id: 'resham-thread-work',
    title: 'Resham Thread Work',
    subtitle: 'Colourful, soft and lightweight',
    description:
      'Fine silk-look resham thread for colourful florals and paisleys. Lighter than zari, so it suits comfortable festive kurtas.',
    bestFor: 'Kurta, Nehru jacket, haldi and mehendi wear',
    machineTech: 'Multi-colour designs embroidered on our multi-head computerized machines.',
    handTouch: 'Excess threads trimmed and colours checked against the approved design.',
    image: '/fabrics/lotus-resham-border.jpg',
    features: ['Multi-colour and tone-on-tone designs', 'Light, soft finish'],
  },
];
