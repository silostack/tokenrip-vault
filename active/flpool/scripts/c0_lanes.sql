-- C0 step 1: one lane-tagging rule, applied identically to every source.
--
-- The playbook's raw regexes are substring matches and over-fire badly: VAC hits
-- VACATION, TOW hits TOWN/TOWER, WELL hits CALDWELL/WELLNESS, SAND hits SANDERS,
-- SPA hits SPACE. Word boundaries (\m \M) are used wherever the token is a common
-- substring of an unrelated word.

create or replace function work.lane_of(n text) returns text as $$
  select case
    when n is null or n = '' then null
    -- A_VAC: vacuum / septic / portable sanitation
    when n ~ '(\mHYDRO ?VAC|\mVAC\M|\mVACS\M|VACUUM|SEPTIC|\mSEWER|GREASE|LIQUID WASTE|SANITATION|PORT A |PORTA ?JOHN|PORTABLE TOILET|\mPUMPING\M|\mPUMP (TRUCK|SERVICE))' then 'A_VAC'
    -- A_DIRT: excavation / underground utility / drilling
    when n ~ '(EXCAVAT|GRADING|SITE ?WORK|SITE PREP|LAND CLEARING|UNDERGROUND|UTILIT|TRACKHOE|BACKHOE|DOZER|\mWELL DRILL|DRILLING|\mBORING\M|TRENCH|PIPELINE|\mDIRT\M|\mSEPTIC)' then 'A_DIRT'
    -- B: paving / aggregate / dump / heavy civil
    when n ~ '(PAVING|ASPHALT|CONCRETE|MILLING|\mHAUL|\mDUMP\M|\mDUMP TRUCK|AGGREGATE|\mGRAVEL\M|\mSAND AND GRAVEL|HEAVY CIVIL|\mPAVERS?\M)' then 'B'
    -- C: roll-off / waste / towing and recovery
    when n ~ '(\mTOW\M|\mTOWS\M|TOWING|WRECKER|ROLL ?OFF|DUMPSTER|\mWASTE|DISPOSAL|RECYCL|\mJUNK\M|\mHAULING\M)' then 'C'
    else null
  end
$$ language sql immutable;

-- Hard restrictions always exclude, whatever the lane says.
create or replace function work.hard_restricted(n text) returns boolean as $$
  select coalesce(n ~ '(\mSOLAR\M|CANNABIS|\mHEMP\M|DISPENSAR|MEDICAL|DENTAL|ORTHODON|\mSALON\M|\mSPA\M|MED ?SPA|FITNESS|\mGYM\M|CHURCH|MINISTR|\mSCHOOL|ACADEMY|\mCOUNTY OF|\mCITY OF\M|\mTOWN OF\M|VENDING|\mATM\M|CRYPTO|\mREALTY\M|REAL ESTATE|VACATION|\mCHIROPRACT|VETERINAR|PHARMAC|\mSALOON\M|TATTOO|\mNAILS?\M)', false)
$$ language sql immutable;

-- Soft restrictions exclude only when nothing puts the company in a lane. A dump
-- operator named "X TRANSPORT" is in the box; a general-freight "X TRANSPORT" is not.
create or replace function work.soft_restricted(n text) returns boolean as $$
  select coalesce(n ~ '(\mFREIGHT\M|LOGISTIC|\mCARRIERS?\M|\mEXPRESS\M|\mCOURIER|\mMARINE\M|\mBOATS?\M|\mYACHT|\mAVIATION\M|\mAIRCRAFT\M|\mFOUNDATION\M|\mMINISTRIES\M|\mRESTAURANT|\mCAFE\M|\mPIZZA\M)', false)
$$ language sql immutable;

-- FMCSA carries self-declared cargo flags, which are real evidence in a way a
-- company name never is. This takes precedence over the name tag for carriers.
create or replace function work.fmcsa_lane(construct text, waterwell text, oilfield text,
                                           garbage text, drivetow text, drybulk text,
                                           bldgmat text, machlrg text, logpole text)
returns text as $$
  select case
    when coalesce(garbage,'') not in ('','N','0') then 'C'
    when coalesce(drivetow,'') not in ('','N','0') then 'C'
    when coalesce(construct,'') not in ('','N','0') then 'A_DIRT'
    when coalesce(waterwell,'') not in ('','N','0') then 'A_DIRT'
    when coalesce(oilfield,'') not in ('','N','0') then 'A_DIRT'
    when coalesce(drybulk,'') not in ('','N','0') then 'B'
    when coalesce(bldgmat,'') not in ('','N','0') then 'B'
    when coalesce(machlrg,'') not in ('','N','0') then 'B'
    when coalesce(logpole,'') not in ('','N','0') then 'B'
    else null
  end
$$ language sql immutable;
