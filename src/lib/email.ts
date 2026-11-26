/**
 * Sender address for Resend emails (server only).
 * Resend only sends from domains you have verified. Free mailbox domains (gmail.com etc.) can never be
 * verified, so for those — or when nothing is set — use Resend's built-in sender, which delivers to
 * the email address the Resend account was created with.
 */
const RESEND_TEST_SENDER = 'Khodal Fashion Website <onboarding@resend.dev>';
const FREE_MAIL = /@(gmail|googlemail|yahoo|ymail|outlook|hotmail|live|icloud|me|rediffmail|proton|protonmail)\.[a-z.]+>?\s*$/i;

export function senderAddress(): string {
  const from = process.env.ENQUIRY_FROM_EMAIL?.trim();
  return from && !FREE_MAIL.test(from) ? from : RESEND_TEST_SENDER;
}
