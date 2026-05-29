# Motion A — Starting Guide

**Date**: 2026-05-09
**Status**: Rough starting points. Hone over next 2 weeks from real execution data.
**Verticals locked**: Insurance (Simon), Tax + Real Estate (Alek). No changes until May 23.

---

## 1. Landing Page Direction

### Hero Copy

The page sells pain relief, not architecture. No "mount your agent," no "imprint," no "BYO model." Use "AI" — it's what buyers understand.

**Option A (pain-led):**
> **Stop chasing documents. Start closing deals.**
> AI that reviews incoming documents, flags what's missing, routes to the right person, and tracks everything — so nothing falls through the cracks.

**Option B (outcome-led):**
> **Your documents. Reviewed, routed, and tracked — automatically.**
> AI handles the coordination work so your team handles the decisions.

**Option C (time-led):**
> **Your team spends 30% of their week chasing paperwork. What if they didn't?**
> AI that processes incoming documents, catches errors, and routes to the right person — without your team lifting a finger.

### Page Structure

```
HERO           →  Pain headline + sub. One CTA: "See it in action"
FLOW VISUAL    →  Document arrives → AI reviews → Routes → Human approves → Done
                  (same shape as demo skeleton, legible without text)
VERTICAL CARDS →  3 cards below fold: "For Insurance Agencies" / "For Tax Firms" / "For Real Estate"
                  Each: 2-sentence pain statement + one specific workflow example
CTA            →  "Watch the demo" or "Try it yourself" (links to sandbox or video)
SOCIAL PROOF   →  Empty slot — design it now, fill when available
                  "Used by X firms across Y industries"
FOOTER         →  Booking link, contact, blog link
```

### Guidelines
- Lead with pain (chasing, missing, coordinating), not technology
- Show the flow visually — the Submit → Review → Decide → Notify → Approve → Track skeleton is universally legible
- Vertical cards below the fold let each segment self-select without making the hero too narrow
- CTA = demo video or interactive sandbox, not "request a demo" (too much friction for cold traffic)

### What to Leave Out
- Mounted agents, imprints, harness separation, BYO model, portability
- Technical architecture or infrastructure language
- "Agent" in the hero — use "AI" instead
- Platform features (collections, assets, versioning) — those are for builders, not buyers

---

## 2. Demo Framework

### Cross-Vertical Skeleton

Same six stages across every vertical. Domain-specific copy changes; the flow doesn't.

```
1. SUBMIT   →  A document arrives
2. REVIEW   →  AI reads it, checks for completeness/errors/missing info
3. DECIDE   →  Routes to the right party or back to sender
4. NOTIFY   →  Status broadcast (Slack, email, dashboard)
5. APPROVE  →  Human reviews at gate, approves or rejects
6. TRACK    →  Dashboard shows status of every document across every party
```

Full spec: [[demo-spec]]

### Vertical Summaries

**Insurance — COI Processing**
| Stage | What it shows |
|---|---|
| Submit | Contractor/client requests a certificate of insurance |
| Review | AI checks: coverage requirements met? Policy active? Limits sufficient? Additional insured endorsement needed? |
| Decide | Routes to CSR (ready to issue) or back to requestor (missing info / insufficient coverage) |
| Notify | Slack/email: "Acme Corp COI — ready for issuance, all requirements verified" |
| Approve | CSR reviews, approves, certificate generated |
| Track | Dashboard: COI requests in pipeline, turnaround time, stuck requests |

*Pain quantified*: Agencies process 50-200 COI requests/week. Each takes 15-30 min of CSR time. At 100/week × 20 min = 33 hours/week on document checking. Almost a full headcount ($45-65K/year) on work AI does in seconds.

**Tax — Return Prep & Review**
| Stage | What it shows |
|---|---|
| Submit | Client uploads tax docs (W-2s, 1099s, receipts, prior year return) |
| Review | AI checks: completeness, prior-year comparison, obvious flags |
| Decide | Routes back to client (missing) or to preparer (ready) |
| Notify | Slack: "Johnson 2025 return — prep complete, ready for partner review. 3 items flagged." |
| Approve | Partner reviews flags, approves, schedules client signature |
| Track | Dashboard: pipeline of returns by status, deadlines, blockers |

*Pain quantified*: Saving 30 min/return on a 500-return practice = 250 hours = capacity for 50+ more clients = ~$25K/year revenue.

**Real Estate — Closing Coordination**
| Stage | What it shows |
|---|---|
| Submit | Buyer submits closing doc package |
| Review | AI checks: signatures, dates, required docs present, lender info matches |
| Decide | Routes to title company (clear to close) or back to buyer (missing items) |
| Notify | Slack: "Smith closing — title cleared, awaiting buyer signoff on inspection rider" |
| Approve | Broker reviews flagged items, approves, sends to closing |
| Track | Dashboard: 12 active closings, status per party, days-to-close |

