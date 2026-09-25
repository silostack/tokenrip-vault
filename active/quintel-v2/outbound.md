---
status: v0.1 design, for Simon's build and Alek's review
last_revised: 2026-09-24
owner: Simon (build), Alek (send model, David's answers)
serves: what the outbound engine is made of, how Alek's Six-State Outbound Model and David's ledger fit into one system, what handles replies, and what has to exist before the first send on ~10-06
tier: internal (shareable with Alek in full; §5 and §9 can be lifted for David)
relationship: absorbs `active/flpool/EMAIL_INFRA_PLAN_2026-09-09.md`; the send model is Alek's artifact (claude.ai, 09-23) and `source-feeds.md`; the shared record is `ledger.md`; the funnel it feeds is `funnel.md`
---

# The outbound engine: three machines, one record, and the reply machine nobody scoped

## 1. The so what

Alek's model and the ledger describe two thirds of the engine. The send machine (his stages 1–5) puts emails in front of owners. The ledger (`ledger.md`) is the record David works from and the fee is paid on. The piece between them, the **reply machine**, is scoped in neither: it is what turns an inbox of replies into a ledger row, an acknowledgment, a ping on David's phone, a suppression entry and a label on the send. It is on the critical path for 10-06, because the first positive reply arrives the first morning and the ledger row is supposed to exist before David calls.

Three decisions, made here:

1. **Automate the sorting, never the conversation.** Classification, verification against the pool, suppression, the acknowledgment and the ping run without a human from day one. The conversation with the owner is David's, by hand. This is not a compromise between Alek's position (AI books the calls) and Simon's (all manual). At full volume the inbox is roughly 20–50 replies a day, of which two to four are positives (§3). The two to four are trivially manual. The rest are bounces, out-of-office, unsubscribes and no's, and hand-processing those is what actually breaks a domain. AI drafting of replies to prospects is off until the ledger holds 100 positives with David's reason codes; that is the data Simon said we need before deciding.
2. **David's acknowledgment spec is a template with a clock, not an AI.** His three-line spec ("acknowledge, introduce me, copy me, give the timeline") is deterministic: one message, chosen by receipt time in Eastern, sent as a reply in the same thread from the mailbox the owner wrote to. No model writes it. §5 gives the rules and the four gaps in his spec that need his answer.
3. **One database, two ledgers, one bridge.** Alek's stage-2 tables record every company and every send; that record is ours and private. David's ledger records one row per positive reply, and both sides write to it. They are different objects with different rules (`ledger.md` §4: "a lead is a row only after a person has replied positively, never a name from a list"). The reply machine is the only thing that creates a row in the second from the first. Quintel already has the second layer's schema (§4).

The assumption everything here rests on: **positives arrive at roughly 3 per 1,000 sends** (Alek's number from David's test, ~1,000 sends, small sample). If it is 0.3, the reply machine is over-built and the problem is the list. If it is 30, David's five-applications-a-day ceiling binds in week two. Either way the machine below is the same; only the alert cadence changes.

## 2. The whole engine on one page

```
 SEND MACHINE (Alek, stages 1–5)            REPLY MACHINE (this doc, §3)              RECORD (ledger.md)
 feeds → pool → box gate → draft → plan → Smartlead ──► replies ──► ingest → classify → verify ──► positive ──► ledger row + ack + ping ──► David calls
                    ▲                                                   │                                                     │
                    │                                                   ├── bounce / unsubscribe / DNC ──► suppression        ├── CRM check, status, reason code
                    │                                                   ├── out of office / not now ──► pause / park           ├── LeasePath id, referral coded
                    └─────────── label on the send row ◄────────────────┴── every class                                       └── fee due, invoiced, paid
```

| Machine | What it owns | Scoped in | Status 09-24 |
|---|---|---|---|
| Send | sources, contact-append, dedupe, buy-box gate, drafting with validator, daily plan, Smartlead push, 30 mailboxes on 6 state domains | Alek's artifact; `source-feeds.md` corrects volumes and adds the contact-append gate | mailboxes warming since ~09-22; connectors and tables not built |
| Reply | webhook ingest, classification, pool verification, suppression, acknowledgment, ping, ledger-row creation, labels back | this doc §3, §5 | not built; not in either prior scope |
| Record | the shared ledger: David's queue, CRM check, four flags, reason codes, reconciliation, vendor tab | `ledger.md` | v0 sheet due 09-24; v1 page before 10-06 |
| Around all three | suppression (one table), deliverability monitor, trust surface (site v0), compliance footer, measurement, David's availability config | §6 | site v0 on the critical path (`call-analysis-2026-09-22.md` §3) |

## 3. The reply machine

### 3a. Volume, so the design is sized right

| Input | Value | Basis |
|---|---|---|
| Sends per weekday at full plan | 900 | Alek's model, 30 mailboxes × 30 |
| Sends per weekday at David's ramp, week 1 | ~500 | agreed 09-22 ("500, then 1,000, then 5,000"; per-day or per-week was not pinned) |
| Positive replies per 1,000 sends | ~3 | Alek, from David's ~1,000-send test (fact for the sample; small) |
| Positives per weekday | 1.5 at ramp, ~3 at full plan | derived |
| All replies per weekday, incl. auto-replies and bounces | ~20–50 at full plan | inferred from typical cold-email reply and bounce rates (2–5%); unmeasured for this list |
| Applications per weekday | ~1 | 1 per ~1,000 sends (David's rate) |
| David's ceiling | ~5 applications a day | `call-analysis-2026-09-22.md` §1 |

So: the positive stream is small enough that a person handles every one, and the non-positive stream is large enough that nobody should. The design follows.

### 3b. The pipeline

1. **Ingest.** Smartlead webhooks for reply received, bounce, unsubscribe, and campaign events, into Quintel. Master-inbox poll every 15 minutes as the fallback, because webhooks drop. Store the raw message (headers, body, thread id, mailbox, campaign, lead id, the email it answers). This single store is ledger job #1 for David: he reads the reply and the email it replied to, on the row.
2. **Classify, deterministic first.** Bounce codes, auto-reply headers, list-unsubscribe hits and the eight obvious keyword forms of "remove me" are rules, not a model, because they carry legal and deliverability weight and must never be wrong. Everything left goes to a model with one job: pick one class from `interested / question / not now / not interested / wrong person / do not contact / out of office / cannot tell`. Output is a class and a confidence; no drafting. First 200 replies: a person confirms every class before any action runs (the flpool plan's rule). After that, only `cannot tell` and low confidence go to a person.
3. **Verify against the pool** (`funnel.md` §5). The replying address or stated business must reconcile with the entity we emailed (domain, FMCSA legal name, SOS officer). A reply that does not reconcile is `verify_failed` and goes to a person, never to David. This is the GW Capital defense: a fresh brand's positives are where fraud shows up.
4. **Act by class.** The table is the spec.

| Class | Sequence | Suppression | Ledger | Message to the owner | David |
|---|---|---|---|---|---|
| interested | stop (Smartlead does this on any reply; confirm it) | none | **row created**, status `routed`, clock starts | acknowledgment (§5), same thread, same mailbox, David copied | Slack ping + text if he wants it; re-ping at 2 h if not marked contacted |
| question ("what is this," "who are you," "how did you get my info") | stop | none | row created, status `routed`, flagged `question` | acknowledgment with the one-line answer to the question (§5, variant Q) | same ping; he answers by hand |
| not now ("call me in the spring") | stop | none | no row; outreach row `parked` with a date | none | none; re-enters a sequence when the date arrives |
| not interested | stop | 90-day cooldown on the contact | no row | none | none |
| wrong person | stop | address suppressed; referred name captured if given | no row | none in v1 | none |
| do not contact / unsubscribe | stop | **permanent, all domains, all lists, within minutes** (CAN-SPAM allows ten days; we do not use them) | no row | none, or the one-line confirmation if they asked | none |
| out of office | pause; resume after the stated return date + 2 days | none | no row | none | none |
| bounce (hard) | stop | permanent | no row | none | none; domain bounce counter increments (§6) |
| verify_failed | stop | hold | no row until a person clears it | none | none |

5. **Label back.** Every class writes to the send row (campaign, arm, copy variant, state, source feed). This is the measurement that decides which feeds keep running, and it is where the signal experiments get their outcome column (`signals-execution.md`).
6. **CRM collision returns.** When David marks a row `existing customer` or `contacted within nine months` or `other AE`, the company goes to suppression with reason `pcf_book`, and the send machine stops touching it. This closes the loop `call-analysis-2026-09-22.md` §3 opened: collisions are caught at handoff and cost nothing, but only if the handoff writes back.

### 3c. What is deliberately not automated, and the rule for changing it

No model writes to a prospect. Not the reply to a question, not a scheduling nudge, not a "still interested?" follow-up. David's reason is the right one: he reads a lot into a reply, and what he reads is the data we do not have yet. The unlock is a number, not a feeling: **100 positives on the ledger with David's status and reason code on each.** At that point the classes with the most volume and the least judgment (likely "question: how did you get my info" and "not now") get a drafted reply that a person approves, and the approval rate over the next 100 decides whether the draft goes out unreviewed. Write this rule into `decisions.md` when that file exists.

## 4. Reconciling the send tables with David's ledger

Alek's stage 2 proposes six new tables in Quintel's Postgres: `company_identifier`, `contact`, `outreach_lead`, `outreach_event`, `suppression`, `daily_plan`. The ledger proposes one shared Leads sheet and one Vendors sheet, then a page. These are not competing designs; they are two layers, and the confusion to avoid is building David's ledger as a view over the outreach tables. It cannot be: the outreach layer holds every company we ever emailed and is ours alone; the ledger holds only people who replied positively and is shared with a counterparty who is paid on it.

| | Outreach layer (Alek's stage 2) | Handoff layer (David's ledger) |
|---|---|---|
| One row per | company, contact, send | positive reply (a lead), and a sourced vendor |
| Created by | the nightly pull and the planner | the reply machine, on `interested` or `question` |
| Written by | Quintel only | Quintel (identity, context, reply, fee) and David (CRM check, status, deal, reason) |
| Visible to | us | us and David; his juniors later by name |
| Retention rule | forever, for dedupe and cooldown | nothing deleted, wrong rows voided |
| Key | company (USDOT → website → name+state+ZIP), contact (email) | ledger id, with the LeasePath id when David has one |

**What Quintel already has, and what to reuse.** The production schema (read 09-24) has `company` (123,798 rows), `contact` (4,046), `lender` with `norm` and `aliases`, `debt_event` linked to lenders, and an `email_message` outbox. It also already has the handoff layer's shape: `registered_lead` (surfaced_at, lane, identity, signal_context, `attribution_ends_at`, `challenge_closes_at`, manual_status) with `register_event` (from/to status, actor kind, reason, corrects_event_id) and `register_delivery`, plus `referral_item` / `referral_event` (rep_name, pass_reason, amount_usd). That is the ledger's status machine, attribution window and audit trail, built for the lender product. Fact: the tables exist with the columns named. Inference (medium): they fit the ledger with a Providence account and a few added fields (CRM check result and AE of record, the four flags with dates, LeasePath id, referral-coded, GM, reason code, fee due / invoiced / paid) rather than a new table. Check the constraint that would break it: `registered_lead` is keyed to an `account`, so Providence becomes an account and David a user on it, which is also how his login on the v1 page works.

Alek's new tables then reduce to: `outreach_contact` if the existing `contact` table's `email_status` and `source` are not enough (they may be), `outreach_lead` and `outreach_event`, `suppression`, `daily_plan`. Company identity should use the existing `company` table and its identity tooling rather than a new `company_identifier`.

**The sheet and the page.** `ledger.md` §8 says sheet this week, page before 10-06. Keep that order, with one change in what the sheet is: not a hand-maintained tab that a nightly job copies back, but a rendered export of the handoff layer that David can also type into, synced both ways on his columns only. The reason is the reply machine: it creates the row and attaches the reply text at the moment of classification, which is minutes after the owner writes. A sheet David keys from must already carry that row, so the pipeline writes the sheet, not a person. If two-way sync with a sheet costs more than a day, skip the sheet and ship the page with the same columns; David said he runs on Excel and hates it, and the question of sheet versus page is `ledger.md` §9 Q6, still open.

**Attribution lives in the handoff layer, not the outreach layer.** The fee rule (our timestamp before Providence's application date, funded within twelve months, any AE) needs the row's `entry timestamp` to be the classification time of the positive reply, not the send time. Alek's diagram sends "positives to David same day"; the row must exist before the ping, or the clock has no start.

## 5. The acknowledgment: David's spec, made exact

David's spec (Slack, this week): the owner gets a response acknowledging his message; David is introduced in the same message and copied so he can respond; the owner gets the timeline: today if received 5:00 AM–6:30 PM Eastern, next day if after 6:30 PM (he wrote Pacific; read as Eastern), Monday if after 1:00 PM Eastern on Saturday. Open: whether to give a scheduling link.

### 5a. The rules as they will run

Receipt time is the reply's arrival, in Eastern, whatever state it came from; the promise is about David's day, not the owner's. The message is a reply in the owner's thread from the mailbox he wrote to, so it threads, it is DKIM-signed by the sending domain, and it does not look like a new cold email.

| Received (Eastern) | Promise |
|---|---|
| Mon–Fri 5:00 AM – 6:30 PM | "today" |
| Mon–Thu after 6:30 PM, or before 5:00 AM | "tomorrow morning" |
| Fri after 6:30 PM | "Monday" |
| Sat before 1:00 PM | "today" (his rule implies he works Saturday mornings; confirm) |
| Sat after 1:00 PM, all Sunday | "Monday" |
| Federal holiday, or a day David has blocked | next working day; needs an availability config he can edit, not a code change |

Four gaps in the spec, for David: the Pacific/Eastern line; Saturday mornings; Sundays; and holidays or his days off. The last one is the one that bites, because "today" is a promise, and a promise the ledger's two-hour clock cannot back is worse than no promise. Rule: the acknowledgment's timeline is generated from the same availability config that drives the re-ping, so the two never disagree.

### 5b. The sender problem, which the spec exposes

The spec says "I get introduced in the same message." But the named sender on every one of the 30 mailboxes is David (`launch.md` §8: david, davidl, davidlasaee). If David is the sender, there is nobody to introduce him; the acknowledgment is "thanks, I'll call you today" from David. If the sender is an Ironmark name, the acknowledgment introduces David and copies him, as the spec says, and Providence is named after the CRM check as agreed 09-22. These are two different machines, and the mailbox provisioning has already picked one while the spec assumes the other.

Two more reasons this has to be settled before 10-06, not after:

- **CAN-SPAM's truthful-header rule.** The From line has to identify the person or business that initiated the message. "David at Ironmark" when David is a Providence AE and Ironmark is ours is a question for counsel, not a copy choice. "David LaSaee, Providence Capital Funding" on an Ironmark domain is the option the 09-22 call ruled out (own brand at the top of the funnel; Providence introduced after the hit is checked). An Ironmark sender has no such problem.
- **The focus group tests exactly this on Saturday** (`focus-group-questions-2026-09-26.md` Q2: sender A/B/C with the full emails; Q3 tests the handoff in three parts: the acknowledgment, ask-first versus copy-first, and where the paperwork goes; Q11, optional, asks lender-first or intermediary-first directly). That is the cheapest disconfirming test in the plan and it arrives in three days. Build the acknowledgment with two template variants (sender = David, sender = Ironmark person) and let the focus group plus David pick. Do not hard-wire either.

Recommendation, held loosely until Saturday: Ironmark sender, David introduced as "with one of the lenders we work with," not copied. It matches the brand decision as David argued it and the truthful-header rule as written, and it keeps his name out of the thread until the CRM check has run. Confidence medium; the focus group can reverse it and the mailboxes' display names can be changed in an hour.

**Why two people beats one David with two hats (09-25).** The question is not who sends the first email; it is where in the chain the owner learns the person is with a lender. With an Ironmark sender the reveal is in the acknowledgment ("David, with one of the lenders we work with, will call you"), before the call, after the "we are not the lender" line has primed it. With David as sender the reveal is either on the phone, with David explaining his own dual identity live, or when the Providence credit application arrives, which is the SSN moment. Three more reasons: David's name on 900 cold emails a day reaches the 4,800 off-limits accounts before any check; thirty mailboxes named after one Providence AE bake the pilot into the send machine, whereas an Ironmark sender survives a second originator or David's juniors; and a real Ironmark person on an Ironmark domain has no truthful-header question. The one advantage of David-as-sender is continuity (the person who emailed is the person who calls); Q3 part 1 of the focus group tests exactly that with both chains side by side.

**Two conditions.** The Ironmark sender must be a real person with a LinkedIn and an about-page entry, because the legitimacy check will look them up; a fictional name fails that check and re-creates the header problem. That means a founder's name on the mailboxes now, or a hired name later. And David is not copied on the acknowledgment: copying his Providence address leaks Providence before the check, and copying an Ironmark address contradicts "he is with the lender." The ledger pings him; after the check the thread is forwarded to his Providence address and he calls, or replies from there.

### 5c. The scheduling link

David's own words (09-22): people like picking a time, it creates an obligation, but a Calendly link in the first email might get caught in spam. Alek's reply was to put it in the response instead. That is the right split, and the spam argument does not apply to the acknowledgment: it is a reply inside a thread the owner started, from a mailbox he has already received from.

Rule: **no link in the cold sequence; a link in the acknowledgment, second to the phone promise.** The line is "I'll call you today at [number from the reply or the row]; if a specific time is easier, pick one here." The link points at David's calendar, on a page that writes the booked time to the ledger row so the queue shows it. Focus group Q12 (optional) tests whether owners prefer "best number and time" or a calendar; measure booking rate over the first 50 positives and drop the link if it is under one in ten. Whose calendar is a question for David (his own Calendly, which he already uses, or one on the Ironmark domain); the row link is the requirement either way.

### 5d. The message, variant I (Ironmark sender, interested)

Plain text, under 90 words, the three parts in the order David gave them:

> Thanks for getting back to me, [first name]. David LaSaee, with one of the lenders we work with, will call you [today / tomorrow morning / Monday] at [phone]. If a specific time works better, you can pick one here: [link]. Nothing is needed from you before the call.
>
> [Ironmark sender]
> [postal address] · [opt-out line]

Variant Q adds one sentence answering the question from the focus-group list (the "how did you get my information" and "what is the catch" answers, once Saturday says which line owners believe). Variant D (David as sender) drops the introduction and speaks in the first person. Variant I-ask replaces the first sentence with "Mind if I have David LaSaee, with one of the lenders we work with, call you [today]? Reply 'sure' and he will," and waits for the reply before pinging David. All are fixed copy with five slots; nothing is generated.

### 5e. The handoff: who replies, who is copied, and where the paperwork goes

The acknowledgment is the first step of a handoff that ends with the owner sending a credit application to Providence. Designing the first step alone gets it wrong, because the two obvious options for the reply each break somewhere later in the chain.

| Option | The reply | Breaks where |
|---|---|---|
| A. Auto-acknowledgment from the Ironmark mailbox, David copied on his **Providence** address | instant, deterministic, David in the thread | Providence surfaces before the CRM check. The Cc line is the collision scenario from the 09-22 call: an existing customer sees David's Providence address minutes after replying, before anyone has checked whether he is another AE's account |
| B. No auto-acknowledgment; David replies himself from his **Ironmark** inbox | one voice, a person from the first reply | latency (he is on the phone all day; the two-hour clock has no floor); and the owner meets "David at Ironmark" by email and "David at Providence" when the paperwork arrives, which is the identity switch the focus group's bait-and-switch question is about |
| **C. Two-step (recommended).** Instant acknowledgment from the Ironmark mailbox naming David as "with one of the lenders we work with," nobody copied; ledger pings David; after the CRM check the thread is forwarded to his Providence address; David calls as Providence; application through Providence's own channel | instant and deterministic; the CRM check happens before Providence enters the thread; the owner was told a lender's rep would call, so Providence on the phone is expected, not a switch | needs the site to connect the two names for the legitimacy check (a funding-partners line that lists Providence), a real Ironmark person as sender, and David to say the same sentence on every call |

Under C the chain is: reply → acknowledgment (Ironmark sender, David named as the lender's rep, no Cc) → ledger ping → CRM check → thread forwarded to David at Providence → David calls, identifies as Providence, says the partner line → Providence's credit application from David's Providence email or Providence's own link. Ironmark never holds an SSN, a bank statement or a guarantor's ID. An earlier version of this section had David copied on an Ironmark inbox; that contradicts "he is with the lender" and is dropped.

**Why not let Ironmark take the application.** Three reasons, in order of weight. First, it is unnecessary: the pattern everywhere else in lending is that the intermediary stops at pre-qualification and the application finishes with the lender. LendingTree states it outright ("we will not ask for a driver's license or Social Security card before you have submitted an application with a loan officer"); Lendio does the same with a human "funding manager" who stays with the borrower through the lender's application, which is David's role from the other side. Second, it is expensive to do properly: the FTC's 2021 Safeguards Rule amendment brought "finders" (companies that bring together buyers and sellers of financial products, lead generators named explicitly) inside the definition of a financial institution. The rule covers consumer-purpose transactions, and equipment finance with a personal guarantee is commercial, so Ironmark is probably outside it; but "probably" is a counsel question, and holding no application data makes the question moot. Third, the collision: an application taken by Ironmark is an application before the CRM check.

**Where the assumption is weaker than the plan treats it.** The plan assumes owners will not send PII to a company they met by cold email. Two findings cut against that. Equipment-finance brokers collect one-page credit applications with the principal's SSN every day from borrowers who found them yesterday; the convention in this industry is that the broker, not the funder, takes the application. And the Federal Reserve's small-business studies find that mistrust of online lenders is driven by spam calls and emails, not by data-security fear, which most owners are "resigned" to. So the objection is "this is spam," not "you will leak my data," and the trust device that answers it is a named person on the phone, not which entity's form the SSN goes on. That does not change the recommendation (C is still cheapest and cleanest); it means the focus group should measure comfort with sending paperwork to Ironmark versus Providence rather than assume it, and it means the site's partner line and David's phone sentence carry more of the trust than the domain does.

**The intro convention.** Professional etiquette for introducing two people by email is the double opt-in: ask each side before connecting them (Fred Wilson's 2009 rule, now standard). Copying David unasked is the single opt-in. The cheaper variant, "mind if I loop in David? Reply 'sure' and he'll call you today," costs one extra reply and produces an explicit yes on the row, which is a better consent record for the call and a stronger commitment from the owner. It also delays the call by one exchange. The focus group tests both (Q3, part 2), and Q3 part 1 tests the two-people chain against one David with two hats; real sends will show whether the extra step loses people.

**Compliance note on the call itself.** David dialing a number the owner typed into a reply is a manual business-to-business call; the TCPA's autodialer and prerecorded-message rules do not reach it, and the FCC's one-to-one consent rule for lead generators was vacated by the Eleventh Circuit in January 2025 and formally repealed in September 2025. If David texts instead of calls, that is the case to check.

## 6. The rest of the moving parts

Beyond Alek's five stages and the reply machine, these have to exist or the engine is unsafe to run. Ordered by what breaks first.

1. **One suppression table, checked at plan time and at send time.** Sources: our own touches across every domain, unsubscribes, hard bounces, DNC replies, `pcf_book` returns from David's CRM check, David's April list, every Origami campaign Alek has run, flpool production touches. Synced to Smartlead's block list nightly and on every DNC event, because Smartlead's own dedupe is per campaign. Rule from the infra plan still stands: no address in two sequences, ever, across the twelve campaigns.
2. **Deliverability monitor with automatic brakes.** Per domain and per mailbox, daily: bounce rate, reply rate, spam-complaint rate from Google Postmaster Tools, warmup health from Smartlead. Brakes: a domain over 3% bounce is paused by the planner, not by a person noticing; a mailbox under the reply floor after 600 sends is rotated out. The single-domain-per-state risk in Alek's model (a flagged domain takes a state dark for weeks) is real; the second domain per state should start warming now, since warmup is the long pole.
3. **The ramp in the planner.** Alek's planner allocates 150 per domain per day from day one. David's ramp is 500, then 1,000, then 5,000, and mailboxes fresh out of warmup should not jump to 30 a day. The planner needs a ramp schedule per mailbox (for example 10, 15, 20, 30 over two weeks) and a global daily cap that Simon sets; the state split is applied under the cap.
4. **David's availability config.** A small table he can edit (working hours, days off, holidays) that drives both the acknowledgment's promise and the re-ping. Without it the two drift and the promise is the first thing an owner catches us on.
5. **The ping and the digest.** Positive: Slack immediately, text if he wants it, with the packet (`ledger.md` §6) and the reply text. Two-hour re-ping if not marked contacted. A 7 AM Eastern digest of overnight positives, so Monday morning is one message, not fifteen. Weekly numbers on Tuesday for the ledger review. Nothing else pings.
6. **The morning review queue.** Alek's stage 3 says someone reads 20 drafted emails per state each morning for two weeks. That is 120 emails a day for a person before 4:30 AM Central, which nobody will do. Make it a queue with approve/reject, review a random 20 total (not per state), and block the push on rejections above a threshold rather than on a human having read everything.
7. **The contact-append stage and its measurement**, from `source-feeds.md` §5: only six of 26 build-now feeds carry an email. The website → email → verify hit rate on 200 address-only companies decides whether the intent bucket fills at all. This is a send-machine item, but it gates the volume every other number above assumes.
8. **The trust surface.** Site v0 (entity in the footer, street address, about page with names, LinkedIn page, the Quintel parent link) before the first send; the landing page the email links to; the "how did you get my information" line chosen by the focus group. `call-analysis-2026-09-22.md` §3 already made this the critical path; it is listed here because the reply machine's variant Q depends on the same lines.
9. **Compliance footer and the opt-out path.** Physical postal address (Ironmark's entity address, which has to exist), a working opt-out that lands in the suppression table within minutes, plain text, no tracking pixels in v1. Referral-fee and commercial-finance disclosure by state is `launch.md` §3 #12, due 10-03, and the truthful-header question in §5b joins it.
10. **Measurement.** Per arm, copy variant, state, source feed and campaign: sent, delivered, bounced, replied by class, positive, routed, hours to contacted, application, funded. Wilson intervals, pre-registered gates from the infra plan (bounce under 3% per domain; scale an arm at 1% positive; stop and rewrite under 0.3% after 600 sends). The ledger's reason codes join at the row.
11. **The "not now" re-entry and triggered sends.** Parked rows with a date re-enter a sequence when the date arrives; later, a row enters when its event fires (a new UCC, a truck added on the FMCSA diff). The infra plan's v2 item; the planner should be written so a row can enter from a trigger, not only from the nightly batch.

## 7. Build order against 10-06

What must run on the first send day, in the order to build it. Everything in the first block is small; the risk is not effort but forgetting one.

**Must exist at first send (target 10-03, three days of slack):**

1. Suppression table loaded from every source in §6.1, synced to Smartlead's block list.
2. Reply ingest (webhook + poll), raw store, deterministic classes for bounce, unsubscribe, out of office.
3. Model classification for the rest, with the person-confirms gate on the first 200.
4. Pool verification on positives.
5. Handoff row creation on `interested` / `question`, with the reply and the email replied to attached. Sheet or page per §4; either one, populated by the pipeline.
6. Acknowledgment: the availability config, the timeline rule, the three variants, sent in-thread from the replying mailbox, David copied. Sender variant chosen after Saturday.
7. Ping to David (Slack; text if he says so), the two-hour re-ping, the 7 AM digest.
8. Bounce and complaint counters with the 3% domain brake.
9. Planner with the ramp schedule and a global cap; Alek's state split under it.
10. Send-row labels from every reply class.

**Can lag the first send by a week or two:**

- Nightly connectors beyond Colorado UCC and FMCSA (the general bucket carries week one; `source-feeds.md` §5).
- The v1 ledger page if the populated sheet works; David's login; the vendor board.
- The scheduling page that writes to the row (a plain Calendly link is fine for the first 50 positives if David wants one).
- Second domain per state (start warming now; it lands when it lands).
- `pcf_book` write-back from the CRM check (David types the result; a person copies it to suppression until the sync exists).

**Not before 100 labeled positives:** any drafted reply to a prospect.

## 8. Risks this design carries

| Risk | Why it matters | What is done about it |
|---|---|---|
| The 3-per-1,000 positive rate is from one small test | the reply machine's sizing and David's ceiling both depend on it | first 2,000 sends re-measure it; alert cadence is the only thing that changes |
| Sender identity unresolved while mailboxes already say "David" | changes the acknowledgment, the CAN-SPAM read and the brand argument | two template variants; focus group Saturday; display names changeable in an hour |
| "Today" promised and not kept | trust, and the two-hour rule David set himself | promise and re-ping generated from one availability config he edits |
| Classification error on a DNC or unsubscribe | legal and deliverability weight | rules, not a model, for those classes; person-confirms gate on the first 200 |
| Ledger built as a view over the outreach tables | shares our whole pool with a counterparty; violates the ledger's own row rule | two layers, one bridge (§4) |
| Smartlead's per-campaign dedupe mistaken for suppression | the same owner in two state campaigns or two arms | our table is the source of truth; Smartlead's block list is a mirror |
| Reply machine is not built by 10-06 and positives are handled from the master inbox by hand | no ledger row, no clock, no labels; the Origami situation again | it is the first block in §7, ahead of connectors |

## 9. Questions for David this week

Sent one at a time on Slack, per the 09-22 rule. The first two decide the build.

1. Timeline rules: 6:30 PM Eastern (not Pacific)? Saturday mornings "today"? Sundays "Monday"? Days off and holidays, so the message never promises a day he is not working.
2. Sender: after the focus group, does the first email come from him or from an Ironmark name that introduces him? (The mailboxes currently say him.)
3. The scheduling link: in the acknowledgment, after the phone promise; his Calendly or one of ours; and whether he wants the booked time on the ledger row.
   Also: that he is not copied on the acknowledgment (the thread reaches his Providence address after the CRM check), whose real name goes on the Ironmark mailboxes if the two-people chain wins, and the one sentence he says on every call to connect Ironmark to Providence (§5b, §5e).
4. Slack, text, or both for the positive ping; whether the two-hour re-ping is welcome (`ledger.md` §9 Q5).
5. Whether "question" replies ("how did you get my info") should reach him like positives or be answered first by the one line the focus group picks.
6. His CRM-check result written on the row within the two hours, so the collision goes to suppression and the AE of record gets the deal without a second email from us.
