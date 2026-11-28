#!/usr/bin/env node
// ABM007_FINAL RWO-01 — engineering measurements for repair items R-01 to R-09 on the SCRATCH proof pair
// (OwedBook 3100, Portal 3101). Claims for QA to test, never results.
// Usage (Portal root): node measure.mjs <out_dir> <label> [--public-only]
// Reuses ../../E2/tools/scratch_proof/auth.mjs unchanged: SCRATCH is verified from the listening server process before
// any sign-in, fixtures come from the allowlist, and no credential, token, cookie or session state is written anywhere.
// Only navigation and reading. No form is submitted except sign-in. No button that changes data is pressed.
// Sign-in sessions per full run: 3 (OwedBook Owner A in Chromium and in WebKit; Portal Owner A in Chromium).
process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/home/moose/APBM007B_REPAIR_R2/browsers'; // existing WebKit build, read-only
import { createRequire } from 'node:module'; import { mkdirSync, writeFileSync } from 'node:fs';
const PORTAL = '/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1';
const { chromium, webkit } = createRequire(`${PORTAL}/package.json`)('playwright');
const A = await import(new URL('../../E2/tools/scratch_proof/auth.mjs', import.meta.url));
const out = process.argv[2], label = process.argv[3]; const publicOnly = process.argv.includes('--public-only');
if (!out || !label) { console.error('usage: measure.mjs <out_dir> <label> [--public-only]'); process.exit(2); }
mkdirSync(`${out}/shots_${label}`, { recursive: true });
const { ob: OB, pp: PP } = A.SITES;
const ROLE = 'ENGINEERING_OWNER_A';
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
let PRIVATE = [];
const clean = (s) => { let t = String(s ?? '').replace(EMAIL, (m) => (/pharmacybooks\.com$/.test(m) ? m : '[email]')); for (const p of PRIVATE) t = t.split(p).join('[name]'); return t; };
const deepClean = (o) => JSON.parse(clean(JSON.stringify(o)));
const mask = (page) => page.evaluate((priv) => {
  const hide = (v) => { for (const p of priv) v = v.split(p).join('[name hidden]'); return v; };
  const rx = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g; const keep = (m) => /pharmacybooks\.com$/.test(m);
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let t;
  while ((t = w.nextNode())) { const v = hide(t.nodeValue.replace(rx, (m) => (keep(m) ? m : '[email hidden]'))); if (v !== t.nodeValue) t.nodeValue = v; }
  for (const i of document.querySelectorAll('input')) { const v = hide((i.value || '').replace(rx, '[email hidden]')); if (v !== i.value) i.value = v; }
  for (const e of document.querySelectorAll('[title]')) e.setAttribute('title', hide(e.getAttribute('title').replace(rx, '[email hidden]')));
}, PRIVATE);

