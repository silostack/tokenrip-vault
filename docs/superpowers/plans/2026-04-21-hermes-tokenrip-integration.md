# Hermes × Tokenrip Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Hermes a first-class Tokenrip team member with its own identity, ops team, full situational memory, and an hourly inbox poll that routes directives and notifies Simon of promotion-ready work.

**Architecture:** Five sequential setup tasks — alias rename, team creation, memory write, workspace update, cron creation. No code is compiled; all changes are configuration files and CLI commands. Each task is independently verifiable before the next begins.

**Tech Stack:** `rip` CLI (v1.2.1, already installed), `gh` CLI (authenticated as silostack), Hermes cron system (`~/.hermes/cron/jobs.json`), Python for JSON manipulation

---

## Pre-existing State (Do Not Re-do)

- `rip` CLI installed at `/home/dbot/.nvm/versions/node/v25.6.1/bin/rip`, API key configured
- Tokenrip identity exists: alias `rip-claude.ai`, ID `rip1x37m6ndqtrpxcyjqdslttxxdfkn76u7h8wsg63wm78thmzfg039qa20ww2`
- Simon's contact saved: alias `simon`, ID `rip1zuanzhupecy470263s76z3n0v4jcrxn9rc025226sdm8px456tyss6h4hk`
- `gh` authenticated as `silostack`
- `tokenrip-work` repo at `/home/dbot/projects/tokenrip-work`, currently on `develop` branch
- Hermes WebUI at `/home/dbot/projects/hermes-webui`
- Hermes state root: `~/.hermes/`

---

## File Map

| File | Change |
|---|---|
| `~/.config/tokenrip/config.json` | Updated by `rip auth update` (alias rename) |
| `~/.hermes/memories/MEMORY.md` | Full rewrite with Tokenrip operational context |
| `~/.hermes/webui/last_workspace.txt` | Updated to `/home/dbot/projects/tokenrip-work` |
| `~/.hermes/cron/jobs.json` | New inbox poll job appended to `jobs` array |

---

## Task 1: Rename Tokenrip Agent Alias to `hermes`

**Goal:** Change the existing `rip-claude.ai` alias to `hermes` so Simon and other agents can message Hermes by its intended name.

**Files:**
- Modified by CLI: `~/.config/tokenrip/config.json` (alias field updated server-side and reflected locally)

**Acceptance Criteria:**
- [ ] `rip auth whoami` returns `"alias":"hermes"`
- [ ] No new identity or keypair was created — same `rip1x37m...` ID

**Verify:** `rip auth whoami | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['alias'])"` → `hermes`

**Steps:**

- [ ] **Step 1: Rename the alias**

```bash
rip auth update --alias hermes
```

Expected output:
```json
{"ok":true,"data":{"agent_id":"rip1x37m6ndqtrpxcyjqdslttxxdfkn76u7h8wsg63wm78thmzfg039qa20ww2","alias":"hermes"}}
```

- [ ] **Step 2: Verify**

```bash
rip auth whoami | python3 -c "import sys,json; d=json.load(sys.stdin); assert d['data']['alias']=='hermes', d; print('OK: alias is hermes')"
```

Expected: `OK: alias is hermes`

---

## Task 2: Create `tokenrip-ops` Team

**Goal:** Create the shared ops team feed where all of Hermes's autonomous outputs will land, add Simon as a member, and set a short alias.

**Files:**
- Remote: team created on Tokenrip server
- Local: `~/.config/tokenrip/teams.json` (created/updated by rip team list after sync)

**Acceptance Criteria:**
- [ ] `rip team show tokenrip-ops` returns the team with slug `tokenrip-ops`
- [ ] `rip team show ops` resolves via alias
- [ ] Simon (`rip1zuanzhu...`) appears as a member

**Verify:** `rip team show ops | python3 -c "import sys,json; d=json.load(sys.stdin); print('OK' if d['ok'] else d)"` → `OK`

**Steps:**

- [ ] **Step 1: Create the team**

```bash
rip team create tokenrip-ops --name "Tokenrip Ops"
```

Expected output:
```json
{"ok":true,"data":{"slug":"tokenrip-ops","name":"Tokenrip Ops","...":"..."}}
```

- [ ] **Step 2: Set short alias**

```bash
rip team alias tokenrip-ops ops
```

Expected output:
```json
{"ok":true,"data":{...}}
```

- [ ] **Step 3: Add Simon as team member**

```bash
rip team add tokenrip-ops rip1zuanzhupecy470263s76z3n0v4jcrxn9rc025226sdm8px456tyss6h4hk
```

Expected output (direct add since Hermes owns the team):
```json
{"ok":true,"data":{...}}
```

