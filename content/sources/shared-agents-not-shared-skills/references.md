---
post: shared-agents-not-shared-skills
created: 2026-04-28
post_type: thesis
angle: "The bootloader pattern started as sharing a skill file. Scale it and you're sharing an entire operational agent — multiple operators, same system, loaded at runtime from published assets."
keywords: [shared agents, thin command pattern, agent distribution, bootloader pattern, multi-operator agents]
---

# Sources — Shared Agents, Not Shared Skills

## Primary Sources (provided)

### Practitioner Experience — Engagement Agent Build
- **URL:** provided directly
- **Type:** practitioner_experience
- **Captured:** 2026-04-28
- **Key content:** Built an agent-native CRM with four operational modes (ingest, draft, outreach, send), two data collections, six published instruction assets, a 20-line bootloader command, and multi-operator onboarding via messaging. Designed and deployed in a single session. Second operator onboarded by sending a message.

### Series 1 Blog Posts — Bootloader Pattern and Skill Versioning
- **URL:** provided directly
- **Type:** blog_post
- **Captured:** 2026-04-28
- **Key content:** Published posts 1-2 establishing the skill layer thesis: shared instructions published as versioned assets, the bootloader pattern for loading skills at runtime, solving instruction drift between agents.

## Primary Sources (researched)

### Medium — The SKILL.md Pattern: How to Write AI Agent Skills That Actually Work
- **URL:** https://bibek-poudel.medium.com/the-skill-md-pattern-how-to-write-ai-agent-skills-that-actually-work-72a3169dd7ee
- **Type:** blog_post
- **Captured:** 2026-04-28
- **Key content:** Three-level progressive disclosure (metadata → instructions → references). Skills shared via repo inclusion. No built-in versioning mechanism. Cross-platform compatibility (Claude Code, Codex, OpenClaw) with runtime behavior differences.

### Medium — Multi-Agent in Production in 2026: What Actually Survived
- **URL:** https://medium.com/@Micheal-Lanham/multi-agent-in-production-in-2026-what-actually-survived-f86de8bb1cd1
- **Type:** blog_post
- **Captured:** 2026-04-28
- **Key content:** Three surviving patterns: agent-flow (sequential), orchestration (hub-and-spoke), collaboration (bounded peer teams). Key principle: "Start with a single strong agent." New agents must add genuine value — novel tools, better interfaces, non-redundant review. Anthropic reports 15x token cost for orchestration systems.

### CIO — Moving Autonomous Agents Into Production Requires a Universal Context Layer
- **URL:** https://www.cio.com/article/4162650/moving-autonomous-agents-into-production-requires-a-universal-context-layer.html
- **Type:** blog_post
- **Captured:** 2026-04-28
- **Key content:** Context fragmentation traps intelligence in isolated silos. 57% of organizations unprepared for AI due to inadequate data foundations. Proposes a "universal context layer" unifying disconnected data with dynamic access control.

### The Prompt Index — AI Agent Skills Guide 2026
- **URL:** https://www.thepromptindex.com/how-to-use-ai-agent-skills-the-complete-guide.html
- **Type:** documentation
- **Captured:** 2026-04-28
- **Key content:** Comprehensive guide to SKILL.md pattern across platforms. Skills as modular folders with instructions, scripts, and resources. Progressive disclosure for context efficiency.

### Microsoft — Agents as Microservices (Multi-Agent Reference Architecture)
- **URL:** https://microsoft.github.io/multi-agent-reference-architecture/docs/design-options/Microservices.html
- **Type:** documentation
- **Captured:** 2026-04-28
- **Key content:** Agent-as-microservice pattern: each agent operates independently with defined interfaces and contracts. Mirrors the monolith-to-microservices shift in software architecture.

## Community Signal (researched)

### Jenova AI — Share AI Agents: How to Build, Distribute, and Collaborate
- **URL:** https://www.jenova.ai/en/resources/share-ai-agents
- **Type:** blog_post
- **Platform:** web
- **Captured:** 2026-04-28
- **Key content:** Agent sharing across teams and organizations. Distribution models for custom AI assistants.

### HBR — To Scale AI Agents Successfully, Think of Them Like Team Members
- **URL:** https://hbr.org/2026/03/to-scale-ai-agents-successfully-think-of-them-like-team-members
- **Type:** blog_post
- **Platform:** web
- **Captured:** 2026-04-28
- **Key content:** Management framing for agent scaling. Treats agents as team members with roles, responsibilities, and onboarding.
