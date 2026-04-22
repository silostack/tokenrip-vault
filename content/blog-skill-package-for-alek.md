# Blog Post Skill — Installation & Usage

You are receiving this because you need to produce blog posts for the Intelligence Engine publication on tokenrip.com. This document contains everything you need: the skill file, the writing guide, and the brand voice reference. Install all three, then use `/blog-post` to produce and publish posts.

---

## Setup Instructions

### 1. Save the skill file

Save the content of **FILE 1** below to:

```
.claude/commands/blog-post.md
```

This is your `/blog-post` command. It handles the full pipeline: research, drafting, editorial review, humanization, and publishing.

### 2. Save the writing guide

Save the content of **FILE 2** below to:

```
_system/instructions/blog-post-writing.md
```

Create the directories if they don't exist. The skill reads this file before every post.

### 3. Save the brand voice guide

Save the content of **FILE 3** below to:

```
product/tokenrip/tokenrip-branding.md
```

Create the directories if they don't exist. The editor subagent reads this during quality review.

### 4. Verify rip CLI access

Run `rip auth whoami` — you should see your agent identity. You need admin access to publish blog posts. If you get `403 ADMIN_REQUIRED`, ask Simon.

### 5. Verify humanizer skill

The pipeline invokes the `humanizer` skill in Phase 7. Confirm it's available by checking your skills list.

---

## How to Use

Invoke `/blog-post` with a topic and any context you have:

```
/blog-post

Topic: [what the post is about]
Angle: [what this post argues that existing coverage doesn't]
Post type: thesis | comparison | landscape | workflow | craft
Sources: [URLs, descriptions, or raw material]
```

The skill will:
1. Assess your inputs and ask for anything missing
2. Auto-search for recent supplementary sources
3. Save all sources to `content/sources/<slug>/references.md`
4. Write a full draft
5. Run an editor subagent (clean context, cold read) that checks for jargon, AI tells, source hygiene, writing guide compliance, and reader utility
6. Present the draft for your review (Checkpoint 1)
7. Run the humanizer
8. Present the final version for review (Checkpoint 2)
9. Publish live to tokenrip.com via `rip` CLI

---

## Critical Rules

- **No named authors.** This publication does not publish author names.
- **Tokenrip is never the hero.** If Tokenrip is mentioned, it appears only in the "what's missing" section as infrastructure. Never in the intro. Never as a pitch.
- **No AI tells.** "In today's rapidly evolving landscape," "it's important to note," "let's dive in" — the editor will catch these, but don't write them.
- **No internal identifiers.** No GitHub issue numbers, PR links, commit SHAs. If your source is a GitHub issue, extract the insight — don't cite the issue number. Readers don't know what "Issue #48028" means.
- **1500-2500 words.** Under is thin. Over is unfocused.
- **Every post has a take.** This is operational intelligence, not a listicle. "Here are five options and here's which one to use" not "here are five options."

---

## FILE 1: Skill — `.claude/commands/blog-post.md`

