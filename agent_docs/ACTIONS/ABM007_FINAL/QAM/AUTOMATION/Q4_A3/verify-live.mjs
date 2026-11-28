import {readFileSync,readlinkSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {assertServedScratch,servedReport} from './auth.mjs';

const q='agent_docs/ACTIONS/ABM007_FINAL/QAM';
const e=q+'/evidence/Q4/A3';
const root='/tmp/abm007-final-cody-q4-a3';
const stamp=process.argv[2]??'entry';
if(!['entry','after-automation','walkthrough','ready','final'].includes(stamp))throw Error('Unknown verification checkpoint');
const apps=[];
for(const [app,port] of [['ob',3100],['pp',3101]]){
  const row=JSON.parse(execFileSync('python3',[q+'/AUTOMATION/Q4_A3/manifest.py','check',app],{encoding:'utf8'}));
  const identity=JSON.parse(readFileSync(e+'/'+app+'-build-identity.json'));
  const gates=JSON.parse(readFileSync(e+'/'+app+'-gating.json')).rows;
  if(!identity.pass||gates.length!==5||gates.some(item=>item.exit!==0)||identity.manifest!==row.manifest||row.mismatches.length)
    throw Error('A2 checked build did not pass for '+app);
  await assertServedScratch(app);
  const p=servedReport()[app];
  const r=await fetch('http://localhost:'+port+'/api/build-info',{signal:AbortSignal.timeout(5000)});
  const body=await r.json();
  const ps=JSON.parse(readFileSync(root+'/'+app+'-process.json'));
  const dir=readlinkSync('/proc/'+p.listener_pid+'/cwd');
  const processEnv=Object.fromEntries(readFileSync('/proc/'+p.listener_pid+'/environ','utf8').split('\0')
    .filter(Boolean).map(s=>[s.slice(0,s.indexOf('=')),s.slice(s.indexOf('=')+1)]));
  if(r.status!==200||body.app!==app||body.revision!==row.manifest||body.artifactId!==identity.label||
     ps.server!==p.listener_pid||dir!==root+'/'+app||processEnv.NEXT_PUBLIC_APBM_DATA_MODE!=='real'||
     processEnv.NODE_ENV!=='production'||String(readFileSync(dir+'/.next/BUILD_ID')).trim()!==identity.compiledBuildId)
    throw Error('A2 runtime binding failed '+app);
  apps.push({...p,app,port,manifest:row.manifest,artifactId:body.artifactId,buildId:identity.compiledBuildId,launcher:ps.logger});
}
writeFileSync(e+'/served-'+stamp+'.json',JSON.stringify({time:new Date().toISOString(),apps},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(apps));
