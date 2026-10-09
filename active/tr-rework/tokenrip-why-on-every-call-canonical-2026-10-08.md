---
title: "Why on Every Call — The Canonical Synthesis: How Sessions Capture Themselves, Why the Ceremony Moves to the Model, and What the Call Stream Becomes"
status: canonical draft v1 — single Bean session 2026-10-08
created: 2026-10-08
updated: 2026-10-08
owner: Simon
companion: active/tr-rework/tokenrip-session-capture-build-spec-2026-10-08.md (the engineering document for the build session)
related:
  - active/tr-rework/tokenrip-shared-memory-canonical-fable-2026-06-11.md (the write-side friction killer; acceptance test 2; read-side provenance; the why-graph)
  - active/tr-rework/tokenrip-v2-master-2026-09-22.md (sessions, standard files, compute-with-the-member, the two doors)
  - active/tokenrip-workspaces-prd-2026-09-14.md (the current load/save session model this supersedes in part)
  - agents/bean/ideas/why-on-every-call.md
suggested_home: product/tokenrip/
note: >
  Three claims in this document were derived independently by Alek (from use) and by
  earlier Bean sessions (from architecture) without either having read the other.
  Marked ⊕ below. By the re-derivation principle these are the most-validated claims here.
---

# Why on Every Call: The Canonical Synthesis

> **The throughline:** the hard problem of session capture was never the write; it is the context behind the write. One row edit can sit on top of two hours of pricing strategy, and the write carries none of it. The only party that holds that context is the model, at the moment it makes the call. So the *why* rides on the call — every call, every transport — and the filing ceremony that killed every knowledge-management system moves from the human (who skips it) to the model (which fills a described parameter at near-100%). Sessions are inferred on the server, not declared by the client. Omitting the why means "same thread." Enforcement happens once, at the head of a session, and never on the request path. Every call is stored, so sessions can be replayed and the instruction text Tokenrip ships to other people's models becomes a prompt with a measurable conversion rate. One capture, two consumers: the customer's memory and Tokenrip's only observability into the harness.

---

## Executive summary

1. **The cut was wrong.** Session vs. log, distinguished by the size of the write, misses the case that matters: a tiny write on top of a huge conversation. Write size and context size are uncorrelated. The real distinction is whether the call carries its why.
2. **Relocate the ceremony from the human to the model.** Git discipline failed for knowledge work because humans had to write the commit message. Models follow tool schemas. Friction at the protocol level is free; friction at the human level is fatal. Every design choice below is this one asymmetry applied.
3. **Why on the request, not in the response.** Every read and write takes a `why` field, described in the schema. The dynamic channel (tool results, stdout, response bodies) is for confirmation and state-dependent nudges only; it is being trained *out* as an instruction surface by prompt-injection defenses.
4. **The invariant lives in the API; transports are adapters.** MCP, CLI, and raw API all deliver the same rule in whatever the model must read to make the call at all: tool schema and server instructions for MCP; the skill file and `--help` for CLI; `llms.txt` for the API. One instruction document, versioned, rendered three ways.
5. **Enforce once, inherit after.** A why is required only on the first write of a session that has none. After that, omission inherits the session's current why and is itself a signal: "same thread." This kills the lazy-why problem from the other direction and is the backstop for the CLI, where a skill read once at install falls out of context by write forty.
6. **Sessions are inferred, not declared.** A session is a server-side cluster of calls by (principal, harness, workspace) with an idle gap. No session file, no start/end command, nothing for a one-process-per-call CLI to carry. Start and end session are not automated; they are deleted as client concepts.
7. **Zero inference on the request path; zero inference in v1 at all.** The session narrative renders deterministically from runs of distinct whys plus the mechanical trail. An async fold is a v1.1 compression of something already readable.
8. **The genuine "no why" cases are a principal kind, not an escape value.** Reflexes, crons, scripts, and apps have no model in the loop; their why is their name. For model principals something is always known; "say what was asked" is a valid why. Never allow `why: unknown`; it becomes the default within a day.
9. **Store every call; replay sessions.** The stream is the customer's memory *and* the only observability Tokenrip has into the harness's side, since the conversation itself is never seen. Stamp every call with the instruction version in force, and the instruction text becomes tunable per harness. ⊕
10. **Draw the content/shape line now.** Content belongs to the workspace; shape (fill rates, call patterns, error recovery) belongs to Tokenrip and compounds across customers into a behavioral model of every major harness against shared, multi-party state. Nobody else sees all of them on one surface.

