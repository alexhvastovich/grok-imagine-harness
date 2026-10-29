# Continuous scenes: A -> B -> C

The assistant directs the visuals; Grok generates the motion. This is the default
for continuous action. A deliberate cut to a different location is a separate shot
and must not be forced through an implausible morph.

## Mandatory production sequence

the creator's clarified order, 2026-10-07: establish the new named project, project
details and named Character masters before scene-image creation. Design purposeful
shot coverage and cuts using [shot-design.md](shot-design.md). Complete ALL
scenes' inspected first/last image pairs. Next write each motion/dialogue prompt
from the locked script. Finish populating that project with the full frame set,
script, prompt packet and ledger. Verify the project and attachment identities.
Only then submit videos, one at a time, inspecting each result.
This applies to cut scenes as well as continuous scenes: every scene has both
an explicit start and an explicit endpoint. A film plan or prompt is not an image.

When actual motion differs from the planned endpoint, revise the next continuous
scene's first frame to the exact accepted rendered last frame and update the
project/ledger before submission. The initial complete pair set remains versioned.

## 1. Plan the images

Create a small scene ledger before generation: scene/shot/take, dramatic purpose,
first-frame file and hash, intended last-frame file and hash, cast references,
wardrobe, prop ownership/hand, location, camera/lens, axis/screen direction,
lighting, duration, dialogue/sound, previous shot, and boundary type.

Create A. Inspect faces, body anatomy, prop positions and composition. Create B
using A and identity anchors as references. B changes only what the shot's action
requires. Do not independently regenerate B from a generic character description.
Keep image creation in the active image-generation skill/tool. Never fake a
generated endpoint by writing a filename in a manifest.

## 2. Prepare Grok's two-frame video composer

For the optional middle state and image-role menu, see
[frame controls](frame-controls.md). Check actual thumbnails/roles rather than
assuming the prompt filenames or selected canvas still configure the endpoints.

Verified 2026-10-07 on the supplied account:

1. Open Imagine and select the **Video** radio in **Generation mode**.
2. **Upload** opens the toolbox. **Upload media** opens a file chooser. Attach A.
3. Verify A's actual thumbnail. **Add last frame** opens another file chooser.
   It reported multiple-file capability; still supply exactly one endpoint B.
4. Confirm the row displays A -> intermediate control -> B. Do not infer order
   from an unlabelled Remove image button. Inspect the DOM and screenshot.
5. Set aspect ratio explicitly. The prior draft retained 3:2 despite 16:9 inputs;
   we selected **16:9 Widescreen**. Resolution menu: 480p/720p/1080p;
   duration menu: 6s/10s/15s. Availability can differ by mode, plan and future UI.
6. Set audio intent and the motion prompt; capture evidence before submission.
7. Submit only for an authorized production job. One job at a time. Record the
   returned asset ID and its relationship to raw/processed variants.

Alternative: selected canvas still -> **Full Screen** -> detail **Make Video**
(must have aria-haspopup=menu) -> **Add Prompt**. This exposes the same endpoint
controls. Canvas **Make Video** itself immediately submits `Animate this`.

**Add intermediate frame** was observed; its interpolation and timestamp semantics
remain untested. **Guide/omni-reference** is documented in the linked official
creator guide but was not verified as a separate live control in this audit.
Never substitute a guide reference for a required first or last frame.

Agent route verified on the Affordable Doctor production: import both images
through Canvas Upload Image, inspect their identities and live IDs, then select
their matching Uploads thumbnails. In Agent chat give literal FIRST/LAST roles
and the exact scene prompt, explicitly requesting first_frame_asset_id and
last_frame_asset_id in imagine_reference_to_video. Agent reported both arguments
and returned a playable six-second scene; its MP4 was decoded locally. This is
separate from the main composer, which hit a usage limit on the same account.
Every subsequent scene still requires result/endpoint/audio review.

## 3. Motion prompt

Describe change between A and B, not a new still composition:

> One continuous [duration] shot. Start on the first attachment and finish on the
> last attachment. [Actor] moves from [A state] to [B state] through [short, causal
> beats]. Preserve [face, wardrobe, held props, set geometry]. [Camera movement
> and screen direction]. [Lighting]. [Exact sound/dialogue]. [Mouth behavior].
> No internal cut or unrequested new objects/characters.

Use film terms intentionally: shot size, angle, lens, movement and performance.
Avoid asking the model to do too many physical actions inside one short clip.
For speech, follow the repo's speech-safe wording rule. An external audio overlay
does not establish lip sync. Do not claim fixed voices from a text request alone.

## 4. Inspect the actual transition

Use `continuity.py extract` on the downloaded selected take. It writes actual
first/last frames and hashes. Compare intended A/B with actual endpoints, then
watch the whole clip for identity drift, hands, prop changes, movement direction,
camera jumps, mouth behavior, unwanted text, and audio continuity.

If the rendered ending differs materially from B, either revise the take or make
its actual last decoded frame B*. For a strict continuous join, the next first
frame is **that exact file B***, byte-for-byte, and C is generated from B*.
Do not keep chaining altered versions of a face indefinitely: compare every new
endpoint against the approved identity anchors too.

The scene02 local example measured 1264x720, 24 fps, 10.041667 seconds and included
audio. Its extracted first/last frames were attached to a fresh widescreen draft
in capture 38. This verifies attachment setup, not a newly generated A -> B result.

## 5. Deep edits and assembly

Read [native-editing.md](native-editing.md) for exact entry/commit controls and
verification levels, and [asset-ledger.md](asset-ledger.md) before recording edits.

- Canvas video selection exposes **Trim**, **Extract Frame**, **Stitch** and
  **Full Screen**. Generated and processed clips can expose different controls.
- Trim/Extract use a visual timeline. No native input/slider appeared in the
  inspected canvas editor; re-screenshot and use visible drag geometry, or use
  the local frame/trim tools for precise timestamps.
- Stitch starts with one selection; select another clip to enable final Stitch.
  Numbered badges record selection order. Verify order before the final action.
- Video detail **Extend** opens a continuation draft (observed 0:10 -> 0:20 and
  +10s). **Cancel Extend** returns to the original prompt. This is an alternative
  continuation path; it is not proof of explicit end-frame support in Extend.
- Keep raw takes and approved trims. `continuity.py assemble` normalizes approved
  local clips and joins them. Its output still needs full audiovisual review.

## Evidence limitations and learned failures

Some navigation captures truncated older network events. Empty request lists are
not proof an action has no API. Upload previews may remain blob URLs until submit.
The main composer's first/last submission was observed at
POST /rest/app-chat/conversations/new, with explicit firstFrameAsset and
lastFrameAsset fields. It returned HTTP 200 and progress, then a visible usage
limit: neither HTTP status nor progress establishes a playable result.
Trim/stitch submission endpoints remain unverified. Do not invent them.
The account reported 100% credits used, but the composer remained interactive.
Treat this as quota state to check, not proof that every request will fail.

An old production ledger mapped an airplane image to an ID which displayed a
different man at a door. Capture 30 records this mismatch; it is a failed identity
check, not a valid continuity pair. Captures 36/38 use verified extracted airplane
frames instead. Escape in a detail menu unexpectedly returned to the canvas;
close by choosing the current menu value or a visible cancel control.

Source: [Grok Imagine's cinematic guide](https://x.com/imagine/status/2092675531057885288),
read in the signed-in browser. It recommends deliberate shot language, character
references and separating a first-frame image from a guiding reference.
