---
title: "Onset Financial — Production Readiness, Agreement Review, and Risk Map"
status: active
owner: Simon
type: deal-execution / readiness memo
created: 2026-07-30
audience: Simon (+ Alek for §2, §6)
deal: Onset Financial / Jerman Juarez-Padron
related:
  - bd/calls/contacts/jerman-juarez-padron.md
  - product/quintel/quintel-pricing-structure-2026-07-23.md
  - product/quintel/quintel-lead-register-prd-2026-07-25.md
  - product/quintel/quintel-enrichment-data-defects-2026-07-29.md
  - product/quintel/quintel-data-rigor-roadmap-2026-07-21.md
source: >
  Both call transcripts (07-23, 07-29), OFI Master Broker & Referral Agreement
  and Onset one-pager (received 07-29), and the quintel codebase verified
  directly 2026-07-30 (file paths cited throughout).
---

# Onset Financial — Production Readiness, Agreement Review, and Risk Map

## 1. Bottom line

**The attribution machinery this deal depends on is already built and has never been deployed.** The
lead register — per-customer surfaced-lead logging with timestamps, a `REVSHARE` account band at
0.5%, register events, CSV export, signed delivery links, and a public-record spot-check worklist —
exists on `develop` @ `e74e012`. It sits behind **124 undeployed commits and 10 pending migrations
against a migration ledger that is already out of sync with the prod schema**
(`planning/2026-07-29-three-plan-release-deploy-runbook.md`, whose own header reads *"This is a plan.
Nothing here has been run against a host."*). Production is live and serving (`quintel.ai` → 200) on
a ledger head of `Migration20260722170000`. That deploy is the critical path to next week, and it is
the riskiest deploy in the repo's history.

**Three findings reframe the deal.**

1. **The expected value is an order of magnitude below the anecdotes.** Onset's own one-pager states
   `$500K–$25MM+` and `$4B in fundings since 2008`. Against 100–250 funded deals/year, the average
   deal is roughly $1–4M, not the $60M and $257M stories from the calls. At 0.5–1%, a typical funded
   deal pays **$10–20K**, not six figures. Six figures requires a single deal ≥$10M at 1% or ≥$20M at
   0.5% — real tail, not the median. The one-pager also states **74% of customers do multiple
   transactions**, so a large share of Onset's annual volume is repeat business with existing
   customers, structurally ineligible for a sourcing fee. *The value of this deal is the reference and
   the learning, not the fee.* That should govern how much engineering it earns.

2. **Quintel's coverage and Onset's stated edge are close to disjoint — now verified in code, not
   inferred.** There is **no `country` field anywhere in the codebase**; geography is `{city, state}`.
   Every connector is US-only (USASpending, FMCSA, CourtListener, OpenFEMA, Socrata NYC permits,
   SAM.gov, three US trade RSS feeds), and UCC coverage is three states (FL/CO/CT). Onset's
   differentiator is offshore collateral — *"where we shine for some of those bigger deals is if
   they're going international"* — and their one-pager leads with *"flexible with many types of
   equipment all over the world."* Jerman also said the reverse: *"bigger deals in the United States
   are a little bit harder because usually they have really good banking relationships."* So the
   segment Quintel can see is the segment Onset wins least often. **§5 contains the reframe that turns
   this from a gap into the product idea.**

3. **The agreement has three independent discretionary gates on a contingent-only revenue stream, and
   no obligation on Onset to report a funding.** The fee percentage is not in the master agreement at
   all — it lives in a per-deal Exhibit A signed transaction by transaction (§3.1). §4.2 makes the fee
   discretionary wherever Onset had prior contact. §3.3 pays nothing where a third party is entitled to
   compensation on the same Schedule — and Onset's large deals are predominantly broker-sourced.
   Meanwhile §13.3's entire-agreement and no-reliance clause voids every verbal term: the 0.5–1% range,
   the size-indexing, and the 1–2% volume escalator are all legally worthless as of today.

**Recommendation.** Deploy and instrument, do not build broadly. Ship the register, close the four
data defects a customer can catch unaided, build the two small pieces that make the money path real
(an automatic Introduced-Transaction notice and funded-amount/fee capture), and put the agreement
changes in §2 on paper as *our draft* before Onset's legal finishes on 07-31. Everything else waits
for evidence that one part-time seat generates funded deals.

---

## 2. The agreement — what to change

The document is Onset's standard `MASTER BROKER & REFERRAL AGREEMENT`, unmodified template
(placeholder fields still read *"Click or tap here to enter text"*, Exhibit A still carries `SAMPLE`
watermarks). Simon's read is correct: they papered Quintel into a broker form. Most of it is
acceptable. Six items are not, and they are ranked by what they cost if unaddressed.

**Delivery vehicle — settled 2026-07-30.** These changes ship as a **rider**, not as edits to Onset's
template. A standalone rider carrying *"if this Rider conflicts with the Agreement, this Rider
controls"* leaves their template closed, is one signature, and defeats §13.3's entire-agreement clause
structurally rather than by amendment. Alek's v2 rider established the structure; the merged drafts are
**[[onset-rider-combined-2026-07-30]]** (one rider) and **[[onset-rider-ab-split-2026-07-30]]** (two
severable riders — A = attribution + fees, which the credit committee already approved, B = platform
and information terms). §§2.1–2.8 below remain the substance; the drafts are the instrument.

### 2.1 P0 — Nothing obligates Onset to tell Quintel that a lead funded

There is no reporting covenant, no periodic statement, and no audit right anywhere in the document.
Fees accrue on funding (§3.1) and are paid within five business days (§3.2), but Quintel learns a
deal funded only if Onset volunteers it. On a contract where 100% of revenue is contingent, this is
the single largest hole.

Quintel's own ratified terms already contain the fix
([[quintel-pricing-structure-2026-07-23]] §"Attribution"): a **reporting covenant** (obligation to
report fundings against registered leads within 10 days) and **Appendix B's audit + true-up** (once
per 12 months, 15 business days' notice, unpaid fees due in 30 days, customer covers audit cost if
underpayment exceeds 5%). Neither is in Onset's paper. Add both.

