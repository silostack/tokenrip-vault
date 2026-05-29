# Company Research — Flow

## Session Start

Read the operator's request. Extract:
- **Company name** (required)
- **Meeting context** (optional — e.g., "investor call", "pitching mounted agents", "partnership intro")

If the company name is ambiguous (common name, multiple possible matches), ask one clarifying question before searching.

## Phase 1: Check Prior Research

Query the `company-briefs` collection filtering by `company_name` (case-insensitive match).

If a row exists:
- Show the operator the existing brief with its `last_updated` date.
- Ask: "Update this brief, or start fresh?"
- If update: proceed to Phase 2, focusing search on what may have changed.
- If start fresh: proceed to Phase 2 ignoring the prior row.

If no row exists, proceed to Phase 2.

## Phase 2: Research

Execute in order:

1. **Web search** for the company name. Use queries like:
   - `"[company name]"` — general info
   - `"[company name]" funding OR raised OR investors` — funding history
   - `"[company name]" team OR founders OR leadership` — key people
   - If meeting context was provided, add a targeted search: `"[company name]" [relevant topic]`

2. **Fetch the company's main website** (homepage, about page, team page if findable). Extract:
   - What the company does (one-sentence summary)
   - Product or service description
   - Target market / customers
   - Team / leadership names and roles
   - Any stated mission, positioning, or differentiators

3. **Fetch 1-2 additional high-value pages** from search results (e.g., Crunchbase profile, recent news article, blog post) if they add funding, headcount, or recent news not on the main site.

Do not fetch more than 5 URLs total. Diminishing returns after that.

## Phase 3: Synthesize Brief

Produce the brief in this exact structure:

```
# [Company Name] — Meeting Brief

**Prepared:** [date]
**Meeting context:** [context if provided, otherwise "General research"]
**Website:** [URL]

## What They Do
[1-3 sentences. What the company builds or sells, for whom.]

## Key Numbers
- **Founded:** [year or "Unknown"]
- **Headcount:** [approximate or "Unknown"]
- **Funding:** [total raised, last round, key investors — or "Unknown / Bootstrapped"]
- **Stage:** [seed / series A / etc. or "Unknown"]

## Leadership
[Bulleted list of key people with titles. Focus on who the operator might meet.]

## Recent Activity
[1-3 bullets on recent news, product launches, hiring signals, partnerships. If nothing found, say "No recent public activity found."]

## Tokenrip Angle
[If meeting context was provided: 1-2 sentences on how this company connects to what Tokenrip does. If no context: skip this section.]

## Sources
[Bulleted list of URLs used to compile this brief.]
```

Present the brief to the operator. Ask: "Anything to add or correct before I save this?"

## Phase 4: Record

After operator approval (or if they say nothing needs changing), write to the `company-briefs` collection:

Call `agent_record` with collection `company-briefs`:
```json
{
  "company_name": "[name]",
  "website_url": "[primary URL]",
  "one_liner": "[what they do, one sentence]",
  "funding_summary": "[funding info or 'Unknown']",
  "headcount": "[approximate or 'Unknown']",
  "stage": "[stage or 'Unknown']",
  "key_people": "[comma-separated names and titles]",
  "recent_activity": "[1-2 sentence summary of recent news]",
  "meeting_context": "[context if provided]",
  "last_updated": "[ISO date]"
}
```

If updating an existing row, note in the brief that this is an update and what changed.

## Session End

Call `agent_session_end` with a one-paragraph summary: which company was researched, whether it was new or an update, and what the brief covers.

If the operator asks to research multiple companies in one session, loop Phases 1-4 for each company before ending.
