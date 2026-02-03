# Complete Backend API Specification for Rental Portal

## Base URL
```
http://localhost:3000/api
```

## Common Headers

All authenticated endpoints require:
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 1. AUTHENTICATION ENDPOINTS

### 1.1 Login
**Endpoint:** `POST /api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@rental.com",
    "role": "OWNER",
    "firstName": "Admin",
    "lastName": "User",
    "phone": "+1234567890"
  }
}
```

**Error Response (401):**
```json
{
  "message": "Invalid username or password"
}
```

---

### 1.2 Register/Signup
**Endpoint:** `POST /api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
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

**Success Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "CUSTOMER",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Username or email already exists"
}
```

---

### 1.3 Forgot Password
**Endpoint:** `POST /api/auth/forgot-password`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@rental.com"
}
```

**Success Response (200):**
```json
{
  "message": "Email verified",
  "email": "admin@rental.com"
}
```

**Error Response (404):**
```json
{
  "message": "Email not found"
}
```

---

### 1.4 Reset Password
**Endpoint:** `POST /api/auth/reset-password`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@rental.com",
  "newPassword": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset successful"
}
```

**Error Response (404):**
```json
{
  "message": "User not found"
}
```

---

## 2. PROPERTY ENDPOINTS

### 2.1 Get All Properties
**Endpoint:** `GET /api/properties`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Sunset Apartments",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "propertyType": "Apartment",
    "numberOfUnits": 20,
    "purchasePrice": 500000,
    "marketValue": 550000,
    "createdAt": "2026-01-01T00:00:00Z"
  }
]
```

---

### 2.2 Get Property by ID
**Endpoint:** `GET /api/properties/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Sunset Apartments",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "propertyType": "Apartment",
  "numberOfUnits": 20,
  "purchasePrice": 500000,
  "marketValue": 550000,
  "createdAt": "2026-01-01T00:00:00Z"
}
```

---

### 2.3 Create Property
**Endpoint:** `POST /api/properties`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Sunset Apartments",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "propertyType": "Apartment",
  "numberOfUnits": 20,
  "purchasePrice": 500000,
  "marketValue": 550000
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "name": "Sunset Apartments",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "propertyType": "Apartment",
  "numberOfUnits": 20,
  "purchasePrice": 500000,
  "marketValue": 550000,
  "createdAt": "2026-01-23T10:00:00Z"
}
```

---

### 2.4 Update Property
**Endpoint:** `PUT /api/properties/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Sunset Apartments Updated",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "propertyType": "Apartment",
  "numberOfUnits": 25,
  "purchasePrice": 500000,
  "marketValue": 600000
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Sunset Apartments Updated",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "propertyType": "Apartment",
  "numberOfUnits": 25,
  "purchasePrice": 500000,
  "marketValue": 600000,
  "updatedAt": "2026-01-23T11:00:00Z"
}
```

---

### 2.5 Delete Property
**Endpoint:** `DELETE /api/properties/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (204):**
```
No content
```

---

## 3. TENANT ENDPOINTS

### 3.1 Get All Tenants
**Endpoint:** `GET /api/tenants`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-15",
    "ssn": "123-45-6789",
    "employmentStatus": "Employed",
    "employer": "ABC Company",
    "monthlyIncome": 5000,
    "createdAt": "2026-01-01T00:00:00Z"
  }
]
```

---

### 3.2 Get Tenant by ID
**Endpoint:** `GET /api/tenants/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-15",
  "ssn": "123-45-6789",
  "employmentStatus": "Employed",
  "employer": "ABC Company",
  "monthlyIncome": 5000,
  "createdAt": "2026-01-01T00:00:00Z"
}
```

---

