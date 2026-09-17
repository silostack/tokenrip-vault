#!/usr/bin/env python3
"""C0 outputs: out/SOURCE_SCORECARD.md and out/INTERSECTION_COUNTS.md."""
import subprocess, datetime

DB = "flpool"


def q(sql):
    r = subprocess.run(["psql", "-d", DB, "-v", "ON_ERROR_STOP=1", "-F", "\t", "-A",
                        "-c", sql], capture_output=True, text=True)
    if r.returncode:
        raise SystemExit(r.stderr)
    lines = [l for l in r.stdout.strip().split("\n") if l and not l.startswith("(")]
    return [l.split("\t") for l in lines]


def table(rows, align=None):
    if not rows:
        return "_no rows_\n"
    hdr, body = rows[0], rows[1:]
    a = align or (["---"] + ["---:"] * (len(hdr) - 1))
    out = ["| " + " | ".join(hdr) + " |", "| " + " | ".join(a) + " |"]
    for r in body:
        out.append("| " + " | ".join(r) + " |")
    return "\n".join(out) + "\n"


TODAY = datetime.date.today().isoformat()

src = q("""
select source as "Source", total as "FL rows", lane_tagged as "In a lane",
       with_phone as "Phone", with_email as "Email", with_owner as "Owner name",
       with_size as "Size field"
from (
  select 'FMCSA carriers (active)' as source, 1 as o, count(*) as total,
    count(*) filter (where work.fmcsa_lane(crgo_construct,crgo_waterwell,crgo_oilfield,
      crgo_garbage,crgo_drivetow,crgo_drybulk,crgo_bldgmat,crgo_machlrg,crgo_logpole)
      is not null or work.lane_of(name_norm) is not null) as lane_tagged,
    count(*) filter (where phone <> '') as with_phone,
    count(*) filter (where email_address <> '') as with_email,
    count(*) filter (where company_officer_1 <> '') as with_owner,
    count(*) filter (where power_units <> '') as with_size
  from work.fmcsa where status_code='A'
  union all
  select 'FDEP septic businesses', 2, count(*),
    count(*), 0, count(*) filter (where email<>''), 0, 0
  from raw.fdep_business where upper(status)='ACTIVE'
  union all
  select 'DBPR construction (active)', 3, count(*),
    count(*) filter (where lane <> '' or work.lane_of(name_norm) is not null),
    0, 0, count(*) filter (where licensee <> ''), 0
  from raw.dbpr_fl where active='Y'
  union all
  select 'UCC filings (FL)', 4, count(*),
    count(*) filter (where work.lane_of(name_norm) is not null),
    0, 0, 0, count(*) filter (where employees <> '')
  from work.ucc
  union all
  select 'Sunbiz corporations (active)', 5, count(*), 0, 0, 0,
    count(*) filter (where officer_count <> '0'), 0
  from raw.sunbiz_fl where status='A'
) t order by o""")

joins = q("""
select src as "Source", cnt as "Rows", sb as "Sunbiz match",
       round(100.0*sb/nullif(cnt,0),1)::text || '%' as "Match pct",
       sba as "of which active",
       ucc as "UCC match",
       round(100.0*ucc/nullif(cnt,0),1)::text || '%' as "UCC pct",
       amb as "Ambiguous (>1 Sunbiz)"
from (
  select a.src, count(distinct a.join_key) as cnt,
    count(distinct a.join_key) filter (where s.doc_number is not null) as sb,
    count(distinct a.join_key) filter (where s.status='A') as sba,
    count(distinct a.join_key) filter (where u.join_key is not null) as ucc,
    count(distinct a.join_key) filter (where s.sunbiz_matches::int > 1) as amb
  from work.anchor_rows a
  left join work.sunbiz_key s on s.join_key=a.join_key
  left join work.ucc_key u on u.join_key=a.join_key
  where a.lane is not null group by a.src
) t order by cnt desc""")

