---
post: agent-native-crm
created: 2026-04-29
post_type: craft
angle: "Step-by-step walkthrough of building a full agent-native CRM from primitives in one working session. Two collections, six instruction assets, a bootloader command, and onboarding via messaging."
keywords: [agent-native CRM, AI CRM, agent operations, agentic workflow, building with agents]
---

# Sources — We Built an Agent CRM in One Session

## Primary Sources (provided)

### Engagement Agent Design Document
- **URL:** provided directly (active/engagement-agent-design.md)
- **Type:** internal_design_doc
- **Captured:** 2026-04-29
- **Key content:** Complete architecture spec for the engagement agent: bootloader pattern, four modes (ingest/draft/outreach/send), two collections with typed schemas, seven published assets, engagement tier classification system, daily workflow, build checklist.

### Engagement Agent Full Reference
- **URL:** provided directly (active/engagement-agent-full-reference.md)
- **Type:** internal_reference
- **Captured:** 2026-04-29
- **Key content:** Asset registry with IDs and aliases, collection schemas with column types, architecture diagram showing local command → Tokenrip assets → collections → AgentMail flow, credential configuration, status progressions.

### Engagement Agent Bootloader Command
- **URL:** provided directly (.claude/commands/engagement.md)
- **Type:** source_code
- **Captured:** 2026-04-29
- **Key content:** The actual 33-line bootloader command: config section (API key, inbox, batch size), routing logic (mode → asset fetch), mode help display.

## Primary Sources (researched)

### SaaStr — Which CRM Should You Use in 2026/2027? Follow the Agents
- **URL:** https://www.saastr.com/which-crm-should-you-use-in-2026-2027-follow-the-agents/
- **Type:** blog_post
- **Captured:** 2026-04-29
- **Key content:** Jason Lemkin's thesis: CRM decision is now an AI infrastructure decision. Salesforce deployed 20+ agents. Agent deployment creates switching costs: "At 2-3 agents, switching CRMs is annoying. At 10, it's expensive. At 20, it's functionally impossible." Agentforce on warm CRM contacts achieved 72% open rate vs cold email's 2-4%.

### Six and Flow — Enterprise CRM Implementation Guide 2026
- **URL:** https://www.sixandflow.com/marketing-blog/enterprise-crm-implementation-services-a-2026-guide
- **Type:** blog_post
- **Captured:** 2026-04-29
- **Key content:** HubSpot enterprise implementation: 3-6 months. Mid-market: 8-12 weeks. Multi-hub with integrations: 12-16 weeks. Key bottleneck: data migration, business process mapping, stakeholder availability.

### folk — AI-Native CRM Guide and Best Tools in 2026
- **URL:** https://www.folk.app/articles/ai-native-crm
- **Type:** blog_post
- **Captured:** 2026-04-29
- **Key content:** Overview of AI-native CRM platforms in 2026. Still SaaS products with dashboards, but designed for agent-driven workflows.
