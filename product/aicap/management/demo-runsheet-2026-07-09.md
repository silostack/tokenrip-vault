---
type: demo-runsheet
project: AICAP Validation MVP
client: AICAP — Stephanie Williamson
event: Week-1 demo (Thursday 2026-07-09)
owner: Simon Pettibone
status: prep
created: 2026-07-08
---

# Week-1 Demo — Run-Sheet (Thu 2026-07-09)

> Internal prep for the AICAP Week-1 demo. Companion docs: the client-facing checklist sent beforehand → [[aicap-compliance-checklist-for-stephanie-2026-07-08]]; the full walkthrough agenda → [[walkthrough-questions]]; scope → [[../aicap-validation-mvp-sow-2026-06-22]]; live status → [[../aicap-project-tracker]].

---

## The situation in one line

She expects a **rough autofill proof** (SOW Week 1). You have the **entire end-to-end journey working** (Weeks 1–5, verified against a running system 2026-07-03). That ~4–5-week overdelivery is the asset *and* the trap. The whole play tomorrow is **framing**: show it as a *scaffold on placeholder rules*, not a *finished product*.

## What she expects (SOW Week 1, ignoring what's built)

A screen-share where a coordinator starts an application from the admin view, a provider drops in a CV + government ID, and **the application comes back mostly pre-filled** — plus the context-expansion cleverness (a CV mention scaffolds adjacent fields). Rough edges assumed. She does **not** expect compliance flags, guided intake, the two PDFs, or attestation until later weeks.

## The frame (say this before showing a single screen)

> "In week one I got the whole pipeline standing end-to-end — deliberately, on placeholder rules and synthetic data. I did that so you can walk the entire thing and tell me what's wrong, and so the next six weeks go into precision, not plumbing. The plumbing is never the expensive part. The expensive part is making it correct enough that a hospital compliance officer trusts it on every edge case — that's what the rest of the build is."

Why it works: shows massive progress, explains why it still takes seven weeks, and makes the walkthrough the obviously-valuable next step. It reframes what she bought — not hours of plumbing, a *correct* credentialing engine — which she knows is the hard part. Repeat "placeholder rules / your rules load in next" throughout.

**On the "did I overpay?" reflex:** the honest answer is the frame above. The 80% (a working skeleton on guessed content) is fast and cheap; the 20% (her real rules, edge-case precision, adversarial scenarios) is slow and is the value. Don't hide the progress to protect an hours-worked perception — with someone burned by engineers who *underdeliver*, being visibly ahead is the win, and it takes the live 30-day refund risk off the table.

## Run-of-show

Lead with the **adverse-malpractice CV** so all three credibility moments land in one pass.

1. **Admin view — start an application.** Coordinator starts it → provider link generated. Keep it brief; this is the least interesting part to her.
2. **Provider journey — upload CV + ID.** Watch it extract and pre-fill. Call out **provenance** (each value shows where it came from — CV page + verbatim span, identity from the ID). This is the Week-1 payoff she came for.
3. **Context expansion.** Point out a field that filled itself from a CV implication rather than a question.
4. **★ The credibility test — spend 60 deliberate seconds here.** "Four board certs show *past* expiration dates — but they're MOC-maintained, so the system stays silent. Meanwhile this license is genuinely expired, so it flags for the coordinator. Cry-wolf on every physician would kill the product; the system knows the difference." This one moment answers her deepest fear better than anything else. It's also a validation question — you *inferred* this guard from her samples; confirm you read it right.
5. **Provider review + guided intake + attestation + submit.** Show the resolved/unresolved loop, the "can't resolve → hand to coordinator" path, name-matched signature. Keep pace up — this is "here's the whole shape," not a deep tour.
6. **The two PDFs + coordinator result view.** Red flags first, unresolved items, audit trail.

Then hand her a login: *"These are my guessed rules — go play with it, jot down anything that looks wrong. That's exactly the input I need."* Converts her from audience to co-builder; every issue she finds is free spec refinement.

## Two strategic asks (don't leave the call without teeing these up)

1. **Book the field-by-field walkthrough.** This is the #1 dependency — the compliance rules live in her head; no doc exists. The demo is the perfect setup: "here's the machine; now let's load your real rules into it." Frame the walkthrough as *reviewing my draft* (you already extracted ~70 rules), not filling a blank page.
2. **Reopen lead-call access.** She has design partners waiting to see it (Boston Children's, Duke, MD Anderson). You now have the thing to show. Ask directly: *"Is this what you'd put in front of Boston Children's? What would they need to see? Want me on that call?"*

## What to confirm / get her ruling on (previews the walkthrough)

- **Baseline form** — which of her sample applications is the Week-1 baseline (universal privileging vs CVO/locum).
- **The reads you made from her samples**, where the forms contradicted each other: work-gap threshold (3 months vs 30 vs 60 days), disclosure set (26 vs 19), references (covering colleagues vs 6 physician refs).
- **The MOC guard** — confirm MOC-annotated certs should stay silent; how she wants the audit trail to record "expired-on-paper but maintained."
- **Clean-samples gap** — all four CVs she sent are clean. You built *synthetic* adverse CVs to demo the flag path. Tell her, and ask her to gut-check they read as realistic or point to a real de-identified adverse case.
- **Government ID** preference (DL vs passport) — you sourced samples from the web.
- **Her Replit export/screenshots** as a build reference.

## Watch-outs (get ahead of these before she does)

- **Synthetic data, mismatched personas.** Demo CVs and IDs don't match (a CV with a different name's ID). The provenance chips make it a *feature* (identity comes from the higher-confidence ID), but pre-explain it or she'll be confused.
- **Email is outbox-only by design** — queued, not sent, in the MVP. If she expects an email to *arrive*, clarify it's a deliberate MVP decision, not a bug.
- **Don't oversell "done."** Acceptance runs on de-identified samples + provisional rules; real data, integration, production hardening are out of scope. Keep "looks done" from hardening into "is done."
- **Live extraction is 30–60s.** Rehearse the pacing so dead air doesn't read as breakage. Pre-stage a completed application to show the output side instantly.

## Pre-demo prep (today)

1. **Full dry run of the browser journey** (`docs/PLAYBOOK.md` §2 in the repo) on the machine you'll demo from — env, DB, `ANTHROPIC_API_KEY`, graphicsmagick/ghostscript all working. Verify the credibility moments actually fire. *"Verified 07-03" ≠ runs today.*
2. **Pre-stage a completed application** in the admin view (adverse-malpractice) so the output side is instant.
3. **Sample files at hand**; adverse-malpractice CV first.
4. **Send the client checklist today** (see below) — you committed to it on Upwork.

## Load-bearing assumptions (test tomorrow, don't assume)

| Rank | Assumption | Cheapest test |
|---|---|---|
| 1 | The build still runs cleanly on your demo machine. | Dry run today. |
| 2 | Showing Weeks 1–5 pulls her toward the walkthrough, not away. | The scaffold frame + book the walkthrough on the call. |
| 3 | Your inferred rules (MOC, work-gap, disclosures) match her intent. | Turn each into a confirm-question during the demo. |
| 4 | Your synthetic adverse CVs read as realistic to a 20-yr expert. | Show one, ask her to gut-check it. |

**The one thing that flips the strategy:** if she's given any price-sensitive signal (that $11K felt like a stretch, cost-per-hour framing), dial the reveal back. Absent that, get ahead and hand her the keys.