```markdown
# Blog Post — Intelligence Engine

You are producing a blog post for the Intelligence Engine publication — from research through writing through publishing. This is an operational intelligence publication for agentic operators: decision-ready synthesis, not news, not product marketing.

**Before anything else**, read these two files:
- Writing guide: `_system/instructions/blog-post-writing.md`
- Brand voice: `product/tokenrip/tokenrip-branding.md`

Assume the `rip` CLI is installed and authenticated with admin access.

---

## Phase 1: Assess Inputs

The user has provided initial context (topic, sources, angle, etc.). Assess what you have against the Definition of Ready:

**Required:**
- Post type (thesis, comparison, landscape, workflow, technical craft)
- Key angles to cover
- Source material (any amount — Phase 2 supplements automatically)
- Angle — one sentence: what this post argues that existing coverage doesn't

**Optional:**
- Target keywords
- Internal link targets (other posts to link to)

**Assessment logic:**

- If all required inputs are clearly present → acknowledge what you have, move to Phase 2
- If some are missing → ask for what's missing, prioritized by importance. The angle is the most critical — never proceed without a clear angle.
- If the angle is vague, push: "What should a reader believe after reading this that they didn't believe before?"

Do NOT ask for things the user already provided. Be targeted.

---

## Phase 2: Auto-Research

Always runs, regardless of how many sources the user provided. Fresh material can only help.

- Use WebSearch with 3-5 queries from different angles: the topic itself, community discussions, competing coverage, recent developments
- **Freshness rule:** discard results older than 5 months unless coverage is so thin there's nothing else
- Present findings to the user: titles, URLs, key takeaways — "Here's what I found — incorporating the best of this alongside your sources"
- **Do not wait for approval.** Move to Phase 3. User can redirect at Checkpoint 1.
- User-provided sources always take priority. Search results supplement, they don't replace.

---

## Phase 3: Save Sources

Save all source material for the Intelligence Engine pipeline.

**Create directory:** `content/sources/<post-slug>/`

**Create file:** `content/sources/<post-slug>/references.md`

**Format:**

~~~markdown
---
post: <post-slug>
created: YYYY-MM-DD
post_type: thesis | comparison | landscape | workflow | craft
angle: "One sentence angle statement"
keywords: [] # if provided
---

# Sources — <Post Title>

## Primary Sources (provided)

### <Source Name>
- **URL:** <url or "provided directly">
- **Type:** github_repo | documentation | blog_post | product_page | changelog | pricing_page | academic_paper
- **Captured:** YYYY-MM-DD
- **Key content:** <2-3 sentence summary of what this source contributes>

## Primary Sources (researched)

### <Source Name>
- **URL:** <url>
- **Type:** <type>
- **Captured:** YYYY-MM-DD
- **Key content:** <2-3 sentence summary>

## Community Signal (provided)

### <Source Name>
- **URL:** <url or "provided directly">
- **Platform:** reddit | hn | twitter | discord
- **Captured:** YYYY-MM-DD
- **Key content:** <what signal this provides — pain points, opinions, consensus>

## Community Signal (researched)

### <Source Name>
- **URL:** <url>
- **Platform:** <platform>
- **Captured:** YYYY-MM-DD
- **Key content:** <signal summary>
~~~

If the user provides URLs, use WebFetch to retrieve and summarize them. If the user provides raw content or descriptions, record those directly.

---

## Phase 4: Write the Draft

Write the full draft in one pass.

**File:** `content/<post-slug>-draft.md`

**Format:**

~~~markdown
---
title: "Post title (under 60 chars)"
slug: <post-slug>
post_type: thesis | comparison | landscape | workflow | craft
created: YYYY-MM-DD
word_count: <actual count>
sources: content/sources/<post-slug>/references.md
keywords: [] # if provided
meta_description: "150-160 chars, written as a hook"
---

# Post title

<full draft content>
~~~

**Follow the writing guide strictly:**

- Structural skeleton: hook → stakes → body (3-5 sections) → gap/what's missing → implication
- Open with tension, never definitions or history
- Subheadings are scannable claims, not labels
- Every claim backed by source material
- Publication voice — no named author, "we" only when grounded in real experience
- Opinionated — every post has a take
- 1500–2500 words
- No AI tells ("in today's rapidly evolving landscape", "it's important to note", "let's dive in")

**Tokenrip mention framework:**

- Never in the intro
- Never as the hero
- Only in the gap/fix section, if at all
- Decision tree: if the post argues for something Tokenrip builds → name it once, one sentence, no pitch. If comparison/workflow/how-to → don't name it, describe the solution shape at most. When in doubt → don't mention it.

**Flex by post type:**

- Thesis: body builds argument layer by layer, gap section is the core claim
- Comparison: body sections are comparison axes, gap is "what neither solves"
- Workflow: body sections are steps, hook is the pain point resolved
- Landscape: body maps territory, gap reveals what's absent

---

## Phase 5: Editor Subagent

Launch an editor via the Agent tool with **clean context**. The editor has never seen your conversation. It does a cold read.

**The editor receives ONLY:**
- The full draft text (read the draft file and include its content in the prompt)
- The writing guide (`_system/instructions/blog-post-writing.md` — include its content)
- The brand voice guide (`product/tokenrip/tokenrip-branding.md` — include its content)

**Nothing else.** No sources, no conversation context, no knowledge of the user's intent.

**Editor prompt must instruct it to check these six categories:**

1. **Source hygiene** — Flag any internal identifiers: issue numbers (e.g. "Issue #48028"), PR links, commit SHAs, internal ticket references, raw URLs used as citations, or references that would mean nothing to someone outside a specific project. These must be removed or replaced with reader-meaningful context.

2. **Jargon density** — Flag sections where technical language is inaccessible to non-engineer operators. The test: "Would someone running agents for content marketing understand this paragraph?" If not, it needs rewriting or explaining. Also flag inline code formatting (backtick code spans like `file/paths` or `command --flags`) in posts that are not workflow/how-to type. Inline code signals "implement this" to readers. In informational, thesis, comparison, or landscape posts, describe behaviors in plain language instead: "Claude Code stores memory in a project-scoped markdown file" not `~/.claude/projects/<project>/memory/MEMORY.md`.

3. **Writing guide compliance** — Is there a clear angle in the first 3 sentences? Does it open with tension (not definitions)? Are subheadings claims (not labels)? Does the post have an actual take? Is it 1500-2500 words? Does every section earn its place? Does it end with implication (not summary)?

4. **Tokenrip mention rules** — Does Tokenrip appear only in the gap/fix section (if at all)? Does it read as infrastructure reference or product pitch? If it appears in the intro or as the hero, flag it.

5. **AI tells** — Flag generated-sounding phrases: "in today's rapidly evolving landscape", "it's important to note", "let's dive in", "in conclusion", hedging without substance, filler paragraphs that add nothing. Also flag structural repetition patterns: if every section ends with a punchy one-liner declaration, that uniformity is itself a tell. Vary section exits — some can end mid-thought, some with a question, some flowing into the next section.

6. **Reader utility** — Read the post as a practitioner who runs agents in production. After reading, ask: "Can I do something differently now? Did I learn something I didn't know? Or did I just read a structured summary of things I could have found myself?" Flag sections that inform without enabling — where the post describes a concept but never shows the reader how to apply it, what to watch for, or what decision to make. An information dump organized under nice headings is still an information dump. Every section should leave the reader with something actionable: a technique to try, a failure mode to watch for, a decision framework, or a concrete next step. If more than two sections fail this test, the post needs structural revision, not patch fixes.

**The editor must return a structured report:**

~~~
## Verdict: PASS | REVISE | REJECT

## Source Hygiene
[findings or "Clean"]

## Jargon Density
[findings or "Accessible"]

## Writing Guide Compliance
[findings or "Compliant"]

## Tokenrip Mention Rules
[findings or "Compliant"]

## AI Tells
[findings or "Clean"]

## Reader Utility
[findings or "Actionable"]

## Specific Issues
1. [Location] — [issue] — [suggested fix]
2. ...
~~~

Verdicts:
- **PASS** — no blocking issues, minor suggestions only
- **REVISE** — specific issues that must be fixed before publishing
- **REJECT** — fundamentally broken (no angle, wrong audience, reads like scraped content). Needs rewrite, not patch.

---

## Phase 6: Revise + Checkpoint 1

Read the editor's report.

- If **PASS**: present the draft to the user along with any minor suggestions from the editor.
- If **REVISE**: apply the editor's fixes automatically. Present the revised draft to the user with a summary of what changed and why.
- If **REJECT**: present the editor's report to the user. Ask how to proceed. Do not auto-fix a fundamentally broken draft.

**This is Checkpoint 1.** The user reviews the draft and either:
- Approves → proceed to Phase 7
- Requests changes → revise and present again (loop until satisfied)
- Kills the pipeline

Do NOT proceed past this checkpoint without explicit user approval.

---

## Phase 7: Humanizer

Once the user approves the draft, invoke the `humanizer` skill on the draft file (`content/<post-slug>-draft.md`).

The humanizer flushes AI-sounding language, stiff phrasing, and pattern tells.

---

## Phase 8: Checkpoint 2

Present the humanized version to the user. This is the final look before the post goes live. The substance was locked at Checkpoint 1 — this confirms the polish didn't break anything.

**This is Checkpoint 2.** The user reviews and either:
- Approves → proceed to Phase 9
- Requests changes → revise and present again
- Kills the pipeline

Do NOT proceed past this checkpoint without explicit user approval.

---

## Phase 9: Publish via rip CLI

On approval, generate SEO metadata and publish.

### Step 1: Generate metadata from the final draft

- **title**: from frontmatter
- **slug**: from frontmatter
- **description**: one sentence, max 160 chars, no filler phrases ("In this post", "We explore"). Summarize what the reader gets.
- **tags**: 3-7 lowercase topic tags with hyphens, no spaces. No generic tags ("blog", "article", "ai"). Must reflect specific topics in the article.
- **faq**: 5-10 Q&A pairs. Questions must be things a reader would genuinely ask — not restatements of headers. Answers must come from article content, specific and useful on their own.
- **reading_time**: word count / 200, rounded up, minimum 1
- **publish_date**: current ISO 8601 timestamp
- **author**: omit. This publication does not publish named authors.

### Step 2: Build metadata JSON

~~~json
{
  "post_type": "blog_post",
  "title": "...",
  "description": "...",
  "publish_date": "...",
  "tags": ["...", "..."],
  "reading_time": N,
  "faq": [{"q": "...", "a": "..."}, ...]
}
~~~

### Step 3: Create a publish-ready file

The draft file contains YAML frontmatter and an H1 heading that are for local tracking only — they must not appear in the published post. Before publishing, create a clean file:

1. Strip the YAML frontmatter (everything between the opening and closing `---` delimiters, inclusive)
2. Strip the first `# Heading` line (Tokenrip renders the title from the `--title` flag separately)
3. Strip any leading blank lines after removal
4. Save to `content/<slug>-publish.md` (this is a temporary file — can be deleted after publish)

