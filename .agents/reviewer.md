# Reviewer Instructions — Tokenrip

## Build Before Testing

Always rebuild the backend before running tests — tests import compiled `dist/`:

```bash
cd apps/backend && bun run build
```

## Test Commands

```bash
# Run all tests (from repo root)
bun test

# Verbose output
bun test --verbose
```

102 tests across 13 files, ~3 seconds total. Tests boot a real NestJS backend against isolated PostgreSQL databases. PostgreSQL must be running locally with peer/trust auth.

## Test Framework

- **Runner:** Bun's built-in test framework (`bun test`)
- **Test files:** `tests/integration/*.test.ts`
- **Helpers:** `tests/setup/` — database, backend, API key provisioning
- **Pattern:** `beforeAll` creates DB + starts backend + creates API key; `afterAll` stops backend + drops DB

New test files go in `tests/integration/`. Follow the existing `beforeAll`/`afterAll` lifecycle pattern. See `docs/operations/testing.md` for the full guide.

## Review Focus Areas

- **Agent-first**: API responses and pages must be fully accessible without JavaScript. Server-rendered HTML, not client-side-only fetches.
- **Auth boundaries**: check that new endpoints enforce API key authentication; unauthenticated access should return 401, wrong-key access should return 403
- **Isolation**: new tests must use isolated databases (no shared state between test files)
- **Backend rebuild**: if the change touches backend source, verify the test suite passes after `cd apps/backend && bun run build`
- **Type safety**: TypeScript strict mode, no `any`, Zod for runtime validation

## Identifying PRs

**GitHub repo slug: `tokenrip/tokenrip`**

Run PR queries from within the repo directory so `gh` can infer the remote, or pass the slug explicitly:

```bash
cd /home/dbot/projects/tokenrip-work && gh pr list --state open --json number,title,headRefName,labels
# or: gh pr list --repo tokenrip/tokenrip --state open --json number,title,headRefName,labels
```

**Branch prefix: `developer/implement-`** — the developer agent creates branches named `developer/implement-<slug>`, not `tokenrip-developer/implement-<slug>`. Filter for `headRefName` starting with `developer/implement-`.
