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

**Outcome**: [Evaluated early, 2026-05-18 — see next decision. Two clean kills: (1) LinkedIn cold outreach to insurance is structurally dead — buyers are inactive on the platform, not an effort problem; (2) Motion E confirmed vitamin (3-4 conversations, all low-urgency; a creator tried to invoice Tokenrip). The sprint did its job: first motion in five weeks to run long enough to produce a real verdict. Channel reallocated, not thesis.]

### Active-Demand Interception — Upwork + Job-Req Outreach as Primary Channel
**Date**: 2026-05-18
**Context**: The May 8 two-week discovery sprint produced verdicts ahead of the May 22 date. LinkedIn cold outreach to insurance returned a structural null result — Simon reviewed hundreds of prospects and could reach only a handful; insurance buyers are largely inactive on LinkedIn. Motion E returned 3-4 conversations, all confirmed vitamin-grade. Meanwhile Simon identified that channels where buyers *post and fund* work (Upwork, AI-agent job reqs) are painkiller-grade by construction — the buyer has already allocated budget and declared urgency.

**Options Considered**:
- Continue LinkedIn cold vertical discovery — rejected (channel structurally dead for the insurance buyer)
- Return to Motion E — rejected (confirmed vitamin)
- **Reallocate to active-demand interception (Upwork + job-req outreach)** — adopted

**Decision**:
- **Upwork bidding is the primary channel.** Target: 25 job-post submissions/week (5/day).
- **Direct outreach to companies posting AI-agent job reqs** — secondary channel. Baseline 2/day (10/week), calibrate up after starting.
- **LinkedIn continues but minimal.** Motion E on agent-assisted maintenance only.
- **No per-call architectural filter.** Take every conversation that fits the schedule — every conversation is signal. Filter on expected utility only once call volume becomes the constraint (not the case today). The architecture test becomes an *aggregate* read: across ~15 conversations, what fraction need memory/persistence/portability?
- **Build a demand-scout agent** (polls Upwork/job feeds/Reddit/X for agent-build requests, surfaces them ranked) — secondary goal, built after each day's bidding.
- **May 22**: repurposed from "comparison" to a verdict call — name the two kills on record, lock the channel mix, define the next 2-week test.

**Rationale**:
1. **This is channel reallocation, not thesis oscillation.** The thesis (find painkiller pain the substrate can serve; build the platform through engagements) is unchanged. A channel test returned a null result; capital moved. That is discovery working.
2. **Active-demand channels are painkiller-grade by construction.** A posted, funded job carries budget + urgency — the pain-proximity test is passed at the door.
3. **Revenue is the forcing function; conversations a close second.** Upwork is the fastest path to both.
4. **Consulting-trap concern is premature at zero volume.** Palantir took near-100%-custom engagements in the Foundry-genesis era. The trap is a problem of success/volume; filtering starts only when calls outpace capacity.

**Risks Yoda flagged:**
- Demand-scout agent build could displace the day's bidding (revenue work). Mitigated: Simon ranked it explicitly secondary.
- Architecture-fit must still be read in aggregate — if ~15/15 conversations are Zapier-grade, that is the market saying the mounted-agent wedge isn't in the Upwork population.

**Outcome**: [To be evaluated. Watch: conversations booked (5 = decent, 10 = stretch), revenue, and the aggregate architecture-fit ratio across early calls.]

**Captured in**: `DASHBOARD.md`, `agents/yoda/memory/sessions/2026-05-18.md`.

### Revenue Becomes the Primary KPI — "No Month Without Revenue"
**Date**: 2026-06-08
**Context**: First paid engagement landed (Stephanie/AICAP discovery, dollars in escrow). After 3+ years to first meaningful revenue, Simon declared: "From now on, we don't go another month without revenue." The prior KPI regime tracked leading indicators (conversations had, deals progressed) with revenue as a forcing function but no recurring gate.

**Options Considered**:
- Keep leading-indicator KPIs (conversations/deals progressed) with revenue as a loose forcing function — rejected (now that revenue exists, leading indicators are no longer the binding constraint)
- "We have revenue" as the bar — rejected (gameable by a single deal; one escrowed engagement doesn't make next month's revenue)
- **≥1 new revenue event per calendar month, trending to MRR** — adopted

