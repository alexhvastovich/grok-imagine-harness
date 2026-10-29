# Public release validation — 2026-10-28

Local checks were run with Node.js 22, Python 3.14 and FFmpeg/FFprobe 8.1.
The minimum Python version is 3.11 (`hashlib.file_digest`). The source uses
standard libraries; no application API keys or browser login were used in tests.

- **8 Node tests passed:** URL credential/query redaction, sensitive body-shape
  filtering, UI-only evidence labelling, passive capture-index URL regression,
  quota/stale-media handling and whole-production/endpoint submission guards.
- **Python integration passed:** real first/last decoding, broken-chain rejection,
  unreviewed-clip rejection, mixed-audio/silent assembly and overwrite protection.
  The final assembly contains the expected 24 picture frames and approximately
  one second of media. The integration was repeated five times after the fix.
- **Audio-tail repair:** padded/synthetic audio is explicitly bounded to the
  source picture duration, with timestamps reset before normalization. This fixes
  inconsistent short-clip tails observed with `apad` plus `-shortest` alone.
- Markdown relative links and the example manifest are checked before release.
- An independent subagent reviews the exported files for credentials, private
  identifiers, personal paths and accidental production/evidence inclusion.

Release audit result: **PASS** across all 42 staged UTF-8 text files, with no
confirmed credentials, personal email addresses, local paths or private asset
IDs. Ignore rules were exercised against secret files, captures, maps, production
data and browser state. Gitleaks **8.30.1** also reported **no leaks found** on
the release directory; the official release download's SHA-256 was checked
against its published checksum before use.

Browser tests use synthetic adapters; they are not a live Grok session. Private
production media and captures are intentionally omitted, so historical UI results
are summaries, not independently reproducible evidence bundled with this repo.
No current end-to-end generation, normal-speed listening or creative film
acceptance is claimed by these local checks.
