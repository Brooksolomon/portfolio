#!/usr/bin/env bash
# Restore a dump into the dockerized Postgres.
#   ./scripts/restore.sh backups/portfolio-20260101-120000.sql.gz
# Accepts plain .sql or .sql.gz.
set -euo pipefail

cd "$(dirname "$0")/.."
FILE="${1:?usage: restore.sh <dump.sql[.gz]>}"

set -a; source .env.prod; set +a
USER="${POSTGRES_USER:-portfolio}"
DB="${POSTGRES_DB:-portfolio}"

echo "restoring $FILE -> $DB"
if [[ "$FILE" == *.gz ]]; then
  gunzip -c "$FILE" | docker compose exec -T postgres psql -U "$USER" -d "$DB"
else
  docker compose exec -T postgres psql -U "$USER" -d "$DB" < "$FILE"
fi
echo "done"
