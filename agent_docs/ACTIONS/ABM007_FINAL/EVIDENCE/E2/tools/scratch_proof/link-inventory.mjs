// ABM007_FINAL AC-F02 support: lists the cross-app links each app offers a Store admin on the routes walked (texts with an "@" dropped).
import { createRequire } from 'node:module';
const { chromium } = createRequire('/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/package.json')('playwright');
const A = await import('/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/E2/tools/scratch_proof/auth.mjs');
const b = await chromium.launch({ channel: 'chrome' });
for (const [app, role, routes] of [['ob', 'ENGINEERING_ADMIN', ['/owedbook', '/admin-portal', '/admin-portal/billing', '/admin-portal/settings', '/admin-portal/audit', '/profile', '/help']], ['pp', 'ENGINEERING_ADMIN', ['/dashboard', '/billing']]]) {
  const p = await (await b.newContext()).newPage(); await A.signIn(p, app, role);
  for (const r of routes) { await p.goto(`${A.SITES[app]}${r}`, { waitUntil: 'networkidle' });
    const l = await p.evaluate((other) => [...document.querySelectorAll('a[href], button, form[action]')].map((e) => ({ t: (e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 40), h: e.getAttribute('href') || e.getAttribute('action') || '' }))
      .filter((x) => x.h.includes(other) || /handoff|billing|owedbook|account/i.test(x.h + ' ' + x.t)).filter((x) => !/@/.test(x.t)), app === 'ob' ? ':3101' : ':3100');
    console.log(app, r, '->', new URL(p.url()).pathname, JSON.stringify(l)); }
}
await b.close();
