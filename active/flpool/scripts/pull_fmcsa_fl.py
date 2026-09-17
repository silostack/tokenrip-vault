#!/usr/bin/env python3
"""B3: page the FMCSA motor-carrier census (Socrata) for all FL carriers.
Endpoint carries fleet/address/status but NOT phone/email -- those come from the
separately downloaded SMS census CSV. Writes data/raw/fmcsa_fl_api.csv, all fields kept.
"""
import csv, os, sys, time, requests

URL = "https://data.transportation.gov/resource/az4n-8mr2.json"
OUT = "data/raw/fmcsa_fl_api.csv"
PAGE = 50000

def main():
    rows, offset, fields = [], 0, []
    sess = requests.Session()
    while True:
        params = {"$where": "phy_state='FL'", "$limit": PAGE, "$offset": offset,
                  "$order": "dot_number"}
        for attempt in range(4):
            try:
                r = sess.get(URL, params=params, timeout=180)
                r.raise_for_status()
                break
            except Exception as e:
                if attempt == 3:
                    print(f"FAILED at offset {offset}: {e}", file=sys.stderr)
                    raise
                time.sleep(2 ** attempt)
        batch = r.json()
        if not batch:
            break
        for rec in batch:
            for k in rec:
                if k not in fields:
                    fields.append(k)
        rows.extend(batch)
        print(f"  offset {offset:>7}  +{len(batch):>6}  total {len(rows):>7}", flush=True)
        if len(batch) < PAGE:
            break
        offset += PAGE

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        w.writeheader()
        w.writerows(rows)
    print(f"\nwrote {OUT}: {len(rows)} rows, {len(fields)} fields")
    print("fields:", ", ".join(fields))

if __name__ == "__main__":
    main()
