#!/usr/bin/env node
// APBM-007B — privacy scan for evidence/packages (credential-shaped values, DB URLs, JWTs, hosted invoice links, emails).
// cwd: any.
//
//   node scripts/apbm007b/privacy-scan.mjs --help
//   node scripts/apbm007b/privacy-scan.mjs --self-test          # synthetic poison and clean controls; no external effect
//   node scripts/apbm007b/privacy-scan.mjs --dir <path> [--allow-emails <domain,...>]
//
// Reports file + pattern NAME + count only (never the matched value). Exit 1 on any hit. Binary files (png/zip) are
// skipped and listed. Synthetic test domains (*.invalid) are always allowed.
import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, relative } from 'node:path';

export const RULES = {
  stripe_secret: /\b(sk|rk)_(test|live)_[A-Za-z0-9]{12,}/g, stripe_webhook: /\bwhsec_[A-Za-z0-9]{16,}/g, supabase_key: /\bsb_(secret|publishable)_[A-Za-z0-9_-]{12,}/g,
  resend_key: /\bre_[A-Za-z0-9]{6,}_[A-Za-z0-9]{8,}/g, jwt: /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/g,
  db_url_with_password: /postgres(ql)?:\/\/[^\s:@/]+:[^\s@/]+@/g, private_key: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
  hosted_invoice_link: /https:\/\/invoice\.stripe\.com\/i\/[A-Za-z0-9_]{10,}/g, full_account_id: /\bacct_1[A-Za-z0-9]{12,}/g,
  email: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
};
const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const files = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? files(p) : [p]; });
export function scanDir(dir, allowDomains = []) {
  const hits = []; const skipped = [];
  for (const f of files(dir)) {
    if (/\.(png|jpg|jpeg|zip|gz|pdf|woff2?)$/i.test(f)) { skipped.push(relative(dir, f)); continue; }
    const t = readFileSync(f, 'utf8');
    for (const [name, re] of Object.entries(RULES)) {
      let m = [...t.matchAll(re)].map((x) => x[0]);
      if (name === 'email') m = m.filter((e) => !/\.invalid$/i.test(e) && !allowDomains.some((d) => e.toLowerCase().endsWith(`@${d}`)));
      if (m.length) hits.push({ file: relative(dir, f), rule: name, count: m.length });
    }
  }
  return { hits, skipped };
}
if (args.includes('--self-test')) {
  const base = `/tmp/apbm007b-privacy-selftest-${process.pid}`; mkdirSync(`${base}/poison`, { recursive: true }); mkdirSync(`${base}/clean`, { recursive: true });
  const fake = { stripe_secret: 'sk_test_' + 'A'.repeat(24), stripe_webhook: 'whsec_' + 'B'.repeat(24), supabase_key: 'sb_secret_' + 'C'.repeat(20), resend_key: 're_' + 'D'.repeat(8) + '_' + 'E'.repeat(12),
    jwt: 'eyJ' + 'F'.repeat(30) + '.' + 'G'.repeat(30) + '.' + 'H'.repeat(20), db_url_with_password: 'postgresql://user:pw' + '@host/db', private_key: '-----BEGIN RSA PRIVATE KEY-----',
    hosted_invoice_link: 'https://invoice.stripe.com/i/' + 'I'.repeat(20), full_account_id: 'acct_1' + 'J'.repeat(15), email: 'person@example.com' };
  for (const [k, v] of Object.entries(fake)) writeFileSync(`${base}/poison/${k}.txt`, v);
  writeFileSync(`${base}/clean/ok.txt`, 'acct_[redacted]u3RR sk_test_[redacted] someone@proof.invalid');
  const p = scanDir(`${base}/poison`), c = scanDir(`${base}/clean`);
  const ok = Object.keys(RULES).every((r) => p.hits.some((h) => h.rule === r)) && c.hits.length === 0;
  rmSync(base, { recursive: true, force: true });
  console.log(JSON.stringify({ self_test: ok ? 'PASS' : 'FAIL', rules: Object.keys(RULES).length, poison_rules_hit: new Set(p.hits.map((h) => h.rule)).size, clean_hits: c.hits.length }));
  process.exit(ok ? 0 : 1);
}
const dir = args[args.indexOf('--dir') + 1];
if (!dir) { console.error('FAIL-CLOSED: --dir required'); process.exit(2); }
const allow = (args.includes('--allow-emails') ? args[args.indexOf('--allow-emails') + 1] : '').split(',').filter(Boolean);
const r = scanDir(dir, allow);
console.log(JSON.stringify({ dir, hits: r.hits, skipped_binary: r.skipped.length }, null, 1));
process.exitCode = r.hits.length ? 1 : 0;
