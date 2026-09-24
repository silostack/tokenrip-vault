---
title: Quintel — Deal Packaging (Product Requirements for Engineering)
status: active
owner: Simon
type: product-requirements
product: Quintel
created: 2026-07-05
updated: 2026-07-05
related:
  - active/ef-course/04-life-of-a-deal.html
  - bd/deals/equipment-finance/stauss-vfi-tokenrip-briefing.md
  - bd/calls/transcripts/scott-rumble-2026-06-25.md
  - bd/calls/transcripts/ted-craver-2026-06-01.md
  - bd/deals/empire/quintel-empire-redacted-deal-run-scope-2026-06-19.md
  - intelligence/research/quintel/research-aloan-ai-competitive-analysis-2026-06-18.md
  - product/quintel/quintel-customer-data-first-prd-2026-06-29.md
  - product/quintel/engineering/quintel-lender-build-roadmap-2026-06-10.md
  - product/quintel/engineering/quintel-engine-build-roadmap-2026-06-09.md
source_material: >
  Bevel Financial's actual pre-flight memo (Mardi Enterprise, LLC — EZ, dated 2026-05-16); Scott
  Rumble and Ted Craver discovery-call transcripts; the equipment-finance course's "life of a deal"
  module (active/ef-course/04-life-of-a-deal.html); external research on commercial-lending
  submission-package conventions, the 5 C's of credit, IC memo structure, and lender-side AI
  underwriting tooling (Aloan, F2.ai) — links in §11.
---

# Quintel — Deal Packaging (Product Requirements for Engineering)

> **Read this document with no other context.** It explains what a "deal package" is in equipment finance, why it exists, who touches it and what each of them needs from it, what a real one actually contains, and what that means Quintel needs to build. It is a **business-requirements document**, not an implementation spec — engineering should be able to design the actual build from it, but the sections below describe *what's needed and why*, not *how to code it*.

## 1. The one-line finding

A **deal package** is the structured file that turns a raw pile of borrower documents into something a credit team can decide on and a lender can act on. Every equipment-finance transaction produces one, in some form, regardless of who's building it — a direct lender's internal credit team, a broker pitching an external lender, or a dealer's captive finance desk. **The content is nearly identical across all of them; what differs is who's reading it and what they do next.** Quintel should build **one packaging capability** — extract, structure, assemble, render — configurable by depth and audience, not a separate product per role.

---

## 2. Where packaging sits in the life of a deal

Every equipment-finance deal — a $50K truck or a $50M fleet — moves through the same arc: someone finds it, someone offers rough terms, someone decides whether to fund it, someone papers it, someone wires the money, someone watches it for years, and eventually someone winds it down. (Full detail: `active/ef-course/04-life-of-a-deal.html`.) A real direct lender's (VFI's) formal version of that arc names nine stages with an explicit owner and gate for each:

| # | Stage | Owner | Advances when |
|---|---|---|---|
| 1 | Prospecting | BDO (sales) | A qualified financing need that fits the lender's box |
| 2 | Opportunity Created | BDO | Enough in hand to structure and price |
| 3 | Issue Term Sheet | BDO + Structuring | Borrower signs the (non-binding) term sheet |
| **4** | **Submit for Underwriting & Credit Decision** | **Credit** | **Approve with conditions, counter, or decline** |
| 5 | Prepare Documentation | Documentation | Complete, accurate legal package ready to execute |
| 6 | Prepare Authorizations to Fund | Funding | All conditions precedent met |
| ★ | Funded — Closed-Won | — | Capital disbursed |
| 7-9 | Base Term → End of Term → Maturity Closeout | Servicing | Years of monitoring, then wind-down |

**Deal packaging is the work that produces the artifact consumed at stage 4** — the credit team cannot decide on a raw folder of tax returns and invoices; someone has to classify, extract, spread, and narrate it into a decision-ready document first. That work also **bleeds into the stages on either side**: stage 3 (the term sheet) needs a first-pass read of the same documents to price roughly, and stage 5 (legal documentation) reuses the same borrower/entity/collateral facts the package already extracted. So packaging isn't a single-stage feature — it's the data-and-narrative backbone that stages 3 through 5 all draw from, with stage 4 as its primary deliverable.

