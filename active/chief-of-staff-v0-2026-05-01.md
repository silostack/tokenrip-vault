# Chief of Staff v0 — Backend Work + Aha Moment Design

**Date**: 2026-05-01 (updated 2026-05-02 for team-scoped pivot)
**Build window**: Sat May 3 → Mon May 5 (v0 ship target); through Fri May 9 (full P1 surface)
**Goal**: Ship a team-scoped Chief of Staff agent that produces a clear "oh shit, wow" moment for a YC partner watching the demo video, with enough feature depth to survive 4-6 weeks of dogfooding without re-architecting.
**Source**: [[chief-of-staff-launch-design-2026-04-27]] (locked decisions; the 14-day sprint plan)
**Companion site work**: [[site-updates-for-yc-2026-05-01]] §P0.1 (CoS preview tile), §P1.1 (real landing page), §P0.3 (architecture mini-diagram on detail pages)

---

## What This Doc Is

The 2026-04-27 design brief locked the *what* (Chief of Staff as the hero, layered memory + Friday Review + intake, must-ship features). This doc answers two follow-up questions that emerged from the YC application planning:

1. **What makes this go "oh shit, wow"?** The 2026-04-27 brief had a 14-day sprint to ship substance. We need the v0 ship to *also* land an aha moment in a 2-3 minute YC demo video. That requires a sharper UX bet than the spec implied.

2. **What's the v0 feature set we can ship by Mon May 5 (4 days)** that produces the aha *and* survives 4-6 weeks of dogfooding without re-architecting?

### The Team-Scoped Pivot (2026-05-02)

The original spec was single-operator: one person, one memory, one agent. The pivot: **a single Chief of Staff imprint serves the whole team**, with layered memory that separates shared team context from each operator's private context. Simon and Alek both mount the same CoS. Each session draws on team-wide context *plus* operator-specific context, and the agent can reference what happened in another operator's session when relevant.

This is the cognitive abstraction nobody else has shipped. Custom GPTs are per-user. Claude Projects are per-workspace. Nothing has team context + private context + cross-session references in a single agent. The demo narrative becomes: **"the operating system for a two-person AI-native company."**

---

## The Aha Moments — Ranked

A YC partner watching a Custom GPT demo doesn't go "oh shit, wow." The architectural insight (mounted agents) is what makes Chief of Staff different — but the *insight* is invisible during a demo. Something specific has to make the partner feel the architecture.

Five candidate aha moments, ranked by impact-per-second-of-demo:

### Aha #1 — Layered Team Memory + Cross-Session Reference (the architectural aha)

**What the partner sees:** Simon asks the agent about a decision. The agent pulls team context (shared) + Simon's private context. Then: Alek mounts the same agent in a different harness. The agent draws on team context + Alek's private context — and says something like *"Simon mentioned in his session that he's leaning toward X for the YC pitch. Does that align with how you're thinking about the outreach sequence?"*

**Why it lands:** This is the moment where the layered-memory architecture becomes viscerally legible. No other agent has this — Custom GPTs are per-user, Claude Projects are per-workspace. Nobody has team + private + cross-session in a single agent. The partner sees three things at once: team context is real, private context is protected, and the agent is a *team member* with full context, not a per-operator chatbot.

**What it costs to build:** Three Tokenrip collections (`team_context`, `simon_private`, `alek_private`). Intake flow that writes to both team and personal. Agent prompt logic that reads team + active operator's private collection + optionally references items from other operators' sessions when relevant. Visible-memory web view with three-column layout (team | Simon | Alek).

**Status:** Highest priority. This IS the demo. Without it, CoS is just another personal AI assistant.

### Aha #2 — Visible Memory + Cross-Harness Mount (the portability aha)

**What the partner sees:** A clean, structured three-column view of "here's everything Chief of Staff knows" — team context in the center column, Simon's private context on the left, Alek's on the right. The partner can read the structured representation in 5 seconds. Then: the same agent, mounted in a different harness (Claude Code → ChatGPT or Cursor), with the *same memory* visible.

