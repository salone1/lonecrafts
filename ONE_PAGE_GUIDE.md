# 🧣 LONE CRAFTS - ONE-PAGE QUICK GUIDE

## ⚡ 30-Second Overview

**What You Have:** Complete e-commerce system for selling Kashmiri products (shawls, suits, dry fruits, kesar)
- Customers browse (no prices shown) → add cart → WhatsApp order
- You create bills with custom prices → share via WhatsApp → track payments
- Automatic balance calculations

---

## 🚀 START NOW (3 Commands)

```bash
# Command 1: Install (10 minutes)
npm install --no-audit

# Command 2: Terminal 1 - Start API
cd packages/workers && npm run dev

# Command 3: Terminal 2 - Start Website  
cd packages/pages && npm run dev

# Then open: http://localhost:5173
```

---

## 👥 CUSTOMER SIDE

### What They See
```
🧣 Lone Crafts
├─ Browse products (Shawls, Suits, Dry Fruits, etc.)
├─ Product name + description + tag #
├─ NO PRICES shown ← KEY!
├─ Add to cart
└─ [💬 Order via WhatsApp]
   → Auto-fills with items
   → Opens your WhatsApp
```

### What Happens
1. Customer sees product: "Pashmina Shawl - Tag #001"
2. Adds to cart
3. Clicks "Order via WhatsApp"
4. Message auto-fills: "Interested in Pashmina Shawl (Tag #001) ×1"
5. Sends to YOUR WhatsApp
6. You reply with price

---

## 🛠️ YOUR ADMIN SIDE

### Access
```
URL: http://localhost:5173/admin
Password: [Set in .env file]
```

### 3 Main Sections

**1️⃣ PRODUCTS**
```
Add → Edit → Delete → Hide
- Upload photos
- Set categories
- View all (active + hidden)
```

**2️⃣ CUSTOMERS**
```
Add → View → Track Balance
- See who owes you money
- Red warning for outstanding balance
- View all their bills
```

**3️⃣ BILLING** ← Most Important!
```
WORKFLOW:
1. Select customer → See their outstanding balance
2. Add items → Enter quantity + custom rate
3. System calculates total
4. Click "Share Bill WhatsApp"
5. Bill auto-sends to customer
6. Customer pays
7. Record payment
8. Balance auto-updates
```

---

## 💰 BILLING EXAMPLE

### Step by Step

```
Customer: Rajesh Kumar
Outstanding before: ₹0

BILL CREATION:
Product               Qty  Rate   Amount
Pashmina Shawl        1    2500   2500
Silk Suit             1    3500   3500
Dry Fruits Mix        2    800    1600
                              ───────────
                      TOTAL:  7600

Click: [Share Bill WhatsApp] ✓

PAYMENT #1:
Rajesh pays: ₹5000
You record: ₹5000
Outstanding now: 7600 - 5000 = ₹2600

PAYMENT #2:
Rajesh pays: ₹2600
You record: ₹2600
Outstanding now: ₹0 ✓ PAID!

NEW BILL:
Rajesh orders again
Outstanding now: [new bill amount]
```

---

## 🎯 KEY FEATURES

| Feature | Benefit |
|---------|---------|
| No prices on website | Peddler advantage - flexible pricing |
| Custom per-customer rates | Bulk discounts, retail markup |
| Multiple bills tracked | Know total outstanding per customer |
| Auto-calculated totals | No math errors |
| WhatsApp sharing | Easy bill delivery |
| Payment recording | Track who paid what |
| Balance display | Red warning when owing |

---

## 📱 YOUR DAILY TASKS

### Morning
```
Open admin panel
Check: "Customers" section
See RED outstanding balances
Send WhatsApp reminder to those owing money
```

### When Order Comes
```
Customer WhatsApps: "Interested in 1 shawl, 1 suit"
You go to Admin → Billing
Select customer
Add items + your prices
Click "Share Bill WhatsApp"
Bill auto-sends ✓
```

