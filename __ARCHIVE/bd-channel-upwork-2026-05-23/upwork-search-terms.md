# Upwork Search Terms — Token-Control / Data-Sovereignty Wedge

**Date**: 2026-05-19
**Owner**: Simon (Upwork bidding)
**Status**: Active testing
**Related**: `active/linkedin-outreach-token-control-wedge-2026-05-19.md` (companion LinkedIn doc), `pitch/a16z-pitch-deck.md` (Enterprise tier FAQ), `bd/calls/transcripts/vijay-laknidhi-2026-05-19.md`

## Summary

Upwork serves two functions for Tokenrip: revenue and discovery. This document captures the keyword playbook for surfacing the specific subset of Upwork postings where Tokenrip's architecture is uniquely qualified — buyers asking for local-model deployment, on-premise inference, vendor-neutral agent infrastructure, or compliance-grade audit trails. These are the postings where the standard "AI agent on OpenAI" submission can't win, and where Tokenrip's architecture is genuinely load-bearing.

The objective is twofold: win bids that produce reusable architectural patterns (per the Upwork Rule in the a16z angles doc — gigs only count if they produce a reusable mounted agent on Tokenrip), and validate that demand for the data-sovereignty wedge exists at the bid-level, not just at the LinkedIn-outreach level.

## Hypothesis

The same pain shape driving the LinkedIn outreach test surfaces in Upwork postings, in a different vocabulary. Where a Chief AI Officer at a mid-tier consulting firm articulates the pain as "token control," an Upwork buyer articulates it as "must run on our own infrastructure" or "HIPAA compliant" or "cannot use OpenAI." The keyword vocabulary is mechanical — once you know it, the right postings find themselves.

The signal to validate: how many of the right-shape postings appear per week, and what fraction can be won when responded to within the first-bidder window.

## Tiered Search Strings

Saved as Upwork search alerts with instant email/notification. Each tier targets a distinct slice of the buyer pool.

### Tier 1 — Direct hits (set as instant-alert saved searches)

Buyers who explicitly state the architectural requirement. These are the rarest and highest-fit postings.

```
"local model" AI agent
"self-hosted" LLM agent
"on-premise" AI agent
"on-prem" AI workflow
"private LLM"
"local LLM" agent
"Ollama" agent
"open source LLM" agent
"open-weights" model
"runs locally" AI agent
"air-gapped" AI
"no OpenAI" agent
"without OpenAI"
"cannot use ChatGPT"
"data cannot leave"
"HIPAA compliant" AI agent
"HIPAA" chatbot local
```

### Tier 2 — Compliance and regulated language

Buyers who don't say "local model" outright but signal the pain through compliance vocabulary. Often higher-budget than Tier 1 because compliance work funds the buying.

```
HIPAA AI agent
FINRA AI
ITAR AI
CMMC AI
FedRAMP AI agent
SOC 2 AI
"audit trail" AI agent
"PHI" chatbot
"PII" AI workflow
"regulated industry" AI
"GDPR compliant" agent
```

### Tier 3 — Vendor neutrality and portability

Buyers signaling Chamath-pain. They may not know they want local; they know they don't want lock-in.

```
"model agnostic" agent
"multi-model" AI
"switch between" Claude OpenAI
"vendor lock-in" AI
"fallback model"
"bring your own" LLM
"BYO model"
"portable agent"
"migrate from" Claude
"migrate from" OpenAI
```

### Tier 4 — Architecture signals (MCP-native, agent infrastructure)

Buyers using the same architectural vocabulary the product was built around. Strong product fit; smaller volume.

```
"MCP server" agent
"Model Context Protocol"
"agent framework" local
"private RAG"
"enterprise RAG" local
"LangGraph" local
"CrewAI" private
```

### Tier 5 — Vertical + AI combinations

Industry-specific framings of the same pain. Useful for casting wider when the direct tiers are quiet.

```
"law firm" AI automation
"legal" AI agent confidential
"financial advisor" AI agent
"wealth management" AI
"medical billing" AI agent
"healthcare" AI HIPAA
"insurance" AI agent compliance
"consulting" AI proprietary
"accounting" AI confidential
"due diligence" AI agent
```

## Saved-Search Setup (the operational workflow)

