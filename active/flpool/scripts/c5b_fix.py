#!/usr/bin/env python3
"""C5b: post-run row-read fixes, applied on top of C5's selection.

Run after c5_select.py. Rewrites the 50, the bench and the continuation pool from
FL_POOL_v4_SIGNALS.csv with these fixes (2026-09-04 row read):

  1. owner_name rebuilt from owner_name_raw: keeps middle initials and suffixes
     ("JOHN  R SARTOR JR" -> "John R. Sartor Jr."), un-glues first+middle
     ("Jammielavon" -> "Jammie Lavon"), handles "LAST, FIRST M." order, and falls
     back to the DOT-filed officer when the state officer is a holding company.
  2. phone_alt blanked when it equals phone (phone_corroborated already says so).
  3. ucc_ripe_date blanked where ripe_basis == in_window_now (that date is the
     evaluation date of the prod dueness model, not a prediction) and the signal
     text reworded to say what the model actually claims.
  4. Hand exclusions from the 50/bench: out-of-persona rows, one duplicate owner,
     two lane mis-tags, plus a Monroe County cap (5 in the 50, 3 on the bench),
     a 2-year time-in-business floor, and no electricians/roofers in A_DIRT.
  5. One known wrong website (prod entity-resolution miss) blanked.
  6. De-duplicated by company (one carrier had two DOT numbers in v4).

Replacements are hand-picked from Twilio-verified rows so the arms stay 30/10/10.
"""
import csv, os, re
from collections import Counter

SRC = "out/FL_POOL_v4_SIGNALS.csv"
DATE = "2026-09-04"
OUT50 = f"out/FL_PHONE_TEST_50_{DATE}.csv"
OUTB = "out/BENCH_25.csv"
OUTC = "out/CONTINUATION_POOL.csv"
TIER_ORDER = {"RURAL": 0, "SMALL_METRO": 1, "BIG_METRO": 2, "UNKNOWN": 3}
ARMS = {"intersection": 30, "anchor_only": 10, "ucc_only": 10}
MONROE_CAP_50, MONROE_CAP_BENCH = 5, 3
TIB_FLOOR = 2.0

SHEET_COLS = [
    "company", "dba", "owner_name", "owner_title", "owner_source", "phone",
    "phone_source", "line_type", "phone_corroborated", "phone_alt", "email",
    "email_source", "city", "county", "county_tier", "lane", "tier",
    "equipment_class", "equipment_quote", "equipment_url", "equipment_source",
    "fleet_units_stated", "power_units", "tib_years", "last_annual_report",
    "ucc_secured_party", "ucc_filing_date", "ucc_ripe_date", "top_signal_text",
    "signals_present", "selection_reason", "website",
    "reached", "right_poc", "phone_ok", "email_ok", "in_market", "buying_what",
    "buying_when", "corrected_phone", "corrected_poc", "notes",
]

