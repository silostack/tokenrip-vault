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
>
> **Status (2026-06-06) — internal, do not hand to Stephanie.** The frontmatter already flags "not all of it goes to Stephanie." Thread 2 (Andros) is candid strategy *for our side* — wedge-thinness ("a thinner wedge than it looks"), competitor encroachment risk, AICAP's NCQA-credibility gap, and the Palantir/forward-deployed GTM (incl. naming Harvard). None of that belongs in front of the client unframed. The client-facing artifact is `aicap-integration-discovery-deliverable-draft-2026-06-05.md`.

## Synthesis (read this first)

The two threads independently land on the same wall, from opposite sides. AICAP's core thesis is "complete the application, push it into the hospital credentialing system, trigger the workflow." Three things now sit in front of that:

1. **Access gating** — every system requires partner certification or customer status to integrate (established in the prior findings doc).
2. **Attestation** — the provider must legally attest; AICAP can't act as the provider.
3. **Pipeline position (the new one).** The *precedented, proven* way a third party wires into these systems — the CredSimple/symplr pattern — is **verified results flowing IN at the *end* of the pipeline**, not a completed-but-unverified application flowing in at the *front*. The systems are built either to *be* the intake (their own provider portals: MD-App, the Hub) or to *receive verified data* from a CVO. "Externally-authored application drives our workflow" is the part nobody has a clear precedent for.

That's not fatal — it's the thing the discovery exists to test. But it reframes the build. Two cleaner framings fall out:

- **Framing A — completion engine that hands off.** AICAP owns "get the provider to a complete, attested, verification-ready state," then hands off: to **CAQH** (where the provider attests — solving wall #2) and/or to a **CVO like Andros** (which verifies and returns results into the hospital system the proven way — solving wall #3). AICAP is the front of the funnel, not the integrator into the system of record.
- **Framing B — forward-deployed via a design-partner hospital.** A hospital that already runs Symplr/MD-Staff/CredentialStream authorizes the integration on its own license, AICAP builds it for that hospital, proves it, then pursues formal certification. This is the exact Palantir-style sequence — land the customer, build the substrate, certify after. Harvard is the obvious first one.

These aren't mutually exclusive. The honest strategic risk to name: **"application completion, unbundled from verification, is a thinner wedge than it looks"** — because the one company that's proven this market (Andros) captures the intake-automation value precisely by *also owning verification + the NCQA stamp*. More on that in Thread 2.

**Reframe (2026-06-05) — the cleanest statement of the above.** AICAP is the **completeness-to-spec engine**; CAQH and the native portals (and any direct API) are just **channels**. The standards-channel (CAQH) can't even carry the part that makes AICAP valuable — *hospital-specific completeness + privileging* — so those ride the front door (Application Manager / direct), while CAQH carries the standardized core + provider attestation. Value sits **above the channel layer**, which means "which integration path is real?" stops being existential: AICAP routes through whatever channels a hospital has. *CAQH is the SMTP; AICAP is the email.* (Details in Thread 1.)

---

## Thread 1 — CAQH ProView ("Path D")

**Verdict: CAQH is a *channel*, not a route into the hospital case — and a capacity-limited one. A real complementary wedge (strong on attestation; carries only the standardized core), but AICAP's value lives *above* the channel layer, in completeness-to-the-hospital's-actual-spec. CAQH is the SMTP; AICAP is the email.**

- **Attestation win is real (Path D's best property).** In CAQH, the provider personally attests (electronic legal signature; re-attest every 120 days). So *AICAP pre-fills → provider reviews → provider attests in CAQH* puts attestation exactly where it legally must be. AICAP never acts as the provider. This is the cleanest available answer to wall #2. (Caveat: "attested in CAQH" satisfies CAQH/payer-enrollment; a hospital system may still want its own attestation in its own workflow.) More generally, attestation is **per-consumer**: AICAP *can* collect a genuine provider e-signature for the non-CAQH portion too — but each consumer (CAQH, the hospital, the accreditor) defines what counts, so the work is **acceptance, not capability**.
- **What can be written into CAQH, and how (precise — verified 2026-06-05).** CAQH ProView's *schema* is comprehensive — 18 sections covering the full credentialing core (education, training, work history, licenses, DEA, malpractice + claims, boards, affiliations, references, disclosures, attestation, documents). But the write *mechanisms* differ sharply:
  - The **Practice Manager bulk upload is shallow** — practice-level *shared* sections only (practice info, location, practice-level liability). It does **not** carry the deep provider fields. *(Verified against CAQH's bulk-upload spec — this limit is real; don't overstate the bulk path.)*
  - Deep fields are populated **per-provider via delegate access** (a staff member the provider authorizes can edit the profile + upload documents) or **Direct Assist** (groups 25+; CAQH staff populate from submitted docs). So *AICAP pre-fills as an authorized delegate → provider reviews → provider attests* is the realistic write path — not a bulk push.
  - The roster API carries identifiers only; the newer **CAQH Credentialing API** is **pull/sync/autofill-oriented** (software pulls *from* CAQH), not a deep-push or case-opener. Consistent with CAQH = data source, not intake.
- **It's *pull*, not push — and it never opens the hospital case.** CAQH is a repository the hospital collects from when an MSP opens a case, not a pipe that delivers into one. "Route a case in via CAQH" isn't a thing: CAQH pre-fills fields; the hospital still opens and drives its own case (its own PSV + privileging, often its own attestation).
- **Capacity-limited channel → the architecture is hybrid.** CAQH's envelope is rich but *generic*. It carries the **standardized core + provider attestation**; it **cannot carry AICAP's actual differentiators** — *hospital-specific* completeness (requirements beyond the generic schema) and *privileging* (CAQH has none). Those ride the **front door (Application Manager) / direct path**.
  - **Worked example (~80/20).** CAQH carries the standardized ~80% (provider attests in CAQH; the hospital system pulls it natively). The hospital-specific ~20% is a thin **assisted bridge** — a trained staffer opens the case, imports from CAQH, then copy/pastes the remainder from AICAP, with a **case ID embedded in the CAQH payload** so the AICAP ↔ CAQH ↔ system link is one lookup, not a hunt. The 20% is then bounded by **copy/paste speed — minutes**, replacing weeks of back-and-forth. North Star = *time saved*; even this fully-manual bridge is a large win, so no single channel is do-or-die.
- **CAQH flags incompleteness only against its *own* generic schema** (exception reports, required fields, attestation currency) — **not** against a specific hospital's or platform's requirements. CAQH-complete ≠ hospital-complete. That gap *is* AICAP's wedge.
- **Payer lane, not hospital lane.** CAQH is dominant in **health-plan enrollment**. AICAP's named buyers run **hospital medical-staff credentialing** (Cactus / Symplr Provider / MD-Staff / CredentialStream), which treat CAQH as *one self-reported feed* and still run their own PSV and privileging. Populating CAQH does not push data *through* the hospital workflow.
- **For a Cactus shop, CAQH adds little net-new.** Cactus already manages CAQH natively (CAQH Export/Manager module), so AICAP "populating CAQH" feeds a capability the hospital already owns — proof that AICAP's value isn't the CAQH population. Reinforces **Path C (front-door assist into Application Manager)** as primary for Cactus.
- **CAQH-pull is confirmed for two of three, and CAQH is the only inbound *application* source (precision, 2026-06-06).** Symplr/Cactus (Cactus Connect) and CredentialStream (daily CAQH sync) publicly document pulling from CAQH; **MD-Staff's public CAQH integration is push-only** (rosters uploaded *to* CAQH for payer enrollment) — inbound pull unconfirmed. The other registries all three query — NPDB, OIG/SAM, NPI/NPPES, DEA, ABMS, state boards — are *verification* sources that confirm existing credentials; they don't carry a completed application. So CAQH stays the single shared repository that can route application data in.
- **Gating.** Lighter than per-system partner certification but non-zero: become a CAQH **Participating Organization** (PO) for API access, plus per-provider authorization (profiles are private by default).
- **Cleanest framing (the positioning upgrade):** AICAP is the **completeness-to-spec engine that sits *above* the channel layer** — it encodes each hospital's + platform's real definition of "valid/complete," assembles the to-spec, attested, ready application, and routes it through whatever channels the hospital has (CAQH for the standardized core + attestation; Application Manager / direct for the hospital-specific layer + privileging). This **downgrades** the "which integration path is real?" question from existential to optimization — it doesn't remove the need for a channel (you always need at least one, and the **floor is the front door**, which every hospital already accepts). AICAP's value doesn't depend on any one *back-door* channel winning, and even a manual bridge over complete data saves big time. *(By-product: the spec-encoding compounds into a hospital × platform requirements library — substrate, not the pitch.)*

---

## Thread 2 — CredSimple / Andros

**One line:** Andros (rebranded from CredSimple, 2020) is an NCQA + URAC-certified CVO + provider-network-management platform selling to **payers/health plans/telehealth — not hospitals**. It owns *verification*, downstream/adjacent to where AICAP plays.

- **The symplr partnership AICAP wanted to study is payer-side.** It integrates with symplr's **Cactus/Vistar** (payer/managed-care products), **not** the hospital MD-Staff line. Being a "Cactus partner" ≠ being an "MD-Staff partner." Confirm the partner pathway even exists on the hospital side.
- **The integration pattern = CVO handoff.** Cactus/Vistar pushes provider data OUT to CredSimple with one click → CredSimple verifies → **verified results come BACK in**. Bi-directional, via a "rich API" gated by certification. *What crosses the wire is verified results, not a completed application.* That's the opposite end of the pipeline from AICAP.
- **They already do intake autofill.** Andros markets "two of three application processes need no provider input" — document-driven autofill from verified sources. So they *partially overlap* AICAP's completion thesis — but they monetize it by *being the verifier*. This is the encroachment risk: an NCQA-certified incumbent can extend front-ward into completion more easily than AICAP can extend back-ward into certified verification.
- **NCQA/URAC is the credibility currency.** Andros leads with "fewer than 25 orgs hold both." A completion-only product with no verification credential may struggle for trust with credentialing buyers — AICAP may need a certification story or a CVO partner to ride on.

**Confirmed live 2026-06-05 (Andros public API docs — `api.credsimple.com/v1/docs.html`, now fully readable):** the import flow is real and *deep*. `POST /v1/providers/import` accepts the full application payload — education (`school`, `graduation_year`), `state_licenses`, `specialties`, `board_names`, `ssn`, `npi`, practice/mailing addresses, `application_received_date` — **plus a `cred_event: initial` flag**, and the Provider endpoints are documented to "schedule initial credential and recredential events." `import_type` is **Delegated vs Direct** (whether Andros performs the credentialing or it's delegated back). Verification is a first-class resource with a large `verification_type` enum including `attestation`, `application`, `disclosure_questions`, `clinical_work_history`, `npdb`, `oig`, `edu`, `boards`, `malpractice_insurance`/`liability_history`, etc., and `attested_to`/`attested_date` tracking on sub-resources. Auth: JWT/OAuth2 (Resource Owner Password), credentials issued by Andros.
- **So what (this sharpens the synthesis):** this is the *completed-application-IN-that-drives-the-workflow* pattern **working in production — but into the CVO**, which then verifies. Two consequences: (a) the **encroachment risk hardens** — Andros already ingests the exact deep fields that are AICAP's extraction value, so a front-ward extension into completion is a small step for them; (b) the **AICAP→Andros handoff becomes concrete** — `providers/import` is literally the seam to hand off at, and it backfills AICAP's missing NCQA credibility. The wall for AICAP is unchanged: this precedent does **not** show a completed application driving a *hospital system-of-record's* (Symplr/MD-Staff/CredentialStream) workflow — only a CVO's.

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

*(Caveats: CAQH primary PDFs are binary and weren't machine-parsed — read directly before committing architecture. ~~Andros's OpenAPI spec isn't openly browsable; endpoint detail is inferred from press + GitHub stack.~~ **Updated 2026-06-05: Andros's API docs at `api.credsimple.com/v1/docs.html` ARE fully browsable — endpoint detail above is now read directly, not inferred.** Marketing figures — turnaround days, "60+ integrations," "75% of transactions" — are unverified.)*
