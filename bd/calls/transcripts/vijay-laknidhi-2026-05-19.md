---
contact: Vijay Laknidhi
company: Liberate
date: 2026-05-19
call_type: intel
participants: [Simon Pettibone, Vijay Laknidhi]
prep_file: active/call-prep-vijay-laknidhi-liberate-2026-05-19.md
---

# Vijay Laknidhi Call — 2026-05-19 (Cleaned Transcript)

**Vijay:** Appreciate you taking the time. I stumbled upon your profile, found it interesting and want to chat about what you're building with Tokenrip. I can introduce myself first. I am starting to think about what's next and just looking to meet people, looking to meet entrepreneurs and see where my skills could be a potential overlap.

I started my career in technology many years back. I was at Goldman Sachs, then moved to consulting for a long time. A lot of capital markets, a little bit of insurance. And then I moved to Hartford after we had kids — life changes prompt location changes — and Hartford, you become a full-on insurance guy. I spent about 10 years at Travelers, the vast majority of which was leading an underwriting transformation there. Had a lot of fun, learned a lot. That's where I really learned insurance. Then I briefly worked for AmTrust, another large carrier. And then last year I made my first leap into startups and I currently work for Liberate. It's a CSB firm and I lead commercial lines. Been doing that since September, having a lot of fun. They didn't really have a commercial lines presence and we've grown it reasonably. It's almost like building a seed company within a Series B company.

We're in an interesting phase now where I'm the only vertical leader and everything else is horizontal. I've had some candid conversations — does it make more sense for me to be a SME? I told him, 10 years from now it'd be a SME, I'd love it. But right now I want to build something and own something end to end. Which is why we decided probably makes sense for me to also look externally.

**Simon:** Our work with AI agent infrastructure, we've been looking at various verticals and your exact vertical was one of the things we were looking at. That's how I came across your profile. For my background — New York City for 10 years, back-end systems engineer working in various startups. I did a stint on Wall Street for a year. Then I started traveling for four years, mostly crypto. Did crypto pretty heavily the past four years or so and then more recently got into Tokenrip.

My co-founder and I — he's not technical, I am technical. I use Claude Code, he uses Cowork, and we're collaborating on documents together. I would create a document, send it to him, he'd copy paste it into his Cowork and fix it up. It was unmanageable. That gave birth to Tokenrip. The idea was to have a collaboration platform where our agents could collaborate fairly easily with us being operators, guiding and working closely with our AI agents.

It developed into infrastructure that you can deploy a new kind of AI agent on. There's a lot of people already using AI with ChatGPT or Claude, already automating their workflows, and there isn't really any good way for them to share those workflows. On Tokenrip infrastructure you can create an agent and then share it with your team member or anybody. I created on Claude Code, you run it on ChatGPT. We started building this about six weeks ago, still super early days.

Right now we're figuring out our go-to-market, trying to talk to as many people as possible. I was happy you reached out — you've got vertical experience deploying this stuff and seeing it in production and I'm sure there's a lot of lessons you've seen and been exposed to. I thought it would be cool to swap notes.

**Vijay:** Love this. I'm going to play back a couple things. AI agents that you can transfer across team members or colleagues, kind of platform agnostic — can be built on one, used on another. I want to dig into that. In my world, in insurance, we are not the most AI savvy industry. Probably even worse than banking. To make that practical: most companies within the walls don't have any fancy AI. The best you might have is Microsoft Copilot. There's a lot of appeal in being able to build an AI agent in Claude and migrate it internally into the walls of a large enterprise that is very risk-averse and still sitting on Microsoft Copilot. Can that work? Is that a helpful use case?

**Simon:** That's almost like a marquee use case. We're targeting more the bottom-up scenario where people are already automating their jobs themselves, usually on their own personal subscriptions, and just having a way to make that readily available for others. Whether it's an AI agent manager building it for the team or an individual contributor who has a workflow and can easily turn it into an agent and send it to a friend. It works with the tools people are already using versus "buy this enterprise plan and everybody has to adopt it."

**Vijay:** Makes sense. For Farmers Insurance to use an agent created by a startup, they would need to install Tokenrip in their environment — is that correct?

