# Stauss Paulos Call — 2026-07-21 (firm-direct / product feedback)

*8th direct call. ~20 min, cut short (his 3pm; Alek absent). First session against **one week of real daily usage** of the live V1.*

---

## Follow-Up Actions

### What WE Need to Do
| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | **Replenish enrichment credits** — silent enrichment failures are corrupting his save→verify loop *right now* | Simon | 2026-07-21 (today) |
| 2 | Fix the **score inversion bug** (Prospects score ≠ Saved score; Saved reads lower) | Simon | before next call |
| 3 | Ship a **revenue floor / buy-box threshold into the score** (or an explicit "below your minimum" flag) — the #1 ask | Simon | next build |
| 4 | Enable **sort/filter in the Saved view** (currently dead) + add **search** + **saved-at timestamp** column | Simon | next build |
| 5 | Add **sort/filter on Signal and Trigger** columns in Prospects (ticket size already works) | Simon | next build |
| 6 | Add a **geography filter** (continental US / all USA / USA + territories) | Simon | next build |
| 7 | Make **pagination discoverable** (he missed 14 of 15 pages for his first few sessions) | Simon | next build |
| 8 | **Force Stauss to rank his asks** — "which one makes you pull a prospect into pipeline Monday?" | Simon | next call |
| 9 | Book the **full hour** he asked for (tomorrow AM/PM) | Simon | 2026-07-22 |
| 10 | Full compiled bug/feature list filed → [[product/quintel/quintel-stauss-product-notes]] | Simon | ✅ done |

### What THEY Need to Do
| # | Action | Who | Due |
|---|--------|-----|-----|
| 1 | Keep working the list; report the "ton of positives" he didn't get to | Stauss | next call |
| 2 | Follow up on **HK Contractors** (April Moss) — already routed to one of his reps | Stauss's rep | in flight |
| 3 | Work **Virginia specialty trade contractors** (750 employees, $12M need) — "the deal I'm gonna go after hard" | Stauss | in flight |
| 4 | Confirm the **Stronghold Engineering vs. Stronghold Power Systems** entity relationship from his Salesforce (free ground-truth for the rollup feature) | Stauss | next call |

### What They're Expecting From Us
A **rebooked one-hour call** (he asked to grab the time on the spot) and **visible fixes** on the annoyances — specifically the revenue floor, the Saved-view filters, and the score bug Simon acknowledged live. He is calibrating whether feedback → shipped change, which is the loop that keeps a design partner engaged.

