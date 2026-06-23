---
contact: Stephanie Williamson
company: AICAP
date: 2026-06-22
type: Statement of Work (Validation MVP) — revised after her redline of the 2026-06-17 proposal
status: draft — for Simon's review before send
owner: Simon Pettibone
supersedes: bd/calls/proposals/stephanie-williamson-2026-06-17-discovery-updated.md
---

# AICAP Validation MVP — Statement of Work

**Prepared for:** Stephanie Williamson, AICAP
**Prepared by:** Tokenrip (Simon Pettibone)
**Fee:** $12,000, less the $1,000 discovery already paid, for $11,000 net
**Length:** ~7 weeks from kickoff
**Valid through:** 2026-07-15

---

## Summary

Tokenrip would build the AICAP Validation MVP: an AI-assisted application completion workflow that helps providers produce complete, credentialing-ready applications with minimal manual effort.

The workflow takes a provider from the start of an application to a complete, credentialing-ready submission in a single guided pass. On submission it produces two documents: the completed application and an audit trail. The engagement has a defined deliverable and a clean handoff. Work beyond it is separately scoped.

---

## Scope

The workflow covers the requirements that recur across specialties. The provider experience stays as AICAP designed it: the applicant sees only what they need to answer, guided toward a complete, credentialing-ready application, never a raw form.

**The five surfaces:**

