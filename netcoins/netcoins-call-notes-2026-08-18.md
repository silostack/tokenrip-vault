---
company: Netcoins / BIGG Digital Assets (proposed Surge Digital)
contact: Fraser Matthews
date: 2026-08-18
call_type: m-and-a — product / technical demo
participants: Simon Pettibone (RebelFi), Aleksandar Perak (RebelFi), Fraser Matthews (CEO, Netcoins / BIGG), Kim Dwyer (COO, Netcoins)
transcript: "[[netcoins/netcoins-2026-08-18]]"
prep_file: "[[netcoins/demo-deck-2026-08-18]]"
---

# Netcoins Demo Call — 2026-08-18 (M&A product diligence)

## Follow-Up Actions

### What WE Need to Do

| # | Action | Owner | Due |
|---|---|---|---|
| 1 | **Flow-of-funds diagrams** — customer lifecycle view plus the back-end operational/settlement flows a customer never sees, drawn against the partner model and Balance specifically | Simon | 2026-08-21 *(inferred — “as part of the DD,” requested by both Fraser and Kim)* |
| 2 | Send “more documentation” on the RebelFi side, as Simon reciprocated at close | Simon | 2026-08-19 *(inferred from “I’ll do the same”)* |
| 2 | Ask the operator question that the demo was supposed to force — accountable operator, P&L, roadmap, hiring, final product decisions | Simon or Alek | Next sync (w/c 2026-08-24) |
| 3 | Correct Alek’s ~40 hrs/week statement into outcomes and authority, in writing | Simon + Alek | Before the revised LOI is signed |
| 4 | Settle the founder split of consideration and a walk-away floor before Fraser’s number lands | Simon + Alek | 2026-08-21 |
| 5 | Independent CPA/M&A counsel on the share-acquisition structure | Simon | w/c 2026-08-24 |
| 7 | Review BIGG’s business-flow/regulatory map as a **negotiating document**, not just a technical one — it will define the founders’ scope by implication | Simon + Alek | On receipt |

### What THEY Need to Do

| # | Action | Who | Due |
|---|---|---|---|
| 1 | Send “more documentation” back to RebelFi | Fraser | 2026-08-19 *(stated: “today or tomorrow”)* |
| 2 | **Produce the structured business-flow / commercial-relationship / regulatory-coverage-and-gap document**, then bring it back for RebelFi to validate | Kim Dwyer + Fraser | *Unscheduled — Kim: “I don’t think it will take too long”* |
| 3 | Balance partner call re: US MTLs | Fraser + Netcoins | 2026-08-19 |
| 4 | Develop and share their own candidate use cases, then prioritise jointly | Fraser + Kim Dwyer | Next sync |
| 5 | **Complete LOI §5 with a dollar-equivalent offer** — never mentioned on this call | Fraser + Kim Evans | 2026-08-21 *(carried from 08-17)* |
| 6 | Deliver the revised §2 share-acquisition document | Fraser | *Overdue — promised “later today” on 08-17, not confirmed on this call* |
| 7 | Next technical sync | Fraser | End of w/c 2026-08-17 or start of w/c 2026-08-24 |

### What They're Expecting From Us

- Flow-of-funds diagrams covering both the customer-visible lifecycle and back-end settlement operations, with the partner/MTL model in mind — this is explicitly framed as diligence material.
- A post-mortem on why the prior client engagements didn’t close, and what would need to be true to reopen them now that BIGG can supply MTLs, ramping and bank partners.
- Validation of BIGG’s forthcoming business-flow/regulatory map.
- Reaction to BIGG’s use-case list at the next sync.

### Open Questions Before Next Contact

- **Where is the revised LOI?** Fraser said “later today” on 08-17. It was neither delivered nor mentioned on 08-18. Ask directly.
- **Where is the number?** §5 was not raised by anyone on either side of this call. The week Fraser committed to ends 08-21.
- **Who runs RebelFi?** Still unanswered, and the demo — the designated forcing moment — passed without the question being asked.
- What did the Balance call on 08-19 produce: which MTLs are owned versus rented, what does the program cost, and what is the contract status?
- What is the unnamed merchant-payments technology BIGG is evaluating, who owns it, and does it overlap or compete with RebelFi’s stack?
- What was the stablecoin swap API Fraser shared in the chat, and is it a Circle alternative or a Circle wrapper?
- Does Netcoins USA actually qualify for direct Circle access (the 100K minimum and the OTC bespoke-pricing route Fraser floated)?
- Which jurisdictions beyond US/Canada is BIGG considering, and does that change the build scope the founders are expected to deliver?

