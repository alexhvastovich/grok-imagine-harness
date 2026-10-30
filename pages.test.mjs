import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyGeneration,ImaginePage,AgentPage,assertProductionReady,assertFrameConfiguration} from './pages.mjs';

test('progress is not a finished film, and quota overrides old playable media',()=>{
  const playable=[{src:'https://assets.grok.com/observed.mp4',readyState:4,duration:6}];
  assert.equal(classifyGeneration('- generic: Generating\n- generic: 47%',playable).state,'generating');
  assert.deepEqual(classifyGeneration('- generic: Usage limit reached',playable),{state:'blocked',reason:'usage-limit'});
  assert.equal(classifyGeneration('',[{...playable[0],duration:0}]).state,'unknown');
  assert.equal(classifyGeneration('',playable).state,'playable');
});

test('a ready opening pair cannot bypass an unfinished later scene or project',()=>{
  const shot={first_frame:'a.png',planned_last_frame:'b.png',image_review:'accepted',motion_prompt:'Animate from first to last'};
  const plan={project_name:'Film',project_details_verified:true,project_packet_uploaded:true,characters:[{registered:true,master:'ren.png'}],shots:[shot,{...shot,motion_prompt:null}]};
  assert.throws(()=>assertProductionReady(plan),/ALL scenes/);
  plan.shots[1].motion_prompt='Second scene';
  plan.project_packet_uploaded=false;
  assert.throws(()=>assertProductionReady(plan),/fully populate/);
  plan.project_packet_uploaded=true;
  assert.equal(assertProductionReady(plan),true);
});

test('a missing endpoint prevents submission without any click',async()=>{
  let clicks=0;
  const page=new ImaginePage({playwright:{getByRole(_role,{name}){return {count:async()=>name==='Remove image'?1:name==='Submit'?1:0,isEnabled:async()=>true,click:async()=>clicks++};}}});
  await assert.rejects(()=>page.submitPrepared(),/first and last/);
  assert.equal(clicks,0);
});

test('Agent refuses an unverified endpoint file before touching the composer',async()=>{
  let interactions=0;
  const plan={project_name:'Film',project_details_verified:true,project_packet_uploaded:true,
    characters:[{registered:true,master:'ren.png'}],project_files_verified:['first.png'],
    shots:[{id:'s01',first_frame:'frames/first.png',planned_last_frame:'frames/last.png',image_review:'accepted',motion_prompt:'Drop the vial',duration_target:6}]};
  const page=new AgentPage({playwright:{getByRole(){interactions++;throw new Error('Unexpected UI access');}}});
  await assert.rejects(()=>page.prepareFromProjectFiles({manifest:plan,shotId:'s01'}),/Verify both current endpoint filenames/);
  assert.equal(interactions,0);
  plan.shots.push({...plan.shots[0],id:'s02',motion_prompt:null});
  await assert.rejects(()=>page.submitInstruction({manifest:plan}),/ALL scenes/);
  assert.equal(interactions,0);
});

function threeFramePlan() {
  const shot={id:'s01',first_frame:'first.png',planned_last_frame:'last.png',image_review:'accepted',motion_prompt:'One continuous action',duration_target:15,
    intermediate_required:true,intermediate_frame:'middle.png',intermediate_review:'accepted',intermediate_time_seconds:22/3};
  return {project_name:'Film',project_details_verified:true,project_packet_uploaded:true,characters:[{registered:true,master:'master.png'}],shots:[shot]};
}
function frameConfiguration(shot) {
  return {verified:true,duration_seconds:15,frames:[
    {role:'first',file:shot.first_frame,src:'https://example.invalid/first.png',verified:true},
    {role:'intermediate',file:shot.intermediate_frame,src:'https://example.invalid/middle.png',verified:true,time_seconds:22/3},
    {role:'last',file:shot.planned_last_frame,src:'https://example.invalid/last.png',verified:true}]};
}

test('whole-production preflight includes every declared middle image and its planned time',()=>{
  const plan=threeFramePlan();
  assert.equal(assertProductionReady(plan),true);
  const shot={...plan.shots[0],id:'s02'};
  plan.shots.push(shot);
  shot.intermediate_frame=null;
  assert.throws(()=>assertProductionReady(plan),/required intermediate_frame/);
  shot.intermediate_frame='middle.png';
  shot.intermediate_review='pending';
  assert.throws(()=>assertProductionReady(plan),/inspect the intermediate/);
  shot.intermediate_review='accepted';
  for(const time of [0,15,-1,'7.5',Infinity,NaN]) {
    shot.intermediate_time_seconds=time;
    assert.throws(()=>assertProductionReady(plan),/inside duration_target/);
  }
});

test('configuration binds actual role, file, pin and duration rather than attachment count',()=>{
  const shot=threeFramePlan().shots[0], config=frameConfiguration(shot);
  assert.equal(assertFrameConfiguration(shot,config),true);
  for(const mutate of [c=>c.duration_seconds=10,c=>c.frames[1].role='reference',c=>c.frames[1].file='other.png',c=>c.frames[1].time_seconds=5,c=>c.frames[1].verified=false]) {
    const bad=structuredClone(config);mutate(bad);
    assert.throws(()=>assertFrameConfiguration(shot,bad));
  }
});

test('three-frame submit fails closed on stale sources, duration or pin; valid triple submits once',async()=>{
  const plan=threeFramePlan(), config=frameConfiguration(plan.shots[0]);
  let clicks=0, live={sources:config.frames.map(f=>f.src),durationSeconds:15,intermediateTimeSeconds:7.3};
  const page=new ImaginePage({playwright:{getByRole(_role,{name}){return {count:async()=>name==='Remove image'?3:name==='Submit'?1:0,isEnabled:async()=>true,click:async()=>clicks++};},evaluate:async()=>live,domSnapshot:async()=>'prepared'}});
  await assert.rejects(()=>page.submitPrepared({manifest:plan}),/Specify shotId/);
  await assert.rejects(()=>page.submitPrepared({manifest:plan,shotId:'s01'}),/Verify current composer/);
  const base=structuredClone(live);
  for(const change of [{durationSeconds:10},{sources:[...live.sources.slice(0,2),'https://example.invalid/replaced.png']},{intermediateTimeSeconds:5},{intermediateTimeSeconds:NaN}]) {
    live={...base,...change};
    await assert.rejects(()=>page.submitPrepared({manifest:plan,shotId:'s01',frameConfiguration:config}),/Composer/);
  }
  assert.equal(clicks,0);
  live=base;
  assert.equal(await page.submitPrepared({manifest:plan,shotId:'s01',frameConfiguration:config}),'prepared');
  assert.equal(clicks,1);
});

test('unverified Agent middle-role route cannot silently drop a required middle',async()=>{
  const plan=threeFramePlan();
  const page=new AgentPage({playwright:{getByRole(){throw new Error('Unexpected UI access');}}});
  await assert.rejects(()=>page.prepareInstruction({manifest:plan,shotId:'s01'}),/explicit frame composer/);
  await assert.rejects(()=>page.prepareFromProjectFiles({manifest:plan,shotId:'s01'}),/explicit frame composer/);
  await assert.rejects(()=>page.submitInstruction({manifest:plan}),/explicit frame composer/);
});
