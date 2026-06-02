---
contact: Stephanie Williamson
company: AICAP Access
date: 2026-05-26
call_type: firm-direct
participants: [Stephanie Williamson, Simon Pettibone]
prep_file: active/call-prep-stephanie-williamson-aicap-2026-05-27.md
---

# Stephanie Williamson — AICAP Access — Discovery Call Transcript

**Stephanie**: Do you want to tell me about yourself?

**Simon**: Yeah, software engineer for a while. In New York City for a long time. And then more recently to AI very heavily. Building agents, building workflows, doing a lot of basic stuff.

[audio issues — Simon repeats]

**Simon**: Working in various startups in one fashion or another, generally as a back-end systems guy. And then recently I've been working on a startup which is AI related, and right now we're actually looking for specific verticals that we want to target, design partners that we can work with and partner with. So that's what led me to Upwork to see what sort of demand is there in terms of what people are looking for. And that's how I came across your posting.

**Stephanie**: Okay. What is — are you information gathering or are you interested in working together?

**Simon**: A little bit of everything right now at this point. We've talked to a number of people, we're kind of in the process of figuring out requirements. We've talked to some people in the immigration industry mostly. So you're the first person in the healthcare industry that we've talked to. I did some research on your prototype or platform, your market, who you're targeting, what you're looking to build, and all the relevant footwork that's involved. So that's basically where we are right now. I'm interested.

**Stephanie**: You looked that up, okay?

**Simon**: Yeah, I looked up as much information as I could.

**Stephanie**: I assume you don't have any exposure to it before. So I'd be curious to hear what you found and how you see and interpret what you found. You want me to just dive into it or do you have specific questions or a specific starting point?

**Simon**: Nothing specific. I think if you just give me a general background and then where you are, what's built, what's not, what you're looking for specifically, maybe a little bit on your roadmap timeline. I think that'd be a good place to start.

**Stephanie**: Okay. So I've been in credentialing and privileging for over two decades. It's a very niche environment. It's very deep within hospital operations. In your research, you may have come across credentialing related to payer enrollment — that's more widely available. But what I specifically do is a niche within that niche, which is hospital privileging credentialing.

In our field we like to say with the payer enrollment, they call themselves credentialing but they aren't, because what we do is so much more in depth than what they're required to do for payer enrollment.

So when a physician applies for a job at a hospital and they're accepted, they have to go through the credentialing process. That means that the director of a department spent a couple of months looking for the person — there's actually a worldwide physician shortage, so it can take a long time to find someone. After they find that person and go through interviews and decide to hire them, relocate them, they have to go through credentialing and privileging, which to the people that are waiting on it kind of goes into this four month dark abyss and comes out the other side.

People kind of understand it, they know pieces of it, but it's so nuanced and compliance-heavy and regulatory-heavy that it just generates a lot of work. So the very first bottleneck is the incomplete application. That's been a compounding effect — there's about 10 major credentialing software companies out there. They all innovated in the 1990s with digitizing paper files and haven't done anything since. There's no data integrity, there's no guardrails, there's no compliance built into it. That's all tribal knowledge, institutional history. Fragmented, broken, was never meant to scale.

So we get these incomplete applications because the physician doesn't know how to answer the questions. And it's not that I don't blame them — we're asking regulatory questions to a healthcare provider. So there's a mismatch of language and understanding. They get a lot of the answers incorrect, they leave a lot of information out that probably doesn't seem relevant but is required by compliance and regulatory bodies.

So the first four to six weeks of the credentialing process is the coordinator going back and forth with the physician, trying to collect all the information to make the application compliance-ready. The reason why that takes so long is because we're asking for questions and documents that the provider just doesn't know how to answer. A lot of it depends on the coordinator's experience and skill level. Some people just are not very good communicators, some people are new. It takes a really long time to learn all the nuance — it's about three years before someone is fully competent as a credentialing coordinator.

So what I'm hoping to do is cut out that four to six week initial back and forth. Have a completed application submitted on the first pass. It provides a lot of immediate ROI — they'll see the applications going through fast, less time.

