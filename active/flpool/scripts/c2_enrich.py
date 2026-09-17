#!/usr/bin/env python3
"""C2: equipment evidence and web contact for the enrichment batch.

Equipment evidence comes from the registry the company itself filed with, because
only ~5% of in-box Florida owner-operators have a website at all. A cargo class on an
MCS-150, a DBPR licence class, or an FDEP septic authorization is a verbatim
government-filed statement about what the company operates -- stronger provenance than
scraped marketing copy, and available for every row rather than one in twenty.

Places is still called on every row: it supplies a second phone for cross-checking
against FMCSA, a website where one exists, and businessStatus, which catches companies
that are closed permanently. Places (New) Text Search returns phone/website/status
directly under a field mask, so no separate Details call is needed.
"""
import csv, json, os, subprocess, sys, threading, time
from concurrent.futures import ThreadPoolExecutor
import requests
from rapidfuzz import fuzz
from dotenv import load_dotenv

load_dotenv()
KEY = os.environ["GOOGLE_PLACES_API_KEY"]
DB = "flpool"
OUTDIR = "data/work/web"
os.makedirs(OUTDIR, exist_ok=True)

MASK = ("places.id,places.displayName,places.formattedAddress,places.shortFormattedAddress,"
        "places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,"
        "places.businessStatus,places.primaryType,places.types,places.userRatingCount,"
        "places.location")

DBPR_OCC = {
    "CUC": "Certified Underground Utility & Excavation Contractor",
    "CGC": "Certified General Contractor", "CBC": "Certified Building Contractor",
    "CRC": "Certified Residential Contractor", "CFC": "Certified Plumbing Contractor",
    "CMC": "Certified Mechanical Contractor", "CAC": "Certified Air Conditioning Contractor",
    "CCC": "Certified Roofing Contractor", "CPC": "Certified Pool/Spa Contractor",
    "SCC": "Certified Specialty Contractor", "QB": "Qualified Business",
}
CARGO = {
    "crgo_construct": "Construction materials", "crgo_garbage": "Garbage/refuse",
    "crgo_drivetow": "Driveaway/towaway", "crgo_machlrg": "Machinery, large objects",
    "crgo_waterwell": "Water well", "crgo_oilfield": "Oilfield equipment",
    "crgo_drybulk": "Dry bulk", "crgo_bldgmat": "Building materials",
    "crgo_logpole": "Logs, poles, lumber",
}

_lock = threading.Lock()
counters = {"places_calls": 0, "places_hit": 0, "places_rejected": 0, "errors": 0}


def registry_evidence(r, cargo_flags):
    """Return (quote, url, source, equipment_class, confidence)."""
    if r["in_fmcsa"] == "t" and r.get("dot_number"):
        classes = [CARGO[k] for k in CARGO if str(cargo_flags.get(k, "")).strip() not in ("", "N", "0")]
        pu = (r.get("fm_power_units") or "").strip()
        own = (r.get("owntruck") or "").strip()
        d = (r.get("mcs150_date") or "")[:10]
        bits = []
        if classes:
            bits.append("cargo classified " + ", ".join(classes[:3]))
        if pu and pu != "0":
            bits.append(f"{pu} power units")
        if own and own != "0":
            bits.append(f"{own} trucks owned")
        if bits:
            q = f"FMCSA MCS-150 filed {d or 'n/a'}: " + "; ".join(bits) + "."
            url = ("https://safer.fmcsa.dot.gov/query.asp?searchtype=ANY&query_type="
                   f"queryCarrierSnapshot&query_param=USDOT&query_string={r['dot_number']}")
            return q, url, "fmcsa_mcs150", r["lane"], "HIGH" if classes else "MED"
    if r.get("fdep_auth"):
        q = (f"Florida DEP septic business authorization {r['fdep_auth']}, "
             f"active through {r.get('fdep_expiry') or 'n/a'}.")
        return (q, "https://prodapps.dep.state.fl.us/ocp/reports/accesspublic/OSP/B_public_license_data",
                "fdep_septic", "PORTABLE_SANITATION", "HIGH")
    if r.get("dbpr_license"):
        occ = DBPR_OCC.get(r.get("dbpr_occupation", ""), r.get("dbpr_occupation", ""))
        q = (f"Florida DBPR licence {r.get('dbpr_occupation','')}{r['dbpr_license']}, {occ}, "
             f"active through {r.get('dbpr_expiry') or 'n/a'}"
             + (f"; qualifier {r['dbpr_qualifier']}." if r.get("dbpr_qualifier") else "."))
        return (q, "https://www2.myfloridalicense.com/construction-industry/public-records/",
                "dbpr_license", r["lane"], "HIGH" if r.get("dbpr_occupation") == "CUC" else "MED")
    return "", "", "", r["lane"], "NONE"


