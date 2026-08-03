---
name: publish
description: "Publish a vault document to Tokenrip and store the artifact ID in frontmatter. Detects existing tokenrip_id → update; no ID → initial publish + write ID back."
argument-hint: "<file-path> [--alias <slug>] [--folder <folder>] [--type markdown|html|text]"
---

# Publish to Tokenrip

Smart publish primitive — works for any vault document (not just blog posts).

Detects whether a `tokenrip_id` already exists in frontmatter and branches accordingly:
- **Exists** → `rip artifact update` (new version of the existing artifact)
- **Missing** → `rip artifact publish` (initial publish), then writes the returned ID back into frontmatter

## Usage

```
/publish <file-path>
/publish <file-path> --alias my-slug
/publish <file-path> --alias my-slug --folder blog
/publish <file-path> --type html
```

Arguments:
- `<file-path>` — required; path relative to vault root (or absolute)
- `--alias` — optional; human-readable alias for the artifact URL
- `--folder` — optional; Tokenrip folder slug to file it into
- `--type` — optional; content type (default: `markdown`)

## Steps

### 1. Read the file

Read `<file-path>` in full. Parse the YAML frontmatter block (between the opening and closing `---` delimiters).

### 2. Branch on `tokenrip_id`

---

#### Path A — `tokenrip_id` exists in frontmatter (UPDATE)

Run:
```bash
rip --json artifact update <tokenrip_id> <file-path> --type <type>
```

Where `<type>` is the `--type` arg if provided, else `markdown`.

No frontmatter change needed — ID is already stored.

---

#### Path B — no `tokenrip_id` (INITIAL PUBLISH)

**Resolve the alias** (in priority order):
1. `--alias` argument if provided
2. `slug` field in frontmatter
3. Filename stem: strip extension, replace spaces with hyphens, lowercase

**Resolve the title** (in priority order):
1. `title` field in frontmatter
2. Filename stem (human-readable, spaces OK)

**Build and run the publish command:**
```bash
rip --json artifact publish <file-path> \
  --type <type> \
  --alias <alias> \
  --title "<title>" \
  [--folder <folder>]
```

**Parse the artifact ID** from the JSON output — it will be in the `id` field (a UUID like `5f187f3f-7571-470c-8790-f55b271b68ef`).

**Write the ID back into frontmatter** — insert `tokenrip_id: <uuid>` as the last field before the closing `---` of the frontmatter block.

Example: if the frontmatter ends with:
```yaml
meta_description: "Some description"
---
```
Edit it to:
```yaml
meta_description: "Some description"
tokenrip_id: 5f187f3f-7571-470c-8790-f55b271b68ef
---
```

If the file has no frontmatter at all, prepend a minimal block:
```yaml
---
tokenrip_id: 5f187f3f-7571-470c-8790-f55b271b68ef
---
```

---

### 3. Confirm

Output:
```
Published → https://tokenrip.com/s/<uuid>
```

## Notes

- `rip --json` at the top-level flag position gives machine-readable JSON output for all commands — use it so the UUID can be reliably extracted from stdout without parsing human-readable text.
- `--team tokenrip` is NOT passed by default; add it explicitly as a `--team` arg if the artifact should be team-shared.
- The `/blog-post` skill has its own publish flow — do not replace it with this skill unless asked. This skill is for ad-hoc and non-blog publishing.
