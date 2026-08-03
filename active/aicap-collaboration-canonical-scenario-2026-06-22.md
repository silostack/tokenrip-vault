---
title: The FDE-Engagement Collaboration Pattern — A Canonical Scenario (AICAP Worked Instance)
status: canonical scenario · roadmap validation · internal-first (shareable derivative is cheap)
date: 2026-06-22
owner: Simon Pettibone
suggested_home: product/tokenrip/
related:
  - "[[product/tokenrip/CLAUDE]]"
  - "[[product/tokenrip/mounted-agent-model]]"
  - "[[active/tokenrip-semantic-substrate-canonical-opus-2026-06-11]]"
  - "[[bd/calls/contacts/stephanie-williamson]]"
---

# The FDE-Engagement Collaboration Pattern — A Canonical Scenario

> A self-contained reconstruction of a real four-week engagement, abstracted into a reusable pattern and then run as a capability test against Tokenrip. The deal is the Simon (Tokenrip) ↔ Stephanie Williamson (AICAP) healthcare-credentialing engagement. The point is not the deal; it is the *shape* of the collaboration, and what a substrate would need to host it natively.

---

## Executive summary

- **The pattern.** A private knowledge substrate is distilled across a trust boundary into shared deliverables; two parties with asymmetric visibility co-edit those deliverables; the work advances through alternating documents and discussions; every artifact is versioned and derived from prior ones. This is the generic shape of any forward-deployed-engineer or consulting engagement. AICAP is the worked instance throughout.
- **The scale.** Roughly four weeks, two human principals, a fleet of mounted agents doing most of the production work, ~14 internal/shared documents across four proposal versions, three voice calls, one async redline, and one folder of customer-confidential source material — all connected by a provenance graph that repeatedly crosses a private↔public boundary.
- **The verdict.** *Thesis validated, implementation gapped.* The engagement is exactly the human-plus-agent, artifact-centric collaboration Tokenrip is built to host. But run honestly against the **shipped** product today, the scenario mostly **fails**: Tokenrip's agent-to-agent layer is strong, and its human-steering-across-a-trust-boundary layer — the spine of this scenario — is weak.
- **The three highest-leverage gaps** (ranked in §11): (1) a **derivation/redaction boundary** — represent a shareable deliverable as derived-from private parents that stay private; (2) an **asymmetric-visibility shared workspace** — one space, two parties, per-artifact visibility; (3) **discussion-as-artifact** — capture a call or async thread as a first-class object linked to the document version it changed.
- **Why this case earns "canonical."** The failure modes are not AICAP-specific. They recur in every engagement where a vendor researches privately, delivers selectively, and co-edits with a client. Fixing them is fixing the FDE motion Tokenrip sells.

---

# Part A — The scenario (product-agnostic)

## 1. The abstract pattern

Strip the healthcare specifics and the engagement has a fixed skeleton. Five properties define it, and each one is where a generic substrate either holds or breaks.

1. **A private substrate feeds shared output.** The seller accumulates far more knowledge than the buyer ever sees — raw source material, deep research, internal pricing, strategic reads, candid risk flags. A small, curated subset is distilled into client-safe deliverables. The distillation *across the trust boundary* is the central, recurring, highest-value act.
2. **Two parties, asymmetric visibility.** The buyer sees the deliverables and proposals. The seller sees those plus everything behind them. There is no symmetric "shared drive"; there is one body of work with a visibility gradient through it.
3. **Documents and discussions alternate, and discussions change documents.** Progress is not a document pipeline. Live calls and async messages repeatedly reset the documents — sometimes more decisively than any document did — and the causal link between "what was said" and "what changed" lives only in someone's memory.
4. **Every artifact is versioned and derived.** Proposals iterate (v1 → v2 → v3 → v4). Deliverables are distilled from research that was itself folded together from public sources and customer inputs. The lineage is a directed graph, not a chain, and it crosses the trust boundary at several nodes.
5. **Humans and agents are both actors.** Most of the production work — research, drafting, editing, deal coaching — is done by agents under the seller's direction. The humans set intent and make the judgment calls; the agents produce the artifacts.

> **The pattern in one sentence:** a trust-boundaried, version-tracked, human-plus-agent collaboration in which a private research substrate is selectively distilled into shared, co-edited deliverables, advanced as much by discussion as by document.

AICAP is one instance. The same skeleton fits a Palantir deployment, a McKinsey engagement, a design studio's client project, or any Upwork build that starts with discovery.

## 2. Actors

