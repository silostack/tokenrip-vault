---
title: AICAP Legacy System Integration — Feasibility Findings (WORKING DRAFT)
contact: Stephanie Williamson
company: AICAP Access
date: 2026-06-02
status: first-pass research draft — public docs only; pending Simon's domain validation + Stephanie's materials
owner: Simon Pettibone
pairs_with: bd/calls/proposals/stephanie-williamson-2026-06-02-discovery.md
---

# AICAP Legacy System Integration — Feasibility Findings

> **Status: working draft.** First pass from public vendor documentation only. Not the client deliverable yet — needs Simon's domain validation (especially the record-vs-workflow call) and Stephanie's materials (Symplr brain-dump + screenshots, prior integration docs) folded in. The live-access items are flagged throughout.

## Headline

All three systems expose an inbound write mechanism. None of them publicly document the one thing that actually matters — whether an inbound API call **opens and drives a live credentialing case and triggers primary source verification (PSV)**, versus just **creating a record a human still has to open and process**. That single question is gated behind a partner/customer agreement at all three vendors, and it is the same "you can't act *as* the provider" problem Stephanie already identified — resurfacing at the API layer as *who attests*.

So the honest verdict is not "yes it works" or "no it doesn't." It's: **integration is technically plausible into all three; the workflow-trigger question is unprovable from outside and resolves with one precise vendor question plus a sandbox test.** MD-Staff is the most promising (real public API with both a create-case endpoint and a trigger-PSV endpoint). Symplr and CredentialStream are more locked down and lean toward "writes a record, doesn't drive the case" — but unconfirmed.

## Summary matrix

| | **Symplr** | **MD-Staff (AS&M)** | **CredentialStream (VerityStream/HealthStream)** |
|---|---|---|---|
| **Q1 — Can data be transferred in?** | Yes, as *records* (FHIR Practitioner / PractitionerRole / DocumentReference) | **Yes** — `POST providers/new` creates Demographic + **Appointment** record (Appointment = the credentialing unit) | Plausibly yes; unproven publicly (API exists, scope undocumented) |
| **Q2 — Methods** | REST/FHIR (R4B) + webhooks; client_id/secret auth | REST/HTTP Web API (asm-cloud.com) + separate HL7/Iguana for EMR activity (not app intake); **no FHIR** | REST + webhooks on hStream; HL7/CSV import **not found** for CredentialStream specifically |
| **Q3 — Drives the workflow? (the crux)** | Not documented; leans **record, not workflow** (no case/Task object found) | **Closest to real** — create + `verify/batch/*` (queues PSV, returns TransactionID) both callable; end-to-end case fidelity unconfirmed | Not documented; leans **record, not workflow** (attestation-centric Hub is the human intake) |
| **Q4 — Auth / governance gate** | Mandatory **Certified Partner Program** | Username + access key; "contact sales" — no self-serve | **"Request Access" wall**; `/apis` returns HTTP 403 anonymously — most gated of the three |
| **Q5 — Best path (A/B/C)** | **B** (certified-partner bridge); A unproven | **A plausible** (create + trigger via API) pending live test; **B** = hospital issues the key | **B** (partner/hospital-authorized bridge); A unproven |

> **Path C isn't in the cells above on purpose** — it operates at the UI layer, so it behaves the same regardless of vendor. It's reframed in its own section below ("Path C reframed: front-door assist"), because "overlay" undersells what it actually is and where it fits.

## Per-system detail

### MD-Staff — most promising
A real, publicly-listed HTTP Web API (`prime.api.asm-cloud.com/Help`, `halifax.api.asm-cloud.com`). The two building blocks AICAP needs both exist as callable operations:
- `POST api/{instance}/providers/new` — "Create a Demographic record and Appointment record(s)." In MD-Staff's model the **Appointment record is the credentialing/privileging unit** (reappointment cycles, checklists, and PSV attach to it), so this is more than a directory insert.
- `POST verify/batch/provider/{type}` and `verify/batch/credential/{type}` — queue PSV jobs and return a TransactionID, with a status endpoint to track them. **This is the downstream-task trigger.**

The open question: docs don't confirm that an API-created Appointment lands in the same fully-workable case state that MD-Staff's own provider portal (MD-App) produces. The native workflow engine ("Aiva") is documented as triggered by MD-App submissions, not by the API. Access is gated (username + access key; new parties routed to sales). PHI/SSN are in scope (dedicated SSN write endpoint) → expect a BAA.

> **Correction to my 2026-06-02 capped scan:** I'd assumed MD-Staff was Iguana/HL7 + professional-services only, with no real API. That was wrong. It has a genuine Web API; the Iguana/HL7 path (ADT/BAR inbound, MFN M02 outbound) is a *separate* EMR-activity integration that does **not** carry application submissions. The inbound application path for AICAP is the Web API, not HL7.

