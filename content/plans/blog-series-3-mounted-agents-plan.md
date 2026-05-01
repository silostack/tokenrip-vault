# Blog Series 3: Mounted Agents

## Context

Series 1 named the alignment problem and proposed skills as packages. Series 2 named the SaaS trap and proposed operations as primitives. Both series proved that *parts* of the agent stack belong on a shared substrate (skills, then operations).

Series 3 closes the arc: when imprint, memory, and harness are all separated, the agent itself becomes a portable artifact. This is the *category* play — naming "mounted agents" before anyone else does, anchoring the vocabulary ("imprint", "harness", "BYO model", "cloud agents" as the contrast term), and capturing SEO around terms that don't yet have a Wikipedia entry, an a16z deck, or cloud-AI marketing copy.

Source material is locked: `product/tokenrip/mounted-agent-model.md` (architecture) and `product/tokenrip/mounted-agent-synthesis.md` (positioning). The synthesis names three frames in order — architecture → economics → outcomes — and that ordering shapes the series.

The craft post has a real subject: the Chief of Staff agent (`active/chief-of-staff-launch-design-2026-04-27.md`) is in a 14-day build sprint (Apr 28 – May 11) and is explicitly described as "the first imprint shipping this model." By the time Post 12 ships, it will have soaked through real use.

**Why six posts and not four.** Series 1 and 2 each shipped four posts because they had two thesis ideas plus a craft and a synthesis. Series 3 is a category-creation series with five distinct thesis surfaces — problem, architecture, economics, contract, moats — each anchoring a different keyword cluster. Compressing them into four posts loses SEO surface and bundles arguments that should breathe independently. Six posts is the right shape for the territory.

**Strategic priorities driving this series:**
1. **Category capture.** Own the term "mounted agents" before any competitor or analyst names it.
2. **Vocabulary anchoring.** Lock "imprint", "harness", and "BYO model" as terms readers reach for.
3. **Wedge into regulated industries.** Open imprint + audit log = the only AI architecture that can credibly serve legal, medical, and financial buyers. This is a market segment, not a feature.
4. **Tee up Series 4.** Inter-agent tool composition, agent marketplace, "build an agent" skill — all logical follow-ups once the category is named.

## Series Arc

```
#9  The Cloud Agent Ceiling (thesis)         → name the problem cloud AI can't escape
#10 Mounted Agents (thesis)                  → claim the category, name the architecture
#11 Your Model, Your Bill (thesis)           → the economics flip
#12 How We Built Chief of Staff (craft)      → working proof of the model
#13 The Imprint Is a Contract (thesis)       → versioned cognition for regulated buyers
#14 The Imprint Isn't the Moat (thesis)      → what actually compounds
```

**Standalone-completeness rule.** Every post earns its keep alone. A reader who lands cold from search gets (a) a problem named in their language, (b) a payoff they can use Monday morning — diagnostic, checklist, framework, or question to ask — and (c) optional links forward to the rest of the series. No post ends with a tease. The series accumulates through reinforcement, not dependency.

Same shape as Series 1 and 2 in spirit (problem → category → … → craft → capstone), extended with two additional thesis posts (economics and contract) that each anchor an independent keyword cluster.

## Connection to Prior Series

| Series 1 | Series 2 | Series 3 | Progression |
|----------|----------|----------|-------------|
| Post 1: Alignment Problem | Post 5: SaaS Trap | Post 9: Cloud Agent Ceiling | Different layers of the same trap (drift → friction → ceiling) |
| Post 2: Skills as Packages | Post 6: Shared Agents | Post 10: Mounted Agents | Skills → agents → category |
| — | — | Post 11: Your Model, Your Bill | New economic argument enabled by the architecture |
| Post 3: Self-Updating Skills | Post 7: Agent CRM | Post 12: Chief of Staff | Built a skill → built a CRM → built a deployable agent |
| — | — | Post 13: The Imprint Is a Contract | New market wedge enabled by the architecture |
| Post 4: Collaboration Layer | Post 8: Operations as Primitives | Post 14: Imprint Isn't the Moat | What collaboration → operations → cognition reveal |

The arc compounds. Series 1 separated *instructions*. Series 2 separated *operations*. Series 3 separates *the agent itself*.

---

## Post 9: The Ceiling on Cloud Agents

