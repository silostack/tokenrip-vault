---
project: AICAP Access
contact: Stephanie Williamson
status: paid discovery in progress
last_updated: 2026-06-05
---

# AICAP Access — Project Reference Sheet

## The Problem

When a hospital hires a physician, the physician must complete a **credentialing application** before they can start seeing patients. This application is regulatory-heavy (Joint Commission, CMS) and full of questions physicians don't understand — they answer incorrectly, leave required fields blank, or submit documents that don't meet compliance standards.

The result: **4–6 weeks** of a credentialing coordinator going back and forth with the physician trying to get a complete, compliance-ready application. A second 4–6 week phase (privileging) follows. Total: **8–12 weeks** of a revenue-generating physician sitting idle.

**Quantified pain:** $22,000/day in lost revenue per applicant at Vanderbilt scale (~500 applicants in process at any time). Specialists run higher — cardiologists $8–15K/day, orthopedic surgeons $15–40K/day. A 90-day delay for one orthopod = >$1M unrecovered.

The bottleneck isn't the verification or the privileging committee — it's the **incomplete application**. That's the wedge.

## Who It's For

Hospital **Medical Staff Offices (MSOs)** — specifically the credentialing coordinators who process physician applications. These roles take ~3 years to become fully competent due to the regulatory nuance. AICAP also levels up junior coordinators by offloading the complexity to the system.

The buyer is the **MedCal executive committee** (hospital decision body). Sales cycle: 6–12 months for integrated software, potentially shorter for a lightweight overlay that doesn't require rip-and-replace.

## How It Works

AICAP sits at **step 4 of the credentialing pipeline** — between application submission and primary source verification. This step doesn't exist as software at most hospitals today; it's entirely human.

**Five-module pipeline:**

| Module | Function |
|--------|----------|
| **1. CV Ingestion** | OCR + structured field extraction from submitted documents |
| **2. Inference Layer** | Keyword triggers auto-fill related fields (e.g., "faculty member at UCSD" → inferred hospital affiliation, malpractice, work history) |
| **3. Deterministic Gateway** | Sorts information into resolved vs. unresolved against the compliance bar |
| **4. Contained AI Layer** | Reasoning/logic to fill remaining gaps from available data |
| **5. Guided Question-Asking** | Replaces dumb fillable forms with system-intuited prompts that walk the provider to compliance; unresolvable items get resourced (office manager contacts, etc.) |

**Output:** A compliance-ready application with an audit trail, plus red-flag surfacing (DUI, malpractice claims, incidents) at the top for coordinator review.

## Integration Model

**Not a rip-and-replace.** AICAP sits on top of the three major legacy credentialing systems:

- **Symplr** (Cactus) — Vanderbilt runs this; symplr's Application Manager portal + XML import is the front door
- **MD-Staff**
- **VerityStream**

**Critical constraint (discovered Call 2):** The application data must be written *into* the legacy system's instance via integration — not handed off as a PDF. Legacy systems are instance-based; each applicant is a "deployment" that triggers downstream verification tasks. A coordinator manually entering data doesn't fulfill the instance, and logging in as the provider is unethical. **Integration is mandatory.**

## Phase 2 — Privileging

Matching a physician's clinical qualifications to the specific privileges they're requesting (procedures, equipment, scope of practice). Currently a human matching hundreds of clinical names against clinical requirements, pulling in physician reviewers for ambiguous cases. Per Stephanie: **more deterministic than Phase 1, potentially easier to build, and can run concurrently.** Together, Phases 1+2 compress the 8–12 week cycle to "a week or two."

## Design Partners

| Partner | Status |
|---------|--------|
| **Harvard Health** | Closest — active design partner relationship |
| **Duke University** | Close to decision makers |
| **MD Anderson** | Biggest US cancer center; leadership actively meeting on compressing physician onboarding |

## Regulatory Tailwinds

- **NCQA** tightened Primary Source Verification window to 120 days (July 2025)
- **CAQH** ramping attestation frequency in 2026

## Competitive Landscape

~10 major credentialing software companies. All innovated in the 1990s (digitizing paper files) and haven't meaningfully evolved since. No data integrity, no guardrails, no compliance intelligence built in. All tribal knowledge, institutional history, fragmented.

## Business Model

Premium licensing fee. Stephanie is not optimizing on cheapest — she wants premium quality to charge premium price. The ROI math supports it ($22K/day unlocked per applicant).