### 2.2 P0 — "Introduced Transaction" requires a written record Onset has no obligation to make

§1's definition: *"a Transaction first introduced to Company by Broker **and recorded by Company in
writing (including email) as a broker-introduced opportunity**."* Attribution is therefore gated on a
manual step by one part-time user. If Jerman does not email someone, the transaction was never
introduced and no fee is owed.

**Resolved by the rider, and more cheaply than planned.** The original fix was two-sided: define the
register as satisfying §1's writing requirement, *and* build the product to generate that writing.
Alek's phrasing does better by **deleting the requirement** rather than satisfying it — an Introduced
Transaction is one funded with a Registered Entity *"regardless of … which party contacted the
Customer, or which party documented the transaction."* Nothing then turns on who wrote what down.

Consequence for the build: **the automatic Introduced-Transaction notice drops from P0 to
nice-to-have.** Still worth shipping as evidence and as a courtesy, no longer load-bearing. What
becomes load-bearing instead is **register delivery** — see §3.3.

### 2.3 P0 — The multi-tenant clauses, which are the only ones with spillover beyond this deal

Onset's exclusivity, non-circumvention, and non-interference clauses are drafted for a broker who
*has a borrower and shops it*. Quintel is the inverse: it holds a list derived from public records and
serves many lenders. Read literally:

| Clause | Literal effect on Quintel |
|---|---|
| **§4.3** Five-business-day deal exclusivity — *"Broker will not shop or submit that same Transaction to another funding source"* | The same public company surfaced to Empire, Armada, or Wingspire is arguably a competing submission |
| **§8.3** Non-interference, 12 months post-term — no soliciting *"any Customer, potential Customer… that became known to such party through… the parties' relationship"* | Quintel knew the company first, from public records — but the clause does not say so |
| **§8.2** Broker non-circumvention, 12 months post-term — no *"otherwise do business with any Company funding source that Broker first learned of… through Company"* | Onset's funding sources are banks and capital providers. **That is Quintel's addressable market.** |

§8.2 is the one to fix first. Onset's funding sources will surface in ordinary diligence, and the
clause as written would bar Quintel from selling to them for a year after termination — the widest
liability in the document and the only one that constrains the business rather than the deal.

**Add one carve-out covering all three:** Broker operates a multi-customer market-intelligence
platform; information Broker independently sources from public records is not information that became
known through this relationship; nothing restricts Broker from providing its platform to other
parties; and platform delivery of publicly sourced information is not "shopping" or "submitting" a
Transaction. Add a parallel clarification to §5.5's conflict-disclosure duty, which otherwise obliges
Quintel to disclose its customer base transaction by transaction.

**Revised 2026-07-30 — the §8.2 fix is now affirmative, not a bare carve-out.** Both rider drafts
volunteer the covenant in Quintel's own words first (*Broker will not submit or present any Customer,
applicant, or transaction to a Company funding source it first learned of through Company*), then
clarify what §8.2 does not reach. Onset's concern is the broker-world mischief — a broker learning who
funds the lender and going straight to them — and Quintel will never do that, so conceding the real
prohibition costs nothing and reads far better than arguing the concern is misplaced.

Two additions to the carve-out:

- **Independent discovery, explicitly.** The agreement has a pre-existing-relationship exception but no
  independent-source exception. **UCC financing statements name assignees, and Quintel's own pipeline
  ingests UCC data** — so Quintel will mechanically "become aware of" Onset's funding sources through
  public records as a normal function of running the product. Without this, operating the platform
  arguably breaches the clause.
- **Providing the Platform is not "doing business with."** Covers the case where a funding source is
  itself a prospective Quintel customer.

**Operational mitigation, free and unmentioned elsewhere:** §8.2 only bites for funding sources learned
*through Onset*. Never ask who funds them, and if it is volunteered, do not record it. Their §7.1
already defines their funding sources as Confidential Information, so a disclosure binds twice over.
The set stays empty by default — keep it that way.

**Do not die on the 12-month tail.** Ask once, concede. The carve-outs above are what matter.

**The §4.3 relief now has something offered against it.** The rider cover notes offer a
five-business-day prospect reservation — the working version of §4.3 for a platform that never submits
transactions. That converts the multi-tenant section from a pure taking into a trade, which is worth
more than any wording change. Design:
`docs/superpowers/specs/2026-07-30-lead-reservation-and-disposition-design.md` in the Quintel repo.

### 2.4 P0 — Uncapped liability over machine-derived data

