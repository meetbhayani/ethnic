import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { FabricItem, GalleryItem } from '@/types';
import { FABRICS_DATA } from '@/data/fabrics';
import { FabricRow, rowToFabric } from '@/lib/fabrics';

/** Cache tag used by /api/revalidate so admin edits appear on the site immediately. */
export const CATALOG_TAG = 'catalog';
const REVALIDATE_SECONDS = 300;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://khodalfashion.com').replace(/\/+$/, '');

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/(rest\/v1\/?)?$/, '').replace(/\/+$/, '');
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      // Cache catalogue reads on the server; purged on demand by the admin via revalidateTag.
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input, { ...init, next: { revalidate: REVALIDATE_SECONDS, tags: [CATALOG_TAG] } }),
    },
  });
}

/** Published fabrics, read with the public key (RLS only returns published rows). */
export async function getPublishedFabrics(): Promise<FabricItem[]> {
  const db = publicClient();
  if (!db) return FABRICS_DATA;
  const { data, error } = await db
    .from('fabrics')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error || !data) {
    console.error('Catalogue load failed, using built-in data:', error?.message);
    return FABRICS_DATA;
  }
  return (data as FabricRow[]).map(rowToFabric);
}

export async function getFabric(id: string): Promise<FabricItem | null> {
  const all = await getPublishedFabrics();
  return all.find((f) => f.id === id) || null;
}

export function getRelatedFabrics(all: FabricItem[], fabric: FabricItem, limit = 3): FabricItem[] {
  return all
    .filter((f) => f.id !== fabric.id && (f.category === fabric.category || f.embroideryType === fabric.embroideryType))
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// Admin-managed website images (Admin → Site Images, Admin → Gallery)
// Both return empty results if the tables do not exist yet, so the site falls
// back to its default images (see supabase/migrations/20261125_site_images_gallery.sql).
// ---------------------------------------------------------------------------

/** Replaced image spots, keyed by slot key (see src/lib/site-images.ts). */
export async function getSiteImages(): Promise<Record<string, string>> {
  const db = publicClient();
  if (!db) return {};
  const { data, error } = await db.from('site_images').select('key,url');
  if (error || !data) return {};
  return Object.fromEntries(data.filter((r) => r.url).map((r) => [r.key as string, r.url as string]));
}

/** Published gallery items in display order; null when none are published yet. */
export async function getGalleryItems(): Promise<GalleryItem[] | null> {
  const db = publicClient();
  if (!db) return null;
  const { data, error } = await db
    .from('gallery_items')
    .select('id,title,tag,category,image,caption,aspect')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error || !data || data.length === 0) return null;
  return data as GalleryItem[];
}
