---
title: Quintel Lender Demo — Playbook for Alek (Katharine / Empire Asset Finance)
status: active
owner: Simon
audience: Alek (running the call)
type: demo-playbook
created: 2026-06-16
updated: 2026-06-18
call_date: ~2026-06-18
related:
  - bd/calls/contacts/katharine-rudzitis.md
  - product/quintel/quintel-demo-product-issues-2026-06-17.md
  - product/quintel/quintel-sourcing-page-gameplan-2026-06-18.md
  - product/quintel/quintel-sourcing-signals-prd-2026-06-16.md
  - product/quintel/quintel-lender-build-roadmap-2026-06-10.md
source_material: "Live walkthrough of the deployed product at quintel.ai (2026-06-17, every surface clicked) + Alek's earlier hands-on audit + Empire/Katharine web research"
---

# Quintel Lender Demo — Playbook for Alek

**The call (~2026-06-18) is a demo-led first meeting with Katharine Rudzitis, VP Direct Originations at Empire Asset Finance.** Goal: land Empire as a **design partner.** This doc is everything you need to prep and run it: who she is, what every screen is and why she cares, the click-by-click run of show, what to say, what to avoid, and how to handle objections.

> **Read this first, then do one full dry-run against the live site before the call.** The product is real and works — this is about driving it confidently and saying the right thing at each beat. Contact background: [[bd/calls/contacts/katharine-rudzitis]]. Engineering punch-list (separate, for Simon/eng): [[quintel-demo-product-issues-2026-06-17]].

---

## 1. The buyer — Katharine's lens (memorize this)

Everything you click and say is filtered through how she sees the world. Get this and the rest follows.

- **Her seat:** VP **Direct Originations** at Empire Asset Finance — a **$100M, Arena-backed ($4.6B parent) direct balance-sheet lender**, launched Sept 2025, "technology-driven," ~5 people. Writes **$3M–$50M** mid/large-ticket deals; capital/operating leases, loans, EFAs, sale-leasebacks. Borrowers: PE-sponsored, non-investment-grade middle market ($100M+ revenue, $10M+ EBITDA, audited financials).
- **Her background:** **~10 years at Macquarie** in asset/equipment finance (manufacturing, industrial, commodity, tech). She is sharp and institutional — **she will spot a non-equipment-finance deal in five seconds.** Do not show her anything that isn't shaped like a real EF deal.
- **Her mandate:** she was hired to **build Empire's direct-origination function** and tap her PE-sponsor relationships. At a 9-month-old fund with **$100M to deploy, deal flow is existential** — and her job is literally to *generate* it. So she cares about **both**: more right-shaped deal flow **and** faster, more consistent processing of what arrives.
- **Her day, today (mostly manual):** a deal arrives (from a PE sponsor, a debt advisor, or a broker) → she screens it against Empire's box → spreads the financials → picks a structure → packages it for the credit committee (Mike, the Chief Credit Officer, who is also a lawyer) → tracks it to funding. She just left Macquarie's infrastructure and is rebuilding all of this from scratch. **That greenfield pain is the opportunity.**
- **Her authority:** she is the **champion and the user — not the final signer** (Rick the CEO / Mike the CCO sign). So the demo's job is to **arm her to sell internally.** The committee memo *is* that ammunition.

**The one sentence the whole demo proves:** *"This is my desk — a deal goes from intake to a signed credit decision against my box, in minutes, every number sourced, and a person still signs."*

---

## 2. What Quintel is (your framing in one breath)

> **"Quintel is a credit desk for a direct lender. It reads every deal against your box and writes the underwrite — a person signs. And it can keep that desk fed: it sources deals against the same box."**

The **credit desk is the lead and the proof.** The **forward pipeline (sourcing) is the payoff** — how the desk stays full. It is **not** a marketplace or a placement tool — Empire never shops a deal to other lenders. Every sentence reinforces: **your box, your sheet, your read.**

### The four positioning rules (the spine — never drift from these)

1. **Your box, your sheet, your read.** It's Empire's credit policy, automated — not a black box.
2. **Credit desk first, sourcing second.** The desk proves it; sourcing shows how the desk gets fed.
3. **Human-in-the-loop.** "AI prepares, you decide. Nothing funds without a person signing." Say this often — it's how you defuse every risk objection.
4. **Deterministic, not generative guesswork.** The math (amortization, DSCR, residuals, your thresholds) is computed and repeatable. AI is used only to *read documents* at intake; your *rubric* makes the decision.

