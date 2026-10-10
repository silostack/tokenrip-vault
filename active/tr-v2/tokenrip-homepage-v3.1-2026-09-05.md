---
title: Tokenrip Homepage v3.1. Literal Hero, Git Problem, Patch Bay Scene
status: draft v3.1b, workshop output 2026-09-05, for Simon's review
created: 2026-09-05
owner: Simon
source: homepage workshop sessions 2026-09-04/05 (literal hero → git insight → collaboration theme → patch bay visual)
supersedes: active/tr-rework/tokenrip-homepage-v3-2026-09-04.md (changes listed at the end)
related:
  - active/tr-rework/tokenrip-first-loop-site-gtm-2026-09-04.md
  - active/tr-rework/tokenrip-brain-terminals-modules-canon-2026-09-01.md
  - active/tokenrip-shared-memory-canonical-fable-2026-06-11.md
  - active/tr-rework/visuals/ (patch bay renders)
---

# Tokenrip Homepage v3.1

> **The decision this page encodes.** Name the thing in a noun the reader already has. Argue one insight: coding agents have git, everything else has a chat window. Carry one theme without naming it: work done in one tool is there for the next person, in theirs.

**Positioning in one line:** Tokenrip is a shared workspace any AI agent can plug into. Your files, your decisions, and what needs doing, in one place your team and every agent you run can reach from any AI tool.

**ICP, stated behaviorally:** companies whose work happens in agents. Solo founder with six agents, two founders on different tools, ten people on Cowork.

**Vocabulary rule:** hero and headers use only nouns a stranger already has. "Positions," "mount," "terminal," "principal" stay in docs and the CLI. On the page: decisions, connect, tool, and "people, agents, apps."

**Register:** founder to founder. Short. Commands raw. No "book a demo," no badge row, no announcement voice.

---

## Page structure

| # | Section | Job | Truth status |
|---|---|---|---|
| 1 | Hero | What it is, who for, one action | True now |
| 2 | Scene | Any tool, one workspace, in two seconds | True now |
| 3 | Problem | The git insight | n/a |
| 4 | What's in it | Files, decisions, inbox | True now |
| 5 | Who plugs in | People, agents, apps | Verify access granularity |
| 6 | Modules | What it knows how to do | Publisher live; rest labeled |
| 7 | More than memory | The contrast, autopilot, pricing | Autopilot labeled |
| 8 | Get started | Four steps | Verify create command |
| 9 | FAQ | Six objections | n/a |
| 10 | Final CTA | The tagline and the command | n/a |

**Nav:** Workspace · Plug in · Modules · Pricing · Docs · Blog. Right: Login · `npx tokenrip` copy button.

---

## 1 · Hero

**Eyebrow:** For companies that run on agents

**H1:** A shared workspace you plug your agents into.

**Sub:** Your files, your decisions, and what needs doing, in one place your team and every agent you run can reach from any AI tool. Work done in one tool is there for the next person, in theirs.

**CTA (code block, one-click copy):**
```
npx tokenrip
```
*or paste our MCP URL into any AI tool. No signup.*

**Secondary link:** Connect to our workspace first and ask your agent anything about Tokenrip →

**Logo row:** Claude Code · Codex · Cowork · ChatGPT · Cursor · any MCP client
*Works inside the tools and models you already pay for.*

**Notes**
- Literal H1 on purpose. The sub does the differentiating: any tool, every agent, next person.
- "Decisions" replaces "positions" everywhere on the page. Same thing, a word people have.
- Second sentence of the sub is the theme. It never gets named.

---

## 2 · Scene

Two parts. The visual sits directly under the hero and is read in two seconds. The terminal block comes after the problem section and is read in twenty.

