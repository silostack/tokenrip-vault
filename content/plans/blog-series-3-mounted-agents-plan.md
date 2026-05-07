# Blog Series 3: Mounted Agents

## Context

Series 1 named the alignment problem and proposed skills as packages. Series 2 named the SaaS trap and proposed operations as primitives. Both series proved that *parts* of the agent stack belong on a shared substrate: instructions first, then operations.

Series 3 closes the arc: AI agents should become **portable, persistent products** instead of disposable chat sessions. When an agent's instructions, memory, tools, identity, and usage history can live outside the runtime that executes it, the agent becomes portable across harnesses and persistent across sessions. That is the reader-facing outcome. "Mounted agents" is the category name for the architecture that makes it possible.

The framing shift matters. The series should not ask readers to care about "mounted agents" before they understand the pain. Start with the universal problem: useful agents are trapped inside chat products, model providers, and local runtimes. Then introduce the architectural pattern: durable agent intelligence mounted into whatever runtime the user prefers.
	
Source material is locked: `product/tokenrip/mounted-agent-model.md` (architecture), `product/tokenrip/mounted-agent-synthesis.md` (positioning), and `active/yc-tokenrip-pitch-framing-2026-05-02-codex.md` (investor-facing pitch ladder). The series now follows: problem → portable/persistent outcome → runtime separation/economics → proof → memory → moats.

The craft post has a real subject: the Chief of Staff agent (`active/chief-of-staff-launch-design-2026-04-27.md`) is in a 14-day build sprint (Apr 28 – May 11) and is explicitly described as "the first imprint shipping this model." By the time Post 12 ships, it will have soaked through real use.

**Why six posts and not four.** Series 1 and 2 each shipped four posts because they had two thesis ideas plus a craft and a synthesis. Series 3 is a category-creation series with five distinct thesis surfaces — problem, portability/persistence, economics, memory, moats — each anchoring a different keyword cluster. Compressing them into four posts loses SEO surface and bundles arguments that should breathe independently. Six posts is the right shape for the territory.

**Strategic priorities driving this series:**
1. **Outcome-first category capture.** Own "mounted agents" without leading with unexplained vocabulary. The reader first understands portable, persistent agents; then learns the category name.
2. **Vocabulary anchoring.** Lock "imprint", "memory", "harness", "BYO model", and "mounted agent" as terms readers reach for after the pain is clear.
3. **Substrate-density narrative.** Show why each deployed agent adds durable intelligence, shared memory, operators, and tool usage to Tokenrip.
4. **Tee up Series 4.** Regulated-industry auditability, inter-agent tool composition, agent marketplace, and the "build an agent" skill all follow once portability and persistence are established.

## Series Arc

```
#9  The Cloud Agent Ceiling (thesis)                 → name the problem cloud AI can't escape
#10 Portable Agents (thesis)                         → agents should be portable and persistent
#11 The Agent Shouldn't Live Where Inference Runs    → architecture + economics
#12 How We Built Chief of Staff as a Portable Agent  → working proof of the model
#13 The Agent's Memory Is the Product                → persistence + shared/private memory
#14 The Imprint Isn't the Moat                       → what actually compounds
```

**Standalone-completeness rule.** Every post earns its keep alone. A reader who lands cold from search gets (a) a problem named in their language, (b) a payoff they can use Monday morning — diagnostic, checklist, framework, or question to ask — and (c) optional links forward to the rest of the series. No post ends with a tease. The series accumulates through reinforcement, not dependency.

Same shape as Series 1 and 2 in spirit (problem → category → proof → capstone), extended with two additional thesis posts (runtime economics and memory) that each anchor an independent keyword cluster.

## Connection to Prior Series

| Series 1 | Series 2 | Series 3 | Progression |
|----------|----------|----------|-------------|
| Post 1: Alignment Problem | Post 5: SaaS Trap | Post 9: Cloud Agent Ceiling | Different layers of the same trap (drift → friction → ceiling) |
| Post 2: Skills as Packages | Post 6: Shared Agents | Post 10: Portable Agents | Skills → shared agents → portable/persistent agents |
| — | — | Post 11: The Agent Shouldn't Live Where Inference Runs | Architecture creates the economics |
| Post 3: Self-Updating Skills | Post 7: Agent CRM | Post 12: Chief of Staff | Built a skill → built a CRM → built a portable agent |
| — | — | Post 13: The Agent's Memory Is the Product | Persistence becomes the product surface |
| Post 4: Collaboration Layer | Post 8: Operations as Primitives | Post 14: Imprint Isn't the Moat | What collaboration → operations → cognition reveal |

