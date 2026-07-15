---
type: project-tracker
project: AICAP Validation MVP
client: AICAP — Stephanie Williamson
owner: Simon Pettibone
status: active — Week-1 demo delivered (2026-07-09); Week-2 compliance calibration next
last_updated: 2026-07-09
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
| **Phase** | Phase 0 ✅ · **end-to-end engine built + demoed** (Week-1 demo 2026-07-09) · **Week-2 compliance calibration** active |
| **Momentum** | ↑↑ Demo landed on the full working journey; app handed to Stephanie (login + issue-filing) |
| **Commercial** | $11K net — ✅ **paid in full 2026-07-02** (escrow funded 2026-07-07 per DASHBOARD) |
| **30-day refund clock** | ~**2026-07-31** (30 days from kickoff). Weekly demos fall inside it — visible progress each week is the safety mechanism. |
| **Next milestone** | **Week-2 compliance calibration** — encode Stephanie's baseline+config compliance model (conditional document requirements, document-property checks, hard/soft stops), seeded by her worked examples. |
| **Blocking right now** | **Stephanie's compliance examples** (her homework — seeds the Week-2 architecture). Government-ID sourced; samples/CVs received; payment landed; app + repo access shared. |

> **Note on the milestone table below:** the repo built the full end-to-end journey (all five surfaces + admin + PDFs), verified against a running system 2026-07-03 and demoed 2026-07-09. The remaining weeks are **calibration to AICAP's real content** (compliance rules, guided-question wording), not net-new plumbing — the "hard 20%." Build state is authoritative in the repo (`docs/STATUS.md`).

---

## ▶ Next steps (Simon) — orient here

Do these roughly in order:

1. **Design the Week-2 compliance architecture** — encode the baseline+config model Stephanie described: conditional document requirements (answer → required doc), document-property validation (present / correct type-version / required stamp), hard vs soft stops. Baseline handling first; keep it extensible. (Findings → [[aicap-project-notes]] → "The compliance model.")
2. **Get Stephanie's compliance examples** (her homework) — the concrete cases that seed the architecture. Chase if they don't arrive.
3. **Triage her GitHub issues** as she files them (app is public; she has a login).
4. **Send the written follow-up** — lock the weekly-demo cadence + 30-day refund-clock start (still open). Ask for her Replit export.
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
| 2      | **Automated compliance review** — engine built; **calibrating to Stephanie's real rules** (baseline+config, document requirements) | ~Fri 2026-07-18 | 🟡 active — Week 2       |
| 3      | **Provider review/confirm + guided intake** — built (provisional content); calibrating wording                   | —               | ✅ built · 🟡 calibrate  |
| 4      | **Two PDFs** (completed app + audit trail) + attestation capture                                                  | —               | ✅ built                 |
| 5      | **Admin operability** (list / status / errors / counts) + full sample-set run                                    | —               | ✅ built                 |
| 6      | Iteration tail / edge cases                                                                                       | —               | ⬜                       |
| 7      | **Acceptance + handoff**                                                                                          | ~Fri 2026-08-22 | ⬜                       |

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
| 4 | **Design the Week-2 compliance architecture** (baseline+config: conditional document requirements, document-property checks, hard/soft stops) | Week 2 | 🟡 active |
| 5 | Triage Stephanie's GitHub issues as she files them | ongoing | 🟡 |
| 6 | First written follow-up: **lock weekly-demo cadence + name the 30-day refund clock start** | next contact | ⬜ |
| 7 | Ask Stephanie for her Replit export/screenshots | next contact | ⬜ |

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
| Stephanie's compliance examples not yet in hand | Seeds the Week-2 compliance architecture; without them, calibration runs on inference | Stephanie (homework) | 2026-07-09 |

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
