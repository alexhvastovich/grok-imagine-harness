// Page objects for the documented browser-client Playwright subset.
// Pass an existing, freshly grounded tab. This module does not launch a browser.
export function assertIntermediatePlan(shot) {
  if(shot.intermediate_required && !shot.intermediate_frame) throw new Error(`${shot.id}: required intermediate_frame is missing`);
  if(!shot.intermediate_frame) return false;
  if(shot.intermediate_review!=='accepted') throw new Error(`${shot.id}: inspect the intermediate image before any video`);
  const time=shot.intermediate_time_seconds, duration=shot.duration_target;
  if(!Number.isFinite(duration) || duration<=0 || !Number.isFinite(time) || time<=0 || time>=duration) throw new Error(`${shot.id}: intermediate_time_seconds must be inside duration_target`);
  return true;
}

// Validates a caller's separately recorded UI observations, not prompt text.
// Role/identity review is still manual; source/duration drift is checked live below.
export function assertFrameConfiguration(shot,configuration) {
  const middle=assertIntermediatePlan(shot);
  if(!configuration || configuration.verified!==true) throw new Error('Verify current composer frame identities, roles and duration before submission');
  if(!Number.isFinite(configuration.duration_seconds) || configuration.duration_seconds!==shot.duration_target) throw new Error('Observed composer duration differs from duration_target');
  const expected=[['first',shot.first_frame],...(middle?[['intermediate',shot.intermediate_frame]]:[]),['last',shot.planned_last_frame]];
  if(!Array.isArray(configuration.frames) || configuration.frames.length!==expected.length) throw new Error('Observed composer frame count differs from planned roles');
  for(const [role,file] of expected) {
    const matches=configuration.frames.filter(f=>f.role===role);
    if(matches.length!==1 || matches[0].file!==file || matches[0].verified!==true || !matches[0].src) throw new Error(`Verify the actual ${role} attachment identity and checked role`);
    if(role==='intermediate' && (!Number.isFinite(matches[0].time_seconds) || Math.abs(matches[0].time_seconds-shot.intermediate_time_seconds)>1e-6)) throw new Error('Observed intermediate pin differs from intermediate_time_seconds');
  }
  return true;
}

function sourcePath(src) {
  try {const u=new URL(src);return u.origin+u.pathname;} catch {return src;}
}

export function assertProductionReady(manifest) {
  if(!manifest?.project_name || !manifest.project_details_verified || !manifest.project_packet_uploaded) throw new Error('Create and fully populate the named project before video generation');
  if(!manifest.characters?.length || manifest.characters.some(c=>!c.registered || !c.master)) throw new Error('Register all named Character masters before scenes');
  if(!manifest.shots?.length || manifest.shots.some(s=>!s.first_frame || !s.planned_last_frame || s.image_review!=='accepted' || !s.motion_prompt?.trim())) throw new Error('Complete and inspect ALL scenes first/last images and write ALL prompts before any video');
  for(const shot of manifest.shots) assertIntermediatePlan(shot);
  return true;
}
export function classifyGeneration(snapshot, media=[]) {
  // A real job reached 47% and returned HTTP200 before reporting a usage limit.
  // Visible terminal failures take precedence over progress and stale media.
  if (/Usage limit reached/i.test(snapshot)) return {state:'blocked',reason:'usage-limit'};
  if (/generation failed|failed to generate|something went wrong/i.test(snapshot)) return {state:'failed',reason:'visible-error'};
  if (/generic: Generating|button "Cancel"/.test(snapshot)) return {state:'generating'};
  const playable=media.filter(m=>m.src && m.readyState>=2 && Number.isFinite(m.duration) && m.duration>0);
  return playable.length ? {state:'playable',media:playable} : {state:'unknown'};
}

