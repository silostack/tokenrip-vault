# Demo Spec — Vertical Workflow Demo

**Status**: Spec only. Build is Simon's. 2-day time-box.
**Audience**: Pilot prospects across three verticals (Insurance, Tax, Real Estate). Not AI influencers — that's the homepage capability demo, which is already shipped.
**Goal**: Answer "what are we selling?" in 3 minutes such that a non-technical buyer says "I want that for my business."
**Verticals locked (2026-05-09)**: Insurance (Simon), Tax + Real Estate (Alek). See [[starting-guide]] for full motion context.

---

## What This Demo Has to Do

The demo is the artifact that solves the **product definition gap**. Simon × Alek's last conversation surfaced that we describe infrastructure when asked "what is it?" The demo is the fix — it forces concrete, application-level language because the artifact itself is concrete.

The product, in one sentence (from `active/paid-pilot-strategy-2026-04-29.md` line 282):

> **"Your documents move themselves through your workflow — reviewed, routed, and tracked by an AI agent, with your team approving at each step."**

That sentence is what the demo needs to make visible.

---

## Demo Skeleton (vertical-agnostic, ~80% reusable)

Six stages. Same shape across every vertical. Domain-specific copy and example documents change; the flow doesn't.

```
1. SUBMIT       → A document arrives (uploaded, emailed, generated)
       ↓
2. REVIEW       → Mounted agent reads it, checks for completeness/errors/missing info
       ↓
3. DECIDE       → Routes to the right party based on result; flags what's blocked
       ↓
4. NOTIFY       → Status broadcast to operator (Slack, email, dashboard)
       ↓
5. APPROVE      → Human reviewer approves at gate; agent moves it forward
       ↓
6. TRACK        → Dashboard shows status of every doc across every party
```

The mounted agent is the through-line. It does the review, the routing, the notification, the tracking. The human is in the loop only at the gate (step 5).

---

## What the Demo Shows On Screen

### The story arc (3 minutes)

| Time | What happens | What the viewer should feel |
|---|---|---|
| **0:00–0:20** | Setup: "12 documents, 8 parties, things fall through cracks. Today this takes a coordinator 6 hours/week." | "Yes, this is my problem." |
| **0:20–0:50** | Document submitted. Agent reviews in real time, flags missing info. | "It's reading and understanding." |
| **0:50–1:20** | Agent routes to the right party (title co, lender, etc.) and pings them. Slack notification shown. | "It's actually doing work." |
| **1:20–1:50** | Operator sees dashboard: pipeline view of every document and where it's stuck. | "I can see everything." |
| **1:50–2:30** | Human approves at gate. Document moves to next stage. Repeat for one more cycle. | "I'm in control." |
| **2:30–3:00** | Outcome: deal closes 5 days faster, coordinator saves 5 hrs/week. Recap. | "I want this." |

### Key visual moments (these are what people remember)

1. **The "agent caught it" moment**: agent flags missing field, viewer sees the catch happen in real time
2. **The Slack notification**: shows the agent has presence beyond a chat window — real-world coordination
3. **The dashboard**: visual proof that "everything is tracked" — not abstract, concrete pipeline view
4. **The approval click**: human is in control, but agent did all the prep work

---

## Vertical Adaptations (the 20%)

The skeleton is the same. What changes per vertical:

### Real Estate — Closing Coordination

| Stage | What it shows |
|---|---|
| Submit | Buyer submits closing doc package: purchase agreement, lender letter, inspection report |
| Review | Agent checks: signature pages signed? Dates correct? All required docs present? Lender info matches? |
| Decide | Routes to title company (clear to close), or back to buyer (missing inspection signoff) |
| Notify | Slack message to broker: "Smith closing — title cleared, awaiting buyer signoff on inspection rider" |
| Approve | Broker reviews flagged items, approves package, sends to closing |
| Track | Dashboard: 12 active closings, status per party, days-to-close |

**Pain quantified**: closing delays cost ~$1,500–$5,000 per deal in extension fees, lost interest, and brokerage time. Brokerages doing 100 closings/year leave $50K–$150K on the table from coordination friction.

### Bookkeeping — Month-End Close

| Stage | What it shows |
|---|---|
| Submit | Client uploads bank statements, receipts, payroll reports |
| Review | Agent checks: all required docs present? Amounts reconcile? Categorization clean? |
| Decide | Routes back to client (missing data) or to bookkeeper (ready for review) |
| Notify | Slack: "Acme Corp Mar close — 90% complete, awaiting credit card statement" |
| Approve | Bookkeeper reviews categorizations, approves, generates report |
| Track | Dashboard: 25 clients, where each one is in the close cycle |

**Pain quantified**: a typical bookkeeping firm loses 5-15% of monthly capacity to chasing missing documents. For a firm doing $50K MRR, that's $2.5K–$7.5K/month in capacity recovery.

### Tax — Return Prep & Review

