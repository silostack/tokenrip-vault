---
description: Crawl the vault and (re)generate seed-set.csv — recommend which docs belong in the Tokenrip Brain
---

# /brain-crawl — inventory the vault, recommend brain membership

Generate (or refresh) `product/tokenrip/brain/seed-set.csv` — the reviewable manifest
of which vault docs belong in the **Tokenrip Brain** (durable doctrine: vision, theses,
product truth, positioning, business model, voice, settled POV). Simon edits the
`include` column; `/brain-sync` then ingests every `include=yes` row.

## Step 1 — Deterministic crawl

```bash
cd /Users/si/tokenrip-vault/product/tokenrip/brain
./brain-crawl.sh        # add --reset to discard prior decisions and re-recommend all
```

This walks the vault for content-bearing markdown (system/tooling dirs excluded),
classifies each doc by path heuristic into `category / include / confidence / reason`,
**force-includes anything already in the brain**, and **preserves Simon's prior
`include` edits** (unless `--reset`). It writes `seed-set.csv` with columns:

`include, path, category, confidence, words, modified, reason`

It prints totals and how many rows are **low-confidence** (review those first).

## Step 2 — Refine the ambiguous rows (your judgment)

The heuristic is confident about the clear cases (archives, BD, transcripts, agent
memory → no; published posts, product truth → yes). The **low-confidence** rows are
the genuinely mixed buckets — chiefly `active/` (canonical theses sitting beside dated
ops docs) and `product/quintel/` (positioning vs build specs).

For the low-confidence rows, read each doc (title, frontmatter, first ~40 lines,
headings) and decide `yes`/`no` against this rubric:

- **yes** = durable doctrine: a vision/strategy thesis, product-truth/positioning,
  business-model belief, voice/brand guidance, or a settled opinion about Tokenrip/the
  market — content still valuable months from now.
- **no** = a dated tactical plan/gameplan; deal/customer/prospect-specific discovery,
  research, or prep; ops/status/dashboard; a build or engineering spec (implementation
  detail); agent/persona config; launch/site/app/demo design; transient WIP.
- Borderline: a canonical thesis = **yes** even in `active/`. Anything titled
  "…gameplan / plan / prep / spec / design / build / roadmap / primer / findings /
  leads / pipeline" for one effort = usually **no**. When torn, choose **no** with a
  reason a human can flip.

For a large backlog, dispatch parallel subagents over the low-confidence file list
(each returns `path<TAB>yes_or_no<TAB>reason`), then merge their decisions into the
`include` and `reason` columns of `seed-set.csv`. Do NOT change `include` for rows
Simon has already decided.

## Step 3 — Hand off

Report: total docs, count recommended `include`, and the notable judgment calls (esp.
which `active/` docs you kept vs dropped). Tell Simon to review/edit the `include`
column in `seed-set.csv`, then run `/brain-sync` to ingest the `yes` rows.

## Notes
- Re-runnable as the vault grows: new docs get a heuristic recommendation; Simon's
  prior decisions are preserved. Flipping a row from `yes`→`no` and re-syncing will
  **archive** that source and its atoms (the brain follows the CSV).
- Excluded from the crawl entirely (pure tooling/system): `.git`, `.obsidian`,
  `node_modules`, `.claude`, `.agents`, `codex/`, `_claude/`, `youtube-pipeline/`, `tmp/`.
  Markdown only (PDFs/CSVs are out of scope for v1).