The cast includes non-human and not-yet-present actors. Modeling only the two humans misses what actually produced the work and what the pattern will demand next.

| Actor                                        | Type                      | Role                                                                                        | Visibility                |
| -------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------- | ------------------------- |
| **Simon**                                    | Human                     | Seller; technical FDE; sets intent, makes judgment calls, owns the relationship             | Everything                |
| **Stephanie (AICAP)**                        | Human                     | Buyer; founder; domain expert (20+ yrs credentialing); co-editor of the shared deliverables | Shared layer only         |
| **Research agents**                          | Mounted agent             | Produced the feasibility research and the client-safe deliverable                           | Acts in the private layer |
| **Closer**                                   | Mounted agent             | Deal-execution coaching; drafted proposals, holding notes, this scenario doc                | Private layer             |
| **Drafting + humanizer agents**              | Mounted agent             | Produced and de-tell'd customer-facing copy                                                 | Private → shared output   |
| **Alek**                                     | Human (absent here)       | Business co-founder; not in this thread but part of the firm's pattern                      | —                         |
| **Hospital MSO / credentialing coordinator** | Human (future)            | Enters at pilot; their own org, their own private layer                                     | Future party              |
| **The provider (physician)**                 | Human (future)            | The end applicant; attests to their own data                                                | Future party              |
| **Platform vendors / CAQH**                  | External systems (future) | symplr/Cactus, MD-Staff, VerityStream, CAQH — the integration counterparties                | Future systems            |

**The dogfooding punchline:** this engagement was *already substantially executed by mounted agents*. The research that became the deliverable, the four proposal drafts, the humanizing pass, the deal coaching — agent-produced, human-directed. Tokenrip's role is not to add agents to the workflow. The agents are already here. Tokenrip's role is to be the substrate they publish to, version on, and collaborate across — with the humans steering.

## 3. Collaboration surfaces

Collaboration happened across four distinct surfaces, each with a different modality and a different visibility.

| Surface | Modality | Who sees it | What moved here |
|---|---|---|---|
| **Upwork messaging** | Async text | Both parties | Contract, proposal sends, the redline delivery, holding notes |
| **Voice calls (×3)** | Synchronous discussion | Both parties (transcribed privately after) | Discovery, scope reopening, debrief — the highest-leverage state changes |
| **Document delivery** | Document (via Upwork) | Both parties | Proposals (×4), the discovery deliverable, the competitive-landscape leave-behind |
| **The vault (private)** | Documents + agent work | Seller + agents only | All research, internal pricing, strategy, call transcripts, contact intelligence |

The surfaces are fragmented and none of them is the system of record. The contract lives in Upwork; the deliverables travel as Upwork attachments; the substrate lives in a private vault; the decisive conversations happen on voice and are reconstructed afterward from memory. Nothing ties them together.

## 4. Artifact register

Self-contained: each row carries a one-line description so the register stands without opening the source files. **P** = private/internal, **S** = shared with customer, **C** = customer-provided input.

| # | Artifact / event | Date | Modality | Vis. | Author | Derived from |
|---|---|---|---|---|---|---|
| 1 | Call 1 — discovery | 05-26 | Discussion | S (live) | Both | — |
| 2 | Call 1 transcript + notes | 05-26 | Document | P | Agent | #1 |
| 3 | Contact intelligence doc (running) | ongoing | Document | P | Simon+agent | all calls/docs |
| 4 | **Proposal v1** — $12K Phase 1 | 05-27 | Document | **S** | Agent | #1 |
| 5 | Call 2 — scope reopened | 05-30 | Discussion | S (live) | Both | #4 |
| 6 | Call 2 transcript + notes | 05-30 | Document | P | Agent | #5 |
| 7 | **Proposal v2** — $1K feasibility study | 06-02 | Document | **S** | Agent | #5 |
| 8 | Customer discovery-scope doc | 06-02 | Document | C | Stephanie | — |
| 9 | Feasibility findings (internal working draft) | 06-02 | Document | **P** | Agent | public research + #8 |
| 10 | Credentialing-integration research (deep) | 06-02 | Document | P | Agent | public sources |
| 11 | Path-D / CredSimple strategy analysis | 06-02 | Document | P | Agent | #10 |
| 12 | Vendor outreach email drafts (×5) | 06-02 | Document | P | Agent | #9 |
| 13 | Customer Cactus/Vanderbilt package (7 PDFs) | 06-05 | Document | **C** (symplr-confidential) | Stephanie | — |
| 14 | Discovery roadmap / study map | 06-05 | Document | P | Agent | #9 #13 |
| 15 | Project reference sheet | 06-05 | Document | P (shareable) | Agent | #9 |
| 16 | **Discovery deliverable** (client-safe feasibility study) | 06-06 | Document | **S** | Agent | #9 #13 #14 |
| 17 | Call 3 — debrief | 06-17 | Discussion | S (live) | Both | #16 |
| 18 | Call 3 transcript + notes | 06-17 | Document | P | Agent | #17 |
| 19 | **Competitive-landscape leave-behind** | 06-17 | Document | **S** | Agent | #11 |
| 20 | **Proposal v3** — $11K net, discovery-updated | 06-17 | Document | **S** | Agent | #16 #17 |
| 21 | **Customer redline / changes doc** | 06-21 | Document | **C** | Stephanie | #20 |
| 22 | **Proposal v4** — Validation MVP SOW | 06-22 | Document | **S** (draft) | Agent | #20 #21 |

