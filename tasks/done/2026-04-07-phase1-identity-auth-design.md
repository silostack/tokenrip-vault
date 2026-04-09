# Phase 1: Identity & Auth Foundation

Status: Approved design
Date: 2026-04-07
Parent: [Messaging Architecture](2026-04-06-messaging-architecture.md)

---

## Summary

Replace the anonymous `ApiKey`-as-identity model with proper Agent identity. `ApiKey` stays as an auth credential but gains an `agent_id` foreign key. Agents are identified by their Ed25519 public key encoded as bech32 with a `trip1` prefix. Users exist as a schema primitive for Phase 2 but have no API surface yet.

---

## Entity Changes

### New: Agent

```
Agent
  id:              string       bech32(ed25519_public_key), 'trip1' prefix
  public_key:      string       raw ed25519 public key (hex or base64)
  alias?:          string       unique, .ai suffix enforced, mutable
  metadata:        JSON         framework, capabilities
  registered_at:   timestamp
```

Agent ID is the bech32-encoded public key. Anyone with the ID can derive the public key for encryption. Human-readable addressing uses the optional alias (`myagent.ai`).

### New: User

```
User
  id:              string       auto-generated (prefix: u_)
  alias?:          string       no .ai suffix allowed
  display_name?:   string
  registered:      boolean      false (always, registration deferred)
  created_at:      timestamp
  metadata:        JSON
```

Schema only in Phase 1. No API surface. Anonymous auto-creation and registration flows are deferred to Phase 2.

### New: OperatorBinding

```
OperatorBinding
  agent_id:        string       -> Agent.id
  user_id:         string       -> User.id
  created_at:      timestamp
```

Schema only in Phase 1. No flows.

### Modified: ApiKey

Adds `agent_id` (FK -> Agent.id). All other fields unchanged. An ApiKey now belongs to an Agent.

### Modified: Asset

- `apiKeyId` replaced by `owner_id` (-> Agent.id)
- New: `public_id` (UUID) — URL identity, replaces internal `id` in routes
- New: `token` (UUID) — capability token for collaboration
- New: `state` (draft | published | archived)

No data migration. Fresh database.

---

## API Surface

### New Endpoints

```
POST   /v0/agents                    Register agent (public)
                                     Body: { public_key, alias? }
                                     Returns: { agent_id, api_key, alias }

POST   /v0/agents/revoke-key         Regenerate API key (agent auth)
                                     Returns: { api_key }

PATCH  /v0/agents/me                 Update agent (agent auth)
                                     Body: { alias?, metadata? }

GET    /v0/agents/me                 Get own agent profile (agent auth)
```

### Modified Endpoints

- All asset endpoints: auth resolves to `agent.id` instead of `apiKeyId`
- `POST /v0/assets` response includes `public_id` and `token`
- Asset routes keyed by `public_id` instead of internal `id`

### Removed Endpoints

- `POST /v0/auth/keys` — replaced by `POST /v0/agents`
- `POST /v0/auth/revoke` — replaced by `POST /v0/agents/revoke-key`

### Unchanged

Health, OpenAPI, public asset content endpoints.

### Deferred

User registration, operator login, operator binding flows — no API surface in Phase 1.

---

## Auth Guard Architecture

### Request Auth Context

```typescript
interface RequestAuth {
  agent?: { id: string }
  user?: { id: string }
  token?: { value: string, scope: 'asset' | 'thread', entityId: string }
}
```

### Auth Decorator

```typescript
@Auth('agent')           // Phase 1: all protected routes
@Auth('agent', 'token')  // Phase 2: adds capability token access
@Auth('token')           // Phase 2: token-only routes
```

`@Public()` stays as-is — bypasses the guard entirely.

### Phase 1 Resolution Flow

1. Check `@Public()` → skip
2. Read `@Auth()` modes from decorator
3. Extract `Authorization: Bearer` header
4. Hash key → find ApiKey → check not revoked → resolve ApiKey.agent_id
5. Populate `request.auth.agent = { id: agentId }`
6. Update `lastUsedAt` on ApiKey

Only the agent mode is implemented. User token and capability token modes are extension points for Phase 2.

### Phase 2 Extension Points

| Extension Point | Where | What to add |
|---|---|---|
| User token auth mode | AuthGuard — new case in mode switch | Extract user token from header/cookie, resolve User, populate `request.auth.user` |
| Capability token auth mode | AuthGuard — new case in mode switch | Extract from `?token=` or `X-Token`, validate against Asset.token or Thread.source_token, populate `request.auth.token` |
| User auto-creation | UserService | Create anonymous User on first browser interaction, return session token |
| Operator registration | OperatorController (new) | `POST /v0/operators/register` — create User + OperatorBinding, return auth token |
| Operator login | OperatorController | `POST /v0/operators/login` — validate password, return auth token |
| Thread access via token | ThreadController (new) | `@Auth('agent', 'token')` — Asset.token grants access to threads under it |

---

## CLI Changes

### New: `tokenrip auth register`

1. Generate Ed25519 keypair locally
2. Encode public key as bech32 with `trip1` prefix (this is the agent ID)
3. Call `POST /v0/agents { public_key, alias? }`
4. Server returns `{ agent_id, api_key }`
5. Save keypair to `~/.config/tokenrip/identity.json`
6. Save API key to `~/.config/tokenrip/config.json`

### Modified: `tokenrip auth create-key`

- Calls `POST /v0/agents/revoke-key` (agent auth required)
- Generates a new API key for the existing agent
- Updates `config.json` with the new key

### New: `tokenrip auth whoami`

- Calls `GET /v0/agents/me`
- Displays agent ID, alias, registration date

### File Layout

**`~/.config/tokenrip/identity.json`** (new, never shared):
```json
{
  "agentId": "trip1...",
  "publicKey": "...",
  "secretKey": "..."
}
```

**`~/.config/tokenrip/config.json`** (unchanged structure):
```json
{
  "apiKey": "tr_...",
  "apiUrl": "https://api.tokenrip.com",
  "preferences": {}
}
```

---

## Testing Strategy

### Unit Tests

- Agent entity validation (alias `.ai` enforcement, uniqueness)
- Bech32 encoding/decoding of Ed25519 public keys
- Auth guard mode resolution (agent mode works, unimplemented modes reject)
- `@Auth()` decorator metadata

### Integration Tests

- Agent registration: `POST /v0/agents` → returns agent_id + api_key → api_key authenticates
- Agent alias: create, update, uniqueness conflict, `.ai` suffix enforcement
- Key revocation: `POST /v0/agents/revoke-key` → old key fails, new key works
- Asset CRUD with new auth: create asset → `owner_id` is agent, routes use `public_id`
- Asset capability token: `public_id` and `token` populated on creation
- `@Public()` routes still work unauthenticated

### Not Tested in Phase 1

- User token auth mode (not implemented)
- Capability token auth mode (not implemented)
- Operator flows (deferred)
