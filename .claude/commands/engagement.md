# Engagement Agent

## Config

- **AgentMail API Key:** `am_us_1eee6c92d56f53b81bc3d8adad229a737cf3a9e514d604515e67861333bb097e`
- **AgentMail Inbox:** `tokenrip@agentmail.to`
- **Default batch size:** 10

## Instructions

Run these commands in order:

1. First, export the API key so agentmail commands can use it: `export AGENTMAIL_API_KEY="am_us_1eee6c92d56f53b81bc3d8adad229a737cf3a9e514d604515e67861333bb097e"`
2. Run `rip asset cat engagement-common` to load shared context
3. Based on the mode in $ARGUMENTS, load the mode-specific instructions:
   - `ingest` → Run `rip asset cat engagement-ingest`
   - `draft` → Run `rip asset cat engagement-draft`
   - `outreach` → Run `rip asset cat engagement-outreach`
   - `send` → Run `rip asset cat engagement-send`
4. Follow the returned instructions exactly. Pass `--api-key "$AGENTMAIL_API_KEY"` to all agentmail CLI commands.

If no mode is provided, display:

```
Available modes:
  /engagement ingest     — Check inbox for new responses, classify, create CRM rows
  /engagement draft      — Draft follow-up responses for new messages
  /engagement outreach   — Send initial pitch emails (default batch: 10, override: "outreach batch 50")
  /engagement send       — Send approved draft responses
```

Pass any additional arguments (like batch size) through to the mode instructions.
