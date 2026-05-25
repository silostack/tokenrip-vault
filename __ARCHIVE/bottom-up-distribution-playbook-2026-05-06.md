# Bottom-Up Distribution Playbook

**Status**: Active execution
**Owner**: Simon
**Created**: 2026-05-06
**Companion docs**: [[../bd/audience-led-gameplan]] (Motion E — Alek owns), [[../bd/motions-and-strategy]] (strategic context), [[../distribution/distribution-plan-2026-04-27]] (registry/community push), [[../bd/icps]] (ICP taxonomy)

---

## What This Is

Simon's execution playbook for testing bottom-up distribution angles for Tokenrip — Motion D (builder-direct) and adjacent demand-side experiments. Alek runs Motion E (audience-led creator deployment) per the audience-led gameplan. This doc covers what Simon runs in parallel.

**Timeframe**: 8 weeks. Accelerator decisions (YC + others) land within this window. Every experiment here produces signal that either strengthens accelerator conversations or informs a strategic pivot if they don't land.

**Constraint**: two-person team. Every experiment runs on Tokenrip infrastructure (dogfooding). No experiment requires more than one week of build before producing signal.

---

## The Four-Test Framework

"Bottom-up distribution" is not one question. It is four:

| Test | Question | What validates it |
|------|----------|-------------------|
| **Supply** | Will someone with a real workflow/methodology package it as a mounted agent? | A real person brings a real workflow and agrees to deploy it |
| **Distribution** | Will they share it with their users/audience? | The builder actively promotes the deployed agent to their people |
| **Usage** | Will operators mount and use it repeatedly? | Return rate, session count, memory growth per operator |
| **Revenue** | Will either builder or operator pay for tooling? | Someone upgrades to a paid tooling tier or negotiates pricing |

**Every experiment below is tagged to which test it serves.** A Product Hunt launch tests attention, not supply. A CLI page tests developer curiosity, not revenue. Know which question you're answering before you run the test. If the signal doesn't map to one of these four, it's vanity.

**Sequencing**: Supply and distribution must validate before usage and revenue can be measured. Don't skip ahead — "nobody is paying" is not a useful signal if nobody has deployed anything yet.

---

## The Experiments

### Experiment 1: Static Workflow → Mounted Agent Conversion

**Tests**: Supply + Distribution
**Target ICP**: Static Workflow Seller (secondary: Creator with Audience, if they have one)
**Priority**: Start immediately
**Effort**: ~3 days setup, then ongoing outreach

**Thesis**: People already selling/distributing AI workflows (prompt packs, Notion templates, consulting methodologies, ClawMart-style agents, AI course creators) have already solved the supply and distribution problems. The question is whether the mounted-agent upgrade is compelling enough to switch.

**Actions**:
1. Identify 10-15 people currently selling static AI workflows. Sources:
   - ClawMart sellers (the platform is dying — sellers are looking for alternatives)
   - Gumroad/Lemon Squeezy AI product sellers
   - AI consultants selling methodology packages
   - Prompt-pack sellers on Twitter/X
   - Notion template creators with AI-related templates
   - Course creators teaching AI workflows
2. Reach out with a specific offer: "We'll convert one of your existing AI workflows into a mounted agent with persistent memory, versioning, and cross-platform portability. Free. You keep the agent and your audience."
3. For the first 2-3 who say yes, do the conversion personally (Simon-assisted, same white-glove process as Motion E).
4. Track whether they actually share the result with their audience.

**Success signal (2 weeks)**: 3/10 say yes. 1-2 bring a real workflow. At least 1 agrees to share publicly.
**Kill signal**: Zero interest after 10 outreach. Or: interest but every workflow brought is too thin to be a real agent (just a system prompt, no methodology depth).
**What you learn either way**: Whether there's a supply of packageable expertise outside the creator/audience ICP that Motion E targets.

---

### Experiment 2: Power-User Upgrade Path

