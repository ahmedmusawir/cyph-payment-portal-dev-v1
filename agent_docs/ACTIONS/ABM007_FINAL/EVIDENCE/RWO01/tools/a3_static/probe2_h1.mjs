// Static probe 2: Tab onto article 1's link, scroll the page while the link has focus, then activate.
process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/home/moose/APBM007B_REPAIR_R2/browsers';
import { createRequire } from 'node:module';
const pw = createRequire('/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/package.json')('playwright');
const url = process.argv[2]; const TIMES = [0, 100, 300, 800, 2000];
const b = await pw.firefox.launch(); console.log('## firefox', b.version(), url.slice(-30));
const variants = {
  script_centre: (page) => page.evaluate(() => document.activeElement.scrollIntoView({ block: 'center', behavior: 'instant' })),
  scrollTo: (page) => page.evaluate(() => { const r = document.activeElement.getBoundingClientRect(); window.scrollTo(0, scrollY + r.top + r.height / 2 - innerHeight / 2); }),
  wheel: async (page) => { await page.mouse.move(700, 300); await page.mouse.wheel(0, 120); },
  none: async () => {},
};
for (const [w, h] of [[1024, 600], [1440, 900]]) for (const [vn, v] of Object.entries(variants)) for (const how of ['keyboard', 'mouse']) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }); const page = await ctx.newPage(); await page.goto(url); await page.waitForTimeout(400);
  if (process.argv[3] === 'h1') await page.evaluate(() => { const x = document.querySelector('h1'); x.id = 'top'; x.tabIndex = -1; x.style.scrollMarginTop = '100vh'; });
  const menu = await page.$$('nav[aria-label="On this page"] a'); await menu[menu.length - 1].evaluate((el) => el.focus({ preventScroll: true }));
  await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.waitForTimeout(300);
  await v(page); await page.waitForTimeout(400);
  const info = await page.evaluate(() => ({ y: Math.round(scrollY), sec: document.activeElement?.closest('section')?.id }));
  await page.evaluate(() => { window.__l = []; const t0 = performance.now(); addEventListener('scroll', () => window.__l.push([Math.round(performance.now() - t0), Math.round(scrollY)])); });
  if (how === 'keyboard') await page.keyboard.press('Enter');
  else { const r = await page.evaluate(() => { const q = document.activeElement.getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2 }; }); await page.mouse.click(r.x, r.y); }
  const at = {}; let last = 0; for (const ms of TIMES) { if (ms > last) await page.waitForTimeout(ms - last); last = ms; at[ms] = await page.evaluate(() => Math.round(scrollY)); }
  const act = await page.evaluate(() => (document.activeElement?.tagName || '') + ' ' + (document.activeElement?.innerText || '').slice(0, 14));
  console.log(`${act.padEnd(22)} ${w}x${h} ${vn.padEnd(13)} ${how.padEnd(8)} (${info.sec}) start ${info.y} | ${TIMES.map((ms) => ms + ':' + at[ms]).join(' ')} | ${TIMES.every((ms) => at[ms] === 0) ? 'OK' : 'FAIL'} | ${JSON.stringify(await page.evaluate(() => window.__l.slice(0, 6)))}`);
  await ctx.close();
}
await b.close();
