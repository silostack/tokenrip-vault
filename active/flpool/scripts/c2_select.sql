-- C2 selection: a generous enrichment batch per arm and lane, not a hard 50.
-- The 50 gets chosen from this at C5; the remainder is the continuation bench.
-- Size is set by the Twilio cap ($5 / $0.008 = ~625 lookups).

drop table if exists work.c2_batch;
create table work.c2_batch as
with enriched as (
  select p.*,
         f.mcs150_date, f.power_units as fm_power_units, f.owntruck, f.add_date as dot_add_date,
         f.email_address as fm_email, f.company_officer_1 as fm_officer,
         f.carrier_operation, f.dot_number, f.phy_street, f.total_drivers,
         d.occupation as dbpr_occupation, d.license_number as dbpr_license,
         d.expiration_date as dbpr_expiry, d.licensee as dbpr_qualifier,
         b.auth_number as fdep_auth, b.expiration_date as fdep_expiry, b.email as fdep_email,
         case when f.mcs150_date <> '' and f.mcs150_date::date > current_date - interval '2 years'
              then 1 when f.mcs150_date <> '' and f.mcs150_date::date > current_date - interval '5 years'
              then 2 else 3 end as mcs_freshness
  from out.fl_pool_v1 p
  left join work.fmcsa f on f.join_key = p.join_key and f.status_code='A'
  left join lateral (select * from raw.dbpr_fl x where x.join_key=p.join_key and x.active='Y'
                     order by (x.occupation='CUC') desc, x.expiration_date desc limit 1) d on true
  left join lateral (select * from raw.fdep_business y where y.join_key=p.join_key
                     and upper(y.status)='ACTIVE' limit 1) b on true
  where p.exclusion_reason is null
),
ranked as (
  select e.*,
         row_number() over (partition by tier, lane order by
           (sunbiz_match_method='name_city') desc,
           case county_tier when 'RURAL' then 1 when 'SMALL_METRO' then 2
                            when 'BIG_METRO' then 3 else 4 end,
           case pcf_grade when 'A' then 1 when 'B' then 2 when 'C' then 3 else 4 end,
           -- an owner-operator fleet, not a single truck and not a 40-truck carrier
           case when coalesce(nullif(fm_power_units,'')::numeric,0) between 2 and 15 then 1
                when coalesce(nullif(fm_power_units,'')::numeric,0) = 1 then 2 else 3 end,
           mcs_freshness,
           coalesce(nullif(dueness,'')::numeric,0) desc,
           (fmcsa_phone is not null) desc,
           coalesce(nullif(tib_years,'')::numeric,0) desc
         ) as rk
  from enriched e
)
select * from ranked
where (tier='intersection' and rk <= case lane when 'A_VAC' then 70 when 'A_DIRT' then 80
                                               when 'B' then 70 when 'C' then 55 else 35 end)
   or (tier='anchor_only'  and rk <= case lane when 'A_VAC' then 70 when 'A_DIRT' then 45
                                               when 'B' then 40 when 'C' then 35 else 20 end)
   or (tier='ucc_only'     and rk <= case lane when 'A_VAC' then 45 when 'A_DIRT' then 30
                                               when 'B' then 25 when 'C' then 20 else 15 end);
analyze work.c2_batch;
