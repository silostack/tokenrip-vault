# Stauss Call — 2026-07-14 (firm-direct)

## Follow-Up Actions

### What WE Need to Do
| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | **Send Stauss his customized V1 login** (right after the call) — the gating deliverable; his feedback loop starts only when he uses it daily | Simon | 2026-07-14 (same day) |
| 2 | Add **evidence-trail + score-reasoning** to the prospect view (why is this a 96) | Simon | next build |
| 3 | **Surface UCC competitor/lender data** (already stored, not shown — turn it on: who financed them last, lead bank) | Simon | next build |
| 4 | Update the **ticket-size estimation algorithm** (estimate from UCC history + other signals when no hard number) | Simon | 2026-07-15 (he said "tomorrow") |
| 5 | Build **private-company revenue estimation** into enrichment (EDGAR for public; employee-count→revenue ratio + other sources for private, even a broad range) | Simon/Alek | roadmap |
| 6 | Build **equipment inference** — from an award/permit/facility type, infer likely equipment purchases + range (racking, HVAC, forklifts, dock buildout, etc.) | Simon/Alek | roadmap |
| 7 | Notify Stauss on every big feature update so he re-tests | Simon | ongoing |

### What THEY Need to Do
| # | Action | Who | Due |
|---|--------|-----|-----|
| 1 | **Start using the V1 daily**, cross-reference prospects against VFI's database, send feedback as it flows | Stauss | starting 2026-07-14 |
| 2 | Send feedback via WhatsApp/email as things come to mind | Stauss | ongoing |
| 3 | Think through **pricing** — sector tiering objection, per-seat model, money-back-guarantee window for different lender sizes | Stauss | ongoing |
| 4 | Think about **where to source private-company revenue estimates** (he's found it "in weird ways" before) | Stauss | ongoing |

### What They're Expecting From Us
The customized V1 login, today. Then a steady stream of feature updates to react to. He's ready to work — "I'll start using it today."

### Open Questions Before Next Contact
- Does the V1 actually surface prospects Stauss finds worth working once he cross-references his DB? (his stated first test)
- Pricing model is still **completely unresolved** — sector-tiering was rejected, per-seat floated, money-back-guarantee endorsed but no number/agreement. No price has been agreed in 7 calls.
- Still no design-partner terms, no money, no signed agreement.

## Call Summary
First call against the **live, customized V1** — Simon walks the slimmed-down sourcing UI (prospect list, signal score, evidence trail, save-list → enrichment flow) and hands over a login at the end. The bulk of the call is a **two-way pricing/positioning workshop** (Alek pitching sector-based tiering; Stauss rejecting it and reframing toward per-seat + quality-not-quantity + "team member, not SaaS") plus a **dense product-feedback stream** (revenue estimation, ticket-size estimation, equipment inference, UCC-competitor surfacing). Timeline firmed: product "ready this month/August," target launch right after Labor Day.

## Momentum
→ **Flat-to-slightly-up** — the gating deliverable (V1 login) finally ships and Stauss starts using it today, which is real progress on the feedback loop. But commercially it's the 7th call with no price agreed, no terms papered, no money, and no independent buyer advanced. The product got more real; the sale did not move.

## Key Intelligence / What Changed
1. **Sector-based pricing is dead on arrival for diversified lenders.** Stauss rejected the $1,500/sector model outright — "we're sector and asset-class agnostic… puts too many limitations on me wanting to buy." It only works as a *discount hook* for single-sector lenders (rolling-stock-only, healthcare-only). His counter-frame: price against **seats / dedicated agents for top performers**, or against **an FTE salary** ($70K/yr base for a new originator), not against sectors or lead-count.
2. **"Quality not quantity" is the pricing spine he keeps returning to.** "You're not guaranteeing quantity, you're guaranteeing quality… 10 leads where you convert 70–80%, not 100 where you convert 10%." This resolves Alek's "we can't guarantee lead volume" objection — reframe the guarantee around *fit*, and anchor on replacing a bird-dog/BDA headcount ("a BDA, but faster/better/cheaper"), not on volume.
3. **Money-back guarantee endorsed, but 30 days is too short.** Stauss: for VFI-scale, **six months less setup/hosting costs** ("you can't lose money"); a 30/60/90-day works only for small-ticket shops. He's far more willing to risk ~$1,000 over six months with a guarantee than take 30 days free — because 30 days "won't prove out any funnel metrics." Deal-cycle length is the reason: he needs to see a lead go all the way to *funded* to judge ROI.
4. **Capital-utilization is NOT the pain (Simon's hypothesis, tested and falsified).** Simon probed whether an under-utilized credit line = money lost. Stauss: **no** — lenders are only charged once they draw down and fund, so an idle line isn't a running cost. The real executive pain is **wasted salary on non-producing reps** ("what'd you do the past three months… zero production"). That, not capital drag, is the ROI story to sell against.
5. **The build direction is confirmed sourcing-only, and the moat spec deepened** — Stauss's top three feature asks (private-company revenue estimation, equipment inference from awards/permits, UCC-competitor surfacing) are all **second-order reasoning on public data**, consistent with the 7/8 "codified waterfall = the moat" read. He again drew the core-vs-upsell line himself: sourcing intelligence = core; revenue/UCC-competitor/equipment-project data = paid add-ons to rank later.
6. **"Redefine, not enhance" repeated a 2nd straight call** — "this is a teammate, redefining how you work, not an enhancement… not a ZoomInfo/D&B/Sales-Nav that enhances your reps." His stable buying thesis; keep using his language.
7. **Crypto did NOT resurface (3rd straight call).** Confirm closed.
8. **EF macro turning (his read):** first-half capex growth was concentrated in hyperscalers (Amazon/Meta facilities); core middle market — "two-thirds of the economy in the space" — was in wait-and-see, now "picking up." Reinforces his Labor-Day launch timing.

## Firm-Direct: Pipeline Analysis

**Pain evidence (real vs. vitamin):**
- **Painkiller (executive-level):** wasted base salary on non-producing reps — quantified, felt, and the ROI frame he endorses ($70K/yr FTE, 6-month production-or-terminate rule, revolving door). This is the buy trigger.
- **Painkiller (rep-level):** cold-calling in the dark — 120–150 calls/day, 10–15 connects, "circle of doom" follow-ups, 25 calls over 6 months to reach one CFO. The agent eliminates 50–70% of this.
- **Vitamin/deferred:** capital-utilization drag — Stauss explicitly says it's *not* a real cost driver. Do not build the ROI pitch on it.

**Objections table:**
| Objection (quote) | Type | How handled | Effect (1–5) | Better response if <4 |
|---|---|---|---|---|
| "One sector… puts too many limitations on me wanting to buy" | Pricing/packaging | Alek explained the volume-guarantee problem behind it; Stauss reframed to per-seat | 3 | Drop sector-tiering as the default; lead with the **per-seat / replace-a-BDA** frame Stauss handed us. Reserve sector as a discount hook for single-vertical lenders only. |
| "30 days is not long enough… won't prove out funnel metrics" | Risk/terms | Simon floated 30-day; Stauss upgraded to 6-month-less-costs | 4 | Adopt his structure verbatim: 6-month money-back-less-setup/hosting for mid-market+, shorter for small-ticket. |
| "It's still reliant on someone else doing an action for me" (re: the competitor marketplace) | Competitive | Stauss self-answered — Quintel's real-time signals don't require a borrower to upload | 5 | None — he made our differentiation argument for us. Capture it as positioning. |

**Stakeholders / authority / budget / timeline:** Unchanged. Stauss is EVP-level origination — **door, not desk**; the economic buyer for a rep-tooling/sourcing platform still sits with him-as-exec OR ownership/CFO. He's now roleplaying *both* the rep-user and the exec-buyer. Budget: benchmarked to an FTE salary ($70K) and a BDA loaded cost, not yet a real committed number. Timeline: product-ready August, sell "right after Labor Day."

**Stage signal:** **Design-partner-in-motion but pre-commercial.** V1 in hand, daily usage starting, deep spec flowing — but zero papered terms and no agreed price after 7 calls. The relationship keeps producing *product* progress and withholding *commercial* progress.

## Simon's Performance

### Coaching Priorities
- **Tested a pain hypothesis and got a clean "no" — good — but didn't pivot the pricing conversation to the pain Stauss *did* name.** Simon spent real airtime on capital-utilization (falsified) while the live pricing debate (sector vs. seat vs. FTE) was happening in parallel. → **Better move:** when Stauss said "that's where this adds the most value" about **wasted rep salary**, close the loop out loud: *"So the number we should price against is the fully-loaded cost of a non-producing rep — call it $70K plus. If Quintel replaces even one BDA seat, what would you expect to pay per seat?"* Convert his ROI frame into a **price-discovery question** on the spot. Why it matters: 7 calls, still no price — he keeps handing us the anchor and we keep not asking for the number.
- **Took ~10 feature asks without closing on the 1–2 that ship in the *next* V1 iteration** (repeat of the 7/8 coaching note). Revenue-estimation, equipment-inference, UCC-competitor surfacing, score-reasoning all landed as "yes, roadmap." → **Better move:** *"Of everything you just listed, which one, if it were live when you log in Monday, would make you actually pull a prospect into your pipeline? I'll ship that first."* Force the priority ranking from the user instead of absorbing the whole wishlist.
- **Didn't initiate any commercial motion** — no design-partner terms tabled while Stauss is actively asking us to build for him and starting daily usage. This is the cheapest moment to paper something and it passed untouched again.

### What Worked
- **Clean, confident product walkthrough** — the slimmed sourcing UI, the evidence trail, and the save-list→enrichment flow landed well ("I like that a lot… already a strong fit"). Shipping a real, all-real-data product is doing the persuading.
- **Good discovery instinct** on the capital-utilization question — even though the hypothesis was wrong, asking it surfaced the *actual* buyer pain (wasted salary) in Stauss's own words. Falsifying a load-bearing assumption cheaply is a win.
- **Let Stauss make our competitive differentiation argument for us** (real-time signals vs. upload-dependent marketplace) by asking rather than pitching — the strongest positioning data in the call came unprompted.
