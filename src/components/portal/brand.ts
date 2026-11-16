import { peerOrigin } from "@/lib/appIdentity";

// Customer-facing brand text — ONE configurable place (UI_SPEC §1, AC-20).
// "Pharmacy Books" follows Coach; final naming is Tony/Coach's call.
export const BRAND = {
  name: "Pharmacy Books",
  subline: "Account & Billing",
  footer: "Pharmacy Books · a Cyber Pharma product",
  supportEmail: "[SUPPORT EMAIL]",
  owedBook: "OwedBook",
} as const;

/** Going to OwedBook: a plain link to the handoff start route. No token is ever put in the link. */
export const owedBookHandoffHref = (): string => `${peerOrigin()}/api/handoff/start?return=/owedbook`;
