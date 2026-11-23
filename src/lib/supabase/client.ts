'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Browser Supabase client using the PUBLISHABLE key.
 * Safe to ship to the browser: Row Level Security decides what each user can do.
 * Visitors can only read published fabrics; logged-in admins can manage everything.
 */
let cached: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/(rest\/v1\/?)?$/, '').replace(/\/+$/, '');
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  }
  cached = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: 'kf-admin-auth' },
  });
  return cached;
}

export const FABRIC_IMAGES_BUCKET = 'fabric-images';