The arc compounds. Series 1 separated *instructions*. Series 2 separated *operations*. Series 3 separates *the agent itself*.

---

## Post 9: The Ceiling on Cloud Agents

**Status:** Published. Do not rewrite the plan unless the published post itself changes.

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

## Post 10: Portable Agents

**Type:** Thesis
**Slug:** `portable-ai-agents`
**Angle:** AI agents should not live inside the chat session or runtime that executes them. Their durable parts — instructions, memory, tools, identity, and usage history — should live outside the runtime so the same agent can survive sessions, move across harnesses, and improve through use. A mounted agent is the architecture for this: durable agent intelligence mounted into whatever runtime the user prefers.

**Hook:** A website is not the browser. A package is not the machine that runs it. An agent should not be the chat session that executes it. Today, useful agents are trapped inside the place they run. End the session, switch tools, or lose the vendor, and the agent disappears. Portable agents fix the location problem: the durable parts live somewhere stable, and the runtime is just where the work happens.

**Body sections:**
1. **The location problem.** Today's agents live in the wrong place. Custom GPTs live inside OpenAI. Claude Projects live inside Anthropic. Local agents live on one machine. Framework agents live inside one workflow. The agent's durable intelligence is fused to the execution environment.
2. **What should be portable and persistent.** Five things need to survive the session: instructions/methodology, memory/context, tools/capabilities, identity/provenance, and usage history. If those do not move, the agent is not a product — it is a session.
3. **The mounted-agent pattern.** We call the durable instruction layer the imprint, the execution environment the harness, and the persistent context the memory. A mounted agent stores imprint and memory on a shared substrate, then mounts them into a harness at runtime. The harness may be Claude Code, Cursor, ChatGPT, or any compatible environment.
4. **Why portability without persistence is not enough.** Copying a prompt across tools creates a portable prompt, not a portable agent. The agent becomes a product only when memory, tools, identity, and usage history survive too.
5. **Where does your agent live?** Standalone payoff. A self-assessment for readers:
   - *Instructions:* are they versioned somewhere outside a vendor textbox?
   - *Memory:* what survives when the session ends?
   - *Tools:* can the agent access the same capabilities across runtimes?
   - *Identity:* can the agent be recognized across operators and sessions?
   - *Execution:* who runs the model, and can the runtime be swapped?

   If the durable answers all point to one vendor or one machine, the agent is not portable. If the runtime and durable state can separate, the agent can become a product.

**Tokenrip mention:** Name it once. "Tokenrip hosts the durable layer — imprints, memory, assets, messages, identity, and tools — while the user's chosen harness runs the model." Keep the sentence infrastructure-first. Avoid making the post a product page.

**Sources needed:**
- The mounted-agent-model.md architecture (primary source)
- The mounted-agent-synthesis.md framing (positioning)
- active/yc-tokenrip-pitch-framing-2026-05-02-codex.md for plain-English pitch ladder
- Cloud-agent reference points (Custom GPT, Claude Projects, Agentforce) for contrast
- Filesystem / package / browser analogies as plain-English bridges

**Keywords:** portable AI agents, persistent AI agents, mounted agents, agent imprint, agent harness, decoupled AI agents, AI agent portability

---

## Post 11: The Agent Shouldn't Live Where Inference Runs

**Type:** Thesis
**Slug:** `agent-inference-runtime-separation`
**Angle:** The agent should not live where inference runs. Once the durable agent layer separates from execution, several consequences fall out: the user can bring their own model, the builder avoids inference burn, capability no longer has a hidden vendor-imposed ceiling, token efficiency becomes a visible product quality, and model price drops become free upgrades. BYO inference is not the category; it is one consequence of putting the agent in the right place.

**Hook:** Every AI company faces the same margin problem: the more users run the agent, the more inference the company pays for. That cost pressure leaks into the product as shorter context, caching, model downgrades, and invisible quality decay. The way out is not a cheaper model. The way out is architectural: the agent should not live where inference runs.

