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

## Community Signal

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

## Internal References

### Intelligence Engine Post 1 — Agentic Collaboration
- **URL:** content/post-1-agentic-collaboration-draft-humanized.md
- **Type:** internal
- **Key content:** Establishes the missing collaboration layer in the agent stack. McEntire's multi-agent benchmarks (0% pipeline success). Shared context vs. message passing. Directly relevant — context engineering is the practitioner-level skill for managing the collaboration problem this post diagnosed architecturally.
