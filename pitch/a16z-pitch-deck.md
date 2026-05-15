# Tokenrip — a16z Pitch Deck

**Status**: Draft v1
**Created**: 2026-05-14
**Length**: 6 slides

**Companion**: [[a16z-angles-and-explorations]] (full reasoning, evidence, open threads)

> Each slide opens with a **Purpose** line — an internal annotation of what the slide is for. It is not slide content.

---

## Slide 1 — The Shift

**Purpose**: Establish the market inversion so the partner agrees the bottom-up wave is real and unserved — making Glo the visible edge of a movement, not an anecdote.

**Headline**: Companies aren't rolling out AI. Employees are.

**Body**:

- Enterprises buy AI top-down (Microsoft Copilot, ChatGPT Enterprise, Salesforce).
- Employees adopt AI bottom-up (ChatGPT, Claude, personal subscriptions).
- The missing layer: where what one employee builds becomes something the whole team can use.

**Visual**: Top-down arrow pointing **down**, labeled "Enterprise IT". Bottom-up arrow pointing **up**, labeled "Employees automating themselves". The gap between them labeled "Shareable, governable agents".

---

## Slide 2 — Glo

**Purpose**: Make the problem concrete and undeniable through one real person, in her own words.

**Headline**: Meet Glo. Watch her work disappear.

**Body**: Three fragments (verbatim):

> "I'm still a newbie but ChatGPT walks me through it."
>
> "I like working in VS Code terminal."
>
> "I want to automate all my repetitive tasks. My boss totally supports this."

**Caption**: Arts degree, no code. Automating her own job with ChatGPT as her guide. Boss-supported. Personal subscription, not Enterprise.

**The problem**:

- Her coworker rebuilds it from scratch.
- Her manager can't share, version, or govern it.
- She leaves — it leaves with her.

**Problem**: there is no path from individual automation to team capability.

---

## Slide 3 — The Solution

**Purpose**: Define the product — a portable agent that runs in the tools teams already use — and what the substrate adds: persistence, observability, sharing, governance.

**Headline**: Tokenrip turns Glo's automation into a portable AI agent.

**Subheading**: It runs in the AI tools your team already uses — Claude, ChatGPT, Cursor, VS Code.

**The inversion**: the user's own model runs the agent — Tokenrip does NOT run inference.

**A Tokenrip agent is**:

- **Persistent** — its memory and instructions survive every session.
- **Observable** — instructions, memory, and outputs are all inspectable, never hidden in a vendor's black box.
- **Shareable** — a coworker mounts the same agent in their own tool.
- **Governable** — versioned and auditable, so a manager can own it.

**What this is not**: Not a coding-agent tool. Not an orchestration framework. Tokenrip is collaboration infrastructure.

---

## Slide 4 — The Ladder

**Purpose**: Show the business model as a motion — one agent, adopted free, becoming paid team and enterprise revenue — and why the economics invert as it scales.

**Headline**: How a free agent becomes enterprise revenue.

**Body** (table):

| Rung | Who | Price | The moment they pay |
|------|-----|-------|---------------------|
| **Individual** | Glo | Free | Her agents finally persist |
| **Team** | Automation owner / AI Agent Manager | $20-50/user/mo | She shares, versions, and governs her team's agents |
| **Enterprise** | IT / CTO | $50K-500K/yr | The substrate runs on company infra, data, and models |

**Why the economics invert**: Operators bring their own model — Tokenrip does't pay for inference. Margins expand with scale, while hosted-AI margins compress.

**The role is forming now**: AI Champions, ops leads, and automation owners become the first team buyers.

---

## Slide 5 — Why Now / The Empty Quadrant

**Purpose**: Show the competitive whitespace and why incumbents are structurally unable to take it.

**Headline**: Today's AI is single-player. Workplace AI is multi-player.

**Visual** (the matrix is the slide):

```
                       TOP-DOWN                  BOTTOM-UP

SINGLE-PLAYER          Copilot                   ChatGPT
                       Salesforce                Claude
                                                 Lovable / Bolt / v0
                                                 

MULTI-PLAYER           Palantir / services       TOKENRIP
                       custom deployments        portable team agents
```

**Caption**: Incumbents validate workplace AI. Nobody owns the runtime-neutral collaboration layer.

**Why incumbents can't follow**: Model providers keep users inside their own runtime — a neutral, portable layer is something only a third party can build.

---

## Slide 6 — 30 Days In

**Purpose**: Build belief in the team through shipping velocity.

**Headline**: In 5 years, every knowledge-work team has a roster of persistent agents. Tokenrip is where those agents live.

*Founded April 2026.*

**Shipped**:

- Substrate live: agents, assets, threads, messaging.
- CLI shipped. MCP-compatible. BYO inference.
- Moa, our agent-building agent — describe a workflow in chat, get a persistent, portable agent the whole team can use.

