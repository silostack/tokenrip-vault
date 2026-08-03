---
contact: Stauss Paulos
company: VFI
date: 2026-07-08
call_type: firm-direct
participants: [Stauss Paulos (VFI), Aleksandar Perak (Tokenrip/Quintel), Simon Pettibone (Tokenrip/Quintel)]
prep_file: n/a
---

# Stauss Paulos Call — 2026-07-08 (cleaned transcript)

**Focus:** Sourcing deep-dive against the live V1 prospect UI. Stauss walked his full sourcing/signal playbook so Simon can codify it into the origination engine.

---

**Alek:** We're getting the first version of V1 up and running, pretty much set for you to start using it. We have everything set up ingesting the data — a bunch of data sources. Now it's a matter of filtering to the VFI buy box: what types of deals we want surfacing, and then fine-tuning what signals actually make good deals.

**Stauss:** That's going to be the difficult part, but also the major differentiator between the custom-built solution Quintel offers versus the others I've been on. I've been targeting other AI companies specifically for equipment finance to see what's going on. There's one I thought was interesting — I'll share their website. This guy's more trying to capture the broader market, more generalist, more of a SaaS product with CRM capabilities. But you're still relying on end users / people seeking financing to like it and use it to post their deals — that's marketplace-style plus one-off. What's really powerful is: these 12 companies are in your buy box, here's why — for VFI they have audited financials, and they're actively looking for finance. That market signal, the warm/targeted lead, the near-future-to-immediate need — that's where the real value is: connecting with those companies preemptively, getting in front of them, working a deal. Versus "hey this is cool, there's AI" but I'm still relying on people posting their deals.

**Alek:** This is where the inference engine that compounds becomes valuable — detecting based on signals that these people are probably looking for finance in the near-term future. Simon, why don't we show Stauss what we have so far.

**Simon:** *(screen-share)* We've been having more people interested on the sourcing side, so we've been focusing there. This is what you get when you log in. On prospects, we mine the data we can find — from Edgar data all the way to plain web searches on specific companies. They come in, they find your top 10 prospects that match your buy box. We enrich the data — a phone number, an email address, our evidence for why we think this is someone they should reach out to. This is just a prospect, but if they want, they can save it to their leads.

**Stauss:** Can I pause? Go back one page. That box showing the CFO contact — we should hone in on whether that's the best person to reach out to. For the true middle market, yes, it's the CFO. As you get bigger, it's maybe the head of treasury, head of capital markets, the controller — because the CFO is the end decision-maker but isn't actually working the deals at larger companies. So make a note of the best contact, and give up to three (five at most) — the main one to check in with, plus a short list of other verified contacts (controller, head of treasury/finance, head of capital markets) to reach out to if you can't get the CFO. Verify via LinkedIn or an About Us page.

**Simon:** Got it — top three, most likely main one, that's super good feedback.

**Stauss:** Top three: the main one, then two collapsed that you can expand — alternative good person to reach out to, their name, email, phone, title.

**Simon:** In terms of Salesforce — you mentioned you use it. What would you want in an integration? "Put this into my Salesforce"? What would that look like?

**Stauss:** From a sales-rep perspective I'd love a quick action: here's the account, here's my account in Salesforce, integrate these contacts. Right now I'd look up the company, see if it's in my database, check who my top contacts are — is it Maria Romano, is she the CFO? We're constantly manually verifying: reps go to the company page / About Us, check LinkedIn to see if these people still say they're the CFO/controller, because CFOs roll over every two to three years. So you also want it to follow the CFO through LinkedIn.

**Alek:** A link to their LinkedIn so they can easily pull it up.

**Stauss:** Anything quick-action, easy. You might also want Quintel to monitor the CFOs — LinkedIn lets you follow someone, so anytime they post "I'm not at Taylor Excavating anymore, I'm at ABC Excavating, which is much larger" — if I had a good relationship with that CFO, did three or four deals with them, I'll call and say congrats, once you're settled let's sync on how VFI can help this new company. Following the CFO is a good way to get in with a newer company, and to know if that CFO is still there or moved.

**Alek:** So when the CFO switches jobs, that's a good time to make contact and build the relationship — a good thing to monitor across the board.

