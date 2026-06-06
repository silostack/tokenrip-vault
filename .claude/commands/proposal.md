---
description: Draft a proposal from discovery-call context. Simon provides notes, transcripts, and/or context inline or as file paths. Produces a scoped, priced proposal ready for humanizer pass.
---

# Proposal — Proposal Drafting

You are drafting a proposal for Tokenrip. Simon will provide context (call notes, transcripts, contact docs, or inline briefing). Read everything he provides before doing anything else.

> **Apply the `customer-writing` skill first.** A proposal is a customer-facing deliverable, so the `customer-writing` skill governs voice, honesty, shareability, terminology, and "never explain the buyer's own business back to them." That skill is the cross-cutting layer; the guidance below is the proposal-specific layer (structure, pricing, cover email, self-check). Where they overlap, the skill wins.

Read the most recent proposal in `bd/calls/proposals/` for structural reference. Adapt the structure to fit this deal, don't force a template.

## Before You Draft: Extract Their Language

Build a terminology index from the provided context:

- **Pain language** — how the prospect describes their problem (verbatim)
- **Domain terminology** — industry terms they use naturally (use these, not synonyms)
- **Quantified pain** — dollar amounts, time costs, volume numbers
- **Outcome language** — how they describe success
- **Resistance signals** — objections, pushback, concerns
- **Budget signals** — explicit or implied (capital position, quality bar, how they talk about money)

Present this index to Simon before drafting. The proposal should read like it was written by someone who was on the call.

## Pricing Guidelines

- **Price confidently.** Don't pre-discount. If they didn't push on price, the proposal sets price cold.
- **Anchor when appropriate.** If there's a design-partner or discount structure, set a "standard list" anchor and justify the gap (reference rights, velocity, access, etc.). The anchor must be defensible, not so high it triggers disbelief.
- **If offering multiple options** (e.g., bundled vs hourly), the recommended option should be the better deal for the prospect. The alternative exists as an off-ramp, not as a competitor.
- **Refund window when appropriate.** A 30-day refund, no questions asked, is a strong de-risk move for first engagements. Not required for every deal.

Present the pricing rationale to Simon before drafting. Confirm the numbers.

## Drafting Guidelines

File: `bd/calls/proposals/[contact-slug]-[YYYY-MM-DD]-v1.md`

Use frontmatter:
```yaml
---
contact: [Full Name]
company: [Company]
date: [YYYY-MM-DD]
type: proposal
status: v1 draft
owner: [Simon or Alek]
pairs_with: ../notes/[contact-slug]-[YYYY-MM-DD].md
---
```

### What every proposal needs

1. **Lead with their problem.** The opening paragraph is about their pain and what gets built to solve it. Use their language. Reference quantified pain if they gave numbers.

2. **Describe what gets built in product terms.** What the user sees and does, not how it works technically. A prospect reads "the CV fills in the application" differently than "NLP extraction pipeline with entity resolution."

3. **Scope boundaries.** What's in, what's out, and how that was decided. If there's a next phase, mention it but don't commit to it.

4. **Commercial terms.** Price, payment structure, what's included, what's not. If there's a refund window, state it clearly.

5. **What you need from them to start.** Sample data, access, a scoping call, whatever. Frame as "useful to have" not "required."

6. **Next step.** One clear action. Suggest specific days.

7. **Cover email draft.** Reference something specific from the call. Keep it short. Frame the proposal as a "starting hypothesis" that a scoping call refines.

### What some proposals need (use judgment)

- **Multiple engagement options** — only when there's a real reason for two structures (e.g., bundled vs hourly, phased vs single delivery). Don't force a two-track structure if one price is the right move.
- **Engagement model for long sales cycles** — when the prospect's sales cycle (enterprise, regulated, committee-driven) means the relationship extends past the build. Not relevant for short-cycle deals.
- **Phased delivery** — when the work naturally splits. Don't artificially phase a small engagement.
- **"Why this price" section** — when there's a discount or anchor to explain. Not needed when the price is the price.
- **"Why this is a partnership" section** — when the deal is a design-partner structure with reference rights, shared incentives, etc.
- **Side-by-side comparison table** — when multiple options are offered. Makes the recommended option obviously better.
- **Timeline table** — for multi-week engagements. Not needed for short projects.
- **Stakeholder perspectives** — when the product has multiple user types. Write from each one's point of view.
- **Human-in-the-loop emphasis** — for regulated industries (healthcare, legal, finance). Compliance officers care about this.

## Self-Check

Before showing the draft:

- [ ] Does it lead with their pain, not Tokenrip's capabilities?
- [ ] Is their terminology used throughout?
- [ ] Are the commercial terms clear and internally consistent?
- [ ] If there are multiple options, does the recommended one obviously win?
- [ ] Is the price defensible? Did you avoid pre-discounting?
- [ ] Is there a clear next step?
- [ ] Does the cover email reference something specific from the call?
- [ ] Did you avoid volunteering Tokenrip's stage, fundraising state, or lack of prior customers?
- [ ] Would this read well to someone who wasn't on the call?

## Present and Iterate

Show the v1 to Simon. Flag:
- Assumptions you made where context was thin
- The pricing rationale
- Sections where you need Simon's input

Iterate as needed. Each version updates the same file with updated `status` in frontmatter.

Before shipping, remind Simon to run it through `/humanizer`.

## Principles

1. **Lead with their pain.** Their problem is the opening. Tokenrip's capability is the middle. The structure is the close.
2. **Use their language.** If they say "provider," say "provider." Don't translate to engineering vocabulary.
3. **The proposal is a starting hypothesis.** Say this explicitly. The scoping call or next conversation refines it.
4. **Don't volunteer fragility.** Don't mention Tokenrip's stage or team size unless the prospect already knows.
5. **Price confidently.** The price is the price. Don't apologize for it.
6. **Structure for their reality.** The engagement maps to their timeline, decision process, and constraints.
7. **Scope boundaries are load-bearing.** What's in and what's out prevents scope creep and sets expectations. State them clearly.
8. **IP ownership matters.** When building on a prospect's domain, say their domain IP is theirs.
9. **Next phases are leverage.** Mention the future to show the relationship has one. Don't commit to it.
