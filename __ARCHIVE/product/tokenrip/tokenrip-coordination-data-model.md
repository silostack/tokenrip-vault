# Tokenrip — Coordination Layer: Data Model Architecture

> [!warning] Superseded
> This document's core model (Contribution entity, owner-only versioning, contribute_token for comments) has been replaced by the two-primitive architecture in [[tokenrip-messaging-architecture]]. This doc is preserved because its phased evolution thinking (threading, coordination semantics, coordination sessions) and implementation questions remain relevant as background for future layers.

**Status**: Superseded — see [[tokenrip-messaging-architecture]]
**Created**: 2026-04-03
**Owner**: Simon
**Audience**: Platform architect / engineer implementing the coordination layer

---

## Executive Summary

Tokenrip's base platform handles asset publishing and versioning. The next capability layer — coordination — enables multi-party feedback loops on published assets. Two immediate use cases drive this design:

1. **Single-party review loop.** An agent publishes an asset. The human owner adds comments on the asset page. The agent fetches those comments, incorporates them, and publishes a new version with change notes explaining what was updated and why.

2. **Multi-party review loop.** An agent publishes an asset and shares it with a collaborator. The collaborator's agent reviews and adds comments. The original agent fetches those comments, incorporates them, and publishes a new version.

Both patterns converge on the same data model: **version-anchored contributions** with structured metadata, accessed through a token-based capability model that eliminates permissioning friction.

The design is deliberately minimal for immediate implementation, but architecturally positioned for the full coordination surface vision (threaded discussions, role-weighted contributions, coordination artifacts, organizational memory). Every design choice was evaluated against both "does it serve today's use cases?" and "does it block tomorrow's evolution?"

---

## Design Principles

1. **As complex as necessary, as simple as possible.** The Contribution entity has optional fields for future coordination semantics (role, intent, metadata). They cost nothing when empty. They prevent schema migrations when needed.

2. **Version-anchored, not floating.** Every contribution is attached to the specific version it was made against. This creates a clean record: "these comments were about v1; this version (v2) was the response." No ambiguity about what feedback applies to what state of the asset.

3. **Token-as-capability for access.** No permissioning system, no invite flows, no participant management. Share a URL with a token embedded → recipient can contribute. Share the URL without the token → read-only. Security through obscurity is sufficient for the current stage. Proper auth is a future layer, not a prerequisite.

4. **One entity, type field.** Feedback ("fix the conclusion") and change notes ("updated conclusion per reviewer feedback") are the same Contribution entity with a `contribution_type` discriminator. Same storage, same API, same query patterns. Different semantics expressed through data, not schema.

5. **Pull-based discovery.** Agents learn about new contributions through the existing status polling mechanism. No push infrastructure required. The status endpoint is extended to surface contribution counts per asset.

---

## Entity Model

### Asset *(existing — one field added)*

```
Asset {
  id:              UUID       internal PK, never exposed in URLs
  public_id:       UUID       canonical URL identity → rip.to/{public_id}
  contribute_token:   UUID       NEW — secret token granting contribution access
  owner_id:        string     agent/user who owns this asset
  type:            string     document | code | html | data | composite | …
  state:           string     draft | published | archived
  metadata:        JSON
  created_at:      timestamp
  updated_at:      timestamp
}
```

The only addition is `contribute_token`. Generated at asset creation time. Independently revocable — regenerating the token invalidates all previously shared contribution links without changing the asset's canonical URL.

### Version *(existing — unchanged)*

```
Version {
  id:              UUID
  asset_id:        UUID → Asset.id
  version_number:  int        sequential (1, 2, 3…)
  content:         text/blob  the actual asset content
  content_type:    string     markdown | html | json | code | …
  published_by:    string     agent/user ID
  published_at:    timestamp
  metadata:        JSON
}
```

No changes to the version model. Versions remain the immutable record of asset state at a point in time.

### Contribution *(new entity)*

```
Contribution {
  id:                  UUID
  asset_id:            UUID → Asset.id
  version_number:      int        which version this targets
  author_id:           string     agent ID, API key identifier, or display name
  author_type:         string     human | agent
  contribution_type:   string     feedback | change_note
  body:                text       the comment content

  // Coordination fields — all optional, all null by default
  role:                string | null    reviewer | compliance | strategic | editor | …
  intent:              string | null    clarify_pricing | strengthen_conclusion | …
  metadata:            JSON | null      escape hatch for future coordination semantics

  created_at:          timestamp
}
```

#### Contribution Types

**`feedback`** — Made against a version by a reviewer (human or agent). The `version_number` is the version being reviewed. Example: "The pricing section is unclear" on v1.

**`change_note`** — Authored by the asset owner alongside a new version publication. The `version_number` is the version being published (not the one being responded to). Example: "Clarified pricing, strengthened conclusion per reviewer feedback" on v2.

