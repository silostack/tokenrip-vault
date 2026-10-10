---
title: Tokenrip homepage motion assets — pipeline, decisions, and state
status: 3 of 10 ideas built; remainder blocked on API credits
created: 2026-09-07
owner: Simon
related:
  - active/tr-rework/tokenrip-homepage-v3.1-2026-09-05.md
  - active/tr-rework/design/tokenrip-home-A-darkroom.html
  - active/tr-rework/visuals/patchbay_10_glass_inout.png
---

# Motion assets for the darkroom homepage

**Where this stands.** Ten motion ideas were specified and prompted. Three are
built, post-processed and wired into the page. Seven are written as job specs and
will generate unattended the moment either API account has credit — roughly ten
minutes of wall-clock and about $8.

**To see it:** `python3 trserve.py` then open `http://127.0.0.1:8785/review.html`
(all ten ideas, annotated) or `/tokenrip-home-motion.html` (the real page).
Use that server rather than `file://` or `python3 -m http.server` — see
*Local preview* below.

---

## What blocked, and what it costs to unblock

Both video providers ran out of budget mid-run.

| Provider | State | What it unlocks |
|---|---|---|
| **MiniMax** | **Video is not on the Token Plan's meter at all.** Text and image calls on the same key succeed right now; only video returns "Token Plan usage limit reached". This does not reset — video needs Credits. H3 additionally needs pay-as-you-go. | H3's **last-frame control** — the only clean way to make a clip *land* on the hero still — plus 2K output |
| **OpenAI (Sora 2)** | Credit balance exhausted after 4 clips | The remaining 7 clips, ~$8 at sora-2 rates |

Either one unblocks the work. OpenAI is the smaller ask and the pipeline already
targets it: top up, then `python3 soragen.py run` picks up exactly where it left
off — `state.json` tracks every job, so nothing already paid for regenerates.

MiniMax is worth enabling anyway. Its last-frame control removes the reverse-and-
flip workaround described below, and H3 does 2K where sora-2 caps at 720p.

---

## The three findings that shaped every asset

**1 · Video models scramble small text, and the fix is to bake the still back in.**
The first test turned `CLAUDE CODE` into `LAIDE CDE` and `decisions/` into
`declsions/`. But geometry, lighting and materials are reproduced *exactly* —
no drift, no camera creep. So for every locked-off shot the pristine render is
overlaid back over the frame down to the label row (y=442 of 720, feathered over
18px). Labels, file tree and readout stay pixel-perfect; only the cables move.

Baking it into the video with ffmpeg rather than layering in CSS means the page
carries one `<video>`, no mask to keep in register, and no way for the text to
break. It also compresses *better* — the static region costs almost nothing, so
the hero drops from 0.94 MB to 0.53 MB.

Camera-move shots (ideas 6 and 10) can't be baked; a static overlay wouldn't
track. Both are either mostly darkness or a background bed at 32% opacity, so
degraded text doesn't show.

**2 · Sora has no last-frame control, so anything that should arrive at the hero
still is generated backwards and reversed.** The cable is generated *unplugging*;
reversing it plugs it in and guarantees the final frame is the hero still exactly,
so the hand-off from intro to loop is invisible. Same trick for the cold open, the
macro, and the office-assembles-itself shot.

**3 · Motion decays unless the prompt insists otherwise.** "Pulses travel along
the cables" produced pulses that were alive at t=0 and dead by t=8 — Sora read it
as a one-shot event. Prompts now say the flow is continuous, constant, and that
"as one point of light leaves the frame another enters." Worth carrying into any
future prompt.

---

## Techniques worth reusing

**Screen-blend beats chroma key.** For glow elements (ideas 4, 5, 9, 10) the clip
is rendered as light on pure black and composited with `mix-blend-mode: screen`.
Black contributes nothing, the glow adds. No matte, no green fringe, no video
matting model. Only works on a dark page — which this is.

**Draw exact paths in SVG, generate only the atmosphere.** Idea 4's pulses run on
the two-tool scene's real bezier cable paths using `stroke-dashoffset` with
`pathLength="100"`. Free, sharp at any DPI, lands on the pixel the cable actually
occupies. A video model can't hit those coordinates. The generated part is only
the drifting-motes bed behind it.

**Seamless loops by crossfade wrap.** Sora clips don't loop. Given length T and
overlap X, the output is length T−X: the first X seconds crossfade the clip's tail
into its head, then the middle plays out. The last frame is what the first frame
fades up from, so playback wraps invisibly. Ping-pong was rejected — it would run
the directional pulses backwards.

**All-intra for scrub tracks.** The scroll-scrubbed clip is re-encoded at 15fps
with every frame a keyframe. Seeking to a non-keyframe forces a decode from the
previous one and judders. Costs size (5.5 MB for 16.5s) but it's the only way
scrubbing feels attached to the scroll.

**No webm.** VP9 was tried and dropped: Chrome stalls on it at `readyState 0`
*without firing an error*, which also blocks the `<source>` fallback to the mp4,
so the whole element hangs silently. H.264 is ~2.5x larger but 0.53 MB for the
hero, hardware-decoded everywhere, and cannot fail that way.

---