**Stauss:** Yes and no. Yes if I had a good relationship — did a handful of deals, on a first-name basis — I'll for sure reach out: congrats, this new company still seems like a fit for VFI's equipment and project financing, let's do a check-in on the capex budget. But it's relationship-dependent. It's still a good signal regardless, because maybe they were at a smaller company that wasn't a VFI fit, and now they joined an $80M company versus the $10M mom-and-pop when I first connected with them.

**Alek:** How do you do that right now — just scrolling through LinkedIn?

**Stauss:** In Salesforce you can go to LinkedIn Sales Navigator. LinkedIn is increasing their AI ability as a Sales Nav customer, so you might get a signal there, or you follow the person. If you're lazy you just call: "Is Maria there?" "She's no longer with us." "Who's your CFO now? Jason? Can you connect me?" Then since I found out Maria left, I look her up on LinkedIn, see where she is, check Salesforce for that account. Following the CFO is another way into deals — maybe the previous CFO didn't like to lease, only did term loans, but Maria likes to lease because you did deals with her.

**Stauss:** Another market signal: if the company is large enough, they might have a procurement or equipment-buying division — follow the procurement people (LinkedIn or otherwise) to see if they're posting about building a new facility or expanding their fleet. It's all the little nuggets in any publication they post. Like if a public company — say Tesla — posts "we partnered with Taylor EV Manufacturing to increase our EV manufacturing capabilities." Taylor is private, wouldn't say it, but Tesla posted it. People aren't tracking that because Tesla isn't their client. But if Tesla's teaming up with a smaller company, that company typically needs to expand capabilities and will need financing to do so.

**Alek:** That's super useful — the second-order stuff.

**Stauss:** You see the waterfall I'm trying to capture.

**Alek:** In terms of permit filings or other filings — things you track right now?

**Stauss:** UCC-1 filings are the biggest. One, you use them to see if another company filed a UCC — competition. If I see Regions Equipment Finance or First National filed a UCC in 2020 or 2021, I figure they did a three-to-five-year deal, so it's probably coming to end of term. What are they doing with the equipment — buy it out, upgrade, return and get new? So I use three-to-five-year-old UCCs as a signal, which I look up manually, to find refinance opportunities or end-of-term balloon financing. It gives you a reason to call with a purpose: "Looks like Taylor Excavating filed a UCC about three years ago — wanted to check what your plans are." They say "we did a four-year term, twelve months left." "What are you doing now? We can roll in the rest and do a refi."

Another cool signal: show where rates were when they did it. If rates were ~3% in '21-'22, money was cheap — they might be forced out of that loan, which is a refi opportunity, and it gives me something to talk about. So if you could incorporate where prime was on July 8th 2020/21/22 as an indicator — that's valuable. Or the inverse: ideally rates come down to 4-5% in the next three years, and then a three-year lease coming due is an easy refi. That's what mortgage loan originators do — as soon as the Fed drops rates three or four times, they mail everyone: "you took a mortgage at 8% in '25/'26, it's a no-brainer to refi at 6.25%." So you're reverse-engineering the UCC filing.

Another enhancement: a Quintel score — this company was an A-rated credit, had consecutive losses, dipped to mid-B, now on the upswing. That's huge for me: they're not bankable anymore but they're a perfect VFI fit — I can get the deal done where the banks can't.

**Alek:** Is there a way to get that credit data?

**Stauss:** For public companies, use a Moody's scale — B3, or S&P/Fitch B-minus. For private companies, not so much. Internally we have a model similar to Moody's; we score them to make sure it can go in our warehouse facility, which is the major hurdle. If they score, we can fund the deal off the warehouse. What would be interesting — and you'd customize to VFI — is: are you scoring all companies, public or private? Yes. Then you upload your previous scores, we track them, and when you get updated financials we rescore and give you a market signal: did they increase or decrease? We do that manually now — credit analysts rerun the model on updated financials, 24-48 hours, updated score.

But this all has to be siloed. You wouldn't want ABC Equipment Leasing to upload their private scoring and then have us send it to VFI. Every smart client's agreement will say you absolutely cannot share their data with anybody or they'll sue. So it's a value-add specific to the client using Quintel — better market signals like "don't lose current customers, here's an additional business signal." Public companies file quarterly, so there's a score you can look up on a quarterly cadence. Private companies are proprietary — we can dive into that specific set later on how to safeguard it.

