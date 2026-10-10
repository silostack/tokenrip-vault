---
title: "Tokenrip — The First Loop, the Site, and the GTM Sequence (Session Synthesis)"
status: draft v1 — Bean session capture 2026-09-04, for Simon's review
created: 2026-09-04
owner: Simon
source: Bean session 2026-09-04 (pain-list → first-principles rethink → site + GTM)
relation_to_canon: |
  Extends active/tokenrip-brain-terminals-modules-canon-2026-09-01.md. Nothing in the canon is reversed. Two things move: (1) the inbox goes from a §1.4 footnote to the product's daily surface; (2) the generic work queue (§5.1) clears its pull-gate and becomes the spine of the first build. The June primitives (brain, terminals, modules, slices, principals, reflexes) all survive and are all load-bearing in the loop below.
related:
  - active/tokenrip-brain-terminals-modules-canon-2026-09-01.md
  - active/tokenrip-homepage-v2-2026-08-30.md
  - active/tokenrip-operating-memory-vision-2026-08-30.md (independently recommended the same first loop)
  - agents/bean/ideas/generic-work-queue.md
  - agents/bean/ideas/inbox-as-the-product-surface.md
suggested_home: product/tokenrip/
---

# Tokenrip: The First Loop, the Site, and the GTM Sequence

> **One sentence.** The pain list is not eight modules; it is one loop with eight sources, and the center of that loop is the inbox, not the brain. Build the loop once on call transcripts, ship the site in two stages, and let the loop run the distribution.

---

## 1. What the pain list revealed

Simon's list (2026-09-04): issue inbox for Alek · shared skills · call ingest / CRM awareness · doc collaboration · brain dump / merge · posting cadence · analytics from PostHog · provider/tool console + unified billing.

**Every item decomposes into the canon's attachment taxonomy.** Issue inbox = work item. Shared skills = Skill + Connection (the Publisher, already live). Call ingest = Source + Reflex. Doc collaboration = the T1–T5 collaboration substrate, already shipped. Brain dump = bulk Source + slice. Cadence = cron Reflex + the existing `/post` skill. Analytics = Connection + Surface (the connections doc uses PostHog as its worked example). Provider console = Surface over `connection_call_audit`, which already exists. The taxonomy predicted the list; that is validation, not the finding.

**The finding: six of eight are "nobody was awake, so a human had to push."** Alek pushes bugs on Telegram. Simon pushes himself to ask for the transcript link, and to post on LinkedIn, and fails at the second. Nobody watches PostHog or quotas. Simon's own diagnosis of the cadence problem ("a pull mechanism that gets me to do it") is the diagnosis of the whole list. Memory is not the missing piece: Tokenrip has memory (workspaces/brains with hybrid recall), hands (Connections), skills, Surfaces, and a pull-based inbox with actionable steering. What is missing is the thing that **puts items in the inbox without a human**: the reflex runtime.

**Consequence: the daily product experience is "process the inbox from your terminal," not "query the brain."** Nobody uses a brain. Every durable memory product has a daily ritual surface (email inbox, GitHub notifications, Linear triage). Tokenrip's is terminal-connect: *"3 things landed while you were away."* This is the June "what does my agent need from me" gateway, the canon's reflex paywall, and the magic demo, on one screen.

**Two items are not ICP pains.** The provider console hurts at 50 people, not 10; build it as internal instrumentation (per-mount cost attribution over the audit table) because it is how metered routing via Connections becomes real for pricing. Unified billing across providers is a reseller fintech (margin, fraud, provider ToS); parked. Analytics-as-dashboard is the most crowded shelf in software; analytics-as-Source (metrics are facts with a schedule, checked against positions) is not, and is the version worth building.

**Multiplayer is handoff, not co-editing.** Google Docs solved same-document-same-time. The pain list is entirely different-people / different-tools / different-times / same-brain. Asynchronous multiplayer across harnesses. This is the answer to "what other multiplayer problems can we address."

---

## 2. The generic work queue cleared its pull-gate

