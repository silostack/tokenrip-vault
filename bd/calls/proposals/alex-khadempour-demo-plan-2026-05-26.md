---
title: Alex Khadempour Demo Package — Execution Plan
date: 2026-05-26
audience: Alek Perak
owner: Simon Pettibone
contact: Alex Khadempour (CICS Immigration)
status: ready to execute
---

# Alex Khadempour Demo Package — Execution Plan

Alek — this is the alignment doc for closing Alex. It covers what we're shipping by Friday, what each piece looks like, what you own vs. what I own, and how the sales motion plays out from email through close.

The full design spec for the mock itself is in [[../../active/cics-demo-mock-design-2026-05-26]]. Claude Code is implementing it; you don't need to read it unless you want to.

---

## The Strategic Frame

Alex pulled three deal shapes onto the table during the call: application review, Bill C-3 qualification chatbot, and an RCIC industry hub. We're leading with **Bill C-3** for three reasons:

1. It matches his stated #1 pain (lead qualification, not workflow)
2. The Bill C-3 American flood is time-bounded (~18 months) — natural urgency
3. He explicitly invited a Bill C-3 chatbot during the call: *"maybe that's one area you guys can maybe support us"*

The other two deal shapes don't disappear — they show up in the demo's roadmap screen and the proposal's Phase 2 / Phase 3 framing. Phase 1 (Bill C-3) is the only thing he commits to. Phase 2 (application review) shows up as a $1,000 add-on. Phase 3 (RCIC hub) is parked as a future conversation.

This is the **land-and-expand pattern** from `agents/closer/memory/patterns.md` — the same shape we used for Luai (Phase 1 = his firm, Phase 2 = his B2B venture).

---

## What Ships This Week — The Three Pieces

### 1. The Mock Demo

A static-but-credible interactive mock deployed at **demo.tokenrip.com/cics-immigration**.

It has nine screens across two surfaces:

**Customer-facing (what an American visitor to cicsimmigration.com sees):**
- Landing card with CICS branding
- 5-step intake (applicant info → ancestor chain → document upload → urgency/goals → submit)
- 8-second processing animation
- Lineage Audit Brief output ("POTENTIAL PATHWAY IDENTIFIED — RCIC review recommended")
- Mock Calendly booking beat

