#!/usr/bin/env python3
"""C5d: attach CNAM (caller name) to a finished sheet and score what it says.

Twilio Lookup's caller_name package returns the name the line is registered to. That is
the one pre-dial check on the question every contact vendor gets wrong and that David is
currently answering by hand: does this number belong to this company?

Three columns are added:

  cnam_name   the registered name, verbatim. CNAM is capped at 15 characters by the
              carrier standard, so names arrive truncated ("TUESDAY STONEST").
  cnam_type   BUSINESS / CONSUMER / UNDETERMINED as reported. Recorded but not trusted:
              in this batch real businesses come back CONSUMER routinely, because the
              flag reflects the billing account, not the use.
  cnam_match  our reading of the name, one of:
                company   matches the company name
                owner     matches the owner we named, first and last
                surname   same surname, different first name -- the spouse or son on the
                          account. Still the right household and, in this ICP, usually
                          the right person to ask for.
                other     a real name that matches neither. The row to be suspicious of.
                none      no name on file. Not evidence either way.

CNAM is attached AFTER selection and is never used to filter. If we dropped the rows it
disagrees with, we could not measure whether it predicts David's verdicts -- which is the
whole point of buying it. Compare cnam_match against his right_poc column when the sheet
comes back.

Usage: .venv/bin/python scripts/c5d_cnam.py out/FILE.csv [more.csv ...]
"""
import csv, json, os, re, sys

from rapidfuzz import fuzz

CACHE = "data/work/cnam_cache.json"
CNAM_LEN = 15  # carrier standard; every comparison is made against this prefix

# tokens that carry no identity: they appear in half the corpus
GENERIC = {
    "INC", "LLC", "LC", "CORP", "CORPORATION", "COMPANY", "CO", "THE", "AND", "OF", "LTD",
    "LP", "PA", "PLLC", "ENTERPRISES", "ENTERPRISE", "GROUP", "HOLDINGS", "SERVICES",
    "SERVICE", "SVC", "SVCS", "SOLUTIONS", "SYSTEMS", "SYS", "FLORIDA", "FL", "SONS", "SON",
    "BROTHERS", "BROS",
}
# carrier placeholders that are not a name at all
PLACEHOLDER = re.compile(r"^(LINE|OFFICE|WIRELESS|CALLER|UNKNOWN|TOLL ?FREE|CELLULAR|"
                         r"LANDLINE|BUSINESS|CONSUMER|VOIP|PHONE)\b", re.I)
SUFFIX_TOKENS = {"JR", "SR", "II", "III", "IV"}


def norm(s):
    return re.sub(r"\s+", " ", re.sub(r"[^A-Z0-9]+", " ", (s or "").upper())).strip()


def toks(s):
    return [t for t in norm(s).split() if len(t) >= 3 and t not in GENERIC]


def skel(t):
    """Consonant skeleton, so a vowel-dropped CNAM abbreviation still matches:
    CNSTR <- CONSTRUCTION, SVC <- SERVICE, MCHNRY <- MACHINERY."""
    return t[0] + re.sub(r"[AEIOU]", "", t[1:]) if t else t


def tok_hit(a, b):
    """One token matches another, allowing CNAM truncation and abbreviation."""
    if a == b:
        return True
    if len(a) >= 4 and len(b) >= 4 and (a.startswith(b) or b.startswith(a)):
        return True
    sa, sb = skel(a), skel(b)
    if len(sa) >= 3 and len(sb) >= 3 and (sa.startswith(sb) or sb.startswith(sa)):
        return True
    return len(a) >= 5 and len(b) >= 5 and fuzz.ratio(a, b) >= 88


def squash(s):
    return re.sub(r"[^A-Z0-9]", "", (s or "").upper())


def person_parts(owner):
    """Given and family name candidates, dropping initials and generational suffixes.
    Hyphenated and compound surnames contribute every part, since CNAM may carry any."""
    parts = [p for p in norm(owner).split() if len(p) >= 2 and p not in SUFFIX_TOKENS]
    if not parts:
        return "", []
    return parts[0], parts[1:] or [parts[0]]


def classify(cnam, company, owner):
    """Owner is tested before company: when a company is named after its owner, the
    person is the more precise reading of the same fact."""
    if not cnam.strip() or PLACEHOLDER.match(cnam.strip()):
        return "none"
    c_toks, co_toks = toks(cnam), toks(company)
    first, surnames = person_parts(owner)

    given = bool(first) and any(tok_hit(a, first) for a in c_toks)
    family = any(tok_hit(a, sn) for a in c_toks for sn in surnames)
    if given and family:
        return "owner"

    if co_toks and any(tok_hit(a, b) for a in c_toks for b in co_toks):
        return "company"
    if fuzz.partial_ratio(squash(cnam), squash(company)) >= 90 and len(squash(cnam)) >= 8:
        return "company"

    if family:
        return "surname"
    if given and len(c_toks) == 1:
        return "owner"
    return "other"


def d10(p):
    x = "".join(ch for ch in (p or "") if ch.isdigit())
    return x[-10:] if len(x) >= 10 else ""


def main():
    cache = json.load(open(CACHE))
    for path in sys.argv[1:]:
        rows = list(csv.DictReader(open(path)))
        cols = list(rows[0].keys())
        for c in ("cnam_name", "cnam_type", "cnam_match"):
            if c not in cols:
                cols.insert(cols.index("phone_alt") + 1 if "phone_alt" in cols else len(cols), c)
        for r in rows:
            v = cache.get(d10(r["phone"]), {})
            name = (v.get("caller_name") or "").strip()
            r["cnam_name"] = name
            r["cnam_type"] = v.get("caller_type") or ""
            r["cnam_match"] = classify(name, r["company"], r.get("owner_name", ""))
        tmp = path + ".tmp"
        with open(tmp, "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=cols)
            w.writeheader(); w.writerows(rows)
        os.replace(tmp, path)

        from collections import Counter
        print(f"\n{path}: {len(rows)} rows")
        print("  cnam_match:", dict(Counter(r["cnam_match"] for r in rows)))
        print("  cnam_type :", dict(Counter(r["cnam_type"] for r in rows)))
        for r in rows:
            print(f"  {r['cnam_match']:8} | {r['company'][:34]:34} | {r.get('owner_name','')[:20]:20} | {r['line_type']:12} | {r['cnam_name']}")


if __name__ == "__main__":
    main()
