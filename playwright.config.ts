import { defineConfig, devices } from "@playwright/test";

// Portal FFM browser checks. The app under test is an OWNED `next start` on
// :3001 (built from the current tree); Playwright never starts or stops any
// other server. System Chrome is used (channel "chrome"); no browser download.
// Traces/videos are OFF so no signed-in state or credential ever lands in output.
const baseURL = process.env.PORTAL_BASE_URL ?? "http://localhost:3001";

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL,
    // channel is set per project (all Chrome projects name it); Firefox/WebKit projects use Playwright's own engines
    trace: "off",
    video: "off",
    screenshot: "off",
  },
  projects: [
    { name: "public", testMatch: /public\..*\.spec\.ts/, use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    { name: "gate-m-public", testMatch: /gate-m\.public\.spec\.ts/, use: { channel: "chrome" } },
    // Account specs sign in through e2e/auth.ts (real admin, in memory; logout aborted).
    { name: "account", testMatch: /account\..*\.spec\.ts/, use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    // APBM-007B engineering happy paths on the proof pair (PORTAL_BASE_URL=http://localhost:3101); cast from APBM007B_PROOF_CAST.
    { name: "apbm007b", testMatch: /apbm007b\..*\.spec\.ts/, use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    { name: "apbm007b-firefox", testMatch: /apbm007b\..*\.spec\.ts/, use: { ...devices["Desktop Firefox"] } },
    { name: "apbm007b-webkit", testMatch: /apbm007b\..*\.spec\.ts/, use: { ...devices["Desktop Safari"] } },
    // Opt-in only (PORTAL_ALLOW_LOGOUT=1): the inherited logout is a GLOBAL
    // sign-out that ends every session of the account, including the Director's.
    ...(process.env.PORTAL_ALLOW_LOGOUT === "1"
      ? [{ name: "logout", testMatch: /logout\.final\.spec\.ts/, use: { channel: "chrome" as const } }]
      : []),
  ],
});
