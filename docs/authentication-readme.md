# Authentication System Documentation

## Overview

This rental portal application includes a complete role-based authentication system supporting two user roles: **OWNER** and **CUSTOMER**.

## Features

✅ User login with username/password  
✅ Role-based access control (OWNER/CUSTOMER)  
✅ JWT token-based authentication  
✅ Protected routes with auth guards  
✅ Automatic token injection in HTTP requests  
✅ User profile display with logout  
✅ Responsive login page  
✅ Role-based navigation menu  

## User Roles

### OWNER Role
- Full access to all property management features
- Can manage properties, income, expenses, and expense types
- Can manage tenants and leases
- Administrative privileges

### CUSTOMER Role
- Limited access to tenant-related features
- Can view income, expenses, leases, tenants, and emergency contacts
- Cannot create or edit properties or expense types

## File Structure

```
src/app/
├── components/
│   └── auth/
│       └── login/
│           ├── login.component.ts       # Login component logic
│           ├── login.component.html     # Login form UI
│           └── login.component.css      # Login page styling
├── core/
│   ├── models/
│   │   └── user.model.ts               # User, LoginPayload, LoginResponse models
│   ├── services/
│   │   └── auth.service.ts             # Authentication service
│   ├── guards/
│   │   └── auth.guard.ts               # Route protection guard
│   └── interceptors/
│       └── auth.interceptor.ts         # HTTP interceptor for tokens
└── docs/
    └── user-authentication-schema.md   # Database schema documentation
```

## How It Works

### 1. Login Process

1. User enters username and password on `/login` page
2. Frontend sends credentials to `POST /api/auth/login`
3. Backend validates credentials and returns JWT token + user info
4. Frontend stores token in localStorage
5. User is redirected based on role:
   - OWNER → `/property`
   - CUSTOMER → `/tenant`

### 2. Route Protection

Routes are protected using the `authGuard`:

```typescript
{ 
  path: 'property', 
  component: PropertyListComponent, 
  canActivate: [authGuard], 
  data: { role: UserRole.OWNER }  // Only owners can access
}
```

### 3. HTTP Requests

The `authInterceptor` automatically adds the JWT token to all API requests:

```typescript
Authorization: Bearer <token>
```

### 4. Logout

User can logout via the user menu in the top-right corner. This:
- Removes the token from localStorage
- Clears user session
- Redirects to `/login`

## Usage

### Testing the Login

To test the authentication system, you'll need:

1. **Backend API** running with these endpoints:
   - `POST /api/auth/login`
   - `POST /api/auth/register` (optional)

2. **Database** with users table (see [user-authentication-schema.md](./user-authentication-schema.md))

3. **Sample Users** in the database:
   ```sql
   -- Owner account
   INSERT INTO users (username, email, password_hash, role, first_name, last_name)
   VALUES ('owner', 'owner@rental.com', '<hashed-password>', 'OWNER', 'John', 'Smith');
   
   -- Customer account
   INSERT INTO users (username, email, password_hash, role, first_name, last_name)
   VALUES ('customer', 'customer@example.com', '<hashed-password>', 'CUSTOMER', 'Jane', 'Doe');
   ```

### Development Mode

If you don't have a backend yet, you can mock the API responses using:

1. **Angular In-Memory Web API** or
2. **JSON Server** with mock data

### Accessing Protected Routes

Once logged in:
- All routes (except `/login`) require authentication
- Owner-specific routes check for OWNER role
- Unauthorized access redirects to `/login`

## Security Considerations

⚠️ **Important Security Notes:**

1. **HTTPS Only**: Always use HTTPS in production
2. **Token Storage**: Tokens are stored in localStorage (consider httpOnly cookies for enhanced security)
3. **Token Expiration**: Implement token expiration and refresh logic in production
4. **Password Requirements**: Enforce strong passwords on the backend
5. **Rate Limiting**: Implement login rate limiting to prevent brute force attacks
6. **Input Validation**: Always validate user input on both frontend and backend

## Customization

### Adding More Roles

1. Update `UserRole` enum in [user.model.ts](../src/app/core/models/user.model.ts)
2. Add role checks in auth guard
3. Update navigation logic
4. Add role-specific routes

### Changing Redirect Logic

Modify the `redirectBasedOnRole()` method in [login.component.ts](../src/app/components/auth/login/login.component.ts):

```typescript
private redirectBasedOnRole(): void {
  const user = this.authService.getCurrentUser();
  if (user?.role === UserRole.OWNER) {
    this.router.navigate(['/dashboard']);  // Custom redirect
  }
  // ...
}
```

### Styling the Login Page

Edit [login.component.css](../src/app/components/auth/login/login.component.css) to match your branding.

## API Contract

### Login Request

```json
POST /api/auth/login
{
  "username": "owner",
  "password": "password123"
}
```

### Login Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "owner",
    "email": "owner@rental.com",
    "role": "OWNER",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1234567890"
  }
}
```

## Troubleshooting

### Login doesn't work
- Check browser console for errors
- Verify API endpoint is accessible
- Check CORS settings on backend
- Verify credentials are correct

### Routes not protected
- Ensure `authGuard` is imported and applied
- Check if user is properly logged in
- Verify token is stored in localStorage

### Token not sent with requests
- Check if `authInterceptor` is registered in `app.config.ts`
- Verify interceptor is not excluding your endpoints

## Next Steps

- [ ] Implement password reset functionality
- [ ] Add "Remember Me" option
- [ ] Implement token refresh mechanism
- [ ] Add user registration page
- [ ] Add user profile editing
- [ ] Implement 2FA (Two-Factor Authentication)
- [ ] Add session timeout warning
