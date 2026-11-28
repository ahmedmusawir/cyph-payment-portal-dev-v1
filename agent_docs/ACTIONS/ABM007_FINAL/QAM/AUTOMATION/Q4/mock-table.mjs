import {finish,nav,open,out,pw,safeError,signIn,write} from './runner.mjs';
const browser=await pw.chromium.launch();
const x=await open(browser);
const rows=[];
let session;
try{
 await signIn(x,'ob','ENGINEERING_OWNER_A');
 await nav(x.page,'ob','/owedbook','table');
 for(const width of [1440,375]){
  try{
   await x.page.setViewportSize({width,height:900});
   await x.page.getByTestId(width===375?'datatable-mobile':'datatable-desktop').waitFor({state:'visible'});
   const r=await x.page.evaluate(()=>{
    const table=document.querySelector('table');
    const width=table?.getBoundingClientRect().width??0, containerWidth=table?.parentElement.getBoundingClientRect().width??0;
    const stacked=[...document.querySelectorAll('[role=row],article,li')].filter(x=>x.getClientRects().length>0 && x.querySelector('dt,dd')).length;
    const responsiveCards=[...document.querySelectorAll('[data-testid="datatable-mobile"] > .pb-card')].filter(x=>x.getClientRects().length>0&&x.querySelectorAll('.grid > .contents').length>1).length;
    return {width,containerWidth,tableVisible:width>0,rows:table?.querySelectorAll('tbody tr').length??0,stacked,responsiveCards,
     overflow:document.documentElement.scrollWidth-innerWidth};
   });
   const pass=width===1440?r.rows>0&&r.width/r.containerWidth>.97&&r.overflow===0:!r.tableVisible&&(r.stacked+r.responsiveCards)>0&&r.overflow===0;
   rows.push({width,...r,result:pass?'PASS':'FAIL'});
  }catch(e){rows.push({width,result:'INCOMPLETE',...safeError(e)});}
 }
}catch(e){rows.push({result:'INCOMPLETE',stage:x.method?'content':'sign-in',...safeError(e)});}
finally{session=await finish(x);await browser.close();}
write(out+'/05/mock-table.json',{engine:'chromium',version:browser.version(),scope:'Same bound candidate, mock OwedBook only. Expected table geometry and responsive stacked rows.',rows,session},'wx');
console.log(JSON.stringify(rows));
