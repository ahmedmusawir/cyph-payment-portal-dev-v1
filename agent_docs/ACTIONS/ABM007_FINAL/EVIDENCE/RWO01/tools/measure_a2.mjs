#!/usr/bin/env node
// ABM007_FINAL RWO-01 add-on A2 — engineering measurements for A2-1 and A2-2 on the SCRATCH proof pair
// (OwedBook 3100; the Portal on 3101 is started by the serve tool but NO Portal page is loaded by this script).
// Claims for QA to test, never results.
// Usage (Portal root): node measure_a2.mjs <out_dir> <label> [--webkit]
// Reuses ../../E2/tools/scratch_proof/auth.mjs unchanged (SCRATCH verified from the listening server before any sign-in).
// Only navigation, focus and reading. No form is submitted except sign-in. The only things activated are the Help
// in-page links ("Go to the Top"). The Add control and the password controls are focused, never pressed or typed in.
// Sessions per run: 1 (OwedBook Owner A in Chromium); with --webkit, 2 (the same again in WebKit).
//
// How a focus outline is judged (A2-2): the control is focused with real key presses (Shift+Tab then Tab, or Tab from
// its neighbour), scrolled to the middle of the window where the page allows it, and then
//   (1) geometry: the outline box (control box grown by outline offset + width) is compared with the window and with
//       every ancestor that clips (overflow other than visible); any cut is reported in px per side;
//   (2) pixels: a screenshot of the focused control is read back, and along each of the four sides the share of the
//       side's length that carries the outline color is reported (the corner 6px are left out because corners are round).
// A side counts as whole when geometry shows no cut and at least 95% of its length carries the outline color.
// Where a control draws its focus ring as a box shadow (the shared field and button style) the same check is made
// on the ring: its color and size are read from the computed box shadow.
// Contents menu: the reader is put at page scroll 1500, so the menu is stuck 16px from the top of the window and the
// window edge is not near any link; the first link is reached with Shift+Tab from the second, the rest with Tab.
process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/home/moose/APBM007B_REPAIR_R2/browsers';
import { createRequire } from 'node:module'; import { mkdirSync, writeFileSync } from 'node:fs';
const PORTAL = '/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1';
const { chromium, webkit } = createRequire(`${PORTAL}/package.json`)('playwright');
const A = await import(new URL('../../E2/tools/scratch_proof/auth.mjs', import.meta.url));
const out = process.argv[2], label = process.argv[3]; const withWebkit = process.argv.includes('--webkit');
if (!out || !label) { console.error('usage: measure_a2.mjs <out_dir> <label> [--webkit]'); process.exit(2); }
const SHOTS = `${out}/shots_a2_${label}`; mkdirSync(SHOTS, { recursive: true });
const { ob: OB } = A.SITES; const ROLE = 'ENGINEERING_OWNER_A';
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g; let PRIVATE = [];
const clean = (s) => { let t = String(s ?? '').replace(EMAIL, (m) => (/pharmacybooks\.com$/.test(m) ? m : '[email]')); for (const p of PRIVATE) t = t.split(p).join('[name]'); return t; };
const mask = (page) => page.evaluate((priv) => {
  const hide = (v) => { for (const p of priv) v = v.split(p).join('[name hidden]'); return v; };
  const rx = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g; const keep = (m) => /pharmacybooks\.com$/.test(m);
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let t;
  while ((t = w.nextNode())) { const v = hide(t.nodeValue.replace(rx, (m) => (keep(m) ? m : '[email hidden]'))); if (v !== t.nodeValue) t.nodeValue = v; }
  for (const e of document.querySelectorAll('[title]')) e.setAttribute('title', hide(e.getAttribute('title').replace(rx, '[email hidden]')));
}, PRIVATE);
// Fields that could show a fixture person's details are covered in every screenshot.
const coverFields = (page) => [page.locator('input:not([type="password"])'), page.locator('textarea')];
const settle = async (page) => { await page.waitForLoadState('networkidle').catch(() => {}); await page.waitForTimeout(350); };
const at = async (page, w, h = 900) => { await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(300); };
const scrollInstant = (page, y) => page.evaluate((yy) => window.scrollTo({ top: yy === 'bottom' ? document.body.scrollHeight : yy, behavior: 'instant' }), y);
const waitScrollStill = async (page) => { let last = -1; for (let i = 0; i < 40; i++) { const y = await page.evaluate(() => Math.round(window.scrollY)); if (y === last) return y; last = y; await page.waitForTimeout(120); } return last; };
const R = { label, started: new Date().toISOString(), engines: {}, items: {}, portal_pages_loaded: 0 };

