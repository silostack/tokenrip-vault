# The Tool Layer

> Tokenrip's tool layer is not an API gateway. It is the substrate-coupled capability surface that makes mounted-agent workflows possible — and structurally non-bypassable when designed correctly.

**Status**: Architecture (locked 2026-05-10)
**Origin**: Idea explored in `agents/bean/ideas/skill-packaging-and-tool-layer.md` (2026-05-08), sharpened during 2026-05-10 Bean session on monetization tension. Companion doc: `business-model.md`.
**Audience**: Engineering (design input for first tool-layer implementation), positioning (informs product page and pitch language).

---

## Executive Summary

Skills and tools are different primitives. A skill encodes judgment (when to act, why, how to evaluate). A tool is a capability (something that does one thing when asked). Skills orchestrate tools.

The naive question — "should tools run on the harness or on Tokenrip's server?" — frames the problem on the wrong axis. Any harness can call any HTTP endpoint; tools that live solely on the server are bypassable by definition. The right axis is **bypassable vs. structurally non-bypassable**. The first is commodity. The second is the moat.

Tokenrip's tool layer is the set of capabilities that are non-bypassable because the value emerges from composition with substrate primitives — collections, webhooks, scheduled operations, audit trails, multi-operator state, the dashboard. Once a tool's useful behavior depends on writing to a shared collection, firing a webhook on mutation, or appearing in an operator dashboard, the bypass loses utility, not just ergonomic convenience.

This document specifies the architecture of that layer, the design principle that produces non-bypassability, and the worked example of email in the COI demo as the first implementation case.

---

## 1. The Skill / Tool Distinction

| Primitive | What It Is | Where Value Lives | Lifecycle |
|---|---|---|---|
| **Skill** | Methodology, judgment, orchestration. Knows *when* to do something, *why*, and *how to evaluate* the result. | Author expertise encoded as text + tool dependencies. | Versioned; evolves through deliberate updates. |
| **Tool** | Capability. Does one thing when asked. No opinion about when it should be called. | Execution + (when designed correctly) substrate composition. | Operationally stable; competes on interface. |

Skills declare tool dependencies. The platform resolves them.

```
Skill (e.g., "review COI request")
  ├── needs: email (inbound)
  ├── needs: email (outbound)
  ├── needs: pdf-parsing
  ├── needs: collection (documents)
  └── needs: notification (slack)
```

This is **dependency injection for agent capabilities**. The skill author writes against an interface ("send email") rather than a provider ("Resend"). The platform — or the operator, or the skill author via pinning — resolves which specific tool fulfills the dependency. The skill is portable across tool providers in the same way the imprint is portable across harnesses.

---

## 2. The Bypassable Test

Every tool falls into one of three categories. The category determines whether Tokenrip can monetize it, and how the tool should be designed.

### Category A — Wrapped Third-Party API

**Definition**: A tool that exposes a third-party API behind a Tokenrip endpoint.

**Examples**: A `tweet` tool that wraps Twitter's API. A `chat-completion` tool that wraps OpenAI. A `send-sms` tool that wraps Twilio.

**Bypass cost**: Low. The harness can fetch the user's API key and call the upstream endpoint directly. The skill author can publish a skill that omits Tokenrip entirely. The third-party SDK exists and works fine.

**Monetization shape**: None worth pursuing. Competing with the API provider's own SDK, with MCP-ified versions of their endpoints, and with the harness's ability to call HTTP directly. This is a fight that's lost before it starts.

**Design implication**: Don't ship Category A tools in isolation. Either skip them, or always pair them with substrate composition (see Category C).

### Category B — Substrate Primitive

**Definition**: A tool whose behavior is *intrinsically* dependent on Tokenrip-managed state, identity, or coordination.

**Examples**: Semantic search over a Tokenrip collection. A webhook that fires when a collection mutates. A scheduled operation tied to an agent identity. A computed column over collection data. A query over the audit log. A dashboard view of pipeline state.

