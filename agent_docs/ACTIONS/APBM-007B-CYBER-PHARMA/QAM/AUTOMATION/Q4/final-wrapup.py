from pathlib import Path
import json,datetime,subprocess,hashlib
q=Path(__file__).resolve().parents[2];e=q/'evidence/Q4/01';repo=q.parents[3]
def load(n):return json.loads((e/n).read_text())
def append(n,s):p=q/n;p.write_text(p.read_text()+'\n'+s+'\n')
assert load('phase_exit_final.json')['all_owned_stopped']
assert load('fixture_inventory_final.json')['protected_F_Q2_001']['no_refund_or_cleanup']
assert len(load('direct_jwt_boundaries_final.json'))==48
assert all(x['result']=='PASS' for x in load('direct_jwt_boundaries_final.json'))
subprocess.run(['python3',str(q/'AUTOMATION/Q4/final-report.py')],check=True)
m=load('acceptance_mapping_final.json');used=load('effects/counters.json')['used'];carry=load('effects/carry_in.json')['counters']['used'];records=[json.loads(l) for l in (e/'effects/ledger.jsonl').read_text().splitlines() if l.strip()];expected=dict(carry);seqs=[]
for r in records:
 if 'charges' not in r:continue
 seqs.append(r['seq'])
 for k,v in r['charges'].items():expected[k]=expected.get(k,0)+v
assert expected==used,'Ledger reconciliation mismatch'
assert len(set(seqs))==len(seqs) and seqs==sorted(seqs)
caps={'provider_mutations':440,'sign_ins':176,'test_clocks':7,'refunds':2,'customers':16,'subscriptions':16,'email_attempts':40,'new_identities':14,'unique_identities':10,'scratch_cycles':3,'pay_or_hosted':80,'attempted_cents':1000000,'reads':5000}
assert all(v<=caps[k] for k,v in used.items());assert used['provider_mutations']<=420 and used['email_attempts']<=32
budget={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'cumulative_used':used,'caps':caps,'q4_reserved_delta':{k:used[k]-carry.get(k,0) for k in used},'ledger_reconciles_exactly':True,'reservation_sequences_unique_and_monotonic':True,'cleanup_reserved':{'provider_mutations':20,'email_attempts':8},'standing_authority_once':load('effects/standing_authority_limit_use.json'),'qualifications':['Reservations include failed, refused, uncertain and conservative contingency attempts; no reclaim/reset.','Auth recovery conservatively consumes four provider-mutation slots and two potential password-notice attempts.','Read counter records explicit reserved/direct requests, not a complete trace of internal application network traffic.','Provider cap raised once400→440(10percent), not a new Engineering envelope.'],'window_end':'2026-11-20T23:59:00+06:00'}
(e/'effects/final_reconciliation.json').write_text(json.dumps(budget,indent=2)+'\n')
ret=[]
for fid,obs,refs in [
 ('F-Q2-001','Late provider paid time now attention/no grant in both clock modes, actual late crash included; on-time paid processed after deadline activates once. Original defective activated fixture remains unrefunded.',['live_campaign.json','deadline_independent_final_audit.json']),
 ('F-Q2-004','Verified unpaid expiry by minute job in both modes, real30-minute wait and no owner action; interrupted old unpaid operation also voided on resume.',['live_campaign.json']),
 ('F-Q2-002','Prescribed five unchanged WebKit staff runsPASS,2checks each, plus3engine staff6/6. New WebKit authentication/render failures remain separate F-Q4-002/003; relation not inferred.',['browser/ob_results.json','browser_extra_results.json']),
 ('F-Q2-005','Obsolete capability sentence absent in phone/desktop light/dark; dashboard diff changes only that sentence.',['screens_gallery_q4.json','entry/portal_repair_only.diff']),
 ('F-Q2-006','Six exact commands dry_run/planned and required procedure fields/approver/possession verified; no destructive operator apply implied by dry-run.',['support_runbook_dry_runs.json'])]:
 ret.append({'finding':fid,'executor_retest_observation':obs,'evidence':['evidence/Q4/01/'+x for x in refs],'QA_Lead_disposition':'Pending; original Q2 ruling unchanged'})