# --- hand decisions from the 2026-09-04 row read -----------------------------------
EXCLUDE_FROM_50 = {
    "OCEAN REEF CLUB, INC.": "persona: private resort club, not an owner-operator",
    "FARMERS COOPERATIVE INC.": "persona: 79-year-old agricultural co-op; email is a different person",
    "GILCHRIST BUILDING SUPPLY, INC.": "persona: hardware store (Do It Best); hauls supplies, does not run dirt equipment",
    "HARRISON 3 ENTERPRISES INC.": "duplicate owner: William Harrison also owns Harrison Logging (kept)",
    "WHITTINGTON ELECTRIC, INC.": "lane: electrician (SIC 1731, not targeted) tagged A_DIRT by cargo flag",
    "KEY IRON WORKS, INC.": "lane: structural steel (SIC 1791, not targeted) tagged A_DIRT by cargo flag; Monroe",
    "THE BEACH HOUSE GARDEN CENTER, INC.": "persona: garden center tagged C by cargo flag; Monroe",
    "FOUR STAR RENTALS, INC.": "persona: rental store; Monroe",
    "NIVAR GROUP BUILDERS, LLC": "Monroe cap (general contractor, kept in continuation)",
    "TROPICAL POOLS DESIGN AND CONSTRUCTION L.L.C.": "Monroe cap (replaced by a non-Keys pool contractor)",
    "KEY WEST TRANSFER STATION & HAULING SERVICE, INC.": "Monroe cap (ucc_only; replaced)",
    # v2 row read 2026-09-05: retail / processing businesses that carry trucks but are not
    # equipment operators in Providence's sense
    "BYRD'S MOBILE HOME SALES, INC.": "persona: mobile-home dealer tagged A_DIRT by cargo flag",
    "SUWANNEE VALLEY FEEDS, LLC": "persona: feed store tagged B by dry-bulk cargo flag",
    "B & G SEED PROCESSORS, INC.": "persona: seed processor tagged B by cargo flag",
}
# replacements, in order, by arm. All Twilio-verified, non-Monroe, TIB >= 2.
REPLACE = {
    "intersection": [
        "DURAMAX HAULING INC.", "CLEMONS FIELD SERVICES, INC.", "MOORE'S WELL DRILLING, INC.",
        "LAMAR BROTHERS, LLC", "S&T TRACTOR WORX LLC", "ORANGE STATE TOWING & RECOVERY LLC",
        "BIG GREEN BINS, LLC", "PARAGON POOLS OF NORTH FLORIDA LLC",
    ],
    "anchor_only": ["EARTHWORX, LLC", "LUCAS BARDEN LOGGING, INC."],
    "ucc_only": ["MIKE MINCEYS LAND CLEARING AND SITE PREP LLC"],
}
NAME_OVERRIDES = {  # LAST FIRST with no comma; not inferable from the record
    "MIKE MINCEYS LAND CLEARING AND SITE PREP LLC": "Michael Mincey",
}
# Lane correction by trade name.
#
# Cargo flags outrank a name regex in C0, and that is right when the name is generic:
# a declaration to a regulator beats a naming convention. But a carrier ticks every box
# it might ever haul, so a land-clearing outfit that also hauls debris gets the garbage
# flag and lands in the roll-off lane. When the company's own trade name contains an
# unambiguous lane word, the name is the better statement of what the business does.
# Applied only where name and cargo disagree; a generic name changes nothing.
NAME_LANE = [
    (re.compile(r"\bCONCRETE\b.*\bPUMP", re.I), "B"),
    (re.compile(r"\bPUMPING\b.*\bCONCRETE\b", re.I), "B"),
    (re.compile(r"\b(LAND CLEARING|SITE PREP|SITE WORK|SITEWORK|EXCAVAT\w*|GRADING|DOZER|"
                r"BACKHOE|TRENCH\w*|BORING|DIRT WORK|LAND SERVICES)\b", re.I), "A_DIRT"),
    (re.compile(r"\b(SEPTIC|GREASE|PORTA\w*|SANITATION|VACUUM|HYDROVAC|SEWER|"
                r"WELL DRILLING|PUMP SERVICE)\b", re.I), "A_VAC"),
    (re.compile(r"\b(TOWING|WRECKER|RECOVERY|ROLL ?OFF|RECYCLING|SALVAGE|REFUSE|"
                r"TRASH|DISPOSAL|SANI SERVICE)\b", re.I), "C"),
    (re.compile(r"\b(TRUSS|LUMBER|BUILDING SUPPLY|SAND|AGGREGATE|PAVING|ASPHALT|"
                r"READY ?MIX|LOGGING|FORESTRY|TIMBER|HAULING|TRUCKING|SOD)\b", re.I), "B"),
    (re.compile(r"\bCONSTRUCTION\b", re.I), "A_DIRT"),
]
# one-off relabels the rules above do not cover
LANE_OVERRIDES = {
    "HULL WELL & PUMP SERVICE INC": "A_DIRT",
    "DISCOUNT ROCK & SAND, INC.": "B",
}


def lane_of(r):
    """The lane a row ships under: an explicit override, else the first unambiguous
    trade word in the company name, else the lane C0 derived from cargo and licence."""
    if r["company"] in LANE_OVERRIDES:
        return LANE_OVERRIDES[r["company"]]
    for rx, lane in NAME_LANE:
        if rx.search(r["company"]):
            return lane
    return r["lane"]