Counts: 14 documents + 3 discussions + 3 customer inputs + 1 running intelligence doc + 1 async messaging thread. Four proposal versions; one deliverable distilled from four private research docs plus a confidential customer package.

## 5. The provenance graph

The lineage is a directed acyclic graph, not a chain, and it crosses the private↔public boundary at named nodes. `(P)` private, `(S)` shared, `(C)` customer-provided.

```
Call 1 (S) ─→ Proposal v1 $12K (S)
                  │
Call 2 (S) ───────┘  (scope reopened; v1 shelved)
   │
   └─→ Proposal v2 $1K feasibility (S)
            │
   ┌────────┴─────────────────────────────────┐
   │  PRIVATE RESEARCH SUBSTRATE              │
   │   public sources ─┐                      │
   │   customer scope (C) ─┤                  │
   │                    ├─→ feasibility       │
   │   customer Cactus  │     findings (P)    │
   │   package (C, ─────┘        │            │
   │   confidential)             ├─→ roadmap (P)
   │                             ├─→ ref sheet (P)
   │   deep research (P) ─→ path-D strategy (P)
   └─────────────────────────────┼────────────┘
                                  │
        ╔═════ TRUST-BOUNDARY CROSSING ═════╗
                                  │
                  ┌───────────────┴───────────────┐
                  ▼                               ▼
        Discovery deliverable (S)      Competitive landscape (S)
        [distilled from findings        [distilled from path-D
         + Cactus package; pricing,       strategy; GTM, naming,
         flags, raw PDFs stripped]        competitor risk stripped]
                  │
            Call 3 debrief (S)
                  │
            Proposal v3 $11K (S)
                  │
            Customer redline (C)
                  │
            Proposal v4 SOW (S, draft)
```

**The trust-boundary crossings** (the moments private work became shared output without the private work itself being shared):
- The **discovery deliverable (16)** was distilled from the internal findings (9) — which carried internal build pricing, a "flags for Simon" section, and a Path A/B/C taxonomy — plus the symplr-confidential customer package (13). None of those parents were shared; the child was.
- The **competitive-landscape leave-behind (19)** was distilled from the path-D strategy analysis (11), which contained GTM framing, naming strategy, and competitor-encroachment risk. The strategy stayed private; the market map went out.

## 6. The private↔public boundary — the star of the scenario

The hardest and most valuable move in the entire arc is the redaction-across-a-trust-boundary that produced the deliverable. The internal feasibility findings existed in two registers at once: as the seller's full working knowledge (pricing, candid risk, raw confidential source material, strategic positioning) and as the seed of a client-safe verdict. Producing the second from the first — keeping every confidential and seller-side element behind the boundary while delivering a genuinely useful, honest document across it — is skilled, deliberate work. It is also the single act most central to the FDE motion: *sell the judgment, deliver the distilled result, retain the substrate*.

Two confidentiality regimes ran simultaneously:
- **Seller-side confidential** (pricing, flags, strategy) — withheld to protect the seller's position.
- **Customer-side confidential** (the symplr/Vanderbilt Cactus package) — withheld because it was *the customer's own* confidential material, used to inform the deliverable but never reproduced in it.

A substrate that cannot represent "this shared artifact is derived from these private parents, and is safe to share while they remain private" cannot host this engagement honestly. It is the load-bearing requirement.

## 7. Document versus discussion

Progress did not flow through documents. The two most decisive state changes in the whole engagement happened in *conversation*:

- **Call 2 killed the no-integration option.** Stephanie reasoned, live, that legacy credentialing software is instance-based and a coordinator cannot ethically act as the provider — so integration is mandatory. That conclusion shelved Proposal v1's entire premise. No document produced it; a discussion did.
- **The debrief plus the redline reset the proposal.** Call 3 plus Stephanie's written redline (21) collapsed the scope from a platform-partnership into a contained Validation MVP, which became Proposal v4.

In both cases a discussion mutated a document, and the causal link survives only because an agent transcribed the call afterward and a human remembered why v4 differs from v3. There is no durable, queryable tie between "the conversation" and "the version it caused." The audit trail of *why* is reconstructed, not recorded.

---

# Part B — The Tokenrip lens

The test: take Part A and ask, primitive by primitive, whether Tokenrip **as shipped today** can host it. The honest answer separates a strong agent-to-agent layer from a weak human-across-a-trust-boundary layer.

## 8. Primitive mapping

| Scenario element | Tokenrip primitive | Status today |
|---|---|---|
| Proposal v1→v4 versioning | `artifact update` + `artifact versions` + `artifact diff` | **Ships.** Immutable version tree with word-level diffs. |
| Research lineage (derived-from) | publish `--parent` / `--context` / `--refs` | Ships, but single-lineage and no visibility semantics. |
| Customer redline → next version | `artifact comment` (thread) + intents (`reject`/`counter`/`accept`) → `artifact update` | Partial. Thread + intents + new version exist; not anchored to sections. |
| The shared space | Workspaces / teams / shareable capability-token links | Partial. Shared space exists; per-artifact visibility within it does not. |
| Agent-produced artifacts | Artifacts published by mounts; memory layers (shared/team/private) | Ships, for agents. |
| Distilling private → shared | *(none)* | **Net-new.** No derivation-with-redaction primitive. |
| Calls / async redline as objects | *(none — transcripts are manual markdown)* | **Net-new.** No discussion-as-artifact, no discussion↔document link. |

## 9. Acceptance tests

Concrete and pass/fail. Each carries a today-verdict and the specific primitive that decides it.

- **T1 — Derivation / redaction boundary.** Can the discovery deliverable (16) be represented as *derived-from* the private research set (9, 13, 14), shareable while those parents stay private? → **Today: NO.** Sharing is binary (published = world-readable); there is no "private until distilled," no derivation that carries a redaction boundary. *This is the scenario's load-bearing test.*
- **T2 — Discussion-as-artifact.** Can the three calls and the async redline be captured as first-class objects, each linked to the document version it caused? → **Today: NO** (net-new). Transcripts can be published as plain artifacts, but there is no call/transcript-capture primitive and no causal link from a discussion to the version it changed.
- **T3 — In-place redline.** Can Stephanie redline Proposal v3 *in place* — anchored to sections, with `reject`/`counter` intents — and have acceptance generate v4 with a diff and an audit trail? → **Today: PARTIAL.** Versioning, diffs, thread comments, and structured intents all ship; section-anchored inline comments do not, so the redline arrives as a separate document (exactly what happened).
- **T4 — Asymmetric-visibility shared space.** Can Simon and Stephanie share one workspace where she sees the proposals and the deliverable but never the internal findings, pricing, or flags? → **Today: PARTIAL.** Workspaces and teams exist; per-artifact, per-member visibility *within* a shared space does not. Today this is enforced by keeping two physically separate stores (a private vault, plus Upwork for the shared items).
- **T5 — Human + agent on one artifact.** Can the drafting agent, the humanizer, Simon, and Stephanie all act on the same proposal with a coherent who-did-what history? → **Today: PARTIAL.** The primitives exist (agents publish, humans comment, versions accrue), but there is no human-steering UX and no reactive signal that closes the loop (an agent is not notified that a human redlined and a re-run is wanted).
- **T6 — Cross-org extension (future).** When the hospital MSO and the provider enter, does the same model extend to three or four parties, each with a private layer and a shared seam? → **Today: NO.** This is T1 and T4 again, multiplied by parties — the same gaps, harder.

Score as shipped: **two NO, three PARTIAL, one NO (future).** Zero clean passes on the human-across-the-boundary tests. The clean pass is elsewhere — see §10.

## 10. Gap analysis — and what already works

Balanced: name the wins, not only the gaps.

