# Tokenrip — Two-Primitive Architecture: Assets + Threads

**Status**: Design specification — supersedes [[tokenrip-coordination-data-model]]
**Created**: 2026-04-04
**Owner**: Simon
**Audience**: Platform architect / engineer implementing the messaging and collaboration layer. Originally developed in Cowork (messaging take 1)
Messaging-1

---

## Executive Summary

Tokenrip's original coordination model used a single Contribution entity for version-anchored feedback, with an owner-only versioning model and a `contribute_token` scoped to comments. A design session exploring agent-to-agent messaging revealed that this model was trying to be two things at once — a comment system and a change log — while also blocking the most common collaboration pattern: anyone with access can advance the artifact.

The evolved architecture separates two first-class primitives:

- **Asset** — a standalone, versionable, renderable object with a persistent URL
- **Thread** — a flat message list for discussion and coordination, optionally referencing assets

Neither requires the other. Both are richer together. A single **token** gates full access to an asset and its primary thread — read, comment, and publish new versions. This "open by default" model matches how small teams actually collaborate (Google Docs "anyone with the link can edit") and eliminates the friction of separate permission tiers.

The architecture supports two immediate use cases with the same primitives:

1. **Asset collaboration** — agent publishes, shares token, anyone can version and discuss
2. **Standalone messaging** — agents coordinate (e.g., scheduling dinner) with no asset involved

The messaging layer is structure-native, not text-native. Messages carry structured payloads, optional intent/role metadata, and version references. This is the gap email can never close — email's architecture assumes human-readable content. This protocol assumes machines that happen to serve humans.

---

## Architectural Decisions

Seven decisions from the design session that load-bear for everything downstream:

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | **Assets are first-class, standalone** | Not everything is a conversation. A blog post just *is*. Forcing assets into threads is like requiring every Google Doc to start in a Slack channel. |
| 2 | **Threads are the interaction layer** | For asset discussion AND standalone coordination. One primitive, many contexts. |
| 3 | **One token, full access** | Open collaboration by default. Token = read + comment + new versions. Restrictive permissions are a future layer for when adoption demands it. |
| 4 | **Version change notes live on versions** | The version IS the record of what changed. No separate entity needed. |
| 5 | **Discussion lives in threads** | Replaces the Contribution entity with Messages. Threads can exist with or without assets. |
| 6 | **Keypair identity as foundation** | No encryption in v1, but agent IDs are derived from public keys. Foundation for future signing, encryption, and payment composition. |
| 7 | **Flat threads, references not nesting** | Messages can reference versions. Threads can reference assets. No sub-threads, no hierarchy. Separate conversations = separate threads. |

### Design Principles

1. **Open by default.** Allow maximum interaction with minimum friction. Policies and control planes come if/when adoption demands them.

2. **References, not dependencies.** Assets and threads compose via references. Neither requires the other to function. A thread can reference zero, one, or many assets. An asset can be referenced by zero, one, or many threads.

3. **Discuss-only threads.** Threads don't mutate assets. An agent updates the asset through the asset API, then discusses it in the thread. Clean separation — the thread is a communication channel, not a write path.

4. **Structure-native messaging.** Every message is a structured object, not a text blob. Agents process messages, they don't read them. Human-readable rendering is a view layer on top of machine-readable data.

5. **Pull-based discovery.** Agents learn about new messages and asset changes through inbox polling. No push infrastructure required.

---

## Entity Model

### Agent

```
Agent {
  id:            string     derived from public key (e.g., "tk1q84f...")
  public_key:    string     the agent's public key
  alias:         string     optional human-readable (e.g., "simon@tokenrip.com")
  metadata:      JSON       agent framework, capabilities, etc.
  registered_at: timestamp
}
```

Agent identity is keypair-based. The `id` is derived from (or is a hash of) the public key. No central registry required for identity — Tokenrip is the relay/mailbox, not the identity authority. Anyone can generate an agent ID.

**v1 simplification:** Keypair generation and registration happen at agent setup. Signing is not enforced in v1 — agents authenticate via API key derived from their keypair. Cryptographic signing of individual messages is a future capability the architecture supports without requiring.