### When Payment Comes
```
Customer sends: "Paid 5000 via UPI"
You go to Admin → Billing
Click [💳 Add Payment]
Enter: 5000, UPI
Save ✓
Outstanding balance auto-updates ✓
```

### Add New Product
```
Admin → Products → [+ Add Product]
Fill: Name, Tag #, Description, Category
Upload: Photo
Active: Yes ✓
Save ✓
Appears on customer site
```

---

## 🔐 SETUP (Do This Once)

### File: .env
```env
ADMIN_PASSWORD=your_password_here
JWT_SECRET=any_random_32_character_string
WHATSAPP_NUMBER=+91-XXXXXXXXXX
```

**Get .env from .env.example:**
```bash
copy .env.example .env
# Then edit with your details
```

---

## 🧪 QUICK TEST

1. **As Customer:**
   - http://localhost:5173
   - Browse products
   - Add 2 items to cart
   - Click "Order WhatsApp"
   - Check message is correct

2. **As Admin:**
   - http://localhost:5173/admin
   - Enter password
   - Go to Billing
   - Create test bill
   - Share via WhatsApp

---

## 📊 DATABASE = YOUR BILLS

```
Products Table
├─ ID, Name, Tag #, Category, Photo, Active

Customers Table
├─ ID, Name, Phone, Email, Total Billed, Total Paid, Outstanding

Bills Table
├─ ID, Bill #, Customer ID, Items, Total, Status

Payments Table
├─ ID, Bill ID, Amount, Method, Date
```

---

## 🆘 COMMON ISSUES

| Problem | Fix |
|---------|-----|
| npm install slow | Use: `npm install --no-audit` |
| Can't login | Check .env ADMIN_PASSWORD |
| WhatsApp not open | Check .env WHATSAPP_NUMBER |
| Product photos error | Create R2 bucket in Cloudflare |
| Port 5173 taken | Use: `npm run dev -- --port 5174` |

---

## 📚 READ THESE (In Order)

1. **This file** ← You are here
2. **COMPLETE_SYSTEM_SUMMARY.md** - Full explanation
3. **KASHMIRI_PRODUCTS_GUIDE.md** - Business workflow
4. **CUSTOMIZATION_GUIDE.md** - How to customize

---

## 💡 REMEMBER

✅ **Customers see NO prices** on website
✅ **You set custom prices** in each bill
✅ **Different customers = different prices** OK!
✅ **Auto-calculates everything** - no math errors
✅ **WhatsApp auto-shares bills** - easy for customers
✅ **Tracks outstanding balance** - you know who owes you
✅ **Mobile friendly** - works on phone too

---

## 🎯 YOUR NEXT 1 HOUR

```
[ ] Read this file (5 min)
[ ] Run: npm install --no-audit (10 min)
[ ] Terminal 1: cd packages/workers && npm run dev (1 min)
[ ] Terminal 2: cd packages/pages && npm run dev (1 min)
[ ] Visit: http://localhost:5173 (as customer) (5 min)
[ ] Visit: http://localhost:5173/admin (as admin) (5 min)
[ ] Test full flow: browse → cart → bill → payment (20 min)
[ ] DONE! System works! 🎉
```

---

## ✨ YOU NOW HAVE

✅ Professional e-commerce website
✅ Admin panel for management
✅ Automatic billing system
✅ Payment tracking
✅ WhatsApp integration
✅ Product catalog
✅ Customer database
✅ Balance calculations

**All ready to use RIGHT NOW!**

---

## 🚀 DEPLOY LATER

When ready to go live (not now):
1. `git init` → push to GitHub
2. Create Cloudflare account (free)
3. Deploy Workers (free tier: 100k req/day)
4. Deploy Pages (free)
5. Use custom domain (optional)

See: GITHUB_CLOUDFLARE_DEPLOY.md

---

## 🎉 YOU'RE READY!

Everything is built, configured, and working.

**Next step:** `npm install --no-audit`

Questions? Check: **COMPLETE_SYSTEM_SUMMARY.md**

**GO LIVE!** 🧣
