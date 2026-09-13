# 🧣 Lone Crafts - Kashmiri Products E-Commerce System

## 👋 Welcome!

This is a **complete e-commerce + admin system** designed specifically for selling **Kashmiri products** (shawls, suits, stoles, dry fruits, kesar/saffron, and more) as a peddler/reseller business.

### Key Concept
- **Customers see products but NO prices** on website
- Customers add items to cart and send order via WhatsApp
- You create bills with **custom per-customer pricing**
- System auto-calculates, tracks payments, and manages balances
- Professional admin panel with product, customer, and billing management

---

## 🚀 Quick Start (15 minutes)

### 1. Install Dependencies
```bash
cd c:\Users\Dell\lonecrafts
npm install --no-audit
```

### 2. Start Development Servers

**Terminal 1: API Server**
```bash
cd packages/workers
npm run dev
# Runs on http://localhost:8787
```

**Terminal 2: Frontend App**
```bash
cd packages/pages
npm run dev
# Runs on http://localhost:5173
```

### 3. Test It
- **Customer:** http://localhost:5173 (browse products, no prices shown)
- **Admin:** http://localhost:5173/admin (login with your password)

---

## 📚 Documentation (Read in This Order)

### For Your Business (Kashmiri Products)
1. **[COMPLETE_SYSTEM_SUMMARY.md](COMPLETE_SYSTEM_SUMMARY.md)** ← **START HERE**
   - What you have
   - How it works
   - Real examples
   - Getting started

2. **[KASHMIRI_PRODUCTS_GUIDE.md](KASHMIRI_PRODUCTS_GUIDE.md)** ← Read Next
   - Customer interface explained
   - Admin features explained
   - Daily workflow
   - Real journey examples

3. **[CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md)** ← How to Customize
   - Add your products
   - Set categories
   - Configure admin
   - Personalize your system

### For Technical Details
4. **[QUICKSTART.md](QUICKSTART.md)** - Quick technical setup
5. **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Test scenarios & debugging
6. **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - All 15 API endpoints
7. **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development workflow
8. **[GITHUB_CLOUDFLARE_DEPLOY.md](GITHUB_CLOUDFLARE_DEPLOY.md)** - Deploy to production

---

## ✨ What You Get

### 👥 Customer Side
```
🧣 Lone Crafts Website
├─ Browse Kashmiri products
├─ See product name, description, tag #
├─ NO prices displayed
├─ Add to shopping cart
└─ Place order via WhatsApp
   ├─ Auto-filled with items
   ├─ Auto-filled with quantities
   └─ Redirects to your WhatsApp number
```

### 🛠️ Admin Side (Password Protected)
```
Admin Dashboard
├─ 📦 Products
│  ├─ Add/edit/delete products
│  ├─ Upload photos
│  ├─ Categorize items
│  └─ Hide/show from customers
│
├─ 👥 Customers
│  ├─ Add customers
│  ├─ View all customer details
│  ├─ See outstanding balance per customer
│  └─ Track payment history
│
└─ 💰 Billing
   ├─ Select customer
   ├─ Create bill with items
   ├─ Set custom rates per item
   ├─ Auto-calculate totals
   ├─ Share bill via WhatsApp
   └─ Record payments
```

---

## 💡 Key Features

✅ **No Website Pricing** - Customers ask you price via WhatsApp  
✅ **Custom Per-Customer Pricing** - Different prices for different customers  
✅ **Multiple Bills Per Customer** - Track each bill separately  
✅ **Outstanding Balance Tracking** - Know who owes you money  
✅ **WhatsApp Integration** - Orders and bills sent via WhatsApp  
✅ **Automatic Calculations** - System calculates totals & balances  
✅ **Payment Recording** - Track partial/full payments  
✅ **Product Photos** - Upload images to cloud  
✅ **Professional Admin** - Clean, easy-to-use dashboard  
✅ **Mobile Friendly** - Works on phone & tablet  

---

## 🎯 Your Business Flow

### Customer's Journey
```
1. Visits website → sees products (no prices)
2. Adds to cart → shawl, suit, dry fruits
3. Clicks "Order" → WhatsApp opens
4. Message auto-fills with items
5. Sends to your WhatsApp
```

### Your Admin Journey
```
1. Receive order on WhatsApp
2. Go to Admin → Billing
3. Select customer
4. Add items with your custom prices
5. Click "Share Bill WhatsApp"
6. Bill auto-sends to customer
7. Customer pays
8. You record payment
9. Outstanding balance auto-updates
```

---

## 🗂️ Project Structure

```
lonecrafts/
├── 📱 packages/pages/           Frontend (React)
│   └── src/
│       ├── components/
│       │   ├── catalog/         Customer view
│       │   └── admin/           Admin panel
│       ├── store.ts             Cart state
│       └── utils/               Helpers
│
├── ⚙️ packages/workers/          Backend API
│   └── src/
│       ├── routes/              API endpoints
│       │   ├── products.ts
│       │   ├── customers.ts
│       │   ├── billing.ts
│       │   └── auth.ts
│       └── middleware/          Auth
│
├── 🗄️ packages/db/              Database
│   └── migrations/              Schema
│
└── 📚 Documentation/            Guides
    ├── COMPLETE_SYSTEM_SUMMARY.md
    ├── KASHMIRI_PRODUCTS_GUIDE.md
    ├── CUSTOMIZATION_GUIDE.md
    ├── QUICKSTART.md
    ├── TESTING_GUIDE.md
    └── ...more files
```

---

## 🔐 Admin Access

### First Time Setup
1. Open `.env` file in project root
2. Set `ADMIN_PASSWORD=your_password_here`
3. Save file

