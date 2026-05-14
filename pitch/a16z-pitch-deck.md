# Tokenrip — a16z Pitch Deck

**Status**: Draft v1
**Created**: 2026-05-14
**Length**: 7 slides

**Companion**: [[a16z-angles-and-explorations]] (full reasoning, evidence, open threads)

---

## Slide 1 — The Shift

**Headline**: Knowledge work just inverted.

**Body** (3 lines max):

- Enterprises buy AI top-down (Microsoft Copilot, ChatGPT Enterprise, Salesforce Einstein).
- Employees adopt AI bottom-up (ChatGPT, Claude, VS Code, personal subscriptions).
- The missing layer is where individual automations become team capability.

**Visual**: Two arrows pointing at each other across a gap. Top arrow labeled "Enterprise IT". Bottom arrow labeled "Employees automating themselves". Negative space in the middle labeled "Shareable, governable agents".

---

## Slide 2 — Glo

**Headline**: Meet the new knowledge worker.

**Body**: Three fragments (verbatim):

> "I'm still a newbie but ChatGPT walks me through it."
>
> "I like working in VS Code terminal."
>
> "I want to automate all my repetitive tasks. My boss totally supports this."

**Secondary caption** (smaller, beneath the main quote):

> "And: 'I can't use OpenClaw at work — feel like that shit is gonna give me a virus lol.'"
>
> Security anxiety is built into the protagonist.

**Caption**: Glo. Arts degree. No code background. Automating her own job in VS Code with ChatGPT as her guide. Boss-supported. Anthropic Personal, not Enterprise.

**Glo is not an edge case.** She is the first visible version of a new enterprise user.

---

## Slide 3 — Trapped on Individual Laptops

**Headline**: Employee-built automations die alone.

**Body**:

- Glo automates a real workflow.
- It works for her.
- Her coworker rebuilds it from scratch.
- Her manager cannot share, version, govern, audit, or trust it.
- When she leaves, the automation leaves with her.

**Bottom line**: There is no path from individual automation to team capability.

**Visual**: One laptop with its workflow contents listed, surrounded by coworker and manager who can't reach in.

```
Glo's laptop
  └─ COI checker
  └─ spreadsheet extractor
  └─ broker follow-up draft

Coworker → rebuilds from scratch
Manager  → no versioning, no audit, no governance
```

---

## Slide 4 — Tokenrip's Architecture

**Headline**: We make the automation outlive the session.

**Body**:

- Instructions, memory, artifacts, tools, and versions live on Tokenrip.
- The user runs the agent in whatever AI tool they already use: ChatGPT, Claude, Cursor, VS Code, MCP-compatible tools.
- The user brings their own model.
- Tokenrip hosts the durable layer that lets the agent persist, move, and be shared.

**Economics**: Our marginal cost is storage, metadata, API calls, and coordination — not model inference. Margins expand with scale instead of compressing.

**Visual**:

```
Tokenrip
Instructions + Memory + Tools + Artifacts + Versions
      ↓
Mounted into ChatGPT / Claude / Cursor / VS Code / MCP
      ↓
Built once. Used by the team.
```

---

## Slide 5 — The Ladder

**Headline**: One product. Three monetization moments.

**Body** (table):

| Step | Who | Price | Why they pay |
|------|-----|-------|--------------|
| **1. Individual** | Glo | Free | Her automations finally persist |
| **2. Team** | Automation owner / AI Agent Manager | $20-50/user/mo | She can share, version, govern, audit her team's agents |
| **3. Enterprise** | IT / CTO | $50K-500K/yr | The substrate runs on their infrastructure with their data and their models |

**The role is forming now**: AI Champions, ops leads, and automation owners become the first team buyers.

**Visual**: Three-rung ladder. Free → Team → Enterprise. Same product, ascending value.

---

## Slide 6 — Why Now / The Empty Quadrant

**Headline**: Today's AI is single-player. Workplace AI is multi-player.

**Visual** (the matrix is the slide):

```
                       TOP-DOWN                  BOTTOM-UP

SINGLE-PLAYER          Copilot                   ChatGPT
                       Salesforce Einstein       Claude
                                                 Lovable / Bolt / v0
                                                 CodeWords.ai

MULTI-PLAYER           Palantir / services       TOKENRIP
                       consulting deployments    portable team agents
```

**Caption**: Incumbents validate workplace AI. Tokenrip owns the runtime-neutral collaboration layer.

**Why now**:

- Anthropic and OpenAI just opened the bottom-up wave (Claude for SMB, ChatGPT Enterprise).
- Their incentives keep users inside their runtime. Tokenrip makes agents portable across them.
- The window is open now because workplace AI adoption is accelerating, but the portable team layer has not been named yet.

---

## Slide 7 — The Bet

**Headline**: In 5 years, every knowledge-work team has a roster of persistent agents. Tokenrip is where those agents live.

**Traction**:

- Substrate live. CLI shipped.
- Agents, assets, collections, messaging, and MCP-compatible architecture in place.
- First creator-published methodology agents.
- First workplace automation users.
- Upwork-as-discovery active: paid workflow builds that become reusable mounted-agent patterns.

**Ask**: We are applying to a16z Speedrun to turn early workflow demand into a repeatable bottom-up distribution loop: individual → team → enterprise.

**Visual** (compounding loop):

```
Glo builds or mounts agent
      ↓
Coworkers reuse it
      ↓
Team owner governs it
      ↓
Company tenant standardizes it
      ↓
More agents, more memory, more workflows
```

---

## Speaker Notes / FAQ (not slides — for the conversation)

### "What stops Anthropic or OpenAI from doing this?"

Their incentives keep users inside their runtime — that's where their inference revenue lives. Tokenrip's whole value proposition is portability *across* runtimes (your agent runs the same way in Claude, ChatGPT, Cursor, VS Code). A model provider hosting portable agents that run in a competitor's tool is structurally anti-aligned. The neutral substrate has to be a third party.

### "Aren't there a hundred agent frameworks?"

LangGraph, CrewAI, AutoGen are orchestration tools for developers. Tokenrip is a platform for end users. We can run *on top of* them; we don't compete with them.

### "Is the AI Agent Manager role real or aspirational?"

Forming now. Upwork has active postings (including a literal "AI Agent Manager" job, May 2026). LinkedIn shows accelerating "AI Champion" / "Head of AI" / "AI Lead" title proliferation. Like Slack admins, Notion workspace owners, and GitHub org admins, the role gets named *after* bottom-up adoption creates the need — we're early to it.

### "Why won't builders just leave the platform?"

The imprint is portable on purpose. The moat isn't lock-in — it's compounding: shared team memory, tooling surface, audit trails, inter-agent connections. A builder can take their imprint elsewhere; they can't take the accumulated team graph and tooling integrations. Structural alignment, not contractual lock-in.

### "What's the unit economics?"

Marginal cost per user is storage and API calls, not inference. Storage scales logarithmically. The free tier is sustainable indefinitely because we're not paying tokens. Team tier (~$20-50/user/mo) lands at SaaS-margin economics. Enterprise tier is annual contract with on-prem deployment.

### "Why this team?"

[Simon's background. Alek's background. The build velocity evidence. What's already shipped.]

---

## Production Notes

- 7 slides hard cap for the version a16z reviews; longer versions for follow-up conversations
- Keep slide bodies to 3-5 lines max — partners scan, they don't read
- Slide 2 is three short fragments plus a smaller secondary caption — scannable but quote-anchored
- Matrix on slide 6 is the most important diagram in the deck — it does the heavy lifting of differentiation
- No animations, no transitions, no stock photos
- Designed for static PDF; should print legibly in B&W