1. **Application autofill from provider-supplied inputs.** At the start of an application a provider usually has their CV and a government ID (driver's license or passport). The workflow extracts structured fields from those and pre-fills the application wherever the source is unambiguous, including identifiers that appear on the CV, such as an NPI or license number. For identifiers that are not in the documents, the DEA registration number, NPI, or license number, the provider supplies them in the guided flow. The provider sees an application already mostly populated, not a blank form. The exact input list is locked at kickoff.

2. **Context-aware field expansion.** When the CV implies a fact, for example faculty member at a named medical center, the workflow populates the adjacent fields (hospital affiliation, malpractice coverage, work-history scaffolding) instead of asking the provider to repeat what is already there.

3. **Automated compliance review.** Every field is checked against AICAP's compliance bar (the Joint Commission, CMS, and NCQA-relevant items AICAP provides), sorting items into compliance-ready versus needs-follow-up before any review begins. Requirements that vary by state or hospital stay configurable, so the bar can be set to a specific destination's rules.

4. **Provider review and confirmation.** Where the workflow has inferred or pre-filled an answer, it presents that answer for the provider to confirm, edit, or reject. This is a review step, not a blank form: the provider checks the system's work rather than re-entering it. Only the provider confirms or edits their own information. Nothing is answered on their behalf, and nothing auto-submits. Whether this stays a distinct step or merges into the guided intake below is validated once the first three surfaces are running.

5. **Guided intake for the residual unknowns.** For anything the workflow could not infer at all, it asks the provider a short, targeted question rather than presenting a full form. Where the provider cannot resolve an item alone, for example verifying a prior affiliation, the workflow surfaces who can, such as the office manager at that prior practice. Any item still unresolved at submission is flagged for the credentialing coordinator, so on receipt they know an early task is to reach out for what is missing.

**What AICAP provides.** The build is configured against inputs only AICAP can supply: the compliance checklist (the Joint Commission, CMS, and NCQA-relevant items the workflow checks against); the baseline configuration requirements (application fields and forms, attestation questions, history windows, affiliation, malpractice, and distance rules); the guided-question content that walks a provider to a compliant answer; and the de-identified (identifying details removed) sample applications to build and test against. The kickoff call locks what is needed and when. Timeline assumes these arrive on schedule.

**Built once, configurable per destination.** The workflow is a reusable core that treats a destination's requirements as configurable inputs: its forms, logo, application and attestation questions, state-specific forms, history windows (the seven and ten year variations), affiliation and malpractice requirements, and distance rules. The MVP is built against one baseline configuration agreed at kickoff. Configuring it to a specific hospital's full requirements is part of that hospital's separately-scoped deployment.

**The workflow in use.** The credentialing coordinator starts an application from a minimal admin view, which emails a link to the provider. The provider logs in and works with AICAP to complete the application: documents and numbers in, the review step, guided questions for whatever is left, then attestation. On submission, AICAP generates the two documents, the completed application and the audit trail, stores them, and emails them to the coordinator who started the application.

The same admin view gives AICAP the visibility to run and debug a system it owns: the applications processed and their status, errors surfaced with their cause, basic counts, and the generated documents. It is there to operate the system, not to watch a queue. It is not a monitoring view for tracking applications in progress; AICAP's team keeps working from the tools they use today and acts on the items flagged for follow-up.

**Not included in the Validation MVP.** Integration into a hospital's credentialing software (the MVP leaves a configurable space for that connection; the connection itself is a separately-scoped deployment). Per-hospital configuration beyond the one baseline built at kickoff. Live production use with real provider data: the MVP is built and accepted on sample, de-identified applications, and handling real provider data, the secure storage it requires, the hospital's own security requirements, and the AI provider's data terms are part of a pilot deployment, not the MVP. Privileging.

---

## Deliverables

- The AICAP Validation MVP: the working workflow described above, accessible to AICAP, taking a provider from start to a complete, credentialing-ready application in a single guided pass.
- The provider intake and a minimal admin view: the coordinator starts applications and receives the documents by email; AICAP gets the processed-application list, errors surfaced for debugging, basic counts, and access to the generated documents.
- The two generated documents on each submission, the completed application and the audit trail, stored and emailed to the coordinator who started the application.
- One baseline configuration, built against the requirements AICAP provides at kickoff.
- A configurable space left open for a future integration into a hospital's credentialing software.

---

## Timeline

Seven weeks from kickoff, demo-driven, on real example applications throughout.

| Week | What happens |
|---|---|
| 0 | Scoping call. Kickoff. Lock inputs, the baseline configuration, and the compliance-checklist scope. |
| 1 | Application autofill live on sample inputs (CV, ID, extracted and entered numbers). Context-aware expansion calibrated. |
| 2 | Automated compliance review calibrated against AICAP's checklist, configurability in place. Demo. |
| 3 | Provider review step and guided intake live. Demo. |
| 4 | Two-document generation end to end, plus coordinator retrieval. Demo. |
| 5 | Full run on the sample set, unresolved items flagged for follow-up. Demo. |
| 6 | Iteration tail, edge cases. Demo. |
| 7 | Acceptance and handoff. |

The weekly demos exist so AICAP can spot any slippage as it happens. Move the schedule either direction as needed.

---

## Cost

$12,000, less the $1,000 discovery already paid, for **$11,000 net**.

Payment in two halves. The first half ($5,500) is due at kickoff and is fully refundable through day 30: if the build is not on track by then, AICAP says so and that half is returned in full, no questions asked. The second half ($5,500) is due on acceptance, when the Validation MVP meets the criteria below. The weekly demos fall inside the refund window, so AICAP is judging real progress before it closes.

---

## Ownership

AICAP owns the Validation MVP and everything specific to AICAP: the workflow, the application and credentialing logic, the compliance encoding, the configuration, the generated output, and the deployed instance. On final payment these are AICAP's outright.

Tokenrip retains its pre-existing, general-purpose components, the underlying document-extraction and data-processing technology it brings to the work and reuses across projects, and grants AICAP a perpetual license to use them as part of the delivered MVP.

The result: AICAP has full ownership and control of the product and its IP, with no dependency on Tokenrip to run it.

---

## Handoff

On acceptance and final payment, AICAP receives a working system it controls, not a code drop to figure out:

- The deployed Validation MVP, hosted and configured, that AICAP logs into and uses, including the admin view for running and debugging it. The hosting account is in AICAP's name.
- It runs on AICAP's own AI provider account (such as Anthropic). Tokenrip sets this up with AICAP and configures the workflow to use it, so usage and cost sit with AICAP and nothing depends on Tokenrip's accounts.
- The complete source and configuration for the AICAP-specific workflow, transferred to AICAP, so any engineer can run or change it later.
- Documentation: how to use the workflow, how to adjust the baseline configuration, and how the two documents are generated.
- A walkthrough so AICAP's team can operate it without Tokenrip.

The handoff is complete when AICAP can run the workflow, process an application end to end, and generate both documents without Tokenrip's involvement.

---

## Acceptance criteria

The Validation MVP is accepted when, against a set of de-identified sample applications agreed at kickoff, it:

1. Extracts and pre-fills from a provider's CV and ID, including identifiers present in those documents, and collects the DEA, NPI, and license numbers not found in them.
2. Expands context-implied fields without re-asking the provider.
3. Reviews every field against the agreed compliance checklist and sorts compliance-ready from needs-follow-up.
4. Presents inferred answers for the provider to confirm or edit, with the provider as the only party confirming their own information.
5. Walks the provider through guided questions for the residual unknowns, surfaces a resource where one applies, and flags anything still unresolved for the credentialing coordinator.
6. From the admin view, lets the coordinator start an application and receive the two documents by email on submission, and gives AICAP the processed-application list with errors surfaced.
7. Produces, on submission, the completed application and the audit trail as two documents.

Acceptance is measured against the agreed sample set. Production hardening and live provider data are out of scope for the Validation MVP.

---

## Future Opportunities

Both parties recognize that successful completion of the Validation MVP may create opportunities for future collaboration. Any future pilot deployments, integrations, production hardening, support arrangements, or additional product development would be separately scoped and governed by a new agreement. Nothing in this proposal obligates either party to enter into future engagements.

---

## To begin

Two things start week one: a 30-minute scoping call to lock scope and the kickoff inputs above (the compliance checklist and baseline configuration requirements), and three to five de-identified sample applications with their inputs. The Validation MVP runs on example and de-identified data, so it does not require a hospital partner or a signed pilot to begin.
