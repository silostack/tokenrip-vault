---
contact: Paul Dorasil
company: DECA Dental Group (Ideal Dental)
call_type: firm-direct
status: warm-curious — open door, no buying intent, useful intel source
last_contact: 2026-05-21
---

# Paul Dorasil — DECA Dental Group

## Who / What

Head of Data & AI at DECA Dental Group (Ideal Dental brand). 165+ locations across 8 states (TX-heavy), clinician-equity-partner model. ~3 months in role (joined ~Feb 2026). HQ Dallas, based in Flower Mound, TX.

**Background:** Quantitative economist (UFlorida — undergrad 2004-07, grad 2009-11, later 2020-21) with published empirical econometrics papers. Pivoted via Data Science Dojo bootcamp (2017). Senior data practitioner at Keyot (St. Paul boutique data/agile consultancy, acquired by ThreeBridge 2021). SnowPro certified. Built data platforms at multiple consulting clients before DECA.

**Why he matters to Tokenrip:** Owns the entire data + AI stack at a 165-location DSO — Snowflake instance, Fivetran integrations, AI vendor relationships. One of perhaps ~50 people in the country with this title at a sub-500-location DSO. Authoritative voice on what's possible/impossible in DSO data + AI today.

## Call History

- **2026-05-21**: [[bd/calls/transcripts/paul-dorasil-2026-05-21]] · [[bd/calls/notes/paul-dorasil-2026-05-21]]
  — firm-direct discovery: Confirmed DECA's PMS split (1/3 Eaglesoft, 2/3 Denticon, 153 servers). Mature data infra (Snowflake + Fivetran + Kala API). Pearl (imaging) deployed with ROI; AI call center procurement in next 1-2 months. Three explicit AI priorities: AP automation, RCM, FP&A. Paul handed over a specific product idea unprompted — PMS migration training agent — but **the workflow fails the architectural-requirement test**. Simon did not claim the migration-agent idea on the way out, no concrete next step set.

## Running Intelligence

### DECA's data + AI stack (confirmed)

- **PMS split:** ~1/3 Eaglesoft (~50 offices), ~2/3 Denticon (~115 offices). Legacy data still active from Dentrix Ascend (2 offices) and Open Dental (7 offices).
- **153 servers** with installed connectors per server for Eaglesoft data extraction (Eaglesoft = on-prem, single-office software, never designed for DSO scale).
- **Eaglesoft data quality is bad:** free-text ADA codes, no patient dedup, providers with multiple IDs per role/practice. Paul writing patch logic by pattern.
- **Pipeline:** Eaglesoft → Kala API → Fivetran SDK connector → Snowflake. Kala API also serves veterinary — confirms the "DSO solutions translate to vet/optometry" thesis at the vendor level.
- **Snowflake:** corporate cloud license, Snowflake instance live. Building validated data assets as foundation for downstream consumption.
- **Downstream users:** FP&A team (budgeting/forecasting), marketing team (LTV/segmentation), offices (BI platform — longer-term).
- **AI already deployed:** Pearl (imaging, $100/cap ROI confirmed, conservative model with high concur rate from dentists), Overjet (imaging, prior).
- **AI in active procurement:** "AI call center, DSO-specific, probably in next month or two" — connected directly to PMS. Vendor not named (likely Planet DDS DentalOS Confirmation/Scheduling Agent or comparable — worth following up).

### Paul's stated AI roadmap

| Priority | Status | Notes |
|---|---|---|
| Accounts payable automation | Want to do | "Haven't found good vendors in that space, going to build in house." Considered an opportunity. |
| RCM automation | Want to do | Mentioned as one of three corporate priorities. |
| FP&A automation | In progress | Building this out now. |
| Comprehensive BI platform (offices) | Long-term | Gated on data cleanup. |
| PMS migration training agent | Unprompted idea | His own suggestion — RAG-style knowledge bot for staff during Eaglesoft → Denticon migration. CIO + CEO anxious about transition; 50 office holdouts. |

### Market intel

- **"DSOs are behind healthcare which is behind other industries."** Paul's own framing.
- **"A lot of solutions for DSOs will translate to optometry and veterinarian offices."** Cross-vertical reuse is structural — Kala API, AI call centers, all retool across these three.
- **Industry-wide PMS migration wave:** "It's not just us — a lot of DSOs are migrating from old PMS to new PMS." Eaglesoft → Denticon / Dentrix Ascend is happening across the DSO segment. The training/change-management pain is shared.
- **DSO cloud-PMS resistance:** Even within DECA, ~50 offices resist migrating off Eaglesoft. Disruption + revenue dip is the resistance vector.
- **Build-vs-buy posture:** Default to buy when good vendors exist; build when they don't. AP being built in-house because vendor search failed.

### Architectural-requirement test results (per BD strategy frame)

Per `bd/CLAUDE.md`, every opportunity must pass two tests: (1) requires mounted-agent architecture, (2) buyer has painkiller pain.

| Opportunity | Architecture test | Pain test | Verdict |
|---|---|---|---|
| **PMS migration training agent** | **FAILS** — Paul: "agent doesn't need access to PMS, just needs to be knowledgeable of old + new system." This is RAG over PMS docs. No persistent memory, no portability, no cross-session state required. Any AI shop could deliver. | PASSES — CIO + CEO anxious, 50 office holdouts, revenue dip risk, industry-wide need. | **Consulting trap.** Painkiller pain without architecture-fit. |
| AP automation | PARTIAL — document extraction + workflow. Some persistence (vendor history) but bounded; many adjacent vendors exist (Ramp, Bill.com, Brex, etc.). | PASSES — Paul actively looking. | Likely not architecture-grade. Investigate further. |
| RCM automation | PARTIAL — workflow + persistence helpful, but Zentist / Overjet RCM exist. | PASSES | Crowded. |
| AI call center | N/A — already procuring elsewhere. | DONE | Not available. |

**Aggregate read:** Paul's pain is real, but the workflows where he has pain don't structurally require Tokenrip's architecture. Direct evidence for the May 22 hard comparison.

## Relationship / Pipeline State

**Warm-curious, no buying intent.** Paul engaged generously, shared deep technical detail, made one concrete product suggestion. He's a builder by instinct ("we're going to end up building in house"). No follow-up scheduled. No expectation of materials from Tokenrip. Open door for return contact.

**Stage:** Pre-discovery. Not in pipeline. Would re-engage if a Tokenrip offering matched one of his three corporate priorities (AP / RCM / FP&A) or his unprompted suggestion (PMS migration helper).

**Authority:** Owns data + AI strategy. CIO and CEO are above him for big procurement / migration decisions (referenced both as the people he'd "take this to").

**Decision gates inferred:** CIO + CEO for migration-related tooling. Paul appears to have buying authority for data-stack tooling at the layer he owns.

## Open Commitments

| # | Action | Owner | Due | Status |
|---|--------|-------|-----|--------|
| 1 | Send follow-up thank you note | Simon | 2026-05-22 | Pending (inferred — not committed on call) |
| 2 | Decide whether to follow up on PMS-migration-agent idea — apply architecture filter before pursuing | Simon | 2026-05-22 (May 22 comparison day) | Pending |
| 3 | Investigate which AI call center vendor DECA is adopting (likely Planet DDS DentalOS or similar — worth knowing) | Simon | 2026-05-26 (inferred) | Pending |
