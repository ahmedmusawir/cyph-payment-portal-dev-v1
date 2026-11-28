import {readFileSync} from 'node:fs';
import {center,focusOutline,tabTo} from './focus.mjs';
import {rasterViewport} from './raster-viewport.mjs';
import {rasterContrast} from './raster-contrast.mjs';
import {expect,finish,nav,open,out,pw,safeError,signIn,sites,write} from './runner.mjs';

const engine=process.argv[2];
expect(['chromium','firefox','webkit'].includes(engine),'Explicit engine required');
const controls=JSON.parse(readFileSync(out+'/'+engine+'-a2-controls.json'));
expect(controls.passed,'A2 instrument controls did not pass');
const browser=await pw[engine].launch();
const recovery=process.argv.includes('--diagnostic-missing-only');
const previous=recovery?JSON.parse(readFileSync(out+'/'+engine+'-results.json')).rows:[];
const owner='ENGINEERING_OWNER_A';
const admin='ENGINEERING_ADMIN';
const menu='nav[aria-label="On this page"]';
const top='[data-testid="help-go-to-top"]';
const widths=[[320,900],[375,900],[768,900],[1024,600],[1440,900]];
const selected=[0,6,12];
const file=out+'/'+engine+(recovery?'-diagnostic-results.json':'-results.json');
const rows=[],sessions=[];
const save=(flag='w')=>write(file,{engine,version:browser.version(),rows,sessions},flag);
save('wx');
const tick=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
const completed=(section,scope)=>previous.find(row=>row.section===section&&
  Object.entries(scope).every(([k,v])=>row[k]===v)&&
  (row.result==='PASS'||section==='Instrument once after settled content'&&row.pixel?.rows.length));
async function record(section,scope,work){
  const first=completed(section,scope);
  if(first&&section!=='A2-2 menu geometry')return first;
  const row={section,...scope,at:new Date().toISOString()};
  try{Object.assign(row,await work());}
  catch(e){Object.assign(row,safeError(e),{result:'INCOMPLETE'});}
  rows.push(row);save();
  return row;
}
const pass=p=>p?'PASS':'FAIL';
const topState=page=>page.evaluate(()=>{
  const masthead=document.querySelector('.pb-masthead');
  const h=document.querySelector('header');
  const a=h?.getBoundingClientRect(),b=masthead?.getBoundingClientRect();
  return {y:window.scrollY,headerInView:!!a&&a.top>=0&&a.bottom<=innerHeight,
    helpTitleInView:!!b&&b.top>=0&&b.top<innerHeight};
});
const topOK=row=>row.y===0&&row.headerInView&&row.helpTitleInView;
async function help(page){
  await page.goto('about:blank');
  const seen=await nav(page,'ob','/help',menu);
  expect(seen.path==='/help'&&seen.status===200,'Help did not resolve in the fixture session');
}
async function structure(page){
  const s=await page.evaluate(({menu,top})=>{
    const links=[...document.querySelectorAll(top)];
    const articles=[...document.querySelectorAll('main section[id][aria-labelledby]')].filter(n=>n.querySelector(':scope > h2'));
    const nav=document.querySelector(menu);
    return {articles:articles.length,count:links.length,menuLinks:[...nav.querySelectorAll('a')].map(a=>a.getAttribute('href')),
      ids:articles.map(a=>a.id),allTopByExactText:[...document.querySelectorAll('a')].filter(a=>a.textContent.trim()==='Go to the Top').length,
      topInMenu:nav.querySelectorAll('a[href="#top"]').length,
      lastInside:articles.map(a=>{
        const last=a.lastElementChild,link=a.querySelectorAll(top);
        return link.length===1&&last.contains(link[0])&&last.textContent.trim()==='Go to the Top';
      }),
      heights:links.map(a=>a.getBoundingClientRect().height),
      overflow:document.documentElement.scrollWidth-innerWidth};
  },{menu,top});
  return {...s,result:pass(s.articles===13&&s.count===13&&s.allTopByExactText===13&&s.topInMenu===0&&s.menuLinks.length===13&&s.overflow===0&&
    s.lastInside.every(Boolean)&&s.heights.every(h=>h>=44)&&s.menuLinks.every((h,i)=>h==='#'+s.ids[i]))};
}

