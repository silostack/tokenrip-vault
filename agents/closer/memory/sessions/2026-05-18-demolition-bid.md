# Closer Session — 2026-05-18 (Demolition Bid)

**Mode**: Proposal Coaching
**Focus**: Upwork job #2 — Demolition Estimating Agent (Claude). $10K fixed. Tier 1 rank 1 in the analysis doc. 15 years of historical cost data extracted from OneDrive into a structured DB + an autonomous estimating agent.

## What We Did

- Coached the full submission: cover letter + three screening-question answers + a 4-milestone breakdown.
- This posting is unusually serious for the volume phase: real budget, specific scope, and two screening questions ("describe a specific document-extraction agent you built", "what orchestration framework would you recommend") that act as a technical filter.

## Decisions & Assessments

- **Q3 framework — Simon's instinct failed it.** His plan was to name n8n/Make/Zapier and say "it depends." n8n/Zapier/Make are workflow-automation glue, not agent orchestration frameworks — naming them to a buyer who asked about *agent orchestration* signals not knowing the category and likely sinks the bid. "It depends on the use case" is passive language in technical clothing: the buyer gave a use case and wants an owned recommendation. Final answer: confident, specific — LangGraph + Claude, with an explicit "what I'd avoid and why" (CrewAI/AutoGen swarms = nondeterminism for a bounded single-agent job; n8n/Zapier = workflow glue). The "what I'd avoid" is the seniority signal.
- **Tokenrip stays out of Q3.** Recommending your own pre-release platform when asked "what would you recommend" reads as a sales pivot and makes the client a guinea pig. Tokenrip-as-credential lives in the cover letter and Q2 only.
- **Payment — milestone, not project.** Correct instinct. But the proposed $0 first milestone is the free-POC hunger tell (codified in patterns.md the prior day), and on this job milestone 1 contains the hardest, most valuable work (extraction). Killed.
- **Q2 — credential-only honest answer.** Simon has no built document-extraction agent and no specific concrete experiment to anchor it. Rejected the credential swap ("I've built pipelines" when the truth is "played around"). Final Q2 is explicitly honest about not having shipped one, leans on the real credential (built and runs Tokenrip) + hands-on toolchain familiarity (docling, kreuzberg), and converts the gap into the structure: extraction is the highest-risk part, so it becomes a paid milestone 1 proven on his real docs.
- **Milestone pricing.** Rejected $0, then rejected $1K for milestone 1. Final 4-milestone split of the $10K: M1 pipeline + proof on sample $2,000 / M2 full 15-year extraction $3,000 / M3 estimating agent $3,500 / M4 validation on fresh docs + handoff $1,500. M1 priced fairly because it carries the most scope uncertainty and doubles as fixed-price insurance.

## Cover Letter (final, humanized)

First draft violated §10 (asserted what was hard/easy in the client's own project — bidder-as-teacher). Simon caught it. Revised: no restate, no difficulty diagnosis at all. Opens with credential (Tokenrip), proves comprehension through a specific proposal (milestone-1 extraction on his real OneDrive sample) rather than by reflecting his problem back. Project-level scoping question as CTA, call as secondary. Lesson: comprehension is proven by a useful proposal, not a mirror. Added to patterns.md.

Q2 and Q3 then scanned for the same tell. Q2 had it three times ("single highest-risk part", "nothing downstream is worth building", "the hardest part") plus a full re-pitch of the milestone structure already in the cover letter — rewritten to honest answer + credential + a one-line milestone reference framed as buyer benefit. Q3 had it once ("for a cost estimate someone bids real money on") — clause cut. Q3's pipeline description was kept: describing the technical shape is legitimate when the question explicitly asks for framework reasoning (§4).

Q2 took two more passes. A draft re-introduced the tell in a new disguise — "given that your set is fixed... presumably pretty small" — narrating the client's own business back to him *with guesses* ("presumably" = guessing out loud, and likely wrong since the agent reads new scopes on an ongoing basis). Also added a doubt-planting unstructured.io fallback with pricing economics — a tangent that pre-solves a failure that hasn't happened. Final Q2: honest opener, Tokenrip credential, named open-source toolchain (Tika/Docling/Kreuzberg) as the competence signal substituting for the missing built-agent example, fallback compressed to one clause, all business-guessing removed. Locked.

## Commitments

| Action | Owner | Due |
|--------|-------|-----|
| Submit demolition bid — cover letter + Q1/Q2/Q3 answers + 4-milestone breakdown | Simon | 2026-05-19 |

## Patterns Observed

- **The credential swap.** Softening "I experimented with X" into "I've built X" on a screening question is a landmine — detectable swap, exposed on the call. Honesty + real adjacent credential + structural de-risk beats it. Added to patterns.md.
- **De-risk comes from structure, not a low price.** A cheaper first milestone doesn't de-risk a serious buyer (he's committing to the full amount conceptually); it just devalues the work. The de-risk is the shape: small first milestone, kill-switch, proof on real data. New "Pricing & Milestones" section in patterns.md.
- **The riskiest-scope milestone should never be the cheapest** — that's where overruns get eaten. A fairly-priced milestone 1 is also fixed-price insurance. Added to patterns.md.
