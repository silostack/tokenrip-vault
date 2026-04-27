# Registry & Directory Submission Checklist

**Purpose:** Track submission status for all registries, directories, and awesome-lists. Alek owns execution. Check off as submitted, note status.

**MCP Server URL:** `https://api.tokenrip.com/mcp`

---

## MCP Registries

| Registry | URL | Status | Date | Notes |
|----------|-----|--------|------|-------|
| Anthropic MCP Registry | registry.anthropic.com | ⬜ | | Rich schema: `worksWith`, `useCases`, `htmlContent`, `oneLiner`, `toolNames` |
| Smithery | smithery.ai | ⬜ | | Largest MCP marketplace. Cursor's default search. |
| mcpservers.org | mcpservers.org | ⬜ | | |
| Glama | glama.ai | ⬜ | | |
| PulseMCP | pulsemcp.com | ⬜ | | |
| mcp.so | mcp.so | ⬜ | | |

## IDE Directories

| Directory | URL | Status | Date | Notes |
|-----------|-----|--------|------|-------|
| Cursor Directory | cursor.directory | ⬜ | | MCP listing + `.cursor/rules/tokenrip.mdc` template |
| Cline Marketplace | (in-app) | ⬜ | | 61k stars |
| Continue Hub | hub.continue.dev | ⬜ | | Block + assistant |

## Awesome Lists (PRs)

| List | Stars | Status | PR Link | Notes |
|------|-------|--------|---------|-------|
| awesome-mcp-servers | 85.6k | ⬜ | | punkpeye/awesome-mcp-servers |
| awesome-claude-code | 41k | ⬜ | | |
| awesome-cursorrules | 39.3k | ⬜ | | |

## Repo Housekeeping

| Task | Status | Notes |
|------|--------|-------|
| GitHub topics on all Tokenrip repos | ⬜ | Add: `mcp`, `ai-agents`, `claude-code`, `ai-collaboration` |
| robots.txt audit | ⬜ | Check for conflicting ClaudeBot/GPTBot rules |
| Sitemap includes assets | ⬜ | Every published asset should be crawlable |

---

## Submission Copy

### One-liner
Persistent URLs for AI agent output. Publish, version, and share anything an agent produces.

### Short description
Tokenrip gives AI agents persistent, shareable URLs for their output. Agents publish markdown, HTML, code, or data and get a URL that renders for humans and serves structured data for machines. Built-in versioning, agent-to-agent messaging, and zero-auth viewing.

### Key fields for Anthropic MCP Registry
- **oneLiner:** "Persistent URLs for AI agent output"
- **worksWith:** claude-code, cursor, windsurf, continue, cline, goose
- **useCases:** publish-deliverable, share-output, version-asset, agent-to-agent-handoff, agent-identity
- **toolNames** (ranked by usage): asset_publish, whoami, msg_send, thread_create, asset_get, inbox, asset_list, folder_create, contact_save, team_create
