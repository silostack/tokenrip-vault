---
title: CICS Immigration Demo Mock — Design Spec
date: 2026-05-26
owner: Simon
audience: Claude Code (implementer)
deployment: demo.tokenrip.com/cics-immigration
status: ready to implement
---

# CICS Immigration Demo Mock — Design Spec

This document is the complete, standalone design spec for a sales demo mock to be deployed at `demo.tokenrip.com/cics-immigration`. It is given to Claude Code for implementation. All necessary context, copy, data, and visual decisions are inline — no external references required.

---

## 1. Context — Who, Why, What

### Who this is for

**Alex Khadempour**, founder of **CICS Immigration** (cicsimmigration.com), a Vancouver-based Canadian immigration consulting firm. Alex is a Regulated Canadian Immigration Consultant (RCIC) with 20+ years in the industry. His firm handles consultation, full representation, and application review for clients applying for visas, study permits, work permits, permanent residence, and citizenship.

Alex is the buyer. He is non-technical but smart. He has tried AI before (an AI receptionist for inbound calls) and abandoned it because clients felt the difference and his firm started losing clients. **He has zero tolerance for AI in front of his clients.** Behind-the-scenes only. Anything that could harm his client's immigration outcome by introducing AI error is a hard no.

### The opportunity we're selling

A **Bill C-3 Lineage Pre-Audit** product. Bill C-3 is Canadian legislation (the Citizenship Act as amended) that expands citizenship-by-descent eligibility — anyone with a Canadian-born parent or grandparent may now qualify. This created a generational anomaly: large numbers of Americans, especially, are now contacting Canadian immigration firms asking if they qualify. Half of Alex's current consultations are Americans on Bill C-3. The window for this volume is estimated 18–24 months before it normalizes.

His stated #1 firm-level pain is **lead qualification** — too many unqualified prospects taking up consultation time. The Bill C-3 Lineage Pre-Audit solves this directly: an AI-driven pre-audit triages American leads on his website *before* they book a consultation, surfaces likely-qualified prospects to his team, and discards or appropriately redirects unqualified ones.

The architecture extends naturally beyond Bill C-3. Phase 2 is application review for all immigration types (passport-name vs. questionnaire-name cross-checks, document quality flags, missing-information detection). Phase 3 is an RCIC industry hub Alex has talked about building.

### What this demo accomplishes

This mock is **the primary sales artifact** for closing a $5,000 USD design-partner pilot with Alex. It will be:

1. **Recorded as a 3-minute Loom walkthrough** with voiceover by Simon
2. **Sent to Alex via email** with a proposal attachment
3. **Used as a discussion artifact** on the follow-up call to confirm scope before any production code is written

Alex's reaction to the mock determines whether the deal closes. **The mock is not throwaway** — if Alex approves it, the same code becomes the starting point for the real build. Don't take shortcuts that would force a rewrite later.

### What this demo is not

- Not a working product — all data hardcoded
- Not connected to any real LLM
- Not connected to any real OCR or document processing
- Not connected to Calendly or any booking system (mock booking screen only)
- No authentication, no database, no email-sending
- No tracking, no analytics
- No payment flow

The goal is **visual and interaction fidelity** sufficient to make Alex believe this is what his product would look like. Static + click-through is fine.

---

## 2. Goals For the Mock

The mock must accomplish four things:

1. **Visualize the customer experience** — what an American visitor to cicsimmigration.com sees when they click "Check Bill C-3 eligibility"
2. **Visualize the operator experience** — what Alex and his team see when leads come in
3. **Demonstrate the safety guardrails** — the system never says "you are eligible"; every output requires RCIC review; human approval on every outbound communication
4. **Plant the Phase 2 / Phase 3 narrative** — the demo ends by showing how this extends to application review and to the RCIC hub

The viewer (Alex) must leave the 3-minute video thinking: *"That's the product I want to buy."*

---

## 3. Deployment

- **Subdomain**: `demo.tokenrip.com`
- **Path**: `/cics-immigration`
- All routes nest under this path. For example, `demo.tokenrip.com/cics-immigration/intake`, `demo.tokenrip.com/cics-immigration/dashboard`, etc.
- The customer-facing flow and operator dashboard are both reachable via direct URL — useful for recording the Loom (jump between them without navigating).


