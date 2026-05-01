# Chief of Staff Launch — Strategy + Architecture Design Brief

**Date**: 2026-04-27
**Status**: Working doc — strategic framing + architecture starting point
**Origin**: Bean session 2026-04-27 (pressure-test of v1/v2 marketplace plan)
**Related docs**:
- `product/tokenrip/mounted-agent-model.md` — the architecture this finally instantiates
- Tokenrip asset `s/16831d36-592f-4317-9a5f-dd505d60469f` — Alek's agent-swarm v2 launch plan
- `agents/bean/ideas/chief-of-staff-agent.md` — Bean's compressed idea file
- `agents/bean/sessions/2026-04-27.md` — Bean's session note

---

## Purpose of This Document

Two roles:

1. **Architecture starting point.** Captures the product shape, must-have features, design questions, and 14-day build scope so an architecture/implementation pass can begin.
2. **Decision capture for revisiting.** Records *all the angles explored*, including the rejected paths, with the reasoning behind each rejection. The decisions made today depend on assumptions that may shift. When a tangent becomes worth revisiting, this doc should make it possible to re-enter the alternative without re-running the full session.

Read sections 1-3 for the locked decisions. Read sections 4-9 for the full design space. Read sections 10-12 for execution.

---

## 1. The Locked Decisions (TL;DR)

**The bet**: Path C, hero + lure (β).
- **Hero**: Chief of Staff (Yoda-class agent). Substance. Validates infrastructure differentiation.
- **Lure**: One persona — Garry Tan most likely, given the YC application timing (May 4-7) won't repeat. Distribution wedge.

**Naming**: "Chief of Staff" as the role/category. "Yoda" stays as the agent's name for now (to revisit). "Friday Review" possibly used as the headline ritual/feature.

**Specialization**: Broad operator framing, not narrowed to "for solo founders." Stays approachable.

**Resource posture**: Mostly all-in for 14 days.
- Intelligence Engine paused.
- AgentMail follow-up is autonomous (encoded as an agent).
- Other distribution work continues in parallel.
- Simon: heads-down on substance/engineering. Alek: comms/content/outreach.

**Validation horizon**: 14-day sprint ships *substance*, not validation. Day 14 measures "did we ship + did anyone notice." **Day 56 (~6-8 weeks) is when stickiness data arrives** — that's the real Path C validation point.

**Kill criteria** (Day 14):
- Substance didn't ship → kill.
- 0 dogfooders by Day 14 → CoS positioning is wrong.
- Lure thread <3K impressions → persona-as-lure thesis fails for current audience.