**Body sections:**
1. **Runtime fusion creates margin pressure.** When the builder hosts both the agent and the inference, usage growth creates linear cost growth. The vendor's rational response is to control how much thinking each user gets.
2. **Separate the agent from execution.** The builder hosts durable agent intelligence: instructions, memory, tools, identity, and usage history. The user's harness runs the model. The runtime becomes replaceable.
3. **The BYO inversion.** The user pays for inference in the environment they already use. The builder pays for storage and tooling. A 50-step reasoning chain is no longer a builder-margin problem; it is a user-value decision.
4. **Token efficiency becomes product quality.** A bloated imprint becomes a tax the user can feel. Leaner agents win because quality and economy point in the same direction.
5. **Deflation becomes a free upgrade.** When models get cheaper or better, portable agents inherit the improvement without the builder changing pricing or absorbing margin pressure.
6. **How to spot a runtime-trap AI product.** Standalone payoff. Three signals:
   - *"Optimized for performance"* can mean aggressive caching.
   - *"Best practices recommend shorter context"* can mean rationed reasoning.
   - *"We continuously optimize the model"* can mean silent downgrades.

   Each signal is a symptom of the same architectural problem: the agent lives where inference runs.

**Tokenrip mention:** Don't name it directly. Economics arguments are stronger when they do not read as vendor pitches. Hint with "a platform that hosts durable agent intelligence without hosting inference."

**Sources needed:**
- Public information on AI company margins (Jasper, Copy.ai, Character.ai post-mortems where available)
- OpenAI / Anthropic / Google pricing tables and recent cuts
- Industry analyst writing on AI SaaS unit economics (a16z, Tomasz Tunguz, etc.)
- Concrete cost calculations: 50-step reasoning chain at current model pricing

**Keywords:** BYO LLM, BYO model AI, AI unit economics, AI inference costs, AI agent pricing, agent runtime, AI margin compression, long-tail AI agents

---

## Post 12: How We Built Chief of Staff as a Portable Agent

**Type:** Craft / Workflow
**Slug:** `building-a-mounted-agent`
**Angle:** Step-by-step walkthrough of building Chief of Staff — the first agent shipped on the mounted model. The agent's durable layer lives on Tokenrip: versioned imprint assets, shared/private memory, assets, messages, identity, and tool access. The harness is Claude Code for now, but the agent is portable to any compatible runtime. The build shows what changes when shipping an agent means publishing durable intelligence instead of hosting inference.

**Hook:** We built an agent that doesn't live on our servers and doesn't live in one chat product. We don't run inference for it. We host the parts that need to persist: instructions, memory, assets, messages, and tools. Anyone with a compatible harness can run it. The surprising part is not that the architecture works — it is that the agent starts to feel more like a product once the runtime becomes replaceable.

**Cold-reader intro (one paragraph after the hook):** A reader who lands here from search may not know the term "mounted agent." Open with one paragraph that pays them off in plain language: a portable agent separates the durable parts of the agent from the model that runs it. Instructions and memory live on a shared substrate; execution happens in the user's chosen runtime. We call this a mounted agent. *That's what we built. Here's how.*

**Body sections:**
1. **The requirement.** Build a Chief of Staff: an agent that runs Friday Reviews, holds organizational context, learns operator preferences, and works for multiple operators across machines. Traditional answer: stand up a SaaS, run inference, build a dashboard, host memory in a database the user can't inspect. Portable-agent answer: publish durable intelligence, provision memory, write a thin bootloader.
2. **The architecture.** Show the three layers concretely. *Imprint*: persona, intake-flow skill, Friday Review ritual, voice guidelines, shared-knowledge schema — all published as Tokenrip assets, all versioned. *Memory*: shared knowledge layer (anonymized patterns across operators) + private context layer (per-operator history, preferences, relationships). *Harness*: 20-line bootloader command in Claude Code that fetches imprint at runtime, routes by mode, holds machine-specific config.
3. **Design decisions.** Three non-obvious choices. (a) **Layered memory over commons or partitioned** — patterns compound across operators, but private context never leaks. (b) **Imprint as several small assets, not one big one** — context budget, independent versioning, mode-specific loading. (c) **Friday Review as a ritual, not a feature** — agents need recurring touchpoints to accumulate memory; the ritual produces the data the shared layer learns from.
4. **The build.** The actual commands. Publish each imprint asset with `rip asset publish`. Create the memory collections. Generate the bootloader. Onboard a second operator by sending them a message — they fetch the same imprint, get a new private memory partition, operational. Total build time: a single working session.
5. **The surprise.** The imprint we shipped is *smaller* than the imprint we use locally. Once memory has a real home, instructions don't have to compensate for missing context. Cloud agents are bloated with prompt scaffolding because they have nowhere else to put state. When state has a home, the brain shrinks.
6. **What it looks like to use.** Second operator runs the agent on a different machine. Same imprint version. Same shared-pattern memory. Different private context. Friday Review runs the same way, accumulates the same way, but the operator's data never enters the shared layer. The agent feels like a single product, but it is running on two machines, on two operators' token budgets, and Tokenrip hosts the substrate.