*Pain quantified*: Closing delays cost ~$1,500-$5,000/deal in extension fees, interest, and brokerage time. 100 closings/year = $50K-$150K lost to coordination friction.

### "Agent Caught It" Moments

The most memorable demo moment. Script one per vertical:

- **Insurance**: "COI request requires $2M general liability, but current policy shows $1M limit. AI flags: 'Coverage gap — additional coverage or umbrella endorsement needed before certificate can be issued.'"
- **Tax**: "Prior year return shows $82K W-2 income, but no W-2 uploaded this year. AI flags: 'Missing W-2 — confirm if employer changed or if document is still pending.'"
- **Real Estate**: "Inspection report dated March 3, but purchase agreement contingency expires March 1. AI flags: 'Inspection contingency may have lapsed — verify extension with buyer's agent.'"

---

## 3. LinkedIn Outreach — Insurance (Simon)

### Sales Navigator Setup

Sales Navigator is a filter layer on LinkedIn. Key features:

- **Advanced filters**: company size, industry, title, geography, years in role, recent activity
- **Lead lists**: save prospects, track activity, get alerts when they post
- **InMail**: message non-connections (limited credits/month — use sparingly)
- **Saved searches**: set up once, get notified when new matches appear

### Your Search Filters

| Filter | Setting |
|---|---|
| Industry | Insurance |
| Company size | 11-200 employees |
| Title | Owner, Principal, Agency President, VP Operations, CSR Manager |
| Geography | Start with your region, expand later |
| Keywords | "independent agency" OR "P&C" |

Sweet spot: 15,000-20,000 independent P&C agencies in the US with $1M-$20M revenue. Company size 11-200 filters out sole proprietors (too small) and national carriers (too slow).

### Outreach Sequence

**Touch 1 — Connection request + opener (Day 0)**

> Hi [Name] — I'm building AI tools for independent agencies. I noticed [Agency] handles commercial P&C in [region]. Quick question: how many COI requests does your team process per week? We're working on something that automates the review step entirely. Happy to share what we're seeing if useful.

Why: specific (COIs), asks a question they know the answer to, positions you as someone who understands daily operations.

**Touch 2 — Value drop (Day 4-5)**

> Following up — put together a 90-sec walkthrough of AI handling a COI request: checks coverage requirements, flags gaps, routes to CSR for approval. [link] No pitch — just curious if this matches the friction you see on your side.

**Touch 3 — Direct ask (Day 9-10)**

> Last note — would 20 minutes be useful? I'm talking to a handful of agency owners about how AI could take the repetitive ops off their CSRs' plates. Not selling anything yet — genuinely gathering intel. [Calendly link] if it's a fit.

### Volume & Conversion

| Metric | Target |
|---|---|
| Messages/day | 15-20 (preserves engineering time) |
| Messages/week | 75-100 |
| Connection acceptance | 30-50% |
| Reply rate (3 touches) | 5-15% |
| Reply → call booked | 30-50% |
| Calls/week (expected) | 1-5 |

### Sales Navigator Tips (First-Timer)

1. **Don't InMail.** Connection request + note always outperforms InMail
2. **Engage before messaging.** Like/comment on their posts for a few days first — makes connection requests warmer
3. **Monday and Tuesday mornings** get the best acceptance rates
4. **Personalize the first line.** "I noticed [Agency] in [region]" beats generic every time
5. **Keep a tracking spreadsheet**: name, company, date messaged, status. Migrate to Attio CRM when you hit >50 contacts
6. **Saved searches are your friend.** Set up 2-3 searches, check them weekly for new matches
7. **Boolean search**: use quotes for exact phrases ("independent agency"), OR for alternatives, NOT to exclude ("insurance" NOT "health insurance")

### Key Insight from Vertical Research

Supply-side COI automation has **zero competitors**. Every COI player (myCOI, PINS, Certus) tracks COIs that companies *receive* from vendors. Nobody helps agencies *process and issue* them. Lead with this angle — it's not "we're better than X," it's "nobody does this."

---

## 4. Engineering Priorities (Tool-Oriented Architecture)

### Architectural Principle

Build each capability as a composable agent tool — something an agent (skill + memory + dynamic context) can "reach for" at runtime. This compounds toward the skill/tool packaging vision without building the packaging system itself.

Each tool should be: **independently callable, stateless per invocation, with structured input/output.**

### Core Tools to Build (Priority Order)

