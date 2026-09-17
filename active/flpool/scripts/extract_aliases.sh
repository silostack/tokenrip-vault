#!/bin/bash
# corevt.txt -> former-name alias table (CORAPNC name-change events)
# Layout verified 2026-09-03: doc_number(1,12) seq(13,5) code(18,10) desc(28,50) date(78,16 -> MMDDYYYY right-aligned) former_name(207,192)
set -euo pipefail
SRC="data/sunbiz/corevt.txt"
OUT="data/work/sunbiz_aliases.csv"
echo "doc_number,seq,event_date,former_name" > "$OUT"
LC_ALL=C grep 'CORAPNC   ' "$SRC" | LC_ALL=C awk '
function trim(s){gsub(/^[ \t]+|[ \t]+$/,"",s); gsub(/  +/," ",s); return s}
function q(s){gsub(/"/,"\"\"",s); return "\"" s "\""}
{
  doc=trim(substr($0,1,12)); seq=trim(substr($0,13,5))
  d=trim(substr($0,86,8)); fn=trim(substr($0,211,192))
  if (doc=="" || fn=="") next
  iso=""
  if (length(d)==8) iso=substr(d,5,4)"-"substr(d,1,2)"-"substr(d,3,2)
  print q(doc) "," q(seq) "," q(iso) "," q(fn)
}' >> "$OUT"
echo "alias rows: $(( $(wc -l < "$OUT") - 1 ))"