export class ImaginePage {
  constructor(tab) { this.tab=tab; this.pw=tab.playwright; }
  button(name) { return this.pw.getByRole('button',{name,exact:true}); }
  async snapshot() { return this.pw.domSnapshot(); }
  async uploadVia(button, filename) {
    // Attach rejection handlers immediately; a timed-out chooser must not reset
    // the persistent browser session while a click is still being awaited.
    const [chooser]=await Promise.all([this.pw.waitForEvent('filechooser',{timeoutMs:10000}),button.click()]);
    await chooser.setFiles([filename]);
  }
  async preparePair({firstFrame,intermediateFrame,lastFrame,prompt,resolution='720p',duration='10s',aspect='16:9 Widescreen'}) {
    if ((await this.tab.url()) !== 'https://grok.com/imagine') throw new Error('Open a clean /imagine draft first');
    if (await this.button('Remove image').count()) throw new Error('Existing attachments: inspect and clear the draft explicitly');
    await this.pw.getByRole('radio',{name:'Video',exact:true}).check();
    await this.button('Upload').click();
    await this.uploadVia(this.button('Upload media'),firstFrame);
    await this.button('Add last frame').waitFor({state:'visible'});
    await this.uploadVia(this.button('Add last frame'),lastFrame);
    await this.pw.getByRole('textbox',{name:'Ask Grok anything',exact:true}).fill(prompt);
    for(const [label,value] of [['Video resolution',resolution],['Video duration',duration],['Aspect Ratio',aspect]]) {
      await this.button(label).click();
      await this.pw.getByRole('menuitemradio',{name:value,exact:true}).click();
    }
    // Set duration first: changing it can retain an old intermediate pin time.
    if(intermediateFrame) await this.uploadVia(this.button('Add intermediate frame'),intermediateFrame);
    // Wait for menus/animations to settle; the immediate snapshot after a menu
    // selection can still expose only unnamed background controls.
    await this.button('Submit').waitFor({state:'visible'});
    const expected=intermediateFrame?3:2;
    if(await this.button('Remove image').count()!==expected) throw new Error(`Expected ${expected} first/intermediate/last attachments; inspect draft`);
    // Returns evidence for visual verification. Deliberately does not submit.
    return this.snapshot();
  }
  async openDetailVideoPrompt() {
    const menu=this.button('Make Video');
    if ((await menu.getAttribute('aria-haspopup')) !== 'menu') throw new Error('This Make Video immediately generates; use the detail-page menu');
    await menu.click();
    await this.pw.getByRole('menuitem',{name:'Add Prompt',exact:true}).click();
    await this.button('Add last frame').waitFor({state:'visible'});
    return this.snapshot();
  }
  async submitPrepared({manifest,shotId,frameConfiguration}={}) {
    if(await this.button('Stop').count()) throw new Error('A job is already running');
    const submit=this.button('Submit');
    const shot=manifest?.shots?.find(s=>s.id===shotId);
    if(shotId && !shot) throw new Error('Shot is absent from the complete manifest');
    if(!shot && manifest?.shots?.some(s=>s.intermediate_frame || s.intermediate_required)) throw new Error('Specify shotId for a production with intermediate frames');
    const expected=shot?.intermediate_frame?3:2;
    if(await this.button('Remove image').count()!==expected) throw new Error(`Both first and last frames${expected===3?' plus the intermediate frame':''} are required for this production harness`);
    assertProductionReady(manifest);
    if(shot?.intermediate_frame || frameConfiguration) {
      if(!shot) throw new Error('Specify shotId when supplying frameConfiguration');
      assertFrameConfiguration(shot,frameConfiguration);
      const live=await this.pw.evaluate(()=>{
        const images=[...document.querySelectorAll('[data-testid="frame-group-pill"] img,[data-testid="frame-pin-mid-zone"] img')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;});
        const duration=document.querySelector('button[aria-label="Video duration"]')?.innerText||'';
        const pin=document.querySelector('[data-testid="frame-pin-mid-zone"]')?.innerText||'';
        return {sources:images.map(e=>e.getAttribute('src')),durationSeconds:Number(duration.match(/([\d.]+)\s*s/)?.[1]),intermediateTimeSeconds:Number(pin.match(/([\d.]+)\s*s\b/)?.[1])};
      });
      const observed=frameConfiguration.frames.map(f=>sourcePath(f.src)).sort();
      if(live.durationSeconds!==frameConfiguration.duration_seconds || JSON.stringify(live.sources.map(sourcePath).sort())!==JSON.stringify(observed)) throw new Error('Composer attachments or duration changed; inspect and record fresh frameConfiguration');
      // The strip badge rounds to a tenth; the exact slider value belongs in
      // frameConfiguration. A missing/unreadable badge fails closed.
      if(shot.intermediate_frame && (!Number.isFinite(live.intermediateTimeSeconds) || Math.abs(live.intermediateTimeSeconds-shot.intermediate_time_seconds)>0.051)) throw new Error('Composer intermediate pin changed or is unreadable; recheck Keyframe time');
    }
    if(await submit.count()!==1 || !await submit.isEnabled()) throw new Error('Submit unavailable; inspect current draft and quota');
    await submit.click(); // One submission only. Never automatically retry.
    return this.snapshot();
  }
  async generationStatus() {
    const snapshot=await this.snapshot();
    const media=await this.pw.evaluate(()=>[...document.querySelectorAll('article video')].map(v=>({src:v.getAttribute('src'),duration:v.duration,readyState:v.readyState})));
    return classifyGeneration(snapshot,media);
  }
}

