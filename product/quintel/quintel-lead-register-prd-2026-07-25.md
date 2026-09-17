# Quintel Lead Register + Commercial Enforcement — PRD

*Date: 2026-07-25 · Revised 2026-07-27 (accounts, seats, enrichment metering, user lifecycle) · Owner: Simon*
*Priority: P0 (register committed before wk of 7/27 — ahead of the Armada and Onset calls)*
*Companion to [[quintel-pricing-structure-2026-07-23]] — the commercial structure this build enforces — and [[quintel-enrichment-licensing-cost-architecture-2026-07-24]], which sets the enrichment constraints.*
*Code: `apps/backend` in the `maxi/quintel` repo. Every as-built claim below was verified against the source on 2026-07-27 and is cited to a file.*

---

## Why this exists

The ratified commercial structure makes promises the product can't currently keep. They fall into three classes, and all three are now in scope for this build:

1. **Attribution.** The rev-share model charges a fee when a registered lead funds; the agreement gives the customer 10 business days from register delivery to challenge a lead; eligibility expires 12 months from surface date; and the sales pitch says, verbatim, "every company we surface is logged with a timestamp, and you get the register." Every one of those clauses references a record that doesn't exist yet.

2. **Seats.** The rate card sells "3 seats included, $300–500 per additional seat," and Appendix A caps Armada at a named-user ceiling. There is no seat count, no per-account limit, and no way for a customer to add a user without Simon running a CLI. **A meter nobody can read and nothing enforces is not a meter.**

3. **Enrichment.** The rate card includes "250/mo, more at cost." There is no per-account counting of enrichment anywhere in the system, and contacts are stored on the *shared* company with no account ownership at all — so the question "whose 250 was that?" has no answer, and one customer currently sees contact data another customer's spend produced.

The through-line: the commercial structure is now precise, and the product has no tenant-level substrate to hang it on. This build adds that substrate.

**Design principle throughout: this is an evidentiary and commercial-integrity system, not a feature set.** The register will be read most carefully at the exact moment someone is angry about money; the seat and enrichment meters will be read at renewal. Build all of it so the record is boring, complete, and impossible to argue with.

---

## As-built audit — what exists today

The single most useful section for a build session. Verified 2026-07-27.

| Capability the rate card assumes | As-built | Where |
|---|---|---|
| **Tenant root** | ✅ Real. `Account` with `id`, `name`, `label`, `configRef`, `createdAt` — nothing else | `src/db/models/account.entity.ts` |
| **Account scoping** | ✅ Real and strict. `AccountContext` (AsyncLocalStorage); `current()` **throws** when unbound — unscoped access is an error, never silently-unfiltered data. `GateGuard` binds it from the session cookie's `accountId` | `src/account/account-context.ts`, `src/api/auth/gate.guard.ts:93` |
| **User** | ✅ Real. Email (globally unique, lowercased) + scrypt hash, one `Account` FK per user, `type`, `name`, `lastLoginAt`/`previousLoginAt` | `src/db/models/user.entity.ts` |
| **Permission role** | ❌ **None.** `type` is LENDER · BROKER · ADMIN · ORIGINATOR — an account-type *classification*, not permissions. The entity comment states it outright: "a finer-grained permission `role` is intentionally deferred" | `src/db/models/user.entity.ts`, `src/api/auth/user-type.ts` |
| **Customer-side admin** | ❌ **None.** `AdminGuard` gates `/v0/admin/*` on `type === 'ADMIN'` — the *Quintel* break-glass login, not a customer role. `DE_ADMIN_OPEN=1` disables the check entirely | `src/api/auth/admin.guard.ts` |
| **Account-level controls** | ❌ **None.** No seat limit, no allowance, no plan/band, no contract dates, no status. Everything configurable is per-user or global | — |
| **Per-account config** | ⚠️ **Half-wired.** `Account.configRef` is a real column but is never read. The only consumer calls `configRefFor()`, a **hardcoded two-entry map** (`vfi`, `empire`); every other account silently falls back to the *shared* config dir | `src/account/resolve-account.ts`, `src/config/account-config-dir.ts:20` |
| **Seat counting** | ❌ **None.** Nothing counts users per account; nothing blocks the Nth | — |
| **User provisioning** | ⚠️ CLI only, sales-driven. `bun run provision <config.json>` and `bun run new-account <email> <pw> "<Name>"`. Idempotent upserts by id/email. **Simon handles customer plaintext passwords** | `scripts/provision-account.ts`, `scripts/new-account.ts` |
| **Forgot password** | ❌ **Absent.** Zero hits repo-wide for reset/forgot/invite/verify. A locked-out rep needs Simon on a CLI | — |
| **Change password** | ❌ Absent | — |
| **User deactivation** | ❌ Absent. No `status` column. The `Account` FK is deliberately `RESTRICT` — "a tenant delete with live users is a blocked, deliberate operation" — so deletion is not the escape hatch either | `src/db/models/user.entity.ts` |
| **Enrichment metering** | ❌ **None per account.** The only meter is the *provider's* own balance (Diffbot credits polled from their API) | `src/observability/provider-telemetry.service.ts:142` |
| **Enrichment audit trail** | ⚠️ `activity_log` writes `enrich.company` events, append-only, 90-day pruned — but has **no `accountId` column**, so events are not attributable to a tenant | `src/db/models/activity-log.entity.ts` |
| **Enrichment trigger** | ⚠️ `POST /v0/enrich/:companyId` — behind `GateGuard` only. **No admin guard, no account scoping, no cap.** Any authenticated seat can spend money in a loop | `src/api/world/enrich.controller.ts` |
| **Contact ownership** | ❌ **None — and this is the sharp one.** The entity comment: *"SHARED enrichment output on the shared Company — NO accountId."* Contacts hang off the global `Company` | `src/db/models/contact.entity.ts` |
| **Reveal cost control** | ⚠️ Partial. A 24h per-contact reveal cooldown with `?force=1` override, and `phoneRevealAttempts` counted **per contact, not per account** | `src/api/enrich/phone-reveal.service.ts` |
| **Enrichment stage control** | ✅ **The seam already exists.** `EnrichmentService.run(input, { stages })` restricts which paid stages run; the free `resolve` gate always runs first. The #26 retry sweep already passes `['contact']` | `src/api/enrich/enrichment.service.ts:107` |
| **Background enrichment kill-switch** | ✅ `WORLD_ENRICH_ENABLED=0` plus a park/unpark ops lever with dry-run | `src/api/world/enrich-park.service.ts` |
| **Transactional email** | ⚠️ One client — AgentMail (`send(inboxId, input)`). See U6: sender domain is a blocker for customer-facing mail | `src/email/agentmail.client.ts` |
| **Per-account link precedent** | ✅ `AccountCompany` — `unique(account, company)`, shared entity + per-account link. **Copy this shape for contacts** | `src/db/models/account-company.entity.ts` |

