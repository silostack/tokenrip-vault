#!/usr/bin/env python3
import subprocess, datetime
DB="flpool"
def q(sql):
    r=subprocess.run(["psql","-d",DB,"-F","\t","-A","-c",sql],capture_output=True,text=True)
    if r.returncode: raise SystemExit(r.stderr)
    return [l.split("\t") for l in r.stdout.strip().split("\n") if l and not l.startswith("(")]
def tbl(rows):
    if len(rows)<2: return "_no rows_\n"
    h=rows[0]
    return "\n".join(["| "+" | ".join(h)+" |","| "+" | ".join(["---"]+["---:"]*(len(h)-1))+" |"]
                     +["| "+" | ".join(r)+" |" for r in rows[1:]])+"\n"
T=datetime.date.today().isoformat()
tier_lane=q("""select coalesce(lane,'(none)') as "Lane",
 count(*) filter (where tier='intersection') as "Intersection",
 count(*) filter (where tier='anchor_only') as "Anchor only",
 count(*) filter (where tier='ucc_only') as "UCC only",
 count(*) as "Eligible"
 from out.fl_pool_v1 where exclusion_reason is null group by lane order by 5 desc""")
excl=q("""select split_part(exclusion_reason,':',1) as "Exclusion reason", count(*) as "Rows"
 from out.fl_pool_v1 where exclusion_reason is not null group by 1 order by 2 desc""")
own=q("""select coalesce(owner_source,'(none)') as "Owner source", count(*) as "Rows",
 round(100.0*count(*)/sum(count(*)) over (),1)::text||'%' as "Share"
 from out.fl_pool_v1 where exclusion_reason is null group by 1 order by 2 desc""")
ct=q("""select county_tier as "County tier", count(*) as "All eligible",
 count(*) filter (where tier='intersection') as "Intersection"
 from out.fl_pool_v1 where exclusion_reason is null group by 1 order by 2 desc""")
contact=q("""select tier as "Tier", count(*) as "Eligible",
 count(fmcsa_phone) as "FMCSA phone", count(anchor_email) as "Email",
 count(nullif(website,'')) as "Website", count(*) filter (where last_annual_report='2026') as "2026 annual report"
 from out.fl_pool_v1 where exclusion_reason is null group by 1 order by 2 desc""")
mm=q("""select sunbiz_match_method as "Sunbiz match", count(*) as "Eligible",
 count(*) filter (where tier='intersection') as "Intersection"
 from out.fl_pool_v1 where exclusion_reason is null and sunbiz_match_method is not null
 group by 1 order by 2 desc""")
open("out/FL_POOL_v1_STATS.md","w").write(f"""# FL_POOL_v1 stats

Generated {T}. 134,719 candidate rows; **{q("select count(*) from out.fl_pool_v1 where exclusion_reason is null")[1][0]}** eligible.
No row was deleted — every rejected row remains in `out/FL_POOL_v1.csv` with an
`exclusion_reason`, so the funnel can be audited end to end.

## Eligible rows by tier and lane

{tbl(tier_lane)}
The three arms exist so David's verdicts can say which source earned the pass. Batch 1
draws 30 / 10 / 10 from intersection / anchor_only / ucc_only.

## Why rows were excluded

{tbl(excl)}
`has_finance_officer` is worth noting: Providence's box treats a CFO or controller as a
disqualifier because they want the owner-operator who decides alone. Sunbiz officer
titles surface that from the state record, before any web lookup.

`already_touched` is the trust-critical one — companies Providence or Quintel has
already contacted, matched on name+city or domain against the prod delivery record
(including the 100 rows sent to Providence on 2026-08-27) and David's April vendor list.

## Owner naming

{tbl(own)}

## Sunbiz match method

{tbl(mm)}
`name_only` rows matched Sunbiz on company name but not city — typically a carrier
whose physical yard sits in a different city from its corporate principal address.
They are kept and flagged; batch 1 prefers `name_city`, and David's verdicts will show
whether the distinction matters.

## County tier

{tbl(ct)}
Tiers are derived from county population (10 largest = BIG_METRO, next 26 =
SMALL_METRO, remaining 31 = RURAL). The playbook cites a 30/26/10 split from Alek's
P2, but that list is not in the vault. County itself comes from FMCSA's FIPS code,
DBPR's own county numbering, FDEP's plain county name, or a city→county crosswalk
built from FMCSA, in that order.

## Contactability

{tbl(contact)}
Website coverage is the standing gap and the reason C2 runs Places and Exa. The
2026-annual-report column is the strongest quality signal in the batch: it means the
company itself confirmed its officer list with the State of Florida this year, which
directly answers the "person left years ago" failure mode from David's April list.
""")
print(open("out/FL_POOL_v1_STATS.md").read())
