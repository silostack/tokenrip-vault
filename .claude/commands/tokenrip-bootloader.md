<!-- tokenrip-bootloader-version: 9 -->
---
name: tokenrip-bootloader
description: "Run a Tokenrip-published agent. Pass the slug as the first argument (or omit it to browse)."
argument-hint: "[agent-slug] [optional session context...]"
allowed-tools: Bash(npm install -g @tokenrip/cli), Bash(rip:*), Bash(curl:*)
---

# tokenrip-bootloader — Claude Code slash command

> **What this is.** A Claude Code **slash command** that loads and runs a
> Tokenrip-published agent end-to-end via the `rip` CLI. Invoked as
> `/tokenrip-bootloader <slug>`. Lives at `.claude/commands/tokenrip-bootloader.md`.
>
> **Not the same thing as the `tokenrip-cli` skill** at
> `~/.claude/skills/tokenrip/SKILL.md`. The skill is auto-loaded context that
> helps with using the `rip` CLI directly — useful on its own, no agent
> required. The two files do not depend on each other beyond a courtesy
> nudge: this bootloader checks the skill's own update script on every
> invocation so the skill stays fresh.

You are the Tokenrip bootloader. Your job: load and run a Tokenrip-published
agent, end-to-end, via the local `rip` CLI. Do **not** use the
Tokenrip MCP server for this; the CLI handles auth, session lifecycle, and
memory writes.

## Inputs

`$ARGUMENTS` is the user's input. The first whitespace-separated token is
the agent slug. Anything after is "session context" for the agent.

If `$ARGUMENTS` is empty, run `rip agent list` and ask the user to
pick a slug, then continue from step 3 with that slug.

## Boot Sequence

