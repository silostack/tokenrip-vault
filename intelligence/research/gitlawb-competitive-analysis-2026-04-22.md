# gitlawb — Competitive Intelligence

**Research Date:** 2026-04-22
**Depth Level:** Deep dive
**Researcher:** Claude (Strategic Business Coach)
**Trigger:** Proactive research — gitlawb claims to be "the collaboration layer for AI agents," directly overlapping with Tokenrip's positioning

---

## Executive Summary

gitlawb is a decentralized git platform for AI agents — a federated, agent-native GitHub replacement built on IPFS, libp2p, DIDs, and UCAN. Version 0.1.0-alpha, live network, three nodes running. Their headline claim ("Build the collaboration layer for AI agents") occupies the same vocabulary as Tokenrip but targets a different primitive: code repositories and git workflows, not content assets and publishing.

The technical foundation is serious. The network is tiny. The token layer is a distraction. Their first monetization product — a $9/month crypto trading agent — signals they have not yet found product-market fit for the infrastructure layer. Their content strategy (technical journal) and MCP-first distribution are betting on the same mechanisms as Tokenrip.

**Threat level to Tokenrip: Medium.** Not a direct product competitor today — different primitive (repos vs. assets). Material positioning risk in the near term, as both products are racing to define "agentic collaboration" before the vocabulary settles.

---

## Product Stack

| Layer | Product | Status |
|-------|---------|--------|
| Protocol | gitlawb-core (Rust, IPFS, libp2p, DIDs, UCAN) | Shipped |
| Tooling | CLI (`gl`), MCP server (15 tools), TypeScript SDK | Shipped |
| Hosted | Playground — app generation + publishing at playground.gitlawb.com | Live alpha |
| Monetized | Spawn — $9/month crypto trading agent (Polymarket paper trades) | Alpha, paper trading only |

---

## Technical Architecture

- **Core daemon**: Rust + rust-libp2p + axum
- **Identity**: DIDs (did:key, did:web, did:gitlawb) + HTTP Signatures (RFC 9421) + UCAN capability tokens
- **Storage**: IPFS via Pinata (hot) → Filecoin (warm) → Arweave (permanent)
- **Networking**: libp2p DHT peer discovery + Gossipsub event propagation
- **Agent protocol**: MCP server (15 tools), JSON-LD/Hydra REST, GraphQL subscriptions
- **Naming/token**: Solidity registry on Base L2
- **Web**: Next.js thin client over local node API

**No accounts, no API keys.** Every actor (human or agent) is an Ed25519 keypair. Every API request is signed via HTTP Signatures (RFC 9421). Authentication is the signature — stateless, verifiable by any node. This is their strongest UX differentiator.

**Live network stats (as of 2026-04-22):** 3 nodes (2x US, 1x Japan), ~1,923 repos, ~1,547 registered agents, ~837 pushes.

---

## Token ($GITLAWB)

Deployed on Base L2 (contract: `0x5F980Dcfc4c0fa3911554cf5ab288ed0eb13DBa3`).

**Node staking tiers:**
| Tier | Min stake | Rights |
|------|-----------|--------|
| Observer | 0 | Read-only: clone, pull, subscribe |
| Light node | 1,000 $GITLAWB | Serve read traffic, DHT participation, uptime rewards |
| Full node | 10,000 $GITLAWB | Accept push writes, issue ref-update certificates, storage + uptime rewards |
| Validator | 100,000 $GITLAWB | Co-sign governance, slashing adjudication, priority rewards |

Additional mechanics: slashing for bad behavior, storage rewards for Filecoin deal maintenance, repo tokenization via bankr.bot integration, agent-to-agent bounties via GitlawbBounties.sol, stake-weighted governance (7-day voting cycles on Base).

---

## MCP Tool Surface

15 tools exposed per node (homepage inconsistently lists 25 — see weaknesses):

`gitlawb_list_repos`, `gitlawb_get_repo`, `gitlawb_read_file`, `gitlawb_list_commits`, `gitlawb_diff`, `gitlawb_create_issue`, `gitlawb_list_issues`, `gitlawb_comment_issue`, `gitlawb_open_pr`, `gitlawb_get_pr`, `gitlawb_review_pr`, `gitlawb_search_code`, `gitlawb_run_task`, `gitlawb_list_agents`, `gitlawb_delegate`

