import {readFileSync} from 'node:fs';
import {rasterContrast} from './raster-contrast.mjs';
import {calibrate,control,controlStates,engines,expect,finish,nav,open,out,pw,safeError,signIn,sites,write} from './runner.mjs';

const eo='ENGINEERING_OWNER_A', ea='ENGINEERING_ADMIN', ei='ENGINEERING_INVITEE', er='ENGINEERING_MEMBER';
const source=['/owedbook','/help','/profile','/invitations','/admin-portal','/admin-portal/settings','/admin-portal/audit'];
const phoneWidths=[320,375,390,430];
const appSides=[375,767,768,769,1023,1024,1440];
const targetWidths=[375,768,1024,1440];
const allWidths=[...phoneWidths,768,1024,1440];
const publicRoutes=['/login','/','/register/plan','/auth/confirm','/auth/sign-in-to-continue','/auth/handoff-recovery','/auth/switch','/auth/signed-out','/auth/link-expired','/qa-missing-page'];
const roleRows=JSON.parse(readFileSync(out+'/01/fixture-capabilities.json')).rows;
expect(!roleRows.some(r=>r.ownerStoreCount===0&&r.memberOnlyStoreCount>0),'Fixture inventory differs from entry. Reconcile before running');
const number=x=>parseFloat(x);
const within=(r,w)=>r.width>0&&r.x>=-.5&&r.right<=w+.5;
const noOverflow=page=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
const check44=(s, width=false, radius=true)=>s.height>=44&&(!width||s.width>=44)&&(!radius||s.radius==='8px');
const footerGeometry=async page=>page.getByTestId('footer-links').evaluate(el=>{
 const wrap=el.parentElement, p=el.getBoundingClientRect(), w=wrap.getBoundingClientRect(), direction=getComputedStyle(el).flexDirection;
 return {direction,align:getComputedStyle(el).alignItems, centerGap:Math.abs((p.left+p.right-w.left-w.right)/2),
   children:[...el.children].map(c=>{const x=c.getBoundingClientRect();return {y:x.top,left:x.left,right:x.right,center:(x.left+x.right)/2}})};
});
function footerPass(f,w) {
 if(f.children.length!==3)return false;
 if(f.children.some(c=>c.left<0||c.right>w+.5))return false;
 return w<1024 ? f.direction==='column' && f.align==='center' && f.centerGap<1 &&
   new Set(f.children.map(c=>Math.round(c.y))).size===3
  : f.direction==='row' && Math.max(...f.children.map(c=>c.y))-Math.min(...f.children.map(c=>c.y))<1;
}
const switchScreen=async(p,w,h=900)=>p.setViewportSize({width:w,height:h});

