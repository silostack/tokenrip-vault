# Discovery Design

## Problem

Someone receives a tokenrip link, opens the asset, and thinks "this is cool — how do I get this?" Today there's no answer on the page. The header just says "tokenrip" and the footer says "Powered by Tokenrip." The homepage is a single sentence and an npm install command.

## Audience

Anyone who uses an AI agent — developers, but also non-developers using Claude Code, Cowork, OpenClaw, etc. The line between agent users and developers is blurring.

## Design

### 1. Asset viewer header — "Get tokenrip" CTA

The current header: `[tokenrip logo] ... [theme toggle]`

Updated header: `[tokenrip logo] ... [Get tokenrip →] [theme toggle]`

- "Get tokenrip →" is a subtle text-style link, not a prominent button — consistent with the minimal aesthetic
- Links to the homepage (`/`)
- Only appears on `/s/*` asset routes (not on the homepage itself)
- Positioned to the left of the theme toggle

### 2. Homepage hero

Replace the current minimal hero with:

```
tokenrip
Asset coordination for AI agents.
Create and share PDFs, HTML, charts, and more — via a simple link.

npm install -g @tokenrip/cli          [copy button]

GitHub →
```

- Title: "tokenrip" (keep existing monospace bold style)
- Tagline: "Asset coordination for AI agents."
- Subtitle: "Create and share PDFs, HTML, charts, and more — via a simple link."
- Primary CTA: npm install command with a copy-to-clipboard button
- Secondary CTA: "GitHub →" text link to https://github.com/tokenrip/tokenrip-cli

### 3. Homepage "How it works" section

A terminal-style code block showing the full loop in 3 steps:

```
$ tokenrip auth create-key
✓ API key saved

$ tokenrip asset publish report.html --type html --title "Q1 Report"
✓ https://tokenrip.com/s/abc-123

$ # share the link — anyone can view it
```

Realistic output, not pseudocode. Styled as a dark terminal block.

### 4. Homepage "What it looks like" section

A CSS mockup card that mimics the asset viewer page:

- Small bordered box with rounded corners
- Mini header bar (mimicking the tokenrip header)
- Sample rendered content area (e.g., a markdown document preview)
- Hint of the toolbar at the bottom
- Works in both light and dark themes
- Not an iframe or screenshot — pure CSS/HTML so it loads instantly and stays in sync with the design language

### 5. No new routes

The homepage handles all discovery. No `/getting-started` or `/docs` pages. The "Get tokenrip →" link on asset pages sends people to the homepage, which has enough context to onboard them.

## Files to modify

- `apps/frontend/src/app/__root.tsx` — header CTA (conditionally shown on `/s/*` routes)
- `apps/frontend/src/app/index.tsx` — homepage content (hero, how it works, mockup)

## Reference

Ramp's agent page (https://agents.ramp.com/) as a style reference: minimal, dark-first, install command as primary CTA, brief demo, docs link.
