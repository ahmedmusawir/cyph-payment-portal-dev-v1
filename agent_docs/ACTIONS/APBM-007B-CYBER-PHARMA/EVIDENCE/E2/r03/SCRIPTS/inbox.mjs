#!/usr/bin/env node
// APBM-007B — controlled-inbox adapter for O-2 and invitation proofs (actual inbox observation). cwd: Portal root.
// The engineering cast spans SEVERAL real mailboxes; no single login is assumed to receive them all.
//
//   node scripts/apbm007b/inbox.mjs --help
//   node scripts/apbm007b/inbox.mjs --check                 # shapes + per-role coverage (automated | manual); no network, no values
//   node scripts/apbm007b/inbox.mjs --wait --role <ROLE> --subject <text> --since <ISO> [--timeout 300] [--link-out /tmp/<f>]
//   node scripts/apbm007b/inbox.mjs --manual-expect --role <ROLE> --subject <text> --sent <ISO> --ref <provider id|op id> --note <text>
//   node scripts/apbm007b/inbox.mjs --manual-confirm --id <n> --result seen|not_seen|wrong_content --by <name> [--detail <text>]
//   node scripts/apbm007b/inbox.mjs --manual-list
//
// Private inputs (never in a repo, never printed):
//   ~/.apbm007b/engineering_cast.json  0600: { "<ROLE>": { "email": "...", "password": "..." } }  roles ENGINEERING_OWNER_A,
//                                       ENGINEERING_OWNER_B, ENGINEERING_ADMIN, ENGINEERING_MEMBER, ENGINEERING_INVITEE (no password)
//   ~/.apbm007b/inbox_access.json      0600, OPTIONAL: { "inboxes": [ { "adapter": "imap", "host": "...", "port": 993, "user": "...",
//                                       "password": "...", "mailbox": "INBOX", "receives": ["<cast address>", ...] }, ... ] }
//                                       One entry per mailbox actually held (e.g. Gmail + app password). A role whose address is
//                                       in no entry's `receives` is MANUAL. (Legacy single-object form = one inbox receiving all.)
// --wait (automated roles only) polls that role's own mailbox over TLS read-only (EXAMINE; never deletes or flags) for a message
// to the role's address received at/after --since whose subject contains --subject; prints found/subject/received/link-present.
// --link-out writes the first https /api/auth/confirm link to a /tmp file at 0600 (one-time capability; never printed/packaged).
// Manual mode: --manual-expect records what a human must look for (role, subject, send time, provider reference — never the
// address); --manual-confirm records the human's report verbatim with who/when. LIMITS of a manual record, stated in every entry:
// engineering did not see the message bytes, headers, sender authentication or exact delivery time; content is as reported;
// a sign-in link used by a human is not observed by engineering (only its database outcome is).
import { spawnSync } from 'node:child_process';
import { readFileSync, statSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { EVIDENCE_ROOT } from './lib/env.mjs';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const CAST = `${homedir()}/.apbm007b/engineering_cast.json`, ACCESS = `${homedir()}/.apbm007b/inbox_access.json`;
const ROLES = ['ENGINEERING_OWNER_A', 'ENGINEERING_OWNER_B', 'ENGINEERING_ADMIN', 'ENGINEERING_MEMBER', 'ENGINEERING_INVITEE'];
const MANUAL = join(EVIDENCE_ROOT, 'r03', 'INBOX', 'manual_observations.json');
const LIMITS = 'Manual observation: engineering did not see message bytes, headers, sender authentication or exact delivery time; content as reported by the named person; any sign-in link a human used is not observed by engineering (only its database outcome).';
function privateJson(p, optional) {
  if (!existsSync(p)) return optional ? { value: null } : { error: 'missing' };
  if ((statSync(p).mode & 0o077) !== 0) return { error: 'mode_not_0600' };
  try { return { value: JSON.parse(readFileSync(p, 'utf8')) }; } catch { return { error: 'invalid_json' }; }
}
const cast = privateJson(CAST), access = privateJson(ACCESS, true);
const inboxes = !access.value ? [] : Array.isArray(access.value.inboxes) ? access.value.inboxes
  : access.value.adapter ? [{ ...access.value, receives: ROLES.map((r) => cast.value?.[r]?.email).filter(Boolean) }] : [];
const shapeOk = (b) => b.adapter === 'imap' && !!b.host && !!b.user && !!b.password && Array.isArray(b.receives);
const inboxFor = (addr) => inboxes.find((b) => shapeOk(b) && b.receives.map((x) => String(x).toLowerCase()).includes(String(addr).toLowerCase()));
const coverage = () => Object.fromEntries(ROLES.map((r) => { const e = cast.value?.[r]?.email; return [r, !e ? 'no_address' : inboxFor(e) ? 'automated' : 'manual']; }));

if (args.includes('--check')) {
  console.log(JSON.stringify({ engineering_cast: cast.error ?? 'ok', inbox_access: access.error ?? (access.value ? 'ok' : 'absent (all roles manual)'),
    inbox_entries: inboxes.length, inbox_entries_shape_ok: inboxes.filter(shapeOk).length, coverage: cast.error ? null : coverage() }, null, 1));
  process.exit(cast.error || access.error ? 1 : 0);
}
const loadManual = () => (existsSync(MANUAL) ? JSON.parse(readFileSync(MANUAL, 'utf8')) : []);
const saveManual = (l) => { mkdirSync(join(EVIDENCE_ROOT, 'r03', 'INBOX'), { recursive: true }); writeFileSync(MANUAL, JSON.stringify(l, null, 1)); };
if (args.includes('--manual-list')) { console.log(JSON.stringify(loadManual(), null, 1)); process.exit(0); }
if (args.includes('--manual-expect')) {
  const role = opt('--role'), subject = opt('--subject'), sent = opt('--sent');
  if (!ROLES.includes(role) || !subject || Number.isNaN(Date.parse(sent ?? ''))) { console.error('FAIL-CLOSED: --role <ROLE> --subject --sent <ISO>'); process.exit(2); }
  const l = loadManual(); const id = l.length + 1;
  l.push({ id, role, mailbox: 'the role\'s own controlled inbox (address held privately)', subject_contains: subject, sent_at: sent, provider_ref: opt('--ref') ?? null, note: opt('--note') ?? null, expected_recorded_at: new Date().toISOString(), status: 'AWAITING_HUMAN_CHECK', limits: LIMITS });
  saveManual(l); console.log(JSON.stringify({ recorded: id, role, subject_contains: subject, sent_at: sent })); process.exit(0);
}
if (args.includes('--manual-confirm')) {
  const l = loadManual(); const e = l.find((x) => x.id === Number(opt('--id'))); const result = opt('--result'), by = opt('--by');
  if (!e || !['seen', 'not_seen', 'wrong_content'].includes(result) || !by) { console.error('FAIL-CLOSED: --id <n> --result seen|not_seen|wrong_content --by <name>'); process.exit(2); }
  Object.assign(e, { status: result.toUpperCase(), reported_by: by, reported_detail: opt('--detail') ?? null, recorded_at: new Date().toISOString() });
  saveManual(l); console.log(JSON.stringify({ id: e.id, status: e.status })); process.exit(0);
}
if (!args.includes('--wait')) { console.error('FAIL-CLOSED: --check, --wait or --manual-*'); process.exit(2); }
if (cast.error || access.error) { console.error(`FAIL-CLOSED: private inputs ${cast.error ?? ''} ${access.error ?? ''}`); process.exit(2); }
const role = opt('--role'), subject = opt('--subject'), since = opt('--since'), linkOut = opt('--link-out');
const to = cast.value[role]?.email;
if (!to || !subject || !since || Number.isNaN(Date.parse(since))) { console.error('FAIL-CLOSED: --role, --subject, --since required'); process.exit(2); }
const box = inboxFor(to);
if (!box) { console.error(`MANUAL: ${role} has no automated mailbox; use --manual-expect`); process.exit(3); }
if (linkOut && !/^\/tmp\/[A-Za-z0-9._-]+$/.test(linkOut)) { console.error('FAIL-CLOSED: --link-out must be /tmp/<file>'); process.exit(2); }
const PY = `
import imaplib,email,json,sys,time,re,os
from email.utils import parsedate_to_datetime, getaddresses
from datetime import datetime,timezone
a=json.loads(sys.stdin.read()); to=sys.argv[1].lower(); subj=sys.argv[2]; since=datetime.fromisoformat(sys.argv[3].replace('Z','+00:00')); timeout=int(sys.argv[4]); out=sys.argv[5]
end=time.time()+timeout; found=None
while time.time()<end and not found:
  m=imaplib.IMAP4_SSL(a['host'],int(a.get('port',993))); m.login(a['user'],a['password']); m.select(a.get('mailbox','INBOX'),readonly=True)
  typ,data=m.search(None,'SINCE',since.strftime('%d-%b-%Y'))
  for num in reversed((data[0] or b'').split()[-50:]):
    typ,msg=m.fetch(num,'(BODY.PEEK[])'); e=email.message_from_bytes(msg[0][1])
    tos=[x[1].lower() for x in getaddresses(e.get_all('to',[])+e.get_all('delivered-to',[]))]
    try: when=parsedate_to_datetime(e['date'])
    except Exception: continue
    if to in tos and subj.lower() in (e['subject'] or '').lower() and when>=since:
      body=''
      for part in e.walk():
        if part.get_content_type() in ('text/plain','text/html'):
          try: body+=part.get_payload(decode=True).decode(part.get_content_charset() or 'utf-8','replace')
          except Exception: pass
      link=re.search(r'https?://[^\\s"<>]+/api/auth/confirm[^\\s"<>]*',body)
      if link and out:
        fd=os.open(out,os.O_WRONLY|os.O_CREAT|os.O_TRUNC,0o600); os.write(fd,link.group(0).replace('&amp;','&').encode()); os.close(fd)
      found={'found':True,'subject':e['subject'],'received':when.isoformat(),'sign_in_link_present':bool(link),'link_written':bool(link and out)}
      break
  m.logout()
  if not found: time.sleep(10)
print(json.dumps(found or {'found':False}))
`;
const t = Number(opt('--timeout') ?? 300);
// The mailbox credentials go to the child on stdin only (not argv, not env).
const r = spawnSync('python3', ['-I', '-c', PY, to, subject, since, String(t), linkOut ?? ''], { input: JSON.stringify(box), encoding: 'utf8', timeout: (t + 60) * 1000 });
process.stdout.write(r.stdout); if (r.status !== 0) console.error(`[inbox] adapter exit ${r.status}`);
process.exitCode = r.status ?? 1;
