# API Documentation

## Base URL

- Development: `http://localhost:8787/api`
- Production: `https://api.lonecrafts.com/api` (configure in wrangler.toml)

## Authentication

All admin routes require Bearer token authentication:

```
Authorization: Bearer <token>
```

Obtain token via POST `/auth/login` with admin password.

## Public Endpoints

### GET /products
List all active products

**Query Parameters:**
- `category` (optional): Filter by category

**Response:**
```json
[
  {
    "id": "uuid",
    "tagNumber": "TAG001",
    "name": "Product Name",
    "description": "Product description",
    "category": "Category Name",
    "imageUrl": "r2://bucket/path/to/image.jpg",
    "active": true
  }
]
```

### GET /settings
Get public settings (WhatsApp number)

**Response:**
```json
{
  "whatsappNumber": "919876543210"
}
```

### POST /auth/login
Authenticate as admin

**Request:**
```json
{
  "password": "admin_password"
}
```

**Response:**
```json
{
  "token": "eyJhbGc..."
}
```

## Admin Endpoints

### GET /admin/products
List all products (including inactive)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** Same as public products list

### POST /admin/products
Create new product

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
- `tagNumber`: Unique product tag
- `name`: Product name
- `description`: Product description
- `category`: Product category
- `image`: Product image file (optional)

**Response:**
```json
{
  "id": "uuid",
  "tagNumber": "TAG001",
  "name": "Product Name",
  "description": "Product description",
  "category": "Category Name",
  "imageUrl": "r2://bucket/path/to/image.jpg",
  "active": true
}
```

### PUT /admin/products/:id
Update product

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:** Same as POST /admin/products

### PATCH /admin/products/:id
Toggle product active status

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "active": false
}
```

### DELETE /admin/products/:id
Delete product

**Headers:**
```
Authorization: Bearer <token>
```

### GET /admin/customers
List all customers with their billing summary

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Customer Name",
    "email": "customer@example.com",
    "phone": "9876543210",
    "totalPurchases": 10000,
    "totalPayments": 5000,
    "outstandingBalance": 5000,
    "billCount": 5
  }
]
```

### POST /admin/customers
Create new customer

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "9876543210"
}
```

### GET /admin/customers/:customerId/bills
Get customer's billing history

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "billNumber": "BILL-1234567890",
    "customerId": "uuid",
    "total": 5000,
    "paidAmount": 3000,
    "outstanding": 2000,
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

### POST /admin/bills
Create new bill

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "customerId": "uuid",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "rate": 500
    }
  ]
}
```

**Response:**
```json
{
  "id": "uuid",
  "billNumber": "BILL-1234567890",
  "total": 1000
}
```

### POST /admin/bills/:billId/payments
Record payment for bill

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "amount": 500,
  "paymentMethod": "cash",
  "reference": "Reference number"
}
```

**Response:**
```json
{
  "id": "uuid",
  "amount": 500
}
```

### GET /admin/bills/:billId
Get bill details with items and payments

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "billNumber": "BILL-1234567890",
  "customerId": "uuid",
  "total": 5000,
  "items": [
    {
      "id": "uuid",
      "productId": "uuid",
      "quantity": 2,
      "rate": 2500,
      "subtotal": 5000
    }
  ],
  "payments": [
    {
      "id": "uuid",
      "amount": 3000,
      "paymentMethod": "cash",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

### Common Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Server Error
