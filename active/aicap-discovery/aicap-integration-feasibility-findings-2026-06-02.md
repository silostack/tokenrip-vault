---
title: AICAP Legacy System Integration — Feasibility Findings (WORKING DRAFT)
contact: Stephanie Williamson
company: AICAP Access
date: 2026-06-02
status: internal working draft — public docs + Stephanie's Cactus materials folded in; superseded for external use by the client deliverable; not for hand-off as-is
owner: Simon Pettibone
pairs_with: bd/calls/proposals/stephanie-williamson-2026-06-02-discovery.md
---

# AICAP Legacy System Integration — Feasibility Findings

> **Status: working draft.** Public vendor documentation **plus Stephanie's materials, folded in 2026-06-05** (Vanderbilt's Cactus implementation package — see the Symplr/Cactus section below, cross-cutting finding #5, and §2d of the research doc). Those materials answered the crux for Cactus. Still needs Simon's domain validation — especially whether the Cactus 4.1.8 / 2018 picture is still current, and the MD-Staff record-vs-workflow call. Live-access items remain flagged throughout.

> **Status (2026-06-06) — internal, do not hand to Stephanie.** This doc carries seller-side content (the **"Flags for Simon"** section, **internal build pricing**, and the working Path A/B/C taxonomy). The client-facing artifact is `aicap-integration-discovery-deliverable-draft-2026-06-05.md`, which supersedes this for anything external. The deliverable's framing has since evolved: it leads with **data-usability** (*can the data be **used** / processed through the normal workflow* — "auto-trigger" is explicitly not the bar) and an **engine-first** recommendation (build the complete-application engine before lining up a pilot hospital). The internal analysis below still uses the older "drives the workflow / opens a case" voice — that's accurate as reasoning, just not how we present it to her.

## Headline

All three systems expose an inbound write mechanism. None of them publicly document the one thing that actually matters — whether an inbound API call **opens and drives a live credentialing case and triggers primary source verification (PSV)**, versus just **creating a record a human still has to open and process**. That single question is gated behind a partner/customer agreement at all three vendors, and it is the same "you can't act *as* the provider" problem Stephanie already identified — resurfacing at the API layer as *who attests*.

So the honest verdict is not "yes it works" or "no it doesn't." It's: **integration is technically plausible into all three; the workflow-trigger question is unprovable from outside and resolves with one precise vendor question plus a sandbox test.** MD-Staff is the most promising (real public API with both a create-case endpoint and a trigger-PSV endpoint). Symplr and CredentialStream are more locked down and lean toward "writes a record, doesn't drive the case" — but unconfirmed.

> **Reframe (2026-06-05) — read the crux through the right lens.** The North Star is *does it save time?* (for a hospital, time = money — $22K/day per stuck provider). A human **verify-and-approve** step is not a defect: credentialing legally requires MSO review + provider attestation, so it was never removable. So "auto-opens the case" is the wrong bar — the real question is whether prepared, complete data lands in a workable case **without full re-keying**. And the integration question is **optimization, not existential**: even a worst-case manual bridge (a trained staffer copy/pastes AICAP's complete data into the system, linked by a case ID) is a large time-save vs. today, and the architecture will likely be a **hybrid** (e.g., CAQH carries ~80%, a thin assisted bridge handles the hospital-specific ~20%). Likewise *attestation* is not a blanket wall — AICAP can collect a genuine provider e-signature; the real constraint is **per-consumer acceptance** (CAQH counts only attestation done inside CAQH; a hospital may accept AICAP's or want its own).

## Summary matrix

