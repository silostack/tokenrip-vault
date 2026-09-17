#!/usr/bin/env python3
"""C6: entity-first signal search (RUNBOOK_ENTITY_SEARCH.md).

For each company we hold identity for, search the web (Exa) and classify what
comes back into signal families. Calibration, not production. Output is a hits
CSV + raw JSON per query; the report is built separately.

Usage:
    c6_signal_search.py --cohort positives --in <companies.csv> \
        [--limit N] [--q4] [--date 2026-09-10]

Input CSV must carry: company, city, state, website; county optional (FL),
usdot optional (OH). Reuses normalize.py (name/city norm) and the GENERIC set
from c5d_cnam.py per the runbook.
"""
import argparse
import csv
import json
import os
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

from dotenv import load_dotenv
from exa_py import Exa

sys.path.insert(0, str(Path(__file__).resolve().parent))
from normalize import normalize_name, normalize_city  # noqa: E402

HERE = Path(__file__).resolve().parent.parent  # active/flpool
load_dotenv(HERE / ".env")
EXA_KEY = os.environ["EXA_API_KEY"]

# --- name handling -----------------------------------------------------------
# GENERIC set copied from scripts/c5d_cnam.py (kept in sync); tokens that carry
# no identity and must not, alone, satisfy a name match.
GENERIC = {
    "INC", "LLC", "LC", "CORP", "CORPORATION", "COMPANY", "CO", "THE", "AND",
    "OF", "LTD", "LP", "PA", "PLLC", "ENTERPRISES", "ENTERPRISE", "GROUP",
    "HOLDINGS", "SERVICES", "SERVICE", "SVC", "SVCS", "SOLUTIONS", "SYSTEMS",
    "SYS", "FLORIDA", "FL", "SONS", "SON", "BROTHERS", "BROS",
}
# Generic-name guard stoplist, exactly as the runbook specifies: the words
# SERVICES/TRUCKING/CONSTRUCTION/TRANSPORT/ENTERPRISES plus the GENERIC set.
# Deliberately narrow: SEPTIC/WASTE/FARMS/TOWING/CONCRETE etc. are distinctive
# enough to identify a small operator and must NOT trip the weak-name flag.
TRADE_STOP = {"TRUCKING", "CONSTRUCTION", "TRANSPORT", "TRANSPORTATION"}
STOP_ALL = GENERIC | TRADE_STOP

_TRAIL_PUNCT = re.compile(r"[\s,.\-]+$")


def query_phrase(name):
    """Strip the legal suffix and trailing punctuation; keep the rest as an
    exact phrase for the quoted search. Uses normalize_name to drop suffixes,
    then restores a readable spacing (normalize_name expands & -> AND and drops
    punctuation, which is fine for an unquoted-token phrase Exa keyword match)."""
    n = normalize_name(name)
    return n.strip()


def content_tokens(name):
    """Identity-bearing tokens: 4+ letters, not in the stoplist."""
    toks = normalize_name(name).split()
    return [t for t in toks if len(t) >= 4 and t not in STOP_ALL]


def match_tokens(name):
    """Tokens required to appear in a hit's text for a name match: 3+ chars,
    not GENERIC. Looser than content_tokens so short distinctive tokens (e.g.
    'JC', kept if >=3) still count, but drops INC/LLC/etc."""
    toks = normalize_name(name).split()
    return [t for t in toks if len(t) >= 3 and t not in GENERIC]


_PERSON_RE = re.compile(r"^[A-Z]+( [A-Z])? [A-Z]+$")  # SCOTT YOUNG, WILLIAM S CURTIS
# A token that marks the phrase as a business, not a person, so it is not
# mistaken for a bare owner name (CALOHN WASTE, EARTHGREEN FARMS are companies).
BUSINESS_WORDS = {
    "SEPTIC", "TANK", "WASTE", "TOWING", "CONCRETE", "PUMPING", "HAULING",
    "FARMS", "FARM", "EXCAVATING", "EXCAVATION", "TRUCKING", "CONSTRUCTION",
    "TRANSPORT", "DIRT", "SAND", "PAVING", "TRACTOR", "SANI", "GREASE",
    "HYDROVAC", "VAC", "CRANE", "SEWER", "PLUMBING", "GRADING", "DOZER",
}


