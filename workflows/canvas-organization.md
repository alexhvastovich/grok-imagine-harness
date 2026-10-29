# Keep the actual Grok canvas compact

Alex requested this on 2026-10-07 after generated clips formed far-apart blocks.
Organize the live canvas, not just a local gallery or a written plan.

Before motion, arrange the inspected pairs in numbered adjacent scene rows with
nearby labels. Each row reads left to right: FIRST, LAST, chosen VIDEO. Place
character masters immediately above. Keep the complete review movie immediately
below the last row. After each generation/edit, move its actual chosen video into
that scene's reserved video position; do not let automatic placement accumulate
large gaps. Keep rejected/raw/duplicate nodes in a compact labelled source section
next to or just below the main storyboard. Preserve source assets and IDs.

For the Marine revision, Alex explicitly requested replacements stay in their
corresponding scene rows. Keep T01 and T02 adjacent in that same numbered row,
with frame/take versions and current keeper status labelled. If replacement
endpoints change, extend the row with another adjacent FIRST/LAST/TAKE triplet.
Preserve the original triplet for comparison; do not hide an earlier take by
stacking a replacement over it or leave the replacement in a distant auto-layout
block. Apply the user's chosen arrangement before a generic archive template.

Suggested grid in canvas units: 400-pixel-wide 16:9 tiles, 24-pixel horizontal
gaps, 45-pixel label/vertical clearance; columns x=0,424,848; row pitch270.
Character row y=0, scene one y=300, following rows advance270. Movie begins about
65 pixels below the last scene tile. Source section follows the movie with the
same spacing, using four columns if needed. Adapt sizes to live controls while
preserving aspect ratio. Avoid overlaps, isolated distant groups and long empty
canvas stretches. Never guess screen coordinates from these canvas units.

Use the signed-in Agent's available canvas list/move/update tools through its UI,
or documented browser drag interactions grounded in current DOM/screenshots.
Moving existing nodes is essential; adding nearby copies while leaving distant
original nodes does not fix Fit to view. Ask for existing-node movement only,
no media generation/deletion. Save actual node IDs, asset IDs and positions in
CANVAS-LAYOUT.json in project Files. Group scene rows when supported.

Verify the result in the live canvas with Fit to view, a DOM snapshot, a screenshot
and non-overlapping nearby tile bounds. Verify one row at a readable zoom and
reload to check persistence. An Agent's textual promise is not verification.
Record unsupported operations honestly and finish the arrangement through the
available UI when possible.

Select the actual Select tool before clicking and dragging frames. Hand Tool
pans blank canvas; its active state must be checked again after other actions.
Separate selection from dragging so the current node DOM and bounds can settle.
Use native screenshot pixel dimensions, not a displayed/resized image's apparent
size. DOM bounds are CSS pixels; devicePixelRatio and browser zoom can make them
differ from screenshot pixels. Verify the browser tool's coordinate convention
and the resulting node position before moving a second tile.

Observed fallback: several video drags did not move their intended nodes; tool
mode and coordinate scale were confounding factors. Still and movie drags did
succeed. Focus the observed node test ID and
use its native Arrow keys (one canvas unit), or Shift+Arrow keys (ten units).
Verify actual position afterward. Low zoom renders unselected tiles without node
DOM; select from a fresh screenshot, then identify its mounted DOM node and visible
asset. Focus/keyboard movement can change the viewport; re-inspect before selecting
the next tile. Do not describe a failed drag as successful or a planned layout as
persistent. See ../ISSUES.md. Alex completed this production's layout manually;
preserve the user-organized board rather than applying the earlier Agent plan.

Large keyboard moves can unmount a selected node when it leaves the viewport.
Use bounded batches (48 Shift+Arrow presses worked at 150% in the Marine run),
refocus the exact asset through its Show on canvas bridge, inspect, then resume.
Read actual positions after each batch. A selector timeout may mean a partial
move already happened; never replay the full count without reading the position.
Native drag attempts in that run moved only a small fraction of the intended
distance, so they are not verified as precise world-coordinate placement.

## Direct UI verification, 2026-10-27

The Marine fight project was arranged through direct drags and native Text:
32 endpoint tiles in 16 labeled FIRST/LAST rows, three cast tiles above,
reserved VIDEO space and a final-edit placeholder below. All 35 media positions
and 23 labels were checked after reload. The Agent's lack of layout tools did
not prevent this workflow; do not present that limitation as a canvas blocker.

