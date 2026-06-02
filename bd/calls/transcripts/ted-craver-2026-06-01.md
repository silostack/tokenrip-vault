---
contact: Ted Craver
company: Bevel
date: 2026-06-01
call_type: firm-direct
participants: [Ted Craver (Bevel), Stauss Paulos (VFI — connector), Aleksandar Perak (Tokenrip), Simon Pettibone (Tokenrip)]
prep_file: n/a
source_briefing: bd/deals/equipment-finance/stauss-vfi-tokenrip-briefing.md
note: Call date inferred from context — no explicit date in transcript. Confirm.
---

# Ted Craver / Bevel — Cleaned Transcript (2026-06-01)

> Introduction call. Stauss (our equipment-finance operating partner at VFI) connected Tokenrip to Ted Craver, who runs the revenue/sales side at Bevel — a commercial-finance placement firm. First contact. Cleaned: small talk, greetings, and filler removed; natural speech preserved.

---

**Stauss:** By way of introduction — I've been connected with Simon and Alek for over a year now. We maintained a strong line because they showed me stuff they were working on, and it resurfaced. I'm working with them on the project. Seeing your stuff made me think, let's get these guys on the phone to see if there's appetite, interest, opportunity. Because they're basically building vertically integrated end-to-end agents that can do a plethora of things. My thought, initially starting with your group, is taking your packets — which are terrific, especially from a credit perspective — and implementing them in one of the agents to find the right direct lender a lot faster. If we're working with a direct lender that can agree to your terms and structures right away, it's pretty much what you've prepared — have it talk to this lender and get decisions quicker, or at least route opportunities to your green-light partners, maybe VFI in there. There's only the million-plus deals, companies doing $15 million in revenue, that fit our criteria, and it could go more in depth than that. So I want to pause and see between both groups if there are initial questions — Simon and Alek can ask what your biggest pain point is, and whether we can solve it with the AI agents they're building, which are pretty impressive.

**Ted:** I'll let you guys Q&A me, and I will wax poetic as and when needed.

**Alek:** Stauss hit the nail on the head. We're building AI agents for people like yourself. Our infrastructure is fairly robust, but as far as the verticals go, we're relatively early days. So everything Stauss described is something we could do — but we're also building custom solutions for companies like yourselves, really making sure we're solving your pain points with a tailored solution. First couple questions: one, how are you guys using AI currently, if at all? And two, what are some of the biggest pain points — whether time, or things you aren't able to do in your business?

**Ted:** I'll answer the first one a little sarcastically. You are looking at the user of AI in our company on any depth. Everyone else uses it to clean up some emails. On my side — the revenue/sales side — I've done everything, and I generally use Claude. I'll load in 15 JSON files with credit-union call-report data — roughly 2 to 3,000 data points per 4,500 credit unions — and have it do filters, sorts, searches of various types. I just finished, literally two minutes ago, probably eight different files in Apps Script to run a little baby URL inside a fakey CRM in Google Sheets as the DB. And a lot of research — cite-your-source-type AI stuff, again all through Claude. When I run out of tokens, I take the clean prompt and chuck it in Gemini in Google Workspace and we finish. So no agents, no Google or Claude cowork. Probably low-intermediate. I know enough to be very dangerous, but I haven't broken anything yet.

So, heavy research and a little coding. The pain points — let me back up. Our true field originators drop deals to us, and that's when my firm's work starts. We do some underwriting, which is pretty bland, but it's filled with personally identifiable information, so a little tight there. We put together that basic memorandum Stauss referred to. I think you were being kind about how good it is, but it's solid.

**Stauss:** I met with my team on it — I'm not BSing you. When I showed it to my CFO, telling him about our conversation, I said I really need to develop a clean front-end process that we're anchoring to approvals on these types of deals. As he's going through it, he's like, this is one of the cleanest packages I've seen, especially with deal flow at that level. We see them pretty clean when we're talking $20, $50, $100 million deals. But for the $300K, $1M, $2M deals, you've probably seen the same as me — it's pretty messy, causes delays, not as efficient. Even for me, I'll talk to guys who say "it's in the data room, I'll get you access," and it takes me 15, 20 minutes just to navigate the data room to find what I'm looking for.

**Ted:** That's a pain.

