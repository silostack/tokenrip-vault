#!/usr/bin/env python3
"""
Inject the motion layer into the darkroom homepage.

Reads   design/tokenrip-home-A-darkroom.html   (untouched)
Writes  video/tokenrip-home-motion.html        (self-contained; assets in out/)

Every insertion is additive and degrades to the static design: a clip that has
not been generated yet simply never appears, and the still stays.
"""
from __future__ import annotations

import base64
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT.parent / "design" / "tokenrip-home-A-darkroom.html"
DEST = ROOT / "tokenrip-home-motion.html"
OUT = ROOT / "out"

html = SRC.read_text()
css = (ROOT / "motion" / "motion.css").read_text()
js = (ROOT / "motion" / "motion.js").read_text()


def have(stem: str) -> bool:
    return (OUT / f"{stem}.mp4").exists()


def sources(stem: str) -> str:
    """mp4 only -- see the note in post.py on why webm was dropped."""
    return f'<source data-src="out/{stem}.mp4" type="video/mp4">' 


def b64(p: Path, mime: str = "image/jpeg") -> str:
    return f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode()


# --- 1 · hero: swap the static figure for the composite patch bay -------------
hero_still = b64(OUT / "patchbay-hero-16x9.jpg")
# prefer the baked composite (crisp text burnt in); fall back to the raw clip
HERO = "01-hero-loop-composite" if have("01-hero-loop-composite") else "01-hero-loop"
INTRO = "02-plug-reverse-composite" if have("02-plug-reverse-composite") else "02-plug-reverse"

intro = ""
if have(INTRO):
    intro = (f'<video class="tr-pb__intro" muted playsinline preload="none">'
             f'{sources(INTRO)}</video>')
loop = ""
if have(HERO):
    loop = (f'<video class="tr-pb__vid" muted loop playsinline preload="none" '
            f'poster="{hero_still}">{sources(HERO)}</video>')

pb = (f'<figure class="visual">\n  <div class="tr-pb">'
      f'<img class="tr-pb__still" src="{hero_still}" alt="Agents plug in on the left, '
      f'work comes out on the right.">{loop}{intro}</div>\n'
      f'  <figcaption>Agents plug in. Work comes out. Everyone can see both.</figcaption>\n'
      f'</figure>')
html = re.sub(r'<figure class="visual">.*?</figure>', lambda _: pb, html, count=1, flags=re.S)

# --- 2 · scroll-scrubbed sequence, straight after the problem section ---------
if have("03-scrub"):
    scrub = f'''
<section class="sec scrub-sec">
  <div class="label"><span>Watch it</span></div>
  <div class="body wide">
    <h2>Nothing lands anywhere. Then everything does.</h2>
    <div class="tr-scrub">
      <video muted playsinline preload="metadata" poster="out/03-scrub-poster.jpg">
        <source data-src="out/03-scrub.mp4" type="video/mp4"></video>
      <img class="tr-scrub__still" src="{hero_still}" alt="">
      <div class="tr-scrub__rail"><i></i></div>
    </div>
    <p class="cap">Scroll it. The workspace comes up, the agents connect, the work leaves on the other side.</p>
  </div>
</section>
'''
    html = html.replace('<section class="sec scene">', scrub + '<section class="sec scene">', 1)

# --- 3 · two-tool scene: exact SVG pulses on the existing cable geometry ------
IN_PATH = "M520,300 C520,470 660,500 690,380"
OUT_PATH = "M760,420 C760,720 560,770 495,610"
defs = (
    '<defs><filter id="trGlow" x="-60%" y="-60%" width="220%" height="220%">'
    '<feGaussianBlur stdDeviation="5" result="b"/>'
    '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>'
    '</filter></defs>'
    f'<path class="tr-pulse tr-pulse--in" pathLength="100" d="{IN_PATH}"/>'
    f'<path class="tr-pulse tr-pulse--out" pathLength="100" d="{OUT_PATH}"/>'
)
html = html.replace('</svg>\n      <div class="win term-win">',
                    defs + '</svg>\n      <div class="win term-win">', 1)

# atmosphere bed behind that scene
if have("04-atmosphere"):
    glow = (f'<video class="tr-glow" muted loop playsinline preload="none">'
            f'{sources("04-atmosphere")}</video>')
    html = html.replace('<div class="stage">', f'<div class="stage">{glow}', 1)

# --- 4 · section-break bands --------------------------------------------------
BANDS = [("05a-band-glass", '<section class="sec inside" id="workspace">'),
         ("05b-band-scope", '<section class="sec modules" id="modules">'),
         ("05c-band-dust",  '<section class="sec start" id="start">')]
for stem, anchor in BANDS:
    if have(stem) and anchor in html:
        band = (f'<div class="tr-band"><video muted loop playsinline preload="none">'
                f'{sources(stem)}</video></div>\n')
        html = html.replace(anchor, band + anchor, 1)

# --- 5 · module micro-loops ---------------------------------------------------
MODS = [("09a-mod-call", "Call processor"),
        ("09b-mod-analytics", "Analytics"),
        ("09c-mod-publisher", "Publisher")]
for stem, title in MODS:
    if not have(stem):
        continue
    needle = f'<article><h3>{title}</h3>'
    if needle in html:
        cell = (f'<article><div class="tr-mod-loop">'
                f'<video muted loop playsinline preload="none">{sources(stem)}</video>'
                f'</div><h3>{title}</h3>')
        html = html.replace(needle, cell, 1)
        html = html.replace(
            '.mods article{display:grid;grid-template-columns:200px 1fr;',
            '.mods article{display:grid;grid-template-columns:150px 200px 1fr;', 1)

# --- 6 · final CTA ambient bed ------------------------------------------------
if have("10-cta-ambient"):
    bed = (f'<div class="tr-cta-bed"><video muted loop playsinline preload="none">'
           f'{sources("10-cta-ambient")}</video></div>')
    html = html.replace('<section class="final">',
                        '<section class="final" style="position:relative">' + bed, 1)
    html = html.replace('<div class="final', '<div style="position:relative;z-index:1" class="final', 1)

# --- 7 · attach the layer -----------------------------------------------------
html = html.replace("</style>", f"\n/* ===== motion layer ===== */\n{css}\n</style>", 1)
html = html.rstrip() + f"\n<script>\n{js}\n</script>\n"

DEST.write_text(html)
present = [s for s in ["01-hero-loop", "02-plug-reverse", "03-scrub", "04-atmosphere",
                       "05a-band-glass", "05b-band-scope", "05c-band-dust", "06-coldopen-reverse",
                       "07-macro-reverse", "08-unpatch-reverse",
                       "09a-mod-call", "09b-mod-analytics", "09c-mod-publisher",
                       "10-cta-ambient"] if have(s)]
print(f"wrote {DEST.relative_to(ROOT.parent)}  ({DEST.stat().st_size/1000:.0f} KB)")
print(f"clips wired in ({len(present)}): {', '.join(present) or 'none yet'}")