---

## I. What Alek asked for is the memory triad, and one ask is different in kind

Alek's three requests, verbatim from use rather than from architecture:

1. *"I want all my sessions written into the workspace so they can be referenced in other sessions and with other agents."*
2. *"Keep a log of how it's done. I do lead runs. I want it documented and tagged so my Claude can see how my Codex did it. Workflow logging, kind of like skills."*
3. *"I asked ChatGPT for dinner places yesterday; now I'm asking Instinct for lunch. The workspace should already know where I'm working and what I had."*

These are episodic, procedural, and semantic memory respectively; the vault's own pattern (*a complete organizational brain = episodic + semantic + procedural*, 2026-08-29) re-derived from the user side without reading it. ⊕

The second ask is the sharp one. June's magic demo was "the second tool knows a *fact*." Alek is asking for "the second tool knows a *method*." Methods are what people pay for, and a method is extractable from a sequence of writes with their whys attached: **skills are compiled sessions.** The log-to-runbook promotion is the consolidate step from the workspace-brain work, with a concrete input.

The third ask looks episodic but is different in kind: it is a session with **zero writes and zero reads**. Nothing in a write-time capture design can catch it. It needs a load-time instruction ("when you learn a durable fact about the user, record it") *and* it needs the harness to consult Tokenrip on a dinner question at all. That is not a capture problem; it is the question of whether Tokenrip can be the default memory of a host that has its own memory, and it is the exact land hosts will not cede (v2 risk 8). Alek's personal example is also the personal cut of the June magic demo ("my sister's vegan" → different tool → "I'll skip the steakhouse"), re-derived. ⊕

## II. The cut is wrong: write size says nothing about context size

The proposed distinction was session (big, narrated) vs. log (small, mechanical), by the size of the touch. Simon's own counterexample breaks it: a user explores enterprise pricing for two hours and the only workspace write is one row in a price sheet. The write is the tip; the conversation is the iceberg. The mechanical log already captures the tip perfectly (actor, harness, session, item, version, per the 09-14 PRD). The problem is only ever the iceberg, and iceberg size is uncorrelated with write size.

So the distinction that matters is: **does the write carry its why, or not.** Everything downstream is implementation.

## III. The move: relocate the ceremony from the human to the model

Knowledge management died on two unpaid-labor bills (June, §II): finding and filing. Filing died because capture was a separate act from the work, so humans skipped it. Git discipline is the same bill: the commit message is a separate act, and non-coders will not pay it.

The model will. A model given a tool schema with a described parameter fills it at near-100%. A model that hits an error reads the error and retries. A model that reads a skill file follows it. **Protocol-level friction costs nothing; human-level friction is fatal.** The whole design is this asymmetry applied: every ceremony the June document worried about (checkpoint at session end, summaries, metadata) is kept, and charged to the model instead of the person.

This also derives June's stigmergy requirement mechanically rather than rhetorically. Stigmergy works only when modifying the environment is the same act as doing the work; if publishing is a separate act, it is a filing system. With the why riding on the write, there is no separate act. Acceptance test 2 (zero-ceremony ingestion) gets its mechanism.

## IV. Three proposals that stop competing and stack

Simon's three candidate mechanisms were: (a) Tokenrip runs inference per session and generates the log; (b) an `AGENTS.md` convention every workspace carries, auto-maintained; (c) API responses carry model-directed instructions asking for context about what the user is doing.

