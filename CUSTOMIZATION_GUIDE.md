# 🧣 Customization Guide - Kashmiri Products Setup

## Quick Setup Checklist

- [ ] Install dependencies (`npm install --no-audit`)
- [ ] Add your admin password to `.env`
- [ ] Set your WhatsApp business number
- [ ] Start dev servers
- [ ] Login to admin
- [ ] Add first 5 products
- [ ] Test order flow

---

## Step 1: Environment Setup

### File: `.env`
```env
ADMIN_PASSWORD=your_secure_password_123
JWT_SECRET=use_something_random_32_characters
WHATSAPP_NUMBER=+91-XXXXXXXXXX
```

**Where to get these:**
- `ADMIN_PASSWORD`: Create a strong password (15+ chars)
- `JWT_SECRET`: Any random string (min 32 chars)
- `WHATSAPP_NUMBER`: Your WhatsApp Business number with country code

---

## Step 2: Product Categories for Kashmiri Items

### Suggested Categories

```
1. 🧣 SHAWLS
   - Pashmina Shawl
   - Silk Shawl
   - Wool Shawl
   - Embroidered Shawl
   
2. 👔 SUITS & DRESS
   - Traditional Suit
   - Silk Suit
   - Cotton Suit
   - Casual Kurta
   
3. 🧵 STOLES & SCARVES
   - Pashmina Stole
   - Silk Stole
   - Wool Stole
   - Cotton Scarf
   
4. 🥜 DRY FRUITS
   - Mixed Dry Fruits
   - Almonds
   - Walnuts
   - Raisins
   - Apricots
   
5. 🟡 SAFFRON & SPICES
   - Premium Kesar (Saffron)
   - Saffron Threads
   - Spice Mix
   
6. 💎 HANDICRAFTS
   - Embroidered Cushion
   - Carpet
   - Wooden Boxes
   - Wall Hangings
```

---

## Step 3: Add Products

### Product Template

When adding each product, use this format:

```
Name: Pashmina Shawl - Premium Hand-woven
Tag #: SHAWL-001
Category: Shawls
Description: Pure Kashmiri Pashmina shawl, hand-woven
by local artisans. Soft and warm, perfect for 
winters or traditional occasions.
Photo: [Upload from your computer]
Active: Yes (checked)
```

### Example Products to Add

#### Product 1: Premium Pashmina Shawl
```
Name: Premium Pashmina Shawl
Tag #: PSH-001
Category: Shawls
Description: 100% pure Kashmiri Pashmina, hand-woven
by skilled craftsmen. Comes in various colors.
Dimensions: 180cm x 90cm
Ideal for: Winter wear, gift, traditional events
```

#### Product 2: Kesar (Saffron)
```
Name: Premium Kesar - 1 KG
Tag #: KSR-001
Category: Saffron
Description: Finest quality Kashmiri saffron from 
Pampore. Rich flavor and aroma. Perfect for cooking,
desserts, and gift purposes.
Weight: 1 KG (50g pouches)
Usage: Add 4-5 strands to 1 cup hot water
```

#### Product 3: Dry Fruits Mix
```
Name: Kashmiri Dry Fruits Mix - Premium
Tag #: DRY-001
Category: Dry Fruits
Description: Assorted premium dry fruits including
almonds, walnuts, raisins, and apricots from Kashmir.
Perfect for gifting and health-conscious snacking.
Contents: Mixed varieties
Shelf Life: 6 months
```

#### Product 4: Traditional Silk Suit
```
Name: Traditional Silk Suit - Maroon
Tag #: SUI-001
Category: Suits
Description: Traditional Kashmiri silk suit with 
embroidery. Perfect for festivals and special occasions.
Includes: Top, Bottom, Dupatta (stole)
Size: Standard (can be customized)
Color: Maroon with gold embroidery
```

---

## Step 4: Configure Categories in Code

### File: `packages/pages/src/components/catalog/ProductGrid.tsx`

The categories are configurable. Currently set to:
```typescript
const CATEGORIES = [
  'All',
  'Shawls',
  'Suits',
  'Stoles',
  'Dry Fruits',
  'Kesar',
  'Handicrafts'
];
```

You can modify categories to match your products.

---

## Step 5: Customize Product Display

### Company Name & Branding

**File:** `packages/pages/src/App.tsx`

```typescript
const appConfig = {
  name: "🧣 Lone Crafts",
  subtitle: "Premium Kashmiri Products",
  tagline: "Hand-picked authentic Kashmiri items"
};
```

You can change:
- Company name
- Subtitle
- Logo/emoji
- Welcome message

---

## Step 6: WhatsApp Message Template

### Default Message Format

When customer places order, they send:
```
🛒 Order from Lone Crafts:

Items:
- Pashmina Shawl (Tag #PSH-001) ×1
- Kesar Premium 1KG (Tag #KSR-001) ×2
- Dry Fruits Mix (Tag #DRY-001) ×1

Please provide pricing and confirm.

Product links:
https://lonecrafts.local/products/PSH-001
https://lonecrafts.local/products/KSR-001
https://lonecrafts.local/products/DRY-001
```

You can customize this in:
**File:** `packages/pages/src/components/catalog/Cart.tsx`

---

## Step 7: Admin Dashboard Customization

### Admin Features You'll Use