**Tests**: Usage (directly) + Revenue (indirectly)
**Target ICP**: New Normal Worker + platform power users (secondary: AI Enabler, if they're doing this at work)
**Priority**: Start immediately — fastest to signal
**Effort**: ~1 day setup, then daily engagement

**Thesis**: Claude Cowork, ChatGPT, and Perplexity Computer power users are already building agent workflows and losing everything every session. The pain is public (Twitter/Reddit frustration posts). Tokenrip's persistence layer solves this without asking anyone to leave their platform.

**The pitch**: "Your agent forgets everything every session. Fix that in 5 minutes."

**Actions**:
1. Set up a simple tutorial/guide: "How to make your Claude/ChatGPT agent persistent with Tokenrip" — publish as a Tokenrip asset (dogfooding + the tutorial IS the demo).
2. Search Twitter/Reddit daily for frustration signals:
   - "Claude Cowork keeps forgetting..."
   - "My Custom GPT lost all context..."
   - "ChatGPT agent doesn't remember..."
   - "Perplexity Computer is stateless..."
   - "I wish my agent could remember..."
3. Reply to 3-5 threads per day with the working solution. Not a pitch — an actual fix. Link to the tutorial asset.
4. Track: clicks, installs, return visits, and — critically — whether anyone comes back and asks for more.

**Success signal (2 weeks)**: Any organic inbound beyond the threads you replied to. Anyone asking "can I do X with this?" unprompted. Repeat users.
**Kill signal**: 50+ thread replies, zero clicks. Or: clicks but zero installs (funnel is broken). Or: installs but zero return (the persistence layer isn't actually valued).
**What you learn either way**: Whether "persistence for existing agents" is a real pull or a theoretical one. And whether the audience is developers (they install the CLI) or non-technical (they need something else).

---

### Experiment 3: "Build an Agent" Video

**Tests**: Supply (indirectly — attracts potential builders) + Distribution (if it goes viral)
**Target ICP**: Broad — attracts all builder ICPs (non-coding use cases especially resonate with AI Enablers)
**Priority**: Ship within first week
**Effort**: ~1 day to record and post

**Thesis**: The lovable-style "describe what you want, watch it get built" moment is the highest-leverage single piece of content you can produce. If it lands, it creates inbound for every other experiment.

**Actions**:
1. Record a 5-10 minute screencast of building a vertical agent from scratch using the build-an-agent skill. Pick a non-coding use case that's immediately legible: "AI sales coach," "AI content strategist," "AI research analyst."
2. Show the full arc: describe the expertise → skill packages it → agent is deployed with memory/tools/public URL → demonstrate it working across different runtimes.
3. Post on: Twitter/X, Reddit (r/AI_Agents, r/SaaS, r/Entrepreneur, r/ClaudeAI), Hacker News (Show HN).
4. End with a clear CTA: "What would you build? Tell us." Link to the builder landing page (Experiment 5).

**Success signal**: DMs/replies asking "can I do this for [my domain]?" — that's Population B self-selecting. 1,000+ views with 5+ serious inbound inquiries.
**Kill signal**: <500 views across all channels, zero inbound. (Doesn't kill the thesis — might just mean the video wasn't good or the channels were wrong. Retry once with different angle before killing.)
**What you learn either way**: Whether "build an agent in 10 minutes" is a legible value proposition to non-developer audiences. The *type* of replies tells you who the buyer actually is.

---

### Experiment 4: Builder Landing Page with Signal-Sorting CTAs

**Tests**: Supply (which type of builder exists)
**Target ICP**: Signal-sorting across all builder ICPs — the CTA data reveals which ICP is real
**Priority**: Ship within first week (capture destination for all other experiments)
**Effort**: ~1 day to build

**Thesis**: "I want to build an agent" is too broad. There are at least three distinct builder populations, and knowing which one is real determines everything downstream.

**Actions**:
1. Build a "Build on Tokenrip" page (this is the CLI page, reframed). Three sections, each with a distinct intake CTA:
   - **"I have an audience"** — "Deploy your expertise as a mounted agent your audience can use anywhere." → Intake form: who are you, what's your audience, what do you teach/advise on?
   - **"I have a workflow"** — "Turn your AI workflow into a persistent, versionable agent product." → Intake form: what's the workflow, who uses it, how do you distribute it now?
   - **"I have a vertical agent idea"** — "Build a vertical AI business on Tokenrip's infrastructure." → Intake form: what vertical, who's the buyer, what have you built so far?
2. Each form routes to a different response flow (even if it's just email initially).
3. Link this page from every other experiment, every blog post, every distribution surface.
4. Track submissions per CTA weekly.

**Success signal (4 weeks)**: 10+ total submissions. Concentration in one CTA over the others (tells you where demand actually lives).
**Kill signal**: Zero submissions after 4 weeks with consistent traffic from other experiments.
**What you learn either way**: Which builder population is real. Bet: "I have a workflow" outperforms "I have a vertical agent idea." If "I have an audience" wins, that's just Motion E arriving through a different door.

---

### Experiment 5: Direct Outreach to Vertical AI Builders

**Tests**: Supply + Revenue
**Target ICP**: Vertical AI Builder
**Priority**: Source week 1, outreach week 2
**Effort**: ~2 hours sourcing, ~1 hour outreach per batch

**Thesis**: People already building vertical AI agents on raw APIs are doing the hard work Tokenrip already solves. They're fighting with memory, identity, persistence, and deployment. If tokenrip can accelerate them, that's a paid-pilot-grade signal without the Motion A problems.

**Actions**:
1. Find 10-15 people/teams building vertical AI agents (not coding agents). Sources:
   - Twitter/X search: "building AI agent for [vertical]," "AI employee," "launched my AI [role]"
   - Product Hunt: recently launched vertical AI products (look for scrappy/early-stage)
   - Indie Hackers: "AI agent" projects
   - Hacker News: "Show HN" posts with vertical AI tools
2. Direct outreach: "I saw you're building [X]. We built infrastructure that handles persistence, memory, identity, and tooling so you don't have to. Would you try it for [specific pain point you can identify from their product]?"
3. For any who engage: offer hands-on onboarding. The goal is one real vertical agent deployed on tokenrip infrastructure.

**Success signal**: 1 builder actively using tokenrip as their base layer within 4 weeks. Ideally: a builder who would pay for the tooling tier.
**Kill signal**: 10+ conversations, zero adoption. (Diagnose: is the infrastructure not ready? Is the onboarding too hard? Or is there just no demand?)
**What you learn either way**: Whether Motion D is real with active sales or only works as passive blog-funnel inflow. One paying builder here is worth more than 1,000 registry listings.

**Why this isn't Motion A**: Motion A sold workflow automation to end-firms (tax firms, law firms) — the buyer used the agent internally and Tokenrip was the application layer. This experiment sells infrastructure to agent *builders* — the buyer builds a product on Tokenrip that serves *their* customers. Tokenrip is the substrate, not the application. The architectural test passes because the builder specifically needs what hosted platforms can't give them (portability, BYO economics, persistent memory).

---

### Experiment 6: Bounty/Challenge

**Tests**: Supply + Distribution
**Target ICP**: Vertical AI Builder + technical builders
**Priority**: Week 3-4 (after experiments 1-4 produce initial signal)
**Effort**: ~half day to design and post

**Thesis**: A specific build challenge attracts a different population than passive documentation — people who want a reason to try something.

**Actions**:
1. Pick 3 vertical agent ideas that are clearly valuable, clearly non-coding, and clearly buildable on current tokenrip primitives. Examples:
   - "AI real estate market analyst" — tracks listings, answers buyer questions, remembers preferences
   - "AI podcast research assistant" — ingests episodes, builds guest profiles, suggests questions
   - "AI sales coach" — reviews call notes, suggests improvements, tracks patterns over time
2. Post as a challenge: "Build one of these on Tokenrip. First person to deploy each gets $500 + featured on the platform."
3. Provide a starter template (bootloader + basic imprint structure) to reduce friction.
4. Post on Twitter, Indie Hackers, r/AI_Agents.

**Success signal**: 5+ attempts, 1+ completed deployment.
**Kill signal**: Zero attempts (demand isn't there or the challenge is too hard). Adjust and retry once: simpler challenge, more support, different channels.
**What you learn either way**: Whether "agent builder" is an identity anyone claims yet, or whether the market needs more education first.

---

### Experiment 7: Published-but-Blind Upgrade

**Tests**: Supply (converting existing agents) + Usage (do operators return with visibility layer?)
**Target ICP**: Published but Blind — people who already shipped an agent/skill/GPT and have no feedback mechanism
**Priority**: Start immediately — first test case (YC investor) already in hand
**Effort**: ~half day per conversion, then ongoing

**Thesis**: People who already published an agent, skill, Custom GPT, or OpenClaw soul have solved supply and distribution. They shipped something into the world. But they're flying blind — no analytics, no usage data, no query patterns, no way to iterate. The GPT Store's analytics are useless. Claude Code skills have zero telemetry. OpenClaw souls ship into a void. Tokenrip gives them the visibility layer that turns a static published artifact into a product they can see and improve.

**The pitch**: "You published this. People are using it. You have no idea who, how often, or what they ask. You're giving away your expertise into a void. Here's what it looks like when you can see."

**Actions**:
1. Identify people who published agents/skills and went quiet. Sources:
   - Claude Code skill authors (search GitHub/npm for published skills packages)
   - Custom GPT builders hitting the GPT Store analytics wall (search Twitter for GPT Store frustration)
   - OpenClaw soul publishers
   - Anyone who tweeted "launched my AI [thing]" 2-8 weeks ago and then went silent
   - People who published Claude Code commands/skills to public repos
2. For each: take their existing published artifact, mount it as a Tokenrip imprint (preserving their content), and show them what visibility looks like — operator counts, usage patterns, memory growth.
3. First test case: YC investor with published office hours skill. Build his agent on Tokenrip, publish it, show him how to run it from Claude, demonstrate the analytics/data-back layer.
4. Track: conversion rate from outreach, whether they share the upgraded version, whether they iterate based on the data they now see.

**Success signal (3 weeks)**: 2-3 conversions from 10 outreach. At least 1 person iterates on their agent based on usage data (proving the visibility layer has pull). The YC investor engages meaningfully.
**Kill signal**: 10+ outreach, zero interest. Or: interest but the visibility layer doesn't change behavior (they see the data but don't act on it — meaning visibility isn't the real pain).
**What you learn either way**: Whether "published but blind" is a real pain point or a theoretical one. Whether the upgrade from "static published artifact" to "living agent with visibility" is compelling enough to drive action. Whether this population overlaps with Motion E (Published but Blind builders who also have audiences are Motion E candidates).

**Why this is distinct from Experiment 1**: Experiment 1 targets people selling static *workflows* (prompt packs, templates, consulting methodologies) — they haven't shipped an agent yet. Experiment 7 targets people who already *shipped an agent* and are now blind to its usage. Different pain, different pitch, different population. Experiment 1 is "upgrade your workflow into an agent." Experiment 7 is "upgrade your agent into a product you can see."

---

## Bridge Term: How to Talk About This

"Mounted agent" is architecture language. Buyers don't speak architecture. The bridge term — what you call the thing in buyer-facing contexts — matters more than it seems because it determines who self-selects in.

| Term | Attracts | Risk |
|------|----------|------|
| "AI agent" | Everyone / nobody | Too generic, conflicts with coding agents |
| "Workflow agent" | Automation people (Zapier/Make crowd) | Misses the expertise/judgment use cases |
| "Expertise agent" | Consultants, educators, analysts | Might be too niche |
| "AI employee" | Non-dev buyers, SMBs | Proven by Sintra/11x but overpromises |
| "Your AI, portable" | Power users hitting platform lock-in | Descriptive, not a category |

**Working hypothesis**: use different bridge terms for different experiments. "Turn your workflow into a mounted agent" for Experiment 1. "Make your AI persistent" for Experiment 2. "Build an AI agent" for Experiment 3. Track which framing produces the strongest response. The market will tell you the bridge term — don't lock it prematurely.

---

## Sequencing

```
WEEK 1                    WEEK 2                    WEEK 3-4
─────────────────────     ─────────────────────     ─────────────────────
Exp 2: Start replying     Exp 1: First outreach     Exp 6: Launch bounty
to frustration threads    to workflow sellers        (if earlier experiments
                                                    show life)
Exp 3: Record + post      Exp 5: First outreach
"build an agent" video    to vertical AI builders   Exp 7: Expand to more
                                                    published-but-blind
Exp 4: Ship builder       Exp 2: Continue daily     targets beyond YC
landing page w/ CTAs      thread engagement         investor test case

Exp 7: Ship YC investor   Exp 3: Post video to      Review + kill/double-
demo (first test case)    remaining channels        down decisions

                          Exp 7: Read signal from   WEEK 5-8
                          YC investor reaction      ─────────────────────
                                                    Double down on winning
                                                    angles. Kill dead ones.
                                                    Feed signal into
                                                    accelerator updates.
```

**Week 1 is about shipping surfaces** (landing page, tutorial, video) that all subsequent experiments link to.
**Week 2 is about outreach** (workflow sellers, vertical builders, continued thread engagement).
**Week 3-4 is about reading signal** and making kill/continue decisions per experiment.
**Week 5-8 is about doubling down** on whatever produced signal.

---

## Kill Criteria Summary

| Experiment | Kill at | If you see |
|------------|---------|------------|
| 1: Workflow conversion | Week 3 | 10+ outreach, zero interest |
| 2: Power-user upgrade | Week 3 | 50+ thread replies, zero installs |
| 3: Build-an-agent video | Week 2 | <500 views, zero inbound (retry once) |
| 4: Builder landing page | Week 5 | Zero form submissions with consistent traffic |
| 5: Vertical builder outreach | Week 4 | 10+ conversations, zero adoption |
| 6: Bounty/challenge | Week 5 | Zero attempts |
| 7: Published-but-blind upgrade | Week 4 | 10+ outreach, zero interest; or visibility doesn't change behavior |

**When you kill an experiment**: write a 3-sentence postmortem. What was the hypothesis? What actually happened? What does that imply? Don't let dead experiments rot silently — the failure data is strategy input.

---

## How This Feeds Back

- **Signal from these experiments informs Motion E.** If Experiment 1 surfaces workflow sellers with audiences, they're Motion E candidates for Alek's pipeline.
- **Signal informs accelerator conversations.** Any traction metric — installs, deployments, paid conversions — goes directly into YC/accelerator updates.
- **Signal informs the "marketplace vs. builder platform vs. infrastructure" positioning question.** Which CTA wins on the landing page? Which bridge term resonates? Which population shows up? The market answers the positioning question — don't answer it prematurely.
- **If nothing works in 8 weeks**: you have concrete data on what didn't work and why. That's better than "we should have tried paid pilots" — and it informs whether Motion A gets reconsidered or whether the issue is deeper.

---

## Related

- [[../bd/audience-led-gameplan]] — Motion E execution (Alek-owned)
- [[../bd/motions-and-strategy]] — Strategic context for all five motions
- [[../distribution/distribution-plan-2026-04-27]] — Registry blitz + community push
- [[../product/tokenrip/mounted-agent-model]] — Architecture reference
- [[../agents/bean/sessions/2026-05-06]] — Session that produced this playbook
