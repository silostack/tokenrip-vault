---
contact: Stephanie Williamson
company: AICAP Access
date: 2026-09-01
call_type: firm-direct
participants: [Simon Pettibone, Stephanie Williamson]
prep_file: n/a
---

> **Note on source material:** No verbatim transcript was available for this call.
> What follows is the automatically generated meeting-notes summary, lightly
> reorganized for scanning (not cleaned from speech — this is already
> notes-form, not dialogue). Treat as directionally reliable but not
> quote-grade; nothing here should be treated as an exact quote.

## Summary

Meeting reviewed economic challenges, architectural decisions for testing workflows, and data strategy for system development.

## System Communication and Access

Implemented invite-only account mechanisms to secure system communications. Established an email-based login workflow for testing.

## Data Strategy and Scope

Prioritized physician testing while building a dataset of 500 diverse CVs. Agreed to combine synthetic and real-world data collection methods.

## Technical Implementation and Deployment

Decided to benchmark Anthropic and ChatGPT models for performance. Confirmed intent to host within hospital environments to ensure security compliance.

## Decisions (Aligned)

- **Outgoing communications lockdown** — the system will be restricted to prevent automatic outgoing communications to providers, ensuring all external messages are routed through a controlled system.
- **Hard account segregation implementation** — established as a requirement to prevent users from accidentally accessing data from other accounts.
- **Aggregated CV data strategy** — both parties will collaborate to aggregate CV data sets, leveraging individual access to different sources to ensure wide variability in training data.
- **Initial physician-only provider scope** — initial testing and development scope is limited to physicians (MDs and DOs) to ensure focus, with auxiliary staff types deferred to a later phase.
- **Scalable architecture for future providers** — the system architecture will be built to support multiple provider types from the outset, enabling future expansion without requiring re-architecting.

## Next Steps

| Owner | Action |
|---|---|
| Simon Pettibone | Send Checklist Email — draft a message containing the required items for the project handoff |
| Stephanie Williamson | Review Handoff Documentation |
| The group | Aggregate Training Data — collect and scrub PII from medical resumes (PDF/Word) to build a robust dataset |
| Simon Pettibone | Architect System — design the codebase from the start to support multiple provider types |
| Stephanie Williamson | Configure GitHub — establish an organization account, grant admin access to the repo (code ownership transfer) |
| Stephanie Williamson | Provision Server — initialize a hosting instance via Digital Ocean or equivalent, move off current environment |
| Stephanie Williamson | Create API Account — register for AI provider credentials (Anthropic or ChatGPT) |

## Details

**Automated Communication Safeguards.** Stephanie proposed disabling the automatic "we received your application" text/email to prevent accidental real-provider communications during testing. Simon agreed to hard account segregation and an invite-only mechanism, with all outgoing communications controlled/authorized.

**Account Invitation Workflow.** Stephanie asked about a feature letting a user input an email to generate/send a new login link for testers. Simon confirmed the invite-based workflow as viable and agreed to build it.

**CV Library Data Requirements.** Simon requested ~500 CVs (PDF/Word) for a testing library. He emphasized real CVs give higher-quality training signal than synthetic (variability in styling, headings, font sizes). Stephanie committed to collecting and scrubbing PII (medical/license IDs).

**Data Aggregation Strategy.** Simon will source CVs himself and generate synthetic sets in various formats; Stephanie will use ChatGPT to scrape additional examples online.

**Provider Type Strategy.** Discussed whether to widen scope to auxiliary staff (NPs, PAs) alongside physicians now. Simon noted the architecture is flexible but each provider type needs specific logic configuration. Consensus: prioritize physicians first to expedite the demo; architecture stays extensible.

**QA and Error Handling.** Stephanie asked about the acceptable pass bar. Simon said the system should handle corner cases gracefully and testing should surface 80-90% of issues; the system must record and diagnose errors to support a feedback loop.

**MVP Technical Hand-off.** Simon outlined MVP hand-off requirements: an ASAP (AICAP) org on GitHub, codebase transfer. Recommended Digital Ocean over AWS for ease of use; will send config instructions once Stephanie confirms hosting provider.

**AI Provider Configuration and Benchmarking.** System is configured to run on either Anthropic or ChatGPT API accounts. Plan to run a benchmark battery against both models; either is expected to be sufficient.

**Deployment and Data Ownership.** Stephanie expressed a strong preference for hosting within the hospital's own environment for data security/procurement compliance. Simon acknowledged this is a deployment-level decision dependent on specific hospital IT requirements and HIPAA/BAA contractual obligations.
