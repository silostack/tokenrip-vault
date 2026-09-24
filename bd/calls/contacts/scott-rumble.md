---
contact: Scott Rumble
company: n/a (Australian commercial / equipment-finance brokerage — name not given)
call_type: firm-direct
status: early discovery — engaged, owner-level authority signal, concrete next step (send a sample deal → Quintel demonstrates current capability); gated on IP/NDA comfort + senior-team buy-in
last_contact: 2026-06-25
---

# Scott Rumble — Australian Commercial / EF Brokerage

## Who / What

**Principal / senior broker at a ~12-person award-winning Australian commercial & equipment-finance brokerage.** Speaks as the owner ("my business," "roll it out to the rest of my business," "I'll talk to my senior guys"). All-senior team, no juniors. Self-describes as **"very green" / "uncley"** on technology — needs everything in plain, outcome-first language (asked "what's an LLM?", "do I set up another laptop?").

**The firm:** Commercial lending / EF brokerage. ~12 people, all senior brokers. Each broker writes **~20-30 deals/month (≈1 settled deal/business day)**. Stack: **Salesforce** (CRM), **Dropbox** (files), **Microsoft** (email), **Equifax AU** (credit reporting), lender **banking portals** for submission. Award-winning — explicitly attributes wins to a bespoke, deeply-considered process and customer experience.

**How they make money / their moat ("playing in the gray"):** They get **rates below the lender's published marketing collateral** and **approvals past policy** because of brand strength and relationships. **Lender choice is their core competency and IP** — "in five minutes I know exactly where a deal is going and why." This is the part they will NOT outsource to an AI.

**Why he matters to Tokenrip / Quintel:**
1. **Clean, owner-level EF ICP with quantified pain** — and, unlike [[mike-ryan]], Scott appears to *be* the economic buyer (small owner-operated firm), not a champion gated behind a board.
2. **First Australian-market conversation** — greenfield Alek flagged ("nobody's doing anything in Australia"); a design-partner case study here opens a new geography.
3. **Sharpens the broker-vs-lender ICP split** — Scott explicitly *rejected* the lender-match/decision engine (his IP) and pulled the value to **document extraction + submission/credit-memo auto-population**. This is decision-relevant intel for what the broker wedge actually is.

## Call History

