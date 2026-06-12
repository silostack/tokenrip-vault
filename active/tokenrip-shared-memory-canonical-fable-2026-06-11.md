---
title: "Shared Memory — The Canonical Synthesis: What Semantic Search Unlocks, the Moat It Completes, the GTM It Implies, and the Demo That Proves It"
status: canonical draft v1 — merges two 2026-06-11 Bean session captures
created: 2026-06-11
owner: Simon
merges:
  - active/tokenrip-shared-memory-gtm-and-magic-demo-2026-06-11.md (recall flywheel · substrate-invisibility · magic demo)
  - active/semantic-workspaces-multiplayer-and-gtm-2026-06-11.md (addressing system · neutrality · wrapper economics)
related:
  - pitch/a16z-fused-2026-06-08/spine.md
  - product/tokenrip/mounted-agent-model.md
suggested_home: product/tokenrip/
note: >
  Both source captures derive from the same seed prompt, explored independently.
  Four claims were derived twice from different directions (marked ⊕ below) —
  by the re-derivation principle, these are the most-validated claims on the board.
---

# Shared Memory: The Canonical Synthesis

> **The throughline:** semantic search converts shared *storage* into shared *memory* — and memory, not storage, is what the entire thesis was missing. Recording the why (the deck's claim) is half a memory; associative recall is the other half, and it is the primitive that separates collaboration from coordination. This completes the moat (a closed read/write loop), names the GTM problem precisely (substrate-invisibility, not absence of a consumer product), supplies the governing wedge filter (the boundary-crossing test), and dictates the two artifacts that prove the thesis is real today: a 60-second magic demo and zero-ceremony ingestion. Both are acceptance tests, not marketing.

---

## Executive summary

1. **The claim: recall completes memory.** The a16z spine sells "we record the *why*" — a write-side claim, and recording is half a memory. Memory's defining property is **associative recall**: the relevant past surfaced at the moment of the next decision. Semantic search is that recall layer. *Memory you can't recall is an archive.*
2. **The why-now: knowledge work never had an addressing system, and its two fatal costs just went to zero.** Code has a symbol table; knowledge work's only address is *meaning*. Embeddings made meaning addressable (finding → free) and agents made filing free — both within the same eighteen months. This is why no incumbent did it in twenty years of sync and versioning.
3. **The mechanism: coordination passes context; collaboration retrieves it.** Large implicit context distributed across private histories cannot be passed — only retrieved. Collaboration is therefore structurally gated on associative recall over shared memory: the primitive that did not exist. This is why inter-company collaboration was never software, and why it can be now.
4. **The moat: a closed loop.** Provenance validates recall (recall by meaning, verify by lineage); recall logs extend provenance (every read records "this knowledge informed that work"). *Every read makes the record smarter; every record makes reads safer.* Neither side alone is defensible; the loop is.
5. **The GTM diagnosis: the problem is substrate-invisibility, not "no consumer product."** The current FDE motion delivers into a black box. The highest-leverage fix needs no new motion: make the deliverable substrate-visible. ⊕
6. **The GTM shape: infrastructure is never sold; it's wrapped.** Agents are the funnel, the brain is the product, autonomy and multiplayer are the paywalls. Every motion is the same sentence with a different buyer: somebody wraps the substrate in a nameable product, and a workspace gets deposited that compounds.
7. **The governing filter: the boundary-crossing test.** Delete Tokenrip — can the user get this by pointing an agent at a folder? If yes, wrong wedge. The wedge must cross a boundary local files can't: tool, device, person, or organization.
8. **Two acceptance tests decide whether this is real today:** the 60-second magic demo (read-side — does the unprompted catch work across a vendor boundary, configurable in an afternoon?) and zero-ceremony ingestion (write-side — does a Cowork session's output land in the workspace with no manual step?). If either fails, that failure *is* the backlog.

---

## I. The claim: semantic search converts storage into memory

The a16z spine ("coding agents work because code has a memory; everything else forgets") locates the moat in the *recorded why*. That is entirely a write-side claim. The defining feature of memory is not that it stores — humans do not remember by file path; they remember by *similarity-to-now*. Git's power was never storage; it is that `blame` / `log` / `grep` make history **addressable**. Operational work, even when stored, had no recall mechanism — and an archive nobody can use is indistinguishable from forgetting.

**Semantic search is associative recall for the organization.** Without it, the why-graph is write-only — a graveyard. With it, every new decision surfaces the most-relevant past decisions *and their outcomes* at the moment of choosing — a flywheel.

The pitch-ready extension of the deck's metaphor:

> *Memory you can't recall is an archive. Git gave code associative recall. Tokenrip gives every other kind of work the same — the relevant past surfaced at the exact moment of the next decision. That is what turns a shared drive into a shared mind.*

## II. The why-now: no addressing system, two costs at zero

Code has a symbol table. Every function has a name, every file a path, and programmers maintain that structure *as part of the work* — which is why git + grep is sufficient retrieval for code. Git never solved retrieval because code retrieves itself.

Knowledge work has no symbol table. A law firm's 5,000 files have no names anyone remembers and no paths anyone maintains, and the writers will never do the filing — forty years of failed KM systems prove it. **Meaning is the only address knowledge work has. Embeddings make meaning addressable.** The index was always the unbuildable part: taxonomies are write-time labor humans won't perform. Embeddings move indexing from write-time (human discipline) to read-time (machine retrieval). The index builds itself.

Knowledge management died on two unpaid-labor bills, and both just went to zero from different directions:

| Cost | Killed KM because… | What zeroes it |
|---|---|---|
| **Finding** (read-side) | Retrieval depended on taxonomy chosen up front — always wrong in hindsight | Embeddings — retrieval by *situation*, no taxonomy |
| **Filing** (write-side) | Capture was separate from the work, so it never happened | Work born on the substrate **is** the entry (capture as byproduct); agents-as-librarians checkpoint the rest |

This is the armor against "why hasn't Dropbox / Notion / SharePoint done this": git-for-knowledge was never blocked on sync or versioning — both existed for decades. It was blocked on addressability (no symbol table) and filing (no librarian). Both collapsed within the last eighteen months. That coincidence is the window.

## III. The mechanism: what shared memory unlocks

### Coordination passes context; collaboration retrieves it

| | **Coordination** | **Collaboration** |
|---|---|---|
| Goal | A shared spec, agreed up front | A spec that does not exist yet, converged on jointly |
| Context required | Small, explicit, agreed | Large, implicit, distributed across parties' private histories |
| Context handling | **Passed** (hand over the spec) | **Retrieved** (surface the relevant slice on demand) |
| Example | Coding agents on a defined task | Two companies negotiating a deal or co-authoring a proposal |

A large implicit context cannot be passed — there is too much of it, and which slice matters is unknown until the moment arrives. Collaboration is therefore structurally gated on **associative recall over large private corpora** — the missing primitive. This is *why* agent-to-agent coordination exists as software while inter-company collaboration never has. The sharpened claim for the pitch: cross-company collaboration exists today (email, calls, docs) — but it is **unrecorded and agent-inaccessible**. The gap is the substrate, not the activity.

One reframe to carry everywhere: the value is **not** "remove the human collaboration" — negotiation, alignment, and ratification are often the point. The value is **removing the context-reconstruction tax** ("per my last email," "as we discussed," "let me forward the thread") so the human collaboration is about judgment, not catching up. Each session pays O(query) instead of O(corpus).

### Intra-organization: the thirty-year-dead legal-KM problem, solved as a side effect

The unit of collaboration shifts from the document to the corpus — colleagues stop collaborating *on documents* and start feeding *the same brain*. Concretely, for two lawyers on Claude Cowork:

- **Ambient precedent.** Lawyer B writes a novel argument Tuesday; Lawyer A's agent surfaces it Thursday on an unrelated matter, without B ever telling A it exists. Knowledge moves between people without a meeting. Precedent is literally the firm's product, and today it is locked in a DMS behind matter numbers and filename guesses.
- **The handoff dissolves.** Nobody briefs anybody — the colleague's agent briefs itself, lazily, at query time. Onboarding a new associate becomes "mount the firm brain"; ramp time becomes a retrieval problem.
- **Departure residue.** When someone leaves, the queryable residue of their work stays. At small-firm scale (one departure = 20% of institutional memory), existential.
- **The decision ledger.** "Have we decided this before, and why?" surfaced by situation — a Chesterton's fence at the infrastructure level. Settled questions stop being re-litigated.

### Cross-organization: the structurally exclusive position

Inside a company a platform can be mandated. **Between companies it can't** — which is why email won: the neutral substrate nobody controlled. And it is why the cross-org layer is one the AI platforms are **structurally disqualified** from serving: a vendor who is also a *party* cannot be the neutral layer. Anthropic cannot bridge an Anthropic shop and an OpenAI shop. Vendor-neutrality is not a feature; it is an exclusive position no model owner can occupy.

The shape: **asymmetric private brains, one shared deal-scoped brain.** Side A on Claude Cowork, Side B on OpenAI Codex, meeting on the neutral substrate. A's agent drafting the term sheet pulls from A's private brain (past deals, standard red-lines) *and* the shared room (what's agreed, B's counters, the why behind each redline). B never asks "what did we agree on indemnity?" — B's agent asks the room. Today this lives in email attachments and virtual data rooms (Datasite, Intralinks — dumb storage with permissions). *The deal room that thinks* is a concrete, buyable product shape — and it is the **horizontal generalization of the deck's multi-party claim**: EF's broker → dealer → borrower → lender chain is the vertical instance; "two firms on one proposal" is the same mechanism deverticalized.

### What multiplayer AI actually is

**Not agents messaging — agents recalling from each other.** A single agent is an island bounded by its context window. Give it query access to N shared brains (team's, org's, partners') and its effective intelligence is bounded by the brains it can consult, not its own window. *"Let me check with the legal brain." "Let me see how the deals team handled this."* This also resolves an old architectural instinct: agents communicate through the objects they produce, not through channels — restated at the memory layer.

The stages, for the roadmap:

1. **Single-player** (now): each person's AI holds their context; sharing = copy-paste.
2. **Shared memory**: team workspace as common context; competence without briefing. *(What semantic search just unlocked.)*
3. **Shared work objects**: drafts live in the workspace with versions/threads; agents propose, humans review — the PR model generalized.
4. **Cross-boundary**: two orgs, two AI stacks, one deal-scoped workspace.
5. **Ambient collaboration**: the substrate produces the agenda — contradiction surfaced → thread opened → counterparties notified.

### New capability classes (compressed)

- **The brain as a mountable organ** — context injection as a service; agents become thin (instructions + tools), the workspace carries the knowledge. One brain, many agents, any harness.
- **Schema-less interop** — the query is the new API; no file-convention or format negotiation across teams or orgs.
- **Federated, projected, revocable brain access** — A grants B's agent semantic query access to a *slice* of A's brain for the duration of a collaboration. Semantic search with an ACL and an expiry. Exists nowhere today.
- **Contradiction surfacing · asked-and-answered deflection · expertise location · playbook extraction** — nearness is now computable, so consistency checks, deflection of repeated questions, "who knows about X," and "every time we negotiated this clause" all come essentially for free.
- **The brain as deliverable** — an engagement ends not with a PDF but with a queryable workspace the client keeps. The deliverable is the lock-in (and a GTM motion — see §V).

## IV. The moat — and what not to pitch

### Do not pitch semantic search

It is commodity — every vector DB, every "chat with your docs," and Cowork itself could add local retrieval tomorrow. Glean (~$7B), Microsoft Copilot + Graph, Notion AI, and Dust all already pitch "search your company's knowledge." The differentiator is **what the retrieval runs over** ⊕:

- **Born-recorded vs. indexed-after-the-fact.** Incumbents read the *exhaust* of work trapped in silos; Tokenrip is the surface work is *born on*, with versions, threads, and provenance attached at creation. Glean is also intra-company by construction — the cross-org case is structurally outside its model.
- Semantic-search-over-your-own-files is a feature; **semantic-search-over-a-multi-party, cross-tool, versioned, provenance-carrying substrate is a category.** Concede enterprise search; the wedge is where work is created by agents and crosses boundaries.

### The closed loop: fuzzy recall and exact provenance feed each other

The two halves are in tension, and the tension resolved is the moat:

- **Lineage validates recall** (read direction): semantic recall is fuzzy — it returns plausible neighbors including superseded ones. A law-firm brain confidently surfacing an *overruled* precedent as current is malpractice-grade failure. The resolution: **recall by meaning, verify by lineage** — embeddings find candidates; the why-graph plus versioning and recency weighting verifies them. Naïve top-k over a contested corpus is the failure mode of every RAG bolt-on; provenance-aware retrieval is the technical wedge competitors bolting RAG onto a file store cannot copy, because they don't have the lineage.
- **Recall extends lineage** (write direction): every retrieval is a recorded edge — *this knowledge informed that work*. Read-side provenance: usage analytics for knowledge, a graph that grows from *reads* rather than writes, accruing even when nobody contributes. No organization knows which of its knowledge is load-bearing; the workspace would. Git-blame for influence.

> **Every read makes the record smarter; every record makes reads safer.**

This is also the legal-vertical answer in disguise: legal text is hard mode for vanilla embeddings (boilerplate dominates similarity; opposite-conclusion motions embed near-identically). Hybrid retrieval over *structure* — versions, threads, review history, lineage — is the rescue, and the structure is the product.

### The honest pressure points

1. **Write-side friction is still the killer.** "Capture as byproduct" is true only if the work already happens on the substrate. If getting a Cowork session's output into the workspace takes any ceremony, git discipline has been rebuilt and non-coders will skip it — the death of every KM system. Zero-ceremony ingestion (workspace-as-working-directory, or default-on agent auto-checkpoint at session end) is acceptance test #2 (§VI).
2. **The cross-org permission model is the product, and it is hard.** "Projected, federated, revocable semantic slice of your brain" is a genuinely hard security problem — and *embeddings can leak what an ACL hides* (vectors partially reconstruct content). The index layer itself must respect walls. This is where the boldest deck claim (the cross-party network) could die — and, solved natively, it is the regulated-industry wedge: "auditable retrieval — exactly which sources informed this draft" is something black-box vendor RAG cannot offer and regulated industries require.
3. **Collaboration may be irreducibly social.** If agents quietly converge a deal, the humans may not trust it. Always pitch the context-reconstruction-tax version, never the remove-the-humans version.

## V. Go-to-market

### The diagnosis: substrate-invisibility ⊕

The GTM space is a cube: **walk-backward ↔ walk-forward** × **high-touch ↔ self-serve** × **substrate-visible ↔ substrate-invisible**. The current FDE motion sits at *walk-backward / high-touch / invisible* — and the felt pain ("the motion doesn't bring Tokenrip into the equation") is the **third axis, not the first**. Walk-backward delivery is fine; delivering into a black box is the problem.

The stakes, stated plainly: walk-backward proves *"people pay for solved problems"* — trivially true. It does **not** prove *"people want Tokenrip."* Five forward-deployed wins could still leave a consultancy with excellent internal tools and zero validated platform. **The deck claims a substrate-visible category ("GitHub for operational work") while the motion is substrate-invisible consultancy** — the deck writes a check the motion does not test. Only **independent substrate pull** — someone mounting, sharing, or expanding without a forward-deployed engineer in the room — validates the category claim. Measured honestly: not "did the video get views" but *"did anyone mount / share / expand a substrate-native agent without a sales call?"*

### The shape: infrastructure is never sold; it's wrapped

Nobody consumer-adopted Postgres — they signed up for products made of it. **Agents are the funnel, the brain is the product, autonomy and multiplayer are the paywalls.** The consumer compounding loop:

1. **Mount the agent** — free, working in five minutes, single-player utility.
2. **The brain accretes** — within a month the agent's memory lives in the user's workspace. The agent was the door; the workspace is the switching cost.
3. **The second agent arrives warm** — it reads the same brain. Agents are interchangeable; the accumulated brain isn't. Cross-sell costs nothing.
4. **The paywall is autonomy, not capability** — free to drive, pay for autopilot: scheduled runs, memory beyond N artifacts, multi-agent brain sharing. People pay at exactly the moment the agent stops being a chore and runs overnight.
5. **"Invite a teammate" bridges to B2B** — share the workspace; the consumer motion becomes the bottom-up ladder.

### The governing filter: the boundary-crossing test

The first-pass test — *delete Tokenrip; does the agent still work on local files?* — is right in spirit but proves too much: taken strictly it kills nearly every single-player wedge (a job-seeker's agent works fine on local files). What local files can't do is **cross a boundary**. The corrected test:

> **Delete Tokenrip — can the user get this by pointing an agent at a folder? If yes, wrong wedge. The wedge must be load-bearing on a boundary crossing: tool, device, person, or organization.**

Applied to the outreach idea: outreach-as-sending fails (Clay, Lemlist, n8n — no substrate required; ToS treadmill; substrate stays invisible — a wedge into an adjacent crowded category: revenue without category formation). The fix is twofold: **make memory the hero, not the sending** (the differentiator is an owned, portable, queryable relationship brain — "draft a follow-up using everything we've ever discussed, *from any tool*"), and **keep sending human-in-the-loop** (agent researches, drafts, queues; human sends — solves ToS and brand, and what professionals want anyway). Demand pool kept (outreach is the largest pre-existing agent demand), product made load-bearing, autonomy paywall intact as overnight research/draft-prep.

Catalog discipline: every piece of content ships a mountable agent (the build video is a moa session on camera; "mount it now" is the operator CTA; content compounds into catalog instead of evaporating). Small and deep — five agents that genuinely compound through the shared brain — over fifty wrappers and the GPT-store corpse-smell. Honest costs: a cadence business (a standing marketing muscle, not a weekend video), and economically an *audience / category-pull experiment* with a support tail — paired with the FDE motion it is the missing read on whether a platform exists; mistaken for the sale, it is a build competing with the sale.

### The motions, ranked by leverage

| # | Motion | Wrapper | What gets deposited | Paywall / revenue shape |
|---|---|---|---|---|
| 1 | **Substrate-visible FDE delivery** ⊕ — *highest leverage, zero new motion* | The custom build, delivered **on** Tokenrip with the customer seeing their own workspace/brain | The client's first workspace (tenant) | Year-1 services → year-2 platform renewal; second sale = **substrate expansion** ("let your other team use the brain"), not another custom build. Converts a services treadmill into land-and-expand. The Palantir mechanic the deck already cites. |
| 2 | **Cowork companion / platform-ceiling rescue** — *purest walk-forward* | "The shared drive for your team's AI" — team workspace via MCP, semantic search included | Team brain | Per-workspace pricing, product-led, no FDE labor. Pain pre-exists publicly ("my agent forgets everything; nothing my team makes is shared"); zero category education; the multiplayer thesis at its smallest commercial unit — and precisely what the model vendors structurally won't build (neither builds the layer that works with the other). |
| 3 | **Consumer agent catalog** (with the boundary-test discipline above) | Packaged agents, video-launched | Personal brains | Autonomy + memory tiers; bridge to teams. Role: the cheap independent-pull experiment the FDE motion structurally cannot run. |
| 4 | **AI-Enabler bottom-up** (Slack/Dropbox/GitHub pattern) | A power user deploys a team agent | Department brain | Usage → internal advocacy → IT licenses the substrate. Lands below the buyer. |
| 5 | **Agency channel ("arms-dealer")** | Other people's FDE deliverables, built on workspaces | Client brains at scale | Tenant fees + white-label (existing branding-tier model fits unmodified). Every agency = an FDE team Tokenrip doesn't employ; the playbook being dogfooded right now *is* the product they'd buy. Make.com's partner-led growth is the precedent. Requires self-serve to be good first. |

Every row is the same sentence with a different buyer: **somebody wraps the substrate in a nameable product, and a workspace gets deposited that compounds.** The substrate is never sold; it accumulates underneath products that are — and shared memory is what makes every deposited brain worth keeping, which is what makes every motion renew.

## VI. The two acceptance tests

The wedge filter and the demo share one acceptance criterion — **a boundary crossing**. The demo is the load-bearing test made visible. Both tests are afternoon-scale, and a failure on either *is* the real backlog.

### Test 1 (read-side): the 60-second magic demo

**Design problem:** memory's value is temporal (tell it now, it pays off later) and there is no "later" in sixty seconds. **The move: demo memory as a boundary crossing, not as persistence** — the Dropbox maneuver ("I saved *here*, it appeared *there*" converted a time value into an instant, visible space crossing). Tokenrip's boundaries are richer: tool, agent, person, organization.

**Design crux: colleague, not database.** The skeptic's deflation is "you wrote to a shared store and read it from two clients — that's Firebase." The magic is that the second agent **volunteers the relevant context, unprompted** — a database answers a query you wrote; a colleague catches something you did not ask about. The kicker is an *unprompted catch*, never an I-updated-it-and-watched-it-sync.

**The script** (split screen, two visibly different tools):

| Time | Beat |
|---|---|
| 0–12s | **Left: Claude Cowork.** Mid-work, casually: *"FYI we never take deals under 8% margin, and Henderson's paused 'til legal clears."* No save step. Keep working. |
| 12–25s | **Right: OpenAI Codex** — different tool, different logo, fresh chat. Unrelated task: *"Draft the proposal for the Wexler deal at 7.2%."* |
| 25–45s | **Codex, unprompted, before drafting:** *"Quick flag — 7.2% is under your 8% floor. Hold, or adjust?"* |
| 45–60s | Hold on the catch. *"Two different AI tools. One shared brain. Your agents stop being strangers."* — Tokenrip. |

**Three properties:**
1. **The unfakeable closer is the input.** The recorded split-screen is top-of-funnel; the live version is the closer: *"tell my Cowork agent any fact about your business — then watch my Codex agent already know it."* They pick the fact.
2. **Content forks by ICP; architecture doesn't.** Enterprise cut: margin floor. Personal cut: *"my sister's vegan, her birthday's the 14th"* → other tool, dinner planning → *"I'll skip the steakhouse — your sister's vegan, right?"* And the *boundary* forks by audience: vendor-boundary (Claude ↔ OpenAI) for grassroots magic; **person-boundary** (one agent caught what another *person's* agent knew — knowledge moving with no meeting) for B2B. One beat, one whoa — never two boundaries in one cut.
3. **Shooting it is the product test.** Two agents on one semantic workspace, the second consulting the brain before acting. If that is *config*, the thesis is real and the demo ships this week. If it cannot be shot in an afternoon, that gap is the backlog.

**Known risks:** the catch must feel earned (too-planted numbers read scripted — another reason the live closer matters); and the demo may prove too much ("a Claude and an OpenAI agent share a brain — where is my data going?") — the open-imprint/auditability story answers it, but in the follow-up, not the demo.

### Test 2 (write-side): zero-ceremony ingestion

The demo proves recall; this proves the brain *fills*. A Cowork session's output must land in the workspace with **no manual step** — workspace-as-working-directory (mount semantics) or default-on agent auto-checkpoint at session end, with summaries and metadata attached by the agent (the librarian whose labor is free). If today this requires a deliberate `rip publish`, the brain starves and every downstream claim is theater. Same standard as the demo: if it isn't config today, that gap is the backlog.

## VII. Pitch implications (a16z spine)

- **Slot-in:** slide 2's memory claim pays off at training scale (the record as corpus — years out). Semantic recall makes the same record load-bearing **on day one**. One asset, two payoff horizons: *the memory works from day one and compounds into the moat.*
- **The why-now in one breath:** blocked for decades on addressability (no symbol table) and filing (no librarian); embeddings solved the first, agents the second, both in the last eighteen months.
- **The moat sentence:** *every read makes the record smarter; every record makes reads safer.*
- **The unique-capability stack** (each defensible alone; the intersection empty):
  1. **Vendor-neutral** — the position the model owners structurally can't take.
  2. **Born-recorded** — provenance at creation, vs. indexed exhaust.
  3. **Meaning-addressable** — the index builds itself; no taxonomy.
  4. **Boundary-capable** — deal-scoped workspaces across organizations.
  5. **Agent-first** — any agent in any harness mounts the brain.

## VIII. Open questions and next decisions

1. **Can the demo be shot today?** The fork that decides everything downstream: if yes, the next artifact is the demo; if no, the next move is the smallest build that makes the unprompted catch real across two tools.
2. **Does ingestion pass the zero-ceremony bar today?** The write-side twin of question 1.
3. **Is "the brain" the canonical product noun** (vs. "workspace") for the semantic-enabled surface? It reshapes the whole vocabulary tree (mount a brain, federate brains, the firm brain, query the brain) — run the imprint-vs-soul vocabulary-tree audit before it fossilizes.
4. **What does substrate-visible delivery look like for Quintel specifically?** Does the EF broker get a Tokenrip login and see their deal-brain? If not, why not — this is where walk-backward and walk-forward fuse on a deal already in motion.
5. **Provenance-aware retrieval** (recall by meaning, verify by lineage) — scope the build; it is simultaneously the legal-vertical rescue, the anti-RAG-bolt-on technical wedge, and one half of the closed-loop moat.
6. **Launch wedge for the catalog:** the relationship-brain outreach agent (largest demand pool, made load-bearing), or an inherently-shared first agent closer to the multiplayer story? Apply the boundary-crossing test before committing.
7. **Index-layer permissioning:** how early does ACL-respecting retrieval (ethical walls, cross-org isolation, embedding-leakage handling) need to exist — and is it a Phase-1 requirement for the cross-org claims in the deck?

---

*Canonical synthesis of two independent Bean session captures, 2026-06-11. Source documents preserved unchanged alongside this one. Claims marked ⊕ were derived independently in both sessions — treat as the most-validated claims in the document.*