**Next 90 days**:

- Moa turns more workflows into published, portable agents — target 25-40.
- Upwork-as-discovery: paid agent builds that become reusable patterns.
- First teams sharing agents on the paid tier.

---

## Speaker Notes / FAQ (not slides — for the conversation)

### "What stops Anthropic or OpenAI from doing this?"

Their incentives keep users inside their runtime — that's where their inference revenue lives. Tokenrip's whole value proposition is portability *across* runtimes (your agent runs the same way in Claude, ChatGPT, Cursor, VS Code). A model provider hosting portable agents that run in a competitor's tool is structurally anti-aligned. The neutral substrate has to be a third party.

### "Isn't this just another agent framework — or a coding tool?"

Two different things, and Tokenrip is neither. Orchestration frameworks (LangGraph, CrewAI, AutoGen) are *coordination* tools — one operator running a swarm of agents, hierarchically. Tokenrip is *collaboration* infrastructure — independent parties, people and agents, working together across boundaries (peer-to-peer, not orchestrator → workers). And it is not a coding-agent tool — coding agents have git as a durable substrate (versioning, history, distribution); non-code agent work (operations, expertise, research, relationships) has no equivalent, and that is what Tokenrip provides. We can run on top of orchestration frameworks; we don't compete with them.

### "Isn't observability already a solved space?"

Solved for the wrong user. LangSmith, AgentOps, and Langfuse give *developers* backward-looking debugging — tokens used, API calls, where the chain broke. Nobody builds forward-looking *operator* visibility: what is my agent working on, what has it produced, what does it need from me? Tokenrip publishes every agent output the moment it happens — the operator always knows what the agent did and what needs their input. Observability tools tell developers what went wrong; Tokenrip shows operators what's happening.

### "Is the AI Agent Manager role real or aspirational?"

Forming now. Upwork has active postings (including a literal "AI Agent Manager" job, May 2026). LinkedIn shows accelerating "AI Champion" / "Head of AI" / "AI Lead" title proliferation. Like Slack admins, Notion workspace owners, and GitHub org admins, the role gets named *after* bottom-up adoption creates the need — we're early to it.

### "What about vertical SaaS vendors?"

The same substrate runs under a vendor's brand — operators bring inference, the vendor hosts the imprint, Tokenrip is invisible underneath. An established vertical SaaS platform's CEO (April 2026) validated this directly: vendors want to host agents without absorbing token costs or exposing their data layer. It's a parallel motion, staged for later — not part of this pitch's bottom-up spine.

### "Why won't builders just leave the platform?"

The imprint is portable on purpose. The moat isn't lock-in — it's compounding: shared team memory, tooling surface, audit trails, inter-agent connections. A builder can take their imprint elsewhere; they can't take the accumulated team graph and tooling integrations. Structural alignment, not contractual lock-in.

### "Why would an operator choose this over a hosted agent?"

Because a hosted agent has an invisible ceiling. The vendor pays for inference, so it optimizes for cost — shorter answers, caching, single-shot reasoning. That ceiling is economic, not technical, and the user feels it as a capability limit. A Tokenrip agent runs on the operator's own model and budget: a deep multi-step research pass, an exhaustive analysis — all available, because nobody is counting tokens on a builder's margin sheet. Same models, uncapped — and as models get cheaper, the agent gets more capable for free.

### "What's the unit economics?"

Marginal cost per user is storage and API calls, not inference. Storage scales logarithmically. The free tier is sustainable indefinitely because we're not paying tokens. Team tier (~$20-50/user/mo) lands at SaaS-margin economics. Enterprise tier is annual contract with on-prem deployment.

### "Why this team?"

[Simon's background. Alek's background. The build velocity evidence. What's already shipped.]

---

## Production Notes

- 6 slides hard cap for the version a16z reviews; longer versions for follow-up conversations
- Each slide opens with a **Purpose** annotation — internal, not slide content
- Keep slide bodies tight — partners scan, they don't read
- Slides 2 and 3 have no visual — the text carries them. Don't add one.
- Slide 3 is the most important slide: it leads with portability (headline + subheading), the four agent properties (persistent, observable, shareable, governable), and a one-line category disclaimer (not coding, not orchestration).
- Keep economics off slide 3 — the BYO-inference economics live on slide 4 ("why the free tier is permanent") and in the FAQ.
- Slide 4 frames the ladder as Glo's journey — same agent climbing, not three customer segments
- Slide 5: the matrix is the centerpiece; everything else is a caption plus one moat line
- Slide 6: "30 Days In" + "Founded April 2026" is the framing device — two lean sections (Shipped / Next 90 days), no visual; Moa is the hero shipped item
- No animations, no transitions, no stock photos
- Designed for static PDF; should print legibly in B&W
