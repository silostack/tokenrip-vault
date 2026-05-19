# Content Folder

Blog posts and supporting research for Tokenrip's Intelligence Engine.

## Layout

```
content/
├── drafts/      # Working drafts not yet published
├── published/   # Posts live on tokenrip.com/blog
├── plans/       # Series outlines and planning docs
└── sources/     # Research references, one subfolder per post slug
    └── _archive/  # Superseded research (kept for reference)
```

## Lifecycle

1. **Research** → create `sources/[slug]/references.md`
2. **Draft** → create `drafts/[slug]-draft.md` (slug must match sources/ subfolder)
3. **Publish** → run the `/blog-post` skill, which publishes to Tokenrip
4. **Archive locally** → move file to `published/[slug].md` (drop the `-draft` suffix, add `tokenrip_id` to frontmatter)

Nothing should live at the content/ root. Every file belongs in a subdirectory.

## Frontmatter

### Drafts (`drafts/[slug]-draft.md`)

```yaml
---
title: "Post Title"
slug: post-slug
post_type: thesis | comparison | landscape | workflow | craft
created: YYYY-MM-DD
word_count: N
sources: content/sources/post-slug/references.md
keywords: [keyword1, keyword2]
meta_description: "150-160 chars"
---
```

### Published (`published/[slug].md`)

Same as draft, plus:

```yaml
tokenrip_id: <uuid>   # Tokenrip artifact ID — use for `rip artifact update <id>`
```

The `tokenrip_id` enables updating the live post: `rip artifact update <tokenrip_id> content/published/<slug>.md`

## Sources

Every post (draft or published) should have a matching `sources/[slug]/references.md`. This file tracks primary sources, community signals, and research used during writing.

Superseded research goes in `sources/_archive/` rather than being deleted.

## Series Plans

Series outlines live in `plans/`. Each plan covers a multi-post arc with post briefs, SEO strategy, and cross-linking guidance. Current series:

- Series 1: Multi-Agent Collaboration (`blog-series-1-multi-agent-collaboration-plan.md`)
- Series 2: Agent-Native Operations (`blog-series-2-agent-native-operations-plan.md`)
- Series 3: Mounted Agents (`blog-series-3-mounted-agents-plan.md`)

The blog post framework (`blog-post-framework.md`) defines post types and structural templates.

## What does NOT belong here

- Product/platform docs → `product/tokenrip/` or `product/intelligence-engine/`
- Branding/positioning → `product/tokenrip/`
- WIP non-content → `active/`
