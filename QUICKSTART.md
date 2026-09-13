# Quick Start Guide

## For First-Time Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Cloudflare Account
- Create free Cloudflare account at [cloudflare.com](https://www.cloudflare.com)
- Enable Workers, Pages, D1, and R2 services

### 3. Follow Setup Steps
See [CLOUDFLARE_SETUP.md](./CLOUDFLARE_SETUP.md) for detailed instructions.

## For Local Development

### 1. Create Environment File
```bash
cp .env.example .env.local
# Edit with your test configuration
```

### 2. Start Development Servers

**Terminal 1:**
```bash
cd packages/workers
npm run dev
```

**Terminal 2:**
```bash
cd packages/pages
npm run dev
```

### 3. Access Applications
- Catalog: http://localhost:5173
- API: http://localhost:8787/api

## For Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step deployment instructions.

## Project Overview

**Lone Crafts** is a complete e-commerce and business management system featuring:

### Customer Features
- 📦 Browse 100+ products by category
- 🔖 Each product has unique tag number
- 🛒 Add to cart and manage quantities
- 📱 Order via WhatsApp with auto-generated message
- 🔐 No price visibility (prices quoted per customer)

### Admin Features
- 📝 Complete product management
- 📸 Upload images directly from phone/computer
- 👥 Customer management and tracking
- 💰 Flexible billing system with manual pricing
- 📊 Complete customer ledger and transaction history
- 💳 Payment recording and balance tracking

### Technology
- **Frontend:** Cloudflare Pages + React + TypeScript + Tailwind CSS
- **Backend:** Cloudflare Workers + Node.js
- **Database:** Cloudflare D1 (SQLite)
- **Storage:** Cloudflare R2 (Images)

## Key Features

### Price Privacy Model
- Prices NOT stored in product database
- Each bill can have different pricing for same product
- Supports customer-specific pricing, bulk discounts
- Manual price entry at time of billing

### Order Management
- Customers order via WhatsApp
- Admin receives order with product tags and quantities
- Admin creates bill with custom pricing
- Full payment tracking per customer

### Customer Ledger
- Track total purchases per customer
- Record all payments received
- Calculate outstanding balance
- View complete bill history

## Documentation

- [API Reference](./docs/api.md) - All API endpoints
- [Database Schema](./docs/schema.md) - Data structure and queries
- [Authentication](./docs/auth.md) - Admin security
- [Features Guide](./docs/features.md) - Complete feature walkthrough
- [Development Guide](./DEVELOPMENT.md) - For developers
- [Deployment Guide](./DEPLOYMENT.md) - For production

## File Structure

```
lonecrafts/
├── packages/
│   ├── pages/         # React frontend
│   ├── workers/       # API backend
│   └── db/            # Database migrations
├── docs/              # Documentation
├── README.md          # This file
├── CLOUDFLARE_SETUP.md # Cloudflare configuration
├── DEPLOYMENT.md      # Deployment guide
└── DEVELOPMENT.md     # Development guide
```

## Support

For issues, questions, or feature requests, check:
1. [Development Guide](./DEVELOPMENT.md#troubleshooting)
2. API logs: `wrangler tail --format pretty`
3. Cloudflare Dashboard for service status

## License

Proprietary - Lone Crafts Business System