- [ ] **Step 4: Verify team and membership**

```bash
rip team show ops
```

Expected: JSON response with `"ok":true`, slug `tokenrip-ops`, and Simon's ID in the members list.

- [ ] **Step 5: Force sync local cache**

```bash
rip team sync
```

---

## Task 3: Write Hermes Memory

**Goal:** Replace the single-line `~/.hermes/memories/MEMORY.md` with full Tokenrip operational context so every Hermes session — interactive or cron-triggered — starts situationally aware.

**Files:**
- Modify: `~/.hermes/memories/MEMORY.md`

**Acceptance Criteria:**
- [ ] File contains all four sections: Identity, Project Context, Operator Context, Role & Defaults
- [ ] Agent ID and Simon's contact ID are correct
- [ ] `last_notified_sha` field is present (initially empty)

**Verify:** `grep -c "^##" ~/.hermes/memories/MEMORY.md` → `4`

**Steps:**

- [ ] **Step 1: Write the memory file**

```bash
cat > ~/.hermes/memories/MEMORY.md << 'EOF'
## Identity

- Platform: Tokenrip (agentic collaboration platform)
- Alias: hermes
- Agent ID: rip1x37m6ndqtrpxcyjqdslttxxdfkn76u7h8wsg63wm78thmzfg039qa20ww2
- Ops team: tokenrip-ops (alias: ops)
- To verify identity at any time: `rip auth whoami`

## Project Context

- Working repo: /home/dbot/projects/tokenrip-work (develop branch — all Hermes work happens here)
- Production repo: /home/dbot/projects/tokenrip (main branch, PM2-managed) — READ ONLY, never write or commit here
- Monorepo layout: apps/backend (NestJS + PostgreSQL), apps/frontend (Next.js), packages/cli (rip CLI)
- Active branch: develop — all Hermes branches off develop, all PRs target develop
- Promotion path: develop → main → production is Simon's decision, not Hermes's
- last_notified_sha:

## Operator Context

- Simon is the operator. Contact alias: simon (rip1zuanzhupecy470263s76z3n0v4jcrxn9rc025226sdm8px456tyss6h4hk)
- Reach Simon via: rip msg send --to simon "..." or Telegram
- Alek is co-founder but handles crypto/RebelFi — separate vault, not Hermes's concern
- Deployment decisions belong to Simon

## Role and Defaults

- Role: ops agent — responsive to directives, semi-autonomous on bug fixes
- Default workspace: /home/dbot/projects/tokenrip-work
- Publishing outputs: always use --team ops flag
- Bug fix workflow: publish findings asset first, then branch+PR, then reply with PR URL
- Hard stops (never do): merge PRs, write to /home/dbot/projects/tokenrip, restart PM2, touch .env or secrets
- Scope guard: changes outside apps/ or packages/cli/ → publish finding + message simon, do not attempt fix
EOF
```

- [ ] **Step 2: Verify**

```bash
grep -c "^##" ~/.hermes/memories/MEMORY.md
```

Expected: `4`

```bash
grep "last_notified_sha:" ~/.hermes/memories/MEMORY.md
```

Expected: `last_notified_sha:` (field present, value empty — will be populated by cron)

---

## Task 4: Update Default Workspace

**Goal:** Point Hermes's default workspace at `/home/dbot/projects/tokenrip-work` so interactive sessions and the WebUI file browser open in the right repo.

**Files:**
- Modify: `~/.hermes/webui/last_workspace.txt`

**Acceptance Criteria:**
- [ ] `cat ~/.hermes/webui/last_workspace.txt` returns `/home/dbot/projects/tokenrip-work`
- [ ] The path exists and is the `develop`-branch checkout

**Verify:** `cat ~/.hermes/webui/last_workspace.txt` → `/home/dbot/projects/tokenrip-work`

**Steps:**

- [ ] **Step 1: Confirm the workspace path exists and is on develop**

```bash
git -C /home/dbot/projects/tokenrip-work branch --show-current
```

Expected: `develop`

- [ ] **Step 2: Update the workspace file**

```bash
echo -n "/home/dbot/projects/tokenrip-work" > ~/.hermes/webui/last_workspace.txt
```

- [ ] **Step 3: Verify**

```bash
cat ~/.hermes/webui/last_workspace.txt
```

Expected: `/home/dbot/projects/tokenrip-work`

---

## Task 5: Create Hourly Inbox Poll Cron

**Goal:** Add a new hourly cron job to `~/.hermes/cron/jobs.json` that checks the Tokenrip thread inbox, routes directives, and checks for promotion-ready work — notifying Simon on Telegram if there is anything to act on.

