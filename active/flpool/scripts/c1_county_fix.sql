-- County resolution, corrected.
--
-- FMCSA's phy_cnty is a Florida county FIPS code (086 = Miami-Dade, 011 = Broward),
-- not a name, so the first pass matched nothing. DBPR uses its own unrelated numbering
-- (23 = Dade, 16 = Broward), derived empirically from CONSTRUCTIONLICENSE_2's plain
-- county names joined on the alternate licence number.

drop table if exists work.fips_county;
create table work.fips_county (code text primary key, county text);
insert into work.fips_county values
 ('001','ALACHUA'),('003','BAKER'),('005','BAY'),('007','BRADFORD'),('009','BREVARD'),
 ('011','BROWARD'),('013','CALHOUN'),('015','CHARLOTTE'),('017','CITRUS'),('019','CLAY'),
 ('021','COLLIER'),('023','COLUMBIA'),('025','MIAMI-DADE'),('027','DESOTO'),('029','DIXIE'),
 ('031','DUVAL'),('033','ESCAMBIA'),('035','FLAGLER'),('037','FRANKLIN'),('039','GADSDEN'),
 ('041','GILCHRIST'),('043','GLADES'),('045','GULF'),('047','HAMILTON'),('049','HARDEE'),
 ('051','HENDRY'),('053','HERNANDO'),('055','HIGHLANDS'),('057','HILLSBOROUGH'),
 ('059','HOLMES'),('061','INDIAN RIVER'),('063','JACKSON'),('065','JEFFERSON'),
 ('067','LAFAYETTE'),('069','LAKE'),('071','LEE'),('073','LEON'),('075','LEVY'),
 ('077','LIBERTY'),('079','MADISON'),('081','MANATEE'),('083','MARION'),('085','MARTIN'),
 ('086','MIAMI-DADE'),('087','MONROE'),('089','NASSAU'),('091','OKALOOSA'),
 ('093','OKEECHOBEE'),('095','ORANGE'),('097','OSCEOLA'),('099','PALM BEACH'),
 ('101','PASCO'),('103','PINELLAS'),('105','POLK'),('107','PUTNAM'),('109','ST JOHNS'),
 ('111','ST LUCIE'),('113','SANTA ROSA'),('115','SARASOTA'),('117','SEMINOLE'),
 ('119','SUMTER'),('121','SUWANNEE'),('123','TAYLOR'),('125','UNION'),('127','VOLUSIA'),
 ('129','WAKULLA'),('131','WALTON'),('133','WASHINGTON');

-- City -> county name, rebuilt now that FMCSA's codes resolve to names.
drop table if exists work.city_county;
create table work.city_county as
select city_norm, county from (
  select f.city_norm, fc.county, count(*) n,
         row_number() over (partition by f.city_norm order by count(*) desc) rk
  from work.fmcsa f join work.fips_county fc on fc.code = lpad(trim(f.phy_cnty),3,'0')
  where f.city_norm <> '' and f.phy_state = 'FL'
  group by 1,2
) t where rk = 1;
create index ix_cc_city on work.city_county (city_norm);
