# Distribution Experiment Plan — Week of 2026-04-22

**Purpose:** Structured experiment plan to drive first Tokenrip adoption. Test multiple distribution channels, measure signal, double down on what works.

**Success metric:** CLI install + agent registration (API key created). Progressive signals (thread created, asset published, share link generated) are tracked but channels are graded on the baseline conversion.

**Exit criteria per experiment:** <10 CLI installs across all attempts within 2 weeks → kill the experiment.

---

## Strategic Framework

### Distribution Requires Two Layers

Every distribution experiment decomposes into two layers:

1. **Conversion content** — the thing that turns curiosity into an install. For Tokenrip, this is an experience-driven approach: live Tokenrip artifacts people interact with directly. The product IS the demo. (Not tutorials. Not pitch decks. Working artifacts.)
2. **Distribution channels** — the things that put conversion content in front of people. Twitter, Reddit, Discord, communities. These generate awareness, but only convert if the content they point to is compelling.

### The Tokenrip-Native Advantage

The strongest distribution experiments are ones where the distribution mechanism IS the product in use. Every link shared is a product demo. Every artifact created showcases the collaboration surface. This is the Figma/Calendly dynamic — the product spreads through usage, not marketing.

### Dogfooding as Strategy

Each experiment runs on Tokenrip itself. The tools, workflows, and coordination patterns used to execute distribution experiments ARE the product being distributed. Every friction point is a product bug. Every workflow that emerges is a recipe for future users.

---

## Experiment Slate — First Batch

Three experiments, running in parallel. Different enough to test different assumptions.

| | Workflow 2: Content Amplifier | Workflow 1: Agent Document Collaboration | Workflow 3: Recipe SEO |
|--|------|------|------|
| **What** | Turn trending AI tweets into installable skills/templates/prompts | Multiple agents collaboratively build a document with visible conversation, version history, and change attribution | Step-by-step workflow guides posted in communities |
| **Distribution channel** | Twitter (quote-tweets/replies) | Reddit, Discord, Twitter (secondary) | Reddit, community forums, docs SEO |
| **Assumption tested** | People will install Tokenrip to use an artifact that makes someone else's idea actionable | Watching agents autonomously collaborate on a document — with visible reasoning and versioning — is compelling enough to drive installs | People searching for "how do I do X with agents" will follow a recipe that includes Tokenrip |
| **Effort per unit** | Low-medium (~1hr per artifact) | Medium (system build, then low per instance) | Medium (per recipe, then low to distribute) |
| **Exit** | <10 installs in 2 weeks | <10 installs across 5 instances in 2 weeks | <10 installs in 2 weeks |

**Priority order:** Workflow 2 first (this week), Workflows 1 and 3 to follow.

**Not in first batch (and why):**
- AI influencer outreach — slow, depends on others' timelines. Revisit when social proof exists.
- LinkedIn page — wrong audience for CLI installs at this stage.
- Moltbook — signal gathering, not distribution. Keep running in background.

---

## Workflow 2: Content Amplifier — Detailed Design

### Overview

Find trending AI tweets that describe a workflow, technique, or idea. Turn them into a working artifact (skill, template, prompt) that people can install through Tokenrip. Post the link as a reply or quote-tweet. The artifact IS the install funnel — wanting to use it requires the CLI.

### The Loop

```
Scout → Draft → Review → Publish → Measure
  ↑                                    |
  └────── learnings feed back ─────────┘
```

### Phase 1: Scout

**Week 1:** Manual. Alek monitors Twitter, drops tweet URLs into a standing Tokenrip review thread with a one-liner on what kind of artifact it could become.

**Week 2+:** Automated scout agent monitoring Twitter and Reddit for posts matching criteria:
- AI/agent space, high engagement
- Describes a workflow, technique, or idea (not just opinion or memes)
- Can be turned into an actionable artifact

Scout criteria tighten over time based on which picks actually convert.

**Alek's manual picks in week 1 become the training data for what the automated scout should look for.**

### Phase 2: Draft

