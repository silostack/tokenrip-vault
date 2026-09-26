---
status: v0.2 PRD, the starting point for Quintel and Ironmark engineering tasks (v0.1 re-architected 09-26: Ironmark is a standalone system, Quintel is its first lead source behind an adapter, the register lives in Ironmark)
last_revised: 2026-09-26
owner: Simon
serves: what the outbound engine is for, how the systems divide the work, the data each owns, the contracts between them, the feedback loops, and the build order; enough for the whole system to come into view from an engineering seat without the copy, the classifier prompts or the per-feed plumbing
tier: internal (shareable with Alek in full)
relationship: `launch.md` is the six-week plan; `outbound.md` is the design reasoning and the decisions (§5b, §5e, §5f, §5g); `ledger.md` is David's view; `source-feeds.md` is the feed inventory; `vendor-apis.md` is the Smartlead and Icemail catalog this doc builds on; `funnel.md` is the lead lifecycle this implements. This doc is what gets built.
---

# Build: Ironmark, a standalone outbound engine, with Quintel as its first lead source

## 1. Why we are building this

**The business problem.** Equipment-finance originators find borrowers by dialing lists and by vendor relationships. Both are slow, and dialing does not work under a new brand: 250–300 dials on verified lists produced zero applications, and the word "financing" gets a hang-up from owners who carry equipment liens. Email under an unknown finance brand draws fraud and nothing else. The originator we work with, David at Providence Capital Funding, is a good closer with no lead flow of his own and a hard ceiling on how many applications he can key by hand.

**What we are building.** A machine that takes qualified leads from a lead source, emails them under a brand it owns (Ironmark) in the recipient's own trade terms, verifies every reply, checks it against the partner's book, and hands the right person at the right partner a warm, contextual lead the same day, with a shared record from reply to outcome so the referral is provable and every dead lead comes back as a labeled reason.

**Why Ironmark is its own system, not a Quintel feature.** Sourcing and outreach change at different rates and for different reasons. Quintel's sourcing engine is equipment-finance public records today; for another industry it could be Apollo, ZoomInfo, a CSV, or someone else's data. The outbound machine (brand, fleet, sequencing, reply handling, handoff, register) is the same shape regardless of where leads come from and who they are handed to. So Ironmark is built to stand alone: it talks to a **lead source** through one contract, to a **destination** (a lender, a rep, later a CRM) through another, and to a **sequencer** and a **fleet provider** through two more. Quintel is the first lead source. Providence is the first destination. Smartlead and Icemail are the first vendors behind the last two ports. Any of the four can be swapped without touching the others, and the whole thing can be sold as a service to a different target customer later.

**Why it is worth building rather than buying.** The sequencer, the mailboxes and the warmup are commodities; we rent them. What nobody sells is the loop: a verified entity, a stated intent, a partner's outcome and a reason code on the same row, plus the operating discipline around it (check before you reply, suppress in minutes, brake a domain before it burns). That loop is the asset and the product.

**Goals, in order.**

1. Prove the mechanism end to end: an owner replies to an Ironmark email, David funds the deal, Providence codes and pays the referral. Phase-1 target is five attributed funded deals (`launch.md` §2a).
2. Run at 900 sends a weekday on 30 mailboxes without burning a domain, with bounce under 3% and a positive-reply rate we can measure per source, state and copy arm.
3. Keep David's side to reading and typing: a queue on his phone, a check, one button, four flags, a reason code.
4. Build Ironmark so that a second lead source, a second destination, a second brand, or a second tenant is configuration and an adapter, not a rewrite.

**Non-goals for this build.** No AI-written conversation with a prospect (one templated handoff email, until 100 positives are labeled; `outbound.md` §3c). No application, SSN, bank statement or guarantor data in Ironmark or Quintel, ever. No LeasePath integration. No vendor-channel outreach (separate program, later a second campaign set). No inbound site funnel (later a second lead source into the same lead object).

