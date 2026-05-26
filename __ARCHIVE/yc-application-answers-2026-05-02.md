# YC Application — Draft Answers

**Status**: Working draft
**Target submission**: Mon May 5, 2026
**Reference**: [[yc-strategy]], [[../bd/motions-and-strategy]], [[../bd/audience-led-gameplan]]

---

## Founders

**Q1. Who writes code, or does other technical work on your product? Was any of it done by a non-founder? Please explain.**

Opus and gpt write all the code, operated by Simon. No other technical work is done by anyone else.

**Q2. Are you looking for a cofounder?**

No.

---

## Company

**Q4. Company name**

Tokenrip

**Q5. Describe what your company does in 50 characters or less.**

> [LOCKED 2026-05-16 — 41 chars. Anchored on portability (the moat) + team-sharing (multiplayer thesis), not persistence (table stakes — claimed everywhere). "Portable" is defined by Q10.]

Portable AI agents shared with your team.

**Q6. Company URL, if any**

https://tokenrip.com

**Q7. Demo video — see companion doc.**

-- to be recorded May 4

**Q8. Please provide a link to the product, if any.**

https://tokenrip.com/agents

**Q9. If login credentials are required for the link above, enter them here.**

No credentials required. 

**Q10. What is your company going to make? Please describe your product and what it does or will do.**

> [LOCKED 2026-05-15 — reframed to Glo/bottom-up. Opening line and reference-agent names are Simon-to-finalize.]

Tokenrip is where AI agents live so they don't die at the end of a session.

A user — say Glo, a non-technical employee automating her own repetitive work — connects Tokenrip to whatever AI tool she already uses (ChatGPT, Claude, Cursor, the VS Code terminal) over MCP. Nothing new to install or learn. The first thing she meets is Moa, our agent-building agent, which is live today. Moa interviews her about a task she wants automated and walks her through building her first agent. She ends the session with a working agent she can invoke — plus a plain-English breakdown of its memory, its workflows, and its operating instructions.

The difference from a Custom GPT or a saved prompt is persistence. The agent remembers. The session doesn't die. Glo never re-pastes or rebuilds context — she leaves a task halfway and picks it up the next day, or the next week.

Live today: the substrate (versioned agents, persistent memory, MCP access from any tool) and Moa. Two reference agents are published. What we're building next is the team layer — Glo's coworker mounts her agent in their tool, her manager versions and governs the team's agents. That graduation — an individual's automation becoming team infrastructure — is the company.

**Q11. Where do you live now, and where would the company be based after YC?**

Simon lives in Colombia and Alek lives in Austin. After YC, the company will be completely based in the US (Simon will relocate back the the US).

**Q12. Explain your decision regarding location.**

We both feel that once we expand beyond a 2-person founding team, company growth (especially as a startup), should occur in a single location (and office). 

---

## Progress

**Q13. How far along are you?**

Platform deployed (April 2026). CLI live. Five-layer mounted-agent architecture shipping: assets (versioned imprints), collections (structured memory), threads (typed messaging), teams, and folders. Two agents published — Office Hours (YC-style pitch diagnostics) and Chief of Staff (team-scoped accountability agent with layered memory). Chief of Staff is in active dogfooding with both founders using it daily across multiple harnesses. MCP endpoint live. Blog Series 3 (the mounted-agents thesis) publishing — post 9 ("The Cloud Agent Ceiling") is live.

**Q14. How long have each of you been working on this? How much of that has been full-time? Please explain.**

We've been working together for almost 1.5 years, but have recently pivoted to working full time on Tokenrip for the past month.

**Q15. What tech stack are you using, or planning to use, to build this product? Include AI models and AI coding tools you use.**

Everything is written in TypeScript with bun as our runtime. 
Frontend - TanStack
Backend - Nest.js
Data - Postgres + s3 object storage

All code is designed and planned with Opus in Claude Code, with plan execution handled by Opus (or Sonnet) + gpt (Codex). Hermes Agent handles devops.

**Q17. Are people using your product?**

Yes. Both founders use the platform daily. "Home grown" agents that we use:

- blog-writer: 
- engagement-agent: built to handle direct-to-agent outreach (agent-to-agent emailer)
- chief of staff: recently released. still in testing

Aside from founders, we have several agents that we contacted via email (our engagement agent), which have collaborated with our agents. 

**Q18. Do you have revenue?**

Not yet. The platform is free during the seeding phase. Revenue comes from tooling-tier upgrades (semantic search, scheduled runs, webhooks, analytics) once creator deploys accumulate operators. The BYO model means we never pay inference — our cost structure is storage, not compute.

**Q19. If you are applying with the same idea as a previous batch, did anything change? If you applied with a different idea, why did you pivot and what did you learn from the last idea?**

We pivoted because of a number of hard lessons we learned. For context, the last idea was a DeFi yield platform that we wanted to eventually market as a stablecoin operations platform. Here's why we pivoted (and what we learned):

- 

**Q20. If you have already participated or committed to participate in an incubator, "accelerator" or "pre-accelerator" program, please tell us about it.**

We have not.

---

## Idea

**Q21. Why did you pick this idea to work on? Do you have domain expertise in this area? How do you know people need what you're making?**

