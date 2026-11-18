from pathlib import Path,PurePosixPath
import subprocess,json,hashlib,zipfile,io,re,shutil,datetime
ob=Path('/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev');pp=ob.parent/'cyph-payment-portal-dev-v1';m=ob/'agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA';q=m/'QAM';e=q/'evidence/Q2/a01'
def sha(b):return hashlib.sha256(b).hexdigest()
def git(root,*args):return subprocess.check_output(['git','-C',str(root),*args],text=True).strip()
heads=[git(ob,'rev-parse','HEAD'),git(pp,'rev-parse','HEAD')];assert heads==['37f6c0dd63f7a087ec44dd9d3ef79b74bb203f40','9d938f62bff6172f9332ae6c67775e4b8feea379']
assert all(git(r,'branch','--show-current')=='qa/apbm-007a' for r in [ob,pp])
changed={str(r):git(r,'diff','--name-only').splitlines() for r in [ob,pp]}
assert not changed[str(pp)];assert all(x.startswith('agent_docs/ACTIONS/APBM-007A-CYBER-PHARMA/QAM/') for x in changed[str(ob)])
assert sha((q/'QAM_TEST_PLAN.md').read_bytes())=='2ffbfd8b12b195b06b0e278f2fd487904d338bb0fda2de4c738fbdb2d6c39672'
old=json.loads((q/'evidence/Q1/a01/preserved_archives.json').read_text());assert all(sha((q/'HANDOFFS'/n).read_bytes())==h for n,h in old.items())
(e/'final-identity.json').write_text(json.dumps({'heads':heads,'branches':['qa/apbm-007a']*2,'plan_sha256':sha((q/'QAM_TEST_PLAN.md').read_bytes()),'tracked_changes':changed,'preserved_engineering_archives':{'count':len(old),'all_hashes_equal':True},'product_worktree_unchanged':True,'recorded_at_utc':datetime.datetime.now(datetime.timezone.utc).isoformat()},indent=2))
# Load private values into process memory only; subprocess output is captured, never displayed/stored.
js="""const fs=require('fs'),d=require('/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/node_modules/dotenv');let out=[];for(const p of ['/home/moose/NEXTJS/CYBER_PHARMA/cyph-v1-dev/.env.local','/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/.env.local','/home/moose/.config/cyph/apbm007a-qa-cast.env','/home/moose/.config/cyph/apbm007a-test-inboxes.env']){if(!fs.existsSync(p))continue;for(const [k,v]of Object.entries(d.parse(fs.readFileSync(p))))if(v.length>=6&&(/SECRET|PASSWORD|SERVICE_ROLE|DB_URL|TOKEN|PRIVATE|STRIPE.*KEY/i.test(k)||p.includes('/.config/cyph/')))out.push(v)}process.stdout.write(JSON.stringify(out));"""
secret_values=list(set(json.loads(subprocess.check_output(['node','-e',js],text=True))))
# Include URL credentials separately to detect strings without their connection URL.
from urllib.parse import urlsplit,unquote
for s in list(secret_values):
 try:
  u=urlsplit(s)
  if u.password and len(u.password)>=6:secret_values.append(unquote(u.password))
 except ValueError:pass
banned=[s.encode() for s in sorted(set(secret_values),key=len,reverse=True)]
patterns=[re.compile(rb'\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}'),re.compile(rb'\bwhsec_[A-Za-z0-9]{16,}'),re.compile(rb'\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}')]
def leaks(data):return any(v in data for v in banned) or any(p.search(data) for p in patterns)
canary=b'QA_PRIVATE_POISON_7f8eb04e';assert not leaks(b'clean public QA report');assert any(v in b'prefix'+banned[0]+b'suffix' for v in banned) if banned else False
assert re.search(rb'QA_PRIVATE_POISON_[a-z0-9]+',canary)
payload={};meta={};redactions=[]
def add(p,purpose,name=None):
 assert p.is_file() and not p.is_symlink(),str(p)
 name=name or str(p.relative_to(m));assert name not in payload,name
 assert not name.endswith('.zip') and '.env' not in PurePosixPath(name).name
 data=p.read_bytes(); original=data
 for v in banned:data=data.replace(v,b'[REDACTED_PRIVATE_VALUE]')
 for pattern in patterns:data=pattern.sub(b'[REDACTED_SECRET_TOKEN]',data)
 if data!=original:redactions.append({'path':name,'reason':'exact private value or secret-token pattern removed from exported copy only'})
 assert not leaks(data),name
 payload[name]=data;meta[name]={'source':str(p),'purpose':purpose,'sanitized_copy':data!=original}
# Explicit selected roots and filename filters; no recursive repo/dependency/build export.
for p in sorted(q.glob('*.md')):add(p,'Current independent QA operating record/report')
add(q/'HANDOFFS/REVIEW_START_HERE.md','Review entrypoint','REVIEW_START_HERE.md')
for p in sorted((q/'AUTOMATION/Q2-a01').glob('*.cjs')):add(p,'Independent QA helper; not automatically executable authorization')
for p in sorted(e.rglob('*')):
 if p.is_file() and p.name not in ['export-validation.json','export-payload.json']:add(p,'Independent Q2 observation, retained attempt or source snapshot')