**2a · The visual (hero-adjacent, full width):** the patch bay. A wide rack unit, black, smoked-glass top with the file tree (files, decisions, inbox) glowing inside. The front panel is split in two. **IN · AGENTS:** seven jacks, black cables, green pulses flowing in: Claude Code, Codex, Cowork, ChatGPT, Cursor, Pi, OpenRouter. **OUT · WORK:** four jacks, amber cables, pulses flowing out: decisions, proposals, posts, follow-ups. Amber readout on the right: `alek · cowork · 3 min ago · filed an issue`. One green LED. Renders in `active/tr-rework/visuals/` (10 through 13 are the in/out versions).

**Caption under the visual:** Agents plug in. Work comes out. Everyone can see both.

**2b · From inside (after section 3):**

**Header:** What connecting looks like.

```
$ rip connect quintel
Connected to the Quintel workspace as simon.
14 decisions · 312 files · last change: alek, 20 min ago

2 things landed while you were away:
  · alek, from Cowork, 3h ago   request  "export admission decisions as CSV"
  · alek, from Cowork, 26h ago  issue    "dedupe page double-counts on refresh"
```
```
> what's our floor on placement fees?

decisions/pricing-floor.md (updated 2026-08-19):
"No placements under 0.5%. Below that the deal doesn't
cover the lender-side work."
```

**Caption:** Alek filed those from Cowork. Simon saw them in Claude Code. Nobody sent a message.

**Notes**
- The visual carries "any tool, one workspace." The terminal carries "things landed." Neither has to do both.
- Both terminal beats must be real captures. If the real boot output is a doc index, fix the product, not the copy.
- The readout in the visual is the theme in an image: someone, from some tool, just did something here.

---

## 3 · Problem

**Header:** Coding agents have git. Everything else has a chat window.

In a repo, an agent is a teammate. It opens the same files as everyone else, reads what changed, picks up a task, and leaves a change the next person sees.

Outside the repo, the same agent is a temp. Whatever it did lives in one person's chat, in one tool, and is gone when the tab closes.

The pricing you settled on Tuesday's call. The bug your co-founder found. The post that was supposed to go up. The reason you stopped selling to brokers.

**Kicker:** None of it has a place to land, so nobody else's agent can pick it up. Tokenrip is the place: an office your team and your agents work in.

**Notes**
- This is the memory-vs-collaboration distinction without either word. Memory tools stop your assistant forgetting you. Git lets someone else continue your work.
- The four fragments are the pain list. Short on purpose: the reader supplies their own version.
- Alternate header: "Your agents are teammates in the repo and strangers everywhere else."
- The office analogy enters here, one clause, right after the git line has done the arguing. The git line explains the gap. The office names what fills it.

---

## 4 · What's in the workspace

**Header:** Three things. All of them shared.

Three columns, each with a real screenshot crop.

**Files · what happened**
Transcripts, research, drafts, published work. Versioned, with history and a diff. Your agents write here as they work, so it fills by itself.

**Decisions · what you settled**
Your pricing floor. Who you don't sell to. Your voice. The bets and the reason for each. A company has about fifty, and today they live in the founders' heads. Here they're written once and read by every agent, every session.

**Inbox · what needs doing**
Requests, issues, flags. Teammates post from whatever tool they're in. It's the first thing an agent sees when it connects. *Soon, the workspace posts to it too.*

**Pull-quote:** Other tools index what your company wrote. Decisions are what your company settled, and no other system holds them.

**Micro-line:** It's files and an API. Read it with anything. Export it any time.

---

## 5 · Who plugs in

**Header:** People, agents, and apps plug in the same way.

**You, from the tool you're in.** MCP or CLI. Two minutes. No new app, no vendor sandbox.

**Your agents.** The researcher, the publisher, the closer. Each connects on its own, reads what it needs, writes back. One person with six agents runs like a company.

**Your apps, and outsiders.** Your website. A contractor. A partner's agent. Anything with a key plugs in and sees only what you grant.

**Line:** `rip connect` from any of them. Same workspace.

**Notes**
- "Sees only what you grant" needs per-connection access to be true. If today's boundary is per-workspace, the line becomes "each workspace has its own members."

---

## 6 · Modules

**Header:** Modules: things your workspace knows how to do.

