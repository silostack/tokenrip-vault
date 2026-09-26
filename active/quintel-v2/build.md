---
status: v0.1 PRD, the starting point for Quintel and Ironmark engineering tasks
last_revised: 2026-09-26
owner: Simon
serves: what the outbound engine is for, how the four systems divide the work (Quintel, Ironmark, Icemail, Smartlead), the data each owns, the interfaces between them, the feedback loops, and the build order; enough for the whole system to come into view from an engineering seat without the copy, the classifier prompts or the per-feed plumbing
tier: internal (shareable with Alek in full)
relationship: `launch.md` is the six-week plan; `outbound.md` is the design reasoning and the decisions (§5b, §5e, §5f, §5g); `ledger.md` is David's view; `source-feeds.md` is the feed inventory; `funnel.md` is the lead lifecycle this implements. This doc is what gets built.
---

# Build: the Ironmark outbound engine

## 1. Why we are building this

**The business problem.** Equipment-finance originators find borrowers by dialing lists and by vendor relationships. Both are slow, and the dialing does not work under a new brand: 250–300 dials on verified lists produced zero applications, and the word "financing" gets a hang-up from owners who carry equipment liens. Email under an unknown finance brand draws fraud and nothing else (GW Capital). The originator we are working with, David at Providence Capital Funding, is a good closer with no lead flow of his own and a hard ceiling on how many applications he can key by hand.

**What we are building.** A machine that finds small owner-operated businesses in Providence's buy box from public records, emails them under our own equipment brand (Ironmark) in their own trade terms, verifies every reply against the record it came from, checks it against the lender's book, and hands the right person at the right lender a warm, contextual lead the same day. A shared ledger records every routed lead from reply to funded, so the referral fee is provable and every dead lead comes back as a labeled reason.

**Why it is worth building rather than buying.** The sequencer, the mailboxes and the warmup are commodities; we buy them. What nobody sells is the loop: a verified entity, a stated intent, a lender's outcome and a reason code, on the same row. That dataset is the asset. It tells us which feeds, states, copy and lanes produce funded deals, and it is what makes a second lender, a second brand, or the site's inbound door cheap to add. This is the Tokenrip pattern: sell the solution to one customer, build the substrate as the byproduct.

**Goals, in order.**

1. Prove the mechanism end to end: an owner replies to an Ironmark email, David funds the deal, Providence codes and pays the referral. Phase-1 target is five attributed funded deals (`launch.md` §2a).
2. Run at 900 sends a weekday on 30 mailboxes without burning a domain, with bounce under 3% and a positive-reply rate we can measure per feed, state and copy arm.
3. Keep David's side to reading and typing: a queue on his phone, four flags, a reason code. No integration with Providence's systems.
4. Build the record so that a second originator, a second brand, or the site's inbound door plugs into the same lead object and the same ledger.

**Non-goals for this build.** No AI-written conversation with a prospect (one templated handoff email only, until 100 positives are labeled; `outbound.md` §3c). No application, SSN, bank statement or guarantor data on our side, ever. No integration with LeasePath. No vendor-channel outreach in this engine (separate program). No inbound site funnel in this engine (it lands on the same lead object later).