### 3.3 Create Tenant
**Endpoint:** `POST /api/tenants`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-15",
  "ssn": "123-45-6789",
  "employmentStatus": "Employed",
  "employer": "ABC Company",
  "monthlyIncome": 5000
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-15",
  "ssn": "123-45-6789",
  "employmentStatus": "Employed",
  "employer": "ABC Company",
  "monthlyIncome": 5000,
  "createdAt": "2026-01-23T10:00:00Z"
}
```

---

### 3.4 Update Tenant
**Endpoint:** `PUT /api/tenants/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-15",
  "ssn": "123-45-6789",
  "employmentStatus": "Employed",
  "employer": "XYZ Corporation",
  "monthlyIncome": 6000
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-15",
  "ssn": "123-45-6789",
  "employmentStatus": "Employed",
  "employer": "XYZ Corporation",
  "monthlyIncome": 6000,
  "updatedAt": "2026-01-23T11:00:00Z"
}
```

---

### 3.5 Delete Tenant
**Endpoint:** `DELETE /api/tenants/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (204):**
```
No content
```

---

## 4. LEASE ENDPOINTS

### 4.1 Get All Leases
**Endpoint:** `GET /api/leases`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "propertyId": 1,
    "tenantId": 1,
    "unitNumber": "101",
    "startDate": "2026-01-01",
    "endDate": "2026-12-31",
    "monthlyRent": 1500,
    "securityDeposit": 3000,
    "leaseStatus": "Active",
    "createdAt": "2026-01-01T00:00:00Z"
  }
]
```

---

### 4.2 Get Lease by ID
**Endpoint:** `GET /api/leases/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "id": 1,
  "propertyId": 1,
  "tenantId": 1,
  "unitNumber": "101",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "monthlyRent": 1500,
  "securityDeposit": 3000,
  "leaseStatus": "Active",
  "createdAt": "2026-01-01T00:00:00Z"
}
```

---

### 4.3 Create Lease
**Endpoint:** `POST /api/leases`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "propertyId": 1,
  "tenantId": 1,
  "unitNumber": "101",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "monthlyRent": 1500,
  "securityDeposit": 3000,
  "leaseStatus": "Active"
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "propertyId": 1,
  "tenantId": 1,
  "unitNumber": "101",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "monthlyRent": 1500,
  "securityDeposit": 3000,
  "leaseStatus": "Active",
  "createdAt": "2026-01-23T10:00:00Z"
}
```

---

### 4.4 Update Lease
**Endpoint:** `PUT /api/leases/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "propertyId": 1,
  "tenantId": 1,
  "unitNumber": "101",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "monthlyRent": 1600,
  "securityDeposit": 3200,
  "leaseStatus": "Active"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "propertyId": 1,
  "tenantId": 1,
  "unitNumber": "101",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "monthlyRent": 1600,
  "securityDeposit": 3200,
  "leaseStatus": "Active",
  "updatedAt": "2026-01-23T11:00:00Z"
}
```

---

### 4.5 Delete Lease
**Endpoint:** `DELETE /api/leases/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (204):**
```
No content
```

---

## 5. EXPENSE ENDPOINTS

### 5.1 Get All Expenses
**Endpoint:** `GET /api/expenses`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "propertyId": 1,
    "expenseTypeId": 1,
    "amount": 500,
    "date": "2026-01-15",
    "description": "Plumbing repair in unit 101",
    "vendor": "ABC Plumbing",
    "paymentMethod": "Credit Card",
    "createdAt": "2026-01-15T00:00:00Z"
  }
]
```

---

### 5.2 Get Expense by ID
**Endpoint:** `GET /api/expenses/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "id": 1,
  "propertyId": 1,
  "expenseTypeId": 1,
  "amount": 500,
  "date": "2026-01-15",
  "description": "Plumbing repair in unit 101",
  "vendor": "ABC Plumbing",
  "paymentMethod": "Credit Card",
  "createdAt": "2026-01-15T00:00:00Z"
}
```

---

