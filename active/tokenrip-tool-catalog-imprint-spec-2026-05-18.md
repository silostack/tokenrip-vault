# Tokenrip Tool Catalog & Imprint Templates — Demand Spec from the Agent Market

**Status**: Draft spec (2026-05-18)
**Owner**: Simon
**Method**: Synthesised from 300 Upwork AI-agent postings (`active/upwork-ai-agent-jobs.csv`); supersedes the JTBD layer in `active/upwork-agent-jobs-analysis-2026-05-13.md`
**Companions**: `active/tool-layer-design-brief-2026-05-10.md` (architecture), `product/tokenrip/mounted-agent-model.md` (imprint/memory/harness), `product/tokenrip/business-model.md` (monetization)
**Purpose**: Convert the agent-services market into a prioritised substrate roadmap — a tool catalog and a set of publishable imprint templates — for the audience-led motion. **This is a product-requirements document, not a contracting plan. Motion A is deprecated; the value here is the demand signal, not the postings.**

---

## 1. The Reframe: The Job Is the Operation, Not the Vertical

The 2026-05-13 analysis grouped 300 postings into outcome clusters ("Never miss a lead," "Replace my first hire"). Those are marketing slogans, not buildable jobs. Read at the level of *what the agent actually does*, the vertical is noise and the **operation-atoms repeat relentlessly**.

