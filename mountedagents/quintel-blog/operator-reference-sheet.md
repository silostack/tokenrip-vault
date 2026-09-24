# Quintel Blog Publisher — Maintainer Reference Sheet

Team-owned agent (`@tokenrip`) that publishes finished markdown posts into
the Quintel blog CMS table, with a generated hero image and the SEO/GEO
editorial contract (`answer_summary`, `primary_query`, `content_cluster`,
`related_slugs`). Writes go through the repository's guarded publisher
(`bun run blog:publish` / `blog:validate` in `apps/backend` of the Quintel
repo), never a raw table write.

For the **operator-facing** how-to (setup, running it, what you'll be asked
to approve, troubleshooting), see
`product/quintel/quintel-blog-publisher-runbook.md`. This file is for
whoever next edits the brain.

## 1. What was created

| Artifact | Alias | Role | Id |
|---|---|---|---|
| Flow | `quintel-blog-flow` | full pipeline: preflight → editorial contract → QC → hero → publish → report | `9bdf513e-31fd-4fe3-8295-dd476c12869a` |

- **Agent slug:** `quintel-blog` (owner: team `@tokenrip`)
- **Team mount id:** `532e679f-2a4d-4c6c-850e-2bfb2866f5d1`
- **Blog table:** `b7114107-8373-4f77-b3c7-3df8bedd8427` (private, strict, unique `slug`)
- **Commands:** none declared — one default flow, mode inferred from what the operator asks (publish / update / unpublish / delete)

Until 2026-08, this agent had **no local authoring source** — it was
published directly and edited only by loading + re-publishing. This
directory (`mountedagents/quintel-blog/`) is that missing local source,
reconstructed by pulling the live artifact content before editing so no
undocumented behavior was silently dropped. Keep it as the source of truth
going forward — don't let it drift out of sync with what's actually
published again.

## 2. How to invoke

```
/tokenrip-bootloader quintel-blog
```

Then paste a post or give a file path. The loaded brain is fetched fresh
every time — if this file and the live brain ever disagree, that means
someone published a change without updating this directory; fix the
divergence, don't just trust whichever copy is more convenient.

## 3. How to push a change

1. Edit `brain/quintel-blog-flow.md` locally (keep the `<artifact
   role="flow" alias="quintel-blog-flow">` wrapper — it's part of the
   published content, not scaffolding).
2. Push a new version of the artifact:
   ```
   rip artifact update 9bdf513e-31fd-4fe3-8295-dd476c12869a \
     mountedagents/quintel-blog/brain/quintel-blog-flow.md
   ```
3. Re-publish the manifest so the agent record and any drift-detection pick
   up the change:
   ```
   rip agent publish mountedagents/quintel-blog/manifest.json --team tokenrip
   ```
4. Verify: `rip --json agent load quintel-blog --team tokenrip` and confirm
   the `brain[].content` reflects your edit and preflight still passes.
5. Update `product/quintel/quintel-blog-publisher-runbook.md` if operator-
   visible behavior changed (new required fields, new checkpoints, new
   report-block lines).

## 4. Data flow

```
/tokenrip-bootloader quintel-blog
      │
      ▼
  agent load ── brain (flow) + mount context + connection bindings
      │
      ▼
  preflight: connections bound? repo present? fetch all table rows
      │
      ▼
  editorial contract gathered + mechanically checked (query uniqueness,
  related_slugs validity) + clean-context QC pass (§1a) ──► operator confirms
      │
      ▼
  hero: concept-llm → image-gen → resize → upload public asset → image_alt
  derived from the real image ──► clean-context QC pass (§6a)
      │
      ▼
  temp markdown file (frontmatter + untouched body)
      │
      ▼
  apps/backend: bun run blog:publish <file> --image <publicUrl>
      │   (validates against every published row, rejects unknown fields,
      │    atomic upsert on slug, duplicate-query / related-slug guards)
      ▼
  bun run blog:validate  (read-only release check, reported to operator)
```

## 5. Dependency on the Quintel repo

This flow is not self-contained — it requires `apps/backend/scripts/
blog-publish.ts` and `blog-validate.ts` to exist in whatever repo the
operator's session is running in (the Quintel code repo, not this vault).
There is intentionally no CMS-writing fallback if that repo isn't present:
a raw `rip table append` write would bypass the corpus-level validation
(`validatePublishedBlogRows` in `src/blog/blog.types.ts`) that makes the
duplicate-query and dangling-related-slug guarantees hold. If the repo
layout or script names change, this brain (§7 in the flow) needs a matching
edit — it is not derived automatically.
