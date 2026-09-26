---
status: v0.1
last_revised: 2026-09-26
owner: Simon
serves: what the 09-26 call with David settled, what it exposed, what it changes in the engine design and the build, and the angles the three of us did not raise
tier: INTERNAL ONLY. David's phrasing and Providence internals; nothing here goes to a shareable doc verbatim.
source: `bd/calls/transcripts/david-lasaee-2026-09-26.md`
---

# The 09-26 call: the first touch is a conversation, not a form

## 1. The so what

The call moved the design in one direction: **the first reply from an owner opens a short conversation, and the machine has to carry that conversation before anyone is handed to a lender.** Three things follow. The instant response after a reply is not the handoff; it is a question back, sent within minutes, with no lender named. The book check gates the handoff, not the acknowledgment. And the reply engine needs a small set of templated, human-approved answers for the questions every owner asks first ("what's your rate," "who are you," "how did you get my name," "who's the lender"), on email now and on text soon.

Two other things changed. David himself said a collision lead should go to a different lender ("otherwise you're not going to make money"), which removes the caution we had built around asking him. And the Ironmark program narrows to the trades and trucks ICP for v1; the sophisticated small-company ICP (packaging, robotics, lab, pharma) is a second brand or tenant later, not a lane in this one.

The uncomfortable fact: David does not expect sustainable revenue before mid-January, the send calendar loses most of the second half of November and December, and he is spending heavily on his own side ($45K on focus groups this weekend, charged back by his bank partner). The learning window is roughly October 6 to November 14. The build has to produce labeled outcomes inside that window, and the vendor lane, not email, is where near-term revenue is.

## 2. Facts and inferences

| Item | What he said | Fact or inference |
|---|---|---|
| Site read | it looks like an equipment finance platform, near-identical to Providence; other lenders will see competition; do not advertise the same owners as Quintel (different city, domain); vendors must feel the platform is neutral and that competitors will not see their information; Approve.com is the closest model | his read; the vendor-privacy point is from his focus groups (inferred) |
| Two ICPs | "hands team" (construction, digging, trucks) and sophisticated two-to-six person companies (packaging, robotics, AI-adjacent, lab) with no CFO; the second will not associate with an iron brand; Amazon/luxury analogy; he flips his own pitch by profile | his experience; being tested in the focus group today |
| Decision on the call | go with the low-hanging fruit (trades), take food processing and high tech out of the first step; replicate later | agreed by all three |
| Search behavior | equipment name first, then price; financing comes later; AI overviews now answer the generic query; sponsored results dominate "for sale"; buyers go to marketplace price rails with their own calculators; Google will not sell real-time intent | live demo plus his Google contact; fact for what we saw |
| Indiana list | dated data: wrong numbers, out of business, owner dead or sold; no intent used | fact; his dial results |
| Four groups | (1) ICP with no intent, (2) ICP with an intent signal, (3) inbound from the site (6–9 months out), (4) UCC past filers hit monthly hoping to catch the growing ones | his framing of ours |
| Capacity 10-06 | 600 a day (20 × 30 mailboxes), rising to 750–900; Monday to Friday; second mailbox round warming for redundancy | Alek and Simon |
| Calendar | Oct 12 is a holiday, do not send; Nov 17–30 dead; Dec 1–15 fine; after Dec 15 dead; first two to three weeks of January dead; sustainable inbound mid-January at the earliest | his rule of thumb from 22 years; treat as the send calendar |
| Vendors, non-US | Providence funds vendors abroad from its own pocket and waits one to six months for the source to reimburse; $10–20M out at any time; not scalable; be selective | fact about Providence's balance sheet; out of our scope |
| Vendors, US list | 8 of Alek's 73 already in the PCF database; his team is researching the decision maker (owner, not sales rep, in small shops) and parent ownership (a dealer bought by a major with the name kept is dead: "I have to go to their financing"); calls start Monday | fact; two data fields we can produce |
| All American Septic (GA, nine deals) | markers of a good customer: real website, online footprint, Google images, consistent site traffic, being searched; his engineer proposes ranking 10,000 ICP companies by search-volume growth (percentage and absolute together) | his hypothesis; Simon's counter (labels first) accepted in principle |
| Data sharing | he may bring a different computer; "somebody's going to say you're giving a lot of data to a third party" | his exposure at Providence; treat as a constraint on what we ask for |
| Alek's hits | a handful from a low-volume trial; one application, credit too weak (Apex X Logistics: 439 FICO, 11 hard inquiries, gave his number on the first line) | fact; the adverse-selection warning |
| Copy | "help" is the keyword; use the equipment name; "DOT" not "FMCSA"; "terms" not "rate"; first name always, never "hello"; subject line is the hello and the most critical part; structure = subject, who we are, what next | his rules |
| CTA | asking for a phone number on the first touch will be resisted (tested many times); "if you're interested, please respond"; the number is the second step | his tests; agrees with Simon's low-friction instinct |
| Honesty on the partner line | prefers to say upfront that we work with lending partners / qualified lenders; "if you're going to have an issue, let's have the issue upfront"; Alek dislikes the partner framing in cold email; David worries the owner asks "name five" | open; in the focus group |
| Second touch | must come back within minutes ("8:47 pm … 8:49") and be AI-driven; asks how they want to communicate (talk, email, text); many will say text; four steps: text, email, call me, give me your number so I can check you | his spec; conflicts with check-first only if the second touch names a lender |
| Conversation | nobody makes a $50–75K decision on texts and emails with someone they have never talked to; the rate question is always first and cannot be answered by email; get them on the phone; but "the moment he's interested, let's go for it, no more back and forth" | his read; consistent if the conversation is pre-positive and the handoff is fast post-positive |
| Handoff by phone | if the email is under Alek's name: "Alex told me to call you"; if under David's: "you emailed me," with a written answer ready ("that's our marketing platform, this is our finance platform") | his plan; both chains workable in his view |
| Collisions | "you have to take it to a different lender, otherwise you're not going to make money"; if it is his own customer, profit sharing | his position, unprompted; not ownership's |
| Check speed | Slack now; "if you're not monitoring Slack 24/7, 24 hours can go by … these things are hot"; a platform for the three of us when it grows | agreed; the register UI |
| Nurture | "not now, six months": a stay-in-touch system; safe holiday messages (New Year, Thanksgiving, Fourth, Labor Day, Memorial Day; "holiday" in December); texting needs their permission; ask for it in an email | his ask; TCPA consent applies |
| Brand recognition | LendingTree and NerdWallet spent hundreds of millions; floated offshore bots for fake reviews ("I know this is not legal") | we do not do this; see §4 |
| Directional-drill owner | six calls and ten emails a day from lenders who know his name and address; answers his cell because he did not recognize the name; company caller ID reads "PCF finance spam" | fact; the noise floor our email competes with |
| Cadence | standing Saturday meeting, optional Wednesday | agreed |

