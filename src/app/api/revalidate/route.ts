import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { CATALOG_TAG } from '@/lib/catalog';

/**
 * Called by the admin panel after a product is added/edited/deleted so the
 * server-rendered product pages and sitemap update immediately.
 * Requires the caller's Supabase access token, and the caller must be an admin.
 */
export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/(rest\/v1\/?)?$/, '').replace(/\/+$/, '');
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.json({ error: 'Not configured' }, { status: 500 });

  const asUser = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: isAdmin, error } = await asUser.rpc('is_admin');
  if (error || isAdmin !== true) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  revalidateTag(CATALOG_TAG);
  revalidatePath('/collections/[id]', 'page');
  revalidatePath('/sitemap.xml');
  return NextResponse.json({ ok: true });
}
