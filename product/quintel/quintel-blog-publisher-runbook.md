# Quintel Blog Publisher — Operator Runbook

**For:** Alek (and the Claude Code session assisting him)
**Agent slug:** `quintel-blog` · **Owner team:** `@tokenrip`
**Last verified:** 2026-08-11, against flow brain v4 (SEO/GEO update)

---

> **Production gap, read before you rely on the new fields:** as of
> 2026-08-11, `quintel.ai`'s live API is running older backend code that does
> **not** yet expose `answer_summary`, `image_alt`, or `modified_date` on
> `/v0/blog/:slug` — confirmed by direct request against both a disposable
> test post and a long-published one. The CMS row stores them correctly and
> `blog:validate` enforces them, but they will not render on the live site
> until the Quintel backend is redeployed. This is a deploy gap, not an
> agent bug — flag it to Simon before treating the answer-summary surface as
> live.

## What this agent does

You give it a **finished blog post in markdown plus an SEO/GEO editorial
contract** (see [Required fields](#required-fields-for-a-published-post)
below). It:

1. Gathers and mechanically checks the editorial fields (query uniqueness,
   related-post validity), runs a metadata QC pass, and gets your approval.
2. Asks an LLM to write a hero-image concept — a staged, wordless scene.
3. Generates a 16:9 hero image in the Quintel house style (isometric technical
   schematic, deep forest green line-work on warm cream).
4. Crops it to 1200×630, uploads it to the CDN as a public asset, records the
   seed + prompt so the image is reproducible, and derives `image_alt` from
   the actual final image.
5. Writes the post through the **Quintel repo's guarded publisher**
   (`bun run blog:publish` + `bun run blog:validate` in `apps/backend`) —
   never a raw table write. This is what
   [quintel.ai/blog](https://quintel.ai/blog) reads from.

**Posts land as drafts.** `published: false` on first write. Going live is a
deliberate second step. That is a safety feature — do not work around it.

## What it does *not* do

- **It does not write the post.** It publishes what you wrote. If you hand it a
  one-line stub, you get a published one-line stub.
- **It does not edit or improve your copy.** No rewriting, no tightening, and
  it never manufactures an FAQ/Q&A block — if your markdown has natural
  question headings, they're left exactly as written.
- **It does not invent your answer_summary.** Either you supply it, or it
  proposes a faithful extract from your post and requires your explicit
  approval — same for the query, cluster, and related posts: your call, not
  an inferred one.
- **It does not pick the topic.** That is upstream of this tool.

## New dependency: the Quintel backend repo

Since the SEO/GEO update, this flow **requires** a local checkout of the
Quintel repo with `apps/backend/scripts/blog-publish.ts` and
`blog-validate.ts` present — there is no fallback CMS-write path. If you
don't have the repo checked out, tell Claude where it lives before starting;
the agent will stop at preflight if it can't find it.

---

## One-time setup

### Step 1 — Install the bootloader command

From the repo or folder where you run Claude Code:

```bash
mkdir -p .claude/commands
curl -fsSL https://api.tokenrip.com/commands/tokenrip-bootloader.md \
  -o .claude/commands/tokenrip-bootloader.md
```

### Step 2 — Install the CLI

```bash
command -v rip >/dev/null 2>&1 || npm install -g @tokenrip/cli
```

### Step 3 — Confirm your identity (READ THIS ONE)

```bash
rip auth whoami
```

You must see **`alek-claude`** or **`alek`**. Both are already members of
`@tokenrip`.

> **The trap:** if `rip auth whoami` fails, the bootloader will silently run
> `rip auth register`, which mints a **brand-new identity that is not in the
> team**. Everything then fails with permission errors that look like the agent
> is broken. It isn't — you're just logged in as a stranger.
>
> If that happens, **stop** and send Simon the identity string that
> `rip auth whoami` prints. He adds it with:
> ```bash
> rip team add tokenrip <your-rip1...-identity>
> ```
> Do not try to fix it by registering again — that just makes another stranger.

### Step 4 — Confirm team access

```bash
rip team list
```

`@tokenrip` must appear. If it doesn't, see the trap above.

---

## Running it

In Claude Code:

```
/tokenrip-bootloader quintel-blog
```

Then paste your post, or give the path to a markdown file.

### Instructions for Claude (important)

**Load against the team mount:**

```bash
rip --json agent load quintel-blog --team tokenrip
```

The `--team tokenrip` flag is not optional. The image-generation and concept
LLM connections are bound to the **team** mount. Loading without the flag
lazy-creates a *personal* mount with no connections bound, and the run dies at
preflight with `CONNECTION_NOT_GRANTED` or an unbound-slot error.

*(Confidence note: this failure mode is inferred from the mount/connection
model, not reproduced on Alek's machine. If a bare load happens to work, fine —
but lead with `--team tokenrip`.)*

If a slot does come back unbound, that is Simon's to fix (team owner only):

```bash
rip agent mount-connection <mount-id> <slot>=<connection-name>
```

**Then follow the loaded brain exactly.** It is the source of truth and is
fetched fresh on every load — it may have changed since this runbook was
written. Where this document and the brain disagree, **the brain wins**.

---

## Required fields for a published post

Drafts can be incomplete, but nothing reaches `published: true` without all
of these:

| Field | What it is |
|---|---|
| `slug`, `title` | Standard — kebab-case slug, first `#` heading for title |
| `description`, `excerpt` | One factual SEO sentence / one-two listing-card sentences |
| `answer_summary` | A 40–70-word **direct answer** to the post's central question — yours, or a faithful extract the agent proposes and you approve |
| `image_alt` | Derived from the actual generated hero after you approve it — never asked up front |
| `primary_query` | The real search query this post targets — must be unique among **published** posts |
| `content_cluster` | A kebab-case grouping label for this post |
| `related_slugs` | One or more **existing, published** slugs, not including this post itself |
| `modified_date` | Optional — only set when an already-published post's facts or conclusions change |
| `author`, `tags`, `publish_date` | Standard |

## What you'll be asked to approve

The agent stops and waits for you at least three times. This is by design.

| Checkpoint | What you're approving | What to look for |
|---|---|---|
| **Editorial metadata block** | slug, title, description, excerpt, answer summary, primary query, cluster, related posts, author/tags/date, draft status | Is the answer summary actually the direct answer to the post's question? Is the query one a real searcher would type? Are the related posts actually related, not just technically valid? |
| **Hero concept** | One sentence describing the image scene | Is it a concrete physical scene? Vague concepts produce mush. |
| **The generated image** | The actual hero | See the checklist below. |
| **Final `image_alt`** | Shown alongside the approved concept, right before the CMS write | Does it describe what's actually in the image, not a generic restatement of the topic? |

Before showing you the editorial metadata block, the agent runs an automated
metadata QC pass (clean context, fixed checklist, PASS/REVISE) on the fields
it derived — it never touches your markdown body, only the fields it's
proposing. You're still the one who approves the query, cluster, answer
summary, and related posts; the QC pass exists to catch the agent's own
faithfulness slips before you see the block, not to replace your judgment.

You can reject at any checkpoint and ask for a re-roll.

### Judging the hero image

Reject and re-roll if you see:

- **Text, letters, or numbers anywhere.** The image model cannot render text.
  Any lettering is garbled and looks broken.
- **Dimension lines, measurement callouts, or annotation bubbles.** These were
  a recurring defect. They should be gone in v3 — if they reappear, say so,
  because it means the fix regressed.
- **Black bars down the sides.** Fixed in v3. If you see them, the resize step
  regressed — flag it to Simon, don't publish it.
- **A small object floating in empty space.** The subject should fill roughly
  80% of the frame or the listing card looks empty.

The house style is deliberate: bold deep-forest-green line-work on warm cream,
isometric technical-schematic / blueprint aesthetic. If a hero comes back in
some other style, that's wrong.

---

## Going live

The post is a draft until you explicitly publish — this is a **distinct**
confirmation from the draft one, not implied by it. To publish, tell Claude
to re-run `blog:publish` with `published: true`, then it runs
`bun run blog:validate` and reports the result. Don't treat "drafted
successfully" as "ready to flip" — actually decide to go live.

**Then actually look at the live site.** Load
[quintel.ai/blog](https://quintel.ai/blog) and confirm the post appears and the
hero renders on the card.

This step is not optional and not paranoia: during testing, *both* real defects
(black bars, dimension-line artifacts) were invisible in the data layer and
only showed up on the rendered page.

> One gotcha when checking: a full-page screenshot downsamples the ~200px
> listing card so hard that fine line-work can look like a blank box. Zoom into
> the card before concluding the image is broken. That exact mistake was made
> during testing and cost a wrong diagnosis.

---

## Other modes

Just tell the agent what you want in plain language — it picks the mode.

**Update a post** — same slug, new values. The agent fetches the current row
first, applies your changes on top of it (every field you don't change is
preserved, including the editorial fields), and re-publishes through
`blog:publish`. The hero is kept unless you ask for a new one. `modified_date`
only gets set if you're changing facts or conclusions in an already-published
post — not for a typo fix.

**Unpublish** — an update with `published: false`. The post drops off the site
but the row survives. This is the reversible option, and usually the right one.

**Delete** — removes the row entirely. The agent will echo the post's title and
slug and require an explicit confirmation first.

> **Before either one, the agent checks for dangling internal links.** If any
> other **published** post's `related_slugs` points at the one you're
> unpublishing or deleting, the agent stops and shows you those posts before
> touching anything — you'll need to give it replacement related links, or
> tell it to update those posts first. This isn't just an agent courtesy:
> `blog:publish` itself refuses the write server-side if it would leave a
> published post pointing at an unpublished slug, so a raw workaround
> wouldn't succeed anyway.

> **Deletion is irreversible.** The table has no version history. There is no
> undo. If you're unsure, unpublish instead — you can always delete later, but
> you cannot un-delete.
>
> Note the blog table also holds the **real production posts**. Read the title
> and slug the agent echoes back before confirming. Make sure it's the row you
> meant.

If the post had a Tokenrip-hosted hero, the agent will offer to delete that
artifact too — this is its own separate confirmation from the row deletion.
Say yes unless you want to reuse the image.

## Editing the table dashboard directly

Don't. It bypasses every check `blog:publish` runs (duplicate query,
dangling related links, malformed dates, unknown fields). If you did anyway,
run `bun run blog:validate` in `apps/backend` immediately afterward and fix
whatever it flags.

---

## Troubleshooting

| Symptom | What it means | Fix |
|---|---|---|
| `CONNECTION_NOT_GRANTED` / `UNKNOWN_CONNECTION` | Loaded a personal mount instead of the team one | Re-load with `--team tokenrip` |
| Permission / access denied on load | You're authenticated as a non-member identity | `rip auth whoami`, send the identity to Simon (see Step 3 trap) |
| Table 403 / 404 | Not a team member, or table sharing changed | Confirm `rip team list` shows `@tokenrip` |
| `RESPONSE_TOO_LARGE` | Image requested as inline bytes | The brain should use `"response_format":"url"` — flag the regression |
| Image URL 404 when fetching | The generated image URL expired | Regenerate; the URL must be fetched immediately |
| `MISSING_FIELD` on append | Row payload malformed | This shouldn't happen anymore — the agent writes through `blog:publish`, not a raw append. If you see it, something is bypassing the guarded path; flag to Simon |
| Post published but not on the site | Almost always `published: false` | Confirm the flag actually flipped, then hard-reload the page |
| Hero looks like an empty box in a screenshot | Probably a screenshot-scaling artifact | Zoom into the card before concluding it's broken |
| `blog:publish` fails: "unknown frontmatter field(s)" | A field outside the allow-list snuck into the frontmatter | Remove it — don't ask the agent to route around the check |
| `blog:publish` fails: `primary_query` duplicate | Another published post already owns that exact query (case/whitespace-insensitive) | Pick a different query, or decide with Simon/Alek which post should keep it |
| `blog:publish` fails: `related_slugs` invalid | An entry doesn't exist, isn't published, duplicates another entry, or self-references | Fix the list — every related post must be real and live |
| `blog:publish` fails: `answer_summary` length | Outside 40–70 words | Trim or expand, then re-approve the metadata block |
| `apps/backend/scripts/blog-publish.ts` not found | Repo not checked out where the agent is looking | Tell it the repo's path, or check it out first |
| Fields set in the CMS row but missing from `quintel.ai/blog` | Backend deploy lag — see the production-gap note at the top of this doc | Confirm with Simon whether backend has been redeployed since 2026-08-11 |

If a `rip` command or a `blog:publish`/`blog:validate` run fails, **report
the error verbatim** to Simon. Don't improvise around a failed write.

---

## Reference

| Thing | Value |
|---|---|
| Agent slug | `quintel-blog` |
| Owner team | `@tokenrip` (`1aa344d6-8f83-41b2-a4db-ac3d6e26d167`) |
| Team mount | `532e679f-2a4d-4c6c-850e-2bfb2866f5d1` |
| Blog table | `b7114107-8373-4f77-b3c7-3df8bedd8427` |
| Flow brain | `quintel-blog-flow` (`9bdf513e-31fd-4fe3-8295-dd476c12869a`), v4 |
| Local brain source | `mountedagents/quintel-blog/` in this vault (see its `operator-reference-sheet.md` for how to push a further change) |
| Repository publisher | `apps/backend` in the Quintel repo — `bun run blog:publish` / `bun run blog:validate` |
| Hero dimensions | 1200×630 |
| Live blog | https://quintel.ai/blog |

**Escalate to Simon for:** binding connection slots, adding identities to the
team, changing the flow brain (there's now a local source to edit — see
`mountedagents/quintel-blog/operator-reference-sheet.md` — but pushing it
still needs a team-owner `rip` session), backend deploy status, or any error
you'd have to guess your way past.
