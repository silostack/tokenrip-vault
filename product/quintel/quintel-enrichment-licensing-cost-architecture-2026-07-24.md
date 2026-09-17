# Quintel Contact Enrichment — Licensing, Cost, Coverage, and Architecture

*Date: 2026-07-24 · Status: RESEARCH BRIEF for the next build cycle · Author: strategy pass at Simon's request*
*Companion to [[product/quintel/quintel-pricing-structure-2026-07-23]] (subscription bands) — this document covers only the enrichment layer.*
*Inputs: 37 call transcripts in `bd/calls/transcripts/` · public terms of service for Apollo, ZoomInfo, RocketReach · vendor pricing pages and partner programs (retrieved 2026-07-24)*

---

## Executive summary

**Contact enrichment cannot be designed as a pricing problem. It is a licensing problem first, a coverage problem second, and a pricing problem third — in that order.**

1. **Serving contact data to customers on a standard Apollo/ZoomInfo/RocketReach plan is prohibited by all three.** This describes the product as it operates today, not a future feature. Every one of the three bans making licensed data available to third parties; ZoomInfo additionally bans use "for the benefit of… any person or entity except Licensee."

2. **The shared contact pool is dead on every current vendor path.** Cross-tenant serving is prohibited outright, and Apollo's partner agreement caps data retention at 90 days with mandatory deletion. The pool only becomes legal under a redistribution-licensed vendor where Quintel holds the contract.

3. **Bring-your-own-key is not a workaround — it is a sanctioned Apollo product.** Apollo operates an OAuth 2.0 partner flow built for mutual customers, governed by a free Integration Partner Agreement. This is the intended path, and it is the cheapest to reach.

4. **The blind/segregated-tenant architecture does not cure the contractual problem** (the prohibitions attach to credential use and integration, not to data visibility) **but it is the cheapest way to satisfy the partner agreement's retention limits** and the strongest InfoSec story for a bank-owned buyer.

5. **The binding constraint is coverage, not cost.** Apollo, ZoomInfo, Clay, Cognism and Lusha all draw from the same LinkedIn + corporate-web pool. Roughly half of local-business decision-makers have no LinkedIn presence; SMB mobile coverage runs 10–20%. Quintel's buy boxes are scrap yards, garbage haulers, septic-truck operators and roll-off companies. **This is the same structural doubt four separate lenders have now raised, and no enrichment vendor selection fixes it unless the source shape changes.**

6. **Quintel already ingests the best available identity source for this segment and does not use it.** UCC filings carry the debtor's signer name. For an owner-operator that is usually the owner. Buying only *contactability* for a known person at a known company is the cheapest and highest-yield query shape in any waterfall.

**Recommended shape:** two-track enrichment — customers with an existing tool enrich in their own environment (CRM handoff, then OAuth connector); customers without one are served under a single redistribution-licensed vendor. Meter **mobile numbers**, not "contacts." Include emails generously. Do not build the pool.

---

## 1. Situation — enrichment is a live, repeated, prospect-initiated ask

Enrichment surfaced in **10 of ~17 EF prospect firms**. In nine of those the prospect raised it unprompted.

| Firm | Call | What they said |
|---|---|---|
| **Providence** (Michael) | 07-21 | *"If a lead comes through without a phone number or email, **I'm not going to be very interested.**"* Wants to filter to leads with office line + mobile + email + title (managing member / president / CEO). Asked where data is sourced "just asking for accuracy" |
| **Providence** (Max) | 07-21, 07-14 | *"Can we segregate down to only leads that give us an office line, a mobile, and an email?"* Also: just signed a ZoomInfo contract |
| **Armada** (Vickie / Bill) | 07-22 | *"When you enrich the contact information, does it give email, phone?"* · Bill: *"But we should have a contact. That'd be great."* |
| **VFI** (Stauss) | 05-29, 07-08, 07-21, 07-22 | Wants 3–5 verified contacts with titles; **has ZoomInfo and asked for a connector**; save→enrich→remove loop (§3.2) |
| **Hyland** (Bo) | 06-30 | *"Is there additional information on email addresses… or is it simply saying this seems like a good target… so now it's up to you to figure out how to get a hold of them?"* |
| **Mehmi Group** (Zora) | 06-30 | *"Does that $5,000 also include the data / phone number database?"* → answered **yes** |
| **Regents** (Allen) | 07-13 | Alek: *"Would you need them enriched?"* → *"Yeah."* Also asked whether detail arrives in the Excel export |
| **36th St** (Mike Ryan) | 06-22 | Has ZoomInfo — *"I use it more for **contact enrichment** than any real market intelligence"* |
| **Empire** (Katharine) | 06-18 | *"We use HubSpot and **ZoomInfo for contacts**"* |
| **Navitas** (Nicole) | 07-07 | We raised it as part of setup; no reaction |

