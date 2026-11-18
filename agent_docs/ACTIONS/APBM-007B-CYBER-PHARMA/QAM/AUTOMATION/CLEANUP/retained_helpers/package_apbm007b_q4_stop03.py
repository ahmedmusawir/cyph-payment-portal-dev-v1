from pathlib import Path
import subprocess,json,hashlib,shutil,zipfile,datetime
repo=Path('/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1');module=repo/'agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA';q=module/'QAM';stem='APBM-007B-CYBER-PHARMA_STOP_REVIEW_03';stage=Path('/tmp')/stem;expanded=Path('/tmp/APBM007B_STOP03_EXPANDED');dest=q/'HANDOFFS'/(stem+'.zip');download=Path('/home/moose/Downloads')/dest.name
assert not stage.exists() and not dest.exists(),'immutable attempt already exists'
stage.mkdir();selected={}
for name in ['QAM_ENTRY.md','QAM_STATE.md','QAM_TEST_PLAN.md','QAM_APPROVAL.md','QAM_EXECUTION_REPORT.md','AC_EVIDENCE_MATRIX.md','FINDINGS.md','QAM_MANIFEST.md','QAM_PREFLIGHT.md','QAM_RECON_REPORT.md','QAM_RISK_REQUIREMENTS.md','QAM_CLEANUP_REPORT.md','QAM_PACKAGING.md','GOVERNING/README.md','HANDOFFS/ENGINEERING_HANDOFF.md','HANDOFFS/QA_Q4_RESUME.md']:
 selected[name]=q/name
selected['REVIEW_START_HERE.md']=q/'HANDOFFS/REVIEW_START_HERE.md'
for folder in ['AUTOMATION/Q4','evidence/Q4/01']:
 for p in (q/folder).rglob('*'):
  if not p.is_file() or p.is_symlink() or p.name.startswith('.'):continue
  if p.name=='portal_complete.diff':continue
  selected[str(p.relative_to(q))]=p
refs=[]
for p in [module/'ACCEPTANCE_SPEC.md',module/'APBM_RULINGS.md',module/'CONTRACT_MANIFEST.json',module/'SUPPORT_PROCEDURES.md',module/'GOVERNING/QAM_PLAYBOOK.md',q/'evidence/Q4/01/entry/portal_complete.diff',q/'HANDOFFS/Q2_01_RECEIPT.json']:
 assert p.exists();refs.append({'path':str(p.relative_to(repo)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'purpose':'exact governing/source/original-evidence reference; source claims remain separate'})
ref=q/'HANDOFFS/SOURCE_REFERENCES_STOP_03.json';ref.write_text(json.dumps(refs,indent=2)+'\n');selected['HANDOFFS/SOURCE_REFERENCES_STOP_03.json']=ref
count=len(selected)+2
state=q/'QAM_STATE.md';state.write_text(state.read_text()+f'\nCody STOP/03 pre-export snapshot: Q4 partial STOP-AUTHORITY; no remote effects; repaired pair unchanged; all fixtures retained, owned Q4 containers stopped, QA apps/listener never started. Package {stem}.zip, {count} members including FILE_INDEX and EXPORT_VALIDATION. ZIP hash external only.\n')
for arc,src in selected.items():
 assert src.exists();p=stage/arc;p.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,p)

def scans(folder):
 cmds=[['node',str(repo/'scripts/apbm007b/privacy-scan.mjs'),'--dir',str(folder)],['node',str(q/'AUTOMATION/Q4/export-private-scan.cjs'),str(folder)]]
 reports=[]
 for cmd in cmds:
  r=subprocess.run(cmd,cwd=repo,capture_output=True,text=True,timeout=120)
  try:d=json.loads(r.stdout)
  except:raise RuntimeError('Privacy gate non-JSON; withheld')
  if r.returncode:print(json.dumps(d));raise RuntimeError('Privacy gate rejected export')
  reports.append(d)
 return reports
