# Trim, cut and stitch moving action

Use this after complete takes exist, with [native editing](native-editing.md)
for controls and [review](review-and-edit.md) for acceptance. Do not regenerate
coherent motion merely because a six-second take contains a one-second action.
Create a [join plan](join-planning.md) for each neighboring pair before revising
the cut. After motion and sound decisions, apply relevant [finishing checks](finishing-review.md).

## Build the edit from action beats

For each beat identify anticipation, commitment, contact, consequence and exit.
Record the first usable source frame and last necessary consequence. Remove
idle preparation, repeated firing, recovery holds and accidental reversals.
Keep enough preparation to understand the action and enough aftermath to read
its result. Generated duration is an edit handle, not a delivery requirement.

Create an edit map with source asset/file, zero-based half-open source ranges,
source fps, speed, output frame count, cumulative cut frames, audio intervals,
and a reason for each cut. Preserve raw sources and version every keeper/movie.
For fractional frame counts choose and record an explicit rounding convention.

## Choose a motivated join

| Join | Match | Reject when |
| --- | --- | --- |
| Cut on movement | Same action phase, body/weapon direction and approximate speed | The gesture restarts or completes twice |
| Impact cut | Source establishes force; destination shows immediate consequence | A traveling projectile or long pause disconnects cause/effect |
| Cover exchange | Shooter's aim, target location and physical cover | The weapon fires into its own cover or through solid geometry |
| Launch to flight to landing | Rise/fall phase, travel direction, jump-pack identity and height | The character drops, resets height, hovers or lands twice |
| Eyeline/reaction | Gaze axis and the object/person being observed | Opposing shots imply incompatible locations |
| Wide to detail | Same event time, carried damage and prop state | Broken equipment becomes intact or the dead character recovers |
| Deliberate time skip | A readable consequence or establishing view | A discontinuity is disguised as continuous movement |

Test the outgoing/incoming join with several frames of overlap, then slide
the cut a few frames either way. Prefer the version that preserves momentum
and makes the next event understandable. Avoid automatic dissolves between
physical actions; a hard cut often preserves force. Use a transition only for
a specific change of time, place or story state.

## Retime and sound together

Speed up only spatially coherent motion. Ordinary frame dropping preserves
the source; optical flow can invent hands, weapons and debris. Check the result
at normal speed: a percentage alone does not prove convincing movement.
Do not accelerate a scene solely to hit an arbitrary total runtime.

Map gunshots to muzzle/impact frames, grenade release to the hand opening,
blast sound to detonation, and landing weight to actual foot contact. Carry
appropriate atmosphere across cuts. Where a source sound tail helps the next
shot, use a deliberate L-cut; where an incoming sound motivates a new view,
use a deliberate J-cut. Record offsets and overlaps. Do not double a report,
invent an offscreen action or mask a bad visual join with unrelated sound.

Trim the native audio to the same retained intervals before pitch-preserving
tempo changes. Tiny de-click fades are technical cleanup, not designed sound
bridges. Rebuild mismatched effects when authorized and audition the result.
Decoded audio must match each keeper's exact picture duration before concat;
AAC padding must not accumulate and shift later cuts.

## Acceptance and handoff

Check every join at full resolution, including neighboring frames, and inspect
every encoded frame in consecutive sheets. Then watch the entire export at
normal speed with sound. Frame inspection and successful decode cannot approve
rhythm, timbre or sound sync. Record unavailable listening honestly.

Require exact cumulative frame boundaries and intended black-tail length.
An overlong concat trimmed at its end still contains internal duplicate frames.
Compare the exported movie against the edit map, not just its total duration.

Place each new keeper beside its own numbered FIRST/LAST row immediately.
Put the final movie below the last row, label comparisons, preserve originals,
and verify positions after reload. A table of registered IDs is not a finished
canvas arrangement. Deliver the real movie file and keep the editable map.

Marine R05 is an initial applied example, not a fully auditioned reference edit:
its local and native exports were decoded and reviewed frame by frame; listening
and continuous normal-speed acceptance remained pending in that session.

## Verify scene meaning before applying transitions

Reconcile the actual decoded shot content with the numbered plan before using a
critic's labels or an Agent's cut table. In Marine R05 v3, the written review
called segment09 a Ghost ridge shot and segment12 a nuke, while the actual frames
showed the rifle break and target-spotted courtyard. Fades were consequently
placed inside continuous action. Correct totals and distinct neighboring pixels
did not catch this semantic error.

Review several outgoing/incoming frames for the actual event, cause/consequence,
damage, screen direction and location. A camera-angle change inside one fight
does not by itself call for a dissolve. Do not fade away a missile's arrival or
the first nuclear flash when they are an immediate cause/effect pair. Account
for overlapping transition frames explicitly when a real dissolve is used.

## Mix events, atmosphere and silence deliberately

RMS differences across a cut are diagnostic evidence, not automatic failures:
a report, an explosion and a quiet observation shot should not all have equal
energy. Normalizing each short clip to the same integrated loudness can amplify
quiet beds and still leave abrupt transitions. Set sensible per-event gains,
preserve the intended large impact, and use a low atmosphere bed or a motivated
sound tail where digital silence creates an unintended hole. Check short sound
crossfades for doubled reports and softened transients.

Record added cues with their original source, source in/out, timeline start,
gain and ducking interval. A requested computer alert is a specific exception
to a no-speech brief; it does not authorize adding dialogue or narration.
Automatic transcription can identify a phrase, but cannot approve its timbre,
mix or exact perceived synchronization.

Compare video timebase duration, audio stream/edit-list duration and decoded
sample length separately. AAC may decode with padding beyond the intended PCM
duration, and container timescale rounding may differ by a fraction of a
millisecond. The Marine v3 audio stream was about72ms short, a materially
different issue from v2's roughly0.33ms container rounding. Neither observation
alone proves that every hit drifts by that amount. Verify internal event timing
and the complete intended silent tail before deciding the repair.


### Exact retime and PCM join reference
The versioned Ghost Strike R07 tool selects an explicit monotonic list of source frames, resets the resulting picture to N/(24*TB), and derives effective audio tempo from retained source frames/output frames. This avoids cloned end frames introduced to force a requested duration. Keep both requested speed and effective rounded speed in the edit map. Join exact-length PCM sidecars at2000samples per24fps frame at48kHz, then encode AAC once for the movie. Inspect encoded picture and decoded audio; AAC padding and sub-millisecond container rounding are not evidence of cumulative internal drift. Preserve the earlier render when fixing a shot and reuse hash-verified unaffected keepers.

Source review and cut review differ: R07v1 had565checked picture frames but a dependent trajectory defect; v2 replaces only14. Explicit frame count, pixel duplicate tests and PCM accounting are technical checks, not a listening verdict.

R08 tests separate native postroll/preroll stems without moving the picture or
replaying a transient: a short07 jet postroll bridges into08; contiguous15 source
frames before/after the retained window carry rumble under neighboring shots.
Record source intervals, effective tempo, filtering, sample placement and gain.
Smooth duck attack/release around an alert rather than stepping the entire bed.
These are audition candidates until heard; an unmuted player is not an ear review.
