---
status: living reference for Ironmark's Smartlead and Icemail clients
last_revised: 2026-09-26
owner: Simon
serves: every public endpoint and webhook both vendors document, plus the subset Ironmark must use; written because build.md was drafted without a complete view of either API
tier: internal
relationship: companion to `build.md` §5c, §5f, §6d, §6e. Sources: [Smartlead API](https://api.smartlead.ai/introduction) (`llms-full.txt` dump, 2026-09-25) and the [Icemail OpenAPI spec](https://docs.icemail.ai/) (embedded on the docs host, 2026-09-26).
---

# Smartlead and Icemail APIs

**So what.** Both APIs are large enough to run the outbound engine without SMTP as the happy path. The handoff spike in `build.md` §5c is already answered in the docs: `POST /campaigns/{id}/reply-email-thread` accepts `cc` and `bcc` as comma-separated strings. Icemail can buy domains, create Google or Microsoft mailboxes, push them into Smartlead, and fire webhooks when a mailbox is live or an export finishes. Ironmark still owns the record; these two systems remain rented plumbing.

This document is a catalog. The first section states what Ironmark must implement in week 1. The rest lists every documented endpoint so a later need is a lookup, not another docs scrape.

## What Ironmark must use in week 1

Smartlead (base `https://server.smartlead.ai/api/v1`, auth `?api_key=`):

| Job | Endpoint |
|---|---|
| Push leads (≤400) | `POST /campaigns/{id}/leads` |
| Pause / resume / unsubscribe a lead | `POST /campaigns/{id}/leads/{lead_id}/pause`, `/resume`, `/unsubscribe` |
| Handoff in-thread with lender cc | `POST /campaigns/{id}/reply-email-thread` (`cc` documented) |
| Thread for David and takeover | `GET /campaigns/{id}/leads/{lead_id}/message-history` |
| Receive events | `POST /webhook/create` at `association_type=user`, plus `POST /campaigns/{id}/webhooks/retrigger-failed-events` |
| Fleet health | `GET /email-accounts/`, `GET /email-accounts/{id}/warmup-stats`, `GET /analytics/mailbox/domain-wise-health-metrics` (10/min dedicated) |
| Mirror suppression | `POST /leads/block-list` (emails) and `POST /master-inbox/block-domains` (domains) |
| Backfill missed replies | `POST /master-inbox/inbox-replies` with `emailStatus=Replied`; `GET /master-inbox/untracked-replies` |

Icemail (base `https://app.icemail.ai/api/v1`, auth header `x-api-key`):

| Job | Endpoint |
|---|---|
| Status of the existing 30 boxes | `GET /mailbox`, `GET /domain` |
| Credentials for SMTP fallback | `GET /mailbox/{id}/app-password` (Google only) |
| Replacement order | `POST /order` then `POST /export` with `sequencer=smartlead` |
| Know when a replacement is live | `POST /webhook` for `order.mailbox.active`, `order.export.completed`, `order.mailbox.failed` |

Do not use Smart Prospect, Smart Delivery (spam tests), Smart Senders, or Smart Infra. Those compete with Quintel sourcing and with Icemail as the fleet vendor.

## Smartlead

### Conventions

- **Base URL.** `https://server.smartlead.ai/api/v1`. A legacy `/api/...` host still exists; new work uses v1.
- **Auth.** API key as query parameter `api_key`. Client (agency) keys exist under `/client/api-key`; Ironmark uses one workspace key.
- **Plan-wide rate limit.** Standard 60/min and 1,000/hour, burst 10/s; Pro 120/min and 3,000/hour. 429 JSON includes `retry_after`. Design for 60/min with exponential backoff. Source: [Rate Limits](https://api.smartlead.ai/guides/rate-limits).
- **Dedicated extra limits (stack on the plan-wide cap, no `Retry-After` header):**
  - `GET /campaigns/{id}/leads-statistics` — 10/min
  - `GET /campaigns/all-leads-activities` — 10/min
  - `GET /analytics/mailbox/domain-wise-health-metrics` — 10/min
- **Lead statuses.** `STARTED`, `INPROGRESS`, `COMPLETED`, `PAUSED`, `STOPPED` (reply received), `BLOCKED` (bounce or global block).
- **Webhook signature.** HMAC-SHA256 of the raw body, header `X-Smartlead-Signature`. User-level webhooks override client- and campaign-level webhooks for the same event. Retries: three attempts at 1, 5, and 30 minutes (as stated in `build.md`; confirm against live deliveries). Retrigger: `POST /campaigns/{campaignId}/webhooks/retrigger-failed-events`.

### Webhook events

Subscribe with `event_type_map` on create. Source: [Webhook Events](https://api.smartlead.ai/api-reference/webhooks/events).

| Event | Fires when | Ironmark |
|---|---|---|
| `EMAIL_SENT` | Any sequence step sends | Log; mark step |
| `FIRST_EMAIL_SENT` | Sequence step 1 only | Optional; `EMAIL_SENT` already covers it |
| `EMAIL_OPEN` | Tracking pixel | Off in v1 (`DONT_EMAIL_OPEN`) |
| `EMAIL_LINK_CLICK` | Tracked link | Off in v1 |
| `EMAIL_REPLY` | Inbound reply on a known lead | Classifier path |
| `EMAIL_BOUNCE` | Bounce | Hard vs soft in payload; suppress on hard |
| `LEAD_UNSUBSCRIBED` | Unsubscribe click | Permanent suppression |
| `LEAD_CATEGORY_UPDATED` | AI or manual category | Second opinion only; includes full `history` and `lastReply` |
| `CAMPAIGN_STATUS_CHANGED` | Campaign started / paused / completed | Bounce-autopause alert |
| `UNTRACKED_REPLIES` | Reply that does not match a campaign lead | Person looks (handoff replies can land here) |
| `MANUAL_STEP_REACHED` | Sequence hits a manual step | Unused (no LinkedIn / call steps) |
| `EMAIL_ACCOUNT_DISCONNECTED` | SMTP/IMAP failure | Separate per-user `notify_on_disconnect.webhookUrl`, not the campaign webhook |
| `LINKEDIN_DISCONNECTED` | LinkedIn cookie dead | Unused |

`EMAIL_REPLY` payload includes `from_email` (the Ironmark mailbox), `to_email` (the lead), `subject`, `reply_body`, `preview_text`, `campaign_id`, `sequence_number`. It does **not** document `email_stats_id` or `message_id` on the reply event itself; those come from message-history / master-inbox, which the handoff send needs.

### Campaigns

Base host unless noted.

| Method | Path | What it does |
|---|---|---|
| POST | `/campaigns/create` | Create campaign |
| GET | `/campaigns/` | List (`client_id`, `include_tags`) |
| GET | `/campaigns/{id}` | One campaign: status, schedule, `track_settings`, `stop_lead_settings`, sending limits |
| POST | `/campaigns/{id}/status` | `ACTIVE` / `PAUSED` / `STOPPED` (docs also show PATCH in the index; live path is POST) |
| POST | `/campaigns/{id}/settings` | Tracking, stop-on-reply, AI ESP matching, plain text |
| POST | `/campaigns/{id}/schedule` | Timezone, days, `startHour`/`endHour`, `max_leads_per_day`, `min_time_btwn_emails` |
| POST | `/campaigns/{id}/sequences` | Sequence steps + A/B variants + delays |
| GET | `/campaigns/{id}/sequences` | Read sequences |
| POST | `/campaigns/{id}/email-accounts` | Attach mailboxes |
| POST | `/campaigns/{id}/email-accounts/by-tag` | Attach all mailboxes with a tag |
| GET | `/campaigns/{id}/email-accounts` | List attached mailboxes |
| DELETE | `/campaigns/{id}/email-accounts` | Detach |
| POST | `/campaigns/{id}/duplicate` | Clone |
| DELETE | `/campaigns/{id}` | Permanent delete of sequences, stats, webhooks, history |
| POST | `/campaigns/create-subsequence` | Subsequence (branch) |
| POST | `/campaigns/{id}/send-test-email` | Test send |
| POST | `/campaigns/{id}/team-member` | Assign team member |
| POST | `/campaigns/tags` | Campaign tags |
| DELETE | `/campaigns/tags` | Remove tags |
| GET | `/campaigns/{id}/leads-export` | Export leads |

Settings Ironmark cares about: `track_settings` includes `DONT_EMAIL_OPEN` and `DONT_LINK_CLICK`; `stop_lead_settings` includes `REPLY_TO_AN_EMAIL`.

### Leads in a campaign

| Method | Path | What it does |
|---|---|---|
| POST | `/campaigns/{id}/leads` | Import ≤400. Body: `lead_list[]` with `email` required, names, company, `custom_fields` (≤200 keys). `settings.ignore_global_block_list` / `ignore_unsubscribe_list` / `ignore_duplicate_leads_in_other_campaign` / `ignore_community_bounce_list` default false. Response: `added_count`, `skipped_count`, `skipped_leads[].reason` |
| GET | `/campaigns/{id}/leads` | Page campaign leads |
| GET | `/leads/{lead_id}` | Global lead by id |
| GET | `/leads/` | Lookup by `email`; includes `lead_campaign_data[]` |
| POST | `/campaigns/{id}/leads/{lead_id}/` | Update fields |
| POST | `/campaigns/{id}/leads/{lead_id}/category` | Set category |
| POST | `/campaigns/{id}/leads/{lead_id}/pause` | Stop sending; keep in campaign |
| POST | `/campaigns/{id}/leads/{lead_id}/resume` | Resume |
| POST | `/campaigns/{id}/leads/{lead_map_id}/manual-complete` | Mark sequence done |
| POST | `/campaigns/{id}/leads/{lead_id}/unsubscribe` | Campaign-only unsubscribe |
| POST | `/leads/{lead_id}/unsubscribe` | **Global** unsubscribe; cannot undo via API |
| DELETE | `/campaigns/{id}/leads/{lead_id}` | Remove from campaign |
| GET | `/campaigns/{id}/leads/{lead_id}/message-history` | Thread |
| POST | `/campaigns/{id}/message-history-for-leads/bbfbdsFGHlBr76ruhjvh6fhHL` | Bulk message history (path is as published) |
| POST | `/campaigns/{id}/reply-email-thread` | Reply in thread. **Required:** `email_stats_id`, `email_body`. Optional: `to_email`, names, `scheduled_time`, `reply_message_id`, `cc`, `bcc`, `add_signature`, `attachments[]` (`file_url` required) |
| POST | `/campaigns/{id}/forward-email` | Forward a message |
| POST | `/campaigns/update-lead-email-account` | Reassign sending mailbox for a lead |
| GET | `/leads/fetch-categories` | Categories with `sentiment_type` positive / negative / neutral |
| POST | `/leads/push-to-campaign` | Push from a lead list |
| POST | `/leads/leads/push-between-lists` | Move between lists |
| GET | `/campaigns/all-leads-activities` | Activity stream; 10/min |

Guides also show `POST /leads/block-list` with `{ "emails": [...] }` for the global block list, and `GET /leads/get-domain-block-list` on the legacy reference host. Treat those as the email-level suppression mirror; confirm the v1 path in the first spike.

### Lead lists and CRM notes

| Method | Path | What it does |
|---|---|---|
| POST | `/lead-list/` | Create list |
| GET | `/lead-list/` | List |
| GET | `/lead-list/{id}` | One list |
| PUT | `/lead-list/{id}` | Rename |
| DELETE | `/lead-list/{id}` | Delete |
| POST | `/lead-list/{id}/import` | Import into list |
| POST | `/lead-list/assign-tags` | Tag lists |
| GET/POST | `/crm/leads/tags` | CRM tags |
| DELETE | `/crm/leads/tags/{tagMappingId}` | Untag |
| GET | `/crm/leads/notes/{id}` | Notes |
| GET | `/crm/leads/tasks/{id}` | Tasks |

Unused in phase 1. Quintel is the list of record.

### Email accounts (mailboxes)

| Method | Path | What it does |
|---|---|---|
| GET | `/email-accounts/` | All accounts: `from_name`, `from_email`, `is_smtp_success`, `is_imap_success`, `message_per_day`, `daily_sent_count`, warmup |
| GET | `/email-accounts/{id}/` | One account; `fetch_campaigns=true` adds campaign ids. **Returns decrypted SMTP password.** |
| GET | `/email-accounts/fetch-email-account-details` | Alternate detail fetch |
| POST | `/email-accounts/save` | Add SMTP/IMAP |
| POST | `/email-accounts/save-oauth` | Gmail / Outlook OAuth |
| POST | `/email-accounts/{id}` | Update (`from_name` lives here — the sender-name fleet job) |
| DELETE | `/email-accounts/{id}` | Soft-delete; warmup off; removed from campaigns |
| PUT | `/email-accounts/suspend/{id}` | Suspend |
| DELETE | `/email-accounts/unsuspend/{id}` | Unsuspend |
| POST | `/email-accounts/{id}/warmup` | Start / configure warmup |
| GET | `/email-accounts/{id}/warmup-stats` | Sent, spam, inbox, reputation, daily stats |
| GET | `/email-accounts/tags` | Tag catalog |
| POST | `/tags` | Create tag |
| POST | `/email-accounts/tag-list` | Tags on given addresses |
| POST | `/email-accounts/tag-mapping` | Assign tag |
| DELETE | `/email-accounts/tag-mapping` | Remove tag |
| POST | `/email-accounts/tag-manager` | Bulk tag ops |

### Master inbox

Most list endpoints are **POST** with a filter body (`offset`, `limit` 1–20, `filters.emailStatus`, campaign, mailbox, category, date range).

| Method | Path | What it does |
|---|---|---|
| POST | `/master-inbox/inbox-replies` | Replied threads |
| POST | `/master-inbox/unread-replies` | Unread |
| GET | `/master-inbox/untracked-replies` | Untracked |
| POST | `/master-inbox/sent` | Sent |
| POST | `/master-inbox/scheduled` | Scheduled |
| POST | `/master-inbox/snoozed` | Snoozed |
| POST | `/master-inbox/archived` | Archived |
| POST | `/master-inbox/important` | Important |
| POST | `/master-inbox/assigned-me` | Assigned |
| POST | `/master-inbox/reminders` | Reminders (`sortBy` `REMINDER_TIME_ASC` / `DESC`) |
| GET | `/master-inbox/{id}` | One thread; `id` is `campaign_lead_map_id` |
| POST | `/master-inbox/views` | Saved views |
| PATCH | `/master-inbox/change-read-status` | Read / unread |
| PATCH | `/master-inbox/update-category` | Category |
| PATCH | `/master-inbox/update-revenue` | Revenue field |
| PATCH | `/master-inbox/resume-lead` | Resume from inbox |
| POST | `/master-inbox/set-reminder` | Reminder |
| POST | `/master-inbox/create-note` | Note |
| POST | `/master-inbox/create-task` | Task |
| POST | `/master-inbox/update-team-member` | Assign |
| POST | `/master-inbox/push-to-subsequence` | Push to subsequence |
| GET | `/master-inbox/reply-status` | Reply-status helper |
| POST | `/master-inbox/block-domains` | Domain block list. Body: `domains[]`, `source` = `manual` / `bounce` / `complaint` / `invalid` |

### Webhooks (management)

| Method | Path | What it does |
|---|---|---|
| POST | `/webhook/create` | Create. `association_type`: `user` / `client` / `campaign`. `event_type_map`, optional `category_id_map`, `force_create` |
| GET | `/webhook/{id}` | One |
| PUT | `/webhook/update/{id}` | Update |
| DELETE | `/webhook/delete` | Delete |
| GET | `/campaigns/{id}/webhooks` | Campaign webhooks |
| GET | `/campaigns/{id}/webhooks/summary` | Summary |
| POST | `/campaigns/{id}/webhooks` | Campaign-scoped create |
| DELETE | `/campaigns/{id}/webhooks/{webhook_id}` | Delete campaign webhook |
| POST | `/campaigns/{id}/webhooks/retrigger-failed-events` | Replay failed deliveries |

Ironmark should register **one user-level webhook** so twelve campaigns do not need twelve URLs. User-level wins over campaign-level.

### Analytics (campaign and mailbox)

All GET, typically `start_date` / `end_date` `YYYY-MM-DD`, `timezone`, optional `client_ids` / `campaign_ids`.

| Path | What it returns |
|---|---|
| `/analytics/overall-stats-v2` | Account headline; positive replies on **reply date** |
| `/analytics/campaign/list` | Id + name |
| `/analytics/campaign/overall-stats` | Per-campaign sent / opened / replied / bounced / rates |
| `/analytics/campaign/response-stats` | Positive / neutral / negative **event** counts (not distinct leads) |
| `/analytics/campaign/status-stats` | Counts by campaign status |
| `/analytics/campaign/follow-up-reply-rate` | Follow-up reply rate |
| `/analytics/campaign/lead-to-reply-time` | Time to first reply |
| `/analytics/campaign/leads-take-for-first-reply` | Leads to first reply |
| `/analytics/lead/overall-stats` | Lead-level totals |
| `/analytics/lead/category-wise-response` | By category |
| `/analytics/day-wise-overall-stats` | Daily on **event date** (bounces returned as 0) |
| `/analytics/day-wise-overall-stats-by-sent-time` | Daily on **send date** (use this for bounce-by-day) |
| `/analytics/day-wise-positive-reply-stats` | Distinct positive leads by reply date |
| `/analytics/day-wise-positive-reply-stats-by-sent-time` | Same by send date |
| `/analytics/mailbox/overall-stats` | Mailbox totals |
| `/analytics/mailbox/name-wise-health-metrics` | Per-address health |
| `/analytics/mailbox/domain-wise-health-metrics` | Per-domain health; **10/min dedicated** |
| `/analytics/mailbox/provider-wise-overall-performance` | Gmail vs Outlook vs SMTP |
| `/analytics/client/list` | Clients |
| `/analytics/client/overall-stats` | Per-client |
| `/analytics/client/month-wise-count` | Monthly |
| `/analytics/team-board/overall-stats` | Team board |
| `/campaigns/{id}/analytics` | One campaign |
| `/campaigns/{id}/analytics-by-date` | By date |
| `/campaigns/{id}/top-level-analytics-by-date` | Top-level by date |
| `/campaigns/{id}/statistics` | Statistics |
| `/campaigns/{id}/leads-statistics` | Lead events; 10/min; `event_time_gt` for incremental poll |
| `/campaigns/{id}/mailbox-statistics` | Per mailbox in campaign |
| `/campaigns/{id}/sequence-analytics` | Per step |

Positive-reply numbers from Smartlead's categories are **not** Ironmark's `interested` class. Use them for dashboards only.

### Clients (agency)

`POST /client/save`, `GET /client/`, `POST|GET /client/api-key`, `DELETE /client/api-key/:id`, `PUT /client/api-key/reset/:id`. Unused unless a second brand is a Smartlead client.

### One-off send

`POST /send-email/initiate` — send outside a campaign. Not the handoff path; the thread reply endpoint is.

### Out of scope for Ironmark (still on the public API)

**Smart Prospect** (`https://prospect-api.smartlead.ai/api/v1/search-email-leads/...`): cities, states, countries, companies, domains, industries, job titles, head counts, revenue, search-contacts, find-emails, get-contacts, saved searches, reply-analytics. This is a B2B database. Quintel sources from public records.

**Smart Delivery** (`https://smartdelivery.smartlead.ai/api/v1/spam-test/...`): schedule / manual spam tests, folders, reports (blacklist, DKIM, SPF, rDNS, seed providers, mailbox summary). Optional later as a deliverability check; not week 1.

**Smart Senders** (`https://smart-senders.smartlead.ai/api/v1/smart-senders/...`): search/buy domains, vendors, place-order, auto-generate-mailboxes. Overlaps Icemail. Do not dual-provision.

**Smart Infra** (`https://smartservers.smartlead.ai/api/v1/smart-infra/mapping`): server mapping. Unused.

### Implications for `build.md`

1. **Cc on handoff is documented.** `reply-email-thread` has `cc` and `bcc`. The SMTP fallback is still needed if a live send rejects the cc, or if the handoff lands as `UNTRACKED_REPLIES` and Smartlead will not thread it. Spike becomes a live send, not a docs question.
2. **`email_stats_id` is required to reply** and is not on the `EMAIL_REPLY` webhook example. The 15-minute poll of message-history / master-inbox is load-bearing for handoff, not only a backfill.
3. **User-level webhook** beats twelve campaign webhooks. `build.md` §6d says one endpoint per campaign; change that.
4. **Domain-wise health is 10/min.** Hourly poll of 6 domains is fine; do not loop it per mailbox on that endpoint. Per-mailbox warmup-stats is the other poll.
5. **Global unsubscribe cannot be undone via API.** Mirror Quintel suppression to the block list; do not fire global unsubscribe for a 90-day cooldown.

## Icemail

### Conventions

- **Base URL.** `https://app.icemail.ai/api/v1` (whitelabel customers use their own host).
- **Auth.** Header `x-api-key`. Missing or bad key → 403.
- **Envelope.** Success `{ success, data, message }`. Error `{ success: false, message, errors: [{ field, message }] }`.
- **Pagination.** `page` (default 1), `limit` (default 10, max 50), `search`.
- **Roles.** OWNER, ADMIN, EDITOR, VIEWER. EDITOR can order domains and mailboxes and export; cannot manage webhooks, billing, or invites. VIEWER is read-only.
- **List rate limit.** Most routes 5/s burst, 30/min sustained. Tighter: `POST /order` 1 per 5s and 12/min; `POST /export` 1/s and **1/day per mailbox per sequencer** (`other` unlimited); `POST /wallet/topup` 1 per 10s; DNS writes 20/min; forwarding/DMARC bulk 10/min.
- **429.** `Retry-After` plus `{ retry_after }`. Headers `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.

### Workspace and wallet

| Method | Path | What it does |
|---|---|---|
| GET | `/workspace` | List workspaces for the key |
| POST | `/workspace` | Create (`name`) |
| PUT | `/workspace` | Rename current |
| POST | `/workspace/invite` | Invite `ADMIN` / `EDITOR` / `VIEWER`; 409 if already a member |
| GET | `/wallet` | Balance and auto-topup |
| PUT | `/wallet/auto-topup` | `enabled`, `threshold`, `topup_amount` |
| POST | `/wallet/topup` | $5–$10,000; card on file charges now, else Stripe `checkout_url` |

### Domains

| Method | Path | What it does |
|---|---|---|
| GET | `/domain` | List (`search`) |
| GET | `/domain/available` | Availability and price. TLD allowlist: com, net, org, biz, live, info. No subdomains |
| GET | `/domain/{id}` | One domain |
| GET | `/domain/ns-records` | Icemail nameservers (`pns71.cloudns.net` and siblings) |
| GET | `/domain/{id}/dns-records` | All records |
| POST | `/domain/{id}/dns-records` | Create. Types: A, AAAA, CNAME, MX, TXT, NS, SRV, PTR, HTTPS, SVCB, TLSA, CAA. `@` = root |
| PUT | `/domain/{id}/dns-records` | Update (must include record `id`) |
| PUT | `/domain/{id}/forwarding` | Apex URL forward |
| PUT | `/domain/forwarding` | Bulk forward |
| DELETE | `/domain/forwarding` | Bulk remove forward |
| PUT | `/domain/{id}/dmarc` | Set DMARC report mailbox |
| PUT | `/domain/dmarc` | Bulk DMARC |
| DELETE | `/domain/dmarc` | Bulk remove DMARC |
| POST | `/domain/add-google-client-id` | Google OAuth client on the domain |
| DELETE | `/domain/mailboxes` | Stage 1 of teardown: delete every mailbox; domain and zone remain. `mode: scheduled` waits until billing date |
| DELETE | `/domain/clear-dns` | Stage 2: empty the zone, keep the domain row |
| DELETE | `/domain` | Stage 3: remove the domain permanently |

Teardown is three calls. Silent-skip of domains that fail preconditions — call the missing stage first.

### Mailboxes

| Method | Path | What it does |
|---|---|---|
| GET | `/mailbox` | List; `search` on name/username; `provider` GOOGLE / MICROSOFT / CUSTOM |
| GET | `/mailbox/price` | Prices |
| GET | `/mailbox/{id}` | One |
| GET | `/mailbox/domain/{domainId}` | All on a domain |
| PUT | `/mailbox/{id}` | `first_name`, `last_name`, `username` (local part), `profile_url` (HTTPS JPEG/PNG) |
| PUT | `/mailbox/forwarding` | Bulk forwarding |
| DELETE | `/mailbox/forwarding` | Bulk remove forwarding |
| GET | `/mailbox/{id}/auth` | Current TOTP `{ token, remaining }`, or null |
| GET | `/mailbox/{id}/app-password` | Decrypted Google app password; 400 on non-Google |

The app-password endpoint is the SMTP fallback for a handoff that Smartlead will not send. The webhook `mailbox.app_password.updated` also delivers the plaintext password — subscribe only on a trusted Ironmark URL.

### Orders (buy or import)

`POST /order` — 1–100 domains per call, all mailboxes for a domain in **one** request.

- `import: false` (default): purchase domain + mailboxes; Icemail DNS.
- `import: true`: no domain charge; point nameservers at ClouDNS first, or pass `cloudflare: { email, api_key }` with Zone.Zone Edit + Zone.DNS Edit on all zones.
- Each item: `domain_name`, `mailbox_type` (`GOOGLE` / `MICROSOFT` / `CUSTOM` / `AZURE`), `mailboxes[]` with `first_name`, `last_name`, `username` (must be `local@domain_name`), `password` (≥8), optional `email_forwarding`, `profile_url`. Optional `domain_forwarding` URL.
- CUSTOM ≤15 mailboxes per domain; AZURE exactly 100.

Replacement of a burned state domain is this endpoint plus export.

### Pre-warm

| Method | Path | What it does |
|---|---|---|
| GET | `/prewarm` | Inventory of already-warmed domains for sale |
| POST | `/prewarm/buy` | Buy 1–50 by `domain_ids`; new domain and mailbox ids returned |

Faster than buying cold and warming in Smartlead for two weeks. Price vs control is a Simon call when the first domain is paused >7 days (`build.md` §5f).

### Export to Smartlead

`POST /export`

- `mailbox_ids[]`, `sequencer` enum: `instantly`, `smartlead`, `reachinbox`, `emailbison`, `plusvibe`, `masterinbox`, `salesforge`, `sendkit`, `outreachfox`, `other`.
- For **`smartlead`**: `username` and `password` of the Smartlead login (not the API key).
- Rate limit: **once per mailbox per sequencer per day**. `other` is unlimited.
- `GET /export/{id}` for status. `POST /export/republish/{id}` retries a stuck job; 2-hour cooldown.

### Lookup

`POST /lookup/mailboxes` `{ usernames: [1–100] }` → id or null.
`POST /lookup/domains` `{ domains: [1–100] }` → id or null.

### Webhooks

Max 5 endpoints per workspace. Omit `subscribed_events` (or `[]`) = all events. Retry 5 times: 30s, 60s, 120s, 240s, 480s. Timeout 10s. Envelope: `event`, `timestamp`, `workspace_id`, `email` (owner), `data`.

| Event | When |
|---|---|
| `order.mailbox.active` | Every mailbox in the order is ACTIVE |
| `order.mailbox.failed` | Vendor failed a mailbox (`error_code` e.g. `LICENSE_LIMIT`) |
| `order.domain.active` | Every domain ACTIVE after NS check |
| `order.domain.failed` | Purchase / zone / NS failed |
| `order.export.completed` | Export finished; splits completed / failed / pending |
| `order.mailbox.deleted` | Delete, including cascade from a Google admin box |
| `order.mailbox.renewed` | Listed in the event table on the docs host |
| `mailbox.renewal.reminder` | Listed in the event table |
| `domain.renewal.reminder` | 30 days before expiry; purchased (not imported, not Cloudflare) domains |
| `mailbox.app_password.updated` | Google app password written (plaintext in `data.app_password`) |

CRUD: `POST /webhook`, `GET /webhook`, `PUT /webhook/{id}` (`is_active`, events, url), `DELETE /webhook/{id}`. OWNER/ADMIN write; EDITOR cannot.

### Implications for `build.md`

1. **The docs host is reachable and the API is complete.** §5f's "verify" is done. Provisioning, DNS, credentials, Smartlead export, and webhooks are all first-class.
2. **Export to Smartlead uses the Smartlead UI password**, not the API key. Store that secret in Ironmark next to the API key.
3. **Replacement flow is API-ready in week 1 even if we still click it by hand:** `POST /order` → wait for `order.mailbox.active` → `POST /export` `sequencer=smartlead` → `order.export.completed` → register mailbox ids in Ironmark → attach via Smartlead `POST /campaigns/{id}/email-accounts`.
4. **Do not poll Icemail for health.** Bounce and reputation live in Smartlead. Icemail webhooks cover provision, export, delete, and password rotation.
5. **App password is the SMTP fallback** for a handoff Smartlead will not cc. Pull on demand; do not store unless the fallback fires.

## Open questions the docs still do not settle

These need a live call, not another page:

1. Whether a `cc` on `reply-email-thread` actually delivers and stays in the Smartlead thread (docs say the field exists).
2. Whether `EMAIL_REPLY` payloads in production include `email_stats_id` / `message_id` despite the example omitting them.
3. Exact v1 path for email-level global block list (`/leads/block-list` in the guide vs `/leads/get-domain-block-list` on the legacy reference).
4. Whether Icemail `CUSTOM` SMTP mailboxes are in play; the fleet is Google today.
5. Smartlead plan tier (60 vs 120/min) on this workspace.

## Source pages

- Smartlead intro, rate limits, webhook events, add leads, reply-email-thread, create webhook, block domains: `https://api.smartlead.ai/`
- Full endpoint dump: `https://api.smartlead.ai/llms-full.txt` (retrieved 2026-09-26)
- Icemail OpenAPI 3.0.3 embedded at `https://docs.icemail.ai/` (retrieved 2026-09-26)
