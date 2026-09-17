#!/usr/bin/env python3
"""Strategy-2 feed join + score. Runbook `runbook_signal_feeds.md` §5-6.

Input: a feed CSV with the runbook columns (feed_id,state,agency,record_type,
company_raw,company_norm,city,county,record_date,job_or_asset_text,amount,
source_url,retrieved_at). company_norm must already be normalize_name() output.

Joins each company to Sunbiz (work.sunbiz_key), FMCSA (work.fmcsa), UCC
(work.ucc_key) and the pool (out/FL_POOL_v1.csv), classes the lien with the same
CAPTIVE/BANKLIKE/EF_HOUSE regexes as c5c, and writes:
  - data/work/feeds/<feed_id>_<state>.joined.csv   (per-row joins)
  - a scorecard row printed to stdout (the §6 measures)

FL joins use all four sources. OH has no local Sunbiz/FMCSA, so OH resolves on
UCC only (partial, by design) -- flagged in the scorecard.
"""
import argparse, csv, os, re, sys, json, time
import psycopg, requests
from dotenv import load_dotenv
from normalize import normalize_name, normalize_city

load_dotenv()

SOCRATA = "https://data.transportation.gov/resource/az4n-8mr2.json"
_SOC_CACHE = "data/work/feeds/oh_fmcsa_cache.json"
_soc = json.load(open(_SOC_CACHE)) if os.path.exists(_SOC_CACHE) else {}
_OH_UCC = None

def oh_fmcsa(nm):
    """Resolve an OH company against the live FMCSA census (no local OH copy).
    Prefix-query on the first two tokens, then match normalized name exactly."""
    if len(nm.split()) < 2:
        return None
    if nm in _soc:
        c = _soc[nm]
        return c if c else None
    prefix = " ".join(nm.split()[:2]).replace("'", "")
    try:
        r = requests.get(SOCRATA, params={
            "$select": "legal_name,dba_name,power_units,total_drivers,status_code,phy_city",
            "$where": f"phy_state='OH' AND upper(legal_name) like '{prefix}%'",
            "$limit": 50}, timeout=60)
        r.raise_for_status(); data = r.json()
    except Exception:
        return None
    hit = None
    for rec in data:
        if normalize_name(rec.get("legal_name","")) == nm or normalize_name(rec.get("dba_name","")) == nm:
            hit = [rec.get("power_units"), rec.get("total_drivers"), rec.get("status_code")]
            break
    _soc[nm] = hit or []
    json.dump(_soc, open(_SOC_CACHE, "w"))
    time.sleep(0.15)
    return hit

def load_oh_ucc():
    global _OH_UCC
    if _OH_UCC is not None:
        return _OH_UCC
    _OH_UCC = {}
    p = "data/work/ohio_alek_raw.csv"
    if os.path.exists(p):
        for row in csv.DictReader(open(p, newline="")):
            _OH_UCC[normalize_name(row.get("company",""))] = (
                row.get("qualifying_lender",""), row.get("lender_class",""),
                row.get("ucc_filing_date",""), "")
    return _OH_UCC

CAPTIVE = re.compile(
    r"KOMATSU|JOHN DEERE|DEERE|CATERPILLAR|CAT FINANCIAL|KUBOTA|TOYOTA INDUSTRIES|VOLVO|DAIMLER"
    r"|CNH|CASE CREDIT|NEW HOLLAND|JCB|AGCO|DLL|DE LAGE LANDEN|PACCAR|NAVISTAR|BOBCAT|DOOSAN"
    r"|HITACHI|MACK FINANCIAL|FREIGHTLINER|ISUZU FINANCE|FORD MOTOR CREDIT|GM FINANCIAL|ALLY", re.I)
BANKLIKE = re.compile(
    r"\bCREDIT UNION\b|\bBANCORP\b|\bSAVINGS BANK\b|\bNATIONAL ASSOCIATION\b|\bN\.?A\.?$"
    r"|\bBANK\b(?!.*\b(EQUIPMENT|VENDOR|LEASING|FINANCE COMPANY)\b)", re.I)
EF_HOUSE = re.compile(r"STEARNS BANK|GREATAMERICA|WELLS FARGO (VENDOR|EQUIPMENT)|"
                      r"BLUE BRIDGE|WESTERN EQUIPMENT|NORTH MILL|BEACON FUNDING|"
                      r"FINANCIAL PACIFIC|NAVITAS|COMMERCIAL CREDIT GROUP|OAKMONT|"
                      r"LEAF CAPITAL|DE LAGE LANDEN|MITSUBISHI HC|DEUTSCHE LEASING", re.I)

def lien_class(sp, lender_class=""):
    sp = sp or ""
    if not sp:
        return "none"
    if CAPTIVE.search(sp) or lender_class == "captive":
        return "captive"
    if EF_HOUSE.search(sp):
        return "ef_house"
    if BANKLIKE.search(sp) or lender_class == "bank":
        return "bank"
    return "funder_or_other"   # LEAF/NorthMill-style + unknown small lessors: the "keep" class

DATE_RE = re.compile(r"\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}[-/]\d{1,2}$|"
                     r"(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}", re.I)

