import {readFileSync} from 'node:fs';
import {control,controlStates,engines,finish,nav,open,out,pw,safeError,signIn,sites,write} from './runner.mjs';
const rows=[];
const file=out+'/02/read-only-diagnostics.json';
const sessions=[];
const save=(flag='w')=>write(file,{firstFailurePolicy:'Original matrix immutable. Separate bounded diagnostic. Exclude responsive hidden clones and wait for required content.',rows,sessions},flag);
save('wx');
const guarded=(t,w)=>t.width>0&&t.height>=44&&t.x>=-.5&&t.right<=w+.5&&t.radius==='8px';
for(const engine of engines){
 const b=await pw[engine].launch().catch(()=>null);
 if(!b){rows.push({engine,result:'BLOCKED',reason:'Engine unavailable'});save();continue;}
 const base=JSON.parse(readFileSync(out+'/02/'+engine+'.json'));
 const scoped=(id, fn)=>async (x,fields)=>{
   try{const result=await fn(x,fields);rows.push({engine,version:b.version(),id,...fields,...result,time:new Date().toISOString()});}
   catch(e){rows.push({engine,version:b.version(),id,...fields,result:'INCOMPLETE',...safeError(e)});}
   save();
 };
 const pp=await open(b);
 if(base.sessions.some(r=>r.app==='pp'&&r.fixture==='ENGINEERING_OWNER_A'&&r.method)){
 try{
  await signIn(pp,'pp','ENGINEERING_OWNER_A');
  for(const path of ['/dashboard','/billing']){
   await nav(pp.page,'pp',path,'[data-testid="pharmacies-section"]');
   for(const width of [375,768,1440]){
    await scoped('R-09bc',async(x,{width})=>{
     const p=x.page;await p.setViewportSize({width,height:900});
     const visible=p.locator('[data-testid^="remove-store-"],[data-testid^="undo-removal-"]').filter({visible:true});
     await visible.first().waitFor({state:'visible'});
     const controls=[];
     for(let n=0;n<await visible.count();n++)controls.push(await controlStates(p,visible.nth(n)));
     const refresh=await control(p.getByTestId('refresh'));
     return {visibleCount:controls.length,controls,refresh,result:controls.length>0&&controls.every(r=>guarded(r.base,width))&&refresh.height>=44&&refresh.fontSize==='12px'?'PASS':'FAIL'};
    })(pp,{path,width});
   }
  }
 }catch(e){rows.push({engine,version:b.version(),id:'R-09bc',result:'INCOMPLETE',...safeError(e)});}
 finally{sessions.push(await finish(pp));save();}
 }else{await pp.c.close();rows.push({engine,id:'R-09bc',result:'BLOCKED',reason:'Earlier Owner sign-in did not establish a session. No repeat.'});save();}
 const ob=await open(b);
 if(base.sessions.some(r=>r.app==='ob'&&r.fixture==='ENGINEERING_OWNER_A'&&r.method)){
 try{
  await signIn(ob,'ob','ENGINEERING_OWNER_A');
  const p=ob.page;
  await p.setViewportSize({width:320,height:900});
  await nav(p,'ob','/admin-portal','body');
  await p.locator('a[href^="/admin-portal/stores/"]').first().waitFor();
  const links=await p.locator('a[href^="/admin-portal/stores/"]').evaluateAll(el=>[...new Set(el.map(e=>e.getAttribute('href')).filter(h=>/^\/admin-portal\/stores\/[^/]+$/.test(h)))]);
  const targets=[...['/owedbook','/help','/profile','/invitations','/admin-portal','/admin-portal/settings','/admin-portal/audit'].map(path=>({path,label:path})),
    ...links.flatMap(path=>[{path,label:'/admin-portal/stores/[id]'},{path:path+'/invite',label:'/admin-portal/stores/[id]/invite'}])];
  for(const t of targets) await scoped('R-07-narrow-other',async(x,{path,target})=>{
    const p=x.page;const seen=await nav(p,'ob',t.path,'body');
    const menu=await control(p.getByRole('button',{name:'Open menu'}).first());
    const metrics=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,heading:!!document.querySelector('h1'),hasVisibleApp:!!document.querySelector('header')}));
    return {samePath:seen.path===t.path,status:seen.status,menu,metrics,result:seen.status===200&&seen.path===t.path&&
      metrics.overflow===0&&metrics.hasVisibleApp&&menu.height>=44&&menu.right<=320.5?'PASS':'FAIL'};
  })(ob,{path:t.label,width:320});
 }catch(e){rows.push({engine,version:b.version(),id:'R-07-narrow-other',result:'INCOMPLETE',...safeError(e)});}
 finally{sessions.push(await finish(ob));save();}
 }else{await ob.c.close();rows.push({engine,id:'R-07-narrow-other',result:'BLOCKED',reason:'Earlier Owner sign-in did not establish a session. No repeat.'});save();}
 // A framework 404 never rendered the shared shell. Preserve first selector timeouts and classify scope.
 const s=await open(b);
 for(const width of [375,768,1024])await scoped('R-08-public-404-scope',async(x,{width})=>{
   await x.page.setViewportSize({width,height:900});
   const seen=await nav(x.page,'pp','/qa-missing-page','body');
   const shell=await x.page.getByTestId('footer-links').count();
   return {seen,sharedFooterExists:!!shell,result:seen.status===404&&!shell?'OUTSIDE SHARED SHELL':'OBSERVED'};
 })(s,{width});
 for(const width of [320,375,390,430,768,1024,1440])await scoped('R-01/A1-1-real-destinations',async(x,{width})=>{
  const p=x.page;
  await p.setViewportSize({width,height:900});
  const choices=[];
  for(const [origin,path,type] of [[sites.pp,'/','body-subscribe'],[sites.ob,'/auth','body-login'],[sites.pp,'/','site-subscribe'],[sites.ob,'/auth','site-login']]){
   await nav(p,'ob','/','[data-testid="home-cta"]');
   const label=path==='/'?'Subscribe Now':'Log in';
   let loc;
   if(type.startsWith('body'))loc=p.getByTestId(path==='/'?'home-subscribe':'home-log-in');
   else if(await p.getByRole('button',{name:'Open menu'}).first().isVisible()){
    await p.getByRole('button',{name:'Open menu'}).first().click();
    loc=p.getByRole('dialog',{name:'Mobile navigation'}).getByRole('link',{name:label,exact:true});
   } else loc=p.locator('header').getByRole('link',{name:label,exact:true}).filter({visible:true}).first();
   const href=new URL(await loc.getAttribute('href'),sites.ob);
   await loc.click();
   await p.waitForURL(u=>u.origin===origin&&(u.pathname===path||(path==='/'&&u.pathname==='/register/plan')));
   choices.push({type,hrefMatches:href.origin===origin&&href.pathname===path,landed:new URL(p.url()).pathname});
  }
  return {choices,result:choices.length===4&&choices.every(r=>r.hrefMatches)?'PASS':'FAIL'};
 })(s,{width});
 sessions.push(await finish(s));save();
 await b.close();
}
