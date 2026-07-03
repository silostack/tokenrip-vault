---
description: Triage a request for Fable, then generate a properly-tuned, copy-paste Fable prompt
argument-hint: <the request / task you're considering handing to Fable>
---

You are running as a **non-Fable** model. Your job for this turn is to look at `$ARGUMENTS` and:

1. **Judge** whether the request actually warrants Fable (Anthropic's most capable, most expensive model).
2. **Emit** a light, paste-ready Fable prompt Simon can drop into a fresh Fable session.

**Do NOT execute the task yourself.** The deliverable is a prompt, not the work. Don't research the
task, don't start building, don't write the memo — assess and generate the prompt, then stop.

## Core principle (this shapes everything)

Anthropic's Fable guide is explicit: **over-prescriptive prompts DEGRADE Fable's output**, and any
instruction telling the model to echo / show / narrate its reasoning triggers a `reasoning_extraction`
refusal. So the detailed thinking lives *here, in the generator* (you can be as thorough as you like
reasoning about the task). What you **emit** stays minimal — intent + the ask + only the boundaries
this specific task needs. A good Fable prompt is 4–8 lines, not a rulebook.

## Step 1 — Triage (balanced bar)

Classify `$ARGUMENTS` on:

- **Task type:** build / debug / deep code-review / research / long-form writing / analysis / vision
  (dense images, screenshots) / trivial-lookup / mechanical-edit.
- **Horizon:** one-shot vs. long-running / multi-step / autonomous (hours+).
- **Ambiguity & stakes:** does it need scoping before acting? Does first-shot correctness matter?
- **Refusal-domain check (hard stop):** is it offensive cybersecurity (exploits, malware, attack
  tooling) or biology / life-sciences (lab methods, molecular mechanisms)? Fable runs classifiers on
  these and will likely return `stop_reason: refusal` and fall back to Opus.

**Verdict (balanced bar):**
- **Fable-worthy** — anything that benefits from top-tier reasoning, quality, long-horizon autonomy,
  first-shot correctness, deep review/debugging, or navigating real ambiguity.
- **Not ideal for Fable** — only trivial lookups and mechanical edits (a cheaper/faster model, or
  Simon's current session, handles these fine).

Always give a **one-line why**.

## Step 2 — Suggested effort (a session setting, NOT text inside the prompt)

- **`high`** — default for most Fable-worthy work.
- **`xhigh`** — the hardest, most capability-sensitive tasks.
- **`medium` / `low`** — routine work that still wants Fable; also if Simon likely wants a quicker,
  more interactive style.

## Step 3 — Assemble the prompt (keep it LIGHT)

Build from this kit. **Include only the components this task actually needs.** All patterns are
paraphrased from the Fable guide — never phrase any of them as "show/explain your reasoning."

- **Intent-first (almost always):**
  "I'm working on `<larger goal>` for `<who / audience>`; they need `<what the output enables>`.
  With that in mind: `<the task>`." — Fable performs better when it knows *why*. If `$ARGUMENTS`
  doesn't give you the who/why, infer a reasonable frame from the vault context or leave a clearly
  marked `<fill in: who is this for?>` placeholder rather than inventing specifics.
- **The task**, restated crisply.
- **Self-clarify + act (default for anything non-trivial):**
  "If anything critical is ambiguous, ask before starting. Once you have enough to act, act — don't
  survey options you won't pursue." (This is how a one-shot prompt handles thin input without you
  interrogating Simon.)
- **Boundaries (only when relevant):**
  - scope limits: "don't refactor, add features, or build abstractions beyond the ask."
  - assessment-only: "if I'm asking a question rather than requesting a change, give me your
    assessment and stop — don't apply a fix until I ask."
- **Conditional add-ons — include ONLY when the task type triggers them:**
  - user-facing writing → "lead with the outcome; write for a reader who didn't watch you work; drop
    shorthand and jargon."
  - long autonomous run → "audit progress claims against actual results; if something isn't verified,
    say so plainly."
  - long build → "verify your own work at intervals against the spec — fresh-context subagents beat
    self-critique."
  - parallelizable → "delegate independent subtasks to subagents and keep working while they run."
  - multi-session → point it at a memory file to record and reuse lessons.

**Generator guardrails:**
- NEVER emit any "show / echo / transcribe / explain your reasoning" instruction (refusal trigger).
- NEVER enumerate behaviors Fable already does well by default — every added line has to earn its place.
- Prefer **4–8 lines**. If the kit tempts you past ~10, cut.

## Step 4 — Output (use this exact format)

```
VERDICT: <Fable-worthy | Not ideal for Fable> — <one-line why>
SUGGESTED EFFORT: <low | medium | high | xhigh>
[REFUSAL WARNING: <what will be refused> — use Opus directly for this.]   ← only in a refusal domain

--- COPY BELOW ---
<the assembled light prompt>
--- COPY ABOVE ---
```

Always emit the COPY block, even when the verdict is "Not ideal" — keep it minimal in that case and
add one line noting Simon's current session likely handles it without Fable. In a refusal domain,
still show the warning; you may skip the COPY block or keep it trivial, but flag the fallback.

## Worked example

Input: *"rewrite our equipment-finance deal-scoring engine to rank a broker's own prospect list by
what their deal history funds, with tests."*

```
VERDICT: Fable-worthy — complex, well-specified system build where first-shot correctness matters.
SUGGESTED EFFORT: high

--- COPY BELOW ---
I'm rebuilding the Quintel deal-scoring engine for equipment-finance brokers; they need it to rank
their own prospect list by what their historical deal book actually funds (non-commodity signal).

Rewrite the scoring engine to do that, with tests. If anything critical about the scoring logic or
data shape is ambiguous, ask before starting; once you have enough to act, act.

Don't add abstractions or features beyond what the scoring change needs. Verify your work against the
spec at intervals as you build.
--- COPY ABOVE ---
```

Note what it does NOT contain: no "show your reasoning," no restating Fable's default behaviors, ~6 lines.

---

`$ARGUMENTS`
