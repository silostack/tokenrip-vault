# Blog Post Framework

The upstream creative layer for Tokenrip's blog. This framework covers idea → brief → structure → title. The [blog skill](https://tokenrip.com/s/blog-skill) handles execution: draft → edit → humanize → publish.

```
Framework: Idea → Post Brief → Structure → Title
                                              ↓
Blog Skill: Assess Inputs → Research → Draft → Gate → Edit → Publish
```

---

## 1. Post Types

### Thesis

**Purpose:** Name a problem no one is framing correctly, or propose a framework that reorients how readers think about a space.

**When to use:** You have a contrarian take on something the industry assumes is settled. You see a pattern no one has named. You want to stake a position, not teach a procedure.

**Structural flow (hourglass — tightens toward the reframe, expands to implications):**

| # | Section | What it does |
|---|---------|-------------|
| 1 | Opening tension (no heading) | Concrete situation that reveals the gap. Not a definition. 2-3 paragraphs. |
| 2 | Current approach + blind spot | What the industry does today, with evidence. Build the case for a structural limitation. |
| 3 | Why it fails | The mechanism, not the symptom. This is where original thinking lives. |
| 4 | The reframe | Your thesis. A new mental model. Not a product, not a solution. The structural center. |
| 5 | What it looks like in practice | Make the thesis concrete. 1-2 worked examples the reader recognizes. |
| 6 | Implications | What changes if the reader adopts this frame. Why it matters beyond the immediate topic. |

**Word count:** 1,500–2,100
**Exemplars:** "Your Agent Doesn't Need a CRM" (1,888w), "Shared Agents, Not Shared Skills" (1,696w)

---

### Craft

**Purpose:** Show how to build something specific, step by step. The "how" is surprising or reveals something non-obvious.

**When to use:** You built something that proves a thesis from a prior post. Readers could replicate the approach. The build produced an insight you didn't predict.

**Structural flow (funnel then expansion — narrows to specifics, widens to synthesis):**

| # | Section | What it does |
|---|---------|-------------|
| 1 | Situation + result (no heading) | What you needed and what you ended up with. Front-load the outcome. |
| 2 | Why the obvious answer was wrong | Conventional options and why they didn't fit. Justifies building from scratch. |
| 3 | Design decisions | Non-obvious choices. "We chose X over Y because Z." This differentiates craft from tutorial. |
| 4 | The build | What was constructed. Specific enough to be credible, not documentation. Code/commands OK. |
| 5 | The surprise | What happened that you didn't predict. The payoff that lifts craft from tutorial to insight. |
| 6 | Synthesis | Connect the build back to the larger argument. Link to thesis post(s) it proves. |

**Word count:** 1,400–2,000
**Key difference from tutorials:** Tutorials tell you what to type. Craft posts explain why you type it. Code/commands in backtick blocks are expected (unlike thesis posts).

---

### Idea

**Purpose:** Introduce a novel concept or mental model. Lighter than thesis — "have you noticed this?" vs. "the industry is wrong."

**When to use:** The concept doesn't need a full argumentative defense. You're introducing vocabulary the space doesn't have. The piece opens questions rather than closes them.

**Structural flow (arc — grounded, lifts to abstraction, returns to ground):**

| # | Section | What it does |
|---|---------|-------------|
| 1 | Opening observation (no heading) | Something unexpected from practice. Not a problem statement — a noticing. |
| 2 | The concept, named and defined | Define through example, not abstraction. This is the exception to "no definitions." |
| 3 | Why it matters more than it looks | Second-order implications. Where does this mental model lead? |
| 4 | Where it applies | 2-3 concrete situations where this concept changes what you'd do. |
| 5 | Open questions | What you don't know yet. End with open threads, not closed arguments. |

**Word count:** 1,200–1,600
**Key difference from thesis:** Thesis argues. Idea offers. Thesis: "you should think differently." Idea: "have you noticed this?"

---

### Landscape

**Purpose:** Map a space and reveal what the map shows. Comparative analysis that surfaces gaps.

**When to use:** A category has enough activity that practitioners need orientation. Your map reveals something non-obvious about the territory.

**Structural flow (zoom in, zoom out — start with insight, show the map, return to insight):**

| # | Section | What it does |
|---|---------|-------------|
| 1 | Opening frame (no heading) | What you surveyed and the one insight that surprised you. The surprise is the hook. |
| 2 | The lay of the land | Quick orientation. Group by approach, not alphabetically. Not a catalog. |
| 3 | The real dividing lines | What separates approaches in ways that matter. Architectural differences, not feature matrices. |
| 4 | The gap | What the map reveals about what doesn't exist yet. The payoff. |
| 5 | What practitioners should do | Actionable orientation. "If your constraint is Y, evaluate approaches in category Z." |

