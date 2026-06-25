---
title: "Feasibility Study — Canada-Native Quintel (Broker Side) + Validation of the 'Screening Junk' Pain Assumption"
status: draft
owner: Simon
type: feasibility-study
product: Quintel
created: 2026-06-23
sources_doc: active/research-ef-canada-vs-us-platform-2026-06-19.md
gameplan_doc: active/quintel-broker-first-gameplan-2026-06-08.md
note: "Desk research (web) on the Canadian equipment-finance broker workflow. Validates/refutes the gameplan's core pain assumption and sizes the broker-side build delta. Does NOT override the parked strategic verdict (don't build Canada off zero revenue) — it informs the build IF that decision ever activates."
---

# Feasibility — Canada-Native Quintel (Broker Side)

## Bottom line (two verdicts)

**1. The build is feasible and meaningfully *lighter* than the full-platform fork — but "it's just different math" is only ~60% right.** Most of the deep Canada rebuilds flagged in the research doc (Quebec hypothec/RDPRM, court-gated repossession, the CCA tax-depreciation engine, lease-contract generation) are **lender-side and sit OFF the broker's critical path.** The broker engine — `ingest → screen → structure/package → match → submit → track` — forks mostly at **[reconfigure]** depth, not **[rebuild]**. Correct the framing to: *different math + different data plumbing + a different matching engine.* The matching engine is the one piece that is not "math" and not trivial.

**2. The gameplan's load-bearing assumption — "screening junk is the #1 broker pain" — FAILS for Canada.** Canadian broker deal flow is **adverse-selected**: banks take prime deals direct, so brokers live downstream of bank declines (~35% of small-business bank applications are declined), serving the non-prime / niche / story-credit residual. That inverts the bottleneck. The Canadian broker's #1 pain is **placement-fit + structuring/packaging the already-hard file to a specific lender's box ("underwriter-translation")**, not first-pass junk screening. **A faithful port of the US screen-first wedge would efficiently solve the wrong problem.**

The two verdicts compound: the *good* news (broker-side build is light) is undercut by the *important* news (the US wedge lands on the wrong pain in Canada). Feasible to build ≠ the right thing to build.

---

## Part A — Does "screening junk = #1 pain" hold in Canada? (No.)

### Why screening *is* plausibly #1 in the US (the assumption's real basis)
The US gameplan sourced the assumption from two US brokers describing screening verbatim ("score each deal 1–10, a 3 or less don't waste your time; auto-read three months of bank statements to screen the obvious no-gos"). That holds **because of US market structure**: a deep independent/fintech lender tier (≈150+ funders reachable, brokers "reach 20+ funders simultaneously") plus **raw, unfiltered inbound** from dealers/vendors. When placement is easy (deep bench) and inbound is raw, the bottleneck is the *front door* — screening volume. The US assumption is probably correct for the US.

### Why Canada inverts it
Two structural facts from the research doc + this research flip the bottleneck:

1. **Adverse-selected deal flow.** Banks (~42–75% of the market depending on basis) take prime origination **direct**. What reaches the Canadian broker is the residual: bank-declined, non-prime, niche, used-asset, or "story" files. The junk is partly *pre-filtered upstream* — the broker isn't the first screen, the bank was. Canadian broker content describes the job as starting *after* "your bank said no… it means your file doesn't fit that bank's risk box today."
2. **A thin, idiosyncratic lender bench.** Far fewer lenders, each with specific appetite. The hard problem isn't "is this deal junk" — it's "which of my handful of lenders will fund *this specific declined file*, and how do I package it so they say yes."

### The Canadian broker's actual #1 pain (the replacement thesis)
Convergent across multiple Canadian-broker sources: the time-sink and the failure mode is **structuring + packaging to lender-fit ("underwriter-translation"), then placement into a thin idiosyncratic bench** — not screening. Representative findings:

- *"Files die on documentation, structure, and lender-fit."*
- The broker is *"part advisor, part deal architect, part underwriter-translator, part project manager… help businesses choose the right structure, package files so lenders can say yes faster, work through conditions."*
- *"A lender panel won't save you… you'll burn relationships by submitting messy files. A huge portion of broker skill is simply submitting what underwriters require — cleanly and consistently."*
- The placement move is to *"match the asset type to lenders who actually like that collateral"* and *"rebuild the file narrative (what the equipment does for cash flow)."*

So the wedge that "two independent US brokers described unprompted" (screen + score) is **not** the wedge a Canadian broker would describe unprompted. A Canadian broker would describe: *"take my bank-declined file, tell me how to structure and package it, and which of my lenders will actually fund it."*

### Confidence
**Medium-high, directional.** This is desk research dominated by one rich Canadian-broker content source (Mehmi Financial Group's blog corpus) plus corroborating broker/lender pages (Swoop CA, equiplea, Stan Prokop/Medium, CEFL). It is **not** primary broker interviews. The thesis is structurally over-determined (adverse selection + thin bench both push the same direction), which raises confidence — but the **cheapest confirmation is one conversation with one named Canadian broker** (Debra Silas / Questor Financial is the obvious candidate). Until then, treat "screening is not the Canadian #1" as a strong hypothesis, not a settled fact.

---

## Part B — Broker-side build delta (the fork-by-fork feasibility)

Mapping the research doc's six forks onto the **broker critical path only** (`ingest → screen → structure/package → match → submit → track`). Key question per fork: does it hit the broker path, and at what depth?

| Fork (from research doc) | On broker critical path? | Depth for broker | Why |
|---|---|---|---|
| **1. Bank-dominated, thin bench + FINTRAC** | **Yes — core (`match`)** | **[reconfigure] + new compliance** | The matching engine's panel/appetite model changes (thin, idiosyncratic, bank-shadowed). FINTRAC now **applies to brokers too** (KYC/ID/consent) — a genuinely new module, but bounded. |
| **2. PPSA + Quebec lien law / fraud** | Partial | [reconfigure] *if* lien-check offered | Broker may run a PPSA/serial search to flag killer liens during structuring; **perfection is the lender's job**, so the heavy 3-regime perfection logic is off-path. |
| **3. Quebec civil law + French** | Mostly OFF-path | **Contained: French UI only** | No hypothec-deed generation, no repossession workflow on the broker path. The only broker-side cost is a **French UI/templates** *if* Quebec brokers are in scope. |
| **4. Tax / CCA depreciation engine** | Light | [reconfigure] indicative only | Broker outputs an **indicative** rate-term band + structure recommendation, not a full CCA optimization. Needs Canadian structure norms + which-lender-likes-which, not a tax-computation engine. |
| **5. Credit bureaus / CRA docs** | **Yes (`ingest`/`screen`)** | **[reconfigure] data adapters** | Swap Experian → Equifax Canada / TransUnion Canada / **PayNet Canada**; SIN handling under PIPEDA; parse **T2 (not 1120)** returns, GST/HST docs. Plumbing, not logic. |
| **6. Underwriting conservatism / residuals** | **Yes (`screen`/indicative price)** | [reconfigure] scoring config | Canadian scoring thresholds, red-flags, residual assumptions differ. This is the genuine "different math." |

**Headline:** every fork that hits the broker path is **[reconfigure]**, not **[rebuild]**. The three things that make the *full* Canada platform a "second product" — Quebec hypothec/RDPRM, court-gated repossession, the CCA tax engine, contract generation — are **lender-side and off the broker critical path.** So a Canada-native *broker* MVP is closer to the research doc's "shared engine + adapters" optimistic read than to its "second product" pessimistic read.

**The two real build challenges (not "math"):**
1. **The matching engine is the core *and* the most market-structure-exposed.** It must model a thin, idiosyncratic, bank-shadowed bench with per-lender appetite — and in a small-N market a seasoned broker often *already knows* their handful of lenders, which weakens the naive "which lender?" value prop (see Part C).
2. **FINTRAC-for-brokers is a new, bounded compliance module** (KYC/ID/consent/recordkeeping) the US build doesn't have. Plus a **contained French-UI add** iff Quebec brokers are targeted.

**Rough effort sizing (broker MVP, common-law provinces, defer Quebec):** the build is dominated by *adapter* work (credit-data integrations, T2/GST doc parsing, Canadian scoring/structure config, a reconfigured matching panel + FINTRAC KYC) on top of the existing US engine — **weeks-to-low-months of reconfiguration, not a ground-up rebuild** — *provided* the Deal Object already carries the `jurisdiction` discriminator the research doc recommends. Quebec, if added, is the one item that escalates from reconfigure to a real sub-build; deferring it keeps the MVP light (at the cost of ceding ~a quarter of the country and the most-defensible bilingual segment).

---

## Part C — What this means for the wedge (the so-what)

1. **Re-point the wedge.** A Canada-native broker Quintel should **lead with structuring/packaging-to-lender-fit + placement** ("take my bank-declined file → structure it → tell me which of my lenders funds it → package to their spec"), with **screening as a supporting feature**, not the hero. The US order (screen first, match second) is inverted for Canada.

2. **Sharpen past "which lender."** Because the Canadian bench is thin and *knowable*, "tell me which lender" is weaker than in the US's 150-funder maze — an established broker often already knows. The harder, more valuable problem is **"package/structure this declined file so that lender says yes"** (the underwriter-translation). That, not panel-matching, is the defensible Canadian wedge — and it leans on encoded *structuring judgment*, which is exactly the imprint/moat material the broader Quintel thesis already prizes.

3. **Mind the commodity floor.** Submission + multi-lender CRM + status tracking is **already served** in Canada (Centrex, Leasepath, SOFT4Leasing, eOriginal). Quintel cannot differentiate on "submit to lenders and track." The differentiator has to be the **intelligence layer** (structure/package-to-fit + indicative decisioning on an adverse-selected file) sitting on top of — or replacing — that commodity plumbing.

---

## Open questions / what would change the verdict

- **Primary-source confirmation (highest value, cheapest):** does a real Canadian broker (Debra / Questor) confirm placement-fit/structuring as the #1 pain over screening? One call settles Part A.
- **Established vs. new brokers:** much of the source content advises *new* brokers (start with one anchor funder). Does the placement-fit pain hold for the 2–10-person *established* shops that are the ICP? (Likely yes — "package to underwriter spec" is panel-size-independent — but worth checking.)
- **Quebec in or out of MVP:** the single biggest scope lever on the broker build. Out = light/fast, cedes a quarter of the market; in = the one real sub-build.
- **Does re-pointing the wedge change the US product too?** If "structure/package-to-lender-fit" is the stronger hero even in the US (and the US gameplan already pairs match with screen), this research may argue for elevating structuring intelligence in the core engine regardless of country.

**Scope note:** this study covers broker-side feasibility + the pain assumption only. It does not re-open the parked strategic verdict (don't fork into Canada off zero revenue). It says: *if* Canada activates, the broker-side build is the cheapest entry **and** the wedge must be re-pointed from screening to structuring/placement before a line is built.

---

### Sources (desk research, 2026-06-23)
Mehmi Financial Group blog corpus (Canadian EF broker workflow, subprime/bank-decline, becoming/starting a brokerage, lender-panel discipline, CLFP); Swoop CA (equipment finance brokers); equiplea (broker special rates / lender relationships); Stan Prokop / Medium (Canadian commercial loan broker solutions); CEFL.ca; broker software vendors (Centrex, Leasepath, SOFT4Leasing, eOriginal). Plus the parent research brief `research-ef-canada-vs-us-platform-2026-06-19.md` for the six structural forks. *Caveat: heavy reliance on one dominant content source (Mehmi); confirm with a primary Canadian-broker conversation before betting the wedge on it.*
