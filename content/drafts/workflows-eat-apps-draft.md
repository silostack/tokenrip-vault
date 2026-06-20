---
title: "Workflows Are Eating Apps"
slug: workflows-eat-apps
post_type: thesis
created: 2026-06-11
word_count: 1741
sources: content/sources/workflows-eat-apps/references.md
keywords: [AI workflow ownership, AI workflow lock-in, workflows replace SaaS, vendor workflow capture, portable AI workflows, operator AI sovereignty, context flywheel]
meta_description: "AI workflows are replacing $49/seat SaaS tools. But the workflow lives inside the vendor — and the lock-in is worse than the product it replaced."
tokenrip_id: dfee8381-54f9-4c55-aa7d-1e32f6446a6e
---

![Hand-drawn crayon illustration: a colorful kid drawing showing arrows and chaos around a computer screen with a face, stick figures, and money — representing workflows eating apps while creating new vendor dependency](../images/workflows-eat-apps-hero.png)

# Workflows Are Eating Apps

Software stocks just posted their [worst valuation compression in a decade](https://www.saastr.com/the-saas-rout-of-2026-is-even-worse-than-you-think-for-the-first-time-ever-software-now-trades-at-a-discount-to-the-sp-500/). Forward P/E multiples fell from 84x in 2021 to 23x by March 2026 — the lowest absolute level since 2014, and for the first time in the modern era, software trades at a discount to the S&P 500. Hedge funds have cut software to its [lowest portfolio weight since 2019](https://fortune.com/2026/05/26/goldman-sachs-saaspocalypse-hedge-funds-software-exit/). Mutual funds are carrying their widest underweight since 2012. Two trillion dollars in software sector value disappeared, and a quarter of it vanished in a [single February trading session](https://www.bettercloud.com/monitor/saas-industry/) after Anthropic shipped enterprise agent plugins.

The easy story is that AI is cheaper than software. The stranger story: AI is not replacing the product. It is replacing the need for one. An operator who used to buy a $49-per-seat project management tool now describes the workflow they want and an agent builds it inside the chat window. No purchase order, no vendor evaluation, no seats to manage. The tool evaporated. A workflow took its place.

But when the workflow does the job the app used to do, where does the workflow live?

## The product disappears. The dependency doesn't.

The categories getting eaten first are the ones [analysts have been flagging](https://deployflow.co/blog/ai-agents-breaking-saas-model/) for years: workflow mediation, project management, document automation, support ticketing, BI dashboards that sit on top of data stored somewhere else. The value of these products was never the software. It was the structured process the software enforced. An AI agent can enforce the same process without the product.

What changed is economics, not capability. Two years ago, building a custom AI workflow to replace a SaaS tool cost more than the subscription. Today, the cost has inverted. [Enterprise teams are pulling critical workflows out of SaaS platforms](https://pctechmag.com/2026/04/why-ai-powered-custom-applications-are-replacing-saas-for-enterprise-workflows/) and rebuilding them as agent-driven processes that understand their specific business context — something a generic tool never could.

The transaction has shifted. The operator describes an outcome instead of buying a product. They pay per result instead of per seat (or, more commonly, pay nothing beyond the platform subscription they already have). They talk to the agent in plain language and the workflow materializes. No new interface to learn.

The operators celebrating this shift are not wrong. But there is a cost they have not priced in.

## The hidden trade: convenience for deeper lock-in

When a workflow replaces an app, the operator gains convenience and pays in dependency. The $49 tool had a visible cost, a visible vendor, and a switching path you could draw on a whiteboard: export your data, import it somewhere else, learn a new interface. The AI workflow has none of those boundaries. It lives inside the vendor's surface, its memory in the vendor's database, its versioning at the vendor's discretion. There is no export button because there is no product to export from. The workflow simply exists where it was born.

It looks the same across every major AI surface. A custom agent in ChatGPT accumulates instructions, conversation history, and behavioral patterns inside OpenAI's infrastructure. A Claude Project stores context, preferences, and working memory inside Anthropic's environment. A Copilot workflow binds to the organization's emails, calendars, and documents through integration points that only work inside Microsoft's ecosystem. In every case, the workflow is not a file the operator owns. It is a state the vendor maintains.

The old lock-in had a price tag. You could calculate the switching cost: data migration, retraining, integration rebuilding. The new lock-in has no price tag because the operator never bought anything. They described a workflow, and it appeared. They described another, and another. Forty workflows later, their operational playbook lives inside a vendor environment, and the switching cost is not the license fee they are not paying. It is the accumulated intelligence they cannot extract.

## Every workflow you build makes the next one harder to move

The first workflow runs on generic instructions. The tenth workflow references patterns the agent learned from the first nine. The fiftieth workflow relies on memory, preferences, and behavioral calibrations that the agent accumulated over months of use. The operator's institutional knowledge is no longer in a document or a process manual. It is distributed across the vendor's model state, and none of it is portable.

[Only 6% of enterprises](https://stepto.net/blog/ai-vendor-lock-in-infrastructure-risk-2026) report they could switch AI vendors without material disruption. AI lock-in reaches critical mass in roughly 18 months — compared to roughly a decade for equivalent cloud lock-in. That acceleration is not an accident. AI platforms [lock in the context of users](https://www.kai-waehner.de/blog/2026/04/06/enterprise-agentic-ai-landscape-2026-trust-flexibility-and-vendor-lock-in/) because context is both competitive moat and retention mechanism. The more the agent knows about how you work, the more painful it is to start over with one that does not.

The switching cost here is not the 19–34% financial penalty [industry surveys report](https://www.kai-waehner.de/blog/2026/04/06/enterprise-agentic-ai-landscape-2026-trust-flexibility-and-vendor-lock-in/) for AI vendor transitions. It is the months of degraded performance while a new agent re-learns what the old one already knew. It is the workflows that worked yesterday and do not work tomorrow because the institutional context that made them work was never yours to move.

## The model is commoditizing. The context is not.

The thing most operators worry about — which model to use — is becoming the least important decision. OpenAI's enterprise API share [fell from 50% to 25%](https://menlovc.com/perspective/2025-mid-year-llm-market-update/) between late 2023 and mid-2025; Anthropic now leads at 32%; Google is climbing. The model layer is a commodity market. The operator's accumulated context inside any one of them is not commoditizing at all: the instructions, the memory, the behavioral patterns, the workflow logic, the institutional knowledge baked into how the agent responds. Vendors know this. The investment in 2026 is not in model quality. It is in capturing the context that makes the model useful for a specific operator, because that context is what prevents switching.

The SaaS era was supposed to cure this exact dynamic. The cloud promised that software would be a service — easy to adopt, easy to leave, pay only for what you use. What actually happened is that cloud software accumulated organizational data, integration dependencies, and workflow habits that made switching prohibitively expensive. The AI era is repeating the pattern at higher velocity and lower visibility.

## Owning the workflow means separating knowledge from runtime

The answer is not to stop building workflows. It is to build them somewhere you control, which means separating what the agent knows from where the agent runs. The durable part of a workflow — the instructions that define it, the memory it has accumulated, the identity that tracks its history, the audit trail that records what it did — lives on infrastructure the operator owns, independent of any model vendor. The runtime — which model processes the input — becomes a configuration choice the operator can change without losing anything.

The workflow's instructions live in a versioned document the operator controls — not embedded in a chat thread, but stored as a portable artifact that any model can read. The memory the workflow has accumulated about the operator's organization lives in the operator's own infrastructure, not in the vendor's internal state. The workflow has a name, a version history, and an audit trail that belong to the operator, not to whichever platform happened to run it last Tuesday.

That is what the [mounted agent model](https://tokenrip.com/s/77707a4c-aca6-4667-8554-9e77602a5254) describes. The operator's workflow intelligence is versioned as a portable asset. Memory sits in vendor-neutral infrastructure. Identity and history survive the session, the model, the platform. The infrastructure to host durable agent intelligence outside the runtime [already exists](https://tokenrip.com), and the gap between what it costs and what rebuilding fifty workflows costs is widening.

## The workflow ownership audit

Five questions any operator should ask about every AI workflow they have built, ordered from easiest to answer to hardest to fix. Each "no" is a piece of operational future handed to a vendor without a signature.

1. **Instructions.** If the vendor disappeared tomorrow, could you reproduce this workflow elsewhere from a portable artifact — not from memory, not by re-describing it, but from a versioned document you control?

2. **Memory.** What does this workflow remember about your organization, your preferences, and your past decisions? Where does that memory live — in your systems, or in the vendor's model state?

3. **Identity.** Does this workflow have a name, a version, and a history you can inspect? Or is it just "my prompts" inside a chat window, unversioned and unnamed?

4. **Portability.** Could the same workflow run on a different model without rebuilding from scratch? If the operator switched from ChatGPT to Claude tomorrow, what survives and what starts over?

5. **History.** Can you see exactly what this workflow did six months ago — which inputs it received, which outputs it produced, which decisions it made? Or is the history trapped in a conversation thread you would have to scroll through to reconstruct?

It is the same audit a buyer would run on any critical vendor relationship: can I leave, and what do I lose if I do? The difference is that with a SaaS product, the question is obvious — there is a contract, a vendor name, a line item on the budget. With an AI workflow, the question does not occur to most operators until the switching cost is already real, because nothing was ever purchased and no contract was ever signed. The workflow just lives where it was born, and by the time the operator notices, the operational future built on top of it is not portable.

The apps are dying because the workflow is better. That part is true, and the market is repricing accordingly. The part that has not been priced in is that the workflow's new home is worse than the app's old home — more opaque, less portable, harder to leave. The operators who come out ahead will be the ones who separate what the agent knows from where it runs, before forty workflows deep makes the question theoretical.
