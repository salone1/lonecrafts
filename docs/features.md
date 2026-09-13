# Features Guide

## Customer Features

### Product Browsing
- Browse 100+ products in the catalog
- Filter products by category
- View product details including:
  - Unique tag number
  - Product name and description
  - Product images from Cloudflare R2
  - NO pricing information displayed

### Shopping Cart
- Add multiple items to cart
- Update quantities
- Remove items from cart
- View cart summary

### Order Placement
1. **Option 1: "Order Now" from product**
   - Click "Order Now" on any product
   - Redirected to WhatsApp with auto-generated message
   - Message includes product name, tag number, and link

2. **Option 2: "Order Now" from cart**
   - Add products to cart
   - Click "Order Now" in cart view
   - Message auto-generated with all items, quantities, and product links
   - Customer quantity can be adjusted before ordering

### WhatsApp Integration
- Auto-generated order messages include:
  - Product names
  - Product tag numbers
  - Quantities ordered
  - Direct links to products
- Customers sent directly to shop's WhatsApp chat
- Enables real-time price negotiation and order confirmation

---

## Admin Features

### Dashboard Overview
- Quick overview of key metrics
- Recent customer activity
- Outstanding payments

### Product Management

**Create Products**
- Set unique tag number
- Add product name and description
- Assign category
- Upload product image (phone or computer)

**Edit Products**
- Update all product details
- Change product image
- Modify category or description

**Delete Products**
- Permanently remove products from catalog

**Visibility Control**
- Hide products from customer view (not deleted)
- Activate previously hidden products
- No effect on order history if product deleted

---

### Customer Management

**Add Customers**
- Create new customer records
- Store contact information (name, email, phone)

**View Customer Summary**
- Total number of bills
- Total purchases amount
- Total payments received
- Current outstanding balance

**Customer History**
- View all bills for each customer
- Chronological bill and payment history
- Track customer relationship over time

---

### Billing System

**Create Bills**
1. Select existing customer or create new one
2. Add products to bill
3. Manually enter quantity for each product
4. Manually enter rate/price for each product
5. System auto-calculates:
   - Subtotal for each item (quantity × rate)
   - Total bill amount

**Bill Features**
- Generate unique bill reference numbers
- Track multiple bills per customer
- Each bill contains:
  - Customer information
  - Bill items with quantities and rates
  - Total amount
  - Payments received
  - Outstanding balance

**Record Payments**
- Log partial or full payments against bills
- Multiple payment records per bill
- Track payment method and references
- Automatic outstanding balance calculation

**Customer Ledger**
- View complete customer history
- Track:
  - Total purchases across all bills
  - Total payments received
  - Current outstanding balance
- See all bills and payments in chronological order

---

## Price Management

### Key Difference from Traditional Systems

**Prices are NOT stored in the product database**

Instead:
- Prices are entered manually during billing
- Same product can have different prices for:
  - Different customers
  - Different dates/time periods
  - Different quantities (bulk discounts)
  - Different conditions or variants

This provides complete pricing flexibility for custom business needs.

---

## WhatsApp Order Flow

**Customer Side:**
1. Browse products (no prices shown)
2. Select products and quantities
3. Click "Order Now"
4. Automatic WhatsApp redirect with message containing:
   - Product names
   - Tag numbers
   - Quantities
   - Product links

**Admin Side:**
1. Receives WhatsApp order message
2. Quotes price to customer
3. Creates bill in system with agreed price
4. Sends payment request
5. Tracks payment and outstanding balance

---

## Reporting

### Customer Dashboard

Shows all customers with:
- Customer name and contact info
- Number of bills
- Total purchases amount
- Total payments received
- Outstanding balance
- Direct link to view full history

### Detailed Customer History

For each customer view:
- Complete chronological list of bills
- Bill number, date, and total amount
- Payment details with dates
- Running balance calculations
- Outstanding amount for each bill

---

## Data Management

### Image Storage
- All product images stored in Cloudflare R2
- Upload directly from phone or computer
- Auto-scaling and optimization
- Secure URLs for customer viewing

### Backup & Security
- Cloudflare D1 provides automatic backups
- R2 storage has versioning capability
- Data encrypted at rest
- Access controlled via authentication

### Customer Privacy
- Prices not exposed to customers
- Order details secure through WhatsApp
- Billing information in secure admin panel
- No public customer lists or information exposed
