# Blog Agent — Full System Reference

> Complete technical reference for the Tokenrip-hosted blog post agent (Intelligence Engine). Contains every asset ID, architecture decision, and workflow phase. Use this document to reconstruct, modify, or replicate the system from scratch.

---

## Architecture Overview

The blog agent follows the same **bootloader pattern** as the engagement agent: a thin local Claude Code command (`.claude/commands/blog-post.md`) that dynamically loads its full instructions from Tokenrip assets at runtime.

```
┌─────────────────────────────────────────────────────────────┐
│  LOCAL MACHINE (.claude/commands/blog-post.md)              │
│                                                             │
│  Contains: Routing logic only (no config/keys needed)       │
│  Does: Runs rip update → fetches blog-skill asset → follows │
└────────────────────────┬────────────────────────────────────┘
                         │ rip asset cat
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  TOKENRIP ASSETS (blog-skill folder, tokenrip team)         │
│                                                             │
│  blog-skill           → master skill (phases 0-11)          │
│  blog-writing-guide   → editorial standards, structure      │
│  blog-brand-voice     → tone, positioning, messaging        │
│  humanizer-skill      → AI-tell removal (phase 9)           │
└────────────────────────┬────────────────────────────────────┘
                         │ rip asset publish/update
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  TOKENRIP (published posts)                                  │
│                                                             │
│  Each post published as a versioned asset with SEO metadata │
│  in the blog-posts folder, tokenrip team                    │
└─────────────────────────────────────────────────────────────┘
```

**Key difference from engagement agent:** The blog agent has no collections — it doesn't track operational state across runs. Each invocation is a full pipeline run from research through publish. Local files (`content/` directory) serve as the working state.

---

## Asset Registry

All assets live in the `blog-skill` folder of the `tokenrip` team.

| Asset | ID | Alias | Purpose |
|-------|-----|-------|---------|
| **Blog Skill** | `5f187f3f-7571-470c-8790-f55b271b68ef` | `blog-skill` | Master workflow: 11 phases from input assessment through publish |
| **Blog Writing Guide** | `060336e1-2c75-41b0-bc49-123b5fab467d` | `blog-writing-guide` | Editorial standards: structure, voice, code formatting, anti-patterns |
| **Blog Brand Voice** | `b698232c-add5-4c3c-8b1f-8bbd26200535` | `blog-brand-voice` | Tokenrip branding, positioning, messaging framework, audience |
| **Humanizer Skill** | `da5c7e16-6e49-4ba0-b273-d489a7f7a7f9` | `humanizer-skill` | AI-tell detection and removal (v2.5.1, from github.com/blader/humanizer) |

**Folder ID:** `4788ef18-efed-4cd7-a2a7-3a68f7991875` (slug: `blog-skill`, team: `tokenrip`)

**URLs:** Any asset is viewable at `https://tokenrip.com/s/<id>`

**Updating an asset:** `rip asset update <id> <file>` publishes a new version. The alias always resolves to the latest version.

---

## The Bootloader (Local Command)

**File:** `.claude/commands/blog-post.md`

```markdown
# Blog Post — Intelligence Engine

Run these commands in order, then follow the skill instructions:

1. Run `rip update` to ensure the latest CLI version
2. Run `rip asset cat blog-skill` to fetch the current skill
3. Follow the returned instructions exactly — they are your complete workflow

The skill will fetch the writing guide and brand voice automatically.
```

The bootloader is three lines. All intelligence lives in the `blog-skill` asset. No API keys or config needed — the `rip` CLI handles authentication, and publishing uses the operator's own Tokenrip identity.

---

## The Pipeline: 11 Phases

The blog skill runs a linear pipeline with two hard checkpoints (human gates) and two automated gates (idea gate, draft gate). Nothing publishes without explicit operator approval.

```
Phase 0:  Setup — fetch writing guide + brand voice from Tokenrip
Phase 1:  Assess Inputs — check definition of ready (type, angle, sources)
Phase 2:  Idea Gate — three kill tests, binary pass/reject
Phase 3:  Auto-Research — 3-5 web searches, supplement user sources
Phase 4:  Save Sources — create content/sources/<slug>/references.md
Phase 5:  Write Draft — full post in content/<slug>-draft.md
Phase 6:  Draft Gate — four kill signals, binary pass/kill
Phase 7:  Editor Subagent — cold-read review with clean context
Phase 8:  Revise + Checkpoint 1 — human reviews draft
Phase 9:  Humanizer — AI-tell removal via subagent
Phase 10: Checkpoint 2 — human reviews humanized version
Phase 11: Publish — generate SEO metadata, publish via rip CLI
```

