# Field Notes · Open Performance Review

Local-first, artist-agnostic tooling for comparing repeatable public performance moments with source lineage and explicit evidence limits.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the read-only API server
- `pnpm --filter @workspace/isharrytired run dev` — run the Field Notes web app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- No database or account system is required for the first release.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — artist-agnostic OpenAPI source of truth
- `lib/performance-review` — conservative comparison engine
- `artifacts/api-server/src/lib/demo-data.ts` — clearly labelled illustrative project
- `artifacts/isharrytired/src/pages/import-review.tsx` — browser-only JSON/CSV validation
- `examples/records` — valid and invalid contributor fixtures

## Architecture decisions

- The API is read-oriented and database-free; imported files stay in the browser.
- Repeatable moments are labelled independently before deriving a record-level result.
- Fewer than two comparable records, mixed moment labels, or insufficient source coverage yields `no_reliable_read`.
- Source URLs are preserved as attribution/provenance metadata; the app never downloads or renders arbitrary media.
- Stage observations never become claims about health, feelings, intent, or private condition.

## Product

The web app presents the open-source method, an illustrative Harry Styles/MSG
example project, bounded source search, source-linked record comparisons, and a
browser import preview for other communities' JSON/CSV projects.

## User preferences

- Keep the restrained field-record aesthetic and plain evidence language.

## Gotchas

- Run API codegen after any OpenAPI change before using generated types or hooks.
- The Vite build needs `PORT` and `BASE_PATH`; managed workflows provide them.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