INCLUDE_VERDICT_COLS = False  # David grades in his own format; the sheet ships without blank verdict columns
BLANK_WEBSITE = {"EVAN DOUGLAS CONSTRUCTION, INC.": "prod website belongs to a different company (Endeavor Construction)"}
# Trades Providence does not target, plus the retail/processing persona the cargo flags
# keep dragging in: a supply house hauls construction materials, so it declares the same
# flag a site-work contractor does, but it does not run financeable dirt equipment.
NOT_IN_BOX_NAME = re.compile(
    r"\b(ELECTRIC|ELECTRICAL|ROOFING)\b"
    r"|\b(BUILDING|BUILDER'?S?|FARM|FEED|SEED|POOL|PLUMBING)\b.{0,24}?\bSUPPL(Y|IES)\b"
    r"|\b(HARDWARE|GARDEN CENTER|MOBILE HOME SALES|SEED PROCESSORS?|RENTALS?)\b", re.I)
CORP_LIKE = re.compile(r"\b(LLC|L\.L\.C\.?|INC\.?|CORP\.?|CORPORATION|COMPANY|HOLDINGS?|TRUST|ENTERPRISES|GROUP)\b", re.I)
SUFFIXES = {"JR": "Jr.", "SR": "Sr.", "II": "II", "III": "III", "IV": "IV"}


def num(x, d=0.0):
    try:
        return float(str(x).strip())
    except Exception:
        return d


def tc(tok):
    t = re.sub(r"[A-Za-z]+", lambda m: m.group().capitalize(), tok)
    return re.sub(r"\s{2,}", " ", t.replace("St.", "St. ")).strip()


def rebuild_name(raw):
    """Person name from a registry string. Returns None if it is not a person."""
    s = (raw or "").strip()
    if not s or CORP_LIKE.search(s):
        return None
    # A generational suffix can sit at the end ("LARRY B ROBERTS JR") or after the
    # comma ("Martin VANDERWERF, Iii"). Pull it out before deciding the name order,
    # or the comma rule reads the suffix as the given name.
    suffix = ""
    def strip_suffix(part):
        nonlocal suffix
        out = []
        for t in part.split():
            if t.upper().rstrip(".") in SUFFIXES and len(s.replace(",", " ").split()) > 1:
                suffix = SUFFIXES[t.upper().rstrip(".")]
            else:
                out.append(t)
        return out
    if "," in s:
        head, tail = s.split(",", 1)
        head_toks, tail_toks = strip_suffix(head), strip_suffix(tail)
        # "LAST, FIRST M." only when something survives on both sides
        toks = tail_toks + head_toks if tail_toks and head_toks else head_toks + tail_toks
    else:
        toks = strip_suffix(s)
    if not toks:
        return None
    out = []
    for i, t in enumerate(toks):
        bare = t.rstrip(".")
        if len(bare) == 1 and i < len(toks) - 1:
            out.append(bare.upper() + ".")
        else:
            out.append(tc(t))
    return " ".join(out) + (f" {suffix}" if suffix else "")


def fix_owner(r):
    if r["company"] in NAME_OVERRIDES:
        return NAME_OVERRIDES[r["company"]], r["owner_title"], r["owner_source"]
    n = rebuild_name(r["owner_name_raw"])
    if n:
        return n, r["owner_title"], r["owner_source"]
    n = rebuild_name(r.get("fm_officer", ""))
    if n:
        return n, "Officer on DOT filing", "fmcsa_mcs150"
    return "", r["owner_title"], r["owner_source"]


def signal_text(r):
    t = r["top_signal_text"]
    if r.get("ripe_basis") == "in_window_now" and "renewal window is open now" in t:
        t = t.replace("the renewal window is open now",
                      "inside the typical refinance window for that lender")
    return t