**Cuts** (from Alek's v2 plan):
- Twitter @-tag pipeline (defer to week 3+ if v1 lands)
- Tier 2/3 personas (PG, Naval, Karpathy, Solomon, VC Decoder — all defer)
- Yoda-as-separate-listing (Yoda IS the hero)
- Bounty board
- "Agents Apply to YC" stunt (overlaps with Garry Tan persona)
- "Replaced cofounder" stunt
- 20-creator outreach push (drop to 10 hand-picked)

---

## 2. Why Path C, Hero + Lure (Decision Reasoning)

The session opened with three live options for how to validate Tokenrip's differentiation:

| Path | Description | Trade-off |
|------|-------------|-----------|
| **A** | Run Alek's v2 plan as written. Distribution wedge first (persona platform), infrastructure proof later. | Speed to signal. Doesn't validate the actual thesis (#3, see Section 4). |
| **B** | Drop persona play. Ship one heavy-infrastructure agent that exists nowhere else. Point at it. | Cleanest #3 proof. Slowest. Risks zero distribution signal. |
| **C** | Persona is marketing, infrastructure is substance. Each persona engineered to use real Tokenrip differentiators (shared memory, portability, composition). The persona is the wedge; the infrastructure is the moat. | Harder synthesis. Same agents do double duty. |

**Path C chosen** because: pure-virality (A) and pure-substance (B) each leave half the bet unrun. C runs both.

Then Path C resolved into three sub-options for *how* to deploy hero and persona:

| Sub-option | Description |
|------------|-------------|
| **α (Hero-only)** | Yoda hero. No persona. Slow distribution, no viral hook, validation in weeks. |
| **β (Hero + lure)** | Yoda is the substance. One persona is the front door that drives traffic. Hero/lure framing inverted from v2. |
| **γ (Two-track parallel)** | Hero + multiple personas, measured separately on different timelines. |

**β chosen** because: γ over-extends bandwidth; α has no distribution mechanism for an audience of 11 Twitter followers.

---

## 3. Why Chief of Staff Is the Hero (Decision Reasoning)

The session generated and ranked Yoda-class candidates against Path C criteria:

| Candidate | Demo strength | Shared-layer value | Cohort reach | Crowded? | Existing assets |
|-----------|---------------|--------------------|--------------|----------|----------------|
| **Business coach** (vanilla Yoda) | Medium | Medium-High | Founders, broad | ChatGPT default behavior | Yoda exists |
| **Writing partner with voice memory** | High (paste samples → edits in your voice) | High | Writers (huge) | Yes (Lex, Sudowrite, Grammarly) | Blog skill loop |
| **Founder accountability partner** ("Weekly Review Yoda") | High (review artifact) | High (phase-specific slippage patterns) | Founders | **No — underserved** | Yoda foundation |
| **Thinking partner** (Bean-class) | Medium | Medium | Strategists (small) | Niche but real | Bean exists |
| **Learning coach** | Medium | High | Students (huge but distant from Simon's channel) | Some (Khanmigo) | None |
| **Operator's daily companion** | Low (vague) | Medium | Operators | Crowded by note apps | Yoda foundation |

**Founder accountability partner won the structural ranking** — sharpest demo, underserved category, memory-is-the-feature alignment, ritual lock-in (Friday cadence), generalizes to a family of agents.

**But "Founder Accountability Partner" failed the marketing test** — therapy-adjacent, deficit-framed, foreign to most users. Renamed to **"Chief of Staff"** because:
- Aspirational not deficit (Bezos has one; you can too)
- Job description matches exactly (track commitments, run cadence, surface patterns, ask hard questions)
- Shared-layer pitch becomes free ("your CoS has worked with 240 founders")
- Different shelf than "AI coach" — empty room vs. crowded category
- Marketing slogans on tap

Runner-up: **Writing Partner with Voice Memory**. Strong but crowded category. Defer to agent #2 (week 3-5) once Chief of Staff architecture is proven.

---

## 4. The Four Experiments — Framing Tool

The original Alek/Simon transcript conflated four different things under "agent marketplace experiment." This framing was the inflection point of the session and should be preserved as a decision-making tool for future agents we ship.

| If the goal is... | The right first agent looks like... | Success metric |
|-------------------|--------------------------------------|----------------|
| **#1 Demand validation** ("does anyone want this?") | A genuinely useful agent. Doesn't matter if it's gimmicky. | Repeat usage |
| **#2 Distribution wedge** ("can we drive sign-ups?") | Maximally viral hook. Garry Tan clone. Shareable transcripts. | Sign-ups, traffic |
| **#3 Differentiation proof** ("does our infra produce a better agent?") | Memory-heavy, repeated-usage agent. Morning brief, journal coach, Chief of Staff. | Day-7 retention, sessions/user |
| **#4 Supply-side validation** ("will creators put their agents here?") | Doesn't matter what we build. The experiment is outreach. | Creator sign-ups, agents listed |

**These need different first agents, different landing pages, different metrics.**

- Garry Tan office hours is great for #2, terrible for #3 (one-and-done usage; pitches don't compound).
- A morning brief is great for #3, terrible for #2 (no virality, "another morning brief tool").
- A creator outreach campaign is decoupled from both.

**The session committed to #3 as the primary experiment.** Garry Tan persona ships in parallel as a #2 wedge that drives traffic to the #3 hero, but #3 is what's being *validated*.

**Future use of this framing**: when proposing any new agent, ask "which experiment does this run?" before scoping it. Mixing experiments with one agent produces ambiguous data.

---

## 5. Landscape — What Already Exists

Three flavors of "agent marketplace," all weaker than what Path C is reaching for. Captured so we know what we're differentiating against.

### Type 1: Prompt engines (closest analogs)

| Product | What it is | Memory/state | Notes |
|---------|-----------|--------------|-------|
| **agent.ai** (Dharmesh Shah) | Parameterized prompts wrapped in UI; occasional tool call. ~500K users. Branded "professional AI." | None across sessions | The closest comparable. Structurally shallow. Cannot build shared memory or portable agents — would need to re-architect. |
| **Poe** (Quora) | Bot marketplace. Stateless prompt → response. | None | Same shape as agent.ai. |
| **OpenAI GPT Store / Custom GPTs** | System prompt + occasional tool. Toy memory recently added. | Per-user, shallow | Same shape. ChatGPT memory is per-user, cannot do collective intelligence layer. |

### Type 2: Crypto agent tokens

| Product | What it is | Notes |
|---------|-----------|-------|
| **Virtuals GAME** | Tokenized agent contracts. ~18K agents per intel. | Mostly trading/social bots. Different beast — financial primitives, not knowledge work. Cooling per recent intel (silent 60 days). |
| **ElizaOS marketplace** | Agent framework + tokenized access | Crypto-native. Trading/social bots primarily. |

### Type 3: Builder template stores

| Product | What it is | Notes |
|---------|-----------|-------|
| **CrewAI templates / LangChain** | Code/configs for builders | Builder problem, not user problem |
| **Hugging Face Spaces** | Model demos | Closer to model showcasing than agents |

### Type 4: Emerging direct competitors (from Alek's v2 research)

| Product | Status | Notes |
|---------|--------|-------|
| **Agensi (agensi.io)** | Launched April 21, 2026 (6 days before this session). 200+ skills, 40 creators, 7K WAU, real Stripe revenue. | **The generic-skills-marketplace lane is closed.** Agensi has shipped it. Walking into it head-on would be suicide. We don't compete here. |
| **Anthropic Connectors Marketplace + Skills** | Live | First-party store. Counter-positioning per HN: vendor lock vs. cross-agent independent. |
| **Anthropic Project Deal** | Pilot, gated, $4K GMV, 69 employees | 12+ month window before public. |
| **MCP Memory Server** | Free reference implementation | "Persistent memory" is becoming table stakes — moat is shared-layer + portability, not memory alone. |

### The actual gap

**No consumer-facing marketplace where the agent is imprint + memory + tools — a stateful, evolving entity that lives somewhere and can be invoked from multiple places.** That's a structural architectural hole, not just a "we'd build it better" hole.

This gap is real, but the differentiator is *invisible at the moment of choice* (someone landing on a tile sees the same tile as agent.ai). The differentiator manifests in session 5+, not session 1. This is why we need the persona lure — to drive the first-touch traffic — and why we need session 5+ to actually happen (the stickiness validation horizon).

---

## 6. Differentiation Thesis — Strong Points and Cracks

### Where the thesis is strong

**1. Inversion of economics is invisible but real.** agent.ai pays for every token. Heavy users destroy their margins. Tokenrip welcomes power users — the more they hammer the agent, the more data accrues. That dynamic doesn't exist anywhere else in the consumer agent market.

**2. Memory + shared memory unlocks UX nobody else can ship.** Office hours today loads yesterday's session, references what other founders asked. agent.ai *cannot build this* — not in their architecture. They'd need a state layer, a permission model, and a memory ownership scheme. They'd need to become Tokenrip.

**3. Tokenrip-hosted agents are portable, not destination-trapped.** The agents tab is one surface; the same agent runs in Claude Code, in a CLI, embedded in a morning brief script, called by another agent. agent.ai is a walled garden. Tokenrip agents are infrastructure. **Different product shape entirely.**

### Where the thesis breaks (or could)

**1. The differentiator is invisible at the moment of choice.** Discovery is the hard part. When someone lands on the agents tab, they see a tile. They don't see "persistent memory" or "shared knowledge layer." Memory advantage manifests in session 5, not session 1. Retention differentiator doesn't help acquisition — and acquisition is the starving problem.

**2. Shared memory is a cold-start trap.** Activates with volume. Same chicken-and-egg as the asset graph — distribution must be solved first or the moat doesn't exist.

**3. "Memory" is being commoditized as a feature.** OpenAI shipped memory. Anthropic shipped Projects. Custom GPTs will get memory. If the differentiator is *the feature memory*, the moat is 18 months wide and closing. **If the differentiator is the architecture (separable imprint/memory/harness, BYO model, tool-as-API surface, composable agents), the moat is structural.** Be careful which one we sell.

**4. agent.ai-class users may not want what we're selling.** A consumer who lands on agent.ai wants a one-shot answer. They don't want to learn what an agent is, manage memory, or care about portability. The Tokenrip differentiator is for *operators* — repeated users who care about state. That's a smaller, deeper market. Pretending it's the same TAM as agent.ai is wrong.

---

## 7. The Hero Product — Chief of Staff (Spec)

### Job-to-be-done

**Make invisible founder/operator patterns visible** — both for the user (their own slippage, blindspots, pattern repetition) and for the cohort (collective phase-specific patterns).

The agent does what a real Chief of Staff does:
- Tracks commitments (what you said you'd do)
- Runs the weekly cadence (Friday Review)
- Surfaces patterns the principal is too close to see
- Asks the hard questions
- Compares to phase-peers (anonymized, via the shared knowledge layer)

### Five must-have features for v1

1. **Intake flow** — 5-10 minutes of structured questions that build personal context (business, goals, current commitments, working style). This IS the differentiator at first contact. Don't skimp.
   - Hard-coded starters: name, what they want a CoS for (fintech, agency, coaching business, etc.)
   - Then dynamic: model generates next questions based on context built so far
   - Open exit: "anything else you think I should know about?" — let users go as deep as they want
   - Output: persistent personal context written to Tokenrip
2. **Personal memory** — Tokenrip-persisted state of commitments, decisions, patterns. Survives sessions and surfaces.
3. **Friday Review** — flagship ritual. Structured prompt: what did you commit to last week, what got done, what slipped, why, what's next. Produces a shareable artifact (a Tokenrip asset).
4. **Yoda's voice** — direct, pressure-tests, no fluff. Port verbatim from existing Yoda. Adapt to remove Simon-specific operational context.
5. **Shared knowledge layer v0** — concrete, visible manifestation. Each session contributes one anonymized pattern to a public `founder-patterns` collection. Browsable. Future Yoda sessions reference it. **Non-negotiable for v1** — without it, we're just shipping memory, which is being commoditized. With it, we have the screenshot that says "no one else can do this."

### Bootstrap strategy

- Knowledge layer seeded from Simon's existing Yoda session history
- Patterns extrapolated to bootstrap before live users arrive
- Manual curation in week 1; automatic contribution from sessions in week 2+

### The high-leverage open design question

**How does Yoda visibly USE the shared collection in a Friday Review?**

If the patterns are silent background context, the differentiator is invisible. If Yoda explicitly cites them — "based on patterns from 12 founders in your phase, the slip you're describing usually traces to X" — the differentiator is in every screenshot.

**Make the shared layer's surfacing deliberate and visible in prompt design.** Path C money shot. Design intentionally, not as side effect.

### Other open design questions

- **Intake flow length** — friction-vs-context-quality sweet spot? Risk: long → drop-off; short → weak personalization.
- **Surface design for shared layer** — sidebar, in-prompt, in-artifact? How does Yoda choose patterns to surface? Consent model for contributing patterns?
- **Friday Review artifact format** — markdown asset, structured collection row, both?
- **Cold-start patterns** — minimum dogfooder cohort that produces meaningful pattern signal? 5? 10? 50?
- **Agent name** — stay "Yoda" publicly, or rebrand? Yoda is *Simon's*. Platform version may need its own name.
- **Pricing** — v1 free? Paid tier from day one? Upgrade trigger?

---

## 8. The Lure — Garry Tan Persona (Spec)

### Why Garry Tan specifically

The YC application deadline is May 4-7. Window won't repeat. Of the v2 personas, Garry has the highest viral-timing fit. Path C lens still applies — every persona must use *some* genuine infrastructure differentiator, even if shallow.

### Path C re-ranking of v2's persona lineup

| Agent | Path C strength | IP risk | Repeat use | Viral hook |
|-------|----------------|---------|------------|------------|
| **Diligence "Solomon"** | High | None | High | Medium |
| **VC Rejection Decoder** | High | None | Medium | High (screenshot loop) |
| **Slop Filter "The Editor"** | High | None | High | Medium |
| **PG Essay persona** | High | Low | Medium | High |
| **Garry Tan SOUL.md** | Medium | **High** | Low (one-shot pitches) | Highest (YC timing) |
| **Yoda** | Low (context-locked) | None | Built-in but personal | Low |

By Path C purity, **Solomon or Editor would be the better personas to lead with.** Garry Tan was chosen anyway because of the YC timing wave — a tactical decision that won't repeat.

**This trade-off is worth flagging for revisiting.** If the YC wave doesn't materialize or Garry Tan IP becomes a problem, Solomon (original character, no IP, recurring use case) is the structurally cleaner persona to lead with.

### Must-have for v1

1. The persona itself — SOUL.md grounding, voice, optional Twitter handle
2. **Asset URL as canonical handle** (tokenrip.com/s/[uuid]) — Twitter is amplification, not infrastructure
3. **One genuine Path C touch** — even if shallow. Suggestion: every conversation contributes anonymized pitch patterns to a `pitch-patterns` collection. After the wave, real artifact: "we ran 200 YC pitches through it; here's what Garry actually flags." That artifact is week-3 content.

### Twitter dependency — flagged risk

The v2 plan built the entire distribution flywheel on @-mentions. **Twitter becomes lock-in surface for a moat that should be Tokenrip-native.** Mitigation: asset URL canonical, Twitter amplification only.

If the lure ONLY works via Twitter, distribution is built on rented land. Worth revisiting non-Twitter distribution mechanisms once v1 is live.

---

## 9. Alternatives Explored — Reasoning for Not Choosing (For Future Revisit)

Recording these so they can be re-entered without re-running the analysis.

### 9.1 Hero candidates not chosen

**Writing Partner with Voice Memory** (runner-up)
- Strong demo (paste samples → edits in your voice)
- High shared-layer value
- Big cohort
- **Why deferred**: crowded category (Lex, Sudowrite, Grammarly, Granola, every text editor with AI). Differentiator is real but visually similar to existing options. Composes cleanly with Editor persona, so likely agent #2.
- **Revisit when**: CoS architecture is proven. Bigger cohort, faster ship since same architecture pattern.

**Thinking Partner (Bean-class)**
- Already exists in vault as Bean
- **Why not v1**: niche cohort (strategists, founders doing whiteboard work). Lower stickiness than CoS (sessions are sporadic, not weekly).
- **Revisit when**: a content-marketing angle for "how I think with my agent" emerges, or when targeting writers/researchers specifically.

**Learning Coach**
- Big cohort (students, self-learners, professionals)
- Genuine shared-layer value (pedagogical patterns)
- **Why not v1**: Simon's reachable audience is operators/founders, not students. Cohort distance from Tokenrip's current network is too large.
- **Revisit when**: the Tokenrip user base broadens beyond founders, or when content/SEO targeting students becomes feasible.

**Operator's Daily Companion** (broader Yoda)
- "Knows your projects, decisions, references"
- **Why not v1**: too vague. Crowded by note-taking apps (Mem.ai, Notion AI, Granola). Lacks the sharp demo of CoS.
- **Revisit when**: never, unless reframed with a specific ritual (CoS already does this).

**Negotiation Coach / Career Coach / Decision Coach**
- **Why not v1**: usage cadence is too slow (decisions are infrequent). Memory matters but doesn't compound enough to differentiate.
- **Revisit when**: sub-vertical where decisions are recurring (e.g., sales coach with weekly call review).

**Therapy/Journaling/Reflection Coach**
- Highest stickiness in human coaching
- **Why not v1**: IP/legal exposure, ethical concerns, depressing market dynamics (Replika).
- **Revisit when**: never, unless explicitly partnered with a clinical practice. Risk-reward is wrong.

**Personal "Second Brain" Knowledge Engine**
- "Your context becomes a portable artifact other agents can query"
- **Why not v1**: too abstract for a v1; hard to demo. Right Phase 2 thing — once multiple agents exist, the second-brain layer becomes the connective tissue.
- **Revisit when**: 3+ agents are live and users ask "how do I share my context across them?"

### 9.2 Persona candidates deferred from v2

**Solomon (Diligence Agent)** — original character, recurring use case (diligence is repeated), shared layer genuinely useful (pattern library across queries), built-in lead-gen angle (free for first 100 YC W26 queries). **Strongest pure-Path-C persona.** Revisit as agent #2 or #3 lure.

**VC Rejection Decoder** — original character, viral hook (founders screenshot decoded rejections), built-in repeat use. Revisit as a follow-on persona.

**Slop Filter "The Editor"** — original character, very high Path C fit. Composes with Writing Partner hero. Revisit when Writing Partner ships.

**PG Essay Persona** — low IP risk (essays public, prior art exists with paul-graham-gpt). Strong viral hook. Revisit as agent #2 lure.

**Naval, Karpathy** — defer, validate persona-as-lure thesis with Garry Tan first.

### 9.3 Distribution mechanisms cut from v2

**Twitter @-tag reply-guy pipeline** — too engineering-heavy for v1. Defer to week 3+ if v1 lands. Revisit when there's at least one persona generating consistent demand for replies.

**Bounty Board** — distraction. Revisit when there's an established creator base that wants to build on Tokenrip.

**Agent-as-Newsletter** — interesting angle, but defer until we know what content the agents produce.

**"Agents Apply to YC" stunt** — overlaps with Garry Tan persona; pick one. Garry Tan earns Path C rent (creates artifact); stunt doesn't (one-shot dopamine).

**"I Replaced My Cofounder With an Agent" stunt** — one-shot dud, doesn't compound.

**"Last Agent Standing" tournament** — slower-burn but heavy production cost. Revisit if persona platform takes off and there are 16 viable personas.

### 9.4 Killed in v2 that might be wrong

**Morning Brief** — v2 killed it ("1pt, 0 comments on HN"). This was likely the wrong signal. HN doesn't engage with utility tools; it engages with hot takes and architecture posts. Morning brief was the only candidate that genuinely exercised heavy memory + state. **It became Chief of Staff in spirit** — same cohort (operators), same memory-matters argument, but with a sharper role-name. Don't revisit "morning brief" as a separate product; CoS is morning brief done right.

---

## 10. The 14-Day Sequencing

### Week 1 (Apr 28 – May 4) — Build substance

| Day | Hero (Simon) | Lure (Simon, parallel) | Other (Alek) |
|-----|------|------|-------|
| Mon-Tue | Extract Yoda imprint → publishable form. Design intake flow. | — | Draft long-form thread #1 in advance. Curate Tier-1 outreach list (10 names hand-picked). Draft Garry Tan persona. |
| Wed | Ship intake + personal memory persistence on Tokenrip. | — | (Continued) |
| Thu | Ship shared knowledge layer v0 (`founder-patterns` collection, seeded from Simon's data). | Build Garry Tan persona (smaller scope). | Finalize thread + outreach list. |
| Fri | **Publish Chief of Staff on tokenrip.com/agents.** Simon runs his own first Friday Review — screenshot becomes Sat content. | **Publish Garry Tan persona** (timed to YC deadline May 4-7). | — |
| Sat-Sun | — | **Garry Tan thread goes live**. Tag @garrytan + @paulg. Long-form, shows actual conversation artifact. | Coordinate launch comms. |

### Week 2 (May 5 – May 11) — Distribution + dogfooding

| Day | Action |
|-----|--------|
| Mon | **Long-form thread #1: "I built an AI Chief of Staff. Here's why it's not a Custom GPT."** Documents the build, shows artifacts, names the differentiator. |
| Tue | 10 Tier-1 outreaches sent. Filtered hard for fit (operators/founders, not generic creators). |
| Wed-Thu | Onboard 5 dogfooders (Alek, Simon's warm network, 2-3 from outreach replies). They start the intake. |
| Fri | **Friday Review #2** — Simon's, but now shareable as "week 2 of using my own CoS." Patterns starting to appear in shared collection. |
| Sat-Sun | First creator call(s) if any landed. Iterate on intake based on dogfooder friction. |

### Week 3-8 (May 12 – Jun 22) — The stickiness validation arc

This is when the actual Path C thesis gets validated. v2's Day 14 metrics don't cover this; build it explicitly.

- **Week 3-4**: "Watch it get smarter" thread series. Show how the shared collection grew. Show how a Friday Review in week 4 references patterns that didn't exist in week 1.
- **Week 5-6**: Ship agent #2 (likely **Writing Partner with voice memory** — composes with the Editor persona idea, bigger cohort, same architecture pattern, faster ship).
- **Week 7-8**: Stickiness signal — are dogfooders running Friday Reviews unprompted? Do they invite others? Are they paying yet? **This is when you actually know if Path C works.**

---

## 11. Metrics — Calibrated for This Shape

v2's metrics measured a viral-distribution sprint. Recalibrate honestly given baseline (Simon: 11 Twitter followers).

### Day 14 — sprint exit metrics

**Hero (Chief of Staff):**
- Shipped on agents tab — binary
- Onboarded dogfooders — ≥5
- Friday Review artifacts produced (anyone's) — ≥3
- Shared `founder-patterns` collection — ≥10 entries
- Long-form thread published — binary
- Tier-1 creator replies — ≥3 (out of 10 sent; 30% hit rate is the real bar)
- **Calls scheduled — ≥2** (this is the actual signal, not "replies")

**Lure (Garry Tan):**
- Shipped — binary
- YC-thread impressions — ≥20K (honest given 11-follower start; v2's 50K was fantasy)
- External mentions of Tokenrip in any thread — ≥3
- Sessions run on the persona — ≥30
- Pitch patterns collected — ≥30 (becomes week-3 content)

### Day 14 — kill criteria

- Hero didn't ship → kill the sprint, restart sequencing
- Hero shipped, 0 dogfooders → CoS positioning is wrong, rethink job-to-be-done
- Lure shipped, YC thread <3K impressions → persona-as-lure thesis fails for current audience; revisit non-Twitter distribution

### Day 56 — stickiness validation metrics (the real ones)

- Dogfooders running Friday Reviews unprompted (4+ weeks of history) — ≥3
- Pattern collection has surfaced patterns NOT contributed by current users — yes (this is the moment shared layer becomes visible value)
- At least one dogfooder has invited another user — yes
- Anyone has expressed willingness to pay — yes (signal, not requirement)
- Day-7 retention on the agent — measurable

If 2+ of these miss at Day 56, the Path C / Yoda-as-platform thesis doesn't hold for this cohort. Pivot or rebuild.

---

## 12. Deferred Risks — Decide Before They Become Real-Time Problems

### Garry Tan IP exposure
If the persona works, expect a polite warning in 60-90 days. **Decide now**:
- (a) Kill on first warning — accept the loss
- (b) Rename to fully-fictional character that retains the voice — partial preservation
- (c) Defend on fair-use / framework grounds — fight it

Not deciding now means deciding in real time when a tweet is going viral. Worst possible time.

### Twitter platform dependency
Lure currently routes through Twitter. Rate limits, bans, API price hikes are existential. **Mitigations to consider**:
- Asset URL is canonical handle, Twitter is amplification (already in spec)
- Build email-list capture from agent landing pages
- Test asset-only distribution mechanisms in parallel

### IP exposure for future personas
Karpathy didn't open-source his teaching style. PG didn't license his essays (though paul-graham-gpt exists with no action). Naval hasn't authorized derivatives. **Decide which personas are willing-to-lose-on vs. willing-to-fight-for** before shipping each one.

### Cohort reach for CoS
Founders is narrow. If the warm network of 10 Tier-1 outreaches yields <2 calls, the cohort access problem is bigger than the product problem. Plan B: broaden to "operators" framing (ops people, indie hackers, agency owners) — bigger cohort, looser job-to-be-done, but more reach.

### Intake friction risk
Long intake → high drop-off. Short intake → weak personalization. The right design is iterative — ship a long version, instrument drop-off, shorten where users abandon. Plan for this in week 2.

---

## 13. Tangent Paths Worth Revisiting Later

Captured here so they don't get lost.

1. **Yoda-as-shared-business-coach** — anonymized strategic patterns across all users. Was a brief tangent; the architecture supports it but v1 starts with personal-memory-only and adds shared-layer in v0 form. Bigger version revisit at Day 56+.

2. **The "build an agent" skill** — original 2026-04-25 mounted agent doc proposed it. Defer until the architecture pattern is proven via 2-3 hand-built agents. Then turn it into the "deploy your own CoS-class agent" skill.

3. **Inter-agent tool exposure** — agents calling each other through Tokenrip. Phase 2 architecture. Revisit when there are 5+ agents and natural composition use cases emerge.

4. **Tiered tooling pricing model** (free / pro / enterprise from mounted agent doc) — revisit once tooling surface is richer (semantic search, webhooks, scheduled ops). v1 is free for everyone.

5. **Layered memory ownership model** — shared knowledge + private context. v0 is bootstrapped manually; v1 implements layered model. Revisit when production patterns force the design choice (probably week 4-6).

6. **Working with creators who already have audiences** — Simon's instinct in the transcript. Defer until v1 ships and there's a working agent to point at. Once "here's the CoS we built" is real, the offer to creators ("turn your work into an agent on this") becomes credible. Currently premature.

7. **Slop filter as standalone product vs. integrated into Editor persona** — multiple framings live. The Editor persona absorbs the slop filter functionality. If a standalone "slop filter" use case emerges (e.g., publishers wanting batch slop scoring), revisit.

8. **Agent marketplace as a tab vs. as the platform** — v2 framed agents tab as the primary surface. Path C suggests the *agent itself* is the surface, not the marketplace. Tokenrip's homepage may not need an "agents tab" — it may need agent landing pages with the marketplace as a directory side-product. Revisit when designing tokenrip.com/agents URL structure.

---

## 14. Architecture Design Starting Points

(For the next pass — when this transitions from strategy doc to architecture doc.)

### Core entities to design

1. **Agent definition** — imprint (instructions, persona rules, methodology), schema for inputs/outputs, memory layer references, tooling capabilities
2. **User context** — per-user persistent state. How is it scoped? What's the schema? How does it survive across surfaces?
3. **Session** — a unit of interaction. Linked to user context, contributes to personal memory, optionally contributes to shared layer
4. **Shared collection** (e.g., `founder-patterns`) — schema for entries, contribution rules, surfacing rules (how does Yoda choose which to cite?)
5. **Friday Review artifact** — Tokenrip asset. Schema/template. Sharing rules.
6. **Intake flow** — sequence of question/answer pairs. State transitions. Output transformation (turn answers into context).

### Key technical decisions ahead

- Where does the imprint live? (Tokenrip asset — versioned, fetchable. Same as engagement agent pattern.)
- Where does personal memory live? (Tokenrip collection? Per-user asset? Hybrid?)
- How is the shared layer accessed during a session? (Pre-loaded, pulled on demand, semantic search?)
- How is agent invocation handled? (CLI bootloader pattern from engagement agent, generalized?)
- Web UI for the agent — what's the minimum? (Asset URL, Friday Review preview, intake flow?)
- Authentication and per-user state isolation
- Anonymization of shared-layer contributions — explicit consent, automatic, hybrid?

### Suggested architecture exploration prompt

When this doc is used to seed architecture work, the prompt should be roughly:

> Design the technical architecture for shipping the Chief of Staff agent v1 per the spec in section 7. Use existing Tokenrip primitives where possible. Cover: agent definition format, user context persistence, session lifecycle, shared collection design, intake flow state machine, Friday Review artifact, web UI minimum, invocation paths (web, CLI, API). Identify what new platform capabilities are required vs. what works with current primitives. Output an architecture doc that an implementer could start from.

---

*Working doc. Update as decisions evolve. Move to permanent location (likely `product/tokenrip/`) once v1 ships and the architecture stabilizes.*
