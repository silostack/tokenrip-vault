---
type: competitive landscape
vertical: immigration consultancy
status: working note
date_created: 2026-05-20
origin: surfaced during Luai El Haj proposal scoping
---

# Immigration SaaS Landscape

> Working note on what immigration consultancies and immigration consultants already pay for. Surfaced during the Luai El Haj proposal scoping (`bd/calls/proposals/luai-elhaj-2026-05-20-final.md`). Maintained so Tokenrip is not flying blind when comparison-shopping prospects bring up alternatives.

## One-Line Positioning

These tools are **case-management software** (client portals, billing, document storage, deadline tracking, form generation). They run roughly $40 to $600 per user per month. Tokenrip is **an AI workflow layer** focused specifically on file-readiness review — sits on top of whatever case-management tool the firm already uses, does not compete with them on the case-management axis.

**Pricing implication:** Do not price Tokenrip as generic case-management SaaS. Per-user-per-month subscription pricing in this range would commoditize what is actually custom build + workflow tuning. Price as a design-partner workflow layer with one-time build plus bridge monthly plus per-application-type expansion — fundamentally different commercial logic from per-seat SaaS.

**Bridge monthly is deliberately lower than the SaaS range.** At $500/month flat (not per-user), Tokenrip's recurring pricing lives below the cheapest tier of every case-management competitor. This is intentional — the bridge is not subscription, it is the holding pattern between Phase 1 (build) and Phase 2 (B2B multi-tenant scale). When Phase 2 starts, pricing changes structure entirely. Operators who fixate on "$500/mo seems cheap for a real product" are reading us against the wrong reference category.

## Named Players

### Docketwise
- **Category:** Immigration case-management software (US-focused, immigration attorneys + RCICs)
- **Pricing:** Roughly $69 to $119 per user per month
- **Source:** https://www.docketwise.com/pricing/
- **What they actually do:** Client questionnaires, form auto-fill, case tracking, document storage, billing.
- **Tokenrip relationship:** Complementary — Docketwise is the case backbone; Tokenrip would review files for inconsistencies before submission.

### VisaNauta
- **Category:** Immigration case-management + workflow automation (broader international focus)
- **Pricing:** $39 to $279 per month
- **Source:** https://www.visanauta.com/
- **What they actually do:** Workflow automation for visa processing, case management.
- **Tokenrip relationship:** Closer to our category than Docketwise. Worth a deeper look — if VisaNauta also offers AI review features in their higher tier, that is the more direct alternative. Watch for feature drift.

### RCICdesk
- **Category:** Canada-specific immigration case-management (RCIC = Regulated Canadian Immigration Consultant)
- **Pricing:** CA$49 per month
- **Source:** https://rcicdesk.app/
- **What they actually do:** Lightweight case management built specifically for RCICs. Canada-specific.
- **Tokenrip relationship:** Tiny-budget tier. Most relevant for solo and small Canadian consultancies (Luai's category). If Luai already uses or considers RCICdesk, Tokenrip is the layer above — not the replacement.

### Navisa
- **Category:** Immigration case-management with case-based usage tiers
- **Pricing:** $59 to $599 per month with case-based overages
- **Source:** https://www.navisa.io/
- **What they actually do:** Case management with volume-based pricing.
- **Tokenrip relationship:** Complementary. Their case-based overage model is interesting as a data point on what immigration firms accept volume-based pricing for.

## What This Means For Pricing

The market has already trained immigration firms to expect **monthly subscription pricing in the low hundreds**. This creates two structural issues for Tokenrip:

1. **Anchor risk.** If a firm comparison-shops Tokenrip's monthly against Docketwise's $69 per user, we lose on price every time. The way out is not to price below that — it is to be in a different category entirely.
2. **Per-user pricing pulls us toward case-management framing.** Per-user-per-month subscription is the case-management category's pricing model. Adopting that model implicitly puts us in that category. Tokenrip's pricing must look different: one-time pilot fee + per-application-type expansion. The agreement structure already enforces this.

## Second-Call Objection Handling

If Luai (or any immigration prospect) brings these up, the responses:

| Objection | Response |
|---|---|
| **"Docketwise is $69 per user per month, why is yours $5,000?"** | "Docketwise is case management — client portals, billing, document storage, deadlines. Tokenrip is the AI review layer that runs on top of whatever case-management tool you use. They are not the same purchase. If you wanted both, the pricing is not in conflict because they do not overlap." |
| **"VisaNauta has AI features too."** | "It is worth a look. Where Tokenrip is different is the depth — we do a custom build on your real files in your real workflow, calibrated to your specific document types (Middle Eastern passports, Indian birth certificates, transliteration variants). Generic AI features do not catch the 14 discrepancy categories specific to your client population. The $5,000 buys that calibration." |
| **"RCICdesk is CA$49 and built for Canadian immigration."** | "Right, and Tokenrip is not RCICdesk. RCICdesk is lightweight case management for solo consultants — case tracking, scheduling. Tokenrip is AI workflow that runs file-readiness review across whatever case management you use. If you are using RCICdesk and need the AI layer on top, both make sense." |
| **"I will just keep using my existing AI assessment tool plus offshore team."** | "Your assessment tool handles intake — does someone qualify. The 14 discrepancy categories are about file integrity post-qualification, pre-submission. That is a different problem. If your team is catching all 14 categories manually today, that is the right answer; the pilot's 30-day refund means you can test whether the AI catches things your team misses." |

## What's Missing From This Note

- **VisaNauta feature deep-dive.** If they have AI review features in higher tiers, the positioning above weakens. Worth 30 minutes of research before Luai's second call.
- **Trujillo / VisaCloud / other niche players.** Likely 5 to 10 more entrants in this space; document as they come up in calls.
- **Enterprise legal/case management** (Mitratech, IMS, Tracker iManage) — different category (enterprise law-firm IT) but worth knowing about for upmarket prospects.

## Related

- Luai El Haj proposal: `bd/calls/proposals/luai-elhaj-2026-05-20-final.md`
- Commercial agreement: `bd/calls/proposals/luai-elhaj-2026-05-20-agreement.md`
- General competitive landscape: `intelligence/landscape-tracker.md`
- Tokenrip-specific landscape tracker: `intelligence/tokenrip-landscape-tracker.md`