---

## 4. Information Architecture — Routes

| Route                        | Purpose                                              | Audience             |
| ---------------------------- | ---------------------------------------------------- | -------------------- |
| `/`                          | Customer-facing landing card                         | Customer             |
| `/intake`                    | Multi-step intake stepper (5 steps)                  | Customer             |
| `/processing`                | Processing animation (8 seconds)                     | Customer             |
| `/result/john-smith`         | Lineage Audit Brief output                           | Customer             |
| `/book`                      | Mock Calendly-style booking screen (2-second beat)   | Customer             |
| `/dashboard`                 | Operator queue (lead list)                           | Operator             |
| `/dashboard/lead/john-smith` | Lead detail view — John Smith (straightforward case) | Operator             |
| `/dashboard/lead/sarah-chen` | Lead detail view — Sarah Chen (adoption edge case)   | Operator             |
| `/roadmap`                   | Phase 1 / 2 / 3 progression card (for end of video)  | Operator / strategic |

A tiny floating switch in development mode (visible only on localhost / not in production) to flip between Customer and Operator views is helpful for testing but not required for the final deploy.

---

## 5. Visual Design

### Branding philosophy

The product is **CICS-branded on the customer-facing surface** (cicsimmigration.com would embed this) and **CICS-internal-tool-branded on the operator surface**. Both should feel native to CICS Immigration.

### CICS visual identity (use these placeholders if cicsimmigration.com is unreachable)

- **Logo / wordmark**: text logo reading "**CICS Immigration**" in a clean sans-serif. Optionally a small maple-leaf icon to the left.
- **Primary color**: deep blue `#1e3a8a` (close to Canadian immigration / professional services convention)
- **Accent color**: warm amber `#d97706` for verdict highlights, CTAs, and the "potential pathway" badge
- **Background**: white with subtle gray `#f9fafb` section breaks
- **Typography**: Inter or Geist for everything. Headings semibold, body normal weight. Generous line-height.

### Tone — customer-facing vs. operator

- **Customer-facing**: warm, guided, generous whitespace, large CTAs, friendly progress indicators. Reassuring tone. Mobile-friendly.
- **Operator dashboard**: denser, more tabular, "internal tool" feel. Less whitespace, more data per screen. Desktop-first. Think Linear or Vercel dashboard aesthetic.

### Both surfaces share

- Same logo placement (top-left)
- Same color palette
- Same fonts
- A small footer on every page: *"This pre-audit does not constitute legal advice. Final eligibility determinations are made by a licensed RCIC."*

---

## 6. Screens — Detailed Specs

### SCREEN 1 — Landing card (`/`)

**Audience**: A visitor who arrived from cicsimmigration.com (or via Google ad). Most likely on mobile.

**Layout**: Single-column centered hero. Imagine this could be embedded as a widget on the CICS website OR be a standalone landing page.

**Content (verbatim copy)**:

- Top-left: CICS Immigration logo
- Hero headline (large, bold): **"Are you eligible for Canadian citizenship by descent?"**
- Sub-headline (medium, lighter weight): "Bill C-3 expanded who qualifies. Find out in 5 minutes — free pre-audit."
- Three-bullet trust strip:
  - ✓ Reviewed by licensed RCICs at CICS Immigration
  - ✓ 5 minutes, no commitment
  - ✓ Confidential — your information stays with CICS
- Primary CTA button (large, amber): **"Start your Lineage Pre-Audit"** → navigates to `/intake`
- Footer microcopy (small gray text): *"This pre-audit does not constitute legal advice. Final eligibility determinations are made by a licensed RCIC."*

---

### SCREEN 2 — Intake stepper (`/intake`)

**Layout**: Single-column. Progress indicator at top (5 steps, current step highlighted). One question or question group per step. "Continue" button at bottom of each step. "Back" button at top.

**Stepper steps**:

#### Step 1 — Applicant info
- "Tell us about yourself"
- Form fields:
  - Full legal name (text): pre-fill with **"John Michael Smith"**
  - Date of birth (date picker): pre-fill with **"March 15, 1985"**
  - Country of birth (dropdown): pre-fill with **"United States"**
  - City of birth: pre-fill with **"Portland, Oregon"**
  - Email (text): pre-fill with **"john.smith@example.com"**
  - Phone (optional, text): pre-fill with **"+1 (503) 555-0142"**

