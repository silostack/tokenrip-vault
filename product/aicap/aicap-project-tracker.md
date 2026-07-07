---
type: project-tracker
project: AICAP Validation MVP
client: AICAP — Stephanie Williamson
owner: Simon Pettibone
status: active — Week 1 (knowledge extraction done; architecture session next)
last_updated: 2026-07-02
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
| **Phase** | Phase 0 (foundation + de-risk) ✅ complete · **Week 1 starting** (gated on inputs) |
| **Momentum** | ↑ Converted at kickoff (2026-07-01) — first committed paid build |
| **Commercial** | $11K net — ✅ **FULL PAYMENT LANDED 2026-07-02.** (Note: full payment, not a milestone slice — confirm the Upwork arrangement matches.) |
| **30-day refund clock** | ~**2026-07-31** (30 days from kickoff). *Confirm whether the clock starts at kickoff or at funding.* |
| **Next milestone** | Week 1 — autofill live · target demo **Fri 2026-07-11**. First step = the credentialing knowledge extraction (below), feeding Simon's repo architecture session. |
| **Blocking right now** | Only **government-ID samples** (Simon sourcing from the web) + **the walkthrough** (for Week-2 rules). Sample apps + CVs received; payment landed; GitHub access shared. |

---

## ▶ Next steps (Simon) — orient here

Do these roughly in order:

1. **Run the architecture-design session in the AICAP repo** — encode the rules + data model using `knowledge/` (start from the gap table at the end of `knowledge/rules-catalog.md`). This is tracker item **1b** and gates the autofill build.
2. **Source a sample government ID** (DL or passport) from the web so autofill can be tested on the CV **and** ID inputs.
3. **Build Week-1 autofill** (CV + ID → extract → persist → pre-fill) once the design lands — target demo **Fri 2026-07-11** (item 1c).
4. **Send Stephanie the written follow-up** — lock the weekly-demo cadence + 30-day refund-clock start; **request a CV with a disclosed adverse event** (to demo the flag path — all current samples are clean) + her Replit export. Details in [[aicap-project-notes]] → "Items to raise with Stephanie."
5. **Schedule the field-by-field walkthrough** once autofill stands up — agenda ready at `knowledge/walkthrough-questions.md`.

---

## Milestone tracker

Target demo dates are **anchored to input arrival** — if samples land late, every row shifts. The SOW allows moving the schedule either direction. Legend: ✅ done · 🟡 in progress · ⬜ todo · ⛔ out of scope.

| Wk     | Deliverable                                                                                                       | Target demo     | Status                  |
| ------ | ----------------------------------------------------------------------------------------------------------------- | --------------- | ----------------------- |
| 0      | Kickoff / scoping — inputs, baseline, checklist scope locked                                                      | —               | ✅ 2026-07-01            |
| **P0** | Stack + `@aicap/core` + backend/frontend foundation + risk spikes (vision extraction; suspend/resume)             | —               | ✅ complete (2026-06-26) |
| 1a     | **Credentialing knowledge extraction** — field superset + rules catalog from the 3 samples + 4 CVs (`knowledge/`) | —               | ✅ 2026-07-02            |
| 1b     | **Architecture-design session** (in the AICAP repo) — encode rules + data model, informed by `knowledge/`         | —               | ⬜ Simon, next           |
| 1c     | **Application autofill** live on sample inputs (CV, ID, extracted+entered numbers); context expansion begins      | Fri 2026-07-11  | ⬜ after 1b              |
| 2      | **Automated compliance review** calibrated to the checklist; config in place                                      | Fri 2026-07-18  | ⬜ gated on walkthrough  |
| 3      | **Provider review/confirm + guided intake** live                                                                  | Fri 2026-07-25  | ⬜                       |
| 4      | **Two PDFs** (completed app + audit trail) generated + emailed on submission; attestation capture                 | Fri 2026-08-01  | ⬜                       |
| 5      | **Admin operability** (list / status / errors / counts) + full sample-set run                                     | Fri 2026-08-08  | ⬜                       |
| 6      | Iteration tail / edge cases                                                                                       | Fri 2026-08-15  | ⬜                       |
| 7      | **Acceptance + handoff**                                                                                          | ~Fri 2026-08-22 | ⬜                       |