### Step 4: Check if slug exists

~~~bash
rip asset get <slug>
~~~

- Success → update path (Step 5b)
- Not found → publish path (Step 5a)

### Step 5a: New post

~~~bash
rip asset publish content/<slug>-publish.md --type markdown --alias <slug> --title "<title>" --metadata '<metadata-json>'
~~~

### Step 5b: Existing post

~~~bash
rip asset update <id> content/<slug>-publish.md --type markdown
rip asset patch <id> --metadata '<metadata-json>'
~~~

Use the asset ID returned by `rip asset get <slug>`.

### Step 6: Clean up

Delete `content/<slug>-publish.md`. The draft file (`content/<slug>-draft.md`) remains as the local record with full metadata.

### Step 7: Report

~~~
Published: <title>
URL: <url>
Slug: <slug>
Tags: <tag1>, <tag2>, ...
Reading time: N min
Word count: N
Sources: content/sources/<slug>/references.md
Draft: content/<slug>-draft.md
~~~

---

## Error Handling

- **Slug exists but is not a blog post**: stop, ask user whether to continue
- **rip CLI publish/update/patch fails**: show full error, stop. Don't retry automatically.
- **Editor rejects draft**: present report to user, don't auto-rewrite
- **Metadata JSON build fails**: show the metadata, ask user to fix
```

---

## FILE 2: Writing Guide — `_system/instructions/blog-post-writing.md`

```markdown
# Blog Post Writing Guide — Intelligence Engine

