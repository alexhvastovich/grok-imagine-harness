# Browser actions and verification

Use this module for selection, navigation, canvas movement and new evidence.
Read the installed browser skill before controlling its browser and reuse that
documented session. [pages.mjs](../pages.mjs) takes an existing tab; it does not
launch Playwright or connect to a new browser. [README.md](../README.md) explains
recorder setup. Do not initialize the browser again merely to load these modules.

## Verified entry paths

| Need | Where to click | What to verify |
| --- | --- | --- |
| Create story canvas | Imagine > New canvas | New canvas URL/sidebar identity; creation was tested |
| Name the project | Project sidebar Options > Rename > editing textbox > Save | Correct sidebar name; tested |
| Persist story details | Files > Upload > Upload files > native chooser | PROJECT-DETAILS.md appears and opens; Settings did not expose an instructions form in this audit |
| Create named cast | Agent Add images > References > New | New reference dialog; see project-preparation.md |
| Import scene images | Canvas > Upload Image > chooser | Actual thumbnails and IDs; do not infer FIRST/LAST from completion order |
| Focus chat result | Exact result's Show on canvas | Correct media identity; wait for focus animation |
| Select focused tile | In a separate tool call, click its visible image/video | Intended tile selected and correct toolbar shown |
| Inspect image tools | Selected still > Full Screen | Correct detail image and Post details panel |
| Reveal explicit video frame controls | Correct FIRST still > Full Screen > detail Make Video menu > Add Prompt | Settled composer shows FIRST thumbnail, Add intermediate frame and Add last frame; attach actual images before submitting |
| Inspect video tools | Selected video > Full Screen | Correct playable asset and original prompt |
| Download a keeper | Select verified tile > Download | Completed native download, actual identity and full decode |

Ground locators in current DOM. Buttons with the same name occur on different
surfaces. Scope to the complementary canvas panel, application, dialog or Post
details as appropriate; stop and re-inspect ambiguous matches. Thumbnail indices
and stored tab IDs are not stable asset selectors.

Page-object bridge: `CanvasPage.focusAsset(assetId, kind)` and, in a separate
browser call after checking settled state, `selectFocusedAsset(assetId, kind)`.
The helper requires a unique currently rendered Show on canvas result. If that
result is absent, select from the current screenshot and identify the mounted
node instead; do not invent another navigation API.

## File chooser discipline

Inspect an existing file input's visible DOM attributes to learn allowed media
types. Do not click Upload merely to inspect them: that opens a Windows file
picker and can interrupt the user. Canvas Upload Image was observed accepting
image formats only; it is not a verified MP4 import route.

For a real authorized upload, arm the documented `waitForEvent('filechooser')`
handler before the upload click, await both together, then use the returned chooser
to set the intended files. The `uploadVia` helper in pages.mjs follows this pattern.
Do not discard the returned chooser or repeat the click after an unknown outcome.
If a system picker remains open, dismiss it once through a supported native-dialog
control or ask the user to Cancel when desktop control is unavailable. Resume only
after closure is confirmed. Do not send page clicks behind a pending system dialog.
When testing edit tools, prefer existing registered assets on the scratch canvas
over unnecessary upload prompts.

## Select and drag existing tiles

1. Inspect the current tool button. If Hand Tool is active, open its menu and
   choose **Select Ctrl+S**. If another tool is active, use its current menu to
   reach Select. Do not click a remembered bottom-bar coordinate.
2. Use the native screenshot to find the intended tile and click it. In a separate
   step inspect its mounted `.react-flow__node`, visible media and `data-id`.
   At low zoom unselected tiles may have no DOM node; that is not proof of absence.
3. Check native screenshot dimensions, CSS viewport and the browser interaction
   coordinate contract. The audit saw devicePixelRatio about 0.9, 2133 CSS pixels
   and a 1920-pixel screenshot. A displayed/resized screenshot adds another scale.
   Never apply a stored conversion blindly or use an image viewer's display size.
   In the native trim/crop scratch tests, Cua drag accepted CSS DOM coordinates:
   a drag using scaled screenshot pixels did nothing, while current DOM handle
   coordinates changed the range. Use fresh getBoundingClientRect geometry for
   mounted handles, and verify the displayed result before committing.
4. Drag from a verified interior point to a nearby reserved cell within the visible
   canvas, using the documented Cua drag path. Inspect before/after node position,
   asset identity, overlap and spacing. If unchanged, re-check tool/coordinates
   once; do not loop the same unverified drag. Native focused-node Arrow keys
   (one canvas unit) and Shift+Arrow keys (ten) were an observed fallback.
5. Hand Tool > drag blank canvas pans the view. Zoom/Fit and keyboard movement
   can change bounds or unmount media; re-inspect before the next tile.

Follow [canvas-organization.md](canvas-organization.md) for compact row placement,
live overview/readable-row checks and persistence after reload. Do not disturb
a layout the user has finished. In the example production Alex completed the
arrangement manually; the final capture does not verify automated full-board layout.

## Observe, then record

For each new behavior save DOM, elements/bounds, screenshot and passive request
metadata using `recorder.capture`. Inspect only visible DOM; do not inspect hidden
React/app state or replay private APIs. Keep redaction/truncation flags.

Label results **opened**, **prepared**, **submitted**, **playable**, or **reviewed**
according to the evidence. Record expected/actual outcome. An HTTP success, progress
percentage, copied ID, old preview or Agent statement alone is not a reviewed asset.
Update [ISSUES.md](../ISSUES.md) and the relevant click path when a failure changes
how the next session should act. [VALIDATION.md](../VALIDATION.md) records limits.

