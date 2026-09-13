# Cloudflare Configuration

## Prerequisites

- Cloudflare Account
- Node.js 18+
- Wrangler CLI: `npm install -g wrangler`

## Setup Steps

### 1. Create D1 Database

```bash
wrangler d1 create lonecrafts
```

Copy the database ID from the output and paste it in `packages/workers/wrangler.toml`

### 2. Create R2 Bucket

```bash
wrangler r2 bucket create lonecrafts-media
```

### 3. Set Environment Variables

```bash
wrangler secret put ADMIN_PASSWORD
wrangler secret put WHATSAPP_NUMBER
wrangler secret put JWT_SECRET
```

### 4. Run Database Migrations

```bash
cd packages/db
wrangler d1 migrations apply lonecrafts --local
```

### 5. Deploy Workers

```bash
cd packages/workers
wrangler deploy
```

### 6. Deploy Pages

Create a `wrangler.toml` in `packages/pages` or use Cloudflare dashboard to connect Git repository.

## Local Development

```bash
# Terminal 1: Start Workers
cd packages/workers
wrangler dev

# Terminal 2: Start Pages
cd packages/pages
npm run dev
```

## Production Deployment

Update `wrangler.toml` files with your production zone IDs and database IDs, then:

```bash
npm run deploy
```

## Environment Variables

- `ADMIN_PASSWORD`: Password for admin login
- `WHATSAPP_NUMBER`: WhatsApp number for customer orders (format: country code + number, e.g., 919876543210)
- `JWT_SECRET`: Secret key for JWT token signing
