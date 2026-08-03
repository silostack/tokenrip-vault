---
contact: Martin Roth
company: Filmore (filmore.ai)
call_type: peer / relationship — potential collaborator, not a customer or competitor (yet)
status: warm ongoing — mutual openness to help each other / explore collaboration; NO concrete next step set (keep-in-touch only)
last_contact: 2026-07-13
intro_via: Petar (Simon's friend; Martin is Petar's mentor)
related:
  - product/quintel/quintel-data-strategy-signal-portfolio-2026-07-13.md
  - intelligence/research/quintel/quintel-competitive-landscape-research-2026-06-18.md
---

# Martin Roth — Filmore

## Who / What

Co-founder of **Filmore** (filmore.ai) — a signals-to-workflow prospecting platform for **construction-equipment dealers / rental companies**. Former **CRO of Levelset** (construction lien/payment platform), which he scaled through the **$500M Procore acquisition** (2021); a well-known B2B GTM operator (martinroth.com, GTMnow podcast). His co-founder is the **data specialist** ("data guy"), based in **Austin** (same city as Alek). Filmore is ~**1 month in** — roughly the same age as Quintel — but is **ahead on customers** (has some; Simon didn't capture names).

Intro came via **Petar** (Simon's friend; Martin is Petar's mentor). Framed and taken as a **genuine meet-and-greet, no agenda.** Landed as a **warm, ongoing relationship** — both sides open to helping each other and seeing where it goes.

**Why he matters to Quintel:**
1. **A live operator one seat over** — same public-data plumbing (UCC, permits, formations), different buyer (he arms the *dealer selling* the machine; Quintel arms the *lender financing* it). A rich de-risking and learning source.
2. **Potential data collaborator** — both buy/ingest largely the *same base data* for the *same deals*; the enrichment and GTM diverge. Safe-collaboration boundary is real (see Open Threads).
3. **A world-class GTM brain in the orbit** — the exact complement to Simon's engineering; valuable regardless of whether any collaboration materializes.

## Pre-Call Research (2026-07-11 deep dive, merged in)

> [!warning] Discrepancy to resolve
> The 07-11 research brief's Petar-sourced update says **Filmore has no product yet** — Martin sold it before it was built, launch planned for **August 2026**, and he was looking for an engineer (prompting Petar to suggest Simon). The 07-13 call notes below say Filmore is "ahead on customers (has some)." These don't reconcile — either the pre-product read was stale by the time of the call, "customers" meant early design partners/free-tier signups rather than paying accounts, or the two data points are talking about different things. Worth clarifying next contact, since it changes the read from "learn from a live operator" to "potential FDE opportunity."

**FDE-opportunity framing (pre-call hypothesis, per Petar):** If Filmore was in fact pre-product at intro time, Martin (proven GTM seller, ex-CRO Levelset → $500M Procore exit) sold the product before building it and needed a platform/product engineer alongside his data/ML co-founder — the classic sell-first forward-deployed-engineer motion Tokenrip's strategy is built on. The part Filmore needed built (UCC/permit/formation → entity-resolution → signal-scoring pipeline) overlaps almost exactly with Quintel's own unbuilt L2/L3 layer — built once, it could serve both. **The decisive term, if this path is ever revisited: engine ownership.** Simon retains the Tokenrip substrate and Filmore is a paying vertical on it (like Quintel) — not Simon as build-labor handing the pipeline to Filmore outright. Per the call itself, **this subtext never surfaced** — no recruiting pitch, just a joking "you/Alek should just join Filmore." Read as warmth, not a live opportunity, but worth remembering if Martin circles back.

**Architecture mirror (Filmore vs. Quintel, same three-layer shape):**

| Dimension | Filmore | Quintel |
|---|---|---|
| Buyer | Equipment dealer/rental rep (sells/rents the machine) | Equipment-finance originator (finances the machine) |
| Public signals | UCC, permits, formations, licensing — the lead product | UCC/permits (L1/L3) — woven in, never the lead |
| Customer-data depth | Telematics + service/ERP history | Deal history + credit memos (revealed preference) |
| Delivery | SMS/email/CRM — "not another dashboard" | The Stream (new surface) + import/interaction |
| Pricing (their stated plan) | Free wedge → $3k/mo/state → custom enterprise | $10k setup → monthly subscription |
| Team | Levelset GTM (Roth) + Procore ML (Josh Nguyen) | Simon (eng) + Alek (BD) |

**Pricing ladder (as planned/stated, pre-launch — may not reflect what shipped):** Free "Individual Rep" tier (weekly briefing, public financing signals) → $3,000/mo per state "Sales Team" tier (CRM integration, SMS, lead scoring, unlimited seats, month-to-month, no setup fee) → custom Enterprise "Data + Agents" tier (AI agents prospect for you, telematics/ERP integration, typically a 6-month pilot). Free tier = commodity public-signal wedge; paid ladder climbs into integrated customer data + done-for-you agents.

**filmore.build** — a separate programmatic-SEO microsite publishing per-state/per-metro equipment-market intelligence pages, feeding the free tier. Template worth stealing for Quintel's P1 audience motion (see `make-com-playbook-analysis-2026-05-21`).

**Load-bearing assumptions from the pre-call brief (ranked, for future reference):**
1. Filmore's buyer stays the dealer, not the financier, near-term — confirmed on the call ("no intention of going after lenders at the moment") but see the lender-drift tension logged below.
2. Filmore's retention is driven by integrated customer data (telematics), not raw public signals — **confirmed on the call**: Martin said directly "data is not the moat," their moat is the private telematics/service layer. This validates Quintel's customer-data-first thesis.
3. Relationship stays warm/non-rivalrous — manage by not over-sharing Quintel's ranker/deal-history edge.
4. Filmore is early-stage/lightly funded — inference only, no funding data found.

Full three-lens teardown (learn/de-risk, partnership, competitive) archived; see call notes below for what the actual conversation confirmed or changed.

## Call History

- **2026-07-13**: Meet-and-greet (video, not recorded — reconstructed from memory). Simon opened by explaining Quintel (targeting **lenders**) vs. Filmore (targeting **dealers**). Martin: **no intention of going after lenders "at the moment"** — though he mentioned he had his **first meeting with a bank that same afternoon** (note the tension). Extended, open conversation about data sourcing and the space. Both agreed to keep in touch and separately think about whether/how to work together. No next step scheduled.

## Running Intelligence (first-hand from the call)

**On data (the core of the conversation):**
- **"Data is not the moat."** Martin said this directly. Filmore's public about-page confirms the thesis: *"Public data gets you started. But the real advantage comes when a dealer connects their telematics, service history, and customer records. That is intelligence nobody else can offer."* → **Their moat is the private dealer-data (telematics/service) layer, not the public feed.**
- **~$350k / year for state data.** Simon's read: likely their **total annual data cost** (UCC + other sources), not UCC alone. A concrete build-vs-buy anchor Quintel didn't previously have.
- **They've "figured out" UCC → collateral mapping** (e.g., a lien resolved to "10 tractors" — raw UCC lacks the collateral detail). **But this is almost certainly procurement, not proprietary IP:** Fusable/EDA and TEX already sell UCC *enriched with collateral*, and Filmore's own FAQ positions against "EDA or Tex." So the "secret sauce" reads as **"buy the enriched feed"** — the same build-vs-buy option already flagged in Quintel's competitive doc.
- Distinguished **direct-from-state UCC** vs. **UCC resellers** (who sell "clean"/enriched data). Did **not** name exactly who they buy from, or the data latency (both open unknowns).
- **Geo-dependent by design** — dealers care about their territory, so Filmore rolls out **~one state per week** and believes strongly in maximizing data coverage. Currently ~**5–10 states** live (inferred from their site, not stated).
- **Long-term (years out, post-establishment) plan to open-source the data** — consistent with "data isn't the moat." Not near-term; they're in discovery, like Quintel.

**Meta-reads (calibration):**
- Martin was partly **scoping how far Quintel had gotten** — asked whether Simon knew Fusable, knew joinsubstrate.com, and whether Quintel had cracked collateral data (Simon: not yet). Normal in a "not competing" warm relationship, but he is mapping Quintel's capability; fine to be a little asymmetric in return.
- **Tension to note (not an alarm):** "no intention to go for lenders" *and* "first bank meeting this afternoon." Could be a data-buyer, a design partner, or lenders are a softer exclusion than stated. His drift toward lenders is worth passively watching.
- **The "engineer / would you build this" subtext never surfaced** — he gave no indication of recruiting. The only gesture was a **joke that Simon/Alek should "just join Filmore"** (after Simon mentioned Alek is in Austin). Read as warmth, not a pitch.

**Other players he surfaced:**
- **joinsubstrate.com** — a tech-driven placement platform (Bevel/[[ted-craver]]-adjacent). Mentioned in passing / as a "do you know them?" probe, **not** framed as a competitor.
- **Fusable/EDA and TEX Software** — as the known equipment-data incumbents (his data sources and/or comparison points). See competitive doc §2a/§2b.

## Relationship / Pipeline State

**Temperature:** Warm, genuine, mutually curious. Both explicitly open to "helping each other out."

**Stage:** Relationship-building. **No commercial or collaboration structure discussed** beyond "we'll both think about it." **This is the risk: a warm thread with no scheduled next touch dies.** If Simon wants it alive, he should manufacture a low-friction next contact (share something useful, or a specific "here's a way we could help each other" note) rather than waiting.

**What Quintel wants from the relationship (not yet asked for):**
- Learn the data-sourcing economics (vendors, latency, what the $350k actually buys).
- A possible **shared-base-data** arrangement (split/segment the ~$350k public feed; diverge on enrichment).
- Ongoing GTM learning from a $500M-exit operator selling into an adjacent, equally under-tooled trade.

## Open Threads (carry forward)

1. **What "working together" concretely means** — undefined by both sides. The cleanest, safest shape (developed in the data-strategy doc): **shared commodity base data (UCC/permits) + divergent enrichment (his telematics/collateral for dealers; Quintel's credit/refi-timing/competitive-map/capex-triggers for lenders) + divergent GTM.** Neither's enrichment competes; the base cost can be shared. **Take this to him as a concrete proposal if the relationship warrants a next step.**
2. **Resolve the data unknowns** — exact vendors, what $350k covers, data latency/freshness SLA.
3. **Watch his lender drift** — the "first bank meeting" against "no intention for lenders."
4. **Don't over-share Quintel's edge** — the revealed-preference ranker on deal history + the lender-specific enrichment stack is exactly what a dealer-signals company lacks and could copy. Warm ≠ full disclosure.

*Full Filmore teardown + three-lens strategic read merged inline above (2026-07-11 research brief, since deleted). The data thinking this call opened up: [[quintel-data-strategy-signal-portfolio-2026-07-13]].*
