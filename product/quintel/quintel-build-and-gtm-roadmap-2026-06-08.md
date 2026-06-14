---
title: Quintel — Build & Go-to-Market Roadmap (Broker-First)
status: active
owner: Simon
type: build-and-gtm-roadmap
product: Quintel
created: 2026-06-08
supersedes: product/quintel/equipment-finance-build-architecture-2026-06-02.md
self_contained: true
---

# Quintel — Build & Go-to-Market Roadmap

> **What this is:** the canonical, self-contained reference for what Quintel is, who we sell it to, what we must be able to demo to win the sale, and the order we build it in. It combines the business motion and the build, because at this stage they are the same conversation — what we build first is dictated by what closes the first deal. It is written to stand alone.

---

## 1. What Quintel is

**Quintel is a deal-intelligence product for equipment finance.** Equipment finance is the business of paying for expensive business equipment (trucks, cranes, medical machines, servers) up front and being paid back over time with interest — a large, fragmented industry of several hundred lenders and thousands of brokers, run largely the same way for decades, with almost no modern software across it.

Quintel is the umbrella for everything we build in this space. It has **two sides of one product/engine**:

- **The broker-first side (small/mid-ticket) — our current focus.** A tool for the middlemen who place deals: it reads an incoming deal, screens it, prices it, and routes it to the right lender.
- **The upmarket "institute" side (large-ticket institutional) — later.** The same engine pointed at balance-sheet lenders doing the big, hand-crafted deals.

Both run on one engine. This doc is about the broker-first side, which is where the fastest path to revenue is.

*(Artifacts Quintel produces — screened deals, memos, dashboards — are hosted at stable, shareable URLs, powered by Tokenrip, so a recipient can open them in a browser instead of wrestling with a local file.)*

---

## 2. The market and the wedge

**Who we sell to first:** owner-operated equipment-finance **broker / placement shops, ~2–10 people.** The owner is the buyer (no procurement, closes in weeks), the pain is acute and self-evident, and there are thousands of them in enumerable industry directories. No-name solo shops are fine — we optimize for speed-to-revenue, not a marquee logo.

**Their pain:** a broker is a relationship person drowning in paperwork. The single biggest drain on their time is *screening the junk* — deals that can't be done at all (active bankruptcy, judgments, sub-floor credit) arrive several times a week and cost hours each. After that, it's structuring the real deals and figuring out which of their lenders to send each one to.

**The wedge: pre-qualification + match — not sourcing.** We deliberately do *not* lead with deal-sourcing. At the small-ticket end, sourcing is relationship-driven, not data-driven, and the public-data sourcing edge is an unproven, up-market play. The painkiller — and the thing brokers describe back to us unprompted — is: *take an incoming deal, screen the junk, score it (fund / marginal / pass) with an indicative rate-term band and the reasons, and tell me which of my lenders to send it to.* Sourcing becomes an upsell once we're inside.

This turns a broker who needs a support team into a one-person order-taker whose only remaining job is the client relationship. That is the pitch.

---

## 3. The product thesis — one engine

Quintel is **one engine** that moves a deal through a fixed sequence of stages. Each stage is a distinct job; the engine is the same across customers, and everything customer-specific (their lenders, their credit rules, their document types) is *configuration*, not a rebuild.

```
ingest → structure → decide → match → review → capture
```

- **ingest** — take the messy real-world inputs (bank statements, tax returns, deal memos — often scanned, table-heavy) and extract them into clean structured fields, each tagged with where it came from (its source document/page).
- **structure** — assemble the extracted fields into one canonical **Deal Object** (§8).
- **decide** — apply the broker's go/no-go + pricing judgment: fund / marginal / pass + an indicative rate-term band + the reasons. This encoded judgment is the defensible part.
- **match** — rank which of the broker's lenders to send the deal to, by fit and capacity. *(Equipment-finance-specific.)*
- **review** — present the screened, pre-priced, pre-routed deal to the operator, who approves / overrides / routes, with every action on an audit trail. *The human decides; the engine prepares.*
- **capture** — record what actually happened (which lender, what terms, approved/declined, funded) so the system learns over time.

**Sell the judgment and the hands, not the mock.** Anyone can show a pretty dashboard; the value — and the only thing worth paying for — is the engine actually doing the screening, pricing, matching, and routing on the customer's real deals. A read-only dashboard never captures an outcome, so it never compounds; the working engine, inside the deal flow, does.

