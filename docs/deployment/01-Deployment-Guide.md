# Deployment Guide
## BUYSEWA E-commerce Platform

**Version:** 1.0
**Date:** 2024

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Blockchain Deployment](#blockchain-deployment)
7. [Production Configuration](#production-configuration)
8. [Monitoring and Logging](#monitoring-and-logging)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Server Requirements
- **OS:** Ubuntu 20.04 LTS or higher / CentOS 8+
- **RAM:** Minimum 4GB (8GB recommended)
- **CPU:** 2+ cores
- **Storage:** 20GB+ free space
- **Network:** Public IP address, domain name (optional)

### Software Requirements
- Node.js 18+ (LTS version)
- MongoDB 6+
- Nginx (reverse proxy)
- PM2 (process manager)
- Git
- SSL Certificate (Let's Encrypt)

---

## Environment Setup

### 1. Server Initial Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

---

## Database Setup

### 1. MongoDB Configuration

```bash
# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create MongoDB admin user
mongosh
```

```javascript
// In MongoDB shell
use admin
db.createUser({
  user: "admin",
  pwd: "secure_password_here",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})

// Create database user
use buysewa
db.createUser({
  user: "buysewa_user",
  pwd: "secure_password_here",
  roles: [ { role: "readWrite", db: "buysewa" } ]
})
```

### 2. MongoDB Security

Edit `/etc/mongod.conf`:
```yaml
security:
  authorization: enabled

net:
  bindIp: 127.0.0.1  # Only localhost, use firewall for external access
```

Restart MongoDB:
```bash
sudo systemctl restart mongod
```

---

## Backend Deployment

### 1. Clone Repository

```bash
cd /var/www
sudo git clone https://github.com/yourusername/buysewa-platform.git
cd buysewa-platform/review-backend
```

### 2. Install Dependencies

```bash
npm install --production
```

### 3. Environment Configuration

Create `.env` file:
```bash
cp .env.example .env
nano .env
```

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://buysewa_user:password@localhost:27017/buysewa?authSource=buysewa

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRE=24h

# Blockchain
BLOCKCHAIN_NETWORK=http://localhost:8545
CONTRACT_ADDRESS=0xYourContractAddress
PRIVATE_KEY=your_private_key_here

# eSewa
ESEWA_MERCHANT_ID=your_merchant_id
ESEWA_SECRET_KEY=your_secret_key
ESEWA_SUCCESS_URL=https://yourdomain.com/payment/success
ESEWA_FAILURE_URL=https://yourdomain.com/payment/failure

# CORS
FRONTEND_URL=https://yourdomain.com
```

### 4. Start Backend with PM2

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'buysewa-backend',
    script: './server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
}
EOF

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
# Follow the instructions provided
```

---

## Frontend Deployment

### 1. Build Frontend

```bash
cd /var/www/buysewa-platform
npm install
npm run build
```

### 2. Configure Environment

Create `.env.production`:
```env
VITE_API_URL=https://api.yourdomain.com
VITE_BLOCKCHAIN_NETWORK=https://your-blockchain-network
VITE_CONTRACT_ADDRESS=0xYourContractAddress
```

Rebuild:
```bash
npm run build
```

### 3. Nginx Configuration

Create Nginx config:
```bash
sudo nano /etc/nginx/sites-available/buysewa
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Frontend
    root /var/www/buysewa-platform/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/buysewa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Blockchain Deployment

### 1. Deploy Smart Contract

```bash
cd /var/www/buysewa-platform
npx hardhat compile
npx hardhat run scripts/deploy.js --network mainnet
```

Save contract address to `.env`:
```env
CONTRACT_ADDRESS=0xDeployedContractAddress
```

### 2. Verify Contract (Optional)

```bash
npx hardhat verify --network mainnet CONTRACT_ADDRESS
```

---

## Production Configuration

### 1. Firewall Setup

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. MongoDB Backup

Create backup script:
```bash
cat > /usr/local/bin/mongodb-backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
mongodump --out $BACKUP_DIR/backup_$DATE
# Keep only last 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +
EOF

chmod +x /usr/local/bin/mongodb-backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /usr/local/bin/mongodb-backup.sh
```

### 3. Log Rotation

```bash
sudo nano /etc/logrotate.d/buysewa
```

```
/var/www/buysewa-platform/review-backend/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

---

## Monitoring and Logging

### 1. PM2 Monitoring

```bash
# View logs
pm2 logs buysewa-backend

# Monitor resources
pm2 monit

# View status
pm2 status
```

### 2. Application Monitoring

Install monitoring tools:
```bash
npm install -g pm2-logrotate
pm2 install pm2-logrotate
```

### 3. Health Check Endpoint

Add to backend:
```javascript
// routes/health.js
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

---

## Troubleshooting

### Backend Not Starting

```bash
# Check logs
pm2 logs buysewa-backend

# Check MongoDB connection
mongosh "mongodb://buysewa_user:password@localhost:27017/buysewa"

# Check port availability
sudo netstat -tulpn | grep 5000
```

### Frontend Not Loading

```bash
# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check file permissions
sudo chown -R www-data:www-data /var/www/buysewa-platform/dist

# Test Nginx configuration
sudo nginx -t
```

### Database Connection Issues

```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Test connection
mongosh "mongodb://buysewa_user:password@localhost:27017/buysewa"
```

---

## Deployment Checklist

- [ ] Server setup completed
- [ ] MongoDB installed and configured
- [ ] Backend deployed with PM2
- [ ] Frontend built and served via Nginx
- [ ] SSL certificate installed
- [ ] Environment variables configured
- [ ] Firewall configured
- [ ] Backup system setup
- [ ] Monitoring configured
- [ ] Health checks working
- [ ] Domain DNS configured
- [ ] Blockchain contract deployed
- [ ] Payment gateway configured
- [ ] Test all critical flows

---

## Rollback Procedure

### Backend Rollback

```bash
# Stop current version
pm2 stop buysewa-backend

# Revert to previous version
cd /var/www/buysewa-platform/review-backend
git checkout <previous-commit-hash>
npm install --production
pm2 restart buysewa-backend
```

### Frontend Rollback

```bash
# Revert to previous build
cd /var/www/buysewa-platform
git checkout <previous-commit-hash>
npm run build
sudo systemctl reload nginx
```

---

## Post-Deployment Verification

1. **Health Check:**
   ```bash
   curl https://api.yourdomain.com/api/health
   ```

2. **Test Authentication:**
   - Register new user
   - Login
   - Access protected routes

3. **Test Product Flow:**
   - Browse products
   - View product details
   - Add to cart

4. **Test Checkout:**
   - Complete checkout
   - Verify order creation

5. **Test Payment:**
   - Initiate payment
   - Verify callback handling

6. **Test Reviews:**
   - Generate SDC codes
   - Submit verified review

---

**Document Status:** Approved
**Version History:**
- v1.0 (2024) - Initial Deployment Guide