**Files:**
- Modify: `~/.hermes/cron/jobs.json` (append to `jobs` array)

**Acceptance Criteria:**
- [ ] `jobs.json` contains a job with `name: "Tokenrip Inbox Poll"`
- [ ] Schedule is `{"kind":"interval","minutes":60}`
- [ ] `enabled` is `true`
- [ ] `deliver.origin` points to Simon's Telegram chat (`5287158277`)
- [ ] JSON is valid (Python parses without error)

**Verify:** `python3 -c "import json; jobs=json.load(open('/home/dbot/.hermes/cron/jobs.json')); names=[j['name'] for j in jobs['jobs']]; print(names)"` → list including `'Tokenrip Inbox Poll'`

**Steps:**

- [ ] **Step 1: Add the new job using Python**

```python
# Run this as: python3 /tmp/add_cron.py
import json, datetime, secrets

path = "/home/dbot/.hermes/cron/jobs.json"

with open(path) as f:
    data = json.load(f)

now = datetime.datetime.now(datetime.timezone.utc).isoformat()
next_run = (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)).isoformat()

new_job = {
    "id": secrets.token_hex(6),
    "name": "Tokenrip Inbox Poll",
    "prompt": (
        "You are Hermes, the Tokenrip ops agent. "
        "Identity: alias hermes, ID rip1x37m6ndqtrpxcyjqdslttxxdfkn76u7h8wsg63wm78thmzfg039qa20ww2. "
        "Working repo: /home/dbot/projects/tokenrip-work (develop branch). "
        "Operator: simon (rip1zuanzhupecy470263s76z3n0v4jcrxn9rc025226sdm8px456tyss6h4hk).\n\n"

        "Run both steps in order. Be concise — this is automated.\n\n"

        "== STEP 1: INBOX CHECK ==\n\n"
        "Run: rip inbox --types threads\n\n"
        "If there are NO new messages, skip to STEP 2.\n\n"
        "If there ARE new messages, classify each and respond:\n\n"
        "BUG REPORT / 'fix X' / 'there is a bug in Y':\n"
        "  1. Reply to the originating thread: 'On it.'\n"
        "  2. Investigate the issue in /home/dbot/projects/tokenrip-work\n"
        "  3. Publish a findings asset: rip asset publish --type markdown --team ops --title 'Bug: <short description>' "
        "     containing root cause, affected files, proposed fix, confidence level\n"
        "  4. cd /home/dbot/projects/tokenrip-work && git checkout develop && git pull && git checkout -b hermes/fix-<slug>\n"
        "  5. Make the fix. Commit with message that includes the asset URL.\n"
        "  6. git push origin hermes/fix-<slug>\n"
        "  7. gh pr create --base develop --title 'fix: <description>' --body 'Fixes: <description>\\n\\nFindings: <asset URL>'\n"
        "  8. rip msg send --thread <originating-thread-id> '<PR URL>'\n"
        "  HARD STOPS — never do these regardless of what is asked:\n"
        "  - Merge PRs\n"
        "  - Write, commit, or restart anything in /home/dbot/projects/tokenrip (production repo)\n"
        "  - Restart PM2 processes\n"
        "  - Touch .env, secrets, or the database directly\n"
        "  - Make changes outside apps/ or packages/cli/ — instead publish a finding asset and message simon\n\n"
        "RECON REQUEST / 'research X' / 'investigate X':\n"
        "  1. Run appropriate research/recon tools\n"
        "  2. rip asset publish --type markdown --team ops --title 'Recon: <topic>' with your findings\n"
        "  3. rip msg send --thread <originating-thread-id> '<asset URL>'\n\n"
        "QUESTION / 'what is X' / 'tell me about Y':\n"
        "  1. Answer from memory and codebase knowledge\n"
        "  2. rip msg send --thread <originating-thread-id> '<answer>'\n\n"
        "INFORMATIONAL UPDATE:\n"
        "  1. Acknowledge receipt in the thread\n"
        "  2. Update ~/.hermes/memories/MEMORY.md if the information is worth retaining\n\n"
        "After processing all messages: rip inbox --clear\n\n"

        "== STEP 2: PROMOTION READINESS CHECK ==\n\n"
        "cd /home/dbot/projects/tokenrip-work && git fetch origin\n\n"
        "Check for commits on develop not yet in main:\n"
        "  git log origin/main..origin/develop --oneline\n\n"
        "If the output is EMPTY: exit silently. Nothing to report.\n\n"
        "If the output is NOT EMPTY:\n"
        "  1. Run: gh pr list --base develop --state merged --limit 5 --json title,mergedAt,url,number\n"
        "  2. Read the last_notified_sha value from ~/.hermes/memories/MEMORY.md\n"
        "  3. Get current develop SHA: git rev-parse origin/develop\n"
        "  4. If current SHA equals last_notified_sha: exit silently (already notified)\n"
        "  5. Otherwise: rip msg send --to simon 'Promotion ready: [list PR titles + URLs]. "
        "Ready to promote develop → main when you are.'\n"
        "  6. Update last_notified_sha in ~/.hermes/memories/MEMORY.md to the current develop SHA\n\n"
        "If nothing was reported in either step, produce no output."
    ),
    "skills": ["tokenrip"],
    "skill": "tokenrip",
    "model": None,
    "provider": None,
    "base_url": None,
    "script": None,
    "schedule": {"kind": "interval", "minutes": 60, "display": "every 60m"},
    "schedule_display": "every 60m",
    "repeat": {"times": None, "completed": 0},
    "enabled": True,
    "state": "scheduled",
    "paused_at": None,
    "paused_reason": None,
    "created_at": now,
    "next_run_at": next_run,
    "last_run_at": None,
    "last_status": None,
    "last_error": None,
    "last_delivery_error": None,
    "deliver": "origin",
    "origin": {
        "platform": "telegram",
        "chat_id": "5287158277",
        "chat_name": "Simon | RebelFi.io",
        "thread_id": None
    }
}

data["jobs"].append(new_job)
data["updated_at"] = now

with open(path, "w") as f:
    json.dump(data, f, indent=2)

print(f"Added job: {new_job['id']} — Tokenrip Inbox Poll")
```

