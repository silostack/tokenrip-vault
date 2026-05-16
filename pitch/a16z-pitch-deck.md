# Tokenrip — a16z Pitch Deck

**Status**: Draft v2
**Created**: 2026-05-14
**Updated**: 2026-05-15
**Length**: 6 slides (cover + 5 content)

**Companion**: [[a16z-angles-and-explorations]] (full reasoning, evidence, open threads)

> Each slide opens with a **Purpose** line — an internal annotation of what the slide is for. It is not slide content. Inline `>` notes are design direction for whoever renders the PDF.

---

## Slide 1 — Cover

**Purpose**: Open the deck by stating what Tokenrip is and where it is going — identity and ambition. The problem belongs to slide 2; the cover must not duplicate it.

**Company**: TOKENRIP

**Headline**: Portable AI agents shared with your team.

**Vision line**: In 5 years, every knowledge-work team has a roster of persistent agents. Tokenrip is where those agents live.

**Founders**: Simon Pettibone & Alek Perak — second-time founders, previously RebelFi.

**Context**: a16z Pitch · May 2026 · Founded April 2026

> Keep the TR monogram treatment. No problem statement on the cover — slide 2 owns the problem.

---

## Slide 2 — The Problem

**Purpose**: Establish the problem — the market shift built into the headline — made concrete and high-stakes through Glo: the loss lands on the team, not just her.

**Headline**: Employees are automating their own jobs with AI. Their team is left with nothing.

> Render both clauses at headline weight — the second clause ("Their team is left with nothing") in the accent color. Do not demote it to a grey subheading.

**Glo is one of them** — in her own words:

> "I'm still a newbie but ChatGPT walks me through it."
>
> "I like working in VS Code terminal."
>
> "I want to automate all my repetitive tasks. My boss totally supports this."

**Caption**: Arts degree, no code. Automating her own job with ChatGPT as her guide. Boss-supported. Personal subscription, not Enterprise.

**Everyone around her loses**:

1. **A coworker rebuilds it from scratch** — no handoff, no shared version.
2. **Her manager can't see it or govern it** — automation running invisibly inside the org.
3. **When she leaves, it leaves with her** — the institutional knowledge walks out the door.

> Section header stays "Everyone around her loses" — not "When Glo leaves." The first two losses are true while she is still employed.

---

## Slide 3 — The Solution

**Purpose**: Define the product — a portable agent that runs in the tools teams already use — and walk the four-step workflow that reverses slide 2's losses.

**Headline**: Tokenrip turns Glo's automation into a portable AI agent.

**Subheading**: It runs in the AI tools your team already uses — Claude, ChatGPT, Cursor, VS Code.

**The inversion** (callout): Your model runs the agent — Tokenrip never runs inference.

> Render the inversion as a filled, emphasized box — not a thin-bordered footnote. It states architecture only. Do not add economics ("margins expand with scale") here — that lives on slide 4.

**The workflow** (four steps):

1. **Publish** — Glo publishes her agent to Tokenrip. Versioned, persistent, portable.
2. **Mount** — A coworker mounts it in Claude, or any MCP-compatible client, instantly.
3. **Govern** — Her manager sees operations, outputs, and a full audit trail in real time.
4. **Persist** — The agent survives Glo's departure. Team memory compounds.

> Size the four step-cards to their content — avoid tall, near-empty cards.

**What this is not**: Not a coding-agent tool. Not an orchestration framework. Tokenrip is collaboration infrastructure — complementary to LangGraph, CrewAI, AutoGen.

---

## Slide 4 — The Ladder

**Purpose**: Show the business model as a motion — one agent, adopted free, becoming paid team and enterprise revenue — and why the economics invert as it scales.

**Headline**: How a free agent becomes enterprise revenue.

> Headline is "How a free agent becomes enterprise revenue" — not "The Ladder." Do not add a subheading that restates it.

**Body** (render as three tier cards):

| Rung | Who | Price | The moment they pay |
|------|-----|-------|---------------------|
| **Individual** | Glo | Free | Her agents finally persist |
| **Team** | Automation owner / AI Agent Manager | $20-50/user/mo | She shares, versions, and governs her team's agents |
| **Enterprise** | IT / CTO | $50K-500K/yr | The substrate runs on company infra, data, and models |

**Why the economics invert**: Operators bring their own model — Tokenrip doesn't pay for inference. Margins expand with scale, while hosted-AI margins compress.

**The role is forming now**: AI Champions, ops leads, and automation owners become the first team buyers.

---

## Slide 5 — Why Now

**Purpose**: Show the competitive whitespace and why incumbents are structurally unable to take it.

**Headline**: Today's AI is single-player. Workplace AI is multi-player.