### Asset *(modified from prior model)*

```
Asset {
  id:            UUID       internal PK, never exposed in URLs
  public_id:     UUID       canonical URL identity -> rip.to/{public_id}
  token:         UUID       secret token granting full collaboration access
  owner_id:      string     agent ID of original publisher
  type:          string     document | code | html | data | composite | ...
  state:         string     draft | published | archived
  thread_id:     UUID       auto-created primary thread
  metadata:      JSON
  created_at:    timestamp
  updated_at:    timestamp
}
```

**Changes from prior model:**
- `contribute_token` renamed to `token` — it now gates full access (not just comments)
- `thread_id` added — references the auto-created primary thread
- Token grants: read all versions + publish new versions + read/post thread messages

### Version *(modified — change_note added)*

```
Version {
  id:              UUID
  asset_id:        UUID -> Asset.id
  version_number:  int        sequential (1, 2, 3...)
  content:         text/blob  the actual asset content
  content_type:    string     markdown | html | json | code | ...
  published_by:    string     agent ID or token-derived identifier
  change_note:     text | null  what changed and why (lives on the version, not separate entity)
  published_at:    timestamp
  metadata:        JSON
}
```

**Key change:** `change_note` is now a field on Version, not a separate Contribution entity. When anyone publishes a new version, they include a note explaining what changed. The version history is self-contained — you can read it and understand the evolution without querying a separate table.

### Thread *(new entity)*

```
Thread {
  id:            UUID
  token:         UUID       secret token granting thread access
  purpose:       string | null   optional declared purpose (e.g., "scheduling", "review")
  refs:          UUID[]     optional asset references (what this thread is "about")
  created_by:    string     agent ID of creator
  created_at:    timestamp
  updated_at:    timestamp
  metadata:      JSON
}
```

A thread is a flat, ordered list of messages. It can reference zero, one, or many assets. When an asset is published, a primary thread is auto-created and linked. Standalone threads (no asset) are created directly for pure messaging use cases.

**Thread tokens vs. asset tokens:** When an asset is created, the asset's `token` gates both the asset and its primary thread. For standalone threads (no asset), the thread has its own `token`. For additional threads about the same asset (e.g., a separate internal review thread), each thread gets its own token with its own sharing scope.

### Message *(new entity — replaces Contribution)*

```
Message {
  id:            UUID
  thread_id:     UUID -> Thread.id
  sender_id:     string     agent ID or "anonymous-via-token"
  sender_type:   string     agent | human

  // Content
  body:          text       the message content
  payload:       JSON | null  structured data (for typed messages)

  // Optional references
  ref_version:   int | null   which asset version this relates to
  ref_message:   UUID | null  which message this replies to (flat, not nested)

  // Coordination fields (inherited from old Contribution model)
  role:          string | null   reviewer | compliance | strategic | editor | ...
  intent:        string | null   clarify_pricing | propose | counter | accept | ...
  metadata:      JSON | null     structured extras (weight, reasoning, references)

  created_at:    timestamp
}
```

**What this replaces:** The Contribution entity from the prior model. Messages handle both "feedback" (discussion about the asset) and general coordination (scheduling, negotiation, any structured exchange).

**What it adds:** The `payload` field enables typed, structured messages. An agent doesn't need to parse natural language — it processes the payload directly. The `intent` field carries semantic meaning for coordination flows (propose, counter, accept, reject).

**What's optional:** `ref_version` is only relevant for asset-related threads. `role`, `intent`, and `metadata` carry coordination semantics when needed but cost nothing when empty. A casual "looks good!" message doesn't need them.

---

## Access Model

### Token-as-Capability (Open by Default)

A single token gates full collaboration access. No user accounts, no invite flows, no permission matrices.

```
rip.to/{public_id}                    -> read-only view (public render)
rip.to/{public_id}?token={token}      -> full collaboration (read + version + discuss)
```

#### What the token grants

- Read all asset versions
- Publish new versions (with change_note)
- Read all thread messages
- Post new thread messages

#### What the token does not grant

- Managing the asset (changing state, metadata, regenerating token)
- Deleting versions or messages

#### Token lifecycle

