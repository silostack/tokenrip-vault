---
type: project-tracker
project: AICAP Validation MVP
client: AICAP — Stephanie Williamson
owner: Simon Pettibone
status: active — first UAT pass closed 2026-07-28 (24 of 38 issues landed); second-pass scope written, unstarted
last_updated: 2026-07-31
canonical:
  scope: product/aicap/aicap-validation-mvp-sow-2026-06-22.md
  build_plan: ~/projects/maxi/aicap/docs/aicap-mvp-gameplan.md
  relationship: bd/calls/contacts/stephanie-williamson.md
---

# AICAP Validation MVP — Project Tracker

> **What this is:** the single operational hub for running the AICAP build — status, milestones, the input critical-path, open actions, blockers, decisions, and demos. **Update `last_updated` whenever you touch it.**
>
> **What this is *not* (so it doesn't drift):** it doesn't restate scope (→ the **SOW**), the week-by-week engineering plan (→ the **build gameplan** in the AICAP repo), or relationship/commitment history (→ the **contact doc**). Those three are canonical; this tracks live execution state and points back to them.

---

## Status at a glance

| | |
|---|---|
| **Phase** | Phase 0 ✅ · engine built + demoed (07-09) · **first UAT pass closed 2026-07-28** — 24 of 38 issues landed, client report written, deploy done. Second-pass scope written (`docs/second-pass-2026-07-28.md`), unstarted. |
| **Momentum** | ↑↑ on build. **↓ on communication** — two finished client-facing artifacts are sitting unsent (the 07-28 client report; the 07-15 pilot instruments). |
| **Commercial** | $11K net — ✅ **paid in full 2026-07-02** (escrow funded 2026-07-07 per DASHBOARD). Next motion: **GH #3 "Pilot Readiness"**, which Stephanie opened herself. |
| **30-day refund clock** | ~**2026-07-31 — i.e. today.** ⚠️ Its start date has **never been named to the client in writing** (open for three calls running, action Ours #6). The stated safety mechanism was visible weekly progress; the progress is real, the weekly evidence was never sent. |
| **Next milestone** | **Wk 6 iteration tail → Wk 7 acceptance + handoff (~2026-08-22, 22 days out).** Gating item is extraction accuracy: **~83% against a self-set 90% bar**, open since 07-17, cause is upstream vision-model drift on unchanged code. |
| **Blocking right now** | **Nothing is blocked on Stephanie for the build.** The 07-09 "compliance examples" blocker is **resolved by evidence**: she delivered them as 38 GitHub issues, 24 of which are landed and closed. Two content asks remain outstanding but block only individual items — the attestation question set (A3) and her "wow demo" spec (promised 07-24). |

> **Note on the milestone table below:** the repo built the full end-to-end journey (all five surfaces + admin + PDFs), verified against a running system 2026-07-03 and demoed 2026-07-09. The remaining weeks are **calibration to AICAP's real content** (compliance rules, guided-question wording), not net-new plumbing — the "hard 20%." Build state is authoritative in the repo (`docs/STATUS.md`).

---

## ▶ Next steps (Simon) — orient here

Do these roughly in order:

0. **🔴 Send the two-option retainer note.** *(Commercial, not build — but it is the highest-value 20 minutes on this project.)* On 2026-07-22 Stephanie opened the money conversation herself and it was declined in the moment; she also named a second commissionable project (AI chief of staff). Instrument is ready: [[../../active/aicap-retainer-tear-sheet-2026-07-15]] — Lane 1 (SOW, funded, no new dollars, no re-trading) / Lane 2 (demo-readiness, the growing queue, beyond-baseline config). Triage the current queue into covered / beyond-scope / ambiguous first, and gift one or two ambiguous items **out loud**.
0b. **Define the "specific ask" for Matthew / Boston Children's** — he has agreed to test and asked us to come back with one. Pilot scope, price, duration, success criteria. **⚠️ Not raised on the 07-24 call by anyone — still undefined, and the shape has changed.** The gate is now **executive buy-in**, not the medical staff office: Matthew's own framing is *"you're gonna pay $100K/yr for production software, why do you need to pay $10K more for whatever this is?"* Lead the ask with the **metric gap he handed us** — MSOs measure turnaround from *application-submitted*, executives measure from *contract-signed*, and AICAP occupies the unmeasured interval between them. Details → [[../../bd/calls/notes/stephanie-williamson-2026-07-24-boston-childrens]].

1. **Design the Week-2 compliance architecture** — encode the baseline+config model Stephanie described: conditional document requirements (answer → required doc), document-property validation (present / correct type-version / required stamp), hard vs soft stops. Baseline handling first; keep it extensible. (Findings → [[aicap-project-notes]] → "The compliance model.")
2. **Resolve the compliance-examples ambiguity** — ask whether her GitHub issues *are* the worked examples. If yes, correct this tracker and stop chasing. If no, get 2–3 concrete cases live rather than as homework.
3. **Triage her GitHub issues** as she files them (app is public; she has a login). **Write the comments for a non-engineer** — as of 2026-07-22 she has been reading them and getting nothing out of them (*"I thought you were more commenting for yourself"*). Three weeks of async communication were effectively lost.
4. **Send the written follow-up** — lock the weekly-demo cadence + 30-day refund-clock start (**still open for the third call running**; clock nominally ends ~2026-07-31). Ask for her Replit export. Confirm in writing that in-AICAP attestation is the MVP bar (not downstream hospital acceptance).
4b. **Design notes.** ~~Office address stays configurable, not modeled (unsolvable)~~ — **REVERSED 2026-07-24 by the customer:** Boston Children's uses *"the general hospital address, the general site address, versus any type of specific suite."* → **default to hospital/site-level address; make granularity configurable** for the minority who want suite/floor. **Click count is her north star** (Tesla 116→22 vs. 14 for a pizza) — treat as an acceptance measure. Never describe a *"learning phase"* to customers — the word is **"adapts."** Her "wow demo" spec is inbound homework and will set the demo-readiness bar.
4c. **New model requirements from 2026-07-24 (Matthew / Boston Children's):** (a) **non-credentialing hospital forms** — IP agreements, HIPAA-compliance forms — are deliberately bundled into the same intake (*"so people aren't being asked by multiple different groups"*); model them as **pass-through collection, explicitly distinct from verifiable credentialing data**, or they will collide with Stephanie's collect-nothing-extra rule. (b) **Foreign- vs domestic-trained branching logic** as a config dimension. (c) **Historical malpractice carrier per prior employer** — his named example of the field that generates repeat chase-ups. (d) Confirmed: *"most of the application will be generic"* — validates the superset+config architecture.
5. **Continue iterative rubric capture** — the field-by-field content now transfers via her examples + working sessions, not one recorded call. Agenda: [[walkthrough-questions]].

---

## Milestone tracker

Target demo dates are **anchored to input arrival** — if samples land late, every row shifts. The SOW allows moving the schedule either direction. Legend: ✅ done · 🟡 in progress · ⬜ todo · ⛔ out of scope.

| Wk     | Deliverable                                                                                                       | Demo            | Status                  |
| ------ | ----------------------------------------------------------------------------------------------------------------- | --------------- | ----------------------- |
| 0      | Kickoff / scoping — inputs, baseline, checklist scope locked                                                      | —               | ✅ 2026-07-01            |
| **P0** | Stack + `@aicap/core` + backend/frontend foundation + risk spikes (vision extraction; suspend/resume)             | —               | ✅ complete (2026-06-26) |
| 1a     | **Credentialing knowledge extraction** — field superset + rules catalog from the 3 samples + 4 CVs (`knowledge/`) | —               | ✅ 2026-07-02            |
| 1b     | **Core rule model + data model** (`@aicap/core` decision engine) — encode rules + data model                      | —               | ✅ 2026-07-02            |
| 1c     | **Application autofill** live on sample inputs (CV + ID); context expansion                                       | **2026-07-09**  | ✅ built + demoed        |
| 2      | **Automated compliance review** — engine built; calibrated against Stephanie's real rules via the UAT board       | ~Fri 2026-07-18 | ✅ first pass closed 2026-07-28 |
| 3      | **Provider review/confirm + guided intake** — built; wording calibrated through the guided-intake pass (Work log L3–L9) | —               | ✅ built · ✅ calibrated  |
| 4      | **Two PDFs** (completed app + audit trail) + attestation capture                                                  | —               | ✅ built                 |
| 5      | **Admin operability** (list / status / errors / counts) + full sample-set run                                    | —               | ✅ built                 |
| 6      | Iteration tail / edge cases — **second-pass scope written 07-28, unstarted.** Gated on extraction accuracy (83% vs. 90%) | —               | 🟡 scoped, not started   |
| 7      | **Acceptance + handoff**                                                                                          | ~Fri 2026-08-22 | ⬜ **22 days out**       |

---

## Critical path — AICAP kickoff inputs

**This is the dependency that gates the whole build.** No formal checklist doc exists (it's "in her head"), so the compliance rubric + guided-question content transfer via a **recorded field-by-field walkthrough call**, not a file. Samples are the hard Week-1 blocker — press hardest there.

| Input | Needed for | Delivery mechanism | Committed | Status |
|-------|-----------|--------------------|-----------|--------|
| De-identified sample applications (×3, different platforms) + sample CVs (×4) | Week 1 | Uploaded | 2026-07-02 | ✅ received → `data/`; extracted into `knowledge/` |
| Sample **government ID** (DL or passport) | Week 1 | Simon sourced from the web | 2026-07-09 | ✅ sourced; ID extraction demoed |
| **Compliance rules** (Joint Commission / CMS / NCQA items) | **Week 2** | **Iterative** — model brain-dump (done 07-09) → Stephanie's worked examples (homework) → build | in progress | 🟡 **her examples pending** — the live blocker |
| Baseline configuration | Week 2 | We set a baseline; Stephanie confirms/adjusts | client checklist sent 07-08 | 🟡 baseline built as superset+config (no single form to "pick") |
| Guided-question content (prompts + resource pointers) | later | Working sessions + her examples | after Week-2 | 🟡 draft in place |
| GitHub repo access | Setup | Access shared with Stephanie | 2026-07-02 | ✅ shared |
| App access (public URL + login) + issue-filing | Handover | Given + shown how to file issues | 2026-07-09 | ✅ done |
| Milestone funding ($11K net) | Kickoff/start | Upwork | 2026-07-02 | ✅ **paid in full** |

---

## Open action items

### Ours (Simon / Tokenrip)
| # | Action | Due | Status |
|---|--------|-----|--------|
| 1 | GitHub repo + knowledge extraction + core rule model + autofill | — | ✅ done (through 07-09 demo) |
| 2 | Source a sample government ID | before autofill | ✅ sourced |
| 3 | Make app public + give Stephanie a login + show her how to file GitHub issues | 07-09 | ✅ done |
| 4 | **Design the Week-2 compliance architecture** (baseline+config: conditional document requirements, document-property checks, hard/soft stops) | Week 2 | ✅ built + calibrated (first pass closed 07-28) |
| 5 | Triage Stephanie's GitHub issues as she files them | ongoing | 🟡 **#13–#50 triaged into W-modules; #1–#11 never triaged** — an orphaned cohort filed 07-09→07-14 |
| 6 | First written follow-up: **lock weekly-demo cadence + name the 30-day refund clock start** | **overdue — clock ends today** | 🔴 ⬜ open for the third call running |
| 7 | Ask Stephanie for her Replit export/screenshots | next contact | ⬜ |
| 8 | **Send `docs/client-report-2026-07-28.md`** — written and marked ready-to-send 07-28, unsent since | 🔴 now | ⬜ |
| 9 | **Answer GH #3 "Pilot Readiness"** — she opened the next engagement; instruments ready since 07-15, never deployed | 🔴 now | ⬜ |
| 10 | **Extraction accuracy 83% → 90%** — the gating item before any demo, and before Wk-7 acceptance | before next demo | 🟡 open since 07-17 |

### Theirs (Stephanie / AICAP)
| # | Action | Due | Status |
|---|--------|-----|--------|
| 1 | Fund the engagement ($11K net) | 2026-07-02 | ✅ paid in full |
| 2 | Upload de-identified samples + CVs | 2026-07-02 | ✅ received (3 apps + 4 CVs) |
| 3 | Send GitHub email/username | 2026-07-02 | ✅ done (access shared) |
| 4 | **Produce a handful of concrete compliance examples** (seeds the Week-2 architecture) | Week 2 | 🟡 homework — the live blocker |
| 5 | File GitHub issues / bugs as she uses the app | ongoing | 🟡 |

---

## Active blockers

| Blocker                              | Impact                                                            | Owner to clear             | Since      |
| ------------------------------------ | ----------------------------------------------------------------- | -------------------------- | ---------- |
| **Extraction accuracy ~83% vs. a self-set 90% bar** | Gates every demo and the Wk-7 acceptance. A/B-confirmed as upstream vision-model drift on unchanged code — so it can regress again untouched | Simon (build) | 2026-07-17 |
| Attestation question set — which of the 21 to keep | Blocks the curation item only; each dropped question retires a red-flag rule. Content, not code | Stephanie | questionnaire A3 |
| Her "wow demo" spec | Sets the demo-readiness bar | Stephanie (promised 07-24) | 2026-07-24 |

*(Cleared 2026-07-31: **Stephanie's compliance examples** — resolved by evidence, not by chasing. She delivered them as 38 GitHub issues over 07-09 → 07-29; 24 are landed and closed. The blocker had been open since 07-09 while being satisfied through a different channel the whole time.)*
*(Cleared 2026-07-09: government ID sourced; adverse-event path solved with synthetic CVs; baseline-form blocker dissolved by the superset+config reframe.)*

---

## Decisions log (append-only)

| Date | Decision | Why |
|------|----------|-----|
| 2026-06-22 | Scope locked: **Validation MVP** — CV+ID inputs, provider self-confirms, two PDFs emailed, de-identified data, integration out of scope. $11K net, 30-day refund. | Signed SOW (narrowed the older build-brief) |
| 2026-06-26 | **Architecture pivot** to Zod + Mastra, vision-LLM-only extraction (`@aicap/core`); dropped the Python service / codegen seam | Simpler, self-contained, de-risked; Phase 0 |
| 2026-06-29 | AICAP graduated to its **own repo** (`~/projects/maxi/aicap/`) | Clean separation from the equipment-finance product |
| 2026-07-01 | Payment rail = **Upwork milestone**; build in **private GitHub**; de-identified data **confirmed sufficient** (no PHI/BAA) | Kickoff call |
| 2026-07-01 | Compliance-checklist + guided-question content transfer via a **recorded field-by-field walkthrough**, not a document (none exists) | Stephanie's proposed mechanism; most efficient given knowledge lives with her |
| 2026-07-02 | Week-1 opens with a **credentialing knowledge extraction** (`knowledge/`) — field superset + rules catalog — feeding a **separate architecture-design session** in the repo, *before* wiring autofill | Simon's call; encode-the-rules design is his, and it needs the domain mapped first |
| 2026-07-02 | Extraction is a **superset across all three sample forms** (+ CVs), architecture-neutral; per-hospital "what to ask" is config over the superset | Samples span 3 different platforms; matches Stephanie's minimalism (superset = knowledge, config = what's shown) |
| 2026-07-08 | **Reframe: "here's the baseline we built, confirm/adjust"** replaces "which form do you pick" — a sensible baseline superset + per-hospital config, our judgment, she course-corrects | Lower cognitive load for her; stronger FDE posture; client checklist + walkthrough agenda restructured to match |
| 2026-07-09 | **App made publicly available; Stephanie given a login + shown how to file GitHub issues** | Co-builder handover — she surfaces bugs/spec gaps directly as she uses it |
| 2026-07-09 | **Compliance = baseline + configuration, via conditional document requirements** (answer → required doc → checked against baseline/hospital rules; e.g. a compliance-body stamp required at some hospitals, not others). Rubric transfers **iteratively** (brain-dump → her examples → build), not one recorded walkthrough | Stephanie's brain-dump at the demo; matches how the knowledge actually surfaces |

---

## Risks & load-bearing assumptions

Full ranked table lives in the contact doc → [[../bd/calls/contacts/stephanie-williamson]] (§Load-Bearing Assumptions). The build-side ranked assumptions are in the repo gameplan (§Hard dependencies). Top three to watch right now:

1. **The milestone actually funds** — verbal ≠ money in. Confirm before continuing past repo setup.
2. **The walkthrough call happens promptly and yields an encodable rubric** — the only channel for the checklist; if she stalls on it, Weeks 2–3 slip.
3. **Samples carry real nuance** (flagged / non-standard cases), not just clean happy-path forms — else the compliance logic can't be exercised.

---

## Demo / meeting log

| Date | Type | Outcome |
|------|------|---------|
| 2026-05-26 | Discovery | 5-module MVP walkthrough; recognized as painkiller |
| 2026-05-30 | Clarification | Reopened integration scope; feasibility gate inserted |
| 2026-06-17 | Discovery debrief | Killed co-pilot fallback; integration-required posture |
| 2026-07-01 | **Kickoff** | **Converted** — milestone + samples + access committed; build starting |
| 2026-07-09 | **Week-1 demo** | Walked the full working journey; app handed over (login + issue-filing); Stephanie brain-dumped the compliance model + took homework (compliance examples); forwarded an external validation interview (Dean'Na/Care to Care). *Not recorded.* |
| 2026-07-22 | Week-3 check-in | Her agenda. Build report; two commercial openings declined; GitHub channel found unreadable; new intel channels granted. |
| 2026-07-24 | **Boston Children's / Matthew** | Client-hosted intro; Simon introduced as *"my founding engineer."* **Executive buy-in surfaces as the real gate**; Matthew supplies the ROI metric gap; office-address problem solved (reverses 07-22); new config dimensions (HR/hospital forms, foreign-trained branching). **No pilot motion — the "specific ask" was not raised.** |

*(Full transcripts + notes under `bd/calls/`.)*

---

## Key links

- **Project notes (findings + items to raise with Stephanie):** [[aicap-project-notes]]
- **Credentialing knowledge base (Week-1 extraction):** [[knowledge/README|knowledge/]] — field dictionary + rules catalog + nuance cases + walkthrough agenda
- **Sample data:** `data/application-samples/` (×3) · `data/cv-samples/` (×4)
- **Scope (canonical):** [[aicap-validation-mvp-sow-2026-06-22]]
- **Build plan (canonical, in repo):** `~/projects/maxi/aicap/docs/aicap-mvp-gameplan.md` · buildlog: `aicap-mvp-buildlog.md`
- **Relationship / commitments (canonical):** [[../bd/calls/contacts/stephanie-williamson]]
- **Project overview:** [[aicap-project-reference-sheet]]
- **Delivered feasibility study:** [[deliverables/aicap-integration-discovery-deliverable-2026-06-06]]
- **Kickoff prep gameplan:** [[../active/aicap-kickoff-gameplan-2026-07-01]]
- **AICAP index:** [[CLAUDE]]

---

## Project log (append-only)

Chronological record of what's been done. Newest at the bottom.

| Date | Event |
|------|-------|
| 2026-05-26 → 06-17 | Three discovery calls + a paid feasibility-discovery sprint (Upwork). Deep engagement, no committed build. (Detail in the contact doc.) |
| 2026-06-22 | Validation MVP **SOW finalized/approved** — $11K net, 7 weeks, de-identified data, integration out of scope. |
| 2026-06-26 | **Phase 0 complete** in the repo: Zod+Mastra stack, `@aicap/core`, 5 DB entities, auth, embedded Mastra; both risk spikes (vision extraction; suspend/resume) retired. |
| 2026-06-29 | AICAP **graduated to its own repo** (`~/projects/maxi/aicap/`). |
| 2026-07-01 | **Kickoff call — converted.** Stephanie committed to fund + send samples + grant access. (Transcript/notes under `bd/calls/`.) |
| 2026-07-02 | **Full payment landed.** Sample applications (×3 platforms) + CVs (×4 specialties) received into `data/`. **GitHub access shared** with Stephanie. |
| 2026-07-02 | **Week-1a: credentialing knowledge extraction** produced → `knowledge/` (README, field-dictionary `.md`/`.yaml`, rules-catalog `.md`/`.yaml`, source-map & nuance cases, walkthrough agenda). Superset of fields + ~78 typed rules across the 3 forms + 4 CVs. |
| 2026-07-02 | **Project notes** doc created (`aicap-project-notes.md`); tracker updated with next-steps + this log. |
| 2026-07-02 → 07-03 | **End-to-end journey built + hardened** in the repo (all 5 surfaces + admin + two PDFs; compliance spine + adverse fixtures; extraction eval 10/10). Verified against a running system 2026-07-03 (`docs/STATUS.md`). |
| 2026-07-08 | `management/` folder created; demo run-sheet, client compliance checklist, and walkthrough agenda authored/reframed. |
| 2026-07-09 | **Week-1 demo delivered.** App made public + login given to Stephanie + issue-filing shown. Compliance model brain-dumped (baseline+config, conditional document requirements) + her homework set. External validation interview (Dean'Na/Care to Care) captured → [[aicap-project-notes]]. |
| 2026-07-09 → 07-19 | **Stephanie runs UAT directly in the app**, filing GitHub issues #1–#50. Issues #1–#11 (07-09 → 07-14) predate the triage system. Board closed by her own `#25 END OF TERMINUS TESTING/REVIEW` (07-18) and `#50 END OF REVIEW` (07-19). |
| 2026-07-15 | Pilot instruments authored → `management/`: conversation prep, fit questionnaire handout, cost skeleton. **None deployed since.** |
| 2026-07-17 | **Extraction accuracy regression opened** — ~83% on field values against a self-set 90% bar, A/B-confirmed as upstream vision-model drift on unchanged code. Still open. |
| 2026-07-20 | **UAT triage** written (`docs/issue-triage-2026-07-20.md`, 939 lines) — issues #13–#50 grouped into clusters A–E. |
| 2026-07-22 | Backlog unified into landable modules W1–W13 (`docs/whats-left-2026-07-22.md`), de-duped and re-verified against `develop`. |
| 2026-07-24 | **Boston Children's call** (Matthew). He agreed to test the product and asked us to come back with a specific ask — still undefined. Introduced non-credentialing form bundling, foreign/domestic branching, per-employer malpractice history. Reversed the office-address design decision. → repo `notes/2026-07-24-boston-childrens-config-call.md` |
| 2026-07-28 | **First UAT pass closed — 24 of 38 issues landed.** Client report written (`docs/client-report-2026-07-28.md`, ready to send), deploy runbook done, second-pass scope written (`docs/second-pass-2026-07-28.md`), branch state documented. Six issues left open (#16/#27/#34/#35/#37/#45), three of them consequences of the absent per-hospital config layer. |
| 2026-07-29 | Repo tip `5fda143` (submission bug fix). `feat/github-compliance` merged into `develop`; `develop` clean and pushed. Stephanie last touched **GH #3 "Pilot Readiness"** — she opened the next engagement herself. |
| 2026-07-31 | **PM agent stood up** (`agents/pm/`, `/pm` · `/pm-sync` · `/pm-capture` · `/pm-compact`). First reconciliation pass closed 4 days of tracker drift and cleared the 22-day-old "compliance examples" blocker as satisfied-by-another-channel. Worklist seeded → [[../../agents/pm/worklist]]. |
