# Distribution Experiment Framework

**Status**: developing
**Created**: 2026-04-23
**Last touched**: 2026-04-23

## Thesis

Distribution experiments should be designed so the distribution mechanism IS the product in use. Instead of marketing about Tokenrip, create Tokenrip artifacts that people interact with directly. The product spreads through usage, not through messaging about usage.

## Evolution

- **2026-04-23**: Originated from organizing a distribution game plan. Started with a braindump of channels (Twitter, Reddit, influencers, LinkedIn, Moltbook, recipes). Key insight emerged: there are two categories of distribution — Tokenrip-native (the product IS the distribution) and standard SaaS (marketing about the product). Category A compounds, Category B is linear. This reframed the entire approach.

  Three approaches identified: recipe-driven (tutorial → install), experience-driven (interact → want → install), and problem-first (pain → solution → install). Converged on experience-driven as primary with recipes as conversion tail and problem-first as the push mechanism.

  Designed "Content Amplifier" workflow (Workflow 2) in detail: scout tweets with artifact potential → draft actionable artifact (skill/template/prompt) → editorial review via Tokenrip thread → publish + tweet → measure installs. The workflow runs entirely on Tokenrip (dogfooding). Alek operates as editorial gatekeeper — his role is judgment, not system design.

  Key realization: the system that runs distribution experiments IS the product's first real agentic workflow. Friction encountered while running it = product roadmap. Workflow patterns discovered = publishable recipes.

## Key Challenges Surfaced

- **Zero-follower Twitter account** — can't rely on Twitter algorithm for reach. Reddit and Discord are primary channels, Twitter is supplementary. Resolved: use community posting as primary distribution, let Twitter build organically.
- **Quality control with non-technical operator** — Alek running experiments without systematic quality gates produces unreadable signal. Resolved: three-question quality rubric (works? stands alone? install path obvious?) and Tokenrip thread-based review process.
- **Distinguishing format failure from topic failure** — if live threads get no engagement, is the format wrong or were the topics bad? Partially resolved: topics must be inserted into conversations already happening, not pre-planned.

## Open Questions

- How does the automated scout replace manual picks in Week 2+? What does it train on?
- What's the actual conversion rate from Tokenrip page view to CLI install? No data yet.
- Workflow 1 (live agent threads) and Workflow 3 (recipe SEO) still need detailed design.
- Which Reddit communities have the highest density of agent platform users?

## Non-Obvious Connections

- **Alek as first non-technical power user** — his friction IS the product feedback. Every point where he gets stuck is a point future users will get stuck.
- **The Amplifier skill as self-improving tool** — the skill that produces distribution content is itself a Tokenrip asset that both agents iterate on. The tool improves through use, on the platform.
- **Distribution experiments as workflow case studies** — each experiment becomes a publishable recipe. The experiment and the content it produces are the same thing.