### 5.3 Create Expense
**Endpoint:** `POST /api/expenses`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "propertyId": 1,
  "expenseTypeId": 1,
  "amount": 500,
  "date": "2026-01-15",
  "description": "Plumbing repair in unit 101",
  "vendor": "ABC Plumbing",
  "paymentMethod": "Credit Card"
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "propertyId": 1,
  "expenseTypeId": 1,
  "amount": 500,
  "date": "2026-01-15",
  "description": "Plumbing repair in unit 101",
  "vendor": "ABC Plumbing",
  "paymentMethod": "Credit Card",
  "createdAt": "2026-01-23T10:00:00Z"
}
```

---

### 5.4 Update Expense
**Endpoint:** `PUT /api/expenses/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "propertyId": 1,
  "expenseTypeId": 1,
  "amount": 550,
  "date": "2026-01-15",
  "description": "Plumbing repair in unit 101 - Updated",
  "vendor": "ABC Plumbing",
  "paymentMethod": "Credit Card"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "propertyId": 1,
  "expenseTypeId": 1,
  "amount": 550,
  "date": "2026-01-15",
  "description": "Plumbing repair in unit 101 - Updated",
  "vendor": "ABC Plumbing",
  "paymentMethod": "Credit Card",
  "updatedAt": "2026-01-23T11:00:00Z"
}
```

---

### 5.5 Delete Expense
**Endpoint:** `DELETE /api/expenses/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (204):**
```
No content
```

---

## 6. EXPENSE TYPE ENDPOINTS

### 6.1 Get All Expense Types
**Endpoint:** `GET /api/expense-types`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Maintenance",
    "description": "General maintenance and repairs",
    "createdAt": "2026-01-01T00:00:00Z"
  }
]
```

---

### 6.2 Get Expense Type by ID
**Endpoint:** `GET /api/expense-types/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Maintenance",
  "description": "General maintenance and repairs",
  "createdAt": "2026-01-01T00:00:00Z"
}
```

---

### 6.3 Create Expense Type
**Endpoint:** `POST /api/expense-types`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Maintenance",
  "description": "General maintenance and repairs"
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "name": "Maintenance",
  "description": "General maintenance and repairs",
  "createdAt": "2026-01-23T10:00:00Z"
}
```

---

### 6.4 Update Expense Type
**Endpoint:** `PUT /api/expense-types/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Maintenance & Repairs",
  "description": "General maintenance and repairs for properties"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Maintenance & Repairs",
  "description": "General maintenance and repairs for properties",
  "updatedAt": "2026-01-23T11:00:00Z"
}
```

---

### 6.5 Delete Expense Type
**Endpoint:** `DELETE /api/expense-types/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (204):**
```
No content
```

---

## 7. INCOME ENDPOINTS

### 7.1 Get All Income
**Endpoint:** `GET /api/income`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "propertyId": 1,
    "leaseId": 1,
    "amount": 1500,
    "date": "2026-01-01",
    "description": "January rent payment",
    "paymentMethod": "Bank Transfer",
    "incomeType": "Rent",
    "createdAt": "2026-01-01T00:00:00Z"
  }
]
```

---

### 7.2 Get Income by ID
**Endpoint:** `GET /api/income/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "id": 1,
  "propertyId": 1,
  "leaseId": 1,
  "amount": 1500,
  "date": "2026-01-01",
  "description": "January rent payment",
  "paymentMethod": "Bank Transfer",
  "incomeType": "Rent",
  "createdAt": "2026-01-01T00:00:00Z"
}
```

---

### 7.3 Create Income
**Endpoint:** `POST /api/income`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "propertyId": 1,
  "leaseId": 1,
  "amount": 1500,
  "date": "2026-01-01",
  "description": "January rent payment",
  "paymentMethod": "Bank Transfer",
  "incomeType": "Rent"
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "propertyId": 1,
  "leaseId": 1,
  "amount": 1500,
  "date": "2026-01-01",
  "description": "January rent payment",
  "paymentMethod": "Bank Transfer",
  "incomeType": "Rent",
  "createdAt": "2026-01-23T10:00:00Z"
}
```

---

### 7.4 Update Income
**Endpoint:** `PUT /api/income/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "propertyId": 1,
  "leaseId": 1,
  "amount": 1500,
  "date": "2026-01-01",
  "description": "January rent payment - Updated",
  "paymentMethod": "Bank Transfer",
  "incomeType": "Rent"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "propertyId": 1,
  "leaseId": 1,
  "amount": 1500,
  "date": "2026-01-01",
  "description": "January rent payment - Updated",
  "paymentMethod": "Bank Transfer",
  "incomeType": "Rent",
  "updatedAt": "2026-01-23T11:00:00Z"
}
```

---

### 7.5 Delete Income
**Endpoint:** `DELETE /api/income/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (204):**
```
No content
```

