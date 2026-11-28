import { TOPS, TIMES, kbFocus } from '/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/RWO01/tools/lib_a3.mjs';
// one activation on the CURRENT page (no reload)
async function act(page, art, how, place = 'center') {
  const link = (await page.$$(TOPS))[art - 1];
  await link.evaluate((el, p) => el.scrollIntoView({ block: p === 'bottom' ? 'end' : p === 'top' ? 'start' : 'center', behavior: 'instant' }), place); await page.waitForTimeout(250);
  const hash0 = await page.evaluate(() => location.hash); const start = await page.evaluate(() => Math.round(scrollY));
  if (how === 'keyboard') await kbFocus(page, link);
  await page.evaluate(() => { window.__a3 = { t0: performance.now(), log: [] }; if (!window.__a3on) { window.__a3on = 1; addEventListener('scroll', () => window.__a3.log.push([Math.round(performance.now() - window.__a3.t0), Math.round(scrollY)]), { passive: true }); } });
  if (how === 'keyboard') await page.keyboard.press('Enter'); else { const r = await link.boundingBox(); await page.mouse.click(r.x + r.width / 2, r.y + r.height / 2); }
  const at = {}; let last = 0; for (const ms of TIMES) { if (ms > last) await page.waitForTimeout(ms - last); last = ms; at[ms] = await page.evaluate(() => Math.round(scrollY)); }
  const ev = await page.evaluate(() => window.__a3.log.slice(0, 10));
  return `art ${art} ${how} hash-before "${hash0}" start ${start} | ${TIMES.map((ms) => ms + ':' + at[ms]).join(' ')} | ${TIMES.every((ms) => at[ms] === 0) ? 'OK' : 'FAIL'} | ev ${JSON.stringify(ev)} | history.length ${await page.evaluate(() => history.length)}`;
}
export default async ({ pages, OB, log }) => { const page = pages.firefox;
  for (const [w, h] of [[1024, 600], [1440, 900]]) { await page.setViewportSize({ width: w, height: h });
    log(`== ${w}x${h} A: same page, no reload between activations: mouse 1, keyboard 1, keyboard 7, keyboard 1, mouse 1, keyboard 13, keyboard 1`);
    await page.goto(OB + '/help', { waitUntil: 'networkidle' }); await page.waitForTimeout(400);
    for (const [a, how] of [[1, 'mouse'], [1, 'keyboard'], [7, 'keyboard'], [1, 'keyboard'], [1, 'mouse'], [13, 'keyboard'], [1, 'keyboard']]) log(await act(page, a, how));
    log(`== ${w}x${h} B: fresh load to domcontentloaded only, keyboard on article 1 at once`);
    await page.goto(OB + '/help', { waitUntil: 'domcontentloaded' }); log(await act(page, 1, 'keyboard'));
    log(`== ${w}x${h} C: page opened with #top already in the address, keyboard on article 1, then 7`);
    await page.goto(OB + '/help#top', { waitUntil: 'networkidle' }); await page.waitForTimeout(400); log(await act(page, 1, 'keyboard')); log(await act(page, 7, 'keyboard')); log(await act(page, 1, 'mouse'));
  }
  return 'see log'; };
