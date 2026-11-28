import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { scratchTarget, sqlRef } from '../../../../../../scripts/apbm007b/lib/env.mjs';
import * as auth from './auth.mjs';
import { target } from './guards.mjs';

const q = 'agent_docs/ACTIONS/ABM007_FINAL/QAM';
const je = join(q, 'evidence/Q2/J-e');
const jh = join(q, 'evidence/Q2/J-h');
const roles = auth.ALLOWLIST;
const owner = 'ENGINEERING_OWNER_A';
const invitee = 'ENGINEERING_INVITEE';
const member = 'ENGINEERING_MEMBER';
const obRepo = '/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev';
const origin = auth.SITES.ob;
const sha = value => createHash('sha256').update(value).digest('hex');
const load = path => JSON.parse(readFileSync(path, 'utf8'));
const save = (path, value, flag = 'w') => writeFileSync(path, JSON.stringify(value, null, 2) + '\n', { flag });
const now = () => new Date().toISOString();
const check = (condition, message) => { if (!condition) throw new Error(message); };
const baseline = load(join(je, 'entry-and-before-installed-chrome.json'));
const invitation = load(join(je, 'invite-installed-chrome.json'));
const approval = load(join(je, 'director-observation.json'));
const ledger = load(join(q, 'evidence/Q2/effects-progress.json'));
const castPath = join(homedir(), '.apbm007b/engineering_cast.json');
check((statSync(castPath).mode & 0o077) === 0, 'Private cast permissions too broad');
const cast = load(castPath);
const sc = scratchTarget();
target(sc.ref, sqlRef(sc.dbUrl));
check(approval.confirmedAccepted === true && approval.observation && approval.time, 'Director acceptance not recorded');
check(invitation.delivery === 'sent' && invitation.requests === 1 && ledger.invitation === 1 && ledger.invitationEmail === 1, 'Invitation receipt differs');
check(ledger.conservativeSessionCharge <= ledger.sessionCeiling - 7, 'Insufficient session budget');
check(ledger.memberRemovalCancel === 0 && ledger.memberRemovalConfirm === 0, 'Member action already used');
check(sha(readFileSync(join(q, 'QAM_TEST_PLAN.md'))) === baseline.planHash, 'Plan hash differs');
for (const {app, candidate} of baseline.candidates) {
  const repo = app === 'ob' ? obRepo : process.cwd();
  check(execFileSync('git', ['-C', repo, 'rev-parse', 'HEAD'], {encoding: 'utf8'}).trim() === candidate, 'Candidate HEAD differs');
  check(execFileSync('git', ['-C', repo, 'branch', '--show-current'], {encoding: 'utf8'}).trim() === baseline.branch, 'Branch differs');
  await auth.assertServedScratch(app);
  check(auth.servedReport()[app].listener_pid === baseline.target[app].listener_pid, 'Real QA process changed');
}

const pg = createRequire(join(obRepo, 'package.json'))('pg');
async function snapshot() {
  const db = new pg.Client({ connectionString: sc.dbUrl, ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000, statement_timeout: 15000 });
  const found = {};
  try {
    await db.connect();
    await db.query('begin isolation level repeatable read read only');
    for (const role of roles) {
      const u = (await db.query('select id from auth.users where lower(email) = $1', [cast[role].email.trim().toLowerCase()])).rows;
      check(u.length === 1, 'Existing fixture not found');
      found[role] = { id: u[0].id };
      found[role].stores = (await db.query(`
        select b.id, b.pharmacy_name as name, a.owner_user_id = $1 as owned,
          case when a.owner_user_id = $1 then 'owner' else ub.role end as capability, ub.role as membership,
          ub.is_primary as primary_membership, b.status
        from public.businesses b join public.accounts a on a.id = b.account_id
        left join public.user_businesses ub on ub.business_id = b.id and ub.user_id = $1
        where (a.owner_user_id = $1 or ub.user_id = $1) and public.store_is_live(b.id)
        order by b.pharmacy_name,b.id`, [u[0].id])).rows;
    }
    const invitations = (await db.query(`
      select id, business_id, status, accepted_user_id, role, dispatch_attempts
      from public.store_invitations where email = $1 order by created_at desc`,
    [cast[invitee].email.trim().toLowerCase()])).rows;
    await db.query('rollback');
    return { found, row: invitations.find(i => sha(i.id) === invitation.invitationKey) };
  } finally {
    await db.end();
  }
}
const summarize = ({found}) => Object.fromEntries(roles.map(role =>
  [role, found[role].stores.map(({id, ...rest}) => ({key: sha(id), ...rest}))]));
