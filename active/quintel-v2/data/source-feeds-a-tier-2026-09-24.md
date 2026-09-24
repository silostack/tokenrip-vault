---
status: v0.1
last_revised: 2026-09-24
owner: Simon
serves: per-source pipeline detail behind `source-feeds.md`; generated from `source-feeds-a-tier-2026-09-24.json` by `scripts/render_source_feeds.py`. Do not hand-edit; change the JSON and re-render
tier: internal
---

# A-tier source feeds: per-source detail

One block per source, grouped by state. First pass: six agents fetched each feed on 2026-09-24 from a Colombian IP. Records with a `retest` block were re-fetched from a US host (see `geoblock-retest.md`). "Verified by fetch" lists what was confirmed directly; everything else is carried over from the prior research round or inferred.


### ALL

#### ALL-g6-06 · FMCSA Company Census: intrastate vocational fleets, 2 to 7 power units — `build_now`

FMCSA (Quintel fmcsa-census connector, data.transportation.gov) · https://data.transportation.gov/Trucking-and-Motorcoaches/Company-Census-File/az4n-8mr2

- **Verdict:** Already a live Quintel connector (per prior round's note) on a confirmed near-real-time, well-structured federal table; the state cut (IN-g6-02) is just a filtered view of this same table, so there is no separate integration cost to support both.
- **Endpoint:** https://data.transportation.gov/resource/az4n-8mr2.json (national table; apply $where=carrier_operation='C' AND power_units between 2 and 7 AND relevant crgo_* flags; use $where=add_date>'YYYYMMDD' or mcs150_date>'YYYYMMDD' for incremental pulls)
- **Access / format / auth:** socrata_api · json · none for read; free app token strongly recommended (see rate_limits) · cost: free
- **Cadence:** same dataset as IN-g6-02: rowsUpdatedAt = 2026-09-24T14:13:20Z at fetch time, i.e. effectively continuous/daily refresh, not a periodic batch
- **Latency:** roughly 1-2 days (see IN-g6-02); consistent nationwide since it's one table
- **History:** current-state snapshot only, no built-in history -- see IN-g6-02
- **Incremental pull:** yes, on add_date or mcs150_date, same as IN-g6-02, now unfiltered by state so a national daily pull is possible
- **Volume:** not independently measured this round beyond the IN-specific figures already reported under IN-g6-02; national volume would need per-state or date-range aggregation once rate limiting is resolved
- **Total records:** 4,507,605 total rows in the table (all carrier_operation types, all states); IN alone has 39,771 carrier_operation=C rows, so a national vocational/intrastate slice (2-7 power units, target cargo flags) is plausibly in the low hundreds of thousands but was not directly counted this round (throttled)
- **Record names:** motor carrier (the equipment buyer)
- **Company fields:** legal_name, dba_name, phy_street, phy_city, phy_state, phy_zip, phy_cnty
- **Identity keys:** dot_number, docket1/2/3
- **Contact:** phone, cell_phone, fax, email_address, company_officer_1, company_officer_2
- **Contact fill:** not separately measured at national scale this round; IN-specific figure (email ~46%) is the best available proxy
- **Equipment:** direct, identical to IN-g6-02 -- power_units/truck_units are self-reported fleet counts
- **Event fields:** add_date, mcs150_date, mcs150_update_code_id
- **Industry filter:** identical crgo_* flags and carrier_operation field as IN-g6-02, applied nationally
- **Size signal:** power_units/truck_units/fleetsize, same as IN-g6-02
- **Rate limits:** same throttling observed (Too many requests on unauthenticated bursts); a national daily pull makes an app token effectively mandatory, and a national full-table pull is large (4.5M rows) so the pipeline should always filter server-side via $where rather than pulling the whole table
- **Terms / restrictions:** same as IN-g6-02 -- federal open data, no commercial-use restriction found, robots.txt permits /resource/ API access
- **Fragility:** low, same stable Socrata dataset as IN-g6-02
- **Entity resolution:** same as IN-g6-02; at national scale, dot_number remains the clean join key, legal_name/DBA is dirty
- **Build effort:** S-M: the SoQL filtering itself is trivial, but a 50-state daily pull needs pagination ($limit/$offset, Socrata caps at 50k rows/page) and the app token registration; genuinely S once that's set up since Quintel already has this connector
- **Verified by fetch:** dataset metadata (rowsUpdatedAt, 147 columns), national total_records=4,507,605, confirmed single underlying table shared with IN-g6-02, robots.txt permits /resource/ API
- **Open questions:** National count of 2-7-power-unit intrastate vocational carriers (not measured this round due to rate limiting), Whether Quintel's existing connector already handles pagination and app-token auth, or is hitting the same throttling observed here
- **Notes:** Same monthly-diff method as IN-g6-02 applies nationally: snapshot dot_number + power_units + truck_units monthly, flag power_units(t) > power_units(t-1) as a fleet-added-a-truck event, or a brand-new dot_number appearing within the target carrier_operation/cargo filter as a new-fleet event.

#### ALL-g6-09 · SBA PPP FOIA loan data (per-state cut) — `enrichment_only`

U.S. Small Business Administration (data.sba.gov) · https://data.sba.gov/dataset/ppp-foia

- **Verdict:** Confirmed to be a frozen 2020-2021 snapshot with zero contact fields and zero new records per month -- it is a one-time roster-building source for the general pool (as prior round already concluded), not a nightly feed; access method should be corrected from ckan_api to bulk_file since the CKAN API is dead.
- **Endpoint:** https://data.sba.gov/sites/default/files/distribution/SBA-OCA-2022-07-001/public_150k_plus_240930.csv (plus 13 sibling public_up_to_150k_N_240930.csv files, N=1-13, and a data dictionary xlsx at the same path)
- **Access / format / auth:** bulk_file · csv · none · cost: free
- **Cadence:** static: the data covers PPP loans approved in 2020-2021 and the filenames are dated '240930' (Sept 30, 2024 data cutoff); the file's HTTP last-modified header is 2026-06-26, meaning the page/files were re-published but the underlying loan data itself is unchanged
- **Latency:** not applicable -- this is a closed historical program, not an ongoing event feed
- **History:** all PPP loans from program start (April 2020) through program close (mid-2021), a one-time historical roster
- **Incremental pull:** no incremental pull possible or needed -- it's a fixed historical dataset; a pipeline would download once and re-check periodically only for administrative corrections
- **Volume:** 0 -- this is a frozen historical dataset, not a live feed
- **Total records:** not counted this round; the >$150k file alone is 452MB (one of 14 files), so total rows are in the millions nationally; prior round's build (PCF_POOL_v0) used 31,328 TX/FL/TN rows with 2-25 jobs as a subset
- **Record names:** PPP borrower (small business) -- not the equipment buyer directly, but a roster of small businesses by industry/headcount that predates any current buying signal
- **Company fields:** BorrowerName, BorrowerAddress, BorrowerCity, BorrowerState, BorrowerZip, ProjectCity, ProjectCountyName, ProjectState
- **Identity keys:** LoanNumber
- **Contact fill:** 0% -- no phone, email, or named contact field in the schema; address-only, confirmed by reading the CSV header row
- **Equipment:** none -- no equipment field of any kind
- **Event fields:** DateApproved, LoanStatusDate, LoanStatus, ForgivenessDate
- **Industry filter:** NAICSCode field cleanly supports filtering to preferred trades' 6-digit codes, confirmed present in the CSV header
- **Size signal:** JobsReported and BusinessAgeDescription (e.g. 'Existing or more than 2 years old') directly proxy company size/age, both confirmed in the header row
- **Rate limits:** none observed; plain static file download over HTTPS
- **Terms / restrictions:** data.sba.gov's CKAN API (package_show) returned 404 -- the portal appears to have migrated off CKAN to a Drupal-based site, so the file must be discovered via the HTML dataset page, not a documented API; no commercial-use or solicitation restriction found on the page (this is FOIA-released public data); robots.txt not separately checked this round
- **Fragility:** medium: prior round's access_method assumption of 'ckan_api' does not hold -- the CKAN action API is gone (404), so a pipeline must scrape the dataset page's HTML for current file links (which include a fixed distribution ID 'SBA-OCA-2022-07-001' in the path) rather than call a stable API endpoint
- **Entity resolution:** BorrowerName is uncontrolled free text with no state registration ID; prior round's note that liveness must be re-verified via Sunbiz/Comptroller-style state business registries still applies, since ~5 years have passed and many listed businesses may be closed or renamed
- **Build effort:** M (1-2 days): files are large (hundreds of MB each across 14 files) and need to be filtered/joined by NAICS + state + jobs range, plus a liveness-reverification step since the portal migration broke the documented API path
- **Verified by fetch:** CKAN package_show endpoint returns 404 (portal migrated to Drupal), dataset HTML page returns 200 and lists 14 CSV files plus a data dictionary, CSV header row and 2 sample rows confirm fields (no contact fields, NAICSCode and JobsReported present), public_150k_plus file content-length 452,077,279 bytes, last-modified 2026-06-26
- **Open questions:** Exact total row count and per-state breakdown (not counted this round given file size), Whether SBA periodically issues corrected/updated PPP releases that would warrant a periodic re-download, or if 2024-09-30 is truly final
- **Notes:** Matches prior round's characterization almost exactly, with one correction: access_method should be bulk_file (scrape the dataset page for current links), not ckan_api -- the CKAN action API used by that pattern (data.sba.gov/api/3/action/package_show) is dead (404) as of this test.


### CO

#### CO-g4-01 · CDOT bid tabs and weekly letting results — `build_later`

Colorado Department of Transportation · https://www.codot.gov/business/bidding/bid-tab-archives

- **Verdict:** Real, live weekly signal but low volume (a handful of projects/week) and zero contact fields; the scrape is fragile (hand-maintained HTML + Google Drive links) and would need a second dataset (CDOT prequal list) just to get a phone/address, so it's not the first build.
- **Endpoint:** None (no API). Page is a hand-built HTML table (post-2026 lettings) linking to individual PDF bid tabs hosted on Google Drive, e.g. https://drive.google.com/file/d/1Z8DafEQtlLRSC6QEif40wgnJYnr6ZRPL/view
- **Access / format / auth:** html_scrape · html table + linked PDF · none · cost: free
- **Cadence:** weekly; page lists per-letting-date rows, current entries dated Sep 2026 lettings, 'Pending' shown until the tab is posted
- **Latency:** same week; individual project PDF appears within days of the letting per prior round's note
- **History:** current year plus 2 prior years per page copy (2024, 2025, 2026 tabs linked)
- **Incremental pull:** no field-level incremental query; would need to diff the HTML table row list (by letting date/project number) run-to-run, or watch the Google Drive folder for new file IDs
- **Volume:** ~2-4 projects/week observed by row count on the page (per prior round; not independently recounted this pass)
- **Record names:** apparent low bidder (a paving/highway/utility contractor) per project, not the equipment buyer directly but is the buyer
- **Company fields:** low bidder / apparent low bidder name
- **Identity keys:** CDOT project number
- **Contact fill:** 0% on this page; would need to join to CDOT prequalified-contractor list for address/phone
- **Equipment:** indirect: winning a paving/highway/bridge contract implies near-term mobilization of pavers, rollers, trucks, but no equipment field on the page itself
- **Event fields:** letting date, project number, project description (from linked PDF)
- **Industry filter:** trade must be inferred from project description text (paving, bridge, signals, etc.); no structured trade/CSI code field on the page
- **Size signal:** bid amount is visible per project (a proxy for contractor scale on that job)
- **Rate limits:** none observed; ordinary static-ish HTML page, no robots.txt block found for this path
- **Terms / restrictions:** no commercial-use or solicitation restriction found on the page or in a quick codot.gov ToS check; public bid results are routinely republished commercially by construction-bid aggregators (e.g. Construction Journal), which suggests no blocking restriction exists
- **Fragility:** high: the page is a manually maintained HTML table linking to individual Google Drive file IDs per project, so scraping depends on stable table markup and Drive links continuing to be used year to year; no API means CDOT could restructure the page at any time
- **Entity resolution:** low bidder name is free text (contractor company names, sometimes with DBA punctuation); would need normalization and join against CDOT's prequalified contractor list or a business registry to get an address/phone/UCC-debtor match
- **Build effort:** M (1-2 days) — build an HTML table scraper plus a PDF-link watcher, then a name-normalization join step; no API shortcuts
- **Verified by fetch:** page reachable and contains a letting-date table with linked bid-tab PDFs on Google Drive, no data API exists
- **Open questions:** Does CDOT publish a structured prequalified-contractor list with contact info that can be joined by name?, Is there a machine-readable feed behind the 'Pending' status update, or is it manually edited?
- **Notes:** This is a low-volume, high-friction feed relative to the UCC and DWR sources in this batch. Treat as an enrichment source (confirms a company is actively doing CO highway work) rather than a primary nightly feed.

#### CO-g4-02 · CDPS active permits extract: construction dewatering (COG080000) and related construction general permits — `build_now`

Colorado Department of Public Health and Environment, Water Quality Control Division · https://cdphe.colorado.gov/clean-water-active-permits

- **Verdict:** Confirmed live download, clean industry filter, and (per prior round) very high phone/email fill rate — best contact-completeness of any source in this batch. Main risk is the Google Sheets link breaking on a future re-export; add a staleness/reachability check.
- **Endpoint:** https://docs.google.com/spreadsheets/d/1ZFnnmKQc6zCeiYLcEOcf43cnYb7nwA2Y/export?format=xlsx
- **Access / format / auth:** bulk_file · xlsx · none · cost: free
- **Cadence:** irregular/periodic; response headers show content-disposition filename "8-7-2026 Active Permits for Website.xlsx" — a dated filename baked into the file, confirming this is a manually re-exported snapshot rather than a live feed
- **Latency:** 1 to 6+ weeks depending on when CDPHE re-exports the sheet
- **History:** appears to be current active permits only (a live-status extract, not a historical archive) based on the filename pattern
- **Incremental pull:** no; full-file re-download only, then a pipeline must diff PermitID/IssuedDate against its own last snapshot to find what's new since the file has no API or modified-since parameter
- **Volume:** 13-35 dewatering certifications/month observed in prior round for Mar-Jul 2026 (not independently re-measured this pass)
- **Total records:** 27,550 rows x 281 columns across all CDPS permit types (per prior round); dewatering-specific subset would need filtering by GeneralPermitType
- **Record names:** permittee — usually the excavation/utility contractor taking out the dewatering certification, per prior round's finding
- **Company fields:** Permittee, FacilityName, facility address, FacilityCounty
- **Identity keys:** PermitID
- **Contact:** legal contact name/title/address/phone/email, facility contact phone/email
- **Contact fill:** ~99.9% carry legal phone and email per prior round's note (not independently re-verified this pass)
- **Equipment:** indirect: a dewatering cert implies pumps/generators about to be deployed, but no equipment field
- **Event fields:** GeneralPermitType, IssuedDate, EffectiveDate
- **Industry filter:** GeneralPermitType field cleanly isolates COG080000/COG603000/COG604000/COG317000 from the other CDPS permit types in the same 281-column sheet; SIC codes present for further trade filtering
- **Size signal:** none observed
- **Rate limits:** none; single Google Sheets export link, no auth
- **Terms / restrictions:** none found; this is a state open-data export explicitly published for public download
- **Fragility:** medium: it is a static Google Sheets export link, not an official government domain — if CDPHE regenerates the sheet under a new file ID (rather than the same shareable link), the URL breaks silently; a pipeline should verify the file is reachable and check the embedded filename date each run as a staleness check
- **Entity resolution:** 281 columns cover many unrelated CDPS permit types in one sheet, so a pipeline must filter to the dewatering GeneralPermitType values before joining; permittee name is free text, same normalization burden as any of these sources
- **Build effort:** S (<half day): direct xlsx download, filter rows by GeneralPermitType, parse — no auth or pagination
- **Verified by fetch:** download URL returns HTTP 200 with an xlsx content-disposition header dated 2026-08-07, confirms this is a snapshot export, not a live API
- **Open questions:** Does CDPHE publish a changelog or a stable canonical link if the file ID changes?, Is there a more frequently updated version behind a login, given the public one lags by weeks?
- **Notes:** Prior round's fill-rate and record-count figures were not re-measured here (file wasn't fully downloaded/parsed in this 10-minute pass) — treat those two figures as carried over, not re-verified.

#### CO-g4-03 · DWR well permit API: well construction and pump installation by named driller/pump installer — `build_now`

Colorado Division of Water Resources (Office of the State Engineer) · https://dwr.state.co.us/Tools/WellPermits

- **Verdict:** Confirmed live, clean incremental API with license-number join keys; main gap is that the row's contact fields belong to the well owner, not the driller, so a phone/email for the driller company must come from a separate DWR licensed-contractor roster join.
- **Endpoint:** https://dwr.state.co.us/Rest/GET/api/v2/wellpermits/wellpermit/?format=json&min-modified=MM/DD/YYYY&pageSize=50000
- **Access / format / auth:** other_api · json · none for anonymous use (rate-limited); free API key raises limits per prior round · cost: free
- **Cadence:** daily; sample pull with min-modified=09/20/2026 returned rows with modified timestamps of 2026-09-21 through 2026-09-24
- **Latency:** construction/pump-install reports lag completion by 30-90 days per prior round; the API itself reflects same-day record changes
- **History:** not tested this pass; API supports historical min-modified queries so likely goes back years
- **Incremental pull:** yes — min-modified query parameter (required filter alongside county/division/receipt) drives daily incremental pulls
- **Volume:** 250-510 well completions/month and 220-285 pump installs/month, Jan-May 2026, per prior round (not re-measured this pass)
- **Record names:** well owner (contactName/contactType=Owner) is the named contact; driller and pumpInstaller are separate company-name fields, not full contact records
- **Company fields:** driller, pumpInstaller, contactName (owner, not the trade contractor)
- **Identity keys:** drillerLic, pumpLic, receipt, permit, wdid
- **Contact:** contactAddress/City/State/PostalCode — but this is the well owner's address, not the driller's
- **Contact fill:** driller/pumpLic fields are frequently null on records still in progress (3 of 5 sample rows had null driller fields; populated once a driller is assigned, as seen on receipt 04006908)
- **Equipment:** indirect: completions/installs imply active use of drill rigs, pump hoists and support trucks by the named driller/installer, but no equipment field itself
- **Event fields:** dateWellCompleted, datePumpInstalled, datePermitIssued, permitCategoryDescr
- **Industry filter:** permitCategoryDescr and associatedUses fields separate domestic/monitoring/irrigation etc.; must exclude 'AUTHORIZED (PE, PG)' monitoring-well entries per prior round to avoid noise (oil-and-gas monitoring wells like the Noble Energy/Occidental rows seen in this pull)
- **Size signal:** depthTotal and pumpTestYield loosely proxy job size
- **Rate limits:** anonymous row limits apply per prior round (since Dec 2025); this pull returned pageSize=50000 but only 5 requested — page-size ceiling for anonymous callers not independently confirmed this pass
- **Terms / restrictions:** none found in a quick check; state well-permit data is routinely public
- **Fragility:** low: clean REST/JSON API on a state.co.us domain with a documented min-modified filter, confirmed live and returning fresh data
- **Entity resolution:** driller/pumpInstaller company name embeds the individual license holder's name in parentheses (e.g. 'CASCADE DRILLING, LP (CAIN, SHAWN)') — needs parsing to split company from person; drillerLic/pumpLic are the clean join keys to DWR's licensed contractor roster
- **Build effort:** S (<half day): documented JSON REST API, no auth needed to start, straightforward min-modified incremental pull
- **Verified by fetch:** endpoint live, returns fresh JSON with pagination metadata (PageCount:7 for the min-modified window tested), driller/pumpInstaller fields populate once assigned, null otherwise, contact fields on the row are the well owner's, not the driller's
- **Open questions:** Where exactly is the DWR licensed driller/pump-installer roster with phone/email, and is it a similarly clean API or a scrape?, What is the actual anonymous rate/page-size ceiling, and what does a free API key raise it to?
- **Notes:** This pull surfaced several oil-and-gas monitoring-hole permits (Noble Energy, Occidental) with no driller assigned yet — confirms the prior round's exclusion advice for 'AUTHORIZED (PE, PG)'/monitoring-hole noise is necessary.

#### CO-g4-04 · UCC initial filings by equipment lenders (Filing + Collateral + Secured Party + Debtor) — `build_now`

Colorado Secretary of State via data.colorado.gov (Socrata / Colorado Information Marketplace) · https://data.colorado.gov/Business/Uniform-Commercial-Code-UCC-Filing-Information-in-/wffy-3uut