**This is explicitly a forward-looking, generative capability** — new raw documents in, a decision-ready package out — as distinct from Quintel's existing "funded credit memo" concept (`quintel-customer-data-first-prd-2026-06-29.md` §9), which is a *backward-looking* capability: ingesting a customer's *already-funded, historical* memos to train their private ranking model. Packaging and that ingestion pipeline will share extraction machinery (see §8), but they solve different problems and run in opposite directions.

**Quintel's own engine already has a name for the relevant stages.** The lender-build roadmap defines the engine spine as `ingest → structure → decide → match → review → capture`. Packaging, as described in this document, is the work of `ingest` (classify, dedup, flag missing docs) + `structure` (spread the financials, extract collateral detail) + `review` (assemble the narrative and render the package). **`decide`** (the fund/marginal/pass verdict + indicative pricing) **and `match`** (routing to the right lender) are separate, downstream capabilities that *consume* a package's structured output — this document is about producing that output, not about the judgment layer that reads it.

---

## 3. What a deal actually is (context for anyone new to equipment finance)

A business needs equipment — a fleet of cranes, a CNC machine, medical imaging hardware — and doesn't want to (or can't) pay cash. A lender or lessor finances it, secured by the equipment itself (and often a personal guarantee from the owner). The lender is exposed for years, so before funding it needs to know: can this borrower pay, is the collateral worth what's claimed, and what happens if they can't pay. Answering that question is underwriting; **assembling everything underwriting needs to answer it is packaging.**

The raw inputs, regardless of who originates the deal:

- **Entity documents** — formation docs, EIN, good-standing
- **Identity documents** — driver's license(s) for signers/guarantors
- **Financial statements** — 2-3 years of business tax returns or financials, YTD P&L/balance sheet, business bank statements (recent months)
- **Personal financial statement (PFS)** — assets/liabilities/net worth for any personal guarantor, usually with 2-3 years of personal tax returns
- **Equipment/collateral detail** — invoice or quote: make, model, serial number, cost
- **Debt schedule** — the borrower's existing obligations
- **The ask** — amount, term, structure (loan / lease / EFA / TRAC / sale-leaseback), intended use

Nothing here is equipment-finance-specific plumbing — it's the same handful of document types across every shop in the industry. What's specific to EF is what happens to them next.

---

## 4. Who touches a package, and what each wants from it

This is the core of the business requirement: **the same underlying data serves several different readers, each with a different question.** Getting this wrong (building for only one reader) is the single most likely way to under-scope the feature.

### 4.1 The originator — the person who found the deal (BDO, broker, dealer-desk rep)
Wants the package **assembled fast**, so they can move to the next deal rather than spend hours retyping documents into a template. This is squarely a time-savings ask, not a judgment ask.

