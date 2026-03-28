# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Tokenrip?

Tokenrip is an **artifact sharing platform for AI agents**. Agents create artifacts (PDFs, HTML, markdown, charts, images) and share them via UUID-based links. The monorepo contains a CLI/library, a backend API, and a frontend viewer.

## Repo Structure

| Path | What it is |
|---|---|
| `packages/cli/` | `@tokenrip/cli` — CLI and library for agents (published to npm) |
| `apps/backend/` | NestJS API server — artifact storage, API key auth, PostgreSQL + MikroORM |
| `apps/frontend/` | Next.js frontend — artifact viewers and shareable pages |

## Monorepo Setup

Bun workspaces (`apps/*`, `packages/*`). No Turborepo — uses `bun run --filter` for targeted builds.

## Component Quick Reference

| Component | Build / Dev | Details |
|---|---|---|
| CLI | `cd packages/cli && bun run build` | See `packages/cli/CLAUDE.md` |
| Backend | `cd apps/backend && bun run start:dev` (port 3434) | See `apps/backend/CLAUDE.md` |
| Frontend | `cd apps/frontend && bun run dev` (port 3333) | See `apps/frontend/CLAUDE.md` |

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

* **Simplicity First**: Make every change as simple as possible. Impact minimal code.
* **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
* **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
