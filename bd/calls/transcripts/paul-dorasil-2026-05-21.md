---
contact: Paul Dorasil
company: DECA Dental Group (Ideal Dental)
date: 2026-05-21
call_type: firm-direct
participants: Simon Pettibone, Aleksandar Perak, Paul Dorasil
prep_file: active/call-prep-paul-dorasil-deca-dental-2026-05-21.md
---

# Paul Dorasil — DECA Dental — 2026-05-21

## Aleksandar Perak (intro)

Appreciate you taking this call, Paul. For some context — we're building AI agent infrastructure for verticals, DSOs being one of them. We build the layer that gives AI agents persistent memory, a compliant way to use AI agents, making them portable across sessions and that sort of thing. Right now we're building for DSOs and we're fairly early stages. It's pretty blue ocean. We're essentially looking for certain pain points that you're having, seeing what in your business could maybe be automated through an agent. We've been having conversations — pain points can range from client intake all the way to operational, like buying insurance suppliers. This is a particularly interesting conversation because I know you head up AI and data for you guys. So I'd love to understand what that looks like for you guys right now. A lot of DSOs don't necessarily have a dedicated AI guy.

## Paul Dorasil

Sure. Healthcare tends to be behind other industries when it comes to technology, and DSOs tend to be behind healthcare. We are trying to modernize and innovate. We've done a lot.

One of the key struggles specific to DSOs is the variety of practice management systems. We currently operate on both Denticon and Eaglesoft. A third of our locations are on Eaglesoft, the others are on Denticon. We previously had two locations on Dentrix Ascend, and we had seven locations that were on Open Dental. They're not on that anymore but we still have to deal with the historical data.

These systems are very different. Eaglesoft is very old. It was never meant to be used as part of a multi-practice organization. It was literally just a system to allow a single office to book treatments, payments, appointments. So it's been a struggle getting that data into a usable form. We've had to install connectors at each of the servers. We have 153 of these servers and we've had to install connectors at each individual one to connect it to a central API that we can then pull data down from. We're using an SDK connector through Fivetran to do that. That's the basic data issue.

Denticon is not as bad because there's some validation around the codes that are entered. But with Eaglesoft, everything is free-entered. Even your ADA codes are free-entered. So you have practices not entering codes in a uniform way. One practice will give you one code, a different practice will give you a different code. Sometimes they're entering incorrect codes. We had a practice where most of the ADA codes start with a D — they thought that was a zero, so they'd enter zero and the other numbers. Luckily that's an easy enough pattern to catch. But some are really odd — some it'll just say "it's a start." And there's over a thousand of those. So ADA code compliance is a big deal.

Patient data is always a struggle. In other industries you have developed CRMs that validate patient data, dedupe, assign to real identities. That work has not really been done in the DSO space. So we have patient data — it's raw. A lot are test records or duplicates. I found somebody with the same first name, last name, birthday, Social Security in my data five times with five different IDs. Test data is not marked in a standard way — there's no field that says this is a test patient. And when we name a test patient, you'd think there'd be a uniform way — first name test, last name test. There's not. If you name them Michael Test, that could be a real person or a test patient. If you name it "testing a test face," which was a real record I found — I know it's a test as a human being, but I need to write an algorithm. The algorithm doesn't know that "test" isn't a name — there are people whose first name is Test, it's an Italian first name.

Similar thing with providers. We know who our providers are or who they should be. But within the practice management system, a provider can have multiple IDs they use differently. They could use one ID when acting as an orthodontist, another as a dentist. One ID at this practice, a different one at another practice. But it's the same person and everything needs to roll up — that person needs to get one paycheck based on all their production. We have to identify that.

Also helping our users interact with the data once we've cleaned things up. We have a corporate cloud license hooked up to our Snowflake instance. As we build out more validated assets, they have more availability there. We have an FP&A team that needs to do budgeting and forecasting — that's an application. A marketing team that needs lifetime value analysis, segmentation, all the classic marketing use cases. It's just like any other business — just dentistry. That's what we're trying to do better.

## Simon Pettibone

Just to make sure I understand — you came on to essentially clean up the data layer so that it can actually be operationally useful for everything to be built on top.

## Paul Dorasil

Yeah.

## Simon Pettibone

And then in terms of the direction — the assumption I have is, we can start operations or using AI once we have a data layer that's sufficiently clean. Is that right?

## Paul Dorasil

Sort of. When certain areas are clean enough, then we can put AI on top. For example, if we build out the production data, it's now accessible via AI. Our unstructured data was always very clean — it's just X-rays. We have a vendor, Pearl, who uses our X-rays and predicts which teeth are going to develop cavities based on a large sample. Patients can go into practices, get scanned, and it'll flag — "the AI says you need to cap this tooth." The dentist evaluates and concurs. They'll almost always agree because the Pearl model is very conservative. We've had significant ROI from that product — it's about a hundred dollars each time somebody caps a tooth, and the adoption rate with Pearl is much higher than without. We can show pretty good ROI.

