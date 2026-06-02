# Ted Craver Call — 2026-06-01 (firm-direct)

> *Date inferred from context (no explicit date in transcript) — confirm.* First external prospect **Stauss actively brought** to Tokenrip. Ted runs revenue/sales at **Bevel**, a commercial-finance placement firm ($450M placed last year across ~75 lenders).

## Follow-Up Actions

### What WE Need to Do
| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | Prep for the follow-up call — digest the Bevel data Stauss sends, come with insights | Simon/Alek | Before next call (this week) |
| 2 | Be ready to receive/review the NDA, then view Ted's underwriting output sample | Simon/Alek | Upon NDA |
| 3 | (Internal) Clarify Stauss's economics/role in the Bevel intro — finder's fee? channel cut? | Simon/Alek + Stauss | Before commercial terms |
| 4 | (Internal) Decide: build Bevel on the same instance as the Stauss small-ticket bot, or separate? | Simon/Alek | Before build |

### What THEY Need to Do
| # | Action | Who | Due |
|---|--------|-----|-----|
| 1 | Take it to the managing director, get green light | Ted | 2026-06-02 (tomorrow AM) |
| 2 | Report MD feedback | Ted | ~2026-06-02/03 |
| 3 | Send NDA (if proceeding) | Ted | This week |
| 4 | Demo the home-built CRM on next call | Ted | Next call |
| 5 | Schedule the follow-up call | Stauss | ~2026-06-03–05 |
| 6 | Send Tokenrip Bevel data to surface pain "nuggets" | Stauss | Around next call |

### What They're Expecting From Us
**Nothing before the MD meeting** — the ball is in Ted's court. On the follow-up call they expect us (a) prepared with insights, (b) ready to sign/receive the NDA, and (c) ready to look at the CRM walkthrough + underwriting sample. No deliverable is due in the interim. *(Note: this is the rare firm-direct call where the next-step obligation sits with the prospect, not us — a strength.)*

### Open Questions Before Next Contact
- **What is Stauss's economic interest in the Bevel deal?** Finder's fee, channel cut, or pure goodwill? Determines whether Bevel is a Tokenrip *customer* or a Stauss-*channel* deal we service (briefing §7.5, "who owns the customer").
- **Same build as the Stauss small-ticket origination bot, or separate?** Both are underwriting + matching/placement. Big substrate-reuse upside if they converge.
- **Bevel's decision process** — is the MD the only gate? Who owns budget?
- **Deal-intake format** — PDF / email / structured? (Build-critical.)
- **Can we see a redacted memo under NDA?** It's the artifact the bot must produce, specialized per-lender.

## Call Summary

