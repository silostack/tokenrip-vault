---
title: AICAP — CAQH "Path D" & CredSimple/Andros Analysis
contact: Stephanie Williamson
company: AICAP Access
date: 2026-06-02
status: research analysis — internal intel (informs deliverable, not all of it goes to Stephanie)
owner: Simon Pettibone
pairs_with: aicap-integration-feasibility-findings-2026-06-02.md
---

# CAQH "Path D" & CredSimple/Andros — Analysis

> Two threads dug here. They converge on one point that matters more than either thread alone — read the synthesis first.

## Synthesis (read this first)

The two threads independently land on the same wall, from opposite sides. AICAP's core thesis is "complete the application, push it into the hospital credentialing system, trigger the workflow." Three things now sit in front of that:

1. **Access gating** — every system requires partner certification or customer status to integrate (established in the prior findings doc).
2. **Attestation** — the provider must legally attest; AICAP can't act as the provider.
3. **Pipeline position (the new one).** The *precedented, proven* way a third party wires into these systems — the CredSimple/symplr pattern — is **verified results flowing IN at the *end* of the pipeline**, not a completed-but-unverified application flowing in at the *front*. The systems are built either to *be* the intake (their own provider portals: MD-App, the Hub) or to *receive verified data* from a CVO. "Externally-authored application drives our workflow" is the part nobody has a clear precedent for.

That's not fatal — it's the thing the discovery exists to test. But it reframes the build. Two cleaner framings fall out:

