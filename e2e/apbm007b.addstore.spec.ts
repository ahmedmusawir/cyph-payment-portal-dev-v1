import { readFileSync } from "node:fs";
import { test, expect, type Page } from "@playwright/test";

// APBM-007B engineering production-build happy paths (AC-030) on the proof Portal (3101) against SCRATCH + Stripe sandbox.
// Credentials come only from the private 0600 file named by APBM007B_PROOF_CAST (created by scripts/apbm007b/fixture-owner.mjs).
// Each journey asserts the final rendered destination; stored state is asserted afterwards by scripts/apbm007b/walk-state.mjs.
// No logout (global sign-out) is performed; traces/videos stay off (config).
const castPath = process.env.APBM007B_PROOF_CAST ?? "";
const cast = castPath ? (JSON.parse(readFileSync(castPath, "utf8")) as { email: string; password: string; label: string }) : null;
const npi = (() => { for (;;) { const n = String(1000000000 + Math.floor(Math.random() * 899999999)); let s = 0; const d = `80840${n}`; for (let i = 0; i < 15; i++) { let x = Number(d[14 - i]); if (i % 2) { x *= 2; if (x > 9) x -= 9; } s += x; } if (s % 10 === 0) return n; } })();

async function signIn(page: Page) {
  await page.route("**/api/auth/logout", (r) => r.abort());
  await page.goto("/login");
  await page.getByLabel("Work email").fill(cast!.email);
  await page.getByRole("textbox", { name: "Password" }).fill(cast!.password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 30000 });
}

test.describe.configure({ mode: "serial" });
test.skip(!cast, "APBM007B_PROOF_CAST not supplied");

test("owner adds a store: server quote, three consents, payment, activated; dashboard shows it", async ({ page }) => {
  await signIn(page);
  const countText = await page.getByTestId("pharmacy-count").textContent();
  const before = Number(/(\d+)/.exec(countText ?? "")?.[1] ?? NaN);
  expect(before).toBeGreaterThanOrEqual(2);
  const storeName = `${cast!.label} Store ${before + 1}`;
  await page.getByTestId("add-store-link").click();
  await expect(page).toHaveURL(/\/stores\/add$/);
  await page.getByLabel("Pharmacy name").fill(storeName);
  await page.getByLabel("NPI").fill(npi);
  await page.getByRole("button", { name: "See the price" }).click();
  const quote = page.getByTestId("add-store-quote");
  await expect(quote).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId("quote-renewal")).toContainText(`$${((9900 + 4900 * before) / 100).toFixed(2)}`);
  const confirm = page.getByTestId("add-store-confirm");
  await expect(confirm).toBeDisabled();                                   // consent is explicit
  for (const box of await quote.getByRole("checkbox").all()) await box.check();
  await confirm.click();
  const status = page.getByTestId("add-store-status");
  await expect(status).toHaveAttribute("data-state", "activated", { timeout: 60000 });
  await expect(status).toContainText(`${storeName} has been added`);
  await page.getByRole("link", { name: "Back to your account" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByTestId("pharmacy-count")).toHaveText(`${before + 1} pharmacies`, { timeout: 30000 });
  await page.screenshot({ path: "test-results/apbm007b-addstore-dashboard.png", fullPage: true });
});

test("owner schedules a period-end removal and undoes it; no charge either way", async ({ page }) => {
  await signIn(page);
  // Manual QA 19 Nov 2026 (R9): an in-page confirmation naming the pharmacy and the date replaces the browser prompt.
  const section = page.getByTestId("pharmacies-section");
  const remove = section.getByRole("button", { name: "Remove at period end" }).first();
  await remove.click();
  const dialog = page.getByRole("alertdialog");
  await expect(dialog.getByText(/^Remove .+ on .+\?$/)).toBeVisible();
  await dialog.getByRole("button", { name: "Schedule removal" }).click();
  await expect(section.getByText(/^Removal scheduled/)).toBeVisible({ timeout: 30000 });
  const keep = section.getByRole("button", { name: "Keep this store" }).first();
  await expect(keep).toBeVisible({ timeout: 30000 });
  await expect(section.getByText(/Leaves on/).first()).toBeVisible();
  await keep.click();
  await expect(section.getByText(/stays on your account\.$/)).toBeVisible({ timeout: 30000 });
  await expect(section.getByRole("button", { name: "Keep this store" })).toHaveCount(0, { timeout: 30000 });
});

test("narrow viewport (375): dashboard and Add Store form fit with no horizontal scroll", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await signIn(page);
  for (const path of ["/dashboard", "/stores/add"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${path} horizontal overflow`).toBeLessThanOrEqual(1);
  }
  await page.screenshot({ path: "test-results/apbm007b-addstore-375.png", fullPage: true });
});