### Symplr — record API, partner-gated
Public FHIR API (`apidoc.symplr.com`): Practitioner, PractitionerRole, DocumentReference — record-level create/update/delete/search. No documented "credentialing case / application / initiate-workflow" object, and no FHIR `Task` resource on the public surface. Symplr's workflow automation is described as an *internal* product feature (fires after staff/internal trigger), consistent with the "creates a record someone still opens" model AICAP says doesn't solve its problem. Auth = client_id + client_secret in headers. Production integration is gated by the mandatory **Certified Partner Program** (charter partners include CredSimple, Kyruus, Aperture). The full API portal is JS-rendered and resists automated reading — a person should open it in a browser to confirm the complete resource list.

### CredentialStream — most gated
HealthStream publicly confirms a REST + webhook Credentialing API on the hStream developer portal (`developers.hstream.com`), but every technical detail sits behind a "Request Access" wall — `/apis` returns HTTP 403 to anonymous requests, so the endpoint catalog can't even be read without onboarding. Reported HL7/CSV/TXT *import* formats were **not found** in any CredentialStream-specific doc (treat as unverified). The provider-facing "Hub" is an attestation-centric human intake — a structural constraint on any external push. Industry context: **CAQH ProView** is the canonical bulk provider-data intake channel that these systems pull from.

## Cross-cutting findings (these matter strategically)

1. **Access is gated everywhere → AICAP likely integrates via the hospital's existing license, not as an independent direct integrator.** No third party can self-serve production write access at any of the three. The hospital — the customer who already owns the Symplr/MD-Staff/CredentialStream instance — is who authorizes the integration. This reframes Stephanie's Path A vs. B: it's less "AICAP builds a direct API integration" and more "AICAP's system rides the hospital's license and credential." That's a go-to-market fact, not just a technical one.

2. **Provider attestation is the same wall, one layer down.** Credentialing is legally built around the provider attesting to their own application. An external data push may not be able to satisfy attestation — which is exactly the "can't act as the provider" problem that killed Stephanie's PDF-pilot idea, now reappearing at the API. Even with a perfect write API, *who attests* is an open question. This is worth naming explicitly in the deliverable; it's the deepest constraint.

3. **CAQH ProView (Path D) — validated as a complementary wedge, not a bypass.** ([[aicap-path-d-and-credsimple-analysis-2026-06-02|full analysis]].) The provider attests *inside* CAQH, which genuinely solves the attestation wall. But there's no deep-field write API (only a Practice Manager bulk-upload of shared sections — not the education/work-history/license/malpractice fields that are AICAP's value), and CAQH is the *payer-enrollment* lane, not the *hospital medical-staff* lane AICAP sells into. Best framing: AICAP completes and gets the provider's CAQH profile attested, then feeds the verified-pull systems. Strong on attestation; does not remove the need to integrate with the hospital systems.

4. **The precedented way into these systems is the certified-partner handoff — and it carries *verified results*, not *completed applications*.** ([[aicap-path-d-and-credsimple-analysis-2026-06-02|full analysis]] — CredSimple/Andros study.) The one proven third-party integration (CredSimple ↔ symplr) is a CVO returning *verified* data at the *end* of the pipeline, on the *payer* side (Cactus/Vistar). AICAP wants the opposite: push a *completed-but-unverified* application in at the *front*, on the *hospital* side. That flow has no clear precedent — exactly what the vendor emails need to confirm. Implication: the realistic route is land a design-partner hospital → build on its license → certify after (forward-deployed), and AICAP may need a verification/NCQA partner (Andros is a natural one) to be trusted.

## Path C reframed: front-door assist (the unilateral fallback)

AICAP's Path C — described on the discovery call as "some sort of screen or layer over the existing application" — is not a distinct, vague "overlay." It is **front-door assist**: instead of pushing data in at the back (Paths A/B), AICAP accelerates the provider's own submission through the system's *native* portal (MD-App, the Hub, Symplr's provider intake). Browser automation is the concrete implementation. Three flavors:

- **Headless RPA** — a bot logs in and fills *and submits*. Fastest to prototype, and the dead end (see below).
- **Browser extension / true overlay** — injects into the provider's own logged-in session and pre-fills the fields they'd otherwise type by hand; the provider reviews and submits.
- **Proxy / iframe wrapper** — AICAP's app fronts the vendor's app. Avoid: X-Frame-Options, auth, and CORS make it brittle and insecure; the extension dominates it.

**The dividing line is the attest step, not the fill step.** Automating the *fill* is legitimate; automating the *attestation* is fraud. A headless bot that submits on the provider's behalf is functionally identical to "a coordinator logs in as the provider" — the exact practice AICAP already ruled out as unethical. So the only viable form keeps the provider in their own session for the final review-and-attest, which structurally resembles a browser extension, not a headless bot.

