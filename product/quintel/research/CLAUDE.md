# Quintel Research — Instructions

> Scope: **EF industry/trade-press insight that informs Quintel product decisions** — newsletter articles, domain write-ups, practitioner commentary. This is a distinct bucket from two neighboring folders — don't misfile into either:
>
> - **`intelligence/research/quintel/`** → competitor / adjacent-AI-product intelligence (Legora, Harvey, AI-doc-workflow competitors). About *who else is building what*, not *how the EF industry actually works*.
> - **`bd/deals/equipment-finance/`** → relationship/deal context (who we're selling to, call records, risks). Nothing about a specific customer relationship belongs here.

## Adding a new piece

Use the `/quintel-research` command/skill for this (it automates the steps below). To do it by hand:

1. **Fetch or accept the content.** URL → fetch it. Paywalled/pasted → use the text given.
2. **Extract the core argument** — what does the piece actually claim, with what evidence (stats, quotes, examples)? Note explicitly if a piece is assertion-only with no supporting data — don't let a confident-sounding claim get filed as if it were evidence.
3. **Tie it to a specific, current Quintel doc section** — not a vague "this is relevant to sourcing." Ground it in an actual section number/concept from `quintel-customer-data-first-prd-2026-06-29.md` (or whichever roadmap doc is current — check `product/quintel/CLAUDE.md`'s "Key docs" table for what's current). If a piece *corroborates* a load-bearing assumption (PRD §18) or *challenges* one, say which.
4. **Add a row to `research-log.md`** — always, regardless of depth. Table columns: Date | Source | Title | Insight | Quintel tie-in | Link.
5. **Decide whether it earns a deep-dive file.** Write one when the tie-in needs more than ~2 sentences to explain properly, or the piece corroborates/challenges a load-bearing PRD assumption. Otherwise the log row is enough — don't create a file for every clip on principle.

## Deep-dive file format

Naming: `{topic-slug}-{source-name}-YYYY-MM-DD.md`, in this same folder.

```markdown
---
title: "<article title>"
source: <publication name>
url: <source url>
added: YYYY-MM-DD
type: trade-press
---

# <Article Title>

## Core argument
<1 paragraph — what the piece actually claims>

## Key points
<bulleted, with concrete stats/quotes/examples where the piece has them; flag explicitly where it's assertion without evidence>

## Quintel tie-in
<which PRD/roadmap section this validates, sharpens, or challenges, and why. Be specific — cite section numbers.>
```

## Filing rules of thumb

- **Don't let a confident source upgrade an unproven claim to fact.** If an article asserts something without data (see the permit-sourcing piece's paywalled/no-examples caveat as a template for how to flag this), say so in the tie-in — the value of external research is corroboration or challenge, not borrowed confidence.
- **Prefer specificity over breadth in the tie-in.** "This is about underwriting" is not a tie-in. "This validates §10's explainable-ranker bet" is.
- **Don't duplicate.** Check `research-log.md` for the URL before filing — if it's already there, skip or note an update.
