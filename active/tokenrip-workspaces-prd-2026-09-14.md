---
title: "Tokenrip Workspaces v1: a shared, boundary-aware working space for people and their agents"
status: PRD draft v0.1, for review. Internal: quotes and asks from the Providence pilot stay in this vault.
created: 2026-09-14
owner: Simon
source: Bean session 2026-09-14; flpool working folder; David LaSaee call 2026-09-10; prior thinking in workspace-brain-architecture-2026-06-14, tokenrip-shared-memory-canonical-fable-2026-06-11, research-tokenrip-file-collaboration-2026-09-08, tokenrip-first-loop-site-gtm-2026-09-04
related:
  - active/flpool/gameplan.md
  - bd/calls/contacts/david-lasaee.md
  - active/aicap-collaboration-canonical-scenario-2026-06-22.md
  - agents/bean/ideas/workspace-brain.md
  - agents/bean/ideas/inbox-as-the-product-surface.md
  - agents/bean/ideas/generic-work-queue.md
suggested_home: product/tokenrip/
---

# Tokenrip Workspaces v1

## Summary

A Tokenrip workspace is a shared working space that several people, each using their own AI tool, plug into for one project. It holds the project's documents and records, keeps a log of what changed and why, and shows each member what happened since they were last there. It draws a visibility line between the team that owns the workspace and the outside parties invited into it, so internal material and shared material live in one place without leaking.

This PRD specifies v1 of a ground-up redesign of the workspace feature. The design is generic, and the first instance is the Providence pool-first pilot (the "labs" project) that Simon, Alek, and David LaSaee run today out of a vault folder, email attachments, Telegram, and Slack. The generic design is derived from that project rather than imagined, because the folder that project grew over eleven days is already a workspace by convention. The PRD names the conventions and turns them into product.

The v1 scope is:

- A workspace container owned by a team, with internal and external members, and three visibility tiers: private, internal, and shared.
- Four standard files that every workspace carries: an index, a status document, an activity log, and a queue.
- Documents (versioned markdown and files) and records (versioned, schema-controlled tables with row history and snapshots).
- Sessions: a member's agent loads the workspace, works, and saves; the log records both the mechanical trail and the agent's narrative.
- A workspace-scoped MCP endpoint with a small tool set, which also serves as the invitation.
- A browser workspace view that follows a live session and works standalone for members who use no agent.

The acceptance test is one full batch cycle of the labs project run on the workspace with no email attachment, no re-keyed row, and no internal item visible to the outside member.

## Why this exists

### The labs project is the worked instance

Providence Capital Funding, through David LaSaee, is co-building a sourcing method with Quintel. Quintel builds and verifies a pool of companies from public registries, ships batches of 50 to 100 rows, David calls every row and returns verdicts, and the verdicts drive the next batch. The unit of work is the batch cycle: build, ship, dial, return, score, learn, revise. Three cycles have completed (Florida v2, Ohio, Wisconsin) and a fourth (Florida 100) is out.

Three people with three tool stacks do this work:

| Member | Role in the loop | Tools | How their work reaches the others today |
|---|---|---|---|
| Simon (Quintel) | Builds the pipeline, scores verdicts, maintains the plan | Claude Code and Claude Cowork against a vault folder | Emails with CSV attachments, the folder itself |
| Alek (Quintel) | Builds lists lender-first on his own machine, owns the relationship | ChatGPT and his own scripts | Raw CSV exports over Telegram |
| David (Providence) | Dials, grades, returns verdicts, supplies method | Excel with colour coding, Claude | Email with xlsx attachments, Slack |

The full picture of the project is in `active/flpool/gameplan.md`.

### What the working folder taught

Nobody designed a workspace for the labs project. One emerged. In eleven days the folder grew, unprompted, the following structure:

| File or folder | What it is | Generic name |
|---|---|---|
| `CLAUDE.md` | A map of the folder, read-first order, rules that hold across the folder | Index |
| `gameplan.md` | What is believed, labelled fact or inference with confidence, revised after every event | Status |
| `gameplan.md` §3 and §13, `email_to_david_*.md` | Timeline, revisions, and the record of what crossed to David and when | Log |
| `TODO.md` | Open items by owner and date | Queue |
| `out/` | What shipped | Shipped tier of the shared space |
| `out/verdicts/` | What came back from David, scored | Received tier of the shared space |
| `runbook_*.md`, `scripts/` | How the work is done | Procedures |
| `RUN_RETRO_INTERNAL`, the commercial read, David's verbatim phrasing | Material that must never reach David | Internal tier |

