---
title: "Tokenrip: Harness Lock-in, the Self-Custody Workspace, and Templates as the Format"
date: 2026-09-24
status: Bean session capture, for Simon's review; amends the v2 master where marked
author: Bean (thinking partner), from a session with Simon 2026-09-24
scope: framing (chain / wallet), the lock-in story, N=1 multi-harness as the first case, workspace templates, first-hour rewrite, GTM changes, homepage updates against the live page
amends:
  - active/tr-rework/tokenrip-v2-master-2026-09-22.md (§8.1 first hour, §9.3 listings, §11 metrics, §13 risks, §14 assumptions)
  - active/tr-rework/tokenrip-first-loop-site-gtm-2026-09-04.md (§5 GTM: order of listings vs state; templates as the distribution artifact)
  - active/tr-rework/tokenrip-positioning-gtm-onboarding-recommendations-2026-09-08.md (§4 onboarding: the seed is the harness, not the website)
  - active/tr-rework/tokenrip-homepage-v3.1-2026-09-05.md (§8 here: nine changes against the live page, with claim-discipline conditions)
related:
  - agents/bean/ideas/self-custody-workspace.md
  - agents/bean/ideas/sovereign-organizational-memory.md
  - agents/bean/ideas/mounted-agent-model.md
---

# Tokenrip: Harness Lock-in, the Self-Custody Workspace, and Templates as the Format

> **One sentence.** Models are converging, so every harness is fighting to own what surrounds the model: your memory, your files, your context. Tokenrip is the workspace you own outside any harness, first for one person running several agents, and the unit that makes it work across harnesses is a published workspace template.

## 1. The framing: Tokenrip is the chain, harnesses are the wallets

Simon's observation: Tokenrip behaves like a blockchain, and the harnesses (Claude Cowork, ChatGPT Work, Instinct, Muse) behave like wallet providers. The mapping is close enough to generate design, and every row of it already exists in the v2 master, which means the product converged on this shape without being designed for it.

| Chain | Tokenrip | Status |
|---|---|---|
| Chain state | Workspace record, versioned | v1 PRD |
| Wallet | Harness | fact |
| Keys, address | Principal, mandate | shipped / parked |
| Signed transaction | Session: load, work, save with reasoning | v1 PRD |
| Block history | Log, versions, promotion events | v1 PRD |
| JSON-RPC | MCP | fact |
| Smart contract | Reflex: runs on-chain, no human, caller pays | in progress |
| Gas | Member's own keys for reflexes | decision |
| dApp | Surface, module | shipped / designed |
| "Connect wallet" | Per-workspace MCP endpoint as the invitation | decision |
| Block explorer | Browser door | v1 PRD |
| Embedded wallet (Privy, Magic) | Outsider identity by name, phone, magic link | pending |
| Multisig | Visibility promotion as an explicit, logged, version-pinning event | v1 PRD |
| Token standard (ERC-20) | Workspace template | **new, §4** |

**Rule:** this is a design generator, not a positioning line. No chain vocabulary reaches the page. The crypto shelf is the worst shelf a founder tool can sit on, and Tokenrip's founders have a crypto history that would make the association stick.

## 2. The lock-in story is the problem statement

**Claim [inference, high confidence]:** frontier models are converging in capability, so the vendor fight has moved to everything around the model. Memory, files, connectors, scheduling, the canvas. Each harness wants your working state in its host, in its format, because that is the only durable lock-in left.

Two precedents say how this ends:

- **Microsoft won the PC on file formats, not on the editor.** Word won because documents were .doc. Harness memory is the .doc of the agent era.
- **Custodial exchanges vs self-custody.** "Not your keys, not your coins" was the single most effective consumer-education line in crypto. Tokenrip's version: *your work should not live in your wallet.* Switch from Instinct to Muse, or lose Cowork, and the workspace is still there.

The v2 master already claims "brain separated from the harness." The lock-in story is the same claim with the emotional hook the copy lacks: the reader has already felt trapped in one host.

**The catch, from the consortium-chain graveyard.** Between 2016 and 2019, vendor-run "neutral shared ledgers" (TradeLens, R3, Hyperledger consortia) all died. Two causes: nobody trusted the operator's claim of neutrality, and a plain shared database was good enough. The second cause does not apply in 2026, because the writers are now agents inside harnesses nobody else controls, and the only door into them is MCP. A shared Postgres has no client that Cowork or Muse can use. The first cause still applies. **Neutrality claimed by a company is a promise; neutrality you can verify is a property.** For Tokenrip that means:

- Full export as a first-class command, on the page, in the free tier.
- The workspace format published and open (the standard-files convention is already halfway there).
- Plausibly a self-hostable server, later.

