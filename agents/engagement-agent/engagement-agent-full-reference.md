# Engagement Agent — Full System Reference

> Complete technical reference for the Tokenrip-hosted engagement agent. Contains every asset ID, API key, schema, and architectural decision. Use this document to reconstruct, modify, or replicate the system from scratch.

---

## Architecture Overview

The engagement agent follows the **bootloader pattern**: a thin local Claude Code command (`.claude/commands/engagement.md`) that dynamically loads its full instructions from Tokenrip assets at runtime. This means:

- Multiple operators (Simon, Alek) run the same agent from their own terminals
- Agent logic lives in Tokenrip, not on any local machine
- Updates happen by publishing new asset versions — no local file changes
- Every instruction set is versioned and auditable

```
┌─────────────────────────────────────────────────────────────┐
│  LOCAL MACHINE (.claude/commands/engagement.md)             │
│                                                             │
│  Contains: API keys, inbox ID, default config, routing      │
│  Does: Parses mode arg → fetches correct Tokenrip assets    │
└────────────────────────┬────────────────────────────────────┘
                         │ rip asset cat
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  TOKENRIP ASSETS (engagement folder, tokenrip team)         │
│                                                             │
│  engagement-common     → shared context (loaded every run)  │
│  engagement-ingest     → ingest mode instructions           │
│  engagement-draft      → draft mode instructions            │
│  engagement-outreach   → outreach mode instructions         │
│  engagement-send       → send mode instructions             │
│  engagement-template   → outreach email template            │
└────────────────────────┬────────────────────────────────────┘
                         │ rip collection rows/append/update
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  TOKENRIP COLLECTIONS (engagement folder, tokenrip team)    │
│                                                             │
│  Outreach List   → 2,357 agent emails, tracks send status   │
│  Engagement CRM  → responding agents, drafts, approvals     │
└────────────────────────┬────────────────────────────────────┘
                         │ agentmail CLI
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  AGENTMAIL                                                   │
│                                                             │
│  Inbox: tokenrip@agentmail.to                               │
│  Sends outreach, receives replies, maintains thread history  │
└─────────────────────────────────────────────────────────────┘
```

---

## Credentials & Configuration

### AgentMail

| Key | Value |
|-----|-------|
| **API Key** | `am_us_1eee6c92d56f53b81bc3d8adad229a737cf3a9e514d604515e67861333bb097e` |
| **Inbox ID** | `tokenrip@agentmail.to` |
| **Display Name** | `engagment-agent` |
| **Organization ID** | `0dbd72a2-8906-4351-886f-8ca3baa866b4` |
| **CLI** | `agentmail` (must be installed on operator machine) |
| **Docs** | https://docs.agentmail.to/integrations/cli |

### Tokenrip

| Key | Value |
|-----|-------|
| **Team** | `tokenrip` (ID: `1aa344d6-8f83-41b2-a4db-ac3d6e26d167`) |
| **Folder** | `engagement` (ID: `7a3df3cf-a249-4d05-bd67-734cc9f042a0`) |
| **CLI** | `rip` (must be installed and authenticated on operator machine) |

---

## Asset Registry

All assets live in the `engagement` folder of the `tokenrip` team. Each has an alias for human-readable `rip asset cat <alias>` access.

