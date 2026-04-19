# Tokenrip Blog — Initial Content Plan

**Status**: Active
**Created**: 2026-04-11
**Owner**: Simon
**Purpose**: Define the first 8 blog posts for tokenrip.com, guide content ingestion, and establish data capture methodology for the intelligence engine synthesis pipeline.

---

## Strategy

**Target**: Algorithmic indexers first — Google, LLM training crawlers (ChatGPT browsing, Claude), agentic content scrapers. Human readers come second.

**Topical authority goal**: Establish tokenrip.com as the authoritative voice on agentic collaboration, agent comparison, and agent workflow engineering. Dense, interlinked content in a tight niche beats thin coverage across many topics.

**Keyword land grab**: "agentic collaboration" and "agent collaboration" have near-zero competition in current search results. The thesis post anchors this keyword. Every other post reinforces it through internal linking and topical relevance.

**Production pipeline**: Manual content curation → intelligence engine ingestion → synthesis → editorial pass → publish as Tokenrip asset. Each post exercises the full pipeline.

---

## Post Plan

### Post 1: Agentic Collaboration — The Missing Layer in the Agent Stack

**Type**: Thesis / anchor
**Target keywords**: `agentic collaboration`, `agent collaboration`, `agent collaboration infrastructure`, `multi-agent collaboration`
**Word count**: 1500-2500

**Direction**: Not a product announcement. A perspective piece arguing that the agent ecosystem has solved production (coding agents, task agents) and is solving communication (MCP, A2A), but the actual surface where agents work together — shared contexts, coordinated artifacts, synchronized understanding — doesn't exist yet. The stack has a missing layer between "agents that do things" and "agents that do things together."

**Content to ingest**:
- MCP protocol documentation and positioning
- Google A2A protocol documentation
- OpenAI Agents SDK documentation
- Overview of current multi-agent frameworks (CrewAI, AutoGen, LangGraph)
- Any existing writing on agent coordination/collaboration gaps
- Academic or industry papers on multi-agent systems

**Key angles to cover**:
- The production layer is solved (agents can code, write, research)
- The communication layer is being built (MCP for tools, A2A for agents)
- The collaboration layer is missing (shared state, coordinated work, organizational context)
- Why "multi-agent frameworks" (CrewAI etc.) aren't the same as collaboration infrastructure
- What collaboration actually requires: shared context, provenance, coordination around artifacts
- Where this is heading: agents that don't just communicate but genuinely collaborate

**Internal linking**: Every other post on the site links back to this as the foundational thesis.

---

### Post 2: OpenClaw vs Hermes — Choosing Your Autonomous Agent

**Type**: Comparison / landscape
**Target keywords**: `openclaw vs hermes`, `openclaw agent`, `hermes agent`, `autonomous agent comparison`, `best autonomous agent 2026`
**Word count**: 2000-3000

**Direction**: Detailed, opinionated comparison for someone choosing between these two (or considering switching). Not a feature matrix — a perspective on what each is good at, where each falls short, and what kind of operator each serves best. Written from genuine experience (Simon is setting up Hermes after using OpenClaw).

**Content to ingest**:
- OpenClaw GitHub repository (README, docs, architecture)
- Hermes GitHub repository (README, docs, architecture)
- OpenClaw official site / documentation
- Hermes official site / documentation
- Community discussions comparing the two (Reddit, HN, Twitter/X, Discord)
- Any third-party reviews or breakdowns
- Release notes / changelogs for recent versions

**Key angles to cover**:
- Architecture differences (how each agent is structured, what it assumes about the operator)
- Setup experience (getting started, configuration complexity, time to first useful output)
- Autonomy model (how much control the operator retains, guardrails, approval flows)
- Tool/integration ecosystem (what each connects to, MCP support, extensibility)
- Memory and context handling (persistence, learning, context window management)
- Community and ecosystem maturity
- Cost model (API usage, token consumption patterns)
- Who should use which and why

---

### Post 3: Agent Harnesses Compared — Claude Code vs Cursor vs Windsurf vs Codex

**Type**: Comparison / landscape
**Target keywords**: `claude code vs cursor`, `best coding agent`, `agent harness comparison`, `windsurf vs cursor`, `codex vs claude code`, `coding agent 2026`, `harness engineering`
**Word count**: 2500-3500