#### Step 2 — Canadian ancestor chain
- "Tell us about your Canadian ancestor"
- "Was a parent or grandparent born in Canada?" → radio: **Grandparent** (pre-selected)
- "Your grandparent's full name": pre-fill with **"William Smith"**
- "Their date of birth": pre-fill with **"July 12, 1923"**
- "Place of birth (city, province)": pre-fill with **"Halifax, Nova Scotia"**
- "Are they still living?" → radio: **No, deceased** (pre-selected)
- "Date of passing": pre-fill with **"1998"**
- "Your parent (their child)'s full name": pre-fill with **"David Smith"**
- "Your parent's date of birth": pre-fill with **"May 4, 1948"**
- "Your parent's place of birth": pre-fill with **"Boston, MA, USA"**

#### Step 3 — Document upload
- "Upload supporting documents (optional but speeds up your audit)"
- Three upload cards, drag-and-drop or click-to-upload styling:
  1. **Your birth certificate** — shows uploaded state, filename: *"john-smith-birth-cert.pdf"* with green checkmark
  2. **Your grandparent's birth certificate** — shows uploaded state, filename: *"william-smith-1923-canada-birth-cert.pdf"* with green checkmark
  3. **Your parent's birth certificate** — shows empty state with **"Skip for now"** link visible
- Microcopy: *"You can add missing documents later. We'll let you know if anything is required."*
- Continue button

#### Step 4 — Urgency & goals
- "Your situation and timeline"
- "What's your goal?" → radio (pre-select: "Confirm eligibility and start an application"):
  - Confirm eligibility and start an application ●
  - Just curious — exploring options
  - I plan to move to Canada
  - I want a second citizenship for travel / passport reasons
- "What's your timeline?" → radio (pre-select: "Within 12 months"):
  - As soon as possible
  - Within 6 months
  - Within 12 months ●
  - Exploratory — no specific timeline

#### Step 5 — Submit
- "Ready to review your case"
- Summary card with all entered info
- Big amber submit button: **"Generate my Lineage Audit Brief"** → navigates to `/processing`
- Microcopy: *"Generally takes under a minute."*

---

### SCREEN 3 — Processing animation (`/processing`)

**Layout**: Centered, single column. Animated progress bar or spinner.

**Duration**: 8 seconds. Auto-navigates to `/result/john-smith` when complete.

**Animation content**: Status messages roll through, one at a time, fading in and out:

1. "Verifying applicant identity..."
2. "Reading uploaded documents..."
3. ✓ "Document type detected: U.S. Passport (John Michael Smith)"
4. ✓ "Document type detected: Canadian Birth Certificate (William Smith, 1923)"
5. "Extracting lineage chain..."
6. "Cross-referencing names across documents..."
7. "Checking against current Bill C-3 regulations (Section 3(1)(b))..."
8. "Identifying potential pathways..."
9. "Compiling Lineage Audit Brief..."

Each message visible ~0.8 seconds with a smooth fade. Final progress bar completes and auto-redirects.

---

### SCREEN 4 — Lineage Audit Brief (`/result/john-smith`)

**Audience**: Customer who has just completed intake.

**Layout**: Document-style page with clear sections. Printable feel.

**Sections (top to bottom)**:

#### Header
- CICS logo top-left
- "Lineage Audit Brief" (title, large)
- Subtitle: "Generated for John Michael Smith · 2026-05-26 · CICS Immigration"

#### Verdict box (prominent, amber background)
- Icon: ⚠ (warning triangle)
- Heading: **"POTENTIAL PATHWAY IDENTIFIED — RCIC review recommended"**
- Subtext: *"Your case shows a potential pathway under Bill C-3. A licensed RCIC review is required to confirm eligibility and identify any complications."*

**IMPORTANT**: The verdict never says "you are eligible," "you qualify," or any definitive statement. Always conditional: "potential pathway," "may qualify," "appears to," etc. This is a hard requirement — Alex's #1 fear is that AI tells a client they qualify when they don't.

