# /agents/chief-of-staff Page — Design Brief


---

## Context

### What Tokenrip Is

Tokenrip is an infrastructure platform for AI agents. The core product: **mounted agents** — AI agents whose intelligence (instructions + accumulated memory) lives on Tokenrip's servers, but whose execution runs on the user's own machine and model. The user "mounts" an agent the way you mount a drive — the brain lives on Tokenrip, the body is yours.

Mounted agents separate three layers that every other agent product fuses together:

| Layer | What It Is | Where It Lives |
|-------|-----------|----------------|
| **Imprint** | Instructions, methodology, voice, operational logic | Tokenrip (versioned, open, forkable) |
| **Memory** | Accumulated context, patterns, session history, preferences | Tokenrip (layered: shared + private) |
| **Harness** | The model, the runtime, the machine | The user's own environment (Claude Code, Cursor, ChatGPT, any MCP-enabled app) |

The user pays their own inference costs (BYO model), which removes the capability ceiling cloud agents have. The imprint is portable — mount the same agent in any compatible runtime. The memory is persistent and layered — shared context across all users of an imprint, private context per individual.

### What This Page Is For

The `/agents/chief-of-staff` page is the **product page for Tokenrip's first mounted agent**. Its job: get the visitor to mount the agent and start using it.

Two audiences:

1. **Operators who want to try it** (primary) — Someone who's heard about mounted agents (from the homepage, a blog post, a DM, or word-of-mouth) and is now deciding whether to mount Chief of Staff for their team. They care about what it does for them, not how the architecture works. Show benefits. Make it easy to get started.

2. **Creators evaluating Tokenrip** — Creators being pitched on deploying their own personal-brand agent. Chief of Staff is the reference deploy — what a real mounted agent looks like in production. They want to see proof that this works, and project what their own version could look like.

### What Chief of Staff Is

Chief of Staff is a **team-scoped AI agent** — one agent that serves your entire team. It's not a per-user chatbot. It's the kind of agent that gets smarter the more your team uses it:

- **One agent, shared context.** Everyone on the team mounts the same agent. It knows what your company is working on, what the timelines are, and what decisions have been made — without anyone repeating themselves.
- **Your private stuff stays private.** Team context is shared. Your personal commitments, working style, and slippage patterns stay in your own private layer. The agent uses both in every session.
- **Cross-session awareness.** If your co-founder made a decision that affects your work, the agent surfaces it in your next session — without exposing their private context.
- **Weekly team rituals.** Friday Reviews cover the whole team — commitments, outcomes, slippage, patterns — published as a shareable artifact.
- **Works wherever you work.** Claude Code, Cursor, ChatGPT, or any MCP-enabled app. Same agent, same memory, any tool.

### Design Tone

- Dark mode by default (matches the rest of the site).
- Product-forward. Show what this agent does for you — not how it's built.
- Confident and direct. Short sentences. No hedging or marketing fluff.
- Benefit-first, with enough technical depth to satisfy early adopters who want to understand the mechanics.

---

## Page Structure

```
HEADER
  Title + status badge + benefit-focused description

§ STATUS & STATS

§ WHAT YOU GET
  4 benefit blocks with screenshots/placeholders

§ HOW THE MEMORY WORKS
  Team memory diagram
  Brief privacy explanation
  "Why This Matters" callout (for creators evaluating Tokenrip)

§ MOUNT IT
  Install instructions (tabbed by harness)
  Mount CTA

FOOTER LINKS
```

---

## Header Section

**Title:**

> Chief of Staff

**Status badge** (top-right of header area, pill-shaped):

- Line 1: **LIVE** (accent color — teal or green)
- Line 2: **PUBLISHED MAY 2026** (smaller, secondary color)

**Subtitle:**

> Your team's chief of staff. One agent, shared context, private when it matters.

**Description paragraph (3 lines max):**

> Chief of Staff tracks what your team committed to, surfaces what slipped, and asks the hard questions. Team context compounds across every session. Your private context stays yours. Mount it in whatever tool you already use — it gets smarter every week.

### Layout Notes

- Title is the largest text element on the page.
- Status badge is positioned to the right of or just below the title. Pill-shaped, consistent with badges used on the `/agents` tile grid.
- Description paragraph sits below the subtitle. Three lines max — this is the pitch, not the docs.

---

## § STATUS & STATS

**Section label** (small, uppercase, muted): `STATUS`

A horizontal row of key metrics. Should feel like a live product dashboard.

