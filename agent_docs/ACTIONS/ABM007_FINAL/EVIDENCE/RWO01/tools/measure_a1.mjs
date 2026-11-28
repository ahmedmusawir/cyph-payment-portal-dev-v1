#!/usr/bin/env node
// ABM007_FINAL RWO-01 add-on A1 — engineering measurements for A1-1 to A1-4 on the SCRATCH proof pair
// (OwedBook 3100, Portal 3101). Claims for QA to test, never results.
// Usage (Portal root): node measure_a1.mjs <out_dir> <label> [--webkit]
// Reuses ../../E2/tools/scratch_proof/auth.mjs unchanged (SCRATCH verified from the listening server before any sign-in).
// Only navigation and reading; no form is submitted except sign-in; no button that changes data is pressed.
// Sessions per run: 2 (OwedBook and Portal Owner A in Chromium); with --webkit, 4 (the same two again in WebKit).
// Portal page loads are kept to two per session (the landing dashboard and /billing); widths are changed by resizing.
// Every request to /api/billing/overview (the page-load route that reads card details at the provider) is counted.
process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/home/moose/APBM007B_REPAIR_R2/browsers';
import { createRequire } from 'node:module'; import { mkdirSync, writeFileSync } from 'node:fs';
const PORTAL = '/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1';
const { chromium, webkit } = createRequire(`${PORTAL}/package.json`)('playwright');
const A = await import(new URL('../../E2/tools/scratch_proof/auth.mjs', import.meta.url));
const out = process.argv[2], label = process.argv[3]; const withWebkit = process.argv.includes('--webkit');
if (!out || !label) { console.error('usage: measure_a1.mjs <out_dir> <label> [--webkit]'); process.exit(2); }
mkdirSync(`${out}/shots_${label}`, { recursive: true });
const { ob: OB, pp: PP } = A.SITES; const ROLE = 'ENGINEERING_OWNER_A';
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g; let PRIVATE = [];
const clean = (s) => { let t = String(s ?? '').replace(EMAIL, (m) => (/pharmacybooks\.com$/.test(m) ? m : '[email]')); for (const p of PRIVATE) t = t.split(p).join('[name]'); return t; };
const mask = (page) => page.evaluate((priv) => {
  const hide = (v) => { for (const p of priv) v = v.split(p).join('[name hidden]'); return v; };
  const rx = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g; const keep = (m) => /pharmacybooks\.com$/.test(m);
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let t;
  while ((t = w.nextNode())) { const v = hide(t.nodeValue.replace(rx, (m) => (keep(m) ? m : '[email hidden]'))); if (v !== t.nodeValue) t.nodeValue = v; }
  for (const e of document.querySelectorAll('[title]')) e.setAttribute('title', hide(e.getAttribute('title').replace(rx, '[email hidden]')));
}, PRIVATE);
const settle = async (page) => { await page.waitForLoadState('networkidle').catch(() => {}); await page.waitForTimeout(350); };
const at = async (page, w, h = 900) => { await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(300); };
const R = { label, started: new Date().toISOString(), engines: {}, items: {}, portal_page_loads: {}, billing_overview_requests: {} };

