---
contact: Stephanie Williamson
company: AICAP
date: 2026-08-30
type: proposal — Self-Serve Demo phase (follows the Validation MVP SOW)
status: v1 draft
owner: Simon
pairs_with: ../../../product/aicap/aicap-self-serve-demo-scope-2026-08-22.md
supersedes: n/a — new phase; the Validation MVP SOW (2026-06-22) closes on acceptance and handoff
---
# AICAP Self-Serve Demo — Statement of Work

**Prepared for:** Stephanie Williamson, AICAP   
**Prepared by:** Simon Pettibone   
**Fee:** $18,000 fixed, plus AI usage billed directly to AICAP   
**Length:** \~9 weeks from kickoff   
**Valid through:** 2026-09-19

---

## Summary

Simon would build the AICAP Self-Serve Demo: the Validation MVP, opened up so that Medical Staff leaders and executives work through it on their own, with their own CV and, if they choose, their own ID.

Everything in this phase follows from that change. Until now, every document in the system was a sample AICAP prepared. A stranger's CV arrives in a format nobody chose, reads worse than a sample, and still has to produce a sensible application. Proving the product can do that takes a large library of test documents and an accuracy check that runs the whole library before any improvement ships. That testing engine is the largest item in the phase, and it is what makes the demo safe to put in front of a CMO.

The Validation MVP closes on acceptance and handoff under the current engagement, including the agreed polish and the move onto AICAP's own server and AI accounts. Everything in this Statement of Work is new scope.

---

## Scope

**Real CV, optional real ID.**

- A tester uploads their own CV in whatever format they have. Common file types are read directly; anything else gets a clear "we can't read this format" message rather than a failure.  
- They add their driver's license or passport by file or phone camera, or skip it. When they skip it, the application asks for the few details the ID would have supplied and moves on. When they include it, the system pre-fills those details, cross-checks the name against the CV, and the tester confirms.  
- Upload from the phone while working on the laptop: the tester points their phone camera at a code on the screen, snaps the document, and it appears in their session.

**The testing engine.**

- A library of varied real CVs (different lengths, specialties, foreign training, messy scans) and a smaller library of IDs. It grows with every corner case found, and every document a tester uploads can join it under the retention policy below.  
- An automatic accuracy check that runs the entire library through the product and verifies the results. Every improvement passes this check before it ships. The same check runs whenever the AI vendor changes a model, so a vendor-side change is caught before a tester sees it.

**Document reading: build and buy.** Reading a document is three different jobs, and the answer differs per job. Turning an uploaded file into readable text stays in-house: every answer the system extracts traces back to the exact place in the document it came from, and the audit trail depends on that. Reading a license or passport is bought from Microsoft's document-reading service, which already reads every US state's license layout and handles phone photos, at pennies per document, under Microsoft's healthcare terms. Understanding a CV is built, because it is the product: no vendor reads a physician CV and knows which questions a Medical Staff Office would ask. General document-AI services (Unstructured and similar) were considered and set aside; they prepare documents for chatbots and search, and cannot support AICAP's audit trail.

**Security, disclosure, and retention.** AICAP chose robust from the start. In practice:

- Before anything is uploaded, the tester sees one plain-language screen: what is collected, which AI services read it (OpenAI and Microsoft), how long it is kept, and how to have it removed.  
- While it is held, documents live on AICAP's own server in locked (encrypted) storage. Only named AICAP staff can open them. Document contents never appear in system logs or error reports.  
- The server itself is hardened to production practice: a system firewall, log-in by named keys only, automatic security updates, encrypted backups, and monitoring that raises an alert when something fails.  
- Deletion takes one request. Anything not deleted on request is deleted automatically after 12 months.  
- If the disclosure turns out to deter testers, AICAP can relax it to a per-tester opt-out later without rebuilding anything.

**Access and tracing.**

- One logon per person, reusable across as many applications as they want to try. Testers cannot forward access, so one tester's documents are never visible to another.  
- A per-tester view for AICAP: who did what, and where they stopped.  
- A "request access for a colleague" action that sends the request to AICAP, which creates the logon.

**Optional: text message on submission.** "Your application has been submitted," sent to the tester's phone. Priced separately below so AICAP can decide later.

---

## Out of scope