const equal = (x, y) => JSON.stringify(x) === JSON.stringify(y);
const comparable = stores => stores.map(({key, name, owned, capability, membership, primary_membership, status}) =>
  ({key, name, owned, capability, membership, primary_membership, status})).sort((a,b) => a.key.localeCompare(b.key));
const rowsEqual = (x, y) => equal(comparable(x), comparable(y));
const expectedAdd = (before, after, key) => {
  const retained = after.filter(store => before.some(old => old.key === store.key));
  const added = after.filter(store => !before.some(old => old.key === store.key));
  return {
    existingPharmacyAndRoleUnchanged: rowsEqual(retained, before),
    exactlyInvitedStoreAddedAsMember: added.length === 1 && added[0].key === key &&
      added[0].capability === 'member' && added[0].membership === 'member'
  };
};
const dummyOwn = {key: 'qa-owned', name: 'QA control owner', capability: 'owner', membership: 'admin'};
const dummyInvite = {key: 'qa-invited', name: 'QA control invited', capability: 'member', membership: 'member'};
const positives = expectedAdd([dummyOwn], [dummyOwn, dummyInvite], dummyInvite.key);
const scopeControls = {
  exactNewStoreAndPreservedRolePass: Object.values(positives).every(Boolean),
  unexpectedAdditionalStoreFails: !expectedAdd([dummyOwn], [dummyOwn, dummyInvite, {...dummyInvite, key:'qa-extra'}], dummyInvite.key).exactlyInvitedStoreAddedAsMember,
  lostExistingStoreFails: !expectedAdd([dummyOwn], [dummyInvite], dummyInvite.key).existingPharmacyAndRoleUnchanged,
  changedExistingRoleFails: !expectedAdd([dummyOwn], [{...dummyOwn, membership:'member'}, dummyInvite], dummyInvite.key).existingPharmacyAndRoleUnchanged
};
check(Object.values(scopeControls).every(Boolean), 'Invitation scope controls failed');
save(join(je, 'scope-controls.json'), { time: now(), controls: scopeControls }, 'wx');
const accepted = await snapshot();
const afterInvite = summarize(accepted);
const row = accepted.row;
const exactInvitation = row?.status === 'accepted' &&
  row.accepted_user_id === accepted.found[invitee].id && row.role === 'member' &&
  sha(row.business_id) === invitation.pharmacyKey;
const scope = {
  sameInvitationAcceptedByDesignatedInvitee: exactInvitation,
  sentOnce: row?.dispatch_attempts === 1,
  ...expectedAdd(baseline.roles[invitee], afterInvite[invitee], invitation.pharmacyKey),
  otherCastVisibilityUnchanged: roles.filter(r => r !== invitee).every(r => rowsEqual(afterInvite[r], baseline.roles[r]))
};
save(join(je, 'accepted-db-scope.json'), { time: now(), transaction: 'REPEATABLE READ READ ONLY; rollback',
  invitationStatus: row?.status ?? 'ROW NOT FOUND', dispatchAttempts: row?.dispatch_attempts ?? null, scope, roles: afterInvite }, 'wx');
check(exactInvitation, 'The exact invitation is not confirmed as accepted by the designated fixture');

mkdirSync(jh, { recursive: true });
const result = { time: now(), engine: 'installed Chrome', sessions: [], je: { scope, invitation: 'accepted' },
  jh: { cancel: 0, confirmClicks: 0, removePosts: 0 }, followUp: {} };
const progress = join(jh, 'execution.json');
const checkpoint = (flag = 'w') => save(progress, { ...result, auth: auth.counters, sessionDiagnostics: auth.sessionDiagnostics }, flag);
checkpoint('wx');
const { chromium } = createRequire(join(process.cwd(), 'package.json'))('playwright');
const browser = await chromium.launch({ channel: 'chrome' });
result.version = browser.version();
const contexts = [];
let stage = 'initialization';
const errors = [];
async function session(role) {
  const ctx = await browser.newContext();
  const evidence = { role, time: now() };
  result.sessions.push(evidence);
  contexts.push({ ctx, evidence });
  const page = await ctx.newPage();
  evidence.method = await auth.signIn(page, 'ob', role);
  checkpoint();
  return page;
}
const invitationPage = id => origin + '/admin-portal/stores/' + id + '/invite';
const storeOptions = async page => {
  await page.goto(origin + '/owedbook', { waitUntil: 'domcontentloaded' });
  const select = page.getByRole('combobox', {name: 'Store', exact: true});
  await select.waitFor();
  await page.waitForFunction(() => {
    const control = document.querySelector('select[aria-label="Store"]');
    return control?.options.length && ![...control.options].some(o => o.textContent === 'Loading stores…');
  });
  return await select.locator('option').evaluateAll(opts => opts.map(o => ({id: o.value, name: o.textContent})));
};
const recordOptions = options => options.map(({id, name}) => ({key: id ? sha(id) : null, name}));
const valuesMatch = (options, stores) => equal(options.map(x => sha(x.id)).sort(),
  stores.map(x => x.key).sort());
