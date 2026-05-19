# Site Updates for YC Submission — Implementation Plan

**Date**: 2026-05-01
**Window**: Sat May 3 → Mon May 5 for P0; Tue-Fri May 6-9 for P1; following week for P2
**Submission target**: Mon May 5
**Audience for this doc**: A model executing the updates to tokenrip.com (no codebase context preloaded)
**Source framing**: [[../bd/yc-strategy]], [[../bd/audience-led-gameplan]], [[../bd/motions-and-strategy]]
**Companion doc**: [[chief-of-staff-v0-2026-05-01]] (backend work that supplies the CoS preview / launch surface this site work points at)

---

## Why These Updates

YC application URL is `tokenrip.com`. Partners click it cold and form a category-mental-model in 10 seconds. The current site leads with *"The collaboration layer for AI agents"* — the YC strategy doc explicitly flags that framing as "too abstract, sounds like middleware." It mismatches the 50-character pitch we'll submit (*"Cloud agents you actually own"*) and the long-form architectural-insight narrative.

The fix: reframe the homepage hero around the cloud-agent ceiling → mounted agents architecture, surface the 3-layer decomposition prominently on `/agents`, add a Chief of Staff preview tile, and tag the existing Office Hours agent detail page with "testing phase" + a published date so partners read it as a real shipping product (not a stale demo). Changes are mostly *additive* — much existing content survives, in new positions.

Below: P0 / P1 / P2 in execution batches. Each batch has full copy, layout, diagrams, and acceptance criteria.

---

## At-a-Glance Summary

| Priority | Pages affected | Approx hours | Ship window |
|---|---|---|---|
| **P0** | `/agents` (architecture explainer + CoS tile), homepage (minimal hero reframe + tile to /agents), `/agents/office-hours` (status badge + meta) | ~6-8h | Sat May 3 – Mon May 5 |
| **P1** | `/agents/chief-of-staff` landing page, `/about` founder bios, homepage full reorder, agent-detail enhancements, Series 3 link surface | ~10-14h | Tue May 6 – Fri May 9 |
| **P2** | Substrate stats widget, pricing page, build-your-own waitlist UI, social/Twitter alignment | ~4-6h | Following week |

---

# Diagrams (Reference Designs)

These diagrams are referenced from multiple pages below. Implementer should build them once as components and reuse.

## Diagram A — 3-Layer Architecture

The single most important visual. Used on `/agents` (P0), homepage (P1 expanded version), and possibly `/about`.

**Visual layout** (horizontal, left-to-right):

```
╭───────────────────────────────────────────────╮ ╭────────────────────╮
│             Lives on Tokenrip                 │ │   Lives on you     │
│                                               │ │                    │
│  ┌──────────────┐       ┌──────────────┐      │ │  ┌──────────────┐  │
│  │   IMPRINT    │       │   MEMORY     │      │ │  │   HARNESS    │  │
│  ├──────────────┤       ├──────────────┤      │ │  ├──────────────┤  │
│  │ Instructions │       │ Accumulated  │      │ │  │ Your model   │  │
│  │ Methodology  │       │ context      │      │ │  │ Your runtime │  │
│  │ Voice        │       │ Patterns     │      │ │  │ Your machine │  │
│  │              │       │              │      │ │  │              │  │
│  │  versioned · │       │   layered ·  │      │ │  │  any harness │  │
│  │  open · forkable│   │   private +  │      │ │  │  cloud or local│ │
│  │              │       │   shared     │      │ │  │              │  │
│  └──────────────┘       └──────────────┘      │ │  └──────────────┘  │
│                                               │ │                    │
│   Open. Auditable. Portable.                  │ │   Bring your own.  │
╰───────────────────────────────────────────────╯ ╰────────────────────╯
```

**Implementation notes:**
- 5-column CSS grid (or two flex containers with internal grids).
- Left container: subtle tint background (e.g., `bg-stone-50` or theme-equivalent), 3 columns wide, contains 2 cards (Imprint + Memory) with a slim vertical separator between them.
- Right container: white/transparent background, 2 columns wide, contains 1 card (Harness).
- Each card: bold title (uppercase or semibold), 3-line description, italic meta line at bottom.
- Bottom of each container: a small caption ("Open. Auditable. Portable." vs "Bring your own.").
- Mobile: stack vertically, harness card last with a visible separator above ("Lives on Tokenrip / Lives on you").

**Color / type guidance:**
- Cards use the existing site card styling (no new component needed).
- The "Lives on Tokenrip" / "Lives on you" labels should be subtle — not titles, more like section captions.
- A faint divider between left and right containers reinforces the separation visually without being dominant.

## Diagram B — Cloud vs. Mounted

Used on `/agents` (P1) and possibly homepage P1 reorder.

**Visual layout** (side-by-side, two columns):

