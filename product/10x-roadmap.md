# 10x Roadmap — AI-Native Operations

**Status**: Active
**Created**: 2026-04-08
**Owner**: Simon
**Time budget**: 5-10 hours/week (hard-scheduled blocks)
**Review cadence**: Weekly (Yoda-tracked)

## Purpose

Make RebelFi progressively AI-native by building systems where Simon's attention is the steering wheel, not the engine. The company should make progress on multiple fronts simultaneously — even when Simon is focused on operations, cleanup, or pipeline work.

**The measure of success is not completing this roadmap. It's the progress bar moving every week.**

## Operating Principles

1. **One track leads, others trail.** Don't try to advance everything simultaneously. Track 1 (Build Machine) comes first because it multiplies capacity for everything else.
2. **Small wins count.** A 30-minute stage completion is real progress. Don't wait for 4-hour blocks to start.
3. **The plan construction IS the work.** Simon designs detailed implementation specs. Agents implement. The 5-10 hours/week is mostly thinking and designing.
4. **Feed the wiki, don't build the wiki.** The Intelligence Engine stays alive through casual feeding (articles, repos, codebases encountered during normal work), not dedicated maintenance sessions.

---

## Track 1: Build Machine

*Tokenrip (and future projects) ship faster with less direct attention.*

### 1.1 Auto-Deploy for Tokenrip
- **What**: Extend existing RebelFi deployment system to cover Tokenrip
- **Effort**: Small (half-day)
- **Depends on**: Nothing — ready now
- **Done when**: `git push` or plan completion triggers auto-deploy to production
- **Status**: Not started

### 1.2 Blog/Content Deployment System
- **What**: System to easily publish articles/content that agentic systems can reference and discover. Part of Tokenrip distribution strategy (SEO, thought leadership, agent-discoverable content).
- **Effort**: Medium (design + implement)
- **Depends on**: 1.1 (deploy infrastructure)
- **Done when**: Can publish a markdown article and have it live on the web within minutes
- **Status**: Not started

### 1.3 Plan-to-Implementation Pipeline
- **What**: Improve the workflow from "Simon writes detailed implementation spec" → "agent implements" → "review agent validates" → "auto-deploys." The methodology exists. The infrastructure needs polish — quality gates, automated testing, deployment triggers, review workflow.
- **Effort**: Ongoing improvement (not a single milestone)
- **Depends on**: 1.1 (deploy), existing review agent
- **Done when**: Never "done" — improves incrementally. First milestone: one Tokenrip feature goes from plan → agent implementation → review → deploy without Simon touching code.
- **Status**: Partially exists (review agent works, deployment system exists for RebelFi)

---

## Track 2: Intelligence Engine

*The company has eyes and ears beyond Simon's attention span.*

