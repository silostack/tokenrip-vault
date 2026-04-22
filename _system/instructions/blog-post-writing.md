# Blog Post Writing Guide — Intelligence Engine

**What this is:** Production instructions for writing Intelligence Engine blog posts. Dual-purpose: agent drafting instructions and human editorial reference.

**Positioning:** This publication delivers operational intelligence for agentic operators. Tokenrip is never the product being sold. It is infrastructure — mentioned only where a post argues something is missing from the ecosystem.

**Voice and tone:** See `product/tokenrip/tokenrip-branding.md`. This guide does not repeat those rules. Read it before writing.

**Post briefs:** See `active/tokenrip-initial-blog-plan-2026-04-11.md` for per-post targets (type, angles, keywords, content to ingest).

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

---

## Structure

### Principles

- **Open with tension.** First 2-3 sentences establish a problem, gap, or counterintuitive observation. Never open with definitions or history. The reader should feel something unresolved.
- **Every section earns its place.** If a section doesn't advance the argument or give the reader something actionable, cut it.
- **End with implication, not summary.** The closing points forward — what this means, what's coming, what to watch. Never recap what you just said.
- **Subheadings are scannable claims.** Not "Background" or "Analysis." Instead: "Multi-agent frameworks solve orchestration, not collaboration." A reader skimming headings should get the argument.

### Skeleton

```
Hook (2-3 sentences — tension, gap, or observation)
Stakes (why this matters now — 1 paragraph)
Body (3-5 sections, each advancing the argument)
The gap / what's missing (where the ecosystem falls short)
Implication (what this means — forward-looking)
```

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