**Working numbers.** Sends per weekday at full plan 900; positive replies about 3 per 1,000 (Alek's number from a ~1,000-send test, small); applications about 1 per 1,000; David's realistic ceiling about five applications a day. Every number is re-measured on the first 2,000 sends.

## 2. The lanes

The rule for drawing the line: **the lead source knows who a company is. Ironmark knows what was said to it and what happened. Vendors do what they are told.**

| | Owns | Does | Does not |
|---|---|---|---|
| **Ironmark** (the outbound system) | its lead object and contacts (as received from a source, with source ids), the suppression list of record for the channel, sending identities and the mailbox fleet, campaigns and plans, copy generation, the reply engine, routing, the handoff, the **register** (partner-facing ledger), partner accounts and users, notifications, the numbers | pulls ready leads from a source, drafts, plans, pushes, receives every sequencer event, classifies, verifies (asking the source), registers positives, notifies the partner, takes the check, routes, sends the handoff, records outcomes, reports every event back to the source | decide who a company is or whether it fits; hold applications; keep a copy of the source's whole pool |
| **Quintel** (first lead source) | companies, contacts, identity resolution, feeds, the Ironmark-fit lead pool, enrichment and verification, pre-qualification facts, the lender product and its own prospects | resolves entities, scores ICP fit, finds and verifies emails, gathers facts, serves the ready pool through the lead-source contract, accepts every outreach event as labels, answers verification questions | send email; hold mailbox credentials; know about Smartlead; own the register |
| **Smartlead** (sequencer) | sending, rotation, warmup, schedules, stop-on-reply, master inbox, bounce autopause, its block list | sends what Ironmark pushes; fires one user-level webhook stream; exposes threads, mailbox health and analytics; replies in-thread on command with cc | decide what to send to whom; be a source of truth |
| **Icemail** (fleet provider) | domain purchase, DNS, mailbox creation, credentials, export to the sequencer | provisions and replaces domains and mailboxes on order; fires webhooks when a mailbox or export is live | send campaign mail; know about leads |
| **Partner** (Providence, David) | the partner's book, the call, the application, the deal | checks each positive against the book and marks it; presses the handoff; calls the same day; sets four flags and a reason code | anything requiring Providence IT |
| **Ironmark sender** (a founder) | the name on the emails | answers owner questions before the call; owns taken-over threads | write per-lead copy (software does); classify (software does) |

Boundary rules:

- Ironmark never creates a company and never scores fit; it asks the source. The source never emails anyone and never sees a mailbox password.
- Ironmark's suppression list is authoritative for "may this address be emailed by this brand." The source's contact status is authoritative for "is this address real." Each feeds the other.
- Vendor state is a mirror. Every vendor event is logged raw in Ironmark before it is acted on; if Ironmark and a vendor disagree, Ironmark's record wins and reconciles the vendor.
- No application data crosses any boundary. The handoff ends at "who calls."
- Ironmark carries a `tenant_id` on every row from day one. There is one tenant (Ironmark Equipment Partners); the column costs nothing now and everything later.

## 3. Architecture: four ports, one core

```
                       ┌──────────────────────────────────────────────────────────────────────┐
   LEAD SOURCES        │                        IRONMARK CORE                                  │        DESTINATIONS
   (port: LeadSource)  │                                                                      │   (port: Destination)
                       │  leads ─► plan ─► drafts ─► push ─► [sequencer] ─► events ─► replies  │
 ┌──────────────┐      │    ▲                                                   │             │      ┌────────────────┐
 │ Quintel      │──────►  claim / release                                classify, verify      │      │ Providence     │
 │ adapter (v1) │◄─────│  feedback events                                        │             │──────► register UI,  │
 └──────────────┘      │  verify(reply)                                      register ──► check │      │ Slack/text,    │
 ┌──────────────┐      │                                                         │  ──► route   │      │ handoff email  │
 │ CSV / Apollo │      │  suppression (record)  ◄────────────────────────── act by class        │      └────────────────┘
 │ (later)      │      │  fleet registry, brakes ◄──── health polls              │             │      ┌────────────────┐
 └──────────────┘      │  numbers, dashboard                                 handoff / takeover│      │ 2nd lender /   │
                       └───────────┬──────────────────────────┬───────────────────────────────┘      │ CRM (later)    │
                                   │ port: Sequencer          │ port: FleetProvider                  └────────────────┘
                            ┌──────▼───────┐           ┌──────▼───────┐
                            │  Smartlead   │           │   Icemail    │
                            │  adapter     │           │   adapter    │
                            └──────────────┘           └──────────────┘
```

Four ports, each a small interface with one implementation in v1:

| Port | v1 adapter | Later adapters | What crosses it |
|---|---|---|---|
| `LeadSource` | Quintel (HTTP) | CSV file, Apollo, ZoomInfo, the Ironmark site's inbound form | the Lead Envelope (§4b), claims, feedback events, verification questions |
| `Destination` | Providence (register UI + Slack/text + handoff email) | a second lender; a CRM webhook; a partner API | the routed lead, the check result, the handoff, the outcome |
| `Sequencer` | Smartlead | Instantly, others | pushes, pauses, thread replies, webhooks, health |
| `FleetProvider` | Icemail | Smart Senders, manual | orders, mailbox status, credentials, export |

Three loops run through the core:

1. **Outcome loop (learning).** Every send, reply class, route and partner outcome is an event on the lead. Ironmark keeps them; the source receives them as labels and uses them to pick what to source next.
2. **Suppression loop (safety).** Unsubscribe, hard bounce, DNC and "in the partner's book" land in Ironmark's suppression list within minutes, then flow out to the planner, to the sequencer's block list, and to the source.
3. **Fleet loop (deliverability).** Bounce and complaint rates per mailbox and domain, from sequencer events and health polls, throttle the planner, pause a domain, and place a replacement order with the fleet provider.

## 4. Data

### 4a. Lead, prospect, trigger: keeping the tracks straight

Quintel already has **prospects**: a company plus a dated **trigger**, surfaced to a lender account in Quintel's own product. For Ironmark, Quintel produces **leads**: a company plus a contact that fits the Ironmark buy box, with or without an event behind it. Same company and contact tables in Quintel, different objects on top, separate tracks.

| | Prospect (Quintel, exists) | Lead (Quintel → Ironmark, new) |
|---|---|---|
| What it is | a company with a live trigger, ranked, delivered to a lender's queue | a company + contact fitting the buy box, queued for outreach |
| Selected by | trigger state and score, buy box | ICP fit, contact availability, state, cooldown |
| Consumer | lender users in Quintel | Ironmark, through the LeadSource port |
| Event behind it | always | `origin_kind = event` (a UCC filing, a permit, a fleet add) or `origin_kind = roster` (a standing list) |
| Link | | `trigger_event_id?`, `signal_ids[]` on the Quintel side; the envelope carries `origin_kind` and the facts, not Quintel's internals |

A lead may also be a prospect (same Quintel `company_id`). Keep both; expose the overlap as a Quintel view so we can test later whether event-origin leads convert better. Ironmark never sees Quintel's prospect objects; it sees envelopes.

### 4b. The Lead Envelope: the neutral shape every source speaks

The contract that makes the source swappable. A source maps its own data into this; Ironmark stores it with the source's id and never reaches behind it.

```
LeadEnvelope {
  source: "quintel" | "csv" | "apollo" | ...,   source_lead_id, source_company_id?, source_contact_id?
  tenant_hint?                                   (which Ironmark tenant this is for)
  contact:  { email, first_name?, last_name?, title?, phone?, email_status: valid|unverified }
  company:  { name, dba?, website?, city, state, country, industry_code?, industry_label,
              size_band?, years_in_business?, fleet_band?, identifiers: { usdot?, mc?, sos_id?, ucc_ref? } }
  fit:      { score, reasons[], box_version }
  origin:   { kind: event|roster, feed, event_date?, event_summary? }
  facts:    [ { key, value, source_url, observed_at } ]   ← the ONLY input the copy generator may use
  prequal:  pass | unknown | fail
  routing_hints?: { states[], lanes[] }
  fetched_at
}
```

Rules: `facts` are typed and sourced or they are not facts. `email_status` is the source's verdict; Ironmark may re-verify. Nothing in the envelope is PII beyond a business contact. A CSV adapter fills the same shape with `facts = []` and gets the plain template.

### 4c. Ironmark's domain model

| Entity | Purpose | Key fields (beyond ids, tenant, timestamps) |
|---|---|---|
| `tenant` | one operating brand | name, brand, postal address, opt-out text, default sender identity |
| `lead_source` | a configured source instance | `kind`, credentials ref, pull schedule, enabled |
| `lead` | Ironmark's unit of work | `source_id`, `source_lead_id`, envelope snapshot, `state_code`, `origin_kind`, `fit_score`, `lifecycle` (§4d), `claimed_at`, `cooldown_until`, `parked_until` |
| `contact` | the address on a lead | `lead_id`, `email`, `email_status`, `name` |
| `suppression` | **the list of record for this brand** | `scope` (email / domain / company_key), `value`, `reason` (unsubscribe / hard_bounce / dnc / partner_book / manual / legal), `source_system`, `until` (null = forever), `lead_id?` |
| `sender_identity` | the name on the emails | display name, real person ref, signature block, mailboxes it may use |
| `domain`, `mailbox` | the fleet registry | provider ids on both vendors, `state_code`, `sender_identity_id`, warmup start, ready date, `daily_limit`, `daily_sent`, `health` (ok / watch / paused / retired), `bounce_7d`, `complaint_7d`, `reputation_score` |
| `campaign` | one sequencer campaign | `sequencer_campaign_id`, `state_code`, `arm`, schedule, `daily_cap`, mailboxes |
| `daily_plan` | one row per campaign per day | `date`, `cap`, `ramp_step`, `slots_filled`, `held_reason?` |
| `draft` | generated copy for a lead | `lead_id`, `line1`, `line2`, `template_version`, `facts_used[]`, `validator_result`, `reviewed_by?` |
| `outreach` | a lead inside a campaign | `lead_id`, `campaign_id`, `sequencer_lead_id`, `status` (pushed / active / paused / stopped / done), `pushed_at`, `last_step` |
| `event_log` | every vendor webhook and poll result, raw | `provider`, `event_type`, `provider_event_id`, `payload`, `received_at`, `processed_at`, `forwarded_to_source_at` |
| `reply` | one inbound message | `outreach_id`, `thread_id`, `message_id`, `email_stats_id` (from the sequencer, needed to reply), `received_at`, `body`, `sequencer_category`, `our_class`, `confidence`, `verify_status`, `handled_by` |
| `partner` (destination) | a lender or other receiving org | name, kind, routing config, `attribution_window_days`, `sla_hours` |
| `partner_user` | a person at a partner | login, phone, Slack, `availability` (hours, days off, holidays) |
| `routing_rule` | who a positive goes to | `partner_id`, `states[]`, conditions, `collision_policy`, priority |
| `registered_lead` | **the register: one row per positive reply** | `lead_id`, `reply_id`, `partner_id`, `partner_user_id`, `registered_at` (the attribution timestamp), the packet snapshot, `check_result` (clear / in_book:customer / in_book:other_rep / in_book:contacted_9mo / pass), `rep_of_record?`, `route_mode` (handoff / takeover / park), `handoff_sent_at`, `cc_address`, four flags with dates (contacted, application, approved|declined, funded|dead), `partner_deal_ref` (LeasePath id), `referral_coded`, `gm`, `reason_code`, `reason_note`, `fee_due`, `fee_invoiced_at`, `fee_paid_at`, `voided` |
| `register_event` | audit log on a register row | `registered_lead_id`, `actor` (system / partner_user / ironmark_user), `from`, `to`, `reason`, `at` |
| `lead_event` | every event on a lead, from any system | `lead_id`, `kind`, `at`, `source_system`, `payload`, `idempotency_key`, `forwarded_to_source_at` |

The register's shape borrows deliberately from Quintel's `registered_lead` / `register_event` (attribution window, actor-typed audit, void-not-delete); it is re-implemented in Ironmark so the outbound system stands alone.

### 4d. Lifecycles

**Lead (Ironmark `lead.lifecycle`)**

```
 received → ready ──claimed──► planned → drafted → pushed → active ──► replied ──► registered ──► (register states)
                │                                            │
                │                                            ├─► bounced_hard / unsubscribed / dnc → suppressed
                │                                            ├─► not_interested → cooldown(90d) → ready
                │                                            ├─► not_now → parked(until) → ready
                │                                            └─► sequence_done → cooldown(90d)
                └─► held (state paused, cap, brake, source says stop)
```

Ready is a query: `lifecycle = ready AND contact.email_status ∈ {valid} AND NOT suppressed(email, domain, company_key) AND cooldown_until < now AND parked_until < now AND campaign for state_code is open`.

**Register (`registered_lead`)**

```
 registered (partner pinged, clock started, NO email to the owner yet)
     → checked (partner marks: clear | in_book:* | pass)          ← the one required human step
     → routed  (rule → partner_user, cc_address, template_variant, promise_window, route_mode)
         ├─ handoff_sent   (case 1: templated email in the owner's thread from the Ironmark mailbox,
         │                  signed by the sender identity, cc the rep's partner address)
         ├─ taken_over     (case 2: automation off for the thread; an Ironmark person owns it)
         └─ parked         (waiting on a destination that does not exist yet)
     → contacted → application → approved | declined → funded | dead (+ reason code)
```

## 5. The pipelines

### 5a. Source side: Quintel produces the ready pool

Quintel builds and serves; Ironmark never runs this.

1. **Connectors** pull the build-now feeds (`source-feeds.md` §3) on Quintel's existing `source_state` cursor pattern. Four hosts need a US egress. Rosters load as companies and diff monthly; only dated events create signals.
2. **Resolution** maps records to `company` with Quintel's identity tooling; UCC secured parties join through `lender.aliases`.
3. **ICP fit** scores against an Ironmark `buy_box` row (2–25 employees, 2+ years, preferred and restricted lists, intrastate vocational fleets 2–7 units, the six states) into a Quintel-side `lead` row with `fit_score`, `fit_reasons`, `origin_kind`. New scorer beside the trigger scorer.
4. **Contact append** runs the existing `enrichment_job` chain with `contact_requirements = [email]`. The found-and-verified rate on address-only feeds is the volume gate (`source-feeds.md` §5); measure it on 200 companies before more connectors.
5. **Pre-qualification** is a bounded web check per company (exists, operating, trade matches, not restricted, fleet or size hints) producing `prequal` and the typed, sourced `facts`. Reuses the triage-agent job shape with a different rubric.
6. **Serve.** Quintel exposes the LeadSource provider API (§6a) over its ready-pool query, with leases.

### 5b. Ironmark: claim to push

1. **Claim.** Nightly and on demand, per state: `pull(ready, state, limit)` → envelopes → `lead` rows with a lease on the source side; unpushed leads released within 24 h.
2. **Plan.** Per campaign per day: cap = min(Σ mailbox ramp steps, tenant daily cap) − follow-ups due. Event-origin leads first, then roster. Paused domains get zero slots.
3. **Draft.** Two lines from `facts` only, plus the arm's fixed copy. Validator rejects any reference not in `facts`; thin facts → plain template. `facts_used` logged per draft.
4. **Review.** Random 20 drafts a day, approve/reject; push blocked above a rejection threshold.
5. **Push.** Sequencer `pushLeads(campaign, batch ≤400)` with custom fields (the two lines, the packet, `ironmark_lead_id`, `source_lead_id`). Record `sequencer_lead_id`; emit `pushed` to the source with campaign, arm, template version. Smartlead's `skipped_leads[].reason` becomes `invalid_email` or `duplicate` events.
6. **Hold and release** anything not pushed.

### 5c. Sequencer to Ironmark: events and polls (Smartlead v1)

Per `vendor-apis.md`. One **user-level** webhook (`association_type=user`) so twelve campaigns share one URL; HMAC-SHA256 verified; raw-logged before parsing; idempotent on provider ids plus message id; retries three times, plus the retrigger endpoint for replays. Rate limit designed for 60/min with backoff; the domain-health endpoint has its own 10/min ceiling.

| Sequencer event | Ironmark does | Lead event to the source |
|---|---|---|
| `EMAIL_SENT` | mark step on `outreach` | `sent(step, mailbox, campaign)` |
| `EMAIL_REPLY` | create `reply`; **fetch `email_stats_id` via message-history** (not on the webhook); run §5e | `replied(class)` and the class event |
| `EMAIL_BOUNCE` | hard: stop outreach, suppress email, bump domain bounce counter; soft: retry policy | `bounced(hard|soft)` |
| `LEAD_UNSUBSCRIBED` | suppress forever; mirror to block list | `unsubscribed` |
| `LEAD_CATEGORY_UPDATED` | store as `sequencer_category`; never the sole trigger for a handoff | attribute on the reply |
| `CAMPAIGN_STATUS_CHANGED` | alert on bounce-autopause | fleet loop |
| `UNTRACKED_REPLIES` | a person looks (handoff replies can land here) | none until classified |
| `EMAIL_ACCOUNT_DISCONNECTED` (separate per-user webhook) | mailbox → `paused`; alert | fleet loop |
| `EMAIL_OPEN`, `EMAIL_LINK_CLICK` | off in v1 (`DONT_EMAIL_OPEN`, `DONT_LINK_CLICK`) | |

Polls:

| Poll | Cadence | Feeds |
|---|---|---|
| `POST /master-inbox/inbox-replies` (`emailStatus=Replied`) and `GET /master-inbox/untracked-replies` | every 15 min | backfill of missed replies; **load-bearing**, because `email_stats_id` for the handoff reply comes from here or from message-history |
| `GET /email-accounts/` (`is_smtp_success`, `daily_sent_count`, `message_per_day`) and per-mailbox `warmup-stats` | hourly / daily | `mailbox.health`, brakes |
| `GET /analytics/mailbox/domain-wise-health-metrics` | hourly, once for all domains (10/min limit) | domain brakes |
| `GET /analytics/campaign/overall-stats`, `day-wise-overall-stats-by-sent-time` | daily | dashboard; reconciliation against our event counts (bounce by send date, not event date) |
| `GET /campaigns/{id}/leads/{lead_id}/message-history` | on demand | the thread shown to the partner and to a taker-over |

Writes: push (≤400), pause / resume, campaign schedule and settings (`stop_lead_settings = REPLY_TO_AN_EMAIL`, tracking off), attach mailboxes, `from_name` updates (the sender-identity fleet job), **`reply-email-thread` with `email_stats_id`, `email_body`, `cc`** for the handoff, `POST /leads/block-list` (emails) and `POST /master-inbox/block-domains` (domains) to mirror suppression. Never call global unsubscribe for a cooldown; it cannot be undone via API.

### 5d. Ironmark to source: feedback

One event stream through the LeadSource port: `feedback(events[])`, each `{source_lead_id, kind, at, payload, idempotency_key}`. What the Quintel adapter's provider side does with each:

| kind | Quintel effect |
|---|---|
| `claimed`, `released`, `pushed(campaign, arm, template_version)` | lifecycle; experiment labels |
| `sent(step)` | counts |
| `bounced(hard)` | `contact.email_status = bounced`; Quintel-side suppression note |
| `invalid_email` | `contact.email_status = invalid`; next contact candidate if any |
| `unsubscribed`, `dnc` | never re-serve this contact to any brand |
| `replied(class, confidence)` | label |
| `not_interested`, `not_now(until)`, `sequence_done` | cooldown / park on the Quintel lead so it is not re-served early |
| `wrong_person(referred_name?)` | new contact candidate |
| `verify_failed` | flag on the company |
| `registered(partner)` | label |
| `checked(result)` | the collision label by feed and state |
| `outcome(stage, reason_code)` | **the label that trains sourcing**: contacted, application, approved, declined, funded, dead + reason |

Events are delivered at least once; the provider is idempotent on `idempotency_key`. If the source is down, Ironmark queues and retries; nothing in Ironmark blocks on the source except claiming new leads.

### 5e. The reply and handoff engine (Ironmark)

Built to hold the two cases set on 09-26 and shaped so a third destination is a routing row.

1. **Ingest.** `EMAIL_REPLY` (plus the 15-minute poll) → `event_log` → `reply`, with the thread, the email it answered, and `email_stats_id` fetched from message-history.
2. **Classify.** Rules first for legally weighted classes (bounce codes, list-unsubscribe, "remove me" forms, auto-reply headers). A model picks one of `interested / question / not now / not interested / wrong person / do not contact / out of office / cannot tell` with confidence; Smartlead's category is an input, never the decision. First 200 replies: a person confirms every class. Then only `cannot tell` and low confidence go to a person. No drafting in this step.
3. **Verify (positives).** `verify(reply)` through the LeadSource port: does the replying address or stated business reconcile with the company (domain, legal name, officer)? Fail → hold; nothing reaches the partner.
4. **Register.** Create `registered_lead` under the routing partner (Providence), snapshot the packet, attach the reply and the original email, set `registered_at` (the attribution timestamp), notify the partner user (Slack, text) with the packet, start the two-hour clock. **No email to the owner yet.**
5. **Check.** The partner user opens the row in the register UI and marks `clear`, `in_book:*`, or `pass`. This is the one required human step before any reply goes out.
6. **Route.** `routing_rule` + `availability` → `{partner_user, cc_address, template_variant, promise_window, route_mode}`. Phase-1 policy (`outbound.md` §5f): clear → Providence, David, `handoff`; `in_book:customer` / `in_book:other_rep` → `handoff` to the rep of record via the cc David enters, no referral claimed, company suppressed for future sends; `in_book:contacted_9mo` → `park` unless David has approved re-routing for the class; `pass` → `takeover` until a second destination is seated, then that destination.
7. **Handoff (case 1).** The partner user presses **send handoff** on the row (cc pre-filled to their own partner address, editable to another rep's). Ironmark sends the templated email in the owner's thread via `reply-email-thread` from the Ironmark mailbox, signed by the sender identity, naming the rep and the partner, with the promise from `availability` and the pick-a-time link. If the check has not happened within the cap (one hour inside the partner user's working day), the unnamed acknowledgment goes out and the named email follows the check (`outbound.md` §5g). SMTP fallback (Icemail app password, `In-Reply-To` set, lead paused in Smartlead) only if the live cc test fails.
8. **Takeover (case 2).** `route_mode = takeover`: outreach paused in the sequencer, the thread appears in the Ironmark takeover inbox (master-inbox thread view plus the register row), an Ironmark person owns it, and outcomes are entered by hand on the same row.
9. **Outcomes.** The partner user's four flags and reason code close the loop; Ironmark emits `outcome(...)` to the source and computes the fee line.

Constraints: every step idempotent on `(thread_id, message_id)`; every message to an owner is a fixed template with five slots; every decision is a row a person can read; if any component is down the system degrades to "a person reads the master inbox" without losing the register row.

### 5f. The fleet (Icemail + Smartlead, operated by Ironmark)

Exists: 30 Google mailboxes on 6 state domains in Icemail, warming in Smartlead since about 09-22; display names to change once the sender identity is decided (Smartlead `POST /email-accounts/{id}` `from_name`).

Rules in the registry:

- Ramp after warmup: 10, 15, 20, 30 a day over two weeks per mailbox; the planner reads the ramp.
- Brakes: domain over 3% bounce (7-day, by send date) → `paused`, zero slots, alert; `is_smtp_success = false` or `EMAIL_ACCOUNT_DISCONNECTED` → `paused`; reputation below floor after 600 sends → `watch`, then rotate out.
- Replacement: a domain `paused` more than 7 days → Icemail `POST /order` (or `POST /prewarm/buy` for a pre-warmed domain; Simon's price-versus-control call) → wait for `order.mailbox.active` → `POST /export` with `sequencer=smartlead` (uses the Smartlead **login**, once per mailbox per day) → `order.export.completed` → register ids → Smartlead attach to campaign. Automate this the first time it has to run; click it by hand until then.
- Second domain per state should start warming now.
- Health comes from Smartlead only; Icemail webhooks cover provisioning, export, deletion and password rotation. Subscribe the `mailbox.app_password.updated` webhook only on a trusted Ironmark URL (it carries the plaintext).

## 6. Interfaces (the ports)

### 6a. `LeadSource` port, and Quintel's provider implementation

Ironmark-side interface (every adapter implements it):

| Method | Purpose |
|---|---|
| `pull(filter{state, arm, limit, cursor}) → LeadEnvelope[]` | ready leads; the source sets a lease |
| `release(source_lead_ids[])` | give back unpushed claims |
| `feedback(events[])` | §5d; at-least-once, idempotent |
| `verify(source_lead_id, reply_from, stated_business?) → {status: match|mismatch|unknown, matched_fields[]}` | pool verification for positives; a source may return `unknown` (CSV does) |
| `suppressionHints(since) → [{scope, value, reason}]` | optional: things the source knows must never be emailed |

Quintel's provider API (HTTP, service token, actor `ironmark`, audited with Quintel's existing staff-token pattern):

| Endpoint | Maps to |
|---|---|
| `GET /v1/outbound/ready?state=&arm=&limit=&cursor=` | `pull`; sets `claimed_by`, `claimed_at` on Quintel's lead |
| `POST /v1/outbound/release` | `release` |
| `POST /v1/outbound/events` | `feedback` (batch) |
| `GET /v1/outbound/verify?lead_id=&reply_from=&stated_business=` | `verify` |
| `GET /v1/outbound/suppression-hints?since=` | `suppressionHints` |

A `CsvLeadSource` (envelopes from a file, `verify → unknown`, feedback to a log) is built in week 1 too: it is the test harness for the whole core and the shape of the Apollo adapter later.

### 6b. `Destination` port, and the Providence implementation

| Method | Purpose |
|---|---|
| `notify(registered_lead)` | ping the partner user with the packet |
| `presentForCheck(registered_lead)` | show the row; collect `check_result`, `cc_address` |
| `handoffTemplate(route)` | the template variant and slots for this destination |
| `recordOutcome(registered_lead, stage, reason)` | flags and reason code |

Providence v1 = the register UI in Ironmark (partner login, queue with clock, row with reply and original email, check control, send-handoff button with editable cc, four flags, reason code, export in LeasePath column order, monthly reconciliation) plus Slack and text notifications, the two-hour re-ping and the 7 AM digest. A CRM-webhook destination later implements the same four methods with no UI.

### 6c. `Sequencer` port (Smartlead adapter)

`pushLeads`, `pauseLead`, `resumeLead`, `replyInThread(email_stats_id, body, cc)`, `getThread`, `listMailboxes`, `mailboxHealth`, `domainHealth`, `campaignStats`, `setSchedule`, `attachMailboxes`, `setFromName`, `blockEmails`, `blockDomains`, `registerWebhook`, `retriggerFailedEvents`. Webhook receiver verifies HMAC and writes `event_log`.

### 6d. `FleetProvider` port (Icemail adapter)

`listDomains`, `listMailboxes`, `order`, `exportToSequencer`, `exportStatus`, `appPassword` (on demand only), webhook receiver for `order.*`, `mailbox.app_password.updated`, renewal reminders.

### 6e. Ironmark's own UI

Operator views (Ironmark users): sources and claims, plans and caps, draft review queue, replies and classes with the confirm gate, takeover inbox, fleet registry and brakes, suppression, numbers. Partner views (partner users): the register (§6b). One app, two roles, tenant-scoped.

## 7. Feedback loops as the questions they answer

| Loop | Question | Label from | Who acts |
|---|---|---|---|
| Source → outcome | which feeds and origin kinds produce positives and applications | `origin.feed`, `origin.kind` × register outcomes, via `feedback(outcome)` | Quintel: connector priority; Simon: what to source next |
| Copy → reply | which arm and template version get replies and positives, per state | `pushed(arm, template_version)` × `replied(class)` | Ironmark: arms; Alek: copy |
| Contact append → volume | found-and-verified rate by feed and state | Quintel enrichment outcomes; Ironmark `invalid_email` events | Quintel provider chain; volume plan |
| Check → routing | collision rate by state and feed; re-route yield once a second destination exists | `check_result` | routing rules; the Providence conversation |
| Reason codes → selection | why leads die after handoff | `reason_code` via `feedback(outcome)` | ICP scorer, buy-box edges, lanes |
| Fleet → capacity | bounce, complaint, reputation by domain and mailbox | sequencer events and health polls | planner caps, brakes, fleet orders |

Gates, pre-registered: bounce under 3% per domain; scale an arm at 1% positive; stop and rewrite under 0.3% after 600 sends.

## 8. Non-functional requirements

- **Ports are the only way in or out.** No adapter type leaks into the core; the core is testable end to end with `CsvLeadSource`, a fake sequencer and a fake destination.
- **Tenant on every row.** One tenant in production; the column, the scoping in queries and the per-tenant secrets exist from day one.
- **Idempotency everywhere.** Webhooks, pulls, feedback, pushes carry keys; replays are safe; raw payloads stored before parsing.
- **Audit.** Every state change has an actor and a reason. Nothing deleted; wrong rows voided.
- **PII boundary.** Business contact data only, in both systems. No application fields exist in either schema.
- **Compliance.** Truthful sender (a real person of the tenant), postal address and working opt-out on every message, opt-out honored in minutes, plain text, no pixels. Counsel items logged in `compliance.md` when it exists.
- **Failure model.** Sequencer down: nothing new is pushed; webhooks retry and the retrigger endpoint replays. Source down: Ironmark keeps sending what it has, queues feedback, stops claiming. Ironmark down: Smartlead keeps sending what was pushed; the 15-minute poll backfills on return; replies wait in the master inbox and a person can read them.
- **Secrets.** Smartlead API key and login (the export needs the login), Icemail key, Slack and SMS tokens live only in Ironmark, per tenant. Quintel's service token for the provider API is Ironmark's. Feed fetches for geoblocked hosts run from a US host on Quintel's side.
- **Observability.** Per day: claims, pushes, sends, deliveries, bounces, replies by class, positives, registered, checked within cap, handoffs, takeovers, hours to contacted; per domain and mailbox: fleet numbers; per port: webhook lag, poll backlog, feedback failures. One dashboard; one weekly export for the Tuesday review.

## 9. Build plan

Two tracks and a contract. The contract (§4b envelope, §6a provider API) is agreed first, because both tracks build against it. The reply and handoff engine is built before more connectors: the general bucket carries week one and the first positive arrives the first morning.

| Week | Quintel (source) | Ironmark (core + adapters) | Together |
|---|---|---|---|
| **1 (to 10-03)** | Quintel-side `lead` for Ironmark fit, ICP scorer v0, ready-pool query with leases; provider API (§6a) including `events` and `verify`; suppression hints | tenant, lead, contact, suppression, register, partner tables; `CsvLeadSource` and `QuintelLeadSource`; Smartlead adapter (push, pause, thread reply with cc, message-history, health, block list) and the user-level webhook receiver with raw log; classifier (rules + model + confirm gate); handoff templates and the **live cc test**; planner with ramp and tenant cap; register UI v0 (queue, row, check, send-handoff, flags, reason) and Slack/text notifications | end-to-end on 20 seeded leads through the CSV source with a test recipient, then the same through the Quintel source: reply → register → check → handoff in thread with cc |
| **2 (10-06 first send)** | contact-append measurement on 200 address-only companies; CO UCC and FMCSA connectors live; prequal job v0 producing `facts` | fleet registry with health polls and brakes; 15-minute reply poll; takeover inbox; daily digest; draft review queue | first send at ~500 a day; a person confirms every class; Tuesday numbers |
| **3–4** | remaining build-now connectors by measured yield; lead/prospect overlap view; feedback-driven source ranking v0 | ramp to 900; second domains into rotation; Icemail replacement flow automated the first time it runs; operator dashboard | first re-measure of the 3-per-1,000 rate; gates checked |
| **later** | site inbound door as a second `LeadSource`; a second lender's box as a second fit profile | second `Destination` (lender or CRM webhook) and its routing rows; vendor arm campaigns on separate domains; drafted-reply experiment after 100 labeled positives; second tenant | phase-2 commercial gate on the register's count |

Each cell is one to three tickets.

## 10. Decisions

**Made (09-26).**

1. **Ironmark is a standalone system** with its own database, UI and vendors, connected to lead sources, destinations, a sequencer and a fleet provider through four ports. Quintel is the first lead source behind an adapter, not a dependency of the core.
2. **The register lives in Ironmark.** Partner accounts and users are Ironmark's. Quintel receives outcomes as labels; its own `registered_lead` stays with its lender product.
3. **Case 1 mechanics:** the partner user presses "send handoff" on the register row; Ironmark sends the templated email from the Ironmark mailbox, signed by the sender identity, cc'ing the address the partner user picks. No mailbox credentials for partners; consistent signature; the one-hour fallback works.
4. **Case 2 in phase 1:** takeover by an Ironmark person until a second destination is seated; the routing row exists from day one.
5. **Classification:** Ironmark's classes decide; Smartlead's category is an input.
6. **Ironmark keeps only the envelope snapshot** of a lead, never the source's pool.
7. **Suppression:** Ironmark's list is the record for the channel and is mirrored to Smartlead's block lists; the source is told and marks its contacts; no global unsubscribe for cooldowns.
8. **Tenant column from day one**, single tenant in production.

**Open.**

1. **Sender identity on the 30 mailboxes** (`outbound.md` §5b; focus group). A fleet operation and a template slot; the build does not wait on it.
2. **Pre-warmed domains versus cold domains** for the second family and for replacements (Icemail `prewarm` vs `order`).
3. **Whether the CSV source doubles as the manual "add a lead" path** for Alek's hand-built lists in week 1. Recommendation: yes; it costs nothing extra.
4. **Smartlead plan tier** (60 vs 120 per minute) and the exact v1 path for the email block list; both settle in the week-1 spike.

## 11. What "done" looks like for phase 1

An owner in one of six states replies to an Ironmark email. Within minutes David's phone shows the row with the reply and everything the source knew about the business. He marks the book check. He presses one button and the owner receives one email in the same thread naming David and Providence, with David copied, promising a call at the time his calendar allows. David calls, takes the application through Providence, and ticks four boxes with a reason code when it ends. Ironmark holds every event from claim to outcome with the source, feed, arm and template that produced it; Quintel has received the same events as labels on its lead, contact and company. Nothing in either system holds the application. Bounce stayed under 3%. When the same reply comes from a company already in Providence's book, the thread lands in an Ironmark person's inbox instead, with the row still on the register. And the whole path was run once end to end from a CSV before Quintel was ever connected, which is the proof that the source is a port.