**Tokenrip mention:** Natural presence throughout — Tokenrip is the substrate. Not a pitch, infrastructure narrating itself. "Published as a Tokenrip asset." "Memory in two Tokenrip collections." "Onboarded via Tokenrip messaging."

**Sources needed:**
- The Chief of Staff design doc (`active/chief-of-staff-launch-design-2026-04-27.md`)
- Actual Tokenrip CLI commands run during the build
- The bootloader command file
- The imprint assets (link to the public versions on Tokenrip)
- Two-week soak data: how memory grew, what surprised us, what didn't work
- Comparison: local hand-built agent imprint size vs. portable/mounted version

**Keywords:** building a mounted agent, portable AI agent, AI agent architecture, deploying AI agents, agent memory architecture, chief of staff agent, multi-operator AI agents

---

## Post 13: The Agent's Memory Is the Product

**Type:** Thesis
**Slug:** `agent-memory-is-the-product`
**Angle:** A portable prompt is not enough. The agent becomes a product when memory persists, compounds, and separates shared patterns from private user context. Durable memory is what lets an agent improve through use without leaking operator data, and it is the product surface cloud agents and prompt marketplaces mostly miss.

**Hook:** A prompt can be copied. A memory layer cannot. The first version of an agent is its instructions; the hundredth use of an agent is its memory. If that memory dies with the session, the product never compounds. If it leaks across users, nobody trusts it. The hard part is not storing context. The hard part is knowing which context should be shared, which should stay private, and how both make the agent better.

**Body sections:**
1. **Portable prompts are not portable agents.** Moving instructions across runtimes gives the agent a starting behavior, but nothing improves unless memory survives.
2. **Three memory layers.** Private context (operator-specific history/preferences), shared pattern memory (generalizable learnings across users), and public artifact memory (assets, outputs, decisions, references). Each compounds differently.
3. **Shared patterns + private context.** The strongest model is layered memory: the agent learns from everyone while remembering each operator specifically. This is the cognitive abstraction that makes a creator/expert imprint better with audience usage without turning user data into a commons.
4. **Why memory changes the product.** Once memory works, the imprint can be smaller, the agent can personalize without prompt bloat, and the builder's moat shifts from instructions to accumulated usage.
5. **What to ask of any agent memory layer.** Standalone payoff:
   - *What survives the session?*
   - *What is private to me?*
   - *What becomes shared pattern memory?*
   - *Can I inspect what the agent remembers?*
   - *Can I delete or correct memory?*
   - *Does usage by other operators improve my result without exposing their data?*

**Tokenrip mention:** Name it once in the memory architecture section. "Tokenrip models this with versioned assets plus collections that can separate shared knowledge from private operator context." Keep it architectural, not promotional.

**Sources needed:**
- mounted-agent-model.md sections on Commons / Partitioned / Layered memory
- mounted-agent-synthesis.md section "Shared patterns + private context"
- Chief of Staff memory design and soak data
- Any concrete examples from engagement agent / CRM usage where memory reduced prompt burden

**Keywords:** AI agent memory, persistent AI memory, shared agent memory, private AI context, agent personalization, portable AI agents, mounted agent memory

---

## Post 14: The Imprint Isn't the Moat

**Type:** Thesis
**Slug:** `mounted-agent-moats`
**Angle:** The first reaction to "publish your agent's instructions" is *"you're giving away the IP."* The thesis: the imprint was never the moat. What compounds is memory, tools, authorship, inter-agent connections, and end-to-end observability — and only portable/mounted agents accumulate all five. This isn't a defense of openness; it's a different shape of moat that cloud agents can't build.

