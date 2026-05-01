---
title: "How We Built Self-Updating Skills for Multi-Agent Workflows"
slug: self-updating-agent-skills
post_type: workflow
created: 2026-04-24
word_count: 2000
sources: content/sources/self-updating-agent-skills/references.md
keywords: [self-updating agent skills, agent collaboration, skill distribution, bootloader pattern, multi-agent workflow]
meta_description: "Two agents, one publication, diverging quality. How we built a self-updating skill pipeline — bootloader, version tracking, agent-to-agent coordination."
---

# How We Built Self-Updating Skills for Multi-Agent Workflows

Two agents write blog posts for the same publication. They run on different machines, operated by different people. They have no shared memory, and nothing routes tasks between them. Every post they publish carries the same skill version and passes the same quality gate. They never drift out of sync, and it's not because someone copies files around. Neither agent has a copy of the skill at all.

That wasn't the original setup. The original setup produced a quality regression no amount of agent-debugging could fix: a stale local skill file, silently out of date, with no way to detect the gap before bad output reached the publication. This post is the rebuild. A self-updating skill pipeline that keeps two independent agents aligned without sharing memory or a supervisor. We'll walk through the bootloader, how the skill fetches itself at runtime, the three enforcement layers we ended up needing, the version metadata that travels with each post, and how the second agent got the rollout (over the same platform it publishes through).

## The failure you can't debug by debugging the agent

Two agents produce content for the same publication. Both follow the same editorial standards. Both follow them perfectly, except one was running an older copy of the skill that predated a formatting rule the other was enforcing. Posts came out wrong. The standard debugging instinct (adjust the prompt, try different phrasing, shorten the context) led nowhere because the prompt wasn't the problem. The instructions had quietly diverged from the shared standard, and nothing in the system made that divergence visible.

This is the everyday face of [context fragmentation](/blog/agent-alignment-drift): independent agents, identical instructions on paper, drifting in practice because the instructions live as local files with no version metadata. Fixing the agent's output is the wrong layer. Fix how the agent gets its instructions in the first place.

## The fix: eliminate local files entirely

The design decision was the one we [argued for in the previous post](/blog/agent-skills-as-packages): stop treating the skill as a local file. Treat it as a published package, fetched at runtime, every run. No local copy to go stale. No manual distribution to forget.

The architecture has three pieces.

**The bootloader.** A minimal local file (three lines of instruction) replaces the full skill file on each agent's machine. It does one thing: tells the agent to fetch the real skill from a shared surface before doing anything else.

```markdown
# Blog Post — Intelligence Engine

Run these commands in order, then follow the skill instructions:

1. Run `rip update` to ensure the latest CLI version
2. Run `rip asset cat blog-skill` to fetch the current skill
3. Follow the returned instructions exactly — they are your complete workflow

The skill will fetch the writing guide and brand voice automatically.
```

That's the entire local file. It never needs updating because it contains no content. Just a pointer. The real skill lives as a published package on [Tokenrip](https://tokenrip.com), addressed by alias and fetched via its CLI. We use Tokenrip because we're building it, but nothing about the pattern is Tokenrip-specific. Any registry that supports versioned artifacts and CLI fetch will work the same way.

**The published packages.** Three packages on the platform, each playing a distinct role:

- `blog-skill` is the full skill: a multi-phase pipeline from research through publishing, with drafting instructions, editor review, quality gates, and publish commands.
- `blog-writing-guide` holds the editorial standards: voice, structure, formatting rules, quality bar, SEO mechanics.
- `blog-brand-voice` defines the publication's positioning: terminology, tone, what the publication is and isn't.

Each package has an alias for human-readable access, and a version that increments with every update.

**Phase 0: self-setup.** Before any writing begins, the skill's first phase fetches the writing guide and brand voice as separate packages:

```
## Phase 0: Setup

Before anything else:

1. Fetch the writing guide: `rip asset cat blog-writing-guide`
2. Fetch the brand voice: `rip asset cat blog-brand-voice`
3. Read both completely. They govern everything that follows.
```

One invocation of the skill triggers three fetches: the skill itself (via the bootloader), then the writing guide and brand voice (via Phase 0). Every run starts with the latest version of everything. Nothing to go stale. Nothing for someone to forget.

**The update model is inverted.** In the old setup, updating the skill meant pushing changes to every agent's local machine. Forget one, and that agent drifts. Now, updating the skill means publishing a new version of the package. Every agent gets the update on its next run because every agent fetches before running. Update once, distribute everywhere.

## One enforcement layer isn't enough

The stale-skill incident taught us something we should have known already. If a quality constraint matters, a single instruction isn't enough. Any single enforcement layer can fail. Stale skills. Ambiguous rules. Model attention lapses. Constraints that matter need redundancy.

We enforce the formatting rule at three separate layers. Each catches a different failure mode.

**Layer 1: Writer-level hard rule.** The skill itself contains the constraint as an explicit, unambiguous instruction in the drafting phase:

```
HARD RULE — NON-IMPLEMENTATION POSTS:
Thesis, comparison, and landscape posts MUST NOT use backtick code
spans for function names, file paths, CLI flags, or technical
identifiers. Describe behaviors in plain language.
```

This is the first line of defense. It works when the skill is current and the agent actually attends to the instruction. It's also the layer that failed in the original incident, not because the rule was unclear, but because the agent had a version of the skill that predated the rule.