```
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
│  CLOUD AGENTS                   │  │  MOUNTED AGENTS                 │
│  (Custom GPTs, Claude Projects, │  │                                 │
│   vertical SaaS agents)         │  │  ┌────────┐ ┌────────┐ ┌─────┐  │
│                                 │  │  │IMPRINT │ │MEMORY  │ │HARN.│  │
│  ┌─────────────────────────┐    │  │  │Tokenrip│ │Tokenrip│ │ You │  │
│  │   Vendor's runtime      │    │  │  └────────┘ └────────┘ └─────┘  │
│  │ ┌───────┬───────┬─────┐ │    │  │                                 │
│  │ │imprint│memory │harness│  │    │  • Portable across runtimes    │
│  │ └───────┴───────┴─────┘ │    │  │  • Versioned, reproducible      │
│  │   (all fused)           │    │  │  • You pay inference            │
│  └─────────────────────────┘    │  │    (capability ceiling lifts)   │
│                                 │  │  • Outlives any single platform │
│  ✗ Hidden, hosted, fused        │  │  • Audit log per imprint        │
│  ✗ Drifts; no versioning        │  │                                 │
│  ✗ Vendor shutdown = agent dies │  │                                 │
│  ✗ Capped at vendor's COGS      │  │                                 │
└─────────────────────────────────┘  └─────────────────────────────────┘
```

**Implementation notes:**
- 2-column CSS grid, equal width.
- Left column: muted/desaturated card representing the cloud-agent state. The fused "vendor's runtime" box has a subtle "single fused container" visual cue (one outlined rectangle with three sub-blocks inside).
- Right column: 3 small cards in a row mirroring Diagram A's layout (compact version), plus a bullet list below.
- Use ✗ / ✓ or similar minimal icon set for the disadvantage/advantage bullets.
- Mobile: stack vertically.

## Diagram C — Mount Anywhere

Used on `/agents` (P1) and homepage (P1 expanded).

**Visual layout** (radial / hub-and-spoke):

```
                       ┌─────────────────────┐
                       │  Your imprint       │
                       │  + Your memory      │
                       │  on Tokenrip        │
                       └──────────┬──────────┘
                                  │
              ┌────────┬─────────┼─────────┬────────┐
              ▼        ▼         ▼         ▼        ▼
        ┌──────────┐ ┌────────┐ ┌────────┐ ┌─────┐ ┌──────────┐
        │ Claude   │ │ Cursor │ │ChatGPT │ │ MCP │ │ Your CLI │
        │  Code    │ │        │ │        │ │     │ │          │
        └──────────┘ └────────┘ └────────┘ └─────┘ └──────────┘
                  Same agent. Different harnesses.
```

**Implementation notes:**
- Center card (the imprint + memory on Tokenrip).
- 4-5 destination tiles below, connected by lines (CSS borders or SVG lines).
- Use logo marks where licensable (Claude, Cursor, ChatGPT logos); fall back to text tiles for MCP and "Your CLI".
- Bottom caption: "Same agent. Different harnesses."
- Mobile: stack the 4-5 tiles vertically below the center card; use a vertical line connector.

---

# P0 — Must Ship Before Mon May 5

The P0 batch produces a site that supports the YC application URL without misaligning the partner-first-impression. Three changes, in execution order:

## P0.1 — `/agents` Architecture Explainer + CoS Preview Tile

**Why first:** the `/agents` page currently has a single Office Hours tile and no architectural explainer. A YC partner clicking through sees "agents page with one demo." Adding the architecture explainer + a Chief of Staff preview tile transforms the page from sparse demo to credible substrate showcase.

### Current State

```
HERO
  Mounted agents
  Brains you load. Memory you can inspect.
  [paragraph about harness/inference + Tokenrip]

§ AGENTS LIST (1 tile)
  Office Hours
  YC-style office hours, on demand
  [View agent →]

FOOTER
```

### Target State (P0)

```
HERO (mostly preserved — light copy tweak)
  Mounted agents
  Brains you load. Memory you can inspect.
  [reworked paragraph — see copy below]

§ HOW THIS IS DIFFERENT (NEW — uses Diagram A)
  [body copy — see below]
  [Diagram A]

§ AGENTS (existing, expanded)
  Office Hours          [TESTING PHASE]    [tile]
  Chief of Staff        [SHIPPING SOON]    [tile, preview state]
  Build your own        [WAITLIST]         [tile]

FOOTER (preserved)
```

### Copy

**Hero subhead** (replace existing):

> Three layers, separated. Your imprint and memory live on Tokenrip — open, versioned, portable. Your model runs on your machine. Mount the same agent in any compatible runtime, take it with you when you leave, and never wait on a vendor's inference budget.

(Keeps "Brains you load. Memory you can inspect." as the headline — that line is already on-thesis and high quality. Replaces the current paragraph below it with the above.)

**§ HOW THIS IS DIFFERENT — section header:** *"How this is different"*

**Body copy (above Diagram A):**

> Every cloud agent today fuses three things into one black box on someone else's servers: the agent's instructions, its accumulated memory, and the model that runs it. End the session, lose the memory. Switch tools, lose the agent. Vendor shuts down, lose all of it.
>
> Mounted agents pull the layers apart. The instructions and memory live on Tokenrip — open, versioned, auditable. The model runs on your machine, on whatever runtime you prefer. Same imprint, any harness. Take it with you when you leave.

**[Diagram A renders here.]**

**Body copy (below Diagram A):**

> The consequences fall out:
>
> - **Portability.** Same agent, Claude Code or Cursor or ChatGPT or any MCP-enabled app.
> - **Reproducibility.** Pin a version. Replay a decision. The imprint is a behavioral contract, not a moving target.
> - **Capability without ceiling.** You pay your own inference, so the agent can reason for fifty steps if it needs to. There's no vendor margin to optimize against.
> - **Outlives the builder.** If we shut down tomorrow, your imprint and memory are still yours. Fork them. Run them somewhere else.

**Sub-CTA below the body:** *"See the architecture in detail →"* linking to `docs.tokenrip.com/concepts/mounted-agents`.

