#!/usr/bin/env python3
"""C3: contact verification.

Phone ranking is FMCSA-first by decision: the MCS-150 number is filed by the operator
with a federal regulator, and it is present on 65% of the batch versus 49% for Places.
Every row records phone_source either way, so David's verdicts settle whether a
registry phone actually beats a web phone rather than us assuming it.

Both numbers are looked up when they differ, which costs nothing extra -- lookups are
deduplicated across the batch (552 distinct numbers, $4.42 against the $5 cap).
"""
import csv, json, os, re, sys, threading, time
from concurrent.futures import ThreadPoolExecutor
import requests, dns.resolver
from dotenv import load_dotenv

load_dotenv()
SID, TOK = os.environ["TWILIO_ACCOUNT_SID"], os.environ["TWILIO_AUTH_TOKEN"]
FL_AC = {"239","305","321","352","386","407","448","561","656","689","727","754",
         "772","786","813","850","863","904","941","954"}
# Widened after a Baptist association reached the enrichment batch: Providence
# excludes government and nonprofits, which the original word list did not cover.
EXTRA_RESTRICT = re.compile(
    r"\b(BAPTIST|CATHOLIC|METHODIST|LUTHERAN|PRESBYTER|EPISCOP|SYNAGOG|MOSQUE|TEMPLE"
    r"|ASSOCIATION|ASSN|SOCIETY|INSTITUTE|COUNCIL|AUTHORITY|FIRE DISTRICT|BOARD OF"
    r"|UNIVERSITY|COLLEGE|HOSPITAL|CHARIT|NONPROFIT|NON PROFIT|MISSION|OUTREACH"
    r"|FELLOWSHIP|CONGREGAT|PARISH|DIOCESE|HOUSING AUTHOR|MUNICIPAL)\b")

_lock = threading.Lock()
# Preload previously fetched lookups. Twilio results do not change minute to minute,
# and this makes the whole C3 chain re-runnable without spending again.
CACHE_PATH = "data/work/twilio_cache.json"
cache = json.load(open(CACHE_PATH)) if os.path.exists(CACHE_PATH) else {}
mxcache = {}
counters = {"twilio": 0, "mx": 0, "errors": 0}


def d10(p):
    d = "".join(c for c in (p or "") if c.isdigit())
    if len(d) == 11 and d[0] == "1":
        d = d[1:]
    return d if len(d) == 10 else ""


def lookup(num):
    with _lock:
        if num in cache:
            return cache[num]
    try:
        r = requests.get(f"https://lookups.twilio.com/v2/PhoneNumbers/+1{num}",
                         params={"Fields": "line_type_intelligence"},
                         auth=(SID, TOK), timeout=25)
        with _lock:
            counters["twilio"] += 1
        j = r.json()
        lt = j.get("line_type_intelligence") or {}
        res = {"valid": bool(j.get("valid")), "line_type": lt.get("type") or "",
               "carrier": lt.get("carrier_name") or "",
               "line_status": (j.get("line_status") or {}).get("status", "") if isinstance(j.get("line_status"), dict) else "",
               "err": ""}
    except Exception as e:
        with _lock:
            counters["errors"] += 1
        res = {"valid": False, "line_type": "", "carrier": "", "line_status": "", "err": str(e)}
    with _lock:
        cache[num] = res
    return res


def mx_ok(domain):
    domain = (domain or "").strip().lower()
    if not domain:
        return False
    with _lock:
        if domain in mxcache:
            return mxcache[domain]
    ok = False
    try:
        ok = len(dns.resolver.resolve(domain, "MX")) > 0
        with _lock:
            counters["mx"] += 1
    except Exception:
        ok = False
    with _lock:
        mxcache[domain] = ok
    return ok


