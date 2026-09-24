---
title: "Salesforce from Scratch: What It Does, What It Can't, and Where Quintel Lives"
status: draft-for-review
owner: Simon
type: competitive/architecture-analysis
created: 2026-06-05
supersedes: active/salesforce-deal-model-vs-deal-graph-2026-06-04.md
related:
  - bd/deals/equipment-finance/stauss-vfi-tokenrip-briefing.md
  - product/quintel/equipment-finance-build-architecture-2026-06-02.md
  - product/quintel/CLAUDE.md
---

# Salesforce from Scratch: What It Does, What It Can't, and Where Quintel Lives

> **Context:** Stauss uses Salesforce daily and references it as his deal-tracking baseline. His gold standard is "my guy Darren's" weekly Salesforce report — a batch export from someone else's Salesforce org. This memo explains Salesforce from the ground up, then maps where Quintel overlaps, extends, or replaces it.

## Bottom line

Salesforce is a **single-company system of record** — it tracks *your* customers, *your* pipeline, *your* forecast. It is extremely good at that. What it structurally cannot do is be the **shared deal layer across companies**. Quintel is not "a better CRM." It is a different primitive: the deal as a shared, multi-party, content-rich object with an agent that acts on it. Salesforce is where Stauss tracks his pipeline; Quintel is where the deal *actually lives* across the firms that work it.

---

## Part 1: What Salesforce Actually Is

### The basics

Salesforce is a cloud CRM platform. "CRM" = Customer Relationship Management. At its core, it does three things:

1. **Stores your contacts and companies** — every person and business you interact with, with all their history
2. **Tracks your deals** — from first contact to closed/won or closed/lost, through a pipeline
3. **Reports on your business** — dashboards, forecasts, activity metrics

Think of it as a shared database your whole sales team works from, with a UI on top and rules that automate routine actions.

### The product stack (layers from bottom to top)

| Layer | What it is | Cost |
|---|---|---|
| **Sales Cloud** (the CRM) | Contacts, Accounts, Opportunities (deals), pipeline, forecasting. The core. | $25–$550/user/month depending on tier |
| **Service Cloud** | Customer support — cases, routing, knowledge base. Not relevant to EF. | Similar pricing |
| **Experience Cloud** | Portals for external users (partners, customers). This is how Salesforce lets outsiders see limited data from your org. | Add-on |
| **Financial Services Cloud (FSC)** | Industry layer on top of Sales Cloud. Adds financial-specific data models — households, financial accounts, advisor-client relationships. Has a "Digital Lending" module. | Premium add-on |
| **Flow / Flow Orchestrator** | Visual workflow automation engine. Drag-and-drop process builder — "when a deal hits stage X, do Y." Can handle approvals, task assignment, notifications, multi-step processes. | Included (varies by tier) |
| **Data Cloud** | Unifies data from outside Salesforce (website, email, third-party systems) into one customer profile. | Add-on |
| **Agentforce** (new, 2026) | AI agents that act on your CRM data — qualify leads, route cases, manage opportunities, book meetings. Autonomous, not just chatbot. 771M "Agentic Work Units" processed in Q4 FY2026. | $2/conversation or $550/user/month |
| **AppExchange** | Marketplace of third-party apps that plug into Salesforce. This is where nCino, Cloudsquare Lend, and other lending tools live. | Varies |

### The core data model (how Salesforce thinks about the world)

```
Account (a company)
  └── Contact (a person at that company)
  └── Opportunity (a deal you're pursuing with that company)
        └── Stage (Prospecting → Qualification → Proposal → Negotiation → Closed Won/Lost)
        └── Amount ($)
        └── Close Date
        └── Probability (%)
        └── Expected Revenue (Amount × Probability)
        └── OpportunityLineItem (products/services being sold)
        └── Tasks, Notes, Attachments (everything else)
```

**Key structural fact:** An Opportunity belongs to **one Account** (the counterparty) in **one Org** (your company's Salesforce instance). The whole model is oriented around: "my company is selling to that company, and here's where the deal stands."

### What Salesforce is genuinely good at

- **Single-company pipeline visibility.** Every rep's deals, stages, probabilities, close dates — rolled up into a team/company forecast. Managers see everything. This is what "Darren's weekly report" is.
- **Activity tracking.** Emails, calls, meetings logged against contacts and deals. You can see the full history of a relationship.
- **Workflow automation.** "When deal > $500K, require VP approval." "When deal stalls 14 days, alert manager." "When stage = Proposal, auto-create contract task." Flow Builder handles this visually.
- **Reporting and dashboards.** Any slice of your data, visualized. Pipeline by stage, revenue by rep, conversion rates, deal velocity.
- **Ecosystem.** 1000s of apps on AppExchange. If Salesforce doesn't do something natively, someone has probably built an add-on.
- **Customization.** Custom objects, custom fields, custom workflows. You can bend Salesforce to model almost anything — but you're building on top of the single-org, single-pipeline foundation.

---

## Part 2: Salesforce in Financial Services / Lending

### Financial Services Cloud (FSC)

FSC is an industry-specific layer Salesforce sells to banks, wealth managers, and lenders. It adds:

- **Person Account model** — treats individuals as both Account and Contact (important for retail banking)
- **Household grouping** — links family members into a household with shared financial accounts
- **Financial account tracking** — balances, holdings, policies, linked to the client relationship
- **Referral management** — track who referred whom
- **Action Plans** — templated task sequences for onboarding, reviews, etc.

### FSC Digital Lending

FSC has a purpose-built lending module with ~40 objects: Application, Applicant, Party Credit Profile, Party Income, Product Proposal, Application Form Evaluation, etc. It covers loan origination workflows: setup products, build application forms, run credit checks, verify eligibility, make offers, calculate payments, approve.

**The critical limitation:** FSC Digital Lending is designed for **retail lending** — mortgages, auto loans, consumer credit. Salesforce's own documentation explicitly states it **does not support equipment financing, commercial loans, or merchant cash advance**. These need custom builds or third-party apps.

### nCino (the dominant add-on for commercial lending)

nCino is a "Bank Operating System" built on Salesforce. It's the market leader for commercial lending workflow — used by 2,700+ financial institutions (TD Bank's equipment finance division was an early adopter). It provides:

- Loan origination + underwriting workflow
- Credit analysis and risk management
- Portfolio management
- Document management
- Regulatory compliance

**But:** nCino is built for **banks and institutional lenders** — the entity making the credit decision. It is not built for brokers, intermediaries, or the multi-party deal flow that Stauss operates in. A VFI underwriter might use nCino; Stauss-as-broker would not.

### What Salesforce + FSC + nCino looks like in practice (Stauss's world)

- **VFI (the lender)** likely has a Salesforce org with some combination of Sales Cloud + FSC + possibly nCino or a custom lending workflow. This is where "Darren's report" comes from — Darren runs a report on VFI's pipeline and emails it to Stauss weekly.
- **Stauss (as broker/intermediary)** has his *own* Salesforce, tracking his deals, his contacts, his pipeline. But his deals live in *other people's Salesforces too* — each lender he sends a deal to has their own copy.
- **The gap:** There is no shared deal object between these orgs. Stauss submits a deal to a lender, and it becomes a row in *their* system. He finds out what happened to it via a weekly email report — or he doesn't find out at all.

---

## Part 3: Where Salesforce Structurally Breaks for Equipment Finance

### Gap 1: Single-org isolation (the deal lives in N places, owned by none)

Salesforce's entire architecture assumes **one company = one org = one source of truth**. When a deal involves 3–6 firms (broker + borrower + N lenders + referral partner), each firm has its own Salesforce with its own copy of the deal. These copies are:

- Created independently (no shared submission)
- Updated independently (no real-time sync)
- Reconciled manually (via email, phone, or weekly batch reports)

**Salesforce-to-Salesforce (S2S)** exists for cross-org sharing but is limited: it *copies* records asynchronously, can't auto-accept Opportunities with multiple Account lookups, and never creates co-ownership. You get N loosely reconciled duplicates.

**Experience Cloud partner portals** let external users log into *your* Salesforce with limited access. But the partner sees *your* view of the deal — they don't bring their own data, they don't co-own the record, and the portal doesn't connect their Salesforce to yours.

### Gap 2: Linear pipeline vs. fan-out

A Salesforce Opportunity moves through stages in a line: Prospecting → Qualification → Proposal → Negotiation → Closed Won/Lost. One Amount, one Probability, one Close Date. Designed for forecasting.

An equipment-finance deal **fans out**: one deal is submitted to 3–5 lenders simultaneously. Each lender is its own sub-pipeline with its own outcome (declined, approved, funded at $X, partial fund, sequenced close). There is no single Stage, no single Amount, no single outcome. The deal is a **graph**, not a funnel.

You can approximate this in Salesforce with custom objects (one "Master Deal" with child "Lender Submissions"), but you're fighting the platform's native pipeline/forecast model, and none of the standard reporting, Agentforce AI, or workflow tools understand that structure.

### Gap 3: Content as notes vs. content as data

In Salesforce, everything beyond the core fields (Stage, Amount, Close Date, Account) is stored as **notes, attachments, or custom fields**. Audited financials, equipment lists, UCC filings, tangible net worth calculations, term/rate/structure details, fraud signals — all unstructured. A human reads them; the system doesn't understand them.

For Quintel, this content *is* the deal. The agent needs to read financials, calculate TNW, check UCC patterns, flag fraud signals, match against lender criteria. Content must be **structured and machine-readable**, not a PDF attachment on a pipeline record.

### Gap 4: Per-tenant learning vs. cross-firm intelligence

Salesforce captures outcomes (deal closed, deal lost) within **one org**. VFI knows what VFI funded. Stauss knows what Stauss closed. Nobody knows the cross-firm picture: "deals with this profile fund at 9.5% with ABL lenders in Q3."

This isn't a bug — per-tenant data isolation is the thing customers **pay Salesforce for**. It structurally and contractually will not aggregate outcomes across firms. The entire deal-graph thesis (deals with outcomes that compound into matching/pricing intelligence) is architecturally impossible within Salesforce's model.

