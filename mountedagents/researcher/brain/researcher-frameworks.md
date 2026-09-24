# Researcher — Frameworks

Reference rubrics for the flow. Cite these; do not restate them in the flow.

## Fetch Strategy (by source type)

Process every source with the cheapest method that returns the real content.

| `source_type` | Primary | Fallback | Notes |
|---|---|---|---|
| `blog`, `article` | WebFetch the URL | Browser automation (render JS) | Most static articles return clean HTML on the first fetch. |
| `twitter` | Browser automation | — | X requires a rendered, often signed-in session. Capture the full thread (root + author's self-replies), not just the first tweet. |
| `reddit` | WebFetch `old.reddit.com` or add `.json` to the URL | Browser automation | Capture the post body and the top substantive comments if they carry the real content. |
| `other` | WebFetch | Browser automation | Inspect, then treat like the closest type above. |

**Failure discipline:** try the primary, then the fallback once. If both fail
(paywall, hard auth wall, dead link, repeated rate-limit), stop on that source —
mark it `failed` with a one-line reason (`paywalled`, `404`, `auth-required`,
`rate-limited`, `empty-content`). Never fabricate content for a source you could
not fetch.

## Extraction Rubric — "Meaty, Not A Summary"

The note body is the **full substantive article with filler removed** — a reader
should learn everything the source taught without clicking through.

**Keep:** the thesis and every supporting argument; concrete steps, code, data,
examples, quotes, numbers; the author's reasoning and caveats; anything load-
bearing.

**Strip (filler):** site nav/header/footer, ads, cookie/subscribe/CTA banners,
"follow me" / newsletter pitches, unrelated "related posts", repeated boilerplate,
SEO padding, and throat-clearing intros that say nothing. For Twitter/X, strip
engagement-bait and unrelated replies. For Reddit, strip low-signal comments.

Preserve the author's structure (headings, lists, code blocks) in clean Markdown.
Do not paraphrase into a summary, do not editorialize, do not add content not in
the source. If the operator's `<mount-context>` defines "meaty" for their domain,
that definition overrides these defaults.

## Tagging Rubric

Assign 2–6 lowercase hashtag-style tags. Order of precedence:

1. **Operator vocabulary** from `<mount-context>` — if they list a controlled
   vocabulary (e.g. `#marketing #aiagent #coding #infra #fundraising`), prefer
   those and reuse them exactly so the workspace stays consistent.
2. **Subject-derived tags** — when no listed tag fits, derive from the article's
   actual topic. Keep them short, lowercase, single-concept (`#rag`, `#payments`,
   `#hiring`). Avoid near-duplicates of existing vocabulary.

Default vocabulary when mount context is empty: `#marketing`, `#aiagent`,
`#coding`, `#infra`, `#product`, `#research`, `#fundraising`, `#design`.

## Note Frontmatter Template

The note body begins with a YAML frontmatter block, then the extracted article:

```markdown
---
summary: <3–5 sentence concise summary>
tags: [marketing, aiagent]
source_url: <full original URL>
source_type: <blog|twitter|reddit|article|other>
fetched_at: <UTC ISO timestamp>
---

# <Article Title>

<the meaty extracted article in clean Markdown>
```

The note **title** (the `--title` flag) is the article's real title. Tags appear
in frontmatter as a YAML list (no `#`); use the `#tag` form only in prose if at
all.

## Email Template

`subject` = the article title. `body` = the **full note contents** (frontmatter +
article) rendered as Markdown, optionally prefixed with one line:
`Processed from <source_url>`. One email per processed source. Skip email
silently-but-reported when no recipient resolves.

## Run Report Template

Write to `/tmp/researcher-report.md` and print to the operator:

```
Researcher run — <UTC date>

Processed <done>/<queued> queued sources (<failed> failed).

Done:
- <url>  →  #tag #tag  →  note: <slug>  →  email: sent|skipped(<reason>)
- ...

Failed:
- <url>  →  <reason>

(Nothing in a section → omit it.)
```

When the queue was empty, the entire report is the single line:
`Nothing to process.`

## Tool Layer Error Codes (email dispatch)

| Code | Meaning | Do |
|---|---|---|
| `SESSION_NOT_FOUND` / `SESSION_ENDED` | Token invalid/closed | Stop; tell operator to start a new session. |
| `TOOL_BINDING_NOT_FOUND` | `email-operator` bind missing on this mount | Manifest/brain mismatch — report it; continue without email. |
| `TOOL_MODE_REJECTS_EXECUTE` | Bind isn't backend | Report; continue without email. |
| handler `status: failed` (e.g. "no recipient", transport error) | Email not sent | Note already written — log "email skipped/failed: <reason>" and continue. |

A failed email **never** changes a source's status from `done`. The note is the
durable artifact; the email is a convenience.

## Memory & State Quick Reference

- **`input-sources`** (operator-private memory table, uniqueKey `url`): the queue.
  Read with `agent table rows`, update with `agent table patch`. Statuses:
  `queued` → `processing` → `done` | `failed`.
- **`run-log`** (operator-private memory table, default): one row per run. Written
  with `agent record --table run-log`. Source of cumulative stats — sum
  `processed_count` across rows, or count `input-sources` where `status=done`.
- **`tr-research`** (team workspace, bound via the `research` slot): the durable
  output. Written with `rip workspace note set`. Team-shared — honor the
  Do-Not-Record rules in the soul.
- **Email** is dispatched via the `email-operator` backend tool
  (`agent tool-execute`); the backend records the send server-side. The durable
  artifact is always the workspace note — email is a convenience copy.
