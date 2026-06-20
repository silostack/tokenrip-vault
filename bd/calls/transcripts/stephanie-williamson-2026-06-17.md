---
contact: Stephanie Williamson
company: AICAP Access
date: 2026-06-17
call_type: firm-direct
participants: [Stephanie Williamson, Simon Pettibone]
prep_file: active/aicap-discovery/aicap-stephanie-debrief-call-prep-2026-06-17.md
---

# Stephanie Williamson — AICAP Access — Discovery Debrief Transcript (cleaned)

**Stephanie:** So what was your overall impression of the discovery?

**Simon:** It peeled back the covers on the credentialing world, and the whole healthcare world. As an engineer I've heard the stories about outdated software, like the banking system. From my sliver of research I get it now. It's not an uphill battle exactly, but it's tricky. And once you're established, there's a big payoff.

**Stephanie:** Does seeing the current platforms give you a window into the workflows? Is it more complex than you expected?

**Simon:** The complexity isn't in the work itself, it's in the non-technical parts, the human judgment, verifying information, making sure it's complete and structured, the variability. As an engineer everything's a zero or a one. In healthcare it's zero to a million and everything in between. The ambiguity is the tricky part, and that's exactly why we can do this now with AI. That's your edge. So I understand the opportunity a lot more now.

**Stephanie:** If it were easy it'd already be done.

**Simon:** Exactly. And on the incumbents, that's the opportunity too. Once you're entrenched, you're not incentivized to make a better version.

**Stephanie:** They seem to spend a lot of money on marketing and not on innovation. That's what I've noticed.

**Stephanie:** So what do you think of the MVP? You'd sent a proposal before, and I was revising it when I decided we needed a discovery. Does your prior proposal still stand, or do you want to review it, or should I send you one?

**Simon:** I don't think it changes much. Discovery clarified the edges of the platform and what the integration with an existing credentialing system might look like, what we can do now versus what we wait for a pilot to figure out. But your value isn't the integration. You're providing a complete application out of the gate. How it gets into their system depends on the particular hospital. So it doesn't meaningfully change the proposal, it just changes what the pilot looks like.

**Stephanie:** I was hoping there'd be a no-integration option, but I don't think there is at this point.

**Simon:** I've thought about this a lot. Say you reach a hospital with no integration whatsoever, a hard stop. The way it would work is not a browser extension, which I hinted at in discovery, because that's fragile and breaks when they update the site. What could work is a provider co-pilot. The provider fills out the complete application on your platform, all the homework done, and then goes to the actual platform, say symplr, and it's basically a copy-paste job. They're not wondering if they're answering correctly, they're copying answers from the application you've packaged for them, plus "upload this document." That's the worst-case scenario I envision. They're entering information twice, which they are, but the hard part of the initial application isn't the entering, it's the uncertainty: am I answering this right, am I leaving something out. After you've made the application complete, the second pass is essentially zero stress. They copy into the portal, do the attestation, done. You're still providing a complete application and compressing the time window. That 20 minutes of copy-pasting isn't a big deal.

**Stephanie:** I thought about that too. I don't know that it's a good option, because a lot of the ambiguity is around not understanding. The guided questions I ask provide context around what's being asked. That won't necessarily translate when they look at the hospital's application, because it won't be worded the same way. [audio interruption]

**Stephanie:** Some of my ideas on a no-integration option, or — when you say no integration, you mean no integration into the application *instance*, right?

**Simon:** Correct. A data-layer thing we can handle.

**Stephanie:** But what about getting it into the fields of the software?

**Simon:** We can take our application and map it into the instance, no problem. The only question is whether the credentialing platform offers that interface. That's the million-dollar question, and it can only be answered by having access to the specific platform the hospital has. It depends on which licenses they bought. Symplr has this interface but the hospital pays extra for it. Do they have that license? What version are they on? It's very dependent on the exact setup per hospital.

**Stephanie:** My worst-case scenario was that we have them do most of the application, the demographics and forms, and that maps into just the data field, not the application instance, and the forms could be PDF'd and ported, and that could be an attestation form too.

**Simon:** When you say mapping to fields, you mean literally on a web page?

**Stephanie:** I think what we'd have to do is disqualify those people for now as a pilot match. Either they buy the license, or if it's a no-go, I don't think we should pursue it in a roundabout way. Not too long ago a physician was complaining — we were transitioning to a hosted version of MD-Staff and his application was lost, he'd spent 40 minutes on it. The complaint is they don't want to do that several times. But I don't think that's a good pilot option. If someone won't allow us to integrate, they'd have to fork up the money for whatever license is needed on their end.

**Simon:** Gotcha, so it could be an initial-customer issue. I wanted to circle back, because I didn't hear your objection to the co-pilot clearly.

**Stephanie:** My objection was that a lot of the guided questions I ask provide context around what's being asked on the application, and that might not relate back to what they're seeing.

