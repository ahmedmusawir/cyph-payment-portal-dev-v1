"""Export the bounded retest evidence and blank walkthrough sheet."""
from datetime import datetime
from hashlib import sha256
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from zoneinfo import ZoneInfo
import json
import subprocess

q=Path('agent_docs/ACTIONS/ABM007_FINAL/QAM')
h=q/'HANDOFFS'
e=q/'evidence/Q4/A2'
read=lambda n:json.loads((e/n).read_text())
summary=read('summary.json')
entry=read('entry-comparison.json')
live=read('served-after-automation.json')
assert [r['manifest'] for r in live['apps']]==[entry[a]['newManifest'] for a in ('ob','pp')]
now=datetime.now(ZoneInfo('Asia/Dhaka'))
stamp=now.strftime('%Y-%m-%d_%H%M%S_BDT')
state='Q4 A2 AUTOMATION COMPLETE — AWAITING DIRECTOR WALKTHROUGH'
def show(key):
    counts=summary['totals'][key]
    return ', '.join(f'{v} {k}' for k,v in counts.items())
timeline=summary['firefoxSettledEnter']
outcomes=', '.join(f"{r.get('role','unrecorded')} {r.get('width','setup')}px {r['result']}" for r in timeline) or 'none recorded'
measurements=[]
for r in summary['settledRemeasures']:
    c=r['counts']
    measurements.append(f"| {r['engine']} | {r['role']} | {r['route']} | {r['width']} | {r['result']} | "
                        +(f"{c['pass']} / {c['fail']} / {c['notRun']}" if c else 'No result')+' |')
f36=summary['F36LowestMeasured']
f36ratio=f'{f36:.4f}:1' if f36 is not None else 'not measured'
pill=summary['portalAvatar']
report=f"""# ABM007_FINAL — A2 automated confirmation readout

**{state}**  
Prepared {now:%d %B %Y, %H:%M BDT}. Independent observations for Friday. Both current builds remain running for sheet 05.

## Entry and carried-forward Q4 evidence

| App | A2 manifest SHA-256 | Pinned file count | Exact branch and changed-path match |
|---|---|---:|---|
| OwedBook | {entry['ob']['newManifest']} | {entry['ob']['fileCount']} | qa/abm007-final, 23 paths |
| Account & Billing | {entry['pp']['newManifest']} | {entry['pp']['fileCount']} | qa/abm007-final, 235 paths including optional archive lists |

Entry and after-automation checks compare the working trees, isolated copies and served manifests. Both servers are production local-proof against SCRATCH. Across source and tests, only OwedBook HelpPage.tsx and help-page.test.tsx differ from the Q4 manifests. 233 other OwedBook source/test paths and all 216 Portal source/test paths have identical SHA-256 and modes. Unchanged behavior carries the adjudicated Q4 evidence. The full path ledger is in entry-comparison.json. RECOVERY.md was unchanged versus Q4.

Clean installs, both unit suites, typecheck, lint and fresh labelled production builds exited 0. OwedBook: 60 suites, 408 tests, 38 lint warnings. Account & Billing: 37 suites, 588 tests, 27 lint warnings. See the two gating JSON files and logs.

## A2-1 and A2-2

| Check | Recorded coverage |
|---|---|
| 13 article links, placement, menu contents, height and overflow | {show('structure')} of 30 combinations |
| Mouse returns to the top, first/seventh/last | {show('mouse')} of 90 |
| Article keyboard focus, every link, with first/seventh/last Enter | {show('articleFocusEnter')} of 390. Enter returns before settled observation: {dict(summary['keyboardEnterReturns'])} |
| F36 rendered-pixel measurements at 375 and 1440 | {show('F36')} of 36. Lowest measured {f36ratio}. Actual background color sample counts: {dict(summary['F36SurfaceCounts'])}. |
| Desktop menu box geometry | {show('menuGeometry')} of 12 |
| Whole outlines on all 13 menu links by real Tab, 1024×600 and 1440×900 | {show('menuFocus')} of 156 |
| OwedBook Billing Add control at 375 | {show('addFocus')} of 3 |
| Profile password/reveal at 375 | {show('profileFocus')} of 3 pairs |

Firefox desktop first article Enter timeline: {outcomes}. Original focus and return observations are preserved. See firefox-enter-settled.json for the scroll and hash states. Every original timeout, false outline flag and blank first text scope is retained in the first result files, with the sequencing and instrument corrections in DIAGNOSTIC_SCOPE.md.

## Instrument checks and Help regression

| Engine | Role | Route | Width | Result | Passing / failing / unmeasured ranges |
|---|---|---|---:|---|---|
{chr(10).join(measurements)}

The sampling notes and all unmeasured ranges are indexed in summary.json. There was one filled contrast capture per intended route, width and engine position. Initial Chromium Invite results with zero text ranges are preserved separately.

Account & Billing: {pill['result']}. One Store-admin dashboard document. The round shadowed element is the account initials avatar, aria-hidden in the header account control, rendered by Initials in PageHeader.tsx. Evidence is in summary.json and the Chromium response log.

All 13 Help menu destinations: {show('menuRegression')} of 6 engine/role combinations. Forbidden-term and changed-label checks: {show('forbiddenAndLabels')} of 6. Help app links: {show('appLinks')} of 12. The active Member-only fixture is unavailable as recorded and accepted in Friday’s Q4 adjudication. Owner and Store admin were used for the live retest.

## Effects and handoff

{summary['sessionAttempts']} of 20 sign-in attempts, no Owner B automation. Sign-out statuses: {summary['signouts']}. One Account & Billing dashboard document and zero billing documents. No email, invitation, removal, hosted billing, purchase, Stripe write or fixture mutation. The 27 November Q4 dispositions and first-attempt evidence remain intact.

The Director runs W-09 and W-10 on the two serving builds. The final package waits for his words and times. Post-commit verification instructions are in Q4_A2_POST_COMMIT_CHECK.md. Friday adjudicates.
"""
progress=h/'Q4_A2_AUTOMATED_READOUT.md'
with progress.open('x') as f:f.write(report)
sheet=h/'DIRECTOR_WALKTHROUGH_SHEET_05.md'
files={'REVIEW_START_HERE.md':progress,'HANDOFFS/'+sheet.name:sheet,'HANDOFFS/Q4_A2_POST_COMMIT_CHECK.md':h/'Q4_A2_POST_COMMIT_CHECK.md'}
for p in sorted(e.rglob('*')):
    if p.is_file() and p.suffix in {'.json','.jsonl','.md','.log','.txt'}:
        files[p.relative_to(q).as_posix()]=p
