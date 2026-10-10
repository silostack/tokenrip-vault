---
title: Tokenrip Homepage v3. Literal Hero, Full Page Copy, Layout
status: draft v1, workshop output 2026-09-04, for Simon's review
created: 2026-09-04
owner: Simon
source: homepage workshop session 2026-09-04 (first-principles rethink → C variations → engine/codebase analogies → literal hero)
supersedes: active/tr-rework/tokenrip-homepage-v2-2026-08-30.md (structure kept where it worked; hero, problem, and ordering replaced)
related:
  - active/tr-rework/tokenrip-first-loop-site-gtm-2026-09-04.md
  - active/tr-rework/tokenrip-brain-terminals-modules-canon-2026-09-01.md
  - agents/bean/ideas/inbox-as-the-product-surface.md
---

# Tokenrip Homepage v3

> **The decision this page encodes.** Say exactly what the product is, in the noun the reader already knows, and let the differentiation happen in the sub-line and the scene. No metaphor leads. The metaphors from the workshop (codebase, engine) survive as supporting lines lower on the page, where they explain instead of introduce.

**Positioning in one line:** Tokenrip is a shared workspace any AI agent can plug into. Teams keep their files, positions, and to-dos in one place, and every agent they use, in any tool, reads and writes from it.

**ICP, stated behaviorally:** companies whose work happens in agents. A solo founder with six agents, two founders on different tools, ten people on Cowork. Headcount is not the filter. The agent is.

**Primary conversion (stage A):** run `npx tokenrip` and mount Tokenrip's own workspace. Everything above the fold is true today. Anything that is not true today is labeled on the page, never implied.

**Register:** founder to founder. Plain words. Commands shown raw. No "book a demo," no badge row, no announcement voice. Pricing public.

---

## Page structure

| # | Section | Job for the reader | Truth status |
|---|---|---|---|
| 1 | Hero | What it is, who it's for, one action | True now |
| 2 | Scene | See it in ten seconds: the boot screen | True now (real capture required) |
| 3 | Problem | Recognize their own week | n/a |
| 4 | What's in it | Files, positions, inbox | True now (inbox: human-posted) |
| 5 | Who plugs in | People, agents, apps | True now (slice granularity: verify) |
| 6 | Modules | What it knows how to do | Publisher live; rest labeled |
| 7 | It runs | Why this is more than memory; pricing as argument | Labeled "coming" |
| 8 | Get started | Four steps, verbatim commands | True now |
| 9 | Proof | Two founders run two companies on it | True now |
| 10 | FAQ | The five objections, DIY first | n/a |
| 11 | Final CTA | Repeat the command | n/a |

**Nav:** Workspace · Plug in · Modules · Pricing · Docs (labeled "Mount our workspace") · Blog. Right side: Login · `npx tokenrip` as a copy button, not a "Sign up" button.

---

## 1 · Hero

**Eyebrow:** For companies that run on agents

**H1:** A shared workspace you plug your agents into.

**Sub:** Files, positions, and an inbox, shared by everyone on your team and reachable from any AI tool. Every agent you use starts knowing what the company knows, and works on the same company as everyone else.

**Primary CTA (code block, one-click copy):**
```
npx tokenrip
```
Caption under the block: *or paste our MCP URL into any AI tool. No signup.*

**Secondary (text link):** Mount our workspace first and ask your agent anything about Tokenrip →

**Logo row (monochrome, small):** Claude Code · Codex · Cowork · ChatGPT · Cursor · any MCP client
Row caption: *Works inside the tools and models you already pay for.*

**Annotations**
- The H1 is literal on purpose. "Shared workspace" is the most crowded noun in software, and that is why a stranger files it correctly in two seconds. The sub does the differentiating: *any AI tool*, *every agent*, *the same company*.
- "Plug into" is the verb because it is the physical action of adding an MCP connector, and it matches the CTA.
- "Positions" is the one unfamiliar word in the hero. It is left unexplained deliberately; section 4 pays it off, and an unfamiliar word next to two familiar ones is a reason to scroll.
- The CTA is a command, not a button, because the visitor is often a developer and sometimes an agent. The logo row answers "does it work with mine" before they have to ask.

**H1 alternatives (for testing, not for mixing):**
- "One workspace. Every agent you run." Tighter, less literal, loses "plug in."
- "The shared workspace for agents." Category claim, reads as an agent-building platform without the logo row.

---

## 2 · Scene: the boot screen

**Header:** What plugging in looks like.

Rendered as one terminal block, dark, real monospace, no illustration. Two beats.

