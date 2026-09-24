---
status: v0.1, ready to run
last_revised: 2026-09-24
owner: Simon
serves: settle whether seven A-tier source feeds that failed from Colombia are geoblocked or actually unreachable, and fold the answer into the source-feed files
tier: internal
run_on: a US server with this repo checked out; takes about 1–2 hours of agent time
---

# Geoblock retest: seven feeds, one US host

## 1. What this settles

On 2026-09-24, seven feed records across five hosts failed from this machine. Its traffic exits in Medellín, Colombia. Two controls passed from the same machine (www.tn.gov and data.texas.gov), so the network itself worked. The question is whether these hosts block foreign IPs, which would make them fine for a pipeline running in the US, or whether something else blocks them from anywhere (bot protection, datacenter-IP blocks, an outage). The answer decides whether Tennessee has usable sources: only 1 of its 8 is build-now today, and its best source on paper is one of the blocked ones.

| Record ids | Host | Failure from Colombia | Baseline |
|---|---|---|---|
| TN-g5-02, TN-g5-03, TN-g5-04 | dataviewers.tdec.tn.gov (Oracle APEX) | HTTP 403, 520-byte body | `data/geoblock-probe-2026-09-24-colombia-baseline.json` |
| TN-g5-05 | data.tn.gov (Tableau CSV export) | connection reset / timeout | same |
| FL-g3-06 | publicrec.hillsclerk.com | TCP connect timeout (DNS resolves) | same |
| FL-g3-01, FL-g3-02 | www2.myfloridalicense.com (DBPR) | Cloudflare managed challenge, 403 | same |

## 2. Prompt to paste into Claude Code on the server

> Read `active/quintel-v2/geoblock-retest.md` and run it end to end: probe, investigate each reachable feed, merge, re-render, update the prose, commit and push. Follow the guardrails in §7. Report the probe table and each record's new verdict when done.

Everything below is written for whoever runs it, agent or human.

## 3. Before you start

1. `cd` to the repo root and run `git pull`. Confirm these files exist:
   - `active/quintel-v2/scripts/probe_geoblocked.py` (connectivity probe, stdlib only)
   - `active/quintel-v2/scripts/render_source_feeds.py` (merge and re-render)
   - `active/quintel-v2/scripts/feed_brief.md` (the investigation method and JSON schema)
   - `active/quintel-v2/data/source-feeds-a-tier-2026-09-24.json` (the JSON of record, 52 records)
2. Check for Python 3.8 or later and `curl`. Nothing else is required.
3. Optional, only used in step 5b: a headless browser. `pip install playwright && playwright install chromium`. If it won't install, skip 5b and say so in the report.
4. Write down whether the server is a datacenter host (AWS, GCP, Hetzner, DigitalOcean and the like) or residential. The probe records the `org`. It matters because some state sites block datacenter ranges, and the production pipeline will run from a datacenter.

## 4. Step 1: probe

```
python3 active/quintel-v2/scripts/probe_geoblocked.py
```

It prints one line per target and writes `active/quintel-v2/data/geoblock-probe-<today>.json`. Read the egress line first: `country` must be `US`. If it isn't, stop and report.

**If either control fails, stop.** The server's network is the problem, not the feeds.

What each result means:

| Probe result | Conclusion to record | Next |
|---|---|---|
| `reachable` | `geoblock_confirmed` (the host blocks foreign IPs; it works from the US) | step 2, full investigation |
| `cloudflare_challenge` | `bot_protection` (not geography) | step 5b headless test, then step 3 |
| `http_403` | `blocked_from_us_too`; note datacenter vs residential | step 5b, then step 3 |
| `tcp_fail` / `http_error` | retry twice, 10 minutes apart. Still failing: `outage_or_network_block` | step 3 |
| `dns_fail` | `host_gone` | search for a replacement URL (§5a), then step 3 |

DBPR has three probe lines (landing page and two CSVs). Judge it on the CSVs.

## 5. Step 2: investigate every reachable feed

For each record whose host is reachable, investigate it by following `active/quintel-v2/scripts/feed_brief.md`. Start from the existing record in the JSON of record (match on `id`), not from a blank one. Keep the `id`, `state` and `name`. Re-verify every field you can, overwrite what you measured, and remove notes that say "not verified this round" once they no longer apply. Keep to about 10 minutes per record.

Add one field to every record you touch, reachable or not:

```json
"retest": {
  "date": "YYYY-MM-DD",
  "egress": "city, region, country, org from the probe",
  "probe_result": "reachable | cloudflare_challenge | http_403 | tcp_fail | http_error | dns_fail",
  "conclusion": "geoblock_confirmed | bot_protection | blocked_from_us_too | outage_or_network_block | host_gone",
  "headless_result": "passed | failed | not_tried",
  "summary": "one sentence: what now works, what still does not, and what the pipeline needs"
}
```

Set `pipeline_verdict` using the brief's rules. A record reachable from the US with good plumbing can move to `build_now`. A record blocked from the US too stays `build_later`, and its `fragility` should name the actual mechanism.

