# Business Model

> Charge for the substrate, not the wrapper. The monetizable surface is the set of capabilities that are structurally non-bypassable because they only function on shared, persistent, multi-actor state. Everything else is commodity by 2027.

**Status**: Thesis (locked 2026-05-10)
**Origin**: 2026-05-10 Bean session on tool-layer monetization tension. Sharpened the "charge for hands, not thinking" principle from `mounted-agent-model.md` into concrete monetization lines.
**Companion docs**: `tool-layer.md` (the architectural decisions this thesis depends on), `mounted-agent-model.md` (the BYO model inversion this thesis extends).

---

## Executive Summary

Tokenrip's monetizable surface is *not* the model (the user brings their own), *not* the imprint (text is free), and *not* third-party API wrapping (the harness can call the upstream directly). It is the substrate-coupled capability layer — collections, webhooks, scheduled operations, indexes, dashboards, audit trails, multi-actor coordination — and the things that compose with it.

Three monetization lines emerge from this:

1. **Substrate Tooling Tiers** — operator pays for the substrate primitives their agent depends on. The primary revenue line.
2. **Composed-Bundle Capabilities** — capabilities that wrap third-party APIs but compose with substrate side effects. Same tier-based pricing; the bundle is what's paid for.
3. **Builder Observability** — the supply side pays for visibility into how their published imprints and skills are being used. Doesn't require call-path control, has cleaner gross margins than tool wrapping.