**Never mentioned it:** Civista, TFG, Onset, FS Growth, CBS, DCF, the Australian broker, Bevel.

**Split on tool ownership — roughly half and half.** Confirmed to already own a contact tool: VFI, Empire, 36th St, Providence (4). Confirmed to have none or to expect us to supply it: Hyland, Mehmi, Regents; plus Civista, which has no direct sales force at all (4). **This split is the reason a single enrichment strategy will not work.**

**Commitments already made verbally that constrain the design:**
- Zora (06-30) was told the $5,000 figure includes the phone-number database.
- Michael and Max (07-21) were told filtering on contact presence is *"something we could do."*
- Stauss (07-22) asked for a ZoomInfo connector and was not refused.

---

## 2. Complication — three independent problems, commonly mistaken for one

### 2.1 The licensing problem (immediate, live today)

Alek to Michael, 07-21: *"We use a few different providers — Apollo, ZoomInfo, depending on the contact surface."* On standard plans, showing those results to paying customers falls inside the prohibitions in §4.

### 2.2 The cost problem (as framed by Simon)

~$0.30 per contact via Apollo. A customer saving 1,000 companies and requesting contacts for each = $300 of COGS against a $1,500/mo subscription. **Note: this scenario is hypothetical.** No customer has done it. The only heavy saver on record (Stauss) was *deleting* most of what he saved.

### 2.3 The coverage problem (the real constraint, and the one nobody has priced)

Four lenders have independently raised the same structural doubt in three weeks:

- **Bill / Armada, 07-22:** *"Publicly traded entities, larger ticket purchases, larger entities are easier to scrape on versus small medium… **You got a truck driver with a fleet of two. You're not going to have a lot of information on that fella.**"*
- **Kevin / Civista, 07-24:** *"I'm worried that we're a **middle marketplace**, so I'm wondering how much information you're going to get about contracts and things being done for **small-time customers**."*
- **Michael / Providence, 07-21:** company-size filter unbuilt; wants to exclude thin records.
- **Stauss / VFI, 07-14, 07-21:** revenue estimation for private companies is *"the golden goose."*

**None of these has ever been answered with a number.**

---

## 3. What the call record says about how enrichment is actually consumed

### 3.1 The buyer already accepts consumption pricing

**Vickie / Armada, 07-22** — unprompted, before any pricing model was proposed:

> *"We're verifying the business, we're verifying the individual, we're looking for history and financials… We have a lot of different sources that we go to for that when it gets to that point, and **each of them costs money, so we wouldn't want to run it on a group of cold list leads.** However, once we get down to a certain point in it and go, wow, this may be a really good one, then **we could do it on an individual basis.**"*

EF buyers already live in a per-lookup-costs-money world. Metering will not feel foreign.

### 3.2 The current design spends contact credits to answer firmographic questions

**Stauss / VFI, 07-21:**

> *"I find myself going to save it, and then I'll click on it and wait for the data to enrich, and then I'll go and remove it if it doesn't. …It did enrich the data, it's showing an estimated 2.3 million in revenue. But I find myself having to click on that, then going to the saved, try to verify it a little bit more through the enrichment, and then if it doesn't come through with the kind of stuff that I want, I'll just remove it. **It's getting annoying in that regard.**"*

Same call, Simon: *"We ran out of credits on enrichment."*

**He is not buying contacts. He is buying company verification — revenue, size — and then deleting the record.** The current `enrich`-on-save action fuses two data needs with a 6–10× cost difference and fires the expensive one to answer the cheap question.

**Design consequence:** split the primitive.
- **Verify company** (revenue estimate, headcount, size band) — included, unmetered, cheap or internally derivable.
- **Reveal contacts** — metered, on explicit click, never on save.

### 3.3 Mobile is the valued unit, and it is the expensive one

