# Reddit Demand-Scout — Operator Reference Sheet

Team-owned agent (`@tokenrip`) that reads Reddit for real AI-agent demand signal — building/deploying/using pain, what people run agents for, and especially **workplace usage tied to specific industry verticals** — and records the worthwhile, *engageable* posts to a shared table. Optimizes for **conversations the team can join**, not link-hoarding.

---

## 1. What was created

| Artifact | Alias | Role | Link |
|---|---|---|---|
| Soul | `reddit-demand-scout-soul` | identity, stance, refusals, feedback ethos | https://tokenrip.com/s/761964cc-2f2b-4081-b2b1-eb7ce40c8160 |
| Frameworks | `reddit-demand-scout-frameworks` | rubric, engageable test, watchlist, **Playwright scraper**, feedback rubric | https://tokenrip.com/s/88927fd3-8be2-4ff9-b1c1-54b045700b5b |
| Scan playbook | `reddit-demand-scout-scan` | default command flow | https://tokenrip.com/s/c3a4aab2-ce74-430f-b947-39575e49af9f |
| Consolidate playbook | `reddit-demand-scout-consolidate` | synthesis + learning flow | https://tokenrip.com/s/41a16019-2af2-4fc9-ab6a-940a2700082b |
| Mount context (starter) | `reddit-demand-scout-mount-starter` | per-deployment config scaffold | https://tokenrip.com/s/627ff21e-c33a-48d0-b735-6ed4886c4836 |
| Demand-landscape (seed) | `demand-landscape-seed` | synthesis scaffold | https://tokenrip.com/s/23d6ac42-8b4d-45ec-8258-c7a77875931a |
| Scout-learnings (seed) | `scout-learnings-seed` | feedback-rules scaffold | https://tokenrip.com/s/3e65b403-b3cd-470d-954f-6ca5227fd030 |

- **Agent slug:** `reddit-demand-scout` (owner: team `@tokenrip`)
- **Mount id:** `9e43ae75-c361-45a7-8281-511644b85249` · **Workspace id:** `ead0a48b-8ee4-4d4d-b249-727c6b023e40`
- **Commands:** `scan` (default), `consolidate`

## 2. How to invoke

Universal bootloader (every agent gets it — no branded command on this one):
```
# one-time per machine:
curl -fsSL "https://api.tokenrip.com/commands/tokenrip-bootloader.md" > .claude/commands/tokenrip-bootloader.md
# then:
/tokenrip-bootloader reddit-demand-scout                 # runs the default 'scan'
/tokenrip-bootloader reddit-demand-scout consolidate     # weekly synthesis + learning
```

## 3. How it works (session lifecycle)

**scan:** load brain + mount context + `scout-learnings` + dedup set → run the headed Playwright scraper over the watchlist → judge each post (2-gate rubric + learnings overlay) → record new interesting posts to `reddit-signals` → capture recurring vertical/pain observations to the workspace → report an engageable shortlist → end.

**consolidate:** read rated rows + workspace notes → **learn** (distill `good`/`bad` feedback into `scout-learnings`) → promote workspace notes (`min-backlinks-2`) → rewrite the `demand-landscape` synthesis → log a `consolidation-runs` row → end.

## 4. Data flow

```
/tokenrip-bootloader reddit-demand-scout
      │
      ▼
  agent load ── brain (soul+frameworks) + scan playbook + mount-context + scout-learnings
      │
      ▼
  Playwright (headed, logged-in Chrome profile)  ──►  old.reddit.com/r/<sub>/new  (residential IP, paced)
      │  structured posts {title,url,author,comments,score,ts}
      ▼
  JUDGE  (2-gate rubric  ⊕  scout-learnings overlay)
      │  keepers only (noise discarded)
      ▼
  reddit-signals  (TEAM table — dedup on post_url, engageable flag, feedback cols)
      │
      │   ── operator rates rows (good/bad + note) ──┐
      ▼                                              ▼
  workspace notes (themes) ───► consolidate ───► scout-learnings (TEAM)  ──┐
                                    │                                      │
                                    ▼                             (read at next scan's judge)
                              demand-landscape (TEAM synthesis)
```

## 5. The feedback loop (your ask)

Rate any signal row; the next scan learns from it.
```
rip agent table rows  9e43ae75-c361-45a7-8281-511644b85249 reddit-signals      # find a row id
rip agent table patch 9e43ae75-c361-45a7-8281-511644b85249 reddit-signals <row-id> \
  --data '{"feedback_rating":"bad","feedback_note":"vendor launch in disguise — no demand signal"}'
```
- `good` + note → a "Prioritize" rule in `scout-learnings`.
- `bad` + note → a "Stop Flagging" rule.
- Rules apply on the **next** scan. `consolidate` is what distills ratings into rules.

## 6. Fetch setup (already done, FYI)

- Persistent Chrome profile at `~/.config/tokenrip/reddit-demand-scout`, **logged into Reddit** (session persists).
- Scraper: `playwright-core` + local Chrome (`channel:'chrome'`), `old.reddit.com` listings, headed, paced ~7s, 60s backoff on 403. The canonical script lives in the `frameworks` artifact.
- To widen coverage, edit the watchlist in the mount context (below). Expect longer runtime, not a higher request rate.

## 7. Dashboard & data access

- Mount: `/operator/agents/9e43ae75-c361-45a7-8281-511644b85249`
- Signals table: dashboard, or `rip agent table rows 9e43ae75-… reddit-signals`
- Mount context (watchlist/queries/verticals/engageable bar): `rip agent mount-context 9e43ae75-… --edit`

## 8. How to update

- **Tune what it scans / targets:** edit the mount context (no republish).
- **Change behavior (rubric, flow):** edit the brain artifact, `rip artifact update <id> <file>`, then `rip agent publish manifest.json --team tokenrip`.
- **Iterate with Moa:** `/tokenrip-bootloader moa` → "iterate reddit-demand-scout".

## 9. Known caveats

- **`post_url` isn't clickable in the dashboard.** Memory-table columns only support `text`/`enum`/`number`/`boolean`/`date` — there's no `url` type, so the URL renders as plain text. Platform gap (a `url` column type, or auto-linkifying text URLs, would fix it). Copy-paste for now.
- **Not autonomous.** Headed + logged-in fetch needs your browser session, so it's run-when-you-sit-down. The Reddit API is the upgrade path for cron-able fetch; the brain prefers a stored credential automatically if one ever exists.
- **Listings only.** Reddit `/search` and `.json` are Cloudflare-blocked; discovery is via per-subreddit `/new`.
