#!/usr/bin/env python3
"""B2: parse the Sunbiz quarterly corporate file (cordata) into CSV.

Layout: dos.sunbiz.org/data-definitions/cor.html, 1440 chars/record (+CR),
verified field-by-field against real records on 2026-09-03.

Two outputs:
  data/work/sunbiz_fl.csv        one row per corporation, ALL FL rows (status A and I).
                                 Inactive rows are kept so C1 can log 'sunbiz inactive'
                                 as an exclusion_reason rather than silently dropping.
  data/work/sunbiz_officers.csv  long form, ACTIVE rows only -- owners only ever come
                                 from active companies, and this keeps the file sane.

Officer NAME is itself fixed-width when officer type is 'P' (person):
  LAST(20) FIRST(14) MIDDLE(8). Type 'C' means the officer is an entity; do not split.

The owner-selection rule is deliberately NOT applied here. Observed title codes are
composite (P, PD, PSD, PST, PSTD, PTD, DP, MGRM, AMBR, Pres, Mana, ...) and mixed case;
picking the owner is cheap to redo in SQL and expensive to redo over 18GB.
"""
import csv, os, sys
from datetime import date
from multiprocessing import Pool

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from normalize import normalize_name, normalize_city

SRC_DIR = "data/sunbiz/cordata"
WORK = "data/work"
TODAY = date.today()

# (start_pos_1based, length)
F = {
    "doc_number": (1, 12), "name": (13, 192), "status": (205, 1), "filing_type": (206, 15),
    "prin_addr1": (221, 42), "prin_addr2": (263, 42), "prin_city": (305, 28),
    "prin_state": (333, 2), "prin_zip": (335, 10), "prin_country": (345, 2),
    "mail_addr1": (347, 42), "mail_city": (431, 28), "mail_state": (459, 2),
    "mail_zip": (461, 10), "file_date": (473, 8), "fei": (481, 14),
    "gt6_officers": (495, 1), "last_tx_date": (496, 8), "state_country": (504, 2),
    "report_year1": (506, 4), "report_year2": (519, 4), "report_year3": (532, 4),
    "ra_name": (545, 42), "ra_type": (587, 1), "ra_city": (630, 28), "ra_state": (658, 2),
}
OFF_BASE = 669          # officer 1 title
OFF_STRIDE = 128        # title(4) type(1) name(42) addr(42) city(28) state(2) zip(9)

COMPANY_COLS = [
    "doc_number", "name", "name_norm", "status", "filing_type", "fei",
    "file_date", "tib_years", "prin_addr1", "prin_addr2", "prin_city", "prin_city_norm",
    "prin_state", "prin_zip", "prin_country", "mail_addr1", "mail_city", "mail_state",
    "mail_zip", "last_tx_date", "gt6_officers", "report_year1", "report_year2",
    "report_year3", "ra_name", "ra_type", "ra_city", "ra_state",
    "officer1_title", "officer1_name", "officer2_title", "officer2_name",
    "officer3_title", "officer3_name", "officer4_title", "officer4_name",
    "officer5_title", "officer5_name", "officer6_title", "officer6_name",
    "officer_count", "join_key",
]
OFFICER_COLS = [
    "doc_number", "seq", "title", "otype", "raw_name",
    "last_name", "first_name", "middle_name", "display_name", "off_city", "off_state",
]


def g(r, key):
    s, l = F[key]
    return r[s - 1:s - 1 + l].strip()


def iso(d):
    """MMDDYYYY -> YYYY-MM-DD, tolerating junk."""
    if len(d) != 8 or not d.isdigit():
        return ""
    mm, dd, yyyy = d[0:2], d[2:4], d[4:8]
    if not ("1700" < yyyy < "2100") or not ("01" <= mm <= "12"):
        return ""
    return f"{yyyy}-{mm}-{dd}"


def titlecase(s):
    return " ".join(w.capitalize() if w.isalpha() else w for w in s.split())