> **Corrected 2026-07-30.** This section previously read *"An unqualified accuracy warranty…"* and
> quoted §5.1 from mid-sentence. The clause actually opens **"To the best of Broker's knowledge after
> reasonable inquiry."** That is a knowledge-plus-reasonable-inquiry standard, not strict liability,
> and machine output Quintel does not know to be false already sits outside it. **The ask here is
> smaller than originally written:** drop the request to rewrite §5.1's scope, keep the liability cap
> and notice-and-cure. Change (b) below is superseded; (a) and (c) stand. Both rider drafts have been
> updated.

§5.1 warrants that *"all information provided to Company regarding any Transaction, Customer,
guarantor, vendor, supplier, or equipment is true, complete and not misleading."* §6 lets Onset
claw back fees where it *"reasonably determines"* a breach, unilaterally and with offset. §9.1 is a
broad indemnity including attorneys' fees; §9.2 waives Quintel's right to contribution from Onset even
where Onset contributed. §10 caps consequential damages but **contains no aggregate liability cap at
all**, and its carve-outs (confidentiality, indemnity, fraud/GN/WM) swallow much of what remains.

Set against [[quintel-enrichment-data-defects-2026-07-29]] — which documents entity resolution
returning a Bend, Oregon gunsmithing shop for a Department of Transportation prime contractor,
`est_ticket` as a flat 8% of an unreliable revenue estimate, and `event_date` as the ingestion
timestamp rather than the award date — this is the worst risk/reward trade in the document:
**zero guaranteed revenue against unlimited liability on data we have written down as defective.**

Three changes: (a) platform output is provided as-is, derived from public sources, not independently
verified, with Onset relying on its own credit approval and diligence — **the Recitals already say
Onset does exactly that**, so this is a clarification, not a concession; (b) the accuracy warranty
attaches to Quintel's own statements and to information Quintel actually knows to be false, not to
algorithmic output; (c) an aggregate liability cap tied to fees received in the trailing 12 months,
and notice-and-cure before any clawback.

### 2.5 P1 — The rate is not in the agreement, and every verbal term is void

§3.1 places the percentage in a per-deal `Exhibit A — Broker Fee Schedule` signed transaction by
transaction, with a second limb allowing *"such other amount as may be agreed."* §13.3 then states
that no Onset representative has authority to agree anything not in the executed document, and that
neither party relied on any statement outside it.

Net effect as drafted: **Onset sets Quintel's rate deal by deal, after the lead has been delivered and
the relationship established.** Jerman's *"it'll be explicitly said on the master broker agreement —
it ranges from 0.5 to 1%"* is a good-faith intention that the template does not implement. Combined
with §4.2 (prior contact → sole discretion) and §3.3 (third-party comp → no fee), there are three
discretionary gates on a contingent stream.

Ask for: a master-level fee floor of 0.5% that Exhibit A cannot go below; the size-indexing written as
a tier schedule (e.g. 1% under $5M, 0.5% above); the volume escalator as a defined review trigger; and
a precise fee basis (see 2.7). Note the rate itself is *better* than Quintel's ratified card — 0.5–1%
against a 0.5% quote and 0.35% floor — so this is about durability, not price.

### 2.6 P1 — §3.3 "No Double Compensation" collides with how Onset actually sources deals

*"No Broker Fee is owed… if a third party is entitled to compensation for the same Schedule, unless
Company agrees in writing."* Onset's large deals come predominantly through brokers, and Jerman's own
job is broker relationships. The most likely operational path in this entire deal — Jerman sees a
Quintel lead and routes it to a broker who knows the space — **pays Quintel nothing.** Nobody has
flagged this on either call.

Ask for: a Quintel fee is payable on a registered Introduced Transaction regardless of whether a
broker is separately compensated on the same Schedule, or failing that, a defined split.

### 2.7 P1 — The fee basis in the contract is not the basis Jerman described

Jerman was emphatic across both calls: *"it's all cost of property, so it's not like our margin"* /
*"you get a percentage off $20 million, not what we make on the deal."* §3.1 says something different:
*"a percentage of the total amount actually funded by Company under the applicable Schedule."*

These usually coincide and sometimes do not — most importantly on **sale-leasebacks, which Jerman
named as a live use case.** There, cost of property (original equipment cost) and the amount actually
funded (a liquidity advance against value) can differ substantially. Down payments, advance rentals,
security deposits, and soft-cost treatment also drive a wedge. Define the basis explicitly as cost of
property as stated on the Schedule, and confirm the treatment of Progress Funding installments
(§3.1 already splits the fee across them).

### 2.8 P2 — Items to raise, cheap to fix

- **No tail provision.** One-year term auto-renewing on 30 days' notice (§11.1); fees accrue only on
  funding; §11.3 pays only fees *accrued* at termination. Onset can non-renew and fund the pipeline
  60 days later for free — and EF cycles run weeks to months. Ask that registered leads remain
  fee-eligible for 12 months post-termination.
- **The agreement never mentions the software.** No licence, no permitted-use scope, no restriction on
  exporting or retaining Quintel output, no bar on using output to build a competing system, no
  post-termination deletion. **Onset states twice, emphatically, that it builds everything in-house**
  — *"everything has been done internally here, paid engineers, IT people… build something and then
  pretty much just update it"* — and its only software subscription is Sales Navigator. A rev-share
  structure means Onset pays nothing to evaluate, so the only cost of copying is engineering time.
  This is a build-vs-buy threat sitting inside the customer, and it is the sixth make-vs-buy instance
  in the log. Add a short platform-terms addendum.
