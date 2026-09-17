#!/usr/bin/env python3
"""C3 finalize: rebuild row-level phone verdicts from the cached Twilio results.

No API calls. The first pass conflated two very different states: a number Twilio
checked and rejected, and a number Twilio never checked because the trial account hit
its quota (HTTP 429, error 60624). Calling the second 'invalid' would have thrown away
good rows and, worse, would have misreported our own data quality to David.

Three states are now distinct:
  verified_valid    Twilio confirmed the line
  verified_invalid  Twilio rejected it
  unverified        never checked -- trial quota exhausted
"""
import csv, os, json, re

FL_AC = {"239","305","321","352","386","407","448","561","656","689","727","754",
         "772","786","813","850","863","904","941","954"}
EXTRA_RESTRICT = re.compile(
    r"\b(BAPTIST|CATHOLIC|METHODIST|LUTHERAN|PRESBYTER|EPISCOP|SYNAGOG|MOSQUE|TEMPLE"
    r"|ASSOCIATION|ASSN|SOCIETY|INSTITUTE|COUNCIL|AUTHORITY|FIRE DISTRICT|BOARD OF"
    r"|UNIVERSITY|COLLEGE|HOSPITAL|CHARIT|NONPROFIT|NON PROFIT|MISSION|OUTREACH"
    r"|FELLOWSHIP|CONGREGAT|PARISH|DIOCESE|HOUSING AUTHOR|MUNICIPAL)\b")

cache = json.load(open("data/work/twilio_cache.json"))


def state(n):
    v = cache.get(n)
    if not v:
        return "unverified"
    if v.get("valid"):
        return "verified_valid"
    if v.get("line_type") or v.get("http") in (200, 404):
        return "verified_invalid"
    return "unverified"


def d10(p):
    d = "".join(c for c in (p or "") if c.isdigit())
    if len(d) == 11 and d[0] == "1":
        d = d[1:]
    return d if len(d) == 10 else ""


def fmt(n):
    return f"({n[:3]}) {n[3:6]}-{n[6:]}" if n else ""


rows = list(csv.DictReader(open("out/FL_POOL_v3_CONTACT.csv", newline="")))
for r in rows:
    fm, pl = d10(r["fmcsa_phone"]), d10(r["places_phone"])
    r["phone_corroborated"] = "true" if (fm and pl and fm == pl) else "false"
    # FMCSA first by decision; prefer a verified line, then an unverified one.
    order = [(fm, "fmcsa_mcs150"), (pl, "google_places")]
    chosen, src = "", ""
    for want in ("verified_valid", "unverified"):
        for n, s in order:
            if n and state(n) == want:
                chosen, src = n, s
                break
        if chosen:
            break
    if not chosen:
        for n, s in order:
            if n:
                chosen, src = n, s
                break
    st = state(chosen) if chosen else "none"
    v = cache.get(chosen, {})
    r["phone"] = fmt(chosen)
    r["phone_e164"] = f"+1{chosen}" if chosen else ""
    r["phone_source"] = src
    r["phone_status"] = st
    r["phone_valid"] = "true" if st == "verified_valid" else "false"
    r["line_type"] = v.get("line_type", "")
    r["carrier"] = v.get("carrier", "")
    r["shared_line"] = "true" if v.get("line_type") in ("tollFree", "nonFixedVoip") else "false"
    r["phone_area_code_ok"] = "true" if chosen[:3] in FL_AC else "false"
    alt = pl if (chosen == fm and pl) else (fm if (chosen == pl and fm) else "")
    r["phone_alt"] = fmt(alt)
    r["phone_alt_status"] = state(alt) if alt else ""

    why = []
    if EXTRA_RESTRICT.search((r["company"] or "").upper()):
        why.append("restricted_org_type")
    if r.get("business_status") == "CLOSED_PERMANENTLY":
        why.append("closed_permanently")
    if not chosen:
        why.append("no_phone")
    elif st == "verified_invalid":
        why.append("phone_invalid")
    elif r["phone_area_code_ok"] != "true":
        why.append("phone_area_code_not_fl")
    r["c3_exclusion"] = ";".join(why)
    # Soft flag: usable, but not first choice for the 50 David calls.
    r["phone_unverified"] = "true" if st == "unverified" else "false"

cols = list(rows[0].keys())
for r in rows:
    for k in r:
        if k not in cols:
            cols.append(k)
for r in rows:
    for k in cols:
        r.setdefault(k, "")
tmp_out = "out/FL_POOL_v3_CONTACT.csv.tmp"
with open(tmp_out, "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=cols)
    w.writeheader()
    w.writerows(rows)
os.replace(tmp_out, "out/FL_POOL_v3_CONTACT.csv")

from collections import Counter
print("phone_status:", dict(Counter(r["phone_status"] for r in rows)))
print("c3_exclusion:", dict(Counter(r["c3_exclusion"] or "(clean)" for r in rows)))
ok = [r for r in rows if not r["c3_exclusion"]]
print(f"\nclean rows: {len(ok)}")
print("  of which phone verified valid:", sum(1 for r in ok if r["phone_status"] == "verified_valid"))
print("  of which phone unverified   :", sum(1 for r in ok if r["phone_status"] == "unverified"))
print("  by tier:", dict(Counter(r["tier"] for r in ok)))
