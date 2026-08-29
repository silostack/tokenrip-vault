---
contact: Stephanie Williamson
company: AICAP Access
date: 2026-08-13
call_type: firm-direct
participants: [Simon Pettibone, Stephanie Williamson]
prep_file: n/a
---

# Stephanie Williamson — Validation MVP status call (2026-08-13)

*Cleaned transcript. Small talk, filler, false starts, and repetition removed. Speech patterns preserved.*

---

## MVP status and purpose of the call

**Simon:** Originally I had scoped out seven weeks, so next week is going to be week seven. It's not quite where it needs to be. Mostly everything is there. The last week is mostly for polish, but also the actual output. The two PDFs that get generated are kind of garbage because I let AI use its own judgment to see what those look like. A little bit of feedback with respect to what those are going to look like is going to be helpful to get that last mile in.

I did put in a round of UI polish this morning. We can go over it together on this call. Direct feedback would be helpful.

The idea is to evaluate where we are right now, what's the gap between where we are now versus where we planned to be by the end of this MVP, and get a read on where you think the focus should be with a potential next phase.

The conversation with Matthew was enlightening because I realized there are a few phases to this credentialing thing. The first phase is what we tackled and went deep on with this MVP: the initial provider information. I think of it as a push phase. The provider is pushing information.

The second phase is a pull phase. The coordinator goes in and pulls information either from the provider, the provider's assistant, or foreign institutions. There's this whole back and forth. We've addressed it a little bit to make that process easier, but there's still quite a bit you can do to automate that process. That gets into using AI to automatically generate emails to collect information, even making phone calls to collect information — basically what a coordinator would do, so one coordinator can scale quite a bit.

There are a few angles: optimize for an extremely demo-ready product; optimize for production deployment, where you consider file storage, security, and infrastructure hardening; or automate the pull phase. I want to get your thoughts on the remaining gap and where the highest leverage focus is.

## The product stays provider-first; coordinator outreach automation is later

**Stephanie:** I do like the idea of ASAP being able to send emails and make phone calls, but I want to do that in a second version. It adds a lot of technical features. Then you've got to set up the whole email thing, test that, make phone calls, and all that. I don't want that to delay the MVP.

I think there's still enough ROI for someone to see that they're not having to go back and forth with the provider as much. Whatever little leftover task, like contacting someone for insurance, can be done by a coordinator because it cuts out the coordinator having to identify that information. It cuts out the coordinator having to send an email to the provider about that information, wait for the provider to respond, and then contact the office. It still cuts out probably two weeks by having that information there and available. I'd rather leave that as a pending list for them.

The real focus is the provider experience, but the provider experience through the medical staff office's eyes. The provider will be guided to answer questions that they would normally have to send emails about. It makes it easier for them to answer questions, and the medical staff office will see the value: I don't have to send this big long email of pending items and information that we need. That's where the real value is going to be — cutting out that back and forth with the provider.

External things like validating NPI will be in later versions. For now, that's stuff they already do. They already have mechanisms in place that automate that. I don't want to spend time and resources doing stuff that can already be done by the software until we're ready to make the jump to being the software.

**Simon:** It sounds like the focus is optimizing for sale — being able to provide a demo where the potential customer says, "I really want this," and focusing on the features that get the sale rather than the features that make it enterprise-ready.

**Stephanie:** I want the MVP so I can hand it off to someone and they can drop in their own CV and see what comes out the other side, see what the experience is like. They can try that a few times and see if it's consistent, or provide feedback: this didn't work that well, or it would be helpful if this happened. Then we can consider whether that's something general or customization. I'm not going to do customizations. We can do configurable, but I don't want it bloated out of proportion with entity-specific requests.

## Self-serve demo to paid pilot to integration

**Stephanie:** I take some of the contacts I have now and say, here's the product, do you want to take a look, maybe through a login so we can trace what they're doing. They go in, try it a few times, and hopefully they're like, oh wow, this was really cool, let me show it to my CMO. The CMO drops in their own information, goes through the questions, and gets the information on the other side.

Then have that sign-off cut off after maybe a week or so. I haven't decided how I'll follow up. I could do a phone call, but I would also like to do a survey — maybe a phone call and a survey. Do you have experience in this area or what might be best?

I don't want to lose momentum. I have heard a lot about people doing free stuff. I wouldn't say this is free. It's test the product, see if it works — not really with their information because it's not configured yet for use, but see how it would work.

