# ⚡ Lone Crafts - Quick Reference Card

## 🚀 Quick Start (Copy & Paste)

```bash
# Step 1: Install
cd c:\Users\Dell\lonecrafts
npm install --no-audit

# Step 2: Terminal 1 - API
cd packages/workers && npm run dev
# → http://localhost:8787

# Step 3: Terminal 2 - App
cd packages/pages && npm run dev
# → http://localhost:5173

# Step 4: Open browser
# http://localhost:5173
```

## 🔑 Admin Credentials
- **URL:** http://localhost:5173/admin
- **Password:** [Set in .env ADMIN_PASSWORD]
- **Default:** "admin123" (change before production)

## 📍 Key Ports
- Frontend: `http://localhost:5173`
- API: `http://localhost:8787`
- Proxy: Frontend auto-proxies to API

## 📁 Important Files

| File | Purpose |
|------|---------|
| `packages/pages/src/App.tsx` | Frontend router & auth |
| `packages/workers/src/index.ts` | API router |
| `packages/db/migrations/001_init_schema.sql` | Database |
| `.env.example` | Environment template |
| `FINAL_STATUS.md` | Project overview |
| `TESTING_GUIDE.md` | Test scenarios |
| `PREVIEW.html` | UI mockup |

## 🧪 Testing Checklist

- [ ] Can view products
- [ ] No prices shown to customers
- [ ] Can add to cart
- [ ] WhatsApp redirect works
- [ ] Can login as admin
- [ ] Can create product (with image)
- [ ] Can add customer
- [ ] Can create bill with custom prices
- [ ] Can record payment
- [ ] Balance calculates correctly

## 🐛 Common Errors

| Error | Fix |
|-------|-----|
| `Cannot find module 'react'` | `npm install` in packages/pages |
| `'wrangler' is not found` | `npm install -g wrangler` |
| `Port 5173 already in use` | `npm run dev -- --port 5174` |
| `D1 database not found` | Create via Cloudflare dashboard |
| `CORS error` | Check headers in response |
| `Image upload fails` | Verify R2 bucket created |

## 📝 API Test Commands

```bash
# Get products
curl http://localhost:8787/api/products

# Login
curl -X POST http://localhost:8787/auth/login \
  -d '{"password":"admin123"}'

# Get customers (with token)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8787/api/customers
```

## 🚀 Deployment

```bash
# GitHub
git init
git add .
git commit -m "Initial"
git remote add origin YOUR_REPO_URL
git push -u origin main

# Cloudflare
wrangler login
wrangler d1 create lonecrafts-db
cd packages/workers && npm run deploy
cd ../pages && wrangler pages deploy dist
```

## 💾 Database Tables

```
products (id, tag_number, name, category, image_url, active)
customers (id, name, email, phone)
bills (id, bill_number, customer_id, total)
bill_items (id, bill_id, product_id, quantity, rate)
payments (id, bill_id, amount, payment_method)
```

## 🎯 Feature Status

| Feature | Status |
|---------|--------|
| Product Catalog | ✅ Complete |
| Shopping Cart | ✅ Complete |
| WhatsApp Integration | ✅ Complete |
| Admin Login | ✅ Complete |
| Product CRUD | ✅ Complete |
| Customer Management | ✅ Complete |
| Flexible Billing | ✅ Complete |
| Payment Tracking | ✅ Complete |
| Image Upload (R2) | ✅ Complete |
| Database (D1) | ✅ Complete |
| Authentication (JWT) | ✅ Complete |
| API Documentation | ✅ Complete |

## 📚 Documentation Map

```
FINAL_STATUS.md         ← Start here
├─ QUICKSTART.md        ← 5 min setup
├─ DEVELOPMENT.md       ← Local dev
├─ TESTING_GUIDE.md     ← Test scenarios
├─ GITHUB_CLOUDFLARE_DEPLOY.md ← Deploy guide
├─ API_DOCUMENTATION.md ← All endpoints
├─ DATABASE_SCHEMA.md   ← DB details
├─ ARCHITECTURE.md      ← System design
└─ PREVIEW.html         ← UI mockup
```

## ⚙️ Environment Variables

```env
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_secure_secret_32_chars
WHATSAPP_NUMBER=+91-xxxxxxxxxx
VITE_API_URL=http://localhost:8787 (dev)
VITE_API_URL=https://api.lonecrafts.com (prod)
```

## 🔒 Security Notes

- [ ] Change default admin password
- [ ] Use strong JWT secret (32+ chars)
- [ ] Don't commit .env to GitHub
- [ ] Use secrets in production
- [ ] Enable HTTPS in production
- [ ] Validate all API inputs
- [ ] Use CORS selectively

## 📞 Quick Help

```bash
# View logs
npm run dev
wrangler tail

# Check TypeScript
npm run build

# Format code
npm run lint

# Clear npm cache
npm cache clean --force

# Reinstall everything
rm -r node_modules package-lock.json
npm install
```

## 🎨 UI Components

- **ProductGrid** - Shows 6+ products in grid
- **Cart** - Add/remove items, WhatsApp button
- **ProductManagement** - Admin CRUD form
- **CustomerManagement** - Customer list/cards
- **BillingSystem** - Bill creation & payments

## 📊 Expected Performance

- Page load: < 2s
- API response: < 500ms
- Database query: < 100ms
- Image upload: < 3s (depending on size)
- WhatsApp redirect: Instant

---

**Status: ✅ Complete and ready to test!**

Start with: `npm install --no-audit` then run the dev servers above.
