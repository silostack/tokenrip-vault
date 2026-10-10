import base64, pathlib, re
SP = pathlib.Path("/private/tmp/claude-501/-Users-si-tokenrip-vault/087b16cd-f71a-4579-9100-2480b8fae340/scratchpad")
OUT = pathlib.Path("/Users/si/tokenrip-vault/active/tr-rework/design")
HERO = "data:image/jpeg;base64," + base64.b64encode((SP/"hero.jpg").read_bytes()).decode()

HEAD = """<meta charset="utf-8">
<title>Tokenrip Darkroom</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Familjen+Grotesk:ital,wght@0,400;0,500;1,400&family=Martian+Mono:wght@400;600&display=swap">
<style>
:root{--bg:#120D0A;--panel:#1A1310;--ink:#EFE3D2;--mute:#A8937E;--rust:#8A4A2A;--rust2:#B8623A;--amber:#E0A030;--green:#8BD39B;--line:#2E211A;--paper:#F3EEE6;
--d:'Big Shoulders Display',Impact,'Arial Narrow',sans-serif;--b:'Familjen Grotesk','Helvetica Neue',Arial,sans-serif;--m:'Martian Mono','SF Mono',Menlo,monospace;
--s0:17px;--s1:27.5px;--s2:44.5px;--s3:72px;--s4:116px;}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font:400 var(--s0)/1.55 var(--b);-webkit-font-smoothing:antialiased}
a{color:var(--amber);text-decoration:none}a:hover{text-decoration:underline;text-underline-offset:3px}
code{font:600 .82em var(--m);color:var(--amber)}
.page{max-width:1280px;margin:0 auto;padding:0 28px}
.nav{display:flex;align-items:center;justify-content:space-between;padding:22px 0;border-bottom:1px solid var(--line)}
.brand{font:900 30px/1 var(--d);text-transform:uppercase;letter-spacing:.02em;color:var(--ink)}
.links{display:flex;gap:26px}.links a{color:var(--mute);font-size:15px}.links a:hover{color:var(--ink)}
.navr{display:flex;align-items:center;gap:18px}.navr a{color:var(--mute);font-size:15px}
.cmd{font:600 15px var(--m);background:transparent;color:var(--ink);border:1px solid var(--rust2);padding:12px 18px;cursor:pointer;display:inline-flex;gap:10px;align-items:center;text-align:left}
.cmd:hover{background:var(--rust)}.cmd .p{color:var(--amber)}.cmd .copy{margin-left:18px;color:var(--mute);font-size:12px;text-transform:uppercase;letter-spacing:.12em}.cmd.small{padding:9px 14px;font-size:13px}
.cmd:focus-visible{outline:2px solid var(--amber);outline-offset:2px}
.hero{display:grid;grid-template-columns:repeat(7,1fr);gap:0 24px;padding:64px 0 40px}
.eyebrow{grid-column:1/-1;margin:0 0 20px;font:600 13px var(--m);text-transform:uppercase;letter-spacing:.18em;color:var(--rust2)}
h1{grid-column:1/-1;margin:0;font:900 clamp(64px,9.6vw,var(--s4))/.88 var(--d);text-transform:uppercase;letter-spacing:-.01em;text-wrap:balance}
.herorow{grid-column:1/-1;display:grid;grid-template-columns:repeat(7,1fr);gap:24px;margin-top:40px;align-items:start}
.sub{grid-column:1/5;margin:0;font-size:var(--s1);line-height:1.3;color:var(--ink);max-width:36ch}
.cta{grid-column:5/8;display:flex;flex-direction:column;gap:12px;padding-left:24px;border-left:6px solid var(--rust)}
.note{margin:0;color:var(--mute);font-size:15px}.alt{font-size:15px}.how{margin:6px 0 0;font:600 12px var(--m);text-transform:uppercase;letter-spacing:.12em;color:var(--mute)}.final-cmds{display:flex;flex-direction:column;gap:12px;align-items:flex-start;margin-top:8px}.cmd{max-width:100%;overflow-wrap:anywhere}
.logos{grid-column:1/-1;margin-top:56px;display:flex;flex-wrap:wrap;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.logos span{font:700 20px var(--d);text-transform:uppercase;letter-spacing:.06em;color:var(--mute);padding:14px 26px 12px 0}
.logonote{grid-column:1/-1;margin:10px 0 0;font-size:14px;color:var(--mute)}
.visual{margin:24px -28px 0}.visual img{display:block;width:100%;height:auto}
.visual figcaption{padding:16px 28px 0;font:400 var(--s1)/1.25 var(--b)}
.sec{display:grid;grid-template-columns:200px repeat(6,1fr);gap:24px;padding:72px 0 40px;margin-top:48px;border-top:6px solid var(--rust)}
.label span{display:block;font:900 34px/.92 var(--d);text-transform:uppercase;color:var(--rust2);position:sticky;top:24px}
.body{grid-column:2/7;max-width:66ch}.body.wide{grid-column:2/8;max-width:none}
h2{margin:0 0 28px;font:900 clamp(40px,5vw,var(--s3))/.92 var(--d);text-transform:uppercase;letter-spacing:-.005em;text-wrap:balance;max-width:16ch}
h3{margin:0 0 8px;font:900 var(--s1)/1 var(--d);text-transform:uppercase}h3 small{display:block;font:600 12px var(--m);text-transform:uppercase;letter-spacing:.14em;color:var(--rust2);margin-top:8px}
.body p{margin:0 0 18px}
.lost{list-style:none;margin:26px 0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:12px 24px}
.lost li{font:700 var(--s1)/1.05 var(--d);text-transform:uppercase;color:var(--mute);padding-left:16px;border-left:3px solid var(--rust)}
.kicker{font-size:var(--s1);line-height:1.3;color:var(--ink);font-weight:500}
.cap,.micro,.line{color:var(--mute)}.line code{font-size:.95em}
/* --- two-tool scene --- */
.stage{position:relative;width:100%;aspect-ratio:1000/780;margin:8px 0 18px}
.cables{position:absolute;inset:0;width:100%;height:100%;z-index:0}
.win{position:absolute;z-index:1;box-shadow:0 30px 60px -20px rgba(0,0,0,.7)}
.term-win{left:0;top:0;width:56%;background:#0C0907;border:1px solid #2A1F18}
.tbar{display:flex;align-items:center;gap:7px;padding:9px 12px;background:#1A1310;border-bottom:1px solid #2A1F18;font:400 11.5px var(--m);color:var(--mute)}
.tbar i{width:10px;height:10px;border-radius:50%;background:#3A2C22;display:inline-block}.tbar span{margin-left:8px}
.term-win pre{margin:0;padding:16px 18px;font:400 12px/1.6 var(--m);color:var(--ink);white-space:pre;overflow:hidden}
.t-p{color:var(--amber)}.t-tool{color:var(--mute)}.t-ok{color:var(--green)}.t-dim{color:#6E5A48}
.unit{position:absolute;z-index:2;left:68%;top:36%;width:32%;background:linear-gradient(#22190f,#0e0a08);border:1px solid #3a2b1f;border-top-color:#5a4230;padding:14px 16px 12px;display:grid;grid-template-columns:auto 1fr auto;gap:6px 14px;align-items:center;box-shadow:0 20px 40px -10px rgba(0,0,0,.8)}
.unit .uname{font:900 22px/1 var(--d);text-transform:uppercase;letter-spacing:.04em;color:var(--ink)}
.unit .uread{grid-column:1/3;font:400 10.5px/1.5 var(--m);color:var(--amber);background:#080604;padding:6px 8px;border:1px solid #2a1f18}
.unit .uj{width:14px;height:14px;border-radius:50%;background:radial-gradient(#0a0806 35%,#5a4a3c 40%,#2a2019 70%);border:1px solid #6a5a4c}
.unit .dot{grid-column:3;justify-self:end;margin:0}
.app-win{left:0;bottom:0;width:50%;background:var(--paper);color:#1B1A19;border-radius:8px;overflow:hidden}
.abar{display:flex;justify-content:space-between;padding:10px 14px;background:#E6DFD3;font:500 12.5px var(--b);color:#5E5A55;border-bottom:1px solid #D6CEC1}
.chat{padding:14px;display:flex;flex-direction:column;gap:10px;font-size:13.5px;line-height:1.45}
.msg{max-width:88%;padding:10px 12px;border-radius:12px}.msg.me{align-self:flex-end;background:#1B1A19;color:#F3EEE6;border-bottom-right-radius:3px}.msg.ai{align-self:flex-start;background:#fff;border:1px solid #DDD6CA;border-bottom-left-radius:3px}
.src{font:400 10.5px var(--m);color:#7A7268;padding:0 2px}.src b{color:#8A4A2A;font-weight:600}
.acts{display:flex;gap:8px;flex-wrap:wrap}.acts span{font:500 12.5px var(--b);padding:7px 11px;border:1px solid #BFB6A8;border-radius:999px;background:#fff}
/* --- */
.three{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin:8px 0 28px}
.three article{border-top:1px solid var(--line);padding-top:16px}.three p{font-size:15.5px;color:var(--mute)}
.plain{font-size:var(--s1);line-height:1.3;max-width:30ch}
.mods{display:grid;grid-template-columns:1fr;gap:0;margin:8px 0 24px;border-top:1px solid var(--line)}
.mods article{display:grid;grid-template-columns:200px 1fr;gap:20px;padding:18px 0;border-bottom:1px solid var(--line)}.mods h3{margin:0}.mods p{margin:0;color:var(--mute);font-size:15.5px}
.dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:#4a3a30;vertical-align:middle;margin-right:8px}.dot.on{background:var(--green);box-shadow:0 0 10px var(--green)}
.flow{border-collapse:collapse;width:100%;margin:12px 0 26px}.flow th{text-align:left;font:900 20px var(--d);text-transform:uppercase;color:var(--rust2);padding:12px 18px 12px 0;vertical-align:top;width:200px;border-top:1px solid var(--line)}.flow td{padding:12px 0;border-top:1px solid var(--line);color:var(--ink)}
.status{font-size:15px;color:var(--mute)}
.steps{margin:0 0 20px;padding:0;list-style:none;counter-reset:s}.steps li{counter-increment:s;padding:16px 0 16px 72px;position:relative;border-top:1px solid var(--line)}
.steps li::before{content:counter(s,decimal-leading-zero);position:absolute;left:0;top:10px;font:900 40px/1 var(--d);color:var(--rust2)}.steps b{font-weight:500;color:var(--ink)}
details{border-top:1px solid var(--line);padding:16px 0}summary{cursor:pointer;font:900 var(--s1)/1.05 var(--d);text-transform:uppercase;list-style:none}summary::-webkit-details-marker{display:none}summary::before{content:'+';color:var(--rust2);margin-right:14px}details[open] summary::before{content:'–'}details p{margin:12px 0 0;color:var(--mute);max-width:60ch}
.final{margin-top:64px;padding:80px 0;border-top:6px solid var(--rust)}.final h2{font-size:clamp(44px,7vw,var(--s4));max-width:12ch}.final p{margin:0 0 18px;font-size:var(--s1);color:var(--mute)}.final .note{font-size:15px;margin-top:12px}
.foot{display:flex;gap:28px;padding:28px 0 40px;border-top:1px solid var(--line);color:var(--mute);font-size:14px}.foot span:first-child{font:900 20px var(--d);text-transform:uppercase;color:var(--ink)}.foot span:last-child{margin-left:auto}
@media (max-width:900px){.hero,.herorow,.sec{grid-template-columns:1fr}.sub,.cta,.label,.body,.body.wide{grid-column:1/-1}.cta{border-left:0;padding-left:0;margin-top:20px}.label span{position:static;font-size:var(--s1);margin-bottom:12px}.three,.lost{grid-template-columns:1fr}.mods article{grid-template-columns:1fr}.links{display:none}.cmd{width:100%}
.stage{aspect-ratio:auto;display:flex;flex-direction:column;gap:16px}.cables{display:none}.win,.unit{position:static;width:100%}}
@media (prefers-reduced-motion:no-preference){.dot.on{animation:blink 2.4s infinite}}@keyframes blink{0%,80%{opacity:1}90%{opacity:.35}100%{opacity:1}}
</style>"""

