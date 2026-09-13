# Database Schema

## Tables

### products
Stores all product information

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | TEXT | PRIMARY KEY | Unique product ID (UUID) |
| tag_number | TEXT | UNIQUE NOT NULL | Unique product tag number |
| name | TEXT | NOT NULL | Product name |
| description | TEXT | - | Product description |
| category | TEXT | NOT NULL | Product category |
| image_url | TEXT | - | R2 bucket path to product image |
| active | INTEGER | DEFAULT 1 | Active status (0=hidden, 1=active) |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- category
- active
- combined (category, active)

---

### customers
Stores customer information

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | TEXT | PRIMARY KEY | Unique customer ID (UUID) |
| name | TEXT | NOT NULL | Customer name |
| email | TEXT | - | Customer email |
| phone | TEXT | - | Customer phone number |
| created_at | TEXT | NOT NULL | Creation timestamp |
| updated_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- phone (for quick lookup)

---

### bills
Stores billing records for customers

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | TEXT | PRIMARY KEY | Unique bill ID (UUID) |
| bill_number | TEXT | UNIQUE NOT NULL | Auto-generated bill reference |
| customer_id | TEXT | FOREIGN KEY | Reference to customer |
| total | REAL | DEFAULT 0 | Total bill amount |
| notes | TEXT | - | Additional notes |
| created_at | TEXT | NOT NULL | Bill creation date |
| updated_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Foreign Keys:**
- customer_id → customers.id (ON DELETE CASCADE)

**Indexes:**
- customer_id
- created_at

---

### bill_items
Stores individual line items for each bill

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | TEXT | PRIMARY KEY | Unique item ID (UUID) |
| bill_id | TEXT | FOREIGN KEY | Reference to bill |
| product_id | TEXT | FOREIGN KEY | Reference to product |
| quantity | INTEGER | NOT NULL | Item quantity |
| rate | REAL | NOT NULL | Price per unit |
| subtotal | REAL | NOT NULL | quantity × rate |

**Foreign Keys:**
- bill_id → bills.id (ON DELETE CASCADE)
- product_id → products.id (ON DELETE RESTRICT)

**Indexes:**
- bill_id

---

### payments
Stores payment records for bills

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| id | TEXT | PRIMARY KEY | Unique payment ID (UUID) |
| bill_id | TEXT | FOREIGN KEY | Reference to bill |
| amount | REAL | NOT NULL | Payment amount |
| payment_method | TEXT | - | Method (cash, card, etc.) |
| reference | TEXT | - | Payment reference number |
| created_at | TEXT | NOT NULL | Payment date |

**Foreign Keys:**
- bill_id → bills.id (ON DELETE CASCADE)

**Indexes:**
- bill_id

---

## Key Relationships

```
customers (1) ──── (N) bills
                      ├── (N) bill_items
                      │         └── (N) products
                      └── (N) payments
```

## Queries

### Get Customer Summary
```sql
SELECT 
  c.id, c.name, c.email,
  COUNT(DISTINCT b.id) as bill_count,
  COALESCE(SUM(b.total), 0) as total_purchases,
  COALESCE(SUM(p.amount), 0) as total_payments,
  COALESCE(SUM(b.total), 0) - COALESCE(SUM(p.amount), 0) as outstanding
FROM customers c
LEFT JOIN bills b ON c.id = b.customer_id
LEFT JOIN payments p ON b.id = p.bill_id
GROUP BY c.id
```

### Get Bill with Items and Payments
```sql
SELECT 
  b.*,
  COALESCE(SUM(p.amount), 0) as paid_amount,
  b.total - COALESCE(SUM(p.amount), 0) as outstanding
FROM bills b
LEFT JOIN payments p ON b.id = p.bill_id
WHERE b.id = ?
GROUP BY b.id
```

### Get Outstanding Bills for Customer
```sql
SELECT 
  b.*,
  COALESCE(SUM(p.amount), 0) as paid_amount,
  b.total - COALESCE(SUM(p.amount), 0) as outstanding
FROM bills b
LEFT JOIN payments p ON b.id = p.bill_id
WHERE b.customer_id = ? 
  AND (b.total - COALESCE(SUM(p.amount), 0)) > 0
GROUP BY b.id
ORDER BY b.created_at DESC
```
