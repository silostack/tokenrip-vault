---
contact: Stephanie Williamson
company: AICAP Access
date: 2026-05-30
call_type: firm-direct
participants: [Stephanie Williamson, Simon Pettibone]
prep_file: active/call-prep-stephanie-williamson-clarification-2026-05-30.md
---

# Stephanie Williamson — AICAP Access — Clarification Call Transcript (Call 2)

**Stephanie**: I have a couple of questions. First, more general — I was looking at your website, Tokenrip. I'm trying to make the connection between Tokenrip and the service that I'm asking for. It seems more complex and bigger than what's on Tokenrip. I don't know if I have a misunderstanding, or what's happening?

**Simon**: So the way to think about it — Tokenrip is more of an infrastructure platform. The core idea is it's a primitive that engineers or applications could be built on top of. But instead of trying to sell the infrastructure directly, we're reaching out — I don't know if you know Palantir and the forward-deployed-engineer model. Palantir is a big AI services provider in the defense industry. They have core infrastructure, but instead of trying to sell the infrastructure, they have what's called a forward-deployed engineer — an engineer who works directly with the customer to build out a very custom solution. The pieces they build for that customer are either based off existing infrastructure if it makes sense, or they inform the infrastructure for what that specific customer needs. Still a custom solution, but their infrastructure layer gets built out piece by piece.

That's the best mental model. Tokenrip itself is fairly new. The infrastructure has the base primitives, but in terms of pieces actual enterprises need — a connection to an email server, a connection to a Google doc — a lot of that we just don't have right now. So the idea is we reach out to enterprises and build them a custom solution. Maybe it uses some of what we've built, maybe it doesn't — it depends on what's the best fit for the use case. In your case, we'd just build a completely separate system that's just for you, doesn't really use Tokenrip at all. And then later we'll take the learnings from building it for you and apply them to our infrastructure. That's the dynamic, if that makes sense.

**Stephanie**: Okay. And then — just so I'm clear — is that a product or a service that you offer?

**Simon**: With respect to us working with you — our service is we're going to build you your product. So in that sense it's kind of both. We're in the product-building-services space. But specifically with the companies we're choosing to work with now, it's not necessarily "here's a product, go ahead, we're done." Just the nature of the industry and AI developing — the difference between last month and this month is kind of crazy. So we're actually looking to find partners where it would be a much longer-term partnership. If all you want is a product, we're happy to give you a product and walk away — that's completely possible. But if what we build together is going to be successful and you're able to find customers to sell to, then the upside is really big for both of us if we support you throughout — whether it's helping you scale, building agents to do outreach, that kind of stuff that's not based on your product but helps you scale your business. That's something we're actively looking at for another person we're working with as well.

**Stephanie**: It almost sounds like white glove, concierge type. Infrastructure-building services and products.

**Simon**: You can think of it that way. You're a founder, I'm a founder — it's really however we want to work together, and I'm completely flexible. The idea is I'm going to try to get you as successful as possible, because our success is intimately tied. That's the relationship I'd prefer, but it's really whatever your comfort level is. I understand the sales cycle and that part of the business — we've been through it ourselves in a former life with a different product. So we're here for the long game.

**Stephanie**: Just to level-set — I do want a long-term relationship, but to keep it safe for me, I'd like each engagement we do to have a clear handoff. In case I need a CTO and a full department or support — which I hope not, but it could get to that point, or maybe I grow too big for you, it becomes too demanding.

**Simon**: That's actually a really good point. Having a clear handoff, at least in the beginning, protects both of us and manages both our expectations properly. Good to think about.

**Stephanie**: Being a founder, something comes forward and you're like, oh, okay, I've got to think about this now. So that's what came up for me. I was looking at your proposal, and as I was trying to outline it more clearly and define what I want my outcome to be — I realized one of the options I was thinking of doing was a very low-risk, non-integrated PDF that a hospital could pilot with. But I realized that won't actually work. That's not really an option, because first of all I'd require a coordinator to go through and enter all the information. And the way the current legacy software is set up, it's like a product instance — I don't know if that's a technological term. So if a coordinator enters the information, it doesn't really fulfill that instance part of it, unless they were to log in as the provider and answer the questions as the provider. And that's not ethical or acceptable. So it's not a route I can use.

It has to be some way to get the information through ASAP and into the instance — which triggers all the other downstream process tasks. It's not just filling out fields. So I did a little discovery with one of the bigger companies, Symplr, who I use at my current job. I opened up the data source while I was in the database and went through it with AI guiding me, giving me feedback. First of all, I went to the website and I was almost convinced they had a good product — if their product was as good as their website it'd be amazing, but it's absolutely crap. So I expected it to be crap under the hood too. And AI was like, this is actually really modern architecture. I was like, oh, okay. It's lots of individual modules, API keys, a whole bunch of different ones.

So I want to see what the options are for getting information into an instance — is that an engineering reality that could happen? I was hoping you could look at it and do exploration with some of these. There are three top companies I identified. I wrote down what I need to know: application template, integration settings, import/export tools, API settings, data mapping tools, workflow initiation mechanisms, and external submission capabilities. Is that all stuff you could detect?