**Direction**: Comprehensive comparison of the major coding agent harnesses. The harness is the interface between operator and agent — it determines how you interact with AI coding capabilities. This is the hottest decision space in developer tooling right now. Focus on the harness engineering angle: not just "which is best" but how each shapes the way you work.

**Content to ingest**:
- Claude Code documentation, GitHub, release notes
- Cursor documentation, features, changelog
- Windsurf documentation, features, changelog
- OpenAI Codex documentation, features, release notes
- Community comparisons (Reddit r/cursor, r/ClaudeAI, HN threads, Twitter/X)
- Benchmark comparisons if any exist (SWE-bench results, etc.)
- Pricing pages for all four

**Key angles to cover**:
- Architecture model (IDE-integrated vs CLI vs hybrid)
- Agent autonomy (how much the harness lets the agent do unsupervised)
- Context management (how each handles large codebases, file selection, context windows)
- Tool and extension ecosystem
- Customization (rules files, skills, system prompts, MCP support)
- Multi-file editing and refactoring capability
- Terminal/shell integration
- Pricing and token economics
- Workflow fit (solo dev, team, enterprise)
- The "harness engineering" skill — how configuring your harness is becoming a discipline

---

### Post 4: The Agent Stack in 2026 — A Map of the Territory

**Type**: Landscape overview
**Target keywords**: `agent stack 2026`, `ai agent ecosystem`, `agentic landscape`, `agent infrastructure`, `agent tools landscape`
**Word count**: 2000-3000

**Direction**: A structured map of the current agent ecosystem organized by layer. Not exhaustive — opinionated about what matters and where the energy is. Positions the reader (and search engines) to see tokenrip.com as the cartographer of this space. Strong internal linking hub — every comparison and workflow post connects back here.

**Content to ingest**:
- Major agent frameworks: CrewAI, AutoGen, LangGraph, Semantic Kernel
- Agent harnesses: Claude Code, Cursor, Windsurf, Codex, Aider
- Autonomous agents: OpenClaw, Hermes, Devin, Cognition
- Protocols: MCP (Anthropic), A2A (Google)
- Infrastructure: LangSmith, Braintrust, Humanloop, Helicone
- Identity/payments: agent wallets, x402, agent-native payment protocols
- Memory/context: Mem0, Zep, various RAG providers
- Model providers: Anthropic, OpenAI, Google, Mistral, open-source (Llama, etc.)

**Key angles to cover**:
- Layer model: Models → Harnesses → Agents → Protocols → Infrastructure → Collaboration
- Where the energy is right now (harnesses, autonomous agents)
- What's being built but isn't mature (protocols, identity)
- What's missing entirely (collaboration infrastructure — ties back to Post 1)
- How the layers interact and depend on each other
- Where value accrues vs. where commoditization is happening

---

### Post 5: Building a Morning Brief with Your Agent

**Type**: Workflow / how-to
**Target keywords**: `agent morning brief`, `ai morning briefing`, `automated daily brief`, `claude morning brief`, `agent daily digest`
**Word count**: 1500-2000

**Direction**: Practical, experience-driven guide to setting up an automated morning briefing using an agent. Written from Simon's actual setup. Covers what information to pull, how to structure the brief, how to make it actually useful (not just a dump of headlines). The emphasis is on the *design* of the brief — what makes a good one — not just the technical setup.

**Content to ingest**:
- Existing morning brief implementations (community examples, blog posts)
- Relevant MCP servers (news, email, calendar, GitHub integrations)
- Scheduling/automation patterns for agents (cron, hooks, triggers)
- Examples of good daily briefing formats (from newsletters, executive briefings)

**Key angles to cover**:
- What goes into a useful morning brief (not everything — curated)
- Information sources: email, calendar, GitHub, news, metrics
- Structuring the output (priorities, decisions needed, context, not just raw data)
- Technical setup (scheduling, agent invocation, MCP connections)
- Making it personal (context-aware, adapts to your role/priorities)
- Common mistakes (too much information, no prioritization, no actionability)
- Evolution over time (how your brief gets better as the agent learns your patterns)

---

### Post 6: The Second Brain — Claude + Obsidian as a Knowledge System

