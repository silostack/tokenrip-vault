---
post: self-updating-agent-skills
created: 2026-04-24
post_type: workflow
angle: "How we built a self-updating skill pipeline that keeps two independent agents (different machines, different operators, no shared memory) aligned on shared editorial standards — bootloader, runtime fetch, three-layer quality enforcement, version tracking, and agent-to-agent coordination through the publishing surface."
keywords: [self-updating agent skills, agent collaboration, skill distribution, bootloader pattern, multi-agent workflow]
---

# Sources — How We Built Self-Updating Skills for Multi-Agent Workflows

## Practitioner experience (primary)

### Tokenrip Intelligence Engine — self-updating skill pipeline build
- **Source:** Operational experience, April 2026
- **Type:** firsthand_practitioner_experience
- **Captured:** 2026-04-24
- **Key content:** Two agents (one on Simon's machine, one on Alek's, run by different operators) publishing to the same Intelligence Engine publication. After a stale-skill incident produced a quality regression that no agent-side debugging could fix, we rebuilt the pipeline around four moving parts: (1) a three-line bootloader on each agent's machine that fetches the real skill from a published Tokenrip package on every run, (2) Phase 0 self-setup inside the skill that further fetches the writing guide and brand voice as separate published packages, (3) three-layer quality enforcement — writer-level hard rule, editor subagent in clean context, pre-publish mechanical backtick scan, (4) skill-version metadata embedded in every published post, and (5) agent-to-agent coordination via Tokenrip's messaging system addressed to the other agent's alias. This entire build is the post's primary source — firsthand experience operating the pipeline.

### Stale-skill incident that triggered the redesign
- **Source:** Operational incident, ~April 2026
- **Type:** firsthand_practitioner_experience
- **Captured:** 2026-04-24
- **Key content:** Posts from one agent began arriving with backtick code spans in non-implementation articles — formatting that the writing guide explicitly forbade for thesis/comparison/landscape posts. The skill on disk had the right rule. The agent was running an older copy of the skill that predated the rule. The incident exposed three structural failures: skills had no version metadata, outputs had no provenance, and there was no diagnostic path from "bad output" to "stale skill" without manual file comparison. This incident is the hook and the failure-mode setup for the post.

## Primary Sources (researched)

### Claude Code — Subagents documentation
- **URL:** https://docs.claude.com/en/docs/claude-code/sub-agents
- **Type:** documentation
- **Captured:** 2026-04-24
- **Key content:** Authoritative reference for Claude Code's subagent feature — running a separate agent in a clean context to perform a discrete review or task. Used in the post to anchor the editor-subagent layer of quality enforcement: cited inline when describing how the editor runs in a fresh context with no knowledge of the drafting process.

### Tokenrip — platform homepage
- **URL:** https://tokenrip.com
- **Type:** product_page
- **Captured:** 2026-04-24
- **Key content:** Tokenrip is the publishing/collaboration platform that hosts the skill, writing guide, and brand voice as versioned packages, and provides the messaging system used for agent-to-agent coordination. Linked once on first mention as the platform the pipeline is built on, with the post explicitly noting the pattern is platform-agnostic — any registry that supports versioned artifacts and CLI fetch works the same way.

## Internal series links

### Post 1 — The Agent Alignment Problem (live)
- **URL:** /blog/agent-alignment-drift
- **Type:** internal_series_link
- **Captured:** 2026-04-24
- **Key content:** Names the underlying problem (context fragmentation across independent agents) that the workflow post solves operationally. Linked when the post invokes "context fragmentation" as the conceptual frame for the stale-skill failure mode.

### Post 2 — Treat Agent Skills Like Packages, Not Files (live)
- **URL:** /blog/agent-skills-as-packages
- **Type:** internal_series_link
- **Captured:** 2026-04-24
- **Key content:** Argues the design principle (publish, version, fetch, audit) that the workflow post implements. Linked when the post pivots from "the failure" to "the fix" — the fix is the principle from post 2 made operational.

## Why external research was light

This is a workflow post grounded entirely in firsthand build experience. The writing guide's practitioner-experience exception applies: "If the post is grounded in firsthand operational experience (we built this, we observed this failure, we solved this problem), practitioner experience substitutes for the minimum source count." Two external citations (Claude Code subagents docs and Tokenrip) anchor the technical references. Two internal links (posts 1 and 2) ground the post in the series. No additional research was needed because the post documents an actual build rather than synthesizing a landscape.
