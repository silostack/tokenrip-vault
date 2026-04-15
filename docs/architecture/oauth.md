# OAuth 2.1 Authentication (MCP Server)

> Living document. Update when the OAuth flow, endpoints, or entity model changes.

## Overview

OAuth 2.1 provides seamless registration and login for MCP clients (Claude Cowork, etc.). When a user adds the Tokenrip MCP server as a connector, they are redirected to a browser page to register or log in. The flow creates an Agent + User + OperatorBinding in a single transaction, then returns an API key as the OAuth access token.

### Design Principles

| Principle | Meaning |
|---|---|
| One-step onboarding | Registration creates Agent, User, OperatorBinding, and API key atomically |
| PKCE-only | All flows require Proof Key for Code Exchange (S256) -- no client secrets |
| Server-side keys | MCP-registered agents get server-generated Ed25519 keypairs (unlike CLI agents) |
| Standard discovery | `/.well-known/oauth-authorization-server` metadata for automatic client configuration |
| Stateless tokens | Access tokens are regular `tr_` API keys -- no OAuth-specific token storage |

---

## Discovery

`GET /.well-known/oauth-authorization-server` returns standard OAuth 2.0 authorization server metadata (RFC 8414):

```json
{
  "issuer": "{API_URL}",
  "authorization_endpoint": "{FRONTEND_URL}/oauth/authorize",
  "token_endpoint": "{API_URL}/oauth/token",
  "registration_endpoint": "{API_URL}/register",
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code"],
  "code_challenge_methods_supported": ["S256"]
}
```

Configured via `API_URL` and `FRONTEND_URL` environment variables on the backend.

---

## Registration Flow (First-Time User)

```
MCP Client                   Browser / Frontend              Backend
    │                              │                            │
    │  1. Open browser to          │                            │
    │  /oauth/authorize?           │                            │
    │    client_id=...             │                            │
    │    redirect_uri=...          │                            │
    │    state=...                 │                            │
    │    code_challenge=...        │                            │
    │    code_challenge_method=S256│                            │
    │    response_type=code        │                            │
    │ ─────────────────────────────>                            │
    │                              │                            │
    │                  2. Show "Connect to Tokenrip"            │
    │                     Register tab (default)                │
    │                              │                            │
    │                  3. User fills:                            │
    │                     - display name                        │
    │                     - password                            │
    │                     - agent alias (optional, .ai)         │
    │                     - user alias (optional)               │
    │                              │                            │
    │                  4. POST /oauth/register ─────────────────>
    │                     { displayName, password,              │
    │                       agentAlias?, userAlias?,            │
    │                       codeChallenge, redirectUri }        │
    │                              │                            │
    │                              │  5. In one transaction:    │
    │                              │     - Agent (Ed25519 keypair)
    │                              │     - AgentKeyPair (server-side)
    │                              │     - ApiKey (tr_...)      │
    │                              │     - User (scrypt password)
    │                              │     - OperatorBinding      │
    │                              │     - OAuthCode (10 min)   │
    │                              │                            │
    │                              │  6. { ok: true, code }     │
    │                              <─────────────────────────────
    │                              │                            │
    │  7. Redirect to              │                            │
    │     redirect_uri?code=...    │                            │
    │     &state=...               │                            │
    │ <─────────────────────────────                            │
    │                              │                            │
    │  8. POST /oauth/token ───────────────────────────────────>
    │     { grant_type: "authorization_code",                   │
    │       code, code_verifier, redirect_uri }                 │
    │                              │                            │
    │                              │  9. Verify PKCE (S256)     │
    │                              │     Mark code used         │
    │                              │     Create new API key     │
    │                              │                            │
    │  10. { access_token: "tr_...",                            │
    │       token_type: "bearer" } <────────────────────────────
    │                              │                            │
```

---

## Login Flow (Returning User)

Same authorize page, user clicks the "Log in" tab.

```
MCP Client                   Browser / Frontend              Backend
    │                              │                            │
    │  1. Open /oauth/authorize    │                            │
    │ ─────────────────────────────>                            │
    │                              │                            │
    │                  2. User clicks "Log in" tab              │
    │                     Enters alias + password               │
    │                              │                            │
    │                  3. POST /oauth/login ────────────────────>
    │                              │                            │
    │                              │  4. Verify credentials     │
    │                              │     Find OperatorBinding   │
    │                              │     -> Agent               │
    │                              │     Create OAuthCode       │
    │                              │                            │
    │                              │  5. { ok: true, code }     │
    │                              <─────────────────────────────
    │                              │                            │
    │  6. Redirect + token exchange (same as registration)      │
    │                              │                            │
```

---

## PKCE (Proof Key for Code Exchange)

All OAuth flows require PKCE with the S256 method. No client secrets are used.

```
Client                                     Server
  │                                          │
  │  Generate code_verifier (random)         │
  │  Compute code_challenge =                │
  │    BASE64URL(SHA256(code_verifier))      │
  │                                          │
  │  Authorization request with              │
  │  code_challenge ───────────────────────> │
  │                                          │  Store code_challenge
  │                                          │  with OAuthCode
  │  Token exchange with                     │
  │  code_verifier ────────────────────────> │
  │                                          │  Verify:
  │                                          │  BASE64URL(SHA256(verifier))
  │                                          │  == stored challenge
  │                                          │
```

This prevents authorization code interception attacks -- even if the code is stolen in transit, it cannot be exchanged without the original verifier.

---

## Server-Side Key Management

MCP-registered agents have their Ed25519 keypair generated and stored server-side in the `AgentKeyPair` entity. This differs from CLI-registered agents where the keypair lives on the agent's local machine.

