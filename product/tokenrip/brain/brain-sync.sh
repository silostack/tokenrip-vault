#!/usr/bin/env bash
# brain-sync.sh — deterministic half of the Tokenrip Brain sync.
#
# Handles everything that is NOT judgment: ensure brain/folder exist, diff the
# seed-set against snapshot.json (content hash + git rename assist), publish /
# version / archive / re-file source artifacts, and rebuild + commit the
# snapshot. Atomization (decomposing a source into claim-notes) is model
# judgment and lives in .claude/commands/brain-sync.md, which calls this script.
#
# Subcommands:
#   sync [--full]   ensure + diff + apply source changes; writes .work/atomize.tsv
#                   (publicId<TAB>path for every source needing atomization) and
#                   .work/state.json (path -> {publicId, sha256}). Prints a plan.
#   finalize        rebuild snapshot.json from server atom state; git-commit it.
#   search <query>  convenience recall against the brain.
#   worklist        print the brain worklist (unAtomized / stale).
#
# All API calls use the tr_ apiKey from ~/.config/tokenrip/config.json so every
# write is owned by one identity. Never prints or commits the token.
set -euo pipefail

# ---- locate paths -----------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VAULT_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
BRAIN_DIR="$SCRIPT_DIR"
CONFIG="$BRAIN_DIR/config.yaml"
SNAPSHOT="$BRAIN_DIR/snapshot.json"
CSV_SEED="$BRAIN_DIR/seed-set.csv"
WORK="$BRAIN_DIR/.work"
CRED="$HOME/.config/tokenrip/config.json"

# ---- auth + config ----------------------------------------------------------
TOKEN="$(jq -r '.apiKey' "$CRED")"
API="$(jq -r '.apiUrl // "https://api.tokenrip.com"' "$CRED")"
[ -n "$TOKEN" ] && [ "$TOKEN" != "null" ] || { echo "FATAL: no apiKey in $CRED" >&2; exit 1; }

cfg() { # cfg <top-level key> -> value (simple scalar)
  awk -v k="$1" '$0 ~ "^"k":" {sub("^"k":[[:space:]]*",""); gsub(/[[:space:]]*#.*$/,""); gsub(/^"|"$/,""); print; exit}' "$CONFIG"
}
BRAIN_SLUG="$(cfg brain_slug)"
BRAIN_NAME="$(cfg brain_name)"
FOLDER_SLUG="$(cfg folder_slug)"
TEAM="$(cfg team)"; [ "$TEAM" = "null" ] && TEAM=""
ZONE="$(cfg zone)"; [ -z "$ZONE" ] && ZONE="doctrine"
COMMIT_SNAP="$(cfg commit_snapshot)"

# globs for a tier (cornerstone|full); reads the indented list under seed_set:
globs_for() { # globs_for <tier>
  awk -v tier="$1" '
    /^seed_set:/{inss=1; next}
    inss && /^[^[:space:]]/{inss=0}
    inss && $0 ~ "^  "tier":" {cur=1; next}
    inss && /^  [a-z]/{cur=0}
    inss && cur && /^    - /{ sub(/^    - /,""); gsub(/^"|"$/,""); print }
  ' "$CONFIG"
}
exclude_globs() {
  awk '/^exclude:/{ine=1;next} ine && /^[^[:space:]-]/{ine=0} ine && /^  - /{sub(/^  - /,"");gsub(/^"|"$/,"");print}' "$CONFIG"
}

# ---- curl helpers -----------------------------------------------------------
api() { # api <METHOD> <path> [json-body]  -> response body; non-2xx -> stderr + exit
  local method="$1" path="$2" body="${3:-}"
  local args=(-sS -X "$method" "$API$path" -H "Authorization: Bearer $TOKEN")
  [ -n "$body" ] && args+=(-H 'Content-Type: application/json' -d "$body")
  local resp; resp="$(curl "${args[@]}")"
  echo "$resp"
}
ok() { jq -e '.ok == true' >/dev/null 2>&1; }

sha_of() { shasum -a 256 "$1" | cut -d' ' -f1; }

# filter_excludes: stdin paths -> stdout, dropping any matching an exclude glob.
# Supports * (within a path segment) and ** (across segments). No globstar needed.
filter_excludes() {
  if [ -s "$WORK/excludes.txt" ]; then
    awk -v exf="$WORK/excludes.txt" '
      BEGIN{ n=0
        while((getline pat < exf)>0){ if(pat=="") continue
          gsub(/\./,"\\.",pat); gsub(/\*\*/,"\001",pat); gsub(/\*/,"[^/]*",pat); gsub(/\001/,".*",pat)
          pats[n++]="^" pat "$" } }
      { drop=0; for(i=0;i<n;i++) if($0 ~ pats[i]){drop=1;break}; if(!drop) print }'
  else cat; fi
}

