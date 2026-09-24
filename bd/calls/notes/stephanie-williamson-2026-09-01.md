# Stephanie Williamson Call — 2026-09-01 (firm-direct)

*Source caveat: no verbatim transcript, only an auto-generated notes summary. Analysis below is directionally confident but not quote-grade.*

**Correction note (same day):** the first pass at this note flagged a commercial risk — that Demo Hardening/Pilot-readiness scope was moving forward unpriced. That was wrong. The [[../../../product/aicap/aicap-self-serve-demo-scope-2026-08-22|08-22 scope doc]] and [[../proposals/stephanie-williamson-2026-08-30-self-serve-demo-v1|08-30 proposal]] ($18K fixed, ~8-9 weeks) already price this exact phase, and this call's items (GitHub org, DO server, OpenAI/Microsoft accounts, seed CVs) map almost line-for-line onto that SOW's Week-0 kickoff tasks. Revised below.

## Follow-Up Actions

### What WE Need to Do
| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | Send the account/hand-off checklist email (OpenAI, Microsoft, DO server, GitHub) — the SOW's referenced "separate handoff guide" | Simon | 2026-09-03 *(inferred)* |
| 2 | Confirm explicitly that the $18K Self-Serve Demo SOW (sent 2026-08-30) is signed/funded | Simon | 2026-09-03 *(inferred, fold into #1)* |
| 3 | Architect the system for multi-provider extensibility from the start (MDs/DOs now, NPs/PAs later, no re-architecting) | Simon | 2026-09-10 *(inferred)* |
| 4 | Build invite-only account + email-based login workflow, hard account segregation, outgoing-comms lockdown (SOW's "Access and tracing") | Simon | 2026-09-10 *(inferred)* |
| 5 | Source CVs from own channels + generate synthetic sets (multiple formats) toward the seed test-library (SOW Weeks 1-2) | Simon | 2026-09-15 *(inferred)* |
| 6 | Clarify "benchmark Anthropic and ChatGPT" against the SOW's OpenAI-only document-reading architecture | Simon | 2026-09-05 *(inferred)* |

### What THEY Need to Do
| # | Action | Who | Due |
|---|--------|-----|-----|
| 1 | Review hand-off documentation | Stephanie | 2026-09-05 *(inferred)* |
| 2 | Configure GitHub org, grant Simon admin access — per SOW design (build runs on AICAP's own accounts from week 1) | Stephanie | 2026-09-05 *(inferred)* |
| 3 | Provision a Digital Ocean (or equivalent) hosting instance | Stephanie | 2026-09-05 *(inferred)* |
| 4 | Open OpenAI + Microsoft platform accounts, add Simon as member | Stephanie | 2026-09-05 *(inferred)* |
| 5 | Collect + scrub PII from real medical CVs (PDF/Word) toward the seed test-library | Stephanie | 2026-09-15 *(inferred)* |

### What They're Expecting From Us
The checklist/handoff-guide email walking through account setup — she's waiting on this to act (GitHub org, server, OpenAI/Microsoft accounts). This is standard SOW execution, not a new ask.

### Open Questions Before Next Contact
- **Has the $18K Self-Serve Demo SOW actually been signed/funded?** The 09-01 notes never say so explicitly, though the discussed tasks match its Week-0 kickoff almost exactly. Confirm in writing rather than assume.
- **Does "benchmark Anthropic and ChatGPT" reopen the document-reading architecture the SOW already priced (OpenAI for CV understanding, Microsoft for ID reading)?** Probably not — likely just evaluating quality — but worth a one-line check so it doesn't quietly become new unpriced work.
- **Is "host within hospital environments" understood by both sides as the future paid-pilot phase**, not this SOW's scope? The 08-22 scope doc already defers per-hospital deployment to a paid pilot — make sure that boundary holds.
- What's the actual timeline/target for the physician-only demo to be ready for a live tester (e.g., Boston Children's)?

## Call Summary

Follow-up technical planning call continuing the Validation MVP engagement. Covered account/access security (invite-only, email login, hard segregation), CV data strategy (500-CV library, synthetic + real, PII-scrubbed), provider-type scoping (physicians first, multi-provider-ready architecture), model benchmarking (Anthropic vs. ChatGPT), and hosting/deployment (hospital-hosted preference, HIPAA/BAA-gated). Five decisions aligned; seven next steps split ~evenly between Simon and Stephanie, with data aggregation shared.

## Momentum

↑ **Advancing.** This call's technical decisions and account-setup tasks match the already-priced $18K Self-Serve Demo SOW (sent 2026-08-30) almost exactly — this reads as the kickoff of a signed follow-on phase, not unscoped drift. The one thing to close out is an explicit confirmation that the SOW is signed, since the notes never say so directly.

## Key Intelligence / What Changed

1. **The Demo Hardening / Pilot-readiness phase flagged open since 2026-08-13 is resolved on pricing** — a scope doc (08-22) and $18K/~8-9-week SOW (08-30) already cover exactly what came up on this call. This call is best read as its kickoff.
2. **The GitHub org / DO server / OpenAI+Microsoft account hand-off is the SOW working as designed** ("the phase starts on AICAP's accounts, so there is no migration at the end") — not an ownership exit for Simon. No new risk here once read against the SOW.
3. **"Benchmark Anthropic and ChatGPT" and "host within hospital environments" are both slightly outside the SOW's stated scope** (OpenAI-only document reading; per-hospital deployment deferred to a future paid pilot) — worth a quick clarifying note so neither quietly expands the current $18K build.

## Pipeline / Objections

No new objections surfaced in the notes. Pain evidence, stakeholder/authority, and stage signal are unchanged from 2026-08-13 (Validation MVP closing, follow-on unpriced, Boston Children's still the live first-customer path). Stage signal here is specifically about scope creeping forward on trust rather than contract.

## Simon's Performance

### Coaching Priorities (1–3)
- **The checklist email should close the one real loop from this call: explicit SOW confirmation.** It's fine for the email to be mostly operational (accounts, server, GitHub) since that's what the SOW calls for — but add one line up top. **Better language:** "Quick confirm before the checklist below — we're proceeding under the $18K Self-Serve Demo SOW from 08-30, correct? Once that's set, here's what I need from your side to get week 0 moving." Cheap to add, closes an assumption that's currently only inferred from matching activity.
- **Flag the two scope-adjacent items (model benchmarking, hospital hosting) before they harden into assumptions on her side.** **Better language:** "Two quick notes so we stay aligned on scope — (1) happy to sanity-check Anthropic vs. ChatGPT, but the SOW's priced around OpenAI for CV reading, so let's keep that as an evaluation, not a rebuild; (2) hospital-hosted deployment is the per-hospital pilot phase we already agreed comes later, so I'll keep that out of this build unless you want to reopen it."
- **Get in the habit of cross-checking a "notes-only" call against the priced SOW before treating anything as new/unscoped** — this session's first pass over-called a commercial risk that a two-minute cross-reference resolved. Cheap process fix: whenever a call recap arrives without a transcript, check it against the most recent priced scope doc first.

### What Worked (2–3)
- Kept the provider-type scope disciplined (physicians only for now) while still designing for extensibility — avoids scope bloat without sacrificing the architecture story Stephanie cares about ("outcome-based," don't re-architect later).
- Practical, low-friction technical judgment calls (Digital Ocean over AWS, real CVs over pure synthetic) — matches her stated preference for someone who just handles the technical setup for her.
- Executing the SOW's own designed sequence (accounts opened under AICAP's name from week 1, seed library first) rather than improvising a different rollout — keeps the engagement inside what was priced.
