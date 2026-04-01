# Documentation System

Centralized project documentation for Tokenrip. Agent-first, self-indexing via directory structure and descriptive filenames.

## Categories

| Directory | Purpose | Naming | Type |
|---|---|---|---|
| `architecture/` | System design, component relationships, tech decisions | `<slug>.md` | Living |
| `design/` | Completed feature designs — the *why* behind implemented features | `<slug>.md` | Living |
| `plans/` | **Pending work only** — designs and implementation plans awaiting execution | `YYYY-MM-DD-<slug>-{design,plan}.md` | Snapshot |
| `api/` | Endpoint docs, request/response formats, auth flows | `<slug>.md` | Living |
| `operations/` | Deployment, infrastructure, env setup, monitoring | `<slug>.md` | Living |

**Living docs** are kept current — update in place. **Snapshots** are point-in-time and dated.

## Plan Lifecycle

Plans go through a lifecycle: **planned → implemented → archived or deleted**.

1. **New work** starts with a design doc (`YYYY-MM-DD-<topic>-design.md`) and optionally an implementation plan (`YYYY-MM-DD-<topic>-plan.md`) in `plans/`.
2. **When implemented:** move the `-design.md` to `docs/design/<slug>.md` (drop the date prefix — it's now a living doc). Delete the `-plan.md` (the code is the source of truth for *how*).
3. **If `plans/` is empty**, the project has no pending work. That's a feature, not a bug.

The design docs in `docs/design/` capture rationale that isn't in the code — *why* decisions were made, alternatives considered, constraints that shaped the design.

## Rules

1. **Pick the right category.** If it describes *how the system works* → `architecture/`. If it describes *what we're building and why* → `design/`. If it's a *time-bound plan for work not yet done* → `plans/`. If it documents *API contracts* → `api/`. If it's about *running the system* → `operations/`.
2. **Use descriptive slugs.** The filename should tell you what's inside without opening it. E.g. `storage-abstraction.md`, `2026-03-29-auth-redesign.md`.
3. **No maintained index.** To find docs, glob or grep the subdirectories. E.g. `docs/**/*storage*` or grep for keywords.
4. **Update, don't duplicate.** For living docs, update the existing file. Don't create a new version.
5. **Keep docs scannable.** Use tables, headers, and short paragraphs. Optimize for agents loading docs into context.
6. **Graduate completed plans.** When a feature ships, move its design doc to `design/` and delete the implementation plan. Don't leave completed work in `plans/`.