A shared **"Amplifier" skill** lives as a Tokenrip asset. Both Simon's and Alek's agents can pull and execute it.

- **Input:** Tweet URL + artifact type (skill, template, prompt)
- **Process:** Agent reads the tweet, understands the core idea, builds the artifact
- **Output:** Draft asset published to the review thread

The skill itself is iterable. When output quality is low, the skill gets updated — not just the individual artifact. The production methodology evolves through use.

**Artifact types (in order of priority):**
1. **Skills** — installable via CLI, immediately useful. Strongest install trigger.
2. **Prompt templates** — copy-paste or pull through Tokenrip. Low friction.
3. **Structured templates/checklists** — reference material packaged as a clean asset.

Agent workflow configs are excluded from v1 — too complex to produce reliably at speed.

### Phase 3: Review

Alek reviews drafts in the Tokenrip thread. Three possible responses:

| Response | What Alek does | What happens next |
|----------|---------------|-------------------|
| **Ship it** | Approves in thread | Asset goes public, tweet gets drafted |
| **Fix this** | Comments what's wrong | Agent revises, posts updated draft |
| **Kill it** | Rejects | Move on to next candidate |

**Alek's job is editorial judgment, not production.** He answers: "Would I use this? Does it make the original poster's idea more useful?" If no, he says what feels off. The agent iterates.

**Quality rubric — three checks before shipping:**
1. **Does it work?** Can someone actually use this skill/template/prompt right now?
2. **Does it stand alone?** Someone who never saw the original tweet gets value.
3. **Is the install path obvious?** The page makes clear how to pull this into your own setup.

### Phase 4: Publish

Two things happen when Alek ships:

1. **Asset goes live on Tokenrip** with a public link
2. **Tweet goes out** — short, focused on the artifact's value, not on Tokenrip. Tone: someone in the replies who built the thing, not a brand account promoting itself.

Example tweet tone: *"You described X. We turned it into a skill you can install in 30 seconds: [link]"*

**Not:** *"Check out how Tokenrip can help you share AI artifacts!"*

### Phase 5: Measure

**Per asset:**
- Did the original poster engage? (like, retweet, reply)
- Link clicks on the Tokenrip URL
- Organic spread (others sharing)

**Weekly rollup:**
- Total assets shipped
- Total CLI installs (not yet attributed per-asset — tracked as aggregate lift)
- Patterns: which tweet topics, artifact types, and posting styles correlated with engagement

Learnings feed back into scout criteria and skill quality.

---

## Operational Plan — This Week

| Day | What | Owner |
|-----|------|-------|
| Day 1 | Build the Amplifier skill as a shared Tokenrip asset | Simon |
| Day 1 | Set up the review thread on Tokenrip | Simon |
| Day 2 | Alek scouts 2-3 tweet candidates, drops URLs into review thread | Alek |
| Day 2-3 | Run the Amplifier skill on first candidate, produce draft | Both agents |
| Day 3-4 | Alek reviews, iterates until ship-ready | Alek |
| Day 4-5 | Publish first asset, post tweet, note baseline install numbers | Alek |
| End of week | Retro: what worked, what broke, what needs to change in the skill | Both |

**Target: one value-add asset live and tweeted by end of week.** Not five. The first cycle surfaces every friction point. Debug on one, then increase volume.

---

## What This Strategy Is Really Testing

Beyond distribution, this experiment tests three deeper hypotheses:

1. **Can a non-technical operator (Alek) run an agent-assisted content pipeline using Tokenrip's collaboration surface?** If yes, that's a workflow recipe for other users. If no, that's a product gap to fix.
2. **Can the production skill itself improve through collaborative iteration on Tokenrip?** If yes, that validates the "shared mutable asset" model for team coordination.
3. **Does the platform improve as a byproduct of running distribution experiments?** Every friction point discovered is a product insight. The dogfooding thesis is that distribution work and product development are the same activity.

---

## Related Documents

- [[distribution-strategy]] — Strategic distribution architecture, viral loop design, branding tiers
- [[tokenrip]] — Product architecture, build plan, moat strategy
