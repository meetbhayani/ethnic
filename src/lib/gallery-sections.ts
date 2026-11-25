import { GalleryItem } from '@/types';

/**
 * The three Gallery sections, shared by the public Gallery page and Admin → Gallery.
 *
 * Stored category values stay within what the gallery_items table already accepts:
 *   styled     → Styled Looks
 *   embroidery → Fabric Close-ups   (older 'swatch' rows are shown here too)
 *   workshop   → Workshop & Craft   (older 'craft' rows are shown here too)
 */
export type GallerySectionId = 'styled' | 'embroidery' | 'workshop';

export interface GallerySection {
  id: GallerySectionId;
  label: string;
  /** Default small label shown on each photo. */
  tag: string;
  /** One line for the admin explaining the section's purpose. */
  purpose: string;
  /** What to photograph for this section. */
  shots: string[];
  tips: string[];
  defaultAspect: GalleryItem['aspect'];
  /** Suggested number of photos: [minimum, ideal]. */
  target: [number, number];
}

export const GALLERY_SECTIONS: GallerySection[] = [
  {
    id: 'styled',
    label: 'Styled Looks',
    tag: 'Styled Look',
    purpose: 'Finished garments made from your fabric. Shows buyers what the fabric becomes.',
    shots: [
      'Sherwani, achkan, Jodhpuri, Indo-western, kurta-jacket or Nehru jacket, worn by a model or on a mannequin',
      'Groom and groomsmen shots, wedding and festive settings',
      'Full-length front view, plus some back and side views to show embroidery placement',
      'Details on the worn garment: collar, cuffs, buttons, border',
    ],
    tips: [
      'Use the Tall (portrait) shape for most photos',
      'Put the fabric code in the caption, e.g. “Tailored from KF-ZAR-901 ivory zari”, so buyers can enquire about it',
      'No model shoot yet? Ask tailors or clients for photos of garments made from your fabric',
    ],
    defaultAspect: 'tall',
    target: [6, 12],
  },
  {
    id: 'embroidery',
    label: 'Fabric Close-ups',
    tag: 'Fabric Close-up',
    purpose: 'Close views of the fabric and embroidery. Your strongest proof of quality.',
    shots: [
      'Very close macro shots of the work: zari, resham thread, sequins, cutdana, pearl and stone work',
      'Flat swatch showing the full design repeat, and border designs',
      'The same design in different colourways, placed side by side',
      'Fabric rolls and stacked thans (bolts) to show stock',
      'Fabric held in the hand or draped, to show fall and sheen',
    ],
    tips: [
      'Use Square for macros, Wide for rolls and colourway rows',
      'Shoot in natural daylight near a window, without flash, so colours stay true',
      'Keep the background plain so the fabric stands out',
    ],
    defaultAspect: 'square',
    target: [8, 15],
  },
  {
    id: 'workshop',
    label: 'Workshop & Craft',
    tag: 'Workshop & Craft',
    purpose: 'Behind the scenes in Surat. Builds trust that you are a real manufacturer.',
    shots: [
      'Multi-head embroidery machines running, wide shots of the machine floor',
      'Design and punching on computer, the design file next to the finished fabric',
      'Hand finishing: adding stones and pearls, thread cutting, quality checking',
      'Packing, labelled rolls and dispatch',
      'Your team at work, and the building or signboard',
    ],
    tips: [
      'Use Wide (landscape) for the machine floor, Square for hands at work',
      'Make sure the space looks clean and well lit',
      'Avoid showing other brands’ labels or customers’ private orders',
    ],
    defaultAspect: 'wide',
    target: [5, 10],
  },
];

/** Maps any stored category (including older ones) to one of the three sections. */
export function sectionOf(category: string): GallerySectionId {
  if (category === 'styled') return 'styled';
  if (category === 'workshop' || category === 'craft') return 'workshop';
  return 'embroidery'; // 'embroidery', 'swatch' and anything unexpected
}

/** Shared guidance shown at the top of Admin → Gallery. */
export const GALLERY_DONTS = [
  'Stock or internet photos: buyers trust real photos of your own work',
  'Other brands’ garments, logos or watermarks',
  'Blurry, dark or cluttered shots. 25 good photos beat 60 average ones',
];