A module is a verb your whole team can use from any tool. Type it, and the work happens in your voice, with shared keys, and files itself back.

**Live: Publisher.** Type "publish the post" in Cowork or Claude Code. It writes in your voice, generates the image on a shared key, publishes to your site, files the post. Built once. Used from anywhere.

**Cards:**
- **Publisher** · live
- **Call processor** · running on our own calls. Reads a transcript against your decisions and the contact's history, flags what contradicts, drafts the follow-up.
- **Weekly post** · planned. Tuesday's post from the week's files.
- **Website mirror** · planned. Give it your URL, it drafts your decisions for you to correct.
- **Yours** · we build custom modules →

**Line:** Modules are generic. Your decisions make them yours.

---

## 7 · More than memory

**Header:** A company brain remembers. An office is where the work gets done.

Tokenrip is the office. Your agents and your team's pick up each other's work there, and it's built to do work on its own.

| | |
|---|---|
| **In** | Agents, from any tool. Calls, commits, metrics, your co-founder's requests |
| **Holds** | Files and decisions, with history |
| **Out** | Decisions, proposals, posts, follow-ups |
| **Fires on its own** | A transcript lands and its commitments are pulled out. A number contradicts a decision and you hear about it first. |

**Pricing, as an argument:**
Free to drive: the workspace, unlimited connections, the inbox, the Publisher.
Paid for autopilot: the workspace posts to the inbox itself. Pollers, schedules, the checks above, on your keys.

**Status line, visible:** Autopilot ships after two weeks on our own calls. Progress on the ops page →

**Notes**
- The contrast line does the theme's last job: says what memory products are, says what this is, moves on. Brain vs. office is the whole category argument in seven words, and this header is where a skimmer reads it.
- Pricing per workspace, never per agent.

---

## 8 · Get started

**Header:** Plug in, in the next five minutes.

1. **Connect to ours.** `npx tokenrip`. No signup. Ask your own AI tool anything about Tokenrip. This is also the docs.
2. **Make yours.** Create a workspace. Drop in what you have: a few transcripts, the deck, the doc you keep pasting into prompts.
3. **Write one decision.** The thing your agents keep getting wrong about your company. That's the first one.
4. **Open your other tool.** `rip connect`. Ask it about your company. It already knows.

**Caption:** Step 3 is the only thing a human has to write. The rest fills as you work.

---

## 9 · FAQ

**I could do this with a folder of markdown.**
Solo, in one tool, yes. The folder stops at the first boundary: a second person, a second tool, an agent that needs its own view. Tokenrip is what the folder becomes when it has to be shared.

**How is this different from a company brain?**
A company brain is a memory. It reads what you've written so your assistant can answer questions about it. Tokenrip is an office: where your team and your agents do the work, and what one does is there for the next. It has a memory the way an office has a filing cabinet.

**How is this different from Notion?**
Notion is a workspace for people. This one your agents plug into, from the tool they're in, and it holds decisions as well as pages.

**Who sees what?**
Every person, agent, and app connects with its own access. Nothing crosses a line you didn't draw.

**Do you run a model over my files?**
No. Your tools and your keys do the thinking. We store, search, and route.

**What if we leave?**
Files and an API. Export everything, any time.

---

## 10 · Final CTA

**Header:** Coding agents have git. For everything else, there's Tokenrip.

**Sub:** Free for small teams. The office fills while you work.

```
npx tokenrip
```
*or paste our MCP URL into any AI tool.*

---

## Meta

- **Title:** Tokenrip: A shared workspace you plug your agents into
- **Description:** Your files, decisions, and inbox, shared by your team and reachable from Claude Code, Codex, Cowork, ChatGPT, or any MCP client. Work done in one tool is there for the next person, in theirs.
- **llms.txt:** points at the MCP URL and the guest-connect instructions.

---

## Design and layout notes