// Real keyboard focus: land on the element with Tab, so :focus-visible is the browser's own decision.
async function kbFocus(page, h) {
  await page.mouse.move(2, 2);
  await h.evaluate((el) => el.focus({ preventScroll: true }));
  await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); await page.waitForTimeout(150);
  let how = 'keyboard (Shift+Tab, then Tab back onto the control)';
  if (!(await h.evaluate((el) => document.activeElement === el))) { await h.evaluate((el) => el.focus({ preventScroll: true })); how = 'script focus after key presses (Tab did not return to the control in this engine)'; }
  return { how, is_focused: await h.evaluate((el) => document.activeElement === el), focus_visible: await h.evaluate((el) => el.matches(':focus-visible')) };
}

// Reads two PNGs (focused, not focused) in a blank helper page and reports outline coverage per side.
async function readRing(helper, focusedPng, plainPng, g) {
  return helper.evaluate(async ({ a, b, g }) => {
    const load = (b64) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = `data:image/png;base64,${b64}`; });
    const data = async (b64) => { const i = await load(b64); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const x = c.getContext('2d'); x.drawImage(i, 0, 0); return x.getImageData(0, 0, i.width, i.height); };
    const F = await data(a), P = await data(b); const W = F.width, H = F.height;
    const px = (D, x, y) => { const k = (y * W + x) * 4; return [D.data[k], D.data[k + 1], D.data[k + 2]]; };
    const near = (p, q, t) => Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]) <= t;
    const hit = (x, y) => { if (x < 0 || y < 0 || x >= W || y >= H) return [false, false]; const f = px(F, x, y); return [near(f, g.color, 90), !near(f, px(P, x, y), 40)]; };
    // band: the strip where the outline is drawn, one extra pixel each way for sub-pixel boxes
    const lo = g.offset - 1, hi = g.offset + g.width + 1; const sides = {};
    const run = (name, from, to, probe) => { let n = 0, color = 0, changed = 0; for (let i = Math.ceil(from) + 6; i <= Math.floor(to) - 6; i++) { n++; let c = false, d = false; for (let t = lo; t <= hi; t++) { const [cc, dd] = probe(i, t); c ||= cc; d ||= dd; } if (c) color++; if (d) changed++; }
      sides[name] = { length_checked_px: n, with_outline_color_pct: n ? Math.round((color / n) * 1000) / 10 : 0, changed_by_focus_pct: n ? Math.round((changed / n) * 1000) / 10 : 0 }; };
    run('top', g.left, g.right, (i, t) => hit(i, Math.round(g.top) - 1 - t));
    run('bottom', g.left, g.right, (i, t) => hit(i, Math.round(g.bottom) + t));
    run('left', g.top, g.bottom, (i, t) => hit(Math.round(g.left) - 1 - t, i));
    run('right', g.top, g.bottom, (i, t) => hit(Math.round(g.right) + t, i));
    return sides;
  }, { a: focusedPng.toString('base64'), b: plainPng.toString('base64'), g });
}

