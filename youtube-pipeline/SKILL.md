---
name: youtube-pipeline
description: >
  Turn raw footage into a publish-ready YouTube video. Use when the user wants to
  edit/clean up a recording, "remove my mistakes / um's / dead air", cut a screen
  demo, make a magic-demo video, write a YouTube title/description/thumbnail, or
  stage a YouTube upload. Drives a local CLI pipeline (whisper.cpp + ffmpeg +
  auto-editor) with two human approval gates. Talking-head and screen-demo formats.
---

# YouTube Pipeline — orchestration

You drive a 7-stage local pipeline. The human does two things: records, and approves
twice (the cut list, and the final upload). You do everything in between.

**Project root:** the directory containing this file. Run stages from there.
Use the venv python: `.venv/bin/python` (fall back to `python3`).

## Setup check (first run only)
Confirm tools exist; if not, tell the user to run them:
```
brew install ffmpeg whisper-cpp auto-editor
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
```
v1 needs NO API keys. Adapters are chosen in `config.yaml`; keys (if any) go in `.env`.

## The run

1. **Ingest.** Ask for the raw file path, a short project name, and the format
   (`talking-head` if they're narrating; `screen` for a screen recording).
   ```
   stages/01_ingest.sh <source.mp4> <project> <talking-head|screen>
   ```

2. **Transcribe / analyze.**
   ```
   .venv/bin/python stages/02_transcribe.py <project>
   ```
   - talking-head → writes `transcript.json`
   - screen → auto-editor writes `edl.json` directly; skip to step 4's review.

3. **Cut list — and ADD YOUR JUDGMENT (the part that matters).**
   First read `working/<project>/transcript.json`. The deterministic baseline only
   removes filler + dead air. YOU add the human-editor judgment: flubbed sentences,
   false starts, the worse of two retakes ("let me try that again…"), redundant
   tangents. Write those as extra cuts:
   ```json
   // working/<project>/judgment.json
   { "cuts": [ { "start": 30.1, "end": 47.8, "reason": "retake: 2nd attempt is cleaner" } ] }
   ```
   Then build the EDL:
   ```
   .venv/bin/python stages/03_cutlist.py <project> --judgment working/<project>/judgment.json
   ```
   (Screen projects: just run `03_cutlist.py <project>` to present the auto EDL.)

   ### ⏸ GATE 1 — STOP. Show the printed cut list to the user.
   Present the keep/cut list plainly. Let them veto any cut. If they object to one,
   edit `working/<project>/edl.json` (remove that cut, merge the neighboring keeps)
   and re-show. **Do not render until they approve.**

4. **Render** the approved cut:
   ```
   stages/04_render.sh <project>
   ```

5. **Polish** (loudness, captions, bumpers):
   ```
   stages/05_polish.sh <project>
   ```

6. **Package** (metadata + thumbnail):
   ```
   .venv/bin/python stages/06_package.py <project>
   ```
   Then REWRITE `working/<project>/metadata.md` properly. The auto-draft is a stub.
   Using the transcript as ground truth, write:
   - a **title** that front-loads the hook in the first ~70 chars (≤100 total),
   - a **description** whose first ~100 chars sell the click, then detail + the
     brand footer (≤5000),
   - **chapters** at real topic boundaries (derive timestamps from the transcript),
   - 3–5 **hashtags** (never >15).
   Keep `metadata.json` in sync (stage 07 reads it) — update both, or edit
   `metadata.json` and note the changes.

7. **Stage upload:**
   ```
   .venv/bin/python stages/07_upload.py <project>
   ```
   Default `manual`: writes `review-summary.md`, uploads nothing.

   ### ⏸ GATE 2 — STOP. Hand over the review summary.
   Give the user the final file path, thumbnail, and `review-summary.md` (or the
   unlisted link if `upload.provider: youtube`). They watch it and publish. **Never
   flip anything to public yourself.**

## Notes
- Stages are idempotent (read/write `working/<project>/`). Safe to re-run.
- This ffmpeg build may lack the `subtitles` filter; polish auto-falls-back to a
  soft (embedded) caption track — that's expected, not an error.
- To upgrade quality/automation, change one line in `config.yaml` and add the key to
  `.env` (ElevenLabs Scribe, Ideogram via fal.ai, YouTube API). See README.
- v2 (not built): Remotion for PiP corner-box, branded animated intro/outro, motion
  captions.
