# Tokenrip Brain — Operations

Everything needed to run, understand, and extend the Tokenrip Brain. For the short
version, see [`README.md`](./README.md); this is the full operations reference.

---

## 1. What the brain is

The **Tokenrip Brain** (`tokenrip-brain`) is a Tokenrip *workspace with semantic search
on*. It holds the **Doctrine layer** — our durable opinions, vision, platform context,
product truth, positioning, and voice — so any Tokenrip agent (blog, tweet, post,
cold-email, proposal, personas) can recall "what we believe about X" instead of
re-deriving it each session.

It stores two kinds of content; search spans both:

| | What | Primitive |
|---|---|---|
| **Sources** | whole seed docs, chunked + embedded | Tokenrip *artifacts*, filed in folder `tokenrip-brain-vault`, linked into the brain |
| **Atoms** | self-contained claim-notes decomposed from a source | Tokenrip *notes*, each with `summary` / `zone` / `type` and a `sourceArtifact` pointer |

Recall is **"recall by meaning, verify by lineage"**: semantic search surfaces atoms;
each atom links back to its source for the full argument.

**Current state:** 10 sources / 118 doctrine atoms ingested (the cornerstone set);
`seed-set.csv` recommends 46 docs total (36 not yet ingested, pending review).

---

## 2. Files in this directory

| File | Role | Committed? |
|---|---|---|
| `config.yaml` | brain/folder slugs, zone, seed-set precedence, fallback globs | yes |
| `seed-set.csv` | **the seed-set** — every candidate vault doc + an `include` decision | yes |
| `snapshot.json` | what the brain holds (per-source publicId, content hash, atom slugs) + the git SHA it reflects — the diff baseline | yes (auto-committed by `finalize`) |
| `brain-sync.sh` | the sync engine (deterministic half) | yes |
| `brain-crawl.sh` | the vault crawler that (re)builds `seed-set.csv` | yes |
| `README.md` / `OPERATIONS.md` | docs | yes |
| `.work/` | transient per-run journal (plan, diff scratch) | no (gitignored) |

Slash commands (in `.claude/commands/`): **`/brain-sync`** and **`/brain-crawl`** —
thin orchestrators that run these scripts and supply the judgment steps (atomization,
ambiguous-row classification).

---

## 3. Auth & prerequisites

- **API key:** read at runtime from `~/.config/tokenrip/config.json` → `.apiKey` (a
  `tr_…` token) and `.apiUrl`. Every call is `Authorization: Bearer <key>`, so all
  writes are owned by one identity. The token is never printed or committed.
- **Semantic entitlement:** semantic recall needs `semantic_search` enabled on the
  owning account (an admin grant). Confirmed live — searches return `mode: hybrid`. If
  it were off, atoms still get created but recall degrades to keyword until entitled
  (re-indexing is automatic once granted).
- **Tooling:** `jq`, `shasum`, `git`, `curl` (all present). Scripts are bash-3.2
  compatible (macOS system bash — no `globstar`, no associative arrays).

---

## 4. The two workflows

### A. Decide what's in the brain — `/brain-crawl`

```bash
cd product/tokenrip/brain
./brain-crawl.sh            # --reset to re-recommend everything from scratch
```

Walks the vault for content-bearing markdown, classifies each doc by path heuristic
(`category / include / confidence / reason`), **force-includes anything already in the
brain**, and **preserves prior `include` edits**. Writes `seed-set.csv`. Then a human
(or subagents) refines the **low-confidence** rows — chiefly `active/` and
`product/quintel/`, where canonical theses sit beside dated ops/build docs.

**You then edit the `include` column** (yes/no) in a spreadsheet or editor. That CSV is
the source of truth for the next sync.

`seed-set.csv` columns:

```
include   yes | no            ← your decision (heuristic pre-fills it)
path      relative vault path
category  blog-pov | product-truth | wip-active | bd-deal | transcript | …
confidence high | med | low    ← review low first
words     rough size
modified  last git commit date
reason    one-line rationale (quoted)
```

### B. Sync the brain to the CSV — `/brain-sync`

