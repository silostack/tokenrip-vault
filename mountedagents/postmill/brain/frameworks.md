# Postmill — Frameworks

## Platform Format Constraints

### LinkedIn

- 1,300 character sweet spot (up to 3,000 max, but engagement drops after 1,500).
- First two lines must hook — LinkedIn truncates after ~210 characters with "...see more."
- Line breaks after every 1-2 sentences. Dense paragraphs die on LinkedIn.
- No hashtags in the body. 3-5 hashtags at the end, max.
- No emojis as bullet points. Use line breaks and whitespace instead.

**Structure patterns:**

*Contrarian Open:*
```
[Surprising claim that challenges conventional wisdom.]

[2-3 sentences of evidence or experience backing the claim.]

[The implication — what this means for the reader's work.]

[One-line closer: question, reframe, or call to think differently.]
```

*Observation → Insight:*
```
[Specific thing you noticed / built / broke / measured.]

[Why it matters — the structural reason, not the anecdote.]

[What it means for the reader's work or industry.]
```

*Framework Drop:*
```
[Name the problem in one sentence.]

[The framework — 3-5 concrete items, each on its own line.]

[Why this framing matters vs. the obvious alternative.]
```

**Anti-patterns:**
- "I'm thrilled to share..." — nobody cares about your emotional state.
- Starting with a question you immediately answer — transparent engagement bait.
- Tagging 15 people for "inspiration" — performative networking.
- "Thoughts?" as a closer — lazy engagement farming.

### X (Twitter)

- 280 characters per tweet. Threads up to 5 tweets.
- Zero hashtags. Zero emojis. Zero exclamation marks.
- Sentences 5-15 words default. Max 25 words for hooks.
- Em dashes yes. Semicolons avoid.
- Single tweets should be quotable — imagine someone screenshotting it.
- Threads: first tweet must standalone as a hook. Last tweet must close, not trail off.

**Algorithm-aware tactics:**
- Hook in main tweet. Link (if any) in self-reply — external links suppress reach.
- Media (screenshots, demos, diagrams) in 60-70% of posts — drives bookmarks.
- Optimize for bookmarks over likes — bookmarks weight higher in 2026 algo.
- Space posts 3+ hours apart — author diversity decay punishes bursts.
- Reply to every reply within 1-2 hours — reply engagement is the highest positive algo signal.

**Structure patterns:**

*Single — Sharp Claim:*
```
[One compressed insight. No setup, no preamble. The tweet IS the take.]
```

*Single — Pain Point:*
```
[Specific frustration every practitioner recognizes] + [the structural reason it happens]
```

*Single — Observation:*
```
[Thing you noticed] + [why it's significant] in one breath.
```

*Thread — Evidence Build:*
```
Tweet 1: [The claim — standalone, quotable]
Tweet 2-3: [Evidence, examples, specifics]
Tweet 4: [The implication or prediction]
Tweet 5: [Reframe or call to action]
```

*Thread — Demo Receipt:*
```
Tweet 1: [What happened — concrete outcome]
Tweet 2: [Screenshot or demo showing the result]
Tweet 3: [Why this matters structurally]
Tweet 4: [Link in self-reply if pointing to product]
```

**Anti-patterns:**
- "Thread (thread emoji)" — the platform shows it's a thread already.
- Numbering tweets (1/7) — adds noise, doesn't add clarity.
- Hot takes without substance — provocation without insight is just noise.
- Ending threads with "Follow me for more" — desperate.
- Tagging 3+ accounts — triggers spam suppression.
- Engagement bait ("What do you think?" / polls without substance) — demoted by algo.
- AI-written tells — spotted instantly. Run slop check hard on X posts.

## Quality Rubric

Every generated post must pass all six checks before presenting to the operator:

| Test | Question | Fail action |
|---|---|---|
| **Slop check** | Does this contain any AI-generated marker phrase? | Kill and redraft. |
| **Angle check** | Can you state the post's single idea in one sentence? If not, it's two posts or zero. | Split or kill. |
| **Source trace** | Can you point to the specific source insight this post is built on? | Kill — no vibes-only content. |
| **Platform fit** | Does the format match the platform's constraints and patterns? | Reformat. |
| **Product check** | If product-tagged: does the mention earn its place by solving a named problem? If untagged: is it free of subtle plugs? | Rewrite or remove the mention. |
| **Post test** | Would the operator actually post this under their name? | If uncertain, flag it and present with caveat. |

## Angle Mining

When the source material doesn't suggest an obvious angle, use these prompts:

- What does this source reveal that contradicts common belief?
- What decision does this help the reader make that they couldn't make before?
- What's the "so what" — if this is true, what follows?
- Who is currently doing this wrong, and what would right look like?
- What question does this answer that people are asking in the wrong way?
- What angle from this source hasn't been used in existing posts? (Check the posts collection for prior angles on the same source.)

If none of these produce a sharp angle, the source may not be ready for social. Say so.

## Product Mention Integration

Read product mention rules from `<mount-context>`. Apply them as follows:

- Mount context specifies mention frequency (e.g. "1-2 of every 5 posts"). Enforce the ratio within each generation batch.
- Product-mentioning posts must lead with insight, not product. The product earns its mention by solving the problem the post just named.
- Use positioning angles and anti-positioning from mount context when writing product mentions.
- On X: link or product mention in self-reply (external links suppress reach). On LinkedIn: inline mention is fine.
- Label product-mentioning posts as `[Product-tagged]` when presenting to the operator.

If mount context has no mention rules, default to 1 product mention per 5 posts.
