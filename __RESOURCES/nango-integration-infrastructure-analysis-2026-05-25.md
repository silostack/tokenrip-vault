# Nango as Integration Infrastructure for Tokenrip's Vault Layer

**Research Date:** 2026-05-25 (updated 2026-06-06)
**Depth Level:** Deep dive
**Researcher:** Claude (Strategic Business Coach)
**Status:** Active — self-host spike gated on deal requiring multi-app OAuth

---

## Executive Summary

Nango is an integration infrastructure platform (YC W23, ~$2.5M raised) that manages OAuth flows, token storage, credential refresh, and API proxying for 800+ APIs. Unlike Composio, which is a pre-built tool catalog for AI agents, Nango is **plumbing** — it handles the auth and credential lifecycle that tools sit on top of. This distinction matters: **Nango solves the "build the vault" problem from the Composio hybrid recommendation, while Composio solves the "buy the catalog" problem.** They are complementary layers, not competitors, from Tokenrip's perspective.

**The critical finding:** Nango's **free self-hosted tier includes auth + proxy** — exactly the vault layer Tokenrip needs — running on Tokenrip-owned infrastructure with AES-256-GCM encrypted token storage. No per-connection fees. No third-party token custody. No dependency on Nango's cloud for the security-critical path. The security posture (SOC 2 Type II, HIPAA, GDPR, no known breach history) is materially stronger than Composio's post-incident posture.

**However**, Nango's cloud pricing model is hostile at Tokenrip's scale: $1/connection/month means 10K operators × 2-3 connected apps = $20K-$30K/mo — versus Composio's $229/mo for equivalent operator count. Cloud Nango is priced for SaaS products with moderate end-user counts, not platforms brokering thousands of operator connections. Self-hosting is the only viable path.

**Recommendation: Self-host Nango's free tier as the auth/token vault layer.** This gives Tokenrip OAuth management, encrypted token storage, and automatic refresh on owned infrastructure — the exact "vault for Tier-1 connections" the Composio analysis called for. Layer Composio (or direct API calls) on top for tool execution. The substrate-composition bundles wrap both: Nango-managed auth → API execution → Tokenrip substrate side-effects.

---

## Core Questions Explored

1. Multi-tenancy: Can Nango broker OAuth connections for thousands of operators under one account?
2. Architecture: How does it work — auth flows, token storage, proxy, webhooks, sync engine?
3. Self-host vs cloud: What's the real self-host story and does it reach feature parity?
4. Pricing: What's the cost at Tokenrip scale (1K → 50K operators)?
5. Composio comparison: Where do they overlap, where do they diverge, and which fits better?
6. Strategic fit: Does Nango solve the "vault for Tier-1 connections" problem?
7. Security posture: Encryption, compliance, breach history, token custody model?

---

## Key Findings

### 1. Multi-tenancy works — but the model is different from Composio

Nango uses a **connection + end_user tag** model rather than Composio's `user_id` namespace. Each "connection" represents one end-user's credentials for one external API. Connections are tagged with `end_user_id`, `organization_id`, and `end_user_email` at creation time.

Canonical pattern:

```typescript
// Backend: create a session for an operator
const { data } = await nango.createConnectSession({
  tags: {
    end_user_id: operator_uuid,        // Tokenrip's operator ID
    organization_id: imprint_uuid,     // Tokenrip's imprint ID
    end_user_email: operator_email
  },
  allowed_integrations: ['gmail', 'slack', 'hubspot']
});

// Frontend: user completes OAuth
const connect = nango.openConnectUI({ sessionToken: data.token });

// Backend: webhook fires with connection_id → store mapping
// user_id → integration_id → connection_id

// Later: retrieve credentials
const conn = await nango.getConnection('gmail', connectionId);
```

**Key difference from Composio:** Nango doesn't model ownership — you must store the `connection_id → operator` mapping yourself. This is actually **more flexible** for Tokenrip: the harness owns the mapping, connections are portable, and Nango never needs to understand Tokenrip's operator/imprint/agent hierarchy.

One Nango account (or self-hosted instance) serves unlimited end-users. Connections are isolated per-credential. Tag-based querying (`GET /connections?tags[end_user_id]=<ID>`) enables efficient per-operator lookups.

### 2. Architecture — infrastructure, not tools

Nango provides four primitives that Composio does not:

| Primitive | What It Does | Composio Equivalent |
|-----------|-------------|-------------------|
| **Auth** | OAuth flows, API keys, token refresh, credential encryption | Partially overlapping (Composio manages auth too) |
| **Proxy** | Authenticated API requests with automatic credential injection, rate-limit handling | None — Composio calls go through their tool layer |
| **Functions** | TypeScript integration functions deployed to a managed runtime | Composio's pre-built tool definitions |
| **Syncs** | Scheduled data synchronization with incremental updates, pagination, deduplication | None — Composio has no data sync |

Plus: **webhooks** (real-time event handling), **triggers** (event-based workflows), and **MCP server** support.

The architecture is five Node.js services:

| Service | Role |
|---------|------|
| **Server** | Dashboard, API, proxy requests, webhooks |
| **Orchestrator** | Task scheduling and state tracking |
| **Jobs** | Task processing and Runner dispatch |
| **Runner** | Integration code execution (sandboxed) |
| **Persist** | Synced record and log storage |

Supporting infrastructure: PostgreSQL (control plane + credential store), Redis, Elasticsearch (logs), S3 (object storage).

**The fundamental architectural difference:** Composio is a **tool library** — 1,000+ pre-built, closed-source tools you call via API. Nango is **integration infrastructure** — auth/proxy/sync primitives you build on with your own code. Composio gives you `gmail.send_email()`. Nango gives you authenticated Gmail API access and lets you build `gmail.send_email()` yourself (or with AI-generated TypeScript functions).

### 3. Self-hosting — the load-bearing finding

Nango offers two self-hosting tiers:

| Dimension | Free Self-Hosting | Enterprise Self-Hosting |
|-----------|------------------|----------------------|
| **Features** | Auth + Proxy only | All cloud features |
| **Functions/Syncs** | Not included | Included |
| **Webhooks** | Not included | Included |
| **MCP Server** | Not included | Included |
| **Observability** | Basic | Full (OpenTelemetry export) |
| **RBAC/SSO** | Not included | Included |
| **Support** | None | Enterprise SLA |
| **Pricing** | Free | Annual license + reduced usage fees |
| **Token encryption** | AES-256-GCM (you supply key) | AES-256-GCM (you supply key) |

**For Tokenrip, the free tier is the sweet spot.** Auth + Proxy is exactly the vault layer — OAuth management, encrypted token storage, automatic refresh, and authenticated API proxying. Functions/Syncs/Webhooks are where Tokenrip's own substrate-composition layer lives anyway; buying Nango's runtime for those would create the same architectural mismatch as Composio (raw execution without substrate side-effects).

Infrastructure requirements (supports 1M+ executions/day):
- 5 Node services: 1 CPU / 2GB RAM each
- PostgreSQL: 2 CPU / 8GB RAM / 128GB storage
- Redis: 128MB
- Elasticsearch: 2 vCPU / 1GB RAM / 30GB storage

Deployment: Docker Compose (dev), Helm charts for Kubernetes (prod), ECS with guidance.

**Caveat:** Key rotation is not supported yet — changing the encryption key after initial setup causes decryption failures. This is a real limitation for credential rotation practices but not a blocker for initial deployment.

### 4. Pricing — cloud is hostile, self-host is free

**Nango Cloud pricing (usage-based across 7 dimensions):**

| Dimension | Free | Starter ($50/mo) | Growth ($500/mo) |
|-----------|------|-------------------|-------------------|
| Connections | 10 | 20 (+$1/ea) | 100 (+$1/ea) |
| Proxy requests | 100K | 200K | 1M |
| Function compute | 10hrs | 20hrs | 100hrs |
| Function runs | 100K | 200K | 1M |
| Sync storage | 100K records | 200K | 1M |
| Webhooks | 100K | 200K | 1M |

**Tokenrip-scale modeling (cloud — NOT recommended):**

| Scale | Connections | Connection cost alone | Total est. |
|-------|------------|----------------------|-----------|
| 1K operators × 2 apps | 2,000 | $1,900/mo | ~$2,500/mo |
| 10K operators × 2 apps | 20,000 | $19,900/mo | ~$21,000/mo |
| 50K operators × 2 apps | 100,000 | $99,900/mo | ~$102,000/mo |

**Composio at the same scale** (100 calls/operator/month):
- 1K operators → **$29/mo**
- 10K operators → **$229/mo**
- 50K operators → **~$976/mo**

