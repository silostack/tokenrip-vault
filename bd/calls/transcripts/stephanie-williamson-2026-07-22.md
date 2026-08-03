---
contact: Stephanie Williamson
company: AICAP Access
date: 2026-07-22
call_type: firm-direct
participants: [Simon Pettibone, Stephanie Williamson]
prep_file: n/a (agenda was in the Google invite; Simon never saw it — see note)
---

# Stephanie Williamson — Week-3 check-in (2026-07-22)

*Cleaned transcript. Small talk, the ~8 minutes of Google Meet screen-share troubleshooting, and filler removed. Speech patterns preserved.*

---

## MVP build status

**Stephanie:** For the MVP build, are there any challenges, roadblocks, what's going well?

**Simon:** Right now as it stands basically all the bones are in place. Being able to fill out the application, getting it all the way to completion, generating the PDF output documents and everything, all that's in place. The tricky part now is essentially the brains. The whole reason why this is valuable. And so that is the trickier part — obviously, otherwise it wouldn't be valuable to build.

So I'm working through your issues that you opened up this past weekend. It's actually uncovering a lot of, I would say, gaps in the domain model — basically the way that we modeled the world. And so that's good. For example, the moonlighting issue — that uncovered the fact that I'm not modeling a health system. So you can have multiple hospitals all under one health system, and then if they're in that arrangement then you can infer a lot of things with respect to coverage and all this other stuff.

Some of the issues you presented are super easy, I can just knock those out. Some of them, once I start digging — like the moonlighting one uncovers a model issue, and then that's where I need to essentially update the world model that we have.

At this point I feel good about the world model that we have. There is now a good amount of data that I've collected — a lot of actual hospital data, real health-system type data, that we can start testing things with. So right now it's basically working through the issues, updating how the brain works, and getting that on par with where your mental model is on all that.

**Stephanie:** What do you mean by hospital and health system data? What is the specific data?

**Simon:** I'm feeding the database with actual hospital names with here's the health system that it's under. It doesn't necessarily need to be data that's going to be kept for production. I'm pretty confident that the data is correct just because of the way that I got the data. But the idea is I need that data to test the system out, so that we can make sure the inferences are happening correctly, the reasoning is happening correctly.

**Stephanie:** That was one of the things I wanted to bring up, because in my mind it's all working great, but then I'm like, well, where are we getting that reference information — the actual hospitals, the addresses and stuff? I think that was one of the things I brought up in one of my messages — does ASAP build a kind of master address book? Do we import from the hospitals what they already have, because they have decades of addresses and contact information.

**Simon:** It really is how deep you want to go. Ideally you seed it with as much data as you possibly can. Having said that, being a data guy is a whole science — making sure your data is clean, you're getting it from the right place, it all maps together correctly. Basically we can get all the way in terms of collecting the data, as long as we're getting it from trusted sources.

---

## How the system learns (and how to frame it to customers)

**Simon:** So there's that side, where you have a good amount of starting data that you trust and that provides the baseline inference. And then the other part is having the learning mechanism so that the system itself learns.

The moonlighting example is a pretty good example. If the system discovers you've been moonlighting and it's not able to infer that it's the same health care system hospital, then it asks you — is this the same health system? And the provider answers, yeah it's the same. And then that piece of data links these two hospitals to the same health system. That's how the system learns. The system makes a note of "we think these are under the same health system," and it surfaces that to the coordinator. The coordinator has a screen where it has assertions that the system is making. So the assertion would be, this hospital and this hospital are both under the same health system. And the coordinator just says, yeah that's correct. And then the next time that issue comes up, we don't even have to ask the next provider, because we already know — the system has learned this is a health system, here's the hospitals underneath it, and we don't need to ask that question anymore.

So there's those two aspects: having a pretty good baseline data layer, and having a mechanism where the system itself learns with usage.

**Stephanie:** Is that an LLM?

**Simon:** No, it's more just a data thing. The LLM makes the hypothesis — it says, I think these two hospitals are the same based on this set of information that I have. But we still rely on the coordinator to actually say yes this is correct, and then it becomes part of the system, and the next time with the next provider it doesn't need to be asked anymore.

**Stephanie:** So when I'm talking to potential customers, is that something I should keep in mind — that the system will go through a learning phase when it's first implemented?

**Simon:** I don't think that's necessarily... My concern is if you frame it like that then it's almost like, if I'm the customer I'm thinking, oh, then day one it's dumb. Which is not the case. It's not that it's going through a learning phase — it learns things that are specific to that hospital or to that deployment. Just the process of providers going through the system will adapt to it. Adapt is maybe a better term.

