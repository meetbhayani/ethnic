import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';

const ENQUIRY_TYPES = ['fabric-price', 'custom-jobwork', 'wholesale-b2b', 'swatch-kit'] as const;

// Best-effort per-instance rate limit: 5 submissions / 10 min per IP.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return recent.length > MAX_PER_WINDOW;
}

function clean(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const v = value.trim();
  return v ? v.slice(0, max) : null;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

async function sendAlertEmail(row: Record<string, string | null>) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_ALERT_EMAIL;
  if (!apiKey || !to) return; // email alerts are optional until configured

  const lines = Object.entries(row)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#777">${escapeHtml(k)}</td><td>${escapeHtml(String(v))}</td></tr>`)
    .join('');

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.ENQUIRY_FROM_EMAIL || 'Khodal Fashion Website <onboarding@resend.dev>',
      to: [to],
      subject: `New enquiry: ${row.business_name} (${row.enquiry_type})`,
      html: `<h2>New website enquiry</h2><table>${lines}</table>`,
    }),
  });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field; bots usually do.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many enquiries from this connection. Please try again later or contact us on WhatsApp.' },
      { status: 429 }
    );
  }

  const row = {
    business_name: clean(body.businessName, 200),
    contact_person: clean(body.contactPerson, 200),
    phone: clean(body.phone, 30),
    email: clean(body.email, 200),
    product_code: clean(body.productCode, 200),
    product_name: clean(body.productName, 300),
    quantity: clean(body.quantity, 100),
    enquiry_type: clean(body.enquiryType, 40),
    notes: clean(body.notes, 4000),
    source_page: clean(body.sourcePage, 200),
  };

  if (!row.business_name || !row.contact_person) {
    return NextResponse.json({ error: 'Please enter your business name and contact person.' }, { status: 400 });
  }
  if (!row.phone || row.phone.replace(/\D/g, '').length < 8) {
    return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
  }
  if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
    return NextResponse.json({ error: 'Please enter a valid email address or leave it blank.' }, { status: 400 });
  }
  if (!row.enquiry_type || !(ENQUIRY_TYPES as readonly string[]).includes(row.enquiry_type)) {
    return NextResponse.json({ error: 'Invalid enquiry type.' }, { status: 400 });
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .from('enquiries')
      .insert(row)
      .select('id')
      .single();

    if (error) throw error;

    try {
      await sendAlertEmail(row);
    } catch (mailErr) {
      console.error('Enquiry saved but alert email failed:', mailErr);
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (err) {
    console.error('Failed to save enquiry:', err);
    return NextResponse.json(
      { error: 'We could not submit your enquiry right now. Please try again or contact us on WhatsApp.' },
      { status: 500 }
    );
  }
}
