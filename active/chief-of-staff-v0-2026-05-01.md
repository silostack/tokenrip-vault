# Chief of Staff v0 — Backend Work + Aha Moment Design

**Date**: 2026-05-01
**Build window**: Sat May 3 → Mon May 5 (v0 ship target); through Fri May 9 (full P1 surface)
**Goal**: Ship a Chief of Staff agent that produces a clear "oh shit, wow" moment for a YC partner watching the demo video, with enough feature depth to *also* survive 4-6 weeks of dogfooding without re-architecting.
**Source**: [[chief-of-staff-launch-design-2026-04-27]] (locked decisions; the 14-day sprint plan)
**Companion site work**: [[site-updates-for-yc-2026-05-01]] §P0.1 (CoS preview tile), §P1.1 (real landing page), §P0.3 (architecture mini-diagram on detail pages)

---

## What This Doc Is

The 2026-04-27 design brief locked the *what* (Chief of Staff as the hero, layered memory + Friday Review + intake, must-ship features). This doc answers two follow-up questions that emerged from the YC application planning:

1. **What makes this go "oh shit, wow"?** The 2026-04-27 brief had a 14-day sprint to ship substance. We need the v0 ship to *also* land an aha moment in a 2-3 minute YC demo video. That requires a sharper UX bet than the spec implied.

2. **What's the v0 feature set we can ship by Mon May 5 (4 days)** that produces the aha *and* survives 4-6 weeks of dogfooding without re-architecting? Cutting too aggressively misses the aha; over-scoping misses the ship date.

Below: the aha-moment ranking (which moments to engineer for, and why), the 2-3 minute demo flow it produces, the v0 feature cut, and concrete build tasks.

---

## The Aha Moments — Ranked

A YC partner watching a Custom GPT demo doesn't go "oh shit, wow." Custom GPTs have shipped. The architectural insight (mounted agents) is what makes Chief of Staff different — but the *insight* is invisible during a demo. Something specific has to make the partner feel the architecture.

Five candidate aha moments, ranked by impact-per-second-of-demo:

### Aha #1 — Visible Memory + Cross-Harness Mount (the architectural aha)

**What the partner sees:** A clean, structured view of "here's everything Chief of Staff knows about this operator." Not a chat history. A *structured* representation — facts, commitments, patterns, preferences — that the partner can read in 5 seconds. Then: the same agent, mounted in a different harness (Claude Code → ChatGPT or Cursor), with the *same memory* visible.

**Why it lands:** Custom GPTs don't have this. Claude Projects don't have this. No hosted agent does. The visible memory + cross-harness mount is a 15-second sequence that says "this is structurally different, not just a better prompt."

**What it costs to build:** A web view at `/agents/chief-of-staff/[operator-id]/memory` that renders the operator's structured personal-memory record from a Tokenrip collection. Plus working bootloader installs in 2+ harnesses (Claude Code minimum, plus one of: MCP-via-ChatGPT, Cursor).

**Status:** Highest priority. Must ship for the demo to work.

### Aha #2 — Substantive Intake (the UX aha)

**What the partner sees:** The agent doesn't ask "tell me about your business" → 3 questions → "I'm ready." It asks 15-20 *substantive* questions, refines based on answers, and visibly writes structured context as it goes. At the end, the operator can see exactly what the agent absorbed.

**Why it lands:** Most "personal AI" experiences feel either thin (system prompt + memory feature flag) or invasive (hand over your whole inbox). A substantive structured intake reads as "this agent is going to be different" before the operator has actually seen it work.

**What it costs to build:** An intake state machine — sequence of questions, each next-question generated based on prior answers, with a "scratchpad" that visibly accumulates structured context. Output: a populated personal-memory record on Tokenrip.

**Status:** Required. The intake IS the differentiator at first contact (per design brief §7).

### Aha #3 — Friday Review Ritual (the workflow aha)

**What the partner sees:** A structured weekly artifact. Commitments from last week → outcomes → slippage → patterns observed → next week's commitments. Rendered as a Tokenrip asset with a shareable URL. The agent walks through it conversationally; the operator confirms or pushes back.

