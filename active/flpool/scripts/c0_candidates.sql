-- C0 steps 3-5: resolve Sunbiz, then union every anchor into work.candidates_all.

-- One Sunbiz row per join_key. A name+city can repeat (a dissolved entity and its
-- successor), so prefer status A, then the most recent filing, and record how many
-- candidates there were so ambiguity is visible rather than silently resolved.
drop table if exists work.sunbiz_key;
create table work.sunbiz_key as
select distinct on (join_key)
       join_key, name_norm, prin_city_norm as city_norm, doc_number, name, status,
       file_date, tib_years, prin_addr1, prin_city, prin_zip, prin_state,
       report_year1, ra_name, officer_count,
       count(*) over (partition by join_key) as sunbiz_matches
from raw.sunbiz_fl
where join_key <> '|' and name_norm <> ''
order by join_key, (status='A') desc, file_date desc nulls last;
create index ix_sbk_join on work.sunbiz_key (join_key);
create index ix_sbk_name on work.sunbiz_key (name_norm);

-- Name-only fallback, for anchors whose city differs from the Sunbiz principal city.
drop table if exists work.sunbiz_name;
create table work.sunbiz_name as
select distinct on (name_norm)
       name_norm, doc_number, name, status, file_date, tib_years, prin_city, prin_zip,
       report_year1, count(*) over (partition by name_norm) as name_matches
from raw.sunbiz_fl
where name_norm <> '' and status = 'A'
order by name_norm, file_date desc nulls last;
create index ix_sbn_name on work.sunbiz_name (name_norm);

-- One UCC row per company: the most recent filing, plus counts and best grade.
drop table if exists work.ucc_key;
create table work.ucc_key as
select distinct on (join_key)
       join_key, name_norm, city_norm, company_id, debtor, company_name, debtor_city,
       secured_party, lender_class, filing_number, filing_date, ripe_date, ripe_basis,
       dueness, pcf_grade, score, n_future_filings, median_gap_months, kill_reason,
       status as ucc_status, validation_outcome, website, domain, naics, sector,
       employees, revenue_usd, founded_year,
       count(*) over (partition by join_key) as ucc_filings
from work.ucc
where join_key <> '|' and name_norm <> ''
order by join_key, (kill_reason is null) desc,
         (pcf_grade = 'A') desc, (pcf_grade = 'B') desc, (pcf_grade = 'C') desc,
         filing_date desc nulls last;
create index ix_ucck_join on work.ucc_key (join_key);

-- ---------------------------------------------------------------------------
-- Anchors, unioned. Each row is one (join_key, source) pair.
drop table if exists work.anchor_rows;
create table work.anchor_rows as
-- FMCSA: cargo flags take precedence over the name tag.
select f.join_key, 'fmcsa'::text as src, f.legal_name as src_name, f.phy_city as src_city,
       coalesce(work.fmcsa_lane(f.crgo_construct, f.crgo_waterwell, f.crgo_oilfield,
                                f.crgo_garbage, f.crgo_drivetow, f.crgo_drybulk,
                                f.crgo_bldgmat, f.crgo_machlrg, f.crgo_logpole),
                work.lane_of(f.name_norm)) as lane,
       case when work.fmcsa_lane(f.crgo_construct, f.crgo_waterwell, f.crgo_oilfield,
                                 f.crgo_garbage, f.crgo_drivetow, f.crgo_drybulk,
                                 f.crgo_bldgmat, f.crgo_machlrg, f.crgo_logpole) is not null
            then 'cargo_flag' else 'name_regex' end as lane_evidence,
       nullif(f.phone,'') as src_phone, nullif(f.email_address,'') as src_email,
       nullif(f.company_officer_1,'') as src_owner, f.phy_cnty as src_county,
       nullif(f.power_units,'')::numeric as size_units, f.dot_number as src_id
from work.fmcsa f
where f.status_code = 'A' and f.name_norm <> ''
union all
-- FDEP septic business authorizations: registry membership IS the lane evidence.
select b.join_key, 'fdep', b.business_name, b.city, 'A_VAC', 'registry',
       null, nullif(b.email,''), null, b.county, null, b.auth_number
