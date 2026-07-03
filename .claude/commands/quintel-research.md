---
description: Take a URL or pasted article and file it into the Quintel EF research log — extract the core argument, tie it to a specific PRD/roadmap section, decide log-only vs. deep-dive, and write it.
argument-hint: "[url or pasted article text]"
---

# /quintel-research — file an EF article into the Quintel research store

Turns a newsletter link or pasted article into a properly filed entry in
`product/quintel/research/` — a log row always, plus a deep-dive file when the
piece earns one. **The judgment (tie-in, depth call) is yours; don't just
summarize and dump.**

**Args:** `$ARGUMENTS` — a URL, or pasted article text (for paywalled pieces),
or nothing (ask Simon to paste a URL or the article text).

## Prerequisite

Read `product/quintel/research/CLAUDE.md` first — it's the source of truth for
scope, the deep-dive template, and the filing rules. Follow it exactly; if
Simon has edited it since you last ran this, defer to the current version over
anything below.

## Pipeline

### 1 — Get the content
- **`$ARGUMENTS` looks like a URL** → fetch it with WebFetch (prompt: extract
  the full core argument, key claims/stats/quotes/examples, and note anything
  clearly paywalled or truncated).
- **Fetch fails, returns thin content, or is clearly paywalled** → tell Simon
  what you got (or didn't) and ask him to paste the article text directly. Do
  not invent or infer content you can't see.
- **`$ARGUMENTS` is already pasted article text** (long-form, not a URL) → use
  it directly as the source.
- **`$ARGUMENTS` is empty** → ask which: a URL to fetch, or pasted text.

### 2 — Dedup check
Read `product/quintel/research/research-log.md`. If the URL (or an
unmistakably same article) is already logged, tell Simon and stop — don't
re-file. If he wants to update an existing entry, edit in place instead.

### 3 — Ground the tie-in
Read the current Quintel PRD/roadmap doc — check `product/quintel/CLAUDE.md`'s
"Key docs" table for what's current (as of this writing:
`quintel-customer-data-first-prd-2026-06-29.md`). Find the *specific* section
this article validates, sharpens, or challenges. "This is about underwriting"
is not a tie-in — "validates §10's explainable-ranker bet" is. If the article
touches a load-bearing assumption from the PRD's own risk log (§18), say so
explicitly.

### 4 — Extract and judge
- **Core argument** — the actual claim, in your own words, one paragraph.
- **Key points** — bulleted, concrete (stats/quotes/examples). Explicitly flag
  where a claim is asserted with no supporting evidence — don't let a
  confident-sounding source upgrade an unproven claim to fact just because it's
  in print.

### 5 — Decide: log-only or deep-dive
Per `CLAUDE.md`'s rule of thumb: write a deep-dive file when the tie-in needs
more than ~2 sentences to explain, or the piece corroborates/challenges a
load-bearing PRD assumption. Otherwise a log row alone is enough — don't create
a file for every clip on principle.

### 6 — Write it
- **Always:** append a row to `research-log.md`'s table (Date | Source | Title
  | Insight | Quintel tie-in | Link). Use today's date. If a deep-dive file
  exists, link the title to it.
- **If warranted:** write `{topic-slug}-{source-name}-YYYY-MM-DD.md` in
  `product/quintel/research/`, following the frontmatter + section template in
  `CLAUDE.md` exactly (title/source/url/added/type frontmatter, then Core
  argument / Key points / Quintel tie-in).

### 7 — Report
Tell Simon: what got filed, log-only or deep-dive (and why), and the specific
tie-in you used — so he can correct it if you read the relevance wrong.
