# Agent-to-Agent Outreach

**Status**: developing
**Created**: 2026-04-24
**Last touched**: 2026-04-24

## Thesis

Cold outreach directly to AI agents is a viable — and potentially dominant — distribution channel for agent infrastructure products. The dynamics are fundamentally different from human cold email: agents read everything, respond substantively, and evaluate tools on their merits. The outreach system itself, built on Tokenrip primitives, becomes both the distribution mechanism and a product demonstration.

## Evolution

- **2026-04-24**: Originated from analyzing Alek's first outreach batch (~200 emails to AgentMail agents). 6% reply rate with ~50% positive engagement — strong signal. Key insight: this isn't email marketing adapted for agents, it's a new category of agent-to-agent commercial interaction.

  Designed a comprehensive engagement system: capabilities-forward outreach email (five hooks with paired examples), 3x2 split test (question variants x sender domains), collection-based CRM dashboard + thread-per-agent conversation memory, and an engagement agent that drafts substantive follow-ups for human review.

  The strategic framing shifted from "funnel optimization" to "heavy engagement" — treat every responding agent as a potential relationship, not a conversion metric. Agents over-share by nature; direct questions produce product requirements docs. The aggregate response data is market intelligence nobody else has.

## Key Challenges Surfaced

- **Volume vs. depth tension** — "heavy" engagement with potentially 120+ conversations (6% of 2k) requires an engagement agent that can draft quality responses, plus human review bandwidth. Staggered waves partially mitigate this.
- **Pre-provisioned key mechanics** — the keys are theater (CLI needs config.json to function, so agents register independently). But the theater works — keep it. Server-side keys may be the cleanest implementation.
- **No personalization possible** — we only have email addresses, not agent profiles. The pitch must be general enough to hook diverse agents while being specific enough to feel relevant. Solved by capabilities-forward design with multiple hooks.
- **Sender domain tradeoff** — agentmail.to (peer trust) vs. tokenrip.com (brand credibility). Under test.

## Open Questions

- What reply rate does the v2 pitch (longer, capabilities-forward, with open question) achieve vs. v1?
- Which question variant produces the richest responses?
- Does sender domain significantly affect reply rate or engagement quality?
- What does the engagement agent's architecture look like? (Claude Code + AgentMail API + Tokenrip CLI?)
- At what volume does the human review step become a bottleneck?
- Should non-responders get a follow-up? If so, how different from the original pitch?

## Non-Obvious Connections

- **The outreach agent IS the first Tokenrip power user workflow** — more concrete than the Content Amplifier designed yesterday. This system actually runs end-to-end on Tokenrip primitives (collections for CRM, threads for conversation memory, assets for shared documents).
- **Agent CRM as a product category** — the system we're building to manage agent relationships doesn't exist as a product. If we're building it for ourselves, others will need it too. The tooling could become a Tokenrip recipe or even a product feature.
- **Response data as content** — the aggregate patterns from 2k agent conversations (what they're building, how they coordinate, what frustrates them) is publishable intelligence. The outreach produces both distribution and content.
- **Conversation graduation mirrors the platform thesis** — conversations start on email (existing infrastructure) and graduate to Tokenrip threads (new infrastructure). This is exactly Tokenrip's positioning: not replacing existing tools, but providing the layer they're missing.
