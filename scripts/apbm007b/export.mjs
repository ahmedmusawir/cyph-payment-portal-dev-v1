#!/usr/bin/env node
// APBM-007B — indexed export (exact member index, sizes, SHA-256, CRC check). cwd: any.
//
//   node scripts/apbm007b/export.mjs --help
//   node scripts/apbm007b/export.mjs --self-test
//   node scripts/apbm007b/export.mjs --dir <run dir> --zip <output.zip>
//
// Writes <run dir>/FILE_INDEX.json (every file except the index itself: path, bytes, sha256), zips the directory under its
// own name, then re-opens the ZIP and verifies CRC, exact membership and every size/hash. Prints the ZIP SHA-256 (kept
// outside the ZIP). Uses the system python3 zipfile module (no package install).
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';

const args = process.argv.slice(2);
if (!args.length || args.includes('--help')) { console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n')); process.exit(0); }
const PY = `
import os,sys,json,hashlib,zipfile
d,z=sys.argv[1],sys.argv[2]; d=d.rstrip('/'); name=os.path.basename(d)
files=[]
for r,_,fs in os.walk(d):
  for f in sorted(fs):
    p=os.path.join(r,f); rel=os.path.relpath(p,d)
    if rel=='FILE_INDEX.json': continue
    b=open(p,'rb').read(); files.append({'path':rel,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()})
files.sort(key=lambda x:x['path'])
json.dump({'package':name,'indexed_files':len(files),'note':'FILE_INDEX.json is not listed in itself; the ZIP SHA-256 is recorded outside the ZIP.','files':files},open(os.path.join(d,'FILE_INDEX.json'),'w'),indent=1)
if os.path.exists(z): os.remove(z)
with zipfile.ZipFile(z,'w',zipfile.ZIP_DEFLATED) as zf:
  for r,_,fs in os.walk(d):
    for f in sorted(fs): p=os.path.join(r,f); zf.write(p,name+'/'+os.path.relpath(p,d))
with zipfile.ZipFile(z) as zf:
  bad=zf.testzip(); names=set(zf.namelist()); exp={name+'/'+f['path'] for f in files}|{name+'/FILE_INDEX.json'}
  mism=[f['path'] for f in files if hashlib.sha256(zf.read(name+'/'+f['path'])).hexdigest()!=f['sha256'] or zf.getinfo(name+'/'+f['path']).file_size!=f['bytes']]
print(json.dumps({'zip':z,'sha256':hashlib.sha256(open(z,'rb').read()).hexdigest(),'members':len(names),'indexed':len(files),'crc_bad':bad,'extra':sorted(names-exp),'missing':sorted(exp-names),'mismatch':mism}))
sys.exit(0 if (bad is None and names==exp and not mism) else 1)
`;
const run = (d, z) => spawnSync('python3', ['-I', '-c', PY, d, z], { encoding: 'utf8' });
if (args.includes('--self-test')) {
  const base = `/tmp/apbm007b-export-selftest-${process.pid}`; mkdirSync(`${base}/pkg/sub`, { recursive: true });
  writeFileSync(`${base}/pkg/a.txt`, 'alpha'); writeFileSync(`${base}/pkg/sub/b.txt`, 'beta');
  const r = run(`${base}/pkg`, `${base}/pkg.zip`); const o = JSON.parse(r.stdout || '{}');
  const ok = r.status === 0 && o.members === 3 && o.indexed === 2;
  rmSync(base, { recursive: true, force: true });
  console.log(JSON.stringify({ self_test: ok ? 'PASS' : 'FAIL', members: o.members, indexed: o.indexed })); process.exit(ok ? 0 : 1);
}
const dir = args[args.indexOf('--dir') + 1], zip = args[args.indexOf('--zip') + 1];
if (!dir || !zip) { console.error('FAIL-CLOSED: --dir and --zip required'); process.exit(2); }
const r = run(dir, zip); process.stdout.write(r.stdout); process.stderr.write(r.stderr); process.exitCode = r.status ?? 1;
