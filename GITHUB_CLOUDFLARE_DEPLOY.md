# Lone Crafts - GitHub & Cloudflare Deployment

## 🐙 Step 1: GitHub Setup

### Create Repository

1. Go to https://github.com/new
2. Fill in details:
   - **Repository name:** `lonecrafts`
   - **Description:** Cloudflare-based e-commerce and business management system
   - **Public/Private:** Private (recommended)
   - **Initialize:** NO (we have our own files)

3. Click "Create repository"

### Push Code to GitHub

```bash
cd c:\Users\Dell\lonecrafts

# Initialize if not already done
git init
git add .
git commit -m "Initial commit: Lone Crafts e-commerce system"
git branch -M main

# Add remote (replace with your repo URL)
git remote add origin https://github.com/salone1/lonecrafts.git

# Push to GitHub
git push -u origin main
```

### Verify on GitHub

1. Go to https://github.com/salone1/lonecrafts
2. Verify:
   - ✅ All 50 files visible
   - ✅ packages/ folder structure correct
   - ✅ Documentation files present
   - ✅ All source code visible

---

## ☁️ Step 2: Cloudflare Setup

### Prerequisites
- [ ] Cloudflare account (free tier): https://dash.cloudflare.com/
- [ ] Cloudflare API token: https://dash.cloudflare.com/profile/api-tokens

### Step 2.1: Create D1 Database

```bash
# Install/update Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create database
wrangler d1 create lonecrafts-db
```

**Save the output!** You'll need the database ID.

### Step 2.2: Run Database Migrations

```bash
# Get your database_id from Step 2.1
# Replace DATABASE_ID in command below

cd packages/db

wrangler d1 execute lonecrafts-db --file ./migrations/001_init_schema.sql
```

**Expected Output:**
```
✓ Database successfully initialized
✓ Tables created: products, customers, bills, bill_items, payments
```

### Step 2.3: Create R2 Bucket

1. Go to https://dash.cloudflare.com/?to=/:account/r2
2. Click "Create bucket"
3. Enter name: `lonecrafts-images`
4. Click "Create bucket"
5. Note the bucket name and account ID

### Step 2.4: Configure Wrangler Files

#### Update packages/workers/wrangler.toml:

```toml
name = "lonecrafts-api"
type = "service"
account_id = "your-cloudflare-account-id"  # From dashboard
main = "src/index.ts"
compatibility_date = "2024-12-01"

[[d1_databases]]
binding = "D1_DATABASE"
database_name = "lonecrafts-db"
database_id = "your-database-id"  # From wrangler d1 create output

[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "lonecrafts-images"  # Your R2 bucket name

[env.production]
name = "lonecrafts-api-prod"
routes = [
  { pattern = "api.lonecrafts.com/*", zone_name = "lonecrafts.com" }
]
```

#### Update packages/pages/wrangler.toml:

```toml
name = "lonecrafts-frontend"
type = "service"
account_id = "your-cloudflare-account-id"
main = "dist/index.html"

[build]
command = "npm run build"
cwd = "./"

[env.production]
name = "lonecrafts-frontend-prod"
routes = [
  { pattern = "lonecrafts.com/*", zone_name = "lonecrafts.com" }
]
```

### Step 2.5: Set Environment Secrets

```bash
# Set secrets for Workers
wrangler secret put ADMIN_PASSWORD
# Enter your secure admin password

wrangler secret put JWT_SECRET
# Enter a secure secret (use: openssl rand -hex 32)

wrangler secret put WHATSAPP_NUMBER
# Enter your WhatsApp business number: +91-XXXXXXXXXX
```

**Verify secrets:**
```bash
wrangler secret list
```

### Step 2.6: Configure Environment File

Create/update `.env` file:

```env
ADMIN_PASSWORD=your_secure_password_here
JWT_SECRET=your_secret_here_at_least_32_chars
WHATSAPP_NUMBER=+91-xxxxxxxxxx
VITE_API_URL=https://lonecrafts-api.workers.dev
```

---

## 🚀 Step 3: Deployment

### Option A: Deploy to Cloudflare Workers (Recommended)

#### Deploy API (Workers)

```bash
cd packages/workers

# Build TypeScript
npm run build

# Deploy to Cloudflare
npm run deploy
```

**Expected Output:**
```
✓ Uploaded lonecrafts-api
✓ Published to https://lonecrafts-api.salone.workers.dev
```

#### Deploy Frontend (Pages)

```bash
cd packages/pages

# Build React app
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist
```

**Expected Output:**
```
✓ Uploaded dist/
✓ Published to https://lonecrafts.pages.dev
```

### Option B: Deploy with Custom Domain

1. **Add domain to Cloudflare:**
   - Go to https://dash.cloudflare.com/
   - Add your domain (e.g., lonecrafts.com)
   - Point nameservers at registrar

