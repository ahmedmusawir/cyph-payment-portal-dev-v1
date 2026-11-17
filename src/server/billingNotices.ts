// APBM-007B — the Portal's single billing-notice sender (CONTRACTS/CLOCK_AND_NOTICES.md "O-2"). Resend HTTPS API with the
// server-only RESEND_API_KEY; sign-in/invitation mail keeps the Auth SMTP path and is never used for billing notices.
// Durable claim → re-validated grace under the account lock (SQL) → mail guard → one request with a stable
// Idempotency-Key per (kind, invoice) → recorded outcome. Retries are bounded (5) and stop before the provider's
// 24-hour key retention (SQL refuses claims after 23 h); later ambiguity is attention, never a new key.
import { createHash, randomUUID } from 'node:crypto';
import { rpc } from '@/server/db';
import { logServer } from '@/server/errors';
import { ownOrigin } from '@/lib/appIdentity';
import { guardDecision } from '@/server/mailGuard';

export const BILLING_EMAIL_FROM_DEFAULT = 'Cyber Pharma <no-reply@cyberizedev.com>';
const RESEND_URL = 'https://api.resend.com/emails';

interface Claim { id: string; epoch: number; kind: 'renewal_payment_failed' | 'renewal_read_only_warning'; invoice_id: string; to: string; grace_ends_at: string; amount_due_cents: number | null; attempt: number; account_id: string }

const money = (c: number | null) => (c === null || c === undefined ? null : `$${(c / 100).toFixed(2)}`);
const date = (iso: string) => new Date(iso).toUTCString().replace(/:\d\d GMT$/, ' UTC');

/** Stable, truthful payload. No legal copy is invented; amount only when derived from the invoice. */
export function noticePayload(c: Pick<Claim, 'kind' | 'grace_ends_at' | 'amount_due_cents'>): { subject: string; text: string } {
  const link = `${ownOrigin()}/billing`;
  const amount = money(c.amount_due_cents);
  if (c.kind === 'renewal_payment_failed') {
    return {
      subject: 'Payment failed for your Cyber Pharma subscription',
      text: [`We couldn't collect your subscription renewal${amount ? ` of ${amount}` : ''}.`,
        `Your stores keep working normally until ${date(c.grace_ends_at)}. After that, your account becomes read-only until payment succeeds.`,
        `Update your payment method: ${link}`, '', 'You are receiving this because you own this Cyber Pharma account.'].join('\n'),
    };
  }
  return {
    subject: 'Your Cyber Pharma account becomes read-only in 48 hours',
    text: [`Your subscription renewal${amount ? ` of ${amount}` : ''} is still unpaid.`,
      `On ${date(c.grace_ends_at)} your account becomes read-only until payment succeeds.`,
      `Update your payment method: ${link}`, '', 'You are receiving this because you own this Cyber Pharma account.'].join('\n'),
  };
}
export const fingerprint = (p: { subject: string; text: string }) => createHash('sha256').update(`${p.subject}\n${p.text}`).digest('hex');

type Sender = (req: { key: string; from: string; to: string; subject: string; text: string }) => Promise<{ status: number; id?: string }>;
const resendSender: Sender = async ({ key, from, to, subject, text }) => {
  const res = await fetch(RESEND_URL, {
    method: 'POST', signal: AbortSignal.timeout(15_000),
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': key },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });
  const body = (await res.json().catch(() => ({}))) as { id?: string };
  return { status: res.status, id: body.id };
};
let sender: Sender = resendSender;
/** Test seam only. */
export function __setNoticeSenderForTests(s: Sender | null): void { sender = s ?? resendSender; }

export interface DispatchReport { claimed: number; sent: number; retry: number; attention: number; blocked: number; suppressed: number }
export async function dispatchDueNotices(): Promise<DispatchReport> {
  const report: DispatchReport = { claimed: 0, sent: 0, retry: 0, attention: 0, blocked: 0, suppressed: 0 };
  const due = await rpc<unknown[]>('notices_due', {});
  for (const row of due ?? []) {
    const id = typeof row === 'string' ? row : (Object.values(row as object)[0] as string);
    const owner = `pp-notice-${randomUUID()}`;
    const claimed = await rpc<Claim & { error?: string }>('notice_claim', { p_notice: id, p_owner: owner });
    if (claimed.error) { if (claimed.error === 'suppressed') report.suppressed++; if (claimed.error === 'attention') report.attention++; continue; }
    report.claimed++;
    const payload = noticePayload(claimed);
    const fp = fingerprint(payload);
    const finish = (outcome: 'sent' | 'retry' | 'attention', messageId: string | null, error: string | null) =>
      rpc<string>('notice_finish', { p_notice: claimed.id, p_owner: owner, p_epoch: claimed.epoch, p_outcome: outcome, p_message_id: messageId, p_error: error, p_fingerprint: fp });
    const guard = guardDecision(claimed.to);
    if (!guard.allowed) { report.blocked++; await finish('attention', null, 'mail_guard_blocked'); continue; }
    if (!process.env.RESEND_API_KEY) { report.attention++; await finish('attention', null, 'sender_not_configured'); continue; }
    try {
      const r = await sender({ key: `${claimed.kind}/${claimed.invoice_id}`, from: process.env.BILLING_EMAIL_FROM || BILLING_EMAIL_FROM_DEFAULT, to: claimed.to, ...payload });
      if (r.status >= 200 && r.status < 300 && r.id) { report.sent++; await finish('sent', r.id, null); }
      else if (r.status === 429 || r.status >= 500 || r.status === 409) { report.retry++; await finish('retry', null, `http_${r.status}`); }
      else { report.attention++; await finish('attention', null, `http_${r.status}`); }   // definite refusal (sender/recipient/key): needs a person
    } catch (e) {
      // Unknown outcome (timeout/network): the same key is reused on retry inside the 23-hour horizon; beyond it, attention.
      logServer('notice dispatch', e); report.retry++; await finish('retry', null, 'unknown_outcome');
    }
  }
  return report;
}
