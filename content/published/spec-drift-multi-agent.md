---
title: "The Spec Lived in Slack. It Didn't Survive the Weekend."
slug: spec-drift-multi-agent
tokenrip_id: 78511bb6-4267-4591-86f4-228e9ce6948a
post_type: thesis
created: 2026-04-29
---

# The Spec Lived in Slack. It Didn't Survive the Weekend.

By Monday morning, the pipeline had been running for four days. Three agents, same task. The outputs should have been consistent. They weren't, and tracing the divergence back to its source took longer than building the pipeline in the first place.

The problem wasn't a bug. It was a spec.

"We had three agents, four versions of the spec, and no way to know which agent was running which one."

---

## How a Spec Dies Without Anyone Noticing

Every multi-agent pipeline starts with some form of shared specification — a task definition, a set of guidelines, output standards, evaluation criteria. Call it a spec, a prompt library, a context document. The name doesn't matter. What matters is that every agent is supposed to be running from the same one.

The spec starts as a Slack message. Someone pastes the task definition in the team channel, agents get kicked off, the pipeline runs. It works well enough, so the spec gets formalized: someone copies it into a file, commits it to a repo, drops it in a shared folder. Now it has a location. It feels official.

Then a few days pass. One of the agents produces output that's slightly off. Someone tweaks the spec — just a small adjustment, nothing major — updates the file on their machine, and reruns the agent. The other two agents don't get the update because nobody thought to push it, or the updated file is in a different directory, or the update was made to the copy in one environment and not the other.

By the end of the week, three agents are running from three different versions of what everyone calls "the spec." None of them are wrong, exactly — they're each running from a version that existed at some point. But they're not running from the same one, and nobody can tell just by looking at the outputs.

This is spec drift. It doesn't announce itself. It accumulates quietly until the outputs diverge enough that someone finally goes looking.

---

## The Lifecycle Is the Problem

Spec drift is hard to catch because it follows a completely sensible lifecycle. Every step makes sense in isolation. The drift comes from the compound effect of reasonable decisions.

**Step one: spec as message.** The task gets defined in conversation — Slack, a call, a shared doc. Human-readable, easy to share, good enough to start.

**Step two: spec as file.** Someone formalizes it. The file has a name, a location, version control maybe. This feels like an improvement, and for a single-agent workflow, it is.

**Step three: spec as local state.** Once the file lives on someone's machine or in an environment, it starts diverging. Updates get made locally. The file path changes between machines. Different environments have different copies. The spec is no longer a single thing; it's a family of related documents that happen to share a name.

**Step four: spec drift.** The agents run. Outputs look similar enough that nobody catches the divergence immediately. By the time someone notices the inconsistency, there's no clean way to know which agent ran which version.

The file-based distribution model has a structural problem: it's copy-on-setup, not fetch-on-run. Every time an agent initializes with a file, it takes a snapshot of whatever that file looked like at that moment. That snapshot doesn't update. The file can change; the agent doesn't know.

---

## A Source of Truth Has Three Requirements — Most Pipelines Meet One

The phrase "single source of truth" gets used as if it's self-evidently achievable. It's not. There are three distinct requirements, and satisfying one doesn't give you the other two.

**A stable address.** Not a file path — file paths are machine-local and environment-specific. A file path means something different depending on where the agent is running, which machine it's on, what OS it's using. A URL is a stable address. A filesystem path is a local pointer that breaks the moment a second machine enters the picture.

**A version identity.** Every time an agent runs, it should be able to record not just "I ran from the spec" but "I ran from version 4 of the spec." Without version identity, you can't audit which agent ran what, can't diagnose divergence, can't roll back to a known-good state. Version identity turns a shared document into an auditable artifact.

**Runtime fetch, not setup copy.** This is the one operators most consistently skip. Fetching the spec at runtime versus copying it at setup is the difference between a pointer and a snapshot. A pointer always resolves to current. A snapshot is frozen at the moment it was taken and silently goes stale from that point forward.

