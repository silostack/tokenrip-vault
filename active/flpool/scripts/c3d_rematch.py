#!/usr/bin/env python3
"""Re-score every Places match with a stricter rule. No API calls.

The original rule -- rapidfuzz token_set_ratio >= 80 plus a city/zip match -- accepted
matches that agreed only on generic industry words. 'MDL SITE PREP' scored 81.8 against
'Sunshine Site Prep', and 'OCALA JUNK REMOVAL' matched the national franchise 'Junk King
Ocala'. Both then contributed that other company's phone number to the sheet, which is
precisely the failure mode this batch exists to disprove.

The stricter rule compares the DISTINCTIVE part of each name -- what is left after the
industry vocabulary and the geography are removed. Two companies that share only
'site prep' no longer match; 'BELL CONCRETE PRODUCTS, INCORPORATED' and 'Bell Concrete
Products' still do, because 'BELL' survives on both sides.
"""
import csv, os, re
from rapidfuzz import fuzz

GENERIC = {
    "SITE","PREP","PREPARATION","CONSTRUCTION","CONSTRUCTORS","TRUCKING","HAULING","HAUL",
    "SERVICES","SERVICE","EXCAVATING","EXCAVATION","SEPTIC","CONCRETE","PAVING","ASPHALT",
    "CONTRACTORS","CONTRACTING","CONTRACTOR","INDUSTRIES","PRODUCTS","ENTERPRISES","GROUP",
    "COMPANY","CORPORATION","INCORPORATED","INC","LLC","LC","CO","LTD","LP","PLLC","THE",
    "AND","OF","JUNK","REMOVAL","DISPOSAL","WASTE","RECYCLING","GARDEN","CENTER","CENTRE",
    "CARRIERS","CARRIER","TRANSPORT","LOGISTICS","BUILDERS","BUILDING","DEVELOPMENT",
    "MANAGEMENT","SOLUTIONS","SYSTEMS","EQUIPMENT","SUPPLY","RENTAL","RENTALS","TANK",
    "PUMPING","PUMP","SEWER","UTILITY","UTILITIES","GRADING","LAND","CLEARING","DIRT",
    "DRILLING","WELL","TOWING","TOW","WRECKER","RECOVERY","DUMPSTER","ROLLOFF","LAWN",
    "LANDSCAPING","PLUMBING","ELECTRIC","ELECTRICAL","MECHANICAL","ROOFING","AIR",
    "CONDITIONING","HEATING","FARMS","FARM","RANCH","BROTHERS","BROS","SONS","SON",
    "FLORIDA","FL","NORTH","SOUTH","EAST","WEST","CENTRAL","COAST","COASTAL","GULF",
    "BAY","LAKE","RIVER","SUNSHINE","SUNSTATE","ALL","PRO","QUALITY","PREMIER","ELITE",
    "AMERICAN","NATIONAL","UNITED","FIRST","BEST","TOP","SUPERIOR","ADVANCED","PRECISION",
}


def toks(s):
    return [t for t in re.split(r"[^A-Z0-9]+", (s or "").upper()) if t]


def distinctive(s, city=""):
    c = set(toks(city))
    return [t for t in toks(s) if t not in GENERIC and t not in c and len(t) > 1]


def accept(company, places_name, city):
    """True if the Places result is the same company, not merely the same trade."""
    a, b = distinctive(company, city), distinctive(places_name, city)
    if a and b:
        if set(a) & set(b):
            return True, "distinctive token shared"
        best = max(fuzz.ratio(" ".join(a), " ".join(b)),
                   max((fuzz.ratio(x, y) for x in a for y in b), default=0))
        return (best >= 88), f"distinctive fuzz {best:.0f}"
    # Nothing distinctive on one side: demand a near-identical full name.
    s = fuzz.token_sort_ratio(" ".join(toks(company)), " ".join(toks(places_name)))
    return (s >= 92), f"generic-only, full-name fuzz {s:.0f}"


def main():
    rows = list(csv.DictReader(open("out/FL_POOL_v3_CONTACT.csv", newline="")))
    demoted = kept = 0
    for r in rows:
        if r.get("places_found") != "true" or not r.get("places_name"):
            continue
        ok, why = accept(r["company"], r["places_name"], r.get("prin_city", ""))
        r["places_match_rule"] = why
        if ok:
            kept += 1
            continue
        demoted += 1
        r["places_rejected_name"] = r["places_name"]
        for k in ("places_found", "places_id", "places_name", "places_phone",
                  "places_website", "business_status", "places_address", "places_types",
                  "places_ratings", "places_match_score"):
            r[k] = "false" if k == "places_found" else ""
    print(f"Places matches kept {kept}, demoted {demoted}")
    cols = list(rows[0].keys())
    for r in rows:
        for k in r:
            if k not in cols:
                cols.append(k)
    for r in rows:
        for k in cols:
            r.setdefault(k, "")
    tmp_out = "out/FL_POOL_v3_CONTACT.csv.tmp"
    with open(tmp_out, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        w.writerows(rows)
        os.replace(tmp_out, 'out/FL_POOL_v3_CONTACT.csv')


if __name__ == "__main__":
    main()
