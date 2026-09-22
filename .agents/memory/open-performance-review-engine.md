---
name: Open performance review engine
description: Implemented artist-agnostic, open-source performance review tool
---

The product is an artist-agnostic, local-first open performance review tool. Its reusable contract covers projects, artists, records, repeatable moments, observations, sources, provenance, coverage, baseline, confidence, and bounded results. The first input paths are a curated public-source index and browser-only JSON/CSV import.

Keep the evidence-first boundary: analyze observable public performance data, clearly label source quality and illustrative/demo records, and avoid claims about an artist’s health, internal feelings, or private condition. Browser imports remain unpersisted; the API does not fetch arbitrary user URLs or host source media. Comparisons return no_reliable_read when fewer than two comparable records support a moment.

**Why:** The user wants the work to become reusable infrastructure for fan communities rather than a single-artist destination, while keeping the first release inspectable and database-free.

**How to apply:** Keep product language artist-neutral and put the repository, schema, source-use expectations, and evidence limits at the landing-page entry point. Treat any named artist dataset as an explicitly labelled example project.