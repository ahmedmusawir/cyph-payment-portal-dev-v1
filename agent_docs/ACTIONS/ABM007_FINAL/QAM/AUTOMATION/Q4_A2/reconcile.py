"""Account for all A2 observations without overwriting first results."""
from collections import Counter
from pathlib import Path
import json

q=Path('agent_docs/ACTIONS/ABM007_FINAL/QAM')
e=q/'evidence/Q4/A2'
engines=('chromium','firefox','webkit')
owner='ENGINEERING_OWNER_A'
admin='ENGINEERING_ADMIN'
roles=(owner,admin)
widths=(320,375,768,1024,1440)
selected=(1,7,13)

rows=[]
sessions=[]
for engine in engines:
    for stage,suffix in [('first','-results.json'),('diagnostic','-diagnostic-results.json')]:
        f=e/(engine+suffix)
        if f.exists():
            data=json.loads(f.read_text())
            rows.extend({'engine':engine,'stage':stage,**r} for r in data['rows'])
            sessions.extend({'engine':engine,'stage':stage,**r} for r in data['sessions'])

settled_file=e/'firefox-enter-settled.json'
settled_enter=json.loads(settled_file.read_text()) if settled_file.is_file() else {'rows':[],'sessions':[]}
sessions.extend({'engine':'firefox','stage':'settled-enter',**r} for r in settled_enter['sessions'])

def matching(section,**scope):
    return [row for row in rows if row['section']==section and all(row.get(k)==v for k,v in scope.items())]

def positions(section,options):
    findings=[]
    for scope in options:
        records=matching(section,**scope)
        chosen=records[-1] if records else None
        findings.append({**scope,
             'result':chosen['result'] if chosen else 'NOT RUN',
             'at':chosen['at'] if chosen else None,
             'stage':chosen['stage'] if chosen else None})
    return findings

common=[{'engine':engine,'role':role,'width':width} for engine in engines for role in roles for width in widths]
desktop=[s for s in common if s['width'] in (1024,1440)]
samples=[s for s in common if s['width'] in (375,1440)]
cases={
 'structure':positions('A2-1 structure and dimensions',common),
 'mouse':positions('A2-1 mouse returns to top',[{**s,'article':i} for s in common for i in selected]),
 'articleFocusEnter':positions('A2-1 article focus / Enter',[{**s,'article':i} for s in common for i in range(1,14)]),
 'F36':positions('A2-1 F36 rendered contrast',[{**s,'article':i} for s in samples for i in selected]),
 'menuGeometry':positions('A2-2 menu geometry',desktop),
 'menuFocus':positions('A2-2 menu keyboard outline',[{**s,'article':i} for s in desktop for i in range(1,14)]),
 'addFocus':positions('A2-2 OwedBook Billing Add control',[{'engine':n,'role':owner,'width':375} for n in engines]),
 'profileFocus':positions('A2-2 Profile password field and reveal',[{'engine':n,'role':owner,'width':375} for n in engines]),
 'menuRegression':positions('Help regression menu destinations',[{'engine':n,'role':r} for n in engines for r in roles]),
 'forbiddenAndLabels':positions('Help forbidden terms and changed labels',[{'engine':n,'role':r} for n in engines for r in roles]),
 'appLinks':positions('Help app links by role',[{'engine':n,'role':r,'label':l} for n in engines for r in roles
                     for l in ('open My Stores','open Billing')]),
}
expected_samples=[({'engine':engine,'role':owner,'width':width,'route':route})
                  for engine in ('chromium','firefox') for width in (375,1440)
                  for route in ('/invitations','/admin-portal/stores/[store]/invite')]
expected_samples.append({'engine':'firefox','role':admin,'width':1440,'route':'/admin-portal/stores/[store]/invite'})
remeasure=[]
for scope in expected_samples:
    hist=matching('Instrument once after settled content',**scope)
    valid=[r for r in hist if r.get('pixel',{}).get('rows')]
    assert len(valid)<=1
    r=valid[0] if valid else (hist[-1] if hist else {})
    pixel=r.get('pixel',{})
    remeasure.append({**scope,'result':r.get('result','NOT RUN'),'registeredTextRangeCount':len(pixel.get('rows',[])),
                      'counts':pixel.get('counts'), 'at':r.get('at'),'area':r.get('area'),
                      'unmeasured':[s for s in pixel.get('rows',[]) if s['result']=='NOT RUN']})
    
minimum=[]
surface_counts=Counter()
enter=Counter()
for sample in cases['F36']:
    hist=matching('A2-1 F36 rendered contrast',engine=sample['engine'],role=sample['role'],width=sample['width'],article=sample['article'])
    if hist:
        for measurement in hist[-1].get('pixels',{}).get('rows',[]):
            if measurement.get('worstRatio') is not None:
                minimum.append(measurement['worstRatio'])
            surface_counts.update(measurement.get('paintedBackgroundRgbCounts',{}))
for sample in (s for s in cases['articleFocusEnter'] if s['article'] in selected):
    r=matching('A2-1 article focus / Enter',engine=sample['engine'],role=sample['role'],width=sample['width'],article=sample['article'])
    activation=r[-1].get('activation') if r else None
    if not activation:
        enter['NOT RUN']+=1
    else:
        ok=activation['from']>0 and activation['y']==0 and activation['headerInView'] and activation['helpTitleInView']
        enter['PASS' if ok else 'FAIL']+=1

portal_nav=[r for s in sessions for r in s['network']['documentResponses']
            if r['origin']=='http://localhost:3101' and r['path'] in ('/dashboard','/billing')]
pill=matching('Account & Billing round element')
avatar=pill[0]['detected'] if len(pill)==1 else []
pill_row={'result':'IDENTIFIED' if len(portal_nav)==1 and portal_nav[0]['status']==200 and len(avatar)==1 else 'INCOMPLETE',
          'element':pill[0]['element'] if pill else None, 'visibleEvidence':avatar,
          'documentResponses':portal_nav,'initialRouteCounter':pill[0]['dashboardDocuments'] if pill else None,
          'reconciliation':'One redirected Dashboard document in the Playwright response log. Redirect follow-ups are not separately routed in the initial request hook.'}
attempts=[json.loads(line) for line in (e/'session-ledger.jsonl').read_text().splitlines()]
assert len(attempts)<=20 and all(r['role']!= 'ENGINEERING_OWNER_B' for r in attempts)
assert len(portal_nav)<=1
retained=Counter(r['result'] for r in rows if r['stage']=='first')
totals={key:dict(Counter(row['result'] for row in result)) for key,result in cases.items()}
result={'totals':totals,'positions':cases,'F36LowestMeasured':min(minimum) if minimum else None,'F36SurfaceCounts':surface_counts,
        'keyboardEnterReturns':enter,'firefoxSettledEnter':settled_enter['rows'],'settledRemeasures':remeasure,'portalAvatar':pill_row,
        'firstAttemptRowsPreserved':retained,'sessionAttempts':len(attempts),'signouts':Counter(str(s['signout']) for s in sessions),
        'activeMember':'Unavailable. Friday accepted this limit in Q4 section 5. No substitute fixture used.'}
with (e/'summary.json').open('x') as stream:
    json.dump(result,stream,indent=2)
print(json.dumps({k:v for k,v in result.items() if k not in ('positions','settledRemeasures')},indent=2))