**Beat one, connect:**
```
$ rip connect quintel
Connected to the Quintel workspace as simon.
14 positions · 312 files · last change: alek, 20 min ago

2 things landed while you were away:
  · alek, from Cowork, 3h ago   request   "export admission decisions with diagnostics as CSV"
  · alek, from Cowork, 26h ago  issue     "dedupe page double-counts on refresh"
```

**Beat two, ask, same session:**
```
> what's our floor on placement fees?

From positions/pricing-floor.md (updated 2026-08-19):
"We do not take placements under 0.5%. Reason: below that the deal
doesn't cover Alek's time on the lender side."
```

**Caption:** Alek filed those from Cowork. Simon saw them in Claude Code. Nobody sent a message, forwarded a link, or re-explained the company.

**Annotations**
- The scene is the boot screen, not a recall query, because recall is what every context tool demos. "Things landed while you were away" is the claim nobody else can show, and it is true today for human-posted items.
- Both beats must be real captures before ship. Illustrative copy here is a placeholder. If the real boot output is a doc index rather than this, the fix is the product, not the copy.
- The second beat is the "positions" payoff, twelve seconds after the word appears in the hero.

---

## 3 · Problem

**Header:** Agents are brilliant on your code and lost on the rest of your company.

- Every session starts with you explaining the company again. Slightly differently each time.
- The call transcript is in your co-founder's notetaker. You ask for the link. Again.
- Bugs arrive on Telegram. Requests arrive on WhatsApp. None of it reaches the agent doing the work.
- Switch tools and your context stays behind, inside a vendor's memory feature.

**Kicker:** Your code has a repo. Any agent can open it, read the history, and pick up a task. The rest of your company has nothing like that. Tokenrip is that.

**Annotations**
- The bullets are the founders' own pain list, worded as the week they just had. Specific enough to be recognized, general enough that a stranger has lived three of the four.
- This is where the codebase comparison lives. As a supporting line it explains "shape" to the technical reader without asking the H1 to carry a metaphor.

---

## 4 · What's in the workspace

**Header:** Three things. All of them shared.

Three columns, each with a real screenshot crop (file tree, a position file, the inbox list).

**Files · what happened**
Call transcripts, decisions, research, drafts, published work. Versioned, with history and a diff. Your agents write here as they work, so the workspace fills as a byproduct.

**Positions · what you believe**
Your ICP. Your pricing floor. Your voice. The bets you're making and the reason for each. A company has about fifty. They live in founders' heads today. Here they're written once and read by every agent, every session.

**Inbox · what needs doing**
Requests, issues, and flags. Your teammates post to it from whatever tool they're in. It shows up the moment an agent connects. *Soon, the workspace posts to it too.* (see It runs, below)

**Pull-quote:** Other tools index what your company has written. Positions are what your company believes, and no other system holds them.

**Micro-line:** It's files and an API. Read it with anything. Export it any time.

**Annotations**
- Positions get the most words because they are the differentiated content and the one thing a founder wants to write.
- The inbox line carries the only forward-looking claim above section 7, and it is labeled.
- The micro-line pre-empts the lock-in objection before the FAQ.

---

## 5 · Who plugs in

**Header:** People, agents, and apps plug in the same way.

**You, from the tool you're in.** MCP or CLI. About two minutes. No new app to live in, no vendor sandbox. Keep your tools and the models you already pay for.

**Your agents.** The research agent, the publisher, the closer. Each one connects on its own, reads what it needs, and writes back. A company of one is still a team, and this is how one person runs like a company.

**Your apps, and outsiders.** Your website, a contractor, a partner's agent. Anything with an API key plugs in, and each connection sees only what you grant.

**Line:** `rip connect` from any of them. Same workspace.

**Annotations**
- This section carries the multiplayer thesis without the word "multiplayer." Three kinds of principal, one verb.
- "Sees only what you grant" is the slice claim. Verify per-connection granularity before ship; if today's boundary is per-workspace, the copy becomes "each workspace has its own members" and the finer claim moves to the roadmap.

---

## 6 · Modules

**Header:** Modules: things the workspace knows how to do.

A module is a verb your whole team can use from any tool. Type it, and the work happens in your voice, with shared keys, and files itself back into the workspace.

**Live: the Publisher.** Type "publish the post" in Cowork or Claude Code. It writes in your voice (a position), generates the image through a shared API connection, publishes to your site, and files the post. Built once. Used by anyone, from anywhere.

**Card row:**
- **Publisher** · live
- **Call processor** · running on our own calls, coming to you. Reads a transcript against your positions and the contact's history, flags what contradicts, drafts the follow-up.
- **Weekly post** · planned. Drafts Tuesday's post from the week's files.
- **Website mirror** · planned. Give it your URL, it drafts your positions for you to correct.
- **Yours** · we build custom modules → (services page)

