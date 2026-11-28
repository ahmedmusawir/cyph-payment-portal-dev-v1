import {readFileSync} from 'node:fs';
import {finish,open,out,pw,safeError,safeScreenshot,signIn,sites,write} from './runner.mjs';
const phase=out+'/05';
const logFile=out+'/01/ob-server.log';
const owner='ENGINEERING_OWNER_A';
const file=phase+'/F22-sequential-captures.json';
const retained=JSON.parse(readFileSync(phase+'/F22-first-interruption.json'));
const f22=retained.rows;
if(f22.length!==1||f22[0].context!=='Q2-A1 fresh 2 after Portal billing')throw Error('Unexpected F22 checkpoint');
const o1save=()=>write(file,{...retained,resume:'Two untouched Chromium snapshots only. Firefox was retained and not replayed.',rows:f22});
const chrome=await pw.chromium.launch();
const ob=await open(chrome);
try{
 await ob.page.setViewportSize({width:375,height:900});
 await signIn(ob,'ob',owner);
 for(const [i,path,required] of [[1,'/owedbook','select[aria-label="Store"]'],[2,'/admin-portal/audit','h1']]){
  const offset=readFileSync(logFile,'utf8').length, consoleStart=ob.log.console.length, responseStart=ob.log.documentResponses.length;
  const f={engine:'chromium',version:chrome.version(),context:'Owner A 375px',path,timeoutMs:20000};
  try{
   const response=await ob.page.goto(sites.ob+path,{waitUntil:'networkidle',timeout:20000});
   await ob.page.locator(required).first().waitFor({state:'visible'});
   f.status=response?.status();f.result=new URL(ob.page.url()).pathname===path&&f.status===200?'COMPLETE':'INCOMPLETE';
  }catch(e){Object.assign(f,safeError(e));f.result='INCOMPLETE';}
  f.serverLogLines=readFileSync(logFile,'utf8').slice(offset).split('\n').filter(Boolean);
  f.console=ob.log.console.slice(consoleStart);f.documentResponses=ob.log.documentResponses.slice(responseStart);
  f.screenshot=await safeScreenshot(ob,phase+'/F22-ob-'+i+'.png').catch(()=>null);
  f22.push(f);o1save();
 }
}catch(e){f22.push({role:owner,context:'Owner A diagnostic setup',result:'NOT RUN',...safeError(e)});}
finally{
 const session=await finish(ob);await chrome.close();
 o1save();
 write(phase+'/F22-owner-session.json',session,'wx');
}