### Agents Tile Layout (3 tiles in a row, mobile-stacked)

**Tile 1: Office Hours** (existing — light tweak)
- Title: *Office Hours*
- Subtitle: *YC-style office hours, on demand*
- Status badge (top-right corner): **TESTING PHASE** (rounded pill, muted color)
- One-line description: *Pressure-tests pitches with demand, status quo, wedge, and distribution diagnostics.*
- CTA: *View agent →* (existing link)

**Tile 2: Chief of Staff** (NEW — preview state)
- Title: *Chief of Staff*
- Subtitle: *Your team's chief of staff. Layered memory. Any harness.*
- Status badge (top-right corner): **SHIPPING THIS WEEK** (or **PREVIEW** if we want softer language)
- One-line description: *One agent for the whole team. Team context shared, personal context private, cross-session references when they matter. Mount it anywhere.*
- CTA: *Get notified →* linking to either:
  - A waitlist form (P1 — see P1.1), or
  - The CoS landing page once it exists (post P1.1)
  - For P0, link to `/agents/chief-of-staff` even if the destination is a stub waitlist page

**Tile 3: Build your own** (NEW — placeholder)
- Title: *Build your own mounted agent*
- Subtitle: *Publish your imprint. Define your memory layer. Mount it anywhere.*
- Status badge: **WAITLIST**
- One-line description: *The 'build an agent' skill is shipping soon. Join the waitlist for early access.*
- CTA: *Join the waitlist →* linking to a simple email-capture form (or `mailto:` for P0 minimum-viable)

### Acceptance Criteria

- [ ] Hero subhead replaced with new copy.
- [ ] "How this is different" section live with Diagram A and surrounding copy.
- [ ] Three agent tiles render in a responsive row.
- [ ] Office Hours tile has TESTING PHASE badge.
- [ ] Chief of Staff tile renders even if the linked landing page is a stub.
- [ ] Build your own tile links to a working email capture (form, Tally, or `mailto:`).
- [ ] Mobile layout stacks correctly; Diagram A reflows to vertical.
- [ ] Page loads without layout shift (no broken images, no unrendered diagrams).

---

## P0.2 — Homepage Minimal Hero Reframe + `/agents` Tile

