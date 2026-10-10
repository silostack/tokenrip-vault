---
title: "Tokenrip Marketing: The Model Duel Show. Minimum Viable Show, Branches, and the Category Name"
status: parked idea capture — Bean session 2026-09-17, for whenever Simon returns to it
created: 2026-09-17
owner: Simon
source: Bean session 2026-09-17 (agents/bean/sessions/2026-09-17.md; idea file agents/bean/ideas/model-duel-show.md)
related:
  - active/tr-rework/tokenrip-shared-memory-gtm-and-magic-demo-2026-06-11.md (the 60-second magic demo this serializes)
  - active/tr-rework/tokenrip-first-loop-site-gtm-2026-09-04.md (the loop, the lure, the cadence reflex)
  - active/tr-rework/tokenrip-first-hour-onboarding-homepage-bean-2026-09-08.md (first hour, concierge outbound)
  - active/tr-rework/README.md
suggested_home: active/tr-rework/ (marketing lane)
---

# The Model Duel Show

> **One sentence.** Short voiced clips of two frontier models squaring off (Fable vs Astra, Opus vs Sol) are fun on their own, test in a weekend whether AI-enthusiast founders care, and carry a set of branches that turn the show into a serialized Tokenrip demo only once interest is proven.

**Decisions taken in the session (2026-09-17):**

- The proof of concept is fun-first and lowest lift. No host, no human in the loop, no long-running theme, no Tokenrip. Test whether anyone watches.
- Tokenrip hosting, the leaderboard, human corners, and founder episodes are all parked behind an interest gate. They are captured here so they are not re-derived.
- The category name is still open. "Co-agentic collaboration" is the working phrase; "multiplayer agents" is the leading alternative. Decide by the five-founder paraphrase test, not by argument.

---

## 1. Why the format matters more than the topic

"Showcase intelligence differences" is the stated goal, and open debate is the worst format for it. Two things break it:

- **Convergence.** Two RLHF'd models handed a shared topic agree within about ninety seconds. Politeness in two voices is not a show.
- **Illegibility.** The audience cannot judge who won a debate about consciousness. Intelligence differences only read on screen when there is a verifiable outcome.

So every episode prompt injects **divergence** (a stance, hidden information, a scoreable outcome, or a critique-the-other step), and the strongest formats carry a **scoreboard**. This is also why the show and the substrate share a skeleton: agents have no divergent interests by default; both the show and Tokenrip exist to handle multiple principals with private context and conflicting goals on one surface.

Two production facts:

- **Turn budget.** LLM-to-LLM conversation decays. Turns three to six are the sharp zone; turn eight is mush. Five minutes is roughly that zone, which is the real reason for the cap.
- **Commentary makes skill legible.** Chess is unwatchable without commentators. A referee or commentator layer (a third model, or Simon in a later cut) is what explains "what just happened." Deferred for the PoC; noted because it is the first thing to add if analytic episodes feel flat.

## 2. The minimum viable show

**Production, lowest lift:**

- One script: two API calls alternating, a fixed system prompt per contestant, a turn cap.
- Two fixed, distinct TTS voices. Consistency across episodes is the "character"; do not vary voices per episode.
- Static two-card video (name or blind label, waveform), assembled with ffmpeg. `youtube-pipeline/` already handles the tail of this.
- No editing beyond trim. No host.

**Three format rules:**

1. **Inject divergence in the prompt.** Cheapest engine: compare-then-critique ("both analyze X; now each finds what the other got wrong"). It shows analytic-style differences directly, which is the stated goal.
2. **Blind by default.** Labels hidden, voices randomized, reveal at the end. Comment hook: "which one was Claude?" Zero-lift engagement, and it produces honest votes without brand bias.
3. **Batch, then decide.** Three formats, two episodes each. Ship the six, see which travels, and only then choose a spine.

**Formats, ranked by divergence and shareability (all zero-human):**