If they see value, I split a pilot into different sections to make it more manageable for us and less risky for them. There would be an early pilot they would pay for. It wouldn't be integrated. It would let them see how it works in their environment. It would be configured to them and have their application and items in there. They could run tests, maybe having a provider do it the new way and the old way, see what they like best and which is actually faster. This is where we'd collect a lot of data on how the product is performing and whether it's doing what we anticipate. If that is successful, then move into integration, which would be the heavy lifting and more expensive part for them.

**Simon:** A light pilot phase where we can collect feedback, maybe record the way they use the product and what issues they face, then use that to segue into production. And for that you're thinking of enabling them to use their real data?

**Stephanie:** Yeah.

**Simon:** I definitely think that's probably the way to go. What falls out of that is the gap between where we are now and how we get to that.

## Demo-hardening requirements

**Simon:** The system is set up to accept a PDF. To enable any kind of document — Word document, text file, whatever — there are technical things that need to be done so it can handle everything. That's important because you have no idea what kind of document they're going to throw at it. The same goes for IDs. It might be a JPEG or PNG.

Because it's not a driven demo — you're literally saying, hey, here it is, and they can drive — there are infrastructure upgrades we'd probably want to put in. Otherwise there's a chance of it falling on its face.

**Stephanie:** I had to do a virtual notary the other day. Before you meet with the notary, you answer a few questions and upload an ID and proof of address. I was doing it on my laptop. They put a QR code up, so I scanned it with my phone, took pictures of the documents, and once they were successfully uploaded it transferred right back to the computer to finish. That would be really cool, versus someone trying to render a copy of their license, email it to themselves, or take a picture.

**Simon:** I know exactly what you're talking about. The same process is used for know your customer in banking. That's definitely doable. I think it's almost table stakes. It goes along with supporting multiple documents.

If that's the direction — a hands-off self-service demo — we can scope what's necessary and where the gaps are, then have another discussion next week or whenever you're ready.

**Stephanie:** I figure we get it to that point and then mad test it with so many different scenarios — try to break it — before we hand it off.

**Simon:** The testing itself is probably going to be the heaviest part. You want a very solid testing framework for that.

**Stephanie:** I want to test walking away from it. What happens if I walk away? Can I get back to it? What if the computer goes out in the middle? Is anything saved? Test all sorts of scenarios.

**Simon:** And a provider filling this out on their mobile phone. What's the mobile experience like? Or iPad.

**Stephanie:** Yeah.

**Simon:** Gather some more thoughts and shoot me an email. I can get back to you with more fleshed out thinking about the infrastructure behind your high-level requirements.

**Stephanie:** You want me to wrap that up into an email and send it to you?

**Simon:** I'll type this up in email, and we have the transcription as well. You put together some thoughts, and I will send you back more of my thinking in that regard.

## Reference data and current MVP emphasis

**Simon:** The reference data is another thing. Having a rich set of reference data — here's all the hospitals we know about, their addresses, all that information — makes the intelligence layer intelligent.

**Stephanie:** I have that started. I think I can finish it today and send it over.

Current emphasis is definitely getting as much information as we can up front. Do you have a good idea of what the optimal demo looks like from our discussion?

**Simon:** Yes. The conversation with Matthew had me thinking that if he was the target customer, maybe the next focus should make his life easier after the initial submission. But what you outlined makes it clearer: focus on the provider experience. The downstream effect of collecting as much data up front is that the coordinator experience is naturally better. Don't optimize the second phase where the coordinator does the back and forth. That's V2 or V3.

**Stephanie:** The back and forth Matthew described has been every single one I've talked to. It's not really just for him. It is the point of the product — reduce the coordinator having to go back and forth. The provider and coordinator experiences go hand in hand.

## Application output and audit trail

**Simon:** I fleshed out the platform so it's more coordinator-friendly. They can see active applications and review issues — the flags during the application broken down into a task list. There are application and audit-trail PDFs. The updated CV PDF is a natural follow-on from your demo.

The full application that's generated doesn't look great right now. What format would be best for a coordinator? That's going to inform what it looks like, and it's easy to change.

The audit trail is technical jargon and doesn't make sense because I'm not sure what it's supposed to look like. You can give me a small example and I'll work from that.

**Stephanie:** Did you see the audit trail on the demo? That's what I would like it to look like.

**Simon:** I think I did, but probably didn't make a note of it. Never mind about the audit trail. I'm going to look at the demo, and if I have questions I'll follow up.

**Stephanie:** Once the provider submits and the coordinator sees it, I would like the output in three layers. First, a summary of red flags and pending items. Then everything that was captured in the application, line by line. Then the option to look at the entire application in application form — like a traditional name box, this and that, what their application would look like if they printed it.

**Simon:** Label-value, with nice structure and grouping: practice information, license information.