**Simon:** They don't have to install anything. You can think of Tokenrip as Dropbox. For coding agents, the problem is coordination — agents with a shared goal syncing on git. Tokenrip doesn't solve coordination, it solves collaboration. Collaboration is different because you have various actors that are independent and can't sync on git cross-organization. We provide that syncing mechanism where you can have artifacts that agents collaborate around, like a Dropbox model except we do versioning and everything you'd get with git, but it works in our cloud. Syncing is seamless with whatever platform you're already using — just HTTP requests, everything versioned, memory is shared. We have a layered memory architecture: shared memory where all agents share, plus layered memory specific to me. That's the underlying substrate. Essentially distributed git.

**Vijay:** Got it. So it's less about creating in one environment and deploying to another — it's more about the collaboration between two people in different environments.

**Simon:** I would say it's both. Imagine a purchase order or contract agreement that two organizations need to collaborate on. Having that document shared across organizations, a collaboration surface. In the case of an agent, it's a set of documents, some of which could be memory. You run an agent, it loads up memory and writes to it so state persists across sessions. I run the agent, it affects the memory, and when you run it you get the outputs of my run.

**Vijay:** This is awesome. There's so many practical use cases. But where my head's going, Simon, is how do you monetize this?

**Simon:** That's exactly what we're trying to figure out. The GTM is what we're wrapping our heads around. It's still relatively early. We're trying to have as many conversations as possible to figure out the initial motion. Maybe go vertical, maybe reach individual contributors. A lot to explore, up in the air.

**Vijay:** I'll give you two insurance use cases. The collaboration part is exciting, but the cross-platform part is to me the monetizable angle. Collaboration almost becomes... I like what you said with Dropbox, but if I work for a startup and have a skill, the best I can do is create a skill and give it to a colleague. That generally works within a company. Me and my colleague being on different AIs is probably not typical. We can get by with the skill.

**Simon:** That's exactly where we started. I would create a skill, give it to my co-founder. But then there are problems — if I update the version, how does that work? It doesn't handle sessions. Where's the memory come into play? That was the starting point and then we fleshed out features.

**Vijay:** I like the platform migration aspect of it a lot. If my company doesn't give me Claude but gives me Copilot, and I go home and work on an awesome skill, and I can get that into my company — and my company is confident in Tokenrip, said "we don't trust Claude yet but we trust Tokenrip, it's secure, it's not going to mess with our ecosystem" — there could be a lot of value there. You'd have to convince the CISOs that you are safer than Claude or OpenAI. But if you were to do that, oh my goodness, there's so much value.

**Simon:** It runs on your local harness — could be Claude, could be whatever. There's Open Code and a bunch where you can run against local models. There's a bunch of industries, law and others, where they don't want to send information to Claude or OpenAI. I've been trolling Upwork posts — there's a decent number that say "needs to run on a local model that we provision." There seems to be general movement in that direction with Claude going after every vertical and OpenAI the same. Everybody's kind of scared to give their data over.

**Vijay:** We spent the last decade getting on the cloud and now everyone wants to go back to on-premise because they don't trust uploading data. I think you're onto something there. That's another interesting angle.

**Simon:** I'm intrigued by your thinking around the migration and portable nature of it, not being tied to a specific provider. That might be a good start.

**Vijay:** I'll give you another example. Travelers, my alma mater — they signed up with Claude. Enterprise partnership, 12,000 users out of 30,000 using Claude. Every developer, every engineer, every product manager. But what if Claude does something egregious? Travelers is an insurance company — they're not going to want to work with any company that has negative PR. If Claude did something egregious, they're screwed. They can't suddenly say all the work everyone's doing disappears tomorrow. To be able to have confidence that their agents will persist even if the AI doesn't persist gives them a lot of peace of mind. Or Claude starts sucking and two years from now Google is the way to go. You're going to change everything from Claude to Google? How? Having agents that persist regardless — I like that angle a lot.

**Simon:** Vendor neutral, no lock-in angle.

**Vijay:** Exactly. I'll definitely think about this further. You're onto something interesting. It's very topical, very the need of the hour. How you marry that with use cases is the question.

**Simon:** If anything comes to mind — we're testing out anything and everything right now. Even if it's a wacky idea, I will make time to hear it.

**Vijay:** Anything else I can help you with right now while I noodle on this?

**Simon:** Your feedback is already pretty valuable.

**Vijay:** Goes without saying, Simon — think of me as your insurance guy. If you want to learn about how something happens in insurance, don't hesitate, just ping me.

**Simon:** Definitely. Likewise — I'm a founder, available 24/7, 2am, don't care, just send me a message.

**Vijay:** Glad we crossed paths. Wonderful meeting you, excited for what you're building. If I have any ideas, I'll definitely ping you.