---

## 8. EMERGENCY CONTACT ENDPOINTS

### 8.1 Get All Emergency Contacts
**Endpoint:** `GET /api/emergency-contacts`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "tenantId": 1,
    "firstName": "Jane",
    "lastName": "Smith",
    "relationship": "Sister",
    "phone": "+1987654321",
    "email": "jane.smith@example.com",
    "address": "456 Oak Ave, New York, NY 10002",
    "createdAt": "2026-01-01T00:00:00Z"
  }
]
```

---

### 8.2 Get Emergency Contact by ID
**Endpoint:** `GET /api/emergency-contacts/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "id": 1,
  "tenantId": 1,
  "firstName": "Jane",
  "lastName": "Smith",
  "relationship": "Sister",
  "phone": "+1987654321",
  "email": "jane.smith@example.com",
  "address": "456 Oak Ave, New York, NY 10002",
  "createdAt": "2026-01-01T00:00:00Z"
}
```

---

### 8.3 Create Emergency Contact
**Endpoint:** `POST /api/emergency-contacts`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "tenantId": 1,
  "firstName": "Jane",
  "lastName": "Smith",
  "relationship": "Sister",
  "phone": "+1987654321",
  "email": "jane.smith@example.com",
  "address": "456 Oak Ave, New York, NY 10002"
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "tenantId": 1,
  "firstName": "Jane",
  "lastName": "Smith",
  "relationship": "Sister",
  "phone": "+1987654321",
  "email": "jane.smith@example.com",
  "address": "456 Oak Ave, New York, NY 10002",
  "createdAt": "2026-01-23T10:00:00Z"
}
```

---

### 8.4 Update Emergency Contact
**Endpoint:** `PUT /api/emergency-contacts/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "tenantId": 1,
  "firstName": "Jane",
  "lastName": "Smith",
  "relationship": "Sister",
  "phone": "+1987654321",
  "email": "jane.smith.updated@example.com",
  "address": "456 Oak Ave, New York, NY 10002"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "tenantId": 1,
  "firstName": "Jane",
  "lastName": "Smith",
  "relationship": "Sister",
  "phone": "+1987654321",
  "email": "jane.smith.updated@example.com",
  "address": "456 Oak Ave, New York, NY 10002",
  "updatedAt": "2026-01-23T11:00:00Z"
}
```

---

### 8.5 Delete Emergency Contact
**Endpoint:** `DELETE /api/emergency-contacts/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (204):**
```
No content
```

---

## 9. DATABASE SCHEMA

### 9.1 Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('OWNER', 'CUSTOMER')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
);
```

---

### 9.2 Properties Table
```sql
CREATE TABLE properties (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    property_type VARCHAR(100),
    number_of_units INT,
    purchase_price DECIMAL(15, 2),
    market_value DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_city (city),
    INDEX idx_property_type (property_type)
);
```

---

### 9.3 Tenants Table
```sql
CREATE TABLE tenants (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE,
    ssn VARCHAR(20),
    employment_status VARCHAR(50),
    employer VARCHAR(255),
    monthly_income DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_last_name (last_name)
);
```

---

### 9.4 Leases Table
```sql
CREATE TABLE leases (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    property_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    unit_number VARCHAR(50),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent DECIMAL(15, 2) NOT NULL,
    security_deposit DECIMAL(15, 2),
    lease_status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_property_id (property_id),
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_lease_status (lease_status)
);
```

---

### 9.5 Expense Types Table
```sql
CREATE TABLE expense_types (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name)
);
```

---