Credible neutrality is verifiable exit. Chains are neutral because leaving is trivial, which is why nobody leaves. Add "export and open format" to the "not charged for" list in §10 of the master.

## 3. N equals one comes first: one person, several agents, one workspace

Simon's own usage is the proof. Claude Code, Codex, and Grok's harness all run against the same local repo. `CLAUDE.md` and `AGENTS.md` are the harness config. The repo is the asset; the harness is disposable and picked per task from the command line. Most Muse or Instinct users already hold a ChatGPT or Claude account, so the multi-harness person is the default, not the edge case.

Three consequences:

1. **The industry already converged on the config layer.** `AGENTS.md` is a de facto standard every harness reads. That is the wallet-standard moment: the format won before any host did. Tokenrip's `load` call returning index, status, log, and queue is `AGENTS.md` delivered over MCP instead of over the filesystem. Same convention, different transport.
2. **What a cloud agent lacks is a filesystem it can mount that you own.** Muse has no `cd ~/vault`. Tokenrip is the hosted repo for harnesses that cannot clone.
3. **Git does not solve this, and GitHub does not either.** "Tell your friends' agents to use this git repository" fails at the second person, who does not know what git is and whose harness cannot clone. Git may well sit underneath, the way GitHub is git plus identity, permissions, a browser, and a sendable URL. The surface has to be joinable by a link, readable by a harness with no shell, and richer than files: calendars and other connections, tooling, context assembled from files plus prompt-time input, embeddings-backed querying.

The old tagline was right about the gap and wrong about the comparison class. "Coding agents have git" is true because git gives them three things at once: sync, a boot convention the harness reads, and history. Everything else has none of the three. Naming git invited "so use git." Name the three things instead.

## 4. The template is the unit that carries the format

Simon's proposal: workspace types, starting with an onboarding template that tells the harness what to load, in what format, and everything else.

**In the analogy, a template is a token standard.** ERC-20 was a short spec that said "a token has these fields and these operations," and its power was that every wallet could render a token it had never seen. A workspace template says "a personal workspace has these files in this shape, and here is how to fill them." Any harness that reads it can populate it; any other harness can boot from it; the two never coordinate. The template is the agreement between harnesses. Tokenrip only has to publish it.

This resolves the pile problem. Cowork does not decide what "everything relevant to Simon" means; the template does. The onboarding template is the day-one-hire brief: who I am, what I am working on, what I have decided, what is open, plus where the corpus attaches. Cowork answers it from memory. Instinct reads four short files. The corpus sits underneath and gets queried, not loaded.

**Where templates go past onboarding:**

- **The intake from "onboarding is the moat" (April), with the harness filling the form.** Substantive intake, zero human friction, because the substance already lives in the harness.
- **Every workspace type is a template.** Personal, friends (poll shape), client (boundary shape), company (positions shape, with the URL extraction as its fill step). A friend's Muse joins a friends workspace and reads a template it already understands.
- **A template is the module manifest** from the sovereign-memory thread. A template that also declares a source, a reflex, and a surface is a module. The call processor is a company template plus a Fathom source plus one reflex.
- **Templates are the distribution artifact.** `llms.txt` and every connector listing point at a template URL, not at docs. A harness that hits it can complete onboarding with no human reading anything. This is "opinionated workflows over primitives": git needed Git Flow; workspaces need a personal template.

**Design rule: judge a template on the read side.** Harnesses follow instructions unevenly. Cowork, with files, will fill a workspace richly; Instinct or Muse would fill the same template thinly. A good template is one that a harness that did not write it boots correctly from a bad fill. Required fields must be allowed to be short and honest ("no decisions yet"); the rest optional. Otherwise the demo dies exactly where it matters, at the first load into the weaker harness.

## 5. The first hour, rewritten: create in one harness, load in another

The v2 master's founder door starts with "give me your company URL and I'll draft five decisions," and puts "second tool, same knowledge" at step six. Simon's version:

1. **"Cowork, create and populate my workspace."** Cowork fetches the personal template and fills it from what it already knows about Simon: projects, files, preferences, open threads.
2. **"Instinct, load my workspace."** Instinct boots from the same template and says something it could only know from Cowork.
3. Both work against it, both save back.

Two things are different, and both are better:

- **The seed is the harness's memory of you, not your website.** This is the first withdrawal from the exchange to self-custody. It is also the exact thing each harness vendor is building lock-in around. Today it works because Cowork is an agent with tools and writes whatever it is asked. Exchanges added withdrawal friction the moment it hurt them. **That is the why-now: do this while the wallets are still leaky.** [inference; the restriction has not happened yet]
- **The crossing is step one, not step six.** Nothing is demonstrated until the second harness knows something from the first. That is the whole demo, and it needs no drafted decisions to land. URL extraction stays as the fill step for the company template and the fallback for a harness with thin memory.

