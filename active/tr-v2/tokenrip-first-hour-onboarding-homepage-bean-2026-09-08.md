---
title: "Tokenrip: The First Hour. Onboarding and Homepage Recommendations (Bean's version)"
date: 2026-09-08
status: strategy proposal for evaluation; Bean's counter-proposal to tokenrip-positioning-gtm-onboarding-recommendations-2026-09-08.md. Updated 2026-09-09 with the concierge outbound motion (§6)
scope: onboarding (self-serve first hour and concierge-built workspaces), homepage changes, GTM and pricing implications, measurement
related:
  - active/tr-rework/tokenrip-positioning-gtm-onboarding-recommendations-2026-09-08.md (the proposal this answers)
  - active/tr-rework/tokenrip-homepage-v3.1-2026-09-05.md (the shipped page)
  - active/tr-rework/tokenrip-first-loop-site-gtm-2026-09-04.md (the loop, the queue, the lure)
  - active/tr-rework/tokenrip-brain-terminals-modules-canon-2026-09-01.md (§3, the original onboarding ladder)
  - active/research-tokenrip-file-collaboration-2026-09-08.md
  - agents/bean/ideas/audience-led-deployment.md (the May white-glove ladder this motion re-runs)
---

# Tokenrip: the workspace is not empty at first connect

## Executive recommendation

Keep the positioning and the page. Change what happens in the visitor's first hour.

The 09-08 proposal correctly found the hole: the page shows a workspace with 51 decisions and 1,204 files, and the visitor gets an empty one plus "drop in a few transcripts." That gap is the conversion failure. The proposal fills it with a persistence demo (save a business-context file, read it back in a fresh chat in the same tool). That demo loses head-to-head with a Claude Project, and it removes the two steps the 09-01 canon's onboarding ladder depended on: correction and the second tool.

The recommended fill is different. **The first time a visitor connects, their workspace already has something in it, and something has already landed in their inbox.** The visitor's own tool drafts five decisions from their website. Something that is not the visitor reviews them and posts one item: a tension between two of the drafts, and a request to correct. The visitor connects a second tool, or comes back an hour later, and sees the boot line the page promises: "1 thing landed while you were away." Correcting a slightly wrong claim about their own company is the activation event.

This is the canon's mirror-then-boundary ladder with the crossing restored, and with Tokenrip itself as the second player so no teammate or second subscription is required. It is also the paid tier, demonstrated once, free. For the first fifty signups the review step is a work item Simon's terminal claims, which means it ships on the queue the 09-04 plan already builds and needs no reflex runtime.

Five recommendations:

1. **Keep the hero, the git problem, and the office.** The category work is done; the five-founder test has not run. Do not change copy that has not been measured.
2. **Make the first hour a crossing, not a recall.** Draft decisions from the site, review them from outside the visitor's chat, land one inbox item, get a correction.
3. **Add one section to the page, "Your first hour," and rewrite "Get started" to match it.** Real captures, or nothing.
4. **Run the review step as concierge-on-the-queue** for the first fifty workspaces. The runtime replaces Simon as claimant when the call loop does.
5. **Measure correction rate, not retrieval.** If people read their drafted decisions and leave, fix extraction specificity, not the funnel.
6. **Run a concierge outbound motion in parallel, deliberately unscalable.** Simon hand-builds fifteen to twenty workspaces for founders chosen by behavior, with the product inside the email, and acts as their claimant for two weeks. It is the first hour done by hand, the spec for the ingest module, and the runtime's first paying cohort if it works. Details in §6.

Confidence is high that the crossing beats the recall demo as a first proof; the June synthesis, the 09-01 canon, and the 09-04 plan all derived it independently. Confidence is moderate that website-drafted decisions are specific enough to trigger corrections without a runtime behind them; that is the assumption the first fifty workspaces test.

## 1. The page is clear. The gap is between the page and minute one

The live site names the thing in a noun a stranger has, argues one insight (coding agents have git, everything else has a chat window), and shows a destination scene (one agent did the work, the other already has it). That is the positioning work, and it is done. Reopening the hero before the five-founder test is measurement debt, not refinement.

