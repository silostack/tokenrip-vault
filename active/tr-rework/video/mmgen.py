#!/usr/bin/env python3
"""
MiniMax video generation runner for the Tokenrip homepage motion assets.

Uses the v1 API (Hailuo family) because the account's Token Plan does not cover
the H3 series -- H3 requires pay-as-you-go. Hailuo-02 is the only v1 model that
accepts a last_frame_image, so any job with a last frame is forced onto it.

Jobs live in jobs/*.json. State (task ids, status, files) lives in state.json so
a run can be interrupted and resumed without re-spending.

  python3 mmgen.py run                 # submit everything pending, poll, download
  python3 mmgen.py run 01 04 07        # only those job ids
  python3 mmgen.py status
  python3 mmgen.py retry 04            # clear state for a job so it regenerates

Job spec:
{
  "id": "01",
  "name": "hero-loop",
  "prompt": "... [Static shot]",
  "duration": 6,
  "resolution": "1080P",
  "first_frame": "src/10_glass_inout.jpg",   # optional
  "last_frame": "src/10_glass_inout.jpg"     # optional -> forces Hailuo-02
}
"""
from __future__ import annotations

import base64
import json
import mimetypes
import sys
import time
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent
VAULT = ROOT.parents[2]
JOBS = ROOT / "jobs-mm"
CLIPS = ROOT / "clips"
STATE = ROOT / "state-mm.json"

CREATE = "https://api.minimax.io/v1/video_generation"
QUERY = "https://api.minimax.io/v1/query/video_generation"
RETRIEVE = "https://api.minimax.io/v1/files/retrieve"

# list price, USD, from docs/pricing legacy table
PRICE = {
    ("MiniMax-Hailuo-2.3", "768P", 6): 0.28,
    ("MiniMax-Hailuo-2.3", "768P", 10): 0.56,
    ("MiniMax-Hailuo-2.3", "1080P", 6): 0.49,
    ("MiniMax-Hailuo-2.3-Fast", "768P", 6): 0.19,
    ("MiniMax-Hailuo-2.3-Fast", "768P", 10): 0.32,
    ("MiniMax-Hailuo-2.3-Fast", "1080P", 6): 0.33,
    ("MiniMax-Hailuo-02", "768P", 6): 0.28,
    ("MiniMax-Hailuo-02", "768P", 10): 0.56,
    ("MiniMax-Hailuo-02", "1080P", 6): 0.49,
}


def api_key() -> str:
    for line in (VAULT / "environment.txt").read_text().splitlines():
        if line.startswith("MINIMAX_API_KEY="):
            return line.split("=", 1)[1].strip()
    raise SystemExit("MINIMAX_API_KEY not found in environment.txt")


