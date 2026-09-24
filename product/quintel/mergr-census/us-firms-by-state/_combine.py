import json, csv, os
from datetime import datetime, timezone

BASE = "/Users/si/tokenrip-vault/product/quintel/mergr-census/us-firms-by-state"
FETCHED_AT = datetime.now(timezone.utc).isoformat()

batch_files = [f"_batch{i}.json" for i in range(1, 11)]
# batch1, batch6, batch8 are the "_parsed" ones from subagents
batch_files = ["_batch1_parsed.json","_batch2.json","_batch3.json","_batch4.json","_batch5.json",
               "_batch6_parsed.json","_batch7.json","_batch8_parsed.json","_batch9.json","_batch10.json"]

firms = {}  # firm_id -> {"name":..., "portfolio":[...]}

for bf in batch_files:
    path = os.path.join(BASE, bf)
    with open(path) as f:
        data = json.load(f)
    for entry in data["firms"]:
        fid = entry["firm"]["id"]
        fname = entry["firm"]["name"]
        portfolio = entry.get("portfolio", [])
        firms[fid] = {"name": fname, "portfolio": portfolio, "returned": entry.get("returned", len(portfolio))}

# Deep-pull replacements (filled in after retry succeeds)
deep_pull_file = os.path.join(BASE, "_deep_pull.json")
if os.path.exists(deep_pull_file):
    with open(deep_pull_file) as f:
        dp = json.load(f)
    for fid_str, entry in dp.items():
        fid = int(fid_str)
        firms[fid] = {"name": entry["name"], "portfolio": entry["portfolio"], "returned": entry.get("returned", len(entry["portfolio"]))}

HEADER = ["owner_firm_id","owner_firm_name","owner_firm_state","company_id","company_name","sector","location",
          "acquired_date","acquisition_type","exit_date","exit_type","hold_years","is_current",
          "revenue_millions_usd","acquisitions_during_hold","divestitures_during_hold","mergr_url","_fetched_at"]

def write_csv(filename, firm_ids, state):
    path = os.path.join(BASE, filename)
    rows_written = 0
    unique_firms = set()
    missing = []
    zero_row_firms = []
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
        w.writerow(HEADER)
        for fid in firm_ids:
            if fid not in firms:
                missing.append(fid)
                continue
            entry = firms[fid]
            fname = entry["name"].strip()
            portfolio = entry["portfolio"]
            if not portfolio:
                zero_row_firms.append((fid, fname))
                continue
            unique_firms.add(fid)
            for row in portfolio:
                w.writerow([
                    fid, fname, state,
                    row.get("id"), row.get("name"), row.get("sector"), row.get("location"),
                    row.get("acquired_date"), row.get("acquisition_type"), row.get("exit_date"),
                    row.get("exit_type"), row.get("hold_years"), row.get("is_current"),
                    row.get("revenue_millions_usd"), row.get("acquisitions_during_hold"),
                    row.get("divestitures_during_hold"), row.get("url"), FETCHED_AT
                ])
                rows_written += 1
    print(f"=== {filename} ===")
    print(f"  firm_ids requested: {len(firm_ids)}")
    print(f"  rows written: {rows_written}")
    print(f"  unique owner_firm_id count: {len(unique_firms)}")
    print(f"  zero-row firms: {zero_row_firms}")
    print(f"  MISSING (not in any batch!): {missing}")
    print()

GA_SMALL = [5992,525,6324,7018,1817,6865,6749,54,4769,1765,6699,696,527,5514,6239,5644,305,5435,6479,5182,5736,961,6271,6307,6248,5986,6100,5203,5748,3565,5585,4603,5721,4473,4720,4783,1523,2075,481,420,174,5797,6790]
GA_MID = [5231,3525,3557,2502,6550,5010,1334]
GA_LARGE = [134,103,6483]
GA_MEGA = [484]
NJ = [5950,1132,6535,6883,6860,815,1508,3109,6430,6303,5429,336,206,993,5071,1923,6679,1797,4452,780,2159,5070,4665,466,193,2144]

write_csv("georgia-small-portfolio-companies.csv", GA_SMALL, "Georgia")
write_csv("georgia-midmarket-portfolio-companies.csv", GA_MID, "Georgia")
write_csv("georgia-large-portfolio-companies.csv", GA_LARGE, "Georgia")
write_csv("georgia-mega-portfolio-companies.csv", GA_MEGA, "Georgia")
write_csv("newjersey-portfolio-companies.csv", NJ, "New Jersey")

total_ga = len(set(GA_SMALL+GA_MID+GA_LARGE+GA_MEGA))
print(f"Total unique GA firm ids requested: {total_ga} (expect 54)")
print(f"Total unique NJ firm ids requested: {len(set(NJ))} (expect 26)")
