# Native Stitch timeline: trims, fades and export

Observed 2026-10-27 in the **Marine vs Space Marine - Ghost Strike** project.
Use [editing grammar](editing-grammar.md) to choose the cut and this page for UI
mechanics. Testing used two independent copies of existing raw shots; the
original scene nodes and exported film were preserved.

## Build and edit a sequence

1. Select the intended video, verify its selected node/source, then click its
   toolbar **Stitch**. A numbered `1` badge marks the first selected clip.
2. Click more clips in the intended order. Verify their numbered badges and
   the selection count. The final text **Stitch** button is separate from the
   selected clip's icon button with `aria-label="Stitch"`.
3. Click the final Stitch button. This creates an editable `assetGroup` timeline;
   it is not an exported movie. Selected nodes become children of that group.
   Inspect the actual preview strips in sequence: selection badges do not
   guarantee timeline order.
   Use independent comparison copies when preserving their original row placement
   matters. **Stitch settings > Unstitch** is exposed; restoration was not tested
   in this comparison.
4. Click an individual **clip strip** below the preview, not the large preview
   or time ruler. The clip editor shows `Clip N of source ...`, **Trim start**,
   **Trim end**, **Fade in** and **Fade out**. Close clip editor returns to the
   sequence view. Adjust another strip to edit its own source interval.
5. Read actual slider values and displayed trim duration after adjustments.
   The source trim handles are relative to that clip's source, not global movie
   time. The sequence duration and clip widths change after a trim.
6. Verify order, aspect ratio and every clip setting, then **Export
   (Experimental)**. This sends a visible per-clip FFmpeg instruction to the
   Agent. Wait for the actual new playable result and inspect/download it.

## Sliders and precision

- The observed 24-fps sources were 6.041667 seconds; trim arrows snapped to
  **0.1-second** values. The UI rounds displayed seconds to one decimal. This is
  not frame-accurate editing at 24 fps.
- On switching clips, keyboard focus on a thumb did not always activate the
  intended internal thumb. Clicking the actual thumb before arrow adjustments
  resolved the ignored input. Read `aria-valuenow`, not just focus styling.
- Fade in increased with **ArrowRight**. Fade out is visually reversed and
  increased with **ArrowLeft** in this UI. Both used 0.1-second steps.
- Fade sliders' observed maximum was **half the retained clip duration** and
  changed when source trims changed. Recheck values after trimming.
- Rapid arrow bursts sometimes left a delayed or intermediate readout. Verify
  the settled value before another adjustment or export. Home/PageDown did not
  change the tested trim end; do not assume those shortcuts work.
- Scope unnamed fade thumbs as `[aria-label="Fade in"] [role="slider"]` and
  `[aria-label="Fade out"] [role="slider"]`. The named container is not a
  semantically named `generic` locator in the browser API.

## What was exported

The native comparison requested:

| Order | Source interval | Fade |
| --- | --- | --- |
| 1 | 0.3 to 2.0 seconds (1.7 seconds) | out 0.2 seconds |
| 2 | 0.4 to 1.3 seconds (0.9 seconds) | in 0.2 seconds |

The visible Export instruction listed those exact per-clip trims/fades and
ordered concatenation. The Agent reported a hard cut and returned asset
`<observed-asset-id>`, 63 frames / 2.625 seconds at 24 fps.
Browser playback also measured 2.625 seconds. Local verification is tracked in
the project's `STITCH-LAB.json`; do not promote an Agent report to decoded proof.

The two fades are separate per-clip controls. No overlap/cross-dissolve, separate
audio track, J/L-cut or speed control was exposed in the inspected clip editor;
the Stitch settings menu contained **Unstitch**. These observations do not prove
that every Grok surface lacks those features. In particular, fades do not by
themselves establish a cross-dissolve. Inspect the actual join and sound to learn
what the Agent applied.

## Native versus precise/local editing

Use the native timeline for interactive ordering, coarse source trims, per-clip
fades and an experimental export. For exact source frames, internal excisions,
retiming, independent sound overlap or a specifically defined cross-dissolve,
use a precise Agent edit or the existing local FFmpeg edit map. Record which
route produced the actual result. Do not claim that a custom Agent instruction
was a native transition control.

For most moving firefight coverage, first test a hard cut on movement or impact.
Replaying the same duck/landing on both sides of a cut is a timing problem;
adding a dissolve does not correct the repeated action.

## Native runtime follow-up - 2026-10-30

An eight-source sequence produced a different actual strip order from its
selection badges. Inspect each strip preview/source before export. Dragging the
misplaced strip to its intended position corrected the observed order; verify
the new sequence after the drag. In this native runtime, Hand Tool did not
prevent clip-strip drag-and-drop. This does not establish behavior for all
canvas nodes or future UI versions.

Native accessibility setValue did not change the tested trim slider. Clicking
the actual thumb and using bounded arrow input worked in 0.1-second steps, with
separate settled-value checks. Keep native key batches at 50 events or fewer
and re-read the resulting value; do not infer success from issued input. The
submitted Export instruction exposed the actual per-clip recipe, and the
Exporting button was disabled while the job ran. Submission is not a completed
combined movie: verify the new playable result, download identity and media.
