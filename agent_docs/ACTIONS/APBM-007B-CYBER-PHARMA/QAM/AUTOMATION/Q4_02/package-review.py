from pathlib import Path
import os,json,hashlib,shutil,zipfile,datetime,subprocess
os.umask(0o077)
repo=Path('/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1');module=repo/'agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA';q=module/'QAM';stem='APBM-007B-CYBER-PHARMA_Q4_REVIEW_02';stage=Path('/tmp')/(stem+'_STAGE');expanded=Path('/tmp')/(stem+'_EXPANDED');dest=q/'HANDOFFS'/(stem+'.zip');download=Path('/home/moose/Downloads')/dest.name
assert not stage.exists() and not expanded.exists() and not dest.exists(),'Immutable export attempt already exists; inspect before any retry'
assert json.loads((q/'evidence/Q4/02/phase_exit.json').read_text())['all_owned_stopped']
stage.mkdir(mode=0o700);expanded.mkdir(mode=0o700);selected={}
for name in ['QAM_ENTRY.md','QAM_STATE.md','QAM_TEST_PLAN.md','QAM_APPROVAL.md','QAM_EXECUTION_REPORT.md','AC_EVIDENCE_MATRIX.md','FINDINGS.md','QAM_MANIFEST.md','QAM_PREFLIGHT.md','QAM_RECON_REPORT.md','QAM_RISK_REQUIREMENTS.md','QAM_CLEANUP_REPORT.md','QAM_PACKAGING.md','GOVERNING/README.md','HANDOFFS/ENGINEERING_HANDOFF.md','HANDOFFS/README.md','HANDOFFS/Q4_01_RECEIPT.json']:
 selected[name]=q/name
selected['REVIEW_START_HERE.md']=q/'HANDOFFS/REVIEW_START_HERE.md'
for folder in ['AUTOMATION/Q4_02','evidence/Q4/02','AUTOMATION/Q4','evidence/Q4/01']:
 for p in (q/folder).rglob('*'):
  if not p.is_file() or p.is_symlink() or p.name.startswith('.') or '__pycache__' in p.parts or p.suffix in ['.pyc','.zip'] or p.name=='portal_complete.diff':continue
  selected[str(p.relative_to(q))]=p
carry=json.loads((q/'evidence/Q4/01/carry_forward_provenance.json').read_text())
for g in carry['groups']:
 for item in g['evidence']:
  src=q/item['path'];assert hashlib.sha256(src.read_bytes()).hexdigest()==item['sha256'];selected[item['path']]=src
p=q/'evidence/Q2/01/campaign/r03/O1/qa-20261117-c414/state.json';selected[str(p.relative_to(q))]=p
selected['SOURCE/SUPPORT_PROCEDURES.md']=module/'SUPPORT_PROCEDURES.md'
refs=[]
for p in [module/'ACCEPTANCE_SPEC.md',module/'APBM_RULINGS.md',module/'CONTRACT_MANIFEST.json',module/'SUPPORT_PROCEDURES.md',module/'STAGING_AND_GATE_D.md',module/'GOVERNING/QAM_PLAYBOOK.md',q/'evidence/Q4/01/entry/portal_complete.diff',q/'HANDOFFS/APBM-007B-CYBER-PHARMA_Q4_REVIEW_01.zip']:
 assert p.is_file(),p;refs.append({'source_path':str(p.relative_to(repo)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'purpose':'Exact governing/original evidence reference; old ZIP and binary-bearing historical diff not nested'})
ref=q/'HANDOFFS/SOURCE_REFERENCES_Q4_02.json';ref.write_text(json.dumps({'files':refs,'supplied_QA_Lead_source':'QA_LEAD_Q4_02_BINDING_APBM007B_2026-11-18.md; supplied Director conversation, no source hash provided or invented'},indent=2)+'\n');selected[str(ref.relative_to(q))]=ref
count=len(selected)+2
state=q/'QAM_STATE.md';state.write_text(state.read_text()+f'\nCody Q4/02 pre-export snapshot: Q4 COMPLETE — AWAITING ADJUDICATION, all released scope attempted with explicit final optional buyer NOT RUN limitation and retained timing failure. Same repairedpair, all fixtures retained/F001unrefunded, ownapps/listener actually stopped. Package {stem}.zip, {count} members including FILE_INDEX and EXPORT_VALIDATION; ZIP hash external only.\n')
for arc,src in selected.items():
 assert src.is_file(),src;p=stage/arc;p.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,p)