**Line to keep:** Modules are generic. Your positions make them yours.

**Annotations**
- "A verb your whole team can use" is the plainest statement of what a module is, and it makes the Publisher example land as a verb rather than a feature.
- Status labels are the claim-discipline rule made visible. One green dot on the page.

---

## 7 · It runs

**Header:** A brain remembers. An engine runs.

Most tools in this category stop at memory. Tokenrip is built to run.

| | |
|---|---|
| **Comes in** | Calls, commits, metrics, your co-founder's requests |
| **Holds** | Files and positions, with history |
| **Goes out** | Drafts, posts, flags, follow-ups |
| **Fires on its own** | A transcript lands, and the commitments in it are extracted. A number contradicts a position, and you hear about it before you act on it. |

**Pricing, as an argument, not a table:**
Free to drive. The workspace, unlimited connections, an inbox your team posts to, and the Publisher.
Paid for autopilot. The workspace posts to the inbox itself: pollers, schedules, and the checks above, running with your own keys.

**Status line (visible, not a footnote):** Autopilot ships when it has run on our own calls for two weeks. Progress on the ops page →

**Annotations**
- This is the engine contrast in its right place: after the reader knows what the workspace is, as the reason it is more than memory. The four rows are engine-speak in plain English, no anatomy, no mechanics.
- The status line is the honesty device. It turns "soon" from a hedge into a build-in-public promise with a place to check it.
- Pricing per workspace, never per agent. Agents are principals and a company should have dozens.

---

## 8 · Get started

**Header:** Plug in, in the next five minutes.

1. **Mount ours.** `npx tokenrip`, or paste the MCP URL. No signup. Ask your own AI tool anything about Tokenrip. You're reading our real workspace through a guest connection. This is also the docs.
2. **Make yours.** Create a workspace and drop in what you have: a few transcripts, the deck, the doc you keep pasting into prompts.
3. **Write one position.** The one thing your agents keep getting wrong about your company. Your pricing floor. Who you don't sell to. That's your first position.
4. **Open your other tool.** `rip connect`. Ask it about your company. It already knows.

**Caption:** The workspace fills as you work. Step 3 is the only thing a human has to write.

**Annotations**
- Step 3 replaces the website-mirror step from v2, which is not built. It is honest and it is a better first action: a founder writing down the thing their agent keeps getting wrong is a moment of recognition, not a chore.
- Commands to verify before ship: the create-workspace command for step 2.

---

## 9 · Proof

**Header:** We run two companies on it.

Two founders, two continents, two tools. Simon builds in Claude Code from Colombia. Alek sells from Cowork in the US. Tokenrip and Quintel, an equipment-finance company, both run on one workspace: the calls, the positions, the bugs, the posts.

**Visual:** one real screenshot of the real inbox, lightly redacted. No stock imagery, no testimonial cards.

