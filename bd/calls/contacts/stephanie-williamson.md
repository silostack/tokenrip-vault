---
contact: Stephanie Williamson
company: AICAP Access
call_type: firm-direct
status: warm — scope reopened; discovery-first; proposal shelved pending integration feasibility
last_contact: 2026-05-30
---

# Stephanie Williamson — AICAP Access

## Who / What

CPCS-certified credentialing and privileging operations leader with 20+ years in hospital credentialing. Founder of AICAP Access (AI Credentialing Augmentation and Privileging) — a stealth-stage healthcare startup building pre-intake intelligence for medical staff credentialing. Day job at a regional health system (currently Vanderbilt University context, where she cited the $22K/day-per-applicant pain number).

**Buyer-turned-founder.** She is exactly the persona AICAP would sell to. She has the problem mapped end-to-end because she's lived it for two decades. Non-technical — has been meeting with engineers for months and not found the right one, built her MVP herself on Replit out of impatience.

**Why she matters to Tokenrip:**
1. *Lighthouse-fit prospect.* Architecture maps almost one-to-one onto Tokenrip's mounted-agent substrate (multi-format document intake, cross-document inconsistency detection, deterministic + AI hybrid, human-in-the-loop, audit trails). She'd be the first named vertical deploy in regulated healthcare.
2. *Painkiller with quantified ROI.* Each accelerated onboarding = $140K-$630K recovered revenue. Vanderbilt-scale customers lose $22K/day per applicant sitting in credentialing.
3. *Distribution leverage already in motion.* Has Harvard Health as closest design partner, Duke University and MD Anderson next. These are first-tier reference brands.
4. *Structural tailwind.* NCQA tightened PSV window to 120 days in July 2025; CAQH ramping attestation frequency in 2026.
5. *Open access to enterprise healthcare sales floor.* Offered to bring Simon into MedCal executive committee meetings (the hospital-side decision body). Stephanie has 20 years of pilot-decision-room experience to transfer.

## Call History

- **2026-05-26**: [[bd/calls/transcripts/stephanie-williamson-2026-05-26]] · [[bd/calls/notes/stephanie-williamson-2026-05-26]]
  — firm-direct: Discovery call (Upwork-sourced). Stephanie walked through 5-module MVP architecture (CV ingestion → inference layer → deterministic gateway → contained AI → guided question-asking). Recognized as painkiller in the call ("name your price"). Asked for proposal, Simon committed to send within 24 hours. Mid-June 2026 target start. Praised pre-call research explicitly. No price quoted on call.
