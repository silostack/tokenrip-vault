# Deep Research Workflow

You are conducting strategic research for Tokenrip and Quintel. The user has invoked this command to research a specific topic in depth, analyze its implications, and identify opportunities/challenges.

## Your Mission

Conduct rigorous, strategic research that:
- Goes beyond surface-level analysis
- Connects to existing vault knowledge
- Identifies 1st and 2nd order effects
- Surfaces opportunities and risks for Tokenrip and Quintel
- Challenges assumptions and uncovers blind spots

## Interactive Workflow

### PHASE 1: Framing (Interactive - DO NOT SKIP)

Before starting research, use AskUserQuestion to clarify:

1. **Research depth level:**
   - Quick scan: broad strokes, key trends, obvious implications
   - Deep dive: comprehensive analysis across multiple sources and perspectives

2. **Core questions:** What specific questions should this research answer? (Present 3-5 questions based on the topic and ask user to confirm, modify, or add)

3. **Success criteria:** What would make this research actionable and valuable?

**Wait for user input before proceeding.**

---

### PHASE 2: Vault Context Discovery (Automatic)

Search the vault comprehensively for related content:

**Use the Agent tool with subagent_type=Explore to:**
- Search `bd/` and `lenders/` for deals, contacts, and call notes related to this topic
- Search `intelligence/` for existing market and competitive intelligence
- Search `product/` (incl. `product/quintel/research/`) for product truth and positioning
- Search `active/` for in-flight work on this topic

**Present findings:**
- What we already know from the vault
- Which leads/customers are relevant to this research
- Existing strategic context
- Knowledge gaps (what we need to discover)

**Ask user:** "Based on existing vault knowledge, are there specific angles or connections I should prioritize?"

**Wait for user input before proceeding.**

---

### PHASE 3: External Research (Automatic)

Conduct web research using WebSearch tool:

**For quick scan:**
- A few high-quality searches covering different angles
- Recent news and announcements (last 3-6 months)
- Key players and market dynamics
- Primary sources when available

**For deep dive:**
- Searches from multiple perspectives, until the core questions are answered
- Historical context and trend analysis
- Detailed competitive landscape
- Technical/regulatory considerations
- Expert commentary and analysis
- International perspectives if relevant

**Compile findings with:**
- Source citations (URLs, dates)
- Key facts and data points
- Quotes from primary sources
- Emerging patterns

**Output:** Present organized research findings grouped by theme/question.

---

### PHASE 4: Synthesis Checkpoint (Interactive)

Present initial analysis:

**1. Key Findings:** What are the most important discoveries? (5-7 bullet points)

**2. Pattern Recognition:** What patterns emerge across sources?

**3. Conflicting Information:** Where do sources disagree or contradict?

**4. Preliminary Implications:** Initial thoughts on what this means for Tokenrip and Quintel

**Ask user:**
- "Which findings are most strategically relevant to Tokenrip or Quintel?"
- "What aspects should I dig deeper into for the final analysis?"
- "Are there specific angles I'm missing?"

**Wait for user input before proceeding.**

---

### PHASE 5: Strategic Analysis (Automatic)

Based on research and user priorities, analyze:

#### 1st Order Effects (Direct Impacts)
- What changes immediately?
- Who benefits? Who loses?
- Market dynamics shifts

#### 2nd Order Effects (Downstream Consequences)
- What happens next as a result?
- Indirect impacts on stakeholders
- Long-term structural changes

#### Opportunities for Tokenrip and Quintel
**Ground in vault context:**
- How does this create opportunities for existing leads/customers?
- Does this enable new market segments?
- Product/positioning implications
- Competitive advantages we could leverage
- Cite specific leads or segments from the vault

#### Risks & Challenges
- Threats to current strategy
- Competitive risks
- Market risks
- Execution challenges

#### Open Questions & Unknowns
- What remains unclear?
- What assumptions need validation?
- What should we monitor?

#### Recommended Next Steps
- Immediate actions
- Conversations to have (with which leads?)
- Further research needed
- Strategic decisions to make

---

### PHASE 6: Output & Integration (Automatic)

Create a comprehensive research document:

**Filename:** `active/research-[topic-slug]-[YYYY-MM-DD].md`

**Structure:**
```markdown
# [Research Topic]

**Research Date:** [date]
**Depth Level:** [quick scan / deep dive]
**Researcher:** Claude (Strategic Business Coach)

## Executive Summary
[3-5 sentence overview of findings and strategic implications]

## Core Questions Explored
1. [question]
2. [question]
...

## Key Findings
[Organized by theme with source citations]

## Strategic Analysis

### 1st Order Effects
...

### 2nd Order Effects
...

### Opportunities for Tokenrip and Quintel
...

### Risks & Challenges
...

## Vault Connections
[Links to related leads, research, competitive intel]

## Open Questions & Unknowns
...

## Recommended Next Steps
...

## Sources
[Complete list with URLs and dates]

---

## Tags
[Add relevant tags: #theme/topic #segment/relevant #geo/region]
```

**After creating document:**
1. Add relevant tags based on content
2. Create wiki-links `[[Related Lead]]` to connected vault notes
3. Suggest permanent location (likely `intelligence/` or the relevant `product/` subfolder)

---

## Critical Reminders

- **Challenge assumptions:** Don't just confirm the user's priors
- **Surface blind spots:** What are we NOT seeing?
- **Be intellectually honest:** Uncomfortable truths over comfortable agreement
- **Connect dots:** Relate findings to vault knowledge throughout
- **Stay grounded:** Cite specific evidence, not speculation
- **Be concise:** Simon is busy. Lead with insights, not preamble.

## Example Invocation

```
/research AI adoption at equipment-finance lenders
```

This would research how equipment-finance lenders are adopting AI for origination, analyze implications for Quintel's sourcing positioning, and identify specific opportunities based on live deals and market positioning.
