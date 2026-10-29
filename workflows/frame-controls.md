# Frame attachments and role menu

Mapped 2026-10-27 from the creator's supplied evidence, then exercised in the authorized
cover-exchange repair. Actual FIRST / INTERMEDIATE / LAST attachments, checked
roles and a middle timestamp of1.0s were verified before one submission. Result
acceptance is recorded separately from preparation; see the evidence below.

## Read the attachment strip

```text
FIRST image  ->  INTERMEDIATE image(s)  ->  LAST image
video starts     image appears mid-video   video ends

REFERENCE image: guides the video; no endpoint role
LOOP image: starts AND ends the video
```

An empty plus/camera icon is an add control, not an attached frame. In the
supplied DOM, `frame-group-pill` contains one image, then
`frame-pin-mid-zone` with **Add intermediate frame**, then **Add last frame**.
Thus the pictured draft has one attached FIRST and empty middle/end slots.
Writing FIRST/LAST filenames in the prompt does not fill those slots.

## Image role menu

**Right-click the attachment's `.cursor-grab` wrapper** to open the role menu.
Read the settled DOM: roles are buttons with `aria-pressed`, not menuitemradio.
Left-clicking its `img` opens **Image preview**; close with **Close preview**.
Do not use dynamic `base-ui-*` IDs. Scope wrappers within `frame-group-pill` or
`frame-pin-mid-zone` and identify the intended thumbnail before right-clicking.

| Menu option | Description displayed by Grok | Intended use |
| --- | --- | --- |
| First frame | Image starts the video | Opening composition/state |
| Intermediate frame | Image appears mid-video | A required state during the action |
| Last frame | Image ends the video | Ending composition/state |
| Loop | Image starts and ends the video | Return to the same image at both ends |
| Reference | Image guides the video | Visual guidance without assigning an endpoint |

These are roles on an image attachment, not instructions to mention in prose.
Selecting a different role changes the draft; map-only inspection need not do so.

## Reveal the frame controls with Add Prompt

Directly exercised in the cover-exchange repair on 2026-10-27:

```text
Select the correct FIRST still on the canvas
  > Full Screen
  > detail Make Video menu (aria-haspopup="menu")
  > Add Prompt
  > FIRST thumbnail -> Add intermediate frame -> Add last frame
  > attach the planned images and inspect their roles
  > set matching duration/audio/resolution/format and write the motion prompt
  > separate Make video submission
```

**Add Prompt is the step that exposes these attachment controls.** Wait for the
menu animation to settle and re-read the composer; the immediate snapshot after
clicking Add Prompt can still show the old menu and unnamed controls. The settled
cover-exchange draft showed the verified FIRST asset
`<observed-asset-id>`, empty middle/end controls, native audio
enabled, 720p and 10s. Opening the prompt is preparation, not generation.

Do not use canvas Make Video to reach this state: that action submits immediately.
Do not substitute an Agent message naming endpoints when the task is to use and
verify the explicit composer controls.

## Prepare a shot

1. Use the explicit frame composer or detail **Make Video > Add Prompt** route
   in [prompting and generation](prompting-and-generation.md). Canvas **Make
   Video** immediately submits and is unsuitable for inspecting a draft.
2. Inspect the attached opening image and its role. If starting from a selected
   canvas still, verify that it is the intended FIRST, not merely the last tile
   selected. Compare its actual thumbnail and asset ID with the shot ledger.
3. Use **Add intermediate frame** for a planned middle state, and **Add last
   frame** for the endpoint. Both controls' actual chooser/upload flow completed
   during the repair, using the documented filechooser waiter plus setFiles.
   The cover-exchange repair confirmed that Add last frame opens a native Windows
   Open dialog. Arm and retain the filechooser waiter before clicking. A page
   snapshot can remain unchanged while that native dialog is open; do not click
   the upload button again or interact with the page behind it. Confirm the new
   thumbnail after upload, not merely that a file path was entered in the picker.
4. Inspect the filled strip and each role. A prompt naming three files with only
   one thumbnail attached is not a prepared three-frame shot. Record file/asset
   identity and role separately from prompt prose.
