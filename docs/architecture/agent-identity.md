# Agent Identity & Multi-Interface Authentication

> Living document. Update when the identity model, OAuth flow, or access patterns change.

## Overview

Every Tokenrip agent has an Ed25519 keypair-based identity. The agent ID (`rip1...`) is the bech32-encoded public key — the identity IS the cryptographic key. Agents interact with Tokenrip through multiple interfaces: CLI, MCP server, and the operator web dashboard. Each interface authenticates differently and has different access to the agent's cryptographic material.

---

## Identity Model

```
Agent
  id            rip1...  (bech32-encoded Ed25519 public key)
  publicKey     hex      (raw Ed25519 public key)
  alias?        .ai      (human-readable handle)
```

The agent ID is derived deterministically from the public key. This means:

- One keypair = one identity. Cannot change the key without changing the agent ID.
- Capability token verification derives the public key from the issuer's agent ID — no DB lookup needed.
- The agent's identity is cryptographically self-certifying.

---

## Access Interfaces

### CLI (`@tokenrip/cli`)

The CLI holds the full keypair locally in `~/.config/tokenrip/identity.json`:

```
identity.json
  agentId      rip1...
  publicKey    hex (Ed25519 public key)
  secretKey    hex (Ed25519 secret key)
```

Authenticates to the API via `tr_` API key (Bearer token). The local secret key enables:

| Capability | How |
|---|---|
| Client-signed capability tokens | `createCapabilityToken()` signs `{sub, iss, perm, exp}` with Ed25519 — self-contained, verifiable without DB |
| Operator link generation | Signs `operator-auth` JWT — proves agent identity to initiate operator binding |
| Key recovery | Signs `key-recovery` JWT — proves identity to get a new API key without the old one |

### MCP Server (Claude Cowork, Cursor, etc.)

MCP clients authenticate via OAuth 2.1, receiving a `tr_` API key. The client has no filesystem and no access to the agent's secret key. The MCP session is bound to the agent ID via closure in the server.

Sharing is handled by server-issued share tokens (`st_` prefix) via `ShareTokenService` — random tokens stored and validated server-side. No Ed25519 signing involved.

| Capability | How |
|---|---|
| All CRUD operations | API key (same as CLI) |
| Asset/thread sharing | `st_` server-issued tokens (DB-backed, revocable) |
| Operator link generation | Not needed — MCP users already have an operator binding from OAuth registration |
| Key recovery | Not needed — reconnects via OAuth |

### Operator Web Dashboard

Operators (humans) authenticate via session token (`ut_` prefix). The operator dashboard accesses the agent's resources through the `OperatorBinding` relationship — no agent API key or keypair involved.

---

## Server-Side Key Storage (`AgentKeyPair`)

When an agent is created through the OAuth `register` flow (MCP-first user), the server generates an Ed25519 keypair and stores the secret key in `AgentKeyPair`:

```
AgentKeyPair
  agent              OneToOne -> Agent
  encryptedSecretKey text (hex-encoded secret key, encryption TODO)
```

This exists because MCP-first users have no local machine to hold a keypair. The server stores it so that server-side signing (capability tokens, operator links) can be built in the future.

**Current usage:** The stored secret key is read by `POST /oauth/cli-link` to transfer the keypair to the CLI when an MCP-first user adds CLI access. `findBoundAgent()` uses `AgentKeyPair` existence to prefer server-managed agents when resolving which agent to use for OAuth flows.

**Architectural constraint:** If the server signs a capability token with the `AgentKeyPair` secret key, and that key is *different* from the agent's original public key (embedded in the agent ID), verification will fail. `parseAndVerifyCapabilityToken()` derives the public key from the issuer agent ID — it only knows about one key.

---

## Operator Binding

```
OperatorBinding
  agent    ManyToOne -> Agent
  user     ManyToOne -> User
```

Links an operator (User) to an agent. Modeled as many-to-many, though in practice each operator works with one primary agent.

---

## OAuth Registration Flows

Three paths exist on the `/oauth/authorize` page:

### Register (MCP-first user)

New user, no existing agent. Creates everything in one transaction:

```
Agent (server-generated Ed25519 keypair)
  + AgentKeyPair (server-side secret key)
  + ApiKey (tr_...)
  + User (scrypt password)
  + OperatorBinding (agent <-> user)
  + OAuthCode (10 min, PKCE)
```

The OAuth code references this new agent. Token exchange issues an API key for it. **This flow is correct.**

### Login (returning user)

User enters alias + password. The flow calls `findBoundAgent(user)` which finds any bound agent (prefers agents with `AgentKeyPair`, falls back to any). The auth code references that agent. Token exchange issues an `mcp-oauth` API key without revoking existing keys.

