---
description: Process a call transcript — clean it, update the contact doc, write a learning note
---

# Process Call

You are processing a call transcript for Tokenrip. Calls come in four types, and the
analysis lens changes by type:

- **intel** — peer / note-swap / expert-interview calls. Goal: market intelligence,
  relationship, positioning data. No pipeline stage.
- **firm-direct** — Motion A discovery / follow-up calls with prospect firms. Closest to
  a classic sales pipeline.
- **creator** — Motion E / partnership calls about mounted-agent deploys.
- **fundraising** — investor calls (YC, a16z, angels). Goal: narrative testing, objection
  capture, follow-up commitments.

Produce three artifacts: a cleaned transcript, an updated persistent contact doc, and a
call learning note. (Do not write to Yoda's memory — see Step 6.)

## Step 1: Gather Input

Ask Simon for (or infer where possible):

- **Transcript** (required) — pasted inline or a file path.
- **Contact name** (required) — used for the file slug, e.g. `vijay-laknidhi`.
- **Company** (if applicable) — e.g. Liberate.
- **Call type** (required) — `intel` / `firm-direct` / `creator` / `fundraising`.
- **Prep file** (optional) — check `active/` for a `call-prep-*` file matching this
  contact. If one exists, read it: it states the goals and what success looked like.

Also check `bd/calls/contacts/[contact-slug].md` — if it exists, this is a follow-up call;
read it for prior history. If not, this is the first call and you will create it.

## Step 2: Clean and Store the Transcript

Clean the transcript:
- Remove small talk: greetings, goodbyes, weather, scheduling chat.
- Remove filler: "um", "uh", filler "like", "you know", "sort of".
- Remove false starts and repetitions.
- Keep tangents that have strategic value.
- DO NOT fix grammar — preserve natural speech.

Store at `bd/calls/transcripts/[contact-slug]-[YYYY-MM-DD].md` with frontmatter:

```yaml
---
contact: [Contact Name]
company: [Company or n/a]
date: [YYYY-MM-DD]
call_type: [intel | firm-direct | creator | fundraising]
participants: [list]
prep_file: [path or n/a]
---
```

## Step 3: Analyze Through the Call-Type Lens

All call types capture these four things:

- **Commitments** — every commitment gets an owner and a date. If the call didn't set a
  date, infer a reasonable one and flag it as inferred.
- **Open questions** — ambiguities, unknowns, things not asked, to resolve before next contact.
- **Simon's performance** — 1–3 coaching priorities, each with *specific alternative
  language*, plus 2–3 things that worked.
- **Momentum** — ↑ Advancing / → Flat / ↓ Stalling, with one sentence why.

Then apply the type-specific lens:

**intel** — What did we learn about the market that we didn't know? Capture verbatim
quotes. Watch for positioning reactions: every "wait, what is it?" moment is free
positioning data (Simon's known infrastructure-language trap — see
`agents/yoda/memory/insights.md`). Assess relationship state: did Simon make a genuine
ally? Did he avoid pitching/closing when he should have been swapping notes?

**firm-direct** — Pipeline analysis: pain evidence (real pain vs. vitamin), objections
(quote, type, how handled, effectiveness 1–5, better response if <4), stakeholders /
authority / budget / timeline, stage signal. Is there a concrete mutual next step?

**creator** — Deploy intent and fit for a mounted-agent imprint. Audience size and
relevance. Did the lighthouse (Chief of Staff) reference land? Concreteness of next step.

**fundraising** — Did the narrative land? Capture each investor objection with the actual
response given and a better one. What follow-up materials are they expecting? What
specifically did Simon commit to send?

## Step 4: Update the Persistent Contact Doc

`bd/calls/contacts/[contact-slug].md`. Create on first call; update on every call after.

Structure (adapt sections to call type — omit what doesn't apply):

```markdown
---
contact: [Name]
company: [Company]
call_type: [primary type]
status: [relationship state — e.g. ally / active discovery / pipeline-qualified / cold]
last_contact: [YYYY-MM-DD]
---

# [Contact Name] — [Company]

## Who / What
[Who they are, company, why they matter to Tokenrip.]

## Call History
- **[YYYY-MM-DD]**: [[bd/calls/transcripts/[slug]-[date]]] · [[bd/calls/notes/[slug]-[date]]]
  — [type]: [2–3 sentence summary of outcomes and next steps]

## Running Intelligence
[Accumulated market intel, context, insider knowledge from this contact.]

## Relationship / Pipeline State
[For intel/creator: relationship temperature, what they can help with.
 For firm-direct: stage, authority, budget, timeline.
 For fundraising: investor stage, conviction signals.]

## Open Commitments
| # | Action | Owner | Due | Status |
|---|--------|-------|-----|--------|
```

On a follow-up call, append the new call-history entry, fold new intelligence into
Running Intelligence, refresh the state section, and update the commitments table
(mark old ones done/dropped, add new ones).

## Step 5: Write the Call Learning Note

`bd/calls/notes/[contact-slug]-[YYYY-MM-DD].md`. Concise and scannable.

```markdown
# [Contact] Call — [YYYY-MM-DD] ([call type])

## Follow-Up Actions
### What WE Need to Do
| # | Action | Owner | Due |
### What THEY Need to Do
| # | Action | Who | Due |
### What They're Expecting From Us
[Specific. If nothing, say so.]
### Open Questions Before Next Contact
- ...

## Call Summary
[Purpose, who, 3–4 sentence outcome.]

## Momentum
[↑ / → / ↓] — [one sentence]

## Key Intelligence / What Changed
[Top 3 — most significant new information or status changes. Verbatim quotes where useful.]

## [Type-specific section]
[intel: positioning reactions + market learnings.
 firm-direct: objections table + pain evidence + stage signal.
 creator: deploy fit + audience.
 fundraising: objection/response pairs + narrative landing.]

## Simon's Performance
### Coaching Priorities (1–3)
- What happened (brief quote) → **Better language:** [specific] → Why it matters (one line)
### What Worked (2–3)
- Skill + brief quote + one line
```

## Step 6: Capture Significant Insights (in the call note)

If the call surfaced something significant — a market truth, a strategic insight, a
recurring Simon tendency, or a decision-relevant fact — make sure it is captured in the
**"Key Intelligence / What Changed"** section of the call learning note (Step 5). That is
where it lives.

**Do NOT write to Yoda's memory** (`agents/yoda/memory/`). Yoda is a separate
mentor agent invoked only via its own `/yoda` commands, and its charter explicitly
excludes processing call transcripts. Call processing must never touch Yoda's files.
You may *read* Yoda's memory for context, but do not write to it.

## Step 7: Wrap Up

- If a prep file was used, suggest archiving it to `__ARCHIVE/`.
- Output a summary for Simon: artifacts written (paths), call summary, momentum,
  top 3 intelligence items, commitments table, open questions, and top coaching priority.

---

**Now process the call transcript Simon provides.**
