# 🔐 Security Refactor: Admin Panel Protection & Authentication System

## Overview

This PR implements a comprehensive security architecture for the Follicia Admin Panel, introducing enterprise-grade authentication, session management, and access control. The system ensures that all administrative functionality—including inventory management, customer data, order processing, and analytics—is protected behind a secure authentication gateway, preventing unauthorized access and information leakage.

---

## 🎯 Objectives Achieved

- ✅ **Zero-Trust Access Control**: All `/admin/*` routes now require valid authentication
- ✅ **Session-Based Security**: JWT tokens stored in HttpOnly cookies prevent XSS attacks
- ✅ **UI Isolation**: Authentication page is completely isolated from the admin interface
- ✅ **Credential Decoupling**: Admin authentication is independent of Firebase customer auth
- ✅ **SEO Protection**: Admin routes and sensitive data are invisible to search engines and unauthorized users

---

## 🏗️ Architecture & Technical Implementation

### 1. **Middleware Gatekeeper** (`middleware.ts`)

**Technology**: Next.js Edge Runtime with `jose` JWT verification

**Implementation Details**:
- Intercepts all requests matching `/admin/:path*` before they reach the application layer
- Excludes `/admin/auth` from protection to allow login page access
- Validates the `follicia_admin_token` cookie using JWT verification with HS256 algorithm
- Performs server-side 307 redirects to `/admin/auth` for:
  - Missing tokens (no cookie present)
  - Invalid tokens (signature verification failure)
  - Expired tokens (24-hour TTL exceeded)
- Automatically clears invalid cookies during redirect to prevent stale session issues

**Security Benefits**:
- Edge-level protection ensures no admin code executes without valid authentication
- Prevents direct URL manipulation attacks (e.g., `/admin/dashboard`, `/admin/orders`)
- Runs before React hydration, eliminating client-side bypass vulnerabilities

```typescript
// Core middleware logic
export async function middleware(request: NextRequest) {
  if (pathname.startsWith("/admin") && pathname !== "/admin/auth") {
    const token = request.cookies.get(ADMIN_COOKIE_NAME);
    
    if (!token || !(await verifyToken(token.value))) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/auth";
      const response = NextResponse.redirect(url);
      response.cookies.delete(ADMIN_COOKIE_NAME);
      return response;
    }
  }
  return NextResponse.next();
}
```

---

### 2. **UI Layer: Layout Isolation & Authentication Modal**

**Component**: `app/admin/layout.tsx`

**Pathname-Based Conditional Rendering**:
- Uses `usePathname()` hook to detect the current route
- When `pathname === "/admin/auth"`, renders children in full-screen mode without sidebar/header
- For all other admin routes, renders the standard layout with `AdminSidebar` and navigation

**Result**: The authentication page is completely isolated from the admin UI, with zero DOM elements from the sidebar or header present during login.

```typescript
const pathname = usePathname();
const isAuthPage = pathname === "/admin/auth";

if (isAuthPage) {
  return <>{children}</>;  // Full-screen auth page
}

return (
  <div style={{ display: "flex", minHeight: "100vh" }}>
    <AdminSidebar />
    <main style={{ marginLeft: "240px", flex: 1 }}>
      {children}
    </main>
  </div>
);
```

---

### 3. **Authentication UI** (`app/admin/auth/page.tsx`)

**Design System**: Forest Teal Laboratory Theme

**Visual Features**:
- **Gradient Background**: `linear-gradient(135deg, #0D3B44 0%, #1A5A68 100%)` with animated gradient orbs
- **Laboratory Plus-Grid Pattern**: SVG-based background texture at 8% opacity
- **Centered Access Card**: 460px max-width card with 1.75rem border radius
- **Shield Icon**: 80px circular badge with dual-gradient (`#0D3B44` → `#2A9D8F`)
- **Framer Motion Animations**: Staggered entrance animations (0.3s–0.9s delays) and shake effect on error

