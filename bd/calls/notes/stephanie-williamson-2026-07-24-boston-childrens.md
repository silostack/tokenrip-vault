# Boston Children's / Matthew — 2026-07-24 (client-hosted prospect intro)

*Transcript: [[bd/calls/transcripts/stephanie-williamson-2026-07-24-boston-childrens]] · Contact: [[bd/calls/contacts/stephanie-williamson]] · Project: [[product/aicap/aicap-project-tracker]]*

*Short call (~10 minutes of substance). Stephanie ran it; Matthew answered; Simon asked one question at the end. **Raw capture had no speaker labels** — attribution in the transcript is reconstructed.*

---

## The headline

**Matthew handed over the executive business case, unprompted, and it is not the one AICAP has been telling.** He also killed a design problem the 07-22 call had declared unsolvable. But **no commercial motion occurred** — the "specific ask" he requested on 07-22 was neither defined nor discussed, by anyone.

## Momentum

**→ Flat commercially, ↑ on product intelligence.** Matthew's posture was helpful-advisor, not buyer-in-motion: he answered every question generously, volunteered a real objection, offered to review Stephanie's collateral, and asked for nothing. He closed with *"thanks for checking in and reaching out"* — warm, passive. Nobody moved toward a pilot.

---

## 1. The executive-buy-in objection is now the gate on the first customer

Stephanie surfaced it herself: **two of the places she has talked to have flagged that the CMO or CEO won't understand "why we need yet another product for credentialing."** She had assumed executive buy-in would be automatic (*"I thought that executive buy-in would be like, yes, let's get applications done faster"*). It isn't.

Matthew validated it hard and put a number band on it:

> *"You're gonna pay, let's say, $100,000 a year for production software. Why do you need to pay, I don't know, $10,000 more for whatever this is? … you are gonna face pushback in the sense of: we're spending this much money on a credentialing software, why is it not also doing this other thing?"*

**Two things to extract:**

- **The objection is not "does it work" — it's "why is this a separate line item."** Every hospital already owns credentialing software. AICAP is an *attach* sale against an incumbent that the buyer believes should already do this. That is a fundamentally different sale from the pain-based pitch in the file, and it lands on a persona (CMO/CEO) nobody has been selling to.
- **First price signal from the buy side anywhere in the AICAP file.** ~$100K/yr incumbent, "$10,000 more" for AICAP — roughly a 10% attach ratio. It was offhand and illustrative, not a quote, and it is one director's casual framing. But it is the only buyer-originated number on record, and it sits well below the "premium licensing fee" posture in the contact doc. **Do not treat it as a price. Do treat it as evidence that the executive-facing ROI case has to be enormous relative to the ask.**

## 2. Matthew dictated the ROI argument — and it turns on a metric gap nobody was using

The single most useful thing he said:

> *"We don't consider our turnaround times until the applicant has submitted their application. But our customers are like, well, they signed their contract on this date, and then they're credentialed on this date, and that's like 90 days or whatever."*

**The medical staff office measures from application-submitted. The hospital's internal customers — departments, executives, the people who feel the lost revenue — measure from contract-signed.** AICAP lives entirely inside the gap between those two dates.

That gap is:
- **Invisible in the incumbent's metrics** — which is exactly why the CMO doesn't see why the $100K software isn't already handling it. It isn't in the report.
- **Where the executive's pain actually is** — their clock started at contract signature.
- **Unowned.** No vendor is measured on it. No one reports it.

**This is the answer to the executive objection, and it is stronger than the $22K/day frame** because it explains *why the incumbent is not failing at its job* while AICAP is still necessary. It reframes AICAP from "a second credentialing product" to "the only thing measuring the interval your credentialing software doesn't start the clock on." It should go straight into Stephanie's executive talking-points form (see §5) and into whatever we bring back to Matthew.

