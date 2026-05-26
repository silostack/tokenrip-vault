# Tool Layer Design Brief — V1 for the COI Demo

**Status**: Design (2026-05-10)
**Owner**: Simon (build)
**Companions**: `product/tokenrip/tool-layer.md` (architecture), `product/tokenrip/business-model.md` (monetization), `bd/firm-direct-strategy/demo-spec.md` (demo scope)
**Goal**: A buildable specification for the v1 tool layer — sufficient to ship the COI demo's email + collection + dashboard surface within the 2-day demo time-box, while preserving the architectural decisions that the long-term monetization model depends on.

---

## 1. Purpose and Scope

### Purpose

This document specifies the v1 implementation of Tokenrip's tool layer, scoped to what the COI demo (`bd/firm-direct-strategy/demo-spec.md`) requires. It is opinionated about the architecture (every tool composes with substrate, no exceptions), pragmatic about v1 coverage (one provider per dependency type, hardcoded resolution), and forward-compatible with the monetization architecture (`business-model.md`) so that today's choices do not foreclose tomorrow's revenue lines.

### In scope (v1, demo-driven)

- Skill dependency declaration format (YAML front-matter in skill markdown)
- Collection schemas for `correspondence`, `documents`, `flags`, `pipeline`
- The `email-inbound` and `email-outbound` composed-bundle tools (the deep example)
- The `notify-slack` composed-bundle tool
- Collection mutation subscription (long-poll for v1; webhook later)
- Operator dashboard read surface (collection views)
- Provider resolution layer (hardcoded one provider per dependency; schema flexible for future)
- The procedural design gate ("compose with substrate or do not ship")

### Out of scope (v1, demo-driven)

- Multiple provider resolution (Adobe vs. Midjourney vs. DALL-E semantics) — premature
- Per-call billing or itemized usage — tier-based for now
- Inter-agent tool exposure — Layer 5 work
- Cross-tenant tool calls — single-tenant demo
- Imprint privacy / access control on imprints — Enterprise feature
- Audit-export tooling — Enterprise feature
- MCP interop layer — design space, not v1 build

### Success criteria

The demo runs end-to-end on this layer:
1. A contractor email lands at `coi-requests@<demo-tenant>.tokenrip.com`
2. The COI agent processes the request (reads, flags, routes) using only Tokenrip tools
3. The CSR sees the dashboard view of pending requests with flags
4. The CSR approves; the agent generates the cert and emails the contractor back
5. Every step is queryable, replayable, and visible in the audit log

If any step requires bypassing Tokenrip (calling SMTP directly, hand-stitching state in local files), the design has failed and we revisit before shipping.

---

## 2. The Procedural Gate

> **No first-party tool ships without an explicit substrate composition.** If a tool's design review cannot answer "what substrate primitive does this compose with as part of its useful behavior," the tool either ships as a Category C bundle with that composition added, or does not ship as first-party.

This is not an architectural aspiration. It is a build-time gate. Concretely:

- Every tool registered in the catalog has a `composes_with` field listing the substrate primitives the call participates in.
- A tool with `composes_with: []` cannot be registered as first-party. The CI check that loads the catalog rejects it.
- The demo time-pressure will produce the temptation to ship a "raw email send" tool to move faster. The gate exists to refuse that temptation. Composing with the `correspondence` collection is approximately one extra DB write per call — the cost is negligible; the architectural payoff is the entire monetization thesis.

This gate is the implementation enforcement of the principle in `tool-layer.md` §3.

---

## 3. Skill Dependency Declaration

### Format

Skills declare dependencies in YAML front-matter at the top of the skill markdown. The front-matter is parsed at skill-load time; declared dependencies are resolved against the platform's tool registry.

```yaml
---
name: review-coi-request
version: 0.1.0
description: Reviews an inbound COI request, flags coverage gaps, routes to CSR
needs:
  - tool: email-inbound
    bind: inbox
  - tool: email-outbound
    bind: outbox
  - tool: notify-slack
    bind: slack
    params:
      channel: "#coi-pipeline"
  - collection: correspondence
    access: read-write
  - collection: policies
    access: read
  - collection: documents
    access: read-write
  - collection: flags
    access: read-write
  - collection: pipeline
    access: read-write
---

# Review COI Request

When a new inbound row appears in `correspondence` with subject matching /COI/i...
```

