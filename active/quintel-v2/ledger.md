---
status: v0.1 scope, for David's feedback
last_revised: 2026-09-22
owner: Simon (build), Alek (David's feedback)
serves: what the shared ledger is for, who uses it for what, the fields, the views, the build order, and the questions David answers before the build starts
tier: shareable with David as written
relationship: replaces the spreadsheet handoff; the record behind the referral fee; `launch.md` §6 holds the earlier requirements and is superseded by this
---

# The ledger: one place both sides look

## 1. What it is, in one paragraph

A shared record of every lead Quintel routes to David and every vendor Quintel sources for him, from the moment it enters to the moment it funds or dies, with both sides writing to it. Quintel writes what it knows at handoff. David writes what happens at Providence. Nobody sends a spreadsheet to anybody. The row is the proof of who sent what and when, which is what the referral fee is paid on, and the row's reason codes are how Quintel learns which lists to build next.

## 2. The jobs it has to do

For David, in the order he hits them on a normal day:

1. **See the new lead before he calls, with the context.** Which email the person replied to, what they wrote, what Quintel already knows about the business (state, equipment, fleet, years, lien on file). He reads a lot into a reply; he needs the reply in front of him, not a name and a number on Slack.
2. **Check it against the CRM and record the result.** Clear, existing customer, contacted in the last nine months, belongs to another AE. If it belongs to someone else, the row says so and who got it. This protects him inside Providence and protects the fee outside it.
3. **Get it into LeasePath fast.** Every application is keyed by hand. The packet has to come out in his column order so the entry is a paste, not a retype.
4. **Keep the status current without effort.** Four flags with dates: contacted, application pulled, approved or declined, funded or dead. Ticking a box on his phone counts.
5. **Get credit.** The referral source has to be coded on the deal at creation. The ledger carries the code and the LeasePath id so the deal and the row can be matched later.
6. **Say why.** A reason code and one line on every dead lead: credit, timing, price, went elsewhere, unreachable, out of box, existing customer, other. This is the loop back to Quintel he has said he wants.
7. **Work vendors the same way.** A second list: vendors Quintel sourced, his CRM check, his calls, where each one stands, deals that came through it.

For Quintel:

1. **The invoice.** Funded rows with GM and fee due per the chart, monthly, with the paid date. Attribution is in the row: entry timestamp before application date, funded within twelve months, any AE.
2. **The clock.** Time from routed to contacted, measured, so the two-hour rule is a number both sides can see.
3. **Conversion by source.** Which email arm, which copy, which state, which lane, which vendor produces applications and fundings. These are the outcome columns for every list experiment.
4. **The dead reasons,** by source. The cheapest signal there is about which lists to stop building.
5. **Vendor pipeline metrics.** Sourced, contacted, interested, tab live, first deal, productive.

## 3. What it is not

Not a CRM for Providence, not a place for anything Providence collects (no SSN, no home address, no bank data), not the dial lists (those stay in David's template as files until the ledger has earned it), and not an integration with LeasePath. Providence has no API and no IT team; the ledger asks Providence for nothing but reading and typing.

## 4. The fields

### Leads (one row per routed lead; created by Quintel)

| Group               | Fields                                                                                                                                              | Who writes               |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| Identity            | ledger id; entry timestamp; source (email arm, campaign, copy variant, step; or site; or vendor id; or trade show); business name; DBA; city; state | Quintel                  |
| Contact             | contact name; role; phone; work email; best time if given                                                                                           | Quintel                  |
| What they asked for | equipment; price band; new or used; timing; their reply text verbatim; the email they replied to (subject and body)                                 | Quintel                  |
| What we know        | years in business; fleet band; DOT number if any; lien and lender on file; verification result (registry match, phone type)                         | Quintel                  |
| CRM check           | result (pending, clear, existing customer, contacted within nine months, other AE); AE of record if not David; date                                 | David                    |
| Status              | routed → contacted → application → approved or declined → funded or dead; parked; void. Each with a date                                            | David (contacted onward) |
| Deal                | LeasePath id; AE on the deal; GM; referral coded (yes/no); funded amount band                                                                       | David                    |
| Outcome             | reason code; one line                                                                                                                               | David                    |
| Fee                 | fee due per chart; invoiced date; paid date                                                                                                         | Quintel                  |

Rules: nothing is deleted, a wrong row is marked void; every status change keeps its date; a lead is a row only after a person has asked for a number or replied positively, never a name from a list.

### Vendors (one row per sourced vendor)

| Group | Fields | Who writes |
|---|---|---|
| Identity | vendor id; name; lane; city; state; website; locations count | Quintel |
| Profile | financing tab (none, stale, live lender named); marketplaces it lists on; listing count; used or new; salesperson name and phone if on the site | Quintel |
| CRM check | result; date | David |
| Pipeline | sourced → contacted → interested → audit delivered → tab live → first deal → productive; each with a date; who is working it | David and Quintel |
| Notes | what they said; what they want | both |
| Deals | linked lead ids that came through this vendor | automatic |

## 5. The views

- **David's queue.** New leads not yet contacted, oldest first, with the clock running. The reply text on the row. One tap to mark contacted.
- **David's open deals.** Everything between contacted and funded, his four flags visible.
- **Reconciliation.** Funded rows this month with GM, fee due, paid. Exported as the invoice.
- **Sources.** For Quintel: leads, applications, fundings by arm, copy, state, lane, vendor; time to contact; reasons.
- **Vendors.** The pipeline as a board.
- **Export.** Any lead in David's LeasePath column order, one click.

## 6. Alerts

A new lead pings David (Slack, and text if he wants it) with the packet: name, business, state, equipment, price band, phone, the reply. The ping is what starts his two-hour clock. A lead uncontacted at two hours pings again. Nothing else pings.

## 7. Access

David edits his columns. Simon and Alek edit everything. Anyone else on David's side is added by name when he says so; the ledger records who changed what. Nobody at Providence beyond David until he asks.

## 8. Build order

**v0, this week.** A shared Google Sheet with the columns in §4, two tabs (Leads, Vendors), David's columns highlighted, dropdowns for status and reason codes, the reply text in a cell. Quintel writes rows from the email pipeline; David types in his columns; a nightly copy into Quintel's database runs the views in §5. Alerts by Slack from the same pipeline. Purpose: David reacts to the columns with real rows in them before anything is built.

**v1, before the first full send (about 10-06).** A page on the site behind a login for David: the queue, the open deals, the vendor board, the export. Same columns. Ping on new row to his phone. Built on the Quintel stack that already exists; the sheet stays as his export if he prefers it.

**Later, only if volume asks.** Access for David's juniors with their own queues; a second originator's columns; the LeasePath integration when ownership opens an API.

## 9. Questions for David before the build

1. The exact LeasePath fields for a new application, in order, so the export matches.
2. Where the referral source is coded in LeasePath (the field name and the values it takes) so the ledger mirrors it.
3. The reason codes in his words, for the dropdown. Our list is a draft.
4. What he wants to see first on a new lead: the reply email, or the business facts.
5. Slack, text, or both for the new-lead ping. And whether the two-hour re-ping is welcome or annoying.
6. Whether a sheet is fine for the first two weeks, or whether he wants the page from day one.
7. Who else on his side should see it, by name.
8. Whether his own leads (from his calls on our lists) should go on the same sheet so the state lists and the email leads read the same way. Our view: yes, since the fee applies to both.