It starts off with here's what the hospital's rules are — from day one the hospital's rules are encoded. But then as applications come in there's going to be corner cases and things that are not explicitly configured in the hospital. And this is why the coordinator human-in-the-loop is so important, because the coordinator will have the judgment to say, oh yeah this is right, this is not right. So it's a feedback mechanism where the system will adapt to the hospital's nuances and their way of doing things and the kind of data they need, to streamline the process the further it goes along. As opposed to — if you tell the system these two hospitals are in the same health system, and then the next provider it wastes just the same amount of time because it didn't learn that fact, then what's the point.

**Stephanie:** We'll have to watch for making sure that the rule that was set up for moonlighting doesn't inadvertently apply moonlighting to anyone that's affiliated with that hospital.

**Simon:** Yeah, there's going to be nuances that we'll discover along the way. But that moonlighting scenario — when I dug through that specific scenario, that rubric applies in a number of the other issues that you opened up that have very similar patterns.

**Stephanie:** My end goal in this line of questioning is — the reason I was asking, should I prepare medical staff offices when we're getting ready to deploy, that there might be a little bit of extra work up front as the system adapts. One of the major complaints about the current software from medical staff offices is that there's so much clicking around — to do a single task takes so many clicks. So if there's a way I can say, these clicks will decrease over time as the system continues to configure once deployed, then I can bump up against that before they say anything about it.

**Simon:** That's the whole goal of the system — you teach it once and then it doesn't even need to ask you the next time. That's one of the core tenets, at least the way I'm thinking about it.

In terms of the issue with doing a lot of clicks — I'm guessing it's very tedious and rote, it's like, why do I have to click all these things. There's a number of different ways to tackle that. Even in the product now, there's some built in — confirm all, and that reduces clicks that way. Now that I've built the platform I kind of understand why there were a lot of clicks before, but we can definitely make a lot of improvement in that area for sure. The idea is, automatically just make it super easy to confirm, and then only surface things that really need the human judgment.

---

## Communication check-in

**Stephanie:** How do you think our communication is going — the back and forth, like when I'm going through things and wording things, is that coming across okay?

**Simon:** For me it's been totally fine. If I have any difficulty, or if I'm not quite sure what you mean by something, then I just run it by Claude and Claude's like, oh, this is what she meant. It's not bad at all, I don't have any complaints. As far as the workflow with GitHub, that's really good for me, because it's a very clear way of handling something as opposed to a bunch of text messages or emails. Having an engineering-oriented way of communicating with respect to the actual product works for me. If there's anything on my end that I can do to help that out, I'm all ears.

**Stephanie:** I don't think so. I get emails anytime you close something or leave a comment on something. So I read it, but it usually just seems engineering-y, above my head. So I'm just like, you know what you're doing.

**Simon:** That's really good feedback, because that's feedback for me to make it less engineering-related. I'll keep that in mind with my GitHub comments.

**Stephanie:** I thought you were more commenting for yourself, not really for me, and I was just getting copied on it.

**Simon:** Oh no. Those are supposed to be for you. Sorry. This is why it's good feedback.

**Stephanie:** For document sharing — you said you didn't have a preference about what we use. Is that still correct? If I use Notion, fill the Notion page and then invite you in, where we can keep all of our joint documents.

**Simon:** Yeah, Notion is totally fine.

---

## Security

**Stephanie:** I wanted to ask about security. A couple of things have come up. One is that my stance generally in life is, more than enough is just enough. So I kind of want to apply that to security. And I was recently listening to some founder, and they were saying in the beginning of their business when they were really small they got hacked and a bunch of data was taken, and they had to start rebuilding trust with their first few customers that that happened to. So that is a concern.

And then also — this is just my general paranoia — that one of the bigger credentialing companies might try to hack me to discredit me in the beginning. So I kind of want to avert all of those scenarios from happening. How do you think we should go about protecting what we're building?

**Simon:** That's a good question. I have a standard, I would say basic, set of security practices that I do for all my projects, personal or professional. And so far I've never gotten hacked or anything. Granted, you might argue I didn't really have anything worth hacking anyway. So take it with a grain of salt.

Right now the way I've been approaching it is standard security. I would be extremely surprised if any of the things that I've touched got hacked. But at the same time I haven't taken any extreme measures by any counts at all. I haven't really thought about security. My thinking so far has been that that is going to be something to think about when we either have something to secure with respect to actual customer data, like PII, or when there's a hospital deployment that we're about to do — and then obviously security is a top priority thing that you need to work on.

