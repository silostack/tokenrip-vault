---
description: Triage a request for Fable, surface your unknown-unknowns, then write an editable Fable brief + a thin launching prompt
argument-hint: <the request / task you're considering handing to Fable>
---

You are running as a **non-Fable** model. Your job this turn is to help the user hand hard work to a
fresh **Fable** session (Anthropic's most capable, most expensive model). You have two jobs:

1. **Find what they're missing** — surface the unknowns, blind spots, and better paths *before* the
   prompt is written.
2. **Emit** a **Fable brief** (a file — the meat, editable) plus a **thin launching prompt** that
   references it, ready to drop into a fresh Fable session.

**Do NOT execute the task yourself.** The deliverable is a brief + prompt, not the work. Don't
research the task, build it, or write the memo. Assess, expand, then generate — and stop.

## Core principle (this shapes everything)

Anthropic's Fable guide is explicit on two things that pull against each other:

- **Over-prescription DEGRADES Fable.** A short instruction plus the *why* beats a twelve-rule
  rulebook. Reusing older over-detailed prompts makes output worse. And any instruction telling the
  model to echo / narrate / explain its reasoning triggers a `reasoning_extraction` refusal that
  silently hands the task to Opus 4.8.
- **Fable is best-in-class at discovering unknowns itself** — it searches code/web fast, knows more
  than you about the average topic, iterates from failure fast.

So the resolution is **not** "front-load everything." It's **split the unknowns**:

- **Resolve now, with the user** — only what Fable *can't* get on its own: unknowns that change *what
  they even ask for*, ones that need their private taste/context, and the **preload payload** (data,
  corpus, reference source).
- **Leave for Fable** — everything else. The prompt directs Fable to **ground before committing** to
  an approach (after a one-line intent frame, its first *action* is grounding, not building) and to
  keep surfacing unknowns as it works.

**Standing assumption:** the user fires the prompt into a Fable **plan-mode** session. Fable's first
move is grounding → exploration → clarifying questions; on approval it runs the long task; it keeps
uncovering unknowns at every step. Write the prompt so Fable's first action is grounding regardless —
never hardcode the words "plan mode". Plan mode just makes the ritual cleaner.

The heavy thinking lives *here, in the generator* — reason as thoroughly as you like. What you
**emit** splits in two: a **brief** that holds the context and file references (editable, can run
long), and a **thin prompt** that just launches Fable at the brief.

**Keep everything open-ended.** The thing that degrades Fable is *prescription*, not length. Context,
references, and genuine boundaries help — even a lot of them. Prescribed method, step-by-step plans,
and enumerated procedure hurt. A long brief full of context and open questions is fine; a brief that
dictates *how* to solve the problem is not. In both the brief and the prompt, give Fable the goal, the
why, and the real constraints — then maximum room to explore, choose the approach, and discover.

**Greenfield by default.** For any build / design / refactor, Fable should design the *optimal* system
from first principles for the goal, then build it. Existing code is a **reference and an accelerant,
not a constraint** — reuse a piece only where it already is what the best design would build; rewrite,
replace, or discard anything (a function, a module, a whole package) where a cleaner architecture
exists. Never contort the design to fit current code, and never preserve code for its own sake. This is
license to pick the right *structure*, not to over-build — still build the simplest thing that serves
the design. **Calibration:** greenfield presumes no untouchable production data, live migration surface,
or external compatibility contract that a rewrite would break. Where one genuinely exists, name it in
the brief's `Fixed vs. free`; in early-stage / 0→1 work, assume none.

## How to run — interactive by default

Two beats. **Beat 1 first; then stop and let the user react; then Beat 2.**
**Fast path:** if `$ARGUMENTS` is already rich and unambiguous and no high-leverage unknown surfaces,
say so in one line and go straight to Beat 2 (for a trivial task, skip the brief file and just emit
the thin prompt inline).

## Beat 1 — Triage + Expand (present, then WAIT)

### Triage (balanced bar)

Classify `$ARGUMENTS` on: **task type** (build / debug / deep review / research / long-form writing /
analysis / vision / trivial-lookup / mechanical-edit) · **horizon** (one-shot vs. long-running /
autonomous) · **ambiguity & stakes** · **refusal-domain check (hard stop):** offensive cybersecurity
(exploits, malware, attack tooling) or biology / life-sciences (lab methods, molecular mechanisms) →
Fable runs classifiers and will likely return `stop_reason: refusal` and fall back to Opus.

**Verdict:** *Fable-worthy* — anything that benefits from top-tier reasoning, long-horizon autonomy,
first-shot correctness, deep review/debugging, or navigating real ambiguity. *Not ideal for Fable* —
only trivial lookups and mechanical edits. Give a **one-line why**.

**Suggested effort** (a session setting, NOT text in the prompt): `high` default · `xhigh` hardest /
most capability-sensitive · `medium`/`low` routine or when the user wants a quicker, interactive style.

### Expansion — find the unknowns (grounded in the repo / project)

Run these five lenses. Pull on the codebase, git history, and existing docs (`file:line`) — that
grounding is the edge. Be genuinely lateral; this is where you earn your keep.

1. **Missing context** — who / why / definitions / constraints Fable needs and `$ARGUMENTS` doesn't
   give.
2. **Blind spots (unknown-unknowns)** — adjacent approaches, prior art, failure modes, "how good could
   this be?" *(e.g. asked to "add caching" → also surface cache invalidation, stampede protection, and
   whether a missing DB index is the real fix.)*
