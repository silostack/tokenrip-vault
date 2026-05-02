# Homepage Design Brief — Scene Redesign + Hero Reframe

**Date**: 2026-05-02
**For**: Designer executing homepage changes
**Audience for this doc**: Someone who has NOT read the strategy docs and needs full context to make visual decisions
**Ship window**: P0 by Mon May 5; P1 by Fri May 9
**Companion doc**: [[site-updates-for-yc-2026-05-01]] (broader site updates across /agents, /agents/office-hours, /about — this doc focuses specifically on the homepage)

---

## Context the Designer Needs

### What Tokenrip is

Tokenrip is infrastructure for **mounted agents** — AI agents whose instructions and memory live on a shared platform (Tokenrip), while the model that runs them lives on the user's own machine. Three layers, separated:

1. **Imprint** — the agent's instructions, methodology, and voice. Lives on Tokenrip. Versioned, open, forkable.
2. **Memory** — accumulated context and patterns. Lives on Tokenrip. Layered: private (per-operator) + shared (anonymized patterns across all operators).
3. **Harness** — the user's model and runtime. Lives on the user's machine. Claude Code, Cursor, ChatGPT, any MCP-enabled app.

This separation is what makes mounted agents different from every cloud agent (Custom GPTs, Claude Projects, vertical SaaS agents). Cloud agents fuse all three layers into one black box on the vendor's servers. Mounted agents pull them apart.

### Why the homepage is changing now

Tokenrip is applying to Y Combinator. The YC application URL is `tokenrip.com`. Partners click it cold and form a mental model in 10 seconds.

**Problem:** The current homepage leads with *"The collaboration layer for AI agents"* — framing that positions Tokenrip as middleware. The hero visual shows three "collaboration scenes" (a real estate closing, a document deal, a dinner scheduling) where multiple AI agents exchange structured messages on a shared workspace. This demonstrates inter-agent collaboration — a future capability that requires hundreds of published agents and composition primitives that don't exist yet.

**What should land instead:** "Cloud agents you actually own." The homepage needs to show what a mounted agent does *for the person using it* — not what agents do with each other. Benefits, not features. Outcomes, not process.

### Two audiences, one page

The homepage serves two audiences simultaneously. Both need to be satisfied:

**1. YC partners (and later, a16z)** — clicking the URL from the application. Need to grok in 10 seconds: this is infrastructure for AI agents, it has a technical insight (3-layer separation), there's a real product shipping. They should file Tokenrip as "agent commerce substrate with creator-direct wedge" — NOT as "creator monetization platform" (which would benchmark against Patreon/Substack and kill round size).

**2. Mid-tier creators** — the actual customers. AI educators, newsletter writers, Twitter personalities, vertical experts, podcasters with 50k-500k followers. They're being pitched: "Ship a [your-domain] agent your audience can actually use. Your audience pays for their own model; you collect on tooling-tier upgrades." They need to see: "What does this do for ME and my audience? How is this different from a Custom GPT? Why would my audience pay for this?"

