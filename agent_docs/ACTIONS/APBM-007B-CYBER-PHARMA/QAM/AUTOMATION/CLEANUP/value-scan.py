from pathlib import Path
import os,json,shutil,zipfile,hashlib,subprocess,datetime,sys
os.umask(0o077);repo=Path.cwd();q=repo/'agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/QAM';label=sys.argv[1] if len(sys.argv)>1 else 'initial';stage=Path('/tmp/apbm007b-qa-cleanup-01')/('value-scan-'+label);stage.mkdir(parents=True,mode=0o700,exist_ok=False);zips=[];copied=0
for src in q.rglob('*'):
 if not src.is_file() or src.is_symlink() or src.name.startswith('.') or '__pycache__' in src.parts:continue
 if src.suffix=='.zip':zips.append(src);continue
 p=stage/'records'/src.relative_to(q);p.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,p);copied+=1
expanded=0
for src in zips:
 with zipfile.ZipFile(src) as z:
  assert z.testzip() is None
  assert all(not Path(n).is_absolute() and '..' not in Path(n).parts for n in z.namelist())
  assert sum(x.file_size for x in z.infolist())<1024**3
  z.extractall(stage/'archives'/src.stem);expanded+=len(z.namelist())
# All review ZIPs are explicitly expanded; report any nested archive rather than claiming it was scanned as text.
nested=[str(p.relative_to(stage)) for p in stage.rglob('*.zip')];assert not nested,'Nested archive requires separate safe expansion before a complete value scan'
cmd=['node',str(q/'AUTOMATION/Q4_02/export-private-scan.cjs'),str(stage)];r=subprocess.run(cmd,cwd=repo,capture_output=True,text=True,timeout=180)
try:actual=json.loads(r.stdout)
except:raise RuntimeError('Actual-value scan non-JSON; sensitive output withheld')
report={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'label':label,'credential_source_present':(repo/'.env.qa.local').is_file(),'retained_QAM_files_copied':copied,'archives_expanded':len(zips),'expanded_members':expanded,'archive_sha256s':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in zips},'actual_value_scan':actual,'exit':r.returncode,'credential_values_or_hashes_printed':False,'scan_order':'Before private credential removal; actual values loaded only in scanner memory'}
(q/'evidence/CLEANUP/01'/('value_scan_'+label+'.json')).write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'label':label,'credential_source_present':report['credential_source_present'],'archives':len(zips),'expanded_members':expanded,'actual_value_scan':actual,'exit':r.returncode}));sys.exit(r.returncode)
