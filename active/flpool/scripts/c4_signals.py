#!/usr/bin/env python3
"""C4: per-signal features, one row per signal. No composite score.

Weights get fitted only after David's verdicts exist, so nothing here is summed into a
single number. Size features (fleet) are deliberately kept as their own signal id so
they can never be mistaken for a growth or intent signal.
"""
import csv, datetime, os

TODAY = datetime.date.today()
SRC = "out/FL_POOL_v3_CONTACT.csv"
SIG = "out/SIGNALS.csv"
OUT = "out/FL_POOL_v4_SIGNALS.csv"
COLS = ["company_key", "signal_id", "present", "observed_date", "strength",
        "confidence", "source", "url"]


def f(x, d=0.0):
    try:
        return float(str(x).strip())
    except Exception:
        return d


def d(x):
    x = (x or "")[:10]
    try:
        return datetime.date.fromisoformat(x)
    except Exception:
        return None


def mmyyyy(x):
    dt = d(x)
    return dt.strftime("%m/%Y") if dt else "an earlier date"


def main():
    rows = list(csv.DictReader(open(SRC, newline="")))
    sigs = []
    for r in rows:
        k = r["join_key"]
        n_sig, strengths, dates, top = 0, [], [], ""

        # --- ucc_renewal_window: a term ending is the one real why-now we hold ---
        has_ucc = r["in_ucc"] == "t" and not (r["kill_reason"] or "").strip()
        if has_ucc:
            dueness = f(r["dueness"])
            in_now = r["ripe_basis"] == "in_window_now"
            s = min(1.0, dueness) if in_now else 0.5 * min(1.0, dueness)
            url = ("https://www.floridaucc.com/uccweb/searchNameResults.aspx?fileNumber="
                   + (r["filing_number"] or ""))
            sigs.append([k, "ucc_renewal_window", "true", (r["ripe_date"] or "")[:10],
                         f"{s:.3f}",
                         f"n_future_filings={r['n_future_filings']}; "
                         f"median_gap_months={r['median_gap_months']}; "
                         f"pcf_grade={r['pcf_grade'] or 'none'}; ripe_basis={r['ripe_basis']}",
                         "quintel_ucc_model", url])
            n_sig += 1
            strengths.append(s)
            if r["ripe_date"]:
                dates.append(r["ripe_date"][:10])
            sp = (r["secured_party"] or "").title().strip()
            top = (f"Equipment financing with {sp or 'a prior lender'} filed "
                   f"{mmyyyy(r['filing_date'])}; the renewal window "
                   f"{'is open now' if in_now else 'opens ' + mmyyyy(r['ripe_date'])}.")
        else:
            sigs.append([k, "ucc_renewal_window", "false", "", "0",
                         "no active UCC filing for this company", "quintel_ucc_model", ""])

        # --- ucc_termination_12mo: not derivable from the file we hold ---
        sigs.append([k, "ucc_termination_12mo", "false", "", "0",
                     "not available in file: raw.ucc_fl carries no termination flag",
                     "quintel_ucc_model", ""])

        # --- fmcsa_new_dot_12mo ---
        add = d(r.get("dot_add_date"))
        dot = r.get("dot_number") or ""
        safer = ("https://safer.fmcsa.dot.gov/query.asp?searchtype=ANY&query_type="
                 f"queryCarrierSnapshot&query_param=USDOT&query_string={dot}") if dot else ""
        if add and (TODAY - add).days <= 365:
            sigs.append([k, "fmcsa_new_dot_12mo", "true", add.isoformat(), "0.700",
                         f"USDOT {dot} registered {add.isoformat()}", "fmcsa_census", safer])
            n_sig += 1
            strengths.append(0.7)
            dates.append(add.isoformat())
            if not top:
                top = f"New motor-carrier registration (USDOT {dot}) filed {mmyyyy(add.isoformat())}."
        else:
            sigs.append([k, "fmcsa_new_dot_12mo", "false", add.isoformat() if add else "",
                         "0", "DOT registration older than 12 months" if add else "no DOT record",
                         "fmcsa_census", safer])

        # --- fmcsa_fleet_size: a SIZE feature, never growth ---
        pu = f(r.get("fm_power_units"))
        if pu >= 2:
            s = min(1.0, pu / 10.0)
            sigs.append([k, "fmcsa_fleet_size", "true", (r.get("mcs150_date") or "")[:10],
                         f"{s:.3f}",
                         f"{int(pu)} power units; size feature, not an intent signal",
                         "fmcsa_census", safer])
            n_sig += 1
            strengths.append(s)
        else:
            sigs.append([k, "fmcsa_fleet_size", "false", "", "0",
                         f"power_units={int(pu)}", "fmcsa_census", safer])

        # --- fmcsa_fleet_delta: needs a second snapshot ---
        sigs.append([k, "fmcsa_fleet_delta", "false", "", "0",
                     "needs second snapshot; only one FMCSA pull exists (2026-09-03)",
                     "fmcsa_census", safer])

        if not top:
            if r.get("equipment_quote"):
                top = r["equipment_quote"]
            else:
                top = "No dated why-now signal; company qualifies on registry and box fit alone."

        r["signals_present"] = str(n_sig)
        r["max_signal_strength"] = f"{max(strengths):.3f}" if strengths else "0.000"
        r["most_recent_signal_date"] = max(dates) if dates else ""
        r["top_signal_text"] = top
        # County demand index was not loadable tonight; recorded as null, not invented.
        r["county_demand_index"] = ""

    with open(SIG, "w", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(COLS)
        w.writerows(sigs)
    with open(OUT, "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    print(f"wrote {SIG} ({len(sigs)} signal rows) and {OUT} ({len(rows)} companies)")

    from collections import Counter
    pres = Counter(s[1] for s in sigs if s[2] == "true")
    print("\nsignals present:")
    for k2, v in pres.most_common():
        print(f"  {k2:24s} {v:>4}")


if __name__ == "__main__":
    main()
