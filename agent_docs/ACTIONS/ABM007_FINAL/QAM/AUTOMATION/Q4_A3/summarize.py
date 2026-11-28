"""Reconcile every requested A3 cell by role, size, article and input method."""
from collections import Counter, defaultdict
from pathlib import Path
from itertools import product
import json

q=Path(__file__).resolve().parents[2]
e=q/'evidence/Q4/A3'
read=lambda name:json.loads((e/name).read_text())
engines=('firefox','chromium','webkit')
roles=('ENGINEERING_OWNER_A','ENGINEERING_ADMIN')
sizes=((375,900),(1024,600),(1440,900))
rows=[]
sessions=[]
for eng in engines:
    names=[eng+'-results.json']
    if eng=='firefox':
        names+=['firefox-post-input-clock.json']
    for name in names:
        if not (e/name).is_file():
            continue
        d=read(name)
        for row in d['rows']:
            rows.append(dict(row,engine=eng,source=name))
        sessions.extend(d['sessions'])
legacy=read('firefox-enter-settled.json')
sessions+=legacy['sessions']
native=read('chromium-no-script-native.json')
sessions.append(native['session'])
rows.append({'source':'chromium-no-script-native.json','section':'Scripts disabled browser protocol','engine':'chromium','result':native['result']})
missing=[]
counts=defaultdict(Counter)
headings=defaultdict(Counter)
ratios=[]
for row in rows:
    section=row.get('section','setup')
    counts[(row['source'],section)][row['result']]+=1
    if section=='A2-1 F36 rendered contrast':
        ratios.extend(v['worstRatio'] for v in row.get('pixels',{}).get('rows',[]) if v.get('worstRatio') is not None)
for eng,role,(width,height),article,method in product(engines,roles,sizes,range(1,14),('mouse','Enter')):
    source=eng+('-post-input-clock.json' if eng=='firefox' else '-results.json')
    matches=[r for r in rows if r['source']==source and r.get('section')=='Article activation' and (r['role'],r['width'],r['height'],r['article'],r['method'])==(role,width,height,article,method)]
    if len(matches)!=1 or matches[0]['result']!='PASS':
        missing.append(dict(engine=eng,role=role,width=width,height=height,article=article,method=method,result=matches[0]['result'] if matches else 'NOT RUN'))
    if matches and matches[0].get('timeline'):
        t=matches[0]['timeline'][-1]
        headings[(eng,method)][(t['outline'],t['offset'],t['focusVisible'])]+=1
ledger=(e/'session-ledger.jsonl').read_text().splitlines()
docs=[r for s in sessions for r in s['network']['documentResponses'] if ':3101' in r['origin']]
out={'plannedActivations':468,'passingPostInputActivations':468-len(missing),'nonpassingOrMissingActivations':missing,
 'counts':{k+' / '+s:dict(c) for (k,s),c in counts.items()},'pixelSamples':len(ratios),'worstRenderedRatio':min(ratios) if ratios else None,
 'headingAppearanceByInput':{k+' / '+m:[{'outline':x,'offset':y,'focusVisible':z,'count':n} for (x,y,z),n in c.items()] for (k,m),c in headings.items()},
 'A2ExactProcedure':[{k:r.get(k) for k in ('role','width','height','before','timeline','result')} for r in legacy['rows']],
 'sessionAttempts':len(ledger),'signoutStatuses':dict(Counter(str(s.get('signout')) for s in sessions)),
 'portalDocumentResponses':len(docs),'sessionCeiling':15}
# Supplemental distance varies the pre-activation position; an edge-aligned link
# can clip its own outline. Keep that raw result separate from its navigation result.
out['distanceReturnByRoleSizeMethod']=[]
for eng,role,(width,height),method in product(engines,roles,sizes,('mouse','Enter')):
    source=eng+('-post-input-clock.json' if eng=='firefox' else '-results.json')
    scope=[r for r in rows if r['source']==source and r.get('role')==role and r.get('width')==width and r.get('method')==method and (r.get('section')=='Article 1 distance' or r.get('section')=='Article activation' and r.get('article')==1)]
    samples=[]
    for r in scope:
        t=r.get('timeline',[])
        samples.append({'startY':r.get('before'),'placement':r.get('alignment','center'),'rawResult':r['result'],
            'returnPassed':len(t)==5 and all(x['y']==0 and x['header'] and x['focusOnTitle'] for x in t)})
    distinct={v['startY'] for v in samples if v['returnPassed'] and v['startY'] and v['startY']>0}
    out['distanceReturnByRoleSizeMethod'].append({'engine':eng,'role':role,'width':width,'method':method,
        'samples':samples,'twoDistinctNonzeroDistancesPassed':len(distinct)>=2})
p=e/'automation-summary.json'
with p.open('x') as f:json.dump(out,f,indent=2)
print(json.dumps({k:out[k] for k in ('passingPostInputActivations','pixelSamples','worstRenderedRatio','sessionAttempts','signoutStatuses','portalDocumentResponses')}))
