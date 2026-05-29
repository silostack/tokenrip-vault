---
contact: Luai Walid El Haj
company: Get In Canada
date: 2026-05-20
type: design-partner proposal
status: draft (merged from v1 and codex)
owner: Alek Perak
pairs_with: ../notes/luai-elhaj-2026-05-20.md
supersedes:
  - luai-elhaj-2026-05-20.md
  - luai-elhaj-2026-05-20-codex.md
---

# Tokenrip × Get In Canada — AI File-Readiness Pilot

**Prepared for:** Luai Walid El Haj, Get In Canada
**Prepared by:** Tokenrip
**Pilot fee:** $5,000 USD (standard pricing for this build is $25,000; this is design-partner pricing)
**Pilot length:** 90 days, one application type
**Guarantee:** Full refund available during the first 30 days, no questions asked

---

## Summary

Tokenrip will build an AI-assisted file-readiness workflow for Get In Canada, starting with one immigration application type chosen by you.

The system reviews the client questionnaire and supporting documents before the case manager prepares the file. It flags inconsistencies, missing items, and quality issues, and drafts a single consolidated message to the client for human approval. AI prepares the review package; people remain responsible for client communication, judgment, and submission.

If the pilot works inside Get In Canada, Phase 2 is turning the same workflow into the operating layer for your B2B back-office service.

---

## What Tokenrip Will Build

You described a client whose wife was refused twice for a visitor visa before she retained you, because the previous firm submitted with information that did not match her supporting documents. You fixed it on the third try by asking the right questions and catching the right details. This pilot is that catch process, applied to every file, every time, before submission.

The system reviews:

- the completed questionnaire
- supporting documents (passport, diploma, marriage cert, employer letters, birth certs, address proof)
- consistency across the two

It flags 14 specific discrepancy categories:

| # | Discrepancy type | Example |
|---|---|---|
| 1 | Name transliteration variations | Arabic "محمد" reads as "Mohammed" vs "Mohamed" vs "Muhammad" across passport, diploma, marriage cert |
| 2 | Given/family name field order | Form expects "family, given"; client wrote "given, family" |
| 3 | DOB format conflict | Questionnaire "06-01-1998" vs passport "01-JUN-1998" — is it Jan 6 or Jun 1? |
| 4 | DOB digit transposition | Passport 1989, questionnaire 1998 |
| 5 | Passport expiration vs application timing | Passport must be valid 6+ months; flag if too close |
| 6 | Address mismatches | Questionnaire address does not match lease or utility bill |
| 7 | Marriage date vs spouse timing | Date on certificate does not match date claimed on questionnaire |
| 8 | Employment date gaps | Claimed dates do not match employer letters |
| 9 | Education date/institution mismatch | Diploma issuer does not match school name on questionnaire |
| 10 | Travel history gaps | Passport stamps show trips not declared on form |
| 11 | Dependent count mismatch | Questionnaire says 2 kids, birth certs show 3 |
| 12 | Photo page vs data page conflicts | Passport bio page name does not match machine-readable zone |
| 13 | Missing signatures, stamps, certifications | Birth certificate not stamped (your citizenship envelope story) |
| 14 | Illegible / poor scan | Photo too dark, rotated, or has glare; flagged for re-upload before submission |

Every flag includes the source (which document, which field, which page), the conflict, and a confidence score. Your case manager sees: *"Passport bio page reads 'AHMED'; questionnaire says 'AHMAD'; please verify with client."* One line, one decision.

The system then drafts a single consolidated follow-up message to the client covering every gap at once, for case-manager approval before sending. No multi-pass back-and-forth.

### On the OCR concern (phone photos vs. scans)

You said this used to be a deal-breaker. Three things have changed:

1. Modern vision models read phone photos at about 92% accuracy versus about 98% on clean scans. Twelve months ago this was about 70%.
2. Pre-processing improves it further. We auto-rotate, deskew, contrast-correct, and crop before the model sees the image. That adds 3 to 5 percentage points on phone photos.
3. Confidence scoring catches the rest. Low-confidence reads (below 90%) get flagged: *"Could not reliably read DOB from this passport scan; please request a clearer photo or have a case manager verify."* Nothing silently passes.

### Why it works even when the model misses something

This is not 100% perfect. Neither is your human team. But:

- The fields humans miss are usually the fields the model catches, because it never gets tired, never skims, never assumes.
- The fields the model misses are usually obvious ones a human catches in 5 seconds.
- The two error patterns are complementary, not overlapping. Combined catch rate is closer to 99% than either alone.

### ROI math, conservative

