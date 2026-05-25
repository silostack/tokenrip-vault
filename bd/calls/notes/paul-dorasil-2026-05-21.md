# Paul Dorasil Call — 2026-05-21 (firm-direct)

## Follow-Up Actions

### What WE Need to Do
| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | Send Paul a brief thank-you note. Don't ask for anything — preserve the open-door dynamic. | Simon | 2026-05-22 |
| 2 | Apply architectural filter to PMS-migration-agent opportunity before May 22 comparison. If pursuing, decide whether it's a Tokenrip product or a consulting/RAG offering done separately. | Simon | 2026-05-22 |
| 3 | Investigate which AI call center vendor DECA is adopting in next 1-2 months. Suspected: Planet DDS DentalOS or comparable. Confirming would tell us who the actual operational-agent competitor is in DSO. | Alek or Simon | 2026-05-26 |
| 4 | Surface this call's evidence into the May 22 hard comparison: DSO firm-direct discovery is reproducing the same pattern — painkiller pain but architecture-grade workflows are scarce. | Simon | 2026-05-22 |

### What THEY Need to Do
| # | Action | Who | Due |
|---|--------|-----|-----|
| 1 | Paul said "maybe I'll have to think about that" re: whether the migration agent would sit on top of the data work. Soft commitment — no real expectation he follows up. | Paul | Open |

### What They're Expecting From Us
Nothing specific. Paul did not ask for materials, a follow-up call, or a proposal. The call ended with mutual thanks and an implicit open door. **He's not waiting on us.** That's a status note, not a problem.

### Open Questions Before Next Contact
- Which AI call center vendor is DECA adopting? (Planet DDS DentalOS? Provet? Mango Voice? An RCM/scheduling-focused player?)
- What's DECA's timeline for the Eaglesoft → Denticon migration? How many offices migrate per quarter?
- Who is the CIO at DECA, and what's his relationship to Paul's roadmap?
- Has Paul evaluated Planet DDS DentalOS Agents specifically? He didn't mention them by name despite running on Denticon for 2/3 of locations.
- Is the AP-automation vendor failure he described (built-in-house default) reproducible across other DSOs? Could be a market signal.

---

## Call Summary

~30-minute firm-direct discovery call within the vertical-discovery sprint (May 8-22). Paul is 3 months into the Head of Data & AI role at DECA Dental, with deep technical detail to share. He confirmed DECA's PMS heterogeneity (1/3 Eaglesoft on 153 servers, 2/3 Denticon, plus legacy data from Dentrix Ascend and Open Dental). Confirmed mature data infrastructure (Snowflake + Fivetran + Kala API). Articulated three corporate AI priorities (AP, RCM, FP&A) plus a longer-term BI platform for offices. **Unprompted, he handed over one specific product idea** — a PMS migration training agent that would help staff during the Eaglesoft → Denticon transition (CIO + CEO are anxious, 50 office holdouts). Paul himself diagnosed that the migration agent wouldn't need PMS access — just knowledge of both systems. The opportunity is painkiller-grade but fails the architectural-requirement test. Call ended cleanly but with no concrete next step. **Strong intel, weak commercial trajectory.**

## Momentum

→ **Flat** — Excellent intelligence on the DSO data + AI landscape, but no commitments either direction, no follow-up scheduled, and the one concrete product idea Paul surfaced doesn't pass Tokenrip's architectural filter.

## Key Intelligence / What Changed

1. **DECA's PMS stack confirmed in detail.** ~1/3 Eaglesoft (~50 offices, 153 on-prem servers with installed Fivetran SDK connectors), ~2/3 Denticon (~115 offices). Historical data still active from Dentrix Ascend (2 offices) and Open Dental (7 offices). Active migration off Eaglesoft is in progress, with significant office resistance. **The "DSOs are heterogeneous on PMS" hypothesis from prep is now confirmed at DECA specifically.**

2. **DECA is procuring an AI call center "in the next month or two."** Paul described it as "DSO-specific" and "connected directly to the practice management system itself." He did not name the vendor. Timing (post-Feb 2026) and architecture (PMS-embedded) suggest Planet DDS DentalOS Confirmation/Scheduling Agent or a comparable PMS-native player. **This is the most actionable competitive intel from the call** — and Simon let it pass without probing.

3. **The cross-vertical vendor pattern validates the mounted-agent thesis at the supply side.** Paul, unprompted: "A lot of the solutions you build for DSOs are going to translate into other industries too — DSOs are really similar to optometry and veterinarian offices." He cited Kala API serving both vet and dental; AI call centers retool across vets/optometry/dental. **Vendors are already doing vertical-skin reuse — they just don't call it "mounted agents."** This is direct evidence that the structural pattern Tokenrip names exists in the market.

