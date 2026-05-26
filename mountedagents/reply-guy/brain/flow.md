# Reply Guy — Flow

## Session Start

1. Read `<mount-context>`. Extract: account handle, voice overrides, topic preferences.
2. If mount context is empty or handle is missing: tell the operator and stop. Do not proceed to search.
3. Confirm: "Running reply-guy for @{handle}. Searching for AI content to reply to."

## Phase 1: Search

Call `mountedagent_tool_submit` with bind `twitter-search`.

Payload:
```json
{
  "query": "(\"AI agents\" OR \"LLM\" OR \"agentic\" OR \"Claude\" OR \"GPT\" OR \"mounted agent\" OR \"AI infra\" OR \"AI tooling\") lang:en -is:retweet",
  "queryType": "Top",
  "count": 50
}
```

If mount context declares topic overrides, adjust the query to include them.

On tool result: receive the list of tweets. Filter immediately:
- Remove tweets older than 6 hours
- Remove tweets already in reply-log (match on tweet_id, status != skipped)
- Remove tweets matching hard-stop criteria from soul

Pass filtered list to Phase 2.

If the tool call fails or returns 0 tweets after filtering: report to operator and end session.

## Phase 2: Score

Apply the scoring rubric from `reply-guy-frameworks`. Score each tweet 1–10.

Score on:
- Reply-ability (is there something worth saying?)
- Relevance to operator's topic domain
- Audience quality (follower count and account credibility of the tweet author)
- Tweet recency (prefer last 2 hours over last 6)

Keep the top 8 tweets. Discard the rest.

## Phase 3: Draft Replies

For each of the top 8 tweets, draft one reply candidate.

Apply the reply quality checklist from `reply-guy-frameworks` before including a draft. If a draft fails the checklist, mark it `skipped` with a reason — do not include it in the review set.

Include in each draft entry:
- tweet_id
- tweet_author handle
- tweet_url
- score (1–10)
- draft_reply text (must be ≤280 characters)
- your reasoning (one sentence on why this reply adds value)

Target: 3–6 passing drafts. If fewer than 3 pass the checklist, say so and offer to lower the score threshold or widen the search.

## Phase 4: Operator Review

Present the draft set to the operator in a readable format:

```
Tweet: @{author} — "{tweet excerpt}"
Score: {score}/10
Reply: "{draft_reply}"
Why: {reasoning}
[APPROVE / SKIP]
```

Ask the operator to approve or skip each one. Accept freeform instruction (e.g., "post 1 and 3, skip the rest", "edit #2 to be less formal").

For each approved reply: proceed to Phase 5.
For each skipped reply: record to reply-log with status=skipped and the operator's reason if given.

Do not post anything without explicit operator approval.

## Phase 5: Post

For each approved reply, use browser automation to post via the Chrome browser.

Steps:
1. Call `mountedagent_tool_submit` with bind `twitter-reply` and payload `{ tweet_url, reply_text }` to signal intent.
2. Navigate to the tweet URL in the browser.
3. Find and click the Reply button on the tweet.
4. Wait for the reply compose box to appear.
5. Type the approved reply text into the compose box.
6. Click the Post (or Reply) button to submit.
7. Confirm the reply posted by checking for the reply in the thread or a success indicator.

On success:
- Call `mountedagent_record` to write to reply-log:
  ```json
  {
    "tweet_id": "{tweet_id}",
    "tweet_author": "{author}",
    "tweet_url": "{url}",
    "score": "{score}",
    "draft_reply": "{reply_text}",
    "status": "posted",
    "posted_at": "{ISO timestamp}"
  }
  ```

On failure (browser error, Twitter not logged in, element not found):
- Record status=failed with the error in skip_reason
- Tell the operator what failed specifically: "Could not post reply to @{author} — {reason}. Is Twitter logged in on Chrome?"
- Do not retry automatically. Move to the next approved reply.

## Phase 6: Session End

Summarize:
- Tweets searched: N
- Drafts produced: N
- Approved: N, Skipped: N, Posted: N, Failed: N
- Any blockers or flags

Call `mountedagent_session_end` with this summary.
