# Make.com Playbook Analysis: What Translates to Tokenrip, What Doesn't, and the Visual-First Wedge

**Document type:** Strategic research memo
**Date:** 2026-05-21
**Status:** Draft for review
**Author:** Strategic Business Coach (vault synthesis)
**Tags:** #competitor #playbook #visual-first #motion-e #fundraising

---

## Executive Summary

Make.com (formerly Integromat) is a 14-year overnight success: bootstrapped in Prague from 2012, acquired by Celonis in October 2020 for $100M+ at $10M ARR, and now operates as an independent business unit serving 3.1M users with $40-52M ARR. Its growth playbook combined three durable moves: (1) building for self before going public, with a 3+ year pre-launch quiet period; (2) visual-first product design as competitive differentiation that Zapier did not match for nine years; and (3) generous free tier with aggressive price undercut against the category-defining incumbent.

Five elements of that playbook translate to Tokenrip — dogfooding, usage-based free tier, power-user features at undercut price, education-as-moat, and visual-first differentiation. Four elements do not — patient bootstrapping (Tokenrip has fundraising timelines), riding existing category demand (Tokenrip is creating a category), ecosystem-after-product-gravity (Motion E inverts this), and structural absence of VC pressure.

The single most valuable lesson is the visual-first wedge. Make Grid — the platform's multi-dimensional workflow visualization — is what Zapier could not clone, and it sustained Make's brand and retention for a decade. Tokenrip's equivalent is not yet built: **custom operator interfaces rendered on top of artifacts.** This primitive would let creators deploy mounted-agent imprints that look and feel like branded products (dashboards, morning briefs, kanban views) rather than chat skins. No competitor — ChatGPT, Claude.ai, Dust, Lindy, Sierra, Lovable, Make itself — currently combines an agent runtime, a published artifact substrate, and a creator-distributable presentation layer in one product. This is structurally defensible and directly serves Motion E's distribution requirements.

Recommendation: ship a hand-coded custom interface on Chief of Staff within four weeks, add "custom interface primitive" as a P0 substrate roadmap milestone, and reframe Make in pitch materials from playbook-to-emulate to incumbent-to-disintermediate.

---

## Situation: Why Make.com Is a Useful Reference

Make.com is the closest publicly documented case study of a bootstrapped, product-led automation platform competing against a category-defining incumbent (Zapier) and winning enough share to be acquired at >$100M. Its trajectory spans the consumerization of integration software — the same secular shift Tokenrip is positioned for in agents. Three angles make Make's history strategically relevant:

1. **It is the only major automation platform to compete with Zapier and win.** Most challengers (IFTTT for consumers, Workato for enterprise, Tray.io for verticals) either segmented away or stagnated. Make engaged Zapier directly on overlapping ground.

2. **It was bootstrapped to scale.** No outside funding from 2012 through 2020. This makes its growth purely product-led, which strips out the noise of paid acquisition or sales motion analysis.

3. **It pivoted to AI agents in April 2025**, putting it directly into Tokenrip's category. Make is no longer just a reference point; it is becoming a competitor.

The research question for this memo: *What in Make's playbook is transferable, what isn't, and what does that imply for Tokenrip's next six months?*

---

## Background: The Integromat-to-Make Story

### Founding (2012)

Integromat was founded in 2012 in Prague by a team of systems integrators — referred to internally as the "I-team" — led by Ondřej Gazda (CEO) and Patrik Šimek (CTO/co-founder). The founding context is unusually informative: before building Integromat, the team had been doing custom integration work for large enterprises. They built the platform initially as an internal tool to save themselves time on repetitive integration projects.

Patrik Šimek, on the founding intent: *"Integromat is a project whose primary purpose was to save us time, and the idea that we could turn it into a cloud integration platform came only later."*

This is meaningful because it produced a product built for builders by builders, with no early-stage VC pressure to pursue PMF on someone else's timeline. The dogfooding period extended for years before the public product launched.

### Pre-Launch Quiet Period (2012-2015)

Make's own product blog states that they spent multiple years developing the platform before "showing it to the whole world." This is a deliberate inversion of the MVP-and-iterate playbook that dominated startup orthodoxy in that era. The founders' philosophy: ship something that is *"10x better than anything that existed or was yet to be built"* rather than iterate to product-market fit from a minimum viable product.

