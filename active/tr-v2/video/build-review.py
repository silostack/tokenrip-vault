#!/usr/bin/env python3
"""Build review.html -- all ten motion ideas on one page, in the darkroom palette.

Each idea shows its clip if it exists and a clearly-marked placeholder if it does
not, so the page stays honest about what has actually been produced.
"""
from __future__ import annotations

import base64
import html as H
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "out"

STILL = "data:image/jpeg;base64," + base64.b64encode(
    (OUT / "patchbay-hero-16x9.jpg").read_bytes()).decode()

# (n, title, clip stem or None, where it goes, technique, status note)
IDEAS = [
    (1, "Living patch bay",
     "01-hero-loop-composite", "Hero, full width under the H1",
     "Image-to-video from the existing render, then the pristine still baked back "
     "over the top half so every label stays sharp. Wrapped into a seamless loop.",
     "built"),
    (2, "The cable plugs itself in",
     "02-plug-reverse-composite", "Hero, plays once on first view then hands to idea 1",
     "Sora has no last-frame control, so this was generated running backwards — the "
     "cable pulling out — and reversed. That guarantees the last frame is the hero "
     "still exactly, so the hand-off to the loop is invisible.",
     "built"),
    (3, "Scroll-scrubbed IN → OUT",
     "03-scrub", "Its own block after the problem section",
     "Two clips joined: dead→alive, then the output side surging. Re-encoded "
     "all-intra at 15fps so seeking on every scroll tick doesn't judder. Drag the "
     "slider under it to feel the scroll behaviour.",
     "built-scrub"),
    (4, "Signal pulses on the two-tool scene",
     None, "\"One agent did the work\" section",
     "Generated fresh rather than derived from the patch-bay render — the candidates "
     "below are MiniMax image-01, no source image. 4e-1 is the pick: two screens "
     "angled inward, the unit between them, black cable in and copper cable out. Note "
     "the screens come out blank, which is the ideal result: nothing for the model to "
     "garble, and the real terminal and Cowork chat composite straight onto them. The "
     "pulses themselves stay SVG on the page's real bezier paths.",
     "svg-done"),
    (5, "Section-break texture bands",
     None, "Three section rules, replacing the 6px rust line",
     "Near-black loops (smoked glass, oscilloscope trace, dust in a light shaft) "
     "screen-blended at 50%. Light on black composites onto a dark page with no "
     "matte and no chroma-key fringe.",
     "pending"),
    (6, "Cold open",
     None, "Top of page, also the OG video and a 9:16 social cut",
     "Generated as a slow push-in while the lights die, then reversed: the room "
     "comes up out of black as the camera pulls back, landing on the hero still.",
     "pending"),
    (7, "Macro: one jack, one plug, one pulse",
     None, "\"Who plugs in\", or Get-started step 1",
     "Extreme close-up, no text anywhere in frame, so nothing can degrade. "
     "Generated in reverse (unplugging) and flipped.",
     "pending"),
    (8, "Brain vs. office, as two states",
     None, "\"A company brain remembers\" section",
     "Every cable withdraws in sequence until the unit sits bare — generated that "
     "way, played backwards so the office assembles itself as you scroll.",
     "pending"),
    (9, "Module micro-loops",
     None, "The three module rows",
     "Three small screen-blend loops on black: a waveform collapsing into stacked "
     "lines, an amber trend line drawing itself, a blank sheet feeding out and lifting.",
     "pending"),
    (10, "Final-CTA ambient bed",
     None, "Behind the closing headline",
     "The same unit, colder and wider, with an almost imperceptible push-in. Sits at "
     "32% opacity behind the last block of copy.",
     "pending"),
]

BADGE = {"built": ("live", "on"), "built-scrub": ("live · scrub", "on"),
         "svg-done": ("svg live · bed pending", "half"), "pending": ("needs credits", "off")}


def block(n, title, stem, where, tech, status):
    label, dot = BADGE[status]
    if stem and (OUT / f"{stem}.mp4").exists():
        if status == "built-scrub":
            media = (f'<div class="frame"><video id="scrub{n}" muted playsinline '
                     f'preload="auto" poster="out/03-scrub-poster.jpg" '
                     f'src="out/{stem}.mp4"></video></div>'
                     f'<input class="scrubber" type="range" min="0" max="1000" value="540" '
                     f'data-for="scrub{n}">'
                     f'<p class="hint">drag &mdash; this is what the scroll drives</p>')
        else:
            media = (f'<div class="frame"><video muted loop autoplay playsinline '
                     f'preload="metadata" poster="{STILL}" src="out/{stem}.mp4"></video></div>')
        size = (OUT / f"{stem}.mp4").stat().st_size / 1e6
        meta = f"out/{stem}.mp4 · {size:.2f} MB"
    elif n == 4:
        shots = ["4e-1", "4e-4", "4c-2", "4b-1"]
        caps = ["4e-1 — the pick", "4e-4 — cleaner, wider",
                "4c-2 — first pass, gamer RGB", "4b-1 — trails, too generic"]
        cells = "".join(
            f'<figure><img src="frames/{s}.jpg" alt=""><figcaption>{c}</figcaption></figure>'
            for s, c in zip(shots, caps) if (ROOT / "frames" / f"{s}.jpg").exists())
        media = (f'<div class="cands">{cells}</div>'
                 '<p class="hint">stills only — animating these needs minimax credits</p>')
        meta = "frames/*.jpg · MiniMax image-01 · animation job queued at jobs-mm/04-scene-fresh.json"
    else:
        media = ('<div class="frame empty"><span>not generated yet</span></div>')
        meta = "awaiting API credits"
    return f"""
<article class="idea">
  <div class="num">{n:02d}</div>
  <div class="content">
    <h2>{H.escape(title)} <i class="dot {dot}"></i><em>{label}</em></h2>
    <p class="where">{H.escape(where)}</p>
    {media}
    <p class="tech">{H.escape(tech)}</p>
    <p class="meta">{H.escape(meta)}</p>
  </div>
</article>"""


