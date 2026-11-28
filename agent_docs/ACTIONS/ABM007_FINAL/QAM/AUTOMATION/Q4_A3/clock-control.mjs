import {out,pw,write} from './runner.mjs';
const browser=await pw.firefox.launch();
const records=[];
try{
 const page=await browser.newPage({viewport:{width:1024,height:600}});
 for(const [name,target] of [['native','top'],['missing','missing-anchor']]){
  await page.setContent('<header>Header</header><h1 tabindex="-1" id="top">Help</h1><div style="height:1200px"></div><a href="#'+target+'">Go to the Top</a>');
  const link=page.getByRole('link');
  await page.keyboard.press('Tab');
  await link.evaluate(e=>e.scrollIntoView({block:'center'}));
  await link.evaluate(a=>{
   window.__dispatch=null;
   a.addEventListener('click',()=>setTimeout(()=>window.__dispatch={y:scrollY,target:document.activeElement.id==='top'},0),{once:true});
  });
  const from=await page.evaluate(()=>scrollY);
  await page.keyboard.press('Enter');
  const post=await page.evaluate(()=>({y:scrollY,target:document.activeElement.id==='top'}));
  await page.waitForTimeout(100);
  const later=await page.evaluate(()=>({y:scrollY,target:document.activeElement.id==='top',clickTimer:window.__dispatch}));
  records.push({name,from,post,later});
 }
}finally{await browser.close();}
write(out+'/firefox-clock-controls.json',{records,version:browser.version()},'wx');