Reordered, they are one design:

- **(c), turned around, is the raw material.** Put the ask in the request, not the response: every read and write takes `why`. The model at the moment of the call has full conversation context, strictly better informed than at session end where context may already be compacted.
- **(a) becomes possible only because of (c).** Tokenrip never sees the conversation; v2 decided compute stays with the member. It cannot summarize what it never received. It *can* fold a stream of whys plus the mechanical trail, because that is data it actually has.
- **(b) is the output surface of (a).** The instructions block returned on load already exists in the PRD as "the workspace's equivalent of `CLAUDE.md`." Upkeep is the fold writing to it.

The reframing that follows: this is not a friction feature. The May pattern (*semantic annotation as orchestration byproduct; skills capture why an API was called; intent-level telemetry nobody else has*, 2026-05-08) and June's why-graph are the same thing as proposal (c), derived from the architecture side. ⊕ **Auto-logging is the write-side of the moat.** Framed as "less friction" it is a nice-to-have; framed as the why-graph's actual ingestion mechanism it is the component June said the moat was missing. And a per-call why is already query-shaped: a short claim with a source link, which is the atomic-note-with-envelope from 2026-06-14. Capture and recall are the same design, and this one serves both.

## V. The invariant lives in the API; every transport is an adapter

The meta channel Simon asked about already exists. The agent is the client, and everything it reads from Tokenrip is the channel. What matters is not front door vs. back door but **static vs. dynamic**:

| Channel | When the model reads it | Reliability | Use for |
|---|---|---|---|
| MCP server `instructions` (sent at `initialize`) | Once, into the system prompt | High; a designed surface (Claude Code injects it verbatim) | Standing rules |
| Tool schema descriptions | At connection, every turn | Highest; models fill described params | `why` itself |
| CLI skill file (`npx skills add tokenrip/cli`) + `--help` | At install, then on error | High at install; decays with context compaction | Standing rules; the error restores them |
| `llms.txt` / API docs | When the agent learns the API | High for the first call | Standing rules |
| Tool result / stdout / response body | After each call | Medium and falling; harnesses are trained to treat tool-result instructions as injection | Confirmation (echo the recorded why) and state-dependent nudges only |
| MCP `sampling` | Server asks the client's model a question | Spec exists; support uneven | The literal back door; test, do not depend on it |

The governing rule for transport neutrality: **put the rule in the thing the model must read to make the call at all.** In every transport the model has to read something before it can call, or it does not know the shape. That something is the static channel, by construction. Eighty percent of the design goes there.

A meta channel built on tool-result text is built on sand. Schema, server instructions, and the skill file are the ground.

The CLI changes one thing about enforcement. Agents prefer the CLI because it needs no configuration; the cost is that its instruction surface is a skill read once at install, subject to compaction. By write forty of a long session the rule may be gone. Agents fix errors at near-100%; the error puts the rule back exactly when it fell out. **For the CLI, enforcement is what makes the design reliable, not a nicety.**

## VI. Sessions are inferred; why is sticky; omission is signal

A CLI is one process per call. There is no connection to hang a session on. Rather than a session file in `~/.rip/`, the client does not know about sessions at all: **a session is a server-side cluster of calls by (principal, harness, workspace) with an idle gap.** The PRD already half-says this (the log is a projection; sessions auto-close on idle). Taken to the limit, the client sends identity (already), harness name, and why; the server derives session boundaries, threads, and narrative. `load` stops being a session opener and becomes "give me the boot payload, and recall against this why if you have one." This is the 2026-06-13 pattern verbatim: nail source and payload, and channels collapse into thin adapters.

The session carries one string, `current_why`: the last why anyone supplied. A call without a why inherits it. That is a row lookup already needed to write the mechanical log entry; zero added latency, zero model calls.