I don't know too much about the rules and regulations around security with respect to health care systems. I know the basics of what's required for SOC 2 compliance and that sort of thing. There might be some additional compliance measures that need to be done with respect to healthcare.

In terms of when that becomes a priority, that's completely up to you. As of right now, basically all we have is code, and I don't see anyone trying to hack us for code. First they have to know that we're even hackable — they have to know the server. It's not like we're advertising where our test platform is. So I don't think you need to worry about that.

I think the time will come. Once you have an actual website with a real running system, maybe for demo, then you start becoming a little bit more of a target — everybody discovers a server and then you're a target for everybody. And then there's a next level up where you're a publicly known website, and that increases your visibility and also increases your surface area for attack. So with each progressive level of awareness that you're providing is when you have to start thinking about security.

Was there anything specific you were thinking about securing right now, or is this a keep-it-in-the-back-of-our-mind kind of thing, or was there a target milestone or event that would trigger more awareness around security?

**Stephanie:** I guess I wanted to bring it up before it got too far. And — I have you building the system, it doesn't mean that you're responsible for everything tech. So I can bring in a security advisor if you feel like that's outside of your lane or outside of your area of expertise.

**Simon:** I think one way to do it is, if you tell me, hey, I really want to focus a little bit on security, this is what I want to secure, these are my concerns — I can actually take care of the security aspect. I would say probably 90 to 95% of the way, no problem.

A pretty good way to do it, and this is usually what happens — you build the system, you button down the hatches, you take all the measures that you think are sufficient, and then you have a security auditor come in and he just reviews your security. Instead of building it for you, he comes in, spends maybe a week or a few days, and says, okay, your security is good on this, this, this, here's what you still need, fix this, and then you'll be fine.

**Stephanie:** So when I'm ready to do that, I'll just get like a separate quote from you — a milestone type thing of, I don't know, security implementation? How would that be?

**Simon:** Once we're at that point where you think we should start seriously considering it. And if you want me to give you my thoughts on that, I can do a brain dump as well — like when I think we need to start worrying about security.

For now, if it's a concern, there are some additional measures that I can take, depending on what you want to secure — do you want to secure the code, do you want to secure the server, do you want to make sure no one's getting the data in the database. Or if it's just blanket, that's totally fine too. And I could do that fairly quickly — it's only like half an afternoon, or maybe a day at most.

So I hesitate to say to add it into a milestone. But then when you're ready for, okay, this is soup to nuts, let's worry about security now — then I think maybe a milestone thing, and that would include me doing a little bit more research in terms of what we need to do to be healthcare-platform compliant.

**Stephanie:** So on my Replit website now — it's public, but not very many people know about it. They can find it on my LinkedIn and stuff. So I have that as secure as possible, I did all the things, the Cloudflare, whatever else there is out there. But then I have that RB2B — you know what that is? It's this service, a little bit expensive, that I pay for that tells me who visits my website, but really drills it down. So all of the credentialing systems, like software people, they visit my website multiple times. So that makes me — when you're like, should we secure the code, I'm like, should we? Why do they keep coming back to my website? Nothing has changed on it. They're just checking in on it, I guess.

**Simon:** I would be extremely surprised if any of them are trying to hack or get your data. There's a lot of legal issues there if anybody in that company is being told to do that. That's a very easy way to wind up in jail, lose your company, etc. So I would say that's probably not the case.

A lot of times many companies just have almost like automated watch lists, or automation set up to watch the market, keep track of competitors. And so a lot of these are just bots. Nobody's telling them, hey, try to look in to see what ASAP is doing. It's more like a bot that's checking up on competition or checking up on the market space, the ecosystem. I would bet a considerable amount of money that that's the case here. I highly doubt anybody is trying to hack you — but obviously never say never.

**Stephanie:** Okay. So I'll just kind of leave that on the table for now. I just wanted to chat about it and get your thoughts on it.

---

## The office-address problem

**Stephanie:** So the office address, internal hospital systems. This is one of the things I was going to ask Matthew about. It's a huge problem, because it asks providers for their office address. They don't know where they're going to be working in this giant health care system that you're going into. You really don't know the address. So I'm not sure how we would put that to where they would load the address in, versus the provider trying to select it — because a lot of times the medical staff office doesn't know either.

**Simon:** I'm not quite sure I understand what the problem is. Who's trying to pick an address, the provider?

