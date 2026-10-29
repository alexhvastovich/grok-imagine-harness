import fs from 'node:fs/promises';
import path from 'node:path';

// Used inside the documented browser-client session; no second browser/login.
export function safeUrl(value) {
  try {
    const u = new URL(value);
    if (!['https:', 'http:'].includes(u.protocol)) return u.protocol;
    return u.origin + u.pathname;
  } catch { return ''; }
}
export function shape(value, depth = 0) {
  if (depth > 7) return 'depth-limit';
  if (value === null) return 'null';
  if (Array.isArray(value)) return {type:'array', length:value.length, items:value.length ? shape(value[0], depth+1) : null};
  if (typeof value !== 'object') return typeof value;
  return Object.fromEntries(Object.entries(value).filter(([k]) => !/token|cookie|auth|password|secret|signature/i.test(k)).slice(0,100).map(([k,v])=>[k,shape(v,depth+1)]));
}
export function redactText(text) {
  return text.replace(/https?:\/\/[^\s<>"\)]+/g, u => safeUrl(u));
}

// Explicit fallback for a session whose passive CDP recorder is unavailable.
// Uses the same connected tab; no new automation connection or API replay.
export async function createUIHarness({tab, outputDir, reason}) {
  if (!reason) throw new Error('Record why passive network evidence is unavailable');
  await fs.mkdir(outputDir,{recursive:true});
  const captures=await fs.readFile(path.join(outputDir,'captures.json'),'utf8').then(JSON.parse).catch(()=>[]);
  async function capture(id,note='') {
    if (!/^[a-z0-9-]+$/.test(id)) throw new Error('Capture ID must be lowercase letters, digits and hyphens');
    const snapshot=redactText(await tab.playwright.domSnapshot());
    const elements=await tab.playwright.evaluate(()=>[...document.querySelectorAll('button,a,input,textarea,select,[role],[contenteditable],img,video,[data-testid]')].map(el=>{
      const r=el.getBoundingClientRect();
      return {tag:el.tagName.toLowerCase(),role:el.getAttribute('role'),name:el.getAttribute('aria-label'),testId:el.getAttribute('data-testid'),text:(el.innerText||'').slice(0,160),disabled:el.hasAttribute('disabled'),pressed:el.getAttribute('aria-pressed'),valueNow:el.getAttribute('aria-valuenow'),valueMin:el.getAttribute('aria-valuemin'),valueMax:el.getAttribute('aria-valuemax'),valueText:el.getAttribute('aria-valuetext'),src:el.getAttribute('src'),href:el.getAttribute('href'),visible:r.width>0&&r.height>0,box:{x:r.x,y:r.y,width:r.width,height:r.height}};
    }));
    for(const e of elements){if(e.src)e.src=safeUrl(e.src);if(e.href?.startsWith('http'))e.href=safeUrl(e.href);e.text=redactText(e.text);}
    await fs.writeFile(path.join(outputDir,`${id}.dom.txt`),snapshot);
    await fs.writeFile(path.join(outputDir,`${id}.elements.json`),JSON.stringify(elements,null,2));
    let screenshotError=null;
    try {await fs.writeFile(path.join(outputDir,`${id}.png`),await tab.getScreenshot({emit:false}));}
    catch(e){screenshotError=String(e.message);}
    await fs.writeFile(path.join(outputDir,`${id}.network.json`),JSON.stringify({available:false,reason,rows:[],truncated:false},null,2));
    const entry={id,note,url:safeUrl(await tab.url()),capturedAt:new Date().toISOString(),screenshotError,networkCount:null,networkAvailable:false,truncated:false,verification:'UI observed; network unavailable'};
    captures.push(entry);
    await fs.writeFile(path.join(outputDir,'captures.json'),JSON.stringify(captures,null,2));
    return {entry,tail:snapshot.slice(-5000)};
  }
  return {capture};
}
export async function createHarness({tab, cdp, outputDir}) {
  await fs.mkdir(outputDir,{recursive:true});
  await cdp.send('Network.enable');
  const methods = ['Network.requestWillBeSent','Network.responseReceived','Network.loadingFailed'];
  let cursor = (await cdp.readEvents({methods})).cursor;
  const captures = await fs.readFile(path.join(outputDir,'captures.json'),'utf8').then(JSON.parse).catch(()=>[]);
  async function network() {
    const rows = [];
    let truncated = false;
    for (let page=0; page<20; page++) {
      const result = await cdp.readEvents({afterSequence:cursor,methods,limit:1000});
      cursor = result.cursor;
      truncated ||= result.truncated;
      for (const e of result.events) {
        const p=e.params||{};
        const r=p.request||p.response||{};
        const url=safeUrl(r.url||'');
        if (!url || !/^https:\/\/(grok\.com|[^/]+\.grok\.com|[^/]+\.x\.ai)\//.test(url)) continue;
        if (!['Fetch','XHR','Document','Media'].includes(p.type)) continue;
        let bodyShape;
        if (p.request?.postData) { try {bodyShape=shape(JSON.parse(p.request.postData));} catch {bodyShape='non-JSON body omitted';} }
        const row={event:e.method,sequence:e.sequence,requestId:p.requestId,url,method:p.request?.method,status:p.response?.status,type:p.type,mimeType:p.response?.mimeType,requestShape:bodyShape};
        rows.push(row);
      }
      if (!result.hasMore) return {rows,truncated};
    }
    return {rows,truncated:true};
  }
  async function capture(id, note='') {
    if (!/^[a-z0-9-]+$/.test(id)) throw new Error('Capture ID must be lowercase letters, digits and hyphens');
    const snapshot=redactText(await tab.playwright.domSnapshot());
    await fs.writeFile(path.join(outputDir,`${id}.dom.txt`),snapshot);
    const elements=await tab.playwright.evaluate(() => [...document.querySelectorAll('button,a,input,textarea,select,[role],[contenteditable],img,video')].map(el=>{
      const r=el.getBoundingClientRect();
      const style=getComputedStyle(el);
      return {tag:el.tagName.toLowerCase(),role:el.getAttribute('role'),name:el.getAttribute('aria-label'),title:el.getAttribute('title'),testId:el.getAttribute('data-testid'),placeholder:el.getAttribute('placeholder'),text:(el.innerText||'').slice(0,160),disabled:el.hasAttribute('disabled'),expanded:el.getAttribute('aria-expanded'),pressed:el.getAttribute('aria-pressed'),src:el.getAttribute('src'),href:el.getAttribute('href'),visible:r.width>0&&r.height>0&&style.visibility!=='hidden'&&style.display!=='none',box:{x:r.x,y:r.y,width:r.width,height:r.height}};
    }));
    for (const e of elements) {
      if(e.src) e.src=safeUrl(e.src);
      if(e.href?.startsWith('http')) e.href=safeUrl(e.href);
      e.text=redactText(e.text);
    }
    await fs.writeFile(path.join(outputDir,`${id}.elements.json`),JSON.stringify(elements,null,2));
    const requests=await network();
    let screenshotError=null;
    try {
      const shot=await cdp.send('Page.captureScreenshot',{format:'jpeg',quality:75},{timeoutMs:20000});
      await fs.writeFile(path.join(outputDir,`${id}.jpg`),Buffer.from(shot.data,'base64'));
    } catch(e) {screenshotError=String(e.message);}
    await fs.writeFile(path.join(outputDir,`${id}.network.json`),JSON.stringify(requests,null,2));
    const entry={id,note,url:safeUrl(await tab.url()),capturedAt:new Date().toISOString(),screenshotError,networkCount:requests.rows.length,truncated:requests.truncated};
    captures.push(entry);
    await fs.writeFile(path.join(outputDir,'captures.json'),JSON.stringify(captures,null,2));
    const panelAt=snapshot.lastIndexOf('  - complementary:');
    return {entry,tail:panelAt>=0?snapshot.slice(panelAt):snapshot.slice(-9000),requests:requests.rows};
  }
  async function begin() { await cdp.send('Network.enable'); await network(); }
  async function responseShape(requestId) {
    const result=await cdp.send('Network.getResponseBody',{requestId});
    const raw=result.base64Encoded?Buffer.from(result.body,'base64').toString():result.body;
    return shape(JSON.parse(raw));
  }
  return {capture,begin,network,responseShape};
}
