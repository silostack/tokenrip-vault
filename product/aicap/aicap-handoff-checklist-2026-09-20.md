---
type: checklist
project: AICAP Self-Serve Demo — environment handoff to AICAP-owned accounts
owner: Simon
counterpart: Stephanie Williamson (bd/calls/contacts/stephanie-williamson.md)
created: 2026-09-20
sources: 2026-08-30 Self-Serve Demo SOW · repo docs/OPERATIONS.md · repo docs/mvp-wrap-up.md §8 · repo docs/production-readiness.md
legend: ✅ done · 🟡 in progress · ⬜ to do · ❓ unverified
---

# AICAP handoff checklist

The SOW places the whole build on AICAP's own accounts from week 1, so no migration happens at the end. The handoff is complete when Stephanie can invite a tester, watch progress, and run the accuracy check without Simon. This list covers the transfer of ownership, not the build. The repo's own handoff list (`docs/mvp-wrap-up.md` §8) covers product acceptance and is folded in only where it affects setup.

## Five items most likely to be missed

1. **The ChatGPT key is the wrong product.** A ChatGPT subscription does not issue API keys. The SOW requires an OpenAI *API platform* account (platform.openai.com) with its own billing. This mistake costs a day if it surfaces on the call.
2. **The provider decision is open, and the key must match it.** The SOW names OpenAI for CV reading. The repo defaults to Anthropic (`claude-sonnet-5`, "recommended"), treats OpenAI as an unqualified alternate, and production boot fails unless the *selected* provider's key is set. Stephanie also asked on 09-01 to benchmark both. Simon decides the provider; the recommendation below is to request both keys.
3. **The SOW validity window closed on 2026-09-19, and no vault record shows a signature.** Contact doc item 55b is still open. Confirm in writing that the $18K SOW is signed and funded, and note the payment mechanism (Upwork or direct).
4. **The Microsoft account is on no one's list yet.** The SOW assigns it to AICAP (about 20 minutes, Simon added as a member). The repo has no Microsoft or Azure code, so the ID-reading integration is unbuilt (SOW weeks 5–6). Opening the account early removes a week 5 dependency on Stephanie's calendar.
5. **The consent screen names the AI vendors.** The SOW disclosure screen states which services read the document and how long they retain it. Its wording depends on the provider decision in item 2.

## Confirm before configuring anything

- ⬜ Confirm the SOW is signed and funded (item 3 above).
- ⬜ Confirm the week 0 kickoff call happened, or schedule it. The SOW locks test-library sources, disclosure wording, and the accuracy bar at that call.
- ⬜ Send the "separate handoff guide" the SOW promises for account setup (contact doc item 55, due 2026-09-03). The vault does not show it as sent. This checklist can serve as its Stephanie-facing half.
- ⬜ Resolve the 09-01 open questions: whether "benchmark Anthropic and ChatGPT" reopens the priced document-reading architecture (item 63), and that "host within hospital environments" belongs to the paid pilot, not this SOW (item 64).

## Accounts and ownership

Each account is opened by Stephanie in AICAP's name, with Simon added as a member. Simon never holds the owner login.

| Account | Status | Simon's access | Notes |
|---|---|---|---|
| GitHub organization | ✅ created by Stephanie | Admin | Repo transferred by Simon. See the repo section. |
| Digital Ocean | ✅ server created by Stephanie | Team member plus own SSH key | Billing and the account owner remain hers. Enable two-factor authentication and droplet backups. |
| OpenAI API platform | ⬜ | Project member | Separate from ChatGPT. Create a *project*, issue a project-scoped key, add a payment method, and set a monthly spend limit. |
| Anthropic Console | ⬜ (recommended, pending item 2) | Workspace member | Same pattern as OpenAI. The `README` and `OPERATIONS.md` describe it as the recommended default. |
| Microsoft Azure (document reading for IDs) | ⬜ | Contributor on one resource group | Needs a subscription, a billing method, and a spending cap. Estimated under $50 for the build. |
| Domain and DNS | ❓ | Ability to add records | Confirm who controls the domain (aicap-access.com or another). The demo needs a hostname and a TLS certificate. |
| Outbound email service | ⬜ | Member | The app has no email transport: outbound mail is queued in a table and never sent. Invite-only logon, request-access, and magic links need a real sender with SPF and DKIM on her domain. |
| Text message provider | ⬜ optional | Member | Only if she takes the $500 add-on. |
| Error alerts and uptime monitor | ⬜ | Member | The SOW promises an alert when something fails. Decide the recipient: Stephanie, Simon, or both. |
| Shared password manager | ⬜ | Member | The one channel for keys and passwords. Never email, text, or paste them into a chat. |

