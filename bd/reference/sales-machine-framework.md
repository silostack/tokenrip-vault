# The Sales Machine — A Framework for GTM Machinery

*Created: 2026-05-18 · Owner: Simon · Status: reference framework*

## Purpose

This document defines a mental model for building Tokenrip's go-to-market motion as a machine rather than a set of manual founder activities. It is a reference to build *backward* from — the mature end-state — and the basis for scoping the demand-scout agent (the machine's first stage).

---

## Core Principle: Work *On* the Machine, Not *In* It

A sales machine is a system in which every stage is instrumented, carries a measurable conversion rate, and can be improved independently of the others. The founder's job is not to sell — it is to build and tune the system that sells.

This reframes effort. Manual selling scales linearly with founder hours. A machine scales with the quality of its weakest stage. The discipline is to spend founder time identifying and fixing the one stage that is currently constraining throughput, not to spend it grinding the funnel by hand.

---

## The Seven Stages

| # | Stage | What it does | Output |
|---|-------|--------------|--------|
| 1 | **Sourcing** | Generates qualified leads automatically from demand signals | Ranked list of prospects |
| 2 | **Qualification** | Scores leads on fit before founder time is spent | Prioritized, filtered subset |
| 3 | **Outreach** | Templated, personalized-at-scale first contact | Booked conversations |
| 4 | **Conversation** | The calls — the irreducibly human core | Qualified, deal-shaped prospects |
| 5 | **Conversion assets** | Standardized closing instruments | Closed engagements |
| 6 | **Instrumentation** | Per-stage metrics and conversion rates | A known, always-current bottleneck |
| 7 | **Feedback / expansion** | Routes learning and customers back into the machine | Improved upstream stages; references |

### Stage detail

**1. Sourcing.** Continuously converts demand signals into prospects. Mature form: automated, always-on, and pointed at channels where buyers reveal active demand. For Tokenrip this is the demand-scout agent (see below).

**2. Qualification.** Scores prospects on fit so founder attention flows to the highest-expected-value conversations. Important: qualification switches *on* when volume becomes the constraint. Below that threshold, every conversation is signal and filtering is premature.

**3. Outreach.** First contact, templated and personalized at scale. Agents draft; the founder approves. The asset here is a small library of message templates that convert, refined by Stage 7 feedback.

**4. Conversation.** The calls. This stage stays human — but "human" does not mean "un-systematized." It is made repeatable through three artifacts: a discovery script, an objection-handling document, and a recorded demo. The machine standardizes the *inputs* to the conversation, not the conversation itself.

**5. Conversion assets.** The instruments that turn an interested prospect into a closed engagement without bespoke real-time negotiation: a one-page term sheet, a pricing structure, a demo, and case studies. Their absence forces every deal into custom negotiation, which produces concessions the founder later regrets.

**6. Instrumentation.** Every stage carries a number, and the conversion rate between each adjacent pair is known. This is what makes the bottleneck visible at all times.

**7. Feedback / expansion.** What conversations teach feeds back into qualification criteria, outreach templates, and conversion assets. Closed customers become references and case studies, which feed Stage 1. This loop is what makes the machine compound rather than merely run.

---

## The Operating Principle: One Bottleneck at a Time

At any moment, exactly one stage constrains throughput. The founder's task is to find it by the numbers (Stage 6), fix that stage, and re-measure. Effort spent on any other stage produces motion, not progress.

This is the bottleneck-first discipline applied to revenue: *what is the biggest production bottleneck in the sales machine right now?*

---

## Mapping to Tokenrip

| Stage                   | Tokenrip implementation                                          | Current state                                                      |
| ----------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1. Sourcing             | Demand-scout agent                                               | To build (this week, v1)                                           |
| 2. Qualification        | Expected-utility scoring of conversations                        | Off — premature at current volume                                  |
| 3. Outreach             | Agents draft Upwork bids / job-req messages; founder approves    | Manual today                                                       |
| 4. Conversation         | Founder calls + discovery script, objection doc, recorded demo   | Manual; artifacts not yet built                                    |
| 5. Conversion assets    | Term sheet, pricing, demo (Chief of Staff), case studies         | Term sheet/pricing deferred until a conversation turns deal-shaped |
| 6. Instrumentation      | KPI snapshot in `DASHBOARD.md`                                   | Partial                                                            |
| 7. Feedback / expansion | Aggregate architecture-fit read; closed engagements → references | Not yet — depends on first engagements                             |

**Current bottleneck:** Stage 1/3 — there is no live conversation pipeline. This is why active-demand interception (Upwork + job reqs) and the demand-scout agent are the week's priority.

---

## Stage 1, Concretely: The Demand-Scout Agent (v1)

The demand-scout agent is the machine's sourcing stage. Scoped minimally for v1:

- **Inputs (demand signals):** Upwork job-post feeds; LinkedIn / job-board listings for AI-agent and automation roles; Reddit (r/AI_Agents, r/automate); X / Twitter frustration-signal searches ("how do I build an agent that…", "Custom GPT too limited").
- **Function:** Poll these sources on a schedule; extract posts describing AI-agent build needs; deduplicate; rank by a simple heuristic (recency, budget signal, fit keywords).
- **Output:** A ranked daily list of prospects surfaced to the founder for Stage 3 (outreach / bidding).
- **Explicitly out of scope for v1:** automated bidding, qualification scoring, CRM writeback. v1 surfaces; the founder acts.

**Discipline note:** the agent serves the funnel; it does not replace bidding. Daily ordering is fixed — bid first, build the agent second.

---

## Strategic Note: The Machine as Dogfood and Imprint

Tokenrip's GTM machine, built as mounted agents on Tokenrip itself, is simultaneously a dogfood of the platform and a candidate lighthouse imprint set. The demand-scout agent is Stage 1 of the sales machine and a publishable agent. "Publish the agents we build for ourselves" converts internal GTM machinery into substrate density.

This is the system-building instinct aimed at a multiplier: tooling that builds the company and the category at once. It is a downstream opportunity — sequenced *after* the machine works for Tokenrip's own pipeline, not before.

---

## How to Use This Document

1. **As a map.** When the pipeline stalls, locate the failing stage and fix that one.
2. **As a build spec.** Each stage is a buildable component. The demand-scout agent v1 (above) is the first.
3. **As a sequencing guard.** Do not build a stage before the bottleneck reaches it. Instrumentation and qualification matter only once there is volume to instrument and filter.
