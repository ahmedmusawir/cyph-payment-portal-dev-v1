from pathlib import Path
import os,json,hashlib,subprocess,shutil,datetime,sys
os.umask(0o077);repo=Path.cwd();q=repo/'agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/QAM';e=q/'evidence/CLEANUP/01';mode=sys.argv[1];private=Path('/home/moose/.apbm007b/apbm007b-qa-20261117T074504611Z-c414c4af')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None
def protected():
 out={}
 for root in [repo,repo.parent/'cyph-v1-dev']:
  r=subprocess.run(['git','diff','HEAD','--name-only'],cwd=root,capture_output=True,text=True,env={**os.environ,'GIT_OPTIONAL_LOCKS':'0'},check=True);outside=[x for x in r.stdout.splitlines() if '/QAM/' not in x];out[root.name]={'HEAD':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'outside_QAM_tracked_changes':outside,'director_env_local_stat':{k:getattr((root/'.env.local').stat(),k) for k in ['st_ino','st_size','st_mtime_ns']},'status':subprocess.check_output(['git','status','--porcelain'],cwd=root,text=True,env={**os.environ,'GIT_OPTIONAL_LOCKS':'0'}).splitlines()}
 return out
names=['APBM-007B-CYBER-PHARMA_'+x for x in ['Q1_REVIEW_01','Q1_REVIEW_02','Q2_REVIEW_01','Q4_REVIEW_01','Q4_REVIEW_02_EXPANDED','Q4_REVIEW_02_STAGE','STOP_REVIEW_01','STOP_REVIEW_02','STOP_REVIEW_03','STOP_REVIEW_04']]+['APBM007B_'+x for x in ['Q2_01_EXPANDED','Q2_PRE_EXPORT','Q4_FINAL_PREFLIGHT','Q4_REVIEW01_EXPANDED','STOP02_EXPANDED','STOP03_EXPANDED','STOP04_EXPANDED']]+['apbm007b-qa-q4-02','apbm007b-qa-cleanup-01','apbm007b-q4-s1.json','apbm007b-qa-foreign-fixture.json']
helpers=['apbm007b-watch-grouped.cjs','finalize_apbm007b_q2_records.py','package_apbm007b_q2_final.py','package_apbm007b_q4_final.py','package_apbm007b_q4_stop03.py','package_apbm007b_q4_stop04.py','apbm-q2-package.py','apbm-q2-report.py']
paths=[private,repo/'.env.qa.local']+[Path('/tmp')/n for n in names+helpers]
# Delete the old O1 cast only if exact Auth IDs and addresses have been proved to belong to this QA cast.
verify=json.loads((e/'remote_verification.json').read_text()) if (e/'remote_verification.json').exists() else {}
if verify.get('temporary_cast_matches_QA'):paths.append(Path('/tmp/apbm007b-o1-cast.json'))
if mode=='prepare':
 d={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'protected_before':protected(),'paths':[str(p) for p in paths],'old_archives':{p.name:sha(p) for p in (q/'HANDOFFS').glob('*.zip')}}
 for n in helpers:
  p=Path('/tmp')/n
  if p.is_file():
   dest=q/'AUTOMATION/CLEANUP/retained_helpers'/n;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,dest)
 (e/'local_plan.json').write_text(json.dumps(d,indent=2)+'\n');print('Prepared explicit local allowlist and retained temporary automation helpers')
elif mode=='execute':
 scan=json.loads((e/'value_scan_final.json').read_text());assert scan['exit']==0 and scan['credential_source_present'] and not scan['actual_value_scan']['hits'];assert verify.get('PASS')
 plan=json.loads((e/'local_plan.json').read_text());out={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'final_value_scan_sha256':sha(e/'value_scan_final.json'),'removals':[]}
 for name in plan['paths']:
  p=Path(name);assert p in paths
  existed=p.exists() or p.is_symlink()
  if p.is_symlink():p.unlink()
  elif p.is_dir():shutil.rmtree(p)
  elif p.exists():p.unlink()
  out['removals'].append({'path':str(p),'result':'removed' if existed else 'already_absent','verified_absent':not p.exists() and not p.is_symlink()})
 out['protected_after']=protected();out['protected_matches_before']=all(out['protected_after'][k]['HEAD']==v['HEAD'] and out['protected_after'][k]['director_env_local_stat']==v['director_env_local_stat'] and out['protected_after'][k]['outside_QAM_tracked_changes']==v['outside_QAM_tracked_changes'] for k,v in plan['protected_before'].items());out['old_archives_unchanged']=all(sha(q/'HANDOFFS'/n)==h for n,h in plan['old_archives'].items());out['no_physical_secure_erasure_claim']='Filesystem removal verified; no assertion of storage-level erasure or backup deletion';(e/'local_execution.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps({k:out[k] for k in ['protected_matches_before','old_archives_unchanged']}))
else:raise SystemExit('prepare or execute')