- **One column, text-first.** Docs register: Stripe docs, Linear, early Vercel.
- **The patch bay is the one big illustration**, full width under the hero. Everything else is terminal blocks and three real screenshot crops (file tree with a decision open, the inbox list, a Publisher output on quintel.ai).
- **Patch bay treatment on the page:** the render sits on the page background with no card or border. Optional: the LED and the readout are a small looping animation over the still (LED blink, readout line cycling through three real events). Keep the still as the fallback and for mobile.
- **Type:** H1 ~56px desktop, 36px mobile. Sub 20px. Body 17px. One accent color for the copy button and status dots.
- **Status dots:** green live, grey labeled. No third color.
- **Mobile:** command block gets a full-width 48px copy button. Logo row wraps. Terminal blocks scroll inside their container.
- **No enterprise smells:** no logo wall, no "trusted by," no "book a demo," no compliance badges, no chat widget.
- **Logo use on the patch bay:** vendor logos on cables need a check against each vendor's brand guidelines. Text labels are the safe fallback and the renders use them.

---

## Build prerequisites

| Section | Depends on | Status | If not ready |
|---|---|---|---|
| 1 Hero | Guest connect works cold, no signup | Verify | Add signup only if guest connect fails |
| 2b Terminal | Real `rip connect` output with pending items and a decisions count; real decisions answer | Pending-steering echo exists; decisions count: verify | Trim to the real output |
| 2a Visual | Final render chosen and retouched (labels legible, text exact) | Six candidates in `visuals/` | Ship the still; animation later |
| 5 "Sees only what you grant" | Per-connection access | Verify | Soften to per-workspace members |
| 6 Modules | Publisher live; call processor running internally | Publisher live; call processor after week 2–3 | Card says "planned" |
| 8 Step 2 | Create-workspace command | Verify | |
| Search claims | "Search" only. Semantic recall is an admin-granted entitlement per account | Decide for customer workspaces | Never write "semantic" |
| Public workspace | Five-stranger-questions test from a tool Simon doesn't use | Not run | Routing pass before launch |
| Vocabulary | "Decisions" in the CLI output and file paths, or a mapping note in docs | Decide: rename, or alias in docs | If CLI says "positions," the terminal block shows "positions" and section 4 glosses it once |

---

## Success checks

- **Hero:** five founders who run on agents read H1, sub, logo row and paraphrase "a shared workspace my agents connect to." "Agent platform" or "a Notion thing" fails.
- **Scene:** connects to our workspace convert to a second-tool connect.
- **Problem:** signups quote a fragment from section 3 in "what made you try this."
- **ICP:** self-serve connects skew under two years old, under ten people, more than one tool per workspace.

---

## What changed from v3, and why

- **"Positions" became "decisions"** everywhere on the page. One vocabulary rule added: no product nouns in the hero or headers.
- **Problem section rewritten around the git insight.** The old bullets were memory pain, which every company-brain page already says. Git is a shared place to work, not a memory. That's the distinction.
- **Scene split.** A patch bay visual under the hero says "any tool, one workspace" without reading. The terminal block moves after the problem section and says "things landed."
- **Proof section removed.** Nothing replaces it. The status line links to the ops page; the screenshots carry specificity.
- **Theme placed in five spots** (hero sub, problem, scene, section 7 header, FAQ) without the word "collaboration."
- **Section 7 header** changed from the brain/engine contrast to memory vs. picking up each other's work.
- **FAQ:** competitor names out. "Company brain" vs. office.
- **Office analogy (v3.1b):** moved out of the FAQ alone into three places: the problem kicker (one clause), the section 7 header (brain remembers, office is where work gets done), and the final CTA sub. Not in the hero: the H1 stays literal.
- **Visual (v3.1b):** the patch bay panel splits into IN · AGENTS and OUT · WORK. Caption: "Agents plug in. Work comes out." The section 7 table rows now use the same In/Out words.
- **Final CTA** takes the git tagline.
- **Copy cut** roughly a third across the page. No paragraph over three sentences.

---

*Next: pick a render, real captures for 2b, the verifications above, then the five-founder hero test.*
