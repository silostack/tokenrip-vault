---
title: "Tokenrip v2: The Whole Idea"
date: 2026-09-22
status: master reference for evaluation, pitch-deck source, and external pressure testing
scope: thesis, product model, how it works, ICP, positioning, competition, onboarding, GTM, pricing, metrics, roadmap, risks
author: Bean (thinking partner), from sessions with Simon 2026-09-08 through 2026-09-22
related:
  - active/tr-rework/tokenrip-brain-terminals-modules-canon-2026-09-01.md
  - active/tr-rework/tokenrip-first-loop-site-gtm-2026-09-04.md
  - active/tr-rework/tokenrip-positioning-gtm-onboarding-recommendations-2026-09-08.md
  - active/tr-rework/tokenrip-first-hour-onboarding-homepage-bean-2026-09-08.md
  - active/tokenrip-workspaces-prd-2026-09-14.md
  - agents/bean/ideas/boundary-aware-workspaces.md
---

# Tokenrip v2: The Whole Idea

## How to read this document

This is a self-contained account of Tokenrip as it stands on 2026-09-22, written so that a reader with no access to the rest of the vault can understand the thesis, the product, the go-to-market, and the open bets, and can argue with any of it. It is the source for a pitch deck and the input for an outside pressure test.

Every load-bearing claim is tagged **[fact]** (observed or shipped), **[decision]** (chosen by the founders), or **[inference]** (reasoned, not yet confirmed by a user). An evaluator should attack the inferences first.

The document supersedes the onboarding and GTM recommendations of 2026-09-08 where they conflict. Section 15 lists what changed and why.

## 1. The idea in one paragraph

Every person is about to have an always-on AI agent that acts for them. Muse, Instinct, Grok Bot, Claude Cowork, and ChatGPT Work are the first wave [fact]. These agents live inside their vendors' hosts and cannot share working state with each other, with people on other hosts, or with people who have no agent. Tokenrip is the shared workspace that sits between them: a neutral, versioned record of a project or a relationship that any person's agent, on any host, can plug into and work from, and that a person with no agent can still touch through a link. The founding insight is that once every person has an agent, the operational difference between a person and a small company collapses to one thing, the record they share. Tokenrip is that record, priced per workspace, free for one person, paid when the workspace runs on its own or grows beyond one.

## 2. The world this is built for

### 2.1 Personal agents are arriving as consumer products, not developer tools [fact]

