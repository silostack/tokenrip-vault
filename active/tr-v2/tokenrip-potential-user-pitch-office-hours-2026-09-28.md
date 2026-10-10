---
title: "Tokenrip potential-user pitch: derive the line from David's first cycle, hold a record-led draft for the site"
date: 2026-09-28
mode: Startup
status: DRAFT
owner: Simon
session: /office-hours, 2026-09-28
related:
  - active/tokenrip-workspaces-prd-2026-09-14.md
  - product/tokenrip/tokenrip-positioning.md
  - product/tokenrip/external-positioning.md
  - active/tr-rework/tokenrip-vision-and-roadmap-2026-06-09.md
  - active/tr-rework/tokenrip-first-loop-site-gtm-2026-09-04.md
  - active/research-glean-vs-tokenrip-2026-08-29.md
  - active/flpool/gameplan.md
  - bd/calls/contacts/david-lasaee.md
sensitivity: Internal. David LaSaee asked not to be recorded; his paraphrased asks stay in the vault.
---

# Tokenrip potential-user pitch

## Decision: write the engagement pitch for David first, and hold a record-led line for the site until his cycle gives better words

Simon selected options 1 and 2 from the session. The horizontal one-liner is not finalised now. The line that gets written and used next is the one David LaSaee hears on the day his spreadsheet breaks, and the potential-user sentence for the site is lifted from what he says after one full batch cycle on a Tokenrip workspace. Until then, a record-led draft line stands in for the site rework.

Rationale in one paragraph. The proposed line, "Tokenrip is a workspace manager for agentic collaboration; it provides shared workspaces that any agent can plug into," is the fifth top-level frame in five months (see Evidence), is written in Tokenrip's vocabulary rather than any user's, names the one claim competitors already match, and omits the two things the vault has identified as defensible. The only real potential user named in this session, David, arrived through a Quintel engagement, not a homepage, which is what the forward-deployed thesis in `CLAUDE.md` predicts. His stated asks map onto the workspace's record and log, not onto "workspace manager." The cheapest test of the sentence's load-bearing claim happens in early October anyway, so the line should be derived from that event rather than written ahead of it.

## Problem and intended outcome

- **Who benefits.** The person on the outside of a Quintel engagement who works with their own AI daily and receives work from Simon and Alek. David is the first instance. The broader "daily-AI knowledge worker" is the category, but nobody in that category has been reached any other way.
- **What changes.** One pitch, in the user's words, that makes David move the batch cycle onto a Tokenrip workspace. A site line that survives contact with that user.
- **Why now.** The Oct 6 send calendar (contact doc, 2026-09-26 status) puts volume at roughly 600 rows a day. The gameplan guardrail (`active/flpool/gameplan.md` §14) says the spreadsheet holds until about 500 rows. The sheet breaks in the first week of October regardless.
- **Success criterion.** David runs one full batch cycle in the workspace with no email attachment, no re-keyed row, and no internal item visible to him (the PRD acceptance test). He then describes it in his own words, and those words become the site line.

## Evidence

**Fact. Tokenrip's frame has moved five times and all five are live in the vault.**

| Date | Frame | File |
|---|---|---|
| 2026-04-29 | "The collaboration layer for AI agents" | `product/tokenrip/tokenrip-positioning.md` |
| 2026-05-12 | "AI that does the work" for firms and builders | `product/tokenrip/external-positioning.md` |
| 2026-06-09 | "Git for operational work", the why-graph, declared canon | `active/tr-rework/tokenrip-vision-and-roadmap-2026-06-09.md` |
| 2026-09-04 | The inbox and reflex runtime as the daily surface | `active/tr-rework/tokenrip-first-loop-site-gtm-2026-09-04.md` |
| 2026-09-14 | Workspaces: a shared working space several people, each with their own AI tool, plug into for one project | `active/tokenrip-workspaces-prd-2026-09-14.md` |

The June canon states the creator-audience GTM is dead and forward-deployed verticals are the GTM. The May builder positioning targeted the same "knowledge worker who uses AI daily" audience and was abandoned. A new horizontal line for that audience needs to say what changed, or be scoped to the engagement path.

**Fact. David's stated asks, paraphrased from the contact doc and gameplan.**

- Verdict fields in a database, not Excel; clickable fields instead of coloured cells (contact doc, 09-10 notes; gameplan §14).
- End-of-day tabulation and daily reports (same).
- No re-keying of two weeks of history when a system arrives (PRD, "What breaks today").
- "Any format, dump it to me" (contact doc, grading capacity note). He wants his data in his shape, not a new place to go.
- He runs Claude Enterprise and uses it on CSVs, email drafts, and the work with Quintel (Simon, this session).

**Fact. David's current workaround and its cost.** He grades in xlsx with cell colours and abbreviations, returns files by email and Slack, Simon hand-scores them into the outcome taxonomy per batch, and one quoted number already misfired between "applications" and "funded" (PRD, "What breaks today").

**Fact. The plug-in claim is no longer distinctive.** Glean ships an MCP into Claude Code and Cursor (`active/research-glean-vs-tokenrip-2026-08-29.md`). Buzz admits Claude Code, Codex, and goose by agent protocol and pitches "humans and agents build together" (memory note `competitor-buzz`). Dust, Nessie, Unabyss, Zaro, and Akai all pitch shared context to the daily-AI knowledge worker. The Glean research names cross-org boundary plus deliverable lifecycle as the remaining defensible ground.