**The moat compounds on the placement side first.** Every deal that flows through `capture` records which lender approved what, at what terms — a record no contact database has, because it requires *outcomes*. Brokers seed this *placement* data richly (even though they hold thin long-term credit-performance data). Over time, this turns a static lender list into a *ranking* — the matching engine gets measurably better and is increasingly hard to rip out.

---

## 4. Go-to-market: the demo and the sale

This is the part that gates everything. **The build order is dictated by what closes the first deal.**

### What we must be able to demo

A fully-mocked demo proves nothing about delivery — anyone fakes one in an afternoon, and every prospect knows it. But asking a cold broker for their book (before a call or even on it) won't fly either — it's confidential, SSN-laden, and front-loads work onto them. The resolution is a **two-layer demo** (full shape in [[quintel-demo-shape-2026-06-08]]):

- **The scripted tour, on our own demo deals — anonymized from real ones, with the messy texture preserved.** The hero is the **Deal Detail screen** on a texture-rich deal: the verdict + why, **every extracted number traced to its source document** (provenance is the visual signature), the ranked lender match, and a generated submission package — the full flow end-to-end, even where parts are still faked. The texture is what makes a broker think "this person knows my world."
- **The live-drop, as the closer** (after an initial call, once they're leaning in): "drop in a fresh deal doc — redact the name." Unseen input, extracted live. This preserves the unfakeable property without requiring them to pre-share anything.

Throughout, **leave the judgment layer ~70% and moldable** — a perfect score triggers "that's not how I'd price it" (rejection); a 70% one triggers "I'd tweak this, add that lender" (co-creation), which is the *"I can see this on my workflow, with a few tweaks"* reaction we want. Polish goes into extraction (the unfakeable part); roughness in `decide`/`match` is a feature in the sale.

### What gets the sale

Forward-deployed: lead with a *working* demo on our own anonymized deals (not slideware), then sell a **paid design-partner pilot** whose deliverable is the same engine wired to *their* book and lenders. The book/lender-list ask belongs at the pilot, **never as the cold opener** — a broker won't hand confidential deals to strangers up front. The first money in is a **setup / data-unification fee** (cleaning and unifying their messy data into one usable system is concrete, obviously-valuable work) plus a **monthly subscription**; success fees are upside only, not the base.

**One commercial prerequisite, not a build task:** the first contract must grant rights to use *anonymized, aggregated, derived* data (patterns, not raw records) across customers. Cheap now, impossible to retrofit, and the entire cross-firm matching upside depends on it.

### Compliance is the price of entry — and a selling point

Broker files are full of sensitive personal data (SSNs, tax returns, financials). The first question a serious broker asks is how we handle it. The answer is built into `ingest`: a **per-customer sandbox**, a **no-train** arrangement so nothing we process is ever reused, self-hosted parsing for the most sensitive documents, and an audit trail on every read/write. Handled well, "we give you a secure sandbox for your sensitive files *and* it does the work" is part of the pitch, not just a box to clear.

---

## 5. The bones (what we build, stage by stage)

The engine stages, in priority order, with what each needs:

1. **`ingest` (extraction) — build first, build deepest.** This is the unfakeable core of the demo, the secure handling of sensitive documents, and the foundation every other stage sits on. The hard part is the **"hard tail"** — scanned images and table-heavy financials where naive text extraction fails. Spend the effort here. Output: structured fields, each with a confidence score and provenance (source document/page/span). It is *zero-regret* — useful no matter how the rest sequences.
2. **`structure` — the Deal Object (§8).** Define this canonical object once; the rest of the system renders it, acts on it, and stores it. Get it right and everything downstream is composition.
3. **`decide` — the credit rubric (the imprint).** The broker's gating criteria, red flags, and pricing/structure heuristics, encoded as **configuration, not code**, so each customer's judgment plugs in without a rebuild. Needs a real broker's rubric in hand — until then, a thin stub.
4. **`match` — lender ranking (equipment-finance-specific).** Rank the broker's lender panel by fit (deal size, equipment type, credit box, capacity). Needs the broker's actual lender list. Kept equipment-finance-specific; not over-abstracted.
5. **`review` — the operator surface.** Hosted at a stable, shareable URL: the screened/priced/routed deal, what needs attention at the top, the source behind every value, approve/override/route, and an append-only audit trail.
6. **`capture` — the outcome record.** Write each deal's outcome (lender, terms, approved/declined, funded) back to a store that feeds future `match`/`decide`. Light early; the compounding layer over time.

**Rubric and lender panel are configuration.** The engine is the stable, shared core; a new customer = new config (their documents, their credit rules, their lenders), not a fork. That reuse is the whole reason this becomes a product rather than a series of one-off builds — protect it.

---

## 6. The build roadmap

Marked by what's needed **for the demo (now)** versus **after the first paying customer** pulls on specific features.

- **Phase A — `ingest` deep + a thin end-to-end spine.** *(Now — demo bones.)*
  Build the extraction engine against real, messy documents (including the hard tail), with provenance and the secure-handling story. Define the Deal Object. Stand up a *rough* `decide` + `match` + a basic `review` surface — enough to run the live demo end-to-end on a prospect's own file. The goal of Phase A is a demo that survives input the prospect chose. Build `ingest` as a **reusable pipeline that maps any firm's weird data into one standard format**, not a per-customer hand-cleaning — or it never scales.
- **Phase B — real `decide` + `match`.** *(After the first design partner — flesh out.)*
  Plug the design partner's actual credit rubric into `decide` and their actual lender panel into `match`. This is where the 70%-moldable demo becomes their real, tuned workflow. Don't over-design the rubric shape ahead of seeing a real one.
- **Phase C — full `review` surface.** *(With the first customer.)*
  Production operator surface: provenance on every field, what-needs-attention triage, approve/override/route, full audit trail, stable shareable URLs for handoff.
- **Phase D — `capture` + the loop.** *(As volume builds.)*
  Record outcomes; feed them back into `match` (lender ranking on realized performance) and `decide` (calibration). The moat begins here — and it can be *pre-loaded* from the customer's own back-catalog on day one rather than starting empty.

**Discipline:** build past `ingest` is gated on a real customer pull (a signed pilot / a delivered rubric). Extraction is the only safe pre-signature work. Don't let "I built the extraction engine" expand into speculatively building the whole thing before a customer is pulling on it.

---

## 7. What carries over (and how it's reframed)

Three assets from earlier work survive, with their emphasis shifted for the broker-first motion:

- **The Deal Object schema (§8)** — unchanged in spirit; it's the keystone. For brokers, the **`match`** and **`outcome`** sections carry the weight (placement-side moat); the `demand`/sourcing section is dormant until the up-market upsell.
- **Provenance + source-tier grading** — every datum carries its source and freshness. This drives both trust ("survive a skeptic's poke") and the audit trail. Retained as a first-class part of `ingest`/`review`.
- **The free-public-source data edge (public filings, federal awards, lien records)** — retained but **repositioned**: this is the *sourcing* layer, and sourcing is a **later, mid/up-market upsell**, not the broker wedge. At the small-ticket broker end, sourcing is relationship-driven; do not build the public-source engine into the broker MVP.

---

## 8. The Deal Object (design once)

The single object the engine produces; `review` renders it, the hands act on it, `capture` stores it with its outcome.

```
DealObject {
  id
  borrower   { name, naics, revenue_band, geo }
  asset      { class, specifics, new_used, vintage }      // "2021 Cat 336, lien matures 2029"
  ask        { amount, purpose, structure_hint }
  source     { per-field: { value, confidence, origin_doc, page, span } }   // provenance — required
  decision   { verdict: fund | marginal | pass,
               rate_band, term_band, structure_hint,
               reasons[], flags[], confidence }            // the encoded credit judgment (imprint)
  match      { candidates: [{ lender_id, fit_reason, capacity }], recommended }  // EF-specific
  outcome    { stage: intake | screened | priced | submitted | approved | funded | declined,
               lender, priced_rate, approved_rate, funded_amount, schedule,
               decline_reason, performance }               // empty until in the loop = the moat
}
```

Every field of `outcome` is something a contact database structurally cannot produce — it requires outcomes, which only exist because the engine stays in the deal. And it can be **pre-filled from the customer's own historical book** rather than starting empty.

---

## 9. Watch-outs

1. **Don't drift back to sourcing.** It's the seductive dream and the weakest part of the hand at the broker tier. The wedge is pre-qual + match.
2. **Don't let `ingest` become a consultancy.** Build the reusable schema-mapping pipeline, or every deployment is a six-week hand-clean and it never scales.
3. **Don't over-build before a customer pulls.** Extraction is the only safe pre-signature work; the rest is gated on a real rubric / signed pilot.
4. **Don't ship a read-only dashboard as the product.** It never captures an outcome, so it never compounds. The working engine inside the deal flow is the product; a dashboard is collateral.
5. **Get the derived-data rights in the first contract.** A lawyer line, not a build — and the cross-firm upside dies without it.

---

*Living build + GTM doc. Successor to the 2026-06-02 build-architecture doc. Update §6 (roadmap) and §2 (market/wedge) as the motion moves.*
