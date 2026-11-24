'use client';

import { useMemo } from 'react';
import { useEnquiry } from '@/context/EnquiryContext';
import type { FabricItem } from '@/types';
import { HOME_FABRICS, HomeFabric, fabricById } from './fabric-library';

/** Approximate glow colour per colour family (used for ambient tints behind photos). */
const FAMILY_HEX: Record<FabricItem['colorFamily'], string> = {
  ivory: '#E3D9C6',
  sandstone: '#CDB894',
  gold: '#B8955A',
  burgundy: '#713B43',
  emerald: '#1C5B45',
  navy: '#1E2440',
  black: '#2B2522',
};

export type HomeItem = HomeFabric & {
  /** Product page, when the item comes from the admin catalogue. */
  href?: string;
  category?: FabricItem['category'];
  embroideryType?: FabricItem['embroideryType'];
  readyStock?: boolean;
};

function fromCatalogue(f: FabricItem): HomeItem {
  return {
    id: f.id,
    src: f.mainImage,
    // Garment previews need the even, seamless tile created in the admin panel.
    tile: f.swatchTile || f.mainImage,
    name: f.name,
    technique: f.embroideryTypeLabel,
    tone: f.color,
    hex: f.availableColors?.[0]?.hex || FAMILY_HEX[f.colorFamily] || '#AD8A53',
    large: true,
    href: `/collections/${f.id}`,
    category: f.category,
    embroideryType: f.embroideryType,
    readyStock: f.readyStock,
  };
}

/**
 * Fabrics for the home page, managed from Admin → Products.
 * Featured products come first. The built-in photos are used only when the catalogue
 * has no published products with photos.
 */
export function useHomeFabrics() {
  const { fabrics } = useEnquiry();

  return useMemo(() => {
    const live = fabrics
      .filter((f) => f.mainImage)
      .sort((a, b) => Number(b.featured) - Number(a.featured))
      .map(fromCatalogue);
    const isLive = live.length > 0;
    const list: HomeItem[] = isLive ? live : HOME_FABRICS;

    /** First `n` items, repeating if the catalogue is smaller. */
    const take = (n: number, from: HomeItem[] = list): HomeItem[] =>
      from.length ? Array.from({ length: n }, (_, i) => from[i % from.length]) : [];

    /**
     * A catalogue item matching `match` (e.g. a category); otherwise the item at `index`.
     * Without a catalogue, the named built-in photo.
     */
    const pick = (fallbackId: string, match?: (f: HomeItem) => boolean, index = 0): HomeItem => {
      if (!isLive) return fabricById(fallbackId);
      return (match && live.find(match)) || live[index % live.length];
    };

    return { live: isLive, list, take, pick };
  }, [fabrics]);
}
