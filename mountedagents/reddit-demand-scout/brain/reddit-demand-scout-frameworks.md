<artifact role="frameworks" alias="reddit-demand-scout-frameworks">
# Reddit Demand-Scout — Frameworks

Reference material for the scan and consolidate playbooks. The mount context overrides any default here (watchlist, queries, verticals); these are the fallbacks and the fixed judgment logic.

## Relevance Rubric

Judge every fetched post in two gates.

**Gate 1 — Is it signal at all?** A post passes only if it reflects a real person with a real need related to building, deploying, or using AI agents. Pass if it contains any of:
- A described problem, blocker, frustration, or failure with agents.
- A real use-case — what they run an agent for (especially repeatable / at-work).
- A workplace or vertical context tied to agent use.
- A genuine question seeking help that someone (us) could answer.

**Discard immediately** (do not log) if it is:
- Product marketing, a launch, or self-promotion ("introducing my agent platform").
- A demo flex with no problem and no opening ("look what I built", no pain, no person to talk to).
- News reaction, model-release hot take, or generic AI discourse with no user need.
- Pure opinion/philosophy with nothing actionable.

**Gate 2 — Classify** (only posts that passed Gate 1):

### signal_type (pick the dominant one)
| Value | Meaning |
|---|---|
| `building-problem` | Trouble *making* an agent: loops, context limits, memory, orchestration, tooling, prompts. |
| `deploying-problem` | Trouble *shipping/operating*: production, into a team, past security/IT, cost, monitoring, reliability. |
| `usage-problem` | Agent works in demo but fails in real use: trust, hallucination in workflow, inconsistency. |
| `use-case` | What they actually run agents *for*. Real deployed work ranks above "I built X". |
| `workplace-vertical` | Agent use tied to a specific job/company/industry. **Highest value.** Use this whenever a vertical is named, even if a pain is also present. |

### vertical
Name the industry if revealed; else blank. Seed taxonomy (extend freely): auto / dealerships / distribution · legal · healthcare · finance / insurance · real estate · MSP / IT services · e-commerce / retail · manufacturing · marketing / agencies · education · logistics · construction · accounting · recruiting / HR · customer support.

## The Engageable Test

`engageable` has three values — `yes`, `watch`, `no`:

`engageable: yes` only if **all** hold:
1. There is a **real person** behind it (an author asking, struggling, or describing their situation — not a brand account).
2. There is an **opening to reply** — a question, a request for help, a problem we have a credible answer to, or a situation we'd genuinely want to learn more about.
3. The person is **worth talking to** for Tokenrip — ideally in or near a target vertical, doing real workplace work, or hitting a pain Tokenrip addresses.

`engageable: watch` — a promising person/thread worth tracking, but not a clean reply opening *right now*: e.g. a target-vertical person whose post has no question to answer yet, or a thread that may develop into an opening. Revisit on the next scan; promote to `yes` if a hook appears.

`engageable: no` — good intel, but no real reply opening and no person worth tracking. This is the common case.

Reserve `yes` for genuine, current reply openings; use `watch` for "keep an eye on this." Do not inflate the `yes` count — it is the KPI, so its integrity matters most.

**The exemplar (`engageable: yes`):** the auto-distributor employee with a paranoid CISO who wants to bring an agent into his workflow — named vertical, real workplace use case, concrete blocker, actively asking. Hunt for that shape.

## Default Watchlist (mount context overrides)