- **Verdict:** This is the one signal with measured lift (5.6x base rate per prior round), the plumbing is a clean, free, well-documented Socrata API with no restriction on commercial use, and daily incremental pulls are trivial. The real work is downstream (alias table + collateral classifier), not the ingest itself.
- **Endpoint:** https://data.colorado.gov/resource/wffy-3uut.json (filings) joined by fileid to https://data.colorado.gov/resource/8upq-58vz.json (debtor), https://data.colorado.gov/resource/ap62-sav4.json (secured party), https://data.colorado.gov/resource/4am6-w6u4.json (collateral)
- **Access / format / auth:** socrata_api · json (csv/xlsx also available via Socrata export) · none required for the free Socrata API (app token optional, raises throttle limits) · cost: free
- **Cadence:** daily; max filingdate 2026-09-22 pulled on 2026-09-24, and HTTP headers on the endpoint show Last-Modified: 2026-09-24T09:10:38 (same-day)
- **Latency:** 1-2 days from filing to appearing in the API
- **History:** back to at least the mid-1990s based on sample transactionid values (e.g. 19952082638) seen in column metadata
- **Incremental pull:** yes — filter/order by filingdate (SoQL $where/$order), or transactionid/fileid for change tracking
- **Volume:** measured directly: Initial Filing + filingtype='ucc' only (excluding amendments and non-UCC liens) ran 4,000-4,650/month Apr-Aug 2026 (Apr 4,058; May 4,090; Jun 4,094; Jul 4,094; Aug 4,642); September partial at 2,773 as of the 24th. This differs from the prior round's ~3,800/month, which appears to have included non-initial or non-UCC filing types — use the filtered count.
- **Total records:** 2,595,498 non-null transactionid values reported in the dataset's column cache (whole-history total across all filing types)
- **Record names:** debtor (the equipment buyer/borrower) named directly in a joined table, plus the secured party (lender)
- **Company fields:** debtor organizationname, debtor address1/city/state/zipcode
- **Identity keys:** fileid (join key across all four tables), transactionid
- **Contact:** debtor mailing address only; no phone/email in any of the four UCC tables
- **Contact fill:** address fields appear consistently populated in the sample debtor rows pulled; no phone/email fields exist to fill
- **Equipment:** direct when additionalcollateraldescription names specific equipment (make/model/S/N); indirect/absent when it's boilerplate blanket-lien language ('all accounts, general intangibles...') as seen in several sampled rows — needs keyword filtering, not just presence of the field
- **Event fields:** filingdate, lapsedate, transactiontype, terminationflag
- **Industry filter:** no industry/trade field anywhere in the four tables; must infer from secured-party identity (equipment lender vs. bank vs. factoring co.) and/or keyword-match the collateral text against target equipment types (excavator, skid steer, dozer, etc.) — confirmed 26,869 collateral rows match a 3-keyword test (excavator/skid steer/dozer) across the full historical table, so keyword filtering works but needs date-scoping to avoid pulling all-time matches
- **Size signal:** none direct; presence of a blanket lien vs. a single-item filing loosely proxies deal size
- **Rate limits:** Socrata default: unauthenticated requests are throttled harder than token-holding ones; robots.txt shows Crawl-delay: 1 for browse pages (does not apply to the /resource/ API); no documented hard cap found this pass but a free Socrata app token is trivial to get and standard practice
- **Terms / restrictions:** No commercial-solicitation restriction found. CO SOS's own privacy/terms page (coloradosos.gov/pubs/info_center/terms.html) states UCC lien filings are public record under the Colorado Open Records Act (C.R.S. Title 24, Art. 72, Pt. 2) and explicitly says such electronically stored information 'may be purchased by private individuals and entities' — this is a green light for commercial use, unlike some states' DMV/driver-record statutes.
- **Fragility:** low: mature, well-documented Socrata dataset with stable column names and a 10+ year track record (createdAt 2014); four-table join is a light modeling burden, not a scraping risk
- **Entity resolution:** secured party names are extremely dirty — sampled 'KUBOTA CREDIT CORPORATION, U.S.A.' in at least 6 distinct spelling/casing variants and 'WAGNER EQUIPMENT CO' in 3 variants, so a canonicalization/alias table is required before filtering to known equipment-lender secured parties; debtor names will have similar variants and need normalization before joining to other feeds (business registry, DWR licensee names, etc.)
- **Build effort:** S (<half day) for a first pull of the four Socrata tables; M (1-2 days) to build the secured-party alias table and collateral-keyword classifier needed to actually separate 'equipment financing' from 'blanket lien on everything' or junk filings (sovereign-citizen and consumer solar liens noted by prior round)
- **Verified by fetch:** all four Socrata endpoints live and returning fresh data, filingdate freshness (max 2026-09-22 as of 2026-09-24 pull), Initial-Filing+ucc-only monthly counts recomputed directly via SoQL, correcting the prior round's blended figure, secured-party name-variant problem confirmed by direct query (Kubota/Wagner/Deere spelling variants), collateral keyword hit-count confirmed (26,869 all-time matches for excavator/skid steer/dozer), no phone/email fields exist in any of the four tables, CO SOS terms-of-use page confirms no commercial-use restriction and explicitly allows purchase/resale of this public record data
- **Open questions:** What is the actual unauthenticated Socrata rate limit if the pipeline runs without an app token — worth just requesting a free token regardless, it's a 5-minute signup., Is there a canonical secured-party alias list anywhere (Socrata or elsewhere) rather than building one from scratch?
- **Notes:** Important correction to the prior round's numbers: the ~3,800/month and ~3,900/month amendment figures blended UCC amendments with IRS/hospital/other-statute liens. A clean split shows roughly 4,000-4,650 new UCC-1 initial filings/month and roughly a similar volume of UCC amendments/month, with IRS tax liens, hospital liens and other-statute liens as separate, smaller buckets that should be excluded by filingtype='ucc' in the pipeline's query.

#### CO-g4-05 · UCC lapse, continuation and termination watch on equipment financings — `enrichment_only`

Colorado Secretary of State via data.colorado.gov (same Socrata dataset family as CO-g4-04) · https://data.colorado.gov/Business/Uniform-Commercial-Code-UCC-Filing-Information-in-/wffy-3uut

- **Verdict:** Same clean, free, restriction-free API as CO-g4-04, so build cost is nearly zero on top of it — but this is a derived/secondary signal (loose 5-year lapse-to-maturity proxy, not a measured-lift signal like the initial filing itself) and its main product is a re-engagement flag on companies already known from CO-g4-04, not a new discovery source. Build it as an add-on query, not a standalone feed.
- **Endpoint:** https://data.colorado.gov/resource/wffy-3uut.json (filter lapsedate range or terminationflag=true), joined by fileid to the same debtor/secured-party/collateral tables as CO-g4-04
- **Access / format / auth:** socrata_api · json (csv/xlsx also available) · none required (same dataset/API as CO-g4-04) · cost: free
- **Cadence:** daily; same underlying dataset, confirmed fresh as of 2026-09-24 pull
- **Latency:** 1-2 days for terminations to appear; lapse dates are known years in advance at filing time (typically the original filingdate + 5 years)
- **History:** same as CO-g4-04, back to the mid-1990s
- **Incremental pull:** yes — lapsedate range filter for forward-looking maturity watch, or filingdate + terminationflag=true for same-day termination/payoff events
- **Volume:** measured directly: terminations (terminationflag=true) ran 2,312 in the trailing 30 days (Aug 23-Sep 22, 2026); UCC filings with lapsedate falling in Q4 2026 and not yet terminated total 21,337 across the whole state (a 3-month forward window, all filing types, not equipment-filtered)
- **Record names:** same debtor/secured-party/collateral records as CO-g4-04, viewed through a different lifecycle-event lens (termination or approaching lapse rather than initial filing)
- **Company fields:** debtor organizationname, address (via join to 8upq-58vz)
- **Identity keys:** fileid, lapsedate, terminationflag, transactiontype (Amendment vs Initial Filing)
- **Contact:** none; same as CO-g4-04, address only
- **Contact fill:** n/a — no contact fields
- **Equipment:** indirect: a lapsing or terminated UCC on an equipment-collateral filing suggests the note is maturing or was paid off, which is a proxy for replacement/refinance timing — but this pass did not verify that terminated filings' original collateral was disproportionately equipment vs. other collateral types
- **Event fields:** lapsedate, terminationflag, transactiontype
- **Industry filter:** same limitation as CO-g4-04 — no trade field; must inherit the equipment-keyword classification from the original initial filing's collateral row via the fileid join
- **Size signal:** none direct
- **Rate limits:** same as CO-g4-04
- **Terms / restrictions:** same as CO-g4-04 — no restriction found, same dataset
- **Fragility:** low, same dataset as CO-g4-04
- **Entity resolution:** requires the amendment/termination row to be correctly joined back to its own original Initial Filing's fileid to inherit the debtor and collateral description — this pass confirmed the transactiontype field distinguishes Amendment from Initial Filing but did not verify how to tell a true payoff termination apart from an assignment or partial-release amendment beyond the terminationflag boolean, which prior round flagged as an open task
- **Build effort:** S (<half day) to add on top of a CO-g4-04 build, since it's the same tables with a different filter — most of the plumbing is shared
- **Verified by fetch:** confirmed 2,312 terminations in trailing 30 days and 21,337 all-filing-type Q4-2026 lapse-date rows via direct SoQL count queries, same dataset freshness and access confirmed as CO-g4-04
- **Open questions:** Does terminationflag reliably mean 'paid off' vs. 'released early for other reasons' (e.g. refinanced with a different lender, which would still show as a termination)?, What fraction of the 21,337 Q4-2026 lapse-date filings are actually equipment collateral vs. other collateral types — not tested this pass, would require joining forward to the collateral table and running the same keyword filter as CO-g4-04.
- **Notes:** Numbers reflect all UCC filing types, not equipment-filtered; the 21,337 lapse figure in particular needs to be intersected with the collateral-keyword filter from CO-g4-04 before it's a usable buy-signal count, not treated as-is.

#### CO-g4-06 · City of Boulder Construction Permits — `enrichment_only`

City of Boulder Open Data (ArcGIS) · https://open-data.bouldercolorado.gov/

