# Quintel Commercial Structure

*Ratified 2026-07-25 · Owners: Simon + Alek*
*This is the pricing source of truth. It changes in founder review only — never on a call. If a prospect's situation doesn't fit, the answer on the call is "let me come back to you."*
Tokenrip Artifact ID: dbd4769e-7fb3-43af-a02b-b829b8749a40

---

## The model

Quintel sells one product, two ways to buy:

- **Subscription (base + seats).** The base buys the engine: the full market, every sector, ranked against the customer's buy box. Seats buy distribution — each rep receiving assigned leads is a seat. Two bands, set by the lender's average ticket.
- **Rev-share (Institutional only).** No monthly fee. Quintel is paid a percentage of the funded amount on deals it sourced — the broker-comp model these lenders already pay outside parties on. A customer picks subscription **or** rev-share, never both.

## Rate card

|                                         | **Core**                                                       | **Institutional**                    | **Rev-share** *(Institutional option)*                                   |
| --------------------------------------- | -------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------ |
| **Who**                                 | Avg ticket under $500K                                         | Avg ticket $500K+                    | Institutional-band lenders who pay per funded deal (broker-comp culture) |
| **Price** (founding, first 5 customers) | **$1,500/mo**                                                  | **$3,000/mo**                        | **0.5% of funded amount** per Quintel-sourced deal                       |
| **Included seats**                      | 3                                                              | 3                                    | Dedicated pod: 2–3 named reps (required)                                 |
| **Additional seat**                     | $300/seat/mo                                                   | $500/seat/mo                         | —                                                                        |
| **Leads**                               | Uncapped                                                       | Uncapped                             | Uncapped                                                                 |
| **Sectors**                             | All, always                                                    | All, always                          | All, always                                                              |
| **Contact enrichment**                  | 250/mo included; more at cost                                  | 250/mo included; more at cost        | 250/mo included; more at cost                                            |
| **Term**                                | Month-to-month                                                 | Same                                 | 12-month minimum                                                         |
| **Payment**                             | Monthly                                                        | Monthly                              | Within 10 days of each funding                                           |
| **Annual prepay — the lock-up play**    | **15% off with a year paid up front** ($1,275/mo → $15,300/yr) | **15% off** ($2,550/mo → $30,600/yr) | —                                                                        |
| **Support**                             | Email + shared Slack                                           | Same                                 | Same                                                                     |
| *Internal — never shown*                | *Target post-founding: $3–5K/mo*                               | *Target: $5–10K/mo*                  | *Floor: 0.35%. Never quoted below it. *                                  |

**How we say it:**

> *Pricing:* "A monthly base for the engine — your buy box does the filtering — with three seats included and a per-rep price after that. The base depends on your average ticket, because a desk funding $2M deals gets more from every lead than a desk funding $200K deals. Large-ticket shops can instead pay nothing monthly and a small percentage of the funded amount on deals we source. Pick whichever matches how you pay for things."

> *Attribution:* "Three rules, all in writing. Every company we surface is logged with a timestamp, and you get the register. A deal counts only if you weren't actively working that company — logged activity in the last twelve months, not just a record in your database — and you get ten days from the register to flag anything that's already yours. Fundings are cross-checked against the public record, so payment never depends on anyone's say-so."

## Design rules (the reasoning behind the card)

- **The base prices the intelligence; seats price the capacity to act on it.** The market and the buy box set feed size. Reps set how much of the feed gets worked, and leads are distributed per rep, so seat count is the honest meter. It also enforces itself: a rep without a seat has no queue.
- **Seat definition:** a user receiving assigned leads. For CRM-integrated customers, a CRM user receiving Quintel-sourced leads — otherwise export deletes the meter.
- **The band keys on average ticket, stated by the customer** and written into the agreement as a representation. It's how lenders describe themselves; averages are facts about a book.
- **The band is a contract term, not a product setting.** The buy box stays fully customer-configured. If price keyed on the configured box, customers would be paid to lie to the engine.
- **The Institutional premium prices deal value, not headcount.** Consumption runs inverse to ticket size — large-ticket shops run small pods and fund fewer, bigger deals. That's why Institutional gets a higher base, not more seats or credits.
- **We don't make money on enrichment.** Same allotment both bands; more provided at cost. The product is the intelligence.
- **Anchor the base to headcount, never to leads.** The frame: the research half of an entry-level BDO ($60–80K/yr loaded) that never sleeps. A tools budget is $500/mo thinking; a headcount budget is $4–6K/mo thinking.
- **Founding pricing is named as founding pricing.** The concession does selling work, and every concession is traded — a case study, reference rights, a feedback cadence. Nothing is free without a name and a price.

## Rev-share terms

Five terms, all load-bearing. A deal missing any of them is not this model.

1. **Fee basis: the funded amount** (cost of the equipment/property financed), not margin. It takes one multiplication to calculate and doesn't depend on how the lender splits comp internally.
2. **Rate: quote 0.5%, floor 0.35%.** Set in advance, never improvised on a call.

   | | 0.5% (quote) | 0.35% (floor) |
   |---|---|---|
   | $5M funded deal | $25,000 | $17,500 |
   | $20M funded across a year | $100,000 | $70,000 |