**Inference, medium confidence.** David would let his Claude work directly in a workspace if offered. Simon's read this session: "he mostly uploads to chat, but given the option he'd probably do that." Unconfirmed. The PRD lists his connector as an open question. This is the assumption the sentence rests on.

**Inference, low confidence.** A daily-AI knowledge worker outside an engagement would read the proposed line and know what to do next. No such person has been named or observed.

## Scope and constraints

- **Smallest useful outcome.** The David pitch, delivered on the day the sheet breaks, with the current batch already loaded in a workspace so the offer is "it's there, connect or open it," not "would you like a tool."
- **Deferred.** The final horizontal one-liner. The homepage hero. Any restatement of the investor-facing category claim (the April "collaboration layer" and June "git for operational work" frames stay as they are for that audience).
- **Constraint.** The gameplan guardrail stands: do not let the platform delay a batch. The browser grid is David's fallback door if his Claude cannot connect.
- **Dependency.** The Workspaces v1 build, or at minimum a workspace with the batch as a record, the log, the shared tier, and either an MCP endpoint his Claude Enterprise can reach or the browser view.

## What the proposed line gets wrong, word by word

- **"Workspace manager"** shelves Tokenrip next to Notion, Drive, and Google Workspace, the warehouse shelf the Warehouse-to-Factory angle in `tokenrip-positioning.md` argues against. "Manager" also implies the human tends the workspace, while the PRD principle is that nobody uses a workspace; they process what happened.
- **"Agentic collaboration"** is vault vocabulary. David says "my Claude." The external-positioning guide already forbids this register for firms.
- **"Any agent can plug into"** is necessary and true, and it is table stakes. It belongs on line two as proof of harness neutrality (Claude, ChatGPT, Claude Code), not in the category line.
- **Missing.** The boundary between the team and the outside party, and the record with row history that ends re-keying. These are the differentiators per the Glean research and the two things David's asks map onto.

## Approaches considered

1. **Engagement pitch first, category line later. Selected.** Write David's line, run one cycle, lift the site line from his words. Cheapest, tests the load-bearing inference on a real event, respects the FDE rule. Risk: the site rework proceeds with a placeholder line.
2. **Record-led horizontal draft. Selected as the placeholder.** Every clause is built or in the PRD. Risk: reads as a feature list until user words replace it.
3. **Keep the proposed line, fix the nouns.** "A shared workspace any AI can work in directly." Rejected: plain and short, but indistinguishable from Buzz and Nessie on a homepage and it hides the boundary and the record.
4. **No new line; reuse the April "collaboration layer for AI agents."** Rejected for the user audience: it is a category claim for investors and does not tell David what to do.

## Draft lines

**For David, on the day the sheet breaks (the one that gets used next).**

> The batch lives in one shared workspace now. You grade in it, your Claude reads it directly, we never email you a spreadsheet again, and the totals are there every night.

Second line if he asks how: "Connect your Claude to it, or open it in the browser. Same data either way."

**Placeholder site line (record-led, replace after David's cycle).**

> Tokenrip is a shared workspace for a project where each person's AI works directly on the same records, files, and log, and outside parties see only what you share.

Proof line beneath it: "Works with Claude, ChatGPT, and Claude Code. Nothing re-keyed, nothing emailed."

Both lines use "workspace" (David can picture it) and drop "manager," "agentic," and "agent" as a noun.

## Risks and open questions

- **The reversing assumption.** David declines to connect his Claude and keeps asking for the xlsx. If so, the product he wants is a grid with nightly totals, the plug-in claim is plumbing, and the site line should lead with the record and the report, not the workspace. The test below resolves this.
- **Connector feasibility.** Whether his Claude Enterprise tier permits a custom MCP connector is unverified (PRD open questions). Verify before the offer so the browser fallback is ready, not improvised.
- **Sixth drift.** The placeholder line becomes a sixth live frame if it lands in `product/` unlabelled. Keep it in this brief and the site draft only, marked placeholder, until replaced.
- **Sample of one.** David is a single user with a Python background and 22 years of domain context. His words will be better than the vault's, but they are one person's. Treat the lifted line as a draft to test on the next outside party, not as final.
- **Timing collision.** The commercial terms with David are unresolved after five-plus calls. Offering a new tool during an unresolved money conversation can read as a substitute for the answer he keeps asking for. Sequence the workspace offer after, or clearly apart from, the next commercial exchange.

## Delivery and use

David receives the workspace as part of the batch cycle he already runs, not as a product. The offer is made in the same channel the batch ships in, with the batch already loaded. If his Claude connects, the MCP endpoint is the door. If not, the browser grid is. Either way the PRD acceptance test is the measure.

## The assignment

Before the Oct 6 send, load the current batch into a workspace and, on the first day David's sheet shows strain, make the offer using the David line above. Observe, without helping, which door he takes and what he does first.

- **Supports the premise:** he connects his Claude or opens the grid, grades one batch there, does not ask for the xlsx, and describes the value in his own words. Lift those words into the site line and update this brief.
- **Disconfirms the premise:** he asks for the spreadsheet back, or uses the grid but never lets his Claude near it. Then the pitch leads with the record and nightly totals, the plug-in claim moves to a footnote, and the site line is rewritten on that basis.

This brief does not send anything or run the test.
