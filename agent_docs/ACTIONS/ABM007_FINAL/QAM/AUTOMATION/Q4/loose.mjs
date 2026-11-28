import {readFileSync,mkdirSync} from 'node:fs';
import {identity,sameIdentity} from './identity.mjs';
import {finish,nav,open,out,pw,safeError,safeScreenshot,signIn,sites,write} from './runner.mjs';
const phase=out+'/05';
mkdirSync(phase,{recursive:true});
const logFile=out+'/01/ob-server.log';
const owner='ENGINEERING_OWNER_A', admin='ENGINEERING_ADMIN';
const price=await pw.chromium.launch();
const priceSession=await open(price);
try{
 const seen=await nav(priceSession.page,'pp','/register/plan','body');
 const body=await priceSession.page.locator('body').innerText();
 const vals=[...body.matchAll(/\$\s?\d+(?:\.\d{2})?/g)].map(m=>m[0]);
 const pass=seen.path==='/register/plan'&&vals.some(x=>/^\$\s?99(?:\.00)?$/.test(x))&&vals.some(x=>/^\$\s?49(?:\.00)?$/.test(x));
 write(phase+'/AC-R05-public-plan.json',{engine:'chromium',version:price.version(),seen,values:vals,
   context:body.split('\n').filter(l=>/\$|first pharmacy|additional pharmacy/i.test(l)).slice(0,25),
   result:pass?'PASS':'FAIL',review:'Gate D, held in Q4'},'wx');
}finally{await finish(priceSession);await price.close();}

const oldSignIn=u=>u.origin===sites.pp&&/^\/(login|auth\/sign-in-to-continue)(\/|$)/.test(u.pathname);
const o1=[];
const f22=[];
const o1Sessions=[];
const o1save=()=>{
 write(phase+'/O1-seven-firefox.json',{browser:'firefox',rows:o1,sessions:o1Sessions});
 write(phase+'/F22-sequential-captures.json',{onlyQAWorkUsingBuilds:'This exclusive final diagnostic phase. No Director walkthrough yet.',rows:f22});
};
const b=await pw.firefox.launch();
async function go(p,app,path,ready,r) {
 const response=await p.goto(sites[app]+path,{waitUntil:'networkidle',timeout:15000});
 if(oldSignIn(new URL(p.url()))){const e=new Error();e.portalSignIn=true;throw e;}
 if(new URL(p.url()).pathname!==path){const e=new Error();e.qa='Route landed elsewhere';throw e;}
 if(ready)await p.locator(ready).first().waitFor({state:'visible'});
 r.steps.push({app,path,status:response?.status(),requiredContent:true});
 if(app==='pp'&&oldSignIn(new URL(p.url()))){const e=new Error();e.portalSignIn=true;throw e;}
}
const o1controls={detectPortalSignIn:oldSignIn(new URL(sites.pp+'/login')),acceptBilling:!oldSignIn(new URL(sites.pp+'/billing')),ignoreOwedBookAuth:!oldSignIn(new URL(sites.ob+'/auth'))};
if(!Object.values(o1controls).every(Boolean))throw Error('O1 instrument controls failed');
write(phase+'/O1-controls.json',o1controls,'wx');
for(const plan of [{kind:'fresh',runs:[2]},{kind:'fresh',runs:[3]},{kind:'warm',runs:[1,2,3,4,5]}]){
 const x=await open(b);
 const p=x.page;
 let id, setupError;
 try{
  await signIn(x,'pp',admin);
  id=await identity(x.c,'pp');
  if(!id)throw Error('Session identity unavailable');
  await p.getByTestId('open-owedbook').first().click();
  await p.waitForURL(u=>u.origin===sites.ob&&u.pathname==='/owedbook');
  if(!sameIdentity(id,await identity(x.c,'ob')))throw Error('Handoff identity mismatch');
 }catch(e){setupError=safeError(e);}
 for(const n of plan.runs){
  const r={kind:plan.kind,run:n,engine:'firefox',version:b.version(),time:new Date().toISOString(),steps:[]};
  if(setupError){o1.push({...r,result:'NOT RUN',reason:'This planned new context did not establish a session',...setupError});o1save();continue;}
  try{
   for(const [app,path,ready] of [['ob','/owedbook','select[aria-label="Store"]'],['ob','/admin-portal','h1'],
    ['ob','/admin-portal/billing','[data-testid="billing-owner-only"]'],['pp','/dashboard','[data-testid="denied-view"]'],
    ['pp','/billing','[data-testid="denied-view"]'],['ob','/owedbook','select[aria-label="Store"]']]){
    const capture=plan.kind==='fresh'&&n===2&&app==='ob'&&path==='/owedbook'&&r.steps.length===5;
    if(!capture){await go(p,app,path,ready,r);continue;}
    const offset=readFileSync(logFile,'utf8').length, consoleStart=x.log.console.length, responseStart=x.log.documentResponses.length;
    const f={engine:'firefox',version:b.version(),context:'Q2-A1 fresh 2 after Portal billing',target:path,timeoutMs:15000};
    try{await go(p,app,path,ready,r);f.result='COMPLETE';}
    catch(e){f.result=e.portalSignIn?'FAIL':'INCOMPLETE';Object.assign(f,safeError(e));throw e;}
    finally{
     Object.assign(f,{serverLogLines:readFileSync(logFile,'utf8').slice(offset).split('\n').filter(Boolean),
       console:x.log.console.slice(consoleStart),documentResponses:x.log.documentResponses.slice(responseStart)});
     f.screenshot=await safeScreenshot(x,phase+'/F22-firefox-return.png').catch(()=>null);
     f22.push(f);o1save();
    }
   }
   for(const [path,ready] of [['/admin-portal/settings','h1'],['/admin-portal/audit','h1'],['/profile','h1'],['/help','h1']])await go(p,'ob',path,ready,r);
   await go(p,'pp','/dashboard','[data-testid="denied-view"]',r);
   await p.getByTestId('open-owedbook').first().click();
   await p.waitForURL(u=>u.origin===sites.ob&&u.pathname==='/owedbook');
   await p.locator('select[aria-label="Store"]').waitFor();
   const equal=sameIdentity(id,await identity(x.c,'ob'))&&sameIdentity(id,await identity(x.c,'pp'));
   if(!equal){const e=new Error();e.qa='Final identity differs';throw e;}
   r.identitySame=equal;r.result='COMPLETE';
  }catch(e){r.result=e.portalSignIn||oldSignIn(new URL(p.url()))?'FAIL':'INCOMPLETE';Object.assign(r,safeError(e));}
  o1.push(r);o1save();
 }
 o1Sessions.push(await finish(x));o1save();
}
await b.close();

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
console.log(JSON.stringify({O1:o1.map(x=>({kind:x.kind,run:x.run,result:x.result})),F22:f22.map(x=>x.result)}));