This distinction allows consumers to reconstruct the full review-and-respond cycle: feedback contributions on v1 → change_note contributions on v2 explaining how that feedback was addressed.

#### Coordination Fields

These fields are optional today but structurally present for the coordination artifact evolution:

- **`role`**: The capacity in which the author is contributing. A compliance officer reviewing a proposal contributes differently than a marketing agent — the role signals the framework behind the feedback. Free-form string, not an enum, to avoid premature constraint.

- **`intent`**: What the contribution is trying to achieve. "Regulatory risk reduction" vs. "value proposition strengthening" carry different weight in different contexts. Also free-form.

- **`metadata`**: A JSON blob for anything the schema doesn't yet have a named field for. Future coordination semantics (weight, reasoning, references, tension markers) land here first before being promoted to named fields if patterns stabilize.

---

## Access Model

### The Token-as-Capability Pattern

Access to contribute on an asset is controlled by a single secret: the `contribute_token`. No user accounts, no invite flows, no permission matrices. The token IS the permission.

```
rip.to/{public_id}                   → read-only view (web)
rip.to/{public_id}?t={contribute_token} → read + contribute view (web)
```

#### What the contribute token grants

- Add contributions (feedback or change notes) to any version of the asset
- Read all existing contributions on the asset

#### What it does not grant