## Generating fresh vs. deriving from the render (idea 4)

Tested 2026-09-07 on idea 4, with MiniMax image-01 (video still blocked; image is
covered by the plan). Fourteen candidates in `frames/`, contact sheets in `qa/`.

**It works, and for this section it beats deriving.** `frames/4e-1.jpg` is the
pick: two monitors angled inward, the hardware unit centred between them, a black
braided cable running in from the left and a copper one out to the right. That is
the section's whole argument as a photograph rather than the current CSS boxes.

**The screens come out blank, and that is the point.** No text for the model to
garble, and the real terminal and Cowork chat can be composited onto the glowing
panels with CSS — photographic set, real UI on top. It is the same
bake-the-truth-back-in principle as the hero, arrived at from the other direction.

**What went wrong, worth avoiding:** the first pass (`4c-2`) invented a rainbow RGB
strip on the unit — image-01 reaches for a gamer aesthetic on any dark desk scene
unless told not to. The abstract light-trail plates (`4f`) came out beautiful but
generic — drifting teal, the standard "AI data-flow" stock look, exactly what the
technique is supposed to avoid. The sparser `4b` reads better and stays on palette.
Pin the palette in words in every prompt; image-01 drifts warm and blue otherwise.

`jobs-mm/04-scene-fresh.json` will animate `4e-1` the moment credits land.

## Files

```
video/
  soragen.py          Sora 2 runner — submit, poll, download; resumes from state.json
  mmgen.py            MiniMax video runner (v1 Hailuo); reads jobs-mm/, state-mm.json
  mmimg.py            MiniMax image-01 stills — works today, video does not
  post.py             reverse / loop-wrap / bake composite / encode / poster
  build-motion.py     injects the motion layer into a copy of the darkroom page
  build-review.py     builds review.html, all ten ideas annotated
  trserve.py          local preview server with Range support (see below)
  motion/motion.css   the component layer
  motion/motion.js    lazy-load, pause offscreen, scroll-scrub, reduced-motion
  jobs/*.json         15 Sora job specs — the 11 unbuilt ones are ready to run
  jobs-mm/*.json      MiniMax job specs (separate dir: the two runners take
                      different schemas and both would glob jobs/*.json)
  frames/             freshly generated stills + the exact prompt for each
  src/                16:9 reference crops fed to the model
  clips/              raw model output
  out/                web-ready assets + the matched 16:9 still
  qa/                 verification frames, pulse-proof strip, preview gif
  state.json          per-job task ids, status, cost
```

`design/tokenrip-home-A-darkroom.html` is never modified; the build reads it and
writes `video/tokenrip-home-motion.html`.

---

## Built, and what each weighs

| # | Idea | Asset | Size |
|---|---|---|---|
| 1 | Living patch bay, seamless loop | `out/01-hero-loop-composite.mp4` | 0.53 MB |
| 2 | Cable plugs itself in, plays once | `out/02-plug-reverse-composite.mp4` | 0.38 MB |
| 3 | Scroll-scrubbed IN → OUT | `out/03-scrub.mp4` | 5.52 MB |
| 4 | SVG pulses on the real cable paths | in `motion.css` | 0 |

Nothing downloads until it scrolls near the viewport; everything pauses when it
leaves; `prefers-reduced-motion` short-circuits the whole layer and the page falls
back to the still.

---

## Queued (job specs written, need credits)

5 texture bands ×3 · 6 cold open · 7 macro plug · 8 office assembling itself ·
9 module micro-loops ×3 · 10 final-CTA ambient bed. Plus the atmosphere bed that
completes idea 4. Eleven clips, 88s, ~$8.80 at sora-2 720p.

---

## Two things still to decide

**Darkroom vs. daylight.** Every asset is built for `A-darkroom`. The daylight
variant would need its own generations — roughly doubling cost — and the
screen-blend technique does not work on a light background; those elements would
need `multiply` and a re-render.

**The hero crop changed.** The video is 16:9 (1280×720); the original render is
3:2. The still on the page was re-cropped to match (`out/patchbay-hero-16x9.jpg`,
1536×864 — 120px off the top, 40px off the bottom). It's arguably a better hero
composition, but it is a change to the approved visual.

---

## Local preview

`python3 -m http.server` is not usable for this. Two reasons, both silent:

1. It is single-threaded, so the browser's keep-alive connection deadlocks it.
2. `SimpleHTTPRequestHandler` does not implement HTTP Range — it answers `200`
   with the whole body where Chrome's `<video>` expects `206`, and the element
   stalls forever at `readyState 0` with no error.

`trserve.py` is threaded, does Range properly, and sends `no-store` with no
validators so a stale `304` can't mask a rebuilt asset.

**Caveat on verification.** Playback was *not* confirmed in a browser. The Chrome
automation profile available here refuses to fetch media at all — it sets
`currentSrc`, issues no network request, and freezes the renderer on `play()`.
Layout, lazy-load logic and asset conformance were all verified (H.264 High L3.1,
faststart, `yuv420p` limited range, clean end-to-end decode, frame-by-frame proof
of the pulse motion in `qa/pulse_proof.jpg`). Actual playback needs one look in a
normal Chrome.
