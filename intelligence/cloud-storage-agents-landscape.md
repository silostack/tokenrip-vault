# Cloud Storage & Artifact Sharing for AI Agents: Landscape Analysis

**Date:** 2026-03-28
**Status:** Research complete
**Tags:** #theme/agentic #research

---

## Executive Summary

A distinct "storage for agents" category is crystallizing in 2026. The problem is clear: agent runtimes (E2B, Manus, ChatGPT Code Interpreter) are ephemeral — files vanish when sandboxes recycle. Meanwhile, agents increasingly generate artifacts (charts, reports, code, data) that need to persist and be shared with humans or other agents. Several startups and frameworks are attacking this from different angles: purpose-built agent storage (AgentDrive, Fast.io), artifact packaging/sharing (MCPH), agent filesystems (Turso AgentFS), framework-level artifact services (Google ADK), and inter-agent protocols with artifact exchange built in (A2A).

The space is early. No dominant winner has emerged. Most solutions launched in late 2025 or early 2026. MCP (Model Context Protocol) is the common integration surface — nearly every product ships an MCP server.

---

## Category 1: Purpose-Built Cloud Storage for Agents

### AgentDrive
- **URL:** [getagentdrive.com](https://www.getagentdrive.com/)
- **What it does:** Persistent file storage designed specifically for AI agents. One API call provisions a "drive" — agent gets an API key and claim URL instantly. No account needed upfront. Agent saves files (any format) via REST API or MCP. Human claims the drive via a link and reviews files in a dashboard.
- **Key differentiator:** Zero-setup provisioning. Agent can self-provision without human approval. "Claim URL" model — agent shares link, human claims the drive.
- **Agent interaction:** REST API + MCP server (14 tools). Works with Claude, ChatGPT, Cursor, any MCP client. Framework-agnostic (LangChain, CrewAI, AutoGen, Google ADK, raw HTTP).
- **Artifact sharing:** Agent gets a claim URL to share with humans. Humans access via dashboard. File-level download links.
- **Pricing:** Free: 1 GB storage, 10K API calls/mo, 3 drives. Pro: $19/mo (100 GB, 100K calls, unlimited drives). Team: $79/mo (1 TB, 1M calls).
- **Traction:** New (2026). Based in SF. Clean product positioning, directly addresses E2B/Manus/ChatGPT file ephemerality.
- **Assessment:** Most focused "cloud storage for agents" play. Simple, developer-friendly. The claim URL model is clever for agent-to-human handoff.

### Fast.io
- **URL:** [fast.io](https://fast.io/)
- **What it does:** Content workspace platform repositioned for AI agents. Provides persistent workspaces where agents and humans share files. Full API, MCP server (251 tools), CLI. Built-in RAG indexing, file previews, sharing links, ownership transfer.
- **Key differentiator:** Most feature-rich. Combines Dropbox-like team storage with agent-first features: RAG queries, AI auto-summary, agent-to-human handoff, file locking for multi-agent access.
- **Agent interaction:** MCP server, REST API, CLI. Agents can autonomously sign up and provision storage. Supports Claude, OpenAI, Cursor, Gemini, OpenClaw.
- **Artifact sharing:** Shareable links with configurable expiration. Workspace sharing with permissions. Portals for client delivery.
- **Pricing:** Free Agent Plan: 50 GB, 5K credits/mo, 3 workspaces. Professional: $10/mo (1 TB, 100K credits, 25 seats). Business: $24/mo (5 TB, 240K credits, 100 seats). Extremely competitive vs. Dropbox/Box.
- **Traction:** Actively publishing content (blog, guides, comparison pages). Positioning against Dropbox/Box/Google Drive. MCP-native approach.
- **Assessment:** Broad play — team collaboration platform with agent features bolted on. More enterprise-oriented than AgentDrive. Risk: trying to be everything (team storage + agent storage + RAG + media engine).

---

## Category 2: Artifact Packaging & Sharing

### MCPH (dead)
- **URL:** [mcph.io](https://www.mcph.io/)
- **What it does:** AI artifact storage and sharing via "crates." Users save artifacts from Claude or ChatGPT with one command, get a permanent shareable link. Recipients view without needing an account. Open source (MIT), self-hostable.
- **Key differentiator:** Simplest possible model — save from chat, get a link. Works directly inside Claude and ChatGPT Pro+. No infrastructure, no API integration needed.
- **Agent interaction:** MCP server. Agent says "save this as my-recipe" and MCPH generates a link (mcph.io/crate/abc123).
- **Artifact sharing:** Public URLs. No login needed to view. AES-256 encrypted storage.
- **Pricing:** Free: 10 MB file size, 500 MB total, 10 shared crates. Pro: coming soon (100 MB files, 10 GB storage, 100 crates, API access).
- **Traction:** Early stage. Open source on GitHub. First-100-users promo (3 months free Pro).
- **Assessment:** Lightest-weight solution. Ideal for individual users sharing AI outputs, not for production agent infrastructure. Think "pastebin for AI artifacts."

### Claude Artifacts (Anthropic)
- **URL:** [claude.ai](https://claude.ai)
- **What it does:** Side-panel in Claude.ai that displays substantial AI-generated content (code, documents, React components, visualizations). Can be published as shareable links. New in 2025-2026: artifacts can run their own prompts via `window.claude.complete()` API, turning artifacts into AI-powered apps.
- **Key differentiator:** Native to Claude. Artifact apps can call Claude API (billed to the viewer's account). Remix capability — viewers can fork and modify.
- **Artifact sharing:** Publish button generates a public link. No account needed to view. Account needed to remix.
- **Limitations:** Not available via API — Claude Artifacts are a web UI feature only. Cannot be programmatically created by headless agents. No file upload/download beyond the chat context. Not a storage solution.
- **Assessment:** Pioneered the concept of "artifacts" in AI. Important for framing, but not a storage/infrastructure play. The "artifact as app" direction is interesting but tangential to agent storage needs.

### OpenAI Code Interpreter / File Storage
- **What it does:** Code Interpreter runs in sandboxed containers. Can generate files (charts, CSVs, images). Files are temporary — tied to the session/run context. Assistants API supports up to 2.5 TB file storage for uploaded files and file search.
- **Artifact sharing:** Generated files are available via download links during the session. Links expire. No permanent storage for Code Interpreter outputs. Uploaded files for Assistants/File Search persist longer.
- **Limitations:** Container files are ephemeral. Community complaints about difficulty retrieving Code Interpreter outputs reliably. No built-in shareable links for generated artifacts.
- **Assessment:** OpenAI has file infrastructure but it's designed for input (RAG, file search), not output persistence. The Code Interpreter output ephemerality is a known pain point — exactly the gap AgentDrive and MCPH address.

---

## Category 3: Agent Filesystem Abstractions

### Turso AgentFS
- **URL:** [github.com/tursodatabase/agentfs](https://github.com/tursodatabase/agentfs)
- **What it does:** SQLite-backed filesystem abstraction for AI agents. Everything an agent does — files created, state stored, tools invoked — lives in a single SQLite database file. Provides: POSIX-like virtual filesystem, key-value store for agent state, tool call audit trail.
- **Key differentiator:** Single-file portability. Copy one SQLite file = snapshot entire agent state. SQL-queryable audit trail. FUSE mount support (mount as real POSIX filesystem on Linux). Copy-on-write isolation.
- **Agent interaction:** TypeScript and Rust SDKs (Python coming). Integrates with Mastra and other agent frameworks.
- **Artifact sharing:** Not a sharing solution per se — it's a local/cloud filesystem for agent state. Sharing would require wrapping with a web layer. Can sync to object storage via Turso's sync protocol.
- **Pricing:** Open source SDK. Turso cloud pricing for sync/hosting.
- **Traction:** Backed by Turso (established SQLite cloud company). Active development since Nov 2025. FUSE, overlay filesystem, bash integration all shipped.
- **Assessment:** Infrastructure-level solution for agent state management, not end-user artifact sharing. Strong for developers building agent platforms who need reproducibility, auditability, and portability. Complementary to sharing solutions like AgentDrive.

---

## Category 4: Agent Platforms with Built-In File Management

### E2B (Cloud Sandboxes)
- **URL:** [e2b.dev](https://e2b.dev)
- **What it does:** Open-source secure cloud sandboxes for AI agents. Each sandbox is an isolated VM where agents execute code. Full file system within sandbox. Cloud storage bucket mounting (S3, GCS, R2) via FUSE. Artifact callbacks for charts/visualizations.
- **File persistence:** Sandboxes expire (24h default, 14 days for paid). Files vanish on expiry. Can mount external buckets for persistence. Artifacts (matplotlib charts etc.) available via callbacks during execution.
- **Pricing:** Usage-based. Free tier available. Pay per sandbox-second.
- **Traction:** Major adoption. Used by Manus (the viral agent product). Well-funded, growing ecosystem.
- **Assessment:** E2B is the execution layer, not the storage layer. Its ephemerality is precisely the problem that AgentDrive, Fast.io, etc. solve. E2B + AgentDrive is a natural pairing.

### Manus
- **URL:** [manus.im](https://manus.im)
- **What it does:** AI agent platform that allocates a full cloud VM per task. Agent has full filesystem, browser, networking. Uses file system as externalized memory — writes intermediate results to files rather than keeping in context.
- **File sharing:** Two modes: (1) Share — recipients see conversation + output artifacts only, sandbox hidden. (2) Collaborate — real-time shared sandbox access. When sandbox recycles, important files (artifacts, uploads, project files) auto-restore to new sandbox.
- **Assessment:** Demonstrates the "agent needs a filesystem" pattern at scale. Not a storage product — it's a consumer agent product. But its architecture validates the need for persistent agent storage that outlives compute.

### Composio
- **URL:** [composio.dev](https://composio.dev)
- **What it does:** Integration platform connecting LLMs/agents to 500+ apps. Manages auth (OAuth tokens, multi-tenancy), provides sandboxed execution, tool catalog. Not a file storage product — it's the "action layer" connecting agents to external services.
- **Relevance:** Agents can use Composio to interact with cloud storage services (Google Drive, Dropbox, S3) via pre-built integrations. It's the plumbing, not the storage.
- **Assessment:** Complementary infrastructure. Agents could use Composio to save artifacts to any cloud storage service, but Composio doesn't provide the storage itself.

---

## Category 5: Agent Frameworks with Artifact Support

### Google ADK (Agent Development Kit)
- **ArtifactService:** Central component for artifact storage/retrieval. Abstract interface with implementations: `InMemoryArtifactService` (dev/testing) and `GcsArtifactService` (production, Google Cloud Storage).
- **How it works:** Agents save artifacts via the ArtifactService. Framework handles versioning (returns version numbers), scoping (by app, session, user), and secure download link generation for the UI.
- **Sharing:** GCS-backed artifacts get secure temporary download URLs. Organized by app_name/session_id/user_id.
- **Assessment:** Most mature framework-level artifact system. But tied to Google Cloud. The abstraction is clean — other frameworks could adopt similar patterns.

### LangChain
- **File management:** `FileManagementToolkit` provides read/write/list operations with a configurable root directory. Local filesystem by default. Production use requires integrating with cloud storage via Document Loaders (S3, GCS, Azure Blob).
- **Artifact persistence:** No built-in artifact service. Developers must wire up their own storage. Can integrate with Fast.io, AgentDrive, etc. via MCP or custom tools.
- **Assessment:** LangChain provides the primitives but not the persistence layer. This is a feature gap that third-party solutions fill.

### CrewAI / AutoGen
- **File management:** Basic. Agents can use file tools (OpenClaw integration for filesystem access). No built-in artifact storage, versioning, or sharing.
- **Assessment:** Same gap as LangChain — execution frameworks without artifact infrastructure.

---

## Category 6: Agent Memory Platforms (Tangential)

These focus on agent "memory" (facts, embeddings, conversation history) rather than file/blob storage, but are worth noting:

| Platform | Focus | File/Blob Support |
|----------|-------|-------------------|
| **Mem0** | Managed memory layer, graph-based | Memory extraction, not file storage |
| **Zep** | Temporal knowledge graph | Structured data, not files |
| **Letta** | Self-editing memory (core/archival/recall tiers) | Archival memory is searchable text store, not blob |
| **Pieces** | Developer workflow context, MCP server, on-device | Snippet/context storage, not general file storage |
| **Memoria** | "Git for AI agent memory" | Version-controlled memory, not artifacts |

**Assessment:** Memory platforms solve a different problem (what does the agent remember?) vs. artifact storage (what did the agent produce?). The distinction matters. Some overlap in "archival" storage, but memory platforms are not designed for sharing generated files with humans.

---

## Category 7: Inter-Agent Protocols with Artifact Exchange

### A2A (Agent2Agent Protocol)
- **Origin:** Google (April 2025), now Linux Foundation project.
- **Artifact support:** First-class concept. An "artifact" is defined as output generated by an agent as the result of a task, composed of "Parts" (text, file references, structured data). Agents exchange artifacts via the protocol.
- **How it works:** Agent Cards (JSON capability manifests) enable discovery. Agents delegate tasks, exchange messages and artifacts. Artifacts can contain file references, inline data, or structured content.
- **Partners:** 50+ including Atlassian, Box, Salesforce, SAP, PayPal, LangChain.
- **Assessment:** A2A defines the standard for how agents share artifacts with each other. It does not provide storage — agents still need somewhere to put the files that artifacts reference. AgentDrive/Fast.io + A2A is a natural stack.

### MCP (Model Context Protocol)
- **Role:** Defines how agents connect to tools and data sources. Not an artifact protocol per se, but the dominant integration surface for storage tools. Every product in this landscape ships an MCP server.
- **File storage MCP servers:** Multiple exist — filesystem server (official), Google Drive, S3, Fast.io, AgentDrive, MCPH. The MCP ecosystem is the connective tissue.

### ACP (Agent Communication Protocol)
- **Origin:** IBM / BeeAI.
- **Relevance:** Complements A2A for agent communication. Less artifact-specific than A2A.

---

## Category 8: The "Agent Creates, Shares via Link" Workflow

This is the specific use case of: agent generates an artifact (chart, document, image) and shares it with a human via a link in Telegram/Slack/email.

**Current state of the art:**

1. **MCPH** — closest to this exact workflow. Agent saves artifact, gets a permanent link, shares it anywhere. Works today in Claude/ChatGPT.
2. **AgentDrive** — agent saves file, gets a claim URL. Less direct (claim URL vs. direct view link), but persistent.
3. **Fast.io** — agent saves to workspace, generates shareable link with configurable permissions/expiration.
4. **DIY approach** — most production bots today: agent generates file, uploads to S3/Cloudflare R2, generates a pre-signed URL, sends it via Telegram/Slack API. Works but requires custom infrastructure per deployment.
5. **Claude Artifacts** — publish generates a link, but only works within claude.ai, not for headless agents.
6. **Manus** — built-in share button generates a link to task output, but closed ecosystem.

**Gap:** No dominant, universal "generate artifact + get shareable link" primitive exists yet. The DIY approach (S3 + pre-signed URLs) is still the most common in production. Purpose-built solutions are emerging but pre-product-market-fit.

---

## Landscape Map

```
                    SHARING FOCUS
                         |
              MCPH       |      Claude Artifacts
           (crate links) |      (publish links)
                         |
    AgentDrive           |           Manus
    (claim URLs)         |        (share button)
                         |
STORAGE ─────────────────┼──────────────── COMPUTE
FOCUS                    |                  FOCUS
                         |
    Fast.io              |           E2B
    (workspaces)         |        (sandboxes)
                         |
    Turso AgentFS        |        Composio
    (SQLite filesystem)  |      (integrations)
                         |
              Google ADK |
           (ArtifactSvc) |
                         |
                  INFRASTRUCTURE FOCUS
```

---

## Key Observations

1. **The category is real but nascent.** Every product launched in the last 6-12 months. No clear winner. Fragmented across different angles (storage vs. sharing vs. filesystem vs. framework integration).

2. **MCP is the universal integration layer.** Every product ships an MCP server. This is the standard way agents connect to storage. Any new entrant must be MCP-native.

3. **The "claim URL" / "shareable link" pattern is emerging.** AgentDrive's claim URLs, MCPH's crate links, Fast.io's shareable workspace links — all converging on: agent generates content, human accesses via URL. This is the right UX primitive.

4. **Agent-to-agent artifact sharing is handled at the protocol level (A2A), not the storage level.** Storage providers don't need to solve agent-to-agent communication — A2A handles that. Storage providers need to be good backends that A2A artifacts can reference.

5. **The big gap is still the "last mile" to messaging.** None of these solutions natively integrate with Telegram, Slack, WhatsApp, etc. The workflow is: agent generates artifact -> saves to storage -> gets link -> sends link via messaging API. The messaging API step is still DIY. A product that combines artifact storage + messaging delivery would be compelling.

6. **Framework-level artifact support is weak.** Only Google ADK has a proper ArtifactService. LangChain, CrewAI, AutoGen all punt on artifact persistence. This creates opportunity for third-party storage providers.

7. **Memory vs. artifacts is an important distinction.** Mem0/Zep/Letta solve "what does the agent know?" AgentDrive/Fast.io/MCPH solve "what did the agent produce?" Different problems, complementary solutions.

---

## Competitive Positioning Summary

| Solution | Best For | Weakness |
|----------|----------|----------|
| **AgentDrive** | Developers who need simple, agent-first file persistence | New, unproven at scale. No built-in RAG/search. |
| **Fast.io** | Teams wanting full workspace + agent storage | Broad scope = potential lack of focus. Pricing complexity. |
| **MCPH** | Individual users sharing AI chat outputs | Tiny scale limits on free tier. Not production infrastructure. |
| **Turso AgentFS** | Agent platform builders needing auditable state | Not a sharing solution. Requires wrapping for end-user access. |
| **E2B** | Code execution (not storage) | Files are ephemeral by design. Needs a storage layer on top. |
| **Google ADK** | Google Cloud-native agent developers | Tied to GCP. Framework lock-in. |
| **A2A Protocol** | Agent-to-agent artifact exchange standard | Protocol, not product. No storage. Needs backends. |
| **Claude Artifacts** | Consumer AI chat users | Not API-accessible. Not for headless agents. |
| **OpenAI Files** | RAG/file search for assistants | Code Interpreter outputs ephemeral. Not artifact storage. |

---

*Research conducted 2026-03-28. Market moving fast — re-survey in 60 days.*
