#!/usr/bin/env python3
"""C5c: batch 1 v2 -- the 50 rebuilt on David's two post-batch rules, one split.

Why a v2: David had not started dialing when he sent two rules (2026-09-05) that flag
35 of the 50 in v1: more than 7 pieces of equipment, and a prior lien with a captive
lender. Since his time is the scarce input, the 50 should be rows he believes are in
the box, and the phone should measure only what a phone can measure. His priors get
tested at scale over email, not ten rows at a time.

Design (pre-registered):
  universe   FMCSA-anchored (same phone provenance on every row: the MCS-150 filing),
             2-7 power units, no captive lien in our corpus, no finance officer,
             TIB >= 2, lanes A_VAC / A_DIRT / B / C, Monroe County capped, persona
             exclusions from c5b, Twilio-verified phone only.
  split      25 LIEN  : has a lien in our corpus from an equipment-finance INDEPENDENT
                        -- no OEM captive, no bank or credit union -- i.e. a borrower
                        who has already paid an independent's rate,
                        preferring liens inside the modelled refinance window.
             25 NOLIEN: no lien in our corpus.
  predicts   reach and right_poc should not differ (same phone source);
             in_market should be higher in LIEN. If it is not, the lien overlay is not
             worth its cost and the pool is the registries. If it is, "proven
             independent-finance borrower, term maturing" becomes the primary segment.
  recorded, not balanced: line_type, phone_corroborated, county_tier, ripe_basis, tier.

Only Twilio-verified rows ship. Run c3_retry_phones.py -> c3_finalize.py -> c4_signals.py
first if a segment comes up short; this script reports the shortfall.
"""
import csv, os, re, sys
from collections import Counter

sys.path.insert(0, os.path.dirname(__file__))
import c5b_fix as fx  # owner-name rebuild, lane overrides, persona exclusions, signal text

SRC = "out/FL_POOL_v4_SIGNALS.csv"
DATE = "2026-09-07"
OUT = f"out/FL_PHONE_TEST_50_v2_{DATE}.csv"
OUTB = f"out/BENCH_v2_{DATE}.csv"
SEG_QUOTA = {"LIEN": 25, "NOLIEN": 25}
LANE_TARGET = {"A_VAC": 7, "A_DIRT": 7, "B": 6, "C": 5}
MONROE_CAP = {"LIEN": 2, "NOLIEN": 2}
UNITS_MAX = 7
BENCH_N = 15

# David's seven, plus the other OEM captives we know of. `david_named` is kept in the
# feature so his list can be tested separately from ours later.
CAPTIVE = re.compile(
    r"KOMATSU|JOHN DEERE|DEERE|CATERPILLAR|CAT FINANCIAL|KUBOTA|TOYOTA INDUSTRIES|VOLVO|DAIMLER"
    r"|CNH|CASE CREDIT|NEW HOLLAND|JCB|AGCO|DLL|DE LAGE LANDEN|PACCAR|NAVISTAR|BOBCAT|DOOSAN"
    r"|HITACHI|MACK FINANCIAL|FREIGHTLINER|ISUZU FINANCE|FORD MOTOR CREDIT|GM FINANCIAL|ALLY",
    re.I)
DAVID_SEVEN = re.compile(r"KOMATSU|JOHN DEERE|DEERE|CATERPILLAR|KUBOTA|TOYOTA INDUSTRIES|VOLVO|DAIMLER", re.I)

# Banks and credit unions. David named only OEM captives, so this exclusion is ours, not
# his: a borrower who got a community-bank or credit-union lien has demonstrated it can
# borrow at bank rates, which is the same reason a captive lien is bad news for a
# broker selling lease-to-own well above them. Matched on the secured party's name
# because prod's lender_class is populated inconsistently -- the same secured party
# appears both classified and blank (see TODO 2026-09-07).
BANKLIKE = re.compile(
    r"\bCREDIT UNION\b|\bBANCORP\b|\bSAVINGS BANK\b|\bNATIONAL ASSOCIATION\b|\bN\.?A\.?$"
    r"|\bBANK\b(?!.*\b(EQUIPMENT|VENDOR|LEASING|FINANCE COMPANY)\b)", re.I)
# ...except these are equipment-finance houses that merely carry "bank" in the name.
EF_HOUSE = re.compile(r"STEARNS BANK|GREATAMERICA|WELLS FARGO (VENDOR|EQUIPMENT)|"
                      r"BLUE BRIDGE|WESTERN EQUIPMENT|NORTH MILL|BEACON FUNDING|"
                      r"FINANCIAL PACIFIC|NAVITAS|COMMERCIAL CREDIT GROUP|OAKMONT|"
                      r"LEAF CAPITAL|DE LAGE LANDEN|MITSUBISHI HC|DEUTSCHE LEASING", re.I)


