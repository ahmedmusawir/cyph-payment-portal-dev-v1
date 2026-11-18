from pathlib import Path
import os,json,subprocess,zipfile,shutil,datetime,hashlib
os.umask(0o077);repo=Path.cwd();q=repo/'agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/QAM';e=q/'evidence/CLEANUP/01';stage=Path('/tmp/apbm007b-cleanup-retained-pattern');assert not stage.exists();stage.mkdir(mode=0o700)
controls=subprocess.run(['node','scripts/apbm007b/privacy-scan.mjs','--self-test'],capture_output=True,text=True,check=True);known=['evidence/Q2/01/preflight/candidate_to_execution_full.diff','evidence/Q4/01/entry/portal_complete.diff'];allowed={hashlib.sha256((q/n).read_bytes()).hexdigest():n for n in known};results=[]
try:
 for src in q.rglob('*'):
  if not src.is_file() or src.is_symlink() or '__pycache__' in src.parts:continue
  if src.suffix=='.zip':
   with zipfile.ZipFile(src) as z:
    assert z.testzip() is None;assert all(not Path(n).is_absolute() and '..' not in Path(n).parts for n in z.namelist());z.extractall(stage/'archives'/src.stem)
  else:
   p=stage/'records'/src.relative_to(q);p.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,p)
 r=subprocess.run(['node','scripts/apbm007b/privacy-scan.mjs','--dir',str(stage)],capture_output=True,text=True);d=json.loads(r.stdout);exceptions=[];blocking=[]
 for h in d['hits']:
  p=stage/h['file'];sha=hashlib.sha256(p.read_bytes()).hexdigest()
  if h['rule']=='email' and sha in allowed:exceptions.append({**h,'original':allowed[sha],'sha256':sha,'reason':'Historical source diff: public support/sender copy and email-shaped Python decorator tokens, not private QA values. Original contents preserved; both actual-value scans passed. Exact file hash only, no general email exemption.'})
  else:blocking.append(h)
 out={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'credential_source_absent':not (repo/'.env.qa.local').exists(),'controls':json.loads(controls.stdout),'raw_pattern_hits':d['hits'],'classified_historical_exceptions':exceptions,'blocking_hits':blocking,'skipped_binary':d['skipped_binary'],'archives_expanded':len(list((q/'HANDOFFS').glob('*.zip'))),'PASS':not blocking,'no_new_actual_value_scan_claimed':True};(e/'pattern_scan_retained.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps({'PASS':out['PASS'],'raw_pattern_hits':len(d['hits']),'classified':len(exceptions),'blocking':blocking}));assert out['PASS']
finally:shutil.rmtree(stage)
