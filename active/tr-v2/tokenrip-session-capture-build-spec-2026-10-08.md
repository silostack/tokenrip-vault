---
title: "Session Capture v1 — Build Spec: Why on Every Call, Inferred Sessions, Call Stream and Replay"
status: design input for a build session; not yet implemented
created: 2026-10-08
owner: Simon
companion: active/tr-rework/tokenrip-why-on-every-call-canonical-2026-10-08.md (the reasoning; read it first if any decision below seems arbitrary)
supersedes in part: active/tokenrip-workspaces-prd-2026-09-14.md §Sessions (declared load/save lifecycle)
---

# Session Capture v1: Build Spec

## 0. How to read this

This document is self-contained for a build session. §1 states the goals and the constraints that produced them. §2 gives the context a builder needs from the existing product. §3 lists the design decisions with their reasons. §4 onward is the specification: data model, API changes, session inference, transport adapters, the instruction document, telemetry and replay, the test plan, acceptance criteria, and what is deliberately deferred. Nothing here requires a model call on the request path.

## 1. Goals, constraints, and non-goals

### 1.1 The problem

Tokenrip workspaces record what changed (the mechanical log) but not why. A member's agent can edit one row in a price sheet after two hours of pricing discussion, and the workspace keeps the row and loses the two hours. The current design asks the agent to narrate at an explicit `save`; that is a ceremony, ceremonies get skipped, and the CLI (the transport most agents prefer) has no natural end-of-session event to hang it on.

Alek's three requests, which are the user-side statement of the goal:

1. All sessions written into the workspace so other sessions and other agents can reference them.
2. Workflow logging: how a lead run was done, tagged, so his Claude can see how his Codex did it.
3. Durable facts learned in one host (what he had for dinner, where he is working) available in another.

### 1.2 Goals for v1

- **G1.** Every write to a workspace carries a one-sentence statement of the user's goal (the *why*), supplied by the model that made the call, across MCP, CLI, and raw API.
- **G2.** No start-session or end-session command exists on the client. Sessions are derived on the server.
- **G3.** Every session produces a readable narrative with no model call: a deterministic render of the session's threads and writes.
- **G4.** Every call is stored in full (request, response, context) so sessions can be replayed and model/harness behavior measured per instruction version.
- **G5.** Zero added latency on the request path. No inference on any request.

### 1.3 Hard constraints

- **Compute stays with the member's agent.** Tokenrip never runs a model on the request path (v2 master §4.3, decision). An async job off-path is permitted but not required in v1.
- **Transport neutrality.** The mechanism must work identically over MCP (`https://api.tokenrip.com/mcp`), the CLI (`npx skills add tokenrip/cli`, `rip auth login`; one process per invocation), and raw HTTP. The invariant lives in the API; transports are adapters.
- **No new ceremony for the human.** Any step that a person must remember to do is a failure.
- **No escape value for why.** `why: "unknown"` or equivalent is not an allowed value.

### 1.4 Non-goals for v1

- The LLM fold (async narrative compression). v1.1.
- Pattern detection across sessions (the "save as procedure" offer). Later.
- Branches / interleaved-session separation. Parked; designed so it slots in.
- Capturing sessions with zero reads and zero writes (load then chat). Harness-specific hooks later.
- `recall(why)` as a full retrieval primitive. v1 ships a minimal version (see §5.4).
- MCP `sampling`. Test support only; do not depend on it.

## 2. Context the builder needs

### 2.1 What exists (per the 09-14 PRD and the live product)