At low zoom, first hover/click the visible tile to mount its node, inspect its
identity and bounds, then select that exact mounted node before acting. Separate
these steps when the node has not settled. After dragging, inspect the position
again after deselection and reload; an immediate optimistic transform alone is
insufficient. Automatic viewport panning near an edge changes the world-space
result, so use an intermediate destination and re-read current geometry.

Native labels: Text > click a clear canvas location > fill the observed
`.atlas-text-pm[contenteditable="true"]` editor > set the visible Font size field
> Enter > click blank canvas. Record the resulting textBlock node. This project
used font size 32; that is an example, not a universal requirement.

Transient automatic verification overlays interrupted some inputs. Wait for the
current overlay to clear and inspect the result; never count a blocked drag as a
move, and never ask the user to solve an already-cleared check. If a challenge
requires interaction, follow the current browser confirmation policy.

## Additional selection and movement observations

The canvas accessibility description explicitly says Enter or Space selects a
node, then Arrow keys move it. On a mounted exact node, locator `press('Enter')`
selected the intended ID reliably in the Marine repair run. Verify the actual
`.react-flow__node.selected` ID before moving; focus and a visible toolbar can
belong to a previous asset. A low-detail overview click can open image detail
instead of mounting a selectable node. Zoom until the intended node is mounted,
then use the supported keyboard selection.

Tab-level drag with fresh CSS DOM bounds moved both stills and video tiles.
Drag from an upper interior area, clear of a video's Play button. Large moves
needed a correction, and displacement differed between viewport states. Do not
store a universal multiplier, device-pixel ratio or assumed drag distance.
Read the actual resulting world position and finish with Arrow/Shift+Arrow.
Keep each browser call bounded; a long multi-asset helper timed out and reset
the control session, leaving partially completed moves that must be inspected.

When the user is working in another tab, compare the native active Chrome tab
with the tab being inspected before coordinate input. In this run, background
DOM observations remained available while some inputs did not affect the
intended surface; activating the repair tab restored the expected controls.
Re-read geometry after the user moves/resizes the browser or changes monitors.
Native input completion and its immediate screenshot can lag: inspect a fresh
settled screenshot before repeating an apparently unchanged paste or navigation.


### Bound keyboard work and preserve recovery state

Use the reusable [bounded keyboard helper](../canvas-ui.mjs) inside the existing
documented browser session. It reads public node DOM/positions, verifies selection
and returns the actual remaining delta. It never opens a browser connection.
An assetGroup can snap differently from an image/video tile; do not infer its
movement from key counts. Inspect its public `.drag-handle` and use that handle
when moving the native Stitch container, preserving the timeline controls inside.
Keep repetitive browser calls below about25seconds and at most50 key presses per call. A longer four-node batch reset the persistent runtime even with a larger timeout. Save asset/node IDs and last observed positions before a batch; after interruption, read actual positions and resume the remaining delta. Do not replay original counts.

If a pointer selects only the low-zoom bitmap/blank canvas, check whether the expected node has now mounted. Select that exact mounted node with Enter, verify its selected data-id, then move it. Never move an unexpected selection. One image repeatedly reverted after a drag despite an optimistic transform; bounded keyboard movement placed it persistently. Read again after deselection/reload.

## Imported video cards and persistent row spacing (R07 observed)

Registered1280x720 MP4s can display400x400 unselected cards after reload. Selecting
loads intrinsic metadata and shows400x225 temporarily. Native corner resize
persisted width only, with a300px minimum; height became square again after
reload. The Agent schema had no existing-asset width/height/aspect layout fields.
Do not regenerate, re-register or repeatedly resize correct footage to fix this.
Measure unselected cards after reload and space rows for that actual height.
Ghost Strike changed the nominal pitch from270 to420px, preserving every source.

At low zoom, asset tiles can be bitmap proxies. Clicks may mount only the latest
asset and discard earlier selection. At about40percent working zoom, visible
cards mounted as individual nodes; Shift+Enter added exact mounted node IDs to
selection. Verify the complete expected ID set before moving a row. Shift+Arrow
then moved the whole selection10world units. Move bottom-up, checkpoint actual
positions after each row, and read all items again after reload. These zoom and
movement values are observations, not a site guarantee.

Hand Tool can still drag a media tile when the drag starts on it. Pan from a
verified blank canvas margin, not an assumed empty point at the right. Compare
all resulting positions with checkpoints: one misplaced keeper and one stale
endpoint position were corrected during the final audit. Test rectangle overlap
between adjacent rows using the reloaded public DOM sizes, then inspect an
overview. Keep old layout evidence versioned; do not leave an old accepted layout
as the current source of truth.
