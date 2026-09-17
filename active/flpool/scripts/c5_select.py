#!/usr/bin/env python3
"""C5: the batch, the bench, and the sources note.

Simon's instruction was not to squeeze to exactly 50: build a good batch per arm, pick
the 50 from it, and keep the remainder as the continuation list for further calling.
So this writes three files -- the 50 David calls first, a bench, and the full verified
pool behind both.
"""
import csv, datetime, os
from collections import Counter, defaultdict

SRC = "out/FL_POOL_v4_SIGNALS.csv"
DATE = "2026-09-04"
TIER_ORDER = {"RURAL": 0, "SMALL_METRO": 1, "BIG_METRO": 2, "UNKNOWN": 3}
ARMS = {"intersection": 30, "anchor_only": 10, "ucc_only": 10}
LANE_TARGET = {"A_VAC": 12, "A_DIRT": 18, "B": 10, "C": 5, "E": 5}

SHEET_COLS = [
    "company", "dba", "owner_name", "owner_title", "owner_source", "phone",
    "phone_source", "line_type", "phone_corroborated", "phone_alt", "email",
    "email_source", "city", "county", "county_tier", "lane", "tier",
    "equipment_class", "equipment_quote", "equipment_url", "equipment_source",
    "fleet_units_stated", "power_units", "tib_years", "last_annual_report",
    "ucc_secured_party", "ucc_filing_date", "ucc_ripe_date", "top_signal_text",
    "signals_present", "selection_reason", "website",
    # David's verdict fields, left blank
    "reached", "right_poc", "phone_ok", "email_ok", "in_market", "buying_what",
    "buying_when", "corrected_phone", "corrected_poc", "notes",
]


def num(x, d=0.0):
    try:
        return float(str(x).strip())
    except Exception:
        return d


def sheet_row(r):
    return {
        "company": r["company"], "dba": r.get("places_name", "") if r.get("places_name", "").upper() != r["company"].upper() else "",
        "owner_name": r["owner_name"], "owner_title": r["owner_title"],
        "owner_source": r["owner_source"], "phone": r["phone"],
        "phone_source": r["phone_source"], "line_type": r["line_type"],
        "phone_corroborated": r["phone_corroborated"], "phone_alt": r["phone_alt"],
        "email": r["email"], "email_source": r["email_source"],
        "city": r["prin_city"] or r["city_norm"], "county": r["county"],
        "county_tier": r["county_tier"], "lane": r["lane"], "tier": r["tier"],
        "equipment_class": r["equipment_class"], "equipment_quote": r["equipment_quote"],
        "equipment_url": r["equipment_url"], "equipment_source": r["equipment_source"],
        "fleet_units_stated": r.get("owntruck", ""), "power_units": r.get("fm_power_units", ""),
        "tib_years": r["tib_years"], "last_annual_report": r["last_annual_report"],
        "ucc_secured_party": r["secured_party"], "ucc_filing_date": (r["filing_date"] or "")[:10],
        "ucc_ripe_date": (r["ripe_date"] or "")[:10], "top_signal_text": r["top_signal_text"],
        "signals_present": r["signals_present"], "selection_reason": r["selection_reason"],
        "website": r.get("website_final", ""),
        **{c: "" for c in SHEET_COLS[SHEET_COLS.index("reached"):]},
    }


def main():
    allrows = [r for r in csv.DictReader(open(SRC, newline="")) if not r["c3_exclusion"]]
    # The 50 and the bench are drawn only from Twilio-verified numbers. Rows whose
    # number was never checked (trial quota) are good rows with an unchecked phone --
    # they go to the continuation pool, labelled, rather than to David's first dial.
    rows = [r for r in allrows if r["phone_status"] == "verified_valid"]
    unver = [r for r in allrows if r["phone_status"] != "verified_valid"]
    print(f"{len(allrows)} clean rows; {len(rows)} with a Twilio-verified phone, "
          f"{len(unver)} phone-unverified (held for continuation)")

    for r in allrows:
        r["_sort"] = (
            0 if r["phone_status"] == "verified_valid" else 1,
            -num(r["max_signal_strength"]),
            -num(r["signals_present"]),
            TIER_ORDER.get(r["county_tier"], 3),
            0 if r["phone_corroborated"] == "true" else 1,
            0 if 5 <= num(r["tib_years"]) <= 15 else 1,
            0 if r["sunbiz_match_method"] == "name_city" else 1,
            -num(r["tib_years"]),
        )
        r["selection_reason"] = (
            f"{r['tier']} arm; lane {r['lane']}; {r['county_tier'].lower().replace('_',' ')} county; "
            f"evidence {r['equipment_source'] or 'none'}; phone from "
            f"{r['phone_source'].replace('_',' ')}"
            + ("; phone corroborated by a second source" if r["phone_corroborated"] == "true" else "")
            + f"; {r['signals_present']} signal(s) present."
        )
    rows.sort(key=lambda r: r["_sort"])

    # Fill arms, respecting the lane mix as far as each arm allows.
    picked, used = [], set()
    lane_count = Counter()
    for arm, quota in ARMS.items():
        pool = [r for r in rows if r["tier"] == arm]
        taken = 0
        # first pass: honour the lane targets
        for r in pool:
            if taken >= quota:
                break
            if lane_count[r["lane"]] >= LANE_TARGET.get(r["lane"], 0):
                continue
            picked.append(r); used.add(r["join_key"]); lane_count[r["lane"]] += 1; taken += 1
        # second pass: fill any shortfall regardless of lane
        for r in pool:
            if taken >= quota:
                break
            if r["join_key"] in used:
                continue
            picked.append(r); used.add(r["join_key"]); lane_count[r["lane"]] += 1; taken += 1
        print(f"  {arm:14s} filled {taken}/{quota}")

    bench = [r for r in rows if r["join_key"] not in used][:25]
    rest = [r for r in rows if r["join_key"] not in used][25:] + sorted(unver, key=lambda r: r["_sort"])

    for path, data in ((f"out/FL_PHONE_TEST_50_{DATE}.csv", picked),
                       ("out/BENCH_25.csv", bench),
                       ("out/CONTINUATION_POOL.csv", rest)):
        with open(path, "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=SHEET_COLS)
            w.writeheader()
            w.writerows(sheet_row(r) for r in data)
        print(f"wrote {path}: {len(data)} rows")

    print("\nbatch composition:")
    print("  by arm : ", dict(Counter(r["tier"] for r in picked)))
    print("  by lane: ", dict(Counter(r["lane"] for r in picked)))
    print("  by county tier: ", dict(Counter(r["county_tier"] for r in picked)))
    print("  phone source: ", dict(Counter(r["phone_source"] for r in picked)))
    print("  corroborated: ", sum(1 for r in picked if r["phone_corroborated"] == "true"))
    print("  with email  : ", sum(1 for r in picked if r["email"]))
    print("  with website: ", sum(1 for r in picked if r["website_final"]))


if __name__ == "__main__":
    main()
