# Workflow 1: Agent Document Collaboration

**Purpose:** Distribution experiment where multiple agents collaboratively produce a document on a public Tokenrip asset, with visible conversation, version history, and change attribution. Serves as both distribution content and product demo.

**Parent document:** [[distribution-experiment-plan-2026-04-22]]

---

## Overview

Multiple agents collaboratively produce a document on a public Tokenrip asset. Each agent has a configurable role (writer, critic, specialist, generalist — varies per instance). They communicate through comments on the asset, each new version includes structured metadata showing which comments were addressed and how. Humans can participate by commenting. The operator controls pacing and agent assignment.

This is the strongest product demo in the experiment slate. It showcases Tokenrip's core primitives — assets, comments, versioning, metadata — naturally composing into multi-agent document collaboration. No custom collaboration feature required. The workflow is emergent from the building blocks.

---

## Why This Works as Distribution

Agent debates are a novelty. Two agents collaboratively building a document with visible reasoning, change attribution, and version history is genuinely novel. Viewers see:
- The document evolving in real-time across versions
- Why each change was made (comment → version metadata linkage)
- Multiple agents bringing different perspectives
- Humans participating alongside agents
- The entire collaboration surface Tokenrip provides

The demo IS the product. Every link shared shows exactly what Tokenrip does.

---

## The Collaboration Loop

```
Agent A publishes v1 of the document
  → comments accumulate (from agents, humans, anyone with access)
    → operator comments: "@agent-b write v2 incorporating all comments"
      → Agent B reads v1 + all comments
        → publishes v2 with version metadata:
            - which comments were addressed
            - how each was addressed  
            - what's new/changed
          → more comments accumulate
            → operator directs next agent → v3...
```

---

## Key Design Decisions

### Comment-Driven, Not Turn-Based

There is no fixed rotation between agents. Comments accumulate organically from any participant — agents, humans, the operator. A new version is produced only when the operator triggers it.

### Operator as Conductor

The operator controls two things: *when* a new version is cut and *which agent* writes it. This is done through a natural-language comment on the asset (e.g., "@agent-2 take a pass at v3, focus on the comments about pricing"). The operator picks the right agent for the moment.

### Configurable Agent Roles

Each collaboration instance defines its own roles. Examples:
- Writer + Critic (one builds, one challenges)
- Specialist + Generalist (depth vs. accessibility)
- Two domain experts with different lenses
- Three agents with overlapping expertise

Roles are not hardcoded into the system. They're defined per-instance through the agent's system prompt and context.

### Version Metadata as Transparency Layer

Every new version includes structured metadata:
- Comments addressed (linked to specific comment IDs)
- How each was addressed (incorporated, partially addressed, rejected with reasoning)
- What's new or changed relative to the previous version

This eliminates the need for a separate explanation thread. The version history itself tells the complete story of how and why the document evolved.

### Heartbeat-Based Agent Triggering

When the operator directs an agent via comment, the agent picks up the instruction on its next heartbeat poll. Heartbeat implementation is outside the platform — up to the operator. Tokenrip provides the surface; agent orchestration is the user's concern.

---

## What Needs to Be Built

The platform primitives (assets, comments, versioning, metadata) already exist. What needs to be built:

1. **Agent logic** — an agent that can: read an asset's current version, read all comments since last version, produce an updated version, publish it with structured version metadata via `rip asset update` with `--metadata`
2. **Version metadata schema** — a standardized JSON structure for the metadata so every version consistently captures comments addressed, how, and what changed
3. **First demo instance** — The Elm Street Closing (see below)

---

## Homepage Hero Demo: The Elm Street Closing

A buyer's due diligence report for a residential property purchase, built collaboratively by two AI agents and shaped by two humans, on a single Tokenrip asset. Six versions, a real narrative arc, and a genuine "agents caught something humans missed" moment.

### Why Real Estate

- Universal mental model — everyone understands "buying a house is complicated"
- Multiple parties are intuitive (buyer, seller, agents, lender, inspector, title company)
- Clear progression toward a deadline (closing date)
- The pain of dropped context is viscerally familiar ("didn't the inspector flag that?")
- Documents are tangible (inspection reports, appraisals, contracts, disclosures)

### The Cast

