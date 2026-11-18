process.umask(0o077);
const C=require(process.cwd()+'/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/QAM/AUTOMATION/Q4/live-common.cjs');
const {jobs}=require(process.cwd()+'/agent_docs/ACTIONS/APBM-007B-CYBER-PHARMA/QAM/AUTOMATION/Q4/deadline-finish-clock.cjs');
(async()=>{await jobs('expire retained interrupted unpaid real-race invoice before fresh consent');await C.settle('real_paid_void_race');await C.confirm('real_paid_void_race_final','MEMBER');C.log('final-real-race-new-consent-wait',{deadline:C.st.cases.real_paid_void_race_final.deadline,real_wait:true,original_interrupted_case_retained:true});})().catch(e=>{console.error(C.R.sanitize(e.message));process.exitCode=1});
