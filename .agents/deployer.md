# Deployer Instructions — Tokenrip

## Build Steps

Run these in order, each as a separate bash call with `timeout_ms: 120000`:

```bash
cd /home/dbot/projects/tokenrip/apps/backend && bun run build
cd /home/dbot/projects/tokenrip/apps/frontend && bun run build
```

## Deploy Command

```bash
pm2 restart tokenrip-backend && pm2 restart tokenrip-frontend
```

Both pm2 processes must be pre-configured. The pm2 ecosystem file is at `/home/dbot/projects/tokenrip/ecosystem.config.cjs` (copied from `ecosystem.config.sample.cjs`).

## Health Check

After deploy, verify the backend is responding:

```bash
curl -sf http://localhost:3434/v0/health
```

Expected: `{"ok":true}` with HTTP 200.

Frontend is served on port 3333.

## Plan Files

Plans land in `tasks/plans/tested/` after the reviewer approves. Move each to `tasks/plans/done/` after a successful deploy.

## Notes

- pm2 process names: `tokenrip-backend` and `tokenrip-frontend`
- If pm2 processes are not running yet, start them first: `pm2 start /home/dbot/projects/tokenrip/ecosystem.config.cjs`
- Build output: backend compiles to `apps/backend/dist/`, frontend to `apps/frontend/.output/`
