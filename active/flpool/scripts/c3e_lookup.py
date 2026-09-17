#!/usr/bin/env python3
"""C3e: Twilio Lookup v2 runner for a paid account.

Replaces the serial trial-account retry. Two modes:

  line   fill line_type_intelligence for every number in twilio_cache.json that was
         never successfully checked (the trial 429s). Writes data/work/twilio_cache.json.
  cnam   fetch caller_name (CNAM) for the numbers in a CSV. Writes a separate cache,
         data/work/cnam_cache.json, so the line-type cache stays the source of truth
         for phone_status and the two packages can be reasoned about independently.

Every result records the HTTP status so "the API did not answer" is never stored as
"the number is bad" -- the defect that cost the first run 317 good rows.

Usage:
  .venv/bin/python scripts/c3e_lookup.py line
  .venv/bin/python scripts/c3e_lookup.py cnam out/FL_PHONE_TEST_50_v2_2026-09-05.csv [more.csv ...]
"""
import csv, json, os, sys, threading, time
from concurrent.futures import ThreadPoolExecutor

import requests
from dotenv import load_dotenv

load_dotenv("/Users/si/tokenrip-vault/active/flpool/.env", override=True)
SID, TOK = os.environ["TWILIO_ACCOUNT_SID"], os.environ["TWILIO_AUTH_TOKEN"]
LINE_CACHE = "data/work/twilio_cache.json"
CNAM_CACHE = "data/work/cnam_cache.json"
WORKERS = 8
lock = threading.Lock()


def load(path):
    try:
        return json.load(open(path))
    except FileNotFoundError:
        return {}


def save(path, cache):
    tmp = path + ".tmp"
    with open(tmp, "w") as f:
        json.dump(cache, f)
    os.replace(tmp, path)


def get(n, fields):
    """One lookup. Returns the parsed body plus the HTTP status, retrying on 429/5xx."""
    for attempt in range(6):
        try:
            r = requests.get(f"https://lookups.twilio.com/v2/PhoneNumbers/+1{n}",
                             params={"Fields": fields}, auth=(SID, TOK), timeout=25)
        except Exception:
            time.sleep(1.5 * (attempt + 1))
            continue
        if r.status_code == 429 or r.status_code >= 500:
            time.sleep(1.5 * (attempt + 1))
            continue
        body = r.json() if r.headers.get("content-type", "").startswith("application/json") else {}
        return body, r.status_code
    return {}, 429


def run_line(nums):
    cache = load(LINE_CACHE)
    done = [0]

    def one(n):
        j, code = get(n, "line_type_intelligence")
        lt = j.get("line_type_intelligence") or {}
        rec = {"valid": bool(j.get("valid")), "line_type": lt.get("type") or "",
               "carrier": lt.get("carrier_name") or "", "line_status": "",
               "http": code, "err": "" if code == 200 else f"http_{code}"}
        with lock:
            cache[n] = rec
            done[0] += 1
            if done[0] % 50 == 0:
                save(LINE_CACHE, cache)
                print(f"  {done[0]}/{len(nums)}", flush=True)

    with ThreadPoolExecutor(WORKERS) as ex:
        list(ex.map(one, nums))
    save(LINE_CACHE, cache)
    ok = sum(1 for v in cache.values() if v.get("valid"))
    still = sum(1 for v in cache.values() if not v.get("valid") and not v.get("line_type"))
    print(f"line: {len(nums)} looked up (~${0.008*len(nums):.2f}); cache now {ok} valid, {still} unresolved")


def run_cnam(nums):
    cache = load(CNAM_CACHE)
    todo = [n for n in nums if n not in cache or cache[n].get("http") != 200]
    print(f"cnam: {len(todo)} to fetch ({len(nums) - len(todo)} already cached)")
    done = [0]

    def one(n):
        j, code = get(n, "caller_name")
        cn = j.get("caller_name") or {}
        rec = {"caller_name": cn.get("caller_name") or "", "caller_type": cn.get("caller_type") or "",
               "error_code": cn.get("error_code"), "http": code}
        with lock:
            cache[n] = rec
            done[0] += 1
            if done[0] % 25 == 0:
                save(CNAM_CACHE, cache)
                print(f"  {done[0]}/{len(todo)}", flush=True)

    with ThreadPoolExecutor(WORKERS) as ex:
        list(ex.map(one, todo))
    save(CNAM_CACHE, cache)
    named = sum(1 for n in nums if cache.get(n, {}).get("caller_name"))
    print(f"cnam: {len(todo)} fetched (~${0.01*len(todo):.2f}); {named}/{len(nums)} returned a name")


def d10(p):
    x = "".join(c for c in (p or "") if c.isdigit())
    return x[-10:] if len(x) >= 10 else ""


def main():
    mode = sys.argv[1]
    if mode == "line":
        cache = load(LINE_CACHE)
        nums = [n for n, v in cache.items() if not v.get("valid") and not v.get("line_type")]
        print(f"line: {len(nums)} numbers never successfully checked")
        run_line(nums)
    elif mode == "cnam":
        nums, seen = [], set()
        for path in sys.argv[2:]:
            for r in csv.DictReader(open(path)):
                for col in ("phone", "phone_alt"):
                    n = d10(r.get(col, ""))
                    if n and n not in seen:
                        seen.add(n); nums.append(n)
        print(f"cnam: {len(nums)} distinct numbers from {len(sys.argv) - 2} file(s)")
        run_cnam(nums)
    else:
        sys.exit("mode must be 'line' or 'cnam'")


if __name__ == "__main__":
    main()