def bank_lien(r):
    """True when the row's lien is from a bank or credit union rather than an
    equipment-finance independent."""
    sp = r.get("secured_party") or ""
    if not sp or r.get("in_ucc") != "t":
        return False
    if EF_HOUSE.search(sp):
        return False
    return bool(BANKLIKE.search(sp) or r.get("lender_class") == "bank")

COLS = [
    "company", "dba", "owner_name", "owner_title", "owner_source", "phone", "phone_source",
    "line_type", "phone_corroborated", "phone_alt", "email", "email_source", "city", "county",
    "county_tier", "lane", "segment", "tier", "power_units", "total_drivers",
    "equipment_quote", "equipment_url", "equipment_source", "tib_years", "last_annual_report",
    "ucc_secured_party", "ucc_lender_class", "ucc_filing_date", "ucc_ripe_date",
    "top_signal_text", "signals_present", "selection_reason", "website",
]


def num(x, d=None):
    try:
        return float(str(x).strip())
    except Exception:
        return d


def captive(r):
    sp = r.get("secured_party") or ""
    return bool(r.get("in_ucc") == "t" and (CAPTIVE.search(sp) or r.get("lender_class") == "captive"))


def eligible(r):
    if r["phone_status"] != "verified_valid":
        return False
    if r["in_fmcsa"] != "t" or r["phone_source"] != "fmcsa_mcs150":
        return False
    pu = num(r["fm_power_units"])
    if pu is None or pu < 2 or pu > UNITS_MAX:
        return False
    if (num(r["tib_years"], 0) or 0) < fx.TIB_FLOOR:
        return False
    lane = fx.lane_of(r)
    if lane not in LANE_TARGET:
        return False
    if r["company"] in fx.EXCLUDE_FROM_50 and not fx.EXCLUDE_FROM_50[r["company"]].startswith("Monroe cap"):
        return False
    if fx.NOT_IN_BOX_NAME.search(r["company"]):
        return False
    if captive(r) or bank_lien(r):
        return False
    return bool(fx.fix_owner(r)[0])


def segment(r):
    return "LIEN" if r["in_ucc"] == "t" else "NOLIEN"


def sort_key(r):
    return (
        0 if r["phone_corroborated"] == "true" else 1,
        0 if r["line_type"] == "mobile" else 1,
        0 if r["ripe_basis"] == "in_window_now" else 1,
        -(num(r["signals_present"], 0) or 0),
        0 if 5 <= (num(r["tib_years"], 0) or 0) <= 15 else 1,
        0 if r["sunbiz_match_method"] == "name_city" else 1,
        r["company"],
    )


def row(r, seg):
    owner, title, src = fx.fix_owner(r)
    lane = fx.lane_of(r)
    lien = r["in_ucc"] == "t"
    reason = (f"{seg.lower()} segment; lane {lane}; {r['county_tier'].lower().replace('_', ' ')} county; "
              f"{int(num(r['fm_power_units']))} power units; phone from the MCS-150 filing"
              + ("; phone corroborated by a second source" if r["phone_corroborated"] == "true" else "")
              + (f"; lien from {r['secured_party'].title()} ({r['lender_class'] or 'independent'})" if lien else "; no lien in our corpus")
              + ".")
    return {
        "company": r["company"],
        "dba": r.get("places_name", "") if r.get("places_name", "").upper() != r["company"].upper() else "",
        "owner_name": owner, "owner_title": title, "owner_source": src,
        "phone": r["phone"], "phone_source": r["phone_source"], "line_type": r["line_type"],
        "phone_corroborated": r["phone_corroborated"],
        "phone_alt": r["phone_alt"] if r["phone_alt"] and r["phone_alt"] != r["phone"] else "",
        "email": r["email"], "email_source": r["email_source"],
        "city": r["prin_city"] or r["city_norm"], "county": r["county"], "county_tier": r["county_tier"],
        "lane": lane, "segment": seg, "tier": r["tier"],
        "power_units": r["fm_power_units"], "total_drivers": r.get("total_drivers", ""),
        "equipment_quote": r["equipment_quote"], "equipment_url": r["equipment_url"],
        "equipment_source": r["equipment_source"],
        "tib_years": r["tib_years"], "last_annual_report": r["last_annual_report"],
        "ucc_secured_party": r["secured_party"] if lien else "",
        "ucc_lender_class": (r["lender_class"] or "independent") if lien else "",
        "ucc_filing_date": (r["filing_date"] or "")[:10] if lien else "",
        "ucc_ripe_date": "" if r["ripe_basis"] == "in_window_now" else (r["ripe_date"] or "")[:10],
        "top_signal_text": fx.signal_text(r), "signals_present": r["signals_present"],
        "selection_reason": reason,
        "website": "" if r["company"] in fx.BLANK_WEBSITE else r.get("website_final", ""),
    }


