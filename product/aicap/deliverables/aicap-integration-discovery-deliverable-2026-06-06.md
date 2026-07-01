---
title: AICAP Legacy System Integration — Discovery Findings & Recommendations
prepared_for: AICAP — Stephanie Williamson
prepared_by: Tokenrip - Simon Pettibone
date: 2026-06-06
status: Delivered
---

# AICAP Legacy System Integration — Discovery Findings & Recommendations

**Prepared for:** AICAP (Stephanie Williamson)
**Re:** Feasibility of transferring AICAP-completed application data into hospital credentialing platforms
**Date:** June 6, 2026

---

## Executive summary

AICAP set out to answer a practical question: **can a complete, verified provider application built in AICAP be moved into the credentialing platforms hospitals already use — and if so, how?** This study evaluated the three platforms named in AICAP's brief: Symplr, MD-Staff, and VerityStream CredentialStream — along with CAQH ProView, the shared provider-data repository these platforms commonly draw from. The work was desk research: published developer and product documentation, vendor materials, and credentialing implementation documentation, reported with explicit confidence levels.

The short answer is yes — application data can be moved into all three platforms — but the question that actually matters sits one level deeper: It is not "can data get in," but the one AICAP's brief poses third: can externally supplied data actually be *used* — processed through the platform's normal credentialing workflow — rather than landing as inert data someone has to re-enter by hand? On that question the answer is also broadly yes: the data can be used. What varies by platform is how much of the *full* package — the standardized core, the hospital-specific items, and the provider's attestation — a single route can carry, and that is where the caveats are.

Two findings shape the whole picture: 
1. **Production access is controlled by the hospital, not the vendor.** None of these platforms lets an outside party set up a live connection on its own; access is granted to the hospital or health system that already licenses the platform. In practice, an AICAP integration runs on the hospital's own license and authorization. 
2. **The realistic design is a hybrid, not a single clean pipe:** where a hospital-authorized direct connection is available it can carry the whole application; otherwise the standardized core travels through a route the platform already understands (most often CAQH) and the hospital-specific remainder is brought across in a short assisted step. A human review-and-approve step remains throughout, as credentialing requires.

**The fastest path forward is to build a minimum viable demo of AICAP's application-completion wedge first** — it carries standalone value whatever the delivery route, and it is the working prototype needed to recruit a pilot hospital. The deeper work then takes the shape of per-hospital deployments — the baseline engine plus each hospital's own requirements and delivery route — and that is where the integration's remaining questions get settled against a live system. This report lays out, platform by platform, what is established, what is still open, and the recommended sequence.

---

## 1. What this study set out to determine

AICAP's brief posed five questions:

1. Can application data collected by AICAP be transferred into these systems?
2. What methods are available (API, import, file exchange, or other)?
3. Can externally supplied application data be processed through the platform's *normal* workflow?
4. What authentication, attestation, audit, or governance requirements would affect integration?
5. What practical integration options appear available to AICAP?

**Method and its limits.** Findings here come from published documentation and product materials, with confidence levels marked throughout. Where a point could only be settled by exercising a live, licensed system, that is stated plainly. This matters: **documentation establishes what is possible in principle; a working build is the only way to confirm what happens in practice.** That caveat recurs because it is the single most important one in the report.

Two things to keep in mind while reading:

- "Symplr" is a portfolio, not one product. It includes an established credentialing platform, Cactus, and a newer, separate product built on modern data-exchange standards, Symplr Provider. They behave differently for integration purposes, and this report treats them separately. The analysis is deepest on Cactus, the platform a large academic medical center is most likely to be running.

- The decisive question is the spine of this study. At every turn the question that matters is AICAP's third one — *can externally supplied data actually be used, and processed through the platform's normal workflow?* It is flagged at each platform and revisited in the cross-cutting findings.

---

## 2. How data gets into these platforms — the lay of the land

Every one of these platforms takes in provider data through two distinct doors. Holding that picture makes the platform-by-platform findings easier to follow.

**The front door — the application itself.** A provider completes an application in the platform's own online portal, supplies supporting documents, and electronically attests to it. A credentialer in the medical staff office (MSO) reviews and accepts it, and the work proceeds — primary source verification (PSV), privileging, committee review. This is the path the platforms are built around, and it is where attestation lives.