def scans(folder):
 result=[]
 for cmd in [['node',str(repo/'scripts/apbm007b/privacy-scan.mjs'),'--dir',str(folder)],['node',str(q/'AUTOMATION/Q4_02/export-private-scan.cjs'),str(folder)]]:
  r=subprocess.run(cmd,cwd=repo,capture_output=True,text=True,timeout=120)
  try:data=json.loads(r.stdout)
  except:raise RuntimeError('Privacy gate output withheld; non-JSON')
  if r.returncode:print(json.dumps(data));raise RuntimeError('Privacy gate rejected selected export')
  result.append(data)
 return result
control=subprocess.run(['node',str(repo/'scripts/apbm007b/privacy-scan.mjs'),'--self-test'],cwd=repo,capture_output=True,text=True,check=True)
pre=scans(stage)
(stage/'EXPORT_VALIDATION.json').write_text(json.dumps({'pattern_self_test':json.loads(control.stdout),'stage_pattern_scan':pre[0],'stage_actual_private_value_scan':pre[1],'archive_hash_membership_CRC_expanded_checks':'Required after creation; external receipt records final result','credential_values_or_hashes_exported':False,'raw_traces_authstates_exported':False},indent=2)+'\n')
entries=[]
for p in sorted(stage.rglob('*')):
 if not p.is_file():continue
 arc=p.relative_to(stage).as_posix();src=selected.get(arc);entries.append({'archive_path':arc,'source_path':str(src.relative_to(repo)) if src else 'generated export validation','purpose':'Q4/02 independent execution / explicitly source-bound Q4/01 carry / governing records','bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(stage/'FILE_INDEX.json').write_text(json.dumps({'schema':'APBM indexed review package','phase':'Q4/02 COMPLETE — AWAITING ADJUDICATION','candidate_pair':{'portal':'ba66534351368b4b67b9e61d6f0278866950c850','owedbook':'855e0ad2e22a37e633ab5a55b8459e9bcc6bd871'},'plan_sha256':'c06196aa44ab3cee181e101a175106a96b7f24e1e941f5754aa0bd38124bbdbb','entries':entries},indent=2)+'\n')
scans(stage)
with zipfile.ZipFile(dest,'x',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in sorted(stage.rglob('*')):
  if p.is_file():z.write(p,stem+'/'+p.relative_to(stage).as_posix())
with zipfile.ZipFile(dest) as z:
 names=z.namelist();assert len(names)==count==len(set(names)) and z.testzip() is None
 assert set(names)=={stem+'/'+x['archive_path'] for x in entries}|{stem+'/FILE_INDEX.json'}
 for x in entries:
  b=z.read(stem+'/'+x['archive_path']);assert len(b)==x['bytes'] and hashlib.sha256(b).hexdigest()==x['sha256']
 assert all(not Path(n).is_absolute() and '..' not in Path(n).parts for n in names)
 z.extractall(expanded)
post=scans(expanded);sha=hashlib.sha256(dest.read_bytes()).hexdigest();download.parent.mkdir(exist_ok=True)
if download.exists():assert hashlib.sha256(download.read_bytes()).hexdigest()==sha
else:shutil.copy2(dest,download)
assert dest.read_bytes()==download.read_bytes()
receipt={'status':'Q4/02 COMPLETE — AWAITING ADJUDICATION','path':str(dest),'downloads':str(download),'members':count,'indexed_entries':len(entries),'sha256':sha,'validated':True,'expanded_privacy_gates':post,'last_buyer':'NOT RUN — Director copied link not provided; no decline or approval inferred','decision':'Friday adjudicates F-Q4-001 retest, F-Q4-002 timing evidence failure, F-Q4-003 not-reproduced/causal limits, optional buyer limitation and local CLI delivery observation, then verdict/retention','fixtures_retained':True,'owned_listener_stopped':True}
(q/'HANDOFFS/Q4_02_RECEIPT.json').write_text(json.dumps(receipt,indent=2)+'\n')
line=f'\nPost-export receipt: Cody {datetime.datetime.now(datetime.timezone.utc).isoformat()} Q4/02 COMPLETE: {dest}; {count} members ({len(entries)} indexed plus index), SHA-256 {sha}. Exact membership/bytes/hashes/CRC/safe paths and stage/expanded pattern/actual-private-value scans PASS. Downloads byte-identical {download}. Optional buyer NOT RUN, copied link not provided; no approval/decline inferred. All fixtures retained, F001unrefunded. Owned apps/listener actually stopped, Director processes untouched; may restart listener. Friday adjudication/verdict/retention next; no certificate.\n'
for name in ['QAM_STATE.md','HANDOFFS/README.md']:
 p=q/name;p.write_text(p.read_text()+line)
print(json.dumps({k:v for k,v in receipt.items() if k!='expanded_privacy_gates'},indent=2))
