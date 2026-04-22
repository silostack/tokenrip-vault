# Hermes Prompt: Moltbook Intelligence Scanner for Tokenrip

**Purpose:** Give this prompt to Hermes to set up recurring Moltbook scanning for Tokenrip-relevant signals.

---

## Mission: Moltbook Intelligence Scanner for Tokenrip

You have a recurring job: scan Moltbook for signals relevant to **Tokenrip**, an agentic collaboration platform. Run this scan roughly every hour.

### What Tokenrip is (quick context)

Tokenrip is a platform where AI agents can publish assets (documents, data, code), collaborate through threads, and share context across teams and organizations. Think of it as the collaboration infrastructure layer for agents — agents register, publish, message each other, and poll for updates. Humans interact through rendered views and through their agents. The core API: `register`, `publish`, `GET /:id`, `GET /status`.

The key thesis: existing collaboration tools (Notion, Slack, Google Docs) are human-first. Agents are second-class. Tokenrip is agent-first. The moat builds through accumulated coordination data — versioning history, thread resolutions, organizational context graphs.

### What to scan for

Look for signals in these categories:

1. **Operator pain points** — People struggling with agent outputs trapped in chat, difficulty sharing agent work, context fragmentation across tools
2. **Agent collaboration patterns** — Any instances of agents working together, handing off work, or attempting to share context. How are people solving this today?
3. **Asset sharing friction** — People sharing agent-generated content awkwardly (screenshots of chat, copy-pasting into docs, emailing outputs). Workarounds that Tokenrip would replace
4. **Competitive signals** — Tools, projects, or protocols being discussed that overlap with Tokenrip's space (agent-to-agent messaging, artifact sharing, agentic coordination)
5. **Distribution opportunities** — Agent frameworks, tools, or communities where Tokenrip integration would be natural. People asking "how do I share this?" or "how do I get my agents to work together?"
6. **Interesting use cases** — Novel agent workflows, multi-agent setups, or agent-produced content types that reveal what the collaboration layer needs to support

### How to operate

**Each scan cycle:**
1. Check your local state file (`moltbook-scan-state.json`) to see what you've already processed — avoid re-reporting the same signals
2. Scan Moltbook for new activity
3. For anything interesting, assess relevance (high/medium/low) and categorize it
4. Append new findings to your Tokenrip collection (see below)
5. Update your state file with what you've processed

**State file (`moltbook-scan-state.json`):**
Keep a JSON file tracking:
- `last_scan_timestamp` — when you last scanned
- `processed_ids` — IDs/URLs of posts/threads you've already evaluated (so you don't re-process)
- `scan_count` — running total of scans completed

**If you don't have a collection yet**, create one using the tokenrip skill with this schema:

| Column | Type | Description |
|--------|------|-------------|
| `signal` | text | What you found — concise description |
| `category` | enum | One of: `operator-pain`, `agent-collab`, `asset-sharing`, `competitive`, `distribution`, `use-case` |
| `relevance` | enum | `high`, `medium`, `low` |
| `source` | url | Link to the Moltbook post/thread |
| `author` | text | Who posted it (handle or name) |
| `date` | date | When it was posted |
| `notes` | text | Your analysis — why this matters for Tokenrip, what it implies |

Title the collection: **"Moltbook Signals — Tokenrip"**

### Judgment calls

- **High relevance**: Direct pain point Tokenrip solves, competitive threat, or high-value distribution opportunity
- **Medium relevance**: Adjacent signal — related to agent workflows but not directly about collaboration/sharing
- **Low relevance**: Weak signal — tangentially related, worth logging but not acting on immediately
- **Skip entirely**: Generic AI discussion with no collaboration/sharing angle. Don't log noise.

Err on the side of logging — I can always delete junk rows. But write sharp, specific signal descriptions, not vague summaries. "User X says they copy-paste Claude outputs into Notion because there's no way to share a link" is useful. "People are talking about AI tools" is not.

### Cadence

Run every ~1 hour. If a scan turns up nothing new, that's fine — just update the timestamp and move on. Don't force findings. If Moltbook is quiet, the scan should be fast.
