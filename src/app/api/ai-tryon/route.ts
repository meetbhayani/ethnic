import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { getFabric, getSiteImages } from '@/lib/catalog';
import { slotByKey } from '@/lib/site-images';
import { limitReachedToday, recordTryon } from '@/lib/tryon-usage';

// Runs the open-source FLUX.2 [klein] 4B model (Apache-2.0) on Cloudflare Workers AI.
// The free Cloudflare plan includes 10,000 Neurons/day (~60 previews); when used up,
// requests fail until the next day — the free plan is never charged.
export const runtime = 'nodejs';
export const maxDuration = 60;

const MODEL = process.env.CF_IMAGE_MODEL || '@cf/black-forest-labs/flux-2-klein-4b';
const OUT_W = 768;
const OUT_H = 1024;
const INPUT_MAX_SIDE = 512; // small reference images keep each preview cheap

const PRESET_IDS = ['preset-groom', 'preset-evening', 'preset-modern', 'preset-festive'] as const;
const UPLOAD_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const MAX_FETCH_BYTES = 8 * 1024 * 1024;

const GARMENTS: Record<string, string> = {
  sherwani: 'a knee-length ceremonial sherwani with a stiff stand collar and front button placket',
  kurta: 'a festive knee-length kurta with a band collar, worn with plain churidar',
  jodhpuri: 'a tailored Jodhpuri bandhgala jacket with a closed band collar and structured shoulders, worn with plain trousers',
  'indo-western': 'a modern Indo-Western long coat with an asymmetric front closure and sharp tailoring',
};

function credentials(): { accountId: string; token: string } | null {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const token = process.env.CLOUDFLARE_API_TOKEN?.trim();
  return accountId && token ? { accountId, token } : null;
}

export async function GET() {
  const configured = Boolean(credentials());
  const limitReached = configured && (await limitReachedToday());
  return NextResponse.json({ available: configured, limitReached });
}

// Best-effort per-instance rate limit so one visitor can't use up the daily allowance: 6 / hour per IP.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

/** Downloads a trusted image (catalogue / admin-managed URL, never a browser-supplied one). */
async function fetchImage(src: string, origin: string): Promise<Buffer | null> {
  try {
    const url = new URL(src, origin);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) return null;
    if (!(res.headers.get('content-type') || 'image/').startsWith('image/')) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.length > MAX_FETCH_BYTES ? null : buf;
  } catch {
    return null;
  }
}

/** Parses a browser-uploaded photo sent as a data URL. */
function parseUpload(dataUrl: unknown): Buffer | null {
  if (typeof dataUrl !== 'string') return null;
  const m = /^data:(image\/[a-z+]+);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!m || !UPLOAD_TYPES.includes(m[1])) return null;
  const buf = Buffer.from(m[2], 'base64');
  return buf.length > MAX_UPLOAD_BYTES ? null : buf;
}

