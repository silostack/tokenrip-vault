---
title: AICAP Integration Discovery — Outreach Emails
contact: Stephanie Williamson
company: AICAP Access
date: 2026-06-02
status: drafts — ready to send
owner: Simon Pettibone
pairs_with: aicap-integration-feasibility-findings-2026-06-02.md
---

# Outreach Emails — Integration Discovery

> **Sender strategy.** The four vendor/CAQH emails can go from Simon as "engineering lead working with AICAP Access" (cc Stephanie, or send under AICAP with her blessing). **Email 5 must come from Stephanie** — it leverages her Harvard relationship, and the research is clear that *customer-routed* access (the hospital asking the vendor) is the real unlock, not a cold partner inquiry. If you only send one thing, send #5.
>
> Every email asks the same load-bearing question in its own words: *does inbound completed-application data open a case and trigger the workflow, or just create a record — and how is attestation handled?* That's the question every public doc dead-ends on.

---

## Email 1 — Symplr Partnerships (`partners@symplr.com`)

**Subject:** Partner integration — submitting completed provider applications into symplr Provider

Hi symplr Partnerships team,

I'm the engineering lead working with AICAP Access, a healthcare startup building pre-intake intelligence for physician credentialing. We complete a provider's application — document extraction, compliance checks, gap-fill — up to the point of primary source verification, and we're scoping how that completed data would flow into symplr Provider at a hospital that already runs it.

Two questions before we go further:

1. Is there a certified-partner path for a *completion* vendor (not a CVO) to submit a completed provider application into symplr Provider so that it opens a credentialing case and triggers the downstream workflow — rather than only creating a provider record a specialist still has to open and process manually?
2. How is provider attestation handled for externally-submitted application data?

We're glad to go through the Certified Partner Program; we just want to confirm the pathway and feasibility first. Could you point me to the right person or docs?

Thanks,
Simon

---

## Email 2 — HealthStream / CredentialStream (developer relations / partnerships)

**Subject:** hStream developer portal access + Credentialing API question

Hi HealthStream team,

I'm the engineering lead working with AICAP Access, a healthcare startup that completes physician credentialing applications (extraction, compliance review, gap-fill) up to primary source verification. We're scoping an integration with CredentialStream for hospitals that run it, and the hStream developer portal's API catalog isn't reachable without access.

Could you grant developer-portal access, or point me to the partner path? And two questions the public pages don't answer:

1. Does the Credentialing API have an inbound endpoint that accepts a completed application and initiates a credentialing case plus primary source verification — or does it only create/update a provider record that staff then process manually?
2. How is provider attestation handled for API-submitted application data?

Appreciate any pointers.

Thanks,
Simon

*(Portal access request: developers.hstream.com — "Request Access".)*

---

## Email 3 — MD-Staff / Applied Statistics & Management (sales / account)

**Subject:** API access for a partner integration — application intake

Hi MD-Staff team,

I'm the engineering lead working with AICAP Access. We complete physician credentialing applications — document extraction, compliance checks, gap-fill — and want to scope getting that completed data into MD-Staff for a hospital that runs it.

I've reviewed the public Web API help pages (`providers/new`, the `verify/batch` endpoints, etc.). Before we build, two questions:

1. If we create a provider and appointment via the API and queue verifications via `verify/batch`, does that produce the same workable credentialing case an MD-App submission does — i.e., does it drive the Aiva workflow — or does it leave a record plus detached verification jobs that staff still have to assemble into a case?
2. What's the path for a third-party partner, working on behalf of a hospital customer, to get API credentials — and how is provider attestation handled for API-submitted data?

Could you connect me with the right person? Happy to work under the hospital's account if that's the model.

Thanks,
Simon

---

## Email 4 — CAQH (Participating Organization inquiry)

**Subject:** Participating Organization + provider data population question

Hi CAQH team,

I'm the engineering lead working with AICAP Access, a healthcare startup that completes physician credentialing applications. We're evaluating populating providers' CAQH profiles as part of our workflow.

Three questions:

1. What's involved in becoming a Participating Organization with API access, and what are the commercial terms?
2. Beyond the Practice Manager Module bulk upload (which covers the shared sections), is there any programmatic path to pre-populate a provider's full credentialing profile — education, work history, licenses, malpractice — on their behalf, with the provider then attesting?
3. Can you confirm the attestation model — the provider performs the final attestation themselves?

Thanks,
Simon

---

## Email 5 — Design-partner hospital → **sent by Stephanie** (e.g., Harvard contact)

**Subject:** Quick favor — credentialing system API / sandbox access

Hi [name],

Quick one. We're building the AICAP integration that connects our pre-intake layer into [Symplr Provider / CredentialStream / MD-Staff], and to scope it properly we need to see the system's integration documentation and ideally a sandbox.

These vendors gate API access behind the customer — you — rather than opening it to partners directly. Two ways you could help, whichever is easier:

- Connect me and our engineer, Simon, with your IT team or your [Symplr / HealthStream / MD-Staff] account rep, or
- Request developer / API / sandbox access on our behalf, as the customer.

It's the fastest way to confirm exactly how AICAP plugs in. Happy to hop on a call with your IT team if that's easier.

Thanks so much,
Stephanie

---

*Fill in the bracketed system name per recipient. For Email 5, pick the system that hospital actually runs.*
