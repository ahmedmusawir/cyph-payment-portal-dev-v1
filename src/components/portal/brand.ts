import { peerOrigin } from "@/lib/appIdentity";

// Customer-facing brand text — ONE configurable place (UI_SPEC §1, AC-20).
// "Pharmacy Books" follows Coach; final naming is Tony/Coach's call.
export const BRAND = {
  name: "Pharmacy Books",
  subline: "Account & Billing",
  footer: "Pharmacy Books · a Cyber Pharma product",
  // Manual QA 19 Nov 2026 (R10): the contract-recorded business address (STAGING_AND_GATE_D.md), overridable by
  // NEXT_PUBLIC_SUPPORT_EMAIL. Director 20 Nov 2026: use it; mailbox operation not yet verified.
  supportEmail: (process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@pharmacybooks.com").trim(),
  owedBook: "OwedBook",
} as const;

/**
 * Terms and Privacy destinations are Director-supplied deployment inputs (STAGING_AND_GATE_D.md). Until configured they are
 * null and the pages say so plainly; nothing is invented and no unrelated page is substituted.
 */
const url = (v: string | undefined): string | null => { const t = (v ?? "").trim(); return /^https:\/\/[^\s]+$/.test(t) ? t : null; };
export const LEGAL = {
  termsUrl: url(process.env.NEXT_PUBLIC_TERMS_URL),
  privacyUrl: url(process.env.NEXT_PUBLIC_PRIVACY_URL),
} as const;
export const NOT_CONFIGURED = "(link not yet published)";

/** Going to OwedBook: a plain link to the handoff start route. No token is ever put in the link. */
export const owedBookHandoffHref = (): string => `${peerOrigin()}/api/handoff/start?return=/owedbook`;
