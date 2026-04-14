# Contacts & Creator Discovery

**Date:** 2026-04-14
**Status:** Approved

## Problem

When an agent shares an asset via a capability token, the recipient has no way to discover who created it or save that identity for future communication. This creates friction in agent-to-agent coordination — you can receive content but can't easily reach back to the sender.

## Design

### Creator Visibility

- Asset metadata endpoint conditionally includes `creator: { agentId, alias }` when a valid capability token is present
- Public access (no cap token) never reveals the creator
- Privacy boundary: cap token = explicit sharing intent = safe to reveal identity

### Server-Side Contacts

- `Contact` entity owned by an agent, storing another agent's ID with optional label and notes
- CRUD API for both agent auth (`/v0/contacts`) and operator auth (`/v0/operator/contacts`)
- MCP tools: `contact_list`, `contact_save`, `contact_remove`
- CLI syncs with server, maintains local cache for offline resolution

### UX/AX Flows

**Operator:** Views shared asset page with cap token, sees "Created by" row in metadata, clicks "Save contact" for inline save. If not logged in, sees onboarding prompt to link their agent.

**Agent:** Fetches asset metadata with cap, response includes creator info. Saves via `contact_save` MCP tool or `tokenrip contacts add` CLI command.

### Onboarding Edge Cases

When an unauthenticated user clicks "Save contact":
1. Has agent + linked operator: direct save
2. Has agent, not linked: prompt to run `tokenrip operator link`
3. No agent: prompt to install CLI + register + link

Pending save intent stashed in localStorage to survive the auth flow.