The personal-agent door (§8.2 of the master: checklist, poll) is unchanged; it is the same move with N above one and a surface instead of a second harness.

**Cheapest disconfirming test, this week, zero new code:** write the personal template as a markdown spec, have Cowork populate a workspace from it via the existing MCP endpoint, then have Instinct (or any second harness) load it and answer one question only the workspace could answer. If the second harness cannot boot from the fill, the template is wrong. If it can, the first hour is real before any extraction skill ships.

## 6. What changes in the GTM

| Area | Was (09-04, 09-08, v2 master) | Now | Why |
|---|---|---|---|
| **Problem statement on the page** | The git gap: a place another person's agent can continue your work | The lock-in gap first: your context is trapped in one host; then the git gap as the multiplayer consequence | Every reader with two AI accounts has felt it; the git gap needs a second person to feel |
| **First hour, founder door** | URL → five drafted decisions → inbox item → correct → second tool (step 6) | Harness A fills the personal template → Harness B loads it (step 2) → correct → company template with URL extraction as the fill | Crossing at step one; the seed is memory the harness already holds |
| **First object** | Five drafted decisions | A populated personal workspace, template-shaped | Zero inference risk on day one; "bland extraction" (risk 3) cannot kill the first minute |
| **Activation** | A correction, or a second writer | Unchanged, plus a new leading indicator: **a second harness writes** (N=1 multiplayer). Second writer stays the N>1 expansion metric | The N=1 case is the new front door and needs its own signal |
| **Listings (§9.3)** | Submit the Muse connector, list in directories | Same, in a fixed order: state first, listings second. Listings point at a template URL | Wallets integrated chains their users already held assets on; nobody integrated an empty chain. The lures (call processor, poll) put state on Tokenrip first |
| **Distribution artifact** | Docs, `llms.txt` to the MCP URL | Published templates; `llms.txt` and listings link the personal template | A harness completes onboarding from a template with no human reading |
| **Concierge (§9.2)** | Hand-built workspace from the founder's site; build log → extraction skill | Hand-filled template from the founder's harness and site; build log → template spec | The concierge is now specifying the template, which is the reusable artifact |
| **Product obligations (§10)** | Access control, boundary, reliable handling | Plus full export and an open workspace format, free tier, on the page | Credible neutrality is verifiable exit |
| **Copy** | "Works in the tool you already use" | Add the lock-in line, candidate: "Your agents will change. Your workspace shouldn't." | The hook the separation claim lacks |
| **Pricing** | Per workspace; free to drive, pay for autopilot | Unchanged | |
| **Call processor and poll lures** | Unchanged | Unchanged; each is a template plus a source or a surface | |

**What does not change:** ICP (AI-native small companies first, now with the person-firm entry explicit), the inbox as the daily surface, the work queue as the first build, the boundary as a first-class object, per-workspace pricing, no consumer pivot, no matcher, no chain vocabulary anywhere public.

## 7. Amendments to the v2 master, by section