### Open Questions Before Next Contact
- **Which 2 features actually change his Monday behavior?** He gave ~18 asks in 20 minutes and ranked none. Unranked feedback is a wish list, not a spec.
- **Does the revenue floor belong in the score, or as a hard filter + flag?** He asked for both ("lower score" *and* "flag it") — they're different products. Scoring it down hides deals; flagging it keeps them visible with a warning. His own near-miss argument ("13M might really be 26M") argues for **flag + secondary tier**, not score suppression.
- **Is the estimated-revenue number good enough to gate on at all?** He says private-company revenue data is "wildly off" (D&B: $17M reported vs. $70M actual) — and now wants us to *filter on that same unreliable field*. Ask directly: do you want to be gated by a number you don't trust?
- **Where did the two live prospects come from?** Which signal/trigger produced HK Contractors and Virginia Specialty Trade? That's the first real attribution data we've ever had — mine it before it's forgotten.
- **Untouched for an 8th call:** his working arrangement/comp (#60) and the sell-side price (#58).

---

## Call Summary

First working session after a week of Stauss actually using the live V1 daily — the feedback loop we've been trying to start since 2026-07-08 is now running. He screen-shared and narrated his real workflow end to end, producing the densest, most concrete product-feedback stream of the entire relationship: ~6 bugs and ~12 feature asks in 20 minutes. **Two prospects from the tool entered his real pipeline** — HK Contractors (routed to one of his own reps, who is following up) and a Virginia specialty trade contractor ("this is my deal right here, I'm gonna go after hard"). Nothing commercial was raised by either side. Call was cut short; he asked to rebook a full hour and "grab the time right now."

---

## Momentum

**↑ Advancing** — the product moved from demo to daily tool and produced its first real pipeline actions inside VFI; but for the 8th consecutive call, zero commercial motion (no price, no papered arrangement).

---

## Key Intelligence / What Changed

**1. The product produced real pipeline action — the first hard evidence it works.**
Not "this looks good." Two concrete outputs: *"This is one that I sent one of my guys and they're following up"* (HK Contractors), and *"This is the deal that I'm gonna go after hard, because it's good size and it looks like a great company"* (Virginia specialty trade contractors, 750 employees, $12M need). Across seven prior calls every buyer signal was Stauss roleplaying; this is Stauss *behaving*. **This is also the live test of Load-Bearing Assumption #1 (can we codify the waterfall reasoning) — and the first read is positive.** Ask which signals produced these two before the attribution is lost.

**2. The box score is not keyed to the buy box — the core product claim is failing on its own terms.**
*"The stuff that's scoring lower seems to be a stronger fit for me personally rather than the stuff that's scoring higher."* A construction company scored **92** with $2.6M estimated revenue against his **$20M floor**; the two prospects he actually pursued scored **58** and **56**. Quintel's stated primitive is entity resolution + **box-scoring** + a per-item "why" (CLAUDE.md). If the score inversely correlates with fit for the one user we have, the box-scoring layer is currently scoring *asset-class/equipment-finance fit* and calling it *buy-box fit*. This is not a feature request — **it is the central claim of the product, unvalidated.** Fixing it is the highest-leverage item on the list by a wide margin.

**3. Corporate structure / parent rollup is a genuine data-model gap, and Stauss produced two live proofs of it in one call.**
*Stronghold Engineering* (in the tool, 41M revenue, strong fit) vs. *Stronghold Power Systems* (the entity VFI actually papered the deal with — both exist as separate Salesforce accounts). And *April Moss, "multi-company controller"* at HK Contractors — a title he read live as evidence of a topco with 7–10 sibling entities. Simon acknowledged: *"our data model doesn't account for that kind of sub-operating entity."* Consequence: **single-entity revenue estimates systematically under-size roll-up borrowers**, which is exactly the population Stauss says gets wrongly disqualified ($17M reported vs. $70M actual). The revenue-floor feature and the rollup feature are the same problem — **shipping the floor without the rollup will filter out good deals faster than it filters out bad ones.** Flag that to him.

**4. Unprompted confirmation that the current results are a strong small-ticket product.**
*"For a small-ticket equipment lender, these are strong… you're kind of giving them immediate deal flow."* He explicitly asked us to keep the buy-box config **templated per lender tier** so a smaller lender gets value from the same engine with different thresholds. Strategically useful: the "wrong" results for VFI are the *right* results for a segment we already have named targets in — and it reframes the revenue floor as **buy-box parameterization**, not a VFI-specific fix. Build it as config, not as a hardcoded floor.

**5. Data-trust erosion is the quiet risk.**
MacMillan Inc listed as Arizona heavy-civil; he could find no matching Arizona company on LinkedIn and *"start[ed] questioning it."* Combined with the silent enrichment failures (out of credits) and the score bug, the product is currently teaching its only user to distrust its outputs. **Credits are a same-day fix and should not wait for the next build.**

---

## Firm-Direct: Pain Evidence + Stage Signal

**Pain evidence (observed, not claimed):** the save→click→wait-for-enrich→remove loop. He described it as *"getting annoying"* — he is doing manual verification work the product was supposed to eliminate, at volume, across 15 pages. That is real friction on a real workflow, not a hypothetical. Painkiller-grade *for the sourcing job*; the question of whether a lender pays software prices for it is still open (Assumption #0).

**Objections:** none raised — this was not a selling call. Notably Stauss himself pre-empted the negative read: *"a ton of positives so far for sure… a lot of what we're doing here is working, it's just to keep honing it in."*

**Stage signal:** **Design-partner-in-use, pre-commercial.** The product is embedded in his daily workflow and generating pipeline for VFI. Everything needed to open a commercial conversation is now true — a working product, daily use, demonstrated output, an engaged champion — and none of it has been used. **Eight calls, zero papered anything.** The gap is no longer a product gap; it is entirely a founder-motion gap.

**Full bug/feature compilation:** [[product/quintel/quintel-stauss-product-notes]]

---

## Simon's Performance

### Coaching Priorities

**1. Eighteen asks, zero ranked — the same miss for the third straight call.**
Stauss delivered ~6 bugs and ~12 features in 20 minutes and Simon received all of them ("gotcha," "good to know," "super helpful") without forcing a priority. This is now a documented pattern (7/08: ~15 asks; 7/14: ~10 asks; 7/21: ~18 asks).
→ **Better language:** *"Stop me — of everything you just showed me, which ONE fix makes you pull more prospects into your pipeline next Monday? I'm building that this week and nothing else until it's done."*
→ Why it matters: an unranked list means *we* pick, which means we guess, which means the next build may not move his behavior — and behavior change is the only evidence we have that the product works.

**2. The two live prospects went by without a single follow-up question.**
Stauss said *"I sent this to one of my guys"* and *"this is the deal I'm gonna go after hard"* — the first behavioral proof in eight calls that the product produces value — and the conversation moved on to LinkedIn links. This was the moment to mine attribution and to convert proof into commerce.
→ **Better language:** *"Hold on — that's the first deal Quintel has put into VFI's pipeline. Which signal surfaced it? And if that one funds, what's it worth to VFI? Because that's the number we should be pricing against."*
→ Why it matters: it captures the attribution data we need for the moat *and* converts a demonstrated outcome into the price-discovery conversation that has now stalled for eight sessions (Commitments #58, #60).

**3. Did not name the revenue-floor / data-quality contradiction back to him.**
Stauss asked to gate on estimated revenue *and*, minutes later, explained that private-company revenue data is wildly unreliable ($17M vs. $70M) — the exact reason good deals get wrongly disqualified. Both went unchallenged.
→ **Better language:** *"You just told me revenue estimates are off by 3-4x on private companies, and now you want me to filter on that field. If I'd hidden everything under $20M last week, would you still have found the two deals you're working?"*
→ Why it matters: this is the CLAUDE.md convergence check applied live. Shipping a hard revenue floor on unreliable data is a *destructive*, hard-to-see failure — it removes deals silently. The answer to that question decides flag-vs-filter, which decides the build.

### What Worked

- **"Negatives are actually the more important thing to focus on"** — Stauss started softening toward the positives at the end and Simon actively redirected him back to the critique. Exactly right for a design-partner session; it protects the signal quality of the whole relationship.
- **Named the data-model gap honestly and immediately** — *"our data model doesn't account for that kind of sub-operating entity."* No defensiveness, no hand-waving. Stauss responded by expanding the spec ("if there's anything you can pull that's total corporate structure"), which is what candor buys with a domain partner.
- **Volunteered the score bug before Stauss diagnosed it** — Stauss was building a wrong theory ("I feel like that should have scored higher") and Simon cut it off with the real cause. Prevented a real defect from being mis-filed as a scoring-philosophy disagreement, which would have cost a full call to unwind.
- **Proposed search in the Saved view unprompted**, which pulled a better idea out of Stauss (saved-at timestamp + recency filter). Good instinct: propose a concrete solution, let the domain expert improve it.