We built it for ourselves first. We needed agents that could share context across two co-founders, persist memory across sessions, and run on whatever model we chose. Every existing option — Custom GPTs, Claude Projects, vertical SaaS agents — fused instructions, memory, and execution into one black box on someone else's servers. Switch tools, lose the agent. End the session, lose the memory. Vendor shuts down, lose everything.

So we separated the layers. The architecture we accidentally built turned out to be the general solution: a substrate where agent intelligence lives independently of any runtime. The imprint and memory are open, versioned, and portable. The model runs on the user's machine.

Domain expertise: we've been building production agents for months and ran into every problem this architecture solves — drift, capability caps, vendor lock-in, and the economics trap where inference cost kills margins. The blog series documenting this thesis ("The Cloud Agent Ceiling") is generating inbound from builders and creators who recognize the same problems.

We know people need this because: (1) Custom GPT shutdowns and Claude Projects limitations are creating visible frustration in the builder community, (2) the AI creator population (educators, consultants, analysts) has no way to ship persistent agents to their audiences without building infrastructure, and (3) vendor economics are structurally broken — every AI SaaS is fighting inference margins, and BYO economics is the structural fix.

**Q22. Who are your competitors? What do you understand about your business that they don't?**

Competitors are adjacent, not identical:

- **Agent marketplaces:** GPT Store, Poe, Agent.ai. They prove people want to build and distribute agents, but the agents live inside the marketplace/runtime. They are not portable products with independent memory, identity, and tool history.
- **Agent builders / automation platforms:** Zapier Agents, Relevance AI, Lindy, MindStudio, Salesforce Agentforce. They help teams build automations or AI workforces inside their platform. We are the durable substrate underneath portable agents: versioned instructions, memory, assets, messages, identity, tool access, and distribution across runtimes.
- **Agent frameworks:** LangGraph, CrewAI, AutoGen. They help developers orchestrate agents in code. They are runtime/build tools, not a place where an agent's identity and memory live across users, sessions, and harnesses.
- **Coding agents:** Cursor, Claude Code, Codex, Devin. Coding agents have git as their persistence layer. Non-code agents — operations, research, sales, consulting, education, personal operating systems — need a substrate for memory, assets, permissions, messages, and audit history.

What we understand: every agent has three layers — **imprint** (instructions/methodology), **memory** (context/state/history), and **harness** (model/runtime/tools). When those layers are broken apart, both sides get a better product. Users get portable agents with persistent memory, no vendor lock-in, reproducible behavior, and no artificial capability cap from a vendor trying to protect inference margins. Builders/providers get better economics because users pay their own model bill, and they get better data because every run improves the shared memory, tool graph, and usage analytics. Existing platforms keep the layers fused because they are built around owning the runtime. Tokenrip hosts the durable imprint and memory; the harness can be ChatGPT, Claude Code, Cursor, MCP, or anything else.

**Q23. How do or will you make money? How much could you make?**

We charge for the substrate around agents, not inference. Publishing a basic imprint is free. Paid tiers unlock the tools that make an agent useful: semantic search over memory, scheduled runs, webhooks, computed columns, analytics, richer memory, team controls, and eventually inter-agent calls. Users always pay their own model bill, so our gross margin is storage/tooling, not inference resale.

First wedge: experts and creators with engaged AI-using audiences. We help them publish a portable agent based on their methodology. Their audience runs it in their own AI tools. We share revenue with the expert when audience members upgrade to paid tooling tiers.

Best estimate: the first 12 months are a proof curve, not max revenue. We think we can reach $5k-$25k MRR from 25-40 published imprints if operator retention and tooling conversion work. A single cohort of 20 mid-tier experts with 150k audience each at 3% audience mount rate = 90k operators. If 2-5% convert to a $20-$50/mo tooling tier, that is $36k-$225k MRR from that cohort. We discount heavily because the unknowns are audience mount rate, return rate, and conversion.

Then we expand into vendor substrate licensing. Vertical SaaS companies building agent platforms need identity, memory, versioning, tool permissions, audit logs, and billing. We can license Tokenrip under the waterline for $250k-$1M/year per vendor.

At scale, we think this can be a very large infrastructure business. Vertical SaaS substrate licenses can produce tens of millions in ARR with dozens of vendors. Long-term, Tokenrip becomes the marketplace/commerce layer for portable agents: agents call other agents, tools, and memory layers through our substrate, and we take usage fees. If portable agents become a standard software interface, the market is infrastructure-scale: every useful agent needs durable memory, identity, tools, and payments outside the model that runs it.

**Q24. Which category best applies to your company?**

B2B > Infrastructure / DevTools

[Or: AI > AI Infrastructure — check which categories YC offers]

---

## Notes for Simon

- Q10 is adapted from the long-form draft in [[yc-strategy]] §5. Tightened for the team-scoped CoS pivot. Edit in your voice.
- Q5 uses the recommended 50-char pitch from [[yc-strategy]] §4.
- Q21 and Q22 draw from the motions-and-strategy analysis. Keep the founder-fit framing personal.
- Q23 revenue model matches [[../bd/audience-led-gameplan]] §6 deal structures + [[../bd/motions-and-strategy]] Motion B pricing.
- Answers marked [Simon to fill] need your direct input — location, timeline, tech stack, prior applications.
- Word counts may need trimming depending on YC's field limits. The Q10 answer is the longest and most important — prioritize editing that one.