**The side door — data the platform pulls in.** To avoid re-typing, these platforms can also pull provider data from outside sources:

- CAQH ProView — the industry's shared provider-data repository. Providers maintain a single profile (education, training, licenses, board certifications, work history, malpractice history, disclosures) and attest to it; platforms pull from it to pre-fill an application. **CAQH is the one shared source that carries a provider's actual application data plus their attestation** — which is why it is the outside repository that matters most here.

- Verification sources — the National Practitioner Data Bank (NPDB), the OIG and SAM exclusion lists, the NPI registry, the DEA, state license boards, and board-certification sources (ABMS). These *confirm* credentials the platform already has on file; they do not carry a completed application.

The practical implication for AICAP: the front door is where the application and attestation natively live, and **CAQH is the only side door that can carry application data.** The recommended design uses both — and the platform-by-platform findings below show that the best mix differs by platform.

---

## 3. Answer matrix

Confidence shown as **(H)** high, **(M)** medium, **(L)** low. The Symplr column reflects **Cactus** (the platform Vanderbilt and similar centers run); the separate Symplr Provider product is covered in §4.1.

| | **Symplr (Cactus)** | **MD-Staff** | **CredentialStream** |
|---|---|---|---|
| **Q1 — Data can be transferred in?** | Yes — via the provider portal, and via a separately-licensed API **(H)** | Yes — the API creates a provider plus an appointment (the credentialing unit) **(H)** | Likely yes — an API exists, but its details sit behind a sign-in wall **(M-L)** |
| **Q2 — Methods?** | Provider-portal application + record-load import; separately-licensed enterprise API; HL7 interfaces. Pulls from CAQH natively. **(H)** | REST web API (provider create + verification queue); HL7 for clinical data. Pushes rosters to CAQH; inbound CAQH pull not confirmed **(H / M)** | REST API + event notifications; provider portal; documented daily CAQH sync **(M)** |
| **Q3 — Can external data be used in the normal workflow?** | Yes — external data populates the application and is then worked normally; CAQH-pulled data is used natively. Attestation is the one piece that can't simply be imported **(H data / M full package)** | Yes, strongly indicated — the API creates the appointment the workflow attaches to and can queue verification; full equivalence to a portal-submitted application needs a live test **(M)** | Partly — CAQH-sourced data is used (documented sync); whether a direct push of a full application is processed isn't visible behind the access wall **(L-M)** |
| **Q4 — Auth / attestation / governance?** | Access controlled by the hospital; **attestation happens in the provider portal** (or via CAQH), with no documented way to import an outside attestation **(H)** | Access issued through the vendor; sensitive provider data, so expect the hospital's security review and data-handling agreements; attestation for API submissions undocumented **(M)** | Most controlled of the three (access request required); attestation appears to live in the portal **(M)** |
| **Q5 — Practical route?** | **Hospital-authorized direct connection** is the primary route where available (it can carry the whole application); otherwise route the standardized core through **CAQH** (Cactus pulls it) + a short assisted step for hospital-specific items **(M-H)** | **Direct API** (create + verify) is the most automatable route; confirm end-to-end with a live test **(M)** | **CAQH sync** is the most accessible route today; hospital-authorized API once access is granted **(L-M)** |

---

## 4. Per-system findings

### 4.1 Symplr — Cactus and Symplr Provider

**What it is.** Symplr is a healthcare-operations software company. Its established credentialing platform, Cactus, is the system of record a hospital's medical staff office uses to run credentialing and privileging. Symplr also offers a newer, separate product, Symplr Provider, built on modern data-exchange standards. The two are different for integration purposes and are addressed separately below.

**Cactus — Q1/Q2 (can data get in, and how).** Yes. The application comes in through the **provider portal**: the provider completes the application and attests, a credentialer accepts it, and acceptance loads the data into the provider's record. Cactus also offers a separately-licensed enterprise API for inbound data and HL7 interfaces for clinical data. Importantly, **Cactus pulls from CAQH natively** (a long-standing, built-in capability), which is what makes the CAQH route attractive here.