Stauss connected Tokenrip to Ted Craver, who runs revenue/sales at Bevel — a commercial-finance placement firm Stauss brokers deals through (and whose underwriting packages he's been praising). Ted laid out two pain pillars: **underwriting** (time-consuming, PII-laden) and **lender matching/placement** ($450M across 75 lenders, matched manually off a 1990s unjoinable database). Alek screen-shared a deal→underwrite→match→draft-outreach mockup; Ted validated it hard ("exactly what we've been looking for… yes, yes, yes, and yes"). Simon fielded the one objection (PII/compliance → "sandbox"). Next gate: Ted's managing director tomorrow AM (~90% confident), then NDA + follow-up call this week.

## Momentum

**↑ Advancing** — one call delivered painkiller-grade pain, a validated mockup, an identified champion, and a concrete dated next step (MD green light → NDA → call), with the next obligation sitting on the prospect.

## Key Intelligence / What Changed

1. **Stauss's channel thesis just produced its first live external prospect.** The Stauss briefing's central bet (§4: "he is a CHANNEL, not just a customer… seeding connected agents across a fragmented industry") moved from hypothesis to evidence — Bevel is the first deal he's actively introduced, not just named. The distribution-co-founder motion is working.
2. **Bevel is a cleaner first customer than VFI.** It's arm's-length (no Stauss-employment conflict-of-interest — the briefing §7.4 trade-secret/self-dealing/IP exposure doesn't apply), champion-led, with self-built-tooling pain, and its two pain pillars map 1:1 onto the equipment-finance build. This partially resolves the CoI problem: **build on Bevel (clean), keep Stauss as channel.**
3. **Bevel's placement history is a ready-made deal-graph.** $450M across 75 lenders in a broken 1990s DB. If Tokenrip becomes the underwriting+matching layer, it captures placement outcomes → builds the substrate/moat (briefing §6) — this time with a *live customer pulling on it*, not a hypothetical.
4. *(Pattern)* **PII/compliance is now the recurring opening objection in financial-services firm-direct** (Vijay/Travelers → Ted/Bevel). Worth a rehearsed, crisp "sandbox" answer as a reusable asset.
5. *(Trap avoided)* **The architecture-talk trap did not fire** (CLAUDE.md trap #1). The entire call was about Ted's *problems* (underwriting time, matching, bad DB, PII), not mounted-agent architecture. The only "architecture" talk was the buyer-initiated compliance question. Clean.

## Firm-Direct Lens

### Pain Evidence — painkiller, not vitamin (high confidence)
- **Strongest signal: he's already built the band-aid himself.** 15 JSON files of credit-union data in Claude, ~8 Apps Script files, a self-built Google-Sheets CRM. People don't build their own tooling for vitamins.
- Quantified + vivid: "$450M over 75 lenders — the math alone is awful"; database "think back to 1990… unjoinable"; matching done by "a room filled with us trying to do it off the top of our head."
- Two named time pinch points (underwriting + finding-a-lender) plus a manual closing tail ("emails and Slacks").
- Emotional confirmation: "this is exactly what we've been looking for… yes, yes, yes, and yes."

### Objections
| Objection | Type | How handled | Effectiveness | Better response |
|-----------|------|-------------|:---:|-----------------|
| "It's rife with Social Security numbers… how does the agent handle all that PII?" | Security / data-sovereignty | Simon: zero-retention enterprise plans, local models, SOC 2 / audit-trail custom architecture, design-partner framing. Ted compressed it to "sandbox"; Simon affirmed. | **4/5** | Lead with the headline, then offer depth: *"Short version — it runs in a sandbox. Your PII never leaves your environment and never touches training data. The how — local model, zero-retention plan, full audit trail — we tailor to whatever your compliance team signs off on."* Same content, but the buyer gets the answer in one sentence instead of assembling it from a four-item menu. |

*(Only one true objection. The MD green light is a gate, not an objection.)*

### Stakeholders / Authority / Budget / Timeline
- **Ted** — champion + sole power user + revenue/sales lead. Not the economic buyer.
- **Managing Director** — approval gate; meeting tomorrow AM; Ted ~90% confident. ("I do have to bow to the managing director.")
- **Budget** — not discussed, no price floated.
- **Timeline** — fast: NDA + follow-up call this week, contingent on the MD.

### Stage Signal
**Early discovery, advancing fast.** Discovery effectively complete in one call; champion identified; mockup validated; concrete, dated, prospect-owned next step. The deal is real and warm. Next read is the MD outcome.

## Simon's Performance

*(Simon spoke once — the PII/compliance answer. Alek ran discovery + demo; Stauss ran framing. Reasonable division of labor for the "product/engineering guy.")*

### Coaching Priorities
- **Answer at the buyer's altitude — lead with the headline, then offer depth.** Simon's compliance answer was substantively correct but ran as a four-item menu (zero-retention plans → local models → network permissions → SOC 2 / audit trail). Ted — a 20-year banker — compressed the whole thing to one word, "sandbox," and Simon conceded "I should have just said sandbox." → **Better:** open with the one-liner ("it runs in a sandbox; your PII never leaves your environment") *then* unpack on demand. **Why it matters:** with a sophisticated buyer, a confident headline reads as *more* expert than reciting the menu; the menu can imply you're thinking it through live. (Adjacent to — but distinct from — the infrastructure-language trap: Ted understood fine; the issue was length/lead, not comprehension. Don't log it as another infra-trap instance.)
- **Spend one engineer-grade discovery question to bank build-critical info + builder credibility.** Simon stayed silent through discovery. One or two questions only the builder would think to ask — *"What format do the deals arrive in when they hit your desk — PDF, email, structured?"* or *"What's the actual artifact you hand the lender today?"* — would both de-risk the build and position Simon as the person who'll actually make it. **Why:** the technical buyer trusts the technical founder; a sharp question is the cheapest way to earn that. (Soft note — staying quiet to let Alek run the motion was a defensible call.)

### What Worked
- **Owned the compliance question with authority** — "your concern is extremely valid" + a real menu of answers reassured a 20-year banker on his single biggest anxiety, turning a potential blocker into a trust-builder.
- **Language humility / mirroring** — adopted Ted's "sandbox" frame instantly and graciously ("I should have just said sandbox"). Lowers status friction, builds rapport with a self-deprecating buyer.
- **Tied the objection to the commercial frame** — closed the compliance answer on "that's the benefit of working as a design partner — a custom solution for your specific needs." Good instinct connecting objection-handling to the close.

---

*Yoda feed written (see `agents/yoda/memory/insights.md`, 2026-06-01) — the channel-validation + cleaner-than-VFI insight rises to that bar. Stauss contact doc cross-updated (channel thesis proving out; commitment #8 → live intro).*
