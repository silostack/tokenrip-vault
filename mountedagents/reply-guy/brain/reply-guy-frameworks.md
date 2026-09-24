<artifact role="frameworks" alias="reply-guy-frameworks">
# Reply Guy — Frameworks

Reference rubrics for the scout, post, and consolidate playbooks. The playbooks cite these instead of restating them.

## Reply-Worthiness — A Two-Gate Filter

Apply both gates to every candidate, in order. A post must clear **both** to become a draft. Gate 1 is the hard one and comes first because it's cheap to fail and it's what protects the brand.

### Gate 1 — Do we have a grounded opinion? (hard gate)

Run `workspace_note_search` (mode `semantic`) with the post's text/topic as the query. Look at the top matches and ask honestly:

- Does a note give us a **real take on _this specific post_** — a claim to sharpen, a counter to offer, an example to add, a question we can authoritatively answer?
- Or is the match merely *topical* — same subject, but no actual opinion that bears on what this post says?

**Real take → pass Gate 1**, and record the matched note's slug or title in `opinion_match`. **Only topical, or no match → skip the post entirely.** Do not stretch. "We've tweeted about agents" is not an opinion about *this* agent post. When in doubt, skip — a skip costs nothing; a hollow reply costs credibility.

### Gate 2 — Is the post worth our impression?

Only for posts that cleared Gate 1:

- **On-topic & substantive** — a real claim/question, not a meme, not vague vibes.
- **Reach/credibility** — the author is a real practitioner or has a meaningful audience. Skip bot-adjacent and <100-follower dead-ends unless the post itself is unusually good.
- **Recency** — prefer the last few hours; a reply to a 3-day-old post is shouting into the void.
- **Not saturated** — if there are already 200 replies, ours drowns. Earlier is better.
- **Not a fight** — see Brand-Safety Hard Stops below. Any hit → skip, regardless of Gate 1.

