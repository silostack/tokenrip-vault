# Creator-Agent Marketplace

**Status**: raw
**Created**: 2026-05-10
**Last touched**: 2026-05-10

## Thesis

Creators who publish step-by-step blueprints (crypto strategies, SEO workflows, trading frameworks) are sitting on agent products they don't know they have. Moa guides the creator through a structured session to convert a specific blueprint into a mounted agent imprint — including a dashboard artifact the creator designs — that their audience can mount and pay for. The creator ships a complete product (workflow logic + dashboard UI + tool declarations) in an afternoon without building a SaaS. Revenue model: per-imprint subscription paid by operators, Tokenrip takes 20%. This is the Motion E play with a sharper blade — lead with a specific blueprint the creator already published, not abstract "deploy your expertise."

## Evolution

- **2026-05-10**: Originated from two triggers: CodeWords.ai raising (agent builder that hosts agents, not creator-owned products) and Miles Deutscher-style blueprint tweets (20-step processes audiences try to follow manually). Explored two independent angles: (1) blueprint-to-agent conversion pipeline via moa, and (2) dashboard-as-artifact where the creator designs the UI their operators see. The angles connect naturally — workflow agents need a face, and the dashboard is what turns an agent into a product for the less technical end of the audience.

## Key Challenges Surfaced

- **Workflow vs. methodology agent distinction.** Moa needs to know which shape it's building. A 20-step crypto blueprint converts to a workflow agent (run this sequence). "How I think about portfolio construction" converts to a methodology agent (persistent, accumulates context). Starting with workflow — more tangible, easier to validate, cleaner conversion from existing blueprint content.
- **Creator pins tools in v1.** The creator's workflow IS their tool choices (Binance, Ahrefs, etc.). Operator brings credentials, not tool preferences. Defers the entire dependency injection / tool resolution layer. Simplifies architecture significantly.
- **Dashboard quality ceiling.** Mid-tier dashboard (interactive charts, filterable views, 10-second polling on Tokenrip collections) is achievable without new infrastructure. Real-time updates and write-back controls would require new infra. Mid is good enough to validate.
- **Revenue per unit is low.** Per-imprint subscription at $10-50/mo means Tokenrip's cut per creator is $200-3,000/mo. Compensated by volume (many creators, each bringing their own distribution) and speed (days-to-weeks sales cycle vs. months for firm-direct).

## Open Questions

- Does a real creator light up when they see their blueprint running as an agent? First signal to find.
- What's the minimum moa capability needed to convert a blueprint? Does moa need dashboard-building ability for the first test, or can the first test run without dashboard?
- What take rate is defensible? 20% is between Substack (10%) and App Store (30%). Tokenrip provides more infrastructure than Substack (collections, dashboard hosting, agent runtime surface).
- How fast does "mount an agent" move from power-user to mainstream? The dashboard artifact helps (feels like buying an app, not running a terminal command) but the operator still needs API keys and a model.
- Which vertical first? Crypto has highest-pull (most technical audience, highest willingness to pay, cleanest workflow shape). AI/automation has highest creator supply but lowest willingness to pay (audience builds it themselves).

## Non-Obvious Connections

- **This is Motion E with a concrete pitch.** "Let me turn that specific tweet thread into an agent your audience pays for" is more tangible than "deploy your expertise as an imprint." Same target, better blade. Could reshape how Motion E outreach is done.
- **Dashboard artifact is what makes agents into products.** Without dashboard, mounting an agent is a power-user terminal experience. With dashboard, it feels like buying an app. The dashboard is the packaging that widens the addressable audience within each creator's following.
- **Moa session extracts tacit knowledge.** The blueprint captures ~30% of what the creator actually does. Moa's structured interview extracts the other 70% — edge cases, decision logic, implicit context. The creator gets a better understanding of their own methodology as a byproduct. Dual value prop that makes the session worth it even if zero operators mount.
- **Creator-as-distributor eliminates Tokenrip's distribution problem.** Each creator brings their own audience. Tokenrip doesn't source operators. Creators do. Tokenrip's job is to source creators and make moa great. Same shape as Substack — the platform doesn't find readers, writers do.
- **Marketplace economics, not SaaS economics.** This makes Tokenrip look more like Substack (take rate on GMV) than AWS (infrastructure fees). Different investor story. "Substack for AI agents" is more legible than "substrate for mounted agents." Whether this is the whole product or one application of the substrate is an open positioning question — let it be answered by what creators actually want.
- **The first test doesn't need the dashboard.** The first signal is: does a creator light up when they see their blueprint running as an agent? Dashboard is the thing that makes it a product, but the conversion excitement validates before dashboard exists.
