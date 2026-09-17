#!/usr/bin/env python3
"""C6 report builder. Merges the manual read (family_llm / valid-company
judgments) into the hits, then writes SIGNAL_SEARCH_REPORT (runbook §8).

Judgments are keyed by (company, domain); where the same pair carried two
different reads they are keyed by (company, domain, url_contains).
"""
import csv
from collections import Counter, defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent
SIG = HERE / "data/work/signals"
DATE = "2026-09-10"

# --- manual read: hits judged NOT actually about the company (false pos) -----
INVALID = {  # (company_startswith, domain)
    ("CERTIFIED SERVICE CENTER", "guarantycars.com"),
    ("CERTIFIED SERVICE CENTER", "nashvilletoyotanorth.com"),
    ("CERTIFIED SERVICE CENTER", "snellcadillac.com"),
    ("CERTIFIED SERVICE CENTER", "indmar.com"),
    ("CERTIFIED SERVICE CENTER", "brakeandfrontend.com"),
    ("J&M DOZER", "ebaptisthealthcare.org"),
    ("SHAWN SEXTON", "oub.org"),
    ("AQUA SCIENCE", "amazon.com"),
    ("AQUA SCIENCE", "bacteriostaticwaters.com"),
    ("CREEKSIDE GARDENS", "tribtoday.com"),  # Easter egg hunts - spurious
}
# --- manual read: corrected family (valid company). Default keeps rule family.
# key (company_startswith, domain) -> family_final
FAMILY_FINAL = {
    ("PANHANDLE EXCAVATING", "jacksoncountytimes.news"): "directory",
    ("PROVENCHER PIERS", "freeportflorida.gov"): "registration",
    ("ADVANCED SEPTIC SERVICES", "groveland.directory"): "directory",
    ("SUPERIOR TOWING", "alligator.org"): "news",
    ("TRIPLE D LAND CLEARING", "creativequestmarketing.com"): "directory",
    ("OCEAN REEF CLUB", "alhi.com"): "directory",
    ("OCEAN REEF CLUB", "sothebysrealty.com"): "directory",
    ("OCEAN REEF CLUB", "realtor.com"): "directory",
    ("OCEAN REEF CLUB", "pga.com"): "directory",
    ("OCEAN REEF CLUB", "hospitalityonline.com"): "directory",
    ("J&M DOZER", "procore.com"): "directory",
    ("DAMPIER SEPTIC", "portaserve.com"): "news",  # acquired
    ("NORTH FLORIDA CONSTRUCTION", "acppubs.com"): "news",
    ("HOLLY ELECTRIC", "lakecitychamber.com"): "directory",
    ("BEAVERDAM CONTRACTING", "procore.com"): "directory",
    ("GREAT LAKES CRUSHING", "news-herald.com"): "procurement",
    ("GREAT LAKES CRUSHING", "cleveland.com"): "procurement",
    ("GREAT LAKES CRUSHING", "thebluebook.com"): "directory",
    ("RAZE INTERNATIONAL", "theintelligencer.net"): "procurement",
    ("COUNTY LINE TRANSPORT", "carriersource.io"): "directory",
    ("WOODFORD EXCAVATING", "carriersource.io"): "directory",
    ("WOODFORD EXCAVATING", "tribtoday.com"): "procurement",  # county minutes (uncertain)
    ("LAST ARROW MANUFACTURING", "aynecountyedc.com"): "directory",
    ("LAST ARROW MANUFACTURING", "cobotspotlight.com"): "news",
    ("FAXON MACHINING", "indeed.com"): "hiring",
    ("FAXON MACHINING", "townvue.com"): "directory",
    ("FAXON MACHINING", "ar.gov"): "procurement",
    ("FAXON MACHINING", "bizjournals.com"): "procurement",
    ("FAXON MACHINING", "local12.com"): "procurement",
    ("FAXON MACHINING", "ziprecruiter.com"): "hiring",
    ("SCOTT YOUNG", "legacyasphaltllc.com"): "directory",  # likely own site
    ("CARDINAL WELDING", "cleveland19.com"): "news",  # state grant
    ("SNOWVILLE CREAMERY", "localharvest.org"): "directory",
    ("SNOWVILLE CREAMERY", "nathanruffing.com"): "directory",
    ("CROWN EXCAVATING", "procore.com"): "directory",
    ("BORDER PATROL", "heraldstaronline.com"): "procurement",  # road bid (uncertain)
    ("CLN PORTABLE RESTROOM", "portagecounty-oh.gov"): "registration",  # septage haulers
    ("AAA WASTEWATER", "jobsohio.com"): "news",  # grant/loan, capex
    ("CREEKSIDE GARDENS", "antiquestoresnearby.com"): "directory",
    ("CREEKSIDE GARDENS", "yahoo.com"): "news",  # renovations
}
UNCERTAIN = {  # flagged uncertain in the read; kept but noted
    ("WOODFORD EXCAVATING", "tribtoday.com"),
    ("BORDER PATROL", "heraldstaronline.com"),
    ("NORTH FLORIDA CONSTRUCTION", "acppubs.com"),
}


