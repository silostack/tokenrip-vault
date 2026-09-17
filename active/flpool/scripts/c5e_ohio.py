#!/usr/bin/env python3
"""C5e: take Alek's lender-first Ohio list, re-verify against FMCSA, attach Twilio
line type + CNAM, lane-tag with the FL regexes, and write it in the sheet shape
David already knows from the FL v2 batch.

Inputs
  data/work/ohio_alek_raw.csv   Alek's export (Ohio UCC search on six EF lenders, joined to FMCSA)
  data/work/ohio_census.json    FMCSA census rows for the 50 USDOTs, pulled 2026-09-09
  data/work/twilio_cache.json / cnam_cache.json

Alek's internal columns (paths on his machine, run tags, review notes) are dropped.
Nothing here filters: every row Alek sent is written, with a `fit_flag` column so the
call outcome can be read against the flag afterwards.
"""
import csv, json, sys, re
from datetime import date

sys.path.insert(0, "scripts")
import c5b_fix as fx
from c5d_cnam import classify

RAW, CENSUS = "data/work/ohio_alek_raw.csv", "data/work/ohio_census.json"
OUT = "out/OH_PHONE_TEST_50_LIEN_2026-09-09.csv"
line = json.load(open("data/work/twilio_cache.json"))
cnam = json.load(open("data/work/cnam_cache.json"))

# Read by hand against CNAM, email domain and website, 2026-09-09. OUT: the trucks are
# incidental to a shop business. BORDERLINE: could not tell what the equipment is.
OUT_OF_BOX = {"BRET'S CARPENTRY INC", "KT SUPPLY LTD", "LAST ARROW MANUFACTURING", "FAXON MACHINING LLC",
              "ROYAL CABINET DESIGN CO INC", "DOVER CABINET INDUSTRIES INC", "SNOWVILLE CREAMERY LLC",
              "CGS IMAGING INC", "AQUA SCIENCE INC", "GRANEX INDUSTRIES INC", "CARDINAL WELDING INC",
              "BARRONS LAWN SERVICE LLC", "CREEKSIDE GARDENS INC", "BISHOP BROS SUPPLY & TRANSIT LLC",
              "DURBIN INTERIOR & EXTERIOR LANDSCAPING LLC"}
BORDERLINE = {"AGILE SIGN & LIGHTING MAINTENANCE LLC", "CHASE SIGN & LIGHTING SERVICE INC", "CNN ENTERPRISES LLC",
              "PATTERSON SPECIALTY SERVICES LLC", "MCKINLEY INDUSTRIES LLC", "SCOTT YOUNG", "BORDER PATROL LLC"}
LENDER_CLASS = {"NONBANK_EQUIPMENT_LESSOR": "ef_independent", "NONBANK_EQUIPMENT_FINANCE": "ef_independent",
                "NONBANK_NMEF_AFFILIATED_TRUST": "ef_independent", "PERMITTED_BANK_OWNED_SPECIALIST": "ef_independent"}


def d10(p):
    x = "".join(ch for ch in (p or "") if ch.isdigit())
    return x[-10:] if len(x) >= 10 else ""


def fmt(n):
    return f"({n[:3]}) {n[3:6]}-{n[6:]}" if n else ""


def owner_name(s):
    return fx.rebuild_name(s) if hasattr(fx, "rebuild_name") else s.title()


def main():
    rows = list(csv.DictReader(open(RAW)))
    census = json.load(open(CENSUS))
    out = []
    for r in rows:
        c = census[r["usdot"]]
        phone = d10(r["business_phone"])
        alts = [d10(c.get("phone", "")), d10(c.get("cell_phone", ""))]
        alt = next((a for a in alts if a and a != phone), "")
        lt = line.get(phone, {})
        cn = cnam.get(phone, {})
        lane = fx.lane_of({"company": r["company"], "lane": ""}) or ""
        filed = r["ucc_filing_date"][:10]
        age_m = (date.today() - date.fromisoformat(filed)).days // 30 if filed else ""
        drivers = int(c.get("total_drivers") or 0)
        flags = []
        key = r["company"].upper()
        if any(key.startswith(o[:24]) for o in OUT_OF_BOX):
            flags.append("out_of_box")
        elif any(key.startswith(b[:24]) for b in BORDERLINE):
            flags.append("unclear_equipment")
        if drivers > 15:
            flags.append(f"drivers_{drivers}")
        if age_m != "" and age_m < 6:
            flags.append("filed_<6mo")
        if r["ucc_record_state"].startswith("HISTORICAL"):
            flags.append("lien_lapsed")
        owner = owner_name(r["principal"])
        out.append({
            "company": r["company"], "owner_name": owner, "owner_title": "Company officer (MCS-150)",
            "phone": fmt(phone), "line_type": lt.get("line_type", ""), "phone_alt": fmt(alt),
            "cnam_name": cn.get("caller_name", ""), "cnam_type": cn.get("caller_type", ""),
            "cnam_match": classify(cn.get("caller_name", ""), r["company"], owner),
            "email": c.get("email_address", "").lower(), "website": r["website"],
            "city": r["city"].title(), "state": "OH",
            "lane": lane or "OTHER", "segment": "LIEN",
            "power_units": c.get("power_units", ""), "total_drivers": c.get("total_drivers", ""),
            "mcs150_date": r["mcs150_date"][:4] + "-" + r["mcs150_date"][4:6] + "-" + r["mcs150_date"][6:8],
            "usdot": r["usdot"],
            "ucc_secured_party": r["qualifying_lender"], "ucc_lender_class": LENDER_CLASS.get(r["lender_class"], r["lender_class"]),
            "ucc_filing_date": filed, "lien_age_months": age_m, "ucc_status": r["ucc_record_state"].split("_")[0].lower(),
            "fit_flag": ";".join(flags),
        })
    with open(OUT, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=out[0].keys()); w.writeheader(); w.writerows(out)
    from collections import Counter
    print(OUT, len(out))
    for k in ("lane", "line_type", "cnam_match", "ucc_status"):
        print(f"  {k}:", dict(Counter(o[k] for o in out)))
    print("  flags:", Counter(fl for o in out for fl in o["fit_flag"].split(";") if fl))
    for o in out:
        print(f"  {o['company'][:30]:30}|{o['owner_name'][:20]:20}|{o['line_type']:12}|{o['cnam_match']:7}|{o['cnam_name'][:15]:15}|{o['lane']:6}|age={o['lien_age_months']:>3}|{o['fit_flag']}")


if __name__ == "__main__":
    main()
