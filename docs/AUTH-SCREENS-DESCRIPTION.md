# Authentication Screens Description

## Login Screen

**Purpose:** Authenticates existing users and provides access to the rental portal based on their role (Owner or Customer).

**Features:**
- Username and password input fields with validation
- "Remember me" functionality through token persistence in localStorage
- Role-based automatic redirection after successful login (Owners → Properties page, Customers → Properties page)
- Error handling with user-friendly messages for invalid credentials
- Navigation links to Signup and Forgot Password pages
- Responsive design with gradient background and centered card layout
- Form validation requiring both fields before submission

**User Flow:**
1. User enters username and password
2. System validates credentials against backend API (`POST /api/auth/login`)
3. On success, JWT token is stored in localStorage
4. User is redirected based on their role
5. On failure, error message displays below the form

**Technical Implementation:**
- Component: `LoginComponent`
- Location: `src/app/components/auth/login/`
- Service: `AuthService.login()`
- Route: `/login`
- API Endpoint: `POST /api/auth/login`
- Request Body: `{ username: string, password: string }`
- Response: `{ token: string, user: User }`

---

## Signup/Registration Screen

**Purpose:** Allows new users to create an account in the rental portal system.

**Features:**
- Comprehensive registration form with 7 fields:
  - Username (unique identifier, required)
  - Email (unique, validated format, required)
  - Password (required)
  - Confirm Password (must match password, required)
  - Role selection dropdown (Owner or Customer, required)
  - First Name (required)
  - Last Name (required)
  - Phone Number (optional)
- Password confirmation validation (ensures both passwords match)
- Real-time form validation for all required fields
- Email format validation
- Automatic login after successful registration (token stored)
- Navigation link back to Login page for existing users
- Same visual design as login (gradient background, centered card)
- Clear error messages for validation failures

**User Flow:**
1. User fills out all registration fields
2. System validates that password and confirm password match
3. System validates email format
4. Form submits to backend API (`POST /api/auth/register`)
5. On success, user is automatically logged in with JWT token
6. User is redirected to their role-specific dashboard
7. On failure (duplicate username/email), error message displays

**Technical Implementation:**
- Component: `SignupComponent`
- Location: `src/app/components/auth/signup/`
- Service: `AuthService.register()`
- Route: `/signup`
- API Endpoint: `POST /api/auth/register`
- Request Body: `{ username, email, password, role, firstName, lastName, phone }`
- Response: `{ token: string, user: User }`

---

## Forgot Password Screen

**Purpose:** Enables users to reset their password through a two-step verification process.

**Features:**
- **Two-step password reset process:**
  - **Step 1:** Email verification - validates that email exists in system
  - **Step 2:** Password reset - allows user to set new password
- Step indicator showing current progress (Step 1 of 2 / Step 2 of 2)
- Email validation before proceeding to password reset
- New password and confirmation fields in step 2
- Password matching validation
- Navigation link back to Login page
- Clean, intuitive interface with clear instructions
- Same visual design consistency (gradient background, centered card)
- Error handling for non-existent emails

**User Flow:**

**Step 1 - Email Verification:**
1. User enters their registered email address
2. System verifies email exists (`POST /api/auth/forgot-password`)
3. On verification success, Step 2 form appears
4. On failure, error message displays (email not found)

**Step 2 - Password Reset:**
1. User enters new password twice (confirmation)
2. System validates passwords match
3. Password is updated in database (`POST /api/auth/reset-password`)
4. Success message displays with option to return to login
5. User can log in with new credentials

**Technical Implementation:**
- Component: `ForgotPasswordComponent`
- Location: `src/app/components/auth/forgot-password/`
- Service: Direct HTTP calls via `HttpClient`
- Route: `/forgot-password`
- API Endpoints:
  - Step 1: `POST /api/auth/forgot-password` (Request: `{ email }`, Response: `{ message, email }`)
  - Step 2: `POST /api/auth/reset-password` (Request: `{ email, newPassword }`, Response: `{ message }`)

**Security Note:** Current implementation uses basic email verification. For production, implement email-based token verification (send reset link via email with expiring token).

---

## Common Features Across All Auth Screens

**Visual Design:**
- Consistent purple gradient backgrounds (`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`)
- Centered card layout with white background
- Professional, modern appearance
- Angular Material components (buttons, form fields, icons)
- Responsive design for mobile and desktop
- Smooth transitions and hover effects

**Technical Features:**
- SSR-compatible (no localStorage errors during server-side rendering)
- Platform detection using `isPlatformBrowser()` checks
- Integration with JWT token-based authentication system
- All screens use the same `AuthService` for API communication
- Form validation with error messages
- Loading states during API calls
- Navigation routing between auth pages

**Authentication Architecture:**
- JWT token stored in localStorage
- Token automatically injected in HTTP headers via `authInterceptor`
- Current user state managed via RxJS `BehaviorSubject`
- Route protection via `authGuard`
- Role-based access control (OWNER/CUSTOMER)

**API Integration:**
- Base URL: `http://localhost:3000/api`
- All auth endpoints: `/api/auth/*`
- Token format: `Bearer <jwt_token>`
- Error handling with status codes (401, 400, 404)

---

## File Locations

**Components:**
- Login: `src/app/components/auth/login/`
  - `login.component.ts`
  - `login.component.html`
  - `login.component.css`

- Signup: `src/app/components/auth/signup/`
  - `signup.component.ts`
  - `signup.component.html`
  - `signup.component.css`

- Forgot Password: `src/app/components/auth/forgot-password/`
  - `forgot-password.component.ts`
  - `forgot-password.component.html`
  - `forgot-password.component.css`

**Services:**
- Authentication Service: `src/app/core/services/auth.service.ts`

**Models:**
- User Models: `src/app/core/models/user.model.ts`

**Guards:**
- Auth Guard: `src/app/core/guards/auth.guard.ts`

**Interceptors:**
- Auth Interceptor: `src/app/core/interceptors/auth.interceptor.ts`

**Routes:**
- Route Configuration: `src/app/app.routes.ts`

---

## User Roles

**OWNER Role:**
- Full access to all portal features
- Can manage properties, tenants, leases, expenses, income
- Dashboard with comprehensive overview
- Financial reporting capabilities

**CUSTOMER Role:**
- Limited access to portal features
- Can view assigned properties
- Can view lease information
- Cannot modify property or financial data

---

## Future Enhancements

**Recommended for Production:**
1. **Email-based password reset** - Send reset link with expiring token via email
2. **Password strength indicator** - Visual feedback for password complexity
3. **Account email verification** - Verify email address during signup
4. **Multi-factor authentication (MFA)** - Add 2FA support
5. **Remember me checkbox** - Persistent login option
6. **Social login** - OAuth integration (Google, Microsoft, etc.)
7. **Password encryption** - Use bcrypt for password hashing in backend
8. **Session management** - Token refresh mechanism
9. **Login attempt limiting** - Rate limiting and account lockout
10. **Security questions** - Additional verification for password reset

---

## Testing Credentials

**For Backend Testing:**

```javascript
// Admin User (OWNER)
{
  "username": "admin",
  "password": "admin123"
}

// Owner User
{
  "username": "owner1",
  "password": "owner123"
}

// Customer User
{
  "username": "customer1",
  "password": "customer123"
}
```

---

## End of Authentication Screens Description