4. **Build-vs-buy posture clearly articulated.** Paul: "We haven't found good vendors in [AP] space. A lot of that work we're going to end up building in house." Builder by default when vendor pool is weak. This is the founder-type profile — solving with code, not procurement.

5. **Paul handed Simon a product idea unprompted.** PMS migration training agent for CIO + CEO. He sketched the use case in detail and the buyer (his own leadership). **This is the closest thing to a concrete BD opportunity in the call** — but it fails the architectural-requirement test by Paul's own description ("the agent doesn't need access to the PMS").

## Firm-Direct Lens

### Pain Evidence

**Real pain (painkiller-grade):**
- PMS migration anxiety at the CIO + CEO level. 50 office holdouts. Revenue dip risk. Training-team capacity constrained.
- AP automation gap — vendor search failed, building in-house is the fallback (signals real desire, real ROI).
- Data quality at the Eaglesoft layer — Paul writing pattern-match patch logic for ADA codes, dedup logic for patients, ID consolidation for providers. Real engineering hours.

**Vitamin-grade or already solved:**
- BI for offices — long-term, no urgent driver.
- FP&A — in progress, not stuck.
- Imaging AI — Pearl + Overjet deployed, working, not in scope.

### Architectural-Requirement Test (per `bd/CLAUDE.md`)

This is the call's most important read for the May 22 hard comparison.

The opportunity Paul surfaced most clearly (PMS migration training agent) does **NOT** require the mounted-agent architecture. Paul himself said the agent wouldn't need PMS access — it would just need knowledge of both PMS systems. This is RAG over PMS documentation. No persistent memory, no portability, no cross-session state. Any AI shop could ship it.

This pattern matches the firm-direct verdict from the May 1 strategic decision (Motion A fails architectural test). The vertical-discovery sprint was supposed to test whether firm-level pain that ALSO requires the architecture exists. **Paul's call produces evidence against:** the pain is real, but the architecture-fit is absent.