**Cactus — Q3 (can the data be used in the normal workflow — the decisive question).** Yes. Externally supplied data populates the application and is then worked through Cactus's normal process — review, verification, privileging, committee. The documented import fills the record's empty fields and does no verification of its own, so it is a starting point a credentialer works from, not a finished application; data pulled from CAQH is used natively the same way. The honest limit is the *full package*: the standardized core is clearly usable, but whether a single route can also carry the hospital-specific items and the attestation in one pass depends on the route chosen (see Q5), and for the enterprise API specifically that behavior is not documented and would need confirmation.

**Cactus — Q4 (attestation and governance).** Attestation is captured in the provider portal during completion, or carried in via CAQH (where the provider attests inside CAQH). There is **no documented way to load an externally-collected attestation** — for example, a signature captured in another system — into Cactus. Access is controlled by the hospital. The practical consequence is in the cross-cutting findings: AICAP can *capture* a genuine attestation, but whether a hospital will *accept* one captured outside its own portal or CAQH is a hospital-by-hospital policy question.

**Cactus — Q5 (recommended route).** Where a hospital-authorized direct connection (the enterprise API) is available and its behavior is confirmed, it is the primary route — it can carry the whole application through one channel. Absent that, the proven fallback is the hybrid: route the standardized core through CAQH (the provider attests there; Cactus pulls it in natively) and bring the hospital-specific remainder across in a short assisted step. Both end with the medical staff office working and approving the application as it does today.

**Confidence:** High on the portal/import behavior and CAQH-pull; medium on the enterprise API.

**Symplr Provider (the newer product) — separately.** This is a different system. It exposes provider *records* (practitioner identity, roles, documents) through a modern API, but no application object is visible in the available documentation, and nothing shows externally supplied data being processed as an application — it leans toward holding provider records rather than carrying a credentialing application that can be worked. Attestation handling is not documented, and access requires admission to Symplr's partner program. If a future hospital runs Symplr Provider rather than Cactus, these gaps would need their own confirmation. **Confidence: medium** — the public documentation could not be fully exercised.

> *Sourcing note.* The Cactus findings reflect implementation documentation reviewed for a representative deployment, corroborated by Symplr's public product materials. This report describes mechanisms in general terms and reproduces none of the vendor's proprietary specifications.

### 4.2 MD-Staff (Applied Statistics & Management)

**What it is.** MD-Staff is a credentialing and privileging platform with a modern web API — the most developer-accessible platform of the three.

**Q1/Q2 (can data get in, and how).** Yes, and this is the most promising documented path. MD-Staff's API includes an operation that creates both a provider record and an *appointment* — and the appointment is the credentialing unit, so this is more than a directory entry. A separate operation queues primary source verification and returns a tracking number. Access credentials are issued through the vendor (not self-serve). MD-Staff is also a CAQH partner, but the public partnership is about sending rosters *to* CAQH for payer enrollment; pulling application data *from* CAQH into MD-Staff is not publicly confirmed.

**Q3 (can the data be used in the normal workflow — the decisive question).** Strongly indicated. The API creates the appointment the credentialing work attaches to and can queue verification, so externally supplied data lands as something the normal workflow acts on — not inert data to be re-typed. What the documentation does not confirm is whether an application supplied through the API is fully equivalent to one submitted through the provider portal (any fields or states the portal sets that the API does not). That equivalence is the single highest-value thing to confirm with a live test.

**Q4 (governance).** Access is issued through the vendor. The integration handles sensitive provider data, so a hospital's standard security review and data-handling agreements should be expected. How attestation is enforced for data submitted through the API is not documented.

**Q5 (recommended route).** A direct API integration is the natural route here — the create and verify operations exist as callable steps — proven out with a live test. Because inbound CAQH pull is unconfirmed for MD-Staff, the CAQH route is a weaker fit than it is for Cactus.

**Confidence:** High that the operations exist; low-to-medium on whether an API-supplied application is fully equivalent, end to end, to a portal submission.

### 4.3 VerityStream CredentialStream (HealthStream)

