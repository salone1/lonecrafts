# Development Guide

## Project Structure

```
lonecrafts/
├── packages/
│   ├── pages/              # Cloudflare Pages (React frontend)
│   │   ├── src/
│   │   │   ├── components/ # React components
│   │   │   │   ├── catalog/   # Customer catalog components
│   │   │   │   └── admin/     # Admin panel components
│   │   │   ├── pages/      # Page routes
│   │   │   ├── App.tsx     # Main app component
│   │   │   ├── main.tsx    # Entry point
│   │   │   ├── store.ts    # Zustand state management
│   │   │   └── index.css   # Global styles (Tailwind)
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   ├── workers/            # Cloudflare Workers (API backend)
│   │   ├── src/
│   │   │   ├── routes/     # API route handlers
│   │   │   │   ├── auth.ts
│   │   │   │   ├── products.ts
│   │   │   │   ├── customers.ts
│   │   │   │   ├── billing.ts
│   │   │   │   └── settings.ts
│   │   │   ├── middleware/
│   │   │   │   └── auth.ts # Authentication middleware
│   │   │   ├── utils/      # Utility functions
│   │   │   └── index.ts    # Main worker file
│   │   ├── wrangler.toml
│   │   └── package.json
│   │
│   └── db/                 # Database schemas
│       ├── migrations/
│       │   └── 001_init_schema.sql
│       └── package.json
│
├── docs/                   # Documentation
│   ├── api.md
│   ├── schema.md
│   ├── auth.md
│   └── features.md
│
├── .github/
│   └── copilot-instructions.md
│
├── .env.example
├── .gitignore
├── tsconfig.json
├── package.json
├── README.md
├── CLOUDFLARE_SETUP.md
└── DEPLOYMENT.md
```

## Setup Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Create .env.local
```bash
cp .env.example .env.local
# Edit with your configuration
```

### 3. Start Development Servers

**Terminal 1: API Server**
```bash
cd packages/workers
wrangler dev
# API running at http://localhost:8787
```

**Terminal 2: Frontend Server**
```bash
cd packages/pages
npm run dev
# Frontend running at http://localhost:5173
```

## Development Workflow

### Adding a New Feature

1. **Create component** (if UI)
   ```bash
   touch packages/pages/src/components/NewComponent.tsx
   ```

2. **Add API endpoint** (if backend needed)
   - Create route in `packages/workers/src/routes/`
   - Add route to `packages/workers/src/index.ts`

3. **Update database** (if schema change)
   - Create migration in `packages/db/migrations/`
   - Apply locally: `wrangler d1 migrations apply lonecrafts --local`

4. **Test locally**
   ```bash
   # Run dev servers and test in browser
   http://localhost:5173
   ```

5. **Build and test**
   ```bash
   npm run build
   ```

### Component Examples

**Admin Product Management:**
```typescript
// packages/pages/src/components/admin/ProductManagement.tsx
```

**Billing System:**
```typescript
// packages/pages/src/components/admin/BillingSystem.tsx
```

**Customer Catalog:**
```typescript
// packages/pages/src/components/catalog/ProductGrid.tsx
```

## API Development

### Adding New Endpoint

1. Create route handler:
```typescript
// packages/workers/src/routes/newfeature.ts
export const newFeatureRoutes = {
  action: async (request: Request, env: Env) => {
    // Implementation
    return new Response(JSON.stringify({ /* response */ }));
  }
};
```

2. Add route to router:
```typescript
// packages/workers/src/index.ts
router.post('/api/feature', newFeatureRoutes.action);
```

3. Test with curl or Postman:
```bash
curl -X POST http://localhost:8787/api/feature \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

## Database Development

### Add Migration

1. Create migration file:
```bash
touch packages/db/migrations/002_feature_name.sql
```

2. Write SQL:
```sql
ALTER TABLE products ADD COLUMN new_field TEXT;
CREATE INDEX idx_new_field ON products(new_field);
```

3. Apply locally:
```bash
wrangler d1 migrations apply lonecrafts --local
```

4. Test queries locally

### Query Testing

```bash
wrangler d1 execute lonecrafts --local --command "SELECT * FROM products LIMIT 5"
```

## State Management

Using **Zustand** for client state:

```typescript
import { useStore } from './store';

function Component() {
  const { cart, addToCart } = useStore();
  
  return (
    <button onClick={() => addToCart(product, 1)}>
      Add to Cart
    </button>
  );
}
```

## Styling

Using **Tailwind CSS**:

```jsx
<button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
  Click me
</button>
```

## Testing

### Frontend Testing
```bash
cd packages/pages
npm run build  # Type check with tsc
```

### Backend Testing
```bash
cd packages/workers
npm run build
wrangler dev   # Test in local mode
```

### E2E Testing Checklist
- [ ] User can browse products
- [ ] User can add products to cart
- [ ] User can place WhatsApp order
- [ ] Admin can login
- [ ] Admin can create product
- [ ] Admin can upload image
- [ ] Admin can create customer
- [ ] Admin can create bill
- [ ] Admin can record payment
- [ ] Customer ledger shows correct totals

## Performance Tips

1. **Image Optimization**
   - Compress images before upload
   - Use modern formats (WebP)
   - R2 auto-optimizes with Cloudflare

2. **Database**
   - Use indexes for common queries
   - Avoid N+1 queries
   - Paginate large result sets

3. **Frontend**
   - Lazy load components
   - Minimize bundle size
   - Use React DevTools to profile

## Debugging

### Local Development
```bash
# Browser DevTools
# Open http://localhost:5173 → F12

# Server logs
wrangler dev --log-level debug

# Database debugging
# Check query results in terminal
```

### Production Debugging
```bash
# View worker logs
wrangler tail --format json

# Check Pages deployment
wrangler pages deployment list

# Monitor metrics
# Cloudflare Dashboard → Analytics
```

## Common Tasks

### Update Admin Password
```bash
wrangler secret put ADMIN_PASSWORD
# Enter new password when prompted
```

### Add Product Category
1. Add category name when creating products
2. Products automatically filter by category
3. No database migration needed (category is just text field)

### Export Customer Data
```bash
# SQL query to export all customers with totals
wrangler d1 execute lonecrafts --command "SELECT c.*, 
  COUNT(b.id) as bills,
  SUM(b.total) as total_purchases,
  SUM(p.amount) as total_paid
FROM customers c
LEFT JOIN bills b ON c.id = b.customer_id
LEFT JOIN payments p ON b.id = p.bill_id
GROUP BY c.id"
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# ...

# Commit
git add .
git commit -m "feat: add new feature"

# Push
git push origin feature/new-feature

# Create Pull Request
# → Tests run automatically
# → Deploy to staging
# → Merge to main
# → Deploy to production
```

## Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