The per-connection pricing model makes Nango Cloud **~100x more expensive** than Composio for Tokenrip's multi-tenant use case. This is because Nango is priced for SaaS products (one product, moderate end-users connecting their own accounts) rather than platforms brokering thousands of operator connections.

**Self-hosted pricing:** $0 for the free tier (auth + proxy). Enterprise self-hosting is a custom annual license. For the vault use case, free self-hosting eliminates the pricing problem entirely.

### 5. Composio vs. Nango — different layers of the same stack

| Dimension | Composio | Nango |
|-----------|----------|-------|
| **What it is** | Tool catalog for AI agents | Integration infrastructure |
| **Core value** | Pre-built tools you call | Auth/proxy/sync primitives you build on |
| **Integration count** | 1,000+ tools | 800+ API auth providers |
| **Auth management** | Yes (managed, cloud-only) | Yes (managed or self-hosted) |
| **Token custody** | Composio's vault (cloud) | Your infrastructure (self-hosted) |
| **Tool definitions** | Closed-source, pre-built | Open-source TypeScript, AI-generatable |
| **Data syncs** | No | Yes (incremental, bidirectional) |
| **Webhooks** | No | Yes |
| **Per-tenant customization** | No | Yes (code-first, per-integration) |
| **Self-hosting** | Limited (OSS repo exists) | Production-grade (Docker/K8s/ECS) |
| **Pricing model** | Per-call metering | Per-connection + per-call |
| **Multi-tenant cost at 10K** | ~$229/mo | ~$21,000/mo (cloud) or $0 (self-hosted free) |
| **Security posture** | May 2026 breach; SOC-2 in progress | SOC 2 Type II; HIPAA; no known breaches |
| **License** | Proprietary | Elastic License (source-available) |
| **Funding** | $29M (Lightspeed Series A) | ~$2.5M (YC W23 + seed) |

**The framing that matters:** Composio gives you `tools.gmail.send_email(to, subject, body)`. Nango gives you `proxy.post('https://gmail.googleapis.com/...', { headers: nango.getAuthHeaders(connectionId) })`. One is a high-level tool abstraction; the other is authenticated infrastructure.

For Tokenrip's substrate-composition architecture, the infrastructure layer is more aligned. Composio's pre-built tools bypass the substrate gate; Nango's authenticated proxy *enables* Tokenrip to build composed tools that go through the gate.

### 6. Strategic fit — Nango IS the vault

The Composio analysis recommended "Buy the catalog, build the vault." The open question was what "build the vault" means in practice. Nango answers it:

| Composio Recommendation | Nango Mapping |
|------------------------|---------------|
| "Hold OAuth tokens for Tier-1 in Tokenrip-owned KMS" | Self-hosted Nango: AES-256-GCM encrypted tokens in your Postgres |
| "Use Composio for long-tail execution" | Still valid — Nango doesn't replace tool definitions |
| "Wrap Composio calls in substrate-composed bundles" | Nango auth + Composio/direct-API execution + Tokenrip substrate side-effects |
| "Cap blast radius from any Composio incident" | Tier-1 tokens never touch Composio's infrastructure |

The revised architecture:

```
Operator → Nango (self-hosted) → OAuth flow → Token stored in Tokenrip Postgres
                                                       ↓
Tokenrip Composed Bundle:
  1. Retrieve credentials from Nango (local)
  2. Execute API call (direct or via Composio for long-tail)
  3. Write to substrate collection (correspondence, contacts, etc.)
  4. Fire webhook / update dashboard / audit log
```

This is architecturally clean. The auth layer (Nango) is decoupled from the execution layer (Composio or direct API) and both are wrapped by the substrate-composition layer (Tokenrip). No single vendor controls both tokens and execution.

### 7. Security posture — materially stronger than Composio

| Dimension | Nango | Composio |
|-----------|-------|----------|
| **SOC 2** | Type II (annual audit) | In progress (pre-incident) |
| **HIPAA** | Compliant (BAA available) | Not mentioned |
| **GDPR** | Compliant (DPA auto-applies) | Not mentioned |
| **Encryption at rest** | AES-256-GCM (per-encryption IV) | Not specified publicly |
| **Encryption in transit** | TLS 1.2+ | Not specified publicly |
| **Breach history** | None known | May 2026: 5,001 GitHub tokens, 5,241 API keys |
| **Token custody (self-hosted)** | Your infrastructure, your key | Cloud-only vault |
| **RBAC** | 3-tier (Full/Support/Contributor) | Not specified |
| **Audit logging** | OpenTelemetry export | Basic |
| **Penetration testing** | Regular (claimed) | Not specified |
| **Key rotation** | Not supported yet | Not specified |

