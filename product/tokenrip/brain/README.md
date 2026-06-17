# The Tokenrip Brain

A **Tokenrip Brain** is a Tokenrip workspace with semantic search on. This one holds
our **Doctrine** layer — the durable opinions, vision, platform context, product truth,
and voice that every Tokenrip agent should draw on so its output stays on-message instead
of being re-derived each session.

- **Full operations reference:** [`OPERATIONS.md`](./OPERATIONS.md) — read this to run or extend the brain
- **Brain slug:** `tokenrip-brain`
- **Source folder:** `tokenrip-brain-vault` (whole seed docs, filed + linked into the brain)
- **Seed-set:** [`seed-set.csv`](./seed-set.csv) — every candidate vault doc + an `include` decision (the source of truth for what's in the brain)
- **Config:** [`config.yaml`](./config.yaml) — slugs, zone, seed-set precedence
- **State:** [`snapshot.json`](./snapshot.json) — what the brain holds + the git SHA it reflects (the diff baseline)

## How it works

Two content kinds, both searched:

- **Sources** — whole seed documents, stored as artifacts (chunked + embedded).
- **Atoms** — self-contained claim-notes decomposed from a source, each carrying an
  envelope (`summary`, `zone`, `type`) and a `sourceArtifact` pointer back to its doc.

Recall = `recall by meaning, verify by lineage`: search surfaces atoms; each atom links
back to its source for the full argument.

## Choosing what's in the brain

The seed-set lives in [`seed-set.csv`](./seed-set.csv). Generate/refresh it with
**`/brain-crawl`** (runs `brain-crawl.sh`): it inventories the vault and recommends an
`include` (yes/no) per doc. Edit the `include` column to curate, then sync.

## Keeping it current

Run **`/brain-sync`**. It diffs the `include=yes` rows against `snapshot.json` (content
hash, with git assisting rename/change detection), then:

- **new** doc → publish artifact, atomize into claim-notes
- **changed** doc → publish a new artifact version (auto-cues re-atomization), reconcile atoms
- **renamed** doc (same content) → re-file only, no re-atomize
- **deleted / flipped to `no`** → archive the source + its atoms
- **unchanged** → skip

It is idempotent: re-running with no doc changes is a no-op. After each run it rewrites
`snapshot.json` (and commits it, recording the vault git SHA the brain now reflects).

## Recall contract (for consuming agents)

To pull doctrine before drafting:

```bash
TOKEN=$(jq -r '.apiKey' ~/.config/tokenrip/config.json)
API=$(jq -r '.apiUrl'  ~/.config/tokenrip/config.json)

# 1. Recall by meaning
curl -s "$API/v0/brains/tokenrip-brain/search?q=<your+question>" \
  -H "Authorization: Bearer $TOKEN" | jq '.data.results'
# kind:"note" hits are atoms (precise claims); kind:"artifact" hits are raw source chunks.

# 2. Verify by lineage — read the full source behind an atom
curl -s "$API/v0/workspaces/tokenrip-brain/notes?sourceArtifact=<publicId>" \
  -H "Authorization: Bearer $TOKEN"
curl -s "$API/v0/artifacts/<publicId>/content" -H "Authorization: Bearer $TOKEN"
```

Or via the CLI: `rip brain search tokenrip-brain "<your question>"`.

## Scope

v1 is **Doctrine only**. The Signals/Output zones and the `consolidate` promotion ritual
(`rip brain consolidate`) are deferred — they belong to the live marketing motion that
composes on top of this canonical brain.
