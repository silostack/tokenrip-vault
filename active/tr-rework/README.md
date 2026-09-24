---
title: Tokenrip Rework. Where the Thinking Is, What Is Decided, What Is Next
status: lead note, maintained; last updated 2026-09-17
created: 2026-09-07
owner: Simon
purpose: Jumping-off point for the whole Tokenrip rework (June to September 2026). Read this first, then follow the links.
---

# Tokenrip Rework

**Tokenrip is a shared workspace you plug your agents into.** Files, decisions, and an inbox, in one place a team and every agent it runs can reach from any AI tool. Coding agents have git. Everything else has a chat window. Tokenrip is the place outside the repo where an agent's work lands so the next person, in their tool, can pick it up.

That sentence took three months and eleven documents to arrive at. This note says where each piece of the thinking lives, which parts are settled, and what has to happen before the new homepage ships.

## Read in this order

| Read | If you want | Time |
|---|---|---|
| This note | The whole picture and the current state | 5 min |
| `tokenrip-homepage-v3.1-2026-09-05.md` | The page as it will ship: copy, layout, prerequisites | 15 min |
| `tokenrip-first-loop-site-gtm-2026-09-04.md` | Why the inbox is the product and what gets built first | 15 min |
| `tokenrip-brain-terminals-modules-canon-2026-09-01.md` | The product model and ICP the page rests on | 20 min |
| Everything under "Lineage" below | How we got here, and the ideas that still have to be paid for | As needed |

## The state of things, in one table

| Question | Answer | Source |
|---|---|---|
| What is it | A shared workspace any AI agent plugs into. Files, decisions, inbox. | v3.1 hero |
| Who is it for | Companies whose work happens in agents. Solo founder with six agents, two founders on different tools, ten people on Cowork. Headcount is not the filter. | Canon §2, v3.1 |
| Why it matters | Work done in one tool is there for the next person, in theirs. Memory tools stop your assistant forgetting you. Git lets someone else continue your work. | v3.1 §3 |
| What is different | Positions (decisions, on the page) live in no other system of record. The workspace lives on Tokenrip; the hands stay in whatever tool the person already uses. | Canon §1.1, §1.2 |
| Daily surface | The inbox at connect time: "2 things landed while you were away." Nobody uses a brain. | First-loop §1 |
| First build | The call-transcript loop: notetaker poller → work item → `process-call` → team workspace. Built once on our own calls, then opened. | First-loop §3 |
| Pricing logic | Free to drive, paid for autopilot. Terminals free, reflexes paid. Priced per workspace, never per principal. | First-loop §4, canon |
| GTM | Self-serve for AI-native small companies. The call processor is the lure. FDE demoted to a services path. | First-loop §5, canon §4 |
| Site plan | Two stages. A now, everything true today, command-only CTA. B after the call loop has run two weeks internally. | First-loop §4, v3.1 prerequisites |

## The decisions that are made

These were argued out across the sessions and should not be reopened without new evidence.

1. **The hero is literal.** "A shared workspace you plug your agents into." Every metaphor from the workshops (engine, codebase, office, patch bay) survives only as a supporting line lower on the page. Reached 2026-09-04 after the metaphor route kept producing lines that needed explaining. Recorded in v3 and carried into v3.1.
2. **Vocabulary on the page uses nouns a stranger already has.** "Decisions" not "positions," "connect" not "mount," "tool" not "terminal," "people, agents, apps" not "principals." Product nouns stay in docs and the CLI. (v3.1 vocabulary rule.)
3. **The problem is the git gap, not memory pain.** Every company-brain page already says "your AI forgets." The distinction Tokenrip owns is collaboration: a place another person's agent can continue your work. (v3.1 §3, shared-memory canon §III.)
4. **The inbox is the product's daily surface.** Six of the eight items on Simon's pain list were "nobody was awake, so a human had to push." The missing piece is what puts items in the inbox without a human: the reflex runtime. (First-loop §1.)
5. **ICP is behavioral, not headcount.** "Companies that run on agents." Targeting the co-founder pair alone was rejected as too niche. (Canon §2, homepage workshop.)
6. **Claim discipline.** Nothing on the page that is not true today, unless labeled. Never write "semantic." Modules are marked live only when live. Publisher is the only live module. (v2 amendments, v3.1 prerequisites.)
7. **No enterprise smells.** No "book a demo," no logo wall, no compliance badges, no chat widget. Commands shown raw. Pricing public. (v2, v3, v3.1.)

