import {calibrate,pw,out,write} from './runner.mjs';
import {calibrateFocus} from './focus.mjs';
import {rasterViewport} from './raster-viewport.mjs';

const engine=process.argv[2];
if(!['chromium','firefox','webkit'].includes(engine))throw Error('Explicit engine required');
const browser=await pw[engine].launch();
try{
  const base=await calibrate(browser,engine);
  const focus=await calibrateFocus(browser);
  const page=await browser.newPage({viewport:{width:640,height:240}});
  const text=[];
  for(const [name,background,expected] of [['white-card','#ffffff','PASS'],['q4-ice','#eaf3fa','FAIL']]){
    await page.setContent(`<main style="padding:35px;background:${background}"><a href="#top" style="color:#288472;font:13px Arial;text-decoration:underline">Go to the Top</a></main>`);
    const sample=await rasterViewport(page,'main a');
    const result=sample.counts.fail?'FAIL':sample.counts.pass&&!sample.counts.notRun?'PASS':'NOT RUN';
    text.push({name,expected,result,sample,pass:result===expected});
  }
  const passed=base.pixelReady&&base.dimensionsReady&&[...focus,...text].every(r=>r.pass);
  write(out+'/'+engine+'-a2-controls.json',{engine,version:browser.version(),focus,text,passed},'wx');
  console.log(engine,'controls',passed?'PASS':'FAIL');
  if(!passed)process.exitCode=1;
}finally{await browser.close();}
