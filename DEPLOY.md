# Deploying on the Hetzner VPS

This deploys the full stack (Next.js app + Postgres) in Docker. The site
joins the **shared Caddy** already running on this box (see
`server-infra/README.md`) — it does NOT run its own Caddy, since only one
process can own ports 80/443 per server.

```
Internet ──► shared Caddy (server-infra) ──► web (Next.js) ──► postgres
```

Postgres is **not exposed publicly** — it's bound to `127.0.0.1` inside the
server, reachable only from `web` over the private Docker network, or via SSH
tunnel for manual access (see `MIGRATE_DB.md`).

## 1. Point your domain at the server

DNS **A record**: `yourdomain.com → <server IP>`. Wait for it to resolve.

## 2. Get the code + configure

```bash
ssh root@<server-ip>
git clone <this-repo-url> portfolio
cd portfolio
cp .env.prod.example .env.prod
```

Fill in `.env.prod`:
- `POSTGRES_PASSWORD` — long random string.
- `ADMIN_EMAIL` — kept from the old Supabase setup.
- `ADMIN_PASSWORD_HASH` — generate once:
  ```bash
  node -e "require('bcryptjs').hash(process.argv[1], 10).then(console.log)" 'your-password'
  ```
- `SESSION_SECRET` — generate once:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `DOMAIN` isn't used on this path (the shared Caddy owns routing) — leave
  the default.

## 3. Launch on the shared proxy network

```bash
docker network create proxy 2>/dev/null || true   # already exists if tg-discovery is deployed
docker compose -f docker-compose.yml -f docker-compose.shared.yml \
    --env-file .env.prod up -d --build --scale caddy=0
```

`--scale caddy=0` skips this project's bundled Caddy; the shared one handles
HTTPS and routing.

## 4. Add the routing block

In `server-infra/Caddyfile`, add:

```caddy
yourdomain.com {
	encode gzip
	reverse_proxy portfolio-web:3000
}
```

Then reload (zero-downtime for other sites on the box):

```bash
cd ../server-infra
docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile
```

Caddy fetches an HTTPS cert for the new domain on first request (~30s).

## 5. Database

The dockerized Postgres applies every file in `migrations/` automatically on
its first start — a fresh deploy needs no manual migration step.

**Moving existing data from Supabase?** Follow `MIGRATE_DB.md` before step 3
above (bring up only `postgres`, restore the dump, then continue).

## 6. Done

Visit `https://yourdomain.com`. Log in at `/admin/login` with `ADMIN_EMAIL`
and the password you hashed into `ADMIN_PASSWORD_HASH`.

**Back up the database** — see `MIGRATE_DB.md` for the `scripts/backup.sh`
cron setup.

## Updating the deployment

```bash
git pull
docker compose -f docker-compose.yml -f docker-compose.shared.yml \
    --env-file .env.prod up -d --build --scale caddy=0
```

For a near-zero-downtime swap, build first, then replace only `web`:

```bash
docker compose -f docker-compose.yml -f docker-compose.shared.yml \
    --env-file .env.prod build web
docker compose -f docker-compose.yml -f docker-compose.shared.yml \
    --env-file .env.prod up -d --no-deps web
```

## Standalone deploy (no shared Caddy)

If deploying this on its own VPS instead, skip the shared-network steps and
just run:

```bash
docker compose --env-file .env.prod up -d --build
```

This uses the bundled `caddy` service and the project's own `Caddyfile`
(`DOMAIN` in `.env.prod` matters on this path).