**Simon:** Let me clarify my mental model. The co-pilot would be specific to an actual hospital's credentialing platform. Whatever screens the provider sees, the co-pilot is built to that hospital's requirements and specs, a one-to-one mapping. "You're on screen one, here are your answers, copy-paste. Screen two, here are the answers, here's the document to upload." So instead of building the integration piece, that work goes into the co-pilot, which maps between the completed application and the questions asked on each page of the hospital's flow.

**Stephanie:** My other objection is it's not what I'm building. What you're describing looks very different. My design is that the applicant doesn't see all those fields, they only see what they need to answer. A matching-field base would be a completely different design.

**Simon:** I think I understand. My thinking was your application stays the same. The provider answers all the questions in your platform, fully ready. Then they still go through the hospital's portal, because the hospital has no integration option and may not even accept attestations from a third party, so they have to go through their portal. 90 to 99% of your platform is the completed application. The co-pilot is just the way of getting it into the hospital's platform, the piece we're unsure about. But if there's a pilot where integration is an option, the value is more apparent because they fill it out once.

**Stephanie:** I don't really want to go that route. I don't see it being widely accepted. If a hospital really saw the value of a completed application, they'd do what they need on their end, buy whatever license. They tend to absorb as much of the burden as they can on behalf of the physician, so I don't think they'd put the burden on the applicant. It might be a longer sales cycle for us, but that's part of the deal.

**Simon:** Gotcha. So it's enough of a pain point that if you demonstrate the value, they'll absorb the other costs.

**Stephanie:** [Questions list] First: do you need to revise the proposal you sent before discovery?

**Simon:** I can review it again, but I'm 99% sure it's fine as it is.

**Stephanie:** New thing from my day job, I want your opinion because it sounds absurd, and is this what I can expect when my platform is built out. We're adding a sixth hospital to our software that manages five, converting from MD-Staff to symplr. Symplr says building out the data map and migration for the sixth hospital is a nine-month timeline. That sounds absurd.

**Simon:** It is absurd. There could be reasons, maybe they're backlogged, maybe compliance provisioning, but from a technical perspective it's nowhere near nine months, not the same ballpark, especially with AI tooling now. This is an incumbent with no incentive to move fast, so, "yeah, nine months."

**Stephanie:** That's what I want to get away from. I don't want to tell people nine months. They said they could start in August but nine months to complete, and we already own the data.

**Stephanie:** What are your thoughts on the overall platform scope, MVP build, pilot, configuration, expansion? Is this too big or resource-heavy for Tokenrip?

**Simon:** Not at all. We have a lot of the infrastructure already, document processing and data extraction. From the build side there's no issue. The pieces with question marks are on compliance, what level of security you need, but that comes into play once you have a pilot with real PII data. To get to a workable prototype we can show a hospital, there's nothing stopping us.

**Stephanie:** I want to schedule calls with my strong leads. My configuration assumptions: the hospital wants their own forms, logo, application, attestation questions, state-specific forms. History windows vary, some want ten years, some seven, hospital affiliation, malpractice. Distance from the hospital has requirements, sometimes specialty-specific. That has to be plugged in to meet the minimum required. Am I missing anything technically?

**Simon:** Everything you named is fair game. The sequencing in my mind: get to where you can have a sales call, demonstrate the platform, secure a pilot. Then part of the pilot is a discovery step, like we did, mapping the hospital's exact requirements, the history windows, the data they need, addresses, distance. Then you build the configuration on top, an additional data layer on your core. The white-label piece, logo and customizations, is part of that discovery too.

**Stephanie:** I have a narrow scope I'll stick to. I don't want disordered customization, just what's configurable. I'll work with them after to find out what's repeatable.

**Simon:** The narrowest possible scope is what you want to start with.

**Stephanie:** During discovery, what would you need to know to integrate ASAP into a system? Would you meet with their IT department, how far would you go?

**Simon:** Ideally I just get access — "here's access, knock yourself out" — and I do discovery on my own with my tools. Short of that, it involves touching base with their IT team. Could be as simple as talking to a staff member who tells me the version, the licensing, the APIs. Reality is somewhere between. It might involve them shelling out for an additional symplr license that has the API access, which discovery would uncover.

**Stephanie:** What about a spec sheet we give them to fill out with the info you need and the qualifications they need to stand up?

**Simon:** That's a very good starting point, exactly what we did on the prior platform we built. Send the questions, get a starting point. Here it'd be more in-depth, but yes.

**Stephanie:** It's not like they'll just give you access and say have at it.

**Simon:** Right, I figure it's harder than that.

**Stephanie:** How much do you think is reusable, pick up and take to the next hospital?

**Simon:** The core infrastructure, almost all of it. The plumbing is in place so one extra field or document is a simple lift. I'd say 99% transferable across hospitals, especially starting with the MVP. Caveat, that's me as an engineer, not a credentialing person.

