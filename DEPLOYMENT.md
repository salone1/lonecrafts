# Deployment Guide

## Prerequisites

- Cloudflare Account with Workers, Pages, D1, and R2 enabled
- Git repository (GitHub, GitLab, or Gitea)
- Node.js 18+ and npm installed
- Wrangler CLI: `npm install -g wrangler`

## Step 1: Cloudflare Setup

### Authenticate Wrangler
```bash
wrangler login
```

### Create D1 Database
```bash
wrangler d1 create lonecrafts
```
Copy the database ID and update both wrangler.toml files.

### Create R2 Bucket
```bash
wrangler r2 bucket create lonecrafts-media
```

### Apply Database Schema
```bash
cd packages/db
wrangler d1 migrations apply lonecrafts --remote
```

## Step 2: Set Secrets

```bash
# Set admin password
wrangler secret put ADMIN_PASSWORD

# Set WhatsApp number (format: countrycode+number, e.g., 919876543210)
wrangler secret put WHATSAPP_NUMBER

# Set JWT secret for tokens
wrangler secret put JWT_SECRET
```

For production, repeat with `--env production`:
```bash
wrangler secret put ADMIN_PASSWORD --env production
```

## Step 3: Deploy Workers API

```bash
cd packages/workers

# Development/Staging
wrangler deploy

# Production
wrangler deploy --env production
```

Record the Worker URL from the output.

## Step 4: Deploy Pages Frontend

### Option A: Git Integration (Recommended)

1. Push code to GitHub/GitLab
2. Go to Cloudflare Dashboard → Pages
3. Create new project → Connect Git
4. Select repository and branch
5. Set build command: `npm install && npm run build --workspace=pages`
6. Set output directory: `packages/pages/dist`

### Option B: Manual Deploy

```bash
cd packages/pages
wrangler pages deploy dist --project-name lonecrafts
```

## Step 5: Configure Environment

Update [src/config.ts](./packages/pages/src/config.ts) with your API endpoint:

```typescript
export const API_BASE_URL = 'https://api.lonecrafts.com/api';
```

## Step 6: Verify Deployment

1. Visit your Pages URL
2. Test product catalog loading
3. Login to admin panel with your password
4. Test creating a product and uploading image
5. Test creating customer and bill

## Post-Deployment Checklist

- [ ] Database migrations applied successfully
- [ ] Secrets configured in Cloudflare
- [ ] Workers API deployed and accessible
- [ ] Pages frontend deployed and loading
- [ ] Admin login working
- [ ] Product creation with image upload working
- [ ] Customer management working
- [ ] Billing system creating bills correctly
- [ ] WhatsApp order integration tested
- [ ] R2 images loading correctly
- [ ] SSL/TLS enabled (automatic with Cloudflare)
- [ ] Custom domain configured (optional)

## Custom Domain Setup

1. Update domain nameservers to Cloudflare
2. In Cloudflare Dashboard:
   - Add domain to account
   - Configure DNS records
   - Set up workers route in wrangler.toml
   - Set up pages route in wrangler.toml

## Monitoring & Logs

### View Worker Logs
```bash
wrangler tail --format pretty
```

### View Pages Deployment Logs
```bash
wrangler pages deployment list
```

## Scaling & Performance

- Cloudflare automatically scales workers
- D1 provides automatic backups
- R2 provides automatic CDN caching
- Pages cached at edge globally
- Workers include automatic rate limiting

## Troubleshooting

### Database Connection Issues
```bash
# Verify database exists
wrangler d1 info lonecrafts

# Test query
wrangler d1 execute lonecrafts --remote --command "SELECT 1"
```

### Secret Configuration
```bash
# List all secrets
wrangler secret list
```

### Worker Issues
```bash
# Test locally first
wrangler dev

# Check deployment
wrangler deployments list
```

### R2 Access Issues
```bash
# List bucket contents
wrangler r2 object list lonecrafts-media
```

## Production Considerations

1. **Enable CORS appropriately** - Only allow your domain
2. **Rate limiting** - Cloudflare provides automatic rate limiting
3. **Backup strategy** - Use D1 snapshots periodically
4. **Monitoring** - Set up Cloudflare analytics
5. **SSL/TLS** - Always use Full (strict) in Cloudflare settings
6. **WAF** - Enable Cloudflare WAF for admin panel