This is the specification. The standard files exist because the work needed them, and the visibility tiers exist because the work has an outside party in it. The redesign formalizes what dogfooding produced.

The mapping to the memory model in `agents/bean/ideas/workspace-brain.md` is exact: the log is episodic memory (what happened), the status document is semantic memory (what is believed), and the runbooks are procedural memory (how it is done). Decisions and learnings are not separate files. They are entry types in the log that consolidation promotes into status.

### What breaks today

The project runs, but four costs recur every cycle:

- **Two pipelines, one labeller.** Simon and Alek build lists on different machines with different schemas. Every batch needs a manual merge before it reaches David. The gameplan names this as a risk in its own §10.
- **Hand-scored returns.** David grades in xlsx with cell colours and abbreviations. Simon reads the file and scores it into the outcome taxonomy by hand or by a per-batch script. Every number quoted back to David is hand-counted, and one already misfired ("1 application per 500" versus "1 funded per 500").
- **The record of the boundary crossing is an email.** What was sent to David, in which version, with which columns removed, lives in `email_to_david_*.md` files that a human writes after the fact.
- **The plan is maintained by hand.** Four documents (the gameplan, the TODO, the folder map, and the contact doc) are kept in sync by Simon after every event. The status numbers go stale by the next batch.

David raised the tooling question himself on the 2026-09-10 call. In paraphrase: the spreadsheet is fine now but becomes unworkable at a thousand calls a week; he wants to click a field instead of colouring a cell; he wants end-of-day tabulation and daily reports; he does not want to re-key two weeks of history when a system arrives. Simon answered that Quintel already runs a platform for third-party collaboration and would look at it. This PRD is that look.

### Why a generic workspace, not a labs tool

The labs project is one shape of work: a loop with an outside party. The same shape recurs across the company:

| Workspace type | Loop | Outside party | Core record |
|---|---|---|---|
| Labs (sourcing pilot) | Build, ship, dial, return, score, learn | A customer who grades | Touch ledger |
| Sales motion | Source, reach out, reply, call, propose, close | Prospects, sometimes a channel partner | Pipeline |
| Marketing | Signal, draft, post, measure, consolidate | None, or an agency | Posts and results |
| Customer engagement (the FDE pattern) | Research privately, deliver selectively, co-edit, decide | The client | Deliverables and decisions |

Every row is the same draft-and-consolidate loop with different nouns, and every row has the same needs: a shared record, an activity log, a status that agents can boot from, a queue that ages, and a visibility line. The customer-engagement row was analysed in June (`active/aicap-collaboration-canonical-scenario-2026-06-22.md`) and named an asymmetric-visibility shared workspace as its second-largest gap. The labs project is the third time that gap has appeared. Three instances make it structural.

The workspace is therefore designed once, with types as templates on top: a set of index instructions, standard record schemas, and folder names.

### What a workspace is not

The following are explicitly out of scope, in v1 and as a direction:

- **Not a drive replacement.** Archives stay where they are. The workspace holds work created for the project.
- **Not the company's ground truth.** Facts and positions that hold across all projects (the "hard disk" under the workspace "cache") are a separate layer, not designed here. A workspace can reference it later.
- **Not a chat or messaging product.** Members talk in whatever they already use. The workspace records what the talk changed.
- **Not a workflow engine.** Loops are conventions in the index, not state machines.
- **Not the harness UI.** The MCP UI-component route was tested and judged early. The workspace view lives in a browser beside the harness.

## Vision and principles

A workspace is the place where a project's working state lives so that any member's agent can pick the work up cold, do a piece of it, and put it back with the reasoning attached.

The design follows seven principles:

1. **Agent-first, harness-neutral.** Every operation is reachable by an agent over MCP from any harness. The browser view is a second door, not the primary one. No member is asked to change AI vendor.
2. **The record beats the file.** Work that is a set of rows lives as a record with a schema, row history, and snapshots. Files are exports and imports of records, not the source of truth.
3. **The log is the verb.** Nobody uses a workspace; they process what happened since they were last there. The log is what the workspace shows first, and the agent writes it, not the human.
4. **Standard files by convention, like `CLAUDE.md`.** Every workspace has an index, a status, a log, and a queue, at known names, so an agent can boot from any workspace without a map.
5. **The boundary is a first-class object.** Internal and shared material coexist. Crossing the line is an explicit, logged event that pins a version. The outside member sees a workspace that is complete from their side and never shows an internal item.
6. **Zero re-keying.** Anything that was ever in a spreadsheet can be imported against a key. Anything the workspace holds can be exported in the shape a member already uses.
7. **Compute stays with the member's agent in v1.** The workspace serves bounded, filtered slices of records so any harness can pull rows and compute in its own sandbox. Server-side aggregation and scheduled reports are v2.

## Parties, roles, and how each works

### Members and their agents

A member is a Tokenrip account that belongs to a workspace. A member acts through one or more harnesses (Claude Cowork, ChatGPT Work, Claude Code, the CLI) and through the browser view. Each harness connection that loads the workspace opens a session.

Members are one of two kinds:

- **Internal.** Members of the team that owns the workspace. They see private, internal, and shared material.
- **External.** Accounts invited from outside the owning team. They see their own private material and shared material. They have no internal tier.

Roles are the existing four (viewer, contributor, editor, admin) and are kept as they are. External members default to contributor: they can read shared items, write to shared records and their own private space, and append to the log and queue, but cannot change scope or membership.

### The labs workspace, member by member

The following describes how each member of the labs project works on the workspace. It is the concrete case the generic design must satisfy.

**Simon** loads the workspace from Cowork at the start of a build. The boot payload gives him the status, the queue items owned by Quintel, and the log since his last session. He builds the next batch in his pipeline, imports the rows into the shared touch ledger, snapshots it as a batch, and exports David's copy with the internal columns removed. The export is the boundary crossing and lands in the log as a shared event pinned to the snapshot. He saves the session; the agent writes the narrative entry and updates the status numbers.

**Alek** loads the workspace from ChatGPT. He imports his Wisconsin export into the same ledger against the company key. The two-pipelines problem disappears at the record: one ledger, one schema, and his source columns stay in his own columns. He picks the queue item "Central-time list" and marks it done.

**David** connects his Claude to the workspace through the invitation link. His agent sees a workspace with one ledger, the batches shipped to him, the shared status, and the log of what Quintel did since he was last there. He asks his agent for the rows shipped this week, dials, and records verdicts either by telling his agent or by opening the grid in the browser and clicking enum fields. He asks his agent to tabulate the day: contacts, hang-ups, positives by lane. Nothing he does reaches the internal tier, and nothing in the internal tier reaches him.

**The next Simon session** boots with "since you were here: David returned 50 verdicts; Alek imported WI 50; 2 queue items aged past due." The scoring join runs in his harness on a bounded query of the ledger, and the learning goes into the log as a learning entry and into status as a revised claim.

### Harness support in v1

The MCP endpoint is the only agent connection path in v1. The browser view is the only non-agent path. Verified support is needed for Claude Cowork and ChatGPT Work as the first two harnesses; Claude Code and the CLI follow the same endpoint. Whether a given external member's harness permits a custom connector is unknown per member and must be checked at invitation. For David this is a single question to him.

## Workspace model

### Containment

A workspace belongs to a team and holds items. An item is one of:

- **Document.** A versioned artifact: markdown, CSV, xlsx, PDF, or any file type the artifact layer supports.
- **Record.** A versioned table with a typed schema.
- **Folder.** A named grouping of items. Folders are flat within a workspace.

Every item has a scope (its visibility tier), an owner, a creation session, and zero or more derivation edges to other items and versions.

### Visibility tiers

Every item carries exactly one scope:

| Scope | Who can see it | Who can write it | Default for |
|---|---|---|---|
| private | The owning member only | The owning member | Drafts, working notes, personal analyses |
| internal | Internal members | Internal members | Everything an internal member's agent creates during a session, unless the agent states otherwise |
| shared | All members | Per role | Everything an external member creates, and anything promoted across the line |

Rules that follow from the tiers:

- An internal member's agent creates items as internal by default. Promotion to shared is an explicit call.
- An external member's agent creates items as shared or private. External members cannot create internal items and never see the internal tier, including in counts, listings, search results, or log entries.
- Promotion from internal to shared is a logged event that pins the version promoted. Demotion is not supported in v1; an item shared is shared.
- Records carry scope at the table level in v1. A record that must show one column set internally and another set externally is modelled as two records with a derivation edge between them (the internal full ledger and the shared ledger). Column-level scope is a v2 item; the existing per-column `sensitive` flag on tables is a candidate mechanism and must be verified before it is relied on.
- The log is a projection. A log entry inherits the scope of the item it references. A narrative entry carries its own scope, set by the agent that writes it, defaulting to the tier of the session's member.

### Standard files

Every workspace carries four standard items at fixed names. Templates seed them; agents maintain them.

**Index** is a markdown document at `INDEX.md`. It holds what the workspace is for, the goals, the members and their roles in the loop, how to work here (the instructions an agent reads on load), and a map of the folders and records. It changes rarely. The index is shared by default; a template can carry an internal addendum as a second document.

**Status** is a markdown document at `STATUS.md`. It holds what is true now: the bar, where the project stands against it, the current claims labelled fact or inference with confidence, the open questions, and the experiments in flight. It is rewritten at session save by the agent that did the work and accepted by a human. In v1 the numbers in status are written by the agent from a query it ran. In v2 the numeric sections render live from saved queries. Status is shared by default; an internal status can exist alongside it as a second document.

**Log** is a record with a fixed schema. It is append-only. Entries are of two kinds:

- **Mechanical.** Written by the system on every write: created, updated, imported, exported, shared, joined, claimed, done. Each entry carries the actor, the harness, the session, the item and version touched, and the scope inherited from the item.
- **Narrative.** Written by an agent at session save or on demand. Types are session, decision, learning, and received. Each entry carries free text, references to items and versions, and a scope.

The log schema is:

| Column | Type | Notes |
|---|---|---|
| id | text, unique | |
| at | date | Timestamp |
| actor | text | Member |
| harness | text | Claude Cowork, ChatGPT Work, browser, and so on |
| session | text | Session id, empty for browser edits outside a session |
| type | enum | created, updated, deleted, imported, exported, shared, joined, claimed, done, session, decision, learning, received |
| refs | text | Item ids with pinned versions |
| scope | enum | private, internal, shared |
| text | text | Narrative body; empty for mechanical entries |

**Queue** is a record with a fixed schema. Items are open work with an owner and an age. Anyone can add; the owner or a claimant closes. Aging is visible: the view and the boot payload show age and past-due state. In v1 the queue is a list that people and agents maintain; in v2 items become claimable work items for any member's agent and the aging nudge is a reflex.

The queue schema is:

| Column | Type | Notes |
|---|---|---|
| id | text, unique | |
| title | text | |
| owner | text | Member |
| claimant | text | Member or agent that picked it up |
| created | date | |
| due | date | Optional |
| state | enum | open, claimed, done, dismissed |
| refs | text | Item ids |
| scope | enum | private, internal, shared |
| why | text | Free text |

### Records

A record is a table with a typed schema, row-level history, and named snapshots. Records are the load-bearing object of v1.

Requirements for records are:

- **Schema.** Columns are typed (text, number, date, url, enum, boolean), with enum values, uniqueness, and a key column or key set. Strict mode rejects unknown columns and invalid values. Schema changes are versioned.
- **Row history.** Every row write creates a row version with actor, session, and time. A row can be read at any prior version. Row history is the mechanism that makes "David changed this cell on Tuesday" answerable.
- **Snapshots.** A named, immutable capture of the whole record at a point in time. Shipping a batch and receiving verdicts each create a snapshot. Diff between two snapshots returns added, removed, and changed rows by key.
- **Bounded query.** Read rows by filter, sort, projection, and cursor with a hard page limit, so an agent can pull a slice without loading the record into context. No aggregation in v1.
- **Import.** Load a CSV or xlsx into a record: create, or upsert against the key set, with a column mapping the agent supplies and a report of rows matched, created, and rejected. Import is how three prior verdict files enter the labs ledger on day one and how David's returns enter every cycle.
- **Export.** Write a filtered, projected slice of a record to a CSV or xlsx artifact with a derivation edge to the snapshot. Export is how David's copy of a batch is produced with internal columns removed.
- **Provenance per cell.** Each cell value carries the row version that set it, which carries actor and session. Field-level provenance is a read, not a separate store.
- **Concurrency.** Row writes accept an expected row version and fail on mismatch. This closes the stale-write gap that the exposed update signatures leave open.