**Stauss:** It was a breath of fresh air to see your packages. When I was talking with Simon and Alek about the ideas of everything they can do — we're obviously going to do something with VFI as one of their design partners, a niche vertical like the origination process, have that be its own thing, then a credit-research prompt, put it into a summary like yours just for the origination side to submit to credit. Stuff that, as we do more deals, saves more time, gets more efficient at scale. I thought of your stuff right away — especially since you sent me nine or ten different opportunities that all look very doable. It's just finding the right niche lender partner to actually do the deal at the rate and whatnot described. Once these guys told me what they do, I was like, this could be a really strong match.

**Ted:** To play off what Stauss was talking about — that's probably our primary pinch point. We did $450 million last year. We placed $450 million worth of loans over roughly 75 different lenders, which — the math alone on that is awful. A lot of those are one-offs. So we have to go find somebody, or dig through our database, which — I'll be transparent — the database I inherited is, think back to 1990. That's the quality. I can't join the tables; they're two separate silos, unjoinable without manual work. It's a nightmare. We take roughly five data points from each lender — geography being the critical one — then typical revenue, LTV requirements, whatever — assume 5 to 10 data points, and we're trying to match each loan to that. Because we don't have clean databases, it's quite literally a room filled with us trying to do it off the top of our head. Which is somewhere an agent could come in very cleanly, with everything in context.

**Stauss:** And even above and beyond the matching — which is great, helps a lot, because you and I have done plenty of calls with all different types of capital providers to find the 75 lenders that actually do a deal — above and beyond the matching, their agent could take it a step further and theoretically underwrite the transaction and have the cleanest possible file that gets submitted to the lender, ideally getting their speed to funding. Assuming they just do their due diligence — lightspeed compared to today.

**Ted:** That would be great, because the time pinch points are the underwriting side as well as the finding-a-lender side. And once you find them, the back-and-forth, that continuing discussion for a while, then going to closing. It's all very people-oriented right now. Emails and Slacks. If that's starting to paint the picture. But ask anything, because I don't know that I'm doing a great job describing our current process.

**Alek:** I think it makes a ton of sense. You're having the underwriting part be very time-consuming, resource-intensive, and the placement is also a pain point. If you don't mind, I'll show you something I prepared right before this call, and you can tell me if it hits on what you're envisioning. Can you see my screen?

**Ted:** I can.

**Alek:** Based on the prior information I had looking through your company — you have your deals that come through onto your desk, and this is where you guys come in, correct? So you'd come in, and let's say you have this deal — you'd pick up, or in this scenario an agent would pick up, and you have all your information: the application, any financials. A lot of these are placeholders. This could essentially underwrite the deal for you. So instead of taking however many hours you'd typically do, this has all the information your agent learns from — how Bevel actually would underwrite a deal. You prepare the document, it has all the financials, and then you're able to place your deal. And this agent would have access to all your placement people — what they lend based off their criteria — and also past historic data of Bevel's dealings with these companies, what they've appeared before. Based on that: hey, this would be a fit, this would be a fit. Drafts the message, and then you do the correspondence with the agent. Is that kind of what you're imagining?

**Ted:** Yeah. And the only secondary silo I'd add — and I'll go to layman's terms — the search for funding partners never ends. So same exact thing: the agent has access to cleaned-up databases, cleaned-up criteria for all our lending partners, along with the drafted placement email, our standard language. It'd be very easy for it to tell, oh, this is the type we sent early, this is the get-off-your-butt-and-do-something email — all the different types. That context is easy. But then we'd also want the totally separate one. My prompt would be: look at my database of aggregated credit-union data and tell me the top 15 that have C&I loans over $25 million. I give it a simple prompt, it goes into the database, pulls it out, exports it. Boom, I've got it, and we start working it. Tell it I want to log a call, log an email, whatever. There are probably two critical silos. You nailed the first one. I just haven't told you about the second one yet.

**Ted:** No points deducted. Stauss, you get a gold star. This is exactly what we've been looking for.

**Stauss:** Like I said, I immediately thought of you. For me, we're tackling volume tremendously, but not in the way you guys are. You have a direct service offering that's very volume-intensive — which is why I thought of you. If I could just upload his PDFs into an agent, have it find the right lender, send everything, talk to your lender partner, see if they're open to a call — almost even do an agent on their side, so pretty much everything's being done. Especially the type of financing that's all about ratios, very math-intensive, that warrants the approval. For me, I'm looking at more of the story side, which is a bit more difficult. But it's: here's the box that's approvable from this capital source. You're basically sending them what should be an approved deal that could go right to their committee, theoretically prepared, and they do a once-over to make sure it's everything they need, send it to committee, get a decision.

