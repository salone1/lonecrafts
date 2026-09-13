# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET / USERS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐         ┌──────────────────────┐      │
│  │  CUSTOMERS           │         │  ADMIN               │      │
│  │  (Browse & Order)    │         │  (Manage Business)   │      │
│  └──────────────────────┘         └──────────────────────┘      │
│           │                                 │                    │
└───────────┼─────────────────────────────────┼────────────────────┘
            │                                 │
            ▼                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│          CLOUDFLARE EDGE (Global CDN & Security)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  CLOUDFLARE PAGES (Frontend)                            │    │
│  │  ┌──────────────────┐     ┌──────────────────────────┐ │    │
│  │  │ Catalog          │     │ Admin Panel              │ │    │
│  │  │ (Browse Products)│     │ (Product, Customer, Bill)│ │    │
│  │  │ Shopping Cart    │     │ Management              │ │    │
│  │  │ WhatsApp Order   │     │ Billing System          │ │    │
│  │  └──────────────────┘     └──────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────┘    │
│           │                                                       │
│           ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  CLOUDFLARE WORKERS (Serverless API)                    │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │    │
│  │  │ Auth     │  │ Products │  │ Billing  │              │    │
│  │  │ Routes   │  │ Routes   │  │ Routes   │              │    │
│  │  └──────────┘  └──────────┘  └──────────┘              │    │
│  │  ┌──────────────────────────────────────┐              │    │
│  │  │ Customers & Payment Routes           │              │    │
│  │  └──────────────────────────────────────┘              │    │
│  └─────────────────────────────────────────────────────────┘    │
│           │                                                       │
└───────────┼───────────────────────────────────────────────────────┘
            │
            ├─────────────────────┬─────────────────────┐
            ▼                     ▼                     ▼
       ┌─────────┐          ┌──────────┐         ┌─────────┐
       │CLOUDFLARE│          │CLOUDFLARE│         │WHATSAPP │
       │  D1      │          │   R2     │         │  API    │
       │DATABASE  │          │ STORAGE  │         │(For     │
       │(Products │          │(Images)  │         │Orders)  │
       │Customers │          │          │         │         │
       │Bills)    │          │          │         │         │
       └─────────┘          └──────────┘         └─────────┘
```

## Data Flow

### Customer Order Flow

```
┌──────────────────────────────────────────────────────────┐
│ 1. Customer Browses Catalog                              │
│    - Pages fetches products from Workers API              │
│    - API queries D1 database                              │
│    - Images loaded from R2                                │
└──────────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────┐
│ 2. Customer Adds to Cart                                 │
│    - Stored in Zustand (client-side state)               │
│    - No backend call needed                               │
└──────────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────┐
│ 3. Customer Clicks "Order Now"                           │
│    - Frontend generates WhatsApp message                 │
│    - Auto-includes: product names, tags, quantities      │
│    - Redirects to WhatsApp with pre-filled message       │
└──────────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────┐
│ 4. Admin Receives Order on WhatsApp                      │
│    - Quotes custom price                                 │
│    - Confirms order details                              │
└──────────────────────────────────────────────────────────┘
```

### Admin Billing Flow

```
┌──────────────────────────────────────────────────────────┐
│ 1. Admin Logs In                                         │
│    - Enters password                                     │
│    - Workers validates and returns JWT token             │
│    - Token stored in localStorage                        │
└──────────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────┐
│ 2. Admin Creates Bill                                    │
│    - Selects customer (or creates new)                   │
│    - Adds products to bill                               │
│    - Enters quantity and custom rate for each            │
│    - Frontend calculates subtotals                       │
└──────────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────┐
│ 3. Workers API Creates Bill                              │
│    - Creates bill in D1 database                         │
│    - Creates bill_items records                          │
│    - Generates unique bill reference number              │
│    - Returns bill details to frontend                    │
└──────────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────┐
│ 4. Admin Records Payment                                 │
│    - Payment API called with amount                      │
│    - Payment record created in D1                        │
│    - Outstanding balance automatically calculated        │
└──────────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────┐
│ 5. Admin Views Customer Ledger                           │
│    - All bills listed with payments                      │
│    - Totals calculated from database                     │
│    - Outstanding balance shown                           │
└──────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend (Cloudflare Pages + React)