## 3. What changed in the design and the build

1. **The acknowledgment is instant and names no lender; the check gates the handoff.** This resolves the tension between `outbound.md` §5g (wait for the check) and David's two-minute rule. Sequence: positive or question → instant templated reply within minutes (acknowledge, one low-friction question back: what are you looking at, or how would you like to talk) → David's check in parallel → handoff email naming the rep and lender, copying the rep, after the check. Nothing the owner sees before the check mentions any lender.
2. **A conversational layer exists from day one, templated and human-approved, not AI-drafted.** Sub-classes under `question`: rate, who are you, how did you get my name, who is the lender, send me information, call me / text me. Each has a fixed answer with slots, sent by a person from the takeover inbox with one click; the rate answer is David's line (terms depend on time in business and credit; a ten-minute call gets a real number). This is the "foreplay" David described and Simon asked to build for. The no-AI-conversation rule still holds; templates are not drafting.
3. **Channels are a port.** Email now; SMS in weeks 3–4, only after an explicit "text me" or an opt-in, with consent recorded per contact, quiet hours, STOP handling. The conversational layer is channel-agnostic. A nurture track ("not now," holiday touches by first name) is the same machinery on a slower clock.
4. **The planner gets a send calendar.** No Oct 12; Nov 17–30 dark; Dec 16 to about Jan 20 dark; per-state holidays later. The learning window is Oct 6 to Nov 14; plan the ramp and the first re-measure inside it.
5. **Re-contact policy per arm.** The UCC past-filer group is a cohort touched on a cadence (quarterly to start), not one-and-done with a 90-day cooldown. `recontact_policy` on the arm; cooldown stays the default for rosters.
6. **ICP scope for Ironmark v1 is trades and trucks.** Machinery lanes (packaging, food processing, pharma, robotics, lab) leave the email program; the Lead Envelope carries `icp_profile`; the fit scorer excludes those lanes for this tenant; a second tenant with its own brand and imagery picks them up later. `launch.md` §3 #15 and §7b are amended.
7. **Pre-qualification adds liveness and owner currency.** The Indiana list failed on stale data, not on fit. The prequal job checks SOS status active, website alive, a recent public trace (filing, listing, review), and whether the named contact still appears as the officer; a stale row is `rejected: stale`, not `ready`.
8. **Footprint as a fit feature, labels first.** Website quality, Google Business presence and review recency, indexed pages, marketplace listings become `facts` and a `footprint_score`. The labeled set does not require David to export anything: every `in_book:customer` mark on the register is a Providence-customer label arriving for free, and his nine-deal example can be matched by name. Pre-register the test (does footprint predict positive replies and applications?) before building the ranking his engineer proposed.
9. **Adverse selection on the phone-number ask.** The one reply that gave a number on the first line was a 439 FICO. Owners who resist the number ask are the ICP; owners who volunteer it skew to the desperate. The packet to David carries years in business, prior financing and fleet so he can triage; the fit scorer drops interstate truckers Providence cannot finance before they ever reach him.
10. **Copy rules into the template system.** Subject line per origin: the equipment name when there is an intent signal, an opening statement when there is not. "DOT" not "FMCSA." "Terms" not "rate." First name always. CTA is "if you're interested, reply" or a one-word confirmation; never a phone-number ask on touch one. The partner line runs as an arm (present versus absent on touch one) and the focus group answers first.
11. **Re-routing collisions is now David's stated position, not our ask.** `outbound.md` §5f's typed rule stays, and the funded-customer class still goes to the rep of record with profit sharing on his own customers, but the "contacted in nine months, never funded" class no longer waits on a hypothetical yes. Get it in writing when the referral terms are written; do not re-open it on a call.
12. **The register UI is the "platform for the three of us."** Slack is the interim ping. He endorsed both.

