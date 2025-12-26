# Database Setup Guide for BUYSEWA E-commerce Platform

## Option 1: MongoDB Atlas (Cloud) - Current Configuration
**Status**: ⚠️ Requires internet connection and network access

### Prerequisites:
1. MongoDB Atlas account (already created: buysewa cluster)
2. IP Whitelisting: Add your public IP (currently 103.186.196.241)
3. Network connectivity to MongoDB Atlas servers

### Connection String:
```
MONGODB_URI=mongodb+srv://samirg9860_db_user:uy29dgECpCQMDwT1@buysewa.mongodb.net/buysewa?retryWrites=true&w=majority
```

### Setup Steps:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Login with credentials (samirg9860_db_user)
3. Verify cluster "buysewa" is active
4. Check IP whitelist includes your IP
5. Run: `npm run init:db`

---

## Option 2: Local MongoDB (Recommended for Development)
**Status**: ✅ No internet required, better for testing

### Installation (Ubuntu/Debian):
```bash
# Install MongoDB Community Edition
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod

# Verify installation
mongosh --version
```

### Update .env:
```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/buysewa
```

### Run Database Initialization:
```bash
# Start MongoDB (in separate terminal)
mongod

# In project directory
cd review-backend
npm run init:db
```

---

## Option 3: Docker MongoDB (Easiest Setup)
**Status**: ✅ Isolated, no system-level installation needed

### Start MongoDB container:
```bash
# Pull and run MongoDB in Docker
docker run -d \
  --name buysewa-mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  -v mongodb_data:/data/db \
  mongo:latest

# Verify container is running
docker ps | grep buysewa-mongodb
```

### Update .env:
```env
# For Docker MongoDB
MONGODB_URI=mongodb://admin:admin123@localhost:27017/buysewa?authSource=admin
```

### Run Database Initialization:
```bash
cd review-backend
npm run init:db
```

---

## Database Initialization

Once connected, initialize the database:

```bash
cd review-backend
npm run init:db
```

### What gets created:
- ✅ 4 test users (admin, seller, 2 buyers)
- ✅ 5 sample products with details
- ✅ 2 SDCs (Seller Delivery Centers)
- ✅ 3 sample orders with complete details
- ✅ 2 sample reviews with blockchain hashes

### Test Credentials:
```
Admin:  admin@buysewa.com / Admin@123
Seller: seller1@buysewa.com / Seller@123
Buyer:  buyer1@buysewa.com / Buyer@123
```

---

## Verify Database Connection

### Test via Node.js:
```bash
cd review-backend
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  });
"
```

### Test via MongoDB Shell (if installed):
```bash
mongosh "mongodb+srv://samirg9860_db_user:uy29dgECpCQMDwT1@buysewa.mongodb.net/buysewa"
```

---

## Troubleshooting

### Issue: ENOTFOUND _mongodb._tcp.buysewa.mongodb.net
**Cause**: DNS resolution failure or no internet
**Solutions**:
1. Check internet connectivity: `ping 8.8.8.8`
2. Use local MongoDB (Option 2 or 3)
3. Check DNS settings: `cat /etc/resolv.conf`

### Issue: Authentication failed
**Cause**: Wrong credentials
**Fix**: Verify username and password in .env:
- User: `samirg9860_db_user`
- Pass: `uy29dgECpCQMDwT1`

### Issue: IP not whitelisted
**Cause**: Connection from unauthorized IP
**Fix**: Add IP to MongoDB Atlas whitelist (103.186.196.241 already added)

### Issue: Cluster not active
**Cause**: MongoDB Atlas cluster paused/stopped
**Fix**: Resume cluster in MongoDB Atlas dashboard

---

## Production Deployment

For production, use MongoDB Atlas with:
```env
MONGODB_URI=mongodb+srv://production_user:secure_password@production-cluster.mongodb.net/buysewa?retryWrites=true&w=majority
```

Ensure:
- Strong passwords (minimum 8 characters)
- IP whitelist restricted to known IPs
- VPC peering for secure connections
- Regular backups enabled
- Monitoring and alerting configured