- **§8.1** Replace steps 1 to 6 with §5 above. Keep the URL extraction as the company-template fill and the thin-memory fallback.
- **§9.3** Add the ordering rule (state before listings) and change every listing target to a template URL.
- **§10** Add export and open format to "not charged for."
- **§11** Add "second harness writes" as the N=1 activation indicator, before "second writer."
- **§12 roadmap** Insert "Workspace templates: personal, friends, client, company; published at stable URLs; read-side acceptance test" between items 1 and 4. It is mostly a spec, not code.
- **§13 risks** Add risk 8: **harnesses restrict "write everything you know about me."** If Cowork or Muse block memory export to third-party tools, the seed reverts to the website and imported files. Mitigation: ship the harness-seeded first hour now; keep the URL fill as the fallback.
- **§14 assumptions** Add: "A harness will populate a template from its own memory of the user" [fact for Cowork today, Simon's usage; inference for Muse and Instinct]; cheapest test in §5.
- **§16** Add to decided: N=1 multi-harness is the front door; templates are the format. Add to hypotheses: a second harness boots correctly from a template filled by a different harness.

## 8. Homepage updates (against the live page, read 2026-09-24)

The live page is the v3.1 spec: literal hero, git gap, Codex-to-Cowork scene, files / decisions / inbox, three modules, the office section, four get-started steps, FAQ. It is good and mostly stays. It has one structural gap the session exposed: **the single person with several agents appears once, as a line under "Who plugs in," and the personal-agent harnesses do not appear at all.** The page is written for N above one. The new front door is N equals one.

Changes, in priority order. Each carries its claim-discipline condition.

| # | Section | Now | Change | Condition |
|---|---|---|---|---|
| 1 | **The gap** | Leads with git: "Git keeps your coding agents in sync. The rest of your company has nothing like it." | Lead with lock-in, then git. New H2 candidate: **"Every AI tool wants to be the place your work lives. None of them should be."** Body: what Claude knows about your project does not reach ChatGPT, Instinct, or your co-founder's Cowork; each tool has memory and none of it crosses the vendor line. Then the git paragraph, rewritten to name the three things (one set of files, a boot convention every agent reads, a history) rather than git itself. Keep the four "what a customer asked for" lines. | None. True today. |
| 2 | **Get started** | 1 connect to ours · 2 make yours, drop in what you have · 3 write one decision · 4 open your other tool, it already knows | 1 connect to ours · 2 **"Tell your agent to set up your workspace. It fills it from what it already knows about you and your company."** · 3 **open your other tool, connect, ask it about your company: it already knows** · 4 correct one decision. Crossing moves to step 3; correction becomes the close. Closing line: "Step 4 is the only thing a human has to write." | The personal template exists and a harness fills it end to end. Until then keep step 2 as is. |
| 3 | **Hero eyebrow and harness chips** | "For AI-native companies" · chips: Claude Code, Codex, Claude Cowork, ChatGPT, Cursor, any MCP client | Eyebrow: **"For people and companies that run on agents."** Add Instinct, Muse, Grok Bot to the chips. | Chips only for harnesses verified to connect. Instinct is verified to reach external endpoints [fact, Simon's test]; Muse connector is submitted, not verified. Add each on verification. |
| 4 | **From inside (the scene)** | Simon in Codex, Alek in Cowork an hour later | Keep. Add a one-line strip above it: **"Same person, two tools."** `cowork: set up my workspace` → `instinct: what am I working on this week?` with the answer sourced from the workspace. The N=1 crossing, then the N>1 one below it. | Real capture from the §5 test. Never mocked. |
| 5 | **Inside → exit claim** | "It's files and an API. Read it with anything. Export it any time." buried at the bottom of the section; FAQ "What if we leave?" | Promote exit to its own line under the hero or as the fourth item in "Inside": **"Yours to take. Export everything, any time, in a format any tool can read."** Add "open format" only when the workspace format is published. | Export command exists and works. Open-format claim waits for the published template spec. |
| 6 | **Who plugs in** | "One person with six agents runs like a company." | Move this sentence up into the hero subline or the gap section. It is the N=1 thesis in eleven words and is currently the fourth thing on the page a reader would see about it. | None. |
| 7 | **Get started → workspace types** | "Make yours. Create a workspace." | When templates ship: "Start from a type: personal, company, client, friends." | Templates published at stable URLs. |
| 8 | **Modules** | Three modules, honest status | Unchanged. Do not rename modules to templates on the page; a template is the internal noun for the format. | |
| 9 | **CTA** | "Connect to our workspace first and ask your agent anything about Tokenrip →" | Keep as primary. Add a second path once step 2 is real: **"Or set up yours: tell your agent to create your workspace."** with the copyable prompt. | Same as #2. |

**Copy that does not go on the page:** chain, wallet, self-custody, "not your keys," ledger-as-metaphor, "sovereign." The lock-in line is written in plain English ("every AI tool wants to be the place your work lives") and the page never names a competitor's memory feature.

**What the page already gets right and should not be touched:** the literal hero, the office analogy, the decisions object, the two-terminal scene, "Do you run a model over my files? No," raw commands, no enterprise smells.

**Order of operations.** Changes 1, 3 (eyebrow only), 5, 6 are copy edits that are true today and can ship this week. Changes 2, 4, 7, 9 wait on the §5 test and the template. Change 3's chips wait on per-harness verification.

## 9. Claims, labeled

- Models are converging and the fight has moved to the harness: **inference, high confidence** (Simon's read; consistent with the 2026 host launches all leading with memory and connectors).
- Multi-harness is the default user: **fact for technical users** (Simon's repo, AGENTS.md adoption); **inference for consumer personal-agent users** (most hold a ChatGPT or Claude account, but whether they run both against one context is untested).
- A harness will fill a template from its memory of the user: **fact for Cowork and Claude Code today**; **open for Instinct and Muse**.
- A second harness boots correctly from another harness's fill: **open**; the §5 test decides it.
- Harness vendors will restrict memory export once it hurts: **inference**, medium confidence; the exchange precedent is strong, the timing is unknown.
- Verifiable exit is what makes neutrality credible to a founder: **inference**, medium-high confidence; the consortium-chain failure is the evidence, the founder's actual sensitivity is untested.

---

*Captured by Bean, 2026-09-24. Companions: [[self-custody-workspace]], [[sovereign-organizational-memory]], [[mounted-agent-model]], [[substrate-gtm-wrappers]].*