control=subprocess.run(['node',str(repo/'scripts/apbm007b/privacy-scan.mjs'),'--self-test'],cwd=repo,capture_output=True,text=True,check=True)
pre=scans(stage)
(stage/'EXPORT_VALIDATION.json').write_text(json.dumps({'pattern_self_test':json.loads(control.stdout),'stage_pattern_scan':pre[0],'stage_actual_private_value_scan':pre[1],'archive_membership_hash_crc_and_expanded_scans':'required after ZIP creation; final result in external receipt','credential_values_or_hashes_exported':False},indent=2)+'\n')
entries=[]
for p in sorted(stage.rglob('*')):
 if p.is_file():entries.append({'archive_path':str(p.relative_to(stage)),'source_path':str(selected[p.relative_to(stage).as_posix()].relative_to(repo)) if p.relative_to(stage).as_posix() in selected else 'generated export validation','purpose':'Q4 partial independent evidence / governing record','bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(stage/'FILE_INDEX.json').write_text(json.dumps({'schema':'APBM indexed review package','phase':'Q4 partial; STOP-AUTHORITY','candidate_pair':{'portal':'00a9e0e98aadb2bdba830ebe6d8c06fb6902e37d','owedbook':'1fd5a61073e8adaa7997e1ad3c4b1f02d0e7f54d'},'plan_sha256':'49e0ca36b3ba39a47346162fb736880d07950bc9e36478391f3a6c50d18f8305','entries':entries},indent=2)+'\n')
scans(stage)
with zipfile.ZipFile(dest,'x',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in sorted(stage.rglob('*')):
  if p.is_file():z.write(p,stem+'/'+p.relative_to(stage).as_posix())
with zipfile.ZipFile(dest) as z:
 names=z.namelist();assert len(names)==count==len(set(names));assert z.testzip() is None
 expected={stem+'/'+e['archive_path'] for e in entries}|{stem+'/FILE_INDEX.json'};assert set(names)==expected
 for e in entries:
  data=z.read(stem+'/'+e['archive_path']);assert len(data)==e['bytes'] and hashlib.sha256(data).hexdigest()==e['sha256']
 assert all(not Path(n).is_absolute() and '..' not in Path(n).parts for n in names)
 z.extractall(expanded)
post=scans(expanded)
h=hashlib.sha256(dest.read_bytes()).hexdigest();download.parent.mkdir(exist_ok=True)
if download.exists():assert hashlib.sha256(download.read_bytes()).hexdigest()==h
else:shutil.copy2(dest,download)
assert dest.read_bytes()==download.read_bytes()
receipt={'status':'Q4 PARTIAL — STOP-AUTHORITY','path':str(dest),'downloads':str(download),'members':count,'indexed_entries':len(entries),'sha256':h,'validated':True,'expanded_privacy_gates':post,'no_remote_effects_in_Q4':True,'decision':'Director cumulative pay_or_hosted cap32→64; preserve counters; stop Director listener→3001 before live campaign'}
(q/'HANDOFFS/STOP_03_RECEIPT.json').write_text(json.dumps(receipt,indent=2)+'\n')
line=f'\nPost-export receipt: Cody {datetime.datetime.now(datetime.timezone.utc).isoformat()} STOP/03 Q4 partial: {dest}; {count} members ({len(entries)} indexed entries plus index); SHA-256 {h}. Exact index membership/bytes/hashes, CRC, safe paths, stage and expanded pattern/actual-private-value scans PASS. Downloads byte-identical {download}. Decision: cumulative pay_or_hosted cap32→64, counters preserved; Director listener→3001 off before live effects. Q4 NOT COMPLETE, all fixtures retained, no owned apps/listener started, owned Q4 local containers stopped.\n'
for name in ['QAM_STATE.md','HANDOFFS/README.md']:
 p=q/name;p.write_text(p.read_text()+line)
print(json.dumps({k:v for k,v in receipt.items() if k!='expanded_privacy_gates'},indent=2))