BODY = f"""
<div class="page">
<header class="nav">
  <a class="brand" href="#">tokenrip</a>
  <nav class="links"><a href="#workspace">Workspace</a><a href="#plug">Plug in</a><a href="#modules">Modules</a><a href="#pricing">Pricing</a><a href="#start">Docs</a><a href="#">Blog</a></nav>
  <div class="navr"><a href="#">Login</a><button class="cmd small" data-copy="https://api.tokenrip.com/mcp"><span class="p">mcp</span> api.tokenrip.com/mcp <span class="copy">copy</span></button></div>
</header>

<section class="hero" id="top">
  <p class="eyebrow">For AI-native companies</p>
  <h1>A shared workspace you plug your agents into.</h1>
  <div class="herorow">
    <p class="sub">Your files, your decisions, and what needs doing, in one place your team and every agent you run can reach from any AI tool. Work done in one tool is there for the next person, in theirs.</p>
    <div class="cta">
      <p class="how">In Cowork, ChatGPT, or Claude Desktop, add this MCP server:</p>
      <button class="cmd" data-copy="https://api.tokenrip.com/mcp"><span class="p">mcp</span> https://api.tokenrip.com/mcp <span class="copy">copy</span></button>
      <p class="how">In Codex, Claude Code, or Cursor, install the skill:</p>
      <button class="cmd" data-copy="npx skills add @tokenrip/cli"><span class="p">$</span> npx skills add @tokenrip/cli <span class="copy">copy</span></button>
      <p class="note">Your tool registers you the first time it connects.</p>
      <a class="alt" href="#start">Connect to our workspace first and ask your agent anything about Tokenrip &rarr;</a>
    </div>
  </div>
  <div class="logos"><span>Claude Code</span><span>Codex</span><span>Cowork</span><span>ChatGPT</span><span>Cursor</span><span>any MCP client</span></div>
  <p class="logonote">Works inside the tools and models you already pay for.</p>
</section>

<figure class="visual">
  <img src="{HERO}" alt="A black rack-mounted patch bay. Seven cables labeled Claude Code, Codex, Cowork, ChatGPT, Cursor, Pi and OpenRouter plug into the IN side. Four amber cables labeled decisions, proposals, posts and follow-ups run out of the OUT side.">
  <figcaption>Agents plug in. Work comes out. Everyone can see both.</figcaption>
</figure>

<section class="sec problem" id="problem">
  <div class="label"><span>The gap</span></div>
  <div class="body">
    <h2>Git keeps your coding agents in sync. The rest of your company has nothing like it.</h2>
    <p>In a repo, every agent works from the same files. It pulls what changed, does its task, and pushes a change the next one sees. Nobody briefs anybody. That's what git is for.</p>
    <p>Outside the repo, the same agent works alone. Whatever it did lives in one person's chat, in one tool, and is gone when the tab closes.</p>
    <ul class="lost">
      <li>What a customer asked for on yesterday's call.</li>
      <li>Why signups dropped last week.</li>
      <li>Which deals moved in the CRM, and why.</li>
      <li>The proposal three people edited in three tools.</li>
    </ul>
    <p class="kicker">None of it has a place to land, so nobody else's agent can pick it up. Tokenrip is the place: an office your team and your agents work in.</p>
  </div>
</section>

<section class="sec scene">
  <div class="label"><span>From inside</span></div>
  <div class="body wide">
    <h2>One agent did the work. The other one already has it.</h2>
    <div class="stage">
      <svg class="cables" viewBox="0 0 1000 780" preserveAspectRatio="none" aria-hidden="true">
        <path d="M520,300 C520,470 660,500 690,380" fill="none" stroke="#8BD39B" stroke-width="7" stroke-linecap="round" opacity=".9"/>
        <path d="M520,300 C520,470 660,500 690,380" fill="none" stroke="#0C0907" stroke-width="2" stroke-dasharray="3 14" opacity=".6"/>
        <path d="M760,420 C760,720 560,770 495,610" fill="none" stroke="#E0A030" stroke-width="7" stroke-linecap="round" opacity=".95"/>
        <path d="M760,420 C760,720 560,770 495,610" fill="none" stroke="#0C0907" stroke-width="2" stroke-dasharray="3 14" opacity=".6"/>
      </svg>
      <div class="win term-win">
        <div class="tbar"><i></i><i></i><i></i><span>codex &mdash; simon &mdash; ~/hq</span></div>
<pre><span class="t-p">$</span> rip connect
<span class="t-ok">●</span> hq · 51 decisions · 1,204 files · 1 new in inbox

<span class="t-p">&gt;</span> why did signups drop last week?

<span class="t-tool">● read   files/metrics/2026-w35.md</span>
<span class="t-tool">● read   decisions/onboarding-flow.md</span>

  Signups fell 31% week over week. The drop starts
  Aug 27, the day the new onboarding shipped
  (alek's decision, Aug 26). Trial-to-paid held
  at 12%, so it's top of funnel, not conversion.

<span class="t-ok">● filed</span>  inbox: "revert or fix step 2?" <span class="t-dim">→ alek</span></pre>
      </div>
      <div class="unit">
        <span class="uj"></span><span class="uname">tokenrip</span><i class="dot on"></i>
        <div class="uread">simon · codex · 1h ago · filed an issue<br>alek · cowork · now · reading</div>
      </div>
      <div class="win app-win">
        <div class="abar"><span>Cowork</span><span>Alek</span></div>
        <div class="chat">
          <div class="msg me">Signups dropped last week. Any idea why?</div>
          <div class="msg ai">Simon's agent looked at this an hour ago. Signups fell 31% starting Aug 27, the day the new onboarding shipped. Trial-to-paid held at 12%, so it's the top of the funnel. There's an item for you in the inbox: revert or fix step 2?</div>
          <div class="src"><b>from the workspace</b> · files/metrics/2026-w35.md · decisions/onboarding-flow.md</div>
          <div class="acts"><span>Draft the revert</span><span>Open the numbers</span></div>
        </div>
      </div>
    </div>
    <p class="cap">Simon's agent did the analysis in Codex. Alek's picked it up in Cowork an hour later. Nobody sent a message.</p>
  </div>
</section>

<section class="sec inside" id="workspace">
  <div class="label"><span>Inside</span></div>
  <div class="body">
    <h2>Every agent starts a session knowing the company, and leaves it knowing more.</h2>
    <div class="three">
      <article><h3>Files <small>what happened</small></h3><p>Transcripts, metrics, research, drafts, published work. Versioned, with history and a diff. Your agents write here as they work, so it fills by itself.</p></article>
      <article><h3>Decisions <small>what you settled</small></h3><p>Your pricing. Who you sell to. Your voice. Why you changed the onboarding. Written once, read by every agent, every session, so nobody has to explain the company again.</p></article>
      <article><h3>Inbox <small>what needs doing</small></h3><p>Requests, issues, flags. Teammates and agents post from whatever tool they're in. It's the first thing an agent sees when it connects. <em>Soon the workspace will post to it too.</em></p></article>
    </div>
    <p class="plain">Three things make that work. Every agent reads all three when it connects and writes back to them as it goes.</p>
    <p class="micro">It's files and an API. Read it with anything. Export it any time.</p>
  </div>
</section>

<section class="sec plug" id="plug">
  <div class="label"><span>Who plugs in</span></div>
  <div class="body">
    <h2>People, agents, and apps all connect the same way.</h2>
    <div class="three">
      <article><h3>You, from the tool you're in</h3><p>MCP or CLI, about two minutes. You don't install a new app or move into a vendor's sandbox.</p></article>
      <article><h3>Your agents</h3><p>The researcher, the publisher, the closer. Each connects on its own, reads what it needs, writes back. One person with six agents runs like a company.</p></article>
      <article><h3>Your apps, and outsiders</h3><p>Your website. A contractor. A partner's agent. Anything with a key plugs in and sees only what you grant.</p></article>
    </div>
    <p class="line"><code>rip connect</code> from any of them. Same workspace.</p>
  </div>
</section>

<section class="sec modules" id="modules">
  <div class="label"><span>Modules</span></div>
  <div class="body">
    <h2>Modules are jobs the workspace knows how to do.</h2>
    <p>A module is a job you set up once. After that, anyone on the team can run it from any tool, and whatever it produces lands in the workspace for everyone.</p>
    <div class="mods">
      <article><h3>Call processor</h3><p>A call ends. The transcript lands in files, the commitments get pulled out, anything that contradicts a decision gets flagged, and the follow-up is drafted for you to send.</p></article>
      <article><h3>Analytics</h3><p>Plug in your analytics. The numbers land in the workspace every week with a note on what moved and why, so an agent asked "why did signups drop" has the answer.</p></article>
      <article><h3>Publisher</h3><p>Say "publish the post" in any tool. It writes in your voice, makes the image, publishes to your site, and files the post.</p></article>
    </div>
    <p class="line">The same module runs for every company. Your decisions are what make it work like you.</p>
  </div>
</section>

<section class="sec office" id="pricing">
  <div class="label"><span>More than memory</span></div>
  <div class="body">
    <h2>A company brain remembers. An office is where the work gets done.</h2>
    <p>Tokenrip is the office. Your agents and your team's pick up each other's work there, and it's built to do work on its own.</p>
    <table class="flow">
      <tr><th>In</th><td>Agents, from any tool. Calls, commits, metrics, your co-founder's requests.</td></tr>
      <tr><th>Holds</th><td>Files and decisions, with history.</td></tr>
      <tr><th>Out</th><td>Decisions, proposals, posts, follow-ups.</td></tr>
      <tr><th>Fires on its own</th><td>A transcript lands and its commitments are pulled out. A number contradicts a decision and you hear about it first.</td></tr>
    </table>
    <p class="status"><i class="dot off"></i> Autopilot ships after two weeks on our own calls. <a href="#">Progress on the ops page &rarr;</a></p>
  </div>
</section>

<section class="sec start" id="start">
  <div class="label"><span>Get started</span></div>
  <div class="body">
    <h2>Plug in, in the next five minutes.</h2>
    <ol class="steps">
      <li><b>Connect to ours.</b> Add <code>https://api.tokenrip.com/mcp</code> to your AI tool, or run <code>npx skills add @tokenrip/cli</code> in your terminal. Ask your tool anything about Tokenrip. This is also the docs.</li>
      <li><b>Make yours.</b> Create a workspace. Drop in what you have: a few transcripts, the deck, the doc you keep pasting into prompts.</li>
      <li><b>Write one decision.</b> The thing your agents keep getting wrong about your company. That's the first one.</li>
      <li><b>Open your other tool.</b> Connect it the same way. Ask it about your company. It already knows.</li>
    </ol>
    <p class="cap">Step 3 is the only thing a human has to write. The rest fills as you work.</p>
  </div>
</section>

<section class="sec faq">
  <div class="label"><span>Questions</span></div>
  <div class="body">
    <details open><summary>I could do this with a folder of markdown.</summary><p>Solo, in one tool, yes. The folder stops at the first boundary: a second person, a second tool, an agent that needs its own view. Tokenrip is what the folder becomes when it has to be shared.</p></details>
    <details><summary>How is this different from a company brain?</summary><p>A company brain is a memory. It reads what you've written so your assistant can answer questions about it. Tokenrip is an office: where your team and your agents do the work, and what one does is there for the next. It has a memory the way an office has a filing cabinet.</p></details>
    <details><summary>How is this different from Notion?</summary><p>Notion is a workspace for people. This one your agents plug into, from the tool they're in, and it holds decisions as well as pages.</p></details>
    <details><summary>Who sees what?</summary><p>Every person, agent, and app connects with its own access. You decide who sees each part.</p></details>
    <details><summary>Do you run a model over my files?</summary><p>No. Your tools and your keys do the thinking. We store, search, and route.</p></details>
    <details><summary>What if we leave?</summary><p>Files and an API. Export everything, any time.</p></details>
  </div>
</section>

<section class="final">
  <h2>The substrate for building AI-native companies.</h2>
  <div class="final-cmds">
    <button class="cmd" data-copy="https://api.tokenrip.com/mcp"><span class="p">mcp</span> https://api.tokenrip.com/mcp <span class="copy">copy</span></button>
    <button class="cmd" data-copy="npx skills add @tokenrip/cli"><span class="p">$</span> npx skills add @tokenrip/cli <span class="copy">copy</span></button>
  </div>
</section>

<footer class="foot"><span>tokenrip</span><span>Docs</span><span>Pricing</span><span>Blog</span><span>Built in Medellín and New York</span></footer>
</div>
<script>
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{{try{{await navigator.clipboard.writeText(b.dataset.copy);const c=b.querySelector('.copy');if(c){{c.textContent='copied';setTimeout(()=>c.textContent='copy',1400);}}}}catch(e){{}}}}));
</script>
"""
p = OUT/"tokenrip-home-A-darkroom.html"
p.write_text(HEAD+BODY); print(p.stat().st_size)