**Type:** Thesis
**Slug:** `cloud-agent-ceiling`
**Angle:** Cloud agents — Custom GPTs, Claude Projects, Salesforce Agentforce, the AI layer of every SaaS — share a structural ceiling that nobody is naming. Their capability is bounded by what the vendor can afford to compute per query, their behavior drifts as the underlying model changes, and they evaporate when the company that built them shuts them down. This post gives the reader a diagnostic for evaluating any cloud agent before betting on it. The fix is teased at the end and named in Post 10.

**Hook:** Your Custom GPT can't reason for thirty steps. Not because GPT can't — because OpenAI can't afford to let it. Cloud AI products run inside an inference budget you don't see, and that budget propagates into the answer you get. Aggressive context truncation, single-shot reasoning, terse output: these aren't design choices. They're cost structures dressed up as UX.

**Body sections:**
1. **The hidden ceiling on cloud reasoning.** Every cloud AI product caps reasoning at "what we can serve at our price point." This shows up as truncated context, clipped reasoning chains, and silent model downgrades. The user thinks the agent isn't capable. The agent is capable — the operator just can't afford to let it reason. Structural limit, not a feature gap.
2. **Cloud agents drift, and you can't tell when.** The same prompt, three months apart, returns different output. The model changed. The system prompt got tightened. Temperature shifted. There's no version, no diff, no way to say "talk to this agent as it was last Tuesday." Casual use, fine. Regulated decisions — legal review, medical triage, financial compliance — unusable.
3. **Cloud agents die when their company does.** Custom GPTs evaporate the day OpenAI deprecates the API. Salesforce Einstein lives until Salesforce decides it doesn't. Every cloud agent is a session-grade product masquerading as a relationship-grade one. Buyers are betting on the host being around in three years. The economics make this bet bad.
4. **Three questions to ask any cloud agent vendor before you bet on it.** Standalone payoff. The reader leaves with procurement language they can use immediately:
   - *What model, exactly, am I talking to today — and how will I know when it changes?* (Capability disclosure. If the answer is "we don't disclose model versions," the ceiling is already lowered without your knowledge.)
   - *Can I reproduce a decision this agent made six months from now?* (Drift / versioning. If the answer is "no" or "not exactly," the agent is unauditable by definition — fine for ideation, fatal for compliance.)
   - *If your company shuts this product down, what do I get to keep?* (Lifespan / portability. If the answer is "nothing portable," the agent is a session-grade product priced like a relationship-grade one.)

   Each "no" is a structural ceiling, not a missing feature. The vendor cannot solve it without rearchitecting the product. Close the post with one line pointing forward: *There's a different shape coming — one where the answers are yes, yes, yes. We name it in the next post.*

**Tokenrip mention:** Don't name it. Don't name "mounted agents" yet. Pure problem framing + diagnostic payoff. Let the reader feel the ceiling, leave with procurement questions, and recognize the shape of what's missing.

**Sources needed:**
- Public reporting on inference costs at OpenAI, Anthropic, Google
- Custom GPT shutdown notices, Salesforce Einstein/Agentforce roadmap shifts
- Industry signals about regulated buyers blocking AI adoption (legal, medical, financial)
- Community signals around "Custom GPT got worse" or "ChatGPT changed underneath me"
- Anthropic / OpenAI pricing pages as evidence for unit-economic constraints
- Examples of cloud-AI vendor lock-in (Jasper templates, Character.ai chats, deprecated Custom GPTs) — used as concrete answers to the "what do I get to keep" question

**Keywords:** cloud AI agents, cloud agent limitations, Custom GPT limitations, AI agent capability ceiling, cloud agent drift, cloud agent shutdown, AI inference economics, evaluating cloud AI vendors

---

## Post 10: Mounted Agents

**Type:** Thesis
**Slug:** `mounted-agents`
**Angle:** Every existing agent fuses three layers — cognition (instructions, methodology), context (memory, history), and execution (model, runtime). End the session, lose two of them. Switch tools, lose all three. *Mounted agents pull the layers apart.* Cognition lives on a shared substrate. Memory lives on a shared substrate. Execution lives on the user's machine. The agent isn't *on* a server — it's mounted *into* a runtime, the way a filesystem is mounted into an OS.

