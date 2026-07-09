# Per-College Backup (R2)

Backup logic lives at **top level** (`/opt/ems/backup/`) so it is central and easy to maintain. Backups are **per college** and **smart**:

- **What:** `pg_dump` from each college’s Postgres container → gzip → upload to R2.
- **Paths:** `s3://<bucket>/postgres/<college_id>/daily/` and `.../weekly/` (weekly only on Sundays).
- **Retention:** 28 daily + 4 weekly per college (enforced by `backup-cleanup.sh`).
- **Env:** `/opt/ems/.env` must define `R2_BACKUP_*` (bucket, endpoint, keys).

**Cron (deploy user):**

```cron
0 */6 * * * /opt/ems/backup/backup.sh >> /var/log/ems-backup.log 2>&1
0 4 * * 0   /opt/ems/backup/backup-cleanup.sh >> /var/log/ems-backup-cleanup.log 2>&1
```

Scripts source `/opt/ems/.env` and iterate `/opt/ems/colleges/*/` (only directories with a `.env` file are backed up).
