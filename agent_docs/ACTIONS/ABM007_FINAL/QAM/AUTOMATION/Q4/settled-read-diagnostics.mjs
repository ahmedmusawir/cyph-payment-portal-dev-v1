import {finish,nav,open,out,pw,safeError,signIn,write} from './runner.mjs';
import {rasterContrast} from './raster-contrast.mjs';

// Complete the two exclusive F22 captures first, after the real builds are restored.
await import('./f22-resume-unattempted.mjs');

// Diagnose only the first probes that counted skeletons as settled results.
const file=out+'/05/settled-read-diagnostics.json';
const browser=await pw.chromium.launch();
const rows=[],sessions=[];
function save(flag='w'){
  write(file,{engine:'chromium',version:browser.version(),rows,sessions},flag);
}
save('wx');
async function run(section,fixture,fn){
  const x=await open(browser);
  try{
    if(fixture)await signIn(x,'ob',fixture);
    rows.push({section,fixture,method:x.method,...await fn(x.page)});
    if(section==='CR-01 My Stores, settled valid cards'&&fixture==='ENGINEERING_OWNER_A'){
      const probe={section:'AC-B07/B08 Help end link',fixture,method:x.method,width:375};
      try{
        await x.page.setViewportSize({width:375,height:900});
        const selector='[data-testid=help-go-to-top-end]';
        await nav(x.page,'ob','/help',selector);
        const link=await x.page.locator(selector).evaluate(e=>({label:e.textContent.trim(),color:getComputedStyle(e).color,underline:getComputedStyle(e).textDecorationLine.includes('underline'),bodyBackground:getComputedStyle(document.body).backgroundColor}));
        const value=await rasterContrast(x.page,selector);
        rows.push({...probe,link,value,result:value.counts.fail?'FAIL':value.counts.notRun||!value.counts.pass?'INCOMPLETE':'PASS'});
      }catch(e){
        rows.push({...probe,result:'INCOMPLETE',...safeError(e)});
      }
    }
  }catch(e){
    rows.push({section,fixture,method:x.method,result:'INCOMPLETE',...safeError(e)});
  }finally{
    sessions.push(await finish(x));
    save();
  }
}
await run('AC-R05 public plan, visible after hydration',null,async page=>{
  const seen=await nav(page,'pp','/register/plan','[data-testid="plan-price"]');
  const first=await page.getByTestId('plan-price').innerText();
  const additional=await page.getByText('Includes 1 pharmacy · each additional store $49.00 / month',{exact:true}).isVisible();
  const pass=seen.status===200&&seen.path==='/register/plan'&&first.trim()==='$99.00 / month'&&additional;
  return {seen,first,additional,result:pass?'PASS':'FAIL',review:'Gate D'};
});
const storeLink='a[href^="/admin-portal/stores/"].pb-card';
let ownerRoutes=[];
for(const fixture of ['ENGINEERING_OWNER_A','ENGINEERING_ADMIN','ENGINEERING_INVITEE']){
  await run('CR-01 My Stores, settled valid cards',fixture,async page=>{
    const seen=await nav(page,'ob','/admin-portal',storeLink);
    const links=await page.locator(storeLink).evaluateAll(elements=>[...new Set(elements.map(element=>element.getAttribute('href')))]);
    if(fixture==='ENGINEERING_OWNER_A')ownerRoutes=links;
    const expected=fixture==='ENGINEERING_OWNER_A'?3:1;
    const row={seen,expected,actual:links.length,result:links.length===expected?'PASS':'FAIL'};
    if(fixture==='ENGINEERING_ADMIN'){
      const other=ownerRoutes.find(link=>!links.includes(link));
      if(!other)row.wrongStore={result:'BLOCKED',reason:'No observed Owner A out-of-scope Store'};
      else {
        await nav(page,'ob',other,null);
        const back=await page.getByTestId('back-to-stores').waitFor({state:'visible'}).then(()=>true,()=>false);
        row.wrongStore={friendlyDenial:back,result:back?'PASS':'FAIL'};
      }
    }
    return row;
  });
}
await browser.close();
