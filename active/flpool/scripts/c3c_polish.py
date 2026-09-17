#!/usr/bin/env python3
"""Final sheet polish. No API calls.

1. ucc_only rows carry no registry anchor by construction, so their equipment_quote
   was blank. Their evidence is the lien itself -- a public filing naming the secured
   party and date -- so that is what the quote now says. It is weaker evidence than a
   cargo declaration, and the equipment_source column says so plainly.
2. Sunbiz title codes are composite and opaque (DP, PSTD, AMBR, MGRM). David reads
   this column on a live call, so they are decoded to plain English.
"""
import csv, os

TITLES = {
    "P": "President", "PRES": "President", "PD": "President & Director",
    "PST": "President, Secretary & Treasurer",
    "PSTD": "President, Secretary, Treasurer & Director",
    "PTD": "President, Treasurer & Director", "PSD": "President, Secretary & Director",
    "DP": "Director & President", "MGR": "Manager", "MANA": "Manager",
    "MGRM": "Managing Member", "AMBR": "Authorized Member", "MBR": "Member",
    "MEMB": "Member", "CEO": "CEO", "OWNE": "Owner", "OWNER": "Owner",
    "AUTH": "Authorized Person", "AP": "Authorized Person", "AR": "Authorized Rep",
    "LICENSE HOLDER": "Licence qualifier",
}


def main():
    rows = list(csv.DictReader(open("out/FL_POOL_v3_CONTACT.csv", newline="")))
    q = t = 0
    for r in rows:
        if not r["equipment_quote"].strip() and r.get("secured_party"):
            fd = (r.get("filing_date") or "")[:10]
            r["equipment_quote"] = (
                f"Florida UCC filing {r.get('filing_number','')} recorded {fd or 'date not stated'}: "
                f"equipment financed by {r['secured_party'].title()}.")
            r["equipment_url"] = ("https://www.floridaucc.com/uccweb/searchNameResults.aspx?"
                                  f"fileNumber={r.get('filing_number','')}")
            r["equipment_source"] = "ucc_filing"
            r["equipment_confidence"] = "MED"
            q += 1
        code = (r.get("owner_title") or "").strip()
        dec = TITLES.get(code.upper())
        if dec and dec != code:
            r["owner_title_code"] = code
            r["owner_title"] = dec
            t += 1
        else:
            r.setdefault("owner_title_code", code)
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
        os.replace(tmp_out, 'out/FL_POOL_v3_CONTACT.csv')
    print(f"filled {q} UCC-based quotes; decoded {t} title codes")


if __name__ == "__main__":
    main()
