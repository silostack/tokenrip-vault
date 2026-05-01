# Learnings from the TaxDome Call

> A reference doc capturing strategic, market, and tactical intelligence from the April 29, 2026 call with TaxDome leadership. Organized for re-use in future pitches and vertical outreach motion.

**Date of call:** April 29, 2026
**Call participants:** Petar (CMO), Ilya (CEO/co-founder), Boris (CTO), Simon
**Source brief:** [[taxdome-call-brief-2026-04-27]]
**Source memo (unused):** [[taxdome-design-partnership-memo-2026-04-29]]
**Status:** Active reference document

---

## Top-Line Read

The call was a generous strategic consult, not a sales conversation. TaxDome appreciated the input but did not bite on the orchestration-layer thesis. The most valuable output was not commercial — it was a sharp read on how vertical SaaS CEOs are currently thinking about AI, and what they actually want to build. Three high-value takeaways:

1. **The orchestration-layer framing is contested by the people who would license it.** Vertical SaaS CEOs see it as marketing copy wrapped around defensive walled-garden architecture, not a real strategic posture.
2. **Vertical SaaS vendors are about to build "Cloud Cowork for their vertical" themselves.** Pre-built agent libraries + internal agent builders is the dominant playbook. This is a 6–18 month build window where Tokenrip could be infrastructure underneath.
3. **There are two distinct motions hiding in the Tokenrip GTM.** Firm-direct (briefing tax, Garcia-scene pitch) and vendor-substrate (B2B2B, "infrastructure for your AI features"). They have different products, ICPs, and pitches. Conflating them costs deals.

---

## Section 1 — TaxDome-Specific Intelligence

### The actual decision-maker landscape

| Person | Role | Posture | Influence |
|--------|------|---------|-----------|
| **Ilya** | CEO / co-founder | Strategic, cynical, walled-garden by default. Just attended a Stripe vertical SaaS conference (Tidemark, Bessemer panel). Top-of-mind on partner-disintermediation risk. | Drives strategy. The veto. |
| **Boris** | CTO | Optimistic, App Store thinking, more open by instinct. Currently hiring AI-enabled engineers. Realistic about scraping/extraction risk being a cat-and-mouse game. | Drives the build. The technical buyer. |
| **Petar** | CMO / friend | Made the intro. Largely silent during the AI strategy debate. Will validate "should we charge for it" instincts. | Channel and relationship lead, not technical or strategic decision authority. |

**Use:** When pitching vertical SaaS vendors, identify the Boris-equivalent (CTO/VPE building the thing) and the Ilya-equivalent (CEO setting the boundary). They will disagree. The product needs to land for both.

### What TaxDome is actually building

Ilya's vision, in his own structure (47:00):
1. **Public API and MCP first** — narrow set of endpoints, exposed early to be perceived as "connected." Even if endpoints are limited, the *narrative* of being open is what matters.
2. **Pre-built agent library** — 20+ ready-made skills firms can press play on. Schedule, run, get notifications. Live inside TaxDome.
3. **Internal agent builder** — natural-language tool that lets non-technical firms describe a workflow and get a saved skill. New skills feed back into the marketplace.
4. **MCP for analytics-style queries** that don't expose raw data.
5. **Partner APIs (paid, gated)** for vertical AI integrations — Juno today, others later, with economics.

This is a **closed agentic platform with selective ports**, not an orchestration layer. The Salesforce analogy doesn't fit. The real analogy is Toast for accountants, plus Claude Cowork-as-a-feature.

### Their actual concern (and what it really means)

The stated worry is "API enables one-click off-boarding." Boris diagnosed this honestly during the call:

> *"They could build a Chrome extension and they could like get all the data."*

Translation: the API-protection conversation is not really about preventing data exfiltration — that's already possible via scraping. It's about **not endorsing the migration narrative**. They don't want to be the company that publishes "here's our migration API." Same outcome via Chrome extension, different story.

The deeper concern, surfaced indirectly: **if a competitor wedges in via a single integration and then gradually replicates the rest of the product, the migration is gradual and undetectable.** That's the Juno-style risk applied broadly.

**Use:** When pitching, distinguish between *protection-as-marketing* (the narrative) and *protection-as-architecture* (the substrate). The second is where Tokenrip plays.

### What "Juno" actually means in TaxDome's worldview

