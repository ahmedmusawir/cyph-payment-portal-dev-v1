const C=require('./live-common.cjs');const F=require('./deadline-finish-clock.cjs');F.refund().catch(e=>{console.error(C.R.sanitize(e.message));process.exitCode=1});