### Documents

Documents are the existing artifact primitive with versions, diff to the previous version, and rendered views. v1 adds scope, session attribution on each version, and derivation edges. Markdown, CSV, and xlsx must render in the view; other types render as the artifact layer already does.

### Derivation edges

Any item version can declare that it was derived from other item versions. In v1 the edge is recorded and shown ("derived from ledger snapshot batch-fl-100") and used by export and import automatically. Stale detection ("this batch was built from status v12; status is at v15") is v2.

### Sessions

A session is one harness connection doing work in the workspace between a load and a save.

The session lifecycle is:

1. **Load.** The agent calls load. The workspace opens a session, records a joined entry, and returns the session token and the boot payload.
2. **Work.** Every write carries the session token. Mechanical log entries attribute to the session.
3. **Save.** The agent calls save with a narrative summary (what changed, why, what was learned, what is open), an optional status patch, and queue updates. The workspace writes the session entry, applies the patch as a new status version, and closes the session.
4. **Auto-close.** A session with no writes for six hours closes with a mechanical session-closed entry and no narrative. The member sees an unsummarised session in the view and can ask their agent to summarise it from the mechanical trail.

The boot payload is the workspace as an agent needs it on entry, bounded in size:

- The index, in full.
- The status, in full.
- Log entries since the member's cursor, newest last, capped, with a count if capped.
- Queue items owned by or claimable by the member, with age.
- The list of items changed since the cursor, with scope and version.
- The member's role, kind (internal or external), and the workspace instructions from the index.

The member cursor is the last log entry the member has seen. Load and opening the browser view both advance it. "Since you were here" is defined against it.

### Membership and invitation

A workspace has a per-workspace MCP endpoint. The invitation is that endpoint plus an invite token. Accepting the invitation creates the membership, records the harness that connected, and writes a joined entry. Internal membership follows team membership; external membership is by invitation only.

The members panel shows, for each member, name, kind (internal or external), role, harnesses seen, last connected, and the session count. Removing a member revokes the endpoint token and leaves their contributions and log entries in place.

## MCP surface

The workspace endpoint exposes a small tool set, named in the vocabulary a non-engineer's agent can map a plain request onto. The full Tokenrip tool catalogue is not exposed through the workspace endpoint.

| Tool | Does | Notes |
|---|---|---|
| load | Opens a session, advances the cursor, returns the boot payload | The only entry point |
| save | Writes the narrative entry, applies the status patch and queue updates, closes the session | |
| list | Lists items with scope, version, folder, and changed-since flag | Filtered by the caller's tier |
| read | Reads a document version, or a record slice by filter, sort, projection, and cursor | Page limit enforced |
| write | Creates or updates a document version, or upserts rows with expected versions | Scope defaults per tier |
| import | Loads CSV or xlsx content or an uploaded artifact into a record with a column mapping | Returns the match report |
| export | Writes a record slice to CSV or xlsx with a derivation edge | |
| snapshot | Names a snapshot of a record; diff returns changes between two | |
| share | Promotes an item from internal to shared, pinning the version | Internal members only |
| log | Appends a narrative entry, or reads entries since a cursor with filters | |
| queue | Adds, claims, completes, or lists items | |
| focus | Tells the view which item and version the session is looking at | Drives follow mode |
| members | Reads the member list | Read only |

Every write tool takes the session token. Writes without a session are permitted from the browser view only.

The instructions block in the index is returned on load and is the workspace's equivalent of `CLAUDE.md`: what the loop is, which record is the ledger, what the key is, what to do at save, and what never leaves the internal tier.

## Browser view

The browser view is the second door. It must work for a member who never connects an agent, and it must follow a live session for a member who does.

### Routes

