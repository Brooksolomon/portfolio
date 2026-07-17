#!/usr/bin/env bash
# Dump the dockerized Postgres to a timestamped file in ./backups.
# Run on the server:  ./scripts/backup.sh
# Schedule it with cron for nightly backups (see DEPLOY.md).
set -euo pipefail

cd "$(dirname "$0")/.."

# Load POSTGRES_* from .env.prod
set -a; source .env.prod; set +a
USER="${POSTGRES_USER:-portfolio}"
DB="${POSTGRES_DB:-portfolio}"

mkdir -p backups
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="backups/${DB}-${STAMP}.sql.gz"

echo "dumping $DB -> $OUT"
docker compose exec -T postgres pg_dump -U "$USER" "$DB" | gzip > "$OUT"
echo "done: $OUT"

# Keep only the 14 most recent backups.
ls -1t backups/*.sql.gz | tail -n +15 | xargs -r rm --
