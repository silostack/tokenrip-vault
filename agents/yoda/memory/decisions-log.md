# Decisions Log

*Key decisions Simon has made, with rationale. Yoda logs these for future reference.*

## Decision Template

```
### [Decision Title]
**Date**: YYYY-MM-DD
**Context**: What situation prompted this decision?
**Options Considered**: What alternatives were on the table?
**Decision**: What did Simon decide?
**Rationale**: Why this choice over others?
**Outcome**: [Updated later] What happened as a result?
```

---

## Decisions

### Option B — AI Company Pivot
**Date**: 2026-04-13
**Context**: Fourth dependency failure in crypto (Dakota SWIFT, Lulo, Drift, Dakota Pakistan). Agentic ecosystem having its moment. Tokenrip prototype deployed. Builder energy high.
**Decision**: RebelFi is an AI company. Crypto moves to maintenance (separate vault). Full focus on Tokenrip.
**Rationale**: (1) Four dependency failures make crypto execution hostile. (2) Agentic ecosystem is once-in-a-lifetime. (3) Tokenrip is code Simon controls. (4) Decision was already made internally — naming it "freed up space."
**Outcome**: [Ongoing — measuring by product shipped, adoption, conviction durability]

### Distribution-First Focus
**Date**: 2026-04-27
**Context**: Platform is feature-complete for current needs. ~10 blog posts live. Both search engines indexing. Intelligence Engine on hold.
**Decision**: Only build what enables dogfooding or distribution/PLG. No new infrastructure unless it directly drives adoption.
**Rationale**: The product works. It needs users, not features. Competitive window is 6-12 months before Anthropic (Cowork), OpenAI (Canvas), Google make in-tool sharing good enough.
**Outcome**: [Ongoing — measuring by registry listings, user signups, warm lead engagement]

### BD Strategic Pivot — Firm-Direct Deprecated, Audience-Led Primary
**Date**: 2026-05-01
**Context**: Bean session pressure-tested the firm-direct motion against three alternatives Simon brought (mounted-agents-direct, multiplayer marketplace, sticking with firm pilots). Underlying fear: *am I selling the wrong thing?* Surfaced that (1) the TaxDome 2026-04-29 call had validated Motion B (vendor substrate), not Motion A (firm-direct), but the gameplan didn't absorb it; (2) firm-direct fails the architectural-requirement test (a regular SaaS could ship a $25K vertical pilot — none of mounted-agent's load-bearing properties are required); (3) firm-direct is structurally hostile to Motion B (firm pilots look like the wedge-and-replace pattern Ilya named); (4) capital-assumption (YC application in days, a16z to follow) inverts the optimization function from "survive and validate" to "demonstrate category and produce a curve" — flat-dot $25K pilots don't produce fundraising curves.

**Options Considered**:
- Stay with Motion A (firm-direct) — rejected (fails arch test, poisons B, flat-dot economics)
- Activate Motion B (vendor substrate) immediately — rejected (substrate not enterprise-ready, no lighthouse cases, 6-12 month sales cycles, founder-time-expensive)
- Lead with Motion C (inter-agent marketplace) — rejected (no buyers in 2026, requires substrate density first)
- Motion D (builder-direct) primary — partially adopted (parallel feeder via Series 3 blog, not primary)
- Motion E (audience-led creator deployment) primary — **adopted**

**Decision**:
- **Motion E (audience-led creator deployment) is primary.** Mid-tier (50k-500k audience) creators publish personal-brand imprints; their audience mounts in their preferred runtime; audience pays inference; creator collects on tooling-tier upgrades.
- **Motion D (builder-direct) runs in parallel as feeder.** Series 3 blog is the funnel.
- **Motion B deferred to 2027** (passive job-board monitoring of vertical SaaS vendors hiring AI engineers).
- **Motion C is the eventual vision E + D enable.** Not a near-term commercial motion.
- **Motion A deprecated** but preserved in `bd/firm-direct-strategy/` for reference.
- Simon's time reallocates from demo-build + firm sales to lighthouse outreach + recruiting + content + investor narrative.
- Hiring sources start NOW even pre-capital (frontend/UX, devrel, partnerships).

**Rationale**:
1. **Architectural-requirement test:** every layer of mounted-agent architecture is load-bearing for a creator-with-audience imprint (portability, versioned imprint, shared memory, BYO economics, observability). Other motions either fail the test or are commercially premature.
2. **Mid-tier creator barbell over hero-only.** Pool of accessible, incentive-aligned mid-tier creators is hundreds deep; hit rate 20-40% vs. <5% for hero-tier. Hero serves as marketing artifact; mid-tier produces substrate density.
3. **Substrate-density curves > flat-dot pilots for fundraising.** Five $25K logos is a snapshot; 25 published imprints with 15% WoW operator growth projects into a category.
4. **Robustness to YC outcome.** Even without capital, audience-led is the right motion — firm-direct $25K pilots aren't a fundable path anyway.
5. **TaxDome call validation pointed at Motion B, not A.** The "missed pitch" in `bd/learnings/taxdome-call-learnings-2026-04-29.md` was a vendor-substrate pitch — but vendor substrate is premature in 2026. Motion E builds the lighthouse cases and density that make Motion B viable in 2027.

