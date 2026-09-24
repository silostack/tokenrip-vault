---
contact: Stephanie Williamson
company: AICAP
date: 2026-08-22
type: Scoping response — Self-Serve Demo (next phase after the Validation MVP)
status: v5 — updated 2026-08-30 with Stephanie's decisions (option B, ID optional; robust retention; tracing; per-person logons); Tokenrip artifact still at v2
owner: Simon Pettibone
build_state_source: ~/projects/maxi/clean-aicap/docs/STATUS.md (synced 2026-08-21)
published: https://tokenrip.com/s/acfb440b-be7e-4d99-919b-7705e17ecf39
---

# AICAP Self-Serve Demo: scope

**Prepared for:** Stephanie Williamson, AICAP
**Prepared by:** Tokenrip (Simon Pettibone)

## Executive Summary

The Self-Serve Demo Brief defines the experience. A Medical Staff leader or executive opens a link, works through the application one question at a time, and finishes thinking "that was surprisingly simple." Nobody from AICAP is in the room.

Most of that brief is either built or is close-out polish on the Validation MVP. The brief leaves one thing open, and that one thing decides nearly all of the engineering in the next phase: whose documents the tester uploads. A demo on AICAP's sample CVs only has to work on those samples. A demo where a CMO drops in their own CV and license has to work on whatever a stranger brings, which means more testing, more format handling, and more care with the data.

This document covers four things:

1. Where the Validation MVP lands, so that a sample-only self-serve demo is clearly defined.
2. The two ways to let testers bring their own documents, and the work each one implies.
3. The add-ons that do not depend on that choice.
4. The decisions AICAP made on August 29, which the proposal is built on.

## Where the MVP lands: a self-serve demo on sample documents

The following table maps the brief's six stages onto the build. Items in the right column close out under the Validation MVP, not the next phase.

| Brief stage                                        | Built                                                                                                                                                                                                                         | Closing out under the MVP                                                                                                                                         |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Welcome                                            | A provider opens a link and lands on a four-stage journey: Documents, Clarifications, Review and sign, Complete.                                                                                                              | A welcome screen written to the brief's message.                                                                                                                  |
| Guided application, one question at a time         | The interview shows one card at a time with a progress bar. License, employment, training, affiliation, and practice-location questions are driven by what the CV says. The palette matches the AICAP portal as of August 21. | Wording and ordering tuned to the brief's tone.                                                                                                                   |
| Intelligent reasoning, shown rather than explained | The system reads the CV and ID, presents pre-filled answers as confirmations, turns gaps and contradictions into questions, and asks only about unresolved items.                                                             | A pass to remove any on-screen text that explains the AI.                                                                                                         |
| Completed application                              | Submission produces two PDFs: the application, a plain-language audit trail.                                                                                                                                                  | The application PDF rebuilt into the three layers agreed on August 13: red flags and pending items, then line by line, then a generic printed-application layout. |
| Coordinator workspace                              | Status badges match the brief's three: Attention required, Pending/action items, and Ready. Case detail has Overview, Application, Issues and follow-up, and Audit tabs.                                                      | Issue wording cleaned up for a non-technical reader.                                                                                                              |
| Organizational value                               | Follows from the preceding stages.                                                                                                                                                                                            | A closing screen that shows what reached the coordinator complete.                                                                                                |

With that close-out, AICAP has a self-serve demo it can send, on sample CVs and IDs that AICAP provides. That is the Validation MVP's deliverable, and it proves the flow. It cannot prove the brief's own success criterion, that AICAP understands the provider's CV, because the tester is looking at a fictional doctor. The next phase exists to prove that.

## The next phase lets testers bring their own documents

There are two ways to do it, compared in the following table.

| | A. Real CV, sample ID | B. Real CV and real ID |
|---|---|---|
| What the tester brings | Their own CV, plus a sample ID that AICAP provides. | Their own CV, and their own license or passport if they choose to include it. |
| What the tester experiences | "It read my career." | "It read my career and my license. This is the real thing." |
| What AICAP learns | Whether extraction and questioning hold up on real CVs, which is the hard part of the product. | The same, plus the ID path, and whether a CMO will upload a license to AICAP at all. |
| Sensitive data involved | Low. A CV is a professional document the tester already circulates. | Higher when an ID is included. Government ID and date of birth. The demo does not collect SSN, and says so. |

### Work that option A implies

Option A requires four pieces of work:

- **CV in any format.** Testers bring Word documents, Google Docs exports, and scanned images. The build accepts PDF, JPG, PNG, and plain text. It does not accept Word. Tokenrip adds conversion ahead of extraction, and anything else gets a clear "we can't read this format" message instead of a failure.
- **A graceful bad read.** When the model reads a CV poorly, the provider must see a few more questions, not nonsense. The design handles this, but is not yet proven across a wide range of CVs.
- **A real-CV test corpus and regression gate.** This means varied CVs (different lengths, specialties, foreign training, messy scans), a scripted end-to-end run, and an accuracy check that runs before each release and whenever the AI vendor changes a model. The CV extraction check is failing on an upstream model change with no code change on AICAP's side, the same issue described on August 13. This corpus is what catches the next one before a tester does. It is the largest single item in the phase.
- **Consent and notice.** One plain-language screen before upload: what is collected, what it is used for, how long it is kept, and how to have it removed.

### Additional work that option B implies

Option B adds five more:

- **ID in any format.** A phone photo is the normal case. The build does not accept HEIC, the iPhone default, and rotated or low-light photos have not been tested. Tokenrip adds conversion, auto-rotate, and a "we couldn't read this, try again" path.
- **Upload from the phone while working on the laptop.** This is the virtual-notary pattern raised on August 13: a QR code on the upload screen, phone camera capture, and the document appears in the laptop session. For a CMO who does not have a scan of their license handy, this is the difference between finishing and abandoning.
- **An ID test corpus.** Smaller than the CV corpus, covering license and passport layouts from a range of states and lighting conditions.
- **Data handling for real IDs.** The build keeps uploaded documents in the database so that the coordinator can reopen them. For real IDs that means encryption at rest, access limited to named AICAP staff, no document contents or sensitive values in logs or error reports, and a working delete-on-request path.
- **AI account under AICAP's name.** The product reads documents through the OpenAI API platform, which is a separate product from ChatGPT with its own account and billing. API data is not used to train OpenAI models, and inputs are retained for up to 30 days for abuse monitoring, then deleted. Zero data retention is available on request through OpenAI sales, and a healthcare addendum exists for PHI, which a credentialing demo does not contain. AICAP opens the platform account and adds Tokenrip as a member, so that all inference, including the test runs, bills to AICAP from the start.

### The ID is optional under option B

A tester who does not want to upload an ID can skip it. The application then asks directly for the fields the ID would have supplied: current home address, date of birth, and sex. This is the better source for address in any case, because an ID often carries an old one. When an ID is uploaded, the system uses it to pre-fill those fields and to cross-check the name against the CV, and the tester confirms. Skipping the ID removes no work from option B, because the ID path still has to hold up for the testers who use it.

### Retention: robust from the start

Real documents from real testers are the most useful test corpus AICAP will have. They make the regression gate meaningful, and they let AICAP re-verify the product when the AI vendor ships a new model. AICAP keeps uploaded documents under the protections listed under option B (encryption at rest, named-staff access, scrubbed logs, delete on request), with a consent and disclosure screen before upload and a 12-month retention window. If the disclosure turns out to deter testers, AICAP can relax it to a per-tester opt-out later. A pilot sets its own window with the hospital.

## Add-ons that do not depend on A or B

Three add-ons are available under either option:

- **Tester access with tracing.** One logon per person, reusable across as many applications as they want to try. A per-tester view shows what each person did and where they stopped. The audit trail is per application, not per person. A tester can request a logon for a colleague from inside the product; the request goes to AICAP, which creates the logon. Testers cannot create or forward access themselves, because a shared logon would expose one tester's real documents to another.
- **Text message on submission.** "Your application has been submitted," raised on August 13 as the likely wow moment. The system already queues outbound messages. What is missing is a sending service.
- **In-product feedback prompt.** A short prompt at the end of the journey, so that the reaction is captured at the moment of impression rather than in a survey a week later.

### Deferred by design

The following items are named so that they do not creep back in:

- Coordinator outreach automation: email and phone to providers, offices, and institutions.
- External registry checks (NPI, state boards). Hospitals already have this.
- Per-hospital application layouts and configuration. This belongs to a paid pilot.
- Email delivery to the provider or coordinator. An "Email available in production" placeholder stands in, per August 13.

## Decisions made

AICAP decided the following on August 29:

1. **Option B, with the ID optional.** The demo does not collect SSN.
2. **Retention.** Robust security, disclosure, and retention from the start, with the option to relax to opt-out later.
3. **Add-ons.** Tester tracing is in. The in-product feedback prompt is out. Text message on submission is priced as an optional line.
4. **Access.** One logon per person, reusable across applications, with a request-for-a-colleague path that routes to AICAP.

The proposal that accompanies this document prices that scope. Under it, the CV corpus and regression gate start first, because everything else is tested through them.