const bodyText = page => page.locator('body').innerText();
async function probe(label, fn) {
  stage = label;
  try { await fn(); } catch (e) {
    errors.push({stage, errorType: e.name, timeout: e.name === 'TimeoutError', time: now()});
  }
  checkpoint();
}
try {
  let aPage;
  await probe('Owner A accepted-invitation UI', async () => {
    aPage = await session(owner);
    await aPage.goto(invitationPage(row.business_id), { waitUntil: 'domcontentloaded' });
    const section = aPage.getByRole('region', {name: 'Invitations', exact: true});
    const entry = section.getByRole('listitem').filter({ hasText: cast[invitee].email.trim().toLowerCase() });
    const item = entry.filter({hasText: /· Member · accepted/});
    await item.first().waitFor({ timeout: 12000 });
    result.je.ownerAcceptedVisible = true;
  });
  await probe('Invitee store selector', async () => {
    const p = await session(invitee);
    const options = await storeOptions(p);
    result.je.inviteeOptions = recordOptions(options);
    const expectedKeys = [...baseline.roles[invitee].map(s => s.key), invitation.pharmacyKey].sort();
    result.je.expectedOptionsMatch = equal(options.map(s => sha(s.id)).sort(), expectedKeys);
  });
  result.je.result = !scope.existingPharmacyAndRoleUnchanged || !scope.exactlyInvitedStoreAddedAsMember ||
    result.je.expectedOptionsMatch === false ? 'FAIL' :
    (Object.values(scope).every(Boolean) && result.je.ownerAcceptedVisible && result.je.expectedOptionsMatch ? 'PASS' : 'INCOMPLETE');
  checkpoint();
  stage = 'pin designated Member removal';
  check(aPage && result.sessions.find(s => s.role === owner)?.method, 'Owner session unavailable for removal');
  const oldMember = accepted.found[member];
  check(oldMember.stores.length === 1 && oldMember.stores[0].capability === 'member' &&
    rowsEqual(afterInvite[member], baseline.roles[member]), 'Member fixture differs');
  const store = oldMember.stores[0];
  check(accepted.found[owner].stores.some(s => s.id === store.id && s.owned), 'Member pharmacy not owned by Owner A');
  const removePath = '/api/stores/' + store.id + '/members/' + oldMember.id + '/remove';
  const removalAllowed = (url, method) => url.origin === origin && url.pathname === removePath &&
    !url.search && method === 'POST';
  const controls = {
    correctPostAccepted: removalAllowed(new URL(removePath, origin), 'POST'),
    wrongIdentityRejected: !removalAllowed(new URL(removePath.replace(oldMember.id, 'wrong'), origin), 'POST'),
    wrongStoreRejected: !removalAllowed(new URL(removePath.replace(store.id, 'wrong'), origin), 'POST'),
    wrongOriginRejected: !removalAllowed(new URL(removePath, auth.SITES.pp), 'POST'),
    getRejected: !removalAllowed(new URL(removePath, origin), 'GET'),
    setComparatorEqual: rowsEqual(afterInvite[member], baseline.roles[member]),
    setComparatorRejectsAbsentStore: !rowsEqual([], baseline.roles[member])
  };
  check(Object.values(controls).every(Boolean), 'Removal controls failed');
  save(join(jh, 'controls.json'), { time: now(), controls }, 'wx');
  const mPage = await session(member);
  const memberBefore = await storeOptions(mPage);
  result.jh.memberOptionsBefore = recordOptions(memberBefore);
  check(valuesMatch(memberBefore, afterInvite[member]), 'Member browser baseline differs');
  await aPage.goto(invitationPage(store.id), { waitUntil: 'domcontentloaded' });
  const remove = aPage.getByTestId('remove-' + oldMember.id);
  const dialog = aPage.getByRole('dialog');
  let confirmAllowed = false;
  let blockedDuringCancel = 0;
  await aPage.route('**/api/stores/**/members/**/remove', route => {
    const req = route.request();
    if (!removalAllowed(new URL(req.url()), req.method())) return route.abort();
    if (!confirmAllowed) {
      blockedDuringCancel++;
      result.jh.blockedDuringCancel = blockedDuringCancel;
      checkpoint();
      return route.abort();
    }
    if (result.jh.removePosts) return route.abort();
    result.jh.removePosts = 1;
    checkpoint();
    return route.continue();
  });
  stage = 'cancel Member removal once';
  await remove.click();
  await dialog.waitFor();
  check((await dialog.getByRole('heading').innerText()).includes(store.name), 'Unexpected pharmacy in removal dialog');
  result.jh.pharmacy = store.name;
  result.jh.cancel = 1;
  checkpoint();
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  await dialog.waitFor({state:'hidden'});
  const afterCancel = summarize(await snapshot());
  result.jh.cancelPreservedAccess = rowsEqual(afterCancel[member], afterInvite[member]) && blockedDuringCancel === 0;
  checkpoint();
  check(result.jh.cancelPreservedAccess, 'Cancel did not preserve access without a removal request');
  stage = 'confirm Member removal once';
  await auth.assertServedScratch('ob');
  check(auth.servedReport().ob.listener_pid === baseline.target.ob.listener_pid, 'OwedBook process changed');
  await remove.click();
  await dialog.waitFor();
  const confirm = dialog.getByTestId('confirm-remove-access');
  await confirm.click({trial:true});
  confirmAllowed = true;
  result.jh.confirmClicks = 1;
  checkpoint();
  await probe('single confirm response', async () => {
    const [response] = await Promise.all([
      aPage.waitForResponse(r => r.request().method() === 'POST' && r.url() === origin + removePath, {timeout: 35000}),
      confirm.click()
    ]);
    result.jh.httpStatus = response.status();
    result.jh.removedResponse = (await response.json()).data?.removed === true;
  });
  await probe('post-removal read-only store visibility comparison', async () => {
    const afterRemove = summarize(await snapshot());
    const noNewStores = roles.every(r => afterRemove[r].every(s => afterInvite[r].some(x => x.key === s.key)));
    const othersUnchanged = roles.filter(r => r !== member).every(r => rowsEqual(afterRemove[r], afterInvite[r]));
    result.followUp.scope = { roles: afterRemove, reference: 'J-e after acceptance, immediately before J-h', noNewStores,
      otherCastVisibilityAndRolesUnchanged: othersUnchanged, memberHasZeroStores: afterRemove[member].length === 0 };
  });
  await probe('removed Member zero-store UI in same session', async () => {
    const options = await storeOptions(mPage);
    result.followUp.options = recordOptions(options);
    result.followUp.zeroStoreOnly = options.length === 1 && options[0].id === '' && options[0].name === 'No permitted stores';
    result.followUp.selectorDisabled = await mPage.getByRole('combobox', {name: 'Store', exact: true}).isDisabled();
  });
  await probe('removed Member cannot reopen old pharmacy', async () => {
    await mPage.goto(origin + '/admin-portal/stores/' + store.id, {waitUntil:'domcontentloaded'});
    await mPage.waitForURL(u => u.pathname === '/owedbook' || u.pathname === '/auth', {timeout:10000})
      .catch(() => {});
    const path = new URL(mPage.url()).pathname;
    result.followUp.removedRoute = { returnedToOwedBook: path === '/owedbook', hasFormerStoreName: (await bodyText(mPage)).includes(store.name),
      landed: path === '/owedbook' || path === '/auth' ? path : 'requested store route or other' };
  });
  result.jh.result = result.jh.cancelPreservedAccess && result.jh.removedResponse &&
    result.followUp.scope?.memberHasZeroStores ? 'PASS' : 'INCOMPLETE';
} catch (e) {
  errors.push({stage, errorType: e.name, timeout: e.name === 'TimeoutError', time: now()});
  result.jh.result ??= 'INCOMPLETE';
} finally {
  for (const { ctx, evidence } of contexts) {
    evidence.signout = await ctx.request.post(origin + '/api/auth/logout', {timeout: 6000}).then(r => r.status(), () => 'UNCONFIRMED');
    await ctx.close();
  }
  await browser.close();
  result.errors = errors;
  checkpoint();
}
console.log(JSON.stringify({je: result.je.result, jh: result.jh.result, removePosts: result.jh.removePosts,
  zeroStoreOnly: result.followUp.zeroStoreOnly, errors}));
