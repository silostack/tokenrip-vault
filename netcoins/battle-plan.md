---
type: internal
title: Surge / RebelFi Battle Plan
date: 2026-09-04
supersedes: 2026-08-24 version (pre-LOI)
audience: Simon + Alek
status: live; update as items close
---

# Surge / RebelFi Battle Plan — post-LOI

## Where we are

- LOI signed (`deal/loi/RebelFi_LOI_Final_31Aug2026.md`, Surge Digital Inc.). Up to C$700K: C$100K closing shares + C$200K integration milestone + C$400K earn-out. Fees: US$4–7.5K PT / US$7.5–12.5K FT per founder, cash, from closing.
- The clock: exclusivity runs **45 days from our signature (~Oct 19)**. Surge owes the DA draft **30 days after the later of signing and our delivery of Conditions 2, 3 and 5**. Target close ~Oct 31.
- **So the DA clock starts when we deliver our paperwork.** Every day we sit on the cap table, consents and tax filings is a day added to their deadline and a day of exclusivity burned for nothing.
- Nothing is owed to us before closing: no fees, no expenses. Our only leverage now is speed and the 10.3 termination right if their draft is late.

## The order of operations

| #   | When         | What                                                                                                                                                                                                                                                                                                                              | Who             |
| --- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| 1   | This week    | Deliver Conditions 2, 3, 5 to Surge: certified cap table, the Clerky corporate record (contemporaneous §141(f) board consents for both issuances — `clerky-docs/`, this satisfies Cond 3, no ratifying consents needed), founder SPAs + 83(b) proof-of-mailing, 1120 acceptance confirmations + Delaware franchise tax receipts. Starts their 30-day DA clock.                                                | Simon + Alek    |
| 2   | This week    | Send lawyer feelers: referral ask + `counsel/attorney-outreach-email-2026-09-04.md` to 3–5. Goal: one picked and conflict-checked before the DA lands.                                                                                                                                                                            | Simon           |
| 3   | This week    | Send `counsel/cpa-outreach-email-2026-08-24.md` (updated) to 1–2 cross-border CPAs. The structure question must be answered **before** Surge's counsel drafts — §2 says the final structure follows tax considerations, so our input has to arrive in the next ~2 weeks, not at review time.                                      | Simon           |
| 4   | This week    | Sign the founder split agreement (`deal/letters/founder-split-agreement.md`): tranche split (default 50/50), fee elections, decision floors. Also settles "that founder's share" of the milestone tranche, which the LOI leaves undefined.                                                                                        | Simon + Alek    |
| 5   | Next 2 weeks | Draft the integration and transition plan ourselves and hand it to Fraser: milestone = compile, deploy to their environment, one on-chain transaction, runbooks (his words on the 08-27 call). Whoever writes the first draft defines "objective." Same doc carries the earn-out (d) roadmap items — keep them few and shippable. | Simon           |
| 6   | Next 2 weeks | Propose the Net Revenue attribution formula for the Netcoins yield path (e.g. basis points on balances routed through RebelFi). If it isn't defined in the DA, earn-outs (a)–(c) can never be measured.                                                                                                                           | Simon + Alek    |
| 7   | Rolling      | Close the remaining hygiene items (table below).                                                                                                                                                                                                                                                                                  | Simon           |
| 8   | ~Early Oct   | DA draft lands → lawyer review. Checklist: `da-review-checklist` section below.                                                                                                                                                                                                                                                   | Counsel + Simon |

## Lawyer

**Why now:** the DA is where personal exposure lives (specific indemnities, personal IP assignment, set-off). We want counsel engaged and idle, not shopping for one while a 45-day exclusivity burns.

- Emails: `deal/letters/referral-ask-email.md` (friend first), `deal/counsel/attorney-outreach-email-2026-09-04.md` (cold list).
- Don't name Surge until they confirm interest and run a conflict check.
- Joint representation (company + both founders) needs a written consent; ask up front.

| Option | Cost | Tradeoff |
|---|---|---|
| Boutique/solo, fixed fee, review + negotiate DA, 2 consulting agreements, IP assignment | US$5K–12K | The right answer at this deal size |
| Hourly solo, markup only, we draft responses with AI | US$3K–6K | Slower, less pushback; workable since the LOI already fixes most terms |

## Tax (CPA)

**Why now:** structure (§2: share purchase vs reverse triangular merger) decides whether closing shares are taxed on receipt. Input is only useful before the DA is drafted.

- Email: `deal/counsel/cpa-outreach-email-2026-08-24.md` (updated 09-04). Questions: which structure defers under §368/§367; QSBS carryover; earn-out/installment treatment of the deferred tranches (cash vs shares changes it); officer's certificate glance.
- Cost: US$1K–2.5K scoped consult. Cheap relative to the tax swing.
- Colombia: Simon's adviser; expect Colombian tax at closing and on fees regardless.

