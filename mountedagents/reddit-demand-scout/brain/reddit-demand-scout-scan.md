<artifact role="flow" alias="reddit-demand-scout-scan">
# Reddit Demand-Scout — Scan Playbook (default)

This is the monitor run. You fetch the watchlist, judge each post against the rubric in `reddit-demand-scout-frameworks`, and record new, interesting posts to the `reddit-signals` table. You also capture recurring vertical/pain observations to the workspace for later consolidation.

Work in phases. Do not skip the load phase — it is what prevents duplicate rows and keeps the scan honest.

## Phase 1 — Load State

1. Read the `<workspace slug="…">` block in your load envelope. Note the slug; you will pass it to every `workspace_*` tool.
2. Read the mount context. It is authoritative for the **watchlist** (subreddits), **search queries**, **current target verticals/ICPs**, and **what counts as engageable right now**. If the mount context is empty, fall back to the default watchlist and vertical taxonomy in `reddit-demand-scout-frameworks`.
3. **Read the `scout-learnings` memory artifact.** This is the operator's distilled feedback — what to stop flagging and what to prioritize. Apply it as an overlay on the rubric during Phase 3. It is how your judgment improves over time; treat it as binding guidance, second only to the mount context.
4. Build your **dedup set**: read recent `reddit-signals` rows (the `post_url` column). Any post already in the table is a duplicate — you will skip it in Phase 3. `post_url` is the table's uniqueKey, so a re-record would be rejected anyway; checking first keeps the run clean and lets you report "N new vs M already-seen."

## Phase 2 — Fetch (headed, logged-in Playwright scrape)

Reddit's API host and `.json` endpoints are Cloudflare-blocked from automated egress, and harness web-fetch / MCP browser tools block reddit.com. The working path is a **real local Chrome driven by Playwright**, scraping `old.reddit.com` listings from a **logged-in** profile. A logged-in real account plus headed Chrome keeps Cloudflare's bot-score low; pacing keeps it there. Never fabricate posts — only judge posts the scrape actually returned.

**Preconditions (check, guide once if missing):**
- `node` available, and `playwright-core` resolvable (`npm ls playwright-core` in the scrape dir; if missing, `npm i playwright-core` there).
- Local Chrome present (`/Applications/Google Chrome.app` on macOS) — Playwright uses `channel: 'chrome'`.
- A persistent profile dir, default `~/.config/tokenrip/reddit-pw-profile`, **logged into Reddit**. The scraper detects login state; if logged out, it opens `old.reddit.com/login` headed and waits for the operator to log in once, then persists the session for all future runs.

**Run the scraper:** write the canonical scraper from `reddit-demand-scout-frameworks` ("Playwright Scraper") to a temp file and run it with the watchlist as args:
```
node /tmp/reddit-scrape.cjs '{"subreddits":["AI_Agents","aiagents", ...],"perSub":25,"headless":false}'
```
It launches headed Chrome on the persistent profile, paces a random 3–5s between subreddits, retries once after 60s on a 403 rate-limit (skips a 404 dead/private sub immediately), then reports rather than hammering. It prints `{"count":N,"posts":[{subreddit,title,url,author,comments,score,ts,domain}, ...]}`.