**Why it lands:** Cadence + structured artifact = lock-in. The partner watching this thinks "that's a thing I'd actually use weekly." Custom GPTs can produce text but they can't produce a *recurring ritual that lands an artifact*.

**What it costs to build:** Friday Review skill + asset template + the prompt logic that pulls last week's commitments out of personal memory and structures the conversation around them. Triggered manually for v0 (operator says "let's do Friday Review"); auto-triggered for v1.

**Status:** Required. This is the "what's the product?" answer.

### Aha #4 — Shared Pattern Surfacing (the differentiation aha)

**What the partner sees:** During an interaction, the agent says something like *"Other founders raising a seed often face X around month 4 — does this resonate?"* — surfacing an anonymized pattern from the shared knowledge layer.

**Why it lands:** This is the moment where the *layered memory* architecture (private context + shared patterns) becomes legible. No other agent has this — Custom GPTs have per-user memory; nobody has cross-user patterns with privacy.

**What it costs to build:** A shared-knowledge collection (`founder-patterns`), seeded manually from Simon's Yoda session history. Plus prompt logic that includes pattern-surfacing as a heuristic (not on every turn, but when a pattern likely applies).

**Status:** Strong-but-cuttable. v0 can ship without it if Aha #1 + #2 + #3 are nailed; the shared layer can be visible-but-quiet in v0 ("here's a sample pattern from another founder") and become active in v1. Shipping it weak is worse than not shipping it.

### Aha #5 — The "It Already Knows You" Moment (the persistence aha)

**What the partner sees:** Operator returns for session 2 (later in the week). Agent picks up exactly where they left off: "Last time you committed to X by Friday — how did it go?" Not vague continuity. Specific, structured continuity.

**Why it lands:** ChatGPT memory is shallow and per-user. Claude Projects has no real session-to-session continuity. Mounted-agent memory is structured, persistent, and visible.

**What it costs to build:** Falls out of Aha #1 (visible memory) + Aha #3 (Friday Review). If those work, this is automatic.

**Status:** Free with #1 and #3. Don't engineer separately, but make sure the demo video shows it.

---

## The Aha Cuts: What's Not in v0

Things from the 2026-04-27 brief or this doc that are tempting but cut for v0:

- **Auto-triggered Friday Reviews** — the agent proactively prompting on Fridays is v1. v0 is operator-initiated.
- **Memory edit UI** — the operator can *read* the structured memory but can't edit it via UI. Manual fixes via re-running intake or asking the agent to update. v1 ships an edit pane.
- **Email / Slack / calendar integrations** — agent only operates in the conversational surface for v0. No external triggers.
- **Multi-user / team functionality** — single-operator agents only.
- **Inter-agent calls** — Chief of Staff doesn't call other agents in v0.
- **Sophisticated pattern detection** — the shared layer in v0 is bootstrap-seeded by hand (Simon's Yoda data) plus per-session manual contributions. Automatic pattern detection from session content is v1.
- **Pricing tiers / paid features** — v0 is free. Tiered tooling surface comes later (per [[../product/tokenrip/mounted-agent-model]] business model).
- **Rich rendering of imprint changelogs** — version is shown ("v0.1") but a full diffable changelog UI is v1.
- **A second hero agent** — Writing Partner / Editor / etc. defer per the launch design brief.

---

## Demo Flow for YC Video (2-3 min)

This is what the YC application's demo video shows. Each beat ties to a specific feature in v0.

| Time | What viewer sees | What backend supports it |
|---|---|---|
| 0:00-0:15 | "This is Chief of Staff — a mounted agent on Tokenrip." Open `/agents/chief-of-staff`. Show 3-layer architecture diagram on the page. | Live landing page with Diagram A, deployed per [[site-updates-for-yc-2026-05-01]] §P1.1. |
| 0:15-0:30 | "Let me mount it." Run install command in terminal (Claude Code). 5-second setup. Agent ready. | Bootloader command file; CLI install pattern (proven w/ engagement agent). |
| 0:30-0:50 | Show last week's session. "I've been using this for X days. Here's what we worked through." Agent recalls specifics. | Personal memory persistence; session continuity; conversation log surfaced. |
| 0:50-1:30 | Open visible-memory pane in browser: `tokenrip.com/agents/chief-of-staff/[operator-id]/memory`. Walk through structured view: "company context, current goals, last week's commitments, slippage patterns." | Personal memory collection; web view rendering structured fields. **AHA #1.** |
| 1:30-1:55 | "And here's what's different." Cut to Cursor (or ChatGPT-MCP). Same agent. Same memory. Brief query that uses the same context. | Bootloader works in 2+ harnesses; same imprint; same memory accessible. **AHA #1 (cross-harness).** |
| 1:55-2:25 | "Friday Review." Trigger ritual. Agent walks through commitments → outcomes → slippage → next week. Asset published to Tokenrip with shareable URL. | Friday Review skill; asset template; prompt logic for the structured walk. **AHA #3.** |
| 2:25-2:45 | Optional: surface a shared pattern. "Other founders at this stage often face X." | Shared `founder-patterns` collection (seeded). **AHA #4 if it ships in v0.** |
| 2:45-2:55 | "Mount your own at tokenrip.com/agents/chief-of-staff." | Mount CTA on landing page. |

**Total: ~2:55.** Adjustable if needed; the visible-memory beat (0:50-1:30) is the most important and shouldn't be rushed.

**Production notes:**
- Demo runs as a real session, not a fabricated walkthrough. Simon's actual personal memory is what's shown (or a representative dogfooding session).
- Voiceover or on-screen captions; not a face-cam demo.
- Screen recording at high resolution; render the visible-memory view in light mode for readability.

---

## v0 Feature Set (Must Ship)

The ship list, with what each feature does and how it maps to the aha moments.

### F1: Imprint Asset Bundle

**What it is:** The Chief of Staff "brain" — published as Tokenrip assets, versioned, fetchable.

**Components:**
- `chief-of-staff/persona` — voice, tone, methodology (port from existing Yoda imprint per design brief §7)
- `chief-of-staff/intake-flow` — the structured intake skill
- `chief-of-staff/friday-review` — the weekly ritual skill
- `chief-of-staff/methodology` — the heuristics for how the agent thinks (slippage detection, pattern recognition, accountability framing)
- `chief-of-staff/memory-schema` — structure of personal memory and shared patterns

**Why:** Mirrors the engagement-agent imprint pattern. Imprint version is shown on the landing page (`v0.1`). Forkable, auditable.

**Build cost:** ~3-5 hours. Bulk of work is porting Yoda content; the schemas are derivable from the design brief.

### F2: Personal Memory Collection

**What it is:** Per-operator structured memory. Tokenrip collection with rows for: business context, current goals, commitments, decisions, slippage patterns, preferences.

**Schema (proposed):**
```
operator_id (string)
field_type (enum: context | goal | commitment | decision | slippage | preference)
value (text or structured JSON)
source_session (asset_id)
created_at (timestamp)
last_referenced_at (timestamp)
status (enum: active | archived | superseded)
```

**Why:** Aha #1 (visible memory) requires structured persistence. Conversational logs alone aren't legible at 5 seconds.

**Build cost:** ~2-3 hours. Collection schema design + first writes from intake flow.

### F3: Intake Flow

**What it is:** Stateful Q&A sequence at first interaction. ~15-20 questions, dynamically next-questioned based on prior answers. Outputs populated personal memory record.

**Question shape:**
- Hard-coded openers: name, role, current company / project, what they want a CoS for
- Then dynamic: model generates next questions based on context built so far
- Open exit: "anything else important I should know?"
- Each answer parsed → written to personal memory collection in real-time
- Visible scratchpad shown to operator throughout (web UI or in conversational message)

**Why:** Aha #2 (substantive intake). The first 10 minutes IS the differentiator at first contact.

**Build cost:** ~4-6 hours. State machine + prompt design + visible-scratchpad UX.

### F4: Visible Memory Web View

**What it is:** Web page at `/agents/chief-of-staff/[operator-id]/memory` (or under a single-operator URL for v0 if multi-tenant isn't ready). Renders the operator's structured memory.

**Layout proposal:**
```
HEADER
  Your Chief of Staff Memory
  Last updated: [date]
  Imprint version: v0.1

§ Context (from intake)
  - Company: [...]
  - Role: [...]
  - Current goals: [...]
  - Working style: [...]

§ Active commitments
  - [from Friday Reviews]
  - [from sessions]

§ Slippage patterns observed
  - [synthesized from sessions]

§ Recent decisions
  - [from sessions]

§ Preferences
  - [tone, frequency, etc.]

[Footer: "Edit / Re-run intake / Export"]
```

**Why:** Aha #1. The page is what the demo video shows — the partner's "oh shit, this isn't a Custom GPT" moment.

**Build cost:** ~3-4 hours. Renders Tokenrip collection rows with grouping. Read-only for v0.

### F5: Friday Review Skill + Asset Template

**What it is:** A skill the operator can trigger ("let's do Friday Review") that walks through structured weekly synthesis and outputs a published Tokenrip asset.

**Flow:**
1. Agent pulls last week's commitments from personal memory.
2. Walks through each: "what happened with X?"
3. Operator narrates outcomes; agent captures into memory.
4. Agent identifies slippage patterns (commitments missed, recurring stalls).
5. Agent prompts for next week's commitments.
6. Synthesizes into structured asset: `friday-review-[date].md` published to Tokenrip with shareable URL.

**Asset template** (rendered):
```
# Friday Review — [date]
## Last week's commitments
- [...] → [outcome]
## What slipped, and why
- [pattern]
## Next week
- [commitments]
## Pattern note (optional)
- [observed across multiple weeks]
```

**Why:** Aha #3. Lock-in mechanism. The recurring artifact is the product.

**Build cost:** ~3-4 hours. Skill prompt + asset template + the integration with personal memory.

### F6: Cross-Harness Bootloader

**What it is:** Local command files for at least Claude Code that fetch the imprint at runtime. Same agent identity across mounting points.

**Components:**
- Claude Code: `.claude/commands/chief-of-staff.md` (mirrors engagement-agent pattern)
- MCP endpoint: existing `https://api.tokenrip.com/mcp` — confirm CoS imprint accessible
- Cursor: verify install pattern works (or note gap)

**Why:** Aha #1 (cross-harness) requires this to *actually work* in the demo. If only one harness is supported, the cross-harness beat doesn't ship.

**Build cost:** ~2-3 hours. Mostly proven from engagement-agent pattern; mainly a packaging exercise.

### F7: Shared Knowledge Layer (v0 — Bootstrap)

**What it is:** A `founder-patterns` Tokenrip collection seeded manually from Simon's existing Yoda session history. Patterns are anonymized, browsable.

**Schema (proposed):**
```
pattern_id (uuid)
pattern_text (text — the pattern statement, anonymized)
phase_tag (enum: pre-seed | seed | series-a | etc.)
context_tag (enum: fundraising | hiring | product | distribution | etc.)
source (string — "Simon's Yoda history" or "session-N" anonymized)
created_at (timestamp)
times_referenced (int)
```

**Bootstrap content:** ~10-15 patterns from Simon's existing Yoda sessions, manually anonymized and tagged.

**Why:** Aha #4 (shared pattern surfacing). Even if v0 surfacing is rare, the *collection* needs to exist for the agent to reference. Without it, the layered-memory differentiator is invisible.

**Build cost:** ~2-3 hours. Collection schema + manual seed of patterns from Simon's history.

### F8: `/agents/chief-of-staff` Landing Page

(Site work — see [[site-updates-for-yc-2026-05-01]] §P1.1.) Backend dependencies for the page to render properly:
- F1 imprint published (so version + asset URLs render)
- F2 + F4 personal memory and visible-memory view exist (for the demo screenshots)
- F5 Friday Review asset template exists (for the example artifact link)

---

## Build Tasks (Concrete)

Sequenced and sized.

### Saturday May 3

| Task | Owner | Hours | Depends on | Output |
|---|---|---|---|---|
| Port Yoda imprint → CoS persona asset (F1) | Simon | 2h | — | Asset published, accessible at Tokenrip URL |
| Design intake question flow + state machine (F3) | Simon | 2h | persona | Intake-flow asset draft |
| Set up personal memory collection schema (F2) | Simon | 1h | — | Collection live with first writes from test |
| Set up shared `founder-patterns` collection (F7) | Simon | 1h | — | Collection live, schema defined |
| Seed `founder-patterns` from Yoda history (F7) | Simon | 2h | collection | ≥10 patterns seeded |

### Sunday May 4

| Task | Owner | Hours | Depends on | Output |
|---|---|---|---|---|
| Implement intake flow (F3) | Simon | 3h | F1, F2 | Working intake; new operator can complete in 10-15 min |
| Build visible-memory web view (F4) | Simon | 3h | F2 | Page renders structured memory |
| Run intake on self (Simon dogfoods) | Simon | 1h | F3 | Personal memory record exists for demo |
| Build Friday Review skill (F5) | Simon | 2h | F1, F2 | Skill works; produces asset |
| Run first Friday Review (Simon) | Simon | 1h | F5 | Sample artifact for demo |

### Monday May 5

| Task | Owner | Hours | Depends on | Output |
|---|---|---|---|---|
| Bootloader for Claude Code + MCP (F6) | Simon | 2h | F1 | Install command works in 2 harnesses |
| Verify cross-harness mount (Claude Code → MCP/ChatGPT) | Simon | 1h | F6 | Same memory accessible from both |
| Record demo video | Both | 2h | F1-F7 | 2-3 min screen recording |
| Submit YC application | Simon | 1h | demo, [[../bd/yc-strategy]] | Application submitted |

### Through Friday May 9 (P1 backend extensions)

- Auto-triggered shared-pattern surfacing (currently manual prompt logic)
- Auto Friday Review trigger (calendar-aware)
- Memory edit UI on visible-memory view
- Second harness verification (Cursor)
- Bootstrap operators (Alek + 1-2 friendly dogfooders run intake; populate stats)
- Shared collection: 5-10 more patterns added from dogfooder sessions

---

## Bootstrapping Plan

For the YC video to feel real, the demo can't be a fabricated walkthrough. Real session data needs to exist by Mon May 5.

**Simon's bootstrap (by Mon morning):**
- Run intake on self → populates personal memory
- Run 2-3 substantive working sessions → adds context, commitments
- Run first Friday Review → produces asset
- ≥3 sessions worth of personal memory data visible on the demo

**Alek's bootstrap (by Mon morning if possible):**
- Run intake on self → second operator, shows multi-operator architecture works
- 1-2 sessions → second populated memory record
- Optional: run Friday Review

**Office Hours bootstrap (per [[site-updates-for-yc-2026-05-01]] §P0.3):**
- Simon and/or Alek run 2 office-hours sessions through the existing agent
- Stats on the page update from 0/0 to ≥2/≥2

---

## Open Design Questions

These need calls before/during the build. Default reasonable choice noted.

### Q1: How does the visible-memory view authenticate?

The page at `/agents/chief-of-staff/[operator-id]/memory` shows private data. Auth options:
- (a) Per-operator URL with a secret token (default, simplest for v0)
- (b) Tokenrip account login (requires session management; more work)
- (c) No auth, public — bad, leaks personal data

**Default: (a)** — operator-specific URL with a secret slug. Public-shareable for demos but not enumerable.

### Q2: How long is the intake?

The design brief says 5-10 min; experience suggests 15-20 questions hits the sweet spot.

**Default:** 15-18 questions. Drop-off measurement is v1; commit to length and instrument later.

### Q3: How does the agent surface shared patterns in v0?

The shared layer is seeded but not auto-surfacing in v0. Options:
- (a) Operator-prompted: "What patterns from other founders apply here?"
- (b) Periodic in-session: agent triggers based on tag matching (phase + context)
- (c) Hard-coded for the demo: the agent surfaces a pattern at a specific moment in the demo flow

**Default: (a) + (c)** — operator-prompted available, plus a hard-coded surfacing in the demo flow so the video shows it. (b) is v1.

### Q4: What's the Friday Review's input?

In v0 the operator manually triggers it. The agent walks through commitments. Open question: does the agent require the operator to recap, or does it pull commitments and start asking about each?

**Default:** Agent pulls commitments from personal memory and asks about each one in turn. Operator narrates outcomes; agent captures.

### Q5: What's the agent's name in v0?

The design brief flags this as open: "Chief of Staff" as the role; "Yoda" as the agent's name; possibly rebrand.

**Default for v0:** the agent is named "Chief of Staff." Drop "Yoda" from public-facing surfaces. The voice/imprint can still be Yoda's — port the content, drop the name. Yoda stays as Simon's private agent.

### Q6: What happens if the demo cross-harness mount fails?

Risk: bootloader works in Claude Code but ChatGPT-MCP has issues. Demo can't show cross-harness.

**Mitigation:** Test the cross-harness beat *before* recording. If only one harness works by Sunday night, the demo should still mount in two — even if the second is "Cursor" or another Anthropic-MCP-enabled tool. Worst case: cut the cross-harness beat from the demo and emphasize visible-memory + Friday Review more. Aha #1 still works through visible-memory alone.

---

## What This Doesn't Cover

Out of scope, flagged for follow-up:

- **Tooling tier billing.** Free for v0. Pricing model for tooling tiers to be locked in next-session deep-dive (per [[../bd/audience-led-gameplan]] §"Deal structures").
- **Editorial standards for imprints.** Required before public deploys; first creator deploys ([[../bd/audience-led-gameplan]] hard rules) ship after. Not a CoS-v0 blocker.
- **Multi-operator UX.** v0 is per-operator. Team / shared-context features defer.
- **"Build an agent" skill.** Per design brief §13: defer until 2-3 hand-built agents prove the architecture pattern. CoS is one of those proofs.
- **Inter-agent calls.** v0 doesn't include CoS calling other agents. v1+ once architecture supports it.

---

## Acceptance Criteria — v0 Ship

By Mon May 5 EOD:

- [ ] Imprint published as versioned Tokenrip assets (v0.1)
- [ ] Personal memory collection live with at least 2 operators (Simon + Alek, or Simon + 1)
- [ ] Visible-memory web view renders structured memory cleanly
- [ ] Intake flow runs end-to-end; new operator can complete in 10-20 min
- [ ] Friday Review skill works; produces published Tokenrip asset
- [ ] Bootloader install works in Claude Code + 1 other harness
- [ ] Same memory accessible from both harnesses (cross-harness verified)
- [ ] Shared `founder-patterns` collection live with ≥10 seeded patterns
- [ ] Demo video recorded showing F1-F7 in action, ≤3 min
- [ ] [[site-updates-for-yc-2026-05-01]] §P0.1 CoS preview tile ships pointing here
- [ ] [[site-updates-for-yc-2026-05-01]] §P1.1 landing page ships (or stub if delayed)
- [ ] YC application submitted with this as the demo

---

## Cross-References

- **The 14-day strategy and full design space:** [[chief-of-staff-launch-design-2026-04-27]]
- **Architectural foundation:** [[../product/tokenrip/mounted-agent-model]]
- **Site work that depends on this:** [[site-updates-for-yc-2026-05-01]] (§P0.1, §P1.1, §P0.3)
- **YC application reference:** [[../bd/yc-strategy]]
- **Active motion this proves:** [[../bd/audience-led-gameplan]]
- **Existing Yoda content to port from:** [[../agents/yoda/]] (persona, voice, methodology)
- **Engagement agent (architectural reference):** [[../agents/engagement-agent/]]