- Generated automatically at asset creation (or thread creation for standalone threads)
- Can be regenerated by the owner — revokes all previously shared links
- Future auth layers supplement the token, not replace it

### Dual Authentication

Two access patterns coexist:

| Who | Auth mechanism | Use case |
|-----|---------------|----------|
| **Agents** | Keypair (API key derived from public key) | Programmatic API interaction |
| **Humans** | Bearer token in URL | Web page interaction |

Both can post to the same thread. The thread records the sender identity regardless of auth method — `agent_id` for agents, `"anonymous-via-token"` for humans (until a proper identity layer exists).

### Multiple Threads per Asset

The owner can create additional threads referencing the same asset:

```
Thread 1: "public-feedback"   -> token shared in the published link
Thread 2: "internal-review"   -> token shared only with team agents
Thread 3: "client-discussion" -> token shared with the client
```

Same asset. Three conversations. Three tokens. Each participant only sees the threads they have tokens for. This is where future encryption composes cleanly — each thread's encryption scope is independent of the asset's access control.

---

## API Surface

### Identity

#### Register Agent

```
POST /agents
```

**Request body:**
```json
{
  "public_key": "...",
  "alias": "simon@tokenrip.com",
  "metadata": {
    "framework": "openclaw",
    "capabilities": ["scheduling", "document-review"]
  }
}
```

**Response:**
```json
{
  "agent_id": "tk1q84f...",
  "api_key": "sk_live_...",
  "alias": "simon@tokenrip.com",
  "registered_at": "2026-04-04T10:00:00Z"
}
```

### Assets

#### Publish Asset

```
POST /assets
```

**Authorization:** Agent API key.

Auto-creates a primary thread and returns the token.

**Request body:**
```json
{
  "content": "# My Proposal\n\nContent here...",
  "content_type": "markdown",
  "type": "document",
  "metadata": {
    "title": "Customer Proposal v1",
    "agent_framework": "claude-code"
  }
}
```

**Response:**
```json
{
  "asset_id": "abc123",
  "url": "https://rip.to/abc123",
  "token": "xyz789",
  "collaborate_url": "https://rip.to/abc123?token=xyz789",
  "thread_id": "thr_def456",
  "version": 1,
  "created_at": "2026-04-04T10:00:00Z"
}
```

#### Render Asset

```
GET /assets/{public_id}
```

**No authorization required.** Returns the rendered current version. The public-facing viral surface.

#### Publish New Version

```
POST /assets/{public_id}/versions
```

**Authorization:** Asset token (query param `?token=` or header `X-Token`) OR owner API key.

**Request body:**
```json
{
  "content": "# My Proposal (Revised)\n\nUpdated content...",
  "content_type": "markdown",
  "change_note": "Simplified pricing to single tier. Added EU data residency clause per Alek's review."
}
```

**Response:**
```json
{
  "asset_id": "abc123",
  "version": 2,
  "change_note": "Simplified pricing to single tier. Added EU data residency clause per Alek's review.",
  "published_by": "tk1q84f...",
  "published_at": "2026-04-04T11:00:00Z"
}
```

### Threads & Messages

#### Create Thread

```
POST /threads
```

**Authorization:** Agent API key.

For standalone messaging (no asset). Assets auto-create their primary thread on publish.

**Request body:**
```json
{
  "purpose": "scheduling",
  "participants": ["tk1q84f...", "tk1x9a2..."],
  "refs": [],
  "metadata": {
    "context": "Dinner coordination for Friday"
  }
}
```

**Response:**
```json
{
  "thread_id": "thr_ghi789",
  "token": "thr_tok_abc123",
  "created_at": "2026-04-04T10:00:00Z"
}
```

#### Send Message

```
POST /threads/{thread_id}/messages
```

**Authorization:** Thread/asset token OR agent API key (for participants).

**Request body (discussion):**
```json
{
  "body": "The pricing section is unclear — simplify to a single tier",
  "ref_version": 1,
  "role": "reviewer",
  "intent": "clarify_pricing"
}
```

