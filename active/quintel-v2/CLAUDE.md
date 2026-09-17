# quintel-v2 — map of this directory

Program folder for **Quintel v2**, step 1: the borrower-facing site and funnel that qualify demand and route it to originators. Created 2026-09-16 from the Bean session after the David LaSaee call that morning (`bd/calls/transcripts/david-lasaee-2026-09-16.md`). This file is a map, not a method doc.

**Read first:** `gameplan.md` (the plan, shareable) · `thesis.md` (why, the two steps, graduation criteria) · `funnel.md` (the hub: how a lead moves) · `threads.md` (every idea not yet scheduled) · `providence.md` (internal: how step 1 changes the pilot; Saturday 09-19 brief).

**Relationship to `active/flpool/`:** flpool is the Providence lab. Its gameplan concluded (§4.9, §4.10) that calls are the R&D instrument and the product is inbound-shaped. This folder is that conclusion graduated into a program. flpool continues as the labeling lab; verdicts from David still feed selection and the signal experiments here. Do not move flpool files; link.

## Document architecture

The docs mirror the system: one funnel (hub), sources feeding it (spokes), thesis and economics above, compliance and registers beside. Split rule: separate docs when they change at different rates or are read by different people, never by topic.

| File            | Answers                                                                                                                                                                                   | Cadence    | Tier                | Status                                                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `CLAUDE.md`     | this map, read order, rules, what is not yet written                                                                                                                                      | rare       | internal            | written 09-16                                                                                                               |
| `thesis.md`     | why a leaner Providence, why two steps, what step 1 must prove, the reframes                                                                                                              | quarterly  | shareable with Alek | written 09-16                                                                                                               |
| `funnel.md`     | pre-qual architecture: stages, fields, no-PII boundary, verification, routing, handoff, lead states                                                                                       | per build  | shareable with Alek | written 09-16                                                                                                               |
| `providence.md` | how step 1 changes the pilot and David's role; the Saturday brief                                                                                                                         | per call   | **internal only**   | written 09-16                                                                                                               |
| `threads.md`    | every idea not yet scheduled, one line each with status                                                                                                                                   | append     | internal            | written 09-16                                                                                                               |
| `tearsheet_2026-09-19.md` | Saturday prep: goal, agenda, discussion points, asks, things not to say | per call | internal | written 09-17 |
| `site.md` | the site: jobs to be done, v1 scope, roadmap, the three doors, naming candidates | per sprint | internal | written 09-17 |
| `technicians.md` | the technician partner source: four scenarios, the seam, the shop link, lanes, experiment, risks | per sprint | internal | written 09-17 |
| `signals-execution.md` | the execution companion to `signals.md`: prompts per phase, checks before ship, experiment log, source registry, shop register | per list | internal | written 09-17; Phase 1 prompts ready to run |
| `gameplan.md` | the synthesized plan: where we are, hypotheses, the site and funnel with a clean handoff, roadmap A–G, experiments, commercials, asks, questions for the call | weekly | **shareable with David** (written to be sent before 09-19) | written 09-17, v0.4 in sync with the visual `gameplan.html` (published artifact) |
| `inbound.md` | the content and AEO engine on the site: query targets (equipment questions, not financing), content units, AI-as-reader design, measurement, why-now + kill condition | per sprint | shareable with Alek | **not written.** `site.md` now holds scope, roadmap and naming; this doc is the content plan only, after the first query pull |
| `outbound.md` | email on Quintel domains; absorbs and supersedes `active/flpool/EMAIL_INFRA_PLAN_2026-09-09.md`; arm-B specificity; verified-entity reply check; suppression (ours only); triggered sends; scaling past one originator | per sprint | internal | **not written.** Needs the brand decision (below); commitment #19 is reversed in `providence.md` §3 |
| `signals.md` | the full spectrum (planned / loss / cohort / turnover / financial / stated / partner-observed), nine pre-registered hypotheses, the signals-to-lists gameplan, the list protocol, the source-discovery prompt, the technician take | per run | shareable with Alek | written 09-17 |
| `economics.md`  | the maturity ladder (prospect → qualified → application → funded), fee per rung, cost-per-application as the inbound metric, attribution by brand, step-2 economics, David's role         | monthly    | internal            | **not written.** Saturday's conversation is the input; current position lives in `providence.md` §4 and flpool gameplan §15 |
| `vendors.md` | the vendor ICP (from David's 21-vendor sheet: niche dealers and manufacturer-direct with no captive), research pass per vendor, the vendor value prop, the technician channel upstream of it | per sprint | internal | **not written.** Seeds: `threads.md` T9, T15, T19, T20; data in `data/david-vendors-2026-09-16.tsv` |
| `compliance.md` | state commercial-financing disclosure laws, broker licensing, TCPA, CAN-SPAM, FCRA if pre-qual ever touches credit; "confirm with counsel" checklist                                      | per change | internal            | **not written.** Blocks nothing this week; blocks the site going live with a "get a quote" form. See `threads.md` T12       |
| `decisions.md`  | date, decision, reasoning, reversibility, who                                                                                                                                             | append     | internal            | **not written.** Decisions so far are in `thesis.md` §6; split out when there are more than ten                             |

## The brand decision (blocks `inbound.md` and `outbound.md`)

Direction set 2026-09-17 (Simon): **no category word in the name** (not "funding," not "equipment"), and not necessarily "Quintel" in it; the footer says "a Quintel product" with a link. Keep it flexible so step 2 does not force a rename. Leaning equipment-focused for the end user, with the technician/partner angle built in.

Design the roles before the name (`threads.md` T22): one site, three doors. Buyer door = the calculator. Partner door = a link and a partner page; shops, dealers and insurance agents share the mechanism and differ in copy; the partner is pre-filled as seller of record by his link. Lender door = a wall: "financing through our funding partners"; Providence never on the page. No dealer directory or marketplace in v1.

What the name has to do: be said out loud in a repair bay ("hit the [name] link, it gives you the monthly"), fit on a QR sticker and a URL, and read as a tool brand rather than a fintech (two syllables, hard consonants; trades trust Snap-on and Fullbay, not anything ending in -ly). The descriptor line under the name does the category work and can change: "Payment quotes for equipment and trades" now.

Candidate directions floated 2026-09-17 (unchecked for trademarks and domains; direction only): trade objects that mean "connect" or "carry" (Hitch, Tandem, Gantry, Winch, Chock), things you build on (Anvil, Ballast, Bedrock is taken), coined compounds (Rigline, Ironmark, Toolpay is a category word). Shortlist to say out loud in a bay: **Hitch**, **Tandem**, **Anvil**, **Gantry**, **Rigline**.

Program name: **Quintel v2** (decided 2026-09-17). No analogy names. Site brand is a separate decision (`site.md` §5).

Remaining parts, in order once the name exists: the entity in the footer and whether it needs a state commercial-finance registration before the quote form goes live (T12); the sending-domain family (lookalikes of the name, ours, warming now); the named sender who answers replies.

## Rules that hold across the folder

- Each doc opens with frontmatter (status, last revised, owner, the decision it serves, tier) and then the "so what."
- Fact vs inference labeled, with confidence, on every load-bearing claim about a customer or the market. A hedge in the source survives into the recommendation.
- Experiment docs pre-register the decision rule and a prior before the run.
- Tier is a filter, not a rewrite: anything marked shareable must not contain David's verbatim phrasing or the commercial read. He asked not to be recorded.
- No demographic fields, no guessed emails, no LinkedIn-derived vendors (carried from flpool).
- One site, one brand, for now. The two-brand idea is a thread (T10), not a plan.
- Lowercase filenames.
