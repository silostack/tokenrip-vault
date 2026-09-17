---
status: draft v0.1
last_revised: 2026-09-17
owner: Simon (Alek builds lists; David labels)
serves: which intent signals get built, in what order, and how each one becomes a lead list David can call or an email trigger
tier: shareable with Alek. The hypothesis tables can be shown to David; the priors and the graveyard reasoning stay ours.
---

# Signals: the full spectrum, what is dead, what to test next, and how a signal becomes a list

## 1. The so what

Five batches and three hundred dials established that the pool is right (verified, in-box, reachable) and that intent is missing. Every intent signal tried so far was a *planned* event at the *entity* level (hiring, contracts, permits, lien timing), and for a two-to-seven-truck operator those do not exist in the record. The signals that plausibly do exist are the opposite shape: things that **happen to** the business (loss, failure, regulation, weather), things that happen to its **cohort** (county, lane, asset class), and things the owner **says** (a calculator, a reply, a mechanic). This doc lays out the whole spectrum, pre-registers the tests, and gives the protocol that turns a signal into a fifty-row list or an email trigger.

Two rules carried from the lab: no composite score until verdicts justify one (each signal is its own column), and doubt becomes a column, never a silent cut.

## 2. What a signal is, and the four jobs it can do

A signal is a dated fact about a company or its environment that moves the probability the owner will finance equipment in the next 90 days. Four jobs, scored separately (from the feed experiments in flpool):

| Job | Question it answers | Example |
|---|---|---|
| Discovery | is there a company here we did not have | a bid tabulation names a contractor absent from FMCSA |
| Timing | is *now* the moment | a crash last week; a FEMA declaration yesterday |
| Operating evidence | is this company alive and working | a permit pulled this month |
| Suppression | is this the wrong moment | financed six months ago (WI: reflexive rejection) |

Most of what follows is timing. Discovery is largely solved by the pool. Suppression is where the lab found its clearest negative (fresh liens).

## 3. The spectrum

Families grouped by mechanism. `ICP coverage` is whether the source actually records sub-15-employee operators. `Latency` is event to purchase. `Prior` is our honest probability that the family separates outcomes at n=50 reached.

### 3a. Planned events (the family that is mostly dead for this ICP)

| Signal | Mechanism | Source | Join | ICP coverage | Latency | Status | Prior |
|---|---|---|---|---|---|---|---|
| Public procurement: bid tabs, plan holders, awards | has work coming, needs iron | county/DOT portals, DemandStar, BidNet | name + city | low: 96% of FDOT bidders are large GCs | 1–6 mo | timing overlay only (flpool E9) | 0.2 for yellow iron, ~0 for service trucks |
| Permits: building, ROW, septic installer | active jobs | county portals; FL DOH OSTDS | name + county | medium for A_VAC installers | operating evidence, weak timing | scraper worth building for OSTDS | 0.3 (as evidence, not intent) |
| Hiring | growing | job boards | name | universal noise | n/a | **dead** | 0 |
| New DOT number / new authority | just started or expanded | FMCSA census, dated | USDOT | high | 0–6 mo | in Alek's HOT tag; 0 dead of HOT reached (n=2) | 0.5 |
| Fleet delta | bought units | FMCSA monthly snapshots | USDOT | high | already bought; predicts the *next* buy | needs two snapshots; not started | 0.4 |
| Expansion / new yard / contract won (local news) | growth | entity search | name | low | 1–3 mo | in HOT tag | 0.4 |

Read: the only planned-event tags that separated were the ones a small operator actually generates (new DOT, a visible expansion). Keep those; stop spending on the rest for service-truck lanes.

### 3b. Loss and failure events (the new family, entity level)

