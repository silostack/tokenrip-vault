#!/usr/bin/env python3
"""Repairs found in QA of the first 50. No API calls.

1. mcs150_date is 'YYYYMMDD HHMM', not ISO, so every date in an FMCSA equipment quote
   rendered as 'n/a' or 'filed 20240313 0'. Reparsed and the quote rebuilt.
2. Fleet size: Providence finances 2-25 employee owner-operators at $40-200K. A
   266-truck carrier is not that borrower. power_units > 25 is now a box exclusion.
3. Owner names arrived in three shapes: 'James Douglas', 'NORTON, JACK J' and
   'BARRY  LONG'. David reads this column aloud on a call, so it is normalised to
   'First Last' with the registry's raw string preserved alongside.
"""
import csv, os, datetime, re

CARGO = {
    "crgo_construct": "Construction materials", "crgo_garbage": "Garbage/refuse",
    "crgo_drivetow": "Driveaway/towaway", "crgo_machlrg": "Machinery, large objects",
    "crgo_waterwell": "Water well", "crgo_oilfield": "Oilfield equipment",
    "crgo_drybulk": "Dry bulk", "crgo_bldgmat": "Building materials",
    "crgo_logpole": "Logs, poles, lumber",
}
SUFFIX = {"JR", "SR", "II", "III", "IV", "MR", "MRS", "MS", "DR"}


def parse_fmcsa_date(s):
    s = (s or "").strip()
    m = re.match(r"^(\d{4})(\d{2})(\d{2})", s)
    if not m:
        return None
    try:
        return datetime.date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
    except ValueError:
        return None


def tidy_name(raw, first="", last=""):
    """-> 'First Last', call-ready. Middle initials and suffixes dropped."""
    if first or last:
        f, l = first.strip(), last.strip()
    else:
        raw = re.sub(r"\s+", " ", (raw or "").strip())
        if not raw:
            return ""
        if "," in raw:
            l, _, rest = raw.partition(",")
            parts = [p for p in rest.strip().split(" ") if p]
        else:
            parts = raw.split(" ")
            l, parts = parts[-1], parts[:-1]
        parts = [p for p in parts if p.upper().strip(".") not in SUFFIX]
        f = parts[0] if parts else ""
        l = l.strip()
    f = re.sub(r"[^A-Za-z'\-]", "", f)
    l = re.sub(r"\s+", " ", l).strip(" .,")
    def cap(x):
        return "-".join(w[:1].upper() + w[1:].lower() if w else w for w in x.split("-"))
    out = " ".join(p for p in (cap(f), " ".join(cap(w) for w in l.split())) if p)
    return re.sub(r"\s+", " ", out).strip()


def num(x):
    try:
        return float(str(x).strip())
    except Exception:
        return 0.0


def main():
    rows = list(csv.DictReader(open("out/FL_POOL_v3_CONTACT.csv", newline="")))
    cargo = {}
    import subprocess
    subprocess.run(["psql", "-d", "flpool", "-q", "-c",
                    "\\copy (select dot_number," + ",".join(CARGO) +
                    " from work.fmcsa) to 'data/work/_cargo.csv' csv header"], check=True)
    for c in csv.DictReader(open("data/work/_cargo.csv", newline="")):
        cargo[c["dot_number"]] = c

    fixed_dates = fixed_names = oversize = 0
    for r in rows:
        # --- 1. dates + quote ---
        d = parse_fmcsa_date(r.get("mcs150_date"))
        r["mcs150_date_iso"] = d.isoformat() if d else ""
        if r.get("equipment_source") == "fmcsa_mcs150":
            fl = cargo.get(r.get("dot_number") or "", {})
            classes = [CARGO[k] for k in CARGO
                       if str(fl.get(k, "")).strip() not in ("", "N", "0")]
            pu, own = (r.get("fm_power_units") or "").strip(), (r.get("owntruck") or "").strip()
            bits = []
            if classes:
                bits.append("cargo classified " + ", ".join(classes[:3]))
            if pu and pu != "0":
                bits.append(f"{pu} power units")
            if own and own != "0":
                bits.append(f"{own} trucks owned")
            if bits:
                old = r["equipment_quote"]
                r["equipment_quote"] = (
                    f"FMCSA MCS-150 filed {d.isoformat() if d else 'date not stated'}: "
                    + "; ".join(bits) + ".")
                if old != r["equipment_quote"]:
                    fixed_dates += 1

        # --- 2. owner name ---
        raw = r["owner_name"]
        tidy = tidy_name(raw, r.get("owner_first", ""), r.get("owner_last", ""))
        r["owner_name_raw"] = raw
        if tidy and tidy != raw:
            fixed_names += 1
        r["owner_name"] = tidy or raw

        # --- 3. fleet cap ---
        if num(r.get("fm_power_units")) > 25:
            oversize += 1
            r["c3_exclusion"] = ";".join(
                [x for x in [r["c3_exclusion"], "fleet_over_box"] if x])

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
    print(f"repaired: {fixed_dates} equipment quotes, {fixed_names} owner names, "
          f"{oversize} rows excluded as fleet_over_box")
    clean = [r for r in rows if not r["c3_exclusion"]]
    print(f"clean rows now: {len(clean)} "
          f"({sum(1 for r in clean if r['phone_status']=='verified_valid')} phone-verified)")


if __name__ == "__main__":
    main()