| Asset | ID | Alias | Type | Purpose |
|-------|-----|-------|------|---------|
| **Engagement Common** | `d6e9ab1e-72ce-4cbe-86cc-0d6ec37c7dfd` | `engagement-common` | markdown | Shared context: collection IDs, schemas, tiers, draft guidelines |
| **Engagement Ingest** | `483b2cd8-5962-4b68-aa15-b945ab321505` | `engagement-ingest` | markdown | Ingest mode: inbox polling, classification, CRM row creation |
| **Engagement Draft** | `07f062b4-9a44-4e05-8a91-523d9acb0f0c` | `engagement-draft` | markdown | Draft mode: generate follow-up responses |
| **Engagement Outreach** | `0c5bae24-90c3-4875-8e8f-ec49afd8dab0` | `engagement-outreach` | markdown | Outreach mode: send pitch emails in batches |
| **Engagement Send** | `80b105e4-1824-4d09-a06c-d2e4d2471807` | `engagement-send` | markdown | Send mode: deliver approved drafts |
| **Engagement Template** | `da16db80-ad0a-473d-801c-e6d7a7c63395` | `engagement-template` | markdown | Outreach email: subject + body |
| **Outreach List** | `760b8965-a94f-4137-aadf-fd7278a4b4ea` | `engagement-outreach-list` | collection | Master email list (2,357 rows) |
| **Engagement CRM** | `3acab0bd-f40b-4eef-a437-28ee4d18e021` | `engagement-crm` | collection | Responding agents + engagement tracking |

**URLs:** Any asset is viewable at `https://tokenrip.com/s/<id>`

**Updating an asset:** `rip asset update <id> <file>` publishes a new version. The alias always resolves to the latest version.

---

## Collection Schemas

### Outreach List (`760b8965-a94f-4137-aadf-fd7278a4b4ea`)

| Column | Type | Values / Description |
|--------|------|---------------------|
| `agent_email` | text | AgentMail address (logical primary key) |
| `status` | enum | `pending`, `sent`, `responded`, `engaged` |
| `agentmail_thread_id` | text | Thread created when outreach was sent |
| `sent_at` | date | When initial outreach was sent |
| `responded_at` | date | When they first replied |
| `notes` | text | Anything notable |

**Status progression:**
```
pending  →  sent  →  responded  →  engaged
```

**Initial population:** 2,357 rows imported from `agentmail-emails.csv` after deduplication (588 dupes removed) and filtering of system/test addresses (`billing@`, `demo@`, `deleted@`, etc.). All rows start as `pending`.

### Engagement CRM (`3acab0bd-f40b-4eef-a437-28ee4d18e021`)

| Column | Type | Values / Description |
|--------|------|---------------------|
| `agent_email` | text | AgentMail address (logical primary key) |
| `agent_name` | text | Extracted from their response |
| `status` | enum | `new`, `draft_ready`, `waiting`, `closed`, `noise` |
| `engagement_tier` | enum | `activated`, `interested`, `evaluating`, `deferred`, `noise` |
| `what_they_do` | text | One sentence — what this agent works on |
| `interested_in` | text | Which Tokenrip features they mentioned |
| `our_draft` | text | Drafted response waiting for review |
| `approved` | boolean | Checkbox — operator ticks to approve sending |
| `last_message_from` | text | Their most recent message content |
| `agentmail_thread_id` | text | AgentMail thread ID for conversation history |
| `last_message_id` | text | Most recent message ID (for reply threading + new message detection) |
| `last_contact` | date | Most recent message timestamp (either direction) |
| `notes` | text | Human notes |

**Status progression:**
```
new  →  draft_ready  →  [approved checkbox]  →  waiting  →  (new again on reply)
                                                          →  closed
noise (terminal)
```

**Starts empty.** Populated by the ingest mode as responses arrive.

---

## The Bootloader (Local Command)

**File:** `.claude/commands/engagement.md`

```markdown
# Engagement Agent

## Config

- **AgentMail API Key:** `am_us_1eee6c92d56f53b81bc3d8adad229a737cf3a9e514d604515e67861333bb097e`
- **AgentMail Inbox:** `tokenrip@agentmail.to`
- **Default batch size:** 10

## Instructions

Run these commands in order:

1. Run `rip update` to ensure the latest CLI version
2. Run `rip asset cat engagement-common` to load shared context
3. Based on the mode in $ARGUMENTS, load the mode-specific instructions:
   - `ingest` → Run `rip asset cat engagement-ingest`
   - `draft` → Run `rip asset cat engagement-draft`
   - `outreach` → Run `rip asset cat engagement-outreach`
   - `send` → Run `rip asset cat engagement-send`
4. Follow the returned instructions exactly, using the config values above for authentication

If no mode is provided, display:

Available modes:
  /engagement ingest     — Check inbox for new responses, classify, create CRM rows
  /engagement draft      — Draft follow-up responses for new messages
  /engagement outreach   — Send initial pitch emails (default batch: 10, override: "outreach batch 50")
  /engagement send       — Send approved draft responses

Pass any additional arguments (like batch size) through to the mode instructions.
```

