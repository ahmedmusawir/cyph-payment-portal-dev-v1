import {readFileSync} from 'node:fs';
import {center,focusOutline,tabTo} from './focus.mjs';
import {expect,finish,nav,open,out,pw,safeError,signIn,write} from './runner.mjs';

const old=JSON.parse(readFileSync(out+'/firefox-diagnostic-results.json'));
const gaps=old.rows.filter(r=>r.section==='A2-1 article focus / Enter'&&r.article===1&&r.activation&&
  r.activation.from>0&&r.activation.y!==0&&r.outline.result==='PASS');
expect(gaps.every(r=>r.role==='ENGINEERING_OWNER_A'||r.role==='ENGINEERING_ADMIN'),'Unexpected role');
expect(gaps.length<=4,'Firefox settled observation scope exceeds four positions');
const browser=await pw.firefox.launch();
const rows=[],sessions=[];
const path=out+'/firefox-enter-settled.json';
const save=flag=>write(path,{engine:'firefox',version:browser.version(),rows,sessions,
  reason:'Investigate delayed browser state for the article-1 desktop Enter observations only. First and diagnostic outcomes retained.'},flag);
save('wx');
try{
  for(const role of [...new Set(gaps.map(row=>row.role))]){
    const x=await open(browser);
    try{
      await signIn(x,'ob',role);
      for(const from of gaps.filter(r=>r.role===role)){
        const row={role,width:from.width,height:from.height,article:1,firstDiagnosticAt:from.at};
        try{
          const page=x.page;
          await page.goto('about:blank');
          await page.setViewportSize({width:from.width,height:from.height});
          await nav(page,'ob','/help','[data-testid="help-go-to-top"]');
          const a=page.getByTestId('help-go-to-top').first();
          row.tabSteps=await tabTo(page,a);
          await center(a);
          row.outline=await focusOutline(page,a);
          row.before=await page.evaluate(()=>({y:scrollY,hash:location.hash}));
          await page.keyboard.press('Enter');
          row.timeline=[];
          for(const delay of [0,100,300,800]){
            if(delay)await page.waitForTimeout(delay);
            row.timeline.push({delayAfterPriorSample:delay,...await page.evaluate(()=>{
              const h=document.querySelector('header')?.getBoundingClientRect();
              return {y:scrollY,hash:location.hash,headerInView:!!h&&h.top>=0&&h.bottom<=innerHeight};
            })});
          }
          const end=row.timeline.at(-1);
          row.result=row.before.y>0&&end.y===0&&end.hash==='#top'&&end.headerInView&&row.outline.result==='PASS'?'PASS':'FAIL';
        }catch(e){Object.assign(row,safeError(e),{result:'INCOMPLETE'});}
        rows.push(row);save();
      }
    }catch(e){rows.push({role,result:'INCOMPLETE',scope:'fixture setup no retry',...safeError(e)});}
    finally{sessions.push(await finish(x));save();}
  }
}finally{await browser.close();}
