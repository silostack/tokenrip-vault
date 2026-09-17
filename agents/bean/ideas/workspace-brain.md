# Workspace Brain

**Status**: developing
**Created**: 2026-06-14
**Last touched**: 2026-09-14

## Thesis

A *workspace* is shared storage; a *workspace brain* is shared memory. The two things storage lacks are **associative recall** (semantic search — surface the relevant past at the moment of the next decision) and a **consolidation loop** (promote what was learned back into what is believed). Anatomy is deliberately small: **three storage zones** (Signals / Doctrine / Output) and **two operations** (draft, consolidate). Generalizes to any domain; the marketing brain is the first running instance.

## Evolution

- **2026-06-14**: Generalized from the marketing-brain design (Bean session 2026-06-13/14). Established the 3-zones-2-operations model; identified that "completeness" comes from naming *operations*, not adding storage zones; named the consolidate step (Simon's intuited "process step") as the memory-consolidation move that separates a flywheel from a shelf. Resolved the storage-vs-retrieval question (atomic notes + envelope + retained source docs, semantic-not-positional decomposition, lazy seeding). Mapped folder-linking topology and the cross-org boundary. Full spec → `active/workspace-brain-architecture-2026-06-14.md`.
- **2026-08-29**: Revived and expanded into [[sovereign-organizational-memory]]. The prior Signals / Doctrine / Output anatomy describes storage and consolidation, but Simon's company-brain model exposed two additional distinctions: raw sources are **evidence**, not facts; and reusable modules are the organization's **procedural memory**, not merely tools beside the brain. Personal context is better modeled as a sovereign peer scope composed into a task-specific view than as a child layer stored “on top” of company memory.

- **2026-09-14**: Standard files reframed as the memory triad in the workspace redesign (log = episodic, status = semantic, runbooks = procedural; decisions and learnings are log entry types). See [[boundary-aware-workspaces]] and `active/tokenrip-workspaces-prd-2026-09-14.md`.
- **2026-09-04**: **The brain got its verb.** Simon's pain list showed memory wasn't the missing piece (brain, hands, skills, surfaces, pull inbox all exist); the missing piece is what fills the inbox without a human. The daily surface is terminal-connect ("3 things landed while you were away"), split out to [[inbox-as-the-product-surface]]. First loop chosen: call transcripts → `process-call` → team brain → weekly consolidate; the learning note is a draft position, so consolidate has an input on day one. Also: `/brain-sync` already is the "brain dump" v0 (run-reflex), and `bd/calls/contacts/` becomes the first vault folder to go collective, which is how the personal-brain ownership line gets decided by doing. The consolidate cadence question (below) is answered: the weekly consolidate rides the same queue as everything else.
- **2026-09-01**: Reframed in Simon's plain-English model — Doctrine→**positions** (bets with lifecycle + why), Signals/Output→**facts**; brain separated from harness (terminals); modules as ingest pumps answer the write-side-friction killer; principals = (slice, projection, derived layer). Synthesis → `active/tokenrip-brain-terminals-modules-canon-2026-09-01.md`; projections split out to [[brain-projections]].

## Key Challenges Surfaced

- **Storage vs. retrieval granularity** — wholesale docs (coherent, cheap to seed, terrible retrieval) vs. atomic notes (precise retrieval, lost-context risk, costly to author). *Resolved:* atomic claim-notes each carrying a context envelope (summary, type, source link, `[[neighbors]]`) + retained source docs linked; decompose semantically, never positional auto-chunk. The vault's own one-fact-per-file memory system already proves this answer.
- **Seeding can eat the week** — atomizing a whole vault up front is build-reflex; produces a library, ships nothing. *Resolved as discipline:* seed lazily/just-in-time; the brain fills as a byproduct of the work (which is also the honest test of the zero-ceremony-ingestion pitch).
- **Cross-org embeddings can leak what an ACL hides** — vectors partially reconstruct content; the federated/projected/revocable slice is a genuine security build, not a slide. *Open — the cross-party claim rests on it.*
- **Provenance/recency vs. fuzzy recall** — a contested corpus surfaces superseded/contradictory neighbors. *Resolved in design:* recall by meaning, verify by lineage; Signals recency-weighted, Doctrine trust-weighted, Output immutable.
- **Evidence vs. authority** — ingesting a transcript does not make every statement in it a company fact, and a company may hold scoped or contested positions. *Open:* positions need explicit authority, status, temporal scope, evidence links, and supersession.

## Open Questions

- Consolidate cadence — reuse the Chief-of-Staff/Friday review, or a dedicated ritual? (Lean reuse.)
- Build the reusable "atomize → linked notes" skill now (serves customer brains later) or hand-curate first Doctrine notes?
- Decay mechanics for Signals — explicit TTL/archival vs. pure recency-weighting?
- Is "brain" the canonical product noun vs. "workspace"? (Reshapes the vocabulary tree — naming pass warranted.)
- Is a personal brain a stored overlay, or should every interaction resolve a temporary view across sovereign scopes (personal + company + project + shared room)? The latter currently looks structurally safer.

## Non-Obvious Connections

- **The consolidate step is hippocampus→cortex consolidation.** Working/episodic memory (Signals + Output) promoted into long-term memory (Doctrine) — what biological memory does during sleep. A brain without it accumulates noise. This is the read-side completion of [[semantic-search-shared-memory]] ("recall is the missing half of a record-moat").
- **Folders linked into many brains = federation in topology.** A canonical folder (product truth, voice) linked, never copied, is the anti-drift design *and* the cross-org federation mechanism. Connects to [[semantic-workspaces-multiplayer]] (neutrality as structural position) and [[substrate-gtm-wrappers]] (the deposited brain).
- **The brain fills as a byproduct of work** — the same write-side-friction claim made to customers, dogfooded. If the marketing brain needs a seeding marathon, the pitch is false. Connects to "onboarding IS the moat" and the zero-ceremony-ingestion thesis.
- **The marketing machine built on the brain IS the magic demo** — agents collaborating on shared memory, shown live; the folder-linking topology dogfoods federation specifically. Ties [[marketing-motion-distribution]] to the 6-11 magic-demo work.
- **Atomic-note granularity composes with folder-linking** — link a folder of atoms → recall surfaces the right notes; link a folder of docs → dump dead weight into the search space. The two design choices reinforce.
- **Embeddings hypothesize edges, retrieval confirms them, the why-graph records them** — the brain progressively converts the latent dependency graph of knowledge work into an explicit one (the "embeddings are scaffolding, the graph is the moat" insight, 2026-06-12).
- **Modules are procedural memory.** Evidence/Output records what happened, Doctrine/Positions records what the organization believes, and an installed module records how it acts. This turns the brain from a recall surface into an operating memory.