- `/w/<workspace>` opens the workspace view for the signed-in member, filtered to their tier.
- `/w/<workspace>?session=<id>` opens the view in follow mode on that session. Load returns this link in the boot payload so the agent can hand it to the member.
- `/w/<workspace>/i/<item>` and `/w/<workspace>/i/<item>@<version>` deep-link an item and a version.

### Layout

The view has three regions:

- **Left rail: the tree.** Organized by zone, not raw path: the four standard items pinned at the top; then folders; then records. Each entry shows a scope glyph (private, internal, shared) and a changed-since-cursor badge. For external members, internal items are absent, not greyed.
- **Main pane: the item.** A document renders with a version picker and a diff to any earlier version. A record renders as a grid with enum dropdowns, inline editing per role, row history on click, a snapshot picker, and a diff between snapshots. Import and export are actions on the record. The pane header shows scope, derivation edges, and the session that last wrote.
- **Right rail: the timeline.** The log since the member's cursor, newest first, with filters by type, member, and scope. Clicking an entry opens the referenced item at the pinned version in the main pane. The timeline is the first thing a returning member sees; the view opens with the timeline expanded and the tree collapsed until the member picks an item.

Above the panes, a session strip shows live sessions ("Alek, ChatGPT Work, active 3 minutes ago") with a follow toggle per session, and the members panel opens from the same strip.

### Follow mode

In follow mode the view subscribes to one session's events. A focus call or a write from that session moves the main pane to that item and version. Any manual navigation by the viewer switches the view to pinned mode: the pane stays where the viewer put it and incoming changes show as badges on the tree and a count on the timeline. A single control returns to follow mode.

Events reach the view over a server-push channel scoped to the workspace and filtered by the viewer's tier. Latency target from write to view update is two seconds.

### Interactions the view must support

The view supports these interactions:

- Open an item at the current or any prior version; diff two versions.
- Edit a document inline, creating a version attributed to the browser and the member.
- Edit record cells inline with enum validation; see per-cell provenance; view a row's history.
- Import a file into a record with a column-mapping step; export a slice.
- Add, claim, complete, and dismiss queue items; see age and past-due state.
- Write a narrative log entry by hand (decision, learning).
- Promote an item to shared, with a confirmation that names what the outside members will see.
- Invite an external member, generating the endpoint link and token; view and revoke members.
- Scrub the timeline and jump to the state of an item at any entry.

### Design constraints

The view must hold up on a laptop beside a chat window at roughly half screen width. The three regions collapse to two below that width, with the timeline as a drawer. The grid must handle a record of 5,000 rows with virtual scrolling. Colour is never the only carrier of meaning, given that the first external user's own convention is cell colour; enums render as labelled chips.

## Workspace types

A workspace type is a template applied at creation. It seeds the index instructions, the standard records beyond log and queue, and the folder names. v1 ships two templates: generic and labs. Sales and marketing are sketched for the roadmap.

**Generic** seeds the four standard files and the folders working, shipped, received, and procedures.

**Labs** seeds, in addition:

- A record `ledger`: one row per company per touch. The schema is the union of the outside party's working columns and the team's columns, with a key of company id plus touch date, enum columns for outcome, reached, and next action, free text for why, and the outside party's own flags (LP, GM). Internal-only columns (intent signals, fit flags, sourcing rationale) live in a second internal record `ledger-full` with a derivation edge to `ledger`.
- A record `batches`: one row per shipped batch, with the snapshot id, the state, the row count, the ship date, the return date, and the score summary.
- Index instructions that describe the loop, the bar, the key, the scoring convention, the save convention, and what never leaves the internal tier.

**Sales** would seed a `pipeline` record and folders for outreach copy and call notes. **Marketing** would seed a `posts` record with results columns and folders for signals and drafts. Both wait for a live instance.

## The labs workspace on v1: one cycle end to end

This is the acceptance narrative. Every step maps to a requirement in the preceding sections.

