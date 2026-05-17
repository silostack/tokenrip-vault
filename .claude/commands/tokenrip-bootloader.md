<!-- tokenrip-bootloader-version: 5 -->
---
name: tokenrip
description: "Run a Tokenrip-published agent. Pass the slug as the first argument (or omit it to browse)."
argument-hint: "[agent-slug] [optional session context...]"
allowed-tools: Bash(npm install -g @tokenrip/cli), Bash(rip:*), Bash(curl:*)
---

# Tokenrip — Generic Agent Bootloader

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
   curl -fsSL https://api.tokenrip.com/skills/tokenrip-bootloader-version
   ```

   Compare the returned `version` number to `5` (the version
   embedded in this file). If the server version is higher, re-install:

   ```bash
   curl -fsSL https://api.tokenrip.com/skills/tokenrip-bootloader.md > .claude/commands/tokenrip.md
   ```

   Then **stop and tell the operator** the bootloader was updated and they
   should re-run the command. Do not continue with stale instructions.

   If the bootloader is current, also silently update the tokenrip skill files
   if stale. Locate the skill directory by walking up from `$PWD`, then
   falling back to global locations:

   ```bash
   SKILL_DIR=""
   _D="$PWD"
   while [ "$_D" != "/" ] && [ -z "$SKILL_DIR" ]; do
     [ -d "${_D}/.claude/skills/tokenrip" ] && SKILL_DIR="${_D}/.claude/skills/tokenrip"
     _D="$(dirname "$_D")"
   done
   [ -z "$SKILL_DIR" ] && [ -d "${HOME}/.agents/skills/tokenrip" ] && SKILL_DIR="${HOME}/.agents/skills/tokenrip"
   [ -z "$SKILL_DIR" ] && [ -d "${HOME}/.claude/skills/tokenrip" ] && SKILL_DIR="${HOME}/.claude/skills/tokenrip"

   if [ -n "$SKILL_DIR" ]; then
     CURRENT_SKILL_VER=$(grep -m1 'tokenrip-skill-version:' "$SKILL_DIR/SKILL.md" 2>/dev/null | grep -o '[0-9][0-9.]*')
     REMOTE_SKILL_VER=$(curl -fsSL "https://tokenrip.com/.well-known/skills/tokenrip/manifest.json" 2>/dev/null | grep -o '"version":"[^"]*"' | head -1 | cut -d'"' -f4)
     if [ -n "$REMOTE_SKILL_VER" ] && [ "$REMOTE_SKILL_VER" != "$CURRENT_SKILL_VER" ]; then
       rip update
       BASE="https://tokenrip.com/.well-known/skills/tokenrip"
       curl -fsSL "$BASE/SKILL.md" -o "$SKILL_DIR/SKILL.md"
       mkdir -p "$SKILL_DIR/references"
       for ref in setup-and-identity agent-architecture output-and-provenance; do
         curl -fsSL "$BASE/references/${ref}.md" -o "$SKILL_DIR/references/${ref}.md" 2>/dev/null
       done
     fi
   fi
   ```

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
       "manifest": { "slug": "...", "display": { ... }, "memoryCollections": [...], "memoryArtifacts": [...], "session": { ... } },
       "mountContext": { "alias": "...", "version": 0, "isEmpty": true, "content": "..." },
       "brain": [ { "alias": "...", "role": "soul", "content": "<artifact role=\"soul\" alias=\"...\">...</artifact>" } ],
       "layers": { "shared": {...}, "team": {...}, "private": {...} },
       "crossSessionReferences": { ... }
     }
   }
   ```

4. **Treat `brain[].content` as the agent's active instructions** for the
   rest of this conversation. They are XML-wrapped envelopes — pass them to
   yourself as system context. Render the `mountContext` block (if present)
   alongside. Follow the loaded brain *exactly* — do not improvise around it.

5. **Remember the session token.** You will use it for every memory write and
   for the session-end call below. Do not lose it across tool calls.

## Recording Memory During the Session

When the loaded brain instructs you to record a pattern row, run:

```bash
rip --json agent record <session-token> \
  --collection <logical-slug> \
  --row '<json-payload>'
```

`<logical-slug>` is one of `manifest.memoryCollections[].slug`. Omit
`--collection` to write to the manifest's default collection.

When the brain instructs you to rewrite a memory artifact, write the new content
to a temp file, then:

```bash
rip --json agent rewrite-artifact <session-token> <logical-alias> \
  --content-from /tmp/<file>
```

`<logical-alias>` is one of `manifest.memoryArtifacts[].logicalAlias`.

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
