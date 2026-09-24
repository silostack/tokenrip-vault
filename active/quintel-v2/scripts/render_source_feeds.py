#!/usr/bin/env python3
"""Rebuild the source-feed docs from the JSON of record.

Run from anywhere:
    python3 active/quintel-v2/scripts/render_source_feeds.py                 # re-render only
    python3 active/quintel-v2/scripts/render_source_feeds.py --merge FILE    # replace records by id, then re-render

FILE is a JSON array of records in the feed_brief.md schema. Each record whose `id` matches an
existing record replaces it; unknown ids are an error (nothing is written).

Rewrites:
  data/source-feeds-a-tier-2026-09-24.json   (the JSON of record)
  data/source-feeds-a-tier-2026-09-24.md     (per-source detail, fully regenerated)
  source-feeds.md                            (only the block between the scorecard markers)
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
JSON_PATH = ROOT / 'data' / 'source-feeds-a-tier-2026-09-24.json'
DETAIL_PATH = ROOT / 'data' / 'source-feeds-a-tier-2026-09-24.md'
DOC_PATH = ROOT / 'source-feeds.md'
START, END = '<!-- scorecard:start -->', '<!-- scorecard:end -->'
ORDER = {'build_now': 0, 'build_later': 1, 'enrichment_only': 2, 'skip': 3}

DETAIL_HEAD = """---
status: v0.1
last_revised: {date}
owner: Simon
serves: per-source pipeline detail behind `source-feeds.md`; generated from `source-feeds-a-tier-2026-09-24.json` by `scripts/render_source_feeds.py`. Do not hand-edit; change the JSON and re-render
tier: internal
---

# A-tier source feeds: per-source detail

One block per source, grouped by state. First pass: six agents fetched each feed on 2026-09-24 from a Colombian IP. Records with a `retest` block were re-fetched from a US host (see `geoblock-retest.md`). "Verified by fetch" lists what was confirmed directly; everything else is carried over from the prior research round or inferred.
"""

FIELDS = [
    ('Verdict', 'verdict_reason'), ('Retest', 'retest'), ('Endpoint', 'data_endpoint'),
    ('Access / format / auth', None), ('Cadence', 'update_cadence_observed'),
    ('Latency', 'event_to_publish_latency'), ('History', 'history_depth'),
    ('Incremental pull', 'incremental_pull'), ('Volume', 'new_records_per_month'),
    ('Total records', 'total_records'), ('Record names', 'record_subject'),
    ('Company fields', 'fields_company'), ('Identity keys', 'fields_identity_keys'),
    ('Contact', 'fields_contact'), ('Contact fill', 'contact_fill_rate'),
    ('Equipment', 'equipment_signal'), ('Event fields', 'fields_event'),
    ('Industry filter', 'industry_filterability'), ('Size signal', 'size_signal'),
    ('Rate limits', 'rate_limits'), ('Terms / restrictions', 'terms_and_restrictions'),
    ('Fragility', 'fragility'), ('Entity resolution', 'entity_resolution_notes'),
    ('Build effort', 'build_effort'), ('Verified by fetch', 'verified_by_fetch'),
    ('Open questions', 'open_questions'), ('Notes', 'notes'),
]


def s(v, n=None):
    if v is None:
        return '—'
    if isinstance(v, dict):
        v = '; '.join(f'{k}: {s(x)}' for k, x in v.items())
    if isinstance(v, list):
        v = ', '.join(str(x) for x in v) if v else '—'
    v = str(v).replace('|', '/').replace('\n', ' ')
    if n and len(v) > n:
        v = v[:n].rsplit(' ', 1)[0] + '…'
    return v


def first(v):
    return s(v).split(';')[0].split(' (')[0].split(' —')[0]


def merge(rows, path):
    new = json.loads(pathlib.Path(path).read_text())
    by_id = {r['id']: i for i, r in enumerate(rows)}
    unknown = [r.get('id') for r in new if r.get('id') not in by_id]
    if unknown:
        sys.exit(f'unknown ids in {path}: {unknown}; nothing written')
    for r in new:
        rows[by_id[r['id']]] = r
    print(f'merged {len(new)} records: {[r["id"] for r in new]}')
    return rows


def scorecard(rows):
    t = ['| Verdict | ID | Source | Access | Cadence | Incremental | Contact | Equipment | Effort |',
         '|---|---|---|---|---|---|---|---|---|']
    for r in sorted(rows, key=lambda r: (ORDER.get(r.get('pipeline_verdict'), 9), r['state'], r['id'])):
        t.append('| {} | {} | {} | {} | {} | {} | {} | {} | {} |'.format(
            s(r.get('pipeline_verdict')) + (' (retested)' if r.get('retest') else ''),
            r['id'], s(r.get('name'), 60), s(r.get('access_method')),
            first(r.get('update_cadence_observed'))[:30], s(r.get('incremental_pull'), 45),
            s(r.get('contact_fill_rate') or r.get('fields_contact'), 45),
            first(r.get('equipment_signal'))[:12], first(r.get('build_effort'))[:3]))
    return '\n'.join(t)


def detail(rows, date):
    d = [DETAIL_HEAD.format(date=date)]
    cur = None
    for r in sorted(rows, key=lambda r: (r['state'], r['id'])):
        if r['state'] != cur:
            cur = r['state']
            d.append(f'\n### {cur}\n')
        d.append(f"#### {r['id']} · {s(r.get('name'))} — `{s(r.get('pipeline_verdict'))}`\n")
        d.append(f"{s(r.get('publisher'))} · {s(r.get('landing_url'))}\n")
        for label, k in FIELDS:
            v = (f"{s(r.get('access_method'))} · {s(r.get('format'))} · {s(r.get('auth'))} · cost: {s(r.get('cost'))}"
                 if k is None else s(r.get(k)))
            if v != '—':
                d.append(f'- **{label}:** {v}')
        d.append('')
    return '\n'.join(d) + '\n'


def main():
    import datetime as dt
    rows = json.loads(JSON_PATH.read_text())
    if len(sys.argv) == 3 and sys.argv[1] == '--merge':
        rows = merge(rows, sys.argv[2])
    elif len(sys.argv) != 1:
        sys.exit(__doc__)
    doc = DOC_PATH.read_text()
    if START not in doc or END not in doc:
        sys.exit(f'scorecard markers missing in {DOC_PATH}; nothing written')
    JSON_PATH.write_text(json.dumps(rows, indent=1))
    DETAIL_PATH.write_text(detail(rows, dt.date.today().isoformat()))
    pre, rest = doc.split(START, 1)
    post = rest.split(END, 1)[1]
    DOC_PATH.write_text(f'{pre}{START}\n{scorecard(rows)}\n{END}{post}')
    counts = {}
    for r in rows:
        counts[r.get('pipeline_verdict')] = counts.get(r.get('pipeline_verdict'), 0) + 1
    print(f'{len(rows)} records; verdicts: {counts}')
    print('rewrote', JSON_PATH.name, DETAIL_PATH.name, DOC_PATH.name)


if __name__ == '__main__':
    main()
