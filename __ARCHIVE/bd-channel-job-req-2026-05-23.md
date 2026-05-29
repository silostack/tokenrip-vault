# Job-Req Interception — Operational Playbook

*Created: 2026-05-18 · Owner: Simon · Status: active, manual v1*

## Purpose

Intercept companies posting AI-agent job reqs and offer a 2-week paid pilot as a bridge while they hire. This is **Stage 1 (sourcing) + Stage 3 (outreach)** of the sales machine ([[../bd/sales-machine-framework]]), pointed at job reqs instead of Upwork gigs.

Run manually now to test the channel. Once the steps are stable, this doc becomes the spec for the demand-scout agent.

**Core hook:** A job search runs ~3 months to fill, ~3 more to ramp. We can have a working agent live in ~2 weeks. The company keeps its req open and decides afterward.

---

## The Daily Loop (~20–30 min, after Upwork bidding)

> Target: **2 qualified outreaches/day** (Yoda commitment, May 18-22 — calibrate up after starting).

1. ☐ Source — pull a fresh batch of job reqs (Step 1)
2. ☐ Qualify — keep/skip each against the criteria (Step 2)
3. ☐ For each keeper: find the hiring manager (Step 3)
4. ☐ Send outreach (Step 4)
5. ☐ Log every req reviewed + every outreach sent (Step 5)
6. ☐ Reply to any responses same-day, book the call (Step 6)

---

## Step 1 — Source

**Primary: Indeed.**

1. Go to `indeed.com`.
2. Search each term (run all, dedupe):
   - `AI agent`
   - `AI automation`
   - `AI engineer`
   - `automation specialist`
   - `forward deployed`
3. Filters:
   - **Date posted: Last 14 days** — recency is the whole point; a stale req means they're already deep in their pipeline.
   - Location: `Remote` (US) — adjust as needed.
4. Open ~10–15 listings into tabs. Expect to keep only ~2–4 after Step 2.

**Secondary (use when Indeed runs thin):** LinkedIn Jobs, Wellfound, YC Work-at-a-Startup.

---

## Step 2 — Qualify (keep / skip)

**KEEP if it looks like:**
- ☐ **First AI hire** — small/mid company, no existing AI team, JD doesn't reference other AI engineers.
- ☐ **Non-technical hiring side** — role sits under Ops/CX/Marketing, or reports to a VP Ops / COO. They want outcomes, not a teammate.
- ☐ **Internal automation need** — "automate our [support / ops / reporting / onboarding]." There is a concrete, nameable task in the JD.
- ☐ Posted in the last ~14 days.

**SKIP if:**
- ✗ **Build-our-product req** — "build AI agent features into our platform." They want in-house IP and a teammate.
- ✗ Company already has an AI team (hiring its 3rd+ AI engineer).
- ✗ Posted by a staffing agency / recruiter with no identifiable end company.
- ✗ "AI" is a buzzword on an unrelated role (e.g. a data analyst posting).
- ✗ Big tech or an AI-native startup.

**Rule of thumb:** the best req is a mid-size non-tech company hiring its *first* AI person, posted by someone who is not an engineer. Capture the **specific task** named in the JD — that is the personalization variable for Step 4.

---

## Step 3 — Find the Hiring Manager

Reach the person who owns the pain, never HR/recruiting.

1. Read the JD for "reports to" / named team.
2. On LinkedIn, search the company + likely title:
   - Ops-flavored req → `VP Operations`, `Head of Operations`, `COO`, `Director of Operations`
   - CX req → `Head of Customer Experience / Support`
   - Marketing req → `VP/Head of Marketing`
3. Pick the most senior person who plausibly owns that function at a company that size.
4. Contact channel:
   - **Primary: LinkedIn** connection request + note (no email guessing needed).
   - **Alt: email** — guess the pattern (`first.last@company.com`; confirm via hunter.io if unsure).

If no manager is identifiable after ~3 min, skip the req — don't sink time.

---

## Step 4 — Outreach

Two channels. Always fill the `[specific task]` slot with the concrete thing from the JD.

### LinkedIn connection note (<300 chars)

```
Hi [Name] — saw [Company] is hiring for [Role]. We deploy a working
AI agent for that exact work as a 2-week paid pilot — a bridge while
you run the search. Open to a quick call?
```

### Follow-up once connected / or email body

```
Subject: [Role] — a faster option than the 3-month search

Hi [Name],

Saw [Company] is hiring a [Role]. That search typically runs ~3 months
to fill and another ~3 to ramp.

We do something different: we deploy a working AI agent for the specific
job in your posting — [specific task from JD] — as a paid pilot, live in
about 2 weeks. You keep the req open and decide afterward whether you
still need the seat.

Worth a 20-minute call to see if your use case fits?

Simon
Tokenrip
```

**Tone rules:** name a real number (3 months / 2 weeks), reference the actual task, keep it short, don't ask them to cancel the req. The pilot is the low-commitment yes.

---

## Step 5 — Log & Track

Keep a running table (this file or a separate tracker; a Tokenrip collection later).

| Date | Company | Role | Hiring manager | Channel | Outreach sent | Reply | Call booked | Notes / JD task |
|------|---------|------|----------------|---------|---------------|-------|-------------|-----------------|
|      |         |      |                |         |               |       |             |                 |

Log **every req reviewed**, not just the ones you act on — the skip rate is data.

---

## Step 6 — On Reply

- Respond **same day**. Speed matters most here.
- Goal of the reply: book a 20-minute call. Nothing else.
- Don't pitch architecture or scope the pilot over text — that's the call.
- Log the booking; discovery-call prep is a separate exercise.

---

## Metrics to Watch (Stage 6 — instrumentation)

Track weekly so the bottleneck stays visible:

- Reqs reviewed → reqs qualified (skip rate)
- Outreaches sent → replies (reply rate)
- Replies → calls booked (booking rate)

These conversion rates tell you which stage to fix. Low reply rate → fix the template. Low qualified rate → fix the search/filter.

---

## Notes for Turning This Into an Agent

The demand-scout agent v1 inherits this doc. Automatable vs. human:

- **Automate:** Step 1 (poll Indeed/boards), Step 2 (score against keep/skip), Step 3 (hiring-manager lookup), Step 4 (draft personalized outreach).
- **Human:** approve the draft, send it, take the call.

v1 surfaces a ranked daily list; the founder acts. Matches the demand-scout scope in [[../bd/sales-machine-framework]].
