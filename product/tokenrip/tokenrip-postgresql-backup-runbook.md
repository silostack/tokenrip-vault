# Tokenrip PostgreSQL Backup Runbook

## Tokenrip Has a Restore-Verified, Twelve-Hour Database Backup

Tokenrip's local PostgreSQL database is backed up to the private `backups/` prefix in the `tokenrip-backups` bucket every twelve hours. The recovery-point objective is twelve hours: data committed after the most recent successful dump is not recoverable from this system. A weekly isolated restore test verifies that the newest backup can be restored into PostgreSQL.

| Property | Production setting |
|---|---|
| Database | `tokenrip`, supplied through `TOKENRIP_DATABASE` |
| Dump format | PostgreSQL custom format, zstd-compressed |
| Destination | `s3://tokenrip-backups/backups/` via DigitalOcean Spaces-compatible S3 |
| Backup schedule | 00:00 and 12:00 Europe/Berlin |
| Retention | Delete backup objects older than seven days |
| Restore validation | Sunday 04:00 Europe/Berlin |
| Failure alert | Resend email to `ADMIN_EMAIL` |

## The Job Separates Tokenrip Data From Shared Delivery Credentials

The active script is `/usr/local/sbin/tokenrip-backup`; it is root-owned and mode `0700`. Tokenrip-specific configuration is `/etc/tokenrip/backup.env`, root-owned and mode `0600`; it contains `TOKENRIP_DATABASE` and the `tokenrip-backups` bucket name.

The job is self-contained: `/etc/tokenrip/backup.env` holds the DigitalOcean Spaces and Resend delivery settings alongside `TOKENRIP_DATABASE` and the bucket name. It no longer sources `/etc/quintel/backup.env`. That shared-credential coupling was removed on 2026-08-29 when Quintel moved to its own host; rotating Tokenrip's credentials is now a Tokenrip-only change requiring no Quintel validation.

For each backup run, the job:

1. Acquires a non-blocking `flock` lock so overlapping runs cannot generate concurrent dumps.
2. Creates a timestamped custom-format `pg_dump` in `/var/tmp/tokenrip-backup`.
3. Runs `pg_restore --list` against the local dump before upload.
4. Uploads with `rclone` to `tokenrip-backups/backups/`.
5. Removes the local temporary dump after a successful upload, then deletes only objects in that prefix older than seven days.
6. Logs the uploaded object key and SHA-256 to syslog; any failure sends a Resend alert.

The weekly test downloads the newest backup, restores it into a disposable `tokenrip_backup_validate_<timestamp>` database as the local `postgres` OS user, executes `SELECT 1`, and drops both the database and downloaded file. It does not modify the live Tokenrip database.

## Operations Are Controlled Through `/etc/cron.d`, Not `crontab -e`

View the schedule:

```bash
sudo cat /etc/cron.d/tokenrip-backup
```

`crontab -e` changes the current user's crontab; it does not control this root-owned system job.

Run an on-demand backup or validation:

```bash
sudo /usr/local/sbin/tokenrip-backup backup
sudo /usr/local/sbin/tokenrip-backup restore-test
```

Inspect recent job messages:

```bash
sudo journalctl -t tokenrip-backup --since '7 days ago'
sudo systemctl status cron
```

Disable or re-enable the schedule:

```bash
sudo mv /etc/cron.d/tokenrip-backup /etc/cron.d/tokenrip-backup.disabled
sudo systemctl restart cron

sudo mv /etc/cron.d/tokenrip-backup.disabled /etc/cron.d/tokenrip-backup
sudo systemctl restart cron
```

## Recovery Must Begin in a New Database

Preserve the affected production database until the incident is understood. Download the chosen dump from `backups/`, restore it into a new database, validate it, and make an explicit cutover decision only then:

```bash
sudo -u postgres createdb tokenrip_recovery_candidate
sudo -u postgres pg_restore --dbname=tokenrip_recovery_candidate /path/to/tokenrip-<timestamp>.dump
sudo -u postgres psql --dbname=tokenrip_recovery_candidate --command='SELECT 1'
```

Do not restore directly over live `tokenrip` without an explicit incident decision and a fresh safety copy.

When rotating Tokenrip's database credentials or bucket configuration, use:

```bash
sudoedit /etc/tokenrip/backup.env
sudo /usr/local/sbin/tokenrip-backup backup
sudo /usr/local/sbin/tokenrip-backup restore-test
```

The same two commands cover Spaces and Resend credential rotation, since those settings now live in the same file. Quintel runs its own independent job on its own host; no cross-product validation is required.
