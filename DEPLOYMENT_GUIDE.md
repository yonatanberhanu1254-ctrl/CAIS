# CAIS Production Deployment Guide

This document outlines the standard operating procedure (SOP) for deploying CAIS to a Linux (Ubuntu) server environment.

## 1. Server Provisioning & Linux Setup

1. **Update Ubuntu packages:**
   ```bash
   sudo apt-update && sudo apt upgrade -y
   ```
2. **Install Node.js 18.x LTS:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-install -y nodejs
   ```
3. **Install Docker & Docker Compose:**
   ```bash
   sudo apt install docker.io docker-compose -y
   sudo systemctl enable docker
   sudo systemctl start docker
   ```

## 2. Code Distribution & Environment Variables

1. Clone or `scp` the repository onto the production server (e.g. `/var/www/cais`).
2. Copy the `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. **Critically Update Environment Keys:**
   - Change `JWT_SECRET` to a deeply randomized hash.
   - Assign real, complex `DB_PASSWORD` and `DB_ROOT_PASSWORD` parameters.
   - Set `NODE_ENV=production`.

## 3. Docker Deployment (Primary Choice)

The Dockerized deployment isolates dependencies, automatically stands up MySQL, and mounts persistent volumes.
```bash
docker-compose up -d --build
```
*To view live daemon logs:*
```bash
docker-compose logs -f cais_app
```

## 4. PM2 Deployment (Alternative / Bare-Metal)

If choosing to avoid Docker for the Node layer:
1. Install PM2: `sudo npm install -g pm2`
2. Install App deps: `npm ci --production`
3. Launch cluster: `pm2 start ecosystem.config.js --env production`
4. Hook PM2 to startup: `pm2 startup ubuntu` and `pm2 save`

## 5. NGINX Reverse Proxy Configuration

1. Install Nginx: `sudo apt install nginx -y`
2. Copy the provided configuration:
   ```bash
   sudo cp nginx.conf /etc/nginx/nginx.conf
   ```
3. Restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

## 6. SSL / HTTPS Setup

In government contexts, unencrypted traffic is forbidden.
1. Install Certbot: `sudo apt install certbot python3-certbot-nginx -y`
2. Request Certificate:
   ```bash
   sudo certbot --nginx -d api.cais.gov
   ```
3. Certbot will automatically append port 443 listeners and redirect port 80 traffic inside the Nginx config.

## 7. Firewall (UFW)

Lock down external access strictly to Nginx and SSH.
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 8. Backup & Restore Strategy

**Database Backups:**
Establish a CRON job to automatically dump the MySQL database every 24 hours.
```bash
docker exec cais_database /usr/bin/mysqldump -u cais_user --password=secret cais_db > backup_$(date +%F).sql
```
**File System Backups:**
Zip the persistent volumes holding images.
```bash
tar -czvf cais_uploads_backup_$(date +%F).tar.gz /var/lib/docker/volumes/cais_persistent_uploads/_data
```

## 9. Logging & Monitoring

- **PM2**: Monitors memory inflation. Use `pm2 monit` to visualize RAM/CPU.
- **Docker**: Logs are captured via `docker logs cais_api_server`.
- **System**: Track endpoints via the built in Nginx `access.log`.
