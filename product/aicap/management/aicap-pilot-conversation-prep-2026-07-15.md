---
type: call-prep-hub
audience: internal (Simon)
purpose: Everything needed for the pilot-scoping conversation Stephanie initiated in the GitHub issue
status: ready — pending Simon's reply on the issue + the call
created: 2026-07-15
---

# AICAP Pilot — Conversation Prep Hub

**The trigger:** Stephanie opened [tokenrip/aicap issue #3](https://github.com/tokenrip/aicap/issues/3) asking for two things — (1) time/resources/cost for a pilot, high-end estimate, possibly milestone + retainer; (2) a technical spec sheet to evaluate whether a hospital is a good pilot fit, handable to hospital IT.

**The reframe that governs the whole conversation:** this issue is Stephanie **opening the next engagement.** Both asks are about the *pilot* — which the signed [[aicap-validation-mvp-sow-2026-06-22|Validation MVP SOW]] explicitly fences out (live data, real hospital security, integration all "belong to a pilot"). She's not asking to clarify SOW scope; she's asking us to help her plan and sell the pilot. And she volunteered "milestone + retainer" unprompted — the [[aicap-retainer-tear-sheet-2026-07-15|retainer tear sheet]]'s ideal opening, in her words. Treat #1 and #2 as one conversation: **pilot + retainer scoping.**

## The two artifacts (both ready)

| Doc | What it's for | Answers her ask |
|---|---|---|
| [[aicap-pilot-fit-questionnaire-handout-2026-07-15]] | Single **technical fit sheet** for hospital IT: a system-description preamble + 6 core questions (what gates/prices a pilot) + an optional "good to know" parking lot. Questions framed as standard cloud-data questions, AI as a parenthetical. Ready to post. | **#2** — the spec sheet. Post to issue #3 as a draft for Stephanie to react to. |
| [[aicap-pilot-cost-skeleton-2026-07-15]] | Milestone (driver lines) + retainer (tear-sheet tiers) structure, with draft planning brackets Simon confirms. Call variables map 1:1 to the fit sheet. | **#1** — the cost/resources estimate. The call fills in drivers → a grounded high-end range. |

## How the pieces connect

- The **fit sheet's core questions are the cost skeleton's variables.** Answering the sheet *is* producing the estimate. The highest-leverage question: **how heavy is their security review** (SOC 2-acceptable + weeks = lean; HITRUST-before-pilot + months = slow/expensive). Integration is *not* a pilot variable — the pilot delivers via PDF, standalone (SOW deliverables), so it never enters this conversation; it's a separate future phase.
- **Don't quote a number in writing before the drivers are known.** The GitHub reply (posted to issue #3) primes Stephanie on the cost drivers and moves #1 to a live call, framed as protecting her planning accuracy, not withholding.

## Reading the hospital's answers *(internal go/no-go)*

- **Disqualify / fix-first:** no path to allow cloud processing of provider data (core Q1); HITRUST mandatory *before* any pilot (Q3); security review measured in many months (Q2); no internal sponsor with authority (her side, not on the sheet).
- **Green (ideal first pilot):** SOC 2 Type II acceptable (Q3); cloud processing permitted under BAA (Q1); security review in weeks (Q2); vendor-hosted acceptable (Q6); no DLP surprises on emailed PDFs (Q5).
- **Yellow (scope it, price it in):** on-prem/their-cloud-only hosting (Q6); a heavy custom security questionnaire (Q2); lots of per-hospital config beyond baseline.
- **One-line read:** *best first pilot = real backlog, sponsor with authority, security review in weeks, comfort with cloud/AI processing under a BAA, SOC 2 bar.*

## The load-bearing assumption (test it, don't assume it)

Both docs rest on: **Anthropic's BAA + zero-retention + no-training posture will satisfy a real hospital's InfoSec on cloud/AI processing of provider data.** This is *inferred* from vendor documentation, not confirmed against an actual hospital security review. It's the crux the whole product architecture depends on. Cheapest disconfirming test: it resolves the first time a real hospital's IT answers core Q1. Design the pilot to test it early; don't build on it as settled fact.

## Guardrails

- **New engagement, separately scoped** — never touches the signed SOW (SOW §Future Opportunities). Pilot gets its own SOW once scoped.
- **Beyond-SOW is paid** — both the pilot build and the fit sheet are Lane 2 deliverables/IP, not favors.
- **The cap holds** — AICAP is a capped afternoon block during the Quintel 90-day sprint. A well-qualified hospital (the fit sheet's job) lowers pilot schedule risk so the fixed-price milestone doesn't blow up.
- **Fold in the un-papered partnership agreement** (reference/case-study rights) — the pilot is the natural moment to close it (see tear sheet).

## Status / next steps

1. **Post the reply + fit sheet to issue #3** (reply drafted, primes the cost drivers, keeps the issue open as the tracking thread; the fit sheet goes in as a draft for her to react to).
2. **Stephanie calibrates the fit sheet** — she knows the procurement/political reality; she reacts to the draft, not a blank page.
3. **The call** — walk the cost drivers, hand her the milestone + retainer plan, note the pilot is lean (PDF delivery, no integration), promise the partnership-agreement draft.
