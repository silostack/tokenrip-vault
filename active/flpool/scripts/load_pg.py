#!/usr/bin/env python3
"""Load every acquired file into flpool as raw.* text tables, then index join keys.
Re-runnable: each table is dropped and recreated.
"""
import csv, os, subprocess, sys, time

DB = "flpool"
LOADS = [
    ("raw.sunbiz_fl",       "data/work/sunbiz_fl.csv"),
    ("raw.sunbiz_officers", "data/work/sunbiz_officers.csv"),
    ("raw.sunbiz_aliases",  "data/work/sunbiz_aliases.csv"),
    ("raw.fmcsa_fl_api",    "data/raw/fmcsa_fl_api.csv"),
    ("raw.ucc_fl",          "data/raw/ucc_fl.csv"),
    ("raw.exclusions_prod", "data/raw/exclusions/prod_touched.csv"),
]


def psql(sql):
    r = subprocess.run(["psql", "-d", DB, "-v", "ON_ERROR_STOP=1", "-Atc", sql],
                       capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"psql failed:\n{sql[:400]}\n{r.stderr}")
    return r.stdout.strip()


def main():
    for table, path in LOADS:
        if not os.path.exists(path):
            print(f"SKIP {table}: {path} not present")
            continue
        with open(path, newline="") as f:
            hdr = next(csv.reader(f))
        # Postgres folds unquoted identifiers to lower case; quote to keep them exact.
        cols = ", ".join(f'"{c}" text' for c in hdr)
        psql(f"drop table if exists {table}; create table {table} ({cols});")
        t0 = time.time()
        r = subprocess.run(
            ["psql", "-d", DB, "-v", "ON_ERROR_STOP=1",
             "-c", f"\\copy {table} from '{path}' csv header"],
            capture_output=True, text=True)
        if r.returncode:
            sys.exit(f"COPY failed for {table}:\n{r.stderr}")
        n = psql(f"select count(*) from {table}")
        print(f"{table:24s} {int(n):>10,} rows  {len(hdr):>3} cols  {time.time()-t0:5.1f}s")

    print("\nindexing...")
    for stmt in [
        "create index if not exists ix_sb_join on raw.sunbiz_fl (join_key)",
        "create index if not exists ix_sb_name on raw.sunbiz_fl (name_norm)",
        "create index if not exists ix_sb_doc  on raw.sunbiz_fl (doc_number)",
        "create index if not exists ix_sb_stat on raw.sunbiz_fl (status)",
        "create index if not exists ix_of_doc  on raw.sunbiz_officers (doc_number)",
        "create index if not exists ix_al_doc  on raw.sunbiz_aliases (doc_number)",
        "create index if not exists ix_fm_dot  on raw.fmcsa_fl_api (dot_number)",
        "create index if not exists ix_ucc_deb on raw.ucc_fl (debtor)",
    ]:
        psql(stmt)
        print("  " + stmt.split(" on ")[0].replace("create index if not exists ", ""))
    psql("analyze")
    print("done")


if __name__ == "__main__":
    main()