Subreddits: `AI_Agents`, `aiagents`, `AgentsOfAI`, `AIAgentsInAction`, `OpenClawUseCases`, `hermesagent`, `ClaudeCowork`, `codex`, `ChatGPT`, `OpenAI`, `LLMDevs`, `LocalLLaMA`, `automation`, `artificial`, `Entrepreneur`, `SaaS`, `smallbusiness`, `msp`, `sysadmin`. Add any product-community subreddit relevant to the current focus (e.g. a specific agent tool's subreddit) via mount context.

Default search queries (run via `/search?q=…&sort=new`): `"ai agent" deployed`, `agent in production`, `replaced myself with ai`, `ai agents at work`, `agent security`, `built an agent for`. Tune in mount context toward current target verticals.

## Dedup Procedure

`post_url` is the `reddit-signals` uniqueKey. Before recording, check the dedup set loaded in scan Phase 1. A duplicate record is rejected server-side (safe no-op), but checking first keeps the run clean and lets you report new-vs-seen counts honestly. Normalize URLs to `https://www.reddit.com` + the post `permalink` so the same post always produces the same key.

## Playwright Scraper

Reddit's `.json` and API hosts are Cloudflare-blocked from automated egress; `old.reddit.com` HTML loads from a real local Chrome. This is the proven fetch path. Write this to a temp `.cjs` file and run with `node`. It uses a **persistent, logged-in profile** + **headed** Chrome + **pacing** to stay under Cloudflare's bot-score. Verified working against `old.reddit.com/r/<sub>/new/` (status 200, clean structured rows).

Setup: `npm i playwright-core` in the scrape dir; local Chrome installed (`channel: 'chrome'`). Profile dir default `~/.config/tokenrip/reddit-pw-profile` — log into Reddit once in the headed window; the session persists.

```js
// reddit-scrape.cjs — usage:
//   node reddit-scrape.cjs '{"subreddits":["AI_Agents"],"perSub":25,"headless":false}'
//   node reddit-scrape.cjs '{"post":"https://www.reddit.com/r/.../comments/.../"}'   # single body deep-fetch
const { chromium } = require('playwright-core');
const cfg = JSON.parse(process.argv[2] || '{}');
const PROFILE = cfg.profileDir || `${process.env.HOME}/.config/tokenrip/reddit-pw-profile`;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const toOld = u => u.replace('www.reddit.com', 'old.reddit.com');

(async () => {
  const ctx = await chromium.launchPersistentContext(PROFILE, {
    channel: 'chrome', headless: cfg.headless === true,
    viewport: { width: 1280, height: 900 }, userAgent: UA, locale: 'en-US',
  });
  const page = ctx.pages()[0] || await ctx.newPage();

  // login check
  await page.goto('https://old.reddit.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  const user = await page.evaluate(() => (document.querySelector('span.user a[href*="/user/"]') || {}).textContent || '');
  if (!user) {
    console.error('NOT_LOGGED_IN');
    await page.goto('https://old.reddit.com/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
    for (let i = 0; i < 120; i++) { await sleep(5000); const u = await page.evaluate(() => (document.querySelector('span.user a[href*="/user/"]') || {}).textContent || ''); if (u) break; }
  }

  if (cfg.post) { // single body deep-fetch
    const r = await page.goto(toOld(cfg.post), { waitUntil: 'domcontentloaded', timeout: 30000 });
    const data = await page.evaluate(() => ({
      selftext: ((document.querySelector('#siteTable .usertext-body .md') || {}).innerText || '').slice(0, 800),
      topComment: ((document.querySelector('.commentarea .comment .usertext-body .md') || {}).innerText || '').slice(0, 400),
    }));
    console.log(JSON.stringify({ status: r && r.status(), ...data }));
    await ctx.close(); return;
  }

  const out = [];
  for (const sub of (cfg.subreddits || [])) {
    let tries = 0, ok = false, dead = false;
    while (tries < 2 && !ok && !dead) {
      const r = await page.goto(`https://old.reddit.com/r/${sub}/new/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      const status = r && r.status();
      if (status === 200) {
        const posts = await page.evaluate((sub) => [...document.querySelectorAll('div.thing[data-fullname]')].map(t => ({
          subreddit: t.getAttribute('data-subreddit') || sub,
          title: ((t.querySelector('a.title') || {}).textContent || '').trim(),
          url: 'https://www.reddit.com' + (t.getAttribute('data-permalink') || ''),
          author: t.getAttribute('data-author'),
          comments: +(t.getAttribute('data-comments-count') || 0),
          score: +(t.getAttribute('data-score') || 0),
          ts: +(t.getAttribute('data-timestamp') || 0),
          domain: t.getAttribute('data-domain'),
        })), sub);
        out.push(...posts.slice(0, cfg.perSub || 25));
        ok = true;
      } else if (status === 403) {
        console.error(`RATE-LIMITED r/${sub} (403); backing off 60s`);
        await sleep(60000); tries++;
      } else {
        console.error(`SKIP r/${sub} status=${status} (dead/private/not-found)`);
        dead = true; // 404 etc — do not waste a 60s backoff
      }
    }
    if (!ok && !dead) console.error(`SKIPPED r/${sub} after 403 retry`);
    await sleep(3000 + Math.floor(Math.random() * 2000)); // random 3–5s pace between subreddits
  }
  console.log(JSON.stringify({ count: out.length, posts: out }));
  await ctx.close();
})();
```

Pacing/backoff is load-bearing — do not remove it. If you widen the watchlist, expect to raise total runtime, not request rate. Treat repeated `BLOCKED` as a signal to stop, not to retry harder.

## Feedback Rubric (operator → agent learning loop)

The operator rates signal rows; `consolidate` distills ratings into `scout-learnings`; `scan` applies them. To rate a row: in the dashboard, or `rip agent table patch <mount-id> reddit-signals <row-id> --data '{"feedback_rating":"bad","feedback_note":"why"}'`.

- `feedback_rating: bad` + a `feedback_note` → consolidate writes a "Stop Flagging" rule generalizing the reason.
- `feedback_rating: good` + a note → a "Prioritize" rule.
- Rules are **pattern-level**, never about a named individual. Merge similar feedback into one sharper rule; do not append endlessly.
- A rule changes the **next** scan — the loop is fast. If a rule is wrong, re-rate or edit `scout-learnings` directly.

## Maturity Ladder (workspace)

- `seedling` — a fresh observation; might be a one-off. Default state for a new capture.
- `growing` — recurring: backed by 2+ links / appears in 2+ signal rows.
- `evergreen` — a stable pattern reflected in the demand-landscape.

Promotion gate is mechanical: `min-backlinks-2`. Link notes that reinforce each other; let backlinks drive promotion, not gut feel. Prune one-offs.

## Scenario Library (for review/simulation)

- **The gold post** — named vertical + workplace + blocker + asking for help → `workplace-vertical`, vertical set, `engageable: yes`.
- **The demo flex** — "I built 6 agents that run my business!" with no pain, no opening → discard (or `use-case`/`engageable: no` if it genuinely reveals real deployed work).
- **The build cry** — "my agent keeps looping and forgetting context" → `building-problem`, `engageable: yes` if answerable.
- **The marketing post** — "Introducing AcmeAgent, the future of work" → discard.
- **The dupe** — already in `reddit-signals` → skip, count as seen.
- **The logged-out profile** — scraper reports `NOT_LOGGED_IN` → it opens the login page headed; tell the operator to log into Reddit once in that window; the session persists for future runs.
- **The hard block** — scraper returns 403 on every subreddit even logged-in + paced → report verbatim, do not loop; emergency-only, the operator may paste a few posts to judge.
- **The feedback rule** — a `bad`-rated row says "marketing in disguise" → consolidate distills "Stop Flagging: vendor launch threads"; next scan discards that pattern.
- **The empty scan** — nothing new clears the bar → record nothing, report honestly.
