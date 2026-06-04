---
title: AICAP Credentialing Integration — Research & Source Reference
contact: Stephanie Williamson
company: AICAP Access
date: 2026-06-02
status: research reference — public docs only
owner: Simon Pettibone
pairs_with: aicap-integration-feasibility-findings-2026-06-02.md
---

# AICAP Credentialing Integration — Research & Source Reference

> Companion to [[aicap-integration-feasibility-findings-2026-06-02]]. The findings doc has the verdicts; this has the evidence, the specific endpoints, and the links so you can verify everything yourself and pull on whatever thread looks promising.
>
> **Method honesty:** this is public-documentation research. Two of the three API portals resisted automated reading — Symplr's `apidoc` is JavaScript-rendered and wouldn't load headless; CredentialStream's `/apis` returns HTTP 403 to anyone not logged in. So for those two, the *existence and shape* of the API is confirmed but the *full endpoint catalog* needs either a human browser session or partner access. MD-Staff's Help pages rendered fine, which is why its detail below is the deepest.

---

## 1. MD-Staff (Applied Statistics & Management / AS&M) — the most documented

### 1a. The Web API (the key find)

Publicly viewable API Help pages (open these in a browser):
- https://prime.api.asm-cloud.com/Help
- https://halifax.api.asm-cloud.com/ — and the playground at https://halifax.api.asm-cloud.com/playground/index

`prime` and `halifax` look like tenant/region instances; every route is shaped `api/{instance}/...`. The interactive playground and full manual are gated, but the Help endpoint list is visible.

**Write endpoints found (these are what matter for AICAP):**

