# Tokenrip YouTube Pipeline

Record once. The agent does the rest — clean the mistakes, normalize audio, write
the title/description/chapters, design the thumbnail, and stage the upload as a
private draft. You approve twice: the **cut list**, and the **final upload**.

This is a self-contained project. To lift it into its own repo:

```bash
cp -r youtube-pipeline ~/yt-pipeline && cd ~/yt-pipeline && git init
```

Nothing here hardcodes a vault path; it runs standalone.

---

## The pipeline

```
raw .mp4 ─▶ 01 ingest ─▶ 02 transcribe ─▶ 03 cut list ⏸GATE 1
                                                │
            04 render ◀───────────────────────┘ (approved EDL)
                │
            05 polish ─▶ 06 package ─▶ 07 stage upload ⏸GATE 2 ─▶ review summary
```

Two human checkpoints, everything else unattended:
1. **Gate 1 — cut list:** the agent prints what it proposes to remove (filler,
   flubbed lines, retakes, dead air) with timestamps + reasons. You delete any entry
   you disagree with before a single frame is rendered.
2. **Gate 2 — upload:** the agent hands you a ready-to-publish package (or an
   unlisted YouTube link). You watch it, then publish.

### Two formats, one pipeline
- **Talking-head** (you narrating): edited by transcript judgment — stage 02 → 03.
- **Screen-demo** (screen recording): edited by dead-air/motion trim — `auto-editor`
  pre-pass, no transcript needed.
- v1 stitches segments **sequentially** (intro full-screen → demo full-screen).
  Picture-in-picture and branded motion graphics are **v2** (Remotion).

---

## The adapter contract (why slots are swappable)

Every stage reads from and writes to `working/<project>/` using a **fixed schema**,
so swapping a provider never touches downstream code. Pick providers in
`config.yaml`; supply keys (if any) in `.env`.

| Slot | v1 default ($0) | Upgrade options | Shared output |
|---|---|---|---|
| transcribe | `whisper_local` | `elevenlabs`, `fal` _(not built yet)_ | `transcript.json` |
| screen-demo | `auto_editor` | — | trimmed segment list |
| cut list | `claude` | — | `edl.json` |
| thumbnail | `minimax` | `ideogram_fal` | `thumbnail.png` (1280×720) |
| upload | `manual` | `youtube` | `review-summary.md` |
| polish | `ffmpeg` | `remotion` (v2) | `final.mp4` |

**`transcript.json` schema** (all transcribe adapters emit this):
```json
{
  "language": "en",
  "duration": 63.2,
  "words": [
    { "word": "so", "start": 0.10, "end": 0.28, "type": "speech" },
    { "word": "um", "start": 0.28, "end": 0.51, "type": "filler" },
    { "word": "",   "start": 0.51, "end": 1.40, "type": "silence" }
  ]
}
```
Local Whisper fills `type` via a filler wordlist + silence-gap detection;
ElevenLabs/fal fill it natively. Downstream (stage 03) is identical either way.

**`edl.json` schema** (the approved plan stage 04 renders):
```json
{
  "source": "raw.mp4",
  "segments": [
    { "action": "keep", "start": 0.0,  "end": 11.9 },
    { "action": "cut",  "start": 11.9, "end": 14.1, "reason": "filler + dead air" },
    { "action": "keep", "start": 14.1, "end": 30.1 }
  ]
}
```

---

## Setup (one-time)

v1 needs no API keys. Just system tools + a Python env.

```bash
# System tools (macOS / Homebrew)
brew install ffmpeg whisper-cpp auto-editor

# Python env
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# No keys needed for the default config. If you later enable a paid adapter:
cp .env.example .env   # then fill in only the relevant key
```

**MiniMax thumbnail** (default) uses your existing MiniMax subscription — set
`MINIMAX_API_KEY` / `MINIMAX_GROUP_ID` in `.env` when you wire stage 06.

---

## Usage

The pipeline is driven by Claude Code via `SKILL.md` (it runs the stages in order
and pauses at the two gates). To run a stage by hand:

```bash
# 1. Ingest raw footage into a named project
stages/01_ingest.sh ~/Desktop/magic-demo-take3.mp4 magic-demo

# 2. Transcribe (talking-head) — emits working/magic-demo/transcript.json
python stages/02_transcribe.py magic-demo

# 3. Propose a cut list — emits working/magic-demo/edl.json  [review it!]
python stages/03_cutlist.py magic-demo

# 4. Render the approved cut
stages/04_render.sh magic-demo

# 5–7. polish, package, stage upload
stages/05_polish.sh magic-demo
python stages/06_package.py magic-demo
python stages/07_upload.py magic-demo     # default: prints review summary
```

Each stage is idempotent — re-run with different settings without re-recording.

---

## Cost

v1 default stack: **$0 in new accounts, $0 per video.** Upgrading transcription to
ElevenLabs Scribe (~$0.25–0.50/hr) and thumbnails to Ideogram (~$0.03) brings it to
roughly **$0.30 per finished video**.

## License note (v2 Remotion)

Remotion (the v2 compositing engine) is free for for-profit orgs with ≤3 people.
At 4+ employees it requires a company license ($100/mo minimum). Not used in v1.
