import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/ProductDetail';
import { getFabric, getPublishedFabrics, getRelatedFabrics, SITE_URL } from '@/lib/catalog';

export const revalidate = 300;

// Pre-build a page for every published fabric; new ones are built on first visit.
export async function generateStaticParams() {
  const fabrics = await getPublishedFabrics();
  return fabrics.map((f) => ({ id: f.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const fabric = await getFabric(params.id);
  if (!fabric) return { title: 'Fabric not found', robots: { index: false } };

  const title = `${fabric.name} (${fabric.code}) — ${fabric.categoryLabel}`;
  const description =
    `${fabric.embroideryTypeLabel} on ${fabric.baseFabric}, ${fabric.width}. MOQ ${fabric.moq}. ` +
    `${fabric.readyStock ? 'Ready stock' : 'Made to order'} in Surat. ${fabric.description}`.slice(0, 300);

  return {
    // `absolute` because the /collections layout sets its own title, which stops the root "%s | Khodal Fashion" template.
    title: { absolute: `${title} | Khodal Fashion` },
    description: description.slice(0, 160),
    alternates: { canonical: `/collections/${fabric.id}` },
    openGraph: {
      title,
      description: description.slice(0, 200),
      url: `${SITE_URL}/collections/${fabric.id}`,
      type: 'website',
      images: fabric.mainImage ? [{ url: fabric.mainImage, alt: fabric.name }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const all = await getPublishedFabrics();
  const fabric = all.find((f) => f.id === params.id);
  if (!fabric) notFound();

  // Structured data so Google understands this is a product (B2B: price on request).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: fabric.name,
    sku: fabric.code,
    description: fabric.description,
    image: (fabric.images?.length ? fabric.images : [fabric.mainImage]).filter(Boolean),
    category: fabric.categoryLabel,
    material: fabric.baseFabric,
    color: fabric.color,
    brand: { '@type': 'Brand', name: 'Khodal Fashion' },
    url: `${SITE_URL}/collections/${fabric.id}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <ProductDetail fabric={fabric} relatedFabrics={getRelatedFabrics(all, fabric)} />
    </>
  );
}
