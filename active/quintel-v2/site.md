---
status: draft v0.1
last_revised: 2026-09-22 (name decided: Ironmark, ironmarkep.com)
owner: Simon
serves: what the Quintel v2 site is for, what v1 contains, the roadmap, and the name
tier: internal (scope and roadmap can be shared with Alek; naming stays here until decided)
---

# The site: jobs, v1 scope, roadmap, name

## 1. The so what

The site is the one surface every source in Quintel v2 lands on: an owner who searched, an owner who replied to an email, an owner whose mechanic showed him a link. Its job is to turn "I need a unit" into a qualified application without asking for anything a trade website would not ask, and to hand that application to an originator. v1 is small: a payment calculator, a qualify form, verification, a handoff, a partner link. Content and search ranking are added on the same domain afterwards, at the pace the lanes justify. The name is a separate decision with a short list below.

## 2. Jobs to be done

Written from each user's side of the screen.

| Who                                                              | Job                                                                                                         | What the site has to do                                                                                                                                                                                           | Version                                              |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **Owner-operator** (2–25 employees, no CFO, has financed before) | "Tell me what this unit will cost me a month, right now, without a sales call or a credit pull."            | Calculator: equipment class, price, new/used, term, state → a monthly range with an honest disclaimer. Then the smallest possible form: business name, years in business, fleet band, work email or mobile, when. | v1                                                   |
| Same owner, arriving from an email                               | "Is this real, and does it know my business?"                                                               | The landing page repeats the specifics from the email (the asset, the lender, the filing month) and goes straight to the number.                                                                                  | v1                                                   |
| Same owner, arriving from his AI                                 | "Which machine, roughly what does it cost, and what's the monthly."                                         | Equipment pages per lane that answer the real question with real price bands and specs, structured so an answer engine can cite them.                                                                             | v2 (two lane pages in v1 so the domain is not empty) |
| **Technician / shop**                                            | "Give my customer a monthly number on the spot so the job closes, and pay me a finder's fee when it funds." | A link and QR per shop that pre-fills the shop as seller of record; a one-screen partner page that says what happens and what the shop earns.                                                                     | v1 link; v1.1 partner page                           |
| **Dealer / vendor**                                              | "Send my buyer somewhere that gets him approved fast without me building a finance desk."                   | Same partner link mechanism, dealer copy. Not a directory, not a marketplace.                                                                                                                                     | v1.1                                                 |
| **Insurance agent**                                              | "My client just lost a truck; give him a replacement number."                                               | Same link, agent copy.                                                                                                                                                                                            | v1.1                                                 |
| **Originator** (Providence)                                      | "Hand me a deal that has already asked for a number, with the evidence, and tell me what happened to it."   | Handoff email with the evidence block; outcome sheet in their format; monthly attributed list. Never on the public page.                                                                                          | v1 (sheet); v2.1 (originator-facing entry)           |
| **Us**                                                           | "Every visit, quote, form and outcome becomes a labeled row."                                               | The ledger (`funnel.md` §8) and the calculator log, which is the stated-intent feed (`thesis.md` §4.7).                                                                                                           | v1                                                   |

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

**Registry check, 2026-09-18 (Verisign RDAP; 200 = registered, 404 = free).** Every exact-name .com on the first shortlist is registered: Loadline, Rigline, Rigmark, Loadmark, Gradeline, Spanline, Rigyard, Toolbay, Ironline. The .co is free for Loadline, Rigline, Rigmark, Loadmark, Gradeline. Of ~130 further coined compounds tested, the .com is free for the names below.

**Second round: names with a free .com.** Same criteria (no category word, two or three syllables, trade image, says aloud in a bay), now filtered by availability. The "number" shapes (sum, figures, tally) say what the site does without a finance or equipment word; the "mark" and "stamp" shapes read as approval.

| Name | Image | Say it | Notes |
|---|---|---|---|
| **Rigsum** | the sum on the rig: the number | clean, two beats; "Rigsum says $1,900" | strongest of the set: short, hard, says the job (a sum) without finance or equipment. .com free |
| **Rigfigure** | "run the figures" on the rig; trade phrase | clean; "put it through Rigfigure" | three syllables; "figure" is exactly the word an owner uses for the monthly. .com free (also rigfigures.com) |
| **Loadfigure** | the figure on the load | clean | softer than Rigfigure; same idea. .com free |
| **Winchmark** | the winch pulls the load in; mark = approval | clean, hard | strong sticker word; "winch" is universal across trucks and iron. .com free |
| **Haulsum** / **Ironsum** | the number on the haul / on the iron | clean | Haulsum leans trucks, Ironsum leans excavators. .com: haulsum registered, ironsum registered; gradesum, boomsum, torqsum free |
| **Torqsum** | torque + sum | clean, very hard consonants | reads as a tool brand; slightly more "gearhead" than "owner." .com free |
| **Loadstamp** / **Haulstamp** | the stamp on the load: approved | clean | "stamp" reads as sign-off; good for the partner sticker. .com free |
| **Boomtally** / **Winchtally** | tally = count it up | fine | three syllables; "tally" is friendly and plain. .com free |
| **Lugline** | lug nut + line | clean | small image; listed because the .com is free |
| **Clevismark** | clevis pin: the connector on every hitch and bucket | clean but obscure | trade-authentic, most owners know the word, most googlers won't. .com free |

