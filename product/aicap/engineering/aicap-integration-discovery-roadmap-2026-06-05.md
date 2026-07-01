---
title: AICAP Integration Discovery — Roadmap & Study Guide
contact: Stephanie Williamson
company: AICAP Access
date: 2026-06-05
status: internal learning aid — the map over the research cluster
owner: Simon Pettibone
maps:
  - aicap-integration-feasibility-findings-2026-06-02.md
  - aicap-credentialing-integration-research-2026-06-02.md
  - aicap-path-d-and-credsimple-analysis-2026-06-02.md
---

# AICAP Integration Discovery — Roadmap & Study Guide

> **What this is.** The map over everything we've found, tied back to the five questions Stephanie actually asked. Read it top to bottom and you can speak to the whole engagement cold. Each section links to the detail doc where the proof lives — this doc doesn't repeat endpoints, it points to them.
>
> **How to use it.** Read once for the arc. Then use §8 (the scorecard) to see exactly how answered each question is, §9 for what's still open, §10 for what to dig into yourself. When you want to *prove* you've internalized it rather than just read it, run an `/understand` session against this doc.

---

## 1. The problem in 60 seconds

AICAP completes a physician's credentialing application *before* it hits the hospital's credentialing system — the "pre-intake" step that today is a human MSP reading a CV and emailing the doctor for missing pieces. It sits at **step 4** of the pipeline (between application submission and primary source verification), a step that mostly doesn't exist as software. The ROI is brutal and quantified: a physician stuck in credentialing costs the hospital **~$22K/day** in lost billings (Vanderbilt's number; specialist surgeons run $15-40K/day).

The thing the whole discovery hinges on: AICAP's output has to land *inside* the hospital's existing credentialing system (Symplr, MD-Staff, or VerityStream/CredentialStream), and it has to land in a way that actually *moves the case forward*. The original low-friction idea — hand the hospital a completed PDF, no integration — **is dead**. Stephanie killed it herself: legacy credentialing software is **instance-based** (each applicant is a live "instance"/"case" that opens, collects + verifies, and closes), and the instance only advances when it's opened *as the provider*. A coordinator keying in data or importing a PDF doesn't satisfy the instance — and doing it on the provider's behalf means logging in *as* the provider, which is unethical and a non-starter. **So integration is mandatory, not optional.**

**That is why this discovery exists:** to find out, per system, whether AICAP's completed application data can be transferred in *and drive the live instance*, by what method, and under what constraints — so AICAP knows what to build and what it can credibly sell to a hospital, before it spends build budget on a guess.

---

## 2. Chronology — how we got here

| When           | What happened                                                                                                                                                                                                             | Source                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **2026-05-26** | Call 1. Pain established ($22K/day). Stephanie walks her self-built 5-module MVP (CV extraction → inference → deterministic gateway → contained AI → guided questioning). "Name your price."                              | [[bd/calls/transcripts/stephanie-williamson-2026-05-26]]                                                      |
| **2026-05-27** | $12K Phase 1 proposal sent (application-completion pipeline, PDF/API-optional output).                                                                                                                                    | [[bd/calls/proposals/stephanie-williamson-2026-05-27-final]]                                                  |
| **2026-05-30** | Call 2. She **kills her own PDF-pilot** (instance-based → integration mandatory), names the **3 target systems** and her **3 ranked paths** (A/B/C), and asks for a **feasibility study** before any build. $12K shelved. | [[bd/calls/transcripts/stephanie-williamson-2026-05-30]] · [[bd/calls/notes/stephanie-williamson-2026-05-30]] |
| **2026-06-02** | She sends a formal discovery scope doc; Upwork engagement accepted. We scope the **$1,000 feasibility study** (credited to the build) and run the public-docs research → the three detail docs.                           | [[bd/calls/proposals/stephanie-williamson-2026-06-02-discovery]] · [[bd/calls/contacts/stephanie-williamson]] |
| **2026-06-05** | This map. Public-docs pass complete; live-access items still open.                                                                                                                                                        | —                                                                                                             |

