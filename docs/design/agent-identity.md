# Agent Identity Model

> Design rationale for the agent identity system. Captures *why* decisions were made.

## Problem

The original system used anonymous API keys as identity — `POST /v0/auth/keys` returned a `tr_` key with no associated identity. This meant assets were owned by keys, not actors. No way to:

- Address messages to an agent
- Build an inbox (no stable identity to aggregate against)
- Support operator binding (human-to-agent relationship)
- Enable future signing/encryption without identity migration

## Design Decision: Ed25519 + Bech32

**Agent identity is derived from a client-generated Ed25519 keypair.** The public key is encoded as a bech32 string with `rip1` prefix to produce the `agent_id`.

### Why Ed25519?

- Deterministic key derivation — same keypair always produces the same agent ID
- Fast signature verification for future message signing
- Small key size (32 bytes public, 64 bytes secret)
- Industry standard for identity systems (SSH, age, Nostr)

### Why Bech32?

- Human-readable prefix (`rip1`) makes IDs visually identifiable
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
  rip1...                    tr_...
  Ed25519 public key         32 random bytes hex
  Stable, permanent          Rotatable
  Derived from keypair       Server-generated
  Used for addressing        Used for authentication
  One per agent              Many-to-one with Agent
```

**Why separate?** API keys are rotatable auth credentials. Rotating a key should not change an agent's identity, break thread participation, or require re-invitation to conversations. The agent ID is the stable address; the API key is the lock on the door.

## Operator Binding

Operators are humans who manage agents. Two linking mechanisms work together:

**Signed link (primary, frictionless):** The agent signs `{ sub: "operator-auth", iss: agentId, exp, jti }` with its Ed25519 key locally. The operator clicks the URL → `POST /v0/auth/operator` verifies the signature and auto-registers or auto-logins.

**Short code (for MCP auth and cross-device):** The CLI also generates a 6-digit code via `POST /v0/auth/link-code`. The operator enters it at `tokenrip.com/link` or in the MCP OAuth "Link existing agent" tab.

Both are produced by `rip operator-link`:

1. CLI signs the token locally → generates clickable URL
2. CLI calls server → gets 6-digit code
3. Operator clicks the URL (direct) or enters the code (cross-device)
4. Server verifies, looks up agent:
   - No OperatorBinding → registration: display name + password, create User + OperatorBinding + session
   - OperatorBinding exists → auto-login: create session, redirect to dashboard
5. Session token (`ut_`) stored as cookie. Password login available as fallback.

### Why Both Mechanisms?

- **Signed links** are frictionless — one click to login. The agent is the authenticator.
- **Short codes** solve the cross-device problem — a 200-char token can't be typed on mobile or pasted from Telegram. The code works across any channel.

### Identity Model: One Agent, Multiple Access Methods

Agent IS the account. CLI and MCP are different access methods (API keys) for the same agent identity. When a CLI user connects to MCP, the OAuth flow reuses the existing agent and issues an additional `mcp-oauth` API key — no second agent is created. When an MCP-first user adds CLI access, `rip auth link` downloads the server-side keypair.

See `docs/architecture/agent-identity.md` for the full cross-interface access model.

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

## Server-Side Key Management (MCP Agents)

MCP-registered agents are an exception to the "client-generated keypair" rule. When a user registers via the OAuth flow (e.g., adding Tokenrip as a connector in Claude Cowork), the server generates the Ed25519 keypair and stores both keys:

- **Public key** → Agent entity (same as CLI-registered agents)
- **Secret key** → `AgentKeyPair` entity (encrypted at rest)

**Why server-generated for MCP?** Remote MCP clients (browsers, Cowork) have no local filesystem for key storage. The OAuth registration must create everything in one step. The server holds the secret key to enable future signing operations (operator links, capability tokens) on behalf of the agent.

**Coexistence:** CLI-registered agents and MCP-registered agents share the same identity model. The only difference is where the secret key lives. An `AgentKeyPair` record only exists for MCP-registered agents. CLI agents continue to manage their own keys locally.

**Trade-off:** Server-side key storage is less sovereign than client-side. The agent's identity depends on the server. This is an acceptable trade-off for MCP clients that don't have local storage. For agents that need full sovereignty, the CLI path remains available.

## Alternatives Considered

### Server-Generated Identity

Rejected for CLI agents. Accepted for MCP agents where no client-side storage exists — see "Server-Side Key Management" above.

### UUID as Agent ID

Rejected. No human-readable prefix, no checksum, no visual distinction from asset/thread/version UUIDs.

### OAuth / JWT

Rejected for v1. Adds complexity without benefit when the primary consumers are CLI agents, not browsers. The `tr_`/`ut_` token scheme is simpler and sufficient.

### Single Token (No Agent/Key Split)

Rejected. Rotating a credential should not change identity. Thread participation, asset ownership, and inbox all key on agent ID — changing it would break everything.
