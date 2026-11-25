import { CRAFTS_DATA } from '@/data/crafts';

/**
 * Craftsmanship page content, managed in Admin → Craftsmanship.
 *   craft_techniques : one row per embroidery technique section
 *   site_content     : key 'craftsmanship' holds the page text (header, quality steps, buttons)
 * Until the admin publishes techniques / saves page text, the built-in content below is shown.
 */

export interface CraftTechnique {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  /** Garments or uses, e.g. "Sherwani, Jodhpuri". */
  best_for: string;
  machine_work: string;
  hand_work: string;
  /** Key points, shown as a checklist. */
  features: string[];
  image: string;
}

export interface CraftStep {
  title: string;
  /** Short italic line under the title, e.g. "Where ideas take form". */
  subtitle?: string;
  /** Description; a blank line starts a new paragraph. */
  text: string;
}

/** Most process steps an admin can add. */
export const MAX_CRAFT_STEPS = 10;

export interface CraftPageContent {
  eyebrow: string;
  title: string;
  titleAccent: string;
  intro: string;
  qualityEyebrow: string;
  qualityTitle: string;
  qualityIntro: string;
  steps: CraftStep[];
  ctaPrimary: string;
  ctaSecondary: string;
}

export const CRAFT_CONTENT_KEY = 'craftsmanship';

export const DEFAULT_CRAFT_PAGE: CraftPageContent = {
  eyebrow: 'The Surat Atelier Standards',
  title: 'Craftsmanship &',
  titleAccent: 'Royal Embroidery',
  intro:
    'At Khodal Fashion, embroidery is not a superficial surface embellishment—it is an architectural discipline. We engineer unstitched men’s ethnic textiles that retain tension, luster, and razor-sharp drape through heavy bespoke tailoring.',
  qualityEyebrow: 'From Fabric to Dispatch',
  qualityTitle: 'How Our Fabrics Are Made',
  qualityIntro: 'Every fabric passes through six stages in our Surat workshop, from choosing the base fabric to final inspection and dispatch.',
  steps: [
    {
      title: 'Curated Fabric Selection',
      subtitle: 'The foundation of every creation',
      text: 'We begin by sourcing quality base fabrics from the textile markets of Surat, selected according to the design, texture, and intended garment. Whether for a Sherwani, Jodhpuri, Kurta, or Indo-Western ensemble, the fabric is chosen to complement the desired look and embroidery style.',
    },
    {
      title: 'Design & Sketch Development',
      subtitle: 'Where ideas take form',
      text: 'Our design team translates creative concepts into detailed embroidery sketches. Each motif, pattern, and placement is thoughtfully developed to complement the fabric and the silhouette of the garment.\n\nThe designs are reviewed and approved before moving into production.',
    },
    {
      title: 'Design Digitisation & Punching',
      subtitle: 'Preparing the design for precision',
      text: 'Approved sketches are converted into digital embroidery patterns through the punching process. Our designers define stitch sequences, pattern placement, and machine instructions to prepare the design for accurate execution.',
    },
    {
      title: 'Material Coordination',
      subtitle: 'A harmony of texture and detail',
      text: 'Threads, zari, sequins, beads, cording, and other embellishment materials are carefully matched with the approved design and base fabric.\n\nWe assess their colour, texture, compatibility, and visual balance to ensure that the embroidery complements the fabric while maintaining its intended character.',
    },
    {
      title: 'Precision Machine Embroidery',
      subtitle: 'Bringing the design to life',
      text: 'The approved digital design and selected fabric are set on our multi-head computerized embroidery machines.\n\nThrough precise machine execution, intricate motifs and embellishment patterns are reproduced across the fabric, creating the richness, dimension, and decorative detail suited to royal men\u2019s ethnic wear.',
    },
    {
      title: 'Finishing, Quality Inspection & Dispatch',
      subtitle: 'The final standard of excellence',
      text: 'Once embroidery is complete, each fabric undergoes careful human inspection. Excess threads are trimmed, embroidery details are checked, and the finished material is reviewed for workmanship and overall appearance.\n\nApproved fabrics are prepared into rolls, packed according to the order, and dispatched to our customers.',
    },
  ],
  ctaPrimary: 'Discuss Custom Embroidery Requirements',
  ctaSecondary: 'Browse Catalogue Fabrics',
};

/** Saved page text merged over the defaults, so a missing field never blanks the page. */
export function mergeCraftPage(saved: Partial<CraftPageContent> | null | undefined): CraftPageContent {
  const out = { ...DEFAULT_CRAFT_PAGE };
  if (!saved) return out;
  for (const k of Object.keys(DEFAULT_CRAFT_PAGE) as (keyof CraftPageContent)[]) {
    const v = saved[k];
    if (k === 'steps') {
      if (Array.isArray(v)) out.steps = (v as CraftStep[]).filter((s) => s && (s.title || s.text));
    } else if (typeof v === 'string') {
      (out[k] as string) = v;
    }
  }
  return out;
}

/**
 * The built-in techniques, using any photo already replaced in the old
 * Site Images "craft.<id>" spots so those uploads carry over.
 */
export function builtInTechniques(siteImages: Record<string, string> = {}): CraftTechnique[] {
  return CRAFTS_DATA.map((c) => ({
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    description: c.description,
    best_for: c.bestFor,
    machine_work: c.machineTech,
    hand_work: c.handTouch,
    features: c.features,
    image: siteImages[`craft.${c.id}`] || c.image,
  }));
}

/** Guidance shown to admins while writing technique sections. */
export const CRAFT_WRITING_TIPS = [
  'Only list techniques you actually make, and use your own close-up photo for each.',
  'Write facts buyers can check: machines, base fabrics, garments it suits. Avoid claims you cannot prove.',
  'Keep descriptions to 2–3 short sentences, and key points to 3–5.',
];

/** Anchor id for a technique section, e.g. "Antique Zari & Dabka" → "antique-zari-dabka". */
export function craftAnchor(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'craft';
}

/** Footer links to the technique sections. */
export interface CraftLink {
  title: string;
  anchor: string;
}