What the page does not do is show the visitor what they get. Get-started step 2 is "drop in what you have." That is a chore with no payoff, and step 3 ("write one decision") asks for the investment before the product has done anything for the visitor. The 09-08 proposal's diagnosis of a "missing first chapter" is right.

## 2. The first chapter must be a crossing, not a recall

Three documents in this folder reached the same rule from different directions: never demo persistence, demo a crossing. The reasons still hold, and one has gotten stronger.

- **Recall is table stakes.** Every MCP context tool demos it. Unabyss hit #1 on Product Hunt twice with recall alone; it has no reason to return tomorrow.
- **The real comparator is native memory, not a Drive folder.** "Fresh chat, same tool, knows my company" is what a Claude Project or ChatGPT memory does with zero setup. The 09-08 proposal's own assumptions table concedes users may "attribute the answer to ordinary memory." Making the second tool optional does not reduce friction; it removes the one step a Project cannot replicate.
- **Correction is the activation event, and the moat move.** The canon's falsifiable check was that readers who correct one position almost never bounce, and that if they read and leave, the extraction is wrong, not the funnel. The 09-08 proposal made correction optional. Onboarding is the moat only if the visitor invests.

"Second tool" should be read broadly. A Claude Code session reading what a Cowork chat wrote is a crossing. A scheduled job reading what a human wrote is a crossing. So is Tokenrip posting to the inbox. The requirement is "something that is not this chat reads it," not "buy a second subscription."

## 3. The first hour, concretely

Identity stays tool-first ("your tool registers you the first time it connects"). Nothing below needs a signup form.

**Minute 0 to 5. Connect, and the tool asks for the site.**
The visitor adds the MCP server or installs the skill. The skill's instructions drive the first exchange:

> Your workspace is empty. Give me your company's URL and I'll draft your first five decisions from it.

The visitor's own harness, on the visitor's own model, researches the site and writes five decisions to `decisions/`, each labeled `inferred from <page>` with a confidence, and each deliberately specific. This is the 09-08 proposal's best move (the website mirror as a prompt, zero Tokenrip code) kept intact. The extraction is tuned for specificity and tension, per canon §3: a vague safe inference ends the session; a specific slightly-wrong one triggers a correction.

**Minute 5. A work item is created.**
"Review drafted decisions for `<site>`." For the first fifty workspaces the claimant is Simon's terminal. Later it is Tokenrip. Same queue, different claimant, which is exactly the 09-04 crank-to-reflex ladder.

**Within the hour. One item lands.**
The claimant reads the five drafts against the site and posts one inbox item:

> Your homepage says you sell to lenders. Your blog argues brokers are the better customer. Which is the decision? Two of the five drafts look inferred from a single page; correct them and your agents stop getting this wrong.

**The return.** The visitor opens a second tool, or the same tool an hour later, and the boot line is real on day one:

```
● yoursite · 5 decisions · 1 new in inbox
```

They correct. That is activation. The corrected decision is the first thing in the workspace a human wrote, and it is about the one subject they are the world's expert on.

Three properties worth naming:

- **It is the paid tier, given once.** Free-to-drive users experience autopilot exactly once, at signup. The page currently describes the paywall; this demonstrates it.
- **Tokenrip is the second player.** No teammate, no second subscription, and the crossing still happens.
- **It needs no runtime.** The review step is a work item on the queue the 09-04 plan builds for Alek's inbox and the call loop. One build serves onboarding, the issue inbox, and the first loop. Away-time is real because the crank is human at first, and the email nudge ("something landed in your workspace") is the return trigger.

**Fallbacks.** Thin or missing site: the skill runs a three-question interview instead (what you sell, who you refuse to sell to, the thing your agents keep getting wrong). Visitor already has a company-context file: save it, draft decisions from that. Either way the review item still lands.

## 4. Homepage changes, section by section

Principle: add the first chapter, touch nothing that has not been measured.