#### Daily Tasks:
```
1. Admin Panel → Products
   ├─ View all products
   ├─ Check which are active
   └─ Make updates

2. Admin Panel → Customers
   ├─ See all customers
   ├─ View their balances
   └─ Add new customers

3. Admin Panel → Billing
   ├─ Select customer
   ├─ Create bill with custom rates
   ├─ Share bill on WhatsApp
   └─ Record payments
```

---

## Step 8: Pricing Strategy Setup

### Your Pricing Flexibility

The system allows **per-customer custom pricing**:

```
Example 1: Wholesale Pricing
Customer: Rajesh Kumar (Bulk Buyer)
Pashmina Shawl: ₹2,000 each (you give discount)

Example 2: Retail Pricing  
Customer: Priya Sharma (Individual)
Pashmina Shawl: ₹2,500 each (full price)

Example 3: Special Offer
Customer: VIP Customer
Any product: 20% discount
```

When creating bill:
```
1. Select customer
2. Add product
3. Enter CUSTOM rate for that customer
4. System calculates automatically
```

---

## Step 9: Payment Methods Setup

### Supported Payment Methods

When recording payment:
- 📱 **UPI** (Google Pay, PhonePe, etc.)
- 🏦 **Bank Transfer**
- 💵 **Cash** (COD - Cash on Delivery)
- ✅ **Check**

You can add others in the code if needed.

---

## Step 10: Test Flow

### Complete Test (10 minutes)

1. **As Customer:**
   - Open http://localhost:5173
   - Browse products (note: no prices)
   - Add 2-3 items to cart
   - Click "Place Order via WhatsApp"
   - Verify message is formatted correctly

2. **As Admin:**
   - Click admin login
   - Enter your admin password
   - Go to Products → verify all items show
   - Go to Customers → add test customer
   - Go to Billing → select customer
   - Create test bill with the items
   - Click "Share Bill WhatsApp"
   - Verify bill message

3. **Verify WhatsApp Integration:**
   - Check that WhatsApp opens correctly
   - Message auto-fills with items
   - Links and quantities are correct

---

## Customization Examples

### Change: Product Photo

1. Admin → Products
2. Click Edit on product
3. Upload new photo (JPG, PNG, WebP)
4. Save
5. Photo stored in Cloudflare R2 cloud

### Change: Product Price (Different Per Customer)

1. Admin → Billing
2. Select customer
3. Add product to bill
4. Enter custom rate in "Rate" column
5. System auto-calculates subtotal
6. Different customer = different rate = no problem!

### Change: Add New Category

1. File: `packages/pages/src/components/catalog/ProductGrid.tsx`
2. Modify:
```typescript
const CATEGORIES = [
  'All',
  'Shawls',
  'Suits',
  'Stoles',
  'Dry Fruits',
  'Kesar',
  'Handicrafts',
  'YOUR_NEW_CATEGORY'  ← Add here
];
```
3. Save and refresh browser

---

## Common Customizations

### Q: How to hide a product from customers?

**A:** Admin → Products → Click Edit → Uncheck "Active" → Save

Product still exists in system but customer can't see it.

### Q: How to set different prices for different customers?

**A:** Create bill → Select customer → Add product → Set custom rate for that customer

Same product, different rates, system tracks correctly.

### Q: How to track who owes money?

**A:** Admin → Customers

See red warning showing outstanding balance per customer.

### Q: How to send bill reminder?

**A:** Admin → Billing → Select customer → Click "Share Bill WhatsApp"

Bill sent to customer with updated balance.

---

## File Structure to Remember

```
packages/pages/
├── src/
│   ├── App.tsx                    (Main app & routing)
│   ├── config.ts                  (API settings)
│   ├── store.ts                   (Cart state)
│   ├── components/
│   │   ├── catalog/
│   │   │   ├── ProductGrid.tsx    (Product display)
│   │   │   └── Cart.tsx           (Shopping cart)
│   │   └── admin/
│   │       ├── ProductManagement.tsx
│   │       ├── CustomerManagement.tsx
│   │       └── BillingSystem.tsx
│   └── utils/
│       ├── api.ts                 (API calls)
│       └── format.ts              (Format numbers, dates)

packages/workers/
├── src/
│   ├── index.ts                   (API router)
│   └── routes/                    (API endpoints)
│       ├── products.ts
│       ├── customers.ts
│       ├── billing.ts
│       └── auth.ts

packages/db/
└── migrations/
    └── 001_init_schema.sql        (Database setup)
```

---

## Ready to Launch?

✅ **All customizations are optional** - system works out of the box

✅ **Start simple** - add products, test with 1 customer

✅ **Scale gradually** - add more customers, more products

✅ **Customize as needed** - adjust prices, categories, messaging

---

## Next Steps

1. **Install:** `npm install --no-audit`
2. **Configure:** Create `.env` file with your details
3. **Start:** Run dev servers
4. **Add Products:** 5-10 Kashmiri items
5. **Test:** Full order-to-bill workflow
6. **Launch:** Go live!

---

**Questions?** Refer to:
- `QUICKSTART.md` - Quick setup
- `KASHMIRI_PRODUCTS_GUIDE.md` - Business workflow
- `TESTING_GUIDE.md` - Testing scenarios
- `API_DOCUMENTATION.md` - Technical details

**Ready!** 🚀