// Helpers installed in every page (measurement only).
const HELPERS = () => {
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const parse = (s) => { const m = (s || '').match(/[\d.]+/g) || []; return { rgb: m.slice(0, 3).map(Number), a: m.length > 3 ? Number(m[3]) : 1 }; };
  const behind = (el) => { for (let p = el.parentElement; p; p = p.parentElement) { const c = parse(getComputedStyle(p).backgroundColor); if (c.a > 0 && c.rgb.length === 3) return c.rgb; } return [255, 255, 255]; };
  const blend = (top, a, under) => top.map((v, i) => v * a + under[i] * (1 - a));
  const r1 = (n) => Math.round(n * 100) / 100;
  window.__m = {
    overflow() {
      const d = document.documentElement; window.scrollTo(300, 0); const x = window.scrollX; window.scrollTo(0, 0);
      return { scrollWidth: d.scrollWidth, clientWidth: d.clientWidth, overflow_px: d.scrollWidth - d.clientWidth, page_scrolled_sideways_px: x };
    },
    lines(el) { const r = document.createRange(); r.selectNodeContents(el); const tops = new Set(); for (const c of r.getClientRects()) if (c.width > 0.5) tops.add(Math.round(c.top)); return tops.size; },
    textRight(el) { const r = document.createRange(); r.selectNodeContents(el); let mx = -Infinity, mn = Infinity; for (const c of r.getClientRects()) { mx = Math.max(mx, c.right); mn = Math.min(mn, c.left); } return { text_left: r1(mn), text_right: r1(mx) }; },
    box(el) {
      if (!el) return null;
      const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
      return { tag: el.tagName, text: (el.innerText || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 60), left: r1(r.left), right: r1(r.right), top: r1(r.top),
        width: r1(r.width), height: r1(r.height), radius: cs.borderTopLeftRadius, font_size: cs.fontSize, weight: cs.fontWeight, color: cs.color, background: cs.backgroundColor,
        underline: cs.textDecorationLine, opacity: cs.opacity, lines: window.__m.lines(el), aria_busy: el.getAttribute('aria-busy'), disabled: el.disabled === true, visible: r.width > 0 && r.height > 0 };
    },
    // A faded field (opacity below 1) fades its text and its background together over whatever is behind it.
    contrast(el) {
      const cs = getComputedStyle(el), op = Number(cs.opacity), under = behind(el);
      const bgc = parse(cs.backgroundColor); const bg0 = bgc.a > 0 ? blend(bgc.rgb, bgc.a, under) : under;
      const bg = blend(bg0, op, under), fg = blend(parse(cs.color).rgb, op, under);
      const [x, y] = [lum(fg), lum(bg)].sort((p, q) => q - p);
      return { color: cs.color, background: cs.backgroundColor, opacity: cs.opacity, cursor: cs.cursor, ratio: r1((x + 0.05) / (y + 0.05)) };
    },
    offenders() {
      const cw = document.documentElement.clientWidth, list = [];
      for (const el of document.body.querySelectorAll('*')) { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
        if (r.width < 2 || r.height < 2 || cs.position === 'fixed' || cs.clip !== 'auto' || cs.visibility === 'hidden') continue;
        if (r.right > cw + 0.5 || r.left < -0.5) list.push({ tag: el.tagName, cls: String(el.className).slice(0, 70), left: r1(r.left), right: r1(r.right) }); }
      return { count: list.length, first: list.slice(0, 6) };
    },
  };
};
const ev = (page, fn, arg) => page.evaluate(fn, arg);
const settle = async (page) => { await page.waitForLoadState('networkidle').catch(() => {}); await page.waitForTimeout(350); };
const at = async (page, w, h = 900) => { await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(250); };
const R = { label, started: new Date().toISOString(), engines: {}, items: {}, notes: [] };
const shot = async (page, name, masked = false) => { if (masked) await mask(page); await page.screenshot({ path: `${out}/shots_${label}/${name}.png`, fullPage: false }); };

