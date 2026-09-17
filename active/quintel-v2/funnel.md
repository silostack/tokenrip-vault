---
status: draft v0.1
last_revised: 2026-09-17
owner: Simon
serves: the architecture of step 1; every channel doc (inbound, outbound, signals) terminates here
tier: shareable with Alek. Not for David in this form; the shape can be described to him verbally.
---

# The pre-qualification funnel: one lead object, two sources, a handoff at the PII line

## 1. The so what

The funnel is the hub of step 1. Inbound (site) and outbound (email) are not two products; they are two sources that create the same lead object, which moves through the same stages, gets verified against the same public records, and is handed to an originator at the same point: the moment personal data is needed. Everything before that line is ours and requires no trust the borrower does not already extend to a useful website. Everything after it belongs to the originator, whose 22 years earn the fee. The funnel's byproduct is the dataset: borrower-stated intent on verified entities, plus the originator's outcome on each, which no one else in the market holds.

## 2. Why the funnel is shaped this way

Providence's funnel has two steps: reach the owner, then collect the application. That works when the brand carries the trust and a rep does the reaching. It fails for us on both counts (no history, no dial floor). Two observed problems the design has to solve:

| Problem                                                         | Evidence                                                                                          | Design answer                                                                                                          |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| A new brand cannot ask for PII                                  | David: nobody gives an SSN to a company formed last month; GW Capital blind blast drew only fraud | PII is collected by the originator, after the handoff (§4, stage 6)                                                    |
| Cold outreach under an unknown brand attracts fraud             | GW Capital's one real-looking respondent was a vacant desert lot                                  | We only send to verified entities; every reply is checked against the filed record before it is treated as a lead (§5) |
| The word "financing" triggers a reflexive no from in-box owners | WI and FL verdicts: modal rejection at the word financing, from operators who carry EF liens      | The site leads with the equipment question and the payment number, not the loan (§3, stage 1–2)                  |

## 3. The stages

```
 source ─▶ 1 DISCOVER ─▶ 2 ENGAGE ─▶ 3 QUALIFY ─▶ 4 VERIFY ─▶ 5 ROUTE ─▶ 6 HANDOFF ─▶ 7 OUTCOME
 (site /    (page or      (calculator  (stated      (our side:   (originator  (PII, app,   (label back
  email)     reply)        or reply)    intent,      registries)  panel)       close: theirs) to the row)
                                        no PII)
```

| # | Stage | What happens | Who | Fields captured |
|---|---|---|---|---|
| 1 | Discover | The owner (or his AI) lands on a page: a trade-equipment guide, a price/payment page, or the landing page of an outbound email | borrower | source, page, query or campaign/arm, timestamp |
| 2 | Engage | He asks for a number: "what would a $140K vac truck cost me a month" via calculator, or replies to an email | borrower | equipment class, price band, new/used, term preference, state, timing ("this month / this quarter / next year"), free text |
| 3 | Qualify | We ask only what a trade site would ask: business name, years in business, fleet or headcount band, a work email or mobile. No SSN, no DOB, no home address, no bank data | software | business name, TIB band, size band, contact channel, stated intent |
| 4 | Verify | We match the business to FMCSA / SOS / UCC records we already hold; confirm alive, officer, lien history, captive/bank exposure, our own suppression (prior touches, unsubscribes) | software, with a human read on the first 200 | `entity_id`, verification status (three-state), lien class, `fit_flag`, suppression hits |
| 5 | Route | Rules pick the originator: box fit, state, ticket size, exclusivity, prior touch. v1 panel is Providence only, but the rule engine exists from day one | software + Simon/Alek | originator, routing reason, SLA clock start |
| 6 | Handoff | Warm introduction: the originator receives the row's evidence (equipment, price band, timing, lien history, phone) and takes it from there, including the application and every piece of PII | originator | handoff timestamp, rep, first-contact date |
| 7 | Outcome | The originator returns a verdict on a fixed schedule: contacted / application / approved / funded / dead, with reason | originator → us | outcome, reason, dates, funded amount if any |

Stage 7 is what makes the funnel a loop. Without it the funnel is a lead form. It is also the attribution record: the deal entered through our funnel at a timestamp, and the originator's outcome is written back against it (`providence.md` §4).

## 4. The no-PII boundary

The line sits between stage 3 and stage 6. On our side of it we hold only what a trade website or a dealer would hold: business identity, stated need, a contact channel. This does three jobs at once:

- **Trust.** The borrower gives a fresh brand nothing he would not give a calculator.
- **Fraud.** There is nothing to steal and nothing to fake that we cannot check against a public record.
- **Compliance.** No consumer credit data, no FCRA exposure, and a lighter reading of state commercial-financing disclosure laws (which still need a counsel check: `threads.md` T12).

