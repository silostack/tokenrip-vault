# Tokenrip — Folders: Organizational Primitive for Agent-Produced Assets

**Purpose**: This document defines the folder concept — a lightweight organizational primitive that gives operators and agents a way to group assets into named buckets. Folders solve the immediate navigation problem (a growing flat list of assets) while preserving a clean architectural path toward workspaces.

**Created**: 2026-04-20
**Source**: Bean session exploring Alek's suggestion of Google Docs-style organizational structure

---

## Part 1: The Problem Folders Solve

### The Flat List Breaks Down

As agents publish more assets, the operator dashboard becomes a wall of undifferentiated items. Research briefs sit next to engineering specs sit next to blog drafts. Finding something means scrolling or searching — there's no spatial organization, no "where did I put that?"

This is already happening. Alek's research output is growing alongside engineering assets and content ideas. The team feed is useful for visibility but offers no structure. Operators need a way to say "these things go together" without ceremony.

### Why Not Just Search?

Search solves "I know what I'm looking for." It doesn't solve "show me everything related to recon" or "what's in our engineering bucket?" Organizational structure provides browsability — the ability to see what exists in a category without knowing specific names. Both are needed.

---

## Part 2: What Folders Are

A folder is a **named bucket** for grouping assets. Nothing more.

Folders are organizational, not operational. They answer "where does this live?" — a navigational question. They don't answer "how do we coordinate around this?" — that's the workspace concept, which is architecturally distinct and deliberately deferred.

### Properties

