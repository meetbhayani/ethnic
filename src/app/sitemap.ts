import type { MetadataRoute } from 'next';
import { getPublishedFabrics, SITE_URL } from '@/lib/catalog';

export const revalidate = 300;

const STATIC_PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/collections', priority: 0.9, changeFrequency: 'daily' },
  { path: '/wholesale-b2b', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/craftsmanship', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/about', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/process-quality', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/gallery', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/ai-tryon', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/policies', priority: 0.2, changeFrequency: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fabrics = await getPublishedFabrics();
  return [
    ...STATIC_PAGES.map((p) => ({
      url: `${SITE_URL}${p.path}`,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...fabrics.map((f) => ({
      url: `${SITE_URL}/collections/${f.id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      images: f.mainImage ? [f.mainImage] : undefined,
    })),
  ];
}
