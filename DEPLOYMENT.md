# Deploying Vizball Play Pro to a Hostinger VPS

This is a step-by-step guide to get this app running in production on a fresh Hostinger VPS (Ubuntu). It assumes no prior server setup — if some steps are already done on your VPS (a user account, a firewall, Nginx), skip ahead.

## Architecture

One VPS, one domain, three moving parts:

```
Browser ──HTTPS──▶ Nginx (port 443)
                     ├─ serves the built React app (dist/) as static files
                     ├─ proxies /api/*      ──▶ Bun backend on 127.0.0.1:5000
                     └─ proxies /uploads/*  ──▶ Bun backend on 127.0.0.1:5000

Bun backend (systemd-managed) ──▶ SQLite file on local disk
```

The backend only listens on `127.0.0.1` (loopback) — it's never reachable directly from the internet, only through Nginx. Nginx terminates HTTPS and serves the frontend. systemd keeps the backend running and restarts it if it crashes or the VPS reboots.

## Prerequisites

- A Hostinger VPS (Ubuntu 22.04 or 24.04 recommended), with root or sudo SSH access.
- A domain name with its DNS **A record** pointed at the VPS's IP address (do this first — DNS propagation can take a while, and you'll need it working before the HTTPS step).
- This codebase pushed to a git remote (GitHub/GitLab) — recommended so future updates are a `git pull` away. If you'd rather not use git, step 3 has an `rsync` alternative.

---

## Step 1 — Initial server setup

SSH into the VPS as root, then:

```bash
apt update && apt upgrade -y

# Create a non-root user to run everything as (never deploy as root)
adduser deploy
usermod -aG sudo deploy
su - deploy
```

From here on, run commands as `deploy`, not root.

```bash
# Firewall: only SSH, HTTP, HTTPS ever need to be open
sudo apt install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

Port 5000 (the backend) is intentionally **not** opened — it's only reachable from Nginx on the same machine.

## Step 2 — Install runtimes

```bash
# Node.js + npm (to build the frontend)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Bun (to run the backend)
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc   # picks up bun on PATH
bun --version      # sanity check

# Nginx
sudo apt install -y nginx

# sqlite3 CLI — not needed to run the app (Bun has its own SQLite bindings
# built in), only used later for safe database backups (see "Backups" below)
sudo apt install -y sqlite3
```

## Step 3 — Get the code onto the VPS

**Option A — git (recommended):**

```bash
sudo mkdir -p /var/www/vizball
sudo chown deploy:deploy /var/www/vizball
git clone <your-repo-url> /var/www/vizball
cd /var/www/vizball
```

**Option B — rsync from your machine** (run this from your local machine, not the VPS):

```bash
rsync -avz --exclude node_modules --exclude dist --exclude server/node_modules \
  --exclude server/vizball.db --exclude server/uploads \
  ./ deploy@YOUR_VPS_IP:/var/www/vizball/
```

Either way, end up with the project at `/var/www/vizball` on the VPS.

## Step 4 — Configure and start the backend

```bash
cd /var/www/vizball/server
cp .env.example .env
nano .env
```

Fill in `.env` for production:

```
PORT=5000
HOST=127.0.0.1
JWT_SECRET=<generate a long random string — see below>
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://YOUR_DOMAIN,https://www.YOUR_DOMAIN
DB_PATH=/var/www/vizball/server/vizball.db
UPLOAD_DIR=/var/www/vizball/server/uploads
```

Generate a real `JWT_SECRET` (don't ship the placeholder):

```bash
openssl rand -base64 48
```

Use **absolute paths** for `DB_PATH`/`UPLOAD_DIR` as shown above — this avoids any ambiguity about the working directory systemd starts the process from.

### About the database

The whole app runs on a single SQLite file (`server/vizball.db`), read via Bun's built-in `bun:sqlite` — no separate database server to install, configure, or secure. That's a deliberate choice for a single-VPS deployment at this project's traffic scale, not a stopgap: SQLite in WAL mode (enabled in `server/db.ts`) handles many concurrent readers plus one writer fine for a content site like this. It would stop being the right choice if this ever grew into a multi-server deployment (see "Deliberately out of scope" at the end).

Two things this means in practice:

- **Schema changes are automatic.** `server/db.ts` runs its migration logic (`ensureColumn`, table creation) every time the backend starts. When you `git pull` a future update that changes the schema, a plain `sudo systemctl restart vizball-backend` is enough — there's no separate migration command to remember.
- **WAL mode means the live `vizball.db` file alone is not a safe copy-paste backup.** Recent writes can sit in a companion `vizball.db-wal` file until SQLite checkpoints them into the main file. A raw `cp`/`tar` of `vizball.db` while the server is running can silently miss recent data. Use the `sqlite3 .backup` command shown below instead — it uses SQLite's own online-backup mechanism and is always consistent, even against a live writer.

Install dependencies and do a one-off manual start to confirm it boots (this also creates and seeds `vizball.db` on first run):

```bash
bun install
bun run index.ts
# Expect: [Vizball Pro Server] Listening on http://127.0.0.1:5000
# Ctrl+C once you've confirmed it starts cleanly
```

Now set it up as a systemd service so it survives reboots and crashes. A template is provided at `deploy/vizball-backend.service` in this repo:

```bash
which bun   # note this path, e.g. /home/deploy/.bun/bin/bun

sudo cp /var/www/vizball/deploy/vizball-backend.service /etc/systemd/system/vizball-backend.service
sudo nano /etc/systemd/system/vizball-backend.service
# Update ExecStart to the exact `which bun` path, and confirm
# WorkingDirectory/User match your setup.