**Hook:** When you talk to your Custom GPT, three things are happening at once: you're loading instructions, accumulating memory, and running inference — all on OpenAI's machines, in a session that owns all three. End the chat, you lose the memory. Switch to Claude, you lose the instructions. Shut down OpenAI, you lose the agent. Every cloud agent works this way. *Mounted agents fix it with a single architectural move: separate the layers and let each live where it belongs.*

**Body sections:**
1. **The three layers every agent fuses.** Cognition (the imprint — instructions, skills, methodology). Context (memory — accumulated history, relationships, learned preferences). Execution (the harness — model, runtime, local environment). Today these are bundled inside a single session. Mounted agents pull them apart.
2. **What "mount" means.** A filesystem is mounted into an operating system. A container is mounted into a host. A skill, in Series 2, was mounted into an agent. Now: an *agent* is mounted into a harness. The imprint and memory live on a shared substrate. The user's harness — Claude Code, Cursor, ChatGPT, MCP-enabled apps — pulls them in at runtime. Same agent, any compatible harness.
3. **The decomposition produces the consequences.** The architecture isn't the only thing that's new. Three deep consequences flow directly from it: the user pays for inference (Post 11), the imprint is a versioned contract (Post 13), and the moat shifts to memory and tools (Post 14). Tease each.
4. **Why nobody else can do this.** Cloud-agent platforms can't decouple — their business model depends on bundling all three layers. Local agent frameworks (CrewAI, LangGraph, AutoGen) decouple inside one session but lose everything when the session ends. Mounted agents need a shared substrate that hosts cognition without hosting execution — and that's a category that didn't exist until now.
5. **Where does each layer of *your* agent live?** Standalone payoff. A self-assessment the reader can run on whatever they're using or building right now. Three questions:
   - *Cognition:* are your agent's instructions in a place you can version, share, and reuse — or are they trapped in a vendor's textbox?
   - *Memory:* when the session ends, what survives? Where does it survive? Who can read it?
   - *Execution:* who pays for inference, and who decides when the model gets downgraded?

   If two of three answers point to the same vendor, you're running a fused agent. The questions tell the reader what to fix and in what order — and what to look for in any agent platform they're considering.

**Tokenrip mention:** Name it once. "We publish imprints as Tokenrip assets and memory as Tokenrip collections — the substrate runs on us, the inference runs on the user." Vocabulary anchor: "imprint", "harness", "mounted" used precisely throughout. Reserve "asset" / "collection" for the single Tokenrip-mention sentence.

**Sources needed:**
- The mounted-agent-model.md architecture (primary source)
- The mounted-agent-synthesis.md framing (positioning)
- Cloud-agent reference points (Custom GPT, Claude Projects, Agentforce) for contrast
- Filesystem / container "mount" semantics from systems engineering as analogy
- Series 1 Post 2 (Skills as Packages) and Series 2 Post 6 (Shared Agents) as the staircase that led here

**Keywords:** mounted agents, agent imprint, BYO LLM agents, portable AI agents, open agent architecture, agent harness, decoupled AI agents

---

## Post 11: Your Model, Your Bill

**Type:** Thesis
**Slug:** `byo-model-mounted-agents`
**Angle:** The AI industry has a unit-economics problem that's killing startups: inference costs scale linearly with users, and margins compress at scale. Every cloud-AI company solves it the same way — degrade the experience to control cost. Mounted agents flip the model. The user pays for inference. The builder pays for storage. The capability ceiling lifts because the user is paying anyway. Token efficiency becomes a competitive feature instead of a hidden cost lever. Model price drops become free upgrades to every shipped agent. This isn't a pricing tweak — it's the cleanest economic structure the AI industry has seen.

**Hook:** Every AI company has a hidden incentive: make the agent as bad as you can get away with. Truncate context, skip steps, downgrade models. Inference is a margin destroyer at scale, and the user pays the cost in degraded experience without ever seeing the bill. Move the inference to the user, and the incentive flips overnight. The builder is now incentivized to make the agent *as capable as possible*, because better answers don't cost the builder anything — they cost the user, who is paying happily because the answer is worth it.

