# Lenders — Live Counterparties & Routing

> **What lives here:** one folder per lender Quintel routes deals to, each holding its operating context (`CLAUDE.md`: box, fee, eligibility rule, paper posture, clock, intake person, do/don'ts), agreements, and the contact doc. This is operations, not pipeline. Prospects stay in `bd/` until terms are agreed; call notes, transcripts, and prep stay in `bd/calls/` (the append-only interaction log).

## The network (2026-08-20)

| Lender | Folder | Box | Fee | Eligibility rule | Paper | Clock | Intake | Status |
|---|---|---|---|---|---|---|---|---|
| **Onset Financial** | `onset/` | $750K–$100M, large-ticket independent, 74% repeat business | 0.5% floor, per-deal Exhibit A (blank) | §4.2 prior contact → discretionary; §3.3 third-party comp → nothing; 10-biz-day objection on the register | **Executed** MBRA + Exhibit B rider, 2026-08-05 | 5 biz days no-shop per referral | David + VP Sales (Jerman gone) | Live, deploying |
| **Wingspire EF** | `wingspire/` | $5–50M slug, ~$100M rev / ~$10M EBITDA, sponsor preferred not required, 8–12% bank-turndown | **$1,000/mo flat from 2026-10-01 (card); no success fee** (superseded 0.5% handshake 09-15) | Already-in pays zero; they CRM-check and reply within 5 biz days or it's ours | **None, ever** ("we will never sign anything"); record = our email + their CC on the fund email | 5 biz days exclusive per name | Rob Lewis (SVP) | **Customer 2026-09-15**; ~100 names/mo asked; 3-month eval to ~12-15 |
| **Envision Capital** | `envision/` | **$10k–$500k** (Dan; avg ~$80k). Ricky's $50–250k was AE sweet spot | 1% funded with Ricky; **unconfirmed with Dan** | Fraud: dual-identity vendor/borrower, $45–65k; vendor approval every deal | v4 sent 08-19, **unsigned**; handshake + portal trial | n/a on trial | **Dan Lund** (admin) | Platform trial 09-08; vendors are the real motion |

## Routing rule (draft, ratify before first Wingspire send)

A deal goes to **one lender at a time**. Order of precedence when more than one box fits:

1. **Narrower stated box wins.** A $20M manufacturing slug fits Onset ($750K–$100M) and Wingspire ($5–50M); Wingspire's box is narrower, Wingspire gets it first.
2. **Tie → faster feedback last batch.** The lender that returned pass/working replies fastest on the previous batch gets the next overlapping name. Speed of the "no" is the property that keeps re-routing alive.
3. **Contractual clocks are hard.** Onset: 5 biz days no-shop from receipt, and after a signed proposal no shopping at all. Wingspire: 5 biz days. Envision: 5 biz days from delivery. A name never moves before its clock expires or a pass comes back.
4. **Onset confidentiality wall.** Anything first learned through Onset (customers, prospects, funding sources) is never routed elsewhere. Public-record signal is fair game.
5. **Log every send** in the lead register with lender, date, clock expiry, and outcome. The register is the only record that survives "we already knew them."

## Standing checks
- Referral-fee licensing (CA CFL for Envision; interstate question for Wingspire, a CA lender): one check covers both, **before the first funded deal**.
- Supply reality per box before promising volume: Envision $50–250K (small-ticket model shipped 08-18, unmeasured), Wingspire $5–50M non-sponsor (unmeasured at this floor).
- Graduation path (retainer / exclusive / subscription) has now been authored unprompted by four lenders. Zero planning time until a deal funds.