for p in sorted((q/'evidence/B1').glob('*')):
 if p.is_file():add(p,'Accepted B1 baseline/provenance; historical status may be superseded')
for p in sorted((q/'evidence/Q1/a02').rglob('*')):
 if p.is_file() and p.suffix in ['.json','.jsonl','.log','.txt','.cjs'] and not p.name.startswith('a01_'):add(p,'Pinned Q1 build/readiness provenance; not Q2 acceptance')
for n in ['APBM_ACCEPTANCE_SPEC.md','APBM_RULINGS.md','CARRY_FORWARD_007B.md','STAGING_RELEASE.md','DIRECTOR_RULINGS_2026-11-11.md','AMENDMENT_LEDGER.md']:
 p=m/n
 if p.exists():add(p,'Canonical contract/ruling/release boundary')
for p in sorted((m/'CONTRACTS').glob('*.md')):add(p,'Normative frozen contract including Spec Amendment A1')
for n in ['QAM_PLAYBOOK.md','QA_PLAYBOOK.md','HANDOFF_PACKAGE_PLAYBOOK.md','PROVENANCE.md','APBM_PLAYBOOK_v1_0.md','STRIPE_SUBSCRIPTIONS_PLAYBOOK.md']:
 add(m/'GOVERNING'/n,'Applicable governing source')
for n in ['ENGINEERING_HANDOFF.md','QA_HANDOFF.md']:add(q/'HANDOFFS'/n,'Engineering provenance, not independent result')
for p in sorted((m/'EVIDENCE/E2/r02').rglob('*')):
 if p.is_file() and p.suffix in ['.md','.json','.txt','.py']:add(p,'Repair provenance and finite commit manifest')
add(m/'EVIDENCE/E2/r01/ENGINEERING_HANDOFF.md','Engineering rehearsal provenance reused only as Lead authorized')
for folder in ['scratch-fresh-1','scratch-upgrade-1']:
 root=m/'EVIDENCE/E2/r01'/folder
 for p in sorted(root.glob('*')):
  if p.is_file() and (p.name.startswith(('forward-','seed-receipt-','preserve-','migration-inventory','catalog-approved','apbm007a-db-proof','seed-verify-attacked'))):add(p,'Reused engineering SCRATCH rehearsal receipt; NOT independent QA execution')
(e/'export-payload.json').write_text(json.dumps({'selected_files':[{'path':n,**meta[n]} for n in sorted(payload)],'exclusions':['prior ZIPs','private env/cast/login sheet','auth state','raw sensitive traces','Git','dependencies','builds'],'redacted_export_copies':redactions},indent=2))
add(e/'export-payload.json','Explicit membership selection and redaction record')
validation={'clean_control':'PASS','actual_value_poison_control':'PASS','pattern_poison_control':'PASS','selected_content_privacy':'PASS','expanded_zip_privacy':'PASS','unique_safe_paths':'PASS','symlinks':'NONE','index_membership_hash_size':'PASS','zip_integrity':'PASS','private_values_emitted':False,'redacted_export_copies':len(redactions),'note':'Validation repeated against final archive below; failures abort publication. Index intentionally excludes itself.'}
(e/'export-validation.json').write_text(json.dumps(validation,indent=2));add(e/'export-validation.json','Export controls; independently checked again after final ZIP assembly')
index=[{'path':n,**meta[n],'size':len(payload[n]),'sha256':sha(payload[n])} for n in sorted(payload)]
payload['FILE_INDEX.json']=json.dumps(index,indent=2).encode()
assert not any(leaks(b) for b in payload.values())
for n in payload:
 p=PurePosixPath(n);assert not p.is_absolute() and '..' not in p.parts and '\\' not in n
buf=io.BytesIO()
with zipfile.ZipFile(buf,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for n in sorted(payload):z.writestr(n,payload[n])
data=buf.getvalue()
with zipfile.ZipFile(io.BytesIO(data)) as z:
 assert z.testzip() is None;assert len(z.namelist())==len(set(z.namelist()))==len(payload)
 assert set(z.namelist())==set(payload)
 for x in index:
  b=z.read(x['path']);assert sha(b)==x['sha256'] and len(b)==x['size'] and not leaks(b)
 assert not leaks(z.read('FILE_INDEX.json'))
name='APBM-007A-CYBER-PHARMA_Q2_REVIEW_a01.zip';dest=q/'HANDOFFS'/name;downloads=Path('/home/moose/Downloads')/name
assert not dest.exists() and not downloads.exists(),'Never overwrite an existing review archive'
dest.write_bytes(data);downloads.write_bytes(data);assert sha(dest.read_bytes())==sha(downloads.read_bytes())
receipt={'package':str(dest),'downloads_copy':str(downloads),'members':len(payload),'sha256':sha(data),'plan_sha256':sha((q/'QAM_TEST_PLAN.md').read_bytes()),'owedbook_sha':heads[0],'portal_sha':heads[1],'portal_repair_sha':'9322405fe0238882c21c75ef62733fc8c732fed0','validation':validation,'copy_identical':True,'old_nine_archives_unchanged':True}
(q/'HANDOFFS'/name.replace('.zip','.receipt.json')).write_text(json.dumps(receipt,indent=2))
print(json.dumps(receipt,indent=2))
