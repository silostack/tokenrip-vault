---
contact: Ted Craver
company: Bevel
call_type: firm-direct
status: warm/active — champion-led discovery; strong self-built-tooling pain; gated on managing-director green light (~90% confident, per Ted), then NDA
last_contact: 2026-06-01
---

# Ted Craver — Bevel

## Who / What

Runs the **revenue / sales side at Bevel**, a commercial-finance **placement firm** (deal broker/intermediary). **20 years in banking** before Bevel. Field originators drop deals to Bevel; Ted's team underwrites them, produces a credit memorandum, and **places them across ~75 lenders** — **$450M placed last year**. The same firm whose underwriting packages Stauss has been praising and forwarding (the "Bevel-sourced HNW tax-play deals," 7–10/week, $300K–$1M — see [[bd/calls/contacts/stauss-paulos]]).

**The only deep AI user at Bevel** ("everyone else uses it to clean up emails"). Self-built band-aid tooling: loads 15 JSON files of credit-union call-report data (~2–3K data points × 4,500 credit unions) into Claude for filters/sorts/searches; built ~8 Apps Script files running a "fakey CRM" in Google Sheets; falls back to Gemini when out of Claude tokens. Self-describes "low-intermediate — I know enough to be very dangerous, but I haven't broken anything yet."

**How he came in:** First external prospect **Stauss actively introduced** to Tokenrip (Stauss = our equipment-finance operating partner at VFI, who brokers deals through Bevel). This is the channel thesis from the Stauss briefing (§4 — "he is a CHANNEL, not just a customer") proving out in real time.

**Why he matters to Tokenrip:**
1. **Arm's-length, conflict-free first customer** — unlike VFI (where Stauss's employment creates the self-dealing / trade-secret / IP exposure in the briefing §7.4), Bevel is a third party. Ted is the champion *and* the primary user *and* already building his own workarounds. Cleaner first deal than VFI.
2. **Same architecture as the equipment-finance build** — Ted's two pain pillars (underwriting memo + lender matching/placement) map 1:1 onto the small-ticket origination-bot architecture being specced with Stauss. Could be the same substrate, built against a clean customer.
3. **Ready-made deal-graph** — $450M across 75 lenders sitting in a broken 1990s unjoinable database. If Tokenrip becomes the underwriting+matching layer, it captures Bevel's placement outcomes → builds the substrate/moat (briefing §6) with a live customer pulling on it.

## Call History

- **2026-06-01** *(date inferred — confirm)*: [[bd/calls/transcripts/ted-craver-2026-06-01]] · [[bd/calls/notes/ted-craver-2026-06-01]]
  — firm-direct: Introduction call, Stauss-brokered. Ted laid out two pain "silos": (1) **underwriting** — time-consuming, resource-intensive, PII-laden (SSNs); (2) **lender matching / placement** — $450M / 75 lenders matched manually "off the top of our head" against a 1990s unjoinable database, plus a never-ending search for new funding partners, plus an internal-data-query / CRM-logging need (e.g. "top 15 credit unions with C&I loans over $25M"). Alek screen-shared a deal→underwrite→match→draft-outreach mockup; Ted: "gold star… exactly what we've been looking for… yes, yes, yes, and yes." Ted raised PII/compliance; Simon handled it (zero-retention plans / local models / SOC 2 / audit-trail custom build → "sandbox"). **Next gate:** Ted takes it to his managing director tomorrow AM (~90% confident of green light) → reports feedback → signs NDA → follow-up call late this week. No pricing or budget discussed.

## Running Intelligence