Juno is **partner**, **competitor**, and **acknowledged risk** simultaneously. Ilya didn't trash Juno on the call but signaled awareness:
- Future AI partner integrations will be paid/gated APIs with economics ("we want economics on it")
- The Juno integration is being treated as a pattern, not an exclusive
- He wants to be able to plug in alternatives if Juno gets too powerful

**Use:** When pitching tax-vertical AI infrastructure, "the Juno problem" is a fully-formed mental model. Don't have to explain what disintermediation looks like — they're already living the slow-motion version of it.

---

## Section 2 — Vertical SaaS Market Signals

### The Tidemark / Bessemer thesis (the meta-trend)

Ilya's verbatim summary of the vertical SaaS conference panel (29:31):

> *"You have to be really mindful of your data and that you have to be connected. But everyone is going to try and wedge in and build like a tool to get in there and then they're going to like build the rest of your product effectively after they add on the one thing that they've integrated. Because it's so much faster and easier to build the rest of it that rebuilding something new is really easy. The only hard part is going to be transitioning stuff over and like making it as seamless as possible. Everyone's going to be friendly with you and then they're going to steal your clients."*

This is the dominant strategic narrative being injected into vertical SaaS CEOs in April 2026 by tier-1 VCs. It produces:
- Defensive API design
- Reluctance to expose document/communication data
- Preference for closed agent builders over open ecosystems
- A market-wide need for "how do we add AI without losing control"

**Use:** This is *the* meta-trend Tokenrip can ride for vendor-side outreach. Every vertical SaaS CEO hearing this same thesis is a potential audience for "how to add modern agentic features without giving up the moat." Lead vendor-side pitches by acknowledging this framing — they will feel understood immediately.

### The "API king" insight

Ilya looked at a major TaxDome competitor (likely Karbon) and discovered:

> *"They simply expose a couple of things and they want to be the orchestration layer. They actually don't expose a lot of their API. They expose the analytics, they expose the stuff you can do upon it, but they don't expose any of the timeline of the client. They have a very similar [walled-garden] strategy. But they still position it, market it as like a total like, you know, you've got this access to your data."*

Translation: **the orchestration-layer framing is widely-deployed marketing copy that wraps walled-garden architecture.** Vertical SaaS CEOs see through it because they're running the same play themselves.

**Use:** The "Tokenrip is the orchestration layer" pitch is structurally weak when pitching to vertical SaaS executives. They've heard it from competitors and read it as positioning, not architecture. A different frame is needed for this audience.

### The "users don't want to live in Claude" thesis

Ilya, repeatedly: *"I want them to live in TaxDome."* And: *"I don't believe that the average firm wants to live in Claude. I think they just want it to work."*

Boris agreed: *"Right, you want them to live in TaxDome, and therefore we have to bring it all in TaxDome."*

This is the operator preference for **vertical SaaS vendors** specifically. The end-user's interface is the vendor's product. Claude/ChatGPT/etc. are *behind* the experience, not the experience itself. This drives the build-vs-buy logic for everything else.

**Use:** Tokenrip's mounted-agent model fits this preference precisely — users live in the vendor's UI, but the agent infrastructure is BYO substrate. Pitch Tokenrip as *invisible infrastructure under the vendor's branded experience*, not as a destination users visit.

### The token economics question (BYO API key)

Boris surfaced (50:00) the critical commercial dynamic vertical SaaS hasn't solved:

> *"There is a hybrid mode where you could say, you guys could actually upload, give us your Claude API key or OpenAI API key. So we will use your key to burn your tokens, but it will all run [in our system]."*

Ilya's response: *"I love that. I love that more so. Because then we can put it on our own [substrate]. But I do want to monetize it."*

Translation: vertical SaaS vendors want to host the agent experience but do NOT want to absorb inference costs at scale. BYO API key + markup is the emerging commercial pattern.

**Use:** This validates the [[mounted-agent-model]] BYO economics thesis from the vendor side, not just the operator side. When pitching vendors, lead with "Tokenrip lets you host agent experiences without absorbing token costs" — this is a pain they are *actively trying to solve*.

### The Boris/Ilya structural tension (the seam Tokenrip can dissolve)

Two opposing instincts inside every vertical SaaS company building AI features:

| Boris (build-side) | Ilya (boundary-side) |
|---|---|
| App Store mentality — let people build, they get invested | Walled garden — every integration is potential migration |
| Realistic about scraping (it'll happen anyway) | Worried about the *narrative* of supporting migration |
| Wants more developer access | Wants more selective access |
| "More they build, more they feel invested" | "Everyone's going to try and wedge in" |

This is not unique to TaxDome. It's structural across vertical SaaS vendors building AI features.

**Tokenrip's structural answer:** the substrate enforces what gets exposed at the primitive level (capability tokens, scoped permissions, audit trails). Boris gets his open building surface. Ilya gets his enforced boundaries. The conflict between them is *structurally* dissolved by the architecture.

**Use:** When pitching CTOs and CEOs together at vertical SaaS vendors, name this tension explicitly. Both will recognize it. Then position Tokenrip as the architecture that resolves it.

---

## Section 3 — Tokenrip Strategic Learnings

### The two-motions discovery

The call surfaced that Tokenrip has *two distinct GTM motions* hiding in the same product:

| | Motion A — Firms | Motion B — Vendors |
|---|---|---|
| **ICP** | Tax firm partner, real estate broker, insurance underwriter | Vertical SaaS vendors (TaxDome, Toast, Karbon, Canopy, etc.) |
| **Pain** | Briefing tax — re-explaining context to agents every turn | "Build it ourselves vs. license substrate" — 6–18 months of platform build |
| **Pitch** | "Documents that brief themselves" / Garcia scene | "Infrastructure for your AI features" / mounted-agent model |
| **Product implication** | Direct collaboration UI, end-user features | Substrate API, enterprise primitives, white-label posture |
| **Sales cycle** | Days to weeks | Months to a year |
| **Deal size** | 4–5 figures per firm | 6–7 figures per vendor |
| **Distribution leverage** | None — direct firm acquisition | Massive — vendor distributes to thousands of their customers |
| **Validation speed** | Fast — pilot in weeks | Slow — partnership negotiation, build, deploy |

**Use:** Don't run both motions simultaneously without a clear primary. Likely best path: lead with Motion A (firms) for fast learning loop and revenue; treat Motion B (vendors) as parallel pattern recognition until Motion A produces case studies that make Motion B easier.

### The pitch-mismatch lesson

Going into this call with the orchestration-layer framing locked in, with a leave-behind memo built around it, was a pitch-design failure. The call brief identified the system-of-record framing because it fits *TaxDome's strategic problem from the outside*. But the framing did not survive contact with how Ilya actually thinks about competition.

**The lesson:** The right pitch is found in the customer's mental model, not in the analyst's framing. Before going into a vendor call, ask: "What does this CEO believe about how to win? Does our pitch reinforce or contradict that belief?" If it contradicts, either the pitch is wrong for this customer or the customer is wrong for the pitch.

**Use:** For future vendor outreach, do a pre-call pass: read recent interviews, blog posts, conference talks from the CEO. If they've already telegraphed their strategic posture, build the pitch from inside it. The orchestration thesis is right for some, wrong for others — don't lead with it generically.

### Where Tokenrip actually fits TaxDome (the missed pitch)

The pitch that would have landed:

> *"You're about to spend 6–18 months building agent identity, skill packaging, asset versioning, scheduled runs, capability tokens, BYO API key plumbing, and a skills marketplace. Every primitive in that build is something we already do. Your engineers ship the tax-specific skills on top of our substrate. You get to market 6 months earlier, you keep the walled garden, you control what's exposed at the primitive level. We're under the waterline. Your customers never see us."*

This is the **substrate-for-vertical-SaaS** pitch. It uses the mounted-agent model (imprint hosting + tooling surface) but applied to a vendor that hosts the imprints for its own customers.

**Use:** This is the pitch template for Motion B (vendor-side) outreach. Adapt it for any vertical SaaS vendor building or about to build agentic features.

---

## Section 4 — Closing & Follow-Up Signal Reading

### What "warm" actually looks like

Three signals to read accurately, because all three were ambiguous-positive on this call but should be read as cool:

| Signal | What it actually means |
|--------|------------------------|
| *"Anything I can do to help, please don't hesitate."* | Friend-of-friend politeness. Not buying intent. |
| *"Really cool, good luck."* | Social grace. Conversation didn't transition to "tell me more." |
| *No next meeting scheduled.* | The most reliable signal. Real interest produces a calendar invite. |

**Use:** A real warm signal is the customer naming the next concrete step (next meeting, intro to someone else, "send me X by Friday"). Anything softer is the call being polite about not buying. Don't book follow-ups against soft signals — book them against concrete ones.

### When the leave-behind shouldn't be left behind

The design partnership memo prepared for this call was structurally tied to the orchestration thesis. Once Ilya signaled walled-garden, the memo would have done more harm than help — it would have anchored the conversation to a thesis the customer rejects.

**Use:** Always have the leave-behind ready, but pre-decide the trigger condition. "I'll hand it over only if X happens on the call." If X doesn't happen, the doc goes home with you.

---

## Section 5 — Pull Quotes Worth Saving

Verbatim signal from the call, organized by future utility:

**For establishing market context in future pitches:**
> *"Everyone's going to try and wedge in and build like a tool to get in there and then they're going to like build the rest of your product effectively. Everyone's going to be friendly with you and then they're going to steal your clients."* — Ilya, paraphrasing Tidemark/Bessemer

**For establishing the briefing-tax pain (when pitching firm-side):**
> *"They want to ask, like, hey, what's the status of my work? And I want them to ask it in Claude, but I want the actual scheduled things to happen inside of Taxdome."* — Ilya

**For surfacing the build-vs-buy seam (when pitching vendor-side):**
> *"I'm hiring AI-enabled developers right now... I'm gonna use this quote on an interview tomorrow."* — Boris (signal: vertical SaaS CTOs are actively staffing up to build agent platforms)

**For naming the structural tension:**
> *"The more they build on our platform, the more they feel invested."* — Boris (open instinct)
> *"Everyone's going to try and wedge in."* — Ilya (closed instinct)

**For the BYO API key thesis:**
> *"You could give us your Claude API key, so we will use your key to burn your tokens, but it will all run [in our system]."* — Boris
> *"I love that. I love that more so."* — Ilya

**For the "users live here" framing:**
> *"I want them to live in TaxDome. I don't believe the average firm wants to live in Claude. They just want it to work."* — Ilya

---

## Section 6 — Open Questions to Validate

Tracked here so they don't get lost. These are not blockers — they are research items for the next vertical-vendor pitch.

1. **How wide is the Tidemark/Bessemer thesis penetration?** If every vertical SaaS CEO is hearing the same panel, the addressable B2B2B market for "Tokenrip-as-substrate" could be very large, very fast. Worth validating by tracking conference content from Tidemark, Bessemer, OpenView, ICONIQ over the next 60 days.
2. **What's the actual build cost of "Cloud Cowork for our vertical"?** If a CTO can ship it in 3 months with one hire, the vendor-side pitch is weak. If it's a 12-month, three-engineer project, the pitch is strong. Probe this in the next vendor conversation.
3. **Does the BYO API key + markup pattern have legal/UX precedent?** If vendors haven't seen it work elsewhere, they may treat Tokenrip's version as exotic. If it's emerging as standard, it's de-risked. Look for examples in adjacent industries.
4. **Is there a vertical where the orchestration framing *does* fit?** Some industries (logistics, healthcare networks, supply chain) have multi-party coordination as a structural reality, not a marketing posture. The orchestration pitch may land differently in those verticals than in single-vendor-per-firm verticals like tax.
5. **What's the Cloud Cowork roadmap?** Anthropic shipping deeper Cowork features (skills marketplace, scheduled runs, vertical templates) reduces the "vendors need to build their own" pressure. Track Cowork developments quarterly — they could narrow the vendor-substrate window.

---

## Filing & Cross-References

- **Source brief:** [[taxdome-call-brief-2026-04-27]] — pre-call diagnostic. Identified the system-of-record / orchestration thesis. The brief was *correct about the strategic problem* but *wrong about how the customer would receive the framing*.
- **Unused leave-behind:** [[taxdome-design-partnership-memo-2026-04-29]] — built around the orchestration thesis. Retain as a template for cases where orchestration framing *does* fit; do not reuse generically.
- **Positioning doc to update:** [[tokenrip-positioning]] — angle #5 (Deliverable Rails) and #6 (Mounted Agent Model) need a vertical-vendor variant added. Angle #1 (Collaboration vs. Coordination) survives unchanged.
- **Adjacent strategic docs:** [[mounted-agent-model]] — the substrate-for-vertical-SaaS pitch is a direct extension of the BYO economics thesis applied to vendors hosting agent experiences for their own customers.

---

*Doc created 2026-04-29. To be revisited after the next vertical-SaaS-vendor conversation to test which learnings generalize and which were TaxDome-specific.*