```bash
cd product/tokenrip/brain
./brain-sync.sh sync        # ingest source changes; writes .work/atomize.tsv
# … atomize the listed sources (judgment — see §6) …
./brain-sync.sh finalize    # rebuild + commit snapshot.json
./brain-sync.sh search "…"  # verify recall
```

`/brain-sync` orchestrates all of this, including the atomization in the middle.

---

## 5. How sync detects change (the snapshot)

The server sees **artifacts, not vault files** — nothing server-side knows a `.md`
changed. So the client owns one decision: *which seed-set files differ from what the
brain holds → (re)publish / archive.* That is `snapshot.json`'s job.

On each `sync`, `brain-sync.sh`:

1. Resolves the seed-set: **`seed-set.csv` include=yes rows** if present, else the
   `config.yaml` globs.
2. Hashes each file (`sha256`) and diffs against `snapshot.json`:
   - **new** (path absent) → publish artifact into the folder.
   - **changed** (hash differs) → archive its old atoms + `POST …/versions` (new
     artifact version). Because staleness server-side is *`artifact.updated_at >
     max(atom.last_touched_at)`*, the version bump + atom-archive makes the source
     re-appear in the worklist's `unAtomizedSources` for a clean re-atomize.
   - **renamed** (hash matches a now-absent old path) → `PATCH` the title only; carry
     the atoms forward. No re-atomize. (Git `--find-renames` informs this; the hash is
     authoritative.)
   - **deleted** (in snapshot, not in seed-set) → archive the source + its atoms.
   - **unchanged** → skip.
3. Writes `.work/atomize.tsv` (publicId → path for every source needing atomization)
   and `.work/state.json`.

`finalize` then re-queries each source's live atoms from the server, rewrites
`snapshot.json` (with the current git SHA + `git_dirty` + `search_mode`), and commits
it. **Idempotent:** a sync with no doc changes is a no-op.

**Why hash-primary, git-assist:** the content hash is robust to uncommitted/untracked
edits and out-of-band changes; git supplies the provenance anchor (the SHA the brain
reflects), the human-readable change report, and rename detection.

---

## 6. Atomization (the judgment step)

There is no "atomize" button — decomposing a source into claim-notes is model judgment.
`/brain-sync` runs it between `sync` and `finalize`:

1. Load the platform's canonical playbook (always re-fetch, don't rely on memory):
   `rip brain atomize tokenrip-brain` (or `GET /v0/brains/tokenrip-brain/load?command=atomize`).
2. For each source `publicId` in the worklist's `unAtomizedSources`:
   - Read it: `GET /v0/artifacts/:publicId/content`.
   - Decompose **semantically (by idea, not by heading)** into atomic claim-notes:
     faithful to the source, self-contained, **fewer-and-sharper beats many-and-shallow**.
     A noise/boilerplate source gets no atoms.
   - Write each: `POST /v0/workspaces/tokenrip-brain/notes` with
     `{title, body, summary, zone:"doctrine", type, sourceArtifact}`. The response's
     `sourceArtifactId` must be non-null (confirms the atom→source link).
   - Optionally link related atoms: `POST …/notes/:from/links {to, relation}`.
3. Drain the worklist until `unAtomizedSources` is `[]`. Large runs can atomize in
   parallel subagents (the worklist is idempotent/resumable).

**Atoms must be written via REST (or MCP `workspace_note_upsert`), NOT `rip workspace
note set`** — the CLI lacks `--zone/--type/--summary`, so a CLI atom loses the
`doctrine` trust-boost at recall.

`type` ∈ `claim | thesis | proof-point | one-liner`. Recall is hybrid semantic +
full-text — write titles/bodies in the words someone would actually query.

---

## 7. Recall contract (for consuming agents)

```bash
TOKEN=$(jq -r '.apiKey' ~/.config/tokenrip/config.json)
API=$(jq -r '.apiUrl'  ~/.config/tokenrip/config.json)

# recall by meaning — kind:"note" hits are atoms; kind:"artifact" hits are raw chunks
curl -s "$API/v0/brains/tokenrip-brain/search?q=<question>" -H "Authorization: Bearer $TOKEN" | jq '.data'
# verify by lineage — the source behind an atom
curl -s "$API/v0/workspaces/tokenrip-brain/notes?sourceArtifact=<publicId>" -H "Authorization: Bearer $TOKEN"
```

