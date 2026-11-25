import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/server';

/**
 * Admin team management (Admin → Admins). Every call requires a signed-in admin.
 *   GET    → list admins
 *   POST   { email, password } → create an admin login (or give an existing user admin access)
 *   DELETE { userId } → remove admin access (the login itself is kept)
 * Uses the server-only secret key because the admins table and user accounts
 * cannot be changed from the browser.
 */

export const dynamic = 'force-dynamic';

export interface AdminUser {
  userId: string;
  email: string;
  createdAt: string;
  lastSignInAt: string | null;
  isYou: boolean;
}

function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function adminClient() {
  try {
    return getSupabaseAdmin();
  } catch {
    return null;
  }
}

const NO_SECRET = 'Server is missing SUPABASE_SECRET_KEY. Add it to the environment variables, then restart.';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) return auth.error;
  const db = adminClient();
  if (!db) return fail(NO_SECRET, 500);

  const { data: rows, error } = await db.from('admins').select('user_id, created_at').order('created_at');
  if (error) return fail(error.message, 500);

  const admins: AdminUser[] = await Promise.all(
    (rows || []).map(async (r) => {
      const { data } = await db.auth.admin.getUserById(r.user_id);
      return {
        userId: r.user_id,
        email: data.user?.email || '(deleted user)',
        createdAt: r.created_at,
        lastSignInAt: data.user?.last_sign_in_at || null,
        isYou: r.user_id === auth.userId,
      };
    })
  );
  return NextResponse.json({ admins });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) return auth.error;
  const db = adminClient();
  if (!db) return fail(NO_SECRET, 500);

  const body = await req.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Enter a valid email address.');
  if (password.length < 8) return fail('The temporary password must be at least 8 characters.');

  // Create the login, already confirmed so they can sign in straight away.
  let userId: string | null = null;
  let existed = false;
  const { data: created, error: createErr } = await db.auth.admin.createUser({ email, password, email_confirm: true });
  if (created?.user) {
    userId = created.user.id;
  } else if (createErr && /already|registered|exists/i.test(createErr.message)) {
    // Someone with this email already has a login: give that account admin access instead.
    existed = true;
    for (let page = 1; page <= 20 && !userId; page++) {
      const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
      if (error) return fail(error.message, 500);
      userId = data.users.find((u) => u.email?.toLowerCase() === email)?.id || null;
      if (data.users.length < 200) break;
    }
    if (!userId) return fail('A login with this email exists but could not be found. Try again.', 500);
  } else {
    return fail(createErr?.message || 'Could not create the login.', 500);
  }

  const { error: insertErr } = await db.from('admins').upsert({ user_id: userId }, { onConflict: 'user_id', ignoreDuplicates: true });
  if (insertErr) return fail(insertErr.message, 500);

  return NextResponse.json({ ok: true, existed });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) return auth.error;
  const db = adminClient();
  if (!db) return fail(NO_SECRET, 500);

  const body = await req.json().catch(() => ({}));
  const userId = String(body.userId || '');
  if (!userId) return fail('Missing userId.');
  if (userId === auth.userId) return fail('You cannot remove your own admin access.');

  const { count, error: countErr } = await db.from('admins').select('user_id', { count: 'exact', head: true });
  if (countErr) return fail(countErr.message, 500);
  if ((count || 0) <= 1) return fail('There must always be at least one admin.');

  const { error } = await db.from('admins').delete().eq('user_id', userId);
  if (error) return fail(error.message, 500);
  return NextResponse.json({ ok: true });
}
