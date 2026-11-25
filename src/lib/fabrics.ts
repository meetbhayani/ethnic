import { FabricItem, CustomerEnquiry } from '@/types';

// ---------------------------------------------------------------------------
// Labels (single source of truth for admin form + public pages)
// ---------------------------------------------------------------------------
export const CATEGORY_LABELS: Record<FabricItem['category'], string> = {
  sherwani: 'Sherwani Fabrics',
  kurta: 'Kurta Fabrics',
  jodhpuri: 'Jodhpuri Fabrics',
  'indo-western': 'Indo-Western Fabrics',
  designer: 'Designer Ethnic Fabrics',
};

/** Categories removed from the website. Old products may still carry them until re-categorised in admin. */
export const RETIRED_CATEGORY_LABELS = {
  brocade: 'Brocade',
} as const;
export type RetiredCategory = keyof typeof RETIRED_CATEGORY_LABELS;
export function isRetiredCategory(c: string): c is RetiredCategory {
  return c in RETIRED_CATEGORY_LABELS;
}

/**
 * Categories hidden from the website when the category_settings table has not been created yet.
 * Once it exists, Admin → Products → "Categories on website" controls this instead.
 */
export const DEFAULT_HIDDEN_CATEGORIES: FabricItem['category'][] = ['designer'];

// ---------------------------------------------------------------------------
// Product photo slots: admin photo 1 → Fabric Face, photo 2 → Close-up, …
// Shared by the admin product form (slot labels) and the product page (thumbnails).
// ---------------------------------------------------------------------------
export const PHOTO_SLOTS = [
  { label: 'Fabric Face', badge: 'Primary Fabric Texture', hint: 'Front of the fabric, laid flat' },
  { label: 'Close-up', badge: 'Detailed Embroidery Stitches', hint: 'Embroidery seen up close' },
  { label: '10x Macro', badge: '10x Macro Stitch & Bead Density', hint: 'Very close shot of stitches and beads' },
  { label: 'Backside', badge: 'Reverse Backside Seam & Thread-Trimming', hint: 'Reverse side of the fabric' },
  { label: 'Styled Look', badge: 'Styling Inspiration (Unstitched Fabric)', hint: 'Garment or draped look' },
] as const;

/** Label for the admin photo at `index` (extra photos beyond the five slots are "Extra view"). */
export function photoSlotLabel(index: number): string {
  return PHOTO_SLOTS[index]?.label ?? 'Extra view';
}

export interface ProductPhoto {
  src: string;
  label: string;
  badge: string;
}

/**
 * The product's real photos, in admin order, each with its slot label.
 * Only photos that exist are returned, so the website never repeats the cover to fill empty slots.
 */
export function productPhotos(f: FabricItem): ProductPhoto[] {
  if (f.images?.length) {
    return f.images.filter(Boolean).map((src, i) => ({
      src,
      label: photoSlotLabel(i),
      badge: PHOTO_SLOTS[i]?.badge ?? 'Additional View',
    }));
  }
  // Older products without an image list: use the named fields, skipping repeats of an earlier photo.
  const named = [f.mainImage, f.closeUpImage, f.macroImage, f.backsideImage, f.styledModelImage];
  const seen = new Set<string>();
  const out: ProductPhoto[] = [];
  named.forEach((src, i) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    out.push({ src, label: PHOTO_SLOTS[i].label, badge: PHOTO_SLOTS[i].badge });
  });
  return out;
}

export const EMBROIDERY_LABELS: Record<FabricItem['embroideryType'], string> = {
  zari: 'Antique Zari & Dabka',
  bead: 'Cutdana & Beadwork',
  cutdana: 'Japanese Cutdana',
  thread: 'Resham Silk Thread',
  sequin: 'Micro-Sequin',
  multi: 'Multi-Craft Fusion',
};

export const COLOR_FAMILY_LABELS: Record<FabricItem['colorFamily'], string> = {
  ivory: 'Ivory & Off-White',
  sandstone: 'Sandstone & Champagne',
  gold: 'Antique Gold',
  burgundy: 'Burgundy',
  emerald: 'Emerald',
  navy: 'Navy',
  black: 'Black',
};

