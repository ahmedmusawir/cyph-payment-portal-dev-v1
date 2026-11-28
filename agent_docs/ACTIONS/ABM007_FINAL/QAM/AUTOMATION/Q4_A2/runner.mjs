import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,appendFileSync,mkdirSync} from 'node:fs';
import * as auth from './auth.mjs';
import {target,contained,role} from './guards.mjs';
import {scratchTarget} from '../../../../../../scripts/apbm007b/lib/env.mjs';
import {rasterContrast} from './raster-contrast.mjs';
import {measure} from './measure.mjs';

export const sites=auth.SITES;
export const out='agent_docs/ACTIONS/ABM007_FINAL/QAM/evidence/Q4/A2';
export const pw=createRequire('/tmp/abm007-final-cody-q4-a2/ob/package.json')('playwright');
export const engines=['chromium','firefox','webkit'];
export const fixtures=['ENGINEERING_OWNER_A','ENGINEERING_ADMIN','ENGINEERING_INVITEE','ENGINEERING_MEMBER'];
const safeHost=new Set([new URL(scratchTarget().url).origin,sites.ob,sites.pp]);
const authWrites=new Set(['/api/auth/confirm','/api/auth/login','/auth/v1/token','/api/auth/logout']);
const sideEffectRoute = path=>/^\/(api\/)?(?:billing\/portal|invitations\/[^/]+\/(?:accept|decline))\/?$/.test(path);
const forbiddenPost = (origin,path)=>{
  if(!safeHost.has(origin)||sideEffectRoute(path))return true;
  return !(authWrites.has(path) || /^\/rest\/v1\/rpc\/(?:tenant_stores|admin_stores|admin_members|admin_billing_status|admin_audit|store_access_state|store_profile|owedbook_kpis|owedbook_rows|owedbook_summary|owedbook_pbm_options|owner_billing_overview)$/.test(path));
};
const expectedAuthSafety = ()=>{
 for(const [o,p,allowed] of [
 [sites.pp,'/api/billing/portal',false],[sites.ob,'/api/stores/1/members/2/remove',false],
 [sites.ob,'/api/auth/link/request',false],[sites.pp,'/api/auth/login',true],
 [new URL(scratchTarget().url).origin,'/auth/v1/token',true],['https://example.invalid','/api/auth/login',false]])
  if(forbiddenPost(o,p)===allowed)throw Error('Network control failed');
 for(const [fixture,allowed] of [['ENGINEERING_OWNER_B',false],['ENGINEERING_OWNER_A',true],['UNLISTED',false]]){
  let got=true;try{role(fixture)}catch{got=false} if(got!==allowed)throw Error('Role control mismatch');
 }
 target(scratchTarget().ref,scratchTarget().ref);
 for(const pair of [['unknown','unknown'],['yrsuwikjnbmvpznrgydb','yrsuwikjnbmvpznrgydb']]){
  let rejected=false;try{target(...pair)}catch{rejected=true}if(!rejected)throw Error('Target guard failed');
 }
 contained('/tmp/abm007-final-cody-q4-a2/ob');
 let rejected=false;try{contained(process.cwd())}catch{rejected=true}if(!rejected)throw Error('Path guard failed');
};
expectedAuthSafety();

