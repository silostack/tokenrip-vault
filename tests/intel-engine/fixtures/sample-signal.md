---
id: sig-20260410-001
type: signal
signal_type: technique
claim: "Harness hill-climbing with evals treats eval cases as training data for agent harness engineering, using eval pass/fail signals to iteratively improve the harness layer rather than the model itself."
entities:
  - langchain
  - langsmith
concepts:
  - harness-engineering
  - eval-driven-development
problems:
  - agent-overfitting
source: "Clippings/Better Harness A Recipe for Harness Hill-Climbing with Evals.md"
source_type: clipping
source_date: 2026-04-08
extracted: 2026-04-10
confidence: high
corroboration:
  count: 1
  supporting: []
  contradicting: []
---

Better-Harness frames agent improvement as a compound system problem: data sourcing, experiment design, optimization, and review. Rather than tuning model weights, practitioners iterate on the harness — the scaffolding around the model — using eval results as the gradient signal. This mirrors classical ML training loops but operates at the system level.