**What it is.** CredentialStream is HealthStream/VerityStream's credentialing platform, with a developer API and a provider-facing intake product (the "Hub").

**Q1/Q2 (can data get in, and how).** Likely yes, but the specifics are not publicly visible. A REST API with event notifications exists, but the catalog of what it can do sits behind a sign-in wall and cannot be read without onboarding. What *is* publicly documented is a daily CAQH sync — the platform pulls provider data from CAQH to pre-fill applications. That makes CAQH the most accessible route into CredentialStream today.

**Q3 (can the data be used in the normal workflow — the decisive question).** Partly answerable. Data the platform pulls from CAQH is used to pre-fill applications (the documented daily sync), so CAQH-sourced data is usable. Whether a *direct* push of a full application can be processed through the normal workflow isn't visible behind the access wall. The provider-facing Hub is built around the provider completing and attesting themselves, which suggests the platform expects applications through the portal — but that is inference, not confirmation.

**Q4 (governance).** The most access-controlled of the three: a formal access request is required even to see what the API can do. Attestation appears to live in the Hub.

**Q5 (recommended route).** Routing the standardized core through CAQH (the documented sync) is the most accessible route today. A hospital-authorized API integration becomes possible once a licensed hospital grants access to the catalog.

**Confidence:** Low-to-medium throughout — driven by the access wall, not by negative findings.

---

## 5. Cross-cutting findings

Five observations hold across all three platforms and matter more than any single detail.

**1. Access is controlled by the hospital — so the integration runs on the hospital's license.** No outside party can set up a live connection on its own at any of the three. The party that authorizes it is the hospital that already owns the platform. In practice, AICAP's integration is enabled by, and operates on, the customer hospital's license and access.

**2. Can external data be used in the normal workflow? Largely yes — with bounded caveats.** The data clearly can be used: it populates the application, which the medical staff office then works as usual. What is not yet settled is whether a *single* route carries the *whole* package — standardized core, hospital-specific items, and attestation — end to end. For Cactus the standardized core is usable today (natively via CAQH); the full-package question rides on the route chosen. For MD-Staff the data lands as an appointment the workflow acts on; full equivalence to a portal submission is the open, testable item. For CredentialStream, CAQH-sourced data is usable; a direct full-application push awaits access. These are a few concrete, testable items, and a live build resolves them.

**3. Attestation can be captured; what gets *accepted* is a hospital-by-hospital decision.** An outside system *can* capture attestation — a provider can genuinely review and electronically sign, whether in AICAP, in CAQH, or in the platform's own portal. This is real attestation, not signing on someone's behalf. The real constraint is acceptance: each receiver decides whose attestation it will honor. CAQH counts attestation made inside CAQH; a hospital may accept that, or may require the provider to attest on the hospital's own application. And for Cactus specifically, there is no documented way to load an outside attestation in — it must be captured in the portal or carried via CAQH. So an AICAP-captured attestation adds completeness, but whether it is accepted in place of the hospital's own is the open, hospital-specific question — one desk research cannot answer.

**4. CAQH is a data source the platforms pull from — and the only one that carries an application.** Routing through CAQH means: AICAP helps the provider make their CAQH profile complete and correct to the receiving hospital's requirements, the provider attests in CAQH, and the hospital's platform pulls that data in. The limit is that CAQH's profile is standardized — it carries the common core but not a given hospital's specific supplemental questions or privileging detail, which still travel separately. The verification sources named earlier (NPDB, OIG, DEA, NPI, state boards, ABMS) confirm credentials but carry no application, so CAQH is the single relevant route for moving application data in.

**5. The established outside-integration pattern carries *verified results*, not *completed applications* — which tells us the sequence.** Where outside systems integrate with these platforms today, the pattern is a credentialing verification organization (CVO) returning *verified* data at the end of the process. Pushing a *completed-but-not-yet-verified* application in at the front is not yet a well-worn path. The practical implication is sequence: build it with a first hospital that runs the platform, then pursue formal vendor certification once there is a working integration to point to.

---

## 6. Summary against the brief

This section answers AICAP's requested five-part summary directly.

