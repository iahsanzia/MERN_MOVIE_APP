# Vercel Deployment Configuration - Implementation Summary

## Files Created/Modified

### New Files

1. **`backend/api/index.ts`** - Vercel serverless function entry point
   - Exports your Express app for Vercel to handle as a serverless function
2. **`vercel.json`** - Root deployment configuration
   - Configures monorepo build process
   - Routes API requests to backend serverless function
   - Serves frontend as static files
   - Defines environment variables needed

3. **`package.json`** (root) - Monorepo configuration
   - Adds `build:all` script that builds both backend and frontend
   - Configures workspace structure

4. **`backend/.env.example`** - Template for backend environment variables
   - Documents all required backend environment variables
5. **`DEPLOYMENT.md`** - Complete deployment guide
   - Step-by-step instructions for deploying to Vercel
   - Environment variable setup
   - Troubleshooting tips

### Modified Files

1. **`backend/src/server.ts`** - Updated to work with serverless
   - Only listens on a port locally (checks for VERCEL_ENV)
   - Doesn't listen when running as a Vercel serverless function

2. **`frontend/.env.production`** - Production environment config
   - Sets API URL for production (needs to be updated with your Vercel domain)

3. **`.gitignore`** - Added `.env` to excluded files
   - Ensures no .env files are committed to Git

## How It Works

### Local Development

```bash
npm run dev:backend    # Runs backend on port 5000
npm run dev:frontend   # Runs frontend on port 3000
```

### Production (Vercel)

- Frontend builds to static files → served directly
- Backend compiles to JS → runs as serverless functions at `/api/*`
- CORS is configured to accept requests from your Vercel frontend domain
- Database connection is established through environment variables

## Next Steps

1. **Test Local Build**

   ```bash
   npm run build:all
   ```

2. **Push to GitHub**
   - Ensure .env files are NOT committed
   - Push all other files

3. **Deploy to Vercel**
   - Import project from GitHub
   - Set environment variables in Vercel dashboard
   - Deploy

4. **Update `.env.production`**
   - After first deployment, update `REACT_APP_API_URL` with your actual Vercel domain
   - Redeploy

## Environment Variables Checklist

Before deploying, have these ready:

### Backend (in Vercel dashboard)

- [ ] MongoDB Atlas connection string
- [ ] JWT secret (generate a random strong key)
- [ ] TMDB API key
- [ ] TMDB bearer token
- [ ] Your Vercel project URL for FRONTEND_URL

### Frontend (automatic from .env.production)

- [ ] REACT_APP_API_URL (update after getting Vercel domain)
- [ ] REACT_APP_TMDB_API_KEY

## Architecture

```
MERN Movie App (Vercel)
├── Frontend (React)
│   ├── Static files served from root (/)
│   ├── React Router handles frontend routing
│   └── Calls /api/* routes for backend
│
├── Backend (Express)
│   ├── Runs as serverless functions at /api/*
│   ├── Handles authentication, database queries
│   ├── CORS configured for frontend domain
│   └── Connects to MongoDB Atlas
│
└── Database
    └── MongoDB Atlas (cloud-hosted)
```

## Key Configuration Points

1. **CORS** - Configured in `backend/src/app.ts` to accept requests from FRONTEND_URL
2. **Routes** - `vercel.json` rewrites `/api/*` to backend serverless function
3. **Build** - Root `package.json` orchestrates building both apps
4. **Environment** - Variables passed to backend, production env file used for frontend build

See `DEPLOYMENT.md` for detailed instructions.