def sheet_row(r):
    owner, title, src = fix_owner(r)
    phone_alt = r["phone_alt"] if r["phone_alt"] and r["phone_alt"] != r["phone"] else ""
    ripe = "" if r.get("ripe_basis") == "in_window_now" else (r["ripe_date"] or "")[:10]
    website = "" if r["company"] in BLANK_WEBSITE else r.get("website_final", "")
    lane = lane_of(r)
    reason = re.sub(r"lane \S+;", f"lane {lane};", r["selection_reason"])
    return {
        "company": r["company"],
        "dba": r.get("places_name", "") if r.get("places_name", "").upper() != r["company"].upper() else "",
        "owner_name": owner, "owner_title": title, "owner_source": src,
        "phone": r["phone"], "phone_source": r["phone_source"], "line_type": r["line_type"],
        "phone_corroborated": r["phone_corroborated"], "phone_alt": phone_alt,
        "email": r["email"], "email_source": r["email_source"],
        "city": r["prin_city"] or r["city_norm"], "county": r["county"],
        "county_tier": r["county_tier"], "lane": lane, "tier": r["tier"],
        "equipment_class": lane, "equipment_quote": r["equipment_quote"],
        "equipment_url": r["equipment_url"], "equipment_source": r["equipment_source"],
        "fleet_units_stated": r.get("owntruck", ""), "power_units": r.get("fm_power_units", ""),
        "tib_years": r["tib_years"], "last_annual_report": r["last_annual_report"],
        "ucc_secured_party": r["secured_party"], "ucc_filing_date": (r["filing_date"] or "")[:10],
        "ucc_ripe_date": ripe, "top_signal_text": signal_text(r),
        "signals_present": r["signals_present"], "selection_reason": reason,
        "website": website,
        **{c: "" for c in SHEET_COLS[SHEET_COLS.index("reached"):]},
    }


def write(path, rows):
    tmp = path + ".tmp"
    cols = SHEET_COLS if INCLUDE_VERDICT_COLS else SHEET_COLS[:SHEET_COLS.index("reached")]
    with open(tmp, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols, extrasaction="ignore")
        w.writeheader()
        w.writerows(sheet_row(r) for r in rows)
    os.replace(tmp, path)
    print(f"wrote {path}: {len(rows)} rows")