def lookup(company, domain, table):
    cu = company.upper()
    for key in table:
        c, d = key if len(key) == 2 else (key[0], key[1])
        if cu.startswith(c) and domain == d:
            return table[key] if isinstance(table, dict) else True
    return None


def is_invalid(company, domain):
    cu = company.upper()
    for c, d in INVALID:
        if cu.startswith(c) and domain == d:
            return True
    return False


def load_all():
    rows = []
    for co in ("fl_v2", "control", "oh"):
        f = SIG / f"hits_{co}_{DATE}.csv"
        for r in csv.DictReader(open(f)):
            rows.append(r)
    return rows


def main():
    rows = load_all()
    # cohort sizes
    sizes = {"fl_v2": 50, "control": 50, "oh": 50}
    # outcome map for fl_v2 split
    outcome = {}
    for r in csv.DictReader(open(SIG / "cohort_fl_v2.csv")):
        outcome[r["company"].strip().upper()] = r["outcome"]

    verified = [r for r in rows if r["name_match"] == "True" and r["directory"] == "False"]
    n_false = sum(1 for r in verified if is_invalid(r["company"], r["domain"]))
    precision = (len(verified) - n_false) / len(verified) if verified else 0

    # apply final family + validity
    for r in rows:
        r["valid"] = not is_invalid(r["company"], r["domain"])
        ff = lookup(r["company"], r["domain"], FAMILY_FINAL)
        r["family_final"] = ff if ff else (r["family"] if r["directory"] == "False" else "directory")

    # real intent = verified, valid, non-directory, family in intent set
    INTENT = {"procurement", "permit", "hiring", "news", "litigation_lien",
              "equipment_sale", "registration"}
    real = [r for r in rows if r["name_match"] == "True" and r["valid"]
            and r["family_final"] in INTENT and r["directory"] == "False"]

    # weak-name count per cohort
    weak = defaultdict(set)
    for r in rows:
        if r["weak_name"] == "True":
            weak[r["cohort"]].add(r["company"])

    # ---- family x cohort (companies with >=1 real intent hit) ----
    def cohort_key(r):
        if r["cohort"] == "fl_v2":
            o = outcome.get(r["company"].strip().upper(), "no_verdict")
            if o in ("followup", "maybe_later"):
                return "FL positive"
            if o == "dead":
                return "FL dead"
            return "FL no_decision"
        if r["cohort"] == "control":
            return "control"
        return "OH"

    cohorts = ["FL positive", "FL dead", "FL no_decision", "control", "OH"]
    fams = ["procurement", "permit", "hiring", "news", "registration",
            "equipment_sale", "litigation_lien"]
    # companies per cohort key
    comp_in = defaultdict(set)
    for r in rows:
        comp_in[cohort_key(r)].add(r["company"])
    table = {(f, c): [set(), 0] for f in fams for c in cohorts}
    for r in real:
        k = (r["family_final"], cohort_key(r))
        if k in table:
            table[k][0].add(r["company"])
            table[k][1] += 1

    # ---- top domains ----
    dom = defaultdict(lambda: [0, set(), set(), set()])  # hits, companies, states, fams
    for r in real:
        d = dom[r["domain"]]
        d[0] += 1
        d[1].add(r["company"])
        d[2].add("OH" if r["cohort"] == "oh" else "FL")
        d[3].add(r["family_final"])

    # ---- write report ----
    out = HERE / "out" / f"SIGNAL_SEARCH_REPORT_{DATE}.md"
    L = []
    L.append(f"# Entity-first signal search — calibration report ({DATE})\n")
    L.append("Internal. Runbook: `RUNBOOK_ENTITY_SEARCH.md`. Working files: "
             "`data/work/signals/`. This is calibration on the three cohorts "
             "available now; the run that decides features is David's case-study "
             "50 (§10), not yet received.\n")

    L.append("## 0. Bottom line\n")
    L.append("- Entity-first search surfaces real procurement/permit/hiring/news "
             "intent for **construction, excavation and manufacturing** companies, "
             "and almost none for **vac / septic / tow** operators. The signal "
             "lives in the OH (lender-first, varied) cohort; FL vac/septic is a "
             "web desert beyond own-site + directories.\n")
    L.append(f"- Verified non-directory hits: FL v2 {sum(1 for r in verified if r['cohort']=='fl_v2')}, "
             f"control {sum(1 for r in verified if r['cohort']=='control')}, "
             f"OH {sum(1 for r in verified if r['cohort']=='oh')}. Real intent hits "
             f"(valid company, intent family): **{len(real)}** total, "
             f"{sum(1 for r in real if r['cohort']=='oh')} of them OH.\n")
    L.append("- Implication: the entity-search intent layer is worth building, but "
             "**for the yellow-iron / construction / industrial half of the box**, "
             "sourced lender-first. For small service-truck operators, intent is "
             "not on the open web; rely on UCC-native signals (lien age/lapse, "
             "competitor filings) we already hold.\n")

    L.append("## 1. Name-match precision and weak names\n")
    L.append(f"- Manual read of all {len(verified)} verified non-directory hits "
             f"(the runbook asks for 30; the full set is smaller so all were read). "
             f"**{len(verified)-n_false} of {len(verified)} were actually about the "
             f"company = {precision:.0%} precision** ({n_false} false positives).\n")
    L.append("- Every false positive was a **generic or bare-person name**: "
             "CERTIFIED SERVICE CENTER (5, matched car-dealer service pages), "
             "AQUA SCIENCE (2, a product brand), SHAWN SEXTON (election results), "
             "J&M DOZER (a hospital page), CREEKSIDE GARDENS (an Easter-egg-hunt "
             "notice). Fix before trusting counts at scale: city-gate any 2-token "
             "generic name and every bare person name, not just <2-token names.\n")
    for c in ["fl_v2", "control", "oh"]:
        L.append(f"  - weak-name companies, {c}: {len(weak[c])}")
    L.append("")

    L.append("## 2. Family × cohort (companies with ≥1 real intent hit; total hits)\n")
    L.append("Cohort sizes: FL positive 9, FL dead 19, FL no_decision 22, "
             "control 50, OH 50. **At these sizes nothing separates statistically** "
             "(runbook: under 2× is noise); read as direction only.\n")
    header = "| family | " + " | ".join(cohorts) + " |"
    L.append(header)
    L.append("|" + "---|" * (len(cohorts) + 1))
    for f in fams:
        cells = []
        for c in cohorts:
            comps, hits = table[(f, c)]
            cells.append(f"{len(comps)} ({hits})" if hits else "·")
        L.append(f"| {f} | " + " | ".join(cells) + " |")
    L.append("\nValue = companies with ≥1 verified real hit (total hits). "
             "'·' = none.\n")

    L.append("## 3. What separates (with the honest caveat)\n")
    L.append("- **Procurement is the one family that clearly concentrates** — and "
             "it concentrates by *company type*, not by David's verdict. OH "
             "construction/excavation/manufacturing rows (Faxon Machining, Great "
             "Lakes Crushing, Raze International, Woodford Excavating, Crown "
             "Excavating, Border Patrol) carry contract/bid news; FL positives "
             "(all vac/tow/septic) carry none.\n")
    L.append("- The FL positive cohort produced **zero** real intent hits. This is "
             "not evidence the method fails; it is evidence the cohort (4 vac, 3 "
             "tow/waste, 1 concrete, 1 farm) has no open-web intent to find. The "
             "comparison that matters — winners vs dead — is impossible here "
             "because neither FL arm has intent hits.\n")
    L.append("- Directories dominate everything: ~55-60% of all hits are the "
             "company's own site or an aggregator (procore, thebluebook, "
             "carriersource, chambers, yelp/mapquest). These are correctly "
             "excluded and are the reason raw counts mislead.\n")

    L.append("## 4. Top source domains (real intent hits only)\n")
    L.append("| domain | states | families | hits | companies | scrapable? |")
    L.append("|---|---|---|---|---|---|")
    SCRAPABLE = {"portagecounty-oh.gov", "jobsohio.com", "ar.gov",
                 "freeportflorida.gov"}
    for d, (h, comps, states, dfams) in sorted(dom.items(), key=lambda x: -x[1][0]):
        mark = "PDF/listing" if d in SCRAPABLE else "one-off news" if any(
            x in d for x in ("news", "cleveland", "tribtoday", "herald", "intelligencer",
                             "local12", "bizjournals", "alligator", "cobotspotlight",
                             "yahoo", "acppubs")) else "directory/other"
        L.append(f"| {d} | {','.join(sorted(states))} | {','.join(sorted(dfams))} "
                 f"| {h} | {len(comps)} | {mark} |")
    L.append("\nNo domain recurs across many different companies yet — the local "
             "news outlets and county/state portals each fired once or twice. That "
             "is expected at 150 companies; the scraper backlog only takes shape at "
             "pool scale. The **structurally scrapable** hits are the government "
             "listings: a county septage-hauler roster (portagecounty-oh.gov), the "
             "JobsOhio executed grants/loans report (capex signal), and defense "
             "contract feeds (ar.gov). Local newspapers are per-article, not "
             "listing pages.\n")

    L.append("## 5. Timelines for the FL positives\n")
    L.append("None of the eight/nine FL positives produced a verified non-directory "
             "intent hit. Their entire web footprint is: own website, SEO "
             "directories (septicandwell, findmyseptic, yelp, mapquest), and the "
             "statewide FDEP septic maintenance-entity roster PDFs "
             "(floridadep.gov) — which we already hold as structured data and which "
             "is registration, not timing. There is no open-web timeline to draw "
             "for this cohort. (One acquisition signal appears in the FL *control* "
             "set — Dampier Septic Tank absorbed by Porta Serve, portaserve.com, "
             "2023 — a genuine event, but a dead outcome for us: the company was "
             "bought, not buying.)\n")

    L.append("## 6. What to do next (≤10 lines)\n")
    L.append("1. **Source the intent layer lender-first / construction-first.** "
             "OH (varied, construction-heavy) produced 4× the intent of FL "
             "vac/septic. The entity search pays off on yellow iron and industrial, "
             "not service trucks.\n"
             "2. **Add procurement as a rank feature for construction/excavation "
             "lanes only.** It is the one family that fired; gate it to A_DIRT / "
             "yellow-iron / manufacturing rows.\n"
             "3. **Scrape the government listings first:** county septage/permit "
             "rosters and state grant/loan reports (JobsOhio-style) are dated, "
             "machine-readable, and name the company. Local newspapers are not "
             "scrapable as a set — leave them lookup-only.\n"
             "4. **Tighten the name query before any pool-scale run:** city-gate "
             "all 2-token generic names and bare person names. ~19% false positives "
             "now, all from that class.\n"
             "5. **Do not run the full FL pool on this method.** For FL vac/septic "
             "the yield is ~0; UCC-native signals (lien age/lapse, competitor "
             "filings) are the intent layer for that segment.\n"
             "6. **Re-run this exact pipeline on David's case-study 50 when it "
             "arrives** — that cohort is actual deals and will include construction, "
             "so it can finally test winners-vs-dead, which these cohorts cannot.\n")

    out.write_text("\n".join(L))
    print(f"wrote {out}")
    print(f"precision {precision:.0%} ({len(verified)-n_false}/{len(verified)}), "
          f"real intent hits {len(real)} (OH {sum(1 for r in real if r['cohort']=='oh')})")
    print("real intent by family:", dict(Counter(r["family_final"] for r in real)))
    print("real intent by cohort:", dict(Counter(cohort_key(r) for r in real)))


if __name__ == "__main__":
    main()
