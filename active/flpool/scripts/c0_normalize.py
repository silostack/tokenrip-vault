#!/usr/bin/env python3
"""C0 prep: give raw.ucc_fl and raw.fmcsa_fl_api the same join key everything else has.

Normalization must come from scripts/normalize.py, not a re-implementation in SQL --
a divergence here silently changes every downstream join.
"""
import csv, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from normalize import normalize_name, normalize_city

DB = "flpool"


def psql(sql, db=DB):
    r = subprocess.run(["psql", "-d", db, "-v", "ON_ERROR_STOP=1", "-Atc", sql],
                       capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"psql failed:\n{sql[:300]}\n{r.stderr}")
    return r.stdout.strip()


def copy_out(sql, path):
    r = subprocess.run(["psql", "-d", DB, "-v", "ON_ERROR_STOP=1",
                        "-c", f"\\copy ({sql}) to '{path}' csv header"],
                       capture_output=True, text=True)
    if r.returncode:
        sys.exit(r.stderr)


def copy_in(table, cols, path):
    ddl = ", ".join('"%s" text' % c for c in cols)
    psql("drop table if exists %s; create table %s (%s);" % (table, table, ddl))
    r = subprocess.run(["psql", "-d", DB, "-v", "ON_ERROR_STOP=1",
                        "-c", f"\\copy {table} from '{path}' csv header"],
                       capture_output=True, text=True)
    if r.returncode:
        sys.exit(r.stderr)


def split_city_state(s):
    """'ORLANDO, FL' -> 'ORLANDO'. Tolerates missing comma and stray state."""
    s = (s or "").strip()
    if "," in s:
        s = s.rsplit(",", 1)[0]
    return s


def main():
    # ---- UCC ---------------------------------------------------------------
    src, dst = "data/work/_ucc_src.csv", "data/work/ucc_norm.csv"
    copy_out("select * from raw.ucc_fl", src)
    with open(src, newline="") as f:
        rd = csv.DictReader(f)
        cols = rd.fieldnames + ["name_norm", "city_norm", "join_key", "debtor_city"]
        with open(dst, "w", newline="") as g:
            w = csv.DictWriter(g, fieldnames=cols)
            w.writeheader()
            n = 0
            for r in rd:
                # Prefer the joined company record's name/city; fall back to raw filing text.
                name = r["company_name"] or r["debtor"]
                city = r["city"] or split_city_state(r["debtor_city_state"])
                nm, ct = normalize_name(name), normalize_city(city)
                r.update(name_norm=nm, city_norm=ct, join_key=nm + "|" + ct,
                         debtor_city=city)
                w.writerow(r)
                n += 1
    copy_in("work.ucc", cols, dst)
    print(f"work.ucc            {n:>8,}")

    # ---- FMCSA -------------------------------------------------------------
    keep = ["dot_number", "legal_name", "dba_name", "phy_street", "phy_city", "phy_state",
            "phy_zip", "phy_cnty", "status_code", "carrier_operation", "power_units",
            "truck_units", "fleetsize", "owntruck", "owntract", "owntrail", "add_date",
            "mcs150_date", "mcs150_mileage", "phone", "cell_phone", "email_address",
            "company_officer_1", "company_officer_2", "business_org_desc", "total_drivers",
            "crgo_construct", "crgo_garbage", "crgo_drivetow", "crgo_machlrg",
            "crgo_waterwell", "crgo_oilfield", "crgo_drybulk", "crgo_bldgmat",
            "crgo_logpole", "crgo_liqgas", "crgo_genfreight", "crgo_utility"]
    src, dst = "data/work/_fm_src.csv", "data/work/fmcsa_norm.csv"
    copy_out("select " + ", ".join(f'"{c}"' for c in keep) + " from raw.fmcsa_fl_api", src)
    with open(src, newline="") as f:
        rd = csv.DictReader(f)
        cols = rd.fieldnames + ["name_norm", "city_norm", "join_key",
                                "dba_norm", "dba_join_key"]
        with open(dst, "w", newline="") as g:
            w = csv.DictWriter(g, fieldnames=cols)
            w.writeheader()
            n = 0
            for r in rd:
                nm = normalize_name(r["legal_name"])
                ct = normalize_city(r["phy_city"])
                dn = normalize_name(r["dba_name"]) if r["dba_name"] else ""
                r.update(name_norm=nm, city_norm=ct, join_key=nm + "|" + ct,
                         dba_norm=dn, dba_join_key=(dn + "|" + ct) if dn else "")
                w.writerow(r)
                n += 1
    copy_in("work.fmcsa", cols, dst)
    print(f"work.fmcsa          {n:>8,}")

    for s in ["create index if not exists ix_wucc_join on work.ucc (join_key)",
              "create index if not exists ix_wucc_name on work.ucc (name_norm)",
              "create index if not exists ix_wfm_join  on work.fmcsa (join_key)",
              "create index if not exists ix_wfm_dba   on work.fmcsa (dba_join_key)",
              "create index if not exists ix_wfm_name  on work.fmcsa (name_norm)"]:
        psql(s)
    psql("analyze")
    for f in (src, "data/work/_ucc_src.csv"):
        if os.path.exists(f):
            os.remove(f)
    print("indexed.")


if __name__ == "__main__":
    main()