- Coordinator outreach automation (email and phone to providers, offices, and institutions).  
- External registry checks (NPI, state boards).  
- Per-hospital application layouts and configuration; belongs to a paid pilot.  
- The in-product feedback prompt, per AICAP's decision.  

---

## Deliverables

- The self-serve demo: the Validation MVP workflow, accepting a tester's own CV and optional ID, from a logon through a completed application and both PDFs.  
- The testing engine: the document library and the automatic accuracy check, runnable by AICAP after handoff.  
- The consent and disclosure screen, the encrypted document storage, the delete-on-request path, and the hardened server configuration.  
- The access model: named logons, the per-tester tracing view, and the request-access-for-a-colleague path.  
- Optional, if taken: the text message on submission.  
- Documentation for all of the above, updated from the MVP handoff set.

---

## What AICAP provides

The build depends on inputs only AICAP can supply. The timeline assumes these arrive on schedule:

- The OpenAI account and the Microsoft account, opened by AICAP with Simon added as a member. Setup for each is about 20 minutes; the separate handoff guide walks through it.  
- The server account under AICAP's name (part of the MVP handoff, already in motion).  
- Seed CVs and IDs for the test library, de-identified or real with consent. Every one makes the accuracy check stronger.  

---

## Timeline

Eight weeks from kickoff, demo-driven, on real documents from the start.

| Week | What happens                                                                                                              |
| :--- | :------------------------------------------------------------------------------------------------------------------------ |
| 0    | Kickoff call. Lock test-library sources and disclosure wording.                                                           |
| 1–2  | Test library assembly and the accuracy check. Consent and disclosure screen. Demo.                                        |
| 3–4  | CV formats and documents that read poorly. Real-CV testing against the library. Demo.                                     |
| 5–6  | ID path: Microsoft integration, phone capture, ID-optional flow. Secure storage, server hardening, the delete path. Demo. |
| 7    | Access model, tracing, request-for-a-colleague. Optional text message. Demo.                                              |
| 8    | Break-it testing with AICAP, fixes, acceptance.                                                                           |

---

## Cost

| Item | Amount |
| :---- | :---- |
| Self-serve demo phase, everything in scope except the text message | **$18,000 fixed** |
| Optional: text message on submission | $500 |
| AI usage (OpenAI), billed to AICAP's account | Estimated $1,000–$2,000 over the build; tens of dollars a month once idle; pennies per demo run |
| ID reading (Microsoft), billed to AICAP's account | Under $50 total |

The AI estimate is driven by the testing engine: the accuracy check runs several times a week during the build, over a growing library. The idle cost afterward is that same check re-running on a schedule and whenever the AI vendor changes a model. Simon sets a monthly cap on the account and reports usage weekly.

---

## Ownership

The ownership terms of the Validation MVP SOW carry forward unchanged. AICAP owns everything built in this phase and everything specific to AICAP: the demo, the test library, the configuration, the disclosure content, and the documentation. On acceptance these are AICAP's outright.

---

## Handoff

The phase starts on AICAP's accounts, so there is no migration at the end: from week 1 the system runs on AICAP's server and AICAP's AI accounts. At acceptance, AICAP additionally receives:

- The test library and the accuracy check, with instructions for running both.  
- Updated source, configuration, and documentation.  
- A walkthrough of the tracing view and the logon administration.

The handoff is complete when AICAP can invite a tester, watch their progress in the tracing view, and run the accuracy check without Simon's involvement.

---

## Acceptance criteria

The Self-Serve Demo is accepted when, in a live walkthrough with AICAP:

1. A tester's own CV in the common file formats produces a completed application; an unsupported format produces the "we can't read this format" message.  
2. The ID step works both ways: skipped, the application asks for the details the ID would have supplied; included, it pre-fills them, cross-checks the name against the CV, and the tester confirms. Phone capture by pointing the camera at the on-screen code works end to end.  
3. The accuracy check runs the full test library and passes the bar agreed at kickoff, demonstrated live.  
4. The disclosure screen appears before any upload; a delete-on-request is executed and verified during the walkthrough; documents are encrypted in storage and absent from logs.  
5. Each tester has their own logon, sees only their own applications, and appears in AICAP's tracing view; the request-access-for-a-colleague path delivers a request to AICAP.  
6. The whole system runs on AICAP's server and AICAP's AI accounts.  
7. If taken: the text message arrives on submission.