| Endpoint | What the docs say |
|---|---|
| `POST api/{instance}/providers/new` | "Create a Demographic record and Appointment record(s)" — the create-the-case call |
| `POST api/{instance}/object/{source}` + `/object/{source}/batch` | "Creates or Updates an object of the specified type" — generic writer; **object types are not enumerated in public help** (a thread to pull: which types? field coverage of AICAP's app?) |
| `POST/PUT .../providerfile` | Upload provider files / documents (attach AICAP's completed packet) |
| `PUT .../demographic/{providerID}/ssn` | Write SSN (PHI in scope → expect a BAA) |
| `POST verify/batch/provider/{verificationServiceType}` | Queue a PSV batch job, returns a **TransactionID** — the trigger-verification call |
| `POST verify/batch/credential/{credentialType}` | Same, for credential-type verifications |
| `GET verify/batch/status/{transactionID}` | Track the PSV jobs |
| `History` endpoints | Change history / snapshots (the audit trail; API writes are attributed to your key) |
| `GET status` | The only endpoint callable without authenticating |

**Auth:** username + access key. "To access the API, contact your MD-Staff administrator for a username and access key"; new parties are routed to "your account or sales representative." Per-instance, per-user scoping. The exact token mechanism isn't on the public Help page.

**Why this is the strongest path:** AICAP's whole ask maps to two documented calls — `providers/new` (create) + `verify/batch/*` (trigger PSV). Pull on this first.

### 1b. The data-model insight (why `providers/new` is more than a directory insert)

In MD-Staff, the **Appointment record is the credentialing/privileging unit** — reappointment cycles, checklists, and PSV all attach to it. Sources:
- https://www.mdstaff.com/three-year-provider-reappointment-cycle/
- https://www.mdstaff.com/aiva-your-credentialing-assistant/ — "Aiva" is the workflow engine: Online Application → Credentialing → Checklist
- https://www.mdstaff.com/product/md-app/ — MD-App is their native provider-application portal; "seamlessly integrates with MD-Staff, initiating an automated verification process"

**The crux thread:** Aiva is documented as triggered by *MD-App submissions*, not by the API. So the open question is whether `providers/new` + `verify/batch` reproduces the same Aiva-driven, staff-workable case — or leaves a record + detached verification jobs. Only a live test answers this.

### 1c. HL7 / Iguana — a SEPARATE path, not application intake

- https://www.interfaceware.com/asm — AS&M integrates MD-Staff with Epic/Cerner via the Iguana engine. Outbound **MFN M02** (privilege updates), inbound **ADT / BAR** (provider activity for peer review). These are EMR-activity messages, **not** new-application creation.
- https://www.mdstaff.com/why-md-staff/secure-integration/
- No FHIR anywhere in MD-Staff docs — treat MD-Staff as non-FHIR.

### 1d. Other MD-Staff product pages worth a skim
- https://www.mdstaff.com/product/md-staff/
- https://www.mdstaff.com/solution/credentialing/
- https://www.mdstaff.com/product/md-query/
- https://www.mdstaff.com/professional-services/
- https://www.mdstaff.com/simplifying-provider-onboarding/
- CAQH: https://www.prnewswire.com/news-releases/md-staff-caqh-work-together-to-make-sharing-provider-data-easier-and-more-accurate-for-groups-300803605.html

---

## 2. Symplr — a record API behind a partner gate

### 2a. The public API
- https://apidoc.symplr.com/ — the symplr Platform API. **FHIR-based** (R4B / v4.3.0). Data in JSON / XML / RDF.
  - Confirmed resources: **Practitioner**, **PractitionerRole**, **DocumentReference** — each with create / update / delete / search.
  - **Not found:** any "credentialing case / application / initiate-workflow" object, and no FHIR `Task` resource on the public surface.
  - ⚠️ The portal is JS-rendered and wouldn't load headless. The resource *existence* is from search-indexed portal text; **open it in a browser to confirm the complete resource list** (specifically: is there any case/application/Task object?).
- **Auth:** `client_id` + `client_secret` in HTTP headers, plus symplr integration-identifier headers. Client-credentials style, not a documented user-delegated OAuth flow.

### 2b. The partner gate (this is the governance reality)
- https://www.symplr.com/press-releases/symplr-announces-certified-partner-program — a **mandatory certification** for integration; "a rich API… for partners to perform bi-directional integration." Named charter partners: **CredSimple, Kyruus, Aperture, SkillSurvey, RepScrubs.**
- https://www.symplr.com/partnerships
- **Contact for the real answer:** partners@symplr.com
- CredSimple is a credentialing-data vendor — the closest analog to what AICAP wants to do, so it's worth studying how they position their symplr integration.

### 2c. Product / workflow context (workflow automation is described as internal)
- https://www.symplr.com/products/symplr-provider
- https://www.symplr.com/products/symplr-credentialing-suite
- https://www.symplr.com/products/contingent-talent-management/integrations — "real-time APIs, secure webhooks… with certified partners"
- https://www.symplr.com/products/symplr-payer — HL7/interoperability language lives on the payer side, not confirmed for provider/credentialing
- Third-party integration example: https://www.karmacheck.com/symplrctm
- CIO guide (image-based PDF, not text-extractable, but worth a human look): https://www.symplr.com/wp-content/uploads/2025/04/CIO-Guide-to-symplr-Products-2025.pdf

---

## 3. CredentialStream (VerityStream → HealthStream) — the most gated

### 3a. The API (confirmed to exist, catalog is walled)
- https://developers.hstream.com/ — the hStream developer portal (launched Nov 2022). Renders no content anonymously.
- https://developers.hstream.com/apis — **returns HTTP 403 Forbidden** to anonymous requests. This is the headline: you can't even read the endpoint catalog without onboarding.
- https://www.healthstream.com/platform/developer-portal — marketing list: "RESTful APIs, SDKs, Postman collections, sandbox environments," webhooks
- https://www.healthstream.com/hstream-for-credentialing
- **Auth:** "enterprise-grade APIs with identity management"; you register an app and manage permissions *inside* the gated portal. Mechanism not public.
- **Import formats (HL7 / CSV / TXT): NOT found** in any CredentialStream-specific doc. Treat as unverified — don't repeat the "exports in TXT/CSV/HL7" line as if it's an inbound import path.

### 3b. The Hub (attestation-centric human intake)
- https://www.veritystream.com/solution/the-hub — providers complete, sign, and **attest to** applications here. This is the structural constraint on any external data push.
- https://www.veritystream.com/credentialstream
- https://www.healthstream.com/solution/credentialing/healthcare-credentialing-privileging-enrollment-software-credentialstream

### 3c. Context worth knowing
- HealthStream acquired **Virsys12** (Oct 2025, up to ~$17M) — a **Salesforce-based** provider-data-management / credentialing-application engine for payers. Signals the intake stack is consolidating and partly sits on Salesforce (a separate integration surface).
  - https://www.healthcareittoday.com/2025/11/19/healthstream-acquires-virsys12-expanding-its-credentialing-application-solution-for-payers-and-health-plan-enterprises/
  - https://virsys12.com/
- Portal launch announcement: https://ir.healthstream.com/news-releases/news-release-details/healthstream-launches-new-hstreamtm-developer-portal/
- **To unlock the real docs:** request portal access, ideally via a design-partner hospital that's already a customer (that's Path B in action).

---

## Cross-cutting threads to pull

### Thread A — CAQH ProView (the possible "Path D")
- https://www.caqh.org/solutions/provider-data/credentialing-suite
- CAQH ProView is the industry-standard channel that providers attest to and that credentialing systems pull from. Both MD-Staff and CredentialStream reference it.
- **Why it could be the cleanest wedge:** instead of pushing into three proprietary, partner-gated systems, AICAP could populate/sync via CAQH — which the systems already ingest, *and* where the provider does the attesting. That potentially sidesteps both the gating problem **and** the attestation wall in one move. Worth a dedicated dig before committing to per-system integration.

### Thread B — Provider attestation (the deepest constraint)
- Credentialing is legally built on the *provider* attesting to their own application. An external data push may not satisfy that requirement — the same "I can't act as the provider" problem that killed the PDF-pilot idea, now at the API layer.
- The question for each vendor: how is attestation handled for API-submitted data? Does CAQH's provider-attestation model resolve it? (Ties directly to Thread A.)

### Thread C — The one question that resolves the crux
Send this to each vendor's partnership team:
> *"Does an inbound API call (creating a provider/appointment record, or firing a webhook) initiate a credentialing case and trigger primary source verification — or does it only create a record that a specialist must then open and process manually? And how is provider attestation handled for externally-submitted application data?"*

### Thread D — Path C / front-door assist (browser automation)

AICAP's "overlay" (Path C) is really **front-door assist**: accelerate the provider's submission through the vendor's *own* portal rather than pushing data in at the back. Browser automation is the implementation. (Full reframe in the findings doc.)

**Three flavors, by who controls the attest step:**
- **Headless RPA** (Playwright/Puppeteer) — fills + submits unattended. Dead end: submitting on the provider's behalf = acting as the provider = the practice AICAP already ruled out.
- **Browser extension / overlay** — injects into the provider's logged-in session, pre-fills, provider reviews + attests. The viable form.
- **Proxy / iframe wrapper** — avoid (X-Frame-Options / CORS / auth).

**Why it's strategically clean:** the native portal handles workflow-trigger and attestation for free, and the path needs no partner program or API key — unbypassable by the vendor gate. It is the unilateral fallback and likely the fastest path to a demo.

**Why it's operationally fragile (verify before relying on it):**
- Selector/DOM drift — breaks on every vendor UI release; no versioned contract like an API.
- Per-instance customization — each hospital deployment may differ; an automation built for Vanderbilt's MD-Staff may not transfer.
- Auth/session — MFA, SSO, idle timeouts; the automation must run inside the provider's own session for attestation to hold.
- Bot-detection / ToS — vendors may detect or prohibit automated UI interaction; check the terms.
- PHI in the browser — the extension handles PHI client-side; security review needed.

**What to confirm:**
- Do the provider portals (MD-App, the Hub, Symplr provider intake) tolerate a pre-filled session, and is there any ToS clause against automated assistance?
- Can the provider's attest action be cleanly preserved while everything upstream is automated?
- Is the autofill defensible as "the provider reviewed and attested," not "software attested"?

**Substrate angle (Tokenrip):** a browser overlay that fills a form in the user's own session from structured data is a generic mounted-agent capability, reusable well beyond credentialing. Genuine substrate yield — but per the build discipline it's a by-product, not a reason to favor Path C over a cleaner API path if one proves out.

### Vendor contacts / access routes
- **Symplr:** partners@symplr.com (Certified Partner Program)
- **MD-Staff:** account / sales rep (no public developer contact); a customer hospital's MD-Staff admin can issue an API key
- **HealthStream / CredentialStream:** request access at developers.hstream.com (or via a design-partner hospital that's a customer)

---

## Confidence summary (so you know what's solid vs. inferred)

| Claim | Confidence | Why |
|---|---|---|
| All three have an inbound write API/mechanism | High | Documented for each |
| MD-Staff create + trigger-PSV endpoints exist | High | Read directly from public Help pages |
| MD-Staff API creates a *fully workable* case end-to-end | Low–Med | Docs don't say; Aiva is doc'd as MD-App-triggered |
| Symplr is record-only (no workflow trigger) | Med | No case/Task object found, but portal not fully read |
| CredentialStream is record-only | Low–Med | Pure inference — catalog is 403-walled |
| Access is partner/customer-gated everywhere | High | Explicit at all three |
| Attestation is a structural blocker | Med–High | Built into how credentialing works; not vendor-specific docs |
| CAQH ProView is a viable alternative path | Unverified | Plausible from references; needs its own dig |
| Path C (front-door assist) needs no vendor cooperation | High | UI-level; independent of partner programs and API keys |
| Path C is robust enough for production | Low | Brittle by nature — DOM drift, per-instance customization, bot-detection |