def main():
    prev50 = [r["company"] for r in csv.DictReader(open(OUT50))]
    allrows = [r for r in csv.DictReader(open(SRC, newline="")) if not r["c3_exclusion"]]
    for r in allrows:
        r["_sort"] = (
            0 if r["phone_status"] == "verified_valid" else 1,
            -num(r["max_signal_strength"]), -num(r["signals_present"]),
            TIER_ORDER.get(r["county_tier"], 3),
            0 if r["phone_corroborated"] == "true" else 1,
            0 if 5 <= num(r["tib_years"]) <= 15 else 1,
            0 if r["sunbiz_match_method"] == "name_city" else 1,
            -num(r["tib_years"]),
        )
        r["selection_reason"] = (
            f"{r['tier']} arm; lane {r['lane']}; {r['county_tier'].lower().replace('_',' ')} county; "
            f"evidence {r['equipment_source'] or 'none'}; phone from {r['phone_source'].replace('_',' ')}"
            + ("; phone corroborated by a second source" if r["phone_corroborated"] == "true" else "")
            + f"; {r['signals_present']} signal(s) present."
        )
    allrows.sort(key=lambda r: r["_sort"])
    # de-dupe by company (a carrier with two DOT numbers appears twice in v4)
    seen, uniq = set(), []
    for r in allrows:
        if r["company"] not in seen:
            seen.add(r["company"]); uniq.append(r)
    by_co = {r["company"]: r for r in uniq}
    ver = [r for r in uniq if r["phone_status"] == "verified_valid"]

    def dial_ok(r):
        """Eligible for the 50 or the bench."""
        if r["company"] in EXCLUDE_FROM_50 or num(r["tib_years"]) < TIB_FLOOR:
            return False
        if NOT_IN_BOX_NAME.search(r["company"]):
            return False
        return bool(fix_owner(r)[0])

    # --- the 50: keep the prior batch minus exclusions, then the hand-picked replacements
    picked, used, monroe = [], set(), 0
    for name in prev50:
        r = by_co.get(name)
        if not r or not dial_ok(r):
            continue
        if r["county"] == "MONROE":
            if monroe >= MONROE_CAP_50:
                continue
            monroe += 1
        picked.append(r); used.add(name)
    for arm, quota in ARMS.items():
        have = sum(1 for r in picked if r["tier"] == arm)
        for name in REPLACE[arm]:
            if have >= quota:
                break
            r = by_co[name]
            assert r["phone_status"] == "verified_valid" and dial_ok(r) and r["tier"] == arm, name
            if name not in used:
                picked.append(r); used.add(name); have += 1
        for r in ver:  # safety fill, should not trigger
            if have >= quota:
                break
            if r["tier"] == arm and r["company"] not in used and dial_ok(r) and r["county"] != "MONROE":
                picked.append(r); used.add(r["company"]); have += 1
                print(f"  NOTE: safety fill in {arm}: {r['company']}")
        assert have == quota, (arm, have)
    picked.sort(key=lambda r: (list(ARMS).index(r["tier"]), r["_sort"]))

    # --- bench: next 25 verified, same rules, Monroe cap 3
    bench, bm = [], 0
    for r in ver:
        if len(bench) >= 25:
            break
        if r["company"] in used or not dial_ok(r):
            continue
        if r["county"] == "MONROE":
            if bm >= MONROE_CAP_BENCH:
                continue
            bm += 1
        bench.append(r); used.add(r["company"])
    rest = [r for r in uniq if r["company"] not in used]

    write(OUT50, picked); write(OUTB, bench); write(OUTC, rest)

    # --- report
    print("\nswaps out of the 50:")
    for n, why in EXCLUDE_FROM_50.items():
        print(f"  - {n}: {why}")
    print("swaps in:")
    for r in picked:
        if r["company"] not in prev50:
            print(f"  + {r['tier']:12} {r['lane']:6} {r['county']:10} {r['company']}")
    print("\nowner-name changes in the 50 and bench:")
    for r in picked + bench:
        new = fix_owner(r)[0]
        if new != r["owner_name"]:
            print(f"  {r['company'][:36]:36} {r['owner_name']!r:28} -> {new!r}")
    print("\nwebsites whose domain shares no token with the company name (eyeball these):")
    generic = {"INC", "LLC", "CORP", "THE", "AND", "OF", "SERVICES", "SERVICE", "COMPANY", "CO", "GROUP", "ENTERPRISES", "FLORIDA", "FL", "CONSTRUCTION", "TRUCKING", "SEPTIC", "TANK", "HAULING", "SITE", "PREP", "LAND", "CLEARING", "CONCRETE", "PUMPING", "DISPOSAL", "TOWING", "RECOVERY", "WELL", "PUMP", "DRILLING", "EXCAVATING", "LOGGING", "DEVELOPMENT", "SOLUTIONS", "SPECIALISTS", "INDUSTRIES", "CENTER", "CUSTOM", "SYSTEMS"}
    for r in picked + bench:
        web = "" if r["company"] in BLANK_WEBSITE else r.get("website_final", "")
        if not web:
            continue
        dom = re.sub(r"^https?://(www\.)?", "", web).split("/")[0].replace("-", "").upper()
        toks = [t for t in re.findall(r"[A-Z0-9]+", r["company"].upper()) if t not in generic and len(t) >= 3]
        if toks and not any(t in dom for t in toks):
            print(f"  {r['company'][:40]:40} {web}")

    def comp(rows, label):
        print(f"\n{label} composition ({len(rows)}):")
        for k in ("tier", "lane", "county_tier", "equipment_source", "phone_source", "line_type", "owner_source", "signals_present", "last_annual_report"):
            print(f"  {k:18} {dict(sorted(Counter(sheet_row(r)[k] for r in rows).items()))}")
        print(f"  {'county top':18} {Counter(r['county'] for r in rows).most_common(6)}")
        print(f"  corroborated {sum(1 for r in rows if r['phone_corroborated']=='true')} · email {sum(1 for r in rows if r['email'])} · website {sum(1 for r in rows if sheet_row(r)['website'])} · phone_alt {sum(1 for r in rows if sheet_row(r)['phone_alt'])}")
        tib = sorted(num(r["tib_years"]) for r in rows)
        print(f"  tib min {tib[0]} median {tib[len(tib)//2]} max {tib[-1]}")
        print(f"  ripe_date blank {sum(1 for r in rows if not sheet_row(r)['ucc_ripe_date'])} · renewal-window rows {sum(1 for r in rows if 'refinance window' in sheet_row(r)['top_signal_text'] or 'renewal window' in sheet_row(r)['top_signal_text'])}")
    comp(picked, "THE 50"); comp(bench, "BENCH")
    print(f"\ncontinuation: {len(rest)} rows, {sum(1 for r in rest if r['phone_status']=='verified_valid')} verified, {sum(1 for r in rest if r['phone_status']!='verified_valid')} unverified")


if __name__ == "__main__":
    main()
