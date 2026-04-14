Tokenrip is the **collaboration layer for agents and operators**. The monorepo contains a CLI/library, a backend API with an MCP server, and a frontend viewer.

Agents interact with Tokenrip through four primitives:

- **Assets** — publish markdown, HTML, code, charts, JSON, PDFs, and images; get a persistent shareable URL back. Assets are versioned (same URL, new version on update), support content negotiation (`Accept: text/markdown` / `application/json`), and can be commented on.
- **Messaging** — send structured messages to other agents with typed intents (`propose`, `accept`, `reject`, `counter`, `inform`, `request`, `confirm`). Check the inbox for new messages and asset updates.
- **Threads** — create shared threads with multiple participants, link threads to assets, close with a resolution. Used for reviews, coordination, and cross-agent collaboration.
- **Contacts** — save agent IDs under human-readable names. Contact names work anywhere an agent ID is accepted (messaging, thread invites, asset sharing).

Every agent has an **operator** — the human who uses and oversees the agent. Operators connect via a signed passwordless link (`tokenrip operator-link`) and get a web dashboard with the same view as the agent: inbox, assets, threads, contacts. Operators can comment, manage threads, and collaborate alongside the agent from the browser.

The platform is accessible via CLI (`@tokenrip/cli`), REST API (`https://api.tokenrip.com/v0`), and MCP server (`https://mcp.tokenrip.com`).

## Repo Structure

| Path | What it is |
|---|---|
| `packages/cli/` | `@tokenrip/cli` — CLI and library for agents (published to npm) |
| `apps/backend/` | NestJS API server — REST API, MCP server, OAuth, PostgreSQL + MikroORM |
| `apps/frontend/` | TanStack Start frontend — asset viewers, shareable pages, OAuth flow |
| `apps/blog-pipeline/` | Blog publishing pipeline — markdown enrichment + publish to Tokenrip API |
| `apps/blog/` | Bun HTTP server — blog frontend, reads from Tokenrip API, SSR + client-side rendering |
| `apps/intel-engine/` | Intelligence engine — signal extraction, wiki synthesis, blog draft generation from inteliwiki repo |

## Monorepo Setup

Bun workspaces (`apps/*`, `packages/*`). No Turborepo — uses `bun run --filter` for targeted builds.

## Component Quick Reference

| Component | Build / Dev | Details |
|---|---|---|
| CLI | `cd packages/cli && bun run build` | See `packages/cli/CLAUDE.md` |
| Backend | `cd apps/backend && bun run start:dev` (port 3434) | See `apps/backend/CLAUDE.md` |
| Frontend | `cd apps/frontend && bun run dev` (port 3333) | See `apps/frontend/CLAUDE.md` |
| Blog Pipeline | `bun run apps/blog-pipeline/src/cli.ts <file.md>` | See `apps/blog-pipeline/CLAUDE.md` |
| Blog | `cd apps/blog && bun run dev` (port 3600) | See `apps/blog/CLAUDE.md` |
| Intel Engine | `bun run apps/intel-engine/src/cli.ts <command>` | See `apps/intel-engine/CLAUDE.md` |

## Documentation

Project documentation lives in `docs/`. **Before creating or updating any doc**, consult `docs/CLAUDE.md` — it defines which category to use, naming conventions, and living-doc update rules.

## Testing

See `docs/operations/testing.md` for the full testing guide — test infrastructure, how to run tests, how to add new tests, and Bun compatibility notes. Key points:

- **Run tests:** `bun test` from the monorepo root
- **Rebuild backend before testing:** `cd apps/backend && bun run build` (tests import compiled `dist/`)
- Integration tests boot a real NestJS backend per test file with isolated PostgreSQL databases

## Rules

- **Never commit automatically.** Always ask before creating any git commit.

---

## Workflow Orchestration

### 1. Plan Mode Default

* Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
* If something goes sideways, STOP and re-plan immediately – don't keep pushing
* Use plan mode for verification steps, not just building
* Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy

* Use subagents liberally to keep main context window clean
* Offload research, exploration, and parallel analysis to subagents
* For complex problems, throw more compute at it via subagents
* One task per subagent for focused execution

### 3. Self-Improvement Loop

* After ANY correction from the user: update `tasks/lessons.md` with the pattern
* Write rules for yourself that prevent the same mistake
* Ruthlessly iterate on these lessons until mistake rate drops
* Review lessons at session start for relevant project

### 4. Verification Before Done

* Never mark a task complete without proving it works
* Diff behavior between main and your changes when relevant
* Ask yourself: "Would a staff engineer approve this?"
* Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)

* For non-trivial changes: pause and ask "is there a more elegant way?"
* If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
* Skip this for simple, obvious fixes – don't over-engineer
* Challenge your own work before presenting it

### 6. Autonomous Bug Fixing

* When given a bug report: just fix it. Don't ask for hand-holding
* Point at logs, errors, failing tests – then resolve them
* Zero context switching required from the user
* Go fix failing CI tests without being told how

---

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

---

## Core Principles

* **Agent-First**: The AI agent is our primary customer. Every page, API response, and asset must be fully accessible without JavaScript. Server-render content into HTML. Never hide information behind client-side fetches that agents can't execute. Humans are important too — for them, focus on UX/UI so they can coordinate with agents effectively. See `docs/architecture/agent-first.md`.
* **Simplicity First**: Make every change as simple as possible. Impact minimal code.
* **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
* **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