## Recovery and evidence limits

Separate failures by surface. Missing Agent layout tools can be handled through
the direct canvas. An unavailable passive CDP recorder can be handled by the
documented DOM, element-bound and screenshot APIs, with an explicit network-
unavailable record. Neither limitation proves that generation or the product's
own controls are unavailable. Do not start another automation connection.

An automatic verification overlay can temporarily block a drag or Send. Inspect
the latest state before acting or asking the user for help. If it clears without
interaction, continue the pending authorized step; do not solve a challenge or
ask the user to find a dialog that has already disappeared. If user participation
is still needed, identify the actual tab and current visible control.

Keep the three upload namespaces distinct: Canvas Upload Image creates media
nodes and asset IDs; Files Upload imports documents into the file tree; named
Character references save reusable identity guides. A canvas image need not appear
as a named Files entry, and replacing a Character guide does not revise existing
endpoint images. Verify the intended namespace instead of repeatedly re-uploading.

For native downloads, inspect a pending Save As dialog before sending keys. If
the user changes the window or the tool reports user input, refresh that dialog
state first. Do not type into a vanished dialog or emit unrelated desktop data.
If the dialog has already closed, inspect the actual new file: verify its stream
metadata, decoded image identity and hash before copying it into the project.
The basename alone does not identify a generated take.

Where the browser tool exposes a documented media-download method, scope it to
the exact observed playable video on the canvas. This session's
`locator('video[src*="<verified asset ID>"]').downloadMedia(...)` returned local
MP4 paths for Marine sources 6 and 7; both full timed video/audio decodes passed.
The returned generic basenames differed from the asset IDs, so retain that
provenance and verify the media before naming the project copy. This is a
supported browser-tool download, not a private endpoint replay.

A download-tool timeout can leave a real Save As dialog or a download that
finishes later. Refresh the task dialog and check stable files before starting
another download. Do not reuse a cached native element index after the dialog
has closed or another observation changed the app's cached state. Source 9
finished under both generic and asset-named basenames after such a timeout;
preserve provenance and avoid treating the duplicate as another generated take.

On Windows, a modal Save As can appear in the main app's accessibility tree
while coordinate/index clicks fail the target-window check. Re-read the dialog
and verify the exact task filename and destination. In the Marine source-10
download, the normal `Alt+S` Save shortcut closed that verified dialog and the
expected MP4 arrived and fully decoded. Use this only while the task Save As is
actually present; a stale index or a vanished dialog is not permission to type
into whichever window is active. Do not change browser-wide download settings.

Let native Download finish before changing a view that may unmount its node.
An absent file is still unresolved; do not count the source as locally saved.
Check the actual stable download or use the documented observed-media method.
If an internal browser downloads page is policy-blocked, do not reach it through
another surface; continue from Grok's allowed media surface instead.


### Fresh-tab recovery and native Save As
In the2026-10-27/28 session, old claimed tabs repeatedly reported Debugger unattached while native Chrome still worked. A fresh tab created through the SAME selected browser and exact project URL recovered documented DOM control. Do not create another automation connection or repeatedly retry the same stale handle. Preserve the working tab and close only its unnecessary agent-created predecessor when safe.

A downloadMedia timeout may have opened a native Save As dialog rather than failed to transfer. Inspect native Chrome before another browser action or retry. Complete the existing dialog with a versioned project filename and verify actual bytes, video identity, probe and decode. Do not leave a hidden Save As dialog pending behind browser automation.

During R08, direct file-protocol playback was rejected by browser policy. Do not
retry the blocked protocol through native address/Open commands or another browser
surface. Continue separately authorized project upload/registration work through
the normal Files chooser, then inspect its ordinary HTTPS asset preview.

Repeated screenshot capture can be much slower than its first batch. A20-capture
playback batch timed out and reset control despite an earlier10-capture batch
finishing quickly. Use very small batches and checkpoint each observation, including
time/rate/muted state, immediately. Sparse screenshots of a1x player do not prove
continuous perceptual motion review, and sound enabled does not prove listening.
Preserve that limit rather than labeling a partial run a completed audiovisual pass.


For multifile uploads, verify every expected filename in Files after the upload notification clears. A progress counter reaching its last item can still leave that item absent. R08v3 notes and movie arrived but the ending keeper did not; registration correctly reported it missing. Retry only the missing file after checking current verification state; do not count attempted selection as an upload or fabricate a registered asset ID.


## Before/action/after evidence for each new operation

Before clicking, inspect the current DOM, confirm the exact target identity,
button surface and function, and take a screenshot showing its context. Do not
click a control merely to discover whether it submits: canvas Make Video and
detail Make Video have different behavior. Record the expected effect first.

After the bounded action, inspect fresh DOM and take a screenshot of the actual
result before choosing the next step. Store captures with the operation, source
asset/node identity, expected versus actual result and honest verification level.
Include passive network metadata when available; otherwise record why unavailable.
If an initial step has only tool DOM snapshots, label that evidence partial. A
later screenshot documents its own state, not the missing earlier state.

Treat browser-runtime failures separately from product results. A closed tab or
an unsupported module import does not prove a Grok feature failed. Refresh tab
inventory after closure, preserve the production checkpoint, and apply the current
browser recovery policy. An automation error saying a target is closed does not
prove the actual user tab closed: inspect fresh inventory and an allowed native
screenshot/AX view before choosing recovery. If DOM access is unavailable, record
that limitation and the actual screenshot/AX evidence; do not call it DOM proof.
Do not replay an uncertain submit or keep clicking through a detached handle.
