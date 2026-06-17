---
description: Sync the Tokenrip Brain — ingest new/changed doctrine docs and atomize them into claim-notes
---

# /brain-sync — keep the Tokenrip Brain current

You are syncing the **Tokenrip Brain** (`tokenrip-brain`) — the Doctrine layer of
our opinions, vision, platform context, product truth, and voice. The brain is a
Tokenrip workspace with semantic search on. It holds **sources** (whole seed docs as
artifacts) and **atoms** (claim-notes decomposed from them).

Your job: detect which seed docs changed since the last run, push those source
changes, **atomize** every source that needs it (this part is your judgment), then
finalize the snapshot.

The deterministic half is the helper script
`product/tokenrip/brain/brain-sync.sh`. Atomization is yours.

Args: `$ARGUMENTS` — pass `--full` to ingest the full seed-set (default: cornerstone only).

## Setup

```bash
cd /Users/si/tokenrip-vault/product/tokenrip/brain
TOKEN=$(jq -r '.apiKey' ~/.config/tokenrip/config.json)
API=$(jq -r '.apiUrl'  ~/.config/tokenrip/config.json)
WS=tokenrip-brain
```

## Step 1 — Sync source artifacts (deterministic)

Run the script. It ensures the brain/folder exist, diffs the seed-set against
`snapshot.json` (content hash + git rename detection), and publishes / versions /
re-files / archives source artifacts. It writes `.work/atomize.tsv`
(`publicId<TAB>relpath`) — the sources needing atomization (new + changed) — and
`.work/state.json`.

```bash
./brain-sync.sh sync $ARGUMENTS
```

Read its plan output. If `atomize.tsv` is empty **and** no deletions occurred, the
brain is already current — skip to Step 4 (finalize is still cheap/idempotent).

If the script reports `embedding` is false or search `mode` is `keyword`, tell Simon
the account needs `semantic_search` entitled (an admin grant) — atoms still work,
recall is keyword-only until then. Continue regardless.

## Step 2 — Load the canonical atomize playbook

Always re-fetch it (it is the platform's current rules; do not rely on memory):

```bash
rip brain atomize $WS    # or: curl -s "$API/v0/brains/$WS/load?command=atomize" -H "Authorization: Bearer $TOKEN" | jq -r '.data.flow.content'
```

Follow that playbook. The essentials it encodes:

- **Decompose semantically, not positionally** — split by *idea*, not by heading.
- **Faithful to the source** — never invent or extrapolate beyond what the doc states.
- **Self-contained** — each atom stands alone without the surrounding doc.
- **Fewer, sharper claims beat many shallow ones.** A boilerplate/noise source that
  yields no claim worth keeping gets **no atoms** — skip it.

## Step 3 — Atomize each source (your judgment)

The authoritative to-do list is the brain worklist; it is resumable (a source drops
off once it has a non-archived atom). Confirm targets:

```bash
./brain-sync.sh worklist          # unAtomized + stale sources
cat .work/atomize.tsv             # publicId<TAB>relpath for this run
```

For **each** `publicId` (PID) in `unAtomizedSources` (changed sources had their old
atoms archived by Step 1, so they reappear here for a clean re-atomize):

1. Idempotency — should be empty for these; if not, don't duplicate a claim:
   ```bash
   curl -s "$API/v0/workspaces/$WS/notes?sourceArtifact=$PID" -H "Authorization: Bearer $TOKEN" | jq '.data'
   ```
2. Read the source:
   ```bash
   curl -s "$API/v0/artifacts/$PID/content" -H "Authorization: Bearer $TOKEN"
   ```
3. Decompose into atomic claim-notes. For each claim, write it (zone is always
   `doctrine` for this brain — it gets the trust-boost at recall):
   ```bash
   curl -s -X POST "$API/v0/workspaces/$WS/notes" \
     -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
     -d "$(jq -n \
       --arg title   "<short keyword-rich claim title>" \
       --arg body    "<the claim, self-contained, plain language>" \
       --arg summary "<one line: why this matters / when it is relevant>" \
       --arg type    "<claim|thesis|proof-point|one-liner>" \
       --arg src     "$PID" \
       '{title:$title, body:$body, summary:$summary, zone:"doctrine", type:$type, sourceArtifact:$src}')" \
     | jq '{slug:.data.slug, sourceArtifactId:.data.sourceArtifactId}'
   # sourceArtifactId MUST come back non-null — that confirms the atom→source link landed.
   ```
   - Recall here is hybrid full-text + semantic, so make titles and bodies use the
     words a query would use (name the concept and its synonyms in plain language).
4. Optionally link related atoms (one supports/refines another):
   ```bash
   curl -s -X POST "$API/v0/workspaces/$WS/notes/$FROM_SLUG/links" \
     -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
     -d '{"to":"<other-slug>","relation":"supports"}'
   ```

Work the list until `./brain-sync.sh worklist` shows `unAtomized: []`. For a large
run you may atomize in parallel batches (the worklist is idempotent/resumable).

## Step 4 — Finalize the snapshot

Rebuild `snapshot.json` from authoritative server state (it re-queries each source's
live atoms), record the vault git SHA the brain now reflects, and commit it:

```bash
./brain-sync.sh finalize
```

## Step 5 — Verify recall (acceptance test)

```bash
./brain-sync.sh search "<a claim you just atomized>"
```

A `kind:"note"` hit (an atom) — not just a raw `kind:"artifact"` chunk — means recall
works. If a known belief isn't recalled, fix that atom's **title/summary** (the query
words), not the search. Report a short summary to Simon: sources added/changed, atoms
written, search mode, and the git SHA the brain now reflects.

## Notes

- All writes use the `tr_` apiKey from `~/.config/tokenrip/config.json` so everything
  is owned by one identity. Never print or commit the token.
- Atoms must be written via this REST endpoint (or MCP), **not** `rip workspace note set`
  — the CLI lacks `--zone/--type/--summary` and a CLI atom loses the doctrine trust-boost.
- Scope is **Doctrine only**. The Signals/Output zones and `rip brain consolidate`
  (promote/fuse/supersede) are deferred to the marketing motion.