For a platform holding operator OAuth tokens, the security delta is significant. Self-hosted Nango means a breach at Nango (the company) doesn't expose your operators' tokens — the blast radius is contained to your own infrastructure's security posture.

---

## Strategic Analysis

### 1st Order Effects (if Tokenrip self-hosts Nango for the vault layer)

- **Token custody shifts to Tokenrip.** No third-party holds operator OAuth tokens. The trust story is clean: "Your tokens live in our infrastructure, encrypted with keys we control."
- **OAuth maintenance offloaded.** Nango's auth primitive handles token refresh, re-authorization flows, and credential validation — the perpetual maintenance tax the Composio analysis identified.
- **Composio dependency scoped to execution.** Composio (if used) only sees API calls, never tokens. A Composio incident can't leak operator credentials.
- **Infrastructure cost is real but bounded.** Self-hosting requires 5 services + Postgres + Redis + Elasticsearch. Roughly $200-500/mo on AWS for a production-grade deployment supporting 10K+ operators.
- **No per-connection fees.** Self-hosted free tier has no metering — the pricing problem disappears entirely.

### 2nd Order Effects

- **Migration optionality is maximized.** Tokens in Tokenrip-owned Postgres mean no re-OAuth event if Nango (the company) disappears. Export and migrate to any system that reads Postgres.
- **Two-vendor complexity.** Nango for auth + Composio for execution = two integration surfaces, two upgrade cycles, two failure modes. Mitigated by the clean separation (auth vs. execution) but real.
- **Self-hosting operational burden.** Nango is 5 Node services + 3 data stores. Not trivial to operate. Needs monitoring, backups, upgrades. At pre-revenue stage, this is engineering time competing with sales work.
- **Elastic License risk.** Nango is not MIT/Apache. Source-available under Elastic License means Nango can change terms. Mitigated by the fact that the auth+proxy layer is the stable, mature part of the codebase — unlikely to undergo radical changes.
- **Builder ecosystem signal.** Using Nango for auth + building custom tools on top aligns with the "mounted-agent substrate" narrative better than "we use Composio" — signals that Tokenrip owns the critical infrastructure.

### Opportunities for Tokenrip

- **The "vault for Tier-1 connections" is now buildable in days, not months.** Self-host Nango, configure OAuth apps for Gmail/Slack/GitHub/CRM, deploy. The 24-hour spike recommended in the Composio analysis becomes a concrete path: Nango + composed bundle wrapping Gmail send + `correspondence` collection write.
- **The hybrid architecture crystallizes.** Nango (self-hosted, free) for auth/vault + Composio ($229/mo at 10K) for long-tail tool execution + Tokenrip substrate composition wrapping both. Total vendor cost: ~$229/mo + ~$300/mo infrastructure = ~$529/mo at 10K operators. Compare to Nango Cloud alone at $21K/mo or Composio alone with trust surface risk.
- **Demo-day narrative strengthens.** "We self-host our token vault with SOC-2 compliant infrastructure. No third party holds our operators' credentials. We use external tool catalogs for breadth but own the security-critical path." This is the right story for trust-sensitive enterprise buyers and for fundraising.
- **Data sync primitive could feed substrate collections.** If Tokenrip eventually upgrades to Nango Enterprise self-hosting, the sync engine could feed substrate collections (contacts from CRM, messages from Slack, etc.) — the exact "mounted agent needs context from the operator's tools" pattern. Not needed now but architecturally compatible.

### Risks & Challenges