## DA review checklist (what counsel must hold)

1. Aggregate cap = consideration actually received, **including** the specific indemnities (LOI 4.4 is ambiguous: "capped at Consideration he actually receives" vs "specific indemnities are not subject to the general cap"). This is the one real fight.
2. Milestone: acceptance criteria verbatim from our integration plan; deemed-acceptance and purchaser-delay language carried over; state what happens at month six if deficiencies are still in process (not forfeited).
3. Net Revenue: formula, not a label. Attribution for yield delivered through Netcoins/other group products; survives any Paco/payments merger of the RebelFi entity.
4. Earn-out (d): objective release criteria + same deemed mechanism as the milestone; add change-of-control language (earn-out accelerates or is assumed if RebelFi or Surge is sold/merged).
5. Consulting agreements: level set by mutual agreement at closing (push once more for Simon FT at US$7,500 — he owns the milestone; 80 hrs/month doesn't deliver it); excluded-IP schedule attached and specific (Tokenrip, Quintel repos named).
6. Set-off only against agreed/finally-determined amounts (carry LOI §5 setoff language into the DA verbatim).
7. Share pricing: confirm in writing announcement-date vs issuance-date VWAP (Fraser still owes this answer); no TSXV Policy 5.4 escrow, in writing.
8. No new conditions beyond the LOI's 19 without mutual agreement.

## Hygiene (Conditions Precedent)

| Item | Status |
|---|---|
| Cap table certificate (Cond 2) | **Do now** — one page, officer-certified |
| Corporate authorization for issuances (Cond 3) | **Done** — Clerky §141(f) board consents exist for both issuances (`clerky-docs/`). LOI's "lacks authorization" premise is wrong; point counsel to these. Ratifying consents (`deal/letters/ratifying-consents.md`) likely unnecessary — hold as fallback |
| 83(b) proof of timely mailing (Cond 3) | **Done** — both founders provided proof of mailing; in the data room |
| 1120 e-file acceptances + DE franchise receipts (Cond 5) | Collect PDFs, deliver |
| Texas assessment (Cond 5) | Ask CPA in the same consult — likely no registration needed for a remote founder |
| Manu payments: capital contribution vs liability (Cond 8) | Decide with counsel; paper as contribution + release |
| Wallet/key inventory incl. `zcut…` authority (Cond 9) | Open — Simon |
| Account migrations off personal identities (Cond 15) | Open — start now |
| Domains → Company (Namecheap) | Open |
| User/transaction data export, test vs prod tagged (Cond 10) | Open |
| Venture disclosure w/ time commitment (Cond 15) | Write once, includes Quintel; get Fraser's promised written acceptance for Quintel |
| Good-standing certificate (Cond 11) | Order within 30 days of closing |
| Background checks (Cond 13) | Consent when asked |

## Between the two of us

- Split agreement signed, adviser costs in a shared sheet, floors written down before any DA call.
- Fee positioning for the consulting agreements: the range is agreed; the open variable is the starting level. Argument on the record: the milestone is a full-time job.

## Things that could still bite

- **DA draft arrives late or padded.** Answer: the 30-day clock (start it by delivering!), 10.3 termination, "no new conditions" line.
- **US$4K PT becomes the default at closing.** Answer: settle levels in the consulting-agreement negotiation, not on closing day; integration plan sized to justify FT.
- **Milestone certified subjectively.** Answer: we write the acceptance criteria first.
- **Regulatory advice on Netcoins deployment (Cond 1) never lands** → earn-out paths starve. Ask for the status in writing at DA time; if blocked, earn-out components need alternate routes (non-Netcoins clients count).
- **The financing doesn't close.** Fees are "not contingent on any financing" (Schedule A) — hold that line in the consulting agreements.

## Documents index

| Doc | Use |
|---|---|
| `deal/loi/RebelFi_LOI_Final_31Aug2026.md` | The signed letter |
| `deal/counsel/attorney-outreach-email-2026-09-04.md` | Lawyer feelers, this week |
| `deal/counsel/cpa-outreach-email-2026-08-24.md` | CPA feelers (updated 09-04), this week |
| `deal/letters/referral-ask-email.md` | Friend referral, first |
| `clerky-docs/` (board consents) | Deliver for Cond 3 — the record is clean |
| `deal/letters/ratifying-consents.md` | Fallback only if counsel says the Clerky consents are insufficient |
| `deal/letters/founder-split-agreement.md` | Sign this week |
| `deal/letters/officer-certificate-tax.md` | At closing (Cond 5) |
| `netcoins-2026-08-27.md` | Fraser's spoken commitments — the record for DA drafting |