- Principals: any actor with permissions; person, agent, or app. A kind is already stored.
- Workspaces with members, tiers (private / internal / shared), items (documents, records), and four standard files at fixed names: `INDEX.md`, `STATUS.md`, a log record, a queue record.
- The log record is append-only with two entry kinds: **mechanical** (system-written on every write: created, updated, imported, exported, shared, joined, claimed, done; carries actor, harness, session, item, version, scope) and **narrative** (agent-written: session, decision, learning, received).
- Tools: `load`, `save`, `list`, `read`, `write`, `import`, `export`, `snapshot`, `share`, `log`, `queue`, `focus`, `members`. Every write takes a session token; `load` opens the session and returns the boot payload (index, status, log since the member's cursor, open queue items, the instructions block).
- Sessions: declared. `load` opens, `save` closes with a narrative, auto-close after six idle hours with no narrative.
- Transports: MCP server; CLI (`rip`) that calls the API; raw API. Agents in Claude Code, Codex, Cowork, ChatGPT Work, Instinct; browser view for members with no agent.

### 2.2 What this spec changes

| Before (09-14 PRD) | After (this spec) |
|---|---|
| Session opened by `load`, closed by `save` or 6h auto-close | Session inferred server-side from the call stream; `load` and `save` no longer open or close anything |
| Every write carries a session token | Every call carries auth + harness; the server assigns the session |
| Narrative written by the agent at `save` | Narrative rendered by the server from the session's whys and mechanical trail; `save` remains as an optional richer summary |
| No per-call intent | Every call may carry `why`; required on the first write of a why-less session; inherited when omitted |
| Calls are logged as mechanical entries only | Every call is stored in full for replay (§7) |

## 3. Design decisions and reasons

| # | Decision | Reason |
|---|---|---|
| D1 | `why` is a request field on every read and write, described in the schema | The model at call time has full conversation context; the response channel is unreliable as an instruction surface and getting less reliable |
| D2 | The instruction to fill `why` lives in whatever the model must read to make the call (MCP schema + server instructions; CLI skill + `--help`; `llms.txt`) | This is the only channel that is reliable by construction across transports: a model cannot call a tool whose shape it has not read |
| D3 | `why` is required only on the first write of a session that has no why yet; optional afterward; omission inherits | Enforcement everywhere breeds boilerplate; enforcement nowhere fails on the CLI when the skill falls out of context. One gate at the session head plus error-driven retry covers both |
| D4 | Sessions are inferred: cluster of calls by (principal, harness, workspace) separated by an idle gap | The CLI is one process per call and cannot carry session state without a file; server inference is transport-neutral and removes start/end as client concepts |
| D5 | The session keeps `current_why`; a call without why inherits it and is flagged inherited | Zero-cost (a row lookup already on the path). Turns omission into "same thread" |
| D6 | Session narrative is a deterministic render of why-runs + mechanical entries; no model | Readable without inference; the fold is a later compression |
| D7 | Non-model principals (kind app/reflex/script) are exempt from `why`; their why is their name | The only case where a why is genuinely unavailable |
| D8 | Write responses echo the recorded why | Cheap use of the dynamic channel for confirmation; lets the model self-correct a stale inherited why |
| D9 | Every call is stored in full with the instruction version in force | Replay and per-harness measurement; the instruction text becomes tunable |
| D10 | One instruction document, versioned, rendered to MCP instructions, SKILL.md, and `llms.txt` | Single source; version stamps make behavior attributable to text changes |
| D11 | Content/shape line: workspace content is the customer's; call-shape metrics are Tokenrip's and may be aggregated across customers | Privacy and trust; decided now so it never needs retrofitting |

## 4. Data model

### 4.1 Call record (new; one row per API call)

| Field | Type | Notes |
|---|---|---|
| `id` | id | |
| `at` | timestamp | Server receive time |
| `principal_id` | id | From auth |
| `principal_kind` | enum | person, agent, app, reflex (existing kinds; add `reflex`/`script` if absent) |
| `workspace_id` | id | Null for workspace-less calls |
| `harness` | text | See §6 for detection per transport; `unknown` is allowed and must be honest |
| `harness_version` | text | Nullable |
| `model` | text | Nullable; only if the transport exposes it |
| `transport` | enum | mcp, cli, api |
| `client_version` | text | CLI version or MCP client version |
| `instruction_version` | text | The version string of the instruction document the client was operating under (§6.4); nullable if the client predates versioning |
| `tool` | text | load, read, write, import, … |
| `params` | json | Full request params, minus auth |
| `why` | text | Nullable |
| `why_source` | enum | supplied, inherited, principal (D7), none |
| `session_id` | id | Assigned by the session inference (§5.2); may be assigned on insert |
| `response` | json | The full body returned, including any echo or error |
| `status` | int | HTTP status or MCP error code |
| `latency_ms` | int | |

Retention: indefinite in v1. Workspace deletion deletes the workspace's call records' `params`, `why`, and `response` (content) but may retain shape fields (D11); confirm this with the privacy story before shipping.

### 4.2 Session (new or replacing the existing session object)

| Field | Type | Notes |
|---|---|---|
| `id` | id | |
| `principal_id`, `harness`, `workspace_id` | | The clustering key |
| `started_at`, `last_call_at`, `ended_at` | timestamp | `ended_at` set when the idle gap elapses |
| `current_why` | text | Last supplied why; null until the first supplied why |
| `thread_count` | int | Number of distinct-why runs (§5.3) |
| `call_count`, `write_count` | int | |
| `narrative_entry_id` | id | The log entry written at session end (§5.5) |
| `instruction_version` | text | Version in force at session start |

### 4.3 Log record (existing; additions)

- Mechanical entries gain `why` and `why_source`, copied from the call.
- Narrative entries gain `author`: `agent` (written via `save`/`log`) or `system` (rendered by §5.5). The view distinguishes them.

## 5. API changes

### 5.1 `why` on every tool

Add `why: string` to `read`, `write`, `import`, `export`, `snapshot`, `share`, `queue`, `log`, `focus`, and `load`. Schema description text (identical across transports; see §6.4 for the full instruction document):

> `why` — One sentence: what the user is trying to accomplish right now, in their terms, not a description of this edit. Supply it when the user's goal changes. Omit it to continue the current thread. If you do not know the goal, say what the user asked for.

### 5.2 Enforcement

On any **write-class** call (`write`, `import`, `share`, `snapshot`, `queue` add/complete, `log` narrative append) from a **model principal** (kind person or agent) where the inferred session has `current_why == null` and the call has no `why`:

- Reject: HTTP 400 / MCP tool error / CLI non-zero exit.
- Error body (one string, identical across transports):

  > `why required: this is the first write of a session. Add why="<one sentence: what the user is trying to accomplish, in their terms>". It is optional on later calls; omit it to continue the same thread.`

Reads never reject. Non-model principals never reject (their `why_source` is `principal`, their why is the principal's name).

### 5.3 Inheritance and threads

- On every call, if `why` is absent: set `why` = session `current_why` (may be null for reads before any why), `why_source = inherited`.
- If `why` is present: set session `current_why = why`, `why_source = supplied`; increment `thread_count` if the supplied why differs from the previous `current_why` (exact string compare in v1; see §9 for the similarity fallback).
- A thread is a maximal run of consecutive calls in a session with the same `current_why`.

### 5.4 `load` and the minimal `recall`

- `load(workspace, why?)` no longer opens a session. It returns the boot payload as today plus the `instruction_version`. If `why` is supplied it sets `current_why` on the inferred session.
- v1 minimal recall: when `load` receives a `why`, the boot payload's "log since cursor" section is **reordered**, not filtered: system narrative entries whose thread whys share tokens with the load why are listed first. No embeddings, no model. This is a placeholder so the read side exists; the real `recall(why)` is designed against the week-one data.

### 5.5 Session end and the deterministic narrative

When a session's idle gap elapses (§5.6), a job:

1. Sets `ended_at`.
2. Renders one narrative log entry, `type = session`, `author = system`, scope = the member's default tier, in this shape:

   ```
   Session · {member} · {harness} · {duration} · {thread_count} threads
   1. {why of thread 1} — {n} writes: {item}@{version}, {item}@{version}; {n} reads
   2. {why of thread 2} — {n} imports ({rows} rows into {record}); …
   …
   Status patch: none | applied by agent at {time}
   ```

   Threads with reads only are listed with "(reads only)". A session with no writes and no whys renders as one line: `Session · {member} · {harness} · {duration} · reads only, no stated goal`.
3. If the agent called `save` during the session, the agent's narrative is kept as a separate entry (`author = agent`) and the system entry links to it.

### 5.6 Session inference

- Key: `(principal_id, harness, workspace_id)`.
- On each call: find the open session for the key with `last_call_at` within `IDLE_GAP`; if none, create one. Update `last_call_at`.
- `IDLE_GAP` default **45 minutes**, configurable per deployment. The PRD's six hours was for declared sessions; the replay data in week one should set this (look at the distribution of inter-call gaps per harness and pick the valley).
- Harness `unknown` is its own key value; it will over-merge and that is acceptable in v1.
- End-of-session job runs on a schedule (every 5 minutes is fine) over sessions with `ended_at == null` and `last_call_at < now - IDLE_GAP`.

### 5.7 Response echo (D8)

Every write response includes, as a top-level field the model will read:

```
"recorded_under": "<current_why>"
```

In the CLI this prints as one trailing line: `recorded under: <current_why>`. In MCP it is part of the tool result text. Reads do not echo.

## 6. Transport adapters

### 6.1 MCP

- Add `why` to every tool's input schema with the description in §5.1.
- Populate the `instructions` field of the `initialize` result with the rendered instruction document (§6.4) and its version.
- Capture `clientInfo.name` and `clientInfo.version` from `initialize` as `harness` / `harness_version`. Map known names (e.g., Claude Code, Codex, Cursor, Cowork) to canonical harness labels; store the raw name too.
- Side test (one day): confirm each target harness injects server `instructions` into the model's context; confirm whether any supports `sampling/createMessage`.

### 6.2 CLI (`rip`)

- Add `--why "<text>"` to every command that calls a tool. Also accept `RIP_WHY` from the environment for scripted loops that set one why for a batch.
- Harness detection: read the environment for known markers (Claude Code sets `CLAUDECODE`; verify the markers for Codex, Cursor, Cowork, and others in week one and record what was found). Fall back to `--harness` / `rip config set harness`. Send `unknown` when nothing is found; never guess.
- Send the CLI version and the installed skill's `instruction_version` (read from the skill file or a config value written at `npx skills add`) on every call.
- `--help` for every command includes the `why` description. The enforcement error (§5.2) prints verbatim.
- Print `recorded under: …` after every successful write.
- Update `SKILL.md` to the rendered instruction document (§6.4).

### 6.3 Raw API

- `why` as a body field on every endpoint; also accepted as the header `X-Tokenrip-Why` for clients that cannot change bodies easily. Body wins if both are present.
- `X-Tokenrip-Harness`, `X-Tokenrip-Instruction-Version` headers, optional.
- `llms.txt` and the API reference carry the instruction document.

### 6.4 The instruction document (single source, versioned)

One markdown file in the Tokenrip repo, rendered at build time into: MCP `instructions` text, `SKILL.md`, and the `llms.txt` section. Carries `instruction_version` (semver or date). Draft v0.1:

> **Working in a Tokenrip workspace**
>
> Tokenrip keeps a shared, versioned record of a project. Other people's agents, on other tools, will read what you write here. Three rules.
>
> 1. **State the goal.** Every call accepts `why`: one sentence saying what the user is trying to accomplish right now, in their terms. Supply it when the user's goal changes. Omit it to continue the current thread. If you do not know the goal, say what the user asked for. The first write in a session requires it.
> 2. **Describe the user's goal, not your edit.** "Exploring enterprise price points for the Q4 proposal" is a why. "Updating row 3" is not.
> 3. **Record durable facts about the user when you learn them.** Location, preferences, decisions, and things they did go into the workspace as a log entry so another tool can use them.
>
> Call `load` first; it returns the workspace's own instructions, status, and what changed since you were last here. There is no save command you must remember; the session records itself.

Every change to this text is a new version. Changes are evaluated by the metrics in §7.3.

## 7. Telemetry and replay

### 7.1 Storage

Every call is written to the call record (§4.1) synchronously, in the same transaction as the mechanical log entry where one exists. If this measurably adds latency, write asynchronously from a queue; the ordering key is `(session_id, at)`.

### 7.2 Replay view (minimal)

An internal page or CLI command: `rip admin replay <session_id>` renders the session as a transcript: for each call, time, tool, why (with source), params summarized, and the response as the model saw it. This is a read-only review tool. The lever for changing behavior is the instruction document, not the replay.

### 7.3 Metrics (per harness × instruction version × transport)

- **Why fill rate**: supplied / (supplied + inherited + none) on write-class calls.
- **Head-gate hit rate**: fraction of sessions whose first write was rejected for missing why; and retry success rate after rejection.
- **Distinct-why runs per session** (thread count distribution). If ~1 or ~N everywhere, segmentation is harness habit, not goal shifts (§9).
- **Why quality** (manual, week one): sample 30 whys per harness; label goal vs. operation.
- **Inter-call gap distribution**: for setting `IDLE_GAP`.
- **Sessions with load and no writes**: the size of the zero-call leak.
- **Narrative read rate**: does any later `load` boot payload include a system session entry that a subsequent call references? (Proxy for "did anyone read it.")

### 7.4 The content/shape line (D11)

Aggregations across workspaces or customers may use: harness, transport, instruction version, tool, timing, status, `why_source`, counts, and lengths. They may not use `why` text, `params`, or `response` content. Enforce this in the metrics layer, not by policy alone.

## 8. Test plan (week one)

**Setup (day 0):** ship §5.1, §5.2, §5.3, §5.6, §5.7, §6.1, §6.2, §6.4 v0.1, §7.1. The deterministic narrative (§5.5) can land mid-week; the call store is what matters from day one.

**Workspaces:** the Providence pilot workspace and the Tokenrip team workspace.

**Harnesses:** Claude Code (CLI and MCP), Codex (CLI), Cowork (MCP). Instinct if its connector is live.

**De-confound:** one person, one task, two harnesses, same week. Simon runs one Providence batch cycle in Claude Code on one day and the same cycle in Codex on another. These two sessions are the only pair where a behavior difference is attributable to the harness rather than the person.

**Side tests (one day each):**
- Does each harness inject MCP server `instructions`? (Ask the model what its instructions say about `why`.)
- Does any harness support `sampling`?
- What environment markers does each harness set for the CLI?

**Read at end of week:** fill rate, head-gate hit and retry, thread-count distribution, a 30-why quality sample per harness, inter-call gaps, zero-call session count, and whether Alek can read a system session narrative cold and say what happened.

**Decision tree:**
- Fill rate on write-class calls ≥ 80% on the static channels → proceed to the v1.1 fold and the real `recall(why)`.
- Fill rate < 50% on any harness → the instruction text is the lever; ship v0.2 and re-measure before building anything else.
- Thread counts bimodal (~1 or ~N) → implement adjacent-why dedupe by similarity (§9) before trusting segmentation in the render.
- Codex ignores server `instructions` → the CLI skill is the only channel for that harness; weight the skill text accordingly.
- Whys are mostly operations, not goals → add the goal-vs-operation check to the enforcement error and re-measure.

## 9. Known risks and their mitigations

| Risk | Mitigation in v1 | If it bites |
|---|---|---|
| Bimodal fill (harness fills every call or never) | Measure thread counts | Adjacent dedupe: embed consecutive supplied whys, merge if cosine > threshold; still no LLM |
| Stale inherited why across a topic change | Idle gap resets; response echo lets the model correct | Shorten `IDLE_GAP`; add "the thread changed?" nudge to the echo after N inherited writes |
| Lazy why to satisfy the gate | Inheritance removes per-call pressure; instruction rule 2 | Reject whys that match the operation vocabulary (update, edit, add row) and lack a goal noun; state it in the error |
| Harness/user collinearity in the data | One-person-two-harness pair | Recruit a third person on a second harness |
| Zero-call sessions | Instruction rule 3; count them | Claude Code Stop hook writes a session note; others when hosts expose an end event |
| Interleaved sessions (two terminals, one key) | Accept the merge | Branches: a named why the client can pin (`--branch`), same primitive, later |
| Call store latency | Same transaction as the log entry | Async queue keyed by session |

## 10. Acceptance criteria

- **A1.** A write from a model principal with no why in a why-less session is rejected with the §5.2 error on MCP, CLI, and API; a retry with `why` succeeds.
- **A2.** A write with no why in a session that has one succeeds, is stored with `why_source = inherited`, and the response carries `recorded_under`.
- **A3.** A reflex or script principal writes with no why and is never rejected; `why_source = principal`.
- **A4.** Two calls 10 minutes apart from the same key land in one session; two calls `IDLE_GAP + 1` apart land in two.
- **A5.** A session with three supplied whys renders a system narrative entry with three numbered threads and correct write counts, with no model call.
- **A6.** `rip admin replay <id>` reproduces every call's why, params, and response in order.
- **A7.** The metrics in §7.3 are computable per (harness, instruction version, transport) from the call store alone.
- **A8.** The instruction document renders to all three surfaces from one source with one version string, and the version arrives in the call record from all three transports.

## 11. Deferred, with the trigger that unparks each

- **The fold (v1.1):** one async model call at session end compressing the deterministic render. Unparks if Alek cannot read the deterministic narrative cold.
- **`recall(why)` as a real primitive:** retrieval of narrative entries, runbooks, and status sections by stated intent. Unparks after week-one data shows what gets reread.
- **Procedure extraction:** detect repeated why-sequences across sessions and offer "save as procedure." Unparks after ≥ 3 sessions with a similar shape exist for one member. This is Alek's second ask and the consolidate step.
- **Branches:** named whys a client can pin to separate interleaved work. Unparks when the merge of interleaved sessions produces a narrative someone complains about.
- **Zero-call capture via harness hooks:** Claude Code Stop hook first. Unparks when the zero-call session count is material.
- **`sampling`:** only if the side test shows wide support.

## 12. Open questions for the build session

1. Does the existing session token survive as an internal id only, or is it removed from the client contract entirely in the same change?
2. Where does the instruction document live and how is the version stamped into the published skill at `npx skills add` time?
3. Is the call store a new table in the primary database or a separate append-only store? Replay and metrics need ordered reads by session; nothing needs joins at write time.
4. Which workspace tier does a system-rendered session narrative inherit when a session touched both internal and shared items? (Proposal: the member's default tier; the view shows the per-thread items' scopes.)
5. Should reads from a session with `current_why == null` get a soft nudge in the response ("no goal recorded for this session yet") or stay silent? (Proposal: silent; the first write will gate.)
