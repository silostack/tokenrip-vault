# bm2/systemd Deployment on `rip` — What's Actually Running and Why It Now Survives Reboot

**Host:** `rip` (user `dbot`) — **staging** since the [host flip](quintel-host-flip-runbook-2026-08-29.md) completed. Confirmed by `.env` on this host: `ALLOWED_ORIGINS=https://test.quintel.ai`.

**Status:** Fixed and verified 2026-09-01. `rip` now survives reboot correctly. This supersedes the flip runbook's "Reboot survivability is currently absent" note **for `rip` only** — see the open item at the bottom for production (`lstage`/utest).

## The setup

Both Quintel and Tokenrip apps on `rip` run under **bm2** (a Bun process manager, distinct from Node's `pm2` — the two are separate binaries on this box: `~/.bun/bin/bm2` vs. `~/.nvm/.../bin/pm2`, easy to confuse when checking status). bm2 itself is supervised by systemd via `/etc/systemd/system/bm2.service` (enabled, `WantedBy=multi-user.target`), which:

- `ExecStart`s the bm2 daemon
- `ExecStartPost`s `bm2 resurrect` to bring up whatever app list is saved in `~/.bm2/dump.json`

At boot, that resurrects 5 processes:

| Port | bm2 name | Script |
|---|---|---|
| 3301 | `de-backend` | `quintel/apps/backend/dist/main.js` |
| 3300 | `de-frontend` | `quintel/apps/frontend/serve.ts` |
| 3434 | `tokenrip-backend` | `tokenrip/apps/backend/dist/main.js` |
| 3333 | `tokenrip-frontend` | `tokenrip/apps/frontend/serve.ts` |
| 3600 | `tokenrip-blog` | `tokenrip/apps/blog/src/serve.ts` |

This is a **later addition than the flip runbook assumed.** The runbook (written 2026-08-29) states bm2 "has no systemd unit at all" and that `dump.json` was stale from 2026-08-12. Both are now false on `rip`: the unit exists and `dump.json` was refreshed 2026-08-30. Someone (Simon) added `bm2.service` intending exactly the reboot-survivability fix the runbook flagged — but the unit shipped with a startup race, below.

## The bug: a race made bm2's own status reporting lie

`ExecStartPost=bm2 resurrect` fired immediately after `ExecStart`, with no wait for the daemon to finish initializing (`Type=simple` gives no readiness signal). If `resurrect`'s client couldn't connect to the daemon's still-initializing Unix socket in time, bm2's own fallback logic in `resurrect` made it **spawn a second daemon process itself** rather than fail. Both daemons briefly raced to bind `~/.bm2/daemon.sock`; one won and correctly parented the 5 real app processes, the other survived as an orphaned zombie daemon holding a dead socket fd.

Net effect: the apps were genuinely running and listening — but `bm2 list` / `bm2 status` reported them `stopped`/`errored` with no pid, because the CLI's query could land on whichever daemon was live at that moment and its bookkeeping had desynced during the race. This is what looked like "these bun processes aren't part of bm2" — they were, the status reporting was just corrupted by the dual-daemon race.

**Symptom to watch for:** `pgrep -af 'bm2/src/daemon.ts'` returning more than one process. There should only ever be one.

## The fix

`/etc/systemd/system/bm2.service`'s `ExecStartPost` now waits for the daemon socket to actually accept a `daemon status` call (polling every 0.2s, up to 10s) before running `resurrect`:

```
ExecStartPost=/bin/bash -c 'for i in $(seq 1 50); do [ -S "$BM2_HOME/daemon.sock" ] && /home/dbot/.bun/bin/bun run /home/dbot/.bun/install/global/node_modules/bm2/src/index.ts daemon status >/dev/null 2>&1 && break; sleep 0.2; done; exec /home/dbot/.bun/bin/bun run /home/dbot/.bun/install/global/node_modules/bm2/src/index.ts resurrect'
```

Previous unit backed up alongside it as `bm2.service.bak-<timestamp>`. Verified via `sudo systemctl restart bm2`: exactly one daemon process afterward, all 5 apps `● online` in `bm2 list` with correct pids/uptime matching `ps`, ExecStartPost exited `0/SUCCESS`.

## Open item — check production (`lstage`/utest) for the same issue

The flip runbook's own reboot-survivability fix for the newly-promoted production host was `bm2 save && bm2 startup install` on utest (step under "Reboot survivability" in the flip runbook), which is bm2's own PM2-style unit generator — **a different code path than the hand-written `bm2.service` on `rip`.** It's unknown whether `bm2 startup install`'s generated unit has the same `ExecStartPost` race, a different one, or none. This has not been checked yet. See the companion diagnostic checklist for what to look for there.
