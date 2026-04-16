# Onboarding Flows

> Design rationale for progressive onboarding across operators and agents. Captures *why* decisions were made.

## Problem

Operators and agents can discover Tokenrip through multiple entry points — MCP OAuth, CLI installation, or receiving a shared asset link. Each path was disconnected, with no progressive onboarding. Users who received shared assets had no way to sign up. CLI users adding MCP had to create a new agent instead of linking their existing one. The long Ed25519-signed operator token was impossible to type on mobile devices.

## Design Decisions

### Identity Model: User as Account, Agents as Endpoints

One User can have one server-side Agent (MCP/browser) and multiple CLI Agents, all bound via OperatorBinding (many-to-many). The operator dashboard shows a unified view across all bound agents.

**Why?** The same person may use Claude Code (CLI agent) and Claude Cowork (MCP/server-side agent). These are different Ed25519 keypairs with different identities. Rather than forcing a migration, each context gets its own agent, all linked to the same account.

**Why server-side vs CLI agents?** MCP clients can't manage local keypairs — the server generates and stores the keypair. CLI clients generate keypairs locally. The distinction matters for auth flows but is transparent to the operator dashboard.

### Short Code Added Alongside Signed Link

`rip operator-link` now outputs both a signed URL (Ed25519, local, click to login) and a 6-digit server-generated code (for MCP auth and cross-device use). The signed link remains the primary frictionless operator login mechanism.

**Why add short codes?** The signed token is ~200 characters — great for clicking but impossible to type on mobile or paste from Telegram. The 6-digit code solves cross-device linking. Both mechanisms coexist.

**Why 6 digits?** ~1M possibilities with a 10-minute window and single-use semantics is sufficient. Rate limiting on the verify endpoint prevents brute force. Same security model as every 2FA and device-pairing flow.

### OAuth Page: Three Tabs

Register (default) | Log in | Link existing agent.

**Why a third tab?** CLI-only users going through MCP OAuth for the first time would otherwise have to either: (a) register a new account (creating a duplicate agent), or (b) run `operator-link` first and then use the Login tab. The third tab handles this in a single flow — enter the short code, create an account, get linked.

**Why not just two tabs with code support?** Separating the flows makes each tab's purpose clear. Users self-select the right path. Mixing code entry into the registration form would confuse first-time users.

### OAuth Login Creates Server Agent If Missing

When a CLI-only user logs in via OAuth, the system silently creates a server-side agent and binds it. The MCP client gets an API key for this new server-side agent.

**Why silently?** The user's intent is to connect their MCP client. The implementation detail of needing a server-side agent should be invisible.

### Share Page Progressive Onboarding

- **Read-only links**: Zero friction. Subtle "Powered by Tokenrip" badge in the corner.
- **Cap-token links**: Anonymous commenting works immediately. Non-blocking onboarding strip appears above the comment panel. Dismissable (localStorage). "Create an account" opens an inline signup panel.
- **Session-aware**: If logged in, check if the asset owner is a bound agent. If yes, show "View in dashboard" controls.

**Why not prompt on read-only pages?** Friction on read-only pages hurts the agent-first principle. The content is the value prop — let it speak for itself. The badge is discovery, not a push.

**Why an inline panel instead of redirect?** The user is viewing a shared asset. Redirecting them away loses context. The inline panel lets them sign up without leaving the page.

### Browser Registration Path

A standalone `POST /v0/auth/register` endpoint creates a server-side agent + user + binding atomically. This is the share-page signup path — lighter than OAuth (no PKCE/redirect), returns a session token directly.

**Why separate from OAuth register?** OAuth register participates in the PKCE flow with code challenges and redirect URIs. The share page signup is a direct browser-to-API call with no OAuth ceremony.

## Alternatives Considered

### Email-Based Re-Auth (Magic Links)
Tabled. Would eliminate the need for passwords, but requires email infrastructure we don't have. Password-based auth is the re-auth mechanism for now.

### Single Agent Per User (Migration on CLI Install)
Rejected. Different keypairs = different identities. You can't "migrate" an agent because the ID is derived from the public key. Keeping both is more honest and handles the multi-device case naturally.

### OAuth Register Only (No Browser Signup)
Rejected. Share page visitors are in a browser, not in an MCP client. Requiring them to go through OAuth with fake PKCE params would be a hack.

### Long Token as Fallback
Removed. The short code covers all use cases. The long token's only advantage (stateless/offline) doesn't matter for operator linking, which is inherently a server operation.

## New Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/v0/auth/link-code` | Agent API key | Generate 6-digit link code |
| POST | `/v0/auth/link-code/verify` | Public | Peek at link code (doesn't consume) |
| POST | `/v0/auth/link-code/bind` | User session | Bind agent to logged-in user's account |
| POST | `/v0/auth/link-code/register` | Public | Register + bind agent (new user) |
| POST | `/v0/auth/register` | Public | Browser registration (server-side agent + user + binding) |
| POST | `/oauth/link-agent` | Public | OAuth flow: link existing agent via short code |

## New Frontend Routes

| Path | Purpose |
|---|---|
| `/link` | Standalone page for entering short codes (outside OAuth context) |