**Type**: Workflow / how-to
**Target keywords**: `claude obsidian`, `ai second brain`, `obsidian ai integration`, `claude code obsidian`, `second brain 2026`, `ai knowledge management`
**Word count**: 2000-3000

**Direction**: Deep dive into using Claude (specifically Claude Code) with Obsidian as a persistent knowledge system. This is Simon's actual daily setup — the vault IS the second brain. Not a "here's how to install a plugin" tutorial. A philosophy piece with practical depth: why this combination works, how to structure it, what patterns emerge over time, and how the agent becomes a genuine thinking partner rather than a search engine.

**Content to ingest**:
- Obsidian documentation (core features, plugins relevant to AI integration)
- Community posts about Claude + Obsidian workflows (Reddit, Obsidian forum, Twitter/X)
- "Second brain" / "building a second brain" methodology (Tiago Forte's PARA, Zettelkasten, etc.)
- Other AI + knowledge management approaches for comparison (Notion AI, Mem, Reflect)
- Claude Code documentation (memory, CLAUDE.md, project context features)

**Key angles to cover**:
- Why local-first + agent-native is a powerful combination
- Vault structure patterns that work well with agents (folder conventions, linking, metadata)
- CLAUDE.md as the operating manual for your agent within the vault
- Memory systems (how the agent retains context across sessions)
- Thinking sessions vs. operational sessions (different modes of agent interaction)
- The knowledge compound effect (vault gets more valuable as density increases)
- Practical patterns: processing inbox items, synthesizing across notes, maintaining dashboards
- Comparison with cloud-based alternatives (why local-first matters for a knowledge system)

---

### Post 7: Agent Skills and Prompt Engineering — The New Programming

**Type**: Technical craft
**Target keywords**: `agent skills`, `prompt engineering 2026`, `claude code skills`, `ai agent prompts`, `harness engineering skills`, `agent configuration`
**Word count**: 2000-2500

**Direction**: Skills and prompts are to agents what functions and configs are to software. This post covers the emerging discipline of writing good agent skills — reusable, composable instructions that make agents reliably good at specific tasks. Goes beyond "write clear prompts" into architecture: how to structure skills, when to use them, how they compose, and why this is becoming a real engineering discipline.

**Content to ingest**:
- Claude Code skills documentation (slash commands, skill files, CLAUDE.md patterns)
- Cursor rules documentation
- Windsurf rules / configuration docs
- Community-shared skills and rules files (GitHub repos, blog posts, Twitter/X)
- Prompt engineering research and best practices (Anthropic docs, OpenAI docs)
- Any "awesome-claude-code" or similar curated lists

**Key angles to cover**:
- Skills as reusable agent capabilities (not one-off prompts)
- Anatomy of a good skill (trigger conditions, instructions, constraints, output format)
- Composition: how skills layer and interact
- Platform-specific patterns (Claude Code skills vs. Cursor rules vs. Windsurf rules)
- The CLAUDE.md / rules file as the agent's operating system
- When to use skills vs. when to just talk to the agent
- Common anti-patterns (over-constraining, conflicting rules, prompt bloat)
- Skills sharing and community (emerging ecosystem)
- Why this is "the new programming" — configuring agent behavior IS programming

---

### Post 8: Agent Email and Communications Automation

**Type**: Workflow / how-to
**Target keywords**: `agent email automation`, `ai email triage`, `claude email`, `agent communications`, `automated email agent`
**Word count**: 1500-2000

**Direction**: Practical guide to using agents for email and communications triage, drafting, and automation. Universal use case — everyone has email, everyone wants it handled better. Covers the spectrum from simple triage (categorize and prioritize) to full draft-and-send workflows, with emphasis on maintaining the operator's voice and judgment.

**Content to ingest**:
- Gmail MCP server documentation and capabilities
- Slack MCP integration documentation
- Other email/comms agent tools and integrations
- Community examples of email automation with agents
- Existing email AI tools for comparison (Superhuman AI, Shortwave, etc.)

**Key angles to cover**:
- The triage spectrum (read → categorize → prioritize → draft → send)
- Maintaining voice and judgment (the agent assists, not replaces)
- Technical setup (MCP servers, authentication, permissions)
- Email patterns that work well with agents (templates, recurring responses, follow-ups)
- Comms beyond email (Slack triage, meeting prep from calendar, message drafting)
- Privacy and security considerations (what you're giving the agent access to)
- The trust ladder (start with triage, graduate to drafting, maybe never auto-send)

---

## Ingestion Data Model

### Standard Metadata (All Sources)

Every ingested source should capture:

| Field | Type | Description |
|-------|------|-------------|
| `source_url` | string | Canonical URL of the source |
| `source_type` | enum | `github_repo`, `documentation`, `blog_post`, `forum_thread`, `social_post`, `academic_paper`, `product_page`, `changelog`, `pricing_page`, `video_transcript` |
| `captured_at` | datetime | When the content was ingested |
| `content_hash` | string | Hash of ingested content for change detection |
| `relevance_tags` | string[] | Which blog posts this source feeds (e.g., `["post-2-openclaw-hermes", "post-4-agent-stack"]`) |
| `freshness` | enum | `real-time` (changes daily), `weekly`, `monthly`, `stable` (rarely changes) |

### GitHub Repository Data

For any source with a GitHub repository, capture these additional fields:

| Field | Type | Description |
|-------|------|-------------|
| `github_url` | string | Repository URL |
| `stars` | int | Star count at time of capture |
| `stars_trend` | string | Growth trajectory if available (e.g., "gained 2k in last month") |
| `forks` | int | Fork count |
| `contributors` | int | Total contributor count |
| `top_contributors` | string[] | Notable contributors (founders, known figures) |
| `open_issues` | int | Open issue count (signal of activity and/or debt) |
| `open_prs` | int | Open PR count |
| `last_commit_date` | date | Most recent commit to main/default branch |
| `commit_frequency` | string | Approximate commits per week/month |
| `created_date` | date | Repository creation date |
| `primary_language` | string | Main programming language |
| `language_breakdown` | object | Language percentages (e.g., `{"TypeScript": 72, "Python": 18, "Rust": 10}`) |
| `license` | string | License type (MIT, Apache 2.0, proprietary, etc.) |
| `latest_release` | string | Latest release tag and date |
| `release_frequency` | string | Approximate releases per month |
| `readme_quality` | enum | `minimal`, `standard`, `comprehensive`, `excellent` — subjective but useful |
| `has_docs_site` | bool | Whether a dedicated documentation site exists |
| `package_registry` | string | npm, PyPI, crates.io, etc. + download counts if available |
| `downloads` | int | Package downloads (weekly or monthly, note which) |
| `dependencies_count` | int | Number of direct dependencies (signal of complexity/bloat) |

### Product / Tool Data

For tools and products being compared:

| Field | Type | Description |
|-------|------|-------------|
| `product_name` | string | Official name |
| `company` | string | Company or team behind it |
| `pricing_model` | string | Free, freemium, paid, usage-based, etc. |
| `pricing_tiers` | object | Tier names and prices |
| `founded_date` | date | When the company/product launched |
| `funding` | string | Known funding (amount, stage, investors) |
| `team_size` | string | Approximate team size if known |
| `model_support` | string[] | Which LLMs are supported (Claude, GPT-4, Gemini, etc.) |
| `platform_support` | string[] | OS/platform support (macOS, Linux, Windows, web, etc.) |
| `integration_ecosystem` | string[] | Key integrations (MCP, LSP, extensions, plugins) |
| `unique_features` | string[] | Differentiating capabilities |
| `known_limitations` | string[] | Documented or community-reported limitations |

### Community Signal Data

For forum threads, social posts, discussions:

| Field | Type | Description |
|-------|------|-------------|
| `platform` | string | Reddit, HN, Twitter/X, Discord, etc. |
| `engagement` | object | Upvotes, comments, reposts — platform-specific |
| `sentiment` | enum | `positive`, `negative`, `mixed`, `neutral` |
| `notable_claims` | string[] | Specific claims worth fact-checking or citing |
| `author_credibility` | string | Is the author a known figure, maintainer, random user? |

---

## Ingestion Methodology

### Per-Post Research Flow

For each post, follow this sequence:

1. **Primary sources first** — official docs, GitHub repos, product sites. These are authoritative and stable. Capture all structured data (GitHub metrics, pricing, features).

2. **Community signal second** — Reddit, HN, Twitter/X, Discord. These reveal what people actually care about, what's confusing, what's broken, what's loved. Look specifically for:
   - Pain points people articulate (these become angles in the post)
   - Questions people ask repeatedly (these become sections)
   - Controversies or strong opinions (these become discussion points)
   - Comparisons people make organically (these validate the comparison framing)

3. **Competitive content third** — existing blog posts, reviews, comparisons on the same topic. Understand what's already been said so the synthesis adds something new. Note gaps: what did existing coverage miss?

4. **Tag everything** — every ingested source gets `relevance_tags` connecting it to one or more posts. A single GitHub repo might feed Post 2, Post 3, and Post 4.

### GitHub Data Collection

For repositories, use the GitHub API where possible for structured data. Capture at a specific point in time and record `captured_at` so trends can be computed on re-ingestion.

**Priority metrics for comparison posts:**
- Stars + star trend (community interest and momentum)
- Commit frequency + last commit (project health and activity)
- Contributor count (bus factor, community vs. solo project)
- Language breakdown (relevant for operator choosing a tool to extend)
- Release frequency (shipping velocity signal)
- Open issues count (activity signal, but also potential red flag at scale)
- Package downloads (actual adoption vs. GitHub star vanity)

**Derived signals worth computing:**
- `stars_per_month` — normalize age vs. popularity
- `issues_resolution_rate` — ratio of closed to opened issues (maintenance quality)
- `contributor_concentration` — what % of commits come from top 1-3 contributors (bus factor)
- `docs_to_code_ratio` — proxy for documentation investment
- `time_since_last_release` — staleness signal

### Freshness and Re-ingestion

Not all data ages equally:

| Data type | Re-ingest frequency | Why |
|-----------|---------------------|-----|
| GitHub metrics | Weekly | Stars, issues, commits change frequently |
| Pricing | Monthly | Pricing changes are material but infrequent |
| Documentation | On release | Docs update with product releases |
| Community threads | One-time | Threads are point-in-time snapshots |
| Product features | On release / monthly | Feature sets change with releases |

### Quality Signals for Source Selection

Not all sources are worth ingesting. Prioritize:

- **Recency**: Prefer sources from last 3 months. Agent tooling moves fast — a 6-month-old comparison is likely outdated.
- **Specificity**: A detailed Reddit thread comparing two tools is worth more than a generic "Top 10 AI Tools" listicle.
- **Experience-based**: First-person accounts ("I switched from X to Y because...") are higher signal than feature-list comparisons.
- **Author credibility**: Maintainers, known practitioners, and power users over casual commenters.
- **Engagement**: High-engagement threads (many comments, upvotes) indicate the topic resonates.

---

## Internal Linking Strategy

Every post links to at least 2 other posts. The linking topology:

```
Post 1 (Thesis: Agentic Collaboration)
  ↑ linked from every other post as "the why"
  
Post 4 (Agent Stack Map)
  ↑ linked from Posts 2, 3, 5, 6, 7, 8 as "the landscape"
  
Post 2 (OpenClaw vs Hermes) ↔ Post 3 (Harness Comparison)
  cross-linked as "choosing your agent" vs "choosing your harness"

Post 5 (Morning Brief) ↔ Post 8 (Email Automation)
  cross-linked as workflow companions

Post 6 (Second Brain) ↔ Post 7 (Skills Engineering)
  cross-linked as "knowledge system" + "agent configuration"
```

Post 1 and Post 4 are the hubs. Every other post is a spoke that links back to at least one hub.

---

## SEO Fundamentals

Each post ships with:

- **Title tag**: Primary keyword near the front, under 60 characters
- **Meta description**: 150-160 characters, includes primary keyword, compelling hook
- **H1**: Matches title tag (or close variant)
- **H2s**: Each major section targets a secondary keyword or question
- **URL slug**: Short, keyword-rich (e.g., `/openclaw-vs-hermes`, `/agentic-collaboration`)
- **OG image**: Distinct per post (even if templated)
- **Internal links**: 2+ to other posts on the site
- **Schema markup**: Article schema with author, date, modified date

---

## Related Documents

- [[platform-roadmap]] — Phase 1 (Blog) requirements and strategic context
- [[intelligence-engine-design]] — Synthesis pipeline architecture
- [[tokenrip]] — Platform vision
- [[agentic-intelligence-marketplace]] — Intelligence engine idea evolution
