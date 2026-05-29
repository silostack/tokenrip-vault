# BD KPIs — The Roadmap

**Status**: Active reference v0.1 (locked 2026-05-01)
**Owners**: Simon (North Star + revenue), Alek (process KPIs + CRM hygiene), Both (Monday review)
**General principles + frameworks**: [[../__RESOURCES/yc-startup-metrics-frameworks]] (Tom Blumfield + Divya synthesized — read once, reference as needed)
**Replaces**: [[firm-direct-strategy/kpis]]

---

## North Star (90 Days)

By week 12 (YC application + a16z window):
- **10-15 published imprints**
- **5,000-15,000 registered operators**
- **First tooling-tier MRR** (any amount > $0)
- **1 lighthouse persona conversation late-stage**
- **Series 3 posts 9-11 published**, "mounted agents" cited externally

By Demo Day (week 20): scale to 25-40 imprints, 10K-50K operators, $5K-25K MRR, 1-2 lighthouse personas live, sustained 15%+ WoW operator growth.

---

## Primary KPI Roadmap

### Phase 1 (now → trigger): Pipeline Progression

**Track:** Mid-tier creators by CRM stage — `sourced → outreach sent → reply → call booked → demo done → deploy in progress → live`.

**Targets:**

| Week | Outreach sent (cum.) | Calls booked (cum.) | Demos done (cum.) | Deploys in progress |
|---|---|---|---|---|
| 1 | 0-20 | — | — | — |
| 2 | 50-80 | 2-3 | — | — |
| 3 | 100-130 | 5-7 | 2-3 | 1 |
| 4 | 150-180 | 7-10 | 4-5 | 2-3 |

**Trigger to move to Phase 2:** First 1-2 deploys live (target: week 5).

### Phase 2 (trigger → next trigger): Deploys + Audience Registration

**Track:** Live deploys + average operators per deploy + total registered operators.

**Targets:**

| Week | Live deploys | Operators / deploy | Total operators |
|---|---|---|---|
| 5 | 1-2 | 200-500 | 200-1,000 |
| 6 | 3-5 | 300-800 | 1,000-3,000 |
| 7 | 5-7 | 400-1,200 | 3,000-7,000 |
| 8 | 7-10 | 500-1,500 | 5,000-15,000 |

**Trigger to move to Phase 3:** ≥5 deploys live AND first tooling-tier conversion happens (target: week 8-9).

### Phase 3 (trigger → ongoing): Growth Rate + Revenue

**Track:** WoW operator growth rate (excluding new-deploy spikes) + tooling-tier conversion rate.

**Targets by week 12:** 10-15% WoW growth sustained. 1-3% tooling-tier conversion. First MRR live.

**This is the metric set that fundraising is sold against.** Per Paul Graham: 5-7% WoW good, 10% exceptional.

---

## Secondary KPIs

Three to five only. Tracked weekly to keep the primary honest.

| KPI | Measures | Failure mode if drifts |
|---|---|---|
| Operators per imprint (avg) | Distribution worked | Deploys live, no audience mounting → diagnose creator promotion or fit |
| Return rate per operator (≥2x mounts/week) | Engagement worked | High register, low return → imprint quality / wrong audience |
| Memory growth per imprint | Compounding worked | Flat memory → operators registered but not using |
| Tooling-tier conversion rate | Monetization worked | Engagement high, conversion zero → tier or pricing wrong |
| Per-imprint MRR | Revenue per deploy is real | Concentration → segmentation insight, not failure |

---

## Always-On (Investor-Update Top of Page)

Per Tom: revenue, burn, runway always at the top of every investor update. Log even when ugly.

| Metric | Definition | Owner |
|---|---|---|
| Revenue | Tooling-tier MRR (+ any cash advances post-capital) | Simon |
| Burn rate | Monthly costs minus revenue | Yoda layer |
| Runway | Months until cash runs out at current burn | Yoda layer |

**Retention target (once data exists, week 12+):** NDR > 100% on operator cohorts. Mounted agents are structurally suited for this — see [[../__RESOURCES/yc-startup-metrics-frameworks]] retention section. Below 100% means leaky bucket; fix before scaling acquisition.

**Gross margin target:** >90%. Tokenrip's COGS is storage + tooling-call infrastructure, not inference (operator pays inference directly). The AI-margin-compression problem doesn't apply here by design — fundraising line.

---

## Vanity to Ignore

- LinkedIn / Twitter follower counts
- Total creators sourced ("we sourced 200!" — sourcing isn't winning)
- Creators "interested" but not deployed (interest doesn't pay)
- Series 3 blog views as primary (useful diagnostic, not a target)
- GitHub stars / Tokenrip CLI installs without published imprints
- Press mentions as primary
- Total registered operators ignoring engagement (always pair with return rate)
- "Conversations had" vs. "demos done"

---

## Monday Review (~20 min total)

Each Monday, async write-up + brief discussion:

1. Revenue / burn / runway (Tom's three at the top — even when $0).
2. North Star progress: imprints live, total operators, growth rate.
3. Current-phase primary KPI: pipeline / deploy+operators / growth+conversion.
4. Secondary KPI drift to diagnose.
5. Channel attribution for any new pipeline movement.
6. **One** thing to change next week (not five — per Divya).

Logged in shared review thread for week-over-week comparison.

---

## Decision Points

Pulled from [[audience-led-gameplan]]; metrics gating each from this doc.

| Week | Question | ✅ Continue | ⚠️ Diagnose | 🛑 Reset |
|---|---|---|---|---|
| 4 (May 28) | Pipeline producing? | List built, ≥2 calls booked, first deploy in progress | List built, no calls | Outreach sent, no responses |
| 8 (Jun 25) | Deploys producing? | ≥3 deploys live, substrate metrics compounding, hero conversation advancing | Deploys happening, no operator engagement | No deploys live |
| 12 (Jul 23) | Growth + revenue producing? | 10+ deploys, operator curve growing, hero close visible, first MRR | Deploys live, flat curve | No compounding (consider Motion B as runway-bridge per [[operations-and-hiring]] §4) |

---

## Discipline (Three Rules That Matter Most)

1. **Don't change definitions when numbers look bad.** Tighten or fix the bottleneck.
2. **Don't hide zeros.** Log every week. Honesty produces course corrections.
3. **One change per week.** Per Divya — don't try to fix five things; you won't know what worked.

Full discipline list and the "why" behind each: [[../__RESOURCES/yc-startup-metrics-frameworks]].

---

## Cross-References

- **Motion these KPIs measure:** [[audience-led-gameplan]]
- **Strategic context:** [[motions-and-strategy]]
- **Capital + runway:** [[operations-and-hiring]]
- **Fundraising-facing summary:** [[yc-strategy]] §"Target metrics to Demo Day"
- **General KPI principles + Tom + Divya material:** [[../__RESOURCES/yc-startup-metrics-frameworks]]
- **Deprecated KPIs:** [[firm-direct-strategy/kpis]]

---

*v0.1 — 2026-05-01. Next review: Mon May 25 (week 4 decision point).*
