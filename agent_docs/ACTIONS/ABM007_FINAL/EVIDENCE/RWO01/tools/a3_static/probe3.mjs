// Static probe 3: both step orders, optional candidate change applied to the DOM first, any engines.
process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/home/moose/APBM007B_REPAIR_R2/browsers';
import { createRequire } from 'node:module';
const pw = createRequire('/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/package.json')('playwright');
const url = process.argv[2]; const engines = process.argv[3].split(','); const cand = process.argv[4] || 'none'; const TIMES = [0, 100, 300, 800, 2000];
const CANDS = {
  none: () => {},
  // h1 becomes a real, focusable #top target; a scroll margin of one window height makes "scroll to it" mean "scroll to the very top"
  h1: () => { const h = document.querySelector('h1'); h.id = 'top'; h.tabIndex = -1; h.style.scrollMarginTop = '100vh'; },
};
for (const e of engines) { const b = await pw[e].launch(e === 'chromium' ? { channel: 'chrome' } : {}); console.log('##', e, b.version(), 'candidate:', cand);
  for (const [w, h] of [[1024, 600], [1440, 900], [375, 900]]) for (const art of [1, 7, 13]) for (const how of ['keyboard', 'mouse']) for (const order of ['scroll-then-focus', 'focus-then-scroll']) {
    if (how === 'mouse' && order === 'focus-then-scroll') continue;
    const ctx = await b.newContext({ viewport: { width: w, height: h } }); const page = await ctx.newPage(); await page.goto(url); await page.waitForTimeout(300);
    await page.evaluate(CANDS[cand]);
    const link = (await page.$$('a[href="#top"]'))[art - 1];
    const centre = () => link.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    const focus = async () => { await link.evaluate((el) => el.focus({ preventScroll: true })); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); await page.waitForTimeout(150); if (!(await link.evaluate((el) => document.activeElement === el))) await link.evaluate((el) => el.focus({ preventScroll: true })); };
    if (how === 'mouse') await centre(); else if (order === 'scroll-then-focus') { await centre(); await page.waitForTimeout(150); await focus(); } else { await focus(); await centre(); }
    await page.waitForTimeout(300); const y = await page.evaluate(() => Math.round(scrollY));
    await page.evaluate(() => { window.__l = []; const t0 = performance.now(); addEventListener('scroll', () => window.__l.push([Math.round(performance.now() - t0), Math.round(scrollY)])); });
    if (how === 'keyboard') await page.keyboard.press('Enter'); else { const r = await link.boundingBox(); await page.mouse.click(r.x + r.width / 2, r.y + r.height / 2); }
    const at = {}; let last = 0; for (const ms of TIMES) { if (ms > last) await page.waitForTimeout(ms - last); last = ms; at[ms] = await page.evaluate(() => Math.round(scrollY)); }
    const end = await page.evaluate(() => { const a = document.activeElement; const r = a?.getBoundingClientRect(); const hd = document.querySelector('body header').getBoundingClientRect(); return { a: a ? `${a.tagName.toLowerCase()}${a.id ? '#' + a.id : ''} "${(a.innerText || '').slice(0, 14)}"` : null, vis: a && a !== document.body ? r.bottom > 0 && r.top < innerHeight : null, fv: a?.matches(':focus-visible'), hdr: hd.top >= 0 && hd.bottom > 0 }; });
    // where does the next Tab go?
    await page.keyboard.press('Tab'); const next = await page.evaluate(() => { const a = document.activeElement; return `${a.tagName.toLowerCase()} "${(a.innerText || '').slice(0, 16)}"${a.closest('nav') ? ' (menu)' : a.closest('section') ? ' (article ' + a.closest('section').id + ')' : ''}`; });
    const ok = TIMES.every((ms) => at[ms] === 0) && end.hdr;
    console.log(`${w}x${h} art ${String(art).padStart(2)} ${how.padEnd(8)} ${order.padEnd(17)} start ${String(y).padStart(5)} | ${TIMES.map((ms) => ms + ':' + at[ms]).join(' ')} | ${ok ? 'OK  ' : 'FAIL'} | focus ${end.a} vis=${end.vis} ring=${end.fv} | next Tab: ${next}`);
    await ctx.close(); }
  await b.close(); }