| Tool | What It Does | Why It's Cross-Vertical |
|---|---|---|
| **1. Email Intake** | Receives documents via email forwarding, parses attachments, extracts metadata | Every vertical's workflow starts with "a document arrives." Email is the universal intake channel |
| **2. Document Review Engine** | Reads a document, runs vertical-specific checks, returns structured output: `{complete, flags[], route_to}` | The AI review step is the product's core value. Same shape across verticals, different check logic |
| **3. Notification Sender** | Sends status updates via Slack/email based on agent decisions | Every demo shows "the right person was notified." Build once |
| **4. Pipeline Dashboard** | Displays document status by stage, filterable by vertical/party/status | Every demo ends with "I can see everything." Build once |
| **5. Approval Gate** | Human review + approve/reject interface, triggers next-stage routing | The human-in-the-loop moment. Build once |

### Integration Priority Stack

1. **Email** (receiving documents) — highest priority, strongest workflow kickoff mechanism
2. **Slack** (notifications) — already in demo spec, high demo impact
3. **Google Workspace** (Docs, Sheets, Drive) — many small firms live here
4. **Microsoft 365** (Outlook, Word, OneDrive) — many insurance agencies use this
5. **Calendly** (follow-up booking from notifications) — nice-to-have

### What NOT to Build Yet

