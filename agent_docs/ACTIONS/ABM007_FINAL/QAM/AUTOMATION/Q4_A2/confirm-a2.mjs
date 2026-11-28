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
  if(recovery)await page.goto('about:blank');
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
  for(const i of selected){
    await record('A2-1 mouse returns to top',{...scope,article:i+1},async()=>{
      const a=page.locator(top).nth(i);
      await center(a);
      const pre=await page.evaluate(()=>scrollY);
      await a.click();
      await tick(page);
      const after=await topState(page);
      return {from:pre,after,result:pass(pre>0&&topOK(after))};
    });
  }
  if(recovery)await help(page);
  await page.mouse.move(0,0);
  await page.keyboard.press('Tab');
  for(let i=0;i<13;i++){
    await record('A2-1 article focus / Enter',{...scope,article:i+1,enterExpected:selected.includes(i)},async()=>{
      const a=page.locator(top).nth(i);
      const steps=await tabTo(page,a);
      await center(a);
      await tick(page);
      const outline=await focusOutline(page,a);
      let activation;
      if(selected.includes(i)){
        const from=await page.evaluate(()=>scrollY);
        await page.keyboard.press('Enter');
        await tick(page);
        activation={from,...await topState(page)};
      }
      return {steps,outline,activation,result:pass(outline.result==='PASS'&&(!activation||activation.from>0&&topOK(activation)))};
    });
  }
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
async function focusControls(page,role){
  const scope={role,width:375,height:900};
  await page.setViewportSize({width:375,height:900});
  await record('A2-2 OwedBook Billing Add control',scope,async()=>{
    await nav(page,'ob','/admin-portal/billing','[data-testid="add-store-handoff"]');
    const a=page.getByTestId('add-store-handoff');
    const steps=await tabTo(page,a);
    await center(a);await tick(page);
    const outline=await focusOutline(page,a);
    return {steps,outline,result:outline.result};
  });
  await record('A2-2 Profile password field and reveal',scope,async()=>{
    await nav(page,'ob','/profile','input[placeholder="Minimum 8 characters"]');
    const field=page.getByPlaceholder('Minimum 8 characters');
    const eye=page.getByRole('button',{name:'Show password',exact:true}).first();
    const results=[];
    for(const [name,a] of [['New Password',field],['Show password',eye]]){
      const steps=await tabTo(page,a);
      await center(a);await tick(page);
      results.push({name,steps,outline:await focusOutline(page,a)});
    }
    return {results,result:pass(results.every(r=>r.outline.result==='PASS'))};
  });
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
    const doc=readFileSync('/tmp/abm007-final-cody-q4-a2/pp/agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/E2/CHANGED_LABELS.md','utf8').split('Add-on A2')[1];
    const labels=await structure(page);
    const matching=!!doc&&doc.includes('end of each of the 13 articles')&&
      /contents menu[^\n]*removed \(A2-1\)/.test(doc)&&/end of the Help text[^\n]*removed \(A2-1\)/.test(doc)&&labels.result==='PASS';
    return {forbidden,matching,result:pass(!forbidden&&matching)};
  });
  for(const [label,path,ready] of [['open My Stores','/admin-portal','h1'],['open Billing','/admin-portal/billing',
    role===admin?'[data-testid="billing-owner-only"]':'[data-testid="open-billing-portal"]']]){
    await record('Help app links by role',{...scope,label},async()=>{
      await help(page);
      const link=page.getByRole('link',{name:label,exact:true});
      const href=await link.getAttribute('href');
      await link.click();
      await page.waitForURL(u=>u.origin===sites.ob&&u.pathname===path);
      await page.locator(ready).first().waitFor();
      return {href,path: new URL(page.url()).pathname,loadedRoleSurface:true,result:pass(href===path)};
    });
  }
}
async function storeInvitePath(page){
  const selector='a[href^="/admin-portal/stores/"].pb-card';
  await nav(page,'ob','/admin-portal',selector);
  const href=await page.locator(selector).first().getAttribute('href');
  expect(/^\/admin-portal\/stores\/[^/]+$/.test(href),'No allowed store fixture for the invite page');
  return href+'/invite';
}
async function settled(page,route){
  if(route==='/invitations'){
    const response=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/invitations/mine',{timeout:12000});
    const [pageResult,read]=await Promise.all([nav(page,'ob',route,'#inv-title'),response]);
    expect(pageResult.path===route&&read.ok(),'Invitations did not load a successful read');
    await page.getByText('Loading…',{exact:true}).waitFor({state:'hidden'});
    await page.locator('section[aria-labelledby="inv-title"] > :is(p,ul)').first().waitFor({state:'visible'});
  }else{
    const response=page.waitForResponse(r=>/^\/api\/stores\/[^/]+\/invitations$/.test(new URL(r.url()).pathname)&&r.request().method()==='GET',{timeout:12000});
    const [pageResult,read]=await Promise.all([nav(page,'ob',route,'#invite-email'),response]);
    expect(pageResult.path===route&&read.ok(),'Invite page did not load a successful invitation-list read');
    await page.getByText('Send an invite to add someone to this store.',{exact:true}).waitFor({state:'hidden'});
    await page.locator('[aria-labelledby="members-title"] ul > li').first().waitFor({state:'visible'});
  }
  await page.evaluate(()=>document.fonts.ready);
  await tick(page);
}
async function remeasure(page,role){
  const invite=await storeInvitePath(page);
  const cases=role===owner?[[375,'/invitations'],[1440,'/invitations'],[375,invite],[1440,invite]]:[[1440,invite]];
  for(const [width,route] of cases){
    await record('Instrument once after settled content',{role,width,height:900,route:route==='/invitations'?route:'/admin-portal/stores/[store]/invite',
      area:role===owner?'main text':'header primary navigation'},async()=>{
      await page.setViewportSize({width,height:900});
      await settled(page,route);
      const pixel=role===owner?await rasterContrast(page,route==='/invitations'?'main':'body'):await rasterViewport(page,'header nav[aria-label="Primary"]');
      return {pixel,result:pixel.counts.fail?'FAIL':pixel.counts.notRun||!pixel.counts.pass?'PARTIAL':'PASS'};
    });
  }
}
async function portalPill(){
  const x=await open(browser,{onePortalRead:true});
  try{
    await signIn(x,'pp',admin);
    await record('Account & Billing round element',{role:admin,width:1440,height:900},async()=>{
      expect(new URL(x.page.url()).pathname==='/dashboard','Store admin sign-in did not land on the single allowed dashboard');
      const denied=x.page.getByTestId('denied-view');
      await denied.waitFor();
      const parts=await x.page.locator('header span.rounded-full.pb-card, nav span.rounded-full.pb-card').evaluateAll(els=>[...new Set(els)].map(e=>{
        const r=e.getBoundingClientRect(),s=getComputedStyle(e);
        return {tag:e.tagName,ariaHidden:e.getAttribute('aria-hidden'),className:e.className,
          measuredWidth:r.width,measuredHeight:r.height,radius:s.borderTopLeftRadius,shadow:s.boxShadow,
          shown:r.width>0&&r.height>0,initialsOnly:/^[A-Z]{1,2}$/.test(e.textContent.trim())};
      }));
      const shown=parts.filter(p=>p.shown&&p.initialsOnly&&p.shadow!=='none');
      return {element:'Header account avatar, Initials in src/components/portal/PageHeader.tsx:60–72, used by Shell.tsx',
        dashboardDocuments:x.log.loads.length,detected:shown,allMatched:parts,result:pass(shown.length===1&&x.log.loads.length===1)};
    });
  }catch(e){await record('Account & Billing single setup no retry',{role:admin},async()=>({result:'INCOMPLETE',...safeError(e)}));}
  finally{sessions.push(await finish(x));save();}
}

