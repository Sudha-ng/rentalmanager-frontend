# User Table Schema for Authentication

This document describes the database schema for the `users` table that supports role-based authentication.

## Table: users

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,  -- Store hashed password, never plain text
    role VARCHAR(50) NOT NULL CHECK (role IN ('OWNER', 'CUSTOMER')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
);
```

## Column Descriptions

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key, auto-incrementing |
| username | VARCHAR(100) | Unique username for login |
| email | VARCHAR(255) | User's email address (unique) |
| password_hash | VARCHAR(255) | Hashed password (use bcrypt or similar) |
| role | VARCHAR(50) | User role: 'OWNER' or 'CUSTOMER' |
| first_name | VARCHAR(100) | User's first name |
| last_name | VARCHAR(100) | User's last name |
| phone | VARCHAR(20) | Optional phone number |
| is_active | BOOLEAN | Whether the account is active |
| created_at | TIMESTAMP | Account creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| last_login | TIMESTAMP | Last successful login time |

## Role Descriptions

### OWNER
- Full access to property management features
- Can create, edit, and delete properties
- Can manage expenses, income, and expense types
- Can manage tenants and leases
- Has administrative privileges

### CUSTOMER
- Limited access to tenant-related features
- Can view their own lease information
- Can view their payment history
- Cannot create or edit properties
- Cannot manage other tenants

## Sample Data

```sql
-- Sample Owner User
INSERT INTO users (username, email, password_hash, role, first_name, last_name, phone)
VALUES ('owner_admin', 'owner@rental.com', '$2a$10$...hashedpassword...', 'OWNER', 'John', 'Smith', '+1234567890');

-- Sample Customer/Tenant User
INSERT INTO users (username, email, password_hash, role, first_name, last_name, phone)
VALUES ('tenant_user', 'tenant@example.com', '$2a$10$...hashedpassword...', 'CUSTOMER', 'Jane', 'Doe', '+1987654321');
```

## Security Notes

1. **Password Storage**: Always hash passwords using bcrypt, Argon2, or similar secure hashing algorithms. Never store plain text passwords.
2. **Token Generation**: Use JWT (JSON Web Tokens) for authentication with appropriate expiration times.
3. **Password Requirements**: Enforce strong password policies (minimum length, complexity).
4. **Rate Limiting**: Implement rate limiting on login attempts to prevent brute force attacks.
5. **HTTPS**: Always use HTTPS in production to protect credentials in transit.

## Backend API Endpoints Required

The frontend expects the following authentication endpoints:

- `POST /api/auth/login` - Login with username and password
  - Request: `{ username, password }`
  - Response: `{ token, user }`

- `POST /api/auth/register` - Register new user
  - Request: `{ username, email, password, role, firstName, lastName, phone }`
  - Response: `{ token, user }`

- `GET /api/auth/me` - Get current user info (optional)
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ user }`

- `POST /api/auth/logout` - Logout (optional, frontend handles token removal)

## Integration with Existing Tables

If you have existing tenant tables, you may want to:

1. Add a `user_id` foreign key to your `tenants` table
2. Link customer accounts to tenant records
3. Ensure proper data synchronization between users and tenants