The canon (§5.1, §6 item 7) logged the work queue as a thought experiment: "watch for the third instance." The pain list supplies three (Alek's issue inbox, transcript-processing tasks, cadence tasks); Quintel triage is the fourth.

**The repo already has ~70% of it.** T5 `SteeringEvent` is a durable, human-created, agent-targeted work item with a payload (comment + anchor), pending→acked state, and a resolution trail (`ackedVersionId`). `GET /v0/inbox?actionable=true` surfaces it; `agent_load` echoes `pendingSteering` at boot. The architecture doc names "the (paused) substrate-roadmap scheduler" as the consumer of this seam.

**Missing:** items not attached to an artifact (free-standing tasks); items created by the system rather than a human comment; claim/release with a lease (Quintel triage already runs this state machine); aging; and the scheduler that creates items on a cron. **The build is un-pausing the scheduler and generalizing steering events into work items.** Not a new primitive.

**The crank→reflex ladder is a migration path, not a pricing slide.** Simon's design for call ingest: poller (Source, scheduled, no judgment) → work item → any harness claims it and runs the skill on the user's model (the "ingestion crank") → later, Tokenrip claims it itself with the team's keys (the Reflex, the paid module). These are **the same queue with a different claimant.** Do not build a special "process-call reflex" path; build "Tokenrip can be a claimant on the queue." A reflex is a principal with a server-side workbench. The daemon is a user of the scheduler; the OS frame closes.

**The template generalizes to every source.** PostHog: poller → "activation 31% vs. your 40% position." Git: poller → "12 commits this week." Cadence: cron → "draft Tuesday's post, 4 ideas from this week's facts." Bulk dump: upload → N "atomize this" items. Each new source is a poller config plus a skill: config-not-code for ingestion. The first source builds the template; the rest are cheap.

---

## 3. The first loop: call transcripts

**Why calls first.** Highest score on every axis: crosses the Alek→Simon boundary; densest fact stream the company has (the Quintel motion produces calls daily); needs a reflex; every founder pair wants it; and the operating-memory vision doc (2026-08-30, external collaborator) independently recommended "meeting → memory → next action" as the first loop. Two derivations, same answer.

**Notetaker facts (verified 2026-09-04).** Alek uses Fireflies; Simon switched to Fathom (free) on 2026-09-03 and will move Alek. Fathom API: API-key auth, `GET /meetings`, transcript + summary endpoints (summary already includes action items and CRM matches), webhooks available, `List teams` / `List team members` endpoints (**unverified:** whether one team-level key reads every member's meetings on the free plan; check before designing around per-person keys). Both notetakers reduce to a two-endpoint adapter: list meetings since cursor, fetch transcript.

**Design decisions:**

- **Poll, don't webhook.** Tokenrip messaging is deliberately pull-based with no inbound surface; a webhook receiver would be the platform's first inbound attack surface, built for one integration. Hourly polling works identically for both notetakers; the latency is absorbed by the aging rule.
- **Don't rebuild the summarizer.** Fathom extracts action items for free. The differentiated work is what a notetaker structurally cannot do: read the call **against positions** (pricing floor, ICP, current bets) and **against the contact's history** (prior calls, prior commitments), then route results into the brain and the inbox. Fathom's action items become inbox items with zero inference: a Source that feeds the queue before any reflex exists.
- **The judgment layer already exists.** `process-call` (four call types, four lenses, contact doc update, learning note) is the imprint of the module. The learning note is a draft position, so the consolidate step has an input on day one.
- **The write target is the boundary.** `process-call` today writes markdown into this vault, which Alek cannot see. Running it unchanged from the crank recreates the boundary death one step later. Its three outputs (cleaned transcript, contact doc, learning note) must land as artifacts/notes in the **team brain**. This is also the brain dump in miniature: `bd/calls/contacts/` becomes the first vault folder that goes collective, and "private parts" gets defined by what stays out.
- **Aging is not optional.** "Anyone can process it at any time" reintroduces the original pain (a queue with no SLA is a nicer crack). Cheapest version: boot-time nudge ("2 unprocessed calls, oldest 26h"), which the `pendingSteering` echo already does structurally. Honest version: aging *is* a reflex, so the runtime is what gives the crank a deadline. Claim/lease prevents two harnesses grabbing one item.
- **Connections get their first real multi-operator test.** The notetaker key stored as a Connection, granted to the team mount, plaintext never touching either harness.

**The loop, concretely:**

1. Scheduler runs a Fathom (and Fireflies) poller hourly against a team Connection. New meeting → transcript artifact in the team brain + a `process-call` work item + Fathom's action items as inbox items.
2. Work items = steering events generalized: free-standing, system-creatable, claim/release with a lease, aging with a boot-time nudge.
3. Any harness claims the item and runs `process-call`, rewritten to read the contact's prior notes and the relevant positions from the brain, and to write its three outputs back to the team brain.
4. The learning note lands as a candidate position for the weekly consolidate.
5. After two weeks on real calls, Tokenrip becomes a claimant with the team's Anthropic key (via a Connection). That is the paid module and the first reflex.

Every layer of the canon is load-bearing in this loop, and Alek's daily calls are the pull.

**Build sequence:**

| Week | Build | Code? |
|---|---|---|
| 1 | Alek files issues as `request`-intent steering comments on a "Quintel issues" artifact; Simon's Claude Code boots with them pending. `/brain-sync` runs on the shareable half of the vault. Measure whether Alek uses the channel. | none |
| 2–3 | Work items generalized from `SteeringEvent`; scheduler un-paused; Fathom/Fireflies poller; `process-call` re-targeted to the team brain; Fathom action items → inbox. | yes |
| 4 | Second and third sources on the same spine: cron (Tuesday post draft from the week's facts, via `/post`) and bulk dump (Alek's folder → atomize). The transcript extractor is the dump extractor is the website-mirror extractor. | small |
| then | PostHog as a Source (metric-as-fact, checked against positions); provider console as an internal Surface over `connection_call_audit`. | small |

**Run-reflex before build-reflex, twice.** Pain #1 v0 is zero code (steering comments). Pain #5 v0 is `/brain-sync`, which already atomizes a seed set into a semantic brain.

---

## 4. The site: two stages, center of gravity moves to the inbox

**Ship stage A this month regardless.** The live page (workflow audits, insurance / real estate, "book a workflow audit") is two generations stale; anyone sent there by a post bounces. Stage A = everything in the v2 spec that is true now: hero, thesis, problem, brain, terminals, "mount ours" as the docs, FAQ, command-only CTA. **Stage B** lands when the call loop has run two weeks: the real scene, the mirror button, the ops page.

**Four amendments to `tokenrip-homepage-v2-2026-08-30.md`:**

1. **The scene shows the inbox, not a query.** v2's scene (Simon asks about yesterday's Wingspire call) demonstrates recall, which every MCP context tool also demonstrates. Replace with terminal-connect: *"3 things landed while you were away. Alek's Wingspire call (2 commitments, one contradicts your pricing floor). A bug Alek filed from Cowork. Tuesday's post draft, 4 ideas from this week."* In stage A, show a human-posted item honestly ("Alek filed this from Cowork") and label the system-posted ones "soon."
2. **The problem section is the pain list, verbatim.** "Your co-founder fires bugs at you on Telegram." "The transcript is in someone else's notetaker, so you ask for the link. Again." "You meant to post this week." Specific enough to be recognized.
3. **New section between Terminals and Modules: "It wakes up."** Spine: brain = remember, terminals = reach, inbox = wake. This is also where pricing is explained as an argument: free to drive (connect, mount, post to your own inbox), pay for autopilot (your brain posts to it).
4. **Eyebrow runs the co-founder pair alongside the solo founder.** "For the technical/non-technical co-founder pair, and the solo founder with six agents." (Inferred, medium confidence: the pair is a sharper, higher-pull ICP than "solo → ten"; signups will tell.)

**Claim discipline, updated.** The canon and v2 say "FTS only, never say semantic"; `product/tokenrip/brain/OPERATIONS.md` says semantic recall is live in hybrid mode on the Tokenrip brain. **Resolve which holds for a customer's brain before copy locks.** Modules: Publisher = live; call processor = "in use, coming to you" once the loop runs internally; everything else "planned." No other green dots.

**Stage A's entire conversion is "mount ours."** Before copy: ask the public brain five questions a stranger would ask ("how do I connect from Cowork," "what's a position," "what does it cost," "what do you store," "how is this different from a folder of markdown"), from a harness Simon does not normally use. Crisp answers → ship this week. Doc-index answers → a routing-instructions pass on the brain first. The page is only as good as the brain behind the command.

---

## 5. GTM: the loop is the machine; the call processor is the lure

- **The distribution gap now has a mechanism.** June's wrapper-catalog discipline ("every piece of content ships something mountable") stalled on cadence. The cadence reflex *is* the cadence: weekly, the brain drafts a build-in-public post from the week's facts, it lands in the inbox, Simon edits and ships. The reflex that markets reflexes. Dogfood-as-ad with a motor.
- **Hero/lure, finally with a lure that passes every test.** *Lure:* the call processor ("Fathom notes that know what your company believes"): pre-existing demand (every founder has a notetaker and hates the generic summary), inherently shared (calls are the one thing co-founders must share), requires the architecture (source + brain + inbox + terminal all load-bearing). Product Hunt / Show HN listing. Unabyss hit #1 twice with context sync alone; this is context sync with a reason to return tomorrow. *Hero:* the brain + inbox. **Launch the lure after two weeks of internal use, not before.**
- **Be in the directories the harness user already searches.** Anthropic connector directory, Cowork plugin surface, Cursor / Codex MCP lists, Smithery, and Fathom's own integrations page ("Fathom → Tokenrip" is a search someone runs). `llms.txt` on tokenrip.com pointing at the MCP URL, because the visitor is often an agent.
- **Two proof assets from running the company.** (a) The ops page: two founders on two continents, one technical, running Tokenrip and Quintel on it, with the real inbox, modules, principals. (b) The story: Alek ships a fix from Cowork off a work item. One event proves labor-as-a-dial better than any solo-founder claim, and it is a post, a case study, and a homepage line.
- **The free-notetaker signal.** Simon switched to Fathom because it's free; that is the AI-native founder's stack (free notetaker, Cowork or Claude Code, a Notion). The pitch lands on the person who won't pay Fireflies for AI summaries but would pay for the summary that knows their pricing floor. Inferred; same person as the founder.
- **Day-zero stays parked as a partner channel.** "Your brain is your first hire" at incorporation (Atlas / Firstbase) needs traction to open. Noted, not worked.
- **Pricing: per brain, never per principal.** Agents are principals and a company should have dozens. Free = brain, unlimited terminals, human-posted inbox, the Publisher. Paid = reflexes and sources (pollers, cron, aging, Tokenrip as a claimant). Custom modules remain the FDE path under vertical brands.

**Sequence of tests, tagged by what each measures** (the decompose-distribution-tests rule):

| Test | Measures |
|---|---|
| Stage A site + registries | who connects (prediction #3: <2yr / <10 people; new: share with two founders on different harnesses) |
| Cadence reflex posts | post → mount rate |
| Call-processor launch | source-connect → second-terminal-connect rate (the boundary crossing) |
| Ops page | mount → paid |

---

## 6. Open items carried forward

1. **Fathom team-key scope on the free plan** (one key, all members' meetings?) — decides whether the poller needs per-person Connections.
2. **Semantic claim** — confirm entitlement for customer brains before site copy locks.
3. **Public brain quality** — the five-stranger-questions test gates stage A.
4. **Alek's channel** — the whole plan assumes Alek changes behavior; the ingest must be Telegram-cheap (Telegram bot via Hermes, email, or a one-word Cowork skill). Disconfirming test in week 1–2 (see predictions).
5. **Personal-brain ownership line** (canon §6 item 1) — now gets decided by doing: what of `bd/calls/contacts/` goes collective, and what stays out.
6. **Vocabulary** — "work item" vs "work order" vs "task"; "reflex" vs "autopilot" in public copy. Run the vocabulary-tree audit before the site ships.

---

*Captured by Bean, 2026-09-04. Companions: [[generic-work-queue]], [[inbox-as-the-product-surface]], [[substrate-gtm-wrappers]], [[workspace-brain]].*
