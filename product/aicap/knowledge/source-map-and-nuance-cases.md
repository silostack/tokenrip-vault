---
type: knowledge-source-map-and-nuance
status: raw extraction
date: 2026-07-02
---

# Source Map & Nuance Cases

Two things design needs from real data: (1) **where each field's value comes from** in the MVP, and (2) the **concrete edge cases** the four sample CVs already contain. The second half operationalizes Stephanie's "walk each field and I'll tell you the scenarios."

## 1. Document → field source map

The MVP extracts from **CV + government ID**; everything else is provider-entered in the guided flow.

| Source | Fields it supplies | Confidence |
|---|---|---|
| **CV** (primary extraction target) | name, home address, phone, email, DOB, gender, NPI, specialty, education (school/degree/dates), training (type/institution/dates/director), state licenses (#/state/status/issue/exp), DEA (#/state/schedules/dates), board certs (board/status/dates/exp), work history (employer/dept/address/phone/dates), professional references, hospital affiliations (partial), academic appointments, malpractice *assertion* ("no claims") | High for structured CVs like these samples |
| **Government ID** (DL / passport) | authoritative legal-name spelling, DOB, sometimes address; identity confirmation; supports the name-match rule (XFD-01) | High |
| **Provider-entered** (guided intake) | SSN/FNIN, Medicare/Medicaid/UPIN/USMLE numbers, Tax ID, malpractice policy detail (carrier/policy#/amounts/dates), practice-location & office data, CME, clinical certs (BLS/ACLS/…), banking/ACH, place of birth, citizenship/visa, and **every disclosure-question answer** | N/A (collected, not extracted) |
| **Derived / inferred** | expansion facts (CND-04 rollover), timeline-gap detection, identifier format checks, name-match | Model-generated; flagged for confirmation |

**Design implication:** the CV covers roughly the professional-credential spine; the government ID anchors identity; the disclosure answers and financial/practice detail are always provider-entered. The "unresolved" set the workflow must chase is dominated by provider-entered items — which is exactly what the guided-intake workflow (Surface 5) is for.

## 2. Worked nuance cases (from the four sample CVs)

All four CVs share one template but differ in specialty, geography, and — usefully — in the edge cases they embed. `as of` date = 2026-07-02.

### Case A — Orthopedic (Elena C. Okafor, MD) — NPI 3456789012
- **REAL red flag — expired state license.** Maryland license `MD-D-56771` expiration **09/2025** → *expired ~10 months ago*, status still printed "Active." This is a genuine `FLG-EXP-LICENSE` follow-up (no continuous/MOC annotation to excuse it).
- **Imminent expiry.** Ohio license `35.097612` expires **01/2026** → also lapsed vs today; contrast with a still-valid license to calibrate the "imminent vs expired" boundary.
- **MOC false-positive guard.** ABOS board cert: certified 10/2011, **expiration 10/2021 "(Part II re-certification active)"** → *must NOT* be flagged (`FLG-BOARD-MOC`). A naive rule flags it; the annotation says it's maintained.
- **Multi-state licensure** (OH + MD) → two rows in the license group; each with its own expiry status.

### Case B — Cardiology (Sarah Lin Chen, MD) — NPI 1234567890
- **Two board certs, two expiry semantics.** ABIM *Internal Medicine* (certified 11/2006, **no expiration listed**) vs ABIM *Cardiovascular Disease* (certified 09/2009, **exp 09/2019 "(MOC active)"**). One looks lifetime/grandfathered, the other is time-limited-under-MOC. The model must handle "no expiration" (don't fabricate one) *and* the MOC guard — in the same record.
- **Clean continuous timeline** (fellowship ends 06/2009 → work starts 07/2009; no gap) — the negative control for the gap rule (CMP-02 / XFD-04).
- Licenses valid (CA `G 112847` exp 06/2027) — negative control for the expiry flag.

### Case C — Emergency Medicine (Marcus D. Webb, MD) — NPI 2345678901
- **No fellowship** — residency only (EM). The training group must not assume a fellowship row exists (don't flag its absence).
- **MOC guard again** — ABEM certified 11/2004, **exp 12/2014 "(Continuous Certification active)"** → not a flag.
- **Employer transition, no gap** — Kaiser LA ends 05/2014, VA Greater LA starts 06/2014 (1 month) → *below any threshold*; negative control. Also a **VA (federal) employer** — relevant to work-history verification pathways.
- Academic appointment (Clinical Instructor, 2006–Present) — overlaps employment; the timeline model should tolerate concurrent roles.

### Case D — Family Medicine (James P. Harrington, MD) — NPI 4567890123
- **Interstate career + two licenses.** MN `42678` (issued 07/2007, during residency) and CA `A 301248` (issued 09/2012, on the move to CA). License issued *during* training is normal — don't flag.
- **Employer move with matching license timing** — Mayo (MN) 07/2010–08/2012 → Stanford (CA) 09/2012–Present; the CA license (09/2012) lines up with the CA job. A cross-field consistency *positive* (license state follows work state).
- **MOC guard** — ABFM certified 11/2010, **exp 12/2017 "(Continuous Certification — active)"** → not a flag.
- **Hospital affiliations present on the CV** — Stanford (Active Staff), Lucile Packard (Courtesy Staff) → maps to `hospital_affiliations` with `affil_privilege_status` variants ("Active"/"Courtesy").

### The cross-cutting pattern (the headline nuance)

| Signal | Appears in | Correct handling |
|---|---|---|
| Board cert expiration **in the past + "MOC/Continuous/Re-cert active"** | **All 4 CVs** | **Not a flag** (`FLG-BOARD-MOC`). The single most important false-positive to prevent. |
| State license expiration in the past, **no** annotation | Ortho (MD, OH) | **Real flag** (`FLG-EXP-LICENSE`). |
| Board cert with **no expiration listed** | Cardiology (IM) | Lifetime/grandfathered — don't fabricate an expiry, don't flag. |
| Missing training tier (no fellowship) | Emergency Med | Absence is normal — don't flag. |
| License issued **during** training / on interstate move | Fam Med | Normal — don't flag. |
| Sub-threshold employer transition | Emergency Med | Negative control for the gap rule. |

**Why this matters for the build:** the demo's credibility rests on *not* crying wolf. Three of the four physicians are clean; the model must surface Okafor's genuinely-expired Maryland license while staying silent on four MOC-annotated board certs. That precision is the product.