def is_weak_name(name):
    """<2 content tokens of 4+ letters (non-stop), or a bare person name.
    A phrase carrying a business word (WASTE, FARMS, ...) is never a bare
    person name even when it is two tokens."""
    ct = content_tokens(name)
    if len(ct) < 2:
        return True
    n = normalize_name(name)
    if _PERSON_RE.match(n) and not (set(n.split()) & BUSINESS_WORDS):
        return True
    return False


# --- directory / identity domains to flag out of family counts ---------------
DIRECTORY_DOMAINS = {
    "bbb.org", "yelp.com", "mapquest.com", "manta.com", "buzzfile.com",
    "dnb.com", "zoominfo.com", "facebook.com", "linkedin.com",
    "opencorporates.com", "bizapedia.com", "safer.fmcsa.dot.gov", "sunbiz.org",
    "floridacompanies.com", "instagram.com", "yellowpages.com", "bizprofile.net",
    "corporationwiki.com", "apollo.io", "rocketreach.co", "leadferret.com",
    "usphonebook.com", "truepeoplesearch.com", "fastpeoplesearch.com",
    "companies.google.com", "birdeye.com", "chamberofcommerce.com",
    "cylex.us.com", "elocal.com", "trustpilot.com", "glassdoor.com",
    "indeed.com/cmp", "dandb.com", "clustrmaps.com", "homeadvisor.com",
    "angi.com", "thumbtack.com", "nextdoor.com", "tiktok.com", "x.com",
    "twitter.com",
    # SEO aggregators / vertical directories seen in the positives smoke test
    "septicandwell.com", "findmyseptic.com", "hibuwebsites.com",
    "porch.com", "houzz.com", "expertise.com", "threebestrated.com",
    "superpages.com", "citysearch.com", "local.com", "hotfrog.com",
    "brownbook.net", "ezlocal.com", "n49.com", "merchantcircle.com",
}


def squash(s):
    return re.sub(r"[^A-Z0-9]", "", (s or "").upper())


def is_own_site(company, domain):
    """True if `domain` is the company's own website, detected structurally so
    it works even when the website column is empty or points elsewhere.
    The registrable label (ensleyseptic, howardseptic, fastaffordabletow)
    contains one of the company's distinctive tokens."""
    label = squash(domain.split(".")[0]) if domain else ""
    if not label:
        return False
    sq = squash(company)
    if len(label) >= 6 and label in sq:
        return True
    for t in content_tokens(company):
        if len(t) >= 5 and t in label:
            return True
    return False


def name_in_text(mtoks, blob, weak, city_norm):
    """Word-boundary match: every identity token present as a whole word (not a
    substring, so ALL does not match instALLations). Weak names also need the
    city."""
    if not mtoks:
        return False
    for t in mtoks:
        if not re.search(r"\b" + re.escape(t) + r"\b", blob):
            return False
    if weak:
        return bool(city_norm) and re.search(r"\b" + re.escape(city_norm) + r"\b", blob) is not None
    return True


def reg_domain(host):
    """eTLD+1-ish: last two labels, keep three for common gov/edu compounds."""
    if not host:
        return ""
    host = host.lower().lstrip("www.")
    parts = host.split(".")
    if len(parts) <= 2:
        return host
    # keep 3 labels for .gov/.us/.co.uk style
    if parts[-1] in {"us", "uk", "au"} and parts[-2] in {"co", "gov", "org", "com", "state"}:
        return ".".join(parts[-3:])
    return ".".join(parts[-2:])


# --- family classification (rules) -------------------------------------------
FAMILY_RULES = [
    ("procurement", re.compile(
        r"\b(bidder|bidders|plan holder|planholder|letting|award(ed)?|contract|rfp|"
        r"prequalif|invitation to bid|itb|solicitation|county engineer|public works|"
        r"purchasing)\b", re.I)),
    ("permit", re.compile(
        r"\b(permit|right[- ]of[- ]way|\brow\b|septic (permit|install)|onsite sewage|"
        r"\bwell\b|building department|building permit|land clearing permit)\b", re.I)),
    ("hiring", re.compile(
        r"\b(hiring|now hiring|we'?re hiring|job opening|\bcdl\b|equipment operator|"
        r"now accepting applications|apply now|join our team|help wanted)\b", re.I)),
    ("litigation_lien", re.compile(
        r"\b(lawsuit|\blien\b|judgment|foreclosure|complaint filed|vs\.|plaintiff|"
        r"defendant|court)\b", re.I)),
    ("equipment_sale", re.compile(
        r"\b(for sale|auction|ritchie|ironplanet|machinerytrader|equipmenttrader|"
        r"lot #|used equipment)\b", re.I)),
    ("registration", re.compile(
        r"\b(new dot|usdot|certificate of|state board|license(d)? (as|contractor)|"
        r"registration)\b", re.I)),
    ("news", re.compile(
        r"\b(announced|announces|expands|expansion|new location|new yard|grand opening|"
        r"celebrat|milestone|acqui)\b", re.I)),
]
DIRECTORY_HINT = re.compile(
    r"\b(business profile|company profile|reviews|phone number|contact info|"
    r"see reviews|find a|near you|directory)\b", re.I)