**Stephanie:** The application usually asks for the office address, and it just says "office" — the normal application. So sometimes they'll put their current office, but that's the place they're leaving. If you're walking into a big health system, you've done a couple of virtual interviews, you met someone for lunch, and you are hired, and now you're filling out a credentialing application — you don't necessarily know, because the hospital address can be like, say, Vanderbilt University Medical Center, campus, third floor, room 283, mailbox something something. It can really drill down into what the address is, and there's hundreds and hundreds of them. So the provider just doesn't know what to pick, and the medical staff office usually doesn't either.

That usually occurs downstream during payer enrollment, where they have to correct the office address to what it should be. So that's one of the things I've been mulling over — I was going to talk to Matthew about it.

When I worked at Stanford, we had it set up so that only one person could change office addresses or add office addresses, because what happens is people start free-typing, adding different addresses. So then you have like 60 versions of the same address. Or a department moves to a different address, but the old address is in there, and only the tribal information knows that. So that's a huge data problem source that is difficult to overcome, and it's not really our area to overcome, but I'm just wondering how to set that up going in.

I would assume that there are some systems that are really organized about it. None of the ones that I have worked for have been particularly organized or good about it. Even with Stanford, you're still just kind of guessing — oh, this one looks good, I'll try this one — and put it in there. And nobody checks it after that till much later.

**Simon:** So there's not one standard address that everybody uses for a hospital. It literally could be floors 1 through 12 and offices. You need to know your future address in order — how does that make any sense?

**Stephanie:** It's absurd. Right.

**Simon:** I would assume there's some sort of organization to it — like all the urology guys are in one office and all the NICU guys are in another office. Is that how it's done, or literally anybody could be in any office?

**Stephanie:** If you're looking at a hospital system that has several locations, it could be a urologist that works part-time out of an outpatient clinic, and it could be a urologist that's on call in the hospital, it could be a urologist with special surgical services. So it can be all over the place.

When I did credentialing many eons ago, I was very particular about it — I would hunt down the address. But not everybody does that. I would be like, who did you interview with? And I'd contact that person and be like, what's the address going to be? And they would usually know. But that's not really required by the credentialing office, so there's not going to be that level of digging for it.

**Simon:** This is a tricky one. If there's no rhyme or reason, then it's hard even for a human. If a human can't, it's not going to be a thing that an AI can magically do. Unfortunately this is probably a case-by-case basis. We can still put in some basic learning — we can maybe make some inferences like, oh, you're a urologist and you're applying to this hospital, we had this other guy who was a urologist applying to this hospital, here's what he used for his office address. Maybe something like that. But it's going to be different across hospitals, so even that's a little hard.

**Stephanie:** I guess we'll have to leave the internal office area configurable. It'd be nice if they just added the office address before the application was sent out, but I don't know what places are that motivated to do that. So that's one of the things I've been mulling over — I'm going to ask Matthew about it, see what he says, what do they do for the office address.

---

## Reference data sources

**Stephanie:** And then for inferred data resources — I was thinking about seeing if I could locate some solid resources that maybe we could preload data in a little bit. I don't know how difficult that is. Like it's not something you can just kind of suck off the internet and it slides right in.

**Simon:** That's literally what I did for a lot of the data that's in there now. The AI tools are surprisingly very good at finding this fairly easily and fairly quickly. The only issue is how complete is it — and that's where having an actual data source that can enumerate every single hospital comes into play. Did you have an idea of what actual data you wanted — was it hospital data, provider data?

**Stephanie:** It wasn't necessarily a set of data that I was thinking. It was looking at resources — what are solid resources, then load that data in.

**Simon:** Oh okay, so finding a solid resource and then ingesting whatever they provide. Got it. I'm sure there's got to be resources out there. I can have Claude do 10 minutes of work to figure it out. I'm sure we could come up with some pretty good sources.

**Stephanie:** And I'll see if I can find some too, because I know there's some that I can get through logging into certain software and associations that I have access to.

**Simon:** Associations would be great for that kind of stuff for sure.

---

## Scope check — and the renegotiation opening

**Stephanie:** How do you think the scope of what you're doing aligns with what you thought it did — what you thought the build would be? Is it a lot more, a lot less, or about even?

**Simon:** The scope is probably a little more, I would say. Which is good — because like I've been saying, otherwise you don't have a good reason for building a product if it's not more complicated than you initially imagined. Having said that, it's not egregious or anything, it's pretty much well within my rough guidelines. I could easily see it getting out of hand, because there's so many directions you can take it in — especially depending on the future directions that you want to take it in, and you've hinted at your thoughts on that a little bit. But so far it's been fine, really.