- **Self-hosting at pre-revenue is a distraction risk.** Every hour operating Nango infrastructure is an hour not selling. The forward-deployed-engineer playbook says "sell the solution, build substrate behind it." Self-hosting Nango is building infrastructure before a customer pulls on it — the exact anti-pattern CLAUDE.md warns about. **Mitigant:** Only self-host once a deal (Luai or LinkedIn-sourced) requires multi-app OAuth. Don't pre-build.
- **Elastic License is not open source.** Nango can revoke or restrict the Elastic License. The risk is low (they need the community) but non-zero. If self-hosting becomes critical to Tokenrip's operations, evaluate whether forking the auth layer is viable.
- **Key rotation gap.** Nango self-hosted doesn't support encryption key rotation. For a production vault holding operator tokens, this is a security limitation. Needs a plan (manual migration or upstream contribution) before going to production.
- **Free self-hosting feature gap.** No functions, webhooks, MCP server, observability, RBAC, or SSO in the free tier. This is fine for the vault use case (auth + proxy is all we need) but limits future expansion without an Enterprise license.
- **Nango's funding runway.** $2.5M total raised — much leaner than Composio ($29M). Lower acquisition risk (less VC pressure) but also higher "company disappears" risk. Mitigated by self-hosting and data portability.
- **Connection model impedance.** Nango doesn't model ownership (user → connection mapping is your responsibility). Tokenrip's harness needs a connection registry mapping `operator_id → integration_id → connection_id`. Not complex but needs to be designed and built.

---

## Revised Architecture Recommendation

The Composio analysis proposed three forks: full buy, hybrid, full build. With Nango in the picture, the hybrid sharpens:

### Layer 1: Auth Vault (Nango self-hosted, free tier)
- OAuth flow management for all operator connections
- AES-256-GCM encrypted token storage in Tokenrip Postgres
- Automatic token refresh and re-authorization
- Authenticated proxy for direct API calls
- **Cost:** ~$300/mo infrastructure (5 services on AWS)

### Layer 2: Tool Execution (Composio cloud OR direct API)
- Composio for long-tail integrations (Linear, Notion, Figma, etc.)
- Direct API calls via Nango proxy for Tier-1 (Gmail, Slack, GitHub)
- **Cost:** $29-229/mo Composio (based on call volume)

### Layer 3: Substrate Composition (Tokenrip)
- Every tool call wrapped in a composed bundle
- Collection writes, audit hooks, dashboard surfaces, webhooks
- CI gate enforces `composes_with: []` rejection
- **Cost:** Tokenrip's own compute

**Total at 10K operators: ~$529-729/mo** (vs. Composio-only hybrid at ~$529/mo, or Nango Cloud at $21K/mo)

The cost is comparable to the Composio hybrid, but with **token custody fully on Tokenrip infrastructure** and no dependency on Composio for the security-critical auth path.

---

## Vault Connections

- **Composio analysis**: `__RESOURCES/composio-tool-broker-analysis-2026-05-23.md` — the "buy catalog, build vault" recommendation that Nango now concretizes
- **Tool layer architecture**: `active/tool-layer-design-brief-2026-05-10.md` — substrate-composition gate; Nango's proxy enables composed bundles without bypassing
- **Tool catalog spec**: `active/tokenrip-tool-catalog-imprint-spec-2026-05-18.md` — P0/P1 tool list; Nango covers auth for all of them
- **Mounted-agent architecture**: `product/tokenrip/mounted-agent-model.md` §8 — harness owns operator creds; Nango gives the harness a proper credential store
- **Business model**: `product/tokenrip/business-model.md` — substrate tiers preserved; Nango sits below the monetization layer
- **Lighthouse thesis**: [[lighthouse-first-inversion-thesis]] — self-hosted Nango accelerates the path to a lighthouse deploy with real multi-app OAuth

---

## Open Questions & Unknowns

1. **Self-hosting stability at scale**: How does self-hosted Nango perform at 10K+ connections? No public benchmarks for the free tier. Need a load test.
2. **Connection model design**: Tokenrip needs a `operator_id → integration_id → connection_id` registry. Where does this live — harness DB, substrate collection, or a dedicated connection service?
3. **Key rotation workaround**: Nango doesn't support key rotation. What's the migration path if the encryption key is compromised? Upstream issue or custom wrapper?
4. **Elastic License implications**: Can Tokenrip fork the auth+proxy layer if Nango changes license terms? How much of the auth layer is self-contained?
5. **Enterprise self-hosting pricing**: If Tokenrip eventually needs functions/syncs/webhooks from Nango, what does the annual license cost? Establish relationship with Nango sales early.
6. **GoHighLevel coverage**: Same gap as Composio — verify whether Nango's 800+ provider configs include GoHighLevel (the documented P0 CRM for Front Desk imprint).
7. **OAuth app registration burden**: Self-hosting means registering your own OAuth apps with every provider (Gmail, Slack, etc.). How many does Tokenrip need at launch, and what's the review/approval timeline for each?

---

## Recommended Next Steps

