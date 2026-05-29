# Skill Packaging & Tool Layer

**Status**: elevated to product canon (2026-05-10)
**Created**: 2026-05-08
**Last touched**: 2026-05-10
**Elevated to**:
- `product/tokenrip/tool-layer.md` — architecture (skill/tool distinction, bypassable test, three categories, COI email worked example)
- `product/tokenrip/business-model.md` — monetization (charge for substrate, three revenue lines, pricing tiers, anti-patterns)

This file remains as the origin/exploration trail. Product decisions live in the elevated docs.

## Thesis

Agent skills today are unmanaged files — no versioning, no update mechanism, no usage visibility, no dependency management. The same gap that npm solved for JavaScript packages exists for skills. Tokenrip already has the infrastructure to solve this (bootloader pattern, multi-harness generation, auto-update mechanism). The deeper insight: skills and tools are different primitives. A skill encodes judgment (when, why, how to evaluate). A tool is a capability (an API, CLI, or script that does one thing when asked). Skills orchestrate tools. A packaging system that handles both — with dependency resolution — creates a composable capability graph for agents.

## Evolution

- **2026-05-08**: Idea emerged from thinking about Published-but-Blind outreach. Started with the versioning problem for skill creators (copy/paste is the only distribution channel). Expanded into three connected threads: (1) skill packaging as npm-for-skills, (2) skill vs. tool as distinct primitives, (3) the intent layer that skill-wrapped APIs provide to API providers.

## The Three Threads

### 1. Skill Packaging System

Skills need the same four properties as any managed package: **published** (addressable, not just a file on someone's laptop), **versioned** (every change creates a new version), **fetchable** (agents pull current version at runtime), **auditable** (outputs record which skill version produced them).

Tokenrip already does this for agents (imprints are packages). The extension to sub-agent-level skills is natural. The dependency management angle opens composability: the blog-writing skill depends on the humanizer skill. If humanizer gets updated, the blog skill gets the new version automatically.

**Current state**: Tokenrip has bootloader pattern, multi-harness generation (Claude Code, Codex, Cursor), and auto-update mechanism. The infrastructure for skill packaging exists. What's missing is the packaging surface exposed to third-party skill creators.

### 2. Skill vs. Tool Distinction

- **Skill** = methodology, judgment, orchestration. Knows *when* to do something, *why*, and *how to evaluate* the result. Encodes the author's expertise.
- **Tool** = capability. Does one thing when asked. An API endpoint, a CLI command, a local script. Has no opinion about when it should be called.

The relationship: **skills declare tool dependencies; the platform resolves them.** A skill says "needs: image-generation." The operator or platform resolves which specific tool fulfills that dependency — Adobe Firefly, Midjourney, DALL-E. Different providers, different price points, different capabilities, same interface.

This is **dependency injection for agent capabilities.** It's the decomposition pattern applied one level deeper: just as the mounted agent separates cognition/context/execution, the skill/tool split separates methodology from capability.

Implications:
- Skill authors don't hard-code tool providers. Portability across tools mirrors portability across harnesses.
- Tools compete on the same interface. Market dynamics emerge.
- Vendor lock-in dissolves — you're not locked to one provider's function-calling format.
- The resolution layer (Tokenrip) is in the routing position, which eventually monetizes through the capability graph.

### 3. The Intent Layer for API Providers

API providers today see call data (what was called, how often, by whom) but not intent data (why it was called, what workflow it's part of, what the caller was trying to accomplish). A skill that wraps an API is structurally a semantic annotation layer — it captures the *meaning* of API usage as a byproduct of orchestration.

Example: the Twitter reply-guy agent uses the Twitter API. Twitter sees API calls. They don't know the calls came from a brand-building agent that's part of a content strategy workflow. A Tokenrip-hosted Twitter skill would capture that intent context.

**Value to API providers**: usage analytics enriched with semantic context. Not just "endpoint X was called 10K times" but "60% of calls come from content-pipeline agents, 25% from monitoring agents, 15% from engagement agents."

**Current assessment**: valuable in concept, premature to sell. API providers don't care about agent adoption yet — it's a rounding error of their usage. Becomes sellable when the skill graph has enough density that being off Tokenrip is a distribution disadvantage.

## Key Challenges Surfaced

- **Revenue from API providers is premature.** Requires density that doesn't exist yet. Adobe has devrel teams and SDKs — they don't need Tokenrip to package their API. The medium-provider angle (Resend, Lemon Squeezy) is closer but still too early. Revisit when there's a critical mass of skills composing with tool dependencies.
- **Dependency management requires ecosystem density.** npm's dependency resolution only mattered because thousands of packages existed. Building dependency management before there's a meaningful graph of skills to compose is infrastructure-before-demand.
- **Partnership vs. sale.** The shorter-term play with API providers may be partnership (free skill packaging in exchange for distribution to their developer community) rather than revenue. Gets tools into the graph without a sales cycle.

## Open Questions

- At what density does the skill graph become self-reinforcing? (i.e., creators publish skills *because* the graph exists, not because of white-glove conversion)
- Should Tokenrip seed the tool layer by packaging the top 20 commonly-used APIs itself? (The "first power user" pattern applied to tools)
- How does MCP's tool protocol interact with this? MCP standardizes tool interfaces at the protocol layer. Tokenrip's skill/tool distinction operates at the orchestration layer above MCP. Are these complementary or competing?
- What does the dependency declaration syntax look like? Inspired by package.json? Or more like Dockerfile FROM?
- When skills declare tool dependencies, who resolves them — the operator (explicit choice), the platform (default resolution), or the skill author (pinned provider)?

## Non-Obvious Connections

- **Decomposition pattern applied recursively.** Agent: cognition/context/execution. Skill: methodology/capability. The same architectural move at different layers of the stack. Each decomposition enables portability at its layer.
- **Behavioral data as moat extends to the tool layer.** Tokenrip's moat through agent usage data now extends to tool-resolution data — which tools get chosen for which intents, which providers win at which price points. The routing layer accumulates market intelligence.
- **Skill graph as the marketplace that actually works.** Agent marketplaces failed because agents are commodities (a system prompt is not a product). Skills with real methodology, tool dependencies, and versioning are non-commodity. The skill graph might be the marketplace shape that succeeds where GPT Store failed.
- **The vendor lock-in angle connects to the newsletter fear.** A company afraid of Anthropic lock-in (from the newsletter Simon mentioned) would benefit from skills that abstract away the model/tool provider. Portability isn't just across harnesses — it's across the entire capability stack.
