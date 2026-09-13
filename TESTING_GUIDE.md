# Lone Crafts - Testing & Debugging Guide

## 🚀 Getting Started

### Prerequisites Check
- ✅ Node.js v18+ installed
- ✅ npm installed
- ✅ Git installed
- ✅ All 50 project files in place
- ✅ Cloudflare account (free tier)

---

## 📋 Testing Phases

### Phase 1: Installation & Setup (15 minutes)

**Command:**
```bash
cd c:\Users\Dell\lonecrafts

# Clean and reinstall
npm cache clean --force
npm install --no-audit
```

**Expected Output:**
```
added 300+ packages in 5-10 minutes
```

**Troubleshooting:**
- If `npm install` hangs:
  - Try: `npm install --omit=optional`
  - Or install per-package: `cd packages/pages && npm install`
  - Check: `npm config get registry`
  - Clear: `npm cache clean --force && npm install`

---

### Phase 2: Local Development (30 minutes)

#### Terminal 1: Start Workers API

```bash
cd c:\Users\Dell\lonecrafts\packages\workers
npm run dev
```

**Expected Output:**
```
⚡ Wrangler 3.x.x
🌍 Listening on http://0.0.0.0:8787
```

**Port:** `http://localhost:8787`

**Troubleshooting:**
- Error: `'wrangler' is not recognized`
  - Solution: `npm install -g wrangler`
- Error: `Cannot find module`
  - Solution: `npm install` in packages/workers directory
- Port already in use:
  - Kill process: `netstat -ano | findstr :8787` then `taskkill /PID`
  - Or use different port: Edit wrangler.toml

#### Terminal 2: Start React Frontend

```bash
cd c:\Users\Del\lonecrafts\packages\pages
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h to show help
```

**Port:** `http://localhost:5173`

**Troubleshooting:**
- Error: `Cannot find module 'react'`
  - Solution: `npm install`
- Port 5173 in use:
  - Run on different port: `npm run dev -- --port 5174`

---

### Phase 3: Browser Testing (45 minutes)

#### Test 1: Catalog View
1. Open `http://localhost:5173` in browser
2. Verify:
   - ✅ Page loads without errors
   - ✅ Product grid displays 6+ products
   - ✅ NO prices shown to customers
   - ✅ Category filter buttons visible
   - ✅ Each product shows: name, description, tag number
   - ✅ Product images load correctly

**Expected:**
```
ProductGrid Component
├─ Category Filters (All, Jewelry, Home Decor, etc.)
├─ 6+ Product Cards
│  ├─ Image placeholder
│  ├─ Product name
│  ├─ Description
│  └─ Tag #XXX
└─ No prices visible
```

#### Test 2: Shopping Cart
1. Click "Add to Cart" on 2-3 products
2. Verify:
   - ✅ Cart icon updates count
   - ✅ Items appear in cart
   - ✅ Quantity can be adjusted
   - ✅ Items can be removed

**Expected:**
```
Cart State: { items: [product1, product2], quantities: {...} }
```

#### Test 3: WhatsApp Integration
1. Click "Generate WhatsApp Message"
2. Verify:
   - ✅ Redirects to WhatsApp Web or app
   - ✅ Message includes: product names, tag numbers, quantities
   - ✅ Message is properly formatted

**Expected Message:**
```
🛒 Order from Lone Crafts:

Items:
- Handmade Necklace (Tag #001) × 2
- Leather Bag (Tag #003) × 1

Please provide pricing and confirm.

Product links:
https://lonecrafts.local/products/tag001
https://lonecrafts.local/products/tag003
```

#### Test 4: Admin Login
1. Click "Admin" or navigate to `/admin`
2. Enter admin password (set in `.env` or environment)
3. Verify:
   - ✅ Login form displays
   - ✅ Password field accepts input
   - ✅ "Login" button works
   - ✅ Invalid password shows error
   - ✅ JWT token stored in localStorage