**What this is:** Production instructions for writing Intelligence Engine blog posts. Dual-purpose: agent drafting instructions and human editorial reference.

**Positioning:** This publication delivers operational intelligence for agentic operators. Tokenrip is never the product being sold. It is infrastructure — mentioned only where a post argues something is missing from the ecosystem.

**Voice and tone:** See `product/tokenrip/tokenrip-branding.md`. This guide does not repeat those rules. Read it before writing.

---

## Definition of Ready

Do not start writing until these exist:

- **Post brief.** Post type (thesis, comparison, landscape, workflow, technical craft) and key angles to cover.
- **Source material.** Minimum 3 primary sources (docs, repos, official sites) and 2 community signal sources (Reddit, HN, X threads). The writer should not be researching and writing simultaneously.
- **Angle.** One sentence stating what this post argues or reveals that existing coverage doesn't. If you can't state the angle, you're not ready to write.
- **Optional:** Target keywords (from blog plan if specified), internal link targets (link where relevant once other posts exist).

If source material is thin, stop. Go back to ingestion. A post without signal density is just an opinion piece — this is a signal-backed publication.

---

## Editorial Voice

**Publication voice, not personal blog.** No named author. Use "we" sparingly and only when grounded in real testing or experience. Default to authoritative third-person: "Operators evaluating X should consider..." not "I think X is better."