**His root-cause breakdown** (he runs this monthly, on anyone above one standard deviation from the mean turnaround) — outliers fall into two buckets:
1. **Foreign-trained** — visa, license timing. *Not addressable by AICAP.*
2. **Applicant non-responsiveness** — *"we asked so-and-so for their updated CV for the 45th time and it took them three months to respond."* **This is AICAP's entire target.**

His framing of the goal, verbatim and worth reusing: *"How do we get people to be successful with what we need from them the first go-around, rather than keep asking them over and over again."*

He also named the three drivers of long turnaround overall: license delays, malpractice-verification delays, and applicant engagement. **AICAP touches only the third.** Honest scoping input — don't let the pitch imply otherwise in front of someone who does root-cause analysis monthly.

## 3. The office-address problem is solved — and the 07-22 verdict was wrong

On 07-22 Simon and Stephanie spent a meaningful block concluding this was unsolvable, and logged a design decision to *"leave the internal-office layer configurable, don't model it."*

Matthew answered it in one sentence:

> *"We use the generic addresses, where we don't get too specific. We'll just use the general hospital address, the general site address, versus any type of specific suite."*

Stephanie: *"Okay. That makes it easy."*

**Design implication:** default to **hospital/site-level address**, with granularity configurable per hospital for the minority who want suite/floor detail. That is a much simpler build than "configurable, unmodeled," and it is now grounded in a customer's actual practice rather than two insiders' worst-case memory.

**Methodological note worth keeping.** Two experienced people — one with 20 years in the domain — reasoned themselves into "unsolvable" on a question the customer resolved instantly and for free. The cheapest disconfirming test was 48 hours away and it worked. **The lesson is not about addresses.** Both parties should hold "we already know how hospitals do this" much more loosely; Stephanie's experience is deep but it is *n* hospitals, not all of them, and her own sample skewed disorganized (*"none of the ones that I have worked for have been particularly organized about it"*).

## 4. New configuration dimensions for the build

Matthew's answer on what must be entity-specific vs. generic:

| Layer | Verdict |
|---|---|
| **The bulk of the application** | **Generic** — *"most of the application will be generic."* Confirms the superset-plus-config architecture (tracker decision 2026-07-02). |
| Disclosure questions | Per-entity |
| Signature pages | Per-entity |
| Attestations | Per-entity — some state-specific, some internal |
| State forms | Per-state |
| **HR / hospital forms** | **New — not in the model.** IP agreements, HIPAA-compliance forms, other non-credentialing hospital paperwork. Hospitals deliberately bundle these: *"we try to collect all the forms in one system so people aren't being asked by multiple different groups."* |
| **Branching logic on applicant experience** | **New — not in the model.** Foreign-trained vs. domestic-trained is the named axis. |

**Two open items this creates:**

- **The HR-forms bundle sits in tension with Stephanie's minimalism constraint** (*"we do not ask for anything that is not needed… if it's provided, we're obligated to verify it"*, 07-01). Her rule governs *credentialing* data; hospitals evidently attach non-credentialing forms to the same intake for convenience. These are compatible — the forms are pass-through collection, not verifiable credentialing assertions — but the distinction needs to be explicit in the model, or the two rules will collide during config.
- **Foreign-trained branching** is a config dimension with real depth (visa status, ECFMG, foreign medical school verification paths). It is also, by Matthew's own analysis, the outlier category AICAP *can't* fix. Scope it as a branching path, not a solved problem.

**Build item from Matthew's example:** *"who was your malpractice carrier when you worked at this place? Oh, I don't know."* Historical malpractice carrier, per prior employer, is a concrete high-friction field — a named target for inference + guided questioning.

## 5. Stephanie is building the executive-buy-in artifact herself

She has created an **"executive talking-points form"** and asked Matthew to review it. Good instinct, right artifact, and she found the gap before anyone told her about it.

**Simon should be inside that document.** It is the piece of collateral that will carry the metric-gap argument from §2, and it is where the "why not just make the incumbent do it" objection gets answered. It has never been discussed with him and he has not seen it. Ask for it.

