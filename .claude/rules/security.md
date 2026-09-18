---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
  - "vite.config.ts"
  - "playwright.config.ts"
  - ".env*"
---

# Security

## Environment variables are not secrets

Vite inlines every `VITE_`-prefixed variable into the client bundle at build time. It ships to the browser as a string literal in a public JS file. `import.meta.env.VITE_API_KEY` is readable by anyone who opens DevTools — there is no runtime lookup and no server to hide behind.

So the `.env` rule in `.claude/rules/architecture.md` is about *hardcoding*, not about safety:

- `VITE_*` — public values only: API base URL, feature flags, publishable/anon keys explicitly documented by the vendor as client-side (Stripe `pk_`, Supabase anon, PostHog project key).
- **Never** `VITE_*` — API secrets, private keys, DB credentials, service-role tokens, anything with a `sk_`/`secret`/`private` in its name. If a value would do damage in a stranger's hands, it does not belong in this app at all; it belongs behind a backend endpoint this app calls.
- Unprefixed vars in `.env` are visible to Node-side config only — `vite.config.ts`, `playwright.config.ts`. The test credentials in `.claude/rules/testing.md` are read there and passed into the browser context; they are never `VITE_*`.

`.env` is gitignored. `.env.example` is committed with every key present and every value blank or a placeholder, so the required set is discoverable without leaking one.

## Auth tokens

- An access token lives in memory (the auth Context from `.claude/rules/state-management.md`), or in an httpOnly cookie the app never reads. Not in `localStorage` or `sessionStorage` — both are readable by any script that reaches the page, which turns one XSS into a stolen session.
- A refresh token is httpOnly-cookie only. Never in JS-reachable storage.
- Logout clears the in-memory session *and* calls `queryClient.clear()` (`.claude/rules/queries.md`), so the next user of the tab can't read the previous one's cached data.
- Never log, toast, or put a token in a URL, a query key, or an error message.

## Rendering untrusted content

- `dangerouslySetInnerHTML` requires a sanitizer (DOMPurify) on the value, at the point of render, with a comment naming where the HTML came from. Without one it is banned.
- Never build an `href` or `src` from user or API input without checking the scheme — `javascript:` and `data:` in an `href` execute. Allow `http`, `https`, `mailto`, and app-relative paths.
- `target="_blank"` carries `rel="noopener noreferrer"`.
- React escapes text content by default. Don't defeat that to render "formatted" strings; render structure with JSX instead.

## Input from outside the app

URL and route params, `postMessage` payloads, and API responses are attacker-controllable, not merely unknown-shaped. `.claude/rules/typescript.md` requires they enter as `unknown` and get validated; that Zod parse is the security boundary, not just a typing convenience. A redirect target read from a query param is validated against `ROUTES` before `navigate()` — never passed straight through, or the app becomes an open redirect.

## Dependencies

- `npm audit` clean of high and critical before a release.
- A new dependency that handles auth, crypto, or HTML sanitization is a discussion, not a solo call.
- Lockfile is committed and installs use `npm ci` in CI.
