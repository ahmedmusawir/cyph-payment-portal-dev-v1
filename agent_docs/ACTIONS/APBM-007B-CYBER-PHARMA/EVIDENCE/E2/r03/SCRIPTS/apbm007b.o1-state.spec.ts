import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";

// APBM-007B O-1 browser state checks at a clock phase (run by the engineer between o1-journey phases). Portal dashboard alert
// and OwedBook banner must match the expected access state; in read-only the owner's billing action stays reachable.
// APBM007B_O1_CAST: private 0600 file written by scripts/apbm007b/o1-journey.mjs; APBM007B_O1_EXPECT: grace | read_only | active.
const castPath = process.env.APBM007B_O1_CAST ?? "";
const expectState = process.env.APBM007B_O1_EXPECT ?? "";
const cast = castPath ? (JSON.parse(readFileSync(castPath, "utf8")) as { A: { email: string; password: string } }) : null;
const OB = process.env.OB_BASE_URL ?? "http://localhost:3100";
test.skip(!cast || !expectState, "O-1 cast/expectation not supplied");

test(`Portal dashboard shows the ${expectState} state with the owner's billing action`, async ({ page }) => {
  await page.route("**/api/auth/logout", (r) => r.abort());
  await page.goto("/login");
  await page.getByLabel("Work email").fill(cast!.A.email);
  await page.getByRole("textbox", { name: "Password" }).fill(cast!.A.password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 30000 });
  if (expectState === "grace") await expect(page.getByTestId("grace-update-card")).toBeVisible({ timeout: 30000 });
  if (expectState === "read_only") { await expect(page.getByTestId("read-only-fix")).toBeVisible({ timeout: 30000 }); await expect(page.getByTestId("add-store-link")).toHaveCount(0); }
  if (expectState === "active") { await expect(page.getByTestId("grace-update-card")).toHaveCount(0); await expect(page.getByTestId("read-only-fix")).toHaveCount(0); }
  await page.screenshot({ path: `test-results/apbm007b-o1-${expectState}-portal.png`, fullPage: true });
});

test(`OwedBook shows the ${expectState} banner`, async ({ page }) => {
  await page.route("**/api/auth/logout", (r) => r.abort());
  await page.goto(`${OB}/auth`);
  await page.getByRole("textbox", { name: "Email", exact: true }).fill(cast!.A.email);
  await page.getByPlaceholder("Please Enter password").fill(cast!.A.password);
  await page.getByRole("button", { name: /log ?in|sign in/i }).first().click();
  await page.waitForURL((u) => !u.pathname.startsWith("/auth"), { timeout: 30000 });
  await page.goto(`${OB}/owedbook`);
  const body = page.locator("body");
  if (expectState === "grace") await expect(body).toContainText("A payment didn't go through", { timeout: 30000 });
  if (expectState === "read_only") await expect(body).toContainText("This store is read-only", { timeout: 30000 });
  if (expectState === "active") { await page.waitForTimeout(3000); await expect(body).not.toContainText(/This store is read-only|A payment didn't go through/); }
  await page.screenshot({ path: `test-results/apbm007b-o1-${expectState}-owedbook.png`, fullPage: true });
});