**Bypass cost**: Structurally infinite. The capability cannot be reproduced without the underlying substrate. To "bypass" this category, the operator would have to rebuild Tokenrip itself.

**Monetization shape**: Tooling tiers (free / pro / enterprise). This is the real revenue line — see `business-model.md`.

**Design implication**: This is what the tool layer is *for*. Every Category B primitive added to the platform makes every mounted agent on the platform more capable.

### Category C — Composed Bundle

**Definition**: A tool that wraps a third-party capability AND composes its behavior with substrate primitives as part of the call.

**Examples**: An email send that writes to a `correspondence` collection AND fires SMTP. A tweet that posts to Twitter AND logs to an `engagement` collection AND triggers a reply-monitoring webhook. A pdf-parse that runs OCR AND inserts the extracted fields into a `documents` collection AND surfaces the result in a dashboard.

**Bypass cost**: The third-party call portion is bypassable; the substrate composition is not. The bypass loses the *useful part* of the tool, not just the convenience. A skill author who "bypasses" by calling SMTP directly loses correspondence logging, dashboard visibility, downstream webhooks, and multi-operator coordination — they've reverted to a stateless single-shot send instead of a workflow component.

**Monetization shape**: Tooling tiers, same as Category B. The substrate composition is what the operator pays for; the third-party wrapper is the convenient packaging.

**Design implication**: **This is the central design move of the tool layer.** First-party tools should never wrap third-party capabilities in isolation. Every wrapped capability ships as a composed bundle, with substrate-coupled side effects that are part of the tool's value, not optional flags.

---

## 3. The Design Principle

> **Compose with substrate. Never ship raw wrappers.**

The reason Category A tools are commodity is that the value is fungible — any number of providers can wrap Twitter's API. The reason Category B primitives are durable is that the value is unique to the substrate — no one else can sell a webhook scoped to a Tokenrip collection. Category C inherits Category B's durability by attaching substrate composition to every wrapped capability.

The discipline: when designing a new tool, the first question is not "what API does this wrap" but **"what substrate primitives does this compose with as part of its useful behavior."** A tool that doesn't answer that question should not ship as a first-party Tokenrip tool. It should ship as a Category A reference (or not at all) and let third parties wrap it.

This produces a tool catalog where every entry has at least one substrate-coupled side effect that makes the bundle non-bypassable. Every tool call deepens the substrate's usage graph as a byproduct of doing the user's actual work.

---

## 4. The Resolution Layer

When a skill declares `needs: email`, three resolution patterns are possible:

1. **Author-pinned**: The skill author specifies the provider (`needs: email@resend`). Predictable but loses portability.
2. **Operator-chosen**: The operator picks the resolution at install time (operator UI offers Resend, SES, Postmark). Portability with operator control.
3. **Platform-resolved**: Tokenrip picks based on the operator's plan, available credentials, or a sensible default. Frictionless but opaque.

**Recommendation for v1**: platform-resolved with a hardcoded provider for demo purposes. The resolution layer becomes a real capability when the tool registry has multiple providers per dependency type — premature today.

**Why this matters even at v1**: even when the call path bypasses Tokenrip in the future, the *resolution decision* — which tool fulfills which dependency for which skill — flows through Tokenrip. That's a separate monetization surface that doesn't depend on call-path control. The schema design today should leave room for it (skills declare typed dependencies, not pinned endpoints) so it can become a revenue line later without a migration.

---

## 5. Worked Example: Email in the COI Demo

The COI demo (`bd/firm-direct-strategy/demo-spec.md`) processes certificate-of-insurance requests for an insurance agency. Email is the entry and exit channel — contractors email requests in, certificates email back out. Walking through how email is implemented surfaces the bypassable-vs-composed distinction in concrete terms.

### The Naive Version (Harness-Direct)

**What the skill looks like**: a markdown file with instructions like "poll IMAP at coi-requests@agency.com, parse new messages, extract requirements, send response via SMTP."

