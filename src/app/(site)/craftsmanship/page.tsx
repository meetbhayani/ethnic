import CraftsmanshipView from '@/components/CraftsmanshipView';
import { getCraftTechniques, getSiteContent, getSiteImages } from '@/lib/catalog';
import { CRAFT_CONTENT_KEY, CraftPageContent, builtInTechniques, mergeCraftPage } from '@/lib/craftsmanship';

/** Content comes from Admin → Craftsmanship; built-in content is shown until the admin publishes their own. */
export default async function CraftsmanshipPage() {
  const [techniques, saved, siteImages] = await Promise.all([
    getCraftTechniques(),
    getSiteContent<CraftPageContent>(CRAFT_CONTENT_KEY),
    getSiteImages(),
  ]);
  return <CraftsmanshipView content={mergeCraftPage(saved)} techniques={techniques ?? builtInTechniques(siteImages)} />;
}