### What appears possible
- Moving application data into all three platforms. Every one accepts inbound provider data through a documented mechanism.
- A genuine create-and-verify connection on at least one platform (MD-Staff) — externally supplied data lands as an appointment the workflow acts on, the strongest direct path found in this study.
- Routing the standardized core through CAQH into the platforms that pull from it (Symplr/Cactus and CredentialStream), with the provider's attestation carried along.
- Capturing a complete, attested application up front, so that whatever reaches the hospital is complete to its actual requirements.

### What is not currently demonstrable
*(Little is flatly impossible; these are the hard constraints rather than dead ends.)*
- Setting up a live connection without the hospital. Access is controlled by the hospital everywhere.
- Pushing a completed-but-unverified application straight into a hospital platform's live workflow at the front. This runs opposite to the established pattern and cannot be confirmed without a live build.
- Whether an API-supplied application is fully equivalent, end to end, to a portal submission on MD-Staff and CredentialStream — testable, but not yet tested.
- Whether a hospital will accept an AICAP-captured attestation in place of its own — a per-hospital policy question.

### Major risks and constraints
- Hospital authorization — the hospital must sponsor the connection; timelines depend on its IT and vendor relationship.
- The full-package question — until tested live, a given route may carry only part of the application, leaving the rest to a manual step.
- Attestation acceptance — must be confirmed hospital by hospital.
- Currency of materials — some reviewed documentation is several years old; current product versions should be confirmed with each vendor.

### Available integration options
Four options, not mutually exclusive — the realistic design blends them:

- Hospital-authorized direct connection (preferred where available). AICAP connects to the platform's API, on the hospital's license, to supply the application and start verification. Where it is available and confirmed, it can carry the whole application through one channel. The natural fit for MD-Staff (its create-and-verify operations exist); a credible primary for Cactus via its enterprise API, pending confirmation.
- CAQH routing. Use CAQH as the channel for the standardized, attested core into the platforms that pull from it (Cactus, CredentialStream). It carries the common core, not the hospital-specific remainder.
- The hybrid (the realistic default). Combine the above with a short assisted step for whatever the chosen route cannot carry. Detailed in §7.
- Provider-portal assist. Rather than supply data through a connection, help the provider complete the platform's *own* portal faster — most concretely, a browser add-on that pre-fills the fields in the provider's own logged-in session, leaving the provider to review and attest themselves. This was raised on the discovery call and is included for completeness. In practice it is brittle — it depends on the vendor's portal not changing, carries no support guarantee, and is fragile to maintain — so it is not recommended as the backbone of an integration, at most a stopgap.

### Recommended next steps
Summarized here, expanded in §9: build a minimum viable demo of the application-completion wedge first (standalone value, and the demo needed to recruit a pilot), recruit pilots in parallel, then deploy to the first pilot as a per-hospital "completion-to-spec" build — the baseline plus that hospital's own requirements and delivery route, where the integration's last-mile gets settled.

---

## 7. How the recommended approach would work

To make the hybrid concrete, here is how it would run for a hospital on a platform that pulls from CAQH (such as Cactus). The same shape applies elsewhere, substituting the platform's own connection where CAQH is not the route.

1. The provider completes their application once, in AICAP, and electronically attests to it.
2. AICAP makes the application complete to the receiving hospital's actual requirements — every field, document, and supplemental item that specific hospital and platform need — and verifies what it can up front.
3. The standardized core flows to the provider's CAQH profile, where the provider attests. (CAQH carries the common core; the hospital-specific remainder is held for step 6.)
4. The hospital's platform pulls that data from CAQH, as it already does today, pre-filling the application.
5. The medical staff office works the application through its normal process — review, verification, privileging, committee.
6. The hospital-specific remainder is brought across from AICAP in a short assisted step — a staff member transfers the items CAQH cannot carry, working from AICAP's already-complete record. A shared reference number ties the AICAP record to the application so the two line up cleanly.
7. The medical staff office verifies and approves, exactly as it does now.

In the version above, the standardized core arrives through CAQH and only the hospital-specific remainder needs the assisted step. Where a hospital-authorized direct connection is available and confirmed, steps 3–6 collapse into a single supply step and the assisted bridge largely disappears.

---

## 8. What this means for AICAP