**Stephanie:** If you want to renegotiate additional money for what you're doing, I understand. I'm open to that. I already know that you're doing a lot of work for a lot less. So I appreciate that. I didn't know if the scope of what you're going to build was what you thought it would be, or bigger.

**Simon:** Maybe a little bigger, but the whole point is I get to learn along the way. I think I sent you a message like that — that's kind of half the reason for me to do it, the learning opportunity. So if anything changes with respect to that, I won't hesitate to let you know. Or if you want to expand the scope, that's totally fine too, and then we can have that conversation as well.

I imagine at some point you're going to want to get this polished to a point where you can get it super demo ready and it's going to make jaws drop, that kind of thing. So nothing is off the table.

**Stephanie:** I can't wait for the UX design. I'm totally excited.

---

## What happens after this iteration cycle — and the "wow demo"

**Stephanie:** As far as what we're working on now, what are the next steps? Are we just going to keep reiterating, or does it move on from this stage? I feel like I give all this feedback, you make all these changes, and I go through it again and then I make more adjustments — and I'm okay with that cadence. I mean eventually it'll come to an end, I can't just keep adding indefinite rules.

**Simon:** Right now, once I get this batch out of the way that I'm working on, the model will be a lot stronger. The system is going to be in place to be able to put in new rules relatively easily, and the system will be able to handle new types of rules, and the learning mechanism, all that. And then the idea is, once we're satisfied, you do a few test runs with relatively real-looking data. And then we kind of have this point where we're like, okay, we think it's pretty good.

And then I can go polish up the UX, polish up, make sure it's snappy and responsive — so when you hit a button it responds immediately. And then that's the, I guess I could call it, the polish phase. Right now it's still very much model, brain, getting the smarts in place, which is the hard work. And once you're satisfied with what the system does and how it works, then we take the next steps of getting it to the point where you wouldn't feel bad demoing it and showing how it works to somebody. That's at least my thinking — I don't know if it's different from what your mental model was.

**Stephanie:** No. I mean, I want to get it to a point where I can show it to people too. But I also want to have the wow factor when I show it to people.

**Simon:** Yeah, definitely. It might be a good exercise for you to write this down — what a wow demo would look like. Down to as much detail as possible. Here's what the CV looks like, here's what the system found, here's what it flagged, this was the user experience from the viewpoint of the provider — I think that's maybe your primary persona that you're targeting — and then on the coordinator side, here's how we streamline the experience. Just as much detail as possible. I think it'll be a really good exercise for you in and of itself, but then it'll also really help inform me in terms of, okay, what's the gap between how this system functions and what it looks like today, versus what we want the wow demo to look like.

**Stephanie:** Okay, I'll do that. And as I add on to that — have you heard Elon Musk's Pizza Hut story? When he was designing the Tesla and they were selling it, they figured out it takes 116 clicks for someone to buy a Tesla online. So he thought that was too many. He was ordering a pizza and he figured out it takes 14 clicks to order a pizza from Pizza Hut. So he said, let's aim for that. And they got it down to 22 clicks to order a Tesla online.

So I feel like that's kind of my motto. I want to reduce to the least amount of work that the provider has to do and the medical staff office has to do. That's the north star.

I also was going to look at some UX designs, see if there's anything that I really like out there. I have it in my head, but I need to get that out of my head and onto paper.

---

## Access — MD-Staff demo, NAMS conference

**Stephanie:** So the MD-Staff demo that's coming up on Thursday — are you available for that?

**Simon:** Yep, no problem.

**Stephanie:** So here's the thing, I'm sneaking you in. There's 21 people. Do you have a generic Gmail that you can log in with, something that doesn't tie back to you or me or my company?

**Simon:** Yeah, no problem.

**Stephanie:** And the person that would be letting you in the room — sometimes they do that — if they ask who you are, you just say that you're with VOMC, that you weren't able to get to your email right away or something like that. Because it would be the MD-Staff people. There's 21 people, so I think you can probably just sit in there unnoticed, is the hope. You think that would work from a technical standpoint?

**Simon:** Yeah, I don't see any issue — unless they start asking me medical questions, and then I can't really do much.

**Stephanie:** So keep your camera off. Don't ask questions. If you have a question, WhatsApp it to me and I'll ask it.

**Simon:** Perfect.

