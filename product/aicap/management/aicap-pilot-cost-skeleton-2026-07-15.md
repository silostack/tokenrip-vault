# AICAP Pilot — Cost Skeleton (internal call-prep, not a proposal)

*2026-07-15 · For the pilot-scoping call Stephanie initiated in the GitHub issue. Structure and drivers are the point; the dollar figures are **draft planning ranges to react to — Simon sets the finals before any number is quoted.** Governing context: the signed [[product/aicap/aicap-validation-mvp-sow-2026-06-22|Validation MVP SOW]] (validation build, de-identified data, no live pilot) + the [[aicap-retainer-tear-sheet-2026-07-15|retainer tear sheet]] (Lane 2 = everything beyond SOW acceptance).*

## The frame (say this on the call)

**The Validation MVP proves the product works. The pilot makes it real at one hospital — live data, real security, and you in front of a paying customer.** Those are different animals: production hardening, a hospital's security review, a BAA, hosting, and ongoing technical oversight while it runs (integration is *not* in the pilot — it delivers via PDF, standalone). Stephanie's own instinct — **a milestone for the build, a retainer for the oversight** — is exactly the right shape. Our job on the call is to fill in the drivers and hand her a grounded high-end number to plan against.

Her request was "give me the **high end** so I can plan." A high planning number is a gift — it protects pricing and it's honest. Give a **structured range broken out by driver**, live, where we can read her — never a single scary figure dropped in writing first.

## The two components

### 1. Milestone — the one-time build to get pilot-ready

The pilot build is the Validation MVP (owned by AICAP on acceptance) taken from "works on de-identified samples" to "runs live at Hospital X." Components, each a driver:

| Component | What it is | Driver / swing |
|---|---|---|
| **Production hardening + security baseline** | Real-data handling, encryption at rest/in transit, audit logging, least-privilege access, environments | Fixed-ish; every pilot needs it |
| **BAA + AI-provider setup** | Anthropic (or chosen provider) BAA, **zero-retention config, no-training**, sub-processor inventory + BAA chain documented | Small, fixed; this is also the answer to the hospital's #1 objection |
| **Vendor security review support** | Completing the hospital's questionnaire (Censinet / HECVAT / custom), InfoSec back-and-forth, evidence package | **Routinely underestimated.** Scales with how heavy the hospital's review is (Tier-2 §B) |
| **Identity / SSO integration** | SAML/OIDC into their IdP (Okta / Entra / Ping), MFA | Present if they require SSO (Tier-2 §C); modest |
| **Hosting setup** | Vendor-hosted vs. their cloud tenant vs. on-prem; network controls (allowlisting/VPN/private link) | Their-environment or on-prem adds setup (fit-sheet §Hosting) |
| **Per-hospital configuration** | This hospital's specific forms, rules, state variants beyond the one baseline | Scales with their requirements |

> **Integration is NOT in the pilot.** The pilot delivers the two PDFs by email, exactly as the signed MVP does (SOW deliverables). It runs **standalone** — it never wires into the hospital's credentialing system. Any such integration is a *separate, later, post-pilot phase*, priced on its own when a hospital wants it. This makes the pilot materially leaner, cheaper, and faster to sell than an integrated deployment — say so.

**With integration out, the biggest swings are the security/compliance clearance and production hardening**, not any system wiring. A hospital demanding HITRUST-before-pilot or a months-long review is the expensive/slow case; SOC 2-acceptable with a weeks-long review is the lean case.

**Illustrative milestone ranges (DRAFT — confirm before quoting):**
- **Lean pilot** (SOC 2-level bar, light/quick security review, vendor-hosted, baseline config): **~low-five-figures.**
- **Heavier pilot** (deep security review, their-cloud/on-prem hosting, more per-hospital config): **mid-five-figures.**

> These are planning brackets, not a price sheet. Simon confirms the actual numbers against a specific hospital's answers. The point of the call is to learn *which bracket* a given hospital lands in.

### 2. Retainer — technical oversight while the pilot runs

This is the "technical oversight" Stephanie named directly, and it's pure Lane 2. Prices **priority and continuity** during a live pilot: monitoring, iteration on real-world edge cases, coordinator/provider support, and being the person who can fix things fast while she's in front of a customer. Use the **tear-sheet tiers** (already reasoned through):

| Tier | Cadence | Anchor |
|---|---|---|
| Light | ~1 d/wk | $3.5–4.5K/mo |
| **Standard** | ~2 d/wk | **$6.5–8K/mo (anchor $7,500)** |
| Sprint | ~3 d/wk | $10–12K/mo (if the pilot window is hot) |

A pilot typically runs **2–4 months** of active oversight, so the retainer is a real, plannable line: e.g. Standard × 3 months ≈ $22.5K. Present the milestone and the retainer as **one plan**, not two invoices to argue over.

## The variables to resolve on the call *(these map 1:1 to the questionnaire)*

Walk the call along these — answering them *is* the estimate:
1. **How heavy is their security review?** (Censinet/HECVAT, SOC 2 vs. HITRUST, duration) → the biggest swing: security-support line + timeline
2. **Cloud processing of provider data — permitted?** (includes AI under BAA/zero-retention) → feasibility gate (usually yes)
3. **Hosting model** (vendor-hosted / their cloud / on-prem) → hosting line
4. **Per-hospital config beyond the baseline** → config line
5. **Pilot size + how hands-on she wants me** → retainer tier
6. **Timeline** → sequencing, and whether Sprint tier applies

*(Integration is out of the pilot — don't scope it here; it's a separate future phase.)*

## Guardrails (do not skip)

- **This is a new engagement, separately scoped** — it does not touch the signed SOW (SOW §Future Opportunities says exactly this). The pilot gets its own SOW once scoped.
- **Beyond-SOW is paid, always.** The pilot build and the fit questionnaire are both Lane 2 deliverables/IP — never framed as favors that reset the "everything's included" expectation.
- **The cap holds.** AICAP is a *capped* afternoon block during the Quintel 90-day sprint; delivery gravity is the #1 threat to the call block. Scope creep goes in the retainer queue, never into Simon's nights. A well-qualified hospital (the questionnaire's job) = lower schedule risk = the fixed-price milestone doesn't blow up.
- **The partnership agreement.** Fold the still-un-papered design-partner agreement (reference / case-study rights) into this conversation per the tear sheet — the pilot is the natural moment to close it.

## Success on the call
Milestone-plus-retainer confirmed as the shape · a driver-broken high-end range she can plan against · agreement that the fit questionnaire gates which hospitals we pursue · the partnership-agreement draft promised. No single number quoted in writing before the drivers are known.
