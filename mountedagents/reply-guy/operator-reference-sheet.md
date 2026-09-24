# Reply Guy — Operator Reference Sheet

**Agent:** `reply-guy` · team-owned `@tokenrip` · built with Moa, 2026-06-12
**Mount:** `59129182-e2b9-49a3-8d66-28628c8b44e1` (deployed for **@silostack**)

An engagement agent for an X/Twitter brand presence. It finds posts worth replying to, only drafts where it has a real opinion (grounded in a semantic opinion workspace), queues each draft for your approval, and posts the ones you approve — learning your voice from your feedback over time.

---

## What was built

| Artifact | Alias | Role |
|---|---|---|
| Soul | `reply-guy-soul` | Identity, stance, refusals |
| Frameworks | `reply-guy-frameworks` | Reply-worthiness gates, craft rules, brand-safety, feedback synthesis |
| Scout playbook | `reply-guy-scout` | Default command |
| Post playbook | `reply-guy-post` | Publish command |
| Consolidate playbook | `reply-guy-consolidate` | Learning command |
| Voice (memory artifact) | `reply-guy-voice-seed` | Living voice profile, team-scoped |
| Mount starter | `reply-guy-mount-starter` | Config scaffold |

**Memory tables:** `reply-guy-posts` (team, the reply queue) · `consolidation-runs` (operator-private, learning log).
**Workspace:** auto-provisioned per mount — the opinion corpus replies ground against.

---

## How to invoke

Universal bootloader (install once per harness):
```
curl -fsSL "https://api.tokenrip.com/commands/tokenrip-bootloader.md" > .claude/commands/tokenrip-bootloader.md
```
Then run the three commands (the harness schedules cadence; there's no built-in cron):
```
/tokenrip-bootloader reply-guy             # scout  (default) — find + draft + queue
/tokenrip-bootloader reply-guy post        # post   — publish approved replies
/tokenrip-bootloader reply-guy consolidate # consolidate — absorb feedback (~weekly)
```

> **Runs in a logged-in Chrome, not headless.** `scout` and `post` drive your real browser session, so @silostack must be logged into Chrome at run time. This is the cost of the browser-for-both choice; the upgrade path to headless/autonomous is the twitterapi.io REST API, and all browser calls are isolated in the scout/post playbooks so that swap won't touch your data.

---

## How it works (session lifecycle)

```
 scout:   sources (search/home/targets) ──▶ browser scrape ──▶ for each post:
          dedup ▶ brand-safety ▶ Gate-1 (grounded opinion? semantic search the
          workspace) ▶ Gate-2 (worth it?) ──▶ draft reply ──▶ row {status: scouted}
                                                                      │
 review:  you, in the Review Queue surface (or `rip agent table`):    ▼
          read ▶ edit reply ▶ Approve (status: approved) ▶ leave feedback_note
                                                                      │
 post:    rows where status=approved ──▶ browser reply ──▶ status: posted   ▼
          (rate-limit / not-logged-in ⇒ STOP + back off, row stays approved)
                                                                      │
 consolidate: feedback_notes ──▶ rewrite voice + fix workspace opinions ▼
              ──▶ future drafts need fewer edits ──▶ eventually drop the gate
```

**First scout run self-seeds** the opinion workspace from the mount-context "Opinions To Seed" — so it's productive immediately.

---

## The approval gate

`status` is the gate. With `auto_approve: off` (current), `post` only publishes rows you set to `approved`. Once drafts reliably need no edits, set `auto_approve: on` in mount context (`rip agent mount-context 59129182… --edit`) and `post` will publish scouted drafts directly. That's how you graduate to autonomy — earn it, don't default to it.

---

## Reviewing the queue

**Review Queue Surface** (dashboard): `https://tokenrip.com/x/b69398d9-6477-4005-9800-65fcd5f95b82`
Inbox-default view, inline reply editing with a 280-char counter, Approve/Skip, and a feedback-note field. *(Draft — pending one validation fix at handoff; see the build notes.)*

Or via CLI:
```
rip agent table rows  59129182-e2b9-49a3-8d66-28628c8b44e1 reply-guy-posts --filter status:scouted
rip agent table patch 59129182-e2b9-49a3-8d66-28628c8b44e1 reply-guy-posts <row-id> \
    --set generated_reply="<your edit>" --set status=approved
rip agent table patch 59129182-e2b9-49a3-8d66-28628c8b44e1 reply-guy-posts <row-id> \
    --set feedback_note="too stiff — more contractions"
```

---

## Two things to enable

1. **Keep @silostack logged into Chrome** in the harness that runs scout/post.
2. **Semantic search** (sharper Gate-1 grounding): a platform admin grants the tier at `/admin/entitlements`, then toggle **Semantic search → On** on the agent's workspace. Until then, grounding runs on full-text + the loaded working set — works, just less precise.

---

## How to iterate

- **Tune behavior:** re-run Moa on the package in `mountedagents/reply-guy/`, edit a brain artifact, `rip artifact update <uuid> <file>` — the live agent picks up the new version on next load.
- **Tune this deployment:** `rip agent mount-context 59129182… --edit` (handle, sources, opinions, limits, `auto_approve`).
- **Tune voice directly:** it's learned by `consolidate` from your feedback notes — the more you annotate, the faster it converges.
