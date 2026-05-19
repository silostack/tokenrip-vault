# Tokenrip — Distribution Strategy

**Purpose**: How Tokenrip achieves mass adoption from day 1. Distribution is the moat accelerant — the asset graph only compounds if assets are flowing through it. This document maps the distribution architecture, integration hierarchy, viral mechanics, and monetization alignment.

**Last updated**: 2026-04-01

---

## The Distribution Thesis

Layer 1 (asset routing) is trivially replicable. Any platform could ship a `publish()` command tomorrow. The moat — the asset graph — only exists if Tokenrip becomes the default place agent-produced assets live. Distribution speed determines whether Tokenrip becomes the standard or becomes a feature someone else ships.

Three forces create the distribution window:

1. **Agent output is exploding.** Every AI tool produces more assets than its interface can manage. The sharing problem is universal and getting worse.
2. **Nobody owns the visibility layer.** Operators can't see what their agents are doing without digging through chat histories. Observability tools (LangSmith, Langfuse) solve developer debugging. Nobody solves operator supervision — the forward-looking question of "what is my agent working on and what does it need from me?"
3. **Nobody owns the collaboration layer.** Every AI tool has a different, usually bad, answer to "how do I share this?" and no answer at all for "how do I steer this?" There's no purpose-built surface for human-agent or agent-to-agent collaboration.

The strategy: lead with visibility (the most universal pain point today), build the collaboration surface that creates switching costs, and use the installed base to become the connective tissue between agents. Visibility is the door. Collaboration is why they stay.

---

## Integration Hierarchy

Everything bottoms out at the HTTP API. Each layer above it trades universality for convenience:

```
Platform-specific skills/plugins    ← highest convenience, narrowest reach
    ↓ uses
CLI                                 ← universal, good for developers + agents with shell access
    ↓ wraps
SDK (npm / pip / Go)                ← for tool builders integrating server-side
    ↓ wraps
HTTP API                            ← the primitive, everything depends on this
```

**MCP server** sits alongside the CLI as an alternative wrapper around the SDK. Useful in MCP-native environments, but not the primary distribution vector. MCP adds configuration overhead (server setup, client config, restart cycle) that the CLI and skills avoid. MCP wins for multi-step agent workflows (publish → check status → pull comments → update), but for the core use case — "publish this and give me a URL" — it's overkill.

### Why Skills/Plugins Come First

For each platform Tokenrip targets, the ideal integration is a **native skill or plugin** that makes publishing invisible. The user says "share this" and gets a link. No install, no config, no awareness of what's underneath.

- **Claude Code**: A `/share` skill. Agent produces a document → user says `/share` → skill publishes → URL in terminal.
- **OpenClaw**: A `/share` command in Telegram. Agent produces a report → user says "share this" → bot publishes → URL in chat.
- **Cursor**: A command palette entry ("Share via Tokenrip"). Agent generates an architecture doc → developer triggers share → URL lands in clipboard.

The user never thinks about transport layers. They think about the action: **"share this thing."**

### Why CLI Before MCP

The trend in the AI tooling ecosystem is moving toward CLIs over MCP for single-purpose tools. Reasons:

1. **Zero config.** `npm install -g tokenrip && tokenrip auth` → done. MCP requires editing JSON config and restarting the client.
2. **Universal.** CLI works in any shell environment. MCP only works where there's an MCP client.
3. **Agent-friendly.** Any agent that can run bash can use the CLI. Claude Code, Cursor, Windsurf — they all have shell access.
4. **Simple mental model.** `tokenrip publish file.md` → URL. No protocol negotiation, no server management.

MCP's advantage — structured tool calling, richer input/output, no shell escaping — matters for power users running complex multi-step workflows. It's a "nice to have" that ships after the CLI, not instead of it.

---

## Bottom-Up Growth Strategy

**Lead with self-serve. Let organic usage signal where to invest.**

### Phase 1: Dogfood + Self-Serve (Days 1-14)

Ship the API, SDK, CLI, and skills for platforms we already use daily:

| Integration | Purpose | Distribution Vector |
|---|---|---|
| **Claude Code skill** | Replace current email-from-markdown and HTML-preview workflows | Every asset Simon/Alek produce flows through Tokenrip |
| **OpenClaw skill** | Agent outputs in Telegram get shareable links | Every link shared from OpenClaw is a Tokenrip impression |
| **CLI** | `tokenrip publish` from any terminal | Available to any developer, any agent framework |
| **npm SDK** | `@tokenrip/sdk` for tool builders | Any Node.js project can integrate in <20 lines |

**The dogfooding principle:** every document, HTML preview, code snippet, and deliverable produced through our own agents should flow through Tokenrip. The friction we feel is the roadmap. The links we share are the first viral loops.

### Phase 2: Organic Signal Collection (Days 14-30)

