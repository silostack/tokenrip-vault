---
title: Quintel Homepage — Positioning & Messaging Spec
status: active
owner: Simon
type: positioning-spec
created: 2026-06-24
related:
  - bd/calls/quintel-sales-tear-sheet.md
  - bd/calls/transcripts/mike-ryan-2026-06-22.md
  - bd/calls/transcripts/katharine-rudzitis-2026-06-18.md
  - bd/deals/equipment-finance/stauss-vfi-tokenrip-briefing.md
  - active/quintel-site-mockup-v2-2026-06-24.html
---

# Quintel Homepage — Positioning & Messaging Spec

> **Purpose:** the messaging architecture for the lender-first Quintel homepage. It is the
> source of truth the revised mockup is built from, and it keeps the sales tear sheet in sync.
> Audience: internal (Simon/Alek). Every claim is keyed to the call evidence so nobody
> improvises a line that re-triggers a logged objection.

---

## 1. The problem with the current page

The draft sells the **commodity layer** — a raw signal feed, i.e. a news ticker. A ticker is
exactly what the two live lenders already have and dismiss:

- Mike (36th Street): *"everyone's fighting over the same info… are we all going to be chasing the same intel?"* (transcript:46, :72)
- Katharine (Empire): *"ZoomInfo… doesn't do a ton more than a big public press release that my Google alert could tell me."* (transcript:40)

And the hero ("Fund deals before your competition") is a **prediction/speed promise**, which
walks the buyer straight into the hit-rate interrogation that stalled Mike's call (he asked the
batting-average question 3× — transcript:108, tear sheet §2). The page also co-targets brokers,
reads as a CRM/"deal desk" to replace (Katharine: *"I don't need a new HubSpot"* — transcript:128),
and harps on a defensive AI-control message that answers a fear no buyer holds.

## 2. The spine

> **"The deal intelligence engine for equipment finance. It learns what you fund or who you place to, and reads every deal the way you would."**

> Updated 2026-06-25. Prior spine: *"It learns how you lend, then works your market like another
> originator on your desk."* Retired once brokers were confirmed a near-term buyer — its "how you
> lend" / "another originator" framing is lender-only and excludes brokers. The new spine moves from
> *teammate* to *infrastructure* (the engine) and is both-sides by construction. See §10-D for the
> full hero rationale.

One line carries every fix:

| Phrase | Does the work of |
|---|---|
| *deal intelligence engine* | the category claim (Bloomberg-style infrastructure, not a feature); leads with the moat, not automation |
| *for equipment finance* | vertical focus — the category we're defining |
| *learns* | the compounding loop = the moat (the one input Bloomberg can't claim) |
| *what you fund or who you place to* | both-sides by construction — a lender *funds*, a broker *places*; replaces the old lender-only "how you lend" |
| *reads every deal the way you would* | decision-support not autopilot; personalization (your book, not a generic model); a *read*, not a prediction → sidesteps the hit-rate trap |

## 3. Sell the three layers on top of the signal — never the signal

The signal is the cheap input (Apollo/ZoomInfo are tickers). The defensible product is the
three layers above it. Every section should be reducible to one of these.

1. **Inference** — 2nd/3rd-order, assembled from things others don't connect. Not "a permit was
   filed" (everyone sees that) but "this data-center announcement → these downstream companies
   need this equipment in 2–6 months." Both buyers probed exactly this; the answer that landed
   was *"inferred, deliberately — if it's announced, it's too late"* (Mike transcript:32; tear
   sheet §3🟢). **This is what makes it more than a ticker — lead the wide-box buyer here.**
2. **Matching** — the same signal, ranked to *how you actually lend*: ticket, asset class,
   history/EBITDA floors, geography, structure, relationships, and realized appetite. Two
   lenders → two different lists. (Replaces the thin "scored to your credit box" — see §4.)
3. **Compounding** — your funded *and declined* outcomes feed back; it sharpens on your book
   over time. Moat + switching cost + the answer to the Bloomberg paradox (§6).

## 4. "Credit box" is too thin — say "how you lend"

A credit box reads as a single threshold. The real object is a multi-variable, idiosyncratic
profile *plus relationships plus revealed preference*. Some lenders fund only equipment, some
only trucking, some only against companies past an EBITDA/history floor. The system captures the
tacit version — what you *actually* funded vs. passed — not just the written rule. Use **"how
you lend" / "your book" / "the way you actually fund deals,"** not "your credit box," in
prose. (The product's Credit-box screen can keep the literal rules; the marketing copy should
not reduce the value to them.)

## 5. Pillars: Source → Underwrite → Place (the full deal lifecycle, not just sourcing)

> Revised 2026-06-25. Naming history: Find → Decide → Run (stopped at deal creation, read as
> sourcing-only) → Find → Package → Place (restored the lost packaging layer) → **Source →
> Underwrite → Place** (current; adopts Alek's industry-native verbs from the original mockup).
> *Underwrite* is the headline keyword on step 2; *package* stays as what the step produces (the
> "credit-ready package" artifact). The scored read lives *inside* that package.

| Pillar | What it is | Why this verb (evidence) |
|---|---|---|
| **Source** | Surface + infer in-market borrowers *well before the deal is shopped*, ranked to how you lend. | Both calls lit up on sourcing; frame as inference+matching, not a race. "Source" is the industry-native verb (Alek's original). |
| **Underwrite** | Pull the messy deal together (forwarded emails, attachments, pasted text), spread the financials, and assemble a clean, **scored** package in the credit team's format. | The lost layer (Simon, 2026-06-25). The package is the shippable artifact the credit team underwrites — and it matters even for a BD-only lender (Mike, who hands off to credit) because the package is what gets shipped, and it's lender-specific. *Underwrite* is the keyword we need to own; *package* names the output. |
| **Place** | Route the finished package to whoever decides — **your own credit team, or the lenders most likely to fund it** — then track to close and sync the CRM. | Lender-first ("your credit team") with the broker / overflow / syndication case second. Empire does syndication; Mike hands to a BlackRock IC. |

**Why "Place" is back** (it was demoted before): the earlier demotion treated "match the right
lender" as broker-only. The reconciliation (§5a) makes it dual — routing to the *internal* credit
team (lender) and routing to *external* lenders (broker) are the same verb pointed at a different
decider. Leading with "your own credit team" stops a direct lender reading it as a broker tool.

## 5a. One engine, N boxes — the broker/lender reconciliation

Quintel is one engine that runs a deal *signal → package → decision*. The lender/broker difference
is just **how many credit boxes it's matching to**: a lender points it at **one box (their own)**;
a broker points it at **many (their lender panel)**. Packaging serves both (a lender packages for
their own credit team; a broker packages for the lenders they submit to), and it learns from every
decision — your own fund/decline **and your lenders' yes/no-and-why** (§8). Same machine, different
number of boxes. This dissolves the old workflow-identity tension without making a lender feel
they're holding a broker tool: lenders stay primary (hero + how-it-works), brokers return as a
first-class "Who it's for" card framed by one-box-vs-many.

## 6. The Bloomberg paradox → why we don't need exclusivity

A tool everyone has seems to erase any edge, yet Bloomberg is universal and thrives. Why, and
what it means for us:

- **It's infrastructure, not alpha.** Bloomberg never promises "you'll beat the other trader";
  it promises "this is how the job is done — you're still the edge." → Stop promising "deals
  before your competition" (an alpha promise that erodes and invites "for how long? what's the
  hit rate?"). Promise the **modern originator's cockpit**; the edge is the operator.
- **Lock-in is the loop, not secrecy.** Switching means amnesia — six months in it knows your
  book better than any new entrant (tear sheet §3🟡).
- **Personalization breaks zero-sum.** Output differs per customer, so "everyone has it = no
  edge" is even weaker for us than for Bloomberg.
- **Loss-aversion is the real trigger.** Nobody buys Bloomberg to get ahead; they buy it to not
  operate blind. "Your competitors are tooling up" beats "get an edge" and dodges the hit-rate
  question.

**Conclusion:** exclusivity is a **premium tier for the paranoid**, never the core promise.
Kill "one company per buy box" everywhere (double-promised, unworkable for wide boxes — tear
sheet §5 ⚠️). This is the *reason*, not just the fix.

**Caveat (wide-box buyers):** for Mike (industry-agnostic), personalization is weak — almost
everything is in his box, so "your list is different" reassures less (tear sheet 6b). For him,
carry **leverage + inference + time-in-market**, not personalization. The page must serve both:
"learns how you lend" lands for Empire; "do the work of 20 / never miss" lands for Mike.

## 7. Co-pilot/autopilot → decision support

Cut the strawman. "Never funds, never approves, never sends on its own" answers a fear no buyer
holds — nobody handed credit authority to the bot. Repeating it makes the product sound *less*
capable and reads as groveling.

- **Cut:** the "AI won't act on its own" repetition (×3 in the draft band).
- **Keep, reframed as positive:** auditability and defensibility — *real* for committees and
  regulators. "Every score has ranked reasons and source citations; every decision is documented
  and defensible." Category = **decision support** (a respected term in regulated finance:
  clinical/credit decision support). Signals "makes experts sharper," not "autonomous robot."
- **Retain one quiet line** — "your team makes every call, fully logged" — *only* because it
  helps the champion sell up to an AI-skeptic board (Mike's 50–60yo principals, transcript:104).
  Not a hero pillar.

## 8. How it learns (own section — Simon's add)

The loop learns from **declines as much as funds.** "We can't fund this because X" is a *richer*
training signal than a funded deal — it traces the exact boundary of the box (the credit
judgment / imprint = the moat material, briefing §6/§9). Copy beats:

- Every decision teaches it — your *no, because…* as much as your *yes*.
- It stops surfacing what you'd pass on and sharpens on what you'd fund. Leverage compounds.
- This is also the honest answer to *"won't the leads dry up / go stale?"* (Mike, transcript:104,
  handled well, tear sheet §3🟢): every interaction recalibrates — it doesn't decay, it tightens.
- Reinforces "another originator": a good junior learns from your declines, not just your wins.
- **Both sides feed it (added 2026-06-25, for the broker case / §5a):** a lender's own fund/decline,
  *and* the answers their **lenders** give when a placed deal passes ("a lender's no, and the reason,
  retunes who you submit to next"). Your decisions and your lenders' both make it smarter. This is the
  broker-side learning input — same loop, more boxes — and it's true for lenders who place overflow
  or syndicate too.

## 9. Security — trim hard

Replace the TLS/AES/SSO + PIPEDA/Law 25/FINTRAC block (procurement-questionnaire detail that
reads as trying too hard) with a **confidence strip** + a linked Security page:

> Enterprise-grade security · SOC 2 in progress · your data stays yours — we never train
> third-party models on it.

**Drop Canada** (live ICP reads US — BlackRock JV, Arena-backed). **Drop the law citations.**
Detail belongs in the DPA and the sales conversation, not the homepage.

## 10. Hero — candidates + recommendation

Frame the hero as intelligence/decision (inference + matching + learning), never a prediction/race
promise. Sourcing is the hook *inside* "How it works," not the hero claim. (A/B/C below are the
candidate history; **D is the chosen, shipped hero** — see the decision note.)

**A — "Another originator" (leverage / teammate)**
> Eyebrow: AI deal desk for equipment finance
> H1: **Add an originator to your desk, not a headcount.**
> Sub: Quintel learns how you lend — what you fund and why — then works your whole market in the
> background: surfacing the deals that fit, sizing each one up against your book, and keeping
> every file moving. Your team makes the calls.

**B — "Learns how you lend" (matching / compounding)**
> H1: **The market, filtered to how you actually lend.**
> Sub: Tell Quintel your book. It watches the public record, catches deals taking shape before
> they're announced, and ranks them by how you actually fund. The more you close, the sharper it
> gets. Your team makes the calls.

**C — "Don't fall behind" (loss-aversion / cockpit)**
> H1: **Stop grinding lists. Start working deals.**
> Sub: Your competitors are tooling up. Quintel puts the modern originator's cockpit on your desk
> — every in-box deal surfaced and inferred before it's public, ranked to how you lend, and
> tracked to close. You're still the edge.

**D — "Deal intelligence engine" (Bloomberg-aligned) — CHOSEN, shipped in v3 (2026-06-25)**
> Eyebrow: Deal intelligence for equipment finance
> H1: **The whole market, focused on the deals you'd actually do.**
> Sub: Power your decisions with the public record, your own book, and everything you've closed,
> fused into one ranked, decision-ready read on every deal. For lenders and brokers alike.

**Why D supersedes A/B/C (2026-06-25):** brokers are now confirmed a **near-term** buyer, not a
someday-ICP, so the hero must not exclude them. A's leverage axis is broker-neutral but sounds like
generic AI-SDR automation (it buries the moat); B's matching axis ("how you lend") *actively excludes*
brokers (a broker places, doesn't lend); C re-opens the hit-rate trap. The **intelligence axis** is the
only one that is simultaneously (a) **both-sides by construction** — "your needs" abstracts over a
lender's box *and* a broker's panel; (b) **moat-forward** — leads with inference/decision, not
automation; and (c) **category-defining**, mirroring Bloomberg's own hero ("Power your decision-making
with [data/news/research/analytics], all from one fully integrated solution"). It also lands Katharine's
literal stated want (an "intelligence layer over HubSpot"), and it out-positions Bloomberg via the one
input Bloomberg lacks — *what you've closed* (the learning loop).

**Make-or-break discipline:** name the formula concretely — **public record + your book + closed deals →
one decision-ready read** — never the word "intelligence" alone, or the hero collapses into buzzword /
ticker and re-triggers §1. (Also: don't open on "coverage" the way Bloomberg's §1 does — it
re-commoditizes.)

**Downstream consistency (all shipped in v3):** the axis shifts the spine from teammate ("another
originator") to infrastructure ("the engine") — compatible, since the engine is what learns. Updated to
match: footer tagline + §2 spine (both-sides: "learns what you fund or who you place to"), security H2
("Built for regulated finance"), and the orphaned decision-support card header ("Built on your real
track record", was "how you actually lend"). v2 still carries hero A as the leverage-axis fallback.

**Hero trust line** (shipped): *Ranked reasons on every call · Sharper every deal you close · Syncs
with your CRM.*

**Hero card:** keep the concrete surfaced-deal card (it shows, doesn't tell).

## 11. Proof + de-risking (the forward/board moment)

Page job = both, **weighted to the forward/board moment** (Katharine circulating internally;
Mike's board). So credibility and de-risking outrank conversion poetry.

- **Backtested case studies** — the mechanism-demonstration answer to the hit-rate question.
  Empire set already published (tear sheet §6: Capital Aggregates, Revere←Eos, NineDot, Tangent).
  Add a proof strip linking these. Frame as *"these signals were public on these dates; your
  stack didn't assemble them"* — never *"we would have caught it"* (tear sheet §6a framing rule).
- **De-risking** — design-partner framing + refundable pilot ($10k setup refundable, tear sheet
  §3/§4). Turns newness into leverage for the board ("less risky than a $110k hire who may wash
  out in 6 months" — Mike's own math, transcript:68).

## 12. Do / Don't (keyed to the tear sheet objection bank)

**Don't**
- ❌ Promise prediction accuracy / "before your competition" in the hero → hit-rate trap (§2).
- ❌ Say "one company per buy box" anywhere → double-promised, unworkable (§5 ⚠️).
- ❌ Repeat "the AI won't act on its own" → strawman (§7).
- ❌ Lean on public-filing visibility for the wide-box buyer → box-match proves nothing to Mike
  (§6 / tear sheet 6b); lean on inference/3rd-order instead.
- ❌ Position as a CRM/"deal desk to live in" → Katharine pre-empted it ("I don't need a new
  HubSpot"). Always "layer on top + syncs to your CRM."

**Do**
- ✅ Sell inference / matching / compounding; the signal is just the input.
- ✅ "How you lend / your book," not "your credit box."
- ✅ Decision support — ranked reasons + citations + defensible.
- ✅ Lender-first; brokers a secondary "also," placement a sub-feature.
- ✅ Loss-aversion + cockpit framing; exclusivity only as a premium tier.
- ✅ Backtested proof + refundable-pilot/design-partner de-risking for the forward moment.

## 13. Verification

- Walk every line against §12 — does it invite hit-rate, exclusivity, or broker-tool reads?
- Read as Mike (wide-box, BD-only, AI-skeptic board) and Katharine (narrow-box, intelligence-
  layer-over-HubSpot): each must see themselves and not the other's tool.
- Confirm no section sells the raw signal alone.
