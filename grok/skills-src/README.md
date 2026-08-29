These are repo-owned Grok Build skill wrappers for Tokenrip.

Each skill is intentionally thin. The workflow source of truth remains the
matching file in `.claude/commands/` (or `.claude/skills/` for certain richer
skills), and the Grok skill only points at that file.

The actual discoverable skill files for Grok are placed (or symlinked) under
`.agents/skills/` (Grok explicitly scans this location) and under `.grok/skills/`.

No setup script is needed. When you run `grok` inside this repo, the skills
are automatically available as slash commands.

This follows the same lightweight delegation pattern as the Codex layer
(though Codex uses an explicit setup script for its global skills).