## What is still open

Each of these blocks a specific section of the page. Full table in v3.1 under "Build prerequisites."

- **Real captures for the terminal scene.** The `rip connect` boot output must show pending items and a decisions count, and the decisions question must return a real file. If the real output is a doc index, fix the product, not the copy.
- **Access granularity.** "Each connection sees only what you grant" holds only if access is per connection. If it is per workspace, soften the line.
- **Create-workspace command** for get-started step 2. Verify it exists and what it is called.
- **"Decisions" in the CLI.** Either rename positions in CLI output and file paths, or the terminal block shows "positions" and section 4 glosses it once.
- **Semantic recall for customer workspaces.** It is an admin-granted entitlement per account today. Decide the default. The page says "search" either way.
- **Public workspace quality.** Five-stranger-questions test from a tool Simon does not use, before "connect to ours" becomes the only conversion.
- **Five-founder hero test.** Five founders who run on agents read the hero and paraphrase it. "A shared workspace my agents connect to" passes. "Agent platform" or "a Notion thing" fails.
- **Darkroom vs. daylight.** All motion assets are built for the darkroom variant. Daylight would need its own generations and a different blend technique. (video/README.)
- **Quintel's "engine" naming.** Quintel calls its core an engine. The Tokenrip page uses the word only in section 7. Raised, not decided.

## The documents

### Current (the page and the model it rests on)

**`tokenrip-homepage-v3.1-2026-09-05.md`** · the shipping spec. Literal hero, git problem, patch bay scene split from the terminal block, "decisions" everywhere, office analogy in three places, copy cut by a third. Ends with prerequisites, success checks, and a change log from v3. Supersedes v3.

**`tokenrip-first-loop-site-gtm-2026-09-04.md`** · the build and GTM sequence. Pain list decomposed into the attachment taxonomy; the finding that the missing piece is the reflex runtime, not memory; the generic work queue cleared for build (T5 `SteeringEvent` is ~70% of it); call transcripts as the first loop; the two-stage site; the loop as the distribution machine.

**`tokenrip-brain-terminals-modules-canon-2026-09-01.md`** · the product model. Brain separated from harness (the claim incumbents cannot make); facts and positions; principals and slices; modules as installable abilities; the AI-native small-company ICP; the onboarding ladder (mount ours → build yours → correct → second tool); the Quintel bulk-trigger pattern; open questions. Evolves the June canon without replacing it.

