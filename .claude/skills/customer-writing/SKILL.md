---
name: customer-writing
description: Governs voice, tone, structure, and honesty for ANY customer-facing or deliverable document — apply it whenever writing or editing something a prospect, client, customer, or partner will read. ALWAYS invoke before drafting or revising a proposal (composes with the /proposal command), a feasibility study, a discovery-findings report, a deliverable/summary report, a statement of work, a pilot recap, or any artifact that may be sent to or forwarded outside the company. Trigger phrases include "proposal", "deliverable", "findings report", "feasibility study", "client doc", "customer doc", "write this up for [prospect/client]", "send to the client", "discovery findings", "deliverable draft". Do NOT invoke for purely internal docs (research notes, strategy memos, vault notes, BD playbooks) UNLESS they are going to be shared externally — in which case apply the shareability rules below.
---

# Customer Writing

Principles for everything a customer reads. A customer-facing document is one a prospect, client, or partner will open — proposals, feasibility studies, discovery findings, deliverable reports, SOWs, pilot summaries, client decks. The reader is usually a smart domain expert and often a founder. Write accordingly.

The governing instinct: **assert what you genuinely found; defer what they know better than you.** Most failure modes below are a violation of one half of that.

## 1. Never explain the buyer's own business back to them

This is the cardinal rule and the easiest to break. The reader is the expert on their market, their value proposition, their customers, and their go-to-market. Telling them how their business works reads as pedantic and faintly condescending — even when it's correct.

- **Cut value-prop lectures.** Don't tell a founder what their differentiation is, why their wedge matters, or that "competing on X is a commodity game." They know.
- **Cut go-to-market coaching.** Don't explain how sales cycles, pilots, or demos work to someone who runs them. State the parts that are genuinely *yours* (a technical criterion, a build sequence) and hand the rest back: "Where and how to find that partner is [their] call."
- **Cut folksy analogies that re-explain their domain.** ("It's like the postal system…") Analogies are for things the reader *doesn't* know, not for their own business.
- **Assert your findings confidently; credit their domain explicitly.** "Each hospital sets its own requirements — your experience will speak to how widely these vary" both makes the point and signals you know where their expertise begins.

Diagnostic before any sentence in a "what this means for you" or "recommendations" section: *Is this my finding, or am I narrating their business back to them?* If the latter, cut it or hand it back.

## 2. Answer the question they actually asked, in their framing

- Use the client's own questions and wording as the spine. Don't substitute your reframed "crux" for what they literally asked.
- **Answer directly, including when the answer is messy.** "Yes," "no," "it depends," and "some of it, but the whole package is unconfirmed" are all fine — vagueness dressed as confidence is not.
- Mark **confidence** (high/medium/low) and separate **established** from **unknown**. Frame unknowns as bounded and inherent ("only a live instance reveals this"), not as gaps in your effort.
- **Never overclaim, and self-correct when you do.** "Dissolves the risk" → "downgrades it from existential to an optimization." "Impossible" → "not currently demonstrable," followed by the honest constraint.

## 3. Use their language; get the terms right

- Build a terminology index from their notes/transcripts first: pain language, domain terms, quantified pain, outcome language. Use their words verbatim — industry term, not your synonym ("application," not "case," if that's what the field says).
- **A wrong domain term in front of an expert destroys credibility.** If unsure a term means what you think (e.g., PHI vs. PII), verify before using it.
- **Gloss to their expertise, not below it.** Explain terms outside their field (FHIR, REST, webhook to a non-engineer); never explain terms inside it (PSV, MSO, attestation to a credentialing pro).
- **Scrub internal/insider jargon entirely.** No team shorthand ("forward-deployed," "design partner," "substrate," "wedge," "channel-not-a-route") and no software-internals ("RPA," "DOM," "CORS") in a customer doc. Replace with plain language.

## 4. Right altitude — don't smuggle in the sell or over-prescribe

- A findings/feasibility document recommends the **shape** of the path forward. Commercial terms (price, phases, dollar figures) live in the **proposal**, not the deliverable — don't let a findings doc quietly become a re-proposal.
- Frame next steps as **the motion**, not over-specified instructions. Name no specific vendor/partner as "the" target when the choice is genuinely theirs.
- **Tone down options you include but don't endorse.** If something was raised on the call but you wouldn't recommend it, include it for completeness and say plainly it's a stopgap — don't sell what you don't believe.

## 5. Be honest, and don't volunteer fragility

- Report outcomes faithfully: what's solid, what's untested, what only a live build confirms.
- **Don't volunteer your own weakness.** No stage, fundraising state, team size, or "we haven't done this before" unless the client already knows. (Confidence ≠ dishonesty — you state what you found, you just don't editorialize against yourself.)

## 6. Structure: McKinsey memo, stands on its own

- **Orient before asserting.** Open by restating the goal and scope even if the reader knows them — alignment first. Then the bottom line up front, then the evidence.
- **Assertion-led headers.** Each header states a conclusion; the body proves it. Lead every section with the so-what.
- **Scannable.** Use a matrix/table when comparing items across questions. Keep paragraphs tight.
- **Paint concrete pictures for mechanisms the reader doesn't know** (a step-by-step of how the approach runs), not for things they do.
- **Third-person, authoritative, shareable by default.** No "as we discussed," no conversational framing. *Exception:* a direct message (email, Slack, Telegram) matches that medium's tone — but the no-condescension and honesty rules still hold.
- **Cut the obvious.** If a sentence states what any reader already knows, or restates the client's own thesis, delete it.

## 7. Shareability & confidentiality (assume it gets forwarded)

- Write every customer doc as if it will be forwarded to a stranger (their boss, a hospital, an investor).
- **Reproduce no third party's confidential material** — never paste another vendor's proprietary spec/schema; describe mechanisms generically and attribute ("documentation reviewed for a representative deployment").
- **Keep seller-side content out:** internal pricing rationale, competitive/strategy analysis, "flags for [founder]," anything that questions the client's own thesis, and internal codenames.
- If the client wants "the research," build a **purpose-built client-safe artifact** (e.g., a curated list of public sources), not the raw internal docs.

## Pre-send checklist

- [ ] Does any sentence explain the client's own business/market/GTM back to them? (Cut or hand back.)
- [ ] Is every claim answering *their* question in *their* words?
- [ ] Confidence levels present; unknowns framed as bounded, not as gaps?
- [ ] Any overclaims to dial back? Any "impossible" that should be "not yet demonstrable"?
- [ ] Domain terms correct and verified; glosses pitched to their expertise; zero internal jargon?
- [ ] Right altitude — no commercial terms in a findings doc; next steps are the motion, not over-prescribed?
- [ ] Nothing volunteers your stage/fragility?
- [ ] Would this read cleanly to someone who wasn't in the room, with no confidential or seller-side material exposed?
- [ ] Orients first, leads with the so-what, assertion-led headers, scannable?
- [ ] Final pass through `/humanizer` before sending.
