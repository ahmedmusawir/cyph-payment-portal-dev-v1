"""Run the single authorized mock table probe, restoring real OwedBook afterward."""
from pathlib import Path
import json, os, re, signal, subprocess, time, urllib.request
from datetime import datetime, timezone

q=Path('agent_docs/ACTIONS/ABM007_FINAL/QAM')
e=q/'evidence/Q4'
rt=Path('/tmp/abm007-final-cody-q4')
env={**os.environ, 'PLAYWRIGHT_BROWSERS_PATH':str(rt/'pw-browsers')}
log=e/'05/mock-transition.json'
rows=[]

def mark(**row):
    rows.append({'time':datetime.now(timezone.utc).isoformat(),**row})
    log.write_text(json.dumps(rows,indent=2)+'\n')

def info():
    with urllib.request.urlopen('http://127.0.0.1:3100/api/build-info',timeout=4) as r:
        return json.load(r)

def listener():
    raw=subprocess.check_output(['ss','-ltnpH','sport = :3100'],text=True)
    return re.findall(r'pid=(\d+)',raw)

def stop(which):
    state=json.loads((rt/(which+'-process.json')).read_text())
    pid=state['server']
    assert listener()==[str(pid)]
    assert Path(f'/proc/{pid}/cwd').resolve()==rt/which
    assert os.getpgid(pid)==state['logger']
    os.kill(state['logger'],signal.SIGTERM)
    for _ in range(50):
        if not listener():
            mark(stopped=which,pid=pid)
            return
        time.sleep(.2)
    raise RuntimeError('QA listener failed to stop')

def start(app):
    subprocess.Popen(['node',str(q/'AUTOMATION/Q4/serve.mjs'),app],stdin=subprocess.DEVNULL,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True)
    pinned=json.loads((e/'01'/f'{app}-build-identity.json').read_text())
    for _ in range(60):
        try:
            data=info()
            if data.get('revision')==pinned['manifest'] and data.get('artifactId')==pinned['label']:
                mark(started=app,compiled=data)
                return
        except OSError:
            pass
        time.sleep(.3)
    raise RuntimeError('Restored candidate did not start')

assert 'loose-ends ' in (e/'05/phase-exits.txt').read_text()
assert not log.exists()
build=subprocess.run(['node',str(q/'AUTOMATION/Q4/gating.mjs'),'mock-ob'],env=env,check=False)
mark(mockBuildExit=build.returncode)
if build.returncode!=0:
    raise SystemExit('Mock build blocked; real OwedBook remains running')
subprocess.run(['python3',str(q/'AUTOMATION/Q4/manifest.py'),'check','ob','--copy','mock-ob'],check=True)
wasStopped=False
try:
    stop('ob')
    wasStopped=True
    start('mock-ob')
    probe=subprocess.run(['node',str(q/'AUTOMATION/Q4/mock-table.mjs')],env=env)
    mark(mockProbeExit=probe.returncode)
finally:
    if wasStopped:
        if listener():
            stop('mock-ob')
        start('ob')