def main():
    rows = list(csv.DictReader(open("out/FL_POOL_v2_EQUIPMENT.csv", newline="")))
    nums = set()
    for r in rows:
        for k in ("fmcsa_phone", "places_phone"):
            n = d10(r[k])
            if n:
                nums.add(n)
    nums = sorted(nums)
    print(f"{len(nums)} distinct numbers -> ${0.008*len(nums):.2f}")
    with ThreadPoolExecutor(max_workers=10) as ex:
        list(ex.map(lookup, nums))
    print(f"twilio calls: {counters['twilio']}, errors: {counters['errors']}")

    def verify(r):
        fm, pl = d10(r["fmcsa_phone"]), d10(r["places_phone"])
        r["phone_corroborated"] = "true" if (fm and pl and fm == pl) else "false"
        r["phones_differ"] = "true" if (fm and pl and fm != pl) else "false"
        # FMCSA first by decision; fall back to Places.
        chosen, src = ("", "")
        for cand, s in ((fm, "fmcsa_mcs150"), (pl, "google_places")):
            if not cand:
                continue
            res = cache.get(cand, {})
            if res.get("valid") and res.get("line_status") != "inactive":
                chosen, src = cand, s
                break
        if not chosen:
            chosen, src = (fm or pl), ("fmcsa_mcs150" if fm else ("google_places" if pl else ""))
        res = cache.get(chosen, {})
        r["phone"] = f"({chosen[:3]}) {chosen[3:6]}-{chosen[6:]}" if chosen else ""
        r["phone_e164"] = f"+1{chosen}" if chosen else ""
        r["phone_source"] = src
        r["phone_valid"] = str(bool(res.get("valid"))).lower() if chosen else "false"
        r["line_type"] = res.get("line_type", "")
        r["carrier"] = res.get("carrier", "")
        r["line_status"] = res.get("line_status", "")
        r["shared_line"] = "true" if res.get("line_type") in ("tollFree", "nonFixedVoip") else "false"
        r["phone_area_code_ok"] = "true" if chosen[:3] in FL_AC else "false"
        r["phone_candidates_tried"] = ";".join(x for x in (fm, pl) if x)
        # alternate number, kept so David can try it if the first fails
        alt = pl if (chosen == fm and pl) else (fm if chosen == pl and fm else "")
        r["phone_alt"] = f"({alt[:3]}) {alt[3:6]}-{alt[6:]}" if alt else ""
        r["phone_alt_valid"] = str(bool(cache.get(alt, {}).get("valid"))).lower() if alt else ""

        # email: only addresses a registry or the company's own site gave us
        em = (r.get("anchor_email") or r.get("fm_email") or r.get("fdep_email") or "").strip()
        em = em.split(";")[0].split(",")[0].strip()
        r["email"] = em if "@" in em else ""
        r["email_source"] = ("fmcsa_mcs150" if em and (r.get("fm_email") or "").strip().startswith(em[:5])
                             else ("fdep" if em else ""))
        r["mx_ok"] = str(mx_ok(em.split("@")[-1])).lower() if r["email"] else "false"

        site = (r.get("places_website") or r.get("website") or "").strip()
        r["website_final"] = site
        r["site_ok"] = "unchecked"

        # exclusions discovered during enrichment
        why = []
        if EXTRA_RESTRICT.search((r["company"] or "").upper()):
            why.append("restricted_org_type")
        if r.get("business_status") == "CLOSED_PERMANENTLY":
            why.append("closed_permanently")
        if not chosen:
            why.append("no_phone")
        elif r["phone_valid"] != "true":
            why.append("phone_invalid")
        elif r["phone_area_code_ok"] != "true":
            why.append("phone_area_code_not_fl")
        r["c3_exclusion"] = ";".join(why)
        return r

    out = [verify(r) for r in rows]
    with open("out/FL_POOL_v3_CONTACT.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(out[0].keys()))
        w.writeheader()
        w.writerows(out)
    json.dump(cache, open(CACHE_PATH, "w"), indent=1)
    print(f"wrote out/FL_POOL_v3_CONTACT.csv ({len(out)} rows); mx lookups {counters['mx']}")


if __name__ == "__main__":
    main()
