from pathlib import Path
import json,datetime
q=Path('agent_docs/ACTIONS/ABM007_FINAL/QAM');base=q/'evidence/Q2';ledger=base/'effects-progress.json';d=json.loads(ledger.read_text());d['rows']=[r for r in d['rows'] if not r.get('continuation')]
for pattern in ['15/*/journal.json','20/*/results.json','16/*-o1-amended.json','19/owner-b-audit-boundary.json','21/mock-runtime.json','24/member.json','24/owner_a.json']:
 for p in sorted(base.glob(pattern)):
  x=json.loads(p.read_text());c=x.get('counters',{});d['rows'].append({'source':str(p.relative_to(q)),'password':c.get('password_sign_ins',0),'fixtureToken':c.get('token_sign_ins',0),'generateLink':c.get('generate_link_calls',0),'attemptedPasswordExtra':sum(1 for a in x.get('sessionDiagnostics',[]) if a.get('failed') and a.get('role') in ['ENGINEERING_OWNER_A','ENGINEERING_OWNER_B']), 'continuation':True})
d['savedSessions']=sum(r['password']+r['fixtureToken'] for r in d['rows']);d['fixtureSetupAttempts']=sum(r['generateLink'] for r in d['rows']);d['conservativeSessionCharge']=sum(r['password']+max(r['fixtureToken'],r['generateLink'])+r.get('attemptedPasswordExtra',0) for r in d['rows']);d['sessionCeiling']=150;d['timeNote']='Running checkpoint; successful-helper counters do not count all failed attempts. Conservative charge includes generated tokens without successful redemption. Human counts pending.';d['updatedUtc']=datetime.datetime.now(datetime.timezone.utc).isoformat();d['billingPortalOpen']['conditionalAdditionalAttempt']='Not used: saved evidence does not establish test fault';ledger.write_text(json.dumps(d,indent=2))
p=q/'QAM_EXECUTION_REPORT.md';s=p.read_text().replace('Every result, approval and verdict field below is empty on purpose. ','')
a=s.index('\n',s.index('|---|---|---|---|---|',s.index('## 2.')))+1;z=s.index('\n\n## 3.',a);rows=[]
for line in (q/'AC_EVIDENCE_MATRIX.md').read_text().splitlines():
 if line.startswith('| AC-'):
  c=[v.strip() for v in line.split('|')[1:-1]];rows.append('| '+ ' | '.join([c[5] or c[0],c[0],c[4],c[6] or 'Gate D only; no Q2 evidence','Candidate pair in section1; observations, not verdict'])+' |')
s=s[:a]+'\n'.join(rows)+s[z:]
a=s.index('\n',s.index('|---|---|---|---|',s.index('## 4.')))+1;z=s.index('\n\n## 5.',a)
s=s[:a]+f'''| Sign-in sessions | Planning ceiling150 | {d['savedSessions']} successful helper sessions; conservative charge {d['conservativeSessionCharge']} including generated-token failures; human counts pending | Below ceiling at checkpoint |
| Sign-in emails / invitation | Four sign-in emails; one invitation/email/acceptance | Executor0; human answers pending; invitation held until Tony at inbox | No sends tonight |
| Member removal | One cancel, one confirm | 0 / 0; held after invitation acceptance | Within ceiling |
| Billing opening | One, plus conditional second only on proven test fault | One incomplete; second condition not established | No second request |
| Purchase / subscription / listener | Not released | 0 | Within scope |

Effects detail: evidence/Q2/effects-progress.json. All helpers target-guarded to designated SCRATCH cast; source/runtime/candidate checks preserved. No DEV request or write performed by QA; no listener or provider-event journey. No proof of global external activity is claimed.
'''+s[z:]
s=s.replace('Each failed attempt is preserved. | Helper | What was wrong | Correction | Re-validated how | NOT RECORDED.','Every first failure remains in FINDINGS.md with source and evidence. Raster calibration/proxy controls: evidence/Q2/15; failed captures remain incomplete, not clean passes. No product repair. Some command exit143 and sign-in setup failures leave coverage gaps.')
s=s.replace('| NOT RECORDED | | | | |','| See Amendment01 table A below | Seven selected checks awaiting Tony’s returned sheet | | |')
s=s.replace('## 8. Exploratory observations\n\nNOT RECORDED.','## 8. Exploratory observations\n\nFINDINGS.md is the single register. F12 is Friday’s plan defect disposition; F11 is the audit recon correction; F15 remains incomplete. New rendered disabled-field contrast observation F18 awaits Friday. Measurements are not journeys.')
s=s.replace('## 9. Remaining untested areas\n\nNOT RECORDED.','## 9. Remaining untested areas\n\nSeven human checks PENDING. J-e/J-h and removed-access/zero-store checks HELD until Tony’s inbox availability tomorrow, invitation acceptance before removal. J-c/J-d/J-g BLOCKED by scope. Contrast gaps listed by screen/state in evidence/Q2/23/CONTRAST_NOT_RUN.md. Remaining running probes are not passed. Final package held until walkthrough answers.')
s=s.replace('| none recorded | | | | |','| See FINDINGS.md F01–F19 and continuation observations | First evidence paths retained in each entry | Proposed classifications, Friday dispositions where supplied | Only bounded safe diagnostics; no automatic side-effect retries | Mixed outcomes never erase failures |')
p.write_text(s);print(json.dumps({'successfulSessions':d['savedSessions'],'conservativeCharge':d['conservativeSessionCharge'],'criterionRows':len(rows)}))
