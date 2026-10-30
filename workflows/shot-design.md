# Design film coverage before generating frames

The user requested varied cinematic coverage on 2026-10-07. Break the script into
dramatic beats, then design shots; one script paragraph is not necessarily one
shot. Add useful angles and shot sizes before the all-images-first gate, not as
random extra footage after generation. Preserve the locked dialogue and story.

For fights and chases, use [the action sequence library](action-sequences.md)
before locking coverage. Pick a small number of compatible patterns, map their
cause and effect onto this cast/set, and record the chosen pattern IDs in the
shot plan. Adapt the coverage to armor, mobility, weapons and the user's tone.

For each shot record: number, beat, subject, shot size, lens, camera position and
height, action axis, eyeline, screen direction, first/end state, duration, dialogue
and sound, movement, intended next cut, and continuity dependencies. See
[cinematic-staging.md](cinematic-staging.md) for the set and perspective checks.
Use the [adjacent-pair record](join-planning.md) to plan the outgoing/incoming
action phase and sound handoff before generating endpoints. A matched character
and setting alone do not establish a cuttable action.

Choose coverage for a purpose:

| Coverage | Purpose | Affordable Doctor example |
| --- | --- | --- |
| Wide establishing/master | Establish geography and character positions | Lab, Ren at bench, clear door and floor; Mika absent |
| Medium shot | Read acting and physical action | Ren handling the vial, coughing; Mika entering later |
| Detail/insert | Make a crucial prop or action legible | Vial slipping, glass impact and green mist |
| Medium two-shot or over-shoulder | Connect speakers and eyelines | Collapsed Ren and Mika answering on her left-ear phone |
| Close-up/reverse reaction | Land emotion or comic timing | Mika's casual “Very affordable,” Ren's realization |
| Entrance wide/low angle | Reveal the interruption and its scale | Door kick, full silhouette of Dr. Corvus |
| Extreme close-up | Emphasize the strongest reaction | Ren's eyes, red field and speed lines, “Nani?!” |
| Close-up and motivated push-in | Deliver the punchline | Rigid plague mask and white lens flash |

Not every film needs every row. Choose enough complementary coverage to make
actions readable and edits intentional. Do not pad a short joke or repeat a beat.
Use a wide-to-medium-to-close progression when tension increases; return wide
when geography needs re-establishing. Change angle substantially (about thirty
degrees is a useful heuristic) or change shot size clearly to avoid accidental
jump cuts. Maintain the established one-hundred-eighty-degree action axis and
matching eyelines. Cross it through an intentional neutral shot, camera movement
or new establishing shot. Anime smash zooms and stylized backgrounds are deliberate
exceptions, recorded in the shot plan rather than mistaken for continuity errors.

Cut on action with matched hand, vial, door and body positions. Track wardrobe,
left/right prop ownership, light, mist progression, lens perspective and distance.
For a same-camera continuation reuse the accepted actual end image as the next
start. A new camera angle needs its own start and end images staged from the same
set and character references; do not force an identical image across a deliberate
cut. Note whether the cut bridges time or continues the same instant.

Production sequence: project/details and character masters -> script beats and
set -> shot list/coverage and cut plan -> ALL first/end images and visual checks
-> ALL motion/dialogue prompts -> complete project packet and compact canvas ->
generate one shot at a time -> inspect actual endpoints -> edit and review.

The existing five-shot review cut is preserved. The user completed the final edit;
this expanded coverage requirement applies to the next production or an explicitly
requested revision, not an unsolicited regeneration of that finished edit.


## Track every subject that is meant to move

FIRST / MIDDLE / LAST must show coherent progress for every intended moving
subject or object, including supporting characters. Do not advance only the
foreground action while everyone else remains an identical frozen pose. Keep
one readable main beat; supporting gestures should belong to that same moment.

Add a small motion-track table to the shot plan before creating its three images:

| Subject/object | FIRST | MIDDLE | LAST | Preserve |
| --- | --- | --- | --- | --- |
| Main worker | Begins the task | Makes contact | Completes the task | Identity, hands, tool and contact point |
| Colleague | Holds tablet low, looks toward work | Raises tablet, glances at its screen | Lowers tablet, looks back | Same tablet, grip and physical position |
| Seated visitor | Cup rests in hand | Raises the same cup | Sips, with cup at lips | Single cup, supporting hand and seated scale |
| Supporting robot | Upright beside its task | Bends to inspect | Straightens after inspection | Same location, limb lengths and equipment |
| Fixed set/parked vehicle | Stationary | Stationary | Stationary | World geometry; only coherent camera parallax |

Record each actor's action phase, pose, gaze/eyeline, prop ownership and hand
contact at all three states. Record travel direction and progress for moving
vehicles, lights or machinery too. Do not create a second cup, teleport a tablet,
restart a completed gesture or move an object intended to stay parked. Evaluate
the whole triple, not three individually attractive pictures. Revise affected
frames together when a supporting action or identity changes.

Ambient cues must fit the environment. An atmosphere-free exterior, such as the
Moon, has no wind-driven hair, fabric or foliage; distinguish it from an interior
with ventilation. Preserve deliberate stillness and fixed architecture while
allowing only the planned living or mechanical motion.

## Distinguish the cast and verify the canvas

Different hair colors do not establish different characters. Compare faces,
facial proportions, body silhouette, hairstyle shape, wardrobe silhouette, pose
and habitual expression against distinct masters. Reject near-duplicate faces.
Carry an accepted identity correction through every affected frame in the triple
and all dependent shots, not just the first image.

Check exact pixel width and height of every FIRST / MIDDLE / LAST file before
accepting the storyboard. Image generation can return a one-pixel canvas
difference despite matching requested dimensions. Repair the affected image
through the active image-generation workflow, then recheck dimensions, identity,
framing and action state. A dimension check is a check, not a new normalization
pipeline or proof of motion quality.