Several conclusions follow from the findings. They are more encouraging than a list of access controls might first suggest — and they share one theme: the variation from hospital to hospital is real, and the right approach plans for it from the start.

**The delivery route is interchangeable — so the access constraints don't threaten what matters.** Whether the application arrives through CAQH, a direct connection, or an assisted step, the route is replaceable; the same complete, verified application travels any of them. That reframes the access-control findings above: they constrain *how* an application is delivered, not *whether* a complete one can be.

**There is no cookie-cutter integration — every hospital carries a custom layer.** Even a hospital running a fully-documented platform with published APIs cannot be promised a turnkey integration, for two reasons that compound. First, each hospital sets its own application requirements on top of any baseline — AICAP's own experience will speak to how widely these vary. Second, and less obvious, each platform *instance* is licensed and configured differently: a capability that exists in the product may be a separately-priced add-on the hospital has not enabled, or configured in a way no public document reveals. The clearest example from this study is the "enterprise API" — present in the product, but typically a separate license a given hospital may or may not carry. Published documentation tells you what a platform *can* do; it cannot tell you what *this* hospital has bought and turned on.

**The facts that most affect the build live behind a licensed instance, not in any document.** Whether an API-supplied application is fully usable end to end, whether the direct connector is enabled and how it is priced, whose attestation a hospital will accept, the exact local requirements — none of this is published anywhere. That is not a gap in this research; it is the nature of the domain. It is also why a live deployment is the only real test — and why these unknowns collapse to near-zero the moment there is one licensed instance to work against.

**Because access is the hospital's to grant, AICAP integrates *through* the hospital, not around it.** No outside party can stand up a connection on its own at any of the three platforms. That rules out a standalone connector sold off the shelf and makes the hospital the partner that unlocks delivery — which is why integration is inherently a per-hospital effort, not a single build done once.

**The result is a reusable baseline plus a bounded per-hospital layer — not endless bespoke work.** The variation is real, but it is not chaos. The baseline engine — turning documents into a complete, verified, attested application — is built once and reused everywhere. The custom layer — a hospital's specific requirements and its delivery route — is a contained, repeatable increment per deployment. That argues for building the engine to treat "hospital-specific requirements" as a configurable input from the start, rather than patching for each hospital after the fact.

**So the integration is an optimization, not an all-or-nothing proposition.** Because a complete application is valuable however it is delivered, no single route is do-or-die. The realistic design blends routes — a direct connection where available, CAQH for the standardized core elsewhere, and a short assisted step for whatever the chosen route cannot carry, shrinking as more of it is automated per platform.

---

## 9. Recommended path forward

**The desk-research phase has gone as far as published documentation allows.** The questions that remain — whether a given route carries the whole application end to end on a specific platform, and whose attestation each hospital will accept — cannot be settled from documents; they are settled only against a live system. The recommended sequence puts the highest-value, lowest-dependency work first and builds toward those answers.

**1. Start with a minimum viable demo, not the whole product.** The immediate next step is the smallest credible slice of the application-completion pipeline — enough to show the wedge on real examples: documents in, a mostly-complete, verified, attested application out. It carries standalone value *regardless of which delivery route is eventually used*, it proves return on investment internally and with the informal partners already evaluating AICAP, and — critically — it requires no hospital partner to begin, so it can start now rather than waiting on a partner to be lined up.

**2. Pursue a pilot in parallel — don't wait for a finished product.** The demo is enough to open pilot conversations, and the build continues alongside them rather than being gated by them. The integration-specific criterion worth applying when choosing a pilot: one that already runs one of these platforms and will authorize access on its license — that is what turns the remaining open questions into answers. Where and how to find that partner is AICAP's call.

**3. Then deploy to that pilot as a "completion-to-spec" build.** This is where the findings in this report are put to work — and it is best understood as a per-hospital deployment, not a one-time integration. Every deployment has two layers: (a) the baseline engine, and (b) that specific hospital's own requirements on top of the baseline, plus the delivery integration into that hospital's platform, on its license (a direct connection where available, otherwise CAQH for the standardized core and a short assisted step for the remainder). A live deployment is also what finally settles the open questions — whether the chosen route carries the whole application end to end, and whose attestation the hospital accepts. Formal certification with the platform vendor is best pursued afterward, from the strength of a working deployment rather than a cold request.