---

## 3. The product, part by part — what it is · why Katharine cares · how to show it

This is the heart of your prep. For each surface: what it is, the lens (why she cares), and how to present it.

### The Desk
- **What it is:** her landing page — the deals waiting for a credit decision, sorted by exposure (largest first). Two sections: "On your desk" (awaiting a decision) and "Recently underwritten."
- **Katharine's lens:** this is her morning. It's her pipeline, not a feed to shop. "Largest exposure first" is exactly how a balance-sheet lender triages.
- **How to show it:** "This is your desk — deals waiting for a credit decision, biggest exposure first. Not a feed to shop; your pipeline." Don't dwell — move to the hero deal.

### The Box (credit policy)
- **What it is:** Empire's underwriting policy made explicit and visible — the gates (no active bankruptcy/judgments, ticket $3M–$50M, global DSCR floor, time-in-business, revenue floor) plus geography and exclusions. **It's already configured to Empire.**
- **Katharine's lens:** every credit officer carries a "box" in their head or in a committee memo. Here it's *encoded* and applied **identically to every deal, every time.** This is the literal "underwrite to *your* box" promise, made visible.
- **How to show it:** click **Box.** "First, your policy — configured to Empire: ticket $3M to $50M, global DSCR floor, revenue floor, geography, exclusions. Every deal is screened and underwritten against this, the same way every time." Then: "and it's configuration — not a model guessing. As your committee's appetite changes, this changes." *(Note: in the current build the Box page is a read-only display — do not promise to edit a threshold live on screen. The live editing happens on the deal's terms, see Live re-underwrite.)*

### The Underwrite memo (the hero content)
- **What it is:** an examiner-grade committee memo, generated for a deal. It contains: **the desk's read (APPROVE / CAUTION / DECLINE)** with the reason; the four headline numbers (**deal DSCR, global DSCR, loan-to-cost, balloon coverage**); the deal summary; business cash flow; a month-by-month **collateral loan-to-OEC amortization** table that shows the **balloon is covered** by auction value; the **personal financial statement** (net worth, liquidity); a **global cash-flow** spread across three years + proforma; and the **Five Cs** (Capacity / Collateral / Capital / Conditions / Character) with strengths and mitigants.
- **Katharine's lens:** **this is the exact package she has to assemble by hand today to get Mike to sign.** It's the most valuable thing in the demo because it's her bottleneck *and* her internal-selling tool. An ex-Macquarie underwriter will read the loan-to-OEC table and the global-vs-deal DSCR and immediately recognize real craft.
- **How to show it:** walk it top to bottom, slowly. "Here's the why in four numbers" → cash flow ("the deal covers its own debt service, and the guarantor's global position carries it too") → collateral ("at the balloon, equipment value still covers the balance — that's the residual curve for the asset class") → PFS → the Five Cs ("this is the narrative a credit committee expects, with the figures behind it"). Land it: **"This is deterministic — same inputs, same answer, in well under a second. Your policy applied consistently, not a model guessing."**

### ★ Live re-underwrite (the single best moment — build the demo around it)
- **What it is:** on the underwrite screen, the right rail lets you **edit a structural term** (amortization years, rate, down payment, balloon) and click **Re-underwrite.** The memo recomputes live and the verdict can flip — a borderline deal moves **CAUTION → APPROVE** with a "was caution" note.
- **Katharine's lens:** this is the loop she lives in. "What if the borrower extends the term to lower annual debt service?" — answered instantly, and it tells her *why* it changed its mind. It proves the box is a *live model* of her policy, not a static report.
- **How to show it:** do it **slowly.** Open the borderline deal (Confluence Steel) → it reads **CAUTION** (global DSCR just under the target). "Say the borrower extends the term." Change **Amort 5 → 10** → **Re-underwrite** → it cross-fades to **APPROVE · was caution.** "Same deal, one structural lever, re-read instantly — and it tells you it changed its mind and why. That's your team's daily loop, made fast and auditable."

### Intake
- **What it is:** how a deal gets in. **+ Deal** opens a panel with three tabs — **Drop files**, **Paste email text**, **Paste link.** It classifies, extracts, and screens the input into a **draft against the box**, then drops it into a "needs input" tray where a person confirms every field before anything is underwritten. The processing shows a staged progress indicator (Reading documents → Extracting fields → Structuring → Screening against your box).
- **Katharine's lens:** this is the grunt work — spreading a new submission — turned into a reviewable draft in seconds, with a **human confirming** before it counts. Speed *plus* control.
- **How to show it:** **+ Deal → Paste email text →** paste the prepared email → narrate the staged progress → it lands as a screened draft. "By the time a deal hits your desk, it's already spread and screened — and a person confirms the extracted fields before it's underwritten." **Use the prepared/tested email only** (see §5 caution) — or frame it as "it pulls what it can and flags the rest for you to confirm; nothing is assumed."

### Sourcing — the forward pipeline (Act 3) — ⚠️ READ THIS SECTION TWICE

This is the screen that's easiest to fumble if you don't fully get it. Here it is in plain language. **Once you understand the chain below, the whole screen is obvious.**

#### First — what a "sponsor" is
A **"sponsor" is a private equity firm.** In equipment finance, "financial sponsor" is the standard term for a PE firm that owns a portfolio of companies (it "sponsored" the buyout). A **"sponsor-backed" / "PE-sponsored" borrower** = a company owned by a PE firm. **This is everyday vocabulary for Katharine** — Empire's target borrower is "PE-sponsor-backed middle market," and she was hired to **tap her PE-sponsor relationships.** The word is exactly right for her; it's just EF jargon we don't live in. **Do not dumb it down with her** — using "sponsor" correctly signals we speak her language.

#### Why you'd watch a sponsor (the logic)
A PE firm owns *many* portfolio companies, all run hard for growth — they acquire, expand, win contracts, refresh equipment. Every one of those moves can need equipment financing. So if you know which PE firms Katharine covers and monitor *all* their portfolio companies, you catch EF deals early — and she has a **warm way in, through the sponsor relationship.** That's the opposite of cold-sourcing random companies. **Sponsor-watching = "watch her relationships' portfolios, catch the deal the moment it forms."**

#### ⚠️ Sponsors are the LEAD LENS — not the whole engine (kill the "oh, that's it?" reaction)
**The trap:** if you present sourcing as *only* sponsor-watching, Katharine thinks "so you can watch my sponsors, that's it?" and caps the capability in her head. Don't let that happen. Sponsors are **one lens on a multi-source signal engine** — they're the lens we lead with because they map to *her* channel and they're the part competitors can't replicate, **but the engine watches every Tier-1 public source.** Think of it as two axes:

- **Sources (what we watch):** **SEC filings** (EDGAR — 8-Ks naming private counterparties, material agreements, capex disclosures); **federal contract awards** (USAspending — equipment-heavy awards → line-expansion capex); **UCC lien filings** (lien maturities → refi-timing windows); **regulatory forcing-functions** (EPA 2027, SHIPS Act, OBBBA §168(n) reshoring); **sponsor activity**; plus **grid/utility interconnection** and **building permits** for power & plant build-outs.
- **Lenses (how you point it):** by **sponsor** (her relationships — the default), by **sector**, by **trigger type**. Sponsors is the lens that matches how *she* originates; sector/trigger are there too.

**The constant across all of it: every lead is pre-scored to her box.** That's the through-line, not the source.

**Proof it's not just sponsors — and now it's visible on the page, not buried.** The Sourcing hero shows a **"sources watched" strip** (SEC filings · federal awards · UCC liens · regulatory · sponsor · grid/permits) and a **lens switcher (Sponsor · Sector · Trigger)**. Two concrete proof moves: (1) **flip the lens to Sector** — her own sectors light up (data centers, manufacturing, energy, healthcare); (2) **point at the expanded Signal log** — multiple sources side by side, e.g., the **USAspending federal award to Meridian Precision Works** *(nothing to do with a sponsor)* next to the EDGAR/sponsor path. "This one's a federal contract award implying a line expansion — no sponsor involved. Sponsors are just the lens that maps to your relationships."

**If she asks "so, just sponsors?":** *"No — that's the lens that fits your channel, so I led with it. See the switcher — you can point the same engine by sector or trigger. It watches SEC filings, federal awards, UCC liens, regulatory shifts, grid-interconnection requests. The constant is everything arrives pre-scored to your box."*

#### The chain the demo shows (memorize this)
1. **Brookford Capital Partners** = a PE firm (sponsor) Katharine would cover. Owns companies in digital infrastructure & energy.
2. **Larkspur Digital** = one of Brookford's portfolio companies — a private data-center (colo) developer.
3. A **public hyperscaler (Atlas Cloud)** signed a big anchor lease with Larkspur and disclosed it in an SEC **8-K filing**.
4. That lease forces Larkspur to **build out the data center** → it must finance site power, switchgear, cooling, gensets → **that's Empire's deal.**
5. So watching the *sponsor* (Brookford) surfaced a capex event at its *portfolio company* (Larkspur) — and the screen tells you how to win it: **"reach via Brookford Capital."**

#### Katharine's lens (why this beats every other sourcing pitch)
She runs *Direct Originations* at a fund with **$100M to deploy**, and her edge is **PE-sponsor relationships.** This points the engine at **her channel** and hands her **pre-qualified flow, not a list.** The differentiator isn't "we find you leads" (that's the Apollo/ZoomInfo commodity shrug) — it's **"leads pre-scored to the box you just watched me underwrite to, reachable through a sponsor you already know."** And the **cascade** (below) reframes sourcing as a **deal-sizing / whitespace tool** for a balance-sheet lender ("the $20M power phase inside a $200M project"), not a broker's lead-multiplier.