The `AgentKeyPair` stores the secret key, enabling:

- Server-side signing for operator links
- Future capability token signing on behalf of the agent

**TODO:** The secret key is currently stored as plaintext hex. Must be encrypted with AES-256-GCM using a key from an environment variable before production deployment.

---

## Alias Validation

Two types of aliases with different constraints:

| Alias type | Required? | Format | Suffix | Example |
|---|---|---|---|---|
| Agent alias | Optional | Lowercase alphanumeric, hyphens, underscores | `.ai` (auto-appended) | `my-agent.ai` |
| User alias | Optional | Lowercase alphanumeric, hyphens | Must NOT end with `.ai` | `simon` |

Both aliases must be globally unique. The `POST /oauth/check-alias` endpoint enables inline frontend validation with debounced requests as the user types.

---

## Entity Model

### AgentKeyPair

Server-side Ed25519 key storage for MCP-registered agents.

```
AgentKeyPair
  id                 UUID (PK)
  agent              OneToOne -> Agent (cascade delete)
  encryptedSecretKey text (hex-encoded secret key)
  createdAt          timestamp
```

### OAuthCode

Short-lived authorization code linking the browser flow to the token exchange.

```
OAuthCode
  id                 UUID (PK)
  codeHash           text (unique, SHA256 of raw code)
  agentId            UUID (FK -> Agent)
  codeChallenge      text (PKCE S256 challenge)
  redirectUri        text
  expiresAt          timestamp (10 min from creation)
  used               boolean (prevents replay)
  createdAt          timestamp
```

The raw code is never stored -- only its SHA256 hash. The code is single-use and expires after 10 minutes.

---

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/.well-known/oauth-authorization-server` | Public | OAuth discovery metadata (RFC 8414) |
| POST | `/register` | Public | Dynamic Client Registration (RFC 7591) — issues a client_id for MCP clients |
| POST | `/oauth/register` | Public | Register new agent + user + operator binding |
| POST | `/oauth/login` | Public | Login existing user, get auth code |
| POST | `/oauth/token` | Public | Exchange authorization code for API key |
| POST | `/oauth/check-alias` | Public | Check alias availability (agent or user) |

All endpoints are public -- authentication happens within the flow itself (password verification for login, PKCE for token exchange).

---

## Frontend Page

`/oauth/authorize` is a TanStack Start route in the frontend app.

**Features:**

- Register / Login tab toggle (register is default)
- Display name, password, agent alias, user alias fields
- Inline alias availability checking (debounced POST to `/oauth/check-alias`)
- Error display for validation failures
- OAuth query params (`client_id`, `redirect_uri`, `state`, `code_challenge`, `code_challenge_method`) preserved through the flow
- Redirect handling on success -- appends `code` and `state` to the `redirect_uri`

---

## Security Considerations

| Concern | Mitigation |
|---|---|
| Code interception | PKCE S256 required on all flows |
| Code replay | `used` boolean flag, checked atomically on exchange |
| Code expiry | 10-minute TTL, checked on exchange |
| Code storage | Only SHA256 hash stored, raw code never persisted |
| Password storage | scrypt hashing (same as operator auth) |
| Redirect URI | Stored with OAuthCode, verified on token exchange |
| Key storage | Ed25519 secret keys server-side (encryption TODO) |

---

## Key Files

| File | Purpose |
|---|---|
| `apps/backend/src/oauth/oauth.module.ts` | NestJS module registration |
| `apps/backend/src/oauth/oauth.service.ts` | Registration, login, code exchange, alias validation |
| `apps/backend/src/oauth/oauth.controller.ts` | HTTP endpoints for all OAuth routes |
| `apps/backend/src/db/models/AgentKeyPair.ts` | Server-side Ed25519 key entity |
| `apps/backend/src/db/models/OAuthCode.ts` | Authorization code entity |
| `apps/frontend/src/app/oauth/authorize.tsx` | TanStack Start route definition |
| `apps/frontend/src/components/oauth/OAuthAuthorizePage.tsx` | Registration and login form UI |
| `apps/backend/migrations/Migration20260413_mcp-oauth.ts` | Database migration for OAuth tables |

---

## How It Fits Together

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  MCP Client │     │    Frontend       │     │    Backend        │
│  (Claude,   │     │  /oauth/authorize │     │  /oauth/*        │
│   etc.)     │     │                   │     │                  │
│             │     │  Register/Login   │     │  OAuthService    │
│  Holds:     │     │  form             │     │  - register()    │
│  - verifier │     │                   │     │  - login()       │
│  - state    │     │  Redirects back   │     │  - exchangeCode()│
│  - token    │     │  with code+state  │     │  - checkAlias()  │
└──────┬──────┘     └────────┬─────────┘     └────────┬─────────┘
       │                     │                         │
       │  browser redirect   │   POST /oauth/register  │
       │ ──────────────────> │ ──────────────────────> │
       │                     │ <────────────────────── │
       │ <────────────────── │   { code }              │
       │   redirect_uri?code │                         │
       │                     │                         │
       │  POST /oauth/token  │                         │
       │ ─────────────────────────────────────────────>│
       │ <─────────────────────────────────────────────│
       │  { access_token: "tr_..." }                   │
       │                                               │
       │  Now uses tr_ key for all API calls           │
       │ ─────────────────────────────────────────────>│
       │                                               │
```

The result: an MCP client holds a standard `tr_` API key, identical to what the CLI produces. All downstream API calls use the same auth path -- no OAuth-specific middleware required after the initial flow.
