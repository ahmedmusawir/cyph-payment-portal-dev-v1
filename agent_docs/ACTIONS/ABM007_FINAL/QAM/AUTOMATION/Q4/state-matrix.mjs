import {readFileSync} from 'node:fs';
import {nonText} from './nontext-pixels.mjs';
import {rasterViewport} from './raster-viewport.mjs';
import {control,finish,nav,open,out,pw,safeError,signIn,write} from './runner.mjs';
const q=out.slice(0,-'/evidence/Q4'.length);
const roles=['PUBLIC','ENGINEERING_OWNER_A','ENGINEERING_ADMIN','ENGINEERING_MEMBER'];
const matchers={PUBLIC:'public',ENGINEERING_OWNER_A:'owner_a',ENGINEERING_ADMIN:'admin',ENGINEERING_MEMBER:'member'};
const original=roles.flatMap(role=>JSON.parse(readFileSync(q+'/evidence/Q2/20/'+matchers[role]+'/results.json')).rows
 .map(({app,engine,width,requested,landed,reduction})=>({app,engine,width,requested,landed,role,reduction})));
// The earlier narrow invitation-route probe assumed all authenticated pages share one header.
for(const engine of ['chromium','firefox','webkit']) original.push({app:'ob',engine,width:320,requested:'/invitations',
  role:'ENGINEERING_OWNER_A',reason:'R-07 first diagnostic wrapper did not resolve'});
// The WebKit Owner A repair session authenticated, then navigation stopped before the Add row.
for(const width of [320,375,390,430]) original.push({app:'ob',engine:'webkit',width,requested:'/admin-portal/billing',
  role:'ENGINEERING_OWNER_A',repairCheck:'R-07 WebKit Add edges for the first interrupted Owner A sequence'});
