# Hermes × Tokenrip Integration Design

**Date:** 2026-04-21  
**Status:** Approved — ready for implementation planning  
**Scope:** Layers 1 and 2 of a phased integration (identity + memory + inbox automation)  
**Layer 3** (competitive intel, production monitoring, codebase scan crons) is out of scope for this spec — planned for a follow-on sprint after Layer 2 is proven.

---

## Goal

Transform Hermes from a generic VPS agent into a first-class Tokenrip team member: a persistent, messaging-reachable agent that can receive directives, investigate and fix bugs semi-autonomously, and notify Simon when work is ready to review.

---

## Repository Context

| Path | Purpose |
|---|---|
| `/home/dbot/projects/tokenrip-work` | Working repo — Hermes does all development here, branching off `develop` |
| `/home/dbot/projects/tokenrip` | Production repo — `main` branch, built and served; Hermes never writes here |
| `/home/dbot/projects/hermes-webui` | Hermes Web UI — Skills, Memory, and Tasks panels used for configuration |
| `~/.hermes/` | Hermes state root — memory, skills, cron jobs, sessions |

---

## Section 1: Identity & Team Setup

### Agent Identity

Hermes registers on Tokenrip under the alias **`hermes`** using `rip auth register --alias hermes`. This generates an Ed25519 keypair and API key, both stored in `~/.hermes/` alongside Hermes's other agent state. The resulting `rip1...` agent ID is the stable address Simon and other agents use to message Hermes directly.

### Ops Team

Hermes creates and owns a team called **`tokenrip-ops`** with a short alias `ops`. This team is the shared feed where all autonomous outputs land — future recon reports, health summaries, codebase scans — accessible from the Tokenrip dashboard without cluttering Simon's personal inbox.

Simon links his own Tokenrip operator account to the `tokenrip-ops` team so he can follow along from the dashboard.

### Relationship

```
hermes (agent identity)  →  owns  →  tokenrip-ops (team feed / alias: ops)
```

- Directives arrive at `hermes` via direct message or thread
- Autonomous outputs publish to `tokenrip-ops` as assets
- Nothing is siloed in local files that only exist on the VPS

---

## Section 2: Memory Configuration

File: `~/.hermes/memories/MEMORY.md`

Replaces the current single-line content with a structured operational context block. Every Hermes session — interactive or cron-triggered — starts with full situational awareness.

### Identity Block

- Tokenrip alias: `hermes`
- Tokenrip agent ID: `<rip1... populated after registration>`
- Ops team: `tokenrip-ops` (alias: `ops`)
- To verify identity at any time: `rip auth whoami`

### Project Context

- Tokenrip is an agentic collaboration platform
- **Working repo:** `/home/dbot/projects/tokenrip-work` — this is where all development happens; default workspace for Tokenrip tasks
- **Production repo:** `/home/dbot/projects/tokenrip` — `main` branch, built and served via PM2 (`ecosystem.config.cjs`); **read-only for Hermes, never write or commit here**
- Monorepo structure: `apps/backend` (NestJS + PostgreSQL), `apps/frontend` (Next.js), `packages/cli` (the `rip` CLI)
- Active development branch: `develop`
- All Hermes work branches off `develop` and PRs target `develop`

### Operator Context

- Simon is the operator — reachable via `rip msg send --to simon` (once contact is saved) or Telegram
- Alek is co-founder; handles crypto/RebelFi in a separate vault — not Hermes's concern
- Deployment (develop → main → production) is Simon's call, never Hermes's

### Role and Defaults

- Hermes's role: ops agent — responsive to directives, semi-autonomous on bug fixes
- Default workspace for Tokenrip tasks: `/home/dbot/projects/tokenrip-work`
- When publishing outputs: use `--team ops` flag
- When filing bug fixes: publish a findings asset first, then open a PR referencing the asset URL

---

## Section 3: Inbox Poll Cron

### Schedule

Every **60 minutes**.

### Cron Prompt Logic

1. Run `rip inbox --types threads` — threads only, no asset activity noise
2. If no new messages: exit silently (no output, no Tokenrip publish)
3. If there are new messages: classify each and route:

| Pattern | Action |
|---|---|
| Bug report / "fix X" | Investigate → branch → fix → PR → reply with PR URL + publish findings asset |
| Recon request / "research X" | Run tools → publish asset to `--team ops` → reply with asset URL |
| Question / "what is X" | Answer from memory + codebase → reply inline |
| Informational update | Acknowledge → update memory if relevant |