export class ReferencePage extends ImaginePage {
  async prepareCharacter({name,description}) {
    if(!name || name.length>64) throw new Error('Use a named Character master');
    if(await this.button(`Use @${name}`).count()) throw new Error('Reference already exists; inspect it rather than duplicating');
    await this.button('New').click(); // References tab must already be grounded/open.
    const dialog=this.pw.getByRole('dialog',{name:'New reference',exact:true});
    await dialog.getByRole('textbox',{name:'Title',exact:true}).fill(name);
    await dialog.getByRole('textbox',{name:'Description',exact:true}).fill(description);
    if(await dialog.getByRole('combobox',{name:'Category Character',exact:true}).count()!==1) throw new Error('Expected Character category');
    // Nested role=button wrappers duplicate accessible Add image controls.
    // Keyboard Enter on actual <button> + Upload photo succeeded in live UI.
    await dialog.locator('button[aria-label="Add image"]').nth(0).press('Enter');
    const upload=this.pw.getByRole('menuitem',{name:'Upload photo',exact:true});
    await upload.waitFor({state:'visible'});
    return this.snapshot(); // Return control: monolithic open+upload timed out.
  }
  async attachCharacterPhoto(filename) {
    // Call in a separate browser tool step after inspecting the settled menu.
    const dialog=this.pw.getByRole('dialog',{name:'New reference',exact:true});
    const upload=this.pw.getByRole('menuitem',{name:'Upload photo',exact:true});
    if(!await upload.isVisible()) throw new Error('Inspect and open the actual image tile menu first');
    const [chooser]=await Promise.all([this.pw.waitForEvent('filechooser',{timeoutMs:10000}),upload.press('Enter')]);
    await chooser.setFiles([filename]);
    await dialog.getByRole('button',{name:'Create',exact:true}).waitFor({state:'visible'});
    return this.snapshot(); // Inspect the actual thumbnail before saving.
  }
  async saveCharacter(name) {
    await this.pw.getByRole('dialog',{name:'New reference',exact:true}).getByRole('button',{name:'Create',exact:true}).click();
    await this.button(`Use @${name}`).waitFor({state:'visible'});
    return this.snapshot();
  }
}