// ---------- public pages (no session) ----------
async function publicOb(browser, engine) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); await ctx.addInitScript(HELPERS); const page = await ctx.newPage();
  const res = { widths: {}, free_trial_text: {} };
  for (const w of [320, 375, 390, 430, 768, 1024, 1440]) {
    await at(page, w); await page.goto(`${OB}/`, { waitUntil: 'networkidle' }); await settle(page);
    res.widths[w] = await ev(page, () => {
      const cta = [...document.querySelectorAll('section a')].filter((a) => /start free trial|subscribe now|^log in$/i.test(a.innerText.trim()));
      const boxes = cta.map((a) => ({ ...window.__m.box(a), href: a.getAttribute('href') }));
      const tops = new Set(boxes.map((b) => Math.round(b.top)));
      return { ...window.__m.overflow(), buttons: boxes, arrangement: boxes.length < 2 ? 'single' : tops.size === 1 ? 'side by side' : 'stacked',
        same_size: boxes.length === 2 ? Math.abs(boxes[0].width - boxes[1].width) < 0.6 && Math.abs(boxes[0].height - boxes[1].height) < 0.6 : null };
    });
    if (engine === 'chromium' && [375, 768, 1440].includes(w)) await shot(page, `R01_home_${w}`);
    if (w === 375 || w === 1440) res.free_trial_text[w] = await ev(page, () => { const hits = []; const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let t;
      while ((t = tw.nextNode())) if (/free trial/i.test(t.nodeValue) && !t.parentElement.closest('script, style')) { const p = t.parentElement, r = p.getBoundingClientRect(); hits.push({ text: t.nodeValue.trim(), in: p.closest('header') ? 'header' : p.closest('section') ? 'page body' : 'other', shown: r.width > 0 && r.height > 0, href: p.closest('a')?.getAttribute('href') ?? null }); }
      return hits; });
  }
  // hover and keyboard focus at 1440
  await at(page, 1440); await page.goto(`${OB}/`, { waitUntil: 'networkidle' }); await settle(page);
  res.hover_focus = {};
  const names = await ev(page, () => [...document.querySelectorAll('section a')].filter((a) => /start free trial|subscribe now|^log in$/i.test(a.innerText.trim())).map((a, i) => { a.setAttribute('data-rwo', String(i)); return a.innerText.trim(); }));
  for (let i = 0; i < names.length; i++) {
    const sel = `section a[data-rwo="${i}"]`; const rest = await ev(page, (s) => getComputedStyle(document.querySelector(s)).backgroundColor, sel);
    await page.hover(sel); await page.waitForTimeout(300); const hov = await ev(page, (s) => getComputedStyle(document.querySelector(s)).backgroundColor, sel);
    await page.mouse.move(5, 5); await page.keyboard.press('Tab'); await page.focus(sel);
    const foc = await ev(page, (s) => { const cs = getComputedStyle(document.querySelector(s)); return { is_active: document.activeElement === document.querySelector(s), outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`, offset: cs.outlineOffset }; }, sel);
    res.hover_focus[names[i]] = { rest_background: rest, hover_background: hov, focus: foc };
  }
  // login page: password toggle
  await page.goto(`${OB}/auth`, { waitUntil: 'networkidle' }); await settle(page);
  res.login_toggle = await ev(page, () => window.__m.box(document.querySelector('button[aria-label="Show password"]')));
  res.login_button_at_rest = await ev(page, () => window.__m.box(document.querySelector('form:has(input[type="password"]) button:not([type="button"])')));
  await ctx.close(); return res;
}

const PP_PUBLIC = ['/login', '/register/plan', '/register/owner', '/register/pharmacy', '/register/review', '/register/activation', '/auth/signed-out', '/auth/link-expired', '/auth/sign-in-to-continue', '/auth/handoff-recovery', '/auth/switch', '/auth/confirm'];
async function publicPp(browser, engine) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); await ctx.addInitScript(HELPERS); const page = await ctx.newPage();
  const res = { pages: {} };
  const widths = engine === 'chromium' ? [320, 375, 430, 767, 768, 769, 1023, 1024, 1440] : [767, 768, 769];
  for (const path of engine === 'chromium' ? PP_PUBLIC : ['/login']) {
    const per = {};
    for (const w of widths) {
      await at(page, w); await page.goto(`${PP}${path}`, { waitUntil: 'networkidle' }).catch(() => {}); await settle(page);
      per[w] = await ev(page, () => {
        const m = window.__m, cw = document.documentElement.clientWidth;
        const sign = document.querySelector('[data-testid="public-sign-in"]'); const sb = m.box(sign);
        const nav = document.querySelector('header nav'); const navItems = nav ? [...nav.children].map((c) => ({ text: c.innerText.trim().slice(0, 50), lines: m.lines(c), right: Math.round(c.getBoundingClientRect().right) })) : [];
        const foot = document.querySelector('footer'); let footer = null;
        if (foot) { const ps = [...foot.querySelectorAll('p')]; const links = ps[1] ? [...ps[1].children] : []; const items = [ps[0], ...links].filter(Boolean).map((c) => { const r = c.getBoundingClientRect(); return { text: c.innerText.trim().slice(0, 50), lines: m.lines(c), top: Math.round(r.top), center_x: Math.round(r.left + r.width / 2) }; });
          const linkItems = items.slice(1); const tops = new Set(linkItems.map((i) => i.top));
          footer = { items, any_item_breaks: items.some((i) => i.lines > 1), links_layout: tops.size === 1 ? 'one row' : tops.size === linkItems.length ? 'stacked one per line' : 'broken across lines',
            centered: items.every((i) => Math.abs(i.center_x - cw / 2) <= 2) }; }
        return { final_path: location.pathname, shares_public_header: !!document.querySelector('[data-testid="public-sign-in"], [data-testid="menu-trigger"]'), ...m.overflow(),
          sign_in: sb && sb.visible ? { lines: sb.lines, height: sb.height, width: sb.width, font_size: sb.font_size, radius: sb.radius } : 'not shown at this width (Menu button instead)',
          header_nav_items: sb && sb.visible ? navItems : [], footer };
      });
      if (engine === 'chromium' && path === '/login' && [375, 768, 1024].includes(w)) { await shot(page, `R08_login_${w}_top`); await ev(page, () => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(200); await shot(page, `R08_login_${w}_footer`); }
    }
    res.pages[path] = per;
  }
  if (engine === 'chromium') { await at(page, 1440); await page.goto(`${PP}/login`, { waitUntil: 'networkidle' }); await settle(page);
    res.login_toggle = await ev(page, () => window.__m.box(document.querySelector('button[aria-label="Show password"]'))); }
  await ctx.close(); return res;
}

// ---------- signed-in pages ----------
async function signedOb(browser, engine) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); await ctx.addInitScript(HELPERS); const page = await ctx.newPage();
  const res = {};
  // R-03: watch the Login button while the real sign-in is in progress (words, aria-busy, disabled, spinner).
  const seen = []; await page.exposeFunction('__rwoRec', (s) => { const k = JSON.stringify(s); if (seen[seen.length - 1] !== k) seen.push(k); });
  await page.addInitScript(() => { const t = () => { const b = document.querySelector('form:has(input[type="password"]) button:not([type="button"])'); if (!b || !window.__rwoRec) return;
    window.__rwoRec({ words: b.textContent.trim(), aria_busy: b.getAttribute('aria-busy'), disabled: b.disabled, spinner_in_form: !!b.closest('form').querySelector('[role="status"], .animate-spin') }); };
    new MutationObserver(t).observe(document, { subtree: true, childList: true, attributes: true, characterData: true }); });
  res.session = await A.signIn(page, 'ob', ROLE); await settle(page);
  res.login_button_states_during_sign_in = seen.map((s) => JSON.parse(s));

  // R-04, R-05, R-06a: Profile
  for (const w of engine === 'chromium' ? [1440, 375] : [1440]) {
    await at(page, w); await page.goto(`${OB}/profile`, { waitUntil: 'networkidle' }); await settle(page);
    (res.profile ??= {})[w] = await ev(page, () => ({ final_path: location.pathname, ...window.__m.overflow(),
      disabled_fields: [...document.querySelectorAll('input:disabled')].map((i) => ({ label: i.closest('div')?.querySelector('label')?.innerText ?? '', ...window.__m.contrast(i) })),
      support_link: (() => { const a = document.querySelector('main a[href^="mailto:"], a[href^="mailto:"]'); const b = window.__m.box(a); return b && { text: b.text, color: b.color, underline: b.underline, weight: b.weight }; })(),
      password_toggles: [...document.querySelectorAll('button[aria-label="Show password"]')].map((b) => { const x = window.__m.box(b); return { width: x.width, height: x.height, radius: x.radius }; }) }));
    if (engine === 'chromium' && w === 1440) await shot(page, 'R04_R05_profile_1440', true);
  }
  // R-06b, R-06c, R-07: dashboard
  for (const w of [320, 375, 390, 430, 1024, 1440]) {
    await at(page, w); await page.goto(`${OB}/owedbook`, { waitUntil: 'networkidle' }); await settle(page);
    (res.owedbook ??= {})[w] = await ev(page, () => { const m = window.__m; const list = document.querySelector('[role="tablist"]');
      const acct = document.querySelector('button[aria-label="Account menu"]'); const ab = m.box(acct);
      return { final_path: location.pathname, ...m.overflow(), outside_viewport: m.offenders(),
        tab_strip: list ? { height: m.box(list).height, left: m.box(list).left, right: m.box(list).right, scrolls_inside_its_own_box: list.scrollWidth > list.clientWidth, inner_scroll_px: list.scrollWidth - list.clientWidth } : 'not shown',
        tabs: [...document.querySelectorAll('[role="tab"]')].map((t) => { const b = m.box(t); return { text: b.text, height: b.height, radius: b.radius, font_size: b.font_size, weight: b.weight }; }),
        account_button: ab && ab.visible ? { width: ab.width, height: ab.height, radius: ab.radius } : 'not shown at this width' }; });
    if (engine === 'chromium' && [375, 1024].includes(w)) await shot(page, `R06_owedbook_${w}`, true);
  }
  // R-07: Billing & subscription
  for (const w of [320, 375, 390, 430]) {
    await at(page, w); await page.goto(`${OB}/admin-portal/billing`, { waitUntil: 'networkidle' }); await settle(page);
    (res.admin_billing ??= {})[w] = await ev(page, () => { const m = window.__m; const add = document.querySelector('[data-testid="add-store-handoff"]'); const help = add?.closest('div')?.querySelector('p');
      const ab = m.box(add), hb = m.box(help); const cw = document.documentElement.clientWidth;
      return { final_path: location.pathname, viewport: cw, ...m.overflow(), outside_viewport: m.offenders(),
        add_control: ab ? { text: ab.text, left: ab.left, right: ab.right, height: ab.height, inside_screen: ab.left >= 0 && ab.right <= cw } : 'not shown for this role or state',
        helper_text: hb ? { left: hb.left, right: hb.right, ...m.textRight(help), lines: hb.lines, inside_screen: hb.left >= 0 && hb.right <= cw && m.textRight(help).text_right <= cw } : 'not shown' }; });
    if (engine === 'chromium' && [320, 375].includes(w)) await shot(page, `R07_admin_billing_${w}`, true);
  }
  // R-02: Help
  if (engine === 'chromium') for (const w of [375, 768, 1024, 1440]) {
    await at(page, w); await page.goto(`${OB}/help`, { waitUntil: 'networkidle' }); await settle(page);
    const info = await ev(page, () => { const m = window.__m; const a = [...document.querySelectorAll('nav[aria-label="On this page"] a')].find((x) => /go to the top/i.test(x.innerText)); const nav = document.querySelector('nav[aria-label="On this page"]'); const first = document.querySelector('#getting-around');
      const nb = nav.getBoundingClientRect(), fb = first.getBoundingClientRect(); const b = m.box(a);
      return { final_path: location.pathname, ...m.overflow(), contents_menu: nb.right <= fb.left + 1 ? 'beside the text' : 'above the text', menu_is_sticky: getComputedStyle(nav).position === 'sticky',
        link: b ? { text: b.text, font_size: b.font_size, color: b.color, underline: b.underline, height: b.height, is_last_in_menu: nav.querySelectorAll('a')[nav.querySelectorAll('a').length - 1] === a } : 'absent' }; });
    if (info.link !== 'absent') {
      const sel = '[data-testid="help-go-to-top"]';
      await ev(page, () => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(250);
      const before = await ev(page, (s) => ({ scrollY: Math.round(window.scrollY), link_in_view: (() => { const r = document.querySelector(s).getBoundingClientRect(); return r.top >= 0 && r.bottom <= window.innerHeight; })() }), sel);
      await page.locator(sel).scrollIntoViewIfNeeded(); await page.waitForTimeout(150); const from1 = await ev(page, () => Math.round(window.scrollY));
      await page.click(sel); await page.waitForTimeout(700);
      const mouse = await ev(page, () => ({ scrollY: Math.round(window.scrollY), header_in_view: (() => { const h = document.querySelector('body header'); const r = h?.getBoundingClientRect(); return !!r && r.top >= 0 && r.bottom > 0; })() }));
      await page.goto(`${OB}/help`, { waitUntil: 'networkidle' }); await settle(page);
      await page.focus(sel); await page.waitForTimeout(150); const from2 = await ev(page, () => Math.round(window.scrollY));
      const focus = await ev(page, (s) => { const cs = getComputedStyle(document.querySelector(s)); return { outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`, offset: cs.outlineOffset }; }, sel);
      await page.keyboard.press('Enter'); await page.waitForTimeout(700);
      const key = await ev(page, () => ({ scrollY: Math.round(window.scrollY), hash: location.hash }));
      info.behavior = { at_page_bottom: before, mouse: { from_scrollY: from1, ...mouse }, keyboard: { from_scrollY: from2, ...key, focus_outline: focus } };
      if (w === 1440 || w === 375) { await page.goto(`${OB}/help`, { waitUntil: 'networkidle' }); await settle(page); await page.locator(sel).scrollIntoViewIfNeeded(); await shot(page, `R02_help_${w}`, true); }
    }
    (res.help ??= {})[w] = info;
  }
  await ctx.close(); return res;
}