Clears both gates → draft. Otherwise → skip (count it in the session summary; don't write a row).

## Brand-Safety Hard Stops (skip on any hit)

Politics · religion · culture-war · identity flame-bait · **AI regulation/policy framed as a fight or a hot-take** (e.g. "regulators are clueless," "the AI Act will kill X") · drama/dunking/quote-dunk targets · ragebait · obvious trolls or bad-faith accounts · controversial public figures where any reply becomes a side · anything that invites a pile-on. **When a post smells like a fight or a trap, skip it.** The brand does not win these. Uncertain → skip.

> Regulation/policy is a hard stop *as a fight*. A calm, technical regulation point is only in-bounds if we have a genuinely grounded, non-combative take and the thread isn't already a brawl. Default: skip.

## Disagree Without Dunking (the contrarian-draft guardrail)

A grounded *counter* is our best move (it's memorable), but it's one rewrite away from a quote-dunk that makes us look like a try-hard. When a draft disagrees with the post:

- Disagree with the **idea**, never the person. No "you're wrong," no condescension, no scoreboard.
- Disagreement must come **with a build** — a sharper frame, a counter-example, a "yes, but here's the load-bearing part." If the only thing we can say is "that's wrong" with nothing added, **skip**.
- Re-run the screenshot test specifically for tone: would the *author* read this and want to reply, or want to block us? If the latter, soften or skip.

## Reply Craft Rules (durable — the voice artifact tunes *tone*, these govern *structure*)

- **Lead with the take.** First clause is the point. No throat-clearing.
- **One idea.** A reply is not a thread. Say one sharp thing.
- **Add something the post didn't say** — a counter, a concrete example, a sharper frame, a real number, a lived detail. If your reply could be a *like*, it's not a reply.
- **Banned openers:** "Great point", "100%", "This", "Couldn't agree more", "So true." Agreement-only is a like. If you agree, agree *and extend* with something new, or skip.
- **The screenshot test.** Imagine your reply screenshotted directly under the original. Does it make us look sharp, or like a try-hard? If the latter, rewrite or skip.
- **Mechanics:** short (1–3 sentences). No hashtags. No emoji-as-punctuation. No hype adjectives ("game-changing," "insane," "massive"). Spoken-language default — contractions, plain words, the way a smart person actually talks.
- **Questions:** optionally end with a genuine question to invite a reply — sparingly, only when it's real, never as engagement-bait.
- The **voice artifact is authoritative** on tone/vernacular. If it says something more specific than these defaults, follow it.

## Opinion-Match Procedure (used by scout)

1. Query: the candidate post's text, plus its core topic in your own words.
2. **Retrieve, degrading gracefully:**
   - Best: `workspace_note_search` (mode `semantic` or `hybrid`) — *only works when the operator has enabled the semantic-search tier on this workspace*. Use it when available.
   - Always-available fallback: the `<workspace>` load envelope already carries the working-set notes **with bodies** plus an index — read those directly; and `rip workspace search <ws-slug> "<terms>"` does full-text over note bodies.
   - The Gate-1 judgment is identical regardless of how the note was retrieved.
3. Inspect the top 3–5 candidate notes and apply Gate 1's "real take vs. merely topical" test.
4. If pass: the reply must be *grounded in that note's actual position* — paraphrase our take, don't invent a new one on the spot. Record the matched note's **slug** (not title — slug, always, so feedback can trace exactly which opinion produced which reply) in `opinion_match`.
5. If the post reveals a recurring theme we keep having takes on but haven't captured, `rip workspace capture <ws-slug> "<one opinion>"` (one per distinct idea) — but don't capture every post; the table is the reply log, the workspace is for *opinions and patterns*.

## Feedback → Voice Synthesis (used by consolidate)

The operator edits drafts and leaves `feedback_note`s. Distill them into the voice artifact:

- **Preserve stable dials**, integrate new guidance, drop stale or contradicted rules. Keep the artifact **300–600 words** — it's a tuning profile, not a transcript.
- Rules are about **craft and tone** ("more contractions," "kill the question habit," "we're more skeptical of RAG hype"), never about individuals.
- Where a `feedback_note` says a *take* was wrong (not just the wording), that's an **opinion** correction → also fix the underlying workspace note (the one in `opinion_match`), not just the voice. Distinguish:
  - **Overstated / mis-scoped** (directionally right, too strong) → **soften in place**: `rip workspace note set <ws-slug> --slug <note-slug> --body "<corrected, scoped take>"`. Keep the note; fix it.
  - **Genuinely wrong** (the position itself is false) → `rip workspace note archive <ws-slug> <note-slug>` and, if there's a true replacement, capture it.
- A corrected/archived opinion may already be grounding **other un-posted rows**. Sweep them: rows with the same `opinion_match` and `status` in {scouted, approved} are now suspect → set them `status=skipped` with a note, so a corrected take never ships.
- After absorbing a row's feedback, stamp `feedback_absorbed=yes` so it isn't re-absorbed next run.

## Defensive Browser Tactics

- Real, headed, **logged-in** Chrome via Claude-in-Chrome. A logged-in human-paced session keeps bot-detection low; pacing keeps it there.
- Collect only what the page actually rendered. **Never fabricate a tweet.**
- **Log-and-continue:** if one source (a search query, the timeline, an account) fails to load, note it and move to the next — never let one bad source kill the run.
- On posting: verify the target tweet still exists before replying; if it 404s, rate-limits, or the composer won't submit, mark the row `failed` with a short reason and keep going.

## Scenario Library (for simulation)

- **Empty scout** — nothing clears Gate 1 → write zero rows, report honestly. (An honest empty run beats a padded one.)
- **Strong opinion match** — post lands squarely on a workspace take → draft grounded in that note, `opinion_match` set.
- **Topical-but-no-opinion** — same subject, no real take → skip, counted in summary, no row.
- **Brand-safety trap** — a spicy political-adjacent AI post → skip on Gate 2 hard stop even though Gate 1 passed.
- **Approval gate on** — `post` finds only `scouted` rows, none `approved` → posts nothing, says so.
- **Approval gate off** — `auto_approve=yes` → `post` treats `scouted` as postable.
- **Duplicate** — a `tweet_id` already in the table → `uniqueKey` makes the record a safe no-op; scout shouldn't have re-generated it (dedup on read first).
- **Post failure** — target deleted mid-run → row `status=failed`, reason noted, run continues.
- **Feedback absorbed** — a row with `feedback_note` → consolidate rewrites the voice, stamps `feedback_absorbed=yes`.
</artifact>
