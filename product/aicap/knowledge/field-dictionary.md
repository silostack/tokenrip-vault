---
type: knowledge-field-dictionary
status: raw extraction — companion to field-dictionary.yaml
date: 2026-07-02
---

# Credentialing Field Dictionary — reader's guide

> The exhaustive, structured field list is **[`field-dictionary.yaml`](field-dictionary.yaml)** (the "data"). This file is the human guide: how the fields are organized, what each category means, and — most useful for design — **where the three forms disagree on the same concept**.

## Two axes

The corpus splits into two credentialing contexts. Keep them separate in any model:

- **Axis 1 — Individual provider** (S1 universal + S3 CVO): the AICAP MVP core. A physician's identity, credentials, history, and disclosures. CV-fed. This is the vast majority of the dictionary.
- **Axis 2 — Facility / entity + Medicaid enrollment** (S2): an *organization's* TIN, ownership (42 CFR 455), service locations, and accreditation. Org-level, adjacent to the MVP. Captured at the end of the YAML under `entity_axis`.

## Axis-1 categories (individual provider)

| Category | What it holds | Cardinality | Primary source |
|---|---|---|---|
| `identity` | legal name, degree, other-names, DOB, sex, place of birth, citizenship/visa, SSN/FNIN, languages | single | government ID + CV |
| `contact` | mailing address, phones, email, fax, preferred contact | single | CV |
| `professional_ids` | NPI, Medicare/Medicaid, UPIN, USMLE, ECFMG, Workers-Comp, Tax ID | single | CV (NPI) + provider-entered |
| `licensure` | state medical licenses | **repeating** | CV |
| `controlled_substance_registrations` | DEA (×2) + CDS | **repeating** | CV |
| `education` | med-school + graduate-type branch | single (+branch) | CV |
| `training` | internship / residency / fellowship / other | **repeating** | CV |
| `specialty_board` | specialties + board certification/recert | **repeating** | CV |
| `clinical_certifications` | BLS / ACLS / ATLS / PALS | group | provider-entered |
| `licensing_exams` | USMLE / NBME / FLEX / SPEX / State / LMCC | group | provider-entered |
| `practice_location` | directory + billing practice info | **repeating** | provider-entered |
| `related_contacts` | credentialing / office-manager / billing / forwarding contacts | group | provider-entered |
| `office_practice_status` | hours, coverage, panel status, mid-levels | group | provider-entered |
| `hospital_affiliations` | privileges / facility affiliations (10 yr) | **repeating** | CV (partial) |
| `covering_colleagues` | covering non-partner colleagues | **repeating** | provider-entered |
| `references` | peer/physician references | **repeating** | CV |
| `malpractice_insurance` | liability policies (current + 10 yr) | **repeating** | provider-entered |
| `malpractice_claims` | per-claim detail | **repeating**, conditional | provider-entered |
| `work_history` | chronological employment (10 yr) + gaps | **repeating** | CV |
| `cme` | CME activity (3 yr) | **repeating** | provider-entered |
| `disclosure_questions` | 26 (S1) / 19 (S3) yes-no adverse-history questions | **repeating set** | provider-entered |
| `attestation` | authorization / release / certification + e-signature | group | provider-entered |
| `banking` | ACH / direct deposit | group | provider-entered |

**Repeating groups are the structural story.** Licenses, DEA/CDS, training, board certs, affiliations, references, liability policies, work-history entries, CME, and disclosure questions are all *lists*, several with their own sub-fields. The current repo `applicationFieldSchema` (a flat `{key,label,required,pattern}`) has no notion of a repeating group — see the repo-alignment note in `rules-catalog.md`.

## Where the forms disagree (the design-relevant variance)

Same concept, different shape across forms — the encoding must absorb this, and the baseline must *pick*:

| Concept | S1 (universal) | S3 (CVO/locum) | Note |
|---|---|---|---|
| **Work-gap explanation threshold** | > **3 months** | > **30 days** (body) / > **60 days** (instructions) | Three thresholds; internal conflict even within S3. → walkthrough Q. |
| **Disclosure questions** | **26** questions | **19** questions | Different sets; collapse to shared red-flag categories. |
| **Specialty capture** | fixed **grid** of ~35 specialties (check primary/secondary) | free **board table** (name/specialty/dates) | Grid vs free-text. |
| **License table** | state / #/ issue / exp / practicing-flag | + status(active/inactive) / initial-flag / **Medicare & Medicaid provider # / state CDS #** per state | S3 richer per row. |
| **Board certification** | certified-flag + not-certified branch | date certified + **two recert dates** + expiration | S3 richer. |
| **References** | "covering colleagues" only | **6 physician references** within past year | Different intent. |
| **Date format** | mostly `MM/YYYY`; some `MM/DD/YYYY` | `MM/YY` in tables; DOB `MM/DD/YY` | Normalization needed (Stephanie's example). |
| **CME / clinical certs / ACH** | absent | present (CME 3 yr; BLS/ACLS/…; direct deposit) | S3-only additions. |
| **Credentialing axis** | individual privileging | individual CVO/locum | (S2 = facility/Medicaid, separate) |

## Field-source split (drives the workflow)

- **From the CV** (rich): name, contact, DOB, NPI, specialty, education, training (incl. director), licenses (#/state/status/dates), DEA (#/schedules/dates), board certs, work history (employer/address/dates), references, hospital affiliations (partial). → this is what vision extraction pre-fills.
- **From the government ID**: authoritative legal name spelling, DOB, sometimes address; identity confirmation.
- **Provider-entered** (not derivable): SSN, Medicare/Medicaid/UPIN/USMLE numbers, Tax ID, malpractice policy detail, practice-location/office data, CME, clinical certs, banking, and **every disclosure-question answer**.

Full per-field detail, provenance (form + page), and label variants are in **[`field-dictionary.yaml`](field-dictionary.yaml)**. The worked mapping from each CV into these fields — and the nuance cases — is in **[`source-map-and-nuance-cases.md`](source-map-and-nuance-cases.md)**.
