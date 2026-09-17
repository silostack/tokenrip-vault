# Email infrastructure for the pool-first pilot

Status: proposal, 2026-09-09. Written after David's first 50 call verdicts. Internal.

## The recommendation in one paragraph

Run cold outbound on mailboxes Quintel owns (lookalike domains, Google Workspace, warmed), buy the sequencer and warmup layer, and build everything on either side of it: the list and personalization pipeline that feeds it, and the reply pipeline that turns every response into a label on the row. Do not use SendGrid, SES, Postmark or any transactional ESP for this: they are built for opt-in mail, their terms exclude purchased or scraped lists, and cold mail from them lands in spam at Gmail. The asset we are building is the row-level outcome loop, not the sender. Everything the loop does not need is bought.

## Why email, and why now

- David's own action column on the 50 already says "Email" on five rows, including two hang-ups. The second touch is email whether we build it or not.
- 8 of 19 dead rows were hang-ups at the word "financing." A phone opener gives the owner two seconds to decide. An email with the asset and the filing in the first line gives him the decision at his own pace, which is the only place the lien-maturity hook can be tested.
- 49 of 50 rows carried an email from the MCS-150 filing, owner-level (gmail / yahoo), federal, so the same field exists in every state including the Midwest. The address supply is not the constraint.
- Warmup takes two to three weeks. Starting mailboxes now is the only step that must precede David's next verdicts.

## How cold email actually works, and what that implies

Deliverability at Gmail and Microsoft is decided per sending domain and mailbox, by volume, bounce rate, spam complaints and engagement. The operating rules that follow:

| Rule | Implication for us |
|---|---|
| Never send from the primary domain | Buy lookalikes (quintelfunding.com style). Burnable. |
| 20 to 40 sends per mailbox per day, after warmup | Capacity is mailboxes × 30. Nine mailboxes ≈ 270 per day, ≈ 1,300 per week. |
| Bounce over 3 percent damages the domain | Every address is verified before send (MX check today is not enough). |
| Spam complaints over 0.1 percent damage the domain | Suppression across every list, one opt-out honored everywhere, plain text, no tracking pixels in v1. |
| SPF, DKIM, DMARC required at Gmail since 2024 | Set on every domain before warmup starts. |
| Replies must land somewhere a human reads | Our mailboxes, our inbox, our classifier. This is why we own the mailboxes. |

## The seven pieces

```
 list pipeline ──> verify ──> suppress ──> personalize ──> SEQUENCER ──> mailboxes ──> prospect
 (C0–C5, ours)    (buy)      (ours)       (ours)          (buy)          (own, buy)
                                                              │
                                              replies <───────┘
                                                 │
                                   ingest ──> classify ──> route ──> label on row ──> C6 stats
                                   (ours)     (ours)       (ours)    (ours)           (ours)
```

| # | Piece | Build or buy | Choice and reason |
|---|---|---|---|
| 1 | Domains, DNS, mailboxes | Own; buy the accounts | 3 lookalike domains, 3 Google Workspace mailboxes each. Registered in our registrar, DNS ours, so no vendor holds the reputation. ~$65/mo. |
| 2 | Warmup | Buy | Sequencer-provided. Two to three weeks before first real send. |
| 3 | Sequencer | Buy | Rotates mailboxes, schedules touches, stops on reply, holds the master inbox. Needs an API for campaign creation from our pipeline and a webhook for replies. Origami is the known option (Alek); confirm it has both. Smartlead or Instantly are the fallbacks and are known to have both. |
| 4 | Address verification | Buy | MillionVerifier or ZeroBounce, ~$0.005 per address, as a C3 step next to Twilio. Same three-state rule: valid / invalid / unverified. |
| 5 | List → campaign push | Build | From a finished C5 sheet: apply suppression, render per-row fields (asset, lender, filing month, county), push to the sequencer via API, record which campaign and arm each row entered. |
| 6 | Reply pipeline | Build | Webhook or inbox poll → store raw reply → classify (positive / question / not now / wrong person / unsubscribe / out of office / bounce) → positives to David within one business day → unsubscribes and bounces to the suppression table immediately → every reply becomes a label on the row. |
| 7 | Measurement | Build | Per arm, per segment, per email source: sent, delivered, bounced, replied, positive, meeting. Wilson intervals, pre-registered before the send. Feeds C6 and the next batch selection. |

Storage is the existing `flpool` Postgres. The reply pipeline is one small service and a classifier prompt; the sequencer is doing the hard operational work.

## Capabilities by stage

**v1, first send (target: two weeks after warmup completes)**
- One suppression table: prod touches, David's April list, both PCF CRMs, every Origami campaign Alek has run. No row in two sequences, ever.
- Two copy arms, four touches over 14 days, plain text, unsubscribe line and physical address in every message.
- Verified addresses only. Bounce gate at 3 percent per domain, checked daily.
- Replies read by a person daily; classifier drafts the label, a human confirms for the first 200 replies.
- Positives forwarded to David same day with the row's evidence (asset, lender, filing, phone) so the call has context.