- **Retitle the counterparty "Referral Partner," not "Broker."** The document is already titled
  *Master Broker & **Referral** Agreement*, so the word is present and the change is nearly free.
  Being contractually a *broker of commercial financing* invites state commercial-financing broker
  registration and disclosure regimes — Utah has such a regime and Onset is a Utah corporation with
  Utah governing law and exclusive Utah jurisdiction (§12) — and §5.4 has Quintel warranting it is
  qualified to do business wherever required. *Applicability to a data/referral party is a genuine
  counsel question, not something to assert; the label change is the cheap mitigation either way.*
  Jerman's *"I might just have it labeled as brokers still"* is a preference, offered alongside
  flexibility, not a requirement.
- **No prevailing-party fees** (§12) means each side bears its own costs, so a $50K fee dispute is
  uneconomic to litigate in Utah from outside it. That asymmetry favours Onset. Add prevailing-party
  fees.
- **No reference rights.** Quintel is accepting a below-card economic structure and getting no
  publicity right in return; §8.3(c) arguably cuts the other way. Quintel's own pricing doctrine is
  that *"nothing is free without a name and a price"* — the concession here should buy the right to
  name Onset as a customer and use an approved quote after the first funded deal. It costs Onset
  nothing and is worth more than 25bps.
- **Entity and tax mechanics.** §5.4 requires a good-standing warranty — confirm which legal entity
  signs and that it is in good standing. W-9 and wire instructions are needed for the Exhibit A
  schedule.
- **Sanctions screening.** Onset funds Dubai, Colombia, the Dominican Republic, Mexico and Asia, and
  nearly funded Tajikistan. A party contractually inside those transactions receiving a fee has
  sanctions-screening exposure that Quintel performs none of. One more reason to be an information
  provider rather than a transaction broker. For counsel's list, not the headline.

### 2.9 The conflict with Quintel's own ratified terms — a founder decision, not a redline

[[quintel-pricing-structure-2026-07-23]] §"Rev-share terms" states five load-bearing terms and that
*"a deal missing any of them is not this model."* Measured against Onset as scoped:

| Ratified term | Onset as scoped | |
|---|---|---|
| Fee basis: funded amount, not margin | Cost of property, not margin | ✅ |
| Rate 0.5% quote, 0.35% floor | 0.5–1%, size-indexed | ✅ better |
| Payment within 10 days of funding | 5 business days, by wire | ✅ better |
| **12-month term + a dedicated pod of 2–3 named reps, both as contract terms** | **One part-time rep**, committee-directed | ❌ |
| **Activity-based eligibility, 10-business-day challenge window, 12-month attribution window** | **§4.2: prior contact → sole discretion, adjudicated at funding time** | ❌ |

The pod requirement exists for a stated reason: *"Without them, a zero-base deal is a free option on
our cost."* Onset as scoped is that free option. The eligibility conflict is more pointed still —
Quintel's ratified position is *"disputes happen at surface time, when a lead is worth $0 — never at
funding time,"* and §4.2 does precisely the opposite.

The eligibility terms are worth pushing because **they read as concessions to Onset**: "you get ten
business days from the register to flag anything that's already yours, with the activity evidence" is
a right Onset does not currently have, and accepting it is what buys the activity standard (logged
contact in the prior 12 months) in place of mere presence in Edge. Onset carries a large CRM database
of cold-called companies; without the activity standard, §4.2 could disqualify a large fraction of
anything Quintel surfaces.

On the pod: the committee chose one seat deliberately, and pushing for three now invites *"why do you
need more of our people?"* The counter-ask that costs Onset nothing is a **written expansion trigger**
— two to three named reps at N funded deals or by month six — paired with the escalator. This is open
commitment #5 (rev-share as a standard model or an Onset-only structure, due 08-03) and #6, both still
open.

Also note the pricing doc's own guidance for this deal, which did not happen: *"Onset: the number call
opens at 0.5% with the floor pre-agreed, and we bring a one-page term summary so the mechanism
arrives as our draft, not as notes from their exec meeting."* The rate landed well; the mechanism is
now being drafted by their counsel. **Sending the term summary before 07-31 is still possible and is
the highest-leverage hour available on the commercial side.**

---

## 3. Platform readiness checklist

Verified against the codebase 2026-07-30. `[x]` = exists, `[~]` = exists but undeployed,
`[ ]` = does not exist.

### 3.1 Deploy — blocking, and the riskiest item on the list

- [ ] **Deploy `develop` @ `e74e012`.** 124 commits, never run against a host. Runbook:
      `planning/2026-07-29-three-plan-release-deploy-runbook.md`.
- [ ] **Reconcile the migration ledger first.** `db:sync` built the bulk schema and wrote nothing to
      `mikro_orm_migrations`, so migrations whose columns already exist show pending and
      `migration:up` dies on `column … already exists` (42701) — all-or-nothing, whole batch rolls back.
- [ ] **Do not ledger-mark the two data-backfill migrations** (`Migration20260728094000`,
      `Migration20260728170000`). Marking either strands the rows it exists to fix in a state
      `unpark` can never clear. The second has never executed through the migrator anywhere.
