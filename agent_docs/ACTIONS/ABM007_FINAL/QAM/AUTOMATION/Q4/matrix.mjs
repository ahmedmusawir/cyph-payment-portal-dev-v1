import {readFileSync} from 'node:fs';
import {rasterContrast} from './raster-contrast.mjs';
import {measure} from './measure.mjs';
import {engines,finish,nav,open,out,pw,safeError,signIn,sites,write} from './runner.mjs';

const q=out.slice(0,-'/evidence/Q4'.length);
const previous=JSON.parse(readFileSync(q+'/evidence/Q2/02/measurement-summary.json')).rows;
const original=previous.map(row=>{
 const raw=JSON.parse(readFileSync(q+'/'+row.evidence));
 return {...row,role:raw.role??'PUBLIC',scripts:raw.scripts!==false};
});
const aggregate=await Promise.all(engines.map(async engine=>{
 let browser;
 try{browser=await pw[engine].launch()}
 catch(e){write(out+'/03/'+engine+'-launch.json',safeError(e),'wx');return {engine,blocked:true};}
 const proof=JSON.parse(readFileSync(out+'/01/'+engine+'-controls.json'));
 const matrix=out+'/03/'+engine+'-matrix.json';
 const prior=JSON.parse(readFileSync(out+'/02/'+engine+'.json'));
 const priorSetupFailed=(app,role)=>prior.sessions.some(s=>s.app===app&&s.fixture===role&&!s.method);
 const saved=process.argv.includes('--resume-unrecorded')?JSON.parse(readFileSync(matrix)):null;
 const rows=saved?.rows??[],sessions=saved?.sessions??[];
 const save=(flag='w')=>write(matrix,{engine,version:browser.version(),rows,sessions},flag);
 if(!saved)save('wx');
 const recorded=new Set(rows.map(r=>r.baseline));
 const chosen=original.filter(r=>r.engine===engine&&!recorded.has(r.evidence));
 const groups=new Map();
 for(const r of chosen){
  const key=JSON.stringify([r.app,r.role,r.scripts]);
  if(!groups.has(key))groups.set(key,[]);
  groups.get(key).push(r);
 }
 for(const [group,positions] of groups){
  const [app,role,scripts]=JSON.parse(group);
  if(role==='ENGINEERING_MEMBER'){
   rows.push(...positions.map(({evidence,requested,width})=>({baseline:evidence,app,role,requested,width,result:'BLOCKED',reason:'Q2 active Member was removed in J-h. Zero-store case tested separately. Existing Invitee has mixed Owner/Member capability.'})));
   save();continue;
  }
  if(priorSetupFailed(app,role)){
   rows.push(...positions.map(({evidence,requested,width})=>({baseline:evidence,app,role,requested,width,result:'BLOCKED',reason:'First setup attempt for this browser/app/fixture failed in 02. No automatic sign-in retry.'})));
   save();continue;
  }
  if(!scripts){
   rows.push(...positions.map(({evidence,requested,width})=>({baseline:evidence,app,role,requested,width,scripts,
    result:'BLOCKED',reason:'Two scripts-disabled browser instrument stalls. Recorded first failures and continued ordinary cases.'})));
   save();continue;
  }
  const x=await open(browser,{javaScriptEnabled:scripts});
  const p=x.page;
  try{
   if(role!=='PUBLIC')await signIn(x,app,role);
   let storePath=null;
   if(positions.some(r=>r.requested.startsWith('/admin-portal/stores/'))){
    await nav(p,'ob','/admin-portal','body');
    await p.locator('a[href^="/admin-portal/stores/"]').first().waitFor({timeout:7000}).catch(()=>{});
    storePath=await p.locator('a[href^="/admin-portal/stores/"]').evaluateAll(as=>as.map(a=>a.getAttribute('href')).find(h=>/^\/admin-portal\/stores\/[^/]+$/.test(h)));
   }
   for(const r of positions){
    const {evidence,width,requested,landed:baselineLanded}=r;
    const row={app,role,scripts,width,requested,baseline:evidence,baselineLanded};
    if(requested==='/register/review'||requested==='/register/activation'){
      rows.push({...row,result:'BLOCKED',reason:'Held review and payment-dependent activation out of Q4'});save();continue;
    }
    if(!proof.dimensionsReady){rows.push({...row,result:'BLOCKED',reason:'Controls not valid'});save();continue;}
    let path=requested;
    if(requested.includes('[id]')){
      if(!storePath){rows.push({...row,result:'BLOCKED',reason:'No scoped store link'});save();continue;}
      path=requested.replace('/admin-portal/stores/[id]',storePath);
    }
    try{
     await p.setViewportSize({width,height:900});
     const seen=await nav(p,app,path,null);
     // Allow pending read states to settle. Retain first timeout separately rather than count a placeholder.
     await p.locator('[data-testid$="-skeleton"], [data-testid="dashboard-loading"]').first().waitFor({state:'hidden',timeout:4500});
     await p.waitForTimeout(130);
     const dom=await p.evaluate(measure);
     const candidate=await p.evaluate(()=>{
       const yes=e=>e.getClientRects().length>0&&getComputedStyle(e).visibility==='visible';
       const describe=e=>{
        const r=e.getBoundingClientRect(),s=getComputedStyle(e),bg=getComputedStyle(e).backgroundColor;
        return {tag:e.tagName,role:e.getAttribute('role'),kind:e.getAttribute('type'),test:e.dataset.testid??null,
          radius:s.borderTopLeftRadius, height:r.height,width:r.width,left:r.left,right:r.right,fontSize:s.fontSize,
          fontWeight:s.fontWeight,color:s.color,bg,border:s.borderWidth,outline:s.outline,ariaBusy:e.getAttribute('aria-busy'),
          disabled:e.matches(':disabled'),anchor: e.tagName==='A',variant:s.backgroundColor,
          linkRecipe:e.classList.contains('pb-link')?'on-white':e.classList.contains('pb-link-on-dark')?'on-navy':e.classList.contains('pb-link-on-page')?'on-ice':null,
          underline:s.textDecorationLine,bodyLink:!e.closest('nav,header')&&e.tagName==='A'&&e.matches('p a')};
       };
       const controls=[...document.querySelectorAll('button,[role="tab"],input,textarea,select,a')].filter(yes).map(describe);
       const cards=[...document.querySelectorAll('.pb-card,.pb-shell,.pb-masthead,[role=dialog]')].filter(yes).map(e=>{
        const s=getComputedStyle(e);return {surface:e.classList.contains('pb-masthead')?'masthead':e.classList.contains('pb-shell')?'shell':'card',radius:s.borderTopLeftRadius,border:s.borderWidth,shadow:s.boxShadow};
       });
       const nontext=[...document.querySelectorAll('input,select,textarea,button')].filter(yes).map(e=>{
        const s=getComputedStyle(e);return {tag:e.tagName, border:s.borderColor, background:s.backgroundColor, disabled:e.matches(':disabled'), focus:s.outline};
       });
       return {controls,cards,nontext};
     });
     const navControl=candidate.controls.find(x=>x.test==='menu-trigger'&&x.height<44);
     const buttonNavy=candidate.controls.filter(x=>
       ['rgb(21, 68, 116)','rgb(18, 53, 90)'].includes(x.bg)&&
       (x.tag==='BUTTON'||x.role==='button'||x.test==='home-log-in')&&x.test!=='home-log-in');
     const primaryTargets=candidate.controls.filter(x=>x.role==='tab'||['menu-trigger','home-log-in','home-subscribe','add-store-handoff','add-store-link','refresh','public-sign-in'].includes(x.test)||
       (x.tag==='BUTTON'&&['rgb(40, 132, 114)','rgb(223, 230, 236)'].includes(x.bg)));
     const badTarget=primaryTargets.filter(x=>x.height<44);
     const badCorner=candidate.controls.filter(x=>x.tag==='INPUT'&&!['checkbox','radio','hidden'].includes(x.kind)&&x.radius!=='8px');
     const badSurface=candidate.cards.filter(x=>x.radius!==(x.surface==='card'?'14px':'16px'));
     const badLinks=candidate.controls.filter(x=>x.linkRecipe&&
       (!x.underline.includes('underline')||x.color!==({'on-white':'rgb(40, 132, 114)','on-navy':'rgb(234, 243, 250)','on-ice':'rgb(21, 68, 116)'})[x.linkRecipe]));
     const visual={badCorner,badSurface,badTarget,navControl:navControl??null,badLinks,buttonNavy};
     const pixel=proof.pixelReady?await rasterContrast(p):null;
     const sample={...row,seen,dom,candidate,visual,pixel,time:new Date().toISOString()};
     const name=engine+'/'+String(rows.length).padStart(4,'0')+'.json';
     write(out+'/03/'+name,sample,'wx');
     rows.push({...row,seen,result:'OBSERVED',evidence:name,overflow:dom.overflow,visualFlags:Object.fromEntries(
       Object.entries(visual).map(([k,v])=>[k,Array.isArray(v)?v.length:Number(!!v)])),
       rasterCounts:pixel?.counts??null,redirected:seen.path!==path});
    }catch(e){rows.push({...row,result:'INCOMPLETE',...safeError(e)});}
    save();
   }
  }catch(e){rows.push(...positions.map(({evidence,requested,width})=>({baseline:evidence,app,role,requested,width,result:'INCOMPLETE',stage:'session',...safeError(e)}))); }
  finally{sessions.push(await finish(x));save();}
  // One login per browser/app/role for this phase. This progress is independent of the retest scripts.
  console.log(JSON.stringify({engine,app,role,matrixRows:rows.length}));
 }
 await browser.close();
 return {engine,rows:rows.reduce((a,r)=>(a[r.result]=(a[r.result]??0)+1,a),{})};
}));
write(out+'/03/summary.json',{sourcePositions:original.length,aggregate},'wx');
