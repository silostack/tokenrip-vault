# Quintel Image Theme — 5 Sample Styles & Breakdown

**Status:** first exploration round. 5 sample styles, one subject each, for style comparison.
**Date:** 2026-07-09
**Subject (held constant):** a hydraulic excavator on an earthmoving site — matches the quintel.ai hero.

---

## Design brief (from the quintel.ai brand)

Quintel is the **opposite** of Tokenrip's edgy woodcut/samizdat world. The site reads as:

- **Palette:** deep forest green + warm cream/bone + black. Very restrained, editorial.
- **Photography:** real, grounded, industrial — excavators, quarries, forging presses. Muted, dignified.
- **Type/UI:** big confident book-ish headlines; clean data-dense financial cards with small-caps labels.
- **Tone:** serious, institutional, credible, warm-but-professional. Financial-services trust meets
  thoughtful software. This is a lender/broker buyer — the images must *earn credibility*, not entertain.

So the whole set stays inside **green + cream + real equipment**, and (as with Tokenrip) suppresses
text, because MiniMax renders any lettering as gibberish. Headlines are added in post.

---

## The 5 styles

| # | Style | What it is | Best for |
|---|-------|-----------|----------|
| 1 | **Duotone industrial** | Real equipment photo, deep-green/cream duotone | Safe workhorse; matches the hero exactly |
| 2 | **Banknote engraving** | Intaglio line-engraving, green ink on cream | Credibility / "your book" / finance pieces |
| 3 | **Iso schematic** | Clean isometric CAD line drawing, green on cream | Precision / "reads your assets" / product pieces |
| 4 | **Riso editorial** | Two-color risograph screenprint, warm grain | Thought-leadership / human / magazine tone |
| 5 | **Cinematic golden-hour** | Premium real photography at golden hour | Aspirational / brand-campaign / "operator's world" |

## Ranking & recommendation

Judged on: credible for a lender/broker buyer · on-brand palette · versatile across asset types · ownable.

### 1 — `2-banknote-engraving.png`  ★ most ownable + most on-thesis
Green intaglio engraving of the excavator on cream. This is the standout: it *looks like a financial
instrument*, which is exactly Quintel's pitch ("learns your book," credit-desk credibility). Nobody
else in equipment-finance software looks like this. Distinctive and defensible.

### 2 — `3-iso-schematic.png`  ★ cleanest, palette-perfect
Precise green line drawing on cream, zero text, very modern. Says "we understand your assets" without
a word. The safest zero-gibberish lane and the most obviously "software/intelligence" of the set.

### 3 — `1-duotone-industrial.png`  ★ safe workhorse
Green-duotone real excavator; matches the site hero directly. The default when a piece just needs a
credible, grounded image and nothing fancier.

### 4 — `4-riso-editorial.png`  ★ warm/human lane
Riso grain, green machine on rust-orange earth. Warmest and most magazine-like — good for
thought-leadership. Caveat: the orange drifts off the strict green palette; treat as an accent lane.

### 5 — `5-cinematic-goldenhour.png`  ★ premium but least ownable
Beautiful two-excavator golden-hour shot. Aspirational, but it's the most stock-photo-ish (anyone can
buy this look) and the warm grade pulls away from the green brand. Use for a hero campaign moment, not
the everyday.

**Suggested lanes:** engraving (signature/finance) + iso-schematic (product/precision) as the two
owned lanes, duotone as the everyday workhorse, riso + cinematic as accents.

## The winning pattern: MiniMax equipment + typed card overlay (#3, iso-schematic)

`3-iso-composite.png` is the chosen approach for the iso-schematic lane (Alek's pick).

**Can Claude draw these instead of MiniMax?** No — hand-built vector equipment looks like garbage.
But the useful answer isn't "which tool draws the whole image"; it's **split the job**:

- **MiniMax draws the equipment**, wordless (`q-iso-schematic`, "no text" already in the prompt).
  It's genuinely good at this — clean iso line-art on cream. Base used: `base-424321.png`.
- **The card is a real text layer composited on top** — recreating quintel.ai's own floating hero
  card (SURFACED TODAY · company · FIT TO BOOK 91 · ASSET/TICKET/TERM · "QUINTEL'S READ" note).
  Crisp, correct type; the diffusion model never touches a letter.

This ties the picture to the pitch: *read the asset → read the deal.* No competitor image looks like this.

**Workflow / reproduce:**
```
# 1. equipment base (wordless), pick the cleanest of a few seeds:
MINIMAX_API_KEY=… python3 scripts/generate-blog-image.py \
  --slug quintel-iso-base --concept "a single hydraulic excavator toward the left of the frame, …" \
  --style q-iso-schematic --seed 424321 --out base.png
# 2. composite the card (all fields parameterized), then rasterize @2x:
python3 scripts/quintel-composite.py --equip base.png --out final \
  --company "…" --asset "…" --ticket "…" --term "…" --fit "…" --read "…"
"…/Google Chrome" --headless=new --screenshot=final.png --window-size=1200,630 \
  --force-device-scale-factor=2 final.html
```
Card content is fully swappable per post/deal (company, asset, ticket, term, fit score, read note).

Note: faint blueprint dimension marks on the MiniMax base can read as tiny gibberish numbers — subtle
and on-theme for a spec drawing, but crop/retouch if a specific one is distracting.

## Notes / caveats

- Faint gibberish appears on machine bodies in the photo/engraving styles (fake "CAT" decals, serial
  numbers). Crop or retouch for final use; it's subtle at hero size.
- To compare styles fairly, all 5 use the same excavator subject. Real deployment would vary the asset
  (forging press, trucking fleet, medical equipment) to show range.
- Reproduce/vary via `scripts/generate-blog-image.py` with `--style q-duotone-industrial` /
  `q-banknote-engraving` / `q-iso-schematic` / `q-riso-editorial` / `q-cinematic-goldenhour`. Sidecar
  `.prompt.txt` files hold seed + full prompt.
