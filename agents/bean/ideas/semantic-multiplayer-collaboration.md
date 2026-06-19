# Semantic Multiplayer Collaboration

**Status**: developing
**Created**: 2026-06-18
**Last touched**: 2026-06-18

## Thesis

Semantic search over shared workspaces turns Tokenrip from shared storage into shared memory that agents from different principals, running in different harnesses (Claude Cowork, OpenAI Codex, future tools), can retrieve from and mutate without common tooling or explicit context passing. This is the primitive that makes agentic collaboration (multiple sovereign parties on ambiguous joint work) possible, as distinct from coordination (one principal's decomposed tasks). The mounted-agent separation (memory on substrate, cognition in user's chosen harness) plus semantic addressing for latent knowledge structures is what no single-vendor AI platform can provide.

## Evolution

- **2026-06-11 / 06-13**: Original exploration of "we just enabled semantic search on workspaces" produced the law-firm scenarios, the coordination-vs-collaboration distinction, the brain anatomy (3 zones + 2 operations), read-side provenance as the recall half of the moat, the boundary-crossing magic demo, and the GTM wrapper framing. Captured in active docs and prior idea files (subsequently cleaned). Workspace-brain-architecture-2026-06-14.md generalized the pattern.

- **2026-06-18**: Re-engagement now that semantic search is actually enabled in the product. Push from "what does this open" to first-principles "what does multi-player agentic collaboration actually require, and why does the combination of semantic retrieval + neutral cross-harness memory uniquely enable it." Sharpened the git-for-non-code analogy against the a16z spine, concrete two-Cowork-users texture inside and across firms, and the claim that the collaboration unit becomes the corpus itself.

## Key Challenges Surfaced

- Write-side zero-ceremony remains the gating reality for the brain to fill as a byproduct rather than a project. If deposition of artifacts from inside Cowork (or any harness) requires deliberate ceremony, the vision reduces to "better search over manually managed files."
- Cross-org retrieval scoping is non-trivial: embeddings can leak information that ACLs try to hide; the engineering of private/shared boundaries (projected slices, query-time filtering with provenance) is load-bearing for the boldest claims.
- The consolidate loop (what turns a brain smarter rather than just larger) has clear ownership inside one firm; across firms it requires new ritual and sovereignty design.
- High-stakes knowledge work will demand "recall by meaning, verify by lineage" as table stakes — provenance must be first-class in retrieval results or defensibility erodes.
- Many current "multi-agent" and "multiplayer AI" surfaces are still coordination within one human's or one vendor's control plane. True multi-principal collaboration is a different shape.

## Open Questions

- What is the minimal viable bridge for a Cowork-class user to treat a Tokenrip workspace as a natural extension of their working set (agent-driven deposit, scoped views, no new mental model)?
- Does "brain" become the canonical noun for the memory+recall+consolidate construct, and how does that reshape the rest of the vocabulary tree (mount a brain, federate brains, firm brain)?
- How does the read-side provenance graph (this knowledge informed that decision) surface usefully to humans and agents without becoming noise?
- Is the first real multi-player signal intra-firm (multiple humans + their agents on one brain) or the individual case (one human's agents across multiple harnesses sharing the same memory)?

## Non-Obvious Connections

- The mounted agent model (imprint + memory on Tokenrip, harness in the user's tool) is the architectural prerequisite for the cross-tool claim. Without the separation, "accessible from the platforms users already use" is just marketing.
- Stigmergy generalizes: agents primarily collaborate by evolving the shared artifacts in the workspace rather than by direct messaging. The object is the protocol.
- The a16z spine's insight ("the recorded work was both the substrate coding agents operated in and the corpus they learned from") only transfers to operational domains once recall by meaning exists inside the daily tools. Semantic search on the neutral substrate is the transfer function.
- Embeddings are scaffolding that recovers the latent graph; the explicit moat is the confirmed usage graph (retrieval events + the why they produced) that no single-player tool accumulates.
- Coordination passes small explicit context; collaboration retrieves large implicit context across boundaries. The substrate must therefore be a retrieval surface first, a storage surface second.