| Opportunity | Architecture-req | Pain-proximity | Verdict |
|---|---|---|---|
| PMS migration agent | **FAILS** | PASSES | Consulting-grade |
| AP automation | PARTIAL | PASSES | Crowded, probably not Tokenrip |
| RCM automation | PARTIAL | PASSES | Zentist/Overjet competitive |
| Cross-PMS agent layer (our framing) | PASSES | UNCLEAR (Paul didn't bite) | Architecture-fit but no demonstrated pain |

The framing Tokenrip went in with — cross-PMS agent portability as a wedge against vendor-locked DSO operational agents — did not produce a recognition reaction in Paul. He didn't lean forward. He didn't ask follow-up questions. **Negative signal on the framing's resonance**, though one call ≠ verdict.

### Objections

No explicit objections raised. Paul didn't push back because Tokenrip didn't pitch hard enough to draw pushback. **The absence of objections is itself a signal** — the conversation never reached a moment where Paul had to defend the status quo or evaluate a specific Tokenrip claim. This is consistent with intel-mode but inconsistent with firm-direct discovery, which should produce pain confirmation or rejection signals.

### Stakeholders / Authority / Budget / Timeline

- **Paul:** owns data + AI strategy. Buying authority at his layer (data tooling, AI vendors for data-team use).
- **CIO:** above Paul. Owns IT-wide decisions, including PMS migration. Anxious about it.
- **CEO:** above Paul. Same migration anxiety. Would be the executive sponsor for a PMS-migration-related buy.
- **Budget:** unknown. They paid for Pearl, Overjet, Snowflake, Fivetran — they spend on AI/data when ROI is clear.
- **Timeline:** AI call center in 1-2 months (already in procurement). Migration is ongoing, no defined end-date. AP / RCM / FP&A on the corporate roadmap, no dates shared.

### Stage Signal

**Not in pipeline.** No mutual next step. Paul is not waiting on materials. Tokenrip would need to manufacture a reason to re-engage (e.g., a one-pager on the migration-agent concept, scoped to his stack) and that reason is *not* aligned with the architectural filter.

## Simon's Performance

### Coaching Priorities

1. **Failed to follow up on the AI call center vendor mention — and it was the call's biggest intel opportunity.**
   Paul said, casually: *"We're also going to be adopting an AI call center, which is DSO-specific, probably in the next month or two."* Simon moved on without probing.
   → **Better language:** *"Oh interesting — which one? What made them stand out?"* Two sentences. Would have yielded: vendor name, evaluation criteria, why-this-over-others, procurement timeline. All of that is gold for understanding the DSO operational-agent competitive landscape.
   → Why it matters: the prep doc identified Planet DDS DentalOS Agents as the most important competitive development in DSO AI in 2026 and explicitly recommended asking *"What's your read on DentalOS Agents?"* Simon had the prep, the question, and the opening — and didn't take it. This is the kind of intel that doesn't come back; once Paul signs the contract, the conversation about why this vendor goes cold.

2. **Did not claim the PMS-migration-agent idea on the way out.**
   Paul *handed* Simon a concrete product idea, sketched the buyer (CIO + CEO), and described why it would land. Simon's response: *"That's a useful suggestion, appreciate it."* Then: hard stop, exit, no next step.
   → **Better language:** *"That's actually a really specific use case. Would it be useful if I came back to you in a week with a one-pager scoped to your stack — not a proposal, a design doc you can react to? If it doesn't land, no harm."* Converts intel into a follow-up commitment with low obligation.
   → Why it matters: Paul gave Simon the next conversation's opening line for free. Simon didn't grab it. Even if the architecture filter ultimately kills the migration-agent as a Tokenrip product, the *follow-up motion* keeps Paul warm and produces another data point. **Walking out without a follow-up trajectory is the failure mode — not the architectural fit question.**

3. **The infrastructure-language trap activated at the opener — seventh documented instance (now Alek's as well).**
   Alek's opener: *"We build the layer that gives AI agents persistent memory, a compliant way to use AI agents, making them portable across sessions and that sort of thing."* Paul's response: *"Okay."* Then moved on. **No question, no engagement, no follow-up.** Classic "the listener needs to see the application, not the infrastructure" response (per `agents/yoda/memory/insights.md` Apr 30, May 19).
   → **Better language:** *"Quickest way to describe it — we built Chief of Staff, an AI agent that has its own memory, identity, and tools. Think of it like having a digital expert that can actually do work for you. We make it easy for anyone to build agents like that."* Lead with the demo's *application*, not its substrate.
   → Why it matters: this trap was specifically diagnosed and the fix (Chief of Staff demo) was identified May 1. The fix wasn't applied. Pattern is fractal — Simon avoids it sometimes, Alek triggers it instead. **Both founders need a rehearsed 15-second answer to "what is it?" that contains zero architecture words.**

4. **No architectural filter applied in real-time.**
   When Paul described the migration agent and the AP-automation opportunity, neither Simon nor Alek probed whether those workflows would need persistence, memory, or cross-system state. Per Yoda insights #57: *"What's the smallest commercial unit we can sell today that requires the full mounted-agent architecture to deliver?"* That diagnostic was not applied.
   → **Better language:** When Paul described the migration agent: *"That's interesting — would it need to remember things across sessions, like a particular staff member's progress through the migration, or is it more of a one-shot Q&A pattern?"* That question surfaces the architectural-requirement test live, while Paul is still describing his mental model.
   → Why it matters: filtering happens *now*, in the conversation. Filtering later (post-call) means follow-up cycles get spent on opportunities that were already disqualified.

### What Worked

1. **Listening discipline after the opener.** Once the infrastructure-language opener failed to land, Simon shifted to listening mode and stayed there. Good summarizing back: *"You came on to essentially clean up the data layer for everything to be built on top, basically."* Paul confirmed cleanly. The summary established peer rapport.

2. **"We're math guys, we work in probabilities" — peer language landed.** Paul: *"Exactly."* This is the right vocabulary register for a data-platform leader. Reinforced credibility without claiming expertise.

3. **Didn't pitch, didn't force a close.** This was correctly identified as a discovery call and Simon mostly stayed in discovery. The failure mode was *too far* the other way (too much listening, no probing) — but the opposite failure (over-pitching) was avoided.

## Verdict for the May 22 Comparison

This call provides direct evidence for the vertical-discovery hard comparison tomorrow:

- **Pain is confirmed** at the firm level (PMS migration anxiety, AP automation gap, data-quality engineering burden).
- **Architecture-fit is absent** in the workflows where pain is highest. Paul's own articulation of the migration agent is the proof: *"the agent doesn't need access to the PMS."*
- **The cross-PMS agent-portability framing did not produce buyer-side resonance.** Paul didn't lean in when the framing was presented. He talked back about *vendor* cross-vertical reuse, which is a different (and useful) signal.

**This is the same shape of result as the firm-direct verdict from May 1.** Vertical discovery in the DSO segment is reproducing the pattern: real pain, but architecture-grade workflows are scarce. One call is not a verdict — but combined with other vertical-discovery calls this sprint, the pattern matters.
