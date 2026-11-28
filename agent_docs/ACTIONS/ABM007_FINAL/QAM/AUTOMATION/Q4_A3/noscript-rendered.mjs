import {finish,open,out,pw,safeError,signIn,sites,write} from './runner.mjs';

// The first no-script run timed out in the Playwright DOM/JS procedure.
// Use browser protocol DOM, layout and real mouse input with page execution disabled.
const browser=await pw.chromium.launch();
const x=await open(browser);
const result={role:'ENGINEERING_OWNER_A',engine:'chromium',version:browser.version(),observations:[]};
try{
  await signIn(x,'ob',result.role);
  const cdp=await x.c.newCDPSession(x.page);
  await cdp.send('DOM.enable');
  await cdp.send('Page.enable');
  const res=await x.page.goto(sites.ob+'/help',{waitUntil:'load'});
  await x.page.getByTestId('help-go-to-top').last().waitFor({state:'visible'});
  await cdp.send('Emulation.setScriptExecutionDisabled',{value:true});
  try{
    result.stage='native navigation on already-rendered Help with page scripts switched off';
    result.status=res.status();
    const {root}=await cdp.send('DOM.getDocument');
    const {nodeIds}=await cdp.send('DOM.querySelectorAll',{nodeId:root.nodeId,selector:'a[data-testid="help-go-to-top"]'});
    result.links=nodeIds.length;
    if(nodeIds.length!==13)throw Error('No 13 links in scripts-disabled document');
    const nodeId=nodeIds[12];
    result.stage='scroll last link and capture bounds';
    await cdp.send('DOM.scrollIntoViewIfNeeded',{nodeId});
    const {model}=await cdp.send('DOM.getBoxModel',{nodeId});
    const metrics=async()=>(await cdp.send('Page.getLayoutMetrics')).cssVisualViewport;
    const initial=await metrics();
    result.startY=initial.pageY;
    const xMouse=model.border.reduce((sum,n,i)=>sum+(i%2===0?n:0),0)/4;
    const yMouse=model.border.reduce((sum,n,i)=>sum+(i%2===1?n:0),0)/4;
    result.clickPoint={x:xMouse,y:yMouse};
    if(yMouse<0||yMouse>=initial.clientHeight)throw Error('Outside viewport');
    const header=(await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:'header'})).nodeId;
    result.stage='native mouse and timeline';
    for(const type of ['mousePressed','mouseReleased']){
      await cdp.send('Input.dispatchMouseEvent',{type,x:xMouse,y:yMouse,button:'left',clickCount:1});
    }
    const start=performance.now();
    for(const ms of [0,100,300,800,2000]){
      if(ms)await new Promise(r=>setTimeout(r,Math.max(0,start+ms-performance.now())));
      const v=await metrics();
      const {model:h}=await cdp.send('DOM.getBoxModel',{nodeId:header});
      result.observations.push({ms,y:v.pageY,headerVisible:h.border[1]>=0&&h.border[5]<=v.clientHeight});
    }
    result.result=result.status===200&&result.startY>0&&result.observations.every(o=>o.y===0&&o.headerVisible)?'PASS':'FAIL';
    result.stage='cold reload with scripts still disabled, read layout evidence only';
    await x.page.goto(sites.ob+'/help',{waitUntil:'load'});
    const doc=(await cdp.send('DOM.getDocument')).root;
    const cold=(await cdp.send('DOM.querySelectorAll',{nodeId:doc.nodeId,selector:'a[data-testid="help-go-to-top"]'})).nodeIds;
    result.coldLoad={links:cold.length};
    if(cold.length){
      try{await cdp.send('DOM.getBoxModel',{nodeId:cold[cold.length-1]});result.coldLoad.lastHasLayoutBox=true;}
      catch{result.coldLoad.lastHasLayoutBox=false;}
      const hidden=await cdp.send('DOM.querySelectorAll',{nodeId:doc.nodeId,selector:'[hidden] a[data-testid="help-go-to-top"]'});
      result.coldLoad.linksUnderHiddenAncestor=hidden.nodeIds.length;
    }
  }finally{await cdp.send('Emulation.setScriptExecutionDisabled',{value:false});await cdp.detach();}
}catch(err){Object.assign(result,safeError(err),{result:'INCOMPLETE'});}
finally{result.session=await finish(x);await browser.close();write(out+'/chromium-no-script-rendered.json',result,'wx');}
