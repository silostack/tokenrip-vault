#!/usr/bin/env python3
"""Connectivity probe for the source feeds that failed from Colombia on 2026-09-24.

Stdlib only. Run from the vault root:
    python3 active/quintel-v2/scripts/probe_geoblocked.py

Writes active/quintel-v2/data/geoblock-probe-<YYYY-MM-DD>.json and prints a summary.
See active/quintel-v2/geoblock-retest.md for what to do with the result.
"""
import datetime as dt
import json
import pathlib
import socket
import ssl
import time
import urllib.error
import urllib.parse
import urllib.request

UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/128.0 Safari/537.36')
TIMEOUT = 20

# (record ids, label, url). Controls first: if they fail, the server's network is the problem.
TARGETS = [
    ([], 'control: www.tn.gov', 'https://www.tn.gov/'),
    ([], 'control: data.texas.gov', 'https://data.texas.gov/resource/a5y7-t5ih.json?$limit=1'),
    (['TN-g5-02'], 'TDEC air permits (APEX)', 'https://dataviewers.tdec.tn.gov/dataviewers/f?p=19031:34001'),
    (['TN-g5-03'], 'TDEC DWR permits (APEX)', 'https://dataviewers.tdec.tn.gov/dataviewers/f?p=2005:34001'),
    (['TN-g5-04'], 'TDEC well driller reports (APEX)', 'https://dataviewers.tdec.tn.gov/dataviewers/f?p=2005:39929'),
    (['TN-g5-05'], 'TN contractor + QA licenses (Tableau CSV)',
     'https://data.tn.gov/t/Public/views/ContractorandQAdata/PublicDashboard.csv?:embed=y'),
    (['FL-g3-06'], 'Hillsborough Clerk daily indexes', 'https://publicrec.hillsclerk.com/OfficialRecords/DailyIndexes/'),
    (['FL-g3-01', 'FL-g3-02'], 'DBPR licensee extracts landing', 'https://www2.myfloridalicense.com/sto/'),
    (['FL-g3-01'], 'DBPR construction licensee CSV',
     'https://www2.myfloridalicense.com/sto/file_download/extracts/CONSTRUCTIONLICENSE_1.csv'),
    (['FL-g3-02'], 'DBPR electrical licensee CSV',
     'https://www2.myfloridalicense.com/sto/file_download/extracts/lic08el.csv'),
]


def egress():
    try:
        with urllib.request.urlopen('https://ipinfo.io/json', timeout=10) as r:
            d = json.load(r)
        return {k: d.get(k) for k in ('ip', 'city', 'region', 'country', 'org')}
    except Exception as e:  # noqa: BLE001
        return {'error': repr(e)}


def tcp(host, port=443):
    t = time.time()
    try:
        ip = socket.gethostbyname(host)
    except Exception as e:  # noqa: BLE001
        return {'dns': 'fail', 'error': repr(e)}
    try:
        with socket.create_connection((ip, port), timeout=TIMEOUT):
            return {'dns': ip, 'tcp': 'ok', 'ms': int((time.time() - t) * 1000)}
    except Exception as e:  # noqa: BLE001
        return {'dns': ip, 'tcp': 'fail', 'error': repr(e)}


def http(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': '*/*'})
    t = time.time()
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT, context=ssl.create_default_context()) as r:
            body = r.read(200_000)
            return _res(r.status, dict(r.headers), body, t, r.geturl())
    except urllib.error.HTTPError as e:
        return _res(e.code, dict(e.headers), e.read(20_000), t, url)
    except Exception as e:  # noqa: BLE001
        return {'status': None, 'error': repr(e), 'ms': int((time.time() - t) * 1000)}


def _res(status, headers, body, t, final_url):
    text = body.decode('utf-8', 'replace')
    low = text.lower()
    h = {k.lower(): v for k, v in headers.items()}
    cf = ('cf-mitigated' in h or 'just a moment' in low or 'cf-chl' in low
          or 'challenge-platform' in low)
    return {
        'status': status,
        'final_url': final_url,
        'server': h.get('server'),
        'content_type': h.get('content-type'),
        'bytes_read': len(body),
        'cloudflare_challenge': cf,
        'head': text[:300].replace('\n', ' '),
        'ms': int((time.time() - t) * 1000),
    }


def classify(p):
    if p['tcp'].get('dns') == 'fail':
        return 'dns_fail'
    if p['tcp'].get('tcp') == 'fail':
        return 'tcp_fail'
    h = p['http']
    if h.get('status') is None:
        return 'http_error'
    if h.get('cloudflare_challenge'):
        return 'cloudflare_challenge'
    if h['status'] == 403:
        return 'http_403'
    if 200 <= h['status'] < 400:
        return 'reachable'
    return f"http_{h['status']}"


def main():
    root = pathlib.Path(__file__).resolve().parents[1]
    today = dt.date.today().isoformat()
    out = {'probed_at': dt.datetime.now(dt.timezone.utc).isoformat(), 'egress': egress(), 'results': []}
    print('egress:', out['egress'])
    for ids, label, url in TARGETS:
        host = urllib.parse.urlparse(url).hostname
        p = {'ids': ids, 'label': label, 'url': url, 'tcp': tcp(host), 'http': {}}
        if p['tcp'].get('tcp') == 'ok':
            p['http'] = http(url)
        p['result'] = classify(p)
        out['results'].append(p)
        print(f"{p['result']:<22} {label}  ({p['http'].get('status')}, {p['http'].get('bytes_read')} bytes)")
    path = root / 'data' / f'geoblock-probe-{today}.json'
    path.write_text(json.dumps(out, indent=1))
    print('wrote', path)


if __name__ == '__main__':
    main()
