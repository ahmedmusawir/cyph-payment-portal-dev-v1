import json,pathlib,collections,datetime
q=pathlib.Path('agent_docs/ACTIONS/ABM007_FINAL/QAM');base=q/'evidence/Q2';out=base/'23';out.mkdir(exist_ok=True)
counts=collections.Counter();gaps=[];fails=[];contexts=[]
for p in sorted((base/'15').glob('*/*.json')):
 if not p.stem.isdigit():continue
 d=json.loads(p.read_text());meta={k:d.get(k) for k in ['engine','version','app','role','width','requested','landed','state','control']};meta['evidence']=str(p.relative_to(q));contexts.append(meta)
 if not d.get('completed'):
  gaps.append(dict(meta,reason=d.get('error','Capture incomplete')));continue
 for r in d.get('raster',{}).get('rows',[]):
  counts[r.get('result','NOT RUN')]+=1
  detail=dict(meta,textRangeIndex=r.get('index'),tag=r.get('tag'),ratio=r.get('worstRatio'),threshold=r.get('threshold'),reason=r.get('reason'),unsupported=r.get('unsupported'))
  if r.get('result')=='FAIL':fails.append(detail)
  elif r.get('result')!='PASS':gaps.append(detail)
for p in (base/'15').glob('*/journal.json'):
 d=json.loads(p.read_text())
 for r in d['journal']:
  if r.get('result') in ['INCOMPLETE','NOT RUN']:gaps.append(dict(r,evidence=str(p.relative_to(q))))
 for s in d['sessions']:
  if s.get('result')=='INCOMPLETE':gaps.append(dict(s,evidence=str(p.relative_to(q)),reason='Session setup incomplete; remaining planned contexts NOT RUN'))
for p in sorted((base/'25').glob('public-state-pixels.json')):
 for context in json.loads(p.read_text()):
  for state in context['states']:
   meta={k:context.get(k) for k in ['engine','version','app','width']};meta.update(role='PUBLIC',requested='/auth' if context['app']=='ob' else '/login',state=state['state'],evidence=str(p.relative_to(q)));contexts.append(meta)
   for r in state['raster']['rows']:
    counts[r['result']]+=1; detail=dict(meta,textRangeIndex=r.get('index'),tag=r.get('tag'),ratio=r.get('worstRatio'),threshold=r.get('threshold'),reason=r.get('reason'))
    if r['result']=='FAIL':fails.append(detail)
    elif r['result']!='PASS':gaps.append(detail)
for name in ['member','owner_a']:
 p=base/'24'/f'{name}.json'
 if not p.exists():continue
 context=json.loads(p.read_text())
 for state in context['rows']:
  meta=dict(engine=context['browser'],version=context['version'],app='ob',role=context['role'],width=state['width'],requested='/owedbook',state=f"store ordinal {state['storeOrdinal']}; {state['tab']}",evidence=str(p.relative_to(q)));contexts.append(meta)
  for r in state['textContrast']['rows']:
   counts[r['result']]+=1;detail=dict(meta,textRangeIndex=r.get('index'),tag=r.get('tag'),ratio=r.get('worstRatio'),threshold=r.get('threshold'),reason=r.get('reason'))
   if r['result']=='FAIL':fails.append(detail)
   elif r['result']!='PASS':gaps.append(detail)