**Why it lands:** The three-column view makes the layered architecture concrete. The cross-harness mount proves it's not tied to one runtime. Together: "this is structurally different, not just a better prompt."

**What it costs to build:** A web view at `/agents/chief-of-staff/memory` that renders all three collections with role-based visibility. Plus working bootloader installs in 2+ harnesses (Claude Code minimum, plus one of: MCP-via-ChatGPT, Cursor).

**Status:** Required. Flows directly from Aha #1 — the three-column view is the visible proof of the layered architecture.

### Aha #3 — Substantive Intake (the UX aha)

**What the partner sees:** The agent doesn't ask "tell me about your business" → 3 questions → "I'm ready." It asks 15-20 *substantive* questions — first about the team/company context (shared), then about the operator's personal role, working style, and goals (private). At the end, the operator can see exactly what the agent absorbed, sorted into team vs. personal columns.

**Why it lands:** Most "personal AI" experiences feel either thin (system prompt + memory feature flag) or invasive (hand over your whole inbox). A substantive structured intake that visibly writes to both team and personal memory reads as "this agent understands the difference between shared context and my stuff."

**What it costs to build:** An intake state machine with two phases: team-context questions (skipped if team context already populated by another operator) + personal-context questions. Output: populated records in both `team_context` and `[operator]_private` collections.

**Status:** Required. The intake IS the differentiator at first contact.

### Aha #4 — Team Friday Review (the workflow aha)

**What the partner sees:** A structured weekly artifact covering the whole team. Simon's commitments and Alek's commitments → outcomes → slippage → patterns observed → next week's commitments. Rendered as a Tokenrip asset with a shareable URL. Either operator can trigger it; the agent has full context on both.

**Why it lands:** A team ritual produced by an agent that has the *full team context* is categorically different from a single-user weekly check-in. The partner watching this thinks "that's the operating system for a small team."

**What it costs to build:** Friday Review skill that pulls from `team_context` + both operators' private collections. Asset template with team-scoped sections. Triggered by either operator.

**Status:** Required. This is the "what's the product?" answer.

### Aha #5 — The "It Already Knows You" Moment (the persistence aha)

**What the partner sees:** Operator returns for session 2. Agent picks up exactly where they left off: "Last time you committed to X by Friday — how did it go?" Plus team-level awareness: "Alek updated the creator list since your last session — want a summary?"

**Why it lands:** Structured, persistent, team-aware continuity. No other agent does this.

**What it costs to build:** Falls out of Aha #1 (layered memory) + Aha #4 (Friday Review). If those work, this is automatic.

**Status:** Free with #1 and #4. Don't engineer separately, but make sure the demo video shows it.

---

## The Aha Cuts: What's Not in v0

Things from the 2026-04-27 brief or this doc that are tempting but cut for v0:

- **Auto-triggered Friday Reviews** — the agent proactively prompting on Fridays is v1. v0 is operator-initiated.
- **Memory edit UI** — the operator can *read* the structured memory but can't edit it via UI. Manual fixes via re-running intake or asking the agent to update. v1 ships an edit pane.
- **Email / Slack / calendar integrations** — agent only operates in the conversational surface for v0. No external triggers.
- **Shared knowledge layer (founder-patterns)** — the original spec had a `founder-patterns` collection seeded from Yoda history. Deferred from v0. The team-scoped architecture is a stronger moat to show: real multi-operator layered memory beats hand-seeded pattern trivia. If time allows, add 5-10 bootstrap patterns, but this is NOT required for the demo.
- **Inter-agent calls** — Chief of Staff doesn't call other agents in v0.
- **Sophisticated pattern detection** — automatic pattern detection from session content is v1.
- **Pricing tiers / paid features** — v0 is free.
- **Rich rendering of imprint changelogs** — version is shown ("v0.1") but a full diffable changelog UI is v1.
- **A second hero agent** — Writing Partner / Editor / etc. defer per the launch design brief.
- **More than 2 operators** — v0 is Simon + Alek. Expanding to more operators is v1.

---

## Demo Flow for YC Video (~3 min)