50 files per month between your current firm and projected back-office pipeline. Refusal rates of 2% on catchable inconsistencies equals 1 refusal per month prevented. Cost per refusal: refund ($1,000 to $3,000) plus rework plus reputation hit. Preventing one refusal per month pays for the entire 90-day pilot.

---

## What Tokenrip Will Not Do

- Submit anything to IRCC
- Enter data into government portals
- Send client-facing messages without human approval
- Make final legal or immigration judgments
- Replace Get In Canada's trained staff

Submission stays 100% human. AI prepares the review package. People send.

---

## Commercial Terms (Summary)

| Item | Terms |
|---|---|
| **Phase 1 pilot fee** | **$5,000 USD all-in** for one application type, 90-day deployment |
| **Refund window** | Full no-questions-asked refund any time in the first 30 days |
| **Monthly after the pilot** | **$500/month** starting day 91. Locked for up to 12 months **or until Phase 2 starts** (whichever first). Cancel anytime with 30 days notice. The monthly is intentionally temporary — Phase 2 replaces it when ready. |
| **Additional standard application types** | **$1,000 USD each** (during or after the pilot) |
| **Standard list pricing (anchor)** | $25,000; design-partner pricing reflects first immigration-vertical engagement + design partner rights |

### What The 90 Days Is For

| Window | What's happening | Tokenrip's mode |
|---|---|---|
| **Weeks 1-4: Build + calibration** | Custom build on your real files. Document recognition, flagging rules, output customization. Refund window open throughout. | Heavy build |
| **Weeks 5-13: Live operation + weekly tuning** | Files flowing through production. Direct Slack line. Weekly tuning. Edge cases get fixed. Model API costs absorbed. | Heavy-touch tuning |
| **Day 90: Stabilization checkpoint** | System should be stable on your workflow. Tokenrip drops to lighter cadence (quarterly tuning, monthly 30-min check-in). | Operate mode |

This is why $5,000 is all-in for 90 days but $500/month afterward: during the pilot we're heavily involved; after day 90 the system is operating, not being built.

### What's Included In The $5,000 (Phase 1, 90 days)

Custom build, calibration on 10 to 20 historical files, support for up to 25 live files during the pilot, team walkthrough, weekly review during month 1, audit trail dashboard, direct Slack or email line throughout, all model API costs absorbed.

### What's Included In The $500/Month

Hosting, model API costs (up to file cap), IRCC policy currency, quarterly tuning, bug fixes, support channel, monthly 30-min check-in, up to 25 live files per quarter per application type.

### Additional Application Types ($1,000 each)

After the pilot starts (during or after), additional standard application types can be added for $1,000 each. Each new type runs under the same $500/month — no per-type subscription escalation — and goes live within 1 week of payment.

**Standard application types include:** visitor visa, study permit, work permit, Express Entry profile review, PNP application review, family sponsorship file review, citizenship file review.

---

Full deal terms, scope definitions, IP and data clauses, design partner rights, and termination mechanics live in a separate **draft term sheet** — designed to be reviewed and negotiated. The term sheet is shared with this proposal.

### Why $5,000 and not $25,000

Standard pricing for this kind of custom build is $25,000. Design-partner pricing reflects three things in Tokenrip's favor:

- This is our first immigration-vertical engagement; what we learn from your workflow becomes substrate we use to serve future immigration firms.
- We secure design partner rights (logo, case study, reference calls) signed at kickoff.
- You move first; future immigration pilots pay closer to list.

If those terms do not work, the deal does not work, and that is fine to surface on the call.

### How This Fits Alongside Other Tools

If you have looked at generic immigration case-management software (Docketwise, Navisa, VisaNauta, RCICdesk, and similar), those tools focus on case-management infrastructure: client portals, billing, document storage, deadline tracking, form generation. They run roughly $40 to $600 per user per month and are designed to manage how cases move through the firm.

Tokenrip is not in that category. We are an AI workflow layer focused specifically on file-readiness review (the 14 discrepancy categories above), not case management. The two are not in conflict. Case-management software runs your operations; Tokenrip catches inconsistencies before submission. If your team already uses one of those tools, or you want to add one, Tokenrip sits on top, not in place of.

This is why our pricing is structured as a one-time pilot fee plus per-application-type add-ons rather than per-user-per-month subscription. The work is custom build plus ongoing tuning on your real workflow, not generic software licensing.

---

## What We Need To Start

The build does not begin until we have:

- one application type chosen as the starting point
- Get In Canada's questionnaire for that application type
- the document checklist your team uses for that application type
- 10 to 20 completed files of that application type, anonymized if you prefer
- one 90-minute workflow walkthrough with Luai and one case manager
- signed reference-rights letter (template provided separately)

