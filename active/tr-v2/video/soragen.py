#!/usr/bin/env python3
"""
Sora 2 video generation runner for the Tokenrip homepage motion assets.

Why Sora and not MiniMax: the MiniMax account is on a Token Plan that (a) does
not cover the H3 series at all and (b) has hit its usage limit, so no MiniMax
video model will run until it is topped up. The OpenAI key has sora-2 and
sora-2-pro.

What that costs us: Sora has no last-frame control. Anywhere the plan wanted a
clip to *land* on the existing hero still, we instead generate the motion
running backwards from that still and reverse it in ffmpeg (see post.py). Same
result, and the reversal guarantees a pixel-exact match to the still.

  python3 soragen.py run              # submit all pending, poll, download
  python3 soragen.py run 01 04        # only those ids
  python3 soragen.py status
  python3 soragen.py retry 04

Job spec (jobs/NN-name.json):
{
  "id": "01", "name": "hero-loop",
  "prompt": "...",
  "seconds": 8,                       # 4 | 8 | 12
  "model": "sora-2",                  # or sora-2-pro
  "size": "1280x720",
  "reference": "src/ref_hero_1280.jpg"   # optional first-frame reference
}
"""
from __future__ import annotations

import json
import sys
import time
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent
VAULT = ROOT.parents[2]
JOBS = ROOT / "jobs"
CLIPS = ROOT / "clips"
STATE = ROOT / "state.json"
BASE = "https://api.openai.com/v1/videos"

# USD per second of output
PRICE = {("sora-2", "1280x720"): 0.10, ("sora-2", "720x1280"): 0.10,
         ("sora-2-pro", "1280x720"): 0.30, ("sora-2-pro", "720x1280"): 0.30,
         ("sora-2-pro", "1792x1024"): 0.50, ("sora-2-pro", "1024x1792"): 0.50}

MAX_INFLIGHT = 6   # keep the queue reasonable rather than firing 18 at once


def api_key() -> str:
    for line in (VAULT / "environment.txt").read_text().splitlines():
        if line.startswith("OPENAI_API_KEY="):
            return line.split("=", 1)[1].strip()
    raise SystemExit("OPENAI_API_KEY not found in environment.txt")


AUTH = {"Authorization": f"Bearer {api_key()}"}


def load_state() -> dict:
    return json.loads(STATE.read_text()) if STATE.exists() else {}


def save_state(s: dict) -> None:
    STATE.write_text(json.dumps(s, indent=2))


def load_jobs(ids: list[str] | None) -> list[dict]:
    jobs = [json.loads(p.read_text()) for p in sorted(JOBS.glob("*.json"))]
    return [j for j in jobs if j["id"] in ids] if ids else jobs


def price_of(job: dict) -> float:
    return PRICE.get((job.get("model", "sora-2"), job.get("size", "1280x720")), 0.10) \
        * job["seconds"]


def clip_path(job: dict) -> Path:
    return CLIPS / f"{job['id']}-{job['name']}.mp4"


def submit(job: dict) -> str:
    data = {"model": job.get("model", "sora-2"),
            "prompt": job["prompt"],
            "seconds": str(job["seconds"]),
            "size": job.get("size", "1280x720")}
    ref = job.get("reference")
    if ref:
        files = {"input_reference": (Path(ref).name, (ROOT / ref).open("rb"), "image/jpeg")}
        r = requests.post(BASE, headers=AUTH, data=data, files=files, timeout=300)
    else:
        # no file part: requests would fall back to form-urlencoded, which the API rejects
        r = requests.post(BASE, headers=AUTH, json=data, timeout=300)
    body = r.json()
    if "id" not in body:
        raise SystemExit(f"[{job['id']}] submit failed {r.status_code}: "
                         f"{json.dumps(body)[:500]}")
    return body["id"]


def poll(vid: str) -> dict:
    return requests.get(f"{BASE}/{vid}", headers=AUTH, timeout=60).json()


def download(vid: str, dest: Path) -> None:
    with requests.get(f"{BASE}/{vid}/content", headers=AUTH,
                      stream=True, timeout=900) as r:
        r.raise_for_status()
        with dest.open("wb") as fh:
            for chunk in r.iter_content(1 << 20):
                fh.write(chunk)


def cmd_run(ids: list[str]) -> None:
    state = load_state()
    jobs = load_jobs(ids or None)
    if not jobs:
        raise SystemExit("no matching jobs")

    def done(j):
        return state.get(j["id"], {}).get("status") == "completed" and clip_path(j).exists()

    todo = [j for j in jobs if not done(j)]
    print(f"{len(jobs)} job(s), {len(todo)} outstanding; "
          f"estimated spend ${sum(price_of(j) for j in todo):.2f}\n")

    queue = list(todo)
    inflight: dict[str, dict] = {}
    start = time.time()

    while queue or inflight:
        while queue and len(inflight) < MAX_INFLIGHT:
            job = queue.pop(0)
            st = state.setdefault(job["id"], {})
            st.update(name=job["name"], model=job.get("model", "sora-2"),
                      size=job.get("size", "1280x720"), seconds=job["seconds"],
                      cost=price_of(job))
            if not st.get("video_id") or st.get("status") == "failed":
                st["video_id"] = submit(job)
                st["status"] = "queued"
                save_state(state)
                print(f"[{job['id']}] {job['name']}: submitted {st['video_id'][:22]} "
                      f"({st['model']} {st['size']} {st['seconds']}s ${st['cost']:.2f})")
            inflight[job["id"]] = job
            time.sleep(1)

        if not inflight:
            break
        time.sleep(15)

        for jid in list(inflight):
            job, st = inflight[jid], state[jid]
            res = poll(st["video_id"])
            status, prog = res.get("status"), res.get("progress", 0)
            if (status, prog) != (st.get("status"), st.get("progress")):
                st["status"], st["progress"] = status, prog
                save_state(state)
                print(f"[{jid}] {job['name']}: {status} {prog}%  "
                      f"({int(time.time()-start)}s)")
            if status == "completed":
                dest = clip_path(job)
                download(st["video_id"], dest)
                st["file"] = str(dest.relative_to(ROOT))
                save_state(state)
                print(f"[{jid}] {job['name']}: -> {dest.name} "
                      f"({dest.stat().st_size/1e6:.1f} MB)")
                inflight.pop(jid)
            elif status == "failed":
                st["error"] = res.get("error")
                save_state(state)
                print(f"[{jid}] {job['name']}: FAILED :: {json.dumps(res.get('error'))[:300]}")
                inflight.pop(jid)
    print()
    cmd_status([])


def cmd_status(ids: list[str]) -> None:
    state = load_state()
    spent = 0.0
    print(f"{'id':<4} {'name':<24} {'model':<12} {'size':<10} {'s':<3} "
          f"{'status':<11} file")
    for jid in sorted(state):
        st = state[jid]
        if ids and jid not in ids:
            continue
        if st.get("status") == "completed":
            spent += st.get("cost", 0)
        print(f"{jid:<4} {st.get('name',''):<24} {st.get('model',''):<12} "
              f"{st.get('size',''):<10} {st.get('seconds',''):<3} "
              f"{st.get('status','-'):<11} {st.get('file','')}")
    print(f"\napprox spend on completed clips: ${spent:.2f}")


def cmd_retry(ids: list[str]) -> None:
    state = load_state()
    for jid in ids:
        state.pop(jid, None)
    save_state(state)
    print(f"cleared state for {', '.join(ids)}")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    {"run": cmd_run, "status": cmd_status, "retry": cmd_retry}[cmd](sys.argv[2:])