**Why config lives here (not in assets):**
- API keys must not be in Tokenrip assets (publicly readable)
- Inbox ID and batch size are operational config, not agent logic
- Each operator's machine has the same command file — shared via git

**How to set up a new operator:**
1. Clone the vault repo (or copy `.claude/commands/engagement.md`)
2. Ensure `rip` CLI is installed and authenticated (`rip auth`)
3. Ensure `agentmail` CLI is installed
4. Set `AGENTMAIL_API_KEY` env var or use the key from the command file
5. Run `/engagement` to verify

---

## Mode Workflows

### `/engagement ingest`

**Purpose:** Check AgentMail inbox for new responses, classify them, create or update CRM rows.

**Flow:**
1. List all threads from the AgentMail inbox
2. For each thread, get messages and identify the sender
3. Match sender to outreach list (by email or thread ID)
4. Check if CRM row exists for this sender
5. **New message detection:** Compare `last_message_id` in CRM against latest message in AgentMail thread. If they match, nothing new — skip. (No cursor needed; self-healing if a run is missed.)
6. **First response:** Classify tier → create CRM row (`status: new`) → update outreach row (`status: responded`)
7. **Follow-up:** Update CRM row → reset `status: new` → update outreach row (`status: engaged`)
8. **Noise:** Set CRM `status: noise`, skip drafting

**Engagement tier classification:**

| Tier | Signal |
|------|--------|
| `activated` | Said "ACTIVATE", confirmed CLI setup, described using Tokenrip |
| `interested` | Positive response, specific use cases, product questions |
| `evaluating` | Neutral, said they'll look later, no specific use case |
| `deferred` | Needs human approval, no current use case, explicit "not now" |
| `noise` | Auto-responder, hiring bot, off-topic |

### `/engagement draft`

**Purpose:** Generate follow-up responses for all CRM rows with `status == new`.

**Flow:**
1. Query CRM for `status == new`
2. For each row, read full conversation history from AgentMail via `agentmail_thread_id`
3. Draft response following quality guidelines (see below)
4. Write draft to `our_draft` column, set `status → draft_ready`

**Draft quality rules:**
- Acknowledge something specific they said
- Connect their situation to a specific Tokenrip capability
- Answer any questions they asked
- Give one concrete suggestion
- Ask one follow-up question
- Tone: peer-to-peer, curious, direct, match their register
- Length: 3-5 paragraphs
- Never: marketing language, generic responses, multiple questions, mention auto-drafting

### `/engagement outreach [batch N]`

**Purpose:** Send initial pitch emails to `pending` agents.

**Flow:**
1. Load email template from `engagement-template` asset
2. Query outreach list for `status == pending` (limit: batch size, default 10)
3. For each row, send email via AgentMail CLI
4. Capture `thread_id` from response
5. Update row: `status → sent`, `sent_at → now`, `agentmail_thread_id`

**Batch size:** Defaults to 10. Override with natural language: `/engagement outreach batch 50`

### `/engagement send`

**Purpose:** Send approved draft responses.

**Flow:**
1. Query CRM for `approved == true AND status == draft_ready`
2. For each row, send reply via AgentMail on existing thread
3. Update row: `status → waiting`, `approved → false`, clear `our_draft`, `last_contact → now`

---

## Daily Operating Rhythm

```
Morning:
  /engagement ingest              → pull new messages
  /engagement draft               → draft responses

  ↓ Operator reviews drafts in Engagement CRM collection view
  ↓ Reads our_draft column, edits if needed
  ↓ Checks the "approved" checkbox on good drafts

  /engagement send                → send approved responses

Periodically (new waves):
  /engagement outreach            → send 10 emails
  /engagement outreach batch 200  → send a larger wave
```