**Alek:** The UCC data — is that a manual process for you now?

**Stauss:** You always file a UCC-1 because it's your lien position on the equipment — first position if they go bankrupt, same as an auto loan. As for looking through UCC filings to find people who financed four years ago and might renew — our smarter reps do that. We don't have a global database always looking at it; the reps who own the account go look at the UCCs, use it as a talking point. Or our sales manager does it himself for his team and directs reps: "call these guys, they might be looking to refinance." It's a manual search. In Salesforce we have embedded D&B, LinkedIn Sales Nav, UCC filings — we can search, but it's a manual action. Salesforce isn't popping up "this company would be great to refinance because their UCC is coming due." Having Quintel scan that and provide real-time, in-your-face data would be a great tool.

**Alek:** That seems to be value right there — exactly where Quintel comes in. What about permit filings — demolition, expansion?

**Stauss:** Useful too, but hone in. If a company filed a permit to build a new facility, and that company is already a fit for VFI, then yes, use it as a signal to reach out. If it's a startup that filed the permit, you'd want to see: is this a related entity of a holding company, are they PE-backed, is there a stronger company that's a VFI fit? If they're standalone using investor capital, it should filter and not give me that signal — it's not a VFI fit because they're a true startup.

**Alek:** For a permit for expansion, what factors do you look at to determine if it's a good deal?

**Stauss:** I try to understand what they're filing the permit for. Storage and warehousing? They might buy racking, install HVAC, autonomous robots for loading. If it's "we bought a new headquarters" and they're a SaaS company or a bank like SoFi, the only opportunity is FF&E and technology — probably not a fit. If it's commercial and industrial (C&I) and they're building robots or satellites — equipment — that's a good signal.

**Alek:** So there's an equation: the company, the type of space, and a prediction of what equipment gets bought.

**Stauss:** Yes. Another good signal a lot of people don't use: I go to LinkedIn, type in a job search like "head of machinery and equipment," see which companies are hiring, look at the company's headcount. If they're 50-200 and hiring, they might be jumping to the next range, or going 100 → 150 — that's growth. So employee headcount and active hiring are growth indicators. You could have Quintel search Indeed, ZipRecruiter, LinkedIn job posts — which could also branch to staffing/recruiting partnerships far down the line.

**Alek:** There's good overlap with what we were thinking, plus a lot of additive info. That's mostly my sourcing question. Simon?

**Simon:** That was pretty rich. In my opinion this is the biggest, toughest piece — codifying everything you just told us, pulling all these pieces about a specific account, connecting the dots.

**Stauss:** One more thought — board advisors. Have Quintel search a company's board advisors, exclude the board chair, and do an automated email to five to ten of them: "Quintel caught ABC Company. I understand you're a board advisor — if you're looking for growth capital / debt, click this link and take a quick survey so we can help find the right capital providers." A three-to-five-question yes/no: Are you looking for capital for equipment? In the $10-50M range? Within six months? You get non-sensitive, high-level info at the board-advisory level. I've had a board advisor cold-email me: "we build exterior doors, looking for a $15M facility." So you're not chasing brokers or intermediaries, you're reaching people who know the company's financing activity — and it makes the advisor look good. Then I say "this is strong, the board advisor confirmed they're looking — here's the CFO, reach out."

**Alek:** So a bit of our own outreach.

**Stauss:** Very automated — an initial sequence to maybe three people, no additional lift. One play down the line: streamlined automated outreach to the CFO directly — "don't leave money on the table paying a broker fee, Quintel can source the right capital partner." Maybe a V2 / upsell that gives better information, not this initial build.

**Simon:** Why suggest automated outreach to a board advisor versus "this is someone you should pick up the phone and call"?

**Stauss:** You could do both — maybe that's a second list. The reason for automated outreach is to get better market signals — "this is hot, flashing red on your Quintel dash," with tangible feedback that they're looking for financing in a specific window. It's to get more intel. Or, if we don't want Quintel doing automated outreach to anyone at the company and only providing strong data to the finance-company client, then: here's who to reach out to, and here's a separate list of people who might know about financing activity — with a suggested script that has a high response rate. Copy-paste, hit send. There's no strong answer either way.