3. **Commitment replaces the monthly fee: 12-month term + a dedicated pod** of 2–3 named reps working the Quintel feed. Both are contract terms. Without them, a zero-base deal is a free option on our cost.
4. **Fee-eligibility is an activity test, not a presence test.** Lenders carry 50K–200K+ records; mere presence in their database disqualifies nothing.
   - A registered lead is fee-eligible **unless the customer had documented activity with that company in the prior 12 months** (logged contact, proposal, application, or funded deal). A dormant record is not engagement; a dormant account we reactivate is fee-eligible.
   - **Challenge window:** 10 business days from register delivery to flag a lead as already-engaged, with the activity evidence. Unflagged leads lock as eligible. Disputes happen at surface time, when a lead is worth $0 — never at funding time.
   - **Attribution window:** a lead stays fee-eligible for 12 months from surface date.
5. **Payment within 10 days of funding** — the same cadence lenders already wire broker comp on.

**Attribution — how we know a deal was ours:**

| Layer | Mechanism |
|---|---|
| **Lead register** | Every surfaced company logged per customer with a timestamp; the customer receives the running register. This is the backbone: it settles "what did you surface, and when" before anyone has a reason to argue. |
| **Reporting covenant** | Contractual obligation to report fundings against registered leads within 10 days. The pod's pipeline report is the attribution record. |
| **Public-record checks** | Funded, secured deals appear as UCC-1 filings naming the lender as secured party. We spot-check the register against state filing records monthly — disclosed openly, which is what keeps the covenant honest. |
| **Audit + true-up** | Annual reconciliation right (Appendix B). |

The agreement includes an upgrade clause: as our filing coverage expands, checks become continuous and invoicing triggers directly off the public record — no renegotiation.

## Product requirements

| Priority | Item | Status |
|---|---|---|
| **P0** | Per-customer surfaced-lead logging with timestamps; exportable register | Committed (Simon), in before wk of 7/27 |
| **P0.5** | **Account entitlement columns** (band, seat limit, allowance, contract dates) + **per-account usage ledger** + **per-account contact grants**. None of this exists today: the card's seat meter and "250/mo" have no substrate, and contacts sit in a cross-tenant shared pool | Spec'd 7/27 → [[quintel-lead-register-prd-2026-07-25]] |
| **P0/P1** | Lead routing/assignment across reps — the multi-rep workflow, and what makes seats self-enforcing | New. **Until it ships, a seat is an *active user*, not "a user receiving assigned leads"** — the card's definition and the enforced one are knowingly different (PRD §S1) |
| **P1** | Seat cap enforcement · split verify-company from reveal-contacts (never on save) · close the unmetered `POST /v0/enrich/:companyId` | Spec'd 7/27 |
| **P1** | Monthly spot-check process over the register (state filing lookups; manual first, scripted later) | Before first rev-share invoice |
| **P1.5** | Customer-side account admin (invite/deactivate within seat limit) + forgot-password/invite flows. **None exist today** — every user is CLI-provisioned by Simon, plaintext passwords included | Before an account exceeds ~5 users; Armada forces it |
| **P2** | Secured-party resolution + broad filing coverage → self-executing rev-share invoicing | Roadmap |

**One card term is not yet measurable.** The 250/mo enrichment allowance was set without any per-account consumption data — none has ever been collected. The usage ledger (P0.5) starts that clock; revisit the number after 30 days rather than defending it now.

## Call guidance

Quote from the rate card, no discounting on warmth, and every concession is traded for something named. 
	**Armada** is the one exception: the no-seat quote from call 1 is honored in full (Appendix A); the rate card governs every new deal. 
	**Onset:** the number call opens at 0.5% with the floor pre-agreed, and we bring a one-page term summary so the mechanism arrives as our draft, not as notes from their exec meeting.

---

## Appendix A — Armada founding agreement

*The call-1 "not seat-based" quote is honored in full. Protection comes from scope and term, not per-head fees.*

| Term                                    | Value                                                                                                                                                                                   |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Price**                               | $1,500/mo, founding rate                                                                                                                                                                |
| **Users**                               | No per-seat fees. Up to **[2x current headcount] named users** on Armada's internal origination team — scope their actual number at demo #2. New reps inside the ceiling: included, $0. |
| **Scope**                               | Internal origination team only. No affiliates, partners, or resale; assignment / change-of-control clause.                                                                              |
| **Sectors / leads / enrichment**        | All sectors, uncapped leads, 250 contacts/mo (more at cost)                                                                                                                             |
| **Term**                                | 12-month founding rate lock                                                                                                                                                             |
| **Renewal**                             | Converts to the then-current rate card at their actual desk size, with a founding discount — disclosed at signing                                                                       |
| **What the whole-team pricing buys us** | ① Case study + reference rights on the first funded deal · ② Feedback cadence with the vertical heads (biweekly 30 min) · ③ First-mover/logo rights                                     |

Growth during the term is welcome and uncharged. More reps working the feed means more attributable fundings, and those fundings are the case study we're buying with this deal.

## Appendix B — Audit + true-up clause

**Why it exists:** the register and the reporting covenant do the day-to-day attribution work. This clause is the formal backstop that makes quiet leakage feel risky. It's standard in finder's-fee agreements and rarely gets invoked.

**What it does:** once per 12 months, on 15 business days' notice, we can require a reconciliation of the customer's funded deals against the lead register — debtor name, funding date, funded amount — verifiable against the public record. Unpaid fees are due within 30 days. If the underpayment exceeds 5% of fees paid in the period, the customer also covers the audit cost — honest error costs them nothing; systematic leakage pays for its own discovery. An upgrade paragraph pre-agrees that invoicing can trigger directly off the public record once our coverage supports it, so the mechanism tightens without reopening the contract.

*Run past counsel before it appears in a signable document.*
