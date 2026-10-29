# Conditional finishing review

Use after the picture joins work. These checks supplement continuity and sound
review; they do not justify automatic overlays, grain, sharpening or regeneration.
Alex supplied the [Tetsuo editing post](https://x.com/tetsuoai/status/2115277212824019367)
on2026-10-27. Its four suggestions are useful with the following limits.

## Track graphics according to what they mean

A label describing a physical object needs that object's motion, perspective and
occlusion. A label fixed to a wall needs that wall's plane/depth. Estimate camera
motion from static background features, excluding independent foreground motion;
use a separate object track when the target moves. One global translation will
not solve parallax, rotation, scale or foreground occlusion. Check first, middle,
last and occluded frames for drift and slipping.

Titles, editorial counters and deliberate HUD elements can stay in screen space.
Choose deliberately; do not world-track every graphic. Text-free films need no
tracking stage unless the user changes the brief.

The [1995 NASA Ames paper](https://rosap.ntl.bts.gov/view/dot/12816) reports the
2.5-second runway-incursion response difference and discusses differential motion
and scene-linked symbols. That supports an attention/design rationale in its
aviation context. It does not establish a2.5-second social-video effect, universal
retention gain, or the efficacy of a particular tracking implementation.

## Test dark gradients through compression

Inspect the source, final encode and a compression stress proxy for banding,
macroblocks, crushed shadows and moving texture. Banding and blocking are distinct
defects; smoothing a gradient is not a universal repair for encoder starvation.
Check color range/transfer and existing source artifacts before filtering.

Compare untouched with gently debanded problem areas. If adding grain, compare
it after debanding at intended display scale and under compression; do not assume
more grain survives better. Preserve armor detail, flame edges and smoke texture.
Record the filter parameters and proxy codec/settings. A proxy is a stress test,
not evidence that the platform transcode passed. Check a real platform rendition
only when upload/access is authorized, and label it unreviewed otherwise.

[FFmpeg's deband documentation](https://www.ffmpeg.org/ffmpeg-filters.html#deband)
describes averaging pixels that meet a threshold; this can alter useful texture.
Choose thresholds by a viewed comparison, not a universal preset.

## Keep counters registered

Use verified tabular numerals or explicit fixed-width digit slots. Reserve width
for the largest value, punctuation, decimal signs and units, with a defined
alignment. Test9->10,99->100, decimal/negative changes and the encoded output.
Equal digit widths alone do not prevent movement when the digit count changes.

## Compare sharpness in context

Measure only to flag review candidates. Compare similar subject crops at the
same effective scale; consider intended depth of field, exposure, smoke, motion
blur and texture. Grain can increase an edge-based score without restoring
detail. Whole-frame scores can punish an intentionally defocused background.

[FFmpeg blurdetect](https://www.ffmpeg.org/ffmpeg-filters.html#blurdetect) estimates
blurriness without changing frames; it is not a semantic quality verdict.
Inspect flagged shots beside their neighbors at100percent and normal speed.
Prefer an existing coherent sharper take or a usable portion of the source.
Regenerate only when the subject is unintentionally soft, no existing take fixes
it, and generation is authorized. Sharpening does not recover missing detail.

Record PASS / FIX / N/A / UNREVIEWED for each applicable check and the evidence
used. This module documents decision criteria, not completed tests of a film.