Or via CLI: `rip brain search tokenrip-brain "<question>"`. Quick local helper:
`./brain-sync.sh search "<question>"`.

---

## 8. `brain-sync.sh` subcommands

| Command | Does |
|---|---|
| `sync [--full]` | ensure brain/folder/link, diff seed-set, publish/version/rename/archive sources, write `.work/atomize.tsv`. `--full` only affects the glob fallback. |
| `finalize` | rebuild `snapshot.json` from server atom state, record git SHA, commit it, clear `.work/`. |
| `ensure` | create brain + folder + link if missing (idempotent). |
| `search <q>` | convenience recall against the brain. |
| `worklist` | show `unAtomizedSources` / `staleAtomSources`. |

`brain-crawl.sh` takes no subcommand (optional `--reset`).

---

## 9. API reference (all under `https://api.tokenrip.com`)

| Purpose | Endpoint |
|---|---|
| Create brain | `POST /v0/brains {slug,name,team?}` |
| Create folder | `POST /v0/folders {slug}` (team: `POST /v0/teams/:team/folders`) |
| Publish source | `POST /v0/artifacts {type:"markdown",title,content,folder}` → `data.id` |
| New version | `POST /v0/artifacts/:publicId/versions {type,content,description?}` |
| Rename / re-file | `PATCH /v0/artifacts/:publicId {title?}` |
| Archive source | `POST /v0/artifacts/:publicId/archive` |
| Link folder → brain | `POST /v0/workspaces/:slug/items {kind:"folder",item,ownership:"linked"}` |
| Worklist | `GET /v0/workspaces/:slug/worklist` |
| Atoms for a source | `GET /v0/workspaces/:slug/notes?sourceArtifact=:publicId` |
| Write atom | `POST /v0/workspaces/:slug/notes {title,body,summary,zone,type,sourceArtifact}` |
| Archive atom | `POST /v0/workspaces/:slug/notes/:slug/archive` |
| Link atoms | `POST /v0/workspaces/:slug/notes/:from/links {to,relation}` |
| Recall | `GET /v0/brains/:slug/search?q=…` → `data.mode` (semantic\|hybrid\|keyword) |
| Live playbooks | `GET /v0/brains/:slug/load?command=atomize` / `?command=consolidate` |

---

## 10. Troubleshooting

- **`search` returns `mode: keyword`** → account not entitled for `semantic_search`.
  Atoms still work; recall is keyword-only. Ask for the admin grant; re-indexing is
  automatic.
- **A new source's atoms aren't searchable yet** → embeddings are written by a
  background reconciler (~seconds–minutes). Keyword hits are instant; semantic lags.
- **`sourceArtifactId` came back null on an atom write** → the `sourceArtifact`
  publicId was wrong or the write failed. Re-check the PID and retry.
- **Sync wants to delete a source you still want** → it's not `include=yes` in
  `seed-set.csv`. Flip it and re-sync.
- **Brain create says "Internal server error"** → it already exists; `ensure` checks
  first and treats this as a no-op.
- **Inspect a run** → before `finalize`, `.work/` holds `current.txt` (resolved
  seed-set), `atomize.tsv`, `state.json`.

---

## 11. Scope & deferred (v2)

In scope (v1): the **Doctrine** zone only — durable positions, single-identity,
manual `/brain-sync`, markdown sources.

Deferred:
- **Signals + Output zones** and the `consolidate` ritual (`rip brain consolidate` —
  promote / fuse / supersede on a cadence) — the live marketing motion.
- **Scheduling** `/brain-sync` (cron) once atomization quality is trusted.
- **Non-markdown sources** (PDF/CSV) — need conversion first.
- **A separate marketing-brain workspace** that links this canonical brain as a folder.
- **Bootloader-izing** the commands (fetch logic from a Tokenrip asset at runtime).