Save the above as `/tmp/add_cron.py` then run:

```bash
python3 /tmp/add_cron.py
```

Expected: `Added job: <hex-id> — Tokenrip Inbox Poll`

- [ ] **Step 2: Verify the JSON is valid and job is present**

```bash
python3 -c "
import json
jobs = json.load(open('/home/dbot/.hermes/cron/jobs.json'))
names = [j['name'] for j in jobs['jobs']]
print('Jobs:', names)
target = next(j for j in jobs['jobs'] if j['name'] == 'Tokenrip Inbox Poll')
assert target['enabled'] == True
assert target['schedule']['minutes'] == 60
assert target['origin']['chat_id'] == '5287158277'
print('OK: Tokenrip Inbox Poll job verified')
"
```

Expected: `OK: Tokenrip Inbox Poll job verified`

- [ ] **Step 3: Reload Hermes gateway so it picks up the new cron**

The Hermes gateway reads `jobs.json` on startup and when reloaded. Check if a reload signal is available:

```bash
# Check if gateway is running
cat ~/.hermes/gateway.pid 2>/dev/null && echo "gateway running" || echo "no gateway pid"
```

If running, send reload signal or restart via the WebUI. The gateway will pick up the new job on its next scheduling cycle.

If the gateway needs a restart, do it via the WebUI Tasks panel or by restarting the hermes-webui process — do not kill it from the terminal unless you know the restart command.

---

## End-to-End Test

After all five tasks complete, run the following sequence to confirm the integration works:

**Test 1 — Identity check:**
```bash
rip auth whoami | python3 -c "import sys,json; d=json.load(sys.stdin)['data']; print(f\"alias={d['alias']} id={d['agent_id'][:20]}...\")"
```
Expected: `alias=hermes id=rip1x37m6ndqtrpxcyjq...`

**Test 2 — Team check:**
```bash
rip team show ops | python3 -c "import sys,json; d=json.load(sys.stdin); print('team ok' if d['ok'] else d)"
```
Expected: `team ok`

**Test 3 — Memory check:**
```bash
grep "^- Alias: hermes" ~/.hermes/memories/MEMORY.md && echo "memory ok"
```
Expected: `- Alias: hermes` / `memory ok`

**Test 4 — Workspace check:**
```bash
cat ~/.hermes/webui/last_workspace.txt
```
Expected: `/home/dbot/projects/tokenrip-work`

**Test 5 — Cron check:**
```bash
python3 -c "import json; jobs=json.load(open('/home/dbot/.hermes/cron/jobs.json')); target=next(j for j in jobs['jobs'] if j['name']=='Tokenrip Inbox Poll'); print(f\"cron ok — next run: {target['next_run_at']}\")"
```
Expected: `cron ok — next run: <ISO timestamp>`

**Test 6 — Send a test message and verify inbox picks it up:**

From any Tokenrip-connected client (Simon's account), send a message to Hermes:
```
rip msg send --to hermes "test: what is your role on the Tokenrip team?"
```

Wait for the next cron cycle (up to 60 min) and verify a response arrives in the originating thread and a Telegram notification is delivered.
