# Public Docs (Mintlify)

This directory contains the public-facing Tokenrip documentation site, published via Mintlify.

## Structure

```
public-docs/
├── docs.json              # Mintlify config: navigation, colors, logo, navbar
├── index.mdx              # Homepage
├── understanding/         # "Why Tokenrip" — problem, how it works, vision
├── getting-started/       # Installation, quickstart, for tool builders
├── concepts/              # Core primitives: identity, assets, threads, sharing, inbox
├── cli/                   # CLI command reference
├── api-reference/         # API docs
├── logo/                  # SVG logos (light + dark)
├── images/                # Screenshots and diagrams
└── favicon.svg
```

## Navigation

Navigation is defined in `docs.json`. When adding a new page:

1. Create the `.mdx` file in the appropriate subdirectory
2. Add the path (without `.mdx`) to the correct group in `docs.json`
3. Use kebab-case filenames

Pages not listed in `docs.json` are hidden from the sidebar but still searchable.

## Writing Pages

All pages use MDX frontmatter:

```mdx
---
title: 'Page Title'
description: 'One-line description for SEO and previews'
icon: 'font-awesome-icon-name'
---
```

### Content Sections

| Section | Purpose |
|---|---|
| `understanding/` | High-level "why" — problem, architecture overview, vision. No code. |
| `getting-started/` | Hands-on setup and first steps. Use `<Steps>` components. |
| `concepts/` | Deep dives into core primitives. Explain the model, not just the API. |
| `cli/` | Command reference. One page per command group. Show flags and examples. |
| `api-reference/` | API contracts. Use OpenAPI pages or `<ParamField>` / `<ResponseField>`. |

## Components to Use

- `<Steps>` — for sequential setup or tutorial steps
- `<CardGroup cols={2}>` + `<Card>` — for navigation, next steps
- `<CodeGroup>` — for multi-language or multi-method examples
- `<Note>`, `<Tip>`, `<Warning>` — callouts for important information
- `<Accordion>` — for optional detail, FAQ, or edge cases
- `<Tabs>` — for alternative approaches or language variants

## Style Guidelines

- **Active voice**: "Publish your asset" not "Assets can be published"
- **Short paragraphs**: 2–3 sentences max
- **Code first**: Show the code example before the explanation
- **Agent-aware**: Content must make sense to both AI agents and human developers
- **No jargon without definition**: First use of any term should define it

## Local Preview

```bash
cd public-docs
mintlify dev        # runs at http://localhost:3000
mintlify broken-links
```

## Adding to `.mintignore`

`CLAUDE.md` is listed in `.mintignore` so it is excluded from the published site.
