from pathlib import Path,PurePosixPath
import json,hashlib,zipfile,subprocess,shutil,datetime
p=Path.cwd();m=p/'agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA';q=m/'QAM';h=q/'HANDOFFS';stem='APBM-007B-CYBER-PHARMA_Q2_REVIEW_01';stage=Path('/tmp')/stem;stage.mkdir(exist_ok=False,mode=0o700)
assert json.loads((q/'evidence/Q2/02/phase_exit_processes.json').read_text())['all_owned_stopped']
files=['QAM_STATE.md','QAM_ENTRY.md','QAM_PREFLIGHT.md','QAM_MANIFEST.md','QAM_RECON_REPORT.md','QAM_TEST_PLAN.md','QAM_APPROVAL.md','QAM_EXECUTION_REPORT.md','AC_EVIDENCE_MATRIX.md','FINDINGS.md','QAM_CLEANUP_REPORT.md','QAM_RISK_REQUIREMENTS.md','QAM_PACKAGING.md','GOVERNING/README.md','TEST_IDENTITIES.md','HANDOFFS/ENGINEERING_HANDOFF.md','HANDOFFS/CANDIDATE_PAIR_2026-11-17.md','HANDOFFS/QA_INPUTS_PREPARATION.md','HANDOFFS/QA_NEAR_END_RESUME.md','HANDOFFS/Q2_REVIEW_DECISIONS.md','HANDOFFS/REVIEW_START_HERE.md']
selected_images={'evidence/Q2/02/screens/skip-link-fresh.png','evidence/Q2/02/screens/skip-link-one-tab.png'};excluded=[]
for root in [q/'evidence/Q2/01',q/'evidence/Q2/02',q/'AUTOMATION/Q2']:
 for f in sorted(root.rglob('*')):
  if not f.is_file():continue
  rel=str(f.relative_to(q))
  if f.is_symlink() or (f.suffix.lower() in ['.png','.jpg','.jpeg','.zip','.webm'] and rel not in selected_images) or f.name=='candidate_to_execution_full.diff' or f.name.startswith('.'):
   excluded.append({'path':rel,'reason':'unreviewed/private binary or raw diff, old archive, symlink or transient file; excluded'});continue
  files.append(rel)
