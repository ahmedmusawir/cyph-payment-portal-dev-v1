import { TOPS, TIMES } from '/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/RWO01/tools/lib_a3.mjs';
const rec = async (page) => { await page.evaluate(() => { window.__a3 = { t0: performance.now(), log: [] }; if (!window.__a3on) { window.__a3on = 1; addEventListener('scroll', () => window.__a3.log.push([Math.round(performance.now() - window.__a3.t0), Math.round(scrollY)]), { passive: true }); for (const t of ['keydown','keyup','keypress','click','focusin','hashchange','popstate']) addEventListener(t, (e) => window.__a3.log.push([Math.round(performance.now() - window.__a3.t0), t + (e.key ? ':' + e.key : '')]), true); } }); };
const read = async (page, label) => { const at = {}; let last = 0; for (const ms of TIMES) { if (ms > last) await page.waitForTimeout(ms - last); last = ms; at[ms] = await page.evaluate(() => Math.round(scrollY)); }
  return `${label} | ${TIMES.map((ms) => ms + ':' + at[ms]).join(' ')} | ${TIMES.every((ms) => at[ms] === 0) ? 'OK' : 'FAIL'} | active: ${await page.evaluate(() => (document.activeElement?.innerText || document.activeElement?.tagName || '').slice(0, 24))} | ${JSON.stringify(await page.evaluate(() => window.__a3.log.slice(0, 16)))}`; };
export default async ({ pages, OB, log }) => { const page = pages.firefox;
  for (const [w, h] of [[1024, 600], [1440, 900]]) { await page.setViewportSize({ width: w, height: h });
    for (const delay of [60, 150, 400]) { await page.goto(OB + '/help', { waitUntil: 'networkidle' }); await page.waitForTimeout(400);
      const link = (await page.$$(TOPS))[0]; await link.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' })); await page.waitForTimeout(200);
      await link.evaluate((el) => el.focus({ preventScroll: true })); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); await page.waitForTimeout(200);
      const y = await page.evaluate(() => Math.round(scrollY)); await rec(page); await page.keyboard.down('Enter'); await page.waitForTimeout(delay); await page.keyboard.up('Enter');
      log(await read(page, `${w}x${h} D: Enter held ${delay} ms, start ${y}`)); }
    // E: reach article 1's link only by Tab, from the last contents menu link, with the page at the top; no script scrolling
    await page.goto(OB + '/help', { waitUntil: 'networkidle' }); await page.waitForTimeout(400);
    const menu = await page.$$('nav[aria-label="On this page"] a'); await menu[menu.length - 1].evaluate((el) => el.focus({ preventScroll: true })); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); await page.waitForTimeout(150);
    await page.keyboard.press('Tab'); await page.waitForTimeout(400);
    let info = await page.evaluate(() => ({ y: Math.round(scrollY), active: (document.activeElement?.innerText || '').slice(0, 20), sec: document.activeElement?.closest('section')?.id }));
    await rec(page); await page.keyboard.press('Enter'); log(await read(page, `${w}x${h} E: Tab from the last menu link to ${info.active} (${info.sec}), start ${info.y}`));
    // F: like E, then scroll the link to the centre by mouse wheel (focus stays), then Enter
    await page.goto(OB + '/help', { waitUntil: 'networkidle' }); await page.waitForTimeout(400);
    const menu2 = await page.$$('nav[aria-label="On this page"] a'); await menu2[menu2.length - 1].evaluate((el) => el.focus({ preventScroll: true })); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.waitForTimeout(300);
    await page.evaluate(() => document.activeElement.scrollIntoView({ block: 'center', behavior: 'instant' })); await page.waitForTimeout(300);
    info = await page.evaluate(() => ({ y: Math.round(scrollY), active: (document.activeElement?.innerText || '').slice(0, 20), sec: document.activeElement?.closest('section')?.id }));
    await rec(page); await page.keyboard.press('Enter'); log(await read(page, `${w}x${h} F: Tab to ${info.active} (${info.sec}), centred, start ${info.y}`));
    // G: click a contents menu link first (address becomes #getting-around), then centre article 1's link, keyboard Enter
    await page.goto(OB + '/help', { waitUntil: 'networkidle' }); await page.waitForTimeout(400);
    await (await page.$$('nav[aria-label="On this page"] a'))[0].click(); await page.waitForTimeout(500);
    const l1 = (await page.$$(TOPS))[0]; await l1.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' })); await page.waitForTimeout(200);
    await l1.evaluate((el) => el.focus({ preventScroll: true })); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); await page.waitForTimeout(200);
    info = await page.evaluate(() => ({ y: Math.round(scrollY), h: location.hash })); await rec(page); await page.keyboard.press('Enter'); log(await read(page, `${w}x${h} G: after a menu jump (${info.h}), start ${info.y}`));
  }
  return 'see log'; };
