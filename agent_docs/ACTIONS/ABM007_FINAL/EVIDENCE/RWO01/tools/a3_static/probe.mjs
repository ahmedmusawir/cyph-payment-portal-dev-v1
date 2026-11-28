// Static probe: scroll position over time after activating "Go to the Top" links on a file copy of Help.
process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/home/moose/APBM007B_REPAIR_R2/browsers';
import { createRequire } from 'node:module';
const pw = createRequire('/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/package.json')('playwright');
const url = process.argv[2]; const engines = (process.argv[3] || 'firefox').split(','); const arts = (process.argv[4] || '1,7,13').split(',').map(Number);
const pre = process.argv[5] || '';   // optional JS run in the page before the test (to try a candidate change)
for (const e of engines) { const b = await pw[e].launch(e === 'chromium' ? { channel: 'chrome' } : {}); console.log('##', e, b.version());
  for (const [w, h] of [[1024, 600], [1440, 900], [375, 900]]) for (const art of arts) for (const how of ['keyboard', 'mouse']) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } }); const page = await ctx.newPage(); await page.goto(url); await page.waitForTimeout(300);
    if (pre) await page.evaluate(pre);
    const link = (await page.$$('a[href="#top"]'))[art - 1];
    await link.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' })); await page.waitForTimeout(200);
    const y0 = await page.evaluate(() => Math.round(scrollY));
    if (how === 'keyboard') { await link.evaluate((el) => el.focus({ preventScroll: true })); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); await page.waitForTimeout(200);
      const ok = await link.evaluate((el) => document.activeElement === el); if (!ok) await link.evaluate((el) => el.focus({ preventScroll: true })); }
    const y1 = await page.evaluate(() => Math.round(scrollY));
    await page.evaluate(() => { window.__t0 = performance.now(); window.__log = []; addEventListener('scroll', () => window.__log.push([Math.round(performance.now() - window.__t0), Math.round(scrollY)])); });
    if (how === 'keyboard') await page.keyboard.press('Enter'); else { const r = await link.boundingBox(); await page.mouse.click(r.x + r.width / 2, r.y + r.height / 2); }
    const t = {}; let last = 0; for (const ms of [0, 100, 300, 800, 2000]) { await page.waitForTimeout(ms - last); last = ms; t[ms] = await page.evaluate(() => Math.round(scrollY)); }
    const end = await page.evaluate(() => ({ hash: location.hash, active: document.activeElement ? `${document.activeElement.tagName.toLowerCase()}${document.activeElement.id ? '#' + document.activeElement.id : ''} "${(document.activeElement.innerText || '').slice(0, 20)}"` : null, log: window.__log.slice(0, 12) }));
    console.log(`${w}x${h} art ${String(art).padStart(2)} ${how.padEnd(8)} start ${y0}${y1 !== y0 ? `(->${y1} after focus)` : ''} | ${Object.entries(t).map(([k, v]) => `${k}ms:${v}`).join(' ')} | ${end.hash} | focus: ${end.active} | scroll events ${JSON.stringify(end.log)}`);
    await ctx.close(); }
  await b.close(); }