async function testArticleLinks(page,scope){
  await record('A2-1 structure and dimensions',scope,()=>structure(page));
  if([375,1440].includes(scope.width)){
    for(const i of selected){
      await record('A2-1 F36 rendered contrast',{...scope,article:i+1},async()=>{
        const a=page.locator(top).nth(i);
        await center(a);await tick(page);
        const style=await a.evaluate(e=>({color:getComputedStyle(e).color,underline:getComputedStyle(e).textDecorationLine.includes('underline'),
          articleSurface:getComputedStyle(e.closest('section')).backgroundColor}));
        // Each link is a first child of a different paragraph. Calibrate and measure the named article only.
        const id=await a.evaluate(e=>e.closest('section').id);
        const scoped=await rasterViewport(page,'section#'+id+' '+top);
        const white=scoped.rows.length>0&&scoped.rows.every(r=>Object.keys(r.paintedBackgroundRgbCounts??{}).every(k=>k==='255,255,255'));
        const all=scoped.counts.pass>0&&!scoped.counts.fail&&!scoped.counts.notRun&&scoped.rows.every(r=>r.worstRatio>=4.5);
        return {style,articleId:id,pixels:scoped,result:pass(white&&all&&style.color==='rgb(40, 132, 114)'&&style.underline)};
      });
    }
  }
}
async function menuOutlines(page,scope){
  await help(page);
  const m=page.locator(menu);
  const newRow=await record('A2-2 menu geometry',scope,async()=>{
    await page.evaluate(()=>scrollTo(0,1200));
    await tick(page);
    const box=await m.evaluate(e=>({height:e.clientHeight,content:e.scrollHeight,start:e.scrollTop,
      stick:e.getBoundingClientRect().top,scrollPadding:getComputedStyle(e).scrollPaddingTop}));
    return {box,result:pass(scope.width!==1024||box.content>box.height)};
  });
  const links=m.locator('a');
  for(let i=0;i<13;i++){
    await record('A2-2 menu keyboard outline',{...scope,article:i+1},async()=>{
      const a=links.nth(i);
      if(i===0){
        await tabTo(page,a,40);
        await page.evaluate(()=>scrollTo(0,1200));
      } else if(recovery){
        await tabTo(page,a,40);
      } else {
        await page.keyboard.press('Tab');
      }
      await tick(page);
      const active=await a.evaluate(e=>e===document.activeElement);
      const now=await m.evaluate(e=>({scrollTop:e.scrollTop,pageY:scrollY}));
      const outline=await focusOutline(page,a);
      return {active,...now,outline,result:pass(active&&outline.result==='PASS'&&(i!==12||scope.width!==1024||now.scrollTop>(newRow.box?.start??0)))};
    });
  }
}
async function quickHelp(page,role){
  const scope={role,width:1440,height:900};
  await page.setViewportSize({width:1440,height:900});
  await help(page);
  await record('Help regression menu destinations',scope,async()=>{
    const links=page.locator(menu+' a');
    const candidates=[];
    for(let i=0;i<13;i++){
      const a=links.nth(i);
      const href=await a.getAttribute('href');
      await a.click();await tick(page);
      const state=await page.evaluate(key=>{
        const n=document.getElementById(key.slice(1));
        const r=n?.getBoundingClientRect();
        return {hash:location.hash,articleInView:!!r&&r.top<innerHeight&&r.bottom>0};
      },href);
      candidates.push({href,...state,result:pass(state.hash===href&&state.articleInView)});
    }
    return {links:candidates,result:pass(candidates.every(r=>r.result==='PASS'))};
  });
  await record('Help forbidden terms and changed labels',scope,async()=>{
    const helpText=await page.locator('main').innerText();
    const forbidden=/\b(?:4242[ -]?4242[ -]?4242[ -]?4242|QA sandbox|WEBHOOK_SECRET|engineering_owner)\b/i.test(helpText);
    const doc=readFileSync('/tmp/abm007-final-cody-q4-a3/pp/agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/E2/CHANGED_LABELS.md','utf8').split('Add-on A2')[1];
    const labels=await structure(page);
    const matching=!!doc&&doc.includes('end of each of the 13 articles')&&
      /contents menu[^\n]*removed \(A2-1\)/.test(doc)&&/end of the Help text[^\n]*removed \(A2-1\)/.test(doc)&&labels.result==='PASS';
    return {forbidden,matching,result:pass(!forbidden&&matching)};
  });
}

