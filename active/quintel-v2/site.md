---
status: draft v0.1
last_revised: 2026-09-17
owner: Simon
serves: what the Quintel v2 site is for, what v1 contains, the roadmap, and the name
tier: internal (scope and roadmap can be shared with Alek; naming stays here until decided)
---

# The site: jobs, v1 scope, roadmap, name

## 1. The so what

The site is the one surface every source in Quintel v2 lands on: an owner who searched, an owner who replied to an email, an owner whose mechanic showed him a link. Its job is to turn "I need a unit" into a qualified application without asking for anything a trade website would not ask, and to hand that application to an originator. v1 is small: a payment calculator, a qualify form, verification, a handoff, a partner link. Content and search ranking are added on the same domain afterwards, at the pace the lanes justify. The name is a separate decision with a short list below.

## 2. Jobs to be done

Written from each user's side of the screen.

| Who | Job | What the site has to do | Version |
|---|---|---|---|
| **Owner-operator** (2–25 employees, no CFO, has financed before) | "Tell me what this unit will cost me a month, right now, without a sales call or a credit pull." | Calculator: equipment class, price, new/used, term, state → a monthly range with an honest disclaimer. Then the smallest possible form: business name, years in business, fleet band, work email or mobile, when. | v1 |
| Same owner, arriving from an email | "Is this real, and does it know my business?" | The landing page repeats the specifics from the email (the asset, the lender, the filing month) and goes straight to the number. | v1 |
| Same owner, arriving from his AI | "Which machine, roughly what does it cost, and what's the monthly." | Equipment pages per lane that answer the real question with real price bands and specs, structured so an answer engine can cite them. | v2 (two lane pages in v1 so the domain is not empty) |
| **Technician / shop** | "Give my customer a monthly number on the spot so the job closes, and pay me a finder's fee when it funds." | A link and QR per shop that pre-fills the shop as seller of record; a one-screen partner page that says what happens and what the shop earns. | v1 link; v1.1 partner page |
| **Dealer / vendor** | "Send my buyer somewhere that gets him approved fast without me building a finance desk." | Same partner link mechanism, dealer copy. Not a directory, not a marketplace. | v1.1 |
| **Insurance agent** | "My client just lost a truck; give him a replacement number." | Same link, agent copy. | v1.1 |
| **Originator** (Providence) | "Hand me a deal that has already asked for a number, with the evidence, and tell me what happened to it." | Handoff email with the evidence block; outcome sheet in their format; monthly attributed list. Never on the public page. | v1 (sheet); v2.1 (originator-facing entry) |
| **Us** | "Every visit, quote, form and outcome becomes a labeled row." | The ledger (`funnel.md` §8) and the calculator log, which is the stated-intent feed (`thesis.md` §4.7). | v1 |

## 3. v1 scope (3–4 weeks)

**In**
- One domain, one brand (§5). Footer: "a Quintel product," legal entity, address, a phone that is answered.
- **Calculator.** Inputs: equipment class (picklist by lane, with "other"), price, new/used, term, state; output: a monthly range from public rate bands with the on-screen line that it is an estimate, not an offer. Every calculation logged (no PII).
- **Qualify form.** Business name, years in business, fleet or headcount band, work email or mobile, timing (this month / this quarter / next year), optional free text. No SSN, DOB, home address, bank data.
- **Verification** against registries we hold (FMCSA, SOS, UCC) with three-state results; a human read on the first 200.
- **Routing table** with one originator and the rules written for a panel.
- **Handoff email** to the originator with the evidence block; **outcome sheet** in David's template.
- **Partner links.** `/p/<shop>` pre-fills seller of record; one partner page explaining the flow and the pay-at-install mechanics; a QR generator for the sticker.
- **Email landing pages** that carry the specifics from the outbound arm.
- Two lane pages only (vac/septic; specialty trucks) so the domain is not empty, written to be cited.
- Compliance line items from `threads.md` T12 confirmed before the form goes live.

**Out (v1)**
- Applications, credit pulls, rate quotes that bind, e-sign.
- Dealer directory, marketplace, reviews.
- Multi-originator routing in production.
- Automated outcome ingest.
- Full content library and AEO program (v2, `inbound.md`).
- Accounts or logins for anyone.

## 4. Roadmap