1. Simon creates the workspace from the labs template under the Quintel team. He migrates the folder: the gameplan becomes `STATUS.md` with its §3 and §13 split out as log entries; `TODO.md` imports into the queue; `CLAUDE.md` becomes the index; the three scored verdict files import into `ledger` against the company key; the retro, the commercial read, and the contact doc excerpts land as internal documents; the runbooks land in procedures as shared; `email_to_david_*.md` become received and shared log entries with pinned versions.
2. Simon invites David: one link, one token. David connects his Claude, or opens the browser view if his harness cannot take a connector. Either way the joined entry appears in Simon's and Alek's next boot payload.
3. Alek loads from ChatGPT, imports the Florida 100 raw export into `ledger-full` with a column mapping, and saves. The log shows the import and his narrative.
4. Simon loads from Cowork, runs phone checks in his pipeline, upserts the results into `ledger-full`, exports the shared slice into `ledger`, names the snapshot `batch-fl-100`, exports David's xlsx from it, and calls share. The log carries the shared event pinned to the snapshot: what crossed, when, which columns.
5. David loads. His boot payload says a batch of 100 landed. He reads rows filtered to the batch, dials, and records outcomes through his agent or the grid. Each row write is a row version attributed to him.
6. David asks his agent to tabulate the day. The agent reads the batch slice and computes in its own sandbox: contacts, hang-ups, positives by lane. He saves; the session entry says what he did and what he noticed.
7. Simon's next load says David returned 100 verdicts. The scoring join runs in Simon's harness against `ledger` and `ledger-full` on bounded reads. The learning entry and the status patch land at save. The queue item "FL 100 verdicts read" closes.
8. At no point does David's list, log, search, or boot payload contain an internal item. A test account with external membership verifies this on every release.

The cycle replaces one email with an attachment, one hand-scored xlsx, one hand-written record of the crossing, and four hand-synced documents.

## Requirements

Priority uses must (v1 ships without it is incomplete) and can (v1 ships without it is acceptable).

| Id | Area | Requirement | Priority |
|---|---|---|---|
| R1 | Container | A workspace belongs to a team, holds documents, records, and flat folders, and carries a template type | Must |
| R2 | Visibility | Every item has one scope: private, internal, or shared, with the defaults and rules in the visibility section | Must |
| R3 | Visibility | External members never observe internal items through any surface: list, read, search, log, counts, events, or boot payload | Must |
| R4 | Visibility | Promotion internal to shared is a logged event pinning the version | Must |
| R5 | Standard files | Index and status exist as documents at fixed names; log and queue exist as records with the fixed schemas | Must |
| R6 | Records | Typed schema with enums, key set, strict mode, and versioned schema changes | Must |
| R7 | Records | Row-level history with actor, session, and time; read a row at any version | Must |
| R8 | Records | Named snapshots and diff by key between snapshots | Must |
| R9 | Records | Bounded query: filter, sort, projection, cursor, hard page limit | Must |
| R10 | Records | Import CSV and xlsx with column mapping and upsert on key; match report | Must |
| R11 | Records | Export a slice to CSV and xlsx with a derivation edge | Must |
| R12 | Records | Expected-version on row writes; mismatch fails | Must |
| R13 | Documents | Scope, session attribution per version, derivation edges | Must |
| R14 | Sessions | Load, save, auto-close; boot payload as specified; member cursor | Must |
| R15 | Log | Mechanical entries on every write; narrative entries at save; scope projection | Must |
| R16 | Queue | Add, claim, complete, dismiss; age and past-due visible in view and payload | Must |
| R17 | MCP | Per-workspace endpoint with the tool set in the MCP section, and nothing else | Must |
| R18 | MCP | Invitation is the endpoint plus a token; acceptance creates membership and a joined entry | Must |
| R19 | View | Three-region layout, timeline-first entry, tree by zone with scope glyphs and badges | Must |
| R20 | View | Document viewer with versions and diff; record grid with inline enum editing, row history, snapshots, diff | Must |
| R21 | View | Follow and pinned modes on a session; server-push events within two seconds | Must |
| R22 | View | Members panel with kind, role, harnesses, last connected; invite and revoke | Must |
| R23 | Templates | Generic and labs templates | Must |
| R24 | Migration | The labs folder migrates per the acceptance narrative with no re-keyed row | Must |
| R25 | Records | Column-level scope | Can (v2) |
| R26 | Compute | Server-side aggregation tools | Can (v2) |
| R27 | Compute | Saved queries rendered live in status; scheduled reports as log entries | Can (v2) |
| R28 | Derivation | Stale detection against derivation edges | Can (v2) |
| R29 | Queue | Claimable work items for any member's agent; aging reflex | Can (v2) |

## Acceptance tests

