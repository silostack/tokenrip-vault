---
title: "Tokenrip's file-collaboration entry point: one file, across people and AI tools"
created: 2026-09-08
status: research and recommendation; not an implementation plan
owner: Simon
related:
  - "[[tokenrip-first-loop-site-gtm-2026-09-04]]"
  - "[[tokenrip-brain-terminals-modules-canon-2026-09-01]]"
  - "[[semantic-multiplayer-collaboration]]"
tags: [tokenrip, onboarding, collaboration, files, gtm]
---

# Make one shared file survive the next person, correction, and AI tool

## The file workflow is a stronger entry point, but storage through MCP is not a differentiator

Prioritize Simon and Alek's recurring CSV workflow as the next onboarding hypothesis. It has an existing user, repeated pain, a tangible output, and a natural second use. The promise is not simply saving AI output: it is continuing work on the same authoritative file across people and tools, with corrections and history attached.

Box, Dropbox, Google Drive, and native AI products already cover substantial parts of this workflow. Tokenrip must demonstrate a better complete experience, not assume competitors are read-only or that chat files disappear. Confidence is high that this is a better test than a fictional collaborative story; confidence is moderate that it can differentiate commercially. A fair comparison against an existing shared-drive setup is the cheapest disconfirming test.

Research scope: current official documentation and Tokenrip's exposed tool schemas, connected with vault strategy and historical code audit. Competitor workflows were not tested hands-on. Tokenrip documentation establishes available primitives, not successful execution of the proposed two-user journey. All illustrative prompts below are proposed, not records of real changes.

## The problem is fragmented file identity, not insufficient disk space

The current workflow is Telegram attachment → download → inspect → correction request → replacement attachment. It separates the file from its history, the request that changed it, and the work subsequently built from it. Telegram remains useful for notification; it need not be replaced as a communication channel.

The useful unit is one shared work object with:

- A stable identity and current-version link, regardless of filename.
- Exact, retrievable historical versions for reproducible analysis.
- An understandable change history and attribution.
- Corrections and their rationale attached to the relevant version.
- Permission-aware access from the tools both people already use.
- Reliable transfer of the actual file, without manual downloads or model reconstruction.

Search solves “where is Alek's lender list?” Exact file access and computation solve “how many rows meet these conditions?” History solves “what changed since the version I used?” These are different operations and should not be conflated under memory.

## Existing options are substantially more capable than the old narrative assumes

### Box is the strongest direct counterexample

Box's official MCP tools include file reads, uploads, uploading a new version of an existing file, comments, and sharing/collaboration operations. Several tools, including version upload and sharing, require administrator enablement. Its optional upload/download URL tools support direct binary transfer from execution-capable environments; a declarative agent alone cannot perform that transfer. This already overlaps the proposed basic workflow. [Box MCP tools](https://developer.box.com/guides/box-mcp/tools).