| Version | When | Adds | Decides |
|---|---|---|---|
| **v1** | weeks 1–4 | everything in §3 | do owners use the calculator, and does a warm handoff convert (first 20 routed applications) |
| **v1.1** | weeks 4–6 | partner pages live with the first shops from the H8 conversations; Section 179 calculator page for Q4; reply-to-landing personalisation for outbound arms | do shops use the link; does the seasonal page earn traffic |
| **v2** | weeks 6–12 | content engine: equipment pages per preferred lane, price bands, new-vs-used guides, state pages; structured data for answer engines; citation tracking; kill condition from `thesis.md` §8 | does citation share appear within two sprints |
| **v2.1** | quarter 2 | second originator in the routing table; originator-facing outcome entry replaces the sheet; automated verification reads | does the panel generalise |
| **later** | as evidence allows | proposal-tool integrations (ServiceTitan, Fullbay), distributor programs, repair financing path, the two-brand split if the resource site and the funding brand want different homes (`threads.md` T10) | |

## 5. Name

**Constraints (from Simon, 2026-09-17):** no category word (not funding, not equipment); need not contain "Quintel" (footer carries "a Quintel product"); flexible enough to survive step 2; leans toward the end user and the equipment world; must also work said aloud in a repair bay and printed on a QR sticker; coined conjunctions preferred because the domains are more likely to be free.

**What the name has to do:** two or three syllables, hard consonants, a trade-world image, and a descriptor line under it that does the category work ("Payment quotes for equipment and trades") and can change without a rename.

**Candidates.** Rigline is the current favourite on meaning; it stumbles slightly on the tongue (the g-l cluster). Alternatives keep the conjunction form and fix the roll.

| Name | Image | Say it | Notes |
|---|---|---|---|
| **Loadline** | the Plimsoll mark on a hull: the line that says how much a vessel can safely carry. Exactly what a monthly payment is: your safe carrying load | rolls clean; "hit the Loadline link" | best meaning in the set; nautical origin nobody in a bay will mind; conjunction, likely free |
| **Rigline** | rig = truck or iron; line = a credit line without saying it | g-l cluster is the stumble | keeps its meaning; Simon's favourite so far |
| **Rigmark** | the mark on the rig: a rating, a spec, a stamp of what it's worth | clean | "mark" reads as approval; strong sticker word |
| **Loadmark** | the same mark idea on the load | clean | slightly softer than Rigmark |
| **Ironline** | yellow iron and a line | clean | "iron" skews to excavators; less for trucks and refrigeration |
| **Gradeline** | grade = the slope a machine cuts, and a credit grade | clean | double meaning is nice; "grade" might read as school |
| **Spanline** | span = the reach of a crane or bridge; the term of a lease | clean | quieter image |
| **Haulmark** | trucks | clean | an existing trailer brand; avoid |
| **Rigyard** | the yard where the rigs live | clean | place, not a number; fine for a resource site, weaker for a link |
| **Axleline** | axle + line | mushy | listed to show the shape; skip |
| **Toolbay** | the bay where the work happens | clean | closest to the technician story; "tool" edges toward category |
| **Tandem** | two parties pulling one load | clean | not coined; likely contested; kept as the non-conjunction control |

**Recommendation:** shortlist **Loadline**, **Rigline**, **Rigmark**. Say each in three sentences a tech would say ("hit the Loadline link, it gives you the monthly"; "put it through Loadline"; "Loadline says $1,900"). Check .com and trademark for the three; register the sending-domain family the same day the name is chosen (`CLAUDE.md` brand decision, parts 2–4).

## 6. Trust surface (what a fresh brand can show on day one)

A real entity and address in the footer; a phone that a person answers; the "a Quintel product" line with a link to a company page; the disclaimer copy on the calculator; a short "how this works and who funds it" page that names the funding partners as a category, not by name; the specifics in every email landing page. None of this fakes history. It signals that someone is behind the page and that the site never asks for what only a lender should.

## 7. Open questions

- Range or defer: does the calculator show a monthly range from public rate bands, or ask the originator for the number? Range is the hook; a wrong range is a trust cost.
- Which two lanes get the first pages, given the loss-signal experiment and the technician lanes may pull toward upfitters and refrigeration rather than vac/septic.
- Whether the partner page needs a partner login by v1.1, or a link is enough for the first ten shops.
- State disclosure language on the calculator and the form (`threads.md` T12).
