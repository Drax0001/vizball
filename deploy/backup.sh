#!/bin/bash
# Daily backup of the Vizball SQLite database and uploaded files.
# Uses sqlite3's own online-backup command rather than copying vizball.db
# directly — the live database runs in WAL mode, so a raw file copy can
# miss recent writes sitting in the companion -wal file.
#
# Usage: run once by hand to confirm it works, then schedule via cron
# (see DEPLOYMENT.md's "Backups" section).

set -e

DATE=$(date +%F)
DEST=/var/backups/vizball
DB=/var/www/vizball/server/vizball.db

mkdir -p "$DEST"
sqlite3 "$DB" ".backup '$DEST/vizball-$DATE.db'"
tar czf "$DEST/uploads-$DATE.tar.gz" -C /var/www/vizball/server uploads

# keep the last 14 days locally — copy $DEST offsite separately for real
# disaster recovery (see DEPLOYMENT.md)
find "$DEST" -type f -mtime +14 -delete