**Simon**: A few questions here. Just to make sure I understand at a high level — the question is basically, you take provider data, and what's the interface between the data you have on the provider and the instance, whether it's Symplr or one of the other downstream credentialing platforms? What's the handoff between the two? And there are three main ones — you mentioned Symplr, and my research turned up a few.

**Stephanie**: Yeah. Symplr, MD-Staff, and VerityStream. I'll send all this to you. The three major ones.

**Simon**: Got it. My research turned up a few already, so I'll look at those too — how easy they make it. So it sounds like your research into Symplr turned up that they have some sort of interface you can input data into, and it's just a question of what that interface looks like across the board, because each system will have a different one. If they have an interface, and assuming it's fairly complete in terms of handling all the data you collect on the provider and mapping it into their system, then it shouldn't be that hard. It should be extremely easy to go from data you collect into their schema or database. And it should come up in the documentation — if they provide this, there should be documentation. The only question is whether the documentation is publicly available, or if you have to have an account with the system. A lot of companies do that — sure, here's our APIs, but you need to be a customer. So it sounds like you guys work with Symplr, so Symplr should have zero problem, and you've already identified some surface area yourself. The other ones would be a little trickier.

**Stephanie**: Well, I don't personally work with Symplr. Vanderbilt University Medical Center does, and that's why I'm employed by — but my company is separate from them. And MD-Staff I have access to as well — access, not an account. When I was looking on Symplr's website, I did see something about creating an account for API something. So it might be that.

But the other thing — I want to make sure that when I say "instance" and you say "instance," we mean the same thing, because the terms can get translated differently. The way I see instance: the credentialing software today is the source of truth. The background, with all the data and information — that's the big block, like a clearinghouse. And then an instance is something that pops out, collects information, processes it, and brings it back in when it's done. That's how the application is. Is that how you see an instance?

**Simon**: No, that's not how I think about it. In computer science, "instance" is a very special word — and I agree vocabulary is extremely important for us to align on. My idea of an instance in this context: when you deploy enterprise software, you have your base package, and an instance would be that package deployed for Vanderbilt, or deployed for Hospital A, then Hospital B. Each deployment in my parlance would be an instance of the base set of packages — but for this customer, with this set of data, these parameters.

**Stephanie**: So I think we are thinking of the same thing, because I did see that "deploy" word a lot. I think the way Symplr is using it is that each applicant is a deployment. So that's how they're seeing it — mapping it all together between you, me, AI, and the software companies' lingo. And the legacy software currently has to integrate with a lot of external sources using API keys — it scrapes information from different websites and pulls it into the instance. So at least that's available. The information is provided by the applicant or the company, then the software goes out and collects verification of the information and documentation. There's a lot more processing further downline that the instance needs to stay open for, until the completed application is approved — then it closes or finishes, and it's just in the source of truth after that.

**Simon**: Got it. So the way you're using "instance," your mental model — to me I think of as a case. This is a case for this individual, we're opening the case, doing the credentialing and verification, then we close the case — applicant approved, applicant rejected. So your instance is my case. I can do the mental translation. Keep calling it instance, I've got it.

**Stephanie**: Okay, I think we're aligned now. So what would you need from me to be able to do that sort of discovery?

**Simon**: I understand at a high level what the objective is. One question — you mentioned this would inform the MVP. Depending on what gets uncovered, this would affect what we decide to roll out in V1 or build initially. Can you outline your reasoning — depending on what we find, how it affects what the chain reaction looks like? I think that'd be helpful.

**Stephanie**: So there's a way for the information, the application, to be submitted through ASAP, through the instance — that's the ideal situation. The next option would be a heavier integration, using the hospital's IT team to build a bridge from ASAP to that. So it's an interface-type thing, and it's also a mental model of what I need to sell — that's a heavier lift than just "we can do it with API keys," so I'm trying to prepare for that. And then option C, which I don't really think is reliable — some sort of screen or layer over the existing application. I don't know how that would work. So I just have to see what our options are and then come up with a game plan.

**Simon**: Got it, that makes a lot of sense. If you could send me an overview document — here's the problem, this is exactly what we want to find out in discovery — and if you have an initial set, like Symplr. I'll also do a bit of research to find out what the target systems would be. You don't have to spend much time on it — it doesn't have to be fully brained-up, just an overview: here's what we're looking to uncover. That'd be a good starting point, and then I can get back to you with a proposal on that.

**Stephanie**: Okay, that sounds good. And I also wanted to add — if you need access to see the systems or go through them from a user perspective, I'm happy to do a screen share. I can show you stuff from MD-Staff or Symplr.

**Simon**: I did mention that in the proposal — a one-hour walkthrough or something. A hundred percent, that would be extremely helpful for me to have the mental model mapped out correctly. That'd be a good starting point when we're ready — after discovery, once we've figured out what the MVP looks like.

**Stephanie**: With the information I send, should I also send over any documentation I have from prior integrations and installs and stuff like that? I don't know if that would be helpful.

**Simon**: Yeah. What you can do, if you still have it available — that session you did with Symplr and Claude or ChatGPT — just tell Claude to do a brain dump for me. Give it the context: "Hey, Simon's this guy and I want to send him this information." Claude will be able to tell me exactly what I want to know.

**Stephanie**: Okay, that'll be good, because I still have all those screenshots too. So I'll get that over to you sometime today. I have a busy day, but at some point I'll get it over to you.

[wrap-up small talk]