- **Named**: A human-readable name ("engineering", "recon", "blog-ideas")
- **Containment**: Assets live inside a folder (or don't — folders are optional)
- **Queryable**: Agents and operators can ask "what's in this folder?"
- **Flat**: No nesting. A folder contains assets, not other folders. Nesting can be introduced later if the flat model proves insufficient.

### What Folders Don't Do

- **No notifications**: Putting an asset in a folder doesn't alert anyone
- **No policies**: Folders don't have rules about what can go in them or what happens when something changes
- **No membership**: Folders don't have participants — visibility is determined by team membership, not folder membership
- **No change propagation**: Updating an asset in a folder doesn't trigger downstream effects

This is deliberate. Every behavior not added is a future capability that can be introduced without breaking existing usage.

---

## Part 3: How Folders Relate to Teams and Workspaces

### Three Orthogonal Concerns

Tokenrip's organizational model has three distinct axes, each solving a different problem:

| Concept | Question It Answers | Properties |
|---------|-------------------|------------|
| **Team** | Who can see this? | Membership, shared visibility, inbox |
| **Folder** | Where does this live? | Named containment, queryability |
| **Workspace** (future) | How do we coordinate around this? | Change semantics, propagation policy, active participants |

These are independent, not hierarchical. A team doesn't require folders. A folder doesn't require a team. Workspaces (when they arrive) won't require either — though they'll compose naturally with both.

### Folder Scoping

A folder exists in one of two contexts:

**Personal folder**: Belongs to an agent/operator, not associated with any team. Private organizational structure. "My drafts", "my research queue."

**Team folder**: Belongs to a team. All team members see the folder and its contents. The folder inherits the team's visibility model — if you're on the team, you see the folder.

An asset in a team folder is visible to the team by virtue of being in that folder. This composes cleanly with the existing team visibility model: teams control who sees what, folders control how it's organized within that shared space.

### Single Folder Per Asset

An asset lives in at most one folder. This is a deliberate constraint:

- **No ambiguity**: "Where is this asset?" has exactly one answer
- **Simple mental model**: "Throw this in engineering" — done
- **Clean semantics**: Moving an asset between folders is a simple reassignment, not a graph operation

Multi-categorization (an asset that's relevant to both "recon" and "blog-ideas") is a real need but a different concern. Tags or labels — a flat, non-exclusive categorization layer — can solve this orthogonally if the need becomes pressing. Folders and tags are complementary: folders say where something lives, tags say what it's about.

### Assets Without Folders

Folders are optional. An asset can exist with no folder — floating free, visible based on its own ownership and team membership. This preserves the current behavior: everything published today continues to work exactly as it does. Folders are additive, not required.

---

## Part 4: Agent Workflow Integration

### Publishing Into Folders

Agents can target a folder at publish time. Rather than publishing an asset and then separately filing it, the agent specifies the destination in a single operation: "publish this research brief into the recon folder."

This matters because it makes organizational structure part of the agent's workflow, not a human afterthought. An agent configured to produce research can always file into "recon." An agent producing engineering specs can always file into "engineering." The organizational structure stays consistent without operator intervention.

### Querying Folders

Agents can query a folder's contents: "what's in recon?" This enables agents to operate within organizational boundaries — a blog-writing agent can pull from the "blog-ideas" folder, a research agent can check what's already in "recon" before publishing duplicative work.

This is the seed of something larger. Today, querying a folder is just listing its contents. Tomorrow, the question might become "what's *new* in recon since yesterday?" — a change query. That's the first step toward workspace-like behavior, emerging organically from folder usage patterns.

---

## Part 5: The Workspace On-Ramp

### Why Folders and Workspaces Are Separate

The workspace document defines workspaces as having four properties beyond simple containment: change semantics, cross-file relationships, active participants, and policy. Folders have none of these. They are deliberately dumb.

This separation is important because it prevents premature complexity. Shipping "workspaces" as a named concept requires operators to understand membership, synchronization models, change propagation, and policy — concepts that are powerful but heavy. Folders require understanding nothing beyond "put stuff in buckets."

### The Graduation Path

Folders are designed as the natural on-ramp to workspaces. The progression is continuous, not a cliff:

```
Folder (named bucket, queryable)
  → + change queries ("what's new in here?")
    → + subscriptions ("notify me when something lands")
      → + membership ("these agents are participants")
        → + policy ("changes here propagate there")
          = Workspace
```

Each step adds one capability. No step requires rearchitecting the previous ones. An operator who starts with folders never needs to learn "workspaces" as a separate concept — the folder they've been using just gets progressively smarter as capabilities are unlocked.

This mirrors the project's broader design philosophy: build the product, extract the protocol. Don't design the abstraction top-down. Ship the simplest version, observe usage, formalize what emerges. Folders are the observation mechanism — which folders get queried most? Which ones do agents poll? Which ones start getting treated as coordination surfaces? Those signals reveal where workspaces want to exist.

### What the Workspace Document Anticipated

The workspace exploration document already stated: "the workspace primitive will be formalized from observed usage patterns, not designed top-down." Folders are the concrete instantiation of this principle. They provide the observable surface from which workspace patterns can emerge.

---

## Part 6: Design Decisions and Rationale

### Why "Folder" and Not Another Name

- **Folder**: Universal mental model, zero explanation needed. Everyone knows what a folder is.
- **Collection**: Already used in Tokenrip as a document type. Would create naming confusion.
- **Space**: Too close to "workspace." Would blur the conceptual boundary that needs to stay sharp.
- **Bucket**: Accurate but informal. Doesn't feel like a platform primitive.

"Folder" wins on familiarity. The goal is zero conceptual overhead for operators and agent builders.

### Why Not Tags Instead

Tags (multi-label, non-exclusive) solve "what is this about?" Folders (single-container, exclusive) solve "where does this live?" These are different cognitive operations:

- **Filing** (folder): "I'm done with this research brief. Throw it in recon." One decision, one destination. Done.
- **Labeling** (tags): "This research brief is about competitive intelligence, it's related to the blog, and it feeds into the Q2 strategy." Multiple decisions, ongoing maintenance.

Operators filing agent output want the first mental model. Tags can supplement folders later — but they can't replace the "put it somewhere" instinct.

### Why Not Nesting

Nested folders (engineering/frontend, engineering/backend) add hierarchy, which adds decisions: "Does this go in engineering or engineering/frontend? Should I create a new subfolder?" Flat folders keep the decision simple: pick a bucket, throw it in.

If the flat model proves insufficient as asset volume grows, nesting is a clean addition — it doesn't require changing anything about how flat folders work. Deferring it avoids premature structure.

### Why Single Folder Per Asset

Multi-folder would mean an asset can "live in" multiple places simultaneously. This creates questions that single-folder avoids:
- "I deleted the recon folder — is the asset also gone from blog-ideas?"
- "Which folder is the 'primary' location?"
- "The agent published into recon — how did it also end up in engineering?"

Single folder keeps the mental model clean: an asset is in one place. If multi-categorization becomes necessary, tags are the right tool — they're designed for non-exclusive classification.

---

*This document captures the architectural thinking behind Tokenrip folders as of 2026-04-20. It should be read alongside the workspace exploration ([[tokenrip-workspaces]]) which describes the higher-order coordination concept that folders may eventually graduate toward.*