### 2.1 AI/Agentic Landscape Wiki → Intelligence Engine
- **What**: Evolved from Karpathy-style wiki into an agentic knowledge marketplace. Structured intelligence about the agentic landscape, queryable by humans and agents, personalized through user-published context, enriched by community discussion. Built on Tokenrip as infrastructure. See [[intelligence-engine]] for full vision and [[intelligence-engine-design]] for technical architecture.
- **Effort**: Medium to set up (afternoon for structure + initial seed). Low ongoing (feed it casually). Phases expand scope over time.
- **Depends on**: Tokenrip (sufficient state to publish and render assets)
- **Seed sources**:
  - Simon's Twitter reading list (backlog of articles he wishes he had time to read)
  - Existing vault research (`__PROJECTS/agentic-economy/`, competitive analyses, landscape docs)
  - Key repos and codebases encountered during work
  - Initial knowledge domain: harness engineering (Simon's immediate need + broad demand)
- **Done when**: Phase 1 — blog live on Tokenrip with pillar posts + initial wiki-derived content. Phase 2 — query interface producing decision-ready responses. Phase 3 — context publishing + community threads active.
- **Status**: Vision defined (2026-04-10), ready to build

### 2.2 Researcher Agents
- **What**: Agents that monitor sources on a schedule and feed the wiki. Scan key repos for releases, track AI tool launches, monitor competitive landscape.
- **Effort**: Medium (define sources, build ingest pipeline, schedule)
- **Depends on**: 2.1 (wiki must exist to receive output)
- **Done when**: At least one researcher agent runs on schedule and produces wiki updates without Simon initiating it.
- **Status**: Not started (ad hoc research agents have been used but not scheduled/persistent)

### 2.3 Signal-to-Action Routing
- **What**: Wiki insights become actionable — a new competitive threat triggers a plan, a new tool triggers an integration exploration, a new platform triggers agent deployment consideration.
- **Effort**: Large (requires judgment layer)
- **Depends on**: 2.1 + 2.2 + Track 1 maturity
- **Done when**: A wiki insight has led to a concrete plan or decision without Simon manually discovering it.
- **Status**: Future — emerges from mature wiki + build pipeline

---

## Track 3: Agent Deployment

*Agents operating in the world, learning coordination mechanisms, dogfooding Tokenrip.*

### 3.1 Deploy Social Agent (Baseline)
- **What**: Deploy a capable agent (OpenClaw or Hermes) to Agent Commune and Multibook. Initially: presence, interaction, learning how agent-to-agent coordination works on these platforms.
- **Effort**: Medium (configure, deploy, test interactions)
- **Depends on**: Understanding platform APIs/norms
- **Platforms**: Agent Commune, Multibook (identified as the two current social platforms for agents)
- **Done when**: An agent is live on at least one platform, interacting with other agents, and reporting back what it learns.
- **Status**: Not started (OpenClaw exists as infrastructure)

### 3.2 Coordination Research Agent
- **What**: Agent that specifically explores coordination mechanisms — how do agents discover each other, negotiate, exchange assets, establish trust? This is direct market research for Tokenrip.
- **Effort**: Large (R&D-flavored, novel)
- **Depends on**: 3.1 (baseline agent deployed)
- **Done when**: Agent has produced insights about agent coordination patterns that inform Tokenrip product decisions.
- **Status**: Future

### 3.3 Expand Agent Capabilities
- **What**: Based on intelligence (Track 2) and coordination learnings (3.2), expand what deployed agents can do. New platforms, new capabilities, new coordination patterns.
- **Effort**: Ongoing
- **Depends on**: 3.1 + 3.2 + Track 2 maturity
- **Status**: Future

---

## Progress Tracker

### What Already Exists (Credit Where Due)

These are steps on the 10x roadmap that Simon has already taken, even if they weren't framed this way at the time:

- [x] RebelFi deployment system (auto-deploy exists for main platform)
- [x] Review agent for code validation (exists, needs beefing up)
- [x] Plan construction methodology (detailed specs → agent implementation)
- [x] Agent OS foundation (roles, protocols, some deployment config)
- [x] QMD local search over vault (636 markdown docs, keyword + vector search)
- [x] Researcher agents (ad hoc — competitive analyses produced by agents)
- [x] Closer agent for deal execution (AI-native sales operations)
- [x] Skills/slash commands in daily workflow (Claude Code, Yoda, research, etc.)
- [x] OpenClaw infrastructure (Telegram agent exists)

**Estimated starting position: ~25% of the way to AI-native operations.**

### Weekly Log

| Week | Hours | What Got Done | Stage(s) Advanced |
|------|-------|---------------|-------------------|
| Apr 7-13 | Target: small win | TBD | TBD |

---

## Recommended Sequencing

**Weeks 1-2**: 1.1 (auto-deploy Tokenrip) + 2.1 (wiki setup + initial seed)
**Weeks 3-4**: 1.2 (blog system) + 2.1 continued (ingest Twitter backlog, vault research)
**Weeks 5-6**: 1.3 first milestone (one feature plan → agent → review → deploy) + 2.2 (first researcher agent)
**Weeks 7-8**: 3.1 (deploy social agent to Agent Commune or Multibook)
**Ongoing**: Feed wiki, improve pipeline, expand agent capabilities

This sequencing is a guide, not a rail. Adjust based on what operations demand and where energy naturally flows. The only rule: **something advances every week.**

---

## This Week (Apr 7-13): Small Win

**Constraint**: Limited time due to Drift cleanup + personal issues (~1.5 days lost).

**Minimum viable progress**: Pick ONE of these:
- [ ] Set up wiki directory structure + schema (2.1 — 1-2 hours)
- [ ] Extend deploy system to Tokenrip (1.1 — 2-3 hours)

Either one moves the progress bar. Either one is a win.

---

## Related Documents

- [[tokenrip]] — Primary build target, benefits from Track 1
- [[distribution-strategy]] — Blog system (1.2) serves this directly
- [[tokenrip-exploration]] — Strategic context
- `__PROJECTS/agent-team/` — Agent OS foundation (feeds Track 1)
- `__PROJECTS/agentic-economy/` — Research that seeds Track 2