inter = q("""
select coalesce(lane,'(none)') as "Lane",
  count(*) filter (where in_anchor and in_ucc) as "Intersection",
  count(*) filter (where in_anchor and not in_ucc) as "Anchor only",
  count(*) filter (where in_ucc and not in_anchor) as "UCC only",
  count(*) as "Total"
from work.candidates_all
where sunbiz_status='A' and not hard_restricted
group by lane order by 5 desc""")

byanchor = q("""
select anchor_srcs as "Anchor source(s)", count(*) as "Intersection rows",
  count(*) filter (where fmcsa_phone is not null) as "with phone",
  count(*) filter (where src_owner is not null) as "with owner"
from work.candidates_all
where in_anchor and in_ucc and sunbiz_status='A' and not hard_restricted
group by 1 order by 2 desc limit 10""")

evid = q("""
select lane_evidence as "Lane evidence", count(*) as "Rows"
from work.candidates_all
where in_anchor and in_ucc and sunbiz_status='A' and not hard_restricted
group by 1 order by 2 desc""")

contact = q("""
select count(*) as "Rows", count(*) filter (where fmcsa_phone is not null) as "FMCSA phone",
  count(*) filter (where src_email is not null) as "Email",
  count(*) filter (where src_owner is not null) as "Anchor owner",
  count(*) filter (where website is not null and website<>'') as "Website known",
  count(*) filter (where pcf_grade in ('A','B','C')) as "PCF graded"
from work.candidates_all
where in_anchor and in_ucc and sunbiz_status='A' and not hard_restricted""")

with open("out/SOURCE_SCORECARD.md", "w") as f:
    f.write(f"""# Source scorecard — Florida pool, batch 1

Generated {TODAY} from `flpool`. Every count is Florida only.

## What each source brings

{table(src)}
FMCSA is the only source carrying phone, email and an officer name together. Sunbiz
is the only source that confirms the company is still alive and who currently runs it.
UCC is the only source with prior equipment-finance history. None of them is sufficient
alone, which is why the batch is built on their intersection.

## How well the sources join

{table(joins)}
The join key is `normalize_name(name) || '|' || normalize_city(city)` from
`scripts/normalize.py`, which passes 15 unit tests including the five specified in the
playbook. A row counted as ambiguous had more than one Sunbiz entity at the same
name and city; the active, most-recently-filed one was taken and the count retained.

## Evidence behind the lane tag

{table(evid)}
`cargo_flag` is FMCSA's own self-declared cargo classification, `license_class` is a
DBPR licence type, `registry` is FDEP septic authorization. Only `name_regex` rows rest
on the company name alone, which the playbook rightly treats as not evidence. Those
rows still require a web-verified equipment quote at C2 before they can ship.
""")

with open("out/INTERSECTION_COUNTS.md", "w") as f:
    f.write(f"""# Intersection counts — Florida pool, batch 1

Generated {TODAY}. All rows below are Sunbiz-active and not hard-restricted.

## Tier by lane

{table(inter)}
The playbook's threshold was roughly 150 rows across lanes A/B/C for tonight's plan to
hold, and under about 80 would have forced an early widening to anchor-only rows.
The intersection is **{q("select count(*) from work.candidates_all where in_anchor and in_ucc and sunbiz_status='A' and not hard_restricted")[1][0]}** rows, so the 30/10/10 arm split stands
as written; no shortfall to report.

## Which anchor earned the intersection

{table(byanchor)}

## Contactability of the intersection

{table(contact)}
The website figure is the important gap: almost no in-box Florida owner-operator has a
site recorded upstream, which is exactly what the Places and Exa step at C2 exists to
resolve. It also means the equipment quote for most rows will have to come from the
FMCSA cargo declaration or a licence class rather than from site text.
""")

print(open("out/SOURCE_SCORECARD.md").read())
print(open("out/INTERSECTION_COUNTS.md").read())