**Visual** (the matrix is the slide):

```
                    TOP-DOWN                        BOTTOM-UP

  SINGLE-PLAYER     Incumbents                      Consumer AI
                    Copilot, Salesforce             ChatGPT, Claude, Lovable/Bolt/v0

  MULTI-PLAYER      Services                        TOKENRIP
                    Palantir, custom deployments    Portable team agents, runtime-neutral
```

> Render the matrix large — it is the centerpiece. Fill the Tokenrip quadrant with the accent color so it reads instantly as the open space. Make the axis labels (TOP-DOWN / BOTTOM-UP / SINGLE-PLAYER / MULTI-PLAYER) large and legible.

**Caption**: Incumbents validate workplace AI. Nobody owns the runtime-neutral collaboration layer.

**Why incumbents can't follow**: Model providers keep users inside their own runtime — a neutral, portable layer is something only a third party can build.

> One moat line only. Do not add side boxes for observability or the compounding moat — those stay in the FAQ.

---

## Slide 6 — Traction & Team

**Purpose**: For a pre-traction company the founders are the bet. Show velocity as team-proof — a substrate shipped in six weeks — and a pair that covers both halves of the problem: go-to-market with founder-market-fit, and the technical capability to build the substrate.

**Headline**: One founder lived the problem. The other built the fix.

**Stat row**:

- **6 weeks** — since founding
- **April 2026** — founded
- **Live** — substrate, CLI, Moa
- **MCP-native** — from day one

**Shipped**:

- Substrate live: agents, assets, threads, messaging.
- CLI shipped. MCP-compatible. BYO inference.
- Moa, our agent-building agent — describe a workflow in chat, get a persistent, portable agent the whole team can use.

**Next 90 days**:

- Moa turns more workflows into published, portable agents — target 25-40.
- Upwork-as-discovery: paid agent builds that become reusable patterns.
- First teams sharing agents on the paid tier.

**Alek — Go-to-market**: Worked title companies and real-estate closings firsthand, both sides. Watched institutional knowledge walk out the door every time an employee left. Now running outreach to thousands of title companies and insurance brokers.

**Simon — Technical**: Twenty years an engineer — VP of Backend Engineering at RealtyCrunch (acquired by The Real Brokerage, NASDAQ: REAX), then co-founded RebelFi with Alek. Built the entire Tokenrip substrate solo in six weeks, MCP-native from day one.

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

---

## Production Notes

- 6 slides for the version a16z reviews (cover + 5 content); longer versions for follow-up conversations.
- Each content slide opens with a **Purpose** annotation — internal, not slide content.
- Keep slide bodies tight — partners scan, they don't read.
- This markdown is the content source of truth; the rendered PDF is produced from it. Keep them in sync.
- **The founding figure is locked at "6 weeks" / "Founded April 2026."** Use it consistently — cover context line, slide 6 stat row, Simon's bio ("six weeks"). Do not let it drift to "4 weeks."
- **Slide 1 (cover)**: identity headline + the 5-year vision line + a one-line founder credit. No problem statement on the cover — slide 2 owns the problem. Keep the TR monogram.
- **Slide 2**: render the headline as two clauses at equal (headline) weight, the second clause in the accent color — do not demote it to a grey subheading. The three losses use a numbered treatment; the section header is "Everyone around her loses," not "When Glo leaves."
- **Slide 3**: the "inversion" callout is a filled, emphasized box and states architecture only — "Tokenrip never runs inference." Do NOT add economics here; that lives on slide 4. Size the four step-cards to their content — avoid tall, near-empty cards.
- **Slide 4**: headline is "How a free agent becomes enterprise revenue" — not "The Ladder." No subheading restating the headline. Three tier cards; the two notes (economics inversion, emerging buyer) sit below.
- **Slide 5**: the matrix IS the slide — render it large, fill the Tokenrip quadrant with the accent color, and make the axis labels big and legible. One moat line only. Do not add side boxes — observability and the compounding moat stay in the FAQ.
- **Slide 6**: traction and team merged. Headline is the founder line; velocity reads through the stat row. The 5-year vision is NOT here — it moved to the cover.
- The inverted model is split deliberately: slide 3's callout states the architecture, slide 4's "Why the economics invert" states the economics. "Margins expand with scale" appears once — on slide 4.
- No animations, no transitions, no stock photos.
- Designed for static PDF; should print legibly in B&W — accent-color fills need a B&W fallback (heavier border or tint).

## To confirm before the deck is final

- Simon's bio: the RealtyCrunch acquisition by The Real Brokerage and the NASDAQ ticker (REAX) are drafted from `active/a16z-speedrun-application-2026-05-15.md` — verify both.
- Founder last names on the cover (Pettibone / Perak).
