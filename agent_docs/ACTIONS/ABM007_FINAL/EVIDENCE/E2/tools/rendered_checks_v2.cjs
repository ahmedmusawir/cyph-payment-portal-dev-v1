// ABM007_FINAL E2 completion: engineering rendered self-checks (claims for QA to test, never results).
// Public pages of both built apps, plus the real Help and signed-in Navbar markup (rendered by a scratch-only jsdom
// harness with a fictional identity) placed on a served OwedBook page so the built stylesheet and Inter apply.
// Signed-in routes themselves are not reachable here (no designated SCRATCH fixture; ruling AM-08 (5)).
// Usage: node rendered_checks_v2.cjs <out_dir> <harness_dir>      (Playwright resolvable; Chrome channel)
const { chromium } = require("playwright");
const fs = require("fs");
const [out, harness] = process.argv.slice(2);
fs.mkdirSync(`${out}/shots`, { recursive: true });
const OB = "http://localhost:3300", PP = "http://localhost:3301";
const PAGES = [
  ["ob", `${OB}/`], ["ob", `${OB}/auth`], ["ob", `${OB}/auth/link-expired`], ["ob", `${OB}/auth/signed-out`],
  ["ob", `${OB}/auth/sign-in-to-continue`], ["ob", `${OB}/nope-404`],
  ["pp", `${PP}/login`], ["pp", `${PP}/register/plan`], ["pp", `${PP}/register/owner`], ["pp", `${PP}/auth/link-expired`],
  ["pp", `${PP}/nope-404`],
];
const ANCHORS = { "--brand-navy": "#154474", "--brand-green": "#32a38d", "--brand-green-dark": "#288472", "--brand-ice": "#eaf3fa", "--brand-charcoal": "#393b38", "--brand-gray": "#515151", "--primary": "#288472", "--heading": "#154474" };
const hex = (rgb) => "#" + rgb.match(/\d+/g).slice(0, 3).map((n) => (+n).toString(16).padStart(2, "0")).join("");
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// Theme state from document creation: every attribute change on <html>, and the state at the first frames.
const INIT = () => {
  try { localStorage.setItem("theme", "dark"); } catch {}
  const pb = (window.__pb = { mutations: [], frames: [], firstHtml: null });
  const snap = () => { const h = document.documentElement; return h ? { cls: h.className, scheme: h.style.colorScheme, theme: h.getAttribute("data-theme") } : null; };
  new MutationObserver((ms) => { for (const m of ms) {
    if (!pb.firstHtml && document.documentElement) pb.firstHtml = { t: performance.now(), ...snap() };
    if (m.type === "attributes" && m.target === document.documentElement) pb.mutations.push({ t: performance.now(), attr: m.attributeName, ...snap() });
  } }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "style", "data-theme"] });
  let n = 0;
  const f = () => { const b = document.body; pb.frames.push({ t: performance.now(), ...snap(), bodyBg: b ? getComputedStyle(b).backgroundColor : null }); if (++n < 4) requestAnimationFrame(f); };
  requestAnimationFrame(f);
};

async function decode(helper, buf) {
  return helper.evaluate(async (b64) => {
    const img = new Image(); img.src = `data:image/png;base64,${b64}`; await img.decode();
    const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
    const g = c.getContext("2d"); g.drawImage(img, 0, 0);
    return { w: img.width, h: img.height, d: Array.from(g.getImageData(0, 0, img.width, img.height).data) };
  }, buf.toString("base64"));
}

