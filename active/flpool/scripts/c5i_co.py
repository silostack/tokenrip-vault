#!/usr/bin/env python3
"""C5i: Alek's Colorado specialty-truck 100 (Mountain time, David asked for central/mountain)
-> our standard Twilio line type + CNAM (Alek pre-ran a non-Twilio line type and no CNAM;
we overwrite for cross-batch comparability with WI/FL/OH), then David's template first and
our analytical tail after.

CO shape vs WI: fit_flag is uniform 'DELIVERED' and alek_signal is the same two tokens on all
100 rows -> no per-row intent ranking, so NO blind copy is needed (nothing for David to see that
would confound). This is a WI-style batch. Lien age IS per-row (good spread), so it still tests
the 24-48mo warm-band finding from WI (§4.10).

Two rows handled for safety, not analysis:
  - '10 Star Tree Care, LLC': Alek's FLAGS says the listed owner is deceased; the line now reaches
    a family member. Dropped from David's outbound copy (kept internal, neutral reason). We do not
    encode marital status anywhere (standing rule).
  - 'GOLDSTAR EXCAVATION AND SEWER': dual-ownership verify note -> passed to David in the email, kept.
Phone II: promote a clean-sourced owner mobile (Best_Mobile) only when it differs from the main line
and its source is fmcsa/directory/bbb/company_site/gov_list -- never people_search/quickenrich/LinkedIn
(standing rule: keep LinkedIn-derived contact data out of the batch).

Inputs  data/work/co100_alek_raw.csv
Caches  data/work/twilio_cache.json, data/work/cnam_cache.json
Output  out/CO_PHONE_TEST_100_2026-09-15.csv         (internal, lossless: Alek's cols + our Twilio)
        out/CO_PHONE_TEST_100_DAVID_2026-09-15.csv    (David-facing: his 19 cols + analytical tail, 99 rows)
"""
import csv, re, sys
sys.path.insert(0, "scripts")
import c3e_lookup as tw
from c5d_cnam import classify

RAW = "data/work/co100_alek_raw.csv"
OUT_FULL = "out/CO_PHONE_TEST_100_2026-09-15.csv"
OUT_DAVID = "out/CO_PHONE_TEST_100_DAVID_2026-09-15.csv"

CLEAN_SRC = {"fmcsa_directory", "directory", "bbb", "company_site", "gov_list"}
SUPPRESS = {"10startreecarellc"}  # deceased listed owner; do not cold-call the line


def norm(s):
    return re.sub(r"[^a-z0-9]", "", (s or "").lower())


def d10(p):
    x = "".join(c for c in (p or "") if c.isdigit())
    return x[-10:] if len(x) >= 10 else ""


def fmt(n):
    return f"({n[:3]}) {n[3:6]}-{n[6:]}" if n else ""


def phone_ii(r):
    """Existing Phone II, else a clean-sourced owner mobile -- always distinct from the main line."""
    main = d10(r.get("Phone"))
    if d10(r.get("Phone II")) and d10(r["Phone II"]) != main:
        return d10(r["Phone II"]), ""
    bm = d10(r.get("Best_Mobile"))
    if bm and bm != main and (r.get("DM_Phone_Source_Type") or "").strip() in CLEAN_SRC:
        return bm, "owner mobile (clean source)"
    return "", ""


def main():
    rows = list(csv.DictReader(open(RAW)))

    # choose Phone II per row, then Twilio every distinct number we will show David
    ii = {}
    for r in rows:
        ii[norm(r["Company"])] = phone_ii(r)
    nums = sorted({d10(r["Phone"]) for r in rows if d10(r["Phone"])} |
                  {p for p, _ in ii.values() if p})

    line = tw.load(tw.LINE_CACHE)
    todo = [n for n in nums if not line.get(n, {}).get("line_type") and line.get(n, {}).get("http") != 200]
    print(f"line: {len(todo)} to fetch of {len(nums)}")
    if todo:
        tw.run_line(todo)
    tw.run_cnam(nums)
    line, cnam = tw.load(tw.LINE_CACHE), tw.load(tw.CNAM_CACHE)

    full, david = [], []
    for r in rows:
        main_n = d10(r["Phone"])
        ii_n, ii_note = ii[norm(r["Company"])]
        lt, cn = line.get(main_n, {}), cnam.get(main_n, {})
        cname = cn.get("caller_name", "")
        cmatch = classify(cname, r["Company"], r.get("Name", ""))
        suppressed = norm(r["Company"]) in SUPPRESS

        dcol = {
            # David's template, his order
            "Company": r["Company"], "DBA": r.get("DBA", ""), "LP": "", "GM": "", "Last Contact": "",
            "SIC Code": "", "Industry": r.get("Industry", ""), "TIB": "",
            "Name": r.get("Name", ""), "Job Title": r.get("Job Title", ""),
            "Phone": fmt(main_n), "Phone II": fmt(ii_n),
            "Website": r.get("Website", ""), "Email": (r.get("Email", "") or "").lower(),
            "Comments": "", "Noise Level": "", "Time Zone": "MST",
            "City": r.get("City", ""), "State": "CO",
            # our analytical tail
            "line_type": lt.get("line_type", "") or "unknown",
            "phone_valid": "" if lt.get("http") != 200 else str(bool(lt.get("valid"))).lower(),
            "cnam_name": cname, "cnam_match": cmatch,
            "lane": r.get("lane", ""), "equipment_ticket": r.get("equipment_ticket", ""),
            "ucc_secured_party": r.get("ucc_secured_party", ""), "ucc_lender_class": r.get("ucc_lender_class", ""),
            "ucc_filing_date": r.get("ucc_filing_date", ""), "lien_age_months": r.get("lien_age_months", ""),
        }
        if not suppressed:
            david.append(dcol)

        # internal: everything Alek sent + our Twilio + bookkeeping
        f = dict(r)
        f["tw_line_type"] = lt.get("line_type", "")
        f["tw_valid"] = "" if lt.get("http") != 200 else str(bool(lt.get("valid"))).lower()
        f["tw_cnam_name"] = cname
        f["tw_cnam_match"] = cmatch
        f["phone_ii_used"] = fmt(ii_n)
        f["phone_ii_note"] = ii_note
        f["suppressed_from_david"] = "deceased_owner" if suppressed else ""
        full.append(f)

    with open(OUT_DAVID, "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=david[0].keys()); w.writeheader(); w.writerows(david)
    with open(OUT_FULL, "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=full[0].keys()); w.writeheader(); w.writerows(full)

    from collections import Counter
    print(f"\n{OUT_DAVID}: {len(david)} rows (dropped {len(full)-len(david)} suppressed)")
    print(f"{OUT_FULL}: {len(full)} rows")
    print("  line_type:", dict(Counter(o["line_type"] for o in david)))
    print("  cnam_match:", dict(Counter(o["cnam_match"] for o in david)))
    print("  lane:", dict(Counter(o["lane"] for o in david)))
    print("  phone_valid=false:", sum(1 for o in david if o["phone_valid"] == "false"))
    print("  Phone II present:", sum(1 for o in david if o["Phone II"]))
    print("  named owner:", sum(1 for o in david if o["Name"]))

    def band(m):
        try: m = int(m)
        except: return "?"
        return "fresh<6" if m < 6 else ("6-24" if m < 24 else ("24-48" if m < 48 else "48+"))
    print("  lien_age band:", dict(Counter(band(o["lien_age_months"]) for o in david)))


if __name__ == "__main__":
    main()