**Outcome**: [Ongoing — measured weekly via [[bd/kpis]] phase-evolving primary KPI: pipeline (weeks 1-4) → deploys + operators (weeks 5-8) → growth + conversion (weeks 9-12). Decision points week 4, 8, 12 with continue / diagnose / reset criteria. Primary failure mode to watch: reverting to firm-direct framing under revenue pressure.]

**Captured in**: `bd/CLAUDE.md`, `bd/motions-and-strategy.md`, `bd/audience-led-gameplan.md`, `bd/yc-strategy.md`, `bd/operations-and-hiring.md`, `bd/kpis.md`, `agents/bean/sessions/2026-05-01.md`, `agents/bean/ideas/audience-led-deployment.md`.

### Two-Week Portfolio Rebalance — Vertical Discovery + Motion E Maintenance
**Date**: 2026-05-08
**Context**: Both co-founders independently felt that Motion E (audience-led) and Motion D (builder-direct) are vitamin motions, not painkillers. Simon's day of GitHub skill-creator outreach confirmed Motion D is low-urgency (most skill creators don't care about monetization). Alek's Motion E outreach produced 1 booked call (which is actually a vertical discovery call), 1 Twitter demo that confirmed vitamin-grade interest, and scattered responses with nothing materializing. A mock YC roast flagged no revenue after 3 months. Both founders converged independently on wanting to pursue vertical firms with real workflow pain. Alek proposed: "let's not use Claude for strategy" and "just discovery, discovery, discovery."

Simon named the core insight: **pain vs. vitamin is a dimension missing from the motion analysis.** The architectural-requirement test asks whether the architecture is load-bearing; it doesn't ask whether the buyer is in enough pain to act. Motion E passes the architecture test and may fail the urgency test. Motion A fails the architecture test but passes the urgency test.

**Options Considered**:
- Full formal pivot back to Motion A (firm-direct vertical agents) — rejected by Yoda challenge (three pivots in three weeks destroys execution; this is Motion A in different clothes; same B-poisoning risk)
- Stay the course on Motion E/D unchanged — rejected by Simon (vitamin-grade urgency doesn't produce revenue; revenue is the forcing function)
- **Two-week portfolio rebalance with comparison deadline** — adopted

**Decision**:
- **Not a formal pivot.** Framed as a time-boxed test with a hard comparison date.
- **Simon**: 75% vertical discovery via Sales Navigator, 25% Motion E maintenance (outreach from existing 200-creator list). Takes over Motion E from Alek at maintenance level.
- **Alek**: 100% LinkedIn vertical discovery via Sales Navigator. Shifts entirely from Motion E to vertical outreach. This is his area of expertise.
- **Segments**: Tax + real estate confirmed; 2 additional TBD (Simon and Alek take 2 each).
- **Maha (GTM playbook skill creator)**: Email sent. Key Motion E data point — her response urgency is a test of whether Motion E can produce painkiller-grade signal.
- **Hard comparison date: May 22.** Both pipelines compared. Whoever has more traction gets both founders.
- **Architectural filter on discovery calls**: pain must map to Tokenrip's architecture (memory, persistence, portability, BYO economics). If any AI shop could solve it with Zapier + GPT, it's consulting revenue, not product research.

**Kill/continue criteria at May 22:**
- Vertical succeeds: 3+ qualified discovery calls, ≥1 firm with architectural-grade pain, ≥1 deal-shaped conversation
- Vertical fails: 200+ connects with <3 calls, or pain is generic with no architectural fit
- Motion E signal: Maha response urgency, booked-call conversion, any prospect following up daily (painkiller) vs. weekly (vitamin)

**Rationale**:
1. **Pain proximity as a missing analytical dimension.** The architectural-requirement test and the pain-proximity test are both necessary. Motion E passes architecture, unclear on pain. Motion A passes pain, fails architecture. The test is whether vertical discovery surfaces pain that ALSO maps to the architecture.
2. **Revenue as forcing function.** Simon self-diagnosed: "I'm an engineer, I gravitate toward building. I need a forcing function toward revenue." Revenue pressure is legitimate and healthy when it produces focus rather than panic.
3. **Not a formal pivot prevents oscillation damage.** Three pivots in three weeks = no execution data from any motion. Time-boxing preserves the option to return to Motion E with data rather than killing it based on one week of a different motion's experiment.
4. **Co-founder convergence is signal.** Both founders independently arrived at the same conclusion. Same pattern as Apr 27 when Alek convinced himself through operating — independent convergence is stronger signal than persuasion.

**Risks Yoda flagged:**
- Motion E is functionally dead with both founders on Sales Navigator. If it "fails" at May 22, the failure was under-investment, not market signal.
- "Outreach is autopilot" is a rationalization. 25% Motion E = pipeline maintenance, not a real test. Don't claim Motion E was tested.
- If vertical discovery produces pain that doesn't require the architecture, taking the money is survival but not company-building. Filter matters.
- Strategy oscillation: this is the third direction change in three weeks. Even if each change is locally rational, the cumulative cost is real.

**Outcome**: [To be evaluated May 22. Compare vertical discovery pipeline vs. Motion E pipeline. Key question: did vertical discovery surface architectural-grade pain, or generic "we want AI" interest?]

---

*Full historical decisions log archived in `__ARCHIVE/yoda-decisions-log.md`*