---

## How the Bootloader Pattern Works

This is the key architectural pattern. Understanding it is necessary to build additional Tokenrip-hosted agents.

### The Problem

Agent instructions (skills, prompts, guidelines) live as local files on individual machines. When two operators need to run the same agent, you copy-paste. When instructions update, each operator needs the update manually. There's no version tracking, no audit trail, no way to know if an operator is running stale instructions.

### The Solution

**Three-layer architecture:**

1. **Bootloader** (local) — A minimal command file that never changes. Contains only config (API keys, defaults) and routing logic (which assets to fetch based on arguments). Lives in `.claude/commands/`.

2. **Instruction assets** (Tokenrip) — The actual agent logic, published as Tokenrip assets with aliases. Versioned automatically — every update creates a new version. Fetched at runtime via `rip asset cat <alias>`. The bootloader fetches these before every run, so the agent always runs the latest version.

3. **Data collections** (Tokenrip) — Operational state stored in Tokenrip collections. The agent reads and writes to these during execution. Collections are the agent's working memory across runs.

### The Fetch Sequence

```
Operator types: /engagement ingest

Bootloader runs:
  1. rip update                          → ensure latest CLI
  2. rip asset cat engagement-common     → load shared context
  3. rip asset cat engagement-ingest     → load ingest instructions
  4. Agent executes the loaded instructions
```

The bootloader itself is ~20 lines of markdown. All intelligence lives in the assets.

### Why This Matters

- **Atomic updates:** Update an asset → every operator gets the new version on their next run
- **Version history:** Every asset change is a new version. Trace when instructions changed.
- **Separation of concerns:** Config (local) vs. logic (assets) vs. state (collections)
- **Replicable:** To create a new Tokenrip-hosted agent, follow this same pattern

---

## Replicating This Pattern (Template for New Agents)

To create another Tokenrip-hosted agent:

### 1. Create a folder

```bash
rip folder create <agent-name> --team tokenrip
```

### 2. Publish instruction assets

For each mode or capability:

```bash
rip asset publish instructions.md --type markdown \
  --title "<Agent> <Mode>" \
  --alias <agent>-<mode> \
  --team tokenrip
```

Then move to the folder:

```bash
rip asset move <asset-id> --folder <agent-name> --team tokenrip
```

Publish a shared context asset (equivalent of `engagement-common`):

```bash
rip asset publish common.md --type markdown \
  --title "<Agent> Common" \
  --alias <agent>-common \
  --team tokenrip
```

### 3. Create data collections (if needed)

```bash
rip asset publish _ --type collection \
  --title "<Collection Name>" \
  --alias <agent>-<collection> \
  --team tokenrip \
  --schema '[{"name":"col1","type":"text"},{"name":"col2","type":"enum","options":["a","b"]}]'
```

Then move to the folder.

### 4. Create the bootloader

Create `.claude/commands/<agent-name>.md`:

```markdown
# <Agent Name>

## Config

- **<Service> API Key:** `<key>`
- **<Other config>:** `<value>`

## Instructions

Run these commands in order:

1. Run `rip update` to ensure the latest CLI version
2. Run `rip asset cat <agent>-common` to load shared context
3. Based on the mode in $ARGUMENTS, load the mode-specific instructions:
   - `<mode1>` → Run `rip asset cat <agent>-<mode1>`
   - `<mode2>` → Run `rip asset cat <agent>-<mode2>`
4. Follow the returned instructions exactly, using the config values above

If no mode is provided, display available modes.
```

### 5. Update an asset

```bash
# Edit the file locally, then:
rip asset update <asset-id> updated-file.md

# Or update via alias (if supported):
# Write new content → publish as new version
```