A demolition estimator (#2), a tax auditor (#166), and an invoice processor (#68) buy the same job: extract from documents → hold state → validate → decide. A real-estate lead agent (#1), a dental receptionist (#198), and an insurance CRM (#165) buy the same job: intake on a channel → sync a system of record → qualify → book → escalate.

Concrete JTBD = ten operation-atoms. Frequency is an estimate across the 300 postings.

| # | Operation-atom (the concrete job) | ~Freq | Postings |
|---|-----------------------------------|-------|----------|
| 1 | Intake on a channel (phone, SMS, WhatsApp, web chat, email, social DM) | ~55% | #10, #74, #95, #257 |
| 2 | Sync a system of record (CRM, calendar, order DB, accounting, Sheets/Airtable) | ~75% | #23, #61, #77, #252 |
| 3 | Qualify / classify / score (HOT-WARM-COLD, intent routing, deal scoring, validation) | ~35% | #32, #98, #182, #237 |
| 4 | Book / schedule (appointments, viewings, confirmations) | ~25% | #102, #109, #145, #160 |
| 5 | Extract structured data from documents (PDF/unstructured → fields) | ~15% | #2, #66, #68, #166 |
| 6 | Answer from a bounded knowledge base (deterministic, no hallucination) | ~15% | #67, #148, #163, #265 |
| 7 | Generate output at volume (content, outreach copy, follow-up sequences) | ~20% | #58, #78, #149, #262 |
| 8 | Orchestrate a multi-step workflow (intent → plan → execute → validate → escalate) | ~30% | #103, #136, #237, #260 |
| 9 | Persist and follow up over time (nurture until reply, reminders, recurring runs) | ~15% | #30, #185, #218 |
| 10 | QA / observe / audit an agent (adherence eval, regression, multi-tenant dashboard) | ~15% | #17, #42, #175, #281 |

**Implication**: Tokenrip does not need 300 vertical agents. It needs a tool catalog covering ten operations and a handful of imprint templates that wire those operations into shippable pipelines. The market has, for free, written the substrate's requirements document.

---

## 2. The Three Stacks

The ten atoms collapse into three distinct products. Each maps cleanly onto the mounted-agent model and onto a substrate-roadmap deliverable.

**Stack A — The Front Desk** (atoms 1+2+3+4+9 + escalation). Roughly half the market. Intake → look up the record → qualify → book → log → follow up → hand to a human when unsure. Today it is hand-rolled per client on Retell + n8n + GoHighLevel. **The volume play.**

**Stack B — Document-to-Decision** (atoms 5+6+8 + stateful memory). The premium tier ($10K–$25K fixed, $80–120/hr postings). Extract from unstructured documents → hold state across a long timeline → validate against rules → produce a decision. Maps exactly onto the imprint/memory split: methodology is the imprint, historical data is the memory. **The defensible play and the strongest fundraising artifact.**

**Stack C — The Operator Layer** (atom 10 + multi-tenancy). The agency segment (#175, #218, #251, #294) hand-building a dashboard over deployed agents. This *is* the mounted-agent model — imprint + memory + harness + operator. **Already on the substrate roadmap as the creator dashboard; the postings validate it.**

---

## 3. Tool Catalog

Every tool follows the `tool-layer-design-brief` architecture: a **typed dependency** (skills name `crm-sync`, not HubSpot), a `composes_with` declaration (no first-party tool ships without composing with a substrate primitive), and provider resolution at the registry.

Status legend: **Have** = built or specced in the v1 tool-layer brief · **Gap** = not yet designed.

### 3.1 Channel intake/output tools (atom 1)

| Tool (typed) | composes_with | v1 providers | Status | Recurrence |
|--------------|---------------|--------------|--------|-----------|
| `email-inbound` / `email-outbound` | `correspondence` collection | Postmark | Have (v1 brief) | High |
| `sms-inbound` / `sms-outbound` | `correspondence` collection | Twilio | Gap | High |
| `whatsapp-inbound` / `whatsapp-outbound` | `correspondence` collection | Twilio / Meta | Gap | Medium |
| `webchat-widget` | `correspondence` collection | Native embed | Gap | Medium |
| `voice-io` | `correspondence` collection | Retell / Vapi | **Defer** | High but specialised |

`correspondence` already exists as a schema. Adding SMS/WhatsApp/web-chat is the *same schema, new `direction`/`channel` field* — low marginal cost, high coverage gain. Voice is the largest single channel (~55% of postings touch it) but is a different company; integrate via a thin Retell/Vapi bridge later, do not build telephony.

### 3.2 System-of-record connectors (atom 2) — **the highest-leverage gap**

| Tool (typed) | composes_with | v1 providers | Status | Recurrence |
|--------------|---------------|--------------|--------|-----------|
| `crm-sync` | `contacts` + `pipeline` collections | GoHighLevel, then HubSpot, Salesforce | **Gap** | ~75% |
| `calendar` | `pipeline` collection | Google Calendar, then Outlook, Calendly | **Gap** | ~25% |
| `sheet-rw` | mirror to a Tokenrip collection | Google Sheets, Airtable | **Gap** | High |
| `accounting` | `documents` collection | Zoho/QuickBooks | Defer | Low |

Atom 2 appears in ~75% of postings and Tokenrip has none of it. **This is the single highest-leverage build on the roadmap** — without it no Front Desk imprint can ship. GoHighLevel first: it is the connective tissue of the SMB-agent market (the analysis counted ~15 explicit mentions, more implicitly).

The `composes_with` discipline matters here: `crm-sync` is not a passthrough. Every CRM read/write also writes the Tokenrip `contacts`/`pipeline` collection, so the operator dashboard, audit trail, and downstream skills see the activity. That mirror *is* the product.

### 3.3 Knowledge tools (atoms 5+6)

| Tool (typed) | composes_with | v1 providers | Status | Recurrence |
|--------------|---------------|--------------|--------|-----------|
| `doc-extract` | `documents` collection (structured rows) | Native (vision LLM) + asset store | **Gap** | ~15%, premium |
| `kb-search` | semantic index over a collection | Native | Gap (on Pro roadmap) | ~15% |

`doc-extract` unlocks Stack B — the defensible, highest-budget work. It must produce *structured rows in a collection*, not a blob, so the extracted data becomes queryable memory. `kb-search` is the Pro-tier tool already anticipated in the roadmap; the demand signal confirms its priority.

### 3.4 Time and workflow tools (atoms 8+9)

| Tool (typed) | composes_with | v1 providers | Status | Recurrence |
|--------------|---------------|--------------|--------|-----------|
| `mutation-subscribe` | collection event stream | Native | Have (v1 brief) | — (backbone) |
| `schedule` / `timer` | `pipeline` collection | Native | **Gap** | ~30% |
| `escalate` | `pipeline` + `notifications` | Native (composed bundle) | Gap | ~15% |

Atom 8 (orchestration) is *mostly already substrate* — `mutation-subscribe` + append-only `pipeline` collection gives the supervisor/sub-agent pattern for free, which is a genuine differentiator versus the LangGraph state-machine churn the postings describe. The missing piece is **`schedule`** — a timer primitive that lets an imprint say "follow up in 48h if no reply." Without it, atom 9 (persistence) collapses into a permanently-running cron job, which breaks the mounted-agent model. This is small to build and unlocks ~30% of postings.

### 3.5 Output and observability tools (atoms 7+10)

| Tool (typed) | composes_with | v1 providers | Status | Recurrence |
|--------------|---------------|--------------|--------|-----------|
| `publish-content` | artifact publish + versioning | Native | Mostly Have | ~20% |
| `social-post` | `correspondence`/`notifications` | Buffer-style or native | Defer | ~15% |
| `agent-eval` | append-only `eval` collection | Native | **Gap** | ~15% |
| `dashboard-view` (multi-tenant) | collection state | Native | Have (single-tenant); multi-tenant Gap | ~15% |

Bulk content generation (atom 7) is commoditised — `publish-content` already exists via artifacts; do not chase social schedulers. `agent-eval` is the interesting one: ~15% of postings are "QA / audit / fix my agent," and an eval surface that records adherence and regression as collection rows is both a tool *and* the Stack-C operator product.

---

## 4. Imprint Templates

A tool catalog is inert without imprints that wire it together. Each template below is a **publishable imprint** — a versioned set of skills with YAML dependency declarations plus the collection schemas its memory needs. Templates are what creators fork. Each published template is a substrate-density unit and a creator-deploy starting point; this is where the catalog turns into the North Star metric.

### Template 1 — Front Desk (Stack A) — **build first**

- **Skills**: `intake-triage`, `qualify-and-score`, `book-appointment`, `follow-up-until-reply`, `escalate-to-human`
- **Tools needed**: a channel pair (`email-*` shipped; `sms-*` next), `crm-sync`, `calendar`, `schedule`, `escalate`
- **Memory (collections)**: `correspondence`, `contacts`, `pipeline`, `flags`
- **Why first**: covers ~half the market; every gap it needs (`crm-sync`, `calendar`, `schedule`) is independently P0; demoable and forkable across real estate, dental, home services, e-comm support by swapping the qualifying criteria — i.e. one imprint, many operator deploys.

### Template 2 — Document-to-Decision (Stack B) — **build second, fund the deck with it**

- **Skills**: `extract-document`, `build-knowledge-memory`, `validate-against-rules`, `score-and-recommend`
- **Tools needed**: `doc-extract`, `asset-store`, `kb-search`, `collection-rw`
- **Memory (collections)**: `documents` (structured extractions), a domain `knowledge` collection, `decisions` (append-only)
- **Why second**: the premium, defensible tier. The imprint/memory split is the literal selling point — "your 15 years of cost data is the memory; the estimating method is the imprint; update either without retraining." One lighthouse deploy here (estimating, tax, underwriting) is a stronger a16z/YC artifact than ten Front Desk deploys.

### Template 3 — Operator Console (Stack C) — **build alongside the creator dashboard**

- Not an imprint but the multi-tenant `dashboard-view` + `agent-eval` surface: one operator, many mounted agents, live pipeline + eval state. The agency postings are paying contractors to hand-build exactly this. It is already the roadmap's "creator dashboard" — the demand signal just raises its priority and specifies its contents (pipeline view, eval/adherence pane, per-agent drill-down).

A fourth "Outreach Engine" template (atoms 7+9) is plausible but deferred — the generation half is commoditised; only the `follow-up-until-reply` half is differentiated, and Template 1 already ships it.

---

## 5. Prioritised Build Sequence

Ordered by recurrence × gap-size × substrate fit, and gated to the substrate-roadmap milestones in `CLAUDE.md` (creator dashboard, "build an agent" v1, marketplace UX).

| Phase | Build | Unlocks | Rationale |
|-------|-------|---------|-----------|
| **P0** | `crm-sync` (GoHighLevel) + `calendar` (Google) + `schedule` | Front Desk imprint | ~75% of postings; nothing in Stack A ships without these |
| **P0** | Template 1 (Front Desk) published as a forkable imprint | Creator deploys | First substrate-density units; "build an agent v1" gets a real starting point |
| **P1** | `doc-extract` + `kb-search` + Template 2 | Document-to-Decision | Defensible tier; one lighthouse deploy = fundraising artifact |
| **P1** | `sms-*` / `whatsapp-*` intake | Channel coverage | Same `correspondence` schema; widens Front Desk reach cheaply |
| **P2** | `agent-eval` + multi-tenant `dashboard-view` (Operator Console) | Stack C / agency operators | Aligns with creator-dashboard milestone; agency segment is a density multiplier |
| **Defer** | `voice-io`, `social-post`, `accounting` | — | Specialised or commoditised; integrate, do not build |

---

## 6. What This Document Is Not

- **Not a contracting plan.** The postings are a requirements document. Bidding on them is Motion A, deprecated, and competes with Motion E for founder hands (`CLAUDE.md` Trap #1).
- **Not a protocol spec.** Wire formats for typed tools live in the follow-on to `tool-layer-design-brief`.
- **Not a commitment to all ten tools.** `voice-io`, `social-post`, and `accounting` are explicitly out; the catalog is deliberately smaller than the market.

---

## 7. Cross-References

- Demand source: `active/upwork-ai-agent-jobs.csv`, `active/upwork-agent-jobs-analysis-2026-05-13.md`
- Architecture: `active/tool-layer-design-brief-2026-05-10.md`, `product/tokenrip/tool-layer.md`
- Mounted-agent model: `product/tokenrip/mounted-agent-model.md`
- Monetization: `product/tokenrip/business-model.md`
- Strategy filter: `CLAUDE.md` (substrate density / fundraising curve / category claim)

---

*Drafted 2026-05-18. Owner: Simon. On review, this doc moves to `product/tokenrip/` as the tool-catalog roadmap input; the imprint templates feed the "build an agent v1" milestone.*