| Section | Change | Why |
|---|---|---|
| Hero H1, sub, eyebrow | None | Unmeasured; the five-founder test comes first |
| Hero, line under the commands | Replace "Ask your agent anything about Tokenrip" with the first-hour promise: *Your tool registers you, asks for your site, and drafts your first five decisions. Come back in an hour: something will have landed.* Keep "connect to ours first" as a secondary link, one line, for the docs use | This is the missing first chapter, in the hero, without a second CTA |
| Patch bay | None | |
| Problem (git gap) | None | The argument is right and it is the distinction Tokenrip owns |
| **New: "Your first hour"** (after the problem, before the two-terminal scene) | Three real captures: the skill asking for the URL and the five drafts landing; the inbox item; the second-tool boot line with `1 new in inbox`. Caption: *You never wrote a briefing. Your site did, and you corrected it.* | Attainable proof before the destination scene. The captures must be real; if the real boot output is a doc index, fix the product |
| Two-terminal scene (signups drop) | Keep; retitle the header to place it in time: *A month in.* | It is the destination, now framed as one |
| Inside: Decisions column | Add one sentence: *Your first five are drafted from your website. You correct them; that's the only writing a human does.* | Ties the object to the first hour |
| Modules | Add the status dot per card that v3.1 specified. Website mirror card: *live, runs at signup* once true | Claim discipline; the live text shows call processor and analytics as peers of the Publisher with no marker |
| More than memory, pricing paragraph | Add: *You get one run of autopilot free, at signup. That's what drafted your decisions.* | The paywall, demonstrated |
| Get started | Rewrite to the real four steps: connect; give it your URL; come back to one thing in your inbox; correct it from whichever tool you're in. Caption: *Step 4 is the only thing a human writes.* | Matches the flow, keeps the "one human step" line |
| FAQ | Add: *Won't the decisions it drafts from my site be wrong?* Answer: *Some of them, on purpose. A specific wrong draft gets corrected in ten seconds. A vague right one teaches your agents nothing.* | Pre-empts the objection and states the design rule |
| Final CTA | None | |

Two things not to add: a URL field on the homepage (it forces a signup form and breaks tool-first identity; test it later as a variant if connect-first stalls), and any "shared methods" language in the hero. Methods are modules, section 6, and the reviewer flow the 09-08 proposal describes is a strong second module, not hero copy.

## 5. GTM implications

- **The acquisition asset is a recording of the real first hour.** Connect, give the URL, five drafts, one inbox item, correction from a second tool. Under three minutes, unedited. It answers "how do I start" and "why would I come back" in one clip, which the 09-08 proposal wanted two assets for.
- **The mirror is an outbound instrument.** "Here are five decisions we drafted from your site; two contradict each other; correct them here" is a cold email with the product inside it, executable by the recipient's agent. Same skill, pointed outward. Log as a test, not a plan; it decides whether the agent-to-agent outreach idea finally has a payload.
- **The lure is unchanged.** The call processor launches after two weeks of internal use, per 09-04. The first hour is what the lure lands on.
- **The visitor is often an agent.** `llms.txt` should carry the first-hour instructions verbatim, so an agent asked "should we use this" can run the whole flow. The 09-08 proposal's prompt-driven onboarding fits this; it just never said so.

## 6. The concierge outbound motion: the first hour, built by hand

Self-serve is the destination and stays the page's only conversion. In parallel, run the same first hour by hand for a small cohort, because a hand-built workspace is the only way a stranger's first connect looks like the scene on the page, and because twenty such builds are the specification for the ingest module. This is the ladder the May `audience-led-deployment` idea proposed and never ran: v1 Simon-assisted, v2 semi-automated, v3 self-serve, with the build roadmap tied to deploy milestones. Same ladder, a buyer the ICP decision actually names.

### What it is