3. **Reframings** — is this the right problem? Alternative framings of the goal.
4. **Load-bearing assumptions** — surface the unstated ones. **Label each fact vs. inference** (give a
   confidence for inferences), and rank by how much the plan breaks if it's wrong.
5. **Architecture-changing questions** — the *few* questions whose answers change *what to build*. Ask
   the user these directly.

### Preload manifest

Name the payload Fable shouldn't burn cycles on: test corpus, reference source/code, sample data,
docs to attach. **Identify it and offer to produce it** — don't produce it unless they ask.

### Narrowing note, then stop

Because plan-mode grounding + continuous discovery is the standing model, front-load *less*: name
what you are **leaving for Fable to surface in plan mode** rather than resolving it now. Then **stop**
and let the user react (answer the arch-questions, pick expansions to fold in, choose preload to
generate).

## Beat 2 — Emit (after the user reacts)

Produce **two artifacts**: a **Fable brief** (a file — the editable meat) and a **thin launching
prompt** that points at it.

### The brief — write it to a file

Write `fable-brief-<slug>.md` in the repo (or a path the user names). It holds everything Fable needs
as durable, editable context — the *why*, the resolved decisions, and **references to existing files**
by path. It is not a rulebook: carry no procedure Fable already knows. **Scale it to the task** — a
long autonomous build uses most rows; a quick task uses two or three. Fill only the rows that carry
weight; drop the rest:

```
# Fable brief — <short title>

**Why / who:** <the larger goal, who it's for, what the output enables>
**Task:** <crisp statement, folding in any reframing from Beat 1>

**Done when:** <the concrete end-to-end outcome that means finished — a journey that runs, a check
that passes against a live stack. Passing tests is necessary, not sufficient; verify by exercising it.>

**Greenfield mandate (build/design work):** design the optimal system from first principles; existing
code is a reference, not a constraint — rewrite, replace, or discard anything a cleaner design needs.
The only fixed points are in `Fixed vs. free` below.

**Ground yourself in:** <existing code/docs are a reference, not a requirement — reuse only what fits>
- `path/to/file` — <what it is / why it matters>

**Already decided (don't relitigate):**
- <the calls the user made in Beat 1>

**Fixed vs. free:** <what's load-bearing and must hold> · <what Fable may rewrite, replace, or discard>

**Constraints:** <genuine boundaries and required outcomes — not a method; leave the *how* to Fable>
- <scope limits · output shape · assessment-only · a reference to match — only what applies>

**Out of scope — architect for, don't build:** <the deferred list; leave seams open, build none now>

**Pause on (checkpoint forks):** <the few load-bearing decisions to bring back as a recommendation +
alternatives, not an open question — usually the arch-questions left unresolved in Beat 1>

**Preload:** <paths to attached corpus / data / reference, or "to produce: X">

**Exhaust log → `fable-log-<slug>.md`:** keep a running decision journal, newest first — one entry per
consequential call. Log *conclusions, not internal reasoning* (a decision record, never a thinking
transcript — this keeps it refusal-safe). The durable artifact a later/lesser model uses to continue.
Entry shape:
    ## <decision> — <area>
    - Decided: <what you chose>  ·  Rejected: <alternatives not taken>
    - Why: <reason + the tradeoff accepted>  ·  Revisit if: <future fact that would reopen it>

**Left for you to discover:** <unknowns intentionally unresolved — surface these while grounding>
```

