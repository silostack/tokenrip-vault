---
post: context-engineering
created: 2026-04-20
post_type: thesis
angle: "Prompt engineering optimized a single LLM call. Context engineering manages what an agent knows across sessions, tools, and other agents — and the shared layer is still unsolved."
keywords: [context engineering, context engineering vs prompt engineering, agent context management, how to do context engineering]
---

# Sources — Context Engineering Is Replacing Prompt Engineering

## Primary Sources

### Anthropic — Effective Context Engineering for AI Agents (Original Blog)
- **URL:** https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- **Type:** blog_post
- **Captured:** 2026-04-20
- **Key content:** Defines context engineering as "the strategic curation of tokens provided to LLMs during inference." Covers context rot (performance degrades as tokens accumulate), anatomy of effective context (system prompts, tools, examples), runtime retrieval strategies (just-in-time loading), and long-horizon techniques (compaction, structured note-taking, sub-agent architectures). Core principle: "find the smallest set of high-signal tokens that maximize the likelihood of some desired outcome."

### Anthropic — What Is Context Engineering? (Comprehensive Guide)
- **URL:** https://claude.ai/public/artifacts/f498a4cc-4c45-481c-a6dd-8e1d196dadb0
- **Type:** documentation
- **Captured:** 2026-04-20
- **Key content:** Comprehensive reference guide framing context engineering as "the practice of designing and optimizing the entire context window." Explicitly positions it as prompt engineering "rebranded." Covers full taxonomy: system prompts, instructions, user input processing, structured I/O, tools, RAG & memory (short-term + long-term), states & historical context, and multi-agent orchestration. Memory section covers session memory and persistent memory but not cross-agent shared state. Multi-agent section covers agent communication protocols and standardized message formats but not shared context infrastructure. Encyclopedic treatment — validates the breadth of the discipline while revealing the gap in shared-layer tooling.

### Anthropic — Context Engineering Tools Cookbook
- **URL:** https://platform.claude.com/cookbook/tool-use-context-engineering-context-engineering-tools
- **Type:** documentation
- **Captured:** 2026-04-20
- **Key content:** Three core primitives for context management: (1) Compaction — summarizing conversation history at token thresholds, preserving key facts while dropping verbose reasoning; (2) Tool-result clearing — removing re-fetchable results while preserving call records; (3) Memory tool — file-based persistence across sessions via /memories directory. Demonstrates a research agent handling 335K tokens by combining all three primitives, reducing peak context to ~170K. Includes diagnostic framework mapping symptoms to solutions.

## Primary Sources (researched)

### Manus — Context Engineering for AI Agents: Lessons from Building Manus
- **URL:** https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus
- **Type:** blog_post
- **Captured:** 2026-04-22
- **Key content:** Practitioner account from the Manus agent team. Identifies KV-cache hit rate as "the single most important metric for a production-stage AI agent" (cached tokens cost 10x less). Uses file system as unlimited external memory. Counteracts lost-in-the-middle effects via todo.md that pushes objectives into recent context. Preserves error traces deliberately for belief-updating. Frames context engineering as experimental science requiring iterative refinement.

### Martin Fowler — Context Engineering for Coding Agents
- **URL:** https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html
- **Type:** blog_post
- **Captured:** 2026-04-22
- **Key content:** Identifies three context configuration types: reusable prompts, context interfaces (tools, MCP servers, skills), and control mechanisms (LLM-decided, human-decided, deterministic hooks). Key gap: "no unit tests for context engineering" — validation of context configurations remains unsolved. Emphasizes that context engineering provides probability improvements, not guarantees.

### Slack Engineering — Managing Context in Long-Run Agentic Applications
- **URL:** https://slack.engineering/managing-context-in-long-run-agentic-applications/
- **Type:** blog_post
- **Captured:** 2026-04-22
- **Key content:** Production multi-agent system for security investigations. Solved shared context through three structured artifact channels: Director's Journal (working memory), Critic's Review (credibility-scored findings), and Critic's Timeline (consolidated narrative). Analyzed 170K findings — 26% didn't meet plausibility thresholds. Explicitly avoids carrying message histories between agents, using structured artifacts instead. Validates the shared-context-through-state argument.

### Google Developers Blog — Architecting Efficient Context-Aware Multi-Agent Frameworks
- **URL:** https://developers.googleblog.com/architecting-efficient-context-aware-multi-agent-framework-for-production/
- **Type:** blog_post
- **Captured:** 2026-04-22
- **Key content:** Google's approach to production multi-agent context management. Addresses coordination drift when agents lack shared grounding, context overflow from stateless API accumulation, and the need for shared memory objects for loose coupling.

## Community Signal (provided)

### Anthropic Context Engineering Tweet — Primary
- **URL:** provided directly (user report)
- **Platform:** twitter
- **Captured:** 2026-04-20
- **Key content:** Anthropic's tweet promoting their context engineering guide hit 2,091 likes, indicating strong practitioner interest in the topic and the shift from prompt engineering to context engineering as a recognized discipline.

### "Things That Are Changing Rapidly" Tweet — Context Windows
- **URL:** provided directly (user report)
- **Platform:** twitter
- **Captured:** 2026-04-20
- **Key content:** Tweet stating "things that are changing rapidly: 1. context windows" hit 3,256 likes. Signals broad community awareness that context management is the frontier problem, outpacing even the model capability conversation.

## Community Signal (researched)

### Karpathy — "context engineering" over "prompt engineering" (Hacker News)
- **URL:** https://news.ycombinator.com/item?id=44379538
- **Platform:** hn
- **Captured:** 2026-04-22
- **Key content:** Andrej Karpathy's framing of "context engineering" over "prompt engineering" sparked significant HN discussion. Widely credited with popularizing the term alongside Anthropic's formal treatment.

### "RAG Is Dead, Context Engineering Is King" (Hacker News)
- **URL:** https://news.ycombinator.com/item?id=45035584
- **Platform:** hn
- **Captured:** 2026-04-22
- **Key content:** HN discussion positioning context engineering as superseding RAG as the dominant paradigm. Signals community movement toward holistic context management over narrow retrieval strategies.

### Gartner — Context Engineering Is In, Prompt Engineering Is Out
- **URL:** referenced in search results (Gartner advisory)
- **Platform:** enterprise_advisory
- **Captured:** 2026-04-22
- **Key content:** Gartner recommends enterprises "prioritize context over prompts" by building context-aware architectures and dynamic knowledge pipelines. Enterprise validation of the shift.

## Internal References

### Intelligence Engine Post 1 — Agentic Collaboration
- **URL:** content/post-1-agentic-collaboration-draft-humanized.md
- **Type:** internal
- **Key content:** Establishes the missing collaboration layer in the agent stack. McEntire's multi-agent benchmarks (0% pipeline success). Shared context vs. message passing. Directly relevant — context engineering is the practitioner-level skill for managing the collaboration problem this post diagnosed architecturally.
