---
status: v0.1
last_revised: 2026-09-22
owner: Simon
serves: what the 09-22 call with David settled, what it deferred, and what it changed in the plan
tier: INTERNAL ONLY. David's phrasing and Providence internals; nothing here goes to a shareable doc verbatim.
source: `bd/calls/transcripts/david-lasaee-2026-09-22.md`
---

# The 09-22 call: aligned on everything, closed on nothing

## 1. The so what

The call moved three things to our side of the table and settled none of the hard ones. David now argues for our brand at the top of the funnel, for us being paid more, and for vendors as a separate program he will call himself. What did not happen: nobody at Providence was named to sign the referral fee, the phase 2 gate was not set, the lane pick and the one-slot referral question were not raised, and the legality of a landing page that feeds one AE was named as an open question and left there. His own line applies: these conversations happen and nobody executes.

Three facts from the call change the plan more than the agenda items did:

1. **His hands are the ceiling.** Every application is keyed into LeasePath by hand, two tasks created, a credit memo written, loan documents assembled. He puts his ceiling at 10–12 transactions a day at 14 hours; a realistic sustained number is a fraction of that. Offloading documents to the processors costs 4.5% of GM at quota and 8% below it, plus surcharges on titled and private-party deals. At our month-6 target (15–20 a month) he is fine. At his stated ambition (20 a week) he is not, and neither is Providence, which funds 50–60 a month in total.
2. **The CRM collision is real and counted.** 32,000 records, 4,800 active and off-limits (application received, or contacted in the last nine months). His returned sheets already show "not one or two" existing accounts. His fear is specific: an existing customer forwards his email to their AE, three reps walk into the owner's office, cease and desist. Under our brand the send is ours, the collision surfaces at handoff, and he gives those deals away as he has 20–25 times. That is the clean-handoff model doing its job, and it is the reason never to send under Providence's name.
3. **The trust problem is the brand problem, and he agrees with Simon.** "The moment I see finance, all my antennas go up." GW Capital ("Capital," a PO box) got hang-ups. His focus groups say blue-collar buyers ask ChatGPT whether a company is legitimate, and a two-week-old domain fails that check. So the site has to exist, look real, and carry an entity, an address, an about page and a LinkedIn before the first send in two weeks. That is the critical path now.

## 2. Facts and inferences from the call

| Item | What he said | Fact or inference |
|---|---|---|
| AE workflow | lead → application → manual LeasePath entry → credit and ops tasks → AE decides doable and price (buy rates 8–15%) → bank statements and returns → first-and-last deposit check → credit memo → source approval → AE does loan docs, or processors at 4.5%/8% | fact, his own desk |
| Throughput | 10–12 transactions a day at 14 hours; at that point no outbound at all | his estimate; treat 5 a day as the real ceiling |
| Compensation | every AE is W-2 on a $72K salary drawn against commission; can never owe more than $21K; nobody is 1099 | fact, corrects our assumption; he offered pay stubs |
| Referral fees | AEs and the company are both allowed to pay referral fees; no standard percentage stated | fact for the mechanism; the percentage and the approver are still unknown |
| Fee reaction | "fundamentally this works"; wants a tier above $1,000 for big GM ($50K GM → $2,000); "you need to get paid more"; wants to pay us pre-tax and has no accounting answer | fact |
| Phases | agrees with phase 1/2/3; "not fair for you to take a reduced number, especially with expenses on domains"; every dollar spent comes back before he is paid | fact; no gate set |
| CRM | 32,000 total, 4,800 active off-limits; nine-month rule; his engineers are building a ListPad compare tool with no API | fact for the counts; the tool is unbuilt |
| Email yield | Alek: three positive replies per ~1,000 sends; ten percent of positives fund; 7,000 a week → ~20 positives → ~2 funded | Alek's numbers; positive reply is not an application |
| Ramp | 500, then 1,000, then 5,000; first blast on a weekend to land Monday 9am; first batch two weeks out (warming); 20 per mailbox, 50 mailboxes | agreed in the room |
| Brand | own brand, under the radar, no "finance" or "capital" in the name; Providence introduced after the hit is checked; A/B test three Providence domains on 10,000 he pre-checks; his focus group (500 people) tests A/B/C copy this weekend | agreed; the Providence-domain test conflicts with our written-authorization rule |
| Landing page | Providence's site routes web leads to a general mailbox and distributes to all AEs (the Apollo lesson: $10K of leads went to everyone); a page that feeds him alone was an open legal question with Apollo and is still open | fact; the blessing question is the ownership question again |
| Handoff packet | name, phone, email, equipment type, maybe amount; no SSN or home address; a time-picker in the second touch, not the first; he needs the email the person replied to | agreed |
| Data | bulk UCC held for CT, FL, CO only; TX gated ($1–2K); IN, MI, OH no bulk; CT is off-ICP; he will fund data personally, recovered before he is paid; wants a bullet list of states, costs, amounts | fact; Simon's line (prove without buying) was accepted in principle |
| States | Florida, Ohio, Wisconsin done; Colorado and Texas finishing today; Indiana "pretty much all hang-ups"; North Carolina next; Texas is where the ICP lives | fact; note that Indiana was "his strongest state" on 09-19 |
| Vendors | Alek has 60–70 that fit (no financing page, small town, used); David checks them against the CRM and calls them; vendors are "a whole different program," separate meeting | agreed |
| Vendor pitch | loved "free B2B AI system that lifts sales 20%, send us your deals"; Apollo and B2B Rocket refused to build it | his enthusiasm; our exposure |
| Voter rolls | he is acquiring 36M voter records this weekend for election work and will cross them with the ICP | fact about him; not something we take |
| Sender | test David's name on our domain against ours | his suggestion |
| Signature | not asked, not named | gap |