try{
  if(recovery){
    const results=await (await import('./focus.mjs')).calibrateFocus(browser);
    write(out+'/'+engine+'-focus-diagnostic-controls.json',results,'wx');
    expect(results.every(r=>r.pass),'Corrected shadow-ring positive control did not pass');
  }
  for(const role of recovery&&engine==='chromium'?[owner]:[owner,admin]){
    const scope={role};
    const x=await open(browser);
    try{
      if(recovery&&previous.some(r=>r.role===role&&r.section==='OwedBook fixture setup no retry')){
        await record('Diagnostic session withheld',scope,async()=>({result:'BLOCKED',reason:'Initial fixture sign-in failed. No sign-in retry.'}));
        continue;
      }
      await signIn(x,'ob',role);
      for(const [width,height] of widths){
        const view={role,width,height};
        if(recovery){
          const count=previous.filter(r=>r.role===role&&r.width===width&&r.result==='PASS'&&
            ['A2-1 structure and dimensions','A2-1 mouse returns to top','A2-1 article focus / Enter','A2-1 F36 rendered contrast'].includes(r.section)).length;
          if(count===17+([375,1440].includes(width)?3:0))continue;
        }
        await x.page.setViewportSize({width,height});
        try{await help(x.page);await testArticleLinks(x.page,view);}
        catch(e){await record('A2-1 width setup',view,async()=>({result:'INCOMPLETE',...safeError(e)}));}
      }
      for(const [width,height] of widths.slice(-2)){
        if(recovery&&previous.filter(r=>r.role===role&&r.width===width&&r.section==='A2-2 menu keyboard outline'&&r.result==='PASS').length===13)continue;
        await x.page.setViewportSize({width,height});
        try{await menuOutlines(x.page,{role,width,height});}
        catch(e){await record('A2-2 menu setup',{role,width,height},async()=>({result:'INCOMPLETE',...safeError(e)}));}
      }
      if(role===owner)await focusControls(x.page,role);
      if((role===owner&&engine!=='webkit')||(role===admin&&engine==='firefox')){
        try{await remeasure(x.page,role);}
        catch(e){await record('Instrument setup',scope,async()=>({result:'INCOMPLETE',...safeError(e)}));}
      }
      try{await quickHelp(x.page,role);}
      catch(e){await record('Help regression setup',scope,async()=>({result:'INCOMPLETE',...safeError(e)}));}
    }catch(e){await record('OwedBook fixture setup no retry',scope,async()=>({result:'INCOMPLETE',...safeError(e)}));}
    finally{sessions.push(await finish(x));save();}
    console.log(engine,role,rows.length,'rows saved');
  }
  if(engine==='chromium'&&!recovery)await portalPill();
}finally{await browser.close();}