**Stephanie:** And then there's a NAMS conference coming up — National Association Medical Staff Services. It's in October, it's in New Orleans. They have a virtual version. I was going to attend because I need the CE credits for my certification. But I was going to do a group thing where you could sit in and watch it too if you want to. You want to look at it and see if there's anything you'd be interested in sitting in on. A lot of the current software people send speakers out. So it's interesting — be in the belly of the beast with the conference.

**Simon:** I'll research what exactly it's about — it sounds like something I might be interested in.

---

## AI landscape / where this is going

**Stephanie:** The next thing I wanted to have is kind of an informal conversation about AI — emerging trends, how you think it is, how it might affect ASAP. I stay updated on it. I know about the whole Fable thing. Are you using Fable?

**Simon:** Quite a bit. I've been using it almost exclusively for ASAP. It's good and bad. It takes a little fine tuning on how to use it, how to work with it. The first couple of times I used it for ASAP it made terrible decisions. So if you don't know what you're doing it can easily go sideways. But once you understand how to use it and course correct — it does take some background in engineering, at least for what I'm using it for. But I think it's the most capable model for sure that I've been working with.

In general the AI trends are going well for the people that use AI, because now there's OpenAI, Anthropic, and a few others, and all the competition means they're undercutting each other on prices. So it's great for us, the guys that use AI. And now there's a lot of extremely powerful open source models — I don't know if you've been hearing about those. I have not played with them yet, it's on my list of things to do. So that's another very promising frontier — not only the competition, but open source models are essentially going to keep prices down, hopefully for a while, at least until the open source models catch up. And honestly they're only like a few months behind, they're not really that far behind. So I think it's going to help with token prices coming down, because they're already cheap — they're subsidized basically right now.

A lot of the emerging stuff in the AI world is more relevant to engineering, so that's obviously what I pay attention to. But ASAP is a perfect example of one of the emerging trends. What you're doing here would be extremely difficult to do just two years ago — maybe even just last year honestly. The models just weren't there, in my opinion. So I think the frontier is really applying the AI stuff to non-engineering work.

This is why — I don't know if you've heard of Harvey or Lora — these are basically AI-driven legal startups. They use it for all this legal work. And aside from ASAP, we're using it for equipment finance, so that domain is also very knowledge-heavy, being able to parse out financial transactions and stuff like that. I think that's the next frontier. The engineering, coding-related work is obviously going to continue to develop, but that's basically where AI landed first, which makes a lot of sense on so many levels. And so now it's like, okay, where is it going to land with respect to knowledge work? To me that's the most exciting frontier — being able to apply these things to credentialing, or finance, that sort of thing.

**Stephanie:** That is exciting, because there's so much room for improvement there.

---

## Her "credentialing intelligence engine" idea

**Stephanie:** What do you think about an LLM for ASAP?

**Simon:** Can you be a little more specific?

**Stephanie:** I'm thinking of a kind of all-encompassing credentialing intelligence engine — like a Library of Congress, but kept updated, for credentialing, that people could access as a community benefit.

**Simon:** Got it. So the concept that you're thinking about is being referred to as a company brain. The basic idea is, a company has this very large knowledge base — they have data in databases, in emails, across chat messages, in their Slack. And the idea behind a company brain is being able to provide a way to access it. So if I want to ask the company brain, what were our biggest goals in 2023, it would be able to access all this information — it'll pull the information from the right places, and once it has the right set of information it can reason about it. It says, okay, I pull all the records from 2023 and then I parse it out to figure out what the sales goals were, what the marketing goals were, and then reason and answer the user's question based on that.

**Stephanie:** A little bit. So it would be like taking all of the different regulatory bodies, their standards, legal cases related to it, best practices, what people have done to implement it. So that if someone was to access the database they would log in and they would say, it looks like anesthesia is no longer using TEE — what are they using now instead, and how is that being operationalized in privileging? And it would have this huge resource of knowledge from all these different areas and discussions and white papers, that it could create a summary, a response, something like that.

**Simon:** So the basic idea is, someone has a question, and this has a knowledge base of data from various sources that it can pull from to put together an answer. Got it. Maybe saying company brain was the wrong framing, but essentially the idea is the same — knowledge from various places, being able to assemble it correctly, and then use that to provide an answer.

I think it's definitely doable. Especially now, there are tools out there that can essentially already do this, that get you 80-90% of the way there with very little effort. You basically say here's all the information and then go at it.