const plan=new Map();
for(const row of original)plan.set([row.engine,row.app,row.role,row.width,row.requested].join(':'),row);
const results=await Promise.all(['chromium','firefox','webkit'].map(async engine=>{
 const b=await pw[engine].launch();
 const rows=[],sessions=[];
 const priorPaths=[out+'/02/'+engine+'.json',out+'/03/'+engine+'-matrix.json'];
 const failed=priorPaths.flatMap(path=>JSON.parse(readFileSync(path,'utf8')).sessions)
   .filter(s=>s.fixture&&s.app&&!s.method);
 const output=out+'/03/'+engine+'-nontext.json';
 const save=(flag='w')=>write(output,{engine,version:b.version(),rows,sessions},flag);
 save('wx');
 const p=await b.newPage({viewport:{width:600,height:300}});
 const checks=[],textChecks=[];
 try{
  for(const [kind,outline,expect] of [['border','#515151','PASS'],['border','#eeeeee','FAIL'],['focus','#154474','PASS'],['focus','#eeeeee','FAIL']]){
   await p.setContent('<body style="background:white;padding:30px"><style>input{width:188px;height:44px;border:2px solid '+outline+';background:white;margin:18px;}input:focus-visible{outline:3px solid '+outline+';outline-offset:2px}</style><input>');
   const measure=await nonText(p,p.locator('input'),kind);
   checks.push({kind,expected:expect,actual:measure.result,match:measure.result===expect,evidence:measure});
   await p.evaluate(()=>document.activeElement?.blur());
  }
   for(const [name,style,expect] of [['strong','color:#393b38;background:white','PASS'],['weak','color:white;background:#298572','FAIL'],
     ['gradient','color:white;background:linear-gradient(to right,#154474,white)','FAIL']]){
    await p.setContent('<body style="background:white;margin:0"><div style="height:840px"></div><p id="state-probe" style="margin:10px;padding:20px;font:16px Arial;'+style+'">MMMM MMMM MMMM MMMM MMMM MMMM MMMM MMMM</p></body>');
    await p.locator('#state-probe').scrollIntoViewIfNeeded();
    const m=await rasterViewport(p,'#state-probe');
    const observed=m.counts.fail?'FAIL':m.counts.notRun?'NOT RUN':'PASS';
    textChecks.push({name,expected:expect,observed,pass:observed===expect,measurement:m});
   }
 }finally{await p.close();}
 const textOK=textChecks.every(x=>x.pass);
 const controlOK=checks.every(x=>x.match);
 write(out+'/01/'+engine+'-nontext-controls.json',{engine,version:b.version(),checks,textChecks,pass:controlOK,textOK},'wx');
 const spec=[...plan.values()].filter(r=>r.engine===engine);
 for(const role of roles)for(const app of ['ob','pp']){
  const legs=spec.filter(r=>r.role===role&&r.app===app);
  let reason=!controlOK?'Independent pixel controls did not pass':role==='ENGINEERING_MEMBER'?'Active Member-only fixture absent':
    failed.some(s=>s.fixture===role&&s.app===app)?'Earlier sign-in setup failed for this browser/role/app. No retry.':null;
  if(reason){rows.push(...legs.map(r=>({...r,result:'BLOCKED',reason})));save();continue;}
  if(!legs.length)continue;
  const x=await open(b);
  try{
   if(role!=='PUBLIC')await signIn(x,app,role);
   const seen=new Set();
   for(const r of legs){
    const row={...r,controls:[]};
    try{
     await x.page.setViewportSize({width:r.width,height:900});
     const got=await nav(x.page,app,r.requested,null);
     row.actual=got;
     row.viewport=await x.page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,
       header:!!document.querySelector('header'),title:!!document.querySelector('h1,h2'),
       menu:!!document.querySelector('button[aria-label="Open menu"]')}));
     if(r.width===320&&r.requested==='/invitations'){
      row.narrowInvitationResult=got.path===r.requested&&got.status===200&&row.viewport.overflow===0?'PASS':'FAIL';
     }
     if(r.repairCheck){
       const add=x.page.getByTestId('add-store-handoff');
       await add.waitFor({state:'visible',timeout:8000});
       const button=await control(add);
       const help=await control(add.locator('..').locator('p').first());
       const within=box=>box.x>=-.5&&box.right<=r.width+.5&&box.width>0;
       row.addAndHelp={button,help,result:within(button)&&within(help)&&row.viewport.overflow===0?'PASS':'FAIL'};
     }
     const key=r.width+':'+got.path;
     if(seen.has(key)){
      row.result='DEDUPLICATED';
      row.reason='Same landed screen measured once within same fixture and width';
     }else{
      seen.add(key);
      await x.page.locator('[data-testid$="-skeleton"],[data-testid="dashboard-loading"]').first().waitFor({state:'hidden',timeout:4500});
      const elements=x.page.locator('button,input:not([type=hidden]),select,textarea,a').filter({visible:true});
      const count=await elements.count();
      for(let i=0;i<count;i++){
        const loc=elements.nth(i);
        try{
         const kind=await loc.evaluate(e=>({tag:e.tagName,type:e.type??null,disabled:e.matches(':disabled'),
           proxy:e.tagName==='INPUT'&&e.type==='radio'&&e.getBoundingClientRect().width<2&&e.labels?.length>0}));
         const part={i,...kind};
         if(['INPUT','SELECT','TEXTAREA'].includes(kind.tag)&&!['radio','checkbox'].includes(kind.type))
            part.border=await nonText(x.page,loc,'border');
         if(kind.disabled){part.focus={result:'NOT RUN',reason:'Native disabled control cannot focus'};}
         else if(kind.proxy){
            const label=loc.locator('..');
            if(await label.evaluate(el=>el.tagName==='LABEL'))part.focus=await nonText(x.page,loc,'focus',label);
            else part.focus={result:'NOT RUN',reason:'Hidden radio with no reliably identified parent label'};
         }else part.focus=await nonText(x.page,loc,'focus');
         const ready=await loc.evaluate(e=>({text:!!e.textContent.trim()||['INPUT','TEXTAREA','SELECT'].includes(e.tagName)}));
         if (textOK&&ready.text&&r.width>=375){
          const page=x.page;
          const palette=()=>loc.evaluate(el=>{const rows=[];for(let n=el;n;n=n.parentElement){const s=getComputedStyle(n);rows.push([s.color,s.backgroundColor,s.backgroundImage,s.opacity]);}return JSON.stringify(rows)});
          await page.evaluate(()=>document.activeElement?.blur());
          await page.mouse.move(0,0);
          await loc.scrollIntoViewIfNeeded();
          await page.waitForTimeout(120);
          const first=await palette();
          await loc.evaluate(e=>e.setAttribute('data-q4-contrast-control','live'));
          try{
           const box=await loc.boundingBox();
           if(box){
            await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
            await page.waitForTimeout(140);
            part.hoverText=first===(await palette())?{result:'SAME COMPUTED COLORS'}:
             await rasterViewport(page,'[data-q4-contrast-control="live"]');
           }
           await page.mouse.move(0,0);
           if(!kind.disabled){
            await page.keyboard.press('Tab');
            await loc.focus();
            await page.waitForTimeout(140);
            part.focusText=first===(await palette())?{result:'SAME COMPUTED COLORS'}:
             await rasterViewport(page,'[data-q4-contrast-control="live"]');
           }
          } finally {await loc.evaluate(e=>e.removeAttribute('data-q4-contrast-control'));}
         }
         row.controls.push(part);
        }catch(e){row.controls.push({i,result:'NOT RUN',...safeError(e)});}
      }
      row.result='OBSERVED';
     }
    }catch(e){row.result='INCOMPLETE';Object.assign(row,safeError(e));}
    rows.push(row);save();
   }
  }catch(e){rows.push(...legs.map(r=>({...r,result:'INCOMPLETE',phase:'sign-in',...safeError(e)})));}
  finally{sessions.push(await finish(x));save();}
  console.log(JSON.stringify({nontext:engine,role,app,rows:rows.length}));
 }
 await b.close();
 return {engine,rows:rows.length,controlOK};
}));
write(out+'/03/nontext-summary.json',{sourcePositions:plan.size,results},'wx');
