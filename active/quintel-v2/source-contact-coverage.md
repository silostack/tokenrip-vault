---
status: v0.1
last_revised: 2026-10-02
owner: Simon
serves: decides which A-tier public feeds can enter an email-first outbound lane without third-party contact enrichment
relationship: contact-field audit of the 52 investigated records in `source-feeds.md`; the nine out-of-box records from Alek's artifact remain unidentifiable from the material available in this vault
tier: internal
---

# Only six distinct investigated feeds can reliably supply email; two are strong enough to change the build order

## Decision

Do not use the A-tier source set as one undifferentiated lead pool. Split it at ingestion:

1. **Email-first lane:** TN contractor licences, TxDOT vendor list, FMCSA, Colorado dewatering, IDEM septage, and INDOT bid tabs. They provide a company/lead name plus an email on a measured or strongly evidenced share of rows.
2. **Signal-first lane:** all other confirmed feeds. They may be excellent buying signals, but no-email is intrinsic to the source; they should enter only when the economics of a separate website/contact-append workflow work.

The biggest change is TxDOT: a fresh live count finds an email on **936 of 1,042 vendors (89.8%)**, not the inconclusive 2-of-3 sample in the prior review. Along with TN licences (95% in n=200), it is the highest-confidence source of named, emailable contractor leads in the six-state set.

This is a source-field finding, not a deliverability finding. A non-null email still needs syntax/domain validation and suppression; it does not prove the address reaches an owner or decision-maker.

## Measured name + email coverage: six distinct feeds

| Feed                                                     | Lead name available?                                               |                                             Email coverage | Evidence and caveat                                                                                | Recommendation                                                                                                                   |
| -------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------: | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **TN-g5-05 — TN contractor / qualifying-agent licences** | Yes — company in `Name and Address`; qualifying-agent person named |           **95%** (190/200); active-only **99%** (198/200) | Random samples; 38% of sampled emails are free-mail domains                                        | Build first. Parse company, QA, email and phone from the compound field; validate/suppress before sending.                       |
| **TX-g2-04 — TxDOT prequalified vendor list**            | Yes — `vendor_name` on **1,042/1,042** current rows                |               **89.8%** (936/1,042 live count, 2026-10-02) | Socrata count of non-null `email`; phone is 99.5% (1,037/1,042)                                    | Build first. This is a roster, so snapshot-diff for new/changed vendors rather than pretending email presence is a buying event. |
| **CO-g4-02 — CO construction dewatering permits**        | Yes — permittee/facility and legal-contact name                    |                        **~99.9%** (prior full-pull result) | Not re-counted in the 2026-09-24 refresh; this is the weakest *freshness* claim in the six         | Build with a first-run fill-rate check. It combines unusually complete contact fields with a current construction signal.        |
| **IN-g6-05 — INDOT bid tabs**                            | Yes — bidder company                                               |                 **Essentially all sampled** (5+ bid calls) | Email is the bid-submission contact, often an estimating inbox rather than a named owner           | Build after TxDOT/TN. Good company reachability; do not mislabel it as a decision-maker email.                                   |
| **IN-g6-03 — IDEM approved septage permittees**          | Yes — permittee (often owner) and business name                    |                         **~50%** (about 30-row spot check) | Directionally useful but not a count; phone was present in all checked rows                        | Build as a small email-first sub-lane, while retaining the no-email half for an append experiment.                               |
| **ALL-g6-06 / IN-g6-02 — FMCSA census**                  | Yes — `legal_name` / `dba_name`; officer names also supplied       | **46.2%** (18,368/39,771 Indiana carrier-operation-C rows) | Indiana is the only measured cut; do not assume 46% nationally until each state/segment is counted | Existing connector: use email-present rows first and calculate the real rate by target cargo/state.                              |

**Not a seventh candidate:** Chattanooga permits (`TN-g5-06`) has `contractoremail` in the export header, but three current rows were blank. A coarse scan finds email-shaped values somewhere in at most 1,866 of 216,151 rows (≤0.86%); the CSV contains unescaped commas, so that is an upper-bound signal rather than a defensible field count. Treat it as no-email until a proper parser/API query proves otherwise.

## The other 45 investigated records do not create an email-first lane