- **Scott Rumble** (independent Australian broker, discovery call 2026-06-25 — `bd/calls/transcripts/scott-rumble-2026-06-25.md`): wants an agent to extract from raw documents (driver's licenses, financials, entity info) dumped in Dropbox or emailed with attachments, and fill his firm's standard submission template — **"80% of the way there," ready to plug into a lender's portal.** Explicit and important: he does **not** want the system choosing the lender — "we know exactly where it's going and why" — lender selection is his firm's proprietary edge, and he was emphatic that packaging and lender-choice are two separate things. For his shape of customer, any lender-matching module must be **off by default**.
- **Ted Craver** (Bevel, revenue/sales lead, discovery call 2026-06-01 — `bd/calls/transcripts/ted-craver-2026-06-01.md`): wants the inverse — underwrite → **also rank against Bevel's lender panel** using credit-fit *and* realized-outcome/relationship history (which lender actually says yes, at what price, for this kind of deal) → draft the placement correspondence. For his shape of customer, matching is **on**, and it's the second-most-valuable piece after the extraction itself.
- Also raised, unprompted, by Ted: **PII handling.** He spent 20 years in banking and immediately asked how an agent handles Social Security numbers and similarly sensitive data across a stack of files. Any packaging build needs a clear, statable answer (compliant model plans / local models / architecture-level controls) before this reader will trust it with real files.

### 4.2 The internal credit/underwriting team (direct lender — Empire, eventually VFI)
Wants a package that lets them **decide without redoing the work** — a decision-ready document, not raw materials. This reader cares about completeness and defensibility (can this hold up if a regulator or auditor asks how the decision was made), not speed of assembly per se.

- Formal narrative organized around the 5 C's of credit (Character, Capacity, Capital, Collateral, Conditions — see §6), each with cited source data
- A clear recommendation, or the components needed to reach one
- No PII exposure beyond what's necessary — an internal-only view can retain full PFS detail; anything leaving the building (see 4.3) may need to be handled differently

### 4.3 The external lender receiving a broker-placed package (Bevel's, Scott's, or a placement firm's counterparty)
A different reader from 4.2, even though the document looks similar: this reader is **not** the same organization that assembled it, has **their own credit box**, and increasingly runs their **own AI intake tooling**.

- Quintel's own competitive research on lender-side AI underwriting tools (Aloan, F2.ai — `intelligence/research/quintel/research-aloan-ai-competitive-analysis-2026-06-18.md`) found these products converging on `documents → extraction → spreading → memo`, and recommended Quintel's output be **"AI-ingestible"** — structured data plus source-cited PDFs, not a narrative-only email — so a broker's outbound package processes frictionlessly on the receiving lender's side. This is a real, evidenced requirement, not a guess: it's the literal handoff point between two categories of tooling that are both getting built right now.
- This reader also cares about **broker commission disclosure** (present in Bevel's example — see §5) and about the package matching *their* box, not the originator's — which is why the matching/routing step (4.1, Ted's version) exists: to select and format for the *right* external reader before the package ever leaves the originating firm.

### 4.4 The documentation / legal team (downstream, stage 5)
Doesn't read the package's narrative, but **reuses its extracted facts** — borrower legal name and entity detail, guarantor identity, collateral description — when drafting the actual financing contracts. Not a driver of the packaging feature's design, but a reason the underlying data should be captured as **structured fields**, not just prose, from the start.

---

## 5. A real example, walked through: Bevel's pre-flight memo

Bevel Financial supplied an actual, complete package (Mardi Enterprise, LLC — EZ, dated 2026-05-16), prepared for external lender submission. Its structure, in order:

| Section | Contents | Who reads this section |
|---|---|---|
| Deal snapshot | Borrower entity, formation date/state, signer, guarantor(s) + address | Everyone — the identity anchor |
| Proposed structure | Financing amount, total equipment cost, term/amortization, **broker commission** (1.25% of financed amount, disclosed), collateral type + loan-to-cost (LTC) | External lender (4.3) — comp disclosure is a broker-specific, external-facing requirement |
| Purpose narrative | Prose: what's being financed, why, the third-party program the borrower is enrolling in | All readers — "the story behind the deal," repeatedly cited in industry sources as the single most consequential piece of a submission |
| Program/sponsor writeup | A half-page on the third-party equipment-management program operator (scale, contract structure, track record) | External lender — present *because* this specific deal routes through a third-party program, not universal |
| Proforma / deal economics | Gross rental income → cash available for debt service (CAFDS) → debt service → debt-service-coverage ratio (DSCR) | Credit team (4.2), external lender (4.3) |
| Residual/collateral value forecast | Loan balance vs. auction vs. retail value at 12-month intervals across the full term | Credit team, external lender — asset-heavy equipment collateral specifically |
| Personal financial information | Guarantor bios, personal financial statement (PFS) summary (assets/liabilities/net worth) | Credit team, external lender |
| Global cash flow | 3-year tax-return trend, entity-level CAFDS, Global DSCR/DTI/CAADS, full debt-service stack, reconciliation of "other income" back to its source schedule | Credit team, external lender |
| Supporting schedule (rent roll) | Property-by-property tenant/rent detail supporting the "other income" figure | Credit team, external lender |
| Underwriter comments | **Strengths** and **Mitigating Factors**, organized under the five C's | Credit team, external lender — this is the recommendation |
| Document index | Linked list of source documents (application, LLC docs, driver's license, PFS, 3 years of tax returns, liquidity statements) | Documentation team (4.4), auditors |
| Appendix schedules | Cash/savings by institution, real estate owned (by lender/rate/balance/value), retirement accounts, other assets, other loans payable | Credit team, documentation team |

**A naming note, so no one mis-generalizes from it.** "Pre-flight" sounds like it should mean the lightweight, 1-2 page go/no-go check done *before* full underwriting — the thing the wider industry calls a "screening memo," "quick look," or "indicative approval" (see §6). It doesn't. The actual document above is a **complete, committee-ready package** — full 5-C's narrative, three years of global cash flow, PFS schedules, a document index. Best read (inferred, not confirmed — no other usage of "pre-flight memo" turned up in research): Bevel means "before it flies out the door to the lender," i.e. pre-*submission*, not pre-*underwriting*. Treat it as Bevel's house term, not an industry standard.

---

## 6. The generic industry vocabulary and maturity ladder

Outside Bevel's own naming, commercial/equipment lending recognizes a real three-stage depth ladder for the same underlying content — useful because it's the config axis Quintel's packaging output needs (§8):

1. **Screening / preliminary underwriting / "quick look" / triage.** A 1-2 page test of headline metrics (DSCR, leverage, collateral sufficiency) against the credit box, ending in go/no-go to advance to full underwriting. Explicitly limited to surface-level data — won't catch fraud or legal complications.
2. **Full underwriting / credit memo.** The formal analysis: the 5 C's, each documented with evidence, financials spread over 3-5 years, DSCR/LTV/LTC calculated, strengths and mitigants stated, ending in a recommendation. **This is what Bevel's "pre-flight memo" actually is.**
3. **Investment/credit committee (IC) memo.** Adds a decision layer on top: executive summary, deal rationale, sources & uses, formal risk analysis with a mitigant per risk, and an explicit recommendation the committee votes on (approve/decline/table). More common in direct-lender/institutional and CRE contexts than broker-placed equipment deals.

**The 5 C's**, referenced throughout: **Character** (repayment history/reliability), **Capacity** (cash flow's ability to service the debt — DSCR), **Capital** (liquidity/net worth as a cushion), **Collateral** (asset value and loan-to-value/loan-to-cost), **Conditions** (deal terms, structure, and external/economic context).

Separately, the **document checklist** for a submission scales with deal size, independent of narrative depth: sub-$400K deals need a credit application, 3 months of bank statements, and an equipment proposal; $400K+ (or under 2 years in business) adds a personal financial statement, 2 years of tax returns, YTD financials, and a business debt schedule. Universal regardless of size: a signed credit application (for credit-pull authorization), the equipment invoice (collateral verification), and the transaction write-up.

---

## 7. The canonical content schema (what Quintel's output needs to cover)

**Universal — present in every package regardless of who's reading it:**

| Section | Raw inputs it's built from |
|---|---|
| Deal snapshot (borrower, guarantors, entity formation) | Application, entity docs, driver's license |
| Proposed structure & terms (amount, term, rate/structure) | Application, equipment invoice/proposal |
| Purpose / transaction write-up | Application narrative, originator input |
| Collateral / equipment detail | Equipment invoice (make, model, serial, cost) |
| Financial spread — entity + personal/global | Tax returns (2-3 yrs), financial statements, bank statements |
| Credit analysis — the 5 C's, with strengths + mitigants | Derived from the spread + collateral data + credit-pull |
| Supporting document index | All of the above, as an exhibit list |

**Role-conditional — attached based on who's reading and why:**

| Section | Appears when |
|---|---|
| Broker commission / comp disclosure | Broker- or placement-firm-originated deals (4.1, 4.3) |
| Lender-matching / routing recommendation | Placement firms, dealer desks — **off** when the originator reserves lender choice (Scott's case, 4.1) |
| Program/sponsor writeup | Deals routing through a third-party managed program |
| Residual/collateral-value forecast | Asset-heavy equipment where residual risk is material |
| Full PFS + schedules | Whenever a personal guarantee is required |
| Secondary-income schedule (e.g. rent roll) | Whenever "other income" needs line-item support |
| Formal risk rating + committee recommendation/vote | Institutional direct-lender, committee-depth context (4.2) |

**Depth axis (the same schema, different completeness — this should be a Quintel config, not three products):**
- **Screening depth** — snapshot + terms + headline DSCR/leverage/collateral + go/no-go. No full spread, no appendix.
- **Full package depth** — everything in the universal table, fully populated. This is what Bevel's memo actually is, and the depth this feature should target first.
- **Committee depth** — full package plus formal risk rating and an explicit recommendation/vote section.

---

## 8. Requirements for engineering

**Inputs the system must accept:** entity/formation docs, government ID, 2-3 years business + personal tax returns, YTD P&L/balance sheet, recent bank statements, personal financial statement, equipment invoice/quote, existing debt schedule — arriving as email attachments, a folder dump (Scott's Dropbox pattern), or a portal upload.

**Processing, mapped onto the existing engine spine (`ingest → structure → decide → match → review → capture`):**
- `ingest` — classify each document by type, flag what's missing against the depth-appropriate checklist (§6), dedupe, screen out non-deals.
- `structure` — spread the financials (entity + personal/global), extract collateral detail, reconcile the debt schedule, pull the numbers needed for DSCR/LTC/leverage.
- `review` — assemble the narrative (5 C's — strengths and mitigants, source-cited to the originating document) and render the package artifact.
- `decide` and `match` are **not** in scope for this feature — they are the separate judgment/routing capabilities (already scoped elsewhere, e.g. the lender roadmap's fund/marginal/pass verdict) that consume this feature's structured output as their input.

**Output requirements:**
- A rendered, human-readable package (the §7 schema, at the configured depth) — hosted at a stable URL, per Tokenrip's existing artifact primitive, so it can be shared the way Bevel's PDF is shared today.
- The same content available as **structured data**, source-cited per field back to the originating document — both because Quintel's own `decide`/`match`/`capture` stages need it structured, and because external lender-side tooling (Aloan-style) is converging on exactly this ingestion shape (§4.3). Narrative-only, unstructured output under-serves both audiences.

**Configuration axes (this is what makes it one feature, not three):**
1. **Depth** — screening / full package / committee (§7).
2. **Matching module** — on or off. Must default per customer shape, not globally: off for an originator who reserves lender choice (Scott), on for one who wants routing (Ted).
3. **Audience template** — internal-credit-team framing vs. external-lender-facing framing (commission disclosure, program writeups) — thin, cosmetic differences on top of the same schema, not a forked pipeline.

**Reuse note:** the extraction primitives here (document classification, spreading, collateral/debt reconciliation) are the same ones the PRD's *historical* credit-memo ingestion pipeline needs (§9 of the customer-data-first PRD) to build a customer's private ranking model. Build one base extractor; packaging (forward, new deal) and ingestion (backward, training data) are two consumers of it, not two separate builds.

---

## 9. Load-bearing gaps (rank-ordered — what would break this if wrong)

1. **No direct-lender-side example yet.** The institutional/committee-depth layer (§6 point 3, §7's "committee depth") is inferred from generic IC-memo research, not an actual VFI or Empire internal memo. Empire's redacted-deal-run deliverable (`bd/deals/empire/quintel-empire-redacted-deal-run-scope-2026-06-19.md`) is the nearest live source that could confirm or correct it — check against it before hard-coding a committee-depth template.
2. **Stauss's promised VFI deal-lifecycle spec never arrived** (flagged lapsed in the briefing as of 2026-06-24). VFI's actual packaging process — the original source of the "packaging" pain point — remains unconfirmed; this document is built from Bevel + Scott + Ted + generic research, not from VFI.
3. **The matching module's default state is customer-dependent, not universal**, and this framework already caught one place it could be gotten wrong: Scott explicitly rejects lender-choice automation while Ted explicitly wants it. Any build must make matching an opt-in module, not a bundled default.
4. **"Pre-flight" naming is a one-example inference** (§5) — high confidence it's Bevel-specific, not industry-standard, but still n=1.

---

## 10. References

**Internal (vault) sources this document draws on:**
- `active/ef-course/04-life-of-a-deal.html` — the ten-stage generic deal lifecycle + VFI's real nine-stage process; the frame §2 maps packaging onto.
- `bd/calls/transcripts/scott-rumble-2026-06-25.md` — the "80% assembled, don't choose my lender" requirement (§4.1).
- `bd/calls/transcripts/ted-craver-2026-06-01.md` — the "underwrite → match → draft" requirement + the PII/compliance question (§4.1).
- `bd/deals/equipment-finance/stauss-vfi-tokenrip-briefing.md` — origin of "packaging" as Stauss's named pain point; §8's thin-underwriting-slice recommendation this feature realizes.
- `bd/deals/empire/quintel-empire-redacted-deal-run-scope-2026-06-19.md` — the engine's existing "Package" render step; the nearest live source for a direct-lender-side example.
- `intelligence/research/quintel/research-aloan-ai-competitive-analysis-2026-06-18.md` — the AI-ingestible output requirement (§4.3).
- `product/quintel/quintel-customer-data-first-prd-2026-06-29.md` §9 — the historical credit-memo *ingestion* concept this document's *generation* concept mirrors and shares extraction machinery with.
- `product/quintel/engineering/quintel-lender-build-roadmap-2026-06-10.md` — the `ingest → structure → decide → match → review → capture` engine spine this document maps packaging onto.

**External references (research on submission-package/credit-memo conventions):**
- [Rubicon First Ascent LP — Investment Committee Memorandum](https://sers.pa.gov/pdf/Investments/Investment%20Materials/Rubicon-Point-Partners_Fund_Internal_Memo.pdf) — a real, publicly filed IC memo (PA state pension system). 4 pages: Recommendation → Overview → Investment Thesis → Investment Risk & Mitigants (a risk/mitigant table, structurally similar to Bevel's Strengths/Mitigating Factors) → Portfolio Risk → Portfolio Implications → Management Team. Fund-manager allocation, not a single equipment deal, but the clearest real, public example of what a committee actually reads before voting.
- [SBA SOP 50 10 6, Part 2 §B Ch.1](https://www.partneresi.com/wp-content/uploads/2023/05/SBA-SOP-50-10-06.pdf), pp. 246-257 — the SBA's own regulatory spec for what a "Lender's Credit Memorandum" must document for a 7(a) loan: business history/management, 3-year financial spread, EBITDA/OCF, DSCR ≥1.15, pro-forma balance sheet, collateral adequacy with specific haircuts, equity injection rules, lender's written rationale. The most precise line-by-line "what must be in the memo" checklist found in this research.
- [Windsor Advantage — Key Credit Memo Elements for SBA Loans](https://windsoradvantage.com/news/sba-credit-memo-guidelines) — condensed practitioner version of the SBA structure: credit-elsewhere test, ratios, pro-forma balance sheet, collateral, equity injection, refinance justification, review of assumptions.
- [AtlasX — IC Memo for Real Estate guide](https://atlasx.co/guides-and-resources/investment-committee-memo-for-real-estate-guide) — a 12-component generic IC-memo skeleton (Exec Summary, Property Description, Market Analysis, Business Plan, Sponsorship/Track Record, Deal Structure, Financial Projections, Sources & Uses, Risk Assessment, Investment Rationale, Exit Strategy, Recommendation) with format guidance (8-15 pages, charts/tables/photos).
- [BSB Leasing — Mastering Mid-Market Equipment Financing: A Broker's Guide](https://www.bsbleasing.com/post/mastering-mid-market-equipment-financing-a-broker-s-guide) — EF-specific, practitioner-written. Names the "transaction write-up" as the single highest-value piece of a broker submission and gives the size-tiered document checklist used in §6.
- [Aloan.ai — Best AI Equipment Finance Software guide](https://aloan.ai/guides/best-ai-equipment-finance-software) — a lender-side AI-underwriting vendor's own description of the pipeline: classify → spread → collateral/residual extraction → debt reconciliation → memo assembly, each stage source-cited for examiner defensibility. The closest external analog to this document's §8 processing model.
- [F2.ai — What Is Preliminary Underwriting?](https://www.f2.ai/glossary/what-is-preliminary-underwriting) — confirms the generic screening/triage/quick-look vocabulary and process (teaser in → spread against credit-box → go/no-go) referenced in §6.
- [Carr, Riggs & Ingram — Credit Memo Best Practices and "The 5 C's"](https://www.criadv.com/insight/credit-memo-best-practices/) — a plain-language definition of the 5 C's framework Bevel's underwriter-comments section visibly follows.

**A caution for anyone searching further:** most web results for "credit memo template" are the *accounting* credit memo — a refund/credit note issued against an invoice — and are unrelated to the loan-underwriting document described here. Template marketplaces (Template.net, pdfFiller, CocoDoc, examples.com) are dominated by that other meaning; filter them out.
