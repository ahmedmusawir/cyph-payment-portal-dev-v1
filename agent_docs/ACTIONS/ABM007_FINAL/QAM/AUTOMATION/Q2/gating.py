from pathlib import Path
import subprocess,json,os,concurrent.futures
q=Path('/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/agent_docs/ACTIONS/ABM007_FINAL/QAM');e=q/'evidence/Q2/01';base=Path('/tmp/abm007-final-cody-q2');env={k:os.environ[k] for k in ['PATH','HOME']};env.update(CI='1',NEXT_TELEMETRY_DISABLED='1');controls=base/'runner-controls';controls.mkdir(exist_ok=True);(controls/'pass.test.js').write_text('test("passing control",()=>expect(1).toBe(1));\n');(controls/'fail.test.js').write_text('test("seeded failing control",()=>expect(1).toBe(2));\n')
def run(app):
 d=base/app;receipt=[]
 if (base/f'install-{app}.exit').read_text().strip()!='0':return {'app':app,'blocked':'clean install failed'}
 for control in ['pass','fail']:
  cmd=[str(d/'node_modules/.bin/jest'),'--runInBand','--config',json.dumps({'rootDir':str(controls),'testMatch':[f'**/{control}.test.js']})];r=subprocess.run(cmd,cwd=d,env=env,capture_output=True,text=True);(e/f'{app}-runner-{control}.log').write_text(r.stdout+r.stderr);receipt.append({'command':cmd,'cwd':str(d),'exit':r.returncode,'control':control})
 if receipt[0]['exit']!=0 or receipt[1]['exit']==0:return {'app':app,'blocked':'runner controls failed','controls':receipt}
 (e/f'{app}-runner-controls.json').write_text(json.dumps(receipt,indent=2))
 for name,cmd in [('unit',['npm','test','--','--runInBand']),('typecheck',['node_modules/.bin/tsc','--noEmit']),('lint',['npm','run','lint'])]:
  r=subprocess.run(cmd,cwd=d,env=env,capture_output=True,text=True);(e/f'{app}-{name}.log').write_text(r.stdout+r.stderr);receipt.append({'test':name,'command':cmd,'cwd':str(d),'exit':r.returncode});(e/f'{app}-gating.json').write_text(json.dumps(receipt,indent=2))
 return {'app':app,'results':receipt}
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as x:
 for r in x.map(run,['ob','pp']):print(json.dumps(r),flush=True)