**Michael / Providence, 07-21:** *"I'm more interested in someone with a **mobile number**, an office line, an email, and a specific title — managing member, president, CEO."*

Mobile costs 6–10× email at every vendor surveyed (§5). Buyer value and vendor cost point the same direction. **Meter mobiles, not "contacts."**

### 3.4 The identity source we already own and do not use

**Michael / Providence, 07-21:**

> *"In the past when we've purchased UCC filings, it comes with **whoever actually signed the filing** — not just the company name, but a name like John Smith."*

The UCC debtor signer is public record: free, no license, and for an owner-operator usually the owner. This gives Quintel the *identity* half of the contact problem from data already in the ingestion pipeline. Only *contactability* — email/phone for a named person at a named company — needs to be purchased, which is the cheapest and highest-hit-rate query shape in any waterfall. **No competitor in the enrichment comparison below has this input.**

---

## 4. Licensing findings — verbatim

### 4.1 Apollo

| Provision | Text |
|---|---|
| §3(a)(ii) | *"resell, distribute, disclose, sublicense, transfer, sell, offer for sale, or **make available any of the Contributor Database or any part of the Services to any third party**"* — prohibited |
| §3(a)(iv) | may not *"incorporate any portion of the Platform or Contributor Database into your own products or services that you offer to third parties"* |
| §3.4 / API §5 | may not *"use the Services or data derived therefrom to create, train, or improve a product or service that **directly competes** with Apollo's core offerings"* — API terms add *"**as determined by Apollo in its sole discretion**"* |
| API Terms §3 | *"You may not access the APIs via a third party's API credentials or integrate the APIs with your product or services, **unless Apollo has authorized or approved such access or integration.**"* |
| §2(a)(1)(ii) | Customer receives a *perpetual, worldwide, transferable, royalty-free license* to **Platform Generated Information** for **internal business purposes** |
| §4(d)(1) | Seats are per-user; *"may not seat-share or time-share"* |

**Apollo Integration Partner Agreement** (the sanctioned BYO-key path):

| Provision | Effect |
|---|---|
| OAuth 2.0 partner flow | Explicitly designed so *"mutual customers can log in using their existing Apollo credentials"* |
| Scope | Limited to *"Customers that have contracted for services from both Apollo and Partner via separate agreements"* — **cannot serve non-Apollo customers** |
| Retention | Partners *"may retain PGI and test results only for the duration necessary… **not to exceed ninety (90) days**"*, then *"must delete all retained PGI except as required by law"* |
| Redistribution | Same third-party prohibition as the main terms |
| Competing use | Same prohibition carries through |
| Fees | **No certification or approval fee found** |

**Apollo Data Licensing** (the sanctioned we-serve-the-data path): Apollo's own partner materials state that *integrations for the purpose of sharing, exposing, or reselling data to non-Apollo users require a custom contract.* Contact: `partners@apollo.io`.

### 4.2 ZoomInfo

| Provision | Text |
|---|---|
| §2.3 | *"Licensee shall not distribute, sublicense, transfer, sell, offer for sale, disclose, or make available any of the Licensed Materials or any part of the Services to any third party."* |
| §2.3 | *"Licensee shall not access or use the Licensed Materials **for the benefit of or on behalf of any person or entity except Licensee**."* |
| §2.3 | *"Licensee shall not… **utilize or incorporate any ZoomInfo API credentials into any Third Party Applications**…"* |
| §2.4 | may not *"share, sell, rent, or lease or otherwise distribute access to the ZoomInfo Technology, or use the ZoomInfo Technology to operate any **timesharing, service bureau**, or similar business"* |
| §2.1 | Authorized User credentials *"may not be shared and may not under any circumstances be used by anyone who is not an Authorized User"* |
| §3.3.1 | On termination, Licensee *"may continue to use Licensed Materials obtained during the Term subject to the terms of this Agreement"* |
| Competing product | No explicit clause found |

**Critical asymmetry:** under §2.3 the breach in a BYO-key design is committed by **the customer**, not by Quintel. Asking Stauss, Katharine or Max to plug ZoomInfo credentials into Quintel is asking them to violate their own agreement. Eventually that request lands in front of a bank's legal team.

**Note the precedent Stauss set for us (07-22):** he connected ZoomInfo and Salesforce to VFI's enterprise Claude account. That works because Claude is a **ZoomInfo-sanctioned integration**. The distinction is not technical — it is whether the vendor has blessed the integration. ZoomInfo's partner/marketplace program is the equivalent ask to Apollo's.

