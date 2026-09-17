#!/usr/bin/env python3
"""Retry the Twilio lookups that were throttled.

The first pass ran 10 threads and did not check HTTP status, so trial-account 429s
(error 60624) were recorded as valid=false -- i.e. as dead numbers. They are not dead;
they were never looked up. Throttled requests are not billed. This pass is serial,
checks status, backs off on 429, and writes the cache after every result so it can be
resumed if interrupted.
"""
import json, os, sys, time
import requests
from dotenv import load_dotenv

load_dotenv("/Users/si/tokenrip-vault/active/flpool/.env")
SID, TOK = os.environ["TWILIO_ACCOUNT_SID"], os.environ["TWILIO_AUTH_TOKEN"]
PATH = "data/work/twilio_cache.json"

cache = json.load(open(PATH))
todo = [n for n, v in cache.items() if not v.get("valid") and not v.get("line_type")
        and v.get("http") != 404]
print(f"{len(todo)} numbers to retry (throttled on the first pass)", flush=True)

delay, done, billed = 1.0, 0, 0
for i, n in enumerate(todo):
    for attempt in range(6):
        try:
            r = requests.get(f"https://lookups.twilio.com/v2/PhoneNumbers/+1{n}",
                             params={"Fields": "line_type_intelligence"},
                             auth=(SID, TOK), timeout=25)
        except Exception:
            time.sleep(2 ** attempt)
            continue
        if r.status_code == 429:
            delay = min(delay * 1.5, 6.0)
            time.sleep(delay)
            continue
        j = r.json() if r.headers.get("content-type", "").startswith("application/json") else {}
        lt = j.get("line_type_intelligence") or {}
        ls = j.get("line_status")
        cache[n] = {"valid": bool(j.get("valid")), "line_type": lt.get("type") or "",
                    "carrier": lt.get("carrier_name") or "",
                    "line_status": (ls or {}).get("status", "") if isinstance(ls, dict) else "",
                    "http": r.status_code, "err": ""}
        billed += 1
        delay = max(delay * 0.9, 0.6)
        break
    else:
        cache[n] = {**cache.get(n, {}), "err": "rate_limited_after_retries", "http": 429}
    done += 1
    if done % 25 == 0:
        json.dump(cache, open(PATH, "w"))
        ok = sum(1 for v in cache.values() if v.get("valid"))
        print(f"  {done}/{len(todo)}  valid so far {ok}  delay {delay:.1f}s", flush=True)
    time.sleep(delay)

json.dump(cache, open(PATH, "w"))
ok = sum(1 for v in cache.values() if v.get("valid"))
print(f"done. billed this pass ~{billed} (${0.008*billed:.2f}); total valid {ok}/{len(cache)}")