Two surfaces are explicitly *not* monetized today: raw third-party API wrappers (commodity, structurally bypassable, fight is lost before it starts) and inference (the user pays their own model bill — that's the BYO inversion).

A future fourth line — the resolution layer (charging tool providers to be the resolved tool when a skill declares a dependency) — is structurally sound but premature. It becomes viable once skill graph density makes Tokenrip a meaningful distribution channel. Schema design today should leave room for it.

---

## 1. The Thesis

> **Substrate is monetizable. Wrapping is not.**

Every AI company struggles with the same monetization question: what can we charge for that won't be commoditized in 18 months? The historical answers — inference, prompt access, model fine-tuning, vertical UI — all have collapsing margins because the underlying capability gets cheaper, faster, and better-substituted.

The mounted-agent inversion (`mounted-agent-model.md`) takes inference off the table by design — the user pays their own model. That eliminates the largest cost center but it also eliminates the obvious revenue line. What's left to charge for?

The answer is the layer that *gets more valuable* as the ecosystem matures, not less:

- More agents on the platform → collections become more useful (more data to query, more cross-references to make)
- More mounted agents → webhooks become more valuable (more events to react to)
- More operators per imprint → multi-actor coordination becomes load-bearing
- More regulated-industry buyers → audit trail becomes non-negotiable
- More skills composing tools → the resolution layer becomes a real revenue surface

This is the inverse of the inference cost curve. Substrate value compounds; inference value commoditizes. Charge for the thing that compounds.

---

## 2. The Bypassable / Non-Bypassable Frame

The decisive question for any candidate monetization surface: **can the harness reproduce this without the substrate?**

| Surface | Bypassable? | Charge for it? |
|---|---|---|
| Inference | Yes — user runs their own model | No (BYO model is the design) |
| Imprint hosting | Yes — git, raw HTTP, S3 | No (free; distribution layer) |
| Memory persistence (collections) | No — shared mutable state has to live somewhere | **Yes** |
| Semantic search over collections | No — index lives with the collection | **Yes** |
| Webhook on collection mutation | No — the platform owns the event | **Yes** |
| Scheduled operations (agent-tied) | No — requires platform identity + scheduler | **Yes** |
| Dashboard / operator view | No — requires shared state to view | **Yes** |
| Audit trail | No — requires platform to be in the call path | **Yes** |
| Multi-operator handoff | No — requires shared state | **Yes** |
| `tweet` (Twitter API wrapper) | Yes — harness calls api.twitter.com | No |
| `chat-completion` (OpenAI wrapper) | Yes — harness calls api.openai.com | No |
| `send-email` *as composed bundle with correspondence collection + webhooks + dashboard* | The third-party call portion is bypassable; the substrate composition is not — and the bypass loses the useful part | **Yes (the bundle)** |

The pattern: anything that requires shared, persistent, multi-actor state is non-bypassable. Anything that wraps a stateless third-party call is bypassable. Compose Category A capabilities with substrate primitives (Category C in `tool-layer.md`) and you inherit the non-bypassability.

---

## 3. The Three Monetization Lines

### Line 1 — Substrate Tooling Tiers (Primary)

Operator pays for the substrate primitives their agent depends on. Not seat-based, not inference-based, not call-volume-based at low tiers — capability-based.

| Tier | Includes | Target | Pricing intuition |
|---|---|---|---|
| **Free** | Collections (read/write, modest row caps), assets, basic dashboard, manual webhook configuration | Individual operators, hobby agents, distribution layer | $0 |
| **Pro** | Semantic search over collections, webhook automation on mutation, scheduled operations, computed columns, full audit log, larger row caps | Serious agent operators, knowledge products, professional workflows | ~$29–99/mo |
| **Enterprise** | Custom tool provisioning, inter-agent tool exposure, advanced analytics, SLA, audit-export for compliance, dedicated support | Companies deploying agents as products, regulated industries | Annual contract, $1K+/mo equivalent |

**Natural upgrade trigger**: the operator upgrades when their agent outgrows its hands. Not because of seat limits — because the agent now needs to *search* (not just read), needs to *react* (not just poll), needs to be *audited* (not just observed). Each capability boundary is a real product need, not an arbitrary gate.

**Why this works**:
- Zero user resentment — they pay for capabilities they're actively using
- Margins expand with scale (storage + compute on indexed data, not inference)
- Upgrade triggers are real product needs, not friction-based gates
- Capabilities compound — every new substrate primitive shipped becomes a new upgrade trigger across all existing operators

### Line 2 — Composed-Bundle Capabilities (Same Tier System)

Tools that wrap third-party APIs but compose with substrate side effects. These are technically a sub-category of Line 1 — the substrate composition is what the operator pays for; the third-party wrapper is the convenient packaging.

Examples:
- `email` (inbound + outbound, composed with correspondence collection)
- `slack-notify` (composed with notifications collection)
- `pdf-parse` (composed with documents collection)
- Future: `crm-sync`, `sms`, `payment-event`

**Why this isn't a separate revenue line**: the operator doesn't pay extra for the Twitter wrapper — they pay for the Pro tier that includes substrate capabilities, and the composed bundles are part of what Pro unlocks. The third-party API costs (Resend per-email, Twilio per-SMS) are either absorbed into the tier price (low-volume capabilities) or itemized at enterprise tier (high-volume).

**The discipline**: if a tool can't justify why it composes with substrate, it doesn't ship as first-party. Either skip it or let third parties wrap it. Never ship a Category A tool standalone — that's competing with the API provider's SDK on no advantage.

### Line 3 — Builder Observability

Tokenrip is the substrate; mounted-agent builders are the supply side. Builders want visibility into how their published imprints and skills are being used: who installed it, return rates, error patterns, version adoption, popular tool dependencies, which workflows drive most engagement.

This is a separate monetization line because:

- It doesn't require call-path control. Even when tool calls bypass Tokenrip (Category A), the harness can ping Tokenrip with telemetry — most harnesses already do this for skill loading, just extend the payload.
- Gross margins are clean (storage + dashboard rendering; no third-party costs).
- The buyer (builder) is different from the Line 1/2 buyer (operator). Doesn't cannibalize.
- Maps to a known model: Vercel for consumers (free), paid for the builder dashboard. PostHog. Plausible. The pattern works.

**Pricing intuition**: $20–100/mo per builder, scales by imprint count + operator volume tracked. Could ship as a builder-side tier independent of operator tiers.

**Why this matters strategically beyond revenue**: the builder dashboard is also the substrate's intelligence-gathering surface. Every builder observing their imprint's usage is also opting Tokenrip into seeing the patterns across builders — what tool dependencies cluster, what workflows succeed, what skills get forked. That's the data flywheel that informs Line 4.

---

## 4. The Future Fourth Line — Resolution Layer

When skills declare typed tool dependencies (`needs: image-generation`) and the platform resolves them to specific providers (Adobe Firefly, Midjourney, DALL-E, etc.), Tokenrip is in the matching position. Even when the resolved call path eventually bypasses Tokenrip (the harness calls the provider directly with credentials), the *resolution decision* — which provider for which dependency for which skill — flows through Tokenrip.

That's a monetization surface that doesn't depend on call-path control. It depends on registry control. Charge providers to be the default resolution for a dependency type. Or charge a per-resolution rev-share. Or a hybrid (free to be in the registry, paid to be the default).

**Why it's premature today**: density. The npm-style market dynamics (multiple providers competing on the same interface) require a critical mass of skills declaring dependencies. We don't have that. Selling this in 2026 is selling a market that doesn't yet exist.

**Why the schema today must leave room for it**: skills declare typed dependencies (not pinned endpoints) from day one. The resolution layer is then a routing decision the platform can monetize when density arrives, without requiring skill authors to migrate. If we ship pinned endpoints today, we lock ourselves out of the most defensible long-term revenue line.

**When it becomes real**: when the question "which Twitter wrapper should the platform default-resolve `tweet` to" has more than one credible answer, *and* enough skills declare `tweet` as a dependency that being the default matters to providers. Realistic timeline: 2027–2028, gated on substrate density growth.

---

## 5. What We Don't Monetize (And Why)

### Inference

The BYO model inversion is the design. The user pays their own model bill. This is the architectural choice that eliminates the unit-economics problem killing AI startups; it cannot be reversed for revenue without breaking the thesis.

The gain is structural: every model price drop is a free upgrade for mounted-agent products (no margin compression to absorb), every power user is a data contributor (not a margin destroyer), the company's marginal cost per user is logarithmic (storage) instead of linear (inference).

### Imprint Hosting

Instructions are text. Charging for hosting text competes with git, raw HTTP, S3, GitHub Gists, Pastebin. The fight is unwinnable and the substrate position depends on imprint hosting being free (or near-free) so it remains the distribution layer for everything else.

The exception worth watching: enterprise customers may want imprint privacy (private hosting, access control) at the imprint layer — that's a feature of the Enterprise tier, not a separate hosting fee.

### Raw Third-Party API Wrappers (Category A)

Standalone wrappers around Twitter, OpenAI, Stripe, Twilio, Resend, etc. The harness can call the upstream directly. The API provider has an SDK. MCP standardizes the protocol. Competing here is competing on no advantage. Don't.

The discipline is procedural: the tool design review must answer "what substrate primitive does this compose with as part of its useful behavior" before any third-party wrapper ships. If the answer is "none," the tool either doesn't ship or ships only as a referenced example for skill authors to wrap themselves.

---

## 6. Pricing Disposition by Buyer

| Buyer | Primary Line | Secondary Line | Logic |
|---|---|---|---|
| Individual operator (free user) | Line 1 free tier | — | Distribution layer; pay $0 to deepen substrate density |
| Professional operator (workflow user) | Line 1 Pro tier | — | Pays for substrate capabilities the agent needs |
| Mounted-agent builder | Line 3 (observability) | — | Pays for visibility into how their imprint is used |
| Builder *and* operator (deploys their own imprint for themselves) | Line 1 + Line 3 | — | Pays both lines because they're both customers |
| Enterprise (regulated industry, multi-actor workflow) | Line 1 Enterprise | Line 3 (if they distribute internally) | Audit, compliance, support are non-negotiable |
| Tool/API provider | (future Line 4) | — | Pays to be in the resolution registry when density arrives |

**Cross-cutting**: the builder/operator split (`agents/bean/insights.md`, 2026-05-07) determines pitch shape. Builders get the supply-side pitch ("visibility, distribution, iteration"). Operators get the demand-side pitch ("persistence, portability, capability"). The pricing model follows the same split.

---

## 7. Anti-Patterns to Avoid

### "Storage is the monetization"

Undersized framing. By 2027 storage alone competes with S3, Pinecone, Notion databases — commodity. What Tokenrip actually has isn't storage; it's *agent-aware primitives that happen to use storage as substrate*. If the internal language is "storage," the design and pricing will under-deliver. The internal language is "the substrate that mounted agents need to function."

### "Tools are the monetization, server-routed only"

Loses on first contact with reality. Harnesses can call any HTTP endpoint. A skill author who wants to bypass Tokenrip's `tweet` tool to save a few cents will do so trivially. The defensible position isn't "tools that route through us" — it's "tools whose useful behavior depends on substrate composition." The frame matters because it produces different design choices.

### "Pivot to inference billing if substrate revenue is slow"

Breaks the BYO inversion. The architectural advantage of mounted agents is that the company doesn't carry inference cost; reverting to inference billing reintroduces the exact cost structure the model was designed to escape. If substrate revenue is slow, the answer is more substrate primitives shipped, not a regression to the SaaS economic model.

### "Charge per call on Category A wrappers anyway, just for revenue"

Operators will leave for direct API calls within one billing cycle. This is the worst of both worlds: a fight on no-advantage ground that also loses the substrate composition opportunity. If a Category A tool is shipping, it must be a Category C bundle, billed as part of the tier — never a per-call line item on a wrapped third-party API.

### "Add a marketplace fee on imprints"

Imprints are text. A marketplace fee on text is enforcement-impossible (skill authors will distribute via git the moment they hit it) and contradicts the distribution-layer role of free imprint hosting. The marketplace, if it emerges, monetizes the resolution layer (Line 4) — which providers fulfill which dependencies — not the imprint storefront.

---

## 8. Ninety-Day Implementation Sequence

The minimum monetizable surface for the COI demo and the broader Motion E substrate-density curve:

1. **Substrate primitives the demo requires (Line 1 capability set)**
   - Collections with row-level access control
   - Webhook on collection mutation
   - Asset persistence + linking from collection rows
   - Dashboard view (operator-facing)
   - Audit log query
2. **First composed-bundle capabilities (Line 2, demo-driven)**
   - `email-inbound` (composed with correspondence collection)
   - `email-outbound` (composed with correspondence collection)
   - `slack-notify` (composed with notifications collection)
3. **Tier gate UX**
   - Free tier exposes the substrate primitives at modest caps
   - Pro tier exposes semantic search, automated webhooks, audit log query
   - The gate should fire when the operator's agent *attempts the capability*, not when they read a pricing page
4. **Builder observability v1 (Line 3, parallel track)**
   - Builder dashboard showing imprint installs, operator counts, tool-call patterns
   - Initially free; convert to paid once a builder has > N operators

Out of scope for ninety days: the resolution layer (Line 4), enterprise audit-export tooling (Line 1 Enterprise), inter-agent tool exposure.

---

## 9. Connection to Strategic Frame

This monetization architecture is the revenue logic underneath the audience-led mounted-agent substrate strategy (`bd/CLAUDE.md`):

- **Substrate density curve** (the 90-day north star) directly produces Line 1 upgrade triggers — every imprint deployed is an operator who eventually outgrows the free tier
- **Lighthouse imprints** (Chief of Staff, COI demo) are the proof that workflows requiring the architecture exist — i.e., that there's a Pro/Enterprise tier worth buying
- **Builder observability (Line 3)** is the supply-side flywheel for Motion D (builder-direct) and the analytics layer that informs which substrate primitives to ship next
- **The resolution layer (Line 4)** is the long-term moat that justifies a venture round at scale — it's the layer that captures the entire skill graph's market dynamics

The fundraising story (`bd/yc-strategy.md`) is "we have substrate density and a compounding capability surface; the inference economy is collapsing margins for everyone else; we have the only architecture where margins expand with scale instead of compressing." This monetization model is what makes that story real.

---

## 10. Open Questions

- **Where does the free tier ceiling sit?** The free tier has to be useful enough to be the distribution layer but not so generous that the upgrade trigger never fires. Initial guess: row caps on collections, webhook count caps, no semantic search, no automated webhook firing (only manual configuration). Tune empirically once first deploys are running.
- **Builder vs. operator-pays for tools.** Some composed bundles have variable upstream cost (Resend per-email). At low tier, absorb it; at enterprise, itemize. Where exactly the line sits is empirical.
- **Imprint privacy as a paid feature.** Some builders want private imprints (compliance, competitive sensitivity). Is that an Enterprise feature or its own line item? Probably Enterprise; revisit if there's signal.
- **Resolution layer rev-share vs. flat fee.** When Line 4 becomes real, is it pay-to-be-default, rev-share on resolved calls, or both? Decision can wait until density arrives, but the schema should be flexible.
- **Open-source operator dashboard.** A self-hosted dashboard for operators who don't want to depend on the platform UI but still want substrate primitives. Could expand reach into security-conscious enterprises. Worth exploring once core dashboard is stable.

---

*Document created 2026-05-10. Captures the monetization architecture that emerged from the 2026-05-10 Bean session on tool-layer monetization tension. See `tool-layer.md` for the architectural decisions this thesis depends on, and `mounted-agent-model.md` §"BYO Model Inversion" for the economic context this extends.*