- **Framing A — completion engine that hands off.** AICAP owns "get the provider to a complete, attested, verification-ready state," then hands off: to **CAQH** (where the provider attests — solving wall #2) and/or to a **CVO like Andros** (which verifies and returns results into the hospital system the proven way — solving wall #3). AICAP is the front of the funnel, not the integrator into the system of record.
- **Framing B — forward-deployed via a design-partner hospital.** A hospital that already runs Symplr/MD-Staff/CredentialStream authorizes the integration on its own license, AICAP builds it for that hospital, proves it, then pursues formal certification. This is the exact Palantir-style sequence — land the customer, build the substrate, certify after. Harvard is the obvious first one.

These aren't mutually exclusive. The honest strategic risk to name: **"application completion, unbundled from verification, is a thinner wedge than it looks"** — because the one company that's proven this market (Andros) captures the intake-automation value precisely by *also owning verification + the NCQA stamp*. More on that in Thread 2.

---

## Thread 1 — CAQH ProView ("Path D")

**Verdict: a real complementary wedge, strong on attestation, weak on deep-write — not a single move that dissolves both walls for hospital credentialing.**

- **Attestation win is real (Path D's best property).** In CAQH, the provider personally attests (electronic legal signature; re-attest every 120 days). So *AICAP pre-fills → provider reviews → provider attests in CAQH* puts attestation exactly where it legally must be. AICAP never acts as the provider. This is the cleanest available answer to wall #2. (Caveat: "attested in CAQH" satisfies CAQH/payer-enrollment; a hospital system may still want its own attestation in its own workflow.)
- **No deep-field write API (the limitation).** CAQH's only real inbound write path is the **Practice Manager Module bulk upload**, and it covers *shared* sections only — credentialing contact, liability insurance, practice location, hospital affiliation. It does **not** accept the provider-specific fields that are AICAP's actual extraction value: education, training, work history, licenses, malpractice history, disclosures. The roster API carries only identifiers, not profile data. The real-world pattern (e.g., Headway) is **read/pull from CAQH to pre-fill your own form** — data flows CAQH→vendor, not vendor→CAQH, for the deep fields.
- **Payer lane, not hospital lane.** CAQH is dominant in **health-plan enrollment**. AICAP's named buyers run **hospital medical-staff credentialing** (Symplr Provider / MD-Staff / CredentialStream), which treat CAQH as *one self-reported feed* and still run their own primary-source verification and privileging. Populating CAQH does not push data *through* the hospital workflow.
- **Gating.** Lighter than per-system partner certification but non-zero: become a CAQH **Participating Organization** (PO) for API access, plus per-provider authorization (profiles are private by default).
- **Cleanest framing:** not "sync into CAQH" but "AICAP completes and gets the provider's CAQH profile attested, then feeds the verified-pull systems." Keeps the attestation win, avoids over-claiming a write API that doesn't exist.

---

## Thread 2 — CredSimple / Andros

**One line:** Andros (rebranded from CredSimple, 2020) is an NCQA + URAC-certified CVO + provider-network-management platform selling to **payers/health plans/telehealth — not hospitals**. It owns *verification*, downstream/adjacent to where AICAP plays.

- **The symplr partnership AICAP wanted to study is payer-side.** It integrates with symplr's **Cactus/Vistar** (payer/managed-care products), **not** the hospital MD-Staff line. Being a "Cactus partner" ≠ being an "MD-Staff partner." Confirm the partner pathway even exists on the hospital side.
- **The integration pattern = CVO handoff.** Cactus/Vistar pushes provider data OUT to CredSimple with one click → CredSimple verifies → **verified results come BACK in**. Bi-directional, via a "rich API" gated by certification. *What crosses the wire is verified results, not a completed application.* That's the opposite end of the pipeline from AICAP.
- **They already do intake autofill.** Andros markets "two of three application processes need no provider input" — document-driven autofill from verified sources. So they *partially overlap* AICAP's completion thesis — but they monetize it by *being the verifier*. This is the encroachment risk: an NCQA-certified incumbent can extend front-ward into completion more easily than AICAP can extend back-ward into certified verification.
- **NCQA/URAC is the credibility currency.** Andros leads with "fewer than 25 orgs hold both." A completion-only product with no verification credential may struggle for trust with credentialing buyers — AICAP may need a certification story or a CVO partner to ride on.

**Partner / competitor / analog?**
- **Analog: strongly yes** — best public example of a third party legitimately wired into these systems via a certified-partner bi-directional API. The pattern and the "no duplicate data entry" pitch transfer directly.
- **Partner: realistically yes** — "AICAP completes → Andros verifies → results flow into the hospital system the proven way" is a natural handoff that *also* solves AICAP's NCQA-credibility gap. Worth holding as a real option.
- **Competitor: partial/latent** — overlapping intake autofill + a stronger moat; collision is muted today by the buyer split (Andros = payer, AICAP = hospital).

**The five lessons for AICAP:**
1. The legitimate way in is the **certified-partner handoff**, not raw write access.
2. What's precedented is **verified-results-IN**, not **completed-application-IN** — AICAP's flow is less trodden; confirm the hospital systems even accept it.
3. **NCQA/URAC** is the trust currency — need a certification story or a CVO partner.
4. **Target the right product** — the CredSimple precedent is payer-side (Cactus/Vistar), not hospital-side.
5. The viable sequence is **land a hospital design partner → build the integration on their license → certify after** (forward-deployed, not reverse).

---

## What to confirm with the vendors (feeds the emails)

The single unverified question that the CredSimple precedent does *not* answer, and that decides everything:

> **Do the hospital-side products (Symplr Provider, MD-Staff, CredentialStream) accept inbound, completed-but-not-yet-verified application data via a partner program — and does it open a credentialing case and trigger the workflow — or do they only accept verified results / their own portal intake?**

Plus, per system: how is provider attestation handled for API-submitted data?

---

## Sources

**CAQH:** caqh.org/solutions/provider-data/credentialing-suite · /provider-data-management · /providers · docs.mulesoft.com/caqh-connector · CAQH ProView/DirectAssure Roster & Status Check API spec (PDF, binary) · Practice Manager User Guide (PDF, binary) · Headway CAQH help docs · symplr/MD-Staff/CredentialStream CAQH pages · payerready / contractingproviders / medtrainer guides

**Andros/CredSimple:** andros.co (/, /cvo-services-lga, /credentialing-api, /platform, /arc-workflow, /insights) · PRNewswire (CredSimple→andros rebrand 2020; industry-first credentialing API Aug 2021) · symplr.com/press-releases/credsimple-symplr-partner-to-offer-customers-seamless-integration · symplr.com/press-releases/symplr-announces-certified-partner-program · github.com/CredSimple · api.credsimple.com/v1/docs.html (Swagger, JS-rendered) · andros Crunchbase

*(Caveats: CAQH primary PDFs are binary and weren't machine-parsed — read directly before committing architecture. Andros's OpenAPI spec isn't openly browsable; endpoint detail is inferred from press + GitHub stack. Marketing figures — turnaround days, "60+ integrations," "75% of transactions" — are unverified.)*