### Phase Flow Detail

**Phase 0: Setup**
Fetches `blog-writing-guide` and `blog-brand-voice` from Tokenrip. These are held in context for the entire run — the writing guide governs draft quality, the brand voice governs tone and positioning.

**Phase 1: Assess Inputs**
Checks the operator's brief against the definition of ready:
- Post type (thesis, comparison, landscape, workflow, craft)
- Key angles
- Source material
- Angle statement — the single most critical input. "What should a reader believe after reading this that they didn't believe before?"

If inputs are missing, the agent asks. It never proceeds without a clear angle.

**Phase 2: Idea Gate (automated, binary)**
Three kill tests — fail any one and the idea is rejected:

| Test | Question | Fail Example |
|------|----------|-------------|
| "Who Gives a Shit" | Can you name a specific person with a specific job who'd stop to read this? | "Developers interested in multi-agent systems" |
| "Tool in Hand" | After reading, can the reader USE something — apply a question, run a diagnostic, paste a clause into an RFP, evaluate something they're considering? Awareness isn't enough. | "Understand that agent handoffs are hard" |
| "Not a Bug Report" | Would this survive without issue numbers and repo names? | Content organized around PRs and version numbers |

**Phase 3: Auto-Research**
Runs 3-5 web searches from different angles. Freshness rule: discard results older than 5 months. User-provided sources always take priority. Does not wait for approval — results supplement, they don't gate.

**Phase 4: Save Sources**
Creates `content/sources/<slug>/references.md` with structured metadata for all primary and community sources — both user-provided and researched.

**Phase 5: Write Draft**
Full draft in one pass to `content/<slug>-draft.md`. Key rules from the writing guide:
- Open with tension, never definitions
- Subheadings are scannable claims, not labels
- Every claim backed by source material
- **Standalone completeness:** every post earns its keep alone — a cold-search reader gets full value without reading any other post
- **Close with a tool, then synthesize** — diagnostic/checklist/framework/questions, followed by a wrap-up that ties the tool back to the body's argument, names what the tool does and doesn't do, and lands on a quotable sentence. Forward-links to other posts ride on top of the synthesis, never replace it
- No backtick code in non-implementation posts (thesis, comparison, landscape)
- Tokenrip mention: never in intro, never as hero, only in gap/fix section if at all
- Length: 1000-2500 words — let the post be the length it should be. Don't pad to hit a floor; don't compress past the ceiling if it costs the standalone payoff
- Inline source links (3-8 per post), no references section

**Phase 6: Draft Gate (automated, binary)**
Five kill signals — any one kills the draft:

| Signal | What It Catches |
|--------|----------------|
| Catalog Ratio | >30% of body walks through sources one by one |
| Original Thinking | Core insight is just restating what sources say |
| Structure Test | Subheadings form a list, not a building argument |
| Tokenrip Integration | Tokenrip mention bolted on rather than earned |
| Standalone Close | Post ends with a tease/summary/rhetorical question instead of a tool, OR delivers a tool but stops without synthesis (no tie-back to body's argument, no landing line) |

A killed draft goes back to Phase 2 for re-angling. No salvage attempts.

**Phase 7: Editor Subagent**
Launches a separate agent with clean context (no conversation history). The editor receives only the draft, writing guide, and brand voice. Reviews eight categories:
1. Code formatting (blocking for non-implementation posts)
2. Source hygiene (no issue numbers, PRs, commit SHAs)
3. Jargon density
4. Writing guide compliance
5. Tokenrip mention rules
6. AI tells
7. Reader utility
8. Standalone completeness (does the post stand alone? does it close with a tool, not a tease? does the close synthesize the tool back to the body's argument and land?)

Returns PASS / REVISE / REJECT verdict.

**Phase 8: Revise + Checkpoint 1 (human gate)**
If REVISE: fixes applied automatically, presented to operator. If REJECT: report shown, operator decides. Operator must explicitly approve before proceeding.

**Phase 9: Humanizer**
Fetches `humanizer-skill` from Tokenrip. Launches a subagent with clean context — receives only the humanizer instructions and the draft. Edits the draft file in place to flush AI-sounding language.

**Phase 10: Checkpoint 2 (human gate)**
Final look. Substance was locked at Checkpoint 1 — this confirms polish didn't break anything. Operator must explicitly approve.

**Phase 11: Publish**
1. Generate SEO metadata (title, description, tags, FAQ, reading time)
2. Strip YAML frontmatter and H1 heading from draft
3. Pre-publish quality gate: scan for backtick code spans in non-implementation posts
4. Check if slug exists (`rip asset get <slug>`)
5. Publish new or update existing via `rip asset publish` / `rip asset update`
6. Clean up temp publish file, keep draft as local record

Published posts go to the `blog-posts` folder on the `tokenrip` team.

---

## Post Types

| Type | Structure | Code Allowed |
|------|-----------|-------------|
| **Thesis** | Argument builds layer by layer; gap section is core claim | No backticks |
| **Comparison** | Sections are comparison axes; gap is "what neither solves" | No backticks |
| **Landscape** | Sections map territory; gap reveals what's absent | No backticks |
| **Workflow** | Sections are steps; hook is the pain point resolved | Yes |
| **Craft** | Implementation-focused teaching | Yes |

---

## Local File Structure

The agent creates and manages files in the vault's `content/` directory:

```
content/
├── sources/
│   └── <slug>/
│       └── references.md        # Structured source metadata
├── <slug>-draft.md              # Working draft (persists as local record)
└── <slug>-publish.md            # Temporary clean file (deleted after publish)
```

---

## Operator Setup

### Prerequisites

1. `rip` CLI installed and authenticated (`rip auth`)
2. Claude Code installed
3. `.claude/commands/blog-post.md` in place (via vault git clone)

No additional API keys, services, or dependencies required. The humanizer skill is fetched from Tokenrip at runtime — no local installation needed (the setup doc's instruction to clone the humanizer repo locally is superseded by the Tokenrip-hosted version).

### Running

```
/blog-post
```

The skill is interactive — it asks for inputs, runs gates, and pauses at checkpoints. A typical run takes 15-30 minutes depending on research depth and revision cycles.

---

## Quality Controls

The system has four layers of quality enforcement:

| Layer | Type | When | What Happens on Failure |
|-------|------|------|------------------------|
| **Idea Gate** | Automated | Before research | Idea rejected, must re-angle or drop |
| **Draft Gate** | Automated | After first draft | Draft killed, back to idea gate |
| **Editor Subagent** | Automated | After draft gate | PASS / REVISE / REJECT verdict |
| **Human Checkpoints** | Manual | After editing, after humanizing | Operator approves, requests changes, or kills |

---

## Design Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Single bootloader vs. multi-mode | Single command, one mode | Blog posts are a single linear pipeline, not multiple operations |
| Guides as separate assets vs. inline | Separate assets (`blog-writing-guide`, `blog-brand-voice`) | Independent versioning, reusable by other agents/skills |
| Two automated gates vs. one | Two (idea gate + draft gate) | Catch bad ideas early (before research), catch bad execution later (before editing) |
| Editor as subagent vs. inline review | Subagent with clean context | Cold read catches issues the drafting agent is blind to |
| Humanizer as subagent vs. inline | Subagent with clean context | Isolated from drafting conversation, follows its own methodology |
| Local file state vs. collection state | Local files in `content/` | No cross-run state needed — each post is a complete pipeline run |
| No collections | No operational state to track | Unlike engagement agent, there's no queue or CRM to maintain |
| Code formatting as blocking | Any backtick in non-implementation post = auto-REVISE | Most common quality failure; hard rule prevents drift |
| Tokenrip mention framework | Never intro, never hero, only gap section if earned | Publication credibility depends on not reading as product marketing |

---

## Comparison: Blog Agent vs. Engagement Agent

| Dimension | Blog Agent | Engagement Agent |
|-----------|-----------|-----------------|
| **Pattern** | Bootloader | Bootloader |
| **Modes** | 1 (linear pipeline) | 4 (ingest, draft, outreach, send) |
| **Assets** | 4 (skill + writing guide + brand voice + humanizer) | 6 (common + 4 modes + template) |
| **Collections** | None | 2 (outreach list + CRM) |
| **External services** | None | AgentMail |
| **State** | Local files (`content/`) | Tokenrip collections |
| **Subagents** | 2 (editor + humanizer) | None |
| **Human gates** | 2 checkpoints | Daily review in collection UI |
| **Cadence** | On-demand (per post) | Daily operational loop |

---

*Reference created 2026-05-01. Source: `blog-skill` asset (v1.1), `.claude/commands/blog-post.md`, `active/alek-blog-post-setup.md`.*
