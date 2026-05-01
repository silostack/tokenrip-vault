# Chief of Staff Agent

**Status**: designing
**Created**: 2026-04-27
**Last touched**: 2026-04-28

## Thesis

The first agent on Tokenrip's agent surface should be a **Chief of Staff** — an agent that validates every layer of the mounted agent model (imprint + memory + harness) and produces a differentiator no wrapper-class agent can match. The moat compounds with use: the shared `founder-patterns` collection grows with every session, and memory makes the product harder to leave.

The distribution strategy: **a YC Office Hours "lure" skill that rolls into the CoS naturally through accumulated memory.** The lure and the CoS are the same agent at different depths. Session 1 is the lure. Session 10 is the CoS. No mode switch, no upgrade prompt.

## Evolution

- **2026-04-28**: Public vocabulary locked. Architecture is unchanged; what was internally called "cloud agent" with a "brain" is now publicly **a mounted agent with an imprint**. Chief of Staff is the first imprint Tokenrip publishes — Yoda-class, exercises every layer (imprint + memory + harness + shared knowledge). The CoS imprint validates the architecture for the rest of the imprint catalog (Writing Partner, Recruiting Partner, Methodology-as-a-Service variants). See [[mounted-agent-model]] 2026-04-28 entry for the full naming rationale.

- **2026-04-27 (session 2)**: Major design reframe. Key decisions:
  - **Lure is a skill, not a persona.** "YC Office Hours" methodology, not "AI Garry Tan." The value is the interrogation framework, not a character. Eliminates IP risk, ships cleaner.
  - **Custom GPT is the primary distribution surface.** GPT Store + shareable link = broadest reach, lowest friction. Claude Code skill and MCP server ship in parallel for developer audience.
  - **Callable from anywhere via hybrid harness model.** Three surfaces (Custom GPT, Claude Code skill, MCP server) all hit the same Tokenrip imprint and memory backend. Update the imprint asset, every surface gets the update.
  - **Anonymous memory from session 1.** Custom GPT auto-registers an anonymous Tokenrip agent on first OAuth. User gets persistent memory without knowing what Tokenrip is. They discover the platform when they want more.
  - **No intake flow.** The opening question IS the intake: "What stage are you at, and how do you know there's demand?" Context builds through interrogation, not a form.
  - **Shared knowledge layer ships day one, self-gates.** Imprint cites cross-user patterns when search returns results. Empty collection = no citations. No premature complexity.

- **2026-04-27 (session 1)**: Emerged from "pressure-test the marketplace plan" → "the marketplace play was the wrong wedge — substance is." Path C decision (persona is marketing, infrastructure is substance). Locked: Chief of Staff hero + lure. 14-day sprint ships substance; 6-8 weeks validates stickiness.

## Architecture

### Two products, one backend, three harness surfaces

**Backend (lives on Tokenrip):**
- **Imprint** — 4 versioned Tokenrip assets: core methodology, stage-specific question banks, teardown template, accountability framework
- **Memory** — per-user Tokenrip collections: business-context (single-row snapshot), session-log (append-only), decision-log (append-only)
- **Shared knowledge layer** — platform-wide patterns collection, anonymized, self-gating (only surfaces when data exists)

**Harness surfaces (launch priority order):**

| Surface | Audience | Memory | Distribution |
|---------|----------|--------|-------------|
| **Custom GPT** | Broadest — anyone with ChatGPT | Full (via Tokenrip actions + OAuth) | GPT Store + shareable link |
| **Claude Code skill** | Developers, power users | Full (via existing Tokenrip CLI auth) | `/install` command |
| **MCP server** | Any MCP client (Codex, Cursor, Cowork) | Full (via MCP tools) | Add to existing Tokenrip MCP server |

All surfaces hit the same imprint assets and memory collections. Imprint updates propagate to every surface instantly.

### Imprint Assets

**Asset 1: Core methodology**
- Interaction pattern: diagnose stage → interrogate → teardown → artifact
- Persona rules: direct, confrontational, no hand-holding, no compliments without substance
- Memory-aware behavior: reference prior sessions, track accountability, call out avoidance
- Graceful degradation: run office hours flow stateless when memory unavailable

**Asset 2: Stage-specific question banks**
- Pre-idea: demand validation, problem specificity, founder-market fit
- Pre-revenue: ICP clarity, distribution, willingness to pay, competitive positioning
- Post-revenue: unit economics, what breaks at scale, hiring, fundraising readiness
- Fundraising: the pitch itself, objection handling, what VCs will actually ask

**Asset 3: Teardown template**
- Structured verdict format: stage assessment, strengths, critical gaps, what to do this week, what to stop doing
- Designed for screenshots and sharing
- Published as a Tokenrip asset with persistent URL

**Asset 4: Accountability framework (CoS layer)**
- How to read decision logs and surface patterns
- When to push back vs. when to ask
- Avoidance detection: topic disappeared, deadline passed without mention, ICP keeps shifting

### Memory Schema

**Collection 1: `business-context`** (single-row, updated each session)
- Stage, what they're building, ICP/target market, current traction, key constraint, last updated

