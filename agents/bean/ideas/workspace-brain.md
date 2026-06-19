# Workspace Brain

**Status**: developing
**Created**: 2026-06-14
**Last touched**: 2026-06-14

## Thesis

A *workspace* is shared storage; a *workspace brain* is shared memory. The two things storage lacks are **associative recall** (semantic search — surface the relevant past at the moment of the next decision) and a **consolidation loop** (promote what was learned back into what is believed). Anatomy is deliberately small: **three storage zones** (Signals / Doctrine / Output) and **two operations** (draft, consolidate). Generalizes to any domain; the marketing brain is the first running instance.

## Evolution

- **2026-06-14**: Generalized from the marketing-brain design (Bean session 2026-06-13/14). Established the 3-zones-2-operations model; identified that "completeness" comes from naming *operations*, not adding storage zones; named the consolidate step (Simon's intuited "process step") as the memory-consolidation move that separates a flywheel from a shelf. Resolved the storage-vs-retrieval question (atomic notes + envelope + retained source docs, semantic-not-positional decomposition, lazy seeding). Mapped folder-linking topology and the cross-org boundary. Full spec → `active/workspace-brain-architecture-2026-06-14.md`.

## Key Challenges Surfaced

- **Storage vs. retrieval granularity** — wholesale docs (coherent, cheap to seed, terrible retrieval) vs. atomic notes (precise retrieval, lost-context risk, costly to author). *Resolved:* atomic claim-notes each carrying a context envelope (summary, type, source link, `[[neighbors]]`) + retained source docs linked; decompose semantically, never positional auto-chunk. The vault's own one-fact-per-file memory system already proves this answer.
- **Seeding can eat the week** — atomizing a whole vault up front is build-reflex; produces a library, ships nothing. *Resolved as discipline:* seed lazily/just-in-time; the brain fills as a byproduct of the work (which is also the honest test of the zero-ceremony-ingestion pitch).
- **Cross-org embeddings can leak what an ACL hides** — vectors partially reconstruct content; the federated/projected/revocable slice is a genuine security build, not a slide. *Open — the cross-party claim rests on it.*
- **Provenance/recency vs. fuzzy recall** — a contested corpus surfaces superseded/contradictory neighbors. *Resolved in design:* recall by meaning, verify by lineage; Signals recency-weighted, Doctrine trust-weighted, Output immutable.

## Open Questions

- Consolidate cadence — reuse the Chief-of-Staff/Friday review, or a dedicated ritual? (Lean reuse.)
- Build the reusable "atomize → linked notes" skill now (serves customer brains later) or hand-curate first Doctrine notes?
- Decay mechanics for Signals — explicit TTL/archival vs. pure recency-weighting?
- Is "brain" the canonical product noun vs. "workspace"? (Reshapes the vocabulary tree — naming pass warranted.)

## Non-Obvious Connections

- **The consolidate step is hippocampus→cortex consolidation.** Working/episodic memory (Signals + Output) promoted into long-term memory (Doctrine) — what biological memory does during sleep. A brain without it accumulates noise. This is the read-side completion of [[semantic-search-shared-memory]] ("recall is the missing half of a record-moat").
- **Folders linked into many brains = federation in topology.** A canonical folder (product truth, voice) linked, never copied, is the anti-drift design *and* the cross-org federation mechanism. Connects to [[semantic-workspaces-multiplayer]] (neutrality as structural position) and [[substrate-gtm-wrappers]] (the deposited brain).
- **The brain fills as a byproduct of work** — the same write-side-friction claim made to customers, dogfooded. If the marketing brain needs a seeding marathon, the pitch is false. Connects to "onboarding IS the moat" and the zero-ceremony-ingestion thesis.
- **The marketing machine built on the brain IS the magic demo** — agents collaborating on shared memory, shown live; the folder-linking topology dogfoods federation specifically. Ties [[marketing-motion-distribution]] to the 6-11 magic-demo work.
- **Atomic-note granularity composes with folder-linking** — link a folder of atoms → recall surfaces the right notes; link a folder of docs → dump dead weight into the search space. The two design choices reinforce.
- **Embeddings hypothesize edges, retrieval confirms them, the why-graph records them** — the brain progressively converts the latent dependency graph of knowledge work into an explicit one (the "embeddings are scaffolding, the graph is the moat" insight, 2026-06-12).