- **2026-06-25**: [[bd/calls/transcripts/scott-rumble-2026-06-25]] · [[bd/calls/notes/scott-rumble-2026-06-25]]
  — firm-direct (Alek ran): First call. Demo led with the underwriting + lender-match flow; Scott **redirected hard** — he doesn't want any lender-decision framework (that's his IP/edge), he wants the time-sink automated: extract data from email/Dropbox attachments (driver's licenses, financials, Equifax AU reports), auto-populate their templated submission/presentation (business write-up, reason for purchase, loan structure), save to subfolders, ready for the banking portal. Quantified pain: ~40 min/deal on submission prep; **5-6 hrs per full-doc credit memo**. Memory/persistence ("another Scott," "it doesn't forget, I keep training it") landed strongly. Raised **IP-leakage fear** (don't sell our process/tricks to another brokerage) → wants NDA. Pricing disclosed: **AUD 10k setup (incl. first-month build) + 5k/mo ongoing** (design-partner half-off). Next step: Scott sends a past deal (under NDA if needed), Quintel shows current (untailored) capability; Scott consults senior team.

## Running Intelligence

**Broker buy-side reality (AU commercial EF):**
- Senior brokers don't need lender-matching — they know placement cold. The junior-broker use case (place anywhere it gets approved) is explicitly *not* how a premium brokerage wins; debt-strategy fit matters more than "approved."
- The lender-match feature is **actively a liability** for this ICP: the "box of all your lenders + what they approve and why" is precisely the proprietary knowledge they fear being leaked to competitors. Showing it triggered the IP objection.
- **The real, quantified time sinks (the wedge):**
  1. **Submission prep** — pulling files, extracting data, populating the templated presentation. ~40 min/deal of saveable time. "Get it 80% there, saved to a subfolder, ready for the banking portal."
  2. **Full-doc credit memos** — 5-6 hours each; ~1 deal/day/broker.
  3. **Reading financials → servicing calculator** — named as another big time sink.
- Email-in (Microsoft) with attachments → structured deal file is the desired intake pattern. Dropbox folder/file-naming conventions matter ("see how we rename").

**Tech literacy:** Very low. Needs outcomes, not architecture. Jargon ("LLM," "infrastructure," "context/memory/persistence") needs translating to "it reads your emails and fills out your submission, and it remembers how you like it."

**Market:** Australian commercial EF — Alek's read is no direct AI competitor there yet. Equifax is the AU credit body (same as Canada).

## Relationship / Pipeline State

**Temperature:** Warm and genuinely engaged — enthusiastic on memory/persistence, did his own ROI math ("whole other full-time employee"), volunteered a concrete pilot path. Repeatedly self-aware that Quintel is early ("you guys are green / in a learning phase").

**Stage:** Early discovery with a concrete mutual next step. Better-shaped than most first calls: owner-level authority, disclosed-and-not-rejected pricing, an agreed artifact exchange.

**BANT:**
- **Budget:** AUD 10k setup + 5k/mo disclosed; Scott engaged with the structure (asked ongoing vs. build) and did not flinch. Owner of a 12-person firm → spend is plausibly his to authorize.
- **Authority:** Strong signal he's the principal/decision-maker; caveat — "talk to my senior guys" (consultative, not gated like a board).
- **Need:** Strong, firsthand, quantified (40 min/deal + 5-6 hrs/full-doc, ×~12 brokers ×~1 deal/day).
- **Timeline:** None set. Intent is "test-pilot something super simple." Risk: drifts without a date.

## Load-Bearing Assumptions (ranked — test, don't assume)

| Rank | Assumption | fact/inferred + conf. | Cheapest test |
|------|-----------|----------------------|---------------|
| 1 | Current (untailored) capability can impressively extract **Australian** docs — Equifax AU credit reports, AU financials, AU submission formats — on the sample deal Scott sends | inferred, **low-med** conf. | THE pilot-killer. The agreed next step hinges entirely on this landing. Run the sample deal through current extraction before promising anything; if AU formats break it, scope the gap honestly rather than over-promising. |
| 2 | Scott is the economic buyer and can authorize ~AUD 5k/mo himself | inferred, med-high conf. | Next contact: confirm whether he signs or the senior partners must agree. "Talk to my senior guys" leaves this open. |
| 3 | The extraction + submission/credit-memo wedge (NOT lender-match) is the right product to lead with for the broker ICP | **fact** (his own words), high conf. | Confirmed this call. Build the demo around doc-in → populated-submission-out; keep lender-match OFF by default for brokers. |
| 4 | IP/NDA concern is satisfiable enough for him to proceed (single-tenant siloing + NDA) | inferred, med conf. | Does he actually send the deal + sign, or does IP paranoia stall it? Offer the NDA proactively, unprompted, in the follow-up. |
| 5 | A "super simple test pilot" can be scoped narrow enough to prove value fast without a full month build | inferred, med conf. | Propose ONE concrete slice (e.g. email-with-attachments → populated submission for one deal type) with a date, rather than the generic "month build." |

## Open Commitments

| # | Action | Owner | Due | Status |
|---|--------|-------|-----|--------|
| 1 | Send a past deal (sample) for Quintel to run through current capability | Scott | 2026-07-02 (inferred — no date set) | Open |
| 2 | Offer/send an NDA proactively so the IP concern can't stall the deal exchange | Alek | Before/with next contact | Open |
| 3 | Run Scott's sample deal through current extraction; assess AU-format handling honestly before promising | Simon + Alek | On receipt of #1 | Open |
| 4 | Prepare a broker-tailored demo led by extraction + submission/credit-memo auto-population (lender-match OFF) | Simon + Alek | Before next live demo | Open |
| 5 | Lock a date + a narrowly-scoped "simple test pilot" definition on next contact | Alek | Next contact | Open |