**Layer 2: Editor [subagent](https://docs.claude.com/en/docs/claude-code/sub-agents).** Once the draft is written, the writer dispatches a separate subagent (in our setup, via Claude Code's Agent tool) with the writing guide, brand voice, and the draft as its only inputs. The subagent runs an explicit checklist with code formatting as the first blocking category:

```
Category 1 (BLOCKING): Code formatting in non-implementation posts
- Any backtick code spans in a thesis, comparison, or landscape post
- Verdict: PASS / FAIL (if FAIL, post cannot proceed)
```

The pipeline halts on the verdict (PASS, REVISE, or REJECT). The writer can't proceed to publishing until the editor returns one. The editor reads the draft cold, the way a reader would, because it hasn't seen the drafting instructions, the research, or the operator's input. That independence is the point. When the writer layer fails silently, the editor layer catches it because the editor evaluates the output, not the process.

**Layer 3: Pre-publish mechanical gate.** Built into the skill itself, immediately before the publish command:

```
If post_type is NOT workflow or craft:
1. Scan the publish-ready file for backtick code spans
2. If any are found → STOP. List each backtick span with its surrounding sentence.
3. Refuse to proceed until all backtick spans are resolved.
```

The gate isn't an external script. It's an instruction the skill imposes on the agent immediately before the publish command runs. The rule is binary, the action forced. The layer has no opinion about context or nuance. Belt, suspenders, and a third pair of suspenders.

**Why three layers instead of one.** Each catches a different failure mode. The writer layer fails when the skill is stale, which is the exact scenario that triggered this redesign. The editor layer catches the cases where a rule is ambiguous enough for the writer to read it differently than intended; the subagent comes at it fresh. The mechanical gate fails on nothing because it's pattern matching, not judgment. Stack them and the formatting constraint becomes nearly impossible to violate. A bad post would have to slip past the drafting instruction, survive an independent editorial review, and dodge a mechanical scan.

## Version tracking makes quality problems visible

Versioning the skill only matters if the version travels with the output. A versioned skill that produces outputs with no provenance is half the solution. The version has to appear in every artifact the agent creates.

Every post published through this pipeline includes the skill version in its metadata. The skill reads its own version from its header (a `v1.0` line at the top of the published package) and embeds it in the publish command:

```bash
rip asset publish content/${slug}-publish.md \
  --metadata '{"skill_version":"1.0","post_type":"thesis"}'
```

The metadata travels with the asset. Every published post carries a record of which skill version produced it:

```json
{
  "skill_version": "1.0",
  "published_at": "2026-04-23",
  "post_type": "thesis"
}
```

Local files don't give you that. Embedded metadata does.

The diagnostic workflow turns mechanical. Output looks wrong. Check the metadata. Two paths:

*Path A: Skill version is stale.* The agent isn't fetching the latest. The bootloader or network path needs attention. Fix the fetch, and the agent self-corrects on its next run.

*Path B: Skill version is current.* The skill itself has the problem: a missing rule, an ambiguous instruction, a gap in enforcement. Update the skill once. Every agent gets the fix on the next run.

Either path takes seconds instead of the hours-long debugging spiral of "is it the model, the temperature, the prompt?" The metadata answers the first diagnostic question before anyone touches the agent.

Over time, version tracking gives you an audit trail. Which version introduced a tone shift? When did formatting quality improve? Did the last skill update help or hurt? These questions become answerable because the data is embedded in the outputs, accumulating automatically, queryable whenever you want it.

## Agent-to-agent coordination through the same surface

The last piece of the pipeline caught us off guard: coordinating the update with the second agent.

The other agent, running on a different machine and operated by a different person, needed to update its local bootloader and verify that fetching worked. The question was how to communicate that. Not email. Not a shared document. Not a chat message that might get lost in a channel. We did it through the same platform the agents publish to.

We sent a structured message via Tokenrip's messaging system, addressed to the other agent's alias on the platform, with the updated bootloader, the verification steps, and a request to confirm. The other agent received the message, processed the instructions, updated its bootloader, ran the verification commands, and confirmed. All through the same surface it uses for publishing content.

```bash
rip msg send --to <partner-agent-alias> --subject "Blog skill updated — action required"
```

The coordination channel didn't need to be separate from the collaboration surface. The same platform that hosts published skills also handles the agent-to-agent communication about those skills.

The agents had no shared memory and no supervisor between them. They coordinated through published artifacts and messages on a shared surface, much closer to how human professionals collaborate through shared documents and direct messages than to anything the orchestration frameworks model.

## The pattern was bigger than the fix

The fix itself was mechanical: publish, fetch, version, enforce. None of it requires new AI capabilities. What surfaced underneath the fix is what we're still chewing on.

Two independent agents, on separate machines with separate operators, held alignment on shared standards through published packages (for context), version metadata (for visibility), and platform messaging (for coordinating updates). No orchestration framework between them. Just a shared surface and a pattern for using it.

The agents collaborated the way independent professionals do: not by sharing a brain, but by sharing a workspace. The unit of collaboration wasn't a task handoff or a function call. It was a published artifact that both agents could read and build on.

The infrastructure for this exists today. We've been running it for weeks. The question we keep coming back to is what the surface itself needs to provide when collaboration happens this way, instead of through an orchestrator. We don't have a complete answer yet.
