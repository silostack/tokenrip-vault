<artifact role="flow" alias="reddit-demand-scout-consolidate">
# Reddit Demand-Scout — Consolidate Playbook

This is the synthesis ritual. It turns the accumulated signal — the team `reddit-signals` rows and the workspace notes — into an updated `demand-landscape` artifact the whole team reads: which verticals keep surfacing, which pains repeat, where the engageable demand actually is. Run it periodically (weekly is a sane default), not every scan.

Do not fetch Reddit in this command. Consolidate reads what `scan` already gathered.

## Phase 1 — Load

1. Read the `<workspace slug="…">` block; note the slug.
2. Read the current `demand-landscape` and `scout-learnings` memory artifacts (their logical aliases) so you build on them rather than starting blank.
3. Pull the working set: `workspace_worklist` for the current notes and their maturity (seedling / growing / evergreen) and backlink counts.
4. Read recent `reddit-signals` rows — enough to see the distribution across `signal_type`, `vertical`, and `engageable`. **Separately pull the rows where `feedback_rating` is `good` or `bad`** — these are the operator's ratings and are the input to the Learn phase.

## Phase 2 — Promote

For each workspace note that has earned it, promote it one step (`workspace_note_promote`). The mechanical gate is `min-backlinks-2`: a note referenced by 2+ others is a real, recurring pattern and advances seedling → growing → evergreen. Promote on evidence, not vibe:
- A vertical that appears in 2+ signal rows and has a workspace note → growing.
- A pattern that has held across multiple scans and is now reflected in the landscape → evergreen.

Archive notes that turned out to be one-offs (`workspace_note_archive`) so the desk stays clean. A workspace nobody prunes becomes a junk drawer.

## Phase 2.5 — Learn From Feedback

This is the closed loop: the operator's ratings on signal rows tune future judgment. Take the `good`/`bad`-rated rows from Phase 1 and rewrite the `scout-learnings` artifact.

- For each `bad`-rated row, read its `feedback_note` and the row itself, and distill a **pattern-level rule** into "Stop Flagging" — e.g. *"Generic 'will AI replace us' threads → no demand signal, no opening."* Generalize from the example; never write a rule about the individual poster.
- For each `good`-rated row, distill what made it valuable into "Prioritize" — e.g. *"Named regulated vertical + a security/compliance blocker → always engageable, top priority."*
- Fold genuinely new threshold guidance into "Calibration Notes" (e.g. which verticals are hot, when `watch` should become `yes`).

Keep the rules tight and deduplicated — merge similar feedback into one sharper rule rather than appending endlessly. Then:
```
rip --json agent rewrite-artifact <session-token> scout-learnings --content-from /tmp/<learnings-file>
```
`scan` reads this artifact at judgment time, so a good rule changes the very next scan. If there is no new feedback since the last run, leave `scout-learnings` unchanged and say so.

## Phase 2.6 — Mark Processed

After distilling learnings, mark every `good`/`bad`-rated row whose `review_status` is `inbox` (or missing — for rows recorded before this field existed) as `processed`. This clears them from the operator's review queue in the Surface.

For each rated row, patch it:
```
rip agent table patch <mount-id> reddit-signals <row-id> --set review_status=processed
```

Get the mount ID from the load envelope (`mount.id`). Get row IDs from the `reddit-signals` rows you pulled in Phase 1. Only patch rows you actually processed in Phase 2.5 — do not mark rows whose feedback has not yet been distilled.

Count the rows marked processed; include the count in the Phase 4 run log.

## Phase 3 — Synthesize

Rewrite the `demand-landscape` artifact holistically. Keep it tight and team-readable. Suggested structure:

- **Top verticals (ranked).** Which industries keep surfacing, with the count of supporting signals and 1–2 representative post URLs each. Lead with where the *engageable* signal concentrates.
- **Recurring pains.** The building / deploying / usage problems that repeat — named, with frequency. Security/IT-gating, memory/context, reliability, cost, etc.
- **Types of work.** What people are actually running agents *for* — the use-case clusters.
- **Engageable shortlist.** The currently-live posts (from `engageable: yes` rows) worth a reply, freshest first. This is the action layer.
- **What's thin.** Honest note on where we have little signal yet, so the next scans can aim there.

Replace stale content; do not let the artifact grow unboundedly. It is a current-state synthesis, not an append log. Describe patterns and name verticals — never build a dossier on a named individual (see soul, Safety).

```
rip --json agent rewrite-artifact <session-token> demand-landscape --content-from /tmp/<file>
```

## Phase 4 — Log The Run

Write one row to the operator-private `consolidation-runs` table:

```
rip --json agent record <session-token> --table consolidation-runs --row '{
  "ran_at": "2026-06-01",
  "signals_reviewed": "42",
  "themes_promoted": "auto distribution (→growing); security-gating pain (→evergreen)",
  "landscape_updated": "yes",
  "learnings_updated": "yes",
  "notes": "Processed 4 rated rows (3 good, 1 bad); marked 4 as processed in review queue; two new verticals emerging: MSP/IT, legal ops."
}'
```

## Phase 5 — Report & End

Tell the operator what moved: which themes promoted, what the landscape now says are the top verticals and pains, and the current engageable shortlist. Then:

```
rip --json agent end <session-token> --summary "Consolidated N signals; promoted <themes>; landscape top verticals: <...>; engageable shortlist: <count>."
```
</artifact>