## 4. What we do not do

- Buy fake reviews or bots, offshore or otherwise. Illegal in the US, and it fails the exact legitimacy check we are designing for (an owner asking an AI whether Ironmark is real). Say so once if it comes up again.
- Hide the ownership link by faking a city or an entity. A legitimacy check that finds concealment is worse than one that finds a sibling company. What we can do: keep Quintel off the Ironmark page copy and out of the brand story, put real people on the About page, and position the two as borrower-side front door and lender-side tooling, which is true. Decide the footer line (`threads.md` T37).
- Promise multiple lenders. Day one is one partner. The honest line is a specialist lender for the owner's equipment, and the value is the legwork and the shield (see §5), not a marketplace we do not have.
- Text anyone without their explicit permission.

## 5. Angles the three of us did not raise

- **The shield is the value proposition.** The directional-drill owner's complaint is the market talking: ten emails and six calls a day from lenders who bought his name, and his number in every database. An intermediary that promises "one lender, one call, we don't sell your information" answers that pain directly and is true on day one. It reframes "why do I need a middle guy" from cost to protection. Test the line in copy; it is also the vendor-privacy assurance David asked for on the site, said to borrowers.
- **The check results are the labeled dataset.** David worried about exporting Providence data. He does not have to: marking `in_book` on the register is a label, and at a fifth of rows it accumulates fast. Say this to him; it lowers his exposure and gets us the calibration set his engineer wanted to build by hand.
- **The rate question decides the conversion, and it is unanswerable by email.** Every second touch will hit it. The templated answer plus "a ten-minute call gets you a number" is the pivot from email to phone, and it is the one place the conversational layer earns its keep. Measure how many positives ask it and how many convert to a call after the template.
- **The learning window is six weeks, then two months of dark.** If the first re-measure (the 3-per-1,000 rate, the collision rate, the contact-append rate) is not in hand by mid-November, the next honest read is late January. Build order should front-load measurement over volume: labels before connectors.
- **David's economics are a risk to the program.** $45K on focus groups charged back to him, "spending like a drunken sailor," no sustainable revenue until January. The vendor lane and his own calls are the near-term revenue; the email engine is the January engine. The ledger should show him the vendor pipeline too (`ledger.md` §2 job 7), so the thing he is paying for has a number on it before the emails do.
- **Vendor research is a Quintel job he is doing by hand.** Decision-maker identification (officer from SOS filings, chamber listings) and parent ownership (a dealer absorbed by a major) are lookups Quintel can run on the 73 before Monday. Small, and it shows the lab working for him.
- **The two-ICP finding is a tenancy test, not a naming problem.** Ironmark's iron is right for the trades and wrong for the PhD. The build already carries a tenant on every row; the second ICP is the first real use of it, with its own brand, imagery, sender and fit profile. Do not fold it into Ironmark's copy.
- **His four groups map onto our origin kinds, with one addition.** Random ICP = roster; intent = event; inbound = the site as a second lead source; UCC-monthly = roster with a re-contact cadence. The addition is that group four wants a cohort clock, which the planner did not have.

## 6. Follow-ups

**Ours.** Copy variants to David (sent during the call by Alek; more after the focus group). The send calendar into the planner. The conversational templates (rate, who, how-got-info, lender, send-info, call-me, text-me) drafted for the Wednesday standup. Decision-maker and parent-ownership lookups on the vendor 73. Standing Saturday meeting; optional Wednesday.

**His.** Focus-group results split by his two groups, with the verbatims. The application-page format he wants copied as the light form. Which holiday messages he wants in the nurture track.

**Not asked, again.** Who at Providence signs the referral fee. Whether re-routing collisions is ownership's position or his. The phase-2 gate in numbers. These go on the Saturday agenda, one at a time.