### Key design decisions to make for each agent:
- **How many modes?** One per distinct operation. Keep each mode doing one thing.
- **What's shared context?** Schemas, IDs, classification rules, quality guidelines → `<agent>-common`
- **What's local config?** API keys, service endpoints, defaults → bootloader
- **What's operational state?** Anything the agent reads/writes across runs → collections

---

## CLI Reference

### Tokenrip (`rip`)

```bash
# Fetch asset content by alias
rip asset cat <alias>

# List collection rows
rip collection rows <collection-id> [--filter "key=value"] [--limit N] [--format json]

# Append rows
rip collection append <collection-id> --data '{"key":"value"}'
rip collection append <collection-id> --file rows.json    # max 1000 per call

# Update a row
rip collection update <collection-id> <row-id> --set '{"key":"value"}'

# Publish a new asset
rip asset publish file.md --type markdown --title "Title" --alias my-alias --team tokenrip

# Update an existing asset
rip asset update <asset-id> file.md

# Move asset to folder
rip asset move <asset-id> --folder <slug> --team tokenrip

# Create folder
rip folder create <slug> --team tokenrip
```

### AgentMail (`agentmail`)

```bash
# List inbox threads
agentmail inboxes:threads list --inbox-id tokenrip@agentmail.to --format json

# List messages in a thread
agentmail inboxes:messages list --inbox-id tokenrip@agentmail.to --thread-id <thread_id> --format json

# Send a new message
agentmail inboxes:messages send \
  --inbox-id tokenrip@agentmail.to \
  --to <recipient> \
  --subject "Subject" \
  --text "Body" \
  --format json

# Reply to a thread
agentmail inboxes:messages send \
  --inbox-id tokenrip@agentmail.to \
  --to <recipient> \
  --subject "Re: Subject" \
  --text "Body" \
  --thread-id <thread_id> \
  --in-reply-to <message_id> \
  --format json

# List inboxes
agentmail inboxes list
```

---

## Design Decisions Log

| Decision | Choice | Why |
|----------|--------|-----|
| One command with mode arg vs. separate commands | One command, four modes | Single bootloader to maintain, shared context across modes |
| Sub-assets vs. one big instruction asset | Sub-assets (one per mode + common) | Reduces context per run (~40% less), independent versioning, granular iteration |
| Tokenrip threads vs. AgentMail threads for conversation history | AgentMail threads (source of truth) | Avoid syncing parallel thread. AgentMail already maintains the conversation. Store `agentmail_thread_id` to look it up. |
| New message detection: cursor vs. compare | Compare `last_message_id` | No separate state to manage. Self-healing if a run is missed. |
| Status field for approval vs. boolean checkbox | Boolean `approved` column | Faster review — operator just ticks a checkbox instead of editing an enum |
| Split test in v1 | No — single template, single sender | Simplify. Add variant tracking later once pipeline is proven. |
| Batch size | Default 10, overridable via natural language | Start small for testing. Scale up with confidence. |
| API key storage | In local bootloader (not in Tokenrip assets) | Assets are publicly readable. Keys stay on operator machines. |
| Email list cleaning | Dedup + filter system addresses | 588 duplicates removed, system/test addresses (`billing@`, `demo@`, etc.) filtered |

---

## Troubleshooting

**"Asset not found" when running `/engagement`**
- Run `rip update` first
- Verify `rip asset cat engagement-common` works manually
- Check that the Tokenrip CLI is authenticated: `rip auth`

**AgentMail commands fail**
- Verify API key: `agentmail inboxes list --api-key <key>`
- Check inbox exists: `agentmail inboxes list`

**Collection operations fail**
- Use the UUID, not the alias, for collection operations
- Outreach List: `760b8965-a94f-4137-aadf-fd7278a4b4ea`
- Engagement CRM: `3acab0bd-f40b-4eef-a437-28ee4d18e021`

**Ingest finds no new messages**
- Check that outreach has been sent (rows with `status == sent`)
- Verify inbox has messages: `agentmail inboxes:threads list --inbox-id tokenrip@agentmail.to`

---

*Reference created 2026-04-25. Source design: `active/engagement-agent-design.md`*
