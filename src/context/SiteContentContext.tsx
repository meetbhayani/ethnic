'use client';

import React, { createContext, useContext } from 'react';
import { GalleryItem } from '@/types';
import { GALLERY_DATA } from '@/data/gallery';
import { slotByKey } from '@/lib/site-images';

interface SiteContent {
  siteImages: Record<string, string>;
  gallery: GalleryItem[] | null;
}

const SiteContentContext = createContext<SiteContent>({ siteImages: {}, gallery: null });

/** Admin-managed images, loaded on the server in the site layout. */
export function SiteContentProvider({ value, children }: { value: SiteContent; children: React.ReactNode }) {
  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

/** Image for a fixed spot: the admin's replacement, else the spot's default. */
export function useSiteImage(key: string): string {
  const { siteImages } = useContext(SiteContentContext);
  return siteImages[key] || slotByKey(key)?.defaultSrc || '';
}

/** Gallery items from Admin → Gallery; the built-in set until the first item is published. */
export function useGallery(): GalleryItem[] {
  return useContext(SiteContentContext).gallery ?? GALLERY_DATA;
}

/** Lookup function for pages that need several spots, e.g. inside a list. */
export function useSiteImageResolver(): (key: string) => string {
  const { siteImages } = useContext(SiteContentContext);
  return (key) => siteImages[key] || slotByKey(key)?.defaultSrc || '';
}