# ---- ensure brain + folder + link ------------------------------------------
ensure() {
  if api GET "/v0/workspaces/$BRAIN_SLUG" | ok; then
    echo "  brain exists: $BRAIN_SLUG"
  else
    local b; b="$(api POST /v0/brains "$(jq -n --arg s "$BRAIN_SLUG" --arg n "$BRAIN_NAME" \
          --arg t "$TEAM" '{slug:$s,name:$n} + (if $t=="" then {} else {team:$t} end)')")"
    echo "$b" | ok && echo "  brain created: $BRAIN_SLUG (embedding=$(echo "$b" | jq -r '.data.embeddingEnabled'))" \
       || echo "  brain create returned: $(echo "$b" | jq -rc '.error // .message // "?"')"
  fi
  # folder
  local fpath="/v0/folders"; [ -n "$TEAM" ] && fpath="/v0/teams/$TEAM/folders"
  local f; f="$(api POST "$fpath" "$(jq -n --arg s "$FOLDER_SLUG" '{slug:$s}')")"
  echo "$f" | ok && echo "  folder created: $FOLDER_SLUG" || echo "  folder exists or noop"
  # link folder into brain
  local l; l="$(api POST "/v0/workspaces/$BRAIN_SLUG/items" \
        "$(jq -n --arg i "$FOLDER_SLUG" '{kind:"folder",item:$i,ownership:"linked"}')")"
  echo "$l" | ok && echo "  folder linked into brain" || echo "  folder link exists or noop"
}

# ---- publish / version / archive / patch ------------------------------------
publish_source() { # publish_source <relpath> -> publicId
  local rel="$1" content; content="$(cat "$VAULT_ROOT/$rel")"
  local r; r="$(api POST /v0/artifacts \
      "$(jq -n --arg t "$rel" --arg c "$content" --arg f "$FOLDER_SLUG" \
         '{type:"markdown",title:$t,content:$c,folder:$f}')")"
  echo "$r" | ok || { echo "PUBLISH FAILED $rel: $r" >&2; return 1; }
  echo "$r" | jq -r '.data.id'
}
version_source() { # version_source <publicId> <relpath>
  local pid="$1" rel="$2" content; content="$(cat "$VAULT_ROOT/$rel")"
  local r; r="$(api POST "/v0/artifacts/$pid/versions" \
      "$(jq -n --arg c "$content" --arg d "brain-sync: $rel changed" '{type:"markdown",content:$c,description:$d}')")"
  echo "$r" | ok || { echo "VERSION FAILED $rel: $r" >&2; return 1; }
}
patch_title() { # patch_title <publicId> <newRelpath>
  local pid="$1" rel="$2"
  api PATCH "/v0/artifacts/$pid" "$(jq -n --arg t "$rel" '{title:$t}')" >/dev/null
}
archive_source() { api POST "/v0/artifacts/$1/archive" >/dev/null 2>&1 || true; }
archive_atoms_of() { # archive_atoms_of <publicId> — archive every atom linked to a source
  local pid="$1"
  api GET "/v0/workspaces/$BRAIN_SLUG/notes?sourceArtifact=$pid" \
    | jq -r '.data[]?.slug // empty' \
    | while read -r slug; do
        [ -n "$slug" ] && api POST "/v0/workspaces/$BRAIN_SLUG/notes/$slug/archive" >/dev/null 2>&1 || true
      done
}