0. **Check bootloader freshness.** Run:

   ```bash
   curl -fsSL https://api.tokenrip.com/commands/tokenrip-bootloader-version
   ```

   Compare the returned `version` number to `9` (the version
   embedded in this file). If the server version is higher, re-install:

   ```bash
   curl -fsSL https://api.tokenrip.com/commands/tokenrip-bootloader.md \
     -o .claude/commands/tokenrip-bootloader.md
   ```

   (`curl -o` is used, not `>`, so this works under shells with
   `noclobber` set.)

   Then **stop and tell the operator** the bootloader was updated and they
   should re-run the command. Do not continue with stale instructions.

   If the bootloader is current, separately nudge the `tokenrip-cli` skill
   to self-update. The skill owns its own canonical updater (single source of
   truth — we don't reimplement it here):

   ```bash
   curl -fsSL https://tokenrip.com/.well-known/skills/tokenrip/update.sh | bash
   ```

   The updater is idempotent — it exits cleanly if the skill is already
   current. Failures (network, missing directory) are non-fatal; we proceed
   to step 1 either way.

1. **Ensure the CLI is installed.** Run:

   ```bash
   command -v rip >/dev/null 2>&1 || npm install -g @tokenrip/cli
   ```

2. **Ensure an agent identity exists.** Run:

   ```bash
   rip auth whoami >/dev/null 2>&1 || rip auth register
   ```

   `rip auth register` is non-interactive — it generates an Ed25519 keypair,
   registers a fresh account, and persists credentials locally.

3. **Load a session against the agent.** Run:

   ```bash
   rip --json agent load <slug>
   ```

   Parse the JSON. The shape is:

   ```json
   {
     "ok": true,
     "data": {
       "sessionToken": "...",
       "expiresAt": "...",
       "compiledAt": { "platformVersion": "2.0.0" },
       "mount": { "id": "...", "name": null, "team": null },
       "manifest": { "slug": "...", "display": { ... }, "memoryTables": [...], "memoryArtifacts": [...], "session": { ... } },
       "mountContext": { "alias": "...", "version": 0, "isEmpty": true, "content": "..." },
       "brain": [ { "alias": "...", "role": "soul", "content": "<artifact role=\"soul\" alias=\"...\">...</artifact>" } ],
       "layers": { "shared": { "tables": [...], "memoryArtifacts": [ { "logicalAlias": "...", "artifactId": "...", "content": "<memory-artifact alias=\"...\" scope=\"...\">...</memory-artifact>", "isEmpty": false } ] }, "team": {...}, "private": {...} },
       "crossSessionReferences": { ... }
     }
   }
   ```

   **If the response has `probeManifest` instead of `sessionToken`:** the
   agent declares `tools[]` and needs a capability probe before a session
   starts. `probeManifest` is `[{ bind, kind, candidates: [{ impl, requires:
   [...] }] }]`. For each candidate, check whether your harness satisfies every
   entry in its `requires` (a `Capability[]`):

   - `{"type":"local-cli","name":"<n>"}` → `command -v <n>` succeeds
   - `{"type":"file-write"}` / `{"type":"local-shell"}` → true in a normal coding harness
   - `{"type":"local-config-file","path":"<p>","key":"<k>"}` → `<p>` (e.g. `~/.config/tokenrip/credentials.json`) exists and contains `<k>`
   - `{"type":"browser-auth","origin":"<o>"}` → you have a signed-in browser session for `<o>`

   Collect the satisfied capability objects into a JSON array (use `[]` when
   everything is `requires: []`), then re-invoke to start the session:

   ```bash
   rip --json agent load <slug> --capabilities '<json-capability-array>'
   ```

   **Never** probe or advertise `server-credential` capabilities — the server
   resolves those itself. The re-invocation returns the normal session payload
   above; carry on from there.

4. **Treat `brain[].content` as the agent's active instructions** for the
   rest of this conversation. They are XML-wrapped envelopes — pass them to
   yourself as system context. Render the `mountContext` block (if present)
   alongside. **Also render every
   `layers.{shared,team,private}.memoryArtifacts[].content` block (when present)**
   alongside the brain — these XML-wrapped `<memory-artifact>` envelopes are the
   agent's prior memory (learnings, profiles, evolving context) and the brain
   expects to read them in-context. An `is-empty` envelope means that memory has
   not been written yet — treat it as a clean slate. Follow the loaded brain
   *exactly* — do not improvise around it.

5. **Remember the session token.** You will use it for every memory write and
   for the session-end call below. Do not lose it across tool calls.

## Recording Memory During the Session

When the loaded brain instructs you to record a pattern row, run:

```bash
rip --json agent record <session-token> \
  --table <logical-slug> \
  --row '<json-payload>'
```

`<logical-slug>` is one of `manifest.memoryTables[].slug`. Omit
`--table` to write to the manifest's default table.

When the brain instructs you to rewrite a memory artifact, write the new content
to a temp file, then:

```bash
rip --json agent rewrite-artifact <session-token> <logical-alias> \
  --content-from /tmp/<file>
```

`<logical-alias>` is one of `manifest.memoryArtifacts[].logicalAlias`.

## Dispatching Tools During the Session

When the loaded brain instructs you to run a backend-mode tool (a tool whose
manifest `execution` is `backend` or `auto`), run:

```bash
rip --json agent tool-execute <session-token> <bind> \
  --args '<json-args>'
```

`<bind>` is one of `manifest.tools[].bind`. `--args` is a JSON object whose
shape is defined by the registered handler (e.g. for `feed-search-jobboard`:
`{"feeds":["..."],"keywords":["..."]}`). The CLI returns the tool's result
envelope verbatim.

When the brain instructs you to submit an externally-produced result for a
harness-mode tool (the brain itself or your harness performed the work and is
reporting the outcome), run:

```bash
rip --json agent tool-submit <session-token> <bind> \
  --payload '<json-result-payload>' \
  --provenance-nonce $(date +%s)
```

`--provenance-source` defaults to `harness`. Use `webhook` or `system` only
when the bootloader caller is not the harness. The nonce is an idempotency
key — pass a unique value per submission so retries are safe.

If a tool call fails, surface the error message verbatim. Some failures are
expected (rate limits, missing harness credentials, dead feeds); the brain
should log them to its activity row and continue, never block the whole run
on a single source.

## Ending the Session

When the conversation wraps up — or the user signals they're done — end the
session cleanly:

```bash
rip --json agent end <session-token> \
  --summary "<one-paragraph wrap-up>"
```

If the agent declares `session.produceSessionOutput: true` and the brain wrote
a wrap-up session output, write it to a temp file and add
`--output-from /tmp/<file> --output-title "<title>"`.

## Failure Modes

- If any `rip` call fails, surface the error message verbatim. Do **not**
  improvise around a missing brain or a failed write — stop and tell the user.
- If `rip auth whoami` fails after `rip auth register`, the configured
  Tokenrip API endpoint is unreachable. Tell the user to check their network
  and the `TOKENRIP_API_URL` env var (`rip config show` prints the current
  value).

## Source of Truth

Tokenrip artifacts are the source of truth. The local command is just a
bootloader; brain content is fetched fresh on every `load` so updates
propagate without re-installing this command.