2. **Configure routing:**
   - API: `api.lonecrafts.com` → lonecrafts-api.workers.dev
   - Frontend: `lonecrafts.com` → lonecrafts.pages.dev

3. **Deploy with domain:**
   ```bash
   # In packages/pages/wrangler.toml, update routes
   npm run build
   wrangler pages deploy dist --project-name=lonecrafts
   ```

---

## ✅ Post-Deployment Verification

### Test Public APIs

```bash
# Test catalog (no auth needed)
curl https://lonecrafts-api.yourname.workers.dev/api/products

# Test settings
curl https://lonecrafts-api.yourname.workers.dev/api/settings

# Test admin login (no auth needed)
curl -X POST https://lonecrafts-api.yourname.workers.dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your_admin_password"}'
```

### Test in Browser

1. Open: `https://lonecrafts.pages.dev`
2. Verify:
   - ✅ Catalog loads
   - ✅ Can login as admin
   - ✅ Can create products
   - ✅ Can manage customers
   - ✅ Can create bills

### Monitor Deployments

- **Cloudflare Dashboard:** https://dash.cloudflare.com/
- **Workers Analytics:** See request volumes and errors
- **Pages Analytics:** See frontend performance
- **D1 Metrics:** Database query performance

---

## 🔄 Continuous Deployment (Optional)

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      
      - run: npm run build
      
      - name: Deploy to Cloudflare
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: |
          npm install -g wrangler
          wrangler publish --env production
```

### Setup GitHub Secrets

1. Go to GitHub: Settings → Secrets and variables → Actions
2. Add secrets:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
   - `ADMIN_PASSWORD`: Admin password
   - `JWT_SECRET`: JWT secret key

---

## 📊 Monitoring & Logging

### Cloudflare Analytics

1. **Workers Analytics:**
   - Requests per minute
   - Error rates
   - Response times
   - Top errors

2. **Pages Analytics:**
   - Page load performance
   - Visitor counts
   - Bounce rate
   - Geographic distribution

### Debugging Issues

**View Worker Logs:**
```bash
wrangler tail lonecrafts-api
```

**View Database Logs:**
```bash
wrangler d1 execute lonecrafts-db --command "SELECT * FROM products LIMIT 1"
```

**View R2 Files:**
```bash
wrangler r2 ls r2://lonecrafts-images
```

---

## 🔐 Security Checklist

- [ ] Admin password is strong (16+ characters, mixed case, numbers, symbols)
- [ ] JWT secret is secure and unique (use `openssl rand -hex 32`)
- [ ] Secrets not committed to GitHub
- [ ] .env file in .gitignore
- [ ] API endpoints validate authentication
- [ ] R2 bucket has appropriate access controls
- [ ] D1 database has backup enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled (optional)
- [ ] WAF rules enabled (optional)

---

## 💰 Cloudflare Pricing

For free tier:
- **Workers:** 100,000 requests/day free
- **D1 Database:** 5GB storage, unlimited reads
- **R2 Bucket:** 10GB storage, 1M read requests/month
- **Pages:** Unlimited deployments

For production:
- **Workers:** $0.50/million requests after free tier
- **D1 Database:** $0.75/month + usage
- **R2 Bucket:** $0.015/GB stored + $0.01/M operations
- **Pages:** $20/month for team features

---

## 🆘 Troubleshooting Deployment

### Issue: "Unauthorized" when deploying
**Fix:**
```bash
wrangler logout
wrangler login
# Follow the browser prompt to authenticate
```

### Issue: "Database not found"
**Fix:**
```bash
# List databases
wrangler d1 list

# If missing, create:
wrangler d1 create lonecrafts-db

# Update wrangler.toml with database_id
```

### Issue: "R2 bucket not found"
**Fix:**
```bash
# Create via dashboard:
# https://dash.cloudflare.com/?to=/:account/r2

# Or via CLI (when available):
wrangler r2 bucket create lonecrafts-images
```

### Issue: "CORS error" in browser
**Fix:**
Check response headers in Workers code include:
```typescript
headers: {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
}
```

### Issue: "Image upload failing"
**Fix:**
1. Verify R2 bucket created
2. Check R2 access token has correct permissions
3. Verify bucket name in wrangler.toml matches

---

## 📚 Additional Resources

- **Cloudflare Workers:** https://developers.cloudflare.com/workers/
- **Cloudflare Pages:** https://developers.cloudflare.com/pages/
- **D1 Database:** https://developers.cloudflare.com/d1/
- **R2 Storage:** https://developers.cloudflare.com/r2/
- **Wrangler CLI:** https://developers.cloudflare.com/workers/wrangler/
- **GitHub Actions:** https://docs.github.com/en/actions

---

**Status:** Ready for production deployment! 🎉