```
Active operators: 2
Friday Reviews: [N]
Imprint version: v0.1
```

### Layout Notes

- Render as a compact horizontal stat bar on desktop (3 items in a row).
- Each stat: label (small, muted) above the value (larger, prominent).
- **Mobile**: horizontal row or 3-column grid — keep it compact.
- Numbers should be real. Hardcoded if needed, with a plan to update manually. Dynamic if backend supports it.

---

## § WHAT YOU GET

**Section label** (small, uppercase, muted): `BENEFITS`

**Section header:**

> What you get

Four benefit blocks. Each one leads with the outcome — what the operator gets — and follows with a brief "how" that satisfies early-adopter curiosity. No screenshots or image areas. The copy carries this section; the team memory diagram below is the one visual on the page.

---

### 1. Your team has full context — without repeating yourself

> The agent knows what your team is building, what the timelines are, and what decisions have been made. It also knows your personal commitments and working style. Both layers are drawn on in every session — so the agent's answers are grounded in real context, not generic advice.
>
> How: the first time you use it, the agent runs a structured intake — questions about your team first (shared), then about you personally (private). Everything it learns is written to structured memory you can read and verify.

---

### 2. Decisions flow between sessions automatically

> If your co-founder made a call that affects your work, the agent tells you in your next session. You don't need to wait for a Slack message or a standup. Decisions, timeline changes, and priority shifts travel between team members through the agent.
>
> How: team-level decisions are shared automatically. Private details are paraphrased when relevant — never quoted verbatim, never leaked.

---

### 3. A weekly review that actually covers the whole team

> Every Friday (or whenever you trigger it), the agent walks through the whole team's commitments. What happened. What slipped. What patterns keep showing up. The output is a shareable artifact — a permanent URL you can send to your co-founder, your advisor, or yourself in six months.

---

### 4. Same agent, wherever you work

> Mount Chief of Staff in Claude Code, Cursor, ChatGPT, or any MCP-enabled app. Same agent, same memory, different tool. Start a session on your laptop, pick it up on your phone. Switch tools mid-week — the agent doesn't notice, and you don't lose anything.

---

### Layout Notes

- Each block: numbered (1-4), bold headline, body text below.
- No images. Clean text blocks with clear vertical spacing between them.
- The "How:" lines are intentionally smaller or muted — they're for the curious reader, not the headline scanner. Consider rendering them as a slightly indented or lighter-weight paragraph.

---

## § HOW THE MEMORY WORKS

**Section label** (small, uppercase, muted): `UNDER THE HOOD`

**Section header:**

> How the memory works

**Section intro:**

> Chief of Staff keeps two kinds of memory — shared and private. Here's how they're separated:

### Team Memory Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    CHIEF OF STAFF                       │
│                                                        │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ │
│  │ Your          │ │ Team          │ │ Co-founder's  │ │
│  │ private       │ │ context       │ │ private       │ │
│  │ context       │ │ (shared)      │ │ context       │ │
│  ├───────────────┤ ├───────────────┤ ├───────────────┤ │
│  │ Commitments   │ │ Company goals │ │ Commitments   │ │
│  │ Working style │ │ Timelines     │ │ Working style │ │
│  │ Slippage      │ │ Decisions     │ │ Slippage      │ │
│  │ Personal goals│ │ Resources     │ │ Personal goals│ │
│  └───────────────┘ └───────────────┘ └───────────────┘ │
│                                                        │
│      Claude Code ←───── mount ─────→ Cursor / ChatGPT  │
└─────────────────────────────────────────────────────────┘
```

**Body copy (below diagram):**

> Team context lives in the center — shared goals, timelines, decisions. Everyone on the team sees it. Your personal context lives in your own column — commitments, working patterns, slippage. Only your sessions access it directly. When something from your co-founder's column is relevant to what you're working on, the agent surfaces a reference — paraphrased, never raw.
>
> All of it is structured, inspectable, and yours. You can browse the full memory at any time.

**Link below copy:**

> See the full memory → /agents/chief-of-staff/memory

### "Why This Matters" Callout

Render as a styled callout box (subtle background, border-left accent, or similar treatment that stands out from body text):

> **For creators and experts considering their own agent:**
>
> This is the memory model every mounted agent on Tokenrip uses. When you deploy your own imprint, your audience gets the same layered architecture — shared knowledge that compounds across all users, private context that stays private to each individual. The shared layer is what makes the agent get smarter with scale. The private layer is what makes it trustworthy.

### Layout Notes

- The diagram is the one visual in this section. Styled HTML/CSS, not a static image. Build as a component — it may be reused on the homepage.
- Three inner cards (columns) inside a single container. Center column (Team context) slightly emphasized.
- Below the columns, a horizontal line with arrows showing two mount points.
- **Mobile**: stack the three columns vertically, with the mount-point line below.
- The callout is visually distinct from body copy. Use the site's callout/aside component if one exists.

---

## § MOUNT IT

**Section label** (small, uppercase, muted): `GET STARTED`

**Section header:**

> Mount Chief of Staff

**Body copy:**

> Runs on your machine, your model. Install takes under a minute.

### Install Instructions

Tabbed or segmented content — one tab per harness. Default to Claude Code.

**Tab 1: Claude Code (default)**

```
1. Copy the command below
2. Run it in your terminal
3. The agent loads its instructions and memory from Tokenrip at runtime