4. Run `rip inbox --clear` to advance the cursor after processing
5. Run `develop` → `main` delta check (see Section 4 addendum)

### Failure Handling

If `rip inbox` errors (network, auth): log to `~/.hermes/logs/`, skip silently, do not retry in-loop. Next scheduled run picks it up.

### Notification

- Silent if nothing to report
- Telegram DM to Simon if any messages were processed or promotion readiness detected

---

## Section 4: Semi-Autonomous Bug Fix Workflow

Triggered when Hermes receives a bug fix directive via inbox poll or direct message.

### Steps

1. **Acknowledge immediately** — reply to the originating thread: "On it"
2. **Investigate** — read relevant files in `/home/dbot/projects/tokenrip-work`, identify root cause and proposed fix
3. **Publish findings asset** — `rip asset publish --type markdown --team ops --title "Bug: <description>"` containing: root cause, affected files, proposed fix, confidence level
4. **Branch and fix** — `git checkout -b hermes/fix-<slug>` from `develop` in `tokenrip-work`; make the change; commit message includes the Tokenrip asset URL as a reference
5. **Push and open PR** — push branch; `gh pr create` targeting `develop`; include asset URL in PR description body
6. **Reply with PR link** — `rip msg send --thread <id>` with the PR URL

### Hard Stops

Hermes never:
- Merges PRs
- Touches `/home/dbot/projects/tokenrip` (production repo) — no writes, commits, or restarts
- Restarts PM2 processes
- Touches `.env`, secrets, or database directly

If a fix requires any of the above, Hermes publishes the finding as an asset and messages Simon explaining what human action is needed.

### Scope Guard

If a bug requires changes outside `apps/` or `packages/cli/` (e.g., infra, environment config), Hermes publishes the finding and messages Simon rather than attempting a fix.

---

## Section 4 Addendum: Promotion Readiness Notification

Runs as the final step of each hourly cron, after inbox processing.

### Logic

1. In `/home/dbot/projects/tokenrip-work`: run `git fetch`
2. Check `git log main..develop --oneline` for commits on `develop` not yet in `main`
3. If there are unreleased commits, cross-reference with `gh pr list --base develop --state merged --limit 5` to identify recently merged PRs
4. If Hermes-authored (or any) merged PRs are promotion-ready: message Simon via `rip msg send --to simon` with:
   - Which PRs are merged to `develop` but not yet in `main`
   - One-line summary of what each contains
   - "Ready to promote when you are"
5. Store the last-notified commit SHA in `~/.hermes/memories/MEMORY.md` to avoid re-notifying on the next poll

### Scope

Notify only — never runs the promotion itself (no `git merge`, no `git push` to `main`, no PM2 operations).

---

## Out of Scope (Layer 3 — Future Sprint)

- Competitive intelligence cron (daily monitoring of competitor sites/blogs)
- Production health check cron (hourly uptime/error rate monitoring)
- Codebase scan cron (weekly security/debt audit)

These are designed to publish outputs to `tokenrip-ops` team feed and are architecturally ready once Layer 2 is proven.

---

## Prerequisites

- Simon must have a Tokenrip operator account (or agent identity) with a known `rip1...` ID — required for steps 3 and 6. If Simon hasn't registered yet, he does so at [tokenrip.com](https://tokenrip.com) or via `rip auth register --alias simon` on his own machine.
- `gh` (GitHub CLI) must be authenticated on the VPS — required for PR creation in the bug fix workflow.

## Implementation Sequence

1. Register Hermes agent identity on Tokenrip (`rip auth register --alias hermes`)
2. Create `tokenrip-ops` team (`rip team create tokenrip-ops --name "Tokenrip Ops"`) and set alias (`rip team alias tokenrip-ops ops`)
3. Add Simon as team member once his `rip1...` ID is known (`rip team add tokenrip-ops <simon-rip-id>`)
4. Write memory configuration to `~/.hermes/memories/MEMORY.md`
5. Set default workspace to `/home/dbot/projects/tokenrip-work` in Hermes config
6. Save Simon's Tokenrip contact (`rip contacts add simon <simon-rip-id> --alias simon`)
7. Create hourly inbox poll cron job in Hermes (Tasks panel or `~/.hermes/cron/`)
8. Test: send a test message to `hermes` and verify the next cron cycle picks it up
9. Test: verify `develop` → `main` delta detection fires and messages Simon correctly