Box also documents conditional writes using ETags at the API layer. This is evidence of mature storage concurrency, not proof that every MCP tool exposes those controls. [Box consistency guide](https://developer.box.com/guides/api-calls/ensure-consistency).

Implication: “Box cannot do this” is untenable. Tokenrip needs lower setup burden and better integrated agent-facing review and continuation, demonstrated rather than asserted.

### Dropbox now offers agent-accessible writes and history

Dropbox's official remote MCP server lists search, file access, UTF-8 text file creation up to 5 MB, shared links, file revisions, and revision restoration. Its supported-client documentation includes major chat and coding harnesses. The listed tools do not clearly establish same-file content-update semantics; that remains a connector-level question, not a limitation of Dropbox storage generally. [Dropbox MCP documentation](https://help.dropbox.com/integrations/connect-dropbox-mcp-server).

A shared synced folder with a local agent is also a credible alternative. It provides ordinary file access without inventing a new storage system. Concurrent edits can produce conflicted copies, but this does not make the sequential Simon/Alek workflow impossible. [Dropbox conflict behavior](https://help.dropbox.com/organize/conflicted-copy).

### Drive capabilities depend on the connected harness

ChatGPT's Google Drive app documents read and write actions, subject to workspace permissions and Google authorization. Claude's Google Workspace connector documents retrieval, uploading generated files, and file organization/sharing. Do not infer identical operations across these connectors, or exact CSV overwrite behavior from a broad “read and write” label. [ChatGPT Drive actions](https://help.openai.com/en/articles/10929079), [Claude Google Workspace connector](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors).

Drive itself already has stable file identities and revisions. A notable connector seam: Claude's documented Google Docs extraction excludes comments and suggestions, so human review context may not accompany document content. [Drive revisions](https://developers.google.com/workspace/drive/api/guides/manage-revisions), [Claude connector limitations](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors).

### Native AI products already persist and share context

ChatGPT Library saves uploaded and generated files for later reuse; deleting a chat does not delete those saved files. Shared Projects provide a separate team-context option. Cowork supports cloud sessions whose files persist across Claude surfaces, alongside local-folder workflows. These are credible solutions for teams staying within one ecosystem. [ChatGPT Library](https://help.openai.com/en/articles/20001052-file-storage-and-library), [ChatGPT Projects](https://help.openai.com/en/articles/10169521-projects-in-chatgpt), [Cowork sessions](https://support.claude.com/en/articles/15520349-use-claude-cowork-on-web-desktop-and-mobile).

The defensible problem statement is therefore not “everything disappears when the chat closes.” It is that a team's continuing work can remain fragmented across tools, copies, review messages, and version assumptions.

## “Git for non-code” is a useful analogy with a costly implied contract

Git can already version non-code, including CSV and Markdown. The opportunity is to give people using ordinary AI tools the benefits without repository ceremony.

Initially, the useful promises are identity, history, comparison, attribution, and protection against accidentally replacing someone else's newer work. Branches, merges, pull requests, approval states, and synchronized multi-file commits are separate capabilities. Do not imply they come free with artifact versioning.

In particular, “latest” is not synonymous with “approved.” A later experiment should not silently become the team's trusted operating dataset. The first product can focus on sequential corrections; draft-versus-approved versions can follow real demand. Conflict detection becomes essential when two agents can update the same file.

For the homepage, retain the literal shared-workspace category and make the proof concrete: create a file in one AI tool, correct it in another, and keep one shared link. Use Git as supporting shorthand rather than making unfamiliar users understand source control.

## The first aha should be a correction that reaches the original file

### The full two-person experience

1. **Alek saves an actual output.** In his usual tool: “Save this CSV to our Tokenrip workspace as the lender list and give me its team link.” The result should include a useful table preview and a stable private/team URL. He can send the link through Telegram.
2. **Simon retrieves it without transporting it.** In a fresh connected chat: “Find the lender list Alek saved yesterday.” The agent identifies the file and current version, clarifying if several candidates match.
3. **Simon makes a bounded correction.** For example: “Rename this column to lender_type; preserve the row IDs and other values. Save a new version of the same file and record why.” The agent performs an exact transformation and reports its result.
4. **The original link still works.** The dashboard shows the current CSV and version history. A comparison shows what actually changed. No second attachment or replacement URL is needed.
5. **Alek resumes in his tool.** “What changed in the lender list since my version?” He sees the correction and recorded rationale. He can continue from that version without asking Simon to resend anything.

The aha is: the two people and their agents are working on one continuing object, not circulating outputs from isolated conversations.

### The low-friction solo onboarding should prove the same mechanism

Do not require a teammate or a second AI subscription before delivering value. After connecting one client:

1. Save a small useful CSV or document from the current conversation.
2. Open its dashboard link and inspect the result.
3. Start a fresh chat and ask for a specific correction to that saved file, without pasting it again.
4. Reopen the original link and see version two plus history.

If the CSV dashboard editor is verified, a stronger attribution test is to change a value in the dashboard, then ask the fresh chat to retrieve that value and cite its source version. The first chat never saw the correction, so native conversation memory cannot explain the result.

A seeded sample can offer immediate practice, but it should become the user's private copy. Avoid making strangers modify one public business file. Actual provenance must be real; illustrative history should be labeled as sample data. The useful novelty is the behavior, not a fictional object's backstory.

### Company-fact recall is a teaser, not the central proof

Saving and recalling a random fact demonstrates persistence, but native memory and shared projects make the benefit ambiguous. It also has little inherent reason for a teammate to return.

Use recall as an extension: “Why is this column defined this way?” The answer points to the correction attached to the file. Only promote that correction into company-wide policy if a user confirms its broader scope. A one-file exception must not silently become organizational doctrine.

## The deeper potential is knowing which work depends on which version

The meaningful expansion is not more storage capacity. It is relationships among work products:

- A shortlist was generated from lender-list version two.
- The lender list is corrected in version three.
- When asked whether the shortlist is current, the agent can identify its older source and offer to regenerate it.
- The regenerated result records the source version and the reason for the update.

This connects files, decisions, review, and later automation without asking new users to seed a company brain first. Files supply useful context through normal work. Historical versions also prevent a changed source from rewriting the apparent basis of an earlier conclusion.

Tokenrip documents provenance fields and its historical code audit describes derivation relationships. Version-specific lineage, stale-output detection, and any automatic rerun must be verified or built explicitly; the proposed experience is not a claim that all of this happens automatically today. [Artifact documentation](https://docs.tokenrip.com/concepts/artifacts); [historical collaboration audit](build-decision/10-tokenrip-codebase-map.md).

## Tokenrip has relevant foundations; six seams require validation

| Seam | Documented evidence | Implication for the demo |
|---|---|---|
| File identity | Artifact IDs, latest and version-pinned URLs, and version history are documented. | Update the resolved artifact; do not republish another object with the same title. |
| CSV versus tables | CSV artifacts are versioned whole files; mutable tables have row APIs but no version history. | Keep the CSV authoritative. Do not silently convert it into a table to obtain filtering. |
| Querying | CSV has no server-side row filtering/sorting API. | For exact calculations, retrieve a pinned version and execute deterministic analysis where supported. |
| Diffs | The diff endpoint compares a version with its immediate predecessor; CSV output is row insertions/deletions. | Do not promise arbitrary-version or column-aware semantic diffs. Stable row keys enable better computed comparisons. |
| File transfer | MCP accepts content/base64; CLI can handle local files. Binary uploads are documented up to 10 MB. | Validate the actual harness's transfer path. A generated local file is not automatically readable by the remote MCP server. |
| Concurrent updates | The exposed update signature has no expected/base-version argument. | Verify backend protections. Detect stale writes before promising safe multi-agent updates. |

Sources: [artifacts](https://docs.tokenrip.com/concepts/artifacts), [CSV versus tables](https://docs.tokenrip.com/concepts/csv), [version diff](https://docs.tokenrip.com/api-reference/versions/diff), [publish version](https://docs.tokenrip.com/api-reference/versions/publish), [MCP server](https://docs.tokenrip.com/getting-started/mcp-server). Tool-schema inspection establishes only the exposed interface, not all backend behavior.

Additional checks before using real company data:

- Verify Simon and Alek have the intended read/write permissions, including history and diffs. The July audit's write-grant gap is historical, not current proof of a defect.
- Make team-private visibility explicit. Do not inherit a link-public publishing default for business files.
- Resolve ambiguity in documentation around CSV dashboard editing: a specialized grid may differ from generic inline text editing. Test the real path before designing onboarding around it.
- Preserve CSV quoting, delimiters, encodings, leading zeros, and unchanged values. Test with representative data, not only a perfect toy CSV.
- Prefer byte transfer or deterministic file transformation to asking a model to reproduce a large file in a tool argument. Scope the first supported harness and file types honestly.
- Treat shared file contents as data, not authority to execute embedded instructions or transmit other workspace information.

## This changes the entry point, not necessarily the entire product strategy

The September plan selects call processing as the acquisition lure and the inbox as the recurring surface. File collaboration is an alternative first-value path with fewer prerequisites: the user already has an output, needs no notetaker integration, and can experience value alone before inviting a teammate. That makes it worth testing ahead of a more elaborate onboarding dependency chain, not proof that the call loop should be abandoned. [Current rework](tr-v2/README.md), [first-loop plan](tr-v2/tokenrip-first-loop-site-gtm-2026-09-04.md).

The sharper early audience is people already generating, exchanging, and correcting work artifacts with AI—especially across tools. This remains a behavior-based audience rather than a permanent two-founder headcount restriction.

The acquisition hypothesis becomes: help one person save and reuse useful work; the shared file gives a teammate a reason to join. This is not automatically viral. The recipient must receive value from viewing the file before being forced to connect an agent.

Storage capacity will not justify a new subscription by itself. Existing drives are often already purchased. Repeated collaborative use, trustworthy review, and later automation must earn the extra workspace. The existing “free to drive, paid for autopilot” model should be tested against the possibility that collaboration—not background execution—is the benefit users actually value.

Avoid a Drive-replacement project. Start with newly created AI work; leave archives where they are. If external files are linked later, define one authoritative source and explicit import/snapshot behavior. Two silently editable masters recreate the original version problem.

## Run five real correction cycles before expanding scope

Use actual Simon/Alek CSV work in their normal harnesses. Record the generation tool and file sizes; these remain unconfirmed and materially affect transfer feasibility.

For five successive cycles, observe:

1. Can the file land in the team workspace without a manual download/upload?
2. Can the other person find the correct current file without a pasted attachment?
3. Does the correction preserve the same identity and all unintended-to-change data?
4. Can both people inspect the history and retrieve the exact version used earlier?
5. Does either person return voluntarily for the next task?

Measure manual handling, time to correct reuse, wrong-version incidents, and repeated second-person use. The activation event is a successful reuse or revision in a later context—not merely an MCP connection or first upload.

Run one comparable cycle with the best existing Drive/Dropbox setup available to both people. If it delivers the same outcome with equivalent friction, the differentiated hypothesis must move to review context, version-aware dependencies, or another observed gap. Do not respond by adding an arbitrary checklist of storage features.

The next onboarding prototype should therefore demonstrate one authentic shared file being saved, found, corrected, and resumed. Expand from evidence of repeat use, not from the elegance of the “Git for non-code” metaphor.

## Source and document status

Official product documentation was consulted on 2026-09-08; links are attached to the claims they support. Vault sources describe strategy or historical implementation evidence and are labeled accordingly. No competitor performance claims, current pricing comparisons, or willingness-to-pay findings were established. No production artifacts were created or modified for this research.

Suggested permanent home after validation: `product/tokenrip/` as the file-collaboration onboarding decision, with experiment results appended rather than treating this recommendation as settled strategy.
