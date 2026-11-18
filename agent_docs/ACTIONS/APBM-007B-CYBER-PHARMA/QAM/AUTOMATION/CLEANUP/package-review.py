from pathlib import Path
import os,json,hashlib,shutil,zipfile,datetime,subprocess
os.umask(0o077);repo=Path.cwd();q=repo/'agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/QAM';e=q/'evidence/CLEANUP/01';stem='APBM-007B-CYBER-PHARMA_CLEANUP_REVIEW_01';dest=q/'HANDOFFS'/(stem+'.zip');download=Path('/home/moose/Downloads')/dest.name;stage=Path('/tmp')/(stem+'_STAGE');expanded=Path('/tmp')/(stem+'_EXPANDED');assert not dest.exists() and not stage.exists() and not expanded.exists();assert not (repo/'.env.qa.local').exists();assert json.loads((e/'local_execution.json').read_text())['protected_matches_before'];assert json.loads((e/'pattern_scan_retained.json').read_text())['PASS'];stage.mkdir(mode=0o700);expanded.mkdir(mode=0o700)
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def pattern(folder):
 r=subprocess.run(['node','scripts/apbm007b/privacy-scan.mjs','--dir',str(folder)],capture_output=True,text=True,check=False);d=json.loads(r.stdout);assert r.returncode==0,d;return d
try:
 excluded={'evidence/Q2/01/preflight/candidate_to_execution_full.diff','evidence/Q4/01/entry/portal_complete.diff'};refs=[]
 for p in q.rglob('*'):
  if not p.is_file() or p.is_symlink() or p.name.startswith('.') or '__pycache__' in p.parts or p.suffix=='.pyc':continue
  rel=str(p.relative_to(q))
  if rel in excluded or p.suffix=='.zip':
   refs.append({'path':rel,'bytes':p.stat().st_size,'sha256':digest(p),'reason':'Immutable prior package or historical full diff retained canonically, referenced rather than nested'});continue
  out=stage/rel;out.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,out)
 (stage/'SOURCE_REFERENCES.json').write_text(json.dumps(refs,indent=2)+'\n')
 (stage/'CLEANUP_START_HERE.md').write_text('''# APBM-007B cleanup review

State: CLEANUP EXECUTED — AWAITING ACCEPTANCE.

Read QAM_CLEANUP_REPORT.md, QAM_CERTIFICATION.md, FINDINGS.md section 2, then evidence/CLEANUP/01/remote_verification.json, remote_execution.json, local_execution.json, value_scan_final.json and pattern_scan_retained.json.

Six marked subscriptions canceled, including F-Q2-001 without refund. All eight QA server sessions revoked; identities and business/claim rows retained. QA contexts disabled and prepared transfer reservation released. Private credentials and owned temporary state removed after actual-value scan.

Unremoved resource IDs and hard-limit/API reasons are in remote_execution.json. Exact certificate sections 1–6 are not available; supplied verdict and Director acceptance are recorded without inventing risks. No release to closeout is claimed. No deployment, DEV write or product change. Owned listener is stopped; Director may restart his listener.

All prior packages remain immutable and are listed in SOURCE_REFERENCES.json. Two large historical full diffs remain canonical and are hash-referenced. The index covers every package member except itself. Actual-value checks preceded credential deletion; this final package receives pattern checks only, with no post-deletion actual-value claim.
''')
 pre=pattern(stage);validation={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'state':'CLEANUP EXECUTED — AWAITING ACCEPTANCE','pattern_stage':pre,'actual_value_scan':'evidence/CLEANUP/01/value_scan_final.json; before credential deletion, no new actual-value scan claimed','no_credentials_in_package':True,'prior_archives_preserved':True};(stage/'EXPORT_VALIDATION.json').write_text(json.dumps(validation,indent=2)+'\n')
 entries=[{'path':str(p.relative_to(stage)),'bytes':p.stat().st_size,'sha256':digest(p)} for p in sorted(stage.rglob('*')) if p.is_file()];(stage/'FILE_INDEX.json').write_text(json.dumps({'schema':1,'entries':entries,'index_excludes_itself':True},indent=2)+'\n');pattern(stage)
 with zipfile.ZipFile(dest,'x',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
  for p in sorted(stage.rglob('*')):
   if p.is_file():z.write(p,stem+'/'+str(p.relative_to(stage)))
 with zipfile.ZipFile(dest) as z:
  assert z.testzip() is None;assert len(z.namelist())==len(entries)+1;assert set(z.namelist())=={stem+'/'+x['path'] for x in entries}|{stem+'/FILE_INDEX.json'}
  for x in entries:
   b=z.read(stem+'/'+x['path']);assert len(b)==x['bytes'] and hashlib.sha256(b).hexdigest()==x['sha256']
  z.extractall(expanded)
 post=pattern(expanded);download.parent.mkdir(exist_ok=True)
 if download.exists():assert digest(download)==digest(dest)
 else:shutil.copy2(dest,download)
 # Every earlier review ZIP remains available in Downloads as instructed; never overwrite a different file.
 prior=[]
 for p in (q/'HANDOFFS').glob('*.zip'):
  d=download.parent/p.name
  if not d.exists():shutil.copy2(p,d)
  assert digest(p)==digest(d);prior.append({'name':p.name,'sha256':digest(p),'downloads_identical':True})
 receipt={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'state':'CLEANUP EXECUTED — AWAITING ACCEPTANCE','canonical':str(dest),'downloads':str(download),'sha256':digest(dest),'members':len(entries)+1,'indexed_entries':len(entries),'crc_and_exact_index_verified':True,'pattern_stage':pre,'pattern_expanded':post,'actual_value_scan_after_deletion':False,'all_review_copies':prior,'owned_listener_stopped':True,'cleanup_acceptance':'Pending Friday; no closeout release','exceptions':'QAM_CLEANUP_REPORT.md; remote_execution.json; exact certificate sections remain unavailable'};(q/'HANDOFFS/CLEANUP_01_RECEIPT.json').write_text(json.dumps(receipt,indent=2)+'\n');print(json.dumps({k:receipt[k] for k in ['state','canonical','downloads','sha256','members','indexed_entries']},indent=2))
finally:
 shutil.rmtree(stage);shutil.rmtree(expanded)
