import { getSupabaseAdmin } from '@/lib/supabase/server';
import { senderAddress } from '@/lib/email';

/**
 * Daily AI Try-On usage tracking + admin alerts (server only).
 * Cloudflare's free plan gives 10,000 Neurons/day (resets 00:00 UTC). One preview uses
 * roughly 150 Neurons, so ~60 previews/day is an estimate, not an exact figure.
 */
export const ESTIMATED_DAILY_PREVIEWS = 60;
export const WARN_AT = Math.round(ESTIMATED_DAILY_PREVIEWS * 0.8);

type Outcome = 'success' | 'limit' | 'failure';

const todayUtc = () => new Date().toISOString().slice(0, 10);

/** True when Cloudflare already refused today because the free allowance is used up. */
export async function limitReachedToday(): Promise<boolean> {
  try {
    const { data } = await getSupabaseAdmin()
      .from('tryon_usage')
      .select('limit_hit_at')
      .eq('day', todayUtc())
      .maybeSingle();
    return Boolean(data?.limit_hit_at);
  } catch {
    return false; // tracking is best-effort; never block previews because of it
  }
}

/** Records one try-on outcome and emails the admin the first time each alert is reached today. */
export async function recordTryon(outcome: Outcome): Promise<void> {
  try {
    const { data, error } = await getSupabaseAdmin().rpc('tryon_record', { p_outcome: outcome, p_warn_at: WARN_AT });
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) return;
    if (row.send_warning) await emailAdmin('warning', row.previews);
    if (row.send_limit) await emailAdmin('limit', row.previews);
  } catch (err) {
    console.error('Try-on usage tracking failed:', (err as Error)?.message || err);
  }
}

function resetTimeIst(): string {
  // 00:00 UTC = 05:30 IST
  return '5:30 AM IST (midnight UTC)';
}

async function emailAdmin(kind: 'warning' | 'limit', previews: number) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_ALERT_EMAIL;
  if (!apiKey || !to) {
    console.warn(`Try-on ${kind} alert not emailed: RESEND_API_KEY / ENQUIRY_ALERT_EMAIL not set (shown in Admin → Dashboard).`);
    return;
  }

  const subject =
    kind === 'limit'
      ? 'AI Try-On paused: today’s free Cloudflare allowance is used up'
      : `AI Try-On running low: ${previews} previews used today`;
  const body =
    kind === 'limit'
      ? `<p>Cloudflare has stopped AI Try-On previews for today because the free daily allowance (10,000 Neurons) is used up. <strong>${previews}</strong> previews were made today.</p>
         <p>Visitors now see a message asking them to contact you on WhatsApp. Previews start working again automatically at <strong>${resetTimeIst()}</strong>. Nothing has been charged.</p>`
      : `<p><strong>${previews}</strong> AI Try-On previews have been made today — about 80% of the estimated free daily allowance (~${ESTIMATED_DAILY_PREVIEWS} previews).</p>
         <p>If usage continues, previews will pause until <strong>${resetTimeIst()}</strong>. Nothing will be charged.</p>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: senderAddress(),
      to: [to],
      subject,
      html: `<h2>${subject}</h2>${body}<p style="color:#777">Live status: Admin → Dashboard.</p>`,
    }),
  });
  if (!res.ok) console.error('Try-on alert email failed', res.status, (await res.text()).slice(0, 300));
}
