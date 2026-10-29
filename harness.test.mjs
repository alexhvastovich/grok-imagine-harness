import test from 'node:test';
import assert from 'node:assert/strict';
import {safeUrl,shape,redactText,createUIHarness,createHarness} from './harness.mjs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

test('captured URLs strip signed query values and credentials',()=>{
  assert.equal(safeUrl('https://user:password@grok.com/rest/assets?token=secret#fragment'),'https://grok.com/rest/assets');
  assert.equal(safeUrl('blob:https://grok.com/secret'),'blob:');
  assert.equal(redactText('image https://assets.grok.com/path?signature=secret end'),'image https://assets.grok.com/path end');
});
test('body schemas omit values and sensitive keys recursively',()=>{
  const value=shape({prompt:'PRIVATE',token:'SECRET',nested:{cookie:'SECRET',frameId:'id'},frames:[{url:'SIGNED'}]});
  const output=JSON.stringify(value);
  for(const forbidden of ['PRIVATE','SECRET','SIGNED','cookie','token']) assert.ok(!output.includes(forbidden));
  assert.equal(value.nested.frameId,'string');
});

test('UI-only capture preserves existing index and labels missing network without inventing zero requests',async()=>{
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'grok-ui-capture-'));
  try {
    await fs.writeFile(path.join(dir,'captures.json'),JSON.stringify([{id:'existing',note:'preserved'}]));
    const tab={url:async()=> 'https://grok.com/imagine?token=secret',getScreenshot:async()=>new Uint8Array([1,2,3]),playwright:{domSnapshot:async()=> 'slider Keyframe time https://grok.com/image?secret=1',evaluate:async()=>[{tag:'div',role:'slider',name:'Keyframe time',valueNow:'1',valueMin:'0.3333333333333333',valueMax:'5.666666666666667',src:'blob:https://grok.com/private',text:'1.0s'}]}};
    const recorder=await createUIHarness({tab,outputDir:dir,reason:'CDP unavailable'});
    const result=await recorder.capture('timing-ready','actual1s pin');
    assert.equal(result.entry.networkCount,null);
    assert.equal(result.entry.networkAvailable,false);
    const network=JSON.parse(await fs.readFile(path.join(dir,'timing-ready.network.json'),'utf8'));
    assert.equal(network.available,false);
    const elements=JSON.parse(await fs.readFile(path.join(dir,'timing-ready.elements.json'),'utf8'));
    assert.equal(elements[0].valueNow,'1');
    assert.equal(elements[0].src,'blob:');
    assert.equal(JSON.parse(await fs.readFile(path.join(dir,'captures.json'),'utf8')).length,2);
    assert.ok(!(await fs.readFile(path.join(dir,'timing-ready.dom.txt'),'utf8')).includes('secret=1'));
  } finally {await fs.rm(dir,{recursive:true,force:true});}
});

test('passive capture never persists tab URL credentials or signed query values',async()=>{
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'grok-passive-capture-'));
  try {
    const tab={url:async()=> 'https://user:password@grok.com/imagine?token=PRIVATE_QUERY#PRIVATE_FRAGMENT',playwright:{domSnapshot:async()=> 'Current project',evaluate:async()=>[]}};
    const cdp={
      send:async(method)=>method==='Page.captureScreenshot'?{data:Buffer.from('synthetic image').toString('base64')}:{},
      readEvents:async()=>({cursor:1,events:[],hasMore:false,truncated:false})
    };
    const recorder=await createHarness({tab,cdp,outputDir:dir});
    const result=await recorder.capture('project-open');
    assert.equal(result.entry.url,'https://grok.com/imagine');
    const saved=await fs.readFile(path.join(dir,'captures.json'),'utf8');
    for(const forbidden of ['PRIVATE_QUERY','PRIVATE_FRAGMENT','password','user:']) assert.ok(!saved.includes(forbidden));
  } finally {await fs.rm(dir,{recursive:true,force:true});}
});