async function signedPp(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); await ctx.addInitScript(HELPERS); const page = await ctx.newPage();
  const res = {}; res.session = await A.signIn(page, 'pp', ROLE); await settle(page);
  for (const path of ['/dashboard', '/billing']) for (const w of [320, 375, 768, 1440]) {
    await at(page, w); await page.goto(`${PP}${path}`, { waitUntil: 'networkidle' }); await settle(page);
    ((res[path] ??= {}))[w] = await ev(page, () => { const m = window.__m; const ref = document.querySelector('[data-testid="refresh"]'); const rb = m.box(ref);
      const fl = [...(document.querySelectorAll('footer p')[1]?.children ?? [])]; const ftops = new Set(fl.map((c) => Math.round(c.getBoundingClientRect().top)));
      return { final_path: location.pathname, ...m.overflow(), signed_in_footer_links: fl.length ? (ftops.size === 1 ? 'one row' : ftops.size === fl.length ? 'stacked one per line' : 'broken across lines') : 'none',
        row_buttons: [...document.querySelectorAll('[data-testid^="remove-store-"]:not([data-testid*="dialog"]), [data-testid^="undo-removal-"]')].filter((b) => b.tagName === 'BUTTON' && b.getBoundingClientRect().height > 0).map((b) => { const x = m.box(b); return { text: x.text, height: x.height, radius: x.radius, font_size: x.font_size, lines: x.lines }; }),
        small_control: rb ? { element: rb.tag, words: rb.text, classes: ref.className, width: rb.width, height: rb.height, radius: rb.radius, font_size: rb.font_size, underline: rb.underline, background: rb.background, color: rb.color } : 'not found' }; });
    if (w !== 768) await shot(page, `R09_pp${path.replace('/', '_')}_${w}`, true);
  }
  await ctx.close(); return res;
}

