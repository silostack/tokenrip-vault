# UI Surface Infrastructure

**Status**: developing
**Created**: 2026-05-25
**Last touched**: 2026-05-25

## Thesis

Any AI generates the UI against a documented Tokenrip API. Tokenrip hosts it at a stable URL. The artifact underneath persists. One primitive — render runtime + open SDK + AI-readable spec — serves operator-pull (teacher), customer-pull (Luai), creator-pull (Lenny), and internal substrate (demand-scout Gap B) concurrently.

## Evolution

- **2026-05-21**: [[custom-interfaces-on-artifacts-thesis]] proposes custom UIs as creator-distributed visual moat. Three phases: hand-code → templating → AI-generation. Defensibility argument relies on "competitors structurally cannot copy" + "9 years like Zapier-Canvas."

- **2026-05-25**: Simon brings the doc back to bean session with three signals (Reddit teacher, Luai proposal, generative-UI category research). Bean proposes internal "Renderers" library; Simon kills it as not-scaling. He reframes: AI generates the UI against an open Tokenrip SDK; we host it; the artifact persists. Phasing collapses (AI-gen from day one). Protagonist set expands beyond creators (operator-pull, customer-pull, internal-substrate). Defensibility shifts from "UI hard to copy" to "artifact substrate is the moat; UI just makes it legible." Architecture clarifies: 3 components (artifact substrate exists, AI-readable spec is new, render runtime is new). Naming candidate: Surfaces.

## Key Challenges Surfaced

- **Component library doesn't scale.** Components are too custom to underlying artifacts; library = explosion of one-offs. Resolution: no library — AI generates the UI; substrate hosts the result. (May add a small data-heavy-pattern library in v3+, not before.)
- **Sandboxing is the hidden v1 cost.** Arbitrary HTML at a Tokenrip URL is XSS / phishing / cookie-theft surface. Mitigations: isolated subdomain, strict CSP, SDK-only auth-bearing channel. Solvable but not zero work. Underestimated risk.
- **Defensibility argument from original thesis was too strong.** "9 years like Zapier-Canvas" is wrong — Claude Skills, MCP, Cowork are Anthropic and OpenAI experimenting with brand-surface concession piecemeal. Window is real but 12–18 months, not 9 years. Resolution: relocate the moat from "UI hard to copy" to "artifact substrate underneath is what nobody can hand-build in 6 months." Sharper, more honest, still defensible.
- **Schema awareness is the AI's hardest problem.** AI needs to know what's in an artifact to generate UI against it. v1 = opaque JSON (AI infers shape); v2 = declared schemas; v3 = MOA-built schemas constrain both artifact and UI. Sequence is right; v1 punt is acceptable.

## Open Questions

- Will any AI generate clean code against the for-AI spec on first attempt? (Spec-readability test, weekend-sized.)
- HTML vs JSX in v1? Both? Auto-detect? JSX needs Babel-standalone in iframe.
- AG-UI / CopilotKit protocol adoption — early or wait for convergence?
- Custom domains as premium tier — when, what price point?
- Forking semantics — can operator fork a creator's surface? Data-binding consequences?
- Pricing tier abuse limits on the operator-pull free tier?

## Non-Obvious Connections

- **AI as customer of documentation.** The `for-AI` spec doc is the most important piece of marketing copy in the product — it's the spec every AI uses to learn how to target Tokenrip. Optimizing it pays for itself across every AI integration. Inverts the traditional "docs for humans, code for machines" — here, docs are primarily for machines and humans only consume them indirectly through their AI. (Related to existing insight: "agent communication dynamics invert human assumptions" — but specifically about *documentation* as the on-the-wire protocol to AIs.)

- **Render runtime as substrate position underneath generative-UI generators.** v0, Thesys, Lovable, CopilotKit all fuse some combination of generation + rendering + (no) persistence. Tokenrip separates: AI generates upstream, we host downstream, artifact persists below. The decomposition IS the position. Same structural pattern as [[mounted-agent-model]] separating cognition + context + execution — applied to the UI stack instead of the agent stack. Recursive decomposition signature.

- **Internal-substrate motion eliminates a permanent debt.** Every imprint today pays a "hand-code a dashboard" tax. Surfaces lets the brain generate its own dashboard. This isn't a feature — it removes a recurring engineering cost. May be the strongest internal argument for prioritizing the build, distinct from the marketing argument (operator-pull) and the revenue argument (customer-pull). Connects to Gap B in `tokenrip-vault/active/demand-scout-agent-requirements-2026-05-19.md`.

- **The teacher and the demand-scout are the same structural problem.** Both want: "AI-generated UI bound to data that doesn't disappear, at a URL I can return to." Wildly different user populations (non-technical teacher vs. Simon's morning bidding workflow); identical primitive serves both. This is the architectural pattern that defines whether the substrate thesis is real — if one primitive cleanly serves both, the substrate exists; if not, you have two products in a trench coat.

- **Decomposition as positioning weapon, applied to UI layer.** The 2026-04-30 insight (mounted-agent synthesis) said: when a category pattern fuses things that don't have to be fused, the contrarian product separates them and the *separation itself* is the story. Applied here: generative-UI category fuses generation + hosting + (often no) persistence. Tokenrip Surfaces separates all three. Same play, different stack layer.

- **Existing artifact as pitch surface, mass-market version.** Every Claude artifact in someone's chat history is "an existing artifact." Every Cowork session that disappeared is "existing pain." The Reddit teacher already invested 3 days in her lesson plan template. The pitch points at a specific artifact she already made. Same move as [[audience-led-deployment]] / "let me turn that specific tweet thread into a product" — but the audience is everyone-who-uses-AI, not creators-with-followings.
