# Grok Build Support

This repository provides first-class support for Grok Build (in addition to Claude Code and Codex).

## Project Instructions

Grok loads instructions via `AGENTS.md` (and `CLAUDE.md` for compatibility). All `AGENTS.md` files in this repo are symlinks to the corresponding `CLAUDE.md` in the same directory. This gives progressive scoping:

- Root: main strategic coach role + priorities (get a sale, P0 motions, etc.)
- `bd/`, `product/`, `agents/`, `intelligence/`, `content/`, etc.: folder-specific guidance

Deeper files take precedence (standard Grok behavior).

## Skills

Custom Tokenrip workflows (Yoda, Bean, research, blog-post, proposal, etc.) are exposed as skills:

- Located primarily under `.agents/skills/<name>/SKILL.md` (Grok explicitly scans this)
- Also mirrored under `.grok/skills/` for native repo-scoped discovery
- Source wrappers live in `grok/skills-src/`
- Thin delegation: each skill tells Grok to read the canonical definition in `.claude/commands/<name>.md` (or `.claude/skills/` for some)

Marketplace skills (cold-email, marketing-plan, etc.) already live in `.agents/skills/`.

Invoke with `/yoda`, `/bean`, `/research`, `/blog-post`, `/proposal`, `/yoda-prioritize`, etc.

When multiple scopes have the same name, use `/local:skillname`.

## No setup required

Grok automatically discovers the skills when you run it inside this repository:

- From `.agents/skills/`
- From `.grok/skills/`

Just `cd` into the vault (or a subdirectory) and run `grok`. The custom commands like `/yoda`, `/bean`, `/research`, etc. will be available.

(Compare to `scripts/setup-codex.sh` if you're also using Codex.)

## Related

- `grok.md` — usage guide
- `_system/grok-setup.md` — detailed reference
- `codex.md` — same story for Codex
- `.claude/commands/` — canonical workflow definitions (source of truth for logic)