from raw.fdep_business b
where upper(b.status) = 'ACTIVE' and b.name_norm <> ''
union all
-- DBPR: the licence class is the lane evidence.
select d.join_key, 'dbpr', d.business_name, d.city,
       case when d.occupation = 'CUC' then 'A_DIRT'
            when d.occupation in ('CGC','CBC','CRC') then 'B'
            when d.occupation in ('CFC','CMC','CAC','CCC','CPC','SCC') then 'E'
            else work.lane_of(d.name_norm) end,
       case when d.occupation = 'QB' then 'name_regex' else 'license_class' end,
       null, null, nullif(d.licensee,''), nullif(d.county_code,''), null, d.license_number
from raw.dbpr_fl d
where d.active = 'Y' and d.name_norm <> '';
create index ix_anch_join on work.anchor_rows (join_key);

-- ---------------------------------------------------------------------------
drop table if exists work.candidates_all;
create table work.candidates_all as
with anchors as (
  select join_key,
         bool_or(src='fmcsa') as in_fmcsa,
         bool_or(src='fdep')  as in_fdep,
         bool_or(src='dbpr')  as in_dbpr,
         string_agg(distinct src, '+' order by src) as anchor_srcs,
         max(src_name) as anchor_name, max(src_city) as anchor_city,
         (array_agg(lane order by (lane_evidence in ('registry','license_class','cargo_flag')) desc,
                                  lane nulls last))[1] as anchor_lane,
         (array_agg(lane_evidence order by (lane_evidence in ('registry','license_class','cargo_flag')) desc))[1] as lane_evidence,
         max(src_phone) as fmcsa_phone, max(src_email) as src_email,
         max(src_owner) as src_owner, max(src_county) as src_county,
         max(size_units) as power_units,
         string_agg(distinct src||':'||src_id, ';') as anchor_ids
  from work.anchor_rows
  where lane is not null
  group by join_key
),
keys as (
  select join_key from anchors
  union
  select join_key from work.ucc_key where work.lane_of(name_norm) is not null
)
select k.join_key,
       split_part(k.join_key,'|',1) as name_norm,
       split_part(k.join_key,'|',2) as city_norm,
       coalesce(a.in_fmcsa,false) as in_fmcsa,
       coalesce(a.in_fdep,false)  as in_fdep,
       coalesce(a.in_dbpr,false)  as in_dbpr,
       (a.join_key is not null)   as in_anchor,
       (u.join_key is not null)   as in_ucc,
       a.anchor_srcs, a.anchor_ids, a.anchor_name, a.anchor_city,
       coalesce(a.anchor_lane, work.lane_of(u.name_norm)) as lane,
       coalesce(a.lane_evidence, 'name_regex') as lane_evidence,
       a.fmcsa_phone, a.src_email, a.src_owner, a.src_county, a.power_units,
       s.doc_number, s.name as sunbiz_name, s.status as sunbiz_status,
       s.file_date, s.tib_years, s.prin_city, s.prin_zip, s.report_year1,
       s.sunbiz_matches,
       u.company_id, u.company_name, u.debtor, u.secured_party, u.lender_class,
       u.filing_number, u.filing_date, u.ripe_date, u.ripe_basis, u.dueness,
       u.pcf_grade, u.score, u.n_future_filings, u.median_gap_months, u.kill_reason,
       u.ucc_filings, u.website, u.domain, u.naics, u.sector, u.employees,
       work.hard_restricted(split_part(k.join_key,'|',1)) as hard_restricted,
       work.soft_restricted(split_part(k.join_key,'|',1)) as soft_restricted
from keys k
left join anchors a       on a.join_key = k.join_key
left join work.sunbiz_key s on s.join_key = k.join_key
left join work.ucc_key u    on u.join_key = k.join_key;
create index ix_cand_join on work.candidates_all (join_key);
create index ix_cand_lane on work.candidates_all (lane);
analyze;