/** Normalises any input photo to a small JPEG (also strips metadata such as GPS). */
async function toReference(buf: Buffer): Promise<Blob | null> {
  try {
    const out = await sharp(buf)
      .rotate()
      .resize(INPUT_MAX_SIDE, INPUT_MAX_SIDE, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();
    return new Blob([new Uint8Array(out)], { type: 'image/jpeg' });
  } catch {
    return null;
  }
}

function buildPrompt(mode: string, garment: string, fabric: { name: string; baseFabric: string; embroideryTypeLabel: string; color: string }) {
  const fabricNote = `Image 2 is the fabric "${fabric.name}" (${fabric.embroideryTypeLabel} on ${fabric.baseFabric}, ${fabric.color}).`;
  const fidelity =
    'Copy the fabric from image 2 exactly: the same embroidery motifs, pattern repeat and scale, colours, zari and thread shine, sequins or beads, and base cloth texture. Do not invent a different design or change its colours.';
  const keep =
    'Image 1 is the person. Keep the same person, skin tone, hair, body shape, pose, background and lighting from image 1, and keep exactly the same framing and crop — if the head is cut off in image 1, keep it cut off; never add or change a face.';

  if (mode === 'fabric-only') {
    return `${keep} Keep the clothes the person is already wearing in image 1 unchanged. ${fabricNote} Add an unstitched length of the fabric from image 2 draped over one shoulder and hanging down the front of the body, the way a textile merchant presents fabric, so the embroidery is clearly visible with natural folds. ${fidelity} Photorealistic, high detail.`;
  }
  return `${keep} Only change the clothing. ${fabricNote} Dress the person from image 1 in ${garment}, tailored entirely from the fabric in image 2, with the embroidery placed the way a skilled menswear tailor would cut it. ${fidelity} The garment fits naturally. Photorealistic, high detail, realistic drape, folds and shadows.`;
}

const QUOTA_MSG =
  'Today’s free AI preview allowance has been used up. Please try again tomorrow, or contact us on WhatsApp for styled previews.';
const GENERIC_MSG = 'The preview could not be generated right now. Please try again in a few minutes.';

export async function POST(req: NextRequest) {
  const creds = credentials();
  if (!creds) {
    return NextResponse.json(
      { error: 'AI Try-On is not available right now. Please contact us on WhatsApp for styled previews.' },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { fabricId, outfitStyle, previewMode, presetId, uploadedImage } = body as Record<string, unknown>;

  if (typeof fabricId !== 'string' || !fabricId) {
    return NextResponse.json({ error: 'Please choose a fabric.' }, { status: 400 });
  }

  // Validate the person photo before counting the request against the limit.
  let personRaw: Buffer | null = null;
  if (uploadedImage != null) {
    personRaw = parseUpload(uploadedImage);
    if (!personRaw) {
      return NextResponse.json({ error: 'Please upload a JPG, PNG or WebP photo under 4 MB.' }, { status: 400 });
    }
  } else if (typeof presetId !== 'string' || !(PRESET_IDS as readonly string[]).includes(presetId)) {
    return NextResponse.json({ error: 'Please choose a model or upload a photo.' }, { status: 400 });
  }

  // Don't keep calling Cloudflare once today's free allowance is known to be used up.
  if (await limitReachedToday()) {
    return NextResponse.json({ error: QUOTA_MSG }, { status: 429 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'You have reached the preview limit for now. Please try again in an hour, or contact us on WhatsApp.' },
      { status: 429 }
    );
  }

  // Look the fabric up on the server — never trust fabric text or image URLs sent by the browser.
  const fabric = await getFabric(fabricId);
  if (!fabric) {
    return NextResponse.json({ error: 'That fabric is no longer available.' }, { status: 404 });
  }

  const origin = req.nextUrl.origin;
  if (!personRaw) {
    const slotKey = `tryon.${presetId}`;
    const presetSrc = (await getSiteImages())[slotKey] || slotByKey(slotKey)?.defaultSrc || '';
    personRaw = presetSrc ? await fetchImage(presetSrc, origin) : null;
  }
  const fabricRaw = fabric.mainImage ? await fetchImage(fabric.mainImage, origin) : null;
  const person = personRaw && (await toReference(personRaw));
  const fabricImage = fabricRaw && (await toReference(fabricRaw));
  if (!person || !fabricImage) {
    return NextResponse.json(
      { error: 'We could not load the photos for this preview. Please try another model or fabric.' },
      { status: 502 }
    );
  }

  const garment = GARMENTS[typeof outfitStyle === 'string' ? outfitStyle : ''] || GARMENTS.sherwani;
  const form = new FormData();
  form.append('prompt', buildPrompt(previewMode === 'fabric-only' ? 'fabric-only' : 'complete', garment, fabric));
  form.append('input_image_0', person, 'person.jpg');
  form.append('input_image_1', fabricImage, 'fabric.jpg');
  form.append('width', String(OUT_W));
  form.append('height', String(OUT_H));

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(creds.accountId)}/ai/run/${MODEL}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${creds.token}` },
        body: form,
        signal: AbortSignal.timeout(55000),
      }
    );
    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      const detail = JSON.stringify(data?.errors || data || res.status).slice(0, 400);
      console.warn('Workers AI try-on error', res.status, detail);
      // Free-plan exhaustion: code 4006 "used up your daily free allocation of 10,000 neurons".
      // A plain 429 without that is a short per-minute rate limit — don't pause the whole day for it.
      const dailyLimit = /4006|neuron|allocation/i.test(detail);
      await recordTryon(dailyLimit ? 'limit' : 'failure');
      if (dailyLimit) return NextResponse.json({ error: QUOTA_MSG }, { status: 429 });
      if (res.status === 429) {
        return NextResponse.json({ error: 'Many people are generating previews right now. Please try again in a minute.' }, { status: 429 });
      }
      return NextResponse.json({ error: GENERIC_MSG }, { status: 502 });
    }

    const image: string | undefined = data.result?.image;
    if (!image) {
      console.warn('Workers AI try-on returned no image');
      await recordTryon('failure');
      return NextResponse.json({ error: GENERIC_MSG }, { status: 502 });
    }
    await recordTryon('success');
    const mime = image.startsWith('/9j/') ? 'image/jpeg' : image.startsWith('iVBOR') ? 'image/png' : 'image/webp';
    return NextResponse.json({ success: true, imageUrl: `data:${mime};base64,${image}` });
  } catch (err) {
    console.error('Try-On Workers AI error:', (err as Error)?.message || err);
    return NextResponse.json({ error: 'The preview took too long or failed. Please try again.' }, { status: 504 });
  }
}
