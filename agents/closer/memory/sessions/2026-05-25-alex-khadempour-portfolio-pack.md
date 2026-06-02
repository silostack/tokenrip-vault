# Closer Session — Alex Khadempour Portfolio Pack — 2026-05-25

**Mode**: Deal Review + Follow-up Coaching (firm-direct, post-discovery deliverable)
**Deal**: Alex Khadempour, CICS Immigration (Vancouver RCIC, 20yr in industry)
**Trigger**: Process-call analysis flagged "show me examples" as the third consecutive firm-direct call hitting the same gating objection — and Alex specifically asked to see work. Portfolio pack is the gating deliverable for the proposal.

## What was decided

### Portfolio pack format

- **Email + 2 live tokenrip.com links + 1 Loom walkthrough.**
- No PDF, no deck, no portfolio site. Polish slows shipping; Alex asked for examples, not collateral.
- Two agent pages are what `/agents` actually contains (Chief of Staff + Moa). Don't pad.

### Why these two examples

| Piece | What it proves |
|---|---|
| Chief of Staff at `/agents/chief-of-staff` | Persistent memory works, behind-the-scenes, real running product. Direct match to what Alek pitched on the call. |
| Moa at `/agents/moa` | Tokenrip ships custom builds fast. Substrate exists. Not starting from zero per client. |
| Loom of Chief of Staff (90s) | Persistent memory mechanic *operating*, not described. Bridge to Alex's domain at the end ("same mechanic catches name across passport / diploma / questionnaire"). |

### Loom decision

Yes, but with quality gate: if Simon's second take isn't shippable, scrap Loom and send email with just the two links. Don't let perfect-Loom delay the email past Friday. Loom carries the architectural aha; without it, the email still ships.

### Loom script (90s, in order)

1. (10s) "Chief of Staff running on Tokenrip. The AI agent we use to run the company."
2. (30s) Ask for memory: "What did we decide on the Luai proposal pricing last week?" Pulls from memory.
3. (30s) Show the memory view itself — make the architecture visible.
4. (10-20s) Bridge: "Same memory architecture would catch a client name spelled three different ways across passport, diploma, and questionnaire. That's the bot we'd build you."

## The email — final draft (humanized, shippable)

Subject: Following up — the work you asked to see, plus the Bill C-3 piece

```
Alex,

Good to talk yesterday. Three things.

The two agents you can see live today:

- Chief of Staff: tokenrip.com/agents/chief-of-staff. Runs as an
  internal team member, persistent memory across sessions, sits
  behind the scenes. Same architecture pattern we'd build for
  case review.

- Moa: tokenrip.com/agents/moa. The agent that builds the agents.
  It's how we ship custom builds fast instead of starting from
  scratch for each client.

I also put together a 90-second walkthrough of Chief of Staff in
action: [Loom link]. The memory mechanic in that video is the
same one that would catch "this client wrote X in the
questionnaire, their passport says Y" on your end.

One thing from the call worth being explicit on. Nothing we'd
build for you sits in front of your client. The AI receptionist
experience you described is exactly where AI underdelivers right
now. Behind the scenes is where it earns its keep, on review and
qualification and document checking. Your team stays the face of
CICS.

I'm putting a tailored proposal together over the weekend, scoped
around the Bill C-3 qualification chatbot you mentioned. Lands in
your inbox Monday. One question before I finalize it: when you do
application reviews today, are you running them yourself, or do
you have case managers doing first-pass review? It changes the
shape of Phase 2 in the proposal.

Talk Monday.

Alek
```

### Why this email works (against playbook)

- **Lead with their outcome, not architecture.** Body has zero infrastructure language. The Loom carries the architectural mechanic, not the prose.
- **Burden on us.** "Lands in your inbox Monday" is a dated commitment from our side. "Talk Monday" closes implicitly.
- **Closes the AI-receptionist objection** before the proposal lands. He named the objection unprompted on the call; we close that door in his own framing.
- **Specific links, not vague claims.** Two URLs Alex can click.
- **Clarifying question pulls a reply** without requiring one. The answer shapes the proposal; absence of answer doesn't block anything.

### Humanizer pass

Killed three em dashes. Killed "Three things below" (passive). Kept first-person voice, no boldface, no rule-of-three.

## Commitments

| # | Action | Owner | Due |
|---|---|---|---|
| 1 | Decide proposal lead: Bill C-3 qualification bot (recommended) vs. application review | Simon + Alek | Thu 2026-05-26 EOD |
| 2 | Record 90s Loom walkthrough of Chief of Staff with the immigration-domain bridge at the end | Simon | Fri 2026-05-27 EOD |
| 3 | Send portfolio email above (with Loom if recorded, without if not) | Alek | Fri 2026-05-27 EOD |
| 4 | Draft tailored proposal — Bill C-3 chatbot (Track A, $5K design-partner), application review (Track B add-on), hub deferred | Alek + Simon | Sun 2026-05-28 EOD |
| 5 | Send proposal to Alex | Alek | Mon 2026-05-29 by noon Pacific |

### Stall-risk gate

If no reply by **Wed 2026-06-03** (3 days after proposal lands), prescribe dated follow-up. Don't let silence-after-yes eat this deal.

## Patterns surfaced

### New: Warm-prospect portfolio rules differ from cold Upwork rules

The Upwork playbook says "platform-as-credential beats portfolio-as-showcase" and warns against linking `/agents` in cold proposals (only ~2 agents = too thin). **For a warm prospect who has had a discovery call and asked specifically to see work, the rule inverts.** Alex saw the homepage during the call; he wants to see what runs. Pointing him at specific agent pages is the right move — and the "only two agents" concern is actually a feature, because each is a real shipped product with a detail page. The thinness reads as focus, not absence, once the prospect is warm.

**Rule add**: Cold Upwork = link platform, defer agent-count question. Warm firm-direct post-discovery = link specific agents, the discovery call has already established platform credibility.

### New: Domain-bridge sentence is the highest-leverage line in any demo

The Loom is generic CoS without the immigration-domain bridge at the end. The 10-second sentence — "same mechanic catches name across passport / diploma / questionnaire" — is what converts a generic product demo into a prospect-specific proof. **Rule add**: Every demo asset that goes to a specific prospect must end with a one-sentence bridge to *their* domain. Without it, the prospect has to do the translation work, and most won't.

### Recurring: Stated #1 pain vs. AI-vendor reflex pain (now confirmed across 3 firm-direct calls)

Yoda flagged this in the process-call analysis. From Closer's lens, the execution implication is concrete: **the proposal must lead with the wedge the buyer named, not the wedge our template solves.** Alex named the Bill C-3 chatbot unprompted as "maybe that's one area you guys can maybe support us" — that's the lead. The Luai application-review template is the *secondary* track, not the primary. Reflexively cloning the Luai proposal because it exists is the substrate-strength default this pattern keeps surfacing.

## Open questions for future sessions

- Should there be a standing "portfolio-pack" template stored alongside `upwork-proposal-playbook.md` — a checklist for the *warm-prospect* portfolio email distinct from the cold-proposal playbook? Three firm-direct calls have now needed something like this.
- Is there a way to pre-record domain-bridge versions of the Chief of Staff walkthrough for each ICP we're hunting (immigration, dental, insurance) so the bridge sentence is baked in and Simon doesn't have to re-record per prospect?
