#!/usr/bin/env python3
"""C5f: Alek's Wisconsin list -> Twilio line type + CNAM, FMCSA name match (fleet size,
alt phone), then David's template columns (Fields needed for tests.xlsx, 2026-09-10)
first and our columns after.

Inputs  data/work/wi_alek_raw.csv (Alek, 2026-09-11; UCC-first, WI DFI + web research, no FMCSA)
Caches  data/work/twilio_cache.json, data/work/cnam_cache.json, data/work/wi_fmcsa.json
Output  out/WI_PHONE_TEST_50_2026-09-11.csv

Nothing here filters. Every row Alek sent is written; `fit_flag` carries his flags plus
ours so the outcome can be read against the flag afterwards (Ohio: 0/27 flagged rows positive).
"""
import csv, json, os, re, sys
import requests
sys.path.insert(0, "scripts")
import c3e_lookup as tw
from c5d_cnam import classify

RAW = "data/work/wi_alek_raw.csv"
OUT = "out/WI_PHONE_TEST_50_2026-09-11.csv"
FM = "data/work/wi_fmcsa.json"
LANE_INDUSTRY = {"A_VAC": "Septic / sewer / hydrovac (vac truck)", "B_AERIAL": "Tree service (bucket / aerial truck)",
                 "B_CRANE": "Tree service (grapple / knuckleboom crane truck)", "B_PUMP": "Concrete pumping",
                 "OTHER": "Excavating / underground"}
# CNAM returned a person where Alek had none; hand-read 2026-09-11
CNAM_OWNER = {"The Stump King LLC": "C. Kingsbury", "Williams Tree Service LLC": "Teddy Williams", "Delsart Excavating LLC": "Roger Delsart"}
NOT_A_NAME = re.compile(r"not captured|tree removal|forestry|mulching|stump", re.I)


def d10(p):
    x = "".join(c for c in (p or "") if c.isdigit())
    return x[-10:] if len(x) >= 10 else ""


def fmt(n):
    return f"({n[:3]}) {n[3:6]}-{n[6:]}" if n else ""


def clean_owner(name, title):
    name = (name or "").strip()
    if not name or NOT_A_NAME.search(name):
        return "", ""
    # "Mike, owner; tree removal..." -> Mike
    name = re.split(r"[;(]", name)[0].strip().rstrip(",")
    name = re.sub(r",\s*owner.*$", "", name, flags=re.I).strip()
    title = (title or "").strip()
    title = re.split(r"[(;]", title)[0].strip() if title else ""
    if title.lower().startswith("registered agent"):
        title = "Registered agent (WI DFI)"
    return name, title


def fmcsa_lookup(company, city):
    """Socrata az4n-8mr2, WI only, exact-ish legal_name match. Returns {} if none."""
    q = re.sub(r"[^A-Z0-9 &]", " ", company.upper()).strip()
    q = re.sub(r"\b(LLC|INC|LLP|CO|CORP|LTD)\b\.?", "", q).strip()
    try:
        r = requests.get("https://data.transportation.gov/resource/az4n-8mr2.json",
                         params={"phy_state": "WI", "$where": f"upper(legal_name) like '{q}%' OR upper(dba_name) like '{q}%'",
                                 "$limit": 5}, timeout=30)
        rows = r.json() if r.status_code == 200 else []
    except Exception:
        rows = []
    if not isinstance(rows, list):
        return {}
    cu = city.upper().split("/")[0].strip()
    rows.sort(key=lambda x: (x.get("phy_city", "").upper() != cu, -int(x.get("power_units") or 0)))
    return rows[0] if rows else {}


