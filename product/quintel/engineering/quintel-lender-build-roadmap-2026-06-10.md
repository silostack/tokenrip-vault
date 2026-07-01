---
title: Quintel — Lender Surface Product Document (VFI / Stauss)
status: active
owner: Simon
type: product-document
product: Quintel
created: 2026-06-10
related:
  - product/quintel/quintel-engine-build-roadmap-2026-06-09.md
  - product/quintel/quintel-intake-design-2026-06-09.md
  - product/quintel/quintel-build-and-gtm-roadmap-2026-06-08.md
  - bd/deals/equipment-finance/equipment-finance-domain-primer-2026-05-30.md
  - bd/deals/equipment-finance/stauss-vfi-tokenrip-briefing.md
source_material: "VFI-Deal-Process.pdf (2026-06-10) + bd/calls/transcripts/stauss-paulos-2026-06-04.md (the two-deal walkthrough)"
---

# Quintel — Lender Surface Product Document (VFI / Stauss)

> **What this is:** the product definition for Quintel's **lender (`desk`) surface** — the build we're doing with Stauss Paulos (VFI) over the next few days and demoing to him next week. It is the basis for design docs, feature planning, and implementation.
>
> **What it builds on (assumed read, not repeated here):**
> - [[equipment-finance-domain-primer-2026-05-30]] — the *industry* (how deals, underwriting, placement, and fraud work). Terms used here (PFS, FMV, ABL, UCC, sale-leaseback, residual, committee) are defined there.
> - [[quintel-engine-build-roadmap-2026-06-09]] — the *engine* (the `ingest → structure → decide → match → review → capture` spine, its current real-vs-stub state, and the P0–P5 sequence). **P0 + P1 are implemented.**
> - [[quintel-build-and-gtm-roadmap-2026-06-08]] — the *motion* (broker-first, one engine, sell the hands).
>
> This doc adds the layer those three don't have: **the lender operator's context, jobs, and product surface, sourced from Stauss directly** — primarily the Call 4 walkthrough where he drove two real deals through his workflow live, and the VFI deal-process doc he sent.

---

## 1. Business goal — why we build the lender surface now

**The objective is a paying first deal in equipment finance, and the lender surface is the build Stauss is pulling on.** On Call 4 he re-pointed the first custom build at VFI ("let's start with VFI… copy-paste the Quintel work, start with the VFI profile") and set himself a ship deadline of end-June/end-July. He is the channel into the whole EF cluster (Bevel, NED, Marcus & Millichap, and his own placement network); a working lender surface he can demo is what arms that channel.

Three things this surface has to accomplish, in order:

1. **Be demoable next week** — a working walkthrough on a real-shaped deal that makes Stauss say "I can run my deals through this," not a slideware mock.
2. **Ride the shared engine** — every feature lands as config or a surface-scoped consumer of the existing spine, never a fork. The lender surface and the broker surface diverge only at rubric + downstream action (engine roadmap rule).
3. **Stay clean on the conflict-of-interest line** — build on Stauss's *portable* judgment and standard industry practice, not VFI's proprietary credit policy. This is a build constraint, detailed in §7, not just a BD note.

**Out of scope for this surface:** deal *sourcing* (broker-first discipline — sourcing is a later mid/upmarket upsell), the post-funding asset lifecycle (servicing, end-of-term, remarketing), and document generation.

---

## 2. The operator and the two seats

Stauss is the design-partner operator, and the single most important product fact is that **he works from two seats at once**, on the same inbound deal:

| Seat | What he is | What he does with a deal | Engine downstream action |
|---|---|---|---|
| **Lender (VFI)** | EVP at a balance-sheet direct lender | Underwrites it against VFI's box, packages it for credit committee, tracks it through credit → docs → funding | `decide` / `underwrite` → review + status |
| **Placement (his own network)** | An unregulated referral partner with a deep lender rolodex | Matches a non-VFI-fit deal to outside lenders, generates a referral agreement, tracks status, collects his fee | `match` → referral + status tracking |

These are not two products. They are **two downstream actions on one shared intake-and-screen spine** — which is exactly the engine's `broker`/`desk` split, except Stauss personally needs *both*. A deal lands by email; he screens it once; then it either goes to VFI committee (lender seat) or out to a matched lender (placement seat). The same deal can even switch seats mid-flight — his Deal B was a VFI underwrite that he openly said he'd place elsewhere (ABL/cash-flow lender) if VFI's committee passed.

