# Editing surfaces: where to click and what is verified

For required exact typography, diagrams, UI evidence or branding, composite
verified text/graphic assets during editing instead of relying on generated
motion to reproduce them. Add such overlays only when the brief requests them;
an effects-only, no-text film keeps that lock. Inspect the rendered overlays at
delivery size. This is a reliability choice, not a claim that generation can
never render text.

Read [browser-actions.md](browser-actions.md) first. Select the visually verified
source and preserve its ID/file before editing. Re-read the live DOM and screenshot:
generated and processed assets can expose different controls. A visible commit
button describes the next action, not a tested successful workflow.

## Native controls

| Operation | Entry and visible next controls | What to do and check | Evidence/status |
| --- | --- | --- | --- |
| Trim video | Selected canvas video > Trim > timeline > Trim video; Cancel exits | Drag handles using fresh CSS DOM geometry; verify displayed in/out and duration; commit once; wait for Agent and inspect the new playable ID | native-trim-ready/submitted/result: 0-3 seconds returned 72 frames at 24 fps, 1280x720 with AAC audio; full decode passed |
| Extract still | Selected video > Extract Frame > timeline > Extract frame; Cancel exits | Scrub using current timeline bounds; verify preview/time; commit once; wait through Extracting, identify new image on canvas, Fit to view then select/download | native-extract-last-ready/submitted/result: 3.0/3.0 seconds returned 1280x720 still; compared against frame 71 of the 72-frame trimmed clip |
| Stitch clips | Selected video > toolbar Stitch > select further clips > final Stitch > native timeline > Export (Experimental) | Verify numbered order before final Stitch. That creates an editable timeline, not a movie. Inspect timeline duration/aspect and click Export once; wait for Agent result and verify all joins/audio | native-stitch-ready/editor/export-ready/export-submitted/result/downloaded: full decode passed, 313 frames, 13.041667 seconds; frames 71/72 matched the ordered source boundary |
| Crop image on canvas | Selected still > Crop > crop rectangle > Crop image (visible label Crop); Cancel crop exits | Adjust corner/edge using current DOM bounds, verify rectangle, commit once; wait through Cropping/Uploading, fit and select new image; download and inspect dimensions and framing | native-crop-ready/submitted/result: independent 923x517 image returned; framing matches resized source crop but output was smaller than source-pixel rectangle estimate |
| Crop image in detail | Selected still > Full Screen > Post details Crop > rectangle | Inspect live Crop/Cancel controls before adjusting/committing; preserve required aspect and identity | Native detail crop shown in the creator's screenshots; assistant did not commit this edit |
| Precise image edit | Selected still > Precise Edit, or detail Post details > Precise Edit > Brush size | Brush selected region only if the live tool exposes it; specify the intended local change through the current prompt flow; inspect anatomy, identity and outside-region preservation | 21-precise-edit: detail and Brush size opened; painting/submission unverified |
| Prompt image edit | Selected still > Edit prompt (Type to imagine...) or detail prompt | Name the local change and preserved identity/set/camera; inspect references and actual submit control; version result and update affected endpoints | Prompt surface observed; image-edit submission unverified |
| Extend video | Video detail > Extend > continuation prompt/settings > live submission | Inspect original endpoint and extension duration; specify next action; verify actual output/join; do not assume explicit LAST support | 32-extend: draft opened and Cancel Extend tested; generation unverified |
| Other image adjustments | Detail Colors, Aspect Ratio, Remove Background, Draw | Inspect current options; perform only the requested operation; review returned media and dependencies | Menus/tools observed; mutations unverified |

Evidence is in [UI-GUIDE.md](../UI-GUIDE.md) and [UI guide](../UI-GUIDE.md), with
DOM/screenshots and selectors. The initial standalone-editor audit exposed no
native numeric input/slider. The 2026-10-27 **Stitch per-clip editor** does expose
named trim handles and fade sliders; see [Stitch timeline](stitch-timeline.md).
Distinguish these surfaces and read actual values after adjustments.
Never guess an unseen prompt submission or brush mechanism from this table.

`CanvasPage.openTrim`, `openExtract` and `openStitch` in [pages.mjs](../pages.mjs)
open editors only. They do not trim, extract or assemble a movie by themselves.

The Marine one-second processed comparison exposed **Video too short to trim**
instead of Trim, while Extract Frame, Stitch and Download remained available.
Do not reject an otherwise valid processed asset because native Trim is absent.
The selection helper waits for Download on videos; native trim support is a
separate check. This observed one-second case does not establish the exact
minimum trim duration. Switch from Files to Canvas before focusing a canvas
result; Show on canvas did not make a video visible while Files remained active.
Capture every real commit and its result, and update knowledge.py. No edit commit
is needed merely to maintain this harness; exercise it during an authorized edit
or an explicitly authorized scratch test.

## Verified native recipes and limits

The 2026-10-07 scratch tests used independently registered copies in
**Harness QA - Native Editing**, preserving the finished movie and its
user-arranged canvas.

See [NATIVE-EDIT-QA.md](../NATIVE-EDIT-QA.md) for IDs, measurements and remaining limits.

- **Trim** sends a visible Agent instruction (`Trim from 0.0s to 3.0s.`).
  Its submission was POST `/rest/app-chat/conversations/{id}/responses`. The
  Agent processed and registered a new playable result. Do not click again while
  Stop/Thinking is present; record the returned ID separately from the source.
- **Extract Frame** produced a new image without a new Agent message. The upload
  and canvas create/update traffic were observed. Selecting the far right of a
  three-second timeline displayed `3.0s / 3.0s`; the returned image closely matched
  the last decoded frame (mean absolute RGB difference about 1.22/255), with small
  browser/encoding differences. This verifies that clip, not every duration/codec.
  Use local decoded endpoints when frame-exact or pixel-exact continuity matters.
