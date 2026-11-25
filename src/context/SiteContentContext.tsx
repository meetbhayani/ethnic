'use client';

import React, { createContext, useContext } from 'react';
import { GalleryItem } from '@/types';
import { GALLERY_DATA } from '@/data/gallery';
import { slotByKey } from '@/lib/site-images';
import { sectionOf } from '@/lib/gallery-sections';
import type { CraftLink } from '@/lib/craftsmanship';

interface SiteContent {
  siteImages: Record<string, string>;
  gallery: GalleryItem[] | null;
  /** Product categories switched off in Admin → Products → "Categories on website". */
  hiddenCategories: string[];
  /** Footer links to the Craftsmanship technique sections. */
  craftLinks: CraftLink[];
}

const SiteContentContext = createContext<SiteContent>({ siteImages: {}, gallery: null, hiddenCategories: [], craftLinks: [] });

/** Admin-managed images, loaded on the server in the site layout. */
export function SiteContentProvider({ value, children }: { value: SiteContent; children: React.ReactNode }) {
  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

/** Image for a fixed spot: the admin's replacement, else the spot's default. */
export function useSiteImage(key: string): string {
  const { siteImages } = useContext(SiteContentContext);
  return siteImages[key] || slotByKey(key)?.defaultSrc || '';
}

/**
 * Gallery items from Admin → Gallery; the built-in set until the first item is published.
 * Categories are normalised to the three Gallery sections (older 'swatch'/'craft' rows included).
 */
export function useGallery(): GalleryItem[] {
  const items = useContext(SiteContentContext).gallery ?? GALLERY_DATA;
  return items.map((item) => ({ ...item, category: sectionOf(item.category) }));
}

/** Whether a product category may be shown on the website (filter tabs, menus, home page cards). */
export function useCategoryShown(): (category: string) => boolean {
  const { hiddenCategories } = useContext(SiteContentContext);
  return (category) => !hiddenCategories.includes(category);
}

/** Technique sections on the Craftsmanship page, for footer links. */
export function useCraftLinks(): CraftLink[] {
  return useContext(SiteContentContext).craftLinks;
}

/** Lookup function for pages that need several spots, e.g. inside a list. */
export function useSiteImageResolver(): (key: string) => string {
  const { siteImages } = useContext(SiteContentContext);
  return (key) => siteImages[key] || slotByKey(key)?.defaultSrc || '';
}