- **2026-05-27**: Proposal sent — [[bd/calls/proposals/stephanie-williamson-2026-05-27-final]] ($12K Phase 1 application-completion pipeline, 30-day refund, ~7 weeks, Phase 2 privileging deferred).
- **2026-05-30**: [[bd/calls/transcripts/stephanie-williamson-2026-05-30]] · [[bd/calls/notes/stephanie-williamson-2026-05-30]]
  — firm-direct (clarification, Call 2): She requested the call to clarify the proposal. Did **not** close to a kickoff — instead reopened scope. She killed her own "non-integrated PDF pilot" option (legacy software is instance-based; a coordinator can't enter data without unethically logging in as the provider — integration is mandatory). Did her own AI-assisted discovery of Symplr's database. Now wants a technical **feasibility study** across Symplr / MD-Staff / VerityStream to determine which integration path is real before committing to a build. $12K proposal effectively shelved; a discovery proposal is the next deliverable. No commitment, no kickoff date. Momentum → flat (relationship warm, deal-stage sideways).

## Running Intelligence

**The pain (quantified)**
- $22,000/day in lost revenue per applicant sitting in credentialing at Vanderbilt. ~500 initial applicants in process at any time.
- Compounding effect across two stages: ~4-6 weeks initial credentialing application + ~4-6 weeks privileging = 8-12 weeks total. Stephanie wants to compress total to "a week or two."
- Specialist physicians lost-revenue rates: cardiologist $8-15K/day, orthopedic surgeon $15-40K/day. A 90-day delay for one orthopod = >$1M unrecovered.

**The wedge (architectural)**
- AICAP sits at step 4 of the credentialing pipeline (between application submission and primary source verification). This step doesn't exist as software at most hospitals — it's human MSPs reviewing apps and emailing physicians for clarification.
- **No rip-and-replace of incumbent software (Symplr, VerityStream, MD-Staff)** — this still holds.
- ⚠️ **CORRECTED 2026-05-30: the "no integration / PDF-export" mode is dead.** Stephanie killed it herself. Legacy credentialing software is *instance/deployment-based* — each applicant is a "deployment" that must be opened *as the provider* to trigger downstream verification tasks. A coordinator manually entering data (or AICAP handing over a PDF) does not satisfy the instance and would require unethically logging in as the provider. **Integration is therefore mandatory, not optional.** The application data must be written *into* the legacy system's instance via API. This likely expands real build scope beyond what the $12K Phase 1 proposal assumed.

**Integration feasibility — the new gating unknown (2026-05-30)**
- Stephanie's three ranked integration options:
  - **(A) Direct API submission into the instance** — ideal, lightweight, the easy hospital sell.
  - **(B) Hospital-IT-built bridge from AICAP (ASAP) into the system** — "a heavier lift to sell."
  - **(C) Overlay / screen-layer over the existing app** — "I don't really think is reliable."
- Which option is technically real determines what the MVP even is — hence the feasibility study before committing to a build.
- **Target systems:** Symplr, MD-Staff, VerityStream (the three majors). Stephanie's AI-assisted exploration of Symplr's database: "actually really modern architecture… lots of individual modules, API keys." She saw a "create an account for API" option on Symplr's site.
- **Access constraint:** Stephanie has **no Symplr account** (it's Vanderbilt's; her company is *separate* from Vanderbilt) and "access not an account" to MD-Staff. So discovery may be doc- and screenshare-bound rather than live-API-testable. She'll send screenshots + an AI brain-dump of her Symplr session.

**Stephanie's MVP architecture (5 modules)**
1. **CV ingestion/extraction layer** — OCR + structured field extraction
2. **Inference layer** — keyword triggers (e.g., "faculty member" → inferred hospital affiliation, malpractice, work history scaffolding)
3. **Deterministic gateway** — sorts resolved vs unresolved against compliance bar
4. **Contained AI layer** — reasoning/logic to fill remaining gaps; "as contained as I could"
5. **Guided intuitive question-asking** — replaces dumb fillable form with system-intuited prompts that walk providers to compliance; failed-to-resolve items get *resourced* (contact info for office managers, etc.)

She built this on Replit by herself. "Burnt out Replit with reiterations." Her own term: "very outcome-based."

**Compliance landscape (corrects prep file)**
- **Stephanie does not use HIPAA as her primary compliance frame** — uses Joint Commission and CMS instead. Simon's HIPAA pivot on the call was less relevant than expected. Her direct quote: *"We don't really use HIPAA. We have different compliance that we use, like The Joint Commission, Center for Medicare Medicaid. But it doesn't matter that much. A lot of people don't know about all of that."*
- This means the regulatory-translation pitch should lean on Joint Commission accreditation, CMS reimbursement, NCQA accreditation standards — not HIPAA-first.

**Sales cycle dynamics (insider read)**
- Hospital enterprise sales: 6-12 months *for software requiring integration*. But Stephanie's read: the wedge product (lightweight, no rip-out, no data transfer) "could go quicker, might not be the long procurement cycle."
- The decision body is the **MedCal (Medical Staff) executive committee**. Usually requires two in-person meetings. Technical accompaniment expected — CMIO + informatics team typically ask architectural questions.
- Stephanie offered to bring Simon into those meetings. She has 20 years of pilot-decision-room experience to transfer.

**Design partners in pipeline**
- **Harvard Health** — closest, "first customer/design partner I'm working really closely with"; permission to name-drop matters for distribution
- **Duke University, North Carolina** — close to their decision makers
- **MD Anderson, Houston** — biggest US cancer center; "their leadership is actively trying to solve this problem of compressing physician onboarding, like in meeting about it all the time right now"

**Why she's hiring**
- Has been meeting with engineers for months, hasn't found the right one. Pattern Simon should map: she'll be sensitive to engineer overpromise/underdeliver.
- "Outcome-based" — explicitly open to better architectural approaches if recommended. Translates to: don't worship her existing 5-module design, propose something cleaner if appropriate, but defer to her domain depth on what *compliance* means.
- "Premium licensing fee" — she's planning to charge premium and wants premium-quality product. She's NOT optimizing on Simon being cheapest; she's optimizing on Simon being able to ship the quality she needs to charge premium herself.

**Stephanie's own resistance signals**
- "Sounds like me but [unclear] not really good CTO here" — when Simon described being founder-led with AI agents. Light fragility-tell from her side; she may be worried about delivery capacity for a serious build.
- "It would be a stretch to say re-architect" — pushed back on Simon's framing. She's not throwing away her thinking; she wants someone to build on it.

## Relationship / Pipeline State

**Warm, but the deal moved sideways on Call 2.** Still highly engaged — did her own discovery, killed her own bad option, offered screen-shares and documentation. But the $12K proposal did not get signed: she reopened the foundational integration question and inserted a technical-discovery gate ahead of any build. Relationship temperature ↑; deal-stage →/↓.

**Pipeline stage (updated 2026-05-30)**: **Pre-build integration feasibility / scoping.** The $12K Phase 1 proposal is effectively shelved pending the feasibility answer. Next deliverable is a *discovery proposal*, not a kickoff. Mid-June MVP start is now at risk (a discovery phase precedes it).

**Authority**: Founder, decision-maker for vendor selection on her side. Sole technical decision-maker for the build.

**Budget**: Still not discussed. Self-funded / pre-revenue, premium-quality oriented. **Critical open item: discovery was not framed as paid on the call.** Phase 2 ballpark held in prep ($25K–$50K verbal-only); hardening staged. The all-in picture lives in the 2026-05-30 prep file.

**Timeline**: Was mid-June 2026 start; now gated on the feasibility study. "As quickly as it can be done" still her posture; design partners "sitting waiting to look at it."

**Strategic posture**: This is the strongest forward-deployed-engineer fit surfaced to date in the BD motion. Unlike Luai (cheap offshore labor, vitamin-grade pain) and TaxDome (wrong frame, vendor-as-buyer is a 2027 problem), AICAP is:
- Painkiller-grade pain ($22K/day quantified)
- Architectural-fit (mounted-agent substrate maps 1:1)
- Brand-name design partner pipeline (Harvard, Duke, MD Anderson)
- Founder-friendly relationship dynamic (peer founder, not vendor-buyer)
- Lighthouse-imprint potential — substrate-density wedge in regulated healthcare

**Watch**:
- **THE one to watch: price the discovery.** Simon did not establish on Call 2 whether the integration feasibility study is paid. A paid, scoped discovery sprint is the cleanest first-dollar entry in the FDE playbook; an unscoped one quietly becomes free forward work that scopes an MVP she hasn't bought. (Yoda insight 2026-05-31, line 165.) Pre-package it: fixed deliverable + a number + credited toward the build.
- **Scope just grew.** The PDF-export mode dying means integration is mandatory — likely beyond the $12K Phase 1 scope. Don't let the old $12K number anchor a now-larger build. Re-baseline scope off what the feasibility study reveals.
- **Positioning gap is confirmed buyer-side.** She read the website and said the offer "seems bigger than what's on Tokenrip," then couldn't tell if it's a product or a service. Simon's "doesn't use Tokenrip at all" answer removed the differentiation. Fix the 15-second "why us, not a freelancer" answer before next contact.
- **Don't let the $12K proposal evaporate silently.** Pin down whether it stands behind the discovery or is superseded — ambiguity here loses the deal by drift.
- Privileging (Phase 2) is still the larger compression opportunity and per Stephanie *easier to build* (more deterministic). Keep staged; don't lump into MVP.

## Open Commitments

| # | Action | Owner | Due | Status |
|---|--------|-------|-----|--------|
| 1 | Send written proposal ($12K Phase 1, 30-day refund) | Simon | 2026-05-27 | ✅ Done (sent 2026-05-27) |
| 2 | Run proposal through `/humanizer` | Simon | 2026-05-27 | ✅ Done |
| 3 | Go/no-go after reviewing proposal | Stephanie | 2026-05-30 | ↪️ Superseded — she requested a clarification call (Call 2, 2026-05-30) instead of deciding; reopened scope |
| 4 | Second call | Both | — | ✅ Done (Call 2, 2026-05-30) |
| 5 | Stall-risk gate | Closer | — | ✅ N/A — she engaged |
| 6 | If accepted: get on MedCal executive committee meeting (free observer) | Simon | TBD | Pending — Stephanie's standing offer |
| 7 | **Decide + frame discovery as a paid, scoped sprint before doing the work** | Simon | 2026-06-02 | 🔴 Open — top priority |
| 8 | Research Symplr / MD-Staff / VerityStream integration surface | Simon | 2026-06-03 | Pending — blocked on her docs (#11–14) |
| 9 | Send discovery proposal (scope + deliverable + price) | Simon | 2026-06-04 (inferred) | Pending |
| 10 | Clarify whether $12K Phase 1 proposal stands behind discovery or is superseded | Simon | 2026-06-04 | Pending — fold into #9 |
| 11 | Send overview doc: problem + what discovery should uncover | Stephanie | 2026-05-30 ("today") | Pending |
| 12 | Send target-system list + per-system question list | Stephanie | 2026-05-30 | Pending |
| 13 | Send prior integration/install documentation | Stephanie | 2026-05-30 | Pending |
| 14 | Brain-dump Symplr AI-exploration session + screenshots | Stephanie | 2026-05-30 | Pending |
| 15 | System screen-share walkthrough (MD-Staff / Symplr) | Both | Post-discovery | Deferred — Stephanie's offer |