# ---- sync (diff + apply) ----------------------------------------------------
sync() {
  local tier_full=0; [ "${1:-}" = "--full" ] && tier_full=1
  mkdir -p "$WORK"
  echo "==> ensure brain + folder + link"
  ensure

  # resolve current seed-set -> list of relpaths (unique).
  # Precedence: seed-set.csv (include=yes rows) if present, else config globs.
  if [ -f "$CSV_SEED" ]; then
    echo "==> resolving seed-set from seed-set.csv (include=yes rows)"
    awk -F, 'NR>1 && tolower($1) ~ /^(yes|y|true|1|x)$/ {print $2}' "$CSV_SEED" \
      | while read -r p; do [ -n "$p" ] && [ -f "$VAULT_ROOT/$p" ] && echo "$p"; done | sort -u > "$WORK/current.txt"
  else
    echo "==> resolving seed-set from config globs ($([ $tier_full = 1 ] && echo 'cornerstone+full' || echo 'cornerstone'))"
    { globs_for cornerstone; [ $tier_full = 1 ] && globs_for full; } > "$WORK/globs.txt"
    exclude_globs > "$WORK/excludes.txt" || true
    ( cd "$VAULT_ROOT" && shopt -s nullglob
      while read -r g; do for p in $g; do [ -f "$p" ] && echo "$p"; done; done < "$WORK/globs.txt"
    ) | sort -u | filter_excludes > "$WORK/current.txt"
  fi
  echo "    $(wc -l < "$WORK/current.txt" | tr -d ' ') source docs in seed-set"

  # previous snapshot: path -> {publicId, sha256}
  local prev="$SNAPSHOT"
  # build sha map of current files
  : > "$WORK/current_sha.tsv"
  while read -r rel; do printf '%s\t%s\n' "$rel" "$(sha_of "$VAULT_ROOT/$rel")"; done < "$WORK/current.txt" > "$WORK/current_sha.tsv"

  # state.json accumulates path -> {publicId, sha256}; atomize.tsv lists pid<TAB>path needing atomization
  echo '{}' > "$WORK/state.json"
  : > "$WORK/atomize.tsv"
  local n_new=0 n_chg=0 n_ren=0 n_del=0 n_same=0

  # index of prev shas (sha -> path) for rename detection
  jq -r '.sources | to_entries[] | "\(.value.sha256)\t\(.key)"' "$prev" > "$WORK/prev_sha.tsv" 2>/dev/null || : > "$WORK/prev_sha.tsv"

  while IFS=$'\t' read -r rel sha; do
    local ppid psha
    ppid="$(jq -r --arg p "$rel" '.sources[$p].publicId // empty' "$prev")"
    psha="$(jq -r --arg p "$rel" '.sources[$p].sha256 // empty' "$prev")"
    if [ -n "$ppid" ] && [ "$psha" = "$sha" ]; then
      # unchanged
      n_same=$((n_same+1))
      _state_set "$rel" "$ppid" "$sha"
    elif [ -n "$ppid" ] && [ "$psha" != "$sha" ]; then
      # changed: archive old atoms, push new version -> re-surfaces in unAtomizedSources
      echo "  ~ changed: $rel"
      archive_atoms_of "$ppid"; version_source "$ppid" "$rel"
      _state_set "$rel" "$ppid" "$sha"; printf '%s\t%s\n' "$ppid" "$rel" >> "$WORK/atomize.tsv"
      n_chg=$((n_chg+1))
    else
      # not previously at this path: rename (same sha at an absent old path) or new
      local oldpath; oldpath="$(awk -v s="$sha" -F'\t' '$1==s{print $2; exit}' "$WORK/prev_sha.tsv")"
      if [ -n "$oldpath" ] && ! grep -qxF "$oldpath" "$WORK/current.txt"; then
        local rpid; rpid="$(jq -r --arg p "$oldpath" '.sources[$p].publicId' "$prev")"
        echo "  > renamed: $oldpath -> $rel"
        patch_title "$rpid" "$rel"
        # carry forward atom slugs from old path (atoms unchanged)
        _state_set_carry "$rel" "$rpid" "$sha" "$oldpath"
        n_ren=$((n_ren+1))
      else
        echo "  + new: $rel"
        local npid; npid="$(publish_source "$rel")"
        _state_set "$rel" "$npid" "$sha"; printf '%s\t%s\n' "$npid" "$rel" >> "$WORK/atomize.tsv"
        n_new=$((n_new+1))
      fi
    fi
  done < "$WORK/current_sha.tsv"

  # deletions: prev paths no longer in current set and not consumed by a rename
  jq -r '.sources | keys[]' "$prev" 2>/dev/null | while read -r oldp; do
    if ! grep -qxF "$oldp" "$WORK/current.txt"; then
      # was it a rename target? if its sha matches a current file we already handled, skip
      local osha opid; osha="$(jq -r --arg p "$oldp" '.sources[$p].sha256' "$prev")"
      if ! awk -F'\t' -v s="$osha" '$2==s{f=1} END{exit f?0:1}' "$WORK/current_sha.tsv"; then
        opid="$(jq -r --arg p "$oldp" '.sources[$p].publicId' "$prev")"
        echo "  - deleted: $oldp"; archive_atoms_of "$opid"; archive_source "$opid"
        echo "$oldp" >> "$WORK/deleted.txt"
      fi
    fi
  done

  local n_del; n_del="$( [ -f "$WORK/deleted.txt" ] && wc -l < "$WORK/deleted.txt" | tr -d ' ' || echo 0 )"
  echo "==> plan: +$n_new new  ~$n_chg changed  >$n_ren renamed  -$n_del deleted  =$n_same unchanged"
  echo "==> sources needing atomization: $(wc -l < "$WORK/atomize.tsv" | tr -d ' ')  (see $WORK/atomize.tsv)"
  echo "    Next: atomize each, then run: $0 finalize"
}