So there's two different kinds of information, and your example highlighted a good one. There's the set of information that doesn't really change very much — here's the law, here's the compliance regulation, here's how Texas handles it. And then there's a set of more dynamic information, where hospital A just came across this case and this is how they handled it. That might be in the news, it might be an article that gets posted somewhere. And so that part — the knowledge itself is relatively solved, it's the finding the knowledge and then being able to ingest it. That part is the tricky part. But this is literally what I'm building with the other startup that I'm a part of, my own startup. So it's very very doable. I think it's a good idea. I don't know enough about credentialing or the ecosystem to be able to tell you anything other than yes, it's very feasible from a technical standpoint.

**Stephanie:** It does feed into the extended model of ASAP that I have — especially with privileging. That's when it would start basically, with privileging, and then it could grow from there. So, compliance monitoring and stuff like that.

---

## Self-driving companies / AI chief of staff

**Stephanie:** Have you been hearing about self-driving companies? Are you doing that, or do you know anyone that is?

**Simon:** This is kind of a big topic now as well. And this is also part of the whole company brain thing. Once you set up a company brain, it's much easier to use an AI agent that just runs on the company brain. It can send emails, it can set up meetings, it can even answer questions, handle customer complaints and that sort of thing.

The idea is to have companies that are AI-native from the ground up — as opposed to companies that are trying to figure out how to augment or fit AI into their current processes and workflows, versus reinventing from the ground up with AI-native processes and workflows. This is kind of the way that we operate. I have a co-founder, and we actually don't even send each other emails. We just basically have our Claudes talk to each other.

**Stephanie:** Really? That's so cool.

**Simon:** That's actually how Tokenrip was built. I would write a document with Claude and then I'd send it to him, and he'd have Claude read it, and then it would be our Claudes editing the documents. And I was like, this is obviously going to be a use case that is going to grow in the way that people are going to operate. So that's really how Tokenrip was born — as an AI-native collaboration platform.

In terms of your thoughts with respect to self-driving companies — did you have any ideas around implementing that for ASAP?

**Stephanie:** I really don't want to deal with employees. And there are business aspects that I don't want to deal with, that I'm not very good at — like the accounting part, I don't know stuff like that. If I could have an AI chief of staff — I tried to set that up with Claude several months ago but it failed terribly, and I actually stopped using Claude after that, I was so upset with it. I had the subscription Claude, it wasn't the free version. So anyways, if I could do that, and that was something that you were able to set up, I would commission that in a heartbeat.

**Simon:** If you're serious about that, and want to put a little bit of thought behind it in terms of, here's what I want, here's what I want it to handle — handle XYZ. There are now several options in terms of how to set it up. And depending on how you want to work — you've probably heard of Open Claw or Hermes. You can essentially set up your chief of staff and you just communicate with him through WhatsApp or Telegram. And then you just connect him to your email, connect him to whatever, and just tell him what to do. Or he'll every morning send you an email and say, here's what you need, here's who you're meeting, here's the meeting prep for each meeting. And he'll do that kind of work for you out of the box.

I can definitely help set that up. I have that set up for myself as well. But it really depends on what you're envisioning using it for. I'm trying to think of what would be relatively easy for you to set up without too much technical knowledge — there's a few options, but obviously the ones that are more powerful require a little bit more technical know-how. I'd be happy to at least point you in the right direction, and then if you hit a wall, I can step in and help you out, no problem.

---

## Boston Children's prep (Friday) — cultural and political nuances

**Stephanie:** Boston Children's meeting on Friday. I wanted to go over some cultural, political things to be aware of.

First off, hospital leadership is very conservative. So if you have a collared shirt, kind of a clean-cut look.

And then — avoid the word "verification" unless you actually mean verification. If you use it, that'll send someone in the wrong direction about overstepping boundaries.

**Simon:** Can you elaborate on that? The word verification.

**Stephanie:** In credentialing and privileging, verification has a very specific meaning — PSV, primary source verification. Something is only considered verified — like Dr. A says he did a fellowship in urology at UCLA — it's considered verified when the medical staff office reaches out to the UCLA department director, or program director of that fellowship, and verifies with them. They get a response back from that program director back to the medical staff office. That is considered a verification. Anything less than that is not a verification.

So if we're having a hard time getting a response from that program director, we might go back to the applicant and say, we're not getting a response, can you reach out and get the program director to respond. And if the applicant comes back and says, oh, here's the response, I got it — we can't accept that. That needs to go from the medical staff office to the issuing credential place, back to the medical staff office.

So when I say we usually don't worry about copies of DEA and medical license, it's because we primary source verify them through the state medical board, the DEA itself. So verification is reserved for that level of scrutiny of a credential, or trustworthy source of a credential.