**Why second:** the homepage hero currently leads with "collaboration layer" — the explicit YC anti-frame. The minimal P0 fix is *not* a full reorder (that's P1); it's reframing the hero so the 50-char pitch and the homepage match, plus adding a single tile pointing to `/agents` for the architecture explainer.

### Current State

```
NAV: Agents · About · FAQ · Docs · Blog · Login

HERO
  The collaboration layer for AI agents
  Your agent can work with anyone's.
  Independent agents, on different platforms, for different people —
  collaborating directly. No custom integrations. No orchestrator
  in the middle. Just a shared place to work.

INSTALL CTAs (5 channels)

§ 01 / The Shift
§ 02 / Breadth
§ 03 / Mechanics
§ 04 / Get Started
§ 05 / Pre-Launch

FOOTER
```

### Target State (P0 minimal)

```
NAV: Agents · About · FAQ · Docs · Blog · Login

HERO (REFRAMED)
  Cloud agents you actually own.
  Mount your agent anywhere. Run it on your model.
  Versioned, auditable, portable.
  [primary CTA: Mount one → /agents]
  [secondary CTA: Read the docs → docs.tokenrip.com]

[Existing install CTAs block — preserved, lightly retitled to "Or install the CLI"]

§ NEW MICRO-SECTION: Three layers, separated.
  [Compact version of Diagram A — smaller, with a "See more →" link to /agents]

§ 01 / The Shift                ← preserved, unchanged
§ 02 / Breadth                  ← preserved, unchanged
§ 03 / Mechanics                ← preserved, unchanged
§ 04 / Get Started              ← preserved, unchanged
§ 05 / Pre-Launch               ← preserved, unchanged

FOOTER
```

### Copy

**New hero headline:**

> Cloud agents you actually own.

**New hero subhead (3 lines max):**

> Mount your agent anywhere. Run it on your own model.
> Versioned, auditable, portable — and yours when you leave.

**Primary CTA button:** *Mount one →* linking to `/agents`

**Secondary CTA button (text link, less prominent):** *Read the docs →* linking to `docs.tokenrip.com`

**Existing install CTAs:** keep as-is below the hero, but add a small heading above them: *"Or install the CLI"* (lower-cased to read as a softer bridge).

**New micro-section copy** (between install CTAs and §01, brief):

> ### Three layers, separated.
>
> Cloud agents fuse instructions, memory, and execution into one black box. Mounted agents pull them apart — open imprint, layered memory, your runtime.
>
> [Compact Diagram A — shorter cards, no bullet lists, just titles + meta]
>
> *See the full architecture →* (link to `/agents`)

### What Stays Untouched (P0)

§01 "Your docs in AI. Not AI in your docs." — still on-thesis. Preserve verbatim.
§02 "Breadth" — four capabilities. Preserve verbatim.
§03 "Mechanics" — three primitives. Preserve verbatim.
§04 "Get Started" — preserve.
§05 "Pre-Launch" — preserve.

The minimal hero reframe is the highest-leverage P0 change — most of the homepage body content survives and is on-thesis once the hero matches.

### Acceptance Criteria

- [ ] Hero headline replaced; subhead replaced; CTA buttons updated.
- [ ] Existing install CTAs preserved with light retitling.
- [ ] Compact Diagram A renders between install CTAs and §01.
- [ ] All §01-§05 content unchanged.
- [ ] Mobile layout: hero readable, CTAs tappable, compact Diagram A stacks gracefully.
- [ ] Internal link from compact diagram to `/agents` works.

---

## P0.3 — `/agents/office-hours` Status Badge + Published Date

**Why third:** the existing Office Hours detail page has "Sessions: 0" and "Rows recorded: 0" prominently displayed. A YC partner reads that as "demo, not real." The fix: tag it as testing-phase with a published date so the zero-state reads as "this is a recently shipped product in beta," not as "this product is dead."

### Current State

```
HEADER
  Office Hours
  YC-style office hours, on demand
  [Description paragraph]

§ Metrics
  Sessions: 0
  Rows recorded: 0

§ What it does (4 bullets)
§ How to use it (install instructions)
§ Sample session
§ What gets stored (table)

[Start a session]
```

### Target State (P0)

```
HEADER
  Office Hours                      [TESTING PHASE — PUBLISHED MAY 1, 2026]
  YC-style office hours, on demand
  [Description paragraph — preserved]

§ Status & Stats (replaces "Metrics")
  Status: Testing phase
  Published: May 1, 2026
  Sessions: 2  ← bootstrapped from Simon/Alek dogfooding (see CoS doc)
  Patterns recorded: 2
  Imprint version: v0.1
  Last updated: May 1, 2026

§ What it does (preserved)
§ How to use it (preserved)
§ Sample session (preserved)
§ What gets stored (preserved)

§ NEW: How this agent is built (mini Diagram A)
  Imprint: office-hours skill (Tokenrip asset, versioned)
  Memory: anonymized pattern collection
  Harness: your Claude / your model
  [Mini Diagram A specific to this agent]

[Start a session]
```

### Copy / Spec

**Status badge** (rendered next to title at top-right, or just below title):
- Pill-style badge with two parts (or two stacked lines):
  - Line 1: **TESTING PHASE** (muted accent color, e.g., amber or stone)
  - Line 2: **PUBLISHED MAY 1, 2026** (smaller, secondary color)

**Replace "Metrics" section with "Status & Stats" section:**

```markdown
**Status:** Testing phase — feedback welcomed.
**Published:** May 1, 2026
**Imprint version:** v0.1 ([changelog →](#))
**Sessions to date:** 2
**Patterns recorded:** 2
**Last updated:** May 1, 2026
```

(Numbers update as Simon/Alek dogfood. The bootstrapping is done by actually running sessions — see [[chief-of-staff-v0-2026-05-01]] for the dogfooding plan.)

**New "How this agent is built" section (mini Diagram A):**

Body copy:
> Office Hours is built on the mounted-agent architecture. Three layers, separated:

Then a compact version of Diagram A with this agent's specifics:

```
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│   IMPRINT      │  │   MEMORY       │  │   HARNESS      │
├────────────────┤  ├────────────────┤  ├────────────────┤
│ The Office     │  │ Anonymized     │  │ Your Claude /  │
│ Hours skill    │  │ pattern        │  │ your model     │
│ (Tokenrip      │  │ collection     │  │                │
│ asset, v0.1)   │  │                │  │                │
│ [view source →]│  │ [browse →]     │  │                │
└────────────────┘  └────────────────┘  └────────────────┘
   On Tokenrip       On Tokenrip            On you
```

Footer note: *"Want to build an agent like this? Read the docs →"* linking to `docs.tokenrip.com/concepts/mounted-agents`.

### Acceptance Criteria

- [ ] Status badge renders prominently at top of page.
- [ ] Published date visible.
- [ ] Stats updated to reflect bootstrapped numbers (≥2 sessions, ≥2 patterns) by submission day.
- [ ] Mini Diagram A renders with this agent's specifics.
- [ ] Existing content (what it does, how to use, sample session, what gets stored) all preserved.
- [ ] Source-link and browse-link CTAs functional (or omit if backend isn't ready — better to omit than to ship dead links).

---

## P0 Cross-Page Linking

After P0 ships, internal link map:

```
homepage
 ├── HERO primary CTA → /agents
 ├── HERO secondary CTA → docs.tokenrip.com
 ├── Compact Diagram A "See more →" → /agents
 └── (existing footer + nav links unchanged)

/agents
 ├── HERO sub-CTA "See architecture in detail →" → docs.tokenrip.com/concepts/mounted-agents
 ├── Office Hours tile → /agents/office-hours
 ├── Chief of Staff tile → /agents/chief-of-staff (stub waitlist or full P1.1 page)
 └── Build your own tile → waitlist form (Tally/mailto/simple form)

/agents/office-hours
 ├── "Start a session" → existing flow (preserved)
 ├── Imprint "view source" → Tokenrip asset URL (or omit if not ready)
 ├── Memory "browse" → Tokenrip collection URL (or omit if not ready)
 └── "Read the docs →" → docs.tokenrip.com/concepts/mounted-agents
```

---

# P1 — Should Ship Tue May 6 – Fri May 9

The P1 batch lands during the YC review window (partners reread the URL during partner-meeting prep). Adds depth and completes the architecture-led narrative.

## P1.1 — `/agents/chief-of-staff` Real Landing Page

The P0 stub becomes a real landing page. This is partly site work and partly dependent on backend work in [[chief-of-staff-v0-2026-05-01]] — the page renders properly only once the v0 imprint is live and the visible-memory surface exists.

### Target State

```
HEADER
  Chief of Staff                    [SHIPPING NOW — PUBLISHED MAY X, 2026]
  Your team's chief of staff. Built on mounted-agent infrastructure.
  [3-line description — see copy below]

§ Status & Stats
  Status: v0 — Shipping this week
  Published: May X, 2026
  Imprint version: v0.1
  Active operators: [N] (e.g., 2 — Simon + Alek)
  Friday Reviews completed: [N]

§ What it does
  - One agent for the whole team — shared team context, private personal context
  - Structured intake builds both layers in one conversation
  - Cross-session awareness: the agent references what your co-founder discussed
  - Runs team-scoped Friday Reviews with shareable artifacts
  - Survives across runtimes — start in Claude Code, continue in ChatGPT

§ How to use it
  [Install instructions — Claude Code, MCP, etc.]
  [Bootloader command snippet]

§ The aha moment (NEW — sells the differentiation)
  [Side-by-side or sequential demo of:
    1. Layered memory — team context + private context in a three-column view
    2. Cross-session reference — the agent surfaces what your co-founder discussed
    3. Same agent, any harness — mount in Claude Code, then ChatGPT
    4. Team Friday Review — commitments, outcomes, and patterns for the whole team
    5. Substantive intake — two phases (team, then personal)]
  [Could be screenshots, a short looping video, or a live-demo CTA]

§ How this agent is built (mini Diagram A specific to CoS + team-memory diagram)
§ What gets stored (privacy + governance — team vs. private)
§ Sample session (shorter than office-hours; representative)

[Mount Chief of Staff →]
```

### Copy

**Headline:** *Chief of Staff*

**Subhead:** *Your team's chief of staff — built on mounted-agent infrastructure.*

**Description paragraph:**

> Chief of Staff is the kind of agent only mounted agents can be: one imprint, multiple operators, three layers of memory. Team context is shared — company goals, timelines, decisions. Personal context is private — your commitments, working style, slippage patterns. The agent draws on both. And when your co-founder discusses something that affects you, it surfaces the reference in your next session. Mount it in any runtime — Claude Code, Cursor, ChatGPT — without losing a thing. Friday Reviews cover the whole team. The agent gets smarter every week.

**§ The aha moment — section header:** *"What makes this different"*

Body copy:

> Chief of Staff is built to demonstrate what only mounted agents can do.
>
> 1. **Layered team memory.** [Screenshot of three-column memory view.] Team context in the center — company, goals, timelines. Each operator's private context on the sides — commitments, working style, slippage patterns. The agent reads both layers in every session but keeps private context private.
>
> 2. **Cross-session awareness.** [Screenshot of the agent referencing another operator's update.] "Simon mentioned he's leading the YC pitch with the cloud-agent ceiling. You might want to align the outreach messaging." The agent connects what one co-founder discussed to what the other is working on — without exposing private details.
>
> 3. **Same agent, any harness.** [Screenshot or animation of the agent running in Claude Code, then in ChatGPT.] Memory persists across runtimes. Switch tools mid-week without losing anything.
>
> 4. **Team Friday Reviews.** [Screenshot of a Friday Review artifact.] Structured weekly ritual covering every operator. Commitments → outcomes → slippage → team patterns → next steps. Shareable as a Tokenrip asset.
>
> 5. **Substantive intake.** Not a system prompt. The agent runs a two-phase intake — first about the team (shared), then about you (private). Fifteen to twenty questions. Every answer written to structured memory you can read and verify.

**Mount CTA:**

> Mount Chief of Staff →
> [Bootloader install command for Claude Code]
> Or use [MCP / Cursor / etc.]

### Team Memory Diagram (additional visual for this page)

In addition to the mini Diagram A (3-layer architecture), the CoS landing page should include a team-memory diagram:

```
┌─────────────────────────────────────────────────────────┐
│                    CHIEF OF STAFF                       │
│                    (one imprint)                         │
│                                                         │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐  │
│  │ Simon's       │ │ Team          │ │ Alek's        │  │
│  │ private       │ │ context       │ │ private       │  │
│  │ context       │ │ (shared)      │ │ context       │  │
│  ├───────────────┤ ├───────────────┤ ├───────────────┤  │
│  │ Commitments   │ │ Company goals │ │ Commitments   │  │
│  │ Working style │ │ YC timeline   │ │ Working style │  │
│  │ Slippage      │ │ Team decisions│ │ Slippage      │  │
│  │ Personal goals│ │ Resources     │ │ Personal goals│  │
│  └───────────────┘ └───────────────┘ └───────────────┘  │
│                                                         │
│      Claude Code ←──── mount ────→ Cursor / ChatGPT    │
│      (Simon)                         (Alek)             │
└─────────────────────────────────────────────────────────┘
```

This diagram should be implemented as a reusable component (it may also appear on the homepage P1.3 as a deeper example of what layered memory looks like in practice).

### Acceptance Criteria

- [ ] Page lives at `/agents/chief-of-staff`.
- [ ] Status badge says SHIPPING NOW or PUBLISHED with the actual date.
- [ ] Stats render real numbers (≥2 operators, ≥1 Friday Review completed).
- [ ] Five aha-moment beats render with images or descriptive placeholders.
- [ ] Team-memory diagram renders below or alongside the 3-layer architecture diagram.
- [ ] Mount CTA produces a working install (links to chief-of-staff bootloader).
- [ ] All depends on backend work shipping per [[chief-of-staff-v0-2026-05-01]].

---

## P1.2 — `/about` Founders Page

YC application Q3 wants a founder intro video; the live `/about` page should support that with bios that match the founder-fit framing in [[../bd/yc-strategy]] §3.

### Target State

```
HEADER
  About Tokenrip
  We built mounted agents because we needed them.

§ The story (1-2 paragraphs)
  Origin: built first version for ourselves; recognized the architecture
  was bigger than the system that produced it; generalizing into a platform.

§ Founders
  Simon — [bio]
  Alek — [bio]

§ What we believe (3-4 bullets)
  Cloud agents have a structural ceiling.
  The right wedge is the smallest commercial unit that requires the architecture.
  Open imprint + private memory is a market segment, not a feature.
  Etc.

§ Where we are
  - Tokenrip platform deployed Apr 2026
  - First mounted agents live
  - Building toward a network of agents on the substrate

[Get in touch / read the docs / mount an agent]
```

### Copy

**Headline:** *About Tokenrip*

**Subhead:** *We built mounted agents because we needed them.*

**The story:**

> We started building agents to scale the work two co-founders couldn't do alone. The first version was an outreach agent — a shared imprint, a shared memory, two operators on different machines, mounting the same agent at runtime. It worked. And it accidentally separated three things every other agent framework fuses together: instructions, memory, and execution.
>
> When we recognized the pattern, we recognized the platform. Tokenrip is what comes out the other side: the substrate where agent intelligence lives. Imprints versioned and open. Memory layered and portable. Runtime entirely on you. Mount the same agent anywhere; outlive any platform.

**Founders section:**

```markdown
**Simon Pettibone** — co-founder.  [bio: technical background, what he's building, why this idea]

**Alek [last name]** — co-founder.  [bio: ops/distribution background, what he's responsible for, why this idea]
```

(Bios drafted by Simon + Alek directly; this doc just specifies the slot.)

**What we believe:**

- Cloud agents have a structural ceiling — capability, drift, and lifespan are all capped by the vendor's economics. Mounted agents lift each of these.
- Open imprint plus private memory is a category, not a feature. Regulated industries that can't adopt cloud AI today can adopt mounted agents.
- The right wedge is the smallest commercial unit that requires the architecture. For us that's audience-led creator deployment.
- Token efficiency becomes a competitive feature when the user pays inference. Quality and economy point in the same direction for the first time.

### Acceptance Criteria

- [ ] Page lives at `/about`.
- [ ] Both founders' bios present with photos.
- [ ] "What we believe" section pulls the four beliefs above (verbatim or close).
- [ ] CTAs at bottom: links to `/agents`, `docs.tokenrip.com`, contact.

---

## P1.3 — Homepage Full Reorder

The P0 hero reframe was minimal. P1 reorders the homepage to make the architecture-first narrative load-bearing throughout.

### Target State

```
NAV (preserved)

HERO (P0 version preserved)

[Existing install CTAs — preserved]

§ THE CLOUD AGENT CEILING (NEW)
  Three problems every cloud agent has — drift, lifespan, capability cap.
  [Diagram B: Cloud vs. Mounted]
  Sub-CTA: Read the full thesis (Series 3 post 9) →

§ HOW MOUNTED AGENTS WORK (NEW — full version)
  Three layers, separated.
  [Diagram A — full size, replacing the P0 compact version]
  Sub-CTA: See live agents → /agents

§ MOUNT ANYWHERE (NEW)
  [Diagram C: hub-and-spoke]
  Same imprint. Same memory. Different runtime.

§ 01 / The Shift          ← preserved
§ 02 / Breadth            ← retitled "What you can do on the substrate"
§ 03 / Mechanics          ← retitled "Primitives"
§ 04 / Get Started        ← preserved
§ 05 / Pre-Launch         ← preserved

NEW: § FROM THE BLOG
  Featured: post 9, post 10, post 11 from Series 3.

FOOTER (preserved)
```

### Copy

**§ The cloud agent ceiling — section header:** *"The cloud agent ceiling"*

**Body copy:**

> Every cloud agent today has a structural ceiling.
>
> **It drifts.** The model changes underneath you. The system prompt gets tightened. There's no way to say "talk to this agent as it was last quarter." For consumer use, fine. For legal, medical, financial decisions — unusable.
>
> **It dies.** When the vendor deprecates the product, the agent goes with it. Custom GPTs, Claude Projects, the AI layer of every vertical SaaS — all session-grade products masquerading as relationship-grade ones.
>
> **It's capped.** The vendor caps reasoning at what they can afford to compute per query. Aggressive caching, single-shot answers, terse output — these aren't UX choices. They're cost structures dressed as design.
>
> Mounted agents fix all three.
>
> [Diagram B]
>
> *Read the full thesis: [The Cloud Agent Ceiling →](link-to-post-9)*

**§ How mounted agents work — section header:** *"How mounted agents work"*

**Body copy:**

> Three layers, separated. Each lives where it belongs.
>
> [Diagram A]
>
> The consequences are real. Every cloud-agent problem above maps to a structural fix:
>
> - **Drift → versioning.** The imprint is open and pinned. Replay any decision against any version.
> - **Death → portability.** If we shut down, your imprint and memory are still yours. Take them anywhere.
> - **Capability cap → BYO economics.** You pay your own inference. The agent reasons as long as it needs to.

**§ Mount anywhere — section header:** *"Mount anywhere"*

**Body copy (above Diagram C):**

> One imprint. One memory layer. Many harnesses.
>
> Mount the same Chief of Staff agent in Claude Code on your laptop, in ChatGPT on your phone, in Cursor while you're coding, or in any MCP-enabled app. Team context shared, personal context private, same agent everywhere.

**[Diagram C renders here.]**

**Body copy (below Diagram C):**

> Switch runtimes mid-week. The agent doesn't notice. You don't lose anything.

**Section retitles for existing content:**
- §02 "Breadth" → *"What you can do on the substrate"*
- §03 "Mechanics" → *"Primitives"*

(Keep the body content of these sections unchanged — just retitle for narrative coherence.)

**§ From the blog — section** (NEW):

```markdown
**The cloud agent ceiling** — Why every Custom GPT will eventually let you down. (Post 9)
**Mounted agents** — Three layers, separated. The substrate for agent intelligence. (Post 10)
**Your model, your bill** — How BYO economics flips the AI margin trap. (Post 11)
```

Three featured cards linking to the Series 3 posts as they ship.

### Acceptance Criteria

- [ ] New "Cloud agent ceiling" section live with Diagram B.
- [ ] "How mounted agents work" section uses full-size Diagram A.
- [ ] "Mount anywhere" section live with Diagram C.
- [ ] §02, §03 retitled.
- [ ] "From the blog" section renders with at least post 9 (live now); other posts as they ship.
- [ ] Page reads top-to-bottom as: hero → install → ceiling problem → architecture solution → portability → use cases → primitives → install detail → pricing → blog.

---

## P1.4 — Agent Detail Page Enhancements (Beyond P0)

Building on P0.3 (status badge + meta added to office-hours), P1 enhances both detail pages (`/agents/office-hours` and `/agents/chief-of-staff`) with deeper content.

### Target additions per detail page

**§ How this agent is built — full version:**
- Mini Diagram A specific to the agent (already added in P0.3)
- Plus: a "look inside" expandable that shows the actual imprint asset structure (skill files, persona definition, memory schema)
- Optional: changelog showing imprint version history

**§ What gets stored — enhance:**
- Existing table of stored fields preserved
- Add: "Why this matters" callout explaining how the layered memory works (team context vs. private context, cross-session references)

**§ Recent activity (NEW, only if backend supports):**
- "Last 5 anonymized patterns" or "Recent insights surfaced" — pulled from the shared memory collection
- Renders as small cards
- Updates as more sessions run

### Acceptance Criteria

- [ ] Both detail pages have the enhanced "How this agent is built" section.
- [ ] "What gets stored" tables include the why-it-matters callout.
- [ ] Recent activity section conditionally renders if backend has data; gracefully omits otherwise.

---

## P1.5 — Series 3 Post 9 Surface on Homepage

Post 9 is referenced as the most important pre-fundraising artifact in [[../bd/yc-strategy]]. It needs to be visible from the homepage so YC partners reading top-to-bottom find it.

### Implementation

The P1.3 "From the blog" section is the primary surface. Additionally:
- A small banner or callout on the homepage hero or just below the install CTAs: "*New: The Cloud Agent Ceiling — read the thesis →*"
- Link in the footer under a "Recent thinking" header
- Consider: a small "9" or "post 9" badge on the relevant homepage section ("This is the architecture; here's the thesis it builds on →")

### Acceptance Criteria

- [ ] Post 9 link visible from the homepage in at least two places (banner + blog section).
- [ ] Link works to live blog post URL.

---

# P2 — Nice-to-Have (Following Week)

These ship when capacity opens up. Not blocking the application or partner review.

## P2.1 — Substrate Stats Widget

Public-facing counter showing platform health. Renders on `/agents` and possibly homepage.

### Target Display

```
   3            247          ~1.2K          5
imprints     operators    weekly tool    Friday Reviews
              registered    calls         this month
```

### Implementation Notes

- Pull from internal metrics dashboard ([[../bd/audience-led-gameplan]] substrate roadmap calls for v1 dashboard by week 4)
- Numbers update in (near-)real-time
- If numbers are too low to be impressive, omit and revisit when worth showing
- Conservative honesty: don't inflate; raw counts only

### Acceptance Criteria

- [ ] Widget renders on `/agents` (top of page or above tile list).
- [ ] Numbers reflect real platform state.
- [ ] Updates at least daily.
- [ ] Mobile-responsive.

---

## P2.2 — Pricing Page

YC partners look for revenue model evidence. A pricing page (even a simple one) communicates that.

### Target Layout

```
HEADER
  Pricing
  Pay for capability, not for inference.

§ How pricing works
  Free imprints. Free CLI. Free messaging.
  Pay for tooling tiers when your agent needs them.
  You always pay your own inference (BYO model).

§ Tiers
  Free       Pro          Enterprise
  - Asset    - Semantic    - Custom tool
    publish    search        provisioning
  - Messaging- Webhooks    - Inter-agent calls
  - Threads  - Scheduled   - Advanced analytics
             - Computed    - SLA + dedicated
              columns        support

§ Coming soon
  Tooling tiers ship as the substrate matures.
  Joining the early-agent program now locks Pro-lifetime pricing.
```

### Acceptance Criteria

- [ ] Page lives at `/pricing`.
- [ ] Clear free / pro / enterprise structure.
- [ ] CTA: "Lock pre-launch Pro pricing →" linking to existing pre-launch CTA.

---

## P2.3 — Build-Your-Own Waitlist UI

Replaces the P0 mailto-or-Tally with a proper waitlist form.

### Target

- Simple form on the `/agents` Build-your-own tile destination
- Email + optional fields ("What kind of agent are you thinking about building?")
- Confirmation page or auto-reply
- Stored in Tokenrip collection or Attio CRM

### Acceptance Criteria

- [ ] Working form.
- [ ] Submissions stored in Attio (or equivalent).
- [ ] Confirmation message renders cleanly.

---

## P2.4 — Twitter / Social Alignment

The Tokenrip Twitter / X presence still uses the old framing in some posts (collaboration-led). New tweets should match the YC-aligned framing.

### Action items

- Pinned tweet: thread linking the Cloud Agent Ceiling post (Series 3 #9)
- Update bio to "Cloud agents you actually own" or similar
- Run Series 3 announcements through the new framing (problem → architecture → wedge → category)
- Engagement agent could start posting on this; that's a separate workstream — see audience-led-gameplan §"Engagement agent repointing"

---

# Cross-Page Link Map (After All Batches)

```
/                 (homepage)
 ├── HERO → /agents
 ├── HERO secondary → docs.tokenrip.com
 ├── Cloud-ceiling section → blog post 9
 ├── Architecture section → /agents
 ├── Mount-anywhere → /agents/[any-agent]
 ├── From the blog → blog
 └── Footer (preserved)

/agents
 ├── Architecture explainer "See more →" → docs.tokenrip.com/concepts/mounted-agents
 ├── Office Hours tile → /agents/office-hours
 ├── Chief of Staff tile → /agents/chief-of-staff
 └── Build-your-own tile → waitlist (P2.3) or mailto

/agents/office-hours
 ├── Mini diagram links → asset URL, collection URL (when backend ready)
 ├── Start session → existing flow
 └── Read docs → docs.tokenrip.com/concepts/mounted-agents

/agents/chief-of-staff
 ├── Aha-moment screenshots → larger lightbox or video
 ├── Mount → bootloader install (per [[chief-of-staff-v0-2026-05-01]])
 └── Read docs → docs.tokenrip.com/concepts/mounted-agents

/about
 ├── Founder bios → external (LinkedIn, X)
 ├── CTAs → /agents, docs.tokenrip.com, contact

/pricing (P2)
 └── CTA → existing pre-launch signup
```

---

# Open Questions for Implementer

These need a quick decision from Simon before/during execution; flag if blocked:

1. **Status badge color/style.** Existing site has a design language; the badges should match. If unclear, use a neutral pill (rounded, muted background) — implementer's call.
2. **Diagram rendering tech.** Pure CSS grid + bordered cards is the simplest. SVG is fine if the site already uses it. Avoid heavy chart libraries for these.
3. **Logo licensing for Diagram C.** Claude, ChatGPT, Cursor logos — verify usage rights or fall back to text tiles.
4. **`/agents/chief-of-staff` exists pre-backend?** If [[chief-of-staff-v0-2026-05-01]] hasn't shipped by Mon May 5, the page should be a stub (waitlist + "shipping this week"). If backend ships first, the full P1.1 layout goes live.
5. **Bootstrapping Office Hours stats.** Spec says "≥2 sessions, ≥2 patterns" by submission day. Simon and Alek need to actually run sessions through Office Hours and contribute patterns. Coordinate with [[chief-of-staff-v0-2026-05-01]] §"Bootstrapping"-equivalent.
6. **Series 3 post 9 URL.** Confirm the live URL and use it consistently across all link surfaces.

---

# Acceptance Criteria — Composite

By submission day (Mon May 5, end of P0):

- [ ] Homepage hero says "Cloud agents you actually own" or equivalent (NOT "collaboration layer").
- [ ] `/agents` has architectural explainer with Diagram A.
- [ ] `/agents` lists Office Hours, Chief of Staff (preview), Build-your-own (waitlist).
- [ ] `/agents/office-hours` has TESTING PHASE badge + published date + bootstrapped stats (≥2/≥2).
- [ ] All links in P0 cross-page link map work (no 404s).
- [ ] Mobile layouts render correctly.

By Friday May 9 (end of P1):

- [ ] `/agents/chief-of-staff` is a real landing page (not a stub).
- [ ] `/about` has founder bios live.
- [ ] Homepage reordered with full architecture narrative + Series 3 link surfaces.
- [ ] Agent detail pages have enhanced "How this agent is built" sections.
- [ ] Series 3 post 9 visible from homepage in 2+ places.

By following week (end of P2):

- [ ] Substrate stats widget live (if metrics dashboard ships).
- [ ] `/pricing` page live.
- [ ] Build-your-own waitlist form working.
- [ ] Twitter / social presence aligned to new framing.

---

# Cross-References

- **Why these changes:** [[../bd/yc-strategy]]
- **Architecture explainer source:** [[../product/tokenrip/mounted-agent-model]] and [[../product/tokenrip/mounted-agent-synthesis]]
- **Companion: backend work for CoS:** [[chief-of-staff-v0-2026-05-01]]
- **Underlying motion:** [[../bd/audience-led-gameplan]]
- **KPIs to verify the work:** [[../bd/kpis]] (substrate dashboard listed under §"Substrate roadmap")
- **Origin pivot session:** [[../agents/bean/sessions/2026-05-01]]