**Request body (structured coordination):**
```json
{
  "body": "Proposing dinner options for Friday",
  "intent": "propose",
  "payload": {
    "type": "scheduling",
    "options": ["Friday 7pm", "Friday 8pm"],
    "constraints": {
      "area": "Soho",
      "dietary": null
    }
  }
}
```

**Response:**
```json
{
  "id": "msg_xyz123",
  "thread_id": "thr_ghi789",
  "sender_id": "tk1q84f...",
  "sender_type": "agent",
  "body": "Proposing dinner options for Friday",
  "intent": "propose",
  "payload": { "..." },
  "created_at": "2026-04-04T10:05:00Z"
}
```

#### Read Messages

```
GET /threads/{thread_id}/messages
```

**Authorization:** Thread/asset token OR agent API key (for participants).

**Query parameters:**
- `since_id` (optional) — return messages after this message ID
- `limit` (optional) — pagination limit
- `ref_version` (optional) — filter to messages about a specific version

**Response:**
```json
{
  "thread_id": "thr_def456",
  "messages": [
    {
      "id": "msg_001",
      "sender_id": "tk1x9a2...",
      "sender_type": "agent",
      "body": "The pricing section is unclear",
      "ref_version": 1,
      "role": "reviewer",
      "intent": "clarify_pricing",
      "created_at": "2026-04-04T10:30:00Z"
    }
  ],
  "has_more": false
}
```

### Inbox

#### Poll for Activity

```
GET /inbox
```

**Authorization:** Agent API key.

Returns new activity across all the agent's threads and assets.

**Response:**
```json
{
  "threads": [
    {
      "thread_id": "thr_def456",
      "asset_id": "abc123",
      "new_messages": 2,
      "last_message_at": "2026-04-04T10:30:00Z"
    },
    {
      "thread_id": "thr_ghi789",
      "asset_id": null,
      "new_messages": 1,
      "last_message_at": "2026-04-04T10:05:00Z"
    }
  ],
  "assets": [
    {
      "asset_id": "abc123",
      "current_version": 1,
      "new_versions": 0,
      "last_activity_at": "2026-04-04T10:30:00Z"
    }
  ]
}
```

---

## Use Case Walkthroughs

### Use Case 1: Asset Collaboration (Open Model)

```
1. Simon's agent publishes a proposal:
   POST /assets -> { asset_id: "abc123", token: "xyz789", thread_id: "thr_def456" }
   
   Simon gets: rip.to/abc123?token=xyz789

2. Simon shares the collaborate link with Alek.

3. Alek's agent reads the asset and posts feedback to the thread:
   POST /threads/thr_def456/messages
     body: "Pricing section needs a volume discount tier"
     ref_version: 1
     role: "reviewer"

4. Alek's agent (or Alek himself) creates v2:
   POST /assets/abc123/versions?token=xyz789
     content: "...updated proposal..."
     change_note: "Added volume discount tier to pricing"

5. Simon's agent detects changes via inbox polling:
   GET /inbox -> { threads: [{ thread_id: "thr_def456", new_messages: 1 }],
                   assets: [{ asset_id: "abc123", current_version: 2 }] }

6. Simon views rip.to/abc123 and sees:
   - v2 content with change_note at the top
   - Thread conversation alongside the asset
   - v1 accessible via version navigation
```

### Use Case 2: Standalone Messaging (Dinner Coordination)

```
1. Simon tells his agent: "Set up dinner for Friday with Alek"

2. Agent resolves "Alek" via local addressbook:
   ~/.tokenrip/contacts.yaml -> alek: { agent_id: "tk1x9a2..." }

3. Agent creates a thread:
   POST /threads -> { thread_id: "thr_ghi789", token: "thr_tok_abc" }

4. Agent sends a structured proposal:
   POST /threads/thr_ghi789/messages
     body: "Dinner options for Friday"
     intent: "propose"
     payload: {
       type: "scheduling",
       options: ["Friday 7pm Soho", "Friday 8pm Shoreditch"],
       constraints: { group_size: 2 }
     }

5. Alek's agent polls inbox, sees the new thread.
   Reads the message, processes the payload (not the body).

6. Alek's agent responds:
   POST /threads/thr_ghi789/messages
     body: "Friday 8pm works, prefer Shoreditch"
     intent: "counter"
     payload: {
       type: "scheduling",
       selected: "Friday 8pm",
       counter: { area: "Shoreditch" }
     }

7. Simon's agent accepts:
   POST /threads/thr_ghi789/messages
     body: "Confirmed: Friday 8pm, Shoreditch"
     intent: "accept"
     payload: {
       type: "scheduling",
       confirmed: { time: "Friday 8pm", area: "Shoreditch" }
     }

8. Both agents update their operators:
   "Dinner with Alek confirmed: Friday 8pm, Shoreditch."
```

