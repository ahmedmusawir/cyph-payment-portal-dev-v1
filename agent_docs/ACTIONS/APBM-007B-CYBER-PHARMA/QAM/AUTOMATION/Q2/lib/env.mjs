// APBM-007B — scoped private configuration loader (ENVIRONMENT_AND_EFFECTS.md "Targets and private configuration").
// Reads ONLY the named keys a caller asks for from an existing .env.local, in memory. It never prints, exports, hashes
// or writes a value; reports carry names, presence and non-secret project references only.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const ROOT = '/home/moose/NEXTJS/CYBER_PHARMA';
export const PORTAL = `${ROOT}/cyph-payment-portal-dev-v1`;
export const OWEDBOOK = `${ROOT}/cyph-v1-dev`;
export const SCRATCH_REF = 'ihgcsrypblqkwommrkgj';
export const DEV_REF = 'yrsuwikjnbmvpznrgydb';
export const MODULE = `${PORTAL}/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA`;
export const EVIDENCE_ROOT = `${MODULE}/QAM/evidence/Q2/01/campaign`;

const fail = (m) => { throw new Error(`FAIL-CLOSED: ${m}`); };

/** Minimal dotenv parse (last duplicate wins, as dotenv does). Values stay inside the returned object. */
function parse(text) {
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)?\s*$/);
    if (!m) continue;
    let v = (m[2] ?? '').trim();
    if (/^(['"]).*\1$/.test(v)) v = v.slice(1, -1); else v = v.replace(/\s+#.*$/, '');
    out[m[1]] = v;
  }
  return out;
}

/**
 * Load exactly `names` from `<repo>/.env.local`. Required names that are missing or empty fail closed, naming only
 * the key. Optional names are returned as undefined when absent.
 */
export function loadNamed(repo, { required = [], optional = [] } = {}) {
  const file = join(repo, '.env.local');
  if (!existsSync(file)) fail(`${repo}/.env.local not found`);
  const all = parse(readFileSync(file, 'utf8'));
  const out = {};
  for (const n of required) { if (!all[n]?.trim()) fail(`missing required name ${n}`); out[n] = all[n].trim(); }
  for (const n of optional) out[n] = all[n]?.trim() || undefined;
  return Object.freeze(out);
}

/** Presence report for names only. */
export function presence(repo, names) {
  const file = join(repo, '.env.local');
  const all = existsSync(file) ? parse(readFileSync(file, 'utf8')) : {};
  return Object.fromEntries(names.map((n) => [n, !!all[n]?.trim()]));
}

export function apiRef(value) {
  try { const u = new URL(value); return u.protocol === 'https:' ? u.hostname.match(/^([a-z0-9]{20})\.supabase\.co$/)?.[1] : undefined; } catch { return undefined; }
}
export function sqlRef(value) {
  try {
    const u = new URL(value); if (!['postgres:', 'postgresql:'].includes(u.protocol)) return undefined;
    return u.hostname.match(/^db\.([a-z0-9]{20})\.supabase\.co$/)?.[1]
      ?? (/\.pooler\.supabase\.com$/.test(u.hostname) ? decodeURIComponent(u.username).match(/^postgres\.([a-z0-9]{20})$/)?.[1] : undefined);
  } catch { return undefined; }
}

/** The SCRATCH database set from OwedBook's private file, verified to be SCRATCH by both API and SQL reference. */
export function scratchTarget() {
  const e = loadNamed(OWEDBOOK, { required: ['APBM_SCRATCH_DB_URL', 'APBM_SCRATCH_SUPABASE_URL', 'APBM_SCRATCH_PUBLISHABLE_KEY', 'APBM_SCRATCH_SECRET_KEY'] });
  if (apiRef(e.APBM_SCRATCH_SUPABASE_URL) !== SCRATCH_REF || sqlRef(e.APBM_SCRATCH_DB_URL) !== SCRATCH_REF) fail('SCRATCH identity mismatch');
  return Object.freeze({ ref: SCRATCH_REF, dbUrl: e.APBM_SCRATCH_DB_URL, url: e.APBM_SCRATCH_SUPABASE_URL, publishableKey: e.APBM_SCRATCH_PUBLISHABLE_KEY, secretKey: e.APBM_SCRATCH_SECRET_KEY });
}

/** DEV set, read-only use unless a released apply checkpoint says otherwise. */
export function devTarget() {
  const e = loadNamed(OWEDBOOK, { required: ['APBM_DEV_DB_URL', 'APBM_DEV_SUPABASE_URL'] });
  if (apiRef(e.APBM_DEV_SUPABASE_URL) !== DEV_REF || sqlRef(e.APBM_DEV_DB_URL) !== DEV_REF) fail('DEV identity mismatch');
  return Object.freeze({ ref: DEV_REF, dbUrl: e.APBM_DEV_DB_URL, url: e.APBM_DEV_SUPABASE_URL });
}

/** Stripe sandbox set from the Portal's private file: test key only. */
export function stripeTarget() {
  const e = loadNamed(PORTAL, { required: ['STRIPE_SECRET_KEY', 'STRIPE_EXPECTED_ACCOUNT', 'STRIPE_PRICE_STORES'], optional: ['APA_PROMOTION_CODES'] });
  if (!/^(sk|rk)_test_/.test(e.STRIPE_SECRET_KEY)) fail('a Stripe TEST key is required');
  return e;
}

/** Redact anything that looks like a credential before a string can reach a log or evidence file. */
export function scrub(s) {
  return String(s ?? '')
    .replace(/(sk|rk|pk)_(test|live)_[A-Za-z0-9]+/g, '$1_$2_[redacted]')
    .replace(/whsec_[A-Za-z0-9]+/g, 'whsec_[redacted]')
    .replace(/sb_(secret|publishable)_[A-Za-z0-9_-]+/g, 'sb_$1_[redacted]')
    .replace(/re_[A-Za-z0-9]{8,}_[A-Za-z0-9]+/g, 're_[redacted]')
    .replace(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[jwt]')
    .replace(/postgres(ql)?:\/\/[^\s"']+/g, '[db-url]')
    .replace(/https:\/\/invoice\.stripe\.com\/\S+/g, '[hosted-invoice-url]')
    .replace(/acct_[A-Za-z0-9]{6,}([A-Za-z0-9]{4})/g, 'acct_[redacted]$1');
}