**This week:**
1. **Validate the self-hosting path**: Deploy Nango free tier locally (Docker Compose). Confirm auth + proxy works for Gmail OAuth. Measure: can one operator authorize Gmail, and can Tokenrip retrieve + use the token via proxy? This is the 24-hour spike.
2. **Move the Composio doc**: Relocate to `__RESOURCES/` alongside this analysis for clean reference.
3. **Design the connection registry**: Sketch the `operator_id → integration_id → connection_id` mapping. Decide where it lives (harness DB vs. substrate collection).

**Gate on a deal (not before):**
4. **Production self-host deployment**: Only deploy Nango to production infrastructure once a deal (Luai or LinkedIn-sourced) requires multi-app OAuth. Don't pre-build.
5. **Register OAuth apps**: Gmail, Slack, GitHub, GoHighLevel (if available). Each provider has its own review process — start registration when a specific deal needs it.
6. **Build the first composed bundle**: Nango auth → Gmail send → `correspondence` collection write. Validate the full stack from auth to substrate side-effect.

**Strategic (4-6 weeks):**
7. **Establish Nango relationship**: Reach out to founders (Robin Guldener, Bastien Beurier — YC W23). Fellow YC applicant angle. Ask about enterprise self-hosting pricing, key rotation roadmap, and any plans for connection-based pricing changes.
8. **Revisit the three-fork decision**: With Nango validated, the forks become: (A) Nango self-hosted + Composio for execution (recommended hybrid), (B) Nango self-hosted + direct API only (maximum control, slowest), (C) Composio only with post-incident wait-and-watch (fastest, ceded trust surface). Decide after spike + deal signal.

---

## Update: 2026-06-06

### What changed since May 25

**Nango platform (active development confirmed):**
- **v0.70.6 shipped June 1** (from v0.70.4 on May 18). Three releases in 18 days — active cadence.
- **50+ new APIs added in May**, including MCP-native integrations (Canva, Digits, Render, Superhuman, WordPress.com).
- **Remote Function Builder** (June) — agents can build integrations without local projects via REST endpoints for compile, dry run, deploy. Enables just-in-time integration generation.
- **Serverless runtime migration** — sync executions moving to AWS Lambda with 10-minute execution limit per run, checkpoint-based progress tracking.
- **Agent-led onboarding** — paste quickstart prompt into Claude Code / Cursor / Codex for guided setup. "AI builder skill" for 18+ coding agents.
- **Pricing: unchanged.** Free (10 connections), Starter ($50/mo, 20 connections), Growth ($500/mo, 100 connections). Overage still $1/connection/mo.
- **Self-hosting free tier: unchanged.** Auth + proxy only. No functions, webhooks, MCP server. Key rotation still unsupported.
- **GoHighLevel: NOT in Nango's 800+ provider catalog.** Confirmed absent. Nango offers "add on demand within days" for missing providers, or self-contributed via their open integration template format.

**Nango competitive positioning shift:**
- Nango now explicitly targets **multi-tenant platform use cases** — not just SaaS integrations. Marketing now highlights tenant isolation, per-customer resource limits, white-label auth UI, <100ms tool-call overhead.
- Claims **800+ APIs vs. Composio's "500+"** (Nango's competitive framing; Composio still claims 1,000+ "tools" — different unit of measure).
- Positions MCP server as production feature, but pragmatically recommends **REST tool calls over MCP for production reliability** ("custom tool calls are a better fit when control and reliability matter most").

**Composio incident (still unresolved as of May 27):**
- Composio's May 2026 security incident **remains under active investigation**. Last update May 27: "We are still investigating and figuring out what has been affected."
- Zero Trust Proxy KMS: **still in progress**, no completion timeline.
- SOC-2: **no mention** in any post-incident communication.
- Remediation completed: API keys deleted, ~100 toolkit OAuth2 connections revoked, credentials rolled, IP restrictions applied, 50+ third-party providers notified.
- **Customers must still manually rotate API keys and re-authorize connections.** Central revocation not possible for API_KEY type connections.