for(const engine of engines){
 let browser;
 try{browser=await pw[engine].launch()}catch(e){
  write(out+'/02/'+engine+'-launch-failure.json',safeError(e),'wx');continue;
 }
 const logfile=out+'/02/'+engine+'.json';
 const rows=[],sessions=[];
 const save=(mode='w')=>write(logfile,{engine,version:browser.version(),rows,sessions},mode);
 save('wx');
 const row=async(id,scope,task)=>{
  const r={id,...scope,time:new Date().toISOString()};
  try{const data=await task();Object.assign(r,data);r.result=data.result??(data.pass?'PASS':'FAIL');}
  catch(e){Object.assign(r,safeError(e));r.result='INCOMPLETE';}
  rows.push(r);save();
 };
 const c=await calibrate(browser,engine);
 if(!c.dimensionsReady){rows.push({result:'BLOCKED',reason:'Dimension controls failed'});save();await browser.close();continue;}
 const runSession=async(app,who,fn)=>{
   const x=await open(browser);
   try{await signIn(x,app,who);await fn(x.page,x);}
   catch(e){rows.push({app,role:who,stage:x.method?'navigation':'sign-in',result:'INCOMPLETE',...safeError(e)});}
   finally{sessions.push(await finish(x));save();}
 };
 // R01/A1-1 and public controls, signed out only.
 const pub=await open(browser);
 try{
 for(const w of allWidths){
  await row('R-01/A1-1',{app:'ob',width:w},async()=>{
   const p=pub.page;await switchScreen(p,w);await nav(p,'ob','/','[data-testid="home-cta"]');
   const a=p.getByTestId('home-subscribe'),b=p.getByTestId('home-log-in');
   const body=[await controlStates(p,a),await controlStates(p,b)];
   const positions=await p.getByTestId('home-cta').evaluate(el=>{const s=getComputedStyle(el);return {width:el.clientWidth,gap:parseFloat(s.columnGap)}});
   const sameSize=Math.abs(body[0].base.width-body[1].base.width)<.5&&Math.abs(body[0].base.height-body[1].base.height)<.5;
   const sameRow=Math.abs(body[0].base.y-body[1].base.y)<1;
   const fits=positions.width>=2*256+positions.gap;
   const closedText=await p.evaluate(()=>document.body.textContent);
   const menu=p.getByRole('button',{name:'Open menu'}).first();
   const menuOpened=await menu.isVisible();
   if(menuOpened)await menu.click();
   const openText=await p.evaluate(()=>document.body.textContent);
   const links=await p.locator('a').filter({hasText:/^(Subscribe Now|Log in)$/i}).evaluateAll(all=>all.map(el=>({text:el.textContent.trim(),origin:new URL(el.href).origin,path:new URL(el.href).pathname,visible:!!el.getClientRects().length})));
   const visibleSubscription=links.filter(x=>x.visible&&/subscribe now/i.test(x.text)).length;
   const dest=links.every(x=>/subscribe/.test(x.text.toLowerCase())?(x.origin===sites.pp&&x.path==='/'):(x.origin===sites.ob&&x.path==='/auth'));
   const shape=body.every(x=>check44(x.base)&&within(x.base,w));
   const colors=body[0].base.bg==='rgb(40, 132, 114)'&&body[1].base.bg==='rgb(21, 68, 116)';
   const focus=!!body[1].focus?.focusVisible&&number(body[1].focus.outlineWidth)>=2;
   let contrast;
   if(c.pixelReady)contrast=await rasterContrast(p,'[data-testid="home-log-in"]');
   const coverage=contrast?.counts?.pass>0&&contrast.counts.fail===0&&contrast.counts.notRun===0;
   return {body,positions,sameSize,sameRow,fits,shape,colors,focus,menuOpened,links,visibleSubscription,contrast,
    pass:shape&&sameSize&&sameRow===fits&&colors&&focus&&dest&&visibleSubscription>=2&&coverage&&!/free\s+trial/i.test(closedText+' '+openText)};
  });
 }
 for(const [app,path,ws,id] of [['ob','/auth',targetWidths,'R-06a-login'],['pp','/login',[375,768,1440],'R-09a']]){
  for(const w of ws)await row(id,{app,width:w},async()=>{
   const p=pub.page;await switchScreen(p,w);await nav(p,app,path,'input[type=password]');
   const loc=p.getByRole('button',{name:'Show password'}).first();
   const state=await controlStates(p,loc);
   const formInput=p.locator('form:has(input[type=password]) input').filter({visible:true});
   const expectedId=await loc.getAttribute('aria-controls'); const initialCount=await formInput.count();
   await loc.press('Space');
   const visible=expectedId?await p.locator('input').evaluateAll((es,id)=>es.find(e=>e.id===id)?.type??null,expectedId):
     (initialCount>0&&await p.getByRole('button',{name:'Hide password'}).first().isVisible()?'text':null);
   return {state,visibleAfterKeyboard:visible,pass:check44(state.base,true)&&within(state.base,w)&&visible==='text'};
  });
 }
 for(const w of [375,1440])await row('R-03',{app:'ob',width:w},async()=>{
  const p=pub.page;await switchScreen(p,w);await nav(p,'ob','/auth','input[type=password]');
  const form=p.locator('form:has(input[type=password])'),button=form.getByRole('button',{name:'Login',exact:true});
  await form.locator('input[name=email]').fill('qa-control@example.invalid');
  await form.locator('input[name=password]').fill('Synthetic_Q4_only1');
  let release;const gate=new Promise(ok=>release=ok);let writes=0;
  const route=async r=>{
    const req=r.request();
    if(req.method()!=='POST')return r.fallback();
    writes++;await gate;return r.fulfill({status:503,contentType:'application/json',body:'{"message":"QA stubbed error"}'});
  };
  await p.route('**/*',route);
  try{
   await button.click();
   const working=form.getByRole('button',{name:'Logging in…',exact:true});await working.waitFor();
   const busy=await control(working);
   const progress=await form.getByText('Logging in…',{exact:true}).isVisible();
   const spinner=await form.locator('.animate-spin,[role=progressbar]').first().isVisible();
   const r=await working.boundingBox();await p.mouse.click(r.x+r.width/2,r.y+r.height/2);
   await p.waitForTimeout(150);
   return {writesIntercepted:writes,providerCalls:0,progress,spinner,busy,pass:writes===1&&progress&&spinner&&busy.disabled&&busy.busy==='true'};
  }finally{release();await p.waitForTimeout(150);await p.unroute('**/*',route);}
 });
 for(const path of publicRoutes)for(const w of (path==='/login'?appSides:[375,768,1024]))await row('R-08/A1-4-public',{app:'pp',path,width:w},async()=>{
  const p=pub.page;await switchScreen(p,w);const landed=await nav(p,'pp',path,'footer');
  const f=await footerGeometry(p);
  const sign=p.getByTestId('public-sign-in');const menu=p.getByTestId('menu-trigger');
  const header=w>=768?await control(sign):await control(menu);
  const fit=w>=768?header.lineCount===1&&number(header.fontSize)>=15:header.height>=44;
  const overflow=await noOverflow(p);
  return {landed,footer:f,header,overflow,pass:fit&&within(header,w)&&footerPass(f,w)&&overflow===0};
 });
 } finally {sessions.push(await finish(pub));save();}
 // R02/R04 all available capabilities. Removed user is exercised separately, never substituted for an active Member.
 rows.push({id:'R-02/R-04',role:'active Member-only',result:'BLOCKED',reason:'Released SCRATCH has no identity with a Member store and no Owner capability. Invitee tested in its actual mixed role. Removed Member has zero stores.'});
 for(const who of [eo,ea,ei,er]){
  await runSession('ob',who,async(p)=>{
   if(who!==er){
   for(const [w,h] of [[375,900],[768,900],[1023,900],[1024,900],[1440,900],[1024,600],[1440,650]]){
    await row('R-02/A1-2/A1-3',{app:'ob',role:who,width:w,height:h},async()=>{
     await switchScreen(p,w,h);await nav(p,'ob','/help','[data-testid="help-go-to-top"]');
     const menu=p.getByRole('navigation',{name:'On this page'});
     const link=menu.getByTestId('help-go-to-top');
     const end=p.getByTestId('help-go-to-top-end');
     const g=await menu.evaluate(e=>({clientHeight:e.clientHeight,scrollHeight:e.scrollHeight,overflow:getComputedStyle(e).overflowY,last:e.querySelector('a:last-child')?.textContent,
       lastAll:Array.from(e.querySelectorAll('a')).at(-1)?.textContent}));
     const endVisible=await end.isVisible();
     await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
     await link.click();await p.waitForFunction(()=>window.scrollY<2);
     const topClick=await p.locator('header').first().evaluate(e=>e.getBoundingClientRect().top>=-1);
     await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
     await link.press('Enter');await p.waitForFunction(()=>window.scrollY<2);
     const topKey=await p.locator('header').first().evaluate(e=>e.getBoundingClientRect().top>=-1);
     let endWorks=null;
     if(endVisible){await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await end.click();await p.waitForFunction(()=>window.scrollY<2);endWorks=true;}
     const short=h<700&&w>=1024;
     return {menu:g,endVisible,endWorks,topClick,topKey,pass:g.lastAll==='Go to the Top'&&topClick&&topKey&&endVisible===(w<1024)&&
       (!short||(g.scrollHeight>g.clientHeight&&g.overflow==='auto'))};
    });
   }}
   await nav(p,'ob','/profile','input[disabled]');
   for(const w of [375,1440]){
    await row('R-04/R-05',{app:'ob',role:who,width:w},async()=>{
     await switchScreen(p,w);
     const fields=p.locator('input[disabled]');
     const observations=[];
     for(let i=0;i<2;i++){
      const loc=fields.nth(i);const state=await controlStates(p,loc);const value=await loc.inputValue();
      const container=await loc.evaluate(e=>{e.setAttribute('data-qa-pixel-field','yes');return true});
      const pixel=c.pixelReady?await rasterContrast(p,'[data-qa-pixel-field="yes"]'):null;
      await loc.evaluate(e=>e.removeAttribute('data-qa-pixel-field'));
      const rect=await loc.boundingBox();await p.mouse.click(rect.x+2,rect.y+2);await p.keyboard.press('X');
      const inactive=state.base.disabled&&state.base.cursor==='not-allowed'&&(await loc.inputValue())===value;
      observations.push({state,pixel,inactive,pass:container&&inactive&&state.base.opacity===1&&state.base.bg==='rgb(223, 230, 236)'&&
        pixel?.counts.pass>=1&&pixel.counts.fail===0&&pixel.counts.notRun===0});
     }
     const link=p.locator('a[href="mailto:support@pharmacybooks.com"]').filter({visible:true}).first();
     const support=await controlStates(p,link);
     const supportPass=support.base.fg==='rgb(40, 132, 114)'&&support.base.decoration.includes('underline');
     return {fields:observations,support,supportPass,pass:observations.every(x=>x.pass)&&supportPass};
    });
   }
   for(const w of targetWidths)await row('R-06a-profile',{app:'ob',role:who,width:w},async()=>{
    await switchScreen(p,w);const loc=p.getByRole('button',{name:'Show password'});const controls=[];
    for(let i=0;i<await loc.count();i++)controls.push(await controlStates(p,loc.nth(i)));
    return {controls,pass:controls.length>0&&controls.every(x=>check44(x.base,true)&&within(x.base,w))};
   });
   if(who===eo){
    await nav(p,'ob','/owedbook','[role="tablist"]');
    for(const w of [...new Set([...phoneWidths,...targetWidths])])await row('R-06bc/R-07-dashboard',{app:'ob',role:who,width:w},async()=>{
     await switchScreen(p,w);const ts=p.getByRole('tab');const g=[];
     const account=p.getByRole('button',{name:'Account menu'}).filter({visible:true}).first();
     for(let i=0;i<await ts.count();i++)g.push(await controlStates(p,ts.nth(i)));
     const tab=await p.getByRole('tablist').evaluate(e=>({scroll:e.scrollWidth,width:e.clientWidth,overflow:getComputedStyle(e).overflowX}));
     const a=await account.count()?await controlStates(p,account):null;
     const overflow=await noOverflow(p);
     return {tabs:g,tablist:tab,account:a,overflow,pass:g.length>0&&g.every(x=>check44(x.base)&&number(x.base.fontSize)===14&&number(x.base.weight)===500)&&
      (w<1024||(a&&check44(a.base,true,false)&&number(a.base.radius)>=22))&&overflow===0&&(tab.scroll<=tab.width||tab.overflow==='auto')};
    });
    await nav(p,'ob','/admin-portal/billing','[data-testid="add-store-handoff"]');
    for(const w of phoneWidths)await row('R-07-owedbook-billing',{app:'ob',role:who,width:w},async()=>{
     await switchScreen(p,w);const add=await controlStates(p,p.getByTestId('add-store-handoff'));
     const helper=p.getByTestId('add-store-handoff').locator('..').locator('p').first();
     const h=await control(helper);
     const overflow=await noOverflow(p);
     return {add,helper:h,overflow,pass:within(add.base,w)&&within(h,w)&&overflow===0};
    });
    let storePages=[];
    await nav(p,'ob','/admin-portal','main');
    const store=await p.locator('a[href^="/admin-portal/stores/"]').evaluateAll(as=>as.map(a=>a.getAttribute('href')).find(h=>/^\/admin-portal\/stores\/[^/]+$/.test(h)));
    if(store)storePages=[store,store+'/invite'];
    else rows.push({id:'R-07-narrow-other',result:'BLOCKED',reason:'No store-details link found'});
    for(const path of [...source,...storePages])await row('R-07-narrow-other',{app:'ob',role:who,path,width:320},async()=>{
     await switchScreen(p,320);const seen=await nav(p,'ob',path,'main');const overflow=await noOverflow(p);
     const menu=await control(p.getByRole('button',{name:'Open menu'}).first());
     return {seen,menu,overflow,pass:seen.path===path&&overflow===0&&within(menu,320)&&menu.height>=44};
    });
   }
  });
 }
 await runSession('pp',eo,async(p)=>{
  for(const path of ['/dashboard','/billing']){
   await nav(p,'pp',path,'[data-testid="footer-links"]');
   for(const w of appSides)await row('R-08/A1-4-signed-in',{app:'pp',role:eo,path,width:w},async()=>{
    await switchScreen(p,w);const f=await footerGeometry(p);
    const overflow=await noOverflow(p);
    return {footer:f,overflow,pass:footerPass(f,w)&&overflow===0&&new URL(p.url()).pathname===path};
   });
   for(const w of [375,768,1440])await row('R-09bc',{app:'pp',role:eo,path,width:w},async()=>{
    await switchScreen(p,w);
    const buttons=p.locator('[data-testid^="remove-store-"],[data-testid^="undo-removal-"]');
    const rowControls=[];for(let i=0;i<await buttons.count();i++)rowControls.push(await controlStates(p,buttons.nth(i)));
    const refresh=await controlStates(p,p.getByTestId('refresh'));
    return {rowControls,refresh,pass:rowControls.length>0&&rowControls.every(x=>check44(x.base)&&within(x.base,w))&&refresh.base.height>=44&&number(refresh.base.fontSize)===12};
   });
  }
 });
 save();await browser.close();
 console.log(JSON.stringify({engine,rows:rows.length,outcomes:rows.reduce((a,r)=>(a[r.result]=(a[r.result]||0)+1,a),{})}));
}