Recommendation for item 2: request both LLM keys now. Both are cheap to hold, the 09-01 call asked to benchmark, and the repo's `eval:extraction:compare` gate needs both to run. Set `LLM_PROVIDER` on the server to whichever passes the accuracy bar. The repo's 2026-09-05 evaluation shows GPT-5.6 at 7 of 7 CVs and Anthropic at 6 of 7 before its final prompt rules, so the outcome is not settled.

## Key handling and cost controls

- ⬜ Store every key in the password manager, and enter it on the server directly. Do not put keys in the repo, in the ticket, or in email.
- ⬜ Set a monthly cap on each AI account. The SOW commits Simon to setting the cap and reporting usage weekly.
- ⬜ Use project-scoped keys, so a key revoked for one purpose leaves the others working.
- ⬜ Generate `SESSION_SECRET` (`openssl rand -hex 32`), `COORDINATOR_PASSWORD`, and the Postgres password on the server. Do not reuse any value from the Tokenrip-hosted instance.
- ⬜ Record where each secret lives and who can rotate it. Rotating `SESSION_SECRET` logs everyone out and invalidates every outstanding magic link.
- ⬜ Revoke the Tokenrip-owned Anthropic key that the current review host uses, after cutover.

## Repository after the transfer

- ⬜ Update the local remote. The clone at `~/projects/maxi/aicap` still points at `git@github.com:tokenrip/aicap.git`. GitHub redirects for now, but a new repository at the old path breaks the redirect.
- ⬜ Verify the auto-assign workflow (`.github/workflows/auto-assign-issues.yml`). It assigns every new issue to `silostack`. If that account is not an organization member with access, the assignment fails silently. Change the assignee if Stephanie or another person should own new issues.
- ⬜ Check that issues, labels, and the issue template (`product-feedback.yml`) survived the transfer, and that the organization's Actions are enabled.
- ⬜ Confirm permissions: Stephanie as owner, Simon as admin, and no leftover collaborators from the old setup.
- ⬜ Decide the branch rules. `main` and `develop` sit at the same commit, `develop` is the working branch, and `origin/HEAD` points at `main`. Fix one default and one deploy branch.
- ⬜ Push or discard the 13 local-only branches (`feat/week-4`, `feat/week-5`, `feat/week-6`, and the rest). Only `develop`, `main`, `feat/fable-5`, and `feat/github-2-12` exist on the remote.
- ⬜ Add the server's deploy key to the new repository. Any key registered against the old path stops working.
- ✅ No secrets found in git history, and `.env`, PDFs, and reference drops are ignored.
- ⬜ Review what she will now own: tracked `.claude/`, `.agents/`, and `.superpowers/` folders, `docs/client-config-notes.md` (addressed to "Simon (Tokenrip)"), and `docs/history/`. Nothing priced was found in `docs/` outside `history`. Decide whether any of it stays out of her repo.
- ⬜ Leave the hard-coded `github.com/tokenrip/aicap/issues/N` links in docs alone until the redirect question is settled, then update in one pass.

## Server baseline (Digital Ocean)

The runbook is `docs/OPERATIONS.md`. The SOW puts hardening in weeks 5–6, but the firewall and key-only login are easier to apply on an empty server.