- CRM connectors (premature — varies per customer)
- Carrier system integrations (insurance-specific, premature)
- Accounting software connectors (vertical-specific)
- The skill/tool packaging system itself (build toward it architecturally, don't build the packaging surface)

### Three Workflow Scenarios

These ground the mental model for what the tools compose into:

**Scenario A — COI Processing (Insurance)**
```
Contractor emails COI request to agency inbox
  → [Email Intake] parses request, identifies coverage requirements
  → [Document Review] checks current policy: limits, endorsements, expiration
  → If requirements met: generates certificate draft
     → [Notification] alerts CSR: "ready for issuance"
     → [Approval Gate] CSR reviews, approves
     → Certificate issued, logged in [Pipeline Dashboard]
  → If gap found:
     → [Notification] alerts requestor with specific ask
     → Loops back to intake when requestor responds
Dashboard: 47 COIs this week, avg turnaround 2.3 hours (was 18 hours)
```

**Scenario B — Tax Return Prep (Tax)**
```
Client uploads documents to portal
  → [Email Intake / Upload] receives W-2s, 1099s, receipts
  → [Document Review] checks completeness against prior year return
  → If incomplete:
     → [Notification] automated email to client: "Missing 1099-DIV from Schwab"
     → Loops back when client uploads
  → If complete:
     → [Notification] alerts preparer: "Johnson return ready, 3 flags"
     → [Approval Gate] preparer reviews → partner review queue
Dashboard: 127 returns — 84 complete, 31 waiting on client, 12 in review
```

**Scenario C — Closing Coordination (Real Estate)**
```
Listing agent submits closing package
  → [Email Intake / Upload] receives purchase agreement, lender letter, inspection
  → [Document Review] checks signatures, dates, required docs
  → If issues:
     → [Notification] alerts buyer's agent: specific missing items
  → If clear:
     → [Notification] alerts title company: "clear to close pending buyer signoff"
     → [Notification] alerts broker: Slack with status summary
     → [Approval Gate] broker reviews → forwards to closing
Dashboard: 12 active closings, 3 stuck (reasons listed)
```

### Build Sequence (Suggested)

1. **Email Intake tool** — the foundation. Without document arrival, nothing else works
2. **Document Review Engine** — the core AI value. Start with one vertical (insurance/COI), generalize
3. **Notification Sender** — Slack first, email second
4. **Pipeline Dashboard** — simple status board, filterable
5. **Approval Gate** — the human-in-the-loop click

Each tool is independently testable and demoable. You can show a partial workflow (intake + review + notification) before the full pipeline is built.

---

## 5. Interactive "Try It" on Landing Page

### Phase 1: Guided Sandbox (Build First)

A scripted walkthrough with real UI, pre-loaded data. Visitor can:
- Click through a pre-loaded document review (AI already ran, flags visible)
- See the routing decision
- Click "approve" at the human gate
- Watch the pipeline dashboard update

Not real inference — it's a product tour. Tools like Navattic or Storylane do this, or build a simple version with static data and interactive UI elements.

**Estimated effort**: 1-2 days of frontend work. No backend required.
**When to build**: After the demo video is recorded and the dashboard UI exists.

### Phase 2: Live Document Upload (Build Later)

Visitor uploads a real PDF → AI actually reviews it → returns flags. Requires:
- Deployed document review engine endpoint
- PDF parsing in real-time
- Rate limiting and abuse protection
- Edge case handling

**Estimated effort**: 2-3 days on top of existing review engine.
**When to build**: After the review engine is solid from real usage in demos.

**Recommendation**: Build Phase 1 first. Add Phase 2 when the review engine has been tested on enough real documents to be reliable. A live upload that produces bad results is worse than a guided demo that's polished.

---

## 6. Content Strategy — Simon (LinkedIn + Twitter)

### LinkedIn

**Your angle: "AI that actually works in your business."** Not theory, not hype, not "what GPT-5 can do." What happens when you deploy AI into a real workflow — what breaks, what surprises, what works.

**3 content pillars (rotate):**

**Pillar 1 — Behind the Build (your differentiation)**
Technical posts translated for business audience. Nobody on LinkedIn does this well.
- "We deployed AI to review insurance documents. Here's what it caught — and what it got wrong."
- "The difference between an AI demo and an AI deployment: 3 things that break when real documents hit."
- "Why your AI vendor's accuracy claims are meaningless (and what to measure instead)."

**Pillar 2 — The AI Gap in [Industry]**
Industry-specific pain posts. Builds credibility with target segments.
- "Insurance agencies process 200 COI requests a week by hand. In 2026."
- "The coordination tax: how much your firm spends on 'where's the file?' every month."
- "Why Applied and Vertafore will never solve your workflow problem."

**Pillar 3 — Contrarian Takes**
Challenge conventional wisdom. Drives engagement.
- "Most AI tools make your team slower, not faster. Here's the pattern."
- "You don't need an AI strategy. You need to automate one specific workflow."
- "The best AI feature is one your team doesn't interact with at all."

**Cadence**: 3-4 posts/week. Text posts, 150-300 words. Hook in first line. One idea per post.

**Engagement**: 15 min/day commenting on others' posts in target verticals. Substance, not "great post!"

**Profile setup:**
- Headline: "Building AI workflow tools for document-heavy industries | CTO, Tokenrip"
- About: 3 sentences — what you build, what pain it solves, invitation to connect
- Featured: demo video (when ready), best blog post, booking link

### Twitter

**Primary strategy: Reply guy.** Engage with AI engineering content that's already thriving on Twitter. Build presence by adding value in replies before posting original content.

**Reply-guy tactics:**
- Follow 20-30 accounts posting quality AI/engineering content
- Reply with technical depth — add a nuance, share a relevant experience, push back constructively
- Goal: 5-10 substantive replies per day
- Signal you're looking for: threads about AI deployment, agent architectures, tool-calling, document processing, LLM workflows

**Original posts**: 2-3/week. Shorter and punchier than LinkedIn — Twitter is more ephemeral.
- One-liner observations from building
- Short threads (3-5 tweets) on technical insights
- "Today I learned" from real deployment work
- Screenshots of real AI output (redacted if needed)

**Tone difference from LinkedIn:**
- LinkedIn: polished, business-audience, outcome-oriented
- Twitter: raw, builder-audience, process-oriented
- Don't cross-post. Rewrite for each platform.

### Week-by-Week Ramp

| Week | LinkedIn | Twitter |
|---|---|---|
| **1** | Profile setup. 3 posts (1 per pillar). 15 min/day engaging. | Follow 20-30 accounts. 5 replies/day. 1 original post. |
| **2** | 4 posts. Start tracking which topics get engagement. | 5-10 replies/day. 2 original posts. |
| **3** | 4 posts. Lean into whatever pillar resonated most. | 2-3 posts. Reply presence established. |
| **4** | 4 posts. First inbound DM or connection from content (realistic). | 3 posts. Starting to get noticed in reply threads. |

**Expect low engagement for the first 10 posts on both platforms. This is normal.** LinkedIn algorithm rewards consistency over quality in weeks 1-4. Twitter rewards reply quality before original post quality. Stay consistent.

---

## Quick Reference — Ownership

| Area | Simon | Alek |
|---|---|---|
| **Verticals** | Insurance | Tax, Real Estate |
| **Outreach** | Insurance agencies (LinkedIn) | Tax firms + RE brokerages (LinkedIn) |
| **Engineering** | All product/demo build | — |
| **Content** | LinkedIn + Twitter (own voice) | LinkedIn + content strategy (own voice) |
| **Demos** | All verticals (founder-led) | Joins demos, owns follow-up |
| **CRM** | Insurance pipeline | Tax + RE pipeline |

---

---

## Tokenrip Reference

This doc is synced to Tokenrip: `51802e72` ([link](https://tokenrip.com/s/51802e72-4edc-4ab4-b993-06bf7b7b1dae))

---

*Starting guide v0.1 — 2026-05-09. Iterate from real execution data. No changes to verticals until May 23.*