const privateValues = await auth.privateStrings();
export function sanitized(value) {
 let s=JSON.stringify(value);
 for(const v of privateValues)s=s.split(v).join('[private]');
 s=s.replace(/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g,v=>v==='support@pharmacybooks.com'?v:'[email]')
   .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/ig,'[id]')
   .replace(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g,'[jwt]')
   .replace(/(?:sk|rk)_(?:test|live)_[A-Za-z0-9_]{16,}|whsec_[A-Za-z0-9_]{16,}/g,'[secret]')
   .replace(/\b(?:cus|sub|cs|bps|pi)_[A-Za-z0-9_]+/g,'[provider-id]')
   .replace(/(\?|&)(?:token_hash|access_token|code|refresh_token)=[^\s"\\]+/ig,'[query-redacted]');
 return JSON.parse(s);
}
export const safeError=e=>({name:e?.name??'Error',safeMessage: typeof e?.qa==='string'?e.qa:undefined});
export function expect(condition,description){
 if(!condition){const e=new Error('Assertion failed');e.qa=description;throw e;}
}
export function write(file,record,mode='w'){
 mkdirSync(file.slice(0,file.lastIndexOf('/')),{recursive:true});
 writeFileSync(file,JSON.stringify(sanitized(record),null,2)+'\n',{flag:mode});
}
export async function open(browser, options={}) {
 const {onePortalRead=false,...contextOptions}=options;
 let portalReads=0;
 const c=await browser.newContext({viewport:{width:1440,height:900},serviceWorkers:'block',reducedMotion:'reduce',...contextOptions});
 const page=await c.newPage(); page.setDefaultTimeout(7000); page.setDefaultNavigationTimeout(15000);
 const log={loads:[],blocked:[],console:[],documentResponses:[]};
 await c.route('**/*',route=>{
   const req=route.request();
   const u=new URL(req.url());
   const path=u.pathname;
   const local=safeHost.has(u.origin);
   const method=req.method();
   if(!local || sideEffectRoute(path) || (!['GET','HEAD','OPTIONS'].includes(method)&&forbiddenPost(u.origin,path))) {
     log.blocked.push({origin:local?u.origin:'other',path:local?path:'[external]',method});
     return route.abort();
   }
   if(u.origin===sites.pp&&['/dashboard','/billing'].includes(path)&&method==='GET'){
     if(!onePortalRead||path!=='/dashboard'||req.resourceType()!=='document'||portalReads>=1){
       log.blocked.push({path,method,reason:'A2 permits one Store-admin dashboard document for pill identification'});
       return route.abort();
     }
     portalReads++;
     const data={time:new Date().toISOString(),path,resource:req.resourceType()};
     log.loads.push(data);
     appendFileSync(out+'/01/portal-loads.jsonl',JSON.stringify(data)+'\n');
   }
   return route.continue();
 });
 page.on('response',r=>{
   if(r.request().isNavigationRequest()&&r.frame()===page.mainFrame()){
     const u=new URL(r.url());log.documentResponses.push({origin:u.origin,path:u.pathname,status:r.status()});
   }
 });
 page.on('pageerror',e=>log.console.push({type:'pageerror',message:sanitized(e.message.split('\n')[0].replace(/https?:\/\/[^\s]+/g,'[url]')).slice(0,200)}));
 page.on('console',m=>{if(['error','warning'].includes(m.type()))log.console.push({type:m.type(),message:sanitized(m.text().split('\n')[0].replace(/https?:\/\/[^\s]+/g,'[url]')).slice(0,200)});});
 return {c,page,log};
}
export async function nav(page,app,path,ready){
 const r=await page.goto(sites[app]+path,{waitUntil:'domcontentloaded'});
 if(ready)await page.locator(ready).first().waitFor({state:'visible'});
 await Promise.race([page.evaluate(()=>document.fonts.ready.then(()=>true)),new Promise(r=>setTimeout(r,1500))]);
 return {status:r?.status(),path:new URL(page.url()).pathname};
}
export async function signIn(x,app,fixture) {
 x.signinApp=app;
 x.fixture=fixture;
 x.xStart=auth.sessionDiagnostics.length;
 x.method=await auth.signIn(x.page,app,fixture);
 return x.method;
}
export async function finish(x){
 if(x.signinApp){
  x.signout=await x.c.request.post(sites[x.signinApp]+'/api/auth/logout',{timeout:8000}).then(r=>r.status(),()=>null);
 }
 x.lastDiagnostics=x.xStart===undefined?[]:auth.sessionDiagnostics.slice(x.xStart);
 await x.c.close();
 return {fixture:x.fixture,method:x.method,app:x.signinApp,signout:x.signout,diagnostics:x.lastDiagnostics,network:x.log};
}
export const blankControls={safeRequestGuard:true,ownerBRejected:true,unknownRoleRejected:true,devRejected:true,unknownTargetRejected:true,outsideRootRejected:true};
write(out+'/01/runner-guards.json',blankControls);

export async function calibrate(browser,engine) {
 const page=await browser.newPage({viewport:{width:600,height:260}});
 const tests=[];
 try{
   for(const [name,style,expected] of [
     ['clean','color:#393b38;background:white','PASS'],
     ['known-below-threshold','color:white;background:#298572','FAIL'],
     ['half-opacity','color:white;background:#288472;opacity:.5','FAIL'],
     ['gradient-fail','color:white;background:linear-gradient(to right,#154474,white)','FAIL'],
     ['gradient-pass','color:white;background:linear-gradient(to right,#154474,#12355a)','PASS']
   ]){
     await page.setContent('<body style="background:white;margin:0"><p style="margin:0;padding:20px;font:16px Arial;'+style+'">MMMM MMMM MMMM MMMM MMMM MMMM MMMM MMMM</p>');
     const m=await rasterContrast(page);
     const observed=m.counts.fail?'FAIL':m.counts.notRun?'NOT RUN':'PASS';
     tests.push({name,expected,observed,pass:observed===expected,measurement:m});
   }
   await page.setContent('<main><button style="height:40px;border-radius:6px">Probe</button><div style="width:640px">Overflow control</div></main>');
   const bad=await page.evaluate(measure);
   await page.setContent('<main><button style="height:44px;border-radius:8px">Probe</button></main>');
   const good=await page.evaluate(measure);
   const dimensions={radiusNegative:bad.controls[0].radius==='6px',heightNegative:bad.controls[0].height===40,
     overflowNegative:bad.overflow>0,radiusPositive:good.controls[0].radius==='8px',heightPositive:good.controls[0].height===44,overflowPositive:good.overflow===0};
   const result={engine,version:browser.version(),tests,dimensions,pixelReady:tests.every(x=>x.pass),dimensionsReady:Object.values(dimensions).every(Boolean)};
   write(out+'/01/'+engine+'-controls.json',result,'wx');
   return result;
 } finally {await page.close();}
}
export async function control(loc) {
 return loc.evaluate(e=>{
   const r=e.getBoundingClientRect(),s=getComputedStyle(e);
   const info={x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height,radius:s.borderTopLeftRadius,
     font:s.fontFamily,fontSize:s.fontSize,weight:s.fontWeight,fg:s.color,bg:s.backgroundColor,outline:s.outline,outlineWidth:s.outlineWidth,shadow:s.boxShadow,
     offset:s.outlineOffset,opacity:Number(s.opacity),decoration:s.textDecorationLine,display:s.display,cursor:s.cursor,whiteSpace:s.whiteSpace,
     focusVisible:e.matches(':focus-visible'),disabled:e.matches(':disabled'),busy:e.getAttribute('aria-busy')};
   const range=document.createRange();
   range.selectNodeContents(e);
   const rects=Array.from(range.getClientRects()).filter(y=>y.height&&y.width);
   info.lineCount=new Set(rects.map(x=>Math.round(x.y))).size;
   return info;
 });
}
export async function controlStates(page,loc){
 const base=await control(loc);
 if(!base.width||!base.height)return {base,inactive:true};
 await loc.scrollIntoViewIfNeeded();
 const box=await loc.boundingBox();
 if(!box)return {base};
 await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
 await page.waitForTimeout(140);
 const hover=await control(loc);
 await page.mouse.move(0,0);
 if(base.disabled)return {base,hover};
 await page.keyboard.press('Tab');
 await loc.focus();
 await page.waitForTimeout(140);
 const focus=await control(loc);
 return {base,hover,focus};
}
export async function safeScreenshot(x,file){
 const path=new URL(x.page.url());
 if(path.search.match(/(?:token|code|key)=/i))return 'OMITTED: auth URL';
 await x.page.evaluate(values=>{
   const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
   let node;
   while(node=walker.nextNode()){
     let s=node.textContent;
     for(const v of values)s=s.split(v).join('[private]');
     node.textContent=s.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/ig,'[address]');
   }
   for(const field of document.querySelectorAll('input,textarea')) field.value='';
   for(const e of document.querySelectorAll('img')) if(!e.src.startsWith(location.origin))e.style.visibility='hidden';
 },privateValues);
 await x.page.screenshot({path:file,fullPage:false,animations:'disabled',mask:[x.page.locator('table,[role=table],input,textarea,select')]});
 return file;
}
