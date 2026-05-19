# Distribution Plan — Week of 2026-04-27

**Purpose:** Organized, actionable distribution push. Be everywhere all at once — hit every easy lift, start 2-3 bigger experiments.

**Source material:** 15-agent research swarm (127k words, Apr 25) distilled into what's actually actionable for a 2-person team. Full report: [Master Findings](https://tokenrip.com/s/39d15a20-43b2-4544-accb-5efc3a12d97b)

**Competitive context:** The window is 6-12 months before Anthropic (Cowork), OpenAI (Canvas), and Google make in-tool sharing good enough. Speed matters.

---

## The Week at a Glance

| Priority   | Category                | Items                     | Owner | Days                           |
| ---------- | ----------------------- | ------------------------- | ----- | ------------------------------ |
| **Tier 1** | Registry Blitz          | 14 submissions            | Alek  | Mon-Tue                        |
| **Tier 2** | Agent-Readable Surfaces | 7 files/fixes             | Simon | Mon-Tue                        |
| **Tier 3** | Onboarding Polish       | 5 fixes                   | Simon | Mon-Wed                        |
| **Tier 4** | Community Push          | HN + 3 Reddit + 3 Discord | Both  | Wed-Fri                        |
| **Tier 5** | Bigger Lifts (pick 2-3) | 4 options                 | Both  | Start this week, run 2-4 weeks |

---

## Tier 1: Registry Blitz

> Highest ROI, lowest effort. Fill out forms, submit PRs. Gets Tokenrip in front of people already searching for tools like this.

**Owner:** Alek
**Timeline:** Mon-Tue

### MCP Registries

Submit Tokenrip MCP server (`https://api.tokenrip.com/mcp`) to each:

- [x] **Anthropic MCP Registry** — the big one. Every Claude product surfaces this catalog.
- [ ] **Smithery** — largest MCP marketplace. Cursor's default search surface.
- [x] **mcpservers.org**
- [x] **Glama**
- [x] **PulseMCP**
- [ ] **mcp.so**

### IDE Directories

- [ ] **Cursor Directory** — MCP listing + `.cursor/rules/tokenrip.mdc` template
- [ ] **Cline MCP marketplace**
- [ ] **Continue Hub** — block + assistant submission

### Awesome Lists (submit PRs)

- [ ] **awesome-mcp-servers** (85.6k stars) — [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)
- [ ] **awesome-claude-code** (41k stars)
- [ ] **awesome-cursorrules** (39.3k stars)

### Housekeeping

- [ ] **GitHub topics audit** — add `mcp`, `ai-agents`, `claude-code`, `ai-collaboration` to all Tokenrip repos
- [ ] **Verify robots.txt** — check for conflicting AI-crawler rules (research flagged ClaudeBot/GPTBot conflicts). Fix if broken.

---

## Tier 2: Agent-Readable Surfaces

> Make Tokenrip discoverable by machines, not just humans. Small files, big impact on AI search visibility.

**Owner:** Simon
**Timeline:** Mon-Tue

### Create

- [x] **`.well-known/agent-card.json`** — A2A protocol discovery file. JSON describing Tokenrip's capabilities and endpoints.
- [ ] **`llms-full.txt`** — expanded `llms.txt` with complete API docs, all tool descriptions, example workflows. LLM crawlers use this as primary surface.
- [x] **Schema.org JSON-LD on asset pages** — `SoftwareApplication` + `WebAPI` + `Article` markup per asset. Structured data gives 30-40% AI-visibility lift per KDD 2024 research.

### Fix/Update

- [ ] **Verify robots.txt** — confirm no conflicting allow/disallow rules for ClaudeBot, GPTBot, PerplexityBot, GoogleOther.
- [ ] **Verify sitemap** — confirm published assets are included. Every asset should be a crawlable page.
- [ ] **Polish `llms.txt`** — add install commands, three primitives with one-liner examples, "get started in 60 seconds" block.

### Seed

- [ ] **AGENTS.md on Tokenrip's own repos** — explain how agents should use Tokenrip. Do this before PRing AGENTS.md into other people's repos.

---

## Tier 3: Onboarding Polish

> The gateway for everything else. Every registry listing, every HN post funnels people here. If this leaks, nothing compounds.

**Owner:** Simon
**Timeline:** Mon-Wed (before community push)

### Critical

- [x] **Fix /docs page** (currently 404) — single page with: install → authenticate → publish first asset → see it live. Four steps. Ship before registry submissions go out.

### First-Run Experience

- [ ] **`is_first_run` flag in `whoami` response** — when an agent calls `whoami` for the first time, return a `next_actions` field suggesting "publish your first asset." Agents are literal — tell them what to do.
- [ ] **First-publish celebration** — make the URL output feel like a moment. Box it, show it clearly.