GraphQL subscriptions (real-time events): CommitPushed, PullRequestOpened, PullRequestMerged, IssueOpened, IssueClosed, ReviewSubmitted, TaskBroadcast, AgentJoined, RefUpdated.

---

## Content Strategy (Journal)

6 posts published March–April 2026:

| Date | Type | Title |
|------|------|-------|
| 2026-04-20 | Thesis | "Agents deserve identity." — OAuth is broken for agents |
| 2026-03-30 | Product | "Bounties — how AI agents earn on gitlawb." |
| 2026-03-23 | Product | "MiroClaw — the prediction engine that rewrites itself." |
| 2026-03-20 | Holders | "Proof of Hold — what it means to be a $GITLAWB holder." |
| 2026-03-16 | Vision | "If you can imagine it, you can build it." — Playground intro |
| 2026-03-15 | Strategy | "Master Plan." — four phase roadmap |

3 additional posts announced ("coming soon"): HTTP Signatures deep-dive, git objects on IPFS, UCAN tokens. Technical depth, developer-facing, SEO-optimized for long-tail agentic infrastructure queries. Same distribution bet as Tokenrip's Intelligence Engine.

---

## Weaknesses

**1. Spawn reveals a monetization crisis.** Their first paid product is a $9/month crypto trading agent that does Polymarket paper trades. The connection to "decentralized git for AI agents" is tenuous — this is a crypto novelty product bolted onto an infrastructure story. Classic sign of infrastructure with no clear revenue path.

**2. Tool count inconsistency.** Homepage says "25 tools" on the MCP server. Agents page lists and names exactly 15. Either docs are stale or features were pulled. Either way, it's messy for a developer-trust product.

**3. Token layer adds friction, not value for developers.** Staking requirements to run a full node, slashing risks, 7-day governance voting cycles — this is speculator/investor territory grafted onto a developer infrastructure story. Developers who want to run a node shouldn't need to understand tokenomics.

**4. Network is genuinely tiny.** 3 nodes, ~1,900 repos. The "live multi-node network" framing is ambitious for what is effectively a dev testnet. Federation and decentralization claims don't have critical mass yet.

**5. Phase 3 (Collaboration) is still partial.** Agent task delegation and GraphQL subscriptions are listed as unshipped on the roadmap. The most compelling multi-agent features — the ones that differentiate gitlawb from a decentralized GitHub — are aspirational.

**6. bankr.bot repo tokenization conflates audiences.** The pitch that "token holders become stakeholders in the project" and "agents contributing merged code earn fractions automatically" is crypto-native language in a developer infrastructure product. Alienates non-crypto builders.

---

## Strengths

**1. Deep, standards-based technical moat.** UCAN + DIDs + HTTP Signatures + IPFS is a real primitive stack built on standards (RFC 9421, W3C DID spec, IETF UCAN). Not hand-waving. If they execute fully, the foundation is defensible.

**2. MCP-first is the correct distribution bet.** Claude Code is their explicit quickstart target (claude_desktop_config.json in Step 3 of their quickstart guide). This is the same beachhead Tokenrip chose. Both are right.

**3. "No signup required" is a genuine UX win.** Identity-as-keypair removes the highest-friction onboarding step. This is memorable, differentiated, and architecturally correct for agent-native infrastructure.

**4. Open source from day one.** OpenClaude on GitHub gives developers something to inspect before committing to the platform. Builds trust faster than a closed product.

**5. Technical journal will compound.** "Why we replaced API keys with Ed25519 HTTP Signatures," "Git objects on IPFS — the content-addressing story," "UCAN tokens: delegatable access control" — these will rank for developer-specific queries over time. Slow-burn distribution flywheel.

**6. Inter-agent delegation is a real primitive.** `gitlawb_delegate` issuing UCAN capability tokens to other agents (e.g., "push to ci/* only" with expiry and revocation) is genuinely novel. No other platform has this as a shipped feature.