def pick(pool, seg, quota, used, owners):
    out, lanes, monroe = [], Counter(), 0
    def take(r):
        nonlocal monroe
        out.append(r); used.add(r["company"]); owners.add(fx.fix_owner(r)[0])
        lanes[fx.lane_of(r)] += 1
        if r["county"] == "MONROE":
            monroe += 1
    def ok(r):
        if r["company"] in used or fx.fix_owner(r)[0] in owners:
            return False
        if r["county"] == "MONROE" and monroe >= MONROE_CAP[seg]:
            return False
        return True
    for r in pool:                      # pass 1: honour lane targets
        if len(out) >= quota: break
        if ok(r) and lanes[fx.lane_of(r)] < LANE_TARGET[fx.lane_of(r)]:
            take(r)
    for r in pool:                      # pass 2: fill regardless of lane
        if len(out) >= quota: break
        if ok(r):
            take(r)
    return out


def main():
    allrows = [r for r in csv.DictReader(open(SRC, newline="")) if not r["c3_exclusion"]]
    seen, uniq = set(), []
    for r in allrows:
        if r["company"] not in seen:
            seen.add(r["company"]); uniq.append(r)
    elig = sorted([r for r in uniq if eligible(r)], key=sort_key)
    pools = {s: [r for r in elig if segment(r) == s] for s in SEG_QUOTA}
    print("eligible verified rows by segment:", {s: len(p) for s, p in pools.items()})

    used, owners, picked = set(), set(), {}
    for seg, quota in SEG_QUOTA.items():
        picked[seg] = pick(pools[seg], seg, quota, used, owners)
        short = quota - len(picked[seg])
        print(f"  {seg:7} {len(picked[seg])}/{quota}" + (f"  SHORT BY {short}: verify more numbers (c3_retry_phones.py) and re-run" if short else ""))

    # what the unverified pool could add, so the Twilio decision is informed
    unver = [r for r in uniq if r["phone_status"] != "verified_valid"]
    could = Counter(segment(r) for r in unver if all([
        r["in_fmcsa"] == "t", 2 <= (num(r["fm_power_units"], 0) or 0) <= UNITS_MAX,
        (num(r["tib_years"], 0) or 0) >= fx.TIB_FLOOR, not captive(r),
        fx.lane_of(r) in LANE_TARGET, not fx.NOT_IN_BOX_NAME.search(r["company"])]))
    print("  unverified rows that would qualify if their phone checks out:", dict(could))

    final = [row(r, s) for s in SEG_QUOTA for r in picked[s]]
    bench = [row(r, segment(r)) for r in elig if r["company"] not in used][:BENCH_N]
    for path, data in ((OUT, final), (OUTB, bench)):
        tmp = path + ".tmp"
        with open(tmp, "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=COLS); w.writeheader(); w.writerows(data)
        os.replace(tmp, path)
        print(f"wrote {path}: {len(data)} rows")

    print("\ncomposition of the v2 batch:")
    for k in ("segment", "lane", "county_tier", "line_type", "tier", "ucc_lender_class", "signals_present", "last_annual_report"):
        print(f"  {k:18} {dict(sorted(Counter(r[k] for r in final).items()))}")
    print(f"  {'county top':18} {Counter(r['county'] for r in final).most_common(6)}")
    print(f"  corroborated {sum(1 for r in final if r['phone_corroborated']=='true')} · email {sum(1 for r in final if r['email'])} · website {sum(1 for r in final if r['website'])} · overlap with v1: {len({r['company'] for r in final} & {r['company'] for r in csv.DictReader(open('out/FL_PHONE_TEST_50_2026-09-04.csv'))})}")
    pu = sorted(int(num(r["power_units"])) for r in final)
    print(f"  power units min {pu[0]} median {pu[len(pu)//2]} max {pu[-1]}")
    print(f"  LIEN in window now: {sum(1 for r in final if r['segment']=='LIEN' and not r['ucc_ripe_date'])} of {sum(1 for r in final if r['segment']=='LIEN')}")
    print("\nrows for the row-read:")
    for r in final:
        print(f"  {r['segment']:6} {r['lane']:6} | {r['company'][:36]:36} | {r['owner_name'][:22]:22} | {r['line_type']:12} | {r['city'][:14]:14} {r['county'][:9]:9} | pu={r['power_units']:>2} dr={r['total_drivers']:>2} tib={r['tib_years']:>5} | {(r['ucc_secured_party'] or '-')[:28]:28} | {r['equipment_quote'][:50]}")


if __name__ == "__main__":
    main()
