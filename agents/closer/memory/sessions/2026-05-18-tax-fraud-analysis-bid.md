# Closer Session — 2026-05-18 (Tax Fraud Analysis Bid)

**Mode**: Proposal Coaching + milestone breakdown
**Focus**: Upwork job — "AI-Powered Bulk Tax Return Portfolio Pattern Analysis", criminal defense law firm, preparer-fraud cases. $3,600 fixed, 2 weeks, expert level. On-prem open-source LLM required, no cloud API, attorney-client privilege.

## What We Did

- Coached the cover letter and built a 3-milestone breakdown of the $3,600 fixed budget.
- Triage read: serious buyer, specific scope, named framework (IRS Dirty Dozen), hard on-prem constraint. Close cousin of the Tier-1 Canadian Tax Auditor job in the analysis doc.

## Decisions & Assessments

- **Credential gap surfaced and handled honestly.** Asked Simon directly before drafting. Answers: on-prem open-source LLM = "run locally, not production"; tax document parsing = "experimented only". The posting lists "proven experience deploying open-source LLMs on-premise" as a hard required skill — a live credential-swap landmine. Play: explicit honesty on the on-prem gap, real adjacent credential (built and runs Tokenrip), gap converted to structure (fixed-price milestone 1 proving the on-prem pipeline before the buyer commits the rest). Same pattern as the demolition bid.
- **Tax domain — no confession needed.** The firm supplies the pattern checklist and the Dirty Dozen is public. The job is engineering a detection engine that applies their framework, which is legitimately Simon's role, not a domain-expert role. Don't fake tax expertise, but no need to flag a gap on something the buyer is providing.
- **No difficulty diagnosis in the letter.** A draft had "this pipeline lives or dies on two things..." — the exact §10 / patterns.md shape-shifting tell ("the hardest part", "lives or dies on"). Cut. Comprehension proven by the milestone-1 proposal, not by narrating the client's problem back.
- **Tokenrip-as-credential, linked tokenrip.com (not /agents).** Consistent with the e-commerce reframe earlier today.

## Cover Letter (final, humanized)

Three paragraphs, first person, signed. Para 1: who Simon is + Tokenrip credential + "exactly this shape" line (ingest messy docs, structured output). Para 2: honest on-prem statement converted to milestone-1 de-risk. Para 3: a single execution-forward CTA + call offer.

Two revisions Simon caught on review:
- Killed an inserted clause "(and our Tokenrip architecture is actually perfectly set up for this)" — an overclaim (Tokenrip is a cloud platform, not on-prem infrastructure) that also swapped "I" to "our" puffery right after the trust-winning honest sentence. Credential inflation undercuts the honesty.
- Replaced the two scoping questions (return format, available hardware) with one execution-forward question: do they have a sample portfolio ready for milestone 1? The hardware question read junior to a buyer who named four model families; the format question can be assumed (PDF + mix). Detail questions read junior; project-level / execution-forward questions read like a bidder.

Humanizer pass: no em dashes, no boldface; the "Llama, Qwen, Mistral" list mirrors the posting's language so allowed; varied length.

## Milestone Breakdown — $3,600 / 2 weeks

- **M1 — On-prem ingestion + extraction, proven on a sample: $1,200.** LLM on firm hardware, ingestion+extraction pipeline, validated on a real sample batch. Go/no-go checkpoint.
- **M2 — Pattern detection engine: $1,800.** Firm checklist + Dirty Dozen framework + random-pool cross-year sampling. Largest = core build.
- **M3 — Reporting, flagged index, docs, handoff: $600.** Simon reweighted +$300 from M3 to M2. Light flag: M3 is thin for citations + docs + handoff; if citations balloon, M3 gets squeezed.

Per patterns.md: M1 carries the most uncertainty (doc heterogeneity + first secured-environment deploy) and is fairly priced, NOT the cheapest — riskiest-scope milestone should never be the cheapest. M1 doubles as fixed-price insurance.

## Advisory Flag

$3,600 for 2 weeks of expert on-prem ML work scaling to thousands of returns is tight pricing. Not renegotiated in the volume phase; fixed milestones protect Simon. Makes M1-as-insurance matter more, not less. Bigger scope = a re-scope conversation on the call, not a cover-letter one.

## Commitments

| Action | Owner | Due |
|--------|-------|-----|
| Submit tax fraud analysis bid (cover letter + 3-milestone breakdown) | Simon | 2026-05-19 |

## Patterns Observed

- No new patterns. Reinforced: the credential-swap honesty play (ask Simon his real experience before drafting; honesty + real adjacent credential + structural de-risk), M1-as-fixed-price-insurance, no-difficulty-diagnosis in the opener.