| | **Symplr** | **MD-Staff (AS&M)** | **CredentialStream (VerityStream/HealthStream)** |
|---|---|---|---|
| **Q1 — Can data be transferred in?** | Yes, as *records* (FHIR Practitioner / PractitionerRole / DocumentReference) | **Yes** — `POST providers/new` creates Demographic + **Appointment** record (Appointment = the credentialing unit) | Plausibly yes; unproven publicly (API exists, scope undocumented) |
| **Q2 — Methods** | REST/FHIR (R4B) + webhooks; client_id/secret auth | REST/HTTP Web API (asm-cloud.com) + separate HL7/Iguana for EMR activity (not app intake); **no FHIR** | REST + webhooks on hStream; HL7/CSV import **not found** for CredentialStream specifically |
| **Q3 — Drives the workflow? (the crux)** | **Answered for Cactus** (what VUMC runs): the documented application import **loads records, doesn't open a case**; workflow = Application Manager completion + MSO acceptance. Symplr Provider (FHIR) still leans record-only. | **Closest to real** — create + `verify/batch/*` (queues PSV, returns TransactionID) both callable; end-to-end case fidelity unconfirmed | Not documented; leans **record, not workflow** (attestation-centric Hub is the human intake) |
| **Q4 — Auth / governance gate** | Cactus: Application Manager + Enterprise API are **separately licensed** modules. Symplr Provider: Certified Partner Program | Username + access key; "contact sales" — no self-serve | **"Request Access" wall**; `/apis` 403/sign-in-walled anonymously — most gated of the three |
| **Q5 — Best path (A/B/C)** | **C** (front-door assist via Application Manager) — attestation-clean + workflow-aligned for Cactus. **B** via the Enterprise API (inbound push) exists but is gated and its case-opening behavior is unconfirmed | **A plausible** (create + trigger via API) pending live test; **B** = hospital issues the key | **B** (partner/hospital-authorized bridge); A unproven |

> **The "Symplr" column is now mostly about Cactus.** Stephanie's materials show Vanderbilt runs **Cactus** (ex-Vistar), not the FHIR "Symplr Provider" product. The Cactus intake mechanics — Application Manager portal → MSO acceptance → record-load XML import — are detailed in [[aicap-credentialing-integration-research-2026-06-02]] §2d.

> **Path C isn't in the cells above on purpose** — it operates at the UI layer, so it behaves the same regardless of vendor. It's reframed in its own section below ("Path C reframed: front-door assist"), because "overlay" undersells what it actually is and where it fits.

## Per-system detail

### MD-Staff — most promising
A real, publicly-listed HTTP Web API (`prime.api.asm-cloud.com/Help`, `halifax.api.asm-cloud.com`). The two building blocks AICAP needs both exist as callable operations:
- `POST api/{instance}/providers/new` — "Create a Demographic record and Appointment record(s)." In MD-Staff's model the **Appointment record is the credentialing/privileging unit** (reappointment cycles, checklists, and PSV attach to it), so this is more than a directory insert.
- `POST verify/batch/provider/{type}` and `verify/batch/credential/{type}` — queue PSV jobs and return a TransactionID, with a status endpoint to track them. **This is the downstream-task trigger.**

The open question: docs don't confirm that an API-created Appointment lands in the same fully-workable case state that MD-Staff's own provider portal (MD-App) produces. The native workflow engine ("Aiva") is documented as triggered by MD-App submissions, not by the API. Access is gated (username + access key; new parties routed to sales). Sensitive provider data is in scope (dedicated SSN write endpoint) — provider PII, not patient PHI; expect the hospital's data-protection agreement and security review.

> **Correction to my 2026-06-02 capped scan:** I'd assumed MD-Staff was Iguana/HL7 + professional-services only, with no real API. That was wrong. It has a genuine Web API; the Iguana/HL7 path (ADT/BAR inbound, MFN M02 outbound) is a *separate* EMR-activity integration that does **not** carry application submissions. The inbound application path for AICAP is the Web API, not HL7.

### Symplr — two products: Symplr Provider (FHIR) and Cactus (what VUMC runs)

**Symplr Provider (FHIR API, `apidoc.symplr.com`):** Practitioner, PractitionerRole, DocumentReference — record-level create/update/delete/search. No documented "credentialing case / application / initiate-workflow" object, and no FHIR `Task` resource on the public surface. Workflow automation is described as an *internal* product feature, consistent with the "creates a record someone still opens" model AICAP says doesn't solve its problem. Auth = client_id + client_secret. Gated by the mandatory **Certified Partner Program** (charter partners: CredSimple, Kyruus, Aperture). The portal is JS-rendered and, as of 2026-06-05, unreachable in a live browser — resource list unconfirmed.