def parse_one(path):
    idx = os.path.basename(path).replace("cordata", "").replace(".txt", "")
    cpath = f"{WORK}/parts/sunbiz_fl_{idx}.csv"
    opath = f"{WORK}/parts/sunbiz_officers_{idx}.csv"
    os.makedirs(f"{WORK}/parts", exist_ok=True)
    stats = {"records": 0, "fl": 0, "active": 0, "inactive": 0, "officers": 0, "badlen": 0}

    with open(path, "r", encoding="latin-1") as f, \
         open(cpath, "w", newline="") as cf, open(opath, "w", newline="") as of:
        cw = csv.DictWriter(cf, fieldnames=COMPANY_COLS)
        ow = csv.DictWriter(of, fieldnames=OFFICER_COLS)
        cw.writeheader()
        ow.writeheader()

        for line in f:
            r = line.rstrip("\r\n")
            stats["records"] += 1
            if len(r) < 1436:
                stats["badlen"] += 1
                continue

            prin_state, mail_state = g(r, "prin_state"), g(r, "mail_state")
            if prin_state != "FL" and mail_state != "FL":
                continue
            stats["fl"] += 1

            status = g(r, "status")
            active = status == "A"
            stats["active" if active else "inactive"] += 1

            doc = g(r, "doc_number")
            name = g(r, "name")
            fdate = iso(g(r, "file_date"))
            tib = ""
            if fdate:
                fy, fm, fd = int(fdate[0:4]), int(fdate[5:7]), int(fdate[8:10])
                days = (TODAY - date(fy, fm, min(fd, 28))).days
                tib = f"{days / 365.25:.1f}"

            city = g(r, "prin_city") or g(r, "mail_city")
            nname = normalize_name(name)
            ncity = normalize_city(city)

            row = {c: "" for c in COMPANY_COLS}
            for k in F:
                if k in row:
                    row[k] = g(r, k)
            row.update(
                name=name, name_norm=nname, prin_city_norm=ncity,
                file_date=fdate, tib_years=tib,
                last_tx_date=iso(g(r, "last_tx_date")),
                join_key=nname + "|" + ncity,
            )

            ocount = 0
            for i in range(6):
                b = OFF_BASE + i * OFF_STRIDE
                title = r[b - 1:b + 3].strip()
                otype = r[b + 3:b + 4].strip()
                raw = r[b + 4:b + 46].rstrip()
                if not title and not raw.strip():
                    continue
                ocount += 1
                row[f"officer{ocount}_title"] = title
                if otype == "P":
                    last, first, mid = raw[0:20].strip(), raw[20:34].strip(), raw[34:].strip()
                    disp = titlecase(f"{first} {last}".strip())
                else:
                    last = first = mid = ""
                    disp = raw.strip()
                row[f"officer{ocount}_name"] = disp
                if active:
                    ow.writerow({
                        "doc_number": doc, "seq": ocount, "title": title, "otype": otype,
                        "raw_name": raw.strip(), "last_name": last, "first_name": first,
                        "middle_name": mid, "display_name": disp,
                        "off_city": r[b + 88:b + 116].strip(),
                        "off_state": r[b + 116:b + 118].strip(),
                    })
                    stats["officers"] += 1
            row["officer_count"] = ocount
            cw.writerow(row)

    print(f"  {os.path.basename(path)}: {stats}", flush=True)
    return stats


def main():
    files = sorted(f"{SRC_DIR}/cordata{i}.txt" for i in range(10))
    missing = [f for f in files if not os.path.exists(f)]
    if missing:
        sys.exit(f"missing: {missing}")
    with Pool(10) as p:
        allstats = p.map(parse_one, files)

    tot = {}
    for s in allstats:
        for k, v in s.items():
            tot[k] = tot.get(k, 0) + v

    for name, pat in (("sunbiz_fl", "sunbiz_fl"), ("sunbiz_officers", "sunbiz_officers")):
        out = f"{WORK}/{name}.csv"
        with open(out, "w") as o:
            for i in range(10):
                part = f"{WORK}/parts/{pat}_{i}.csv"
                with open(part) as pf:
                    if i:
                        pf.readline()
                    for chunk in iter(lambda: pf.read(1 << 22), ""):
                        o.write(chunk)
        print(f"wrote {out}")

    print("\nTOTALS:", tot)
    print(f"active/inactive split: {tot['active']} A / {tot['inactive']} I")


if __name__ == "__main__":
    main()
