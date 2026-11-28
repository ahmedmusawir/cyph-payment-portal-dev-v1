import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {identity,sameIdentity} from './identity.mjs';
import {measure} from './measure.mjs';
import {control,expect,finish,nav,open,out,pw,safeError,signIn,sites,write} from './runner.mjs';
try{await import('./state-matrix.mjs');}catch(e){write(out+'/03/nontext-command-failure.json',safeError(e),'wx');}
const browser=await pw.chromium.launch();
const rows=[],sessions=[];
const file=out+'/04/core.json';
const save=(flag='w')=>write(file,{browser:'chromium',version:browser.version(),rows,sessions},flag);
save('wx');
const owner='ENGINEERING_OWNER_A', admin='ENGINEERING_ADMIN',invitee='ENGINEERING_INVITEE',removed='ENGINEERING_MEMBER';
let ownerRoutes=[];
const roleResults=async(app,who,fn)=>{
 const x=await open(browser);const p=x.page;
 try{await signIn(x,app,who);await fn(p,x);}
 catch(e){rows.push({section:'session',app,role:who,result:'INCOMPLETE',method:x.method,...safeError(e)});}
 finally{sessions.push(await finish(x));save();}
};
const check=async(section,scope,fn)=>{
 const row={section,...scope,time:new Date().toISOString()};
 try{const r=await fn();Object.assign(row,r);row.result=r.result??(r.pass?'PASS':'FAIL');}
 catch(e){Object.assign(row,safeError(e));row.result='INCOMPLETE';}
 rows.push(row);save();
};
const roleMap=JSON.parse(readFileSync(out+'/01/fixture-capabilities.json')).rows;
const help=async(p,who)=>{
 const seen=await nav(p,'ob','/help','nav[aria-label="On this page"]');
 const h=await p.evaluate(()=>{
   const s=[...document.querySelectorAll('nav[aria-label="On this page"] a')];
   const anchors=s.map(e=>e.getAttribute('href'));
   const dead=anchors.filter(h=>!h?.startsWith('#')||(h!=='#top'&&!document.getElementById(h.slice(1))));
   const forbidden=/\b(?:4242[ -]?4242[ -]?4242[ -]?4242|QA sandbox|WEBHOOK_SECRET|engineering_owner)\b/i.test(document.body.innerText);
   const localTargets=[...document.querySelectorAll('main a')].map(x=>new URL(x.href,location.href)).filter(u=>u.protocol==='http:').map(x=>({origin:x.origin,path:x.pathname}));
   return {anchors:anchors.length,dead,forbidden,localTargets};
 });
 const billing=p.getByRole('link',{name:/Billing/}).filter({visible:true});
 return {seen, ...h,navBillingLinkCount:await billing.count(),capability:roleMap.find(r=>r.role===who),
    pass:seen.path==='/help'&&h.anchors>=13&&h.dead.length===0&&!h.forbidden};
};
for(const who of [owner,admin,invitee,removed]){
 await roleResults('ob',who,async(p,x)=>{
   await check('CR-01/03 AC-F01',{role:who},async()=>{
    await nav(p,'ob','/owedbook','select[aria-label="Store"]');
    const select=p.getByRole('combobox',{name:'Store',exact:true});
    await p.waitForFunction(()=>{const x=document.querySelector('select[aria-label="Store"]'); return x?.options.length&&![...x.options].some(o=>o.textContent==='Loading stores…');});
    const set=await select.locator('option').evaluateAll(els=>els.map(e=>({empty:e.value==='',noStores:e.textContent==='No permitted stores'})));
    const disabled=await select.isDisabled();
    const expected=roleMap.find(x=>x.role===who).storeCount;
    return {expected,actual:set.filter(e=>!e.empty).length,noStores:set.some(e=>e.noStores),disabled,
     pass:expected===set.filter(e=>!e.empty).length&&(expected===0?set.length===1&&set[0].noStores&&disabled:!set.some(e=>e.noStores)&&!disabled)};
   });
   await check('AC-H01/H02/H03 Help',{role:who},()=>help(p,who));
   await check('AC-H03 Help app links',{role:who},async()=>{
    const checks=[];
    for(const [label,path] of [['open My Stores','/admin-portal'],['open Billing','/admin-portal/billing']]){
     await nav(p,'ob','/help','nav[aria-label="On this page"]');
     const link=p.getByRole('link',{name:label,exact:true});
     const href=await link.getAttribute('href');
     await link.click();
     const expected=who===removed?'/owedbook':path;
     await p.waitForURL(u=>u.pathname===expected);
     let adminBillingOK=true;
     if(who===admin&&path.endsWith('billing')){
      const n=p.getByTestId('billing-owner-only');
      await n.waitFor();
      adminBillingOK=(await n.textContent()).includes('Billing is managed by the account owner');
     }
     checks.push({label,hrefExpected:href===path,observed:new URL(p.url()).pathname,expected,adminBillingOK});
    }
    return {checks,pass:checks.every(r=>r.hrefExpected&&r.observed===r.expected&&r.adminBillingOK)};
   });
   if(who===owner||who===admin||who===invitee){
    await check('CR-01 / Admin role surface',{role:who},async()=>{
     const seen=await nav(p,'ob','/admin-portal','h1');
     await p.getByRole('heading',{name:'My Stores',exact:true}).waitFor();
     const stores=await p.locator('a[href^="/admin-portal/stores/"]').evaluateAll(as=>[...new Set(as.map(a=>a.getAttribute('href')).filter(h=>/^\/admin-portal\/stores\/[^/]+$/.test(h)))]);
     if(who===owner)ownerRoutes=stores;
     return {seen,actual:stores.length,pass:seen.path==='/admin-portal'&&stores.length>0,_authorizedStoreCount:stores.length};
    });
   }
   if(who===admin){
    await check('CR-02 Store admin wrong-store denial',{role:who},async()=>{
     await nav(p,'ob','/admin-portal','body');
     await p.locator('a[href^="/admin-portal/stores/"]').first().waitFor();
     const own=await p.locator('a[href^="/admin-portal/stores/"]').evaluateAll(as=>as.map(e=>e.getAttribute('href')));
     const denied=ownerRoutes.find(path=>!own.includes(path));
     if(!denied)return {result:'BLOCKED',reason:'No witnessed out-of-scope valid fixture route'};
     await nav(p,'ob',denied,'body');
     const back=await p.getByRole('link',{name:'Back to My Stores'}).waitFor({timeout:7000}).then(()=>true,()=>false);
     return {friendlyDenial:back,pass:back};
    });
    await check('CR-01 / Owner billing restriction',{role:who},async()=>{
     await nav(p,'ob','/admin-portal/billing','[data-testid="billing-owner-only"]');
     const notice=await p.getByTestId('billing-owner-only').textContent();
     return {ownerMessage:notice.includes('Billing is managed by the account owner'),manageVisible:await p.getByTestId('open-billing-portal').isVisible(),
      pass:notice.includes('Billing is managed by the account owner')&&!await p.getByTestId('open-billing-portal').isVisible()};
    });
   }
   if(who===removed){
    await check('CR-01/H03 removed role navigation',{role:who},async()=>{
     await nav(p,'ob','/admin-portal/billing','main');
     return {landed:new URL(p.url()).pathname,pass:new URL(p.url()).pathname==='/owedbook'};
    });
   }
   if(who===owner){
    await check('CR-04 truthful deliberate OwedBook data failure',{role:who},async()=>{
     const route=async r=>r.fulfill({status:503,contentType:'application/json',body:'{"code":"QA_STUB","message":"QA intentional read failure"}'});
     await p.route('**/rest/v1/rpc/owedbook_rows',route);
     try{
      await nav(p,'ob','/owedbook','select[aria-label="Store"]');
      const msg=p.getByRole('alert').filter({hasText:'QA intentional read failure'}).first();
      await msg.waitFor({state:'visible'});
      const zero=await p.getByText('No results',{exact:true}).isVisible();
      return {stubbedReadOnly:true,errorVisible:true,zeroEmptyVisible:zero,pass:!zero};
     }finally{await p.unroute('**/rest/v1/rpc/owedbook_rows',route);}
    });
    await check('CR-05/06 password handoff and logout',{role:who},async()=>{
     const before=await identity(x.c,'ob');
     expect(x.method.includes('password')&&before,'Verified Owner password session required');
     await nav(p,'ob','/admin-portal/billing','[data-testid="open-billing-portal"]');
     await p.getByTestId('open-billing-portal').click();
     await p.waitForURL(u=>u.origin===sites.pp&&u.pathname==='/billing');
     const forward=sameIdentity(before,await identity(x.c,'pp'));
     await p.locator('header nav[aria-label="Account"]').getByRole('link',{name:'Open OwedBook',exact:true}).click();
     await p.waitForURL(u=>u.origin===sites.ob&&u.pathname==='/owedbook');
     const back=sameIdentity(before,await identity(x.c,'ob'));
     const response=await x.c.request.post(sites.ob+'/api/auth/logout',{timeout:8000});
     x.signout=response.status();
     x.signinApp=null;
     const ver=[];
     for(const [app,path] of [['ob','/owedbook'],['pp','/billing']]){
      const seen=await nav(p,app,path,null);
      ver.push({app,...seen,refused:/^\/(auth|login)(\/|$)/.test(seen.path)});
     }
     return {forward,back,signout:x.signout,refusals:ver,pass:forward&&back&&x.signout===200&&ver.every(v=>v.refused)};
    });
   }
 });
}
for(const who of [admin,removed])await roleResults('pp',who,async(p,x)=>{
 await check('CR-02 Portal no Owner payload',{role:who},async()=>{
  const stream=await x.c.request.get(sites.pp+'/api/billing/overview',{timeout:12000});
  const body=await stream.json();
  const ownerData=['overview','account','subscription','stores','customer','paymentMethod'].some(k=>k in body);
  return {status:stream.status(),ownerData,pass:stream.status()===403&&!ownerData};
 });
});
await check('AC-N02 master logo hashes',{},()=>{
 const expected='e7e5d3575c743f7c07defbaf907dc71a2a7f854aadaaad92d74e73f4d3293afd';
 const sources=['ob','pp'].map(app=>{
  const path='/tmp/abm007-final-cody-q4/'+app+'/public/brand/pharmacy-books-logo-primary.png';
  return {app, sha256:createHash('sha256').update(readFileSync(path)).digest('hex')};
 });
 return {expected,sources,pass:sources.every(x=>x.sha256===expected)};
});
await check('AC-P01 repaired labels against saved screen probes',{},()=>{
 const labels=readFileSync('agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/E2/CHANGED_LABELS.md','utf8').split('## RWO-01 repair work order')[1];
 const expected=['Subscribe Now','Log in','Go to the Top','Logging in…'];
 const repairs=['chromium','firefox','webkit'].flatMap(engine=>JSON.parse(readFileSync(out+'/02/'+engine+'.json')).rows);
 const proofs={
  'Subscribe Now':repairs.some(r=>r.id==='R-01/A1-1'&&r.links?.some(l=>l.text==='Subscribe Now'&&l.visible)),
  'Log in':repairs.some(r=>r.id==='R-01/A1-1'&&r.links?.some(l=>l.text==='Log in'&&l.visible)),
  'Go to the Top':repairs.some(r=>r.id==='R-02/A1-2/A1-3'&&r.menu?.lastAll==='Go to the Top'&&r.result==='PASS'),
  'Logging in…':repairs.some(r=>r.id==='R-03'&&r.progress&&r.result==='PASS')
 };
 return {labels:expected.map(label=>({label,listed:labels?.includes(label)??false,observed:proofs[label]})),
  pass:expected.every(label=>(labels?.includes(label)??false)&&proofs[label])};
});
rows.push({section:'CR-01/02/03 Help and access',role:'Active Member-only',result:'BLOCKED',reason:'Only active Member-per-store identity has its own Owner account. Removed Member assessed separately.'});
const x=await open(browser);
try{
 for(const app of ['ob','pp']){
  for(const path of (app==='ob'?['/','/auth','/qa-missing-page']:['/login','/register/plan','/qa-missing-page'])){
   await check('Brand, markup and link walk',{app,path},async()=>{
    const seen=await nav(x.page,app,path,null);
    const m=await x.page.evaluate(measure);
    const missing=m.anchors.filter(a=>!a.exists);
    const logo=await x.page.locator('img').evaluateAll(as=>as.some(a=>/pharmacy-books-logo-primary/.test(a.getAttribute('src')||'')));
    return {seen,oldName:Object.values(m.oldNames).some(Boolean),missingAnchors:missing.length,logo,
      pass:!Object.values(m.oldNames).some(Boolean)&&missing.length===0&&(path==='/qa-missing-page'?seen.status===404:logo)};
   });
  }
 }
}finally{sessions.push(await finish(x));save();await browser.close();}
console.log(JSON.stringify({criteria:rows.length,results:rows.reduce((a,r)=>(a[r.result]=(a[r.result]??0)+1,a),{})}));