**Two conclusions from the audit.**

The account-scoping *seam* is genuinely good and strictly enforced — this build is filling it in, not retrofitting multi-tenancy. That is a much smaller job than it looks.

The contact model is the exception, and it is a live problem rather than a future one: [[quintel-enrichment-licensing-cost-architecture-2026-07-24]] §4.4 finds a cross-tenant pool prohibited under Apollo §3(a)(ii) and ZoomInfo §2.3, and recommends "per-tenant cache only — do not build the pool." One is already built. Section **E2** is the fix.

---

## Decisions ratified 2026-07-27

Frozen for this build. Reopening any of them is a founder-review conversation, not a build-session one.

| # | Decision | Rationale |
|---|---|---|
| D1 | **"Surfaced" = everything delivered into the customer's ranked feed per their configured buy box, or pushed to their CRM.** (Option 3 of the original open question) | Matches the spoken pitch, fully under our control to log, defensible in a dispute — it was on their screen, ranked, with the why |
| D2 | **Shared contact row, per-account grant.** One `Contact` row (dedupe preserved), plus an `account_contact` entitlement link. An account only *sees* contacts it holds a grant for | Satisfies the per-tenant rule without discarding the cache. A second account requesting an already-cached contact is still metered and costs $0 COGS — full margin |
| D3 | **Seats are hard-capped on active users.** Provisioning past `Account.seatLimit` fails with a clear error | The rate card's meter has to bite somewhere. Armada's Appendix A ceiling (2× headcount) is unenforceable without it — the cap *is* how that contract term becomes real |
| D4 | **Customer-side account admin, capped.** New `ACCOUNT_ADMIN` role: invite and deactivate within the account's own seat limit; every add notifies us | Armada at 8–12 users will not file a ticket per rep. Capped self-serve keeps billing control while removing the support load |
| D5 | **Auth lifecycle in scope:** invite (user sets own password), forgot/reset password, change password. Plus the minimal `status` column D3 requires | See U-series. Deactivation *UI* is deferred; the column and an admin action are not optional — a hard cap on active users needs a way to make a user inactive |
| D6 | **The ledger records fine-grained units; the allowance aggregates by policy.** Every metered event stores its own unit type (`company_verify` · `contact_email` · `contact_mobile`); the account's allowance is configured per unit type | The rate card says "250 contacts"; the licensing brief recommends metering *mobiles* (6–10× the cost, and the unit buyers actually value). Recording fine and aggregating by config means that commercial choice stays a config change, never a migration. **The commercial choice itself is still Simon's and changes only in founder review** — per the pricing doc's own rule |
| D7 | **Instrument before enforcing.** Meter from day one, alert internally at 80% of allowance, and hard-block only at a generous safety ceiling (`allowance × N`, configurable, default 2) | The blowout risk is rated **inferred, LOW** in the licensing brief §10 — hypothetical, never observed; the only heavy saver on record was *deleting* most of what he saved. That brief's own cheapest test is "instrument reveal counts per account for 30 days before pricing against it." Blocking at exactly 250 designs the question away instead of answering it |