**Collection 2: `session-log`** (append-only, one row per session)
- Date, stage at time, key questions asked, gaps surfaced, commitments made, teardown asset ID

**Collection 3: `decision-log`** (append-only, one row per decision)
- Date, decision, reasoning given, open risks, outcome (updated later)

**Collection 4: `patterns`** (shared, platform-wide)
- Stage, pattern observed, frequency, anonymized source count

### Custom GPT Identity Flow

1. User opens GPT (GPT Store link or shared URL)
2. First action triggers Tokenrip OAuth → anonymous agent auto-created
3. Token persists across sessions → GPT knows which Tokenrip agent to read/write
4. User never sees Tokenrip until they want to (claim account for cross-device, access artifacts, use CoS from another surface)

## Interaction Design

**Session 1 (The Lure): YC Office Hours**
1. "What stage are you at, and how do you know there's demand?"
2. Adaptive interrogation: 3-5 hard questions based on stage, one at a time
3. Teardown: structured verdict — what's strong, what's weak, what the founder is avoiding
4. Artifact: shareable summary published as Tokenrip asset (screenshot fuel)
5. Behind the scenes: anonymous agent registered, session data written to memory

**Session 2+ (The Bridge):**
"Last time you said you had no distribution strategy. What's changed?"
Same energy, but it knows you. Picks up where it left off. Won't let you dodge what you dodged last time.

**Session 5+ (The Chief of Staff):**
- "You've pivoted your ICP twice in three weeks. What's driving that?"
- "You said you'd validate pricing by this week. Did you?"
- "Three sessions ago you were worried about churn. You haven't mentioned it since. Resolved or avoided?"
- Shared patterns surface: "7 out of 10 founders at your stage who couldn't answer this question ended up pivoting within 3 months."

No mode switch. No upgrade prompt. The product gets harder to leave because it knows too much.

## Sequencing

**Week 1: The Lure**
1. Write 4 imprint assets, publish to Tokenrip
2. Design memory collections schema
3. Set up Tokenrip OAuth for Custom GPT (anonymous auto-registration)
4. Build Custom GPT — bootloader system prompt, wire actions to Tokenrip API
5. Test end-to-end: first session → memory write → second session → memory read
6. Publish to GPT Store
7. Parallel: build Claude Code skill + add tools to existing MCP server

**Week 2-3: Let it run**
8. Monitor: session 2 return rate, stage distribution, drop-off points
9. Shared patterns collection starts accumulating (self-gating)
10. Iterate imprint assets from Tokenrip — all surfaces update instantly

**Week 3-4: CoS emerges**
11. Publish accountability framework asset (imprint asset 4)
12. Users with 3+ sessions start getting CoS experience naturally
13. Teardown artifact evolves: session 1 is standalone verdict, session 5+ includes "since last time" tracking

## Key Design Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Lure format | Skill/methodology, not persona | Eliminates IP risk, ships cleaner, value is the framework not the character |
| Primary surface | Custom GPT (GPT Store) | Broadest reach, lowest friction, publicly discoverable |
| Memory on first use | Anonymous auto-registration | Zero friction, memory from session 1, claim account later |
| Intake flow | None — opening question IS the intake | Context builds through interrogation, not a form |
| Shared layer timing | Ship day one, self-gating | Imprint checks for patterns, surfaces when data exists, silent when empty |
| Lure → CoS transition | No transition — same product, deeper memory | No mode switch, no upgrade prompt, natural progression |

## Open Questions

- Custom GPT naming — "YC Office Hours," "Startup Office Hours," or something else? The name IS the GPT Store discovery strategy.
- Tokenrip OAuth for Custom GPTs — technical feasibility of anonymous auto-registration via OAuth flow. Needs validation.
- Shared pattern contribution consent — automatic, opt-in, or opt-out? Design decision with trust implications.
- Pricing — v1 free? When does paid tier make sense? What's the trigger?
- Creator pathway — if this gains traction, how do we approach Garry Tan (or others) to publish their own methodology through Tokenrip?

## Non-Obvious Connections

- **The mounted agent model finally has a product.** Chief of Staff exercises every layer simultaneously — imprint (Tokenrip assets), memory (collections), harness (Custom GPT / skill / MCP). It's the validation product for the architecture.
- **The Custom GPT is a Trojan horse for Tokenrip.** Users interact with ChatGPT. Behind the scenes, Tokenrip is the imprint, memory, and artifact layer. Users discover Tokenrip when they want more — claim account, access from another surface, share artifacts.
- **The lure/CoS continuity eliminates the conversion funnel.** There's no "try the free version, upgrade to paid." The product just gets stickier. The conversion is from "I should come back" to "I can't stop coming back."
- **Same architecture ships a family of agents.** YC Office Hours → Chief of Staff → Writing Partner → any methodology-as-a-service. Imprint swap, same memory/harness infrastructure.
- **The GPT Store is the distribution channel Tokenrip was missing.** Not Twitter followers, not Show HN, not registry blitz. A discoverable storefront where ChatGPT's 200M+ users browse.
