# Cloud Agent Model

**Status**: developing
**Created**: 2026-04-25
**Last touched**: 2026-04-25

## Thesis

Agent intelligence has three separable layers — brain (instructions), memory (accumulated context), and harness (local execution environment). When brain and memory live on a shared surface like Tokenrip and the harness is a thin local client, the agent becomes a persistent, location-independent entity that any operator can instantiate. This inverts AI economics: the user brings their own model (and pays for inference), the company provides the intelligence layer and tooling surface (and pays only for storage/API calls). The company charges for "hands" (tools), not "thinking" (compute).

## Evolution

- **2026-04-25**: Originated from examining the engagement agent's architecture — six Tokenrip assets, two collections, 20-line bootloader, two operators. Recognized that the bootloader pattern (Series 1 blog content) had already separated the brain. Adding memory to Tokenrip separates all three layers. Explored the BYO model economics inversion (company doesn't pay for inference, user does), five new interaction types (agent-mediated products, knowledge-as-a-service, progressive knowledge products, tool-augmented experiences, inter-agent tool sharing), and the tiered tooling surface as a business model (free = basic primitives, enterprise = semantic search + webhooks + scheduled ops). Identified three memory ownership models (commons, partitioned, layered) with the layered model as likely default. Drew the AWS analogy (S3 = collections, Lambda = user's model, API Gateway = tooling surface). Proposed a "build an agent" skill for deployment.

## Key Challenges Surfaced

- **Memory ownership is novel** — no precedent for shared, multi-contributor agent memory. Open-source solved code ownership (licenses), Wikipedia solved knowledge ownership (commons). Nobody has solved agent memory. The layered model (shared knowledge + private context) is the best candidate but needs design work.
- **Quality control for published brains** — a poorly-built brain using Tokenrip tools creates a bad experience that users blame on the platform. May need a reputation/rating system.
- **Model-specific instructions** — a brain written for Claude may not work for GPT. Unclear whether builders publish model-specific variants or if the brain format is model-agnostic.
- **Security of tool calls** — a malicious brain could exfiltrate private operator data through tool calls. Need sandboxing or capability restrictions.

## Open Questions

- What's the actual cost per agent per month for free-tier tooling? At what scale does free become unsustainable?
- How does memory partitioning work at the collection level — separate collections per operator, or row-level ACL?
- Should the "build an agent" skill be a V1 priority (distribution mechanism) or wait until the tooling surface is richer?
- Does the tiered tooling model work if builders can host brains elsewhere and only use Tokenrip for tools? Is that fragmentation or acceptable usage?
- What does the inter-agent tool registry look like? How does Agent A discover Agent B's capabilities?
- IP model for published brains — forkable? Licensed? Open by default?

## Non-Obvious Connections

- **Docker for agent intelligence, but alive** — Docker separated applications from infrastructure (static containers). This separates agent intelligence from execution (living entities that evolve through use). The "container" grows smarter.
- **The engagement agent was the proof of concept without knowing it** — the engagement agent architecture accidentally demonstrated the cloud agent model. The generalization was latent in the specific implementation.
- **Token efficiency as competitive pressure** — in the BYO model, bloated brains cost the user directly. Users switch to leaner agents. This creates a natural selection pressure for efficient instructions that doesn't exist in any other AI product model.
- **AWS positioning without the compute** — Tokenrip provides all the AWS services EXCEPT Lambda. The user brings their own compute. This is complementary to model providers (every model benefits from Tokenrip) rather than competitive.
- **Nervous system, not brain or muscles** — Tokenrip's position in the stack: model providers are the brain, compute is the muscles, Tokenrip is the nervous system connecting them. The connections that let capabilities find each other and compose.
- **"Build an agent" skill as viral deployment** — every agent that builds itself on Tokenrip is simultaneously a product demo, a data source, and a distribution vector. The deployment mechanism IS the growth mechanism.
