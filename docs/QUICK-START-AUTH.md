# 🚀 Quick Start Guide - Authentication System

## ✅ What's Been Created

### Frontend Components
- ✅ Login page with beautiful UI
- ✅ User authentication service
- ✅ Role-based route guards (OWNER/CUSTOMER)
- ✅ HTTP interceptor for automatic token injection
- ✅ User menu with profile info and logout
- ✅ Unauthorized access page

### Files Created
```
src/app/
├── components/auth/
│   ├── login/                    # Login page
│   └── unauthorized/             # Unauthorized access page
├── core/
│   ├── models/user.model.ts      # User types & interfaces
│   ├── services/auth.service.ts  # Authentication logic
│   ├── guards/auth.guard.ts      # Route protection
│   └── interceptors/auth.interceptor.ts
docs/
├── authentication-readme.md       # Full documentation
└── user-authentication-schema.md # Database schema
```

## 🎯 Quick Test

### 1. Start the Application
```bash
npm start
```

### 2. Access Login Page
Navigate to: `http://localhost:4200/login`

### 3. Test Login (Backend Required)
You'll need a backend API with:
- Endpoint: `POST /api/auth/login`
- Expected request:
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```
- Expected response:
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "username": "owner",
      "email": "owner@example.com",
      "role": "OWNER",
      "firstName": "John",
      "lastName": "Smith"
    }
  }
  ```

## 🗄️ Database Setup

### User Table SQL
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('OWNER', 'CUSTOMER')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);
```

### Sample Test Users
```sql
-- OWNER user (full access)
INSERT INTO users (username, email, password_hash, role, first_name, last_name)
VALUES ('admin', 'admin@rental.com', '$2a$10$...', 'OWNER', 'Admin', 'User');

-- CUSTOMER user (limited access)
INSERT INTO users (username, email, password_hash, role, first_name, last_name)
VALUES ('customer', 'customer@rental.com', '$2a$10$...', 'CUSTOMER', 'John', 'Doe');
```

## 🔐 How Authentication Works

1. **User logs in** → Username/password sent to backend
2. **Backend validates** → Returns JWT token + user info
3. **Token stored** → In browser's localStorage
4. **Auto-injection** → Token added to all API requests via interceptor
5. **Route protection** → Guards check authentication & role before navigation
6. **Logout** → Token cleared, redirect to login

## 📱 User Roles & Access

### OWNER Role Access
- ✅ Properties (create, edit, view)
- ✅ Income (create, edit, view)
- ✅ Expenses (create, edit, view)
- ✅ Expense Types (create, edit, view)
- ✅ Leases (create, edit, view)
- ✅ Tenants (create, edit, view)
- ✅ Emergency Contacts (all operations)

### CUSTOMER Role Access
- ❌ Properties (no access)
- ✅ Income (view only)
- ✅ Expenses (view only)
- ❌ Expense Types (no access)
- ✅ Leases (view only)
- ✅ Tenants (view only)
- ✅ Emergency Contacts (view only)

## 🎨 UI Features

- Beautiful gradient login page
- Loading spinner during authentication
- Error message display
- User info in top-right corner
- Dropdown menu with logout
- Role badge display
- Role-based navigation menu (shows/hides based on permissions)

## ⚙️ Backend Requirements

Your backend API needs to implement:

### 1. POST /api/auth/login
```typescript
Request Body: { username: string, password: string }
Response: { token: string, user: User }
```

### 2. JWT Token Generation
- Use a secure secret key
- Include user info in payload
- Set appropriate expiration (e.g., 24 hours)

### 3. Password Hashing
- Use bcrypt or Argon2
- Never store plain text passwords
- Minimum password strength requirements

### 4. Protected Endpoints
- Verify JWT token on each request
- Check `Authorization: Bearer <token>` header
- Return 401 for invalid/expired tokens

## 🧪 Testing Without Backend

### Option 1: Mock Service
Create a mock auth service for testing:

```typescript
// auth.service.mock.ts
export class MockAuthService {
  login(payload: LoginPayload): Observable<LoginResponse> {
    // Simulate API delay
    return of({
      token: 'mock-jwt-token',
      user: {
        id: 1,
        username: payload.username,
        email: 'test@example.com',
        role: UserRole.OWNER,
        firstName: 'Test',
        lastName: 'User'
      }
    }).pipe(delay(1000));
  }
}
```

### Option 2: JSON Server
Set up a quick mock API:
```bash
npm install -g json-server
json-server --watch db.json --port 3000
```

## 🐛 Troubleshooting

### Login button disabled?
- Check if username and password fields are filled
- Both fields are required

### Redirected to login after logging in?
- Check browser console for errors
- Verify token is stored: `localStorage.getItem('auth_token')`
- Check backend API is returning proper response format

### Can't access certain pages?
- Check your user role
- Some pages are restricted to OWNER role only
- Try accessing with different role

### Token not sent with API requests?
- Verify `authInterceptor` is registered in [app.config.ts](../src/app/app.config.ts)
- Check browser Network tab → Headers → Authorization

## 📚 Documentation

- [Full Authentication README](./authentication-readme.md)
- [Database Schema Documentation](./user-authentication-schema.md)

## 🔒 Security Best Practices

✅ **Implemented:**
- JWT token-based authentication
- Role-based access control
- HTTP interceptor for token management
- Route guards for protection

⚠️ **TODO for Production:**
- Implement token refresh mechanism
- Add token expiration handling
- Use httpOnly cookies instead of localStorage
- Implement rate limiting
- Add CSRF protection
- Enable HTTPS only
- Add session timeout warning
- Implement password reset flow
- Add 2FA (Two-Factor Authentication)

## 🎉 Next Steps

1. Set up your backend API with the required endpoints
2. Create user accounts in your database
3. Test login with different user roles
4. Customize the UI to match your branding
5. Add additional features (password reset, registration, etc.)

---

**Need Help?** Check the detailed documentation in `authentication-readme.md`
