# Tasks

Work management for Tokenrip. Separate from `docs/` — plans are ephemeral work artifacts, not documentation.

## Structure

| Path | Purpose |
|---|---|
| `plans/` | Pending work — designs and implementation plans awaiting execution |
| `implemented/` | Agent has implemented; awaiting review |
| `reviewed/` | Reviewed and approved; deploy pipeline will graduate the design doc to `docs/design/` |
| `todo.md` | Current session task list |
| `lessons.md` | Accumulated lessons from corrections |
| `changelog.md` | Running log of shipped features, fixes, and improvements |

## Plan Lifecycle

```
plans/ → implemented/ → reviewed/ → docs/design/
```

1. **New work** starts in `plans/` as `YYYY-MM-DD-<topic>-design.md` and optionally `YYYY-MM-DD-<topic>-plan.md`.
2. **After implementation:** move files to `implemented/`.
3. **After review:** move files to `reviewed/`.
4. **On merge/deploy:** the pipeline moves the `-design.md` to `docs/design/<slug>.md` (drop date prefix — it becomes a living doc). The `-plan.md` is deleted (the code is the source of truth for *how*).

If `plans/` is empty, the project has no pending work. That's a feature, not a bug.

## Changelog

`changelog.md` is an append-only log of completed work. Each entry records what was done so there's a trail to reference later.

**Format:**

```markdown
## YYYY-MM-DD — Short title

One paragraph describing the change: what it does, why, and the scope.

**What changed:**
- Bullet list of concrete changes (files, endpoints, commands, UI).
```

Newest entries go at the top (after the header). Keep descriptions concise — the code and git history have the details.