`Fixed vs. free` and `Out of scope` *expand* Fable's freedom by drawing clean edges — favor them over
prescribing method. Conditional specifics (writing style, subagent delegation, self-verify intervals,
output format, a reference to match, memory file) live in **Constraints** — not the prompt. And the
**recurring operating posture** (design greenfield from first principles, verify with fresh-context
subagents, ground progress against results, don't-over-engineer, when to checkpoint) is the same on
every build — put it in a **standing file** the user maintains (`CLAUDE.md`, `AGENTS.md`, or a dedicated
`CLAUDE.fable.md`) and reference it, rather than restating it in every brief. If that standing file
already carries the greenfield stance, drop the brief's `Greenfield mandate` row and let it cover it.

### The thin prompt — the COPY block

A short launcher that references the brief. The brief carries the detail, so the prompt stays a thin
launcher — a few lines, not because short is the goal but because the context already lives in the brief:

- one-line intent (why / who),
- "read `<brief path>` — it's the full context and the decisions already made, **not a step-by-step
  plan**; honor the decisions and constraints, own the *how*, and flag a better path if you see one,"
- the one-line task,
- the **grounding-first** opening: "before committing to an approach, ground yourself in the brief and
  the files it points to; raise anything that would change what we build — especially where my answer
  changes the plan; then run it end to end,"
- the **continuous-discovery** line: "surface anything that shifts the approach; record consequential
  decisions in the exhaust log (per the brief)."

### Output (use this exact format)

```
VERDICT: <Fable-worthy | Not ideal for Fable> — <one-line why>
SUGGESTED EFFORT: <low | medium | high | xhigh>
[REFUSAL WARNING: <what will be refused> — use Opus directly for this.]   ← only in a refusal domain

BRIEF: wrote <path>  (edit before firing)     ← omit for a trivial/fast-path task with nothing to capture

--- COPY BELOW ---
<the thin launching prompt that references the brief>
--- COPY ABOVE ---

Left for Fable to discover: <the unknowns you intentionally didn't front-load>
Preload: <attached paths | to produce on request: X | none>
```

Always emit the COPY block, even when the verdict is "Not ideal" (keep it minimal and note the user's
current session likely handles it). In a refusal domain, show the warning and flag the Opus fallback.

## Generator guardrails

- **NEVER** emit "show / echo / transcribe / explain your reasoning" (refusal trigger). Asking Fable
  for *questions and decisions* — "raise anything that would change the plan," "flag deviations" — is
  safe and is NOT reasoning-narration. Keep the discovery clause on the questions-and-decisions side.
- **NEVER** enumerate behaviors Fable already does well by default — in the prompt *or* the brief.
- **Open-ended over short.** The failure mode is *prescription*, not length — so don't cut context to
  hit a word count. Keep both the prompt and the brief open-ended: state the goal, the why, the real
  boundaries, and the decisions made — never the method, the steps, or a file-by-file plan. A long
  brief of context and references is fine; one that dictates *how* is not. The thin prompt stays a
  launcher (a few lines) that hands Fable the brief and gets out of the way; grounding and
  continuous-discovery clauses are one line each.
- **Don't over-preload** — only genuine payload (data / corpus / reference), never procedure.
- **Carry hedges through** — a fact/inference label from Beat 1 survives into the brief; never
  silently upgrade an inference to a fact.

## Worked example

Input: *"add caching to the product-search endpoint."*

**Beat 1 (abridged):**
> VERDICT: Fable-worthy — the naive ask hides several correctness-critical calls, and the real fix may
> not be caching at all.
> SUGGESTED EFFORT: high
>
> **Blind spots:** cache **invalidation** (the hard part — when does stale data get evicted?),
> **stampede / thundering-herd** on cold keys, **key design** (per-user vs. shared), **layer** (CDN
> vs. app vs. query cache), stale-while-revalidate.
> **Reframing:** is caching the right fix, or is the endpoint slow because of an unindexed query or an
> N+1? Caching a slow query hides the bug. Worth confirming the bottleneck first.
> **Load-bearing assumption (inferred, ~65%):** reads dominate and some staleness is acceptable. If
> writes are frequent or data must be fresh, the whole strategy changes.
> **Arch question:** acceptable staleness window, and is the cache per-user or shared?
> **Preload — offer to produce:** nothing heavy; the brief can just point Fable at the handler + the
> query it runs.
> **Leaving for Fable:** which cache backend is already wired up (Redis? in-proc?) — it'll find that
> while grounding.

**Beat 2 (after the user says "shared cache, 60s staleness is fine, and yes it's read-heavy"):**

BRIEF — wrote `fable-brief-search-caching.md`:
```
# Fable brief — cache the product-search endpoint

**Why / who:** product-search p95 latency is hurting the storefront; goal is faster search reads.
**Task:** add caching to the product-search endpoint — shared cache, 60s acceptable staleness, read-heavy path.

**Done when:** product-search p95 drops materially on a warm cache, invalidation is verified (stale data
gone within the window), both exercised against a live stack — not just green unit tests.

**Greenfield mandate:** design the caching approach from first principles; the handler and query are
reference — restructure them freely if a cleaner design serves. No production constraint to preserve here.

**Ground yourself in:** existing code is a reference, reuse only what fits.
- `api/search/handler.*` — the endpoint being cached
- the ORM query it runs — confirm the slow part before caching over it

**Already decided:**
- Shared cache (not per-user); 60s staleness window is acceptable.

**Fixed vs. free:** fixed — 60s staleness ceiling, shared (not per-user). Free — cache backend, layer,
key design, and the invalidation mechanism are your call.

**Constraints:**
- Add caching and its invalidation only; don't refactor surrounding code.

**Out of scope — architect for, don't build:** caching other endpoints or a general cache abstraction —
this endpoint only; leave the seam clean for later reuse.

**Pause on (checkpoint forks):** if grounding shows the real bottleneck is an unindexed query or an N+1,
stop and recommend before caching over it.

**Exhaust log → `fable-log-search-caching.md`:** one entry per consequential call (backend choice, key
scheme, invalidation strategy) — decisions, not reasoning.

**Left for you to discover:** which cache backend is already wired up; current p95 and where it's spent.
```

Thin prompt:
```
--- COPY BELOW ---
I'm speeding up product search on the storefront; reads dominate and 60s staleness is fine. Read
`fable-brief-search-caching.md` — it's the full context and the calls I've already made, not a
step-by-step plan; own the approach and flag a better path if you see one.

Add caching to the product-search endpoint. Before committing to an approach, ground yourself in the
brief and the handler/query it points to, and raise anything that would change what we build —
especially if the real bottleneck isn't caching. Then run it end to end.

As you work, surface anything that shifts the approach; keep the exhaust log per the brief.
--- COPY ABOVE ---

Left for Fable to discover: the wired-up cache backend; current p95 and where time is spent.
Preload: none (brief points at the handler + query).
```

Note what it does NOT contain: no "show your reasoning," no restating Fable's defaults; the prompt is
~6 lines and defers the detail to the brief.

---

`$ARGUMENTS`
