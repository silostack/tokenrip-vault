#!/usr/bin/env python3
"""C1 prep: one exclusion table with a join key, from both prod and David's list.

Handing Providence a company it has already touched is, per the playbook, the single
outcome that damages trust -- so this matches on three keys (domain, phone, name+city)
and keeps the source label so every exclusion is explainable.
"""
import csv, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from normalize import normalize_name, normalize_city

DB = "flpool"
COLS = ["source_list", "touched_on", "company_id", "name", "name_norm", "city",
        "city_norm", "join_key", "domain", "phone_norm"]


def norm_domain(u):
    u = (u or "").strip().lower()
    for p in ("https://", "http://", "www."):
        if u.startswith(p):
            u = u[len(p):]
    return u.split("/")[0].strip()


def norm_phone(p):
    d = "".join(c for c in str(p or "") if c.isdigit())
    if len(d) == 11 and d.startswith("1"):
        d = d[1:]
    return d if len(d) == 10 else ""


rows = []
with open("data/raw/exclusions/prod_touched.csv", newline="") as f:
    for r in csv.DictReader(f):
        nm, ct = normalize_name(r["name"]), normalize_city(r["city"])
        rows.append({"source_list": r["source_list"], "touched_on": r["touched_on"],
                     "company_id": r["company_id"], "name": r["name"], "name_norm": nm,
                     "city": r["city"], "city_norm": ct, "join_key": nm + "|" + ct,
                     "domain": norm_domain(r["domain"] or r["website"]),
                     "phone_norm": ""})

with open("data/work/exclusions_david.csv", newline="") as f:
    for r in csv.DictReader(f):
        rows.append({"source_list": r["source_list"], "touched_on": "2026-04-13",
                     "company_id": "", "name": r["org_name"], "name_norm": r["name_norm"],
                     "city": r["city"], "city_norm": r["city_norm"],
                     "join_key": r["join_key"], "domain": r["domain"],
                     "phone_norm": r["phone_norm"]})

tmp = "data/work/exclusions_all.csv"
with open(tmp, "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=COLS)
    w.writeheader()
    w.writerows(rows)

ddl = ", ".join('"%s" text' % c for c in COLS)
subprocess.run(["psql", "-d", DB, "-q", "-v", "ON_ERROR_STOP=1", "-c",
                f"drop table if exists raw.exclusions; create table raw.exclusions ({ddl});"],
               check=True)
subprocess.run(["psql", "-d", DB, "-q", "-v", "ON_ERROR_STOP=1", "-c",
                f"\\copy raw.exclusions from '{tmp}' csv header"], check=True)
for s in ["create index ix_ex_join on raw.exclusions (join_key)",
          "create index ix_ex_dom  on raw.exclusions (domain)",
          "create index ix_ex_ph   on raw.exclusions (phone_norm)"]:
    subprocess.run(["psql", "-d", DB, "-q", "-c", s], check=True)
print(f"raw.exclusions {len(rows):,} rows")
