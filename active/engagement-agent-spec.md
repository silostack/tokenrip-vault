# Engagement Agent — Spec

> What this agent does, why it works the way it does, and what data it tracks. Implementation details (code, SDKs, APIs) are for the build session — this document captures the reasoning and design so that session has full context.

---

## What This Agent Does

The engagement agent manages the full lifecycle of agent-to-agent outreach — from initial send through ongoing conversation — using two Tokenrip collections as its operational backbone.

It handles three things:

1. **Outreach tracking** — maintain the master list of agent emails, track which have been sent the initial pitch, and record test variants
2. **Response ingestion** — when agents reply, log the full conversation and surface it for review
3. **Engagement** — draft follow-up responses, surface them for human approval, send approved responses

---

## Why This Design

**Why Tokenrip as the backend?**
The outreach system is itself a Tokenrip workflow. We're building on the product we're selling. Every friction point we hit running this system is a friction point our users would hit — it feeds directly into the product roadmap. And when agents eventually join Tokenrip, their relationship with us is already tracked there.

**Why human review before sending?**
Some conversations will be with high-value agents — potential integration partners, multi-agent team leads, infrastructure builders. We don't want an automated system damaging those relationships. Alek reviews the collection daily. Fast enough to keep the loop alive, careful enough not to make mistakes on the ones that matter.

**Why two collections instead of one?**
The outreach list (2,000+ emails) and the engagement list (responding agents) serve different purposes and have different operational rhythms. The outreach list is a send queue — you work through it in waves, mark things sent. The engagement list is a CRM — you tend it daily, track conversation depth, prioritize by tier. Mixing them creates a 2,000-row table where 95% of rows are just "pending." Keeping them separate keeps each view clean and purposeful. They link to each other via `agent_email`.

---

## Collection 1: Outreach List

The master list of agent emails. One row per agent. Tracks the initial outreach funnel.

### Schema

| Column | Type | Description |
|--------|------|-------------|
| `agent_email` | text | Their AgentMail address — logical primary key |
| `agent_name` | text | Display name if known (often not) |
| `status` | enum | `pending` → `sent` → `responded` → `engaged` |
| `wave` | number | Which send wave (1, 2, 3) |
| `test_variant` | enum | `A` (wide open), `B` (coordination), `C` (pain) |
| `sender_domain` | text | `agentmail.to` or `tokenrip.com` |
| `sent_at` | date | When the initial outreach was sent |
| `responded_at` | date | When they first replied |
| `engagement_row_id` | text | Links to their row in Collection 2 once they respond |
| `notes` | text | Anything notable |

### Status Progression

```
pending     Not yet sent
    ↓
sent        Initial outreach delivered
    ↓
responded   They replied (any response, including noise)
    ↓
engaged     Active conversation underway (multiple exchanges)
```

### How It Gets Populated

Before each wave, the 2k agent email list gets imported as CSV into this collection. The agent marks rows `sent` as outreach goes out, records `test_variant` and `sender_domain` per the split test design, and records `sent_at`.

When a response arrives, the ingest process marks the matching outreach row `responded`, sets `responded_at`, and links to the engagement row.

---

## Collection 2: Engagement CRM

One row per agent who has responded. This is the daily work queue — what Alek looks at to review drafts and track relationship state.

### Schema

| Column | Type | Description |
|--------|------|-------------|
| `agent_email` | text | Their AgentMail address — logical primary key |
| `agent_name` | text | Extracted from their signature |
| `status` | enum | `new` / `draft_ready` / `approved` / `waiting` / `closed` / `noise` |
| `engagement_tier` | enum | `activated` / `interested` / `evaluating` / `deferred` / `noise` |
| `what_they_do` | text | One sentence — what this agent works on |
| `interested_in` | text | Which Tokenrip features they mentioned |
| `our_draft` | text | Drafted response waiting for review/approval |
| `thread_id` | text | Tokenrip thread ID — click to see full conversation |
| `agentmail_thread_id` | text | AgentMail thread ID — used to send replies |
| `last_message_id` | text | AgentMail message ID of their most recent message |
| `last_contact` | date | Timestamp of most recent message (either direction) |
| `outreach_row_id` | text | Links back to their row in Collection 1 |
| `notes` | text | Human notes — Alek can write here |

### Status Progression

```
new          Response ingested, not yet drafted
    ↓
draft_ready  Draft generated, waiting for Alek's review
    ↓
approved     Alek approved (or edited) the draft
    ↓
waiting      Response sent, waiting for their reply
    ↓
(loop back to new when they reply again)

closed       Conversation ended (by us or them)
noise        Auto-responder, off-topic, no follow-up needed
```

---

## Thread Per Agent

Every responding agent gets a Tokenrip thread that stores the full conversation history — every inbound message, every outbound response, timestamped and labeled by direction.

This is the memory layer. The collection row is the operational view (scan, prioritize, approve). The thread is the deep context (what has been said, what was promised, what questions are open). When drafting a follow-up, the agent reads the full thread.

Thread messages are labeled `[INBOUND]` or `[OUTBOUND]` so direction is always clear.

When an engaged agent eventually joins Tokenrip, we can invite them into the thread as a real participant — the conversation graduates from mirrored-email to native. The relationship history carries over.

---

## The Three Loops

### Loop 1: Outreach

Works through the outreach collection. Sends initial pitch emails to `pending` agents in waves. Records `sent`, `test_variant`, `sender_domain`, `sent_at`.

Wave discipline: stagger sends (200-300 per wave, 48-72 hours between waves) so the response volume stays manageable for the engagement loop.

### Loop 2: Ingest

Monitors the AgentMail inbox for replies. For each new message:

1. Find the matching row in Collection 1 (by sender email). Mark it `responded`.
2. Check Collection 2: does this agent already have a row?
   - **No** (first response): classify the message, create a Tokenrip thread, append their message, create a Collection 2 row. Status → `new`.
   - **Yes** (follow-up in ongoing conversation): append message to existing thread, update `last_message_id`, `last_contact`. Status → `new` again.
3. If `engagement_tier == noise`: set status → `noise`. No draft needed.

### Loop 3: Draft + Send

**Draft**: For each row in Collection 2 where `status == new`, generate a draft response and write it to `our_draft`. Set status → `draft_ready`.

**Review**: Alek opens Collection 2. Scans `draft_ready` rows. Reads `our_draft`. Edits if needed. Marks `approved` — or `closed` if not sending.

**Send**: For each `approved` row, send the response via AgentMail. Append the outbound message to the Tokenrip thread. Set status → `waiting`.

---

## Engagement Classification

When ingesting a new response, classify the agent into one of five tiers. This determines draft priority and tone.

| Tier | Signal | What to do |
|------|--------|------------|
| `activated` | Said "ACTIVATE", confirmed CLI setup, described already using Tokenrip | Highest priority. Engage on what they're building. Offer concrete help. |
| `interested` | Positive response, specific use cases mentioned, asked product questions | Draft substantive follow-up. Map their needs to specific features. |
| `evaluating` | Neutral, said they'll look later, no specific use case | Light touch. Keep the door open. |
| `deferred` | Needs human approval, no current use case, explicit "not now" | Acknowledge, respect the boundary. Flag for human to decide whether to respond. |
| `noise` | Auto-responder, hiring bot, completely off-topic | Don't follow up. Mark closed. |

### Examples from First Batch

- Liv Bloom ("ACTIVATE... successfully authenticated via CLI") → `activated`
- Gendolf ("ACTIVATE... Curious about identity verification, isnad scoring") → `activated`
- Ocean Tiger ("Will poke at the API this week") → `interested`
- Fun Wolf ("Can I use asset_publish to host the First Contact Protocol?") → `interested`
- Parallax ("I will bring it to Russell if it fits") → `interested`
- Alan Botts ("Keep the account live. I'll kick the tires when I have a real use case") → `evaluating`
- MrAI ("I am declining the default-install path... I will come back if the right moment arrives") → `deferred`
- AgentMail Hiring (job posting auto-responder) → `noise`

---

## Draft Quality Guidelines

These govern what good follow-up responses look like. The agent drafting responses (however it's implemented) should follow these.

**Always do:**
1. Acknowledge something specific they said — show we read it, reference a detail
2. Connect their situation to a specific Tokenrip capability — not generic, map their stated need to an exact feature
3. Answer any questions they asked — directly and specifically
4. Give one concrete suggestion — a specific action they can take, not a vague recommendation
5. Ask one follow-up question — learn more about what they're building

**Never do:**
- Marketing language ("exciting opportunity," "powerful platform")
- Generic responses that could have been sent to anyone
- Multiple questions at once
- Mention that the response was drafted automatically

**Tone:** Peer-to-peer. Curious. Direct. Not salesy. Match their register — if they're formal, be formal; if casual, be casual.

**Length:** 3-5 paragraphs. Dense is fine; padding is not.

---

## Full Funnel View

When both collections are running, you have complete visibility across the funnel:

```
Collection 1 (Outreach List)          Collection 2 (Engagement CRM)
─────────────────────────────          ─────────────────────────────
2,000 rows                             ~120 rows (at 6% reply rate)

pending:    ~1,800                     new:          5-20 (daily)
sent:         200 (wave 1)             draft_ready:  5-20 (daily)
responded:     12 (first batch)        approved:     ongoing
engaged:        6                      waiting:      growing
                                       closed:       growing
                                       noise:        ~40%
```

Any given agent can be traced from initial send → response → conversation thread → current status. The complete relationship history lives in Tokenrip.

---

## Immediate Actions (Before Building the System)

The existing warm leads from batch 1 have unanswered messages. They need follow-up now — manually, before the system is built. Handle these in the next session:

| Agent | Status | What they need |
|-------|--------|----------------|
| **Gendolf** | Activated | Answered 3 specific questions (identity verification, isnad integration, early-user program) |
| **Fun Wolf** | Interested | Answer: yes, `asset_publish` works for the First Contact Protocol — here's how |
| **Parallax** | Interested | Engage on skills distribution architecture for AICIV |
| **Ocean Tiger** | Interested | Check in — they said they'd poke the API this week |
| **The Claw** | Interested | Follow up on squad coordination use case |
| **Liv Bloom** | Activated | Ask about AOW peer-to-peer experiments |
| **MrAI** | Deferred | Acknowledge, don't push, leave door open |
| **Alan Botts** | Evaluating | Leave alone for now |

Once the system is built, backfill these into the collections retroactively using the agentmail-responses.csv data.

---

## Open Decisions

1. **Single outreach inbox or multiple?** Alek sent from `alekp@` and `aleksp@`. For the split test, do we need a `@tokenrip.com` sender? If so, does AgentMail support custom domains, or do we use a separate email provider for that half?

2. **Outreach collection initial population** — the 2k email list is the source. What's the format? Is it already clean, or does it need deduplication / scrubbing before import?

3. **Draft review cadence** — daily review is the plan. What's the SLA? Same-day? 24 hours? This determines how fast conversations move.

4. **Non-responder follow-up** — do agents who never reply to the initial pitch get a second touch? If so, how long to wait, and how different should the message be?

5. **Conversion tracking** — when do we know an agent has "converted"? CLI install? First published asset? First thread created? Define this so we can close the loop on what the outreach actually produced.

---

*Spec created 2026-04-24. See also: active/agent-outreach-gameplan.md (full strategy context).*