def main():
    rows = list(csv.DictReader(open(RAW)))
    nums = sorted({d10(r["phone"]) for r in rows if d10(r["phone"])})
    line = tw.load(tw.LINE_CACHE)
    todo = [n for n in nums if not line.get(n, {}).get("line_type") and line.get(n, {}).get("http") != 200]
    print(f"line: {len(todo)} to fetch"); tw.run_line(todo) if todo else None
    tw.run_cnam(nums)
    line = tw.load(tw.LINE_CACHE); cnam = tw.load(tw.CNAM_CACHE)

    fm = json.load(open(FM)) if os.path.exists(FM) else {}
    for r in rows:
        if r["company"] not in fm:
            fm[r["company"]] = fmcsa_lookup(r["company"], r["city"])
    json.dump(fm, open(FM, "w"), indent=1)
    print("fmcsa matched:", sum(1 for v in fm.values() if v))

    out = []
    for r in rows:
        phone = d10(r["phone"]); lt = line.get(phone, {}); cn = cnam.get(phone, {})
        c = fm.get(r["company"]) or {}
        owner, title = clean_owner(r["owner_name"], r["owner_title"])
        alts = [d10(c.get("phone", "")), d10(c.get("cell_phone", ""))]
        alt = next((a for a in alts if a and a != phone), "")
        ALEK = {"independent_lender", "renewal_window", "lapsing_12m", "signal_A", "signal_B", "phone_single_source", "bank_financed_ok_per_user"}
        alek_sig = [f for f in r["fit_flag"].split(";") if f and f in ALEK]
        flags = [f for f in r["fit_flag"].split(";") if f and f not in ALEK]
        if r["ucc_lender_class"] == "bank":
            flags.append("bank_lien")
        if r["ucc_status"] == "historical":
            flags.append("lien_lapsed")
        if not owner:
            flags.append("no_owner_name")
        if cn.get("caller_name") and classify(cn["caller_name"], r["company"], owner) == "other":
            flags.append("cnam_mismatch")
        if lt.get("valid") is False and lt.get("http") == 200:
            flags.append("phone_invalid")
        pu = c.get("power_units", "")
        if pu and int(pu) > 7:
            flags.append(f"units_{pu}")
        if pu == "1":
            flags.append("single_unit")
        if not owner and r["company"] in CNAM_OWNER:
            owner, title = CNAM_OWNER[r["company"]], "Caller-ID name (unverified)"
            flags.remove("no_owner_name")
        tib = f"since {c['add_date'][:4]} (FMCSA)" if c.get("add_date") else ""
        seen = set(); flags = [f for f in flags if not (f in seen or seen.add(f))]
        out.append({
            # David's template, in his order
            "Company": r["company"], "DBA": "", "LP": "", "GM": "", "Last Contact": "",
            "SIC Code": "", "Industry": LANE_INDUSTRY.get(r["lane"], r["lane"]),
            "TIB": tib, "Name": owner, "Job Title": title,
            "Phone": fmt(phone), "Phone II": fmt(alt) or fmt(d10(r["phone_alt"])),
            "Website": r["website"], "Email": r["email"].lower(), "Comments": "",
            "Noise Level": "", "Time Zone": "CST",
            "City": r["city"].split("/")[0].split("(")[0].strip(), "State": "WI",
            # ours
            "line_type": lt.get("line_type", ""), "phone_valid": "" if lt.get("http") != 200 else str(bool(lt.get("valid"))).lower(),
            "cnam_name": cn.get("caller_name", ""), "cnam_match": classify(cn.get("caller_name", ""), r["company"], owner),
            "lane": r["lane"], "equipment_ticket": r["equipment_ticket_tier"].split("--")[0].strip(),
            "ucc_secured_party": r["ucc_secured_party"], "ucc_lender_class": r["ucc_lender_class"],
            "ucc_filing_date": r["ucc_filing_date"], "lien_age_months": r["lien_age_months"], "ucc_status": r["ucc_status"],
            "power_units": pu, "total_drivers": c.get("total_drivers", ""), "usdot": c.get("dot_number", ""),
            "fit_flag": ";".join(flags), "alek_signal": ";".join(alek_sig),
            "lender_note": r["lender_note"],
        })
    with open(OUT, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=out[0].keys()); w.writeheader(); w.writerows(out)
    from collections import Counter
    print(OUT, len(out))
    for k in ("line_type", "cnam_match", "lane", "ucc_lender_class"):
        print(f"  {k}:", dict(Counter(o[k] for o in out)))
    print("  flags:", Counter(fl for o in out for fl in o["fit_flag"].split(";") if fl))
    print("  clean rows:", sum(1 for o in out if not o["fit_flag"]), " owner named:", sum(1 for o in out if o["Name"]), " fmcsa:", sum(1 for o in out if o["usdot"]))
    for o in out:
        print(f"  {o['Company'][:28]:28}|{o['Name'][:18]:18}|{o['line_type']:12}|{o['cnam_match']:7}|{o['cnam_name'][:15]:15}|{o['lane']:8}|pu={o['power_units']:>2}|{o['fit_flag']}")


if __name__ == "__main__":
    main()