### Asset Page Affordances

- [ ] **Share buttons** — copy link, open in Twitter, share to Slack. Currently no easy way for viewers to spread an asset.
- [ ] **"Published via Tokenrip" footer** — visible, linkable, pointing to homepage. The free-tier viral mechanic. Calendly/Loom playbook.

---

## Tier 4: Community Push

> Go from "listed" to "noticed." Put Tokenrip in front of people who aren't searching yet.

**Timeline:** Wed-Fri (after Tiers 1-3)

### The Anchor: Show HN

> [!important]
> Don't post until registry blitz and onboarding polish are done. HN traffic is a spike, not a stream. If people click through and hit broken onboarding, the shot is burned.

- [ ] **Title:** "Show HN: Tokenrip — persistent URLs for AI agent output" (concrete, not buzzy)
- [ ] **Post:** Tuesday or Wednesday, 8-9am PT
- [ ] **Camp comments** for 4+ hours — every question answered fast
- **Owner:** Simon posts, both camp

### Reddit (one per subreddit, different angles)

Every post must be a demonstration, not an announcement. Link to a real Tokenrip asset that IS the demo.

- [ ] **r/ClaudeAI** — "Here's how I share Claude Code output with my team" — workflow demo
- [ ] **r/cursor** — `.cursorrules` snippet or MCP integration demo
- [ ] **r/AI_Agents** — cross-framework angle: "One URL whether the asset came from Claude, Cursor, or CrewAI"
- **Owner:** Alek

### Discord (low-key, relationship-building — not pitching)

- [ ] **Anthropic Discord `#agent-skills`** — mention the skill, answer questions
- [ ] **Cursor Discord `#show-and-tell`** — demo gif
- [ ] **MCP Devs Discord** — share the server, be helpful
- **Owner:** Alek

### Not This Week (and why)

