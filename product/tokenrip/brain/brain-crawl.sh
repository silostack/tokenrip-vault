#!/usr/bin/env bash
# brain-crawl.sh — inventory the vault and recommend which docs belong in the Brain.
#
# Walks the vault for content-bearing markdown, classifies each doc by path
# heuristic (category + include recommendation + confidence + reason), force-
# includes anything already in the brain (snapshot), and writes seed-set.csv —
# a reviewable manifest. You then edit the `include` column (yes/no) and run
# `brain-sync.sh sync` (which reads the include=yes rows as its seed-set).
#
# Re-runnable: new docs get a heuristic recommendation; rows you have already
# decided are PRESERVED (your include value is kept) unless --reset is passed.
#
# Usage: brain-crawl.sh [--reset]
#   (no flag)  regenerate, preserving your existing include decisions
#   --reset    discard prior decisions, re-recommend everything from scratch
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VAULT_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
CSV="$SCRIPT_DIR/seed-set.csv"
SNAPSHOT="$SCRIPT_DIR/snapshot.json"
RESET=0; [ "${1:-}" = "--reset" ] && RESET=1

cd "$VAULT_ROOT"

# ---- enumerate in-scope markdown (system/tooling dirs excluded) -------------
list_docs() {
  find . -type f -name '*.md' \
    -not -path './.git/*'      -not -path './.obsidian/*' \
    -not -path './node_modules/*' -not -path './.claude/*' \
    -not -path './.agents/*'   -not -path './youtube-pipeline/*' \
    -not -path './codex/*'     -not -path './_claude/*' \
    -not -path './tmp/*'       -not -path './product/tokenrip/brain/*' \
    | sed 's#^\./##' | sort
}

# ---- classify <relpath> -> "include|category|confidence|reason" -------------
# First match wins. include ∈ {yes,no}; confidence ∈ {high,med,low}.
classify() {
  local p="$1" base; base="$(basename "$p")"
  case "$p" in
    __ARCHIVE/*)                 echo "no|archive|high|Retired/archived content";;
    */sources/*|content/sources/*) echo "no|reference|high|Citation/bibliography, not our position";;
    __RESOURCES/*)               echo "no|reference|high|External links/resources";;
    _system/*)                   echo "no|tooling|high|Vault system/instructions";;
    bd/calls/*|*transcript*|*-call-notes*|*call-transcript*) echo "no|transcript|high|Call transcript / raw notes";;
    bd/*)                        echo "no|bd-deal|high|Business development / deal state";;
    agents/*/memory/*|agents/*/sessions/*) echo "no|agent-memory|high|Agent operational memory/log";;
    agents/yoda/*|agents/closer/*|agents/engagement-agent/*|agents/blog-agent/*) echo "no|agent-ops|high|Agent persona/ops, not doctrine";;
    agents/bean/sessions/*|agents/bean/persona*|agents/bean/insights*) echo "no|agent-ops|high|Thinking-partner ops/memory";;
    agents/bean/ideas/_template.md) echo "no|template|high|Template";;
    agents/bean/ideas/*)         echo "no|thesis-idea|med|Developing idea — not settled doctrine; review";;
    mountedagents/*)             echo "no|agent-config|med|Mounted-agent seed/persona/config";;
    */CLAUDE.md|*/AGENTS.md|CLAUDE.md|AGENTS.md) echo "no|tooling|high|Agent/instruction file";;
    DASHBOARD.md|Home.md|*GEO-AUDIT*|*-todo*|*todo-*) echo "no|ops|high|Dashboard/ops/status";;
    _inbox/*)                    echo "no|wip-inbox|med|Inbox staging — transient; review";;
    content/plans/*)             echo "no|planning|high|Editorial calendar/plan";;
    content/drafts/*)            echo "no|draft-pov|med|Unpublished draft — review";;
    content/blog-schedule.md)    echo "no|ops|high|Content ops";;
    content/published/*)         echo "yes|blog-pov|high|Published POV/opinion";;
    product/tokenrip/make-com-playbook-analysis*|product/tokenrip/substack-roblox-playbook-analysis*|product/tokenrip/*homepage-redesign*) echo "no|analysis|med|Research/design analysis — review";;
    product/tokenrip/*)          echo "yes|product-truth|high|Tokenrip product truth/positioning";;
    product/quintel/*)           echo "yes|product-truth|low|Quintel — positioning yes / raw spec maybe; review";;
    product/10x-roadmap.md)      echo "no|planning|med|Build sequencing/roadmap — review";;
    product/*)                   echo "yes|product-truth|med|Product doc — review";;
    pitch/*)                     echo "yes|narrative|med|Investor narrative/positioning — review";;
    intelligence/*)              echo "no|competitive|med|Competitive research/reference — review";;
    distribution/*)              echo "no|distribution|med|Tactical distribution plan — review";;
    active/*)                    echo "no|wip-active|low|Active staging — MIXED (doctrine vs ops); needs judgment";;
    *)                           echo "no|other|low|Unclassified — review";;
  esac
}

# ---- force-include set: anything already in the brain -----------------------
force_inc_file="$(mktemp)"
jq -r '.sources | keys[]?' "$SNAPSHOT" 2>/dev/null > "$force_inc_file" || true

# ---- prior decisions (preserve include col unless --reset) ------------------
# bash 3.2 has no associative arrays; use a path<TAB>include lookup file.
PRIOR_TSV="$(mktemp)"
if [ "$RESET" = 0 ] && [ -f "$CSV" ]; then
  awk -F, 'NR>1 && $2!="" {print $2"\t"$1}' "$CSV" > "$PRIOR_TSV"
fi
lookup_prior() { awk -F'\t' -v p="$1" '$1==p{print $2; exit}' "$PRIOR_TSV"; }

# ---- emit CSV ---------------------------------------------------------------
csv_escape() { printf '%s' "$1" | sed 's/"/""/g'; }

{
  echo 'include,path,category,confidence,words,modified,reason'
  list_docs | while read -r p; do
    cls="$(classify "$p")"
    IFS='|' read -r inc cat conf reason <<<"$cls"
    # force-include if already in the brain
    if grep -qxF "$p" "$force_inc_file"; then inc="yes"; conf="high"; reason="Already in brain (keep)"; fi
    # preserve a prior human decision
    prior="$(lookup_prior "$p")"; [ -n "$prior" ] && inc="$prior"
    words="$(wc -w < "$p" | tr -d ' ')"
    mod="$(git log -1 --format=%cs -- "$p" 2>/dev/null || true)"; [ -z "$mod" ] && mod="$(stat -f %Sm -t %Y-%m-%d "$p" 2>/dev/null || echo '')"
    printf '%s,%s,%s,%s,%s,%s,"%s"\n' "$inc" "$p" "$cat" "$conf" "$words" "$mod" "$(csv_escape "$reason")"
  done
} > "$CSV.tmp" && mv "$CSV.tmp" "$CSV"
rm -f "$PRIOR_TSV"

rm -f "$force_inc_file"
total="$(($(wc -l < "$CSV") - 1))"
yes="$(awk -F, 'NR>1 && $1=="yes"' "$CSV" | wc -l | tr -d ' ')"
low="$(awk -F, 'NR>1 && $4=="low"' "$CSV" | wc -l | tr -d ' ')"
echo "wrote $CSV"
echo "  $total docs · $yes recommended include · $low low-confidence (review these first)"
echo "  edit the include column (yes/no), then: ./brain-sync.sh sync"