#### The screens, element by element (post-fix layout — so nothing on screen is a mystery)
> Assumes the sourcing-page updates in [[quintel-sourcing-page-gameplan-2026-06-18]] are deployed (sources strip, lens switcher, expanded multi-source signal log, regulatory strip).

**Screen 1 — the Sourcing landing page.** Top to bottom:
- **Hero** — frames it as your forward pipeline: the engine watches public triggers and you point it the way you originate.
- **"Sources watched" strip** — chips for each source type: **SEC filings · Federal awards · UCC liens · Regulatory · Sponsor activity · Grid/interconnection · Permits.** This is the breadth, visible up front. (Synthetic in the demo.)
- **Lens switcher: `Sponsor · Sector · Trigger`** — defaults to **Sponsor.** Switching changes the section below it. *This is the control that says "sponsors are one of several ways to point this."*
  - **Sponsor lens** (default): the **sponsor watchlist** + "add a sponsor."
    - **A sponsor card** ("Brookford Capital Partners (synthetic)") = one PE firm. `(synthetic)` = demo data. **"1 portfolio company monitored."** **"watching for deals $5M–$50M"** = the ticket band (set to Empire's). **Sector tags** = where the sponsor invests. **Orange "1 NEW CAPEX EVENT"** = a portfolio company just did something financeable; a quiet sponsor reads *"Quiet right now — no fresh capex triggers"* (Irongate, for contrast).
    - **"Add a sponsor to watch"** = the co-build: type a PE firm Katharine covers, live; honest on-screen caveat (*we won't fabricate an event on a name you just gave us*).
  - **Sector lens:** heat tiles for Empire's sectors (data centers, manufacturing, energy/utilities, healthcare, transportation), each with a signal count + Hot/Warm/Watch band.
  - **Trigger lens:** signals grouped by trigger type (capex 8-K · federal award · lien maturity/refi · regulatory · sponsor acquisition) with counts.
- **Regulatory forcing-functions strip** — tags for **EPA 2027 · SHIPS Act · OBBBA §168(n) reshoring.** Your "this demand is structural, not sentiment" proof.
- **Signal log (expanded)** — 5–6 Tier-1 triggers across **different sources** (EDGAR, USAspending, UCC, regulatory, sponsor), each with a **tier badge · source badge · band · provenance link · box-fit verdict.** Filterable by source/tier/band. *This is your multi-source proof — point at it.*

**Screen 2 — click a sponsor's capex event (or a Signal-log row)** → the lead + the cascade:
- **"WE DROP THE PUBLIC FILER, SURFACE THE PRIVATE LEAD"** — the public company that *filed* the SEC document (Atlas Cloud) is **struck out**; the **private** company named *inside* it (Larkspur) is **"YOUR LEAD."** Plain version: *"A public company's SEC filing named this private company as its counterparty — and the private one is the deal you can finance."*
- **"Next action · Run box-screen + reach via Brookford Capital"** = screen it against Empire's box; the warm path in is through the sponsor.
- **The CASCADE** — *"Larkspur hyperscale build-out · $28M–$62M · 2 of 5 phases in your box."* One project, **5 financeable equipment phases**, each with a size band, structures, and a box-fit tag:
  - **IN BOX** — fits Empire's box (site power & switchgear; cooling plant).
  - **OPEN TO BAND** — close, worth a look (gensets; compute & racks).
  - **OUT → routed** — outside an EF box, sent elsewhere (shell & interior → CRE/SBA). *A feature: the box has discipline — it refuses the real-estate slice instead of faking it as EF.*
- **"Open on desk"** on an in-box phase → opens that lead as a real **underwrite memo at APPROVE** — the same desk, the same memo from Act 1. The loop closes.

#### How to narrate it (script — post-fix)
1. **Open Sourcing. Gesture at the "sources watched" strip — lead with breadth.** "Your desk doesn't just read deals — it finds them. It watches every free public trigger that means a company's about to spend on equipment: SEC filings, federal contract awards, UCC liens, regulatory shifts, sponsor activity, even grid-interconnection requests for power projects."
2. **Gesture at the lens switcher.** "And you point it the way *you* originate — by sector, by trigger, or by your relationships."
3. **Quick breadth proof — flip to the Sector lens (or point at the Signal log).** "Here are your sectors lighting up — data centers, manufacturing, energy. And the raw feed: this one's an SEC filing, this one's a *federal contract award* with no sponsor attached, this one's a lien maturity. Same engine, every source, all scored to your box." *(This beat kills "is that it?" — and it's now native to the screen, not a workaround.)*
4. **Switch to the Sponsor lens — "but here's the one that's your edge."** Point at **Brookford (lit)** vs **Irongate (quiet)**. "Brookford just lit up — one of its portfolio companies made a move."
5. **Co-build beat:** in "Add a sponsor," type a sponsor *she names* → add it. "Your sponsors, your criteria. I'm not fabricating an event on a name you just gave me; it shows up when their filings move."
6. **Click Brookford's event.** "A public hyperscaler's SEC filing named a *private* colo developer — Larkspur — as its counterparty. We drop the public name you can't bank and surface the private lead you can. You'd reach it through Brookford — a sponsor you already know."
7. **Scroll to the cascade.** "One lease isn't one deal — it's a build-out. We break it into financeable phases and pre-screen each against your box: site power and cooling are *in*, gensets and compute are *close*, the shell we route out to CRE. You only see the ones worth your time."
8. **Open on desk → Larkspur APPROVE.** "Sourced against your box, pre-scored, and it opens as a finished underwrite. **That's the desk feeding itself** — pointed at the deals worth touching, which is the whole game when you've got $100M to deploy."

---

## 4. Run of show (~20 min, 4 acts)

**The deals you'll drive** (all synthetic, shaped like Empire's book):

| Deal | Ticket | Asset | Role in the demo |
|---|---|---|---|
| **Granite Ridge Forging** | $11M | forging press line | **Act-1 hero memo** — a clean APPROVE to walk top-to-bottom |
| **Confluence Steel Fabricators** | $8M | plate processing line | **The ★ lever** — CAUTION → extend term → APPROVE |
| **Larkspur Digital Infrastructure** | $14M | data-center power & switchgear | **The Act-3 sourced deal** — Open-on-desk lands here at APPROVE |
| Northlight Imaging | $6M | MRI/CT suite | bench (a softer CAUTION if asked) |
| Cascade Logistics | $4.5M | telematics fleet | bench (clean fleet) |
| Ridgeway Haulage | $3.2M | used Class 8 tractors | bench (thin balance sheet — shows the box has teeth) |

### Act 0 — Frame (1 min)
Set the frame before clicking anything: *"You fund off your own balance sheet. The bottleneck isn't finding deals — it's underwriting them consistently and fast. Quintel is a credit desk: it spreads every deal against Empire's box and writes the committee memo. A person still signs — it prepares, you decide."*

### Act 1 — The underwrite (the hero, ~8 min)
1. **The desk:** "Your pipeline, biggest exposure first. Not a feed to shop." Optional thread to plant: "Most of these came to you. That top one — Larkspur — we found, against your box. I'll show you how at the end."
2. **The box:** click **Box.** Walk Empire's policy (§3).
3. **Granite Ridge → the memo:** open it, walk the APPROVE memo top to bottom (§3). Land "deterministic, instant, your policy applied consistently."
4. **★ The lever — Confluence Steel:** open it → **CAUTION** → change **Amort 5 → 10** → **Re-underwrite** → **APPROVE · was caution.** Do this slowly. This is the moment.

### Act 2 — Intake (~3 min)
**+ Deal → Paste email text →** paste the prepared email → narrate the staged progress → screened draft. "Whatever comes in — email or PDF — gets spread and screened automatically, and a person confirms the fields." *(Use the tested email; see §5.)*

### Act 3 — Forward pipeline / Sourcing (~4 min)
**This is the screen to over-prep — full concept, every on-screen label, and the word-for-word script are in §3 ("READ THIS SECTION TWICE").** Short version: Sourcing tab → **gesture at the "sources watched" strip + lens switcher (lead with breadth) → flip to the Sector lens / point at the multi-source Signal log (this kills "is that it?")** → switch to the **Sponsor lens** (Brookford lit vs. Irongate quiet) → **add a sponsor she names (co-build)** → click the event → private-counterparty diagram (drop the public filer, surface the private lead) → cascade (one project → 5 phases, each pre-scored to her box) → **Open on desk → Larkspur APPROVE.** Close the loop: "That's the desk feeding itself — sourced against your box, pre-scored, opening as a finished underwrite." Speaks straight to the deploy-$100M pressure: **your team only touches deals worth touching.** Remember the one-liner: **a "sponsor" is a PE firm; it's the lens we lead with, but the engine watches every public source — SEC filings, federal awards, UCC liens, regulatory shifts — all scored to her box.**

### Act 4 — The ask (~3 min)
*"I'd like to make Empire our design partner. We tune the box and the memo to exactly how your committee thinks, and you get the desk shaped around your book."*
**Concrete next step:** *"Send me one real, redacted deal jacket. I'll run it through and show you the underwrite on your own paper."* *(Only offer the live-file run if the PDF path has been tested — see §5.)*

---

## 5. Pre-call setup + things to verify (do this before the call)

**Setup (10 min before):**
- Open **quintel.ai/login**, enter the shared access password **`quintel`**. **Never log in with a "vfi" account** — that one carries real competitor names. Confirm you land on **The desk** and see the **SAMPLE DATA** pill and today's date.
- Pre-open three tabs: **Granite Ridge** (hero memo), **Confluence Steel** (the lever), **Sourcing** (Act 3).
- Full-screen the browser, bump the zoom so the memo is legible on screen-share, close other tabs/noise.

**Verify (so nothing surprises you live):**
- **Confluence Steel** opens at (or can be set to) **CAUTION** so the lever lands. If it shows a stale "was approve" tag from a prior run, reload the page to clear it.
- **Larkspur** is **pre-underwritten to APPROVE** so "Open on desk" lands on the memo instantly. (If it shows "no credit memo yet," click "Underwrite this deal" once during setup so it's ready — or make it a deliberate "watch it underwrite live" beat.)
- **The intake email:** paste your prepared email once in setup and confirm it extracts the dollar figures. **The extractor does not reliably pull financials from an arbitrary email** — if your tested email comes back with $0s, either pre-load the draft or run Act 2 as the human-in-the-loop "it flags what it can't read for you to confirm" story. **Do not paste an untested email live.**
- **The live PDF path** is unverified. Only promise "send me a jacket and I'll run it live" if you've tested a redacted multi-page PDF end-to-end. Otherwise make it the *ask* (Act 4), not a live beat.
- **The Sourcing page reflects the multi-source updates** ([[quintel-sourcing-page-gameplan-2026-06-18]]): the "sources watched" strip, the **Sponsor · Sector · Trigger** lens switcher, the regulatory strip, and an expanded Signal log spanning EDGAR / USAspending / UCC / regulatory / sponsor. Confirm the lens switcher works and Irongate reads *"Quiet right now."* If a fix didn't land, fall back to the pre-fix narration (lead with the sponsor watchlist, then point at whatever multi-source signals are in the log).

---

## 6. Traps to avoid (steer around these live)

- **Don't open the "Run match" / "Lender decision" / lender-ranking view.** It ranks a panel of lenders "so you can place it" — that's *placement/broker* behavior, off-message for a direct lender. The names are synthetic, but the behavior is wrong for this story. The "Lender decision" link sits one click from the hero memo and the "Lender match" panel is on every deal detail — **scroll past them.** If she clicks one, see the objection table.
- **Don't show the structuring calculator as a headline.** On the deal-detail page it currently defaults to a placeholder ($500K cost / ~$8,853/mo) that doesn't match the deal's real ask — an ex-Macquarie eye catches that instantly. The *underwrite memo* carries the correct numbers; stay there. (Logged for eng to fix.)
- **Don't run a live PDF you haven't rehearsed.** Paste-email (tested) is the safe intake demo.
- **Don't claim a SOC 2 / security page you don't have.** Offer a one-pager instead.
- **The "Sample data" pill is intentional and your friend.** If she notices: *"These are illustrative deals shaped like your book — which is exactly why I want one real file from you."* Honesty sells here.
- **Competitor hygiene (load-bearing):** Empire's capital-markets desk trades with peer institutions, so Empire is effectively a **VFI competitor.** Everything on screen is **synthetic** — never show any real lender's box, criteria, or partners. Sell it as a feature: *"each lender's box and judgment stay siloed."*

---

## 7. Objection handling

| Objection | Response |
|-----------|----------|
| **"Is the AI making up the numbers?"** | "No. The underwrite is deterministic math against your thresholds. AI only *reads* the documents at intake; a human confirms every field. The decision is your rubric." |
| **"Can we change the box?"** | "Yes — it's configuration, not a model. We've set it to Empire. As your committee's appetite shifts, the box shifts, and everything re-underwrites against the new policy." *(Don't promise to edit it live on the Box screen in this build; the live recompute is on deal terms.)* |
| **"We're building this ourselves."** | "You know how long it takes to get spreading + box-config examiner-ready. Use us as your origination desk while your platform matures — or as the piece you'd rather not rebuild. Design-partner it with us." |
| **"We're the lender — we don't place deals."** | "Exactly — ignore the lender-shopping view. For you it's intake → spread → signed decision against your box, faster and consistent. A placement panel only matters if you ever syndicate or refer out-of-box paper." |
| **"Is this real or synthetic?"** | "Today's screen is sample data — that's exactly why I want one redacted file from you, to show it on a real Empire-shaped deal." |
| **"What about sale-leaseback / TRAC structures?"** | "On the roadmap. Today the memo handles loan amortization and balloons. I won't model an SLB live, but it's in your product set and on ours." |
| **"Where do our documents go / security?"** | "Human-in-the-loop, audit trail, adverse-action-ready, and we can run it in your environment under the appropriate data agreement. Be precise — don't overpromise." |
| **"How accurate is the extraction?"** | "Every extracted field is shown for human review before the deal is underwritten — the review tray is the control. It pulls what it can and flags the rest for you to confirm." |
| **"Who's behind this / how big are you?"** | "Founder-led, design-partner stage. Lead with the build; name relevant background honestly." |
| **"Pricing?"** | "Flat monthly desk retainer — no percentage of funded deals. Custom for a platform your size." Keep per-funded-deal economics off the table. |

---

## 8. If something breaks
- **Any screen slow or errors:** reload. The underwrite is instant and deterministic, so re-running is always safe.
- **Intake/extraction hiccups:** "the extraction seam is the one piece we wire to your stack" → pivot to the pre-loaded deals.
- **Login trouble:** it's the shared gate password (`quintel`); re-enter it (clear any browser-autofilled password first).
- **A deal in the wrong state:** open its underwrite and use **"Revert to seeded"** (appears after a re-underwrite), or reload the page.

---

## 9. The one strategic question to settle before walking in

**Desk vs. Software — which are we offering Empire?** Our prior validation (Bevel) wanted *done-for-you* (a desk/service). Empire is **"technology-driven" with its own engineers** and may want *software their team runs.* This changes the pitch, the pricing, and the ask — walk in knowing which one you're selling, and listen on the call for which one she wants. *(Diagnostic question to ask her: "9 months in — how are you handling intake and spreading today, and are you planning to build this in-house?")*

**Why Empire matters:** it's a clean, independent, well-timed, on-ICP direct lender with real budget and a champion whose literal job is the thing Quintel automates. A booked demo is a strong signal — but a reply is not validation. **The win condition for this call is: she becomes the champion, and we get a real redacted deal jacket to run against a draft of her box.**
