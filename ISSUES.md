# Known issues and operating fixes

These are reusable lessons from October 2026 sessions. Original project logs,
IDs, account links and private evidence are not part of this release.

| Issue | Operating fix |
| --- | --- |
| Prompt names frames but actual attachments are missing or reversed | Inspect visible thumbnails, role menus and actual files before submitting |
| Canvas Make Video submits immediately | Use the verified detail Add Prompt route for preparation and inspect the surface first |
| Prompt duration disagrees with UI | Set and verify the actual duration; prose does not override controls |
| Stale ID opens another image | Check visible identity, not only the stored ID |
| Uploads complete in a different order | Assign FIRST/LAST from inspected images |
| Quota failure appears after progress | Require a real playable output; do not retry unchanged failed requests automatically |
| Download event times out | Check the configured download folder, file stability, decode and identity |
| Fit/zoom temporarily removes controls | Wait for the settled state before selecting |
| Agent describes a layout but moves no nodes | Use actual canvas controls and verify after reload |
| Screenshot pixels differ from DOM coordinates | Inspect current viewport and tool coordinate contract; do not reuse scale factors |
| Generated mask or prop deforms | Review the full take and repair only affected visuals; preserve valid audio separately |
| Stitch creates a group but no movie | Export and verify the resulting file, clip order and timing |
| Optional CDP recorder is unavailable | Retain labelled UI-only evidence; do not invent network findings |
| Technical checks pass but sound is unreviewed | Keep listening pending until someone hears the complete sequence at normal speed |

The public release also fixes a recorder issue where capture-index URLs were
previously saved without stripping query strings. Captures remain private;
this fix is not a guarantee of complete anonymization.
