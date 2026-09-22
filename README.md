# Field Notes · Open Performance Review

Field Notes is a local-first, open-source review engine for comparing repeatable
moments in public performance records. It is designed for artist communities
that want a careful, source-linked view of how the same stage moment varies
across show nights.

The tool describes observable stage signals. It does not diagnose an artist,
infer health or feelings, or turn a performance result into a definitive
personal claim.

## Roll your own

Download the runnable source from the public
[jratlee/open-performance-review repository](https://github.com/jratlee/open-performance-review).
Copy the example project, replace the artist, show run, moments, and sources,
and run the review locally. No account or database is required.

Canonical project links:

- [Source repository](https://github.com/jratlee/open-performance-review)
- [Issues and import-format discussions](https://github.com/jratlee/open-performance-review/issues)
- [MIT License](LICENSE)

## Quick start

```sh
pnpm install
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/isharrytired run dev
```

Open the web preview, choose **Example project**, or use **Import records** to
validate a project file in the browser. The example project is intentionally
labelled illustrative; it is a workflow specimen, not collected evidence.

## Data model

The reusable contract is:

- **Project** — an artist, show run, repeatable moments, source-use policy, and
  publication status.
- **Performance record** — one date and venue with a coverage status,
  confidence, record-level result, and linked moments.
- **Repeatable moment** — a defined segment to compare across records. Keep
  movement, vocal, crowd, or staging moments independent.
- **Observation** — one visible or audible signal with a plain-language note.
- **Evidence source** — a public URL plus platform, creator, quality, and
  provenance (`original`, `repost`, or `unknown`).
- **Baseline** — the comparable published records available for the same
  moment. Fewer than two comparable records returns `no_reliable_read`.
- **Result** — `higher`, `in_line`, `lower`, or `no_reliable_read`.

The source of truth for the HTTP contract is
[`lib/api-spec/openapi.yaml`](lib/api-spec/openapi.yaml). Generated Zod
schemas and React Query hooks are refreshed with:

```sh
pnpm --filter @workspace/api-spec run codegen
```

The conservative comparison rules live in
[`lib/performance-review`](lib/performance-review). The example API data
consumes that engine rather than embedding comparison rules in the UI.

## Creating an artist/show-run project

1. Copy [`examples/records/valid-project.json`](examples/records/valid-project.json).
2. Replace the project artist, run label, records, moments, and source links.
3. Define the repeatable moment before reviewing records. Do not move the
   segment boundary between nights.
4. Keep each source URL, creator, platform, quality, and repost relationship
   with the observation it supports.
5. Mark records `illustrative` until a human has reviewed the source links and
   attribution. Use `reviewed` only when the project can explain its coverage.
6. Run the import screen locally and then the typecheck/build commands below.

The browser import accepts JSON, a bounded CSV shape, and versioned Field Notes
project packs. It rejects oversized files, malformed records, non-public URL
schemes/hosts, and arbitrary HTML or media content. Import is a preview only:
the file is not uploaded or persisted. A validated project can be downloaded
as a complete JSON pack for local sharing and re-import.

Project packs include the format version, project metadata, repeatable moments,
records, observations, source URLs, creator/platform fields, provenance,
attribution, and source-use notes. They never include or host source media.

## Source use and licensing

Publicly reachable does not mean unowned. Link to records you have permission
to reference, follow platform terms, credit creators, record repost lineage,
respect takedowns, and add license or attribution notes to the project. This
repository does not download or host source media and does not promise that a
source will remain available.

The application code in this repository is released under the
[MIT License](LICENSE). Example records, creator names, platform metadata, and
third-party source links are not automatically covered by that code license.
Treat those materials according to their own rights and the source platform's
terms. Community project packs should carry their own attribution and license
notes.

Copyright © 2026 [False Dawn Industries](https://falsedawn.industries).

## Evidence limits

The engine labels repeatable moments independently before deriving a
record-level result. Partial framing, unclear audio, reposts, missing nights,
or a weak baseline lower confidence. When the evidence cannot support a
comparison, the correct output is **not enough to tell**.

These observations are about what is visible or audible in a public
performance record. They cannot establish an artist's health, feelings,
intent, fatigue, or private condition.

## Checks

```sh
pnpm run typecheck
pnpm --filter @workspace/api-server run typecheck
pnpm --filter @workspace/isharrytired run typecheck
pnpm --filter @workspace/isharrytired run build
```