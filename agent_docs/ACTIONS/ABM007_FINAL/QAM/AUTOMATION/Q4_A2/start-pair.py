"""Launch the two pinned A2 production builds and keep the redacted launcher receipts."""
from pathlib import Path
from time import monotonic,sleep
import json
import subprocess

q=Path('agent_docs/ACTIONS/ABM007_FINAL/QAM')
e=q/'evidence/Q4/A2'
for app in ('ob','pp'):
    identity=json.loads((e/f'{app}-build-identity.json').read_text())
    steps=json.loads((e/f'{app}-gating.json').read_text())['rows']
    assert len(steps)==5 and identity['pass'] and all(s['exit']==0 for s in steps)
    subprocess.run(['python3',str(q/'AUTOMATION/Q4_A2/manifest.py'),'check',app],check=True)
for port in (3100,3101):
    assert not subprocess.check_output(['ss','-ltnpH','sport = :'+str(port)]).strip()
with (e/'start-pair.log').open('x') as log:
    children={app:subprocess.Popen(['node',str(q/'AUTOMATION/Q4_A2/serve.mjs'),app],
                    stdin=subprocess.DEVNULL,stdout=log,stderr=log,start_new_session=True) for app in ('ob','pp')}
    end=monotonic()+30
    while monotonic()<end:
        assert all(c.poll() is None for c in children.values())
        if all(subprocess.check_output(['ss','-ltnpH','sport = :'+str(port)]).strip() for port in (3100,3101)):
            break
        sleep(.3)
    else:
        raise SystemExit('A2 listeners did not become available')
subprocess.run(['node',str(q/'AUTOMATION/Q4_A2/verify-live.mjs'),'entry'],check=True)