#### Reasoning section
- Heading: "Why we identified this pathway"
- Paragraph: *"Based on your grandfather William Smith's birth in Halifax, Nova Scotia (1923), you may qualify under Section 3(1)(b) of the Citizenship Act as amended by Bill C-3."*
- Citation link: *"Read the regulation: ircc.gc.ca/citizenship-by-descent"* (styled as link, doesn't have to navigate)

#### Lineage chain (small visual)
- Three boxes connected by arrows, horizontal flow:
  - William Smith / Born 1923 / Halifax, Nova Scotia 🇨🇦
  - → David Smith / Born 1948 / Boston, MA 🇺🇸
  - → John Michael Smith / Born 1985 / Portland, OR 🇺🇸

#### Evidence status
- Heading: "What we verified"
- Checklist:
  - ✅ Applicant identity — passport verified
  - ✅ Grandfather's Canadian birth — birth certificate verified
  - ⚠ Parent's birth document — **not submitted**
  - ⚠ Lineage continuity — grandfather's Canadian residence between 1923 and 1948 not yet confirmed
  - ⚠ Substantial-connection test (post-2025 Bill C-3 requirements) — **flagged for RCIC review**

#### Required next steps
- Heading: "To confirm your eligibility, we'll need"
- Bullet list:
  - Your parent's birth certificate
  - Your grandfather's marriage certificate (if applicable)
  - Documentation of your grandfather's time spent in Canada between 1923 and 1948
  - Booked consultation with a licensed RCIC

#### CTA section
- Primary button (large, amber): **"Book a CICS Lineage Audit — 30 min, $250"** → navigates to `/book`
- Secondary button (text link or outlined): "Email this brief to me"

#### Footer microcopy
*"This pre-audit does not constitute legal advice. Final eligibility determinations are made by a licensed RCIC. CICS Immigration is licensed by the College of Immigration and Citizenship Consultants of Canada."*

---

### SCREEN 5 — Booking beat (`/book`)

**Layout**: Calendly-style booking calendar.

**Content**: Quick calendar UI showing a week of available slots. Title: *"Lineage Audit Consultation with Alex Khadempour, RCIC — 30 min"*. Pre-select a slot. **This screen is only on-screen for 2 seconds in the Loom — it just needs to LOOK like a real booking flow.**

Doesn't need to actually book anything. A static page with a calendar grid is fine.

---

### SCREEN 6 — Operator dashboard / Lead queue (`/dashboard`)

**Audience**: Alex and his team. Internal tool.

**Layout**: Sidebar (left, narrow) + main content (right, wide). Desktop-first.

**Sidebar**:
- CICS Immigration logo at top
- Navigation:
  - 🏠 Dashboard (active)
  - 📥 Leads
  - 📊 Analytics
  - ⚙️ Settings
- Bottom: Alex's avatar + name "Alex Khadempour, RCIC"

**Main content**:

#### Top strip — quick stats
- Four stat cards across the top:
  - **47** pre-audits this week
  - **18** with potential pathways
  - **7** consultations booked
  - **3** paid clients

#### Funnel visualization
- A horizontal funnel showing: 47 Started → 32 Submitted → 18 Audit Recommended → 7 Booked → 3 Consults Held → 1 Full Service Engaged
- Each stage as a tapered bar with the count inside

#### Filter chips
- Above the lead table:
  - **All (47)** ●
  - Started (15)
  - Submitted (14)
  - Audit recommended (11)
  - Booked (4)
  - Consult held (2)
  - Full service (1)

#### Lead table
Columns: **Name** | **Verdict** | **Evidence** | **Urgency** | **Source** | **Submitted** | **Status**

Rows (use mock data — keep the order with John Smith near the top):

| Name | Verdict | Evidence | Urgency | Source | Submitted | Status |
|---|---|---|---|---|---|---|
| Lisa Brown | ✅ Potential pathway | 4 ✅ / 0 ⚠ | ASAP | Referral | 2d ago | 🟢 Consult booked |
| Maria Lopez | ✅ Potential pathway | 3 ✅ / 1 ⚠ | Exploratory | Direct | 1d ago | 🟢 Audit booked |
| **John Smith** | ⚠ Potential pathway | 2 ✅ / 3 ⚠ | Within 12mo | Google → Bill C-3 page | 2h ago | 🟡 Audit recommended |
| **Sarah Chen** | ⛔ Needs RCIC review | 1 ✅ / 4 ⚠ | ASAP | Facebook ad | 5h ago | 🔴 Audit recommended |
| Tom Williams | ⚫ Insufficient information | 0 ✅ / 5 ⚠ | This year | Google → Home | 1d ago | ⚫ Started — abandoned |
| Robert Singh | ✅ Potential pathway | 3 ✅ / 2 ⚠ | Within 6mo | LinkedIn | 3d ago | 🟢 Full service engaged |
| Emily Tanaka | ⚠ Potential pathway | 2 ✅ / 2 ⚠ | This year | Google → Bill C-3 page | 4d ago | 🟡 Audit recommended |
| Michael O'Brien | ⚫ Insufficient information | 1 ✅ / 4 ⚠ | Exploratory | Direct | 5d ago | ⚫ Submitted |

Rows for **John Smith** and **Sarah Chen** are clickable and navigate to their detail views. Other rows can be styled clickable but don't need to navigate anywhere (or navigate to a 404 / coming-soon).

---

### SCREEN 7 — John Smith detail view (`/dashboard/lead/john-smith`)

**Layout**: Three-panel layout (left: profile / center: lineage + evidence / right: human-in-loop). Or stacked sections if three-panel doesn't fit well — use judgment.

#### Left panel — Applicant profile
- Avatar placeholder
- Name: **John Michael Smith**
- DOB: March 15, 1985 (age 41)
- Location: Portland, Oregon, USA
- Email: john.smith@example.com
- Phone: +1 (503) 555-0142
- Source: Google → /bill-c-3 page
- Submitted: 2 hours ago
- Urgency: Within 12 months
- Status: 🟡 Audit recommended

#### Center panel — Lineage chain
- Heading: "Lineage chain"
- Visual: three connected boxes (vertical or horizontal)
  - **William Smith** (Grandfather) / Born 1923 in Halifax, Nova Scotia 🇨🇦 / ✅ Birth certificate verified
  - ↓
  - **David Smith** (Parent) / Born 1948 in Boston, MA 🇺🇸 / ⚠ Birth certificate missing
  - ↓
  - **John Michael Smith** (Applicant) / Born 1985 in Portland, OR 🇺🇸 / ✅ Passport verified

#### Center panel (below lineage) — Evidence status
- Heading: "Evidence status"
- Categorical list:
  - ✅ **Confirmed**: Applicant identity (passport)
  - ✅ **Confirmed**: Grandfather's Canadian birth (birth certificate)
  - ⚠ **Missing**: Parent's birth certificate
  - ⚠ **Low confidence**: Grandfather's continuous Canadian residence 1923–1948
  - ⚠ **Flagged for review**: Substantial-connection test (post-2025 Bill C-3 requirements)

#### Center panel (below evidence) — Red flags
- Heading: "Red flags"
- ⚠ Parent's birth certificate not submitted — required to confirm lineage
- ⚠ Grandfather's continuous Canadian residence requires documentation
- ⚠ Post-2025 Bill C-3 substantial-connection test applies — RCIC judgment required

#### Right panel — Human-in-loop
- Heading: "Recommended next action"
- **Drafted follow-up email** (editable textarea, pre-populated):

> Subject: Your Bill C-3 Lineage Pre-Audit — next steps
>
> Hi John,
>
> Your Lineage Pre-Audit identified a potential pathway under Bill C-3 based on your grandfather William Smith's birth in Halifax, Nova Scotia (1923).
>
> To confirm your eligibility and start your application, I recommend booking a 30-minute CICS Lineage Audit. To get the most from our time, please bring or upload:
>
> - Your parent David Smith's birth certificate
> - Your grandfather William Smith's marriage certificate (if applicable)
> - Any documentation showing your grandfather's time spent in Canada between 1923 and 1948
>
> Book your Lineage Audit here: [booking link]
>
> — Alex Khadempour, RCIC
> CICS Immigration

- Three buttons below the textarea:
  - **✅ Approve & Send** (primary, amber)
  - **✏️ Edit** (secondary)
  - **❌ Discard** (text link, gray)

- Status change dropdown: "Mark as: Audit booked / Consult held / Full service / Lost"

---

### SCREEN 8 — Sarah Chen detail view (`/dashboard/lead/sarah-chen`)

Same layout as John Smith but with different data demonstrating an edge case the system correctly flags.

#### Left panel — Applicant profile
- Name: **Sarah Chen**
- DOB: June 22, 1990 (age 35)
- Location: San Francisco, California, USA
- Email: sarah.chen@example.com
- Phone: +1 (415) 555-0193
- Source: Facebook ad → /bill-c-3
- Submitted: 5 hours ago
- Urgency: ASAP
- Status: 🔴 Audit recommended (complex case)

#### Center panel — Lineage chain
- Visual showing adoption:
  - **James MacKenzie** (Birth father — Canadian-born) / Born 1955 in Vancouver, BC 🇨🇦 / ✅ Birth certificate verified
  - ⇢ (dashed line indicating adoption)
  - **Sarah Chen** (Applicant, adopted) / Born 1990 in San Francisco, CA 🇺🇸 / ✅ Passport verified, ⚠ Adoption papers required

#### Evidence status
- ✅ **Confirmed**: Birth father's Canadian birth (1955)
- ✅ **Confirmed**: Applicant identity (passport)
- ⚠ **Missing**: Adoption decree
- ⚠ **Missing**: Original birth certificate (pre-adoption)
- ⚠ **Conflicting**: Surname change (Chen vs. birth father MacKenzie) — adoption records required to reconcile

#### Red flags (prominent — red border or highlight)
- ⛔ **Adoption case** — Section 5.1 of the Citizenship Act applies; eligibility determination requires RCIC review
- ⚠ Adoption pre-1947 vs. post-1947 distinction may apply
- ⚠ Substantial-connection test (post-2025 Bill C-3) likely applies given complexity
- ⚠ Urgency flag: applicant indicates ASAP timeline

#### Right panel — Human-in-loop
- **Drafted follow-up email** (editable textarea, pre-populated):

> Subject: Your Bill C-3 Lineage Pre-Audit — case requires consultation
>
> Hi Sarah,
>
> Your Lineage Pre-Audit indicates a potential pathway, but your case involves adoption, which requires additional review under Section 5.1 of the Citizenship Act. The pathway may exist, but the determination depends on specifics that require careful RCIC analysis.
>
> I recommend booking a paid 30-minute consultation ($250). In our session, we will:
>
> - Review your adoption records and original birth certificate
> - Determine whether pre-1947 or post-1947 adoption rules apply to your case
> - Assess the substantial-connection requirements
> - Map your options if a pathway is confirmed
>
> Book your consultation here: [booking link]
>
> — Alex Khadempour, RCIC
> CICS Immigration

- Same three buttons (Approve & Send, Edit, Discard)
- Same status dropdown

**Important narrative point**: This view exists to prove the system flags complexity rather than guessing. The drafted email is more cautious; the pricing is paid (not free pre-audit); the language defers to RCIC judgment.

---

### SCREEN 9 — Roadmap (`/roadmap`)

**Audience**: Used as the end-of-Loom screen. Static page.

**Layout**: Centered, single column. Three-tier visual.

**Content**:

- Top: heading "Where this goes"

- Three large cards, vertically stacked or in a horizontal row:

  **PHASE 1** (with checkmark / active state)
  - **Bill C-3 Lineage Pre-Audit**
  - "Triage American leads applying under expanded citizenship-by-descent rules. Filter unqualified prospects out before they reach your consultation calendar."
  - Status badge: **CURRENT PHASE**

  **PHASE 2** (slightly muted)
  - **Application Review**
  - "Same architecture applied to every Canadian immigration application type — visas, study permits, work permits, PR, citizenship. Cross-reference questionnaire answers against supporting documents, flag inconsistencies, surface missing information before submission."
  - Status badge: NEXT

  **PHASE 3** (further muted)
  - **The RCIC Hub**
  - "A networked platform connecting Canadian immigration consultants — collaborate on cases that span provinces, share verified regulatory references, and run files through a shared file-readiness engine. Powered by the substrate built in Phases 1 and 2."
  - Status badge: FUTURE

- Footer microcopy: *"CICS Immigration · Pilot in design partnership with Tokenrip · Built on the Tokenrip mounted-agent substrate."*

---

## 7. Mock Data Files

Create these data files (TypeScript) for use across the app:

### `data/applicants.ts`

```typescript
export const applicants = {
  'john-smith': {
    id: 'john-smith',
    name: 'John Michael Smith',
    dob: '1985-03-15',
    location: 'Portland, Oregon, USA',
    email: 'john.smith@example.com',
    phone: '+1 (503) 555-0142',
    ancestor: {
      relationship: 'grandfather',
      name: 'William Smith',
      dob: '1923-07-12',
      placeOfBirth: 'Halifax, Nova Scotia, Canada',
      deceased: '1998',
    },
    parent: {
      name: 'David Smith',
      dob: '1948-05-04',
      placeOfBirth: 'Boston, MA, USA',
    },
    goal: 'Confirm eligibility and start an application',
    timeline: 'Within 12 months',
    submittedAt: '2 hours ago',
    source: 'Google → /bill-c-3 page',
    verdict: 'potential-pathway',
    confidence: 'medium',
    evidence: [
      { item: 'Applicant identity', status: 'confirmed', detail: 'passport verified' },
      { item: "Grandfather's Canadian birth", status: 'confirmed', detail: 'birth certificate verified' },
      { item: "Parent's birth document", status: 'missing', detail: 'not submitted' },
      { item: 'Lineage continuity', status: 'low-confidence', detail: 'grandfather residence 1923-1948 not confirmed' },
      { item: 'Substantial-connection test', status: 'flagged-for-review', detail: 'post-2025 Bill C-3 requirements' },
    ],
    status: 'audit-recommended',
  },
  'sarah-chen': {
    id: 'sarah-chen',
    name: 'Sarah Chen',
    dob: '1990-06-22',
    location: 'San Francisco, California, USA',
    email: 'sarah.chen@example.com',
    phone: '+1 (415) 555-0193',
    ancestor: {
      relationship: 'birth-father',
      name: 'James MacKenzie',
      dob: '1955-XX-XX',
      placeOfBirth: 'Vancouver, BC, Canada',
    },
    isAdopted: true,
    goal: 'Confirm eligibility — adoption case',
    timeline: 'ASAP',
    submittedAt: '5 hours ago',
    source: 'Facebook ad → /bill-c-3',
    verdict: 'needs-rcic-review',
    confidence: 'low',
    evidence: [
      { item: "Birth father's Canadian birth", status: 'confirmed', detail: '1955 Vancouver BC' },
      { item: 'Applicant identity', status: 'confirmed', detail: 'passport verified' },
      { item: 'Adoption decree', status: 'missing', detail: 'required' },
      { item: 'Original birth certificate', status: 'missing', detail: 'pre-adoption' },
      { item: 'Surname change reconciliation', status: 'conflicting', detail: 'Chen vs. MacKenzie' },
    ],
    redFlags: [
      'Adoption — Section 5.1 of Citizenship Act applies',
      'Adoption pre-1947 vs. post-1947 distinction may apply',
      'Substantial-connection test likely applies',
      'Urgency: ASAP timeline indicated',
    ],
    status: 'audit-recommended-complex',
  },
};
```

### `data/leads.ts`

Eight rows for the dashboard table. Use the table data from Screen 6 above verbatim. Define a TypeScript interface and export the array.

### `data/stats.ts`

```typescript
export const weeklyStats = {
  preAudits: 47,
  potentialPathways: 18,
  consultsBooked: 7,
  paidClients: 3,
};

export const funnel = [
  { stage: 'Started', count: 47 },
  { stage: 'Submitted', count: 32 },
  { stage: 'Audit Recommended', count: 18 },
  { stage: 'Booked', count: 7 },
  { stage: 'Consults Held', count: 3 },
  { stage: 'Full Service', count: 1 },
];
```

---

## 8. Interaction Behaviors

- **Customer flow**: each "Continue" / "Submit" button advances to the next route. Form fields are pre-filled with John Smith's data so the Loom can show the flow without typing. Form validation is not enforced — clicking through is fine.
- **Processing screen**: 8-second timer, then auto-navigate to `/result/john-smith`.
- **Result page**: "Book a CICS Lineage Audit" button navigates to `/book`. "Email this brief to me" can be a no-op or show a small "Sent!" toast.
- **Booking page**: any time-slot click can navigate back to `/result/john-smith` or stay on the page. This screen is mostly visual.
- **Dashboard**: John Smith and Sarah Chen rows are clickable and navigate to their detail views. Other rows can show a hover state but not navigate (or navigate to a coming-soon page).
- **Lead detail views**: all buttons (Approve & Send, Edit, Discard) can be no-ops or show toasts. The drafted email textarea should be editable so the viewer can see live editing.
- **Status dropdown**: actually changes the displayed status badge if a different value is chosen. Doesn't persist anywhere.

---

## 9. Acceptance Criteria

Before this is considered done, the following must all be true:

1. All 9 screens implemented and accessible by direct URL
2. The customer-facing flow (Screens 1 → 2 → 3 → 4 → 5) is walkable click-by-click without errors
3. The operator dashboard (Screen 6) renders with all 8 leads visible, accurate stats and funnel
4. John Smith and Sarah Chen detail views (Screens 7 and 8) render correctly with all data
5. The roadmap page (Screen 9) renders cleanly
6. All copy in this doc is reproduced verbatim — no paraphrasing, no synonyms
7. Customer-facing screens are mobile-responsive (test at 375px and 768px viewports)
8. Visual fidelity is 2026-SaaS quality — should not look like a quick prototype
9. Compliance microcopy *"This pre-audit does not constitute legal advice. Final eligibility determinations are made by a licensed RCIC."* appears on Screens 1, 4, and the dashboard footer
10. Verdict language never says "you are eligible," "you qualify," or any definitive statement — always conditional ("potential," "may," "appears")
11. Deployed to `demo.tokenrip.com/cics-immigration` and all child routes
12. The footer of every page reads: *"CICS Immigration · Pilot in design partnership with Tokenrip · Built on the Tokenrip mounted-agent substrate."*

---

## 10. Anti-Features (Do NOT Build)

- Real backend / API routes that hit external services
- Real LLM calls (OpenAI, Anthropic, or otherwise)
- Real document OCR or PDF parsing
- Authentication / login screens
- Database connections
- Email sending
- Real Calendly integration
- Analytics / tracking pixels
- Payment processing
- Multi-tenant or multi-customer skin switching (this is for CICS only — no abstraction layer)
- "Build your own pre-audit" config UI

If a feature would require more than 30 minutes of work and isn't strictly necessary to make this demo visually credible to Alex, skip it.

---

## 11. Reuse Discipline

This mock is built **specifically for Alex Khadempour and CICS Immigration**. Do not generalize, do not abstract, do not build a skin layer for "other immigration firms" yet.

If we sell a second pilot to a different firm later, we will **copy this codebase** into a new path (`demo.tokenrip.com/[firm-slug]`), change colors / copy / data, and ship the second demo. After we've done that copy-paste manually three times, we abstract. Not before. (See `agents/closer/memory/patterns.md` for the YAGNI rationale.)

---


## Appendix A — Why Each Screen Matters For the Sale

This appendix exists so the implementer makes good judgment calls if anything in this spec is ambiguous.

|                      | What it proves to Alex                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1. Landing           | "This belongs on my website. It's branded for CICS, not for some generic SaaS vendor."                                  |
| 2. Intake            | "The questions are smart — they collect the right data, not too much."                                                  |
| 3. Processing        | "The AI is actually doing work — detecting documents, cross-referencing, citing regulations."                           |
| 4. Audit brief       | "The output is defensible. It cites the regulation. It never tells the client they qualify. My liability is protected." |
| 5. Booking           | "It plugs into my existing Calendly. I don't have to change how I run my firm."                                         |
| 6. Dashboard         | "I can run my whole American Bill C-3 funnel from one screen. The conversion math is visible."                          |
| 7. John Smith detail | "I see exactly what the AI saw, what it concluded, and I can edit the email before it sends. I'm still in control."     |
| 8. Sarah Chen detail | "The system knows what it doesn't know. Edge cases get flagged for me, not guessed."                                    |
| 9. Roadmap           | "This isn't just a Bill C-3 chatbot. It's the first piece of something bigger that solves my whole firm's problems."    |

If a design decision is unclear during implementation, ask: *"Does this make Alex's reaction stronger or weaker?"* Optimize for stronger.
