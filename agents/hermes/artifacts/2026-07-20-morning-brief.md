> Canonical: https://tokenrip.com/s/0e592340-dbc6-4cec-a7ee-04de48c0e2ae

# Morning Brief — 2026-07-20

## Distribution
Backlog grew 8 → 11 since 2026-07-19 (`last_run` 2026-07-19T20:10:11Z; see `ops/distribution-state.json`). The growth was a content-gap sweep — three adjacent blog-post / positioning items surfaced from cross-checking the 29 published posts (latest 2026-07-03) against the May 2026 thesis docs that had no public artifact yet. Drafted the highest-leverage gap; sequenced or deferred the other two.

**Drafted (6) — awaiting your go-ahead to queue:**
- Quintel (quintel.ai) distribution & registry checklist (6 sections: industry directories, G2/Capterra, EF SEO seeds, technical surfaces, compliance/trust, what-not-to-do) — `ops/drafts/quintel-distribution-checklist.md`
- Agent-readable surfaces audit + `.well-known/agent-card.json` draft (llms.txt, robots.txt, sitemap.xml already live; Tier B write required) — `ops/drafts/agent-readable-surfaces.md`
- Blog post outline: "Your AI Agent Can't Find Your Tool (and what to do about it)" (zero-competition keywords; fills a 29-post gap) — `ops/drafts/blog-post-llm-discovery.md`
- Show HN post draft (Tier 4 — held until registry blitz + onboarding polish confirmed done) — `ops/drafts/show-hn-post.md`
- Quintel SEO keyword bank — 8–10 pillar pages, 3 phases, ICP-driven query clusters, Semrush-first validation — `ops/drafts/quintel-seo-keyword-bank.md` *(still carrying open questions)*
- Blog post outline: "What Zapier couldn't copy for nine years, applied to agents" (Make.com disintermediation + custom-interfaces-on-artifacts wedge; ~2,200 words; **conditional on Chief of Staff Phase 0 custom UI shipping** — without that lighthouse the post loses load-bearing evidence) — `ops/drafts/blog-post-custom-interfaces-on-artifacts.md`

**New / execution-only (3) — no drafting needed, surfaces daily:**
- Smithery + mcp.so registry submissions (Tier 1 still open; `server.json` live)
- PRs to awesome-mcp-servers / awesome-claude-code / awesome-cursorrules (~166k stars combined)
- GitHub topics audit across all tokenrip/* repos (`mcp`, `ai-agents`, `claude-code`, `ai-collaboration`) — ~5 min

**New / sequenced-behind-predecessor (1):**
- Blog post outline: "The Lighthouse Imprint Is the Playbook" (Substack/Roblox creator-acquisition mechanics for mounted-agent distribution). NOT drafted to avoid opening a third workstream — depends on the custom-interfaces post shipping first so the cross-link works. Track in backlog; ready to draft once predecessor has engagement signal.

**New / documentation refactor (1) — surfaced but no draft produced:**
- Sharper positioning update: "Tokenrip is Make for the operator output layer" — refactor `external-positioning.md` + `tokenrip-positioning.md` to apply the Make.com-memo recommendation. Not a new artifact, Tier B write into the live repo. Worth promoting to `queued` if you have a partner/inbound conversation this week.

Drafts live at `/home/dbot/projects/hermes-vault/ops/drafts/`.

## Flags / needs your decision
- **Chief of Staff Phase 0 custom UI is now a gating dependency** for the new custom-interfaces blog post. The post is drafted but cannot promote to `queued` until the Make.com memo's 4-week hand-coded custom UI ships — that's the load-bearing evidence. Worth confirming this week's UI progress before scheduling the post.
- Quintel SEO keyword bank still carries open questions (Semrush-first vs. ship-first; Phase 3 deferral gate until first customer).
- DASHBOARD.md unchanged since 2026-07-07 — Distribution remains P1 background, not this week. Quintel v1 customer-data-first and Stephanie's AICAP build (Week 2) are the active P0s.

## Outreach / Code
State files don't exist yet (Phase 2 / Phase 3 not built). Omitted per skill guardrail — no invented content.