- ⬜ Install prerequisites: Node LTS, Bun, PostgreSQL 14 or later, `graphicsmagick`, `ghostscript` (PDF extraction fails without the last two), and nginx.
- ⬜ Point the hostname at the droplet and issue a TLS certificate with certbot. API and app must share one origin so the session cookie stays first-party.
- ⬜ Apply the SOW hardening list: firewall, login by named keys only (no passwords, no root login), automatic security updates, encrypted backups, and failure alerts.
- ⬜ Run the Postgres backup and restore once and record the result. `pg_dump aicap` captures both application data and workflow state.
- ⬜ Put both services under systemd or pm2 (`aicap-backend` on 3000, `aicap-frontend` on 3001). `ecosystem.config.sample.cjs` is the starting point.
- ⬜ Document who else can log in. If Stephanie loses her Digital Ocean access, recovery must not depend on Simon alone.

## First deploy on AICAP's server

- ⬜ Fill `apps/backend/.env` from the production template in `OPERATIONS.md` §3. Set `NODE_ENV=production`, `LLM_PROVIDER`, `LLM_MODEL`, the matching key, and `PUBLIC_BASE_URL`. Leave `AICAP_FIXTURE_INGEST` and `AICAP_SQL_DEBUG` off.
- ⬜ Provision a *fresh* database. `db:sync` and `db:seed` refuse `NODE_ENV=production`, so the runbook runs them with `env -u NODE_ENV`. The seed step is out-of-band on a new production database.
- ⬜ Run the smoke tests in `OPERATIONS.md` §8: `/health`, coordinator login, a gated route, a magic link, and one real extraction.
- ⬜ Treat the two pending deploy runbooks (`deploy-2026-08-24`, `deploy-2026-09-10`) as superseded by a fresh deploy of the current `develop` tip. The runbook status lines still read "pending."
- ⬜ Close two known gaps before any real document arrives: the session cookie lacks the `Secure` flag, and no boot-time check validates `SESSION_SECRET` and `COORDINATOR_PASSWORD`. Both are marked TODO(pilot).
- ⬜ Cut over from `aicap.tokenrip.com`. Keep the old host up until Stephanie confirms the new one works, then shut it down and remove its data.

## Data and consent

- ⬜ Decide where the 500-document seed library lives (server storage, encrypted, never in the repo) and who collects it. The SOW allows de-identified documents or real ones with consent.
- ⬜ Draft the consent and disclosure text once the provider is chosen (item 5). It states what is collected, which AI services read it, retention, and how to request deletion.
- ⬜ Confirm the retention statement matches the vendor terms: OpenAI keeps API inputs up to 30 days unless zero retention is arranged. The SOW deletes data after 12 months or on request.
- ⬜ Confirm no real provider document sits in the repo. The tracked ID and passport images under `testdata/id-samples/` and `docs/demo-packet/` must be synthetic or web-sourced samples.

## Documents Stephanie receives

- ⬜ `docs/PLAYBOOK.md` (operator walkthrough), `docs/OPERATIONS.md`, `docs/aicap-system-overview.md`, and `docs/demo-packet/`.
- ⬜ A plain-language, non-engineer guide to the tracing view, tester logons, and the request-access flow. Her 07-22 comment that GitHub threads were unreadable applies here.
- ⬜ At acceptance: the test library and accuracy check with run instructions, updated source and configuration, and a walkthrough. The handoff test is that she runs all three without Simon.

## Later phases: do not open now

- Email dispatcher and SPF/DKIM: needed for invite-only logon (SOW weeks 1–2 and 7).
- Microsoft ID integration and phone capture: weeks 5–6.
- Security hardening, encrypted document storage, and delete path: weeks 5–6.
- Text message on submission: only if she takes the add-on.

## Vault updates after these items close

- ⬜ Update contact doc items 57 (GitHub org) and 58 (Digital Ocean) to done; items 55, 55b, 59 as they close.
- ⬜ Refresh `aicap-project-tracker.md`. Its `last_updated` is 2026-07-31 and it still describes the Validation MVP phase.