**`tokenrip-marketing-model-duel-show-2026-09-17.md`** · parked marketing idea. Short voiced clips of two frontier models squaring off, as a fun-first proof of concept with the Tokenrip branches (leaderboard, human corners, founder's-company episodes, hosting on the substrate, show-as-reflex) captured behind an interest gate. Also holds the category-name workshop ("multiplayer agents" vs "co-agentic").

### Design and assets

**`design/`** · four rendered homepage directions, all on the v3.1 copy: `A-darkroom`, `A-daylight` (same layout, two palettes), `B-catalogue`, `C-console`. Built 2026-09-05 by the two `build-A-*.py` scripts. Open the HTML files directly; the hero image is inlined.

**`visuals/`** · thirteen patch bay renders. The concept: a rack unit with the file tree glowing under smoked glass, agents plugging in on the left, work coming out on the right. Renders 10 through 13 are the IN · AGENTS / OUT · WORK versions the v3.1 scene calls for. `patchbay_10_glass_inout.png` is the current pick and the source for the video hero.

**`video/`** · the motion layer for the darkroom page. Three of ten ideas built and wired in (living patch bay loop, cable plugs itself in, scroll-scrubbed in-to-out); seven written as job specs and blocked on MiniMax or OpenAI credits, about eight dollars to finish. `video/README.md` records the pipeline, the three findings (bake the still back in, generate backwards and reverse, insist on continuous motion), and the local preview server. Playback has not been confirmed in a normal browser.

### Lineage (superseded, kept for the reasoning)

**`tokenrip-homepage-v3-2026-09-04.md`** · first literal-hero draft. Full eleven-section copy with annotations. v3.1 changed the problem section, the scene, the vocabulary, and cut the proof section. Read for the annotations and the "what changed from v2" log.

**`tokenrip-homepage-v2-2026-08-30.md`** · the "company brain" page. Hero "Your team runs on AI. None of it is shared." Carries the 2026-09-04 amendments (two-stage ship, inbox scene, pain list verbatim, "It wakes up" section) that fed v3. Superseded because it led with a metaphor and with memory pain.

**`tokenrip-operating-memory-vision-2026-08-30.md`** · the strategic direction as of late August. Evidence / positions / procedures; company brains as nodes and Tokenrip as the network between them; "company brain" named as a useful metaphor but not a defensible category; meeting → memory → next action recommended as the first loop. Independently reached the same first loop as the 09-04 doc.

**`workspace-brain-architecture-2026-06-14.md`** · how shared storage becomes shared memory. Signals / Doctrine / Output; draft and consolidate as the two operations; atomic claim-notes; folders as the composable unit; the private/shared boundary as the multiplayer primitive. The marketing brain as the running example. Still the reference for how a workspace should store and retrieve.

**`tokenrip-shared-memory-canonical-fable-2026-06-11.md`** · the June synthesis. Semantic search converts storage into memory; coordination passes context, collaboration retrieves it; the closed read/write loop as the moat; substrate-invisibility as the GTM diagnosis; the boundary-crossing test as the wedge filter; three acceptance tests (magic demo, zero-ceremony ingestion, org-boundary expressiveness). The longest doc and the most re-derived claims.

**`tokenrip-shared-memory-gtm-and-magic-demo-2026-06-11.md`** · one of the two captures merged into the canonical synthesis above. Kept for the magic-demo script and the walk-forward vs. walk-backward argument.

**`tokenrip-vision-and-roadmap-2026-06-09.md`** · the June baseline. Git for operational work, the why-graph, FDE strategy, the two vertical builds, and a capability inventory written to be checked against the code. The oldest doc here and the one the canon says it evolves rather than replaces.

## How the thinking moved

- **June.** Git for operational work. The why-graph is the moat. Semantic search turns the recorded why into recallable memory. GTM is forward-deployed verticals; the problem is that the substrate is invisible in what gets delivered.
- **Late August.** Company brain. Facts and positions, connected to every terminal. The brain separates from the harness. ICP narrows to AI-native small companies and GTM turns self-serve.
- **September 1 to 4.** Modules, principals, slices settle. Simon's pain list shows the real gap is that nobody is awake to push work into the inbox. The inbox becomes the daily surface. Call transcripts become the first loop. The site splits into two stages.
- **September 4 to 5.** Homepage workshop. Metaphors tried and dropped (engine, codebase, job site, office). Hero goes literal. The problem becomes the git gap. Positions become decisions on the page. Patch bay becomes the one illustration.
- **September 5 to 7.** Four design directions rendered. Motion pipeline built for the darkroom variant. Three clips shipped, seven queued on credits.

## Outside this folder

- `agents/bean/ideas/inbox-as-the-product-surface.md` and `agents/bean/ideas/generic-work-queue.md` · the Bean idea notes the first-loop doc grew from.
- `product/tokenrip/brain/OPERATIONS.md` · where the semantic-search entitlement is documented. The source of the "never write semantic" rule.
- `product/tokenrip/mounted-agent-model.md` · the earlier mounted-agent framing the June docs build on.
- Live `tokenrip.com` · still the stale FDE page ("Turn your firm's judgment into agent workflows"). Everything here replaces it.

## Next actions

1. Run the four verifications in v3.1's prerequisites table (guest connect cold, real boot capture, access granularity, create-workspace command).
2. Decide "decisions" vs. "positions" in the CLI.
3. Pick darkroom or daylight. Top up one video provider and run the queued clips if darkroom.
4. Confirm video playback in a normal Chrome.
5. Five-founder hero test.
6. Ship stage A.
