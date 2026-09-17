#!/usr/bin/env python3
"""A5: the one normalization rule every step shares.

    join key = normalize_name(name) || '|' || normalize_city(city)

Used to join Sunbiz <-> UCC <-> FMCSA <-> FDEP <-> DBPR <-> exclusions. Any change
here changes every join, so it is tested rather than trusted.
"""
import argparse, csv, re, sys

# Order matters: longer forms first so CORPORATION is not eaten as CORP.
_SUFFIXES = [
    "INCORPORATED", "CORPORATION", "COMPANY", "PLLC", "PLC", "LLP", "LLC",
    "L L C", "CORP", "INC", "LTD", "LP", "PA", "CO", "L C", "LC",
]
_SUFFIX_RE = re.compile(r"\s+(?:" + "|".join(s.replace(" ", r"\s+") for s in _SUFFIXES) + r")$")
_DBA_RE = re.compile(r"\s+(?:DBA|D B A)\s+.*$")
# Apostrophes are deleted (SHELLY'S -> SHELLYS); all other punctuation becomes a
# space (4 C ' S -> 4 C S, TANK, INC -> TANK INC).
_APOS_RE = re.compile(r"[\u2019'`]")
_PUNCT_RE = re.compile(r"[^A-Z0-9 ]+")
_WS_RE = re.compile(r"\s+")
_CITY_FL_RE = re.compile(r"\s*,?\s*(?:FL|FLA|FLORIDA)$")


def normalize_name(s):
    if s is None:
        return ""
    s = str(s).upper().strip().strip('"\'').strip()
    s = s.replace("&", " AND ")
    s = _APOS_RE.sub("", s)
    s = _PUNCT_RE.sub(" ", s)
    s = _WS_RE.sub(" ", s).strip()
    s = _DBA_RE.sub("", s).strip()
    if s.startswith("THE "):
        s = s[4:].strip()
    # Iterate: "HOMES LLC INC" -> "HOMES". Never reduce to nothing.
    while True:
        stripped = _SUFFIX_RE.sub("", s).strip()
        if stripped == s or not stripped:
            break
        s = stripped
    return _WS_RE.sub(" ", s).strip()


def normalize_city(s):
    if s is None:
        return ""
    s = str(s).upper().strip().strip('"\'').strip()
    s = _WS_RE.sub(" ", s).strip()
    s = _CITY_FL_RE.sub("", s).strip()
    return _WS_RE.sub(" ", s).strip()


def join_key(name, city=None):
    return normalize_name(name) + "|" + normalize_city(city)


TESTS = [
    # the five specified in the playbook
    ('"SHELLY\'S SEPTIC TANK, INC. "', "SHELLYS SEPTIC TANK"),
    ("J & H HOMES LLC", "J AND H HOMES"),
    ("4 C ' S TRUCKING & EXCAVATION INC", "4 C S TRUCKING AND EXCAVATION"),
    ("THE DUTRA GROUP", "DUTRA GROUP"),
    ("BOWDEN'S EXCAVATING AND SEPTIC, LLC", "BOWDENS EXCAVATING AND SEPTIC"),
    # DBA
    ("PALMETTO HAULING INC DBA PALMETTO ROLL OFF", "PALMETTO HAULING"),
    # L.L.C. with periods
    ("GATOR VAC SERVICES, L.L.C.", "GATOR VAC SERVICES"),
    # CO. with period
    ("TAMPA PAVING CO.", "TAMPA PAVING"),
    # trailing spaces
    ("  SUNSTATE WRECKER SERVICE   ", "SUNSTATE WRECKER SERVICE"),
    # double internal spaces
    ("BIG  BEND   SEPTIC", "BIG BEND SEPTIC"),
    # L C form seen in real Sunbiz records
    ("J & S ENTERPRISES, L.C.", "J AND S ENTERPRISES"),
    # stacked suffix
    ("OKEECHOBEE DRILLING COMPANY, INC.", "OKEECHOBEE DRILLING"),
]

CITY_TESTS = [
    ('"ZELLWOOD "', "ZELLWOOD"),
    ("Winter  Haven, FL", "WINTER HAVEN"),
    ("   st augustine ", "ST AUGUSTINE"),
]


def run_tests():
    bad = 0
    for src, want in TESTS:
        got = normalize_name(src)
        ok = got == want
        bad += not ok
        print(f"{'ok  ' if ok else 'FAIL'} normalize_name({src!r}) -> {got!r}"
              + ("" if ok else f"  want {want!r}"))
    for src, want in CITY_TESTS:
        got = normalize_city(src)
        ok = got == want
        bad += not ok
        print(f"{'ok  ' if ok else 'FAIL'} normalize_city({src!r}) -> {got!r}"
              + ("" if ok else f"  want {want!r}"))
    print(f"\n{len(TESTS) + len(CITY_TESTS) - bad}/{len(TESTS) + len(CITY_TESTS)} passed")
    return bad


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("csv_in", nargs="?")
    ap.add_argument("--name-col")
    ap.add_argument("--city-col")
    ap.add_argument("--out")
    ap.add_argument("--test", action="store_true")
    a = ap.parse_args()
    if a.test or not a.csv_in:
        sys.exit(1 if run_tests() else 0)
    with open(a.csv_in, newline="") as f:
        rd = csv.DictReader(f)
        cols = rd.fieldnames + ["name_norm", "city_norm", "join_key"]
        with open(a.out, "w", newline="") as g:
            w = csv.DictWriter(g, fieldnames=cols)
            w.writeheader()
            n = 0
            for row in rd:
                nm = normalize_name(row.get(a.name_col))
                ct = normalize_city(row.get(a.city_col)) if a.city_col else ""
                row.update(name_norm=nm, city_norm=ct, join_key=nm + "|" + ct)
                w.writerow(row)
                n += 1
    print(f"wrote {a.out}: {n} rows")


if __name__ == "__main__":
    main()
