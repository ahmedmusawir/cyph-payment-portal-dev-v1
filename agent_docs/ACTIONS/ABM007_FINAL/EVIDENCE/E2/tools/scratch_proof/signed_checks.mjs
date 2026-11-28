#!/usr/bin/env node
// ABM007_FINAL E2 — signed-in engineering self-checks on the SCRATCH proof pair (claims for QA to test, never results).
// Usage (Portal root): node signed_checks.mjs <out_dir> [--phase a|b|all]
//   phase a: per-role signed-in pages in both apps (Chromium; 375 and 1440 px; dark OS + saved dark theme):
//            light from document creation, exact tokens, Inter, overflow, keyboard focus against the actual surface
//            (pixels), mobile menus, Help anchors and Help app links per role, store selector state, table width.
//   phase b: AC-F02 bounded redirect reproduction as Store admin (Chromium and WebKit; 5 fresh + 5 warm runs each),
//            following only the cross-app links the candidate offers that role.
// Only navigation and reading: no form is submitted except the sign-in itself; no button that changes data is pressed.
// Fixture email addresses are masked on screen before every screenshot and scrubbed from every recorded string.
process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/home/moose/APBM007B_REPAIR_R2/browsers'; // existing WebKit build, read-only
import { createRequire } from 'node:module'; import { mkdirSync, writeFileSync } from 'node:fs';
const PORTAL = '/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1';
const { chromium, webkit } = createRequire(`${PORTAL}/package.json`)('playwright');
const A = await import(new URL('./auth.mjs', import.meta.url));
const out = process.argv[2]; const phase = process.argv.includes('--phase') ? process.argv[process.argv.indexOf('--phase') + 1] : 'all';
mkdirSync(`${out}/shots`, { recursive: true });
const { ob: OB, pp: PP } = A.SITES;
const ANCHORS = { '--brand-navy': '#154474', '--brand-green-dark': '#288472', '--brand-ice': '#eaf3fa', '--brand-charcoal': '#393b38', '--primary': '#288472', '--heading': '#154474' };
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
let PRIVATE = [];
const clean = (s) => { let t = String(s ?? '').replace(EMAIL, (m) => (/pharmacybooks\.com$/.test(m) ? m : '[email]')); for (const p of PRIVATE) t = t.split(p).join('[name]'); return t; };
const hex = (rgb) => '#' + rgb.match(/\d+/g).slice(0, 3).map((n) => (+n).toString(16).padStart(2, '0')).join('');
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const Lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [x, y] = [Lum(a), Lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const INIT = () => {
  try { localStorage.setItem('theme', 'dark'); } catch {}
  const pb = (window.__pb = { mutations: [], frames: [], firstHtml: null });
  const snap = () => { const h = document.documentElement; return h ? { cls: h.className, scheme: h.style.colorScheme, theme: h.getAttribute('data-theme') } : null; };
  new MutationObserver((ms) => { for (const m of ms) { if (!pb.firstHtml && document.documentElement) pb.firstHtml = snap();
    if (m.type === 'attributes' && m.target === document.documentElement) pb.mutations.push(snap()); } })
    .observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'style', 'data-theme'] });
  let n = 0; const f = () => { pb.frames.push(snap()); if (++n < 4) requestAnimationFrame(f); }; requestAnimationFrame(f);
};
const mask = (page) => page.evaluate((priv) => {
  const hide = (v) => { for (const p of priv) v = v.split(p).join('[name hidden]'); return v; };
  const rx = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g; const keep = (m) => /pharmacybooks\.com$/.test(m);
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let t;
  while ((t = w.nextNode())) { const v = hide(t.nodeValue.replace(rx, (m) => (keep(m) ? m : '[email hidden]'))); if (v !== t.nodeValue) t.nodeValue = v; }
  for (const i of document.querySelectorAll('input')) { const v = hide((i.value || '').replace(rx, '[email hidden]')); if (v !== i.value) i.value = v; }
  for (const e of document.querySelectorAll('[title]')) e.setAttribute('title', hide(e.getAttribute('title').replace(rx, '[email hidden]')));
}, PRIVATE);
let helper;
async function decode(buf) {
  return helper.evaluate(async (b64) => { const img = new Image(); img.src = `data:image/png;base64,${b64}`; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
    return { w: img.width, h: img.height, d: Array.from(g.getImageData(0, 0, img.width, img.height).data) }; }, buf.toString('base64'));
}
async function probeFocus(page) {
  const vp = page.viewportSize();
  const el = await page.evaluate(() => {
    const a = document.activeElement; if (!a || a === document.body || a === document.documentElement) return null;
    let host = a; const ar = a.getBoundingClientRect(); if (ar.width <= 2 || ar.height <= 2) host = a.closest('label') || a.parentElement || a;
    const r = host.getBoundingClientRect(); const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return { label: (a.innerText || a.getAttribute('aria-label') || a.getAttribute('name') || a.tagName).trim().replace(/\s+/g, ' ').slice(0, 40),
      x: r.x, y: r.y, w: r.width, h: r.height, obscured: !!top && !(host.contains(top) || top.contains(host)), key: a.outerHTML.slice(0, 160) };
  });
  if (!el || el.w < 1 || el.h < 1) return el ? { ...el, skipped: 'zero size' } : null;
  const P = 10, x0 = Math.max(0, Math.floor(el.x) - P), y0 = Math.max(0, Math.floor(el.y) - P), x1 = Math.min(vp.width, Math.ceil(el.x + el.w) + P), y1 = Math.min(vp.height, Math.ceil(el.y + el.h) + P);
  if (x1 - x0 < 4 || y1 - y0 < 4) return { ...el, skipped: 'outside viewport' };
  const img = await decode(await page.screenshot({ clip: { x: x0, y: y0, width: x1 - x0, height: y1 - y0 } }));
  const px = (x, y) => { x = Math.round(x - x0); y = Math.round(y - y0); if (x < 0 || y < 0 || x >= img.w || y >= img.h) return null; const i = (y * img.w + x) * 4; return [img.d[i], img.d[i + 1], img.d[i + 2]]; };
  const cx = el.x + el.w / 2, cy = el.y + el.h / 2;
  const sides = { top: (d) => px(cx, el.y - d), bottom: (d) => px(cx, el.y + el.h - 1 + d), left: (d) => px(el.x - d, cy), right: (d) => px(el.x + el.w - 1 + d, cy) };
  const res = {};
  for (const [s, at] of Object.entries(sides)) { const surface = at(9) || at(8); if (!surface) { res[s] = null; continue; }
    let best = 1; for (let d = 1; d <= 6; d++) { const p = at(d); if (p) best = Math.max(best, ratio(p, surface)); } res[s] = +best.toFixed(2); }
  const avail = Object.values(res).filter((v) => v !== null), ok = avail.filter((v) => v >= 3).length;
  return { ...el, label: clean(el.label), key: undefined, sides: res, pass: !el.obscured && ok >= 2 && ok * 2 >= avail.length };
}
async function walk(page, max) {
  const seen = new Set(), probes = [];
  for (let i = 0; i < max; i++) { await page.keyboard.press('Tab');
    const k = await page.evaluate(() => document.activeElement?.outerHTML.slice(0, 160)); if (!k || seen.has(k)) break; seen.add(k);
    const p = await probeFocus(page); if (!p) break; probes.push(p); }
  return probes;
}
async function facts(page) {
  const f = await page.evaluate((anchors) => {
    const probe = (v) => { const d = document.createElement('div'); d.style.color = v; document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; };
    const tokens = {}; for (const k of Object.keys(anchors)) tokens[k] = probe(`hsl(var(${k}))`);
    const tables = [...document.querySelectorAll('table')].filter((t) => t.offsetParent).map((t) => Math.round(t.getBoundingClientRect().width));
    return { path: location.pathname, title: document.title, h1: [...document.querySelectorAll('h1')].map((h) => h.innerText.trim()).slice(0, 2),
      htmlClass: document.documentElement.className, font: getComputedStyle(document.body).fontFamily, tokens, control: probe('hsl(168 53% 34%)'),
      overflowX: document.documentElement.scrollWidth - window.innerWidth, vw: window.innerWidth, tables,
      themeControls: document.querySelectorAll("[aria-label*='theme' i], [data-testid*='theme' i]").length,
      oldName: /cyber\s*pharma/i.test(document.body.innerText + document.title), noPermitted: /no permitted stores/i.test(document.body.innerText), pb: window.__pb };
  }, ANCHORS);
  f.tokens = Object.fromEntries(Object.entries(f.tokens).map(([k, v]) => [k, hex(v)])); f.tokenMismatches = Object.entries(ANCHORS).filter(([k, v]) => f.tokens[k] !== v).map(([k]) => k);
  f.controlFlagged = hex(f.control) !== ANCHORS['--primary'];
  f.darkEver = [f.pb?.firstHtml, ...(f.pb?.mutations ?? []), ...(f.pb?.frames ?? [])].filter(Boolean).some((s) => /\bdark\b/.test(s.cls || '') || s.scheme === 'dark' || s.theme === 'dark');
  delete f.pb; delete f.control; f.h1 = f.h1.map(clean); f.title = clean(f.title); return f;
}
const R = { started: new Date().toISOString(), served: null, pages: [], help: [], menus: [], selector: [], redirect: [], errors: [] };
const shot = async (page, name, full = true) => { await mask(page); await page.screenshot({ path: `${out}/shots/${name}.png`, fullPage: full }); };