- [ ] **`VITE_GA_ID` before the build** — consumed at build time; no restart fixes it.
- [ ] **Set `AUTH_MAIL_FROM=noreply@agentmail.to` and `PUBLIC_BASE_URL=https://quintel.ai`.** Not
      `@quintel.ai` — SPF is `-all` and DMARC `p=reject` with only a Google DKIM selector, so an
      `@quintel.ai` envelope via AgentMail is rejected outright.
- [ ] **Back up the prod DB before migrating.** Not in the runbook.
- [x] `deploy.sh` carries a real smoke test and auto-rollback on failure.
- [ ] **Resolve the malformed-account-config landmine before adding `config/onset/`.** Per
      `planning/todo.md`, config loaders validate inside a stage body with nothing guarding them, and
      the config dir is account-scoped — so **one bad file in Onset's config dir fails Onset's every
      pipeline run, every tick, silently apart from the ledger.** Adding a per-account config dir for
      a live paying customer is exactly the trigger.

### 3.2 Account provisioning

- [x] `scripts/provision-account.ts` — Account + ORIGINATOR user + box + channels, idempotent.
- [~] `configRefFor()` reads `Account.configRef` from the DB (was a hardcoded two-entry map for
      `vfi`/`empire`; fixed on this branch — verify post-deploy before relying on `config/onset/`).
- [~] `band: REVSHARE` with `revShareRateBps: 50`, seat limit, allowance, `contractStartAt/EndAt`
      snapshotted at provisioning (`config/pricing-defaults.json`).
- [ ] **Onset buy box:** tickets $750K–$100M, industry-agnostic, all 50 states, sale-leaseback in
      `structures[]`. Decide what to do about non-US geographies (§5).
- [ ] **A large-ticket scoring template.** None of the three existing archetypes
      (`middle-market` at a $15M revenue floor, `small-ticket`, `asset-backed`) fits $750K–$100M. Run
      `scripts/score-distribution.ts` against candidate params before enabling — and note the harness
      caveats in `provisioning.md` (not family-aware, no headcount-model fallback, incumbent axis inert
      without UCC data, and Onset will have none).
- [~] **Password handover.** No self-service reset in production today; the auth lifecycle (invite,
      forgot-password, account admin) is in the undeployed batch. Until it lands, credentials are
      CLI-provisioned and handed over out of band.
- [ ] **Seat count decision:** provision 1 as the committee directed, or 3 so pod growth is
      frictionless. Recommend 3 — it costs nothing under rev-share and removes a step from the
      expansion trigger in §2.9.

### 3.3 The money path — where the deal actually lives

- [~] **Lead register.** `registered_lead`, `register_event`, `register_delivery`, `account_contact`,
      `usage_event`, `account_terms_event`. Register write inside `ProspectSurfaceService.surface()`,
      so surfacing is logged at the single door for all four prospect lanes. `rebuildLeadFromEvents()`
      proves the record is reconstructable from events alone. **Built, undeployed.**
- [~] **Register export and delivery.** `GET /v0/admin/register/:accountId/export` (deterministic CSV,
      formula-injection neutralized, sha256 stored alongside the delivery),
      `POST /v0/admin/register/:accountId/deliver` (signed download link),
      `GET /v0/admin/register/download/:token`.
- [~] **Spot-check worklist.** `GET /v0/admin/register/spot-check` — the manual public-record check,
      grouped by state.
- [ ] **P0 — register delivery, on a cadence, to two Onset recipients.** Under the rider, Registration
      triggers on **appearance on a delivered register** (or earlier interaction), and the
      ten-business-day objection clock runs from delivery. So **an undelivered register means no
      fee-eligible leads and no leads that ever lock.** `effectiveStatus` already encodes this:
      *"Undelivered leads stay `registered` forever … a lead the customer was never sent can never have
      had a window close on them."* Weekly delivery, two recipients so the record survives one
      person's departure. This is now the single most important operational habit in the account.
- [ ] Nice-to-have — **automatic Introduced-Transaction notice** on Save. No longer a contract
      requirement (§2.2), but cheap, good evidence, and it registers a lead the same day rather than
      waiting for the weekly register.
- [ ] **Funded-amount and fee capture.** `RegisteredLeadStatus` includes `'funded'`, but there is
      **no funded amount, funding date, fee rate, fee amount, or invoice anywhere.** For a
      rev-share-only customer, the path from "funded" to "$X owed, due in five business days" does not
      exist. This is the largest product gap specific to this deal, and it is small work.
- [ ] **Per-deal rate override.** `revShareRateBps` is a single account-level number; Onset's rate is
      size-indexed and negotiated per transaction against a per-deal Exhibit A.
- [x] **The register CSV's window columns stay** — resolved 2026-07-30. `windowCloseDate` and
      `eligibilityExpiryDate` encode the ten-business-day objection window and twelve-month attribution
      period, and the rider now grants both. They stop being an overstatement of rights and become
      contractual evidence. **Verify the rider text and the code constants agree before the first
      delivery** (`CHALLENGE_BUSINESS_DAYS = 10`, `ATTRIBUTION_MONTHS = 12`, weekday-only arithmetic) —
      a register that computes different dates than the contract states is worse than no register.
