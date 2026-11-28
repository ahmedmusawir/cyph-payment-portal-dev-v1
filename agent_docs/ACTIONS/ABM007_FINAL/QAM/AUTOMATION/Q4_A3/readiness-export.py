"""Publish the verified A3 readout and sheet as an indexed Downloads return."""
import json
import subprocess
from collections import Counter
from datetime import datetime
from hashlib import sha256
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
from zoneinfo import ZoneInfo
q=Path(__file__).resolve().parents[2]
e=q/'evidence/Q4/A3'
h=q/'HANDOFFS'
data=json.loads((e/'automation-summary.json').read_text())
live=json.loads((e/'served-walkthrough.json').read_text())
stamp=datetime.now(ZoneInfo('Asia/Dhaka')).strftime('%Y-%m-%d_%H%M%S_BDT')
groups=sorted(data['counts'].items())
counts='\n'.join('| '+k+' | '+', '.join(str(n)+' '+r for r,n in v.items())+' |' for k,v in groups)
outlines='\n'.join('- '+k+' — '+', '.join(str(d['count'])+' settled observations, '+d['outline']+', offset '+d['offset'] for d in v) for k,v in data['headingAppearanceByInput'].items())
distance=data['distanceReturnByRoleSizeMethod']
distancePass=sum(r['twoDistinctNonzeroDistancesPassed'] for r in distance)
edgeFailures=sum(v['rawResult']=='FAIL' and v['returnPassed'] and v['placement']!='center' for r in distance for v in r['samples'])
native=json.loads((e/'chromium-no-script-native.json').read_text())
r=h/'Q4_A3_AUTOMATED_READOUT.md'
with r.open('x') as f:
    f.write(f"""# A3 confirmation for Friday and Tony

Both freshly labelled production builds matched the A3 manifests and SCRATCH at the pre-walkthrough check. The OwedBook Help source and its unit test were the only product/test changes from A2. The path-by-path comparison is in entry-comparison.json.

| App | Manifest SHA-256 | Compiled build ID | Port |
|---|---|---|---:|
""")
    for row in live['apps']:
        f.write(f"| {row['app']} | `{row['manifest']}` | `{row['buildId']}` | {row['port']} |\n")
    f.write(f"""
Clean lockfile installs, typecheck, lint and labelled builds all exited zero. OwedBook passed 60 suites / 409 tests. Portal passed 37 / 588. Lint warnings were 38 and 27.

Friday classified F37 as a low-severity product defect and accepted the remaining A2 readout with its qualifications. On A3 the **unchanged A2 Firefox procedure** recorded {dict(Counter(v['result'] for v in data['A2ExactProcedure']))} across the original four positions. See firefox-enter-settled.json. firefox-diagnostic-results.json in the A3 directory is a byte copy of the A2 input used to select those four positions.

The strict five-sample result across all 13 articles was **{data['passingPostInputActivations']} of {data['plannedActivations']} PASS**. Each case tests one role, engine, viewport and input method. automation-summary.json lists every missing or nonpassing case. For the first Firefox run, the clock started during click dispatch. Both Firefox files were kept. INSTRUMENT_TIMING.md describes the clock change and firefox-clock-controls.json captures its offline comparison. The post-input clock starts at the first evaluation following the input command and never waits for the scroll or focus result.

The lowest measured link contrast was {data['worstRenderedRatio']}:1. Per-article evidence includes painted background samples, outlines and target heights. The supplemental distance rows record the actual starting scroll position, including any start already at zero. Refer to the raw rows for each of the five requested timepoints and their actual elapsed milliseconds.

With the post-input clock, {distancePass}/{len(distance)} engine, role, width and input combinations demonstrated a return from two distinct nonzero distances for article 1. At the viewport edges, {edgeFailures} supplemental observations reached and stayed at zero but failed the separate full-outline assertion. The raw results retain those failures. The centered link outline is part of every main Enter result. The original scripts-disabled Chromium check timed out. The browser-protocol check with page script execution disabled recorded {native['result']} (stage: {native.get('stage')}, start scroll: {native.get('startY')}). See chromium-no-script-native.json.

## Heading after activation

{outlines}

## All recorded groups

| Instrument file / check | Result counts |
|---|---|
{counts}

## Effects and manual status

Automated sign-in attempts: {data['sessionAttempts']} of 15. Session sign-out responses: {data['signoutStatuses']}. Account & Billing browser document loads: {data['portalDocumentResponses']}. Browser contexts ran serially. Owner B remains reserved for Tony. No email, invitation, removal, hosted billing, purchase, Stripe write or fixture change was initiated. The Portal build-info API was read for identity verification.

W-09 and W-10 await Tony’s own words. Both builds remain serving. The post-commit check remains for Tony after his commit. Friday adjudicates.
""")
# Include only the named text evidence classes and current instrument evidence.
files={'REVIEW_START_HERE.md':r,'HANDOFFS/DIRECTOR_WALKTHROUGH_SHEET_05_A3.md':h/'DIRECTOR_WALKTHROUGH_SHEET_05_A3.md',
       'HANDOFFS/Q4_A3_POST_COMMIT_CHECK.md':h/'Q4_A3_POST_COMMIT_CHECK.md'}
for p in e.rglob('*'):
    if p.is_file() and not p.is_symlink() and p.suffix in {'.json','.jsonl','.md','.log','.diff'}:
        files[p.relative_to(q).as_posix()]=p
scan=subprocess.run(['node','/tmp/abm007-final-cody-q4/q4-privacy.mjs'],input=json.dumps([str(p) for p in files.values()]),text=True,capture_output=True,check=True)
privacy=e/'walkthrough-export-privacy.json'
with privacy.open('x') as f:f.write(scan.stdout)
files[privacy.relative_to(q).as_posix()]=privacy
dest=Path('/home/moose/Downloads')/f'ABM007_FINAL_Q4_A3_WALKTHROUGH_READINESS_{stamp}.zip'
idx=[]
with ZipFile(dest,'x',ZIP_DEFLATED) as z:
    for name,p in sorted(files.items()):
        raw=p.read_bytes()
        z.writestr(name,raw)
        idx.append(dict(path=name,sourcePath=str(p),purpose='A3 confirmation and Director sheet 05',size=len(raw),sha256=sha256(raw).hexdigest()))
    z.writestr('FILE_INDEX.json',json.dumps(idx,indent=2)+'\n')
with ZipFile(dest) as z:
    assert z.testzip() is None and len(set(z.namelist()))==len(z.infolist())==len(idx)+1
    assert set(z.namelist())=={v['path'] for v in idx}|{'FILE_INDEX.json'}
    for v in idx:
        raw=z.read(v['path'])
        assert len(raw)==v['size'] and sha256(raw).hexdigest()==v['sha256']
receipt=dict(path=str(dest),members=len(idx)+1,sha256=sha256(dest.read_bytes()).hexdigest())
with (h/'Q4_A3_WALKTHROUGH_READINESS_RECEIPT.json').open('x') as f:json.dump(receipt,f,indent=2)
print(receipt)