## Call Summary

Simon demoed all three generations of the RebelFi platform — the banking/invoicing product, the on-chain escrow payments protocol, and the multi-chain yield platform with its per-client risk policy engine, insured deposits, Sharia-compliant yield, CCTP ring-fencing clean room, and ramping integration — plus the RebelFi-side admin/operations console. Kim Dwyer ran the questioning and drove it toward operating model, custody status and regulatory structure rather than features. The two substantive outcomes were structural: Kim confirmed the escrow is **non-custodial and therefore falls outside Netcoins’ regulated business**, which she called increasingly attractive; and Netcoins claimed the next work product — a structured map of business flows, commercial relationships and regulatory coverage/gaps across the BIGG family — which will define the go-to-market and, by implication, the build scope. RebelFi’s deliverable is flow-of-funds diagrams for diligence. Price, revised LOI structure, founder authority and compensation were not discussed at all.

## Momentum

**→ Flat on the transaction, ↑ on the integration thesis** — technical fit and regulatory posture advanced materially, but the demo consumed the cheapest scheduled opportunity to force the operator, price and authority questions, and none of the three was raised. The revised LOI promised for 08-17 was not delivered or chased.

## Key Intelligence / What Changed

### 1. Non-custodial is now a stated BIGG preference, not just a RebelFi design choice

Kim, on learning the escrow is a permissionless smart contract RebelFi cannot control: *“that’s important too, Fraser, because it’s completely non-custodial — so it would fall outside of Netcoins’ regulated business. Which we like — the non-custodial model, more and more every single day.”*

**So what:** this is the strongest positive signal in the call and it is an *architectural* one. RebelFi’s permissionless design is not merely acceptable to a regulated acquirer — it is the reason the acquisition is cheap for them to operate. It also raises RebelFi’s leverage: the asset’s value is partly that it *avoids* the eight-month approval cycles Kim described on 07-29. Fraser immediately narrowed the frame anyway — *“just keep focusing on it just being Netcoins USA.”*

### 2. The unnamed Canadian custodian/trust partner is **Balance**

Fraser: *“We have a call tomorrow with Balance, which we’re looking to partner up with to provide MTLs for the United States… ultimately we’re going to look to partner with them for US coverage for MTLs.”*