**Quintel context (new since May 25):**
- The active vertical build (Quintel / equipment finance) has **different connector needs** from the original imprint model. Quintel's data sources are EDGAR 8-K filings, USAspending awards, and UCC lien/maturity records — these are **public data APIs and scraping targets**, not OAuth-brokered SaaS connections.
- Nango's OAuth vault is **not load-bearing for Quintel's v0/v1**. The CRM/email/calendar OAuth story matters when Tokenrip substrate gets its first customer who needs operator-tool integration (the "hands" layer connecting to a customer's existing CRM, email, etc.).
- **Implication:** The Nango self-host spike is correctly gated on a deal requiring multi-app OAuth. Quintel's build doesn't pull on it.

### Revised assessment

The May 25 analysis remains structurally sound. Three things sharpen:

1. **Composio risk is higher than estimated.** The incident is still open 14 days later, with no KMS migration timeline and no SOC-2 progress. The "60-90 day wait-and-watch" recommendation from the Composio analysis has consumed ~14 days with no resolution signal. This strengthens the case for Nango-owned vault over Composio-held tokens.

2. **Nango's agentic positioning is maturing.** The AI builder skill + remote function builder + MCP server create a "coding agent builds the integration, product agent consumes it" loop. This is architecturally compatible with Tokenrip's substrate-composition model: agent builds a Nango integration → Tokenrip wraps it in a composed bundle → substrate side-effects attached at the wrapping layer.

3. **Timing is less urgent.** Quintel (the active build) doesn't need OAuth-brokered connections. The Nango vault matters when: (a) a deal requires connecting to a customer's CRM/email/calendar, or (b) the Tokenrip substrate ships operator-facing tool integration. Both are gated on revenue, not architecture. **Don't pre-build.**

### Updated next steps

| Priority | Action | Gate |
|----------|--------|------|
| **When needed** | Deploy Nango free tier locally, validate Gmail OAuth spike (24h) | A deal requires multi-app OAuth |
| **When needed** | Register OAuth apps (Gmail, Slack, CRM) with providers | Specific deal scopes specific integrations |
| **Background** | Monitor Composio incident resolution (watch for KMS migration, SOC-2) | If considering Composio for any execution layer |
| **Background** | Watch Nango's GoHighLevel support — request addition if a Front Desk imprint deal materializes | GoHighLevel-dependent deal |
| **Future** | Establish Nango founder relationship (Robin Guldener, Bastien Beurier — YC W23) | YC application or enterprise self-hosting evaluation |

---

## Sources

- [Nango Homepage](https://nango.dev/) — fetched 2026-05-25
- [Nango Pricing](https://nango.dev/pricing) — fetched 2026-05-25
- [Nango GitHub](https://github.com/NangoHQ/nango) — 8K+ stars, v0.70.4 (May 18, 2026)
- [Nango Security Docs](https://nango.dev/docs/guides/platform/security)
- [Nango Auth Primitive Docs](https://nango.dev/docs/guides/primitives/auth)
- [Nango Auth Implementation Guide](https://nango.dev/docs/implementation-guides/platform/auth/implement-api-auth)
- [Nango Self-Hosting Docs](https://nango.dev/docs/guides/platform/self-hosting)
- [Nango Blog: Composio Alternatives](https://nango.dev/blog/composio-alternatives/)
- [Nango Blog: Best Agentic API Platform](https://nango.dev/blog/best-agentic-api-integrations-platform/)
- [Respan: Composio vs Nango (2026)](https://www.respan.ai/market-map/compare/composio-vs-nango)
- [Nango YC Profile](https://www.ycombinator.com/companies/nango) — W23 batch
- [Nango Crunchbase](https://www.crunchbase.com/organization/nango) — ~$2.5M total funding
- [GitHub Issue #5536: Self-hosted feature set clarity](https://github.com/NangoHQ/nango/issues/5536)
- [Composio Tool Broker Analysis](composio-tool-broker-analysis-2026-05-23.md) — internal vault reference
- [Nango Dev Updates / Changelog](https://nango.dev/docs/changelog/dev-updates) — fetched 2026-06-06
- [Nango Blog: Best Agentic API Platform](https://nango.dev/blog/best-agentic-api-integrations-platform/) — fetched 2026-06-06
- [Nango Blog: Composio Alternatives](https://nango.dev/blog/composio-alternatives/) — fetched 2026-06-06
- [Composio May 2026 Security Incident (latest update May 27)](https://composio.dev/blog/composio-may-2026-security-incident) — fetched 2026-06-06
- [Nango GitHub Releases](https://github.com/NangoHQ/nango/releases) — v0.70.6 (June 1, 2026)

---

## Tags

#theme/tooling #theme/infrastructure #theme/build-vs-buy #theme/security #segment/mounted-agents #vendor/nango #vendor/composio #priority/p1