Write every touched record (all seven, whatever the outcome) as one JSON array to:

```
active/quintel-v2/data/geoblock-retest-<today>.json
```

### 5a. Hints per host

- **TDEC DataViewers (TN-g5-02/03/04).** These are Oracle APEX interactive reports. An APEX page URL has the form `f?p=APP:PAGE:SESSION`. Load the page once to get a session id (it appears in the page's links and hidden `p_instance` field), then look for the report's download action. The classic pattern is `f?p=APP:PAGE:SESSION:CSV::::`; newer APEX versions use an "Actions → Download" POST. The prior research round claimed "APEX CSV works from cloud IP", so test that path specifically. Record whether a session-bound download can be scripted with `curl` plus a cookie jar. For TN-g5-03, check whether the permittee is the owner or developer rather than the grading contractor, and whether the contractor is only in NOI PDFs. For TN-g5-04, check whether the driller license number is a field.
- **TN contractor licenses (TN-g5-05).** This is a Tableau Public CSV export. If it downloads, count the rows (the prior round reported 33,987 rows and 29,095 licenses), list the columns, measure email and phone fill on a sample of 200, and check for a license-issue date so new licenses a month can be computed. This is the most valuable record in the set; spend the full time on it. If the `.csv` URL fails but the dashboard loads, look for another view name on the same workbook.
- **Hillsborough Clerk (FL-g3-06).** A directory of daily index files. List the directory, download the most recent file, and report the format, the columns, the document-type codes, and whether notices of commencement (NOC) can be filtered by code. Check whether the contractor is named in the index or only in the recorded image.
- **DBPR (FL-g3-01/02).** If the CSVs download without a challenge, report the row count, the columns (the prior round said column 16 carries license type), and the file sizes. If Cloudflare challenges from the US too, go to 5b.

### 5b. Headless browser test (blocked hosts only)

For each host that still fails, try once with Playwright Chromium, headless, a normal desktop user agent, a 60-second wait. Try the page, then the download. Record `headless_result`. Do not use a paid challenge-solving or proxy service, and do not solve CAPTCHAs. If headless passes, write in `fragility` that the pipeline needs a browser fetch step for this host, and set `build_effort` to at least M.

## 6. Step 3: merge, re-render, update the prose

1. Merge and re-render (this rewrites the JSON of record, the per-source detail file, and the scorecard block in `source-feeds.md`):
   ```
   python3 active/quintel-v2/scripts/render_source_feeds.py --merge active/quintel-v2/data/geoblock-retest-<today>.json
   ```
   The script refuses to write anything if an id doesn't match. Fix the id and rerun.
2. Edit the hand-written sections of `active/quintel-v2/source-feeds.md`. Change only these parts:
   - **Frontmatter:** `status: v0.2`, `last_revised: <today>`.
   - **§2:** the verdict table counts, and the build_later breakdown in its first row, so they match the script's printed counts.
   - **§3:** add a row for any retested record that became `build_now`, in the same format as the other rows.
   - **§4, the first bullet (geoblocking):** replace it with the result. Say which hosts were geoblocked, which are blocked by bot protection, and what that means for where the pipeline runs. Example: "production fetches for these hosts must run from a US host; local development from Colombia cannot reach them."
   - **§5, item 4:** mark it done with a one-line result and the date.
3. In `active/quintel-v2/CLAUDE.md`, update two status cells: the `source-feeds.md` row to `written 09-24; geoblock retest <today>`, and the `geoblock-retest.md` row to `written 09-24; run <today> from <egress city, org>`.

Do not edit any other file.

## 7. Guardrails

- Touch only the seven records in §1. Never change other records in the JSON by hand; the render script rewrites the file, and that's expected.
- No personal contact values in any output. Field names, fill rates and company names are fine.
- Don't sign up, pay, or submit a records request. If a host needs any of these, record it and move on.
- Don't use proxy, residential-IP or CAPTCHA services.
- Keep request rates polite: a few requests per host, no bulk crawling. Download only one file per feed (the latest), and only if it's under 200 MB.
- Label anything you didn't fetch as inferred, per the brief.

## 8. Commit and report

```
git add active/quintel-v2/source-feeds.md active/quintel-v2/CLAUDE.md \
        active/quintel-v2/data/source-feeds-a-tier-2026-09-24.json \
        active/quintel-v2/data/source-feeds-a-tier-2026-09-24.md \
        active/quintel-v2/data/geoblock-probe-*.json \
        active/quintel-v2/data/geoblock-retest-*.json
git commit -m "quintel-v2: geoblock retest of 7 feeds from a US host"
git pull --rebase && git push
```

Stage only these paths. If the rebase conflicts on any of them, stop and report without resolving.

The report back is three parts:
- The probe table: target, result, status.
- Per record: conclusion, headless result, old verdict → new verdict, one-sentence summary.
- Anything that changes the build-first set in `source-feeds.md` §3, especially TN-g5-05.
