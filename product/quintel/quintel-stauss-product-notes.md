---
title: Quintel — Stauss Product Notes (consolidated living log)
type: product-notes (consolidated — supersedes the four dated session logs)
status: active
owner: Simon
started: 2026-07-14
last_updated: 2026-08-20
sources:
  - [[bd/calls/transcripts/stauss-paulos-2026-08-20]]
  - [[bd/calls/transcripts/stauss-paulos-2026-07-14]]
  - [[bd/calls/transcripts/stauss-paulos-2026-07-21]]
  - [[bd/calls/transcripts/stauss-paulos-2026-07-22]]
  - [[bd/calls/transcripts/stauss-paulos-2026-07-28]]
related:
  - [[bd/calls/contacts/stauss-paulos]]
  - [[product/quintel/quintel-sourcing-intelligence-prd-2026-06-29]]
  - [[product/quintel/quintel-ux-framework-2026-07-01]]
  - [[product/quintel/quintel-data-rigor-roadmap-2026-07-21]]
  - [[product/quintel/quintel-pricing-structure-2026-07-23]]
---

# Quintel — Stauss Product Notes

**Consolidated 2026-07-28.** This single file replaces the four dated session logs (`…-2026-07-14`, `-07-21`, `-07-22`, `-07-28`), which are archived at `__ARCHIVE/product/quintel/stauss-product-notes-sessions/`. Every item below carries the call it originated from; the transcripts remain the primary source.

**Who Stauss is: team member.** A domain partner helping us *build* the product — not someone we are selling to. EVP-level origination at VFI (~200-person independent equipment-finance lessor), 20+ years, first and only daily user of the live V1. **When Quintel is ready, Stauss sells it into VFI** (VFI = customer, Stauss = internal champion) and into his lender network. Pricing/packaging below is therefore the **sell-side model he is helping design**, not terms we're negotiating with him. Relationship and working-arrangement context lives in his [[bd/calls/contacts/stauss-paulos|contact doc]].