def places_lookup(name, city, name_norm, zipcode):
    with _lock:
        counters["places_calls"] += 1
    try:
        resp = requests.post(
            "https://places.googleapis.com/v1/places:searchText",
            headers={"Content-Type": "application/json", "X-Goog-Api-Key": KEY,
                     "X-Goog-FieldMask": MASK},
            json={"textQuery": f"{name} {city} FL", "maxResultCount": 3,
                  "regionCode": "US"}, timeout=25)
        if resp.status_code == 403:
            raise SystemExit("Places returned 403 (key not enabled) -- stopping per playbook.")
        data = resp.json()
    except SystemExit:
        raise
    except Exception as e:
        with _lock:
            counters["errors"] += 1
        return None, {"error": str(e)}
    for p in data.get("places", []):
        pname = (p.get("displayName") or {}).get("text", "")
        score = fuzz.token_set_ratio(name_norm.upper(), pname.upper())
        addr = (p.get("formattedAddress") or "").upper()
        geo_ok = (city.upper() in addr) or (zipcode and zipcode[:5] in addr)
        if score >= 80 and geo_ok:
            p["_match_score"] = score
            with _lock:
                counters["places_hit"] += 1
            return p, data
    with _lock:
        counters["places_rejected"] += 1
    return None, data


def main():
    subprocess.run(["psql", "-d", DB, "-q", "-c",
                    "\\copy (select * from work.c2_batch) to 'data/work/c2_batch.csv' csv header"],
                   check=True)
    rows = list(csv.DictReader(open("data/work/c2_batch.csv", newline="")))
    print(f"{len(rows)} rows to enrich")

    cargo_by_dot = {}
    subprocess.run(["psql", "-d", DB, "-q", "-c",
                    "\\copy (select dot_number," + ",".join(CARGO) +
                    " from work.fmcsa) to 'data/work/_cargo.csv' csv header"], check=True)
    for c in csv.DictReader(open("data/work/_cargo.csv", newline="")):
        cargo_by_dot[c["dot_number"]] = c

    def work(r):
        key = r["join_key"].replace("/", "_")[:120]
        cargo = cargo_by_dot.get(r.get("dot_number") or "", {})
        q, url, src, cls, conf = registry_evidence(r, cargo)
        r["equipment_quote"] = q
        r["equipment_url"] = url
        r["equipment_source"] = src
        r["equipment_class"] = cls
        r["equipment_confidence"] = conf
        name = r["company"] or r["anchor_name"]
        p, raw = places_lookup(name, r["prin_city"] or r["city_norm"], r["name_norm"],
                               r.get("prin_zip", ""))
        with open(f"{OUTDIR}/{key}.json", "w") as f:
            json.dump({"row": r["join_key"], "places_raw": raw}, f)
        if p:
            r["places_found"] = "true"
            r["places_id"] = p.get("id", "")
            r["places_name"] = (p.get("displayName") or {}).get("text", "")
            r["places_phone"] = p.get("nationalPhoneNumber", "")
            r["places_website"] = p.get("websiteUri", "")
            r["business_status"] = p.get("businessStatus", "")
            r["places_address"] = p.get("formattedAddress", "")
            r["places_types"] = ",".join(p.get("types", [])[:6])
            r["places_ratings"] = str(p.get("userRatingCount", "") or "")
            r["places_match_score"] = str(p.get("_match_score", ""))
        else:
            for k in ("places_found", "places_id", "places_name", "places_phone",
                      "places_website", "business_status", "places_address",
                      "places_types", "places_ratings", "places_match_score"):
                r[k] = "false" if k == "places_found" else ""
        return r

    t0 = time.time()
    with ThreadPoolExecutor(max_workers=8) as ex:
        out = list(ex.map(work, rows))

    cols = list(out[0].keys())
    with open("out/FL_POOL_v2_EQUIPMENT.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        w.writerows(out)
    print(f"wrote out/FL_POOL_v2_EQUIPMENT.csv ({len(out)} rows) in {time.time()-t0:.0f}s")
    print("counters:", counters)


if __name__ == "__main__":
    main()