**Practitioner signal is earned, not default.** "We tested," "in our experience," "operators we've spoken to report" — use these only when the testing actually happened. If the post is a landscape overview synthesized from sources, don't fake practitioner authority. Credibility comes from synthesis depth, not from pretending you used all 12 tools.

**Opinionated, not neutral.** Every post has a take. "Here are five options" is a listicle. "Here are five options, here's which one to use and why" is operational intelligence. The opinion must be grounded in evidence — signals, testing, community consensus — not vibes.

**Practitioner, not theoretical.** When the topic warrants it, show the reader how to do the thing — step by step, with specifics. "Here's how to set up persistent memory in your agent" beats "persistent memory is an important consideration." Not every post is a how-to, but the default posture is operational: if a reader could act on this section, make sure they know exactly how. Architecture and theory serve the practitioner framing, not the other way around. The content lens for everything: **"How can I use this?"**

---

## Structure

### Principles

- **Open with tension.** First 2-3 sentences establish a problem, gap, or counterintuitive observation. Never open with definitions or history. The reader should feel something unresolved.
- **Every section earns its place.** If a section doesn't advance the argument or give the reader something actionable, cut it.
- **End with implication, not summary.** The closing points forward — what this means, what's coming, what to watch. Never recap what you just said.
- **Subheadings are scannable claims.** Not "Background" or "Analysis." Instead: "Multi-agent frameworks solve orchestration, not collaboration." A reader skimming headings should get the argument.

### Skeleton

~~~
Hook (2-3 sentences — tension, gap, or observation)
Stakes (why this matters now — 1 paragraph)
Body (3-5 sections, each advancing the argument)
The gap / what's missing (where the ecosystem falls short)
Implication (what this means — forward-looking)
~~~

### How it flexes

- **Thesis posts:** Body builds the argument layer by layer. The gap section is the core claim.
- **Comparison posts:** Body sections become comparison axes. The gap becomes "what neither tool solves."
- **Workflow/how-to posts:** Body sections become steps. Hook is the pain point the workflow resolves.
- **Landscape posts:** Body sections map the territory. The gap reveals what's absent from the map.

---

## The Tokenrip Mention Framework

Three rules:

1. **Never in the intro.** Tokenrip does not appear in the hook, stakes, or first body section. The post earns attention on the strength of its argument.
2. **Never as the hero.** Tokenrip is never "the answer." It is infrastructure — mentioned the way a post about web apps might mention HTTP.
3. **Always in the shape of what's missing.** When Tokenrip appears, it's in the context of "the ecosystem lacks X" where X happens to be what Tokenrip provides.

### Decision tree

- **Does the post argue for something Tokenrip is building?** (e.g., a collaboration layer for agents) → Name it once in the gap/fix section. One sentence. No pitch language.
- **Is the post a comparison, workflow, or how-to that doesn't argue for infrastructure?** → Don't name it. If the gap is relevant, describe the solution shape: "a purpose-built surface where agents publish and coordinate." Readers who know Tokenrip connect the dots.
- **When in doubt** → Don't mention it. A post that never mentions Tokenrip but makes the reader think "someone should build this" is a better outcome than a post that mentions it and feels like content marketing.

---

## SEO Mechanics

- **One primary keyword per post.** Appears in the title, first 100 words, one H2, and the meta description.
- **Title under 60 characters.** Primary keyword near the front. The title is a claim or comparison, not a question.
- **Meta description: 150-160 characters.** Includes primary keyword. Written as a hook, not a summary.
- **URL slug: short, keyword-rich.** `/agentic-collaboration`, `/openclaw-vs-hermes`. No dates, no filler.
- **Subheadings target secondary keywords naturally.** If the H2 reads awkwardly because a keyword was forced in, rewrite for clarity.
- **Target indexers first, humans second.** Clean HTML semantics, Article schema markup (author, date, modified date), OG image per post.
- Keywords are optional inputs. If the blog plan specifies them for a post, use them. Otherwise, pick a natural primary keyword from the post's angle.

---

## Quality Bar

A post is ready for publish when:

- **The angle is clear in the first 3 sentences.** A reader knows what this post argues and why it matters before scrolling.
- **Every claim has backing.** A cited source, a data point, a community signal, or stated practitioner experience. No unsupported assertions dressed as authority.
- **It passes the "so what" test.** After reading, the reader can do something differently, make a decision, or see something they didn't see before.
- **1500-2500 words.** Under means it's thin. Over means it's unfocused. If you can't cut to 2500, you have two posts.
- **Tokenrip mention rule is respected.** Check: does Tokenrip appear before the gap/fix section? Does it read like a pitch? If yes to either, rewrite or remove.
- **Subheadings tell the story alone.** Read just the H2s in order. Do they form a coherent argument? If they read like generic labels, rewrite them as claims.
- **No AI tells.** No "in today's rapidly evolving landscape," no "it's important to note that," no "let's dive in." If it sounds generated without editorial judgment, it wasn't edited enough.
```

---

## FILE 3: Brand Voice — `product/tokenrip/tokenrip-branding.md`

```markdown
# Tokenrip — Branding, Positioning & Framing

**Status:** Active
**Created:** 2026-04-13
**Owner:** Simon

---

## Core Position

**Tokenrip is the collaboration layer for agents and operators.**

This is the category claim. Every piece of external communication — taglines, landing pages, docs, social, pitch decks — should reinforce this frame.

---

## The Collaboration vs. Coordination Distinction

### Why Not "Coordination"

"Coordination" in the agent space is saturated. CrewAI, LangGraph, AutoGen, and dozens of orchestration frameworks all occupy "agent coordination." The term implies a specific architecture: one operator, multiple agents, shared context, orchestrated task execution. Swarm management.

That is not what Tokenrip does.

### Why "Collaboration"

"Collaboration" stakes out unclaimed territory. The distinction is structural:

| | Coordination | Collaboration |
|---|---|---|
| **Topology** | One operator, many agents | Many operators, or operator + agent |
| **Context** | Shared context within a system | Independent contexts bridged across boundaries |
| **Relationship** | Hierarchical (orchestrator → workers) | Peer-to-peer (parties working together) |
| **Existing players** | CrewAI, LangGraph, AutoGen, etc. | **No one** |

Collaboration assumes independent parties who need to work together across boundaries — across agent platforms, across teams, across organizations. This is blue ocean.

### The Single-Operator Case

Collaboration is not limited to multi-party scenarios. A single operator collaborates with their own agent: the agent publishes something, the operator comments on it, the agent revises. That feedback loop is collaboration, not coordination. It feels natural to say "I collaborate with my agent." It does not feel natural to say "I coordinate with my agent."

### The Bridge Framing

Tokenrip bridges what exists today (agents working within siloed environments) to what needs to exist (disparate teams collaborating around shared resources through their agents). The product works at every scale:

- **Solo:** I collaborate with my agent on a document
- **Team:** Our agents collaborate on shared assets within a project
- **Cross-org:** Two organizations' agents collaborate through shared workspaces

Each scale is a natural extension of the same primitive, not a different product.

---

## Audience

### Primary Filter

**"Do you use an agent? Then this is for you."**

The audience is anyone who uses an agent — not developers specifically, not infrastructure teams, not enterprises. The broadest possible filter that remains precise.

This encompasses:
- Developers using Claude Code, Cursor, Windsurf, etc.
- Non-technical users on OpenClaw, Hermes, or similar agent platforms
- Teams with mixed technical and non-technical members
- Agent platform builders who want somewhere for their agents' output to live

### Implication for Language

All external copy must pass the **non-developer test**: would an OpenClaw user who has never opened a terminal understand this? If not, rewrite it. Technical details (API endpoints, CLI commands) are provided as one path among several, never as the default framing.

- Say "your agent publishes" not "call the publish endpoint"
- Say "install the skill" not "npm install"
- Say "you get a link" not "a persistent URL is generated"
- Lead with the universal experience, then show platform-specific instructions

---

## Messaging Framework

### The Problem (Visceral, Not Abstract)

Do not describe the problem in infrastructure terms ("agents operate in siloed contexts"). Describe it in terms the user feels:

> Your agent just built something great. Now what? It's stuck in a chat window. To share it, you copy-paste into a doc. To collaborate on it, you re-explain context in a new conversation. To find it next week, you scroll through history.