### 4.3 RocketReach

| Provision | Text |
|---|---|
| License Restrictions | *"You may not duplicate, copy, resell, reuse, exploit or reverse engineer Lookup Information or any portion"* |
| License Restrictions | *"you may not **transfer or disclose the Lookup Information to anyone else**."* |
| Your Use of the Services | may not *"reproduce Lookup Information or content from the Services (including on another website or platform), sell, rent…"* |
| Subscription Agreement | Export license granted *"solely for your personal use"* |
| API scope | ToS opening: *"For Users of our API… this Agreement applies to both you and end users of your website or application"* — contemplates downstream end users but does not grant redistribution |
| Caching | **No explicit restriction found** |
| Competing database | **No explicit restriction found** |

RocketReach is the least restrictive of the three on caching and competing-product grounds, but still prohibits redistribution.

### 4.4 Conclusions

| Design | Apollo | ZoomInfo | RocketReach |
|---|---|---|---|
| We hold the license, we serve contacts to customers | ✗ needs Data Licensing contract | ✗ needs enterprise resale tier | ✗ |
| Cross-tenant shared pool | ✗ (and ✗ under partner agreement's 90-day deletion) | ✗ (§2.3 "benefit of… except Licensee", §2.4 service bureau) | ✗ |
| BYO-key connector | **✓ via Integration Partner Agreement + OAuth** | ✗ standard terms; needs partner/marketplace approval | unclear — ask |
| Per-tenant cache we hold | only within a Data Licensing contract | only within an enterprise resale tier | ✗ redistribution still bars serving |
| Customer enriches in their own environment (CSV / CRM) | ✓ | ✓ | ✓ |

---

## 5. Vendor landscape and cost analysis

### 5.1 Redistribution rights

| Vendor | Resale / embed rights | Notes |
|---|---|---|
| **FullEnrich** | ✅ **Explicit reseller program** — *"custom reseller TOS"*, *"You buy credits. You set your price. You keep the margins."* | 20+ provider waterfall (includes Apollo, Dropcontact, Hunter, Datagma, Findymail, RocketReach, BetterContact). **Pay only on successful find.** Claims >80% coverage vs 40–60% single-source |
| **Explorium** | ✅ Resale rights in custom plans; *"one agreement covers all 50+ underlying data sources"* | ⚠️ Claim is from Explorium's own marketing — verify independently |
| **Openmart** | ⚠️ **Unverified — first question to ask** | Sources are business registrations, licensing DBs, permits, franchise disclosures — **not LinkedIn**. Claims 200M+ contacts, 17M+ US local business locations. Names + titles free |
| **BetterContact** | Not advertised; ask | Same waterfall model, cheaper entry |
| **People Data Labs** | ⚠️ Enterprise tier only | Bulk/annual data licenses exist; Enterprise reportedly starts ~$2,500/mo |
| **Coresignal** | ⚠️ Negotiated case-by-case | Powers other data products; terms not public |
| **Apollo** | ✗ default; custom Data Licensing contract required | Monthly billing makes redistribution costly at scale |
| **ZoomInfo** | ✗ enterprise-only resale tier; $15K+ annual commitments | Not viable at current stage |
| **Clearbit / Breeze** | ✗ HubSpot-locked | Not applicable |

**What counts as redistribution** (useful framing, from Explorium's licensing write-up): *"If your SaaS product displays enriched firmographic data in a dashboard, surfaces contact details in search results, or returns enriched records through your own API, that's redistribution."* Quintel does all three.

### 5.2 Published pricing

| Vendor | Plan | Credit cost | Email | Mobile |
|---|---|---|---|---|
| **FullEnrich** | Starter $29 / 500; Pro ~$55 / 1,000 | ~$0.055 | 1 credit ≈ **$0.055** | 10 credits ≈ **$0.55** |
| **BetterContact** | Starter $15 / 200; Pro $49 / 1,000 | ~$0.049 | 1 credit ≈ **$0.049** | 10 credits ≈ **$0.49** |
| **Openmart** | Starter $149 / 5,000; Pro $299 / 10,000; Scale $999 / 40,000 | $0.025–0.030 | 3 credits ≈ **$0.075–0.090** | 8 credits ≈ **$0.20–0.24** |
| **Apollo** (current) | — | — | — | ~$0.30 blended *(Simon's figure)* |
| **PDL** | Pro $98/mo — 350 person credits + 1,000 company lookups | ~$0.28 | — | — |

Reseller/bulk rates are lower than published tiers at all three waterfall vendors — *"the more you commit, the lower your cost per credit."* Treat published figures as ceilings.

**Two structural facts worth designing around:**
1. **Mobile costs 6–10× email everywhere.** A blended "$0.30 per contact" hides the only cost lever that matters.
2. **Waterfall vendors charge only on successful find.** Misses are free — which materially changes the economics of running enrichment across a thin SMB list, and of Michael's filter-on-contact-presence request.

### 5.3 COGS against the pricing bands

Against [[product/quintel/quintel-pricing-structure-2026-07-23]]: Core $1,500/mo, Institutional $3,000/mo.

| Included allowance | Email only | Email + mobile | % of Core MRR | % of Institutional MRR |
|---|---|---|---|---|
| 100 contacts | ~$8 | ~$28–60 | 0.5–4% | 0.3–2% |
| **250 contacts** | **~$19–22** | **~$70–150** | **1.3–10%** | **0.6–5%** |
| 500 contacts | ~$38–45 | ~$140–300 | 2.5–20% | 1.3–10% |
| 1,000 contacts | ~$75–90 | ~$280–600 | 5–40% | 2.5–20% |

**On the 100/month figure:** the base plan is org-wide, not per-seat (Alek to Kevin, 07-24: *"there's not per-seat, you just get access to the whole thing"*). One rep working five leads a day *is* 100/month. Armada has four named vertical heads plus reps; Providence has a team. **100 is a paywall in week two of month one.** At $0.075–0.09 per email the incremental cost of going to 250 is $12–15/month.

**On the proposed overage pack (2,000 contacts for $100):** that prices at $0.05/contact against a $0.20–0.55 mobile cost. It loses money on every unit and loses most on the heaviest users. **Not viable.** Workable shapes:

| Model | Structure | Margin |
|---|---|---|
| **Cost-plus packs** | 500 mobiles $249 · 2,000 mobiles $799 | 25–40% |
| **At-cost pass-through** | 1,000 mobiles $300 | 0% — but supports the *"we don't make money on data, we make money on intelligence"* frame |

**Positioning caution:** a visible Apollo-style credit meter anchors Quintel to the data-vendor comparison, which is exactly the frame Stauss warned against (07-14): *"You're not selling a ZoomInfo or a SaaS product to make you sell better… I'm selling a person, an originating agent."* Put overage in the order form as verified-contact packs. Do not put a credit counter in the UI header.

### 5.4 The coverage constraint

Apollo, ZoomInfo, Clay, Cognism and Lusha draw from a common source pool: LinkedIn profile data plus corporate web data. Reported consequences for the local/SMB segment:

- **~50% of local business decision-makers have no LinkedIn presence at all.**
- **Decision-maker mobile coverage in local/SMB segments runs 10–20%.**
- Independent contractors, haulers, franchise operators and home-services companies are structurally absent from these engines — *"if a contact doesn't have a LinkedIn profile or corporate website presence, they are likely absent from all five providers simultaneously."*
- SMB records also carry lower match and deliverability rates because small businesses churn faster and file fewer public records.

*(These figures come from vendor-adjacent content — Openmart and Datalane — and should be treated as directional, not authoritative. They are, however, consistent with four independent lender objections.)*

**Implication:** buying a bigger Apollo tier does not fix this. Only a different **source shape** does — registration, licensing, permit and filing data — which is what Openmart-type vendors index and what **Quintel's own UCC pipeline already contains** (§3.4).

---

## 6. Architecture options

### A. CSV round-trip — *ship first*

Export from Quintel → customer bulk-enriches in their own Apollo/ZoomInfo → re-imports.

- **Legal exposure:** none. **COGS:** zero. **Build:** ~1 day.
- **Requirement:** a stable `quintel_company_id` column so the re-import merges cleanly.
- Allen already asked for this shape (07-13): *"The detail would have it all in the export on Excel?"*
- **Limits:** manual; breaks workflow; no pre-save filtering.

### B. CRM as the enrichment venue — *ship second*

Push company + UCC signer name into their Salesforce / HubSpot / LeasePath; their **existing** ZoomInfo or Apollo CRM integration enriches it there.

- **Legal exposure:** none — that is what those integrations exist for. **COGS:** zero.
- Vickie already described this workflow herself (07-22): *"the key would be making sure that we had fields in Salesforce for everything we wanted to export out of here."*
- Best answer for Armada (Salesforce), Providence (LeasePath), Empire (HubSpot), VFI (Salesforce).

### C. OAuth partner connector — *the sanctioned BYO-key*

Register under the Apollo Integration Partner Agreement; customer authorizes their own Apollo account via OAuth.

- **Legal exposure:** none once the agreement is signed. **Fee:** none found. **Build:** ~4–6 weeks including approval.
- **Constraint:** may not serve customers who lack their own Apollo agreement; may not retain PGI beyond 90 days.
- ZoomInfo requires a separate equivalent through its partner/marketplace program.

### D. Fully customer-hosted connector

Strongest legal posture — our software, their infrastructure, their key — but highest support burden, and a bank-owned buyer will not run our container. **Not worth pursuing once C exists.**

### On the blind / segregated-tenant design specifically

| Claim | Assessment |
|---|---|
| It makes BYO-key legal | ✗ **No.** Apollo API §3 and ZoomInfo §2.3 attach to *credential use* and *integration with your product*. Visibility is irrelevant; encryption does not cure a licensing clause. Only the partner agreement does |
| It is the cheapest way to comply with the partner agreement | ✓ **Yes.** The 90-day retention cap and mandatory deletion are satisfied by construction if the data never lands in a readable store |
| It is a genuine InfoSec asset | ✓ **Yes** — particularly for Civista (bank-owned) and Armada, whose CRO thinks in vendor-risk terms. *"We architecturally cannot read it"* is the strongest possible answer to a security questionnaire |
| It has no cost | ✗ **No.** It forecloses caching, deduplication, hit-rate measurement, and any future pool for that tenant — permanently. **Mitigation: log counts (reveals attempted / succeeded) even when content is unreadable**, or the metric that sets the included allowance is invisible |

---

## 7. Recommended design

**Two-track enrichment, keyed to whether the customer already owns a contact tool.**

**Track 1 — customer has a tool** (VFI, Empire, 36th St, Providence): they enrich in their own environment. CSV round-trip now (A), CRM handoff next (B), OAuth connector when the partner agreement lands (C). Quintel never touches contact data, never pays for it, and carries no licensing exposure.

**Track 2 — customer has no tool** (Hyland, Mehmi, Regents, Civista): Quintel serves contacts under **one redistribution-licensed vendor** where we hold the contract.

**Product primitives:**
1. **Split `enrich`.** *Verify company* (revenue, headcount, size band) — included, unmetered. *Reveal contacts* — metered.
2. **Never enrich on save.** Reveal on explicit click. This alone eliminates the Stauss save→remove waste.
3. **Meter mobiles, not contacts.** Include emails generously; mobiles are 6–10× cost and are the unit buyers actually value.
4. **Contact-availability badge** (high / med / low), predicted from company size, filing recency and cache state, so Michael and Max can filter on likely contactability **without paying to reveal.** This is materially easier to build now than to retrofit after being promised the real filter.
5. **Per-tenant cache only** — and only where the vendor license permits serving customers at all. **Do not build the pool.**
6. **Use the UCC signer name** as the identity input; purchase only contactability.

**Packaging:** 250 contacts included in base (not 100). Overage as cost-plus packs in the order form, not a UI credit meter. Emails effectively unlimited if the vendor's email cost lands under ~$0.09.

---

## 8. Decisions to lock

| # | Decision | Owner | Notes |
|---|---|---|---|
| 1 | Two-track enrichment, or one? | Simon | Recommended: two-track |
| 2 | Included allowance — 250 vs 100 | Simon | 250 costs $12–15/mo more at email-only rates |
| 3 | Meter unit — mobiles vs contacts | Simon | Recommended: mobiles |
| 4 | Overage price | Simon + Alek | Cost-plus packs or at-cost pass-through. **Not 2,000/$100** |
| 5 | Track-2 vendor | Simon | Openmart vs FullEnrich reseller vs Explorium |
| 6 | Build the blind tenant? | Simon | Recommended yes, as the implementation of C — with counter logging |
| 7 | Pool | Simon | Recommended: do not build. Revisit only under a redistribution license |

## 9. Actions

| # | Action | Owner | Due |
|---|---|---|---|
| 1 | **Coverage test** — run 200 real surfaced companies (waste/recycling, construction, specialty trucks, propane) through Openmart and FullEnrich trials; measure email and mobile hit rates by revenue band | Simon | before wk of 7/27 |
| 2 | Ship CSV export with stable `quintel_company_id` join key | Simon | this week |
| 3 | Email `partners@apollo.io` for the Integration Partner Agreement | Simon | this week |
| 4 | Ask Openmart, FullEnrich, Explorium the same three questions: **redistribution rights in writing** · **hit rate on our sample** · **reseller pricing at ~50K credits/yr** | Simon | this week |
| 5 | Stop enriching on save; move to explicit reveal | Simon | next build |
| 6 | Check ZoomInfo's partner/marketplace program for the Stauss connector ask | Simon | before next VFI call |
| 7 | Legal review before signing any data-licensing contract or putting a pooled-data clause in front of a bank | Simon | before signature |

**Action #1 is the highest-leverage item in this document.** The same 200-company test produces three deliverables at once: it sets the included allowance, it answers Kevin's *"how many companies would actually be in that"* (Civista quote, due 7/25), and it answers Bill's SME-density objection before Armada's demo #2.

---

## 10. Load-bearing assumptions

| Rank | Assumption | fact / inferred + conf. | Cheapest test |
|---|---|---|---|
| 1 | Contact coverage is adequate for owner-operator SMBs in our sectors | **inferred, LOW** — never measured; published SMB mobile coverage is 10–20% | Action #1 |
| 2 | The 1,000-company enrichment blowout is a real risk | **inferred, LOW** — hypothetical; the only heavy saver was deleting most saves | Instrument reveal counts per account for 30 days before pricing against it |
| 3 | Openmart's registration/permit-derived sourcing outperforms LinkedIn-derived data on our buy boxes | **inferred, MED** — source shape is right; unmeasured on our data | Action #1, head to head |
| 4 | Apollo will approve Quintel as an Integration Partner | **inferred, MED–HIGH** — no fee, standard program; but §3.4's competing-product clause is *"in Apollo's sole discretion"* and Quintel is a sales-intelligence product | Action #3 — ask, and disclose what Quintel does |
| 5 | The half of prospects with an existing tool will accept enriching in their own environment | **inferred, MED** — Stauss asked for a connector, not for us to supply data; Katharine and Mike Ryan already use ZoomInfo that way | Offer the CSV/CRM handoff at the next VFI and Armada calls and watch whether it reads as a downgrade |
| 6 | Buyers will not object to metered contacts | **inferred, MED–HIGH** — Vickie described per-lookup paid verification as normal, unprompted | First order form that carries it |

---

## Appendix — sources

Retrieved 2026-07-24. Public terms only; a customer's signed order form may differ, and none of this is a lawyer's read.

- Apollo Terms of Service — https://www.apollo.io/terms
- Apollo API Terms of Service — https://www.apollo.io/terms/api
- Apollo Integration Partner Agreement — https://www.apollo.io/terms/technology-partner-program
- Apollo OAuth 2.0 (Partners) — https://docs.apollo.io/docs/use-oauth-20-authorization-flow-to-access-apollo-user-information-partners
- Apollo Partner Program overview — https://www.apollo.io/magazine/empower-your-clients-and-grow-your-business-with-the-apollo-io-partnership-program
- ZoomInfo License Terms & Conditions — https://www.zoominfo.com/legal/ltc
- RocketReach Terms of Service — https://rocketreach.co/terms
- RocketReach Subscription Agreement — https://rocketreach.co/subscriber_terms
- FullEnrich Reseller Program — https://fullenrich.com/partners/resellers
- Openmart local business data enrichment — https://www.openmart.com/product/data-enrichment
- People Data Labs data license overview — https://docs.peopledatalabs.com/docs/data-license
- Coresignal pricing & credits — https://docs.coresignal.com/introduction/pricing-and-subscriptions
- Explorium, *B2B Data API Resale Rights & Licensing* (2026) — https://www.explorium.ai/blog/data-for-gtm/b2b-data-api-resale-rights-licensing-what-product-builders-need-to-know-now-in-2026/
