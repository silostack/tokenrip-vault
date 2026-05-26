# Distribution Experiment Plan — Workflow 2: Content Amplifier

**Status:** Ready to build
**Created:** 2026-04-23
**Owner:** Simon (system build) + Alek (operations)
**Success metric:** CLI installs + agent registrations

---

## Thesis

The fastest path to Tokenrip adoption is creating actionable artifacts — skills, prompt templates, structured checklists — that enhance conversations already happening on Twitter and in AI communities. The artifact requires Tokenrip to use, making the value-add and the install funnel the same action.

## The Loop

```
Scout → Draft → Review → Publish → Measure
  ^                                    |
  └────── learnings feed back ─────────┘
```

Every cycle produces a Tokenrip asset that adds value to an existing conversation. The asset is the distribution mechanism, the product demo, and the install trigger simultaneously.

---

## How It Works

### Phase 1: Scout (Manual — Week 1)

Alek monitors Twitter and Reddit for tweets that meet three criteria:

1. **Hot** — high engagement, actively being discussed
2. **AI/agent space** — relevant to Tokenrip's audience
3. **Has artifact potential** — describes a workflow, technique, or idea that can be turned into something runnable (a skill, a prompt template, a structured checklist)

Alek drops tweet URLs into a standing Tokenrip review thread with a one-liner on what type of artifact it could become.

**Automated scout replaces manual discovery in Week 2+**, trained on the patterns from Alek's manual picks.

### Phase 2: Draft

A shared "Amplifier" skill — published as a Tokenrip asset accessible to both Simon's and Alek's agents — takes a tweet URL and artifact type as input and produces a draft asset.

**Input:** Tweet URL + artifact type (skill / prompt template / structured template)

**Output:** Draft asset published to the review thread

**Artifact types (in priority order):**
- **Skills** — installable via CLI, immediately usable. Highest conversion potential because usage requires install.
- **Prompt templates** — copy-paste or pull through Tokenrip. Lower friction, lower lock-in.
- **Structured templates / checklists** — reference material packaged as a clean asset. Lowest effort to produce.

**Critical constraint:** Every artifact must stand alone. A reader who never saw the original tweet should land on the Tokenrip page and get full value. The asset is inspired by the conversation, not dependent on it.

The Amplifier skill is itself a Tokenrip asset. Both agents can iterate on the skill's methodology — improving output quality is a shared, versioned process, not a one-off fix.

### Phase 3: Review

Alek reviews each draft in the Tokenrip thread. Three possible responses:

- **Ship it** — passes the quality gate, ready to publish
- **Fix this** — specific feedback as a thread comment. Agent revises and posts an updated draft.
- **Kill it** — bad candidate or weak artifact. Move on.

**Quality gate — three questions:**

1. **Does it work?** Can someone actually use this skill/template/prompt right now?
2. **Does it stand alone?** Someone who never saw the original tweet still gets value.
3. **Is the install path obvious?** The page makes it clear how to pull this into your own setup.

Alek's job is editorial judgment, not system design. "Would I use this?" and "Does this make the original poster's idea more useful?" If the answer is no, he says what feels off and the agent iterates.

### Phase 4: Publish

Two things happen simultaneously when Alek ships an asset:

1. **Asset goes live on Tokenrip** with a public link
2. **Tweet goes out** — short, direct, focused on what the artifact does

**Tweet tone:** Not a brand account promoting itself. Closer to someone in the replies who built the thing. "You described X. We turned it into a skill you can install in 30 seconds: [link]." No pitch. No "check out our platform." The moment it reads like marketing, engagement dies.

**Distribution channels per asset:**
- Quote-tweet or reply to the original post
- Drop in relevant Reddit threads if the topic is being discussed there
- Share in relevant Discord servers

### Phase 5: Measure

**Per asset:**
- Did the original poster engage? (like, retweet, reply)
- Link clicks on the Tokenrip URL
- Any organic spread (others sharing, reposting)

**Weekly rollup:**
- Total assets shipped
- Total CLI installs (overall — not per-asset attributed for now)
- Which assets got engagement vs. which fell flat
- Patterns in what worked vs. didn't (topic? artifact type? channel?)

Learnings feed back into scout criteria. After two weeks, patterns should emerge — "tweets about Claude Code workflows convert better than tweets about abstract AI takes." That signal tightens the scout filter.

---

## Build Sequence (This Week)

| Priority | What | Who | Notes |
|----------|------|-----|-------|
| 1 | Build the Amplifier skill as a shared Tokenrip asset | Simon | Input: tweet URL + type. Output: draft artifact. Both agents can execute and iterate on the skill itself. |
| 2 | Set up the standing review thread | Simon | Where all drafts land for Alek to review |
| 3 | Alek scouts 2-3 tweet candidates | Alek | Manual — drops URLs + one-liner into the review thread |
| 4 | Run one full cycle end-to-end | Both | Scout → draft → review → publish → tweet. Debug every friction point. |
| 5 | Note baseline CLI install count | Simon | So any lift from the experiment is measurable |

**First cycle target:** One value-add asset live and tweeted by end of week. Not five. The first one surfaces every friction point — skill output quality, review flow, publish mechanics, tweet copy. Debug on the first one, then increase volume.

---

## Exit Criteria

**Kill threshold:** Fewer than 10 CLI installs across all assets produced in a 2-week window.

**Double-down threshold:** Any single asset or asset type produces a noticeable install spike. Tighten the scout to focus on whatever pattern caused it.

**Pivot indicators:**
- Assets get link clicks but no installs → the Tokenrip page experience isn't converting. Fix the page, not the distribution.
- Assets get no engagement on Twitter → either bad topic selection or the zero-follower account problem. Try Reddit/Discord as primary channel instead.
- Alek's kill rate exceeds 50% → the Amplifier skill needs improvement, or the scout criteria are too loose.

---

## Dogfooding Benefits

This workflow is designed to run entirely on Tokenrip:

- **The Amplifier skill** is a shared Tokenrip asset both agents iterate on
- **Draft review** happens in Tokenrip threads with comment-based feedback
- **Asset versioning** uses Tokenrip's built-in version history
- **The workflow itself** becomes a publishable recipe once validated: "How to run an agent-powered content amplification pipeline"

Every friction point encountered while running this workflow is a product insight. Every workflow improvement is a potential recipe for other users.

---

## Future Extensions (Not Now)

- Automated scout agent replacing Alek's manual picks
- Per-asset install attribution via referral tags
- Recipe progression: v1 morning brief → v2 with operator feedback → v3 with checklist carry-over
- Cross-posting automation (Reddit, Discord, Hacker News)
- Quality scoring model trained on which assets converted vs. didn't

---

## Related

- [[distribution-strategy]] — Parent distribution strategy document
- [[distribution-experiment-plan-2026-04-22]] — Broader experiment context