This is what the YC application's demo video shows. The team-scoped architecture is the throughline — every beat reinforces "this agent serves the team, not just one person."

| Time      | What viewer sees                                                                                                                                                                                                                                                                                                              | What backend supports it                                                                                                                                                 |                                                                                                                                                                                                               |                                                                |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 0:00-0:15 | "This is Chief of Staff — a mounted agent on Tokenrip. One agent, two operators, layered memory." Open `/agents/chief-of-staff`. Show 3-layer architecture diagram.                                                                                                                                                           | Live landing page with Diagram A + team-memory diagram, deployed per [[site-updates-for-yc-2026-05-01]] §P1.1.                                                           |                                                                                                                                                                                                               |                                                                |
| 0:15-0:30 | "Let me mount it." Run install command in Simon's terminal (Claude Code). 5-second setup. Agent ready.                                                                                                                                                                                                                        | Bootloader command file; CLI install pattern (proven w/ engagement agent).                                                                                               |                                                                                                                                                                                                               |                                                                |
| 0:30-1:00 | Simon asks a strategic question. Agent draws on team context + Simon's private context. Visible: the agent referencing both layers. "Based on our YC timeline [team] and your content schedule [Simon-private]..."                                                                                                            | Three collections read: `team_context` + `simon_private`. Agent prompt merges both. **AHA #1 (layered memory).**                                                         |                                                                                                                                                                                                               |                                                                |
| 1:00-1:30 | Cut to Alek's machine. Different harness (Cursor, or ChatGPT-MCP). Same agent. Alek asks about outreach priorities. Agent draws on team context + Alek's private context. Then: *"Simon mentioned in his session that the YC pitch is leading with the cloud-agent ceiling. You might want to align the outreach messaging."* | Same imprint, `team_context` + `alek_private`. Cross-session reference from `simon_private` (flagged for cross-session surfacing). **AHA #1 (cross-session reference).** |                                                                                                                                                                                                               |                                                                |
| 1:30-2:00 | Open visible-memory pane in browser: `tokenrip.com/agents/chief-of-staff/memory`. Three-column view: Team Context                                                                                                                                                                                                             | Simon's Context                                                                                                                                                          | Alek's Context. Walk through: "team goals, YC timeline, company context in the center. Simon's personal commitments and working patterns on the left. Alek's outreach pipeline and preferences on the right." | Three-collection web view with role-based columns. **AHA #2.** |
| 2:00-2:30 | "Friday Review." Either operator triggers. Agent walks through BOTH operators' commitments → outcomes → slippage → team-level patterns → next week. Asset published to Tokenrip with shareable URL.                                                                                                                           | Friday Review skill reading all three collections. Team-scoped asset template. **AHA #4.**                                                                               |                                                                                                                                                                                                               |                                                                |
| 2:30-2:50 | "One agent. Two operators. Three memory layers. Any harness. Mount your team's at tokenrip.com/agents/chief-of-staff."                                                                                                                                                                                                        | Mount CTA on landing page.                                                                                                                                               |                                                                                                                                                                                                               |                                                                |

**Total: ~2:50.** The layered-memory beats (0:30-1:30) are the most important and shouldn't be rushed.

**Production notes:**
- Demo runs as a real session, not a fabricated walkthrough. Simon's and Alek's actual memory records are what's shown.
- Voiceover or on-screen captions; not a face-cam demo.
- Screen recording at high resolution; render the visible-memory view in light mode for readability.
- The cross-session reference beat (1:00-1:30) is the "oh shit" moment. Pause slightly to let it land.

---

## v0 Feature Set (Must Ship)

The ship list, with what each feature does and how it maps to the aha moments.

### F1: Imprint Asset Bundle

**What it is:** The Chief of Staff "brain" — published as Tokenrip assets, versioned, fetchable.

