---
title: Quintel — Stauss Product Notes
type: product-notes (living log of Stauss Paulos / VFI product input)
status: active
owner: Simon
started: 2026-07-14
primary_source: [[bd/calls/transcripts/stauss-paulos-2026-07-14]]
related:
  - [[bd/calls/contacts/stauss-paulos]]
  - [[product/quintel/quintel-customer-data-first-prd-2026-06-29]]
  - [[product/quintel/quintel-data-strategy-signal-portfolio-2026-07-13]]
  - [[product/quintel/quintel-ux-framework-2026-07-01]]
---

# Quintel — Stauss Product Notes

**Who Stauss is: team member.** He's a domain partner helping us *build* the product; he is not someone we are selling to or pitching. He brings 20+ years of equipment-finance depth (EVP-level origination at VFI, a ~200-person independent equipment-finance lessor), is the first user of the live V1, and is co-designing the product, the packaging, and the go-to-market. **When Quintel is ready, Stauss sells it into VFI** (his employer) — VFI is the customer; Stauss is the internal champion who carries it in — and into his broader lender network. So the pricing, positioning, and money-back terms below are **the sell-side model Stauss is helping us build for lenders**, not terms we are negotiating with him.

**What this is.** A running log of Stauss's **product-specific** input — pricing, packaging, features, roadmap, positioning, and "what the product does" — kept in one place so his build signal doesn't get lost. Relationship/working-arrangement context lives in his [[bd/calls/contacts/stauss-paulos|contact doc]].

**Provenance.** First entry sourced entirely from the **2026-07-14 call** — the first working session against the customized live V1, where Simon walked the sourcing UI and handed Stauss his login. Full cleaned transcript: [[bd/calls/transcripts/stauss-paulos-2026-07-14]]. Session note: [[bd/calls/notes/stauss-paulos-2026-07-14]]. Prior product spec lives in the contact doc's "Running Intelligence" and in the PRD / data-strategy docs linked above.

> **Own the synthesis.** Stauss steers product enthusiastically and has explored many directions across sessions. His input is high-value *build material* — Simon/Alek still own the final synthesis so the product stays coherent rather than becoming a transcription of the latest idea.

---

## 1. Pricing & Packaging