### 9.6 Expenses Table
```sql
CREATE TABLE expenses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    property_id BIGINT NOT NULL,
    expense_type_id BIGINT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    vendor VARCHAR(255),
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (expense_type_id) REFERENCES expense_types(id) ON DELETE RESTRICT,
    INDEX idx_property_id (property_id),
    INDEX idx_expense_type_id (expense_type_id),
    INDEX idx_date (date)
);
```

---

### 9.7 Income Table
```sql
CREATE TABLE income (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    property_id BIGINT NOT NULL,
    lease_id BIGINT,
    amount DECIMAL(15, 2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    payment_method VARCHAR(50),
    income_type VARCHAR(100) DEFAULT 'Rent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (lease_id) REFERENCES leases(id) ON DELETE SET NULL,
    INDEX idx_property_id (property_id),
    INDEX idx_lease_id (lease_id),
    INDEX idx_date (date),
    INDEX idx_income_type (income_type)
);
```

---

### 9.8 Emergency Contacts Table
```sql
CREATE TABLE emergency_contacts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id BIGINT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_tenant_id (tenant_id)
);
```

---

## 10. SAMPLE DATA INSERTION

### 10.1 Sample Users
```sql
INSERT INTO users (username, email, password, role, first_name, last_name, phone) VALUES
('admin', 'admin@rental.com', 'admin123', 'OWNER', 'Admin', 'User', '+1234567890'),
('owner1', 'owner@rental.com', 'owner123', 'OWNER', 'John', 'Smith', '+1234567891'),
('customer1', 'customer@rental.com', 'customer123', 'CUSTOMER', 'Jane', 'Doe', '+1234567892');
```

### 10.2 Sample Properties
```sql
INSERT INTO properties (name, address, city, state, zip_code, property_type, number_of_units, purchase_price, market_value) VALUES
('Sunset Apartments', '123 Main St', 'New York', 'NY', '10001', 'Apartment', 20, 500000, 550000),
('Ocean View Complex', '456 Beach Blvd', 'Miami', 'FL', '33101', 'Condo', 15, 800000, 900000);
```

### 10.3 Sample Expense Types
```sql
INSERT INTO expense_types (name, description) VALUES
('Maintenance', 'General maintenance and repairs'),
('Utilities', 'Water, electricity, gas'),
('Insurance', 'Property insurance'),
('Property Tax', 'Annual property taxes'),
('Landscaping', 'Lawn care and landscaping');
```

---

## 11. ERROR CODES

| Status Code | Description |
|------------|-------------|
| 200 | Success - Request completed successfully |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request successful, no content to return |
| 400 | Bad Request - Invalid request format or missing required fields |
| 401 | Unauthorized - Authentication failed or token invalid |
| 403 | Forbidden - User doesn't have permission for this resource |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists (e.g., duplicate username) |
| 500 | Internal Server Error - Server error occurred |

---

## 12. CORS CONFIGURATION

Enable CORS for frontend URL:
```javascript
// For Express.js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

---

## 13. TOKEN VERIFICATION MIDDLEWARE

All endpoints except authentication require token verification:

```javascript
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Apply to protected routes
app.get('/api/properties', verifyToken, (req, res) => {
  // Your logic here
});
```

---

## 14. POSTMAN COLLECTION VARIABLES

Set these variables in Postman:
- `baseUrl`: http://localhost:3000/api
- `token`: (Will be set automatically after login)

After successful login, use this test script in Postman:
```javascript
pm.test("Set token", function () {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
});
```

---

## 15. TESTING ENDPOINTS

### Using cURL:

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Get Properties (with token):**
```bash
curl -X GET http://localhost:3000/api/properties \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**Create Property:**
```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Property",
    "address": "123 Test St",
    "city": "Test City",
    "state": "TS",
    "zipCode": "12345",
    "propertyType": "House",
    "numberOfUnits": 1,
    "purchasePrice": 200000,
    "marketValue": 220000
  }'
```

---

## END OF SPECIFICATION

This specification covers all the API endpoints needed for the Rental Portal application. Share this document with your backend developer to implement the API and database.