**Components:**
- `chief-of-staff/persona` — voice, tone, methodology (port from existing Yoda imprint per design brief §7)
- `chief-of-staff/intake-flow` — the structured intake skill (team-aware)
- `chief-of-staff/friday-review` — the weekly ritual skill (team-scoped)
- `chief-of-staff/methodology` — the heuristics for how the agent thinks (slippage detection, pattern recognition, accountability framing)
- `chief-of-staff/memory-schema` — structure of all three memory collections
- `chief-of-staff/cross-session-rules` — when and how to surface cross-operator context

**Build cost:** ~3-5 hours. Bulk of work is porting Yoda content; the schemas are derivable from the design brief.

### F2: Layered Memory Collections (Three Collections)

**What it is:** Three Tokenrip collections that separate team context from operator-specific context.

**Collection 1: `team_context`** (shared, both operators read/write)
```
field_type (enum: company | goal | timeline | decision | resource | process)
value (text or structured JSON)
source_operator (string — who wrote it)
source_session (asset_id)
created_at (timestamp)
last_referenced_at (timestamp)
status (enum: active | archived | superseded)
```

**Collection 2: `simon_private`** (only Simon's sessions read/write; agent can reference for cross-session surfacing)
```
operator_id: "simon"
field_type (enum: context | goal | commitment | decision | slippage | preference | working_style)
value (text or structured JSON)
source_session (asset_id)
created_at (timestamp)
last_referenced_at (timestamp)
status (enum: active | archived | superseded)
cross_session_flag (boolean — eligible for cross-session surfacing to other operators)
```

**Collection 3: `alek_private`** (only Alek's sessions read/write; same schema as above)
```
operator_id: "alek"
[same schema as simon_private]
```

**Cross-session surfacing rule (v0 default):** Items in one operator's private collection are NOT automatically visible to the other operator. The agent may *reference* them in the other operator's session only when: (a) the item is flagged `cross_session_flag: true`, OR (b) the item is directly relevant to the active operator's current question AND the agent judges the reference is helpful. References are paraphrased, not quoted verbatim.

**Build cost:** ~3-4 hours. Three collection schemas + read/write logic in the agent prompt + cross-session surfacing rules.

### F3: Intake Flow (Operator-Aware)

**What it is:** Stateful Q&A sequence at first interaction, with two phases.

**Phase 1 — Team context** (runs only if `team_context` is empty or thin):
- Company name, stage, what you're building
- Current team (who does what)
- Active goals (company-level, next 90 days)
- Key timelines (fundraising, product milestones, deadlines)
- Decision-making style (how decisions get made between co-founders)
- 8-12 questions, dynamically next-questioned

**Phase 2 — Personal context** (always runs for each new operator):
- Your role, what you own
- Working style (when you work, how you think, how you prefer feedback)
- Personal goals (distinct from company goals)
- Current commitments and deadlines
- Blind spots or patterns you want surfaced
- 8-12 questions, dynamically next-questioned

**If team context already exists** (second operator onboarding): Phase 1 is skipped or reduced to a confirmation ("Here's what I know about the team from Simon's intake — anything to add or correct?"). Phase 2 runs in full.

**Each answer parsed → written to the appropriate collection** (`team_context` or `[operator]_private`) in real-time. Visible scratchpad shown to operator throughout.

**Build cost:** ~5-7 hours. State machine + prompt design + dual-phase logic + visible-scratchpad UX.

### F4: Visible Memory Web View (Three-Column)

**What it is:** Web page at `/agents/chief-of-staff/memory` that renders all three collections in a structured three-column layout.

**Layout:**

```
HEADER
  Chief of Staff — Team Memory
  Last updated: [date]
  Imprint version: v0.1
  Operators: Simon, Alek

┌─────────────────────┬─────────────────────┬─────────────────────┐
│   TEAM CONTEXT      │   SIMON             │   ALEK              │
│   (shared)          │   (private)         │   (private)         │
├─────────────────────┼─────────────────────┼─────────────────────┤
│ § Company           │ § Role & ownership  │ § Role & ownership  │
│   - [from intake]   │   - [from intake]   │   - [from intake]   │
│                     │                     │                     │
│ § Active goals      │ § Personal goals    │ § Personal goals    │
│   - [company-level] │   - [Simon's]       │   - [Alek's]        │
│                     │                     │                     │
│ § Key timelines     │ § Commitments       │ § Commitments       │
│   - YC: May 5      │   - [from reviews]  │   - [from reviews]  │
│   - a16z: TBD      │                     │                     │
│                     │ § Slippage patterns │ § Slippage patterns │
│ § Team decisions    │   - [observed]      │   - [observed]      │
│   - [logged]        │                     │                     │
│                     │ § Working style     │ § Working style     │
│ § Resources         │   - [preferences]   │   - [preferences]   │
│   - [shared docs]   │                     │                     │
└─────────────────────┴─────────────────────┴─────────────────────┘

[Footer: "Re-run intake / Export"]
```

**Visibility scoping (v0 default):** The web view shows all three columns to both operators. Private context is visible to its owner via the web view — but the *agent* only accesses the active operator's private collection during a session (plus cross-session references per F2 rules). The web view is a god-view for transparency; the agent's session behavior is scoped.

**Auth:** Per-operator URL with a secret token (same as original spec).

**Build cost:** ~4-5 hours. Renders three Tokenrip collections with column layout and grouping. Read-only for v0.

### F5: Friday Review Skill + Asset Template (Team-Scoped)

**What it is:** A skill either operator can trigger ("let's do Friday Review") that walks through the whole team's structured weekly synthesis.

**Flow:**
1. Agent pulls commitments from `team_context` (team goals/timelines) + both operators' private collections (personal commitments).
2. Walks through each operator's commitments: "Simon, what happened with X?" / "Alek, how did the outreach go?"
3. Narrated outcomes captured back into memory.
4. Agent identifies team-level slippage patterns (misalignment, recurring stalls, things falling between operators).
5. Prompts for next week's commitments (both team-level and personal).
6. Synthesizes into structured asset: `friday-review-[date].md` published to Tokenrip with shareable URL.

**Asset template** (rendered):

```
# Friday Review — [date]
## Team commitments
- [...] → [outcome]

## Simon
### Last week's commitments
- [...] → [outcome]
### What slipped, and why
- [pattern]
### Next week
- [commitments]

## Alek
### Last week's commitments
- [...] → [outcome]
### What slipped, and why
- [pattern]
### Next week
- [commitments]

## Team patterns
- [observed across both operators / multiple weeks]

## Alignment check
- [anything where Simon and Alek's priorities or assumptions diverged]
```

**Trigger:** Either operator can initiate. If only one operator is present, the agent reviews that operator's commitments in full and the other operator's commitments at a summary level ("Alek committed to X — I'll ask him about it when he's on next, or you can update me if you know").

**Build cost:** ~4-5 hours. Skill prompt + asset template + integration with all three collections + team-scoped synthesis logic.

### F6: Cross-Harness Bootloader

**What it is:** Local command files for at least Claude Code that fetch the imprint at runtime. Same agent identity across mounting points. Operator identity passed at mount time.

**Components:**
- Claude Code: `.claude/commands/chief-of-staff.md` (mirrors engagement-agent pattern). Includes operator ID (hardcoded per machine for v0).
- MCP endpoint: existing `https://api.tokenrip.com/mcp` — confirm CoS imprint accessible with operator-ID header.
- Cursor: verify install pattern works (or note gap).

**Operator identification (v0):** Hardcoded in the bootloader config. Simon's machine → `operator_id: simon`. Alek's machine → `operator_id: alek`. No dynamic auth for v0 — just a config value that tells the agent which private collection to use.

**Build cost:** ~2-3 hours. Mostly proven from engagement-agent pattern; mainly a packaging exercise + operator-ID plumbing.

### F7: Cross-Session Reference Logic

**What it is:** The prompt logic and collection-reading rules that enable the agent to reference one operator's context in another operator's session.

**Behavior:**
- On first turn of each session, agent reads `team_context` + active operator's private collection.
- Agent also scans the other operator's private collection for items with `cross_session_flag: true` OR items updated since the active operator's last session.
- If relevant cross-session items exist, agent leads with a brief reference: *"Since your last session, [other operator] updated [X]. Relevant to what you're working on?"*
- Frequency (v0 default): lead-with on first turn only. Mid-session cross-references only when directly relevant to the active question.

**What gets flagged for cross-session surfacing:**
- Decisions that affect both operators
- Timeline changes
- Strategic pivots or priority shifts
- Explicit flags ("tell Alek about this" or "Simon should know")

**Build cost:** ~2-3 hours. Prompt logic + collection query at session start + relevance filtering.

### F8: `/agents/chief-of-staff` Landing Page

(Site work — see [[site-updates-for-yc-2026-05-01]] §P1.1.) Backend dependencies for the page to render properly:
- F1 imprint published (so version + asset URLs render)
- F2 all three collections exist (for the three-column demo screenshots)
- F4 visible-memory three-column view exists
- F5 Friday Review asset template exists (for the example artifact link)

---

## Build Tasks (Concrete)

Sequenced and sized. Compared to the single-player spec, the team-scoped version adds ~9 hours of work, primarily in F2 (three collections vs. one), F3 (dual-phase intake), F4 (three-column view vs. single-column), F5 (team-scoped review), and F7 (cross-session logic).

### Saturday May 3

| Task | Owner | Hours | Depends on | Output |
|---|---|---|---|---|
| Port Yoda imprint → CoS persona asset (F1) | Simon | 2h | — | Asset published, accessible at Tokenrip URL |
| Design intake question flow — both phases (F3) | Simon | 2h | persona | Intake-flow asset draft with team + personal phases |
| Set up three memory collection schemas (F2) | Simon | 2h | — | `team_context`, `simon_private`, `alek_private` live |
| Design cross-session reference rules (F7) | Simon | 1h | F2 | Rules documented + prompt logic drafted |
| Simon runs intake (F3) — first operator | Simon | 1h | F2, F3 | Team context + Simon's private context populated |

### Sunday May 4

| Task | Owner | Hours | Depends on | Output |
|---|---|---|---|---|
| Implement intake flow — dual-phase (F3) | Simon | 3h | F1, F2 | Working intake; handles first-operator (full) and second-operator (team-confirmation + personal) |
| Build visible-memory three-column web view (F4) | Simon | 4h | F2 | Page renders all three collections in columns |
| **Alek runs intake (F3) — second operator** | **Alek** | **1h** | F3 | Team context confirmed/augmented + Alek's private context populated |
| Build Friday Review skill — team-scoped (F5) | Simon | 3h | F1, F2 | Skill works; reads all three collections; produces team-scoped asset |
| Run first Friday Review (either operator) | Simon | 1h | F5 | Sample team artifact for demo |

### Monday May 5

| Task | Owner | Hours | Depends on | Output |
|---|---|---|---|---|
| Bootloader for Claude Code + MCP with operator-ID (F6) | Simon | 2h | F1, F7 | Install command works in 2 harnesses with operator identification |
| Implement cross-session reference logic (F7) | Simon | 2h | F2, F6 | Agent references other operator's updates on first turn |
| Verify cross-harness mount (Claude Code → MCP/ChatGPT) | Simon | 1h | F6 | Same memory accessible from both; operator-ID scoping works |
| Record demo video | Both | 2h | F1-F7 | ~3 min screen recording per demo flow above |
| Submit YC application | Simon | 1h | demo, [[../bd/yc-strategy]] | Application submitted |

### Through Friday May 9 (P1 backend extensions)

- Auto Friday Review trigger (calendar-aware)
- Memory edit UI on visible-memory view
- Second harness verification (Cursor)
- Shared knowledge layer bootstrap (founder-patterns collection — deferred from v0 core, add if time permits)
- Bootstrap additional operators (1-2 friendly dogfooders run intake)
- Cross-session reference tuning (frequency, relevance threshold)

---

## Bootstrapping Plan

For the YC video to feel real, the demo can't be a fabricated walkthrough. Real session data from BOTH operators needs to exist by Mon May 5.

**Simon's bootstrap (by Sunday evening):**
- Run intake on self → populates `team_context` + `simon_private`
- Run 2-3 substantive working sessions → adds context, commitments, decisions
- Team context should be rich by end of Saturday from Simon's intake

**Alek's bootstrap (REQUIRED by Sunday — not optional):**
- Run intake on self → confirms/augments `team_context` + populates `alek_private`
- The second-operator intake experience IS part of the demo (shows the "team context already exists, just adding personal" flow)
- 1-2 substantive sessions → adds outreach context, commitments
- Run Friday Review together (or separately) → produces team-scoped artifact

**Why Alek's intake is required (not optional):**
The team-scoped architecture is the aha. If only Simon has memory records, the three-column view has two empty columns. The cross-session reference beat can't happen. The demo falls back to "personal AI assistant" — which is the old spec and doesn't differentiate.

**Office Hours bootstrap (per [[site-updates-for-yc-2026-05-01]] §P0.3):**
- Simon and/or Alek run 2 office-hours sessions through the existing agent
- Stats on the page update from 0/0 to ≥2/≥2

---

## Open Design Questions

These need calls before/during the build. Default reasonable choice noted.

### Q1: Visibility scoping — what can each operator see?

The three-column web view shows everything. But during a *session*, what does the agent reveal?

- (a) Agent only accesses active operator's private collection + team context. No cross-session references. (Strictest privacy.)
- (b) Agent accesses active operator's private + team context, and can *reference* other operator's flagged items. (Default.)
- (c) Agent has full read access to all three collections in every session. (Maximum context, minimum privacy.)

**Default: (b).** The agent is transparent about team context and the active operator's private context. Cross-session references from the other operator are paraphrased, not quoted, and limited to flagged items or clearly relevant updates. This preserves the "private context is private" principle while enabling the cross-session aha moment.

### Q2: How do dual-layer items get written?

Some information belongs in both team context and personal context (e.g., "we're applying to YC by May 5" is team, but "I'm drafting the application" is Simon-personal).

- (a) Intake explicitly asks "is this about the team or about you?" for ambiguous answers.
- (b) Agent classifies automatically based on content.
- (c) Agent writes to team context by default and copies personally-relevant items to the operator's private collection as references.

**Default: (b) with (a) as fallback.** The agent classifies most items automatically (company-level → team, role-specific → personal). For ambiguous items, it asks. The intake should feel smooth, not bureaucratic.

### Q3: Second-operator intake — how much team context gets confirmed?

When Alek runs intake after Simon has already populated team context:

- (a) Full team-context review: "Simon said X about the company. Agree, disagree, or add?"
- (b) Summary + delta: "Here's what I know about the team. Anything to add or correct?" (one question)
- (c) Skip team, go straight to personal.

**Default: (b).** One-question team confirmation, then straight to personal. Respects Alek's time while ensuring he has a chance to correct or augment.

### Q4: Operator identity — how does the agent know who's talking?

For v0, the agent needs to know whether it's Simon or Alek to select the right private collection.

- (a) Hardcoded in the bootloader config (Simon's machine → simon, Alek's machine → alek). Simplest.
- (b) Agent asks "who am I speaking with?" at session start.
- (c) Tokenrip account login with operator-ID resolution.

**Default: (a).** Hardcoded operator ID in the bootloader. This is a v0 shortcut — two operators, two machines, no ambiguity. Multi-operator auth is v1.

### Q5: Cross-session reference frequency — how often?

- (a) Lead-with: first turn of each session includes any relevant updates from the other operator. Then quiet unless directly relevant.
- (b) Periodic: agent checks for cross-session relevance every 3-5 turns.
- (c) Only when explicitly asked ("what did Simon say about X?").

**Default: (a).** Lead-with on first turn captures the "oh shit" moment. Mid-session references only when the operator's question directly relates to something the other operator discussed. Avoids feeling invasive.

### Q6: Friday Review trigger — who can initiate?

- (a) Either operator can trigger a Friday Review covering the full team.
- (b) Only Simon (as primary accountability holder) can trigger.
- (c) Both must be present (sync session).

**Default: (a).** Either operator triggers it. If only one is present, the agent reviews that operator's commitments in full and summarizes the other's at team level. Sync reviews are ideal but shouldn't be required — two busy co-founders won't always be available at the same time.

### Q7: What's the agent's name in v0?

The design brief flags this as open: "Chief of Staff" as the role; "Yoda" as the agent's name; possibly rebrand.

**Default for v0:** the agent is named "Chief of Staff." Drop "Yoda" from public-facing surfaces. The voice/imprint can still draw from Yoda's methodology — port the content, drop the name. Yoda stays as Simon's private agent in a separate context.

### Q8: What happens if the demo cross-harness mount fails?

Risk: bootloader works in Claude Code but ChatGPT-MCP has issues. Demo can't show cross-harness.

**Mitigation:** Test the cross-harness beat *before* recording. If only one harness works by Sunday night, the demo should still mount in two — even if the second is Cursor or another MCP-enabled tool. Worst case: cut the cross-harness beat from the demo and emphasize the three-column memory + cross-session reference more. Those beats work even in a single harness.

---

## Build Cost Comparison

| Component | Single-player (original) | Team-scoped (this spec) | Delta |
|---|---|---|---|
| F1: Imprint bundle | 3-5h | 3-5h | +0 (add cross-session-rules asset) |
| F2: Memory collections | 2-3h (1 collection) | 3-4h (3 collections) | +1h |
| F3: Intake flow | 4-6h | 5-7h | +1-2h (dual-phase) |
| F4: Visible memory view | 3-4h (single-column) | 4-5h (three-column) | +1h |
| F5: Friday Review | 3-4h | 4-5h (team-scoped) | +1h |
| F6: Bootloader | 2-3h | 2-3h | +0 (add operator-ID) |
| F7: Cross-session logic | — | 2-3h | +2-3h (new) |
| F8: Landing page | backend deps only | backend deps only | +0 |
| **Total** | **~20-28h** | **~26-35h** | **~+8h** |

The delta is ~9 hours, concentrated in Sat-Sun. The return: the demo narrative shifts from "personal AI assistant" (crowded) to "team operating system with layered memory" (nobody else has this).

---

## What This Doesn't Cover

Out of scope, flagged for follow-up:

- **Tooling tier billing.** Free for v0. Pricing model for tooling tiers to be locked in next-session deep-dive (per [[../bd/audience-led-gameplan]] §"Deal structures").
- **Editorial standards for imprints.** Required before public deploys; first creator deploys ([[../bd/audience-led-gameplan]] hard rules) ship after.
- **More than 2 operators.** v0 is Simon + Alek only. Expanding to N operators requires dynamic collection creation, operator auth, and privacy controls.
- **"Build an agent" skill.** Defer until 2-3 hand-built agents prove the architecture pattern.
- **Inter-agent calls.** v0 doesn't include CoS calling other agents.
- **Shared knowledge layer (founder-patterns).** Deferred from v0 core. The team-scoped layered memory is the architecture moat to show — it's real, functional, and unique. Shared patterns across unrelated operators is a v1 feature.

---

## Acceptance Criteria — v0 Ship

By Mon May 5 EOD:

- [ ] Imprint published as versioned Tokenrip assets (v0.1), including cross-session-rules
- [ ] Three memory collections live (`team_context`, `simon_private`, `alek_private`)
- [ ] Both operators have completed intake (Simon + Alek)
- [ ] Visible-memory three-column web view renders all three collections cleanly
- [ ] Intake flow handles first-operator (full) and second-operator (team-confirmation + personal)
- [ ] Friday Review skill works team-scoped; produces published Tokenrip asset covering both operators
- [ ] Bootloader install works in Claude Code + 1 other harness, with operator-ID scoping
- [ ] Same memory accessible from both harnesses (cross-harness verified)
- [ ] Cross-session reference works: Alek's session surfaces relevant updates from Simon's sessions (and vice versa)
- [ ] Demo video recorded showing team-scoped flow, ≤3 min
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
