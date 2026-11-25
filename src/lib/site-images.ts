/**
 * Fixed image spots on the website that admins can replace (Admin → Site Images).
 * A spot shows `defaultSrc` until an admin uploads a replacement.
 * Fabric photos come from Admin → Products; Craftsmanship photos from Admin → Craftsmanship.
 */
export interface SiteImageSlot {
  key: string;
  label: string;
  group: string;
  /** Where it appears, shown to admins. */
  where: string;
  defaultSrc: string;
  /** Suggested shape, e.g. "4:3 landscape". */
  shape: string;
}

const PRESET_DEFAULTS = [
  { id: 'preset-groom', name: 'Royal Heritage Groom', src: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80' },
  { id: 'preset-evening', name: 'Regal Jodhpuri Model', src: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80' },
  { id: 'preset-modern', name: 'Modern Indo-Western Model', src: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=600&q=80' },
  { id: 'preset-festive', name: 'Festive Kurta Model', src: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80' },
];

export const SITE_IMAGE_SLOTS: SiteImageSlot[] = [
  {
    key: 'about.hero',
    label: 'Our story photo',
    group: 'About page',
    where: 'About page — beside “Our Story”',
    defaultSrc: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85',
    shape: '4:3 landscape',
  },
  ...PRESET_DEFAULTS.map((p) => ({
    key: `tryon.${p.id}`,
    label: p.name,
    group: 'AI Try-On page',
    where: `AI Try-On — “${p.name}” model preset`,
    defaultSrc: p.src,
    shape: '3:4 portrait',
  })),
];

export const slotByKey = (key: string) => SITE_IMAGE_SLOTS.find((s) => s.key === key);