---

## Critical path — AICAP kickoff inputs

**This is the dependency that gates the whole build.** No formal checklist doc exists (it's "in her head"), so the compliance rubric + guided-question content transfer via a **recorded field-by-field walkthrough call**, not a file. Samples are the hard Week-1 blocker — press hardest there.

| Input | Needed for | Delivery mechanism | Committed | Status |
|-------|-----------|--------------------|-----------|--------|
| De-identified sample applications (×3, different platforms) + sample CVs (×4) | **Week 1** | Uploaded | 2026-07-02 | ✅ received → `data/`; extracted into `knowledge/` |
| Sample **government ID** (DL or passport) | Week 1 | Simon sources from the web | — | 🟡 Simon to add |
| Compliance checklist (Joint Commission / CMS / NCQA items) | Week 2 | **Field-by-field walkthrough call** (recorded) | after build stands up | 🟡 mechanism set; agenda drafted → `knowledge/walkthrough-questions.md` |
| Baseline configuration (which form; forms/logo/questions/state/history/affiliation/malpractice/distance) | Week 2 | Walkthrough call + sample forms | after Week-1 | 🟡 baseline form still to pick (walkthrough Q1) |
| Guided-question content (prompts + resource pointers) | Week 3 | Walkthrough call | after Week-1 | 🟡 |
| GitHub repo access | Setup | Access shared with Stephanie | 2026-07-02 | ✅ shared |
| Milestone funding ($11K net) | Kickoff/start | Upwork | 2026-07-02 | ✅ **paid in full** |

---

## Open action items

### Ours (Simon / Tokenrip)
| # | Action | Due | Status |
|---|--------|-----|--------|
| 1 | Set up private GitHub repo + share access with Stephanie | 2026-07-01 | ✅ shared 2026-07-02 |
| 2 | Confirm payment landed | 07-02 | ✅ paid in full |
| 3 | **Credentialing knowledge extraction** (`knowledge/`) | 2026-07-02 | ✅ done |
| 4 | Source a sample government ID (DL/passport) from the web | before autofill | ⬜ |
| 5 | **Architecture-design session** in the AICAP repo (encode rules + data model from `knowledge/`) | next | ⬜ |
| 6 | Build Week-1 autofill after the design session | ~Fri 07-11 | ⬜ |
| 7 | First written follow-up: **lock weekly-demo cadence + name the 30-day refund clock start** | next contact | ⬜ |
| 8 | Schedule the recorded field-by-field walkthrough (agenda ready → `knowledge/walkthrough-questions.md`) | after autofill stands up | ⬜ |
| 9 | Ask Stephanie for her Replit export/screenshots as a build reference | next contact | ⬜ |

### Theirs (Stephanie / AICAP)
| # | Action | Due | Status |
|---|--------|-----|--------|
| 1 | Fund the engagement ($11K net) | 2026-07-02 | ✅ paid in full |
| 2 | Upload de-identified samples + CVs | 2026-07-02 | ✅ received (3 apps + 4 CVs) |
| 3 | Send GitHub email/username | 2026-07-02 | ✅ done (access shared) |
| 4 | Do the field-by-field walkthrough (once a build exists) | after Week-1 | ⬜ |

---

## Active blockers

| Blocker                              | Impact                                                            | Owner to clear             | Since      |
| ------------------------------------ | ----------------------------------------------------------------- | -------------------------- | ---------- |
| Sample government ID not yet in hand | Autofill covers CV **and** ID; ID extraction untested without one | Simon (source from web) | 2026-07-02 |
| Baseline form not yet picked | Week-2 config needs one chosen form (S1 vs S3) | Stephanie (walkthrough Q1) | 2026-07-02 |
| No adverse-event CV sample | Can't demo the red-flag / disclosure path (all 4 samples are clean) | Stephanie (or Simon constructs) | 2026-07-02 |

*(Cleared 2026-07-02: sample apps + CVs received; payment landed in full; GitHub access shared.)*

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
| 2026-07-11 | Week 1 demo (target) | — |

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