## 6. What did *not* happen

- **The "specific ask" was neither defined nor raised.** This was the entire stated purpose of getting to Matthew (contact doc item #33, and load-bearing assumption #3: *"Ask Matthew directly on Friday — what would you want to see in that ask?"* — flagged as the cheapest possible test, 48 hours away). It was not asked. Simon's one question was a confirmation of something Matthew had just said, not the open test.
- **Mitigating context:** it was Stephanie's meeting, Simon was introduced as a listener, and pushing Matthew on pilot scope would have cut directly against her explicit and deliberate posture (*"I don't want to push him into a corner or uncomfortable spot where he stops talking to me"*).
- **Which is the actual problem, and it is structural, not a slip.** Her relationship-protective posture means the buying question may never get asked by her. If it is never asked, Matthew stays a generous advisor indefinitely — which is a perfectly comfortable equilibrium for both of them. **Assumption #3 remains untested, and the plan to test it has to survive her non-presumptive style rather than assume she'll do it.**
- **The office-address homework (contact item #41) was completed** — Stephanie asked, and got the answer.

## 7. Stephanie introduced Simon as **"my founding engineer"**

Unprompted, to her most important prospect, as the framing she chose.

That is a meaningful upgrade from "the developer building my MVP" and it confirms she thinks of him as inside the company rather than vendored to it. It is also, precisely, a title that normally carries equity — offered to someone on a $12K fixed-price contract, with no equity, who declined a raise two days earlier. **The title she uses and the deal she has are two different relationships.** See the commercial thread in the contact doc; this is a data point in favor of naming the role formally rather than letting it stay honorific.

---

## Follow-Up Actions

### Ours

| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | **Rebuild the pilot ask around the executive objection, not the MSP pain.** Matthew's "specific ask" now has a known shape: it must survive a CMO asking why the $100K incumbent doesn't do this. Lead with the contract-signed → credentialed metric gap | Simon | 2026-07-29 |
| 2 | **Ask Stephanie for her executive talking-points form** and get the metric-gap argument into it before she sends it to Matthew | Simon | 2026-07-28 |
| 3 | **Revise the office-address design** — default to hospital/site-level, granularity configurable. Supersedes the 07-22 "leave it unmodeled" decision | Simon | Week 3 |
| 4 | **Add to the domain model:** non-credentialing hospital forms as pass-through collection (distinct from verifiable credentialing data); foreign-trained vs. domestic-trained branching | Simon | Week 3 |
| 5 | Add **historical malpractice carrier per prior employer** to the guided-question / inference targets | Simon | Week 3 |
| 6 | **Plan how the pilot question actually gets asked**, given Stephanie won't push. Options: Simon asks it directly next time, or it's embedded in the written ask so Matthew answers on his own time | Simon | Before next Matthew contact |

### Theirs

| # | Action | Who | Due |
|---|--------|-----|-----|
| 1 | Send the executive talking-points form to Matthew for feedback | Stephanie | committed on-call |
| 2 | Review the form | Matthew | — |

### Open questions

- **Is the ~$100K/$10K band anywhere near real, or one director's offhand arithmetic?** It is the only buy-side number in the file and it is well below the "premium licensing fee" posture. Worth testing against Stephanie's own pricing intent before the ask is written.
- **Who is the actual economic buyer?** Matthew is the director of the medical staff office and has been treated as the decision-maker. His own answer implies the CMO/CEO holds the budget for a new line item — which means the champion→buyer handoff problem exists here too.
- **Does AICAP's value case survive contact with a CMO** who is measured on cost, not on MSP turnaround? The metric gap is the argument; it has never been tested on an executive.
- **How many of Stephanie's other leads have the same executive-buy-in blocker?** Two of the places she has talked to raised it, and she says she hasn't been asking. The real rate is unknown and probably higher.