> **Own the synthesis.** Nothing Stauss has given us across four sessions has been ranked by him. He is an exceptional spec source and a directionally-mobile one — the product he described on 7/28 is roughly 3× the product he described on 7/21. Build §6, not the list. *(Commitment #59 — "make him rank" — is now open 5 straight calls.)*

---

## 0. Source index — which call produced what

| Call | Context | What it contributed |
|---|---|---|
| **[2026-07-14](../../bd/calls/transcripts/stauss-paulos-2026-07-14.md)** | V1 login handoff + pricing workshop | Pricing & packaging model (§7), "team member not SaaS" positioning, the BDA-replacement frame, V1 feature baseline, enrichment/roadmap asks F-series precursors, capital-utilization falsification |
| **[2026-07-21](../../bd/calls/transcripts/stauss-paulos-2026-07-21.md)** | First week of real daily usage | 6 bugs + 12 features against live use; **the box-score-vs-buy-box failure**; rollup data-model gap; first 3 real prospects into VFI's pipeline |
| **[2026-07-22](../../bd/calls/transcripts/stauss-paulos-2026-07-22.md)** | Rebooked full hour | The market-intelligence turn ("agentic Bloomberg"); two-sided relevance filter; connectors; tax/policy layers; the $7–15K/mo price band; remarketing (parked) |
| **[2026-07-28](../../bd/calls/transcripts/stauss-paulos-2026-07-28.md)** | Post-ship feedback + roadmap | **The team/management layer** (home page, manager vs. rep, assignment, activity + ROI stats); **the deal-execution layer** (credit package, IC pricing worksheet, pre-call Q&A, decline-save loop); hot-asset-class directive; reference-selling engine; legacy-vs-new-vertical briefing; DB cross-validation |

---

## 1. Where the spec stands

**Three distinct product layers are now on the table, and only the first is being built.**

| Layer | Origin | State |
|---|---|---|
| **1. Sourcing engine** — scored prospect stream off market signals | The original build | Live, in daily use, ~20 open refinements |
| **2. Market-intelligence layer** — briefings, tax/policy, asset-class trends, news | 7/22 | Specified, unbuilt. Shippable edge = the **briefing card** (§5) |
| **3. Team + deal-execution layer** — manager/rep roles, assignment, activity stats, credit-package and IC generation, decline-save loop | **7/28** | Partly built (claim/disposition PRD 7/30; team/owner pre-load shipped and confirmed 8/20). The layer that turns Quintel from a *tool a rep uses* into a *system a firm buys* |
| **4. Project intelligence ("Derived" tab)** — project record, phase timeline, inferred tier-2/3 suppliers, per-category VFI angle | **8/20** | Specified, unbuilt; inference unproven. See §14. **Arrived before layers 2–3 shipped** |

**The 7/28 shift, plainly:** Stauss stopped describing a better lead list and started describing **the workspace his origination team lives in**. His own framing: *"Quintel becomes this origination and deal-funnel enhancer… we're still using Salesforce, but Quintel is my workspace."*

**Why it matters commercially:** layer 3 is where the *buyer* is. Layers 1–2 are seat-level rep productivity. Layer 3 is sales-management leverage over 80+ reps — headcount justification, lead-squander prevention, rep coaching, ROI attribution. That is a materially larger contract and it points at the buyer above Stauss. *(Same second-buyer-motion note first flagged on 7/22 under the Salesforce connector, now stated by him directly and at length.)*

**Why it's dangerous:** the open spec is now ~45 items across four calls, still unranked, and layer 3 has real CRM-shaped surface area that Alek correctly flagged as *"there should be a difference between this and a CRM."* The scope/ship-date tension has now gone unnamed for three straight calls.

---

## 2. Shipped & validated

| Item | Origin | Status on 7/28 |
|---|---|---|
| **Reviewed / unreviewed state** (W1 — his #1 workflow ask on 7/22) | 7/22 | ✅ **Shipped and confirmed.** *"I did notice, which I really like, this unreviewed… I can save it, dismiss it, or mark it back as unreviewed."* |
| **Save / dismiss / mark-unreviewed disposition** | 7/22 | ✅ Shipped, working as intended |
| **Derived deals** (second-order effects — "Tesla launches a data center, what trickles down") | 7/22 lineage | ✅ Shipped. Alek: *"that's something that's new and updated, which people have really been liking"* — well received across other lender calls too. **Stauss had not yet found it** → see H4 (in-app update feed) |
| **VFI-profile customization of the source mix** | ongoing | ✅ *"Over these past two updates — it's definitely more customizing to the VFI profile."* |
| **Pagination** (B5) | 7/21 | ✅ Closed 7/22 — *"you figure that out and it's fine."* No build needed |
| **Team / owner pre-load on Send** (T2 precursor) | 7/28 | ✅ **Shipped and confirmed 8/20.** *"I added my two guys as my team and I kept on having to retype his email every time… That fixed that."* Two reps are now in the tool |

### The validation that matters most (7/28)

**Quintel's output cross-checks against VFI's 18-year curated database.**

> *"I've been able to cross-check a handful of these accounts, and a lot of them are actually showing up in my database… we have a very curated database that gets maintained as our guys touch them — revenues and whatnot. So a lot of them are pulling in."*

Two readings, both useful:
1. **Precision proof.** An independently-maintained 18-year lender database agrees the companies Quintel surfaces are real, correctly sized, and financeable. This is the first *external* accuracy check the product has ever had, and it is a strong one.
2. **The higher-value case is the whitespace, not the overlap.** *"What's even better… it's in there, but it's sitting in my **general pool** — so it's not active with a BDO regularly touching that account."* Quintel's value on a known account is not discovery, it's **reactivation with a live trigger attached**. This is the Salesforce-connector thesis (C1) confirmed with real data rather than hypothesised.

⚠️ **Unmined:** he did not say *which* accounts, *what proportion* overlapped, or which signal surfaced them. The attribution question (contact-doc Commitment #77) is now unasked for **three straight calls**, and this was the third opening.

---

## 3. Open spec — by surface

Origin call in the **Src** column. IDs preserved from the original session logs where they existed.

### A. Scoring & buy-box fidelity — *the headline problem, still open*

**The box score is not keyed to the buy box.** *"The stuff that's scoring lower seems to be a stronger fit for me personally rather than the stuff that's scoring higher."* (7/21)

| Prospect | Score | Est. revenue | His verdict |
|---|---|---|---|
| Construction co. ($58M award) | **92** | $2.6M | too small — back burner |
| Pullman Construction | high | $5.5M | too small |
| Camera deal ($552K ticket) | high | $7M | too small |
| **HK Contractors** | **58** | $15.2M | **sent to one of his reps** |
| **Stronghold Engineering** | **56** | $41M | **"reaching out to the CFO"** |
| Virginia specialty trade | — | 750 employees, $12M need | **"the deal I'm gonna go after hard"** |

Part artifact (B1 score-inversion bug), but the 92-at-$2.6M case is independent of it: **the score reflects equipment-finance/asset-class fit and calls it buy-box fit.**

| ID | Ask | Src | Notes |
|---|---|---|---|
| **F1** | **Revenue floor as buy-box parameterization** — "below your target minimum" **flag** + secondary tier | 7/21 | His profile: $20M floor (hard min $15M), open-ended at top. Also uses ticket size *relative to* company size as a sanity check. ⚠️ **Ship as flag, not filter** — see §9 |
| **F2** | **Corporate-structure / parent-entity rollup** in the data model | 7/21 | Deepest gap; Simon acknowledged the model doesn't support it. Two live proofs: Stronghold Engineering vs. Stronghold Power Systems (separate SF accounts, unknown parentage); **April Moss, "multi-company controller"** — *contact titles are a rollup detection signal*. Minimum viable: single-entity / part-of-group / unknown + consolidated revenue |
| **F3** | **Near-miss / secondary "watch" tier** | 7/21 | The correct home for F1's rejects. Re-scored on periodic rerun as estimates improve |
| **F5** | **Buy-box templating per lender tier** | 7/21 | *"For a small-ticket equipment lender these are strong… keep all of this easily templated to target smaller lenders."* Build **with** F1 or pay to retrofit |
| **F10** | **Score reasoning / evidence trail** — why does this score 96 | 7/14, 7/21 | Simon committed 7/14; made urgent by B1 |
| **F4** | **Geography filter** — continental US / all USA / USA + territories | 7/21 | Raised twice |

**Open bugs** (7/21 — none re-walked since; he had not seen a new build until 7/28):

| ID | Bug | Src | Sev |
|---|---|---|---|
| **B1** | Score inverts between Prospects and Saved (reads *lower* once saved) | 7/21 | 🔴 Corrupts the primary trust signal |
| **B2** | Sort/filter dead in the Saved view (works in Prospects) | 7/21 | 🔴 Saved is where he actually works |
| **B3** | Cannot sort/filter on Signal or Trigger in Prospects | 7/21 | 🟠 He wants to isolate news-only / UCC-only |
| **B4** | Enrichment fails **silently** (out of credits → blank record, no state) | 7/21 | 🔴 (a) replenish credits, (b) never fail silently — show "enriching" / "unavailable" |
| **B6** | Company data wrong/unverifiable (MacMillan Inc as Arizona heavy-civil; no matching entity) | 7/21 | 🟠 Trust erosion; may be an F2 parent/sub mismatch |

### B. Workflow & UI

| ID      | Ask                                                                          | Src              | Notes                                                                                                                                                                                                                                                                                             |
| ------- | ---------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **H1**  | **Home page / landing dashboard** — do not dump into Prospects on login      | **7/28**         | **His #1 ask this call.** *"When I open this up, I'm kind of lost… where was I at the previous day?… I log on and it's back to prospecting, sorting, and I'm not really taking any action."* Nav: Home · Saved · Prospects · Packaging                                                            |
| **H2**  | Home page content: **"how my day ended"** — team/personal stats, week or MTD | **7/28**         | *"How many Quintel leads did we call versus how many did we connect?"* Explicitly **not** a CRM conversion report — see T4                                                                                                                                                                        |
| **H3**  | Home page content: **top news of the week**                                  | **7/28**         | *"Not necessarily an Instagram feed, but maybe the top news of the week"* — the surfacing home for M2/M7                                                                                                                                                                                          |
| **H4**  | Home page content: **product-update + education feed**                       | **7/28**         | Triggered by him not having found derived deals: *"check out the new derived feature, this is what it means."* **It teaches data interpretation and labeling, not just release notes** — and it's a per-client-brandable surface. Cheap, high adoption value, doubles as the onboarding path (W2) |
| **W2**  | **Onboarding walkthrough video** (30–40s)                                    | 7/22             | Triggered by Priority-vs-Watch ambiguity. Overlaps contact-doc #36 (demo slides/video)                                                                                                                                                                                                            |
| **W4**  | **Public/private flag + link to latest 10-K/10-Q** at save time              | 7/21 (F13), 7/22 | Link out, don't host. **Raised twice**                                                                                                                                                                                                                                                            |
| **F6**  | Search in the Saved view                                                     | 7/21             | Simon proposed, Stauss endorsed                                                                                                                                                                                                                                                                   |
| **F7**  | "Saved at" timestamp + recency filter                                        | 7/21             | Separates the triage batch from the working list                                                                                                                                                                                                                                                  |
| **F8**  | Kill the save→enrich→verify→remove loop                                      | 7/21             | He saves speculatively just to trigger enrichment, then deletes. Root fix: enrich enough on the prospect card that saving is a *decision*, not a probe                                                                                                                                            |
| **F9**  | New / Priority / Watch sectioning                                            | 7/21             | Work new arrivals first. Partially relieved by the shipped reviewed-state                                                                                                                                                                                                                         |
| **F12** | LinkedIn quick-link on the **company** (F47 covers contacts)                 | 7/21             | His manual "is this company real" check; fix path for B6                                                                                                                                                                                                                                          |

### C. Team, roles & management layer — ***new 7/28, and the largest new surface***

> **2026-07-30 — the bones of this section now have an engineering PRD**, written jointly against
> this surface and the Onset deployment: `~/projects/maxi/quintel/docs/superpowers/specs/2026-07-30-claim-and-disposition-substrate-prd.md`.
> The finding that drove it: **T2 (assignment), Onset's cross-customer exclusivity, T3's "manager
> flagged this," and C1's "already in my database" are one row** — a bounded hold on a company by a
> holder, where the holder is an account, a user, or an external CRM owner. Two of this table's items
> are already done and nobody noticed: **T6 tagging exists** (`lead.tags`), and **T1's manager/rep
> axis exists** (`UserRole = ACCOUNT_ADMIN │ MEMBER`). The PRD builds the model in v1 against Onset's
> single user and lights the team UI up in v3 — so VFI is UI work later, not a migration against live
> contractual evidence. **T4 is in only partially** (dispositions and outcomes yes; contact-content
> capture for coaching deliberately out, `touch` reserved), **T5 is modelled not built**, and **T7 and
> T8 are explicitly out of scope** — T7 replaced by a plain send-a-prospect-to-an-email action, T8
> because it is scoring config, not a claim, and deserves its own design.

| ID | Ask | His words | Notes |
|---|---|---|---|
| **T1** | **Manager view vs. rep view** — distinct role-based products | *"I love that there's a manager view and a rep view"* | Simon named it back: *"your role is different from a BDM role."* The rep view = a working queue; the manager view = assignment + oversight + ROI. **This is the seat-model's product justification** (§7) |
| **T2** | **Lead assignment / routing to named reps** | *"I know Jimmy's really good at construction deals, so I want to flag or assign it to him… these four accounts were assigned to Jimmy, these six to John"* | He routes by specialty today: Matt = complex/large + mid-high credit · Troy = complex · Dustin = smaller, riskier credit, high yield. **He is emphatic that he is hands-on** and assumes good managers are. Extends the 7/14 "per-rep personalized views + specialty routing" upsell (#57) from a nice-to-have into the spine of the manager product |
| **T3** | **Rep-side "your manager flagged this"** context on assigned/hot leads | *"They're already saying: this is hot, your manager flagged this to be a top asset class"* | The push channel that replaces his internal emails: *"I didn't have to send an email, I didn't have to do anything"* |
| **T4** | **Lightweight activity/disposition tracking** — called / connected / emailed, and *what was sent* | *"I want to see that something happened with the account. Did they connect? Did they send an email? If so, what?"* | ⚠️ **Explicitly not CRM conversion tracking** — *"not necessarily tracking the conversion, because that's more Salesforce/CRM."* Three jobs: (a) **no lead gets squandered** — *"important to my investment"*; (b) **coaching** — did the rep actually use the market-intelligence data in the email, or send generic slop; (c) feeds T5. **Draw this line deliberately or the product becomes a CRM by accretion** |
| **T5** | **Funnel / ROI attribution panel** — Quintel performance *delineated from* rep performance | *"484 leads, 200 are good for me… I already connected with 20 this week"* vs. *"484 leads, 20 are good, I only connected with 2 — is this even working for me?"* | **This is the renewal-justification surface and it argues both directions on purpose.** His own metric: *"Quintel's providing a 70% conversion of prospects to qualified accounts."* And the counter-read: *"these could all be great leads and your sales guys suck."* A tool that can say "the leads are fine, your reps aren't" is a tool a sales EVP cannot cancel |
| **T6** | **Tagging on saved prospects** (e.g. "qualified for VFI") | *"I can start tagging that… 200 saved out of 484, 200 are great"* | Feeds T5's denominator |
| **T7** | **"Generate summary" quick action** — one-button consolidated prospect summary, copy-pasteable into an email | *"Is there something I can click — download a summary — so I'm not doing screenshots?"* | **He is screenshotting today.** Then finding the company in Salesforce, pasting the account link, and emailing his rep. Cheapest possible relief of a daily manual loop, and it works **before** the Salesforce connector exists. Ship this early |

### D. Hot-asset-class directive — ***new 7/28; architecturally the most interesting ask***

| ID | Ask | Detail |
|---|---|---|
| **T8** | **Manager sets asset-class weighting; it propagates through sourcing, rep priority, and briefings** | Origin: he asks his CFO for current **portfolio distribution** — where is capital available vs. concentrated (*"we're hitting our limits at 25% of the entire portfolio in GPUs"*). CFO says "we're underweight earth-moving / yellow iron." Stauss then wants to click a few buttons and have: (a) sourcing **weight up** that asset class, (b) reps see it flagged hot next morning, (c) the generate-briefing pitch VFI's aggressive pricing on it. **Redistribution, not refocus** — *"maybe I was 25, 25, 25 — now I'm 30 or 35, and it equally distributes amongst the others."* Alek: *"you type in 'I want my team getting medical deals' and reps log on to medical deals surfacing in real time"* |

**Why this is more than a filter.** It makes the sourcing engine *responsive to the lender's live capital position* — the one input no competitor can get from public data because it doesn't exist in public data. It's also the cleanest expression of "custom to you," it creates a manager-only reason to log in daily, and it's the natural pairing for T5 (set the directive, measure whether the team executed on it). **Related but unbuilt:** internal exposure/tranche limits as first-class data (*"I can only do $2M of your $5M because this tranche is almost done"*) — same input, feeds D4 below.

### E. Connectors

| ID | Ask | Src | Notes |
|---|---|---|---|
| **C1** | **Salesforce** — "already in my database" indicator + filter, push/assign accounts | 7/22, **hardened 7/28** | **He called it "critical" on 7/28** — the word is new. Now validated by the DB cross-check (§2). Three jobs: (a) **prioritize** — active signal on a known account = warmest lead he has; (b) **reactivate** — general-pool accounts with no BDO touching them; (c) **manage** — *"he hasn't followed up since three months ago… now I can ping him."* Note he personally uses Salesforce only for dashboards/reporting; his managers use it for reporting + credit submissions |
| **C2** | **ZoomInfo** — contacts + three-source revenue triangulation | 7/22 | *"ZoomInfo says $23M, D&B says $7M, Quintel says $34M… two of three are in my target, now I'm going to **flag** it."* **His own fix to the revenue-floor problem** — see §9. May be partly achievable without a paid connector |
| **C3** | **LinkedIn** — quick-action link only, not a connector | 7/22 | Confirmed link-only is sufficient. Already #47/#73 |
| **C4** | **Email / dialer connection** (Alek-surfaced, Stauss endorsed) | 7/28 | *"More reasons for people to be on the platform… then we get more data and feedback to put back into it."* Feeds T4 activity tracking without manual disposition |

**⚠️ Competitive note (7/22).** He runs **Claude Enterprise for VFI with Salesforce + ZoomInfo connectors live** and self-serves queries against them (*"find all accounts we've sent a formal proposal on but never won — I can just ask Claude now"*). Consequences: (1) CRM connectors are **table stakes** in his mental model, not differentiation; (2) the ad-hoc portfolio-query layer is already partly commoditized for him. On 7/28 he restated the same substitution pattern for research (*"I'm going to bounce to Claude and say, what's the VFI angle"*) — **and noted the generate-briefing has already displaced one of those trips.** That is the clearest displacement evidence we have.

### F. Market-intelligence layer

All of the below share one architecture: **the two-sided relevance filter (company × lender)**, requested on three consecutive calls (7/14 equipment lists, 7/21 buy-box templating, 7/22 explicitly) and implicitly again on 7/28 via the legacy-vs-new-vertical case. **Treat as settled; build as config, not retrofit.**

- **Axis 1 — what does *this company* buy?** *"Granite Construction wouldn't be buying GPU chips… Xerox is buying GPU chips but not autonomous excavators."*
- **Axis 2 — what can *this lender* finance?** *"If I only do rolling stock it would only show the trucks. For VFI it would show the trucks, the racking, the operating system."*

| ID | Surface | Src | Detail |
|---|---|---|---|
| **M1** | **Pre-briefing: infer the equipment stack from an award/permit** | 7/14 (F4), 7/22 | *"They just got a $75M award for a new manufacturing plant — what equipment do they need?"* Warehouse → racking, HVAC, forklifts, vans, WMS, dock buildout. Cold storage → HVAC retrofit + refrigeration. **The anchor surface** — see §5 |
| **M2** | **Real-time company news, filtered to equipment relevance** | 7/22 | *"Meta is now manufacturing chips — I saw it 30 seconds ago in Quintel."* Replaces manual X/LinkedIn monitoring; the "no-reason call" reason-to-call generator |
| **M3** | **Tax-treatment layer — ASC 842** | 7/22 | *"These guys might have a ton of cash or not need financing, but I could say: the reason you'd want to finance is, according to ASC 842…"* **Converts a no-need prospect into a structuring conversation.** Static rule set = cheapest high-credibility angle. He is sending the reference |
| **M4** | **Tax credits & policy change** | 7/22 | ITC credits for energy storage; EV incentives. Lender-side: *"because VFI technically owns the equipment we'd take the ITC credits, which effectively increases the yield"* — **changes his own pricing, not just his pitch** |
| **M5** | **Tariff / reshoring signal** | 7/22 | *"Who's getting hit hard by tariffs and going to reshore manufacturing?"* → new facilities → new equipment. Value highest *"hot off the press"* |
| **M6** | **Asset-class repositioning intelligence** | 7/22, **reinforced 7/28** | The GPU case, twice: now investment-grade/bankable; B200/B300 ~$300–500K domestically vs. ~$1M in China under the export ban → *"view this collateral like they're cranes."* **Primary use is internal selling to his own credit committee**, which is *"older, not as up to date on AI"* — see D3 |
| **M7** | **Asset-class trend indices** | 7/22 | *"Earth-moving up 10% MoM… steel fabrication up 25%."* His thesis: data-center buildout propagating into power gen, water/wastewater, earth-moving, steel fab, copper/fiber; *"compute is becoming its own sector."* Secondary use: LinkedIn content → inbound. **Now also the input to T8** |
| **M8** | **Deal-angle generation** (per-prospect "here's your play") | 7/21 (F14), 7/22, **7/28** | For names too big for a straight ticket (Jabil, $28B rev): soft costs, $50–100M carve-outs, tax lease vs. term loan, unconventional collateral. His illustration: **70,000 plastic container molds** under a Home Depot offtake — nobody treated molds as equipment collateral; VFI underwrote effectively unsecured on credit profile, weight in the IP + contract. *"Having an AI say, here's your play."* **He calls it a nice-to-have; it is the most defensible item on this page** |
| **M10** | **Legacy-vs-new-vertical segmentation in briefings** | **7/28** | **The sharpest version of M8 yet, and it's a real case from that morning.** A $500M-revenue, 18-year industrial/power-gen company backed by Amazon + NextEra: legacy side is unwinnable (*"five percent ten-year terms — they're never going to take our deal"*), but they just opened an **AI-edge vertical with no strong lenders**. The play he executed by hand in Claude: *"separate the legacy business from their new vertical, and where's VFI a strategic fit?"* → a three-page write-up that leads with the new vertical **and** appends the legacy-side soft-cost list the big lenders won't touch (underground piping, lighting, security cameras, infrared bulbs at $10–15K a pop × 3,000/quarter). The bet: he passes on the heavy equipment and self-identifies the soft-cost fit. **Spec: the briefing must reason per business line, not per company, and must know where this lender is strategically strong vs. structurally out.** *"Slow-play the legacy side, this is where you get your foot in the door, and here's where you're opportunistic."* |
| **M11** | **Chatbot / natural-language search over the company universe** | **7/28** | Alek's frame, Stauss endorsed: *"I'm looking to finance these types of companies showing these signals"* → list pulls up. **Alek flagged the cost honestly on the call** — *"a million companies in there, that would be super expensive"* — and correctly deferred it. Keep as direction, not backlog |
| **M9** | **Portfolio analytics off connected CRM data** | 7/22 | Distribution by asset class/industry, default rates, credit profiles of defaults → diversification + risk-pricing guidance. ⚠️ **Consent problem — see §9.** Also partly commoditized by his Claude connectors |

### G. Deal-execution layer — ***new 7/28; the second-largest new surface***

This is the first time Stauss has specified product *past the point of contact*. It is also the layer closest to the "underwriting judgment" moat identified on 7/08 — and closest to VFI-proprietary process, so **read §9 on CoI before building from it.**

| ID | Ask | His words | Notes |
|---|---|---|---|
| **D1** | **AI credit-submission package** — upload the signed proposal → generate the submission formatted exactly how VFI's underwriting team wants it, with a **have/missing checklist** | *"I have to go through the whole wizard of a credit submission package… maybe I upload my proposal here and it does an AI credit submission of exactly how my underwriting team likes to see everything broken down, and it'll show me exactly what I have and what I don't have"* | The gap-checklist is the underrated half — it's what stops the deal bouncing |
| **D2** | **IC pricing worksheet / committee presentation generator** | *"To have my sales guys always use an AI-generated pricing worksheet that they bring in to pricing"* | Today: manual notes + Salesforce notes, assembled by hand. Four components below (D2a–D2d). **He wants it mandated for his reps** — which is a usage-lock-in mechanism, not just a feature |
| **D2a** | ↳ **Financial-irregularity analysis** | One-time gain on sale of equipment — recurring or one-off inflation? · Current portion of LTD that's actually a revolving line renewing annually (*"then it would show they actually cash flow positive versus negative"*) · Shareholder notes → will they subordinate? | *"We're missing things that happen regularly but are one-off — maybe one every five or ten proposals."* This is exactly the "judgment codified" layer |
| **D2b** | ↳ **Fraud / adverse-media scrub on owners + C-suite** | *"You'd be surprised at the shit we find… criminal charges, a whole plethora of legal issues."* The Serbian trucking company (best-looking profile he'd seen, 20–25% YoY growth → CEO circulated a *60 Minutes* segment: European mob money). Onset Financial. Plus **UCC recency checks** as a double-financing indicator | **First surfaced 2026-06-04 and it has now returned unprompted.** Portable to him, not VFI-encumbered |
| **D2c** | ↳ **Pre-conference-call question generator** | *"It can give me a pre-conference-call thing: ask these questions, because this is stuff we can't find online"* — are the shareholders willing to subordinate? What are the sale-leaseback proceeds actually for (working capital? LBO? acquisition? staying alive 3 months?) | The half of underwriting that is *interrogation*, not data. Cheap to build, high perceived expertise |
| **D2d** | ↳ **Post-call file generator** | *"Now I'm generating a post-conference-call file to present to my team, to come in real sharp… make them say, this is why we like the deal"* | Closes the loop from D2c |
| **D3** | **Asset-class term benchmarking over time, with sources** | *"Next year Quintel says people are doing GPUs at 60, 72, 84 months. If you want to be competitive, this is in line with industry standards"* — and he brings it to committee with citations | The live proof: he won a **48-month term on GPUs** (against the 24–36mo tech convention) by finding the China secondary-market article himself — US ~$500K, China ~$1M under the export ban → a real aftermarket → sellable collateral. **$22M deal, ~$2M estimated gross margin, ~20% all-in.** *"That's the difference between a massive year and a terrible year"* |
| **D4** | **Credit-decline feedback loop → deal-save instruction** | *"Credit just decisioned it, they hit upload, it flags: declined due to internal exposure limits — try to sell a $3M starter deal, and look to do a second deal at this time when we should have availability"* | **The proof case is real and quantified:** an $18M and a $10M trucking deal; they approved the $18M and declined the $10M on internal limits. He went back, asked why, learned the limit was $3M, restructured → **$21M funded across both instead of $18M and a dead deal.** Today that recovery depends on a manager personally interrogating the credit committee. Requires ingesting credit decisions + reasons — **the deepest VFI-internal integration on this page** |
| **D5** | **Speed proof auto-captured from real timelines** | *"Now Quintel knows that timeline… here are seven examples of how fast we move on these sizable deals. I have a ton of confidence because it's actually true"* | The $22M deal: term sheet 7/15 → close call 7/17 → signed 7/20 → deposit + remaining items 7/24 → submitted to credit 7/28. **Five business days**, their fastest ever if it clears committee Thursday. Feeds D6 |

### H. Reference-selling engine — ***new 7/28***

| ID | Ask | Notes |
|---|---|---|
| **D6** | **Reference-sell material generated from real closed deals** | Speed proof (D5) + structure + asset class + credit profile, with the *catalysts* attached (*"the client replied with documentation within two hours… clear concise Q&A"*). Turns a closing claim into a cited fact: *"I'm not saying 'oh yeah we've done it before' and sounding wishy-washy"* |
| **D7** | **"Find me every company like this one, but in an adjacent sub-sector"** — one-button lookalike expansion | *"Maybe it's water treatment to cool data centers — still related to data centers. Still the ultimate data/GPU/compute sector, but a sub-sector like hydrogen cooling versus actual GPUs."* Explicitly **not** naive similar-size/similar-credit matching — it's *thesis-adjacent* expansion off a deal he already won. Directly composable with the derived-deals feature already shipped |
| **D8** | **Ingest past creative deal structures → find where the same structure applies again** | Alek's frame, Stauss: *"dude, right on spot."* The molds case, the soft-cost carve-out, the sale-leaseback-after-Amazon-payoff play (*"VFI takes them out for $50M, they fill up $50M in new equipment"*). **This is the imprint/judgment layer in its purest form** and the clearest Tokenrip-substrate story inside Quintel |

---

## 4. The "why they say no" thesis (Alek, 7/28 — worth keeping)

> *"If every company you reach out to could be at the level of intelligence of that three-page Claude write-up, your hit rate goes up exponentially, because it's much more tailored. A lot of people that otherwise would have said no — because you're calling someone up like 'hey, you're looking for financing?' and they're like, well, you don't know shit about me, so no, I'm not."*

Stauss's completion of it is the sellable half: the intelligence doesn't just improve the pitch, it **changes which companies are addressable at all** — upper-echelon credit profiles that would never take a cold call, opened via a soft-cost / tax-structure angle nobody else brings. *"That's consultative advisory sales that the average Joe is never going to be able to do — until now."*

---

## 5. The shippable edge of the vision — the briefing card

Unchanged from 7/22 and **strengthened by 7/28's M10 case.**

**One screen, on a saved prospect:**
- inferred equipment stack (M1), **filtered to what this lender finances** (two-sided filter),
- **segmented by business line** where the company has more than one (M10),
- one or two live angles: tax treatment (M3), asset-class dynamic (M6/M7), recent company news (M2),
- and the play (M8): where this lender is strategically strong on this specific company.

Nearly every item in §3.F is a *source* feeding this one surface. **Build the surface; add sources over time.** M3 (ASC 842) is the cheapest high-credibility seed — a static rule set, not a live feed.

**The test to put to him:** *"If I ship this and nothing else, does it change what you do Monday?"*

---

## 6. Recommended build sequence

**Ship in this order. Do not build §3 as a list.**

| # | Item | Why here |
|---|---|---|
| **0** | **Finish and ship the 7/21 build, then notify him** — B1 score inversion, B4 credits + visible failure states, F1 buy-box parameterization + F3 secondary tier, B2/F6/F7 Saved-view work, F4 geography, F10 score reasoning | **Still the highest-value block on the page and he has not seen most of it.** F1 has now gone unmentioned by him for two straight calls — that is not evidence it stopped mattering, it's evidence he moved on to new ideas |
| **1** | **T7 — "generate summary" quick action** | Kills a daily manual screenshot loop, ships in days, requires no connector, and is the cheapest possible proof we listen |
| **2** | **H1 + H4 — home page with an update/education feed** | His #1 ask this call, and H4 alone fixes the "he never found derived deals" problem for every future customer. Start thin: last session, what's new, what changed |
| **3** | **The briefing card (M1 + M8 + M10 minimum, seeded with M3)** | The shippable edge of the whole market-intelligence vision — demonstrates it in three weeks instead of describing it for six months |
| **4** | **W4 — public/private flag + EDGAR link** | Small, third raise |
| **5** | **C1 — Salesforce indicator + push** | Largest single lift here, now called "critical," and carries the second buyer motion (sales management, not seat productivity) |
| **6** | **T2 + T3 — assignment and rep-side flagging** | The minimum viable manager product. **Do not build T4/T5 until T2 is in real use** — activity tracking with nothing to track is a CRM with no data |
| **7** | **M2/M5/M6/M7 — live feeds** | As *sources into the briefing card*, not as separate screens |
| **8** | **T5 — ROI attribution panel** | Needs T4 data and a real usage history. But **scope it now**, because it is the renewal argument |
| **9** | **T8 — hot-asset-class weighting** | Architecturally interesting, manager-only, and it needs the sourcing weights to be configurable first |
| **10** | **D-series (deal execution)** | Genuinely valuable and genuinely far. **D2c (pre-call questions) is the cheap entry point** — pure judgment, no integration. D1/D4 need VFI-internal integration; resolve §9 CoI first |

**Not on the list:** M11 (chatbot over the full universe — Alek deferred it on cost, correctly), T4 as a standalone build, M9 until consent is settled, and everything in §10.

**8/20 amendment — the trade to put to him on 8/21:** the Derived tab (layer 4) vs. the per-lead disposition form (T4-lite, which his reps' spreadsheet already proves demand for) vs. manager drill-down + outreach generation (8/17). Not all three before Labor Day. Ship the disposition form regardless — it is days of work and it captures the attribution data the product has lacked for five calls.

**Before building any of it:** make him rank. *"Which one fix makes you pull more prospects into your pipeline next Monday?"* Open **five straight calls**.

---

## 7. Pricing & packaging

*The sell-side model Stauss is helping design. See also [[product/quintel/quintel-pricing-structure-2026-07-23]].*

### Dead: sector-based tiering (7/14)
Alek floated **$1,500/mo per sector**. Stauss rejected it for diversified lenders: *"we're sector- and asset-class agnostic… puts too many limitations on wanting to buy the product. I'd rather pay three grand a month to go after everything."* **Survives only as a discount hook** for single-vertical lenders: *"typically $3K/mo, but we'll do just rolling stock for $1,500."*

### Live: seats, with a team/individual split (7/14 → **structured 7/28**)
- **Price against a salesperson, not sectors or lead count.** VFI's new-originator base is **$70K/yr**. Pitch: *"Don't hire an FTE — this is your next guy."* Position as **"a BDA, but faster/better/cheaper."**
- **Per-seat, allocated to proven reps** — how he allocated ZoomInfo (licenses to top performers, never trainees). *"What's the size of your salesforce? How many top performers? I've got 10 to 15."*
- **7/28 — he defined the packaging split himself:** *"That's the selling point: are you doing a team profile or an individual profile? One or two or three seats, and then a team, which maybe is five-plus. We can look at the economics later."*
  - **Individual (1–3 seats)** = the rep working deals end to end. He notes this includes reps buying it *for themselves*: *"whether VFI knows or cares about it or not, because it's a way for me to be more efficient"* — the B2P motion from 6/01, still alive.
  - **Team (5+)** = manager view, assignment, activity, ROI panel. **§3.C is what justifies the team tier.** The features and the pricing model were specified in the same breath, which is the first time that's happened.
- **ROI math he uses:** one funded deal pays for it tenfold — a $3–5M deal earns VFI $300–700K.
- **Land-and-expand:** *"instead of paying ~$1M/yr loaded for BDAs/BDOs, a fraction — maybe I pay $500K but do 2.5–3× the production."*

### "Quality not quantity" — the spine (7/14)
Alek's blocker was *"we can't guarantee lead volume."* Stauss reframed it as a feature: *"You're not guaranteeing quantity, you're guaranteeing quality. Ten approvable leads you convert 70–80%, not 100 you convert 10–15%."* **Sell fit, not count.**

### The band he named, unprompted (7/22)
> *"Here's core product, here's layer two, that's an upcharge, layer three, that's an upcharge. Next thing you know you're getting **7, 10, 15K a month** from clients."*

And on remarketing specifically: *"whatever, **$10,500** a month, and you say, for **$4,100** more you can add the equipment asset intelligence layer."*

Compare 36th Street's live quote ($10K setup + $5K/mo, 6/24) and his own 7/14 reference ($3K/mo). **First five-figure monthly in nine calls, from the lender side, with no defensiveness because he isn't the one being sold to. It was not picked up.** *(Contact-doc #58/#79.)*

### Money-back guarantee: yes — but not 30 days (7/14)
**Six months, less setup + hosting costs** for mid-market and up (*"that way you can't lose money"*). 30/60/90-day only for small-ticket shops. Rationale: deal-cycle length — he must see a lead reach **funded** to judge ROI, and *"30 days won't prove out any funnel metrics."* He'd rather risk ~$1,000 over six months with a guarantee than take 30 days free.

### His own closing instincts (flag)
Drawn to success-fee anchors as a confidence play: *"I'll turn it on for a free year, but I want 30–35% of any revenue derived."* **Brokerage-flavored**, consistent with his SaaS-aversion (Deal Flow Exchange scars). Useful as a *closing tactic* on select prospects; the base model stays software.

---

## 8. Positioning, sales collateral & channel

### The frames that hold
- **"A team member, not a SaaS product."** (7/14, recurring) Sell an originating agent benchmarked to a rep, not a tool.
- **"Redefine, not enhance."** (7/08, 7/14) *"We buy ZoomInfo, D&B, Sales Navigator to enhance our reps. This isn't the inverse, it's redefining how you work."* Aligns with Simon's "AI-in-Google-Docs vs. Google-Docs-in-AI."
- **"Sets my day up for me."** (7/14) → **now upgraded on 7/28 to "Quintel is my workspace"** — *"I'm basically using Salesforce to satisfy my team."* Note the direction of travel: from a list he checks, to the place he works.
- **The Bloomberg frame lands.** Alek: *"a finance guy can't go a day without seeing that stuff — they're glued to it."* Stauss, immediately: *"I can't miss out. I could refresh right now and there was an announcement and it's the perfect deal for me. I can't risk missing out on that."* **Both sides now use it independently.** (Simon's "agentic Bloomberg for equipment finance," 7/22.)

### His demo-close script (7/22 — verbatim, reusable nearly as-is)

> *"Here's why you want to sign up with Quintel, here's why we don't offer any discounts or free trials. I'm not just showing you HK Contractors, that's a good score, that has a potential deal, and then you're still doing your typical outreach. I'm building something that's going to continue to learn, and work for you.*
>
> *Waste management is understanding that water is becoming a commodity in cooling data centers, and they're building systems specifically for recycling and cooling water for those data centers. Did you know that? No, you didn't. That's because it's two minutes old — or because we're so granular in our market intelligence that we're tailoring it specifically for you.*
>
> *Oh, you only finance rolling stock? These guys also have a need for racking and forklifts — notice how that didn't pop up. Because Quintel is custom to you. You're only going to see what's relevant to you, not only in size and fit, but in news and asset class and financing needs and tax treatment needs."*

### Competitive read (7/14, unchanged 7/22)
The rival EF platform is *"an AI-infused SaaS platform where I'm still reliant on the CFO posting certain things. I'm not really getting any true market research — I'm just seeing deals posted in active deal flow."* **Upload-dependent.** Quintel's edge, which he argued himself: real-time market signals with **no borrower action required** — *"the ball's in your court."* And: *"it's not that much better, now that you see what something can really do."*

**Market size he uses:** ~$1.4T equipment finance by end of 2026.

### Channel (7/28 — new, and he drew the CoI line himself)
- **He wants a Quintel email address and an advisor/consultant title.** *"That way I can be on and say 'I'm with Quintel as an advisor/consultant,' or whatever we want to define my role as."* Alek: *"we can do an email."* **This is contact-doc #60 surfacing from his side for the first time in ten calls.**
- **He named his own conflict boundary, unprompted:** *"It's a really passive referral sell… **I just can't do it on competition.**"* Segments he can front: brokers and out-of-box lenders (Leaf-tier small-ticket, Onset-tier). Segments he can't: VFI's competitive set (Capitus, Ameris in part).
- **Naming intel:** *"I don't think we should call it 'broker' — I think we should have the **advisor/consultant portal**."*
- **The broker segment is two-sided:** *"not only source deal flow, but source lenders too."*
- **He offered pre-call notes for Alek's pipeline** — a per-company write-up on where Quintel benefits that specific prospect, plus pain points, delivered via WhatsApp.

### New market map from Alek's LinkedIn pipeline (7/28)
10–15 conversations to date. Named this call, with Stauss's read:

| Firm | Stauss's read |
|---|---|
| **Leaf** | Small-ticket. *"Leaf would be eating up a lot of the deals you have on here that are too small for me."* → **the natural home for the sub-$20M prospects the VFI buy box rejects** (F5 templating, live) |
| **Capitus** | Core / upper middle market, *"like us."* Competes with VFI on some deals |
| **Ameris Bank** (formerly **Balboa**, acquired) | Balboa was Leaf-like ($100K–$2M deals, $2–4M revenue companies). Post-acquisition he places Ameris **between Leaf and VFI — ~$500K to $5–10M**. Competes with VFI on some, not others |

---

## 9. Contradictions & decisions to resolve before building

**1. Revenue floor — near-resolved in favour of *flag*.** (7/21 → 7/22)
On 7/21 he asked for a hard floor while saying private revenue data is off by 3–4× (*"data says $8–12M and their financials say $35, $45, $70M"*) — the exact failure mode he hired us to fix, and one that fails **silently** (filtered deals never appear). On 7/22 he proposed his own fix: three-source triangulation, *"two out of three are in my target, now I'm going to **flag** it."* **Read: he wants confidence in the number, not a cutoff.** Confirm by reading it back, not by asking the adversarial version.

**2. Portfolio analytics consent (M9) — unresolved and getting older.** (7/22)
He described collecting client portfolio data for upsell targeting *"without them knowing — I mean, not that it's shady or anything,"* and caught himself mid-sentence. On **7/08 the same person warned** private-score data must be per-client siloed because *"every smart client's agreement says don't share our data or we sue."* **Build disclosed and client-visible, or not at all.** Name the contradiction back to him — his answer is real intel on industry norms.

**3. The CRM boundary (T4/T5) — ✅ RESOLVED 2026-07-30.** (raised 7/28)
Both sides named it and neither drew it. Stauss: *"I don't want it to come off too much like a CRM."* Alek: *"there should be a difference between this and a CRM — but end goal, people are working out of Quintel, it's not getting delegated out to a CRM."* Those are two different products.

**The ratified line** (PRD §7): *Quintel records evidence of work on a Quintel-surfaced lead. The CRM owns the opportunity record, pipeline stages, forecast, and the relationship of record.* **The test:** if the fact would exist even had Quintel never surfaced the company, it belongs in the CRM. It is decidable at the row level and structurally enforced — the activity log can only carry events about companies we surfaced or the account saved. It also fixes C1's shape: Quintel reads ownership in and writes claims out, never replicating the CRM.

**4. CoI on the deal-execution layer (D1, D2a, D4) — escalated by 7/28.**
D1 (credit-submission format), D2a (VFI's specific irregularity checks) and D4 (ingesting VFI credit decisions and exposure limits) are **VFI-internal process**, not Stauss's portable judgment. He stated in June that *"you couldn't find VFI's underwriting process online."* The fraud layer (D2b), the pre-call questions (D2c) and the asset-class benchmarking (D3) are portable and clean. **Build the portable half first; get the encumbered half papered before it goes near the codebase.** *(Contact-doc §7.4, Commitment #29.)*

**5. Scope vs. ship date — three calls unnamed.**
Open spec is ~45 items. He is adding faster than we are shipping, he has not seen most of the 7/21 build, and his #1 item from 7/21 (F1) has gone unmentioned by him twice. **The reconciling move exists (§5, §6) and needs to be put to him as a decision, not absorbed as more input.**

---

## 10. Parked — real, priced, deliberately not building

| Item | Src | Why parked |
|---|---|---|
| **Equipment remarketing intelligence** — *price retained: ~$10.5K/mo base + ~$4.1K/mo add-on (his number)* | 7/22 | Pain is real and quantified: 200 recovered Sprinter vans ($50K original / $34K manufacturer buyback / 90-day hold); ~200 exotic cars from a failed CA dealer ($180–500K units); repo cost *"$1,500 a car, times 200"* against broker fees of 5–10% on deals already *"down $500K as it sits."* **But:** (1) **frequency** — two events in 18 months; poor SaaS shape; (2) **wrong buyer** — *"my sales team doesn't manage that, we have a workout department"* — our champion cannot champion it; (3) **brokerage gravity** — his next thought was *"becoming our own equipment broker and taking fees."* **Keep the price for the tiering story, drop the build.** |
| **Trade-show data partnerships** (ELFA / AACFB / debanked / Con Expo) | 7/08, 7/22 | He flagged it as long-term himself |
| **Equipment-brokerage spin-off** | 7/22 | Brokerage economics, not software |
| **Full natural-language search over the company universe (M11)** | 7/28 | Alek deferred on cost during the call — *"a million companies in there, super expensive."* Direction, not backlog |

---

## 11. Data sources

**Confirmed core:** Dun & Bradstreet · ZoomInfo · LinkedIn · SEC EDGAR · **USAspending** — *"I never even knew about that website… that was a really strong one that came of this."* (We introduced it. Credibility deposit worth noting.)

**New named (7/22):**
- **Ritchie Bros** — major equipment auction house / buy-sell broker with its own financing arm. Equipment supply, pricing, demand trends.
- **The Cloud Store IO** — marketplace for used equipment from certified-pre-owned dealers. Previously a *target*, now proposed as a *source*.
- **NED (National Equipment Dealers)** — same, dual-purpose.

**The "level two/three" argument (7/22):** he found three capex-signal articles **scrolling the Kraken news feed**. *"I'm not saying go search Robinhood and Coinbase. I'm saying keep that open mind — there are places where you wouldn't even think you'd find relevant information."*

**Outstanding from him:** the full source list exported from his Claude research history (committed 7/22, not yet delivered); the ASC 842 reference (committed 7/22, not yet delivered).

---

## 12. Domain & ROI facts useful for product and sales

- **Capital-utilization is NOT the ROI story — hypothesis tested and falsified (7/14).** Lenders are charged only once they **draw down and fund**; an idle facility isn't a running cost. (VFI runs ~$400–600M in lines: ~$400M at a major bank plus newer lines. He uses *"we already drew down"* purely as manufactured urgency on stalling borrowers.) **Do not build the ROI pitch on capital drag.**
- **The real executive pain = wasted base salary on non-producing reps (7/14).** *"70 sales guys at $70K… what'd you do the past three months, zero production — that's where I'm concerned."* This is the buy trigger and the number to price against. **7/28 reinforces it:** T5's whole purpose is proving whether the leads or the reps are the problem.
- **VFI production stats (proof material — reuse carefully).** ~85% (some years 87%) approval rate on proposals submitted to underwriting. Last year: **$3.2B** proposed → **$1.175B** executed → **$617M** approved/funded. *"Deals are dying at issuing that proposal."*
- **VFI origination structure.** BDOs make 120–150 cold calls/day → 10–15 connects; senior BDOs 70–90 calls → 6–7 connects, higher conversion. His **BDA** role: entry-level grads at $20–30/hr (~$50K + bonus), "phone jockeys / bird dogs" who find **"project identified"** (a confirmed capex need) and route it up. **Quintel = the BDA layer, automated** — eliminating 50–70% of top reps' cold-calling so they work the middle-funnel meat.
- **Deal velocity is a live differentiator (7/28).** The $22M GPU deal: term sheet 7/15 → close call 7/17 → signed 7/20 → deposit + docs 7/24 → credit submission 7/28. **Five business days**, their fastest ever. ~$2M estimated gross margin, ~20% all-in yield *"because not a lot of people are financing these assets."*
- **Internal exposure limits routinely kill approvable deals (7/28).** The $18M/$10M trucking pair: the second was declined on internal limits, not credit; a manual intervention recovered it as a $3M starter → **$21M total instead of $18M.** This is the D4 business case and it is not hypothetical.
- **GPUs as an asset class (7/22, 7/28).** Becoming investment-grade / bankable; B200/B300 ~$300–500K domestically vs. ~$1M in China under the export ban → a real aftermarket → collateral to be *"viewed like cranes."* Precedent he cites: used cranes appreciating above new during COVID. His committee is *"older, not as up to date on AI"* — the repositioning argument is aimed **inward**.
- **EF macro (his read, 7/14).** H1-2026 capex growth concentrated in hyperscalers; the core middle market — *"two-thirds of the economy in the space"* — was wait-and-see, now picking up. Supports the post-Labor-Day launch window.

---

## 13. Timeline / GTM

- **Product-ready target:** August 2026. **Launch window:** right after Labor Day (early Sept).
- **Feedback loop:** notify Stauss on every big feature update → he re-tests → feedback via WhatsApp/email. **He asked for daily contact on 7/28:** *"we could talk daily at this point, in all reality."*
- **Cadence that works (his words, twice):** he screen-shares and walks his real workflow. Keep it.
- **Outstanding from him (7/28):** a written **agenda** covering the short-term additions plus long-term roadmap, *"so we can all sign off."*

---

## 14. 2026-08-20 — project intelligence: the fourth layer, and the deal-angle moat stated in full

*Source: [2026-08-20 transcript](../../bd/calls/transcripts/stauss-paulos-2026-08-20.md) · [note](../../bd/calls/notes/stauss-paulos-2026-08-20.md). Added without reworking §1–§13; the 8/17 call is also not yet folded in.*

**A fourth layer arrived before the second and third shipped.** Stauss asked for a **"Derived" tab** in the nav (Home · Prospects · Saved · **Derived**) holding project-side intelligence: the project record, its phase timeline, the inferred supplier/vendor categories, and the VFI angle per category.

**The reframe underneath it is genuinely load-bearing.** A mega-project sponsor is never a VFI client — it self-funds or issues bonds — but the project is a **container of five to ten qualified tier-2/tier-3 supplier deals, phased across 12–24 months**. His proof is a closed deal: a $15M copper-mining transaction carried 6–7 vendors and thousands of invoices. At $500M–$10B project scale that becomes *"hundreds of thousands of vendors."* Today we discard the oversized company; he wants us to keep the project and mine downward.

**Build implications, in order:**

| # | Item | Note |
|---|---|---|
| P1 | **Project→supplier inference spike** — before scoping the tab, try to name five real suppliers on the Energy Transfer / Nederland project by any method | **Unproven.** He doesn't know where the data lives. Geography-first is wrong at this scale (suppliers are national specialists — *"one of the top five excavators in the world for these oil and gas projects"*); geography works only for smaller projects. Named paths: the sponsor's **historical publications** (3–10 years back) naming past partners, supplier self-announcements, general project coverage. If only *categories* come out, ship categories + the outreach angle and say so |
| P2 | **Project-phase timing** — earth-moving → infrastructure → facility build-out → transportation/operations, each with a lead-time offset | The missing time dimension in the signal model. Drives *"this is probably not slated for another six, nine, twelve months, but thought I'd get ahead of it"* |
| P3 | **Soft-collateral deal-angle generator** | See below — consolidates the long-undersold #76/#107 |
| P4 | **Company ceiling at the Powerhouse line** | ~$2.3–11B est. revenue = workable *with* the soft-collateral angle; >$11B (Energy Transfer) = excluded as a target, **retained as a project record**. Supersedes the fuzzy `~$3B` soft ceiling from 8/17 |

### The soft-collateral wedge — the deal-angle moat, finally stated in full

For a well-capitalized or bond-financed target, VFI's play is the assets the senior capital **won't** encumber: *"does it make sense for us to finance the racking that you're going to hold all your servers in, or the build-out costs, or a cooling system… if it's a really good credit profile and really terrible collateral, that's my deal."* Also underground pipe (*"most lenders don't like underground piping… we're one of the few in the middle market space that do it"*) and construction mats (a $3M deal underwritten as unsecured-by-collateral at 9.25–10% where competitors would quote 10–13%).

**The economics he attached:** borrow at ~7%, price at ~7.75%, take a 75bps–1pt spread on a **$30M** ticket — accepted *because* VFI is a securitization participant and the strong credit profile improves the portfolio. Explicitly not how he would have priced it ten years ago, and explicitly a different calculus from a transactional lender's.

**Why it is product, not colour:** this is directly generatable from a project record. For any oversized target, output "what will their senior capital not encumber" — that is the override that makes an out-of-box company workable at all, and it is the clearest case yet that the moat is the **codified reasoning**, not the signal.

### Falsified

**"Tell the prospect about their own opportunity"** — the idea that a prospect might learn of a project *from* the call and go bid it. Simon asked directly; *"No… I've never done it personally, nor have I heard of anyone on our sales floor."* Do not build it as a value prop.

### Adjacent-market sequence (his framing, his brake)

Private-credit / JV matching for no-history sponsors (an iGlobal Forum "speed-dating" replacement; $50M–$500M+ tickets, 25bps fees) → AR / inventory / ABL facilities → cash-flow and unsecured/second-position lenders. **Real estate excluded** as saturated. He raised the SEC/FINRA/broker-dealer constraint himself (*"you can only take a fee on debt"*) and closed with *"it's a crawl, walk, run world."* **Park all of it** — and use his own words when we say what we are not building.

### The measurement instrument — he installed it himself, and we haven't defined its fields

> *"I'm having both of them track everything that they're doing: if they connect on the call, if that was a real project, and then — based on the information that was provided in my AI lead, how accurate was it… in a few more weeks I'll have that on 5, 10, 15 deals… and kind of see some actual real funnel metrics."*

After five calls where attribution (#77) went unasked, the customer built the collection mechanism on his own — in an unknown tool, against his reps' definition of "real opportunity," and keyed to **lead accuracy** (a satisfaction rating) rather than the waterfall we need. **This is T5 being prototyped by hand, outside the product.** Two consequences:

- **Shape it before the reps log 5–15 deals** (#121, due 8/21): four columns — which Quintel signal/trigger surfaced it · owned vs. general pool · action taken · qualified Y/N + why not. Otherwise mid-September yields fifteen opinions, not fifteen data points.
- **It is the natural first T4 feature.** A per-lead disposition form with exactly those fields, inside Quintel, turns his spreadsheet into the T5 panel's data. Cheaper than T2/T3 and he has already created the demand. Consider moving it ahead of the Derived tab in §6.

Mid-September funnel metrics land *after* the six-week reset's decision point. Decide now what result would count.

### The "act dumb" outreach play (reusable, bounded)

For CFOs *near* a mega-project who aren't on it: open on the project, take the no, apologise, then pitch from the disarmed position (*"while I have you — any capital equipment projects?"*). Qualifier is revenue, not geography: $25–50M+ only; *"local Joe Schmo Construction Company, I'd pass."* This is an outreach-generation template (#125/8/17 ask), not a sourcing rule.

### Open: companies or categories?

He described the Derived output both ways — entity-resolved, contactable supplier *companies*, and supplier *categories* to work manually. The spike (P1) decides which is feasible; ask him which changes his Monday. If only categories are achievable, categories + the per-category angle + the project phase is still a shippable card.

### The personalization spec — his Claude system

Six months of hand-built memory, and the incumbent product we are displacing: a VFI criteria one-pager iterated to stability; good-deal exemplars stored *with the reason*; real credit-committee outcomes (*"this is the type of deal my credit committee loved, it was a quick approval"*); a derived rule (*"for strong credit profiles, I'm going to look to finance the assets the bank doesn't want to finance"*); and a second thread holding a **ranked capital-partner Rolodex that learns from close outcomes** — *"Bob closed this deal, store that… James, you sent three deals and he never closed, you're out."* Ask him for the files (commitment #128).

---

## Changelog

- **2026-08-20 (pm)** — Folded the rest of the 8/20 call: layer 4 added to §1; team/owner pre-load marked shipped in §2; §14 gains the self-installed rep-tracking instrument (T5 prototyped by hand; fields to shape by 8/21), the "act dumb" play, and the companies-vs-categories question; §6 gains the 8/21 trade.
- **2026-08-20** — Added §14: project intelligence / the "Derived" tab (layer 4), the project→supplier inference problem, project-phase timing, the soft-collateral deal-angle moat and its economics, the Powerhouse ceiling, the falsified "tell them about their own project" hypothesis, the adjacent-market sequence, and his Claude memory system as the personalization spec. **§1–§13 not reworked; the 8/17 call is still unfolded.**

- **2026-07-28** — **Consolidated.** Merged the four dated session logs into this single living file; added the 7/28 call (team/management layer, deal-execution layer, hot-asset-class directive, reference-selling engine, DB cross-validation, channel + CoI boundary). Every item now carries its origin call. Prior files archived to `__ARCHIVE/product/quintel/stauss-product-notes-sessions/`.
- **2026-07-22** — Market-intelligence turn: two-sided relevance filter, connectors, tax/policy layers, $7–15K/mo band, remarketing parked.
- **2026-07-21** — First week of daily usage: 6 bugs, 12 features, the box-score-vs-buy-box failure, first 3 real prospects into VFI's pipeline.
- **2026-07-14** — Doc started. Pricing/packaging model, positioning frames, V1 baseline.