**Simon:** Got it. So it's a loaded word.

**Stephanie:** Yeah. So stay away from that one.

Also, I don't know that this will come up, but you really don't want to confuse doctors and nurses and executives. Say Matthew decided to bring in his chief medical officer — that would be a physician, so it would be Dr. So-and-so. If you brought in the CEO, that's not a physician — that would be probably the person's first name, Rick, Ashley, whatever it is. I wouldn't use Mr. or Mrs., just because we're at a peer level, so it's not necessary. But the physicians, always doctor someone. And PAs, nurse practitioners — they might have a PhD, they may have a doctorate of nursing, but they're still not called a doctor. Only a medical physician is called a doctor. So that's another important nuance — you'd probably get cut off and corrected.

And with our meeting with Matthew — he has agreed to test the product. He said I'm the only person he's talked to that has any sort of technology that has any bite to it. He's not committed to a pilot, but he has said, when you're ready, come back with a specific ask and we'll go from there.

So I like to approach my meetings with him not assuming that it's in the bag. When I talk to him it's very general terms — when we talk about configuration it would be "what if" type scenarios, not "when we do this" or "when we implement it." It would be, "if we were to implement this." So kind of stick with that kind of language. I don't want to push him into a corner or uncomfortable spot where he stops talking to me.

**Simon:** Gotcha. And Matthew is a doctor, or is not?

**Stephanie:** No, he's not. He's the director of the medical staff office.

---

## Simon walks the GitHub test scenarios

**Simon:** I'll do one quick thing, just so that you're aware of my comments a little bit. This is the moonlighting issue that you opened up, number 20. The way that I work is, I will tell you the status of the issue, and then I'll say, here's the way the system is going to work — it does this, it does this. And then what I wanted to explain is this part here, the tests.

When you see this, what I'm doing is I am creating specific synthetic CVs to exercise the new functionality. In this case there are three specific CVs to test the three different use cases — discrepancy flag, here's how it learns, and so on. And so when you see this test, this is referring to specific files in GitHub. So here's ASAP, and then I go to tests and then scenarios. If you look at scenarios here, this is going to be full of all the different scenarios to test all the different compliance requirements that you're giving me.

And if you look at the readme file — this explains each scenario. Don't worry about this tech stuff up here. Down here it'll just say, here's scenario whatever. This is the GitHub issue that it addresses. And then this is what it demonstrates. And the way to test this, for example the moonlight-learn, you go in here — this is the sample CV, and this is the ID that you would use to trigger this test scenario.

[Attempts to demo the running scenario, can't locate the setup, moves on.]

You can essentially just use that to test out the scenario. It's also used for automated testing — so in addition to you being able to do it manually, it does a bunch of automated testing to make sure that anytime I change code, it doesn't break one of these compliance issues. So I just wanted to explain that. If you wanted to either test yourself or see it in action, that's what that's for.

**Stephanie:** Thank you for that.

---

## The symplr complaints call

**Stephanie:** That reminds me — another kind of invite I wanted to tell you about. I had one today. Every other Wednesday there is a call that we get on at 9:30 to 10 through my work, and it's with symplr, to go over the issues that we've been having with them for years. I didn't know if that might be of interest to you — to hear about the issues with the software that we currently have that symplr does.

**Simon:** Every other Wednesday, half hour? That's not too bad. If I can join, I'll definitely join the next one and see if there's any sort of things that are mentioned that might help inform ASAP and what I'm working on. Are the meetings recorded or no?

**Stephanie:** I'd have to look and see.

**Simon:** Because if they're recorded, what I do now is I'll take a meeting transcript and feed it to Claude, and I have Claude tell me all the things that concern me, that I should pay attention to. And actually, speaking of which — I noticed that you're transcribing this meeting. If you could give me the transcription for this meeting, that'd be great.

**Stephanie:** Of course, yeah.

**Simon:** I'll join the next one, and if I figure that it's definitely worth it to sit in on all of them, I can do that. Otherwise the transcription would be great to just do a brain dump in a couple minutes.

**Stephanie:** A transcription would probably be easier, because I'm not sure how to get you on. It's not something I can have you sneak into — it would have to be some sort of double screen share. And a video is hard to lift off of my company's VPN, they might notice that. But a transcript might be easier.

**Simon:** If that's easiest, that's best for me anyway. If you can get a transcript, that'd be great.

**Stephanie:** I'll look into that. That would be the easier option, I think.