- [ ] **Two small product changes the rider implies.** (a) The attribution clock runs from
      **Registration** — the earlier of first delivery or first interaction — where the code currently
      uses `surfacedAt + 12 months`. (b) **Re-registration after lapse** starts a new period, replacing
      the rolling restart that was cut from Alek's draft; the `resurfaced` event type already exists to
      hang it on.
- [ ] **UCC secured-party watch on "Onset Financial, Inc."** — see §5 for why this is the highest-
      leverage enhancement available.

### 3.4 Data quality — before Jerman's first login

From [[quintel-enrichment-data-defects-2026-07-29]], re-prioritised for *this* customer. Note the
memo's own caveat: magnitudes are from a local dev instance and must be re-measured against prod.

- [ ] **Finding 4 — `event_date` is the ingest date, not the award date. Fix first.** It is the one
      defect a prospect can catch unaided: the USASpending page is one click from the evidence link
      shipped on every row, and it displays the signed date. Measured examples were 15 and 23 months
      stale. Backfill is cheap — the award id is already on `signal.link`. **A large-ticket closer will
      click through.**
- [ ] **Finding 1 — persist the recipient UEI at ingest.** Smallest change in the set; unblocks 2 and 4.
- [ ] **Finding 2 — gate low-confidence, name-matched companies out of customer-visible surfaces.**
      `CROWN INNOVATIONS, INC.` resolving to a Bend, Oregon gunsmithing shop in front of this customer
      would be a credibility event, and entity resolution is the exact argument used against
      build-vs-buy at a company that builds everything in-house.
- [ ] **Finding 3 — `est_ticket` is severity-inverted for Onset and needs a decision.** At 8% of
      revenue, Onset's $750K floor implies revenue ≥ $9.4M and the $1M–$100M band implies $12.5M–$1.25B.
      Most enriched companies in the sample carried $1–3.5M revenue from an unreliable third-party
      estimate. The ticket axis will mis-sort Onset's entire box. Either fix it or remove it from
      ranking for this account. `capex_usd` on the signal is the better instrument — 73% of
      capex-bearing signals are ≥$5M — but 77% of signals carry no capex value at all.
- [ ] Finding 5 — `state` vs. enrichment geo (9.5% mismatch). **Lower priority here:** Onset is all-50-
      states, so geo filtering carries less weight. One place the buy box helps.
- [ ] Findings 6–8 (UCC `ripe_date`, `validation_outcome` naming, snapshot provenance) — **low priority
      for Onset**, whose profile is national large-ticket rather than FL/CO/CT small-ticket. They
      become blocking only if the sale-leaseback idea in §5 is built.
- [ ] **Read the top 50 rows Onset's box produces, by hand, before handover.** Highest-value hour of QC
      available. Every wrong company, stale date, or implausible ticket is a credibility event with the
      one customer whose single deal could pay six figures.
- [ ] **From [[quintel-data-rigor-roadmap-2026-07-21]], start F1 now:** persist raw source payloads at
      the connector seam. Every day without it is history that can never be re-extracted, and it is a
      half-day write path with no product surface. F3 (a ~200-pair resolution gold set with a
      precision/recall harness) is the honest instrument behind Finding 2 and is roughly a day of
      labelling.

### 3.5 The coverage measurement — do this before 08-04

This is Assumption #1 in the contact doc and it is a product question, not a sales question.

- [ ] **Run Onset's box against production and produce a number:** how many US companies can Quintel
      surface today with credible evidence of a $750K+ equipment need in the last 90 days? Report the
      count and the deal-size distribution, not an impression.
- [x] **Verified: international is invisible.** No `country` field anywhere; `parseGeo` yields
      `{city, state}`; every connector is US-federal or US-state; UCC is FL/CO/CT.
- [ ] Decide the 08-04 position on international before the call rather than during it (§5).
- **This one job also answers the coverage question five other lenders have asked and none have had
  answered** (Bo/Hyland, Michael/Providence, Bill/Armada, Kevin/Civista, Paul/Capteris). One
  measurement, six answers.

### 3.6 Workflow fit — how Jerman actually works

- [ ] **No email digest exists.** Jerman said he will work this *"as morning, the whole morning."*
      There is no daily or weekly digest capability anywhere in the codebase — the only senders are
      `auth-mail` (reset/invite) and `demo-notify` (inbound demo requests), both over the AgentMail
      client. He has to remember to open a URL. For a part-time single seat whose engagement *is* the
      deal thesis, **a morning email is the highest-leverage retention feature available and it is
      unbuilt.**
- [ ] **Contact enrichment must work in prod.** He needs someone to call. 250/mo allowance; per-account
      contact grants are on the undeployed branch. Verify the provider keys are live and the reveal
      path works end to end before handover.
- [ ] **Vendor surfacing — an open, unpriced commitment.** Jerman asked for equipment vendors strong in
      EF, or vendors that do not self-finance, as outbound targets; Alek answered *"within reason, no
      issue."* Nothing in the corpus does this, and it is a different data shape from borrower
      discovery. **He will raise it on 08-04.** Take a position first: yes with a date, or not in v1.
- [ ] **Sale-leaseback is a named live use case with a named disqualifier** (companies that do not own
      equipment outright cannot do one). Nothing in the box schema captures it; `structures[]` is free
      text. See §5 for the data idea this unlocks.
