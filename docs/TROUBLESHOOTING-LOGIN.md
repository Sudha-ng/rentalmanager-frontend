# Login Error Troubleshooting Guide

## Why Am I Getting "Invalid Username or Password"?

The login error you're seeing is most likely because **the backend server is not running**. Here's what's happening:

### The Issue
- Your Angular frontend is trying to connect to: `http://localhost:8090/api/auth/login`
- The backend server needs to be running on port **8090**
- If the server isn't running, you'll get connection errors

### Check the Error Message
The login page now shows better error messages:

- **"Cannot connect to server. Please ensure the backend is running on http://localhost:8090"**
  - This means the backend server is not running or not accessible

- **"Login endpoint not found. Check backend API configuration."**
  - The backend is running but the `/api/auth/login` endpoint doesn't exist

- **"Invalid username or password"**
  - The backend is working, but your credentials are wrong

## Solutions

### Option 1: Start Your Backend Server (Recommended)
If you have a backend project:

1. Navigate to your backend project folder
2. Start the backend server on port **8090**
3. Ensure it has the `/api/auth/login` endpoint

Example for Spring Boot:
```bash
cd path/to/backend
./mvnw spring-boot:run
```

Example for Node.js/Express:
```bash
cd path/to/backend
npm start
```

### Option 2: Change the Backend Port
If your backend runs on a different port (e.g., 3000, 5000, 8080):

1. Open [`proxy.conf.json`](../proxy.conf.json)
2. Change the port number:
```json
{
  "/api": {
    "target": "http://localhost:YOUR_PORT_HERE",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```
3. Restart the Angular dev server

### Option 3: Use Mock Authentication (Testing Only)
For testing without a backend, you can temporarily mock the auth service:

1. Open `src/app/core/services/auth.service.ts`
2. Temporarily replace the `login` method with:

```typescript
login(payload: LoginPayload): Observable<LoginResponse> {
  // Mock response for testing
  return of({
    token: 'mock-jwt-token',
    user: {
      id: 1,
      username: payload.username,
      email: 'test@example.com',
      role: UserRole.OWNER,
      firstName: 'Test',
      lastName: 'User',
      phone: '1234567890',
      isActive: true
    }
  }).pipe(
    delay(1000), // Simulate network delay
    tap(response => {
      this.setSession(response);
      this.currentUserSubject.next(response.user);
    })
  );
}
```

**Note:** Remember to remove this mock code once your backend is ready!

## Backend API Requirements

Your backend needs to implement these endpoints:

### POST /api/auth/login
**Request:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "OWNER",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890",
    "isActive": true
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Invalid username or password"
}
```

For complete backend API specifications, see:
- [Backend API Guide](./backend-api-guide.md)
- [Backend API Specification](./BACKEND-API-SPECIFICATION.md)

## Testing the Backend Connection

### 1. Check if Backend is Running
Open your browser or use curl:
```bash
curl http://localhost:8090/api/auth/login
```

If you get a response (even an error), the backend is reachable!

### 2. Check Browser Console
Open Developer Tools (F12) → Console tab and look for:
- Network errors
- CORS errors
- 404 errors
- Connection refused errors

### 3. Check Network Tab
Developer Tools (F12) → Network tab → Try to login:
- Look for the `/api/auth/login` request
- Check the status code (0, 404, 401, 500, etc.)
- Check the response

## Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| Status: 0 | Backend not running | Start backend server |
| Status: 404 | Endpoint doesn't exist | Check backend routes |
| Status: 401 | Wrong credentials | Check username/password |
| Status: 500 | Backend error | Check backend logs |
| CORS Error | CORS not configured | Add CORS headers in backend |

## Need More Help?

1. Check the backend server logs
2. Ensure port 8090 is not blocked by firewall
3. Verify the backend database is running
4. Check the proxy configuration in `proxy.conf.json`
5. Restart both frontend and backend servers

## New Features Added

✅ **Show/Hide Password Toggle**
- Click the eye icon to show or hide your password
- Available on both login and signup pages
- Makes it easier to verify you typed correctly

✅ **Better Error Messages**
- More specific error messages based on the type of failure
- Console logging for debugging
- Clearer indication of what went wrong
