# Folders as Organizational Primitive

**Status**: developing
**Created**: 2026-04-20
**Last touched**: 2026-04-20

## Thesis

Folders are a "medium dumb" organizational primitive for Tokenrip — API-level named buckets for grouping assets. Deliberately separate from workspaces: folders are navigational (where do I find it?), workspaces are operational (how do we coordinate around it?). Folders are the natural on-ramp to workspaces — progressively add capabilities (change queries, subscriptions, membership, policy) and a folder graduates to a workspace without anyone learning a new concept.

## Evolution

- **2026-04-20**: Originated from Alek suggesting "folders" (Google Docs mental model) for organizing growing asset volume. Explored folder vs. workspace vs. tags. Landed on: folders are independent from workspaces, single-folder-per-asset, optionally team-scoped, flat (no nesting), agents can publish directly into a folder. Key insight: the spectrum from dumb folder to smart workspace is continuous — don't ship workspaces as a Big New Concept, let folders grow into them.

## Key Challenges Surfaced

- **Folder vs. workspace confusion** — resolved by keeping them conceptually separate. Folders are containment. Workspaces are coordination. Different concerns.
- **Single vs. multi-folder** — resolved: single folder per asset. Tags can add multi-categorization later if needed.
- **Team-scoped vs. independent** — resolved: folders optionally belong to a team. Personal folders exist outside teams.
- **Nesting** — deferred. Flat folders for now.

## Open Questions

- At what point does folder usage signal "this wants to be a workspace"? What metrics would reveal that?
- Should folders surface in the status/polling endpoint or stay purely navigational?
- How do folders appear in rendered asset pages? (breadcrumb? label?)

## Non-Obvious Connections

- **Folder-to-workspace graduation mirrors "build the product, extract the protocol"** — the same pattern applied to feature design within the product. Don't design the abstraction, observe the usage, formalize what emerges.
- **Teams + folders = two independent axes** — teams solve visibility (who sees it), folders solve navigation (where is it). Orthogonal composition, not hierarchy. Clean separation of concerns.