---

## Definitions

| Term                   | Meaning                                                                                                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Surface event**      | The moment a company is delivered into a specific customer's feed (or pushed to their CRM). One event per company per customer                                                |
| **Registered lead**    | A company with a surface event for that customer. Registration is automatic — it *is* the surface event                                                                       |
| **Register**           | The per-customer, timestamped list of all registered leads and their statuses. Exportable; delivered to the customer on a cadence                                             |
| **Challenge window**   | 10 business days from register delivery, during which the customer can flag a lead as already-engaged (with activity evidence)                                                |
| **Attribution window** | 12 months from surface date. After it lapses, the lead is no longer fee-eligible                                                                                              |
| **Account**            | The tenant and the contracting party. One per customer firm. All commercial terms attach here, never to a user                                                                |
| **Seat**               | An **active user** on an account. *Contractual* definition (pricing doc): a user receiving assigned leads. Until lead routing ships, active-user is the honest proxy — see S1 |
| **Active user**        | `status = 'active'`. Counts against `seatLimit`. Inactive users retain all history and cannot log in                                                                          |
| **Account admin**      | A user with `role = 'ACCOUNT_ADMIN'` — customer-side. Distinct from `type = 'ADMIN'`, which is the Quintel break-glass staff login                                            |
| **Entitlement**        | A commercial limit stored on the account: seat limit, enrichment allowance, safety ceiling, band. Contract terms as data                                                      |
| **Metered event**      | One row in the usage ledger: account, user, unit type, company/contact, billing period, cost basis, timestamp                                                                 |
| **Grant**              | An `account_contact` row: this account is entitled to see this contact. Written in the same transaction as the metered event that paid for it                                 |
| **Billing period**     | A calendar month anchored to the account's `billingAnchorAt`. **Derived at read time, never a reset job** — a cron that fails silently would corrupt the meter                |

---

## Part 1 — The Register

### R1 — Surface-event logging (the P0 heart)

On every delivery of a company into a customer's feed, write an event:

- **Account ID** — the tenant. Bound by `GateGuard` from the session; read via `AccountContext.current()`
- **User ID** — *nullable.* Populated when the delivery is user-specific rather than account-wide. **New requirement (2026-07-27):** the rev-share terms make "a dedicated pod of 2–3 named reps working the Quintel feed" a *contract term*. Proving that term was met requires per-user delivery records. Nullable today, populated the moment lead routing ships — but the column must exist now or the pod evidence starts at the migration date instead of at signature
- **Company identity** — resolved entity ID plus the raw identifiers needed to match public filings later: legal name, known aliases/DBAs, state, city/address if held. The monthly spot-check searches state filing records *by debtor name*; the register must carry enough identity to make that match reliable
- **Timestamp** — server-side, UTC. Never client-supplied
- **Signal context** — signal type(s) that triggered surfacing, evidence links as of that moment, score at surface time
- **Delivery channel** — in-app feed, CRM push, export

Rules:

- **Append-only.** No updates, no deletes. Corrections are new events referencing the old one. The register's value is that it cannot have been edited after the fact
- **One registration per company per customer.** Re-surfacing (new signal on an already-registered company) appends a signal event to the existing lead; it does not reset the surface date. The attribution window runs from *first* surface. (If we ever want re-surfacing to refresh the window, that's a term-sheet change first, code change second)
- Backfill: on ship, generate events for everything currently sitting in existing customer feeds, timestamped honestly as backfill (flagged as such — do not fake historical surface dates)

### R2 — Lead status lifecycle

Each registered lead carries one status. Transitions are events too (who, when, why).

| Status | Meaning | Set by |
|---|---|---|
| **Registered** | Surfaced, inside challenge window | Automatic |
| **Locked** | Challenge window closed without a flag — fee-eligible | Automatic |
| **Challenged** | Customer flagged as already-engaged, evidence pending/under review | Manual (v1) |
| **Excluded** | Challenge accepted — documented activity in prior 12 months | Manual (v1) |
| **Funded** | Deal funded against this lead (reported or found via spot-check) | Manual (v1) |
| **Lapsed** | Attribution window (12 mo) expired without funding | Automatic |

V1 can set the manual statuses through an internal admin action — no customer-facing challenge UI is required. The *statuses* must exist in the data model from day one, because the export has to show them.

### R3 — Register export and delivery

- **Per-customer export** — CSV at minimum: company name, state, surface date, signal type, status, window-close date, eligibility-expiry date
- **Delivery is an event.** The challenge window starts at register delivery, so delivery must be logged (what was sent, when, to whom). V1 delivery can be a scheduled email with the CSV attached; the log entry is what matters legally, not the transport
- **Cadence:** weekly for rev-share customers (keeps every challenge window short and current); monthly or on-demand for subscription customers, where the register is a deliverability receipt rather than a fee instrument

### R4 — Spot-check support

The monthly attribution check (a human, then a script, searching state filing portals by debtor name) consumes the register. It needs a filtered view: **locked leads inside their attribution window, for rev-share customers, grouped by state.** That's the whole worklist. Getting this view right costs an hour now and saves the process from day one.

---

## Part 2 — Account model and tenant controls

### A1 — Commercial terms become columns on `Account`

Today `Account` carries `name`, `label`, `configRef` and nothing commercial. Every term the rate card sets needs a home, and that home is the account row — not a config file, not a code constant. Contract terms must be queryable, auditable, and diffable.

Add:

| Field | Type | Purpose |
|---|---|---|
| `band` | string | `CORE` · `INSTITUTIONAL` · `REVSHARE`. Drives nothing in the product by itself — the buy box stays fully customer-configured. **This is a contract term recorded, not a product setting**, exactly as the pricing doc's design rule requires ("if price keyed on the configured box, customers would be paid to lie to the engine") |
| `seatLimit` | int | Included + purchased seats. Enforced by S2 |
| `enrichmentAllowance` | jsonb | Per-unit-type monthly allowance, e.g. `{ "contact_email": 250, "contact_mobile": 250 }`. Per D6, the shape lets the metered unit change without a migration |
| `enrichmentCeilingMultiple` | numeric | The D7 safety ceiling. Default `2`. Hard block only here |
| `billingAnchorAt` | timestamptz | Anchors the monthly period. Periods are **derived**, never reset by a job |
| `status` | string | `active` · `suspended`. A suspended account's users cannot log in; all data and register history survive untouched |
| `contractStartAt`, `contractEndAt` | timestamptz, nullable | Rev-share is a 12-month minimum term; founding rate locks are 12 months. Renewal is a real event and needs a date to fire from |
| `revShareRateBps` | int, nullable | Basis points. Quote 0.5% = `50`; floor 0.35% = `35`. Nullable — subscription accounts have none. Stored per-account because it is negotiated per-account |

**Migration note:** existing accounts backfill to the Core defaults (`band='CORE'`, `seatLimit` = current active user count or 3, whichever is higher — never break a live login to enforce a new cap retroactively).

### A2 — Per-account config must read `Account.configRef`

`configRefFor()` in `src/account/resolve-account.ts` is a hardcoded two-entry map (`vfi`, `empire`). Any account provisioned since silently falls back to the shared config dir, so its buy box and credit rubric are not its own. **What surfaces is what lands in the register**, so this is an attribution-correctness bug, not just a config nicety.

Requirement: `configRefFor(accountId)` reads `Account.configRef` from the database. The static map is deleted. `resolveAccountId()` in the same file has **no callers** (login binds `user.account.id` directly at `gate-session.ts:73`) — delete it too, per the repo's no-retired-code rule.

### A3 — Entitlement mutations are never reachable under `DE_ADMIN_OPEN`

`AdminGuard` returns `true` unconditionally when `DE_ADMIN_OPEN=1`. If seat limits and allowances live behind that guard, the dev-convenience flag becomes a billing bypass. Entitlement-mutating routes must check the real ADMIN session regardless of the flag.

---

## Part 3 — Seats

### S1 — Seat definition, and the gap in it

The pricing doc defines a seat as **"a user receiving assigned leads"**, and leans on that to make the meter self-enforcing: *"a rep without a seat has no queue."*

**Lead routing/assignment is not built** — it is a separate P0/P1 item and an explicit non-goal of this build. So the self-enforcing property does not exist yet, and the honest v1 proxy is: **a seat is an active user on the account.**

These must not be allowed to drift apart. When routing ships, a user with no assignment queue must either receive leads or stop counting as a seat — otherwise we bill for something the customer demonstrably isn't getting, which is precisely the argument we don't want at renewal. Flag this as the one place where the commercial definition and the implemented definition are knowingly different, and close it when routing lands.

### S2 — Hard cap on active users

- `Account.seatLimit` bounds the count of users with `status = 'active'`
- Creating or reactivating a user at the limit fails with a clear, actionable error naming the current count and the limit — never a generic 403
- The cap is enforced in **`UserService.createUser`**, not in a controller. That method is the single write path for auth (used by the seed, both provisioning CLIs, and — after U1 — the invite flow), so enforcing there means no call site can bypass it
- Deactivating a user frees a seat immediately
- Quintel staff (`type = 'ADMIN'`) do not consume a customer seat
- **Appendix-A shaped ceilings are just a number.** Armada's "up to 2× current headcount, no per-seat fee" is `seatLimit = <the scoped number>` with `band = 'CORE'` and no per-seat billing line. No special-case code

### S3 — `ACCOUNT_ADMIN` is a new `role`, orthogonal to `type`

Add `User.role` — `ACCOUNT_ADMIN` · `MEMBER`, default `MEMBER`.

**Do not overload `type`.** `type` is documented as an account-type classification (LENDER · BROKER · ORIGINATOR) whose `ADMIN` value is the Quintel break-glass staff login guarding `/v0/admin/*`. Folding a customer-side admin into it would hand customers the world-merge and pipeline-trigger surfaces. Two orthogonal columns, two guards:

| Guard | Checks | Protects |
|---|---|---|
| `AdminGuard` (existing) | `type === 'ADMIN'` | `/v0/admin/*` — Quintel staff only |
| `AccountAdminGuard` (new) | `role === 'ACCOUNT_ADMIN'` | `/v0/account/users/*` — scoped to the caller's own account by `AccountContext` |

An account admin can, **within their own account only**: list users, invite a user (S2 cap applies), deactivate/reactivate a user, and see the current seat count against the limit. They cannot change `seatLimit`, allowances, band, or any other entitlement — those are ours.

Every invite sent by an account admin emails an internal notification. Seat growth is a revenue event and should never be something we learn about at renewal.

### S4 — Seat state is visible to the people who sell

An internal admin view: per account — band, seat limit, active seats, seats used this month vs last, enrichment consumption against allowance, contract dates, days to renewal. This is the artifact Alek and Simon read before a renewal or expansion call.

---

## Part 4 — Enrichment metering

### E1 — Split the primitive: verify company ≠ reveal contacts

The current design spends *contact* credits to answer *firmographic* questions. From the licensing brief §3.2, Stauss on 07-21:

> *"I find myself going to save it, and then I'll click on it and wait for the data to enrich… it's showing an estimated 2.3 million in revenue… then if it doesn't come through with the kind of stuff that I want, I'll just remove it. **It's getting annoying in that regard.**"*

He is buying company verification and deleting the record. The expensive primitive is answering the cheap question.

Requirement — two distinct, separately-metered operations:

| Operation | Stages | Metering |
|---|---|---|
| **Verify company** — revenue estimate, headcount, size band, domain, geo | `resolve` + `firmographics` | **Included, unmetered.** Logged for cost visibility, never counted against an allowance |
| **Reveal contacts** — names, emails, mobiles | `contact` + `verify` | **Metered**, on explicit user action only |

**The seam already exists.** `EnrichmentService.run(input, { stages })` restricts which paid stages run, and the free `resolve` gate always precedes them — the #26 retry sweep already passes `['contact']`. This is a call-site change and a metering wrapper, not a rewrite of the waterfall.

**Never reveal on save.** Reveal fires only on an explicit user click. This alone eliminates the save→enrich→remove waste above.

### E2 — `account_contact`: shared row, per-account grant (D2)

Mirror `AccountCompany` exactly — the precedent is in-repo and well-documented.

```
account_contact
  id           string pk
  account      FK → account        (RESTRICT, matching the account-FK convention)
  contact      FK → contact        (cascade — a contact delete takes its grants)
  grantedAt    timestamptz
  grantedVia   string              'reveal' | 'backfill' | 'import'
  unique(account, contact)
```

Rules:

- **Every read path for contact data filters on a grant for the current account.** Not one exception
- **The grant and the metered event are written in the same transaction.** A grant without a meter row is unbilled data; a meter row without a grant is a charge for nothing. Read `docs/common/mikroorm-transactions.md` before touching this
- **A cache hit is still a metered event.** Account B requesting an already-revealed contact is metered at the same rate and costs $0 COGS. That is the margin D2 buys, and it keeps the meter honest — the customer is charged for the same thing regardless of our internal cache state
- **The `BookStore.loadBook` projection is the leak path.** `contact.entity.ts` states that the highest-confidence contact is projected back onto `Company.contact` by `loadBook`. Ungated, that projection serves another account's paid contact straight into the book, bypassing every controller-level filter. Gate it there specifically, and write the test that proves it

**Backfill, stated honestly.** Existing contacts cannot be attributed to the account that paid for them — `activity_log` has no `accountId`. The best available heuristic: grant a contact to every account holding an `account_company` link to that contact's company. Where exactly one account holds the link, that grant is almost certainly correct; where several do, this preserves today's (already-shared) behavior rather than revoking access someone is using. Flag every backfilled grant as `grantedVia = 'backfill'` so it is never mistaken for evidence of who paid. Same discipline as R1's backfill flag: **do not manufacture a provenance we don't have.**

### E3 — The usage ledger

A new append-only table. Do **not** extend `activity_log` — that is a 90-day-pruned operational log, and a billing record cannot be pruned or reconstructed from one.

```
usage_event
  id            string pk
  account       FK → account
  user          FK → user, nullable      -- who clicked; null for system-initiated
  unitType      string                   -- 'company_verify' | 'contact_email' | 'contact_mobile'
  metered       boolean                  -- false for company_verify (D6/E1)
  company       string, nullable         -- denormalized id, no FK (survives deletes)
  contact       string, nullable         -- denormalized id, no FK
  provider      string, nullable         -- attribution for COGS reconciliation
  outcome       string                   -- 'hit' | 'miss' | 'pending'
  periodStart   date                     -- stamped at write time from billingAnchorAt
  costCents     int, nullable            -- our COGS, where known
  createdAt     timestamptz
  index (account, periodStart, unitType)
```

Notes:

- **Denormalized company/contact ids with no FK**, following the `activity_log` convention: an append-only billing record must survive a delete of the thing it references
- **`periodStart` is stamped at write time**, not derived at read. A changed `billingAnchorAt` must never retroactively move historical usage between periods
- **Waterfall misses are free at most vendors** (licensing brief §5.2 — you pay only on successful find). Record `outcome` so the allowance can be configured to count hits only. Whether it does is a rate-card question, not a code question
- Consumption for a period = a count over this table. No running totals, no counters to drift

### E4 — Enforcement (D7)

| Threshold | Behavior |
|---|---|
| **80% of allowance** | Internal alert to Simon/Alek. Silent to the customer |
| **100% of allowance** | Still served. Internal alert escalates. This is the "more at cost" conversation, and per the pricing doc it happens in founder review, never automatically |
| **`allowance × enrichmentCeilingMultiple`** (default 2×) | **Hard block.** Clear message routing the user to their Quintel rep — never a raw error. Lifted by raising the allowance on the account, which is a deliberate commercial act |

**No credit meter in the customer-facing UI.** Licensing brief §5.3: a visible Apollo-style counter anchors Quintel to the data-vendor comparison, which is the frame Stauss explicitly warned against — *"You're not selling a ZoomInfo or a SaaS product… I'm selling a person, an originating agent."* Overage lives in the order form as verified-contact packs. Consumption is visible to **us**, and to the account admin on request, not in the product chrome.

**After 30 days of real data, revisit the ceiling.** That measurement is the licensing brief's own cheapest test for its lowest-confidence assumption. This design exists to produce it.

### E5 — Close the open money endpoint

`POST /v0/enrich/:companyId` currently sits behind `GateGuard` alone: no account scoping on the spend, no rate limit, no cap. Any authenticated seat can loop it.

Requirements: the route meters through E3 before spending; it respects the E4 ceiling; the existing 24h per-contact reveal cooldown gains a **per-account** rate limit alongside it (the current cooldown is per-contact, so N distinct companies in a loop passes it untouched); and `?force=1` — which exists precisely to spend another reveal — is restricted to `type = 'ADMIN'`.

### E6 — What this does not change

Per the pricing doc's design rule, **we don't make money on enrichment.** Same allotment in both bands, more provided at cost. The meter exists to bound COGS and to make "250/mo" a true statement — not to become a revenue line. If a build decision starts optimizing enrichment for margin, it has left the strategy.

---

## Part 5 — User lifecycle and auth

Everything in this part is currently absent. Scope per D5.

### U1 — Invite flow (user sets their own password)

An account admin (S3) or Quintel staff invites by email + name + role. The invitee receives a single-use, expiring link and sets their own password.

- **Simon never handles a customer's plaintext password again.** That is the actual point
- The S2 seat cap is enforced at invite time, not at acceptance — an invite that cannot become a user should never be sent
- Pending invites do **not** consume a seat until accepted; expired invites are visible to the admin who sent them

### U2 — Forgot / reset password

- `POST /v0/auth/forgot` → always returns 200, regardless of whether the email exists. This matches the existing anti-enumeration discipline in `UserService.verifyCredentials` ("one null return for both 'no such email' and 'wrong password' — callers must not leak which")
- Emailed token: single-use, expiring (60 minutes), **stored hashed** — a token table that leaks must not be a password-reset table
- Consuming a reset invalidates all other outstanding tokens for that user and every active session
- Rate-limited per email and per IP

### U3 — Change password (authenticated)

Requires the current password. Same session-invalidation behavior as U2.

### U4 — `User.status` and deactivation

**In scope despite not being selected, because D3 requires it.** A hard cap on *active* users is unimplementable without a way to make a user inactive, and deletion is not the alternative — the `Account` FK is deliberately `RESTRICT`, and the register is evidentiary and append-only, so a departed rep's history must survive intact.

Minimum viable:

- `User.status` — `active` · `inactive`, default `active`
- Inactive users cannot authenticate; `GateGuard` rejects a session whose user is inactive (checked at login **and** on session verify — otherwise a live cookie outlives the deactivation for its full TTL)
- Deactivation frees a seat immediately and preserves all history, register entries, and usage events
- Reachable via the account-admin API (S3) and the CLI

Deferred: a polished deactivation UI, bulk operations, offboarding flows.

### U5 — No self-registration

Unchanged and deliberate. The `User` entity comment states it: *"a sales-provisioned login (enterprise auth; no self-registration)."* Every new user arrives by invite or by CLI. Nothing in this build opens a public signup path.

### U6 — Sender domain is a blocker, not a detail

The only email path in the backend is the AgentMail client (`src/email/agentmail.client.ts`), used today for internal enrichment alerts and digests. **Customer-facing password resets and invites must send from a `quintel.ai` address with SPF/DKIM/DMARC aligned.** A bank-owned buyer's mail gateway is the least forgiving audience there is, and a reset link that lands in spam converts directly into a support call to Simon. Resolve the sending domain before U1/U2 are considered done — this is a prerequisite, not a polish item.

---

## Non-goals for this phase

Explicitly out, so the build stays bounded:

- Automated UCC/filing matching or secured-party resolution (P2, gated on data spend)
- Automated invoicing, and any billing-system or payment-processor integration. Entitlements are set by us; invoices are still generated outside the product
- Customer-facing challenge UI (manual flag handling is fine at n≤10 customers)
- Lead routing/assignment across reps — still a separate build. **S1 records the definitional gap it leaves open**
- Tamper-evidence beyond append-only discipline (hash-chaining the log is cheap insurance *if* trivial; skip if it adds a day)
- SSO/SAML, MFA, email-address verification, and password-policy configuration. Real asks from a bank-owned buyer eventually; none is blocking a founding customer
- Self-serve plan changes or checkout. Pricing changes in founder review only — the product must not contain a path that alters a commercial term without us
- Multi-account users (one account per user stays a hard invariant)
- A customer-visible enrichment credit meter (E4 — deliberate, positioning-driven)

---

## Acceptance criteria

**Register**

1. Every company delivered into any customer feed from ship date forward has a surface event with server timestamp, account id, entity identity, and signal context; `userId` is present in the schema and nullable
2. Existing feed contents are backfilled and flagged as backfill
3. "Export the Onset register" is a one-command/one-click operation producing the R3 CSV
4. A register delivery can be logged, and the challenge-window close date derives from it automatically
5. A lead's full history (surface → signals → status changes) is reconstructable from events alone
6. The R4 spot-check view exists

**Accounts and seats**

7. Every commercial term in A1 is a column on `Account`, set for every existing account, with Core defaults backfilled and no live login broken
8. `configRefFor()` reads `Account.configRef` from the database; the static map and the unreferenced `resolveAccountId()` are deleted
9. Creating or reactivating a user beyond `seatLimit` fails with an error naming the count and the limit — proven by a test that goes through `UserService.createUser`, the single write path
10. An `ACCOUNT_ADMIN` can list, invite, and deactivate users **within their own account only**, and cannot reach `/v0/admin/*` or mutate any entitlement — proven by a negative test
11. Entitlement-mutating routes reject a non-ADMIN session even with `DE_ADMIN_OPEN=1`

**Enrichment**

12. Verify-company and reveal-contacts are separately invocable; verify is never metered; reveal never fires on save
13. Every reveal writes a `usage_event` and an `account_contact` grant in one transaction
14. An account cannot read a contact it holds no grant for — proven by a two-account test that specifically covers the `BookStore.loadBook` projection path
15. Existing contacts are backfilled as grants flagged `grantedVia = 'backfill'`
16. Period consumption is a query over `usage_event`. No stored counter exists anywhere
17. `POST /v0/enrich/:companyId` meters, respects the ceiling, is per-account rate-limited, and its `?force=1` path is ADMIN-only

**Auth**

18. A user can be invited, set their own password, and log in without any plaintext password passing through Simon
19. Forgot-password returns 200 for unknown emails; tokens are hashed at rest, single-use, and expire in 60 minutes
20. Deactivating a user frees a seat, blocks authentication **on the existing session as well as at login**, and leaves every register entry and usage event intact
21. Invite and reset mail sends from a `quintel.ai` address with aligned SPF/DKIM/DMARC

---

## Sequence

| Phase | Scope | When |
|---|---|---|
| **P0** | R1 (event logging + backfill) + R3 export | Before wk of 7/27 |
| **P0.5** | **A1 entitlement columns + A2 config fix + E3 usage ledger + E2 grants.** The data model. Everything else in this doc reads from it, and every day it is absent is a day of unattributable enrichment spend and one more contact in a pool that shouldn't exist | Immediately after P0 |
| **P1** | R2 statuses + delivery logging + R4 view · S2 seat cap · E1 split primitive + E4 enforcement + E5 endpoint close | Before the first rev-share agreement is signed |
| **P1.5** | U1–U4 auth lifecycle (invite, reset, change, status) + U6 sender domain · S3 account-admin role | Before an account exceeds ~5 users — Armada is the forcing function |
| **P2** | S4 internal seat/consumption dashboard · automated filing match → self-executing invoicing · challenge UI if customer count warrants | Roadmap |

**Sequencing rationale.** The data model (P0.5) comes before every enforcement mechanism deliberately. Instrumenting first and enforcing second is D7 applied to the build order itself: 30 days of real per-account consumption data is what tells us whether 250 is the right number, and that clock only starts once the ledger exists.

---

## Open questions

Decide during build; none blocks P0.

1. **The metered unit — contacts or mobiles?** D6 makes this a config change either way, so it does not block the build. But it is a rate-card term, and per the pricing doc the card changes in founder review only. The licensing brief recommends mobiles (6–10× the cost, and the unit Michael at Providence explicitly asked for). *Owner: Simon + Alek.*
2. **Does the allowance count hits only, or attempts?** Waterfall vendors bill on successful find, so counting attempts charges the customer for our misses. Recommend hits only; `usage_event.outcome` supports either.
3. **CRM-push deduplication:** if a lead is both in-feed and pushed to CRM, that's one registration, two delivery-channel events. Confirm the CRM push carries the register ID so downstream tagging survives into their system.
4. **Does the register show the customer *excluded* leads in exports?** Recommend yes — showing their own successful challenges builds trust in the mechanism.
5. **Do pending invites count against `seatLimit`?** Recommend no (U1), but an account admin who sends 20 invites at a 5-seat limit creates a confusing failure at acceptance time. The alternative is reserving the seat on send with an expiry that releases it.
6. **Session TTL and its interaction with deactivation.** U4 requires a per-request user-status check, which adds a DB read to `GateGuard` — currently pure cookie verification with no I/O. Either accept the read, or cache status with a short TTL and accept a bounded window where a deactivated user still has access. Recommend accepting the read until it measurably matters.

---

## Load-bearing assumptions

| # | Assumption | fact / inferred + confidence | Cheapest test |
|---|---|---|---|
| 1 | Active-user is an acceptable v1 proxy for the contractual "user receiving assigned leads" | **inferred, MED** — nobody has been billed on it yet, and no customer has seen a seat count | The first order form that quotes a seat number against a real user list |
| 2 | Customers will accept an account admin managing their own users rather than expecting SSO | **inferred, MED–HIGH** — normal for tools at this price point; untested with a bank-owned buyer | Raise it at Armada demo #2 while scoping their headcount for the Appendix A ceiling |
| 3 | 250/mo is the right included allowance | **inferred, LOW** — no per-account consumption has ever been measured | E3 ledger + 30 days. This is the single reason P0.5 is sequenced where it is |
| 4 | Revoking the shared contact pool breaks nothing a customer currently relies on | **inferred, MED** — the backfill grants existing access rather than revoking it, so the risk is confined to *newly* revealed contacts | Ship the grant filter and watch for "where did that contact go" in the next two customer sessions |
| 5 | A hard seat cap will not block a live customer at a bad moment | **inferred, MED–HIGH** — migration backfills `seatLimit` to at-or-above current usage, so nobody is capped retroactively | The migration's own dry run: report every account's active count against its proposed limit before applying |