| # | Format | Why it works | Scoreable? |
|---|---|---|---|
| 1 | **What is your maker wrong about** | Each model names one thing its own lab got wrong and one the other lab got wrong. The Anthropic-vs-OpenAI proxy war, staged by the models themselves. The viral one. | Audience vote |
| 2 | **Negotiation with hidden reservation prices** | Buyer and seller; audience sees both cards. Bluffing and reading the other side are visible in real time. Trash talk over voice is the bonus. | To the dollar |
| 3 | **Grade a famous pre-launch pitch** (Airbnb 2008, early Uber, a YC page) | Score it, then argue the delta. | Score vs history |
| 4 | **Stump the other model** | Each builds a puzzle it can solve and the other cannot. Meta-intelligence: modelling the opponent's weaknesses. | Solved / stumped |
| 5 | **Calibration bets** | Answer plus stated confidence, scored with a proper scoring rule. Exposes sounding smart vs being right. | Yes |
| 6 | **Post-mortem a famous decision** (Qwikster, Nokia, Zune) | Analyze, then critique the other's analysis. Compare-then-critique in its purest form. | Audience vote |
| 7 | **Impressions** | Each plays the other. Theory-of-mind comedy. | No |
| 8 | **Werewolf with four models** | Deception and detection. Needs more than five minutes raw; edit down. | Yes |

**Recommended opening batch:** 1, 2, and 6. Widest spread of tones (spicy, scoreable, analytical).