### Design decisions

- **Typed, not pinned.** A skill says `tool: email-outbound`, not `endpoint: https://api.resend.com/emails`. The platform resolves typed dependencies to specific providers. **This is the load-bearing decision for the future Line 4 (resolution-layer) revenue surface — do not pin endpoints in skill code.**
- **Access scopes per collection.** A skill declares whether it needs read, write, or read-write access. The platform mints a scoped credential at invocation time. Tightens blast radius and makes the audit log meaningful.
- **Bind names.** Skills reference tools by bind name in their body, not by the underlying tool name. This allows the same skill to declare two `email-outbound` tools with different bindings (e.g., `notify-customer` and `escalate-to-manager`).
- **Tool params.** Static parameters (a Slack channel, an email signature template) can be set at the dependency declaration level. Dynamic parameters are passed at call time.

### Resolution at v1

The platform maintains a registry of available tools. For v1, each typed dependency resolves to exactly one implementation (hardcoded). The resolution algorithm:

```
declared dep: email-outbound
   ↓ lookup in registry
resolved to: email-outbound@postmark-v1
   ↓ instantiate with skill's bind name + params
ready for invocation
```

When the registry has multiple providers per dependency type (post-v1), resolution gains a strategy parameter (operator default, author pin, platform default). The schema today already supports this — only the algorithm needs to extend.

---

## 4. Tool Catalog (V1)

The minimum viable catalog for the COI demo. Every entry includes its `composes_with` declaration.

| Tool | Category | Provider (v1) | Composes With | Notes |
|---|---|---|---|---|
| `email-inbound` | C | Postmark inbound | `correspondence` collection (insert), `assets` (attachments) | Tokenrip-managed inbound address per tenant |
| `email-outbound` | C | Postmark transactional | `correspondence` collection (insert + status updates) | Skill writes intent; outbound service performs send |
| `notify-slack` | C | Slack webhooks | `notifications` collection (insert) | Channel resolution from skill params |
| `collection-rw` | B | Native | (it *is* the substrate primitive) | Read/write/query against named collections |
| `asset-store` | B | Native | (it *is* the substrate primitive) | Persist binary file; return asset ref |
| `mutation-subscribe` | B | Native | Collection event stream | Long-poll for v1; webhook later |
| `dashboard-view` | B | Native | Collection state | Operator-facing read surface |