## 3. What changed in the plan

- **The site is on the critical path, not a parallel track.** First send is in two weeks. Before it: the name, the domain, a page that passes the "is this legit" check (entity in the footer, a street address, about page with named people, a LinkedIn company page, the Quintel parent link for domain age), and the calculator. The home page mockup exists; v0 ships as trust page plus calculator, content later.
- **Own brand is decided with David in the room.** He arrived at it from the collision problem, not from our brand argument, which is the durable reason. Providence is named after the hit is checked against the CRM. The three-Providence-domain A/B stays behind the written-authorization rule; if ownership will not sign a two-line authorization for three domains, that is itself the answer about ownership.
- **The handoff is a check, not a transaction.** Every positive reply is checked against the CRM before David calls (his tool, or him by hand at the volumes we will actually have). Collisions go to the AE of record. The ledger records the check and the outcome. This replaces the "collisions are not our problem" line in `providence.md` §4 with "collisions are caught at handoff and cost us nothing."
- **His throughput is the volume model.** Plan to five applications a day through David as the ceiling; anything above needs his juniors or a processor, and the processor tax comes out of GM before anyone is paid. The ramp (500 → 1,000 → 5,000 a week) is his own rule and matches ours.
- **The referral fee needs one mechanical question answered:** is a referral fee deducted from GM before the 50/45/5 split, or paid out of the house's 50%? If it comes off GM first, a bigger referral fee is already pre-tax for him (he bears 45% of it), already approved as a mechanism, and phase 2 is a higher tier rather than a carve from his salary. That is cleaner than anything on the one-pager and may be what he was reaching for with "invoiced to the company." Confidence medium; ask, do not assume.
- **Phase 1 as sent, plus his correction:** 12.5% of GM to $7K, 10% above, a higher tier for large deals ($50K GM pays $2,000). He asked for it; write it in.
- **Data spend has a rule now.** Prove with Florida and Colorado; buy Texas when a state has produced a funded deal; any purchase is a recoverable expense on the ledger, whoever pays. Alek owes the cost list.
- **Vendors are their own program.** Sixty to seventy names to David after his CRM check; he calls. The pitch stays the website read, the tab and the two-hour answer. The "free AI system" is a later carrot; do not promise a build to get a call.
- **Indiana verdicts are noisy.** Best state on Saturday, all hang-ups on Monday. Reason codes on the ledger are the fix; his mood is not data.

## 4. What we do not do

- Take or process the voter file. It is his election-side data, its commercial use is restricted in many states, and nothing in the plan needs it. Say so once, without a lecture.
- Send under Providence's name without ownership's written authorization, including the A/B.
- Build the ListPad compare tool. It is his, on his side of the wall; we send the hits, he checks.
- Promise vendors an AI operating system in the first conversation.

## 5. Asks that were on the sheet and did not get asked

1. Who at Providence confirms the referral fee to an outside source at deal level, in writing. Now has a second form: who blesses a landing page that feeds one AE. Same person, one ask.
2. Whether the referral fee comes off GM before the split (§3).
3. The phase 2 gate in numbers (five funded or 60 days).
4. Whether a vendor-sourced deal codes the vendor or us (one slot).
5. Three lanes for six weeks.
6. The one question in his end-user script (where they bought the last unit).
7. What he meant by American Equipment Exchange; he re-sent an "information center" site on Slack, which may be the same thread.

These go in Slack this week, one at a time, not as a list. The signature ask goes first and goes from Alek.

## 6. What we owe him, from the call

- Focus-group questions for the weekend (A/B/C copy: finance-forward, under-the-radar, Providence; plus "what is the catch," "how did you get my information," and the ChatGPT legitimacy check on our domain).
- North Carolina list (Alek, today); the vendor 60–70 (Alek, first).
- The data cost list: states, cost, what it buys (Alek).
- The domain and name decision, with the site v0 date (Simon and Alek, today).
- The shared space showing the email each positive replied to (ledger v0, with the thread attached).
- Handoff packet fields fixed: name, phone, email, equipment, amount band; time-picker in the second touch.
