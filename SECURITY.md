# Security and private data

This release was prepared as a source-only export with new Git history, followed
by an independent subagent audit. No confirmed API keys, personal tokens or
private keys were found in the reviewed source. Original captures, production
media, logs, project links and private repository history were not imported.
This is a point-in-time review, not a guarantee against every possible secret.

The shipped tools need no API credentials. Authentication belongs in your
browser. Optional integrations may use a local ignored `.env`; never put real
values in `.env.example`. Do not export browser cookies or login state.

The capture-index URL was changed to strip queries and fragments, with a
regression test. Network body values are reduced to types and sensitive keys
are filtered, but DOM, screenshots, notes and URL paths remain potentially
private. Raw captures and generated evidence maps must stay local.

Before contributing, inspect `git diff --cached` and `git ls-files`, then run
your secret scanner. The ignore rules cover environment files, media, evidence,
production folders, generated maps, browser profiles, HAR files and common
storage-state files. Ignore rules cannot protect a file already tracked or
added with force.

If you discover a credential exposure, revoke it through the issuing service
and remove it from all affected Git history. Describe the issue without posting
the secret value, authenticated URLs, private captures or reproduction data
in a public issue.
