'use client';

import { FABRIC_IMAGES_BUCKET } from '@/lib/supabase/client';

/** Resize to max 1600px and re-encode as JPEG (~200–400 KB) before upload. */
export function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const MAX = 1600;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        const scale = MAX / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error('Canvas not supported'));
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          blob ? resolve(blob) : reject(new Error('Could not compress image'));
        },
        'image/jpeg',
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not read ${file.name}`));
    };
    img.src = url;
  });
}

/** Storage path if the URL points at our bucket, else null (e.g. an Unsplash URL). */
export function storagePathFromUrl(url: string): string | null {
  const marker = `/object/public/${FABRIC_IMAGES_BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length).split('?')[0]);
}

export function errorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) return String((err as { message: unknown }).message);
  return 'Something went wrong.';
}

// ---------------------------------------------------------------------------
// Swatch tiles: seamless, evenly lit fabric repeats for garment previews
// ---------------------------------------------------------------------------

/** Area of a photo to cut the tile from: centre (0–1 of width/height) and size (0–1 of the short side). */
export interface SwatchCrop {
  cx: number;
  cy: number;
  size: number;
}

export const DEFAULT_SWATCH_CROP: SwatchCrop = { cx: 0.5, cy: 0.5, size: 0.4 };

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    // Needed to read pixels from Supabase-hosted photos (served with CORS headers).
    if (!src.startsWith('blob:') && !src.startsWith('data:')) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load the photo for the swatch tile.'));
    img.src = src;
  });
}

/** Pixel square of the crop inside an image of the given size. */
export function cropRect(w: number, h: number, crop: SwatchCrop) {
  const side = Math.max(8, Math.min(w, h) * crop.size);
  const x = Math.min(Math.max(crop.cx * w - side / 2, 0), w - side);
  const y = Math.min(Math.max(crop.cy * h - side / 2, 0), h - side);
  return { x, y, side };
}

/**
 * Cuts a square from the photo, evens out fold shadows (divides by a heavily blurred
 * copy), then mirrors it 2×2 so all four edges join seamlessly.
 */
export async function makeSwatchTile(src: string, crop: SwatchCrop = DEFAULT_SWATCH_CROP): Promise<Blob> {
  const img = await loadImage(src);
  const HALF = 256;
  const { x, y, side } = cropRect(img.naturalWidth, img.naturalHeight, crop);

  const a = document.createElement('canvas');
  a.width = a.height = HALF;
  const actx = a.getContext('2d', { willReadFrequently: true });
  if (!actx) throw new Error('Canvas not supported');
  actx.imageSmoothingQuality = 'high';
  actx.drawImage(img, x, y, side, side, 0, 0, HALF, HALF);

  // Low-pass copy: shrink to a few pixels and scale back up (works in every browser).
  const tiny = document.createElement('canvas');
  tiny.width = tiny.height = 6;
  const tctx = tiny.getContext('2d')!;
  tctx.imageSmoothingQuality = 'high';
  tctx.drawImage(a, 0, 0, 6, 6);
  const blur = document.createElement('canvas');
  blur.width = blur.height = HALF;
  const bctx = blur.getContext('2d', { willReadFrequently: true })!;
  bctx.imageSmoothingQuality = 'high';
  bctx.drawImage(tiny, 0, 0, HALF, HALF);

  const src4 = actx.getImageData(0, 0, HALF, HALF);
  const low = bctx.getImageData(0, 0, HALF, HALF).data;
  const d = src4.data;
  const mean = [0, 0, 0];
  for (let i = 0; i < d.length; i += 4) {
    mean[0] += d[i];
    mean[1] += d[i + 1];
    mean[2] += d[i + 2];
  }
  const n = d.length / 4;
  for (let c = 0; c < 3; c++) mean[c] /= n;
  for (let i = 0; i < d.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const flat = (d[i + c] / Math.max(low[i + c], 1)) * mean[c];
      d[i + c] = Math.max(0, Math.min(255, 0.75 * flat + 0.25 * d[i + c]));
    }
  }
  actx.putImageData(src4, 0, 0);

  const tile = document.createElement('canvas');
  tile.width = tile.height = HALF * 2;
  const ctx = tile.getContext('2d')!;
  const put = (sx: number, sy: number, dx: number, dy: number) => {
    ctx.save();
    ctx.translate(dx + (sx < 0 ? HALF : 0), dy + (sy < 0 ? HALF : 0));
    ctx.scale(sx, sy);
    ctx.drawImage(a, 0, 0);
    ctx.restore();
  };
  put(1, 1, 0, 0);
  put(-1, 1, HALF, 0);
  put(1, -1, 0, HALF);
  put(-1, -1, HALF, HALF);

  return new Promise((resolve, reject) =>
    tile.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not create the swatch tile'))), 'image/jpeg', 0.86)
  );
}

// ---------------------------------------------------------------------------
// Website images (Admin → Site Images / Gallery)
// ---------------------------------------------------------------------------
type StorageClient = {
  storage: {
    from: (bucket: string) => {
      upload: (path: string, body: Blob, opts: { contentType: string; cacheControl: string }) => Promise<{ error: unknown }>;
      getPublicUrl: (path: string) => { data: { publicUrl: string } };
      remove: (paths: string[]) => Promise<unknown>;
    };
  };
};

/** Compresses and uploads a website image to `<folder>/…jpg`, returning its public URL. */
export async function uploadSiteImage(supabase: StorageClient, file: File, folder: string): Promise<string> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error('Please choose a JPG, PNG or WEBP image.');
  const blob = await compressImage(file);
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await supabase.storage
    .from(FABRIC_IMAGES_BUCKET)
    .upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' });
  if (error) throw error;
  return supabase.storage.from(FABRIC_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Deletes an uploaded website image (ignores URLs outside our bucket, e.g. defaults). */
export async function removeSiteImage(supabase: StorageClient, url: string | null | undefined) {
  const path = url ? storagePathFromUrl(url) : null;
  if (path) await supabase.storage.from(FABRIC_IMAGES_BUCKET).remove([path]);
}

/** True when a Supabase error means a table from a not-yet-run migration is missing. */
export function isMissingTable(err: unknown): boolean {
  const e = err as { code?: string; message?: string } | null;
  return !!e && (e.code === '42P01' || e.code === 'PGRST205' || /does not exist|could not find the table/i.test(e.message || ''));
}