PROC_DOMAIN = re.compile(r"(bidnet|demandstar|govdeals|publicpurchase|bonfirehub|"
                         r"planetbids|questcdn|dot\.|county|public|\.gov)", re.I)
HIRING_DOMAIN = re.compile(r"(indeed|craigslist|ziprecruiter|glassdoor|simplyhired|"
                           r"snagajob|monster)", re.I)
NEWS_DOMAIN = re.compile(r"(news|tribune|herald|gazette|journal|times|post|patch\.com|"
                         r"wctv|wjhg|wear|abc|nbc|cbs|fox|constructiondive)", re.I)


def classify_family(url, title, text):
    domain = reg_domain(urlparse(url).hostname or "")
    blob = f"{title or ''} {text or ''}"
    # domain-first hints
    if HIRING_DOMAIN.search(domain):
        return "hiring", "hiring_domain"
    if PROC_DOMAIN.search(url):
        return "procurement", "proc_domain"
    for fam, rx in FAMILY_RULES:
        if rx.search(blob):
            return fam, "text_rule"
    if NEWS_DOMAIN.search(domain):
        return "news", "news_domain"
    return "unknown", ""


# --- Exa search --------------------------------------------------------------
exa = Exa(api_key=EXA_KEY)


def one_search(query, neural=False, num=10):
    """Single Exa call with 429 backoff. Returns (results, http_status)."""
    delay = 2.0
    for attempt in range(5):
        try:
            r = exa.search_and_contents(
                query,
                type="neural" if neural else "keyword",
                num_results=num,
                text={"max_characters": 1500},
                start_published_date="2023-01-01",
            )
            return r.results, 200
        except Exception as e:  # exa raises on HTTP error; inspect message
            msg = str(e)
            status = 429 if "429" in msg else (
                int(re.search(r"\b(4\d\d|5\d\d)\b", msg).group(1))
                if re.search(r"\b(4\d\d|5\d\d)\b", msg) else 0)
            if status == 429 and attempt < 4:
                time.sleep(delay)
                delay *= 2
                continue
            return [], status or -1
    return [], 429


def build_queries(row, use_q4=False):
    name = row["company"]
    phrase = query_phrase(name)
    city = (row.get("city") or "").strip().rstrip(", FL").strip()
    county = (row.get("county") or "").strip()
    state = (row.get("state") or "FL").strip()
    weak = is_weak_name(name)
    # generic-name guard: append city to the phrase when weak
    q1 = f'"{phrase}" {city} {state}'
    q2 = (f'"{phrase}" (bid OR bidders OR "plan holders" OR awarded OR contract '
          f'OR permit OR prequalified) {county} county {state}')
    q3 = f'"{phrase}" (hiring OR "now hiring" OR "job" OR "CDL" OR "operator") {city}'
    qs = [("Q1", q1, False), ("Q2", q2, False), ("Q3", q3, False)]
    if use_q4:
        qs.append(("Q4", f"{phrase} {city} {state} equipment contractor news", True))
    return qs, weak