OpenClaw and Hermes Agent proved the always-on personal agent among technical users in the first half of 2026. The consumer versions followed in weeks: Grok Bot (xAI, 2026-08-11), Instinct (private beta, $250M Series B at $2.5B, August 2026), and Meta Muse (2026-09-08, free, $20 and $100 tiers, iOS, Android, web, glasses to follow). Muse opened third-party connectors on 2026-09-18 with a Stripe Link payment rail. Instinct can reach arbitrary external endpoints [fact, Simon's test].

These agents book, schedule, shop, email, and run tasks in the background. They are the executive assistant everyone was told they would never have.

### 2.2 When coordination is free, the reason to be a firm weakens at the small end [inference, high confidence]

Firms exist because dealing with outsiders is expensive: finding, negotiating, chasing. So people bundle up and coordinate by command. When a person's agent does the finding, negotiating, and chasing with another person's agent, that cost collapses. The cost of coordinating inside a company (management, meetings, alignment) does not. The team size at which it becomes worth forming a company moves up. Below it, a person with an agent and a set of counterparties can do what used to need a small firm.

### 2.3 What is left of "company" is a shared record and a mandate table [inference]

Strip away the legal shell and a company is people who agreed to share four things: memory, procedures, one to-do list, and the power to commit each other. A personal agent gives one person all four, solid: persistent memory, written procedures run on a schedule, a work queue, and a mandate. So the only thing that still distinguishes a company from a person is the agreement to share. That agreement is a record. A company is a shared record with N members. A person is the same object with N equal to one.

This is the sentence that unifies Tokenrip's original target (small AI-native companies) with the personal-agent wave. They are the same object at different settings of N.

### 2.4 The line people keep is between contexts, not between agents [fact, from Simon's own usage]

A person keeps personal, work, and side-project contexts separate: different repositories, different files, different agent contexts. They do not keep separate agents. One principal, one harness, one mandate, several workspaces. The product must mirror that: the person at the center, workspaces underneath, and the firm as the workspace that happens to have other people in it.

## 3. The problem, concretely

Five things are true today for anyone who works with an AI agent seriously:

1. **Working state is trapped in one host.** What Claude knows about a project does not reach ChatGPT, Instinct, or a co-founder's Cowork. Each host has memory; none of it crosses the vendor line [fact].
2. **The do-it-yourself version dies at the first boundary.** A founder can run a markdown vault plus Claude Code plus git. Simon did. It breaks the moment a second person, a second harness, or an outside party needs a bounded view of the same work [fact, from the Providence pilot].
3. **Chat-shaped agents have no stateful surface.** A morning brief from Instinct cannot be checked off. A poll cannot be sent to friends. Anything tappable that remembers being tapped needs a page, and the host does not provide one [fact].
4. **The second party usually has no agent, or a different one.** The client, the friend, the contractor, the outside collaborator. Any design that requires both sides to install the same thing fails at the second person [inference, strongly supported by the pilot].
5. **Nobody records what agents agreed to.** As agents start committing people to things (Instinct already does, and has been criticized for it), the record of what was quoted, agreed, and changed is held by no neutral party [fact for the gap, inference for the demand].

## 4. What Tokenrip is

**One sentence:** A shared workspace you plug your agents into.

**The longer version:** Tokenrip holds the working state of a project or a relationship as a versioned record. Any member's agent, from any host, loads it, does a piece of work, and saves it back with the reasoning attached. Members who have no agent open it in a browser. A visibility line runs through it so an outside party sees a complete workspace from their side and never sees internal material. Work that needs to happen on a schedule, or without a person opening a tool, runs on Tokenrip with the member's own keys.

### 4.1 The objects

| Object | What it is | Status |
|---|---|---|
| **Principal** | Any actor that plugs in: a person, an agent, an app. Same object, same permissions model. A person with three agents is four principals. | Shipped |
| **Workspace** | The container for one project or relationship. Owned by a team, holds items, has members with tiers. Priced per workspace. | v1 PRD 2026-09-14; existing feature being redesigned |
| **Document** | A versioned file: markdown, CSV, xlsx, PDF, anything the artifact layer supports. | Shipped (artifacts) |
| **Record** | A versioned table with a typed schema, row history, and named snapshots. The source of truth for anything that is rows. Files are imports and exports of records. | v1 PRD |
| **Standard files** | Every workspace carries an index, a status document, an activity log, and a queue at known names, so any agent can boot from any workspace without a map. Same convention as `CLAUDE.md`. | v1 PRD |
| **Visibility tiers** | Private (owning member), internal (owning team), shared (all members). Promotion across the line is an explicit, logged event that pins a version. | v1 PRD |
| **Session** | A member's agent loads the workspace, works, saves. The log records the mechanical trail and the agent's narrative. "Since you were last here" is per member. | v1 PRD |
| **Work queue** | Durable work items any member's agent can claim, with lease, aging, and a scheduler that creates items on a cron. Generalized from the existing steering-event mechanism (about 70% built). | In progress |
| **Inbox** | Where queue output and flagged events land for a person. Read at the next connect: "three things landed." | Partial |
| **Surface** | A hosted, stateful page over a record: a checklist, a poll, a booking page, a dashboard. Any AI generates it; Tokenrip hosts it at a stable URL; writes go back to the record. Works for people with no agent. | Shipped (surfaces), consumer use unproven |
| **Brain** | The cross-workspace layer: facts (what happened) and positions (what the company believes, with reasons). Positions are the differentiated content; no system of record holds them today. | Designed; extraction skill exists |

### 4.2 The attachment taxonomy

Capabilities attach to a workspace or brain in five kinds. This is the model behind everything that runs.

| Kind | Direction | Runs where | Example |
|---|---|---|---|
| **Source** | in | Scheduled, no judgment | Call transcript pull, git, email attachments landing as received items |
| **Connection** | out | Routed through Tokenrip | Image generation key, SMTP, publish |
| **Skill** | invoked | The member's own model | "Process this call," "draft the follow-up" |
| **Reflex** | on event or cron | Tokenrip-side, member's keys | Transcript lands, extract commitments; fact contradicts position, flag it |
| **Surface** | view and write-back | Tokenrip hosts | The poll, the checklist, the client portal |

A "module" as sold is a bundle: skill plus connections plus state plus optionally a surface. Modules never call each other; they compose through the record. Judgment runs on the user's model; side effects and memory run on Tokenrip.

### 4.3 How it works end to end

1. A person connects one AI tool to Tokenrip. Today: MCP URL `https://api.tokenrip.com/mcp`, or `npx skills add tokenrip/cli` and `rip auth login` [fact, live site].
2. The tool registers the person as a principal and either opens their personal workspace or, if invited, the workspace whose endpoint they were given. **The per-workspace MCP endpoint is the invitation** [decision].
3. The agent runs `load`: it gets the index instructions, the status, the log since the member's last cursor, and open queue items.
4. The agent works: reads a record slice, writes rows or a document version, imports a file against a key, claims a queue item.
5. The agent runs `save`: narrative entry to the log, status patch, queue updates. The session closes.
6. The other members' agents see the change at their next load. A member with no agent sees it in the browser view, or on a surface.
7. A reflex on a cron or an event does step 3 to 5 without any person opening a tool, and its output lands in the inbox.

Compute stays with each member's agent in v1 [decision]. Tokenrip serves bounded slices; it does not run the model. Reflexes are the exception and the paywall.

### 4.4 The two doors

There are two ways into a workspace, and the product must serve both:

- **The agent door.** A harness loads the workspace over MCP. This is the primary door for founders, operators, and anyone with a terminal or a personal agent.
- **The browser door.** A person opens a link: the workspace view, or a surface. No account required for a surface write in the consumer case; a lightweight identity (name, phone, magic link) at most [decision pending]. This is how the friend votes, the client checks a row, the therapist's client books.

The browser door is what makes N above one reachable without requiring the second party to install anything. It is the growth mechanism (section 9.4).

## 5. Why this is structurally different

Five claims, each of which an incumbent cannot easily make:

1. **The brain is separated from the harness.** Glean, Dust, Notion AI, Copilot, and the personal-agent hosts fuse context, sandbox, and model. Tokenrip holds the context; the hands are wherever the person already works. Bring your own host, bring your own model. A host cannot make this claim because it is the sandbox [fact about the architecture; inference that buyers value it].
2. **The record beats the file.** Rows live as records with schema, history, and snapshots. That is what makes a shared ledger between a team and an outsider possible without re-keying. Storage products hold files; they do not hold a typed, versioned, boundary-aware record [fact].
3. **The boundary is a first-class object.** Internal and shared coexist in one place; crossing is logged and pins a version; the outsider sees a complete workspace and never a count, listing, or log entry from the internal tier. Three separate instances (AICAP, the file-collaboration research, the Providence pilot) surfaced the same gap [fact].
4. **The second party needs no agent.** Surfaces and the browser view let someone with no AI, or a different AI, write to the same record. Hosts serve only their own users [fact].
5. **N is a dial.** Same object for a person, a pair, a founding team, a client relationship. Per-workspace pricing follows from that [decision].

The neutral position matters more as hosts multiply. Muse will not interoperate with Instinct; Meta will not hold the record for a therapist who is not on Muse. Cross-host, cross-person shared state is the land no host can take [inference, high confidence, based on the history of messaging silos].

## 6. Who it is for

### 6.1 The ICP, restated

**The person whose personal agent already does firm work.** Concretely: solo founders and founding teams under ten, consultants, small practices, landlords, freelancers. The original target (AI-native small companies, founding to ten hires) is the sharpest instance and stays first [decision, 2026-09-01]. The personal-agent wave equips exactly this population and hands them a harness.

Why founders first:

- The architecture already votes for it: self-serve connect, bring-your-own model, founder-written positions. None of it survives enterprise procurement.
- The differentiator peaks down-market: a company brain is free to build at founding and brutal to retrofit.
- The founder is already a person-firm. Their calendar is the company calendar; their AI does a customer follow-up and a dentist booking in the same hour. The product's account model must match that (section 2.4).
- Precedent: Stripe, Vercel, Linear, Notion, Slack started with startups and let enterprise arrive.

### 6.2 The three people in every workspace

| Role | Who | Enters through | Needs |
|---|---|---|---|
| **Builder** | The founder or operator who sets up the workspace and holds the mandate | Agent door | The first hour to produce something they correct |
| **Member** | Co-founder, teammate, their agents | Agent door | Load cold, do a piece, save with reasoning |
| **Outsider** | Client, collaborator, friend, contractor | Browser door or their own agent | A complete view from their side, nothing internal, no install |

The Providence pilot is the worked instance: Simon and Alek internal, David LaSaee external, a shared ledger with an internal twin, batches shipped and scored [fact].

### 6.3 The honest number-one competitor is DIY

The AI-native founder can roll a vault plus Claude Code plus git. The counter is not features; it is the boundary. The DIY version dies at the second person, the second harness, an agent needing its own slice, or anything published. Position at boundary moments, never against a founder's local folder [decision].

### 6.4 Not targeted now

Enterprise (procurement kills the architecture). Pure consumers with no firm-shaped work (no payer, no wedge; see section 8.3). The professional answering-agent market (section 9.6) is a hypothesis parked until a founder workspace produces one by itself.

## 7. Positioning and messaging

**Category:** shared workspace for agents. Not memory, not storage, not a company brain, not a matcher.

**Hero (live, retained):** "A shared workspace you plug your agents into." [fact, live site]

**Supporting line, v2:** "Your work, one workspace per project, that any AI you use can plug into, and the people you work with can touch without one."

**One-liners in use:**

- "Works in the tool you already use, with the model you already pay for."
- "Glean knows what your company has written. Tokenrip knows what your company believes."
- "Free to drive. Pay for autopilot."

**Register:** Bloomberg, not Notion. Terminal, record, ledger, mandate. Not "magic," not "brain" on the homepage.

**What the page never says:** that chat files vanish, that folders can't be shared, that every competitor is read-only, that every agent reads every file automatically, that anything runs on autopilot before it does [decision, 09-08 and retained].

### 7.1 The competitive map

| Cluster | Examples | Collision | Where Tokenrip differs |
|---|---|---|---|
| Fused company brains | Glean, Dust, Zaro, Akai (Deel) | Vocabulary, "shared context layer" | Separated from the harness; positions; boundary object; small-company entry |
| MCP context sync | Unabyss, Nessie | Level-1 vocabulary | No records, no tiers, no queue, no outsiders |
| Host-native canvases | ChatGPT canvas, Claude artifacts, Muse's browser VM | The single-player surface | Cross-host, cross-person, write-back to a record the agent reads on schedule |
| Open agent workspaces | Buzz (Block, on Nostr) | Human plus agent workspace, neutral protocol | No records, no deliverable rails yet; distribution threat more than product threat |
| Consumer matchers | "Together"-style concepts, Muse Marketplace, Playtomic | Standing intents matched | A matcher is a host feature; the record and the surface underneath it are not |

Three claims about Meta specifically, because the pressure test will raise it: Meta will build intra-Muse agent-to-agent coordination natively within a year [inference, high confidence]; Meta will not hold neutral state for non-Muse users [inference, high confidence]; a Muse connector is therefore an onboarding door for Tokenrip, not a place to live [decision].

## 8. The first hour

The rule from the canon: never demo persistence; demo a crossing. A workspace is not empty at first connect. Two doors, two first hours, one record.

### 8.1 The founder door (terminal or Cowork-shaped host)

1. Connect. The tool says: "Your workspace is empty. Give me your company's URL and I'll draft your first five decisions from it."
2. The extraction skill drafts five positions, confidence-labeled, deliberately specific, with at least one surfaced contradiction ("your pricing page says X, your blog argues Y; which is the position?").
3. A work item appears: "Review drafted decisions for yoursite." One inbox item lands.
4. Next boot, one line: `● yoursite · 5 decisions · 1 new in inbox`.
5. The founder corrects one. **Correction is activation** [decision]. Specific and slightly wrong beats vague and safe; blandness, not wrongness, is the failure mode.
6. Second tool, same knowledge: the crossing.

Fallbacks: a three-question interview for thin sites; import an existing context file instead of rebuilding it.

### 8.2 The personal-agent door (Instinct, Muse, chat-shaped hosts)

1. Connect. The agent gets a personal workspace and the ability to create surfaces.
2. First single-player object: the morning brief rendered as a checklist at a stable URL. The person checks items; the record changes; tomorrow's brief reads it. This is the crank-to-reflex loop at consumer scale.
3. First multiplayer object: "make a poll for my friends about Saturday." A friends workspace is created, a poll surface is hosted, friends vote through the link with no account, the result lands in the record, the agent reads it and reports.
4. **Activation is a second writer**: anyone other than the owner writes to the surface, and the agent acts on that write.

The single-player checklist is rented land (every host will ship a canvas). The poll, cross-host and write-back, is the flagship [decision]. Both run on existing surfaces and the existing endpoint; the unknowns are whether Instinct unfurls a link and whether it reads a URL or resource on a schedule rather than only when asked [open].

### 8.3 What is deliberately not the first hour

A matching network (standing intents matched across strangers). It is a Muse feature, Meta owns the graph and the trust signals, and it has no payer. The standing intent is a valid record type; the matcher is not the product [decision, 2026-09-21].

## 9. Go-to-market

The rule inherited from the June work: infrastructure is never sold; it is wrapped. Every motion below is a wrapper that deposits a workspace which then compounds.

### 9.1 Self-serve site, founder door

The site is a conversion device. Hero retained; a "Your first hour" section with three real captures placed before the two-terminal scene; Get started rewritten as connect, give URL, come back to one inbox item, correct it; FAQ answers "won't the decisions it drafts be wrong?" with "yes, slightly, on purpose." The `llms.txt` carries the first-hour instructions because the visitor is often an agent. Detailed in the 09-08 Bean document, section 4.

### 9.2 Concierge outbound, deliberately unscalable

Custom outbound to a small set of founders. The email carries product: three drafted decisions and one contradiction from their public site. A reply gets a ninety-minute hand-built workspace and a custom connect link. Simon is the claimant on the queue for the first fourteen days, one real item per week. The build log is the specification for the self-serve extraction skill; the claimant log is the reflex specification. Kill and keep gates by stage. The page never advertises concierge. Detailed in the 09-08 Bean document, section 6.

Predictions logged: reply rate above fifteen percent; sixty percent connect within 72 hours; half correct a decision in week one.

### 9.3 Connector listings, personal-agent door

Submit the Muse connector (muse.ai/platform, form-based, spec unpublished as of 2026-09-18) with the existing endpoint. List in the Anthropic connector directory, Cowork plugin surface, Cursor and Codex MCP lists, Smithery, and Fathom's integrations page. This is harness expansion the canon already demanded ("it has to work with Instinct, with Grok Bot"), not a consumer pivot. Measure who connects and from where.

### 9.4 Boundary expansion is the growth mechanism

The vault's June "invite a teammate" model was too narrow. The second party is usually an outsider: David, a client, a friend, a contractor. One builder drags N outsiders in per workspace through the browser door, with no install. Slack grew through shared channels the same way. Track outsiders who write, not links sent [decision].

### 9.5 The lures

- **Call processor**, for founders: "Fathom notes that know what your company believes." Pre-existing demand, inherently shared, requires the whole architecture. Product Hunt and Show HN after two weeks of internal use.
- **The poll**, for personal-agent users: the smallest multiplayer surface. Polls become scheduling become allocation without changing shape.
- **The cadence reflex**, for content: weekly, the brain drafts a build-in-public post from the week's facts; Simon edits and ships. The reflex that markets reflexes.

### 9.6 Parked, with the trigger that unparks each

- **The answering agent for professionals.** Every personal agent will soon send inquiries to therapists, contractors, tutors. None of them has an agent that answers. A discoverable endpoint plus a calendar plus a policy, built from their website with the same extraction skill, is the supply side of that market and it is B2B. Unparks when a founder workspace produces one (a founder invites a professional as an outsider and the professional asks for their own).
- **Day-zero partners** (incorporation services). Unparks with traction.
- **Mandates as a first-class object.** Scoped, revocable, auditable authority per workspace. Unparks the first time an agent commits a member to something they did not expect.

### 9.7 Roles

Simon: runtime correctness, retrieval and write-back instrumentation, harness verification, concierge builds, claimant for the first fourteen days. Alek: audience language, the personal-agent door's seeding (dense pockets, community hosts), outsider onboarding feedback. Both observe the first sessions [proposed, not committed].

## 10. Pricing

**Unit:** the workspace. Never per principal, because agents are principals and a company should have dozens [decision].

**Free:** one person's workspaces, unlimited terminals and agents, surfaces, the human-posted inbox, the publisher module, one run of autopilot at signup so the paid tier is experienced once.

**Paid:** reflexes and sources (crons, pollers, aging, Tokenrip as a claimant on the queue), and workspaces above a member or record-size threshold. Both gates, Linear-shaped: free below a size threshold, autopilot as the feature gate [decision, 09-08 Bean].

**Not charged for:** access control, boundary enforcement, reliable handling of customer work. Those are obligations.

**FDE path:** custom modules and deployments stay under vertical brands (Quintel, AICAP). Tokenrip is the dev and infrastructure brand.

Willingness to pay, support burden, and retrieval cost are unconfirmed. No pricing numbers beyond the gate shapes until repeated use shows what customers value.

## 11. Metrics and evidence gates

The primary adoption measure is **workspaces performing useful, record-backed work repeatedly across sessions, with more than one writer**.

| Milestone | Founder door | Personal-agent door |
|---|---|---|
| Connect | Registered principal, workspace resolved | Registered principal, personal workspace |
| First object | Five drafted decisions written | First surface hosted |
| Item landed | One inbox item | First checklist write-back |
| **Activation** | **A correction made** | **A second writer on a surface** |
| Crossing | Second surface or second tool reads the same record | Agent acts on a write the next day |
| Return | Within seven days | Within seven days |

Assisted and unassisted users are tracked separately so concierge does not masquerade as self-serve.

Gates, in order: the first loop works without rescue; the first object leads to a correction or a second writer; improvements and collaboration transfer (a saved standard prevents the same error on a different input; an outsider completes a cycle with no internal leak); the value survives a fair comparison with the user's best existing arrangement; only then expand distribution and harden monetization.

## 12. Roadmap

1. **Workspaces v1** (PRD 2026-09-14): container, tiers, standard files, records with history and snapshots, sessions, workspace-scoped endpoint, browser view with follow mode. Acceptance: one full Providence batch cycle with no email attachment, no re-keyed row, no internal leak.
2. **The generic work queue**: free-standing items, system-created items, claim and release with lease, aging, scheduler on a cron. Un-pause the scheduler; generalize steering events.
3. **Tokenrip as a claimant** (reflexes): same queue, different claimant, member's keys. This is the paywall.
4. **The first hour, founder door**: extraction skill from the concierge build log; inbox item; correction instrumentation.
5. **The first hour, personal-agent door**: checklist and poll surfaces with write-back; consumer-grade browser identity; Muse connector submission; Instinct verification.
6. **Server-side aggregation and saved reports**: David's daily tabulation as the first customer-requested reflex.
7. **Column-level scope, stale detection, ingest sources** (email and Slack landing as received items).
8. **Cross-workspace brain**: facts and positions referenced across workspaces; semantic recall scoped by tier.
9. **Mandates** as a first-class object when the first surprise commitment happens.

## 13. Risks, in the order they would kill this

1. **"It feels like work."** The co-founder, using it free, said the product feels like more effort than messaging someone, and that reading another agent's output is a cost, not a saving [fact, 2026-09-21 call]. Nothing in the first hour survives this if it is true for the ICP. The correction-rate and second-writer metrics exist to detect it early. Mitigation: the first hour produces something to correct, not something to read.
2. **Hosts ship the surface natively.** Certain for the single-player case. The bet is on the cross-host, cross-person, write-back combination. If hosts open cross-host state sharing to each other, the neutral position shrinks to the browser door.
3. **The extraction is bland.** A vague, safe inference ends the session. The concierge builds are how the extraction gets tuned before self-serve traffic sees it.
4. **Instinct and Muse cannot read on a schedule.** Then the consumer loop closes only on prompt, and the product is a form builder for those users until the hosts grow crons.
5. **Trust.** A neutral third party holding two people's shared record is, to a consumer, a third party with their data. The story that works is the notary, not the vault: share the request, keep the rest yours; nothing agreed until both agree. Instinct's privacy backlash shows the sensitivity.
6. **Concierge findings do not generalize.** Fifteen workspaces built by hand may teach fifteen special cases. The kill signal is a build log that stops producing new findings.
7. **Distribution.** Per-workspace pricing at $50 to $200 a month is a volume game with no acquisition machine yet. Formation velocity and land-at-founding are the offsets, not a substitute.

## 14. Assumptions and their cheapest disconfirming tests

| Assumption | Type | Cheapest test |
|---|---|---|
| Founders will correct a specific, slightly wrong drafted decision | inference | Concierge cohort: correction rate in week one |
| An outsider will write to a shared record without installing anything | inference, supported by the pilot | David completes a cycle in the browser view |
| A friend will vote on a poll their friend's agent sent | inference | Household test: one poll, two hosts, does anyone else write |
| A personal agent will act on a surface write the next day | open | Instinct: schedule a read of the record; observe |
| The person-firm account model reduces "feels like work" | inference | Alek uses a principal-first workspace for two weeks; ask him |
| Meta does not open neutral state to non-Muse users | inference, high confidence | Watch the connector terms through Q4 |
| Willingness to pay for reflexes exceeds willingness to pay for collaboration | open | Offer both gates to the first fifty; see which converts |
| The concierge build log converges into one extraction skill | inference | Findings per build trend to zero by build fifteen |

## 15. What changed from the 2026-09-08 recommendations

The 09-08 proposal is superseded on these points:

| 09-08 said | v2 says | Why |
|---|---|---|
| Account is company-shaped: "save it in my Tokenrip workspace," team expansion | Principal-first: a person with workspaces; the firm is the workspace with N above one | Founders keep contexts separate, not agents; the company container is a wall they must maintain by hand |
| First proof is recall of a business-context file in a fresh chat | First proof is a crossing: drafted decisions and one inbox item, or a surface with a second writer | Recall loses to native memory; a crossing does not |
| Activation is functional (a workflow used the context) | Activation is a correction, or a second writer | Correction is the moment the user invests; a second writer is the moment N exceeds one |
| Expansion is "invite a teammate" | Expansion is "an outsider writes," through the browser door | The second party is usually not a teammate and often has no agent |
| Harnesses are Claude Code, Codex, Cowork, ChatGPT | Plus Instinct, Muse, Grok Bot as first-class doors | The consumer personal-agent wave arrived; connectors are onboarding, not a pivot |
| Surfaces are a deeper capability | Surfaces are the first visible object for chat-shaped hosts | Chat hosts have no stateful surface; the gap is the wedge |
| Concierge is optional support | Concierge is a parallel, unscalable motion with gates and predictions | It closes the first-hour gap by hand and writes the extraction spec |
| Storage adapters are a compatible future | Unchanged | |
| Measurement, evidence gates, no absolutes on the page | Unchanged, with the second-writer metric added | |

What was proposed and rejected in the interval: a consumer matching network (2026-09-21), a pivot to consumer as the primary ICP (2026-09-21), a "personal agent mixes work and life" account model (corrected 2026-09-22 to principal-first with separate workspaces).

## 16. What is decided, what is hypothesis

**Decided by the founders:** ICP is AI-native small companies first; brain separated from harness; per-workspace pricing; compute with the member's agent in v1; the boundary as a first-class object; correction as activation; crossing not recall; concierge in parallel; no consumer pivot; no matcher.

**Hypotheses awaiting a user:** the person-firm thesis generalizes past one pilot; a founder corrects on first contact; an outsider writes without installing; a friend votes; a personal agent closes the loop on schedule; reflexes are the gate people pay at; the neutral position holds as hosts consolidate.

An outside evaluator should spend their effort on the second list, and on risk 1.

## Appendix A: What exists today

- Live site at tokenrip.com: hero "A shared workspace you plug your agents into"; connect via MCP URL or CLI; modules listed as Call processor, Analytics, Publisher; "Autopilot is in progress" [fact].
- Artifacts, surfaces, principals, teams, the existing workspace feature, steering events, the inbox endpoint [fact].
- Workspaces v1 PRD (2026-09-14) with acceptance tests; the Providence pilot running by convention in a folder that the PRD was derived from [fact].
- Extraction of facts and positions from a website: skill exists, tuned for the vault; not yet the self-serve first hour [fact].
- The 09-08 Bean document with homepage changes, concierge plan, measurement, and predictions [fact].

## Appendix B: The narrative spine, for the deck

1. Everyone is getting an always-on AI agent. Muse, Instinct, Grok Bot shipped this quarter.
2. Those agents cannot share working state across vendors, across people, or with anyone who has no agent.
3. When agents do the coordinating, the difference between a person and a small company shrinks to the record they share.
4. Tokenrip is that record: a shared workspace any agent plugs into and any person can touch.
5. It is built from a real case: two founders on two continents and an outside collaborator running a pilot on one ledger, on three different AI tools.
6. First hour: give it your website, it drafts your first five decisions, you correct one. Or: ask your agent for a poll, your friends vote through a link.
7. It grows at the boundary: every workspace pulls in the people around it, with nothing to install.
8. Free to drive. Pay when it runs on its own, or when the workspace outgrows one person.
9. Hosts will build their own canvases; none will hold neutral state for another host's users. That is the land.
10. The ask: what is needed to run fifty workspaces through the first hour and measure correction and second-writer rates.

## Appendix C: Glossary

- **Principal**: any actor with permissions: person, agent, or app.
- **Workspace**: the container for one project or relationship; the pricing unit.
- **Record**: a versioned, typed table; the source of truth for rows.
- **Tier**: private, internal, shared; the visibility line.
- **Session**: one agent's load, work, and save.
- **Queue**: durable, claimable work items; a reflex is a claimant with a server-side workbench.
- **Reflex**: work that runs on Tokenrip on an event or a cron, with the member's keys; the paid tier.
- **Surface**: a hosted page over a record that people can write to without an agent.
- **Position**: something the company believes, with reasons and a lifecycle; the differentiated content of a brain.
- **Crossing**: the same knowledge appearing in a second tool, a second person, or a second surface; the thing the first hour must demonstrate.
- **Mandate**: scoped authority for an agent to commit its principal; parked as a first-class object.