async function exercise(page,scope,index,method,alignment='center'){
  const link=page.locator(top).nth(index);
  if(method==='Enter'){
    await tabTo(page,link);
  }
  await link.evaluate((a,align)=>a.scrollIntoView({block:align,inline:'nearest'}),alignment);
  await tick(page);
  const outline=method==='Enter'?await focusOutline(page,link):null;
  const before=await page.evaluate(()=>scrollY);
  // Anchor native default action follows the click event for pointer and Enter.
  // Read from the next task, then against absolute elapsed time from activation.
  await link.evaluate(a=>{
    window.__qaTrace=new Promise(resolve=>a.addEventListener('click',()=>{
      const t=performance.now(), samples=[];
      for(const ms of [0,100,300,800,2000])setTimeout(()=>{
        const title=document.querySelector('h1#top'),h=document.querySelector('header');
        const inside=n=>{const r=n.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;};
        const css=getComputedStyle(title);
        samples.push({ms,elapsed:Math.round(performance.now()-t),y:scrollY,header:inside(h),
          titleVisible:inside(title),focusOnTitle:document.activeElement===title,
          title:title.textContent.trim(),tabIndex:title.tabIndex,
          focusVisible:title.matches(':focus-visible'),outline:css.outline,offset:css.outlineOffset});
        if(ms===2000)resolve(samples);
      },ms);
    },{once:true}));
  });
  if(method==='Enter')await page.keyboard.press('Enter');else await link.click();
  const timeline=await page.evaluate(()=>Promise.race([window.__qaTrace,new Promise(r=>setTimeout(()=>r([]),3500))]));
  return {before,outline,timeline,result:pass(timeline.length===5&&timeline.every(v=>v.y===0&&v.header&&v.titleVisible&&v.focusOnTitle&&v.title==='Help'&&v.tabIndex===-1)&&(!outline||outline.result==='PASS'))};
}

try{
 for(const role of [owner,admin]){
  const x=await open(browser);
  try{
   await signIn(x,'ob',role);
   for(const [width,height] of [[375,900],[1024,600],[1440,900]]){
    const scope={role,width,height};
    await x.page.setViewportSize({width,height});
    await help(x.page);
    await testArticleLinks(x.page,scope);
    for(const method of ['mouse','Enter']){
     await help(x.page);
     for(let i=0;i<13;i++){
      await record('Article activation',{...scope,article:i+1,method},()=>exercise(x.page,scope,i,method));
     }
     for(const alignment of ['start','end']){
      await record('Article 1 distance',{...scope,method,alignment},()=>exercise(x.page,scope,0,method,alignment));
     }
    }
    if(width===1024)await menuOutlines(x.page,scope);
   }
   await quickHelp(x.page,role);
   if(engine==='chromium'&&role===owner){
    await record('Scripts disabled native return',{role},async()=>{
      const page=x.page;
      const cdp=await x.c.newCDPSession(page);
      await cdp.send('Emulation.setScriptExecutionDisabled',{value:true});
      try{
        const res=await page.goto(sites.ob+'/help',{waitUntil:'load'});
        const a=page.locator(top).last();
        await center(a);
        const from=await page.evaluate(()=>scrollY);
        await a.click();
        await page.waitForTimeout(2000);
        const after=await topState(page);
        return {status:res.status(),from,after,result:pass(res.ok()&&from>0&&topOK(after))};
      }finally{await cdp.send('Emulation.setScriptExecutionDisabled',{value:false});await cdp.detach();}
    });
   }
  }catch(e){rows.push({role,result:'INCOMPLETE',...safeError(e)});}
  finally{sessions.push(await finish(x));save();}
 }
}finally{await browser.close();}
