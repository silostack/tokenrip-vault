---
contact: David LaSaee
company: Providence Capital Funding (contractor)
date: 2026-10-10
call_type: firm-direct
participants: [Simon Pettibone, Aleksandar Perak, David LaSaee]
prep_file: n/a
sensitivity: internal-only (David's quotes, Providence economics, JPMorgan references)
---

*Cleaned per process-call rules. Dropped: holiday banter, Claude-plan usage chat, Fraser's forwarded "Cyber" email and the stock discussion, David's internet outage, notetaker links. "[ ]" marks my bracketed edits.*

## Pre-call (Simon and Aleksandar, before David joins)

Aleksandar: I kind of pissed off Erin, actually. I don't know what they're doing.

Simon: Because she didn't send it. She acknowledged, then dropped, and then nothing happened.

Aleksandar: It seems like a simple email. Monday's useless because everyone's out, but Tuesday morning. Especially now that we'll be paying her, we gotta get moving.

Simon: If these guys are willing to foot the bill, which it seems like they are, I don't see any reason we can't accelerate this.

Aleksandar: If they agree to that cap, then we can get Erin to handle a lot of those filings. Not a huge deal if we did it, but nice not to.

Simon: A huge win. You and I aren't going to have to have super long Claude Code sessions.

## Send status and email metrics

David: You guys are running the show. What do you think about the campaign? 1,567 emails so far.

Aleksandar: Yesterday not as many sent as it should have.

Simon: I'm going to be investigating that. On the 8th we went over. We had a cap set at 400 a day and we sent 484. Yesterday, the 9th, we sent 334 instead of 400, and it had to do with Tennessee. The Tennessee mailboxes had 66 that were supposed to go out and they didn't. I haven't figured out what the problem is yet, but I'll iron it out. First week, initial couple days, we had a bunch of kinks. We updated the sequence. Initially a three-touch sequence, we expanded it to six-touch and expanded the days. We had a bunch of bounces. We used a few different providers and they all returned basically the same results, so I think the email bouncing might be one of those things we have to live with. The idea is to keep it under...

Aleksandar: 3%, which is pretty high.

Simon: Yeah. It's probably something I'm going to keep looking into until we have a reliable way to keep it down. All this is to be expected on week one.

David: What's our target? We're trying to get below 1% bounce rate going forward.

Aleksandar: Given how small these companies are, hovering around 1% would be pretty decent. With bigger companies where there's better data we could get a lot lower. There are two aspects: the email verifier, which we run on everything but these providers aren't perfect, and how we actually get the emails. A lot of it is the nature of owner-operator companies, there's not much public data on them. On the other results, we have a good reply rate, 2.7%. That's not a positive reply rate, but it means we're landing in inboxes. And we have the one positive reply, one for 1,500 emails. We should probably evaluate between 500 and 1,000 emails, but it's day one. When you spoke to that guy, he said he liked the no-down-payment aspect, so we'll learn what's more appealing as we send more and talk to more people. Even though it seems like that guy was a bit far out.

David: This is going to be difficult to approve. He wants to borrow 250,000, he doesn't even have a company, and he has never borrowed before. If we close that deal and fund it, less than 1% chance. If he was buying something at 20,000, yes, but not 250,000. Lenders look for: has this guy borrowed before? Incidentally, the 100% down payment was not the email message. The email message was "American lenders," which he didn't understand. So I wonder if we need to change that to "US-based lenders."

Aleksandar: Got it. We could tweak that, or as we send more we may realize that's not really a huge value prop over email.

David: All our focus groups in the past, they say American. They want to make sure they're not dealing with somebody in India or China or Russia. I just think we haven't worded it correctly. Our copy needs some help; I can work on it tomorrow. The pain words are 100% financing, a US lender, and somebody who listens to you. At the end of the call the guy said, "Thank you for taking half an hour talking to me. Most people hang up on me as soon as I talk." When he says he doesn't have a company, they say, "When you have a company, give us a call." I was collecting data. I wanted to know why he contacted us, and I found out he gets multiple emails and calls them all, and they just hang up on him. That's the human approach. I think that's what we've got that other companies don't, because the others want to make money, so why would they talk to a guy who maybe in six months might be a borrower? They go for the live fish. The guy's 62. He said most guys are 18 years old and say "hey, dude." I'm not a dude. They hate the word "hey." It's our ICP, totally. When I called him I said "good afternoon, Mr. Walls." They're not formal, but they're old-school. I'll work on the copy.

## Opt-out language test

Aleksandar: Along those lines, maybe it's worth researching how this impacts deliverability, but I feel the opt-out message makes it seem a lot more automated, bot-like. Small sample, but the origami campaigns I was doing had a lot higher positive replies. If there's a message at the bottom that says reply whatever to opt out, it seems like it was sent to a million people. Maybe test deliverability without it.

David: Keep in mind, by US law all mail campaigns have to have an opt-out. We don't have to follow US laws, but on a small scale you can get away with it. My concern is not the government, it's Yahoo and Gmail coming back and saying you're sending this without an opt-out. Then they burn your domain. That's always been an issue. How do you handle that?

Aleksandar: And Simon's going to pick up the phone and say, "I'm from Colombia."

Simon: It's tricky. I'm personally on the side of leaving out the opt-out; I agree it makes it seem automated. Maybe there's a way to word it. The bigger concern is exactly what David said. And with these systems getting as smart as they are, my even bigger concern is them connecting domains: we burn one domain, that's fine, but we connect a new one and they say "this is related to that other one we burned." Then we burn the whole thing. I don't even know if that's a real concern, but I wouldn't be surprised if providers are catching on.

Aleksandar: The more likely scenario is that any email with opt-out language goes straight to spam, more likely than being blacklisted everywhere no matter what you do.

Simon: Could be. I wouldn't mind testing it: maybe 50% of the emails take out the opt-out message and we see how they perform.

Aleksandar: Or do a week with it. Next week is also Tuesday to Friday because of the holidays. If I was Google and wanted to avoid spam, rather than triangulating IP addresses I'd say anything with opt-out language goes straight to spam. That seems much easier.

David: This is Groundhog Day. This is my eighth or ninth time doing this. At Apollo, which was large, they didn't want to take it out. A guy there said we can use VPNs and they'd never know our IP addresses. We used a VPN and got zero response, so providers appear to block VPNs too.

Aleksandar: What about the private servers, like Smartly has, to send from? Simon, you can speak to that better.

Simon: You can say send all my email from a single IP address, which lets you build up a reputation around that IP. It's fairly expensive but it's supposed to improve deliverability. Probably once we get to scale. I'm not sure what the ROI would be on day one.

Aleksandar: Not day one. If we're getting banned across all these things we're probably at scale already. I also wonder where the line is between spam and not. Is there a level of personalization that makes it not spam? If you're reaching out to a one-off person you don't put an opt-out message there. If you're sending the same message to everyone you do.

Simon: That's a good question.

David: We definitely have to test it. We're all in agreement, let's test without it. But once we get to the second and third touch, we definitely have to put it in, because the guy will report us as a spammer. I did it on the first email, I immediately say "spammer, stop this." We're still in the baby stages, so let's do the baby walk. Our concerns are open rate is not good, bounce rate is not good, and a very small sample. Do we even know click-through? It seems the system is not picking it up.

Aleksandar: To know that you need links in your messages, and if you have a link it hurts deliverability.

David: So we will never know if they click through. We are basically blind. We don't know how many of these guys are actually seeing it.

Simon: Correct.

## Targets and the applications count

David: We're going to be at scale in three weeks, is that correct?

Aleksandar: Roughly, full capacity.

David: Then we need targets, and if we don't hit them we have to regroup and say what are we going to do next. So far, with one positive response here and you had two from previous emails, altogether with Providence Capital we've gotten four applications, is that right? Or five? I pulled Sasha, the guy I talked to yesterday, he's not in the pool yet, so that's, call it, two. Then you had one with Max that was for 80, I looked at it. And two with Marco or somebody else. I think it's a total of five for about 3,000 emails, right?

Aleksandar: Yeah.

## Vendors: Kimball Equipment

David: What I really want to talk about today is how to hit the vendors. We shouldn't stop what we're doing, but even if we catch one vendor, we're so much better off than catching two, five, ten of these guys. I'm going to pull up a vendor that has been golden for one of the guys here yesterday. They had a $45,000 GM on one deal, and the guy just sent them seven more after that. Give me a second to pull up the name.

Aleksandar: The vendor angle is something. With email right now it's a waiting game for more data. Once we have maybe 10 or 20,000 emails sent we could draw better conclusions.

David: How are you guys coming along with fully automating this and getting AI agents? Are we a month out, two months out?

Simon: I'm not sure what level of automation you're talking about, but right now the whole thing is automated.

David: We're talking about getting the AIs to do some of our legwork. Anyway, the company is Kimball Equipment, kimballequipment.com.

Aleksandar: Kimball Equipment Company. They have 15 locations.

David: So this is obviously not a single location. One of the new guys called them, and it's all about timing; you get the guy on the right day. They did a $1.2 million deal that they made $40,000 on. The guy doesn't know how to optimize the deal, but what impressed me is they got seven more deals. The guy said, "I like the way you guys did this, I'm sending you seven more." These guys used to work with Wells Fargo. He got pissed off because Wells Fargo didn't return his call in two minutes. He's very high maintenance, wants immediate attention, which is okay, I can do that for him. But the companies we went after before were single-location, small tickets. This is not a small ticket. The question is, how do we find companies like this?

Aleksandar: I think it's easy to find companies like this. It's more, how do we sell them?

David: We've got three stages. How do we find them, how do we qualify them, and what's important about this guy. He has a financing tab.

Aleksandar: There's no named company, though. It says they have a finance manager.

David: So maybe we're looking for companies that have a financing tab but don't have a partner. I'm spitballing.

Aleksandar: That could mean they don't have a partner, or that a financing tab with an unnamed person means they have many partners.

David: This guy was already working with Wells Fargo and got pissed off. The guy our guy called was mad that day and had a live deal. He needed something to happen. Let me also email you the vendor list; you've given me a list that still has 25 to go. I think from here going forward maybe I should really concentrate on cold calling vendors. What do you think?

Aleksandar: Right now it seems higher leverage to email the end users and then call the vendors. We just need to nail down which vendors we want to call, and what the value prop to them is, how different we are.

Simon: That's what I'm thinking: what's the offer? You mentioned these guys get six calls a day from financing partners. On Kimball, maybe they only had one partner, Wells Fargo or whatever. A lot of companies that only have one partner, there's got to be some portion of deals that partner isn't going to fund, especially a banking partner. It seems weird that any of these guys would only have one partner. Maybe that's something to look for. You'd have one partner for this kind of deal, one for that kind of borrower. But really, what differentiates us from the other five guys they talked to that day? I don't know what that is yet.

David: That's the billion-dollar question. Without that we can't do an email campaign. I'll send you the spreadsheet: 50 of the 73 have been contacted, and as you'll notice a lot are already in Providence's database. With the end user it's okay to send hundreds of thousands, and if it comes back and it's in our database, we don't contact them, you take it to somebody else. With these guys there are too many that are in our database. Some are dormant. The pink and orangey color are the ones in our database.

Aleksandar: With vendors there are only so many of them versus borrowers. If one of the value props is that you're at their beck and call, I think you call them, rather than automating an email campaign.

Simon: I think it's okay if these vendors are in Providence's database. Ideally Ironmark would own the relationship versus us contacting the vendors and then giving the vendor to Providence. That doesn't make much sense to me. What can Ironmark do? Maybe part of it is: "You only have one partner right now, which is a bank. We can give you a different partner for whatever borrower walks in your door. Your banking partner won't approve them, or won't approve them in the time the buyer needs. No problem. You partner with us and you've already partnered with five, ten guys."

David: Multiple options. That's the value prop. A quick reaction is one. Obviously we can't offer any pricing, we have no advantage there, but it's something I wanted to put on the table. If all three of us want to make money off this, I think the end-user campaign will eventually bring us some business, but I don't think it's enough unless we get to 100,000 emails a day, which I don't see. I think we run into a capacity issue. What's the maximum we can do? Two thousand a day?

Aleksandar: I was thinking ten thousand, eventually.

David: Eventually, two months out, three?

Aleksandar: Ideally we want proof of concept before we scale. Say next month we've funded four or five deals, then we scale it to 10,000. We can scale it as fast as we want.

Simon: It needs to be backed by a track record. It doesn't make sense to scale to 10 if we can't prove it works at 1,000.

David: So what's hurting is we're not sure our email verification is correct. Simon, you want to think about that.

Simon: I'm going to be continuously monitoring it. Like Aleksandar said, it's email verification and then where we're getting the email from: source verification. It's a continuous systems-level thing.

Aleksandar: These are recipient-level bounces, dead emails, versus domain reputation. If it's not hurting our domain reputation and it's what comes with emailing small owner-operated companies, it may just be the cost of doing business.

David: The key is the source where the emails are coming from, which goes back to intent, and whether they're really our ICPs. If you're looking for gold but digging in a silver mine, we'll never find gold. This dealer-lender thing goes back to source too. We need to find entities that don't have a financing tab, or have one that doesn't identify who their partner is.

## Branding and how vendors get approached

Aleksandar: In terms of vendors, it seems like we're nailing the ICP a decent amount. Any vendor that you're already funding helps us see what's in Providence's wheelhouse. Going back to what Simon was saying, the issue with the Ironmark branding is: what's the actual flow? These guys aren't calling us, they're going to be calling you. When everything's just under Providence it seems kind of sketchy, and we don't have any track record, so it's a tougher sell.

David: That goes back to branding. First of all, we're not emailing the vendors, right? We're just calling them?

Aleksandar: Just calling.

David: Calling, they don't know how I found their name. Of the 73 on that list, not a single one asked how I found them, because they figure their information is public. Let's not mince words: on that list there are a couple of funded vendors, and you could say maybe we go sell it to Ironmark and go sell it to somebody else, but you'd be stealing the information from Providence and giving it to somebody else, one or two at a time. Calling them from here, I don't know how Ironmark is going to work. It's sketchy. I'm not following what you're saying.

Aleksandar: Approaching vendors under Ironmark is a tough sell, or logistically I don't see how it works, especially day one.

David: If you're emailing them. Cold calling, we can't cold call from Ironmark, because they're going to start asking you technical questions and you're going to get stuck.

Aleksandar: That's my point.

David: And we can't email from Providence either, because they could be our existing customers.

Aleksandar: I don't think we should email them. I think we should just call them, and for now under Providence.

David: Is there anything else we're missing? Because we're leaving out the email thing. It's about timing. If Kimball had gotten a call four days earlier or later he wouldn't have been interested. He had a need that day. Only so many calls can be made. Maybe I should stop calling everybody else and call a hundred vendors every day, and see whether we get lucky?

Aleksandar: That might be a better path. If it's a timing thing we could email all these guys every week, but we don't have the capacity for that yet, and we run into not knowing if they're already Providence's vendor. So maybe we just focus on calling vendors.

## The discovery-call frame

Simon: I'm just spitballing, but I wonder if we call them not under the pretext of pitching a financing partner but more as a customer discovery call. When you're trying to sell something, on the first call you're not pitching anything. You're trying to understand what the customer's needs and wants are, what their problems are, what keeps them up at night. The Kimball thing is interesting: the guy happened to call when he was having an issue with his banking partner. If someone walked in and said "we have a magic wand, this is how it would work," what would that look like for the vendor in terms of their biggest pain points with financing, or anything really. We don't need to limit ourselves to being a finance partner.

Aleksandar: You need to be more pointed. If someone randomly called you and said "what are your issues?" why would you tell them? Versus if you call a vendor and say "who does your financing?" and they say "a bank," and you say "what if they don't have great credit?" You still need to position yourself as someone worth talking to.

Simon: That's just part of sales. The ultimate question is what's the goal of the initial call: to close a sale, or to understand what it would take to close a sale. It seems related, but having the destination in mind leads to very different conversations on the phone. If you're going for the second, you don't just walk in with "what keeps you up at night." You still need sales intuition and the customer has to understand what the pitch is. This is just me spitballing.

David: No, it's brainstorming. We've reached a point where we need to make adjustments and do some pivots. Any business you talk to, there are three major pain points. One, I don't have enough business. That's the most common. If you're calling them, they're asking: can you give me more business? If you can't say yes, they say why do I want to talk to you. The door is open, I'm paying rent, there's not enough people calling. That goes to our B2B, that's what we're trying to perfect here. When you call and say "we've done this with other companies, we can increase your business," now you have a sales pitch. Two, I don't have enough products: there's not enough of what I sell available in the country because it comes from China and has a tariff. Three, I'm a total idiot, I don't know what I'm doing. But finance really is not a pain point. I did this for fun: I'm a vendor looking for a financing source, see what AI comes up with. AI gives you a list. So AI is taking that over. This guy was pure timing. Two hours earlier, two hours later, probably no deal. So sending email every day is going to be annoying and eventually they're going to block it. But I don't think we should give up. There should be a scalable way without a human being the first contact. Now, I cannot make that call from here. Are you guys able to make those calls from where you are? That's a totally different business model, calling somebody.

Simon: Alek and I can make calls, no problem.

David: That's a different model. One thing we can do is I can call a hundred people a day. The question is how long it takes you to figure out if there's a hundred vendors we can call.

Aleksandar: By Monday, or this weekend?

David: Because that's five hundred vendors a week.

Aleksandar: If you let me know the types of vendors. The spreadsheet of the ones you've already funded gives me good color on types, and I probably have a good idea. I just need the criteria.

## Vendor criteria: back into it from the equipment list

David: We back into it. We take our preferred equipment list, we ask who sells this equipment, and of the companies that sell it, how many don't have a financing partner, and aren't smack in the middle of Chicago or Houston. A little further out, but not in Timbuktu. When I say small tickets, yellow and red on the sheet, it's $7,000. Providence is getting to the point where they're saying anything below 20,000, we don't want to process it, because it takes the same resources to do 20,000 as the 750,000 deal these guys did. Last week they did 42 closes and 156 applications. And what's stunning about that deal: I studied the ICP for two hours last night. The guy put down $400,000 cash because he could only be approved for $750,000, and the deal was over $1.1 million. Everything else was a small operation, fewer than 10 employees, a small town. Perfect hit on the ICP.

Aleksandar: And just a thought, you can tell me if this is [dumb]: what if we went to equipment companies that have a financing page with a big bank on it, a Wells Fargo or whoever, and you approach them as "I'm helping vendors with worse-credit customers, I can fund things Wells Fargo couldn't, I get the leftovers." Would that be a potential play?

David: It is a way of going, but I'm afraid every finance company, forty-three thousand eight hundred of them, is doing the same thing. Everybody's zigging, we need to be zagging. And just because they have Wells Fargo on their website doesn't mean they don't have other small finance companies on the side. But at this point we need to try almost anything. If I'm going to make a call I'd rather make one with a better chance of success.

## The Danielson example

David: Pull up Danielson Properties Inc. What they do has nothing to do with properties. They're in Idaho. A logging contractor. They don't have a website. The guy is so new he doesn't put much in the CRM. They use a Gmail. It's a husband and wife. She signs the loan documents, and her husband doesn't even have an email, and for loan documents they need two. Yesterday everybody was frustrated, so I literally had to get on the phone and say "this is how you set up a Yahoo email." She asked "is it going to cost us?" and I'm thinking, you have $400,000 in a bank account. Look at this ICP, look at the location, look at what they do. They're not even in a city. It's a block, a piece of land somewhere that somebody has a zip code. This company did 12 million dollars in revenue last year. Four employees; when they get a job they get some people who can drive dozers. I was upset last night and up all night thinking, what is it that we have that other people don't? I think the three of us have the ICP down so perfectly that other people may not. The challenge, and that's what kept me up, is that guys like this, there's no way we can find information on them.

Aleksandar: We can't email them. They don't have an email.

David: They have a Gmail, and Sally says she checks Gmail. That's why I think we continue working on perfecting the system, because it's not for me, it's for Ironmark. Once the system is perfected, maybe you go after a different type of clientele, for different lenders or different entities. But for our purposes, for the three of us to make money, I think we really need to zoom in on the vendors.

Aleksandar: I think so too. So sticking with the ones we talked about before: middle of nowhere, one-person shops, single location, and the equipment types. Or do you have different thoughts after calling those?

## Burned phone numbers and the ticket filter

David: On the yellow ones, the small tickets, we've got to find a filter not to call those. Why this matters: in the four weeks since we started working together, my number has been blocked substantially. These are the numbers that got blocked yesterday. About 50 numbers. When I get 50 blocked, Verizon, Spectrum, AT&T show my name as a spammer on caller ID, so I won't get through to other people either. I was talking to the JP Chase director of communication last night. He said Verizon is blocking you but not telling you; it drops the call into the customer's voicemail. The Spectrum phone doesn't even ring. In some cases it won't go to voicemail. I said what do I do. He said stop making phone calls. He asked what happened in the past few weeks; I said I've been making a lot of cold calls. He said you're burning your number, and right now your number probably cannot be repaired, so the company has to get me a different number. So what I'm saying is we have to be cautious not to call companies that are not in our wheelhouse, a company selling something at 800 bucks. And maybe I literally have to spend a few minutes researching each company before I call.

Aleksandar: Those labels help in figuring out what we don't want. We can filter for small tickets, a rule that if they don't have anything over a certain amount listed, or a bunch of $5,000 or $10,000 things, we exclude them.

David: I think that's the key. Anything less than 20,000. There's one green guy in there, Mike, who is retiring, North Carolina, only one green on that whole list. He sells cranes. He said, "I have a guy who wants a $20,000 crane, I don't even want to work on it because I don't make money off that." I asked what's his average ticket. He said if it's not $200,000 I don't want to deal with it. He's 65, he doesn't have time, he's retiring, so that guy's going to be gone. Going back to the logging company, I think we have two ICPs. One is single location with no financing partner. The other has multiple locations like Kimball, but with an unlisted partner or no listed partner.

Simon: If we can call vendors that don't have a partner yet, or only have one, that aren't in a major metropolitan area and don't have as many people calling them every day, we don't need a super offer right off the bat. Just: we're going to hook you up with something you don't already have. The offer is taking them from zero to one. That could be a good initial starting point. From conversations with these guys we'll learn what vendors care about. Then the second batch, once we've upgraded, is going after the bigger guys, and that might be where you need a more slam-dunk offer.

Aleksandar: First start with the middle-of-nowhere vendors, see how many we can find. Once we've exhausted those there are probably infinite multi-location vendors, but then we really need to nail down an offer. Until we figure that out we can call these one-offs.

## Filters from Kimball's inventory page

David: Do you still have the Kimball site up? Click on inventory, sort price low to high. This guy doesn't have anything under a hundred thousand. Most of these guys have inventory listed. A real vendor has real inventory. So maybe we scrape vendors' inventory: if it doesn't have at least ten pieces we're wasting our time. And the minimum has to be 20,000, with more than 10 pieces available for sale. If they don't have ten pieces there aren't many people knocking on their door. We're going to miss vendors that don't have good websites, but I question whether the business is good. It takes less than a thousand dollars to put this website together.

Aleksandar: Pretty simple.

Simon: I agree. Maybe a little research into the spectrum of vendors. The guys that don't have websites, in the middle of Oklahoma, drive-by dealerships with equipment on the front lawn, that's their main advertising. They might be even more apt to work with us, because they don't have anything, so there's no telling what we can help them with.

David: Traditionally the ones with only equipment on the lawn have $10, 15, 20,000 items. If they have high-ticket items they have high margins. A regular tractor for 18,000, I've got ten of them, and the guys finance them through local banks and credit unions. The other thing on Kimball: look at the manufacturers they carry, bottom of the first page. None of these provide financing. It's not a John Deere or Komatsu. So we figure out who their distributors are, and those distributors are going to be guys like this.

Aleksandar: Do you have thoughts on OEM financing, going to manufacturers versus dealers?

David: I've tried that for 20 years. They will not give you the names; they say the last thing we want is their phones ringing with spam calls. What we can do is scrape their websites for who their distributors are.

Aleksandar: You could scrape for who sells their stuff. But from what you're saying, Kimball seems like a one-off event versus a pattern. Maybe look at the funded vendors on the smaller side, see what type of equipment they distribute, and look for others distributing that type.

David: We can do that here too, because this guy listed his manufacturers. We take Superior, Cedar Rapids, figure out who their distributors are, and see whether they have a financing partner on their website. If they don't, we hit them.

*[Group walks live through the Cedar Rapids dealer locator on screen.]*

Aleksandar: General Equipment, Fargo, North Dakota. They have a financing tab. They name vendors but not the banks. It says they work with several banks and financial institutions.

David: That's normally not a good sign. I'm looking at the one in Wyoming. Doesn't have a financing tab.

Simon: I found another one without a financing tab. So it's fairly common, actually.

David: I'm checking their inventory. They have lots of stuff to sell, nothing under $20,000. The Wyoming one, Power Equipment Company, sells Volvo, and Volvo has its own financing. There's no doubt in my mind he hasn't listed Volvo, but Volvo would finance all their own equipment. For fun, let's see if Power Equipment Company is in our database. There's one in Tennessee, not Wyoming, though we may have it under a different name. Nevertheless, these are the companies I should be calling. I think this has been our best call ever. We're actually finding something logical.

Aleksandar: I'll make a list of these types of companies and the smaller ones, and we'll see what we have success with.

Simon: If you're running the list, we might as well grab the middle-of-nowhere ones with the equipment on the lawn too, then classify it. I'll do it too.

Aleksandar: I'll look for the bigger ones like these and the smaller ones, and compare.

David: And remember, we're doing this to figure out what works and what doesn't.

Simon: We store a few data points: equipment over or under 20k, financing tab on the website, that sort of thing. A few metrics on each dealer we can slice and dice to decide who we call, who we send campaigns to. Tier one, two, three.

David: So you're still thinking at some point we'll be emailing these guys?

Simon: Not necessarily.

Aleksandar: Eventually there's higher leverage, like those conferences: "we're going to be there, set up a meeting." The bigger ones are probably more relationship-focused versus spray and pray.

## Wrap-up

David: Let's sum up. On end users, you guys continue working on good email sources. Is there anything I can do on my side? I did not have good luck with Apollo, or with the platforms B2B Rocket uses; there are about 20 of them, the same companies.

Aleksandar: A lot of these you have to scrape off the web, because the companies are so small. Apollo and ZoomInfo are very enterprise-focused versus these small people in Idaho. We'll work on that. If there are any other qualifiers for the vendors, let us know in Slack. I'll be doing the run tomorrow morning; I'm out of usage today.

David: If you can do even a quick sample tomorrow and let me test some of them, I can take those to JP Chase and see if they're doing business with them. If JP is doing business with them, that's not a good sign for us. They have a very sophisticated system. Last night I checked: they have over 1.2 million vendors in the United States. I figured out how that is: all the little guys with their tractors out front have bank accounts, and once a bank account comes in it's classified as a vendor. It's not because they funded them. Anybody who has a store that sells equipment shows up on their vendors list. Car dealerships use floor line, which is normally provided by the manufacturer; Ford gives them the line, and in some cases Wells Fargo or JP Chase, I saw 72 locations in California. We can never go after those guys; they don't need us.

I'm looking at some of these websites too: the more sophisticated the website, the less chance we have. Kimball's was pretty simple, I could have done it. Power Equipment Company is using high-definition video; I don't know how we're going to do this. They have a lot of locations too.

Aleksandar: General rule of thumb, if it's a small mom-and-dad owner they're probably not going to have a good website.

David: Correct.

Aleksandar: I'll get those lists over to you. We'll continue on the emails. They won't go out Monday, I guess, because of the holiday, but they'll go Tuesday.

David: Monday banks are closed. Look, I want the three of us to work together and make this work. But you also want to set up the system for yourself, whether it's with Providence or some other company. This email thing, you're kind of the guinea pig; Providence is the guinea pig here. You're going through it to figure out the kinks. If I were you, and I don't know what the expenses are, I would drive this all the way to full optimization, because you want that system available. Someday you may have a customer for whom email actually works.

Aleksandar: I was asking whether we should send emails on Monday.

Simon: I'm not sure it makes a difference. If all of us are going to be available to reply to an email immediately... we could split the difference and send half. I think we might as well send them.

David: Banks being closed has nothing to do with us. It may help us, because banks send out emails too.

Aleksandar: Is the hick over in Idaho on or off?

David: They're definitely working, they're entrepreneurs.

Aleksandar: Send it then.

David: Yeah, let's send it. I look forward to getting something tomorrow, if you get me some, so I can set it up to go first thing Monday morning.
