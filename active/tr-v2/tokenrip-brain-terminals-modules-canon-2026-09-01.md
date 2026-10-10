---
title: "Tokenrip — Brain, Terminals, Modules: Direction, ICP, and Site (Session Synthesis)"
status: draft v1 — Bean session capture, for Simon's review
created: 2026-09-01
owner: Simon
source: Bean sessions 2026-08-29 → 2026-09-01
relation_to_canon: |
  Evolves (does not replace) the June 2026 canon (why-graph / git-for-operational-work, active/tokenrip-vision-and-roadmap-2026-06-09.md). Every June primitive survives; the center of gravity moves from moat-first (why-graph) to product-first (brain + terminals + modules) and from FDE-GTM to self-serve for AI-native small companies.
related:
  - active/tokenrip-homepage-v2-2026-08-30.md
  - active/tokenrip-shared-memory-canonical-fable-2026-06-11.md
  - active/workspace-brain-architecture-2026-06-14.md
  - agents/bean/ideas/brain-projections.md
suggested_home: product/tokenrip/
---

# Tokenrip: Brain, Terminals, Modules

> **The one-sentence version.** Tokenrip is the company brain — the facts and positions of a business — connected through scoped slices to every AI terminal its people and agents already use, with modules as the installable abilities that feed it. The target buyer is the AI-native small company, from a solo founder and their agents to the first ten hires.

---

## 1. The vision

### 1.1 The structural claim: the brain is separated from the harness

Every "company brain" on the market (Glean, Dust, Notion AI, Copilot) fuses brain + sandbox + model: your company's context lives inside their app, queried by their models, through their interface. Tokenrip decomposes it: **the brain lives on Tokenrip; the hands are wherever the person already works** (Claude Code, Codex, Cowork, ChatGPT — via MCP or CLI). Bring your own harness, bring your own model; the context is yours.

This is the decomposition-as-positioning move applied at company scale (previously applied to agents — imprint/memory/harness — and to UI — Surfaces). It is the claim the incumbents structurally cannot make, because they *are* the sandbox.

### 1.2 The brain: facts and positions

The brain is a company's context layer, made of two kinds of content:

- **Facts — what happened.** Call transcripts, decisions, research, code activity, published work. High-volume, flows in automatically as a byproduct of work. Commodity ingest — every connector startup can get transcripts.
- **Positions — what the company believes.** ICP, pricing floor, voice, bets, discovered secrets, the *why* behind each. A company has maybe fifty; they live today in founders' heads and pitch decks. **Positions exist in no system of record anywhere — they are the differentiated content.** They map to June's Doctrine (facts ≈ Signals + Output), but "positions" is the sellable word: bets with a lifecycle (held → tested → confirmed/abandoned) and recorded reasons. The why-graph, reborn as something a founder wants to write.

**Positions make three product moves possible:**
1. **They verticalize generic modules** (§3) — config-not-code achieved through prose.
2. **They give the magic demo its trigger** — a fact contradicting a position is the product event (the "unprompted catch": position says 8% floor; transcript shows 7.2% ask; the terminal flags it before drafting).
3. **They can act as guards** — checks before a hand acts ("never send under 8%"), the first thing regulated buyers ask for.

### 1.3 Principals: people, agents, and apps are the same object

Every actor connecting to a brain — employee, agent, contractor, customer, acquirer's diligence tool, the company's own website — is a **principal** reading one shared corpus through the same tuple:

> **(permission slice, salience profile, private derived layer)**