**Where we are right now:** the public-documentation pass is done and written up. We have a defensible per-system read, the crux isolated, and a clear list of what only live access can resolve. The deliverable is in working-draft state pending (a) Simon's domain validation and (b) Stephanie's materials.

---

## 3. The core questions (the spine)

These are Stephanie's five discovery questions, verbatim from the scope. Everything else in this doc maps back to them.

1. **Can application data collected by AICAP be transferred into each system?**
2. **What methods are available** — API, import, file exchange, or another supported mechanism?
3. **Can externally-supplied data run through the platform's normal workflow?** — i.e. does a transfer *open and drive the live instance and trigger verification (PSV)*, or only *create a record someone still has to open*? **← this is the crux. Everything hinges here.**
4. **What authentication, attestation, audit, and governance requirements affect integration** — including *who attests* for externally-submitted data?
5. **Which of AICAP's three paths is real, per system:** (A) direct API submission, (B) a hospital-IT bridge, or (C) an overlay over the existing app?

The crux in plain English: *getting data IN is the easy part. The question is whether getting it in actually makes the case move — or just dumps a record on someone's desk.*

---

## 4. What we looked for, found, and where — per system

> Detail, endpoints, and every link live in [[aicap-credentialing-integration-research-2026-06-02]]. Verdicts and the summary matrix live in [[aicap-integration-feasibility-findings-2026-06-02]]. This is the navigable version.

### MD-Staff (Applied Statistics & Management) — the most promising, best documented
- **Looked for:** a real inbound API and whether it can both *create the case* and *trigger PSV*.
- **Found:** a genuine public HTTP Web API (`prime.api.asm-cloud.com/Help`). Two endpoints map directly to AICAP's ask: `POST providers/new` (creates a Demographic + **Appointment** record — and the Appointment *is* the credentialing unit, so it's more than a directory insert) and `verify/batch/*` (queues PSV, returns a TransactionID — the trigger). SSN write endpoint exists → PHI in scope → expect a BAA.
- **Determined:** Path A is *plausible here* — the building blocks exist as callable operations. **But** the native workflow engine ("Aiva") is documented as triggered by MD-Staff's own provider portal (MD-App), not by the API — so whether an API-created Appointment lands in the same fully-workable state is unconfirmed. HL7/Iguana is a *separate* EMR-activity path, not application intake.
- **Vocabulary note (avoid the "instance" trap):** in the MD-Staff API, `{instance}` in `api/{instance}/...` is the **tenant/deployment** (e.g., `prime`, `halifax`) — *not* a case. Stephanie's "instance" = the credentialing **case** = MD-Staff's **Appointment record** (the Provider/Demographic record is the *person*; the Appointment is the *case* attached to them). Same word, two meanings — keep them straight.
- **Confidence:** endpoints exist = **High**; creates a fully-workable case end-to-end = **Low-Med**.

### Symplr — a record API behind a partner gate
- **Looked for:** the resource model and any "open a case / initiate workflow" object.
- **Found:** a **FHIR (R4B)** API (`apidoc.symplr.com`) — Practitioner, PractitionerRole, DocumentReference, each with full CRUD. **No** case/application/initiate-workflow object and **no** FHIR `Task` resource on the public surface. Integration is gated by a mandatory **Certified Partner Program** (charter partners: CredSimple, Kyruus, Aperture). Auth = client_id/secret.
- **Determined:** leans **record, not workflow** — looks like "writes a record someone still opens," which is exactly the model AICAP says doesn't solve the problem. *Caveat:* the portal is JS-rendered and didn't fully load headless, so the resource list isn't 100% confirmed (→ Phase 2 browser crack).
- **Confidence:** record-only read = **Med** (portal not fully read).
- **⚠️ Correction (2026-06-05):** Stephanie's materials show Vanderbilt actually runs **Cactus** (ex-Vistar), *not* Symplr Provider FHIR. The read above is for the wrong product for her environment — see the **Cactus** subsection below.