- **The email carries the product.** Not "want to test the site." Three decisions drafted from the founder's public footprint, one contradiction between them ("your homepage sells to lenders, your blog argues for brokers; which is the decision?"), the trust line, one-word reply. The reply is the correction, so the reply rate is the mirror test run on strangers before anything is built.
- **The build.** Ninety minutes, time-boxed, run as a vault skill shaped like `process-call`: site and blog mirrored into files, ten decisions with confidence labels and one flagged tension, team as principals, platforms noted as planned connections, one inbox item waiting. Ownership handed to the founder; Simon remains a visible guest.
- **The handoff.** A custom link, the waiting inbox item, and one ask: connect a second tool. A twenty-minute call offered, never required.
- **The claimant period.** For fourteen days Simon posts one real item a week per workspace: a competitor moved, a number on their site contradicts a decision, a post drafted from their own files. This is autopilot done by hand. It is the retention mechanism and the paywall proof, and it is the part that is easy to drop in week two. The paywall conversation follows naturally: "I have been running this by hand; want it to keep running?"

### Why it is stronger than self-serve alone

- **Precedent.** Stripe installing itself on your laptop, Superhuman's concierge onboarding, Palantir's FDE, Clay's "we enriched your list." Do the unscalable thing to learn what the scalable thing is.
- **Closes the page-versus-minute-one gap by brute force.** Team as principals, platforms as connections, the sales motion as decisions: a URL cannot yield those and a person can.
- **Learning yield.** Which sources matter, which decisions founders recognize as theirs, which harnesses they run (predictions #3 and #5 get data), what "populated" means for a real company. Dogfooding as primitive discovery, twenty times, before the module is written.
- **A paid version hides inside it.** Workspace setup as a service for funded startups is the FDE motion at small scale. Superhuman never charged for concierge; Palantir charges a great deal. A setup fee that funds the runtime sits between. Name it so the offer is recognized if a founder makes it.

### Where it breaks

- **A built workspace without an after-handoff item is a gift basket.** They connect, ask two questions, see that it knows their company, leave. This is "connect to ours" with their name on it. The waiting inbox item and the claimant period are not optional.
- **Borrowed exclusivity.** "Special invite for a16z founders" from someone unaffiliated reads as spam or a lie to people who are pitched daily. The scarcity that is true is Simon's hours: "hand-building twenty workspaces this month." Name a cohort only if access to it can be claimed honestly.
- **The real ask is "paste a stranger's MCP URL into your Claude."** Trust steps belong in the email: hosted on tokenrip.com, connect to the public workspace first, read-only guest before owner, export any time.
- **The dossier line.** All inputs are public, but "you built a file on my company" can read as surveillance. The inverting frame is the vault's own: drafted from your public footprint, confidence-labeled, for you to correct. Names and roles only for people; no inferred personal data. Ownership transfer must be clean or the whole thing smells.
- **Investor-backed is the wrong filter.** The ICP is behavioral. Series A companies with an ops team will not plug Cowork into a stranger's server. Select by signal: posts about Claude Code or Cowork workflows, has a co-founder, has a site with a blog (contradictions to find), under ten people.
- **It rhymes with the retired page.** The old site offered a "workflow audit." This is different only while the deliverable is the built workspace and a link, never an audit or a deck.

### Plan

| When | Do | Watch |
|---|---|---|
| Week 0 | Verify or build workspace transfer (create, populate, hand ownership, remain guest). Write the build skill and time it on three companies. Draft email v1 with three decisions and one contradiction in it | Build time under ninety minutes |
| Weeks 1 to 2 | Forty founders chosen by behavior, twenty a week. Anyone who corrects a decision in their reply is built first | Reply rate; corrections in replies |
| Weeks 2 to 4 | Build ten to fifteen. Hand off with the waiting item and the second-tool ask. Claimant for fourteen days, one real item a week. Log hours, sources used, corrections, harness connected | Connect within 72h; first correction; second tool or person |
| Weeks 4 to 6 | Codify the build log into the ingest module spec. Paywall conversation with everyone who returned. Decide when Tokenrip becomes the claimant | Anyone says "keep it running" |

Kill and keep, one per stage: reply rate below five percent means the mirror does not trigger correction and extraction specificity is the fix, before any build; connect below half of built workspaces means the trust ask is the blocker, not the value; no correction in week one means blandness, the workspace is impressive but not theirs; no second tool by day fourteen means the crossing did not happen and the claimant cadence is wrong; one "keep it running" is the runtime's first customer.

Predictions logged for adjudication: reply rate above fifteen percent when the email contains drafted decisions; sixty percent of built workspaces connect within 72 hours; half of those correct at least one decision in week one. If all three hold, the runtime has a paying cohort before it exists. If the first fails, the problem sits upstream of everything the homepage documents argue about.

### How it relates to self-serve

Same first hour, two claimants. Self-serve: the visitor's tool drafts, a work item is reviewed, one item lands. Concierge: Simon drafts everything, hands it over, and keeps items landing for two weeks. The build skill written for the concierge cohort is the extraction prompt the self-serve skill runs; the claimant log is the reflex spec. The page never advertises the concierge motion. It is outbound only, and it ends when the build log has nothing new in it.

## 7. Pricing: both gates, not either

The 09-08 proposal asks whether collaboration, rather than automation, should be the paywall. It is a false choice. A collaboration paywall charges at the invitation, the exact moment friction should be zero. An automation paywall charges when the chore disappears and the value is unambiguous, and it tracks Tokenrip's only real COGS. Use Linear's shape: free below a workspace-size threshold, autopilot as the feature gate, priced per workspace. The first hour gives every free workspace one run of the paid tier.

## 8. Measurement

Instrument the funnel as events the server can see, not model assertions:

1. Connect (tool registered)
2. Drafts written (five decisions in the workspace)
3. Item landed (claimant posted to the inbox)
4. **Correction made** (a human edited a drafted decision). This is activation.
5. Second surface read (a different tool, session, or principal read a decision)
6. Return within seven days

The one number that matters at first is 2 to 4: drafts-to-correction. The canon's rule applies: if people read the drafts and leave, the extraction is bland, and the fix is the prompt, not the page. Track assisted and unassisted workspaces separately so the concierge claimant does not masquerade as self-serve.

Gate for the runtime: when Simon's terminal is the bottleneck on item latency (drafts sit unreviewed past a few hours), Tokenrip becomes the claimant. That is the same trigger that opens the call loop.

## 9. Assumptions and their cheapest disconfirming tests

| Assumption | Confidence | Disconfirming evidence |
|---|---|---|
| The visitor's harness can research a site and write five decisions through MCP or the CLI without a transfer problem | Medium; browsing capability varies by harness | Two of five supported tools fail to complete the draft step unassisted |
| Website-drafted decisions are specific enough to trigger corrections | Medium | Drafts-to-correction below one in three after prompt tuning |
| One inbox item from a non-user reads as "something landed," not as a notification | Medium-high | Users describe the item as an email or a nag rather than as their workspace doing something |
| A human claimant can keep item latency under a few hours for fifty workspaces | High at fifty; collapses beyond | Latency above a day, or Simon stops claiming |
| Correction predicts return | High; this is the canon's own check | Correctors bounce at the same rate as readers |

## 10. What this drops from the 09-08 proposal, and why

- **The same-tool fresh-chat retrieval as first proof.** Loses to a Project; removes the crossing.
- **Correction and second tool as optional.** They are the activation event and the moat move.
- **"Build your business context" as a second CTA.** One action per page until the first has a number.
- **"Instructions to work your way" in the hero sub.** Unmeasured hero; methods belong in modules.
- **The company-aware reviewer as the immediate next step.** Kept, as the second module after the call processor. It is the best "methods" demo in the proposal: a standard added once, obeyed on a different input, from a teammate's tool. It should not be the first hour because it needs a standard the user did not write, or it is custom instructions.

Kept from the proposal: the mirror as a user-run prompt, retrieval instrumented server-side, "storage is an implementation choice," the removal of absolutes ("gone when the tab closes" should soften to "in one person's chat"), and the milestone table's insistence that a connection proves nothing.

## Decision for evaluation

Ship the first hour on the queue with a human claimant, add one section and rewrite one, and measure drafts-to-correction. Run the concierge outbound in parallel for one cohort, with the product in the email and Simon as claimant for two weeks. If corrections come, the runtime replaces the human and the same flow runs for the call loop. If they do not, the extraction is wrong and the page was never the problem.