**Working numbers.** Sends per weekday at full plan 900; positive replies about 3 per 1,000 sends (Alek's number from a ~1,000-send test, small); applications about 1 per 1,000 sends; David's realistic ceiling about five applications a day. Every number gets re-measured on the first 2,000 sends.

## 2. The lanes: who does what

Four systems and two people. The rule for drawing the line: **Quintel owns knowing who a company is and what happened to it. Ironmark owns talking to it.** Icemail and Smartlead are rented plumbing on Ironmark's side of the line.

| | Owns | Does | Does not |
|---|---|---|---|
| **Quintel** (sourcing and record) | companies, contacts, identity resolution, ICP fit, the lead pool and the ready pool, enrichment and verification, pre-qualification facts, the suppression list of record, the register (David's ledger), lender accounts and users, outcomes and labels, the numbers | pulls feeds, resolves entities, scores fit, finds and verifies emails, gathers facts, serves ready leads, ingests every outreach outcome, creates the routed-lead row on a positive, notifies the lender, records the check and the outcome, reconciles the fee | send email, hold mailbox credentials, talk to Smartlead |
| **Ironmark** (the channel) | the brand, the sending domains and mailboxes, campaigns, copy generation, the daily plan, the Smartlead integration, reply ingest and classification, the handoff email, the manual-takeover inbox | claims ready leads, writes the two personalized lines from Quintel's facts, plans and pushes to Smartlead, receives every webhook, classifies replies, verifies positives against the pool (via Quintel), asks Quintel for the routing decision, sends the one handoff email, reports every event back to Quintel, watches mailbox health and rotates the fleet | decide who a company is, decide fit, keep its own copy of companies beyond what a send needs, hold applications |
| **Icemail** (mailbox fleet) | domain purchase, DNS (SPF, DKIM, DMARC), Google or Microsoft mailbox creation, credentials, export to Smartlead | provisions domains and mailboxes on order; replaces burned ones | send campaign email; know about leads |
| **Smartlead** (sequencer) | sending, rotation, warmup, sequence scheduling, stop-on-reply, the master inbox, bounce autopause, its own block list | sends what Ironmark pushes, on the schedule Ironmark sets; fires webhooks on every event; exposes mailbox health and warmup stats; replies into a thread on command | decide what to send to whom; be the source of truth for suppression or outcomes |
| **David** (Providence) | Providence's book, the call, the application, the deal | checks each positive against Providence's records and marks it; triggers or sends the handoff; calls the same day; updates the four flags and the reason code | anything that requires Providence's IT |
| **Ironmark sender** (a founder) | the name on the emails | answers any owner question before the call; takes over a thread by hand when routing says so | write copy per lead (software does), classify (software does) |

Boundary rules that follow:

- Quintel never sends an email to a prospect and never holds a mailbox password. Ironmark never creates a company or decides fit; it asks.
- Smartlead's state is a mirror, never the record. Every Smartlead event is written to Ironmark's log, then reported to Quintel; if the two disagree, Quintel's row wins and Ironmark reconciles.
- The suppression list of record is Quintel's. Ironmark checks it at plan time and at push time and mirrors it into Smartlead's block list; Smartlead's per-campaign dedupe is not suppression.
- No application data crosses into either system. The handoff ends at "who calls."

## 3. Architecture

```
  PUBLIC FEEDS                QUINTEL                                  IRONMARK                          RENTED                PEOPLE
  (Socrata, ArcGIS,     ┌──────────────────────────┐            ┌──────────────────────────┐        ┌──────────────┐
   bulk files, PDFs)    │ connectors → raw_item     │            │ claim ready leads         │        │  ICEMAIL     │
  ──────────────────────►  company / contact         │  ready     │ copy: 2 lines + template  │ push   │  domains,    │
                        │  ICP fit → lead pool       │───pool────►│ daily plan (ramp, caps)   │───────►│  mailboxes,  │
                        │  enrich → verify → facts   │  (API)     │ campaign map per state    │        │  DNS, export │
                        │  ready pool                │            │ Smartlead client          │        └──────┬───────┘
                        │                            │            │                          │               │ mailboxes
                        │  suppression (record)      │◄──events───│ event log (every webhook) │◄──webhooks──┐ ▼
                        │  labels on lead + contact  │   (API)    │ reply classifier          │        ┌──────────────┐
                        │                            │            │ verify → ask routing      │        │  SMARTLEAD   │
                        │  REGISTER (David's ledger) │◄──positive─│ handoff email (1 template)│──reply─►│  sends,      │
                        │  routed row, check, flags, │───routing─►│ manual-takeover inbox     │  API   │  master inbox│
                        │  reason, fee, attribution  │  decision  │ mailbox fleet registry    │◄──poll──│  warmup,     │
                        │  notifications to lender   │            │ deliverability brakes     │        │  health      │
                        └────────────┬───────────────┘            └──────────────────────────┘        └──────────────┘
                                     │ queue, flags, reason code (web + Slack/text)                                        ▲
                                     ▼                                                                                     │
                                   DAVID ── checks Providence's book ── calls ── application (Providence's own channel) ────┘
                                                                                                       owner ──────────────┘
```

Three loops run through this:

1. **Outcome loop (learning).** Every send, reply, class, route and lender outcome lands on the lead and the contact in Quintel. Fit scoring, feed selection and copy arms are chosen against those labels.
2. **Suppression loop (safety).** Unsubscribe, hard bounce, DNC, and "in Providence's book" flow Ironmark → Quintel within minutes, then back out to the planner and to Smartlead's block list.
3. **Fleet loop (deliverability).** Bounce and complaint rates per mailbox and domain, from Smartlead events and polled stats, throttle the planner, pause a domain, and trigger a replacement order at Icemail.

## 4. Core concepts and the data each system holds

### 4a. Lead, prospect, trigger

Quintel already has **prospects**: a company plus a **trigger** (a dated event with a signal score) surfaced to a lender account. The Ironmark engine introduces **leads**: a company plus a contact that fits the ICP, sourced for Ironmark outreach, with or without an event behind it. Same company table, same contact table, different objects on top, kept on separate tracks for now.

| | Prospect (exists) | Lead (new) |
|---|---|---|
| What it is | a company with a live trigger, ranked, delivered to a lender's queue | a company + contact that fits the buy box, queued for Ironmark email |
| Selected by | trigger_event state and score, buy box | ICP fit score, contact availability, state, cooldown |
| Consumer | lender users in Quintel | Ironmark (the channel) |
| Carries an event? | always | `origin_kind = event` when a dated record started it (a UCC filing, a permit, a fleet add); `origin_kind = roster` when it came from a standing list (FMCSA fleets, license rosters) |
| Link | | `lead.trigger_event_id` nullable; `lead.signal_ids[]` for the events that fed it |

Rule: a lead may also be a prospect (same `company_id`). Store both; do not merge the tracks; expose the overlap as a view (`lead_prospect_overlap`) so we can later test whether prospects-that-are-also-leads convert better than roster leads. An Ironmark reply on a company that is a live prospect for a lender is a fact worth surfacing to that lender later, not now.

### 4b. Entities by system

**Quintel (system of record)**

| Entity | Purpose | Key fields (beyond id, timestamps) |
|---|---|---|
| `company` (exists) | the business | identity fields, `state`, `sector`, `equipment[]`, `employees`, `founded_year`, `has_email/phone/website`; identity resolution already here |
| `contact` (exists) | one row per person/email | `email`, `email_status` (valid / invalid / unverified / bounced), `email_source`, `phone`, `source` |
| `lender` + `debt_event` (exist) | prior-financing facts | secured-party aliases; the UCC join |
| `lead` (new) | the Ironmark unit of work | `company_id`, `contact_id`, `origin_kind` (roster / event), `origin_feed`, `trigger_event_id?`, `signal_ids[]`, `state_code`, `icp_fit_score`, `fit_reasons jsonb`, `prequal_status` (pass / fail / unknown), `facts jsonb` (typed, sourced facts for personalization), `lifecycle` (see 4c), `claimed_by`, `claimed_at`, `cooldown_until`, `last_outreach_at` |
| `lead_event` (new) | every event on a lead, from any system | `lead_id`, `kind`, `at`, `source_system` (quintel / ironmark / smartlead / lender), `payload jsonb`, `idempotency_key` |
| `suppression` (new) | the list of record | `scope` (email / domain / company), `value`, `reason` (unsubscribe / hard_bounce / dnc / pcf_book / manual / legal), `source_system`, `until` (null = forever), `lead_id?` |
| `registered_lead` + `register_event` (exist) | the register: David's ledger rows and their audit log | one row per positive reply; `account_id` (Providence), `identity`, `signal_context`, `attribution_ends_at`, status machine, actor-typed events. Add: check result and AE of record, four flags with dates, LeasePath id, referral coded, GM, reason code, fee due / invoiced / paid |
| `account` / `user` (exist) | lenders on the panel and their people | Providence as an account; David as a user; a second originator is another account |
| `routing_rule` (new, small) | who a positive goes to | `account_id`, `states[]`, `box conditions`, `collision_policy`, `sla_hours`, priority |

**Ironmark (the channel)**

| Entity | Purpose | Key fields |
|---|---|---|
| `outreach_lead` | Ironmark's handle on a claimed lead | `quintel_lead_id`, snapshot of the send fields (name, email, company, state, facts), `campaign_id`, `smartlead_lead_id`, `arm`, `copy_version`, `status` (claimed / drafted / reviewed / pushed / active / stopped / done), `pushed_at` |
| `draft` | the generated two lines | `outreach_lead_id`, `line1`, `line2`, `facts_used[]`, `validator_result`, `reviewed_by?` |
| `campaign` | one Smartlead campaign | `smartlead_campaign_id`, `state_code`, `arm` (intent / general / vendor later), `send_window`, `daily_cap`, `mailbox_ids[]` |
| `daily_plan` | one row per campaign per day | `date`, `cap`, `ramp_step`, `slots_filled`, `held_reason?` |
| `event_log` | every webhook and poll result, raw | `provider`, `event_type`, `provider_event_id`, `received_at`, `payload jsonb`, `processed_at`, `forwarded_to_quintel_at` |
| `reply` | one inbound message | `outreach_lead_id`, `thread_id`, `message_id`, `received_at`, `body`, `smartlead_category`, `our_class`, `confidence`, `verify_status`, `routing_decision jsonb`, `handoff_sent_at`, `takeover_by?` |
| `mailbox` / `domain` | the fleet registry | `provider` (icemail), `smartlead_email_account_id`, `domain`, `state_code`, `from_name`, `created_at`, `warmup_started_at`, `ready_at`, `daily_limit`, `health` (ok / watch / paused / retired), `bounce_7d`, `complaint_7d`, `reputation_score` |
| `availability` | the lender rep's calendar | `account_id`, `user_id`, working hours, days off, holidays; drives the promise, the re-ping and the acknowledgment cap |

Ironmark holds only what a send and a reply need. It never stores the application, and it can drop its `outreach_lead` snapshot once the lead is done; Quintel has the record.

### 4c. The lead lifecycle (Quintel's `lead.lifecycle`)

```
 sourced → resolved → fit_scored → [rejected]            (below fit threshold, restricted industry, out of state)
                          ↓
                   contact_needed → enriching → [no_contact]   (no email found after the append chain)
                          ↓
                    verifying → [invalid_email]
                          ↓
                    prequal (web check; pass / unknown keep, fail → rejected)
                          ↓
                      ready ──claimed──► in_outreach ──► replied ──► routed ──► (lender states in the register)
                          │                  │                │
                          │                  ├─► bounced / unsubscribed / dnc → suppressed
                          │                  ├─► not_interested → cooldown (90 d) → ready again
                          │                  ├─► not_now → parked(until) → ready again
                          │                  └─► sequence_done (no reply) → cooldown (90 d)
                          └─► held (state paused, cap, brake)
```

Ready-pool membership is a query, not a flag: `lifecycle = ready AND contact.email_status = valid AND NOT suppressed(email, domain, company) AND cooldown_until < now AND state_code IN active_states AND claimed_by IS NULL`.

### 4d. The reply and handoff states (Ironmark `reply` + Quintel `registered_lead`)

```
 reply received → classified → [non-positive: acted on locally, reported to Quintel]
                      ↓ positive (interested / question)
                 verified against pool → [verify_failed → hold for a person]
                      ↓
                 registered (Quintel row created, lender pinged)
                      ↓
                 checked (lender marks: clear / in_book / pass)         ← David, in the register UI
                      ↓
                 routed (Quintel returns: account, rep, cc address, template variant, promise)
                      ↓
        ┌─────────────┴──────────────┐
   handoff_sent                  taken_over
   (case 1: templated email      (case 2: a human at Ironmark owns the thread;
    from the Ironmark mailbox,    automation off for this thread; outcome
    rep's lender address cc'd)    still reported to Quintel)
        ↓
   lender states: contacted → application → approved | declined → funded | dead (+ reason code)
```

## 5. The pipelines

### 5a. Sourcing to ready (Quintel)

1. **Connectors** pull the build-now feeds (`source-feeds.md` §3) into `raw_item` on the existing `source_state` cursor pattern. Four hosts need a US egress. Rosters load as companies and diff month to month; only dated events create `signal` rows.
2. **Resolution** maps each record to a `company` with the existing identity tooling (USDOT → website → name+state+ZIP). Secured-party names on UCC filings join through `lender.aliases`.
3. **ICP fit** scores the company against the Ironmark buy box (a `buy_box` row for the Ironmark "account": 2–25 employees, 2+ years, the preferred and restricted industry lists, intrastate vocational fleets 2–7 units, the six states). Output: `icp_fit_score`, `fit_reasons`, and `origin_kind`. Below threshold or restricted → `rejected` with reason. This is a new scorer next to the trigger scorer, not a change to it.
4. **Contact append** runs the existing `enrichment_job` chain with `contact_requirements = [email]`: website discovery → email finding → verification. The found-and-verified rate on address-only feeds is unmeasured and is the volume gate (`source-feeds.md` §5). Measure it on 200 companies before building more connectors.
5. **Pre-qualification** is a bounded web check per company (site exists, still operating, trade matches, not a restricted industry, fleet or size hints), producing `prequal_status` and the typed `facts` the copy step is allowed to use, each with a source URL. This reuses the triage-agent pattern already in Quintel; it is the same shape of job with a different rubric. Facts are the only input the copy generator may use.
6. **Ready.** The ready-pool query above.

### 5b. Ready to Smartlead (Ironmark)

1. **Claim.** Nightly (and on demand), Ironmark calls Quintel for ready leads per state with a lease: `claimed_by = ironmark`, `claimed_at`, released if not pushed within 24 h.
2. **Plan.** Per campaign per day: cap = min(ramp step × mailboxes, global cap set by Simon) minus follow-ups already due. Intent (event-origin) leads first, then roster leads. A domain with `health = paused` gets zero slots.
3. **Draft.** Two personalized lines from `facts` only, plus fixed copy per arm. A validator rejects any line that references something not in `facts`; a thin-facts lead gets the plain template. Drafts are logged with `facts_used`.
4. **Review.** A random 20 drafts a day in a queue with approve/reject; the push is blocked if rejections exceed a threshold, not on a human having read everything.
5. **Push.** `POST /campaigns/{id}/leads` in batches of up to 400, with the two lines and the packet as custom fields, our `quintel_lead_id` as a custom field, and the email as the Smartlead key. Record `smartlead_lead_id`. Mark `in_outreach` at Quintel with the campaign, arm and copy version.
6. **Hold.** Anything not pushed is released back to Quintel.

### 5c. Smartlead to Ironmark (webhooks and polling)

Smartlead pushes events by webhook and exposes state by API; the API key is a query parameter and the rate limit is plan-dependent (published figures range from 10 per 2 seconds to 60 per minute; design for 60 per minute and back off on 429 with the `retry_after` body). Webhooks retry three times (1, 5, 30 minutes) and carry an HMAC SHA256 signature; there is a retrigger endpoint for failed deliveries. Sources: [webhook events reference](https://api.smartlead.ai/api-reference/webhooks/events), [rate limits](https://api.smartlead.ai/guides/rate-limits), [add leads](https://api.smartlead.ai/api-reference/leads/add-to-campaign), [reply from master inbox](https://api.smartlead.ai/reference/reply-to-lead-from-master-inbox-via-api), [message history](https://api.smartlead.ai/reference/fetch-lead-message-history-based-on-campaign), [email accounts](https://api.smartlead.ai/api-reference/email-accounts/get-all), [warmup stats](https://api.smartlead.ai/api-reference/email-accounts/warmup-stats), [bounce autopause](https://helpcenter.smartlead.ai/en/articles/210-bounce-autopause-and-webhook).

| Smartlead event (webhook) | Ironmark does | Reported to Quintel as |
|---|---|---|
| `EMAIL_SENT` / `FIRST_EMAIL_SENT` | log; mark step n sent on `outreach_lead` | `lead_event: sent (step, mailbox, campaign)` |
| `EMAIL_REPLY` | log raw; create `reply`; classify; run the reply pipeline (5e) | `replied (class)` and the class-specific event |
| `EMAIL_BOUNCE` | log; hard → stop lead, suppress email, increment domain bounce counter; soft → retry policy | `bounced (hard/soft)`; hard → `contact.email_status = bounced`, suppression |
| `LEAD_UNSUBSCRIBED` | log; suppress permanently; mirror to block list | `unsubscribed` → suppression |
| `LEAD_CATEGORY_UPDATED` | log; use as a second opinion on our class; never as the sole trigger for a handoff | `smartlead_category` on the reply |
| `CAMPAIGN_STATUS_CHANGED` | log; alert if paused by bounce autopause | fleet loop |
| `UNTRACKED_REPLIES` | log; a person looks (a reply outside a known thread, or to a handoff email) | none until classified |
| `EMAIL_OPEN` / `EMAIL_LINK_CLICK` | not subscribed in v1 (no pixels, no tracked links) | |

Every webhook is stored raw in `event_log` before parsing, keyed on the provider's event id plus message id for idempotency. A 15-minute poll of the master inbox (`statistics` with `email_status = replied`, and `message-history` per lead) backfills anything a webhook missed.

Polled, not pushed:

| Poll | Cadence | Feeds |
|---|---|---|
| `GET /email-accounts` (filters: warmup status, `isSmtpSuccess`), per-account `warmup-stats` (sent, spam count, inbox count, reputation score, daily stats) | hourly health, daily stats | `mailbox.health`, the brakes, replacement orders |
| campaign statistics (sent, replied, bounced, unsubscribed per campaign) | daily | measurement; reconciliation against our event counts |
| `message-history` for a lead | on demand at handoff and takeover | the thread shown to David and to the human who takes over |

Writes Ironmark makes:

| Purpose | Endpoint (v1 API) |
|---|---|
| push leads with custom fields | `POST /campaigns/{id}/leads` (≤400 per call) |
| stop a lead (parked, suppressed, routed) | `POST /campaigns/{id}/leads/{lead_id}/pause`; resume for not-now re-entry |
| update a lead's fields or category | `POST /campaigns/{id}/leads/{lead_id}`, category update endpoint |
| set schedule, window and daily cap per campaign | campaign schedule / settings endpoints |
| assign or remove mailboxes on a campaign | email-account assignment endpoints |
| **send the handoff email in the owner's thread** | `POST /campaigns/{id}/reply-email-thread` (needs the reply's `email_stats_id` / message id) |
| mirror suppression | global block list endpoints |

**To verify in the first spike:** whether `reply-email-thread` supports a Cc (the handoff copies the lender rep). If it does not, the fallback is to send the handoff email directly through the mailbox's SMTP (we hold the credentials via Icemail) with `In-Reply-To` and `References` set so it threads, and to tell Smartlead by pausing the lead. Decide in the spike, not later.

### 5d. Ironmark to Quintel (the feedback loop)

One endpoint, one shape: `POST /v1/leads/{lead_id}/events` with `kind`, `at`, `source_system`, `idempotency_key`, `payload`. Quintel applies each kind to the lead, the contact, suppression and the register:

| kind | Quintel effect |
|---|---|
| `claimed`, `released`, `pushed (campaign, arm, copy_version, smartlead_lead_id)` | lifecycle; the experiment labels |
| `sent (step)` | counts |
| `bounced (hard)` | `contact.email_status = bounced`; suppression(email); lifecycle `suppressed` |
| `bounced (soft)` | counter only |
| `invalid_email` (rejected by Smartlead or verifier on push) | `contact.email_status = invalid`; back to `contact_needed` if another candidate exists |
| `unsubscribed`, `dnc` | suppression(email, forever); lifecycle `suppressed` |
| `replied (class, confidence, smartlead_category)` | label on the lead; lifecycle `replied` |
| `not_interested` | cooldown 90 d |
| `not_now (until)` | `parked`, re-enters ready at the date |
| `wrong_person (referred_name?)` | suppression(email); a new contact candidate if a name was given |
| `verify_failed` | hold; a person clears or rejects |
| `positive` | **creates the `registered_lead` row under the routing account, attaches reply and the email it answered, starts the clock, notifies the lender** |
| `handoff_sent (to, cc, variant)` / `taken_over (by)` | register event |
| `sequence_done` | cooldown 90 d |

Quintel's answers back are read by Ironmark, never pushed: the ready pool, the suppression list (with a `since` cursor for the block-list mirror), and the routing decision for a registered lead (5e).

### 5e. The reply and handoff engine (Ironmark, with Quintel for the record)

This is the part neither the send model nor the ledger scoped, and it is on the critical path (`outbound.md` §3). Built to hold the two cases Simon set on 09-26, and shaped so a third case (a second lender) is a routing row, not a code change.

1. **Ingest.** `EMAIL_REPLY` webhook (plus the 15-minute poll) → raw `event_log` → `reply` row with the thread and the email it answered.
2. **Classify.** Rules first for the classes with legal or deliverability weight (bounce codes, list-unsubscribe, "remove me" forms, auto-reply headers). A model picks one of `interested / question / not now / not interested / wrong person / do not contact / out of office / cannot tell` with a confidence; Smartlead's own category is an input, not the decision. First 200 replies: a person confirms every class before any action. After that only `cannot tell` and low confidence go to a person. No drafting anywhere in this step.
3. **Verify (positives only).** Ask Quintel whether the replying address or stated business reconciles with the company on the lead (domain, FMCSA legal name, SOS officer). Fail → hold; nothing reaches the lender.
4. **Register.** `positive` event to Quintel → Quintel creates the `registered_lead` row under the routing account (Providence for now), attaches the reply and the original email, notifies the lender's user (Slack, text) with the packet, starts the two-hour clock. **No email goes to the owner yet.**
5. **Check.** David opens the row in the register UI and marks: `clear`, `in_book (customer | other AE | contacted <9 mo)`, or `pass (out of box | no capacity)`. This is his only required action before the handoff.
6. **Route.** Quintel applies the routing rules and returns a decision to Ironmark: `{account, rep_user, cc_address, template_variant, promise_window, mode: handoff | takeover | park}`. Rules for phase 1 (`outbound.md` §5f): clear → Providence, David; in book (customer, other AE) → mode `handoff` to the AE of record via David's cc choice, no referral claimed, company suppressed for future sends; contacted <9 mo → `park` unless David has approved re-routing for the class; pass → `takeover` (Ironmark handles it by hand) until a second lender is seated, then that lender.
7. **Handoff (case 1).** Ironmark sends the one templated email in the owner's thread from the Ironmark mailbox, signed by the Ironmark sender, naming the rep and the lender, copying the rep's lender address, with the timeline promise from `availability` and the pick-a-time link. **Trigger:** a "send handoff" action on the register row that David presses after his check, with the cc address pre-filled to his own Providence address and editable to another AE's. The engine sends; David does not need mailbox credentials and the email is signed consistently. If he has not pressed it within the cap (one hour in his working day), the engine sends the unnamed acknowledgment and the named one follows his check (`outbound.md` §5g).
8. **Takeover (case 2).** Routing says `takeover`: automation stops for the thread, the lead is paused in Smartlead, the thread lands in the Ironmark human inbox (the master inbox view filtered to taken-over threads) with the row link. Whatever happens is reported back as register events by hand. This is also the fallback for anything the engine cannot handle.
9. **Outcomes.** David's flags and reason code on the register row are the end of the loop; Quintel writes the lead label and the fee line.

Design constraints on this engine: every step idempotent on `(thread_id, message_id)`; every message to an owner is one of the fixed templates with five slots; every decision is a row somebody can read later; the whole thing degrades to "a person reads the master inbox" if any part is down, without losing the ledger row.

### 5f. The mailbox fleet (Icemail + Smartlead, run by Ironmark)

What exists: 30 mailboxes on 6 state domains, provisioned in Icemail, warming in Smartlead since about 09-22; sender names currently David's (to change per `outbound.md` §5b once the sender is decided).

Icemail's public API (per its site; the docs host was not reachable from this session, so verify) provisions domains and Google or Microsoft mailboxes, handles DNS, returns credentials and status, exports mailboxes to Smartlead, and offers webhooks and SDKs. Sources: [Icemail API page](https://icemail.ai/icemail-api), [Icemail on automating setup](https://icemail.ai/blog/automate-email-domain-mailbox-setup-tools-outreach).

Ironmark's fleet registry tracks every domain and mailbox: provider ids on both sides, state, from-name, warmup start and ready date, daily limit, 7-day bounce and complaint rates, Smartlead's reputation score, and `health`. Rules:

- Ramp per mailbox after warmup: 10, 15, 20, 30 a day over two weeks; the planner reads the ramp, not a constant.
- Brakes: domain over 3% bounce → `paused`, zero slots, alert; mailbox with `isSmtpSuccess = false` → `paused`; reputation below a floor after 600 sends → `watch`, then rotate out.
- Replacement: a `paused` domain for more than 7 days triggers an Icemail order for a replacement domain and mailboxes; the new set warms for two weeks before it takes slots. Second domain per state should start warming now.
- Sender display names are a fleet operation (Smartlead email-account update), not a copy change.

## 6. Interfaces

### 6a. Quintel → Ironmark (Ironmark reads)

| Endpoint | Purpose | Notes |
|---|---|---|
| `GET /v1/outreach/ready?state=&arm=&limit=&cursor=` | the ready pool | returns lead id, contact, company packet, `facts`, `origin_kind`, fit score; sets the lease on return |
| `POST /v1/outreach/release` | give back unpushed claims | |
| `GET /v1/suppression?since=` | mirror to Smartlead block list | scope + value + reason |
| `GET /v1/register/{registered_lead_id}/routing` | the routing decision after the lender's check | see 5e step 6; long-poll or webhook from Quintel when the check lands |
| `GET /v1/leads/{id}/verify?reply_from=&stated_business=` | pool verification for a positive | three-state answer with the matched fields |

Auth: service token per system; every request logged with actor `ironmark`. Quintel already has `staff_api_token` and agent-actor audit patterns to reuse.

### 6b. Ironmark → Quintel (Ironmark writes)

`POST /v1/leads/{id}/events` as in 5d, plus `POST /v1/register/{id}/events` for handoff and takeover. Idempotency key required; Quintel returns the applied state so Ironmark can reconcile.

### 6c. Quintel → lender (David)

The register UI (a page in Quintel behind David's login, `ledger.md` §5): queue with the clock, the row with reply and original email, the check control, the "send handoff" action with editable cc, the four flags, reason code, export in LeasePath order, monthly reconciliation. Notifications: Slack and text on `positive`, re-ping at two hours, 7 AM Eastern digest, weekly numbers Tuesday. Quintel's existing `msg`, `email_message` and notification machinery carries these.

### 6d. Smartlead ↔ Ironmark

Webhooks to one Ironmark endpoint per campaign (HMAC verified, raw-logged, idempotent on provider ids); polls and writes per 5c. One Smartlead workspace; 12 campaigns (6 states × intent/general) to start; the vendor arm is a later campaign set on separate domains.

### 6e. Icemail ↔ Ironmark

Orders and status by API or by hand in v1 (30 mailboxes exist); the registry is the record. Automate the replacement order once the first domain has to be replaced, not before.

## 7. Feedback loops, stated as questions the data answers

| Loop | Question | Where the label comes from | Who acts |
|---|---|---|---|
| Feed → outcome | which feeds and origin kinds produce positives and applications | `lead.origin_feed`, `origin_kind` × register outcomes | Quintel: connector priority; Simon: what to build next |
| Copy → reply | which arm and copy version get replies and positives, per state | `pushed (arm, copy_version)` × `replied (class)` | Ironmark: arms; Alek: copy |
| Contact append → volume | found-and-verified rate by feed and state | `enrichment_job` outcomes | Quintel: provider chain; volume plan |
| Check → routing | collision rate by state and feed; re-route yield once a second lender exists | register `check_result` | routing rules; the Providence conversation |
| Reason codes → selection | why leads die after handoff (credit, timing, price, out of box, unreachable) | David's reason code | ICP scorer, buy-box edges, the lanes |
| Fleet → capacity | bounce, complaint, reputation by domain and mailbox | Smartlead events and polled stats | planner caps, brakes, Icemail orders |

Pre-registered gates from the infra plan still hold: bounce under 3% per domain; scale an arm at 1% positive; stop and rewrite under 0.3% after 600 sends.

## 8. Non-functional requirements

- **Idempotency everywhere.** Webhooks, feed pulls, event posts and pushes all carry keys; replays are safe. Raw payloads are stored before parsing.
- **Auditability.** Every state change on a lead or a register row has an actor (`quintel`, `ironmark`, `smartlead`, a user) and a reason. Nothing is deleted; wrong rows are voided.
- **PII boundary.** Business contact data only. No application fields exist in either schema. The register's `identity` and `signal_context` are business facts.
- **Compliance.** Truthful sender (a real Ironmark person), postal address and working opt-out on every message, opt-out honored in minutes, plain text, no pixels. Counsel questions logged in `compliance.md` when it exists (state disclosure, the header question if the sender is ever a lender's employee).
- **Availability model.** If Ironmark is down, Smartlead keeps sending what was pushed and buffers webhooks for three retries plus the retrigger endpoint; the 15-minute poll backfills. If Quintel is down, Ironmark queues events locally and does not push new leads. If both are down, replies sit in the master inbox and a person reads them; the ledger row is created when Quintel returns.
- **Observability.** Per day: sends, deliveries, bounces, replies by class, positives, registered, checked within cap, handoffs sent, takeovers, hours to contacted; per domain and mailbox: the fleet numbers; per system: webhook lag, poll backlog, event-post failures. One dashboard, one weekly export for the Tuesday review.
- **Hosting.** Feed fetches for the four geoblocked hosts run from a US host. Smartlead and Icemail secrets live only in Ironmark. Quintel's existing provider policy and spend ceilings cover enrichment.

## 9. Build plan

Two tracks, one integration point each week. The reply and handoff engine is built before more connectors, because the general bucket carries week one and the first positive arrives the first morning.

| Week | Quintel | Ironmark | Together |
|---|---|---|---|
| **1 (to 10-03)** | `lead`, `lead_event`, `suppression` tables; Ironmark buy box and ICP scorer v0; ready-pool query and `GET /ready` with leases; `POST /events` applying the 5d table; register additions (check, flags, LeasePath id, reason, fee) and the "send handoff" action; routing rules v0; notifications | Smartlead client and webhook receiver with raw log; `outreach_lead`, `reply`, `event_log`, `mailbox` registry; classifier (rules + model + confirm gate); handoff email templates and the `reply-email-thread` spike (Cc?); planner with ramp and global cap; push in batches | end-to-end test on 20 seeded leads with real mailboxes and a test recipient: reply → register → check → handoff email in thread with cc |
| **2 (10-06 first send)** | contact-append measurement on 200 address-only companies; CO UCC and FMCSA connectors live; prequal job v0 with `facts` | fleet health poll and brakes; 15-minute reply poll; takeover inbox view; daily digest | first send at ~500 a day; person confirms every class; Tuesday numbers |
| **3–4** | remaining build-now connectors by measured yield; `lead_prospect_overlap` view; register page polish and export | ramp to 900; sampled draft review; second domains into rotation; Icemail replacement flow if needed | first re-measure of the 3-per-1,000 rate; gates checked |
| **later** | second originator account and routing rows; site inbound door creating leads on the same object | vendor arm campaigns on separate domains; drafted-reply experiment after 100 labeled positives | phase-2 commercial gate on the register's count |

Engineering tasks fall out of the rows above; each cell is one to three tickets. The contract in §6 is the thing to agree first, because both tracks build against it.

## 10. Decisions needed before tickets are cut

Answers change the tickets, so they come first. Recommendations are stated; a different call is fine.

1. **Where the register (David's ledger) lives.** Recommendation: Quintel, on the existing `registered_lead` / `register_event` with Providence as an account and David as a user, so the second originator is a row and David's login already exists. Alternative: Ironmark owns it and Quintel gets outcomes; cleaner brand separation, but duplicates accounts, users and attribution logic.
2. **Ironmark as a separate deployable with its own database, talking to Quintel only through §6.** Recommendation: yes. It keeps the lanes honest, lets the channel be swapped or duplicated (a second brand), and stops Smartlead concerns leaking into the record. Cost: the API contract has to be built in week 1.
3. **Case 1 mechanics.** Simon's sketch has David replying from the Ironmark email with his Providence address cc'd. Recommendation: David triggers it from the register row and the engine sends the templated email, signed by the Ironmark sender, cc'ing the address David picks. Same outcome, no mailbox credentials for David, consistent signature, and the cap fallback works. If David wants to write the email himself, give him the master inbox with the same template pre-filled; decide after his first ten.
4. **Case 2 in phase 1: takeover by a person, or a second lender by cc.** Recommendation: takeover by a person until a second originator is seated; the routing row exists from day one so the switch is configuration.
5. **Classification source.** Smartlead has AI reply categories and fires `LEAD_CATEGORY_UPDATED`. Recommendation: ours decides, theirs is an input; a handoff never fires on their category alone.
6. **Sender name on the 30 mailboxes** (`outbound.md` §5b; focus group Saturday). This is a fleet operation and a copy slot; the build does not wait on it.
7. **Whether Ironmark keeps any company data beyond the send snapshot.** Recommendation: no; Quintel is the record and the snapshot is dropped when the lead is done.
8. **Smartlead's global block list versus per-campaign.** Recommendation: mirror our suppression to the global list and rely on it as a backstop only.

## 11. What "done" looks like for phase 1 of the build

An owner in one of six states replies to an Ironmark email. Within minutes David's phone shows the row with the reply and everything we know about the business. He marks the book check. He presses one button and the owner receives one email in the same thread naming David and Providence, with David copied, promising a call at the time the rules allow. David calls, takes the application through Providence, and ticks four boxes with a reason code when it ends. The lead, the contact and the company in Quintel carry every event that happened, the feed and copy that produced it, and the outcome. Nothing in either system holds the application. Bounce stayed under 3%. And when the same reply comes from a company already in Providence's book, the thread lands in a person's inbox at Ironmark instead, with the row still on the ledger.
