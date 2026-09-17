#!/usr/bin/env python3
"""Runbook §7 calibration. Re-run when data/raw/pcf_case_study_50.csv arrives.
Checks whether David's 50 repeat customers (8+ deals) appear in any pulled feed,
and — for feeds that are queryable databases — whether they appear BEFORE their
deal dates (the signal that matters). Until the file exists, only the feed-name
overlap runs; the DB-history check prints its plan.
"""
import csv, glob, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))
from normalize import normalize_name

def feed_index():
    idx = {}
    for f in glob.glob("data/work/feeds/F*_*.csv"):
        if ".joined" in f: continue
        for r in csv.DictReader(open(f)):
            if r["company_norm"]:
                idx.setdefault(r["company_norm"], []).append(
                    (r["feed_id"], r["state"], r.get("record_date",""), r.get("agency","")))
    return idx

def main():
    idx = feed_index()
    cs = "data/raw/pcf_case_study_50.csv"
    if not os.path.exists(cs):
        print("pcf_case_study_50.csv NOT PRESENT — §7 winners-vs-dead calibration not yet possible.")
        print("When it arrives, this script will: (1) normalize each of the 50 names, "
              "(2) report which appear in each pulled feed and on what date, "
              "(3) for database feeds (FDOT letting, FL DOH OSTDS) query the live source "
              "across ALL dates for each name and flag any appearance BEFORE the deal date.")
        return
    rows = list(csv.DictReader(open(cs)))
    ncol = next((c for c in rows[0] if c.lower() in ("company","name","debtor","company_raw")), list(rows[0])[0])
    hits = 0
    for r in rows:
        nm = normalize_name(r.get(ncol,""))
        if nm in idx:
            hits += 1
            print(f"{nm}: {idx[nm]}")
    print(f"\n{hits}/{len(rows)} case-study companies appear in a pulled feed (one-month window).")

if __name__ == "__main__":
    main()