_state_set() { # path publicId sha
  jq --arg p "$1" --arg id "$2" --arg s "$3" \
     '.sources[$p] = {publicId:$id, sha256:$s, atom_slugs:[], status:"published"}' \
     "$WORK/state.json" > "$WORK/state.json.tmp" && mv "$WORK/state.json.tmp" "$WORK/state.json"
}
_state_set_carry() { # path publicId sha oldpath  (carry atom_slugs + atomized status from snapshot)
  local carry; carry="$(jq -c --arg o "$4" '.sources[$o].atom_slugs // []' "$SNAPSHOT")"
  jq --arg p "$1" --arg id "$2" --arg s "$3" --argjson a "$carry" \
     '.sources[$p] = {publicId:$id, sha256:$s, atom_slugs:$a, status:(if ($a|length)>0 then "atomized" else "published" end)}' \
     "$WORK/state.json" > "$WORK/state.json.tmp" && mv "$WORK/state.json.tmp" "$WORK/state.json"
}

# ---- finalize: rebuild snapshot from server, commit -------------------------
finalize() {
  [ -f "$WORK/state.json" ] || { echo "no $WORK/state.json — run sync first" >&2; exit 1; }
  echo "==> rebuilding snapshot from server atom state"
  local tmp="$WORK/snap.json"; cp "$WORK/state.json" "$tmp"
  # for each source, pull current (non-archived) atom slugs from the server
  jq -r '.sources | to_entries[] | "\(.key)\t\(.value.publicId)"' "$tmp" | while IFS=$'\t' read -r rel pid; do
    local slugs; slugs="$(api GET "/v0/workspaces/$BRAIN_SLUG/notes?sourceArtifact=$pid" | jq -c '[.data[]?.slug] // []')"
    local status; status=$([ "$(echo "$slugs" | jq 'length')" -gt 0 ] && echo atomized || echo published)
    jq --arg p "$rel" --argjson a "$slugs" --arg st "$status" \
       '.sources[$p].atom_slugs=$a | .sources[$p].status=$st' "$tmp" > "$tmp.t" && mv "$tmp.t" "$tmp"
  done
  local mode; mode="$(api GET "/v0/brains/$BRAIN_SLUG/search?q=tokenrip" | jq -r '.data.mode // "unknown"')"
  local sha dirty; sha="$(git -C "$VAULT_ROOT" rev-parse HEAD)"
  git -C "$VAULT_ROOT" diff --quiet 2>/dev/null && dirty=false || dirty=true
  jq -n --arg bs "$BRAIN_SLUG" --arg fs "$FOLDER_SLUG" --arg ts "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        --arg sha "$sha" --argjson dirty "$dirty" --arg mode "$mode" --slurpfile st "$tmp" \
     '{brain_slug:$bs, folder_slug:$fs, ingested_at:$ts, git_sha:$sha, git_dirty:$dirty, search_mode:$mode, sources:$st[0].sources}' \
     > "$SNAPSHOT"
  echo "    snapshot.json rewritten ($(jq '.sources|length' "$SNAPSHOT") sources, mode=$mode, sha=${sha:0:8})"
  if [ "$COMMIT_SNAP" = "true" ]; then
    git -C "$VAULT_ROOT" add "$SNAPSHOT" && \
    git -C "$VAULT_ROOT" commit -q -m "brain-sync: snapshot @ ${sha:0:8}" "$SNAPSHOT" 2>/dev/null && \
    echo "    committed snapshot" || echo "    nothing to commit"
  fi
  rm -rf "$WORK"
}

case "${1:-}" in
  sync)     shift; sync "${1:-}";;
  finalize) finalize;;
  ensure)   ensure;;
  search)   shift; api GET "/v0/brains/$BRAIN_SLUG/search?q=$(jq -rn --arg q "$*" '$q|@uri')" | jq '.data';;
  worklist) api GET "/v0/workspaces/$BRAIN_SLUG/worklist" | jq '.data | {unAtomized:[.unAtomizedSources[]?|{publicId,title}], stale:[.staleAtomSources[]?|{publicId,title}]}';;
  *) echo "usage: $0 {sync [--full]|finalize|ensure|search <q>|worklist}" >&2; exit 1;;
esac