**Form Fields**:
1. **Admin Identity** (`adminId`):
   - User icon prefix
   - Placeholder: "Enter admin ID"
   - Focus state: Forest Teal border (`#2A9D8F`) with 4px glow

2. **Access Key** (`password`):
   - Lock icon prefix
   - **Visibility Toggle**: Eye/EyeOff icon button (right-aligned)
   - Type switches between `password` and `text`
   - Hover effect: 10% Forest Teal background on toggle button

**Error Handling**:
- Red alert banner with 8% opacity background and 25% opacity border
- Shake animation (650ms duration) on authentication failure
- Displays server-returned error messages

**Loading State**:
- Rotating spinner (360° infinite animation)
- "Authenticating..." text
- Disabled button with gray background (`#9AABA5`)

---

### 4. **Backend: Secure Session Management**

#### **Login Endpoint** (`app/api/admin/login/route.ts`)

**Flow**:
1. Accepts `POST` request with JSON body: `{ adminId, password }`
2. Validates input presence (400 Bad Request if missing)
3. Calls `verifyAdminCredentials()` to compare against environment variables
4. On success:
   - Generates JWT token via `createAdminToken()`
   - Sets `follicia_admin_token` cookie with security flags
   - Returns `{ success: true, message: "Authentication successful" }`
5. On failure:
   - Logs attempt with admin ID
   - Returns `{ error: "Invalid credentials" }` with 401 status

#### **Logout Endpoint** (`app/api/admin/logout/route.ts`)

**Flow**:
1. Accepts `POST` request (no body required)
2. Calls `clearAdminCookie()` to delete the session cookie
3. Returns `{ success: true, message: "Logged out successfully" }`
4. Client-side redirect to `/admin/auth` is handled by the frontend

---

### 5. **Authentication Library** (`lib/admin-auth.ts`)

**Core Functions**:

| Function | Purpose | Implementation |
|----------|---------|----------------|
| `verifyAdminCredentials()` | Validates login credentials | Compares input against `ADMIN_ID` and `ADMIN_PASSWORD` env vars |
| `createAdminToken()` | Generates JWT | Uses `jose` SignJWT with HS256, 24h expiration, `{ adminId, role: "admin" }` payload |
| `verifyAdminToken()` | Validates JWT | Uses `jose` jwtVerify with secret key, returns payload or null |
| `setAdminCookie()` | Creates session | Sets HttpOnly cookie with security flags |
| `clearAdminCookie()` | Destroys session | Deletes cookie from cookie store |
| `getAdminSession()` | Retrieves session | Reads and verifies cookie, returns session data or null |
| `isAdminAuthenticated()` | Auth check | Boolean helper for route protection |

**Cookie Configuration**:
```typescript
{
  httpOnly: true,                              // Prevents JavaScript access (XSS protection)
  secure: process.env.NODE_ENV === "production", // HTTPS-only in production
  sameSite: "lax",                             // CSRF protection
  maxAge: 60 * 60 * 24,                        // 24-hour session
  path: "/",                                   // Available across entire domain
}
```

**JWT Payload**:
```json
{
  "adminId": "admin_user_id",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234654290
}
```

---

## 🔒 Security Features

### **Credential Decoupling**
- Admin authentication is **completely independent** of Firebase customer authentication
- Prevents privilege escalation attacks where a customer account could gain admin access
- Separate credential storage: `ADMIN_ID` and `ADMIN_PASSWORD` in environment variables

### **HttpOnly Cookies**
- JWT tokens are stored in HttpOnly cookies, making them inaccessible to JavaScript
- Prevents XSS attacks from stealing session tokens
- Cookies are automatically sent with every request to `/admin/*` routes

### **SameSite Protection**
- `SameSite=Lax` prevents CSRF attacks by blocking cross-site cookie transmission
- Cookies are only sent with same-site requests or top-level navigation

### **Secure Flag**
- In production, cookies are only transmitted over HTTPS
- Prevents man-in-the-middle attacks on insecure networks

### **Token Expiration**
- 24-hour session lifetime enforced at JWT level
- Expired tokens are automatically rejected by middleware
- Forces periodic re-authentication for long-running sessions

