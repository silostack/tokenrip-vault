---
title: "Agent Outputs Have No Provenance"
slug: agent-output-provenance
tokenrip_id: 89df892b-6426-43df-be67-1df3d979bf9c
post_type: thesis
created: 2026-04-28
---

# Agent Outputs Have No Provenance

Git solved this for code in 1991. Every commit carries who made it, when, what changed, and what it came from. You can reconstruct exactly how any file reached its current state — down to the exact line, the exact moment, the exact person. Agent outputs in 2026 arrive with a timestamp at best. In production multi-agent pipelines, that gap is load-bearing.

This isn't a copyright argument. It's an operational one. When Agent B receives a deliverable from Agent A, it has no way to evaluate whether to trust it — not because agents are adversarial, but because the output carries nothing about what produced it. No version of the producing agent's instructions. No model version. No timestamp tied to the artifact itself. No signature. Just a string, or a document, or a structured file, arriving without a chain of custody. The provenance isn't missing because it's hard to attach. It's missing because nobody built the convention.

## Every Handoff Is an Unverified Trust Assumption

Consider a three-step pipeline: Agent A researches, Agent B synthesizes, Agent C drafts the final deliverable. Agent B receives Agent A's research output. What does it actually know about what it received?

In the current ecosystem: almost nothing. It knows the content. It might know a timestamp if the platform surfaces one. It does not know which version of Agent A's system prompt produced this. It does not know whether Agent A was running the same model it ran last week. It does not know if Agent A's instructions were updated two days ago with a stricter standard for source quality — a change that would make this specific output unreliable under the new standard.

Both the reliable output and the stale one look identical. They're both strings that appear to contain research. Only provenance tells Agent B which one it's holding.

Anthropic's guidance on [building effective agents](https://www.anthropic.com/engineering/building-effective-agents) acknowledges this tension directly: multi-agent pipelines carry "higher costs and the potential for compounding errors" precisely because downstream agents inherit the assumptions of upstream ones. The guidance addresses this with testing and sandboxing — but not with a provenance model. Because there isn't one to reference.

The trust problem in a multi-agent pipeline isn't about whether Agent A is malicious. It's about whether Agent B can distinguish between Agent A running current instructions and Agent A running instructions from three weeks ago that have since been revised. Both call themselves "Agent A." Both produce plausible-looking outputs. Without a version record attached to the artifact, they're indistinguishable.

## The Problem Compounds With Every Hop

A three-step pipeline is the clean case. In practice, multi-agent pipelines run five, seven, ten steps. Some outputs are derived from other outputs. Some agents are composed of sub-agents. The graph gets complicated fast.

Software dependency management solved this problem decades ago — it just called it transitive trust. An application depends on a library that depends on another library. If any link in that chain is compromised or stale, the propagation goes upward. Package lockfiles, image manifests, and supply chain provenance frameworks all exist to arrest this propagation, to make each dependency auditable down to its source.

Imagine the research agent's instructions were updated three days ago to require a minimum of three verified sources per claim. The previous version had no such requirement. Outputs produced before the update don't meet the new standard. Outputs produced after do. In a ten-step pipeline with no provenance on any intermediate output, there's no way to know which standard each step operated under. The pipeline ran. Something came out. The reasoning chain that produced it has vanished into platform logs that aren't attached to the artifact.

When a deliverable produced by this kind of pipeline turns out to be wrong — or worse, confidently wrong in a subtle way — tracing the failure is reconstruction work. Here's a practical probe: for any intermediate output your pipeline produced last week, can you identify which version of each agent's instructions produced it? In most pipelines running today, the answer is no.

## Git Got This Right. The Insight Was the Record, Not the System.

Version control is typically treated as a feature of development environments. It's not. Git commits are provenance records — and the insight is what each commit contains, not the system that stores them.

A commit carries: the author, the timestamp, the parent commit hash, the message, and the diff. The parent hash is what makes it useful. You don't just know what a file contains — you know what it came from. You can walk the chain backward indefinitely. You can find the specific commit where a specific assumption was introduced, see who made it and when, and understand what state the codebase was in at that moment.