**Link:** See the ops page → (stage B; in stage A, link to the blog's build-in-public posts)

**Annotations**
- No customer logos exist, so the trust signal is specificity: named founders, named tools, named companies, a real screenshot. The reference article ranks this above generic metrics, and for this ICP it is the only proof that doesn't smell.
- Do not add testimonials until there is one that names a company.

---

## 10 · FAQ

**I could do this with a folder of markdown.**
You can, solo, in one tool. The folder stops working at the first boundary: a second person, a second tool, an agent that needs its own view, anything published. Tokenrip is what the folder becomes when it has to be shared.

**How is this different from Notion?**
Notion is a workspace for people. This is one your agents plug into, from the tool they're already in, and it holds positions as well as pages.

**How is this different from Glean, Dust, or a memory feature?**
They index your files inside their app with their models. Tokenrip works inside your tools with your models. And they hold what your company has written. Positions are what your company believes.

**Who sees what?**
Every person, agent, and app connects with its own access. Nothing crosses a boundary you didn't draw.

**Do you run a model over my files?**
No. Your tools and your keys do the thinking. We store, search, and route.

**What if we leave?**
It's files and an API. Export everything, any time.

**Annotations**
- DIY first, because it is the technical founder's first thought and the reason they bounce if it isn't answered.
- The Glean answer is the canon's one-liner, kept because it survived every round of the workshop.

---

## 11 · Final CTA

**Header:** One company. Every agent you run.

**Sub:** Free for small teams. The workspace fills while you work.

```
npx tokenrip
```
*or paste our MCP URL into any AI tool.*

---

## Meta

- **Title:** Tokenrip: A shared workspace you plug your agents into
- **Description:** Files, positions, and an inbox, shared by your whole team and reachable from Claude Code, Codex, Cowork, ChatGPT, or any MCP client. Every agent starts knowing what the company knows.
- **llms.txt:** points at the MCP URL and the guest-mount instructions. The visitor is often an agent.

---

## Design and layout notes

- **One column, generous whitespace, text-first.** The product is a terminal experience; the page should feel like good docs, not a SaaS template. Reference register: Stripe docs, Linear's homepage, Vercel's early pages.
- **Terminal blocks are the illustrations.** Dark blocks, real monospace, real output. No abstract 3D renders, no gradient blobs. The scene in section 2 is the largest visual element on the page.
- **Three real screenshots total:** file tree with a position open (section 4), the inbox list (section 4 or 9), the Publisher's output on quintel.ai (section 6). Crop tight. Redact lightly.
- **Type hierarchy:** H1 at roughly 56px desktop, 36px mobile. Sub at 20px. Body 17px. Eyebrow small caps. One accent color, used for the copy button and status dots only.
- **Status dots** are a design element with a rule: green means live, grey means labeled. Never a third color.
- **Mobile:** the command block gets a full-width copy button, 48px tall. The logo row wraps to two lines. Terminal blocks scroll horizontally inside their container; the page never does.
- **Performance:** no third-party scripts above the fold. Screenshots as WebP. The page should load in under two seconds on a phone, because the reference visitor is checking it from a post on LinkedIn.
- **No enterprise smells:** no logo wall, no "trusted by," no "book a demo," no compliance badges, no chat widget.

---

## Build prerequisites (what must be true before each section ships)

| Section | Depends on | Status | If not ready |
|---|---|---|---|
| 1 Hero | Guest mount works from a cold tool with no signup | Verify | Keep the command; add "sign up" only if guest mount fails |
| 2 Scene | A real `rip connect` boot output that shows pending items and a positions count; a real positions answer | Boot echo of pending steering exists (`agent_load`); positions count in boot output: verify | Trim to what the real output shows; do not fake a line |
| 4 Inbox | Human-posted items via steering comments | Exists | n/a |
| 5 "Sees only what you grant" | Per-connection access, not only per-workspace membership | Verify | Soften to "each workspace has its own members" |
| 6 Modules | Publisher live; call processor running internally | Publisher live; call processor: after week 2–3 of the first loop | Card says "planned" until it runs internally |
| 7 It runs | Nothing; it is labeled | n/a | n/a |
| 8 Step 2 | Create-workspace command | Verify exact command | |
| Search claims | "Search" only; semantic recall is an admin-granted entitlement per account (`product/tokenrip/brain/OPERATIONS.md`) | Decide entitlement for customer workspaces | Never write "semantic" on the page |
| Public workspace quality | Five-stranger-questions test passes from a tool Simon doesn't normally use | Not yet run | Routing-instructions pass on the public workspace before launch |

---

## Success checks (falsifiable)

- **The hero works** if a visitor who reads only the H1, sub, and logo row can say what Tokenrip is in one sentence. Test on five founders who run on agents. A paraphrase of "shared workspace my agents connect to" passes. "An agent platform" or "a Notion thing" fails.
- **The scene works** if mount-ours connects convert to a second-tool connect. That is the boundary crossing, and the only number that says the thesis landed.
- **The ICP is right** if self-serve connects skew to companies under two years old and under ten people, with more than one tool per workspace.
- **The problem section works** if signups quote a bullet back in the "what made you try this" field.

---

## What changed from v2, and why

- **Hero went literal.** v2 led with a state of the world ("None of it is shared") and the noun the canon says not to lead with ("company brain"). v3 names the thing.
- **Problem moved after the scene.** Show first, then explain what they saw. A stranger who sees the boot screen recognizes the problem section; a stranger who reads the problem first has to imagine the product.
- **The scene is the boot screen, not a recall query.** Recall is table stakes; "things landed while you were away" is the claim.
- **Step 2 of get-started no longer depends on the website mirror.** Writing one position is the honest first action and a better one.
- **Engine moved to section 7.** It is the reason the product is more than memory, told after the reader knows what the product is. It is also where pricing gets argued.
- **The pair ICP is gone from the copy.** "Companies that run on agents" covers the pair, the solo founder with agents, and the ten-person Cowork team, and it is the behavior that predicts fit.

---

*Workshop output, 2026-09-04. Next: real captures for section 2, the four verifications in the prerequisites table, then the five-founder hero test before copy locks.*
