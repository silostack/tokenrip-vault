# Demand-Scout Agent — Rough Requirements

*Status: Draft for engineering review · Owner: Simon · 2026-05-19*

## Purpose

A scheduled scout agent that polls multiple channels for "someone wants an AI agent built" demand, scores each lead, and maintains a persistent ranked queue Simon pulls from when bidding each morning.

It is **Stage 1 (Sourcing) of the sales machine** (`bd/sales-machine-framework.md`) — the first buildable component of Tokenrip's GTM machine. The current pipeline bottleneck is Stage 1/3 (no live conversation pipeline), which is why this is the week's build. It serves the active-demand interception funnel (`DASHBOARD.md`) — removing sourcing as the bottleneck so founder time goes to bidding, not hunting.

**Discipline note:** the agent serves the funnel; it does not replace bidding. Daily ordering is fixed — bid first, build/run the agent second. It is explicitly the **secondary** build this week.

## Success Criteria

Each morning Simon opens the queue and finds enough well-ranked, non-duplicate leads that sourcing is no longer the bottleneck. The agent is working if the 5/day Upwork + 2/day job-req targets are sourced from it.

## Scope

### In scope (v1)
- Poll four sources for agent-build / automation demand.
- Normalize every posting into a standard lead record.
- Score each lead on a composite of four dimensions.
- Maintain a persistent, deduplicated, ranked queue.
- Run automatically on an overnight schedule.

### Out of scope (v1)
- Proposal drafting or submission — surfacing only.
- Funnel / outcome tracking — no CRM. Once surfaced, the agent's job is done.
- Learning from skipped leads.
- Notifications / real-time alerts.

## Output Model

A **living queue**: a persistent ranked list Simon pulls from on his own cadence. No daily push, no alerts. Leads ranked by composite score, each with a one-line rationale per scoring dimension so Simon sees *why* a lead ranked where it did.

## Sources (v1)

All four are in scope, but they have very different access friction. **Recommended phasing:** ship Upwork as a working vertical slice first, add the rest as fast-follows behind the same queue/scoring interface. Treat each source as a pluggable connector so phasing costs nothing.

| Source | What it looks for | Access notes |
|--------|-------------------|--------------|
| **Upwork** | Job posts describing AI-agent / automation build needs. Primary channel. | No clean public API — scraping / RSS / third-party. Riskiest connector; likely sets the v1 timeline. |
| **X / Twitter** | *Frustration-signal* searches — people expressing the pain, e.g. "how do I build an agent that…", "Custom GPT too limited". Not job posts. | Via the existing `twitterapi.io` skill (single API key, no OAuth). |
| **Reddit** | "I need someone to build…" posts. Target subreddits: `r/AI_Agents`, `r/automate`, `r/forhire`. | Official API. |
| **Job feeds** | LinkedIn / job-board listings for AI-agent and automation roles. | Engineering to confirm the concrete board set / RSS / aggregator API. |

## Architecture (logical components)

**A. Source connectors (pluggable)** — one per channel, common interface: fetch raw postings, normalize to a standard lead record. Each connector owns its own search queries / keywords ("AI agent", "automation", "build a bot", etc.).

**B. Normalizer** — collapses every source into one lead record:
`{id, source, url, title, raw_text, posted_at, budget?, client_info?, fetched_at}`

**C. Scorer** — composite score across four dimensions, each producing a sub-score + one-line rationale:
- **Architecture-fit** — does the request need memory / persistence / portability (the mounted-agent wedge)? LLM judgment.
- **Painkiller signal** — budget posted, urgency language, clearly-scoped deliverable.
- **Win probability** — competition level, client history, skill / timezone match.
- **Freshness** — recency decay; fresh posts have fewer bids.

> Note: this composite (with LLM-judged architecture-fit) is a deliberate upgrade from the "simple heuristic" v1 scoping in `bd/sales-machine-framework.md` §"Stage 1, Concretely". That section should be updated to match.

**D. Queue store** — persistent, deduplicated. Holds surfaced leads with scores + rationale. Dedupe key on source+url, plus fuzzy text match to catch cross-posts. Same lead never surfaces twice.

**Data flow:** `cron → each connector fetches → normalize → dedupe against store → score new leads → write to queue`. Simon reads the queue independently of the run.

## Operational Requirements

- **Run model:** Single nightly cron. Queue is fresh and ranked by morning. An optional manual trigger for ad-hoc refresh is a cheap nice-to-have, not required.
- **Retention:** Leads age out on a TTL (suggest ~5–7 days — a stale Upwork post is dead weight; freshness scoring already pushes old leads down).
- **Failure isolation:** One connector failing (rate limit, API down) must not kill the run — other connectors still populate the queue. Surface which sources succeeded so Simon knows if the queue is partial.
- **Queue size:** No hard cap if dedupe + TTL keep it lean; if it bloats, cap the visible queue at top ~30.

## Open Questions for Engineering

1. **Queue storage** — Tokenrip collection (fits the "publish as a Tokenrip imprint" ambition) vs. local file vs. DB. Affects how Simon reads the queue.
2. **Job feeds** — the source is "LinkedIn / job-board listings for AI-agent and automation roles"; engineering to confirm the concrete board set and access method (LinkedIn has no clean public API — same friction class as Upwork).
3. **Upwork access** — no clean public API; scraping vs. RSS vs. third-party. Riskiest connector; sets the v1 timeline.
4. **Scoring cost** — every new lead hits an LLM for architecture-fit judgment; at full-source volume, estimate the per-run cost.

## Strategic Note

The demand-scout is a candidate to publish as a Tokenrip imprint once it works for Simon — but per `context.md`, that is downstream of getting it working for ourselves first. Build it as an internal tool; the imprint path is a later decision.
