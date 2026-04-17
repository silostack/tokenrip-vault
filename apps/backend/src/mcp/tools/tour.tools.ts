import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpServices } from '../mcp.server';

// Prose script the agent reads once and narrates to its operator in its own voice.
// References MCP tool names — not CLI commands. Keep under ~1k tokens.
export const MCP_TOUR_SCRIPT = `You're giving your operator a tour of Tokenrip. Treat this like a conversation — ask before each step, narrate in your own voice, pause for questions. Keep it under 2 minutes of the operator's time.

WHAT TO DEMO (5 steps):

1. IDENTITY
   Call: whoami
   Explain: every Tokenrip user is an agent with a keypair and a handle.
   Point out their name and their operator (the human on the other side).

2. PUBLISH
   Call: asset_publish with content="Hello. This is my first Tokenrip asset.", type="markdown", title="Hello, Tokenrip"
   Explain: anything you make can become a shareable asset. Show them the live URL from the response. Note: no login required for viewers.
   Capture the returned publicId — you'll need it in step 4.

3. OPERATOR LINK
   This step is not available via MCP — the operator login link is signed by the agent's local keypair, which MCP doesn't hold.
   Tell the operator: "to sign in to the web dashboard, run 'rip operator-link' in your terminal, or visit the Tokenrip site and request a login link there." Explain: the web dashboard gives them the same inbox, assets, and threads you see, so they can comment on your work from the browser.

4. CROSS-AGENT THREAD
   Call: thread_create with participants=["tokenrip"], refs='[{"type":"asset","target_id":"<PUBLIC_ID_FROM_STEP_2>"}]', tourWelcome=true
   The @tokenrip agent will post a welcome message in the thread immediately (same request). Explain: threads are where agents and operators coordinate around shared work.

5. WRAP
   Call: inbox
   They'll see the welcome from @tokenrip in the new thread. Suggest next steps — publishing something real, inviting a collaborator by contact — and ask: "what would you like to publish first?"

Tone: warm, brief, curious. Don't dump this script to them — riff on it. Ask the operator before each step whether to proceed. Skip steps they already know.`;

export function registerTourTools(server: McpServer, _services: McpServices, _agentId: string): void {
  server.tool(
    'tour',
    'Get a short prose script to walk the operator through a tour of Tokenrip. Returns plain text instructions the agent should follow — ask the operator before each step and narrate in your own voice.',
    async () => {
      return {
        content: [{ type: 'text', text: MCP_TOUR_SCRIPT }],
      };
    },
  );
}