**The strategic upside (the non-obvious part): front-door assist dissolves both walls the API paths run into.** Because the provider goes through the system's native portal:
- The workflow-trigger crux is moot — it is a real front-door submission, so the instance opens and PSV fires natively. No "does the API drive the case?" question.
- Attestation is clean — the provider attests in the system, exactly where it must legally happen.

And it needs **zero vendor cooperation**: no Certified Partner Program, no API credentials, no gate. It is the one path no vendor can block. It also maps directly onto the Phase 1 autofill experience already proposed — delivered *inside* the vendor portal instead of in AICAP's own UI.

**The downside (AICAP's "not reliable" instinct was right):** it is brittle in production. Selector/DOM drift breaks it on every vendor UI release; each hospital instance is customized; MFA, session timeouts, and bot-detection fight it; there is no SLA and no support. Fast to demo, expensive to maintain.

**Net:** Path C is the **unilateral fallback** — the thing AICAP can ship without anyone's permission, and the only path where attestation is unambiguous. Paths A/B are cleaner *if* AICAP gets through the gate; Path C is the path nobody can block but nobody will support. In practice it is also likely the **fastest route to a working demo** for a design-partner hospital, which makes it valuable even if the production architecture ends up being an API path.

## The single highest-leverage next step

One precise question to each vendor's partnership team resolves the crux faster than any further public research:

> *"Does an inbound API call (creating a provider/appointment record, or firing a webhook) initiate a credentialing case and trigger primary source verification — or does it only create a record that a credentialing specialist must then open and process manually? And how is provider attestation handled for externally-submitted application data?"*

## Recommended next steps (draft — this becomes the build bridge)

1. **Resolve the crux with the vendors directly** (the question above), ideally with a design-partner hospital requesting sandbox/portal access on AICAP's behalf (that's Path B in action and it unlocks the real docs).
2. **Prioritize MD-Staff for a live test** — it has the most complete documented inbound + trigger surface, so it's the fastest path to a proof.
3. **Treat CAQH (Path D) as a complementary completion + attestation layer**, not a substitute for hospital-system integration — it solves attestation cleanly but feeds the payer lane (see analysis).
4. **Scope the build off Path B as the base case** — integration rides the hospital's license, with provider attestation handled explicitly. *(This is where the re-baselined build scope + quote attach — replacing the stale $12K Phase 1, which assumed a PDF/API-optional output that's now off the table.)*
5. **Hold Path C (front-door assist) as the unilateral fallback and fastest demo route.** It needs no vendor cooperation and is the only path where attestation is unambiguous. Prototype it against a sandbox/portal to put a working demo in front of a design-partner hospital quickly — even while the API paths are still gated — accepting its production brittleness as a known trade-off.

## Confirmable now vs. needs live access

**Confirmed from public docs:** each system has an inbound write API/mechanism; MD-Staff's create + verify endpoints; Symplr's FHIR record model + Certified Partner gate; CredentialStream's API existence behind a 403 wall; attestation-centric human intake on Symplr/CredentialStream; no FHIR on MD-Staff.

**Needs vendor onboarding / live test:** the record-vs-workflow answer for all three; full endpoint catalogs (Symplr's JS-gated portal, CredentialStream's 403-gated portal); whether a non-customer third party can get credentials; field-level coverage of AICAP's completed application; how attestation is enforced for API submissions.

## Flags for Simon (before this goes to Stephanie)

- **Your call on the crux read.** I've said "leans record-not-workflow" for Symplr/CredentialStream and "plausibly workflow" for MD-Staff. You have the domain judgment to sharpen or overrule that.
- **Her materials should confirm/extend the Symplr picture** — her brain-dump may show modules/API-key options the public portal hid behind its renderer.
- **Decide whether to surface CAQH ProView** as Path D — it could either strengthen the deliverable (you spotted an option she didn't) or muddy it. Your read on whether it's real for her use case.
- **The attestation point is the sharpest insight here** — it ties the API-layer finding back to her own PDF-pilot realization. Worth leading with; it shows you understand the problem at the level she does.

## Sources
- Symplr: apidoc.symplr.com · symplr.com/products/symplr-provider · /symplr-credentialing-suite · /contingent-talent-management/integrations · symplr.com/press-releases/symplr-announces-certified-partner-program
- MD-Staff: prime.api.asm-cloud.com/Help · halifax.api.asm-cloud.com · mdstaff.com/product/md-staff · /product/md-app · /aiva-your-credentialing-assistant · interfaceware.com/asm · mdstaff.com/why-md-staff/secure-integration
- CredentialStream: developers.hstream.com (/apis → 403) · healthstream.com/platform/developer-portal · /hstream-for-credentialing · veritystream.com/credentialstream · /solution/the-hub · CAQH credentialing suite