// Focus outline on all four sides. `center`: scroll the control to the middle of the window first.
async function ringCheck(page, helper, h, name, { center = true, shot = null, alreadyFocused = null } = {}) {
  if (center) { await h.evaluate((el) => el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' })); await page.waitForTimeout(250); }
  const focus = alreadyFocused ?? await kbFocus(page, h);
  if (center) { await h.evaluate((el) => el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' })); await page.waitForTimeout(250); }
  const geo = await h.evaluate((el) => {
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el); const ow = parseFloat(cs.outlineWidth) || 0, oo = parseFloat(cs.outlineOffset) || 0; const grow = ow + oo;
    const O = { left: r.left - grow, right: r.right + grow, top: r.top - grow, bottom: r.bottom + grow };
    let rgb = (cs.outlineColor.match(/[\d.]+/g) || []).map(Number); let drawn = 'outline'; let pw = ow, po = oo;
    if (cs.outlineStyle === 'none' || ow === 0 || (rgb.length === 4 && rgb[3] === 0)) {   // focus ring drawn as a box shadow
      const parts = cs.boxShadow.split(/,(?![^(]*\))/).map((t) => { const c = (t.match(/rgba?\(([^)]+)\)/) || [, ''])[1].split(',').map(Number); const n = t.replace(/rgba?\([^)]+\)/, '').trim().split(/\s+/).map(parseFloat); return { c, spread: n[3] || 0, inset: /inset/.test(t) }; })
        .filter((x) => !x.inset && x.spread > 0 && (x.c.length === 3 || x.c[3] > 0)).sort((a, b) => b.spread - a.spread);
      if (parts.length) { drawn = 'ring (box shadow)'; rgb = parts[0].c; po = parts[1]?.spread ?? 0; pw = parts[0].spread - po; O.left = r.left - parts[0].spread; O.right = r.right + parts[0].spread; O.top = r.top - parts[0].spread; O.bottom = r.bottom + parts[0].spread; }
    }
    rgb = rgb.slice(0, 3);
    const cut = { top: 0, right: 0, bottom: 0, left: 0 }; const clippers = [];
    const take = (box, who) => { const c = { top: Math.max(0, box.top - O.top), left: Math.max(0, box.left - O.left), bottom: Math.max(0, O.bottom - box.bottom), right: Math.max(0, O.right - box.right) };
      if (c.top + c.left + c.bottom + c.right > 0.01) clippers.push({ who, cut_px: Object.fromEntries(Object.entries(c).map(([k, v]) => [k, Math.round(v * 100) / 100])) }); for (const k in c) cut[k] = Math.max(cut[k], Math.round(c[k] * 100) / 100); };
    let n = 0; for (let p = el.parentElement; p && p !== document.documentElement && p !== document.body; p = p.parentElement) { const s = getComputedStyle(p); if (s.overflowX !== 'visible' || s.overflowY !== 'visible') { n++; const b = p.getBoundingClientRect();
      take({ top: b.top + p.clientTop, left: b.left + p.clientLeft, bottom: b.top + p.clientTop + p.clientHeight, right: b.left + p.clientLeft + p.clientWidth }, `${p.tagName.toLowerCase()}${p.getAttribute('aria-label') ? `[${p.getAttribute('aria-label')}]` : ''} (overflow ${s.overflowX}/${s.overflowY})`); } }
    take({ top: 0, left: 0, bottom: window.innerHeight, right: document.documentElement.clientWidth }, 'window');

    return { control_box: { left: Math.round(r.left * 100) / 100, right: Math.round(r.right * 100) / 100, top: Math.round(r.top * 100) / 100, bottom: Math.round(r.bottom * 100) / 100, width: Math.round(r.width * 100) / 100, height: Math.round(r.height * 100) / 100 },
      window: { width: document.documentElement.clientWidth, height: window.innerHeight }, control_center_offset_from_window_center_px: { x: Math.round(r.left + r.width / 2 - document.documentElement.clientWidth / 2), y: Math.round(r.top + r.height / 2 - window.innerHeight / 2) },
      outline: drawn === 'outline' ? `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}, offset ${cs.outlineOffset}` : `ring drawn as a box shadow: ${pw}px rgb(${rgb.join(', ')}), offset ${po}px`, outline_px: { width: pw, offset: po, color: rgb }, clipping_ancestors_checked: n, cut_px: cut, clippers };
  });
  const pad = geo.outline_px.width + geo.outline_px.offset + 8; const b = geo.control_box;
  const clip = { x: Math.max(0, Math.floor(b.left - pad)), y: Math.max(0, Math.floor(b.top - pad)) }; clip.width = Math.min(geo.window.width, Math.ceil(b.right + pad)) - clip.x; clip.height = Math.min(geo.window.height, Math.ceil(b.bottom + pad)) - clip.y;
  let pixels = 'not read: control outside the window';
  if (clip.width > 4 && clip.height > 4) {
    const opt = { clip, mask: coverFields(page), animations: 'disabled', caret: 'hide' };
    const focused = await page.screenshot(opt);
    if (shot) await page.screenshot({ ...opt, path: `${SHOTS}/${shot}.png` });
    await h.evaluate((el) => el.blur()); await page.waitForTimeout(150);
    const plain = await page.screenshot(opt);
    pixels = await readRing(helper, focused, plain, { left: b.left - clip.x, right: b.right - clip.x, top: b.top - clip.y, bottom: b.bottom - clip.y, width: geo.outline_px.width, offset: geo.outline_px.offset, color: geo.outline_px.color });
  }
  const whole = {}; for (const s of ['top', 'right', 'bottom', 'left']) whole[s] = typeof pixels === 'object' && geo.cut_px[s] === 0 && pixels[s].with_outline_color_pct >= 95;
  delete geo.outline_px;
  return { control: name, focus, ...geo, pixels, side_whole: whole, all_four_sides_whole: Object.values(whole).every(Boolean) };
}

// One screen pixel, read back from a 1x1 screenshot (to prove the surface color under a link).
async function pixelAt(page, helper, x, y) {
  const png = await page.screenshot({ clip: { x: Math.round(x), y: Math.round(y), width: 2, height: 2 } });
  return helper.evaluate(async (b64) => { const i = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = `data:image/png;base64,${b64}`; }); const c = document.createElement('canvas'); c.width = 2; c.height = 2; const x = c.getContext('2d'); x.drawImage(i, 0, 0); const d = x.getImageData(0, 0, 1, 1).data; return `rgb(${d[0]}, ${d[1]}, ${d[2]})`; }, png.toString('base64'));
}