- **Permission slice** — what the principal *may* see. Hard boundary; security. An employee is just an outside collaborator with a bigger slice.
- **Salience profile (projection)** — what the principal *should* see given its function. Soft weighting; context hygiene. The Closer boots hot on sales calls + pricing positions; the content manager on posts + voice. The vault's own agent firewall (Bean deliberately excluding DASHBOARD) proves the negative case: irrelevant context doesn't just waste tokens, it *degrades function*. Mechanism ladder, cheap → expensive: declared boot layers → query conditioning → per-agent re-rank weights over one index → task-conditioned embeddings. Never N separate indexes. **Weight, never wall** — the unprompted catch depends on cross-domain reachability. Full capture: `agents/bean/ideas/brain-projections.md`.
- **Private derived layer** — digests the principal maintains (the Closer's account dossiers). *This is what "personal brain" was all along.* It also sharpens the open ownership question: "the derived layer leaves with the principal" is now a precise statement of what walks out the door.

Two consequences:
- **A job description is a salience profile.** Hiring an agent = mount imprint + grant slice + attach projection. The imprint + projection pair is portable and versioned; the brain it lands on is not — which is what makes a third-party agent competent on a stranger's brain on day one, and what makes an agent marketplace more than a pile of system prompts.
- **A company of one is still a team.** One human + research agent + publisher + closer is a multi-principal organization. Multiplayer never meant multiple humans; it meant multiple principals.

### 1.4 The attachment taxonomy: five kinds, not one

"Modules" decompose by what they do to the brain:

| Kind | Direction | Runs where | Example |
|---|---|---|---|
| **Sources** (senses) | in → brain | scheduled, no judgment | transcript pull, git, Slack |
| **Connections** (hands) | brain → out | routed through Tokenrip | image-gen key, SMTP, publish |
| **Skills** (methods) | invoked from a terminal | the **user's** model | "publish the post," "draft cold email" |
| **Reflexes** (triggers) | fires on a brain event | Tokenrip-side runtime | transcript lands → extract commitments; fact contradicts position → flag |
| **Surfaces** (lenses) | brain → view | Tokenrip hosts | quintel.ai blog pull, client portal |

Plus two structural objects: **slices** (permission projections) and **principals** (§1.3).

Key properties:
- **A "module" as sold is a bundle** — skill + connections + state + (optionally) surface. The Publisher: skill Alek invokes from Cowork, shared image-API connection, posts stored as artifacts, quintel.ai reading them. Judgment runs on the user's model; side effects and memory run on Tokenrip. The mounted-agent decomposition, recursed one level down. Module authors never pay inference; module state outlives any terminal.
- **Modules are how the brain eats.** Every module is an ingest pump disguised as a capability — the answer to June's write-side-friction killer. The brain fills as exhaust of work, not via seeding projects. Positions are the one thing needing a human, and there are ~50 of them, and the CEO *wants* to write them.
- **Modules are generic; positions make them yours.** One CMS module sells to every company; the brain does the customization. This is the config-not-code / anti-consulting claim, achieved through positions.
- **Modules never call each other; they compose through the brain** (stigmergy as design rule). A module may depend on positions and state, never on another module — the rule that keeps a third-party module ecosystem out of dependency hell.
- **Reflexes are where BYO breaks, and that's the paywall.** Session-bound terminals can't be "always awake"; Tokenrip runs reflexes with the customer's own keys. **Terminals free, reflexes paid** — free to drive, pay for autopilot (consistent with June). Reflex output lands in the **inbox**, picked up at terminal-connect ("3 things your brain flagged"). **Consolidation** (facts → positions) is a named reflex class — the metabolism that makes the brain smarter instead of bigger (hermes morning brief is the prototype).
- **Moat note.** Skills are copyable text; the non-copyable part is the binding — brain state, shared connections, versioning. Sell modules as managed, brain-bound, shared capabilities, not as IP. Free brain (we want it filled), paid modules, metered routing via Connections. Connections are triple-duty: metering point (usage billing, per-principal cost attribution), policy point (which model sees which slice), provenance point (which slices were in context per call — read-side provenance for free).

### 1.5 The OS frame (internal mental model)

Brain = filesystem + memory. Modules = installed programs. Terminal = shell; the user brings the CPU (their model). Connections = drivers. Slices = permissions. Principals = users. Reflexes = daemons. Inbox = notifications. Consolidation = the metabolism.

Vocabulary note: brain / terminal / positions / connections is a *Bloomberg* register, not a Notion one ("Bloomberg, not Notion" — patterns.md). "Terminal" is the strongest noun since "imprint." Run the vocabulary-tree audit before any of it fossilizes (esp. "projection" vs. alternatives).

---

## 2. The ICP: AI-native small companies

### 2.1 The decision

Do not target enterprise. Target **AI-native companies from founding: solo founder → first ten hires.** Rationale:

1. **The architecture already voted for it.** Self-serve MCP connect, BYO model, founder-written positions, modules invoked from consumer harnesses — none survives enterprise procurement; all of it is what a 1–10 person company wants.
2. **The differentiator peaks down-market.** "Born-recorded vs. indexed exhaust" is decisive only where there is no exhaust. A company founded this year has only what gets recorded from day zero. **A company brain is free to build at founding and brutal to retrofit.** Glean needs your history; Tokenrip wants your birth certificate.
3. **The macro tailwind is real** (Stripe formation data; single-person-unicorn discourse): many more small companies, built AI-native, doing at five people what took fifty.
4. **The solo case proves multiplayer** rather than shrinking it: n=1 human is still n≈6 principals. Tokenrip is the org chart of the one-person company.
5. **Precedent stack:** Stripe, Vercel, Linear, Notion, Slack — start with startups, let enterprise come to you. Nobody won this position in reverse.
6. **Brand fit:** Tokenrip is the dev/infra brand (existing decision); FDE/enterprise motions already live under vertical names (Quintel, AICAP). Each brand gets its own shelf; nothing is orphaned.

**Economics, honestly:** trades $100K contracts for $50–200/mo self-serve → volume game → reactivates the distribution gap (distribution is the moat's prerequisite; no machine exists yet). Offsets: formation velocity; land-at-founding makes LTV the life of the company; the brain compounds with headcount, so winners carry Tokenrip up-market for free. BYO economics make the free tier structurally cheap (guests bring their own inference; we serve retrieval).

**The DIY objection (the honest #1 competitor):** the AI-native founder can roll a vault + Claude Code + git — Simon did. The counter: the DIY version dies at the first boundary — second person, second harness, an agent needing its own slice, anything published. Position the product at **boundary moments**, never against a founder's local markdown folder.

### 2.2 The competitive triangle

- **Glean** (fused, enterprise, indexes exhaust; homepage leads with token-cost efficiency — a validated CFO argument Tokenrip should also use: shared brain = less sent to the model, inside the customer's *own* API bill).
- **MCP context tools** (Unabyss, Nessie, et al.): sync files/context, no positions, no principals, no modules. Table-stakes L1.
- **Tokenrip**: separated brain, positions, principals with slices+projections, modules that feed the brain, any terminal. The middle of the triangle is empty.

One-liners: *"Glean knows what your company has written. Tokenrip knows what your company believes."* / *"Works in the terminal you already use, with the model you already pay for."*

---

## 3. Onboarding: the mirror, then the boundary

**The payoff problem:** building a brain has no immediate payoff — memory's value is temporal. Two solutions, sequenced:

- **Payoff #1 — the mirror (instant, personal).** The brain's first render is *about the visitor*: give it your website, it extracts facts and drafts positions, confidence-labeled ("inferred from your pricing page — correct me"). Most founders have never seen their beliefs externalized.
- **Payoff #2 — the boundary crossing (the thesis).** The June magic-demo rule applied to onboarding: never demo persistence; demo a crossing. Second tool, same knowledge, on data the visitor just created.

**The CTA ladder** (each step's payoff funds the next step's friction):
1. **Mount ours, anonymously.** `npx tokenrip` / MCP URL, no signup → guest principal on Tokenrip's own public brain; your terminal answers questions about Tokenrip. *This replaces the docs* ("the docs are a brain you mount" — Stripe-docs-as-demo, agent era) and exercises the outside-collaborator slice for real.
2. **Build yours from your website.** The brain-builder (visibly a module) drafts facts + positions.
3. **Correct it.** The founder fixes the inferences — the one subject they're the world expert on. Investment; first real positions. ("Onboarding IS the moat," firing.)
4. **Open your other tool.** Connect; ask about your company; it knows. The earned wow.

**Failure mode: blandness, not wrongness.** A specific, falsifiable, slightly-wrong inference triggers correction; a vague safe one ends the session. Tune extraction for specificity + surfaced tensions ("homepage says X, blog argues Y — which is the position?" — the contradiction-surface signature move, performed on their own company in minute three). Thin-site fallback: fewer, sharper inferences + a three-question interview.

**Zero-waste note:** the website→brain extractor *is* the "atomize a source into a brain" skill that customer/FDE brains need anyway.

**Falsifiable checks:** (a) step-2 completions convert to step-3 corrections at a high rate — readers who correct one position almost never bounce; if they read and leave, fix the extraction, not the funnel. (b) Self-serve connects skew to companies <2 years old, <10 people, with the FDE pipeline unaffected.

---

## 4. The website

Full spec: `active/tokenrip-homepage-v2-2026-08-30.md`. Compressed:

- **Diagnosis of current site:** FDE services page (insurance/RE/pro-services "workflow audits") — substrate-invisible, vague, not tangible as a product. Glean's page shares the tangibility failure: no *scene*.
- **Tangibility levers:** problem in the user's words ("Every colleague is a link you have to ask for"); the product shown as a split-screen terminal transcript (it *is* a terminal experience); three concrete objects with screenshots (file tree, `rip connect`, a live module).
- **Structure:** Hero ("Your team runs on AI. None of it is shared.") → Scene → Thesis ("The next big companies will be small… you get to start with one") → Problem → Brain (facts/positions) → Terminals (incl. company-of-one) → Modules (Publisher live; FDE demoted to "we build custom modules") → Get started (the ladder) → FAQ (DIY objection first) → CTA ("Give your company a memory").
- **Register:** Stripe/Linear founder-to-founder. Commands shown raw. No enterprise smells (no book-a-demo, no badge rows). Pricing public.
- **Claim discipline:** no "semantic" anywhere (FTS only today); website-extractor gates the hero button (fallback: command-only CTA); modules marked live only when live; the scene stays illustrative until a real transcript-ingest example replaces it.

---

## 5. The Quintel bulk-trigger pattern (2026-09-01 addition)

Quintel's triggers system (see `~/projects/maxi/quintel/docs/quintel/bulk-trigger-explained.html`) has no Tokenrip dependency but validates the model:

- **The workbench dual.** Quintel's back office ships two agent-grade interfaces — interactive (MCP connector tools for triage) and batch (a 112-column export "built to hand to an LLM," Preview → Apply behind a signed token). Founders attach their own harnesses and flat-rate subscriptions as elastic staff. Dual of the terminal thesis: *anything with an API key is a terminal; anything with an MCP surface and a work contract is a workbench.*
- **Labor as a dial.** The contract is model-agnostic — human with a spreadsheet, cheap model for the bulk pass, frontier model for "needs review." Cognition procurable per batch, per difficulty tier, on the operator's flat-rate plan, not the app's COGS. BYO-model economics applied to ops labor; the "Tools, not AI" pattern honored (deterministic pipeline; judgment attached at the edges, never embedded).
- **The PR pattern, again.** Export → review → preview → apply = branch → propose → diff-review → merge: a pull request between an operator's model and a production database. Generalizable safety architecture: **the app owns the state machine; the model owns the judgment; the boundary is a reviewable batch.**
- **The first running why-graph instance.** A triage verdict = {disposition, reasons, actor, history kept, latest-wins, evidence-scoped}. June's inventory row C ("does not exist as a primitive anywhere") now exists, in production, in the vertical. Upgrade the deck claim accordingly.
- **The missing consolidation loop is Tokenrip's job.** Triage sessions are stateless; calibration lives in hand-maintained page instructions. Those instructions are an imprint; the calibration learnings are positions. Division of labor: **apps hold state machines; the brain holds doctrine.** The reflex that should exist: verdict outcomes → consolidate → updated triage positions → sharper next batch.
- **Work orders as a primitive candidate.** The generic form — typed batch contracts any terminal can claim, work, submit with preview/apply and provenance — is the most concrete shape yet for the deferred "deliverable rails" layer, and a why-graph feeder. **Logged as direction, not build:** one instance ≠ rule-of-three; stays pull-gated per June discipline.
- **Marketing asset:** "two founders run a market-data factory; the staff is attached LLMs" is the ICP's own future told as a case study — homepage/content proof.

### 5.1 The generic work queue (thought experiment, 2026-09-01 — saved, not planned)

> **2026-09-04 update — pull-gate cleared.** Simon's pain list supplied three more instances (Alek's issue inbox, transcript-processing tasks, cadence tasks; Quintel triage is the fourth), and the repo already holds ~70% of the primitive (T5 `SteeringEvent` + `inbox?actionable=true` + `agent_load` echoing `pendingSteering` + ack with resolution trail; the docs name a "paused substrate-roadmap scheduler" as its consumer). The queue is now the **spine of the first build**, not a thought experiment: un-pause the scheduler, generalize steering events into free-standing, system-creatable, leasable, aging work items. The crank→reflex ladder is the same queue with a different claimant (a reflex is a principal with a server-side workbench). Full spec: `active/tokenrip-first-loop-site-gtm-2026-09-04.md`. The text below is preserved as the origin.

**Seed:** Alek messages feature requests ("export admission decisions with diagnostics as CSV"). Instead: he sends them to a Tokenrip inbox; any connected node with a provisioned worker environment claims and processes them — Simon's Claude Code today, but equally Alek's Cowork, because environment setup (clone repo, deps, build, test) is automatable. Generalizes to a public "mechanical turk for LLMs" / permissionless crank.

**What it dissolves — the worker's identity.** Skill externalizes into three attachable things: the model (commodity), the environment (provisionable), the context (the brain). "Alek knows nothing about code" is irrelevant; knowing-the-codebase was environment + context all along. What stays role-specific is **authority** (review gates, approvals, tokens). The queue routes by authority tier, not skill: **humans hold gates, harnesses hold throughput, the queue matches.** A new org shape.

**Completes the OS frame.** Brain=filesystem, modules=programs, terminals=shells, reflexes=daemons, inbox=notifications — the work queue is the **scheduler**, with lease semantics. Quintel triage already runs this state machine in production for one task type (claim/release, needs-review routing, latest-verdict-wins): the second real instance of the work-order shape (rule-of-three counter: 2).

**The crank framing draws the boundary.** The crypto crank works because the contract verifies the result — the executor is untrusted; the state machine is the authority (same as "app owns state machine / model owns judgment / boundary is a reviewable batch"). Therefore: **permissionless execution extends exactly as far as machine-verifiable acceptance criteria** (tests pass, build green, schema validates, preview clean). Above that line — design judgment, ambiguity — authority gates and named humans ("needs review" → Simon). The line moves down as positions and evals accumulate.

**Public version = spare-cognition economics, blocked twice.** Idle flat-rate capacity (SETI@home for LLM subscriptions) is real; blockers are provider ToS (reselling subscription capacity) and bidirectional trust (a stranger's work order in your env = malware vector; your code in a stranger's env = IP leak). LLM nondeterminism means public-scale verification needs redundant execution or staked review — expensive. Sequence: **team-internal (trusted principals; basically buildable — it's Alek's inbox) → federated partners → public (blocked on verification economics).**

**New primitive implied — the workbench spec, a fourth attachment on principals:** repo access + setup recipe + verification command, alongside (slice, projection, derived layer). Hiring an agent = imprint + slice + projection + workbench. Environment provisioning is what makes capability portable to a non-expert's harness.

---

## 6. Open questions and further directions

**Decide early (cheap now, brutal later):**
1. **Personal-brain ownership line.** Does the derived layer leave with the principal? Consumer hook ("your brain follows you") + bottom-up adoption path (individuals bring brains; the company brain forms around them — Slack pattern) vs. company-IP objection. Now precisely statable: *what walks out is the derived layer.*
2. **Vocabulary-tree audit** before nouns fossilize: brain / positions / terminal / module / projection / slice / work order. ("Brain is the noun, not the headline" — don't lead with "company brain," the most crowded phrase in enterprise AI.)

**Design next:**
3. **Extraction/interview design for the mirror** — specificity tuning, confidence labels, tension-surfacing, thin-site interview fallback. The whole funnel lives or dies here.
4. **Salience-profile mechanics** — where does it live (imprint default + mount-local override?), and do learned salience maps (retrieval logs segmented by projection) feed back automatically or via reviewed consolidation?
5. **Reflex runtime + inbox UX** — the minimal Tokenrip-side scheduler; "what does my brain need from me" at terminal-connect. This is the paywall, so it's also the pricing design.
6. **Consolidation as a first-class module** — name it, template it (hermes is the prototype); it is what separates a flywheel from a shelf.

**Watch for pull (do not build ahead of it):**
7. **Work-order primitive + generic work queue** (§5, §5.1) — ~~still pull-gated, watch for the third~~ **gate cleared 2026-09-04** (instances: Quintel triage, Alek's issue inbox, transcript tasks, cadence tasks). Moved to "build": see §5.1 update and `active/tokenrip-first-loop-site-gtm-2026-09-04.md`. Corollary: **the inbox is the product's daily surface** ("3 things landed while you were away"), not a §1.4 footnote; the reflex runtime is what fills it without a human.
8. **Module marketplace / npm-for-skills** — the imprint+projection portability contract makes it real; needs density first.
9. **Task-conditioned retrieval** (projection rungs 3–4) — only if declared-salience + query-conditioning demonstrably fail.
10. **Guards** (positions as pre-action checks) — cheap; build when a regulated buyer asks.

**Distribution (the known gap):** the ICP decision makes Tokenrip a volume game with no distribution machine yet. Candidate motions consistent with this synthesis: the mounted public brain as docs (every visitor demos the product), day-zero/company-formation moment ("your brain is your first hire" — the Atlas-adjacent wedge), the Quintel case study, and the June wrapper catalog discipline (every piece of content ships something mountable). Needs its own session.

---

*Captured from Bean sessions 2026-08-29 → 2026-09-01. Companion files: [[brain-projections]], [[workspace-brain]], [[semantic-workspaces-multiplayer]], [[substrate-gtm-wrappers]], homepage spec `active/tokenrip-homepage-v2-2026-08-30.md`.*