### CredentialStream (VerityStream → HealthStream) — the most gated
- **Looked for:** the API catalog and the intake model.
- **Found:** a REST + webhook API exists on the hStream developer portal, but `developers.hstream.com/apis` returns **HTTP 403** anonymously — you can't even read the endpoint list without onboarding. The provider-facing **"Hub"** is an **attestation-centric** human intake. Reported HL7/CSV import was **not found** in any CredentialStream-specific doc (don't repeat it as fact).
- **Determined:** leans **record, not workflow** — pure inference, the catalog is walled. The attestation-centric Hub is the structural tell.
- **Confidence:** record-only read = **Low-Med** (inference only).

### Live-access crack (2026-06-05)

Re-ran the three walled sources in a real browser. One cracked, two still walled:

- **CredSimple/Andros API docs — fully read.** `api.credsimple.com/v1/docs.html` renders completely. The precedent is now concrete (see §5, point 3): a `POST /v1/providers/import` that accepts the *deep* application fields (education, work history, licenses, malpractice, SSN, specialties) **plus a `cred_event: initial` flag** — the Provider endpoints literally "schedule initial credential and recredential events." Verification is a first-class resource with an `attestation` type and `attested_to`/`attested_date` tracking. JWT/OAuth2 auth, credentials issued by Andros. Detail folded into [[aicap-path-d-and-credsimple-analysis-2026-06-02]] (Thread 2).
- **CredentialStream / hStream — still walled.** `developers.hstream.com/apis` now returns an in-app 404 behind a **Sign In** gate (previously a raw 403). The portal exists; the catalog isn't anonymously reachable. Access needs onboarding/sign-in, ideally via a customer hospital. Dev contact: `apisupport@healthstream.com`.
- **Symplr apidoc — unreachable.** `apidoc.symplr.com` fails at the connection level (browser shows its own error page; zero document requests recorded) while CredSimple/hStream loaded fine in the same session — so it's Symplr-specific, not a browser issue. The research doc's resource list came from *search-indexed* portal text, which couldn't be re-confirmed live. The Symplr "any case/`Task` object?" gap stays open; the route in is the Certified Partner Program (`partners@symplr.com`) or a customer-hospital login.

### Cactus — what Vanderbilt actually runs (from Stephanie's materials, 2026-06-05)

Her materials are Vanderbilt's 2018 "Cactus Replacement of Vistar" package — symplr's own confidential implementation docs. They correct a foundational assumption *and* answer the crux for her environment. *(Internal feasibility use only; Cactus 4.1.8 / 2018, confirm still current. Full detail: [[aicap-credentialing-integration-research-2026-06-02]] §2d.)*

- **What it is.** symplr's "Cactus Provider Management Platform" — the credentialing + **privileging** + provider-data **system of record**. Web-based .NET app on SQL Server; users are MSO/credentialing staff and committees. It's the former **Vistar** platform symplr acquired — a *different product* from the FHIR "Symplr Provider" the research first analyzed.
- **What it's for.** Running the whole medical-staff credentialing and privileging lifecycle the hospital already owns: provider records, applications, verifications, committee approval, reappointment, privileging.
- **How application data gets in (the crux answer).** Via **Application Manager**, Cactus's own online provider-application portal: provider completes the application there → an **MSO credentialer accepts it** → a **Windows-service XML import** loads the data. The import **only loads records into an existing provider and does not open a case** — so the workflow is triggered by *portal completion + human acceptance*, not the data write. Attestation/e-signature happens **in the portal**.
- **It's not API-less.** Cactus also has a separately-licensed **Enterprise API** (accepts inbound push), HL7 via an interface engine, and other paths — but the only *documented* application-intake path is the record-load XML import, and whether an API push opens a case is unconfirmed.
- **So what.** For a Cactus shop, the attestation-clean, workflow-aligned wedge is **front-door assist into Application Manager (Path C)** — not a back-door API. That moves Path C from "fallback" to **recommended primary for Cactus**. The materials also hand over the real field model (data dictionary) and the constraints to engineer around (home-addresses-only, empty-fields-only fill, all-or-nothing rollback).