**Body sections:**
1. **The AI unit-economics problem.** Cloud AI margins compress as users scale. The industry's quiet response: feature-gate aggressive caching as "performance," cap context windows as "best practices," silently downgrade Opus to Sonnet to Haiku as "optimization." The user can't see any of this. The cost discipline propagates into the product as quality decay.
2. **The BYO inversion.** The user runs the model. The builder hosts the imprint and memory. The user's marginal cost goes up with usage; the builder's marginal cost is roughly flat. Margin pressure goes to zero. Capability ceiling lifts because the user is paying anyway — a 50-step reasoning chain costs the user $0.40 instead of the builder bankrupting themselves. Walk the cost structure side-by-side.
3. **Token efficiency as a competitive feature.** When the user pays per token, a bloated imprint is a tax the user feels directly. Lean imprints win head-to-head. Quality and economy point in the same direction for the first time in AI. This is a market dynamic — competition naturally produces leaner, smarter agents instead of bloated ones.
4. **Deflation becomes a free upgrade.** When Anthropic cuts Opus pricing in half, cloud-agent companies face a pricing fight (users expect lower prices to follow lower costs). Mounted agents inherit the cut as a free upgrade — same imprint, cheaper inference, no pricing decision to make. Every model price drop makes mounted-agent products more powerful overnight, without anyone shipping anything.
5. **What gets unlocked at the long tail.** SaaS economics need *N* users to break even on inference. Mounted agents work for one user. A consultant deploys a methodology imprint for a single client; a researcher deploys an analysis imprint for their own workflow; a legal team deploys a precedent-search imprint for ten partners. None of these clear the SaaS economic bar. All clear the mounted-agent bar trivially. New market shelf: *single-user and small-team agents that cloud AI can't profitably serve.*
6. **How to spot a margin-trap AI product.** Standalone payoff. Three signals that an AI product's economics are working against the user — and why each is structural, not fixable with feature work:
   - *"We've optimized for performance" = aggressive caching that returns stale or shared answers.* If the same prompt comes back faster the second time, you're being served a cache. Caching is a cost lever priced as a feature.
   - *"Best practices recommend shorter context" = a context window cap dressed as advice.* The vendor is rationing the resource you're paying for. Watch for context limits that drop without notice.
   - *"We continuously optimize the underlying model" = silent downgrades.* Opus → Sonnet → Haiku, no announcement, no pricing change. The agent gets dumber. The bill stays the same.

   Each one is a margin lever the vendor has to pull as they scale. The mounted-agent shape removes the lever entirely. The reader leaves with three questions to ask of any AI product priced as a flat subscription.

**Tokenrip mention:** Don't name it directly — economics arguments are stronger when they don't read as vendor pitches. Hint with the substrate framing ("a platform that hosts the imprint but not the inference"). Lets the reader connect the architecture from Post 10 to the economics here.

**Sources needed:**
- Public information on AI company margins (Jasper, Copy.ai, Character.ai post-mortems where available)
- OpenAI / Anthropic / Google pricing tables and recent cuts
- The Anthropic post on Opus pricing reductions (if recent enough)
- Industry analyst writing on AI SaaS unit economics (a16z, Tomasz Tunguz, etc.)
- Concrete cost calculations: 50-step reasoning chain at Opus pricing

**Keywords:** BYO LLM, BYO model AI, AI unit economics, AI inference costs, AI agent pricing, AI margin compression, long-tail AI agents

---

## Post 12: How We Built Chief of Staff as a Mounted Agent

**Type:** Craft / Workflow
**Slug:** `building-a-mounted-agent`
**Angle:** Step-by-step walkthrough of building Chief of Staff — the first agent shipped on the mounted model. The imprint published as versioned assets. Memory architected as shared knowledge + private context. The harness in Claude Code, but the agent is portable to any harness. The build reveals what's actually different about mounted agents: the *imprint* is small, the *memory* is the product, and shipping is publishing.

**Hook:** We built an agent that doesn't live on our servers. We don't run inference for it. We don't host its memory in a way the user can't see. The agent's whole brain is published — six versioned assets and two memory collections. Anyone with a Claude Code install and credentials can mount it in two minutes. We've been running it for two weeks, and the part that surprised us isn't the architecture — it's how small the imprint actually has to be.

**Cold-reader intro (one paragraph after the hook):** A reader who lands here from search may not know the term "mounted agent." Open with one paragraph that pays them off in plain language: a mounted agent separates an agent's instructions, its memory, and the model that runs it — instructions and memory live on a shared platform, the model runs on the user's machine. No server holds the whole agent. Same agent, any compatible runtime. *That's what we built. Here's how.* One sentence link back to Post 10 for readers who want the full architecture argument.

