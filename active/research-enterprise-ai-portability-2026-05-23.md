# Enterprise AI Portability: The Vendor Lock-In Problem and Tokenrip's Structural Advantage

**Research Date:** 2026-05-23
**Depth Level:** Deep dive
**Trigger:** Vijay Laknidhi follow-up — identified "agent survives the model swap" as the monetizable angle
**Researcher:** Claude (Strategic Business Coach)

---

## Executive Summary

Enterprise AI vendor lock-in is real, quantified, and accelerating. 81% of enterprise leaders express concern about AI vendor dependency. Only 6% can switch providers without material disruption. Average switching cost: $315K per project. The problem compounds across five layers — model, orchestration, data, governance, and behavioral — with behavioral lock-in (implicit knowledge agents accumulate through use) being the deepest and least portable. Microsoft Copilot dominates the enterprise installed base through ecosystem bundling ($30/user/mo on top of M365 E3/E5), not model superiority. Travelers has 30K employees on Claude via TravAI, creating massive concentration risk. The market is fragmenting around point solutions (LiteLLM for model routing, MCP for tool portability), but nobody owns the full portability stack. Tokenrip's mounted-agent architecture — with its imprint/memory/harness separation — is structurally designed to solve this, though the current go-to-market framing (collaboration) doesn't speak to this buyer.

---

## Core Questions Explored

1. How does Microsoft Copilot work at enterprise scale — pricing, deployment, model access?
2. What does "stuck with Copilot" actually mean — where do switching costs accumulate?
3. What's the competitive landscape for AI portability/abstraction layers?
4. Who is the buyer and what triggers the purchase?
5. How does this map to Tokenrip's mounted-agent architecture?

---

## 1. Microsoft Copilot: The Enterprise AI Default

### Pricing and Deployment

| Tier | Price | Requirements | Scale |
|------|-------|-------------|-------|
| **Copilot Chat (Free)** | $0 | Microsoft Entra account + M365 sub | Public web data only — no org data |
| **Copilot Business** | $18-21/user/mo | M365 Business Standard/Premium | Up to 300 users |
| **Copilot Enterprise** | $30/user/mo | M365 E3 or E5 base license | Unlimited, annual commitment |