def load_pool(path):
    pool = {}
    if not os.path.exists(path):
        return pool
    with open(path, newline="") as f:
        for row in csv.DictReader(f):
            nm = row.get("company_norm") or row.get("name_norm") or normalize_name(row.get("company",""))
            key = nm + "|" + normalize_city(row.get("city",""))
            pool[key] = row.get("exclusion_reason", "")
            pool.setdefault(nm, row.get("exclusion_reason",""))  # name-only fallback
    return pool

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("feed_csv")
    ap.add_argument("--state", required=True)
    ap.add_argument("--pool", default="out/FL_POOL_v1.csv")
    a = ap.parse_args()
    st = a.state.upper()

    rows = list(csv.DictReader(open(a.feed_csv, newline="")))
    # company_norm is set by each feed's extractor; a deliberately-blank value
    # (e.g. a bare-person permit agent) means "unjoinable" and must not be
    # back-filled from company_raw. Only fill when the column is entirely absent.
    for r in rows:
        if "company_norm" not in r:
            r["company_norm"] = normalize_name(r.get("company_raw",""))
    pool = load_pool(a.pool) if st == "FL" else {}

    c = psycopg.connect(os.getenv("FLPOOL_DB_URL")); cur = c.cursor()

    def sunbiz(nm, city):
        if st != "FL" or len(nm.split()) < 2:
            return None
        ck = normalize_city(city)
        cur.execute("select status,file_date,tib_years from work.sunbiz_key "
                    "where name_norm=%s and (city_norm=%s or %s='') order by (status='A') desc, tib_years desc nulls last limit 1",
                    (nm, ck, ck))
        return cur.fetchone()

    def fmcsa(nm, city):
        if len(nm.split()) < 2:
            return None
        if st != "FL":
            return oh_fmcsa(nm)          # OH: live Socrata, no local copy
        cur.execute("select power_units,total_drivers,status_code from work.fmcsa where name_norm=%s limit 1", (nm,))
        return cur.fetchone()

    def ucc(nm):
        if len(nm.split()) < 2:
            return None
        if st != "FL":
            return load_oh_ucc().get(nm)  # OH: Alek's 50-row batch only (no full index)
        cur.execute("select secured_party,lender_class,filing_date,ripe_date from work.ucc_key "
                    "where name_norm=%s order by filing_date desc nulls last limit 1", (nm,))
        return cur.fetchone()

    out = []
    for r in rows:
        nm = r["company_norm"]; city = r.get("city","")
        sb = sunbiz(nm, city); fm = fmcsa(nm, city); uc = ucc(nm)
        joinable = len(nm.split()) >= 2
        resolved = bool(sb or fm) if st == "FL" else bool(fm or uc)  # OH: FMCSA (Socrata) + 50-row UCC
        dated = bool((r.get("record_date") or "").strip() and DATE_RE.search(r.get("record_date","")))
        pu = None
        if fm and fm[0] not in (None, ""):
            try: pu = float(fm[0])
            except: pu = None
        in_box = False
        if resolved:
            fleet_ok = (pu is not None and 2 <= pu <= 7) if fm else None
            sb_ok = (sb and sb[0] == "A" and (sb[2] or 0) and float(sb[2] or 0) >= 2) if sb else None
            lc = lien_class(uc[0] if uc else "", uc[1] if uc else "")
            box_lien_ok = lc not in ("captive", "bank")
            not_excluded = pool.get(nm + "|" + normalize_city(city), pool.get(nm, "")) in ("", "eligible", None)
            in_box = bool((fleet_ok or sb_ok) and box_lien_ok and (st != "FL" or not_excluded))
        lc = lien_class(uc[0] if uc else "", uc[1] if uc else "")
        ucc_positive = bool(uc and lc not in ("captive", "bank"))
        in_pool = (nm + "|" + normalize_city(city)) in pool or nm in pool
        r2 = dict(r)
        r2.update(joinable=joinable, resolved=resolved, dated=dated,
                  sunbiz_status=sb[0] if sb else "", sunbiz_tib=sb[2] if sb else "",
                  fmcsa_power_units=pu if pu is not None else "", fmcsa_drivers=fm[1] if fm else "",
                  ucc_secured_party=uc[0] if uc else "", ucc_lien_class=lc,
                  ucc_filing_date=uc[2] if uc else "", ucc_ripe_date=uc[3] if uc else "",
                  ucc_positive=ucc_positive, in_box=in_box, in_pool=in_pool,
                  pool_exclusion=pool.get(nm + "|" + normalize_city(city), pool.get(nm, "")) if st=="FL" else "")
        out.append(r2)
    c.close()

    base = os.path.splitext(os.path.basename(a.feed_csv))[0]
    outp = f"data/work/feeds/{base}.joined.csv"
    with open(outp, "w", newline="") as g:
        w = csv.DictWriter(g, fieldnames=list(out[0].keys())); w.writeheader(); w.writerows(out)

    n = len(out)
    def sh(p): return f"{p}/{n} ({100*p//n if n else 0}%)"
    resolved = [r for r in out if r["resolved"]]
    nr = len(resolved) or 1
    print(f"\n=== SCORECARD  {base}  (state={st}) ===")
    print(f"records pulled : {n}")
    print(f"joinable       : {sh(sum(r['joinable'] for r in out))}")
    print(f"resolved       : {sh(len(resolved))}   [{'Sunbiz/FMCSA' if st=='FL' else 'UCC-only, OH partial'}]")
    print(f"dated          : {sh(sum(r['dated'] for r in out))}")
    print(f"in-box         : {sum(r['in_box'] for r in resolved)}/{len(resolved)} of resolved")
    print(f"UCC-positive   : {sum(r['ucc_positive'] for r in resolved)}/{len(resolved)} of resolved")
    print(f"already in pool: {sum(r['in_pool'] for r in resolved)}/{len(resolved)} of resolved")
    newus = [r for r in resolved if r['in_box'] and not r['in_pool']]
    print(f"NEW TO US      : {len(newus)}  (resolved + in-box + not in pool)")
    print(f"lien classes   : " + ", ".join(f"{k}={sum(1 for r in resolved if r['ucc_lien_class']==k)}"
          for k in ['funder_or_other','captive','bank','ef_house','none']))
    print(f"wrote {outp}")

if __name__ == "__main__":
    main()