Two structural enablers made this possible:
- **Self-funded operations.** Founders' consulting income funded development. No runway clock.
- **Solving their own problem.** Even a half-built tool was usable internally, so there was no "vapor product" purgatory.

### Public Growth (2015-2020)

Integromat launched publicly mid-decade and grew through pure product-led mechanics:

| Year | Milestone |
|---|---|
| ~2016 | Visual-first product design philosophy explicitly adopted by Šimek (cited in 2024 blog post) |
| 2018 | First acquisition offers received. Founders rejected three offers from major SaaS companies, some approaching nine figures. |
| 2018 | Participated in CzechAccelerator program for Silicon Valley market exploration. |
| 2020 (acquisition) | $10M ARR, 11,000 paying customers, 375,000 users, 400% YoY growth, 60 employees, 500+ connectors. |
| Oct 2020 | Acquired by Celonis for >$100M (CZK 2.5B / ~€105M). Fourth offer was accepted. |

Critical detail: at acquisition, **Integromat had no dedicated sales team.** Growth came entirely from product-led mechanics — customers switching from Zapier, word-of-mouth, content/SEO compounding.

### Post-Acquisition Expansion (2020-2026)

| Year | Milestone |
|---|---|
| 2022 | Rebranded from Integromat to Make. Launched Make platform as next-generation product. |
| 2023 | ~2M users (60% YoY growth). 4B+ scenario executions. Original Integromat shut down September 30. First in-person user event (Waves '23, Munich). |
| 2024 | 3.1M users (68% YoY growth). 5.6B scenarios. 2,100+ apps. 30,000-member community. 430,000 Make Academy enrollments (3x increase). |
| April 2025 | Make AI Agents launched. Direct competitor to mounted-agent category. |
| 2026 | ~$52.6M ARR (Latka estimate). $157.7M valuation. Next-generation AI agents in development, integrated into core scenario builder. |

Note on conflicting revenue figures: Latka reports $52.6M ARR in 2025; Sacra reports $40M in 2023; TechCrunch reported $10M at 2020 acquisition. Direction is clear; exact figures vary by source. Sacra also references "$200M funding in 2021" — almost certainly Celonis internal capital allocation, not external investment.

---

## The Make Growth Playbook (Deconstructed)

Six discrete mechanisms drove Make's growth, in order of importance:

### 1. Product-Led, Sales-Led-Zero

At $10M ARR and acquisition, Make employed no dedicated salespeople. Growth was driven by:
- Generous free tier (1,000 operations vs. Zapier's 100 actions)
- Multi-step scenarios available free (Zapier required paid plan for multi-step)
- Customer-initiated migration from Zapier
- Content marketing and SEO compounding over years

The CEO of Celonis described Make as *"an enterprise version of Zapier,"* signaling that the wedge was at the power-user end of Zapier's market — users who hit Zapier's complexity ceiling and looked for alternatives.

### 2. Aggressive Price Undercut + Better Free Tier

Make's pricing has consistently undercut Zapier by 50-66%:

| Tier | Make | Zapier |
|---|---|---|
| Free | 1,000 ops/mo, multi-step OK | 100 actions/mo, single-step only |
| Core entry | $9/mo for 10,000 ops | $19.99/mo for 750 tasks |
| Price per operation | ~$0.0009 | ~$0.027 (~30x more expensive) |

The undercut was structural, not promotional. Make built more efficient infrastructure (single visual canvas, fewer SaaS dependencies on the build side) and passed the savings to users. This is a classic disruptive entry pattern: enter at lower price-point with technically superior feature set on a specific dimension (in this case, multi-step branching and visual composition).

### 3. Visual-First as Durable Differentiation

This is the single most important Make decision and the one most likely to translate to Tokenrip. Detailed analysis follows in Section "The Visual-First Wedge."

Headline data: Patrik Šimek's blog post on visual-first cites MIT research showing humans identify images in 13ms, processing shape, color, and relationships simultaneously. The visual canvas was not aesthetic polish — it was the durable moat. Zapier did not match Make's visual-first interface until **August 2023**, approximately nine years after Make established the pattern. By then, Make had brand, community, and 2M users.

### 4. Generous Free Tier With Usage Limits, Not Feature Walls

Make's free tier exposes nearly the full product surface — all visual canvas features, branching logic, routers, iterators, aggregators. The constraint is operation volume (usage), not capability access (features). This is meaningfully different from the SaaS norm of locking specific features behind paywalls.

The strategic logic: power users discover their needs by exploration. If you wall off the features they need to discover, they never form the attachment that drives conversion. If you wall off only volume, they form attachment first and pay for scale later.

### 5. Education + Community Layer (Post-Product-Gravity)

After Make reached approximately 250K users, they invested heavily in education and community infrastructure:
- **Make Academy:** 430,000 course enrollments by end of 2024 (3x YoY growth). 75,000 new learners enrolled in 2024 alone. 70,000 badges issued.
- **Make Community:** 30,000 members by end of 2024. 18,700 joined in the prior 12 months.
- **Waves Conference:** Annual in-person event in Munich (500 attendees in 2024).
- **Template Marketplace:** 7,000+ templates by 2025.

The sequencing matters. These ecosystem investments came AFTER product-led growth had compounded. Make did not bootstrap ecosystem first and hope product would catch up; they bootstrapped product, then built ecosystem on top of installed base.

### 6. Partner Ecosystem (Post-Acquisition)

After the Celonis acquisition gave Make enterprise distribution and capital, four partner programs were formalized:
- **Solution Partners** — consulting agencies that implement Make for clients
- **Technology Partners** — ISVs building public connectors on Make
- **Affiliate Program** — referral revenue share
- **Make for Startups** — discounted access for early-stage companies

Notably, the partner ecosystem did not drive Make's initial growth. It was a monetization and retention layer added once the user base justified it.

---

## What's Portable to Tokenrip

Five elements of Make's playbook translate directly to Tokenrip's current strategy. Confidence levels indicate whether the element is already in motion, partially in motion, or open opportunity.

### 1. Build-for-Self Dogfooding (✅ Already in motion)

Chief of Staff functions as Tokenrip's "Integromat" — a mounted agent built for the founders' own use, dogfooded daily, designed to be 10x better than ChatGPT-equivalent before public deployment. This mirrors Integromat's pre-launch quiet period almost exactly. Continue.

**Reference:** [[mounted-agent-synthesis]], `active/chief-of-staff-v0-2026-05-01.md`

### 2. Generous Free Tier on Usage, Not Features (✅ Aligned with current model)

Tokenrip's business model already orients around substrate composition tiers, not feature walls. Free operators get the full mounted-agent runtime; paid tiers gate scale and composition complexity. This is structurally aligned with the Make pattern. Refine pricing copy to emphasize "no feature walls, only scale tiers."

**Reference:** [[business-model]]

### 3. Power-User Features at Undercut Price (⚠️ Pricing not yet sharpened)

Make's wedge was complexity-at-low-price against Zapier's simplicity-at-high-price. Tokenrip's potential wedge is composition-at-low-price against Dust's enterprise-internal pricing and Lindy's per-seat model. Specific pricing comparisons against incumbents are not yet documented in vault. **Action:** sharpen the comparative pricing narrative in pitch materials.

### 4. Education-as-Community-Moat (⚠️ Series 3 is content, not yet Academy)

Make Academy at 430K enrollments is functioning as customer retention infrastructure. Tokenrip's Series 3 blog is currently positioned as category-establishment content for fundraising audiences (a16z, partners). It is not yet structured as an operator-onboarding curriculum. **Open question:** does Tokenrip need a "Mounted Agent Academy" structure parallel to the blog, designed for operators rather than analysts?

**Reference:** `content/plans/blog-series-3-mounted-agents-plan.md`

### 5. Visual-First as Durable Differentiation (🎯 Open opportunity — develop below)

This is the most valuable transferable lesson and the most underdeveloped in current Tokenrip strategy. Section "The Visual-First Wedge" develops this in depth.

---

## What's NOT Portable

Four elements of Make's playbook do not translate. Naming the disanalogies is as important as naming the analogies, because over-applying Make's pattern is a real risk in Tokenrip's current strategic posture.

### 1. Eight Years of Patient Bootstrapping

Make spent 8 years (2012-2020) bootstrapping to $10M ARR. They had no VC pressure, no fundraising calendar, no Demo Day. Tokenrip operates on a fundamentally different clock: YC application submitted, a16z to follow, Demo Day ~September 2026. The fundraising curve is the explicit substrate-density narrative.

**Implication:** the "calm over chaos" philosophy that Make's founders cite as core to their success is structurally unavailable to Tokenrip. Pretending otherwise leads to under-pressured execution. The substitute is *focus* — Motion E + D in parallel, no third active motion, ruthlessly defended.

### 2. Rode Existing Category Demand

When Integromat launched, Zapier had already spent years educating the market that "no-code integration platforms" existed. Make's growth came from people who already knew they wanted Zapier-equivalents and were searching for alternatives. They never had to do category education.

Tokenrip is creating a category. No one searches "mounted agent platform" the way someone searched "Zapier alternative" in 2014. Category education IS the primary job, not a side project.

**Implication:** content investment (Series 3, audience-led motion) is not optional polish; it is the primary acquisition channel, and it must precede product-led growth, not follow it.

### 3. Ecosystem Built AFTER 250K Product Users

Make Academy, Waves, partner programs, template marketplace — all built after Make had product gravity. The user base justified the ecosystem investment.

Motion E inverts this. Audience-led deployment treats ecosystem (creators publishing imprints) as the user acquisition channel itself. Make's playbook is silent on how to bootstrap this. Closer analogues are Substack (creator-led writing economy) and possibly Roblox (UGC-driven gaming platform).

**Implication:** do not look to Make for guidance on the creator distribution motion. Look to Substack's early creator-acquisition playbook and Roblox's early UGC-incentive structures. This is a gap in current vault knowledge.

### 4. No-VC-Pressure Was Their Moat

Patrik Šimek's interview is explicit: bootstrapping enabled the patient product philosophy that enabled the 10x product differentiation that enabled the durable competitive position. The structural absence of VC pressure was not a constraint — it was the moat.

Tokenrip has the opposite structure. The substrate-density curve must be visible to investors quarterly. This rules out the slow-cook approach to product perfection. The substitute discipline is *visible substrate-density milestones* — published artifacts, registered operators, lighthouse imprints — that demonstrate compounding momentum even in absence of revenue.

---

## The Visual-First Wedge: Where Make's Lesson Becomes Tokenrip's Differentiation

### Pattern Established by Make

Make Grid is the multi-dimensional workflow visualization that Make uses to render scenarios, data flows, and AI agents in a single visual canvas. Patrik Šimek's stated philosophy: *"seeing more is fundamental to knowing more and doing more."* He cites MIT research on 13ms image recognition and NYU research on visual working memory.

This was not aesthetic polish. Three observations support the moat thesis:

1. **Zapier could not match it for nine years.** Zapier launched visual-first features in August 2023. By then Make had brand, retention, and 2M users.

2. **Acquisition multiple correlated with it.** Celonis paid >$100M for a $10M ARR company — a 10x revenue multiple at a time when SaaS comparables were trading at 5-8x. The premium reflected the durable differentiation, not just the financials.

3. **Make's own positioning leans entirely on it.** Their April 2025 AI Agents launch positioned the visual canvas as the differentiator vs. chat-based agent platforms: *"agents are built, run, and debugged inside the same canvas as scenarios, so every decision is visible, reviewable, and controllable."*

### Where Make's Visual-First Ends

Make's visual layer is INTERNAL — it visualizes workflows for the **builder**. The output of a Make scenario is conventional: data lands in a Google Sheet, an email gets sent, a CRM record updates, a Slack message posts. The visual canvas is the construction site, not the building.

Every agent platform today has the same gap. ChatGPT, Claude.ai, Dust, Lindy, Sierra, and now Make AI Agents — operator UX is always a chat box. The output is always a message. The brand expression is always the platform's, never the creator's.

This is the opening for Tokenrip.

### The Opportunity: Custom Operator Interfaces Rendered on Artifacts

Tokenrip is architecturally 80% of the way to a primitive no competitor has: **custom interfaces deployed on top of artifacts.** Artifacts already exist as the platform's substrate primitive — they are versioned, addressable, composable, and published. The missing layer is creator-designed presentation rendering against artifact data.

The loop:

```
ARTIFACT (state + content, owned by mounted agent)
       ↓
CUSTOM INTERFACE (creator-designed presentation layer)
       ↓
OPERATOR EXPERIENCE (stable URL, brand-expressed, durable)
```

### Concrete Imprint Examples

| Imprint | Artifact schema | Custom interface |
|---|---|---|
| Morning brief (Chief of Staff) | `{date, priorities[], calendar[], news[]}` | Newspaper layout — hero priority, three columns, dateline |
| Sales pipeline view | `{deals[], stages[], next_actions[]}` | Kanban with drag-to-stage, cards show next action |
| Strategic dashboard | `{metrics{}, alerts[], commentary}` | Tufte-style sparkline grid + narrative panels |
| Weekly retro | `{wins[], losses[], lessons[], decisions[]}` | Magazine-style layout with pull quotes and grid |
| Reading queue | `{articles[], notes{}, tags[]}` | Reader app with rich typography, sidebar tags |
| Investor update | `{metrics, narrative, asks[]}` | Long-form letter format with embedded sparklines |

Each of these is a fundamentally different operator experience from "type a message, read a response." Each is brand-expressible. Each lives at a stable URL. Each updates as the underlying artifact updates.

### Why This Is a Wedge, Not Polish

**1. Operator UX is the missing brand surface for Motion E creators.**
A chat box has zero brand surface. A custom-rendered morning brief has 100% brand surface. Audience-led distribution requires creators to express brand on their imprints; without custom UI, every Tokenrip imprint looks like every other Tokenrip imprint, which defeats Motion E's premise.

**2. Output durability changes the category.**
Chat replies are ephemeral. A morning brief at a stable URL with custom presentation is a *product*, not a transcript. This is structurally analogous to Substack's leap over RSS — durable form replaced ephemeral feed and changed the economic structure of the medium.

**3. Competitors structurally cannot copy.**

| Competitor | Why they can't match custom interfaces on artifacts |
|---|---|
| ChatGPT | Single product surface. Their brand always wins. Custom creator UI would dilute OpenAI's product identity. |
| Claude.ai | Same constraint as ChatGPT. Artifacts feature is constrained to Anthropic's UX shell. |
| Dust | Enterprise-internal. Wrong distribution shape for creator-distributable presentation. |
| Lindy / Sierra | Vertical agent platforms. Custom UI is not their differentiation; they sell outcomes. |
| Lovable / Bolt / v0 | Build apps but no agent runtime underneath. Apps are dead frontends, not living artifact-bound surfaces. |
| Make / Zapier | Visual layer is for workflow construction, not operator output. Different primitive. |

No competitor combines (a) agent runtime + (b) artifact substrate + (c) creator-distributable presentation layer in one product. This combination is what makes the wedge structurally defensible.

**4. Direct mapping to substrate-density curve.**

Each custom interface is a published artifact. Each mounted imprint with custom UX is simultaneously:
- A substrate-density unit (KPI metric)
- A fundable lighthouse (a16z deck artifact)
- A creator distribution surface (Motion E pipeline)

One primitive hits three KPIs at once. This is rare in product roadmap economics.

### Why This Lesson Is Make's, Sharpened

Make's "10x better" anti-MVP took 4 years before going public. Tokenrip does not have 4 years. The forcing question:

> **What is the minimum-viable custom interface primitive that gets a Motion E hero excited enough to deploy?**

Cheapest path to demonstration:

| Phase | Timeline | Deliverable |
|---|---|---|
| Phase 0 | Now → 4 weeks | Hand-coded custom UI for Chief of Staff morning brief. Single imprint, no templating. Shows the world what's possible. |
| Phase 1 | 3-6 months | Templating primitive — creators write JSX/HTML/Svelte against an artifact schema, Tokenrip renders. 5-10 hero deploys. |
| Phase 2 | 6-12 months | AI-assisted interface generation. "Make me a dashboard for this artifact." Collapses the v0/Lovable wedge into Tokenrip's runtime. |

Phase 0 + Phase 1 is the artifact carried into a16z conversations. Make took 4 years to ship Make Grid. Tokenrip can ship the operator-UX equivalent in months because (a) artifact substrate already exists, and (b) the surface is smaller — output visualization, not workflow construction visualization.

---

## Recommendations

### 1. Reframe Make in Pitch Materials

Stop treating Make as the playbook-to-emulate. Treat them as the disintermediation target. Their April 2025 AI Agents launch puts them in Tokenrip's category. The sharper positioning:

> "Tokenrip is Make for the operator output layer — agent-native, creator-distributable. Make visualizes the workflow construction; we visualize what the agent produces."

This is tighter than "mounted agent substrate" and lands faster with investors who already understand Make.

**Reference:** Update [[external-positioning]], [[tokenrip-positioning]], and a16z deck angles document.

### 2. Ship One Custom Interface in 4 Weeks (P0)

Hand-coded is acceptable for v0. Chief of Staff morning brief is the obvious candidate — it is already the lighthouse imprint, the founders dogfood it, and a custom UI immediately demonstrates the wedge. Treat this as the demo artifact for both Motion E hero outreach and a16z conversations.

**Owner:** Simon (or first frontend hire if priority warrants pulling forward)
**Acceptance criteria:** stable URL, brand-distinct visual style, updates as underlying artifact updates, shareable to non-Tokenrip operators.

### 3. Add "Custom Interface Primitive" to P0 Substrate Roadmap

The current P0 substrate roadmap in `CLAUDE.md` lists creator dashboard, "build an agent" v1, and marketplace UX. Custom interfaces deserve equal weight. They are the differentiator competitors structurally cannot copy AND the primitive that makes Motion E heroes' imprints feel like products.

**Reference:** Update `bd/CLAUDE.md` prioritization hierarchy and substrate roadmap docs.

### 4. Write the Substack/Roblox Analogue Memo

Make's playbook is silent on bootstrapping ecosystem-as-acquisition-channel. The vault is currently missing deep case studies on platforms that succeeded with Tokenrip's distribution shape (creator-led, UGC-driven). Substack and Roblox are the candidates worth researching next.

**Suggested:** `intelligence/research/substack-creator-economy-playbook-2026-XX-XX.md` and `intelligence/research/roblox-ugc-incentive-structure-2026-XX-XX.md`.

### 5. Defend the Motion Discipline

Make's success was structurally enabled by no VC pressure. Tokenrip cannot replicate that. The substitute is motion focus — Motion E + D in parallel only, Motion A deprecated, Motion B passive. The risk Make's story illustrates is the temptation to slow down and perfect the product. That temptation must be resisted. The substrate-density curve has to be visible quarterly.

---

## Vault Connections

- [[mounted-agent-model]] — Tokenrip architecture. Custom interfaces fit into the five-layer model at the operator runtime layer.
- [[mounted-agent-synthesis]] — Positioning. Update to incorporate "operator output layer" framing.
- [[business-model]] — Monetization. Custom interface primitive could justify a new tier ("Pro" or "Creator") with premium templating access.
- [[distribution-strategy]] — Motion E mechanics. Custom interfaces are the brand-expression surface creators need.
- [[tokenrip-positioning]] — External narrative. Refine to incorporate Make-disintermediation framing.
- `bd/audience-led-gameplan.md` — Motion E execution. Custom interface primitive accelerates hero conversion.
- `bd/yc-strategy.md` — Fundraising narrative. Custom interfaces are the visible-progress artifact YC and a16z need to see.

---

## Open Questions

1. **Templating engine choice.** JSX/React, Svelte, web components, or proprietary DSL? Each has tradeoffs for creator accessibility vs. runtime control. Worth a separate technical design memo.

2. **Artifact schema standardization.** For custom interfaces to render reliably, artifacts need predictable schemas. Does Tokenrip impose schemas (constraining) or allow free-form (harder to template)?

3. **AI-assisted interface generation timing.** v0/Lovable/Bolt have proven the pattern. The question is whether Tokenrip's v1 should ship templating-first (creators write code) or AI-first (creators describe and AI generates). Strong argument for templating-first to anchor the primitive in real creator workflows before adding the AI generation layer.

4. **Pricing implication.** Should custom interfaces be a free-tier capability or a paid-tier upgrade? Make's lesson says "no feature walls, only usage walls" — but custom interfaces are arguably brand-expression infrastructure, which has historical precedent for being paid (Squarespace, Webflow templates).

5. **Substack/Roblox playbook research.** Named above as recommended next research. Should this be commissioned now or after the custom interface primitive ships?

---

## Recommended Next Steps

| Action | Owner | Timeline | Dependencies |
|---|---|---|---|
| Reframe Make in a16z deck | Simon | This week | None |
| Ship hand-coded custom UI for Chief of Staff | Simon | 4 weeks | Chief of Staff artifact schema stable |
| Add custom interface primitive to P0 roadmap | Simon | This week | Roadmap doc update |
| Commission Substack/Roblox research | Simon (delegate) | Next 4-6 weeks | Capacity for research time |
| Write technical design memo for templating engine | Simon (or first FE hire) | 6-8 weeks | After hand-coded v0 reveals constraints |

---

## Sources

### Primary (Make.com / Integromat)

- [TechCrunch: Celonis acquires Czech startup Integromat (Oct 14, 2020)](https://techcrunch.com/2020/10/14/celonis-acquires-czech-startup-integromat-to-accelerate-move-to-process-automation/)
- [CzechStartups.gov.cz interview with Ondřej Gazda and Patrik Šimek](https://czechstartups.gov.cz/en/novinky/interview-with-ondrej-gazda-and-patrik-simek-on-an-investment-that-resonates-with-the-startup-world-the-czech-company-integromat-was-acquired-by-the-german-firm-celonis-for-a-price-of-more-than-czk-2/)
- [Make blog: "Why Make builds visual-first" (Patrik Šimek)](https://www.make.com/en/blog/why-make-builds-visual-first)
- [Make blog: "How an obsession with product experience made Integromat a great integration platform"](https://www.make.com/en/blog/how-an-obsession-with-product-experience-made-integromat-a-great-integration-platform)
- [Make blog: 2024 automation wrap-up](https://www.make.com/en/blog/2024-automation-wrap-up)
- [Make blog: 2023 year in review](https://www.make.com/en/blog/2023-make-year-in-review)
- [Make AI Agents press release (April 2025)](https://www.make.com/en/make-ai-agents-press-release)

### Secondary (financial / competitive)

- [Sacra: Make.com financial analysis](https://sacra.com/c/make/)
- [Latka: Make revenue metrics ($52.6M ARR, $157.7M valuation)](https://getlatka.com/companies/make.com)
- [Crunchbase: Celonis acquires Integromat acquisition profile](https://www.crunchbase.com/acquisition/celonis-acquires-integromat-2--25939827)
- [Integrately: Make vs Zapier pricing comparison](https://integrately.com/blog/zapier-vs-make-pricing)
- [Cloudwards: Make vs Zapier 2026 comparison](https://www.cloudwards.net/integromat-vs-zapier/)

### Tangential / context

- [Make Partners directory and program overview](https://www.make.com/en/partners)
- [Tracxn: Make company profile](https://tracxn.com/d/companies/make/__goblLB6Svzom9RNvXuqdn_VrOTsml5MUXUV7RVMuzRE)

---

## Document Metadata

- **Created:** 2026-05-21
- **Research depth:** Deep dive (~2 hours external research + vault synthesis)
- **Vault context source:** Explore agent search covering bd/, product/tokenrip/, intelligence/, content/, distribution/, agents/
- **Confidence:** High on Make.com factual history (multiple corroborating sources). Medium on revenue figures (Latka vs. Sacra discrepancy). High on Tokenrip translation analysis (grounded in current vault strategy). Speculative on custom-interface primitive sizing and timeline (requires technical design work to validate).
- **Reviewers needed:** Simon (strategic implications + custom interface roadmap), Alek (technical feasibility of templating primitive)