**Body sections:**
1. **The requirement.** Build a Chief of Staff: an agent that runs Friday Reviews, holds organizational context, learns operator preferences, and works for multiple operators across machines. Traditional answer: stand up a SaaS, run inference, build a dashboard, host memory in a database the user can't inspect. Mounted answer: publish six imprint assets, provision two collection types, write a thin bootloader.
2. **The architecture.** Show the three layers concretely. *Imprint*: persona, intake-flow skill, Friday Review ritual, voice guidelines, shared-knowledge schema — all published as Tokenrip assets, all versioned. *Memory*: shared knowledge layer (anonymized patterns across operators) + private context layer (per-operator history, preferences, relationships). *Harness*: 20-line bootloader command in Claude Code that fetches imprint at runtime, routes by mode, holds machine-specific config.
3. **Design decisions.** Three non-obvious choices. (a) **Layered memory over commons or partitioned** — patterns compound across operators, but private context never leaks. The cognitive architecture nobody has shipped. (b) **Imprint as several small assets, not one big one** — context budget, independent versioning, mode-specific loading. (c) **Friday Review as a ritual, not a feature** — agents need recurring touchpoints to accumulate memory; the ritual is what produces the data the shared layer learns from.
4. **The build.** The actual commands. Publish each imprint asset with `rip asset publish`. Create the two collections. Generate the bootloader. Onboard a second operator by sending them a message — they fetch the same imprint, get a new private memory partition, operational. Total build time, end to end: a single working session.
5. **The surprise.** The imprint we shipped is *smaller* than the imprint we use locally. Once memory is doing real work, instructions don't have to compensate for missing context. Cloud agents are bloated with prompt scaffolding because they have nowhere else to put state. When state has a home, the brain shrinks.
6. **What it looks like to use.** Second operator runs the agent on a different machine. Same imprint version. Same shared-pattern memory. Different private context. Friday Review runs the same way, accumulates the same way, but the operator's data never enters the shared layer. The agent feels like a single product, but it's running on two machines, on two operators' token budgets, and we're paying for the substrate.

**Tokenrip mention:** Natural presence throughout — Tokenrip is the substrate. Not a pitch, infrastructure narrating itself. "Published as a Tokenrip asset." "Memory in two Tokenrip collections." "Onboarded via Tokenrip messaging."

**Sources needed:**
- The Chief of Staff design doc (`active/chief-of-staff-launch-design-2026-04-27.md`)
- Actual Tokenrip CLI commands run during the build
- The bootloader command file
- The imprint assets (link to the public versions on Tokenrip)
- Two-week soak data: how memory grew, what surprised us, what didn't work
- Comparison: local hand-built agent imprint size vs. mounted version

**Keywords:** building a mounted agent, AI agent architecture, deploying AI agents, agent memory architecture, chief of staff agent, multi-operator AI agents

---

## Post 13: The Imprint Is a Contract

**Type:** Thesis
**Slug:** `imprint-as-contract`
**Angle:** Cloud AI cannot be audited. The model changes. The system prompt changes. The temperature changes. There's no version, no diff, no way to reproduce a decision the agent made last quarter. For consumer use, fine. For legal review, medical triage, regulatory compliance, scientific reasoning, financial analysis — *unusable.* Mounted agents make the imprint a versioned, public, executable contract for how the agent thinks. The behavior is reproducible at a version. The decision is auditable. This isn't a transparency feature; it's the door into industries that have refused to adopt AI.

**Hook:** A general counsel at a Fortune 500 will not let her team use ChatGPT to review contracts. Not because the answers are wrong — they're often right — but because she cannot reproduce the analysis next quarter when opposing counsel asks how the decision was made. The model has changed. The prompt has changed. The agent that approved the contract no longer exists. There is no version of an audit trail that cloud AI can produce, and that is the reason a $40 billion legal-services market won't touch it.

