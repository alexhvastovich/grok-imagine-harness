# Historical native editing observations

Scratch-copy UI tests in October 2026 exercised Trim, Extract Frame, canvas Crop
and Stitch Export. Original media, asset IDs and private captures are omitted.
This summary is not a current live-site end-to-end test.

- Trim produced a separate three-second video that fully decoded.
- Extract Frame most closely matched the last decoded source frame, with small
  browser/color/encoding differences; pixel identity was not established.
- Canvas Crop preserved the chosen framing but reduced resolution; inspect the
  output's dimensions and aspect ratio rather than assuming source-pixel size.
- Stitch created an editable timeline/group. Export was a separate step, and the
  resulting movie's order and decode were checked independently.
- Downloads sometimes remained temporary files despite usable media. File
  identity and full decode were checked before recording success.
- Audio presence and decoding did not establish normal-speed listening approval.

Follow [native editing](workflows/native-editing.md) and
[Stitch timeline](workflows/stitch-timeline.md), then verify your current result.
