#!/usr/bin/env python3
"""B7: David's April vendor list -> exclusions + a labelled baseline.

Sheet 1  the list Providence was sold and called.
Sheet 2  DUPLICATES  - rows David's team flagged, WITH his verbatim failure comments.
Sheet 3  EXISTING    - rows that matched Providence's existing book.

All three are exclusions. Sheet 2's comments are also the vendor-baseline labels the
batch-1 reach rate gets compared against, so they are preserved verbatim.
"""
import csv, os, sys
import openpyxl

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from normalize import normalize_name, normalize_city

SRC = "data/raw/exclusions/WIP Apr 7 list update Apr 13.xlsx"
OUT = "data/work/exclusions_david.csv"
BASE = "data/work/vendor_baseline_david.csv"

COLS = ["source_list", "org_name", "name_norm", "city", "city_norm", "join_key",
        "first_name", "last_name", "title", "email", "phone", "phone_norm",
        "url", "domain", "state", "comments", "pcf_added_phone", "comments2"]


def norm_phone(p):
    d = "".join(c for c in str(p or "") if c.isdigit())
    if len(d) == 11 and d.startswith("1"):
        d = d[1:]
    return d if len(d) == 10 else ""


def domain_of(u):
    u = str(u or "").strip().lower()
    for p in ("https://", "http://", "www."):
        if u.startswith(p):
            u = u[len(p):]
    return u.split("/")[0].strip()


def cell(row, hdr, *names):
    for n in names:
        for i, h in enumerate(hdr):
            if h and str(h).strip().lower() == n.lower():
                v = row[i]
                return "" if v is None else str(v).strip()
    return ""


def main():
    wb = openpyxl.load_workbook(SRC, read_only=True, data_only=True)
    rows, base = [], []
    for ws in wb.worksheets:
        it = ws.iter_rows(values_only=True)
        hdr = [str(c).strip() if c is not None else "" for c in next(it)]
        for r in it:
            org = cell(r, hdr, "Organization Name")
            if not org:
                continue
            city = cell(r, hdr, "City")
            nm, ct = normalize_name(org), normalize_city(city)
            rec = {
                "source_list": f"david_apr:{ws.title[:24]}", "org_name": org,
                "name_norm": nm, "city": city, "city_norm": ct, "join_key": nm + "|" + ct,
                "first_name": cell(r, hdr, "First Name"), "last_name": cell(r, hdr, "Last Name"),
                "title": cell(r, hdr, "Title"), "email": cell(r, hdr, "Email"),
                "phone": cell(r, hdr, "Phone"), "phone_norm": norm_phone(cell(r, hdr, "Phone")),
                "url": cell(r, hdr, "URL"), "domain": domain_of(cell(r, hdr, "URL")),
                "state": cell(r, hdr, "State"),
                "comments": cell(r, hdr, "Comments"),
                "pcf_added_phone": cell(r, hdr, "Added by PCF"),
                "comments2": cell(r, hdr, "Comments 2") or (r[11] if len(r) > 11 and ws.title == "DUPLICATES" and r[11] else ""),
            }
            rec = {k: ("" if v is None else str(v).strip()) for k, v in rec.items()}
            rows.append(rec)
            if rec["comments"] or rec["comments2"]:
                base.append(rec)

    os.makedirs("data/work", exist_ok=True)
    for path, data in ((OUT, rows), (BASE, base)):
        with open(path, "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=COLS)
            w.writeheader()
            w.writerows(data)
        print(f"wrote {path}: {len(data)} rows")

    from collections import Counter
    print(f"\nby sheet: {Counter(r['source_list'] for r in rows)}")
    print(f"FL rows: {sum(1 for r in rows if r['state'].upper() in ('FL', 'FLORIDA'))}")
    print(f"distinct companies: {len({r['join_key'] for r in rows})}")
    print("\n--- David's verbatim failure comments (vendor baseline) ---")
    for c, n in Counter(r["comments"] for r in base if r["comments"]).most_common(20):
        print(f"  {n:>3}  {c[:88]}")


if __name__ == "__main__":
    main()
