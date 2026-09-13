# Authentication

## Overview

The Lone Crafts system uses JWT (JSON Web Token) based authentication for admin access. Customers access the catalog without authentication.

## Admin Authentication Flow

1. **Login**: Admin sends password to `/auth/login`
2. **Token Generation**: Server validates password and returns JWT token
3. **Token Storage**: Client stores token in localStorage
4. **Authenticated Requests**: Client includes token in `Authorization` header

## JWT Token Structure

```
Header: { alg: "HS256", typ: "JWT" }
Payload: { role: "admin", iat: timestamp, exp: timestamp + 24h }
Signature: HS256(secret)
```

## Security Considerations

- Tokens expire after 24 hours
- Tokens are signed with a secret key (stored as Cloudflare secret)
- HTTPS required in production (enforced by Cloudflare)
- Admin password must be strong (minimum 12 characters recommended)

## Implementation

### Login Endpoint

```bash
POST /api/auth/login
Content-Type: application/json

{
  "password": "admin_password"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (401):**
```json
{
  "error": "Invalid password"
}
```

### Using Token

Include in all admin requests:

```bash
Authorization: Bearer <token>
```

Example:
```bash
curl -H "Authorization: Bearer eyJhbGc..." \
  https://api.lonecrafts.com/api/admin/products
```

## Client-Side Implementation

```javascript
// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password })
});

const { token } = await loginResponse.json();
localStorage.setItem('adminToken', token);

// Use token in requests
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
};

const productsResponse = await fetch('/api/admin/products', { headers });
```

## Token Verification

The system verifies tokens on each request by:

1. Extracting token from Authorization header
2. Validating token signature
3. Checking token expiration
4. Proceeding with request or returning 401 Unauthorized

## Logout

To logout, simply remove the token from client storage:

```javascript
localStorage.removeItem('adminToken');
```

The token will become invalid after 24 hours automatically.

## Security Best Practices

1. **Never commit secrets** - Use environment variables/Cloudflare secrets
2. **Use HTTPS only** - Enforce in production
3. **Rotate credentials** - Change admin password regularly
4. **Use strong passwords** - Minimum 12 characters with mixed case, numbers, symbols
5. **Monitor access logs** - Check for suspicious activity
6. **Handle token storage** - Consider using httpOnly cookies instead of localStorage for higher security
