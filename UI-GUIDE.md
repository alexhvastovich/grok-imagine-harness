# Grok Imagine UI guide

This public summary is based on October 2026 UI observations. Private captures,
account identifiers and generated maps are omitted. Reinspect the current live
DOM, screenshot and selected asset before acting; labels and routes can change.

| Surface | Purpose and checks |
| --- | --- |
| Project / Files | Named production packet, script, references and endpoint files; verify the current project and every uploaded filename |
| References | Named Character, Location and Prop masters; inspect the actual attached image and save outcome |
| Short Film starter | Immediately submits a canned request for three film ideas, character images and posters; not passive canvas initialization |
| Canvas | Select and organize existing nodes; keep adjacent FIRST, LAST and VIDEO rows; verify after reload |
| Image detail / Make Video / Add Prompt | Prepare frame-controlled drafts; inspect populated FIRST/LAST and optional middle images before submission |
| Main Imagine composer | Verify available aspect, duration and resolution; prompt text alone does not configure settings |
| Frame role menu | Distinguish First, Intermediate, Last, Loop and Reference; confirm checked roles and actual timestamp controls |
| Video detail / Extend | Continuation draft; explicit LAST support and successful output must be checked independently |
| Trim / Extract Frame / Crop | Preserve sources and inspect the actual new media, timing and dimensions |
| Stitch timeline / Export | Editable group and exported movie are different outcomes; verify order, decode and sound separately |

Canvas **Make Video** historically submitted immediately; detail **Make Video**
opened a menu. A selected node ID is not an asset ID. Upload completion can reorder
files. Fit/zoom animations can temporarily unmount controls. Native keyboard
movement can help when dragging is unreliable; verify persistence after reload.

For recipes, use [browser actions](workflows/browser-actions.md),
[frame controls](workflows/frame-controls.md), [native editing](workflows/native-editing.md)
and [canvas organization](workflows/canvas-organization.md).

To build your own searchable evidence browser, capture into ignored `evidence/`
and run `python build_map.py`. All generated maps and screenshots are private
local artifacts. They are not bundled evidence for this public guide.


The Short Film immediate-submit behavior was observed on October 29 using native
accessibility text and screenshots, with DOM/network unavailable. Stop was
requested; terminal cancellation and completed assets were not confirmed. See
[the starter warning](workflows/browser-actions.md#short-film-starter-submits-immediately).