**Implication for the build:** the lender surface is primary (per "start with VFI"), but the data model and intake must not assume a deal terminates at the VFI decision. The placement/matching path is the adjacent surface, it shares the spine, and — worth flagging — his most defensible, most-quantified painkillers live on the *placement* side (matching, fee-tracking, fraud), while his enthusiasm pulls toward the *sourcing* dream that we're deliberately not building. Build the lender underwriting walkthrough for the demo; design the data model so the placement hand plugs in without rework.

---

## 3. How a deal actually arrives (Stauss-sourced)

This grounds the intake surface ([[quintel-intake-design-2026-06-09]]) in the lender's reality:

- **90% of deal flow arrives by email from a referral partner.** "Send me the deal, here's what I need, shoot me an email." A summary, the financials, an equipment list.
- **Regulated/bank lenders use a secure data-room link** with a verification code instead. This is a *pain*, not a feature: Stauss loses "half a day to a day" per deal in email tag just getting data-room access ("I get busy, they get busy"). **Product opportunity he named explicitly:** a secure exchange portal inside the platform so information moves without the data-room runaround.
- **His first-pass move on any deal:** an initial review, ask for one or two more items, set up a call to learn the company, then decide whether to draft a term sheet.

**Two real deals from the walkthrough — the spec texture:**

**Deal A (small, placement-shaped).** From Nicole, a referral partner / 1099 contractor partnered with OEMs. Borrower wants $270K for tooling from an Irish vendor, 60-month term, corporate-only. She wants a 3% fee. Package attached: tooling quote, credit application, six months of bank statements. What Stauss wants from the system: *which lenders to send it to, each lender's initial needs list and deal/underwriting criteria, and any other documentation required to complete the file.* (He noted the deal is likely bigger than it looks — "one invoice in a $5M project" — which is why he'd take it.)

**Deal B (institutional, lender-seat underwrite).** From a debt advisory group retained by the borrower to collect term sheets from 2–5 capital providers. Borrower: a telehealth platform, $104M revenue, ~$28M EBITDA, projecting to double EBITDA in '26, bootstrapped, no debt, lots of patents, $150M ARR. The hiccup: it's **equipment-light** — all value is patents/tech, so it's really an ABL or cash-flow deal, not a clean equipment-finance fit, though Stauss still wants it at committee (possible sale-leaseback). This deal is the source for both the underwriting-read spec (§5) and the "open to" band (§4).

---

## 4. What the product does — the feature set

Each feature below maps to an engine stage and is sourced to something Stauss said or did. This is the feature-planning spine.

### 4.1 Operator profile + the "open to" band
On setup, the operator defines who they are, their contact info, and the **specific deal flow they want** (their primary box). Critically, a **secondary "open to" band**: deal types outside the primary box they'll still take under conditions — "I'm also interested in ABL and working-capital deals as long as they meet my revenue criteria and have audits/reviews." Stauss's Deal B would *auto-disqualify* on the primary box (no equipment) yet still has potential — the "open to" band is what keeps it from being wrongly killed. Alek's framing: a **P1/P2/P3 banding** — primary fit, secondary-band fit, out.

*Engine:* this is screen/`decide` config, account-scoped. It extends the existing credit-box config with a secondary tier.

### 4.2 Intake → normalized, pre-screened queue
A deal arrives (email forward or manual paste/upload), gets classified, extracted, and screened against the operator's box, and lands in a tray as a draft deal. **The killer value at intake** (per intake design §5): every referral partner sends deals in a different format; the engine normalizes all of them into one standard template, pre-screened against the operator's box. "An inbox of mismatched submissions becomes a uniform, pre-screened queue."

*Engine:* shared `ingest` (real) + screen (real); needs the VFI-box config authored.

