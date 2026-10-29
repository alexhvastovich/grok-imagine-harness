# Asset roles, takes and edit dependencies

Start from [scene-manifest.example.json](../scene-manifest.example.json). Store
relative media paths; runtime absolute paths belong only in local environment or
tool arguments. A planned filename is not proof that an image or live asset exists.

## Keep the records distinct

| Record | Required identity and provenance |
| --- | --- |
| Named character master | Name/reference name, inspected image file/hash, registration status; live reference ID only if observed |
| Shot plan | Shot/scene number, purpose, framing/lens/angle, duration, camera/axis/eyeline, action, dialogue/sound, cut intent and previous-shot dependency |
| Planned FIRST/LAST | Explicit role, versioned file/hash, visual review, observed upload asset ID and matching thumbnail; never infer roles from upload order |
| Actual rendered endpoints | Extracted FIRST/LAST files/hashes and source take ID; distinguish actual output from planned targets |
| Raw take | Shot/take ID, playable asset ID, native downloaded file/hash, exact prompt/input roles/settings, measured format/duration, separate visual/audio review |
| Rejected take | Original identity plus rejection reason; retain original media and usable audio rather than deleting the source |
| Replacement visual | New take ID/file, source role and correction prompt, visual review, explicit audio status |
| Processed keeper | New processed ID/file/hash, raw/replacement/audio sources, exact edit operation/in-out/crop, actual processed endpoints and review |
| Movie export | Ordered keepers/in-out points/transitions/audio, export ID/file/hash, measured streams/duration, boundary/visual/listening review |
| Live canvas node | Node ID, linked asset ID, role/shot, observed position/bounds and verification timestamp; proposed layout is stored separately |

Keep review states factual: pending, accepted, rejected or a concrete limitation.
Record image, whole-clip visual, cut-boundary and listening checks separately; a
transcript or successful decode does not imply all checks passed. Existing code
may also use a string `review` field; preserve its expected values when executing
continuity.py and add detailed records without silently changing its contract.

## Take verdict and attempt budget

Alongside the existing review contract, log a compact take verdict: **KEEP** for
the inspected usable role/window, **REDO** for a specific correctable defect, or
**FAIL** for an unusable/failed result. Include the evidence/time or frame range,
reason, usable interval, audio status and next change. These verdicts supplement
existing schema values; they do not replace `accepted/rejected/pending` fields.
KEEP on a visual segment does not approve the uncut take, sound or final film.

Check subject/equipment match, identity, coherent motion, flicker, warping and
physical contact or abrupt slams. Use a small explicit per-shot attempt ceiling
(three is a reasonable initial budget), adapting to the user's existing plan.
The budget is not authorization to retry automatically. Diagnose before another
submission, change one causal variable, preserve the prior take and stop an
unchanged failure. Prefer trimming or a precise edit for an otherwise useful
take. Honor a complete-first-pass review cadence before selecting replacements.
When the budget is exhausted, record the defect and available usable material;
do not silently spend another batch of generations.

## Version and propagate changes

1. Preserve the original planned pair, raw take and exact prompt. Add a new version
   for revised images/takes/edits; do not overwrite source files or repurpose IDs.
2. Compare the generated actual end to the planned LAST. For a continuous join,
   make the accepted actual file the next FIRST byte-for-byte, then inspect/update
   the next LAST and prompt. Record which version became current.
3. An angle cut has matching staged images and its own camera record, not an exact
   image reuse requirement. Record why that boundary is a cut.
4. Editing a keeper creates a new asset and endpoints. Update dependent shots,
   ordered movie inputs, project Files and nearby canvas placement as needed.
5. Before committing an edit or submission, verify the named live source identity
   again. After it completes, verify the actual result rather than an old preview.

`continuity.py extract` records decoded endpoints/hashes. `validate` checks exact
continuous-file joins; `ready` checks the prepared project/pair/prompt gate; `assemble`
requires accepted local clips and refuses overwrite. These technical checks do not
replace a storyboard or audiovisual review. See [README.md](../README.md) for commands.

Include a compact project ledger with the full prompt packet. Update it after each
accepted generation/edit and retain the local detailed version. If the user takes
over editing, record that handoff; do not claim to know or have reviewed an external
final file without inspecting it.

For bulk imports, a local thumbnail comparison can help identify candidates, but
inspect nearly identical states at readable or full size before locking roles.
The Marine missile FIRST and LAST were indistinguishable enough at overview
zoom to require this check. Never promote a similarity score or picker order to
an endpoint assignment by itself.

If a node is absent after reload, inspect the live overview and available image
strip before replacing it. Restore the unchanged accepted source only when needed,
record old and replacement node/asset IDs separately, and update every dependent
prompt and manifest. Re-uploading the same bytes can create a new asset identity.
Do not delete original media or invent the reason a node disappeared.