| Stage | What it shows |
|---|---|
| Submit | Client uploads tax docs (W-2s, 1099s, receipts, prior year return) |
| Review | Agent checks: completeness, prior-year comparison, obvious flags (missing income docs, unusual deductions) |
| Decide | Routes back to client (missing) or to preparer (ready) |
| Notify | Slack: "Johnson 2025 return — prep complete, ready for partner review. 3 items flagged." |
| Approve | Partner reviews flags, approves, schedules client signature |
| Track | Dashboard: pipeline of returns by status, deadlines, blockers |

**Pain quantified**: tax season capacity is everything. Saving even 30 min/return on a 500-return practice = 250 hours = capacity for 50+ more clients = ~$25K/year revenue.

### Insurance — COI Processing

| Stage | What it shows |
|---|---|
| Submit | Contractor/client requests a certificate of insurance |
| Review | Agent checks: coverage requirements met? Policy active? Limits sufficient? Additional insured endorsement needed? |
| Decide | Routes to CSR (ready to issue) or back to requestor (missing info / insufficient coverage) |
| Notify | Slack/email: "Acme Corp COI — ready for issuance, all requirements verified" |
| Approve | CSR reviews, approves, certificate generated |
| Track | Dashboard: COI requests in pipeline, turnaround time, stuck requests |

**Pain quantified**: agencies process 50-200 COI requests/week. Each takes 15-30 min of CSR time. At 100/week × 20 min = 33 hours/week of CSR capacity on document checking — almost a full headcount ($45-65K/year) spent on work AI does in seconds.

**Key competitive angle**: supply-side COI automation has **zero competitors**. Every COI player (myCOI, PINS, Certus) tracks COIs that companies *receive*. Nobody helps agencies *process and issue* them.

---

## What Simon Has to Build

### Components needed

1. **Document upload UI** — drag-and-drop web form, vertical-themed
2. **Mounted agent** — runs review prompt, calls Tokenrip APIs, returns structured output
3. **Tokenrip collections**:
   - `documents` — file refs, metadata, status
   - `pipeline` — workflow stages, current stage per doc
   - `flags` — agent-detected issues
   - `actions` — log of routes, notifications, approvals
4. **Slack integration** — send messages to a demo channel based on agent decisions
5. **Operator dashboard** — pipeline view, filterable by status/party/days-stuck
6. **Approval UI** — single-page review-and-approve interface

### Reuse from existing Tokenrip

- Asset publishing for the document store
- Collections for state
- Mounted agent harness (already proven from engagement agent)
- Existing UI patterns where they apply

### Build budget

- **Day 1**: backbone — upload, agent review, collections, basic dashboard. Smoke-test end-to-end.
- **Day 2**: polish + vertical skin — Slack integration, approval UI, demo data, vertical-themed copy/branding.

If by end of Day 2 the demo isn't passable, **do not extend the time-box**. Cut features, not the deadline. The demo doesn't need to be production-grade — it needs to be conviction-grade.

---

## What "Passes Alek's Test"

The exit gate. Alek runs through the demo once, then is asked to give the pitch using just the demo. He has to be able to answer:

- [ ] What does this product do? (in one sentence)
- [ ] Who is this for? (specific buyer)
- [ ] What pain does it solve? (with numbers)
- [ ] What's different about this vs. AI features in their existing tools? (positioning)
- [ ] What does signing up look like? (call-to-action)

If Alek can answer all 5 from just watching the demo, ship. If not, iterate the demo (not the script — the demo).

---

## "Agent Caught It" Moment Scripts

The single most memorable demo moment. Script one per vertical — this is what prospects remember.

- **Insurance (COI)**: "COI request requires $2M general liability, but current policy shows $1M limit. Agent flags: 'Coverage gap — additional coverage or umbrella endorsement needed before certificate can be issued.'"
- **Tax**: "Prior year return shows $82K W-2 income, but no W-2 uploaded this year. Agent flags: 'Missing W-2 — confirm if employer changed or if document is still pending.'"
- **Real Estate**: "Inspection report dated March 3, but purchase agreement contingency expires March 1. Agent flags: 'Inspection contingency may have lapsed — verify extension with buyer's agent.'"

---

## What This Demo Is NOT

To prevent scope creep:

- ❌ A full product. It's a 3-minute story.
- ❌ Production code. Demo data is fine.
- ❌ Multi-tenant. One example workflow, hard-coded scenario.
- ❌ Authentication or seat management.
- ❌ The mounted-agent / multi-platform homepage demo (already shipped, different audience).
- ❌ A pitch deck. The demo IS the pitch.

---

## After Build

1. **Record a clean run-through** (2-3 min screencast). This is the asset Alek sends in cold outreach.
2. **Set up a sandbox URL** so prospects can self-serve a quick walkthrough after a call.
3. **Iterate from feedback**, not from intuition. Track which moments produce questions/excitement and double down.

---

---

## Tokenrip Reference

This doc is synced to Tokenrip: `11997fd9` ([link](https://tokenrip.com/s/11997fd9-c4ac-4e94-9b89-63638542fd17))

---

*Draft v0.1 — 2026-04-30. v0.2 — 2026-05-09: added insurance/COI vertical adaptation, "agent caught it" moment scripts, updated for 3-vertical scope and discovery-first sequencing (demo is post-discovery, not pre-outreach).*
