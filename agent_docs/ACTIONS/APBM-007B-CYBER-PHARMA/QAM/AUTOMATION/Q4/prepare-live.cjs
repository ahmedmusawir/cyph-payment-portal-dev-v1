const C=require('./live-common.cjs');C.prepare().then(()=>console.log('Q4 cohorts prepared; existing identities only')).catch(e=>{console.error(C.R.sanitize(e.message));process.exitCode=1});
