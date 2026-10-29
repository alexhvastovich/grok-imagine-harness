# Review and edit the completed takes

Start from [SKILL.md](../SKILL.md), stages 5-6. For native click paths and inspected
versus committed behavior read [native-editing.md](native-editing.md). Record
versioned raw/rejected/processed/movie identities with [asset-ledger.md](asset-ledger.md).

Download each actual playable take through its selected canvas toolbar. Decode the
whole clip and extract its real first/last frames before accepting it. Keep hashes,
raw IDs, endpoint IDs, settings and exact generation instruction in the ledger.

## Complete first pass, then regeneration review

When the user asks to see the complete set first, finish every planned raw source
before deciding which shots to regenerate. Keep one active job, preserve each
download and verify asset/file identity and decode integrity. Place raw sources
in their rows, marked review pending. Detailed frame review and acceptance may
wait for the full set; no final assembly happens before the regeneration review.

Review the completed set against the storyboard and adjacent shots. List each
defect with its shot/time, visible evidence and effect on story or continuity.
Choose trim, targeted edit, regeneration or keep; regenerate only what needs it.
A user's approval of the overall direction does not approve every take. Preserve
earlier takes and compare replacements before promoting a keeper. This is the
Marine project's chosen cadence, not a universal requirement for other projects.

## Inspect and accept sources

Locate the actual action window frame by frame before requesting a replacement.
Trim lead-ins and tails first; retime only coherent motion, preserving the raw
source. If the trajectory, aim, cover occlusion or equipment is wrong, revise
the affected endpoints and regenerate that take. Longer source footage can
supply edit handles, but does not itself prevent slow motion within the action.

After a retime, rebuild or realign sound events to the edited frame times. Do
not retain a slowed or late native track just because it came with the video.
A silent visual timing test is a separate comparison asset, not a finished
audiovisual keeper. Treat user-reported sound defects as unresolved even when
the stream decodes; listening remains necessary for final sound approval.

Inspect every consecutive frame using numbered contact sheets, then inspect any
suspicious hands, masks, contact or cut boundary at full resolution. A successful
job, correct transcript or Agent assurance does not establish visual acceptance.
The Affordable Doctor caught an unwanted mouth at the bottom of an eyes-only shot
and a plague mask articulating like a beak despite a rigid-mask prompt.

Use a precise edit when it solves the defect: a fixed crop for the eyes-only
insert; a single visual-only correction plus the retained original dialogue for
the mask. Preserve raw sources. A processed clip has its own ID and newly decoded
endpoints. Do not silently replace the raw source ID in a continuity ledger.

Ask the Agent to trim/crop/mux and stitch exact observed IDs before using the local
FFmpeg fallback, following the repo's Grok cinematic sequence skill. Specify
ordered clips, in/out points, dialogue tails, hard cuts, format and audio handling.
Record failure or limitations before fallback; never infer success from prose.

Source duration is not edit duration. The Marine opening produced a 145-frame,
24-fps source lasting 6.041667 seconds: the raise/burst/withdrawal is concentrated
early, followed by a longer repetition of incoming fire. Preserve the full raw
source and choose a shorter action window against the following angle. Do not
keep six seconds merely because six seconds were generated, or lock the in/out
points before the adjacent motion is available.

Check whether the action reverses later in a take. The Marine POV source
briefly sheltered behind the doorway, then reopened the view despite a prompt
to end behind cover. Its short impact/shelter segment remained useful. Record
that actual timing and choose the cut from the rendered motion; neither the
planned LAST nor the Agent summary establishes the full action trajectory.

Inspect stream dispositions before frame extraction. This native MP4 also had
an attached-picture MJPEG stream; its timed H.264 stream is the motion source.
Map the intended timed video and audio explicitly, rather than counting the
cover image as another motion stream or extracting it as an endpoint.

Decode and inspect the assembled export in full, including every edit boundary.
Check complete scripted words, video/audio streams and decode integrity. Listen at
natural speed for voice identity, delivery, synchronization and mix. If the runtime
cannot hear audio, mark listening pending and deliver a review cut, not a final
audiovisual PASS. Automated speech recognition is supporting evidence only.