We're also going to be adopting an AI call center, which is DSO-specific, probably in the next month or two. That's something we can do because it's connected directly to the practice management system itself. There are certain applications where we can still do things before all the data is pristine. It's never going to be perfect either — we want to use what we can when it's available.

## Simon Pettibone

Makes sense — we're math guys, we work in probabilities. It's never going to be 100%.

In terms of the workflows you're looking to leverage AI for, once the data threshold is met or what you're looking at now — it seems you're happy to partner with AI providers, it's a build-versus-buy thing. What are you looking to operationalize with AI? Just out of curiosity.

## Paul Dorasil

We need to do accounts payable, more automation around RCM, and we're in the process of building out FP&A. Those are three big areas within the corporate structure. Most of what we're looking to do for the offices themselves is build out a comprehensive BI platform — that's going to take cleaning up the data. That's the longer-term project.

So what have you guys found so far? Who else have you worked with? What kind of projects have you gotten into within the DSO space?

## Aleksandar Perak

As far as DSO space goes, we're fairly early stages — running discovery. We have all our agent infrastructure built out. Running discovery, looking for design partners essentially to build custom solutions around certain pain points. We've been having some conversations but nothing in the DSO space in operation as of today.

## Simon Pettibone

Basically looking for pain points, where DSOs are spending their time, what they're thinking about, what workflows they're looking to AI-enable.

## Paul Dorasil

There's definitely a lot of untapped potential — much more than a lot of other industries. A lot of industries have already made headway here and DSOs are a bit behind. We're trying to fix that for our specific organization.

## Simon Pettibone

And with DSOs it makes a lot of sense because you have data fragmentation. We're not looking to build a chatbot, that sort of thing.

## Paul Dorasil

A lot of the solutions you build for DSOs are going to translate into other industries too. DSOs are really similar to optometry and veterinarian offices — you have a mix of insurance and non-insurance, they're considered elective medical, different from a hospital. A lot of the vendors I've been looking at operate within dental but also operate in those other spaces. For example, the API I use to pull data from Eaglesoft is an API called Kala. Looking at their documentation, they're using the same API for veterinarians. A lot of the AI call centers I'd interview would be used for vets, optometry. They basically take their product and retool it for a different industry. It scales pretty well.

So what kind of agents have you built out, or what are you looking to monetize?

## Aleksandar Perak

Mostly on the operational side, fairly specific ones. AI call centers / AI receptionist — there's a lot of players in that game. So something more niche related to operations, maybe some of the data stuff you're describing.

## Paul Dorasil

We might look into accounts payable, because if you could figure out a way to streamline it, there's a lot of need. It's a very manual process, a very long process. You still have teams of accountants doing monthly close in a manual fashion. It seems like everything they're doing could be automated, but there are problems along the way. It relied on being able to take a variety of documents and identify key numbers on each and put them in the right boxes. Now we have AI that can do that pretty well. Even a year ago we really didn't.

We've been looking into automating accounts payable. We haven't found good vendors in that space. It's been a struggle and I think a lot of that work we're going to end up building in house. That's an opportunity.

## Aleksandar Perak

Other than that, are there maybe more DSO-specific opportunities or pain points you're seeing that you haven't necessarily found a solution for?

## Paul Dorasil

Not that I can think of that I haven't mentioned. A lot of problems get solved by moving to a more modern practice management system, especially in terms of data cleanliness. Denticon vs Eaglesoft is night and day.

Everybody's moving to a cloud-based PMS — either Denticon or Dentrix — but there's a lot of resistance. Even within our own company, we want to move to Denticon, but we have like 50 offices saying "hey, we've been on Eaglesoft forever, we know how to use it, it's a disruption, you'll see a revenue dip if we have to move." It causes holdouts.

I'm not sure how you'd use AI to do that, but anything that would make it easier to transition from one practice management system to another — in terms of training — would be helpful and potentially avoid pitfalls that lead to mistakes, lost revenue, bad patient experience. It's not just us doing this — a lot of DSOs are migrating from an old PMS to a new PMS. That's an opportunity if you can break into that area.

Maybe like training agents, educational agents. If you had an agent that understood the old practice management system and the new practice management system, and you could ask questions to it, that would definitely be useful. If there was a product that specific that I could take to my CIO and my CEO — who are very anxious about this transition — and I could say "here's something where our users can plug in and ask all kinds of questions, hey, I used to do this this way, how do I do it in the new system" and get a reliable response — that would be very valuable. That would make it much easier to transition from one PMS to another, with cost savings, less headaches, less errors.

## Simon Pettibone

And theoretically it could just sit on top of the work that you're doing.

## Paul Dorasil

Well — would the agent need to have access to the practice management system? I think the answer is no, actually. It would just need to be knowledgeable of how you'd do things in the old system and how you should do things in the new system. We have a whole training team around this to help with these migrations and even then we struggle. So if the actual people at the offices had a tool that could give them reliable answers, that would be huge. I don't know how much it would sit on top of the work I'm doing — maybe I'll have to think about that.

## Simon Pettibone

That's a useful suggestion, appreciate it.

[Wrap — Paul has a hard stop at 10:30, mutual thanks, open door for follow-up questions, no concrete next step set.]
