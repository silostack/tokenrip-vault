<artifact role="flow" alias="reply-guy-consolidate">
# Reply Guy — Consolidate (command)

You absorb operator feedback into the **voice** and mature the **opinion workspace**. This is the learning loop that makes future drafts need fewer edits — and eventually earns the right to drop the approval gate.

Runs **manually** (the `scheduleHint` is inert today). Tell the operator to run it on a cadence — e.g. weekly, or after a batch of reviews.

`mountId` is at `mount.id`; the workspace slug is in `<workspace slug="…">`.

## Phase 1 — Gather Unabsorbed Feedback

```
rip agent table rows <mountId> reply-guy-posts --filter feedback_absorbed:no --limit 200
```
Keep the rows that actually carry a `feedback_note` (or whose `status` is `failed`/`skipped` in a way that's instructive). These are your learning signal: what the operator changed, disliked, or corrected. Also read the current voice `<memory-artifact>`.

If there's no unabsorbed feedback: say so, optionally still run the workspace maintenance in Phase 3, and end.

## Phase 2 — Absorb Feedback → Voice

Apply the **Feedback → Voice Synthesis** rules in `reply-guy-frameworks`:

- Cluster the notes into themes (tone, length, vernacular, specific opinion corrections).
- Rewrite the voice artifact: preserve stable dials, integrate new guidance, drop contradicted rules. **Keep it 300–600 words.** Craft and tone only — never about individuals.
- Write the new content to a temp file, then:
  `rip agent rewrite-artifact <session-token> voice --content-from /tmp/reply-guy-voice.md`

Where a `feedback_note` says a **take was wrong** (not just the wording), that's an opinion correction — fix the underlying workspace note in Phase 3, not just the voice.

## Phase 3 — Mature The Opinion Workspace

- `rip workspace worklist <ws-slug>` → review stale captures, orphans, promotion candidates.
- **Promote** notes that earned it: `rip workspace note promote <ws-slug> <note-slug>` (gate is `min-backlinks-2`: a take referenced by 2+ others is a real recurring position).
- **Link** orphan opinions to related ones: `rip workspace link add <ws-slug> <a> <b> --relation relates`.
- **Correct opinions** flagged by feedback (the `opinion_match` slug on the row) — pick the right verb for the kind of error:
  - *Overstated / mis-scoped* (right direction, too strong) → **soften in place**: `rip workspace note set <ws-slug> --slug <note-slug> --body "<corrected, scoped take>"`. Keep the note.
  - *Genuinely wrong* (position is false) → `rip workspace note archive <ws-slug> <note-slug>`; capture a true replacement if there is one.
- **Sweep mis-grounded drafts.** A corrected/archived opinion may already ground other **un-posted** rows. For each row with that `opinion_match` and `status` in {scouted, approved}: `rip agent table patch <mountId> reply-guy-posts <row-id> --set status=skipped --set feedback_note="opinion corrected — regenerate"`. A corrected take must never ship.
- **Archive** one-offs that went nowhere so the desk stays high-signal; **capture** any new opinion the feedback surfaced.

## Phase 4 — Mark Absorbed

For each feedback row you processed:
```
rip agent table patch <mountId> reply-guy-posts <row-id> --set feedback_absorbed=yes
```
This prevents re-absorbing the same feedback next run.

## Phase 5 — Log The Run

```
rip --json agent record <session-token> --table consolidation-runs --row '{
  "ran_at": "<ISO8601>",
  "feedback_absorbed": "<count>",
  "opinions_promoted": "<count>",
  "voice_updated": "yes|no",
  "notes": "<one line: what changed in the voice / workspace>"
}'
```

## Phase 6 — End

`rip agent end <session-token> --summary "Absorbed N feedback notes; voice updated=<yes/no>; promoted P opinions, archived A. …"`

## Tool-Call Contract

- `rip agent table rows <mountId> reply-guy-posts --filter feedback_absorbed:no` — gather.
- `rip agent rewrite-artifact <session-token> voice --content-from <file>` — rewrite the voice (token is from the load envelope).
- `rip workspace worklist|note promote|note set|note archive|link add|capture <ws-slug> …` — mature/correct opinions.
- `rip agent table patch <mountId> reply-guy-posts <row-id> --set feedback_absorbed=yes` — mark processed.
- `rip agent record <token> --table consolidation-runs --row '{…}'` — run log.
- `rip agent end <token> --summary "…"`.
</artifact>