```
App.tsx (Router & Navigation)
│
├── Catalog Routes
│   ├── ProductGrid.tsx (Browse, filter, view products)
│   ├── Cart.tsx (Cart management & WhatsApp order)
│   └── Product Details (can be expanded)
│
└── Admin Routes (Protected by JWT)
    ├── ProductManagement.tsx
    │   ├── Create new product
    │   ├── Edit existing
    │   ├── Upload images
    │   ├── Hide/Show products
    │   └── Delete products
    │
    ├── CustomerManagement.tsx
    │   ├── List all customers
    │   ├── Add new customer
    │   └── View customer summary
    │
    └── BillingSystem.tsx
        ├── Select/Create customer
        ├── Add products to bill
        ├── Enter quantities & rates
        ├── Create bill
        ├── Record payments
        └── View bill history
```

### Backend (Cloudflare Workers)

```
Workers/src/index.ts (Router)
│
├── routes/auth.ts
│   ├── POST /auth/login → JWT token
│   └── POST /auth/verify → Token validation
│
├── routes/products.ts
│   ├── GET /products (public, active only)
│   ├── GET /admin/products (all)
│   ├── POST /admin/products (create)
│   ├── PUT /admin/products/:id (update)
│   ├── PATCH /admin/products/:id (toggle active)
│   └── DELETE /admin/products/:id
│
├── routes/customers.ts
│   ├── GET /customers (list)
│   ├── POST /customers (create)
│   └── GET /customers/:id (get one)
│
├── routes/billing.ts
│   ├── GET /bills (list)
│   ├── POST /bills (create)
│   ├── GET /bills/:id (details)
│   ├── GET /customers/:customerId/bills
│   └── POST /bills/:id/payments (add payment)
│
├── routes/settings.ts
│   └── GET /settings (WhatsApp number)
│
└── middleware/auth.ts
    └── checkAuth() → validate JWT token
```

### Database (Cloudflare D1)

```
SQLite Database
│
├── products
│   ├── id (UUID)
│   ├── tag_number (unique)
│   ├── name
│   ├── description
│   ├── category
│   ├── image_url (R2 path)
│   ├── active (0/1)
│   └── timestamps
│
├── customers
│   ├── id (UUID)
│   ├── name
│   ├── email
│   ├── phone
│   └── timestamps
│
├── bills
│   ├── id (UUID)
│   ├── bill_number (unique, auto-generated)
│   ├── customer_id (FK)
│   ├── total
│   ├── notes
│   └── timestamps
│
├── bill_items
│   ├── id (UUID)
│   ├── bill_id (FK)
│   ├── product_id (FK)
│   ├── quantity
│   ├── rate (manual entry)
│   └── subtotal (quantity × rate)
│
└── payments
    ├── id (UUID)
    ├── bill_id (FK)
    ├── amount
    ├── payment_method
    ├── reference
    └── created_at
```

### Storage (Cloudflare R2)

```
lonecrafts-media/
│
└── products/
    ├── 1704067200000-chair.jpg
    ├── 1704067201000-table.png
    └── ... (other product images)
```

## Security Model

```
┌─────────────────────────────────────────────────────────┐
│  PUBLIC ACCESS (Customers)                              │
├─────────────────────────────────────────────────────────┤
│  ✓ GET /products (active only)                          │
│  ✓ GET /settings                                        │
│  ✗ No access to prices, customers, or billing data      │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  ADMIN ACCESS (Protected)                               │
├─────────────────────────────────────────────────────────┤
│  1. Login with password → Get JWT token                 │
│  2. Include token in Authorization header               │
│  3. Server validates token expiry                       │
│  4. Access granted to:                                  │
│     - All product operations                            │
│     - All customer operations                           │
│     - All billing operations                            │
│     - All payment operations                            │
│  5. Token expires after 24 hours                        │
└─────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
Production Deployment
│
├── Cloudflare Pages (Frontend)
│   ├── Git integration for auto-deploy
│   ├── Global edge caching
│   └── Automatic SSL/TLS
│
├── Cloudflare Workers (API)
│   ├── Serverless execution
│   ├── Global edge compute
│   └── Automatic scaling
│
├── Cloudflare D1 (Database)
│   ├── Regional replication
│   ├── Automatic backups
│   └── Point-in-time recovery
│
└── Cloudflare R2 (Storage)
    ├── Automatic CDN caching
    ├── Versioning capability
    └── S3-compatible API
```

## Scalability

- **Frontend**: Automatically scales globally via Cloudflare Pages edge
- **API**: Workers scales horizontally across Cloudflare network
- **Database**: D1 handles thousands of concurrent reads/writes
- **Storage**: R2 provides unlimited storage with CDN acceleration
- **Performance**: Sub-100ms response times globally

## Monitoring Points

1. **Workers Log Stream**: `wrangler tail --format pretty`
2. **Pages Analytics**: Cloudflare Dashboard
3. **Database Queries**: D1 CLI tools
4. **Error Tracking**: Response status codes and error responses
5. **Performance**: Cloudflare Analytics Engine
