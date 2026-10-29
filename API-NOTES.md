# Passive API observations

The recorder can observe network metadata from the existing browser session.
It is not a private API client and does not replay requests. Optional CDP
capabilities depend on your installed browser tool.

Only paths, methods, status and JSON field/type shapes are intended to be retained
for network evidence. Headers and raw request/response values are omitted;
URL query strings and fragments are stripped. Paths and object keys can still
identify private data, so recordings and generated catalogues stay local.

`build_map.py` normalizes UUID route segments in its generated API catalogue.
That does not anonymize accompanying DOM, notes, screenshots or filenames.
A request near a click does not prove causation. Truncated buffers or zero
observed requests do not establish that an operation is local-only.

If passive capture is unavailable, use `createUIHarness` and label network
evidence unavailable. Continue using documented UI controls; do not obtain
cookies, discover tokens or guess private generation endpoints.
