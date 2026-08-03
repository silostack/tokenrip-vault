# Codex Setup

This vault now supports Codex without duplicating the Claude instruction body.

## How it works

### 1. Directory instructions

Codex looks for `AGENTS.md` files and applies them progressively as work moves
down the directory tree.

This vault exposes the existing `CLAUDE.md` hierarchy to Codex by using
`AGENTS.md` symlinks:

- root `AGENTS.md` already points to `CLAUDE.md`
- each nested folder with a `CLAUDE.md` now has a matching `AGENTS.md` symlink

That preserves the same instruction layering model Claude Code was using.

### 2. Command compatibility

Codex does not use Claude custom slash-command files directly. Instead, it uses
skills.

Repo-owned skill wrappers live in `codex/skills-src/`. Each skill is thin and
delegates to the matching file in `.claude/commands/`, which remains the source
of truth.

Examples:

- `codex/skills-src/yoda/` -> `.claude/commands/yoda.md`
- `codex/skills-src/blog-post/` -> `.claude/commands/blog-post.md`
- `codex/skills-src/engagement/` -> `.claude/commands/engagement.md`

## Install the skills

Run:

```bash
scripts/setup-codex.sh
```

The script symlinks the repo skill wrappers into:

- `$CODEX_HOME/skills` when `CODEX_HOME` is set
- `~/.codex/skills` otherwise

## Use the skills

After running the setup script:

1. start Codex in this repo
2. trust the project if prompted
3. restart Codex if the skills do not appear immediately
4. invoke the workflow with names like:
   - `$yoda`
   - `$bean`
   - `$blog-post`
   - `$engagement`
   - `$research`

## Source of truth

- directory behavior and vault guidance: `CLAUDE.md` files
- Codex discovery layer: `AGENTS.md` symlinks
- workflow logic: `.claude/commands/*.md`
- Codex wrapper layer: `codex/skills-src/*/SKILL.md`