**Body sections:**
1. **What "auditable" actually requires.** A reproducible decision needs three things: known inputs, known reasoning logic, and a known output. Cloud AI produces only the output. The reasoning logic is a moving target — the model version drifts, the system prompt drifts, the temperature drifts. None of it is visible, and none of it is reproducible. This isn't a UX problem; it's a structural one.
2. **The versioned imprint as contract.** Mounted agents publish the imprint as versioned assets. Same imprint version + same model version + same input = same output. The agent's thinking is open; the model's behavior is documented; the decision is reproducible. Buying a mounted agent means buying *a behavioral guarantee, frozen at a version.* No cloud agent can offer this — by definition, cloud agents change underneath the user.
3. **Audit logs over closed prompts.** Open imprint isn't the only option. Builders can keep the imprint private if they want IP protection. What's *non-negotiable* is the audit log of tool calls — every action the agent took, every collection it read, every message it sent, all recorded against a specific imprint version. *Behavior is auditable even when the prompt is private.* This is the resolution that lets builders protect IP while preserving the trust pitch.
4. **The market this opens.** Legal research, regulatory compliance, medical decision support, financial analysis, scientific computation. These are not adjacent markets to consumer AI — they are *separate* markets that cloud AI structurally cannot serve. Mounted agents are the first AI architecture that can. Open imprint isn't a generic transparency play; it's the wedge into industries that currently account for hundreds of billions in services revenue and zero AI adoption.
5. **Why this matters more than buyers realize.** Buyers in regulated industries are used to reading "AI for [industry]" pitches that ignore the audit problem. The first vendor that solves it doesn't compete on quality of analysis — they compete on a feature their entire industry has been demanding for two years. The category is not "better AI for legal." The category is *AI that legal can actually use.*
6. **The procurement checklist for regulated buyers.** Standalone payoff. Five clauses to put in any AI vendor RFP — pasteable, defensible, and structurally impossible for cloud agents to satisfy:
   - *Imprint version pinning.* Vendor must disclose and version every instruction the agent operates under. Buyer can pin a version for the contract term.
   - *Model lock with disclosure.* Vendor must name the model and version, and notify in advance of any change. No silent downgrades.
   - *Tool-call audit log.* Every action the agent took, against a specific imprint version, retained for the regulatory horizon (typically 7 years for legal/financial, longer for medical).
   - *Reproducibility guarantee.* Buyer can replay any historical decision and get the same output, given the same inputs. No "we updated the model" excuses.
   - *Data residency and portability.* Where memory lives, who can read it, what survives contract termination.

   Each clause is a feature mounted agents have natively and cloud agents cannot ship. The checklist is the procurement conversation legal/medical/financial buyers have been trying to have for two years — now they have the language for it.

**Tokenrip mention:** Name it once. The post is about the architectural property; Tokenrip is what makes it credible. "Tokenrip stores imprint versions and tool-call audit logs as first-class objects — the substrate is built for this." Frame as why-this-platform, not what-this-platform.

**Sources needed:**
- Specific examples of regulated-industry AI adoption blockers (legal, medical, financial — well-documented in industry press)
- AI audit / explainability frameworks from regulators (EU AI Act, NIST AI RMF)
- Case studies of failed cloud-AI deployments in regulated sectors
- Market size data for legal services, financial services, healthcare (the addressable markets)
- Concrete example of a regulated decision that cloud AI cannot reproduce

**Keywords:** AI for regulated industries, AI agent observability, explainable AI, AI audit trail, legal AI, medical AI, AI compliance, reproducible AI

---

## Post 14: The Imprint Isn't the Moat

**Type:** Thesis
**Slug:** `mounted-agent-moats`
**Angle:** The first reaction to "publish your agent's instructions" is *"you're giving away the IP."* The thesis: the imprint was never the moat. What compounds is memory, tools, authorship, inter-agent connections, and end-to-end observability — and *only* mounted agents accumulate all five. This isn't a defense of openness; it's a different shape of moat that cloud agents can't build. Capstone post for the series.

**Hook:** "If the imprint is open, what stops a competitor from copying it?" Nothing. They should. The imprint is the recipe; the moat is the kitchen. After two weeks of running Chief of Staff in the open, we know exactly what compounds — and the prompt isn't on the list.

