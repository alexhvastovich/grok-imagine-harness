# Prompting and first/last-frame generation

Read after the shot plan and all image pairs have been inspected. The project,
named references, entire pair set, script, prompts and ledger must be populated
before the first video. See [project-preparation.md](project-preparation.md) and
[frame-continuity.md](frame-continuity.md).

Read [frame controls](frame-controls.md) for the mapped First / Intermediate /
Last / Loop / Reference attachment menu and the pre-submit role/settings check.
FIRST/LAST in prompt prose do not attach those images. The October 27 screenshot
showed an attached FIRST with empty middle/end controls despite naming both
endpoints, and a 10s UI setting despite a six-second prompt.

## Write one prompt per planned shot

Record the shot ID, duration/format, FIRST/LAST filenames and verified roles.
Describe the causal motion between those states, actor performance, camera
size/angle/lens/movement, set and character details to preserve, exact dialogue
and sound, plus mouth/mask behavior. Keep one camera setup per job; deliberate
cuts belong in the shot list, not an accidental internal cut requested by a vague
prompt. Respect the script and speech-safe narration rule. A text voice description
does not establish a saved voice identity.

Prompt pattern:

> Generate only [shot/take], [duration and format]. FIRST is [verified ID/file and
> visible identity]; LAST is [verified ID/file and visible identity]. Start at
> [state], move through [short causal beats], finish at [state]. Camera: [planned
> setup/movement]. Preserve [cast, wardrobe, props/hands, set, light, axis].
> Dialogue, spoken only by [speaker]: "[exact script]." Delivery: [performance].
> Sound: [intent]. Mouth/mask: [behavior]. No unrequested internal cuts or additions.

## Choose the correct live surface

For fast action, state the beat timing in addition to source length. For example,
request an already-started arm swing, release within the first fraction of a
second, fast exit of the prop from frame, then recovery/dust as the remaining
handle. Request normal real-time speed and avoid a posed wind-up. Match the LAST
image to the physical aftermath; an airborne prop as the endpoint can stretch
or freeze its trajectory. Verify supported duration choices rather than assuming
a requested three-second generation is available. Longer footage plus trimming
can remove lead-ins; slow motion within the useful action requires a coherent
retime or targeted regeneration. Review actual frames and sound synchronization.

| Route | Click/action sequence | Verification level |
| --- | --- | --- |
| Main explicit frame composer | /imagine > Video radio > Upload > Upload media (FIRST) > Add last frame (LAST) > prompt > resolution/duration/aspect menus > Submit | Pair preparation and submission observed; this account's job progressed then hit quota |
| Detail frame composer | Correct FIRST still > Full Screen > detail Make Video menu > Add Prompt (reveals frame strip) > Add intermediate frame if planned > Add last frame > verify filled thumbnails/roles > settings/prompt > separate Make video submission | Add Prompt and revealed frame controls directly observed again in the October 27 cover-exchange repair; LAST picker opened, but attachment completion and replacement submission were interrupted |
| Project Agent with uploaded pair | Canvas Upload Image > inspect pair IDs/images > matching Uploads attachments > Agent textbox with explicit roles/tool request > Send | Five scene jobs completed through Agent with actual playable downloads |
| Project Agent with existing Files | Confirm both filenames/images in Files > Agent textbox naming exact FIRST/LAST files > Send | Existing files registered and used for a playable shot |

**Canvas Make Video immediately submits Animate this.** Detail Make Video is a
menu (`aria-haspopup=menu`). Native canvas Generate Video opens another composer;
its FIRST/LAST role assignment was not verified. The October 27 user evidence
maps the image-role menu and intermediate slot. The later cover repair completed
both uploads, verified checked roles and configured Keyframe time at1.0s before
one three-frame submission. Inspect the actual output separately. Do not equate guides
with endpoints. See [frame controls](frame-controls.md) for selectors and examples.

Main composer settings observed: Video resolution, Video duration, Aspect Ratio
and Video audio. Menus included 16:9 Widescreen and 720p; re-check actual choices
and checked values live. Never assume image dimensions set the video aspect ratio.

Agent instruction adds: use separate literal `first_frame_asset_id` and
`last_frame_asset_id` in `imagine_reference_to_video`, not generic reference guides;
return the playable video ID and endpoint roles; generate this shot only with no
automatic retry. These are Agent-reported tool arguments, not separately intercepted
generation endpoint schemas. Inspect the resulting media and roles independently.

## Page-object preparation and result checks

- `ImaginePage.preparePair` prepares both endpoints/settings/prompt without submitting;
  inspect the returned state, then `submitPrepared({manifest})` for authorized motion.
- `AgentPage.importEndpointPair` imports images. Inspect actual identity/ID in a
  separate step; completion order can be reversed.
- `prepareInstruction` uses verified IDs; `prepareFromProjectFiles` requires both
  filenames in `project_files_verified`. Both prepare text without sending.
- `submitInstruction` is a separate Send. `assertProductionReady` checks the entire
  packet, named cast and all endpoint/prompt fields, not just the selected shot.

One active job; one submission. Capture prepared and resulting states. A quota/error
state invalidates stale playable media and progress. Verify the actual returned
asset, download/decode it, inspect its true endpoints and perform
[review](review-and-edit.md). Then place its keeper in the live scene row and update
the [ledger](asset-ledger.md). Main and Agent quota observations are separate.

## Production reference: The Oath

[Grok Imagine / Wonder Studios' October 27 workflow](https://x.com/imagine/status/2115214583983935517)
supports shot-grouped canvas comparisons, approved stills before motion and timed
middle keyframes. Its prompt structure separates camera, action, environment,
physics, audio, effects and constraints; shorten a failing prompt before adding
more instructions. Treat this as a useful structure, not mandatory boilerplate.
Its deliberately extreme handheld example is not a default for readable combat.
Actual frame attachments/roles still require the UI checks above.

The team reports about18hours for editing, sound and color. This is one production's
account, not a runtime estimate or a native Stitch tutorial. Keep generation,
editorial finishing and audiovisual review as distinct work to complete.