**Cactus (ex-Vistar — Vanderbilt's actual system; full detail in [[aicap-credentialing-integration-research-2026-06-02]] §2d).** Stephanie's materials are symplr's own Cactus implementation docs, and they resolve the crux for this product. The documented external-application path is the **Application Manager** portal (provider completes online, self-serve or by invitation) → an **MSO credentialer accepts** it → a **Windows-service XML import** loads the data. Crucially, that import **only loads records into an already-existing provider and does not open or advance a credentialing case** — so the workflow trigger is *portal completion + human acceptance*, not the data write. Cactus is not API-less (it also has a separately-licensed **Enterprise API** that accepts inbound push, plus HL7 via an interface engine), but the only *documented* application-intake path is record-load-only, and whether an Enterprise-API push opens a case is unconfirmed. Attestation/e-signature happens inside Application Manager; the import does no validation. *(Source docs are Cactus 4.1.8 / 2018 and symplr-confidential — internal feasibility use only.)*

**Net for AICAP in a Cactus shop:** the attestation-clean, workflow-aligned wedge is **front-door assist into Application Manager** (Path C) — get the provider to a complete, acceptance-ready state and accelerate the native completion — not a back-door API push.

### CredentialStream — most gated
HealthStream publicly confirms a REST + webhook Credentialing API on the hStream developer portal (`developers.hstream.com`), but every technical detail sits behind a "Request Access" wall — `/apis` returns HTTP 403 to anonymous requests, so the endpoint catalog can't even be read without onboarding. Reported HL7/CSV/TXT *import* formats were **not found** in any CredentialStream-specific doc (treat as unverified). The provider-facing "Hub" is an attestation-centric human intake — a structural constraint on any external push. Industry context: **CAQH ProView** is the canonical bulk provider-data intake channel that these systems pull from.

## Cross-cutting findings (these matter strategically)

1. **Access is gated everywhere → AICAP likely integrates via the hospital's existing license, not as an independent direct integrator.** No third party can self-serve production write access at any of the three. The hospital — the customer who already owns the Symplr/MD-Staff/CredentialStream instance — is who authorizes the integration. This reframes Stephanie's Path A vs. B: it's less "AICAP builds a direct API integration" and more "AICAP's system rides the hospital's license and credential." That's a go-to-market fact, not just a technical one.

2. **Provider attestation — a per-consumer acceptance question, not a blanket wall.** Credentialing is legally built around the provider attesting to their own application. **Precision (2026-06-05):** AICAP *can* collect a genuine provider attestation — the provider e-signs in AICAP's own UI, which is real attestation, **not** the impersonation (coordinator logging in *as* the provider) that killed the PDF-pilot idea. The actual constraint is that attestation is **consumer-specific**: each downstream consumer defines what counts. CAQH only marks a profile attested if the provider attests **inside CAQH**; a hospital may accept AICAP-collected attestation or insist on its own (subject to its Joint Commission/NCQA/CMS regime). So the work is getting each consumer to *accept* AICAP's attestation — a governance/data-model question ("confirm with the customer"), not a structural impossibility. Path C is "clean" precisely because attesting in the native portal sidesteps the acceptance question. Still worth naming in the deliverable — but as an acceptance question, not an unsolvable wall.

3. **CAQH ProView (Path D) — a *channel*, not a bypass; AICAP's value sits *above* the channel layer.** ([[aicap-path-d-and-credsimple-analysis-2026-06-02|full analysis]].) The provider attests *inside* CAQH (genuinely solving the attestation wall) and hospital systems *pull* from it — but it never opens the hospital case. Precise write-path (verified 2026-06-05): the Practice Manager **bulk upload is shared/practice sections only**; the **deep fields go in per-provider via delegate access / Direct Assist**; **attestation stays provider-only**. Critically, CAQH's generic schema **cannot carry AICAP's differentiators** — hospital-specific completeness and privileging — so those ride the front door (Application Manager / direct). **Net positioning (the "what it means for the sales motion" line):** AICAP is the *completeness-to-spec engine*; CAQH and the native portals are just *channels*. CAQH carries the standardized core + attestation; AICAP's value is making the application complete to the hospital's + platform's **actual** spec and routing it through whatever channels exist — so the value doesn't depend on any one integration path winning. *(For a Cactus shop, Cactus already pulls CAQH, so CAQH-population adds near-zero net-new — reinforcing front-door assist.)*

4. **The precedented way into these systems is the certified-partner handoff — and it carries *verified results*, not *completed applications*.** ([[aicap-path-d-and-credsimple-analysis-2026-06-02|full analysis]] — CredSimple/Andros study.) The one proven third-party integration (CredSimple ↔ symplr) is a CVO returning *verified* data at the *end* of the pipeline, on the *payer* side (Cactus/Vistar). AICAP wants the opposite: push a *completed-but-unverified* application in at the *front*, on the *hospital* side. That flow has no clear precedent — exactly what the vendor emails need to confirm. *(Confirmed 2026-06-05 from Andros's live API docs: their `POST /v1/providers/import` does take a completed application and schedule the credentialing event — but into the **CVO that then verifies it**, not into a hospital system of record. The hospital-front flow stays unprecedented.)* Implication: the realistic route is land a design-partner hospital → build on its license → certify after (forward-deployed), and AICAP may need a verification/NCQA partner (Andros is a natural one) to be trusted.

5. **Stephanie's materials confirm the target is Cactus — and Cactus's own intake spec validates Path C.** *(Added 2026-06-05 — symplr's implementation docs in `stephanie-resources/`; full detail in [[aicap-credentialing-integration-research-2026-06-02]] §2d.)* Vanderbilt runs **Cactus** (ex-Vistar), not the FHIR Symplr Provider product the sections above analyzed. Cactus's documented application intake is **Application Manager portal → MSO acceptance → record-load XML import**; the import loads data but does **not** open a case, so the workflow is driven by native-portal completion plus a human acceptance gate, and attestation/e-signature lives in the portal. That is direct, vendor-authored evidence that for Cactus environments the cleanest path is **front-door assist (Path C)**, not a back-door API. The materials also fill the field-coverage gap (the Cactus data dictionary is in hand) and surface real engineering constraints (home-addresses-only, empty-fields-only fill, all-or-nothing rollback per application).

6. **The North Star is *time saved* → the architecture is a hybrid, and no single path is do-or-die.** For a hospital, time = money ($22K/day per stuck provider), so AICAP wins if it *saves time* — and a human verify-and-approve step is fine (it was never removable; credentialing requires MSO review + attestation). That makes integration an **optimization** problem, not an existential one. The realistic end state **blends paths**: e.g., **CAQH carries the standardized ~80%** (provider attests in CAQH), and a **thin assisted bridge handles the hospital-specific ~20%** — a trained staffer opens the case, imports from CAQH, then copy/pastes the remainder from AICAP, with a **case ID embedded in the CAQH payload** so the AICAP ↔ CAQH ↔ system lookup is one step, not a hunt. Even that worst-case manual bridge is a large time-save vs. today's weeks of back-and-forth, because staff transcribe *complete, verified* data instead of hunting for missing pieces. **Implication for the deliverable:** recommend a *hybrid, time-optimized* integration, not a single-path bet — and lead with the time-saved outcome, since that's the hospital's North Star.

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

> **Update 2026-06-05 (Cactus evidence upgrades Path C).** For Cactus shops specifically, front-door assist isn't just the fallback. symplr's own intake design — native Application Manager completion + MSO acceptance, with attestation/e-signature in the portal — makes it the **architecturally-aligned** path. That moves Path C from "unblockable backup" to **recommended primary for Cactus environments**. (See [[aicap-credentialing-integration-research-2026-06-02]] §2d.)

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
