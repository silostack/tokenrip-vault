---
contact: Stephanie Williamson
company: AICAP
date: 2026-07-01
call_type: firm-direct
participants: [Simon Pettibone, Stephanie Williamson]
prep_file: active/aicap-kickoff-gameplan-2026-07-01.md
---

# Stephanie Williamson — AICAP — Kickoff Call (2026-07-01)

*(Cleaned: small talk, filler, and false starts removed; Stephanie's Replit prototype walkthrough and the build-logistics agreements preserved.)*

---

**Stephanie:** [screen-sharing her Replit build] So I started to build. This was like they dropped their CV in and they could do an ID — this is optional. So the first was what the provider would see, and this is the backend I was building to try to create rules for all this. You can kind of see, this is pretty close to what an application would have.

So this is where I was saying I have resolved / unresolved — there's 20 unresolved and 20 resolved. These get escalated to the next task — you can do this however you want, this was just the way I found to figure it out myself. And that goes to an intelligence layer, resolves a little bit more, and then it goes to attestation. So it's like, if you say yes to anything, add more information. There's a lot of forms that they have here.

I did however-many of the nuances. It got to the point where I'd try to fix something and something else would break, so I was like, all right.

**Simon:** You actually got quite far.

**Stephanie:** So this is where it's confirming that the name on the application matches the name on their medical license. At this point in the process we aren't able to confirm, because we aren't doing any sort of verification, but it's still important to confirm because that's something that would hold someone up. And these are some of the situations of guided questions that would be needed — like, "did your training program proceed without interruption or timeline extension?" You say no, you can add something there. That should show up on a flags list at the end.

This is another one that trips people up. So this one was like the rollover stuff — "employed by the hospital," I'm going to say yes — and then that would make whichever hospital have all those other fields pre-populate, because they were employed. Another thing, "do you have additional insurance." So it's generating a revised CV, because the one I dropped in wasn't in month-and-date order — this was supposed to revise it into month/year format, the original only had years.

And then they have to check these two buttons, attesting that the information is true and came from them, and that they want to submit it as part of their CV. Usually what happens is we send it back to the provider or an office manager to redo it, and it takes forever. So this way it protects the timeline.

**Simon:** So basically the items that have been flagged take time for the office manager to do, versus being able to flag them here immediately and correct it before submission.

**Stephanie:** Well — you're trying to get it before submission. Yes, exactly.

**Simon:** Before submission. Exactly. Got it.

**Stephanie:** And then these are the items that need attention — wouldn't really be all this stuff, we probably have a lot of this information. [looking] Where's my final part? I'm supposed to have another part that showed the audit —

**Simon:** The audit trail / audit logger. Got it.

**Stephanie:** Yeah. I don't know where that went. Anyways, that's enough to see what I was thinking. Clean, minimalist, very concise.

**Simon:** Got it. It's very functional. And then — I don't know if you have this, but maybe it comes in with the example applications you send: is there a defined checklist of "we need these pieces of information," or a requirements document that says a credentialing application has to have these?

**Stephanie:** [it's] in my head. Generally in credentialing applications we do not ask for anything that is not needed — because we already need so much, we don't want any extra in there, and if it's provided we're kind of obligated to verify it.

**Simon:** Makes sense. But there's probably some — I kind of saw it in the application you were going through — some answers to questions where more information is going to be requested, right? If they say yes here or no there, then there's a little bit of logic. So if you can — I don't know how much work this is — in your sample application data, point out a few specific nuanced use cases. The compliance flags would be good examples, but then some others where there's a non-standard answer and we need clarification. Just a few basic examples to get started — this is going to inform the model I build. It doesn't have to be comprehensive; I just need to understand where extra information might be necessary or where we might request it.

**Stephanie:** So you want a few examples of that, versus all of it?

**Simon:** If you could provide all of it that'd be great, but if it's easy — absolutely; if it's going to take significant time, then just a few examples to get started, and if I need more or have clarifying questions we can go from there.

**Stephanie:** In my opinion the most efficient way to do that would be: I'll send you a couple of applications, and once you start building it, we could just walk through each field and I could tell you the different scenarios that would happen. And then you plan for each one — you could record it, take notes.

**Simon:** Perfect, that would be great. And I think it'd be easier for you as well. So, that other than that — for week one, basically the only thing I need to get started is those example applications, plus some sample input data: sample CV, sample government ID. Then I know what information I'm looking for and pulling out of those documents.

**Stephanie:** Okay. I'll send that — I guess I'll just upload it to Upwork.

**Simon:** Yeah, that'll work. Because it's anonymized data, I think if it's fine for you it's fine for me.

**Stephanie:** That's fine, that's not my information.

**Stephanie:** So I'll get that stuff uploaded today or tomorrow as I put it together, and I will fund the milestone. And — where are you going to build it again? How are we going to do that, where we both have access to it?

**Simon:** It'll be in GitHub. Do you have a GitHub account? [If not, you just make one.] Okay — then that's easy. I'll set it up today. I've actually already got a baseline infrastructure in place, so if you send me your GitHub email or username, I'll add you immediately and we can go from there.

**Stephanie:** Okay. Glad you're taking care of all that, because I struggled with how to get [set up]. Is there anything else, or is that it?

**Simon:** I think that's it. Once I get that information from you I can begin immediately. If I need anything else I'll reach out.

**Stephanie:** Sounds good.