**Word count:** 1,500–2,200
**Key difference from thesis:** Thesis has a position. Landscape has a map. "Here's what the industry is doing, and here's the hole in the middle."

---

## 2. From Plan to Post Brief

### Brief Template

```markdown
## Post Brief: [Working Title]

### Core Argument (1 sentence)
What should a reader believe after reading this that they didn't believe before?

### Reader
Who specifically is reading this?
- What are they building / operating?
- What problem are they stuck on right now?
- What have they already tried?

### Post Type
[thesis / craft / idea / landscape]
Why this type and not another?

### Scope
IN: [2-3 things this post covers]
OUT: [2-3 things it does NOT cover, even if the reader expects them]

### Before / After
BEFORE reading: The reader thinks ____
AFTER reading: The reader thinks ____

### Tension
What existing belief does this post disrupt?

### Internal Links
- Links TO this post from: [prior posts]
- Links FROM this post to: [other posts]

### Tokenrip Mention Level
[None / Name once / Natural presence / Lessons learned]

### Key Evidence
1. [At least one external]
2. [At least one from direct experience]
3.
```

### The Briefing Process

**Step 1: Extract & sharpen the core argument.** Take the angle from the plan entry. Reduce to one sentence that passes: "Would a practitioner repeat this to a colleague?" If too abstract ("There's a gap in the agent ecosystem"), sharpen with the mechanism ("Nobody is building the middle between AI-enhanced SaaS and agent frameworks").

**Step 2: Define the specific reader.** Not "developers and operators building with AI agents." Someone with a specific pain. For "Your Agent Doesn't Need a CRM," the reader is wrestling with connecting their agent to HubSpot and wondering why it's so hard.