const TOPS = 'a[href="#top"]';
// A2-1: every "Go to the Top" link on Help: where it is, how it looks, its contrast, and that it returns to the top.
async function help(page, helper, engine) {
  const res = { views: {} };
  for (const [w, h] of [[375, 900], [768, 900], [1024, 600], [1440, 900]]) {
    await at(page, w, h); await page.goto(`${OB}/help`, { waitUntil: 'networkidle' }); await settle(page); await mask(page);
    const v = await page.evaluate((sel) => {
      const lum = (c) => { const [r, g, b] = c.map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
      const nums = (s) => (s.match(/[\d.]+/g) || []).map(Number);
      const surface = (el) => { for (let p = el; p; p = p.parentElement) { const c = nums(getComputedStyle(p).backgroundColor); if (c.length === 3 || (c.length === 4 && c[3] > 0)) return { color: c.slice(0, 3), el: p }; } return { color: [255, 255, 255], el: null }; };
      const nav = document.querySelector('nav[aria-label="On this page"]'); const sections = [...document.querySelectorAll('section[id]')]; const ncs = getComputedStyle(nav);
      const links = [...document.querySelectorAll(sel)].map((a) => { const r = a.getBoundingClientRect(), cs = getComputedStyle(a); const s = surface(a); const fg = nums(cs.color).slice(0, 3); const L1 = lum(fg), L2 = lum(s.color); const sec = a.closest('section[id]');
        const where = a.closest('nav') ? 'contents menu' : sec ? `end of article ${sections.indexOf(sec) + 1} (${sec.id})` : 'after the last article, directly on the page';
        return { where, last_thing_in_its_article: sec ? sec.lastElementChild === a.parentElement : null, words: a.innerText.trim(), shown: r.width > 0 && r.height > 0, target_height: Math.round(r.height * 100) / 100, target_width: Math.round(r.width * 100) / 100, font_size: cs.fontSize,
          color: `rgb(${fg.join(', ')})`, underline: cs.textDecorationLine, surface: s.el ? (s.el.matches('section, nav') ? 'white card' : s.el === document.body ? 'the page' : s.el.tagName.toLowerCase()) : 'none found', surface_color: `rgb(${s.color.join(', ')})`,
          contrast_ratio: Math.round(((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)) * 100) / 100 }; });
      const shown = links.filter((l) => l.shown);
      return { window: `${document.documentElement.clientWidth} x ${window.innerHeight}`, sideways_overflow_px: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        go_to_top_links: { total_in_page: links.length, shown: shown.length, shown_in_articles: shown.filter((l) => l.where.startsWith('end of article')).length, shown_in_contents_menu: shown.filter((l) => l.where === 'contents menu').length, shown_after_last_article: shown.filter((l) => l.where.startsWith('after')).length,
          articles: sections.length, articles_ending_with_the_link: sections.filter((s) => s.lastElementChild?.querySelector(sel)).length,
          lowest_contrast_of_shown: shown.length ? Math.min(...shown.map((l) => l.contrast_ratio)) : null, smallest_target_height_of_shown: shown.length ? Math.min(...shown.map((l) => l.target_height)) : null, each: links },
        contents_menu: { links: nav.querySelectorAll('a').length, position: nav.getBoundingClientRect().right <= sections[0].getBoundingClientRect().left + 1 ? 'beside the text' : 'above the text', sticky: ncs.position === 'sticky', box_height: Math.round(nav.getBoundingClientRect().height), content_height: nav.scrollHeight, overflow_y: ncs.overflowY,
          scrolls_inside_itself: nav.scrollHeight > nav.clientHeight + 1 && /auto|scroll/.test(ncs.overflowY) } }; }, TOPS);
    // Behavior and outline for the first, a middle and the last shown link.
    const all = await page.$$(TOPS); const shownIdx = []; for (let i = 0; i < all.length; i++) if (await all[i].evaluate((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; })) shownIdx.push(i);
    const pick = [...new Set([shownIdx[0], shownIdx[Math.floor(shownIdx.length / 2)], shownIdx[shownIdx.length - 1]])].filter((i) => i !== undefined);
    v.checked_links = [];
    for (const i of pick) { const hnd = all[i]; const c = { link: v.go_to_top_links.each[i].where };
      const inMenu = c.link === 'contents menu';
      if (inMenu) await scrollInstant(page, 1500); else await hnd.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForTimeout(250);
      const box = await hnd.evaluate((el) => { const r = el.getBoundingClientRect(); const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { x: r.left + r.width / 2, y: r.top + r.height / 2, left: r.left, in_window: r.top >= 0 && r.bottom <= window.innerHeight, topmost: !!top && (el.contains(top) || top.contains(el)), scrollY: Math.round(window.scrollY) }; });
      c.surface_pixel_beside_link = box.in_window ? await pixelAt(page, helper, Math.max(0, box.left - 6), box.y) : 'link not in the window';
      if (box.in_window && box.topmost) { await page.mouse.click(box.x, box.y); const y = await waitScrollStill(page);
        c.mouse_click = { reader_was_at_scrollY: box.scrollY, page_scrollY_after: y, header_in_view: await page.evaluate(() => { const r = document.querySelector('body header')?.getBoundingClientRect(); return !!r && r.top >= 0 && r.bottom > 0; }) }; }
      else c.mouse_click = { not_possible: 'link not in the window or covered', reader_was_at_scrollY: box.scrollY };
      await page.mouse.move(2, 2);
      if (inMenu) await scrollInstant(page, 1500); else await hnd.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForTimeout(250); const before = await page.evaluate(() => Math.round(window.scrollY));
      const f = await kbFocus(page, hnd); await page.keyboard.press('Enter'); const y2 = await waitScrollStill(page);
      c.keyboard_enter = { focus: f.how, reader_was_at_scrollY: before, page_scrollY_after: y2, header_in_view: await page.evaluate(() => { const r = document.querySelector('body header')?.getBoundingClientRect(); return !!r && r.top >= 0 && r.bottom > 0; }) };
      if (inMenu) await scrollInstant(page, 1500);
      c.focus_outline = await ringCheck(page, helper, hnd, `Go to the Top, ${c.link}`, { center: !inMenu, shot: engine === 'chromium' ? `A2-1_link_focus_${w}_${c.link.replace(/[^a-z0-9]+/gi, '_').slice(0, 30)}` : null });
      v.checked_links.push(c); }
    if (engine === 'chromium' && (w === 375 || w === 1440)) {
      await page.goto(`${OB}/help`, { waitUntil: 'networkidle' }); await settle(page); await mask(page);
      const t = (await page.$$(TOPS)); const first = t.find(Boolean); if (first) { await page.evaluate(() => document.querySelector('section[id]').scrollIntoView({ block: 'start', behavior: 'instant' })); await page.waitForTimeout(250); await page.screenshot({ path: `${SHOTS}/A2-1_help_first_article_${w}.png` }); }
      await scrollInstant(page, 'bottom'); await page.waitForTimeout(300); await page.screenshot({ path: `${SHOTS}/A2-1_help_page_end_${w}.png` });
    }
    res.views[`${w}x${h}`] = v;
  }
  return res;
}

// A2-2 (a): contents menu links inside the scrolling menu box.
async function menuFocus(page, helper, engine) {
  const res = {};
  for (const [w, h] of [[1440, 900], [1024, 600]]) {
    await at(page, w, h); await page.goto(`${OB}/help`, { waitUntil: 'networkidle' }); await settle(page); await mask(page);
    await scrollInstant(page, 1500); await page.waitForTimeout(300);
    const navInfo = () => page.evaluate(() => { const n = document.querySelector('nav[aria-label="On this page"]'); const r = n.getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), box_height: n.clientHeight, content_height: n.scrollHeight, scrolled_by: Math.round(n.scrollTop) }; });
    const v = { window: `${w} x ${h}`, reader_at_page_scrollY: 1500, menu_at_start: await navInfo(), links: [] };
    const links = await page.$$('nav[aria-label="On this page"] a'); let first = null;
    for (let i = 0; i < links.length; i++) { const hnd = links[i];
      let focus;
      if (i === 0) { await page.mouse.move(2, 2); await links[1].evaluate((el) => el.focus({ preventScroll: true })); await page.keyboard.press('Shift+Tab'); await page.waitForTimeout(250);
        const ok = await hnd.evaluate((el) => document.activeElement === el); focus = { how: ok ? 'keyboard (Shift+Tab from the link below)' : 'Shift+Tab did not land on this link', is_focused: ok, focus_visible: await hnd.evaluate((el) => el.matches(':focus-visible')) }; first = focus; }
      else { await links[i - 1].evaluate((el) => el.focus({ preventScroll: true })); await page.waitForTimeout(60); const pre = await navInfo();
        await page.keyboard.press('Tab'); await page.waitForTimeout(250);
        const ok = await hnd.evaluate((el) => document.activeElement === el);
        focus = { how: ok ? 'keyboard (Tab from the link above)' : 'Tab did not land on this link', is_focused: ok, focus_visible: await hnd.evaluate((el) => el.matches(':focus-visible')), menu_scrolled_by_before_tab: pre.scrolled_by }; }
      const afterTab = await hnd.evaluate((el) => { const n = el.closest('nav'), r = el.getBoundingClientRect(), b = n.getBoundingClientRect(); const top = b.top + n.clientTop, bottom = top + n.clientHeight;
        return { menu_top: Math.round(b.top), menu_scrolled_by: Math.round(n.scrollTop), link_fully_inside_menu_box: r.top >= top - 0.5 && r.bottom <= bottom + 0.5, link_fully_in_window: r.top >= 0 && r.bottom <= window.innerHeight, page_scrollY: Math.round(window.scrollY) }; });
      const words = (await hnd.evaluate((el) => el.innerText.trim())).slice(0, 40);
      const ring = await ringCheck(page, helper, hnd, `contents menu link ${i + 1}`, { center: false, alreadyFocused: focus, shot: engine === 'chromium' && (i === 0 || i === links.length - 1) ? `A2-2_menu_link_${i + 1}_${w}x${h}` : null });
      v.links.push({ n: i + 1, words, after_tab_before_any_scrolling_by_the_tool: afterTab, side_whole: ring.side_whole, all_four_sides_whole: ring.all_four_sides_whole, cut_px: ring.cut_px, clippers: ring.clippers, pixels: ring.pixels, control_box: ring.control_box, outline: ring.outline, focus: ring.focus }); }
    v.first_link_focus = first; v.menu_at_end = await navInfo();
    v.summary = { links: v.links.length, all_reached_by_tab: v.links.every((l) => l.focus.is_focused), all_focus_visible: v.links.every((l) => l.focus.focus_visible), all_scrolled_into_view_inside_menu: v.links.every((l) => l.after_tab_before_any_scrolling_by_the_tool.link_fully_inside_menu_box && l.after_tab_before_any_scrolling_by_the_tool.link_fully_in_window),
      links_with_all_four_sides_whole: v.links.filter((l) => l.all_four_sides_whole).length, menu_scrolled_during_tabbing_px: v.menu_at_end.scrolled_by - v.menu_at_start.scrolled_by };
    if (engine === 'chromium') { await links[links.length - 1].evaluate((el) => el.focus({ preventScroll: true })); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); await page.waitForTimeout(250); await page.screenshot({ path: `${SHOTS}/A2-2_help_menu_last_link_focused_${w}x${h}.png`, mask: coverFields(page) }); }
    res[`${w}x${h}`] = v;
  }
  return res;
}