**Simon:** You made a good distinction — mining data for signals versus generating our own signal data. That's what it sounds like you're doing.

**Stauss:** Yeah — that's probably a totally separate piece. "These are mining signals, great info we pulled with our proprietary AI. Here's specific Quintel information we mine direct from clients." That's a good distinction.

**Simon:** Circling back — VFI has its own scoring mechanism, your own algorithms/rubric?

**Stauss:** Once I get a full package, I send it to my credit analyst to get scored. They run it through our models — similar to Moody's — and it comes back "ba1," top-middle of the box, which qualifies for my warehouse facility. That's a good score for VFI to go after.

**Simon:** So the proprietary algorithms aren't directly accessible to you — you tell your credit team.

**Stauss:** My origination/sourcing team doesn't do that; my credit team does. It's a specific VFI process — we don't use a third party. The analyst goes through the financials, plugs info into certain spaces, submits for scoring, and the software kicks back the score. We use it to know if it's an approvable deal off the cuff and whether we can use our warehouse facility — because if it scores below B3, we can't use our major facility. So if a company wants $10M and scored CAA1, I can't do the $10M off the warehouse; I could do $2M with our own capital. We're a middle-box lender — not the worst, not the best. On a C-level credit we go down the route of: is there a related entity or parent company that's a stronger credit? Substantial additional collateral / credit enhancements? They want $5M in equipment but own $20M free and clear — I encumber all $20M, over-collateralized 3x. Or free-and-clear real estate — first position, sell it if they go bust to make whole. If it's appealing to my investment committee, they'll approve.

**Simon:** Are there other pieces of internal VFI data or ways to calculate things that feed back into sourcing?

**Stauss:** Not from a real automated perspective. At this point it's mainly: did you talk to somebody, get them on the phone, get their real-time feedback, update the notes. That's something Quintel could do — we're so reliant on the rep updating the account with proper notes. Can a Quintel agent monitor the phone call and extract that data to make sure the salesperson is updating the account? We don't record calls, so we update notes manually — but Quintel could scan any new note and provide better information. You're relying on note quality: did they get real feedback, did they ask the right questions? Maybe there's still a deal but the rep didn't ask the right questions — that's the super gray area, extremely difficult.

Another value-add: if Quintel integrates with the CRM, when you call this person, here are specific questions to ask based on previous notes — "are you buying new equipment? how do you pay for it, cash?" Real-time coaching for the rep to ask the best questions. The rep dispositions the call — Quintel says "they're buying equipment; ask if it's in the next three-to-six months or a 2027 project" — they click, and Quintel comes up with three more questions to keep them on the phone. Real-time rep coaching, especially for newer reps who need 10,000 calls under their belt. Whatever we build in V1/V2/V3, a lot of these are good nuggets for V10, V12, V15.

**Simon:** Right now I'm exploring the space — uncovering the universe of possibility and building the first step to get there. One other piece we're working on is a market-intelligence layer. We mine data sources, pick out specific ones that turn into prospects. There's still a lot of equipment-finance data that might be useful to search — imagine a Google engine on top of UCC, Edgar, news articles. Are there searching algorithms you'd find useful?

**Stauss:** Definitely something I do regularly — it's just not top of mind right now. As I go through my day I go down rabbit holes and find stuff. Send me the question honed in a bit more, over WhatsApp or email, and as I'm working I'll remember "this is what I use to find XYZ." Ask me middle of next week — I just got back from Mexico, getting back into rhythm.

**Simon:** The reason I ask: you mentioned reps go back three to five years in UCC data. So if I could type a quick search — "pull UCC data three-to-five years ago for this sector, this amount" — that seems useful.

**Stauss:** Yeah — use the asset class to dictate the term, because UCCs don't show the exact term. GPU financing is hot, but it's technology, typically 24-36 month terms. So scanning UCC filings for GPU financing, showing it as a market signal 18-48 months out, tells you now's a good time to see if they'll refinance or buy new GPUs. Or cranes — a great asset lasting 5-15 years, so a broader range; in five years Quintel flags "this company that bought this crane is probably looking to upgrade based on useful life." You'll never know 100% — VFI might do a $20M deal with 10 cranes + 20 GPUs on a five-year term, but the GPU piece needs refinancing sooner. So you use the whole transaction to carve out opportunities.