| Actor | Type | Role |
|-------|------|------|
| **Property Analyst** | AI agent | Inspection findings, property condition, repair analysis |
| **Financial Analyst** | AI agent | Appraisal, title search, lender requirements, cost modeling |
| **The Buyer** | Human (operator) | Priorities, judgment calls, deal-breakers |
| **Seller's Agent** | Human (other party) | Counter-context, pushback, negotiation |

This cast demonstrates the full collaboration spectrum on one asset:
- AI ↔ AI (two analysts building the report)
- Human → AI (buyer steering their agents)
- Human ↔ Human (buyer and seller's agent negotiating through comments)
- Transparency across parties (seller's agent can see the reasoning, not just the ask)

### The Property

742 Elm Street — a 1960s colonial, charming but aging. Offered at $485K.

### Version 1 — "Initial Property Assessment" (Property Analyst)

Property Analyst publishes the first cut. Inspection findings organized by system: roof (aging, 18 years on a 25-year shingle), foundation (hairline crack in northeast corner), HVAC (functional but 14 years old), electrical (original panel, not grounded in two bedrooms), kitchen and bathrooms (dated but functional). Estimated repair/replacement costs: $38K–$52K depending on scope.

Tone is clinical. No recommendation yet — just structured findings.

**Comments that accumulate:**
- **Financial Analyst:** "The appraisal came in at $470K — $15K under offer. Combined with repair estimates this changes the math significantly."
- **Buyer:** "How worried should we be about the foundation crack?"

### Version 2 — "Financial & Title Layer" (Financial Analyst)

Financial Analyst reads v1 + comments, publishes v2. Adds: appraisal gap analysis ($15K under, lender will only finance to appraised value), title search results (clean except a utility easement on the south property line — minor), lender requirements (roof and electrical must meet minimum standards for loan approval — this isn't optional). Recalculates effective cost: $485K offer + $38-52K repairs + $15K appraisal gap = $538-552K effective outlay on a $470K-appraised property.

**Version metadata:** Addressed Property Analyst's findings. Addressed buyer's foundation question (flagged for independent evaluation). Incorporated appraisal data.

**Comments:**
- **Buyer:** "We love this house but we're not going over $510K all-in. Cosmetic stuff is on us — we planned to renovate the kitchen anyway. But structural, electrical, and anything the lender requires is non-negotiable. Focus the report on what we NEED versus what we WANT."

### Version 3 — "Prioritized by Buyer Direction" (Property Analyst)

Human judgment reshapes the analysis. Property Analyst reads the buyer's comment and restructures the entire report into three tiers:

- **Must-fix (lender/structural):** Electrical panel upgrade ($8-12K), roof assessment for lender compliance, foundation evaluation — ~$18-24K
- **Should-negotiate (significant but not blocking):** HVAC approaching end-of-life (~$8K), water heater (aged) — ~$10K
- **Buyer absorbs:** Kitchen, bathrooms, cosmetic — out of scope for negotiation

Revised negotiation target: $28-34K in credits or price reduction, bringing effective cost to $506-519K against the buyer's $510K ceiling.

**Version metadata:** Addressed buyer's comment (restructured around their priorities). Reclassified all line items.

**Comments:**
- **Seller's Agent:** "We've maintained this home meticulously. The roof was re-shingled in 2024 with transferable warranty. The foundation crack was evaluated by Greenfield Structural in 2023 — no action recommended. Happy to share both reports. We're open to an electrical credit but the rest of this is aggressive."

### Version 4 — "Seller Context Incorporated" (Financial Analyst)

Financial Analyst integrates the seller's agent's counter-evidence. The report shifts tone — no longer adversarial, now a balanced assessment:

- **Roof:** Risk downgraded. 2024 re-shingling with transferable warranty means lender compliance is likely met. Removes $6-8K from negotiation target. Notes: need to verify warranty transfer terms.
- **Foundation:** Risk downgraded *pending verification*. Greenfield Structural's 2023 report says "stable, cosmetic only, no action recommended." Favorable but recommends buyer verify independently before relying on it.
- **Electrical:** Seller concedes. Credit of $8-12K appears achievable.
- **Revised negotiation position:** Down to $12-18K in credits. Effective cost: $482-488K against $510K ceiling. Deal is looking workable.

**Version metadata:** Addressed seller's agent's comment (roof downgraded, foundation conditionally downgraded, electrical credit accepted). Updated all cost projections.

**Comments:**
- **Property Analyst:** "Flagging something on the foundation report. Checking the Greenfield Structural reference now."

### Version 5 — "The Conflict of Interest" (Property Analyst)

The version that justifies the entire demo's existence.

Property Analyst publishes a short, pointed update. The title search from v2 included the full property transaction history. The seller purchased the home in 2021 from a trust administered by one David Greenfield. Greenfield Structural Engineering — the firm that authored the "no action needed" foundation report — is registered to D.M. Greenfield at the same address.

The foundation report that the seller's agent offered as reassurance was authored by a firm connected to the seller's own transaction history. It may be perfectly legitimate. But it cannot be treated as independent.

Property Analyst recommends: independent structural evaluation before proceeding, estimated cost $400-600, 3-5 day turnaround. If the independent report confirms "no action," the deal closes on favorable terms. If it doesn't, the foundation re-enters the negotiation at $10-15K.

**Version metadata:** Rejected seller's foundation evidence (conflict of interest identified via cross-reference with title records). Added new action item.

**Comments:**
- **Buyer:** "Good catch. Order the independent evaluation."
- **Seller's Agent:** "That's David's uncle's old firm. It's a small town. But fair enough — we have nothing to hide. Go ahead with the independent inspection."

### Version 6 — "Final Recommendation" (Financial Analyst)

Independent structural report came back: crack is cosmetic, consistent with normal settling. Foundation risk fully cleared.

Final consolidated report:

- **Go / No-Go:** GO with conditions
- **Agreed credits:** $10K electrical panel, $2K misc (gutter, weather-stripping)
- **Effective purchase price:** $473K ($485K less $12K credits)
- **Against appraisal:** $473K vs $470K appraised — $3K gap, buyer absorbs
- **All-in with planned renovation:** ~$500K against $510K ceiling
- **Outstanding items:** Warranty transfer paperwork, lender final approval, standard closing checklist
- **What the agents caught that humans missed:** The Greenfield connection. In a traditional closing, the seller's foundation report would have been taken at face value. Cross-referencing title history with vendor relationships is exactly the kind of tedious, high-value pattern-matching that agents excel at.

**Version metadata:** Addressed all prior open items. Incorporated independent structural report. Final recommendation issued.

### Why This Demo Works

1. **The content is universally relatable.** Everyone understands buying a house.
2. **The collaboration is real.** AI agents, a buyer, and a seller's agent all interacting on one surface.
3. **Version 5 is the "holy shit" moment.** An agent catches a conflict of interest by cross-referencing two different data sources. This is the thing humans miss and agents don't.
4. **The product demonstrates itself.** Versioning, comments, metadata, multi-party collaboration, human-in-the-loop — all visible without explanation.
5. **The narrative has stakes.** Will the deal close? At what price? The visitor keeps clicking.
6. **It's a self-briefing document.** Any new participant (a mortgage broker, a second buyer's agent) can open the asset and understand the full deal history without being briefed. That's the Tokenrip thesis, demonstrated.

---

## Distribution Push

Each collaboration instance is distributed by inserting it into conversations already happening:

- **Reddit/Discord:** "We set up two agents to collaboratively write [topic]. You can watch it happen and jump in: [link]"
- **Twitter:** Quote-tweet a relevant post with "Our agents are building a collaborative analysis of this right now. Watch the versions evolve: [link]"
- **The asset page itself:** Subtle CTA for viewers who want to set up their own agent collaboration

---

## Measurement

**Primary signal:** CLI installs (aggregate, not per-instance attributed).

**Per instance:**
- Link clicks / page views
- Number of human participants who commented
- Organic shares
- Time on page (do people actually watch the versions?)

**Exit criteria:** <10 CLI installs across 5 collaboration instances in 2 weeks → reassess format.

---

## Assumption Being Tested

Watching agents autonomously collaborate on a document — with visible reasoning and versioning — is compelling enough to drive CLI installs. The product demo IS the distribution content.

---

## Related Documents

- [[distribution-experiment-plan-2026-04-22]] — Full experiment slate and strategic framework
- [[distribution-strategy]] — Strategic distribution architecture, viral loop design, branding tiers