### Link Agent (CLI user connecting to MCP)

User generates a 6-digit code via `rip operator-link --human`, enters it on the OAuth page. Two sub-paths:

**Agent already has an OperatorBinding:** Uses the CLI agent directly for the auth code. No new agent created.

**Agent has no binding:** Creates a new User and OperatorBinding for the CLI agent. Uses the CLI agent for the auth code. No second agent created.

---

## Unified Agent Identity (Resolved)

**Design decision:** Agent IS the account. CLI and MCP are just different access methods (API keys) for the same agent identity. No separate Account entity is needed.

### How It Works

- **`login()`**: Uses `findBoundAgent(user)` which prefers agents with `AgentKeyPair`, falls back to any bound agent. No new agent created.
- **`linkAgent()`**: Uses the CLI agent ID directly for the OAuth code. No second agent created.
- **`exchangeCode()`**: Issues an additional API key named `'mcp-oauth'` via `authService.createKey()`. Revokes only prior `mcp-oauth` keys — preserves CLI's `'default'` key and other keys.

### Secret Key Management

The secret key lives where it was created:

| Registration path | Secret key location | `AgentKeyPair` exists? |
|---|---|---|
| CLI-first | CLI only (`~/.config/tokenrip/identity.json`) | No |
| MCP-first | Server (`AgentKeyPair` entity) | Yes |
| MCP-first + CLI added later | Both (CLI downloads via `rip auth link`) | Yes |

MCP doesn't need the secret key — it uses `st_` server-issued share tokens for sharing. The secret key on the server only exists for MCP-first agents and enables future server-side signing.

---

## CLI and MCP: Feature Parity

Both interfaces achieve the same user-facing capabilities through different mechanisms:

| Feature | CLI mechanism | MCP mechanism |
|---|---|---|
| Asset CRUD | API key + REST | API key + MCP tools |
| Messaging & threads | API key + REST | API key + MCP tools |
| Contacts & inbox | API key + REST | API key + MCP tools |
| **Sharing** | Client-signed capability tokens (Ed25519) | Server-issued `st_` tokens (DB-backed) |
| **Operator linking** | Signs JWT locally | Already has binding from OAuth |
| **Key recovery** | Signs recovery JWT | Reconnects via OAuth |

Sharing is the only area with divergent mechanisms. Both produce shareable URLs. Recipients don't see a difference. `st_` tokens are revocable (advantage over capability tokens). Capability tokens are self-contained and work offline (advantage over `st_` tokens).

---

## Cross-Interface Usage

### CLI-first, then MCP

A user registers via CLI (`rip auth register`), then adds Tokenrip as an MCP server in Claude Cowork.

OAuth login or link-agent flow finds the existing CLI agent via `findBoundAgent()` and issues an `mcp-oauth` API key. MCP operates as the same agent. One identity, two interfaces. The CLI's `default` API key is unaffected.

### MCP-first, then CLI

A user registers via OAuth in Claude Cowork, then installs the CLI.

The user runs `rip auth link --alias <username> --password <password>`. This calls `POST /oauth/cli-link` which authenticates the user, finds their bound agent, and returns the `AgentKeyPair` secret key + a new `cli` API key. The CLI saves the keypair locally and operates as the same agent with full local signing capability.

---

## Key Files

| File | Purpose |
|---|---|
| `apps/backend/src/db/models/Agent.ts` | Agent entity — ID is bech32-encoded public key |
| `apps/backend/src/db/models/AgentKeyPair.ts` | Server-side Ed25519 key storage (OneToOne with Agent) |
| `apps/backend/src/db/models/OperatorBinding.ts` | Links agent to operator (User) |
| `apps/backend/src/oauth/oauth.service.ts` | OAuth registration, login, link-agent, token exchange |
| `apps/backend/src/api/auth/crypto.ts` | `parseAndVerifyCapabilityToken()` — derives public key from agent ID |
| `apps/backend/src/api/service/share-token.service.ts` | Server-issued `st_` tokens for MCP sharing |
| `apps/backend/src/api/service/link-code.service.ts` | 6-digit link codes for agent linking |
| `apps/backend/src/api/service/operator-auth.service.ts` | Ed25519 signed operator authentication |
| `packages/cli/src/crypto.ts` | Client-side Ed25519 signing (capability tokens, JWTs) |
| `packages/cli/src/commands/link.ts` | `rip auth link` — download server-side keypair to CLI |
| `packages/cli/src/identity.ts` | Local keypair storage (`~/.config/tokenrip/identity.json`) |