*The pricing model Stauss is helping us design — the terms he (and the team) will use to sell Quintel into VFI and other lenders. "Rejected / endorsed" below = Stauss stress-testing each model against how a real lender buyer (himself included, as VFI's buyer-side voice) would react.*

### Rejected: sector-based tiering
- Alek floated **$1,500/mo per sector of intelligence** (pay $3K for three sectors, etc.). Stauss **rejected it for diversified lenders**: "we're sector- and asset-class agnostic… puts too many limitations on me wanting to buy the product… I'd rather pay three grand a month to go after everything than $1,500 for one sector and another $1,500 for three more."
- **Only survives as a discount hook** for single-vertical lenders (rolling-stock-only, healthcare-only, construction/"yellow iron"-only): "typically we charge $3K/mo, but we'll do just rolling stock for you for $1,500" — feels like a discount, then you open it up.

### Endorsed anchors: per-seat + replace-an-FTE
- **Price against a salesperson, not against sectors or lead-count.** VFI's new-originator base salary is **$70K/yr** ("our professional-level base salary"). Pitch: "Don't hire an FTE — this is your next guy." Position the agent as **"a BDA, but faster/better/cheaper"** (see §2 on the BDA model).
- **Per-seat / dedicated-agent-per-top-performer.** How Stauss allocated ZoomInfo — licenses only to proven reps, never trainees. "We're customizing it to you — what's the size of your salesforce? How many top performers doing consistent business? I've got 10 to 15." Tier by seats of top performers. He "doesn't love seats but doesn't hate it."
- **ROI math he uses:** one funded deal pays for it "tenfold." A $3–5M average deal earns VFI $300–700K; two deals in six months = no-brainer.

### "Quality not quantity" — the pricing spine (resolves the volume objection)
- Alek's blocker: "these are real-time signals, we can't guarantee lead *volume*." Stauss reframed volume-uncertainty as a **feature**: "You're not guaranteeing quantity, you're guaranteeing quality… I'll give you 10 approvable leads you convert 70–80%, not 100 you convert 10–15%."
- Therefore: **sell fit, not count.** "You're selling quality, not quantity, and you're selling a team member, not enhanced technology."

### Money-back guarantee: yes — but not 30 days
- Simon floated: pay up front + **30-day money-back guarantee** (no free trial). Stauss liked the *mechanism* but said **30 days is too short**.
- **His structure:** **six-month money-back guarantee, less setup + hosting costs** ("that way you're not losing money — you can't lose money"). For small-ticket shops ($50K–$1M deals), a 30/60/90-day window may work; for mid-market and up (VFI-scale), 3 months minimum, 6 months ideal.
- **Why:** deal-cycle length — he needs to see a lead go all the way to *funded* to judge ROI. "30 days won't prove out any funnel metrics." He'd rather risk ~$1,000 over 6 months with a guarantee than take 30 days 100% free.

### Stauss's selling instincts (how he'll pitch it)
- Stauss is drawn to **egregious revenue-share / success-fee anchors** as a confidence play he'd use on select prospects: "I'll turn it on for a free year, but I want 30–35% of any revenue derived." Cites a technique — "I want 50% of any revenue of the leads you drive; it's net new revenue, so it's a win for you." He'd "try it on a few people."
- **Reconcile with the software model.** These are brokerage-flavored terms (consistent with his SaaS-aversion — Deal Flow Exchange scars, contact doc §"Added 2026-05-29"). Useful as a *closing tactic* on the right lender, but the base model should stay software (per-seat + money-back). On this call he engaged constructively on *monthly* pricing rather than steering to success-fee — the two can coexist (SaaS base + optional performance kicker).

---

## 2. What the Product Is / Positioning

- **"A team member, not a SaaS product."** Recurring, load-bearing frame: "This isn't just another AI-enhanced workflow SaaS. This is a team member, an agent, someone who's going to really source your business." Sell an **originating agent** benchmarked to a rep, not a tool.
- **"Redefine, not enhance"** (2nd straight call). "We buy ZoomInfo, D&B, LinkedIn Sales Navigator to *enhance* our reps. This isn't the inverse, it's *redefining* how you work." Aligns with Simon's "AI-in-Google-Docs vs. Google-Docs-in-AI." Use his language.
- **Replaces the bird-dog / BDA layer.** VFI's origination structure: BDOs make 120–150 cold calls/day → 10–15 connects; senior BDOs 70–90 calls → 6–7 connects but higher conversion. Stauss built a **BDA (Business Development Associate)** role — entry-level grads at $20–30/hr (~$50K + bonus), "phone jockeys / bird dogs" who find **"project identified"** (a confirmed capex need, e.g. "$2M for forklifts") and route it up. **Quintel = the BDA layer, automated** — eliminating 50–70% of top reps' cold-calling so they work the middle-funnel "meat" (qualify, get financials, set the proposal call).
- **"Sets my day up for me."** The daily-use vision: the agent surfaces "these 20 companies have strong capex," "these 5 have an immediate need and uploaded a financial package," "these 25 anticipate increased capex over the next 30–90 days," "these are 6–12 months out." Builds a **pipeline of qualified leas** instead of calling in the dark. (His follow-up heuristic for context: "whatever they tell you for follow-up, cut in half.")
- **Differentiation vs. upload-dependent marketplaces (he argued it himself).** The competitor AI platform he's seen is "just another SaaS lead gen" — only surfaces a deal if a CFO/finance team *uploads* one (marketplace-lender model; it does AI-qualify the ICP to ~3–5 matched lenders and has a 30-day first-to-deal lockup). **Quintel's edge:** real-time market signals with **no borrower action required** — "even if no one uploads a deal, there's a tremendous amount of real-time data to work like a prospecting/research agent." "The ball's in your court" → deal rate on tailored/researched outreach "can't be lower, it's going to be higher."

---

## 3. Features — Live in V1 (as walked on the call)

The V1 is slimmed down and **focused on sourcing**. Current surface:
- **Prospect list** — company + a **signal score** (algorithm-scored) + **signal type** (renewal, federal contract award, etc.) + **ticket size** (when a hard number is found) + **sector** + **location** + **timing**.
- **Company view** — more detail on the company, link to the website, and the **evidence trail** (e.g. three USASpending entries on a given date — $41M, $10M — with the ability to pull the underlying USASpending data). Stauss: "that provides a qualified source resource of where you got the info."
- **Save list → enrichment flow** — you **add a prospect to your saved list**, and enrichment (contact data, etc.) runs **only once it's saved**. Stauss: "I like that a lot."

---

## 4. Features — Requested / Roadmap (Stauss's asks this call)

Stauss himself drew the **core-vs-upsell line**: sourcing intelligence = core product; the data enrichments below = **paid add-ons to rank by value later**. "Give me the full scope, I'll find what's most valuable, we rank it."

| # | Feature | Detail (Stauss's framing) | Notes |
|---|---------|---------------------------|-------|
| 1 | **Score reasoning / evidence detail** | Show *why* a prospect scores 96 — expand the evidence trail + scoring logic | Simon committed to add |
| 2 | **Private-company revenue estimation** (on enrichment) | Public → auto-search **EDGAR**. Private ("the golden goose") → employee-count→revenue ratio (his rule: ~200 employees ≈ **$20–25M** rev) + other sources; **even a broad range** ($20–50M, $50–100M) is valuable. D&B does this but "hit or miss / inconsistent." | He's found private revenue "in weird ways" before; will think about sources |
| 3 | **Ticket-size estimation** | When no hard number, estimate from **UCC history** + other signals/"tricks" | Simon already planned this for 2026-07-15 |
| 4 | **Equipment inference** | From an award/permit/facility type, infer the **likely equipment purchases + ranges** (warehouse distributor building a facility → racking, HVAC, forklifts, dock buildout, fencing, parking-lot refurb). Gives reps **targeted conversation-openers** vs. "what's going on?" | "Even a step further" — deferred, not urgent |
| 4a | **Per-lender equipment customization** | Build the equipment list **customizable to what each lender actually funds** — VFI = hard + soft cost (heavy equipment, racking, HVAC, tech, projects); an asset-backed lender = hard asset only. **Design this up front** to avoid a later rebuild. | Architectural note — flagged for the "front end" |
| 5 | **UCC competitor / lender surfacing** | Show **who financed them last / the lead bank** — that's the rep's direct competition. A prior deal with a known competitor (**Wingspire, Avtech Capital**) = a qualified re-fi opportunity ("their last deal was with someone I compete with → good deal for me"). **Leave blank if not confidently accurate** (some do vague/hidden UCC filings). | Simon: "we actually store that — I'll start surfacing it" |

---

## 5. Upsell / Expansion Ideas

- **Per-rep personalized views + specialty-based lead routing** (Alek surfaced, Stauss endorsed enthusiastically). Each top rep gets their own view that "sets their day up," with leads routed by specialty. Land-and-expand: top performers → wider salesforce. "10 BDAs bird-dogging." Economics: "instead of paying ~$1M/yr loaded for BDAs/BDOs, a fraction — maybe I pay $500K but do 2.5–3× the production."
- **Paid data add-ons** (his ranking, §4): revenue estimation, UCC-competitor info, real-time total-equipment-project data — "strong add-ons we charge for later," on top of a core sourcing product at the base price point.
- **"On steroids" tier:** multiple sector-dedicated agents (3–5) driving enough volume that top reps only review/qualify/close.

---

## 6. Domain / ROI Facts Useful for Product & Sales

- **Capital-utilization is NOT the ROI story (hypothesis tested & falsified).** Simon asked whether an under-utilized credit line = money lost daily. **No** — lenders are only charged once they **draw down and fund**; an idle facility isn't a running cost. (VFI runs ~$400–600M in lines across a major bank ~$400M + newer lines. Stauss uses "we already drew down" only as a *manufactured urgency* tactic on stalling borrowers.) → **Do not build the ROI pitch on capital drag.**
- **The real executive pain = wasted base salary on non-producing reps.** "70 sales guys at $70K… what'd you do the past three months, zero production — that's where I'm concerned." This is the buy trigger and the number to price against.
- **VFI production stats (proof material — reuse carefully):** ~85% (some years 87%) approval rate on proposals submitted to underwriting. Last year: **$3.2B** proposed → **$1.175B** executed → **$617M** approved/funded. "Deals are dying at issuing that proposal." The drop-off is at proposal-signing / origination strength — exactly where pre-qualified sourcing helps.
- **EF macro (his read):** H1-2026 capex growth concentrated in hyperscalers (Amazon/Meta facilities); core middle market ("two-thirds of the economy in the space") was wait-and-see, now "picking up." Supports the post-Labor-Day launch window.

---

## 7. Timeline / GTM (from this call)

- **Product-ready target: this month / August.** Alek: "it'll be ready probably this month, August." Simon corroborated.
- **Launch window: right after Labor Day** (early Sept 2026). Stauss: "if we perfect it by end of August and do this right after Labor Day, it'd be huge." (He initially hedged "early-to-mid Q4, for sure by start of year"; Alek pulled it earlier to 1–3 months.)
- **Feedback loop:** Simon notifies Stauss on every big feature update → Stauss re-tests → sends feedback via **WhatsApp/email** as it flows. Stauss: "I'll start using it today."

---

## Changelog
- **2026-07-14** — Doc started. First entry from the V1-login-handoff call ([[bd/calls/transcripts/stauss-paulos-2026-07-14]]).