page = f"""<meta charset="utf-8">
<title>Tokenrip motion — ten ideas</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Familjen+Grotesk:wght@400;500&family=Martian+Mono:wght@400;600&display=swap">
<style>
:root{{--bg:#120D0A;--ink:#EFE3D2;--mute:#A8937E;--rust:#8A4A2A;--rust2:#B8623A;
--amber:#E0A030;--green:#8BD39B;--line:#2E211A;
--d:'Big Shoulders Display',Impact,sans-serif;--b:'Familjen Grotesk',Arial,sans-serif;
--m:'Martian Mono',Menlo,monospace}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--bg);color:var(--ink);font:400 17px/1.55 var(--b)}}
.page{{max-width:1120px;margin:0 auto;padding:0 28px 100px}}
header{{padding:56px 0 20px;border-bottom:6px solid var(--rust)}}
h1{{margin:0;font:900 clamp(48px,7vw,92px)/.9 var(--d);text-transform:uppercase;letter-spacing:-.01em}}
.lede{{margin:20px 0 0;font-size:24px;line-height:1.3;max-width:60ch;color:var(--ink)}}
.note{{margin:14px 0 0;color:var(--mute);font-size:15px;max-width:70ch}}
.idea{{display:grid;grid-template-columns:110px 1fr;gap:28px;padding:52px 0;border-bottom:1px solid var(--line)}}
.num{{font:900 64px/1 var(--d);color:var(--rust2)}}
h2{{margin:0 0 4px;font:900 34px/1 var(--d);text-transform:uppercase;display:flex;align-items:center;gap:12px;flex-wrap:wrap}}
h2 em{{font:600 11px var(--m);text-transform:uppercase;letter-spacing:.14em;color:var(--mute);font-style:normal}}
.dot{{width:10px;height:10px;border-radius:50%;background:#4a3a30;display:inline-block}}
.dot.on{{background:var(--green);box-shadow:0 0 10px var(--green)}}
.dot.half{{background:var(--amber);box-shadow:0 0 10px var(--amber)}}
.where{{margin:0 0 18px;color:var(--rust2);font:600 12px var(--m);text-transform:uppercase;letter-spacing:.12em}}
.frame{{position:relative;width:100%;aspect-ratio:16/9;background:#0b0908;overflow:hidden;border:1px solid var(--line)}}
.frame video{{width:100%;height:100%;object-fit:cover;display:block}}
.frame.empty{{display:flex;align-items:center;justify-content:center;
background:repeating-linear-gradient(135deg,#151010,#151010 12px,#181212 12px,#181212 24px)}}
.frame.empty span{{font:600 12px var(--m);text-transform:uppercase;letter-spacing:.18em;color:#6E5A48}}
.scrubber{{width:100%;margin:14px 0 0;accent-color:var(--amber)}}
.cands{{display:grid;grid-template-columns:1fr 1fr;gap:14px}}
.cands figure{{margin:0}}
.cands img{{width:100%;display:block;border:1px solid var(--line)}}
.cands figcaption{{margin-top:6px;font:600 11px var(--m);text-transform:uppercase;letter-spacing:.12em;color:var(--mute)}}
.hint{{margin:10px 0 0;font:600 11px var(--m);text-transform:uppercase;letter-spacing:.14em;color:var(--rust2)}}
.tech{{margin:16px 0 0;color:var(--mute);font-size:15.5px;max-width:72ch}}
.meta{{margin:8px 0 0;font:400 12px var(--m);color:#6E5A48}}
footer{{padding:48px 0 0;color:var(--mute);font-size:15px}}
footer b{{color:var(--ink);font-weight:500}}
code{{font:600 .85em var(--m);color:var(--amber)}}
@media(max-width:760px){{.idea{{grid-template-columns:1fr;gap:10px}}.num{{font-size:40px}}}}
</style>
<div class="page">
<header>
  <h1>Ten ways to make it move</h1>
  <p class="lede">Motion assets for the darkroom homepage. Three are built and playing below; the rest are prompted, priced and queued behind API credits.</p>
  <p class="note">Everything is generated from the patch-bay render you already have, so the whole set stays in one visual world. Each clip degrades to the existing still — reduced-motion, slow connections and phones all get the static design.</p>
</header>
{''.join(block(*i) for i in IDEAS)}
<footer>
  <p><b>How the text stays sharp.</b> Video models scramble small type — the first test turned <code>CLAUDE CODE</code> into <code>LAIDE CDE</code>. Every locked-off clip therefore has the original render baked back over its top half, so labels, file tree and readout are pixel-exact and only the cables move. It also compresses better: the hero is 0.53 MB.</p>
  <p><b>Weight.</b> Hero loop 0.53 MB, intro 0.38 MB. Nothing downloads until it scrolls near the viewport, and everything pauses when it leaves.</p>
</footer>
</div>
<script>
document.querySelectorAll('.scrubber').forEach(function(s){{
  var v=document.getElementById(s.dataset.for);
  v.addEventListener('loadedmetadata',function(){{ v.currentTime=v.duration*0.54; }});
  s.addEventListener('input',function(){{
    if(v.duration) v.currentTime = v.duration * (s.value/1000);
  }});
}});
</script>
"""

(ROOT / "review.html").write_text(page)
print(f"wrote review.html ({(ROOT/'review.html').stat().st_size/1000:.0f} KB)")