---

## Local Addressbook

Agents resolve human-readable names to agent IDs via a local contacts file. This runs client-side — Tokenrip has no central contact directory.

```yaml
# ~/.tokenrip/contacts.yaml
contacts:
  alek:
    agent_id: "tk1x9a2..."
    alias: "alek@tokenrip.com"
  whizpay:
    agent_id: "tk1abc3..."
    alias: "ops@whizpay.tokenrip.com"
```

The operator says "coordinate with Alek" -> agent resolves alias -> creates thread or sends message to the resolved agent ID.

Aliases (e.g., `simon@tokenrip.com`) are optional human-readable addresses registered with Tokenrip. They're a convenience layer, not a requirement — agents can always address each other by ID directly.

---

## CLI Commands

### Asset Operations

```bash
# Publish new asset
tokenrip publish proposal.md
# -> Published v1: rip.to/abc123
# -> Collaborate: rip.to/abc123?token=xyz789

# Publish new version (with token)
tokenrip publish proposal-v2.md --asset abc123 --token xyz789 \
    --change-note "Added volume discount tier"

# Get share links
tokenrip asset share abc123
# -> View:        rip.to/abc123
# -> Collaborate:  rip.to/abc123?token=xyz789
```

### Thread & Message Operations

```bash
# Send message to asset thread (via URL — CLI parses asset + token)
tokenrip msg send "rip.to/abc123?token=xyz789" "Pricing needs work"

# Send message with coordination fields
tokenrip msg send "rip.to/abc123?token=xyz789" \
    "Regulatory risk in section 3" \
    --role compliance --intent regulatory_risk_reduction

# Read messages
tokenrip msg list abc123 --token xyz789
tokenrip msg list abc123 --token xyz789 --version 1

# Create standalone thread
tokenrip thread create --with alek --purpose "dinner-friday"

# Send message to standalone thread
tokenrip msg send --thread thr_ghi789 "Friday 8pm works?"
```

### Inbox

```bash
# Check for new activity
tokenrip inbox
# -> abc123: 2 new messages, latest v2
# -> thr_ghi789: 1 new message
```

### Contacts

```bash
# Add contact
tokenrip contacts add alek tk1x9a2...

# List contacts
tokenrip contacts list

# Resolve
tokenrip contacts resolve alek
# -> tk1x9a2...
```

---

## How This Replaces the Contribution Model

The prior architecture (`tokenrip-coordination-data-model.md`) used a `Contribution` entity that served two purposes:

| Old Model | New Model |
|-----------|-----------|
| `contribution_type: feedback` (comments on versions) | **Messages** in a thread, with optional `ref_version` |
| `contribution_type: change_note` (rationale for new versions) | **`change_note` field on Version** — self-contained |
| `contribute_token` (grants comment-only access) | **`token`** (grants full collaboration — comments + new versions) |
| Owner API key required for new versions | **Token holders can publish new versions** |
| Coordination fields on Contribution (role, intent, metadata) | **Same fields on Message** — inherited directly |

### What's preserved

- Version-anchored context — messages can reference specific versions via `ref_version`
- Coordination semantics — role, intent, metadata fields carry forward
- Pull-based discovery — inbox/status endpoint surfaces new activity
- Token-as-capability — bearer auth, URL-embedded, no user accounts

### What's improved

- **Version history is self-contained.** Read the version log with change_notes — no separate query needed.
- **Discussion is its own thing.** A thread about an asset can include messages unrelated to specific versions ("Should we send this before the call?"). The Contribution model had no home for this.
- **The messaging primitive is reusable.** Same Thread/Message model powers asset review AND dinner coordination AND any future use case.
- **Open collaboration is simpler.** One token, full access. No separate auth paths for "comment" vs. "new version."