1. Create 5–8 saved searches, one per Tier 1 string and one combining Tier 2 compliance terms. Do not pile all keywords into one search — Upwork's relevance ranking gets noisy with too many terms.
2. Set email/notification frequency to **instant** on Tier 1 saves. That is where the first-bidder edge lives.
3. Filter to: posted in last 24h · budget $1K+ fixed or $30+/hr · experience level Intermediate or Expert. Skip Entry-level — those are the bid-fest noise jobs.
4. Category checkboxes: AI Apps & Integration · AI Agents Development · AI/Machine Learning Engineer · Chatbot Development.
5. Country filter (optional): US / Canada / UK / Germany / Australia for higher-paying buyers; leave open for volume.
6. Set phone notifications on the two highest-fit Tier 1 saves ("local model" + "self-hosted"). The 3–5 minute response advantage on a new post is worth more than the $5 minimum-bid connects cost.

## Qualification Checklist — Read the Post in 30 Seconds

Before spending connects, scan for these signals.

**Positive signals**:
- Data-sensitivity language anywhere ("confidential," "proprietary," "cannot share," "internal only," "sensitive")
- A specific model named (Llama / Mistral / DeepSeek / Qwen / Ollama / vLLM) — they have already chosen self-hosted
- Compliance acronyms (HIPAA / FINRA / GDPR / SOC 2 / ITAR) — they have already hit the wall with public LLMs
- "Long-term" or "ongoing" in description — these are the relationship buyers, not one-shots
- Budget specified above $30/hr or $1K fixed

**Negative signals — skip**:
- "Quick task" / "small budget" / "$50 max"
- "Build a clone of ChatGPT" — confused buyer, will waste time
- Heavy frontend / UI focus — they want a webapp, not infrastructure
- No company name, no profile context, vague description

## Anti-Filter (noise reduction)

Append the following to all searches to strip out the generic AI-wrapper noise that dominates Upwork's AI category:

```
-WordPress -Wix -Shopify -plugin -clone -wrapper -prompt
```

## Bidding Strategy

The first-bidder advantage is the highest-leverage move available.

- If posted within the last 30 minutes and matches Tier 1: bid minimum connects, get in the top 5. The bidder ordering matters more than the cover letter quality at this stage.
- If the post is hours-to-days old and has 50+ bids: only bid if the fit is exceptional, and bid into the top tier of connects (typically 100+ connects). Otherwise skip — the math does not work.
- For posts that match too well to pass up even outside the first-bidder window, lead the cover letter with: "I noticed you specified [local model / HIPAA / on-prem]. We've built infrastructure specifically for this — agents that run on your inference, with full audit trails." This differentiator beats the boilerplate "5 years of AI experience" the buyer is drowning in.

## The Upwork Rule (consulting-drift mitigation)

Per `pitch/a16z-angles-and-explorations.md`: a gig only counts if it produces a reusable mounted agent on Tokenrip. Tripwire review at 10 gigs:

- 3–5 reusable patterns → discovery is working, build templates from the reusable patterns
- 10 unique bespoke projects → consulting business, not product. Cut the cord.

Track per gig: which pattern category, which architectural primitives used, whether the artifact lives on Tokenrip.

## Success Criteria

- **Volume signal**: 3+ Tier 1 or Tier 2 postings appear per week. Below that, the data-sovereignty wedge is not a meaningful slice of the Upwork AI market and the channel reverts to general-purpose AI agent discovery.
- **Win signal**: 1 in 10 bids on right-shape postings produces a response within 7 days. Below that, the cover letter and bidding strategy need iteration.
- **Pattern signal**: by gig #10, at least 3 reusable architectural patterns have been extracted (and live as Tokenrip artifacts or templates).

## Source Anchors

- `active/linkedin-outreach-token-control-wedge-2026-05-19.md` — companion LinkedIn outreach playbook
- `pitch/a16z-pitch-deck.md` — Slide 4 Enterprise tier and FAQ
- `pitch/a16z-angles-and-explorations.md` — Upwork Rule and the consulting-drift tripwire
- `bd/calls/transcripts/vijay-laknidhi-2026-05-19.md` — original discovery call that produced the wedge hypothesis