**Judging from listings:** title + subreddit + comment count is usually enough to classify and screen. For a high-promise post whose title is ambiguous, you MAY deep-fetch its body with a **single paced request** (the scraper's `--post <url>` mode) — use sparingly to respect rate limits. Do not deep-fetch every post.

**On a hard block** (scraper reports all subreddits 403 even logged-in + paced): report the block verbatim, do not loop. As an emergency-only degradation, the operator may paste a few post URLs+titles+snippets for you to judge — but this is a fallback, not a mode. Then proceed to Phase 3 with whatever posts you have (possibly none).

## Phase 3 — Judge

For each fetched post, in order:

1. **Skip if `post_url` is in the dedup set.** Count it as already-seen; do not re-judge.
2. Apply the **Relevance Rubric** in `reddit-demand-scout-frameworks`, **overlaid with `scout-learnings`** (Phase 1). If a learning says to stop flagging this pattern, discard it; if a learning says to prioritize this pattern, weight it up. Decide: is this signal at all? If it fails the bar (marketing, demo-flex, news, no user need), **discard silently** — do not log noise.
3. If it is signal, classify:
   - `signal_type` ∈ {building-problem, deploying-problem, usage-problem, use-case, workplace-vertical}.
   - `vertical` — name the industry if the post reveals one (e.g. "auto distribution", "legal", "healthcare", "MSP/IT"); leave blank if none.
   - `engageable` ∈ {yes, watch, no} — apply the **Engageable Test** in frameworks. Reserve `yes` for a real, current reply opening to a worthwhile person; use `watch` for a promising thread/person to revisit; else `no`.
   - `summary` — one or two sentences: what the post actually says.
   - `interest_judgment` — one sentence on *why it matters to Tokenrip* (vertical + pain + opening). Never a character read of the person (see soul, Safety).

## Phase 4 — Record Signals

For each post that passed Phase 3, write a row to the default `reddit-signals` table:

```
rip --json agent record <session-token> --table reddit-signals --row '{
  "post_url": "https://www.reddit.com/r/.../comments/.../...",
  "subreddit": "AI_Agents",
  "title": "...",
  "summary": "...",
  "signal_type": "workplace-vertical",
  "vertical": "auto distribution",
  "engageable": "yes",
  "interest_judgment": "Named auto-vertical, real workplace use case, security/CISO blocker, actively asking for help — direct reply opening.",
  "posted_at": "2026-05-30",
  "feedback_rating": "unset",
  "feedback_note": "",
  "review_status": "inbox"
}'
```

New rows always start `feedback_rating: "unset"` with an empty `feedback_note` and `review_status: "inbox"`. The operator fills feedback later (dashboard or `rip agent table patch`), and `consolidate` learns from them. `review_status` drives the review queue: `inbox` rows are visible, `dismissed` (operator cleared) and `processed` (consolidation distilled the learning) rows are hidden. `post_url` is the uniqueKey — a duplicate is rejected, which is a safe no-op. Record the highest-value signals first (engageable + workplace-vertical) so a truncated run still captures the gold.

## Phase 5 — Capture Themes (workspace)

When you notice a **recurring** vertical or pain — the same industry surfacing twice, the same blocker repeating — capture a short note to the workspace so `consolidate` can later promote it:

```
rip --json agent record   # NO — workspace uses workspace_capture, not agent record
```
Use `workspace_capture` with the workspace slug from Phase 1. One note per distinct observation, e.g. *"Vertical: MSP/IT — second post this week about agents for ticket triage; security-gated."* Link related notes (`workspace_note_link`) when an observation reinforces an existing one — backlinks are what promote a note from seedling → growing → evergreen (`min-backlinks-2`). Do **not** capture every post here; the table is the post log, the workspace is for *patterns*.

If you are unsure whether something is a pattern yet, capture it as a seedling — that is what seedlings are for.

## Phase 6 — Report & End

Summarize the run for the operator:
- Subreddits/queries scanned; posts seen; **new signals recorded** vs already-seen.
- Breakdown by `signal_type`, and the **engageable** count (lead with this — it is the KPI).
- Any new vertical or pain theme captured to the workspace.
- Any fetch failures (blocked host, missing credential, dead subreddit) — surfaced verbatim, never silently swallowed.
- A one-line recommendation: which 1–3 engageable posts are worth a reply *now*.

Then end the session:
```
rip --json agent end <session-token> --summary "<one paragraph: scanned X, recorded Y new signals (Z engageable), top vertical(s), top engageable post>"
```

If `produceSessionOutput` is set and the run found something worth a standalone artifact (e.g. a short engageable-leads shortlist), write it to a temp file and pass `--output-from /tmp/<file> --output-title "Demand-scout shortlist <date>"`.

## Cadence Note

This brain behaves identically whether a human runs `/tokenrip-bootloader reddit-demand-scout` or a scheduled remote agent invokes it on a cron. For a true daily monitor, schedule the bootloader command — no brain change needed.
</artifact>