What we deliberately do not do on our side: pull credit, take an application, quote a binding rate, promise approval. The calculator shows a range with an on-screen disclaimer that it is an estimate, not an offer.

## 5. Verification-after-reply: the answer to GW Capital

Max's blind blast failed because the senders had no idea who was on the list, so a reply could be anyone. Our lists are built from registries, so a reply has to reconcile with a filed record:

- The replying domain or the stated business must match an entity in the pool (FMCSA legal name and city, SOS officer, MCS-150 email domain).
- Phone from the reply is checked against the MCS-150 and Twilio line type, as in flpool C3.
- A reply that does not reconcile is not a lead; it is a `verify_failed` row and goes to a human read.

Inbound leads (no prior row) get the same check in reverse: the stated business is looked up in the registries; a business that does not exist in any registry is parked, not routed.

## 6. Sources

| Source | Enters at | Notes |
|---|---|---|
| Site: equipment guides, price pages, calculator | stage 1–2 | the inbound engine (`inbound.md`, not yet written). The calculator is the entry point because nobody hesitates to type a price into one |
| Outbound email on Quintel domains | stage 1 (landing page) or stage 2 (reply) | the sends are triggered, not batched, once signals exist: a row enters a sequence when its event fires (`outbound.md`, `signals.md`, not yet written). Landing page is the site |
| Partner referral (service technicians, insurance agents, niche dealers) | stage 2 | later; `threads.md` T4, T7, T19. Technicians are the earliest partner in the chain: they see the repair-or-replace decision before any vendor is contacted |
| David's warm callbacks from the pilot | stage 5 | the pilot's open doors can be routed through the same ledger so they get outcomes too |

## 7. Routing rules, v1

- v1 panel: Providence (David). Rules still run, so the row carries `originator = PCF` and `routing_reason`.
- Screening before routing is against **our own records only**: prior touches, unsubscribes, verify-failed. We do not check an originator's CRM. A qualified application is a deal we are handing over, not a lead we are claiming; if the borrower already sits in the originator's database, that is the originator's internal matter (they route it to the right rep). Existing-customer collisions are therefore not a problem the design has to solve.
- Exclusivity: one originator per deal for a fixed window (proposed 30 days for a qualified application), then we place it elsewhere if there is no application or the originator passes.
- SLA: the originator confirms contact within one business day; a lead not touched in three days re-routes. This is the "buy operating advantage with the fee spread" idea from the August referral-network thinking.

## 8. Lead states

`new → engaged → qualified → verified | verify_failed → routed → contacted → application → approved | declined → funded | dead`, plus `parked` (no registry match, or timing later than 6 months) and `suppressed`. Every transition is timestamped and attributed to a source and a channel. This is the ledger the earlier labs-workspace thinking described; the spreadsheet holds until it breaks.

## 9. What is different from Providence's funnel

| Providence | Quintel v2 |
|---|---|
| Reach by dial; 25-5-1 is the owner's dream ratio | Reach by question answered; the owner arrives already asking |
| Rep qualifies on the phone in 30 seconds after 3 minutes of research | Software qualifies and verifies before any human time is spent |
| Application (PII) is step two | PII is the handoff, step six |
| Dedupe by hand against two locked CRMs | No collision problem: what is handed over is a deal with a timestamp, not a lead to be claimed |
| Outcomes live in the rep's head and the CRM | Outcomes come back as labels on the row |
| One brand, one shop | One funnel, a panel of originators |

## 10. What the funnel produces

- Qualified applications for originators (the revenue).
- The intent corpus: equipment × price band × timing × state × verified entity × originator outcome. Nobody else has this at the small-ticket end.
- Calibration for the signal experiments: every funded outcome becomes a positive label for whatever signal preceded it.
- The Gemini scrape David wanted: the calculator log is a live feed of what owners are pricing.

## 11. v1 scope and what waits

**v1:** one site, one calculator, the qualify form, verification against the registries we hold (FL, OH, WI, CO, TX when bought), a routing table with one originator, a handoff email with the evidence block, an outcome sheet David fills on the schedule he already uses.

**Waits:** partner sources; multi-originator routing in production; automated outcome ingest; anything that touches credit.

## 12. Open questions

- Which fields at stage 3 are the minimum the originator needs to take the call warm, and which can wait until his own call? (Ask David Saturday, in the abstract.)
- Does the calculator quote a range from public rate bands, or does it defer the number to the originator? A range is the hook; a wrong range is a trust cost.
- The exclusivity window and SLA numbers are guesses. Ratify with the first originator.
- Do inbound leads with no registry match get a lighter path (a human call) or a hard park? Depends on how many there are.
- State disclosure law may require specific language at stage 2 or 3 even without an application (`threads.md` T12).
