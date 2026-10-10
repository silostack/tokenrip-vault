#!/usr/bin/env python3
"""
Post-process generated clips into web-ready motion assets.

Every clip goes through: strip audio -> optional reverse -> optional seamless
loop wrap -> encode to mp4 (h264) + webm (vp9) -> poster frame.

  python3 post.py            # process everything defined in RECIPES that exists
  python3 post.py 01 03a     # only those

No webm
-------
VP9 was tried and dropped: Chrome stalls on the encode at readyState 0 without
firing an error, which also blocks the <source> fallback to the mp4, so the
whole element hangs. H.264 is ~2.5x larger but is 0.94 MB for the hero clip,
hardware-decoded everywhere, and cannot fail this way.

Seamless loop wrap
------------------
Sora clips do not loop. Given a clip of length T and an overlap X, we build a
loop of length T-X where the first X seconds are a crossfade from the clip's
tail into its head, and the rest is the clip's middle. The result's last frame
is the same frame its first frame fades up from, so playback wraps invisibly.

Baked composite
---------------
Sora reproduces the render's geometry and lighting exactly but scrambles small
text ("CLAUDE CODE" -> "LAIDE CDE"). For locked-off shots the fix is to overlay
the original still back over the frame down to the label row, so labels, file
tree and readout stay pixel-perfect while the cables below come alive. Baking it
here with ffmpeg rather than layering in CSS means the page carries one <video>
and no mask, and the text can never break. Camera-move shots (06, 10) cannot be
baked -- a static overlay would not track -- so they are left alone.

Reversal
--------
Sora has no last-frame control, so anything that needed to *arrive* at the hero
still was generated running away from it. Reversing restores the intended
direction and guarantees the final frame matches the still exactly.
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CLIPS = ROOT / "clips"
OUT = ROOT / "out"

# id -> (reverse?, loop_overlap_seconds or None, note)
RECIPES = {
    "01":  (False, 1.5, "hero: continuous in/out pulses, wrapped to a loop"),
    "02":  (True,  None, "cable plugs in: generated unplugging, reversed"),
    "03a": (True,  None, "scrub segment A: dead -> alive"),
    "03b": (False, None, "scrub segment B: alive -> output surge"),
    "04":  (False, 1.5, "screen-blend atmosphere loop"),
    "05a": (False, 1.5, "section band: glass"),
    "05b": (False, 1.5, "section band: scope"),
    "05c": (False, 1.5, "section band: dust"),
    "06":  (True,  None, "cold open: generated fading out + pushing in, reversed"),
    "07":  (True,  None, "macro plug: generated unplugging, reversed"),
    "08":  (True,  None, "office assembles itself: generated unpatching, reversed"),
    "09a": (False, 1.0, "module: call processor"),
    "09b": (False, 1.0, "module: analytics"),
    "09c": (False, 1.0, "module: publisher"),
    "10":  (False, 2.0, "final CTA ambient"),
}


# locked-off shots whose text can be restored by overlaying the original still
BAKE = {"01", "02", "03", "03a", "03b", "08"}
STILL = OUT / "patchbay-hero-16x9.jpg"
# the still is opaque down to LABEL_Y and fades out over FEATHER px
LABEL_Y, FEATHER = 442, 18


def bake(src: Path, dest: Path) -> None:
    """Overlay the pristine still over the video, above the label row."""
    alpha = f"clip(({LABEL_Y}-Y)/{FEATHER}*255,0,255)"
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-i", str(STILL),
         "-filter_complex",
         "[1:v]scale=1280:720,format=rgba,"
         f"geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='{alpha}'[top];"
         # the still is a full-range JPEG; without an explicit range conversion
         # ffmpeg tags the result yuvj420p, which is deprecated and shifts colour
         # in some decoders
         "[0:v][top]overlay=0:0:format=auto,"
         "scale=in_range=full:out_range=tv,format=yuv420p[v]",
         "-map", "[v]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "21",
         "-pix_fmt", "yuv420p", "-color_range", "tv",
         "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
         "-movflags", "+faststart", str(dest)])


def run(args: list[str]) -> None:
    subprocess.run(args, check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


def duration(p: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "format=duration", "-of", "csv=p=0", str(p)],
        capture_output=True, text=True, check=True).stdout.strip()
    return float(out)


def build_filter(reverse: bool, overlap: float | None, T: float) -> str:
    """Video filtergraph producing the final [v] label."""
    chain = []
    src = "[0:v]"
    if reverse:
        chain.append(f"{src}reverse[rv]")
        src = "[rv]"
    if overlap:
        X, L = overlap, T
        chain.append(f"{src}split=3[a][b][c]")
        chain.append(f"[a]trim=0:{X},setpts=PTS-STARTPTS[head]")
        chain.append(f"[b]trim={L-X}:{L},setpts=PTS-STARTPTS[tail]")
        chain.append(f"[tail][head]xfade=transition=fade:duration={X}:offset=0[xf]")
        chain.append(f"[c]trim={X}:{L-X},setpts=PTS-STARTPTS[mid]")
        chain.append("[xf][mid]concat=n=2:v=1:a=0[v]")
    else:
        chain.append(f"{src}null[v]")
    return ";".join(chain)


def process(jid: str, name: str) -> None:
    src = CLIPS / f"{jid}-{name}.mp4"
    if not src.exists():
        return
    reverse, overlap, note = RECIPES[jid]
    T = duration(src)
    if overlap and T <= 2 * overlap + 0.5:
        overlap = max(0.5, (T - 0.6) / 2)
    vf = build_filter(reverse, overlap, T)
    stem = OUT / f"{jid}-{name}"

    run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(src),
         "-filter_complex", vf, "-map", "[v]", "-an",
         "-c:v", "libx264", "-preset", "slow", "-crf", "22",
         "-pix_fmt", "yuv420p", "-movflags", "+faststart",
         f"{stem}.mp4"])
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{stem}.mp4",
         "-frames:v", "1", "-q:v", "3", f"{stem}-poster.jpg"])

    baked = ""
    if jid in BAKE and STILL.exists():
        comp = OUT / f"{jid}-{name}-composite.mp4"
        bake(Path(f"{stem}.mp4"), comp)
        baked = f"baked {comp.stat().st_size/1e6:.2f}MB  "
    mb = Path(f"{stem}.mp4").stat().st_size / 1e6
    print(f"[{jid}] {name:<20} {duration(Path(f'{stem}.mp4')):.1f}s  raw {mb:.2f}MB  {baked}"
          f"{'reversed ' if reverse else ''}{'looped' if overlap else ''} — {note}")


def build_scrub() -> None:
    """Join the two scrub halves into one all-intra track.

    Every frame is a keyframe and the rate is dropped to 15fps, because this
    clip is seeked on every scroll tick rather than played -- seeking to a
    non-keyframe forces a decode from the previous one and judders.
    """
    a = OUT / "03a-scrub-powerdown-composite.mp4"
    b = OUT / "03b-scrub-outflow-composite.mp4"
    if not (a.exists() and b.exists()):
        return
    lst = OUT / "_concat.txt"
    lst.write_text(f"file '{a}'\nfile '{b}'\n")
    tmp = OUT / "_joined.mp4"
    run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0",
         "-i", str(lst), "-c", "copy", str(tmp)])
    dest = OUT / "03-scrub.mp4"
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(tmp), "-an", "-r", "15",
         "-c:v", "libx264", "-preset", "veryslow", "-crf", "28",
         "-g", "1", "-keyint_min", "1", "-sc_threshold", "0",
         "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(dest)])
    # frame 0 of the scrub is the powered-down state, i.e. near black -- a poster
    # taken from there reads as a broken video, so pull it from the live half
    run(["ffmpeg", "-y", "-loglevel", "error", "-ss", "9", "-i", str(dest),
         "-frames:v", "1", "-q:v", "3", str(OUT / "03-scrub-poster.jpg")])
    lst.unlink(); tmp.unlink()
    print(f"[03] scrub track         {duration(dest):.1f}s  "
          f"{dest.stat().st_size/1e6:.2f}MB  all-intra 15fps — scroll-scrubbed")


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    want = sys.argv[1:]
    state = json.loads((ROOT / "state.json").read_text())
    for jid in sorted(RECIPES):
        if want and jid not in want:
            continue
        st = state.get(jid)
        if st and (CLIPS / f"{jid}-{st['name']}.mp4").exists():
            process(jid, st["name"])
    build_scrub()
