// ABM007_FINAL RWO-01 add-on A3 — shared measuring steps for driver_a3.mjs. Test tooling only.
// timeline(): open Help fresh, put one "Go to the Top" link where asked, activate it by mouse or by real key presses,
// and read the page's scroll position at 0, 100, 300, 800 and 2,000 ms, with every scroll event in between.
export const TOPS = 'a[href="#top"]';
export const TIMES = [0, 100, 300, 800, 2000];
export const SIZES = [[1024, 600], [1440, 900], [375, 900]];

export async function kbFocus(page, h) {
  await page.mouse.move(2, 2);
  await h.evaluate((el) => el.focus({ preventScroll: true }));
  await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); await page.waitForTimeout(200);
  if (await h.evaluate((el) => document.activeElement === el)) return 'keyboard (Shift+Tab, then Tab back onto the link)';
  await h.evaluate((el) => el.focus({ preventScroll: true })); return 'script focus after key presses (Tab did not return to the link in this engine)';
}

const describeActive = () => { const a = document.activeElement; if (!a || a === document.body) return { what: 'nothing (the page body)', in_window: null };
  const r = a.getBoundingClientRect(); const sec = a.closest('section[id]');
  return { what: `${a.tagName.toLowerCase()}${a.id ? `#${a.id}` : ''} "${(a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 30)}"${sec ? ` in article ${sec.id}` : a.closest('nav') ? ' in the contents menu' : a.closest('body > div > header, header') ? ' in a header' : ''}`,
    in_window: r.bottom > 0 && r.top < innerHeight, top: Math.round(r.top), focus_visible: a.matches(':focus-visible'), outline: (() => { const c = getComputedStyle(a); return `${c.outlineStyle} ${c.outlineWidth} ${c.outlineColor}`; })() }; };

/** place: 'center' | 'bottom' (shortest distance from the top) | 'top' (longest distance for that link). */
/** order: 'scroll-then-focus' (the link is placed, then focused by key presses) or 'focus-then-scroll' (the link is
 *  focused by key presses, then a script calls scrollIntoView on it: the order in which Firefox showed the defect). */
export async function timeline(page, OB, { w, h, art, how, place = 'center', order = 'scroll-then-focus', before = null }) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(`${OB}/help`, { waitUntil: 'networkidle' }); await page.waitForTimeout(400);
  if (before) await before(page);
  const link = (await page.$$(TOPS))[art - 1]; if (!link) return { w, h, art, how, place, error: 'link not found' };
  const put = async () => { await link.evaluate((el, p) => el.scrollIntoView({ block: p === 'bottom' ? 'end' : p === 'top' ? 'start' : 'center', behavior: 'instant' }), place); await page.waitForTimeout(250); };
  let focus = null;
  if (how === 'keyboard' && order === 'focus-then-scroll') { await put(); focus = await kbFocus(page, link); await put(); }
  else { await put(); if (how === 'keyboard') focus = await kbFocus(page, link); }
  const start = await page.evaluate(() => Math.round(scrollY)); const afterFocus = start;
  await page.evaluate(() => { window.__a3 = { t0: performance.now(), log: [] }; addEventListener('scroll', () => window.__a3.log.push([Math.round(performance.now() - window.__a3.t0), Math.round(scrollY)]), { passive: true }); });
  if (how === 'keyboard') await page.keyboard.press('Enter'); else { const r = await link.boundingBox(); await page.mouse.click(r.x + r.width / 2, r.y + r.height / 2); }
  const at = {}; let last = 0; for (const ms of TIMES) { if (ms > last) await page.waitForTimeout(ms - last); last = ms; at[ms] = await page.evaluate(() => Math.round(scrollY)); }
  const end = await page.evaluate((fn) => ({ hash: location.hash, header_in_view: (() => { const r = document.querySelector('body header')?.getBoundingClientRect(); return !!r && r.top >= 0 && r.bottom > 0; })(), focus: (new Function(`return (${fn})()`))(), scroll_events: window.__a3.log.slice(0, 40), scroll_event_count: window.__a3.log.length }), describeActive.toString());
  await page.keyboard.press('Tab'); await page.waitForTimeout(120);
  end.next_tab_goes_to = await page.evaluate((fn) => (new Function(`return (${fn})()`))().what, describeActive.toString());
  return { w, h, art, how, place, order: how === 'keyboard' ? order : 'not applicable (mouse)', key_focus: focus, start_scrollY: start, scrollY_after_focus: afterFocus, scrollY_at_ms: at, at_top_and_stays: TIMES.every((ms) => at[ms] === 0) && end.header_in_view, ...end };
}

export const line = (r) => `${r.w}x${r.h} art ${String(r.art).padStart(2)} ${r.how.padEnd(8)} ${r.place.padEnd(6)} ${String(r.order).slice(0, 17).padEnd(17)} start ${String(r.start_scrollY).padStart(5)} | ${TIMES.map((ms) => `${ms}:${r.scrollY_at_ms?.[ms]}`).join(' ')} | ${r.at_top_and_stays ? 'OK  ' : 'FAIL'} | focus: ${r.focus?.what} ${r.focus?.in_window === false ? '(out of view)' : ''} | ev ${JSON.stringify((r.scroll_events || []).slice(0, 8))}`;

/** The full grid the work order asks for. Article 1 also from the shortest and the longest distance. */
export async function grid(page, OB, log, opts = {}) {
  const out = [];
  for (const [w, h] of SIZES) for (const art of [1, 7, 13]) for (const how of ['keyboard', 'mouse']) for (const place of (art === 1 ? ['center', 'bottom', 'top'] : ['center']))
    for (const order of (how === 'keyboard' ? ['scroll-then-focus', 'focus-then-scroll'] : ['scroll-then-focus'])) {
      const r = await timeline(page, OB, { w, h, art, how, place, order, ...opts }); out.push(r); log(`${opts.tag ?? ''} ${line(r)}`); }
  return out;
}