This resolves the identity gap left open on 08-17 (Assumption #5). It does **not** resolve the substance: which licences Balance owns versus rents, the program economics, the contract status, or whether BIGG is a customer or a partner. The 08-19 call is the test.

### 3. Netcoins is taking ownership of the strategy document — RebelFi is being scoped as the technical supplier

Kim proposed that Netcoins map the core business flows, commercial relationship structure, regulatory requirements per jurisdiction, existing BIGG coverage and remaining gaps, then *“come back to you guys and say: is our understanding of what you guys do accurate here?”* Fraser separately said he and Kim would generate the use-case list and then sync with the founders to *“prioritise it together.”*

**Inference, medium-high confidence:** BIGG writes the plan of record; RebelFi validates it and supplies diagrams. That is a contributor posture, not an operator posture. It is directionally consistent with Fraser’s 08-17 non-answers on who runs the company, and it moves Assumption #1 (“the founders will run RebelFi with meaningful decision rights”) further toward *disconfirmed*. Simon reinforced it by accepting the frame — *“that’ll establish a baseline that we can align on”* — without asking who owns the pen or the resulting roadmap.

### 4. Simon named RebelFi’s own failure diagnosis, and it maps exactly onto BIGG’s assets

Simon: *“if you can offer a full stack instead of a piecemeal fragmented stack where they have to go to one guy for yield, another guy for payments, another guy for ramping… There were a lot of conversations where it was ‘okay, but you don’t really have the ramping stuff.’ We did the ramping stuff kind of late to the game. It might have been a different outcome had we started out of the gate with a ramping provider.”*

Fraser immediately converted it into an acquisition thesis: *“if we can go back to potentially some of those and say ‘hey, we’ve got this now, we’ve got MTLs, we’ve got ramping, we’ve got bank partners,’ people might start coming back to the platform.”*

**So what:** this is genuinely good positioning — it makes BIGG the missing piece rather than RebelFi the failed one. It also creates an expectation that dead pipeline can be revived. Do not let a lost-deal list become an implied revenue commitment attached to the second tranche.

### 5. The demo mechanics undercut the “working code” claim the valuation rests on

Repeated failures on screen: wrong account, missing data, empty wallets, wrong network, devnet. Neither buyer pushed back or drew a conclusion out loud, and Kim gave generous cover on the rough UI (*“it’s a build-your-own-interface type platform, which is what most are in this space”*).

Kim also now has on record Simon’s *“there are definitely a lot of compliance gaps we would need to fill”* — honest, and she reciprocated with BIGG’s expertise, but it stands unoffset.

**So what:** RebelFi is being valued on whether the technology works. Every unrecovered failure on screen is a discount argument the buyer never has to make out loud. The next technical sync needs a pre-staged funded account, seeded data, one network, a dry run, and a short recorded fallback.

### 6. Liquidity sourcing is Fraser’s idea, and it favours the US entity

Fraser: *“Netcoins USA direct into Circle, and then flow it through to RebelFi,”* plus *“you could get bespoke pricing for RebelFi through the OTC platform.”* Simon supplied the Circle economics — 100K minimums, no fees until roughly $50M volume, *“basically free.”*

**So what:** BIGG can supply stablecoin liquidity at cost through a group entity. That is real synergy value the founders are creating in the diligence conversation — and it should be argued as consideration, not given away as colour. Note Kim’s reflex to check whether a regulated entity is involved, and Fraser’s repeated steering to **Netcoins USA, not Canada**.

### 7. The B2B2B onboarding problem is a known industry pattern, and Kim already has an answer for it

Simon described the WizPay waterfall failure — a month spent trying to get a partner’s customer approved before the ramping provider said it had to restructure. Kim: infrastructure providers want the partner to collect KYC/KYB and pass it through so the end users are *technically customers in RebelFi*, and *“that’s how the crypto-as-a-service stuff we’re looking at… would be structured.”*

**So what:** BIGG has thought about the exact structural problem that killed RebelFi’s partner motion. That is a genuine reason the asset is worth more inside BIGG than outside it — and one of the few places where the acquirer demonstrated it can solve something RebelFi couldn’t.

## Deal Analysis

### Stage signal

**Product diligence complete; commercial terms untouched.** The buyer is now doing internal architecture and regulatory mapping and has assigned RebelFi a diligence deliverable. That is a real advance in the acquirer’s internal process. It is not an advance in the deal: §5 is still blank, the revised §2 is unconfirmed, and the founder mandate is undefined. **The operator and price questions the 08-17 note flagged as “must be forced at the demo” both went unasked.**

### Pressure points

| Issue / quote | Type | Handling | Effectiveness | Better response |
|---|---|---|---:|---|
| Kim: *“would you pick and choose certain parts… or would there need to be some work done to get it to the right level to do a relaunch?”* | Scope / effort estimate | Simon answered with the product answer (take V3, drop the on-chain payments protocol, integrate BIGG’s rails) and skipped the effort question | 3/5 | *“V3 is the base. The relaunch work is real and it depends on your MTL partner, your liquidity path and your compliance stack — none of which are settled yet. Once the flow-of-funds map exists we can scope it properly, with a budget and a team.”* |
| Kim: *“maybe we map out the core business flows… then come back to you guys and say, is our understanding accurate?”* | Ownership of the plan of record | Simon accepted: *“that’ll establish a baseline”* | 2/5 | *“That’s useful and we’ll contribute the technical layer. Since this document will define scope, budget and who builds what, let’s co-author it rather than review it — and let’s use it to settle who owns the roadmap after close.”* |
| Simon: *“there are definitely a lot of compliance gaps we would need to fill.”* | Volunteered weakness | Kim absorbed it generously and offered BIGG expertise | 3/5 | Fine as honesty, but pair it with the offset: *“…which is exactly why the partner model was deliberate — we built to stay non-custodial and rent compliance rather than own it. That decision is why the escrow sits outside your regulated perimeter.”* |
| Fraser: *“why didn’t some of those deals close?… people might start coming back to the platform.”* | Implied revenue expectation | Both founders confirmed the gap was the missing full stack | 4/5 | Strong, but add the boundary: *“Happy to map the lost pipeline. Treat it as a demand signal, not a forecast — and it shouldn’t be attached to tranche two.”* |

### Authority, budget, timeline

- **Authority:** Kim Dwyer again ran the substantive questioning and is now the owner of the go-forward mapping. She is the operator to convince and, on current evidence, the person most likely to define the founders’ scope. Fraser is the transaction sponsor and the liquidity/partnership thinker.
- **Budget:** Still zero disclosure. Nothing on this call about NewCo funding, the concurrent financing, or who pays for the relaunch build.
- **Timeline:** Next technical sync end of w/c 08-17 or start of w/c 08-24. Balance call 08-19. Price still due 08-21. Fraser’s 10-01 target close was not mentioned and remains unvalidated.

## Simon's Performance

### Coaching Priorities

1. **The demo was the designated forcing moment for the operator question, and it went unasked.** The 08-17 next steps named it as priority #2. Instead the call ended with BIGG owning the strategy document and RebelFi owning a diagram. → **Better language:** *“Before we scope this — after close, who is the single accountable operator of RebelFi, and what do Simon and Alek own outright: P&L, roadmap, hiring, final product calls? We’ll build whatever we agree to, but we need to know what we’re accountable for.”* → Two full calls have now passed with founder authority undefined while the buyer’s picture of the business gets sharper. The longer this goes, the more the default answer becomes “technical contributors.”

2. **Broken demo mechanics undercut the “working code” claim the whole acquisition thesis rests on.** Wrong account, missing data, empty wallets, wrong network, devnet, local machine. → **Better approach:** for the next technical sync, pre-stage a funded account with seeded data on a single network, dry-run it once end-to-end, and record a 3-minute fallback capture. If it breaks live, cut to the recording. → RebelFi is being valued on whether the technology works. Every unrecovered failure on screen is a discount argument the buyer doesn’t have to make out loud.

### What Worked

- **The risk-policy answer.** Kim asked whether parameters could be set to a company’s risk tolerance; Simon said *“that’s literally exactly how we built it”* and immediately showed approval thresholds and protocol whitelists. Kim’s *“Awesome”* and her follow-up confirming it is per-partner rather than platform-level was the clearest enthusiasm in the call — it told her RebelFi was built by people who understood regulated clients.
- **The custody answer was precise and it created the deal’s best structural insight.** *“The escrow is a permissionless escrow… we own the wallets that deploy the smart contracts, but we can’t take control of the funds.”* That single accurate answer is what let Kim conclude the product sits outside Netcoins’ regulated business.
- **The full-stack post-mortem converted RebelFi’s failure into BIGG’s rationale.** Naming the missing ramping layer as the reason deals died, without defensiveness, let Fraser supply the acquisition logic himself.
- **The API-first framing landed.** *“This interface was really just for demo purposes… the idea is this would be used via APIs”* drew Kim’s *“build-your-own-interface type platform, which is what most are in this space”* — useful cover for the rough UI.

## Load-Bearing Assumptions (test, don't design around)

| Rank | Assumption | fact / inferred + conf. | Cheapest disconfirming test |
|---|---|---|---|
| 1 | Simon and Alek will run RebelFi with meaningful decision rights | **inferred, LOW and falling** — BIGG now owns the strategy document and the use-case list; RebelFi supplies diagrams and validation | Ask the operator/decision-rights question directly at the next sync; if the answer is again “together,” treat it as answered *no* |
| 3 | The revised share-acquisition LOI is actually in progress | **inferred, MEDIUM-LOW** — promised “later today” on 08-17, not delivered or mentioned on 08-18 | Ask for it in writing this week |
| 4 | Balance supplies a usable US MTL path | **inferred, MEDIUM-LOW** — partner now named; licences, economics and contract status unknown | Ask for the outcome of the 08-19 call, the licence schedule and whether BIGG is partner or customer |
| 5 | The lost-pipeline revival is a demand signal, not a commitment | **inferred, MEDIUM** — Fraser floated reopening dead deals in the same breath as the acquisition rationale | Keep any lost-deal list explicitly out of tranche-two acceptance criteria |
| 6 | Netcoins USA can source Circle liquidity at or near cost for RebelFi | **inferred, MEDIUM** — Fraser’s idea, Kim hedged with “potentially”; Simon supplied the thresholds | Ask whether Netcoins USA meets Circle’s minimums today and what the OTC bespoke-pricing route actually costs |
