# Quintel PostgreSQL Backup Runbook

## Quintel Has a Restore-Verified, Six-Hour Database Backup

Quintel's local PostgreSQL database is backed up to the private `backups/` prefix in the configured S3-compatible bucket every six hours. The recovery-point objective is six hours: data committed after the most recent successful dump is not recoverable from this system. A weekly restore test proves that the newest backup can be restored into PostgreSQL.

| Property | Production setting |
|---|---|
| Database | `quintel`, supplied through `QUINTEL_DATABASE` |
| Dump format | PostgreSQL custom format, zstd-compressed |
| Destination | `s3://<S3_BUCKET>/backups/` via DigitalOcean Spaces-compatible S3 |
| Backup schedule | 00:00, 06:00, 12:00, 18:00 Europe/Berlin |
| Retention | Delete backup objects older than seven days |
| Restore validation | Sunday 03:30 Europe/Berlin |
| Failure alert | Resend email to `ADMIN_EMAIL` |

## The Job Produces, Validates, Uploads, Then Retains

The active script is `/usr/local/sbin/quintel-backup`; it is owned by root and executable only by root. Its secrets are in `/etc/quintel/backup.env`, also root-owned and mode `0600`.

For each backup run, the job:

1. Takes a non-blocking `flock` lock. A delayed prior run causes the overlapping invocation to exit safely rather than create concurrent dumps.
2. Creates a timestamped `pg_dump` custom-format dump in `/var/tmp/quintel-backup`.
3. Runs `pg_restore --list` against the dump to reject an unreadable dump before upload.
4. Uploads the dump using `rclone` with the S3 endpoint and access key in `/etc/quintel/backup.env`.
5. Deletes the local temporary dump after a successful upload.
6. Deletes only objects in `backups/` that are older than seven days.
7. Writes a syslog entry with the uploaded object key and SHA-256; any command failure triggers a Resend email alert.

The weekly validation run finds the newest object, downloads it, creates a disposable `quintel_backup_validate_<timestamp>` database as the local `postgres` OS user, restores the dump, executes `SELECT 1`, and drops both the temporary database and local file. No production database data is modified.

## Operations Are Controlled Through `/etc/cron.d`, Not `crontab -e`

View the active schedule:

```bash
sudo cat /etc/cron.d/quintel-backup
```

`crontab -e` edits the current user's personal crontab. It does not show or control this root-owned system schedule.

Run an on-demand backup or restore validation:

```bash
sudo /usr/local/sbin/quintel-backup backup
sudo /usr/local/sbin/quintel-backup restore-test
```

Inspect recent job messages:

```bash
sudo journalctl -t quintel-backup --since '7 days ago'
sudo systemctl status cron
```

Temporarily disable or re-enable scheduled execution:

```bash
sudo mv /etc/cron.d/quintel-backup /etc/cron.d/quintel-backup.disabled
sudo systemctl restart cron

sudo mv /etc/cron.d/quintel-backup.disabled /etc/cron.d/quintel-backup
sudo systemctl restart cron
```

## Recovery and Credential Changes Must Be Deliberate

To recover, preserve the damaged production database until the cause is understood, download a chosen backup from `backups/`, and restore it into a new PostgreSQL database first. Validate that database before any cutover. A safe initial command shape is:

```bash
sudo -u postgres createdb quintel_recovery_candidate
sudo -u postgres pg_restore --dbname=quintel_recovery_candidate /path/to/quintel-<timestamp>.dump
sudo -u postgres psql --dbname=quintel_recovery_candidate --command='SELECT 1'
```

Do not restore directly over the live `quintel` database without an explicit incident decision and a fresh safety copy.

When rotating database, Spaces, or Resend credentials, edit the root-owned runtime file—not a vault file—and immediately run both checks:

```bash
sudoedit /etc/quintel/backup.env
sudo /usr/local/sbin/quintel-backup backup
sudo /usr/local/sbin/quintel-backup restore-test
```

The Spaces credential needs permission to list the bucket prefix and get, put, and delete objects under `backups/`. Keep the bucket/private prefix inaccessible to the public. The `S3_ENDPOINT` must be the S3-compatible endpoint for the configured bucket.

## Temporary Codex Sudo Access Should Be Removed

The temporary rule created for this implementation is `/etc/sudoers.d/dbot-codex-temp`. Remove it once this runbook is handed over:

```bash
sudo rm /etc/sudoers.d/dbot-codex-temp
sudo -k
```

Use `sudo visudo -c` before and after any future manual sudoers change. The backup cron itself runs as root and does not depend on this temporary rule.