Enforcement reduces to one gate: **a why is required on the first write of a session that has none.** After that, optional everywhere, with the schema text: *"Supply `why` when the user's goal changes. Omit it to continue the current thread."*

Two things fall out:

- **Omission is signal.** Supplied why = the thread changed; omitted = continuation. The session segments itself into threads with no inference, as runs of calls under the same why. With no pressure to invent a why per call, a supplied why means something shifted. This defeats the lazy why ("updating row") from a different direction than quality-checking would.
- **The v1 narrative needs no model.** Render deterministically: *"Session, Alek, Codex, 2h, 3 threads: (1) exploring enterprise price points → 4 writes to pricing.csv; (2) importing TX broker leads → 1 import, 40 rows; (3) …"* Readable cold. The fold (one async model call at idle, off the request path) is a v1.1 compression.

Inference budget, stated plainly: request path, zero. Session close, zero in v1. Pattern detection for Alek's procedures: later, batch, off-path.

One cheap use of the dynamic channel, for what it is good at: the write response echoes `recorded under: "exploring enterprise price points"`. If the thread moved and the model forgot to say so, it sees the mismatch and corrects on the next call. Self-healing without a gate.

## VII. The "out" is a principal kind, not an escape value

When is a why genuinely unavailable? Only when there is no model in the loop: a reflex, a cron, a bulk script, an app. Those principals already have a kind in the model. **Non-model principals are exempt; their why is their name** ("reflex: nightly-tabulate").

For model principals something is always known, because the user said something. "User asked to see the pricing sheet; goal not stated yet" is a valid why. The instruction says: *if you do not know the goal, say what was asked.* Do not add `why: unknown` as an allowed value; it would become the default within a day.

## VIII. Why on load dissolves into why on every call; the read side is the open primitive

"Load the sales workspace so I can check this month's numbers against targets" and "load the sales workspace" followed by "what are our numbers" stop being different cases once reads carry why. The agent's next call after a bare load is a record read, and that read's why is the goal. The session intent is never asked as a standalone question; it is the fold over whys, reads included.

Why on reads is something June asked for by name: *every read records "this knowledge informed that work"*, read-side provenance, git-blame for influence. It arrives as a side effect.

The pressure point that remains: Alek's first ask is about *reading* sessions later, and the reader is an agent at load. Today's boot payload is a cursor diff. If every session now produces narrative, the payload bloats, and **auto-logging without auto-recall is a graveyard** (June, verbatim). For the ask to land, load has to become "what is relevant to what you are about to do," which means a `recall(why)` that retrieves against stated intent. Symmetric with why-on-write, and a second primitive rather than a config change. v1 ships the capture side and a minimal `recall`; the data from the capture side is what the recall side gets designed against.

## IX. Store every call; replay; the instruction text becomes a prompt with a conversion rate

Because the capture mechanism depends on model behavior across harnesses, the behavior has to be measured. Simon's call: save everything on every call, and replay sessions to learn how models and harnesses actually behave. This is larger than a feedback loop. ⊕

**The instructions are a prompt.** The skill, the server instructions, the schema descriptions are prompt text Tokenrip ships to other people's models. Today they would be edited on instinct. With every call stored and stamped with the instruction version in force: *skill v0.4 on Codex → 31% why fill; v0.5 → 78%.* Replay is the review tool; the versioned text is the lever. Stream → metrics per (harness, instruction version) → edit → ship → compare. The 2026-05-25 pattern (docs are the UI when the customer is an agent) plus the thing docs never had.

**What "everything" means:** per call, the principal, harness (MCP `clientInfo`; CLI detects the parent environment and sends its own version), model if exposed, instruction version, tool, full params, the why (supplied or inherited, flagged which), the full response body returned, latency, and the inferred session id. The response matters for replay: the dynamic channel is what shaped the model's next call.

