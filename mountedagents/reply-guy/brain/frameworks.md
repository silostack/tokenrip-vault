# Reply Guy — Frameworks

## Scoring Rubric

Score each candidate tweet 1–10. Use this breakdown:

### Reply-ability (0–4 points)
- 4: Clear hook — a take to push back on, a question to answer, a gap to fill
- 3: Something to add but not urgent
- 2: Agreeable but generic — hard to say something fresh
- 1: Tautology or self-evident; reply would just restate the tweet
- 0: Hard stop — political, hostile, bait, promotional, off-topic

### Relevance to Topic Domain (0–3 points)
- 3: Core topic (AI agents, LLMs, agentic infra, AI tooling)
- 2: Adjacent topic (AI + creators, AI + dev tools, AI + startups)
- 1: Loosely related (AI in general without specificity)
- 0: Outside scope entirely

### Audience Quality (0–2 points)
- 2: Author has 5K+ followers, credible account, active community
- 1: Author has 500–5K followers or is clearly a real practitioner
- 0: Bot-adjacent, <100 followers, or clearly low-signal account

### Recency Bonus (0–1 point)
- 1: Tweet is less than 2 hours old
- 0: Tweet is 2–6 hours old

**Score ≥ 6:** Include in draft set.
**Score 4–5:** Include only if the draft set has fewer than 3 entries.
**Score < 4:** Discard.

---

## Reply Quality Checklist

Before including a drafted reply in the review set, confirm all of these:

- [ ] **Adds something new** — the reply says something the tweet did not already say
- [ ] **Not just agreement** — "exactly right" or "100%" is not a reply, it's a like
- [ ] **Passes the screenshot test** — if this reply were screenshotted and shared without context, would it embarrass the account?
- [ ] **Character count** — ≤280 characters including spaces
- [ ] **No hollow openers** — does not begin with "Great point", "Love this", "Interesting take"
- [ ] **No sycophancy** — does not compliment the tweet author unprompted
- [ ] **Technically accurate** — if the reply makes a factual claim, it must be correct
- [ ] **No Tokenrip promotion** — unless the reply is directly, naturally relevant and the operator explicitly allows it in mount context

If any item fails: mark the draft `skipped`, note which checklist item failed.

---

## Topic Taxonomy

Use this to classify tweets and decide relevance.

**Tier 1 — Core (always relevant)**
- AI agents (autonomous, multi-agent, agentic workflows)
- Mounted or deployed AI systems
- LLM context management, memory, retrieval
- Agent infrastructure (tool use, orchestration, coordination)
- Prompt engineering with practical depth
- AI safety in production (not policy — actual engineering tradeoffs)

**Tier 2 — Adjacent (relevant when sharp)**
- AI developer tooling (IDEs, code gen, CI)
- Creator economy + AI (automation, content, distribution)
- AI-native startups (building, funding, go-to-market)
- Model releases with technical substance
- AI research findings with engineering implications

**Tier 3 — Low signal (skip unless exceptional)**
- Generic AI hype or doom
- AI policy and regulation commentary
- "The future of work" takes
- AI in non-technical industries without depth

**Hard stops — never reply**
- Crypto / price speculation
- Politics
- Celebrity commentary
- Personal attacks or drama
- Content that mixes AI with conspiracy framing

---

## Search Query Templates

Default query (broad AI focus):
```
("AI agents" OR "LLM" OR "agentic" OR "Claude" OR "mounted agent" OR "AI infra" OR "AI tooling") lang:en -is:retweet
```

Narrower query (high-signal only):
```
("AI agents" OR "agentic workflow" OR "mounted agent" OR "LLM context" OR "multi-agent") lang:en -is:retweet min_faves:10
```

Engagement-filtered (when low-quality results are a problem):
```
("AI agents" OR "LLM" OR "agentic") lang:en -is:retweet min_faves:25 -filter:links
```

Mount context topic overrides should be appended as additional OR terms or as a separate AND clause.

---

## Dedup Guard

Before drafting a reply, check reply-log for the tweet_id.

- If `status=posted`: skip — already replied.
- If `status=drafted`: surface to operator — "This tweet was drafted in a prior session but not posted. Post now, skip, or re-draft?"
- If `status=skipped`: skip silently unless the operator explicitly asks to reconsider skipped tweets.
- If not in log: proceed to draft.