**What the harness does**: fetches the skill, sees the IMAP/SMTP instructions, executes them locally with credentials the operator provided.

**What's missing**:
- No persistent record of correspondence — each session starts blank
- No multi-operator handoff — the CSR who approves can't see the thread the agent saw
- No dashboard view of inbound requests, outbound sends, or in-flight workflows
- No audit trail for compliance (insurance is regulated; agencies need this)
- No webhook on inbound — the agent has to *poll*, which means it has to *run*
- No correlation across emails (this request is from the same contractor as last week's request)

This version technically "works" but it's a single-actor, single-session, stateless email script. It is not a workflow. It cannot be the demo because the demo's whole purpose is to show coordination across actors and time.

### The Substrate-Composed Version

**Architecture**:

```
Inbound:
  contractor email → coi-requests@<tenant>.tokenrip.com
                    → ingestion service
                    → row inserted into `correspondence` collection
                    → webhook fires on collection mutation
                    → COI agent invoked with new row reference

Agent processes:
  → reads correspondence row + linked attachments
  → queries `policies` collection for current coverage
  → inserts row into `documents` collection (the COI request as a tracked artifact)
  → inserts row into `flags` collection (coverage gap detected)
  → inserts row into `pipeline` collection (status: awaiting CSR)
  → fires Slack notification (composed-bundle Slack tool)

CSR approves in dashboard:
  → updates `pipeline` row (status: approved)
  → webhook triggers cert generation
  → outbound row inserted into `correspondence` collection
  → email send service picks up row, transmits via SMTP/SES, marks row sent
  → cert PDF attached as Tokenrip asset, linked from correspondence row

Audit + dashboard:
  → every step is queryable, dashboardable, replayable
```

**What changed**: `email` is no longer a stateless send/receive primitive. It is a substrate-coupled capability where every inbound and outbound message is a row in a queryable collection, every send is an event that can fire downstream, and the dashboard is a window into the same state the agent operates on.

### Bypassability of the Composed Version

A skill author who wanted to "bypass" this — say, by calling SMTP directly from the harness — would lose:

- The correspondence collection (no audit, no thread view)
- The webhook on inbound (their agent has to poll, which means it has to run)
- The dashboard (the CSR has nothing to look at)
- The multi-actor handoff (no shared state for the CSR to inherit)
- The compliance trail (regulated industry — non-negotiable)

The bypass loses the *workflow*, not just convenience. What's left is a Python script that sends email. That's not what an insurance agency is buying.

### What Has to Be Built for the Demo

| Component | Category | Build Effort | Notes |
|---|---|---|---|
| `correspondence` collection schema | B | Low | Standard collection; needs inbound/outbound flag, thread ID, parsed metadata |
| Inbound ingestion service | C | Medium | Tokenrip-managed inbound address per tenant; provider-resolved (use Postmark or Resend inbound for v1); writes to collection |
| Outbound send service | C | Medium | Reads collection on insert; sends via resolved provider; updates row with delivery status |
| Webhook on collection mutation | B | Already in roadmap | Reuse the substrate primitive being designed for the rest of the platform |
| Asset attachment (PDF cert) | B | Already exists | Tokenrip assets; link from correspondence row |
| Skill: "process COI request" | — | Demo content | The methodology that orchestrates the above tools |

**Resolution layer for v1**: hardcode one inbound provider and one outbound provider. The skill declares `needs: email-inbound` and `needs: email-outbound`; the platform resolves to the hardcoded providers. Schema is forward-compatible with future provider choice.

**What this gives us**: an email primitive that is structurally non-bypassable for the demo's actual use case (regulated, multi-actor, persistent workflow). A skill author who builds on this primitive cannot recreate it harness-locally without rebuilding Tokenrip. Every subsequent COI workflow shipped on the platform reuses these substrate primitives, deepening the moat.

---

## 6. The Catalog (Initial Tool Set)

Tools the platform should ship as Category B or Category C primitives, in priority order for the COI demo:

1. **email-inbound** (C) — Tokenrip-managed inbound address; ingestion to `correspondence` collection
2. **email-outbound** (C) — Send via resolved provider; logged to `correspondence`
3. **collection-query** (B) — Read collection rows; the agent's primary data access
4. **collection-insert / update** (B) — Write collection rows; the agent's primary state mutation
5. **webhook-on-mutation** (B) — Trigger on collection change; the reactive backbone
6. **slack-notify** (C) — Post to channel; logged to `notifications` collection
7. **dashboard-view** (B) — Operator-facing window into collection state
8. **pdf-parse** (C) — Extract text/fields; result stored in `documents` collection
9. **asset-store** (B) — Persist a file; link from collections
10. **scheduled-op** (B) — Time-based agent invocation; tied to agent identity

Notably absent: `tweet`, `chat-completion`, `send-sms`. These are Category A. They can be added later as composed bundles if a workflow demands them, but they should never ship as standalone wrappers.

---

## 7. Relationship to Existing Architecture

This layer sits below the imprint and above the storage substrate:

```
Imprint (instructions, methodology)         ← what the agent thinks
   ↓ declares dependencies on
Tools (substrate-coupled capabilities)      ← THIS DOCUMENT
   ↓ implemented on top of
Substrate (collections, assets, webhooks)   ← what Tokenrip is
   ↓ persists in
Storage (S3, DB)                            ← commodity
```

The mounted-agent model (`mounted-agent-model.md`) separates imprint / memory / harness. The tool layer is what lets a mounted agent *do anything* once it's been mounted. Without tools, an imprint is a system prompt with nowhere to write and nothing to call.

The five-layer Tokenrip architecture (`CLAUDE.md` in this directory) maps cleanly: tools are how the agent reaches into Layer 2 (collaboration + messaging), Layer 3 (deliverable rails), and Layer 4 (workspaces). The tool layer is the verb surface; the substrate is the noun surface.

---

## 8. Open Questions

- **Tool versioning.** When `email-inbound` v2 ships with a breaking schema change, how do existing skills declaring `needs: email-inbound` resolve? Pin to v1, auto-upgrade with shim, force migration?
- **Cross-tenant tool calls.** Should a tool one operator's agent calls be allowed to write to a collection in another operator's tenant? (Probably not by default; needs explicit grant.) Schema needs to leave room.
- **Tool-as-skill exposure.** A sufficiently complex tool (multi-step orchestration, conditional logic) starts to look like a skill. Where's the line? Provisional answer: a tool has no opinion about when it's called; a skill has methodology about when, why, how to evaluate. If the "tool" makes those judgments, it's a skill.
- **MCP interoperability.** MCP standardizes tool interfaces at the protocol layer. Tokenrip's tool layer operates above MCP. A Tokenrip tool could expose an MCP interface; an MCP tool could be wrapped as a Tokenrip Category A. Worth designing for, not building yet.
- **Per-call cost accounting.** Composed-bundle tools have variable upstream costs (Resend per-email, Twilio per-SMS). Should the operator see itemized usage, or only see the tooling tier? Probably tier-only at first; itemize when enterprise tier needs it.

---

## 9. What This Doc Is Not

- A protocol spec. The tool dependency declaration syntax, the resolution algorithm, and the wire format are design decisions for the implementation doc that follows this one.
- An MCP comparison. Tokenrip's tool layer is opinionated about substrate composition; MCP is opinionated about protocol portability. They are not in conflict but they are not the same thing.
- A complete catalog. Section 6 is the demo subset, not the long-term tool universe.

---

*Document created 2026-05-10. Originated as `agents/bean/ideas/skill-packaging-and-tool-layer.md`; elevated to product canon after the 2026-05-10 monetization-tension session sharpened the bypassable-vs-substrate distinction. See companion doc `business-model.md` for the monetization architecture this enables.*