**What is never in the stream:** the user's prompt. Tokenrip never sees it. This reframes why one more time: it is the model's self-report of the user's goal, and therefore **the only observability Tokenrip has into the harness's side.** A second reason to care about why quality, independent of the memory story.

**One capture, two consumers.** The same stream is the customer's memory (why-graph, session narratives, Alek's procedures) and Tokenrip's internal telemetry (how Codex vs. Claude Code vs. Instinct treat shared state). Draw the line now so it never needs retrofitting: **content belongs to the workspace; shape belongs to Tokenrip.** What Tokenrip learns across customers is fill rates, call patterns, session lengths, error-recovery behavior, never what a why said. That line is also the trust story.

The shape data compounds into something no one else has: a behavioral model of every major harness against shared, multi-party state. Hosts know their own agent's behavior. Nobody sees all of them against the same surface.

## X. What this completes from the June synthesis

| June claim | What this document supplies |
|---|---|
| Write-side friction is the killer; zero-ceremony ingestion is acceptance test 2 | The mechanism: the why rides on the write; the ceremony is the model's, not the human's |
| Every read records "this knowledge informed that work" | `why` on reads, inherited when omitted |
| The why-graph is the moat; embeddings are scaffolding | The why-graph's ingestion path: a per-call intent stream over a multi-party record |
| Atomic notes with envelopes beat wholesale documents for retrieval | A per-call why is already an atom with an envelope (actor, harness, item, version, time) |
| Stigmergy requires that modifying the environment be the same act as the work | Derived mechanically rather than asserted |
| Recall completes memory; an archive nobody can query is forgetting | Named as the open primitive (`recall(why)`); capture ships first and designs it |

## XI. The honest pressure points

1. **Bimodal fill.** Omission-as-signal assumes the model omits deliberately. Models may be bimodal on a described optional parameter: a given harness fills every call or never, not selectively. If so, thread segmentation reflects harness habit, not goal shifts. Measured in week one as distinct-why runs per session per harness; the fallback is adjacent dedupe by similarity (two strings, embedding distance, no model).
2. **Harness and user are collinear.** Alek is on Codex, Simon on Claude Code. A fill-rate gap may be a prompting-habit gap, and replay cannot separate them because the prompt is not in the stream. The cheapest de-confound is one person, one task, two harnesses in the same week.
3. **Stale why bleed.** A sticky why across an idle gap can tag a new topic with an old goal if the model omits. The idle-gap session boundary resets it; the echo in the response lets the model correct. Whether these suffice is empirical.
4. **The zero-call session leaks.** Load then pure chat records nothing. Harness-specific hooks (Claude Code's Stop hook) cover it where they exist; chat-shaped hosts have no end event. Accepted for v1.
5. **Interleaved sessions.** Two terminals, same principal, same workspace, interleaved calls collapse into one session with mixed whys. Git's answer is branches, and a branch is a named why, the same primitive. Parked for another day; it slots in without redesign.
6. **Why quality under enforcement.** A required field invites "updating row." Inheritance removes per-call pressure, which should help; the residual fix is a cheap check that a why names a goal and not an operation, stated in the error.

## XII. Open questions

1. Is the deterministic render good enough that Alek reads it cold, or is the v1.1 fold needed immediately?
2. What idle gap defines a session boundary? The PRD's six hours was for declared sessions; inferred sessions likely want something shorter. The replay data answers this.
3. Does each harness honor MCP server `instructions`? Does any support `sampling`? One-day test.
4. Does the CLI reliably detect its parent harness from the environment, or does it need a config value?
5. What is the minimal `recall(why)` that makes Alek's first ask real without bloating load?
6. When does pattern detection across sessions (the compiled-session → procedure offer) become worth the batch job?

---

*Single-session synthesis, Bean with Simon, 2026-10-08. Claims marked ⊕ were derived independently more than once (Alek from use; earlier sessions from architecture). The engineering companion is `tokenrip-session-capture-build-spec-2026-10-08.md`.*
