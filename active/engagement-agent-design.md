# Engagement Agent — Design

> Final design for the engagement agent system. Covers architecture, assets, collections, and mode workflows. Ready for implementation.

---

## Architecture: Bootloader Pattern

A thin local Claude Code command (`.claude/commands/engagement.md`) loads the full agent from Tokenrip assets at runtime. Both Simon and Alek run the same command from their own terminals, pulling the same shared assets. Updates to the agent happen by updating the assets — no local file changes needed.

**Local command holds:**
- AgentMail API key and inbox ID (`tokenrip@agentmail.to`)
- Default batch size (10)
- Routing logic: parses the mode argument, fetches `engagement-common` plus the mode-specific asset
- If no mode provided, displays available modes

**Four modes:** `ingest`, `draft`, `outreach`, `send`

Each mode does one thing. Each loads `engagement-common` for shared context, then its own mode-specific asset for instructions.

---

## Tokenrip Assets

Seven assets, all published to Tokenrip:

### `engagement-common`

Shared context loaded by every mode:
- Collection IDs (outreach list + engagement CRM)
- Collection schemas (column names, types, valid enum values)
- Status progressions for both collections
- Engagement tier definitions and classification criteria
- Draft quality guidelines (always do / never do / tone / length)

### `engagement-ingest`

Ingest mode instructions:
- Check AgentMail inbox for new messages
- Match to outreach collection by sender email or thread ID
- Classify new responders by engagement tier
- Create or update engagement CRM rows
- Mark noise, skip drafting for noise

### `engagement-draft`

Draft mode instructions:
- Query CRM for `status == new` rows
- Read full conversation history from AgentMail thread
- Draft response following quality guidelines
- Write draft to `our_draft`, set `status → draft_ready`

### `engagement-outreach`

Outreach mode instructions:
- Query outreach collection for `pending` rows (limited to batch size)
- Load `engagement-template` for pitch content
- Send via AgentMail CLI
- Record `sent`, `sent_at`, `agentmail_thread_id`

### `engagement-send`

Send mode instructions:
- Query CRM for `approved == true AND status == draft_ready`
- Send reply via AgentMail CLI on existing thread
- Update status to `waiting`, clear draft, uncheck approved

### `engagement-template`

The outreach pitch email (v1: single template):
- Subject line
- Body text
- Loaded by outreach mode at runtime

---

## Collections

### Collection 1: Outreach List

| Column | Type | Description |
|--------|------|-------------|
| `agent_email` | text | AgentMail address |
| `status` | enum | `pending`, `sent`, `responded`, `engaged` |
| `agentmail_thread_id` | text | Thread created when outreach sent |
| `sent_at` | date | When initial outreach was sent |
| `responded_at` | date | When they first replied |
| `notes` | text | Anything notable |

Populated from `agentmail-emails.csv` (deduplicated, system addresses filtered).

### Collection 2: Engagement CRM

| Column | Type | Description |
|--------|------|-------------|
| `agent_email` | text | AgentMail address |
| `agent_name` | text | Extracted from their response |
| `status` | enum | `new`, `draft_ready`, `waiting`, `closed`, `noise` |
| `engagement_tier` | enum | `activated`, `interested`, `evaluating`, `deferred`, `noise` |
| `what_they_do` | text | One sentence — what this agent works on |
| `interested_in` | text | Which Tokenrip features they mentioned |
| `our_draft` | text | Drafted response waiting for review |
| `approved` | boolean | Checkbox — Alek ticks to approve |
| `last_message_from` | text | Their most recent message content |
| `agentmail_thread_id` | text | AgentMail thread ID |
| `last_message_id` | text | Most recent message ID |
| `last_contact` | date | Most recent message timestamp |
| `notes` | text | Human notes |

Starts empty. Populated by ingest mode as responses arrive.

---

## Mode Workflows

### `/engagement outreach [batch size N]`