| What | Why Wait |
|------|----------|
| Newsletter pitches (TLDR, Ben's Bites, Latent Space) | No social proof yet. Cold-pitching without traction wastes the shot. Revisit after HN or first 500 users. |
| Influencer DMs (Theo, Pieter Levels, swyx) | One-shot asks. Don't burn before there's something to show. |
| Product Hunt | Save for a bigger moment — after first partnership or 1,000 assets published. |

---

## Tier 5: Bigger Lifts

> Not "finish this week" — "get the flywheel turning." Pick 2-3 max. Compound over 2-4 weeks.

### Option 1: Content Amplifier — EXECUTE (already designed)

Full spec in `active/distribution-experiment-plan-workflow-2.md`. Scout trending AI tweets → turn into installable skills/templates → post the Tokenrip link as a reply. The artifact IS the install funnel.

**This week:** Run one full cycle. One asset shipped and tweeted. Debug the process on that one before scaling volume.

**Owner:** Alek scouts + reviews, Simon builds the Amplifier skill as a Tokenrip asset.

### Option 2: Agent Outreach Wave 2 — RESUME (already designed)

Full spec in `active/agent-outreach-gameplan.md`.

**This week — warm leads first:**
- Gendolf — answer his 3 specific questions (identity verification, isnad scoring, early-user program)
- Fun Wolf — confirm they can publish the First Contact Protocol, help them do it
- Parallax — engage on skills distribution architecture for AICIV
- Ocean Tiger — check in, ask if they've tried the API
- The Claw — suggest shared threads for squad coordination
- Liv Bloom — ask about AOW experiments

Cold Wave 2 starts AFTER warm leads are re-engaged. Every warm follow-up is worth more than 200 cold emails.

**Owner:** Alek

### Option 3: SEO Foundation (new)

Not the 100-article plan — just the foundation:
- Ensure every published asset is a crawlable, indexable page with proper meta tags (title, description, canonical URL)
- Create 5-10 "How to publish from [framework]" pages — one per integration (Claude Code, Cursor, Cline, CrewAI)
- Target zero-competition keywords like "Claude Code share output" where there is no incumbent
- Each page is itself a Tokenrip asset — dogfooding + SEO in one move

**Owner:** Simon

### Option 4: Claude Code Skill Optimization (small, high leverage)

The 1,536-character skill description is what Claude Code reads to decide whether to invoke a skill. If the description doesn't match intents like "share this," "publish this," "give me a link," auto-invocations are lost.

- Audit current skill description
- Optimize for intent matching: share, publish, ship, link, URL, output, deliverable
- Test with real Claude Code sessions

**Owner:** Simon (2-hour task)

### Recommendation

Run **#1** (Content Amplifier) and **#2** (Agent Outreach) — already designed, just execute. Start **#4** (Skill Optimization) — small, high leverage. Begin **#3** (SEO Foundation) as background effort.

---

## Sequencing

```
MON         TUE         WED         THU         FRI
─────────── ─────────── ─────────── ─────────── ───────────
Registry    Registry    Show HN     Reddit      Reddit
submissions submissions post        posts       posts
(Alek)      (Alek)      (Simon)     (Alek)      (Alek)

Agent-      Onboarding  Onboarding  Discord     Content
readable    polish      polish      seeding     Amplifier
surfaces    (Simon)     (Simon)     (Alek)      first cycle
(Simon)                                         (Both)

Skill       Warm lead   SEO         SEO
optimization follow-ups foundation  foundation
(Simon)     (Alek)      (Simon)     (Simon)
```

---

## What We're NOT Doing (filtered from the research)

The 15-agent report contained 287 tactics, 200+ experiments, and 210 partnership targets. Most of it is noise for a 2-person team. Specifically rejected for this week:

| Rejected | Why |
|----------|-----|
| trip1 Squat-and-Gift (claiming other companies' handles) | Burns bridges with companies you need as partners |
| 210-partner outreach program | Haven't shipped first partnership. Premature. |
| AgentMail Honeypot Wall | Clever but distracting. Not this week. |
| Composio/CrewAI/LangGraph toolkit submissions | Build-required. Do after registries prove demand. |
| GitHub Action `publish-action@v1` | Useful but not Week 1. Revisit Week 3. |
| `@tokenrip/init` CLI for 5 IDEs | Over-engineering install. CLI already works. |
| Browser extension | Massive build. Not remotely Week 1. |
| Tokenrip Discord server | Don't launch a community with no community. Revisit after 500 users. |
| AGENTS.md PRs to top 25 OSS repos | Presumptuous without traction. Do after organic usage. |
| 100-article SEO campaign | Right idea, wrong scale. Start with 5-10 pages. |
| "Claim a handle" launch event | FOMO marketing without enough users to create FOMO. |

---

## Success Signals (End of Week)

| Signal | Threshold | What It Means |
|--------|-----------|---------------|
| Registry listings live | 6+ of 14 submitted | Tokenrip is discoverable in the places agents look |
| MCP registry installs | 50+ across all registries | Organic pull exists |
| Show HN | Front page, 4+ hours | Qualified attention at scale |
| First Content Amplifier asset shipped | 1 asset live + tweeted | The production workflow works |
| Warm lead re-engagement | 4+ of 6 responded to | Pipeline is active, not stale |
| /docs page live | Working URL | The funnel doesn't leak |

---

## Source Material

The full research corpus lives on Tokenrip (15 reports + 8 CSVs):

- [Master Findings](https://tokenrip.com/s/39d15a20-43b2-4544-accb-5efc3a12d97b) — start here
- [Agent Ecosystem Map](https://tokenrip.com/s/ba82d920-57e3-400e-870b-3a063fb60e2e) — 47 platforms mapped
- [Direct-to-Agent Distribution](https://tokenrip.com/s/414e619e-8401-46ec-acbc-c95e42a96ded) — 108 tactics
- [Viral Loop Library](https://tokenrip.com/s/3299b2b2-0e38-4f58-b452-3986eff78aa5) — 55 loops
- [Integration Wedges](https://tokenrip.com/s/986e3f9e-478d-4ceb-a677-29ecae7dcf1c) — 160 integrations
- [Community Surfaces](https://tokenrip.com/s/ebb2c91d-858b-41bf-8a17-d3460f0a391f) — 300 surfaces
- [SEO / Content Engine](https://tokenrip.com/s/73808284-80ce-48ed-9df0-92c63bdc92bf) — keyword clusters + GEO playbook
- [Competitive Landscape](https://tokenrip.com/s/5b9be3af-6d39-43bd-8f65-533ac9ea7500) — Cowork threat + battlecards
- [Activation / Onboarding](https://tokenrip.com/s/2a6032e7-aff8-4eb1-884c-b121f37b275c) — 8 onboarding flows
- [Prioritization & Execution](https://tokenrip.com/s/8fbc002f-d2e7-445e-baf4-1d2308731e92) — full 90-day plan (take with grain of salt)

## Related

- [[distribution-strategy]] — Strategic distribution architecture (product/tokenrip/)
- [[distribution-experiment-plan-2026-04-22]] — Previous experiment framework (active/)
- [[distribution-experiment-plan-workflow-2]] — Content Amplifier spec (active/)
- [[agent-outreach-gameplan]] — Agent outreach spec (active/)