- Publishing new versions (requires the owner's API key)
- Modifying or deleting existing contributions
- Managing the asset (changing state, metadata, regenerating tokens)

#### How the token is shared

The owner (or their agent) shares the contribution URL with whomever they want to grant access. The URL is self-contained — it carries both the asset identity and the access grant. The recipient doesn't need to know the convention; they just use the URL they were given.

#### Token lifecycle

- Generated automatically at asset creation
- Stored in the Asset record
- Can be regenerated by the owner (via API key) — this revokes all previously shared links
- A future auth layer (bearer tokens, agent identity, OAuth) can sit on top of the token mechanism without breaking existing URLs or API contracts

> [!note] Security Posture
> This model is explicitly "security through obscurity." UUIDs are unguessable in practice, making contribution URLs safe to share. This is sufficient for the current stage (individual users, small teams, trusted collaborators). Enterprise customers requiring audit trails, access logs, and formal permissioning will need a proper auth layer — but the token mechanism doesn't need to be removed, just supplemented.

---

## API Surface

### New Endpoints

#### Create Contribution

```
POST /contributions/{public_id}
```

**Authorization:** Requires `contribute_token` (query param `?t=` or header `X-Contribute-Token`) OR owner API key.

**Request body:**
```json
{
  "version_number": 1,
  "body": "The pricing section is unclear",
  "contribution_type": "feedback",
  "author_type": "agent",
  "role": "reviewer",
  "intent": "clarify_pricing",
  "metadata": {}
}
```

Required fields: `version_number`, `body`, `contribution_type`, `author_type`.
Optional fields: `role`, `intent`, `metadata`.

`author_id` is derived from the API key or token context — not passed in the body.

**Response:**
```json
{
  "id": "uuid",
  "asset_id": "public_id",
  "version_number": 1,
  "author_id": "agent-b-id",
  "author_type": "agent",
  "contribution_type": "feedback",
  "body": "The pricing section is unclear",
  "role": "reviewer",
  "intent": "clarify_pricing",
  "metadata": {},
  "created_at": "2026-04-03T10:00:00Z"
}
```

#### List Contributions

```
GET /assets/{public_id}/contributions
```

**Authorization:** Owner API key.

**Query parameters:**
- `version` (optional) — filter to contributions on a specific version
- `type` (optional) — filter by `feedback` or `change_note`

**Response:**
```json
{
  "asset_id": "public_id",
  "contributions": [
    {
      "id": "uuid",
      "version_number": 1,
      "author_id": "agent-b-id",
      "author_type": "agent",
      "contribution_type": "feedback",
      "body": "The pricing section is unclear",
      "role": "reviewer",
      "intent": "clarify_pricing",
      "metadata": {},
      "created_at": "2026-04-03T10:00:00Z"
    }
  ]
}
```

### Modified Endpoints

#### Publish New Version *(existing — extended)*

```
POST /assets/{public_id}/versions
```

Add optional `change_note` field to the request body. When present, the server creates a `change_note` contribution automatically, linked to the new version number. This keeps the publish-with-rationale flow as a single API call.

```json
{
  "content": "...",
  "content_type": "markdown",
  "change_note": "Clarified pricing section, strengthened conclusion per reviewer feedback"
}
```

#### Status Endpoint *(existing — extended)*

```
GET /status
```

Add per-asset contribution summary to the response:

```json
{
  "assets": [
    {
      "asset_id": "abc123",
      "current_version": 1,
      "new_contributions": 2,
      "last_contribution_at": "2026-04-03T10:00:00Z"
    }
  ]
}
```

`new_contributions` reflects contributions added since the owner's last check (or since the last version was published — implementation decision for the engineer).

---

## CLI Commands

### Publish with Change Note

```bash
tokenrip publish proposal-v2.md --asset abc123 \
    --change-note "Clarified pricing per reviewer feedback"
```

Publishes a new version of an existing asset and creates a `change_note` contribution in one operation.

### Add Contribution

```bash
# Full URL form — CLI parses asset_id + token from the URL
tokenrip comment add "rip.to/abc123?t=xyz789" "The pricing section is unclear"

# Explicit form
tokenrip comment add abc123 "The pricing section is unclear" --token xyz789

# With optional coordination fields
tokenrip comment add abc123 "Regulatory risk in section 3" \
    --token xyz789 --role compliance --intent regulatory_risk_reduction
```

The CLI accepts either form interchangeably. URL parsing is handled client-side — the agent or human passes whatever they were given.

### List Contributions

```bash
# All contributions on an asset (owner only — uses API key)
tokenrip asset contributions abc123

# Filter by version
tokenrip asset contributions abc123 --version 1

# Filter by type
tokenrip asset contributions abc123 --type feedback
```

### Get Share Link

```bash
tokenrip asset share abc123
# Output:
# View:      rip.to/abc123
# Contribute: rip.to/abc123?t=xyz789
```

---

## Use Case Walkthroughs

### Use Case 1: Single-Party Review Loop

```
1. Simon's agent publishes a proposal:
   $ tokenrip publish proposal.md
   → Published v1: rip.to/abc123
   → Contribute link: rip.to/abc123?t=xyz789

2. Simon opens rip.to/abc123?t=xyz789 in browser.
   Reads the proposal. Adds comments via the web UI:
   - "The pricing section is unclear — simplify to a single tier"
   - "Strengthen the conclusion with a specific call to action"
   These are stored as Contribution records:
     contribution_type: feedback, version_number: 1, author_type: human

3. Simon tells his agent: "incorporate my comments and update the proposal"

4. The agent fetches contributions:
   $ tokenrip asset contributions abc123 --version 1 --type feedback
   → Returns Simon's 2 feedback contributions

5. The agent reads the feedback, revises the proposal, publishes v2:
   $ tokenrip publish proposal-v2.md --asset abc123 \
       --change-note "Simplified pricing to single tier. Added CTA to conclusion."
   → Published v2: rip.to/abc123 (same URL, new version)
   → change_note contribution auto-created on v2

6. Simon can view v2 and see:
   - The updated content
   - The change_note explaining what was changed and why
   - The v1 feedback that prompted the changes (historical context)
```

### Use Case 2: Multi-Party Review Loop

```
1. Simon's agent publishes a customer proposal:
   $ tokenrip publish proposal.md
   → Published v1: rip.to/abc123
   → Contribute link: rip.to/abc123?t=xyz789

2. Simon tells Alek: "Have your agent review this: rip.to/abc123?t=xyz789"

3. Alek tells his agent to review the proposal. Alek's agent:
   $ tokenrip comment add "rip.to/abc123?t=xyz789" \
       "The compliance section needs a data residency clause for EU customers" \
       --role compliance --intent regulatory_risk_reduction
   $ tokenrip comment add "rip.to/abc123?t=xyz789" \
       "Pricing is competitive but consider adding a volume discount tier"
   → Two feedback contributions stored, author_type: agent, linked to v1

4. Simon's agent detects new contributions via status polling:
   GET /status → { asset_id: abc123, new_contributions: 2 }

5. Simon tells his agent: "incorporate Alek's feedback"

6. Simon's agent fetches:
   $ tokenrip asset contributions abc123 --version 1 --type feedback
   → Returns Alek's agent's 2 contributions (with role and intent metadata)

7. Simon's agent incorporates the feedback and publishes:
   $ tokenrip publish proposal-v2.md --asset abc123 \
       --change-note "Added EU data residency clause per compliance review. Added volume discount tier to pricing."
   → Published v2, change_note recorded

8. Alek (or Alek's agent) can view v2 and see:
   - The updated proposal
   - The change_note explaining what changed
   - The original v1 feedback for context
```

---

## Web UI Implications

The asset page at `rip.to/{public_id}` needs to support:

1. **Version navigation.** View current version with ability to see prior versions. Version selector (e.g., dropdown or tabs).

2. **Contribution display.** Show contributions on the currently viewed version. Feedback contributions appear as a comment thread alongside the rendered asset. Change notes appear as a summary block at the top of a version ("What changed in this version").

3. **Contribution input.** When accessed with `?t={token}`, the page shows a comment input form. Without the token, the comment form is hidden (read-only view). The form captures `body` (required) and optionally `role` and `intent` if the commenter wants to tag their contribution.

4. **Historical context.** When viewing v2+, optionally surface feedback from prior versions (collapsed by default) so the viewer understands the review history without it cluttering the current view.

The implementation details of the web UI are at the engineer's discretion. The data model and API support all of the above without modification.

---

## Future Evolution

The current design is positioned for three evolution phases. None require breaking changes to the Contribution entity — they extend it.

### Phase 1: Threading *(near-term, when multi-party discussions get noisy)*

Add to Contribution:
```
thread_id:               UUID | null    groups related contributions
parent_contribution_id:  UUID | null    enables threaded replies
```

A thread is not a separate entity — it's an emergent grouping defined by `thread_id`. The first contribution in a thread sets the `thread_id` (could be its own `id`). Replies reference `parent_contribution_id` for nesting. This keeps the model flat while enabling tree-structured display.

### Phase 2: Coordination Semantics *(medium-term, when role-based collaboration becomes real)*

Add to Contribution:
```
weight:      string | null    executive_override | domain_expert | advisory | …
reasoning:   JSON | null      structured rationale beyond the body text
references:  UUID[] | null    links to other assets/contributions that informed this
```

These fields transform contributions from "comments" into proper coordination artifacts — the asset page becomes a surface where the reasoning behind every edit is captured, machine-readable, and queryable. This is the Chesterton's Fence property: future editors see not just the current state but why every prior decision was made.

### Phase 3: Coordination Sessions *(longer-term, when formal multi-party review is needed)*

New entity:
```
CoordinationSession {
  id:            UUID
  asset_id:      UUID → Asset.id
  purpose:       string
  participants:  Participant[]
  lifecycle:     string   active | converging | resolved
  created_at:    timestamp
  resolved_at:   timestamp | null
}

Participant {
  id:            UUID
  session_id:    UUID → CoordinationSession.id
  agent_id:      string
  role:          string
  permissions:   string   read | contribute | approve
}
```

A CoordinationSession wraps a structured multi-party review. Contributions within a session carry session context. The session lifecycle tracks convergence. The session's resolved state + all its contributions compose into a **coordination artifact** — the full record of what was discussed, decided, and why.

This phase also replaces the comment token model with proper participant-based access control, appropriate for enterprise contexts requiring audit trails and formal permissioning.

### Auth Evolution Path

```
Current:     comment_token (security through obscurity)
    ↓
Near-term:   contribute_token + rate limiting + abuse detection
    ↓
Medium-term: Bearer tokens with agent identity verification
    ↓
Long-term:   Participant model with role-based access control
```

Each layer supplements the previous. The contribute_token URL convention (`?t=`) never needs to break — the server-side validation just gets stricter over time.

---

## Open Questions for the Engineer

These are implementation decisions the engineer should resolve based on current system architecture:

1. **`new_contributions` baseline in the status endpoint.** "New since when?" Options: since the owner's last `GET /contributions` call (requires tracking last-read timestamps), or since the last version was published (simpler, uses `published_at` as the baseline). The latter is recommended for simplicity.

2. **`author_id` derivation.** When an external agent adds a contribution via comment token, what identifies them? Options: derive from their own API key if they have one, allow a self-declared `author_name` in the request body, or assign an anonymous identifier from the token context. The first is cleanest for agent-to-agent workflows. The last is simplest to implement.

3. **Comment token storage.** Single token per asset, or a tokens table that supports multiple tokens with different scopes? Single token is recommended for now. A tokens table is the natural migration path when the Participant model arrives.

4. **Version number vs. version ID in Contribution.** The schema uses `version_number` (integer) rather than `version_id` (UUID FK). This is simpler for API consumers ("give me feedback on version 1") but means contributions reference versions by a non-unique-key field. If versions have a public-facing ID, evaluate which reference is more ergonomic for the API.

5. **Contribution immutability.** Should contributions be editable after creation, or append-only? Recommendation: append-only. Editable contributions create complexity around "which version of the comment did the agent see when it incorporated feedback?" Append-only preserves a clean audit trail.

6. **Bulk operations.** The CLI flow shows adding contributions one at a time. For agent workflows that produce multiple comments in a single review pass, a batch endpoint (`POST /contributions/{public_id}/batch`) may be more efficient. Evaluate whether the current API call overhead justifies this.

---

## Related Documents

- [[tokenrip]] — Product architecture, 30-day build plan, strategic context
- [[tokenrip-exploration]] — Full thinking landscape: deliverable rails, payment primitives, moat deep dive
- [[tokenrip-coordination]] — Coordination infrastructure vision: coordination artifacts, organizational memory
- [[distribution-strategy]] — Integration hierarchy, viral mechanics, branding tiers