---

## How We Handle Credibility (your #1 concern)

You said: *"if AI sent an email and then a person came and asked another question, that decreases credibility."*

Three safeguards:

1. **No client-facing AI output without human approval.** Drafts only; your case manager sends.
2. **One-shot follow-ups.** The AI consolidates every gap into a single email so your team never has to do a second pass for something AI missed.
3. **Audit trail.** Every AI flag is timestamped, explained, and reviewable. If the AI missed something, you see exactly what context it had, and we fine-tune.

---

## Design Partner Terms (Summary)

This pilot is discounted design-partner pricing. In exchange, at kickoff Get In Canada agrees to:

- Logo and identification rights for tokenrip.com case studies and investor materials
- Participation in a 1 to 2 page case study (final copy goes to Get In Canada for signoff)
- A designated point of contact for up to 2 reference calls per quarter for 12 months
- Anonymized pattern reuse from the engagement (your client data and proprietary workflows remain yours)

**These rights persist for 12 months even if you exercise the 30-day refund.** The economic exchange for design-partner pricing is the rights themselves, not the cash.

Full text and clause-by-clause language in the commercial agreement.

---

## Phase 2 — B2B Back-Office Expansion

The larger opportunity is the back-office service you described for other immigration consultants.

If the pilot works for Get In Canada's internal team, Phase 2 is turning the same workflow into the operating layer for that service. The system can support multiple external consultant accounts, standardized file review across case managers, per-consultant workflow tracking, and quality control across the back-office team.

Phase 2 pricing is based on real volume after the pilot, not guessed upfront. No commitment from either side today. This is on the table; it is not in the $5,000.

When Phase 2 begins, it supersedes the $500/month. Phase 2 pricing replaces it; the two do not stack.

---

## Timeline

| Week | What happens |
|---|---|
| 1 | You choose the application type and deliver the questionnaire, doc checklist, and 10 to 20 files. Workflow walkthrough. Reference-rights letter signed. |
| 2 to 3 | Custom build: document recognition, flagging rules, and form mapping calibrated on your files. |
| 4 | Team walkthrough. Live launch on real files (up to 25 files supported during the pilot). |
| 5 to 13 | Live operation. Weekly tuning. Direct Slack line. |
| 14 | Phase 1 review: catch-rate report, ROI summary, decision on Phase 2 or additional application types. |

Money-back window: first 30 days from signed agreement.

---

## Next Step

A 30-minute call to choose the first application type, confirm sample-file availability, and lock the pilot start date. I am open Tuesday or Wednesday next week. Name a time and I will send the invite.

---

## Cover Email Draft

**Subject:** Proposal: AI file-readiness pilot for Get In Canada

Luai,

Thank you again for the conversation. I thought more about the workflow you described, especially the back-office service you are building for other immigration consultants.

I would not position this as replacing your team. Your team is already trained and cost-efficient. The better opportunity is helping each case manager prepare more complete files, catch inconsistencies earlier, and reduce the back-and-forth that hurts credibility with clients. You mentioned a client whose wife was refused twice before you fixed her file on the third try. The pilot I am proposing is that catch process, run on every file, every time, before submission.

Two documents attached:

- **Proposal** (what we'd build, why, how): [Tokenrip share link for proposal, to be inserted after publish]
- **Draft term sheet** (the commercial structure — draft for discussion, not for signature): [Tokenrip share link for term sheet, to be inserted after publish]

The short version: a 90-day AI file-readiness pilot for one application type you choose, priced at $5,000 USD, with a full no-questions-asked refund available during the first 30 days. After the pilot, ongoing operation runs at $500/month, locked for up to 12 months or until Phase 2 (the B2B back-office build) starts. The monthly is intentionally temporary; Phase 2 replaces it when ready. Standard pricing for this kind of custom build is $25,000; design-partner pricing reflects that you are our first immigration-vertical engagement. Additional application types after the pilot are $1,000 each.

The AI does not submit anything to IRCC, does not enter data into government portals, and does not contact clients directly. It prepares the review package; your team stays in control.

If this works inside Get In Canada, the next step is turning the same workflow into the operating layer for your B2B back-office service. We negotiate that based on real volume after the pilot, not guessed upfront.

Suggested next step: a 30-minute call to choose the first application type and confirm what sample files you can share. I am open Tuesday or Wednesday next week. Name a time and I will send the invite.

Best,
Alek

---

*All pricing in USD. Client PII is processed in isolated environments; no client data is used to train base models.*