// A1-1: opening page header and phone menu, and the "free trial" scan of the whole served page.
async function openingPage(browser, engine) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage(); const res = {};
  const scan = () => page.evaluate(() => { const hits = []; const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let t;
    while ((t = tw.nextNode())) if (/free trial/i.test(t.nodeValue) && !t.parentElement.closest('script, style')) { const p = t.parentElement, r = p.getBoundingClientRect(); hits.push({ text: t.nodeValue.trim(), in: p.closest('header') ? 'header' : 'page body', shown: r.width > 0 && r.height > 0 }); }
    const attrs = [...document.querySelectorAll('[aria-label], [title], [alt], [placeholder]')].filter((e) => /free trial/i.test(['aria-label', 'title', 'alt', 'placeholder'].map((a) => e.getAttribute(a) || '').join(' '))).length;
    return { visible_or_hidden_text_hits: hits, attribute_hits: attrs, whole_document_matches_including_scripts: (document.documentElement.outerHTML.match(/free trial/gi) || []).length,
      title_or_description_matches: (document.title + ' ' + (document.querySelector('meta[name="description"]')?.content || '')).match(/free trial/gi)?.length ?? 0 }; });
  const green = (root) => page.evaluate((sel) => { const all = [...document.querySelectorAll(`${sel} a`)].filter((x) => /start free trial|subscribe now/i.test(x.textContent)); const a = all.find((x) => x.getBoundingClientRect().width > 0) ?? all[0]; if (!a) return null; const r = a.getBoundingClientRect(), cs = getComputedStyle(a);
    return { words: a.textContent.trim(), href: a.getAttribute('href'), width: Math.round(r.width * 100) / 100, height: Math.round(r.height * 100) / 100, radius: cs.borderTopLeftRadius, background: cs.backgroundColor, color: cs.color, font_size: cs.fontSize, shown: r.width > 0 && r.height > 0 }; }, root);
  await page.goto(`${OB}/`, { waitUntil: 'networkidle' }); await settle(page);
  res.desktop_1440 = { header_button: await green('header'), free_trial_scan: await scan() };
  const sel = 'header a'; const hb = await page.evaluateHandle(() => [...document.querySelectorAll('header a')].find((x) => /start free trial|subscribe now/i.test(x.innerText)));
  await hb.asElement().hover(); await page.waitForTimeout(300); res.desktop_1440.header_button_hover_background = await page.evaluate((el) => getComputedStyle(el).backgroundColor, hb);
  await page.mouse.move(5, 300); await page.keyboard.press('Tab'); await hb.asElement().focus();
  res.desktop_1440.header_button_focus = await page.evaluate((el) => { const cs = getComputedStyle(el); return `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}, offset ${cs.outlineOffset}`; }, hb);
  if (engine === 'chromium') await page.screenshot({ path: `${out}/shots_${label}/A1-1_header_1440.png`, clip: { x: 0, y: 0, width: 1440, height: 80 } });
  await at(page, 375); await page.goto(`${OB}/`, { waitUntil: 'networkidle' }); await settle(page);
  res.phone_375_menu_closed = { free_trial_scan: await scan() };
  await page.click('button[aria-label="Open menu"]'); await page.waitForTimeout(400);
  res.phone_375_menu_open = { menu_button: await green('body'), free_trial_scan: await scan(), sideways_overflow_px: await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) };
  if (engine === 'chromium') await page.screenshot({ path: `${out}/shots_${label}/A1-1_phone_menu_375.png` });
  await ctx.close(); return res; void sel;
}

