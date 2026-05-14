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
- The two sides aren't meeting. The gap has no home.

**Visual**: Two arrows pointing at each other across a gap. Top arrow labeled "Enterprise IT". Bottom arrow labeled "Employees automating themselves". Negative space in the middle labeled "?".

---

## Slide 2 — Glo

**Headline**: Meet the new knowledge worker.

**Body**: Verbatim quote (no paraphrase, no fixes):

> "I'm still a newbie but ChatGPT walks me through it. Mainly trying to find ways to automate repetitive tasks at work...
>
> I like working in VS Code terminal...
>
> I want to basically automate all of my most repetitive tasks. My boss totally fully supports this...
>
> I can't use OpenClaw at work nor do I want to because I feel like that shit is gonna give me a virus lol."

**Caption**: Glo. Arts degree. No code background. Automating her own job in VS Code with ChatGPT as her guide. Boss-supported. Anthropic Personal, not Enterprise.

**There are millions of Glos.** They are bootstrapping the bottom-up wave with no platform.

---

## Slide 3 — The Graveyard

**Headline**: Every Glo's automation dies on her laptop.

**Body**:

- She figures out how to automate her COI workflow.
- It works for her.
- Her coworker has to rebuild it from scratch.
- Her team has no way to share it, version it, govern it, or trust it.
- Six months later she changes jobs and it's gone.

**The gap**: there is no path from individual automation to team capability. The session is the product. The session ends. The work dies.

**Visual**: A graveyard of laptops, each labeled with a dead automation ("Sarah's COI bot", "Mike's invoice agent", "Glo's spreadsheet extractor").

---

## Slide 4 — Mounted Agents

**Headline**: We make the automation outlive the session.

**Body**:

- The agent's instructions, memory, and tools live on Tokenrip.
- The user runs it in whatever AI tool they already use (ChatGPT, Claude, VS Code, Cursor).
- The user pays for their own AI. We host everything else.
- The automation persists. The team can mount it. The company can govern it.

**Why we win on economics**: We don't pay for inference. Users do. Our cost is storage. Margins expand with scale instead of compressing.

**Visual**: Three boxes — `Instructions + Memory + Tools (Tokenrip)` → `Runs in (ChatGPT / Claude / Cursor / VS Code)` → `Built once, used by anyone on the team`.

---

## Slide 5 — The Ladder

**Headline**: One product. Three monetization moments.

**Body** (table):

| Step | Who | Price | Why they pay |
|------|-----|-------|--------------|
| **1. Individual** | Glo | Free | Her automations finally persist |
| **2. Team** | AI Agent Manager | $20-50/user/mo | She can share, version, govern, audit her team's agents |
| **3. Enterprise** | IT / CTO | $50K-500K/yr | The substrate runs on their infrastructure with their data and their models |

**The "AI Agent Manager" is a real role**, emerging now (Upwork postings, LinkedIn "AI Champion" titles, growing 12-month trend). Like the Slack admin or the Notion workspace owner — created *by* the platform existing.

**Visual**: Three-rung ladder. Free → Team → Enterprise. Same product, ascending value.

---

## Slide 6 — Why Now / The Empty Quadrant

**Headline**: Everyone is building the wrong shape.

**Visual** (the matrix is the slide):

```
                 TOP-DOWN                BOTTOM-UP

SINGLE-       Microsoft Copilot      ChatGPT, Claude
PLAYER        Salesforce Einstein    CodeWords.ai
                                     Lovable / Bolt / v0

MULTI-        McKinsey deployments   TOKENRIP
PLAYER        Palantir-style         ← empty
              (slow, expensive)
```

**Caption** (one line): The bottom-up multi-player quadrant is empty because no one's architecture supports it. Mounted agents do.

**Why now** (three lines max):

- Anthropic and OpenAI just opened the bottom-up wave (Claude for SMB, ChatGPT Enterprise).
- Their economics (selling inference) are structurally hostile to BYO model + portability.
- The window is 12-24 months before this gets named by someone.

---

## Slide 7 — The Bet

**Headline**: In 5 years, every knowledge-work team has a roster of mounted agents managed by an AI Agent Manager. We're the substrate.

**Traction**:

- Substrate live. CLI shipped April 2026.
- First creators publishing methodology agents (Motion E supply layer).
- First Glos mounting them (workplace demand side).
- Upwork-as-discovery active: paid gigs that double as customer discovery and produce reusable mounted agents on the platform.

**Asks**: [accelerator slot, capital amount, what we'll do with it]

**Visual**: A line going up. Y-axis: "Teams with mounted-agent rosters". X-axis: 2026 → 2031. Tokenrip's line is the slope. Anthropic / OpenAI / Microsoft lines run flat in the multi-player quadrant.

---

## Speaker Notes / FAQ (not slides — for the conversation)

### "What stops Anthropic or OpenAI from doing this?"

Their entire business is selling inference. Mounted agents work because the user pays for their own model. Anthropic eating their own margin to host portable agents that run in OpenAI's tools is structurally impossible. Same in reverse. The neutral substrate has to be a third party.

### "Aren't there a hundred agent frameworks?"

LangGraph, CrewAI, AutoGen are orchestration tools for developers. Tokenrip is a platform for end users. We can run *on top of* them; we don't compete with them.

### "Is the AI Agent Manager role real or aspirational?"

Real and growing. Upwork has active postings (literal "AI Agent Manager" job, May 2026). LinkedIn shows accelerating "AI Champion" / "Head of AI" / "AI Lead" title proliferation. Like every prior bottom-up wave, the role gets named *after* the platform exists — we're early to it.

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
- Glo's quote should be on screen long enough to read (slide 2 is intentionally text-heavy; this is the only slide that breaks the rule)
- Matrix on slide 6 is the most important diagram in the deck — it does the heavy lifting of differentiation
- No animations, no transitions, no stock photos
- Designed for static PDF; should print legibly in B&W