sudo systemctl daemon-reload
sudo systemctl enable --now vizball-backend
sudo systemctl status vizball-backend   # should show "active (running)"

curl http://127.0.0.1:5000/api/visitors   # should return {"count":...}
```

## Step 5 — Build the frontend

```bash
cd /var/www/vizball
npm install
npm run build
```

This produces `/var/www/vizball/dist` — the exact folder Nginx will serve (see the config template).

## Step 6 — Configure Nginx

A template is provided at `deploy/nginx.vizball.conf`:

```bash
sudo cp /var/www/vizball/deploy/nginx.vizball.conf /etc/nginx/sites-available/vizball
sudo nano /etc/nginx/sites-available/vizball
# Replace YOUR_DOMAIN with your actual domain (two occurrences).
# Confirm the `root` path matches /var/www/vizball/dist.

sudo ln -s /etc/nginx/sites-available/vizball /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default   # remove the placeholder default site
sudo nginx -t                                  # validate config syntax
sudo systemctl reload nginx
```

At this point, visiting `http://YOUR_DOMAIN` should load the site over plain HTTP.

## Step 7 — HTTPS

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d YOUR_DOMAIN -d www.YOUR_DOMAIN
```

Certbot edits the Nginx config in place to add the certificate and an automatic HTTP→HTTPS redirect, and sets up auto-renewal. Confirm renewal works:

```bash
sudo certbot renew --dry-run
```

## Step 8 — Post-deploy checklist

- **Change the default admin password immediately.** The seeded admin account (`server/seedData.ts`) ships with a known default password meant only for local development — log into `/admin` once and change it (or update the seed and re-seed before going live, since the account only gets created on an empty database).
- Verify key routes: `/`, `/actualites`, `/tutoriels`, `/le-sport`, `/boutique`, `/forum`, `/gouvernance`, `/admin`.
- Log into `/admin` and confirm you can create/edit an article, product, tutorial — and that an uploaded image/PDF actually appears (this exercises the full Nginx → backend → `uploads/` disk path).
- Submit a rating on an article and a tutorial from a normal (non-admin) browser session, and confirm the average updates.
- Check `sudo systemctl status vizball-backend` is `active` and `sudo journalctl -u vizball-backend -n 50` shows no errors.

## Ongoing maintenance

**Deploying an update:**

```bash
cd /var/www/vizball
git pull                          # or re-run rsync
npm install && npm run build      # rebuild frontend
cd server && bun install          # in case backend deps changed
sudo systemctl restart vizball-backend
```

No Nginx reload needed unless you changed `deploy/nginx.vizball.conf` itself.

**Backups** — the only state that matters is the SQLite database and the uploaded files. The database needs SQLite's own safe backup mechanism (see "About the database" above) rather than a raw file copy; a plain `tar`/`cp` of the uploads directory is fine since those are just static files.

A backup script is provided at `deploy/backup.sh` — it uses `sqlite3 .backup` for the database (safe against a live writer) and a plain `tar` for the uploads folder:

```bash
sudo mkdir -p /var/backups/vizball
sudo chown deploy:deploy /var/backups/vizball
chmod +x /var/www/vizball/deploy/backup.sh
/var/www/vizball/deploy/backup.sh   # run once by hand to confirm it works
ls /var/backups/vizball              # should show a .db and a .tar.gz
```

Schedule it daily:

```bash
crontab -e
# add this line:
0 3 * * * /var/www/vizball/deploy/backup.sh
```

This keeps 14 days of backups **on the same VPS**, which protects against bad deploys or accidental data loss but not against losing the whole VPS — periodically copy `/var/backups/vizball` somewhere else too (`scp` to your machine, or Hostinger's own VPS snapshot/backup feature from its control panel).

**Restoring a backup:**

```bash
sudo systemctl stop vizball-backend
cp /var/backups/vizball/vizball-2026-07-01.db /var/www/vizball/server/vizball.db
rm -f /var/www/vizball/server/vizball.db-wal /var/www/vizball/server/vizball.db-shm
tar xzf /var/backups/vizball/uploads-2026-07-01.tar.gz -C /var/www/vizball/server
sudo systemctl start vizball-backend
```

**Logs:**

```bash
sudo journalctl -u vizball-backend -f     # backend logs, live
sudo tail -f /var/log/nginx/error.log     # Nginx errors
```

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `502 Bad Gateway` from Nginx | Backend isn't running — check `systemctl status vizball-backend` and `journalctl -u vizball-backend` |
| Backend won't start, exits immediately | `JWT_SECRET` missing from `.env` (the server intentionally refuses to boot without one) |
| Site loads but `/admin` login or any `/api/*` call fails with a network error | Check the Nginx `location /api/` block is present and `proxy_pass` points at `127.0.0.1:5000` |
| Uploaded images/PDFs 404 after upload | `UPLOAD_DIR` in `.env` doesn't match where Nginx's `/uploads/` block proxies to, or permissions on that directory are wrong for the `deploy` user |
| Visiting `/tutoriels` directly (not via in-app navigation) gives an Nginx 404 | The `try_files $uri $uri/ /index.html;` fallback is missing from the Nginx config — this is what makes client-side routing work on a hard refresh |
| Browser console shows CORS errors | `CORS_ORIGIN` in `.env` doesn't match the domain you're actually visiting (include both the bare domain and `www.` if you use both) |

## Deliberately out of scope

- **Stripe/payments** — not wired up anywhere in this codebase (a prior, explicit decision); the shop checkout flow collects orders via a contact form, not a payment gateway.
- **Multi-server/load-balanced deployment** — this guide is for a single VPS. SQLite and local-disk uploads don't support multiple app servers without extra work (a shared filesystem or moving to a client-server database); not needed at this project's current scale.