Most pipelines satisfy the first requirement (sort of — a shared folder path feels like a stable address until it isn't). Almost none of them satisfy the second and third consistently. Without all three, you don't have a single source of truth. You have a family of related snapshots.

---

## A URL Is a Pointer. A File Is a Snapshot.

Spend an afternoon debugging a divergence that turns out to be a two-word change in a spec nobody thought to push, and this stops sounding like a philosophical distinction.

A URL, fetched at runtime, resolves to whatever is current at the moment the agent runs. If the spec changes, every agent that runs after the change gets the updated version. If you need to know which version a specific run used, that's a versioning question — but the baseline is that all agents are drawing from the same source.

A file, distributed at setup, captures the spec as of the moment it was copied. If the spec changes after setup, the agent doesn't know. If the agent runs in a different environment, it might be using a different copy entirely. There's no mechanism for the agent to detect it's out of date.

Here's how the same week goes under each model:

**Day one:** The pipeline initializes. Every agent gets a copy of the spec. Everything looks consistent.

**Day three:** Someone tweaks the spec, updates the file in their local environment, reruns the relevant agent. The other agents are still running from day-one snapshots.

**Day five:** Outputs start diverging. The difference is subtle — the kind of thing you notice only when comparing outputs side by side. Nobody immediately thinks "spec drift."

**Day seven:** You trace it back. Three agents, three spec snapshots, all slightly different. No audit trail for which version each agent was initialized with. No clean way to reconstruct the history.

With URL-stable distribution and runtime fetch, day three is different: the spec update goes live the moment it's published. Every subsequent run gets the updated version. The version is recorded at runtime. The audit trail exists.

---

## The Mental Model Is the Actual Problem

Moving from file-based to URL-stable spec distribution isn't primarily a technical change. It's a behavioral one.

File-based distribution creates an assumption that the spec is something you handle during setup and then forget about. Once the pipeline is running, the spec feels settled — which is precisely when drift begins. Not because anyone made a mistake, but because the mental model doesn't account for "spec can change after setup."

URL-stable distribution treats the spec as a live resource agents consult, not a document they internalize at birth. It's closer to how a well-designed application treats its configuration: not baked into the binary at build time, but loaded at runtime from a source that can change.

When the spec lives at a stable address and agents fetch it at runtime, updating the spec is a publishing action. It has a timestamp. It has a version. Every agent that runs after the publish gets the new version, without manual coordination across environments.

When the spec lives in files that get copied at setup, updating the spec is a coordination problem. Someone has to remember to push. Someone has to verify every environment got the new version. The coordination overhead grows with every agent you add — which is exactly the wrong direction for a system supposed to scale.

---

## The Tooling Is Deep on Orchestration and Shallow on Spec

The ecosystem's frameworks for multi-agent pipelines are mature on orchestration and almost silent on spec hygiene. There are solid tools for defining agent roles, managing task queues, routing messages. There is almost nothing that treats the shared spec as a first-class concern — something that needs versioning, stable addressing, and fetch-at-runtime semantics the same way a dependency needs a package manager.

Teams that have hit this problem tend to solve it with duct tape: shared S3 buckets, manually versioned filenames, environment variables storing a fingerprint of the spec's current contents. These work until they don't. They don't provide version identity at the agent level, so you still can't audit which agent ran which version. They require coordination across environments, which is what you were trying to avoid.

The spec problem isn't hard to solve in isolation. It just doesn't look like a problem until it's already caused a week of subtle divergence. By the time it surfaces, the overhead of retroactively figuring out which agent ran what is high enough that most teams restart the pipeline and hope for consistency next time.

What the spec needs is what any shared resource needs when agents are the consumers: an address that's independent of environment, version tracking that's automatic rather than manually maintained, and fetch semantics that mean "get current" rather than "use whatever you had when you started." Tokenrip is one of the few places building this model — versioned assets at stable URLs, designed to be fetched at runtime rather than copied at setup.

---

## The Pipelines That Break Are the Ones That Run for Weeks

Keeping agents synchronized on a shared spec is an infrastructure question more than an orchestration question. The orchestration frameworks tell you how to route tasks between agents. They won't help you ensure all three agents are consulting the same version of the spec.

The teams that have largely solved this treat the spec as a published artifact — something with a URL, a version history, and fetch-at-runtime behavior — rather than a file distributed manually. The approach isn't complex. What makes it hard is committing early to treat the spec as infrastructure rather than setup, before the first divergence makes the cost obvious.

That tradeoff shows up most clearly not in pipelines that run once, but in pipelines that run over days and weeks, where the spec evolves as the team learns. Those are the pipelines where silent divergence compounds. Those are also the pipelines most operators are actually running.

The spec doesn't need to live in Slack. It just needs to live somewhere all your agents can reliably point at — and know which version they're pointing at.
