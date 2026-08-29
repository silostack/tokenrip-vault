# Quintel Host Flip Runbook — `rip` → `lstage` (utest)

**Purpose.** Promote `utest` (`lstage`, 104.236.118.226, user `si`) from staging to production for Quintel, and demote the current production box (`rip`, user `dbot`) to staging. Tokenrip stays on `rip` and is out of scope.

**Status as of 2026-08-29 17:05 UTC:** prep complete, flip not started. Quintel still serves production from `rip`.

## The flip has five layers, not two

Copying `.env` files is necessary but not sufficient. Each layer below must move, and three of them are easy to miss.

| Layer | Action | Missed-step symptom |
|---|---|---|
| Env files | Swap `apps/backend/.env` and `apps/frontend/.env` between hosts | — |
| **Frontend build** | **Rebuild the client on utest after the env swap** | Production shows `test.quintel.ai` terms/privacy links and no Google Analytics |
| App processes | Stop `bm2` apps on `rip`; start them on `lstage` | Two hosts running at production send caps simultaneously |
| nginx | Swap `server_name` between the two hosts' site files | Origin returns the wrong vhost after DNS moves |
| Cloudflare DNS | Repoint `quintel.ai` → `lstage`, `test.quintel.ai` → `rip` | — |
| Backup cron | Enable on `lstage`, remove from `rip` | Both hosts write to `s3://quintel/backups/`; 7-day retention prunes a shared pool |

`VITE_*` variables are baked at build time, not read at runtime. This is confirmed: `test.quintel.ai` is currently compiled into `apps/frontend/dist/client/assets/account-B5G-WpB_.js` on utest.

## Completed prep (non-destructive, already done)

1. `.env.original` copies created on both hosts for backend and frontend. Covered by the existing `.env.*` gitignore rule.
2. `rclone` 1.60.1 installed on utest — matches `rip`.
3. `/usr/local/sbin/quintel-backup` copied to utest byte-identical (md5 `9006dfc7…`), root-owned, mode `0700`.
4. `/etc/quintel/backup.env` created on utest, mode `0600`, duplicate `S3_ENDPOINT` line removed.
5. `/etc/cron.d/quintel-backup.disabled` staged on utest — **inert**, cron ignores dotted filenames.
6. Backup toolchain verified on utest: `pg_dump` with zstd against the local `quintel` DB, Spaces credential read, and a full `restore-test` that restored the live production dump `backups/quintel-20260829T160001Z.dump` into a disposable database and passed.
7. **Tokenrip decoupled on `rip`.** `/etc/tokenrip/backup.env` is now self-contained; `/usr/local/sbin/tokenrip-backup` no longer sources `/etc/quintel/backup.env`. Originals preserved as `.original`. Verified by a full `backup` + `restore-test` cycle. `/etc/quintel/` on `rip` is now unreferenced and can be deleted at cleanup.

## Open blocker: database staleness

utest's newest local data is the `quintel-prod-20260828T153645Z.dump` snapshot (2026-08-28 15:36). `rip` has served production continuously since. Flipping DNS without a fresh data sync silently discards every write in that window, and is not undone by flipping back — the two databases diverge from the moment both have taken writes.

Resolve before executing the flip. Either take a fresh dump at the cutover point, or accept the loss explicitly.

## Cutover sequence

Run in order. Steps 1–3 begin the outage.

1. **Freeze.** On `rip`: `bm2 stop de-backend de-frontend`. Production is now down; nginx returns 502.
2. **Retire the backup job on `rip`.** `sudo rm /etc/cron.d/quintel-backup && sudo systemctl restart cron`. Do this before utest's job is enabled so the shared prefix never has two writers.
3. **Sync data** (pending the decision above). Per the backup runbook's rule, restore into a new database on utest first, validate, then swap — do not restore over the live `quintel` DB without a safety copy.
4. **Swap env files.** `rip` receives utest's staging `.env`; utest receives `rip`'s production `.env`. Straight file copies — the differing keys are the staging guardrails and the semantics are correct on both sides after the swap:
   - `MARKET_POLL_ENABLED` absent on production (code treats `!== '0'` as live); `=0` on staging.
   - `PROSPECT_SEND_DAILY_CAP` 50 / 2, `SAMGOV_MAX_PAGES` 8 / 2, `SAMGOV_MAX_DESCRIPTIONS` 40 / 5.
   - `PUBLIC_BASE_URL` and `ALLOWED_ORIGINS` follow the domain.
   - `APOLLO_PHONE_WEBHOOK_URL` / `_SECRET` exist only on production and must land on utest, or the inbound Apollo webhook 401s. The URL targets `https://quintel.ai/...`, so it keeps working once DNS moves.
5. **Rebuild the frontend on utest** so `VITE_GA_ID`, `VITE_TERMS_URL`, and `VITE_PRIVACY_URL` reflect production.
6. **Swap nginx `server_name`.** utest's site becomes `quintel.ai` (plus `www`); `rip`'s becomes `test.quintel.ai`. The Cloudflare Origin certificate on utest is wildcard `*.quintel.ai` valid to 2041, so no certificate work is needed on either side.
7. **Start the apps on utest.** `bm2` is installed at `~/.bun/bin/bm2` but is not on `PATH` even in a login shell — invoke by full path or fix `PATH` first. Use the existing `ecosystem.config.cjs`.
8. **Enable the backup job on utest.** `sudo mv /etc/cron.d/quintel-backup.disabled /etc/cron.d/quintel-backup && sudo systemctl restart cron`, then run one manual `sudo /usr/local/sbin/quintel-backup backup` to seed the first production backup from the new host.
9. **Flip Cloudflare DNS.** `quintel.ai` → utest, `test.quintel.ai` → `rip`.
10. **Verify.** Load `quintel.ai`, confirm terms/privacy links point at the production domain, confirm Google Analytics fires, exercise the Apollo webhook, and confirm `journalctl -t quintel-backup` on utest logs a successful upload.

## Reboot survivability is currently absent — fix during the flip

Neither Quintel nor Tokenrip survives a reboot on `rip` today. The enabled `pm2-dbot.service` resurrects Node PM2's list, which contains only `spicy-backend` and `spicy-frontend`. The Quintel and Tokenrip processes run under `bm2` (a separate Bun process manager) whose `~/.bm2/dump.json` is stale (2026-08-12) and which has no systemd unit at all.

Production must not inherit this. On utest, after step 7: `bm2 save` then `bm2 startup install`, and confirm the generated unit is enabled. Worth fixing on `rip` for Tokenrip independently.

## Cleanup after a verified flip

- Delete `/etc/quintel/` on `rip` (now unreferenced — Tokenrip is decoupled and verified).
- Remove `~/tokenrip-vault/utest.password`. It is a plaintext sudo password in the vault working tree, untracked but one `git add -A` from being committed.
- Decide whether staging on `rip` needs its own backups. Current decision: no — the job is retired there rather than repointed.
- Remove the `.env.original` files once the new configuration has been stable for a few days.