async function phaseA(browser) {
  const OB_ROLES = { ENGINEERING_OWNER_A: 'owner', ENGINEERING_ADMIN: 'store_admin', ENGINEERING_MEMBER: 'member' };
  for (const [role, label] of Object.entries(OB_ROLES)) for (const app of ['ob', 'pp']) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' }); await ctx.addInitScript(INIT);
    const page = await ctx.newPage();
    try {
      const method = await A.signIn(page, app, role);
      const site = app === 'ob' ? OB : PP;
      let routes = app === 'ob' ? ['/owedbook', '/help', '/profile', '/invitations', '/admin-portal'] : ['/dashboard', '/billing', '/stores/add'];
      if (app === 'ob') { // admin sub-pages as the sidebar offers them to this role
        await page.goto(`${site}/admin-portal`, { waitUntil: 'networkidle' });
        if (new URL(page.url()).pathname.startsWith('/admin-portal')) {
          const hrefs = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href^="/admin-portal"]')].map((a) => a.getAttribute('href')))]);
          const store = hrefs.find((h) => /^\/admin-portal\/stores\/[^/]+$/.test(h));
          routes.push(...hrefs.filter((h) => /^\/admin-portal\/(billing|settings|audit)$/.test(h)), ...(store ? [store, `${store}/invite`] : []));
        }
      }
      routes = [...new Set(routes)];
      for (const width of [1440, 375]) {
        await page.setViewportSize({ width, height: 900 });
        for (const r of routes) {
          const res = await page.goto(`${site}${r}`, { waitUntil: 'networkidle' });
          const f = await facts(page); const focus = await walk(page, 16);
          const name = `${app}_${label}_${r.replace(/\/[0-9a-f-]{20,}/g, '/ID').replace(/\//g, '_')}_${width}`;
          await shot(page, name);
          R.pages.push({ app, role: label, method, route: r.replace(/[0-9a-f-]{20,}/g, 'ID'), width, status: res?.status(), landed: f.path.replace(/[0-9a-f-]{20,}/g, 'ID'), ...f, focus });
        }
        // Responsive navigation: open the menu from the keyboard and walk it.
        if (width === 375) {
          await page.goto(`${site}${app === 'ob' ? '/help' : '/dashboard'}`, { waitUntil: 'networkidle' });
          const trig = app === 'ob' ? 'header button[aria-label="Open menu"]' : '[data-testid="menu-trigger"]';
          await page.focus(trig); await page.keyboard.press('Enter'); await page.waitForTimeout(400);
          const items = await page.evaluate((a) => [...document.querySelectorAll(a === 'ob' ? 'header [role="dialog"] a, header [role="dialog"] button' : '[role="dialog"] a, [role="dialog"] button')].map((e) => e.innerText.trim()).filter(Boolean), app);
          const focus = await walk(page, 10); await shot(page, `menu_${app}_${label}_375`, false);
          R.menus.push({ app, role: label, items: items.map(clean), focus });
          await page.keyboard.press('Escape');
        }
      }
      if (app === 'ob') {
        // AC-F01: the store selector on the OwedBook page.
        await page.setViewportSize({ width: 1440, height: 900 }); await page.goto(`${OB}/owedbook`, { waitUntil: 'networkidle' });
        R.selector.push({ role: label, ...(await page.evaluate(() => { const s = document.querySelector('select'); const opts = s ? [...s.options].map((o) => o.text) : [];
          return { selectFound: !!s, optionCount: opts.length, placeholderShown: opts.some((t) => /no permitted stores/i.test(t)) || /no permitted stores/i.test(document.body.innerText), selectable: opts.filter((t) => !/no permitted stores|select/i.test(t)).length }; })) });
        // AC-H01 / AC-H03: Help anchors and the two app links, as this role.
        await page.goto(`${OB}/help`, { waitUntil: 'networkidle' });
        const toc = await page.$$eval('nav[aria-label="On this page"] a', (as) => as.map((a) => a.getAttribute('href')));
        const anchors = [];
        for (const h of toc) { await page.click(`nav[aria-label="On this page"] a[href="${h}"]`); await page.waitForTimeout(150);
          anchors.push(await page.evaluate((id) => { const s = document.getElementById(id.slice(1)); const r = s?.getBoundingClientRect(); return { href: id, hash: location.hash === id, inView: !!r && r.top >= -2 && r.top < window.innerHeight }; }, h)); }
        const appLinks = [];
        for (const href of ['/admin-portal', '/admin-portal/billing']) {
          await page.goto(`${OB}/help`, { waitUntil: 'networkidle' });
          await page.click(`main a[href="${href}"]`);
          // Wait for client navigation and any guard redirect to settle: the path must be unchanged across 1.5 s.
          let last = '', same = 0; for (let i = 0; i < 40 && same < 3; i++) { await page.waitForTimeout(500); const p = new URL(page.url()).pathname; same = p === last ? same + 1 : 0; last = p; }
          await page.waitForLoadState('networkidle');
          const seen = await page.evaluate(() => ({ path: location.pathname, h1: [...document.querySelectorAll('h1,h2')].slice(0, 2).map((h) => h.innerText.trim()), error: /something went wrong|application error|500/i.test(document.body.innerText) }));
          await shot(page, `help_link_${label}${href.replace(/\//g, '_')}`, false);
          appLinks.push({ href, landed: seen.path, headings: seen.h1.map(clean), errorPage: seen.error });
        }
        R.help.push({ role: label, tocLinks: toc.length, anchorsOk: anchors.filter((a) => a.hash && a.inView).length, anchors, appLinks });
      }
    } catch (e) { R.errors.push({ phase: 'a', app, role: label, error: clean(String(e.message).slice(0, 200)) }); }
    await ctx.close();
  }
}