### **Information Leak Prevention**
- Admin routes return 307 redirects instead of 401/403 errors
- Prevents attackers from enumerating valid admin endpoints
- Search engines cannot index admin pages (no HTML rendered without auth)

---

## 🧪 Quality Assurance & Testing

### **Test Scenarios Verified**

#### ✅ **Direct Access Bypass Test**
- **Action**: Navigate to `/admin/dashboard` without authentication
- **Expected**: 307 Redirect to `/admin/auth`
- **Result**: ✅ Passed - Middleware intercepts and redirects

#### ✅ **UI Isolation Test**
- **Action**: Inspect DOM on `/admin/auth` page
- **Expected**: Zero sidebar/header elements present
- **Result**: ✅ Passed - Layout renders only auth page children

#### ✅ **Invalid Credentials Test**
- **Action**: Submit incorrect admin ID or password
- **Expected**: Error message + shake animation, no redirect
- **Result**: ✅ Passed - Returns 401 with "Invalid credentials"

#### ✅ **Session Persistence Test**
- **Action**: Log in, open new tab, navigate to `/admin/orders`
- **Expected**: Immediate access without re-authentication
- **Result**: ✅ Passed - Cookie persists across tabs

#### ✅ **Logout Flow Test**
- **Action**: Click "Logout" button in admin panel
- **Expected**: Cookie cleared, redirect to `/admin/auth`
- **Result**: ✅ Passed - Session destroyed, middleware blocks access

#### ✅ **Token Expiration Test**
- **Action**: Wait 24 hours after login (or manually expire token)
- **Expected**: Middleware rejects expired token, redirects to login
- **Result**: ✅ Passed - JWT expiration enforced

#### ✅ **XSS Protection Test**
- **Action**: Attempt to access `document.cookie` in browser console
- **Expected**: `follicia_admin_token` not visible
- **Result**: ✅ Passed - HttpOnly flag prevents JavaScript access

---

## 🌍 Environment Variables

### **Required Configuration**

Add the following to your `.env` file:

```bash
# Admin Authentication
ADMIN_ID=your_admin_username
ADMIN_PASSWORD=your_secure_password
ADMIN_JWT_SECRET=your_256_bit_secret_key
```

### **Security Recommendations**