**Working shortlist after the check:** **Rigsum**, **Rigfigure**, **Winchmark**. Loadline stays the best meaning but only on a .co or a bought .com. Descriptor line under any of them: "Payment quotes for equipment and trades." Legal entity and footer carry the category word: "[Name] is a Quintel company · [Name] Financial Services LLC."

**Decision (Simon, 2026-09-22): Ironmark.** Domain **ironmarkep.com**, registered; the entity reads Ironmark Equipment Partners. It fits the rules: two beats, hard consonants, says a tool brand not a fintech, category word in the entity and not the name. Two things to carry: ironmark.com is held by an unrelated Maryland marketing company, so the site never uses the bare name as a URL and the descriptor line does the disambiguation; and "Partners" can read as an investment firm to a cold reader, which the focus group tests (question 9) and the descriptor corrects. The mockup stays on the Rigsum wordmark until the v0 build; only the name changes.

## 6. Trust surface (what a fresh brand can show on day one)

A real entity and address in the footer; a phone that a person answers; the "a Quintel product" line with a link to a company page; the disclaimer copy on the calculator; a short "how this works and who funds it" page that names the funding partners as a category, not by name; the specifics in every email landing page. None of this fakes history. It signals that someone is behind the page and that the site never asks for what only a lender should.

## 7. Home page, and the .com question

**Who lands on the home page.** In v1 almost nobody arrives to shop. Traffic comes in through side doors: an email link lands on a page that repeats the email's specifics; a shop's QR lands on the partner-prefilled calculator; an AI answer lands on a lane page. The person who types the bare domain or googles the name got an email or saw the link and is checking whether we exist before he types his business name anywhere. The home page's first job is the verification visit. Second visitor: Providence's people, a funder, a shop deciding whether to put the sticker up. Third: the AI crawler.

**So the home page is a credibility page with one action.** One line on what this is; the calculator as the single call to action; who funds it, as a category; how it works in three steps; a phone number, an address, a named person; "a Quintel company." Real trucks, no stock photos. Not a lender page; no "Apply now."

**The category word and the .com are separate questions.** "Capital" or "finance" in the name does not buy trust at the verification moment: that is the shape of every cold email the owner already deletes, and a name in that set has to prove it is not one of them. A trade-named site is not in that set. The category word belongs in the legal entity and the footer, where funders and compliance read it. The .com is a different matter: a .co reads "tech" to this buyer and a googled name that resolves to someone else's .com is a leak. Order of preference: (1) buy the exact-name .com if parked and priced sanely; (2) pick a name whose .com is free (the second-round list above); (3) take the .co plus a short .com redirect without a category word; (4) only then append a word, and make it the descriptor ("quotes"), not the category ("capital").

**Mockup (2026-09-19).** Desktop page plus a phone view arriving from a shop QR, on the Rigsum working name: https://claude.ai/artifact/3F7eTrqrFSXNbWJe6dCUyJ. Structure: nav with descriptor and answered phone; hero = one line on what it does + the calculator as the only call to action; trust strip (trades served, trades not served); three steps; what the page never asks for + we are not the lender; shop and dealer link with the counter sticker; who funds it (category), who we are (named person), talk to a person; footer with entity and disclosure lines.

**Funnel order.** Partner links and outbound landing pages first; they are the traffic. The calculator is the product on every page, one component, three entrances, different copy above it. Lane pages are the inbound bet on a quarter's horizon and live on the same domain so the crawler and the googler find a real site. Voice does more than the TLD: plain words, dollars, a named sender, one photo of an actual vac truck. Fullbay, TruckPaper and Ritchie Bros are the register.

## 8. Open questions

- Range or defer: does the calculator show a monthly range from public rate bands, or ask the originator for the number? Range is the hook; a wrong range is a trust cost.
- Which two lanes get the first pages, given the loss-signal experiment and the technician lanes may pull toward upfitters and refrigeration rather than vac/septic.
- Whether the partner page needs a partner login by v1.1, or a link is enough for the first ten shops.
- State disclosure language on the calculator and the form (`threads.md` T12).