// AC-F02 route, using only links the candidate offers a Store admin (an OwedBook -> Account & Billing link is not offered to
// this role on any OwedBook page; recorded by the link inventory). Per iteration: on Account & Billing, "Open OwedBook" (the
// real handoff), then My Stores and Billing via the sidebar, then back to Account & Billing. A landing on either sign-in
// page is the defect signal.
async function routeIteration(page, steps) {
  const step = async (what, fn) => { let error;
    try { await fn(); } catch (e) { error = clean(String(e.message).split('\n')[0].replace(/[?&](code|token_hash|state)=[^&\s"]+/g, '&$1=[redacted]').slice(0, 300)); }
    // After an interruption, record where the page actually settled (an interrupting navigation is itself evidence).
    try { await page.waitForLoadState('networkidle', { timeout: 15000 }); } catch { /* keep going */ }
    const u = new URL(page.url()); steps.push({ what, landed: `${u.port}${u.pathname}`.replace(/[0-9a-f-]{20,}/g, 'ID'), ...(error ? { error } : {}) }); };
  await step('PP /dashboard', () => page.goto(`${PP}/dashboard`));
  const open = page.locator('a[href*="/api/handoff/start"]').first();
  if (!(await open.count())) { steps.push({ what: 'Open OwedBook', note: 'not offered on the landed page' }); return; }
  await step('click Open OwedBook (handoff)', () => Promise.all([page.waitForURL(/:3100\/(?!api\/)/, { timeout: 30000 }), open.click()]));
  await step('sidebar My Stores', () => page.goto(`${OB}/admin-portal`));
  const bill = page.locator('a[href="/admin-portal/billing"]').first();
  if (await bill.count()) await step('click sidebar Billing', () => Promise.all([page.waitForURL(/\/admin-portal\/billing/, { timeout: 20000 }), bill.click()]));
  else steps.push({ what: 'sidebar Billing', note: 'not offered' });
  const toPortal = await page.locator('a[href*=":3101"], a[href*="/api/handoff"]').count();
  steps.push({ what: 'OwedBook links into Account & Billing on Billing', note: `${toPortal} offered` });
}
async function phaseB() {
  for (const [name, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = name === 'chromium' ? await type.launch({ channel: 'chrome' }) : await type.launch();
    try {
      for (let run = 1; run <= 5; run++) { const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage(); const steps = [];
        try { await A.signIn(page, 'pp', 'ENGINEERING_ADMIN'); await routeIteration(page, steps); } catch (e) { steps.push({ what: 'sign-in', error: clean(String(e.message).slice(0, 160)) }); }
        R.redirect.push({ browser: name, mode: 'fresh', run, steps, sentToPortalSignIn: steps.some((s) => /^3101\/login/.test(s.landed || '')), sentToOwedBookSignIn: steps.some((s) => /^3100\/auth(\/|$)/.test(s.landed || '')) });
        await ctx.close(); }
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
      let signed = true; try { await A.signIn(page, 'pp', 'ENGINEERING_ADMIN'); } catch (e) { signed = false; R.errors.push({ phase: 'b', browser: name, mode: 'warm', error: clean(String(e.message).slice(0, 160)) }); }
      for (let run = 1; signed && run <= 5; run++) { const steps = []; await routeIteration(page, steps);
        R.redirect.push({ browser: name, mode: 'warm', run, steps, sentToPortalSignIn: steps.some((s) => /^3101\/login/.test(s.landed || '')), sentToOwedBookSignIn: steps.some((s) => /^3100\/auth(\/|$)/.test(s.landed || '')) }); }
      await ctx.close();
    } finally { await browser.close(); }
  }
}

const browser = await chromium.launch({ channel: 'chrome' }); helper = await (await browser.newContext()).newPage();
try {
  await A.assertServedScratch('ob'); await A.assertServedScratch('pp'); R.served = A.servedReport(); PRIVATE = await A.privateStrings();
  if (phase === 'a' || phase === 'all') await phaseA(browser);
  if (phase === 'b' || phase === 'all') await phaseB();
} catch (e) { R.errors.push({ phase: 'setup', error: clean(String(e.message).slice(0, 200)) }); }
await browser.close();
R.finished = new Date().toISOString(); R.counters = A.counters;
writeFileSync(`${out}/signed_checks.json`, JSON.stringify(R, null, 1));
const fl = (ps) => ps.filter((p) => p && !p.skipped && !p.pass).map((p) => `${p.label}${p.obscured ? '{OBSCURED}' : ''}[${Object.values(p.sides).filter((v) => v !== null).join('/')}]`);
for (const p of R.pages) console.log(`PAGE ${p.app} ${p.role} ${p.width} ${p.status} ${p.route} -> ${p.landed} dark=${p.darkEver} ovf=${p.overflowX} tok=${p.tokenMismatches.length} ctrl=${p.controlFlagged} font=${p.font.slice(0, 5)} old=${p.oldName} theme=${p.themeControls} tables=${JSON.stringify(p.tables)} focus=${p.focus.filter((x) => x.pass).length}/${p.focus.filter((x) => !x.skipped).length} fail=${JSON.stringify(fl(p.focus))}`);
for (const m of R.menus) console.log(`MENU ${m.app} ${m.role} items=${JSON.stringify(m.items)} focus=${m.focus.filter((x) => x.pass).length}/${m.focus.filter((x) => !x.skipped).length} fail=${JSON.stringify(fl(m.focus))}`);
for (const s of R.selector) console.log(`SELECTOR ${JSON.stringify(s)}`);
for (const h of R.help) console.log(`HELP ${h.role} toc=${h.tocLinks} anchorsOk=${h.anchorsOk} links=${JSON.stringify(h.appLinks)}`);
for (const r of R.redirect) console.log(`REDIRECT ${r.browser} ${r.mode} ${r.run} portalSignIn=${r.sentToPortalSignIn} obSignIn=${r.sentToOwedBookSignIn} ${r.steps.map((s) => `${s.what}=>${s.landed ?? s.note}${s.error ? ` {ERROR ${s.error}}` : ''}`).join(' | ')}`);
console.log(`ERRORS ${JSON.stringify(R.errors)}`); console.log(`COUNTERS ${JSON.stringify(R.counters)} SERVED ${JSON.stringify(R.served)}`);
