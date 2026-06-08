# Outreach Templates

Reference templates for cold outreach to BD targets. Each template includes the email, the ICP it serves, the principles behind it, and the variables to swap per recipient.

**Status**: Active reference. Add new templates as they're developed and tested.

---

## Template Index

| Template | ICP | First sent | Status |
|---|---|---|---|
| Methodology Owner with Skill Library | Creator with Audience + Static Workflow Seller (overlap) | 2026-05-08 (Maja, GTM Strategist) | Awaiting response |
| AI Workflow Consultancy / Agency | Externalized AI Enabler — emerging ICP, not yet in icps.md | 2026-05-08 | Awaiting response |

---

## Methodology Owner with Skill Library

**Use when**: Recipient has published a multi-skill library tied to a methodology they monetize (book, course, coaching). Often falls under multiple ICPs simultaneously: Creator with Audience, Static Workflow Seller, Published but Blind.

**Pitch shape**: Disclosure of intent + partnership invitation. You're planning to build the agent regardless (MIT-licensed work permits it); the email invites them to partner because doing it together is better for both sides.

**Key principles**:
- **Open with authentic personal use** ("I've been playing with..."). Establishes you're not a salesman; you're a real user. Hardest part to fake — only send this if it's true.
- **Disclose intent up front.** "I'd love to turn the library into an AI agent." Don't bury the ask.
- **Acknowledge the MIT license.** Signals professionalism, prevents later trust erosion if they say no and discover the agent later.
- **Frame as the bigger version of what they already built.** Respects their work; positions you as extending, not replacing.
- **Connect to their existing business model.** Their book/class/coaching become natural upsells from inside the agent — your offer strengthens their funnel, not competes with it.
- **Partnership offer with their ownership preserved.** "You keep ownership and brand, I help with the engineering, you decide monetization."
- **Soft CTA.** Quick chat, not a long demo or deck.

**Pitch matches Sophisticated Ecosystem Publisher framing in `icps.md`** — peer-to-peer, not vendor pitch.

### Email

**Subject**: Want to turn your [skill library / methodology] into an agent?

```
Hi [name],

I've been playing with your [thing]. [Personal context — why I'm using it.] Very cool work!

And actually, I'd love to turn the library into an AI agent. We build infrastructure for exactly this: agents that run like skills, have persistent memory, and work in any harness. Your MIT license permits it, but I'd rather build it with you.

The bigger version of what you've got: your full [methodology] as one persistent agent: remembers each user's [domain context] across sessions and runs in their preferred tool (not just Claude Code). [Their monetization channels] become natural upsells from inside a working agent. Much stronger funnel than skill downloads, where you have no visibility into who's actually using them.

If we partner, you keep ownership and brand, I help with the engineering, you decide monetization. Worth a quick chat?

— Simon
Tokenrip cofounder (tokenrip.com)
```

### Variables to swap per recipient

| Placeholder | What goes here | Example (Maja) |
|---|---|---|
| `[name]` | First name | Maja |
| `[thing]` | Specific name of their library/skill/repo | GTM skill library |
| `[Personal context]` | Why you're actually using it | We're figuring out our own GTM right now and it's helping |
| `[methodology]` | Their methodology label | GTM skillset |
| `[domain context]` | What the agent should remember | accounts and pipeline |
| `[Their monetization channels]` | Their existing business model | Coaching, book, and class |

### Notes

- The MIT license mention is load-bearing if you actually plan to build the agent regardless. If you don't, drop the line — it adds weight without purpose.
- For non-MIT licenses, change the framing: "I noticed your license — happy to discuss terms" or similar. Don't claim permission you don't have.
- The "very cool work!" closer to the opening is informal but warm. Keep or cut depending on tone match with recipient.

---

## AI Workflow Consultancy / Agency

**Use when**: Recipient is an AI consultancy or agency that builds workflows for clients. Often Claude Code-native, often small team (2-20), often selling implementation services rather than a product. Examples: Team Attention.

**Pitch shape**: Simple peer-to-peer. No hook, no AIDA — just direct value prop and a low-friction offer. Consultancies are sophisticated buyers who evaluate offers on merit; the simple voice respects their time and signals you're not running a sales playbook.

**Note on ICP**: This pattern doesn't fully match any existing ICP in `icps.md` yet. It's structurally similar to **AI Enabler** (ICP #6) but externalized — the AI Enabler is the internal company role; the AI consultancy is the same role rented out as services. If 2-3 more conversations with this segment surface the same shape (need delivery substrate, want post-engagement iteration, frustrated with vendor coupling), worth promoting to ICP #8 ("AI Workflow Consultancy").

**Key principles**:
- **Open with what they do, not what we do.** "You guys build AI workflows for clients" puts their world first.
- **Compress value prop into one sentence.** Three concrete benefits (any harness, persistent memory, usage data) in one breath.
- **Name the post-deploy gap.** "Iterate after you deploy" speaks to the consultancy-specific pain — current deliverables die at handoff.
- **Low-friction offer with their decision authority.** "Convert one of your client workflows free" → "you decide if it's worth a longer conversation."
- **Short.** ~70 words. Consultancies value efficiency.

### Email

**Subject**: [Portable AI agents — worth a quick chat?]

```
Hi [name],

You guys build AI workflows for clients. We build infrastructure for portable AI agents: agents that work in any harness, remember context across sessions, and give you usage data to iterate after you deploy.

I'd be happy to convert one of your existing client workflows as a working example for free. Then you can decide if it's worth a longer conversation.

— Simon
Tokenrip cofounder (tokenrip.com)
```

### Variables to swap per recipient

| Placeholder | What goes here | Notes |
|---|---|---|
| `[name]` | First name (founder/lead) | If sending bulk and no specific contact, "Hi," works but reduces open rate |

### Notes

- **"You guys" tradeoff**: casual and warm but slightly bro-y. Use "Hi [name]," with first name if you have one — drops "you guys" naturally. For unknown contacts where you'd otherwise default to "Hey team," "you guys" is acceptable.
- **No personalization on what they specifically built** — this is intentional for the simple version. Tradeoff: lower hit rate vs. faster send. If you find a specific signal (a published skill, a public client case study, a tweet about their delivery pain), add one specific line and the response rate will jump.
- **The "iterate after you deploy" line is the consultancy-specific hook.** Don't drop it for other ICPs — it only resonates with people who ship things to clients and walk away.
- **No subject line in original send** — placeholder above is the working version.

---

## Notes for adding new templates

Each new template should include:
- **ICP it serves** (cross-ref to `icps.md`)
- **When to use it** (recipient signals that match)
- **Pitch shape** (one-line summary of strategy)
- **Key principles** (so future-Simon understands the why, not just the what)
- **Email** with subject line and clear placeholders
- **Variables table** with one worked example
- **Notes** on edge cases or variants
