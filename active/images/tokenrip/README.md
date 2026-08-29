# Tokenrip Blog/Content Image Theme — Winners & Breakdown

**Status:** exploration complete, top 5 selected. Not yet locked into `content/images/STYLE.md`.
**Date:** 2026-07-09
**Source rounds:** `content/images/`, `images-2/`, `images-3/`, `images-4/` (existing exploration) + `images-5/` (new theme round).

---

## The one thing that decided everything

**The MiniMax `image-01` model renders gibberish text.** Every text-dependent style
(ransom-note zines, contract marginalia, wanted posters, badges with banners) is structurally
broken — the words come out as garbage. This eliminated a whole class of otherwise-interesting
styles and pointed us at one rule:

> **The image must carry its meaning without words. Headlines get added in post, with a locked typeface.**

Every winner below is either wordless or hides its "text" behind a device (redaction bars, blank
label boxes) so the gibberish never shows.

## Style vs. theme (why these are *ours*)

A **style** is a raw aesthetic preset anyone can copy (a Midjourney lookbook). A **theme** is a
style plus a **recurring cast** — the same characters and props showing up post after post, so every
image reads as a scene from one world. The recurring cast is what makes it ownable.

**The Tokenrip cast:**
- **agent-creature** — a small mechanical figure; the mounted agent.
- **shared notebook** — one big open notebook passed between agents; shared state / the substrate.
- **vendor-cage / chains** — an agent chained to a corporate building; lock-in.

Reuse these three motifs and the whole blog becomes recognizable at a glance.

---

## The lane system that fell out of the ranking

Four styles cover the whole range from "safe workhorse" to "edgy showpiece." They aren't
competitors — they're **lanes**, each for a different job:

| Lane | Style | Job | Why |
|------|-------|-----|-----|
| **Primary** | Woodcut propaganda | Blog heroes, the default | Bold, high-contrast, legible at thumbnail, tonally flexible, most versatile |
| **Edgy specialty** | Samizdat | Lock-in / rebellion / "the system" pieces | Underground-press credibility; redaction bars *hide* the gibberish text; most on-thesis |
| **Social** | Doodle | X/social cards, approachable posts | Shareable, human, low-stakes; extends existing doodle equity |
| **Showpiece** | Agent-bestiary | Rare flagship / "here's the whole model" posts | Most unique + most ownable cast, but label gibberish limits it to specialty use |

Palette anchor for the primary/samizdat lanes: **black + warm red on aged cream.**

---

## Top 5, ranked

Judged on: looks good · fits what we're doing · works for real blog content pieces.

### 1 — `1-samizdat-lockin.png`  ★ best overall (and Simon's pick)
Two mech-agents bent over a manuscript, chains, black censor redaction bars. **Edgy + credible +
on-thesis** all at once, and the redaction bars are a feature — they hide exactly the text the model
can't render. This is the image that makes someone stop scrolling. Best for the lock-in / "escape
the vendor" family of posts. *(from `images-5/05`)*

### 2 — `2-woodcut-lockin.png`  ★ best workhorse
Two mech-agents at a table passing the shared notebook, vendor towers behind, black+red+cream lino.
Less shocking than samizdat but **more versatile** — this style will carry the widest range of
topics without feeling forced. The default hero style. *(from `images-5/01`)*

### 3 — `3-woodcut-soviet-linocut.png`  ★ proof the primary lane has range
An earlier soviet-linocut piece. Included because it shows the woodcut lane isn't a one-trick
concept — the aesthetic holds up across different compositions, which is what "versatile" has to
mean in practice. *(from `images-2/04`)*

### 4 — `4-bestiary-two-agents.png`  ★ most unique / long game
Two agent-creature "specimens" sharing one notebook-organ, anatomical-plate layout. The **most
ownable** image of the set — nobody else's blog looks like this. Downside: the specimen labels come
out as gibberish, so it's a showpiece, not a workhorse. Use sparingly for flagship posts. *(from `images-5/08`)*

### 5 — `5-doodle-lockin.png`  ★ the social/approachable lane
Clean naive doodle of the lock-in scene. Warmer and lower-stakes than the woodcut lanes; the right
call for X cards and lighter posts where the propaganda edge would be too much. *(from `images-5/03`)*

**Honorable mentions (specialty one-offs):** playing-card, vintage-ad, prison-tattoo, and the
existing two-agents doodle hero.

---

## Reproducibility

Every image has a sidecar `.prompt.txt` recording slug / style / seed / trace_id / concept /
full_prompt. Regenerate or vary any image with:

```
MINIMAX_API_KEY=… python3 scripts/generate-blog-image.py \
  --slug <slug> --concept "<visual metaphor>" --style woodcut-propaganda --seed <n> \
  --out <path>.png
```

Styles live in `scripts/generate-blog-image.py` → `STYLE_TEMPLATES`
(`woodcut-propaganda`, `samizdat`, `doodle-photo`, `agent-bestiary`).

**Promptable rule learned:** these styles need a **clear staged scene with the cast** (winners 1, 2,
5). Abstract "action" concepts ("a workflow dissolving…") come back as pretty-but-illegible mood
pieces. Stage the scene; don't describe an abstraction.

## Open decisions before this locks

1. **Headline typeface + exact hex** for the red/cream palette (needed for the in-post text layer).
2. **Lock the lanes into `content/images/STYLE.md`** (currently still the old "kids crayon" framing).
3. **Regenerate the 3 real blog heroes** (`workflows-eat-apps`, `building-a-mounted-agent`,
   `two-agents-better-than-one`) in `woodcut-propaganda` to validate the primary lane end-to-end.

> Strategic note: this is **P1 "build our own audience"** work, not the ONE thing (the sale). Worth a
> focused session to lock; not worth a week of regeneration.
