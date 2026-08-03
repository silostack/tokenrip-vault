---
type: client-facing-doc
audience: Stephanie Williamson (AICAP) → hospital IT
purpose: Technical & security fit sheet a hospital's IT team completes, to assess pilot feasibility
status: ready to post to GitHub issue #3 (draft for Stephanie's input first)
source: revised per Simon 2026-07-15 — single technical sheet, questions reframed as standard data questions, core + optional split, integration dropped (pilot delivers via PDF)
created: 2026-07-15
---

# AICAP — Technical & Security Fit Sheet (draft)

*Stephanie — this is a first draft of the sheet your hospital's IT team fills out. It's meant to surface anything that would gate a pilot (their security-review timeline, cloud-data approval, the BAA path) early. Mark it up freely — you know how these teams actually operate.*

---

## About the system *(context for the IT team completing this)*

AICAP is a cloud-hosted application that helps a physician complete a credentialing application. It:

- takes provider-supplied documents (CV, government ID + supporting docs) and pre-fills the application,
- processes that information in the cloud — **including with AI models that run under a Business Associate Agreement, configured for zero data retention and no use of your data to train models,**
- and produces two PDFs on submission (the completed application and an audit trail) that are **emailed to your credentialing coordinator.**

For a pilot, it **runs standalone** — it does not connect to or write into your existing credentialing system. Your team receives the finished PDFs and files them exactly as they do today.

The questions below help us confirm a pilot is feasible in your environment and scope it accurately.

---

## Core questions *(these determine whether and how a pilot can run)*

1. **Approving a cloud vendor that handles provider data.** How does your organization review and approve a software vendor that processes provider data in the cloud? Is there anything that would prevent provider data from being handled by an outside service — for example a requirement that it remain on-premises or never leave your network? *(In our case the cloud processing includes AI models, which operate under a BAA configured for zero data retention with no model training — see the system description above.)*

2. **Security review process and timeline.** What does your vendor security review involve — a specific questionnaire (e.g., HECVAT, Censinet, or your own) — and roughly how long does it take from start to finish? *(This is usually the single biggest factor in when a pilot can go live.)*

3. **Certification requirements.** What security certifications do you require from a vendor to run a pilot — is **SOC 2 Type II** sufficient, or is **HITRUST** required before we can begin?

4. **Business Associate Agreement.** What is your process and typical timeline for executing a **BAA** with a new vendor?

5. **Delivering the finished application.** When a provider submits, the system emails two PDFs (the completed application and an audit trail) to your credentialing coordinator. Are there any **email, attachment, or data-loss-prevention (DLP) restrictions** we should account for so those files arrive reliably?

6. **Hosting.** For a pilot, which hosting arrangements are acceptable — a **vendor-hosted cloud service**, deployment into **your own cloud environment**, or **on-premises only**?

---

## Good to know *(optional — these won't block a pilot, but help us plan and move faster)*

- If pilot users (e.g., the credentialing coordinator) need to log in, do you require **single sign-on (SAML / OIDC) and MFA**, or is a provisioned login acceptable for a time-boxed pilot?
- Any **data-residency** requirements (e.g., a specific region)?
- Any **network controls** we should plan for (IP allowlisting, VPN, private connectivity)?
- Your **audit-logging** expectations (what's logged, retention period)?
- **Data retention and deletion** requirements for the pilot data?
- Do you require separate **test and production** environments?
- Who would be our **technical point of contact** during the pilot?
- Which **credentialing system** does your medical staff office use today? *(Not needed for the pilot — helps us plan any future integration.)*