Enterprise plan ($30/user/mo) includes: full integration with Word, Excel, PowerPoint, Outlook, Teams, SharePoint; access to Microsoft Graph (the org's entire data graph); deep reasoning agents (Researcher, Analyst); model choice; Copilot Tuning; bundled Copilot for Sales, Service, and Finance.

### The Model Layer

Microsoft is building "Copilot Fabric" — a multi-model routing layer that dispatches queries to GPT-5, Claude 4, Phi-4, or other models based on task type. Enterprise customers will get model choice. **This sounds like it solves portability, but it deepens lock-in**: "A multi-model Copilot lets Microsoft tell customers they're not locked into one model family, but if customers choose Copilot and Copilot chooses the model, Microsoft owns the relationship."

Copilot Studio now supports additional models including xAI's Grok 4.1, OpenAI's GPT-5.3 Thinking, and GPT-5.4 Instant. Enterprises can also bring their own Azure OpenAI models, Anthropic models, or on-premise LLMs.

### What This Means

Microsoft's play is not model lock-in — it's *ecosystem* lock-in. The model is replaceable within Microsoft's walled garden. The garden itself is the trap. Every Copilot interaction touches Microsoft Graph (emails, files, calendar, Teams conversations, SharePoint sites). Every custom agent built in Copilot Studio lives in Power Platform's proprietary solution format. The deeper the org goes, the harder the exit.

---

## 2. What "Stuck with Copilot" Actually Means

Vijay's phrase — "stuck with Copilot" — describes five layers of lock-in that compound over time:

### Layer 1: Model API (Low switching cost)
Swapping GPT for Claude in a direct API call is relatively easy. LiteLLM and similar gateways normalize 100+ provider APIs into a single interface. This is the easiest layer and the one most "portability" solutions stop at.

### Layer 2: Orchestration & Workflow (Medium switching cost)
Agents built in Copilot Studio use Power Platform's proprietary solution format. Export exists but is lossy — topic-level comments, some knowledge sources, agent icons, and channel configs don't survive. Custom workflows wired through Power Automate, Dataverse triggers, and Teams integrations are deeply coupled to the Microsoft stack.

### Layer 3: Data & Integration (High switching cost)
Microsoft Graph is the crown jewel and the deepest hook. Copilot's power comes from accessing the org's emails, files, calendars, Teams conversations, SharePoint content — all through Graph. Leaving Copilot means rebuilding every data connection. This is where Vijay's wife's startup is stuck: "signed into the Microsoft ecosystem vs. Google and feel stuck now without being able to integrate models well into that ecosystem."

### Layer 4: Governance & Compliance Evidence (High switching cost)
Enterprises in regulated industries (insurance, finance, healthcare) accumulate compliance evidence — audit trails, data handling certifications, security reviews — specific to their AI vendor. Switching means re-certifying with the new vendor. Enterprises now negotiate for: data exit (portable export of prompts, embeddings, logs), kill switches (right to suspend agent execution at control-plane level), and model deprecation notices (minimum window before model retirement).

### Layer 5: Behavioral Lock-In (Extreme switching cost — non-portable)
This is the deepest and most underappreciated layer. When persistent AI agents accumulate implicit knowledge about an org — terminology, decision patterns, approval chains, exception handling, communication styles — that knowledge cannot be exported as structured data. "You can't export a behavioral model. A JSON dump of your conversation history doesn't capture the agent's understanding of what those conversations meant."

**Key data point:** Agents leveraging persistent memory show up to 70% improvement in task completion rates vs. stateless alternatives. Switching means months of degraded performance while the replacement re-learns organizational context.

**Industries most exposed:** Legal services, financial services, healthcare operations, enterprise procurement — environments with many exceptions, specialized terminology, and complex approval chains. Exactly the industries Vijay operates in.

### The Compounding Effect

Lock-in deepens on a timeline:
- **Month 1-3:** Mostly Layer 1-2. Switching is feasible.
- **Month 3-12:** Layer 3-4 accumulate. Switching is expensive.
- **Month 12+:** Layer 5 dominates. Switching is organizational trauma.

**Travelers is at 5+ months with 10K-30K users.** Their behavioral lock-in to Claude is already substantial and growing daily.

---

## 3. Competitive Landscape: Who's Solving Portability?

### Model-Level Solutions (Layer 1 only)

| Player | What They Do | Limitation |
|--------|-------------|-----------|
| **LiteLLM** | Unified Python SDK normalizing 100+ LLM APIs | Model routing only — doesn't touch memory, workflows, or behavioral context |
| **OpenRouter** | API gateway for model routing | Same — model swap, not agent swap |
| **Microsoft Copilot Fabric** | Multi-model routing within Copilot | "An abstraction layer provided by a hyperscaler is not an abstraction layer but a deeper integration point" |

### Platform-Level Solutions (Layers 1-3)

| Player | What They Do | Limitation |
|--------|-------------|-----------|
| **Dust** | Multi-model enterprise agent platform (OpenAI, Anthropic, Google, Mistral, DeepSeek) | Still a single platform — agents live in Dust, not portable out of Dust |
| **C3 AI (C3 Code)** | LLM-agnostic enterprise agent platform | Enterprise-heavy, not for individual operators or bottom-up adoption |
| **MindStudio** | Multi-agent platform, coined "behavioral lock-in" terminology | Platform-bound; raised the problem but doesn't fully solve it |

### Standards & Protocols (Enabling layers)

| Standard | What It Does | Status |
|----------|-------------|--------|
| **MCP (Model Context Protocol)** | Open standard for connecting agents to tools/data | 10K+ public servers, 97M monthly SDK downloads. Tool portability, not agent portability |
| **A2A (Agent-to-Agent)** | Google's agent interop protocol | Complementary to MCP — handles agent communication |
| **Open Agent Specification** | Declarative agent definition format (arxiv paper) | Academic — no production adoption |
| **AAIF (Agentic AI Foundation)** | Linux Foundation umbrella for open agentic standards | Governance body, not a product |
| **Anthropic Agent Skills** | Open standard for portable agent procedural knowledge | "MCP provides the plumbing for tool access; Agent Skills provide the brain" |

### The Gap

**Nobody owns the full portability stack.** The market fragments at each layer:
- Model routing: solved (LiteLLM, OpenRouter)
- Tool connectivity: solved (MCP)
- Agent definition: partially solved (Agent Skills, Open Agent Spec)
- Memory portability: unsolved at scale
- Behavioral context portability: fundamentally unsolved

The deeper you go in the stack, the fewer solutions exist. And the deeper layers are where switching costs are highest.

---

## 4. The Buyer: Who Pays for Portability?

### Primary Buyer Personas

**CTO/CIO** — Translates AI ambitions into executable architecture. Cares about total cost of ownership, switching flexibility, and avoiding re-platforming. The portability mandate: "design for resilience first, differentiation second."

**CISO** — Gate for any new AI vendor. Vijay's unprompted insight: "You'd have to convince the CISOs that you are safer than Claude or OpenAI." CISOs evaluate: data residency, audit trails, vendor risk concentration. Portability is a risk mitigation argument for CISOs — single-vendor dependency is a risk register item.

**CDO (Chief Data Officer)** — Owns the data governance layer. Increasingly involved in AI procurement decisions around data portability, export rights, and compliance evidence.

### The Buying Motion

Two distinct triggers:

**Proactive (sophisticated buyers):**
- Annual vendor risk audits flag AI concentration
- Board-level AI governance reviews require multi-vendor capability
- CTO architects abstraction layer during initial deployment
- 20% overhead of abstraction saves 200% in switching costs later
- **Who:** Large enterprises, regulated industries, companies that got burned before (remember cloud vendor lock-in debates from 2015-2020)

**Reactive (everyone else):**
- Vendor does something egregious (Vijay's Travelers scenario)
- Vendor pricing spikes (OpenAI has done this; Anthropic could)
- Vendor deprecates a model with insufficient notice
- Vendor gets acquired or pivots strategy
- **Who:** Mid-market, less mature AI governance, caught by surprise

### What They're Negotiating For

Enterprises are already demanding these contractual provisions:
- **Data exit:** Portable export of prompts, embeddings, fine-tunes, and logs at no charge
- **Kill switch:** Right to suspend agent execution at control-plane level
- **Model deprecation notice:** Minimum window before any model is retired
- **Behavioral context ownership:** (emerging) Explicit ownership of agent-learned patterns

### Pricing Signals

- Average switching cost: **$315K per project**
- Median enterprise AI contract: **$97,500/year**
- Organizations spending >$100K/month on AI: **45%** (up from 20% in 2024)
- Abstraction layer ROI: enterprises that built abstraction early saved **60-80%** on migration costs vs. those that didn't

### The Insurance Vertical Specifically

Vijay named three data points:
1. **Zurich Insurance** — Major Microsoft customer, using Copilot with Outlook. Launched AI Lab with ETH Zurich. Documented $40M annual savings from AI-driven underwriting. Deep in Microsoft ecosystem.
2. **Travelers** — 10K engineers with Claude assistants, 30K employees with TravAI access. One of the largest enterprise AI integrations in financial services. Public Anthropic partnership announced January 2026.
3. **"So many other insurance firms"** — Only have Copilot. No alternative path.

Insurance is a high-value target for portability: regulated, risk-averse, deep institutional knowledge, high behavioral lock-in exposure, and already spending heavily on AI.

---

## 5. Tokenrip Architecture Mapping: What Solves What

The mounted-agent model separates three layers — **Imprint** (instructions/logic), **Memory** (accumulated context), and **Harness** (local execution environment). This maps directly onto the portability problem:

### Layer-by-Layer Analysis

| Lock-In Layer | What Gets Trapped | Tokenrip's Answer | Gap? |
|---------------|-------------------|-------------------|------|
| **1. Model API** | API calls coupled to one provider | **Harness is replaceable.** The imprint runs on any harness — Claude Code, Cursor, GPT, local models. Model swap = harness swap. Imprint stays. | **No gap.** This is the core architecture. |
| **2. Orchestration** | Workflows in proprietary format (Copilot Studio, Power Platform) | **Imprint is portable text.** Instructions, skills, operational logic stored as versioned Tokenrip assets — plain markdown, not proprietary format. | **Partial gap.** Complex orchestration (multi-step workflows with conditional branching) needs richer imprint primitives beyond current assets. |
| **3. Data & Integration** | Microsoft Graph, Dataverse, proprietary connectors | **Memory lives on Tokenrip.** Collections + assets, queryable, not locked to any provider's data graph. Tool calls are HTTP — provider-agnostic. | **Significant gap.** Tokenrip doesn't replicate Microsoft Graph's depth (emails, calendar, SharePoint, Teams). The value prop is: your *agent's* memory is portable, not your entire data ecosystem. |
| **4. Governance** | Audit trails, compliance evidence tied to vendor | **Imprint is inspectable, tool calls are logged, memory is queryable.** "The only architecture where the agent is observable end-to-end." | **Moderate gap.** Need to build out compliance-grade audit logging and export. But architectural foundation is there. |
| **5. Behavioral** | Implicit knowledge agents learn through use | **Memory is externalized and owned.** Layered memory model (shared knowledge layer + private context layer) means behavioral context lives in Tokenrip, not in the model provider's opaque state. | **This is the killer differentiator.** No competitor externalizes behavioral context as a first-class primitive. |

### Where the Architecture Wins

**The mounted-agent model's deepest advantage is at Layer 5 — behavioral portability.** Every other solution stops at model swapping or tool connectivity. Tokenrip's memory architecture means:

1. Agent knowledge accumulates in Tokenrip collections/assets, not in the provider's opaque context
2. When you swap harnesses (Claude → GPT → local model), the memory comes with you
3. The layered memory model (shared knowledge + private context) maps directly to enterprise requirements: shared organizational playbooks + private department data

**The "post-company existence" argument from the mounted-agent model doc is exactly the Travelers pitch:** "If OpenAI shuts down Custom GPTs, every Custom GPT dies. If a mounted-agent builder shuts down, the imprint and memory still live on Tokenrip."

### Where Gaps Exist

1. **No Microsoft Graph equivalent.** Tokenrip can't replace deep enterprise data integrations (email, calendar, Teams, SharePoint). The pitch must be scoped: "your agent's intelligence is portable" — not "your entire IT stack is portable."
2. **Model-specific imprint tuning.** An imprint optimized for Claude may not perform equally on GPT-4 or Gemini. The model-agnostic promise has a quality asterisk. (The mounted-agent model doc flags this as an open question.)
3. **Enterprise compliance features.** SOC 2, HIPAA, FedRAMP — the compliance gatekeepers that CISOs require. Not architectural blockers, but certification work.
4. **Scale proof.** No enterprise deployment at Travelers/Zurich scale to reference yet.

---

## Strategic Analysis

### 1st Order Effects

- **A new positioning angle emerges.** "Agent survives the model swap" is a sharper, more urgent pitch than "agents collaborate across platforms." Collaboration is nice-to-have; portability is risk mitigation. Risk mitigation has budget.
- **The buyer changes.** Collaboration sells to team leads and ICs. Portability sells to CTOs and CISOs. Higher in the org, bigger contracts, longer sales cycles.
- **Insurance becomes a wedge vertical.** Vijay's data points (Travelers, Zurich, "so many others") plus regulatory pressure create a natural beachhead.

### 2nd Order Effects

- **Microsoft is aware and moving.** Copilot Fabric's multi-model routing is Microsoft's answer to portability concerns. But it's portability *within Microsoft's walls* — which is exactly the trap. Tokenrip's counter-argument: "An abstraction layer provided by a hyperscaler is not an abstraction layer."
- **The portability narrative could accelerate enterprise demand for mounted agents.** If the pitch is "your agents should outlive your AI vendor," the natural follow-up is "where should they live?" — and the answer is the substrate.
- **Tension with current Motion E (audience-led).** The portability buyer is enterprise. Motion E targets mid-tier creators. These are different markets with different sales motions. This isn't necessarily a conflict — portability could be the enterprise motion (Motion A reframed) while audience-led remains the density motion.

### Opportunities for Tokenrip

1. **Reframe the Travelers story as a pitch.** "Travelers has 12K employees on Claude. What happens if Anthropic has an issue? Their agents, workflows, and accumulated knowledge — gone. With Tokenrip's mounted-agent architecture, the imprint and memory survive the model swap. Harness dies, intelligence lives."
2. **Behavioral portability as category claim.** Nobody else is talking about Layer 5. MindStudio coined "behavioral lock-in" but doesn't solve it. Tokenrip's externalized memory architecture does. This could be a blog post in Series 3 or a standalone positioning piece.
3. **Insurance vertical pilot.** Vijay is an insider who validated the angle independently. He offered himself as "your insurance guy." A joint exploration — Vijay as domain advisor, Tokenrip as infrastructure — could produce a concrete use case.
4. **CISO trust as positioning wedge.** Vijay's insight: "You'd have to convince the CISOs that you are safer than Claude or OpenAI." Tokenrip doesn't replace Claude — it sits *between* the enterprise and Claude. Trusted intermediary positioning. Auditability and observability are already architectural features.

### Risks & Challenges

1. **Enterprise sales ≠ audience-led motion.** Selling portability to CTOs/CISOs requires enterprise sales infrastructure: security reviews, compliance certs, procurement processes, 6-12 month cycles. This is a fundamentally different motion from Motion E.
2. **Microsoft is the 800-lb gorilla.** If Microsoft ships genuine model portability within Copilot (even if it's still within their walled garden), the urgency for external portability solutions diminishes for Microsoft-native enterprises.
3. **"Portability" is a vitamin until the crisis hits.** Vijay's Travelers scenario — "what if Claude does something egregious" — is a hypothetical. Until it actually happens, portability competes with inertia. The proactive buyer exists but is a small segment.
4. **Scale credibility gap.** Selling to Travelers-scale enterprises without a reference deployment at that scale is a cold-start problem.
5. **Multiple-motion trap.** Adding an enterprise portability motion alongside Motion E risks violating the "no third active motion" rule from the strategic frame.

---

## Vault Connections

- [[bd/calls/contacts/vijay-laknidhi]] — Source contact, insurance insider, potential advisor
- [[bd/calls/transcripts/vijay-laknidhi-2026-05-19]] — Call where portability angle emerged
- [[product/tokenrip/mounted-agent-model]] — Architecture that structurally solves the problem
- [[product/tokenrip/mounted-agent-synthesis]] — Positioning implications (post-company existence, observability moat)
- [[bd/motions-and-strategy]] — Motion taxonomy (portability = Motion A reframed? Or new motion?)
- [[content/plans/blog-series-3-mounted-agents-plan]] — Post #13 ("The Imprint Is a Contract") maps to the audit/governance angle

---

## Open Questions & Unknowns

1. **Is portability a motion or a positioning angle?** It could be: (a) a new buyer persona within Motion E, (b) a reframing of deprecated Motion A (firm-direct), or (c) a genuinely new motion. Each has different implications for founder time allocation.
2. **Would an enterprise buyer accept Tokenrip as a trusted intermediary today?** The CISO trust bar is high. Tokenrip is pre-revenue, pre-SOC 2. Is there a path that doesn't require full enterprise compliance upfront?
3. **What's the minimum viable portability product?** Is it the full mounted-agent architecture, or could a simpler "agent export/import" tool prove the concept?
4. **Does Microsoft's Copilot Fabric announcement change the urgency?** If enterprises believe Microsoft is solving portability internally, external solutions face a headwind.
5. **Is the insurance vertical deep enough?** Vijay names three data points. How many insurance enterprises are actually at the "12K users on one provider" concentration level?
6. **What's the second use case Vijay started to mention?** He said "I'll give you two insurance use cases" but only completed one (the portability angle). The second could be equally valuable.

---

## Recommended Next Steps

### Immediate (This Week)

1. **Follow up with Vijay on three things:**
   - The second insurance use case he didn't finish
   - Whether he'd be open to a 30-minute structured session mapping Travelers' actual portability risk (specific workflows, data dependencies, behavioral context that would be lost)
   - His read on whether CISOs would accept a "trusted intermediary" positioning from a startup

2. **Draft a "behavioral lock-in" positioning piece.** The term exists (MindStudio coined it) but nobody has claimed the solution. A blog post or tweet thread framing Tokenrip's externalized memory as the answer could plant a flag.

### Near-Term (Next 2 Weeks)

3. **Map portability to Motion E vs. new motion.** Does this angle serve the current audience-led motion (portability as a feature that creators care about) or does it require a separate enterprise motion? Present to Yoda for a decision.

4. **Assess compliance requirements.** What does Tokenrip need (SOC 2 Type I? Data residency commitments? Encryption at rest?) to be credible to an insurance CISO? Is there a lightweight path?

### Strategic (Pre-YC/a16z)

5. **Build the Travelers pitch deck slide.** Even if Tokenrip doesn't pursue insurance directly, "Travelers has 12K employees on Claude with zero migration path — here's how mounted agents solve that" is a powerful fundraising slide.

6. **Research the broader enterprise AI portability market size.** $315K average switching cost × number of enterprises with AI vendor concentration = addressable market for the portability layer.

---

## Sources

- [Microsoft 365 Copilot Enterprise Pricing](https://www.microsoft.com/en-us/microsoft-365-copilot/pricing/enterprise)
- [Microsoft Copilot Pricing Guide 2026](https://copilot-experts.com/microsoft-copilot-pricing-guide/)
- [Microsoft 365 Copilot APIs Overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/copilot-apis-overview)
- [Microsoft Copilot 2026: Agent-First AI Platform, Multi-Model](https://windowsnews.ai/article/microsoft-copilot-2026-agent-first-ai-platform-multi-model-azure-data-centers.419146)
- [Copilot Studio: Bring Your Own Model](https://learn.microsoft.com/en-us/microsoft-copilot-studio/bring-your-own-model-prompts)
- [Enterprise Agentic AI Landscape 2026: Trust, Flexibility, and Vendor Lock-in](https://www.kai-waehner.de/blog/2026/04/06/enterprise-agentic-ai-landscape-2026-trust-flexibility-and-vendor-lock-in/)
- [The AI Infrastructure Trap: How the Big Three Are Quietly Locking Your Engineering Organization In](https://stepto.net/blog/ai-vendor-lock-in-infrastructure-risk-2026)
- [AI Agent Ecosystem Fragmentation: Platform Lock-In, Portability](https://zylos.ai/research/2026-04-05-ai-agent-ecosystem-fragmentation-platform-lock-in-portability)
- [What Is Behavioral Lock-In? (MindStudio)](https://www.mindstudio.ai/blog/what-is-behavioral-lock-in-persistent-ai-agents-switching-costs)
- [The Enterprise Agent Portability Problem Is Coming (IAPP)](https://iapp.org/news/a/the-enterprise-agent-portability-problem-is-coming)
- [Multi-Model AI Engineering Playbook: MCP, AI Gateways](https://www.epcgroup.net/blog/multi-model-ai-engineering-playbook-mcp-ai-gateway-vendor-portability-2026)
- [Top AI Platforms with Model-Agnostic Architecture (Dust)](https://dust.tt/blog/top-ai-platforms-model-agnostic-architecture)
- [Travelers Partners with Anthropic (Investor Relations)](https://investor.travelers.com/newsroom/press-releases/news-details/2026/Travelers-Partners-with-Anthropic-to-Expand-AI-Enabled-Engineering-and-Analytics-Capabilities/default.aspx)
- [Travelers Insurance Scales Claude AI Across Global Workforce](https://markets.financialcontent.com/stocks/article/tokenring-2026-1-15-travelers-insurance-scales-claude-ai-across-global-workforce-in-massive-strategic-bet)
- [10,000 Travelers Employees Get AI Assistants (Carrier Management)](https://www.carriermanagement.com/news/2026/01/16/283567.htm)
- [Zurich AI Lab Launch](https://www.zurich.com/media/news-releases/2025/2025-1029-01)
- [Zurich Insurance Group AI Strategy Analysis](https://www.klover.ai/zurich-insurance-group-ai-strategy-analysis-of-dominance-in-insurance-ai/)
- [Enterprise AI Pricing Comparison 2026](https://coworker.ai/blog/enterprise-ai-pricing-comparison-2026)
- [AI Cost for Businesses 2026 (Zylo)](https://zylo.com/blog/ai-cost)
- [Export and Import Agents in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-solutions-import-export)
- [Copilot Studio Custom Agents Enterprise Guide 2026](https://www.epcgroup.net/blog/microsoft-copilot-studio-custom-agents-enterprise-guide-2026)
- [Anthropic Agent Lock-In: 9 Critical Enterprise Risks](https://www.progressiverobot.com/2026/05/08/anthropic-agent-lock-in/)
- [Open Agent Specification (arxiv)](https://arxiv.org/pdf/2510.04173)

---

## Tags

#theme/portability #theme/vendor-lock-in #theme/enterprise-ai #segment/insurance #segment/enterprise #contact/vijay-laknidhi #product/mounted-agents #competitive/microsoft-copilot #competitive/dust