// A1-2 and A1-3: Help.
async function help(browser, engine) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage(); const res = { views: {} };
  res.session = await A.signIn(page, 'ob', ROLE); await settle(page);
  const views = [[375, 900], [768, 900], [1023, 900], [1024, 900], [1024, 600], [1440, 650], [1440, 900]];
  for (const [w, h] of views) {
    await at(page, w, h); await page.goto(`${OB}/help`, { waitUntil: 'networkidle' }); await settle(page);
    const v = await page.evaluate(() => { const nav = document.querySelector('nav[aria-label="On this page"]'); const first = document.querySelector('#getting-around'); const cs = getComputedStyle(nav);
      const menuLink = [...nav.querySelectorAll('a')].find((x) => /go to the top/i.test(x.innerText)); const end = document.querySelector('[data-testid="help-go-to-top-end"]');
      const er = end?.getBoundingClientRect(); const ecs = end && getComputedStyle(end);
      return { window_height: window.innerHeight, sideways_overflow_px: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        contents_menu: { position: nav.getBoundingClientRect().right <= first.getBoundingClientRect().left + 1 ? 'beside the text' : 'above the text', sticky: cs.position === 'sticky', box_height: Math.round(nav.getBoundingClientRect().height), content_height: nav.scrollHeight, overflow_y: cs.overflowY,
          taller_than_window: nav.scrollHeight + 16 > window.innerHeight, scrolls_inside_itself: nav.scrollHeight > nav.clientHeight + 1 && /auto|scroll/.test(cs.overflowY), has_go_to_top: !!menuLink },
        end_of_text_link: end ? { shown: er.width > 0 && er.height > 0, font_size: ecs.fontSize, color: ecs.color, underline: ecs.textDecorationLine, height: Math.round(er.height) } : 'absent' }; });
    // Is the menu's Go to the Top reachable by keyboard and mouse at this size?
    if (v.contents_menu.has_go_to_top) {
      const sel = '[data-testid="help-go-to-top"]';
      await page.evaluate(() => window.scrollTo(0, 1500)); await page.waitForTimeout(250);
      const start = await page.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { link_top: Math.round(r.top), link_bottom: Math.round(r.bottom), in_view_without_scrolling_the_menu: r.top >= 0 && r.bottom <= window.innerHeight }; }, sel);
      await page.focus(sel); await page.waitForTimeout(300);
      const focused = await page.evaluate((s) => { const el = document.querySelector(s), r = el.getBoundingClientRect(), nav = el.closest('nav'); const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return { page_scrollY_after_focus: Math.round(window.scrollY), menu_scrolled_by_px: Math.round(nav.scrollTop), link_fully_in_view: r.top >= 0 && r.bottom <= window.innerHeight, link_is_topmost_at_its_position: !!top && (el.contains(top) || top.contains(el)) }; }, sel);
      let mouse = 'not attempted: link not in view';
      if (focused.link_fully_in_view && focused.link_is_topmost_at_its_position) { await page.click(sel); await page.waitForTimeout(700); mouse = await page.evaluate(() => ({ page_scrollY: Math.round(window.scrollY) })); }
      await page.goto(`${OB}/help`, { waitUntil: 'networkidle' }); await settle(page); await page.evaluate(() => window.scrollTo(0, 1500)); await page.waitForTimeout(200);
      await page.focus(sel); await page.keyboard.press('Enter'); await page.waitForTimeout(700);
      v.menu_link_reach = { reader_scrolled_to: 1500, at_rest: start, after_keyboard_focus: focused, mouse_click: mouse, keyboard_enter: await page.evaluate(() => ({ page_scrollY: Math.round(window.scrollY) })) };
      if (engine === 'chromium' && ((w === 1024 && h === 600) || (w === 1440 && h === 650))) { await page.goto(`${OB}/help`, { waitUntil: 'networkidle' }); await settle(page); await page.evaluate(() => window.scrollTo(0, 1500)); await page.focus(sel); await page.waitForTimeout(300); await mask(page); await page.screenshot({ path: `${out}/shots_${label}/A1-3_help_menu_${w}x${h}.png` }); }
    }
    if (v.end_of_text_link !== 'absent' && v.end_of_text_link.shown) {
      const sel = '[data-testid="help-go-to-top-end"]';
      await page.goto(`${OB}/help`, { waitUntil: 'networkidle' }); await settle(page);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(300);
      const bottom = await page.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); const last = [...document.querySelectorAll('main section')].pop().getBoundingClientRect(); return { page_scrollY_at_bottom: Math.round(window.scrollY), link_in_view_at_page_bottom: r.top >= 0 && r.bottom <= window.innerHeight, link_is_below_the_last_section: r.top >= last.bottom - 1 }; }, sel);
      if (engine === 'chromium' && (w === 375 || w === 768)) { await mask(page); await page.screenshot({ path: `${out}/shots_${label}/A1-2_help_end_${w}.png` }); }
      await page.click(sel); await page.waitForTimeout(700); const mouse = await page.evaluate(() => ({ page_scrollY: Math.round(window.scrollY), header_in_view: (() => { const r = document.querySelector('body header')?.getBoundingClientRect(); return !!r && r.top >= 0; })() }));
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(200); await page.focus(sel);
      const focus = await page.evaluate((s) => { const cs = getComputedStyle(document.querySelector(s)); return `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}, offset ${cs.outlineOffset}`; }, sel);
      await page.keyboard.press('Enter'); await page.waitForTimeout(700);
      v.end_link_behavior = { ...bottom, mouse_click: mouse, keyboard_enter: await page.evaluate(() => ({ page_scrollY: Math.round(window.scrollY) })), focus_outline: focus };
    }
    res.views[`${w}x${h}`] = v;
  }
  await ctx.close(); return res;
}