**Operator-facing (what Alex's team sees):**
- Dashboard with lead queue, weekly stats, funnel viz
- John Smith detail view — straightforward case (verifies the basic flow)
- Sarah Chen detail view — adoption edge case (proves the system flags what it doesn't know)
- Roadmap page showing Phase 1 / 2 / 3 progression

Everything is hardcoded — no real LLM, no real OCR. If Alex says yes, this codebase becomes the starting point for the actual build (not throwaway).

**Anchor cases the demo uses**:
- **John Michael Smith** (born 1985, Portland OR) — grandfather William Smith born 1923 in Halifax. Straightforward Bill C-3 pathway with some missing docs.
- **Sarah Chen** (born 1990, San Francisco) — birth father James MacKenzie born 1955 in Vancouver. Adoption case. Demonstrates the system correctly flags complexity for RCIC judgment instead of guessing.

### 2. The Loom Walkthrough

I record a 3-minute narrated walkthrough of the mock. Narration arc:

| Time | Beat | Key line |
|---|---|---|
| 0:00–0:20 | Frame the demo | *"Alex — here's what your Bill C-3 pre-audit looks like, both sides. Customer flow first, then your team's dashboard. Everything you'll see is mocked — no real LLM yet. We wanted you to see the shape before we wrote a line of code."* |
| 0:20–1:30 | Customer flow (intake → processing → audit brief → booking) | *"Notice the verdict says 'potential pathway,' never 'you qualify' — that determination stays with your team. The brief cites the regulation it's based on, which means if your client wants proof, it's there. Booking flows into your existing Calendly. Nothing in front of your clients is autonomous."* |
| 1:30–2:00 | Operator queue + John Smith detail | *"This is your dashboard. Every pre-audit lands here, sorted by status. Click John — full transcript, lineage diagram, evidence status. The agent drafts the follow-up email. Nothing reaches your client without your button click."* |
| 2:00–2:30 | Sarah Chen — adoption edge case | *"And here's where it earns its keep. Sarah Chen — adoption case. The system doesn't guess. It flags the case for RCIC review under Section 5.1, drafts a more cautious follow-up, and suggests a paid consultation instead of a free pre-audit because of the complexity. It knows what it doesn't know."* |
| 2:30–3:00 | Phase 1 / 2 / 3 close | *"Bill C-3 is where we start. The same architecture extends to application review across every other immigration type you run, and eventually to the RCIC hub idea you mentioned. Pilot is $5K, 90 days, your branding, your edge cases. The proposal is attached. If parts of the mock feel wrong, tell me — we redo the mock before any code gets written."* |

The narration vocalizes the **"never says you qualify"** safety guardrail — this is the single most important line in the video for Alex's trust calculus. He named the AI-receptionist failure during the call as his biggest fear about AI. We answer it explicitly in the narration, not just on screen.

### 3. The Proposal

You drafted this already at the share link you sent. The structure works. Two changes:

#### Change 1: Kill the $2,500 prototype fallback

This is a hunger tell. The 30-day no-conditions refund is already the de-risk Alex needs. A fallback price written into the document anchors against ourselves and signals the $5K isn't firm.

**Hold the $5K in writing.** If Alex pushes back on price in conversation, offer the fallback verbally as a "we can also do a scoped prototype first if you'd rather start there." Pricing leverage comes from the document holding firm and the verbal having room to move.

#### Change 2: Explicitly name Phase 2 and Phase 3

The demo's end card shows Phase 1 / 2 / 3. The proposal should mirror this:

- **Phase 1 — Bill C-3 Lineage Pre-Audit** — $5,000 pilot, 90 days, 30-day refund (this is what he commits to now)
- **Phase 2 — Application Review** — $1,000 per additional application type (visitor visa, study permit, work permit, PR, citizenship, etc.). Available as an add-on during or after the pilot.
- **Phase 3 — RCIC Hub** — parked. Separate scoping conversation when Phase 1 is live and proving.

This is consistent with the Luai proposal pricing structure and gives Alex a clear path forward without commitment.

#### Everything else in your draft stays

- $5,000 pilot fee for 90 days, all-in
- $500/month after the pilot (bridge monthly, locked 12 months or until Phase 2 starts)
- 30-day no-conditions refund
- Design partner rights (logo, case study, 2 reference calls/quarter for 12 months, anonymized pattern reuse)
- File-gate (build doesn't start until Alex provides 10–20 anonymized files and signs the reference-rights letter)
- Submission stays 100% human, AI never touches IRCC portals, no client-facing AI

---

## The Email — Final Draft

This is what you send Friday with the Loom link + proposal attached.

**Subject**: What CICS Bill C-3 looks like — mocked walkthrough

```
Alex,

We mocked the Bill C-3 pre-audit flow you described, both sides.
3-minute walkthrough here: [Loom link]

Everything in the video is static — no real LLM behind it yet.
We wanted to nail the shape before we wrote any code.

Two questions:

1. Does the customer-facing flow match what you'd want? Any
   questions you'd ask differently, add, or cut?

2. Does the operator dashboard show what you'd actually want
   to see when a lead lands?

If the shape is right, the next step is the proposal attached
to this email — $5K design-partner pilot, 90 days, your
branding, your edge cases, 30-day refund. If parts of the mock
are wrong, we redo before we build.

One thing worth being explicit on. Nothing we'd build for you
sits in front of your client. The AI-receptionist experience
you mentioned is exactly where AI underdelivers right now.
Behind the scenes is where it earns its keep. Your team stays
the face of CICS.

Talk Monday.

Alek
```

### Why this email works

- Two specific questions pull a reply without requiring one
- "If parts are wrong, we redo before we build" is the design-partner ask in plain language
- The AI-receptionist sentence closes his biggest objection in writing, in his own framing
- "Talk Monday" closes implicitly — no "let me know," no "happy to chat"
- The Loom is the proof, the proposal is the commercial frame, the email is the bridge

### One thing to humanize before sending

Run the email through the `/humanizer` skill before sending. The draft above is close but watch for any em-dashes that slipped in.

---

## Who Does What — Division of Labor

| Action | Owner | Due |
|---|---|---|
| Implement the mock (Claude Code does the work, I drive it) | Simon | Thu 2026-05-28 EOD |
| Deploy mock to demo.tokenrip.com/cics-immigration | Simon | Thu 2026-05-28 EOD |
| Record 3-min Loom walkthrough with the narration arc above | Simon | Fri 2026-05-29 morning |
| Update proposal: kill $2,500 fallback, add Phase 2/3 progression | Alek | Thu 2026-05-28 EOD |
| Publish proposal to Tokenrip (share link) | Alek | Fri 2026-05-29 morning |
| Send the email above with Loom link + proposal link to Alex | Alek | Fri 2026-05-29 EOD |
| Run email through `/humanizer` before sending | Alek | Pre-send |

---

## The Follow-Up Gameplan

### What happens after Alex receives the email

**Best case (he loves it)**: Alex replies enthusiastically, possibly with feedback on the customer-facing questions or operator dashboard. We schedule the call for early next week. Simon joins for the technical scoping conversation. We confirm scope, lock the kickoff date, file-gate ships, build begins.

**Likely case (he engages but with caveats)**: Alex replies with questions, edits, or specific concerns. The two questions in the email give him a structured way to respond. Whatever he says becomes the agenda for Monday's call.

**Watch case (silence)**: If no reply by **Wed 2026-06-03** (3 business days after Friday delivery), a dated follow-up fires. Don't let the silence-after-yes pattern eat this deal — this is Closer's #1 stall pattern.

### Stall-gate follow-up — what to send if he goes silent

```
Alex,

Wanted to make sure last week's email landed. Did the Loom
walkthrough match the picture you had in mind?

Even a "doesn't feel right, here's why" reply gives us what
we need to redo the mock. Happy to schedule 15 minutes to
walk through it together if easier.

— Alek
```

Send Wed 2026-06-03 morning. Don't drift past 7 business days without a follow-up.

### What we say if he pushes back on price

**Pushback shape 1**: "*$5K feels high — can we start smaller?*"

Verbal response: *"The $5K is the design-partner rate for the full pilot — 90 days, the build, integration with your Calendly, the operator dashboard. If you'd rather start with just the customer-facing pre-audit alone and add the dashboard later, we could scope that as a $2,500 prototype that credits toward the full pilot. The 30-day refund applies either way."*

This is where the fallback price lives — verbal, not written.

**Pushback shape 2**: "*What if it doesn't work?*"

Verbal response: *"That's exactly what the 30-day refund covers. Full no-questions refund any time in the first month. We don't earn the rest unless what we've built is working in your operation."*

**Pushback shape 3**: "*I've got another vendor pitching the hub — can you do that too?*"

Verbal response: *"On the hub — interested. But let's prove ourselves on Bill C-3 first. The hub is a bigger scope and a different commercial conversation. When this pilot is live and running, we'll have a much better basis for what the hub should look like, and you'll have direct experience working with us. If the other vendor is moving fast on the hub, that's a separate decision — but the Bill C-3 pilot doesn't compete with it."*

The hub is the deal we don't bet on yet. Win Phase 1 cleanly, then re-open Phase 3 from a position of strength.

---

## What Could Go Wrong — Risks & Mitigations

### Risk 1: Mock implementation slips past Thursday

If the demo isn't deployed by Thursday EOD, the Friday email slips to Monday, and Alex's Monday window becomes "vague next week" — which is when deals lose momentum.

**Mitigation**: Two safety valves built into the spec. Screens 5 (booking beat) and 9 (roadmap card) can ship at lower fidelity if needed. The customer flow + dashboard + the two lead detail views are the load-bearing pieces.

### Risk 2: Loom recording quality

A bad Loom is worse than no Loom. If the first take has dead air, wrong narration, or visual glitches, we scrap and re-record. Maximum two attempts. If take 2 isn't good, ship the email with the proposal and a static screenshot pack instead.

**Mitigation**: I record Friday morning, not Friday afternoon. Gives us a re-record window before the email goes out at EOD.

### Risk 3: Alex's feedback rewrites the mock significantly

If Alex comes back with major rework requests on Monday, we delay the build. That's actually fine — it's the design-partner loop working. Better to iterate on the mock than rebuild after coding.

**Mitigation**: This is a feature of the approach, not a bug. The mock-first sequence is specifically designed to absorb feedback before code gets written.

### Risk 4: Competing vendor on the hub creates urgency for Alex on the wrong thing

Alex mentioned another company is pitching him on the hub. If he pushes for the hub now instead of Bill C-3, we have to hold the line: Phase 1 first, Phase 3 later.

**Mitigation**: Pushback shape 3 above. The Bill C-3 pilot is the wedge; the hub is the expansion. Don't reverse the sequence under pressure.

---

## The Larger Strategic Picture

This is the second firm-direct deal in the immigration vertical (Luai is the first). If both close, Tokenrip has:

- Two reference customers in immigration
- A reusable mock template (the CICS code becomes a vertical-skin we can re-skin for the third prospect)
- A working playbook for design-partner pilots: discovery call → mock + Loom + proposal → close → build
- Substrate yield: every Bill C-3 line of code (eligibility logic, document understanding patterns, lineage data structures, audit brief generation, operator dashboard) extends to Phase 2 application review and Phase 3 hub work

The deal we're closing this week isn't just $5K — it's the second proof point that this motion works, and the substrate yield from the build will compound into the third, fourth, and fifth firm conversation.

This is the **forward-deployed engineer playbook** from `bd/get-a-sale/CLAUDE.md` running cleanly: customer describes problem (Bill C-3 qualification), we build the solution on top of substrate, the substrate compounds across customers.

---

## Open Questions Worth Flagging

1. **Branding fidelity**: I'm using placeholder CICS colors (deep blue + amber). If you want a closer match to cicsimmigration.com's actual brand, send me their site palette before Thursday and I'll adjust.

2. **Calendly integration in the proposal**: Should we explicitly mention that the booking flow connects to Alex's existing Calendly? My instinct: yes, in the "What's included" section. Reduces his perceived integration effort.

3. **Reference rights letter**: We need this signed at kickoff (file-gate). Make sure the version we send him is current — pull from `bd/firm-direct-strategy/reference-rights-letter-template.md`.

4. **File-gate specifics**: Alex's "10–20 anonymized files" for Bill C-3 should be specifically *American applicants on Bill C-3 cases*. Not generic immigration files. Worth clarifying in the proposal so we get the right corpus for the build.

5. **Pricing for the Phase 2 add-ons**: $1,000 per application type matches the Luai proposal. Confirm we're using the same number across both deals for consistency.

---

## Bottom Line

We have a clear path to close: Thursday the mock deploys, Friday the email and proposal go out, Monday we get on the call, the following Monday we lock the kickoff.

The strategic move is straightforward: lead with the wedge Alex named (Bill C-3), show him the product he wants to buy before he buys it, hold the price, plant the Phase 2 / Phase 3 narrative so the hub conversation re-opens later from a position of strength.

What you need from me before Thursday: confirmation that the proposal changes (kill $2,500 fallback, add Phase 2/3 structure) work for you. Reply with a yes or a what-changes-you-want and I'll close the loop.