- **Crop** also produced a separate uploaded image without an Agent message.
  The visible rectangle estimated about 1026x575 source pixels; output was 923x517
  and matched that crop rescaled to the smaller size. Its approximately 0.9 scale
  is consistent with the observed devicePixelRatio; that cause is an inference.
  Native crop is not yet a source-resolution guarantee. Download and check it;
  use a precise Agent/local crop if the loss is unacceptable. Detail crop remains
  untested. A freehand corner drag does not enforce an exact aspect ratio.
- **Stitch** has three stages: ordered selection, an editable native timeline,
  then **Export (Experimental)**. The export title explicitly says it sends an
  FFmpeg job to the Agent. The actual instruction listed both videos and their
  per-clip trims in order; POST responses was captured. Wait for media durations
  to settle: the initial timeline showed ten seconds, then corrected to thirteen.
  Source clips become children of the stitch group on this scratch canvas. Read
  selected order before export and verify the actual rendered cut afterward.

New Extract/Crop images may initially be outside the viewport and have no chat
Show on canvas bridge. Read their mounted image IDs, use **Fit to view**, wait
for its animation, then select the actual image and verify its toolbar/source.
An unchanged toolbar means selection did not succeed; do not edit the old tile.

## Precise edits through Grok Agent

This route was used for the Affordable Doctor review movie. Provide exact observed
source asset IDs, operation, in/out points or crop rectangle, output format and
audio intent in the Agent textbox, then Send once. Specify preservation of originals
and return of a real registered playable output. Agent-reported processing is not
the native toolbar commit flow or an intercepted private edit API.

Verified examples:

- Eyes insert: fixed 996x560 crop at x142/y0, scaled to 1280x720 and trimmed to
  58 frames at 24 frames per second. These numbers are specific to that source,
  not defaults for another shot.
- Rigid plague mask: one visual-only replacement take plus the retained original
  dialogue track, combined at time zero as a separate processed audiovisual asset.
- Assembly: ordered accepted/processed clips with hard cuts and a half-second
  black tail, returned as a registered movie asset and downloaded for full decode.

## Acceptance after any edit

Download the actual result. Decode, inspect the change and full-resolution defects,
extract actual endpoints, and check audio/cut tails. Register the new ID/file/hash
separately from raw and rejected takes. Update any continuation that uses its end.
Arrange the processed keeper in its scene row; keep original/rejected sources in
the nearby archive. Follow [asset-ledger.md](asset-ledger.md) and
[review-and-edit.md](review-and-edit.md).

Prefer a precise native/Agent edit when it solves the issue. If that route fails
or lacks the required precision, record the limitation before using the existing
local continuity/FFmpeg tools. Their output still requires inspection. Never claim
a complete native recipe from an opened dialog or a textual promise.

## Exact action assembly and local verification (2026-10-27)

Keep source frame ranges zero-based and half-open, and record the source fps,
speed and exact output-frame count for every keeper. Remove an unwanted visible
projectile with a cut only when the remaining action still connects; review the
join and synchronize the retained sound intervals. Use frame drop/repeat for
ordinary speed changes; optical flow can invent gun, hand and debris shapes.

Before concatenating encoded keepers, reset each video PTS and pad/trim its
decoded audio to exactly `keeper_frames / fps`, then reset audio PTS. AAC/container
padding can otherwise accumulate at joins, create duplicate video frames and
shift sound. A total-frame trim on an overlong concatenation does not repair
those internal boundaries. Require every cumulative cut frame and the intended
black-tail frame count, then verify the actual exported file.

Registered asset IDs in an Agent table do not prove that the clips are attached
to the response or placed on canvas. Request actual video attachments/Show on
canvas bridges when needed, and verify the node positions separately.

Chrome native **Save video as** is a download fallback: right-click the exact
large playback video, choose the visible native command, and inspect native
Save As before other browser actions. The dialog can arrive after a delay.
Use its File name field to save a versioned destination, verify the entered path,
then Save. Confirm a stable local file, decode it and inspect its actual visual
identity; do not infer identity from a delayed suggested filename. A native
Download click or a timed-out media downloader alone is not a saved artifact.

During the later Marine v3 review, the documented media locator's
`downloadMedia({timeoutMs:20000})` returned an actual local file; full ffprobe
confirmed551 motion frames and the reported short AAC stream. Earlier timeouts
do not make that route universally unavailable. Verify the returned file's
identity and stability, and copy/rename it to a versioned project filename.
## Transfer a local finished cut back to Grok

The canvas Upload Image control accepts images. For MP4, WAV, JSON and Markdown,
use the project **Files** panel: **Upload > Upload files**. Upload is a menu;
start the chooser wait on the Upload files menu item, not the parent Upload button.
Multi-file uploads may appear out of order. Verify each filename in the file tree.

In Ghost Strike R07, the existing local movie, all sixteen frame-accurate keepers,
PCM sound master, alert cue, edit map and review notes were uploaded this way.
Ask Agent to register those exact existing MP4 files as playable video assets and
return real video attachments with Show on canvas. State **no generation, edit,
re-encoding, assembly or layout change**. A table of IDs alone is insufficient.
Keep the source filename, local hash/frame count, reported registered ID and actual
node position separate. A reported server hash is not a local download check.

Arrange each registered keeper in its numbered row, retain raw/older comparisons,
and put the current full movie below the board. Then verify persistence after a
reload. The prepared keepers can be selected in shot order for native Stitch.
Do not infer arbitrary frame accuracy from the native trim UI's 0.1-second grid;
use local FFmpeg for exact frame selection, tempo, PCM joins and sound cues, then
verify the native export if it is used. Do not call a registration another render.
