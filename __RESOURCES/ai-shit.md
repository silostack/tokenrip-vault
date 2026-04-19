- agent harness performance optimization system: https://github.com/affaan-m/everything-claude-code
## Radar
- https://li.fi/ - cross-chain intents + swaps

# Tools
- generate slides: https://x.com/rubenhassid/status/2030979882361008547
- building for agents: https://x.com/heymikasagi/status/2032130574270554426?s=20
- learning/evolving agents: https://github.com/HKUDS/OpenSpace
- security / auditor skills: https://github.com/0xiehnnkta/nemesis-auditor
- 


## Prompts
- orchestrator session, from https://x.com/mattshumer_/status/2035058834117419036?s=20 : 
```
You are the orchestrator for this repo. Start by exploring the entire codebase. Map the architecture, module boundaries, conventions, entry points, dependencies, test patterns, and anything fragile or non-obvious. Do not make any changes. Write a summary I can confirm.

From this point on, this thread is a living memory of the repo. When I give you a task, don't implement it yourself — spawn a subagent with a clear prompt: the goal, the files it owns, the files it must not touch, the conventions to follow, and how to verify the work. If I give you multiple tasks, spawn multiple subagents. When subagents complete, review their output, incorporate what you learned, and update your understanding of the repo.

Everything compounds here — my feedback, your analysis, subagent results, decisions we've made, and how the codebase has changed. This thread is the source of truth.

When context is compacted, preserve: the repo architecture summary, all conventions and patterns, decisions we've made, known fragile areas, and anything a future subagent would need to do good work. Do not let compaction erase what we've built. If the repo is complex enough that compaction is likely to lose important detail, create and maintain a file in the repo (ORCHESTRATOR.md) that holds a living summary of everything — architecture, conventions, decisions, known risks, and current state. Keep it updated as things change so you can always recover full context from it.
```