**Body sections:**
1. **The wrong question.** "If everything is open, what's the moat?" assumes the moat is in the instructions. In cloud-agent companies, that's the only thing it could be — the prompt is the product. Mounted agents change the substrate. *Other things start to compound.*
2. **What actually accumulates.** Five concrete moats. (a) **Shared memory** — the first 1,000 users generate a pattern layer no fork inherits. Yelp reviews for cognition. (b) **Tooling surface** — webhooks, semantic search, computed columns: infrastructure investments, not text. (c) **Authorship** — "Garry Tan's imprint" beats "an imprint that quotes Garry Tan." Substack, not random blog. (d) **Inter-agent connections** — once a mounted agent calls five others through the platform, switching costs aren't operational, they're network-effect. (e) **Observability** — the only architecture where agent behavior is auditable end-to-end (hat-tip Post 13).
3. **The shape change: protective → attractive moats.** Software moats are *protective* — defend the code, defend the prompt, lock the user in. Mounted-agent moats are *attractive* — the user can leave any time, but the agent gets stickier through accumulation. This is the right moat shape for cognition because the user-builder relationship is structurally aligned: user can switch harness, builder can switch platform, neither can extract from the other. Both sides win by making the other side happy.
4. **What this means for what gets built next.** The next wave of agent products won't compete on prompts. They'll compete on memory depth, tool surface, builder reputation, and inter-agent composition. The platforms that win will be the ones that host these compounding things at the lowest unit cost. Names what's coming next without trying to name everything.
5. **The moat audit: five questions for any agent platform you're betting on.** Standalone payoff. The reader takes this framework to evaluate the rest of the market — including us. Each question maps to one of the five moats above:
   - *Shared memory:* Does usage by other operators make my agent better, without leaking my data? If memory is fully private or fully commons, the answer is no. Layered memory is the thing to demand.
   - *Tooling surface:* Can the platform's tools — search, webhooks, computed columns — be composed by my agent without the platform owning the agent? If tools are bundled into the agent product, switching costs are operational, not architectural.
   - *Authorship:* Can the imprint carry a name? Is reputation visible, portable, and distinct from the platform's brand? If everything is "made by [Platform]," the platform is the brand and the author can't compound.
   - *Inter-agent composition:* Can my agent call another agent on the same platform as a first-class operation? If not, the platform is hosting siloes, not a network.
   - *Observability:* Can I, as the buyer, see what the agent did — every tool call, every collection read, every message sent? If the platform can't show me that, no buyer in a regulated industry can use it.

   Five "yes" answers describes the platform we're building. Five "no" answers describes a cloud-AI vendor with rebranded buzzwords. The reader leaves with the audit framework and one quotable line: *the agent is mounted; the moat is on us.*
6. **Series capstone.** Tie the six posts together in one paragraph: cloud agents have a ceiling (Post 9). Mounted agents lift it through a single architectural move (Post 10). Three things flow from that move: the user pays for inference (Post 11), the imprint becomes a contract (Post 13), and the moat shifts to what compounds (this post). The proof is built and running (Post 12). What we're building Tokenrip for is exactly this competition — the substrate that hosts what compounds, at the lowest unit cost.

**Tokenrip mention:** Lessons learned framing — most prominent of the series. "Building Chief of Staff on the platform showed us what compounds and what doesn't." Frame the platform as the substrate that makes these moats possible. End with the sentence that lands the category: *the agent is mounted; the moat is on us.*

**Sources needed:**
- The mounted-agent-synthesis.md (primary positioning material)
- Substack-style authorship moats as analogy (creator economy)
- Any precedent on protective-vs-attractive moats from venture writing
- Two-week Chief of Staff soak data on what actually grew vs. what didn't
- Network-effects / two-sided marketplace literature for the inter-agent argument

**Keywords:** AI agent moats, mounted agent moats, AI network effects, AI competitive advantage, agent marketplace, attractive moats

---

## Cross-Series Strategy

**Publishing cadence:**
- Post 9 + Post 10 same week (problem + category back-to-back, like Series 1 and 2)
- Post 11 a few days after Post 10 (economics builds on architecture)
- Post 12 lands after CoS has soaked through real use (post-May 11)
- Post 13 a few days after Post 12 (regulated-industries thesis stronger after readers see proof)
- Post 14 capstone, after a gap

Roughly: two posts week 1, two posts week 2, two posts weeks 3–4. Tighter than Series 1/2 cadence because the territory rewards momentum.

**Internal linking:**
- Post 9 links forward to Post 10 (one-line tease at the close, after the diagnostic — not a dependency)
- Post 10 links back to Series 1 Post 2 and Series 2 Post 6; links forward to Posts 11/13/14 as the three consequences
- Post 11 links back to Post 10 (architecture); links forward to Post 12 (proof of the economic claim)
- Post 12 links back to Post 10 (architecture this implements) and Series 2 Post 7 (CRM craft post sets the format pattern); links forward to Post 13
- Post 13 links back to Post 10 (architecture) and Post 12 (proof); links forward to Post 14
- Post 14 links back to Post 10 (architecture that makes these moats possible) and Series 2 Post 8 (operations as primitives → cognition as primitives is the same unbundling); closes the series