- **Verdict:** Confirmed live and has a clean ContractorTrade filter field and a direct company-name field, but prior round already flagged this as mostly small residential jobs (ADJACENT fit) requiring cost/work-type filtering, and it has zero contact fields — useful to corroborate a contractor is actively working in Boulder, not a primary lead source.
- **Endpoint:** https://services.arcgis.com/ePKBjXrBZ2vEEgWd/arcgis/rest/services/Construction_Permits/FeatureServer/0/query
- **Access / format / auth:** arcgis_api · json (geojson also available via ArcGIS query params) · none · cost: free
- **Cadence:** layer metadata editingInfo.dataLastEditDate corresponds to 2026-09-24 (epoch 1790240769459), i.e. edited same day as this pull; prior round observed issued dates through 2026-09-21
- **Latency:** ~1 day per prior round
- **History:** not tested this pass
- **Incremental pull:** yes — standard ArcGIS FeatureServer query with a where clause on IssuedDate/AppliedDate (dates stored as strings per prior round, so incremental filtering needs string-safe date comparison or reformatting)
- **Volume:** ~820/month per prior round (not re-measured this pass)
- **Record names:** property/project (permit), with ContractorCompanyName as a distinct field naming the actual contractor
- **Company fields:** ContractorCompanyName, OriginalAddress/City/State/Zip (project site, not contractor's address)
- **Identity keys:** PermitID, PermitNum, MasterPermitNum
- **Contact fill:** no phone/email fields in the schema at all
- **Equipment:** none direct; commercial remodel/new-build activity is a loose proxy for GC/trade-contractor equipment need
- **Event fields:** AppliedDate, IssuedDate, CompletedDate, EstProjectCost, PermitType, PermitWorkType
- **Industry filter:** ContractorTrade field exists directly on the schema — cleanest trade-filter field confirmed in this batch besides the CDPHE SIC codes
- **Size signal:** EstProjectCost is a direct size proxy
- **Rate limits:** standard Esri ArcGIS Online service limits (not tested for a specific ceiling this pass); no auth needed for read queries
- **Terms / restrictions:** none found; standard municipal open-data ArcGIS layer
- **Fragility:** low: standard ArcGIS REST FeatureServer, stable schema, confirmed live
- **Entity resolution:** ContractorCompanyName is free text; PermitID/PermitNum/MasterPermitNum relationship not tested for duplicate-permit-per-project handling this pass
- **Build effort:** S (<half day): standard ArcGIS REST query, well-understood pattern
- **Verified by fetch:** FeatureServer layer live, schema confirmed with ContractorCompanyName and ContractorTrade fields present, dataLastEditDate same-day as pull
- **Open questions:** What ContractorTrade values actually appear (enumerated list), and do they map cleanly to the target trades (HVAC, plumbing, excavation)?

#### CO-g4-07 · Denver Commercial Construction Permits — `enrichment_only`

City and County of Denver (ArcGIS Open Data) · https://www.denvergov.org/opendata

- **Verdict:** Confirmed live, but lower volume than Boulder (~180/month), no direct trade field (CLASS is a code needing translation), and zero contact fields. Same role as Boulder: corroborating signal, not primary source.
- **Endpoint:** https://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/ODC_DEV_COMMERCIALCONSTPERMIT_P/FeatureServer/317/query
- **Access / format / auth:** arcgis_api · json · none · cost: free
- **Cadence:** layer editingInfo.dataLastEditDate corresponds to 2026-09-24 (epoch 1790249805942), same day as pull
- **Latency:** ~1 day per prior round
- **History:** not tested this pass
- **Incremental pull:** yes — standard ArcGIS query filtering on DATE_ISSUED
- **Volume:** ~180/month per prior round (not re-measured this pass)
- **Record names:** commercial permit, with CONTRACTOR_NAME as a distinct field
- **Company fields:** CONTRACTOR_NAME
- **Identity keys:** PERMIT_NUM, SCHEDNUM
- **Contact fill:** no phone/email fields in schema
- **Equipment:** none direct; tenant finish/new-build is an indirect proxy per prior round
- **Event fields:** DATE_ISSUED, DATE_RECEIVED, VALUATION, CLASS, FINAL_DATE
- **Industry filter:** CLASS field (permit class/type) is the closest filter field but is a permit-code, not a trade name — needs a code-to-trade lookup, unlike Boulder's direct ContractorTrade field
- **Size signal:** VALUATION is a direct size proxy
- **Rate limits:** standard Esri ArcGIS limits, not tested for a specific ceiling
- **Terms / restrictions:** none found; standard municipal open-data layer
- **Fragility:** low: confirmed live ArcGIS FeatureServer with stable schema
- **Entity resolution:** CONTRACTOR_NAME free text; no separate tenant-name field confirmed, matching prior round's note that occupant identity must be resolved via address join to a business-license feed
- **Build effort:** S (<half day) for the base query; M if the CLASS-code-to-trade lookup and tenant-resolution join are built out
- **Verified by fetch:** FeatureServer layer live, schema confirmed with CONTRACTOR_NAME and CLASS fields present, no trade-name field, dataLastEditDate same-day as pull
- **Open questions:** What is the CLASS code lookup table, and does it distinguish target trades (HVAC/plumbing/electrical) cleanly?

#### CO-g4-08 · Pikes Peak Regional Building Dept daily/weekly permit reports — `build_later`

Pikes Peak Regional Building Department (El Paso County incl. Colorado Springs) · https://www.pprbd.org/Information/Reports

- **Verdict:** Could not confirm this source is currently reliably scrapable — two of three report fetches failed or hung on this pass where the prior round reported success. Re-verify access (possibly needs a real browser / longer timeout / different headers) before committing build time; the paid full-feed tier may be the more robust route if the free reports are unstable.
- **Endpoint:** https://www.pprbd.org/File/Report?report=<N> (fixed-width text reports, numbered per prior round; report 40 and 45 returned empty on this pass and report 46 did not complete within a 2-minute timeout)
- **Access / format / auth:** html_scrape · fixed-width text (per prior round); full tab-delimited all-permit feed requires subscription per prior round · none for the free reports; account/subscription for the full tab-delimited feed (price not obtained this pass) · cost: free tier for daily/weekly reports; paid subscription tier exists for the full feed, price unconfirmed
- **Cadence:** not independently re-confirmed this pass — the /Information/Reports landing page returned no readable content (likely JS-rendered or blocked to this client) and direct report-number fetches on this pass returned empty (report 40, 45) or timed out (report 46), unlike the prior round which reported successful pulls
- **Latency:** prior round: daily at 6pm, weekly Friday — not re-verified this pass
- **Incremental pull:** unclear; reports appear to be point-in-time snapshots (report N for a given week) rather than a queryable incremental feed
- **Volume:** ~480/week all codes per prior round (not re-measured this pass)
- **Record names:** permit, with owner and contractor as separate fields per prior round
- **Company fields:** contractor (per prior round's schema note)
- **Identity keys:** permit no
- **Equipment:** indirect: commercial fit-out/new-occupancy codes (324/327/437/542 per prior round) proxy contractor activity
- **Event fields:** date, cost, project type
- **Industry filter:** project code (324/327/437/542) per prior round is the filter, but this pass could not confirm the code list still holds since the reports were unreachable
- **Size signal:** cost field per prior round
- **Rate limits:** unknown; this pass's requests to report 46 hung past a 2-minute timeout, which may indicate the source is slow/rate-limiting rather than genuinely large
- **Terms / restrictions:** not checked this pass beyond confirming the free/paid tier split noted by the prior round; no time to review pprbd.org ToS given the access problems
- **Fragility:** high: this pass could not reliably reproduce the prior round's successful pulls — the landing page rendered no usable content and two of three report-number fetches returned empty or hung, so either the report numbering has shifted, the site added bot mitigation, or this was a transient issue. Needs re-verification with a longer timeout and a browser-rendered fetch before relying on it.
- **Entity resolution:** owner field noted by prior round as giving tenant/owner name directly, which would help entity resolution versus the ArcGIS permit feeds that lack a tenant field — but unverified this pass
- **Build effort:** M (1-2 days): fixed-width text parsing plus report-numbering/pagination logic, complicated further by this pass's access issues suggesting extra defensive handling (timeouts, retries) will be needed
- **Verified by fetch:** landing page https://www.pprbd.org/Information/Reports returned HTTP 200 but no extractable text content on this pass, report=40 and report=45 endpoints returned empty responses, report=46 did not complete within 120 seconds and was backgrounded
- **Open questions:** Is pprbd.org now blocking or rate-limiting non-browser clients, or did the report numbering scheme change since the prior round?, What is the actual price of the paid tab-delimited subscription feed?, Does a browser-rendered fetch (e.g. headless browser) succeed where curl did not?
- **Notes:** This is the one source in the batch where this pass's findings diverge materially from the prior round's — flag for re-check with better tooling (headless browser or longer timeout) before deciding build_now vs skip.


### FL

#### FL-g3-01 · DBPR Construction Industry Licensee File — `build_later`

FL DBPR Construction Industry Licensing Board · https://www2.myfloridalicense.com/sto/

- **Verdict:** Content and cadence are still attractive (per prior round), but the access path just broke: direct download is now blocked by a Cloudflare managed challenge that a plain nightly curl/cron job cannot pass. Needs a bypass solution proven reliable before this is build_now.
- **Endpoint:** https://www2.myfloridalicense.com/sto/file_download/extracts/CONSTRUCTIONLICENSE_1.csv
- **Access / format / auth:** bulk_file · csv · none · cost: free
- **Latency:** 1 day (per prior round; not reverified)
- **History:** unknown, appears to be current full licensee roster not an event log
- **Incremental pull:** no API filter; prior round notes col 16 = original license date, so incremental pull = full-file download + diff/filter locally on that column
- **Volume:** not remeasured; prior round figure (~1,640/mo) unverified this pass because file could not be fetched
- **Total records:** not measured this round (prior round: ~1,640 new/month incl. ~645 QB)
- **Record names:** licensee / qualified business (contractor)
- **Company fields:** business name, address, county
- **Identity keys:** license type/#, licensee name
- **Contact:** address only, per prior round
- **Equipment:** none direct; license type implies trade
- **Event fields:** original license date
- **Industry filter:** license type/category field, per prior round; not reverified this pass
- **Rate limits:** unknown
- **Terms / restrictions:** No specific statutory restriction on commercial use of the bulk CSV (name/business/address/license type) was located. The one confirmed DBPR-specific carve-out is narrower: under s. 455.275(1), Fla. Stat., a licensee's email address is public record but DBPR licensee-facing pages warn that if a licensee emails the Department, that email may be released in response to a public-records request -- this concerns individual licensee emails submitted to DBPR, not the bulk extract fields. Chapter 119 (public records) itself is permissive and does not generally bar commercial/solicitation use. Could not confirm a DBPR-specific 'no solicitation' clause on the extract page itself because the page is now blocked (see fragility).
- **Fragility:** high -- the download URL now returns HTTP 403 from a Cloudflare 'managed challenge' (JS interactive challenge) for both a plain curl and a browser-UA curl; this is new/worse than the prior round's 'verified: true'. A nightly pipeline will need a JS-capable fetcher (headless browser) or a paid anti-bot bypass (e.g., FlareSolverr, ScrapingBee) -- plain HTTP GET no longer works from this environment.
- **Entity resolution:** Join to Sunbiz (SOS) by business name for phone/officer enrichment, per prior round notes.
- **Build effort:** M -- was S in the prior round's plumbing terms (plain CSV), but the new Cloudflare challenge means a headless-browser or anti-bot-bypass step is required, which is real added engineering and ongoing fragility risk.
- **Verified by fetch:** endpoint currently returns HTTP 403 Cloudflare managed challenge, confirmed with both default and browser User-Agent
- **Open questions:** Is there an alternate DBPR bulk-data path (FTP, data.florida.gov mirror, or an official API) that isn't behind the Cloudflare challenge?, Was this URL reachable without a challenge as recently as the prior research round, i.e. is this a new protection?, What headers/session/JS execution are required to pass the challenge reliably for automation?
- **Notes:** This and FL-g3-02 share the same www2.myfloridalicense.com domain and the same Cloudflare block; fix once, fixes both.

#### FL-g3-02 · DBPR Electrical Contractor Licensee File — `build_later`

FL DBPR Electrical Contractors Licensing Board · https://www2.myfloridalicense.com/sto/

- **Verdict:** Same blocker as FL-g3-01: real content, broken plumbing right now. Bundle the anti-bot-bypass work across both DBPR feeds rather than solving twice.
- **Endpoint:** https://www2.myfloridalicense.com/sto/file_download/extracts/lic08el.csv
- **Access / format / auth:** bulk_file · csv · none · cost: free
- **Latency:** 1 day per prior round; not reverified
- **History:** unknown, appears to be current full licensee roster
- **Incremental pull:** no API filter; same layout as CONSTRUCTIONLICENSE_1.csv, original license date column drives the diff
- **Volume:** not remeasured; prior round figure (~160/mo) unverified this pass
- **Total records:** not measured this round
- **Record names:** licensee / qualified business (electrical contractor)
- **Company fields:** business name, address
- **Identity keys:** license type/#, licensee name
- **Contact:** address only per prior round; elec_app.csv applicant file has phones but no dates, per prior round
- **Equipment:** none direct; license type implies trade
- **Event fields:** original license date
- **Industry filter:** license type code (EC/EF/ES/ER/EG), per prior round
- **Rate limits:** unknown
- **Terms / restrictions:** Same as FL-g3-01 -- no specific solicitation restriction located; Chapter 119 is permissive; could not reach the actual extract page to check for any posted notice because of the Cloudflare block.
- **Fragility:** high -- identical Cloudflare managed-challenge block confirmed on this exact URL (403, JS challenge page, both plain and browser UA).
- **Entity resolution:** Same layout as CONSTRUCTIONLICENSE_1.csv per prior round; joins the same way via Sunbiz.
- **Build effort:** M -- see FL-g3-01; solving the Cloudflare block once likely unlocks both files.
- **Verified by fetch:** endpoint currently returns HTTP 403 Cloudflare managed challenge, confirmed with both default and browser User-Agent
- **Open questions:** Same as FL-g3-01.
- **Notes:** Low volume (~160/mo per prior round) means this is a lower priority to unblock than FL-g3-01 even once the Cloudflare fix exists.

#### FL-g3-03 · FDEP ARMS Air Facilities (concrete, asphalt, crusher, air curtain incinerator) — `build_now`

Florida Department of Environmental Protection, Division of Air Resource Management · https://fdep.maps.arcgis.com/

- **Verdict:** Clean, open, no-auth API; confirmed record counts and field schema; the only friction is no date field (handled by ID-diffing, already the prior round's plan).
- **Endpoint:** https://ca.dep.state.fl.us/arcgis/rest/services/OpenData/ARMS/MapServer/0/query
- **Access / format / auth:** arcgis_api · json · none · cost: free
- **Cadence:** unknown -- no per-record last-modified/date field on this layer; freshness can only be inferred by diffing AIRS_ID over time
- **Latency:** unknown
- **History:** appears to be a live current-state registry (10,873 facilities total, all statuses), not a dated event log
- **Incremental pull:** no date field to filter on; incremental pull = poll and diff on AIRS_ID (confirms prior round's approach)
- **Volume:** not measured -- would require ongoing AIRS_ID diffing since there's no date field
- **Total records:** 10,873 total (confirmed via returnCountOnly); 3,490 with STATUS='ACTIVE' (all facility types, not yet split by target FACILITY_TYPE)
- **Record names:** regulated air facility owner/operator (concrete plant, asphalt plant, crusher, incinerator, etc.)
- **Company fields:** NAME, OWNER, STREET, CITY, ZIP_5, ZIP_4
- **Identity keys:** AIRS_ID, ARMS_ID
- **Contact fill:** no phone/email fields present in the layer schema fetched
- **Equipment:** indirect -- facility type (concrete/asphalt plant, crusher) implies fixed/portable equipment ownership, not a specific equipment record
- **Event fields:** STATUS (e.g. ACTIVE, CONSTRUCTION, UNPERMITTED)
- **Industry filter:** FACILITY_TYPE field cleanly filters to target categories (confirmed values seen: CONCRETE PLANT, NONMETALLIC MINERAL PROCESSING; prior round also cites ASPHALT PLANT, AIR CURTAIN INCINERATOR)
- **Rate limits:** default ArcGIS REST -- query returned exceededTransferLimit:true on an unbounded query, meaning results are capped per call (server default maxRecordCount, likely 1,000) and require resultOffset paging; no documented rate limit found
- **Terms / restrictions:** No robots.txt or ToS restriction found for ca.dep.state.fl.us; it is an open ArcGIS REST service with no auth. No solicitation restriction located.
- **Fragility:** low -- standard ArcGIS REST API, responded cleanly with JSON, no auth or challenge encountered.
- **Entity resolution:** OWNER field differs from NAME (facility name) in samples (e.g. NAME='CEMCO PLANT 6', OWNER='TITAN AMERICA LLC') -- must decide which to use for entity resolution; large national producers (Cemex, Titan) need filtering out per prior round's note to avoid chasing enterprise accounts.
- **Build effort:** S -- simple paginated ArcGIS query job, filter FACILITY_TYPE/STATUS, diff AIRS_ID.
- **Verified by fetch:** layer metadata (fields, description), total count = 10,873, ACTIVE count = 3,490, sample records with AIRS_ID, NAME, OWNER, STATUS, SIC, FACILITY_TYPE, exceededTransferLimit behavior confirming pagination is required
- **Open questions:** Whether there's a companion layer or field elsewhere in FDEP's ArcGIS org with a permit-issuance date, which would give a real incremental-pull key instead of ID-diffing., Exact server-side maxRecordCount per query (not printed in the layer JSON header fetched).
- **Notes:** DOCUMENTS field (DepNexus permit link) mentioned in the prior round's notes was not included in this pass's field pull -- add it back with a full field list request before building.

#### FL-g3-04 · FDEP Grease Waste Hauler Licenses (Solid Waste Facilities layer) — `build_now`

Florida Department of Environmental Protection, Division of Waste Management · https://fdep.maps.arcgis.com/

- **Verdict:** Confirmed live, dated, incrementally queryable API with no auth; matches prior round's assessment.
- **Endpoint:** https://ca.dep.state.fl.us/arcgis/rest/services/OpenData/DWM_WASTE_ICR_BACKG/MapServer/1/query
- **Access / format / auth:** arcgis_api · json · none · cost: free
- **Cadence:** daily-capable -- STATUS_DATE values observed at 1790208000000 ms epoch (2026-09-23), consistent with prior round's same-day latency claim
- **Latency:** same day, per prior round and consistent with observed STATUS_DATE
- **History:** program started Feb 2026 per prior round; layer itself (13,959 rows) covers all Solid Waste Facilities statewide, of which grease haulers are a subset
- **Incremental pull:** yes -- STATUS_DATE field, orderByFields=STATUS_DATE DESC confirmed to work
- **Volume:** not remeasured this pass; prior round: Jun 32, Jul 29, Aug 70, Sep (partial) 19
- **Total records:** 13,959 total rows in the full Solid Waste Facilities layer (confirmed via returnCountOnly); grease-hauler subset count not re-isolated this pass (prior round: 227 Licensed total)
- **Record names:** grease/waste hauler licensee (and other solid-waste facility types in the same layer)
- **Company fields:** FACILITY_NAME, ADDRESS, CITY, ZIP5
- **Identity keys:** FACILITY_ID
- **Contact fill:** no contact fields in the schema fetched
- **Equipment:** indirect -- a grease-hauler license implies a pump/vac truck, per prior round; no equipment field itself
- **Event fields:** FACILITY_STATUS (Proposed/Licensed/etc.), STATUS_DATE
- **Industry filter:** FACILITY_STATUS plus a class/report field (REPORTS per prior round, e.g. GWH) needed to isolate grease haulers from the rest of the solid-waste layer -- not independently reverified this pass
- **Rate limits:** same ArcGIS default paging behavior as FL-g3-03 (exceededTransferLimit:true on broad queries)
- **Terms / restrictions:** Same open ArcGIS REST service as FL-g3-03, no restriction found.
- **Fragility:** low -- same clean ArcGIS API, confirmed working.
- **Entity resolution:** Sample shows duplicate FACILITY_ID rows for the same FACILITY_NAME with different FACILITY_STATUS (e.g. two rows for 'G.S.I. RECYCLING, INC.') -- dedupe/collapse logic needed per company.
- **Build effort:** S -- same paginated ArcGIS query pattern as FL-g3-03.
- **Verified by fetch:** layer metadata, total count = 13,959, sample records ordered by STATUS_DATE desc showing current dates
- **Open questions:** Exact field/value combination to isolate the GWH (grease waste hauler) subclass from the full Solid Waste Facilities layer -- not reverified this pass, take from prior round's REPORTS-field approach.

#### FL-g3-05 · Florida Secured Transaction Registry (public UCC bulk/search source) — `enrichment_only`

FloridaUCC LLC (contract vendor for the FL Secretary of State, Division of Corporations, under Ch. 679, Fla. Stat.) · https://floridaucc.com/

- **Verdict:** Per the task brief this source is already ingested by Quintel -- this entry documents the public source itself rather than re-scoping a build. The public floridaucc.com portal is a JS app I could not read directly; Quintel's existing pipe is the source of truth for format/cadence/cost, not this fetch.
- **Access / format / auth:** portal_search · — · account (inferred -- bulk/FTP access typically requires a subscriber agreement with the vendor) · cost: not confirmed -- could not reach pricing detail (see fragility); vendor contact is help@floridaucc.com / 850-222-8526
- **Record names:** debtor and secured party on a UCC financing statement
- **Company fields:** debtor name, secured party name
- **Identity keys:** filing number/date
- **Equipment:** indirect -- UCC collateral descriptions can name equipment, but not confirmed on this pass
- **Event fields:** filing date
- **Terms / restrictions:** Florida's public-records law (Ch. 119) is generally permissive and UCC filings are, by design, a public commercial registry (routinely resold in bulk by every state's UCC vendor to lenders and data companies) -- no restriction on commercial/solicitation use was found. Could not read floridaucc.com's own terms/help text because the site is a JS single-page app (title 'FSTR Online Filing') that returns no content to a non-JS fetch.
- **Fragility:** medium -- floridaucc.com itself loads (HTTP 200, not Cloudflare-blocked) but is a client-rendered SPA, so curl/WebFetch cannot read the actual help/pricing/bulk-data text; a headless browser is needed just to document this source further, separate from whatever pipe Quintel already uses.
- **Entity resolution:** Per the prior round's notes, classify secured party into independent EF, bank, captive, or Providence-style funder to read financing-history signal.
- **Verified by fetch:** floridaucc.com root and /help both return HTTP 200 but render nothing server-side (confirmed JS SPA, title 'FSTR Online Filing'), no Chapter 119 or DBPR-style solicitation restriction located for UCC data in web search
- **Open questions:** What format/cadence/cost does Quintel's existing Florida UCC ingestion actually use -- ask internally rather than re-derive from the public site., Does FloridaUCC LLC offer a direct bulk/FTP product to non-Quintel buyers, and at what price -- unresolved because the marketing/help pages are JS-rendered.
- **Notes:** Per the task instructions, this entry intentionally does not describe Quintel's internal ingestion -- only the public vendor and the statutory backdrop.

#### FL-g3-06 · Hillsborough Clerk Official Records Daily Index — `build_later`

Hillsborough County Clerk of Court · https://publicrec.hillsclerk.com/OfficialRecords/DailyIndexes/

- **Verdict:** Could not verify reachability this pass; don't commit build effort until a successful fetch confirms the site is actually up and the daily-index file structure still matches the prior round's description.
- **Endpoint:** https://publicrec.hillsclerk.com/OfficialRecords/DailyIndexes/
- **Access / format / auth:** bulk_file · csv (pipe-delimited, per prior round) · none, per prior round · cost: free, per prior round
- **Latency:** 1 day, per prior round; not reverified
- **History:** ~2 months retained, per prior round
- **Incremental pull:** daily files, per prior round; not reverified
- **Volume:** not remeasured; prior round: ~270 NOCs/business day
- **Record names:** contractor (TO party) and property owner (FRM party) on a recorded Notice of Commencement
- **Company fields:** contractor (TO party), owner (FRM party)
- **Contact fill:** none, per prior round
- **Equipment:** none direct
- **Event fields:** job address, record date
- **Industry filter:** none in the index itself, per prior round -- requires joining to DBPR license file by contractor name
- **Terms / restrictions:** Not checked this pass -- could not reach the site at all (see fragility).
- **Fragility:** high -- this pass could not connect at all: TCP connection to port 443 timed out after 15s from this environment (DNS resolves fine to 198.184.182.65, but the socket never completes), distinct from an app-level 403/block. This is either a transient outage, an IP/geo-block on this environment's egress, or the site has added network-level protection since the prior round. Needs retest from a different network before trusting the prior round's 'verified: true'.
- **Entity resolution:** Per prior round, join contractor name to DBPR license file for address; also carries ~59 FIN/day (mostly consumer solar/water liens), per prior round.
- **Build effort:** M -- unchanged from what the content would imply, but flag the connectivity risk as a build blocker until reverified.
- **Open questions:** Is publicrec.hillsclerk.com actually down, or is this environment's outbound network blocked/rate-limited for this host?, If reachable from elsewhere, does the daily index file format/columns still match the prior round's notes?
- **Notes:** All fields above are carried over from the prior round's description and are NOT reverified this pass -- treat as inferred, not confirmed, until connectivity is restored and retested.

#### FL-g3-07 · Palm Beach County Licensed Towing Companies (Consumer Affairs API) — `build_now`

Palm Beach County Public Safety, Division of Consumer Affairs · https://discover.pbc.gov/publicsafety/consumeraffairs/Pages/Towing_App.aspx

- **Verdict:** Confirmed live, clean, no-auth JSON with the strongest direct equipment signal (fleet size and age) found in this batch.
- **Endpoint:** https://secure.pbc.gov/ConsumerAffairs/api/Companies/GetCompanies?BusinessType=6&SearchBy=Name&SearchFor=
- **Access / format / auth:** other_api · json · none · cost: free
- **Cadence:** unknown -- this is a live queryable database, not a dated feed; License_Issue_Date/License_Year fields exist but no rowsUpdatedAt-style metadata to time freshness
- **Latency:** effectively live (direct query against the licensing DB), per prior round
- **History:** full current roster of licensed towing businesses back to earliest License_Issue_Date present (sample showed a 2020 issue date)
- **Incremental pull:** no server-side date filter observed in this simple GET; would need to pull full list (331 records, small) and diff locally on License_Issue_Date/License_Seq
- **Volume:** not remeasured; prior round: about 1-6/month mid-year
- **Total records:** 331, per prior round; not recounted this pass but the sample response matches the prior round's field description exactly
- **Record names:** towing company licensee
- **Company fields:** Business_Name, Does_Business_As, Format_Street, City_Name, Zip_Code
- **Identity keys:** License_Number, License_Seq, business_seq
- **Contact:** Phone_Number, Contact_First_Name, Contact_Last_Name, Contact_Title
- **Contact fill:** phone present in all 3 sampled records; contact person name/title present in all 3 sampled records (n=3, too small to generalize beyond the prior round's fuller pull)
- **Equipment:** direct -- vehicle count by class and FleetAge are explicit fleet-composition fields, confirmed present in the live response
- **Event fields:** License_Issue_Date, License_Expiry_Date, License_Year
- **Industry filter:** single-purpose endpoint (BusinessType=6 = towing); other BusinessType codes serve other trades per prior round, not explored this pass
- **Size signal:** FleetAge and vehicleCount/totalVehicleCount directly proxy company size and truck-replacement need
- **Rate limits:** none observed or documented; undocumented endpoint, no key required
- **Terms / restrictions:** No ToS/robots restriction found; endpoint is an undocumented but unauthenticated JSON API behind a public consumer-facing towing-company lookup page. No solicitation restriction located for Palm Beach County consumer affairs data.
- **Fragility:** medium -- undocumented endpoint (no published API contract), so it could change or be locked down without notice; otherwise clean JSON, confirmed working with an empty SearchFor returning the full list.
- **Entity resolution:** Business_Name and Does_Business_As sometimes differ from the actual principal's personal name (one sample record has Business_Name as an individual's name with DBA as the trade name) -- resolve on DBA/trade name as primary company identity where present.
- **Build effort:** S -- small dataset (331 rows), single unauthenticated GET, easy to pull nightly in full and diff.
- **Verified by fetch:** live query returned JSON matching prior round's described field list, plus vehicleCount/FleetAge/totalVehicleCount confirmed present
- **Open questions:** Whether other BusinessType codes on the same API expose other in-box trades (e.g. moving companies, per prior round's note) worth a follow-up source.
- **Notes:** Per the brief, did not paste any individual's phone/email into this record; Contact_First_Name/Last_Name/Title are listed as field names only, consistent with the brief's guidance that field names and fill rates are fine to report.

#### FL-g3-08 · City of Orlando Permit Applications — `build_now`

City of Orlando (Socrata) · https://data.cityoforlando.net/Building-Development/Permit-Applications/ryhf-m453

- **Verdict:** Confirmed live, current-day-updated, SoQL-filterable API; only real gap is a clean trade-category field, which is solvable via a DBPR join (per fit: ADJACENT in the prior round -- geography-limited to city of Orlando).
- **Endpoint:** https://data.cityoforlando.net/resource/ryhf-m453.json
- **Access / format / auth:** socrata_api · json · none (free app token recommended for higher rate limits, not required for the volumes here) · cost: free
- **Cadence:** daily -- dataset metadata rowsUpdatedAt = 1790263812 (unix), i.e. 2026-09-24, same day as this fetch
- **Latency:** 1 day, per prior round; consistent with same-day rowsUpdatedAt observed
- **History:** large -- total table row count is 1,111,255 (confirmed via $select=count(*)), i.e. this table spans many years of permits, not just recent ones
- **Incremental pull:** yes -- $where=processed_date>=... and $order=processed_date DESC both confirmed working via SoQL
- **Volume:** 3,309 for Aug 2026, measured directly this pass
- **Total records:** 1,111,255 total rows confirmed; August 2026 alone = 3,309 rows (confirmed via SoQL date-range count), close to the prior round's '~3,100/month' estimate
- **Record names:** contractor of record on a city permit application; also names the property/owner
- **Company fields:** contractor_name, contractor_address, property_owner_name, parcel_owner_name
- **Identity keys:** permit_number, parcel_number
- **Contact:** contractor_phone_number (present on some records, null on others in the 3-row sample)
- **Contact fill:** 2 of 3 sampled records had contractor_phone_number populated; 1 of 3 was missing (small sample, n=3)
- **Equipment:** none direct; worktype field exists but was blank in the sample
- **Event fields:** application_status, estimated_cost, permit_number, plan_review_type
- **Industry filter:** no explicit trade-category field in the sampled columns; would need to filter on worktype or application_type plus a contractor-name join to DBPR license type for trade filtering
- **Size signal:** estimated_cost per job is a weak proxy
- **Rate limits:** Socrata standard throttling applies without an app token (roughly a few thousand requests/rolling window); robots.txt disallows only browse/catalog UI paths (/browse, /facet, /catalog with query params), explicitly does NOT disallow /resource/ (the API path used here)
- **Terms / restrictions:** No solicitation restriction found; robots.txt permits API access; standard Socrata open-data terms apply (no login, no commercial-use bar located).
- **Fragility:** low -- standard Socrata API, worked cleanly on both a row query and a SoQL count/date-range query.
- **Entity resolution:** contractor field sometimes concatenates a person's name with the company in parens (e.g. 'HAOXUN LI (GREENLOGIC LLC)') while contractor_name is the clean company name -- use contractor_name as primary key, not contractor.
- **Build effort:** S -- straightforward Socrata pull, same pattern as any $where/$order SoQL job.
- **Verified by fetch:** dataset metadata rowsUpdatedAt = today, sample rows with schema, total row count via $select=count(*), August 2026 monthly count via $where date range, robots.txt confirms API path is not disallowed
- **Open questions:** Best available trade-category field for filtering to in-box trades without a full DBPR join.

#### FL-g3-09 · Miami-Dade Building Permits — `build_now`

Miami-Dade County (Open Data Hub) · https://gis-mdc.opendata.arcgis.com/

- **Verdict:** Richest single-source schema in this batch: direct phone, DBPR-format license number, owner, and category descriptions all in one place, confirmed live and current as of today.
- **Endpoint:** https://services.arcgis.com/8Pc9XBTAsYuxx9Ny/arcgis/rest/services/miamidade_permit_data/FeatureServer/0/query
- **Access / format / auth:** arcgis_api · json · none · cost: free
- **Cadence:** recent -- editingInfo.dataLastEditDate = 1790253155858 (unix ms), i.e. 2026-09-24, and the top PermitIssuedDate-sorted record is dated 1790121600000 (2026-09-22)
- **Latency:** roughly 1-2 days between PermitIssuedDate and the layer's dataLastEditDate, consistent with prior round's estimate
- **History:** rolling ~2 prior years, per prior round; total row count 139,601 is consistent with a 2-year rolling window at this volume
- **Incremental pull:** yes -- orderByFields=PermitIssuedDate DESC confirmed working; ApplicationDate also available
- **Volume:** not independently remeasured this pass; prior round's ~5,950/month (Aug 2026 basis) is plausible given the total/24-month rate implied by 139,601 rows
- **Total records:** 139,601 confirmed via returnCountOnly
- **Record names:** contractor of record on the permit; also names the property owner
- **Company fields:** ContractorName, ContractorAddress, ContractorCity, ContractorState, ContractorZip, OwnerName
- **Identity keys:** ContractorNumber, FolioNumber, PermitNumber
- **Contact:** ContractorPhone
- **Contact fill:** ContractorPhone populated in the 1 full sample record pulled (n=1, too small to generalize)
- **Equipment:** indirect -- category descriptions are work-type/material categories on the job, not equipment owned by the contractor, but do sharpen trade filtering
- **Event fields:** PermitIssuedDate, ApplicationDate, EstimatedValue, PermitType, ApplicationTypeDescription, ProposedUseDescription
- **Industry filter:** ProposedUseCode/ProposedUseDescription and CategoryDescription1-10 together give reasonably clean trade/use filtering; full 57-field schema confirmed by fetch
- **Size signal:** EstimatedValue, SquareFootage, StructureUnits/StructureFloors are weak proxies for job (not company) size
- **Rate limits:** standard ArcGIS default paging (exceededTransferLimit on broad queries, same pattern as the FDEP layers); no documented rate limit found
- **Terms / restrictions:** No restriction found; open ArcGIS REST service via Miami-Dade's public Open Data Hub, no auth, no ToS blocking commercial use located.
- **Fragility:** low -- clean ArcGIS API, confirmed working, returns a rich single-table schema (no join required for contractor+owner+trade fields).
- **Entity resolution:** ContractorNumber is Miami-Dade's own contractor-license identifier (format like 'CGC1538006'), which is Florida's DBPR-issued license number -- this is a strong direct join key back to the DBPR licensee files (FL-g3-01), once those are unblocked.
- **Build effort:** S -- single ArcGIS table with everything needed in one query; no scraping or joins required for the core fields.
- **Verified by fetch:** layer metadata (editingInfo dates), total row count via returnCountOnly, full 57-field schema pulled, sample record ordered by PermitIssuedDate desc
- **Open questions:** Whether ContractorNumber reliably matches the DBPR license number format used in FL-g3-01/02 for a clean join (worth a spot-check once DBPR access is restored).

#### FL-g3-10 · Miami-Dade Certificates of Use — `build_now`

Miami-Dade County (Open Data Hub) · https://gis-mdc.opendata.arcgis.com/

- **Verdict:** Confirmed live API with three phone fields plus a clean business-use category field; geography-limited to Miami-Dade (ADJACENT fit per prior round) but cheap to build alongside FL-g3-09 on the same ArcGIS org.
- **Endpoint:** https://services.arcgis.com/8Pc9XBTAsYuxx9Ny/arcgis/rest/services/CertificateOfUse_New_gdb/FeatureServer/0/query
- **Access / format / auth:** arcgis_api · json · none · cost: free
- **Cadence:** unknown this pass -- layer metadata (editingInfo) was not pulled for this source; only field schema and count were fetched
- **Latency:** days, per prior round; not reverified
- **History:** not established this pass
- **Incremental pull:** likely yes -- USER_ISSUED_DATE field exists and matches the prior round's cited field; not tested with an orderBy this pass
- **Volume:** not remeasured; prior round: ~216/month (Aug 2026 basis)
- **Total records:** 147,405 confirmed via returnCountOnly
- **Record names:** business/corporation obtaining a Certificate of Use at a location
- **Company fields:** USER_CORP_NAME, USER_DBA, USER_BUS_ADDRESS, USER_BUS_CITY, USER_BUS_STATE, USER_BUS_ZIPCODE, USER_MAIL_ADDRESS
- **Identity keys:** USER_CERTIFICATE_NUMBER, USER_FOLIO, USER_PROCESS_NUM
- **Contact:** USER_PHONE1, USER_PHONE2, USER_PHONE3, USER_APPLICANT_NAME, USER_OFFICERS_NAME
- **Contact fill:** not sampled this pass (schema-only fetch, no row sample pulled)
- **Equipment:** none direct
- **Event fields:** USER_ISSUED_DATE, USER_RENEWAL_DATE, USER_PERMIT_NUMBER
- **Industry filter:** USER_BUS_USE_CODE / USER_BUSINSESS_USE fields (note the field name's typo in the live schema) directly encode the business-use category, matching the prior round's claim
- **Rate limits:** same ArcGIS default paging pattern as sibling Miami-Dade services
- **Terms / restrictions:** No restriction found; same open Miami-Dade ArcGIS Open Data Hub as FL-g3-09.
- **Fragility:** low -- confirmed live schema and count via the same clean ArcGIS pattern as FL-g3-09.
- **Entity resolution:** USER_CORP_NAME vs USER_DBA vs USER_APPLICANT_NAME vs USER_OFFICERS_NAME gives up to four name variants per record to reconcile.
- **Build effort:** S -- same ArcGIS query pattern as FL-g3-09.
- **Verified by fetch:** full field schema pulled, total row count via returnCountOnly (147,405)
- **Open questions:** Actual contact fill rate and freshness cadence -- not sampled this pass, only schema and count were pulled given the 10-minute budget.
- **Notes:** Build this alongside FL-g3-09 since both live on the same Miami-Dade ArcGIS org (8Pc9XBTAsYuxx9Ny) with an identical access pattern.


### GA

#### GA-g6-01 · EPD Regulated Solid Waste Facilities list (incl. Collection/hauler Permit-by-Rule and inert landfills) — `build_now`

Georgia EPD Land Protection Branch, Solid Waste Program · https://epd.georgia.gov/about-us/land-protection-branch/solid-waste/regulated-solid-waste-facilities

- **Verdict:** Clean structured file, zero auth, cleanly filterable by Interest Type to hauler/inert-landfill trades; only risk is snapshot cadence (unclear refresh interval) and a URL that may drift, both cheap to monitor.
- **Endpoint:** https://epd.georgia.gov/media/148276/download (redirects to a document/download path whose slug embeds the report month, e.g. .../apr-2026-regulated-solid-waste-facilitiesxlsx/download)
- **Access / format / auth:** bulk_file · xlsx · none · cost: free
- **Cadence:** irregular, roughly monthly; file's own last-modified header was 2026-09-24 (today) but the sheet label inside is 'Apr 2026' and the media ID/slug changes per refresh -- can't assume a stable URL
- **Latency:** unknown; could be weeks to months given the Apr-2026-labeled content served in Sep 2026
- **History:** single current snapshot only, no history in the file itself
- **Incremental pull:** no incremental query -- full file only; pipeline must diff successive snapshots on Permit Number
- **Volume:** not measurable from one snapshot; prior round counted 22 'Permit Applied For' rows out of 1,922 SW-Collection rows as the pending-entrant pool
- **Total records:** 7266
- **Record names:** facility/permittee: waste collection operators, hauler PBR holders, and landfill/transfer/MRF site owners
- **Company fields:** Facility Name, County, Address
- **Identity keys:** Permit Number (e.g. PBR-147-45COL)
- **Contact:** Contact Duty, Contact Name, Contact Phone
- **Contact fill:** phone present for most rows with a value in the sample viewed; 551 of 7266 rows had a null Operating Status and many SW-Collection rows are missing county/address per prior round's note -- no clean N-based fill-rate measured this round
- **Equipment:** indirect: PBR interest type (SW-Collection = hauler with roll-off/dumpster trucks; SW-Inert Landfill = grading/excavation site typically needing dozers/loaders/dump trucks) implies equipment class, no explicit equipment field
- **Event fields:** Operating Status (e.g. Operating, PermitAppliedFor, Construction)
- **Industry filter:** Interest Type field cleanly buckets into 12+ categories (SW-Collection 1,922; SW-Inert Landfill 2,751; SW-Municipal Solid Waste Landfill 753; SW-Transfer Station 505; SW-Construction & Demolition Landfill 450; SW-Other-PBR 288; SW-Material Recovery Facility 88, etc.) -- confirmed by direct read of the file
- **Size signal:** none in this file (no fleet count, bond, or revenue field)
- **Rate limits:** none observed on the direct file download
- **Terms / restrictions:** epd.georgia.gov robots.txt only disallows a few CSS/JS/admin paths, no disallow on /media/; no georgia.gov-wide ToS page found (checked /policies -> 404, georgia.gov/privacy-policy-terms-of-service -> 404); no stated commercial-solicitation restriction located
- **Fragility:** medium: the download URL redirects to a slug containing the report month/date, so a hardcoded link may eventually 404 after a refresh; the sheet name itself ('myCSV (3)') suggests an ad hoc export process on their end
- **Entity resolution:** facility name plus phone is the most reliable join key since address/county are frequently blank on collection rows per prior round; several rows are government/municipal or medical-waste entities that must be filtered out before matching to buy-box businesses
- **Build effort:** S (<half day): single xlsx, 11 usable columns, parses cleanly with openpyxl
- **Verified by fetch:** file downloads and parses (7,266 rows, 13 columns incl. 2 blank), Interest Type and Operating Status value counts, redirect target slug pattern, robots.txt has no disallow on /media/
- **Open questions:** True refresh cadence (is 'Apr 2026' label stale, and how often does EPD actually regenerate this export?), Whether the media ID is stable across refreshes or must be re-discovered from the landing page each pull
- **Notes:** Confirms prior round's numbers almost exactly (7,266 total rows, same Interest Type breakdown). No live-data surprises; main engineering risk is URL/slug stability, not the data itself.

#### GA-g6-07 · GDA License Search - Food Establishment Licenses — `build_later`

Georgia Department of Agriculture · https://forms.agr.georgia.gov/LicenseSearch

- **Verdict:** Plumbing confirmed working (endpoint live, JSON parses cleanly, Total count matches prior round almost exactly: 16,692 vs 16,692) but this is an ADJACENT/food-processing fit per the prior round's own classification, not a core buy-box trade, and the endpoint's undocumented/fragile nature argues for building it after the CORE trucking and waste sources are running.
- **Endpoint:** POST https://forms.agr.georgia.gov/LicenseSearch/LicenseReport/LicenseSearchGrid  body: ProgramID=104&sort=IssueDate-desc&page=<n>&pageSize=<n>
- **Access / format / auth:** other_api · json · none · cost: free
- **Cadence:** daily plausible based on prior round's per-month issue-date counts, not independently re-measured this round beyond confirming the endpoint still returns fresh-looking IssueDate values
- **Latency:** not independently measured this round; prior round's estimate of ~1-7 days stands unchallenged
- **History:** full active license roster back to license issuance, not a rolling window -- Total field reports 16,692 total licenses in the program
- **Incremental pull:** yes in practice via sort=IssueDate-desc plus paging, but there is no documented $where/date-filter parameter -- a pipeline would page through IssueDate-desc results and stop once it reaches already-seen license numbers (dedupe on License field)
- **Volume:** not independently re-measured this round; prior round's figures (Jun 132, Jul 117, Aug 50) stand unchallenged for this round's 10-minute budget
- **Total records:** 16692
- **Record names:** licensee: food establishment (retail, manufacturer, co-packer, distributor)
- **Company fields:** Company, Address, City, State, Zip, County
- **Identity keys:** License (license number)
- **Contact:** Contact (name), Phone, Email (field exists but observed null on every sampled row)
- **Contact fill:** phone present on all 4 sampled rows; email field present in the schema but null on every one of the 4 sampled rows this round -- consistent with prior round's note that email is 'mostly null'
- **Equipment:** none direct; Type field (e.g. 'Food Safety - Food Establishment Licenses') implies coolers/ovens/processing lines per prior round's inference, no explicit equipment field
- **Event fields:** IssueDate, ExpirationDate, DateImported
- **Industry filter:** single ProgramID (104) covers all food establishment licenses without further industry sub-typing in the returned fields -- filtering to food manufacturing vs. retail vs. distribution would require an external NAICS-style classification, not available from this endpoint directly
- **Size signal:** none
- **Rate limits:** none observed on 2 POST calls this round; endpoint is undocumented (not a published API) so no stated rate limit exists
- **Terms / restrictions:** forms.agr.georgia.gov/robots.txt returns a 404 page itself (no robots.txt served); agr.georgia.gov/policies returns 404; no stated ToS or commercial-solicitation restriction located for this subdomain in the time available
- **Fragility:** high: this is an undocumented internal API (ASP.NET grid endpoint) discovered by prior-round reverse engineering, not a published/versioned API -- GDA could change the endpoint, parameter names, or response shape without notice and without a deprecation cycle
- **Entity resolution:** License number is a clean unique key; Company name is the join field to other sources, IssueDate may reflect a renewal rather than a true new-license event so dedupe/diff should be on License number, and a renewal should be distinguished from a first issuance if possible (no explicit 'original vs renewal' flag observed)
- **Build effort:** S (<half day): simple POST + JSON parse, same endpoint family as GA-g6-08
- **Verified by fetch:** POST to LicenseSearchGrid with ProgramID=104 returns HTTP 200 JSON with Data array and Total=16,692, sample records confirm fields Company, Contact, Address, City, State, Zip, County, Phone, License, IssueDate, ExpirationDate, Email (null), DateImported, forms.agr.georgia.gov has no robots.txt (404)
- **Open questions:** Whether IssueDate reliably distinguishes new issuance from renewal, since prior round flagged this as an open dedup risk, True update cadence and per-month new-issue volume (not re-measured this round)
- **Notes:** Confirms prior round's plumbing description almost exactly, including the 16,692 total and null email field. No new risks found beyond what prior round already flagged; re-classified here as build_later purely on buy-box fit (ADJACENT), not on a plumbing problem.

#### GA-g6-08 · GDA License Search - fuel pump, poultry dealer, feed, pesticide contractor, grain dealer and other ag licenses — `build_later`

Georgia Department of Agriculture · https://forms.agr.georgia.gov/LicenseSearch

- **Verdict:** Same endpoint family and same plumbing risk as GA-g6-07; per prior round's own fit classification these programs are ADJACENT (fuel/ag/pesticide, not core preferred trades), so sequence after CORE sources despite the plumbing being trivial to add once GA-g6-07 is built.
- **Endpoint:** POST https://forms.agr.georgia.gov/LicenseSearch/LicenseReport/LicenseSearchGrid  body: ProgramID=<174/127/89/85/157/130>&sort=IssueDate-desc&page=<n>&pageSize=<n>
- **Access / format / auth:** other_api · json · none · cost: free
- **Cadence:** not independently re-measured this round beyond confirming all 6 ProgramIDs still return live data with plausible recent IssueDate values
- **Latency:** not independently measured this round; prior round's ~1-7 day estimate stands unchallenged
- **History:** full active roster per program, same structure as GA-g6-07
- **Incremental pull:** same approach as GA-g6-07: page through IssueDate-desc and dedupe on License number; no documented date-filter parameter
- **Volume:** not independently re-measured this round; prior round's per-program monthly estimates (fuel pump ~15-37, pesticide contractors ~14-23, poultry dealers ~2-8, feed ~2-15) stand unchallenged
- **Total records:** measured directly this round via the Total field per ProgramID: Fuel Pump Registration Licenses 5,624; Poultry Dealers and Markets Licenses 341; Commercial Feed Licenses 1,461; Pesticide Contractors 2,094; Grain Dealers Licenses 60; Rendering Plant Licenses 8
- **Record names:** licensee: varies by program -- fuel station/dispenser operator, poultry dealer, feed mill/dealer, pesticide application contractor, grain dealer, rendering plant operator
- **Company fields:** Company, Address, City, State, Zip, County
- **Identity keys:** License (license number)
- **Contact:** Contact (name), Phone, Email (field exists, null on sampled rows)
- **Contact fill:** phone present on all 3 sampled fuel-pump rows this round; County field was blank on 1 of 3 sampled rows; email null on all sampled rows, consistent with GA-g6-07
- **Equipment:** indirect only, per program: fuel pump registrations imply new dispensers/stations, pesticide contractors imply spray rigs, grain/feed dealers imply trucks and augers -- no explicit equipment field in any program's response
- **Event fields:** IssueDate, ExpirationDate, DateImported
- **Industry filter:** clean at the ProgramID level -- each of the 6 IDs is a distinct license type returned with its own Type label in the Data array (confirmed directly: e.g. 'Fuel Pump Registration Licenses'), so filtering to a specific program is exact; two programs from the prior round's notes (LP gas, scale company) returned 0 rows and were not re-tested this round
- **Size signal:** none
- **Rate limits:** none observed across 6 sequential POST calls (one per ProgramID) this round
- **Terms / restrictions:** same as GA-g6-07 -- no robots.txt on forms.agr.georgia.gov, no stated ToS or commercial-solicitation restriction found
- **Fragility:** high, same undocumented-endpoint risk as GA-g6-07 -- a single API shared across both GA entries means one endpoint change breaks both
- **Entity resolution:** same as GA-g6-07: License number is the clean key, Company name for cross-source joins; each ProgramID is effectively a separate list needing its own dedupe/diff cadence
- **Build effort:** S (<half day), shares the exact same client code as GA-g6-07 -- only the ProgramID parameter changes
- **Verified by fetch:** POST calls for all 6 ProgramIDs (174, 127, 89, 85, 157, 130) each return HTTP 200 JSON with correct Type labels and Total counts, Total counts: 5,624 / 341 / 1,461 / 2,094 / 60 / 8 respectively, sample fuel-pump rows confirm Company, Contact, Address, City, County, Phone, License, IssueDate fields
- **Open questions:** Whether the LP gas and scale-company programs (0 rows per prior round) are simply empty or use a different ProgramID not yet identified, True update cadence and per-program monthly new-issue volume (not re-measured this round)
- **Notes:** Total counts for all 6 programs confirmed directly and align with the general scale prior round described (fuel pump was the largest at 5,624). Same single shared endpoint as GA-g6-07, so both entries rise or fall together operationally -- if the endpoint changes, both break at once.


### IN

#### IN-g6-02 · FMCSA Company Census File filtered to Indiana intrastate vocational carriers — `build_now`

US DOT FMCSA via data.transportation.gov (Socrata) · https://data.transportation.gov/Trucking-and-Motorcoaches/Company-Census-File/az4n-8mr2

- **Verdict:** Confirmed near-real-time federal feed with a literal fleet-size field and cargo-type flags that map directly onto the buy box; only prerequisite is a free app token to clear rate limiting, and a monthly snapshot table to diff power_units for the 'added a truck' event.
- **Endpoint:** https://data.transportation.gov/resource/az4n-8mr2.json?phy_state=IN&carrier_operation=C  (SoQL: add $order=add_date DESC, $where=add_date>'YYYYMMDD' for incremental pulls)
- **Access / format / auth:** socrata_api · json · none for read at low volume; a free Socrata app token is effectively required to avoid throttling (see rate_limits) · cost: free
- **Cadence:** dataset-level rowsUpdatedAt = 2026-09-24T14:13:20Z (essentially live at fetch time); newest IN add_date seen in a 3-record sample = 20260922, i.e. rows from 2 days before the pull -- consistent with daily-or-faster ingestion
- **Latency:** roughly 1-2 days from FMCSA registration/MCS-150 filing to appearing in this feed, based on the newest add_date lagging the pull date by 2 days
- **History:** current-state snapshot per DOT number only; no historical/versioned rows -- power_units etc. reflect the carrier's latest MCS-150 filing, so 'added a truck' can only be seen by diffing snapshots over time, not from the API alone
- **Incremental pull:** yes -- filter on add_date (new registrations) or mcs150_date (updated filings), both YYYYMMDD strings; $where=add_date>'20260901' works
- **Volume:** not cleanly isolable via add_date alone this session (a single-day count came back as 1, which is too noisy from one sample -- needs a proper $where range query and a retry once rate limiting clears); prior round's estimate of ~73 new IN intrastate adds in Aug 2026 (26 vocational) is plausible given the daily cadence but not independently reverified this round
- **Total records:** 39,771 IN carriers with carrier_operation=C (intrastate non-hazmat) as of 2026-09-24, out of 4,507,605 total US rows in the table
- **Record names:** motor carrier (the trucking company itself, i.e. the equipment buyer)
- **Company fields:** legal_name, dba_name, phy_street, phy_city, phy_state, phy_zip, phy_cnty, carrier_mailing_street/city/state/zip
- **Identity keys:** dot_number, docket1/2/3 (MC numbers), business_org_id
- **Contact:** phone, cell_phone, fax, email_address, company_officer_1, company_officer_2
- **Contact fill:** email ~46% (18,368 of 39,771 IN carrier_operation=C rows have a non-null email_address, confirmed by count query); phone fill rate not confirmed this round (query throttled) but all 3 sampled records had a phone value
- **Equipment:** direct: power_units and truck_units are literal fleet-size counts self-reported on the MCS-150; a rise between snapshots is a literal truck-added event
- **Event fields:** add_date (new registration), mcs150_date (filing update), mcs150_update_code_id
- **Industry filter:** the 20+ crgo_* boolean cargo flags (crgo_construct, crgo_garbage, crgo_waterwell, crgo_utility, crgo_drybulk, crgo_bldgmat) cleanly identify vocational trades; carrier_operation (A=interstate, B=intrastate hazmat, C=intrastate non-hazmat) cleanly isolates intrastate short-haul fleets -- confirmed via schema and sample records
- **Size signal:** power_units / truck_units / fleetsize directly proxy fleet size; total_drivers and total_cdl are secondary signals
- **Rate limits:** hit 'Too many requests' (errorCode too-many-requests) repeatedly on unauthenticated calls spaced a few seconds apart; a free Socrata app token (X-App-Token header) is the standard fix and should be obtained before building a daily job
- **Terms / restrictions:** robots.txt (data.transportation.gov) only disallows browse/facet/catalog search-parameter URLs and a few admin paths, not /resource/ API paths -- API access is unrestricted; no commercial-use or solicitation restriction found on data.transportation.gov or in FMCSA's public data notices (this is federal open data, not a state licensing law)
- **Fragility:** low: stable Socrata dataset ID (az4n-8mr2) and REST API; main operational risk is the observed rate limiting without an app token
- **Entity resolution:** join to other sources on legal_name + phy_city/zip (dirty names -- e.g. suffix variants, DBA vs legal name mismatch seen in sample); dot_number is the clean unique key for internal dedup/diffing across monthly pulls
- **Build effort:** S (<half day) once an app token is obtained; SoQL filtering does the heavy lifting server-side
- **Verified by fetch:** dataset metadata (rowsUpdatedAt, 147 columns), sample IN carrier_operation=C records with add_date, cargo flags, power_units, email_address, national total_records=4,507,605, IN carrier_operation=C total=39,771, IN carrier_operation=C email fill=18,368/39,771, robots.txt has no disallow on /resource/
- **Open questions:** Exact new-adds-per-month figure for IN (throttled before a clean $where date-range count could be run), Phone fill rate (not confirmed this round), Whether an app token fully removes the throttling seen on unauthenticated calls
- **Notes:** This entry and ALL-g6-06 are the same underlying Socrata table (az4n-8mr2); the state-filtered query is just a SoQL predicate on the national table, not a separate feed. Monthly diff method: store dot_number + power_units + truck_units + mcs150_date snapshots monthly; a truck-added event = same dot_number with power_units(t) > power_units(t-1), or a new dot_number appearing (fleet activation) filtered to carrier_operation=C and the target crgo_* flags.

#### IN-g6-03 · IDEM Approved Septage Management Permittees list (septage, grease, portable toilet haulers) — `build_now`

Indiana Department of Environmental Management, Office of Land Quality · https://www.in.gov/idem/landquality/solid-waste/septage-management/

- **Verdict:** Small, clean, monthly-refreshed roster of exactly the septic/grease/portable-toilet trades in the buy box, with usable phone/email fill; only real risk is the opaque URL hash if IDEM ever regenerates it under a new path.
- **Endpoint:** https://www.in.gov/dA/a58af117a7/permits_issued_sw_septage_fac.pdf
- **Access / format / auth:** pdf · pdf · none · cost: free
- **Cadence:** monthly; HTTP last-modified 2026-09-11, footer text inside the PDF reads 'Updated 09/01/2026'
- **Latency:** not directly measurable, but the pending-applications companion report (IN-g6-04) shows new permits go from received to appearing here typically within 1-4 months given RAI/review cycles
- **History:** current roster snapshot only, no history; SW IDs run up to 1355, implying the program has issued that many permits since inception with no start date stated on the file itself
- **Incremental pull:** no incremental query -- single PDF, full re-download and diff on SW ID each pull
- **Volume:** not measurable from one snapshot; a handful of new SW IDs per month is plausible given SW IDs run to 1355 and the pending list (IN-g6-04) shows only ~1-3 new applications/month
- **Total records:** 431 (per prior round's count; not independently re-tallied this round due to pdftotext's layout parser splitting some rows across lines, but the max SW ID observed is 1355 and the last page's entries were all readable)
- **Record names:** permittee: septage/grease/portable-toilet haulers licensed to operate in Indiana
- **Company fields:** PERMITTEE (individual/owner name), BUSINESS NAME, COUNTY
- **Identity keys:** SW ID
- **Contact:** PHONE, EMAIL
- **Contact fill:** phone present on essentially every row sampled (spot-checked ~30 rows across the file, all had phone); email present on roughly half of sampled rows (many rows show a blank email column)
- **Equipment:** indirect: service-type flags (Domestic Septage, Grease, Chemical Toilets, Storage, Treatment, Land Application) imply a vacuum/pump truck or portable-toilet service truck is required to hold the permit at all, but there is no direct vehicle-count field
- **Event fields:** EXP (permit expiration date, renewal cycle typically 2-5 years out)
- **Industry filter:** the X-flag service columns (Domestic Septage, Grease, Chemical Toilets/portable toilets, Storage, Treatment, Land Application) cleanly separate portable-toilet operators from septage/grease-only haulers -- confirmed by direct read of ~40 rows
- **Size signal:** none direct; multiple service-type X's on one row (e.g. septage + grease + storage + treatment + land application) loosely proxies a larger, more diversified operation
- **Rate limits:** none observed on the direct PDF download
- **Terms / restrictions:** in.gov robots.txt only lists a sitemap directive with no disallow rules at all; no page-specific ToS or commercial-solicitation restriction found on the IDEM septage program page in the time available
- **Fragility:** medium: URL uses an opaque hash-style path (/dA/a58af117a7/...) rather than a predictable filename, so if IDEM regenerates the file at a new hash the hardcoded link would need rediscovery from the landing page
- **Entity resolution:** SW ID is the clean join key to the pending-applications report (IN-g6-04) and across monthly snapshots; several rows are large national/regional players (Rumpke appears 3+ times under different counties) that should be filtered out as non-buy-box; many rows have PERMITTEE = BUSINESS NAME (owner-operator) which simplifies name matching
- **Build effort:** S (<half day): pdftotext -layout parses the table cleanly; main effort is a small layout-parsing script to handle occasional multi-line entries (e.g. long company names wrap to a second line)
- **Verified by fetch:** PDF downloads (1,191,525 bytes) and parses via pdftotext -layout, HTTP last-modified 2026-09-11 and in-file footer 'Updated 09/01/2026', sample rows showing SW ID, permittee/business name, county, phone, email, service-type X flags up to SW ID 1355, in.gov robots.txt has no disallow rules
- **Open questions:** Exact current total row count (pdftotext layout parsing made an automated count unreliable this round; prior round's 431 was not re-verified), Whether the /dA/<hash>/ URL is stable across IDEM's monthly regenerations or changes each time
- **Notes:** Confirms prior round's description closely. The file format is PDF, not a structured feed -- pipeline needs a small layout-aware parser (pdftotext -layout works but the table has occasional row-wrapping for long business names) rather than a simple CSV read.

#### IN-g6-04 · IDEM Pending Septage Management Applications tracking report — `build_now`

Indiana Department of Environmental Management, Office of Land Quality · https://www.in.gov/idem/landquality/solid-waste/septage-management/

- **Verdict:** Very low volume but the highest-intent signal in the batch -- an application in review means a vehicle purchase is imminent; cheap to ingest given it shares infrastructure with IN-g6-03 and joins to it on SW ID for contact info.
- **Endpoint:** https://www.in.gov/dA/a1a066bf55/permits_pending_sw_septage_app.pdf
- **Access / format / auth:** pdf · pdf · none · cost: free
- **Cadence:** monthly; HTTP last-modified 2026-09-11
- **Latency:** applications appear in this report within roughly 1-4 weeks of the 'date received' column based on the spread between received and 'active days' seen in the sample
- **History:** current pending-queue snapshot only; rows drop off once approved (they then appear in IN-g6-03) or denied
- **Incremental pull:** no incremental query -- single PDF, full re-download; diff on SW ID against the prior month's pending list and against IN-g6-03 to detect approvals
- **Volume:** roughly 1-3 new applications per month based on the spread of 'date received' values in the sample (ranging from 10/17/2025 through 8/27/2026 across 26 total pending rows)
- **Total records:** 26
- **Record names:** applicant: businesses/individuals applying for a new or renewal septage management permit
- **Company fields:** PERMITTEE, BUSINESS NAME, COUNTY
- **Identity keys:** SW ID
- **Contact fill:** 0% -- no phone or email column in this report; contact info must be joined from IN-g6-03 once/if the application is approved, or is unavailable pre-approval
- **Equipment:** indirect only, via the underlying service type once matched to IN-g6-03 after approval; this report alone carries no equipment or service-type field
- **Event fields:** DATE RECEIVED, DATE DUE, RAI (request-for-additional-information) dates #1/#2, ACTIVE DAYS, TOTAL DAYS, REMAINING DAYS
- **Industry filter:** none directly in this file (no service-type flags); filterability only comes after joining to IN-g6-03 on SW ID once approved
- **Size signal:** none
- **Rate limits:** none observed
- **Terms / restrictions:** same in.gov robots.txt as IN-g6-03 -- no disallow rules, no stated commercial-use restriction found
- **Fragility:** medium, same opaque-hash URL risk as IN-g6-03
- **Entity resolution:** SW ID joins directly to IN-g6-03 for contact enrichment once a permit is approved; low volume (26 rows) makes this a cheap monthly diff even with manual review
- **Build effort:** S (<half day): same parsing approach as IN-g6-03, smaller table
- **Verified by fetch:** PDF downloads and parses via pdftotext -layout, 26 pending rows confirmed by direct count of rows matching the SW ID pattern, date-received range 10/17/2025 to 8/27/2026 read directly from the table, examples E&C Planck Septic/Portable Toilet Service LLC and Beebe's Excavation & Septic Services LLC confirmed present, matching prior round's notes
- **Open questions:** Whether IDEM ever removes a denied/withdrawn application from the report without it appearing as an approval in IN-g6-03 (would need a 3-way diff to distinguish denial from approval)
- **Notes:** No contact fields at all in this report -- it is purely a lead-timing signal (a company is about to become permitted) and must be enriched by joining SW ID to IN-g6-03 after approval, or by an out-of-band lookup while still pending.

#### IN-g6-05 · INDOT Official Bid Tabulations (letting results) — `build_now`

Indiana Department of Transportation, Contracts Division · https://www.in.gov/indot/doing-business-with-indot/home/contracts/letting-archives2/

- **Verdict:** Confirmed clean, high-value award data (31 awards/letting, phone+email fill near 100% in the sample) with real 2-week publish latency; the main engineering cost is the scraper needing to discover per-letting slugs and filenames rather than hit a fixed URL, which is a one-time build cost, not an ongoing fragility risk once written defensively.
- **Endpoint:** https://www.in.gov/indot/doing-business-with-indot/home/contracts/letting-archives2/<letting-slug> (per-letting landing page listing a set of file links; the official tabulation PDF for the Sept 2, 2026 letting was at /indot/doing-business-with-indot/files/20260902_Official-Tab-A.pdf)
- **Access / format / auth:** html_scrape · pdf · none · cost: free
- **Cadence:** monthly (one letting per month observed in the archive index, e.g. Sept 2, 2026); the official tab PDF for the 9/2/2026 letting has HTTP last-modified 2026-09-16, i.e. published about 2 weeks after the letting date
- **Latency:** about 2 weeks from letting date to official tabulation PDF publish, confirmed directly (letting 9/2/2026, official tab last-modified 9/16/2026)
- **History:** archive index goes back at least to December 2020, confirmed by URL listing (december-16-2020 slug present)
- **Incremental pull:** no API -- pipeline must crawl the archive index page for new letting-slug links, then fetch each new letting's file list and pull the Official-Tab PDF; no date-based query parameter available
- **Volume:** ~31 (measured directly from the 9/2/2026 official tab: 32 calls listed, 31 marked Awarded)
- **Total records:** 32 calls / 31 awarded in the Sept 2, 2026 letting alone (confirmed directly, matches prior round's figure); each monthly letting has a similar count, so roughly 25-35 new award records per month
- **Record names:** bidder (contractor) awarded or bidding on a state road/bridge contract
- **Company fields:** Bidder name, Address (city, state)
- **Identity keys:** Code (a tax-ID-style number, e.g. 35-0918397), Contract number (e.g. R-42311-A)
- **Contact:** Phone, Email (bid-submission contact email, e.g. Lettings-Gary@rieth-riley.com)
- **Contact fill:** phone and email present for essentially every bidder row in the sampled pages (5+ calls checked, all bidders had both phone and an email address)
- **Equipment:** indirect: contract description/type (e.g. bike/pedestrian facilities, paving, bridge) implies the equipment class needed to execute the job, but there is no explicit equipment field
- **Event fields:** Amount of Bid, Type (bid type code), Low/Awarded flag, DBE %, Engineer's Estimate, County, District, Description, Route/Location
- **Industry filter:** the Description field is free text (e.g. 'BIKE AND PEDESTRIAN FACILITIES') rather than a controlled industry code, so filtering to paving/excavation/bridge trades requires keyword matching on Description, not a clean categorical field
- **Size signal:** bid amount and Engineer's Estimate proxy job size; large national/repeat firms dominate per prior round's note, so filtering to smaller in-state bidders needs an address-state or bid-amount heuristic
- **Rate limits:** none observed on direct PDF downloads
- **Terms / restrictions:** same in.gov robots.txt as the IDEM entries -- no disallow rules found, no stated commercial-use restriction
- **Fragility:** high: each letting gets its own landing-page slug (e.g. 'wednesday-september-2-2026-regular-letting') that must be discovered from the archive index rather than predicted, and each landing page links a dozen+ files by ad hoc names (Official-Tab, SOPI, NTC, BidderList, Wage-Notification) with inconsistent naming across lettings -- a scraper needs to pattern-match on '*Official*Tab*.pdf' or similar rather than a fixed filename
- **Entity resolution:** the bidder Code field looks like an EIN-style tax ID and could be a strong join key if consistent across lettings; bidder name plus city/state is the fallback; only the awarded (Low=X, Remarks=Awarded) row per call is the real customer event, other bidders on the same call are non-events
- **Build effort:** M (1-2 days): needs an archive-index crawler plus a per-letting file-link scraper (filenames are not fully predictable) plus a PDF table parser; pdftotext -layout worked cleanly on the sample
- **Verified by fetch:** archive index page lists letting slugs back to Dec 2020, Sept 2, 2026 letting landing page file list (14 linked files incl. Official-Tab, SOPI, NTC, BidderList), Official-Tab PDF downloads (527,234 bytes) and parses via pdftotext -layout into 32 pages, sample call (Call 121, Contract R-42311-A) with 5 bidders, tax-ID-style codes, phone, email, bid amounts, and an Awarded flag, 32 calls / 31 awarded confirmed via grep count on the parsed text
- **Open questions:** Whether letting-slug naming is predictable enough to construct next month's URL in advance, or must always be discovered from the index page, Whether emergency/special lettings (seen interspersed in the archive index) follow the same file-naming pattern as regular lettings
- **Notes:** Confirms prior round's description and adds the concrete filename pattern (20260902_Official-Tab-A.pdf) and per-letting page structure. Scraper should target the archive index for new slugs, then look for a filename containing 'Official' and 'Tab' rather than hardcoding the full filename, since naming varies (e.g. some lettings may split into Tab-A/Tab-B).


### TN

#### TN-g5-01 · Nashville Active Right-of-Way Permits — `build_later`

Metro Nashville NDOT / Nashville Open Data · https://datanashvillegov-nashville.hub.arcgis.com/datasets/9dca1182c9c0411fa1b3d34ee423fa48

- **Verdict:** Plumbing is trivial and cadence is genuinely near-real-time, but Company fill rate is only ~22% and there are zero contact fields, so this alone can't drive outreach - needs to be joined to a licensing or contact-bearing source (e.g. TN-g5-05) before it produces a sendable record.
- **Endpoint:** https://services2.arcgis.com/HdTo6HJqh92wn4D8/arcgis/rest/services/Active_Right-of-Way_Permits/FeatureServer/0/query
- **Access / format / auth:** arcgis_api · json · none · cost: free
- **Cadence:** daily; item metadata 'modified' timestamp is 2026-09-23 and newest Initiated__Date record is 2026-09-23T19:49:51 (pulled 2026-09-24)
- **Latency:** same day to next day; a permit initiated/issued same afternoon (19:49 local) was already queryable
- **History:** not date-bounded in schema; dataset is scoped to 'active/valid/in-process' permits only, not a full archive (19,911 total rows currently)
- **Incremental pull:** yes; query with orderByFields=Initiated__Date DESC or where Initiated__Date > <last pull>, paginate with resultOffset
- **Volume:** not independently re-measured this round; prior round estimated ~500 excavation permits/month (Aug 2026 basis). Confirmed this round: Permit__Type LIKE '%EXCAVATION%' matches 6,233 of the 19,911 active rows total (not a monthly figure — dataset holds all currently-active permits, so this is a stock count, not a flow rate)
- **Total records:** 19,911 (returnCountOnly, pulled 2026-09-24)
- **Record names:** permit applicant/contractor performing the street work (ROW permittee), not a property owner
- **Company fields:** Company, Permit__Applicant__Name, Location__Address, City, Zip
- **Contact fill:** Company field: 11/50 (22%) filled in a 50-row sample; Permit__Applicant__Name: 50/50 (100%) filled, but this is a free-text name field that is sometimes an individual, sometimes a company, sometimes a public agency (e.g. 'Metro Water and Sewer', 'NDOT') — needs entity classification before it's usable as a company field. No phone/email fields exist in the schema at all.
- **Equipment:** indirect - Permit__Type (e.g. Lane Closure, Excavation) and Scope/Permit__Description imply excavation/trenching work is underway, but no equipment fields
- **Event fields:** Permit__Type, Permit__Description, Scope, Status, Initiated__Date, Scheduled__Start, Scheduled__End, Onstreet/Fromstreet/Tostreet
- **Industry filter:** Permit__Type filters cleanly to Excavation vs Lane Closure vs Sidewalk Cafe etc.; good coarse filter for excavation/utility work
- **Size signal:** none
- **Rate limits:** none observed; standard Esri FeatureServer, no throttling hit on several rapid queries
- **Terms / restrictions:** robots.txt on data.nashville.gov sets Crawl-delay: 60 and disallows a few admin paths (not the API); no commercial-solicitation restriction found in the Nashville Open Data hub terms-of-use page (200 OK, no 'commercial' language present). ArcGIS Online itself has a permissive robots.txt.
- **Fragility:** low - stable ArcGIS REST FeatureServer, standard schema, confirmed live and responsive
- **Entity resolution:** Company field mostly blank; fall back to Permit__Applicant__Name plus Location__Address for fuzzy matching, but expect noise from individual names and public agencies mixed into applicant field. No stable ID (license #, tax ID) to join on.
- **Build effort:** S (<half day) - standard Esri query pattern, same as other Nashville ArcGIS sets
- **Verified by fetch:** endpoint URL, field schema, record count (19,911), recency of newest record, Company fill rate sample (11/50), Permit__Applicant__Name fill rate (50/50), robots.txt, terms-of-use page reachable, no commercial restriction text found
- **Open questions:** Does the 'active' scope mean permits drop out of this feed once closed/expired, requiring daily snapshotting to build history (like the Building Permit Applications set)?, Is there a companion 'issued/historical' ROW permits dataset with a longer window?
- **Notes:** Prior round's 'Company field needs name matching to get address' undersells the gap - Company is blank on ~78% of rows, so the practical join key is the freetext Applicant Name, not Company.

#### TN-g5-02 · TDEC Air Pollution Control Permits — `build_later`

TDEC Division of Air Pollution Control DataViewer · https://dataviewers.tdec.tn.gov/dataviewers/f?p=19031:34001

- **Verdict:** Could not re-verify any plumbing claim this session - the whole TDEC DataViewer domain is currently blocking automated requests (403 on every URL tried). Prior round reported it working from a different session/IP, so this is not necessarily permanently dead, but a nightly pipeline cannot depend on a source that 403s an unauthenticated GET with no clear pattern; needs residential/non-cloud egress or a session-cookie workaround verified before committing build effort.
- **Access / format / auth:** portal_search · csv · none · cost: free
- **Record names:** permittee (facility operator)
- **Fragility:** high - the entire dataviewers.tdec.tn.gov domain returned HTTP 403 Forbidden to every request this session (plain curl, curl with a browser User-Agent, and WebFetch all blocked), for this URL and both of the other two TDEC dataviewer URLs in this batch. This directly contradicts the prior round's claim of a working session-based CSV export ('APEX CSV works from cloud IP'). Either the WAF now blocks this environment's egress IP range, or TDEC tightened bot protection since the last pull.
- **Verified by fetch:** landing URL returns 403 Forbidden to curl and WebFetch
- **Open questions:** Is the 403 IP-range-based (would a different network succeed), or has TDEC added bot detection that also blocks the prior round's method?, Does TDEC publish a bulk/Socrata mirror of this data elsewhere (data.tn.gov) that isn't behind the APEX DataViewer WAF?
- **Notes:** Not independently verified this round - deferring to prior round's schema/volume claims (Facility ID, permittee name, permit type, city, county, issued date; ~50/month total, ~9 crusher/batch plant NOCs) but those are now unconfirmed given the access failure. Treat prior round's numbers as inferred, not fact, until access is re-established.

#### TN-g5-03 · TDEC DWR Permits (CGP, ARAP, TMSP, RMCP) — `build_later`

TN Dept of Environment and Conservation, Division of Water Resources DataViewer · https://dataviewers.tdec.tn.gov/dataviewers/f?p=2005:34001

- **Verdict:** Same blocking issue as TN-g5-02: this session could not reach the TDEC DataViewer at all, so none of the prior round's plumbing claims (session-token CSV export pattern, cadence, volumes) could be re-confirmed. Note the prior round's own text flagged this as working 'from cloud IP' with a session-token workaround (f?p=2005:34001:<session>:CSV) - that fragility is now realized: it does not work reliably.
- **Access / format / auth:** portal_search · csv · none · cost: free
- **Record names:** permittee (usually site owner/developer, not necessarily the grading contractor)
- **Fragility:** high - same dataviewers.tdec.tn.gov domain as TN-g5-02, returned HTTP 403 Forbidden on every attempt this session (curl plain, curl with browser UA, WebFetch)
- **Verified by fetch:** landing URL returns 403 Forbidden to curl and WebFetch
- **Open questions:** Same as TN-g5-02 - is the block IP-based or a new bot-detection rule?, Given the permittee is often the site owner/developer rather than the grading contractor (per prior round's own note that the contractor sits inside NOI PDFs under Documents), how much extra PDF-parsing effort does this source actually require even when reachable?
- **Notes:** Not independently verified this round - deferring to prior round's numbers (~330/month statewide: ~180 CGP, ~107 ARAP, ~28 TMSP) as unconfirmed pending access fix.

#### TN-g5-04 · TDEC Water Well Driller Reports (completed wells) — `build_later`

TDEC Division of Water Resources (DWR DataViewer, WLTS) · https://dataviewers.tdec.tn.gov/dataviewers/f?p=2005:39929

- **Verdict:** Same TDEC-wide access failure as TN-g5-02 and TN-g5-03; could not confirm the ~33MB full CSV download, the 266,365-record total, or the per-driller volume claims this session.
- **Access / format / auth:** portal_search · csv · none · cost: free
- **Latency:** 1 to 3 months between completion and report receipt, per prior round (unconfirmed this session)
- **Record names:** well driller (licensee) and well owner
- **Fragility:** high - same dataviewers.tdec.tn.gov domain, 403 Forbidden on every attempt this session
- **Verified by fetch:** landing URL returns 403 Forbidden to curl and WebFetch
- **Open questions:** Same access question as the other two TDEC sources - all three failing together suggests a domain-wide WAF change rather than a per-dataset issue, worth re-testing from a non-cloud IP before writing this source off.
- **Notes:** Not independently verified this round - deferring to prior round's numbers (266,365 wells total; 160-316 completed/month in 2025) as unconfirmed. Given all three TDEC dataviewer sources in this batch failed identically, treat this as one shared plumbing risk (the TDEC DataViewer platform itself), not three independent risks.

#### TN-g5-05 · TN Board for Licensing Contractors: Contractor and Qualifying Agent Data (bulk CSV) — `build_later`

TN Dept of Commerce and Insurance, Board for Licensing Contractors (Tableau on data.tn.gov) · https://www.tn.gov/commerce/regboards/contractors/consumer/verify-qa.html

- **Verdict:** This is the single highest-value source in the batch on paper (bulk file, no auth, email/phone/aggregate-monetary-limit fields, clean trade-classification codes) but this session could not reach data.tn.gov at all - three different fetch methods all failed (timeout, timeout, ECONNRESET) while the sibling www.tn.gov host worked normally. Needs a retest before committing build time; if the block is durable, the full-file-diff approach the prior round describes is otherwise sound.
- **Endpoint:** https://data.tn.gov/t/Public/views/ContractorandQAdata/PublicDashboard.csv?:embed=y
- **Access / format / auth:** bulk_file · csv · none · cost: free
- **Incremental pull:** no incremental query support even if reachable - it's a full Tableau extract download each time, not a queryable API; incrementality has to be done client-side by diffing successive full pulls
- **Record names:** licensed contractor / qualifying agent
- **Fragility:** high - data.tn.gov (this is a different host than the www.tn.gov agency site, which was reachable fine) timed out on every connection attempt this session: plain HEAD, GET with browser UA, and WebFetch (WebFetch returned ECONNRESET). www.tn.gov itself responded 200 OK immediately, so this is specific to the data.tn.gov Tableau Public host, not a general TN state network block.
- **Verified by fetch:** data.tn.gov unreachable via curl HEAD (28s timeout) and WebFetch (ECONNRESET); www.tn.gov reachable and returned 200 OK as a control
- **Open questions:** Is data.tn.gov's Tableau Public endpoint rate-limiting or blocking cloud/datacenter IPs specifically (would explain a clean 200 from www.tn.gov but a hang on data.tn.gov)?, Tableau Public CSV exports are notoriously fragile to view/dashboard renames on the publisher's end - if reachable, how stable has this specific view URL been historically?
- **Notes:** Not independently verified this round - deferring to prior round's numbers (33,987 rows / 29,095 licenses; 126-216 new licenses/month) as unconfirmed. This source and the three TDEC sources together mean 4 of 8 sources in this batch had a live-access failure this session - worth flagging to whoever owns the pipeline infra that egress IP/UA may need hardening (e.g. a residential proxy or scheduled runs from TN business hours) before relying on any of these four.

#### TN-g5-06 · Chattanooga All Permits — `build_now`

City of Chattanooga Development Review and Permitting · https://data.chattanooga.gov/datasets/9937e99e93de467eae5f592061c2672c

- **Verdict:** Confirmed live, well-structured, has a real identity key (contractor license #) and phone field with meaningful fill rate - best-plumbed source in the batch. Full-file-only download is the main cost, but the file is still small enough (77MB) to pull nightly.
- **Endpoint:** https://www.arcgis.com/sharing/rest/content/items/9937e99e93de467eae5f592061c2672c/data
- **Access / format / auth:** bulk_file · csv · none · cost: free
- **Cadence:** daily; item metadata modified 2026-09-24 (unix 1790240463000); newest applieddate rows are 2026-09-22, pulled 2026-09-24
- **Latency:** roughly 1-2 days from applieddate to appearing in the file, based on newest rows seen
- **History:** not bounded by the file itself - full permit history export, not a rolling window (unlike the two Nashville sets, which are explicitly rolling 3-year windows)
- **Incremental pull:** no native filtering - it is a single flat 77MB CSV, full-file only; incrementality must be done by diffing on permitnum/lastupdated client-side
- **Volume:** prior round estimate ~1,100 issued/month (Aug 2026 basis), not independently re-measured this round since the full file wasn't downloaded
- **Total records:** not counted this session (77,178,904 bytes per ArcGIS item metadata; did not download the full 77MB file, only a byte-range sample of the header + first rows, per the brief's guidance to skip/partial-sample large files)
- **Record names:** permit applicant/contractor (contractorcompanyname) plus site/property address
- **Company fields:** contractorcompanyname, contractoraddress1, contractoraddress2, contractorcity, contractorstate, contractorzip, contractorcompanydesc
- **Identity keys:** contractorlicnum, contractorstatelic
- **Contact:** contractorphone, contractoremail, contractorfullname
- **Contact fill:** not re-measured this round on a fresh sample; prior round reported ~670/1,100 with contractor and ~250/1,100 with phone (Aug 2026 basis); confirmed this round that contractoremail column exists in the header but is empty on the 3 sampled rows
- **Equipment:** indirect - permitclass/permittype/permitsubtype/description (e.g. 'Utility Street Cut', 'Land Disturbing') imply excavation/earthwork; description field is free text and can mention specific work like pipe replacement
- **Event fields:** applieddate, issueddate, permitclass, permitclassmapped, workclass, permittype, permitsubtype, description, estprojectcost, totalsqft
- **Industry filter:** permitclass/workclass/permittype fields give a reasonably clean filter (e.g. 'Utility Street Cut Permit', 'Land Disturbing Permit'), though many rows leave the *mapped fields blank per the sample
- **Size signal:** estprojectcost as a rough proxy for job size, not company size
- **Rate limits:** none hit; single large static file download, standard ArcGIS content item hosting
- **Terms / restrictions:** not checked this round beyond the generic arcgis.com robots.txt (permissive); no Chattanooga-specific ToS reviewed
- **Fragility:** medium - full-file-only bulk CSV (no query API) at 77MB and growing; a nightly pipeline must download the whole file each run and diff, which is more bandwidth/compute than a queryable API and will only get heavier as the file grows since it isn't a rolling window
- **Entity resolution:** contractorlicnum/contractorstatelic give a real join key back to TN-g5-05-style license rosters, better than the Nashville permit sets which have no identity key at all
- **Build effort:** M (1-2 days) - straightforward download but full-file diffing logic against a growing 77MB+ CSV (no incremental API) adds real engineering vs. a queryable endpoint
- **Verified by fetch:** ArcGIS item metadata (77,178,904 byte CSV, type CSV, public access), CSV header row (68 columns), 3 sample rows via HTTP range request showing recent applieddate (2026-09-22), contractorcompanyname populated on one row, empty contractoremail column
- **Open questions:** Does the file get replaced in place daily (same URL) or does the item ID change/rotate - worth a second pull tomorrow to confirm URL stability before building on it.
- **Notes:** Unlike the two Nashville building-permit sets, this is NOT a rolling-window feed as far as could be determined - treat as a full historical export that needs to be diffed on permitnum, not re-ingested wholesale each night.

#### TN-g5-07 · Nashville Building Permit Applications — `enrichment_only`

Metro Nashville Codes / Nashville Open Data · https://datanashvillegov-nashville.hub.arcgis.com/datasets/4c38be57f3fd47d6844ba820d1ea677c_0/explore

- **Verdict:** Confirmed live and fast-moving, but no contact fields and Contact is often an individual, not the equipment-buying company; useful as an earlier-signal enrichment layer on top of a contact-bearing source (e.g. license rosters), not a standalone lead source.
- **Endpoint:** https://services2.arcgis.com/HdTo6HJqh92wn4D8/arcgis/rest/services/Building_Permit_Applications_Feature_Layer_view/FeatureServer/0/query
- **Access / format / auth:** arcgis_api · json · none · cost: free
- **Cadence:** daily per source description ('updated daily'); newest Date_Entered rows are 2026-09-23, pulled 2026-09-24
- **Latency:** same day to next day
- **History:** rolling 3-year window per source description; and structurally self-limiting since applications drop out once issued
- **Incremental pull:** yes; query with orderByFields=Date_Entered DESC or Date_Entered > <last pull>
- **Volume:** not independently re-measured this round; prior round's ~415/month (Aug 2026 basis) reflects a stock count, not a flow rate, same caveat as TN-g5-01
- **Total records:** 6,148 (returnCountOnly, pulled 2026-09-24)
- **Record names:** applicant (Contact field - can be an individual name, e.g. 'marco munoz', 'chris langebartels', not necessarily a company)
- **Company fields:** Contact, Address, City, State, ZIP, Parcel
- **Contact fill:** Contact field: 5/5 filled in a 5-row sample, but format is inconsistent - mixes company names ('JONES, DANIEL CONSTRUCTION LLC') with plain individual names ('marco munoz', 'Masood Sakhi'), no separate phone/email fields exist in schema
- **Equipment:** indirect - Purpose text field describes the work (e.g. 'conduct interior renovations', 'place mobile food trailer'), Per_Ty/Per_SubTy/Permit_Type_Description give category
- **Event fields:** Date_Entered, Date_Issued, Const_Cost, Purpose, Permit_Type_Description, Permit_Subtype_Description
- **Industry filter:** Permit_Type_Description/Per_Ty give a coarse filter; Purpose is free text and the best signal for trade-specific work but requires keyword parsing
- **Size signal:** Const_Cost as a rough job-size proxy
- **Rate limits:** none observed
- **Terms / restrictions:** same Nashville Open Data hub terms as TN-g5-01 - no commercial-solicitation restriction found
- **Fragility:** medium - records only exist in this feed while pending; once issued they disappear from this dataset and (per prior round) move to the Issued dataset, so a pipeline must snapshot and diff daily or it will silently lose records that get issued same-day
- **Entity resolution:** No identity key; Contact field format is inconsistent (person vs company); Parcel field could join to property records for owner info but not to a licensing/contact source directly
- **Build effort:** S (<half day) for the query itself; add complexity for the daily-snapshot-and-diff requirement to catch records before they age out
- **Verified by fetch:** endpoint URL and field schema, record count (6,148), 5 recent Date_Entered rows confirming 2026-09-23 recency, Contact field fill rate on 5-row sample
- **Open questions:** What fraction of records in this feed are commercial/contractor-driven vs. homeowner-driven (the sample showed a mix, e.g. a mobile food trailer placement vs. a construction LLC)?

#### TN-g5-08 · Nashville Building Permits Issued — `enrichment_only`

Metro Nashville Codes / Nashville Open Data · https://datanashvillegov-nashville.hub.arcgis.com/datasets/2576bfb2d74f418b8ba8c4538e4f729f_0/about

- **Verdict:** Same conclusion as TN-g5-07: confirmed live and clean plumbing, but no contact fields and Contact field mixes individuals with companies, so it enriches/corroborates other sources (confirms a permit actually got issued, gives Const_Cost as a size filter) rather than standing alone as an outreach source.
- **Endpoint:** https://services2.arcgis.com/HdTo6HJqh92wn4D8/arcgis/rest/services/Building_Permits_Issued_2/FeatureServer/0/query
- **Access / format / auth:** arcgis_api · json · none · cost: free
- **Cadence:** daily per source description; newest Date_Issued rows are 2026-09-23, pulled 2026-09-24
- **Latency:** same day to next day
- **History:** rolling 3-year window per source description
- **Incremental pull:** yes; query with orderByFields=Date_Issued DESC or Date_Issued > <last pull>
- **Volume:** not independently re-measured this round; prior round's ~900/month, ~260 commercial (Aug 2026 basis) not re-verified
- **Total records:** 29,549 (returnCountOnly, pulled 2026-09-24)
- **Record names:** applicant/contact on the permit (Contact field), same format issue as TN-g5-07 - mixes individuals and companies (e.g. 'Youssef Law, PLLC' vs. 'Amanda Tupper', 'gertrude pieri')
- **Company fields:** Contact, Address, City, State, ZIP, Parcel
- **Contact fill:** Contact field: 5/5 filled in a 5-row sample, same mixed individual/company format as TN-g5-07; no phone/email fields in schema
- **Equipment:** indirect - Purpose/Permit_Type_Description imply construction scope (new build, addition, rehab, tenant finish); Const_Cost ranged widely in sample ($3,500 to $9,500,000), useful for filtering out large commercial jobs that are out of the buy-box size range
- **Event fields:** Date_Entered, Date_Issued, Const_Cost, Purpose, Permit_Type_Description, Permit_Subtype_Description
- **Industry filter:** same as TN-g5-07: Permit_Type_Description/Per_Ty coarse filter, Purpose free text for trade-specific detail
- **Size signal:** Const_Cost is a usable proxy and was confirmed to vary by 3+ orders of magnitude in the small sample, so it's worth filtering on to exclude both trivial and mega-scale jobs
- **Rate limits:** none observed
- **Terms / restrictions:** same Nashville Open Data hub terms as TN-g5-01/07 - no commercial-solicitation restriction found
- **Fragility:** low - same stable ArcGIS FeatureServer pattern as the other two Nashville sets, and unlike Applications this one doesn't age out (it's the terminal state)
- **Entity resolution:** No identity key, same Contact-field ambiguity issue as TN-g5-07; this is the natural pair to diff against TN-g5-07 to measure application-to-issuance lag per contractor
- **Build effort:** S (<half day)
- **Verified by fetch:** endpoint URL and field schema, record count (29,549), 5 recent Date_Issued rows confirming 2026-09-23 recency, Contact field fill rate and Const_Cost range on 5-row sample
- **Open questions:** Would joining Date_Entered (present in this schema too) let us reconstruct the app→issued lag per record without needing to diff the separate Applications dataset?


### TX

#### TX-g1-01 · Comptroller Signed Statement Registration Numbers (dyed diesel, off-road use) — `build_now`

Texas Comptroller of Public Accounts · https://data.texas.gov/Government-and-Taxes/Signed-Statement-Registration-Numbers/a5y7-t5ih

- **Verdict:** Clean daily Socrata feed with an easy incremental filter (registration_number prefix + effective_date), but zero contact fields and a weak industry filter mean it needs an enrichment join before it produces an addressable lead.
- **Endpoint:** https://data.texas.gov/resource/a5y7-t5ih.json
- **Access / format / auth:** socrata_api · json (csv/xlsx export also available) · none · cost: free
- **Cadence:** daily; rowsUpdatedAt = 2026-09-24T11:20:07Z, newest effective_date rows = 2026-09-23
- **Latency:** ~1 day (effective_date 2026-09-23 present the next day)
- **History:** dataset created 2018-08-24 (createdAt epoch); effective_date field goes back further, not bounded in this check
- **Incremental pull:** yes; $order=effective_date DESC or $where=effective_date > 'X'; filter registration_number starts_with 'DD' (non-farm) or 'AG' (agricultural)
- **Volume:** not remeasured this session; prior round measured ~107 DD + 214 AG/month over a 90-day window, structure consistent with what was fetched
- **Total records:** 233,091 (measured via $select=count(*))
- **Record names:** taxpayer registering to buy tax-free dyed diesel for off-road use — NOT always a company; confirmed sample rows are individual names (e.g. 'FELICIA A MCGEE'), not just LLCs
- **Company fields:** name, city, zip
- **Identity keys:** tp_id (Comptroller taxpayer number), registration_number
- **Contact fill:** 0% — no phone/email/contact-person field exists in the schema
- **Equipment:** indirect — registration implies off-road diesel equipment use but names no equipment type or count
- **Event fields:** effective_date, suspended
- **Industry filter:** only via registration_number prefix (DD vs AG); no NAICS/industry field at all — weak
- **Size signal:** none
- **Rate limits:** Socrata default unauthenticated throttle; not hit across ~5 requests this session; app token recommended for nightly production use
- **Terms / restrictions:** Dataset license = 'Public Domain' per Socrata metadata (api/views/a5y7-t5ih.json). robots.txt (data.texas.gov/robots.txt) only disallows browse/search UI paths, not /resource/ API paths. No commercial-solicitation restriction found in metadata; portal /terms page returned 404 and Socrata's general ToS page returned 403 so the umbrella ToS text itself could not be read directly.
- **Fragility:** low — stable Socrata 4x4 id live since 2018, clean flat schema
- **Entity resolution:** name is free text, individual or company, no address beyond city/zip; join tp_id to Comptroller Active Franchise Taxpayers / Sales Tax Permit Holders files for street address and entity type
- **Build effort:** S (<half day)
- **Verified by fetch:** metadata (rowsUpdatedAt, columns, license), sample rows via DD prefix filter, total row count, robots.txt
- **Open questions:** whether tp_id joins cleanly (same id format) to Comptroller taxpayer/franchise files for address enrichment, what share of registrants are individuals vs LLCs
- **Notes:** Sample DD-prefix rows included a solar company ('FRONTLINE SOLAR SOLUTIONS LLC') — prior round flagged excluding solar names, confirmed still present in current data.

#### TX-g1-02 · Dallas Right of Way (ROW) Permits — `build_now`

City of Dallas · https://www.dallasopendata.com/d/bw6g-a3ur

- **Verdict:** Reliable, frequently-refreshed Socrata feed with a genuinely clean work-type category, but zero contact fields and a contractor-name field dominated by large utilities and unrelated firms mean real yield of small in-box subs is a fraction of the 1,400/month raw count.
- **Endpoint:** https://www.dallasopendata.com/resource/bw6g-a3ur.json
- **Access / format / auth:** socrata_api · json (csv/geojson export also available) · none · cost: free
- **Cadence:** dataset rowsUpdatedAt = 2026-09-20T07:07:25Z; newest issuedate in a 3-row sample = 2026-09-18
- **Latency:** several days — createddate to issuedate gap in samples ran 3-15 days, and issuedate to dataset refresh adds more
- **History:** not bounded in this check; total row count (63,657) implies multi-year history
- **Incremental pull:** yes; $order=issuedate DESC or createddate DESC
- **Volume:** not remeasured this session; prior round measured ~1,400/month over a 90-day window naming 457 distinct contractor strings
- **Total records:** 63,657 (Points dataset only; a companion Lines dataset xd3q-ipis exists and was not independently queried)
- **Record names:** applicant/contractor named on a ROW permit — mixed subject: confirmed sample includes large utilities (ONCOR), and unrelated installers (a comms-kiosk installer), not just small site-work subs
- **Company fields:** applicantcompanynamestored, allcontractorsname
- **Identity keys:** externalfilenum, caseid, jobid
- **Contact fill:** 0% — no phone/email field in schema; applicantnamestored is a person's name, not a contact channel
- **Equipment:** indirect — workdescription/rowimprovementrepair text implies excavation/paving/utility equipment, no explicit equipment field
- **Event fields:** issuedate, createddate, rowrequestedstartdate, rowestimatedcompletiondate, rowreasonforjob, rowimprovementrepair, workdescription, specificlocation/locationnames
- **Industry filter:** rowimprovementrepair is a clean categorical field (Drive Approach, Water, Wastewater, Gas, Electric, Paving, Sidewalk, Other)
- **Size signal:** none direct; permit count per contractor name is a rough proxy but requires name normalization first
- **Rate limits:** Socrata default; not hit
- **Terms / restrictions:** license field is null in Socrata metadata (no explicit license text found). robots.txt is the standard Socrata boilerplate, disallowing only browse/search UI paths, not the /resource/ API. No commercial-solicitation restriction found.
- **Fragility:** medium — allcontractorsname/applicantcompanynamestored are dirty free text; large primes (per prior round: Primoris, Driver Pipeline) and unrelated installers dominate volume, requiring heavy filtering to isolate small in-box subs; a separate, unreconciled Lines dataset exists for the same permits
- **Entity resolution:** contractor name is free text with no unique id; same firm can appear under multiple name spellings; no contractor address, only job-site location
- **Build effort:** M (1-2 days)
- **Verified by fetch:** metadata (rowsUpdatedAt, columns, license), sample rows ordered by issuedate, total row count, robots.txt
- **Open questions:** how the companion Lines dataset (xd3q-ipis) overlaps or differs from Points, true share of permits naming a small in-box firm after excluding primes/large utilities, earliest history date
- **Notes:** One sampled row's 'contractor' was a kiosk installer for a media/comms company — a reminder that allcontractorsname/applicantcompanynamestored need real filtering, not just presence.

#### TX-g1-03 · TCEQ Aggregate Production Operations — `build_now`

Texas Commission on Environmental Quality · https://data.texas.gov/d/9ixa-7k3m

- **Verdict:** Small volume but 100% pre-filtered to the aggregates trade, has a real equipment-scale proxy (area_disturbed), and its CN/RN keys are the natural join anchor to other TCEQ feeds — high signal-to-effort ratio despite low count.
- **Endpoint:** https://data.texas.gov/resource/9ixa-7k3m.json
- **Access / format / auth:** socrata_api · json (csv export also available) · none · cost: free
- **Cadence:** daily; rowsUpdatedAt = 2026-09-24T13:03:20Z; newest registration_start_date in sample = 2026-09-18, newest last_application_status_date = 2026-09-23
- **Latency:** roughly 1-5 days between registration_start_date and status update visible in the API
- **History:** not fully bounded; table appears to hold current/active registrations (small total), not a long deep archive
- **Incremental pull:** yes; $order=registration_start_date DESC or last_application_status_date DESC
- **Volume:** not remeasured this session; prior round measured ~10/month (31 in a 90-day window, 133 in 12 months) — consistent with the small total table size observed
- **Total records:** 1,083 (measured)
- **Record names:** aggregate mine/pit operator — direct company/individual registrant (customer_name/organization_name), a good match to the equipment buyer
- **Company fields:** customer_name, organization_name, site_name, mailing_address, city, zip, county
- **Identity keys:** registration (AP#), customer_number (CN), regulated_number (RN)
- **Contact fill:** 0% — no phone/email field
- **Equipment:** direct — new pit/quarry registration implies loaders, excavators, crushers, haul trucks; material_type and area_disturbed give a rough scale proxy
- **Event fields:** registration_start_date, last_application_type, last_applicaiton_status, last_application_status_date, current_expiration_date
- **Industry filter:** entire dataset is pre-filtered to aggregates/mining by definition — no additional filter needed
- **Size signal:** area_disturbed (acres) is a usable proxy for operation scale
- **Rate limits:** Socrata default; not hit
- **Terms / restrictions:** not independently re-confirmed for this specific dataset beyond the portal-wide pattern (no license text shown, robots.txt disallows only UI browse paths); no restriction found
- **Fragility:** low — small, stable, clean Socrata table with geocoding
- **Entity resolution:** customer_name is sometimes an individual, sometimes an LLC; CN/RN (customer_number/regulated_number) are TCEQ-wide keys shared across other TCEQ Central Registry datasets (SLUDGE, AIRNSR, STORM, OSSF), making this dataset a good join anchor
- **Build effort:** S (<half day)
- **Verified by fetch:** metadata (rowsUpdatedAt, columns), sample rows ordered by registration_start_date, total row count
- **Open questions:** whether the 1,083-row table is ACTIVE-only (undercounting lapsed/expired/pending registrations)
- **Notes:** CN format (e.g. 'CN606563526') matches the CN/RN keys seen in SLUDGE and AIRNSR Central Registry rows — confirmed usable as a cross-TCEQ-dataset join key.

#### TX-g1-04 · TCEQ Central Registry regional files: OSSF Installer and Maintenance Provider licenses (OSSFOL) — `enrichment_only`

Texas Commission on Environmental Quality · https://data.texas.gov/d/tzyg-j7q4

- **Verdict:** Real intent signal, but the row names a person with zero address/contact fields and no in-API path to the business entity — better used to enrich/confirm a lead sourced elsewhere than as a standalone daily feed.
- **Endpoint:** https://data.texas.gov/resource/tzyg-j7q4.json?$where=program_code='OSSFOL' (repeat across all 5 regional dataset ids: tzyg-j7q4 Coastal&East TX, t34q-qzi3 DFW, msah-s2rv Central TX, 5eqq-7nad North TX, 9iad-hrn8 Border&Permian — confirmed all 5 exist with identical schema)
- **Access / format / auth:** socrata_api · json (csv export also available) · none · cost: free
- **Cadence:** daily; rowsUpdatedAt = 2026-09-24T13:41:15Z; sample status_dt values up to 2026-09-15
- **Latency:** roughly 5-9 days observed (status_dt 09-15 still recent 09-24)
- **History:** not bounded; OSSFOL total in this one region alone is 13,269 rows
- **Incremental pull:** yes but noisy — status_dt moves on renewals too, so additional_id_status='PENDING' plus a high license number is the real new-entrant signal, not a plain date filter
- **Volume:** not remeasured statewide this session; prior round's ~35/month (PENDING) estimate not independently re-verified across all 5 files
- **Total records:** 13,269 in the Coastal & East TX file alone for program_code='OSSFOL'; statewide total (sum of 5 files) not computed this session
- **Record names:** CONFIRMED an individual license holder, not the business (e.g. 'GOLDSBERRY, AARON GLEAN', 'ANDRADE, FREDD ANDREW') — the business name is not in this record and must be resolved externally
- **Identity keys:** ref_num_txt (RN), ref_num_txt_1 (CN), additional_id_text (OS/MT license #)
- **Contact fill:** 0%
- **Equipment:** indirect — a new septic installer/maintenance license implies need for an excavator/backhoe/pump or vac truck
- **Event fields:** status_dt, affil_begin_dt (unreliable, see fragility), additional_id_status (PENDING/ACTIVE)
- **Industry filter:** program_code='OSSFOL' cleanly pre-filters to septic install/maintenance licensing
- **Size signal:** none
- **Rate limits:** Socrata default; not hit
- **Terms / restrictions:** no restriction found beyond the portal-wide pattern (no explicit license text on this endpoint, robots.txt only disallows UI browse paths)
- **Fragility:** medium-high — record names a person not a business (needs a second external lookup); affil_begin_dt/status_dt contain sentinel values (1800-01-01, 3000-12-31) requiring careful date handling; the dataset is split across 5 region-specific endpoints with identical schema that must all be queried and unioned
- **Entity resolution:** license is personal; joining to the actual business requires an external lookup (TOWA map directory https://mapsearch.txowa.org/ or the TCEQ Occupational Licensing search), which is not available via this API
- **Build effort:** M (1-2 days, mainly for the 5-file union plus the external person-to-business join)
- **Verified by fetch:** metadata (rowsUpdatedAt, columns), program_code distribution (confirmed OSSFOL, SLUDGE, AIRNSR, STORM, APO all present), sample rows for one region
- **Open questions:** whether TOWA map search or TCEQ Occupational Licensing search can be automated for the business-name join, or requires manual/records-request lookup
- **Notes:** Confirmed the same schema and program_code list is live across all 5 regional Central Registry endpoints; a pipeline must union all 5 for statewide coverage.

#### TX-g1-05 · TCEQ Central Registry regional files: Sludge Transporter registrations (SLUDGE) — `build_now`

Texas Commission on Environmental Quality · https://data.texas.gov/d/tzyg-j7q4

- **Verdict:** Company-level rows with a real street address and a clean NAICS filter — the best-structured of the three Central Registry programs tested — still needs the 5-region union but no separate business-name lookup.
- **Endpoint:** https://data.texas.gov/resource/tzyg-j7q4.json?$where=program_code='SLUDGE' (repeat across all 5 regional dataset ids)
- **Access / format / auth:** socrata_api · json (csv export also available) · none · cost: free
- **Cadence:** daily; sample rows show status_dt up to 2026-09-22, affil_begin_dt up to 2026-09-16
- **Latency:** roughly 2-6 days (affil_begin_dt 09-16 -> status_dt 09-22)
- **History:** not bounded this session
- **Incremental pull:** yes via affil_begin_dt/status_dt, with same renewal-vs-new caveat as OSSFOL though dates in the sample looked more sane
- **Volume:** not remeasured statewide this session; prior round's ~23/month estimate not independently re-verified across all 5 files
- **Total records:** 6,430 SLUDGE rows in the Coastal & East TX file alone; statewide total not computed
- **Record names:** CONFIRMED a company (e.g. 'HTX PORTABLE TOILETS LLC', 'GREASE TECHNOLOGIES'/'BENEVENTO VENTURES LLC') — a good direct match to the equipment buyer, unlike OSSFOL
- **Company fields:** reg_ent_name, princ_name, princ_legal_name, re_phys_loc_addr_line_1/city/state/zip (real street address)
- **Identity keys:** ref_num_txt (RN), ref_num_txt_1 (CN), additional_id_text (sludge registration #)
- **Contact fill:** 0%
- **Equipment:** direct-ish — registration is required to legally haul septage/grease-trap/portable-toilet waste, so a new registration means a new vac/pump truck operator
- **Event fields:** affil_begin_dt, status_dt, additional_id_status
- **Industry filter:** indus_type_cd_name is a real NAICS-coded field (confirmed '562991 - Septic Tank and Related Services') — clean and reliable
- **Size signal:** none direct
- **Rate limits:** Socrata default; not hit
- **Terms / restrictions:** no restriction found beyond the portal-wide pattern
- **Fragility:** medium — same 5-region-file union requirement as OSSFOL, but company-level rows with real addresses and a clean NAICS field make this a cleaner source overall
- **Entity resolution:** reg_ent_name/princ_legal_name are company names directly; CN/RN keys are shared across TCEQ datasets for joining
- **Build effort:** M (1-2 days, mainly for the 5-file union)
- **Verified by fetch:** metadata, program_code distribution, sample rows for one region
- **Open questions:** true statewide new-registrant count per month across all 5 files
- **Notes:** Prior round's claim that registration numbers starting with '7' are land-application sites (not haulers) was not independently re-verified in this session's 10-minute budget — treat as inferred from Round 1, not confirmed by this fetch.

#### TX-g1-06 · TCEQ Central Registry regional files: construction stormwater (TXR15) NOIs — `build_later`

Texas Commission on Environmental Quality · https://data.texas.gov/d/t34q-qzi3

- **Verdict:** Real intent signal at real volume, but the field mapping the prior round assumed (a clean program_code + date field) is not what the API actually returns — TXR15 requires a compound filter and the date fields need real data-cleaning before 'new' can be trusted, making this more engineering than the other Tier-A sources for a comparable payoff.
- **Endpoint:** https://data.texas.gov/resource/t34q-qzi3.json?$where=program_code='STORM' AND starts_with(additional_id_text,'TXR15') (repeat across all 5 regional dataset ids)
- **Access / format / auth:** socrata_api · json (csv export also available) · none · cost: free
- **Cadence:** daily; rowsUpdatedAt = 2026-09-24T13:19:56Z
- **Latency:** not reliably measurable — status_dt is frequently a sentinel value (3000-12-31); affil_begin_dt also carries sentinels (1800-01-01) but a bounded range query worked
- **History:** not bounded; whole DFW file has 669,563 rows across all programs
- **Incremental pull:** yes, but requires a bounded affil_begin_dt range (e.g. last 30 days) rather than a plain DESC sort, because unbounded sorts surface sentinel/junk dates first
- **Volume:** measured 255 TXR15 rows with affil_begin_dt in the last 30 days in the DFW file alone — notably higher than the prior round's ~980/month statewide estimate would imply for one of five regions; not reconciled
- **Total records:** TXR15-prefixed rows were ~54% (1,072 of 2,000) of a STORM-program sample in the DFW file; full-file TXR15 count not queried this session
- **Record names:** site/project name and principal (operator); many principals are developers or general contractors, not the small site-work sub actually doing the digging
- **Company fields:** reg_ent_name (site/project name), princ_name, princ_legal_name
- **Identity keys:** ref_num_txt (RN), ref_num_txt_1 (CN), additional_id_text (TXR15 permit id)
- **Contact fill:** 0%
- **Equipment:** indirect — new construction stormwater NOI implies excavators/skid steers/dump trucks/trenchers at a site starting work
- **Event fields:** affil_begin_dt, status_dt (frequently unreliable), additional_id_status
- **Industry filter:** reg_ent_desc_txt/indus_typ_name_1 gives a real free-text description (e.g. 'PAVING AND UNDERGROUND UTILITIES', 'HIGHWAY AND STREET CONSTRUCTION', 'LAND SUBDIVIDERS AND DEVELOPERS') useful for filtering
- **Size signal:** none
- **Rate limits:** Socrata default; not hit
- **Terms / restrictions:** no restriction found beyond the portal-wide pattern
- **Fragility:** high — three concrete issues confirmed by fetch: (1) TXR15 is not its own program_code, it's a prefix inside additional_id_text within program_code='STORM' alongside industrial stormwater (TXR05/TXRNE), so the compound filter must be exact; (2) status_dt is frequently a sentinel (3000-12-31) and affil_begin_dt has its own sentinel/bad values (1800-01-01, and per prior round, future years like 2121/2029), making 'new' hard to define reliably; (3) same 5-region file union requirement as the other Central Registry programs
- **Entity resolution:** site address is the job site, not the operator's office; CN/RN keys usable for cross-TCEQ joins but the principal is often a developer/GC layer above the actual sub
- **Build effort:** L (3+ days) — compound filter, sentinel-date cleaning, and 5-file union together
- **Verified by fetch:** metadata, STORM additional_id_text prefix distribution (confirmed TXR15/TXR05/TXRNE split), sample rows, 30-day bounded count
- **Open questions:** true statewide TXR15/month total across all 5 regions, whether bounding affil_begin_dt to a recent window silently drops real new registrations that happen to carry a sentinel date
- **Notes:** This corrects the prior round's implicit assumption that TXR15 was a clean, directly filterable field — it is not; it is a substring match inside a shared program_code.

#### TX-g1-07 · TCEQ Central Registry regional files: new air authorizations (AIRNSR) — `build_later`

Texas Commission on Environmental Quality · https://data.texas.gov/d/tzyg-j7q4

- **Verdict:** A real new-facility signal exists, but the confirmed sample is dominated by oil & gas well authorizations irrelevant to target trades, and site addresses are often narrative directions rather than usable location data — needs a materially tighter industry filter before it returns a useful ratio of in-box records.
- **Endpoint:** https://data.texas.gov/resource/tzyg-j7q4.json?$where=program_code='AIRNSR' (repeat across all 5 regional dataset ids)
- **Access / format / auth:** socrata_api · json (csv export also available) · none · cost: free
- **Cadence:** daily; sample rows include affil_begin_dt/status_dt up to 2026-09-23
- **Latency:** ~1 day observed in sample, but see fragility note on date reliability
- **History:** not bounded this session
- **Incremental pull:** yes via affil_begin_dt, same sentinel-date caveat as the STORM program
- **Volume:** not remeasured this session; prior round's ~480/month estimate not independently re-verified
- **Total records:** 344,019 AIRNSR rows in the Coastal & East TX file alone (this is the largest program_code in that file); statewide total not computed
- **Record names:** regulated entity/principal — confirmed direct company names, but the sample was dominated by large corporates and oil & gas operators (e.g. 'GULF NEXUS I LLC' power plant, 'BURLINGTON RESOURCES OIL & GAS COMPANY LP' well sites)
- **Company fields:** reg_ent_name, princ_name, princ_legal_name, indus_type_cd_name
- **Identity keys:** ref_num_txt (RN), ref_num_txt_1 (CN), additional_id_text (permit/project #)
- **Contact fill:** 0%
- **Equipment:** indirect — new air authorization can imply a batch plant/compressor/generator, but 2 of 3 sampled rows were oil & gas well-site authorizations with no equipment-finance relevance
- **Event fields:** affil_begin_dt, status_dt, additional_id_status (PENDING)
- **Industry filter:** indus_type_cd_name gives a usable NAICS-like field to filter to ready-mix/fabricated-metal vs. oil & gas
- **Size signal:** none
- **Rate limits:** Socrata default; not hit
- **Terms / restrictions:** no restriction found beyond the portal-wide pattern
- **Fragility:** medium-high — confirmed by direct sample that oil & gas PBR authorizations dominate volume; site 'addresses' are frequently only narrative driving directions (re_phys_loc_desc), not a mailable address; same 5-region union requirement
- **Entity resolution:** CN/RN keys usable for cross-TCEQ joins; princ_legal_name is the cleanest company-name field
- **Build effort:** M (1-2 days)
- **Verified by fetch:** metadata, program_code distribution, sample rows for one region
- **Open questions:** what indus_type_cd_name filter recovers a clean ready-mix/fabrication subset without needing per-row manual review

#### TX-g1-08 · TCEQ Water Quality General Permits: concrete production (TXG11) — `build_now`

Texas Commission on Environmental Quality · https://data.texas.gov/d/6pm5-am5m

- **Verdict:** Statewide single-file feed, clean prefix filter, real company names and mailable addresses, and observed volume matches the prior round's estimate exactly — one of the cleanest sources in the batch.
- **Endpoint:** https://data.texas.gov/resource/6pm5-am5m.json?$where=starts_with(permit_no,'TXG11') (equivalently program_area='WW11'; note: the prior round's 'permit_type' field is NOT the right filter — permit_type only has 3 generic values shared across all permit categories)
- **Access / format / auth:** socrata_api · json (csv export also available) · none · cost: free
- **Cadence:** daily; rowsUpdatedAt = 2026-09-24T14:00:18Z; newest permit_start_dt in sample = 2026-09-22
- **Latency:** ~1-2 days (permit_start_dt 09-22 present 09-24)
- **History:** not bounded this session; permit_start_dt values in the wider dataset go back to at least 2004 (seen in an unfiltered sample)
- **Incremental pull:** yes; $where=starts_with(permit_no,'TXG11') AND permit_start_dt > 'X', $order=permit_start_dt DESC
- **Volume:** measured 66 new in the last 90 days (permit_start_dt > 2026-06-24) = ~22/month — matches the prior round's estimate exactly
- **Total records:** 1,043 (measured, statewide, single dataset — NOT region-split, unlike the Central Registry files)
- **Record names:** company operating the concrete batch plant — confirmed direct company names (e.g. 'WILLIAMS CONCRETE PRODUCTS', 'TEXAS STAR READY MIX LLC', 'SMYRNA READY MIX CONCRETE LLC')
- **Company fields:** principal_name, site_name, physaddr_deliv_txt, physaddr_city_name, physaddr_state_name, physaddr_zip, county_name
- **Identity keys:** cn (customer number), rn (regulated entity number), permit_no
- **Contact fill:** 0%
- **Equipment:** direct — a new TXG11 authorization is a new concrete batch plant (mixers, loaders, silos, mixer trucks)
- **Event fields:** permit_start_dt, permit_status
- **Industry filter:** pre-filtered by the permit_no prefix — effectively 100% relevant to ready-mix/concrete
- **Size signal:** none direct
- **Rate limits:** Socrata default; not hit
- **Terms / restrictions:** no restriction found beyond the portal-wide pattern
- **Fragility:** low — single statewide dataset (not region-split), clean prefix filter, and permit_start_dt values in the sample looked sane (unlike Central Registry's status_dt sentinel problem)
- **Entity resolution:** cn/rn keys are shared with TCEQ APO/AIRNSR/SLUDGE Central Registry datasets — same cross-source join key
- **Build effort:** S (<half day)
- **Verified by fetch:** metadata, permit_no prefix sample, 90-day count, unfiltered raw-row sample to identify the correct filter field
- **Notes:** Prior round's field description ('permit_type') was imprecise — permit_type only takes 3 generic values ('GENERAL PERMIT AUTHORIZATION'/'NO EXPOSURE'/'WAIVER') shared by every permit category in this dataset; the actual category filter is the permit_no prefix or program_area.

#### TX-g1-09 · TCEQ Water Quality General Permits: industrial stormwater (TXR05/TXRNE) — `build_later`

Texas Commission on Environmental Quality · https://data.texas.gov/d/6pm5-am5m

- **Verdict:** Confirmed by direct sample that this feed is dominated by 'no exposure' certifications from irrelevant industries, and it carries no NAICS field to filter by trade — usable only after adding a permit_type exclusion and pairing with an external industry lookup, more work than the payoff of a same-tier source like TXG11.
- **Endpoint:** https://data.texas.gov/resource/6pm5-am5m.json?$where=program_area='SWD' (equivalently starts_with(permit_no,'TXR05') OR starts_with(permit_no,'TXRNE'))
- **Access / format / auth:** socrata_api · json (csv export also available) · none · cost: free
- **Cadence:** daily; rowsUpdatedAt = 2026-09-24T14:00:18Z; sample permit_start_dt up to 2026-09-24
- **Latency:** ~0-1 days in sample
- **History:** not bounded this session
- **Incremental pull:** yes; $where=program_area='SWD' AND permit_start_dt > 'X'
- **Volume:** measured 266 new in the last 30 days (permit_start_dt > 2026-08-24) — notably higher than the prior round's ~137/month estimate; discrepancy not reconciled, possibly a shorter/different window or a permit_type-inclusive count
- **Total records:** 13,407 rows with program_area='SWD' (this is a shared dataset with TXG11/g1-08, statewide, single file)
- **Record names:** facility operator — confirmed company/organization names, but the sample was dominated by clearly irrelevant large corporates with no equipment-finance relevance (Thomas Reprographics, FedEx, BAE Systems)
- **Company fields:** principal_name, site_name, physaddr_deliv_txt/city/state/zip (real address)
- **Identity keys:** cn, rn, permit_no
- **Contact fill:** 0%
- **Equipment:** indirect and diluted — all 3 sampled rows were 'GENERAL PERMIT NO EXPOSURE' certifications, i.e. the facility is explicitly certifying it has NO significant industrial exposure, which likely correlates with lower equipment-buying relevance, not higher
- **Event fields:** permit_start_dt, permit_status, permit_type
- **Industry filter:** none built in — no NAICS/industry-name field in this dataset (unlike the Central Registry files); permit_type at least distinguishes 'GENERAL PERMIT AUTHORIZATION' from 'GENERAL PERMIT NO EXPOSURE'/'WAIVER'
- **Size signal:** none
- **Rate limits:** Socrata default; not hit
- **Terms / restrictions:** no restriction found beyond the portal-wide pattern
- **Fragility:** medium — confirmed directly that a plain program_area='SWD' pull is high-noise (3/3 sampled rows irrelevant to target trades); needs a permit_type exclusion of 'NO EXPOSURE'/'WAIVER' rows, and even then has no industry field to filter by trade
- **Entity resolution:** shares the 6pm5-am5m dataset with TXG11 (g1-08); same cn/rn join keys
- **Build effort:** M (1-2 days)
- **Verified by fetch:** metadata, program_area distribution, sample rows, 30-day bounded count
- **Open questions:** whether restricting to permit_type='GENERAL PERMIT AUTHORIZATION' (excluding NO EXPOSURE/WAIVER) recovers a materially cleaner, smaller, more relevant subset, reason for the volume mismatch vs. the prior round's ~137/month estimate

#### TX-g2-01 · TDLR Tow Truck Companies and Vehicle Storage Facilities files — `build_now`

Texas Department of Licensing and Regulation · https://www.tdlr.texas.gov/LicenseSearch/licfile.asp

- **Verdict:** Clean direct file, high phone fill, exact match to towing buy-box vertical; only issue is the robots.txt disallow, which is a policy call not a technical blocker.
- **Endpoint:** https://www.tdlr.texas.gov/dbproduction2/TowCompanies.csv ; https://www.tdlr.texas.gov/dbproduction2/VSFs.csv
- **Access / format / auth:** bulk_file · csv · none · cost: free
- **Cadence:** file regenerated daily; evidence: link title attribute read "file last update: 9/24/2026 6:15:09 AM" (TowCompanies) and 6:15:xx AM (VSFs) at time of fetch, same calendar day as fetch
- **Latency:** no issue-date field in the file, so unknown at the record level; file itself refreshes same-day
- **History:** current active/snapshot roster only, no historical or issue-date field
- **Incremental pull:** no; full file only, no date field to filter on. Must snapshot-diff by CERTIFICATE_NUMBER day over day to detect new certificates or VEH_COUNT changes
- **Volume:** not measured (no date field); would require running the daily-diff for a month
- **Total records:** 3,789 Tow Company rows and 1,935 VSF rows, counted directly from the downloaded CSVs
- **Record names:** the tow company or vehicle storage facility itself — this is the equipment operator, a direct match
- **Company fields:** CUSTOMER_NAME, CUSTOMER_DBA_NAME, MAIL_ADDR_LINE1/2, MAIL_CITY/STATE/ZIP, SITE_ADDR1/2, SITE_CITY/COUNTY/STATE/ZIP
- **Identity keys:** CERTIFICATE_NUMBER
- **Contact:** PHONE
- **Contact fill:** phone 97.2% (3,683/3,789), measured directly on the full TowCompanies file
- **Equipment:** indirect — VEH_COUNT is current fleet size (100% filled), not a purchase or acquisition event; useful for sizing, not timing
- **Event fields:** EFFECTIVE_DATE (insurance policy effective date), CANCEL_EFF_DATE
- **Industry filter:** CERTIFICATE_TYPE is a clean two-value field ("Tow Company" vs "Vehicle Storage Facilities"); no further sub-trade granularity
- **Size signal:** VEH_COUNT (fleet vehicle count), 100% filled
- **Rate limits:** none observed on the CSV fetch itself
- **Terms / restrictions:** tdlr.texas.gov/robots.txt explicitly disallows crawling any .csv path ("Disallow: /*.csv"), which covers this exact endpoint — a scraper following robots.txt would be blocked from it even though the file has no auth wall. Did not find a statutory commercial-solicitation restriction on this data in the time budget; open question.
- **Fragility:** low-medium: static direct-download CSV path with a stable filename, but robots.txt disallow means an automated daily pull needs an explicit policy decision to ignore robots (most scraping libraries honor it by default) and a custom User-Agent
- **Entity resolution:** CERTIFICATE_NUMBER is the stable join key; CUSTOMER_DBA_NAME is present for matching against other sources when legal name differs from trade name
- **Build effort:** S (<half day): direct CSV, but daily diff logic needed for incrementality
- **Verified by fetch:** record counts, phone fill rate, VEH_COUNT fill rate, file URL and freshness timestamp, robots.txt disallow of /*.csv, field list
- **Open questions:** Does TDLR's robots.txt disallow reflect any actual ToS/legal restriction on commercial use, or is it purely a crawl-budget signal? Not resolved in this pass., Is there a way to get an issue/change date (e.g. a separate audit log) to avoid full-file diffing?
- **Notes:** Prior round's URL (licfile.asp) is just the HTML index page listing dozens of TDLR program files; the actual tow/VSF data lives at the dbproduction2/*.csv paths found by scanning that page's links.

#### TX-g2-02 · TSBPE Responsible Master Plumber licensee list (daily CSV) — `build_now`

Texas State Board of Plumbing Examiners · https://tsbpe.texas.gov/free-licensee-list/

- **Verdict:** Confirmed working direct CSV with clean company and phone fields; phone fill (51%) is materially lower than the prior round's implied ~good coverage, worth noting for outreach yield expectations.
- **Endpoint:** https://tsbpe.texas.gov/download-csv/RMP/
- **Access / format / auth:** bulk_file · csv · none · cost: free
- **Cadence:** generated on each request (server Last-Modified header equaled the exact request timestamp), effectively real-time/daily; content-type text/csv, filename RMP.csv
- **Latency:** same day to next business day, per prior round's note; not independently re-verified beyond confirming freshness of the pull itself
- **History:** current licensee roster only (oldest LICENSE_DATE seen: 1901, i.e. no real floor, but this is a live-roster file not an event log)
- **Incremental pull:** no dedicated new-license endpoint; use LICENSE_DATE to select recent issues, but must diff daily snapshots since a company's LICENSE_DATE may reflect the person's original license, not a company change
- **Volume:** not remeasured this pass; prior round measured 29-63/month from LICENSE_DATE in 2026, consistent with row count order of magnitude
- **Total records:** 9,375 RMP rows, counted directly from the downloaded CSV
- **Record names:** the Responsible Master Plumber individual, with an associated PLUMB_COMPANY field — mostly matches the plumbing company but is technically a person-license record, not a business-entity record
- **Company fields:** PLUMB_COMPANY
- **Identity keys:** LICENSE_NBR
- **Contact:** PHONE, ADDR1/2/3, CITY, STATE, ZIP
- **Contact fill:** phone 50.8% (4,764/9,375), company name 99.9% (9,365/9,375), measured directly on the full CSV
- **Equipment:** none direct; indirect via endorsements (MEDGAS_ENDR, MRF_ENDR, WS_ENDR) which flag specialty scope but not equipment
- **Event fields:** LICENSE_DATE, EXPIRATION_DTE, INS_EXPIRY_DTE
- **Industry filter:** entire file is plumbing by definition; endorsement flags (medical gas, multipurpose residential fire sprinkler, water supply) allow sub-trade filtering
- **Size signal:** none
- **Rate limits:** none observed
- **Terms / restrictions:** tsbpe.texas.gov/robots.txt only disallows /wp-admin/, no restriction on the CSV path; no stated commercial-solicitation restriction found in the time budget
- **Fragility:** low: stable direct URL, standard CSV, latin-1 encoded
- **Entity resolution:** LICENSE_NBR is the join key; PLUMB_COMPANY is free text and will need normalization to match against SOS/comptroller company names
- **Build effort:** S (<half day)
- **Verified by fetch:** row count, phone fill rate, company fill rate, response headers/freshness, robots.txt, direct file URL
- **Open questions:** Phone fill is only ~51%, not confirmed against the prior round's assumption; worth checking if a paid/account tier of TSBPE data has better contact fill., Sunset-legislation move to TDLR flagged in round 1 not independently checked.

#### TX-g2-03 · TxDOT Bid Tabulations (low bidders) — `build_now`

TxDOT via data.texas.gov (Socrata) · https://data.texas.gov/d/de7b-7dna

- **Verdict:** Confirmed live, well-updated, correctly-accessible Socrata dataset, but two of the prior round's stated facts needed correction (field name, and the NULL-first sort trap) — those must be fixed before a production diff/incremental job is trustworthy.
- **Endpoint:** https://data.texas.gov/resource/de7b-7dna.json
- **Access / format / auth:** socrata_api · json (csv also available via .csv extension) · none required for read; app token recommended for higher throughput, not tested · cost: free
- **Cadence:** rowsUpdatedAt epoch 1790199531 (~2026-09-24), and newest project_actual_let_date returned was 2026-09-23 — consistent with same-day/next-day update
- **Latency:** same day to 1 day after letting, confirmed by newest record date vs fetch date
- **History:** dataset description states it includes only the previous 24 months
- **Incremental pull:** yes, via project_actual_let_date with $order and $where; caution — default Socrata sort puts NULL dates first even on DESC, so a plain $order=...DESC without a $where date IS NOT NULL filter returns garbage
- **Volume:** prior round's ~96 low-bidder firms/month not independently re-verified this pass
- **Total records:** not counted (no $select=count(*) run this pass); dataset is bid-line-item level, many rows per letting per bidder
- **Record names:** the bidding vendor (vendor_name) — direct match when low_bidder_flag=true, but the row is a bid-item line, not a company profile
- **Company fields:** vendor_name
- **Contact fill:** 0% — confirmed no phone/email field exists in this dataset at all
- **Equipment:** none direct in this table; equipment_signal comes from bid_item_description / short_description text (e.g. mowing, sealing, striping) which the querying engineer must classify
- **Event fields:** project_actual_let_date, bid_total_amount, project_type, project_classification, county, highway
- **Industry filter:** project_classification (Maintenance vs Construction) and free-text short_description/specification_description; no NAICS or trade code
- **Size signal:** bid_total_amount is a rough deal-size proxy
- **Rate limits:** not tested; Socrata default anonymous throttle applies (typically ~1000 req/rolling window without a token)
- **Terms / restrictions:** Texas open-data robots.txt (data.texas.gov) only restricts crawling of browse/search UI paths, not the /resource/ API; dataset description states results are informational, not an award confirmation — a usage caveat, not a solicitation restriction
- **Fragility:** low for the API itself; medium for the pipeline logic because (a) the date field name differs from the prior round's assumed "letting_date" (actual field is project_actual_let_date) and (b) NULL-date sort ordering bug will silently corrupt a naive "get newest" query
- **Entity resolution:** vendor_name is free text with no ID; must fuzzy-match against TxDOT Vendor List (TX-g2-04) vendor_name to recover phone/email, or against SOS filings
- **Build effort:** S-M: straightforward Socrata pull, but the NULL-sort gotcha and free-text vendor-name join add non-trivial entity-resolution work
- **Verified by fetch:** dataset metadata (rowsUpdatedAt), corrected date field name, sample records, absence of contact fields, NULL-sort behavior
- **Open questions:** Total record count and true monthly low-bidder volume not reverified this pass., Rate limit behavior without an app token not tested.
- **Notes:** IMPORTANT CORRECTION: the field is project_actual_let_date, not letting_date as implied by prior round's usage in $order. Querying $order=letting_date DESC throws a hard Socrata error (no such column); a broken pipeline built on that field name would fail outright, not silently degrade.

#### TX-g2-04 · TxDOT Vendor List (prequalified contractors) — `build_now`

TxDOT via data.texas.gov (Socrata) · https://data.texas.gov/d/dw25-6md2

- **Verdict:** Small, clean, directly fetched dataset that is exactly the enrichment table the bid-tab feed needs for phone/email; confirmed record count matches prior round.
- **Endpoint:** https://data.texas.gov/resource/dw25-6md2.json
- **Access / format / auth:** socrata_api · json (csv also available) · none required for read · cost: free
- **Cadence:** rowsUpdatedAt epoch 1790182833 (~2026-09-24, same day as fetch)
- **Latency:** unknown — no per-row add/change date field found in the column metadata or sample
- **History:** current roster only, no historical/date field
- **Incremental pull:** no add-date field; must snapshot-diff by vendor_id to detect new vendors or contractor_qualified_status changes
- **Volume:** not measured; would require running the diff for a month
- **Total records:** 1,065, confirmed via $select=count(*)
- **Record names:** the prequalified contracting firm itself — direct match
- **Company fields:** vendor_name, mailing/physical address fields
- **Identity keys:** vendor_id
- **Contact:** phone, email (present on some rows), fax (some rows)
- **Contact fill:** phone 3/3 (100%) and email 2/3 (67%) in a 3-row sample — too small to trust as a real rate; needs a larger pull to confirm
- **Equipment:** none
- **Event fields:** contractor_qualified_status (CQ/BQ/MQ)
- **Industry filter:** vendor_type (PRIM etc.) and qualification tier; no trade/NAICS field seen in the sample — industry filtering would rely on joining vendor_name to the bid tabs' project_type/description
- **Size signal:** contractor_qualified_status tier is a rough sophistication proxy (CQ = full confidential questionnaire tier)
- **Rate limits:** not tested
- **Terms / restrictions:** same data.texas.gov Socrata terms as TX-g2-03; no commercial-solicitation restriction found
- **Fragility:** low
- **Entity resolution:** vendor_id is a stable key; vendor_name is the join field back to Bid Tabulations (TX-g2-03), which lacks any ID
- **Build effort:** S
- **Verified by fetch:** record count (1,065), dataset metadata, sample fields including phone/email presence, column list start
- **Open questions:** Contact fill rate needs a real sample (n>>3) to trust., No add-date field confirmed present anywhere in the columns metadata read — worth a full column dump to be sure.

#### TX-g2-05 · Austin Issued Construction Permits — `build_now`

City of Austin (data.austintexas.gov, Socrata) · https://data.austintexas.gov/d/3syk-w9eu

- **Verdict:** Confirmed live, high-volume, well-structured feed with a genuinely useful contractor_trade categorical filter not called out in the prior round; contact fields exist directly on the permit row, which is valuable.
- **Endpoint:** https://data.austintexas.gov/resource/3syk-w9eu.json
- **Access / format / auth:** socrata_api · json (csv also available) · none required for read · cost: free
- **Cadence:** newest issue_date returned by $order=issue_date DESC was 2026-09-23, one day before fetch — confirms ~daily cadence
- **Latency:** ~1 day, confirmed by newest record date
- **History:** not tested; dataset created 2015 per metadata createdAt, implying multi-year history is available
- **Incremental pull:** yes, via issue_date; also has issued_in_last_30_days convenience flag
- **Volume:** 5,128/month measured directly (trailing 30 days); close to prior round's ~5,180 estimate
- **Total records:** 5,128 permits issued in the trailing 30 days (issue_date > 2026-08-24), confirmed via $select=count(*)
- **Record names:** the permitted contractor (contractor_company_name) and/or applicant — direct trade-contractor match on Mechanical/Plumbing/Electrical/General Contractor permits, though many rows are residential single-family work
- **Company fields:** contractor_company_name, applicant_org
- **Contact:** contractor_phone, applicant_phone, contractor_full_name, applicant_full_name
- **Contact fill:** not formally sampled; 2 of 3 sample rows had contractor_phone populated, 1 had it blank on the fields shown (small sample, not a real rate)
- **Equipment:** indirect via free-text description field only
- **Event fields:** permit_type_desc, work_class, issue_date, total_valuation_remodel / building_valuation fields, status_current
- **Industry filter:** contractor_trade field (e.g. "Plumbing Contractor", "Mechanical Contractor", "General Contractor") is a clean categorical filter, more useful than permit_class_mapped for trade targeting
- **Size signal:** valuation fields (total_valuation_remodel, building_valuation_remodel etc.)
- **Rate limits:** same Socrata defaults as other data.austintexas.gov datasets; robots.txt only restricts browse/search UI
- **Terms / restrictions:** Dataset description links to the City of Austin Open Data Terms of Use (https://data.austintexas.gov/stories/s/ranj-cccq); not fetched in detail this pass — open question whether it restricts commercial solicitation use
- **Fragility:** low
- **Entity resolution:** no stable contractor ID; contractor_company_name is free text and will need normalization/fuzzy matching against TDLR/state license rolls
- **Build effort:** S
- **Verified by fetch:** dataset metadata, newest issue_date, 30-day volume count, sample records with contractor fields, terms-of-use link presence
- **Open questions:** Have not read the City of Austin Open Data Terms of Use in full for a commercial-solicitation clause., Real contact fill rate not sampled at scale.

#### TX-g2-06 · Comptroller Active Sales Tax Permit Holders (new outlets) — `build_later`

Texas Comptroller of Public Accounts via data.texas.gov (Socrata) · https://data.texas.gov/d/jrea-zgmq

- **Verdict:** Confirmed working and well-structured on NAICS, but zero contact fields and no direct equipment signal keep it firmly enrichment-tier; the NULL-sort bug must be fixed before any "new outlets" pull is trustworthy.
- **Endpoint:** https://data.texas.gov/resource/jrea-zgmq.json
- **Access / format / auth:** socrata_api · json (csv also available) · none required for read · cost: free
- **Cadence:** rowsUpdatedAt epoch 1789805121 (~2026-09-18), several days stale relative to fetch date; newest outlet_permit_issue_date with a $where filter for non-null dates was 2026-09-19
- **Latency:** roughly 5-6 days based on rowsUpdatedAt vs fetch date; contradicts prior round's "weekly, ~1 week" claim only in that the dataset-level refresh itself looked closer to weekly, consistent with prior round
- **History:** outlet_first_sales_date values go back to the 1960s in an unfiltered sample, meaning the file is a full active-roster snapshot, not an event log limited to recent history
- **Incremental pull:** yes, via outlet_permit_issue_date, BUT the field is frequently NULL and Socrata's default DESC sort puts NULLs first — a naive $order=outlet_permit_issue_date DESC without $where outlet_permit_issue_date IS NOT NULL returns 1960s records, not new ones. Confirmed and corrected this pass.
- **Volume:** prior round's ~16,800/month total, ~4,300/month target-NAICS not independently re-verified this pass
- **Total records:** not counted this pass
- **Record names:** the business outlet/location — direct company match, but this is a retail sales-tax registration, several steps removed from an equipment-buying event
- **Company fields:** taxpayer_name, outlet_name, taxpayer_address, outlet_address
- **Identity keys:** taxpayer_number, outlet_number
- **Contact fill:** 0% — confirmed no phone/email field exists in this dataset
- **Equipment:** none direct
- **Event fields:** outlet_permit_issue_date, outlet_first_sales_date
- **Industry filter:** outlet_naics_code, confirmed present and populated in every sampled row — this is the cleanest NAICS field of any source in this batch
- **Size signal:** none
- **Rate limits:** same Socrata defaults
- **Terms / restrictions:** dataset description links to Comptroller privacy policy (comptroller.texas.gov/about/policies/privacy.php); not fetched in detail this pass
- **Fragility:** low for the API; medium for the pipeline logic due to the NULL-sort trap described above
- **Entity resolution:** taxpayer_number is a stable Comptroller ID that could anchor entity resolution across other Comptroller datasets (e.g. ag/timber, TX-g2-07) if they share the same ID space — not confirmed this pass
- **Build effort:** S-M: easy pull, but needs the NULL-filter fix and heavy NAICS filtering to cut noise (prior round flagged ~74% of volume as e-commerce NAICS)
- **Verified by fetch:** column list, corrected sort behavior, sample records with and without NULL filter, absence of contact fields, dataset metadata
- **Open questions:** Whether taxpayer_number links across other Comptroller Socrata datasets for entity resolution., Full Comptroller privacy policy not reviewed for solicitation restrictions.
- **Notes:** Same NULL-first sort issue found in TX-g2-07; both Comptroller datasets need $where <field> IS NOT NULL appended to any "get newest" query or the pipeline will silently pull ancient inactive records instead of new ones.

#### TX-g2-07 · Comptroller Agriculture and Timber Exemption Registrations — `enrichment_only`

Texas Comptroller of Public Accounts via data.texas.gov (Socrata) · https://data.texas.gov/d/4uks-rvt8

- **Verdict:** Confirmed working feed and daily cadence, but zero contact fields, no entity-type flag, and record_subject is frequently not a business — matches prior round's caution, and the corrected NULL-sort behavior means this needs careful querying to even get the right rows.
- **Endpoint:** https://data.texas.gov/resource/4uks-rvt8.json
- **Access / format / auth:** socrata_api · json (csv also available) · none required for read · cost: free
- **Cadence:** rowsUpdatedAt epoch 1790234353 (~2026-09-24, same day); newest permit_issue_date with a non-null filter was 2026-09-23
- **Latency:** ~1 day, confirmed once the NULL-sort issue (see below) is corrected for
- **History:** unfiltered sample showed permit_status INACTIVE records with no visible floor date; active roster with full history mixed in
- **Incremental pull:** yes, via permit_issue_date, but same NULL-first-on-DESC trap as TX-g2-06: a naive query without $where permit_issue_date IS NOT NULL returns unrelated inactive records instead of the newest registrations. Confirmed and corrected this pass.
- **Volume:** prior round's ~1,900/month statewide not independently re-verified this pass
- **Total records:** not counted this pass
- **Record names:** the ag/timber-exemption holder, which the prior round already flagged as often an individual landowner rather than the equipment-buying business itself
- **Company fields:** taxpayer_name (often a personal name, not an entity)
- **Identity keys:** exemption_number
- **Contact fill:** 0% — confirmed no phone/email field exists
- **Equipment:** indirect — the exemption itself is a documented pre-purchase signal for tractors/implements per prior round's reasoning, not a fetchable equipment field
- **Event fields:** permit_issue_date, permit_expiration_date, permit_status
- **Industry filter:** none beyond the fact that the whole dataset is ag/timber; no entity-type or LLC/individual flag confirmed in the columns
- **Size signal:** none
- **Rate limits:** same Socrata defaults
- **Terms / restrictions:** dataset description links to the same Comptroller privacy policy as TX-g2-06; not fetched in detail
- **Fragility:** low for API access; medium for pipeline logic (same NULL-sort trap)
- **Entity resolution:** exemption_number is a stable key; taxpayer_name needs entity-type classification (LLC/corp vs. individual) to be useful for lead scoring, and that classification is not present as a field
- **Build effort:** S-M: easy pull, but low signal density (many individuals/hobbyists) requires extra filtering logic the source itself doesn't support
- **Verified by fetch:** column list, corrected sort behavior, sample records with and without NULL filter, absence of contact fields, dataset metadata
- **Open questions:** No field distinguishes individual/hobby landowners from LLC/business entities — would this be inferable from taxpayer_name pattern matching (e.g. presence of LLC/INC/CO)?
- **Notes:** Same NULL-first sort issue as TX-g2-06 — both Comptroller Socrata datasets need explicit IS NOT NULL date filters.

#### TX-g2-08 · RRC Drilling Permits (W-1) daily and pending files — `build_later`

Railroad Commission of Texas · https://www.rrc.texas.gov/resource-center/research/data-sets-available-for-download/

- **Verdict:** The prior round's access method (bulk_download) does not match what was found: the link resolves to a login-gated MFT web client, not a static file. Combined with the fact that the record subject (operator) is already once-removed from the target borrower (service company), this is not worth building until the actual access mechanism is confirmed, likely by contacting RRC or registering for the portal.
- **Endpoint:** https://mft.rrc.texas.gov/link/5f07cc72-2e79-4df8-ade1-9aeb792e03fc (Drilling Permit Master and Trailer - Daily File); https://mft.rrc.texas.gov/link/0ad92a65-4212-49a1-98a7-d667a55fb497 (Pending Approval file)
- **Access / format / auth:** portal_search · ASCII fixed-width per the linked PDF layout guide; NOT actually confirmed because the download link did not return the file · unknown — likely account/login required · cost: unknown
- **Cadence:** landing page states "Nightly" for the daily file and "Twice Daily, 11:30 am and 5:30 pm" for the pending file; not independently verified against actual file content since the file could not be retrieved
- **Latency:** unknown; landing page implies same-day to next-day
- **History:** unknown
- **Incremental pull:** unknown — could not inspect the file
- **Record names:** the well operator (E&P company), which prior round already correctly flagged as NOT the equipment/service buyer — operators are the ones hiring oilfield service companies, not the target borrower
- **Equipment:** none direct; only useful for geographic/territory targeting of service companies, as prior round noted
- **Terms / restrictions:** not reviewed; blocked before reaching a terms page
- **Fragility:** high: the "bulk_download" link on the RRC page is not a direct file at all. curl on it returns an HTML page titled "RRC Web Client - GoDrive" (a GoAnywhere MFT managed-file-transfer portal) and sets a JSESSIONID session cookie, i.e. this is an interactive web client, not a static file URL. A daily automated pull cannot simply GET this link.
- **Entity resolution:** operator name/number would need joining to a separate operator-to-service-vendor mapping, which does not exist in this dataset; not directly useful for entity resolution to the buy-box target
- **Build effort:** L (3+ days): requires first determining whether the GoAnywhere portal supports a scriptable API, SFTP endpoint, or requires manual/authenticated browser access; this is materially harder than the prior round's "bulk_download" characterization implied
- **Verified by fetch:** landing page structure and all data-set links, HTTP response and title of the mft.rrc.texas.gov download link, confirming it is a GoAnywhere MFT portal page rather than a file
- **Open questions:** Does mft.rrc.texas.gov offer an SFTP or authenticated API path instead of the browser portal? Not determined., Is registration for the RRC public GoAnywhere portal free/self-service, or does it require an account request process?, Is there an older/alternate FTP or direct-file mechanism RRC still supports that wasn't linked from this particular page?
- **Notes:** This is the one source in the batch where the prior round's access-method classification appears to be wrong, not just under-specified. Needs a follow-up investigation focused specifically on the mft.rrc.texas.gov portal before deciding whether to build.