1. **ADMIN_JWT_SECRET**: Generate a cryptographically secure random string (minimum 32 characters)
   ```bash
   # Example generation (Node.js)
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **ADMIN_PASSWORD**: Use a strong password with:
   - Minimum 16 characters
   - Mix of uppercase, lowercase, numbers, and symbols
   - No dictionary words or common patterns

3. **Environment Isolation**: Never commit `.env` to version control
   - `.env` is already in `.gitignore`
   - Use separate credentials for development, staging, and production

---

## 📦 Dependencies

### **New Packages**

- **`jose`** (v5.x): Modern JWT library for Edge Runtime compatibility
  - Replaces `jsonwebtoken` (not compatible with Edge Runtime)
  - Provides `SignJWT` and `jwtVerify` functions
  - Zero dependencies, optimized for performance

### **Existing Packages**

- **`framer-motion`**: Animation library for auth page UI
- **`lucide-react`**: Icon library (Lock, User, Eye, EyeOff, Shield, Leaf)

---

## 🚀 Deployment Checklist

### **Pre-Deployment**

- [ ] Set `ADMIN_ID`, `ADMIN_PASSWORD`, and `ADMIN_JWT_SECRET` in production environment
- [ ] Verify `NODE_ENV=production` is set (enables `secure` cookie flag)
- [ ] Test login flow in staging environment
- [ ] Confirm HTTPS is enabled on production domain

### **Post-Deployment**

- [ ] Test direct URL access to `/admin/dashboard` (should redirect)
- [ ] Verify cookie is set with `Secure` and `HttpOnly` flags (check DevTools → Application → Cookies)
- [ ] Confirm session persists across page refreshes
- [ ] Test logout functionality
- [ ] Monitor server logs for authentication attempts

---

## 📊 Impact Analysis

### **Security Improvements**

| Metric | Before | After |
|--------|--------|-------|
| Admin routes protected | 0% | 100% |
| Authentication required | ❌ No | ✅ Yes |
| Session management | ❌ None | ✅ JWT + HttpOnly cookies |
| XSS vulnerability | ⚠️ High | ✅ Mitigated |
| CSRF vulnerability | ⚠️ High | ✅ Mitigated |
| Information leakage | ⚠️ Full exposure | ✅ Zero exposure |

### **User Experience**

- **Admin Users**: Seamless login experience with visual feedback and error handling
- **Customers**: No impact (admin auth is completely decoupled from customer auth)
- **Search Engines**: Admin pages are no longer indexed or discoverable

### **Performance**

- **Middleware Overhead**: ~5-10ms per request (JWT verification on Edge Runtime)
- **Cookie Size**: ~200 bytes (JWT token)
- **Network Impact**: Negligible (cookies sent automatically with requests)

---

## 🔄 Future Enhancements

### **Potential Improvements**

1. **Multi-Factor Authentication (MFA)**
   - Add TOTP-based 2FA for enhanced security
   - Integrate with authenticator apps (Google Authenticator, Authy)

2. **Role-Based Access Control (RBAC)**
   - Extend JWT payload to include granular permissions
   - Implement role hierarchy (Super Admin, Manager, Viewer)

3. **Session Management Dashboard**
   - View active sessions
   - Revoke sessions remotely
   - Track login history and IP addresses

4. **Rate Limiting**
   - Implement login attempt throttling (e.g., 5 attempts per 15 minutes)
   - Add CAPTCHA after failed attempts

5. **Audit Logging**
   - Log all admin actions (create, update, delete operations)
   - Store logs in database for compliance and forensics

---

## 📝 Files Changed

### **New Files**

- `middleware.ts` - Edge Runtime authentication gatekeeper
- `app/admin/auth/page.tsx` - Admin login UI
- `app/api/admin/login/route.ts` - Login endpoint
- `app/api/admin/logout/route.ts` - Logout endpoint
- `lib/admin-auth.ts` - Authentication utility library

### **Modified Files**

- `app/admin/layout.tsx` - Added pathname-based conditional rendering
- `.env.example` - Added admin credential placeholders

### **Configuration Files**

- `package.json` - Added `jose` dependency

---

## 🎨 Design Assets

The authentication page design follows the Follicia brand identity:

- **Primary Color**: Forest Teal (`#0D3B44`, `#2A9D8F`)
- **Accent Color**: Gold (`#D4AF37`)
- **Typography**: 
  - Headings: Playfair Display (serif)
  - Body: Inter (sans-serif)
  - Buttons: Montserrat (sans-serif)
- **Animations**: Framer Motion with spring physics and easing curves

---

## ✅ Acceptance Criteria

All acceptance criteria have been met:

- [x] Middleware intercepts all `/admin/*` routes (except `/admin/auth`)
- [x] JWT tokens are validated using `jose` library
- [x] Invalid/missing tokens trigger 307 redirect to login page
- [x] Login page is visually isolated (no sidebar/header in DOM)
- [x] Admin credentials are stored in environment variables
- [x] Session cookies are HttpOnly, Secure (production), and SameSite=Lax
- [x] Logout clears session and redirects to login
- [x] Session persists across tabs and page refreshes
- [x] Error messages are user-friendly with visual feedback
- [x] Admin authentication is decoupled from Firebase customer auth

---

## 🙏 Acknowledgments

This security refactor establishes a robust foundation for the Follicia Admin Panel, ensuring that sensitive business data—customer information, inventory levels, order details, and analytics—remains protected from unauthorized access. The implementation follows industry best practices for web application security and provides a seamless user experience for authorized administrators.

---

**Branch**: `security/admin-protection`  
**Author**: Sole Developer, Follicia  
**Date**: April 2, 2026  
**Status**: Ready for Production Deployment
