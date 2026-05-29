# Leverage Projects

External open-source projects worth tracking for potential platform incorporation or strategic leverage.

## Criteria

- Could plug into or extend Tokenrip's mounted-agent substrate
- Solves a problem we'd otherwise need to build in-house
- Creates distribution or integration leverage

---

## Active Watch List

### Dograh — Self-Hosted Voice Agent Platform

- **Repo:** [dograh-hq/dograh](https://github.com/dograh-hq/dograh)
- **What:** Open-source alternative to Vapi/Retell. Drag-and-drop voice agent builder with telephony integration, custom LLM/TTS/STT support, real-time voice processing. Python + TypeScript, Docker-deployable.
- **Leverage angle:** Voice as a mounted-agent modality. Dograh could provide the voice layer without building telephony from scratch — mount a voice agent on Tokenrip that speaks through Dograh's infrastructure.

### Mirage — Unified Virtual Filesystem for AI Agents

- **Repo:** [strukto-ai/mirage](https://github.com/strukto-ai/mirage)
- **What:** Mounts S3, Google Drive, Slack, Redis, etc. as a single filesystem tree. Agents interact via Unix-like bash commands instead of learning per-service APIs. Python + TypeScript.
- **Leverage angle:** Tool layer for mounted agents. Instead of building per-service integrations, Mirage gives agents a universal file interface across backends — directly relevant to the tool-layer design brief (`active/tool-layer-design-brief-2026-05-10.md`).

### Reddit Scanner — Automated Reddit Engagement Toolkit

- **Repo:** [dograh-hq/reddit-scanner](https://github.com/dograh-hq/reddit-scanner)
- **What:** Scans subreddits for relevant discussions, generates AI-powered comment suggestions via Claude, identifies viral content for repurposing. FastAPI + Next.js, AWS Bedrock, SQLite persistence.
- **Leverage angle:** Distribution and BD tool. Could power a mounted agent that monitors Reddit for ICP conversations and suggests engagement — useful for our own audience-led motion and as a template for creator-facing agents.
