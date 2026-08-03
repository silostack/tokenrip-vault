# Closer — Agent Operating File

Canonical boot + hygiene rules for the Closer agent. Wrappers (`.claude/commands/closer.md`, `/upwork`, Grok/Codex adapters) defer here for boot; they add only mode-specific reading.

## Boot (every session, in order)

1. `agents/closer/persona.md` — who you are, voice, principles, pre-send checklist
2. `DASHBOARD.md` (vault root) — **the current motion, live deals, priorities. This is operational truth.**
3. `agents/closer/context.md` — closer-specific execution state (thin; DASHBOARD wins on conflict)
4. `agents/closer/memory/patterns.md` — the distilled pattern library
5. Last 2 session notes in `agents/closer/memory/sessions/`

**Never boot-load:** `context-archive.md`, `upwork-proposal-playbook.md` (mode-specific, below), old session notes. Grep archives on demand.

## Mode-specific reading (only when the session needs it)

- **Upwork bid / proposal work** → `agents/closer/upwork-proposal-playbook.md` (in full)
- **Sprint call work (prep, debrief, objections, follow-up)** → `active/90day/sales-playbook.md` (scripts, objection bank, rules of engagement) + `active/90day/call-log.md` + `bd/calls/quintel-sales-tear-sheet.md`
- **Cold outreach message** → the current motion's own scripts win (per DASHBOARD's playbook links); `agents/closer/insurance-linkedin-outreach.md` is the underlying cross-vertical rubric (bucketing, anatomy, house style)
- **Other deal work** → `bd/CLAUDE.md` (the BD index) for the relevant deal docs. *(The old firm-direct gameplan is archived: `__ARCHIVE/bd-motion-a-firm-direct-2026-05-01/`.)*

## Boot sentinels (run before the session starts; warn Simon out loud on any hit)

| Check | Trigger | Response |
|---|---|---|
| `context.md` "Last updated" age | > 14 days old | Say so first; reconcile against DASHBOARD before advising. Pipeline files rot in days, not months. |
| `context.md` vs `DASHBOARD.md` | Any contradiction (deal status, priority, phase) | DASHBOARD wins. Fix context.md in-session. |
| `wc -l agents/closer/memory/patterns.md` | > 220 lines | Warn: "patterns.md over cap — run `/closer-compact`." |
| `wc -l agents/closer/context.md` | > 60 lines | Same warning. |
| Open commitments in last session note | Any past-due | Open the session with them: sent or not? Before any new work. |

## Session-end protocol (every session)

1. **Commitments list** — action, owner, deadline. No session ends without one.
2. **Update `context.md`** — new state, date-stamp the "Last updated" line, clear what's done. If a deal died, say so and move its notes to `context-archive.md`.
3. **Patterns compaction micro-step** — a new pattern earns a patterns.md entry only if it changes future behavior; the file is capped, so promoting may require demoting (weakest entry → delete or fold). Never append raw session narrative.
4. **Session note** from `memory/sessions/_template.md`.

## Consolidation

`/closer-compact` (run every ~2–4 weeks or on any sentinel hit): sweep context + archive for dead deals, adjudicate stale open commitments, enforce the patterns cap, report before/after sizes. Simon ratifies non-obvious kills.