refs=[]
source_files=[m/'ACCEPTANCE_SPEC.md',m/'APBM_RULINGS.md',m/'CONTRACT_MANIFEST.json',m/'ENVIRONMENT_AND_EFFECTS.md',m/'SUPPORT_PROCEDURES.md',m/'ENGINEERING_COMMANDS.md',m/'STAGING_AND_GATE_D.md',*sorted((m/'CONTRACTS').glob('*.md')),*sorted((m/'GOVERNING').glob('*.md'))]
for f in source_files:
 if f.is_file():refs.append({'path':str(f),'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
(h/'SOURCE_REFERENCES_Q2_01.json').write_text(json.dumps({'references':refs,'qualification':'Current repository append-only contracts govern under Friday QL01 adjudication; manifest correction at closeout, non-gating. Engineering handoff/results are claims, not QA results.','selected_images':sorted(selected_images),'excluded':excluded},indent=2));files.append('HANDOFFS/SOURCE_REFERENCES_Q2_01.json');files=list(dict.fromkeys(files));count=len(files)+2
with(q/'QAM_STATE.md').open('a')as f:f.write(f'\nCody Q2/01 pre-export snapshot: Q2 COMPLETE — AWAITING ADJUDICATION; unchanged frozen pair, all human observations and independent screen follow-up complete, own runtime/listener/local containers stopped, every fixture retained. Package {stem}.zip, {count} members. Final ZIP hash external only; no self hash embedded.\n')
entries=[]
for name in files:
 f=q/name;assert f.is_file(),name;dest='REVIEW_START_HERE.md'if name=='HANDOFFS/REVIEW_START_HERE.md'else name;target=stage/dest;target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(f,target);entries.append({'archive_path':stem+'/'+dest,'source_path':str(f),'purpose':'Final independent Q2 result/evidence, source authority or phase-exit record; no certificate','bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
def scan(folder):
 r=subprocess.run(['node','scripts/apbm007b/privacy-scan.mjs','--dir',str(folder)],capture_output=True,text=True);assert r.returncode==0,r.stdout
 v=subprocess.run(['node',str(q/'AUTOMATION/Q2/export-private-scan.cjs'),str(folder)],capture_output=True,text=True);print(v.stdout.strip());assert v.returncode==0,'Withhold unsafe export: private-value gate failed'
 return{'pattern_scan':json.loads(r.stdout),'actual_value_scan':json.loads(v.stdout)}
validation=scan(stage);validation.update({'phase':'Q2 COMPLETE — AWAITING ADJUDICATION','integrity_scope':'Exact final member/index/size/hash/CRC and expanded scans verified externally after ZIP construction; final ZIP hash external only','image_selection':'Only two visually reviewed signed-out empty-form skip-link comparison images included; all other images excluded','fixture_cleanup':'No remote/provider/Auth fixture deletion, context disable or further refund; own process hygiene only'});vf=stage/'EXPORT_VALIDATION.json';vf.write_text(json.dumps(validation,indent=2));entries.append({'archive_path':stem+'/EXPORT_VALIDATION.json','source_path':'generated QA export validation while private sources retained','purpose':'Pattern/private-value controls and safe export scan counts; no values or credential hashes','bytes':vf.stat().st_size,'sha256':hashlib.sha256(vf.read_bytes()).hexdigest()})
index={'package':stem+'.zip','module_id':'APBM-007B-CYBER-PHARMA','phase':'Q2','attempt':'01','produced_by':'Cody / Codex QA Executor','produced_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'candidate_sha':'427bec6267b9777e9cb44f81c22d1396a495bc14','candidate_pair':{'portal':'427bec6267b9777e9cb44f81c22d1396a495bc14','owedbook':'c8a2ed9bbfdfecbfc536b941b3d2f8bfacbb6cea'},'qa_execution_head':'61b683ab2aeeb18905666a56feed2d2513b6e6c5','plan_sha256':hashlib.sha256((q/'QAM_TEST_PLAN.md').read_bytes()).hexdigest(),'hash_scope':'every member except FILE_INDEX.json','state_snapshot':'immutable pre-export; completed ZIP hash only in external receipt and subsequent live state','status':'Q2 COMPLETE — AWAITING ADJUDICATION; no certification/deployment/retention acceptance','privacy_scan':{'scanner':'candidate privacy-scan.mjs plus actual-private-value/session/token export gate','validated_with_synthetic_fixture_and_clean_control':True,'hits':0},'members':entries,'excluded':excluded}
(stage/'FILE_INDEX.json').write_text(json.dumps(index,indent=2));(h/'FILE_INDEX.json').write_text(json.dumps(index,indent=2));scan(stage)
z=h/(stem+'.zip');assert not z.exists(),'Do not overwrite an immutable review ZIP'
with zipfile.ZipFile(z,'w',zipfile.ZIP_DEFLATED)as a:
 for f in sorted(stage.rglob('*')):
  if f.is_file():a.write(f,stem+'/'+str(f.relative_to(stage)))
with zipfile.ZipFile(z)as a:
 names=a.namelist();assert a.testzip()is None;assert len(names)==len(set(names))==count;assert set(names)=={x['archive_path']for x in entries}|{stem+'/FILE_INDEX.json'}
 for name in names:assert not PurePosixPath(name).is_absolute()and '..'not in PurePosixPath(name).parts
 for entry in entries:
  value=a.read(entry['archive_path']);assert len(value)==entry['bytes'];assert hashlib.sha256(value).hexdigest()==entry['sha256']
 expanded=Path('/tmp/APBM007B_Q2_01_EXPANDED');assert not expanded.exists();expanded.mkdir(mode=0o700);a.extractall(expanded)
scan(expanded);sha=hashlib.sha256(z.read_bytes()).hexdigest();dest=Path.home()/'Downloads'/z.name
if dest.exists():assert dest.read_bytes()==z.read_bytes(),'Existing download copy differs; do not overwrite'
else:shutil.copy2(z,dest)
assert dest.read_bytes()==z.read_bytes()
receipt=f'Cody {datetime.datetime.now(datetime.timezone.utc).isoformat()} Q2/01 COMPLETE — AWAITING ADJUDICATION: {z}; {count} members; SHA-256 {sha}; exact indexed membership/bytes/hashes, safe paths, CRC, staged and expanded pattern + actual private-value scans PASS. Downloads copy byte-identical: {dest}. Friday adjudicates six F findings and O001 together, then verdict/repair-retest/retention instructions. No certification/deployment or new disposition. Owned3100/3101/listener/local containers actually stopped, Director3000/3001/3457 unchanged; Tony may restart his listener. All fixtures retained, F001 unrefunded.\n'
for f in [h/'README.md',q/'QAM_STATE.md']:
 with f.open('a')as o:o.write('\nPost-export receipt: '+receipt)
(h/'Q2_01_RECEIPT.json').write_text(json.dumps({'path':str(z),'downloads':str(dest),'members':count,'sha256':sha,'status':'Q2 COMPLETE — AWAITING ADJUDICATION','validated':True,'candidate_pair':index['candidate_pair'],'qa_execution_head':index['qa_execution_head'],'plan_sha256':index['plan_sha256'],'listener_stopped':True,'fixtures_retained':True},indent=2));print(receipt)
