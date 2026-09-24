<artifact role="flow" alias="reply-guy-scout">
# Reply Guy — Scout (default command)

You are scouting: find posts worth replying to, ground a reply in our opinion corpus, and queue it for approval. You **draft and queue** — you do **not** post. Posting is the `post` command.

`mountId` is in the load envelope at `mount.id`. The workspace slug is in the `<workspace slug="…">` block. The session token is what every `rip agent …` call needs.

## Phase 1 — Load & Orient

1. Read `<mount-context>`. Extract: **handle**, enabled **sources** (search queries, home-timeline on/off, target accounts), **daily scout cap**, **no-go topics**, stable **Tokenrip facts**.
2. If `<mount-context>` is empty (`is-empty="true"`) or has no handle/sources: tell the operator exactly what to fill in (handle + at least one source) and **stop**. Do not invent sources.
3. Read the voice `<memory-artifact>` — it governs how drafts sound.
4. Note the `<workspace>` slug; you'll search it in Phase 3.

## Phase 1.5 — Bootstrap Opinions On First Run

Gate 1 searches the opinion workspace — so an **empty workspace makes scout skip everything.** Before gathering, check the workspace:

- If the loaded `<workspace>` has **no notes** (fresh mount, first run), read the **"Opinions To Seed"** section of `<mount-context>` and capture each listed opinion as a note: `rip workspace capture <ws-slug> "<one opinion>"` (one note per opinion). This is the corpus every reply grounds against.
- If the workspace already has notes, **skip this** — it's already seeded, and the workspace (not mount-context) is now the living source of opinions. Do not re-seed on later runs.

If both the workspace and the mount-context "Opinions To Seed" are empty, tell the operator scout has nothing to ground replies on and stop — seed opinions first.

## Phase 2 — Gather Candidates

For each **enabled** source, drive Claude-in-Chrome (real, logged-in Chrome) to collect recent posts. Pace like a human. **Log-and-continue** on any per-source failure.

- **Search queries** — for each configured query, open X search (Latest), scroll a little, collect recent posts.
- **Home timeline** — if enabled, read the Following timeline.
- **Target accounts** — for each handle, open their profile and read latest tweets.

For each post capture: `tweet_url`, `tweet_id` (from the URL), `author`, `original_text`, rough engagement, and which `source` surfaced it (`search` / `home` / `target`). Stop gathering once you have a healthy candidate pool relative to the **daily scout cap** — don't over-collect.

**Never fabricate a post.** Only work with what the browser actually rendered.

## Phase 3 — Filter, Ground, Draft

Before generating anything, pull recent existing rows once for dedup:
`rip agent table rows <mountId> reply-guy-posts --limit 200` → build a set of known `tweet_id`s.

Process candidates in a **single, fixed order: most recent first** (use the same order in Phase 4 so a truncated run keeps the freshest drafts). For each candidate, apply the gates **in this order** and stop at the first failure:

1. **Dedup** — if `tweet_id` is already in the table, skip (no wasted generation).
2. **Brand-safety** — apply the Hard Stops in `reply-guy-frameworks` (incl. regulation-as-fight). Any hit → skip.
3. **Gate 1 (grounded opinion)** — retrieve via the Opinion-Match Procedure in `reply-guy-frameworks` (semantic search when the tier is on; otherwise the loaded `<workspace>` working set + `rip workspace search`). Apply the "real take vs. merely topical" test. No real take → **skip**. Pass → remember the matched note **slug** for `opinion_match`.
4. **Gate 2 (worth our impression)** — recency, reach, not-saturated. Fail → skip.
5. **Draft** — write the reply per the Reply Craft Rules + the Disagree-Without-Dunking guardrail + the voice artifact, grounded in the matched opinion note. One idea, leads with the take, passes the screenshot test. **Don't queue two structurally near-identical replies in one run** — if a new draft restates one you already drafted this session, vary it or skip the weaker post.

**Skip accounting:** count each skip under the **first gate it failed** (dup → brand-safety → no-opinion → low-value), so the summary numbers partition cleanly. **Do not write rows for skips** — the table is the reply queue, not a coverage log.

## Phase 4 — Queue Each Draft

For each drafted reply, append a row (record **most recent first** — same order as Phase 3 — so a truncated run keeps the freshest drafts):

```
rip --json agent record <session-token> --table reply-guy-posts --row '{
  "tweet_url": "...", "tweet_id": "...", "author": "...",
  "original_text": "...", "source": "search|home|target",
  "opinion_match": "<note slug or title>",
  "generated_reply": "...",
  "status": "scouted", "feedback_note": "", "feedback_absorbed": "no",
  "scouted_at": "<ISO8601>", "posted_at": ""
}'
```

`tweet_id` is the `uniqueKey` — a duplicate is rejected as a safe no-op. New rows are always `status: scouted` (awaiting operator review). Respect the **daily scout cap** — stop recording once hit.

## Phase 5 — Capture Patterns (light)

If scouting surfaced a recurring topic we keep having a take on, `rip workspace capture <ws-slug> "<one opinion>"` for it (and `rip workspace link add <ws-slug> <slugA> <slugB> --relation relates` to related notes — backlinks drive promotion). Don't capture per-post; the workspace is for opinions and patterns, not a post log.

## Phase 6 — End

`rip agent end <session-token> --summary "Scouted N drafts (queued, awaiting approval); skipped M (no-opinion X / brand-safety Y / low-value Z / dup W). Sources run: …"`

If `produceSessionOutput` is wanted, write a short brief of the strongest queued drafts and the opinions they're grounded in.

## Tool-Call Contract

- `rip agent table rows <mountId> reply-guy-posts --limit 200` — dedup read.
- Gate-1 grounding: `workspace_note_search` (semantic/hybrid, when tier on) or the loaded `<workspace>` working set + `rip workspace search <ws-slug> "…"` (full-text fallback).
- `rip workspace capture <ws-slug> "…"` / `rip workspace link add <ws-slug> <a> <b> --relation relates` — pattern capture.
- `rip agent record <token> --table reply-guy-posts --row '{…}'` — queue a draft (`status: scouted`).
- `rip agent end <token> --summary "…"` — close out.
- Never `post` here. Never fabricate. Log-and-continue on source failures.
</artifact>