def run_cohort(rows, cohort, date, raw_dir, use_q4=False, max_workers=5):
    hits = []
    tasks = []  # (row, weak, qid, query, neural)
    for row in rows:
        qs, weak = build_queries(row, use_q4)
        for qid, q, neural in qs:
            tasks.append((row, weak, qid, q, neural))

    raw_dir.mkdir(parents=True, exist_ok=True)

    def slug_of(name):
        return re.sub(r"[^a-z0-9]+", "_", normalize_name(name).lower()).strip("_")

    def work(t):
        row, weak, qid, q, neural = t
        cache = raw_dir / f"{slug_of(row['company'])}_{qid}.json"
        if cache.exists():
            # reuse: nothing is re-bought (runbook §7)
            raw = json.loads(cache.read_text())
            res = [type("R", (), r) for r in raw["results"]]
            return row, weak, qid, q, neural, res, raw.get("http_status", 200), True
        num = 5 if neural else 10
        results, status = one_search(q, neural=neural, num=num)
        return row, weak, qid, q, neural, results, status, False

    n_calls = 0
    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        futs = [ex.submit(work, t) for t in tasks]
        for fut in as_completed(futs):
            row, weak, qid, q, neural, results, status, cached = fut.result()
            slug = slug_of(row["company"])
            if not cached:
                n_calls += 1
                raw = {
                    "company": row["company"], "cohort": cohort, "query_id": qid,
                    "query": q, "http_status": status,
                    "results": [{"url": r.url, "title": r.title,
                                 "published_date": r.published_date, "text": r.text}
                                for r in results],
                }
                (raw_dir / f"{slug}_{qid}.json").write_text(json.dumps(raw, indent=1))
            city_norm = normalize_city(row.get("city", ""))
            mtoks = match_tokens(row["company"])
            website_dom = reg_domain(urlparse(
                (row.get("website") or "")).hostname or "") if row.get("website") else ""
            for r in results:
                dom = reg_domain(urlparse(r.url).hostname or "")
                own = is_own_site(row["company"], dom) or (website_dom and dom == website_dom)
                is_dir = bool(own or dom in DIRECTORY_DOMAINS)
                blob = f"{r.title or ''} {r.text or ''}".upper()
                nm = name_in_text(mtoks, blob, weak, city_norm)
                if is_dir:
                    fam, rule = "directory", ("own_site" if own else "exclusion_list")
                else:
                    fam, rule = classify_family(r.url, r.title, r.text)
                hits.append({
                    "company": row["company"], "cohort": cohort, "query_id": qid,
                    "url": r.url, "domain": dom, "title": r.title,
                    "published_date": r.published_date or "",
                    "text_excerpt": (r.text or "")[:500].replace("\n", " "),
                    "family": fam, "family_rule": rule, "family_llm": "",
                    "signal_date": r.published_date or "",
                    "name_match": nm, "weak_name": weak,
                    "directory": is_dir, "own_site": bool(own),
                    "http_status": status,
                    "retrieved_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                })
    # dedup by (company, url): a page returned by Q1 and Q3 is one hit. Keep the
    # first, but remember every query that surfaced it.
    seen = {}
    for hh in hits:
        k = (hh["company"], hh["url"])
        if k in seen:
            seen[k]["query_id"] = seen[k]["query_id"] + "+" + hh["query_id"]
        else:
            seen[k] = hh
    return list(seen.values()), n_calls


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cohort", required=True)
    ap.add_argument("--in", dest="infile", required=True)
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--q4", action="store_true")
    ap.add_argument("--date", default=datetime.now().strftime("%Y-%m-%d"))
    a = ap.parse_args()

    with open(a.infile, newline="") as f:
        rows = list(csv.DictReader(f))
    if a.limit:
        rows = rows[:a.limit]

    out_dir = HERE / "data/work/signals"
    raw_dir = out_dir / "raw" / a.cohort
    hits, n_calls = run_cohort(rows, a.cohort, a.date, raw_dir, use_q4=a.q4)

    out_dir.mkdir(parents=True, exist_ok=True)
    out_csv = out_dir / f"hits_{a.cohort}_{a.date}.csv"
    cols = ["company", "cohort", "query_id", "url", "domain", "title",
            "published_date", "text_excerpt", "family", "family_rule",
            "family_llm", "signal_date", "name_match", "weak_name", "directory",
            "own_site", "http_status", "retrieved_at"]
    with open(out_csv, "w", newline="") as g:
        w = csv.DictWriter(g, fieldnames=cols)
        w.writeheader()
        w.writerows(hits)

    # quick console summary
    total = len(hits)
    verified = [h for h in hits if h["name_match"] and not h["directory"]]
    print(f"cohort={a.cohort} companies={len(rows)} exa_calls={n_calls} "
          f"raw_hits={total} directory={sum(h['directory'] for h in hits)} "
          f"name_match_nondir={len(verified)}")
    from collections import Counter
    print("families (verified, non-dir):",
          dict(Counter(h["family"] for h in verified)))
    print("http status:", dict(Counter(h["http_status"] for h in hits)))
    print(f"wrote {out_csv}")


if __name__ == "__main__":
    main()