[Stephanie's son interrupts briefly]

**Stephanie**: The MVP that I built so far — I've been meeting with engineers for months. I haven't found the right one. So I became impatient. I was like, I'm just gonna try to figure it out myself. So between Replit, I kind of built one. I've used AI for a long time, so I really understand its limitations. I'm not sure what people mean by vibe coding because I think I burnt out Replit with reiterations, refinements. Like, why are you doing that? I didn't say to do that. I said to do this. Adding weird things. Why are you putting a period there? They don't accept fluctuations, stuff like that.

So what I did is, I tried to get a brief outline of what I did. I modulated it. So the first one would be like a CV ingestion/extraction layer.

And then from there, whatever could be gathered from the CV, I did like an inference layer. There's certain logic that applies across the industry where an OCR could pick up a keyword and from that would trigger like — someone says I'm a faculty member. Then that triggers there's a hospital affiliation, malpractice insurance and work history that all need to be filled out. So if someone says I'm a faculty member at UCSD Medical Center, then all of that can be filled in. That's one of the things that would be left off — they'd say faculty member at this place, and then there'd be no address, no contact information, no practice history. All of that could be rolled out based on that keyword.

So then my next module — this is all in the same application process — it's like a layer of deterministic gateways, which puts it in two categories: either the information is resolved or unresolved. And that bar is if it needs compliance. So using the deterministic gateway, it sorts the information, and what is left unresolved goes into an AI layer. A contained AI layer as much as I could — I don't really know that much about it, but I tried to put in some rules about it. It tries to gather additional information using reasoning, logic and resources.

Then anything that's left unresolved goes into the last module, which is a guided intuitive question-asking that's based on the unresolved logic. Currently they just fill out a fillable form — there's no guidance to help them. I've tried to get the system to intuit what's missing and guide the provider to compliance. And then what cannot be resolved we can at least resource. So if you don't know who was the office manager at this place, what is their name, their contact information — we could resource it. So the person processing the file can, instead of waiting two weeks to get an email from the provider, at least have the resource sitting right there to contact.

And then that would spit out either — depends on the hospital's risk tolerance — either a PDF of the application with an audit trail, or a light integration through an API into the legacy system so they can continue processing it.

**Simon**: Okay, got it. So once the application is at an approved state, then it's a handoff to the legacy system or the existing credentialing system. And it sounds like from what you're describing, that this workflow is essentially operator-managed, right? So they see the case come in, they eyeball it. It's kind of like AI plus human collaboration together. And then the system says, hey, he's missing this or this seems inconsistent, and then surfaces it to the operator and the operator says okay we need to send them an email to fix this. That roughly?

**Stephanie**: Right. Yes. The way I have it set up — at the top there's red flag sections, which is the provider has a DUI or malpractice claim or some sort of incident that's happened in their past. So that's at the top because that will require extra scrutiny. Then pending items — they need to submit their DEA certificate, their certificate of insurance, or something that they might need to submit or a pending question. And then everything else I have listed in green — that's compliance. And then there's the audit layer. So they'll be able to review all that information and make sure that it is up to their standards and matches what they're looking for.

**Simon**: Okay got it. So the main primary goal is to compress the 4-6 week window. But you also mentioned that operators themselves that are reviewing cases have a three-year ramp up before they get really good at being able to do this. Is this also going to basically enable, let's say, an operator that's in their first six months to be able to more efficiently manage case loads?

**Stephanie**: Yes. What I really want is the system to do the complexity and the heavy lifting, not the person.

**Simon**: Absolutely makes sense. It's literally what AI is for right now. So it sounds like you've got quite a bit of the basic infrastructure in place, that I don't know — vibe coded or otherwise — somehow you've got pieces in place. So what is your primary goal right now? Are you looking for someone to help clean it up, or you're looking for something that's demo-able, or do you have your own set of design partners? I noticed that you have a waitlist already, what's that looking like for you right now?

**Stephanie**: Um, waitlist is just empty. But I do have some informal design partners that are eagerly testing the data. Once I have a — I don't know if it would be like a working prototype — my goal was to get this complete application. That's the wedge. I want to be able to do that. I'm not really technically qualified to do that at all. I don't have any coding, engineering background or anything. So what I really need is a stable reliable early pilot prototype that can prove ROI internally and then with my design partners.

**Simon**: Okay got it. So the first step or first goal is something that works end-to-end, but not necessarily has every single piece in place. You kind of get the idea — it does an intake, it does pre-qualification checks, etc. Some obvious things but not necessarily 100% in depth. Is that roughly what you're looking for right now?

**Stephanie**: No, I want to go pretty in-depth. Because the slice that I have now is such a small part of the expansion of just getting the application in, right. For what I've talked to some of my more serious people that are working with me — I did talk about a lighter thing, like let's just focus on easier applications, a certain specialty that's generally easier to work with. But I've repeatedly heard back that that's not what we need help with. We need help with the hard stuff. The stuff that is really difficult information to get. So that's kind of what I've designed the MVP around.

As far as what I've designed, I'm more concerned with the outcome. So if there's a better way to do that, I'm open to that. I just want a premium high-quality product. I'm okay with a scrappy MVP, but I plan to charge a premium licensing fee for it. So I want it to be a very high-quality product.

**Simon**: Yeah, I mean, if you're saving four weeks of a doctor's time, then it's basically name your price kind of thing. So completely understand. Basically your goal is full build. Do you have a timeline that you're looking at in terms of when you would like version one, let's say?

**Stephanie**: Ideally I'd like to start working with someone middle of June. And then as quickly as it can be done. I have people sitting waiting to look at it.

**Simon**: Gotcha. For if we were to work together, we actually can move quite fast. And are you essentially looking for someone to take what you have as a starter and fix it up, or take your framework — the workflow that you have — and kind of re-architect the system from the ground up?

**Stephanie**: Well when you say from the ground up, what I have is like a curved step, it's still on the ground. So it would be a stretch to say re-architect. I'm very outcome-based, so I did kind of what came to me as a way to get that. When I've been talking to engineers about it before, having a better architectural design in my mind kind of helped me refine it. But I wasn't hearing from anyone else the innovation I was looking for. So that's kind of what I came up with, but if there's a better way, I'm open to that.

**Simon**: Gotcha. So from a workflow perspective, it seems fairly standard. The heavy lifting pieces would be figuring out what document extraction looks like. Obviously there's quite a bit of domain knowledge which is in your head with respect to what's needed for compliance.

In terms of the way that I'd be able to work with you, what I like to do is basically build out something in rapid iteration. So I would put something out that's what I think is in my head, that is what you're looking for, and then you give me feedback. And then we just rapidly iterate from there.

There's a few ways also that we can go about this. What I could do is, based on this conversation, put together a potential plan. This wouldn't start charging or anything — this is just for you to review and see if it works for you. So I could put together a build plan, what I think things would look like, scope out how much work, how much time. And then we can see if that works for you and we can go from there.

The other potential angle — like I mentioned we're looking for design partners ourselves. So the approach that we have with some of the people that we've been talking to is, we would present to you a 30-day plan, and it'll come with a flat price tag with what we plan to do. But within 30 days we're happy to refund you everything. If by day 30 you don't like it or it's not the direction you're going in, we'll happily refund the entire amount. And then after 30 days if you decide to keep working with us, we would continue forward. So that's something we're doing with our direct outreach with immigration platforms and a few other verticals we've been targeting.

We're happy to work with you however's more comfortable for you. And in terms of us finding a design partner, we would price it that way as well. That would be under the assumption that we could use you as a reference, case study for ourselves and our platform. In my opinion it's kind of a win-win all around. Totally up to you in terms of what next steps would look like.

If you wanted to think about it a little bit, that's totally fine. If you want me to present an initial proposal, I've got a few more questions so I can figure out exactly what that proposal would look like. And then I can give you the proposal within a few days, by the end of the week.

**Stephanie**: All right, I do have a couple of questions. How many people are in your system? Your what is it, Tokenrip?

**Simon**: Tokenrip. So we're actually a brand new platform. We just released Tokenrip less than a couple months ago. So like I said, we're still very much kind of similar to where you are now. We're doing the outreach, we're finding — so we have extensive AI experience but we have not actually signed up any actual build-outs yet. And so that's why we're in a place where we can offer design-partner type pricing in exchange for being able to reference you in case study material.

**Stephanie**: Does anyone in your team — is it just you, or do you have a team of people? How is your company looking?

**Simon**: So I am one of the co-founders and I have another co-founder. Right now it's just us two. I'm the engineering side, engineering product development. He's more business side.

**Stephanie**: Have you do you have experience in like healthcare or regulatory fintech or anything like that?

**Simon**: So fintech, yes. We actually have a fintech platform. It's more in the crypto space, not traditional fintech, but you can look it up in my Upwork profile or LinkedIn. In terms of healthcare specifically — HIPAA compliance, that's not something I've worked with. However, from a requirements perspective, in terms of how to encrypt data, how to make sure that your system passes a SOC 2 compliance audit — that's known. So it's a matter of translating HIPAA requirements into engineering requirements, and that's basically my bread and butter.

**Stephanie**: Okay. We don't really use HIPAA. We have different compliance that we use, like The Joint Commission, Center for Medicare Medicaid. But it doesn't matter that much. A lot of people don't know about all of that.

And then what would be your involvement in the build?

**Simon**: So I would be directly overseeing all of it. I'm a senior engineer and so I would be doing it directly. If there are some things that I need to contract out — we used to have an additional team member who was also an engineer, but now with AI it was no longer necessary to keep him on the team. So it's really just me overseeing basically a team of AI agents.

**Stephanie**: Okay, sounds like me but [unclear] not really good CTO here. Okay, and did you happen to come across what the healthcare enterprise sales cycle looks like?

**Simon**: I don't know from first-hand experience, but I imagine selling to hospitals is not the shortest sales cycle. We've talked to banks, so I imagine it's hopefully not as long a sales cycle as banks, but it might be too long. For us to continue in the fintech space, that's what it came down to — sits anywhere between six months at a minimum to longer than that.

**Stephanie**: What are bank sales cycles? Oh, okay, that's healthcare too. Yes, I do — yeah, it is very hard. Being where I've been in the system, I've sat in on lots of pilot talks where the decisions are made. So I know how it works, I know why it's slow, I understand the cycle. But yeah, it is like a six to 12 month sales cycle.

**Simon**: Okay. So you've got your work cut out for you then.

**Stephanie**: But that is with — I don't know that it would be that long for a product that's not being integrated into all their other systems at this point. Because that's where I have sat — like infrastructure software. Where this would eventually be that, but the wedge, it's not requiring them to rip out anything. There's no data transfer that's happening. So it could go quicker, might not be the long procurement cycle.

But what has happened is they usually require, from what I've seen, like two in-person meetings. Often there is a technical person that accompanies the person there to go through with their CMIO, their technical team. They usually have informatics people there to ask technical questions. So I don't know if that would be outside of your scope. I don't know that I would happen this early.

**Simon**: So I'll be honest, I would actually love to be on those calls. It's not even something I would charge you for, to be on, unless you're doing 20 calls a week and that's just too much of my time — that's a different story. But otherwise, like I said, we are completely in information gathering. I would love to understand what the sales cycle is, what those conversations look like. It's basically like an opportunity for me to be behind closed doors. So for me it would just be fun.

**Stephanie**: Oh they are fun. It's the MedCal executive committee meeting and they're very intriguing. Very interesting to hear about the hospital's problems and what they deal with. So yeah, well it sounds like my sales cycle mirrors the fintech one that you kind of didn't want to do. I'm not sure how you're feeling about that now.

**Simon**: The thing is, depending on how you want the relationship to go — this is one of those things where you wouldn't want to bring in the big guns to actually roll out, to take it from 80% to 100%, right? That last 20% is always like 80% of the work. But you definitely want 80% of the work in place for you to actually be able to make the sale. So in my mind, scheduling-wise it could be a fairly good match. We could definitely help you with getting out your initial MVP or just plain V1.

I think you do have a really good point about it being a lightweight front end, that sits on top of their existing systems. They don't have to rip out anything. I don't know how you want to do sales, but it could easily be — hey, just try it out for a 30-day period. If it doesn't reduce your time, then no harm no foul. If it does, then they're gonna want to pony up the cash fairly quickly, I would imagine. Because four to six weeks is four to six weeks of doctor's time. You'd multiply that by two or three doctors, and that's ridiculous.

**Stephanie**: Well, I actually have a toolbelt. Like big systems like where I work at Vanderbilt University — there's usually about 500 initial applicants somewhere in the process. And each day per applicant that they are not working and sitting in credentialing, we're losing $22,000 a day in revenue. So it's unlocking all of that revenue early.

**Simon**: Yeah, this is one of the reasons why I stopped with fintech. I realized I was selling a vitamin, right? And not a painkiller. And so this product has that problem solved. It's a painkiller obviously. So I think you've got some leverage with respect to your sales cycle, in my opinion as an outsider that doesn't know anything about healthcare.

**Stephanie**: Yeah, well, it's interesting because my first customer slash design partner that I'm working really closely with is with Harvard Health. So being able to use that name is a huge thing if I can cross that line with the person that I'm working with.

**Simon**: That's what we're looking for.

**Stephanie**: And also with Duke University in North Carolina, I'm getting pretty close with their decision makers. So that's another one that I'm hoping is probably the second. And then MD Anderson out in Houston — they're the biggest cancer center in the United States. So their leadership is actively trying to solve this problem of compressing physician onboarding, like in meeting about it all the time right now.

**Simon**: Okay. And my research turned up some recent regulation related thing, where they're by law having to compress it from 180 to 120 days or something along those lines.

**Stephanie**: Yeah, but I think we can do much better than that. It's 2026. There's AI. How come that's the big jump, you know?

So my first iteration is the application time compression, and that's the first half of credentialing. And then it goes into the privileging part. That's the more complicated part that takes another four to six weeks. That would be the second part I'd be looking to compress, still sitting on top of the system. It would cut out another four to six weeks. So now we're down to a week or two that you can onboard a physician.

They can run concurrently — the problem is the current staffing workflow model. Because each part of it requires such high specialty, it goes from one to the other because each coordinator has to be really highly trained and skilled and specialized. To have one person do it all is difficult, and then there's multiple handoffs in between. So it's a harder process. That would be the second huge value — the privileging piece. That takes a really long time.

**Simon**: And just to make sure I understand — the privileging piece is like, this doctor is a doctor but he is authorized to do this kind of surgery, this kind of equipment, that sort of thing.

**Stephanie**: Yes, exactly.

**Simon**: Okay so those are two separate pieces — the initial intake assessment, and then the privileging piece. And that seems to be a bit more coordinated, domain-heavy knowledge-worker type thing versus the first piece.

**Stephanie**: I feel like the first piece will be a little bit harder to build, whereas the privileging piece can be pretty deterministic. It's just the human in the loop trying to match up these clinical names with these clinical requirements, not really being clinical. Sometimes you're looking at hundreds of them, trying to mirror them up to see if they qualify for the privilege. Then you have to call in a physician — can you look at this? I can't tell. And the physician's like, no, this doesn't work. And so you have to go back to the applicant — we need something else, what do you need? It's more of that. But that really seems like more deterministic, and it would probably be easier to build than having a human do it. And it could be done concurrently.

**Simon**: Yeah. The easier portion is being able to surface 80% of the issues where it's an information mismatch or missing information. And then surfacing the outlier cases or corner cases where it requires a human in the loop kind of reviewer to audit.

I think I've got a relatively decent amount of information. If you want, I can put together a proposal for you and then we can review it. If you have issues or things, we can iterate on the proposal. Or you can just tell me you'd rather work with somebody else, which is totally fine too.

**Stephanie**: I'd actually like to see a proposal. I kind of feel like, because you have the startup, you're probably as driven as I am to succeed. And that matters, you know what I mean?

**Simon**: It matters quite a bit. The thing is, in this particular case it's not me looking for consulting work so much as it is me looking for a design partner. Your use case is literally the one of our scoped out — not necessarily credentialing but healthcare industry was one of our scoped out targets that we really wanted to target. So here, it's essentially like a founder-to-founder kind of deal, where we would be highly driven to see that you succeed. And that's why I mentioned the design partner thing. I really don't care about trying to squeeze a few dollars per hour or anything like that. I'm gonna be driven to get you to succeed. Because our success is literally tied to yours.

**Stephanie**: Right, exactly. It's a chain reaction. And I like that you did some footwork beforehand. That's meaningful. A lot of engineers do not do that.

**Simon**: My approach — I want to understand things from your point of view. My initial research said you're a founder, you're looking to get this off the ground, and I can relate. So that was definitely my approach.

**Stephanie**: Do you want to send me a proposal? Do you have any additional questions for that?

**Simon**: No, I think I've got enough to get some initial thoughts down. I'll send it to you within a few days, probably by tomorrow. And then if you have questions, send them my way. We can hop on another call. We can take it however you want to take it.

**Stephanie**: Sounds good, Simon.

[wrap-up small talk about Virginia / Colombia / family]
