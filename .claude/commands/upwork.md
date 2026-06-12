---
description: Draft an Upwork bid (cover letter + milestone breakdown) from a job posting, following the full Upwork proposal playbook. Produces a humanized, ready-to-send proposal plus a short strategic note.
---

# Upwork — Job Bidding

You are drafting an Upwork bid for Simon. He pastes a job posting (and sometimes a steer). You produce a ready-to-send cover letter, a milestone breakdown when the posting supports one, and a short strategic note.

This command is thin on purpose. The knowledge lives in the playbook. **Update the playbook, not this command, when guidelines change.**

## Step 1: Load the playbook

Read `agents/closer/upwork-proposal-playbook.md` in full — the canonical ruleset:
- §1–§9: cover-letter rules (phase, triage, opener, proof, implementation details, discovery offer, the close, length/voice, humanize)
- §10: pricing & milestone breakdowns
- §11: honesty & confidentiality guardrails
- §12: which credential to lead with
- §13: the first six lines are the hero — inline the greeting, get proof links / Loom up top before "Show more" truncates; below the fold stays usable
- §14: differentiators (below the fold) — the one that fits the job: ownership-not-dependency, full-stack range, US/real-time loop

Read `agents/closer/memory/patterns.md` for the deeper pricing library when a bid needs a milestone breakdown or a real pricing call.

Everything below is a pointer; the playbook wins on any conflict.

## Step 2: Read the posting

- **Named hard part?** Drives which credential leads (§12).
- **Explicit asks?** Each explicit ask gets one paragraph (§8); named tech gets named back, briefly and confidently (§5).
- **Scope clear or ambiguous?** $5K+ or ambiguous → paid-discovery M1 (§6, §10).
- **Asks for a milestone breakdown?**

Optionally give Simon a one-line read of the buyer (real buyer / vague, expect a noisy thread) before drafting.

## Step 3: Draft the cover letter

Follow the playbook. The envelope:

- **Open:** inline the greeting — `Hi, <one concrete, relevant first sentence>` on one line; no `Hi,` alone, no "I'm Simon" self-intro (§3). Use the client's name if it's visible (`Hi [Name],`).
- **Above the fold (§13):** get the strongest clickable proof — a Loom link if Simon supplied one, else `tokenrip.com` / `quintel.ai` — into the first few lines, before "Show more" truncates. Don't bury proof in a closing paragraph.
- **Body (below the fold):** lead with the right credential (§12); no ceremony; name their checklist back only if they asked (§5); add the one differentiator that fits the posting — ownership, full-stack range, or US/real-time loop (§14). Keep the hero tight and the whole thing ~150–300 words (§8). **Use contractions liberally; cut the high-horse pushback paragraph; get to the point (§8 Voice).** Reference attachments lightly ("see portfolio + attached file") and the matching screenshot (§12).
- **Close:** one leading, owned next step (§7); then a warm one-line call-offer covering requirements / short pre-discovery / fit-check before they commit to anything (§7); then:
  ```
  Thanks,
  Simon

  P.S. - Feel free to look me up on LinkedIn for more information: Simon Pettibone
  ```

## Step 4: Milestone breakdown (if the posting supports one)

Apply §10. Paid-discovery M1 for ambiguous/$5K+ jobs; riskiest milestone never the cheapest; no hunger tells; breakdown goes in the milestone fields with one line in the letter; anchor the total honestly and note it's scalable. For genuinely undefined scope, a single paid-discovery milestone beats a fabricated multi-milestone plan.

## Step 5: Honesty + confidentiality pass

Apply §11. Abstract confidential clients (equipment finance, healthcare credentialing — never named). Don't overclaim quintel (v1/demo, no signed/paying/live customer) or state unverifiable specifics. Flag any stack/framework claim Simon may not be able to back hands-on, and offer the softer phrasing.

## Step 6: Humanize

Run the `humanizer` skill (§9) before presenting: kill em-dashes, boldface, rule-of-three rhythm, uniform paragraph lengths. Keep genuine checklist mirrors. Present the final letter.

## Step 7: Strategic note

After the letter + milestones, give Simon a short, tough-advisor note: the one thing that makes or breaks this bid, any honesty checkpoint, and whether it's worth his time in the current phase (`Conversation Volume` — bid wide, optimize for a reply). Keep it tight; he's flagged verbosity.

## Arguments

If Simon pastes a posting, go straight to drafting. If he adds a steer (e.g. "lead with Tokenrip", "make it a partnership play", "skip the milestones"), apply it.

If Simon supplies a Loom/demo link for this bid, it leads the proof and goes above the fold (§4, §13). Default-assume the posting is US-based when the real-time-loop differentiator fits (§14); if Simon says it isn't, drop that line.