**Expected:**
```
Browser Console > Application > localStorage
Key: 'authToken'
Value: 'eyJhbGciOiJIUzI1NiIs...'
```

---

### Phase 4: Admin Features Testing (60 minutes)

#### Test 5: Product Management
1. Login as admin
2. Navigate to "Products" tab
3. Test CRUD operations:

**Create Product:**
- ✅ Click "+ Add Product"
- ✅ Fill: name, description, category, tag #
- ✅ Upload image to R2
- ✅ Click Save
- ✅ Product appears in list

**Read Products:**
- ✅ All products listed (including inactive)
- ✅ Product details display correctly
- ✅ Images show correctly

**Update Product:**
- ✅ Click Edit on a product
- ✅ Modify: name, description, category
- ✅ Save changes
- ✅ List updates

**Delete Product:**
- ✅ Click Delete
- ✅ Confirm action
- ✅ Product removed from list

**Toggle Active Status:**
- ✅ Click icon to activate/deactivate
- ✅ Status updates immediately
- ✅ Inactive products hide from customer view

#### Test 6: Customer Management
1. Navigate to "Customers" tab
2. Verify:
   - ✅ Customer list displays
   - ✅ Shows: name, email, phone, outstanding balance
   - ✅ Balance = Total Bills - Paid Payments
   - ✅ Can add new customer

**Expected Customer Card:**
```
Rajesh Kumar
📞 +91-9876543210
Total Bills: ₹15,000
Paid: ₹10,000
Outstanding: ₹5,000
```

#### Test 7: Billing System
1. Navigate to "Billing" tab
2. Click "+ Create New Bill"
3. Test bill creation:

**Create Bill:**
- ✅ Select customer
- ✅ Add products (multiple)
- ✅ Set quantity per item
- ✅ Set custom rate/price per item
- ✅ Subtotal calculates: qty × rate
- ✅ Total calculates: sum of subtotals
- ✅ Can add notes
- ✅ Save bill

**Bill Management:**
- ✅ View bill list
- ✅ Filter by customer
- ✅ Click bill to see details
- ✅ View items and amounts