// ---------------------------------------------------------------------------
// Database row shapes (snake_case, as stored in Supabase)
// ---------------------------------------------------------------------------
export interface FabricRow {
  id: string;
  code: string;
  name: string;
  /** May hold a retired value (see RETIRED_CATEGORY_LABELS); rowToFabric maps it to a current category. */
  category: FabricItem['category'] | RetiredCategory;
  category_label: string;
  embroidery_type: FabricItem['embroideryType'];
  embroidery_type_label: string;
  base_fabric: string;
  color: string;
  color_family: FabricItem['colorFamily'];
  width: string;
  suitable_for: string[];
  moq: string;
  ready_stock: boolean;
  featured: boolean;
  description: string;
  artisan_story: string;
  main_image: string;
  close_up_image: string;
  macro_image: string;
  backside_image: string;
  styled_model_image: string;
  images: string[];
  /** Added by migrations/20261126_exclusive.sql — may be absent on older databases. */
  is_exclusive?: boolean;
  /** Added by migrations/20261125_swatch_tile.sql — may be absent on older databases. */
  swatch_tile?: string;
  available_colors: { name: string; hex: string }[];
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export type AdminFabric = FabricItem & { isPublished: boolean; sortOrder: number };

export function rowToFabric(r: FabricRow): AdminFabric {
  const images = (r.images || []).filter(Boolean);
  const main = r.main_image || images[0] || '';
  // Retired categories (no longer on the website) are shown as Sherwani Fabrics until the admin picks a new one.
  const category: FabricItem['category'] = isRetiredCategory(r.category) ? 'sherwani' : r.category;
  return {
    id: r.id,
    code: r.code,
    name: r.name,
    category,
    categoryLabel: (category === r.category && r.category_label) || CATEGORY_LABELS[category],
    embroideryType: r.embroidery_type,
    embroideryTypeLabel: r.embroidery_type_label || EMBROIDERY_LABELS[r.embroidery_type],
    baseFabric: r.base_fabric,
    color: r.color,
    colorFamily: r.color_family,
    width: r.width,
    suitableFor: r.suitable_for || [],
    moq: r.moq,
    readyStock: r.ready_stock,
    featured: r.featured,
    exclusive: !!r.is_exclusive,
    description: r.description,
    artisanStory: r.artisan_story,
    mainImage: main,
    closeUpImage: r.close_up_image || images[1] || main,
    macroImage: r.macro_image || images[2] || main,
    backsideImage: r.backside_image || images[3] || main,
    styledModelImage: r.styled_model_image || images[4] || main,
    images: images.length ? images : undefined,
    swatchTile: r.swatch_tile || '',
    availableColors: r.available_colors || [],
    isPublished: r.is_published,
    sortOrder: r.sort_order,
  };
}

/** Builds a DB row from admin form values. Image slots are filled from `images` in order. */
export function fabricToRow(f: AdminFabric): FabricRow {
  const images = (f.images && f.images.length ? f.images : [f.mainImage]).filter(Boolean);
  return {
    id: f.id,
    code: f.code,
    name: f.name,
    category: f.category,
    category_label: CATEGORY_LABELS[f.category],
    embroidery_type: f.embroideryType,
    embroidery_type_label: EMBROIDERY_LABELS[f.embroideryType],
    base_fabric: f.baseFabric,
    color: f.color,
    color_family: f.colorFamily,
    width: f.width,
    suitable_for: f.suitableFor,
    moq: f.moq,
    ready_stock: f.readyStock,
    featured: f.featured,
    is_exclusive: !!f.exclusive,
    description: f.description,
    artisan_story: f.artisanStory,
    main_image: images[0] || '',
    close_up_image: images[1] || images[0] || '',
    macro_image: images[2] || images[0] || '',
    backside_image: images[3] || images[0] || '',
    styled_model_image: images[4] || images[0] || '',
    images,
    swatch_tile: f.swatchTile || '',
    available_colors: f.availableColors,
    is_published: f.isPublished,
    sort_order: f.sortOrder,
  };
}

/** URL-safe id derived from the design code, e.g. "KF-ZAR-909" -> "kf-zar-909". */
export function idFromCode(code: string): string {
  return code.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// ---------------------------------------------------------------------------
// Enquiries
// ---------------------------------------------------------------------------
export interface EnquiryRow {
  id: string;
  created_at: string;
  business_name: string;
  contact_person: string;
  phone: string;
  email: string | null;
  product_code: string | null;
  product_name: string | null;
  quantity: string | null;
  enquiry_type: CustomerEnquiry['enquiryType'];
  notes: string | null;
  source_page: string | null;
  status: CustomerEnquiry['status'];
}

export type AdminEnquiry = CustomerEnquiry & { sourcePage?: string };

export function rowToEnquiry(r: EnquiryRow): AdminEnquiry {
  return {
    id: r.id,
    timestamp: new Date(r.created_at).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata',
    }),
    businessName: r.business_name,
    contactPerson: r.contact_person,
    phone: r.phone,
    email: r.email || '',
    productCode: r.product_code || undefined,
    productName: r.product_name || undefined,
    quantity: r.quantity || undefined,
    enquiryType: r.enquiry_type,
    notes: r.notes || undefined,
    status: r.status,
    sourcePage: r.source_page || undefined,
  };
}
