# Three-frame planning and composer preflight

Read with [frame controls](frame-controls.md). A middle image is optional for a
simple shot; if planned or required, it cannot be silently dropped. Two-frame
manifests retain their existing behavior. The guards below have local automated
tests, not a new end-to-end Grok generation result.

## Planning data across the whole film

Add these fields to a shot that needs a middle action state:

```json
{
  "duration_target": 15,
  "intermediate_required": true,
  "intermediate_frame": "frames/s01-middle-v1.png",
  "intermediate_review": "accepted",
  "intermediate_time_seconds": 7.333333333333333
}
```

The time above is an example, not a promise about a current UI step or supported
duration. Set the duration first, inspect the actual slider, and record the
supported pin you choose. Keep an originally requested time separately if rounded.

`assertProductionReady` requires every declared middle's reviewed file reference
and a finite numeric pin strictly inside `duration_target`. Python `ready` also
checks the actual file exists; `validate` checks its dimensions match both
endpoints. A later unfinished middle blocks the whole-film preflight. Neither
function opens a browser or proves an attachment role.

## Current-shot evidence before Send

`ImaginePage.preparePair` accepts optional `intermediateFrame`, sets duration
before attaching it, and returns without submitting. It does not choose a pin.
Use the actual role menus and Keyframe time control, compare the three images
with the ledger, and capture the settled strip and settings.

For a three-frame `submitPrepared`, supply `shotId` and `frameConfiguration`:

```javascript
const frameConfiguration = {
  verified: true,
  duration_seconds: 15,
  frames: [
    {role: 'first', file: shot.first_frame, src: observedFirstSrc, verified: true},
    {role: 'intermediate', file: shot.intermediate_frame,
      src: observedMiddleSrc, time_seconds: actualSliderValue, verified: true},
    {role: 'last', file: shot.planned_last_frame, src: observedLastSrc, verified: true}
  ]
};
await imagine.submitPrepared({manifest, shotId: shot.id, frameConfiguration});
```

`verified` records a review actually performed; copying this example does not
establish it. Sources come from the current visible attachment images, not guessed
asset URLs. Keep full source values in memory/local evidence, never in a public
example. Each file/role, exact slider pin and observed duration must match the plan.

Before clicking, the helper rereads visible attachment sources, duration and the
middle badge through DOM. It ignores URL query changes when comparing sources.
The badge is rounded to a tenth, so this drift check allows 0.051 seconds; the
separately recorded slider value must match the planned pin within one millionth
of a second. A missing badge or changed source/duration fails closed. If the DOM
changes, inspect and adapt the reader; do not mark stale observations as verified.
The helper does not reopen every role menu itself, and source equality does not
prove correct roles or visual identity. Those remain explicit review steps.

The existing Agent two-endpoint helpers reject manifests/shots with planned
middles, because their middle-role configuration is unverified. Use the explicit
composer and verify the real controls rather than silently sending a two-frame
Agent prompt for a three-frame shot.

## Evidence boundaries

- A duration menu option is **UI observed**; selecting it is **configured**.
- Three thumbnails, checked roles and an actual pin establish **prepared**.
- Send establishes **submitted**; a new playable video establishes **playable**.
- Decoded output, motion, joins and listening have separate review verdicts.

The main composer exposed and selected 15s during an October 29 preparation run.
That observation alone does not establish a completed 15-second three-frame clip.
The initial record had tool DOM snapshots, with no retained screenshot; keep that
record labelled partial. Do not invent missing evidence after the fact.