| Signal | Mechanism | Source | Join | ICP coverage | Latency | Status | Prior |
|---|---|---|---|---|---|---|---|
| **Crash, esp. tow-away or vehicle disabled** | totalled or badly damaged truck; insurer pays ACV, shortfall to the replacement gets financed | FMCSA MCMIS crash file (public, per USDOT, with severity fields); state crash portals | USDOT | **high**: exactly the FMCSA-registered population | 2–12 weeks | **not tested; data partly held (FMCSA census) and the crash file is a free download** | 0.5 |
| **Roadside inspection: vehicle out-of-service for a mechanical defect** | a unit that keeps failing is a unit about to be replaced; repeated OOS on the same VIN is strongest | FMCSA inspection file (public, per USDOT, per vehicle) | USDOT, VIN | high | 1–6 mo | not tested | 0.4 |
| Vehicle age from the inspection VIN | VIN decodes to model year; a 15-year-old vac truck with recent inspections is due | FMCSA inspection VINs + NHTSA VIN decoder | USDOT, VIN | high | continuous | not tested; cheap | 0.35 |
| Fire, theft, flood at the yard | total loss | local news, fire-department incident feeds, NICB theft reports (not public per entity), insurance (T4) | name + address | low in public data; **high via an insurance-agent partner** | 2–8 weeks | partner-dependent | 0.5 if reachable, reach is the problem |
| Equipment recall or emissions-system failure | forced repair or replacement | NHTSA recalls by VIN; CARB/EPA | VIN | medium | 1–3 mo | not tested | 0.25 |
| Tax lien, judgment, mechanic's lien | distress; sometimes a need for working capital rather than equipment | county records, SOS | name | medium | n/a | **suppression candidate** (underwriting), not intent | 0.1 as intent |

Read: the crash and inspection files are the one place the record captures what happens to a small carrier, because the reporting is regulatory, not journalistic. First test in §6.

### 3c. Cohort and environment events (county × lane, not the entity)

| Signal | Mechanism | Source | Join | Latency | Status | Prior |
|---|---|---|---|---|---|---|
| **FEMA disaster declaration** | debris, tree, roll-off, vac, hauling operators in the declared counties get months of work; the second truck is needed now | FEMA OpenFEMA API (declared counties, dates, incident type) | county + lane | 2–12 weeks | not tested; free API; joins to the pool by county today | 0.5 for tree/roll-off/vac lanes |
| **Emissions and equipment deadlines** | forced replacement of trucks by model year (CARB Clean Truck Check, Advanced Clean Fleets; state idling and DPF rules; EPA 2027 NOx) | regulator calendars | state + model year (from VIN) | months, dated | not tested; calendar is public | 0.4 in CA, lower elsewhere |
| Large local award (plant, data centre, highway package) | subcontractor demand in a radius | state EDC announcements, DOT lettings, local news | county | 3–12 mo | in flpool E9 as FDOT; re-read as cohort, not entity | 0.3 |
| Housing starts, building permits by county | dirt and concrete demand | Census BPS (monthly, county) | county + lane | 1–6 mo | not tested; free | 0.3 |
| Commodity and weather | oil price → oilfield service; early snow → plow; drought → water hauling; storm season → tree | EIA, NOAA | county + lane | weeks | not tested | 0.3, lane-specific |
| Interest-rate and tax calendar (Section 179 year end) | Q4 purchase rush | calendar | all | dated | not tested; **use as send timing, not selection** | 0.6 as timing |
| Competitor exit | a dissolved or bankrupt competitor in the same county and lane leaves capacity the survivors buy | SOS dissolutions, PACER, FMCSA revocations | county + lane | 1–6 mo | not tested | 0.3 |
| OEM promo lapse | captive borrowers re-enter the market when subsidised rates end | OEM promo calendars | asset class | quarterly | not tested | 0.2 |

Read: cohort signals never name the company. They rank the pool: when FEMA declares six Florida counties after a storm, every tree and roll-off operator in those counties moves to the top of the list for eight weeks. That is buildable today because the pool already carries county and lane.

### 3d. Turnover (the owner is already moving)

