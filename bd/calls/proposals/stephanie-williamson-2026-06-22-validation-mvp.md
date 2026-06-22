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
**Length:** ~6 weeks from kickoff
**Valid through:** 2026-07-15

---

## Summary

Tokenrip would build the AICAP Validation MVP: an AI-assisted application completion workflow that helps providers produce complete, credentialing-ready applications with minimal manual effort.

The workflow takes a provider from the start of an application to a complete, credentialing-ready submission in a single guided pass. On submission it produces two documents: the completed application and an audit trail. The engagement has a defined deliverable and a clean handoff. Work beyond it is separately scoped.

---

## Scope

The workflow covers the requirements that recur across specialties. The provider experience stays as AICAP designed it: the applicant sees only what they need to answer, guided toward a complete, credentialing-ready application, never a raw form.

**The five surfaces:**

1. **Application autofill from provider-supplied inputs.** At the start of an application a provider usually has their CV and a government ID (driver's license or passport). The workflow extracts structured fields from those and pre-fills the application wherever the source is unambiguous. For the credentials a provider does not normally have as documents at this stage, the workflow captures the identifying numbers: license number, DEA registration number, NPI. The provider sees an application already mostly populated, not a blank form. The exact input list is locked at kickoff.

2. **Context-aware field expansion.** When the CV implies a fact, for example faculty member at a named medical center, the workflow populates the adjacent fields (hospital affiliation, malpractice coverage, work-history scaffolding) instead of asking the provider to repeat what is already there.

3. **Automated compliance review.** Every field is checked against AICAP's compliance bar (Joint Commission, CMS, and NCQA-relevant items), sorting items into compliance-ready versus needs-follow-up before any review begins. Requirements that vary by state or hospital stay configurable, so the bar can be set to a specific destination's rules.

4. **AI gap-fill, confirmed by the provider.** For items that still need resolution, the workflow proposes the most likely answer with its confidence and source reasoning, and the provider confirms, edits, or rejects it. Only the provider confirms or edits their own information. Nothing is answered on the provider's behalf, and nothing auto-submits. This surface is included and will be validated against live performance once the first three are running, with the option to fold it into guided intake if that proves cleaner.

5. **Guided intake for the residual unknowns.** Anything that genuinely could not be auto-resolved surfaces as a short set of targeted questions. Where a question can be resourced, for example the office manager's contact for verifying a prior affiliation, the workflow surfaces that resource. Any item still unresolved at submission is flagged for the credentialing coordinator. So if an office manager is named, the coordinator knows on receipt that an early task is to reach out for what is missing.

**Built once, configurable per destination.** The workflow is a reusable core that treats a destination's requirements as configurable inputs: its forms, logo, application and attestation questions, state-specific forms, history windows (the seven and ten year variations), affiliation and malpractice requirements, and distance rules. The MVP is built against one baseline configuration agreed at kickoff. Configuring it to a specific hospital's full requirements is part of that hospital's separately-scoped deployment.

**The workflow in use.** The credentialing coordinator triggers an application-link email to the provider, with AICAP's link embedded. The provider logs in and works with AICAP to complete the application: documents and numbers in, guided questions for whatever is left, then attestation. On submission, AICAP generates the two documents, the completed application and the audit trail. There is no AICAP dashboard or queue; the coordinator monitors from whatever they use today, and acts on the items flagged for follow-up.

**Not included in the Validation MVP.** Integration into a hospital's credentialing software (the MVP leaves a configurable space for that connection; the connection itself is a separately-scoped deployment). Per-hospital configuration beyond the one baseline built at kickoff. Live production use with real provider data (the MVP runs on example and de-identified data). Privileging.

---

## Deliverables

- The AICAP Validation MVP: the working workflow described above, accessible to AICAP, taking a provider from start to a complete, credentialing-ready application in a single guided pass.
- The two generated documents on each submission: the completed application and the audit trail.
- One baseline configuration, built against the requirements agreed at kickoff.
- A configurable space left open for a future integration into a hospital's credentialing software.

---

## Timeline

Six weeks from kickoff, demo-driven, on real example applications throughout.

| Week | What happens |
|---|---|
| 0 | Scoping call. Kickoff. Lock inputs, the baseline configuration, and the compliance-checklist scope. |
| 1 | Application autofill live on real sample inputs (CV, ID, captured numbers). Context-aware expansion calibrated. |
| 2 | Automated compliance review calibrated against AICAP's checklist, configurability in place. Demo. |
| 3 | Guided intake live. Demo. |
| 4 | AI gap-fill operational and provider-confirmed, validated against the first three surfaces. Demo. |
| 5 | Two-document output end to end, audit trail complete. Demo. |
| 6 | Iteration tail, edge cases, acceptance, handoff. |

The weekly demos exist so AICAP can spot any slippage as it happens. Move the schedule either direction as needed.

---

## Cost

$12,000, less the $1,000 discovery already paid, for **$11,000 net**.

Payment: 50% ($5,500) at kickoff to begin, balance ($5,500) on acceptance per the criteria below. The balance is due only when the Validation MVP meets the acceptance criteria.

---

## Ownership

AICAP owns the Validation MVP and everything specific to AICAP: the workflow, the application and credentialing logic, the compliance encoding, the configuration, the generated output, and the deployed instance. On final payment these are AICAP's outright.

Tokenrip retains its pre-existing, general-purpose components, the underlying document-extraction and data-processing technology it brings to the work and reuses across projects, and grants AICAP a perpetual license to use them as part of the delivered MVP.

The result: AICAP has full ownership and control of the product and its IP, with no dependency on Tokenrip to run it.

---

## Handoff

On acceptance and final payment:

- The deployed Validation MVP, accessible to and controlled by AICAP.
- The source and configuration for the AICAP-specific workflow, transferred to AICAP.
- Documentation: how to run the workflow, how to adjust the baseline configuration, and how the two documents are generated.
- A walkthrough so AICAP's team can operate it without Tokenrip.

The handoff is complete when AICAP can run the workflow, process an application end to end, and generate both documents without Tokenrip's involvement.

---

## Acceptance criteria

The Validation MVP is accepted when, against a set of de-identified sample applications agreed at kickoff, it:

1. Extracts and pre-fills from a provider's CV and ID, and captures the license, DEA, and NPI numbers.
2. Expands context-implied fields without re-asking the provider.
3. Reviews every field against the agreed compliance checklist and sorts compliance-ready from needs-follow-up.
4. Walks the provider through guided questions for the residual unknowns, surfaces a resource where one applies, and flags anything still unresolved for the credentialing coordinator.
5. Produces, on submission, the completed application and the audit trail as two documents.
6. Runs end to end on the agreed sample set, with the provider as the only party confirming their own information.

Acceptance is measured against the agreed sample set. Production hardening and live provider data are out of scope for the Validation MVP.

---

## Future Opportunities

Both parties recognize that successful completion of the Validation MVP may create opportunities for future collaboration. Any future pilot deployments, integrations, production hardening, support arrangements, or additional product development would be separately scoped and governed by a new agreement. Nothing in this proposal obligates either party to enter into future engagements.

---

## To begin

Two things start week one: a 30-minute scoping call to lock scope, and three to five de-identified sample applications with their inputs. The Validation MVP runs on example and de-identified data, so it does not require a hospital partner or a signed pilot to begin.