export class AgentPage extends ImaginePage {
  async importEndpointPair({firstFrame,lastFrame}) {
    if(!firstFrame || !lastFrame) throw new Error('Supply both endpoint files');
    // Inspect the settled Canvas toolbar first. Toolbox Upload media routed
    // PNGs to the audio picker in this run; Canvas Upload Image worked.
    const upload=this.pw.getByRole('complementary').getByRole('button',{name:'Upload Image',exact:true});
    if(await upload.count()!==1 || !await upload.isVisible()) throw new Error('Inspect Canvas and close menus before importing');
    const [chooser]=await Promise.all([this.pw.waitForEvent('filechooser',{timeoutMs:10000}),upload.click()]);
    await chooser.setFiles([firstFrame,lastFrame]);
    return this.snapshot(); // Next step: visually match thumbnails and live IDs.
  }
  async prepareInstruction({manifest,shotId,firstAssetId,lastAssetId}) {
    assertProductionReady(manifest);
    const shot=manifest.shots.find(s=>s.id===shotId);
    if(!shot) throw new Error('Shot is absent from the complete manifest');
    if(shot.intermediate_frame) throw new Error('Use the explicit frame composer for intermediate frames; Agent middle-role configuration is unverified');
    for(const id of [firstAssetId,lastAssetId]) if(!/^[a-f0-9-]{36}$/i.test(id||'')) throw new Error('Use visually verified live endpoint asset IDs');
    if(await this.button('Stop').count()) throw new Error('A job is already running');
    const instruction=`Generate ONLY ${shot.id}, one ${shot.duration_target}-second 16:9 720p video with native audio. The named project, Character masters, every scene endpoint pair and all prompts are prepared. Use imagine_reference_to_video with literal first_frame_asset_id=${firstAssetId} and last_frame_asset_id=${lastAssetId}, not generic guide references. Exact motion prompt:\n\n${shot.motion_prompt}\n\nReturn a real playable asset ID and endpoint assignments. Do not generate other scenes or stills, or automatically retry.`;
    await this.pw.getByRole('textbox',{name:'Ask Grok anything',exact:true}).fill(instruction);
    return this.snapshot(); // Capture/review before the separate submit step.
  }
  async submitInstruction({manifest}) {
    assertProductionReady(manifest);
    if(manifest.shots.some(s=>s.intermediate_frame)) throw new Error('Use the explicit frame composer for intermediate frames; Agent middle-role configuration is unverified');
    if(await this.button('Stop').count()) throw new Error('A job is already running');
    const send=this.button('Send');
    if(await send.count()!==1 || !await send.isEnabled()) throw new Error('Inspect the prepared Agent instruction');
    await send.click(); // One job only; no automatic retries.
    return this.snapshot();
  }
  async prepareFromProjectFiles({manifest,shotId}) {
    assertProductionReady(manifest);
    const shot=manifest.shots.find(s=>s.id===shotId);
    if(!shot) throw new Error('Shot is absent from the complete manifest');
    if(shot.intermediate_frame) throw new Error('Use the explicit frame composer for intermediate frames; Agent middle-role configuration is unverified');
    const first=String(shot.first_frame).split(/[\\/]/).pop();
    const last=String(shot.planned_last_frame).split(/[\\/]/).pop();
    if(![first,last].every(name=>manifest.project_files_verified?.includes(name))) throw new Error('Verify both current endpoint filenames in project Files first');
    if(await this.button('Stop').count()) throw new Error('A job is already running');
    await this.pw.getByRole('textbox',{name:'Ask Grok anything',exact:true}).fill(`Generate ONLY ${shot.id}, one ${shot.duration_target}-second 16:9 720p video with native audio. Use the EXISTING verified project files ${first} as literal FIRST and ${last} as literal LAST. Register those existing files if necessary; do not create new stills. Use separate first_frame_asset_id and last_frame_asset_id in imagine_reference_to_video, not generic guides. All scene pairs/prompts and named Character masters are prepared. Exact prompt:\n\n${shot.motion_prompt}\n\nReturn real playable video ID and both registered endpoint IDs; update the project ledger. No other scenes or automatic retry.`);
    return this.snapshot();
  }
}

export class CanvasPage extends ImaginePage {
  async focusAsset(assetId,kind='video') {
    if(!/^[a-f0-9-]{36}$/.test(assetId)||!['img','video'].includes(kind)) throw new Error('Use an observed asset ID and media kind');
    const media=this.pw.locator(`${kind}[src*="${assetId}"]`);
    const bridge=this.button('Show on canvas').filter({has:media});
    if(await bridge.count()!==1) throw new Error('Ambiguous or missing chat result; re-map the exact asset');
    await bridge.click();
    const node=this.pw.getByRole('application').locator(`${kind}[src*="${assetId}"]`);
    await node.waitFor({state:'visible'});
    return this.snapshot(); // Focus animation can swallow an immediate click.
  }
  async selectFocusedAsset(assetId,kind='video') {
    if(!/^[a-f0-9-]{36}$/.test(assetId)||!['img','video'].includes(kind)) throw new Error('Use an observed asset ID and media kind');
    // Separate browser tool step, after inspecting the settled focused node.
    const node=this.pw.getByRole('application').locator(`${kind}[src*="${assetId}"]`);
    if(await node.count()!==1 || !await node.isVisible()) throw new Error('Inspect the focused canvas media first');
    await node.click();
    // A valid one-second processed clip exposes Download but replaces Trim with
    // "Video too short to trim". Selection must not require native trim support.
    await this.button(kind==='video'?'Download':'Make Video').waitFor({state:'visible'});
    return this.snapshot();
  }
  async openTrim() { await this.button('Trim').click(); return this.snapshot(); }
  async openExtract() { await this.button('Extract Frame').click(); return this.snapshot(); }
  async openStitch() { await this.button('Stitch').click(); return this.snapshot(); }
}
