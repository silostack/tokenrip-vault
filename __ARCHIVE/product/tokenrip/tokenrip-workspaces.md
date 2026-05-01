# Tokenrip — Workspaces

**Status**: Design exploration — workspace primitive will be formalized from observed usage of Asset + Thread primitives
**Created**: 2026-04-11
**Updated**: 2026-04-21

---

## The Core Insight: Topology, Not Primitive

A workspace is not a third primitive alongside Asset and Thread. It's a **topology** of the first two — a named collection of assets and threads with membership, change semantics, and propagation policy.

```
Workspace = assets + threads + change semantics + membership + policy
```

Assets are versioned, provenance-tracked, and renderable. Threads carry structured intent, typed messages, and canonical resolutions. The pull-based status model extends naturally to workspace-level change polling. Keypair identity provides membership and access control.

What the workspace adds beyond a folder:
- **Membership** — which agents have access
- **Change semantics** — structured events (who changed what, why) rather than raw diffs
- **Cross-asset relationships** — assets within a workspace reference each other
- **Propagation policy** — how changes flow within and between workspaces

---

## Three Workspace Tiers

| Tier | Time Horizon | Example |
|------|-------------|---------|
| **Project** | Bounded, has deliverables | Contract negotiation, product launch, due diligence |
| **Organizational** | Persistent, IS the operating context | Team SOPs, decision history, pipeline state, competitive intelligence |
| **Cross-organizational** | Relationship-scoped | Supply chain, platform ecosystem, ongoing partnership |

**Project workspaces** compose naturally with deliverable rails — assets move through lifecycle states (draft → submitted → approved), milestones are tracked as workspace events, payment conditions tie to workspace state changes.

**Organizational workspaces** are the "company brain." Living documents that evolve continuously. No "final version" — always a current state. Every decision recorded, every SOP updated, every strategic shift documented accumulates into organizational intelligence that no individual agent holds in full.

**Cross-organizational workspaces** are the deepest moat. When two organizations share a workspace, switching costs multiply — it's not one org's data at stake, it's the shared context between them. Neither party can unilaterally switch without disrupting the relationship's operational surface. A supply chain of 50 suppliers creates hub-and-spoke network effects.

Project workspaces are often nested within or spawned from organizational workspaces. A product launch (project) draws context from the company's strategic workspace (organizational) and may involve shared surfaces with partners (cross-org).

---

## Interpretation Divergence as a Feature

When multiple departments' agents read the same shared context, they may interpret it differently based on their priorities. Marketing reads "enterprise-ready" as premium pricing; engineering reads it as SOC 2 compliance. This divergence is currently invisible until it causes damage.

A workspace can surface divergence structurally — **type-checking for organizational alignment**. The reconciliation process produces the most valuable artifact: the shared understanding with full reasoning about why different interpretations were unified.

This is one of the key properties that distinguishes workspaces from shared folders. Folders store content. Workspaces capture the reasoning around content.

---

## Default Sync Recipes

Synchronization strategy is organizational policy, not platform-prescribed. Default recipes provide working patterns out of the box:

| Recipe | Mechanic | Good For |
|--------|----------|----------|
| **Team Sync** | All changes propagate immediately, append-only events | Small teams, internal operations |
| **Review Gate** | Changes proposed, designated reviewer approves before propagation | Client deliverables, compliance-sensitive work |
| **Interface** | Each org controls what propagates to shared surface; external changes flagged | Vendor relationships, partnerships |
| **Broadcast** | One-to-many: publisher pushes, subscribers receive, can thread but not modify | SDK docs, changelogs, ecosystem communication |

---

## Graduation from Folders

Folders are the workspace on-ramp. The progression is continuous:

```
Folder (named bucket, queryable)
  → + change queries ("what's new in here?")
    → + subscriptions ("notify me when something lands")
      → + membership ("these agents are participants")
        → + policy ("changes here propagate there")
          = Workspace
```

Each step adds one capability without rearchitecting the previous ones. An operator who starts with folders never needs to "learn workspaces" as a separate concept — their folder gets progressively smarter as capabilities are unlocked.

Folders are the observation mechanism: which folders get queried most? Which do agents treat as coordination surfaces? Those signals reveal where workspaces want to exist.

---

## Dogfooding Starting Point

Simon and Alek already have the problem — two separate agent environments, no shared context, manual bridging through calls and messages.

**Minimal experiment**: A shared set of files that both agents can pull from. When Simon makes a significant update (new deal, strategic shift, key decision), his agent publishes a structured update to the shared surface. Alek's agent pulls it into his context on its next sync.

This doesn't require workspace infrastructure to test. The point is learning: what needs to be shared? How often? In what structure? What breaks?

Questions to answer:
- What information does Alek's agent actually need from Simon's context?
- What's the right update granularity — every change, daily digest, or only on explicit publish?
- What happens when the shared context contradicts something in a private context?
- Does the shared context need to be symmetric, or do Simon and Alek need different projections?

The workspace primitive gets formalized from what the experiment reveals — same philosophy as "build the product, extract the protocol."

---

## Architecture Notes

The workspace is not designed top-down. It emerges from Layer 2 (Asset + Thread) usage patterns. Build the atoms first; observe how teams assemble them; formalize what emerges.

Key architectural decisions from the existing model that carry forward:
- **Pull-based status** extends to workspace-level change polling — agents poll `GET /workspace/{id}/events?since=cursor`
- **Keypair identity** provides membership without central authority
- **Token-as-capability** extends to workspace access tokens
- **Cursor-based retrieval** handles workspace event streams efficiently

Related: [[tokenrip-architecture]] (five-layer model, moat strategy), [[tokenrip-folders]] (folder primitive and graduation path)
