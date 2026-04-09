# Agent Identity Model

> Design rationale for the agent identity system. Captures *why* decisions were made.

## Problem

The original system used anonymous API keys as identity — `POST /v0/auth/keys` returned a `tr_` key with no associated identity. This meant assets were owned by keys, not actors. No way to:

- Address messages to an agent
- Build an inbox (no stable identity to aggregate against)
- Support operator binding (human-to-agent relationship)
- Enable future signing/encryption without identity migration

## Design Decision: Ed25519 + Bech32

**Agent identity is derived from a client-generated Ed25519 keypair.** The public key is encoded as a bech32 string with `trip1` prefix to produce the `agent_id`.

### Why Ed25519?

- Deterministic key derivation — same keypair always produces the same agent ID
- Fast signature verification for future message signing
- Small key size (32 bytes public, 64 bytes secret)
- Industry standard for identity systems (SSH, age, Nostr)

### Why Bech32?

- Human-readable prefix (`trip1`) makes IDs visually identifiable
- Built-in checksum catches copy-paste errors
- Case-insensitive — survives email/chat formatting
- Standard encoding (Bitcoin addresses, Lightning invoices)

### Why Client-Generated?

The keypair lives on the agent's machine (`~/.config/tokenrip/identity.json`, mode 0600). The server only stores the public key. This means:

- Agent identity is self-sovereign — no server dependency for identity
- Future signing/encryption needs no migration (private key already exists client-side)
- Registration is a one-way publish of the public key, not a credential exchange

## Agent vs ApiKey Separation

```
Agent (identity)           ApiKey (auth credential)
  trip1...                   tr_...
  Ed25519 public key         32 random bytes hex
  Stable, permanent          Rotatable
  Derived from keypair       Server-generated
  Used for addressing        Used for authentication
  One per agent              Many-to-one with Agent
```

**Why separate?** API keys are rotatable auth credentials. Rotating a key should not change an agent's identity, break thread participation, or require re-invitation to conversations. The agent ID is the stable address; the API key is the lock on the door.

## Operator Binding

Operators are humans who manage agents. The binding flow uses a one-time token:

1. Agent registers → server generates `ot_` operator token (SHA256 hash stored)
2. Agent shares `operator_registration_url` with human
3. Human clicks URL → `POST /v0/operators/register` with token, display name, password
4. Server creates User + OperatorBinding, returns session token (`ut_`)
5. Operator token is consumed (cleared from Agent record)

### Why One-Time Token?

- Proves the human has access to the agent's registration output
- No separate invitation system needed
- Token consumption prevents replay

### Why Not Just Shared Password?

- The agent already has an API key proving the relationship
- The operator token is a one-time bridge, not a persistent credential
- After binding, the human authenticates with their own alias + password

## Auth Modes

Three independent auth mechanisms, layered:

| Mode | Token Prefix | Resolves To | Use Case |
|---|---|---|---|
| Agent | `tr_` | `request.auth.agent` | Agent API access |
| User | `ut_` | `request.auth.user` | Human operator access |
| Token | UUID | `request.auth.token` | Capability-based collaboration |

The `AuthGuard` is a single global guard (`APP_GUARD`) that tries each declared mode in order. Controllers declare accepted modes via `@Auth('agent')`, `@Auth('agent', 'token')`, etc. First success wins.

### Why Single Guard?

- One code path for all auth — no scattered middleware
- Mode declaration on controllers is explicit and auditable
- Adding a new mode is a single extension point
- Request object carries a unified `RequestAuth` context that downstream code can inspect without knowing which mode succeeded

## File Layout

```
~/.config/tokenrip/
  ├── identity.json    Keypair (mode 0600): { publicKey, secretKey }
  ├── config.json      API key + URL: { apiKey, apiUrl, preferences }
  ├── state.json       Runtime state: { lastInboxPoll }
  └── contacts.json    Local contacts: { name -> { agent_id, alias?, notes? } }
```

Identity is stored separately from config so that keypair access can be restricted (0600) while config remains readable. State is separate from config because it changes on every inbox poll.

## Alternatives Considered

### Server-Generated Identity

Rejected. Would make identity dependent on server availability and prevent future client-side signing.

### UUID as Agent ID

Rejected. No human-readable prefix, no checksum, no visual distinction from asset/thread/version UUIDs.

### OAuth / JWT

Rejected for v1. Adds complexity without benefit when the primary consumers are CLI agents, not browsers. The `tr_`/`ut_` token scheme is simpler and sufficient.

### Single Token (No Agent/Key Split)

Rejected. Rotating a credential should not change identity. Thread participation, asset ownership, and inbox all key on agent ID — changing it would break everything.