// A2-2 (b) and (c): the Add control on billing and a password field with its show-or-hide button on Profile, at 375.
async function controls375(page, helper, engine) {
  const res = {}; await at(page, 375, 900);
  await page.goto(`${OB}/admin-portal/billing`, { waitUntil: 'networkidle' }); await settle(page); await mask(page);
  const add = await page.$('[data-testid="add-store-handoff"]');
  res.billing_375 = { path: await page.evaluate(() => location.pathname), sideways_overflow_px: await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) };
  if (add) { res.billing_375.add_control_words = (await add.evaluate((el) => el.innerText.trim())).slice(0, 40); res.billing_375.add_control = await ringCheck(page, helper, add, 'Add control', { shot: engine === 'chromium' ? 'A2-2_billing_add_375' : null });
    if (engine === 'chromium') { await kbFocus(page, add); await add.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' })); await page.waitForTimeout(250); await page.screenshot({ path: `${SHOTS}/A2-2_billing_add_375_window.png`, mask: coverFields(page) }); await add.evaluate((el) => el.blur()); } }
  else res.billing_375.add_control = 'not shown for this role or state';
  await page.goto(`${OB}/profile`, { waitUntil: 'networkidle' }); await settle(page); await mask(page);
  res.profile_375 = { path: await page.evaluate(() => location.pathname), sideways_overflow_px: await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) };
  const field = await page.$('input[type="password"]');
  if (field) { const toggle = await field.evaluateHandle((el) => el.parentElement.querySelector('button'));
    res.profile_375.password_field = await ringCheck(page, helper, field, 'password field (first)', { shot: engine === 'chromium' ? 'A2-2_profile_password_field_375' : null });
    res.profile_375.show_or_hide_button_words = await toggle.evaluate((el) => el.getAttribute('aria-label'));
    res.profile_375.show_or_hide_button = await ringCheck(page, helper, toggle.asElement(), 'show-or-hide button', { shot: engine === 'chromium' ? 'A2-2_profile_password_toggle_375' : null });
    if (engine === 'chromium') { await kbFocus(page, toggle.asElement()); await toggle.asElement().evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' })); await page.waitForTimeout(250); await page.screenshot({ path: `${SHOTS}/A2-2_profile_password_toggle_375_window.png`, mask: coverFields(page) }); await toggle.asElement().evaluate((el) => el.blur()); }
    res.profile_375.password_fields_left_empty = await page.evaluate(() => [...document.querySelectorAll('input[type="password"]')].every((i) => i.value === '')); }
  else res.profile_375.password_field = 'no password field found';
  return res;
}

const browsers = [['chromium', await chromium.launch({ channel: 'chrome' })]]; if (withWebkit) browsers.push(['webkit', await webkit.launch()]);
try {
  PRIVATE = await A.privateStrings();
  for (const [engine, b] of browsers) { R.engines[engine] = b.version();
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage(); const helper = await ctx.newPage(); await page.bringToFront();
    page.on('framenavigated', (f) => { if (f === page.mainFrame() && f.url().startsWith(A.SITES.pp)) R.portal_pages_loaded++; });
    (R.sessions_how ??= {})[engine] = await A.signIn(page, 'ob', ROLE); await settle(page);
    (R.items.help_go_to_top ??= {})[engine] = await help(page, helper, engine);
    (R.items.contents_menu_focus ??= {})[engine] = await menuFocus(page, helper, engine);
    (R.items.controls_375 ??= {})[engine] = await controls375(page, helper, engine);
    await ctx.close(); }
  R.served = A.servedReport();
} catch (e) { R.error = clean(String(e?.stack ?? e).split('\n').slice(0, 3).join(' | ')).replace(/https?:\/\/\S+/g, '[url]').slice(0, 500); }
finally { for (const [, b] of browsers) await b.close(); }
R.sessions = { ...A.counters, total_sign_ins: A.counters.password_sign_ins + A.counters.token_sign_ins };
R.finished = new Date().toISOString();
writeFileSync(`${out}/measure_a2_${label}.json`, JSON.stringify(JSON.parse(clean(JSON.stringify(R))), null, 1));
console.log(JSON.stringify({ label, error: R.error ?? null, sessions: R.sessions, portal_pages_loaded: R.portal_pages_loaded }));
process.exit(R.error ? 1 : 0);