**Stephanie:** Right. When we configure for an actual hospital, say Matthew, Matthew would send over their actual application. I would want it to look like the application they send over if they were to print it out.

**Simon:** Hospital-specific. They have their own format, and we give it back in that format. That would be part of the configuration.

**Stephanie:** For the demo, we just need a generic-looking application with the boxes and fields, so they can visualize their own application in that format.

## Notifications: useful, but not a current requirement

**Stephanie:** If there are items that are too much for the demo, like email, we could put a placeholder that says email available in production. I don't want us to spend too much time going down a rabbit hole for the demo if it's really production-only. They don't need to email themselves a CV when they're playing with it in the sandbox.

**Simon:** Email can be extremely easy. There are agentic email tools where I don't have to go through setup. It would come from a weird domain, not yours. It's up to you. Optimize for whatever gets the wow factor. It's hard to know what impresses some people.

**Stephanie:** I actually think a text message — your application's been submitted — would be impressive.

**Simon:** That's doable as well. We've got your application, then send a link if you need to update it. That's a good segue into phase two.

**Stephanie:** I don't know that we need that for the demo. We'd have to weigh it.

## Real-data security, observability, and retention

**Stephanie:** My concern with using an email from the agent tool is if people are entering their ID documents and Social Security number, what is the security of filtering all that information through an anonymous party?

**Simon:** If you want to give a demo where they're submitting real information, there are considerations. You need to make sure you have a business account with your AI provider so they're not allowed to use data for training and it sandboxes the data. We also need precautions in how we store the data.

If someone uploads an image, the easiest scenario is we scan it and get rid of it. Then we don't have to worry about it. If they want to look at it again or download it, then you need to save it. If you're saving PII data, there are considerations. I'll be able to provide more feedback and guidance once you've put your thoughts together.

**Stephanie:** I know we'll have to do it eventually, but is it needed right now? That's what I'm wrestling with.

**Simon:** I'm all for do not do it unless you absolutely need it. If we can scan it once and throw it away, let's do that. If we don't need it specifically for the demo, let's drop it.

**Stephanie:** The only reason I think it would be worth investing in is our backend. I want to be able to see what's happening and trace it. That's where the ROI comes in for product development. I don't know if we need to store the data to see that.

**Simon:** One of the big reasons to have the demo is feedback and incorporating it into making the system better. With the demo you are obtaining real training data. There is a strong case for storing the data — not necessarily for the demo itself, but for the system.

**Stephanie:** I think I probably would want to do that. Do you know how much an AI account costs? I might already have one.

**Simon:** I don't think it's different. I think it's the same price, but I could be completely wrong. I know ChatGPT has business accounts where they have this agreement in place. I don't know the specifics of setting one up.

**Stephanie:** We could figure that out while we're testing. Then we'd have to test how saving the data works. I wouldn't want to save it beyond what we need it for. If we've squeezed everything we can get out of the data, get rid of it.

**Simon:** That's tricky because you might run your data on the model today and everything works, then throw the data away. ChatGPT tweaks or upgrades the model and now nothing works, and you don't have the training data set to run through the new model.

That happened with ASAP. I was using Anthropic to process text recognition on PDF documents. The testing platform had an accuracy reading. Anthropic updated their model and the accuracy went way down. This is a real problem in production AI systems. We'd like to throw the training data away, but there's a good reason to keep it around.

**Stephanie:** The initial hump is making everything ethical to store data. As far as retention, we could put seven years or something. In seven years everything should evolve so much that we would have new training data.

**Simon:** Data retention policies are something we can think about as well.

## Coordinator interface and current issue status

**Simon:** The coordinator view has the application breakdown, then the task list of issues to follow up. The task list will get cleaned up; right now it's nonsensical. The audit is in place, and I'm going to look over your audit example to flesh this out.

There is an organizations tab. Ideally we'll have a lot of reference data — organizations, linking organizations to health systems. It's a data doctor. Rules and policy are based on your feedback and can be edited. If an application is submitted with a hospital system we're not aware of, this is where we pick that up and link it. System configuration is for debugging; don't worry too much about that.

The update was about having a better, coordinator-friendly interface. Look through it and see what you like, what you don't like, and what you want to tweak, especially anything that affects demoability or future focus.

The actual application was rearchitected more in line with your demo. It has a wizard style. Your last round of issues from two weeks ago should be addressed, but I haven't reviewed them myself. Once I review, I'll close them or put in comments as necessary.

**Stephanie:** I'll check out the interface, and I'll finish and send over the resource list today.

**Simon:** I'll send a follow-up email so we're on the same page, and then we can go from there.