**Record Payment:**
- ✅ Click "Add Payment" on bill
- ✅ Enter amount
- ✅ Select payment method
- ✅ Add reference (order #, etc)
- ✅ Save payment
- ✅ Bill status updates (Paid/Pending)
- ✅ Customer balance updates

**Expected:**
```
Bill #INV-2024-001
Customer: Rajesh Kumar
Items:
  - Necklace ×2 @ ₹5,000/ea = ₹10,000
  - Vase ×1 @ ₹3,000/ea = ₹3,000
Subtotal: ₹13,000
Tax (optional): ₹0
Total: ₹13,000

Payments:
  - ₹10,000 (UPI, Ref: UPI-123456)
Outstanding: ₹3,000
```

---

### Phase 5: API Testing (30 minutes)

#### Test 8: Public APIs

**Get Products:**
```bash
curl http://localhost:8787/api/products
```

**Expected Response (Status 200):**
```json
{
  "success": true,
  "products": [
    {
      "id": "uuid",
      "tag_number": "001",
      "name": "Handmade Necklace",
      "description": "...",
      "category": "Jewelry",
      "image_url": "https://r2.../image.jpg",
      "active": 1
    }
  ]
}
```

**Get Settings:**
```bash
curl http://localhost:8787/api/settings
```

**Expected Response:**
```json
{
  "whatsappNumber": "+91-xxxxxxxxxx"
}
```

#### Test 9: Authentication

**Login:**
```bash
curl -X POST http://localhost:8787/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your_admin_password"}'
```

**Expected Response (Status 200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 86400
}
```

**Verify Token:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8787/auth/verify
```

**Expected Response:**
```json
{
  "valid": true,
  "role": "admin"
}
```

#### Test 10: Protected APIs

**Get Admin Products (with auth):**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8787/api/admin/products
```

**Get Customers:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8787/api/customers
```

**Without Token (should fail):**
```bash
curl http://localhost:8787/api/admin/products
# Expected: 401 Unauthorized
```

---

## 🐛 Common Issues & Fixes

### Issue 1: "Cannot GET /api/products"
**Cause:** Workers API not running or wrong URL
**Fix:**
```bash
# Check Workers is running on :8787
curl http://localhost:8787/

# Check proxy in vite.config.ts:
# target: "http://localhost:8787"
```

### Issue 2: CORS Errors in Browser Console
**Cause:** Frontend and API CORS mismatch
**Fix:**
```typescript
// In packages/workers/src/index.ts
// Add headers to all responses:
headers: {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
}
```

### Issue 3: "Cannot find module 'wrangler'"
**Cause:** wrangler not installed
**Fix:**
```bash
npm install -g wrangler
# or
cd packages/workers && npm install
```

### Issue 4: JWT Token Not Working
**Cause:** Secret mismatch or token expired
**Fix:**
```bash
# Check JWT_SECRET in .env matches wrangler.toml
# Regenerate token:
curl -X POST http://localhost:8787/auth/login \
  -d '{"password":"your_password"}'
```

### Issue 5: Product Images Not Uploading
**Cause:** R2 bucket not configured
**Fix:**
```bash
# Create R2 bucket at:
# https://dash.cloudflare.com/?to=/:account/r2

# Add to wrangler.toml:
[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "lonecrafts-images"
```

### Issue 6: Database Queries Failing
**Cause:** D1 migrations not run
**Fix:**
```bash
cd packages/db
wrangler d1 execute lonecrafts-db --file ./migrations/001_init_schema.sql
```

### Issue 7: "port 5173 is already in use"
**Cause:** Previous dev server still running
**Fix:**
```bash
# Find and kill process:
netstat -ano | findstr :5173
taskkill /PID [PID_NUMBER] /F

# Or run on different port:
npm run dev -- --port 5174
```

### Issue 8: TypeScript Errors
**Cause:** Missing types or compilation errors
**Fix:**
```bash
# Check tsconfig.json
# Rebuild:
cd packages/pages && npm run build
cd ../workers && npm run build

# Fix errors shown in output
```

---

## ✅ Pre-Deployment Checklist

Before deploying to Cloudflare, verify:

- [ ] `npm install` completes without errors
- [ ] Workers API runs on localhost:8787
- [ ] React app runs on localhost:5173
- [ ] All 6 CRUD operations work for products
- [ ] Customer management works
- [ ] Billing system creates and updates bills
- [ ] Payments record correctly
- [ ] WhatsApp redirect works
- [ ] JWT authentication works
- [ ] All API endpoints return correct data
- [ ] No console errors in browser
- [ ] No errors in terminal outputs
- [ ] Product images upload to R2
- [ ] Database queries work
- [ ] All routes have auth guards where needed

---

## 🚀 Deployment Testing

Once deployed to Cloudflare:

1. **Test Production URL:**
   ```bash
   curl https://lonecrafts-api-prod.yourname.workers.dev/api/products
   ```

2. **Monitor for errors:**
   - Check Cloudflare dashboard for 5xx errors
   - Review Workers analytics
   - Check D1 query logs
   - Review R2 access logs

3. **Performance test:**
   - Load page multiple times
   - Test with slow internet
   - Check response times

---

## 📞 Support Resources

- **Node.js Issues:** https://nodejs.org/en/docs/
- **npm Help:** `npm help` or `npm-docs`
- **Cloudflare:** https://developers.cloudflare.com/
- **React:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Wrangler:** https://developers.cloudflare.com/workers/wrangler/

---

## 📝 Logging Issues

When reporting issues, include:

1. Full error message from terminal/console
2. Browser console errors (F12 > Console)
3. Network tab showing failed requests
4. Stack trace if available
5. Steps to reproduce
6. OS and Node version: `node --version` && `npm --version`

---

**Next Step:** Run `npm install` and start the dev servers! 🎉
