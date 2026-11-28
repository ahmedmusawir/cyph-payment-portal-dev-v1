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
# Include only the named text evidence classes and current instrument evidence.
files={'REVIEW_START_HERE.md':r,'HANDOFFS/DIRECTOR_WALKTHROUGH_SHEET_05_A3.md':h/'DIRECTOR_WALKTHROUGH_SHEET_05_A3.md',
       'HANDOFFS/Q4_A3_POST_COMMIT_CHECK.md':h/'Q4_A3_POST_COMMIT_CHECK.md'}
for p in e.rglob('*'):
    if p.is_file() and not p.is_symlink() and p.suffix in {'.json','.jsonl','.md','.log','.diff'}:
        files[p.relative_to(q).as_posix()]=p
scan=subprocess.run(['node','/tmp/abm007-final-cody-q4/q4-privacy.mjs'],input=json.dumps([str(p) for p in files.values()]),text=True,capture_output=True,check=True)
privacy=e/'walkthrough-release-privacy.json'
with privacy.open('x') as f:f.write(scan.stdout)
files[privacy.relative_to(q).as_posix()]=privacy
dest=Path('/home/moose/Downloads')/f'ABM007_FINAL_Q4_A3_WALKTHROUGH_RELEASE_{stamp}.zip'
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
with (h/'Q4_A3_WALKTHROUGH_RELEASE_RECEIPT.json').open('x') as f:json.dump(receipt,f,indent=2)
print(receipt)