| Classification | Sources | What is known |
|---|---|---|
| **Name/company, confirmed no email field** | CO-g4-01, CO-g4-03, CO-g4-04, CO-g4-05, CO-g4-06, CO-g4-07, FL-g3-01, FL-g3-02, FL-g3-03, FL-g3-04, FL-g3-06, IN-g6-04, TN-g5-01, TN-g5-07, TN-g5-08, TX-g1-01, TX-g1-02, TX-g1-03, TX-g1-04, TX-g1-05, TX-g1-06, TX-g1-07, TX-g1-08, TX-g1-09, TX-g2-03, TX-g2-06, TX-g2-07, ALL-g6-09 | These are usable named-company/permittee/debtor signals but require separate contact append. CO-g4-03's address belongs to the well owner, not the named driller/pump installer. Nashville's `Contact` is populated (5/5) but is an unstructured person-or-company string, not an email. |
| **Name/company + phone, confirmed no email** | FL-g3-07, FL-g3-08, FL-g3-09, FL-g3-10, GA-g6-01, TX-g2-01, TX-g2-02, TX-g2-05 | Phone may support a call lane, but does not solve cold-email volume. The best measured phone rates are TDLR towing 97.2% (3,683/3,789) and Texas plumbers 50.8% (4,764/9,375). |
| **Email column exists, but email observed null / unusable** | GA-g6-07, GA-g6-08, TN-g5-06 | Both Georgia licence-search samples had the email field null on every sampled row (4/4 and 3/3); Chattanooga is described above. Do not count a schema field as coverage. |
| **Name is likely available, but email coverage unverified because access/schema was not obtained** | CO-g4-08, FL-g3-05, TN-g5-02, TN-g5-03, TN-g5-04, TX-g2-08 | These are not zero-email findings. They are unresolved: Pikes Peak has a contractor field; Florida UCC has debtor/secured-party names; the TDEC and Texas RRC portals were inaccessible. |

The shorthand list above includes all 52 investigated source *records*. FMCSA is represented twice in the source register (the national connector and its Indiana view), so the six positive entries are six **distinct underlying feeds**, not seven.

## What this means for the outbound-volume assumption

The prior model's blanket 50% email-found assumption is the wrong unit of analysis. There are two fundamentally different funnels:

| Funnel | Observed source email rate | Constraint |
|---|---:|---|
| Email-first roster / licence feeds | 46%–99.9%, depending on source | Email quality, role fit, and freshness — not provider match rate |
| Intent/event feeds without an email field | 0% at source | Website discovery → contact extraction → verification; its yield is still unmeasured |

This matters because no enrichment vendor can recover a missing email from a record that only provides a rural company name and an address at the rate needed to paper over the second funnel. The email-first feeds can provide usable early outbound volume, but they are mainly rosters or contractor lists. They do not replace the higher-intent UCC and permit signals; they buy time to measure whether append makes those signals commercially usable.

## The decision-facing experiment

Run two separately tagged 200-row tests before expanding connectors:

1. **Signal-first append test:** 100 Colorado UCC debtors + 100 Texas TXG11 concrete permittees, with name/address retained. Measure company website found, named contact found, valid email, and valid owner/principal email separately.
2. **Source-email quality test:** 100 TN licences + 100 TxDOT vendors. Measure email validation, bounce, role mailbox vs person, and positive reply/meeting rate by source.

The decisive comparison is not "provider match rate." It is qualified conversations per 100 records, by lane. If the first test produces fewer than ~25 valid emails per 100, treat no-email intent feeds as scarce high-value research targets—not a volume engine—and set daily send targets from FMCSA/TN/TxDOT instead.

## Scope limitation that must be closed

`source-feeds.md` says the original artifact contained **61 A-tier sources**, but only 52 in-box records were fetched. It says the remaining nine were in liquor, beer, food service, veterinary and certificate-of-need categories, without preserving their source names, URLs, or IDs. The shared Claude artifact is Cloudflare-blocked in this execution environment, so those nine cannot be honestly classified from the vault.

The next pass needs an exported artifact (or just the nine source names/URLs). Then each should be assigned one of the four classifications above with a real denominator, rather than being silently counted as email-negative.

## Evidence

- Field schemas and prior measured samples: [source-feeds.md](/home/si/tokenrip-vault/active/quintel-v2/source-feeds.md) §§2 and 6; [per-source source register](/home/si/tokenrip-vault/active/quintel-v2/data/source-feeds-a-tier-2026-09-24.md).
- TxDOT fresh count, 2026-10-02: official Socrata endpoint `https://data.texas.gov/resource/dw25-6md2.json`, `count(email)=936`, `count(vendor_name)=1042`, `count(phone)=1037`, `count(*)=1042`.
- Chattanooga current export, 2026-10-02: official ArcGIS CSV endpoint recorded in the source register; malformed CSV prevents a trustworthy column-level count without a provider-native query.