**SEO:** Distinct keywords per post. Deliberate "mounted agent" repetition in 10/12/14 to anchor the category term across the series. Deliberate "cloud agent" repetition in 9/10/11/13/14 to anchor the contrast term.
- Post 9: **cloud AI agents**, cloud agent limitations, cloud agent drift, cloud agent shutdown, evaluating cloud AI vendors
- Post 10: **mounted agents**, agent imprint, BYO LLM, decoupled AI
- Post 11: BYO LLM, AI unit economics, AI inference costs, long-tail AI agents, AI margin trap
- Post 12: **building a mounted agent**, agent memory architecture, chief of staff agent
- Post 13: AI for regulated industries, AI audit trail, explainable AI, legal AI, AI compliance, AI procurement checklist
- Post 14: **mounted agent moats**, AI network effects, AI competitive advantage, agent platform evaluation

**Tokenrip mention gradient:**
- Post 9: Don't name it. Pure problem thesis.
- Post 10: Name it once. Infrastructure framing.
- Post 11: Don't name it directly. Economics arguments are stronger without vendor pitches.
- Post 12: Natural presence (it's the substrate).
- Post 13: Name it once. Why-this-platform framing.
- Post 14: Lessons learned framing. Most prominent. Capstone pitch.

**Quality gates (from blog-post-framework.md):** Each post must pass the four pre-writing gates (Who Gives a Shit, Payoff, Not a Research Log, Scope) at brief stage, and the six post-draft gates (Catalog Ratio, Original Thinking, Structure Test, Tokenrip Integration, First-Paragraph Test, Final-Sentence Test) before publishing.

**Standalone-completeness gate (additional, per-post):** Before any post moves from brief to draft, confirm it ends with a tool the reader can use Monday morning — diagnostic, checklist, framework, or set of questions to ask a vendor. No post ends on a tease pointing at the next post. The series progression happens through accumulation and reinforcement; each post must earn its keep alone.

Particular risks for this series:
- **Post 9:** the standalone payoff is the diagnostic ("three questions to ask any cloud agent vendor"). If it gets cut for length, the post collapses back into pure setup. Don't cut it.
- **Post 11:** can drift into a generic "AI economics" rant. Anchor with concrete cost calculations and the margin-trap framework.
- **Post 13:** can drift into a "regulated industries are slow" lament. Anchor with one specific market, one specific buyer pain, and the procurement checklist.
- **Post 14:** easy slide into manifesto. Catalog Ratio gate matters. The moat-audit framework is the catalog discipline; manifestos don't ship audit frameworks.

---

## Tangents Worth Writing Later (Series 4 Candidates)

These are smaller because Series 3 absorbs more of the territory than a 4-post version would have. Remaining ideas worth tracking:

1. **Inter-Agent Tool Composition** — once mounted agents can call each other through the platform, what changes about agent ecosystems. The eBay-of-cognition argument.
2. **The Build-an-Agent Skill** — the craft post for the deployment skill, once it ships post-CoS validation.
3. **Token Spend with Observability Is Consent** — the user-psychology post. Why mounted-agent users feel different about their token bill than cloud-agent users do.
4. **Pattern Memory Is the Cognitive Abstraction Nobody Shipped** — the deep dive on layered memory. Currently lives inside Posts 12 and 14; could carry its own post once memory has soaked longer.
5. **Forks and Fairness** — fork semantics for imprints. What happens when someone forks an imprint and runs it on a different platform with no shared memory? Defer until the question is asked publicly.

---

*Series 3 plan created 2026-04-30. Based on the mounted agent architecture (Bean session 2026-04-25) and synthesis (Bean session 2026-04-30). See also: `product/tokenrip/mounted-agent-model.md` (architecture), `product/tokenrip/mounted-agent-synthesis.md` (positioning), `active/chief-of-staff-launch-design-2026-04-27.md` (craft subject), `content/plans/blog-series-1-multi-agent-collaboration-plan.md` (Series 1), `content/plans/blog-series-2-agent-native-operations-plan.md` (Series 2), `content/plans/blog-post-framework.md` (framework).*