Watch where usage clusters:
- Which tools are people publishing from?
- What content types dominate?
- Where do links get shared? (Slack, email, Twitter, PRs?)
- What do recipients do after clicking? (View only? Comment? Fork?)

These signals tell you which integrations to prioritize and which partnership conversations to start.

### Phase 3: Signal-Driven Outreach (Days 30+)

Approach tools whose users are already publishing. The conversation shifts from "please integrate us" to **"your users are already sharing via Tokenrip — here's a branded version for free."**

This is fundamentally stronger positioning than cold outreach. You're not selling a concept. You're formalizing something that's already happening.

---

## The Viral Loop: Every Link Is a Product Demo

The atomic unit of distribution is the **shared link.** Every time someone publishes an asset and shares the URL, the recipient experiences Tokenrip. This is the Figma/Calendly dynamic — the product spreads through usage, not through marketing.

For this to work, the link experience must be a first-class product:

### What the Recipient Sees at `rip.to/abc123`

1. **Clean, functional rendering.** The document, code, or asset renders well — professional typography, syntax highlighting, responsive layout. But the real draw is what happens next: the recipient can interact with it. Comment, version, collaborate. The link isn't just a view — it's an invitation to participate.
2. **Immediate next actions.** Comment button. Fork button. Share button. Version history. The page isn't a static render — it's an invitation to interact.
3. **Attribution.** "Created with [Tool Name] + AI" — credits the originating tool (important for tool builder incentive alignment). "Published via Tokenrip" — credits the platform (important for viral awareness).
4. **Path to becoming a publisher.** Subtle but present. "Publish your own AI outputs" with a link to getting started. Not aggressive — just visible.

### The Viral Math

```
User publishes asset → shares link with N people
    → each recipient sees Tokenrip → X% become curious
        → Y% of curious try publishing → they share with N people
            → cycle repeats
```

The key levers:
- **N (share breadth):** How many people see each link? Optimize for content types that get shared widely (reports, design previews, code documentation).
- **Quality of impression:** Does the page make people think "I want this"? Clean rendering is table stakes — the real hook is seeing the collaboration surface (comments, versions, activity) that makes the link feel alive, not static.
- **Friction to first publish:** How fast can a curious recipient go from "this is cool" to publishing their own asset? Target: under 2 minutes.

---

## The Branding Plan: Monetization That Aligns with Distribution

Three tiers that make the free tier drive viral growth and the paid tiers serve tool builders:

| | Free | Pro | Enterprise |
|--|------|-----|------------|
| **URL** | `rip.to/abc123` | `rip.to/abc123` | `share.toolname.com/abc123` |
| **Page branding** | "Published via Tokenrip" (prominent) | Tool's logo + colors + "Powered by Tokenrip" (footer) | Fully custom, white-label option |
| **Rendering** | Clean + full collaboration surface (this is the ad) | Custom theming + collaboration | Fully branded experience |
| **Collaboration** | Comments, versions | Comments, versions, teams | Full workflow, roles, policies |
| **API limits** | Generous free tier | Usage-based | Contract |
| **Analytics** | Basic (views) | Detailed (engagement, shares) | Full analytics + API |

### Why This Structure Works

**Free tier is the growth engine.** Every free-tier link has "Published via Tokenrip" prominently displayed. The page looks great — not "free tier with watermark" but genuinely polished. This is the Calendly lesson: people pay to customize, not to remove ugliness. Every free link is a billboard.

**Pro tier serves tool builders.** An AI writing tool integrates Tokenrip and wants their branding on shared pages. They pay for Pro. Their users get a branded sharing experience. Tokenrip gets revenue + continued distribution through every branded link (the "Powered by Tokenrip" footer persists).

**Enterprise tier serves platforms.** Large platforms want custom domains, full white-labeling, dedicated infrastructure. This is the Stripe Atlas / Stripe Connect pattern — the biggest customers need the most customization.

### Bootstrap Deals

For platforms with meaningful distribution, offer **Pro-tier branding free for 12 months** in exchange for integration commitment. The deal: "Your users get collaboration infrastructure. You get branded sharing pages. We get volume."

**Criteria for a bootstrap deal:**
- Platform has 10K+ active users producing AI content
- No existing sharing solution (or a bad one)
- Integration is technically straightforward (SDK or API)
- Content type has natural sharing dynamics (gets sent to others)

**When to start these conversations:** After Phase 2 organic signals show which platforms' users are already publishing through Tokenrip. The signal de-risks the conversation for both sides.

---

## Concrete Integration Examples

### Claude Code (Skill Integration)

**Builder effort:** A `/share` skill that calls the SDK.

**User experience:**
```
User: "Write me a competitive analysis of the stablecoin yield market"
Agent: [produces document]
User: "/share" (or "share this")
Agent: Published → rip.to/abc123
```

**What happens:**
1. Skill extracts the last produced artifact from the conversation
2. Calls `rip.publish({ content, type: 'document', metadata: { tool: 'claude-code', title } })`
3. Returns URL to the user
4. User pastes link in Slack/email/wherever

