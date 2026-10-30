---
name: grok-imagine-harness
description: Direct and edit multi-shot films in Grok Imagine using named character references, planned first/last images, verified browser actions, a compact canvas and an asset ledger. Use for Grok film production, targeted edits or maintaining this harness.
---

# Grok Imagine production driver

This is the main operating file. Resolve links relative to this folder. Read only
the relevant modules below, then follow their click paths in the current live UI.
The assistant directs images, composition, continuity and editing; Grok generates
motion. User corrections override historical examples and defaults.

## Execution index and resume tags

First read the production's `RESUME.md` when present and its current manifest.
Continue from the last verified state and the earliest pending prerequisite.
Keep completed stages complete; revisit only work invalidated by a correction.
Local files alone do not complete pending uploads, reference registration,
canvas organization, composer configuration, generation or live verification.

Use these tags for the same six stages defined below:

| Tag | Stage | Supporting module |
| --- | --- | --- |
| `STAGE:01` | [Plan coverage](#1-plan-coverage-before-images) | [Project preparation](workflows/project-preparation.md) |
| `STAGE:02` | [Review every planned frame](#2-check-continuity-across-all-planned-frames) | [Three-frame preflight](workflows/three-frame-preflight.md) |
| `STAGE:03` | [Plan joins](#3-plan-smooth-joins-continuations-and-cuts) | [Join planning](workflows/join-planning.md) |
| `STAGE:04` | [Verify UI and generate one shot](#4-verify-every-browser-action-and-generate-one-shot) | [Frame controls](workflows/frame-controls.md) |
| `STAGE:05` | [Track takes and edits](#5-track-every-take-and-targeted-edit) | [Asset ledger](workflows/asset-ledger.md) |
| `STAGE:06` | [Review and deliver](#6-review-the-sequence-and-hand-it-off) | [Review and edit](workflows/review-and-edit.md) |

Keep identifiers separate and consistent in notes, manifests and canvas labels:
`SHOT:s01`, `ROLE:FIRST|MIDDLE|LAST`, `TAKE:t01`, and
`STATUS:prepared|submitted|playable|reviewed`. Use one actual value per tag, such
as `STAGE:04 SHOT:s01 ROLE:MIDDLE TAKE:t01 STATUS:prepared`. A prepared frame or
draft is not a submitted job; a playable result still needs its recorded review.
Record which review was performed and any pending checks. These execution tags
do not change the channel queue's status values or schema.

## Choose the task

| Request | Read next | Work to complete |
| --- | --- | --- |
| New film or new sequence | Follow stages 1-6 below | Complete the production packet before the first video |
| Action scene, firefight, chase or combat revision | [Action sequence library](workflows/action-sequences.md), then stages 1-6 | Choose film-informed coverage, choreograph changing positions and carry damage through the shot plan |
| Revise a frame | [Native editing](workflows/native-editing.md), [staging](workflows/cinematic-staging.md) | Edit the verified image, inspect it, version it and update affected pairs |
| Trim, cut, stitch or improve scene transitions | [Join planning](workflows/join-planning.md), [editing grammar](workflows/editing-grammar.md), [Stitch timeline](workflows/stitch-timeline.md), [native editing](workflows/native-editing.md), [review](workflows/review-and-edit.md) | Plan each adjacent pair, test action and sound handoffs, preserve sources and verify the export |
| Compression artifacts, sharpness mismatches, tracked labels or unstable counters | [Finishing review](workflows/finishing-review.md) | Apply relevant checks; distinguish metrics, local proxies and actual platform review |
| Continue from a clip | [Continuity](workflows/frame-continuity.md), [ledger](workflows/asset-ledger.md) | Extract the accepted actual last frame and create the next endpoint |
| Arrange the canvas | [Canvas organization](workflows/canvas-organization.md), [browser actions](workflows/browser-actions.md) | Move existing nodes and verify the live arrangement |
| FIRST/intermediate/LAST roles or composer mapping | [Frame controls](workflows/frame-controls.md), [prompting](workflows/prompting-and-generation.md) | Verify actual attachments, checked roles and settings separately from prompt words |
| Inspect/map the app or repair automation | [Browser actions](workflows/browser-actions.md), [issue log](ISSUES.md), [site map](UI-GUIDE.md) | Capture current DOM/screenshots/passive traffic and update verified paths |

For edits, resume at the affected stage; do not create another project or regenerate
the entire film. Preserve a user's completed edit and manually organized canvas.

## Before browser work

Read [ISSUES.md](ISSUES.md) and [browser-actions.md](workflows/browser-actions.md).
Use the applicable installed browser skill and its documented session. Reuse the
signed-in browser; do not create another automation connection. Inspect the current
URL, DOM and screenshot before selecting an asset. Saved IDs need visual identity
checks. UI evidence is dated; re-map a changed surface rather than guessing.

The public [UI guide](UI-GUIDE.md) and [API notes](API-NOTES.md) summarize
historical observations. Private screenshots and generated evidence maps are
not bundled; make your own local captures when needed. Observations are not
permission or a supported contract for replaying private endpoints.

## 1. Plan coverage before images

Read [project preparation](workflows/project-preparation.md),
[shot design](workflows/shot-design.md) and [staging](workflows/cinematic-staging.md).
Create or confirm the named project, locked script/details and named cast masters.
Break the script into beats, then design motivated wide, medium, insert, close-up
and reverse/reaction coverage. No fixed shot count: each shot needs a dramatic
purpose, camera/size, action, duration and intended next cut.

For action, read [action-sequences.md](workflows/action-sequences.md). Choose
patterns that fit the cast, location and requested tone, then translate them into
specific blocking and shots. A film title or the adjective "cinematic" is not
choreography. Plan how cover, movement, obstacles and reversals change the fight.

Record the set geography, lens/camera height, action axis, eyelines, screen
direction, props/hands, lighting, dialogue and sound in the shot plan. Use
[asset-ledger.md](workflows/asset-ledger.md) to track shot, take and asset roles.
Pass this stage when the cast/set and ordered shot/cut plan are explicit.

## 2. Check continuity across ALL planned frames

Use the active image-generation skill/tool for endpoint images. Generate and
inspect every shot's FIRST and intended LAST before any video generation. Review
the entire storyboard beside the character masters and set plan: identities,
wardrobe, body/depth scale, perspective, props, anatomy, light and screen direction.
Reject broken composition before uploading current keepers.

For every shot, decide whether a middle action state needs an INTERMEDIATE
frame. If needed, create and inspect it with FIRST/LAST before motion, record
its intended beat/time and verify the actual attachment role and Keyframe time
in the live UI. Read [frame controls](workflows/frame-controls.md). Set duration
first and recheck the pin after changes; prompt text alone does not configure it.
Include planned middle frames in storyboard review and adjacent canvas rows.
Readiness helpers validate declared middle files/review/timing, but do not
attach them or establish live roles. Use the [three-frame preflight](workflows/three-frame-preflight.md)
for the separate current-shot composer evidence gate.

Every shot needs both real files, even when it ends in a deliberate cut. Write ALL
motion/dialogue prompts only after the image plan is inspected; follow
[prompting and generation](workflows/prompting-and-generation.md). Fill the project
with all pairs, script, prompts and ledger; verify filenames and visible identities.
Arrange adjacent FIRST/LAST/reserved VIDEO rows on the actual canvas before motion.
Pass when the whole packet is populated and every pair/prompt is ready, not merely
the shot currently selected. `assertProductionReady` in [pages.mjs](pages.mjs)
checks existing packet/cast/pair/prompt flags; visual and coverage review still
require inspection, not a successful function return.

## 3. Plan smooth joins: continuations and cuts

Read [frame continuity](workflows/frame-continuity.md),
[join planning](workflows/join-planning.md) and
[editing grammar](workflows/editing-grammar.md). Record an outgoing/incoming
action-phase match, picture cut and sound handoff for every adjacent pair
before generation. Refine these against the actual rendered takes. Mark every boundary:

- Continuous action in the same camera: A -> B, then accepted actual B -> C.
  Use the exact decoded last-frame file of the accepted preceding take as the
  next FIRST. If it drifted from the planned end, update the next LAST from that
  actual image as needed before submitting the continuation. Preserve originals.
- Deliberate angle/location/size cut: create a new matching FIRST/LAST pair from
  the same identities and set. Match action time, eyelines and screen direction;
  do not force the previous camera image through an implausible morph.

Planned endpoint control does not promise a pixel-identical generated end. Review
the rendered result. Endpoints extracted from a processed keeper supersede raw
endpoints for subsequent joins, while the raw source remains available.

Matching endpoint images alone do not establish smooth motion. Check velocity,
screen position/direction and whether an action freezes, repeats or restarts.
Use intermediate frames to constrain a necessary beat inside a shot; review the
handoff between shots separately. After edits, recheck both neighboring joins.

## 4. Verify every browser action and generate one shot

Read [browser actions](workflows/browser-actions.md) and
[prompting and generation](workflows/prompting-and-generation.md). Select the
verified asset and correct UI surface. Prepare the draft, inspect FIRST/LAST roles
and settings, then submit once under the user's existing production authorization.
Use [frame controls](workflows/frame-controls.md) to distinguish First,
Intermediate, Last, Loop and Reference. Empty add-frame icons are not attachments;
prompt filenames alone do not configure frame roles. Verify an optional middle
image and match the prompt duration to the actual selected duration.
For a selected scene still, use **Full Screen > detail Make Video menu > Add
Prompt** to reveal the frame attachment strip. Then attach the actual LAST and
any planned INTERMEDIATE image through their controls. Inspect the filled strip
before submission; opening Add Prompt alone leaves only the selected FIRST.
For a middle pin, right-click its thumbnail wrapper > Intermediate frame >
Keyframe time. Set the actual slider and verify its timestamp after changing
duration; prompt timing alone does not configure it. See the frame-controls module.
Keep one active job. Capture the resulting state; quota errors override progress
and old playable media. Do not automatically retry an unchanged failed request.

Honor the user's review cadence. For a complete first pass, generate and download
all planned shots before selecting regenerations. Verify each job's real output,
identity and file integrity as it arrives, but keep visual acceptance pending.
Then review the whole sequence, make a targeted regeneration list, resolve it,
and assemble only after that review. Do not turn per-take review into an unwanted
stop-and-repair loop or treat a downloaded source as an accepted keeper.

For canvas movement confirm Select mode, settled selection and the browser tool's
coordinate scale. Drag the intended existing tile, then check changed node position.
A written layout plan or a textual Agent promise does not establish a moved canvas.
Place each generated/edited keeper into its scene row immediately.

Unavailable Agent layout tools do not establish a blocked canvas. Use the verified
direct drag, keyboard and Text workflow in [canvas organization](workflows/canvas-organization.md).
Check persistence after reload before calling the layout complete. Re-check any
automatic verification dialog before requesting user help; a cleared check needs
no handoff. Report the exact remaining stage and continue authorized work.

## 5. Track every take and targeted edit

Read [asset ledger](workflows/asset-ledger.md),
[native editing](workflows/native-editing.md) and
[review/edit](workflows/review-and-edit.md). Record planned frames, actual decoded
endpoints, raw clips, rejected takes, replacement visuals, processed audiovisual
clips and movie exports separately. Retain exact prompt/settings, hashes, observed
asset IDs and node IDs. A node ID is not an asset ID.

Use a native edit or precise Agent edit when it fixes the defect; do not regenerate
good shots merely to change duration, framing or audio handling. Name exact verified
sources and intended operation. Native toolbar dialogs are mapped but their commit
flows remain unverified until a real edited output is inspected. Record that status
accurately. After any edit, re-extract endpoints and update affected joins.

## 6. Review the sequence and hand it off

Refine every join using [join planning](workflows/join-planning.md) and
[editing grammar](workflows/editing-grammar.md): compare candidate outgoing/incoming
trim frames, retain readable cause/consequence, and design sound tails/leads with
appropriate perspective. Record chosen source ranges and transition/audio intent.
Inspect frames on both sides, then watch the passage and whole film with sound
at normal speed. The local assembler makes straight joins; it does not perform
these editorial decisions or prove smoothness.

Read [review/edit](workflows/review-and-edit.md). Review entire takes, consecutive
frames where needed, full-resolution defects and both sides of each cut. Check
story timing, composition, contact, character/prop continuity and all scripted
dialogue. Listen at normal speed for voice identity, sync and mix; ASR does not
replace listening. If a check cannot be performed, label it pending.

Assemble accepted processed keepers in the planned order with explicit in/out
points, transitions and audio intent. Decode and review the resulting export;
correct individual failing shots, not the whole sequence by default. Deliver the
movie/review cut, storyboard, ledger, project link and material review limitations.
Map/harness-only requests do not authorize new generations or publishing.

## Improve the harness after use

When adapting the creator's supplied Director pack, see
[adopted practices and local adaptations](workflows/director-pack-adaptation.md).
Its format presets, intake rules and runtime folder examples do not override
the user's locked brief, existing authorization or the channel's conventions.

For a new or changed UI operation capture DOM, visible elements/bounds, screenshot
and passive network metadata with [harness.mjs](harness.mjs). Record expected action,
actual outcome, failure reason and verification level. Update the relevant module
and [knowledge.py](knowledge.py), then rebuild with [build_map.py](build_map.py).
See [VALIDATION.md](VALIDATION.md) for what actually passed and
[ROADMAP.md](ROADMAP.md) for future work. Do not promote an observed control to a
verified end-to-end recipe without exercising its outcome.