report={'time':datetime.datetime.now(datetime.timezone.utc).isoformat(),'countsAreNotJourneys':True,'scope':'Snapshot only; running campaigns may add evidence. Raw FAIL pixels require visibility/occlusion and instrument applicability review; not all are product findings. No whole-criterion pass.', 'textRangeMeasurements':dict(counts),'capturedContexts':len(contexts),'rawFailures':fails,'unmeasuredContexts':gaps}
(out/'rendered-reconciliation.json').write_text(json.dumps(report,indent=2))
lines=['# Rendered contrast gaps — Q2 snapshot','', 'Counts are measurements, not passed journeys. Every unmeasured captured context is below. Native-disabled keyboard focus is impossible and is separately listed; its rendering remains measured. Session setup failures leave the rest of that planned role/app/engine coverage NOT RUN.','', '| Screen | Role | Engine / width | State | Reason | Evidence |','|---|---|---|---|---|---|']
for r in gaps:
 reason=r.get('reason') or r.get('error') or str(r.get('unsupported') or 'Insufficient stable rendered glyph pixels')
 lines.append('| '+' | '.join(str(x).replace('|','/').replace('\n',' ') for x in [str(r.get('app',''))+':'+str(r.get('requested','remaining planned routes')),r.get('role',''),str(r.get('engine',''))+'/'+str(r.get('width','all planned')),r.get('state','setup'),reason,r['evidence']])+' |')
(out/'CONTRAST_NOT_RUN.md').write_text('\n'.join(lines)+'\n')
print(json.dumps({'contexts':len(contexts),'textRanges':dict(counts),'gaps':len(gaps),'rawFailures':len(fails)}))
nontext=[]
for p in sorted((base/'20').glob('*/results.json')):
 d=json.loads(p.read_text())
 for r in d['rows']:
  for c in r.get('controls',[]):
   for kind in ['focus','border']:
    m=c.get(kind,{})
    if m and m.get('result')!='PASS':nontext.append({**{k:r.get(k) for k in ['app','requested','role','engine','version','width']},'control':c.get('index'),'tag':c.get('tag'),'type':c.get('type'),'kind':kind,'measurement':m,'evidence':str(p.relative_to(q)),'qualification':'Native disabled focus is unavailable; hidden Plan radio measured by visible label in separate passing diagnostic. Other non-passing samples need geometry/visibility review; no inferred pass.'})
(out/'nontext-unresolved.json').write_text(json.dumps(nontext,indent=2))
obligations=[
 ('Portal /register/pharmacy, /register/owner, /register/review, /register/activation','Registration progression/validation, Checkout and activation states','BLOCKED: J-c/J-d held; redirected GETs do not measure these screens'),
 ('Both apps /auth/confirm','Valid delivered-link confirmation; used/fresh email lifecycle','PENDING HC-06/07; fixture setup and public expired-link view are not delivered-email proof'),
 ('OwedBook /owedbook after Member removal','Removed-access / zero-store rendering','HELD with J-h until tomorrow, after invitation acceptance'),
 ('OwedBook store invite and member management','Invitation sent/accepted and removal cancel/confirm states','HELD J-e/J-h; no business action tonight'),
 ('OwedBook billing and Portal billing/Add Pharmacy','Paid activation and schedule/undo state changes','BLOCKED J-d/J-g held; baseline read-only pages measured separately'),
 ('OwedBook store detail and invite','Dedicated field-border/focus pixel campaign','NOT RUN by nontext-campaign (which covers primary routes only); text default/hover/focus samples in raster campaign do not prove ring contrast'),
 ('Signed-in data pages, both apps','Every loading/error/busy state at every matrix width','NOT RUN as exhaustive pixel matrix; prior explicit error-state behavior probes and captured default states are bounded evidence, not exhaustive contrast'),
 ('Owner B signed-in screens outside audit/human checks','Separate complete visual-state matrix','NOT RUN; no silent substitution of Owner A measurements'),
 ('All captured text ranges listed below','Thin glyphs, clipped/occluded text, unstable dimensions','NOT RUN where instrument has insufficient stable pixels; no gradient exclusion'),
]
with (out/'CONTRAST_NOT_RUN.md').open('a') as f:
 f.write('\n## Planned contexts not established by captured rows\n\n| Screen | State | Status / reason |\n|---|---|---|\n')
 for row in obligations:f.write('| '+' | '.join(row)+' |\n')
 f.write('\nNontext non-passing samples and geometry qualifications: nontext-unresolved.json. Public disabled/busy/explicit-error pixel captures, when completed, are in ../25/public-state-pixels.json. These declared gaps prevent a complete AC-B08 pass.\n')
