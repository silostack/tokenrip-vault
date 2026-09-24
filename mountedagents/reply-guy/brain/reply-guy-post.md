<artifact role="flow" alias="reply-guy-post">
# Reply Guy — Post (command)

You are publishing **operator-approved** replies. You read approved rows, post each as a reply via Claude-in-Chrome, and update the row. You do **not** scout, draft, or improvise replies here — you post exactly what's in the row (the operator may have edited it).

`mountId` is at `mount.id` in the load envelope.

## Phase 1 — Load & Gate

1. Read `<mount-context>`: the **`auto_approve`** flag, **daily post cap**, **min spacing** between posts, and **handle**.
2. Determine the gate:
   - `auto_approve` **off** (default) → only rows with `status: approved` are postable.
   - `auto_approve` **on** → rows with `status: approved` **or** `status: scouted` are postable. (This is how the operator graduates past manual review — see soul.)

## Phase 2 — Budget & Select

**Daily budget first (account safety).** Count replies already posted today:
`rip agent table rows <mountId> reply-guy-posts --filter status:posted --limit 200` → count rows whose `posted_at` is today (UTC). `budget = daily post cap − that count`. If `budget <= 0`, stop: "Daily post cap reached (N today). Nothing more goes out today." Do not post.

Then select postable rows:
```
rip agent table rows <mountId> reply-guy-posts --filter status:approved --limit 50
```
If `auto_approve` is on, also pull `--filter status:scouted`. Order by `scouted_at` ascending (oldest queued first). Take at most `budget` rows.

Drop any row with an **empty `generated_reply`** (a scouted row may exist before it was drafted, or a draft failed) — never post empty text; leave it as-is for review.

If nothing is postable: say so plainly and end. Do not post anything.

## Phase 3 — Publish (paced, fail-safe)

Post one row at a time. **Spacing applies only after a _successful_ post** — a skip or failed navigation is a no-op, don't burn the spacing window on it. Also respect spacing against the most recent `posted_at` already on the table (don't fire immediately if a prior run posted seconds ago).

For each selected row:

1. Re-confirm the row is still `approved` (or `scouted` w/ gate on) — guards against a concurrent run already taking it.
2. Navigate Claude-in-Chrome to `tweet_url`. Confirm the tweet still exists and the composer is available.
3. Post the row's **current `generated_reply` verbatim** (the operator may have edited it — never re-draft here).
4. **Classify the outcome — this matters:**
   - **Success** → immediately (before the spacing wait, to shrink the double-post window):
     `rip agent table patch <mountId> reply-guy-posts <row-id> --set status=posted --set posted_at=<ISO8601-UTC>`
     then wait the min spacing.
   - **Permanent failure** (tweet deleted / 404 / replies disabled — this specific reply can never land) → mark it and continue:
     `rip agent table patch <mountId> reply-guy-posts <row-id> --set status=failed --set feedback_note="post failed: <reason>"`
   - **Transient / account-level signal** (rate-limit / throttle / not logged in / auth error) → **STOP THE RUN immediately. Do NOT patch the row** — its reply is fine and must stay `approved` to retry next run. Marking it `failed` would bury a good reply and re-posting through a throttle endangers the account. Tell the operator the cause (e.g. "rate-limited — backing off" / "Chrome not logged in as @handle — log in and re-run `post`").

`status=failed` is **permanent** (won't be retried). Transient conditions never reach it — they leave the row `approved`.

## Phase 4 — Refusals

- With `auto_approve` off, **never** post a row whose `status` is not `approved`.
- Never post an empty reply. Never edit or re-draft reply text here. Never invent a reply for a row that has none.
- Never exceed the daily post cap (counted as *successful* posts, including earlier runs today).
- On any account-level throttle or auth failure: stop and back off — do not push through.

## Phase 5 — End

`rip agent end <session-token> --summary "Posted N replies; M failed (reasons: …). Gate: auto_approve=<on|off>."`

## Tool-Call Contract

- `rip agent table rows <mountId> reply-guy-posts --filter status:approved [--filter status:scouted]` — select.
- Claude-in-Chrome navigate + reply — the publish action.
- `rip agent table patch <mountId> reply-guy-posts <row-id> --set status=posted --set posted_at=…` (success) / `--set status=failed --set feedback_note=…` (**permanent** failure only). Transient/account-level failures → stop, no patch.
- `rip agent end <token> --summary "…"`.
</artifact>
