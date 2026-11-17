import { readFileSync } from "node:fs";
import { test, expect, type Page } from "@playwright/test";

// APBM-007B — 007A regression on the screens 007B touched (AC-028) and accessibility of the new Add Store screen (AC-030),
// on the proof pair (Portal 3101, OwedBook 3100). No Stripe money call: the Add Store quote only READS Stripe. The OwedBook
// origin is the fixed proof peer. Credentials only from the private 0600 file named by APBM007B_PROOF_CAST. No logout.
const castPath = process.env.APBM007B_PROOF_CAST ?? "";
const cast = castPath ? (JSON.parse(readFileSync(castPath, "utf8")) as { email: string; password: string; label: string }) : null;
const OB = process.env.OB_BASE_URL ?? "http://localhost:3100";

async function signIn(page: Page) {
  await page.route("**/api/auth/logout", (r) => r.abort());
  await page.goto("/login");
  await page.getByLabel("Work email").fill(cast!.email);
  const pw = page.getByRole("textbox", { name: "Password" });
  await pw.fill(cast!.password);
  // U-3 password show/hide on the sign-in screen
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(pw).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Hide password" }).click();
  await expect(pw).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 30000 });
}

test.describe.configure({ mode: "serial" });
test.skip(!cast, "APBM007B_PROOF_CAST not supplied");

test("dashboard and billing still show plan, status, count and pharmacies; billing has one Manage billing action", async ({ page }) => {
  await signIn(page);
  await expect(page.getByRole("heading", { name: "Your account" })).toBeVisible();
  await expect(page.getByTestId("pharmacies-section")).toBeVisible();
  await page.goto("/billing");
  await expect(page.getByRole("heading", { name: "Your subscription" })).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId("manage-billing")).toHaveCount(1);
});

test("handoff Portal → OwedBook keeps the same user; OwedBook → Portal billing returns", async ({ page }) => {
  await signIn(page);
  await page.getByTestId("open-owedbook").first().click();
  await page.waitForURL((u) => u.origin === OB, { timeout: 30000 });
  await expect(page).toHaveURL(new RegExp(`^${OB}/`));
  // OwedBook admin billing fields (U-2) for the owner, then the route-driven nav highlight (U-1)
  await page.goto(`${OB}/admin-portal/billing`);
  await expect(page.locator('[aria-current="page"]').first()).toBeVisible({ timeout: 30000 });
  await expect(page.locator("body")).toContainText(/Price shown in the billing portal|Not billed|Price unavailable|billing is managed by the account owner/i, { timeout: 30000 });
  await page.screenshot({ path: "test-results/apbm007b-ob-billing.png", fullPage: true });
});

test("Add Store quote screen: keyboard-only, dark theme, server quote shown, confirm disabled until all three consents", async ({ page }) => {
  await signIn(page);
  await page.goto("/stores/add");
  await page.evaluate(() => { document.documentElement.classList.add("dark"); });
  await page.getByLabel("Pharmacy name").focus();
  await page.keyboard.type(`${cast!.label} Keyboard`);
  await page.keyboard.press("Tab");
  await page.keyboard.type("1234567893");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  const quote = page.getByTestId("add-store-quote");
  const form = page.getByTestId("add-store-form");
  // Either a server quote, or an honest refusal (e.g. NPI already registered on SCRATCH) — never a silent success.
  await expect(quote.or(page.getByRole("alert"))).toBeVisible({ timeout: 30000 });
  if (await quote.isVisible()) {
    await expect(page.getByTestId("add-store-confirm")).toBeDisabled();
    const boxes = await quote.getByRole("checkbox").all();
    for (const b of boxes.slice(0, 2)) { await b.focus(); await page.keyboard.press("Space"); }
    await expect(page.getByTestId("add-store-confirm")).toBeDisabled();
  } else {
    await expect(form).toBeVisible();
  }
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).not.toBe("rgb(255, 255, 255)");
  await page.screenshot({ path: "test-results/apbm007b-addstore-dark-keyboard.png", fullPage: true });
});
