-- Migration 002: Seed initial data
-- Adds sample products, customers, and settings for quick demo/testing

-- Insert sample products (Lone Crafts product categories)
INSERT INTO products (id, tag_number, name, description, category, image_url, active, created_at) VALUES
  (lower(hex(randomblob(16))), 'TC-001', 'Macramé Wall Hanging', 'Handmade bohemian wall hanging with natural cotton cord', 'Home Decor', NULL, 1, datetime('now')),
  (lower(hex(randomblob(16))), 'TC-002', 'Macramé Plant Hanger', 'Elegant macramé plant hanger with wooden bead', 'Garden', NULL, 1, datetime('now')),
  (lower(hex(randomblob(16))), 'TC-003', 'Dreamcatcher Wall Art', 'Authentic dreamcatcher with feathers and beads', 'Home Decor', NULL, 1, datetime('now')),
  (lower(hex(randomblob(16))), 'TC-004', 'Macramé Jewelry Set', 'Set of 3 adjustable macramé bracelets with charm', 'Jewelry', NULL, 1, datetime('now')),
  (lower(hex(randomblob(16))), 'TC-005', 'Boho Wall Shelf', 'Macramé wall shelf with wooden plank', 'Home Decor', NULL, 1, datetime('now'));

-- Insert sample customer
INSERT INTO customers (id, name, email, phone, created_at) VALUES
  (lower(hex(randomblob(16))), 'Sana Ali', 'sana@lonecrafts.com', '919906786291', datetime('now'));

-- Create a sample bill for the customer (will use a subquery to get customer_id)
WITH last_customer AS (
  SELECT id FROM customers ORDER BY created_at DESC LIMIT 1
)
INSERT INTO bills (id, bill_number, customer_id, total, created_at)
SELECT
  lower(hex(randomblob(16))),
  'BILL-' || strftime('%s', 'now'),
  id,
  0,
  datetime('now')
FROM last_customer;

-- Note: Actual bill_items and payments will be added through the admin panel
-- This seed data provides a starting point for testing the system