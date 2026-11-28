import {spawn,execFileSync} from 'node:child_process';
import {appendFileSync,readFileSync,writeFileSync,realpathSync} from 'node:fs';
import {join} from 'node:path';
import {homedir} from 'node:os';
import {createInterface} from 'node:readline';
import {scratchTarget, stripeTarget, loadNamed, scrub, apiRef, SCRATCH_REF} from '../../../../../../scripts/apbm007b/lib/env.mjs';
const q='agent_docs/ACTIONS/ABM007_FINAL/QAM';
const root='/tmp/abm007-final-cody-q4';
const app=process.argv[2];
if (!['ob','pp','mock-ob'].includes(app)) throw Error('Invalid app');
const key=app==='pp'?'pp':'ob', port=key==='ob'?3100:3101;
const cwd=join(root,app);
if(realpathSync(cwd)!==cwd)throw Error('Copy outside Q4 root');
execFileSync('python3',[q+'/AUTOMATION/Q4/manifest.py','check',key,'--copy',app],{stdio:'pipe'});
const locked=JSON.parse(readFileSync(q+'/evidence/Q4/01/'+app+'-build-identity.json'));
if(!locked.pass||locked.compiledBuildId!==readFileSync(join(cwd,'.next/BUILD_ID'),'utf8').trim())throw Error('Unknown build');
if(execFileSync('ss',['-ltnpH','sport = :'+port],{encoding:'utf8'}).trim())throw Error('Port occupied');
const sc=scratchTarget();
if(apiRef(sc.url)!==SCRATCH_REF)throw Error('Wrong backend');
const stripe=app==='pp'?stripeTarget():{};
const extra=app==='pp'?loadNamed(process.cwd(),{required:['STRIPE_PORTAL_CONFIGURATION','STRIPE_WEBHOOK_SECRET']}):{};
const env={PATH:process.env.PATH, HOME:process.env.HOME, NEXT_TELEMETRY_DISABLED:'1', NODE_ENV:'production',
  NEXT_PUBLIC_SUPABASE_URL:sc.url, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:sc.publishableKey, SUPABASE_SECRET_KEY:sc.secretKey,
  NEXT_PUBLIC_APP_ENV:'local-proof', NEXT_PUBLIC_SITE_URL:'http://localhost:'+port, MAIL_ALLOWLIST:'',
  NEXT_PUBLIC_APBM_DATA_MODE:app==='mock-ob'?'mock':'real',
  ...stripe,...extra};
const log=q+'/evidence/Q4/01/'+app+'-server.log';
writeFileSync(log,'Q4 server output. Sanitized in memory.\n',{flag:'a'});
const cast=JSON.parse(readFileSync(join(homedir(),'.apbm007b/engineering_cast.json')));
const needles=[...Object.values(cast).flatMap(x=>x&&typeof x==='object'?Object.values(x):[]),sc.secretKey,sc.dbUrl,
  stripe.STRIPE_SECRET_KEY,extra.STRIPE_WEBHOOK_SECRET].filter(x=>typeof x==='string'&&x.length>=5).sort((x,y)=>y.length-x.length);
function safe(line){
  let out=scrub(line).replace(/\x1b\[[\d;]*m/g,'');
  for(const word of needles){out=out.split(word).join('[private]');out=out.split(encodeURIComponent(word)).join('[private]');}
  return out.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/ig,'[address]')
    .replace(/\?[^\s"']+/g,'?[removed]').replace(/\b(?:cus|sub|cs|bps|pi)_[A-Za-z0-9_]+/g,'[provider-id]')
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/ig,'[id]').slice(0,800);
}
if(!safe('qa@sample.invalid ?token_hash=QA_SECRET cus_control').includes('[address]')||
   safe('qa@sample.invalid ?token_hash=QA_SECRET cus_control').includes('QA_SECRET')||safe('ready')!=='ready')
  throw Error('Log controls failed');
writeFileSync(q+'/evidence/Q4/01/server-log-controls.json',JSON.stringify({privateAddressRemoved:true,queryRemoved:true,cleanUnchanged:true}));
const child=spawn('./node_modules/.bin/next',['start','-p',String(port),'-H','127.0.0.1'],{cwd,env,stdio:['ignore','pipe','pipe']});
for(const [name,stream] of [['stdout',child.stdout],['stderr',child.stderr]]) {
 const lines=createInterface({input:stream});
 lines.on('line',line=>appendFileSync(log,new Date().toISOString()+' '+name+' '+safe(line)+'\n'));
}
writeFileSync(join(root,app+'-process.json'),JSON.stringify({logger:process.pid,server:child.pid,port,cwd,manifest:locked.manifest}));
process.on('SIGTERM',()=>child.kill('SIGTERM'));
process.on('SIGINT',()=>child.kill('SIGINT'));
child.on('exit',code=>process.exit(code??0));