---

## 5. The cross-cutting walls (the power-points — how to say it)

These are the insights that make you sound like you understand the *domain*, not just the docs. Lead with them.

1. **"Access is gated at all three — so AICAP doesn't integrate as an outside vendor, it rides the hospital's license."** No third party can self-serve production write access anywhere. The hospital owns the Symplr/MD-Staff/CredentialStream instance and is who authorizes the integration. That reframes Path A vs B: it's less "AICAP builds a direct integration" and more "AICAP's system runs on the hospital's credential." *This is a go-to-market fact, not just a technical one.*

2. **"Attestation is the same wall, one layer down."** Credentialing is legally built on the *provider* attesting to their own application. An external data push may not satisfy that — which is the exact "I can't act as the provider" problem that killed the PDF pilot, now resurfacing at the API as *who attests*. Even a perfect write API doesn't make this go away. **This is the deepest constraint and the sharpest thing you can say** — it shows you understand the problem at her level. (See §7 Path C and Path D for the two clean answers to it.) **Now concrete (2026-06-05):** symplr's own Cactus spec confirms it — attestation/e-signature happens inside the Application Manager portal, and the back-door XML import does no validation. So for Cactus, the clean answer is to assist the provider *through the portal* (Path C), where attestation already lives. **Precision (don't over-state it as a blanket wall):** AICAP *can* collect a genuine provider attestation — the provider e-signs in AICAP's own UI, which is real attestation, not the impersonation that killed the PDF pilot. The actual constraint is *per-consumer acceptance*: CAQH only counts attestation done **inside CAQH**; a hospital may accept AICAP-collected attestation or insist on its own. Path C is "clean" because it sidesteps the acceptance question — not because attestation is otherwise impossible.

3. **"The precedented way in carries *verified results*, not *completed applications* — and AICAP wants the opposite."** The one proven third-party integration (CredSimple ↔ Symplr) is a CVO returning *verified* data at the *end* of the pipeline, on the *payer* side. AICAP wants to push a *completed-but-unverified* application in at the *front*, on the *hospital* side. That exact flow has **no clear precedent** — which is precisely what the vendor questions exist to confirm. Implication: the realistic route is forward-deployed (land a design-partner hospital → build on its license → certify after), and AICAP may need a verification/NCQA partner to be trusted. ([[aicap-path-d-and-credsimple-analysis-2026-06-02]])
   - **Sharpened 2026-06-05 (live read of Andros's API):** Andros's own `POST /v1/providers/import` *does* accept a completed application (the deep fields) and schedule the credentialing event. So "completed-app-IN drives the workflow" **is** precedented — but **only when the receiving system is the CVO that then verifies it**, not when it's the hospital's system of record. Two things follow: (a) the encroachment risk is concrete — an NCQA-certified incumbent already has the import-the-completed-app capability, it just *also* owns verification; (b) the Andros-partner handoff is concrete too — *AICAP completes → Andros imports + verifies → results flow into the hospital system the proven way* is a real, buildable path, and it backfills AICAP's missing NCQA credibility.

4. **"AICAP is the completeness-to-spec engine; the systems and CAQH are just channels."** *(The positioning that makes AICAP un-commoditizable.)* CAQH ProView, Application Manager, a direct API — all just *channels* to get data in the door. AICAP's value is **assembling an application complete to *this hospital's and this platform's actual spec*** (far more than CAQH's generic schema), getting it provider-attested, and routing it through whatever channel the hospital has. The kicker: **the standards-channel (CAQH) can't even carry the part that makes AICAP valuable** — hospital-specific completeness + privileging exceed CAQH's generic schema, so those ride the front door. *CAQH is the SMTP; AICAP is the email.* This **shrinks** the "which integration is real?" question from existential to optimization (it doesn't make it vanish — you still need a working channel): AICAP sits *above* the channel layer, the **floor is always the front door** (every hospital portal already accepts a provider submission), and even a manual bridge over complete data is a big time-save (see §7 hybrid). ([[aicap-path-d-and-credsimple-analysis-2026-06-02]] Thread 1.)

5. **"The North Star is *time saved* — so integration is an optimization problem, not an existential one."** For a hospital, time = money ($22K/day per stuck provider), so AICAP wins if it *saves time*, full stop. That reframes everything: a human **verify-and-approve** step is **not** a defect — credentialing legally requires MSO review + provider attestation, so that review was never going away. The question is never "is it fully automated / does it auto-open the case?" — it's "does the prepared, complete application reach the case faster than today's chase-the-physician-for-weeks process?" Even the **worst case** — a trained staffer copy/pasting AICAP's prepared data into the system — is a large time save, because they're transcribing *complete, verified* data instead of hunting for missing pieces. No single integration path is do-or-die.

---

## 6. The crux, stated once more (because it's everything)

All three systems let you write data in. **None** of them publicly documents whether that write *opens and drives a live case and fires PSV* versus *just creating a record a human still has to open*. That single question is gated behind a partner/customer agreement at all three. So the honest verdict is **not** "it works" or "it doesn't" — it's: *integration is technically plausible into all three; the workflow-trigger question is unprovable from outside and resolves with one precise vendor question plus a sandbox test.* MD-Staff is the most likely API "yes." Symplr and CredentialStream lean "record, not workflow," unconfirmed.

> **Update 2026-06-05 — for Cactus, the crux is no longer unprovable.** Stephanie's materials (symplr's own Cactus docs) answer it directly for Vanderbilt's actual system: the documented application import **loads records and does not open a case** — the case is driven by Application Manager completion + MSO acceptance. So for Cactus the wedge is **front-door assist (§7 Path C)**, and the "one vendor question" below now applies mainly to MD-Staff and CredentialStream.

> **Reframe (per Simon, 2026-06-05) — keep the crux honest.** A human *verify + approve* step is fine: it was never removable (credentialing requires MSO review + provider attestation), and the North Star is *time saved*. So the crux's real teeth aren't "does it auto-open the case?" (a human click is by-design) but "does the prepared data land in a workable case **without full re-keying**?" For Cactus that's resolved (the import loads into the case the MSO opens). Worst case anywhere is a manual copy/paste bridge over complete data — still a big time-save, not a dead end (see §7 hybrid).

---

## 7. The four paths, assessed

**The paths aren't mutually exclusive — the real architecture is a hybrid, optimized for time saved.** Don't read A/B/C/D as "pick one." The likely end state blends them. Worked example (Cactus + CAQH, ~80/20):

> - **CAQH carries the standardized ~80%** of the case — provider attests in CAQH; Cactus pulls it natively.
> - **The hospital-specific ~20%** is a thin assisted bridge: a trained staffer opens the case in Cactus, imports from CAQH, then pulls the *same case* in AICAP and copy/pastes the remainder. Embed a **case ID** in the CAQH payload so the AICAP ↔ CAQH ↔ Cactus link is one lookup, not a hunt.
> - The remaining 20% is then bounded by **copy/paste speed — minutes**, replacing weeks of MSP back-and-forth. No back-door API required.
>
> This is the concrete reason the integration question is *optimization, not existential*: even the fully-manual bridge is a big win, and every cleaner channel just shaves the 20%.

| Path | What it is | Current read |
|---|---|---|
| **A — direct API** | AICAP calls the system's API to create the case + trigger PSV. | Plausible **only for MD-Staff** (create + verify endpoints exist), pending a live test. Unproven for Symplr/CredentialStream. |
| **B — hospital-IT bridge** | The hospital (the license-holder) stands up / authorizes the integration on its own credential. | **The realistic base case everywhere.** Matches the "access is gated → ride the hospital's license" reality. For **Cactus** there's a concrete candidate: the separately-licensed **Enterprise API** (accepts inbound push) — but whether a push opens a case vs just loads records is unconfirmed. |
| **C — front-door assist** (her "overlay") | Not a vague overlay — **accelerate the provider's own submission through the system's native portal** (browser extension that pre-fills; the provider reviews + attests in their own session). | **The unilateral fallback + fastest demo** — and, for **Cactus, the recommended primary** (2026-06-05): symplr's own intake design (native Application Manager completion + MSO acceptance, attestation in-portal) makes front-door assist the architecturally-aligned path, not just the unblockable backup. Needs *zero* vendor cooperation and **dissolves both walls**. Downside: brittle (DOM drift, per-instance customization, MFA, no SLA). Reframe + the "automate the fill, never the attest" rule in [[aicap-integration-feasibility-findings-2026-06-02]]. |
| **D — CAQH ProView** (we surfaced this) | A standardized provider-data repository hospital systems **pull** from; provider attests inside it. | A **channel, not a route — and capacity-limited.** Provider attests in CAQH (its best property) and systems pull from it, but it **never opens the hospital case**, and its generic schema **can't carry AICAP's differentiators** (hospital-specific completeness + privileging) — those ride the front door. Deep fields go in per-provider via **delegate access** (not the shallow bulk upload); attestation is provider-only. For a **Cactus** shop, Cactus already pulls CAQH → CAQH-population is near-zero net-new. Best framing: CAQH = standardized-core channel + attestation; AICAP's value sits **above** it. ([[aicap-path-d-and-credsimple-analysis-2026-06-02]]) |

---

## 8. Scorecard — how answered is each question? *(the centerpiece)*

| # | Question | Current best answer | Confidence | What's still missing | How to close it |
|---|---|---|---|---|---|
| **1** | Can data be transferred in? | **Yes** — every system exposes an inbound write mechanism (**Cactus**: Application Manager XML import + Enterprise API; MD-Staff `providers/new`; Symplr Provider FHIR records; CredentialStream API behind a wall). | **High** (that a mechanism exists) | Field-level coverage of AICAP's application — **now in hand for Cactus** (data dictionary); still open for MD-Staff/CredentialStream. | Cactus covered by the materials; others via sandbox once access exists. |
| **2** | What methods? | **Cactus** (VUMC's actual system): Application Manager **XML import** (record-load) + separately-licensed **Enterprise API** (inbound push) + HL7. MD-Staff: REST Web API (+ separate HL7/Iguana; no FHIR). Symplr Provider: REST/FHIR R4B + webhooks. CredentialStream: REST + webhooks (HL7/CSV import **not** confirmed). | **High** for Cactus/MD-Staff/Symplr shape; **Med** for CredentialStream | CredentialStream's catalog; the Cactus Enterprise-API protocol; exact auth/token mechanisms. | Portal/partner access; Cactus admin/API docs. |
| **3** | Drives the workflow? **(crux)** | **Cactus (VUMC's system): answered** — the documented application import **loads records, doesn't open a case**; workflow = portal completion + MSO acceptance. MD-Staff **closest-to-real** via API (pending test). CredentialStream still record-only inference. | **High for Cactus**; Low-Med for the others | Whether a Cactus *Enterprise-API* push opens a case; the MD-Staff + CredentialStream answers. | Cactus largely closed by Stephanie's materials; others need the vendor question (§11) + a sandbox test. |
| **4** | Auth / attestation / governance? | Access **gated everywhere** (Cactus modules separately licensed; Symplr Certified Partner; MD-Staff key-via-sales; CredentialStream sign-in wall). **For Cactus, now concrete:** attestation/e-signature happens *in the Application Manager portal*; the back-door import does no validation. *Who attests* for a pure API push elsewhere is still unanswered. | **High** on gating; **High** on attestation-location for Cactus; **Med-High** as a blocker elsewhere | How MD-Staff/CredentialStream enforce attestation for API submissions; whether CAQH's model satisfies a hospital. | Vendor question (§11) + the CAQH (Path D) dig. |
| **5** | Which path is real, per system? | For **Cactus** (VUMC): **C** (front-door assist into Application Manager) is the recommended primary; **B** via the Enterprise API is a gated candidate. **A** plausible only for MD-Staff. **B** (ride the hospital's license) is the base case for the others. **D** = completion/attestation layer, not a bypass. | **Med** (Cactus path now clearer) | Confirm the Cactus Enterprise-API behavior; confirm A on MD-Staff; whether a non-customer can get credentials at all. | Design-partner-hospital sandbox; for Cactus, prototype front-door assist against Application Manager. |

**One-line summary of the scorecard:** *Data goes in (Q1/Q2 = solid). The crux (Q3) is now **answered for Cactus** — the documented import loads records; the native portal + MSO acceptance drives the case — and still open for MD-Staff/CredentialStream. Attestation (Q4) lives in the native portal. The path verdict (Q5): for Cactus, front-door assist into Application Manager; elsewhere, ride the hospital's license and prove MD-Staff via API.*

---

## 9. Gap register / open threads

Prioritized. Consolidates the confidence tables, the confirmable-now-vs-live-access split, and the flags-for-Simon across the detail docs.

| Priority | Gap | Why it matters | How to resolve | Owner |
|---|---|---|---|---|
| **P0** | **Record vs. workflow** (the crux) | Decides whether integration is worth building at all and what the MVP *is*. | **Answered for Cactus 2026-06-05** (Stephanie's materials — import is record-load, workflow = portal + acceptance). Open for MD-Staff/CredentialStream: the one vendor question (§11) + sandbox test, ideally via a design-partner hospital. | Simon (question) → vendors/hospital |
| **P0** | **Attestation for externally-submitted data** | The legal blocker; if unresolved, even a perfect write API doesn't ship. | **For Cactus: located** — attestation lives in the Application Manager portal (→ Path C). Elsewhere: ask each vendor; assess whether CAQH (Path D) or in-portal attest (Path C) satisfies it. | Simon + Stephanie (domain) |
| **P1** | **Cactus Enterprise-API behavior** (does an API push open a case, or just load records?) | Determines whether a Path-B API bridge into Cactus is viable, or whether front-door assist (Path C) is the only real option. | Cactus admin/API docs or a vendor question; the 2018 spec only documents the record-load XML import. | Simon → symplr / hospital |
| **P1** | **Is the Cactus 4.1.8 / 2018 picture still current?** | The materials are 7 years old; symplr may have added REST/FHIR or changed Application Manager. | Confirm current Cactus version + intake options with Stephanie or symplr. | Simon + Stephanie |
| **P2** | **Symplr Provider FHIR resource list** (any case/`Task` object?) | **Deprioritized** — Vanderbilt runs Cactus, not Symplr Provider. Matters only if a target hospital runs Symplr Provider FHIR. | `apidoc.symplr.com` unreachable live (§4); needs Certified-Partner access (`partners@symplr.com`). | Simon / Alek → symplr |
| **P1** | **CredentialStream catalog** (sign-in walled) | The entire CredentialStream read is inference right now. | **Confirmed walled 2026-06-05** — `/apis` 404 behind Sign In. Needs portal onboarding, ideally via a customer hospital. Contact `apisupport@healthstream.com`. | Simon → HealthStream |
| **P1** | **Can a non-customer third party even get credentials?** | If "no" everywhere, Path A/B both require a hospital first — confirms the forward-deployed sequence. | Vendor partnership teams; the customer-routed access request. | Simon / Alek |
| **P2** | **Field-level coverage** of AICAP's app per system | Determines how much of AICAP's extraction value actually lands. | **Resolved for Cactus** — the data dictionary + field mapping are in hand (constraints: home-addresses-only, empty-fields-only, all-or-nothing rollback). Open for MD-Staff/CredentialStream via sandbox. | Simon + Stephanie |
| **✅** | ~~**Stephanie's materials**~~ (Symplr brain-dump, screenshots, prior integration docs) | Revealed the Cactus reality + the import spec. | **Received + folded in 2026-06-05** (the Cactus implementation package). | Done |
| **P2** | **CAQH write-path specifics** | Confirms how AICAP would actually populate CAQH (Path D). | **Largely resolved 2026-06-05** — bulk upload = shared/practice sections only (verified); deep fields go in per-provider via **delegate access / Direct Assist**; **attestation provider-only**; the Credentialing API is pull/autofill. Remaining: confirm delegate-write field coverage against the primary spec *if* a CAQH path is pursued. | Simon |

---

## 10. What Simon should personally dig into

- **Make the domain call on the crux read.** Cactus is now answered from symplr's own docs (record-load import; portal + MSO acceptance drives the case). For MD-Staff/CredentialStream the read is still a documentation inference — *your* 20-years-adjacent judgment (and Stephanie's) can sharpen or overrule it.
- **Confirm the Cactus picture is current.** The materials are Cactus 4.1.8 / 2018 — check with Stephanie/symplr whether Application Manager + the intake options still work this way, and whether newer REST/FHIR APIs exist.
- **Decide the integration recommendation for Cactus shops.** Front-door assist (Path C) into Application Manager is now the evidence-backed primary — confirm you're comfortable leading the deliverable with it, and whether to also pursue the Enterprise API (Path B) as the "supported" long-term option.
- **Decide the CAQH (Path D) framing** before it goes to Stephanie — does surfacing it strengthen the deliverable (you spotted an option she didn't) or muddy it? Your read on whether it's real for *her* hospital-side use case.
- **Walled portals** — handled in Phase 2; the parts that need a customer login (CredentialStream catalog) need a design-partner hospital, which is itself the next BD move.
- **Read the two CAQH PDFs directly** if Path D survives your framing call — they weren't machine-parsed.

---

## 11. The highest-leverage next move

One precise question to each vendor's partnership team resolves the crux faster than any further public research:

> *"Does an inbound API call (creating a provider/appointment record, or firing a webhook) initiate a credentialing case and trigger primary source verification — or does it only create a record that a credentialing specialist must then open and process manually? And how is provider attestation handled for externally-submitted application data?"*

And the way to actually get answered (and to unlock the walled docs): **an access request routed through a hospital that already runs the system** — a customer's request opens doors that an inquiry from us can't. That's Path B in action, and it's the same move that turns a design-partner hospital from a logo into a working sandbox.

---

## 12. Doc map / index

| Doc | Holds | Use when |
|---|---|---|
| **This doc** | The map + the answered-scorecard + the gap register | Getting synced; deciding what to dig next |
| [[aicap-integration-feasibility-findings-2026-06-02]] | The verdicts: per-system matrix, the crux, Path C reframe, recommended next steps, flags-for-Simon | You need the conclusion / the deliverable seed |
| [[aicap-credentialing-integration-research-2026-06-02]] | The evidence: endpoints, every link, the confidence table, method honesty, **§2d Cactus** | You need to verify a claim or pull a thread |
| `stephanie-resources/` | Stephanie's materials — Vanderbilt's 2018 Cactus implementation package (import spec, admin guide, data dictionary, workflows). **symplr-confidential; internal use only** | You need the source for any Cactus claim |
| [[aicap-path-d-and-credsimple-analysis-2026-06-02]] | CAQH "Path D" + the CredSimple/Andros precedent + the 5 lessons | Anything about attestation, CAQH, or the precedented-pattern argument |
| [[bd/calls/proposals/stephanie-williamson-2026-06-02-discovery]] | What we promised her ($1K study, deliverable, method, cover message) | Checking scope against what we said |
| [[bd/calls/contacts/stephanie-williamson]] | The relationship + pipeline state, the build-bridge prize, open commitments | Anything about the deal, not the tech |