### Login
- **URL:** http://localhost:5173/admin
- **Password:** Your password from .env file

---

## 📱 API Overview

### Public Endpoints (Customers)
- `GET /api/products` - Browse products
- `POST /auth/login` - Admin login

### Admin Endpoints (Protected)
- Product management (CRUD)
- Customer management (CRUD)
- Bill creation & tracking
- Payment recording
- Balance calculations

**See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete list**

---

## 🗄️ Database

### 5 Tables
- **products** - Your Kashmiri items (shawls, suits, etc.)
- **customers** - Client list
- **bills** - Invoice records
- **bill_items** - Items in each bill
- **payments** - Payment records

Data is stored in Cloudflare D1 (SQLite), automatically synced.

---

## 💾 Environment Setup

### Create `.env` file

Copy `.env.example` to `.env` and fill in:

```env
# Your admin password (min 8 chars)
ADMIN_PASSWORD=your_secure_password_123

# Random secret (keep this safe)
JWT_SECRET=use_something_random_at_least_32_characters_long

# Your WhatsApp Business number (with country code)
WHATSAPP_NUMBER=+91-XXXXXXXXXX
```

---

## 🚀 Deployment (When Ready)

### Deploy to GitHub
```bash
git init
git add .
git commit -m "Initial: Lone Crafts"
git remote add origin https://github.com/yourusername/lonecrafts.git
git push -u origin main
```

### Deploy to Cloudflare (Free)
- **Frontend:** Cloudflare Pages (free)
- **API:** Cloudflare Workers (free tier: 100k requests/day)
- **Database:** Cloudflare D1 (free: 5GB)
- **Images:** Cloudflare R2 (free: 10GB)

See [GITHUB_CLOUDFLARE_DEPLOY.md](GITHUB_CLOUDFLARE_DEPLOY.md) for details.

---

## 📋 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Backend | Cloudflare Workers, itty-router, Node.js |
| Database | Cloudflare D1 (SQLite) |
| Storage | Cloudflare R2 (images) |
| Auth | JWT (24-hour tokens) |
| State | Zustand (cart management) |

---

## 🧪 Testing

### Quick Test (10 minutes)
1. Start both servers
2. As customer: browse, add to cart, WhatsApp
3. As admin: login, create bill, share WhatsApp
4. Record payment, verify balance updates

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for complete testing scenarios.

---

## ⚠️ Important Notes

### For Kashmiri Products Business
- **No prices shown** to customers on website (peddler advantage!)
- **Custom pricing per customer** supported (bulk discounts, retail markup, etc.)
- **Multiple bills per customer** tracked separately
- **WhatsApp integration** for orders and billing
- **Payment tracking** with balance calculations

### Before Going Live
- [ ] Add at least 10-20 products
- [ ] Test complete order flow
- [ ] Set up WhatsApp Business account
- [ ] Configure your product categories
- [ ] Test payment recording
- [ ] Verify WhatsApp sharing works

---

## 🆘 Need Help?

### Common Questions

**Q: How do I add products?**  
A: Admin → Products → + Add Product → Fill details → Upload photo → Save

**Q: How do I create a bill?**  
A: Admin → Billing → Select customer → Add items → Set rates → Create bill

**Q: How do I set different prices for different customers?**  
A: When creating bill, enter custom rate for each item for that customer

**Q: How does WhatsApp sharing work?**  
A: When you create bill, click "Share WhatsApp" → Message auto-sends to customer with bill details

**Q: Can I see who owes me money?**  
A: Yes! Admin → Customers → See "Outstanding" balance in red for each customer

### Troubleshooting

| Issue | Solution |
|-------|----------|
| npm install slow | Use: `npm install --no-audit` |
| Can't login admin | Check ADMIN_PASSWORD in .env |
| WhatsApp not opening | Verify WHATSAPP_NUMBER in .env |
| Product photos not uploading | Cloudflare R2 auto-creates (or create manually) |
| Port already in use | Change port: `npm run dev -- --port 5174` |

---

## 📞 Support Resources

- **Quick answers:** [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Setup help:** [QUICKSTART.md](QUICKSTART.md)
- **Business workflow:** [KASHMIRI_PRODUCTS_GUIDE.md](KASHMIRI_PRODUCTS_GUIDE.md)
- **Customization:** [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md)
- **Testing:** [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **Deployment:** [GITHUB_CLOUDFLARE_DEPLOY.md](GITHUB_CLOUDFLARE_DEPLOY.md)

---

## ✅ Pre-Launch Checklist

- [ ] Read COMPLETE_SYSTEM_SUMMARY.md
- [ ] npm install completes without errors
- [ ] Dev servers start successfully
- [ ] Can browse products as customer
- [ ] Can login to admin panel
- [ ] Can add product with photo
- [ ] Can add customer
- [ ] Can create bill
- [ ] Can share bill via WhatsApp
- [ ] Can record payment
- [ ] Outstanding balance updates correctly

---

## 🎉 You're All Set!

Your Lone Crafts e-commerce system for Kashmiri products is **ready to go**.

### Next Steps
1. Read [COMPLETE_SYSTEM_SUMMARY.md](COMPLETE_SYSTEM_SUMMARY.md)
2. Run `npm install --no-audit`
3. Start dev servers
4. Test the system
5. Add your products
6. Go live!

**Status:** ✅ Complete and ready for deployment

---

**Questions?** Check the documentation files above - everything is documented!

**Ready to start?** Open [COMPLETE_SYSTEM_SUMMARY.md](COMPLETE_SYSTEM_SUMMARY.md)

Happy selling! 🧣📦🎉
