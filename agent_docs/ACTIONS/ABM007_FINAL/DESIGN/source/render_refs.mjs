// Renders the ABM007_FINAL design reference pages to PNG at 2x, desktop 1440 and mobile 375,
// and records horizontal overflow per load. Usage: node render_refs.mjs <DESIGN dir>
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const { chromium } = createRequire(import.meta.url)("/opt/npm-tools/node_modules/playwright");
const D = process.argv[2];
const pages = ["style-tile/style-tile.html", "samples/01-portal-sign-in.html", "samples/02-portal-register-plan.html",
  "samples/03-owedbook-dashboard.html", "samples/04-portal-dashboard.html", "samples/05-owedbook-help.html"];
const extra = [["samples/04b-portal-dashboard-menu-open.html", "mobile"]];
const VP = { desktop: { width: 1440, height: 900 }, mobile: { width: 375, height: 812 } };
mkdirSync(join(D, "renders"), { recursive: true });
const browser = await chromium.launch();
const lines = ["page | viewport | scrollWidth | overflow | Inter faces loaded | logo natural size | menu trigger visible | js errors"];
const jobs = [...pages.flatMap((p) => Object.entries(VP).map(([n]) => [p, n])), ...extra];
for (const [rel, name] of jobs) { const vp = VP[name];
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2 });
  const page = await ctx.newPage(); let errs = 0; page.on("pageerror", () => errs++);
  await page.goto("file://" + join(D, rel)); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(150);
  const sw = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth));
  const inter = await page.evaluate(() => document.fonts.check("16px Inter") && [...document.fonts].filter(f => f.status === "loaded").length);
  const logo = await page.evaluate(() => { const i = document.querySelector(".logo-tile img"); return i ? `${i.naturalWidth}x${i.naturalHeight}` : "none"; });
  const trig = await page.evaluate(() => { const b = document.querySelector(".menu-btn"); return b ? getComputedStyle(b).display !== "none" : "n/a"; });
  const out = rel.split("/").pop().replace(".html", "") + "__" + name + ".png";
  await page.screenshot({ path: join(D, "renders", out), fullPage: true });
  lines.push(`${rel} | ${name} ${vp.width} | ${sw} | ${sw <= vp.width ? "pass" : "FAIL"} | ${inter} | ${logo} | ${trig} | ${errs}`);
  await ctx.close();
}
await browser.close();
writeFileSync(join(D, "renders", "RENDER_CHECKS.txt"), lines.join("\n") + "\n");
console.log(lines.join("\n"));