| Signal | Mechanism | Source | Join | Latency | Status | Prior |
|---|---|---|---|---|---|---|
| **Private-party listing of a specialty truck** | seller of the old truck is buyer of the new one | Commercial Truck Trader, Machinery Trader, Craigslist, TruckPaper (private-party filter) | seller name/phone → pool | 0–8 weeks | not tested; scrape one state | 0.5 |
| Auction consignment | fleet turnover | Ritchie Bros / IronPlanet sold and upcoming lots by region | region + asset | weeks | not tested | 0.3 |
| Dealer trade-in | the trade-in is sold to a smaller operator who needs financing (used-equipment buyer = sub-$100K ICP) | dealer inventory pages | vendor | weeks | vendor-side (T15) | 0.3 |
| UCC-3 termination | just paid off; capacity to borrow | state UCC feeds that carry terminations | name | 0–6 mo | flpool §11; needs a feed with terminations | 0.4 |

### 3e. Financial state (fit and suppression, not intent)

| Signal | Read | Status |
|---|---|---|
| Lien age / lapse / maturity | **dead as ranking** (FL vs WI did not replicate; lien-timing rows 11/11 dead when reached) | keep as a column |
| Filed < 6 months | **suppression**: just financed, reflexive rejection | hold; recontact at 24–48 mo |
| Captive or bank secured party | cheaper option; dead | exclude (enforced) |
| Borrowing experience (any EF lien) | underwriting requirement | required for call lists |

### 3f. Demand-side stated intent (the site)

| Signal | Mechanism | Source | Status | Prior |
|---|---|---|---|---|
| Calculator or quote request | the owner priced a replacement | site (`funnel.md` stage 2) | built with the site | 0.9 that a verified requester is real intent; the question is volume |
| Email reply text | he said it ("paying off in October," "we buy cash," "already with Cat") | outbound reply pipeline | after first sends | high, low volume |
| Site behaviour on equipment pages | researching a class | analytics, no PII | with the site | weak alone |

### 3g. Partner-observed intent (someone else sees it first)

| Partner | What they see | When | Status | Prior |
|---|---|---|---|---|
| **Service technician / repair shop** | the repair-or-replace decision; the failing unit; often names the replacement dealer | **before the vendor** | T19; ask David Saturday | 0.6 that shops see it; reach is the test |
| Insurance agent (commercial auto, inland marine) | the claim; the ACV shortfall | days after the loss | T4 | 0.6 / reach untested |
| Niche dealer without a captive | the quote request | at the vendor | T20; David's vendor sheet is the ICP map | David's data says high |
| Upfitter / body builder | the chassis order | at build | untested | 0.4 |
| Trade association | member is alive and paying | ambient | flpool second-tier pool | evidence, not intent |

## 4. Where the lab stands (so the priors are honest)

| Batch | Reached | Opens | Apps | What it taught |
|---|---|---|---|---|
| FL v2 | 31/50 | 9 | 0 | pool and reach work; LIEN/NOLIEN no effect on phone |
| OH (lender-first) | 27/50 | 5 | 0 | box filter predicts; lender-first alone is 54% off-box |
| WI | ~15/50 | 5 (callbacks) | 0 | box fixed; fresh liens reject; reach is the ceiling |
| FL 100 (blind intent) | 13 of first 50 | 1 | 0 | **event tags 0 dead of reached; lien-timing 11/11 dead** (HOT n=2) |
| CO 100 | partial | 2 | 0 | signal uniform; 21% were already David's customers |

Across ~100 reached humans: 0 applications. The only separation observed anywhere is the business-event tag. Everything below is designed to find more of that shape, cheaply, on data mostly already held.

## 5. Hypotheses, pre-registered

Each hypothesis names the test, the metric, the decision rule and the prior. Decision rules are set at n=50 reached (not dialed), which at David's connect rate is 100–150 rows. Positive outcome = open door or application on David's colour scheme; "dead" as scored in `flpool/out/verdicts/`.