**Stephanie:** Basically the same information is collected everywhere, it's guided by compliance. We don't collect what isn't required. You'd talked about a side door using CAQH, would it be an option for ASAP to use that side door outside of CAQH?

**Simon:** If it's available. My understanding is those side doors are built specifically for CAQH, not a door anyone can plug into. But if the door exists, we can leverage it.

**Stephanie:** How easy or difficult is it for a hospital to grant access for integration? Some login, an administrator?

**Simon:** Could be that simple. The tricky part is the compliance, the rules and regulations, the security policies that differ hospital to hospital. Granting access could be "here are logins with read-only permissions," or a policy of "no non-hospital access whatsoever." Probably I make a request to IT staff who provisions it, because they have to ensure I'm not getting access I shouldn't. Technically it's logins or keys, but it's more a policy thing.

**Stephanie:** If they say they'll do the integration, is there something we hand them to plug in?

**Simon:** We can do as much heavy lifting on our side as possible, but it varies hospital to hospital, hard to say up front.

**Stephanie:** Once access is granted, who owns the integration, us, the hospital, joint?

**Simon:** Combination, but ideally we own as much as possible so we're not depending on others, fewer things go wrong. We come in and say we'll do the integration.

**Stephanie:** That's how I've seen it when they switch software, the vendor does the integration and works lightly with IT to validate.

**Simon:** Yes, that's the general model, vendor does the integration, staff validates.

**Stephanie:** What does data mapping look like from your perspective?

**Simon:** Taking data in one form and figuring out what it looks like in another system. One database has first name, middle, last as separate fields; another has a single "name" field with all three. Same data, different shape. That's data mapping.

**Stephanie:** Is that where FHIR comes in? FHIR, the new healthcare data language, I might be off base.

**Simon:** I've actually never heard of that term, I'll look it up after this.

**Stephanie:** What's an estimate of a configuration timeline? We have the MVP, the hospital says yes, how long until we're ready to go?

**Simon:** Almost impossible to answer. From an engineering perspective the timeline is extremely short, engineering isn't the issue. The issue is the hospital's system and policies, like symplr telling you nine months. From our side, hard to imagine more than a few weeks to a month at most, depending on weird data we haven't seen. It's really a question of what it takes on their side.

**Stephanie:** And the integration is the same, you don't know until you're in there. Seems like it'd take a few hours.

**Simon:** If we're replacing the system, yes, a few hours and a cutover. If we're integrating, that's trickier.

**Stephanie:** Some hospitals insist on a test environment. What does that look like, it feels between MVP and configuration?

**Simon:** We call it a sandbox. It looks exactly like production with real data, but if something goes wrong it's okay, it's not real and doesn't affect anything. Standard in compliance-heavy environments.

**Stephanie:** The credentialing software companies all have test environments we'd have access to, so we wouldn't need to create one, we operate in theirs first.

**Simon:** Ideally yes. I don't know the requirements to do that. And there's a big difference between a vendor's base sandbox and a hospital's deployment with all its custom configuration on top.

**Stephanie:** Once the MVP exists, what work remains, hours, days, weeks?

**Simon:** They could start testing immediately. The question is what you mean by test, with a real provider and real data, or a proof-of-concept test, or a test against their configuration. If you can demo it, they can play with it.

**Stephanie:** I meant from MVP to using it, which is the configuration and integration.

**Simon:** Standalone or with their system, it depends on their setup.

**Stephanie:** The pilot, once I get one, would probably be one department piloting before it rolls out to another department, then the hospital sees value and rolls it to other hospitals in the system.

**Simon:** A staged rollout is the way to go, in any software deployment.

**Stephanie:** Those are all my questions. Do you have questions for me?

**Simon:** I think we covered a lot of ground. What next steps are you thinking?

**Stephanie:** Review the proposal you sent and let me know it's okay. I have more recommendations and changes I'll get back to you on. I'm going to set up calls with the people I'm working with, and I thought about having you sit in on some, if that interests you.

**Simon:** I'd love that peek behind closed doors.

**Stephanie:** I haven't decided yet, I'm still in relationship-building mode. The Boston one [Boston Children's], he's the most engaged but a hard shell, taken me a long time to crack. The Duke person is the data-integrity program manager for the credentialing department, not the decision maker, so I'm working to get her to champion me up the chain. MD Anderson expressed a lot of interest, then went cold, I'm warming it back up. And some other early ones who've expressed interest. My current job, my boss wants to pilot a different service, it's free for six months and it's been stuck in procurement four months because the person didn't respond and is now on leave. That's what it looks like from the inside, radio silence forever. So I don't want to start any configuration or integration work until I have a clear check from a pilot. I'll get validation from them, then start the MVP, then wait for the money. I might bring you in on a call or two, and we'll see what the minimum viable configuration for their workflow would be, then get started on the MVP.