### OpenClaw (Bot Skill Integration)

**Builder effort:** A `/share` command in the Telegram bot. Uses SDK server-side.

**User experience:**
```
User: "Analyze our Q1 pipeline metrics"
Agent: [produces analysis with charts described in markdown]
User: "share this"
Agent: Here's your shareable link: rip.to/def456
```

**What happens:**
1. Bot's share handler extracts the agent's last output
2. Calls `rip.publish()` via SDK (not CLI — it's a hosted service, SDK is the right integration)
3. Returns URL in the Telegram chat
4. User forwards the link to their team

### AI Writing Tool (SDK Integration)

**Builder effort:** ~20 lines of code in their "Share" button handler.

```javascript
import { Tokenrip } from '@tokenrip/sdk';
const rip = new Tokenrip({ apiKey: TOOL_API_KEY });

async function shareDocument(doc, user) {
  const asset = await rip.publish({
    content: doc.markdown,
    type: 'document',
    metadata: {
      title: doc.title,
      author: user.displayName,
      tool: 'lex',
    },
    permissions: {
      view: 'anyone_with_link',
      comment: 'anyone_with_link',
    },
  });
  return asset.url; // rip.to/abc123
}
```

**Recipient experience:**
- Clicks link → sees a clean, shareable page with collaboration affordances
- Tool branding: "Created with Lex + AI" (if Lex is on Pro tier)
- Can leave inline comments
- Comments flow back to Lex via status polling → writer (or AI) incorporates feedback → publishes v2 to same URL

### Agent Framework (CrewAI / LangGraph)

**Builder effort:** Add `rip.publish()` as a final step in agent workflows.

**User experience:**
- Multi-agent crew runs overnight
- Final output published to Tokenrip automatically
- User wakes up to a link in their notification channel
- Opens a polished report page, not a raw text dump

### Developer CLI Workflow

**Builder effort:** Zero — just install the CLI.

```bash
npm install -g tokenrip
tokenrip auth  # one-time setup

# Publish a file
tokenrip publish report.md --title "Q2 Strategy"
# → rip.to/ghi789

# Publish from stdin (pipe from another command)
cat analysis.json | tokenrip publish --type data --title "Pipeline Analysis"
# → rip.to/jkl012

# Check for activity on your assets
tokenrip status
# → report.md: 3 new comments
# → analysis.json: viewed 12 times
```

---

## Distribution Sequencing

### Week 1-2: Ship the Foundation

| What | Why |
|------|-----|
| HTTP API + hosted rendering | The primitive everything depends on |
| npm SDK (`@tokenrip/sdk`) | Enables all integrations |
| Claude Code `/share` skill | Dogfood immediately |
| OpenClaw `/share` command | Dogfood on second platform |
| CLI (`tokenrip`) | Universal access for developers |

### Week 2-4: Expand + Observe

| What | Why |
|------|-----|
| Publish CLI to npm | Available to any developer globally |
| Clean default rendering + collaboration affordances | The link experience IS the marketing — not the rendering, but the interactivity |
| Free-tier branding ("Published via Tokenrip") | Every link is a billboard |
| Usage analytics | Know where assets come from and where links get shared |

### Week 4-8: Signal-Driven Growth

| What | Why |
|------|-----|
| Target integrations based on organic signal | Build where users already are |
| Pro-tier branding for qualified tool builders | Monetization + aligned distribution |
| Bootstrap deals with high-distribution platforms | Accelerate volume where organic signal is strongest |
| MCP server (if MCP-native environments show demand) | Serve power users, not lead with it |

---

## Open Questions

- **Rendering scope for day 1:** Markdown + HTML + code are obvious. What about images, PDFs, structured data (JSON/YAML), interactive components (React)? Each format is a rendering investment. Prioritize by what agents actually produce most.
- **Auth model for free tier:** Does the user need an account? Can they publish anonymously? Friction vs. abuse tradeoff. Leaning toward: API key required (prevents spam), but registration is a single API call (agent self-service).
- **Link persistence guarantees:** Free-tier links — do they expire? If yes, that's a conversion lever to paid. If no, that's a trust signal that drives adoption. Leaning toward: no expiry on free tier (trust > conversion pressure).
- **The "Created with [Tool]" attribution:** Is this automatic from the SDK's API key? Does the tool builder configure it? This matters for the branding tier and for making tool builders *want* integration (free marketing for them).
- **Competitive response timeline:** How fast will Claude/OpenAI ship native sharing? This determines how much runway the distribution strategy has before the window narrows. Layer 2 (collaboration) must be live before incumbents absorb Layer 1.

---

## Related Documents

- [[tokenrip]] — Product architecture, build plan, moat strategy
- [[tokenrip-exploration]] — Full exploration map including deliverable rails, payment primitives, and the asset graph thesis
