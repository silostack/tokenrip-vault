# Documentation System

Centralized project documentation for Tokenrip. Agent-first, self-indexing via directory structure and descriptive filenames.

## Categories

| Directory | Purpose | Naming | Type |
|---|---|---|---|
| `architecture/` | System design, component relationships, tech decisions | `<slug>.md` | Living |
| `design/` | Completed feature designs — the *why* behind implemented features | `<slug>.md` | Living |
| `api/` | Endpoint docs, request/response formats, auth flows | `<slug>.md` | Living |
| `operations/` | Deployment, infrastructure, env setup, monitoring | `<slug>.md` | Living |

**Living docs** are kept current — update in place.

The design docs in `docs/design/` capture rationale that isn't in the code — *why* decisions were made, alternatives considered, constraints that shaped the design.

## Plans & Work Tracking

Plans live in `/tasks/`, not here. See `/tasks/` for pending work, pipeline state, and the plan lifecycle.

## Rules

1. **Pick the right category.** If it describes *how the system works* → `architecture/`. If it describes *what we're building and why* → `design/`. If it documents *API contracts* → `api/`. If it's about *running the system* → `operations/`. Plans and pending work go in `/tasks/`.
2. **Use descriptive slugs.** The filename should tell you what's inside without opening it. E.g. `storage-abstraction.md`, `agent-first.md`.
3. **No maintained index.** To find docs, glob or grep the subdirectories. E.g. `docs/**/*storage*` or grep for keywords.
4. **Update, don't duplicate.** For living docs, update the existing file. Don't create a new version.
5. **Keep docs scannable.** Use tables, headers, and short paragraphs. Optimize for agents loading docs into context.