---

## Part 4: The Overlap Map — Salesforce vs. Quintel

| Capability | Salesforce | Quintel | Relationship |
|---|---|---|---|
| **Contact/company database** | Core strength — Accounts, Contacts, full relationship history | Not building this | **No overlap.** Stauss keeps Salesforce for his contact book. |
| **Activity logging** (calls, emails, meetings) | Core strength | Not building this | **No overlap.** |
| **Single-company pipeline tracking** | Core strength — Opportunity stages, forecasting, dashboards | Not building this | **No overlap.** Stauss's internal pipeline view stays in SF. |
| **Workflow automation** (approvals, alerts, task routing) | Flow / Flow Orchestrator — visual builder, powerful within one org | Agent-driven workflow on the deal object | **Partial overlap, different scope.** SF automates within one org's process. Quintel's agent acts across the deal's lifecycle across firms. |
| **Deal tracking** | Opportunity object — single-party, linear, forecast-oriented | Deal-graph — multi-party, fan-out, content-rich, outcome-bearing | **Direct overlap, fundamentally different primitive.** This is the core architectural divergence. |
| **External collaboration** | Experience Cloud portals — guest view into your org | Shared deal object — all parties mount onto the same deal | **Overlapping need, different architecture.** SF gives a window into one org; Quintel makes the deal the shared thing. |
| **Lending workflow** | FSC Digital Lending (retail only) + nCino (institutional lender) | Underwriting/structuring agent (broker + lender + intermediary) | **Adjacent.** nCino serves the lender's internal process. Quintel serves the deal flow across the broker/intermediary layer SF doesn't reach. |
| **AI / agents** | Agentforce — acts on CRM data within one org (lead qual, case routing, meeting booking) | Mounted agent — acts on structured deal content, cross-firm | **Parallel evolution, different substrate.** Both are "AI agent on business data." SF's agent reads your CRM; Quintel's agent reads the deal-graph. |
| **Matching / routing** | None native. Manual or custom-built. | Core hand — deal → lender panel, scored on criteria fit + historical outcomes | **No overlap.** This is Quintel's primary value. |
| **Fraud detection** | None native | Quintel hand — doctored audits, UCC patterns, ownership/lawsuit research | **No overlap.** |
| **Cross-firm outcome intelligence** | Structurally impossible (per-tenant isolation) | The moat — outcomes aggregate into matching/pricing intelligence | **No overlap.** This is what Salesforce's architecture forbids. |

---

## Part 5: So What — Positioning Implications

### What Quintel is NOT

- **Not a CRM replacement.** Stauss will keep Salesforce for his contacts, his activity log, his internal pipeline view. Don't position against that.
- **Not a "better Salesforce."** Salesforce is a $30B/year company with 150K+ customers. Competing on their turf is suicide.
- **Not a lending workflow tool** (like nCino). nCino serves the lender's internal credit-decision process. That's not our layer.

### What Quintel IS (in Salesforce terms a buyer would understand)

**"The deal layer that sits between your Salesforce and theirs."**

- Salesforce tracks your pipeline. Quintel tracks **the deal** — the actual multi-party object that your pipeline entry points to.
- Your Salesforce has your view. Their Salesforce has their view. Quintel has **the deal itself** — shared, structured, with an agent that works it.
- Salesforce tells you "this deal is in Stage 3." Quintel tells you "this deal was sent to 4 lenders, 2 declined, 1 approved at 9.2% / 60mo, 1 is in credit review — and deals like this historically fund 72% of the time with ABL lenders at this TNW ratio."

### The one-liner for Stauss

*"You told me your best deal tracking is a weekly Salesforce report from Darren. Why? Because his CRM can't let you into the deal — you're a row in it. We make the deal the shared thing."*

### Integration, not displacement

The right architecture: **Quintel syncs back to Salesforce.** When a deal is created in Quintel, it creates/updates the Opportunity in Stauss's Salesforce. When a lender responds, Quintel updates the Opportunity stage. Stauss's pipeline view stays in Salesforce; the deal intelligence lives in Quintel. This is how nCino works — it's built *on* Salesforce, not *instead of* it. Quintel would sit adjacent: the deal-graph feeds into whatever CRM each party uses.

---

## Appendix: Salesforce Pricing Context

| Tier | $/user/month | What it adds |
|---|---|---|
| Starter Suite | $25 | Basic CRM — contacts, opportunities, email |
| Pro Suite | $100 | Automation, forecasting, integrations |
| Enterprise | $175 | Advanced customization, analytics, API access |
| Unlimited | $350 | Full feature set, expanded support |
| Agentforce 1 Sales | $550 | AI agents, autonomous deal management |

Plus add-ons ($70–$1,750/user/month), FSC premium licensing, nCino fees, implementation costs ($50K–$500K+ for FSC). A mid-size EF firm might spend $200–$500/user/month on Salesforce + add-ons before any customization.

---

*Suggested final home: `product/quintel/` (supersedes the narrower 2026-06-04 analysis). Draft in `active/` pending Simon's review.*