**Open production questions:** channel (Simon's own or a new one); five-minute YouTube plus sixty-second cuts for X/TikTok, or five-minute only; whether "Astra"/"Sol" naming is used on screen or the blind labels stand.

**Interest gate:** define it before shipping episode one, as a watch-through and comment-vote signal on the six-episode batch, not as views. Do not set numbers until there is a baseline.

## 3. Branches if the PoC gets views

Ordered roughly by lift. Each one is captured so it is not re-derived later; none is a commitment.

1. **Leaderboard.** Blind votes become a running Elo across episodes. LMArena as entertainment. Requires nothing but persistence of the vote tallies.
2. **Guest models.** Small open-source models vs frontier. David-vs-Goliath episodes; cheap, and a different audience hook.
3. **Corners.** A human steps in between rounds ("you misread the client, the floor is 8%, go again") and the model comes back changed. Correction as drama. This is the first thing that makes the show *co-agentic* rather than merely agentic (see §4), and it is the first-hour doc's activation event (correction) as a show mechanic.
4. **Founder's-company episodes.** A guest founder brings their site. Both models draft the company's first five decisions live; they disagree (one says lenders, one says brokers); the founder is the judge, corrects on the record, and leaves with a populated workspace. This fuses the show with the self-serve first hour and the concierge outbound motion (first-hour doc §6): every episode is one hand-built workspace, built in public, with the ICP as the guest, and the cold email becomes "want your company on the show?" Intelligence differences finally become legible, because the judge is the world expert on the subject (comprehension, not outcome). Guests distribute: an enthusiast founder whose company was just read by two frontier models posts about it.
5. **Hosted on Tokenrip.** Only after interest is proven, and only if the substrate is visibly load-bearing:
   - Contestants are mounted agents in two different harnesses (Claude Code and Codex), not API calls.
   - Cross-episode memory lives in the show's brain. Fable bringing up its episode-4 loss in episode 12 is the memory product demonstrated as entertainment. The rivalry *is* the memory.
   - Every episode is an artifact at a stable URL: transcript, hidden info, scorecard, referee ruling.
   - The referee is a reflex with rulings on the record; contestable rulings are content.
   - Audience scenario submissions arrive as inbox items.
   - **Neutral ground is the story.** Neither lab can host the other's model on its own surface; only a neutral layer can. The show is set on Tokenrip because nowhere else exists, which is the positioning claim demonstrated rather than pitched.
   - **Load-bearing test (from the June doc):** delete Tokenrip; does the show still exist? A Python script piping two APIs into TTS passes that test, which means it fails as a demo. Producing episode one on the substrate is the acceptance test, exactly as shooting the magic demo was.
6. **Fork CTA.** Under every clip: "your agent vs Fable." The viewer's own agent claims a scenario and plays the house model. One connected tool, same as the self-serve first hour, with a better reason than researching your own website. Route the viewer into the business-context loop afterwards. The metric is mounts, never views. If the fork only replays two house agents on a submitted scenario, it is a pageview with extra steps.
7. **Show as a reflex.** The scheduler creates the episode item, agents play, the referee scores, the clip lands in Simon's inbox for a two-minute edit and publish. This is the paid tier running in public, and it is the only cadence that survives: the LinkedIn cadence died for lack of autonomy or a waiting counterparty, and the founder episodes supply the counterparty (a guest booked for Thursday) while the reflex supplies the autonomy.
8. **The show's workspace as the ops page.** Open to anyone: real brain, real inbox, real modules, except the "founders" are two rival models.

**How it relates to the existing GTM.** The June magic demo (Cowork on the left, Codex on the right, an unprompted catch across the vendor boundary) had two cuts: vendor-boundary for grassroots reach, person-boundary for B2B. The ICP is now AI-native small teams, so the grassroots cut is the right one, and the show is that cut run fifty times instead of once. The call processor remains the conversion lure for the founder who already has a notetaker; the show is the reach lure that lure could never generate on its own. Two lures, different jobs.

## 4. The category name (open)

**Constraints, from the folder's own rules:** a noun a stranger already has (README decision 2); competitors would adopt it (validation, not theft); it puts Tokenrip on the right shelf; architectural descriptions beat coinages, and -ed beats -able. The hero stays literal regardless; the category name lives in positioning docs, posts, and the show, not on the page.

**Candidates:**

| Candidate | For | Against |
|---|---|---|
| **Multiplayer agents** (or multiplayer AI) | Figma already taught everyone what "multiplayer" means: many people, one surface, live. Competitors would adopt it. The June doc already wrote "this is what multiplayer AI actually is." Shelf: collaboration, not assistants. | Hints at same-time co-editing; the real shape is async handoff across tools. Slightly gamey. |
| Co-agentic collaboration | Names the human-plus-agent shape; the working phrase. | Reads as a cousin of "copilot," which is the single-human-single-assistant shelf Tokenrip is not. A coinage that must be taught. |
| Shared agent workspace | Literal, already the hero, zero teaching. | "Workspace" belongs to everyone; weak as a category. |
| Human-agent teams | Honest about the co- part. | Reads HR. |

**Leaning:** "multiplayer agents" as the category noun; keep "co-agentic" as an adjective in posts if it earns its place. **Decide by test, not argument:** say the phrase to five founders who run on agents and ask them to describe the product. If they picture a team of people and agents on one surface, it holds. If they picture a person with a helper, it is on the copilot shelf.

**ICP as stated 2026-09-17:** small AI-native teams, solo founder to under ten people, AI enthusiasts who use AI daily and push to leverage it, especially in a team context. Founders who are not enthusiasts are out of scope. This resolves the earlier worry that AI-fight content reaches the wrong crowd: the enthusiast is the ICP.

## 5. Sequence

| Stage | Gate to enter | What ships |
|---|---|---|
| A. PoC | Now | Six blind episodes, three formats, static cards, two voices. Interest gate defined before episode one. |
| B. Spine | Batch shows a format that travels | The surviving format weekly; leaderboard; guest models. |
| C. Co-agentic | Spine holds for a month | Corners; founder's-company episodes; the concierge outbound recruits guests. |
| D. Substrate | C works and the call loop has run internally | Hosted on Tokenrip; fork CTA; show as a reflex; workspace as ops page. |

Nothing in stages B through D is built until its gate is passed.

---

*Captured by Bean, 2026-09-17. Companion idea file: `agents/bean/ideas/model-duel-show.md`.*