5. Inspect the actual duration, aspect, resolution and audio controls. Match the
   prompt to these settings. The supplied example said SIX-SECOND while the
   control showed **10s**, **720p**, **16:9**. Do not assume prompt text overrides
   duration. Reconcile before an authorized submission.
6. Submit separately only for authorized production. Inspect the resulting motion
   and decoded endpoints; a checked role is preparation evidence, not proof the
   generated video follows it exactly.

Verified selector anchors from the creator's pasted DOM:

```javascript
tab.playwright.getByTestId('frame-group-pill');
tab.playwright.getByTestId('frame-pin-mid-zone');
tab.playwright.getByRole('button', {name:'Add intermediate frame', exact:true});
tab.playwright.getByRole('button', {name:'Add last frame', exact:true});
```

Scope these to the current composer and inspect uniqueness. Intermediate-count
limits, reorder behavior and changing an existing attachment to another role
remain untested. Public API capabilities do not establish the consumer UI contract.

## Set an actual intermediate timestamp

1. Set source duration first. A new middle attachment defaulted to5.0s in a10s
   draft. Changing duration to6s **retained5.0s**, so re-check the pin afterward.
2. Right-click the middle wrapper in `frame-pin-mid-zone`. Click the pressed
   **Intermediate frame Image appears at [time]** button to reveal **Keyframe
   time**, an accessible slider.
3. Focus the slider with its locator and use ArrowLeft/ArrowRight. One ArrowLeft
   changed5.0 to4.666666666666667 (badge4.7s), a one-third-second step. Eleven more
   reached1.0s exactly. Home did not change the value in this observed control.
   Inspect `aria-valuenow`/`aria-valuetext` after adjustment, not just the prompt.
4. Observed bounds:1/3 to9+2/3 seconds for10s;1/3 to5+2/3 for6s. These are live
   UI observations for these drafts, not inferred API limits or all-mode promises.
5. Click the prompt textbox to close the popover without Escape. Confirm the
   middle thumbnail badge and save the prepared state before submitting.

```javascript
const middle = tab.playwright.getByTestId('frame-pin-mid-zone');
await middle.locator('.cursor-grab').click({button:'right'});
// Inspect the current accessible button name before clicking its time submenu.
const time = tab.playwright.getByRole('slider', {name:'Keyframe time', exact:true});
await time.press('ArrowLeft');
// Read aria-valuenow and aria-valuetext before further adjustment.
```

The attached file's source time and the configured pin time are different fields:
the repair uses original T01 frame37 (source1.5s) as a new pin at output1.0s.
This configures model input timing; it does not guarantee pixel-exact adherence.

## Example: fast grenade throw

Design the three images in the same camera/set: FIRST with the arm already
moving, INTERMEDIATE with the empty throwing hand and the single released grenade
clear of the fingers, LAST with the grenade out of frame and the actor returning
to cover. An airborne grenade as LAST can encourage a prolonged hanging tail.

After those actual roles are configured, write a motion prompt such as:

> One continuous shot, real-time action. FIRST: [opening file/asset], arm already
> swinging. INTERMEDIATE: [release file/asset], one grenade released, empty hand;
> this is the release beat, not a pause. LAST: [aftermath file/asset], grenade has
> left the frame and the Marine withdraws behind cover. Release promptly, then
> continue the follow-through and withdrawal. Preserve camera, grip, screen
> direction and cover. Synchronized throw, armor and distant gunfire sounds.

Set supported source duration in the UI and put that same duration in the final
prompt. Request beat timing where useful, then inspect motion before selecting
in/out points. A middle pin may improve the required action state; it is not a
verified cure for slow motion. Keep source takes and regenerated variants beside
their corresponding scene row.

## Evidence and current limitation

The October 2026 observations came from live UI inspection and user-supplied
screenshots/DOM. Original captures, account identifiers and project files are
private and omitted. A draft showed a planned LAST image assigned First; this
establishes a role mismatch in that draft, not a conclusion about all jobs.

Later preparation verified populated FIRST/LAST thumbnails, an Intermediate
pin and a configured timestamp before one authorized submission. These are
historical UI observations, not automated end-to-end certification. Reinspect
current controls and inspect the actual output before accepting a keeper.
Intermediate count limits and arbitrary role reassignment remain unverified.
