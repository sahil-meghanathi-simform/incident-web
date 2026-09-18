# incident-web

Frontend for the Incident Reporting & Escalation POC. React 18 + TypeScript + Vite +
React Router (data mode) + TanStack Query v5 + React Hook Form + Zod + Tailwind v4.
Companion backend: `../incident-api` (sibling checkout).

## Quick start

Normally started via `docker compose up` in `../incident-api` (brings up the whole
stack). For standalone frontend development:

```bash
cp .env.example .env
npm install
npm run dev        # http://localhost:5173, proxies /api to VITE_API_BASE_URL
```

## Contracts

`src/api/contracts/` is **vendored, never hand-edited** — copied from
`../incident-api/contracts-dist` (§2.6 of `../build-plan.md`):

```bash
npm run contracts:sync    # after `npm run contracts:export` in ../incident-api
npm run contracts:check   # fails if the vendored copy has drifted from the manifest
```

The API also sends `X-Contract-Version` on every response; `api/client.ts` compares it
against the client's own constant and calls a registered mismatch handler on drift —
the runtime backstop for the two-repo contract-drift risk.

CI (`.github/workflows/ci.yml`) runs `contracts:check` on every push/PR — that alone
only proves the vendored copy matches its own committed manifest (catches a hand-edit,
not a forgotten sync). A second job, `contracts-parity`, does the real cross-repo
check — exports fresh from a live `incident-api` checkout, re-runs `contracts:sync`,
and fails if that produces any diff — but `incident-api` is a private sibling repo, so
this job needs a fine-grained PAT with read access to it, stored as this repo's
`CROSS_REPO_PAT` secret; it skips cleanly (not a failure) if that secret is unset.

## Tailwind v4

No `tailwind.config.ts` — design tokens (severity/stage/escalation-level colour scales)
live in an `@theme` block in `src/styles/index.css`, loaded via the `@tailwindcss/vite`
plugin. `SeverityBadge`, `StageBadge`, `EscalationLevelBadge` and the analytics matrix's
heat shading all read from that single source.

## State responsibilities (Module 0 baseline)

| State | Owner |
|---|---|
| Access token | in-memory module variable in `api/client.ts` — never `localStorage` |
| Refresh token | httpOnly cookie, invisible to JS |
| Server data | TanStack Query cache |
| Filters/page/sort | URL search params (`useSearchParamsState`, `useOffsetPagination`) |

## Testing

```bash
npm test
```