**Decision**:
- **Primary KPI: ≥1 *new* revenue event every calendar month, trending toward MRR.** New = a new engagement closed *or* a recurring payment landed — not the same deal counted twice.
- June covered by Stephanie's escrow (pending release — escrow ≠ bank; confirm release triggers).
- Leading indicator stays: real buyer conversations (now EF brokers/lenders + Stephanie's return).
- The 90-day substrate-density North Star (`bd/kpis.md`) is unchanged but subordinate to the monthly revenue gate at this stage.

**Rationale**:
1. **First revenue inverts the optimization function** (parallel to the 2026-05-01 capital-assumption inversion). With a paid dollar on the board, the binding question shifts from "are we having the right conversations?" to "is revenue recurring and growing?"
2. **Un-gameable definition prevents one-deal complacency.** "A new revenue event per month" forces next month's revenue to be manufactured *this* month — making the KPI and the weekly ONE-thing the same arrow.
3. **Healthy revenue-as-forcing-function** (insights 5/8), not panic-driven: it produces customer proximity and pipeline discipline, not "anything for anyone who pays."

**Risks Yoda flagged:**
- A monthly-revenue gate can pull toward any revenue (one-off agency/consulting) over substrate-building revenue. At current scale this is *fine* per Simon's own rubric (near-zero filtering at zero/low revenue; filtering scales with revenue; hard-filter ~$1M ARR) — do NOT flag the consulting trap here (rule 4).
- Escrow ≠ received. June's revenue isn't real until the escrow releases.

**Outcome**: [To be evaluated monthly. July's revenue event is the first live test — candidates are Stephanie's MVP (on her return) and a non-Stauss EF buyer.]

**Captured in**: `agents/yoda/memory/sessions/2026-06-08.md`, `agents/yoda/context.md`, `agents/yoda/memory/goals.md`.

### EF: Go Direct on Outreach (Stauss → "Bonus"); Distribution Adopted as Explicit #2
**Date**: 2026-06-14
**Context**: Simon + Alek had committed (6/8) to a Stauss-independent EF motion. Instead they held off on their own broker outreach for a week to "see what Stauss turned up first." Stauss returned a doc and no meetings. Separately, Simon proposed elevating distribution ("build the loop / GTM systems," Distribution Engineer thesis) to a standing #2 priority.

**Decision**:
- **EF outreach goes direct, now.** Alek + Simon hit phones + LinkedIn off Alek's drafted list. Stauss demoted to "any action from him is a bonus" — no longer a gating dependency.
- **Distribution is adopted as priority #2, behind booking sales** — but **capped, time-boxed, and measured by conversations engaged, not systems shipped (Trap #5).** It cannot consume the founder-hours the EF buyer-voice needs. Framing held: *right now distribution ≈ the sale.*
- **Upwork → genuinely maintenance** (it drifted to "hard" this week and must step back behind EF).

**Rationale**:
1. The week proved the 6/8 diagnosis: Stauss is an unreliable dependency. A week of a two-week revenue window was spent waiting on a doc + no meetings.
2. The independent-buyer-voice has been the unresolved ONE thing for ~3 weeks; it's gated on dials the founders control, not on a partner's follow-through.
3. Distribution is real and on-thesis (Make.com pattern, Goal 10d) but premature as a primary investment at one escrowed dollar + zero validated substrate pull — keep it second and conversation-measured.

**Risks Yoda flagged:**
- Distribution-systems work absorbing the EF hours (system-building's newest costume — insights 6/14). Mitigation: hard cap + conversations-not-artifacts metric.
- The re-coupling could recur — any future "wait for Stauss / a warm intro" before doing direct outreach is the avoidance tell.

**Outcome**: [To be evaluated next session. Watch: dials made, ≥1 non-Stauss budget-holder pain conversation, and whether the week's time finally matched the stated ranking.]

**Captured in**: `agents/yoda/memory/sessions/2026-06-14.md`, `agents/yoda/context.md`, `agents/yoda/memory/goals.md`.

---

*Full historical decisions log archived in `__ARCHIVE/yoda-decisions-log.md`*