This sequence builds on and updates the phased engagement already discussed. What discovery adds is a clearer picture of what production-readiness actually requires for integration, and the recognition that each deployment is two-layer — a reusable baseline plus a per-hospital layer. The discovery study credits toward the build, and the team that conducted it is positioned to start on the demo now and carry it through to the first hospital deployment.

---

## Appendix: Selected public sources

The references below are the public sources reviewed during this discovery, provided so AICAP can verify the findings or dig further. The list is selective, not exhaustive, and contains only publicly available material. Several vendor developer portals require vendor onboarding to view in full; those are marked *access-gated* — the link confirms the portal exists, not that its contents are open.

**MD-Staff (Applied Statistics & Management)**
- MD-Staff Web API reference (live) — https://prime.api.asm-cloud.com/Help — the public API help; shows the provider-create and verification-queue operations.
- MD-Staff API environment / playground — https://halifax.api.asm-cloud.com/playground/index — a second live API environment.
- MD-Staff platform overview — https://www.mdstaff.com/product/md-staff/
- MD-App provider application portal — https://www.mdstaff.com/product/md-app/ — the native provider-facing front door.
- Aiva credentialing assistant — https://www.mdstaff.com/aiva-your-credentialing-assistant/ — the workflow-automation engine (documented as portal-driven).
- Integration & security posture — https://www.mdstaff.com/why-md-staff/secure-integration/
- MD-Staff × CAQH partnership — https://www.prnewswire.com/news-releases/md-staff-caqh-work-together-to-make-sharing-provider-data-easier-and-more-accurate-for-groups-300803605.html — establishes roster generation *to* CAQH.

**Symplr — Cactus & Symplr Provider**
- Symplr Credentialing Suite — https://www.symplr.com/products/symplr-credentialing-suite — the suite that includes Cactus.
- Symplr Provider (the newer FHIR-based product) — https://www.symplr.com/products/symplr-provider — distinct from Cactus.
- CIO Guide to symplr Products (2025) — https://www.symplr.com/wp-content/uploads/2025/04/CIO-Guide-to-symplr-Products-2025.pdf — Symplr's own product map; distinguishes the portfolio.
- Symplr Certified Partner Program — https://www.symplr.com/press-releases/symplr-announces-certified-partner-program — establishes that API access is gated through the partner program.
- Symplr Provider FHIR API documentation — https://apidoc.symplr.com/ — *access-gated / intermittent*; the FHIR resource surface.

**VerityStream CredentialStream (HealthStream)**
- CredentialStream overview — https://www.healthstream.com/solution/credentialing/healthcare-credentialing-privileging-enrollment-software-credentialstream — states CAQH import / daily sync.
- VerityStream CredentialStream — https://www.veritystream.com/credentialstream
- The Hub (provider intake) — https://www.veritystream.com/solution/the-hub — the attestation-centric provider front door.
- hStream developer portal — https://developers.hstream.com/apis (overview: https://www.healthstream.com/platform/developer-portal) — *access-gated* API catalog.

**CAQH ProView**
- CAQH Credentialing / Provider Data Suite — https://www.caqh.org/solutions/provider-data/credentialing-suite
- CAQH connector (technical reference) — https://docs.mulesoft.com/caqh-connector — a public integration connector, showing API-level CAQH integration exists.

**Industry precedent — Andros (formerly CredSimple)**
- Andros / CredSimple API documentation — https://api.credsimple.com/v1/docs.html — browsable; includes the provider-import operation (the completed-application-in pattern, into a verification organization).
- CredSimple × Symplr integration — https://www.symplr.com/press-releases/credsimple-symplr-partner-to-offer-customers-seamless-integration — a precedented third-party-to-platform integration (verified results).

---

*Prepared June 6, 2026. Findings reflect documentation and materials reviewed during the discovery phase; current product versions and access terms should be confirmed with each vendor. This report describes integration mechanisms in general terms and reproduces no vendor's proprietary specifications.*
