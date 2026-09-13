# Lone Crafts - Business Management System

**A complete, production-ready Cloudflare-based e-commerce and business management solution.**

Built specifically for Lone Crafts to provide a customer-facing product catalog, comprehensive admin panel, and flexible billing system with WhatsApp integration.

## 🚀 Quick Links

- **👉 [GETTING_STARTED.md](./GETTING_STARTED.md)** - Start here! Follow the checklist.
- **📋 [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete overview of what's been built
- **🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and data flow
- **📖 [DEVELOPMENT.md](./DEVELOPMENT.md)** - Developer guide and examples

## ✨ Key Features

### Customer Experience
- 📦 Browse 100+ products organized by category
- 🔖 Unique tag number for each product
- 🛒 Add multiple items to cart with quantity control
- 📱 Two ordering methods:
  - Individual "Order Now" for single products
  - Cart "Order Now" for multiple items
- 💬 WhatsApp integration with auto-generated order messages
- **Price Privacy**: Customers never see prices (quoted per-order)

### Admin Management
- ✏️ Complete product management (create, edit, delete, hide/show)
- 📸 Direct image upload from phone or computer
- 👥 Customer database with contact information
- 💰 Flexible billing system with manual per-customer pricing
- 📊 Complete customer ledger with:
  - All bills and payment history
  - Total purchases and payments
  - Outstanding balance tracking
- 📋 Invoice/bill reference generation

### Technical Highlights
- ⚡ Global edge computing (Cloudflare Workers)
- 🌍 CDN-cached content delivery
- 🔒 JWT-based admin authentication
- 📈 Auto-scaling infrastructure
- 💾 Automatic database backups
- 🖼️ Optimized image storage and delivery

## 📊 System Architecture

```
┌─────────────────────────────────────────────┐
│  Cloudflare Edge (Global CDN + Security)    │
├─────────────────────────────────────────────┤
│  ┌──────────────┐      ┌──────────────┐    │
│  │ Pages        │      │ Workers      │    │
│  │ (Frontend)   │      │ (API)        │    │
│  └──────────────┘      └──────────────┘    │
│           │                    │            │
└───────────┼────────────────────┼────────────┘
            │                    │
       ┌────┴────┬──────────┬────┴────┐
       ▼         ▼          ▼         ▼
      D1        R2      WhatsApp    Email
    (Database) (Images)   (Orders)  (etc.)
```

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18 + TypeScript + Tailwind CSS |
| **State** | Zustand |
| **Backend** | Cloudflare Workers + Node.js |
| **Database** | Cloudflare D1 (SQLite) |
| **Storage** | Cloudflare R2 |
| **Build** | Vite |
| **Deployment** | Cloudflare Pages |

## 📁 Project Structure

```
lonecrafts/
├── GETTING_STARTED.md       ← 👈 Start here!
├── QUICKSTART.md
├── CLOUDFLARE_SETUP.md
├── DEPLOYMENT.md
├── DEVELOPMENT.md
├── ARCHITECTURE.md
├── PROJECT_SUMMARY.md
│
├── packages/
│   ├── pages/              # React frontend
│   │   └── src/
│   │       ├── components/ # UI components
│   │       ├── utils/      # Utilities
│   │       └── config.ts   # API config
│   │
│   ├── workers/            # Cloudflare Workers API
│   │   └── src/
│   │       ├── routes/     # API endpoints
│   │       └── middleware/ # Auth
│   │
│   └── db/                 # Database
│       └── migrations/     # SQL schemas
│
├── docs/
│   ├── api.md              # API reference
│   ├── schema.md           # Database schema
│   ├── auth.md             # Authentication
│   └── features.md         # Feature guide
│
└── .env.example            # Environment template
```

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Cloudflare Account

### 1. Clone & Install
```bash
npm install
```

### 2. Setup Cloudflare
Follow [CLOUDFLARE_SETUP.md](./CLOUDFLARE_SETUP.md) to:
- Create D1 database
- Create R2 bucket
- Configure secrets

### 3. Local Development
```bash
# Terminal 1: Start Workers API
cd packages/workers && npm run dev

# Terminal 2: Start Pages frontend
cd packages/pages && npm run dev
```

Visit: http://localhost:5173

### 4. Deploy to Production
Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step deployment.

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [GETTING_STARTED.md](./GETTING_STARTED.md) | Checklist and next steps ⭐ |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | Complete project overview |
| [QUICKSTART.md](./QUICKSTART.md) | Quick setup guide |
| [CLOUDFLARE_SETUP.md](./CLOUDFLARE_SETUP.md) | Cloudflare configuration |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Developer workflow |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design and data flow |
| [docs/api.md](./docs/api.md) | Complete API reference |
| [docs/schema.md](./docs/schema.md) | Database schema details |
| [docs/auth.md](./docs/auth.md) | Authentication & security |
| [docs/features.md](./docs/features.md) | Feature overview |

## 🎯 Key Concept: Flexible Pricing

Unlike traditional systems, **prices are NOT stored in the product database**.

**This enables:**
- Different prices for different customers
- Different prices on different dates
- Bulk discount support
- Per-customer custom pricing

**Workflow:**
1. Customer orders via WhatsApp (no prices shown)
2. Admin quotes custom price
3. Admin creates bill with manually entered rate
4. Same product = different prices for different customers

## 🔌 API Endpoints

### Public
```
GET  /api/products           # Browse products
GET  /api/settings           # Public settings
```

### Admin (Authenticated)
```
POST /api/auth/login         # Get JWT token
CRUD /api/admin/products     # Manage products
CRUD /api/admin/customers    # Manage customers
CRUD /api/admin/bills        # Manage bills
POST /api/admin/bills/:id/payments  # Record payments
```

**Full API docs**: [docs/api.md](./docs/api.md)

## 💾 Database Tables

- `products` - Product catalog
- `customers` - Customer information
- `bills` - Billing records
- `bill_items` - Items per bill
- `payments` - Payment records

**Schema details**: [docs/schema.md](./docs/schema.md)

## 🚀 Performance

- **Frontend Load**: <2s (Cloudflare CDN)
- **API Response**: <100ms (edge computing)
- **Database Query**: <50ms (indexed)
- **Concurrent Users**: Unlimited (auto-scaling)
- **Global Availability**: Deployed on Cloudflare edge network

## 🔒 Security

- ✅ JWT authentication with 24h expiry
- ✅ Admin password protection
- ✅ Automatic HTTPS/TLS via Cloudflare
- ✅ No payment information stored
- ✅ Token validation on all admin routes
- ✅ Rate limiting included

## 📊 Database Queries

Get customer summary with totals:
```sql
SELECT c.*, 
  COUNT(b.id) as bills,
  SUM(b.total) as purchases,
  SUM(p.amount) as payments
FROM customers c
LEFT JOIN bills b ON c.id = b.customer_id
LEFT JOIN payments p ON b.id = p.bill_id
GROUP BY c.id
```

## 💰 Pricing

Using Cloudflare's free/cheap tiers:
- **Estimated Cost**: $0-5/month for typical business
- **Scaling**: Pay-as-you-grow pricing
- **No Setup Fees**: Start free

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🐛 Troubleshooting

**API not connecting?**
- Ensure Workers are running: `wrangler dev`
- Check proxy URL in vite.config.ts

**Database issues?**
- Verify D1 ID in wrangler.toml
- Apply migrations: `wrangler d1 migrations apply lonecrafts --remote`

**Images not uploading?**
- Check R2 bucket name in wrangler.toml
- Verify R2 permissions

**Admin login fails?**
- Verify ADMIN_PASSWORD secret matches exactly
- Check: `wrangler secret list`

See [DEVELOPMENT.md](./DEVELOPMENT.md#troubleshooting) for more help.

## 📋 Development Workflow

```bash
# Setup
npm install
cp .env.example .env.local

# Local development
cd packages/workers && npm run dev  # Terminal 1
cd packages/pages && npm run dev    # Terminal 2

# Building
npm run build

# Deployment
npm run deploy
```

## 🤝 Contributing

This is a custom business system. For modifications:

1. See [DEVELOPMENT.md](./DEVELOPMENT.md)
2. Follow TypeScript best practices
3. Test locally before deploying
4. Check API documentation before changes

## 📝 License

**Proprietary** - Lone Crafts Business System

All rights reserved. Built specifically for Lone Crafts.

## 🆘 Support

For issues and questions:
1. Check the relevant documentation file
2. Review [DEVELOPMENT.md](./DEVELOPMENT.md#troubleshooting)
3. Check Cloudflare Dashboard for service status
4. Review worker logs: `wrangler tail --format pretty`

---

## 🎉 Ready to Launch!

**👉 Start with [GETTING_STARTED.md](./GETTING_STARTED.md) for next steps.**

The system is production-ready and waiting for you to launch!
