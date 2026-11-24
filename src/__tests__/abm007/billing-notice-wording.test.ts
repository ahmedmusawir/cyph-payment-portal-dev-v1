/** @jest-environment node */
/**
 * ABM007_FINAL AC-E03 (source part) / P-07: the two plain-text billing notices carry the approved name in the default
 * sender display name, both subjects and the closing line. The only link is still /billing; the sending address is
 * unchanged. The (kind, invoice) idempotency key shape stays covered by apbm007b-store.test.ts.
 */
jest.mock("@/server/db", () => ({ rpc: async () => null, admin: () => ({}) }));

import { BILLING_EMAIL_FROM_DEFAULT, noticePayload } from "@/server/billingNotices";

const KINDS = ["renewal_payment_failed", "renewal_read_only_warning"] as const;

describe("ABM007_FINAL billing notice wording", () => {
  it("default sender: Pharmacy Books display name, same address", () => {
    expect(BILLING_EMAIL_FROM_DEFAULT).toBe("Pharmacy Books <no-reply@cyberizedev.com>");
  });

  it.each(KINDS)("%s: approved name in subject and closing line, no old name, one /billing link", (kind) => {
    const p = noticePayload({ kind, grace_ends_at: "2026-12-16T00:00:00Z", amount_due_cents: 14800 });
    expect(p.subject).toContain("Pharmacy Books");
    expect(p.text).toContain("You are receiving this because you own this Pharmacy Books account.");
    expect(`${p.subject}\n${p.text}`).not.toMatch(/Cyber Pharma/i);
    const links = p.text.match(/https?:\/\/\S+/g) ?? [];
    expect(links).toHaveLength(1);
    expect(links[0]).toMatch(/\/billing$/);
  });
});