**Notably absent at v1**: `tweet`, `chat-completion`, `pdf-parse` (deferred — not on the demo's critical path), `schedule`, `compute-derived`. Each is either not required by the demo or shipping later in the substrate roadmap.

**Demo composition shortcut**: for the COI demo only, a `pdf-generate` tool is needed to produce the cert. V1 implementation: ship as Category C, composed with `documents` collection (write the generated PDF as a Tokenrip asset, link from the document row). Provider: a simple HTML-to-PDF call (use `playwright` or a hosted service like API2PDF). This is throwaway-grade for the demo; revisit for production.

---

## 5. Collection Schemas

The four collections that hold the COI workflow's state. Schemas are opinionated about field names and types; revisions are expected as the demo build surfaces gaps.

### `correspondence`

The system-of-record for all email (inbound and outbound). The substrate primitive that `email-inbound` and `email-outbound` compose with.

```
id              uuid PK
tenant_id       uuid           # multi-tenant placeholder; demo uses fixed value
thread_id       uuid           # groups related messages; null on first message in thread
direction       enum           # inbound | outbound
status          enum           # received | pending | sending | sent | failed
from_address    string
to_addresses    string[]
cc_addresses    string[]
subject         string
body_text       text
body_html       text
attachments     asset_ref[]    # Tokenrip asset references
provider_message_id string     # Postmark message ID; populated on send/receive
in_reply_to     string         # provider_message_id of parent
agent_processed bool           # set by agent after handling
agent_processed_at timestamp
received_at     timestamp      # set by inbound service
queued_at       timestamp      # set when outbound row is inserted
sent_at         timestamp      # set when outbound send completes
failed_reason   text           # populated on status=failed
metadata        json           # provider-specific extras
```

### `documents`

COI-specific. The COI request as a tracked artifact moving through the pipeline.

```
id                  uuid PK
tenant_id           uuid
correspondence_id   uuid FK → correspondence.id    # the inbound email that originated this
contractor_name     string
contractor_email    string
requesting_party    string                          # the entity requiring the COI (e.g., "ABC Corp")
project_reference   string
coverage_required   json                            # {general_liability: 2000000, additional_insured: ["ABC Corp"]}
coverage_current    json                            # extracted from policies collection
gaps                json                            # structured diff (parallels flags collection but compact)
status              enum                            # received | reviewing | flagged | approved | issued | rejected
generated_cert      asset_ref                       # populated when cert PDF is generated
created_at          timestamp
updated_at          timestamp
```

### `flags`

Detected issues per document. One row per flag (a document can have multiple flags). Persists for audit.

```
id              uuid PK
tenant_id       uuid
document_id     uuid FK → documents.id
type            enum           # coverage_gap | missing_endorsement | expired_policy | unverifiable_party | other
severity        enum           # blocker | warning | info
description     text
detected_by     agent_id       # the agent that flagged it
detected_at     timestamp
resolved_at     timestamp
resolved_by     operator_id    # the human (CSR) who resolved
resolution_note text
```

### `pipeline`

Workflow stage tracking per document. One row per stage transition (append-only — gives a clean audit trail).

```
id              uuid PK
tenant_id       uuid
document_id     uuid FK → documents.id
stage           enum           # submit | review | decide | notify | approve | issue | track
status          enum           # entered | in_progress | complete | blocked
assigned_to     actor_ref      # agent_id | operator_id | null
entered_at      timestamp
exited_at       timestamp
notes           text
```

### `policies` (read-only for the demo)

Pre-seeded with the agency's policies. The agent reads against this to compare coverage_required vs. coverage_current.

```
id                  uuid PK
tenant_id           uuid
contractor_name     string
contractor_email    string
policy_number       string
carrier             string
effective_date      date
expiration_date     date
coverages           json        # {general_liability: 1000000, auto: 1000000, ...}
endorsements        string[]
```

### `notifications` (composed with `notify-slack`)

Same pattern as correspondence — every Slack message is a row, sent or pending.

```
id              uuid PK
tenant_id       uuid
channel         string
message         text
attachments     json            # Slack-block format
status          enum            # pending | sent | failed
queued_at       timestamp
sent_at         timestamp
provider_ts     string          # Slack message timestamp; permits threading
metadata        json
```

---

## 6. The Email Primitive (Deep Dive)

This is the worked example. Every other composed-bundle tool follows the same pattern.

### Inbound flow

```
1. Contractor sends email to coi-requests@<demo-tenant>.tokenrip.com

2. Postmark receives it via inbound MX routing.

3. Postmark POSTs the parsed payload to Tokenrip's inbound webhook
   endpoint: POST /api/v1/email/inbound/postmark
   - Verifies Postmark signature (shared secret per provider)
   - Resolves the recipient address to tenant_id
   - Persists each attachment as a Tokenrip asset; collects asset refs

4. Tokenrip inserts a row into the correspondence collection:
   - direction: inbound
   - status: received
   - thread_id: derived from in_reply_to or generated new
   - all body / metadata fields populated
   - attachments: asset_refs[]
   - received_at: now()

5. The collection mutation event fires via mutation-subscribe.
   The agent harness (running locally or via scheduled job) is subscribed
   to mutations on the correspondence collection.

6. The harness invokes the COI skill with the new row's reference as input.

7. The skill processes the row; updates agent_processed = true when done.
```

### Outbound flow

```
1. The COI skill (mid-execution) calls its bound `outbox` tool with:
   email-outbound.send({
     to: contractor_email,
     subject: "Your COI request — coverage gap",
     body_text: "...",
     body_html: "...",
     attachments: [generated_cert_asset_ref],
     in_reply_to: original_correspondence.provider_message_id,
   })

2. The tool implementation inserts a row into correspondence:
   - direction: outbound
   - status: pending
   - all fields populated
   - in_reply_to: parent message_id (preserves thread)
   - queued_at: now()

3. Tokenrip's outbound send service (a worker subscribed to correspondence
   mutations where direction=outbound AND status=pending) picks up the row.

4. The worker calls Postmark's transactional send API with the row's content.

5. On success: row updated to status=sent, provider_message_id populated, sent_at = now().
   On failure: row updated to status=failed, failed_reason populated.

6. Downstream: any skill subscribed to correspondence mutations sees the
   status change and can react (e.g., a reminder skill that escalates if
   no reply within N hours).
```

### What the harness *cannot* do without the substrate

A skill author who wanted to bypass Tokenrip on email — say, by calling Postmark's API directly from the harness — would lose:

- The correspondence collection (no thread, no audit, no history queryable by other skills)
- The webhook on inbound (their agent has to poll their own IMAP, which requires the agent to *run* persistently)
- The dashboard (the CSR has nothing to look at)
- The multi-actor handoff (no shared state for the CSR view)
- The downstream subscription (no other skill can react to email events)
- The compliance trail (regulated industry — non-negotiable)

What's left is `requests.post('postmark.com/email')`. That is not what the agency is buying. The composition is the tool's value.

### Provider abstraction

The `email-inbound` and `email-outbound` tools are typed. The Postmark integration is an *implementation* of those types; the registry binds typed dep → implementation at resolution time. The skill never names Postmark.

In v1, the registry has one implementation per type. In v2, multiple implementations register for the same type (e.g., `email-outbound@postmark`, `email-outbound@resend`, `email-outbound@ses`); the resolution algorithm gains a strategy parameter. The skill code does not change.

This is the schema-flexibility pattern that protects Line 4 of `business-model.md`.

---

## 7. Collection Mutation Subscription

The reactive backbone. Every composed-bundle tool depends on this primitive. Without it, agents have to poll, which means agents have to run persistently — which collapses the mounted-agent model into a permanently-running cron job.

### V1: Long-poll

```
GET /api/v1/collections/<name>/mutations?since=<cursor>&timeout=30s

Returns:
  - 200 with [{mutation events}], up to N events, with new cursor
  - 200 with [] and same cursor if timeout hits with no events
  - 4xx on auth / collection error
```

The agent harness opens a long-poll loop on each subscribed collection. When events return, it invokes the appropriate skill with the event payload. When the timeout returns no events, it re-issues the request immediately.

Why long-poll for v1: webhook delivery requires the agent harness to be reachable on a public endpoint. Most operators will run the harness in environments where that's not the case (developer machine, behind NAT, on a flight). Long-poll degrades gracefully.

### V2 (post-demo): Webhook

```
POST /api/v1/collections/<name>/subscriptions
  { url: "https://<harness>/webhook", secret: "...", filter: {...} }

→ Tokenrip POSTs mutations to the registered URL when they occur.
```

For operators who can host a public endpoint (production deployments, internal-network agents). Same event payload as long-poll. The harness picks the mode at startup.

### Event payload

```json
{
  "collection": "correspondence",
  "mutation": "insert",          // insert | update | delete
  "row_id": "uuid",
  "row": { ... },                // full row state (post-mutation)
  "previous": { ... } | null,    // pre-mutation state on update; null on insert
  "occurred_at": "iso-timestamp",
  "cursor": "opaque"
}
```

### Filtering

Skills can declare filters in their dependency:

```yaml
- collection: correspondence
  access: read-write
  subscribe: true
  filter:
    direction: inbound
    status: received
    agent_processed: false
```

The platform applies the filter server-side; only matching mutations fire events. Reduces harness wakeups for noisy collections.

---

## 8. Agent Invocation Pattern

How a skill actually runs in response to a substrate event.

```
1. Harness boot:
   - Read installed skills + their YAML front-matter
   - Resolve each skill's dependencies against the registry
   - Mint per-skill scoped credentials
   - Open mutation subscriptions for each skill's subscribed collections

2. Mutation arrives (long-poll returns an event):
   - Harness identifies which skill(s) match the event
   - For each matched skill:
     - Build the invocation context: skill body, event payload, bound tools
     - Invoke the skill (currently: dispatch to LLM with the context)
     - Skill executes; may call any of its bound tools
     - Tool calls go through scoped credential layer; logged

3. Skill completes:
   - If skill marked the originating row as processed (agent_processed=true),
     the harness records the completion
   - Any errors are written to a per-skill error log collection (audit)
```

For v1 demo simplicity, the harness is a single-process Python (or TypeScript) runner. Multi-skill, multi-collection-subscription, but no fancy concurrency. One mutation at a time per skill.

### Where the LLM lives

The harness owns the LLM call. The skill body is the prompt. The bound tools are exposed as function-call schemas. The harness handles tool-call → API call → result-back-to-LLM round trips.

This is the BYO-model boundary: the operator's harness uses their model API key. Tokenrip never sees the LLM call. The harness sees the LLM call and the substrate calls; Tokenrip sees only the substrate calls.

---

## 9. Operator Dashboard (Read Surface)

The CSR's view into the workflow. Demo-grade: a simple web page rendering live collection state. Production-grade: tier-gated views, filters, search.

### V1 surface

A single page (`/dashboard/<tenant>/coi`) showing:

- **Pipeline view**: every active row in `documents`, grouped by `pipeline.stage`, with `flags.severity` badges
- **Inbox view**: latest unprocessed rows in `correspondence` (direction=inbound, agent_processed=false)
- **Audit pane**: append-only stream of recent pipeline transitions and flag events
- **Per-document detail page**: full correspondence thread, all flags (resolved + open), pipeline history, generated cert (if issued), one-click approve / reject

### Implementation

The dashboard is a Tokenrip-rendered surface that reads collections via the standard `collection-rw` tool. No custom backend; the dashboard is itself an example of the substrate composition (a tool reading collections).

CSR approval action posts a row update to `pipeline` (status=approved) and a row to a `decisions` collection. The agent's mutation subscription on `pipeline` picks up the change and continues the workflow.

For demo: hardcoded auth (single CSR account). For production: per-tenant auth, role-based view scoping.

---

## 10. Build Sequence

Two-day time-box per `bd/firm-direct-strategy/demo-spec.md`. Sequenced to land a demoable backbone Day 1, polish Day 2.

### Day 1 — Backbone

1. **Collection schemas** (~1.5h): Create `correspondence`, `documents`, `flags`, `pipeline`, `policies`, `notifications` collections. Seed `policies` with demo data (one contractor, one policy with $1M GL).
2. **Skill front-matter parser** (~1h): Read YAML, validate against registry, mint scoped credentials.
3. **Tool registry + resolution** (~1h): In-memory registry with hardcoded provider bindings.
4. **Email inbound** (~3h): Postmark inbound webhook → ingestion endpoint → correspondence row. Tested with a real send to the demo address.
5. **Email outbound** (~2h): Outbound worker watching correspondence; calls Postmark transactional API.
6. **Mutation subscription (long-poll)** (~2h): Endpoint + harness loop.
7. **Minimal harness** (~2h): Skill loader, mutation subscriber, LLM-call dispatcher with tool-call schemas.
8. **COI skill v0** (~1h): YAML front-matter + body. End-to-end smoke test: real email lands, agent reads, agent inserts a flag, dashboard would show it (dashboard not built yet).

**Day 1 exit criterion**: an email sent to the demo address shows up in `correspondence`, the COI agent reads it, inserts a row to `documents`, and inserts a flag to `flags`. No dashboard yet, no Slack yet, no outbound email yet — but the substrate composition is verifiably working.

### Day 2 — Demo skin

1. **Slack notify** (~1.5h): Composed-bundle tool; `notifications` collection writes; Slack webhook send.
2. **Outbound email completion** (~1h): Wire the COI skill to send the response email; test thread continuation via `in_reply_to`.
3. **PDF-generate** (~2h): Throwaway HTML-to-PDF; cert template; attach to `documents.generated_cert`.
4. **Operator dashboard** (~3h): Pipeline view, inbox view, per-document detail, approve action.
5. **Demo data + script** (~1.5h): Pre-seed a contractor email, write the COI skill body to flag the demo's coverage gap, choreograph the demo flow.
6. **End-to-end run-through** (~1h): Real email send → agent processes → dashboard shows → CSR approves → outbound email → cert delivered.

**Day 2 exit criterion**: the full demo runs from email to email, with the dashboard as the visible artifact in the middle.

### What gets cut if Day 2 runs over

In order of cuttability:
1. PDF-generate (use a static placeholder PDF; the demo doesn't hinge on cert quality)
2. Slack notify (the dashboard already shows the state; Slack is a "look how it touches your tools" moment, not load-bearing)
3. CSR approve UI (manually toggle the pipeline row in the database; demo narrates the action)

What does *not* get cut: the substrate composition discipline. If the only way to ship is to bypass `correspondence` and write a direct SMTP send, the demo is not ready. Cut features, not architecture.

---

## 11. Forward-Compatibility Checklist

Decisions in v1 that protect future revenue lines / capabilities. Each is a "do not regress" item.

- [ ] **Skill dependencies are typed, not pinned.** Protects future Line 4 (resolution layer).
- [ ] **Collections have row-level access control fields** (tenant_id, scoped credentials), even if v1 only has one tenant. Protects future multi-tenant + cross-tenant tool calls.
- [ ] **Mutation events have stable schema** with cursor pagination. Protects future webhook mode + replay.
- [ ] **Tool registry has `composes_with` field on every entry**, and CI rejects entries with empty `composes_with`. Protects the design discipline.
- [ ] **Outbound sends route through a worker subscribed to mutations**, not direct API call from the skill's tool function. Allows future rate-limiting, batching, retry semantics without skill changes.
- [ ] **Audit log is append-only and queryable.** Compliance / Enterprise tier requirement that gets impossible to retrofit.

---

## 12. Open Implementation Questions

Decisions worth making before code starts but not blocking:

1. **Skill harness language**: Python (faster to write, mature LLM SDKs) or TypeScript (matches Tokenrip's existing toolchain). Recommendation: TypeScript for consistency with existing harness work.
2. **Inbound email provider**: Postmark (best inbound parsing, mature webhook UX) vs. Resend (newer, more agent-aware roadmap, but inbound is less mature). Recommendation: Postmark for v1 demo reliability; revisit when Resend's inbound matures.
3. **Tenant address routing**: Subdomain (`<tenant>.tokenrip.com`) or path-based (`coi-requests+<tenant>@tokenrip.com`)? Recommendation: subdomain — cleaner for prospects to look at, easier to brand. Demo uses `<demo-tenant>.tokenrip.com`.
4. **Mutation subscription auth**: per-skill scoped tokens (proper) or per-harness session tokens (simpler)? Recommendation: per-harness session for v1; per-skill scoping is the v2 hardening.
5. **Dashboard rendering surface**: server-rendered HTML (Next.js / Astro) or SPA (React)? Recommendation: server-rendered for v1 — fewer moving parts, faster to ship. SPA when filters / live updates need complexity beyond auto-refresh.

---

## 13. What This Doc Is Not

- A protocol RFC. The exact wire formats (JSON shapes, header conventions, error semantics) need a follow-on spec before the platform is third-party-developable. V1 demo can ship with informal contracts.
- A multi-skill orchestration spec. Skill chaining (skill A produces an event that skill B subscribes to) works naturally via mutation subscription, but the patterns and limits aren't enumerated here.
- A security review. Inbound webhook signature verification, scoped credentials, and tenant isolation are noted but not adversarially analyzed. Pre-production: dedicated review pass.
- A test plan. Implementation will need unit tests on the ingestion + send paths, integration tests on the mutation subscription loop, and a demo-grade end-to-end script. Ship with at least the third.

---

## 14. Cross-References

- Architecture: `product/tokenrip/tool-layer.md`
- Monetization: `product/tokenrip/business-model.md`
- Demo spec: `bd/firm-direct-strategy/demo-spec.md`
- Mounted-agent model: `product/tokenrip/mounted-agent-model.md`
- Origin idea: `agents/bean/ideas/skill-packaging-and-tool-layer.md`
- Bean session producing this design: `agents/bean/sessions/2026-05-10.md`

---

*Drafted 2026-05-10. Owner: Simon. This brief is the basis for the v1 build; revisions are expected as the build surfaces gaps. When the demo ships, this doc moves from `active/` to `product/tokenrip/` (probably as `tool-layer-implementation-v1.md`) with a build-debrief section appended.*
