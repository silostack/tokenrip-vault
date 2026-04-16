---
title: "Better Harness: A Recipe for Harness Hill-Climbing with Evals"
source: "https://x.com/vtrivedy10/status/2041927488918413589"
author:
  - "@vtrivedy10"
published: 2026-04-08
tags:
  - "clippings"
---

**TL;DR:** We can build better agents by building better harnesses. But to autonomously build a "better" harness, we need a strong learning signal to "hill-climb" on. We share how we use evals as that signal, plus design decisions that help our agent **generalize** instead of **overfit.** Better-Harness is a prototype system for iteratively sourcing and improving your harness with evals.

## Evals are training data for Agents

In classical machine learning, training data guides the model's learning process. Each training example contributes a gradient that updates the model's weights toward "correctness." We have a similar learning loop for agents.

**harness + evals + harness engineering → better agent**

Evals encode the behavior we want our agent to exhibit in production. They're the "training data" for harness engineering. Each eval case contributes a signal like "did the agent take the right action" or "produce the right outcome?" That signal guides the next proposed edit to the harness.

## Sourcing good evals

Evals are the foundation that power the harness hill-climbing process. Practical ways to source them: hand-curated examples, production traces mined for failures, and external datasets curated for desired behaviors. Tag everything to behavioral categories for meaningful holdout sets and targeted experiments.
