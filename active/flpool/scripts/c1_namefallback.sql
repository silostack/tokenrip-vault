-- C1 addendum: the name-only Sunbiz fallback the playbook specifies at C0 step 3.
--
-- 83.7% of intersection rows rejected as 'no_sunbiz_match' do match Sunbiz on
-- name_norm alone. The city is the failure point: a carrier's physical address is
-- often a yard or PO box in a different city from the corporation's principal
-- address. These are recovered but flagged, so David's verdicts can tell us whether
-- a name-only match is worse than a name+city match. Batch 1 prefers name+city.

alter table out.fl_pool_v1 add column if not exists sunbiz_match_method text;
update out.fl_pool_v1 set sunbiz_match_method = 'name_city' where doc_number is not null;

with recov as (
  select p.join_key, n.doc_number, n.name, n.status, n.file_date, n.tib_years,
         n.prin_city, n.prin_zip, n.report_year1, n.name_matches
  from out.fl_pool_v1 p
  join work.sunbiz_name n on n.name_norm = p.name_norm
  where p.exclusion_reason = 'no_sunbiz_match'
)
update out.fl_pool_v1 p
set doc_number = r.doc_number,
    sunbiz_status = r.status,
    file_date = r.file_date,
    tib_years = r.tib_years,
    prin_city = r.prin_city,
    prin_zip = r.prin_zip,
    last_annual_report = r.report_year1,
    sunbiz_matches = r.name_matches,
    sunbiz_match_method = 'name_only',
    company = coalesce(nullif(r.name,''), p.company)
from recov r where r.join_key = p.join_key;

-- Re-derive owner and the finance-officer flag for the recovered rows.
update out.fl_pool_v1 p
set owner_name = o.owner_name, owner_title = o.owner_title, owner_source = 'sunbiz',
    owner_first = o.owner_first, owner_last = o.owner_last
from work.owner o
where o.doc_number = p.doc_number and p.sunbiz_match_method = 'name_only';

update out.fl_pool_v1 p set has_finance_officer = true
from work.has_finance_officer f
where f.doc_number = p.doc_number and p.sunbiz_match_method = 'name_only';

-- Re-evaluate the exclusion for recovered rows only.
update out.fl_pool_v1 p
set exclusion_reason = case
    when p.doc_number is null                              then 'no_sunbiz_match'
    when p.sunbiz_status <> 'A'                            then 'sunbiz_inactive'
    when e.source_list is not null then 'already_touched:' || e.source_list
    when p.kill_reason is not null and p.kill_reason <> '' then 'ucc_killed:' || p.kill_reason
    when p.has_finance_officer                             then 'has_finance_officer'
    when p.owner_name is null                              then 'no_owner_named'
    else null end
from (select p2.join_key, (select x.source_list from raw.exclusions x
                           where x.join_key = p2.join_key limit 1) as source_list
      from out.fl_pool_v1 p2 where p2.sunbiz_match_method = 'name_only') e
where e.join_key = p.join_key and p.sunbiz_match_method = 'name_only';
analyze out.fl_pool_v1;
