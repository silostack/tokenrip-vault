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

```markdown
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
```

If the user provides URLs, use WebFetch to retrieve and summarize them. If the user provides raw content or descriptions, record those directly.

---

## Phase 4: Write the Draft

Write the full draft in one pass.

**File:** `content/<post-slug>-draft.md`

**Format:**

```markdown
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
```

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

```
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
```

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

```json
{
  "post_type": "blog_post",
  "title": "...",
  "description": "...",
  "publish_date": "...",
  "tags": ["...", "..."],
  "reading_time": N,
  "faq": [{"q": "...", "a": "..."}, ...]
}
```

### Step 3: Create a publish-ready file

The draft file contains YAML frontmatter and an H1 heading that are for local tracking only — they must not appear in the published post. Before publishing, create a clean file:

1. Strip the YAML frontmatter (everything between the opening and closing `---` delimiters, inclusive)
2. Strip the first `# Heading` line (Tokenrip renders the title from the `--title` flag separately)
3. Strip any leading blank lines after removal
4. Save to `content/<slug>-publish.md` (this is a temporary file — can be deleted after publish)

### Step 4: Check if slug exists

```bash
rip asset get <slug>
```

- Success → update path (Step 5b)
- Not found → publish path (Step 5a)

### Step 5a: New post

```bash
rip asset publish content/<slug>-publish.md --type markdown --alias <slug> --title "<title>" --metadata '<metadata-json>'
```

### Step 5b: Existing post

```bash
rip asset update <id> content/<slug>-publish.md --type markdown
rip asset patch <id> --metadata '<metadata-json>'
```

Use the asset ID returned by `rip asset get <slug>`.

### Step 6: Clean up

Delete `content/<slug>-publish.md`. The draft file (`content/<slug>-draft.md`) remains as the local record with full metadata.

### Step 7: Report

```
Published: <title>
URL: <url>
Slug: <slug>
Tags: <tag1>, <tag2>, ...
Reading time: N min
Word count: N
Sources: content/sources/<slug>/references.md
Draft: content/<slug>-draft.md
```

---

## Error Handling

- **Slug exists but is not a blog post**: stop, ask user whether to continue
- **rip CLI publish/update/patch fails**: show full error, stop. Don't retry automatically.
- **Editor rejects draft**: present report to user, don't auto-rewrite
- **Metadata JSON build fails**: show the metadata, ask user to fix