- [ ] **Mobile and responsive `/dash` has never been exercised** (architecture punch list #7). Jerman
      is a relationship and travel role. Check it on a phone.
- [x] **No CRM integration needed.** Single-seat deployment moots Edge entirely — the one genuine
      simplification the scope-down bought.

### 3.7 Customer analytics — Simon's explicit ask

- [~] **"What they've seen"** exists only as the register's `surfaced` events. There is no separate
      impression log, and `prospect` rows are action-only by design — the entity docstring states
      there is *"deliberately NO 'surfaced' state."* The register is therefore doing double duty as
      the analytics substrate, which is fine, and it is undeployed.
- [~] **"Prospects they've touched"** — `prospect` (saved/dismissed) plus `prospect_review` (opened,
      per-user on this branch).
- [ ] **Nothing aggregates any of it, for the customer or for us.** No per-account activity view
      exists. Build one panel: surfaced, opened, saved, dismissed with reason, funded, fees earned,
      last login. It is simultaneously the renewal argument, the invoice justification, the answer to
      Assumption #7 (*does he open it once the novelty passes?*), and the artifact Jerman's committee
      will ask him for when they check whether this worked. **Stauss independently specified the same
      thing** — a manager-view ROI panel delineating Quintel's performance from his reps'. One build,
      two customers.
- [ ] **Turn on `dismissReason`.** It is deliberately inert today (`prospect.entity.ts`: *"the V1
      dismiss UI is silent one-click, so this stays null until a later phase"*). For a
      **single-user rev-share test, dismissal reasons are the primary learning instrument** — the
      fastest read available on why leads miss Onset's box. Cheapest high-value build on this list.

---

## 4. Operations and business readiness

- **Support channel.** The rate card promises email plus a shared Slack. Nothing is set up for Onset.
  Decide the channel before handover, and prefer one that leaves a record.
- **Onboarding session (08-04).** Buy-box intake, account provisioning, walkthrough. Bring the
  measured coverage number (§3.5) and a written one-page term summary (§2.9).
- **Invoicing.** No mechanism exists. Under §3.2, Onset wires within five business days of funding
  against a Broker Fee Schedule — so the operational path is: funding detected → Exhibit A signed for
  that transaction → wire. Decide who owns each step and where the record lives.
- **W-9, wire instructions, signing entity, good standing** (§2.8).
- **Insurance.** A broad indemnity with no liability cap and no E&O coverage behind it is worth
  pricing. If the cap in §2.4 is refused, coverage becomes the fallback.
- **The two open commitments that gate signing.** #5 (is contingency rev-share a model Quintel
  standardises, or an Onset-only structure — due 08-03) and #6 (verify internally whether *"we're
  already doing rev-share deals"* is true before repeating it in writing — Alek said it on 07-23).
  #6 is a truthfulness item and matters more than it looks: the log already carries one instance of an
  anonymised customer story being denied untruthfully.
- **Ask Jerman's personal funded-deal count and first-contact→funded cycle time on 08-04**
  (commitment #15, still open). It is the only input that converts this from a story into a model,
  and it has now gone unasked across two calls.

---

## 5. Unknown unknowns — what could kill this, and what could enhance it

### 5.1 The five that could kill it

1. **Expected value is 10x below the framing.** §1. Six figures is the tail, $10–20K is the median
   funded deal, and 74% repeat business means most Onset volume is structurally ineligible. **The
   operative risk is not that the deal fails — it is that it succeeds modestly and absorbs six weeks
   of build that the subscription band needed.** Spend the minimum that makes the money path real and
   the data credible, and make every piece reusable.
2. **Key-person concentration on a $0-guaranteed contract.** Jerman is simultaneously the champion,
   the sole user, the attribution adjudicator under §4.2, the per-deal rate negotiator under Exhibit A,
   and the informal holder of every verbal term §13.3 voids. **If he leaves, the goodwill, the
   escalator, and the size-indexing leave with him, and nothing survives in writing.** This is the
   strongest argument for §2.5 and §2.9 — not distrust of Jerman, but that the document has to work
   without him.
3. **The build-vs-buy threat is inside the customer.** Onset builds everything in-house, says so
   twice, subscribes to nothing but Sales Navigator, and under rev-share pays nothing to evaluate.
   The agreement contains no licence, no export restriction, no anti-derivative clause, and no
   post-termination deletion (§2.8). Six months of registers plus a lead list is a specification.
4. **The coverage/edge mismatch.** §1. Verified in code. Related trap: Jerman's most likely workflow —
   route a Quintel lead to a broker he trusts — is exactly the path §3.3 pays nothing on (§2.6).
5. **The deploy.** 124 commits, 10 pending migrations, a ledger already out of sync, two backfills
   that must not be marked, and a runbook that has never been executed — on the critical path to a
   paying customer's first login, with a per-account config landmine that fails a single account's
   every run silently (§3.1). This is the most likely thing to go wrong in the next seven days.

### 5.2 The three that could enhance it, and have not been raised

1. **Monitor Onset's own UCC filings as independent funding detection.** Onset files UCC-1s as secured
   party when it funds domestic secured deals. Quintel already ingests UCC data and already has a
   spot-check worklist. Watching *"Onset Financial, Inc."* as secured party gives Quintel the one thing
   the contract does not obligate Onset to provide: **knowledge that a registered lead funded.**
   Quintel's ratified terms already frame this correctly — *"we spot-check the register against state
   filing records monthly — disclosed openly, which is what keeps the covenant honest."* Constraints
   are real: coverage is three states today, and international deals file no US UCCs. But even partial
   coverage changes the dynamic, and the cost of watching one secured-party name nationwide is worth
   scoping. **Highest-leverage enhancement on this list.**

2. **Do not try to see Portugal. See the US company that is about to move equipment to Portugal.**
   This is the reframe that converts Onset's coverage gap into a product. Jerman described the
   international motion precisely: *"a lot of them are good ones like aviation or manufacturing, where
   some companies in the United States are establishing somewhere else, moving their manufacturing
   over there."* That announcement is made **by a US company, in US trade press** — and
   `areadevelopment.com`, a corporate site-selection and facility-expansion publication, is **already
   wired as a tier-2 prose-extraction feed** in `config/market-sources.json`. Offshoring and
   foreign-facility announcements by US companies are visible to the existing corpus. Quintel cannot
   see Dubai; it can see the Ohio manufacturer announcing a plant in Monterrey. **That is Onset's
   sweet spot, no US bank will fund it, and it is buildable from sources already in the repo.** Test
   it before 08-04 by querying the existing prose signals for offshore-expansion language — if it
   works, it is the single most differentiated thing Quintel could say on that call.

3. **UCC absence as a sale-leaseback qualifier.** Jerman named the disqualifier himself: companies
   that do not own their equipment outright cannot do a sale-leaseback for liquidity. Quintel holds
   UCC filing data. A company with heavy active filings has encumbered equipment; a company with
   owned, unencumbered equipment is a sale-leaseback candidate. **A negative signal used as a
   positive qualifier**, buildable from data already loaded — subject to Findings 7 and 8 (the filings
   are not registry-verified and their provenance is undocumented), and to coverage being three
   states.

### 5.3 Two smaller things worth naming

- **Onset's own one-pager contradicts the call.** Marketing says `$500K–$25MM+`; Jerman said $750K–
  $100M with $250M+ on strong credit. The marketing band is the distribution; the anecdotes are
  outliers. Configure the box to the distribution, not the stories — and note that credit approval
  runs 2–10 business days with a 90–95% post-approval close, so funding detection has a short,
  predictable lag.
- **Rev-share is now a pricing-model decision, not an Onset concession.** Three independent lenders
  have raised it — Max/Providence, the Stauss channel, and Onset. If Onset works, that is a
  productized band with a reference. If it does not, the lesson arrives cheaply. Either way **the
  learning is worth more than the fee, which is the argument for instrumenting this account heavily
  and building for it narrowly.**

---

## 6. Sequenced plan

**Before 07-31 (Onset's legal finishes Friday)** — the window that closes first.
1. **Pick the packaging** — combined rider or the A/B split — and send it with Part A of the term
   summary as the cover. Framed as *"a few items that come from us being an information service rather
   than a party bringing you a borrower"*; most of it reads as pro-Onset, and the ten-business-day
   objection window is a right they do not currently have.
2. Decide: counsel review, or Simon-redlined with counsel on the two unsignables only (multi-customer
   carve-out, and information/liability).

**Before 08-04 (the scoping call).**
3. Run the coverage measurement (§3.5) and bring the number.
4. Test the offshoring-signal idea (§5.2.2) against existing prose signals.
5. Fix Finding 4 (`event_date`) and gate Finding 2's low-confidence rows (§3.4).
6. Take positions on: vendor surfacing, seat count, and the pod expansion trigger.
7. Founder decision on commitments #5 and #6.
8. On the call: ask Jerman's annual funded count and cycle time (#15).

**Before handover (target: next week).**
9. Deploy `develop`, ledger-reconciled, with a DB backup (§3.1).
10. Provision `acct_onset` — `REVSHARE`, box, large-ticket template, `config/onset/` validated
    against the landmine in §3.1.
11. Build the Introduced-Transaction notice and funded-amount/fee capture (§3.3). These two are the
    money path.
12. Turn on `dismissReason` (§3.7).
13. Hand-review the top 50 rows (§3.4).

**Weeks 1–4 after handover.**
14. Weekly register delivery to two Onset recipients.
15. Build the per-account activity panel (§3.7) — serves Onset, Stauss, and every renewal after.
16. Scope the UCC secured-party watch (§5.2.1).
17. Watch one number: **does he open it in week three?** Assumption #7 resolves behaviourally, and
    nothing said on 08-04 tests it.

---

## 7. Open decisions

| # | Decision | Owner | By |
|---|---|---|---|
| 1 | Counsel engaged for the P0 four, or self-redlined? | Simon | 07-31 |
| 2 | Push the 2–3 rep pod, or accept one seat with a written expansion trigger? | Simon + Alek | 08-03 |
| 3 | Rev-share: standard band, or Onset-only structure? (commitment #5) | Simon | 08-03 |
| 4 | ~~Ship the register's window columns?~~ **Resolved 07-30** — they stay; the rider grants both windows | — | done |
| 4b | Rider packaging: one combined rider, or the A/B split? | Simon | 07-31 |
| 5 | Vendor surfacing — committed with a date, or out of v1? | Simon | 08-04 |
| 6 | Fix `est_ticket` or remove it from Onset's ranking? | Simon | before handover |
| 7 | Build the international/offshoring signal lane, or state the limitation plainly on 08-04? | Simon | 08-04 |