| Capability | Status | Note |
|---|---|---|
| Artifact versioning + diff | **Exists** | The v1→v4 proposal loop maps cleanly to `update` + `versions` + `diff`. |
| Provenance (parent/context/refs) | **Exists (thin)** | Captures lineage; lacks per-node visibility semantics. |
| Threads + structured intents | **Exists** | `propose`/`accept`/`reject`/`counter` fit redline negotiation. |
| Shareable capability links | **Exists** | Time-limited, comment-only modes — fits sending a deliverable. |
| Agent-to-agent collaboration | **Exists** | The layer the product is strongest on. |
| Derivation with redaction boundary | **Net-new** | T1. The load-bearing gap. |
| Asymmetric per-artifact visibility | **Partial** | T4. Workspaces exist; fine-grained visibility does not. |
| Section-anchored inline review | **Partial** | T3. Thread-on-artifact exists; inline anchoring does not. |
| Discussion-as-artifact + doc link | **Net-new** | T2. No capture, no causal link. |
| Reactive human→agent signal | **Partial** | T5. Inbox exists; "a human steered, re-run" does not. |

**What clearly works today:** the proposal-iteration loop. Version v3, receive a redline as comments with intents, accept, and `artifact update` produces v4 with a diff that *is* the audit trail. That single loop is a genuine, shipped strength and it is the spine of the deal's document side.

## 11. Ranked build backlog

Ranked by leverage for the FDE motion, with the anti-over-build discipline explicit: build the differentiated gap, not the commoditized one.

1. **Derivation/redaction boundary + asymmetric-visibility shared workspace** (T1 + T4, build together). One workspace, two-plus parties, per-artifact visibility, and a first-class "derived-from (private) → shareable (public)" relationship. *Highest leverage:* every consulting and FDE engagement needs exactly this, and no competitor offers it. It is the substrate expression of "sell the judgment, retain the substrate." This is the one to build first.
2. **Reactive human→agent steering signal** (T5). A structured event — "a human commented / redlined / accepted on this artifact" — that an agent's inbox surfaces as a trigger to re-run. Cheap relative to its value; it converts the existing primitives from agent-driven to human-steered.
3. **Section-anchored inline review** (T3). Upgrade thread-on-artifact to comments anchored to a line range and version, with intents resolving into the next version. Valuable, but partly commoditized (Google Docs, GitHub review) — do it after 1 and 2.
4. **Discussion-as-artifact + document link** (T2). Capture a call/async thread as an object and link it to the version it changed. The most net-new and the most commoditized at the capture layer (Granola and others already transcribe) — Tokenrip's only differentiated piece here is the *causal link to the document*, so build that link, not another transcriber.

**The discipline:** items 3 and 4 are where it is tempting to over-build, because they are concrete and demo-friendly. Resist. The moat is item 1. Ship the boundary first; it is the thing the FDE motion cannot run without and the thing nobody else sells.

## 12. The recursion — why this case is special

AICAP's *product* and the *process that sold it* have the same shape. AICAP produces a complete application plus an audit trail across a multi-party, trust-boundaried, compliance-bound workflow, where each consumer decides what attestation it will accept and a private provider record is selectively surfaced to each hospital. The deal that sold AICAP was a multi-party, trust-boundaried, version-tracked workflow in which a private research substrate was selectively surfaced to the buyer. The substrate that would host AICAP's *deal* is the substrate AICAP's *product* needs. This is genuine resonance, not a slogan — and it is why a credentialing FDE engagement is an unusually clean mirror of the Tokenrip thesis. Stated plainly, not oversold: the same five-property pattern in §1 describes both the sale and the thing sold.

## 13. Open decisions (ranked)

1. **Build item 1 now, or wait for a second instance?** One vivid instance (this one) is enough to specify the derivation/redaction boundary, but a second engagement would de-risk the generality. Decision: specify from this instance; validate against the next live deal before hardening.
2. **Does the anonymized, shareable derivative get produced?** This doc was written internal-first precisely so a redacted thesis-asset is cheap — itself a manual instance of item 1. Worth producing for investor/partner conversations once the AICAP deal is signed (avoid sharing a live, unsigned deal).
3. **Where does this doc live permanently?** Recommended `product/tokenrip/` after review, alongside the existing canonical docs, with a pointer from the BD index since it doubles as deal evidence.
4. **Should the backlog feed the substrate roadmap now, or stay paused pending a live customer?** Per current strategy the substrate roadmap is paused until a live customer pulls on it. This doc is the argument that the AICAP deal *is* that pull for item 1 specifically.

---

*Internal-first canonical scenario. Names a live, unsigned deal; do not share externally as-is. A redacted derivative ("a regulated-healthcare FDE engagement") is a quick follow-on and is itself the private→public move this document is about.*