---

## Threat Assessment by Tokenrip Layer

| Tokenrip Layer | Threat Level | Rationale |
|---------------|--------------|-----------|
| **Layer 1 (Asset Publishing)** | Low | gitlawb publishes *code*. Tokenrip publishes *content assets*. Different primitive. |
| **Layer 2 (Collaboration / Versioning)** | Low-Medium | gitlawb has git-native versioning and PRs for code artifacts. If extended to non-code assets, this converges. Watch Phase 5+ roadmap. |
| **Layer 3 (Agent Runtime / Coordination)** | Medium | Both platforms position agents as first-class citizens with identity, trust scores, and delegation. The underlying coordination primitives are adjacent. |
| **Positioning / Vocabulary** | High | gitlawb uses "collaboration layer for AI agents" language. First mover on vocabulary in developer circles risks anchoring the definition toward git workflows, not content assets. |
| **Distribution (MCP + content)** | Medium | Both are betting on MCP adoption and technical blog content for the same Claude Code audience. Competitive for attention, not for product. |

---

## Strategic Implications for Tokenrip

**These are not the same product — today.** gitlawb owns the code repository layer; Tokenrip owns the content/asset publishing layer. An agent could plausibly use both: push code on gitlawb, publish intelligence assets on Tokenrip. Complementarity is real.

**The convergence risk is real — tomorrow.** gitlawb's roadmap (Phase 5+: TypeScript + Python SDKs, production hardening, broader asset types) and the Playground product (generate apps, publish, get traffic) suggest they are moving toward general content publishing, not just git workflows. If Playground evolves into "publish any agent output," the product definitions converge.

**The token is Tokenrip's distribution advantage right now.** Gitlawb's staking model requires developers to buy and hold $GITLAWB to participate as full nodes. Tokenrip having no token means zero onboarding friction for developers who want to use the platform. This is an underappreciated asymmetry.

**Spawn signals the hardest question.** If gitlawb's first monetized product is a $9/month crypto trading agent, they haven't solved "how does infrastructure become revenue?" Tokenrip faces exactly the same question. The answer isn't to bolt on a novelty product — it's to find the use case where the infrastructure becomes load-bearing for something valuable.

**The "no signup" framing is a positioning benchmark.** Gitlawb's zero-friction identity story is memorable and technically correct. What is Tokenrip's equivalent? If Tokenrip's onboarding requires account creation or API key management, that's a gap worth naming explicitly and closing.

---

## Tripwire Signals

| Signal | Implication |
|--------|-------------|
| Playground evolves beyond code apps to general content publishing | Layer 1 threat activates — gitlawb enters Tokenrip's asset publishing space |
| gitlawb announces non-code asset types (documents, datasets, reports) | Direct Layer 1 competition |
| MCP tool count grows and stabilizes (resolves 15 vs 25 inconsistency) | Execution maturity signal — take them more seriously as developer infrastructure |
| Network grows beyond 10 nodes or 10,000 repos | Federation claims become real — distribution moat strengthens |
| Spawn pivots from trading agent to general agent hosting | Direct competition for Tokenrip's agent runtime layer |
| gitlawb raises a seed or Series A round | Execution acceleration — watch for team expansion into content/asset layer |
| bankr.bot repo tokenization gets real traction | Their crypto-native audience becomes a locked-in segment; Tokenrip needs non-crypto narrative |
| Any major AI company (Anthropic, OpenAI) endorses the gitlawb MCP server | Distribution inflection — same risk as Tokenrip's CLI adoption race |
| gitlawb publishes a UCAN or DID interoperability spec | Standards play — could become the de facto identity layer for agent platforms broadly |

---

## Partner Angle

Possible but not urgent. gitlawb could be a complementary layer in an agent stack: gitlawb manages code repositories and git workflows; Tokenrip manages knowledge assets, content publishing, and collaboration on non-code outputs. The DID identity layer (did:gitlawb) could theoretically be used by Tokenrip to identify agents without building its own identity infrastructure. Not worth pursuing until both products have live users and the natural integration surface becomes visible.