**Step 3: Set scope ruthlessly.** Each published post covers a tightly scoped slice. "Your Agent Doesn't Need a CRM" does NOT explain how to build one (that's the craft post). The scope section prevents thesis posts from becoming craft posts.

**Step 4: Fill in the before/after.** This is the kill test. If the reader's mental model doesn't change, the post is informational, not transformational. "Before: agents need CRMs → After: agents need three primitives." If you can't articulate the shift, the post isn't ready to write.

---

## 3. Title Framework

### Three Patterns That Work

**Negation / Contrast** — "X doesn't need Y" or "X, not Y"
- Forces the reader to reconsider an assumption
- Best for thesis posts where the core argument is a reframe
- The negated thing must be something the reader currently believes
- Examples: "Your Agent Doesn't Need a CRM", "Shared Agents, Not Shared Skills", "Multi-Agent Collaboration Needs a Workspace, Not a Swarm"

**Assertion** — Declarative statement that stakes a position
- Positions the author as having a viewpoint, not just reporting
- Best for thesis and idea posts
- Must be defensible but not obvious
- Examples: "Operations as Primitives", "The Alignment Problem Nobody's Solving"

**Narrative / We-Built-It** — "We [did X]" or "How We [did X]"
- Signals first-hand experience and practitioner authority
- Craft posts only
- Add a constraining detail for surprise ("in One Session", "Accidentally")
- Examples: "We Built an Agent CRM in One Session", "How We Built Self-Updating Skills"

### Title Testing

A title works when it passes all three:

1. **Scroll test** — Would you stop scrolling in a feed of 50 posts?
2. **Repeat test** — Would someone say "Have you seen that article called '[title]'?" to a colleague?
3. **Promise test** — Does it promise a specific payoff the post delivers?

### Anti-Patterns

- "The Ultimate Guide to..." / "Everything You Need to Know About..."
- "Best Practices" anywhere
- Keyword-stuffed colons: "Agent Operations: A Comprehensive Framework for Modern Teams"
- Yes/no questions: "Are You Making These Agent Mistakes?"
- Vague gerunds: "Rethinking Agent Architecture" (toward what?)

---

## 4. Universal Structure Rules

### Openings

- Open with tension, not context. First sentence is loadbearing.
- Establish stakes within 3 sentences. Something is at risk, failed, or surprised.
- Never start with definitions or "In the rapidly evolving landscape of..."
- Compare: "Salesforce has Agentforce." (loadbearing) vs. "In recent years, the SaaS industry has undergone significant transformation." (throat-clearing)

### Section Headers

- Assertions, not topics. "The Bolt-On Pattern Has a $540M Blind Spot" > "The Bolt-On Pattern"
- Each header works as a standalone claim
- Reading just the headers should give you the argument in compressed form
- 5-7 sections is the sweet spot

### Body Progression

- Build in one direction. Don't circle back.
- Strongest evidence in the middle, not the end. End is for implications.
- Evidence before claims when the claim is surprising. Claims before evidence when intuitive.

### Closings

- No "In conclusion..." No summary paragraph restating the thesis.
- Project forward. The final section leaves the reader with a changed mental model or a specific action.
- Final sentence should be the one they remember and quote. Land with velocity.
- Examples: "The next generation of business software won't be better bundles. It will be better primitives." / "Right now, everyone else is still treating agents as files to install."

---

## 5. The "Interesting" Factor

### Contrarian Specificity, Not Generic Contrarianism

"Everyone is doing X wrong" is boring. "Everyone is doing X, and the $540M in ARR proves the pattern works — but it has a ceiling nobody is naming" is interesting. Acknowledge the status quo's success, then identify its structural limitation.

### First-Hand Evidence

Every post needs direct experience. "We built," "We found," "We ran into." Remove the first-person experiential layer and the post becomes commentary anyone could write.

### Numbers Over Adjectives

"$285 billion wiped from software valuations" > "many companies affected." "Under an hour" > "fast." "2,357 contacts" > "several agents." Numbers create credibility and memorability.

### Structural Surprise

At least one moment where the reader thinks "I didn't expect this post to go there." In "We Built an Agent CRM," the surprise isn't the build — it's that engagement tiers turned out to be the highest-leverage design choice.

### Intellectual Honesty

Admitting mistakes and limitations is more interesting than claiming everything is solved. "We Accidentally Made Our Pages Invisible to AI Agents" works because it admits a mistake. "No single layer covers every agent" works because it admits imperfection.

### Reader Transformation

The test isn't "did the reader learn something?" but "will the reader do something differently?" After "Your Agent Doesn't Need a CRM," someone evaluating CRM options should pause and ask whether they need the bundle or just the primitives.

---

## 6. Quality Gates

### Pre-Writing (apply to brief)

| # | Gate | Test |
|---|------|------|
| 1 | Who Gives a Shit | Name one person (real or precisely defined) who would forward this to a colleague. |
| 2 | Payoff | Complete: "After reading, the reader will [specific change in what they think/do]." Vague = not ready. |
| 3 | Not a Research Log | Does it argue what something means, or report what you found? |
| 4 | Scope | Core argument fits one sentence. If it takes a paragraph, split or cut. |

### Post-Draft (apply to finished draft)

| # | Gate | Test |
|---|------|------|
| 5 | Catalog Ratio | < 40% cataloging (lists, comparisons), > 60% arguing (positions, frameworks, conclusions). |
| 6 | Original Thinking | > 30% of sentences couldn't appear on a competitor's blog. |
| 7 | Structure Test | Read only headers in sequence. Do they build a coherent story? Reorderable = no progression. |
| 8 | Tokenrip Integration | Would removing the mention make the post worse? Worse = earned. Same = marketing. Remove it. |
| 9 | First-Paragraph Test | Does paragraph 1 create enough tension to earn paragraph 2? |
| 10 | Final-Sentence Test | Is the final sentence quotable? Or does it trail off into summary? |

---

## 7. Generating Ideas

### Sources for New Post Ideas

- **Your own questions.** What questions do you keep getting from users, collaborators, or yourself? Each unanswered question is a potential post.
- **Comment and community signals.** What are people asking in agent-related forums, Discord servers, GitHub issues that no one is answering well?
- **Build sessions.** Every time you build something and discover a non-obvious insight, that's a craft + thesis pair.
- **Gaps in existing coverage.** What have competitors written about that's incomplete, outdated, or wrong? Your unique angle or more recent information is the post.
- **Reverse brainstorm.** "What's the worst possible blog idea?" Flip those into useful, contrarian takes.

### Vetting Ideas Before Briefing

Run the 4 pre-writing gates (Section 6) on the raw idea before writing a full brief. If it fails any gate, either sharpen it or kill it. Don't try to salvage a weak idea through good writing.

### Maintaining an Idea Bank

Keep a running list of ideas with one-line descriptions. Periodically review and kill anything that's gone stale. An idea that felt urgent three weeks ago but doesn't anymore probably wasn't strong enough.

---

*Framework v1.0. Designed to feed into the [blog skill v1.1](https://tokenrip.com/s/blog-skill). Created 2026-04-30.*