### 4.3 The underwriting read (the imprint — §5 details the logic)
For a deal in the lender seat, the system produces an indicative verdict (fund / marginal / pass, or the lender's own vocabulary: **approve-with-conditions / counter / decline**), an indicative structure + rate/term band, and the reasons — modeled on how Stauss actually reads a financial package. Kept **~70% and moldable** on purpose (GTM doc principle): a too-perfect score triggers "that's not how I'd price it"; a moldable one triggers co-creation.

*Engine:* `decide` computes from data (real); the lender verdict vocabulary, conditions, and indicative structure output are new.

### 4.4 Progress tracker + path-to-fund
A deal carries a status through the lifecycle, with a **requirements indicator**: what's already in hand vs. what's still needed to move it forward. Stauss, verbatim: "I've got the '24 and '25 audits, the interim package, I need two more things… an indicator that says you still need these two requirements to move it forward." From the lender seat, the gates are VFI's 9 stages (origination → signed → submitted to credit → credit → documentation → master-lease execution → funding). From the placement seat, it's "two more things for VFI to start." His job — "compile everything and send the file" — is the thing to automate. He also wants deal notes to live here, not back in Salesforce.

*Engine:* the missing-docs mechanism (already half-built) produces the stip/path-to-fund list; the VFI 9 stages become a **lifecycle config** (data, not code). This is the lender flavor of the P4 state machine — display + manual advance now, full mechanics later.

### 4.5 Lender matching + the dynamic network (placement seat)
When a deal isn't a primary-box fit, the system surfaces lender matches from the operator's network with a recommendation: "not a lot of fixed assets here — equipment would be tough, but they'd be a great fit for a cash-flow or ABL lender; here are your matches." Ranked on **two axes**: credit fit *and* the human factors only the operator knows — responsiveness, professionalism, trustworthiness, whether they actually close and pay. ("I want to keep feeding deal flow to the guys who actually close and pay me.") The network is **dynamic**: the operator adds lenders as he meets them (contact, one-sheet, how-we-work-together), and a recent miss — "they require $5M+ revenue, this is $1M" — should X that lender out automatically next time so he stops wasting calls.

*Engine:* `match` (real, data-driven panel); the second ranking axis (realized outcomes + human factors) is the P4 feedback loop's payoff and starts from captured outcomes.

### 4.6 Referral-agreement generation + fee tracking (placement seat)
On a placed deal: generate a mock referral agreement (he flagged new LLCs without a lawyer would value this), automate outreach to client/lender/broker for needed info, and track status to the fee. The **tracking pain is acute and quantified**: the best status mechanism he's ever seen is a partner's *weekly* Salesforce report ("that's the BEST one, and it's once a week — that's how archaic corporate finance is"). He'd value an auto weekly status-request email to the lender, and — to catch fee fraud — a **UCC search run ~6 months out** to detect whether a deal he placed actually funded (he once sent one partner $80M across 30 deals in 90 days and was told none closed). Pitch framing Alek landed on: *revenue recovery plus increased revenue.*

*Engine:* `capture` records the outcome and the fee state; the UCC-search check is a scheduled job against the deal record. Most of this is P3/P4 territory — for the demo it's drafted-not-sent and display-only.

### 4.7 Fraud-detection layer (the cleanest portable-judgment moat slice)
This is *Stauss's own* judgment, not VFI's process, and it's exactly the kind of thing a contact database can't produce. Components he detailed:

- **Auditor-legitimacy verification.** A doctored audit had only a signature — no logo, watermark, or location — and "doesn't read like how [the audit firm] typically issues their audit" → fraud-alert flag. The firm's standing policy of requiring audited/reviewed financials (vs. internally-prepared QuickBooks, which "I could fake all day") is itself the control.
- **Vague-vs-specific UCC filings → double-financing detection.** A borrower hid prior financing behind a *vague* UCC filing (rather than a specific one listing the actual equipment); the filing didn't match, VFI funded, and he'd double-financed $2–3M. (Industry-scale version: First Brands / Onset Financial.)
- **Ownership research.** Owners hiding income in a divorce, in lawsuits, or in criminal activity; the trucking-company / money-laundering profile he turned down.

*Engine:* a `decide`-adjacent check layer. **For the demo it ships as a visibly-stubbed slot** — named, present, empty — which doubles as a judgment-extraction prompt on the call ("what would you check here?").

### 4.8 Clean-queue effect (the lender-internal value)
A second-order benefit Stauss named: if the agent rejects every incomplete file, the credit team's queue contains only crystal-clean, fully-submitted deals — which enables same-day funding on top-tier credit because nothing sits waiting. His queue had ~18 deals, 3–4 stuck 30 days on a missing final audit. This is a *positioning* point (and the VFI-internal sale rationale), not a separate feature — it falls out of 4.2 + 4.4.

> **Crypto (noted, parked):** Stauss again raised same-day stablecoin/USDC funding (fund a $1–2M deal in hours vs. days). Fourth appearance. Park as a separate treasury track; not part of this surface.

---

## 5. The underwriting read — the judgment to encode

From the Deal B walkthrough, Stauss's actual financial-statement read sequence. This is the spec for `decide`'s lender logic, and the bulk of it is **standard institutional credit analysis + his portable judgment** (clean to encode), not VFI-proprietary policy (see §7):

1. **Year-end determination** — fiscal vs. calendar.
2. **Balance-sheet read** — current assets / AR / prepaids; **PP&E** (his comfort band "10–20M"); the **due-from-related-parties** note (a flag); finance vs. operating leases; current portion of long-term debt.
3. **Tangible net worth** — deduct goodwill/intangibles from equity → tangible net worth → drives whether a **personal guarantee** is required or waived.
4. **Trend + cash flow** — revenue / gross-profit / net-income trend; add back D&A for a cash-flow view.
5. **Concentration** — client-concentration risk (his first committee question on Deal B).
6. **Structure selection** — equipment loan vs. FMV lease vs. **sale-leaseback** (his "most creative option") vs. routing to ABL/cash-flow when fixed assets are thin.
7. **Rate** — reverse-engineer the existing debt note to infer other lenders' pricing, then negotiate against it.

The output is the §4.3 verdict + indicative structure + reasons. **Keep it moldable** — this is the layer he co-creates, and the demo doubles as the instrument that extracts the parts he hasn't said yet (the per-stage kill reasons, the credit-package contents at submission).

> **What's still missing and gets extracted on this week's call** (the email agenda already sent): per-stage deal-killers, the physical contents of the stage-4 credit package, structure-selection heuristics by borrower profile, the fraud checks in full, 2–3 sanitized real submissions, and a time-eaten ranking to point the first build.

---

## 6. What it looks like — the surfaces

Reuses the Quintel screens ([[quintel-demo-shape-2026-06-08]], [[quintel-intake-design-2026-06-09]]); the lender surface is a configuration + a thin layer of lender-specific output, not new screens.

- **Setup / profile** — identity, contact, primary box, the **"open to" secondary band**, and the dynamic lender network (add-a-lender with one-sheet + how-we-work-together).
- **Intake tray** — inbound deals grouped by state (needs review / needs input / processing), each row showing borrower / asset / ask / draft verdict; the normalized, pre-screened queue.
- **Deal detail (the hero)** — the canonical deal view: extracted fields with provenance (every number traced to its source doc), the underwriting read (§5) as verdict + indicative structure + reasons (moldable), the **path-to-fund requirements indicator**, the **fraud-check slot** (stubbed, visible), and — for the placement seat — the **ranked lender match matrix** with the recommendation line.
- **Pipeline / stage tracker** — the VFI 9-stage lifecycle with manual advance and a conditions-precedent checklist.
- **(Placement, later)** referral-agreement draft + fee/status tracker.

**The demo arc, one sentence:** *drop a (sanitized) submission → it lands normalized in the tray → reviewed against your box → verdict + indicative structure + path-to-fund → tracked through your own 9-stage lifecycle.* Polish goes into extraction (the unfakeable part); the judgment layer stays deliberately rough.

---

## 7. The conflict-of-interest boundary (a build constraint)

Stauss is a current VFI employee. The first build pointing at VFI sharpens the trade-secret / self-dealing exposure flagged across the deal briefing. **For the build, this resolves into a concrete rule: build on what's portable, not what's encumbered.**

| Clean to encode (portable judgment + public practice) | Keep out (VFI-encumbered) |
|---|---|
| The §5 financial-read sequence (standard institutional credit analysis) | VFI's specific credit policy thresholds / committee rules as proprietary defaults |
| The §4.7 fraud heuristics (his career judgment) | VFI's internal pricing grids / rate matrices |
| The 9-stage lifecycle shape (generic EF, = the PDF he sent) | VFI's customer database / relationships as seed data |
| Structure types (EFA, $1-buyout, FMV, TRAC, sale-leaseback) | Anything "you couldn't find online" presented as VFI's secret |

Mechanically: **VFI specifics enter only as account config, sourced from Stauss's portable expertise.** Nothing VFI-proprietary goes into code, config *defaults*, or committed fixtures (the PII/fixture boundary in the engine roadmap already enforces the last). This posture is also the cleaner legal position — VFI as config on a generic engine, never VFI's process baked into the product. **Re-state the constraint to Stauss before accepting the deeper underwriting spec on this week's call** (the cheapest moment to set it).

---

## 8. The build — L-phases on the shared engine

The lender surface is the `desk`-surface instantiation of the engine's P-sequence, not a separate track. These L-phases are the next few days' work to "demoable bones."

**L0 · Config authoring** — the VFI credit box as an account-scoped screen config (the PDF chips are the v1 box: $1MM–$50MM, revenue $30M–$1B+, equipment/project-backed, continental US, exclusions); the "open to" secondary band (§4.1); the 9 stages + "advances when" gates as a lifecycle config; the structure-type enum.

**L1 · Lender intake path** — a referral submission (packaged PDF + cover email) through `ingest` on the `desk` surface via the manual-create door; the normalized-queue view (§4.2).

**L2 · Decision + indicative terms** — lender verdict vocabulary (approve-with-conditions / counter / decline) over the existing `decide` computation; the §5 read as indicative structure + rate/term band + reasons; stip list from the missing-docs mechanism; the fraud-check slot stubbed visibly (§4.7).

**L3 · Stage tracker + match surface + demo dressing** — pipeline keyed to the 9 stages with manual advance + conditions checklist; the ranked lender match matrix with the recommendation line (§4.5); deal-detail draft mode wired end-to-end.

---

## 9. Interdependencies with the engine roadmap (P0–P5)

- **P0 (done) →** the VFI/Stauss demo account is just an account. No auth work.
- **P1 (done) →** extraction is shared, but **watch the frozen field contract.** VFI-grade inputs (audited/CPA-reviewed financials, PFS, project-backed collateral, debt notes) likely need doc types and fields the broker contract doesn't carry. If so, that's a **contract change coordinated with the P2 field-map**, not a desk-side workaround. This is the single most likely place the lender build quietly forks the pipeline — don't let it.
- **P2 →** L0/L1 *is* P2 partially pulled forward. Build the VFI field-map and box config as the config layer so the broker-side P2 work lands in the same mechanism.
- **P3 →** the lender round-trip (inbound referral email → tray; outbound term sheet / stip request / referral agreement) and the fee-tracking jobs (§4.6) only fully land with the email loop + persistence. Demo uses the manual-create door inbound and drafted-not-sent outbound; the surface inherits P3 for free when it ships.
- **P4 →** the 9 stages + gates are the **lender flavor of the P4 lifecycle state machine**; the §4.5 second ranking axis (human factors + realized outcomes) is the **payoff of P4's feedback loop**. L3 ships display + manual advance with states as config, so P4 later replaces the *mechanics* (recorded transitions, audit trail, outcome ingestion), not the model. Capture decline reasons at `capture` from day one to open the loop's input feed early.
- **P5 →** unaffected. A second lender = a second account + config, which is the point.

---

## 10. Open product decisions

1. **Demo seat** — lead the demo with the lender underwrite (Deal-B-shaped) per "start with VFI," or the placement match (Deal-A-shaped) where his most defensible painkillers live? *(Lean: lender underwrite is what he asked for and what the deadline is tied to; show the match matrix as the "and it also does this" beat.)*
2. **How far to take the underwriting read in v1** — full §5 sequence, or the go/no-go + structure-hint slice? *(Lean: the slice, moldable; the full sequence is co-created on calls.)*
3. **"Open to" band depth** — a single secondary tier, or full P1/P2/P3 banding, in v1?
4. **Naming** — Stauss wants "Quintel" reserved for the upmarket "institute"; the small-ticket/this surface needs a name. *Our call to make this week, not open-ended.*
5. **Secure-exchange portal (§3)** — is the data-room-replacement worth a v1 slot, or does the email-intake path cover enough of the pain to defer it?

---

## 11. Watch-outs

- **Don't fork the pipeline.** Every L-phase lands as config or a surface-scoped consumer of shared mechanisms. The P1 field-contract pressure is where this gets tested.
- **Two seats, one spine.** Design the data model so a deal can carry from lender-seat underwrite to placement-seat match without rework; don't assume a deal terminates at the VFI decision.
- **Keep the judgment layer rough on purpose.** A polished rubric invites rejection; a moldable one invites co-creation — and the demo doubles as the §5 extraction instrument.
- **Timebox to the demo.** L0–L3 is bones for one working walkthrough, not full P2. If a piece balloons, stub it and put it on the call agenda.

---

*Product document for the lender surface. Companion to the engine build roadmap (P-phases) and the GTM roadmap. Update after this week's Stauss call lands the deeper underwriting spec (§5) and the per-stage kill reasons.*