That primitive — the provenance record attached to every artifact at the moment of production — is what's missing from agent outputs. Not the version control system. Not the repository interface. The record itself.

Version control didn't emerge from theoretical concerns about software hygiene. It emerged because untracked changes were causing real failures: wrong versions deployed, changes made without attribution, work lost to untracked conflicts. The agent ecosystem is running the same experiment, except the outputs now include analysis, decisions, and documents that cross organizational boundaries.

## Minimum Viable Provenance Is Six Fields Nobody Is Attaching

The spec isn't complicated. Every agent output, at the moment it's produced, needs a provenance record that travels with it — not stored separately in a platform log, not accessible only to the system that ran the agent. The record must leave the platform with the artifact.

What that record needs, at minimum:

An asset identifier — unique and immutable. Not a filename or conversation ID, but a persistent reference that points to exactly this version of this output and no other. A skill version, recording which set of instructions the producing agent was running — not the agent's name, but the specific version of its instruction set, because the same agent on different instruction versions produces different outputs. A model version and provider, because the same prompt produces meaningfully different results on different models, and a generic family name isn't a version. An operator identity, binding the output to whoever authorized the agent's operation. A timestamp. A parent reference, if this output was derived from or built upon a prior output. And a cryptographic signature over all of the above, tamper-evident, so the record can't be manipulated after the fact.

That's it. Seven fields. The reason nobody has them is not that they're hard to produce. It's that no convention exists requiring them.

There's an important distinction between this and what observability tooling already collects. OpenTelemetry's [generative AI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans/) track agent ID, agent version, model, system instructions, and conversation ID. That's useful for understanding what happened during execution inside a platform. But OTel stays in the observability layer. Agent B, receiving an artifact at 2 AM from a cross-team pipeline, cannot read an OTel span.

Observability and provenance are solving different problems. Observability tells operators what happened during execution. Provenance tells any downstream agent, team, or auditor what produced a specific artifact — and it does so by traveling with the artifact itself.

## The Ecosystem Observes the Process. It Doesn't Stamp the Product.

This is the gap. Most sophisticated agent platforms already collect the information provenance requires. They track model versions, instruction versions, execution timestamps, operator identity. The data exists. It stays in the platform's internal logs.

When an output crosses a boundary — from one agent to another, from one team to another, from a vendor to a client — the provenance stays behind. The artifact arrives clean, carrying nothing about its origin.

SLSA addresses this exact gap for software artifacts. The [SLSA framework](https://slsa.dev/spec/v1.0/about) uses a "factory stamp" model: tamper-evident provenance records showing which build platform, at which configuration, produced which binary. SLSA emerged from real supply chain attacks — the artifact looked correct, but there was no way to verify it hadn't been modified in transit or substituted entirely.

Every unsigned handoff in a multi-agent pipeline has the same exposure. Not necessarily from malicious substitution, but from version drift, stale instructions, or model changes that happened without a record being attached to the outputs they produced.

Tokenrip embeds provenance metadata at publish time, so it travels with the asset rather than staying in a separate log.

## The Mandate Is Already Written

Provenance for agent outputs isn't a theoretical future requirement. The EU AI Act mandates "logging of activity to ensure traceability of results" for high-risk AI systems, with enforcement beginning August 2026. That's explicit statutory language covering exactly the pipeline outputs the current ecosystem ships without records.

Physical supply chains followed the same arc. Conflict minerals, food safety, pharmaceutical supply chains — all became regulatory requirements after the first disasters, not before. The agent ecosystem is in the window before the first high-stakes failure makes provenance a compliance retrofit.

The technical overhead here is minimal. The record is small. If you're operating a multi-agent pipeline today, the immediate move is straightforward: audit any output your pipeline produced in the last month and check whether it carries the version of the instructions that produced it. It almost certainly doesn't. That's the gap. Filling it doesn't require a platform rebuild — it requires a convention that doesn't yet exist.

The Git analogy holds all the way through. In 1991, nobody argued against tracking who changed what. The question was whether teams would build the habit before or after the failures made it unavoidable. Some did. Most waited.

Don't wait for the forensics.
