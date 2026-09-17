#!/usr/bin/env python3
"""B4/B5: normalize and load the FDEP septic and DBPR construction extracts.

DBPR note: CONSTRUCTIONLICENSE_1.csv is the authoritative extract (256,903 rows,
101,590 expiring 2028) but ships with NO header. CONSTRUCTIONLICENSE_2.csv is a
truncated 65,000-row export that stops mid-alphabet at 'OVERBEY' and carries stale
2020 expirations -- it is used ONLY as the decoder ring for _1's column names and
occupation codes, never as data. Both files are latin-1, not UTF-8.

Two DBPR anchor paths fall out of this:
  business  -- QB rows (Occupation='QB') carry a company name in the Licensee column,
               and non-QB rows carry one in 'Doing Business As'.
  qualifier -- the licensee person on a trade licence (CUC/CGC/CFC/...), joined later
               to raw.sunbiz_officers on last+first name to reach their company.
"""
import csv, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from normalize import normalize_name, normalize_city

DB = "flpool"

# Column order verified against CONSTRUCTIONLICENSE_2.csv's header row.
DBPR_COLS = ["board", "occupation", "licensee", "dba", "class", "addr1", "addr2",
             "addr3", "city", "state", "zip", "county_code", "license_number",
             "primary_status", "secondary_status", "date_licensed", "effective_date",
             "expiration_date", "military", "x19", "alt_license_number", "x21"]

# Lane mapping for the trade classes Providence finances.
LANE = {"CUC": "A_DIRT", "CGC": "B", "CBC": "B", "CFC": "CFC_PLUMB", "RF": "E",
        "CMC": "E", "CAC": "E", "CCC": "E", "CPC": "E", "CRC": "B", "SCC": "E"}


def psql(sql):
    r = subprocess.run(["psql", "-d", DB, "-v", "ON_ERROR_STOP=1", "-Atc", sql],
                       capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"psql failed:\n{sql[:300]}\n{r.stderr}")
    return r.stdout.strip()


def load(table, cols, rows):
    tmp = f"data/work/_load_{table.split('.')[-1]}.csv"
    with open(tmp, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        w.writerows(rows)
    ddl = ", ".join('"%s" text' % c for c in cols)
    psql("drop table if exists %s; create table %s (%s);" % (table, table, ddl))
    r = subprocess.run(["psql", "-d", DB, "-v", "ON_ERROR_STOP=1",
                        "-c", f"\\copy {table} from '{tmp}' csv header"],
                       capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"COPY {table} failed:\n{r.stderr}")
    print(f"{table:26s} {len(rows):>8,} rows")


def clean(d):
    return {k: (v or "").strip() for k, v in d.items()}


def main():
    # ---- FDEP septic business authorizations -------------------------------
    rows = []
    with open("data/raw/fdep_septic_business.csv", newline="", encoding="latin-1") as f:
        for r in csv.DictReader(f):
            r = {(k or "").strip(): v for k, v in r.items()}
            r = clean(r)
            nm, ct = normalize_name(r.get("Name")), normalize_city(r.get("Business City"))
            rows.append({
                "auth_type": r.get("Type"), "business_name": r.get("Name"),
                "name_norm": nm, "auth_number": r.get("Authorization Number"),
                "expiration_date": r.get("Expiration Date"),
                "contractor_registration": r.get("Contractor Registration"),
                "addr1": r.get("Business Address1"), "city": r.get("Business City"),
                "city_norm": ct, "state": r.get("Business State"),
                "zip": r.get("Business Zip"), "county": r.get("Business County"),
                "email": r.get("Business Email"), "status": r.get("Status"),
                "join_key": nm + "|" + ct, "lane": "A_VAC",
            })
    load("raw.fdep_business", list(rows[0].keys()), rows)

    # ---- FDEP individual septic contractors --------------------------------
    rows = []
    with open("data/raw/fdep_septic_contractors.csv", newline="", encoding="latin-1") as f:
        for r in csv.DictReader(f):
            r = {(k or "").strip(): v for k, v in r.items()}
            r = clean(r)
            rows.append({
                "cert_type": r.get("Type"), "last_name": r.get("Last Name"),
                "first_name": r.get("First Name"), "middle_name": r.get("Middle Name"),
                "addr1": r.get("Address"), "city": r.get("City"),
                "city_norm": normalize_city(r.get("City")), "state": r.get("State"),
                "zip": r.get("Zip"), "license_number": r.get("License Number"),
                "expiration_date": r.get("Expiration Date"), "status": r.get("Status"),
            })
    load("raw.fdep_contractor", list(rows[0].keys()), rows)

    # ---- DBPR construction licences ----------------------------------------
    out, kept, skipped = [], 0, 0
    with open("data/raw/dbpr/CONSTRUCTIONLICENSE_1.csv", newline="", encoding="latin-1") as f:
        for raw in csv.reader(f):
            if len(raw) < 22:
                skipped += 1
                continue
            d = dict(zip(DBPR_COLS, [c.strip() for c in raw]))
            occ, dba = d["occupation"], d["dba"]
            # A DBA of literally "INDIVIDUAL" is a placeholder, not a business.
            is_biz_name = dba and dba.upper().rstrip(".") != "INDIVIDUAL"
            if occ == "QB":
                biz, src = d["licensee"], "qb"
            elif is_biz_name:
                biz, src = dba, "dba"
            else:
                biz, src = "", "qualifier_only"
            nm = normalize_name(biz) if biz else ""
            ct = normalize_city(d["city"])
            d.update(business_name=biz, business_source=src, name_norm=nm,
                     city_norm=ct, join_key=(nm + "|" + ct) if nm else "",
                     lane=LANE.get(occ, ""),
                     active=("Y" if d["secondary_status"] == "A" else "N"))
            out.append(d)
            kept += 1
    cols = DBPR_COLS + ["business_name", "business_source", "name_norm", "city_norm",
                        "join_key", "lane", "active"]
    load("raw.dbpr_fl", cols, out)
    if skipped:
        print(f"  (skipped {skipped} short rows)")

    for s in ["create index if not exists ix_fdb_join on raw.fdep_business (join_key)",
              "create index if not exists ix_dbp_join on raw.dbpr_fl (join_key)",
              "create index if not exists ix_dbp_occ  on raw.dbpr_fl (occupation)",
              "create index if not exists ix_fdc_name on raw.fdep_contractor (last_name, first_name)"]:
        psql(s)
    psql("analyze")
    print("indexed.")


if __name__ == "__main__":
    main()
