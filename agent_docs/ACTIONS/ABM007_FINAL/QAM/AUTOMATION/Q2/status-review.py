import json,pathlib,collections
q=pathlib.Path('agent_docs/ACTIONS/ABM007_FINAL/QAM');out=q/'evidence/Q2/23';brand=['rgb(50, 163, 141)','rgb(40, 132, 114)','rgb(21, 68, 116)'];
def check(x):
 return bool(x['wordPresent']) and any(float(v[:-2])>0 for v in x['borderWidth'].split()) and x['image'].startswith('linear-gradient(') and not any(b in x['border'] for b in brand)
good={'wordPresent':True,'borderWidth':'1px','image':'linear-gradient(rgba(33,115,222,0.1),rgba(33,115,222,0.1))','border':'rgb(33, 115, 222)'}
controls={'positive':check(good),'brandGreenRejected':not check(dict(good,border=brand[0])),'brandNavyRejected':not check(dict(good,border=brand[2])),'missingWordRejected':not check(dict(good,wordPresent=False)),'missingBorderRejected':not check(dict(good,borderWidth='0px')),'missingTintRejected':not check(dict(good,image='none'))};(out/'status-controls.json').write_text(json.dumps(controls,indent=2));assert all(controls.values())
rows=[];roles={'ENGINEERING_ADMIN':'Store admin','ENGINEERING_MEMBER':'Member','ENGINEERING_OWNER_A':'Owner'}
for p in (q/'evidence/Q2/20').glob('*/results.json'):
 for r in json.loads(p.read_text())['rows']:
  if not r.get('completed'):continue
  for n,x in enumerate(r.get('surface',{}).get('status',[])):
   passed=check(x) if x['kind']=='status' else roles.get(r['role']) in x['knownRole']
   rows.append({'role':r['role'],'app':r['app'],'route':r['requested'],'engine':r['engine'],'width':r['width'],'ordinal':n,'kind':x['kind'],'result':'PASS' if passed else 'REVIEW','evidence':str(p.relative_to(q))})
(out/'status-review.json').write_text(json.dumps({'limits':'Observed completed screens only, not all future business states. Checks word/border/tint and designated role text; source token review remains required. Counts are not journeys.','rows':rows},indent=2));print(dict(collections.Counter(x['result'] for x in rows)))