[code block]
claude install-command chief-of-staff
(replace with actual bootloader command when available)
```

**Tab 2: MCP (ChatGPT, Cursor, etc.)**

```
Connect via MCP endpoint. Same agent, same memory — any compatible runtime.

[code block]
Endpoint: https://api.tokenrip.com/mcp
(replace with actual connection string when available)
```

**Below tabs:**

> Team context is shared; your private context stays yours. Same memory no matter which tool you use.

### Mount CTA

**CTA button** (primary, prominent — same treatment as the "Deploy your imprint" button on the `/agents` page):

> Mount Chief of Staff →

**Below CTA, secondary text links:**

> Browse the memory → /agents/chief-of-staff/memory
>
> Read the docs → docs.tokenrip.com
>
> Deploy your own agent → /agents

### Layout Notes

- Tabbed UI. Two tabs minimum (Claude Code, MCP). Add more as harness support grows.
- Code blocks: monospaced, dark background, copy button.
- Three steps max per tab. Keep it scannable.
- CTA button: full-width on mobile, centered on desktop.
- Secondary links: small text below the button, not competing for attention.
- **Mobile**: tabs as horizontal scroll or accordion.

---

## Visual and Interaction Notes

### Typography

- Section labels: small, uppercase, muted.
- Section headers: large, bold.
- Body copy: standard readable size. Paragraphs 2-4 lines max.
- "How:" lines in benefit blocks: slightly smaller or muted — secondary information.
- Stats: large values, small labels.
- Code blocks: monospaced, with copy button.

### Color

- Dark mode default (match site theme).
- Status badge: accent color for LIVE (teal or green), matching the `/agents` tile grid badges.
- Callout box: subtle tinted background with border-left accent.
- Stat values: prominent (white or near-white on dark).

### Mobile

- All sections stack vertically.
- Stats: compact horizontal row.
- Diagram: stack columns vertically.
- Install tabs: accordion or horizontal scroll.
- CTA button: full-width, tappable.
- Body copy: no smaller than 16px equivalent.

### Interactions

- Install tabs: click to switch, no page reload.
- Hover states on links and CTA: subtle border/shadow change.

---

## Acceptance Criteria

- [ ] Page lives at `/agents/chief-of-staff`
- [ ] Header renders with "Chief of Staff" title and LIVE status badge
- [ ] Stats section shows real numbers (operators, Friday Reviews, imprint version)
- [ ] "What you get" section has 4 benefit blocks (text only, no image areas)
- [ ] Team Memory Diagram renders with 3 columns and mount-point indicators
- [ ] "Why This Matters" callout is visually distinct from body text
- [ ] Install instructions render with tabs (Claude Code, MCP)
- [ ] Code blocks have copy buttons
- [ ] Mount CTA button at bottom is prominent and functional
- [ ] Memory link points to `/agents/chief-of-staff/memory`
- [ ] All links work — no 404s
- [ ] Mobile layout: all sections stack, diagram reflows, CTA is tappable
- [ ] Page loads without layout shift

---

## Open Questions for Designer

1. **Install command format.** The actual bootloader command will be provided when the backend ships. Design the code block so the command text can be updated without touching the layout.

2. **"How:" lines in benefit blocks.** These secondary explanations need to be visually de-emphasized without being hidden. Options: smaller text, muted color, slight indent, or a "Learn more" expand. Designer's call on what fits the site's existing typography.

3. **Stats update mechanism.** Real numbers, hardcoded or dynamic. If hardcoded, document where in the codebase the values live so they can be updated manually.
