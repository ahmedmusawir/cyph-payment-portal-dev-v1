// ABM007_FINAL engineering rendered self-checks (claims for QA to test, never results). Public pages only:
// signed-in screens need SCRATCH fixtures, which were not available (ruling AM-08 (5)).
// Usage: node rendered_checks.cjs <out_dir>   (run with Playwright resolvable; Chrome channel)
const { chromium } = require("playwright");
const out = process.argv[2];
const PAGES = [
  ["ob", "http://localhost:3300/"], ["ob", "http://localhost:3300/auth"], ["ob", "http://localhost:3300/auth/link-expired"],
  ["ob", "http://localhost:3300/auth/signed-out"], ["ob", "http://localhost:3300/auth/sign-in-to-continue"], ["ob", "http://localhost:3300/nope-404"],
  ["pp", "http://localhost:3301/login"], ["pp", "http://localhost:3301/register/plan"], ["pp", "http://localhost:3301/register/owner"],
  ["pp", "http://localhost:3301/register/pharmacy"], ["pp", "http://localhost:3301/register/review"], ["pp", "http://localhost:3301/auth/link-expired"],
  ["pp", "http://localhost:3301/nope-404"],
];
const ANCHORS = { "--brand-navy": "#154474", "--brand-green": "#32a38d", "--brand-green-dark": "#288472", "--brand-ice": "#eaf3fa", "--brand-charcoal": "#393b38", "--brand-gray": "#515151", "--primary": "#288472", "--heading": "#154474" };
const hex = (rgb) => "#" + rgb.match(/\d+/g).slice(0, 3).map((n) => (+n).toString(16).padStart(2, "0")).join("");
(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const results = [];
  for (const width of [375, 1440]) {
    // Dark OS preference and a saved dark theme: light must still win, including first paint.
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: "dark" });
    await ctx.addInitScript(() => { try { localStorage.setItem("theme", "dark"); } catch {} });
    const page = await ctx.newPage();
    for (const [app, url] of PAGES) {
      const res = await page.goto(url, { waitUntil: "networkidle" });
      const r = await page.evaluate((anchors) => {
        const probe = (val) => { const d = document.createElement("div"); d.style.color = val; document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; };
        const tokens = {}; for (const k of Object.keys(anchors)) tokens[k] = probe(`hsl(var(${k}))`);
        const control = probe("hsl(168 53% 34%)");   // the rounded triplet: must NOT equal #288472
        const btns = [...document.querySelectorAll("button, a[class*='bg-primary']")].filter((b) => b.offsetParent && b.getBoundingClientRect().width > 0);
        const small = btns.filter((b) => b.getBoundingClientRect().height < 44 && !b.closest("label") && !(b.getAttribute("aria-label") || "").match(/password/i)).map((b) => (b.innerText || b.getAttribute("aria-label") || "").trim().slice(0, 30));
        const upper = btns.filter((b) => getComputedStyle(b).textTransform === "uppercase").length;
        return {
          title: document.title, htmlClass: document.documentElement.className, colorScheme: document.documentElement.style.colorScheme,
          bodyBg: getComputedStyle(document.body).backgroundColor, font: getComputedStyle(document.body).fontFamily,
          overflowX: document.documentElement.scrollWidth - window.innerWidth, tokens, control,
          themeControls: document.querySelectorAll("[aria-label*='theme' i], [data-testid*='theme' i]").length,
          oldName: /cyber\s*pharma/i.test(document.body.innerText + document.title), smallButtons: small, uppercaseButtons: upper,
          logoTiles: document.querySelectorAll("[data-testid='brand-logo-tile'] img").length,
          logoSrc: [...document.querySelectorAll("[data-testid='brand-logo-tile'] img")].map((i) => i.getAttribute("src")).slice(0, 1),
          h1: [...document.querySelectorAll("h1")].map((h) => h.innerText.trim()),
        };
      }, ANCHORS);
      r.tokens = Object.fromEntries(Object.entries(r.tokens).map(([k, v]) => [k, hex(v)])); r.control = hex(r.control);
      r.tokenMismatches = Object.entries(ANCHORS).filter(([k, v]) => r.tokens[k] !== v).map(([k]) => k);
      r.controlFlagged = r.control !== ANCHORS["--brand-green-dark"];
      const name = `${app}_${new URL(url).pathname.replace(/\//g, "_") || "_root"}_${width}`;
      await page.screenshot({ path: `${out}/shots/${name}.png`, fullPage: true });
      results.push({ app, url, width, status: res.status(), ...r });
    }
    await ctx.close();
  }
  await browser.close();
  require("fs").writeFileSync(`${out}/rendered_checks.json`, JSON.stringify(results, null, 1));
  for (const r of results) console.log(`${r.width} ${r.status} ${r.url} dark=${/\bdark\b/.test(r.htmlClass)} bg=${hex(r.bodyBg)} ovf=${r.overflowX} tokMis=${r.tokenMismatches.length} ctrl=${r.controlFlagged} theme=${r.themeControls} old=${r.oldName} small=${JSON.stringify(r.smallButtons)} upper=${r.uppercaseButtons} logo=${r.logoTiles} font=${r.font.slice(0, 24)} h1=${JSON.stringify(r.h1)}`);
})().catch((e) => { console.error(e); process.exit(1); });