(e/'finding_retests_final.json').write_text(json.dumps(ret,indent=2)+'\n')
family=m['deadline_family'];passes=sum(x['result']=='PASS' for x in family)
append('QAM_EXECUTION_REPORT.md',f'''## Q4 COMPLETE —18November2026, Cody Executor

This dated completion record supersedes the Q4 partial/stop status above. Released repaired products remain Portal `00a9e0e98aadb2bdba830ebe6d8c06fb6902e37d` and OwedBook `1fd5a61073e8adaa7997e1ad3c4b1f02d0e7f54d`. No repair, rebind, contract edit or Git mutation. Q4 bound plan SHA-256 `49e0ca36b3ba39a47346162fb736880d07950bc9e36478391f3a6c50d18f8305`. All released scope attempted; failures retained and proposed, no certificate or new QA Lead disposition.

Selected live deadline family: {passes}/14 PASS across seven simulated-provider-clock and seven actual-real-time/no-test-clock cases. Real waits used the unchanged stored30-minute deadlines; no timestamp shortening. Final server consent interval1800000ms, race launched1802121ms after creation; payment won the concurrent minute-job race before any provider-void intent. Timing/raw-measurement and simulated-clock qualifications are explicit in deadline_timing_qualifications.json. Fresh final payment/void race details and independent provider-paid comparisons: acceptance_mapping_final.json and deadline_independent_final_audit.json. The old interrupted unpaid case was expired/voided with paid0; its generic helper emitted FAIL against the never-attempted paid-race expectation. That is an interruption/attempt qualification, not a product deadline failure; raw attempt retained and fresh full-wait replacement separately labelled. On-time paid processed after expiry activates once; late payment enters attention/no store or quantity grant; missing owner-reconfirmation reference refused, proper reference resumes. Naturally late paid/unactivated full second refund closes with exact proof/idempotent repeat; no refund of protectedF001.

Real provider outage-event resend and duplicate each exited0, forwarded HTTP200 through the sole owned sandbox listener→3101, durable receipts and one invoice/paid payment/store/member, unchanged provider quantity. No controlled signer used for positive Q4cases. Original on-time prompt automatic activation observed before owner poll; other polls/resume are explicit, not attributed to automatic causality. CLI forwarding/resend is local transport proof and not permanent native HTTPS endpoint retry certification.

Fresh activation regressions: independently computed ordinary and active-APA midpoint2450c/4900basis with preserved actual discount; original empty-discount attempt insufficient and active promotion fixture grant disclosed.50c paid/49c refusal with no invoice/balance, add/removal/undo;90-minute sides all refuse under stricter50c minimum, not independent isolated90-minute rule proof. Actual next removal invoice68700c, no prorations; reactivation authorizes only, paid re-add restores original business/history through actual owner JWT. Actual in-flight S1hard-kill8/8 and hosted3DS S2whilePortaldownPASS; real redelivery adds no duplicate.

Browser protocol totals: original40 scheduled assertions35PASS/3FAIL/2serialNOTRUN; both serial-skipped tests then executed individually unchanged andPASS, so37PASS/3FAIL with every originally scheduled assertion attempted. Original failures/skips retained; no timeout edits or hidden retries. Original repaired staff protocol five WebKit runs10/10 and3engine6/6 PASS; Portal baseline regression9/9 PASS. New F-Q4-001 reproducible loading/typing/form-state loss, F-Q4-002 WebKit AddStore rendered-status timeout despite backend paid/activated and F-Q4-003 WebKit auth/navigation/disabled sign-in remain for Friday. Outer30s vs inner60s budget mismatch/root uncertainty disclosed.26gallery states/four sanitized dashboard images without keyboard focus; only obsolete dashboard sentence changed. Six exact new support commands all dry_run/planned with required fields. Applied operator SQL older pendingDecision9 wording remains an observation.

Local layers:817unit, type/lint/builds,158/158 fresh and158/158 upgrade SQL, validated client bundle controls PASS. Local SQL real/simulated fixture names use local controlled data and are not live wall-clock proof. SCRATCHforward0070ledger70 retained legacy digests unchanged, includingF001; DEVread-only69 exactprefix/catalogue, no writes/clocks/sign-ins. Current-role API131+40PASS; final48 actual-JWT checksPASS after credential recovery. Existing-role ownership/membership derived at observation, no oldDEVcast reuse. Exact source-bound Q2carry only unchanged subpaths; no Q2carry for Q4deadline/activation/money/screens/runbook. Human inbox observations remain originalQ2/Tony, separate from automated checks. No new Q4manual observation or automated inbox access invented.

Director resolved STOP-PRIVACY: ROLE_OWNER_A_PASSWORD and ROLE_OWNER_B_PASSWORD rotated privately, fresh password accepted/retired refused; both QA session/refresh authorities revoked, Auth IDs unchanged. Existing direct JWT cryptographic validity may persist until expiry; no instant-JWT revocation claim. Two password-bearing diagnostics deleted; new artifacts guarded by umask0077 and snapshot suppression verified with synthetic controls. No additional affected credential fields. Current passwords exist only ignored0600file; no values/hashes exported. QA instrument findingF-Q4-004 retains prior-access-unknown disclosure and Director instruction, not a product AC031 finding.

Final cumulative reserved counters: `{json.dumps(used,separators=(',',':'))}`. Complete exact ledger reconciliation and caps in effects/final_reconciliation.json; no counter reset/reclaim. Standing authority used once for provider400→440(10percent), last20cleanup retained; all other caps unchanged. No resource/fixture cleanup at exit. Every SCRATCH/sandbox/Auth fixture retained, includingF001unrefunded. Owned apps/listener/local containers stopped and verified, Director ports untouched. Tony may restart his listener now.

Detailed31AC mapping: AC_EVIDENCE_MATRIX.md latest overlay / acceptance_mapping_final.json. Q4COMPLETE means execution/reporting complete, not certification. Friday next adjudicates old repair retests, new findings, mixed UI outcomes and limitations, then rules verdict/retention. GateD native permanent HTTPS retry/outage, deployed scheduler/Auth/security/revision binding/rollback readiness NOTRUN; seller-history screen absent underQL09; shared operator credential not individual attribution; U1–U3 remain Director-accepted, not QA-certified. Contract-manifest record correction remains closeout duty.
''')
append('FINDINGS.md','''### Q4 completion supplements — Cody Executor,18November2026 (§1 factual continuation)

F-Q4-002: both originally serial-skipped WebKit removal/undo and375viewport tests passed individually with unchanged specs/timeouts (browser_final_serial_skips.json). Original AddStore/O1 failures remain; no failure erased or performance root inferred. F-Q4-003 remains unadjudicated despite original repaired staff protocol5/5PASS. No separate failure is inferred from the old interrupted unpaid race helper's generic FAIL: it never received a payment, safely expired after the privacy stop, and has a separately executed fresh full-wait replacement.

F-Q4-004: Director-authorized recovery completed, privacy_recovery.json: two named password rotations, session/refresh revocations, unchangedAuthIDs; two diagnostics deleted, no additional affected credential fields; current values only ignored0600input. Prior unauthorized access remains unknown. New artifacts have restrictive creation controls/synthetic self-test. No new credential values/hashes exported and no instantJWTrevocation claim. This factual supplement leaves Friday's original dispositions and the supplied Director instrument-issue instruction unchanged.

O-Q4-001 (observation, unranked): applied operator SQL still returns “paid re-add pending Director decision9; no access or quantity granted.” New runbook describes approved9 correctly. Evidence operator_legacy_wording_observation.json and paid re-add in live_campaign.json. Recorded under explicit Q4scopeF7; no unilateral product/contract repair.

Repair retest observations with paths: evidence/Q4/01/finding_retests_final.json. All findings, proposed classes/severity, original attempts and uncertainty are retained for Friday; no Engineer routing or new verdict composed by Cody.
''')
# The factual supplement belongs to Executor §1; reposition it before QA Lead §2.
p=q/'FINDINGS.md';s=p.read_text();start=s.index('### Q4 completion supplements');supp=s[start:];s=s[:start];pos=s.index('## 2. Dispositions');p.write_text(s[:pos]+supp+'\n'+s[pos:])
append('QAM_CLEANUP_REPORT.md','''## Cody Q4 phase-exit execution —18November2026

Evidence evidence/Q4/01/phase_exit_final.json verifies only owned3100/3101apps/listener and named localQ4containers stopped, Director3000/3001/3457 untouched. Remote/Auth/business/provider fixtures retained; protectedF001amount_refunded0 in fixture_inventory_final.json. Director authorized exception only for two QA password/session recoveries and diagnostic deletion; no other retention disposal. Containers/builds/private states remain retained0700/0600. This is execution hygiene, not formal cleanup acceptance or a retention/verdict decision; owning-seat cells remain unchanged.
''')
append('QAM_STATE.md','''## Cody,18November2026 — Q4 execution complete

**Current state: Q4 COMPLETE — AWAITING ADJUDICATION.** Same repaired pair Portal00a9e0e98aadb2bdba830ebe6d8c06fb6902e37d/OwedBook1fd5a61073e8adaa7997e1ad3c4b1f02d0e7f54d. All released scope attempted and31ACmapped, findings retained; no repair/rebind/Gitmutation/certificate. STOP-PRIVACY resolved under supplied Director authority; two QA passwords/session authorities recovered, IDs unchanged, no additional affected fields. Counters preserved, provider cap400→440 used once under standing authority, cleanup20 untouched. Owned apps/listener/local containers stopped andverified; Director ports unchanged, may restart listener. Every remote fixture retained includingF001unrefunded. NextFriday: Q4finding/repair adjudication, verdict and retention instructions; no further execution before owner ruling.
''')
start=f'''# Q4 COMPLETE — REVIEW START HERE

Cody,18November2026. This package is independent Q4execution/evidence, awaiting Friday adjudication; it is not certification. Products: Portal00a9e0e98aadb2bdba830ebe6d8c06fb6902e37d, OwedBook1fd5a61073e8adaa7997e1ad3c4b1f02d0e7f54d, qa/apbm-007b. Bound scope planSHA49e0ca36b3ba39a47346162fb736880d07950bc9e36478391f3a6c50d18f8305. No repairs/rebind duringQ4.

Read QAM_EXECUTION_REPORT.md latest Q4COMPLETE section, AC_EVIDENCE_MATRIX.md latest31-row overlay, FINDINGS.md Executor proposals and unchanged Friday dispositions, then evidence/Q4/01/acceptance_mapping_final.json and finding_retests_final.json. FILE_INDEX identifies every member except itself with source/bytes/hash; source references bind governing documents and excluded complete historical Portal diff.

Evidence: selected deadlinefamily{passes}/14PASS with actual real waits and independent provider timestamps; real CLI outage-redelivery/duplicate200 and no duplicated grant; S1/S2/3DS/refund/re-add/money;817unit/158SQLfresh+158upgrade; new builds/type/lint/bundles; migration retained digests;171API+48finalJWT boundaries; browser original35PASS/3FAIL/2skipped plus both skipped independentlyPASS; new forms/WebKit findings retained. Procedure six exactdryruns and4sanitizeddashboardimages/26gallery states. No raw private contexts, credentials or oldZIPs.

## Consolidated decisions for Friday

| Item | Decision requested / recommendation |
|---|---|
| F-Q2-001/004 deadline repairs | Adjudicate fresh14case state/time results and independent audit; keep old protected defective store unrefunded. Do not infer a new certificate from this retest. |
| F-Q2-002 intermittent staff repair | Prescribed five unchanged WebKit runsPASS; grade against that reproduction, separately review new auth/navigation issues. |
| F-Q2-005 wording / F-Q2-006 procedure | Grade new gallery/diff and six exact support dryruns as fresh repaired-path evidence. |
| F-Q4-001 | Recommend acceptance-failure Medium for reproducible loading/typing/form submit-state loss, no product repair performed. |
| F-Q4-002/003 | Recommend retain Medium provisional/PENDING root classification for WebKit render/auth failures. Distinguish backend activation success, outer30s/inner60s mismatch and navigation failure; both old serial skips now independentlyPASS. |
| F-Q4-004 | Director called QA instrument issue, recovery completed; note prior access unknown and old directJWTexpiry qualification. No further affected credential names. |
| O-Q4-001 / limits | Older appliedSQLDecision9wording observation;90minute live boundaries qualified by stricter50c minimum; activeAPA promotion is disclosedfixture grant. Recommend explicit limitations, no inferred waiver. |
| Verdict / retention / GateD | Friday issues verdict and retention instructions; keep all fixtures untilthen. GateDNOTRUN; U1–U3 Directoraccepted, not QA-certified; seller-history API lane perQL09. |

## Effects and privacy

Counters preserve Q2carry-in, exact ledger reconciliation in effects/final_reconciliation.json. Once-per-limit standing authority used only provider400→440(10percent); last20cleanup retained, all other caps unchanged. Two QA-only password rotations/session revocations authorized and completed, IDs unchanged; current values only private0600input, never exported. Prior diagnostic accessunknown. Both old password-bearing contexts deleted, future snapshot/umask controls self-tested. Pattern and actual-current/retired-secret gates run on staging and expanded ZIP; validation receipt external.

## Exit / not included

Owned3100/3101apps/listener and localcontainers actually stopped; Director3000/3001/3457untouched. All SCRATCH/sandbox/Auth fixtures retained, F001unrefunded. Tony may restart his listener. Excluded env/authstate/privateemails/credentials/rawlogs/error-contexts/unreviewedimages/builds/dependencies/Git/oldarchives. Carry only hash-bound unchanged Q2path portions with originalpair, not Q4scopeF1–F4 or new human observations. Full Portal original→repaired diff contains old binary QAarchive, excluded body but exacthash reference and full repair-only diff supplied; full OBdiff included. Governingcontract copies or exact source/hash references indexed. No deployment/certification/DEVwrites.
'''
(q/'HANDOFFS/REVIEW_START_HERE.md').write_text(start)
for name in ['QA_Q4_RESUME.md','QA_Q4_PRIVACY_RESUME.md']:
 p=q/'HANDOFFS'/name;p.write_text('CURRENT: Q4 COMPLETE — AWAITING ADJUDICATION,18November2026. Historical resume instructions below are superseded by Director privacy release, completed run and final Q4review receipt. Do not restart execution.\n\n'+p.read_text())
print(json.dumps({'status':'Q4 COMPLETE — AWAITING ADJUDICATION','deadline_pass':passes,'ledger_reconciles':True,'used':used}))
