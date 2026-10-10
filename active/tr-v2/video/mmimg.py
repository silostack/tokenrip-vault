#!/usr/bin/env python3
"""
MiniMax image-01 generator for Tokenrip homepage source frames.

Why images and not video: the MiniMax Token Plan covers text and image but not
video -- a video call returns "Token Plan usage limit reached" while text and
image calls on the same key succeed. Video needs a Credits top-up. Until then,
these stills are both a look-test for "generate fresh vs. derive from the
existing render" and the first frames for image-to-video once credits land.

  python3 mmimg.py            # generate every prompt in PROMPTS
  python3 mmimg.py 4a 4b      # only those keys

Outputs frames/<key>-<i>.jpg plus a sidecar .txt with the exact prompt.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent
VAULT = ROOT.parents[2]
FRAMES = ROOT / "frames"
URL = "https://api.minimax.io/v1/image_generation"

# The darkroom palette, stated in words the model can act on. Repeated in every
# prompt because image-01 drifts warm/orange if the ground is not pinned down.
PALETTE = ("Colour palette strictly limited to: near-black brown-black background, "
           "cool dark grey metal, one warm amber accent, one pale green accent, "
           "and a muted rust orange. No blue, no purple, no white background.")
NOTEXT = ("Absolutely no text, no letters, no numbers, no words, no logos, no UI "
          "labels, no captions anywhere in the image.")

PROMPTS = {
    # --- 4a · the atmosphere bed, abstract ---------------------------------
    "4a": dict(n=3, ratio="21:9", prompt=(
        "Pure black empty void. Floating specks and motes of soft light suspended at "
        "different depths, some sharp and tiny, some large soft out-of-focus bokeh "
        "circles. About two thirds of the motes glow pale green and one third glow "
        "warm amber. A few very faint horizontal streaks of light drift through. "
        "Extremely dark, high contrast, cinematic, moody, deep shadow, nothing else "
        "in frame. Macro photography with a very fast lens, heavy bokeh. " + NOTEXT)),

    # --- 4b · the atmosphere bed, as signal traces -------------------------
    "4b": dict(n=3, ratio="21:9", prompt=(
        "Pure black empty void. Long thin glowing filaments of light curving gently "
        "across the frame like fibre-optic strands seen in the dark, a few pale green "
        "and a few warm amber, each with a bright travelling point of light on it and "
        "a soft glow bleeding into the black. Everything else is pure black. "
        "Extremely dark, high contrast, cinematic, macro photography, shallow depth "
        "of field. " + NOTEXT)),

    # --- 4c · the two-tool scene, generated fresh --------------------------
    "4c": dict(n=3, ratio="16:9", prompt=(
        "A dark studio desk photographed from a low three-quarter angle. On the left, "
        "a matte black monitor at an angle showing an out-of-focus terminal glow in "
        "pale green. On the right, a second screen at an opposing angle glowing soft "
        "warm paper-white. Between and slightly behind them sits a small black "
        "rack-mount hardware unit with a brushed metal front panel and one tiny green "
        "indicator light. Two braided cables arc through the air from each screen into "
        "the unit, one carrying a pale green point of light toward the unit, one "
        "carrying a warm amber point of light away from it. Photoreal product "
        "cinematography, dark studio, single soft key light with a warm rim, shallow "
        "depth of field, deep black background. " + PALETTE + " " + NOTEXT)),

    # --- 4e · refined scene: 4c-2's composition, on-brand hardware ---------
    # 4c-2 nailed the staging (two screens angled at each other, unit between).
    # This pass kills the gamer RGB strip it invented and pins the hardware to
    # the patch-bay language: brushed metal, smoked glass, one green LED.
    "4e": dict(n=4, ratio="16:9", prompt=(
        "A blacked-out studio desk, photographed straight on from just above desk "
        "height. Two matte black monitors stand angled inward facing each other, one "
        "on the left and one on the right, their screens turned partly away from "
        "camera so only their glow is visible: the left screen glows cool pale green, "
        "the right screen glows soft warm paper-white. Centred on the desk between "
        "them sits a low wide black rack-mount hardware unit with a brushed dark metal "
        "front panel, a smoked dark glass top faintly lit from within in amber, and a "
        "single small green indicator light at its right end. One matte black braided "
        "cable runs from the left monitor down into the unit; one copper-coloured "
        "braided cable runs from the unit up to the right monitor. A small bright pale "
        "green bead of light sits on the black cable and a warm amber bead of light "
        "sits on the copper cable. Photoreal product cinematography, single soft key "
        "light with a warm rim, deep black background, shallow depth of field, "
        "reflections on the dark desk surface. No RGB lighting, no rainbow colours, no "
        "gamer aesthetic, no keyboard, no mouse, no people. " + PALETTE + " " + NOTEXT)),

    # --- 4f · refined light-trail plate for screen blending ----------------
    "4f": dict(n=3, ratio="21:9", prompt=(
        "Pure black empty void, nothing else in frame. Several long thin glowing "
        "filaments of light sweeping gently across the frame like fibre-optic strands "
        "in the dark. Exactly half the filaments glow pale mint green and half glow "
        "warm amber gold. Each filament carries small bright travelling beads of light "
        "along its length, with a soft glow bleeding into the surrounding black. "
        "Strictly only green and amber light: no blue, no cyan, no teal, no purple, no "
        "white. Extremely dark, high contrast, cinematic macro photography, shallow "
        "depth of field. " + NOTEXT)),

    # --- 4d · the same scene, tighter and more abstract --------------------
    "4d": dict(n=3, ratio="16:9", prompt=(
        "Extreme close-up in a blacked-out room: two braided cables crossing through "
        "the frame at opposing diagonals against pure black, one matte black cable "
        "carrying a travelling pale green point of light, one copper-coloured cable "
        "carrying a travelling warm amber point of light, each glow spilling softly "
        "onto the cable braid and fading into darkness. Nothing else visible. "
        "Photoreal macro product cinematography, very shallow depth of field, "
        "extremely dark, high contrast. " + NOTEXT)),
}


def api_key() -> str:
    for line in (VAULT / "environment.txt").read_text().splitlines():
        if line.startswith("MINIMAX_API_KEY="):
            return line.split("=", 1)[1].strip()
    raise SystemExit("MINIMAX_API_KEY not found")


HEADERS = {"Authorization": f"Bearer {api_key()}", "Content-Type": "application/json"}


def generate(key: str, spec: dict) -> None:
    body = {"model": "image-01", "prompt": spec["prompt"],
            "aspect_ratio": spec.get("ratio", "16:9"), "n": spec.get("n", 1),
            "response_format": "url",
            # our prompts are already explicit; rewriting them loses the palette lock
            "prompt_optimizer": False}
    r = requests.post(URL, headers=HEADERS, json=body, timeout=300)
    data = r.json()
    urls = (data.get("data") or {}).get("image_urls")
    if not urls:
        print(f"[{key}] FAILED :: {json.dumps(data)[:300]}")
        return
    (FRAMES / f"{key}.prompt.txt").write_text(spec["prompt"])
    for i, u in enumerate(urls, 1):
        dest = FRAMES / f"{key}-{i}.jpg"
        dest.write_bytes(requests.get(u, timeout=300).content)
        print(f"[{key}] -> {dest.name} ({dest.stat().st_size/1000:.0f} KB)")


if __name__ == "__main__":
    FRAMES.mkdir(exist_ok=True)
    want = sys.argv[1:]
    for key, spec in PROMPTS.items():
        if want and key not in want:
            continue
        generate(key, spec)