// Measure the focus indicator of the active element against the surface beside it, on each side, from pixels.
async function probeFocus(page, helper, vw, vh) {
  const el = await page.evaluate(() => {
    const a = document.activeElement; if (!a || a === document.body || a === document.documentElement) return null;
    // A visually hidden control (sr-only radio) shows its focus on the visible card that contains it.
    let host = a; const ar = a.getBoundingClientRect();
    if (ar.width <= 2 || ar.height <= 2) host = a.closest("label") || a.parentElement || a;
    const r = host.getBoundingClientRect(), cs = getComputedStyle(host);
    // Focus not obscured: the topmost element at the control's centre must be the control or inside it.
    const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    const obscured = !!top && !(host.contains(top) || top.contains(host));
    return { label: (a.innerText || a.getAttribute("aria-label") || a.getAttribute("placeholder") || a.id || a.tagName).trim().replace(/\s+/g, " ").slice(0, 40),
      tag: a.tagName.toLowerCase(), host: host === a ? null : host.tagName.toLowerCase(), obscured, x: r.x, y: r.y, w: r.width, h: r.height, fv: a.matches(":focus-visible"),
      outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`, ring: cs.boxShadow !== "none",
      key: a.outerHTML.slice(0, 120) };
  });
  if (!el || el.w < 1 || el.h < 1) return el ? { ...el, skipped: "zero size" } : null;
  const P = 10, x0 = Math.max(0, Math.floor(el.x) - P), y0 = Math.max(0, Math.floor(el.y) - P);
  const x1 = Math.min(vw, Math.ceil(el.x + el.w) + P), y1 = Math.min(vh, Math.ceil(el.y + el.h) + P);
  if (x1 - x0 < 4 || y1 - y0 < 4) return { ...el, skipped: "outside viewport" };
  const img = await decode(helper, await page.screenshot({ clip: { x: x0, y: y0, width: x1 - x0, height: y1 - y0 } }));
  const px = (x, y) => { x = Math.round(x - x0); y = Math.round(y - y0); if (x < 0 || y < 0 || x >= img.w || y >= img.h) return null; const i = (y * img.w + x) * 4; return [img.d[i], img.d[i + 1], img.d[i + 2]]; };
  const cx = el.x + el.w / 2, cy = el.y + el.h / 2;
  const sides = {
    top: (d) => px(cx, el.y - d), bottom: (d) => px(cx, el.y + el.h - 1 + d),
    left: (d) => px(el.x - d, cy), right: (d) => px(el.x + el.w - 1 + d, cy),
  };
  const res = {};
  for (const [s, at] of Object.entries(sides)) {
    const surface = at(9) || at(8);
    if (!surface) { res[s] = null; continue; }
    let best = 1, ring = null;
    for (let d = 1; d <= 6; d++) { const p = at(d); if (p) { const r = ratio(p, surface); if (r > best) { best = r; ring = p; } } }
    res[s] = { contrast: +best.toFixed(2), ring: ring && "#" + ring.map((n) => n.toString(16).padStart(2, "0")).join(""), surface: "#" + surface.map((n) => n.toString(16).padStart(2, "0")).join("") };
  }
  const avail = Object.values(res).filter(Boolean), ok = avail.filter((v) => v.contrast >= 3).length;
  return { ...el, sides: res, sidesOk: ok, sidesMeasured: avail.length, pass: !el.obscured && ok >= 2 && ok * 2 >= avail.length };
}

async function walk(page, helper, vw, vh, max, startKey) {
  const seen = [], probes = [];
  for (let i = 0; i < max; i++) {
    await page.keyboard.press("Tab");
    const p = await probeFocus(page, helper, vw, vh);
    if (!p) break;
    if (seen.includes(p.key)) break;
    seen.push(p.key); probes.push(p);
  }
  return probes;
}

async function pageFacts(page) {
  return page.evaluate((anchors) => {
    const probe = (val) => { const d = document.createElement("div"); d.style.color = val; document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; };
    const tokens = {}; for (const k of Object.keys(anchors)) tokens[k] = probe(`hsl(var(${k}))`);
    return { title: document.title, htmlClass: document.documentElement.className, bodyBg: getComputedStyle(document.body).backgroundColor,
      font: getComputedStyle(document.body).fontFamily, fontsLoaded: [...document.fonts].filter((f) => f.status === "loaded").map((f) => `${f.family} ${f.weight}`),
      overflowX: document.documentElement.scrollWidth - window.innerWidth, tokens, control: probe("hsl(168 53% 34%)"),
      themeControls: document.querySelectorAll("[aria-label*='theme' i], [data-testid*='theme' i]").length,
      oldName: /cyber\s*pharma/i.test(document.body.innerText + document.title), pb: window.__pb };
  }, ANCHORS);
}

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const helperCtx = await browser.newContext(); const helper = await helperCtx.newPage();
  const R = { pages: [], noJs: [], focusControl: [], menus: [], harness: [] };
  for (const width of [375, 1440]) {
    const vh = 900;
    const ctx = await browser.newContext({ viewport: { width, height: vh }, colorScheme: "dark" });
    await ctx.addInitScript(INIT);
    const page = await ctx.newPage();

    // Seeded failing control for the focus probe: a white ring forced onto a white surface must be flagged.
    await page.goto(`${PP}/login`, { waitUntil: "networkidle" });
    await page.evaluate(() => { const w = document.createElement("div"); w.style.cssText = "position:fixed;top:120px;left:20px;z-index:99;background:#fff;padding:24px";
      w.innerHTML = '<div class="pb-on-dark"><button id="pb-focus-control" style="background:#fff;color:#000;border:0;padding:8px">Control</button></div>'; document.body.prepend(w); });
    await page.keyboard.press("Tab");
    R.focusControl.push({ width, ...(await probeFocus(page, helper, width, vh)) });

    for (const [app, url] of PAGES) {
      const res = await page.goto(url, { waitUntil: "networkidle" });
      const f = await pageFacts(page);
      f.tokens = Object.fromEntries(Object.entries(f.tokens).map(([k, v]) => [k, hex(v)])); f.control = hex(f.control);
      f.tokenMismatches = Object.entries(ANCHORS).filter(([k, v]) => f.tokens[k] !== v).map(([k]) => k);
      f.controlFlagged = f.control !== ANCHORS["--brand-green-dark"];
      f.darkEver = [f.pb.firstHtml, ...f.pb.mutations, ...f.pb.frames].filter(Boolean).some((s) => /\bdark\b/.test(s.cls || "") || s.scheme === "dark" || s.theme === "dark");
      const focus = await walk(page, helper, width, vh, 14);
      const name = `${app}_${new URL(url).pathname.replace(/\//g, "_") || "_root"}_${width}`;
      await page.screenshot({ path: `${out}/shots/${name}.png`, fullPage: true });
      R.pages.push({ app, url, width, status: res.status(), ...f, focus });
    }

    // Responsive menus (public): open with the keyboard modality, then walk the open menu.
    if (width === 375) {
      for (const [app, url, trigger] of [["ob", `${OB}/`, "button[aria-label='Open menu']"], ["pp", `${PP}/login`, "[data-testid='menu-trigger']"], ["pp", `${PP}/register/plan`, "[data-testid='menu-trigger']"]]) {
        await page.goto(url, { waitUntil: "networkidle" });
        await page.focus(trigger); await page.keyboard.press("Enter"); await page.waitForTimeout(400);
        const focus = await walk(page, helper, width, vh, 8);
        await page.screenshot({ path: `${out}/shots/menu_${app}_${new URL(url).pathname.replace(/\//g, "_") || "_root"}_375.png` });
        R.menus.push({ app, url, focus });
      }
    }

    // Help and the signed-in Navbar: real component markup (fictional identity) on a served page with the built CSS.
    for (const variant of ["help_closed", "help_menu_open"]) {
      if (variant === "help_menu_open" && width !== 375) continue;
      await page.goto(`${OB}/auth/signed-out`, { waitUntil: "networkidle" });
      const html = fs.readFileSync(`${harness}/${variant}.html`, "utf8");
      await page.evaluate((h) => { document.body.innerHTML = h; window.scrollTo(0, 0); }, html);
      await page.waitForTimeout(200);
      const facts = await page.evaluate(() => {
        const vis = (sel) => { const e = document.querySelector(sel); return !!e && getComputedStyle(e).display !== "none" && e.getBoundingClientRect().height > 0; };
        const list = document.querySelector("[data-testid='help-roles-stacked']");
        return { overflowX: document.documentElement.scrollWidth - window.innerWidth,
          tableShown: vis("[data-testid='help-roles-table']"), stackedShown: vis("[data-testid='help-roles-stacked']"),
          stackedItems: list ? list.querySelectorAll("li").length : 0,
          widest: Math.max(...[...document.querySelectorAll("main *")].map((e) => e.getBoundingClientRect().right)) - window.innerWidth,
          font: getComputedStyle(document.body).fontFamily };
      });
      const focus = await walk(page, helper, width, vh, variant === "help_menu_open" ? 12 : 24);
      await page.screenshot({ path: `${out}/shots/harness_${variant}_${width}.png`, fullPage: variant === "help_closed" });
      R.harness.push({ variant, width, ...facts, focus });
    }
    await ctx.close();

    // No-script paint: what the server HTML and CSS show before any script runs (dark OS, saved dark theme).
    const nj = await browser.newContext({ viewport: { width, height: vh }, colorScheme: "dark", javaScriptEnabled: false });
    const np = await nj.newPage();
    for (const [app, url] of PAGES) {
      const res = await np.goto(url, { waitUntil: "load" });
      const f = await np.evaluate(() => ({ htmlClass: document.documentElement.className, scheme: document.documentElement.style.colorScheme, bodyBg: getComputedStyle(document.body).backgroundColor }));
      R.noJs.push({ app, url, width, status: res.status(), ...f, bodyBg: hex(f.bodyBg), dark: /\bdark\b/.test(f.htmlClass) || f.scheme === "dark" });
    }
    await nj.close();
  }
  await browser.close();
  fs.writeFileSync(`${out}/rendered_checks_v2.json`, JSON.stringify(R, null, 1));
  const fl = (ps) => ps.filter((p) => p && !p.skipped && !p.pass).map((p) => `${p.label}${p.obscured ? "{OBSCURED}" : ""}[${Object.values(p.sides).filter(Boolean).map((s) => s.contrast).join("/")}]`);
  for (const p of R.pages) console.log(`PAGE ${p.width} ${p.status} ${p.url} darkEver=${p.darkEver} bg=${hex(p.bodyBg)} ovf=${p.overflowX} tokMis=${p.tokenMismatches.length} ctrl=${p.controlFlagged} theme=${p.themeControls} old=${p.oldName} font=${p.font.slice(0, 22)} focus=${p.focus.filter((x) => x.pass).length}/${p.focus.filter((x) => !x.skipped).length} fail=${JSON.stringify(fl(p.focus))}`);
  for (const m of R.menus) console.log(`MENU ${m.url} focus=${m.focus.filter((x) => x.pass).length}/${m.focus.filter((x) => !x.skipped).length} items=${JSON.stringify(m.focus.map((x) => x.label))} fail=${JSON.stringify(fl(m.focus))}`);
  for (const h of R.harness) console.log(`HARNESS ${h.variant} ${h.width} ovf=${h.overflowX} widest=${h.widest.toFixed(1)} table=${h.tableShown} stacked=${h.stackedShown}(${h.stackedItems}) focus=${h.focus.filter((x) => x.pass).length}/${h.focus.filter((x) => !x.skipped).length} fail=${JSON.stringify(fl(h.focus))}`);
  for (const c of R.focusControl) console.log(`CONTROL ${c.width} ${c.label} pass=${c.pass} sides=${JSON.stringify(Object.values(c.sides || {}).map((s) => s && s.contrast))}`);
  for (const n of R.noJs) console.log(`NOJS ${n.width} ${n.status} ${n.url} dark=${n.dark} bg=${n.bodyBg} class="${n.htmlClass.slice(0, 40)}"`);
})().catch((e) => { console.error(e); process.exit(1); });
