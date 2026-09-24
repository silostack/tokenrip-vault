# Reply Guy — Mount Context

<!-- This configures one deployment of Reply Guy. The agent reads it at the start of every session.
     Fill in the handle and at least one source before the first scout. The opinions you seed
     below become the workspace corpus the agent grounds every reply in. -->

## Account Handle
<!-- The X/Twitter username (without @) this agent posts as. e.g. "tokenrip" -->

## Browser Setup
<!-- The agent posts through your existing logged-in Chrome session — no credentials are stored here.
     Make sure this account is logged in on Chrome before running `scout` or `post`.
     If you see auth errors during posting, you're logged out. -->
Ensure this X account is logged in on Chrome before running a session.

## Scout Sources
<!-- Configure where scout hunts. Enable any combination. -->

### Search queries
<!-- One X search query per line. Use X operators. e.g.
     ("AI agents" OR "agentic") lang:en -is:retweet min_faves:20
     ("agent memory" OR "context window") lang:en -is:retweet -->

### Home timeline
<!-- "on" to also scan the Following timeline of the logged-in account, or "off". -->
off

### Target accounts
<!-- Handles to watch directly, one per line (without @). High-value voices in our space. e.g.
     swyx
     simonw -->

## Tokenrip Facts (stable grounding)
<!-- A few true, stable facts about Tokenrip the agent can lean on when relevant.
     Keep it factual — these ground claims so the agent never fabricates. e.g.
     "Tokenrip is a substrate for mounted agents — portable agent packages with memory."
     Do NOT instruct the agent to promote these; that's governed by mount context, and default is no shilling. -->

## Voice Seed
<!-- 3–5 adjectives + any specifics for how replies should sound. Seeds the voice profile on first run;
     refined later by `consolidate` from your feedback. e.g.
     "opinionated, spoken, dry, technically grounded, concise. Heavy contractions. No questions at the end." -->

## Opinions To Seed
<!-- The takes this agent replies FROM. Each becomes a workspace note. One opinion per bullet —
     a real position, not a topic. The richer this list, the more posts the agent can ground a reply on. e.g.
     - Collaboration beats coordination: most "multi-agent" systems are just coordination with extra steps.
     - Agent memory is an infra problem, not a prompt problem.
     - Most "autonomous agent" demos break the moment they touch a real workflow. -->

## Limits
<!-- Keep volume human-paced — this protects the account. -->
- Daily scout cap (max drafts queued per scout run): 15
- Daily post cap (max replies posted per post run): 10
- Min spacing between posts (minutes): 8

## Approval
<!-- "off" = every reply waits for your approval in the dashboard before `post` will publish it (recommended
     until the voice is dialed in). "on" = `post` publishes scouted drafts without manual approval —
     only turn this on once drafts reliably need no edits. -->
auto_approve: off

## No-Go Topics
<!-- Topics this deployment must never reply on, beyond the built-in brand-safety stops (politics, drama, etc.).
     One per line. -->