The hero text handles the YC framing ("Cloud agents you actually own"). The hero visual (the scene component) needs to handle the creator/user framing by showing *what a mounted agent produces* — the benefits a user (or a creator's audience) actually gets.

### What the current homepage looks like

```
NAV: Agents · About · FAQ · Docs · Blog · Login

HERO
  "The collaboration layer for AI agents"        ← CHANGING (anti-frame for YC)
  "Your agent can work with anyone's."
  [body copy about collaboration]

INSTALL CTAs (3 tabs: Coding harness / OpenClaw / CLI)
  [install commands + MCP URL]

SCENE COMPONENT (3 tabs)                          ← REDESIGNING (this doc)
  01 CLOSING — real estate deal, 2 agents + 2 humans
  02 DEAL — document collaboration
  03 DINNER — scheduling collaboration
  [description text below each scene]

§ 01 / The Shift — "This is the part that's actually new."
§ 02 / Breadth — "Built for a lot more than dinner."
§ 03 / Mechanics — "How it actually works."
§ 04 / Get Started — install instructions
§ 05 / Pre-Launch — early pricing

FOOTER
```

---

## The Three Changes (Summary)

| # | What | Why | Priority |
|---|---|---|---|
| **1** | Hero text swap | Current headline is the YC anti-frame | P0 |
| **2** | Scene component redesign | Current scenes show inter-agent collaboration (future vision); need to show mounted-agent benefits (current product) | P0 |
| **3** | Below-fold additions | Cloud agent ceiling section, architecture diagram, mount-anywhere visual, blog link surface | P1 |

---

# 1. Hero Text Swap (P0)

### Current

```
The collaboration layer for AI agents
Your agent can work with anyone's.
Independent agents, on different platforms, for different people —
collaborating directly. No custom integrations. No orchestrator
in the middle. Just a shared place to work.
```

### New

**Headline:**

> Cloud agents you actually own.

**Subhead (2-3 lines max):**

> Your agent's brain lives on Tokenrip — versioned, auditable, portable.
> Your model runs on your machine. Mount the same agent anywhere.

**Primary CTA:** `Mount one →` linking to `/agents`

**Secondary CTA (text link, smaller):** `Read the docs →` linking to `docs.tokenrip.com`

### Design Notes

- Same visual hierarchy as the current hero text. Headline → subhead → CTAs.
- The headline should be the largest text on the page. "Cloud agents you actually own." is intentionally short and punchy.
- The subhead explains the mechanism in one breath. No jargon. No "imprint/memory/harness" vocabulary yet — save that for the scenes below.
- Primary CTA is a button (or button-styled link). Secondary is a quiet text link.
- The install CTAs block below the hero (Coding harness / OpenClaw / CLI tabs + MCP URL) stays as-is. Add a small bridging label above it: *"Or install the CLI"* — lowercase, soft, not a heading.

---

# 2. Scene Component Redesign (P0) — The Core of This Brief

## Strategic Intent

The scene component sits in the hero area, directly below the headline and install CTAs. It's the first visual a visitor engages with. Its job:

**For a YC partner:** "These agents have real memory, produce real artifacts, and compound intelligence from every user. This is infrastructure, not a chatbot."

**For a creator evaluating the pitch:** "My agent could do this for my audience. This is a product worth shipping."

**For a builder/developer:** "This architecture is different from anything I've used. I want to build on this."

## What Changes

| Current | New |
|---|---|
| 3 scenes of agents collaborating with each other | 3 scenes of what a mounted agent produces for you |
| Framing: "Look at agents talking" (process) | Framing: "Look at what your agent did" (outcome) |
| Tabs: `01 CLOSING` / `02 DEAL` / `03 DINNER` | Tabs: `01 MEMORY` / `02 ARTIFACTS` / `03 PATTERNS` |
| Visual: multi-agent workspace with message cards | Visual: single product artifact card |
| Use cases: real estate, deals, dinner | Use case: Chief of Staff (the real shipping agent) |
| Description: explains the collaboration | Description: states the benefit to the user |

## Component Structure (Preserved)

The scene component's interactive structure stays the same:
- Tabbed navigation at the bottom (3 tabs)
- A visual "card" area above the tabs showing the scene content
- A description line below the tabs explaining what the scene shows
- Click a tab → content swaps

What changes is everything *inside* the component: the tab labels, the visual content, and the description text.

## Scene 1: MEMORY

**Tab label:** `01 MEMORY`

**What it shows:** A structured memory card — what the agent *knows* about the person using it. Not a chat log. Not a prompt. A clean, structured view of accumulated personal context.

**Visual layout:**

```
╭──────────────────────────────────────────────────────────────╮
│  chief-of-staff · operator memory         last updated 2h   │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  ROLE           Co-founder, CEO                         │ │
│  │  STAGE          Pre-seed · YC application window        │ │
│  │  PRIORITIES     Substrate density, Series 3 blog,       │ │
│  │                 lighthouse close                        │ │
│  │  PATTERNS       Slips on content deadlines when         │ │
│  │                 product work feels more urgent           │ │
│  │  OPEN LOOPS     3 commitments due this week             │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  tokenrip.com/s/simon-context · v12         ● MEMORY        │
╰──────────────────────────────────────────────────────────────╯
```

**Design direction:**
- The card should look like a real product UI — like a database record or a structured profile. NOT a chat message, NOT a diagram.
- The header row has the agent name ("chief-of-staff") on the left and "last updated 2h" on the right. Subtle, secondary text.
- The body is a key-value table. Left column is the field label (muted, uppercase or small-caps). Right column is the value (regular weight, primary text color).
- Field labels: ROLE, STAGE, PRIORITIES, PATTERNS, OPEN LOOPS. These should feel like structured data, not prose.
- The footer row has a Tokenrip asset URL on the left (monospace, linked) and a status indicator on the right ("● MEMORY" with a colored dot).
- The overall card should feel clean, data-rich, and trustworthy. Think: a well-designed CRM record or a Notion database row, not a dashboard widget.
- Use the existing site's card styling (border, background, shadow) — this should look native to the current design system.

**Description text (below tabs):**

> Your agent builds a working model of your business — your priorities, your patterns, your open commitments. Not a prompt you wrote once. A living context that updates every session and persists across any runtime you use.

**Why this scene works:**
- Shows something no cloud agent can do: persistent, structured, visible memory that the user can inspect and edit.
- Makes the "own" in "Cloud agents you actually own" tangible — you can see exactly what the agent knows.
- For creators: "My audience members each get a private memory record. The agent remembers their context."
- For YC: "This is a data layer, not a chatbot. The memory is a platform primitive."

## Scene 2: ARTIFACTS

**Tab label:** `02 ARTIFACTS`

**What it shows:** A published work artifact — a real deliverable the agent produced, with a persistent URL, version history, and sharing. The point: your agent doesn't just chat. It publishes real work products you can share, version, and keep.

**Visual layout:**

```
╭──────────────────────────────────────────────────────────────╮
│  Friday Review · May 2, 2026                       v3       │
│  chief-of-staff → simon                                     │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  COMMITMENTS MET     4 of 6                             │ │
│  │  SLIPPAGE            Blog post 10 draft                 │ │
│  │                      (2nd consecutive week)             │ │
│  │  PATTERN SURFACED    "Other founders in your phase who  │ │
│  │                      publish weekly close lighthouse    │ │
│  │                      deals 40% faster."                 │ │
│  │  NEXT WEEK           3 commitments proposed             │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  tokenrip.com/s/friday-review                   shared (2)  │
│                                                  ● ARTIFACT │
╰──────────────────────────────────────────────────────────────╯
```

**Design direction:**
- Same card structure as Scene 1, but the header signals a different object type: a versioned document rather than a memory record.
- Header: title ("Friday Review · May 2, 2026") on the left, version badge ("v3") on the right. The version badge should be a small pill or tag — the kind of UI element that signals "this thing has history."
- Below the title: a provenance line ("chief-of-staff → simon") in secondary text. This shows who produced it and for whom.
- Body: same key-value table style as Scene 1. Fields: COMMITMENTS MET, SLIPPAGE, PATTERN SURFACED, NEXT WEEK. The "PATTERN SURFACED" value is in quotes — this is an insight from the shared memory layer (bridge to Scene 3).
- Footer: asset URL on the left (monospace), sharing indicator on the right ("shared (2)" meaning shared with 2 people), and a status indicator ("● ARTIFACT").
- The card should feel like a real document preview — something you'd see in a project management tool or a report dashboard. The data inside should look substantive, not placeholder-y.

**Description text (below tabs):**

> Your agent publishes real work — versioned, shareable, with a persistent URL. Share your Friday Review with your cofounder. Pin a version for your board. The artifact lives on Tokenrip and outlives any single chat session.

**Why this scene works:**
- Shows agents producing tangible output, not just conversation. This is the "so what?" for any skeptic: "Yes, but what does it actually DO?" It produces this.
- The versioning (v3) signals maturity and iteration — this isn't a one-shot prompt, it's an ongoing working relationship.
- The shared indicator signals collaboration without needing to show a multi-agent workspace.
- For creators: "My agent produces deliverables my audience can actually use and share."
- For YC: "This is a publishing platform with an asset layer, not a chat wrapper."

## Scene 3: PATTERNS

**Tab label:** `03 PATTERNS`

**What it shows:** The shared intelligence layer — anonymized patterns accumulated from all operators using the same agent. This is the network effect: every person who uses the agent makes it smarter for everyone.

**Visual layout:**

```
╭──────────────────────────────────────────────────────────────╮
│  chief-of-staff · shared patterns         from 47 operators │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  PATTERN #12                                            │ │
│  │  Founders who review commitments weekly instead of      │ │
│  │  ad-hoc show 2.3× fewer slipped deadlines by month 2.  │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │  PATTERN #8                                             │ │
│  │  Pre-seed founders who lead with category claim in      │ │
│  │  investor conversations close 60% faster than those     │ │
│  │  who lead with product.                                 │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │  YOUR MATCH   Both apply to your current phase.         │ │
│  │  SUGGESTION   Schedule the weekly review ritual.        │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  47 operators · anonymized                      ● PATTERNS  │
╰──────────────────────────────────────────────────────────────╯
```

**Design direction:**
- Same outer card structure. Header: agent name on the left, operator count on the right ("from 47 operators").
- Body: two pattern cards stacked vertically, separated by a subtle divider. Each pattern has a label ("PATTERN #12", "PATTERN #8") and 2-3 lines of insight text.
- Below the patterns: a "YOUR MATCH" + "SUGGESTION" block that shows the agent acting on the patterns — connecting the shared intelligence to the individual operator's situation. This block should feel slightly different from the patterns above (maybe a different background tint or an inset style) to signal "this is personalized."
- Footer: operator count + anonymization note on the left, status indicator on the right ("● PATTERNS").
- The patterns should feel like real insights, not generic advice. The specificity (2.3×, 60%, "by month 2") is important — it signals that this comes from real data, not a prompt.

**Description text (below tabs):**

> Every operator makes the agent smarter for everyone. Anonymized patterns from dozens of users compound into intelligence no single person could produce alone. Your context stays private. The patterns are shared.

**Why this scene works:**
- This is the network-effect story. It's the moat. It's what makes Tokenrip defensible.
- A Custom GPT has no shared intelligence layer. A Claude Project has no cross-user patterns. Only a mounted agent on a shared substrate can do this.
- For creators: "My agent gets smarter as more of my audience uses it. That's a flywheel I can't get anywhere else."
- For YC: "This is a data network effect. The more operators on the substrate, the more valuable each imprint becomes."
- For users: "I'm not just getting an AI assistant. I'm getting intelligence from everyone else who uses this agent."

## Scene Component — Visual Consistency Notes

All three scenes share:
- Same outer card dimensions and styling
- Same header/footer layout pattern
- Same key-value table format in the body
- Same tab navigation at the bottom

The differences are in the *content* and the *status indicator*:
- Scene 1: `● MEMORY` (one color — suggest a blue or teal)
- Scene 2: `● ARTIFACT` (a different color — suggest amber or green)
- Scene 3: `● PATTERNS` (a third color — suggest purple or magenta)

The tab labels at the bottom should follow the current tab styling:
- Currently: `01 CLOSING` / `02 DEAL` / `03 DINNER`
- New: `01 MEMORY` / `02 ARTIFACTS` / `03 PATTERNS`

The selected tab should have the same active-state styling as the current component (the bordered/highlighted tab).

## Scene Component — Content Tone

The visual content inside the cards should feel **real, not aspirational.** The current scenes feel like a product mockup of a future feature. The new scenes should feel like screenshots of a product that's shipping right now.

Specific guidelines:
- Use realistic data, not lorem ipsum or obviously fake names. "Simon" as the operator. "May 2, 2026" as the date. "v3" not "v1".
- The Tokenrip URLs should be real URL patterns (tokenrip.com/s/...).
- Numbers should be specific but not suspiciously round (47 operators, not 50; 2.3×, not 2×).
- Keep the text tight. Every line in the card should earn its space.

## Scene Component — Where It Sits on the Page

**Current position:** Below the install CTAs, above §01.
**New position:** Same. The scene component stays in the hero area.

The scene component is the visual proof for the hero text. "Cloud agents you actually own" (headline) → "Here's what that looks like" (scene). The install CTAs sit between them as the action surface.

Flow:
```
HERO TEXT ("Cloud agents you actually own" + subhead + CTAs)
    ↓
INSTALL CTAs (Coding harness / OpenClaw / CLI / MCP — preserved)
    ↓
SCENE COMPONENT (01 MEMORY / 02 ARTIFACTS / 03 PATTERNS)
    ↓
[rest of page]
```

---

# 3. Below-the-Fold Changes (P1)

These ship Tue-Fri after the P0 hero + scene changes are live. The goal: transform the rest of the homepage from "collaboration layer" narrative to "mounted agent infrastructure" narrative.

## New Section: The Cloud Agent Ceiling

**Position:** Immediately below the scene component. Replaces or precedes §01.

**Section header:** *"The cloud agent ceiling"*

**Body copy:**

> Every cloud agent today has a structural ceiling.
>
> **It drifts.** The model changes underneath you. The system prompt gets tightened. There's no way to say "talk to this agent as it was last quarter."
>
> **It dies.** When the vendor deprecates the product, the agent goes with it. Custom GPTs, Claude Projects, the AI layer of every vertical SaaS — all session-grade products masquerading as relationship-grade ones.
>
> **It's capped.** The vendor caps reasoning at what they can afford to compute per query. Aggressive caching, terse output — these aren't UX choices. They're cost structures dressed as design.
>
> Mounted agents fix all three.

**Visual:** Diagram B (Cloud vs. Mounted comparison). See [[site-updates-for-yc-2026-05-01]] Diagram B spec for layout. Side-by-side: left column shows a cloud agent (all layers fused in a vendor box, with ✗ bullets), right column shows a mounted agent (3 separated layers, with ✓ bullets).

**Sub-CTA:** *Read the full thesis →* linking to Series 3 post 9 (cloud agent ceiling blog post).

### Design Notes

- This section should feel like the "problem" half of a problem/solution narrative. Slightly darker or more muted visual treatment than the sections around it.
- The three pain points (drifts / dies / capped) should be scannable — bold lead words, 1-2 sentences each.
- "Mounted agents fix all three." is the pivot sentence. Give it visual weight — standalone line, maybe slightly larger or a different weight.
- Diagram B is the proof. It should be clear enough to parse in 5 seconds: left = bad (fused), right = good (separated).

## New Section: How Mounted Agents Work

**Position:** Below the cloud agent ceiling section.

**Section header:** *"How mounted agents work"*

**Body copy:**

> Three layers, separated. Each lives where it belongs.

**Visual:** Diagram A (3-layer architecture). See [[site-updates-for-yc-2026-05-01]] Diagram A spec for full layout. Left container (Tokenrip): Imprint + Memory cards. Right container (You): Harness card. Captions: "Open. Auditable. Portable." / "Bring your own."

**Below Diagram A:**

> Every cloud-agent problem maps to a structural fix:
>
> - **Drift → versioning.** The imprint is open and pinned. Replay any decision against any version.
> - **Death → portability.** If we shut down, your imprint and memory are still yours. Take them anywhere.
> - **Capability cap → BYO economics.** You pay your own inference. The agent reasons as long as it needs to.

**Sub-CTA:** *See live agents →* linking to `/agents`

### Design Notes

- This is the "solution" half. Should feel cleaner and more open than the ceiling section above.
- Diagram A is the single most important visual on the entire site. Give it room to breathe. It should be wide, well-spaced, and immediately legible.
- The three bullet points below the diagram create a direct 1:1 mapping with the three pain points from the ceiling section. Consider visual cues that connect them (same ordering, matching icons, or explicit "→" arrows in the text).

## New Section: Mount Anywhere

**Position:** Below the architecture section.

**Section header:** *"Mount anywhere"*

**Body copy (above diagram):**

> One imprint. One memory. Many harnesses.
>
> Mount the same agent in Claude Code on your laptop, in ChatGPT on your phone, in Cursor while you're coding, or in any MCP-enabled app. Same context. Same patterns. Same agent.

**Visual:** Diagram C (hub-and-spoke). See [[site-updates-for-yc-2026-05-01]] Diagram C spec. Center card (imprint + memory on Tokenrip) with lines to 4-5 runtime tiles (Claude Code, Cursor, ChatGPT, MCP, Your CLI).

**Caption below diagram:** *"Same agent. Different harnesses."*

**Body copy (below diagram):**

> Switch runtimes mid-week. The agent doesn't notice. You don't lose anything.

### Design Notes

- This section should feel expansive — the visual point is "look how many places this works." The hub-and-spoke diagram should take up generous horizontal space.
- Use logo marks for the runtime tiles where licensable (Claude, Cursor, ChatGPT). Fall back to text for MCP and "Your CLI."
- Mobile: stack tiles vertically below center card.

## Existing Sections Treatment

| Section | Treatment |
|---|---|
| §01 "The Shift" | **Keep for P0. Retitle for P1.** The underlying point (agent output as first-class objects, not chat transcripts) is on-thesis. For P1, consider retitling to something that doesn't reference the old "docs in AI" framing. |
| §02 "Breadth" | **Retitle to "What you can do on the substrate."** Keep body content — the four capabilities (publish, message, collections, cross-company work) are legitimate Tokenrip features. |
| §03 "Mechanics" | **Retitle to "Primitives."** Keep body content — three primitives (identity, assets, threads) are architecture-relevant for developers and YC. |
| §04 "Get Started" | **Keep unchanged.** Install instructions are always relevant. |
| §05 "Pre-Launch" | **Keep unchanged.** Early pricing / Pro-for-life is a conversion lever. |

## New Section: From the Blog

**Position:** Between §05 and footer.

**Section header:** *"From the blog"*

Three featured cards linking to Series 3 posts:

```
The cloud agent ceiling          Mounted agents                Your model, your bill
Why every Custom GPT will        Three layers, separated.      How BYO economics flips
eventually let you down.         The substrate for agent        the AI margin trap.
Post 9 →                         intelligence. Post 10 →        Post 11 →
```

### Design Notes

- Simple 3-column card layout. Each card: title, 1-2 line description, link.
- Cards should match the existing site's card styling.
- Link to live posts as they ship. Post 9 is already live. Posts 10-11 render as "coming soon" cards or are omitted until live.

---

# Full Page Flow (After P0 + P1)

```
NAV

HERO
  Cloud agents you actually own.
  [subhead]
  [Mount one →] [Read the docs →]

INSTALL CTAs (preserved, retitled "Or install the CLI")

SCENE COMPONENT
  01 MEMORY — structured memory card
  02 ARTIFACTS — published Friday Review
  03 PATTERNS — shared intelligence

§ THE CLOUD AGENT CEILING (NEW)
  Problem: drift / dies / capped
  [Diagram B: Cloud vs. Mounted]
  Read the full thesis →

§ HOW MOUNTED AGENTS WORK (NEW)
  Solution: three layers, separated
  [Diagram A: Imprint + Memory + Harness]
  See live agents →

§ MOUNT ANYWHERE (NEW)
  [Diagram C: hub-and-spoke]
  Same agent. Different harnesses.

§ 01 / The Shift (preserved, retitled P1)
§ 02 / What you can do on the substrate (retitled)
§ 03 / Primitives (retitled)
§ 04 / Get Started (preserved)
§ 05 / Pre-Launch (preserved)

§ FROM THE BLOG (NEW)
  Post 9 / Post 10 / Post 11

FOOTER (preserved)
```

### Narrative Arc

The page now reads top-to-bottom as a single argument:

1. **Claim** (hero): Cloud agents you actually own.
2. **Proof** (scenes): Here's what that looks like — memory, artifacts, patterns.
3. **Problem** (ceiling): Why cloud agents fail — drift, death, capability cap.
4. **Solution** (architecture): How mounted agents fix each one — versioning, portability, BYO economics.
5. **Reach** (mount anywhere): Works everywhere you already work.
6. **Depth** (existing sections): What you can build on the substrate.
7. **Action** (get started): Install and try it.
8. **Urgency** (pre-launch): Free now, Pro for life for early agents.
9. **Authority** (blog): The thesis behind the product.

---

# P0 vs. P1 Sequencing

## P0 — Must ship by Mon May 5

1. **Hero text swap.** New headline, subhead, CTAs. ~30 min.
2. **Scene component content swap.** New tab labels, new visual content, new description text. This is the bulk of the P0 work. ~4-6h depending on how the component is built.
3. **Install CTAs bridging label.** Add "Or install the CLI" above existing install block. ~15 min.

**P0 explicitly does NOT include:**
- Cloud agent ceiling section (P1)
- Diagram A/B/C as standalone sections (P1)
- Mount anywhere section (P1)
- Blog section (P1)
- §01-§03 retitling (P1)

The P0 site should look like: new hero text → preserved install CTAs → new scene component → existing §01-§05 unchanged. The hero + scenes carry the entire reframe for the YC submission window.

## P1 — Ship Tue May 6 – Fri May 9

1. Cloud agent ceiling section + Diagram B
2. Architecture section + Diagram A (full-size)
3. Mount anywhere section + Diagram C
4. Blog section
5. §01-§03 retitling

---

# Acceptance Criteria

## P0 (Mon May 5)

- [ ] Hero headline says "Cloud agents you actually own" (NOT "The collaboration layer for AI agents").
- [ ] Hero subhead references versioning, portability, BYO model.
- [ ] Primary CTA links to `/agents`. Secondary CTA links to `docs.tokenrip.com`.
- [ ] Scene component has 3 tabs: MEMORY / ARTIFACTS / PATTERNS (NOT CLOSING / DEAL / DINNER).
- [ ] Scene 1 (MEMORY) shows a structured memory card with realistic data.
- [ ] Scene 2 (ARTIFACTS) shows a published Friday Review with version number and Tokenrip URL.
- [ ] Scene 3 (PATTERNS) shows shared intelligence patterns with operator count and personalized match.
- [ ] Each scene has a benefit-oriented description line below the tabs.
- [ ] Install CTAs block preserved and functional.
- [ ] All existing §01-§05 sections unchanged.
- [ ] Mobile: hero readable, scenes usable (tabs tappable, content readable), no layout breaks.
- [ ] Dark mode works (the current site has a dark mode toggle).

## P1 (Fri May 9)

- [ ] Cloud agent ceiling section live with Diagram B.
- [ ] Architecture section live with Diagram A (full-size).
- [ ] Mount anywhere section live with Diagram C.
- [ ] Blog section renders with at least post 9 linked.
- [ ] §01 retitled, §02 retitled to "What you can do on the substrate", §03 retitled to "Primitives".
- [ ] Full page reads as a coherent argument top-to-bottom (see narrative arc above).

---

# Open Questions for Designer

1. **Scene card dimensions.** The current scene component has a specific aspect ratio (roughly 16:10 based on the screenshot). The new scenes are data-dense single cards rather than multi-column workspace views. Should the card area be the same size, or can it be slightly shorter since it's one card instead of four message cards?

2. **Color coding.** The three scene types (MEMORY / ARTIFACTS / PATTERNS) could each have a subtle color accent (e.g., blue/teal, amber/green, purple). This reinforces the "three different things" message. But the current site uses a consistent teal accent — does adding more colors conflict with the design system?

3. **Scene transition animation.** The current scene tabs presumably have a transition when you switch. Keep the same transition style for the new content.

4. **Dark mode treatment.** The screenshot shows a dark theme. The new card content (structured data tables) needs to be legible in both dark and light modes. Key-value tables should use sufficient contrast between labels and values.

5. **Diagram rendering (P1).** Diagrams A, B, and C can be pure CSS (cards + grid + borders) or SVG. CSS is simpler and more maintainable. SVG is more precise. Designer's call — but avoid heavy charting libraries for these.

---

# Cross-References

- **Broader site updates (non-homepage):** [[site-updates-for-yc-2026-05-01]]
- **Why these changes:** [[../bd/yc-strategy]]
- **The sales motion this supports:** [[../bd/audience-led-gameplan]]
- **The strategic frame:** [[../bd/gameplan]]
- **Architecture source material:** [[../product/tokenrip/mounted-agent-model]]