**Ted:** Off we go.

**Ted:** Let me ask a dumb question, because it'll come up with us. As background, I spent 20 years in banking itself, so the compliance side — I'll never get away from it. If I have a stack of files, it's rife with Social Security numbers and things like that. How am I getting around that? How does the agent handle all that PII I've got to be careful with? Or am I even asking the right question at this point?

**Simon:** I'm Simon, the product/engineering guy, so I'll take this one. Your concern is extremely valid — a very valid question. There are a bunch of different ways to handle it. In general, compliance across almost any industry comes down to PII and having a way to handle the data securely. That can look like — say you're using Claude or OpenAI. They have specific plans set up for that, a compliance-friendly plan. Any data you send to the model is never touched for training, never used for anything else. It's basically a guarantee you can use it in a compliant manner. That's one thing.

Another: you can switch to a local model. Say you don't want to send anything out of your network — I'll just use a local model internally. Depending on need, maybe you don't need the latest version of Claude or ChatGPT, and local models are now maybe three to six months behind where ChatGPT and Anthropic are — completely fine for, I'd say, 80 to 90% of the tasks they're used for. That's another potential interface point.

Those are the two most basic that cover most use cases. Then it goes down to architecture, network-level permissions — a bunch of different things depending on what level of compliance you need. If you tell me we need to be SOC 2 compliant with audits once a year, I'll make sure to architect a system that passes all your compliance needs. If you need a complete audit trail for X, Y, and Z, that's covered too. That's the benefit of working as a design partner — we build a custom solution for your specific needs.

**Ted:** I understood everything you just said. I totally get the sandbox. I refer to it as a sandbox.

**Simon:** It is. That's it. I should have just said sandbox.

**Ted:** It's all good. I like all of this. Tomorrow morning I have a meeting with our managing director to go over general life stuff. I'm going to carry this conversation on with him tomorrow, because I do have to bow to the managing director. If I can get a green light from him — which I'm honestly about 90% confident on, because it's all no-harm-no-foul right now, we're just talking — I'd come back to you guys and say, yep, I've got a green light to continue exploring. And honestly, the best place — I could show you the very basic but very functional in-house CRM I use on my side, which is post-underwriting but covers everything I handle with that excessive volume. And we'll sign an NDA. I'll show you the underwriting output, which Stauss may have screen-shared. It's very reasonable in what it's asking for, not a ton of nuance. And I know for a fact, to create an agent that would suck up that information in a sandbox and follow the pattern — that would save an enormous amount of time. Allow us to add what I think are missing pieces or value-added parts, and then specialize per lender. Because Stauss may be obsessed with a defensive-interval ratio for the guarantor, yet some other bank could care less. Having it do all that — yes, yes, yes, and yes.

**Ted:** So if that works for you guys, I think that's a good plan. I've got literal FaceTime with them tomorrow morning, so I'll do that and see what happens next.

**Stauss:** Let us know the feedback, and let's schedule a time later in the week. Once you have the conversation, send the feedback, and assuming we move forward, go ahead and send the NDA so we get that out of the way right away, and we'll get a call set up. I'll work with these guys over the next couple of days with some insights I see, so we can be as prepared as possible. Starting now, let's look further at the conversation specifically around those two main pain points. Let's not deviate — because assuming this becomes a fruitful partnership, it's going to be very easy for these guys to grow and expand: create new agents per vertical or add onto the current agent. So let's focus on the biggest issues, see if we're seeing substantial progress, and take it from there.

**Ted:** That's a great point. Let's do it. Stauss, I owe you one — I appreciate you setting us up.

**Stauss:** You're good. I've been keeping you in mind as I work through this stuff, love to connect the dots where I can. We'll plan to hear from you after your meeting, then late Wednesday, Thursday, or Friday this week to link back up.

**Ted:** Sounds great. And when we link back up — which I'm confident we will — I'll show you the home-built CRM, because that'll provide a lot of context.

**Stauss:** Assuming it moves forward, I'll give them plenty of data you already have, to find nuggets that are slowing things down — ones you know about and are having a tough time overcoming, or stuff you don't even know about. I deal with that all the time. Great to connect, everybody. Let's link back up later this week.

**Ted:** Sounds good. Thank you guys.

**Simon:** Really nice to meet you, Ted.

**Ted:** You too.