**v2, after the first 600 sends per arm**
- Automated positive routing (no human confirmation).
- Reply text mined for facts we can turn into features: "paying off in October," "we buy cash," "already with CAT." Those are labels the pipeline could never source.
- Timing-triggered sends: a row enters the sequence when its lender window opens, not when a batch ships. This is the version of the product that only works with UCC coverage.
- Phone and email as one cadence: email touch 1, David calls the opens or replies, email touch 2.

**Not in scope**
- Open and click tracking in v1 (pixels hurt deliverability and opens are unreliable since Apple Mail Privacy).
- Any HTML design. These are one-paragraph messages from a named person.
- LinkedIn or any enrichment vendor. The address comes from the federal filing or it is not sent.

## The two copy arms

Arm A is David's copy as he ran it. Ask which variant ran in April and its bounce, reply and meeting numbers; his file is option lists, not tested copy.

Arm B opens on the row's own evidence. For a LIEN row: the lender and the filing month, then the asset. For a NOLIEN row: the asset from the MCS-150 and the fleet size. The test is whether specificity beats the promo rate. The phone results argue for it: the owners who hung up did so at "financing," before any specific was said.

Arm B requires the UCC overlay to exist. That is the concrete reason UCC coverage matters for email even though it did not move the phone results: without it, arm B degrades to the asset line alone.

## The decision that gates everything: whose name is on the email

Three options, in order of preference:

1. **Providence brand, Quintel infrastructure.** Sender is David, domain is ours (providence-lookalike or neutral), replies route to our inbox and are forwarded to him. Highest reply rate because the pitch is real. Requires David's sign-off and a written reply-routing agreement, and it makes the compliance footer Providence's.
2. **Neutral or Quintel brand.** Sender is a Quintel name introducing an "equipment finance partner." Replies are ours end to end. Lower reply rate, cleaner data ownership, no Providence approval needed. Tests the opener, not Providence's offer.
3. **Providence sends from its own domain, we supply the list.** Fastest to start, but we get no replies, no labels, and no loop. This is the outcome to avoid; it recreates the Origami situation where sends happen and the data never comes back.

Recommend option 1 if David agrees tomorrow; option 2 if he hesitates. Do not accept option 3.

## Compliance posture

CAN-SPAM, not TCPA, governs this channel: no consent required, but every message needs a truthful sender, a working opt-out honored within ten days, and a physical postal address. Opt-outs propagate to the suppression table and to David's CRMs. Florida has no additional commercial-email statute beyond CAN-SPAM. Keep a copy of every message sent per row; it is also the audit trail for the labels.

## Cost and capacity for the pilot

| Item | Monthly |
|---|---|
| 3 domains | ~$3 (annual $36) |
| 9 Workspace mailboxes | ~$63 |
| Sequencer | $0 to $95 depending on choice |
| Verification, 1,000 addresses | ~$5 |
| Claude classification | negligible |
| Total | under $200 |

Capacity at 9 mailboxes is ~270 sends per day. The 200–300 row pilot with four touches is ~1,200 sends, one week of capacity. Scaling to a state-wide pool is a mailbox count problem, not an architecture problem.

## Order of work

| Week | Work                                                            | Depends on                                  |
| ---- | --------------------------------------------------------------- | ------------------------------------------- |
| Now  | Buy domains, DNS, mailboxes, start warmup                       | Nothing. Do today.                          |
| Now  | Ask David: April copy and numbers; CRM hit list; brand decision | Tomorrow's call                             |
| 1    | Verifier in C3; suppression table; label schema                 | Nothing                                     |
| 1–2  | Sequencer API check (Origami vs Smartlead); push script         | Sequencer choice                            |
| 2    | Reply ingest + classifier + David routing; measurement queries  | Label schema                                |
| 3    | Warmup done. Pilot: 200–300 rows, two arms, four touches        | David's copy, brand decision, verified rows |
| 4–5  | Read replies daily; gates at 600 sends per arm                  | Pilot                                       |

Gates, pre-registered: bounce under 3 percent per domain or the domain is retired; scale at 1 percent or more positive reply; stop and rewrite under 0.3 percent across 600 sends per arm.

## Open questions

- Does Origami expose campaign creation and reply webhooks via API? If not, it is the wrong sequencer for a loop we intend to automate, whatever it costs Alek in convenience.
- Which Midwest states, and does Providence lend in all of them? The list can be built (FMCSA is federal and carries officer name, phone, cell and email), but every row there is NOLIEN-by-ignorance rather than NOLIEN-by-evidence, and arm B cannot run on it.
- Does David want positives as an email digest, a Slack message, or rows in Leasepath? Whatever he reads within the hour is the right answer.
