"""Append the focused confirmation columns while retaining the original phase records."""
from pathlib import Path
import json
q=Path(__file__).resolve().parents[2]
e=q/'evidence/Q4/A3'
summary=json.loads((e/'automation-summary.json').read_text())
a2=json.loads((e.parent/'A2/summary.json').read_text())
matrix=q/'AC_EVIDENCE_MATRIX.md'
src=matrix.read_text()
section=src.split('## Final Q4 side-by-side evidence',1)[1].split('### Director walkthrough',1)[0]
ordered={}
for line in section.splitlines():
    if not line.startswith(('| AC-','| J-')):
        continue
    cells=[c.strip() for c in line.strip('| ').split('|')]
    ident=cells[0]
    ordered[ident]=(cells[-2],cells[-1])
assert len(ordered)==46
q4={'AC-B05':'PASS, per Friday. Round decorative pill accepted.','AC-B06':'PASS, per Friday. Corrected probe and one timeout retained.',
    'AC-B07':'FAIL on F36, per Friday.','AC-B08':'FAIL on F36, per Friday.','AC-L04':'PASS, per Friday.',
    'AC-L02':'PASS on the mock layout, per Friday.','AC-F02':'PASS, per Friday. One extra Firefox route was incomplete.'}
a2map={'AC-B05':'Store admin initials avatar identified in one dashboard load.','AC-B07':'36/36 links meet the surface rule. F36 measured separately from F37.',
       'AC-B08':'36/36 F36 samples pass. Two Chromium Invite captures retain unmeasured text ranges.',
       'AC-H01':'Placement and anchor walk passed. F37 found with article 1 Enter in Firefox at desktop sizes.',
       'AC-H02':'Help forbidden-term checks passed for Owner A and Store admin.','AC-H03':'Role-specific Help app links passed. Pure active Member fixture unavailable, accepted limit.',
       'AC-L04':'No overflow in 30/30 Help positions.','AC-P01':'Updated Help label placement checked in both roles.',
       'AC-R01':'408 OwedBook and 588 Portal unit tests passed.','AC-R02':'Both clean installs, typechecks, lint and builds passed.',
       'AC-R03':'Only OwedBook Help and its tests changed in source. Record delta pinned.','AC-R06':f"{a2['sessionAttempts']}/20 sign-in attempts. Owner B reserved."}
def counts(section):
    arr=[(k,v) for k,v in summary['counts'].items() if k.endswith(' / '+section)]
    return ', '.join(f'{n} {k}' for k,n in sorted({r:sum(v.get(r,0) for _,v in arr) for r in set().union(*(v.keys() for _,v in arr))}.items()))
a3map={'AC-H01':f"{summary['passingPostInputActivations']}/468 post-input activation cases pass. Menu destinations: {counts('Help regression menu destinations')}. See automation-summary.json for missing/incomplete cells and first observations.",
       'AC-H02':counts('Help forbidden terms and changed labels'),'AC-B07':counts('A2-1 F36 rendered contrast'),
       'AC-B08':f"Rendered link contrast: {counts('A2-1 F36 rendered contrast')}. Minimum {summary['worstRenderedRatio']}:1.",
       'AC-L04':'Help geometry and horizontal overflow: '+counts('A2-1 structure and dimensions'),
       'AC-P01':counts('Help forbidden terms and changed labels'),'AC-R01':'409 OwedBook and 588 Portal unit tests passed.',
       'AC-R02':'Both clean installs, typechecks, lint and labelled builds passed.','AC-R03':'Two OwedBook source/test paths differ from A2. No Portal source/test or protected path differs.',
       'AC-R06':f"{summary['sessionAttempts']}/15 automated sessions, {summary['portalDocumentResponses']} Portal page loads."}
lines=['','## Q2, Q4, A2 and A3 confirmation by criterion and journey','',
 'Q2 and Q4 rows retain their original scope. Friday’s subsequent rulings appear in the Q4 column where applicable. The A2 and A3 per-path proofs are in evidence/Q4/{A2,A3}/entry-comparison.json. A carried result keeps every earlier qualification and Gate D deferral. A3 run evidence is in evidence/Q4/A3/automation-summary.json and the named raw files.','',
 '| Criterion or journey | Q2 | Q4 | A2 | A3 |','|---|---|---|---|---|']
for ident,(base,last) in ordered.items():
    lines.append(' | '.join(['| '+ident,base,q4.get(ident,last),a2map.get(ident,'Carry earlier scope and disposition.'),a3map.get(ident,'Carry earlier scope and disposition.')+' |']))
assert lines[1] not in src
with matrix.open('a') as f:f.write('\n'.join(lines)+'\n')