**Hook:** "If the imprint is open, what stops a competitor from copying it?" Nothing. They should. The imprint is the seed; the moat is what grows around it. After running Chief of Staff as a portable agent, the lesson is blunt: prompts can be copied, but memory, tools, relationships, and usage history compound.

**Body sections:**
1. **The wrong question.** "If everything is open, what's the moat?" assumes the moat is in the instructions. In cloud-agent companies, the prompt looks like the product because nothing else is portable. Mounted agents change the substrate. Other things start to compound.
2. **Memory is the lead moat.** The first 1,000 users of an agent generate a pattern layer no fork inherits. Fork the imprint, you get the seed. Fork the memory, you cannot. This is network-effect data for cognition.
3. **The other compounding layers.** Tooling surface (search, webhooks, computed columns, scheduled ops), authorship/reputation, inter-agent connections, and observability. Each compounds around the imprint, not inside it.
4. **The shape change: protective → attractive moats.** Software moats are protective: defend the code, defend the prompt, lock the user in. Mounted-agent moats are attractive: the user can leave, but the product gets better through accumulation. That is the right moat shape for cognition.
5. **The moat audit.** Standalone payoff. Five questions for any agent platform:
   - *Memory:* does usage by other operators make my agent better without leaking their data?
   - *Tooling:* can the platform's tools be composed by my agent without the platform owning the agent?
   - *Authorship:* can the imprint carry a name and reputation distinct from the platform?
   - *Inter-agent composition:* can my agent call another agent as a first-class operation?
   - *Observability:* can I see what the agent did — tool calls, collection reads, messages, and versioned outputs?
6. **Series capstone.** Tie the six posts together: cloud agents have a ceiling (Post 9). Portable agents lift it by moving durable intelligence outside the runtime (Post 10). That unlocks BYO economics (Post 11), working proof (Post 12), persistent memory (Post 13), and a new moat shape (this post). Tokenrip is the substrate that hosts what compounds.

**Tokenrip mention:** Lessons learned framing — most prominent of the series. "Building Chief of Staff on the platform showed us what compounds and what doesn't." Frame Tokenrip as the substrate that makes these moats possible. End with a sharper line than the old version: *the agent is portable; the moat is what compounds around it.*

**Sources needed:**
- The mounted-agent-synthesis.md (primary positioning material)
- Chief of Staff soak data on what actually grew vs. what didn't
- Network-effects / two-sided marketplace literature for the inter-agent argument
- Examples of authorship moats, used carefully as analogy only — avoid creator-economy framing as the dominant reference point

**Keywords:** AI agent moats, mounted agent moats, AI network effects, AI competitive advantage, agent marketplace, portable AI agents, agent platform evaluation

---

## Cross-Series Strategy

**Publishing cadence:**
- Post 9 is already published.
- Post 10 should ship next as the plain-English category doorway.
- Post 11 follows a few days after Post 10 because economics should read as a consequence of runtime separation.
- Post 12 lands after Chief of Staff has soaked through real use (post-May 11).
- Post 13 follows Post 12 because memory is stronger once readers have seen the build.
- Post 14 capstone, after a gap.

Roughly: Post 10 + 11 in the next active push, Post 12 + 13 after CoS proof, Post 14 as the series close. Tighter than Series 1/2 cadence because the territory rewards momentum, but do not rush Post 12 without real soak data.

**Internal linking:**
- Post 9 links forward to Post 10 as the "different shape" answer, but Post 10 should not assume the reader has read Post 9.
- Post 10 links back to Series 1 Post 2 and Series 2 Post 6; links forward to Posts 11/13/14 as consequences of portability/persistence.
- Post 11 links back to Post 10; links forward to Post 12 as proof of runtime separation.
- Post 12 links back to Post 10 and Series 2 Post 7; links forward to Post 13 because the build reveals memory as the product.
- Post 13 links back to Post 10 and Post 12; links forward to Post 14 because memory is the lead moat.
- Post 14 links back to Post 10, Post 13, and Series 2 Post 8; closes the series.

