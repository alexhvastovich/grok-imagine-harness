# Grok Imagine Animation Harness

A workflow and local toolkit for directing multi-shot animations in Grok Imagine
with Codex or a ChatGPT session that has compatible browser tools.

Created by Alex for [AlexusaDays on YouTube](https://www.youtube.com/@alexusadays).
The harness grew out of real animation sessions: planning shots, keeping
characters consistent, correcting takes, and assembling the resulting film.

## What it is

The assistant plans and checks the images, continuity, prompts and edit; Grok
generates the motion. For a continuous shot, the sequence is **A → B, then B → C**:
extract the accepted video's actual last frame and use it as the next start.
A deliberate camera cut gets its own matching FIRST/LAST pair.

This repository includes:

- A [production skill](SKILL.md) and [agent instructions](AGENTS.md).
- [Workflow guides](workflows/project-preparation.md) for coverage, character
  references, frame roles, browser actions, canvas organization and editing.
- Existing-session JavaScript page objects and optional UI/network recorders.
- Python tools for decoding endpoints, checking continuity and assembling clips.
- An editable [scene manifest](scene-manifest.example.json) and automated tests.

It is a source toolkit, not a hosted service, browser extension, Grok API client
or one-command film generator. It does not include a browser connection, login,
image-generation service, private captures or finished example movies.
It is independent of xAI and OpenAI and is not an official integration.

## Get started

Install Git, Python **3.11 or newer**, Node.js **22 or newer**, and FFmpeg with
FFprobe. Put the command-line tools on your PATH. The local tools use standard
libraries; there is no `pip install` or `npm install` step.

```sh
git clone https://github.com/alexhvastovich/grok-imagine-harness.git
cd grok-imagine-harness
python --version
node --version
ffmpeg -version
ffprobe -version
python continuity.py --help
node --test harness.test.mjs pages.test.mjs
python -m unittest discover -s . -p test_continuity.py
```

Use `py` on Windows or `python3` on macOS/Linux if that is your Python command.
Run the commands from this repository's root. Tests use synthetic local media
and do not contact Grok or spend generation credits.

For actual motion generation, bring your own signed-in Grok Imagine account
with access to the relevant controls and available generation allowance, an
assistant/browser environment, and an image tool or your own endpoint images.
Available controls, quotas and output settings must be checked in the live UI.

### Use with Codex

Open this cloned folder as the workspace. Ask Codex to read `AGENTS.md` and
`SKILL.md`. Connect your supported browser tool, sign into Grok yourself, and
have the assistant inspect the current tab before acting. The harness does not
install or enable browser tools, and the workflow can also be followed manually.

### Use with ChatGPT

Provide `SKILL.md`, `AGENTS.md`, the relevant workflow guides and your brief as
conversation/project context. Browser execution requires a session that can
control your signed-in Grok tab. An ordinary text-only chat can help plan shots
and prompts; it cannot operate your local browser or run these local files.
Uploading this README alone does not install an integration.

Start with a small production brief, for example:

> Read AGENTS.md and SKILL.md. Help me create a two-shot animation of an original
> robot finding a flower, in 16:9, with sound effects and no dialogue or music.
> Establish the named project and character references, plan both shots, and
> inspect every FIRST/LAST pair and any needed middle keyframe before generating
> video. Verify middle-frame timing in the UI. Use the actual accepted last frame
> for the continuous second shot. Plan and refine the motion and sound handoff,
> keep a take ledger, and review the resulting sequence before assembly.

## How to use it

1. **Plan:** lock the story, cast, visual style, set geography, audio intent and
   motivated shot coverage. Establish a named Grok project and references.
2. **Prepare every shot:** create and inspect FIRST/LAST images and any needed
   INTERMEDIATE (middle) frame. Plan its action beat and timestamp, write motion
   prompts, populate the project, and organize FIRST / MIDDLE / LAST / VIDEO rows.
3. **Plan each video-to-video join:** distinguish continuous action from a
   deliberate cut; match action phase, direction and persistent scene state.
   Confirm actual attachments, frame roles and middle-frame timing in the UI.
4. **Generate one job at a time:** verify the live settings and resulting output.
   Keep raw takes separate from accepted clips and respect your review cadence.
5. **Repair and track:** preserve sources; log rejected takes, edits and asset
   roles. Re-extract endpoints after an edit and update dependent shots.
6. **Refine transitions and assemble:** compare outgoing/incoming motion, select
   exact trim points, and shape sound bridges. Build the film, then watch every
   join and the whole sequence at normal speed with sound. A successful decode
   is not creative acceptance.

The detailed task router and acceptance conditions are in [SKILL.md](SKILL.md).
Read [known issues](ISSUES.md) before reusing a browser recipe.

### Middle frames: control the action inside a shot

Use **FIRST → INTERMEDIATE → LAST** when an important action state needs a
specific visual constraint: a hand releasing an object, an impact, or a foot
making contact. Decide this for every shot during preparation. A middle frame
is optional when the endpoints already describe a simple, readable action;
when needed, create and inspect it with the other planned images before motion.

Attach the actual image through **Add intermediate frame**, verify its
**Intermediate frame** role, and set **Keyframe time** in the UI. Set duration
first and recheck the middle timestamp after any duration change. Naming a file
or writing a time in the prompt does not attach or configure a keyframe. A middle
frame constrains an action beat; it does not guarantee timing or smooth motion.
Review the resulting take for pauses, warping and unwanted slow motion.

The observed attachment and timing steps are in
[frame controls](workflows/frame-controls.md#prepare-a-shot) and
[intermediate timestamps](workflows/frame-controls.md#set-an-actual-intermediate-timestamp).
The generic page-object helpers and local readiness checks do not automatically
attach or verify middle frames; use and inspect the documented live UI controls.

### Smooth transitions between clips

Plan the join before generation, then refine it using the actual rendered clips:

1. **Same-camera continuation:** use the accepted, decoded ending as the next
   FIRST; match motion direction, speed and action phase across the boundary.
   Check for a held endpoint, duplicated gesture or restart even if images match.
2. **Camera-angle cut:** stage matching action, eyelines, screen direction, scale,
   lighting, props and damage. Choose outgoing/incoming frames that carry the
   movement forward without repeating or skipping its important event.
3. **Edit the handoff:** compare several candidate trim points in context. Use a
   motivated hard cut or a transition suited to a change of time/place. Preserve
   sources and record exact source ranges and the reason for the chosen cut.
4. **Bridge sound:** retain appropriate ambience or a deliberate outgoing sound
   tail (L-cut) / incoming sound lead (J-cut). Check sync, distance and perspective;
   prevent doubled impacts, chopped tails and unintended silence.
5. **Review:** inspect consecutive frames around both sides, watch the passage
   and full film at normal speed, and listen. Recheck neighboring joins after
   changing a shot. Record unresolved source limitations explicitly.

The working guides are [join planning](workflows/join-planning.md),
[editing grammar](workflows/editing-grammar.md),
[frame continuity](workflows/frame-continuity.md), and
[Stitch timeline/export](workflows/stitch-timeline.md). This is an editorial
workflow: `continuity.py assemble` only joins already prepared clips. It does
not choose trim points, synthesize transitions, create sound bridges, or certify
that a join looks and sounds smooth.

### Local frame and assembly tools

Copy `scene-manifest.example.json` to `productions/my-film/scene-manifest.json`
after creating that directory. Replace the placeholders and keep file paths
relative to **the manifest's directory**. The example contains no media and is
intentionally not production-ready. Review flags start pending/false; set them
only after performing the corresponding check.

```sh
python continuity.py extract output/shot-01.mp4 output/shot-01-endpoints
python continuity.py validate productions/my-film/scene-manifest.json
python continuity.py ready productions/my-film/scene-manifest.json
python continuity.py assemble productions/my-film/scene-manifest.json output/film-v1.mp4
```

`extract` decodes the actual first and last frames. `validate` checks files,
dimensions and byte-identical endpoint handoff for continuous shots. `ready`
checks the declared whole-film preparation and local files; it cannot prove that
an upload or visual review actually happened. `assemble` requires accepted
clips, normalizes size/frame rate/audio, supplies silence for clips without
audio, and makes straight joins. Existing movie files are never overwritten.

### Browser helpers and compatibility

`pages.mjs` and `canvas-ui.mjs` receive an **existing connected tab**; they do not
launch or attach to a browser. `harness.mjs` optionally records local evidence.
The expected tab adapter exposes `tab.playwright` locators, `domSnapshot()` and
DOM evaluation, `tab.url()`, and, for UI-only capture, `tab.getScreenshot()`.
The passive recorder additionally needs a CDP adapter with `send()` and
`readEvents()`. This is not a drop-in regular Playwright `Page` interface.

Read your browser tool's installed documentation first. Import these modules
inside its supported persistent JavaScript runtime. If that runtime supports
Node imports, a UI-only capture can look like this **after** connecting `tab`:

```js
const {createUIHarness} = await import('./harness.mjs');
const recorder = await createUIHarness({
  tab,
  outputDir: 'evidence/my-run',
  reason: 'UI-only inspection; passive network capture unavailable'
});
await recorder.capture('project-open', 'Inspected the current project');
```

Resolve the import against the clone's location if your runtime starts elsewhere.
Use only documented browser capabilities. Reinspect the current DOM and visible
asset identity; saved selectors and IDs can become stale. Do not replay private
Grok endpoints or retrieve cookies/tokens to make the helpers work.

After making your own private captures, run `python build_map.py` and open the
generated local `index.html`. Its DOM links, screenshots, `SITE-MAP.md`,
`site-map.json` and `api-map.json` remain ignored by Git. The public
[UI guide](UI-GUIDE.md) summarizes the surfaces without account data.

## Privacy and credentials

**No API key, password or token is required by the shipped local tools.**
Browser authentication stays in your browser. Do not copy cookies, session tokens
or browser storage into this repository or into `.env`.

If you add an integration that needs a secret, keep it in an ignored local `.env`
and explicitly load it in your own integration. See [.env.example](.env.example);
the existing tools do not load `.env`. Never commit real values.

Recorders reduce network data to URL paths and body field/type shapes, omitting
headers and query values. This is **not complete anonymization**: DOM text,
screenshots, notes, filenames and URL paths can still expose private information.
Captures, generated maps, media, production ledgers, browser profiles, storage
state and HAR/trace files are ignored and must stay private unless separately
reviewed. [SECURITY.md](SECURITY.md) describes the release audit and boundaries.

## Validation and limitations

See [VALIDATION.md](VALIDATION.md) for local checks and [native editing notes](NATIVE-EDIT-QA.md)
for historical UI observations. The tests do not certify a current live Grok
session. UI changes may require adapting locators. Generation can drift from
planned endpoints; always inspect the actual result. Some controls remain
unverified. Listening and final creative review remain the user's responsibility.

## Credit and license

Created by **Alex / [AlexusaDays](https://www.youtube.com/@alexusadays)**.
If this helps your production, a link to the channel and this repository is
appreciated. Original code and documentation are available under the
[MIT License](LICENSE). Linked third-party materials and product names retain
their respective rights.