**Bevel mechanics (first-hand from Ted):**
- **Business model:** placement firm. Field originators source deals → Bevel underwrites + writes the memo → places across ~75 lenders. **$450M placed last year.** Many lenders are one-offs.
- **The matching problem (pain pillar 2):** ~5–10 data points per lender (geography is the critical one; plus typical revenue, LTV requirements). Inherited DB is "think back to 1990" — two unjoinable silos, no clean join without manual work. Matching is done by **a room of people working off the top of their heads.** "The math alone is awful."
- **The underwriting problem (pain pillar 1):** "pretty bland" but **PII-heavy** (SSNs). Produces the credit memorandum Stauss praised. Per-lender nuance exists (Ted's example: VFI/Stauss obsessed with the guarantor's defensive-interval ratio; another bank doesn't care) → the bot would need to **specialize the memo per lender.**
- **A third, separate "silo" Ted flagged:** internal data queries + CRM logging — querying aggregated credit-union data on demand ("top 15 with C&I loans over $25M → export"), logging calls/emails. He runs a self-built Google-Sheets CRM for this today (post-underwriting). Will demo it on the next call.
- **The closing tail is manual:** "once you find them, the back-and-forth, the continuing discussion, then going to closing — it's all very people-oriented. Emails and Slacks."
- **Deal sizes (Stauss's framing of the messy middle):** $300K / $1M / $2M deals are "pretty messy, cause delays" — vs. clean $20–100M deals. The mess is the opportunity.

**AI posture:** Bottom-up, single-champion. No top-down mandate; Ted is the lone power user, self-building tooling. Same bottom-up-adoption shape the a16z thesis describes — and the same data-sovereignty time-bomb (a banker running PII through personal Claude/Gemini and an Apps-Script Sheets CRM with no governance).

**Authority:** Ted = **champion + primary user, not the economic buyer.** A **managing director** is the approval gate ("I do have to bow to the managing director"). Ted reads the green light at ~90% ("it's all no-harm-no-foul right now, we're just talking").

## Relationship / Pipeline State

**Temperature:** Warm and genuinely enthusiastic. "This is exactly what we've been looking for." Self-built workarounds = the strongest possible pain signal (he's already spending his own nights building the band-aid version).

**Stage:** Early but moving fast. One call = discovery complete, champion identified, mockup validated, concrete dated next steps. **Gate = managing-director green light** (tomorrow AM). Then NDA → follow-up call (late this week) where Ted demos his CRM and shares a (redacted, under-NDA) underwriting output sample.

**Pain:** Painkiller-grade. Quantified, vivid, structural (the "1990s database," the "room matching off the top of their heads," the $450M/75-lender math), and self-validated by his own tooling-building behavior. This is **not a vitamin.**

**Budget/timeline:** Budget not discussed; no price floated. Timeline fast — NDA + follow-up call this week, contingent on the MD.

**Open strategic questions (carry into next contact):**
- **Stauss's economics in the Bevel intro.** Does he expect a finder's fee / cut / channel economics? This shapes the "who owns the customer" question (briefing §7.5) — is Bevel a Tokenrip customer or a Stauss-channel deal Tokenrip services? Resolve before commercial terms.
- **Is the Bevel build the same codebase as the Stauss small-ticket origination bot, or a separate instance?** Both are underwriting + matching/placement. Substrate-reuse upside is large if they converge; watch for two half-built products.
- **Bevel's decision process** — is the MD the only gate, or is there a budget owner above/below?
- **Deal-intake format** — what do the field-originator deals look like when they hit Bevel (PDF / email / structured)? Build-critical.
- **The lender-facing artifact** — can we see a redacted memo under NDA (the thing the bot must produce, per-lender-specialized)?

## Open Commitments

| # | Action | Owner | Due | Status |
|---|--------|-------|-----|--------|
| 1 | Take the conversation to the managing director; get green light to continue | Ted | 2026-06-02 (tomorrow AM) | Open |
| 2 | Report feedback from the MD meeting | Ted | ~2026-06-02/03 | Open |
| 3 | Send NDA (if proceeding) | Ted | This week | Open |
| 4 | Show the home-built CRM on the next call | Ted | Next call (this week) | Open |
| 5 | Schedule the follow-up call (late Wed/Thu/Fri) | Stauss | ~2026-06-03–05 | Open |
| 6 | Provide Tokenrip with Bevel data to surface pain "nuggets" before the call | Stauss | Around next call | Open |
| 7 | Prep for the follow-up call with insights (digest Stauss's data) | Simon/Alek | Before next call | Open |
| 8 | Be ready to receive/review NDA, then view the underwriting output sample | Simon/Alek | Upon NDA | Open |
| 9 | (Internal) Clarify Stauss's economics/role in the Bevel intro | Simon/Alek + Stauss | Before commercial terms | Open (inferred) |
| 10 | (Internal) Decide: Bevel build = same instance as Stauss small-ticket bot, or separate? | Simon/Alek | Before build | Open (inferred) |