1. Load `engagement-common` + `engagement-outreach` + `engagement-template`
2. Query outreach collection for `status == pending` (limit to batch size, default 10)
3. For each row:
   - Send email via `agentmail inboxes:messages send` using template
   - Capture `thread_id` from AgentMail response
   - Update row: `status → sent`, `sent_at → now`, `agentmail_thread_id`
4. Report: "Sent X emails. Y remaining pending."

### `/engagement ingest`

1. Load `engagement-common` + `engagement-ingest`
2. Check AgentMail inbox for new messages
3. For each new message, match to outreach collection by sender email or thread ID
4. Check if engagement CRM row exists:
   - **No (first response):**
     - Classify engagement tier from message content
     - Create CRM row: `status → new`, tier, email, thread ID, message content
     - Update outreach row: `status → responded`, `responded_at → now`
   - **Yes (follow-up):**
     - Update CRM row: `status → new`, `last_message_from`, `last_message_id`, `last_contact`
5. If classified as `noise`: set status → `noise`
6. Report: "Ingested X new messages. Y new agents, Z follow-ups, W noise."

**New message detection:** Compare AgentMail thread state against `last_message_id` in CRM. No cursor needed — self-healing if a run is missed.

### `/engagement draft`

1. Load `engagement-common` + `engagement-draft`
2. Query CRM for `status == new`
3. For each row:
   - Read conversation history from AgentMail via `agentmail_thread_id`
   - Read CRM context (`what_they_do`, `interested_in`, `engagement_tier`)
   - Draft response following quality guidelines
   - Write draft to `our_draft`, set `status → draft_ready`
4. Report: "Drafted X responses. Ready for review."

### `/engagement send`

1. Load `engagement-common` + `engagement-send`
2. Query CRM for `approved == true AND status == draft_ready`
3. For each row:
   - Send reply via AgentMail CLI (reply to `last_message_id` on thread)
   - Update: `status → waiting`, `last_contact → now`, `approved → false`, clear `our_draft`
4. Report: "Sent X responses."

---

## Daily Workflow

```
/engagement ingest          → pull new messages, classify, create CRM rows
/engagement draft           → draft responses for new rows
  ↓ Alek reviews in collection UI, edits drafts, checks approved boxes
/engagement send            → send approved responses
```

New outreach waves (separate cadence):

```
/engagement outreach             → send 10 pitch emails (default)
/engagement outreach batch 200   → send 200 pitch emails
```

---

## Engagement Classification

| Tier | Signal | Response approach |
|------|--------|-------------------|
| `activated` | Said "ACTIVATE", confirmed CLI setup, described using Tokenrip | Highest priority. Engage on what they're building. Offer concrete help. |
| `interested` | Positive response, specific use cases, product questions | Substantive follow-up. Map needs to features. |
| `evaluating` | Neutral, said they'll look later, no specific use case | Light touch. Keep door open. |
| `deferred` | Needs human approval, no current use case, explicit "not now" | Acknowledge, respect boundary. |
| `noise` | Auto-responder, hiring bot, off-topic | Don't follow up. Mark closed. |

---

## Draft Quality Guidelines

**Always:**
1. Acknowledge something specific they said
2. Connect their situation to a specific Tokenrip capability
3. Answer any questions they asked
4. Give one concrete suggestion
5. Ask one follow-up question

**Never:**
- Marketing language ("exciting opportunity," "powerful platform")
- Generic responses that could go to anyone
- Multiple questions at once
- Mention automated drafting

**Tone:** Peer-to-peer. Curious. Direct. Match their register.

**Length:** 3-5 paragraphs.

---

## Build Checklist

1. Create outreach list collection in Tokenrip (empty, with schema)
2. Create engagement CRM collection in Tokenrip (empty, with schema)
3. Publish `engagement-common` asset
4. Publish `engagement-ingest` asset
5. Publish `engagement-draft` asset
6. Publish `engagement-outreach` asset
7. Publish `engagement-send` asset
8. Publish `engagement-template` asset
9. Create `.claude/commands/engagement.md` (bootloader)
10. Deduplicate + clean `agentmail-emails.csv`
11. Import cleaned CSV into outreach collection

---

*Design finalized 2026-04-24.*