**Simon:** Makes sense. I'll put together a question.

**Stauss:** Don't spend a ton of time — just give me three questions on other ways you're sourcing data. Obviously you've looked at stuff like the ELFA conferences (Equipment Leasing and Finance Association), the AACFB, and debanked — a broker fair mostly for commercial financing but a lot of equipment financing. Those event providers could be strategic partners — Quintel partners with them, we sell discounted tickets, in exchange we get data on who's attending. And you want to know what new capital groups are joining the space, their buy box. That's not for the VFI-specific agent, but for Quintel Admin / Quintel Global — the HQ — it's really good information to have.

**Simon:** Helpful way to think of it. That's pretty much my questions. Alek?

**Alek:** The newsletter idea as top-of-funnel — a personalized newsletter where all the signals pull in.

**Stauss:** I'm not saying it's bad. I just don't want to do what everyone's always done — "subscribe to this, here's market intelligence" — that's been done since the 2010s. We can still do it; it probably makes sense to have that piece out there. But I want something better, more unique, that captures what the newsletter would but isn't just a newsletter — I haven't come up with it yet. What everyone's doing now, from the AI companies I've talked to and demos I've seen, is just enhancing what's already been done from a SaaS perspective with AI. Great — now I buy an AI SaaS instead of an email campaign, an AI overlay sending the emails. But it's just enhancing what's better.

I was in a forum with equipment leaders Friday — honestly boring, but one CEO said what I've been saying: everyone thinks "how do we use AI to enhance our current process." What we want is to go all the way back and flip it on its head — use AI in a much better way. If I use AI to eliminate my medium and lower performers and increase results, I save on salaries and commissions, keep my top guys, and enhance with AI. But I want to flip it on its head, do something totally different that uses AI in a way no one else thinks to. That's where we sit when you demo the custom solution: "you could buy a glorified SaaS product, or work with Quintel, custom-building — a partner that grows with you as AI and your company grow."

**Alek:** Go for the 100x outcome, not the 2x.

**Stauss:** That would resonate. If it's an easy lift to do the enhancing part now, let's do it — no-brainer. But that's not our end product; we don't want it to become the identity. We want to be the ultimate solution — not just "here's great market data, we're scanning things." Here's where we're miles ahead, thinking into the future — why you buy a custom solution from Quintel, because we're really supporting your entire operations in a totally different way than you've looked at before.

**Simon:** The framing in my mind is: we want to help you redefine how your business is run.

**Stauss:** Redefine how you run your business. We don't want to just make you better.

**Simon:** My mental model is: everybody's building AI in Google Docs versus Google Docs in AI — we have Google Docs and you're just putting AI in, a shitty experience, versus using AI natively.

**Stauss:** That's 100% what the medium-to-long-term is. We'll see a ton of competition — entrepreneurs like the guy I'll send over, a broker for 15 years who built an AI equipment platform to "eliminate the bad stuff about brokers." Is that competition to Quintel? Yeah. Significant? No. We'll see a ton of "I'll make an AI agent that's a broker, I'm your co-broker." Could be valuable, but it won't stand the test of time versus groups like us building something truly unique that redefines the whole landscape.

**Stauss:** Let's leave it there. We didn't get to demo the V1 for VFI — maybe tomorrow, or just send it. I can't remember my username or password.

**Alek:** We'll make you a new one. We have all the feedback on sources, so we'll customize toward you, implement those, and once it's activated we'll send it over.

**Stauss:** Where I'll find the big improvements is once I can actually use it myself, using Quintel as my main everything — like the AI-in-Google-Docs thing. Then I find "this needs improvement, this needs to flow this way, add this." That's real tangible feedback in a real-world scenario.

**Simon:** Once it's in your hands it'll be a tight feedback loop — you tell us what's wrong, we go, and once the loop's running we move incredibly fast on features and functionality.

**Stauss:** Hell yeah. Talk soon.