| # | Hypothesis | Test | Metric | Decision rule | Prior |
|---|---|---|---|---|---|
| H1 | A carrier with a tow-away or disabling crash in the last 90 days is more likely to be open than a box-matched control | join MCMIS crash file to the pool; 50-row arm of crash rows vs 50 box-matched controls, David blind to the arm | open rate; dead rate; apps | crash arm ≥ 2× control open rate at n=50 reached → build the crash feed as a daily trigger; < 1.2× → park | 0.5 |
| H2 | A carrier with a vehicle OOS for a mechanical defect in the last 180 days, especially repeated on one VIN, is more likely to be open | same design on the inspection file | same | same rule | 0.4 |
| H3 | In FEMA-declared counties, tree / roll-off / vac / hauling rows are more likely to be open for 8–12 weeks after the declaration than the same lanes outside declared counties | next declaration in a state we hold; 50 inside vs 50 outside, same lanes | open; apps | ≥ 2× → FEMA becomes a standing cohort trigger; the list is regenerated per declaration | 0.5 |
| H4 | A pool company that listed a specialty truck privately in the last 60 days is more likely to be open | scrape one state's private-party listings (Truck Trader + Craigslist), match to pool, 50-row arm | open; apps; "already bought" rate (a negative we expect) | ≥ 2× open **and** "already bought" < 30% → build the scrape; if "already bought" dominates, shorten the window to 14 days and retest once | 0.5 |
| H5 | Trucks past a model-year threshold (VIN-decoded from inspection records) are more likely to be replaced | age band as a column on the crash/OOS arms; no separate arm | open rate by age band | monotone rise across bands at n → keep as a rank column | 0.35 |
| H6 | The new-DOT and visible-expansion tags (Alek's HOT) hold at n | next FL/TX list majority-HOT; David blind | open; dead | HOT open rate ≥ 2× the batch's WARM history → HOT becomes the default selector | 0.5 |
| H7 | Section 179 timing lifts reply rate on outbound in Nov–Dec vs Sep–Oct, same list quality | send timing arm on email once live | reply; positive | ≥ 1.5× → calendar-triggered sends | 0.6 |
| H8 | Service shops see repair-or-replace before vendors and will refer for a fee | 20 conversations with independent diesel / hydraulic / ag / refrigeration shops in one metro; ask what they do when a unit is not worth fixing | share who name a dealer; share who would refer; first referred lead | ≥ 5 of 20 would refer and ≥ 1 real lead in 30 days → build the tech channel (calculator on their phone) | 0.4 |
| H9 | Insurance agents will refer post-claim | 10 conversations with independent commercial-auto agents | same shape | same rule at half the numbers | 0.35 |

Not registered, deliberately: anything lien-timing, anything hiring, anything news-scrape at entity level.

## 6. Gameplan: from signals to lists

**Phase 0 (optional, runs whenever the case-study 50 arrives; never blocks Phase 1): backtest against known winners.** The idea: take Providence's funded deals with their funding dates, look backwards, and ask which signal families fired in the months before funding, compared with random pool rows over the same window. It is a free check on which families deserve a prospective arm. Its limits are real: 50 deals is thin; they were mostly vendor-sourced, so the public record may show nothing before them by construction; and it can only test families that have historical depth (FMCSA crash and inspection archives do; listings and declarations partly do). So it is a sanity check, not a gate. Run it with `flpool/scripts/feeds_calibration.py` when the 50 arrive; until then, do nothing here.

**Phase 1, this week: loss events on held data (H1, H2, H5).** Prompts and the experiment log are in `signals-execution.md`.
1. Download the FMCSA MCMIS crash and inspection files (public, monthly). Join on USDOT to the FL, OH, WI, CO pools and to the TX pool when built.
2. Columns per row: `crash_90d`, `crash_severity`, `oos_180d`, `oos_repeat_vin`, `oldest_unit_year`. Three-state, dated.
3. Build the first arm: 50 crash rows (in-box, LIEN, not filed <6 mo) + 50 controls. Ship blind in David's template. Verdicts join by `entity_id`.
4. Read at n=50 reached with the H1/H2 rules.

**Phase 2, in parallel: cohort overlay (H3, H7).**
1. Pull OpenFEMA declarations for our states, last 12 months, by county and incident type. Column `fema_declared_90d` on the pool.
2. If a declaration is live in FL or TX when the next list ships, run H3 as the arm. If none is live, hold the column and wait; do not fake it.
3. Add the emissions calendar as a state × model-year column (CA first if we ever work CA; otherwise EPA 2027).
4. Section 179 is a send-timing arm for outbound in Q4, not a selection rule.

**Phase 3, weeks 2–4: turnover scrape (H4).** One state, one platform first (Commercial Truck Trader private-party filter, vac / tow / bucket / crane), match to pool by seller name and phone, 50-row arm.

**Phase 4, weeks 2–4: partner conversations (H8, H9).** Twenty shops, ten agents, one metro where David has density (his map: NC and TX are best). Script: what happens when a unit is not worth fixing; who does the owner call; would you hand him a payment number. Every answer goes into `threads.md` T19/T4.

**Phase 5, continuous: source discovery.** Run the prompt in §8 per lane × state, log every candidate source in a registry (source, what it emits, join key, freshness, ICP coverage, cost), and validate one month of one source per week using the flpool feed runbook. Sources that emit dated company names at a non-zero join rate get a scraper; the rest stay lookup-only.

**Phase 6, when a signal clears its rule: triggered outbound.** A row enters the email sequence when its event fires (crash, declaration, listing), not when a batch ships. This is the version of the product where the signal is the send.

## 7. Lead-list generation protocol (one page, so every list is comparable)

1. **Pool:** in-box lanes, fleet ≥ 2, LIEN present, no captive or bank paper, not filed < 6 mo, verified alive, verified phone (three-state), not previously touched by us.
2. **Arm:** exactly one signal family under test, 50 rows with the signal + 50 box-matched controls (same lanes, same state, same fleet band). David blind to the arm; the internal file carries the arm column.
3. **Template:** David's 19 columns first, ours after. Dedup and name-hygiene pass before ship (the FL-100 duplicate pairs).
4. **Pre-registration:** the hypothesis number, the decision rule and the prior are written in the cover note before the list ships.
5. **Verdict join:** score his returned sheet with the existing scripts into `outcome`, `owner_reached`, `hung_up`, `crm`; join on `entity_id`; read at n=50 *reached*, never at n dialed.
6. **Decision:** apply the rule; write the result into §5 and, if the signal wins, into the selection defaults. If it loses, into the graveyard with the numbers.

## 8. Prompt: signal-source discovery

Run per lane × state (and again per cohort event type). Paste the pool's lane definition and the state; ask for structured output; validate every claimed source by hand before it enters the registry. The prompt asks for sources that name *small* companies with a *date*, which is the constraint every generic answer misses.

```
You are helping an equipment-finance originator find public or semi-public data sources
that reveal, with a DATE, that a small operating business is likely to buy or replace
equipment in the next 90 days.

Target population (the "pool"):
- Lane: {LANE, e.g. "septic / vacuum truck / grease / hydrovac operators"}
- State: {STATE}
- Size: 2–25 employees, 2–7 power units, owner-operated, no CFO
- They already appear in: FMCSA carrier census (USDOT), the state SOS registry, state UCC filings
- They do NOT plan: they rarely bid public work, rarely make news, hire constantly (hiring is noise)

I want sources that capture one of these MECHANISMS (label each source with its mechanism):
A. Loss or failure: crash, vehicle out-of-service, fire, theft, flood, recall, emissions failure
B. Cohort / environment: disaster declarations, regulatory deadlines by model year,
   large local projects, housing starts, weather or commodity shocks, competitor closures
C. Turnover: the owner listing or consigning an old unit, dealer trade-ins, auction lots
D. Financial capacity: UCC-3 terminations, lien lapses
E. Partner-observed: parties who see the need before a dealer does (repair shops,
   insurance agents, upfitters, inspectors, trade associations)
F. Stated intent: places the owner asks a question or requests a price

For EACH source, return a row with:
- source name and URL (or how to reach it if there is no URL)
- mechanism (A–F)
- what it emits: does it name the COMPANY (legal name, DBA, USDOT, VIN, phone, address)?
- does every record carry a DATE? what date (event date vs publication date)?
- coverage of companies this small (high / medium / low, with a reason)
- freshness (real-time / daily / weekly / monthly / static) and history depth
- access (open download / API / scrape / FOIA / purchase / partner-only) and cost
- join key to FMCSA, SOS, or UCC (USDOT, VIN, legal name + city, address)
- typical latency from event to equipment purchase, with your reasoning
- a one-line falsification test: what one pull of one month would show if the source is useless

Rules:
- Prefer regulatory, insurance, and transactional records over news. News does not cover this population.
- Do not list hiring, job boards, or LinkedIn.
- Do not list generic contact-data vendors (ZoomInfo, Apollo, etc.).
- If a source names only large companies, say so and rank it low.
- Include county-level and platform-level sources (the vendor that many counties use), not just state sites.
- Include at least three sources of type E (partners) with the registry or directory that lists them.
- Be specific to {STATE}; name the actual agency, portal, file, or association.
- Return 15–30 rows as a markdown table, then a short ranked list of the five you would pull first and why.
```

Follow-up prompts, run on the same thread: "For the top five, give the exact download URL or endpoint, the file layout, and a one-month sample size." · "Which of these join to FMCSA USDOT numbers directly?" · "What is the equivalent source in {NEXT STATE}?"

## 9. Bean's take on technicians (Simon's 09-17 addition)

Simon's argument: the mechanic, the ag-equipment tech, the refrigeration contractor sees the failing unit before any vendor is contacted, surfaces intent earlier than the vendor, and often decides which vendor gets the sale. Three things make this stronger than the vendor channel it sits upstream of:

- **It is the moment, not the channel.** "Not worth fixing" is the exact instant the need-buyer stops not-planning. Every other signal in this doc is a proxy for that instant; the tech is present at it.
- **No captive owns the mechanic.** Every dealer on David's vendor sheet is one a captive does not cover, which is why those vendors send deals to a broker. Independent shops are that condition everywhere: nobody has installed a financing button in the service bay.
- **The tool already exists.** The payment calculator is the tech's script: "this is $9K to fix, a replacement is $1,900 a month." The site built for inbound is the same page, opened on a phone in the shop. One artifact, two channels.
- **Leverage runs both ways.** A shop that routes buyers gives Quintel something to trade with vendors (flow) and gives the vendor a reason to want Quintel on the quote (the buyer arrives pre-qualified).

Two honest weaknesses: shops earn repair revenue, so recommending replacement is against interest unless they also sell or install (restaurant-equipment and ag dealers often do; independent diesel shops usually do not), and it is a relationship channel with the same "hard to reach" shape as vendors. The cheap test is H8: twenty conversations in one metro. The cheapest test of all is asking David on Saturday whether a deal has ever come in from a shop.

## 10. Graveyard

See `threads.md` graveyard. In one line each: hiring (universal noise); lien timing as ranking (did not replicate); entity-level news/court/municipal scrape (zero at three years); Gemini/ChatGPT scraping (not accessible); bank credit-declines (same underwriting); fleet > 7 and bank_lien as cuts (refuted on WI); asking Providence for its customer data (unobtainable, and unnecessary under the clean handoff).