// ---------- run ----------
const chrome = await chromium.launch({ channel: 'chrome' }); const wk = await webkit.launch();
R.engines = { chromium: chrome.version(), webkit: wk.version() };
try {
  R.items.public_owedbook = { chromium: await publicOb(chrome, 'chromium'), webkit: await publicOb(wk, 'webkit') };
  R.items.public_portal = { chromium: await publicPp(chrome, 'chromium'), webkit: await publicPp(wk, 'webkit') };
  if (!publicOnly) {
    PRIVATE = await A.privateStrings();
    R.items.signed_owedbook = { chromium: await signedOb(chrome, 'chromium'), webkit: await signedOb(wk, 'webkit') };
    R.items.signed_portal = { chromium: await signedPp(chrome) };
    R.served = A.servedReport();
  }
} catch (e) { R.error = clean(String(e?.message ?? e).split('\n')[0]).slice(0, 300); }
finally { await chrome.close(); await wk.close(); }
R.sessions = { ...A.counters, total_sign_ins: A.counters.password_sign_ins + A.counters.token_sign_ins };
R.finished = new Date().toISOString();
writeFileSync(`${out}/measure_${label}.json`, JSON.stringify(deepClean(R), null, 1));
console.log(JSON.stringify({ label, error: R.error ?? null, sessions: R.sessions, engines: R.engines }));
process.exit(R.error ? 1 : 0);