**SEO:** Distinct keywords per post. Deliberate "mounted agent" repetition remains in 10/12/13/14 for category capture, but titles lead with legible outcomes.
- Post 9: **cloud AI agents**, cloud agent limitations, cloud agent drift, cloud agent shutdown, evaluating cloud AI vendors
- Post 10: **portable AI agents**, persistent AI agents, mounted agents, agent imprint, agent harness, decoupled AI
- Post 11: BYO LLM, AI unit economics, AI inference costs, agent runtime, AI margin trap
- Post 12: **building a mounted agent**, portable AI agent, agent memory architecture, chief of staff agent
- Post 13: **AI agent memory**, persistent AI memory, shared agent memory, private AI context, mounted agent memory
- Post 14: **mounted agent moats**, AI network effects, portable AI agents, AI competitive advantage, agent platform evaluation

**Tokenrip mention gradient:**
- Post 9: Don't name it. Pure problem thesis.
- Post 10: Name it once. Infrastructure framing.
- Post 11: Don't name it directly. Economics arguments are stronger without vendor pitches.
- Post 12: Natural presence (it's the substrate).
- Post 13: Name it once. Memory architecture framing.
- Post 14: Lessons learned framing. Most prominent. Capstone pitch.

**Quality gates (from blog-post-framework.md):** Each post must pass the four pre-writing gates (Who Gives a Shit, Payoff, Not a Research Log, Scope) at brief stage, and the six post-draft gates (Catalog Ratio, Original Thinking, Structure Test, Tokenrip Integration, First-Paragraph Test, Final-Sentence Test) before publishing.

**Standalone-completeness gate (additional, per-post):** Before any post moves from brief to draft, confirm it ends with a tool the reader can use Monday morning — diagnostic, checklist, framework, or set of questions to ask a vendor. No post ends on a tease pointing at the next post. The series progression happens through accumulation and reinforcement; each post must earn its keep alone.

Particular risks for this series:
- **Post 9:** the standalone payoff is the diagnostic ("three questions to ask any cloud agent vendor"). If it gets cut for length, the post collapses back into pure setup. Don't cut it.
- **Post 10:** can collapse into vocabulary-first category naming. Lead with portable/persistent pain; introduce "mounted agent" only after the reader has a reason to care.
- **Post 11:** can drift into a generic "AI economics" rant. Anchor with runtime separation and concrete cost calculations.
- **Post 13:** can become abstract memory philosophy. Anchor with concrete shared/private memory examples and the reader-facing memory checklist.
- **Post 14:** easy slide into manifesto. Catalog Ratio gate matters. The moat-audit framework is the catalog discipline; manifestos don't ship audit frameworks.

---

## Tangents Worth Writing Later (Series 4 Candidates)

1. **The Imprint Is a Contract** — versioned cognition, tool-call audit logs, and reproducible behavior for regulated buyers. This was formerly Post 13; it is stronger as expansion/fundraising collateral after the portable/persistent thesis is established.
2. **Inter-Agent Tool Composition** — once mounted agents can call each other through the platform, what changes about agent ecosystems. The eBay-of-cognition argument.
3. **The Build-an-Agent Skill** — the craft post for the deployment skill, once it ships post-CoS validation.
4. **Token Spend with Observability Is Consent** — the user-psychology post. Why mounted-agent users feel different about their token bill than cloud-agent users do.
5. **Forks and Fairness** — fork semantics for imprints. What happens when someone forks an imprint and runs it on a different platform with no shared memory? Defer until the question is asked publicly.

---

*Series 3 plan created 2026-04-30. Restructured 2026-05-03 around portable, persistent agents as the reader-facing outcome and mounted agents as the category/architecture. Based on the mounted agent architecture (Bean session 2026-04-25), synthesis (Bean session 2026-04-30), and YC pitch framing (`active/yc-tokenrip-pitch-framing-2026-05-02-codex.md`). See also: `product/tokenrip/mounted-agent-model.md` (architecture), `product/tokenrip/mounted-agent-synthesis.md` (positioning), `active/chief-of-staff-launch-design-2026-04-27.md` (craft subject), `content/plans/blog-series-1-multi-agent-collaboration-plan.md` (Series 1), `content/plans/blog-series-2-agent-native-operations-plan.md` (Series 2), `content/plans/blog-post-framework.md` (framework).*
