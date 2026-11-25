import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Confirms an API request comes from a signed-in admin.
 * The admin panel sends the user's Supabase access token as "Authorization: Bearer <token>".
 * Returns the admin's user id, or a ready-made error response.
 */
export async function requireAdmin(req: NextRequest): Promise<{ userId: string } | { error: NextResponse }> {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/(rest\/v1\/?)?$/, '').replace(/\/+$/, '');
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { error: NextResponse.json({ error: 'Not configured' }, { status: 500 }) };

  const asUser = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const [{ data: userData, error: userErr }, { data: isAdmin, error }] = await Promise.all([
    asUser.auth.getUser(token),
    asUser.rpc('is_admin'),
  ]);
  if (userErr || !userData.user || error || isAdmin !== true) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { userId: userData.user.id };
}