// A1-4: signed-in Portal footer. Two page loads per session; widths by resizing.
async function footer(browser, engine) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage(); const res = {};
  let overview = 0, loads = 0; page.on('request', (r) => { if (r.url().includes('/api/billing/overview')) overview++; });
  page.on('framenavigated', (f) => { if (f === page.mainFrame() && /\/(dashboard|billing)$/.test(new URL(f.url()).pathname)) loads++; });
  res.session = await A.signIn(page, 'pp', ROLE); await settle(page);
  const measure = () => page.evaluate(() => { const cw = document.documentElement.clientWidth; const foot = document.querySelector('footer'); const ps = [...foot.querySelectorAll('p')]; const links = [...ps[1].children];
    const lines = (el) => { const r = document.createRange(); r.selectNodeContents(el); const t = new Set(); for (const c of r.getClientRects()) if (c.width > 0.5) t.add(Math.round(c.top)); return t.size; };
    const items = [ps[0], ...links].map((c) => { const r = c.getBoundingClientRect(); return { text: c.innerText.trim().slice(0, 40), lines: lines(c), top: Math.round(r.top), center_x: Math.round(r.left + r.width / 2) }; });
    const tops = new Set(items.slice(1).map((i) => i.top));
    return { path: location.pathname, sideways_overflow_px: document.documentElement.scrollWidth - cw, links_layout: tops.size === 1 ? 'one row' : tops.size === links.length ? 'stacked one per line' : 'broken across lines',
      any_item_breaks_across_lines: items.some((i) => i.lines > 1), centered: items.every((i) => Math.abs(i.center_x - cw / 2) <= 2), text_color: getComputedStyle(ps[0]).color, items }; });
  for (const path of ['/dashboard', '/billing']) {
    if (new URL(page.url()).pathname !== path) { await page.goto(`${PP}${path}`, { waitUntil: 'networkidle' }); await settle(page); }
    res[path] = {};
    for (const w of [767, 768, 769, 1023, 1024]) { await at(page, w); res[path][w] = await measure();
      if (engine === 'chromium' && (w === 768 || w === 1024)) { await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(200); await mask(page); await page.screenshot({ path: `${out}/shots_${label}/A1-4_footer${path.replace('/', '_')}_${w}.png` }); } }
  }
  await page.waitForTimeout(500);
  R.portal_page_loads[engine] = loads; R.billing_overview_requests[engine] = overview;
  await ctx.close(); return res;
}

const browsers = [['chromium', await chromium.launch({ channel: 'chrome' })]]; if (withWebkit) browsers.push(['webkit', await webkit.launch()]);
try {
  PRIVATE = await A.privateStrings();
  for (const [engine, b] of browsers) { R.engines[engine] = b.version();
    (R.items.opening_page ??= {})[engine] = await openingPage(b, engine);
    (R.items.help ??= {})[engine] = await help(b, engine);
    (R.items.signed_in_footer ??= {})[engine] = await footer(b, engine); }
  R.served = A.servedReport();
} catch (e) { R.error = clean(String(e?.message ?? e).split('\n')[0]).slice(0, 300); }
finally { for (const [, b] of browsers) await b.close(); }
R.sessions = { ...A.counters, total_sign_ins: A.counters.password_sign_ins + A.counters.token_sign_ins };
R.finished = new Date().toISOString();
writeFileSync(`${out}/measure_a1_${label}.json`, JSON.stringify(JSON.parse(clean(JSON.stringify(R))), null, 1));
console.log(JSON.stringify({ label, error: R.error ?? null, sessions: R.sessions, portal_page_loads: R.portal_page_loads, billing_overview_requests: R.billing_overview_requests }));
process.exit(R.error ? 1 : 0);