scan=subprocess.run(['node','/tmp/abm007-final-cody-q4/q4-privacy.mjs'],
                    input=json.dumps([str(p) for p in files.values()]),text=True,capture_output=True)
if scan.returncode:
    print(scan.stdout)
    raise SystemExit('Readiness archive withheld by privacy scan')
privacy=e/'ready-privacy.json'
privacy.write_text(scan.stdout)
files[privacy.relative_to(q).as_posix()]=privacy
zippath=Path('/home/moose/Downloads')/f'ABM007_FINAL_Q4_A2_WALKTHROUGH_READINESS_{stamp}.zip'
sheetpath=zippath.with_name(f'ABM007_FINAL_DIRECTOR_WALKTHROUGH_SHEET_05_{stamp}.md')
idx=[]
with ZipFile(zippath,'x',ZIP_DEFLATED,compresslevel=6) as z:
    for name,p in files.items():
        raw=p.read_bytes()
        z.writestr(name,raw)
        idx.append({'path':name,'sourcePath':str(p),'purpose':'A2 independent evidence, identity or walkthrough handoff','size':len(raw),'sha256':sha256(raw).hexdigest()})
    z.writestr('FILE_INDEX.json',json.dumps(idx,indent=2)+'\n')
with ZipFile(zippath) as z:
    assert z.testzip() is None and len(set(z.namelist()))==len(idx)+1
    for row in idx:
        b=z.read(row['path'])
        assert len(b)==row['size'] and sha256(b).hexdigest()==row['sha256']
with sheetpath.open('xb') as f:f.write(sheet.read_bytes())
sha=sha256(zippath.read_bytes()).hexdigest()
receipt={'state':state,'zip':str(zippath),'sha256':sha,'members':len(idx)+1,'worksheet':str(sheetpath)}
with (h/'Q4_A2_WALKTHROUGH_READINESS_RECEIPT.json').open('x') as f:json.dump(receipt,f,indent=2)
with (q/'QAM_STATE.md').open('a') as f:
    f.write(f"\n## {now:%d %B %Y, %H:%M BDT} — {state}\n\n")
    f.write(f"Both A2 trees, isolated copies and real SCRATCH builds verified. Automated readout and all first attempts retained. Tony receives sheet 05 for W-09 and W-10. Readiness ZIP `{zippath}`, {len(idx)+1} members, SHA-256 `{sha}`.\n")
print(json.dumps(receipt,indent=2))
