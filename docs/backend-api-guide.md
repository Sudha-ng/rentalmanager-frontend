# Backend API Requirements for Basic Authentication

## Overview
This document describes the simple backend API endpoints needed for the authentication system. Passwords can be stored as plain text in the database for development purposes (not recommended for production).

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- Plain text password
    role VARCHAR(50) NOT NULL CHECK (role IN ('OWNER', 'CUSTOMER')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email)
);
```

## Required API Endpoints

### 1. Login
**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "token": "simple-jwt-token-or-session-id",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "OWNER",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }
}
```

**Response (Error - 401):**
```json
{
  "message": "Invalid username or password"
}
```

**Backend Logic:**
```javascript
// Example pseudo-code
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Find user in database
  const user = db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  
  // Generate simple token (or use session)
  const token = generateSimpleToken(user.id);
  
  res.json({
    token: token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone
    }
  });
});
```

---

### 2. Register/Signup
**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CUSTOMER",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response (Success - 201):**
```json
{
  "token": "simple-jwt-token-or-session-id",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "CUSTOMER",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }
}
```

**Response (Error - 400):**
```json
{
  "message": "Username or email already exists"
}
```

**Backend Logic:**
```javascript
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, role, firstName, lastName, phone } = req.body;
  
  // Check if user exists
  const existingUser = db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
  
  if (existingUser) {
    return res.status(400).json({ message: 'Username or email already exists' });
  }
  
  // Insert new user
  const result = db.query(
    'INSERT INTO users (username, email, password, role, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [username, email, password, role, firstName, lastName, phone]
  );
  
  const userId = result.insertId;
  
  // Generate token
  const token = generateSimpleToken(userId);
  
  res.status(201).json({
    token: token,
    user: {
      id: userId,
      username,
      email,
      role,
      firstName,
      lastName,
      phone
    }
  });
});
```

---

### 3. Forgot Password - Verify Email
**Endpoint:** `POST /api/auth/forgot-password`

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response (Success - 200):**
```json
{
  "message": "Email verified",
  "email": "john@example.com"
}
```

**Response (Error - 404):**
```json
{
  "message": "Email not found"
}
```

**Backend Logic:**
```javascript
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  
  const user = db.query('SELECT * FROM users WHERE email = ?', [email]);
  
  if (!user) {
    return res.status(404).json({ message: 'Email not found' });
  }
  
  res.json({
    message: 'Email verified',
    email: email
  });
});
```

---

### 4. Reset Password
**Endpoint:** `POST /api/auth/reset-password`

**Request:**
```json
{
  "email": "john@example.com",
  "newPassword": "newpassword123"
}
```

**Response (Success - 200):**
```json
{
  "message": "Password reset successful"
}
```

**Response (Error - 404):**
```json
{
  "message": "User not found"
}
```

**Backend Logic:**
```javascript
app.post('/api/auth/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  
  const result = db.query('UPDATE users SET password = ? WHERE email = ?', [newPassword, email]);
  
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json({ message: 'Password reset successful' });
});
```

---

## Token Generation (Simple Approach)

For basic authentication, you can use a simple token approach:

```javascript
// Simple token generation
function generateSimpleToken(userId) {
  // For basic auth, just encode user ID with timestamp
  const payload = Buffer.from(JSON.stringify({
    userId: userId,
    timestamp: Date.now()
  })).toString('base64');
  
  return payload;
}

// Token verification middleware
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
```

## Protected Endpoints

For all other API endpoints (properties, tenants, expenses, etc.), add the token verification:

```javascript
app.get('/api/properties', verifyToken, (req, res) => {
  // Get properties for the authenticated user
  const userId = req.userId;
  // ... your logic
});
```

## Sample Test Data

```sql
-- Insert sample users
INSERT INTO users (username, email, password, role, first_name, last_name, phone) VALUES
('admin', 'admin@rental.com', 'admin123', 'OWNER', 'Admin', 'User', '+1234567890'),
('owner1', 'owner@rental.com', 'owner123', 'OWNER', 'John', 'Smith', '+1234567891'),
('customer1', 'customer@rental.com', 'customer123', 'CUSTOMER', 'Jane', 'Doe', '+1234567892'),
('tenant1', 'tenant@rental.com', 'tenant123', 'CUSTOMER', 'Bob', 'Johnson', '+1234567893');
```

## Quick Test with cURL

```bash
# Test Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"newuser",
    "email":"newuser@example.com",
    "password":"password123",
    "role":"CUSTOMER",
    "firstName":"New",
    "lastName":"User"
  }'

# Test Forgot Password
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rental.com"}'

# Test Reset Password
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rental.com","newPassword":"newpass123"}'
```

## CORS Configuration

Make sure your backend allows requests from your frontend:

```javascript
// For Express.js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

## Notes

⚠️ **This is a basic authentication setup for development only.**

For production, you should:
- Use bcrypt or Argon2 to hash passwords
- Implement proper JWT tokens with expiration
- Add rate limiting for login attempts
- Use HTTPS only
- Implement proper session management
- Add CSRF protection
- Validate and sanitize all inputs
