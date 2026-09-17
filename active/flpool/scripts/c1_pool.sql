-- C1: out.fl_pool_v1. Every candidate is kept; rows that fail a rule leave with an
-- exclusion_reason rather than being deleted, so the funnel is auditable.

drop table if exists out.fl_pool_v1;
create table out.fl_pool_v1 as
with base as (
  select c.*,
         -- County: FMCSA states it outright; otherwise infer from the city.
         coalesce(nullif(upper(trim(c.src_county)),''), cc.county) as county_raw
  from work.candidates_all c
  left join work.city_county cc on cc.city_norm = c.city_norm
),
resolved as (
  select b.*,
         case when b.county_raw ~ '^[0-9]+$' then cc2.county else b.county_raw end as county,
         o.owner_name as sb_owner_name, o.owner_title as sb_owner_title,
         o.owner_first as sb_owner_first, o.owner_last as sb_owner_last,
         (f.doc_number is not null) as has_finance_officer,
         e.source_list as excl_source, e.touched_on as excl_touched_on
  from base b
  left join work.city_county cc2 on cc2.city_norm = b.city_norm
  left join work.owner o on o.doc_number = b.doc_number
  left join work.has_finance_officer f on f.doc_number = b.doc_number
  left join lateral (
     select x.source_list, x.touched_on from raw.exclusions x
     where x.join_key = b.join_key
        or (x.domain <> '' and x.domain = lower(nullif(b.domain,'')))
     limit 1
  ) e on true
)
select
  r.join_key, r.name_norm, r.city_norm,
  coalesce(r.sunbiz_name, r.anchor_name, r.company_name, r.debtor) as company,
  r.anchor_name as anchor_name,
  -- tier / arm
  case when r.in_anchor and r.in_ucc then 'intersection'
       when r.in_anchor then 'anchor_only'
       else 'ucc_only' end as tier,
  r.lane, r.lane_evidence,
  r.in_fmcsa, r.in_fdep, r.in_dbpr, r.in_ucc, r.anchor_srcs, r.anchor_ids,
  -- owner: Sunbiz first (confirmed in the annual report), licence holder second
  coalesce(r.sb_owner_name, nullif(r.src_owner,'')) as owner_name,
  coalesce(r.sb_owner_title, case when r.src_owner <> '' then 'LICENSE HOLDER' end) as owner_title,
  case when r.sb_owner_name is not null then 'sunbiz'
       when nullif(r.src_owner,'') is not null then 'license' end as owner_source,
  r.sb_owner_first as owner_first, r.sb_owner_last as owner_last,
  -- sunbiz
  r.doc_number, r.sunbiz_status, r.file_date, r.tib_years, r.prin_city, r.prin_zip,
  r.report_year1 as last_annual_report, r.sunbiz_matches, r.has_finance_officer,
  -- geography
  r.county,
  coalesce(t.tier, 'UNKNOWN') as county_tier,
  -- anchors
  r.fmcsa_phone, r.src_email as anchor_email, r.power_units,
  -- ucc
  r.company_id as prod_company_id, r.secured_party, r.lender_class, r.filing_number,
  r.filing_date, r.ripe_date, r.ripe_basis, r.dueness, r.pcf_grade, r.score,
  r.n_future_filings, r.median_gap_months, r.kill_reason, r.ucc_filings,
  r.website, r.domain, r.naics, r.sector, r.employees,
  -- exclusions: first reason wins, row is kept either way
  case
    when r.hard_restricted                              then 'restricted_name'
    when r.doc_number is null                           then 'no_sunbiz_match'
    when r.sunbiz_status <> 'A'                         then 'sunbiz_inactive'
    when r.excl_source is not null                      then 'already_touched:' || r.excl_source
    when r.kill_reason is not null and r.kill_reason<>''then 'ucc_killed:' || r.kill_reason
    when r.has_finance_officer                          then 'has_finance_officer'
    when r.soft_restricted and r.lane_evidence='name_regex' then 'restricted_soft_no_evidence'
    when r.owner_name_missing                           then 'no_owner_named'
    else null
  end as exclusion_reason
from (select *, (coalesce(sb_owner_name, nullif(src_owner,'')) is null) as owner_name_missing
      from resolved) r
left join work.county_tier t on t.county = r.county;

create index ix_p1_tier on out.fl_pool_v1 (tier);
create index ix_p1_lane on out.fl_pool_v1 (lane);
create index ix_p1_excl on out.fl_pool_v1 (exclusion_reason);
analyze;