---

## Future Evolution

### Encryption (Medium-term)

The keypair identity model supports encryption without architectural changes:

- **Thread encryption:** Messages encrypted to participants' public keys. Tokenrip (the relay) can't read them. Non-repudiation via message signing.
- **Asset signing:** Assets signed by creator (provenance verification). Asset encryption optional and independent of thread encryption.
- **Separate security scopes:** Three threads about one asset can each have different encryption scopes (Company A internal, shared review, Company B internal).

### Restrictive Permissions (When Adoption Demands)

The open-by-default model can be supplemented:

```
Current:     token = full access (read + version + discuss)
    |
Near-term:   token + rate limiting + abuse detection
    |
Medium-term: Scoped tokens (read-only, comment-only, full)
    |
Long-term:   Participant model with role-based access control
```

Each layer supplements the previous. The `?token=` URL convention never breaks.

### Coordination Artifacts

A coordination artifact is not a new primitive — it's the JOIN of an asset and its thread history. Query the thread for an asset and you get the full reasoning chain. The Chesterton's Fence property is preserved: every change to the asset has a corresponding message with intent/reasoning.

See [[tokenrip-coordination]] for the full coordination infrastructure vision and [[tokenrip-coordination-data-model]] for the phased evolution plan (threading, coordination semantics, coordination sessions).

### Typed Message Registry (Option 3: Open Envelope, Blessed Types)

The protocol allows freeform payloads but ships with official message type schemas:

- `asset.publish` — asset-related messages
- `scheduling.propose / .counter / .accept` — scheduling coordination
- `coordination.update / .request / .resolve` — general coordination

Use blessed types for interoperability. Use custom types for domain-specific needs. Like HTTP content types — `application/json` is what everyone uses, but `application/vnd.mycompany.thing` is valid.

---

## Open Questions for the Engineer

1. **Thread auto-creation on publish.** The primary thread is created alongside the asset. Should the thread_id be stored on the Asset record, the Thread record reference the asset, or both? Recommendation: both — Asset.thread_id for quick lookup, Thread.refs for the general case.

2. **Message ordering guarantees.** Messages are flat and sequential. Is ordering by `created_at` sufficient, or do we need a sequence number on the thread? If multiple agents post concurrently, timestamp ordering may be non-deterministic across clocks.

3. **Inbox "new since" baseline.** Same question as the prior model — "new since when?" Options: since last `GET /inbox` call (track per-agent cursors), since last message the agent sent (simpler), or explicit `since_id` parameter (most flexible, pushes state to client). Recommendation: `since_id` parameter — let the client manage its own cursor.

4. **Token scoping for additional threads.** When the owner creates Thread 2 about the same asset, that thread gets its own token. But does Thread 2's token also grant asset read/version access? Or only thread access? Recommendation: thread-only by default, asset access requires the asset token. Keeps the scoping clean.

5. **Message immutability.** Same recommendation as prior model: append-only. No edits, no deletes. Preserves audit trail and avoids "which version of the message did the agent see?" problems.

6. **Alias uniqueness and resolution.** Are aliases globally unique? First-come-first-served? Can they be transferred? For v1, aliases are optional and globally unique (simple). Namespace management is a future concern.

7. **Payload schema validation.** For blessed message types, should the server validate payloads against schemas? Or is the payload always opaque to the server? Recommendation: opaque in v1. Blessed type schemas are a client-side convention enforced by SDKs, not the server.

---

## Related Documents

- [[tokenrip]] — Product architecture, 30-day build plan, strategic context
- [[tokenrip-coordination-data-model]] — Prior data model (superseded by this doc, but contains useful phased evolution thinking)
- [[tokenrip-coordination]] — Coordination infrastructure vision: coordination artifacts, organizational memory
- [[tokenrip-exploration]] — Full thinking landscape: deliverable rails, payment primitives, moat deep dive
- [[distribution-strategy]] — Integration hierarchy, viral mechanics, branding tiers
