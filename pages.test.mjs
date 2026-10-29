import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyGeneration,ImaginePage,AgentPage,assertProductionReady} from './pages.mjs';

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
