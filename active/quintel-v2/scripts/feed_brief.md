# Feed investigation brief

## Context
Quintel is building an outbound pipeline for an equipment-finance lender. Target borrowers are small US businesses: 2–25 employees, 2+ years in business, B/C credit, $40K–250K equipment. Preferred trades include excavation, paving, concrete, cranes, drilling, HVAC, plumbing, septic, portable toilets, hydrovac and pump trucks, water/sewer/utilities, towing, waste and recycling, food processing, packaging, and box and work trucks. Every night a pipeline will pull public data feeds, resolve each record to a company, gate it against the buy box, find a contact, and draft an email.

Your job is to investigate a batch of public data sources **from a data-pipeline engineer's perspective**. The main question: what does it take to ingest this feed reliably every day, and what does each record give us? An earlier research round already judged each source's sales value. Don't redo that. Test the plumbing.

## Method
- For each source, **go to the actual data**. Use curl through Bash, or WebFetch. For Socrata, ArcGIS, CKAN or another API, pull a few records (for example `$limit=5&$order=<date field> DESC`) and read the schema and metadata endpoints (Socrata: `/api/views/<id>.json` gives rowsUpdatedAt and columns). For a bulk file, download it or at least its header or first rows if it's reasonably sized (skip anything over ~200MB and note the size). For HTML/search portals, figure out how records could be pulled (query parameters, pagination, export buttons).
- **Measure; don't copy.** Take cadence from observed timestamps (the newest record's date, the dataset's last-updated time) and volume from counts where you can.
- Look for terms of use, robots.txt, rate limits, and above all **any statutory or stated restriction on using the data for commercial solicitation or marketing**. Some state license and records laws have these. Note exactly what the restriction says and where.
- Keep each source to about 10 minutes of work. If you're blocked (captcha, login, a records request is required), say so and move on.
- Don't paste personal contact values (individual people's emails or phone numbers) into the output. Field names, fill rates and company names are fine.
- Separate what you confirmed by fetching from what you're inferring.

## Output
Write a JSON array to the output path given in your task, one object per source in your batch. (For a retest run, `geoblock-retest.md` gives the output path.) Use these keys, with null when something is unknown; never guess:

```json
{
  "id": "from the batch file",
  "state": "",
  "name": "",
  "publisher": "",
  "landing_url": "",
  "data_endpoint": "the exact API/download URL a pipeline would hit",
  "access_method": "socrata_api | arcgis_api | ckan_api | other_api | bulk_file | html_scrape | pdf | portal_search | records_request | paid",
  "format": "json | csv | xlsx | zip | pdf | html | ...",
  "auth": "none | free_key | account | paid (state cost)",
  "cost": "",
  "update_cadence_observed": "e.g. daily; evidence: rowsUpdatedAt 2026-09-23",
  "last_updated_observed": "date",
  "event_to_publish_latency": "",
  "history_depth": "how far back records go",
  "incremental_pull": "can we query only new/changed records? which field? or full file only",
  "total_records": "",
  "new_records_per_month": "measured or estimated, say which",
  "record_subject": "who the row names: contractor, permittee, property owner, licensee, carrier...; flag if it is NOT the equipment buyer",
  "fields_company": ["name", "dba", "address", "..."],
  "fields_identity_keys": ["state license #", "tax id", "USDOT", "SOS id", "..."],
  "fields_contact": ["phone", "email", "contact person", "..."],
  "contact_fill_rate": "e.g. phone ~90%, email ~40% from a sample of N",
  "fields_equipment": ["equipment type", "count", "..."],
  "equipment_signal": "direct | indirect | none, plus one line on what",
  "fields_event": ["event type", "event date", "value/amount", "job location", "..."],
  "industry_filterability": "which field lets us filter to in-box trades, and how cleanly",
  "size_signal": "any field that proxies company size (fleet count, bond, revenue, license class)",
  "rate_limits": "",
  "terms_and_restrictions": "ToS, robots, and any commercial-solicitation restriction with a citation",
  "fragility": "low | medium | high, plus why (scrape of JS portal, file renamed often, etc.)",
  "entity_resolution_notes": "how to join to other sources; dirty names; multiple rows per firm",
  "build_effort": "S (<half day) | M (1-2 days) | L (3+ days), plus why",
  "pipeline_verdict": "build_now | build_later | enrichment_only | skip",
  "verdict_reason": "one or two sentences",
  "verified_by_fetch": ["which facts above you confirmed directly"],
  "open_questions": [],
  "notes": "anything else worth knowing"
}
```

Use Write or Bash to write the file. Then reply with a short summary: one line per source with its verdict, and any surprises (for example the source is dead, restricted, or much better or worse than the prior description says).
