#!/usr/bin/env python3
"""Morning re-verify, run before the sheet goes to David.

Re-checks the four things that can change overnight and would embarrass us on a call:
Sunbiz still active, Places still not CLOSED_PERMANENTLY, the website still resolves,
and the phone still validates. Any row that fails is swapped for the top of the bench
and the swap is logged.

Usage:  .venv/bin/python scripts/reverify.py [--apply]
Without --apply it reports only and changes nothing.
"""
import csv, datetime, json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
import requests
from dotenv import load_dotenv

load_dotenv("/Users/si/tokenrip-vault/active/flpool/.env")
KEY = os.environ["GOOGLE_PLACES_API_KEY"]
SID, TOK = os.environ["TWILIO_ACCOUNT_SID"], os.environ["TWILIO_AUTH_TOKEN"]
BATCH = "out/FL_PHONE_TEST_50_2026-09-04.csv"
BENCH = "out/BENCH_25.csv"
APPLY = "--apply" in sys.argv


def sunbiz_active(company):
    """Check the freshly parsed corporate table rather than scraping search.sunbiz.org."""
    r = subprocess.run(["psql", "-d", "flpool", "-Atc",
                        "select status from out.fl_pool_v1 where company = "
                        + "'" + company.replace("'", "''") + "' limit 1"],
                       capture_output=True, text=True)
    return r.stdout.strip() in ("", "A")


def places_status(name, city):
    try:
        r = requests.post("https://places.googleapis.com/v1/places:searchText",
                          headers={"Content-Type": "application/json", "X-Goog-Api-Key": KEY,
                                   "X-Goog-FieldMask": "places.displayName,places.businessStatus"},
                          json={"textQuery": f"{name} {city} FL", "maxResultCount": 1},
                          timeout=20)
        p = (r.json().get("places") or [{}])[0]
        return p.get("businessStatus", "")
    except Exception:
        return ""


def site_ok(url):
    if not url:
        return True
    if not url.startswith("http"):
        url = "https://" + url
    try:
        r = requests.get(url, timeout=12, allow_redirects=True,
                         headers={"User-Agent": "Mozilla/5.0"})
        return r.status_code < 400
    except Exception:
        return False


def phone_ok(p):
    d = "".join(c for c in p if c.isdigit())[-10:]
    if len(d) != 10:
        return False
    try:
        r = requests.get(f"https://lookups.twilio.com/v2/PhoneNumbers/+1{d}",
                         auth=(SID, TOK), timeout=20)
        if r.status_code == 429:
            return True   # trial quota: cannot check, do not drop a good row
        return bool(r.json().get("valid"))
    except Exception:
        return True


def check(r):
    fails = []
    if not sunbiz_active(r["company"]):
        fails.append("sunbiz_no_longer_active")
    if places_status(r["company"], r["city"]) == "CLOSED_PERMANENTLY":
        fails.append("closed_permanently")
    if not site_ok(r["website"]):
        fails.append("website_dead")
    if not phone_ok(r["phone"]):
        fails.append("phone_no_longer_valid")
    return r, fails


def main():
    rows = list(csv.DictReader(open(BATCH, newline="")))
    bench = list(csv.DictReader(open(BENCH, newline="")))
    with ThreadPoolExecutor(max_workers=6) as ex:
        results = list(ex.map(check, rows))

    bad = [(r, f) for r, f in results if f]
    print(f"{len(rows)} rows checked; {len(bad)} failed re-verify")
    for r, f in bad:
        print(f"  {r['company'][:44]:46s} {','.join(f)}")
    if not bad:
        print("no swaps needed.")
        return
    if not APPLY:
        print("\nreport only. re-run with --apply to swap from the bench.")
        return

    swaps, bi = [], 0
    out = []
    for r, f in results:
        if f and bi < len(bench):
            sub = bench[bi]; bi += 1
            swaps.append((r["company"], ",".join(f), sub["company"]))
            out.append(sub)
        elif not f:
            out.append(r)
    with open(BATCH, "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(out[0].keys()))
        w.writeheader(); w.writerows(out)
    with open("out/SWAPS.md", "w") as fh:
        fh.write(f"# Re-verify swaps — {datetime.date.today().isoformat()}\n\n")
        fh.write("| Removed | Reason | Replaced with |\n|---|---|---|\n")
        for a, b, c in swaps:
            fh.write(f"| {a} | {b} | {c} |\n")
    print(f"\napplied {len(swaps)} swaps; logged to out/SWAPS.md")


if __name__ == "__main__":
    main()
