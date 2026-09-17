#!/usr/bin/env python3
"""C5g: Alek's FL 100 (WI-format + intent layer) → Twilio line type + CNAM.

Alek already did FMCSA (usdot, power_units, drivers), the intent layer (alek_signal,
lender_note) and his flag taxonomy (fit_flag). This only fills the phone columns he
left as `unknown`/blank: line_type, phone_valid, cnam_name, cnam_match. Column order
and every other value are preserved exactly.
"""
import csv, sys
sys.path.insert(0, "scripts")
import c3e_lookup as tw
from c5d_cnam import classify

RAW = "data/work/fl100_alek_raw.csv"
OUT = "out/FL_PHONE_TEST_100_2026-09-14.csv"


def d10(p):
    x = "".join(c for c in (p or "") if c.isdigit())
    return x[-10:] if len(x) >= 10 else ""


def main():
    rows = list(csv.DictReader(open(RAW)))
    nums = sorted({d10(r[c]) for r in rows for c in ("Phone", "Phone II") if d10(r[c])})
    line = tw.load(tw.LINE_CACHE)
    todo = [n for n in nums if not line.get(n, {}).get("line_type") and line.get(n, {}).get("http") != 200]
    print(f"line: {len(todo)} to fetch of {len(nums)}")
    if todo:
        tw.run_line(todo)
    tw.run_cnam(nums)
    line = tw.load(tw.LINE_CACHE); cnam = tw.load(tw.CNAM_CACHE)

    for r in rows:
        p = d10(r["Phone"]); lt = line.get(p, {}); cn = cnam.get(p, {})
        r["line_type"] = lt.get("line_type", "") or "unknown"
        r["phone_valid"] = "" if lt.get("http") != 200 else str(bool(lt.get("valid"))).lower()
        r["cnam_name"] = cn.get("caller_name", "")
        r["cnam_match"] = classify(cn.get("caller_name", ""), r["Company"], r["Name"])
    with open(OUT, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)

    from collections import Counter
    C = Counter
    print(OUT, len(rows))
    print("  line_type:", dict(C(r["line_type"] for r in rows)))
    print("  phone_valid:", dict(C(r["phone_valid"] for r in rows)))
    print("  cnam_match:", dict(C(r["cnam_match"] for r in rows)))
    inv = [r["Company"] for r in rows if r["phone_valid"] == "false"]
    if inv:
        print("  INVALID phones:", inv)


if __name__ == "__main__":
    main()