KEY = api_key()
HEADERS = {"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}
AUTH = {"Authorization": f"Bearer {KEY}"}


def data_url(rel: str) -> str:
    p = ROOT / rel
    mime = mimetypes.guess_type(p.name)[0] or "image/jpeg"
    return f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode()


def load_state() -> dict:
    return json.loads(STATE.read_text()) if STATE.exists() else {}


def save_state(s: dict) -> None:
    STATE.write_text(json.dumps(s, indent=2))


def load_jobs(ids: list[str] | None) -> list[dict]:
    jobs = [json.loads(p.read_text()) for p in sorted(JOBS.glob("*.json"))]
    if ids:
        jobs = [j for j in jobs if j["id"] in ids]
    return jobs


def model_for(job: dict) -> str:
    if job.get("model"):
        return job["model"]
    # last-frame control exists only on Hailuo-02
    return "MiniMax-Hailuo-02" if job.get("last_frame") else "MiniMax-Hailuo-2.3"


def price_of(job: dict) -> float:
    return PRICE.get(
        (model_for(job), job.get("resolution", "768P"), job["duration"]), 0.5
    )


def build_body(job: dict) -> dict:
    body = {
        "model": model_for(job),
        "prompt": job["prompt"],
        "duration": job["duration"],
        "resolution": job.get("resolution", "768P"),
        # our prompts are deliberately precise; do not let the server rewrite them
        "prompt_optimizer": job.get("prompt_optimizer", False),
    }
    if job.get("first_frame"):
        body["first_frame_image"] = data_url(job["first_frame"])
    if job.get("last_frame"):
        body["last_frame_image"] = data_url(job["last_frame"])
    return body


def submit(job: dict) -> str:
    r = requests.post(CREATE, headers=HEADERS, json=build_body(job), timeout=300)
    try:
        data = r.json()
    except Exception:
        raise SystemExit(f"[{job['id']}] non-JSON {r.status_code}: {r.text[:400]}")
    if not data.get("task_id"):
        raise SystemExit(f"[{job['id']}] submit failed: {json.dumps(data)[:600]}")
    return data["task_id"]


def poll(task_id: str) -> dict:
    r = requests.get(QUERY, headers=AUTH, params={"task_id": task_id}, timeout=60)
    return r.json()


def fetch_url(file_id: str) -> str:
    r = requests.get(RETRIEVE, headers=AUTH, params={"file_id": file_id}, timeout=60)
    return r.json()["file"]["download_url"]


def download(url: str, dest: Path) -> None:
    with requests.get(url, stream=True, timeout=900) as r:
        r.raise_for_status()
        with dest.open("wb") as fh:
            for chunk in r.iter_content(1 << 20):
                fh.write(chunk)


def clip_path(job: dict) -> Path:
    return CLIPS / f"{job['id']}-{job['name']}.mp4"


def cmd_run(ids: list[str]) -> None:
    state = load_state()
    jobs = load_jobs(ids or None)
    if not jobs:
        raise SystemExit("no matching jobs")

    outstanding = [j for j in jobs if not (
        state.get(j["id"], {}).get("status") == "Success" and clip_path(j).exists())]
    print(f"{len(jobs)} job(s), {len(outstanding)} outstanding; "
          f"estimated spend ${sum(price_of(j) for j in outstanding):.2f}\n")

    for job in jobs:
        st = state.setdefault(job["id"], {})
        st.update(name=job["name"], model=model_for(job),
                  resolution=job.get("resolution", "768P"), duration=job["duration"])
        if st.get("status") == "Success" and clip_path(job).exists():
            print(f"[{job['id']}] {job['name']}: already done")
            continue
        if st.get("task_id") and st.get("status") not in ("Fail", None):
            print(f"[{job['id']}] {job['name']}: resuming {st['task_id']}")
            continue
        st["task_id"] = submit(job)
        st["status"] = "Queueing"
        save_state(state)
        print(f"[{job['id']}] {job['name']}: submitted {st['task_id']} "
              f"({st['model']} {st['resolution']} {st['duration']}s)")
        time.sleep(2)

    pending = {j["id"]: j for j in jobs
               if not (state[j["id"]].get("status") == "Success" and clip_path(j).exists())}
    start = time.time()
    while pending:
        time.sleep(15)
        for jid in list(pending):
            job, st = pending[jid], state[jid]
            if not st.get("task_id"):
                pending.pop(jid)
                continue
            res = poll(st["task_id"])
            status = res.get("status", "unknown")
            if status != st.get("status"):
                print(f"[{jid}] {job['name']}: {status}  ({int(time.time()-start)}s)")
                st["status"] = status
                save_state(state)
            if status == "Success":
                dest = clip_path(job)
                download(fetch_url(res["file_id"]), dest)
                st["file"] = str(dest.relative_to(ROOT))
                st["cost"] = price_of(job)
                save_state(state)
                print(f"[{jid}] {job['name']}: -> {dest.name} "
                      f"({dest.stat().st_size/1e6:.1f} MB)")
                pending.pop(jid)
            elif status == "Fail":
                st["error"] = res
                save_state(state)
                print(f"[{jid}] {job['name']}: FAILED :: {json.dumps(res)[:300]}")
                pending.pop(jid)
    print()
    cmd_status([])


def cmd_status(ids: list[str]) -> None:
    state = load_state()
    spent = 0.0
    print(f"{'id':<4} {'name':<26} {'model':<24} {'res':<6} {'s':<3} {'status':<10} file")
    for jid in sorted(state):
        st = state[jid]
        if ids and jid not in ids:
            continue
        if st.get("status") == "Success":
            spent += st.get("cost", 0)
        print(f"{jid:<4} {st.get('name',''):<26} {st.get('model',''):<24} "
              f"{st.get('resolution',''):<6} {st.get('duration',''):<3} "
              f"{st.get('status','-'):<10} {st.get('file','')}")
    print(f"\napprox spend on succeeded clips: ${spent:.2f}")


def cmd_retry(ids: list[str]) -> None:
    state = load_state()
    for jid in ids:
        state.pop(jid, None)
    save_state(state)
    print(f"cleared state for {', '.join(ids)}")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    {"run": cmd_run, "status": cmd_status, "retry": cmd_retry}[cmd](sys.argv[2:])