The v1 is accepted when the following pass on the real labs project, with real members and real harnesses:

1. **The round trip.** One batch ships and its verdicts return with no email attachment and no re-keyed row, per the acceptance narrative.
2. **Two harnesses, one record.** Alek on ChatGPT Work and Simon on Claude Cowork write to the same ledger in one day and each sees the other's writes at next load.
3. **The leak test.** A script with an external member's credentials exercises every tool and the view and finds zero internal items, entries, or counts.
4. **Follow mode.** An agent write appears in the browser view within two seconds, and manual navigation switches the view to pinned mode with badges.
5. **The boot summary.** After two members work, a third member's load returns a boot payload under a stated size cap whose since-you-were-here section names every write.
6. **Return, voluntarily.** Each of the three members loads the workspace for a second cycle without being asked. This is the only test that cannot be automated and the one that matters most.

## Migration of the existing workspace feature

The existing workspace primitive carries a notes layer (signal, doctrine, and output zones, note links, a worklist, and captures) that the redesign retires from the workspace surface. Brains keep their own notes model. The session token concept, membership, roles, and item inclusion carry forward. Existing workspaces (`tr-research`, `reply-guy`, `tokenrip-brain`, `reddit-demand-scout`, `test-workspace`) migrate as generic-template workspaces with their items intact and their notes exported to documents, or are archived; the choice is per workspace at migration time.

## Roadmap after v1

The following are the directions this design opens, in the order the labs project is likely to demand them:

- **Server-side aggregation and saved reports** (R26, R27). David's daily tabulation as a scheduled entry in everyone's timeline. The first reflex that a customer asked for in their own words.
- **Column-level scope** (R25). One ledger, two views, no derived twin.
- **Stale detection** (R28). Status claims and shipped batches that know which snapshot they were built from and say when it moved.
- **Claimable work items** (R29). The queue becomes the generic work queue: any member's agent can pick up an item; aging nudges.
- **Ingest sources.** Email attachments and Slack messages that land as received entries without a human moving them.
- **A workspace agent in the browser.** For the member who has no harness or whose organisation blocks connectors: a neutral agent on the workspace, which is also the vendor-neutrality position (one member on Claude, one on ChatGPT, one room).
- **Cross-workspace references and the ground-truth layer.** Facts and positions that hold across all workspaces, referenced rather than copied. Not designed here.
- **Semantic recall over the workspace.** Search by meaning across documents, records, and the log, scoped by tier. The brain work applies; the boundary-scoped embedding question stays open.

## Open questions

The following are unresolved and are called out rather than assumed:

- **Row-history storage cost.** Every row write as a version is the clean model; the cost at 5,000 rows times weekly returns must be measured before the schema is fixed.
- **Import through a harness.** The research of 2026-09-08 flagged that a file generated in a harness sandbox is not automatically readable by a remote MCP server, and that base64 in tool arguments has limits. The import path per harness must be verified with a real 100-row xlsx before the round-trip test is scheduled.
- **ChatGPT Work custom connectors.** Support for a per-workspace MCP endpoint with a token must be confirmed for the account tier Alek uses.
- **David's connector.** Whether his Claude subscription permits a custom connector is unknown. If not, the browser view is his door and the round-trip test runs through the grid.
- **Narrative quality at save.** The session entry is written by whichever model the member runs. The instructions block must carry an explicit save template, and the first sessions must be read to see whether the entries are usable.
- **Status patch authority.** v1 lets the saving agent write the status version directly. Whether a human accept step is needed before status changes are trusted is decided after the first cycle.

## Assumptions

The following are labelled so they can be struck:

| Assumption | Kind | Confidence |
|---|---|---|
| David adopts whatever shared schema Quintel proposes for the ledger, given that batches already ship in his template with the unwanted columns removed | Stated by Simon | High |
| David wants tabulation and reports, and does not need to be the one running the calculation | Paraphrase of his 2026-09-10 asks | High |
| Internal equals owning-team membership is sufficient for every workspace type for at least two quarters | Design choice | Medium; a second outside organisation in one workspace breaks it |
| Three members and one record per cycle is the load; no v1 need for real-time co-editing | Observed | High |
| The per-workspace endpoint is acceptable to both target harnesses | Unverified | Medium |
