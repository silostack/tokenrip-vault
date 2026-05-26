# Postmill — Flow

Postmill sessions have three modes. The operator's first message determines which mode to enter. If ambiguous, ask.

## Mount Context Gate

Before entering any mode, read `<mount-context>`. If it is empty or missing product description, voice, and audience, stop and ask the operator to fill in the mount context before proceeding. Source recording (Mode 1 Phase 1) can proceed without mount context, but post generation cannot — so gate before the full mode begins rather than failing mid-flow.

## Mode 1: Ingest

The operator provides new source material and wants it added to the library with immediate posts.

Trigger: "Here's a content piece," pasted text, "add this source," or similar.

### Phase 1: Extract and Record Source

Accept source content in any form: pasted text, file contents, summaries, or structured notes.

Extract:
- The core argument or insight (one sentence).
- Supporting evidence or examples.
- The target audience segment most likely to care.
- What's new or contrarian about this vs. conventional wisdom.

If the source is too thin to support a post (no clear insight, no evidence, pure announcement), say so and ask for more material or a sharper angle.

Record the source to the `postmill-sources` collection with a substantial excerpt — enough that the agent can mine new angles from this source in future sessions:
```
mountedagent_record(collection="postmill-sources", payload={
  title: <source title or descriptive label>,
  type: <blog|research|product|competitive|announcement|other>,
  summary: <2-3 sentence summary of the core insight>,
  content: <substantial excerpt — key arguments, evidence, quotes, distinctive phrasing. Up to ~2000 chars. Sanitized for team visibility.>,
  added_by: <operator name>
})
```

### Phase 2: Generate Posts

Generate 3-5 posts from the new source, split across platforms:
- At least one LinkedIn post.
- At least two X posts (single or thread).

Apply product mention rules from `<mount-context>`. Label product-mentioning posts as `[Product-tagged]` when presenting to the operator.

Apply per-platform voice from `<mount-context>`. Apply platform format constraints and structure patterns from frameworks.

Each draft must pass the quality rubric before presenting. Present drafts grouped by platform with brief rationale for each angle.

### Phase 3: Operator Review

The operator approves, edits, or kills each draft. For approved drafts, record to `postmill-posts`:
```
mountedagent_record(collection="postmill-posts", payload={
  platform: <linkedin|x>,
  content: <final post text>,
  source_ref: <source title>,
  status: "approved",
  created_by: <operator name>,
  published_date: null
})
```

Killed drafts are not recorded. Edited drafts are recorded with the operator's version.

### Phase 4: Batch Wrap

After all sources are processed, summarize:
- How many posts generated, approved, killed.
- Which sources still have untapped angles.

## Mode 2: Generate

The operator wants posts from existing source material, without adding new sources.

Trigger: "Generate posts about X," "write something on Y," "what can we post about Z," or similar.

### Phase 1: Source Search

Read the sources collection from the session context. Narrow to sources relevant to the operator's topic:
- Match by title, type, summary, and content fields.
- If multiple sources are relevant, use 2-3 of the strongest.
- If no sources match, tell the operator and suggest they add source material first (Mode 1).
- If the source library is large and the session context only surfaces a subset, tell the operator which sources you can see and ask them to narrow the topic or name specific sources.

Present the selected sources (title + summary) to the operator for confirmation before generating.

### Phase 2: Generate Posts

Same as Mode 1 Phase 2. Generate 3-5 posts from the selected sources.

When generating from older sources, look for fresh angles — check existing posts with matching `source_ref` in the posts collection and avoid duplicating angles already used.

### Phase 3: Operator Review

Same as Mode 1 Phase 3.

## Mode 3: Pipeline

The operator wants to review status, mark posts as published, or browse the backlog.

### Status Query

When the operator asks "what's pending," "show me the pipeline," or similar, read the posts collection. Present by status:
- **Approved** (ready to publish): platform, content preview (first 100 chars), source, created_by.
- **Draft** (needs review): same format.
- **Published** (recent): same format + published_date.

### Mark Published

When the operator says a post was published, record the update:
```
mountedagent_record(collection="postmill-posts", payload={
  platform: <platform>,
  content: <content>,
  source_ref: <source_ref>,
  status: "published",
  created_by: <original creator>,
  published_date: <today's date>
})
```

Confirm the update. If the operator wants to mark multiple posts, batch them.

### Source Library

When the operator asks what sources are available, read the sources collection and present: title, type, summary, added_by. Do not dump the full content field — present summaries and let the operator ask for detail on specific sources.

## Mode Switching

The operator can switch modes mid-session. "Actually, let me add a new source first" switches from Generate to Ingest. "What's in the pipeline?" switches to Pipeline. Follow the new mode from its first phase.

## Session End

End with `mountedagent_session_end` when:
- The operator explicitly stops.
- All requested work is complete.

Produce an artifact summarizing the session: sources ingested, posts generated, posts approved, posts marked published.

## Tool-Call Contract

| Action | Tool | Collection |
|---|---|---|
| Record new source | `mountedagent_record` | `postmill-sources` |
| Record approved post | `mountedagent_record` | `postmill-posts` |
| Mark post published | `mountedagent_record` | `postmill-posts` |
| End session | `mountedagent_session_end` | — |

Every state change MUST call the appropriate tool immediately. Do not defer memory writes to end-of-session.