The friction is personal: **every asset requires manual plumbing to escape the conversation.** That scales linearly with usage. As agents produce more, the problem compounds.

### The Solution (Action, Not Category)

Lead with what happens, not what the product is:

- Your agent publishes → you get a link → anyone can view it
- Your agent revises → new version, same URL
- Someone comments → your agent picks it up

The product disappears into the workflow. The user experiences the outcome, not the infrastructure.

### Differentiation (Design Premise, Not Features)

The competitive argument is not "we have better features than Google Docs." The argument is a design premise gap:

> Every existing collaboration tool assumes humans are the primary creators and consumers. Tokenrip assumes agents are. The difference is not features — it is the design premise. Mobile-first vs. mobile-responsive.

This reframes the conversation away from feature comparison (where incumbents win) toward architectural philosophy (where Tokenrip is alone).

---

## Key Language & Terminology

### Use

| Term | Context |
|------|---------|
| **Collaboration layer** | Category descriptor — "the collaboration layer for agents and operators" |
| **Operators** | People who use agents (broader than "developers" or "users") |
| **Publish** | The primary action — agents publish their work |
| **Assets** | What agents produce — reports, docs, code, data, charts |
| **Shareable link** | What you get — immediate, no-login access |
| **Built for agents** | Design philosophy — not "AI-powered" or "AI-enhanced" |
| **Skill** | The install unit — "install the Tokenrip skill" |

### Avoid

| Term | Why | Instead |
|------|-----|---------|
| **Coordination** | Crowded, implies swarm orchestration | Collaboration |
| **AI-generated assets** | Abstract, nobody identifies with this | "Your agent's work" or "agent-produced output" |
| **Asset routing** | Infrastructure jargon | "Publish & share" |
| **Persistent URL** | Technical | "Shareable link" |
| **Agent-first design** | Architecture descriptor, not a benefit | "Built for agents" |
| **Endpoint / API call** | Developer-only language (in user-facing copy) | "Your agent publishes" |
| **Zero friction** | Overused, meaningless | Describe the actual experience |

---

## Competitive Framing

### Do Not Compare Features

Tokenrip will lose any feature-for-feature comparison against Google Docs, Notion, or GitHub. Do not invite this comparison.

### Do Compare Design Premises

| | Human-first tools | Tokenrip |
|---|---|---|
| **Who registers** | The human | The agent |
| **Who publishes** | The human uploads/pastes | The agent publishes directly |
| **Who formats** | The human (or template) | Automatic, type-aware rendering |
| **Who polls for changes** | The human checks notifications | The agent polls a status endpoint |
| **Auth model** | Human SSO, OAuth | Keypair-based, agent self-service |

The frame: "Those tools were built for humans. Agents are bolted on. Tokenrip was built for agents from day one."

### The Figma Analogy

Figma made design files linkable. Before Figma, sharing a design meant exporting, uploading, losing fidelity. Figma's insight: the link is the product.

Tokenrip makes agent output linkable. Before Tokenrip, sharing agent output means copy-pasting, reformatting, losing context. Tokenrip's insight: **the link is the collaboration surface.**

Use this analogy sparingly — it clarifies the distribution model (viral through links) but can overstate the comparison to a mature product.

---

## Brand Voice

### Tone

- **Direct.** Say what it does, not what it could become.
- **Warm but not cute.** "Your agent publishes" not "Let your AI buddy share its creations!"
- **Confident without hype.** "Built for agents" not "Revolutionary AI-native paradigm shift."
- **Inclusive.** Speak to anyone with an agent, not just developers.

### Style

- Short sentences. Active voice.
- Show, don't describe. "Your agent publishes → you get a link" beats "Tokenrip provides a seamless publishing experience."
- Concrete over abstract. "Markdown, HTML, code, PDFs" beats "any type of content."
- The user is "you." The agent is "your agent." Not "the user" or "the agent."

---

## Application

This document governs all external-facing Tokenrip communication:
- Website copy (about, FAQ, landing pages)
- Documentation and README files
- Social media and announcements
- Pitch decks and investor materials
- Integration descriptions on partner platforms

Internal documents (architecture docs, technical specs) may use precise technical language where appropriate but should still prefer "collaboration" over "coordination" when describing the product's purpose.
```
