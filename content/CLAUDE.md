# Content Folder

Blog posts and supporting research for Tokenrip's Intelligence Engine.

## Layout

```
content/
├── drafts/      # Active working drafts
├── published/   # Posts that have gone live (move here post-publish)
├── plans/       # Series outlines and planning docs
└── sources/     # Research references, one subfolder per post slug
```

## Where to put things

- **New post draft** → `drafts/[slug]-draft.md`
- **References for a post** → `sources/[slug]/references.md`
- **Series plan / outline** → `plans/`
- **Post goes live** → move from `drafts/` to `published/`

Slugs in `drafts/` should match the corresponding `sources/` subfolder name so research stays linked to its post.

## What does NOT belong here

- Product/platform docs → `product/tokenrip/` or `product/intelligence-engine/`
- Branding/positioning → `product/tokenrip/`
- WIP non-content → `active/`
